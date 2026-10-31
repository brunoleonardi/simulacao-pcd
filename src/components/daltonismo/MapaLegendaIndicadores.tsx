import type { PerfilDaltonismo, PerfilVisualMapa } from "@/lib/colorBlind";
import {
  corPrioridadeExibicao,
  FAIXA_MAPA_ROTULO,
  FAIXAS_PRIORIDADE_MAPA,
} from "@/lib/mapa-sp-subprefeituras";

export function MapaLegendaIndicadores({
  perfilVisual = "oficial",
  perfilExperiencia,
}: {
  perfilVisual?: PerfilVisualMapa;
  perfilExperiencia?: PerfilDaltonismo;
}) {
  return (
    <aside
      className="rounded-lg border border-slate-200 bg-white/95 p-3 shadow-sm backdrop-blur-sm dark:border-neutral-700 dark:bg-neutral-900 sm:p-4"
      aria-label="Legenda do mapa"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-700 dark:text-neutral-300">
        Legenda
      </p>
      <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-neutral-400">
        {perfilVisual === "visao-tipica" ? (
          <>
            Referência das cores do mapa como no material original da operação.
            Use para conferir o que cada tom significa em prioridade.
          </>
        ) : perfilVisual === "oficial" ? (
          <>
            Cada cor é um nível de prioridade da região. Quanto mais escura a
            cor e mais abaixo na lista, maior a prioridade.
          </>
        ) : (
          <>
            Cada quadrado é um nível de prioridade da região. Consulte aqui
            para saber o que a cor de uma subprefeitura no mapa representa ao
            responder o e-mail.
          </>
        )}
      </p>
      <div className="mt-3">
        <p className="text-xs font-semibold text-slate-800 dark:text-neutral-200">
          Prioridade da região
        </p>
        <ul className="mt-2 space-y-1.5">
          {FAIXAS_PRIORIDADE_MAPA.map((faixa) => (
            <li
              key={faixa}
              className="flex items-center gap-2 text-[11px] text-slate-700 dark:text-neutral-300"
            >
              <span
                className="h-4 w-4 shrink-0 rounded-sm ring-1 ring-slate-300"
                style={{
                  backgroundColor: corPrioridadeExibicao(
                    faixa,
                    perfilVisual,
                    perfilExperiencia,
                  ),
                }}
                aria-hidden
              />
              {FAIXA_MAPA_ROTULO[faixa]}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
