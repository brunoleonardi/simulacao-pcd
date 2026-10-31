"use client";

import { ColorBlindFilters } from "@/components/daltonismo/ColorBlindFilters";
import type { DaltonismoTipo } from "@/lib/colorBlind";
import type { ReactNode } from "react";

type Props = {
  /** Filtro ativo em toda a viewport da experiência */
  active: boolean;
  tipo: Exclude<DaltonismoTipo, "nenhum">;
  children: ReactNode;
};

export function FullPageDaltonism({ active, tipo, children }: Props) {
  return (
    <>
      <ColorBlindFilters />
      <div
        className="min-h-screen w-full bg-[#e8eaed] dark:bg-black"
        style={
          active ? { filter: `url(#filter-${tipo})` } : undefined
        }
      >
        {children}
      </div>
    </>
  );
}
