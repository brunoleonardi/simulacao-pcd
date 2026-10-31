import { type ReactNode } from "react";

type Props = {
  children: ReactNode;
  title?: string;
  description?: string;
  badge?: string;
  className?: string;
};

export function Panel({
  children,
  title,
  description,
  badge,
  className = "",
}: Props) {
  return (
    <section
      className={`overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-900 ${className}`}
    >
      {(title || badge) && (
        <div className="border-b border-slate-100 bg-slate-50/80 px-5 py-4 dark:border-neutral-800 dark:bg-neutral-800/80 sm:px-6">
          {badge && (
            <p className="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-neutral-300">
              {badge}
            </p>
          )}
          {title && (
            <h2 className={`font-semibold text-slate-900 dark:text-neutral-100 ${badge ? "mt-1" : ""}`}>
              {title}
            </h2>
          )}
          {description && (
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-neutral-400">
              {description}
            </p>
          )}
        </div>
      )}
      <div className="px-5 py-5 sm:px-6 sm:py-6">{children}</div>
    </section>
  );
}
