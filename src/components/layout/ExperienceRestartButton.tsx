"use client";

import { Button } from "@/components/ui/Button";
import { EXPERIENCE_META, type ExperienceId } from "@/lib/experience-flow";

type Props = {
  experience: ExperienceId;
  className?: string;
  variant?: "primary" | "secondary" | "ghost";
};

/** Recarrega a rota da experiência para zerar estado do client. */
export function ExperienceRestartButton({
  experience,
  className = "",
  variant = "secondary",
}: Props) {
  const href = EXPERIENCE_META[experience].href;

  return (
    <Button
      type="button"
      variant={variant}
      className={className}
      aria-label="Reiniciar experiência desde o início"
      onClick={() => {
        window.location.assign(href);
      }}
    >
      Reiniciar
    </Button>
  );
}

export function experienceIdFromPath(pathname: string): ExperienceId | null {
  if (pathname.startsWith("/experiencias/daltonismo")) return "daltonismo";
  if (pathname.startsWith("/experiencias/tremor")) return "tremor";
  return null;
}
