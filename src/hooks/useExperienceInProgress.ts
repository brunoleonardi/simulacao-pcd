"use client";

import { useEffect, useState } from "react";
import type { ExperienceId } from "@/lib/experience-flow";
import {
  EXPERIENCE_PROGRESS_EVENT,
  isExperienceInProgress,
} from "@/lib/experience-progress";

/** Sincroniza com sessionStorage (experiência já iniciada, não só na rota). */
export function useExperienceInProgress(experience: ExperienceId | null): boolean {
  const [inProgress, setInProgress] = useState(false);

  useEffect(() => {
    if (!experience) {
      setInProgress(false);
      return;
    }

    const sync = () => setInProgress(isExperienceInProgress(experience));
    sync();

    window.addEventListener(EXPERIENCE_PROGRESS_EVENT, sync);
    return () => window.removeEventListener(EXPERIENCE_PROGRESS_EVENT, sync);
  }, [experience]);

  return inProgress;
}
