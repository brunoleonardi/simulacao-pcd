import type { FeatureCollection, MultiPolygon, Polygon } from "geojson";

let geojsonPromise: Promise<
  FeatureCollection<Polygon | MultiPolygon>
> | null = null;

/** Uma única requisição por sessão de aba — reutilizada se o mapa remontar. */
export function loadSpSubprefeiturasGeoJson(): Promise<
  FeatureCollection<Polygon | MultiPolygon>
> {
  if (!geojsonPromise) {
    geojsonPromise = fetch("/data/sp-subprefeituras.geojson").then((res) => {
      if (!res.ok) {
        throw new Error("Falha ao carregar GeoJSON das subprefeituras.");
      }
      return res.json() as Promise<FeatureCollection<Polygon | MultiPolygon>>;
    });
  }
  return geojsonPromise;
}
