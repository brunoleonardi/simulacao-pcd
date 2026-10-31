"use client";

import { useState } from "react";

type Props = {
  onKey: (char: string) => void;
  onBackspace: () => void;
  onConfirm: () => void;
  onClose: () => void;
};

type KeyDef = {
  id: string;
  label: string;
  output?: string;
  width?: "normal" | "wide" | "xwide" | "space";
  action?: "backspace" | "shift" | "space" | "confirm" | "close";
};

const ROWS: KeyDef[][] = [
  [
    { id: "1", label: "1", output: "1" },
    { id: "2", label: "2", output: "2" },
    { id: "3", label: "3", output: "3" },
    { id: "4", label: "4", output: "4" },
    { id: "5", label: "5", output: "5" },
    { id: "6", label: "6", output: "6" },
    { id: "7", label: "7", output: "7" },
    { id: "8", label: "8", output: "8" },
    { id: "9", label: "9", output: "9" },
    { id: "0", label: "0", output: "0" },
    { id: "dash", label: "-", output: "-" },
    { id: "at", label: "@", output: "@" },
  ],
  [
    { id: "q", label: "Q", output: "q" },
    { id: "w", label: "W", output: "w" },
    { id: "e", label: "E", output: "e" },
    { id: "r", label: "R", output: "r" },
    { id: "t", label: "T", output: "t" },
    { id: "y", label: "Y", output: "y" },
    { id: "u", label: "U", output: "u" },
    { id: "i", label: "I", output: "i" },
    { id: "o", label: "O", output: "o" },
    { id: "p", label: "P", output: "p" },
  ],
  [
    { id: "a", label: "A", output: "a" },
    { id: "s", label: "S", output: "s" },
    { id: "d", label: "D", output: "d" },
    { id: "f", label: "F", output: "f" },
    { id: "g", label: "G", output: "g" },
    { id: "h", label: "H", output: "h" },
    { id: "j", label: "J", output: "j" },
    { id: "k", label: "K", output: "k" },
    { id: "l", label: "L", output: "l" },
    { id: "ccedil", label: "Ç", output: "ç" },
  ],
  [
    { id: "shift", label: "⇧", action: "shift", width: "wide" },
    { id: "z", label: "Z", output: "z" },
    { id: "x", label: "X", output: "x" },
    { id: "c", label: "C", output: "c" },
    { id: "v", label: "V", output: "v" },
    { id: "b", label: "B", output: "b" },
    { id: "n", label: "N", output: "n" },
    { id: "m", label: "M", output: "m" },
    { id: "dot", label: ".", output: "." },
    { id: "backspace", label: "⌫", action: "backspace", width: "wide" },
  ],
  [
    { id: "close", label: "Fechar", action: "close", width: "wide" },
    { id: "space", label: "Espaço", action: "space", width: "space" },
    { id: "confirm", label: "Confirmar", action: "confirm", width: "wide" },
  ],
];

const ACCENT_KEYS: KeyDef[] = [
  { id: "atilde", label: "Ã", output: "ã" },
  { id: "aacute", label: "Á", output: "á" },
  { id: "eacute", label: "É", output: "é" },
  { id: "iacute", label: "Í", output: "í" },
  { id: "oacute", label: "Ó", output: "ó" },
  { id: "uacute", label: "Ú", output: "ú" },
];

const widthClass: Record<NonNullable<KeyDef["width"]>, string> = {
  normal: "min-w-[1.85rem] flex-1 max-w-[2.25rem]",
  wide: "min-w-[2.75rem] px-2 flex-[1.2]",
  xwide: "min-w-[4rem] flex-[2]",
  space: "min-w-[8rem] flex-[4] max-w-none",
};

function keyLabel(key: KeyDef, shift: boolean): string {
  if (key.action || !key.output) return key.label;
  if (key.output.length !== 1 || !/[a-zç]/i.test(key.output)) return key.label;
  const ch = key.output;
  return shift ? ch.toUpperCase() : ch.toLowerCase();
}

export function VirtualKeyboard({
  onKey,
  onBackspace,
  onConfirm,
  onClose,
}: Props) {
  const [shift, setShift] = useState(false);

  function emitChar(raw: string) {
    if (raw.length === 1 && /[a-z]/i.test(raw)) {
      onKey(shift ? raw.toUpperCase() : raw.toLowerCase());
      setShift(false);
      return;
    }
    onKey(raw);
  }

  function handleKey(key: KeyDef) {
    switch (key.action) {
      case "shift":
        setShift((s) => !s);
        return;
      case "backspace":
        onBackspace();
        return;
      case "space":
        onKey(" ");
        return;
      case "confirm":
        onConfirm();
        return;
      case "close":
        onClose();
        return;
      default:
        if (key.output) emitChar(key.output);
    }
  }

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[60] border-t border-slate-400 bg-slate-300/95 p-2 shadow-lg backdrop-blur-sm dark:border-neutral-600 dark:bg-neutral-900 sm:p-3"
      role="group"
      aria-label="Teclado virtual QWERTY"
    >
      <div className="mx-auto max-w-3xl space-y-1.5">
        <div className="flex flex-wrap justify-center gap-1 px-1">
          {ACCENT_KEYS.map((key) => (
            <VkKey
              key={key.id}
              keyDef={key}
              shift={shift}
              active={false}
              onPress={() => handleKey(key)}
            />
          ))}
        </div>

        {ROWS.map((row, ri) => (
          <div
            key={ri}
            className={`flex justify-center gap-1 ${ri === 2 ? "pl-3 sm:pl-4" : ""} ${ri === 3 ? "pl-1" : ""}`}
          >
            {row.map((key) => (
              <VkKey
                key={key.id}
                keyDef={key}
                shift={shift}
                active={key.action === "shift" && shift}
                onPress={() => handleKey(key)}
              />
            ))}
          </div>
        ))}

        <p className="pt-1 text-center text-[10px] text-slate-600 dark:text-neutral-400 sm:text-xs">
          Layout QWERTY — use o mouse para digitar (teclado físico desativado).
        </p>
      </div>
    </div>
  );
}

function VkKey({
  keyDef,
  shift,
  active,
  onPress,
}: {
  keyDef: KeyDef;
  shift: boolean;
  active: boolean;
  onPress: () => void;
}) {
  const w = keyDef.width ?? "normal";
  const isAction = Boolean(keyDef.action);

  return (
    <button
      type="button"
      data-vk-key
      onClick={onPress}
      className={`${widthClass[w]} cursor-pointer rounded-md border border-slate-400 bg-gradient-to-b from-white to-slate-100 py-2.5 text-center text-xs font-semibold text-slate-800 shadow-[0_2px_0_0_#94a3b8] transition-[transform,shadow,background] hover:from-slate-50 hover:to-slate-200 active:translate-y-px active:shadow-[0_1px_0_0_#94a3b8] dark:border-neutral-600 dark:from-neutral-700 dark:to-neutral-800 dark:text-neutral-100 dark:shadow-[0_2px_0_0_#262626] dark:hover:from-neutral-600 dark:hover:to-neutral-700 dark:active:shadow-[0_1px_0_0_#262626] sm:text-sm ${
        active
          ? "border-slate-600 bg-slate-200 ring-1 ring-slate-500 dark:border-neutral-500 dark:bg-neutral-600 dark:ring-neutral-500"
          : ""
      } ${isAction && keyDef.action !== "shift" ? "text-[10px] sm:text-xs" : ""}`}
    >
      {keyLabel(keyDef, shift)}
    </button>
  );
}
