/** Nota de rodapé educativa — alinhada a revisões de simuladores (ex.: DaltonLens). */
export function NotaLimiteSimulacaoDaltonismo() {
  return (
    <aside
      className="mt-6 rounded-lg border border-slate-200 bg-slate-50/90 px-4 py-3 dark:border-neutral-700 dark:bg-neutral-800/60"
      aria-label="Limite científico da simulação de cores"
    >
      <p className="text-xs font-semibold text-slate-800 dark:text-neutral-200">
        Sobre a simulação de cores
      </p>
      <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-neutral-400">
        O mapa na atividade usa modelos publicados de deficiência cromática (por
        exemplo Machado et al., 2009, e Brettel et al., 1997) — são
        aproximações matemáticas úteis para treino e acessibilidade, não a
        visão exata de uma pessoa real. Cada daltônico difere; monitor,
        brilho e luz do ambiente também mudam o que se enxerga. Por isso{" "}
        <strong className="font-medium text-slate-700 dark:text-neutral-300">
          nenhuma simulação em tela pode ser 100% fiel
        </strong>
        ; a literatura trata os resultados como estimativas, validadas em
        média em estudos, não como “cópia pixel a pixel” da percepção alheia.
      </p>
    </aside>
  );
}
