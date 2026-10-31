import Link from "next/link";
import { SiteShell } from "@/components/layout/SiteShell";

const EXPERIENCIAS = [
  {
    href: "/experiencias/daltonismo",
    titulo: "Quando as cores não são suficientes",
    descricao:
      "Analise um mapa de São Paulo por e-mail e responda com base nas cores do painel.",
    tag: "Daltonismo",
  },
  {
    href: "/experiencias/tremor",
    titulo: "Quando controlar o mouse se torna um desafio",
    descricao:
      "Preencha a ficha de cadastro no sistema de Recursos Humanos.",
    tag: "Tremor motor",
  },
] as const;

const COMO_FUNCIONA = [
  {
    id: "escolha",
    titulo: "Seleção do módulo",
    texto: "Escolha Daltonismo ou Tremor motor na página inicial.",
  },
  {
    id: "fluxo",
    titulo: "Atividade",
    texto: "Siga as etapas indicadas no topo da tela.",
  },
  {
    id: "conclusao",
    titulo: "Conclusão",
    texto:
      "Ao terminar, volte ao início ou abra o outro módulo.",
  },
] as const;

export default function HomePage() {
  return (
    <SiteShell width="wide">
      <div className="flex w-full flex-col">
        <div className="max-w-3xl">
          <p className="inline-flex rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800 ring-1 ring-teal-200 dark:bg-neutral-900 dark:text-neutral-200 dark:ring-neutral-700">
            Atividades práticas
          </p>
          <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-slate-900 dark:text-neutral-100 sm:text-4xl">
            Além das Barreiras
          </h1>
          <p className="mt-2 text-lg font-medium text-slate-700 dark:text-neutral-300">
            Capacitismo no ambiente de trabalho
          </p>
          <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-neutral-400">
            Dois cenários de rotina profissional para você percorrer no seu ritmo.
          </p>
        </div>

        <section className="mt-10 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-900 sm:p-8">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-neutral-100">
            Como funciona
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-3 sm:items-stretch">
            {COMO_FUNCIONA.map((item) => (
              <li
                key={item.id}
                className="flex min-h-[7.5rem] rounded-xl bg-slate-50 p-4 ring-1 ring-slate-100 dark:bg-neutral-800/80 dark:ring-neutral-700 sm:min-h-0"
              >
                <div className="flex w-full flex-col">
                <h3 className="font-semibold text-slate-900 dark:text-neutral-100">
                  {item.titulo}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 dark:text-neutral-400">
                  {item.texto}
                </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <h2 className="mt-12 text-lg font-semibold text-slate-900 dark:text-neutral-100">
          Escolha por onde começar
        </h2>
        <div className="mt-4 grid gap-6 md:grid-cols-2">
          {EXPERIENCIAS.map((exp) => (
            <Link
              key={exp.href}
              href={exp.href}
              className="group flex cursor-pointer flex-col rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all hover:border-teal-200 hover:shadow-md dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-neutral-500 sm:p-8"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-neutral-300">
                {exp.tag}
              </p>
              <h3 className="mt-4 text-xl font-semibold text-slate-900 group-hover:text-teal-900 dark:text-neutral-100 dark:group-hover:text-neutral-200">
                {exp.titulo}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600 dark:text-neutral-400">
                {exp.descricao}
              </p>
              <span className="mt-8 inline-flex w-fit self-end items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white group-hover:bg-slate-800 dark:bg-neutral-100 dark:text-neutral-950 dark:group-hover:bg-neutral-200">
                Iniciar experiência
                <span aria-hidden>→</span>
              </span>
            </Link>
          ))}
        </div>

        <section
          className="mt-10 w-full rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-900 sm:p-8"
          aria-label="Aviso sobre os cenários"
        >
          <p className="text-center text-sm leading-relaxed text-slate-600 dark:text-neutral-400">
            Personagens, empresas e indicadores dos mapas são inventados. Os
            cenários servem apenas como exercício interno.
          </p>
        </section>
      </div>
    </SiteShell>
  );
}
