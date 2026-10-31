import type {
  PerfilDaltonismo,
  PerfilVisualMapa,
} from "@/lib/colorBlind";
import { simularCorHex } from "@/lib/colorBlind";

export type NivelIndicador = "alto" | "medio" | "baixo";

export type SubprefeituraId =
  | "aricanduva-vila-formosa"
  | "butanta"
  | "campo-limpo"
  | "capela-do-socorro"
  | "casa-verde"
  | "cidade-ademar"
  | "cidade-tiradentes"
  | "ermelino-matarazzo"
  | "freguesia-do-o-brasilandia"
  | "guaianazes"
  | "ipiranga"
  | "itaim-paulista"
  | "itaquera"
  | "jabaquara"
  | "jacana-tremembe"
  | "lapa"
  | "mboi-mirim"
  | "mooca"
  | "parelheiros"
  | "penha"
  | "perus"
  | "pinheiros"
  | "pirituba-jaragua"
  | "santana-tucuruvi"
  | "santo-amaro"
  | "sapopemba"
  | "sao-mateus"
  | "sao-miguel"
  | "se"
  | "vila-maria-vila-guilherme"
  | "vila-mariana"
  | "vila-prudente";

export type SubprefeituraIndicadores = {
  id: SubprefeituraId;
  /** Nome como no MDC/PMSP */
  nome: string;
  suporte: NivelIndicador;
  atrasos: NivelIndicador;
  capacitacao: NivelIndicador;
};

const RANK_NIVEL: Record<NivelIndicador, number> = {
  baixo: 0,
  medio: 1,
  alto: 2,
};

/** Faixas exibidas no mapa (uma cor por nível de prioridade). */
export const FAIXAS_PRIORIDADE_MAPA = [
  "estavel",
  "monitoramento",
  "reforco",
  "atencao",
  "urgente",
  "critico",
] as const;

export type FaixaPrioridadeMapa = (typeof FAIXAS_PRIORIDADE_MAPA)[number];

export const FAIXA_MAPA_ROTULO: Record<FaixaPrioridadeMapa, string> = {
  estavel: "Operação normal",
  monitoramento: "Observação de rotina",
  reforco: "Reforço de equipe",
  atencao: "Meta em risco",
  urgente: "Escalonar gestão",
  critico: "Ação imediata",
};

/** Dados oficiais (pós-envio / visão normal): escala OrRd. */
export const COR_PRIORIDADE_MAPA: Record<FaixaPrioridadeMapa, string> = {
  estavel: "#fef0d9",
  monitoramento: "#fdcc8a",
  reforco: "#fc8d59",
  atencao: "#ef6548",
  urgente: "#d7301f",
  critico: "#7f0000",
};

/**
 * Estímulos do mapa (mesma cor para visão típica e entrada da simulação).
 * Visão típica = hex abaixo; simulado = Machado(protan/deuter) ou Brettel(tritan).
 */
const COR_ESTIMULO_DEUTERANOPIA: Record<FaixaPrioridadeMapa, string> = {
  estavel: "#608430",
  monitoramento: "#d8003c",
  reforco: "#ae6036",
  atencao: "#00962a",
  urgente: "#369c00",
  critico: "#ea4242",
};

const COR_ESTIMULO_PROTANOPIA: Record<FaixaPrioridadeMapa, string> = {
  estavel: "#42721e",
  monitoramento: "#fc3c12",
  reforco: "#9c6c1e",
  atencao: "#007e24",
  urgente: "#d26600",
  critico: "#e4663c",
};

const COR_ESTIMULO_TRITANOPIA: Record<FaixaPrioridadeMapa, string> = {
  estavel: "#8f6d45",
  monitoramento: "#b37785",
  reforco: "#e96720",
  atencao: "#db4075",
  urgente: "#d55bbf",
  critico: "#bc39fb",
};

export const COR_PRIORIDADE_ESTIMULO: Record<
  PerfilDaltonismo,
  Record<FaixaPrioridadeMapa, string>
> = {
  protanopia: COR_ESTIMULO_PROTANOPIA,
  deuteranopia: COR_ESTIMULO_DEUTERANOPIA,
  tritanopia: COR_ESTIMULO_TRITANOPIA,
};

const PONTOS_MAX_FAIXA = 14;

export function faixaMapaFromIndicadores(
  ind: Pick<SubprefeituraIndicadores, "suporte" | "atrasos" | "capacitacao">,
): FaixaPrioridadeMapa {
  const pontos =
    RANK_NIVEL[ind.suporte] * 2 +
    RANK_NIVEL[ind.atrasos] * 3 +
    RANK_NIVEL[ind.capacitacao] * 2;
  const idx = Math.min(
    FAIXAS_PRIORIDADE_MAPA.length - 1,
    Math.round((pontos / PONTOS_MAX_FAIXA) * (FAIXAS_PRIORIDADE_MAPA.length - 1)),
  );
  return FAIXAS_PRIORIDADE_MAPA[idx];
}

export function corMapaSubprefeitura(
  ind: Pick<SubprefeituraIndicadores, "suporte" | "atrasos" | "capacitacao">,
): string {
  return COR_PRIORIDADE_MAPA[faixaMapaFromIndicadores(ind)];
}

/** Mesma cor do estímulo: o que visão típica veria (sem Machado). */
export function corReferenciaVisaoTipica(
  faixa: FaixaPrioridadeMapa,
  perfil: PerfilDaltonismo,
): string {
  return corEstimuloPrioridade(faixa, perfil);
}

/** Estímulo do exercício antes do Machado (atividade usa simulação disso). */
export function corEstimuloPrioridade(
  faixa: FaixaPrioridadeMapa,
  perfil: PerfilDaltonismo,
): string {
  return COR_PRIORIDADE_ESTIMULO[perfil][faixa];
}

export function corMapaExibicao(
  faixa: FaixaPrioridadeMapa,
  perfil: PerfilVisualMapa,
  perfilExperiencia?: PerfilDaltonismo,
): string {
  if (perfil === "oficial") return COR_PRIORIDADE_MAPA[faixa];
  if (perfil === "visao-tipica") {
    if (!perfilExperiencia) {
      throw new Error("corMapaExibicao(visao-tipica) exige perfilExperiencia");
    }
    return corReferenciaVisaoTipica(faixa, perfilExperiencia);
  }
  return simularCorHex(corEstimuloPrioridade(faixa, perfil), perfil);
}

export function corPrioridadeExibicao(
  faixa: FaixaPrioridadeMapa,
  perfil: PerfilVisualMapa,
  perfilExperiencia?: PerfilDaltonismo,
): string {
  return corMapaExibicao(faixa, perfil, perfilExperiencia);
}

/** Indicadores fictícios por subprefeitura (32). */
export const SUBPREFEITURAS: SubprefeituraIndicadores[] = [
  { id: "se", nome: "Sé", suporte: "alto", atrasos: "baixo", capacitacao: "medio" },
  { id: "mooca", nome: "Mooca", suporte: "medio", atrasos: "medio", capacitacao: "baixo" },
  { id: "penha", nome: "Penha", suporte: "medio", atrasos: "alto", capacitacao: "medio" },
  { id: "itaquera", nome: "Itaquera", suporte: "alto", atrasos: "alto", capacitacao: "alto" },
  { id: "sao-mateus", nome: "São Mateus", suporte: "baixo", atrasos: "medio", capacitacao: "medio" },
  { id: "capela-do-socorro", nome: "Capela do Socorro", suporte: "baixo", atrasos: "medio", capacitacao: "alto" },
  { id: "parelheiros", nome: "Parelheiros", suporte: "baixo", atrasos: "medio", capacitacao: "medio" },
  { id: "campo-limpo", nome: "Campo Limpo", suporte: "baixo", atrasos: "medio", capacitacao: "medio" },
  { id: "santo-amaro", nome: "Santo Amaro", suporte: "medio", atrasos: "baixo", capacitacao: "medio" },
  { id: "vila-mariana", nome: "Vila Mariana", suporte: "medio", atrasos: "baixo", capacitacao: "medio" },
  { id: "ipiranga", nome: "Ipiranga", suporte: "medio", atrasos: "medio", capacitacao: "medio" },
  { id: "jabaquara", nome: "Jabaquara", suporte: "medio", atrasos: "baixo", capacitacao: "baixo" },
  { id: "cidade-ademar", nome: "Cidade Ademar", suporte: "baixo", atrasos: "medio", capacitacao: "medio" },
  { id: "mboi-mirim", nome: "M'Boi Mirim", suporte: "baixo", atrasos: "baixo", capacitacao: "medio" },
  { id: "butanta", nome: "Butantã", suporte: "medio", atrasos: "baixo", capacitacao: "baixo" },
  { id: "pinheiros", nome: "Pinheiros", suporte: "medio", atrasos: "baixo", capacitacao: "baixo" },
  { id: "lapa", nome: "Lapa", suporte: "medio", atrasos: "medio", capacitacao: "baixo" },
  { id: "casa-verde", nome: "Casa Verde", suporte: "medio", atrasos: "medio", capacitacao: "baixo" },
  { id: "freguesia-do-o-brasilandia", nome: "Freguesia do Ó/Brasilândia", suporte: "medio", atrasos: "medio", capacitacao: "baixo" },
  { id: "jacana-tremembe", nome: "Jaçanã/Tremembé", suporte: "baixo", atrasos: "medio", capacitacao: "baixo" },
  { id: "perus", nome: "Perus", suporte: "baixo", atrasos: "medio", capacitacao: "baixo" },
  { id: "pirituba-jaragua", nome: "Pirituba/Jaraguá", suporte: "baixo", atrasos: "baixo", capacitacao: "baixo" },
  { id: "santana-tucuruvi", nome: "Santana/Tucuruvi", suporte: "medio", atrasos: "medio", capacitacao: "baixo" },
  { id: "vila-maria-vila-guilherme", nome: "Vila Maria/Vila Guilherme", suporte: "medio", atrasos: "medio", capacitacao: "baixo" },
  { id: "aricanduva-vila-formosa", nome: "Aricanduva/Vila Formosa", suporte: "medio", atrasos: "medio", capacitacao: "medio" },
  { id: "cidade-tiradentes", nome: "Cidade Tiradentes", suporte: "baixo", atrasos: "medio", capacitacao: "medio" },
  { id: "ermelino-matarazzo", nome: "Ermelino Matarazzo", suporte: "baixo", atrasos: "medio", capacitacao: "medio" },
  { id: "guaianazes", nome: "Guaianazes", suporte: "baixo", atrasos: "medio", capacitacao: "baixo" },
  { id: "itaim-paulista", nome: "Itaim Paulista", suporte: "baixo", atrasos: "medio", capacitacao: "baixo" },
  { id: "sapopemba", nome: "Sapopemba", suporte: "baixo", atrasos: "medio", capacitacao: "baixo" },
  { id: "sao-miguel", nome: "São Miguel", suporte: "baixo", atrasos: "medio", capacitacao: "baixo" },
  { id: "vila-prudente", nome: "Vila Prudente", suporte: "medio", atrasos: "medio", capacitacao: "baixo" },
];

export const SUBPREFEITURA_POR_NOME = Object.fromEntries(
  SUBPREFEITURAS.map((s) => [s.nome, s]),
) as Record<string, SubprefeituraIndicadores>;

export const FONTE_MAPA =
  "Mapa das subprefeituras de São Paulo. Limites: dados públicos; indicadores do painel operacional.";

export function nomeSubprefeitura(id: SubprefeituraId): string {
  return SUBPREFEITURAS.find((s) => s.id === id)?.nome ?? id;
}

export function indicePrioridadeRegiao(
  ind: Pick<SubprefeituraIndicadores, "suporte" | "atrasos" | "capacitacao">,
): number {
  return FAIXAS_PRIORIDADE_MAPA.indexOf(faixaMapaFromIndicadores(ind));
}

function subprefeituraUnicaComIndicePrioridade(
  indicePrioridade: number,
): SubprefeituraId {
  const ids = SUBPREFEITURAS.filter(
    (s) => indicePrioridadeRegiao(s) === indicePrioridade,
  ).map((s) => s.id);
  if (ids.length !== 1) {
    throw new Error(
      `Esperada uma subprefeitura no índice de prioridade ${indicePrioridade}, encontradas: ${ids.length}`,
    );
  }
  return ids[0];
}

const INDICE_PRIORIDADE_MIN = 0;
const INDICE_PRIORIDADE_MAX = FAIXAS_PRIORIDADE_MAPA.length - 1;
const INDICE_SEGUNDA_MAIOR_PRIORIDADE = INDICE_PRIORIDADE_MAX - 1;

export type PerguntaAtividadeId =
  | "prioridade-minima"
  | "prioridade-maxima"
  | "prioridade-segunda-maior";

/** Uma resposta certa cada; exige ler prioridade pela cor + legenda (sem citar o rótulo exato). */
export const PERGUNTAS_ATIVIDADE_DALTONISMO: {
  id: PerguntaAtividadeId;
  rotuloEmail: string;
  rotuloFormulario: string;
  respostaCorreta: SubprefeituraId;
}[] = [
  {
    id: "prioridade-minima",
    rotuloEmail:
      "Subprefeitura com a menor prioridade da região no mapa",
    rotuloFormulario: "Menor prioridade da região",
    respostaCorreta: subprefeituraUnicaComIndicePrioridade(
      INDICE_PRIORIDADE_MIN,
    ),
  },
  {
    id: "prioridade-segunda-maior",
    rotuloEmail:
      "Subprefeitura com a segunda maior prioridade da região",
    rotuloFormulario: "Segunda maior prioridade da região",
    respostaCorreta: subprefeituraUnicaComIndicePrioridade(
      INDICE_SEGUNDA_MAIOR_PRIORIDADE,
    ),
  },
  {
    id: "prioridade-maxima",
    rotuloEmail:
      "Subprefeitura com a maior prioridade da região no mapa",
    rotuloFormulario: "Maior prioridade da região",
    respostaCorreta: subprefeituraUnicaComIndicePrioridade(
      INDICE_PRIORIDADE_MAX,
    ),
  },
];

export type RespostasAtividade = Record<PerguntaAtividadeId, SubprefeituraId | "">;

export type ResultadoPerguntaAtividade = {
  id: PerguntaAtividadeId;
  rotuloFormulario: string;
  respostaUsuario: SubprefeituraId;
  respostaCorreta: SubprefeituraId;
  acertou: boolean;
};

export function avaliarRespostasAtividade(
  respostas: RespostasAtividade,
): ResultadoPerguntaAtividade[] {
  return PERGUNTAS_ATIVIDADE_DALTONISMO.map((pergunta) => {
    const respostaUsuario = respostas[pergunta.id];
    if (!respostaUsuario) {
      throw new Error(`Resposta ausente: ${pergunta.id}`);
    }
    return {
      id: pergunta.id,
      rotuloFormulario: pergunta.rotuloFormulario,
      respostaUsuario,
      respostaCorreta: pergunta.respostaCorreta,
      acertou: respostaUsuario === pergunta.respostaCorreta,
    };
  });
}

export const RESPOSTAS_ESPERADAS = {
  menorPrioridade: subprefeituraUnicaComIndicePrioridade(INDICE_PRIORIDADE_MIN),
  segundaMaiorPrioridade: subprefeituraUnicaComIndicePrioridade(
    INDICE_SEGUNDA_MAIOR_PRIORIDADE,
  ),
  maiorPrioridade: subprefeituraUnicaComIndicePrioridade(INDICE_PRIORIDADE_MAX),
};
