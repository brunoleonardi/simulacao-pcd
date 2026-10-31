export type RegiaoId =
  | "norte"
  | "nordeste"
  | "centro-oeste"
  | "sudeste"
  | "sul";

export type RegiaoIndicadores = {
  id: RegiaoId;
  nome: string;
  vagas: number;
  contratacoes: number;
  treinamentosPendentes: number;
};

export const REGIOES: RegiaoIndicadores[] = [
  {
    id: "sudeste",
    nome: "Sudeste",
    vagas: 85,
    contratacoes: 40,
    treinamentosPendentes: 22,
  },
  {
    id: "nordeste",
    nome: "Nordeste",
    vagas: 32,
    contratacoes: 28,
    treinamentosPendentes: 45,
  },
  {
    id: "sul",
    nome: "Sul",
    vagas: 18,
    contratacoes: 15,
    treinamentosPendentes: 30,
  },
  {
    id: "centro-oeste",
    nome: "Centro-Oeste",
    vagas: 12,
    contratacoes: 10,
    treinamentosPendentes: 18,
  },
  {
    id: "norte",
    nome: "Norte",
    vagas: 8,
    contratacoes: 5,
    treinamentosPendentes: 12,
  },
];

export function corVagas(vagas: number): string {
  if (vagas >= 50) return "#16a34a";
  if (vagas >= 20) return "#eab308";
  return "#dc2626";
}

export const RESPOSTAS_CORRETAS = {
  maiorVagas: "sudeste" as RegiaoId,
  menorVagas: "norte" as RegiaoId,
  maiorTreinamentos: "nordeste" as RegiaoId,
};
