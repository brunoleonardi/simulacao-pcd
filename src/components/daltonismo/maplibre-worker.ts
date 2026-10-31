"use client";

import { setWorkerUrl } from "maplibre-gl";

let ready = false;

export function ensureMapLibreWorker() {
  if (ready || typeof window === "undefined") return;
  setWorkerUrl("/maplibre/maplibre-gl-worker.mjs");
  ready = true;
}

ensureMapLibreWorker();
