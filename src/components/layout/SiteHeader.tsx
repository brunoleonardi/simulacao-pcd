"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import {
  ExperienceRestartButton,
  experienceIdFromPath,
} from "@/components/layout/ExperienceRestartButton";
import { useExperienceInProgress } from "@/hooks/useExperienceInProgress";

const LINKS = [
  { href: "/", label: "Início", match: (p: string) => p === "/" },
  {
    href: "/experiencias/daltonismo",
    label: "Daltonismo",
    match: (p: string) => p.startsWith("/experiencias/daltonismo"),
  },
  {
    href: "/experiencias/tremor",
    label: "Parkinson",
    match: (p: string) => p.startsWith("/experiencias/tremor"),
  },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const navLinks = LINKS.filter((link) => !link.match(pathname));
  const experienceAtiva = experienceIdFromPath(pathname);
  const experienciaEmAndamento = useExperienceInProgress(experienceAtiva);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-neutral-800 dark:bg-black">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4">
        <Link
          href="/"
          className="text-base font-bold tracking-tight text-slate-900 hover:text-teal-800 dark:text-neutral-100 dark:hover:text-neutral-300"
        >
          Além das Barreiras
        </Link>
        <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
          {navLinks.length > 0 ? (
            <nav aria-label="Principal" className="flex flex-wrap gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-50"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          ) : null}
          {experienceAtiva && experienciaEmAndamento ? (
            <ExperienceRestartButton
              experience={experienceAtiva}
              className="min-h-10 rounded-lg px-3 py-2"
            />
          ) : null}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
