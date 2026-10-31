"use client";

import { corVagas, REGIOES, type RegiaoId } from "@/lib/regions";
import type { DaltonismoTipo } from "@/lib/colorBlind";

type Props = {
  daltonismo: DaltonismoTipo;
  mostrarNumeros?: boolean;
};

const PATHS: Record<RegiaoId, { d: string; label: { x: number; y: number } }> =
  {
    norte: {
      d: "M 118 42 L 168 38 L 195 72 L 175 115 L 125 108 Z",
      label: { x: 148, y: 78 },
    },
    nordeste: {
      d: "M 195 72 L 248 55 L 268 95 L 255 145 L 210 155 L 175 115 Z",
      label: { x: 228, y: 108 },
    },
    "centro-oeste": {
      d: "M 125 108 L 175 115 L 210 155 L 195 205 L 140 198 L 108 155 Z",
      label: { x: 158, y: 158 },
    },
    sudeste: {
      d: "M 210 155 L 255 145 L 268 195 L 245 238 L 195 205 Z",
      label: { x: 232, y: 192 },
    },
    sul: {
      d: "M 195 205 L 245 238 L 228 278 L 178 268 L 168 228 Z",
      label: { x: 208, y: 242 },
    },
  };

export function BrazilMap({ daltonismo, mostrarNumeros = false }: Props) {
  const filterStyle =
    daltonismo !== "nenhum"
      ? { filter: `url(#filter-${daltonismo})` }
      : undefined;

  return (
    <div className="relative mx-auto w-full max-w-md">
      <svg
        viewBox="80 30 200 260"
        className="h-auto w-full drop-shadow-sm"
        role="img"
        aria-label="Mapa do Brasil por região com indicadores de vagas por cor"
      >
        <g style={filterStyle}>
          {REGIOES.map((regiao) => {
            const path = PATHS[regiao.id];
            return (
              <g key={regiao.id}>
                <path
                  d={path.d}
                  fill={corVagas(regiao.vagas)}
                  stroke="#fff"
                  strokeWidth={2}
                />
                <text
                  x={path.label.x}
                  y={path.label.y}
                  textAnchor="middle"
                  className="fill-white text-[10px] font-semibold"
                  style={{ fontSize: 10 }}
                >
                  {regiao.nome.split("-").join(" ")}
                </text>
                {mostrarNumeros && (
                  <text
                    x={path.label.x}
                    y={path.label.y + 12}
                    textAnchor="middle"
                    className="fill-white text-[9px]"
                    style={{ fontSize: 9 }}
                  >
                    {regiao.vagas} vagas
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
