import fs from "fs";
import path from "path";
import union from "@turf/union";
import centerOfMass from "@turf/center-of-mass";
import { featureCollection } from "@turf/helpers";

const SUBPREFEITURA_PARA_REGIAO = {
  Sé: "centro",
  "Aricanduva/Vila Formosa": "leste",
  "Cidade Tiradentes": "leste",
  "Ermelino Matarazzo": "leste",
  Guaianazes: "leste",
  "Itaim Paulista": "leste",
  Itaquera: "leste",
  Mooca: "leste",
  Penha: "leste",
  "São Mateus": "leste",
  "São Miguel": "leste",
  Sapopemba: "leste",
  "Vila Prudente": "leste",
  "Casa Verde": "norte",
  "Freguesia do Ó/Brasilândia": "norte",
  "Jaçanã/Tremembé": "norte",
  Perus: "norte",
  "Pirituba/Jaraguá": "norte",
  "Santana/Tucuruvi": "norte",
  "Vila Maria/Vila Guilherme": "norte",
  Butantã: "oeste",
  Lapa: "oeste",
  Pinheiros: "oeste",
  "Campo Limpo": "sul",
  "Capela do Socorro": "sul",
  "Cidade Ademar": "sul",
  Ipiranga: "sul",
  Jabaquara: "sul",
  "M'Boi Mirim": "sul",
  Parelheiros: "sul",
  "Santo Amaro": "sul",
  "Vila Mariana": "sul",
};

const REGIAO_NOMES = {
  centro: "Região Centro",
  leste: "Região Leste",
  norte: "Região Norte",
  oeste: "Região Oeste",
  sul: "Região Sul",
};

const input = JSON.parse(
  fs.readFileSync(path.join("scripts", "_sub.geojson"), "utf8"),
);

const byRegiao = {};

for (const feature of input.features) {
  const name = feature.properties.name;
  const regiaoId = SUBPREFEITURA_PARA_REGIAO[name];
  if (!regiaoId) {
    console.warn("Sem região:", name);
    continue;
  }
  if (!byRegiao[regiaoId]) byRegiao[regiaoId] = [];
  byRegiao[regiaoId].push(feature);
}

const regioesFeatures = [];

for (const [regiaoId, feats] of Object.entries(byRegiao)) {
  let merged;
  if (feats.length === 1) {
    merged = feats[0];
  } else {
    merged = union(featureCollection(feats));
  }
  if (!merged) {
    console.warn("Union falhou:", regiaoId);
    continue;
  }
  const c = centerOfMass(merged);
  merged.properties = {
    regiao_id: regiaoId,
    nome: REGIAO_NOMES[regiaoId],
    fonte_limites:
      "Subprefeituras PMSP (MDC/GeoSampa), agregadas por Regiões — InfoCidade 2024",
  };
  c.properties = { ...merged.properties, tipo: "centroide" };
  regioesFeatures.push(merged);
}

const collection = {
  type: "FeatureCollection",
  features: regioesFeatures,
};

const outDir = path.join("public", "data");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(
  path.join(outDir, "sp-regioes-2024.geojson"),
  JSON.stringify(collection),
);

console.log(
  "Gerado",
  regioesFeatures.length,
  "regiões → public/data/sp-regioes-2024.geojson",
);
