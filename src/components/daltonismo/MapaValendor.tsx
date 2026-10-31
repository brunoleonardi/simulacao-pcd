"use client";

import {
  COR_ATRASOS,
  COR_CAPACITACAO,
  COR_SUPORTE,
  ZONAS_VALENDOR,
  type ZonaId,
} from "@/lib/mapa-valendor";

type Props = {
  className?: string;
};

const POS: Record<
  ZonaId,
  { x: number; y: number; labelX: number; labelY: number }
> = {
  centro: { x: 200, y: 165, labelX: 200, labelY: 148 },
  norte: { x: 200, y: 75, labelX: 200, labelY: 58 },
  sul: { x: 200, y: 255, labelX: 200, labelY: 278 },
  leste: { x: 295, y: 165, labelX: 318, labelY: 168 },
  oeste: { x: 105, y: 165, labelX: 82, labelY: 168 },
};

export function MapaValendor({ className = "" }: Props) {
  return (
    <div className={className}>
      <svg
        viewBox="0 0 400 320"
        className="mx-auto h-auto w-full max-w-lg"
        role="img"
        aria-label="Mapa operacional fictício da região de Valendor com marcadores coloridos por zona"
      >
        <rect width="400" height="320" fill="#f3f4f6" rx="8" />
        {/* Contorno fictício — silhueta urbana simplificada */}
        <path
          d="M 60 40 L 340 35 L 355 120 L 365 200 L 330 285 L 70 290 L 45 200 L 55 100 Z"
          fill="#e5e7eb"
          stroke="#9ca3af"
          strokeWidth="2"
        />
        <path
          d="M 120 90 L 280 85 L 300 160 L 285 240 L 115 245 L 95 160 Z"
          fill="#f9fafb"
          stroke="#d1d5db"
          strokeWidth="1.5"
          strokeDasharray="4 3"
        />
        {/* Eixos fictícios */}
        <line x1="200" y1="50" x2="200" y2="280" stroke="#cbd5e1" strokeWidth="3" />
        <line x1="80" y1="165" x2="320" y2="165" stroke="#cbd5e1" strokeWidth="3" />

        {ZONAS_VALENDOR.map((zona) => {
          const p = POS[zona.id];
          const r = zona.id === "centro" ? 10 : 8;
          const offset = 14;
          return (
            <g key={zona.id}>
              <text
                x={p.labelX}
                y={p.labelY}
                textAnchor="middle"
                className="fill-slate-600 text-[11px] font-medium"
                style={{ fontSize: 11 }}
              >
                {zona.nome.replace("Zona ", "")}
              </text>
              <circle
                cx={p.x - offset}
                cy={p.y}
                r={r}
                fill={COR_SUPORTE[zona.suporte]}
                stroke="#fff"
                strokeWidth={1.5}
              />
              <circle
                cx={p.x}
                cy={p.y}
                r={r}
                fill={COR_ATRASOS[zona.atrasos]}
                stroke="#fff"
                strokeWidth={1.5}
              />
              <circle
                cx={p.x + offset}
                cy={p.y}
                r={r}
                fill={COR_CAPACITACAO[zona.capacitacao]}
                stroke="#fff"
                strokeWidth={1.5}
              />
            </g>
          );
        })}

        <text x="200" y="305" textAnchor="middle" fill="#6b7280" style={{ fontSize: 10 }}>
          Região Metropolitana de Valendor · Mapa operacional (fictício)
        </text>
      </svg>
    </div>
  );
}
