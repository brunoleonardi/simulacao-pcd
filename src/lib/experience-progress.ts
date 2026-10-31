import type { ExperienceId } from "@/lib/experience-flow";

const STORAGE_KEY: Record<ExperienceId, string> = {
  daltonismo: "simulacao-pcd:daltonismo:in-progress",
  tremor: "simulacao-pcd:tremor:in-progress",
};

export const EXPERIENCE_PROGRESS_EVENT = "simulacao-pcd:experience-progress";

export function setExperienceInProgress(
  experience: ExperienceId,
  inProgress: boolean,
): void {
  if (typeof window === "undefined") return;
  const key = STORAGE_KEY[experience];
  if (inProgress) sessionStorage.setItem(key, "1");
  else sessionStorage.removeItem(key);
  window.dispatchEvent(new CustomEvent(EXPERIENCE_PROGRESS_EVENT));
}

export function isExperienceInProgress(experience: ExperienceId): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(STORAGE_KEY[experience]) === "1";
}
