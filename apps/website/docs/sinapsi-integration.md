# Integração do Sinapsi no hero

O hero conecta o grafo ao Product Vision Curve: selecionar um node abre o card nativo do Sinapsi e atualiza o evento selecionado no chart e sua explicação. O grafo tem 48 nodes estáveis e rotação lenta (`move="rotate"`, `speed={0.2}`).

## Publicação e reprodução

A integração final depende de `sinapsi@0.2.0`. A verificação original descrita neste relatório usou o tarball local. Durante a entrega seguinte, Vision → Loop → Evidence, o proprietário publicou a versão no npm; a consulta ao registro confirmou a mesma integridade presente no lockfile. A publicação não está mais pendente. Este relatório não representa uma publicação do website; a validação posterior está registrada em [Vision → Loop → Evidence](vision-loop-evidence.md).

## Comportamento implementado

- Os 48 nodes se distribuem em quatro grupos de contexto, com conexões internas e entre grupos. Cada node aponta para um dos quatro eventos existentes; não foram criados novos scores. Os valores originais da curva continuam `91, 88, 84, 79, 73`.
- Todos os nodes têm apresentação `card`, com avatar, título, descrição traduzida, referência e badge do movimento original. Os avatares locais reutilizam os bytes das imagens já existentes.
- O listener nativo `sinapsi-node-click` valida o ID do node, o tipo do evento e a associação `payload.eventId` antes de atualizar `selectedPointAtom`. O Jotai e o logger existente continuam responsáveis pela seleção.
- O Sinapsi controla o popup, sua posição durante o movimento, o foco e o fechamento. Fechar o card por botão ou Escape preserva a seleção do chart. A integração não adiciona estado React por frame.
- A ativação é local ao node selecionado: node, arestas incidentes e vizinhos imediatos. A cor laranja mantém o papel de foco da marca.
- O ajuste de enquadramento do pacote usa os limites projetados do grafo. O website fornece um wrapper compacto, sem escala CSS adicional: até 580 px, proporção 6:5 no desktop e quadrado no mobile. O chart fica à esquerda e o grafo à direita; no mobile ficam empilhados.
- As cores do texto e as variáveis de superfície, borda e sombra do popup acompanham os temas claro e escuro. O header usa fundo translúcido de 74% no topo e 80% após scroll, com `blur(22px)` e saturação de 145%; há fallback sem backdrop-filter.
- O aviso visível “Illustrative data” foi removido do hero conforme solicitado. Os dados continuam sendo os fixtures existentes, sem alteração da metodologia do produto.
- Inglês (`/`), português (`/pt-br`), chinês tradicional (`/zh-hant`) e japonês (`/ja`) mantêm conteúdo, descrições dos nodes e rótulos acessíveis localizados. As URLs continuam previsíveis, com metadados e `html lang` correspondentes.

## Arquivos principais

| Responsabilidade | Arquivo |
| --- | --- |
| Grafo, cards e associação validada aos eventos | `src/lib/hero-demo-data.ts` |
| Web component, listener nativo e integração Jotai | `src/components/hero-sinapsi-graph.tsx` |
| Chart e seleção compartilhada | `src/components/hero-chart.tsx`, `src/state.ts` |
| Conteúdo dos nodes e rótulos acessíveis | `src/messages/demo.ts` |
| Enquadramento e temas do hero | `src/app/hero.css`, `src/components/hero-demo.css` |
| Header translúcido | `src/components/website-header.css` |
| Avatares locais | `public/demo/avatars/` |

## Verificação

| Camada | Resultado e escopo |
| --- | --- |
| Pacote Sinapsi | 111 testes passaram; 9 verificações de navegador via CDP passaram na validação do pacote. |
| Contrato do hero | 3 testes passaram: 48 nodes válidos nos quatro idiomas; seleção por evento validado e rejeição de entradas inválidas; identidade e conexões preservadas ao traduzir. |
| Rotas e conteúdo | 7 testes HTTP passaram contra o build de produção: quatro idiomas, metadados, seções, links, ausência de formulários fictícios, locale previsível e 404. |
| Website | Typecheck, build de produção e Biome dos arquivos alterados passaram. O build final carregou o pacote pelo tarball e gerou as quatro rotas localizadas. |

Comandos dos testes do website, a partir da raiz:

```sh
node --experimental-strip-types --test apps/website/tests/hero-graph.test.mjs
pnpm --filter website typecheck
pnpm --filter website build
pnpm --filter website exec next start --hostname 0.0.0.0 --port 3006
WEBSITE_TEST_URL=http://localhost:3006 node --test apps/website/tests/home.test.mjs
```

A verificação visual usou Chromium, desktop em 1440 px e mobile em 375 px. Foram conferidos o preenchimento do canvas compacto, a rotação em `0.2`, temas, tradução, ausência de overflow horizontal e a ligação entre card e chart. A navegação por teclado cobriu foco no grafo, setas, seleção por Enter e fechamento por botão/Escape. Mover apenas o foco não altera a seleção do chart. As capturas finais mostram o evento de pricing com o movimento original de −9 pontos.

Os testes de navegador cobrem os cenários observados; não constituem uma avaliação completa com leitores de tela, aparelhos iOS/Android reais, métricas de Core Web Vitals ou execução prolongada. A validação descrita foi feita com o artefato local, antes da publicação no registro.

## Capturas para revisão

As imagens abaixo registram o resultado local e não são assets servidos pelo website. Total aproximado: 537 KB.

- [Desktop em inglês, tema claro — 1440 × 1100](sinapsi-integration/desktop-en-light.png)
- [Desktop em português, tema escuro, card selecionado — 1440 × 1100](sinapsi-integration/desktop-pt-dark.png)
- [Mobile em português, hero completo e card selecionado — 375 × 1700](sinapsi-integration/mobile-pt-dark.png)
- [Mobile em português, detalhe do card e header — 375 × 850](sinapsi-integration/mobile-pt-card-detail.png)
