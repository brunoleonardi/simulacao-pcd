import { type ReactNode } from "react";

type Props = {
  hint?: string;
  children: ReactNode;
};

/** Agrupa ações: primeiro filho = avanço (fica à direita no desktop, embaixo no mobile). */
export function ActionGroup({ hint, children }: Props) {
  return (
    <div className="mt-8 border-t border-slate-100 pt-6 dark:border-neutral-800">
      {hint && (
        <p className="mb-4 text-sm text-slate-600 dark:text-neutral-400">{hint}</p>
      )}
      <div className="flex w-full flex-col-reverse items-stretch gap-3 sm:flex-row sm:flex-row-reverse sm:flex-wrap sm:items-center sm:justify-end">
        {children}
      </div>
    </div>
  );
}
