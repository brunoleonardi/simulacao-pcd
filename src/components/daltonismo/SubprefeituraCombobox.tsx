"use client";

import { useId, useState } from "react";
import { ChevronsUpDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ShadcnButton } from "@/components/ui/shadcn-button";
import { Label } from "@/components/ui/label";
import type { SubprefeituraId } from "@/lib/mapa-sp-subprefeituras";

type Opcao = { id: SubprefeituraId; nome: string };

type Props = {
  id?: string;
  rotulo: string;
  value: SubprefeituraId | "";
  opcoes: Opcao[];
  onChange: (id: SubprefeituraId) => void;
  placeholder?: string;
};

export function SubprefeituraCombobox({
  id: idProp,
  rotulo,
  value,
  opcoes,
  onChange,
  placeholder = "Selecione a subprefeitura…",
}: Props) {
  const generatedId = useId();
  const fieldId = idProp ?? generatedId;
  const [aberto, setAberto] = useState(false);

  const selecionada = opcoes.find((o) => o.id === value);

  return (
    <div className="space-y-2">
      <Label htmlFor={fieldId} className="text-slate-800 dark:text-neutral-200">
        {rotulo}
      </Label>
      <Popover open={aberto} onOpenChange={setAberto}>
        <PopoverTrigger
          id={fieldId}
          aria-expanded={aberto}
          aria-haspopup="listbox"
          render={
            <ShadcnButton
              variant="outline"
              size="lg"
              className={cn(
                "h-11 w-full justify-between rounded-lg border-slate-300 bg-white px-3 text-left text-sm font-normal text-slate-900 shadow-sm dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100",
                !selecionada && "text-muted-foreground",
              )}
            />
          }
        >
          <span className="truncate">
            {selecionada ? selecionada.nome : placeholder}
          </span>
          <ChevronsUpDownIcon className="ml-2 size-4 shrink-0 opacity-50" />
        </PopoverTrigger>
        <PopoverContent className="w-[min(100vw-2rem,28rem)] p-0" align="start">
          <Command>
            <CommandInput placeholder="Filtrar por nome…" />
            <CommandList>
              <CommandEmpty>Nenhuma subprefeitura encontrada.</CommandEmpty>
              <CommandGroup>
                {opcoes.map((opcao) => (
                  <CommandItem
                    key={opcao.id}
                    value={opcao.nome}
                    className="cursor-pointer"
                    data-checked={value === opcao.id}
                    onSelect={() => {
                      onChange(opcao.id);
                      setAberto(false);
                    }}
                  >
                    {opcao.nome}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
