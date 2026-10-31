import fs from "fs";
import path from "path";

const FAIXAS = [
  "estavel",
  "monitoramento",
  "reforco",
  "atencao",
  "urgente",
  "critico",
];

const COR_PRIORIDADE_MAPA = {
  estavel: "#fef0d9",
  monitoramento: "#fdcc8a",
  reforco: "#fc8d59",
  atencao: "#ef6548",
  urgente: "#d7301f",
  critico: "#7f0000",
};

const RANK = { baixo: 0, medio: 1, alto: 2 };
const PONTOS_MAX = 14;

function faixaMapaFromIndicadores({ suporte, atrasos, capacitacao }) {
  const pontos =
    RANK[suporte] * 2 + RANK[atrasos] * 3 + RANK[capacitacao] * 2;
  const idx = Math.min(
    FAIXAS.length - 1,
    Math.round((pontos / PONTOS_MAX) * (FAIXAS.length - 1)),
  );
  return FAIXAS[idx];
}

/** nome MDC → indicadores (espelha src/lib/mapa-sp-subprefeituras.ts) */
const POR_NOME = {
  Sé: { id: "se", suporte: "alto", atrasos: "baixo", capacitacao: "medio" },
  Mooca: { id: "mooca", suporte: "medio", atrasos: "medio", capacitacao: "baixo" },
  Penha: { id: "penha", suporte: "medio", atrasos: "alto", capacitacao: "medio" },
  Itaquera: { id: "itaquera", suporte: "alto", atrasos: "alto", capacitacao: "alto" },
  "São Mateus": { id: "sao-mateus", suporte: "baixo", atrasos: "medio", capacitacao: "medio" },
  "Capela do Socorro": { id: "capela-do-socorro", suporte: "baixo", atrasos: "medio", capacitacao: "alto" },
  Parelheiros: { id: "parelheiros", suporte: "baixo", atrasos: "medio", capacitacao: "medio" },
  "Campo Limpo": { id: "campo-limpo", suporte: "baixo", atrasos: "medio", capacitacao: "medio" },
  "Santo Amaro": { id: "santo-amaro", suporte: "medio", atrasos: "baixo", capacitacao: "medio" },
  "Vila Mariana": { id: "vila-mariana", suporte: "medio", atrasos: "baixo", capacitacao: "medio" },
  Ipiranga: { id: "ipiranga", suporte: "medio", atrasos: "medio", capacitacao: "medio" },
  Jabaquara: { id: "jabaquara", suporte: "medio", atrasos: "baixo", capacitacao: "baixo" },
  "Cidade Ademar": { id: "cidade-ademar", suporte: "baixo", atrasos: "medio", capacitacao: "medio" },
  "M'Boi Mirim": { id: "mboi-mirim", suporte: "baixo", atrasos: "baixo", capacitacao: "medio" },
  Butantã: { id: "butanta", suporte: "medio", atrasos: "baixo", capacitacao: "baixo" },
  Pinheiros: { id: "pinheiros", suporte: "medio", atrasos: "baixo", capacitacao: "baixo" },
  Lapa: { id: "lapa", suporte: "medio", atrasos: "medio", capacitacao: "baixo" },
  "Casa Verde": { id: "casa-verde", suporte: "medio", atrasos: "medio", capacitacao: "baixo" },
  "Freguesia do Ó/Brasilândia": { id: "freguesia-do-o-brasilandia", suporte: "medio", atrasos: "medio", capacitacao: "baixo" },
  "Jaçanã/Tremembé": { id: "jacana-tremembe", suporte: "baixo", atrasos: "medio", capacitacao: "baixo" },
  Perus: { id: "perus", suporte: "baixo", atrasos: "medio", capacitacao: "baixo" },
  "Pirituba/Jaraguá": { id: "pirituba-jaragua", suporte: "baixo", atrasos: "baixo", capacitacao: "baixo" },
  "Santana/Tucuruvi": { id: "santana-tucuruvi", suporte: "medio", atrasos: "medio", capacitacao: "baixo" },
  "Vila Maria/Vila Guilherme": { id: "vila-maria-vila-guilherme", suporte: "medio", atrasos: "medio", capacitacao: "baixo" },
  "Aricanduva/Vila Formosa": { id: "aricanduva-vila-formosa", suporte: "medio", atrasos: "medio", capacitacao: "medio" },
  "Cidade Tiradentes": { id: "cidade-tiradentes", suporte: "baixo", atrasos: "medio", capacitacao: "medio" },
  "Ermelino Matarazzo": { id: "ermelino-matarazzo", suporte: "baixo", atrasos: "medio", capacitacao: "medio" },
  Guaianazes: { id: "guaianazes", suporte: "baixo", atrasos: "medio", capacitacao: "baixo" },
  "Itaim Paulista": { id: "itaim-paulista", suporte: "baixo", atrasos: "medio", capacitacao: "baixo" },
  Sapopemba: { id: "sapopemba", suporte: "baixo", atrasos: "medio", capacitacao: "baixo" },
  "São Miguel": { id: "sao-miguel", suporte: "baixo", atrasos: "medio", capacitacao: "baixo" },
  "Vila Prudente": { id: "vila-prudente", suporte: "medio", atrasos: "medio", capacitacao: "baixo" },
};

const input = JSON.parse(
  fs.readFileSync(path.join("scripts", "_sub.geojson"), "utf8"),
);

const features = input.features.map((feature) => {
  const nome = feature.properties.name;
  const dados = POR_NOME[nome];
  if (!dados) {
    console.warn("Sem indicadores:", nome);
    return feature;
  }

  const faixa_mapa = faixaMapaFromIndicadores(dados);

  feature.properties = {
    subpref_id: dados.id,
    nome_exibicao: nome,
    suporte: dados.suporte,
    atrasos: dados.atrasos,
    capacitacao: dados.capacitacao,
    faixa_mapa,
    cor_mapa: COR_PRIORIDADE_MAPA[faixa_mapa],
    fonte_limites: "Subprefeituras PMSP (MDC) — dados abertos",
  };
  return feature;
});

const outDir = path.join("public", "data");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(
  path.join(outDir, "sp-subprefeituras.geojson"),
  JSON.stringify({ type: "FeatureCollection", features }),
);

console.log("Gerado public/data/sp-subprefeituras.geojson");
