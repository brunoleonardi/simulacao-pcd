"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { VirtualKeyboard } from "@/components/tremor/VirtualKeyboard";
import { ExperienceChrome } from "@/components/layout/ExperienceChrome";
import { ActionGroup } from "@/components/ui/ActionGroup";
import { Panel } from "@/components/ui/Panel";
import { computeTremorOffset, getTremorConfig } from "@/lib/tremor";
import { setExperienceInProgress } from "@/lib/experience-progress";

type CampoId = "nome" | "cargo" | "departamento" | "email" | "identificacao";

const CAMPOS: { id: CampoId; label: string }[] = [
  { id: "nome", label: "Nome do funcionário" },
  { id: "cargo", label: "Cargo" },
  { id: "departamento", label: "Departamento" },
  { id: "email", label: "E-mail corporativo" },
  { id: "identificacao", label: "Número de identificação" },
];

type Etapa = "intro" | "atividade" | "conclusao";

export function TremorExperience() {
  const [etapa, setEtapa] = useState<Etapa>("intro");
  const [simulacaoAtiva, setSimulacaoAtiva] = useState(false);
  const [valores, setValores] = useState<Record<CampoId, string>>({
    nome: "",
    cargo: "",
    departamento: "",
    email: "",
    identificacao: "",
  });
  const [campoAtivo, setCampoAtivo] = useState<CampoId | null>(null);
  const cursorOverlayRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const tremorRef = useRef({ x: 0, y: 0 });

  const preenchidos = CAMPOS.filter((c) => valores[c.id].trim().length > 0)
    .length;
  const todosPreenchidos = preenchidos === CAMPOS.length;

  useEffect(() => {
    setExperienceInProgress("tremor", etapa !== "intro");
  }, [etapa]);

  useEffect(() => {
    if (!simulacaoAtiva) return;
    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [simulacaoAtiva]);

  useEffect(() => {
    if (!simulacaoAtiva) return;

    const blockNativePointer = (e: Event) => {
      if (!e.isTrusted) return;
      e.preventDefault();
      e.stopImmediatePropagation();
    };

    const onDown = (e: MouseEvent) => {
      if (!e.isTrusted) return;
      e.preventDefault();
      e.stopImmediatePropagation();

      const x = mouseRef.current.x + tremorRef.current.x;
      const y = mouseRef.current.y + tremorRef.current.y;
      const el = document.elementFromPoint(x, y) as HTMLElement | null;
      if (!el) return;

      const target = el.closest<HTMLElement>(
        "button, input, [data-clickable], a",
      );
      if (!target || target.hasAttribute("disabled")) return;

      target.click();
    };

    window.addEventListener("mousedown", onDown, true);
    window.addEventListener("mouseup", blockNativePointer, true);
    window.addEventListener("click", blockNativePointer, true);

    return () => {
      window.removeEventListener("mousedown", onDown, true);
      window.removeEventListener("mouseup", blockNativePointer, true);
      window.removeEventListener("click", blockNativePointer, true);
    };
  }, [simulacaoAtiva]);

  useEffect(() => {
    if (!simulacaoAtiva) return;

    const tick = (t: number) => {
      const offset = computeTremorOffset(t, getTremorConfig());
      tremorRef.current = offset;
      const el = cursorOverlayRef.current;
      if (el) {
        el.style.left = `${mouseRef.current.x + offset.x}px`;
        el.style.top = `${mouseRef.current.y + offset.y}px`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [simulacaoAtiva]);

  useEffect(() => {
    if (simulacaoAtiva) document.body.classList.add("tremor-simulacao");
    else document.body.classList.remove("tremor-simulacao");
    return () => document.body.classList.remove("tremor-simulacao");
  }, [simulacaoAtiva]);

  useEffect(() => {
    if (!simulacaoAtiva) return;
    const blockKeys = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };
    window.addEventListener("keydown", blockKeys, true);
    return () => window.removeEventListener("keydown", blockKeys, true);
  }, [simulacaoAtiva]);

  const pararSimulacao = () => {
    setSimulacaoAtiva(false);
    setCampoAtivo(null);
    setEtapa("intro");
  };

  if (etapa === "intro") {
    return (
      <div className="space-y-6">
        <ExperienceChrome experience="tremor" step="preparacao" />
        <Panel badge="Recursos Humanos">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-neutral-100">
            Cadastro de funcionários
          </h1>
          <p className="mt-4 leading-relaxed text-slate-700 dark:text-neutral-300">
            Olá, João! Seja bem-vindo ao sistema de cadastro de funcionários.
          </p>
          <p className="mt-3 leading-relaxed text-slate-700 dark:text-neutral-300">
            Sua tarefa é preencher a ficha abaixo e enviar ao departamento de
            Recursos Humanos.
          </p>
          <ActionGroup hint="Preencha todos os campos e envie o cadastro.">
            <Button
              onClick={() => {
                setEtapa("atividade");
                setSimulacaoAtiva(true);
              }}
            >
              Iniciar cadastro →
            </Button>
          </ActionGroup>
        </Panel>
      </div>
    );
  }

  if (etapa === "conclusao") {
    return (
      <div className="space-y-6">
        <ExperienceChrome experience="tremor" step="conclusao" />
        <Panel title="Cadastro enviado">
          <p className="leading-relaxed text-slate-700 dark:text-neutral-300">
            Sua ficha foi enviada ao departamento de Recursos Humanos.
          </p>
          <ActionGroup hint="Volte ao início ou experimente a outra atividade.">
            <Button href="/">Voltar ao início</Button>
            <Button href="/experiencias/daltonismo" variant="secondary">
              Daltonismo
            </Button>
          </ActionGroup>
        </Panel>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      {simulacaoAtiva && (
        <div
          ref={cursorOverlayRef}
          className="pointer-events-none fixed z-[70] h-8 w-8 -translate-x-1/2 -translate-y-1/2"
          aria-hidden
        >
          <svg viewBox="0 0 24 24" className="h-8 w-8 text-slate-900 drop-shadow-md dark:text-neutral-100">
            <path
              d="M4 4 L4 18 L9 14 L12 20 L14 19 L11 13 L18 13 Z"
              fill="currentColor"
              stroke="#fff"
              strokeWidth={1}
            />
          </svg>
        </div>
      )}

      <div className={`space-y-6 ${campoAtivo ? "pb-64 sm:pb-72" : ""}`}>
        <ExperienceChrome
          experience="tremor"
          step="atividade"
          onBack={pararSimulacao}
          backLabel="Sair da atividade"
        />

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-100 px-4 py-3 ring-1 ring-slate-200 dark:bg-neutral-900 dark:ring-neutral-700">
          <p className="text-sm text-slate-800 dark:text-neutral-200">
            <span className="font-semibold">Progresso:</span> {preenchidos} de{" "}
            {CAMPOS.length} campos preenchidos
          </p>
          <Button
            variant="secondary"
            className="min-h-9 px-4 text-xs"
            data-clickable
            onClick={(e) => {
              e.stopPropagation();
              pararSimulacao();
            }}
          >
            Encerrar
          </Button>
        </div>

        <Panel title="Ficha cadastral — RH">
          <p className="mb-4 text-sm text-slate-600 dark:text-neutral-400">
            Toque em cada campo para abrir o teclado na tela. Use o botão{" "}
            <strong className="text-slate-800 dark:text-neutral-200">Confirmar</strong> ao terminar
            um campo.
          </p>
          <div className="divide-y divide-slate-100 rounded-xl ring-1 ring-slate-200 dark:divide-neutral-700 dark:ring-neutral-700">
            {CAMPOS.map((campo) => {
              const filled = valores[campo.id].trim().length > 0;
              const active = campoAtivo === campo.id;
              return (
                <div
                  key={campo.id}
                  className={`grid gap-2 px-4 py-3 sm:grid-cols-[180px_1fr] ${
                    active ? "bg-slate-100/80 dark:bg-neutral-800/60" : ""
                  }`}
                >
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-neutral-400">
                    {filled ? (
                      <span className="text-emerald-600 dark:text-emerald-400" aria-hidden>
                        ✓
                      </span>
                    ) : (
                      <span className="h-4 w-4 rounded-full ring-2 ring-slate-200 dark:ring-neutral-600" />
                    )}
                    {campo.label}
                  </label>
                  <input
                    readOnly
                    data-clickable
                    value={valores[campo.id]}
                    placeholder="Clique para digitar…"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCampoAtivo(campo.id);
                    }}
                    className={`rounded-xl border px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 dark:text-neutral-100 dark:placeholder:text-neutral-500 ${
                      active
                        ? "border-slate-700 ring-2 ring-slate-200 dark:border-neutral-400 dark:ring-neutral-600"
                        : "border-slate-300 bg-white dark:border-neutral-600 dark:bg-neutral-800"
                    }`}
                  />
                </div>
              );
            })}
          </div>
          <ActionGroup
            hint={
              todosPreenchidos
                ? "Posicione o cursor e clique em Enviar cadastro."
                : "Complete todos os campos para habilitar o envio."
            }
          >
            <button
              type="button"
              data-clickable
              disabled={!todosPreenchidos}
              onClick={(e) => {
                e.stopPropagation();
                setSimulacaoAtiva(false);
                setEtapa("conclusao");
              }}
              className="inline-flex min-h-11 w-full cursor-pointer items-center justify-center rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-neutral-100 dark:text-neutral-950 dark:hover:bg-neutral-200 sm:ml-auto sm:w-auto"
            >
              Enviar cadastro
            </button>
          </ActionGroup>
        </Panel>
      </div>

      {campoAtivo && simulacaoAtiva && (
        <VirtualKeyboard
          onKey={(char) => {
            const ch =
              campoAtivo === "email"
                ? char.toLowerCase()
                : char === " "
                  ? " "
                  : char;
            setValores((v) => ({
              ...v,
              [campoAtivo]: v[campoAtivo] + ch,
            }));
          }}
          onBackspace={() => {
            setValores((v) => ({
              ...v,
              [campoAtivo]: v[campoAtivo].slice(0, -1),
            }));
          }}
          onConfirm={() => setCampoAtivo(null)}
          onClose={() => setCampoAtivo(null)}
        />
      )}
    </div>
  );
}
