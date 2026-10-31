export type ExperienceId = "daltonismo" | "tremor";

export type ExperienceStep = "preparacao" | "atividade" | "conclusao";

export const EXPERIENCE_META: Record<
  ExperienceId,
  { titulo: string; href: string }
> = {
  daltonismo: {
    titulo: "Daltonismo",
    href: "/experiencias/daltonismo",
  },
  tremor: {
    titulo: "Tremor motor",
    href: "/experiencias/tremor",
  },
};

export const FLOW_STEPS: { id: ExperienceStep; label: string }[] = [
  { id: "preparacao", label: "Preparação" },
  { id: "atividade", label: "Atividade" },
  { id: "conclusao", label: "Conclusão" },
];

export function flowStepsFor(_experience: ExperienceId) {
  return FLOW_STEPS;
}

export function stepIndex(
  step: ExperienceStep,
  experience: ExperienceId,
): number {
  return flowStepsFor(experience).findIndex((s) => s.id === step);
}

export function stepLabel(
  step: ExperienceStep,
  experience: ExperienceId,
): string {
  return (
    flowStepsFor(experience).find((s) => s.id === step)?.label ??
    ""
  );
}
