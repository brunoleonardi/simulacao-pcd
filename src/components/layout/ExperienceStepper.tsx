import {
  flowStepsFor,
  stepIndex,
  type ExperienceId,
  type ExperienceStep,
} from "@/lib/experience-flow";

type Props = {
  experience: ExperienceId;
  current: ExperienceStep;
};

const STEP_CARD =
  "flex min-h-[4.75rem] w-full flex-col items-center justify-center rounded-lg px-2 py-2.5 text-center sm:min-h-[5rem] sm:px-3 box-border";

export function ExperienceStepper({ experience, current }: Props) {
  const steps = flowStepsFor(experience);
  const activeIndex = stepIndex(current, experience);

  return (
    <div className="w-full" aria-label="Progresso da experiência">
      <ol className="grid grid-cols-3 items-stretch gap-1 sm:gap-2">
        {steps.map((step, i) => {
          const done = i < activeIndex;
          const active = i === activeIndex;
          return (
            <li key={step.id} className="flex min-w-0">
              <div
                className={`${STEP_CARD} ${
                  active
                    ? "bg-slate-900 text-white ring-2 ring-inset ring-slate-700 dark:bg-neutral-800 dark:text-neutral-100 dark:ring-neutral-500"
                    : done
                      ? "bg-emerald-50 text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200"
                      : "bg-white text-slate-500 ring-1 ring-inset ring-slate-200 dark:bg-neutral-900 dark:text-neutral-400 dark:ring-neutral-700"
                }`}
              >
                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${
                    active
                      ? "bg-white dark:bg-neutral-100"
                      : done
                        ? "bg-emerald-600 dark:bg-emerald-400"
                        : "bg-slate-400 dark:bg-neutral-500"
                  }`}
                  aria-hidden
                />
                <span className="mt-2 line-clamp-2 text-[10px] font-semibold leading-tight sm:text-xs">
                  {step.label}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
      {activeIndex >= 0 ? (
        <p className="mt-2 text-center text-xs font-medium text-slate-600 dark:text-neutral-400 sm:hidden">
          Fase atual:{" "}
          <span className="text-slate-900 dark:text-neutral-100">
            {steps[activeIndex]?.label}
          </span>
        </p>
      ) : null}
    </div>
  );
}
