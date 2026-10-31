export type DaltonismoTipo = "nenhum" | "protanopia" | "deuteranopia" | "tritanopia";

export const DALTONISMO_OPCOES: {
  id: DaltonismoTipo;
  label: string;
  descricao: string;
}[] = [
  {
    id: "protanopia",
    label: "Protanopia",
    descricao:
      "Mesmas prioridades: cores distintas na visão típica, mais parecidas na simulação Machado.",
  },
  {
    id: "deuteranopia",
    label: "Deuteranopia",
    descricao:
      "Mesmas prioridades: cores distintas na visão típica, mais parecidas na simulação Machado.",
  },
  {
    id: "tritanopia",
    label: "Tritanopia",
    descricao:
      "Mesmas prioridades: azuis e amarelos distintos na visão típica, mais parecidos na simulação Brettel (1997).",
  },
];

/**
 * Matrizes 3×3 (severidade 1.0 / dicromacia) de Machado, Oliveira & Fernandes, 2009.
 * Mesmos coeficientes usados no Chromium para simulação de DCV (feColorMatrix + linear RGB).
 * Ref.: https://developer.chrome.com/docs/chromium/cvd
 */
const MACHADO_DICHROMACY: Record<
  "protanopia" | "deuteranopia",
  [number, number, number][]
> = {
  protanopia: [
    [0.152286, 1.053391, -0.205676],
    [0.118082, 0.878453, -0.031442],
    [0.012841, 0.036898, 0.960254],
  ],
  deuteranopia: [
    [0.367322, 0.860646, -0.227968],
    [0.280085, 0.672501, 0.047413],
    [-0.01182, 0.04294, 0.968881],
  ],
};

/**
 * Brettel, Viénot & Mollon (1997) — tritanopia (libDaltonLens, Smith–Pokorny + sRGB).
 * Duas matrizes conforme o semiplano de separação.
 */
const BRETTEL_1997_TRITAN = {
  rgbCvdFromRgb1: [
    1.01277, 0.13548, -0.14826, -0.01243, 0.86812, 0.14431, 0.07589, 0.805, 0.11911,
  ] as const,
  rgbCvdFromRgb2: [
    0.93678, 0.18979, -0.12657, 0.06154, 0.81526, 0.1232, -0.37562, 1.12767, 0.24796,
  ] as const,
  separationPlaneNormalInRgb: [0.03901, -0.02788, -0.01113] as const,
};

/** 4×5 para feColorMatrix (alpha identidade). Protan/deuter: Machado; tritan usa filtro SVG composto. */
export const COLOR_MATRIX: Record<"protanopia" | "deuteranopia", string> = {
  protanopia: matrixToFeColorMatrixString(MACHADO_DICHROMACY.protanopia),
  deuteranopia: matrixToFeColorMatrixString(MACHADO_DICHROMACY.deuteranopia),
};

export function rotuloSimulacaoPerfil(
  perfil: Exclude<DaltonismoTipo, "nenhum">,
): string {
  return perfil === "tritanopia"
    ? "Brettel et al. (1997)"
    : "Machado (2009)";
}

function matrixToFeColorMatrixString(rows: [number, number, number][]): string {
  const [r, g, b] = rows;
  return [
    ...r,
    0,
    0,
    ...g,
    0,
    0,
    ...b,
    0,
    0,
    0,
    0,
    1,
    0,
  ]
    .map((n) => n.toFixed(6))
    .join(" ");
}

function parseHex(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

function toHex(r: number, g: number, b: number): string {
  const clamp = (n: number) =>
    Math.max(0, Math.min(255, Math.round(n)))
      .toString(16)
      .padStart(2, "0");
  return `#${clamp(r)}${clamp(g)}${clamp(b)}`;
}

function srgbChannelToLinear(channel255: number): number {
  const c = channel255 / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function linearChannelToSrgb(linear: number): number {
  const c =
    linear <= 0.0031308 ? linear * 12.92 : 1.055 * linear ** (1 / 2.4) - 0.055;
  return Math.max(0, Math.min(255, c * 255));
}

function applyMachadoMatrix(
  r: number,
  g: number,
  b: number,
  tipo: "protanopia" | "deuteranopia",
): [number, number, number] {
  const m = MACHADO_DICHROMACY[tipo];
  const lr = r * m[0][0] + g * m[0][1] + b * m[0][2];
  const lg = r * m[1][0] + g * m[1][1] + b * m[1][2];
  const lb = r * m[2][0] + g * m[2][1] + b * m[2][2];
  return [
    Math.max(0, Math.min(1, lr)),
    Math.max(0, Math.min(1, lg)),
    Math.max(0, Math.min(1, lb)),
  ];
}

function applyBrettel1997TritanMatrix(
  r: number,
  g: number,
  b: number,
  severity = 1,
): [number, number, number] {
  const n = BRETTEL_1997_TRITAN.separationPlaneNormalInRgb;
  const dot = r * n[0] + g * n[1] + b * n[2];
  const m =
    dot >= 0
      ? BRETTEL_1997_TRITAN.rgbCvdFromRgb1
      : BRETTEL_1997_TRITAN.rgbCvdFromRgb2;
  const lr = m[0] * r + m[1] * g + m[2] * b;
  const lg = m[3] * r + m[4] * g + m[5] * b;
  const lb = m[6] * r + m[7] * g + m[8] * b;
  return [
    Math.max(0, Math.min(1, lr * severity + r * (1 - severity))),
    Math.max(0, Math.min(1, lg * severity + g * (1 - severity))),
    Math.max(0, Math.min(1, lb * severity + b * (1 - severity))),
  ];
}

/** Mesma pipeline dos filtros SVG: sRGB → linear → simulação → sRGB. */
export function simularCorHex(
  hex: string,
  tipo: Exclude<DaltonismoTipo, "nenhum">,
): string {
  const [r8, g8, b8] = parseHex(hex);
  const r = srgbChannelToLinear(r8);
  const g = srgbChannelToLinear(g8);
  const b = srgbChannelToLinear(b8);
  const [lr, lg, lb] =
    tipo === "tritanopia"
      ? applyBrettel1997TritanMatrix(r, g, b)
      : applyMachadoMatrix(r, g, b, tipo);
  return toHex(
    linearChannelToSrgb(lr),
    linearChannelToSrgb(lg),
    linearChannelToSrgb(lb),
  );
}

export type PerfilDaltonismo = Exclude<DaltonismoTipo, "nenhum">;

/** `oficial` = OrRd dos dados; `visao-tipica` = estímulo sem Machado; demais = simulação. */
export type PerfilVisualMapa =
  | "oficial"
  | "visao-tipica"
  | PerfilDaltonismo;

export function filtroCssDaltonismo(
  perfil: PerfilDaltonismo,
): { filter: string } {
  return { filter: `url(#filter-${perfil})` };
}
