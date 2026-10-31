/**
 * Simulação educativa de tremor motor — escala interna de intensidade.
 * Nível 2: tremor moderado (referência clínica simplificada, não diagnóstica).
 */
export type ParkinsonNivel = 1 | 2 | 3;

export const PARKINSON_NIVEL_ATIVO: ParkinsonNivel = 2;

type TremorConfig = {
  /** Desvio máximo aproximado do cursor (px) */
  intensity: number;
  /** Componente aleatório (0–1) */
  aleatoriedade: number;
  /** Multiplicador das frequências de oscilação */
  velocidade: number;
};

const PARKINSON_NIVEIS: Record<ParkinsonNivel, TremorConfig> = {
  1: { intensity: 9, aleatoriedade: 0.32, velocidade: 1 },
  2: { intensity: 22, aleatoriedade: 0.58, velocidade: 1.14 },
  3: { intensity: 34, aleatoriedade: 0.78, velocidade: 1.28 },
};

export function getTremorConfig(
  nivel: ParkinsonNivel = PARKINSON_NIVEL_ATIVO,
): TremorConfig {
  return PARKINSON_NIVEIS[nivel];
}

/** @deprecated Use getTremorConfig().intensity */
export const TREMOR_INTENSITY = getTremorConfig().intensity;

export function computeTremorOffset(
  t: number,
  config: TremorConfig = getTremorConfig(),
): { x: number; y: number } {
  const { intensity, aleatoriedade, velocidade } = config;
  const v = velocidade;

  const x =
    Math.sin(t * 0.018 * v) * intensity * 0.55 +
    Math.sin(t * 0.041 * v + 1.2) * intensity * 0.35 +
    (Math.random() - 0.5) * intensity * aleatoriedade;
  const y =
    Math.cos(t * 0.022 * v + 0.5) * intensity * 0.5 +
    Math.sin(t * 0.037 * v) * intensity * 0.4 +
    (Math.random() - 0.5) * intensity * aleatoriedade;

  return { x, y };
}
