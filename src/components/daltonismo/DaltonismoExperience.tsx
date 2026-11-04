"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ExperienceChrome } from "@/components/layout/ExperienceChrome";
import { Panel } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { MapaSaoPauloOperacional } from "@/components/daltonismo/MapaSaoPauloDynamic";
import { MapaLegendaComparacaoConclusao } from "@/components/daltonismo/MapaLegendaComparacaoConclusao";
import { SubprefeituraCombobox } from "@/components/daltonismo/SubprefeituraCombobox";
import { NotaLimiteSimulacaoDaltonismo } from "@/components/daltonismo/NotaLimiteSimulacaoDaltonismo";
import { ActionGroup } from "@/components/ui/ActionGroup";
import { ExperienceRestartButton } from "@/components/layout/ExperienceRestartButton";
import {
  DALTONISMO_OPCOES,
  filtroCssDaltonismo,
  type DaltonismoTipo,
} from "@/lib/colorBlind";
import { ColorBlindFilters } from "@/components/daltonismo/ColorBlindFilters";
import {
  avaliarRespostasAtividade,
  nomeSubprefeitura,
  PERGUNTAS_ATIVIDADE_DALTONISMO,
  RESPOSTAS_ESPERADAS,
  SUBPREFEITURAS,
  type RespostasAtividade,
  type ResultadoPerguntaAtividade,
  type SubprefeituraId,
} from "@/lib/mapa-sp-subprefeituras";
import { setExperienceInProgress } from "@/lib/experience-progress";
import { loadSpSubprefeiturasGeoJson } from "@/lib/sp-subprefeituras-geojson";

type Etapa = "escolha" | "atividade" | "conclusao";

const RESPOSTAS_VAZIAS: RespostasAtividade = {
  "prioridade-minima": "",
  "prioridade-segunda-maior": "",
  "prioridade-maxima": "",
};

function respostasCompletas(r: RespostasAtividade): boolean {
  return PERGUNTAS_ATIVIDADE_DALTONISMO.every((p) => Boolean(r[p.id]));
}

const FLOW_FRAME =
  "mx-auto w-full max-w-3xl space-y-6 px-4 py-10 sm:px-6 sm:py-14";

export function DaltonismoExperience() {
  const [etapa, setEtapa] = useState<Etapa>("escolha");
  const [daltonismo, setDaltonismo] = useState<
    Exclude<DaltonismoTipo, "nenhum"> | null
  >(null);
  const [respostas, setRespostas] = useState<RespostasAtividade>(RESPOSTAS_VAZIAS);
  const [resultados, setResultados] = useState<ResultadoPerguntaAtividade[] | null>(
    null,
  );
  const conclusaoInicioRef = useRef<HTMLDivElement>(null);

  const subprefsOrdenadas = useMemo(
    () =>
      [...SUBPREFEITURAS].sort((a, b) =>
        a.nome.localeCompare(b.nome, "pt-BR"),
      ),
    [],
  );

  const filtroAtivo = etapa === "atividade" && daltonismo !== null;
  const estiloModoCor =
    filtroAtivo && daltonismo ? filtroCssDaltonismo(daltonismo) : undefined;

  const resumoPontuacao = useMemo(() => {
    if (!resultados) return null;
    const acertos = resultados.filter((r) => r.acertou).length;
    return { acertos, total: resultados.length };
  }, [resultados]);

  const enviarResposta = () => {
    setResultados(avaliarRespostasAtividade(respostas));
    setEtapa("conclusao");
  };

  useEffect(() => {
    if (etapa !== "conclusao" || !resultados) return;
    conclusaoInicioRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [etapa, resultados]);

  useEffect(() => {
    setExperienceInProgress("daltonismo", etapa !== "escolha");
  }, [etapa]);

  useEffect(() => {
    if (etapa === "escolha") {
      void loadSpSubprefeiturasGeoJson();
    }
  }, [etapa]);

  if (etapa === "escolha") {
    return (
      <div className={FLOW_FRAME}>
        <ExperienceChrome experience="daltonismo" step="preparacao" />
        <Panel badge="Operações · Visualização">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-neutral-100">
              Escolha como deseja ver as cores
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-neutral-400">
              Depois da escolha, o e-mail e o mapa aparecerão com o perfil
              selecionado.
            </p>
            <div className="mt-6 grid gap-3">
              {DALTONISMO_OPCOES.map((op) => (
                <button
                  key={op.id}
                  type="button"
                  onClick={() =>
                    setDaltonismo(op.id as Exclude<DaltonismoTipo, "nenhum">)
                  }
                  className={`cursor-pointer rounded-xl border p-4 text-left transition-all ${
                    daltonismo === op.id
                      ? "border-slate-900 bg-slate-50 ring-2 ring-slate-900 dark:border-neutral-400 dark:bg-neutral-800 dark:ring-neutral-400"
                      : "border-slate-200 hover:border-slate-300 dark:border-neutral-600 dark:hover:border-slate-500"
                  }`}
                >
                  <span className="font-semibold text-slate-900 dark:text-neutral-100">{op.label}</span>
                  <p className="mt-1 text-xs text-slate-600 dark:text-neutral-400">{op.descricao}</p>
                </button>
              ))}
            </div>
            <ActionGroup hint="Em seguida você verá o e-mail com a tarefa.">
              <Button
                disabled={!daltonismo}
                onClick={() => setEtapa("atividade")}
              >
                Abrir e-mail
              </Button>
              <Button href="/" variant="secondary">
                Voltar ao início
              </Button>
            </ActionGroup>
        </Panel>
      </div>
    );
  }

  if (etapa === "conclusao" && resultados && resumoPontuacao) {
    return (
      <div ref={conclusaoInicioRef} className={`${FLOW_FRAME} scroll-mt-24`}>
        <ExperienceChrome experience="daltonismo" step="conclusao" />
        <Panel title="Resposta enviada">
          <p className="text-sm text-slate-600 dark:text-neutral-400">
              Você acertou{" "}
              <strong className="text-slate-900 dark:text-neutral-100">
                {resumoPontuacao.acertos} de {resumoPontuacao.total}
              </strong>{" "}
              perguntas.
            </p>

            <ul className="mt-6 space-y-3">
              {resultados.map((item) => (
                <li
                  key={item.id}
                  className={`rounded-lg border px-4 py-3 ${
                    item.acertou
                      ? "border-emerald-200 bg-emerald-50/80 dark:border-emerald-900 dark:bg-emerald-950/40"
                      : "border-amber-200 bg-amber-50/80 dark:border-amber-900 dark:bg-amber-950/40"
                  }`}
                >
                  <p className="text-sm font-semibold text-slate-900 dark:text-neutral-100">
                    {item.acertou ? "Acertou" : "Errou"} · {item.rotuloFormulario}
                  </p>
                  {item.acertou ? (
                    <p className="mt-1 text-sm text-slate-700 dark:text-neutral-300">
                      {nomeSubprefeitura(item.respostaUsuario)}
                    </p>
                  ) : (
                    <dl className="mt-2 space-y-1 text-sm text-slate-700 dark:text-neutral-300">
                      <div>
                        <dt className="inline font-medium text-slate-800 dark:text-neutral-200">
                          Sua resposta:{" "}
                        </dt>
                        <dd className="inline">
                          {nomeSubprefeitura(item.respostaUsuario)}
                        </dd>
                      </div>
                      <div>
                        <dt className="inline font-medium text-slate-800 dark:text-neutral-200">
                          Resposta correta:{" "}
                        </dt>
                        <dd className="inline">
                          {nomeSubprefeitura(item.respostaCorreta)}
                        </dd>
                      </div>
                    </dl>
                  )}
                </li>
              ))}
            </ul>
            <NotaLimiteSimulacaoDaltonismo />
        </Panel>

        <Panel
          title="Mapa · visão típica"
          description="Mesmas prioridades do exercício, com as cores de referência do mapa operacional."
        >
          {daltonismo ? (
            <MapaLegendaComparacaoConclusao perfilDaltonismo={daltonismo} />
          ) : null}
          <div className="mt-4 rounded-lg bg-slate-50 p-2 ring-1 ring-slate-200 dark:bg-neutral-800/80 dark:ring-neutral-700 sm:p-3">
            {daltonismo ? (
              <MapaSaoPauloOperacional
                perfilVisual="visao-tipica"
                perfilExperiencia={daltonismo}
              />
            ) : null}
          </div>
          <ActionGroup hint="Reinicie para tentar de novo, volte ao início ou experimente a outra atividade.">
            <ExperienceRestartButton experience="daltonismo" />
            <Button href="/">Voltar ao início</Button>
            <Button href="/experiencias/tremor" variant="secondary">
              Parkinson
            </Button>
          </ActionGroup>
        </Panel>
      </div>
    );
  }

  return (
    <>
      <ColorBlindFilters />
      <div className="min-h-[min(100vh,100dvh)] w-full bg-[#e8eaed] px-4 py-6 dark:bg-black sm:px-6">
        <div className="mx-auto min-h-[calc(100vh-8rem)] max-w-3xl">
          <div style={estiloModoCor}>
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-t-xl bg-[#f1f3f4] px-3 py-2 text-xs text-slate-600 dark:bg-neutral-800 dark:text-neutral-300">
              <span className="font-medium">Correio · Operações</span>
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-slate-500 dark:text-neutral-400">
                  Modo:{" "}
                  <strong className="text-slate-800 dark:text-neutral-200">
                    {DALTONISMO_OPCOES.find((o) => o.id === daltonismo)?.label}
                  </strong>
                </span>
                <button
                  type="button"
                  className="cursor-pointer text-slate-600 underline-offset-2 hover:text-slate-900 hover:underline dark:text-neutral-300 dark:hover:text-neutral-50"
                  onClick={() => setEtapa("escolha")}
                >
                  Trocar
                </button>
                <Link
                  href="/"
                  className="text-slate-600 underline-offset-2 hover:text-slate-900 hover:underline dark:text-neutral-300 dark:hover:text-neutral-50"
                >
                  Sair
                </Link>
              </div>
            </div>

            <article className="overflow-hidden rounded-none bg-white shadow-md ring-1 ring-slate-200/80 ring-t-0 dark:bg-neutral-900 dark:ring-neutral-700">
              <header className="border-b border-slate-100 px-4 py-4 dark:border-neutral-800 sm:px-6">
                <h1 className="text-lg font-normal text-slate-900 dark:text-neutral-100 sm:text-xl">
                  Análise do mapa de São Paulo — resposta até o fim da tarde
                </h1>
                <dl className="mt-4 space-y-1 text-sm text-slate-600 dark:text-neutral-400">
                  <div className="flex flex-wrap gap-x-2">
                    <dt className="min-w-[3rem] font-medium text-slate-800 dark:text-neutral-200">
                      De:
                    </dt>
                    <dd>Roberto Mendes &lt;roberto.mendes@empresa.com.br&gt;</dd>
                  </div>
                  <div className="flex flex-wrap gap-x-2">
                    <dt className="min-w-[3rem] font-medium text-slate-800 dark:text-neutral-200">
                      Para:
                    </dt>
                    <dd>Mariana Costa &lt;mariana.costa@empresa.com.br&gt;</dd>
                  </div>
                  <div className="flex flex-wrap gap-x-2">
                    <dt className="min-w-[3rem] font-medium text-slate-800 dark:text-neutral-200">
                      Data:
                    </dt>
                    <dd>Hoje, 09:14</dd>
                  </div>
                </dl>
              </header>

              <div className="space-y-4 px-4 py-5 text-sm leading-relaxed text-slate-800 dark:text-neutral-200 sm:px-6 sm:text-base">
                <p>Mariana, bom dia.</p>
                <p>
                  Preciso que você analise o mapa das subprefeituras de{" "}
                  <strong>São Paulo</strong> (anexo abaixo) e me envie a resposta{" "}
                  <strong>até o fim da tarde</strong> para a reunião com a
                  diretoria.
                </p>
                <p>
                  As cores seguem a legenda <strong>Prioridade da região</strong>{" "}
                  no anexo. Responda comparando o tom de cada subprefeitura com a
                  escala da legenda.
                </p>
                <p className="font-medium text-slate-900 dark:text-neutral-100">Preciso saber:</p>
                <ul className="list-none space-y-2 border-l-2 border-slate-200 pl-4 dark:border-neutral-600">
                  {PERGUNTAS_ATIVIDADE_DALTONISMO.map((campo) => (
                    <li key={campo.id} className="text-slate-800 dark:text-neutral-200">
                      {campo.rotuloEmail}
                    </li>
                  ))}
                </ul>
                <p>Obrigado.</p>
                <p className="text-slate-600 dark:text-neutral-400">Roberto Mendes</p>
                <p className="text-xs text-slate-500 dark:text-neutral-400">Diretor de Operações</p>
              </div>
            </article>
          </div>

          <div className="overflow-hidden rounded-none bg-white shadow-md ring-1 ring-slate-200/80 ring-t-0 dark:bg-neutral-900 dark:ring-neutral-700">
            <div className="border-t border-slate-100 bg-slate-50 px-4 py-5 dark:border-neutral-800 dark:bg-neutral-800/70 sm:px-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-neutral-400">
                Anexo · mapa operacional
              </p>
              <div className="mt-3 rounded-lg bg-white p-2 ring-1 ring-slate-200 dark:bg-neutral-900 dark:ring-neutral-700 sm:p-3">
                {daltonismo && (
                  <MapaSaoPauloOperacional
                    key={daltonismo}
                    perfilVisual={daltonismo}
                  />
                )}
              </div>
            </div>
          </div>

          <div style={estiloModoCor}>
            <div className="overflow-hidden rounded-b-xl bg-white px-4 py-5 shadow-md ring-1 ring-slate-200/80 ring-t-0 dark:bg-neutral-900 dark:ring-neutral-700 sm:px-6">
              <p className="text-sm font-semibold text-slate-900 dark:text-neutral-100">Sua resposta</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-neutral-400">
                Use a legenda de prioridade da região e o mapa (passe o mouse para
                ver o nome de cada área). Abra cada campo e use o filtro de texto
                para achar a subprefeitura.
              </p>
              <div className="mt-4 space-y-5">
                {PERGUNTAS_ATIVIDADE_DALTONISMO.map((campo) => (
                  <SubprefeituraCombobox
                    key={campo.id}
                    id={`resposta-${campo.id}`}
                    rotulo={campo.rotuloFormulario}
                    value={respostas[campo.id]}
                    opcoes={subprefsOrdenadas}
                    onChange={(id) =>
                      setRespostas((prev) => ({
                        ...prev,
                        [campo.id]: id,
                      }))
                    }
                  />
                ))}
              </div>
              <div className="mt-6 flex justify-end">
                <Button
                  disabled={!respostasCompletas(respostas)}
                  onClick={enviarResposta}
                >
                  Enviar resposta
                </Button>
              </div>
            </div>
          </div>

          <p className="sr-only">
            Facilitador — referência: menor prioridade{" "}
            {nomeSubprefeitura(RESPOSTAS_ESPERADAS.menorPrioridade)}, segunda maior{" "}
            {nomeSubprefeitura(RESPOSTAS_ESPERADAS.segundaMaiorPrioridade)}, maior{" "}
            {nomeSubprefeitura(RESPOSTAS_ESPERADAS.maiorPrioridade)}
          </p>
        </div>
      </div>
    </>
  );
}
