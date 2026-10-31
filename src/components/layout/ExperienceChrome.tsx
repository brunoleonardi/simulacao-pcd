import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ExperienceStepper } from "@/components/layout/ExperienceStepper";
import {
  EXPERIENCE_META,
  stepLabel,
  type ExperienceId,
  type ExperienceStep,
} from "@/lib/experience-flow";
import Link from "next/link";

type Props = {
  experience: ExperienceId;
  step: ExperienceStep;
  onBack?: () => void;
  backLabel?: string;
};

export function ExperienceChrome({
  experience,
  step,
  onBack,
  backLabel = "Voltar",
}: Props) {
  const meta = EXPERIENCE_META[experience];
  const stepLabelText = stepLabel(step, experience);

  const crumbs = [
    { label: "Início", href: "/" },
    { label: meta.titulo, href: meta.href },
    { label: stepLabelText },
  ];

  return (
    <header className="mb-8 space-y-5">
      <Breadcrumbs items={crumbs} />
      <ExperienceStepper experience={experience} current={step} />
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="inline-flex cursor-pointer items-center gap-1 text-sm font-medium text-slate-600 underline-offset-2 hover:text-slate-900 hover:underline dark:text-neutral-400 dark:hover:text-neutral-50"
        >
          ← {backLabel}
        </button>
      ) : step === "preparacao" ? (
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm font-medium text-slate-600 underline-offset-2 hover:text-slate-900 hover:underline dark:text-neutral-400 dark:hover:text-neutral-50"
        >
          ← Voltar ao início
        </Link>
      ) : null}
    </header>
  );
}
