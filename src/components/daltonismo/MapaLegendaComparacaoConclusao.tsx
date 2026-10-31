import type { PerfilDaltonismo } from "@/lib/colorBlind";
import {
  corPrioridadeExibicao,
  corReferenciaVisaoTipica,
  FAIXA_MAPA_ROTULO,
  FAIXAS_PRIORIDADE_MAPA,
} from "@/lib/mapa-sp-subprefeituras";

export function MapaLegendaComparacaoConclusao({
  perfilDaltonismo,
}: {
  perfilDaltonismo: PerfilDaltonismo;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-4 dark:border-neutral-700 dark:bg-neutral-800/50">
      <p className="text-sm font-semibold text-slate-900 dark:text-neutral-100">
        Legenda · prioridade da região
      </p>
      <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-neutral-400">
        À esquerda, a cor de referência do mapa operacional. À direita, a cor
        como você viu durante a tarefa. A lista ajuda a comparar nível a nível.
      </p>
      <div className="mt-3 grid grid-cols-[1fr_auto_auto] gap-x-3 gap-y-1 text-[10px] font-medium uppercase tracking-wide text-slate-500 dark:text-neutral-500">
        <span>Nível</span>
        <span className="text-center">Referência</span>
        <span className="text-center">Na tarefa</span>
      </div>
      <ul className="mt-1 space-y-1.5">
        {FAIXAS_PRIORIDADE_MAPA.map((faixa) => (
          <li
            key={faixa}
            className="grid grid-cols-[1fr_auto_auto] items-center gap-x-3 text-[11px] text-slate-700 dark:text-neutral-300"
          >
            <span>{FAIXA_MAPA_ROTULO[faixa]}</span>
            <span
              className="h-4 w-4 shrink-0 rounded-sm ring-1 ring-slate-300 dark:ring-neutral-600"
              style={{
                backgroundColor: corReferenciaVisaoTipica(
                  faixa,
                  perfilDaltonismo,
                ),
              }}
              title="Referência do mapa"
              aria-hidden
            />
            <span
              className="h-4 w-4 shrink-0 rounded-sm ring-1 ring-slate-300 dark:ring-neutral-600"
              style={{
                backgroundColor: corPrioridadeExibicao(
                  faixa,
                  perfilDaltonismo,
                ),
              }}
              title="Cor na tarefa"
              aria-hidden
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
