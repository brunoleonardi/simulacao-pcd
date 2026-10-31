export type ZonaId = "centro" | "norte" | "sul" | "leste" | "oeste";

export type NivelIndicador = "alto" | "medio" | "baixo";

export type ZonaValendor = {
  id: ZonaId;
  nome: string;
  suporte: NivelIndicador;
  atrasos: NivelIndicador;
  capacitacao: NivelIndicador;
};

/** Cidade fictícia inspirada em layout metropolitano — dados educativos. */
export const ZONAS_VALENDOR: ZonaValendor[] = [
  {
    id: "centro",
    nome: "Zona Centro",
    suporte: "alto",
    atrasos: "baixo",
    capacitacao: "medio",
  },
  {
    id: "leste",
    nome: "Zona Leste",
    suporte: "medio",
    atrasos: "alto",
    capacitacao: "medio",
  },
  {
    id: "norte",
    nome: "Zona Norte",
    suporte: "medio",
    atrasos: "medio",
    capacitacao: "baixo",
  },
  {
    id: "sul",
    nome: "Zona Sul",
    suporte: "baixo",
    atrasos: "medio",
    capacitacao: "alto",
  },
  {
    id: "oeste",
    nome: "Zona Oeste",
    suporte: "baixo",
    atrasos: "baixo",
    capacitacao: "baixo",
  },
];

/** Cores “de painel” — confundíveis sob simulação de deuteranopia. */
export const COR_SUPORTE: Record<NivelIndicador, string> = {
  alto: "#16a34a",
  medio: "#84cc16",
  baixo: "#bbf7d0",
};

export const COR_ATRASOS: Record<NivelIndicador, string> = {
  alto: "#dc2626",
  medio: "#f97316",
  baixo: "#fecaca",
};

export const COR_CAPACITACAO: Record<NivelIndicador, string> = {
  alto: "#7c3aed",
  medio: "#a855f7",
  baixo: "#ddd6fe",
};

export const RESPOSTAS_ESPERADAS = {
  maiorSuporte: "centro" as ZonaId,
  maiorAtrasos: "leste" as ZonaId,
  capacitacaoCritica: "sul" as ZonaId,
};
