# Além das Barreiras

**Capacitismo no ambiente de trabalho** — simulações interativas que colocam você em tarefas reais de rotina profissional, com barreiras sensoriais e motoras, para refletir sobre acessibilidade no dia a dia do trabalho.

> Personagens, empresas e indicadores dos mapas são fictícios. Os cenários servem como exercício interno de conscientização, não como avaliação de desempenho.

---

## Intuito do projeto

Muitas barreiras no trabalho não aparecem em políticas formais: aparecem em **e-mails com prazo**, **mapas coloridos**, **formulários apertados** e **interfaces que assumem visão e controle motor “padrão”**.

Este repositório reúne **duas experiências** em formato web (Next.js), cada uma com fluxo **Preparação → Atividade → Conclusão**:

| Módulo | Cenário | O que você faz |
|--------|---------|----------------|
| **Daltonismo** | Operações · e-mail + mapa de São Paulo | Escolhe um perfil de visão de cores, lê a demanda como no correio, interpreta o mapa das subprefeituras pela legenda e responde três perguntas de prioridade. |
| **Parkinson** | RH · ficha de cadastro | Preenche campos com simulação de tremor no cursor e teclado virtual, como quem tem dificuldade de apontar e clicar com precisão. |

O objetivo não é “acertar por acertar”, e sim **sentir o atrito** de tarefas comuns quando a interface ou a informação não foi pensada para todo mundo — e, na conclusão, **comparar** o que você viu com uma referência mais acessível (por exemplo, mapa com cores de referência ou formulário sem tremor).

---

## Daltonismo · detalhes técnicos (resumo)

- Mapa operacional de **subprefeituras de São Paulo** (GeoJSON derivado de dados abertos; script `npm run build:mapa-sp`).
- **Mesma paleta de prioridade** na atividade e na conclusão: na tarefa as cores passam por **simulação**; no fechamento você vê a **referência** sem simulação.
- Simulação: **Machado et al. (2009)** para protanopia/deuteranopia; **Brettel et al. (1997)** para tritanopia (via pipeline alinhado ao [DaltonLens](https://daltonlens.org/)).
- Nenhum simulador reproduz com **100% de fidelidade** a visão de uma pessoa real (variação individual, monitor, luz). A conclusão inclui uma nota curta sobre esse limite.

---

## Parkinson · detalhes técnicos (resumo)

- Offset aleatório no cursor durante a simulação, com clique sintético nos alvos sob o ponteiro “tremido”.
- Teclado virtual para reduzir dependência de digitação precisa no teclado físico.

---

## Como rodar

Requisitos: **Node.js 20+**, npm.

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

Outros comandos:

```bash
npm run build    # build de produção
npm run start    # servir build
npm run lint     # ESLint
```

Regenerar GeoJSON do mapa (opcional):

```bash
npm run build:mapa-sp
```

---

## Stack principal

- [Next.js](https://nextjs.org) (App Router) · React 19 · TypeScript  
- [Tailwind CSS](https://tailwindcss.com) v4  
- [MapLibre GL](https://maplibre.org/) + OpenStreetMap  
- [shadcn/ui](https://ui.shadcn.com) (combobox de respostas, etc.)

---

## Estrutura (visão geral)

```
src/
├── app/                    # rotas (/, experiencias/daltonismo, experiencias/tremor, reflexão)
├── components/
│   ├── daltonismo/         # e-mail, mapa, legenda, combobox
│   ├── tremor/             # formulário RH, teclado virtual
│   └── layout/             # shell, header, reiniciar experiência
└── lib/                    # cores/simulação CVD, mapa SP, tremor
public/data/                # GeoJSON subprefeituras (após build:mapa-sp)
```

---

## Licença e uso

Projeto privado (`"private": true` no `package.json`). Adapte créditos e avisos institucionais conforme o contexto em que for utilizado (treinamento, faculdade, RH, etc.).

---

**Além das Barreiras** — porque acessibilidade também se pratica no e-mail que você manda, no mapa que você publica e no formulário que você exige que todos preencham.
