"use client";

import "./maplibre-worker";
import { useEffect, useRef } from "react";
import { Map } from "maplibre-gl";
import type { Map as MapLibreMap, MapMouseEvent, GeoJSONSource } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import bbox from "@turf/bbox";
import type { PerfilDaltonismo, PerfilVisualMapa } from "@/lib/colorBlind";
import {
  corMapaExibicao,
  FONTE_MAPA,
  type FaixaPrioridadeMapa,
} from "@/lib/mapa-sp-subprefeituras";
import { MapaLegendaIndicadores } from "@/components/daltonismo/MapaLegendaIndicadores";
import type { FeatureCollection, MultiPolygon, Polygon } from "geojson";

type Props = {
  className?: string;
  /** Atividade: protan/deuter/tritan (simulado). Conclusão: `visao-tipica`. */
  perfilVisual?: PerfilVisualMapa;
  /** Obrigatório com `visao-tipica` (mesmo perfil escolhido na atividade). */
  perfilExperiencia?: PerfilDaltonismo;
};

const LAYER_FILL = "sp-fill-prioridade";
const SOURCE_ID = "sp-subprefs";

function comCoresExibicao(
  subprefs: FeatureCollection<Polygon | MultiPolygon>,
  perfil: PerfilVisualMapa,
  perfilExperiencia?: PerfilDaltonismo,
): FeatureCollection<Polygon | MultiPolygon> {
  return {
    ...subprefs,
    features: subprefs.features.map((feature) => {
      const faixa = feature.properties?.faixa_mapa as
        | FaixaPrioridadeMapa
        | undefined;
      const cor_exibicao = faixa
        ? corMapaExibicao(faixa, perfil, perfilExperiencia)
        : String(feature.properties?.cor_mapa ?? "#cccccc");
      return {
        ...feature,
        properties: {
          ...feature.properties,
          cor_exibicao,
        },
      };
    }),
  };
}

export function MapaSaoPauloOperacional({
  className = "",
  perfilVisual = "oficial",
  perfilExperiencia,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const geojsonBaseRef = useRef<FeatureCollection<
    Polygon | MultiPolygon
  > | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    let ativo = true;

    const map = new Map({
      container: containerRef.current,
      style: {
        version: 8,
        sources: {
          "osm-raster": {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution: "© OpenStreetMap",
          },
        },
        layers: [
          {
            id: "osm-base",
            type: "raster",
            source: "osm-raster",
            minzoom: 0,
            maxzoom: 19,
            paint: { "raster-opacity": 0.35, "raster-saturation": -0.9 },
          },
        ],
      },
      center: [-46.6333, -23.5505],
      zoom: 9.5,
      attributionControl: { compact: true },
    });

    mapRef.current = map;

    const esconderTooltip = () => {
      const tooltip = tooltipRef.current;
      if (tooltip) tooltip.hidden = true;
      map.getCanvas().style.cursor = "";
    };

    const mostrarTooltip = (e: MapMouseEvent, nome: string) => {
      const tooltip = tooltipRef.current;
      if (!tooltip) return;
      tooltip.textContent = nome;
      tooltip.hidden = false;
      tooltip.style.left = `${e.point.x + 10}px`;
      tooltip.style.top = `${e.point.y + 10}px`;
      map.getCanvas().style.cursor = "pointer";
    };

    let onMouseMove: ((e: MapMouseEvent) => void) | null = null;

    const onContainerLeave = () => esconderTooltip();

    map.on("load", async () => {
      if (!ativo) return;
      const res = await fetch("/data/sp-subprefeituras.geojson");
      const subprefs = (await res.json()) as FeatureCollection<
        Polygon | MultiPolygon
      >;
      geojsonBaseRef.current = subprefs;

      map.addSource(SOURCE_ID, {
        type: "geojson",
        data: comCoresExibicao(subprefs, perfilVisual, perfilExperiencia),
      });

      map.addLayer({
        id: LAYER_FILL,
        type: "fill",
        source: SOURCE_ID,
        paint: {
          "fill-color": ["get", "cor_exibicao"],
          "fill-opacity": 0.82,
        },
      });

      map.addLayer({
        id: "sp-subprefs-linha",
        type: "line",
        source: SOURCE_ID,
        paint: {
          "line-color": "#1e293b",
          "line-width": 0.6,
          "line-opacity": 0.45,
        },
      });

      onMouseMove = (e: MapMouseEvent) => {
        if (!map.getLayer(LAYER_FILL)) return;
        const features = map.queryRenderedFeatures(e.point, {
          layers: [LAYER_FILL],
        });
        const props = features[0]?.properties as
          | { nome_exibicao?: string }
          | undefined;
        const nome = props?.nome_exibicao?.trim();
        if (!nome) {
          esconderTooltip();
          return;
        }
        mostrarTooltip(e, nome);
      };
      map.on("mousemove", onMouseMove);

      const [minX, minY, maxX, maxY] = bbox(subprefs);
      map.fitBounds(
        [
          [minX, minY],
          [maxX, maxY],
        ],
        { padding: 28, maxZoom: 10.8 },
      );
    });

    const canvas = map.getCanvas();
    canvas.addEventListener("mouseleave", onContainerLeave);

    return () => {
      ativo = false;
      if (onMouseMove) map.off("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onContainerLeave);
      map.remove();
      mapRef.current = null;
      geojsonBaseRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mapa criado uma vez
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const base = geojsonBaseRef.current;
    if (!map || !base) return;
    const source = map.getSource(SOURCE_ID) as GeoJSONSource | undefined;
    if (!source) return;
    source.setData(comCoresExibicao(base, perfilVisual, perfilExperiencia));
  }, [perfilVisual, perfilExperiencia]);

  return (
    <div className={className}>
      <div className="relative">
        <div
          ref={containerRef}
          className="h-[min(440px,58vh)] w-full rounded-lg ring-1 ring-slate-200 dark:ring-neutral-700"
          role="img"
          aria-label="Mapa de São Paulo com subprefeituras coloridas. Passe o mouse sobre uma região para ver o nome."
        />
        <div
          ref={tooltipRef}
          hidden
          role="tooltip"
          className="pointer-events-none absolute z-10 max-w-[14rem] rounded-md border border-slate-200 bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-white shadow-md dark:border-neutral-600"
        />
      </div>
      <div className="mt-3">
        <MapaLegendaIndicadores
          perfilVisual={perfilVisual}
          perfilExperiencia={perfilExperiencia}
        />
      </div>
      <p className="mt-2 text-[10px] leading-relaxed text-slate-500 dark:text-neutral-400">{FONTE_MAPA}</p>
    </div>
  );
}
