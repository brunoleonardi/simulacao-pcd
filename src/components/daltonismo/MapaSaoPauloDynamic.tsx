"use client";

import dynamic from "next/dynamic";

export const MapaSaoPauloOperacional = dynamic(
  () =>
    import("@/components/daltonismo/MapaSaoPauloOperacional").then(
      (m) => m.MapaSaoPauloOperacional,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[min(420px,55vh)] w-full items-center justify-center rounded-lg bg-slate-100 text-sm text-slate-500 ring-1 ring-slate-200 dark:bg-neutral-800 dark:text-neutral-400 dark:ring-neutral-700">
        Carregando mapa…
      </div>
    ),
  },
);
