import { type ReactNode } from "react";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

type Props = {
  children: ReactNode;
  /** Largura do conteúdo principal */
  width?: "content" | "wide" | "full";
  /** Remove padding vertical/horizontal do main (ex.: daltonismo · atividade) */
  flush?: boolean;
};

const mainWidth: Record<NonNullable<Props["width"]>, string> = {
  content: "max-w-3xl",
  wide: "max-w-5xl",
  full: "max-w-none",
};

export function SiteShell({
  children,
  width = "content",
  flush = false,
}: Props) {
  const padding = flush
    ? ""
    : "px-4 py-10 sm:px-6 sm:py-14";

  return (
    <>
      <SiteHeader />
      <main
        className={`mx-auto w-full flex-1 bg-inherit ${mainWidth[width]} ${padding}`}
      >
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
