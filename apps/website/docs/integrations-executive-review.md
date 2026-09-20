# Integrações, Chroma e revisão executiva

Implementação dos handoffs 04 e 05, integrada à home nos quatro idiomas. A seção de Integrações explica as conexões do produto; a revisão executiva permite investigar uma release por perguntas, filtros, fontes e condições de revisão. O Hero existente recebe uma moldura Chroma como feedback de uma nova seleção aplicada pelo grafo.

## Integração com a página

`#integrations` vem após o conjunto existente de atribuição/intenção. `#executive-review` vem imediatamente depois, antes de voz, relatórios e acesso antecipado. Os destinos `#why`, `#movement-details`, `#attribution`, `#intent`, `#voice`, `#pricing` e `#early-access` permanecem separados e funcionais. O Header e o drawer incluem o link de Integrações.

Dark é o padrão do HTML renderizado no servidor e do estado Jotai. A preferência válida salva em `langdrift.website.theme` continua sendo restaurada, inclusive light após recarregar. Essa restauração ocorre no cliente; a entrega não garante ausência de uma passagem inicial por dark para quem salvou light.

Os avisos visíveis de demo, illustrative ou preview solicitados originalmente nos documentos foram omitidos conforme a orientação posterior do proprietário. O intervalo da revisão é apresentado como um período fixo de quatro semanas.

## Integrações

A composição mantém conteúdo em HTML: projeto/SDK, conexão LangDrift MCP, núcleo LangDrift e os três conectores. As linhas SVG são decorativas; os textos explicam as relações sem depender de cor ou hover. No mobile, a ordem é projeto → plataforma → GitHub → Linear → Slack, sem transformar as ferramentas em uma cadeia de dependências.

| Conexão | Papel comunicado |
| --- | --- |
| SDK + LangDrift MCP | O SDK prepara e valida os dados; a conexão própria envia o contexto à plataforma e sustenta a experiência do dashboard. |
| GitHub | Necessário para o fluxo descrito de abertura de pull requests com template e contexto. |
| Linear | Replicação opcional de specs e tickets no planejamento da equipe. |
| Slack | Notificações opcionais que apontam para o contexto no LangDrift. |

As marcas são assets locais, com variantes de tema quando aplicável, dimensões explícitas e nomes adjacentes em texto. A [origem dos assets](../public/integrations/README.md) está registrada junto aos arquivos. O detalhe técnico reutiliza o `BasicAccordion` corrigido do Smooth UI, com heading e associações acessíveis. Os cards são informativos; a seção não executa OAuth, conecta ferramentas, envia mensagens ou abre PRs. Também não promete sincronização bidirecional ou compatibilidade universal com MCP.

## Chroma do Hero

O brilho está restrito à moldura do chart card, com laranja predominante e acentos azul/violeta. A passagem CSS dura 600 ms e acompanha imediatamente uma nova seleção válida aplicada pelo grafo. O conteúdo do chart permanece em uma única instância, sem filtros sobre números/eixos, remount, clone ou captura em canvas.

`heroSelectionAtom` mantém a seleção e sua origem no mesmo estado Jotai. A interface numérica existente de `selectedPointAtom` foi preservada; o adapter usa `selectHeroGraphPointAtom` ao aplicar um evento validado do Sinapsi. Assim, render inicial, hover, seleção repetida, seleção originada no próprio chart e mudança de tema não criam uma confirmação falsa do grafo.

A camada tem `aria-hidden` e `pointer-events: none`. Seleções sucessivas substituem a passagem anterior; não há fila, loop de renderização ou estado React por frame. Movimento reduzido preserva a atualização dos dados com moldura estática. O popup do node continua sob responsabilidade do Sinapsi; nenhuma alteração no pacote foi necessária nesta entrega.

## Revisão executiva

Um fixture único fornece 12 eventos, 32 fontes e quatro revisões abertas. As fontes têm tipos explícitos: 10 especificações, sete decisões, nove verificações e seis registros de feedback. E06 e E12 não têm fontes vinculadas; seus pedidos de revisão não preenchem artificialmente a matriz de evidências.

| Recorte | Eventos | Com fontes | Revisões abertas |
| --- | ---: | ---: | ---: |
| Release completa | 12 | 10 | 4 |
| Onboarding | 6 | 5 | 3 |
| Integrações | 4 | 4 | 0 |
| Permissões | 2 | 1 | 1 |

No conjunto completo, sete eventos são Expected, três Unexpected e dois ainda não têm classificação. Classificação, presença de fontes e revisão aberta são dimensões independentes. As contagens não representam confiança, causalidade, benefício ou uma fórmula de Product Vision.

As três perguntas aplicam presets locais. Target, classificação e foco se intersectam em uma seleção única; indicadores, resposta, matriz e timeline derivam dela. As barras preservam a distribuição da release completa para comparação. Controles nativos oferecem a mesma seleção possível pelo clique nos segmentos.

A matriz usa tabela HTML e se reorganiza em blocos no mobile sem duplicar seus registros. Fontes vinculadas abrem um inspector local com ID, tipo e excerpt. Células não vinculadas são informativas e não entram na ordem de foco. As condições de revisão preservam semanas fixas e condições pendentes sem inventar datas.

O estado vazio remove respostas, referências e revisões anteriores e mostra zero eventos/targets/revisões, com traço no indicador de evidência. A ausência de revisões registradas em um recorte com eventos recebe explicação própria, sem sugerir aprovação automática.

## Conteúdo, componentes e arquivos

Os catálogos en, pt-BR, zh-Hant e ja incluem perguntas, filtros, respostas com pluralização, nomes acessíveis, 12 títulos/resumos, 32 excerpts e quatro revisões com checkpoints, limites e próximas decisões. IDs, âncoras e associações permanecem iguais entre idiomas. As rotas e o provider existentes foram reutilizados.

| Responsabilidade | Arquivos principais |
| --- | --- |
| Composição e navegação | `src/app/[locale]/page.tsx`, `src/components/website-header.tsx` e seu CSS |
| Integrações | `src/components/integrations-section.tsx`, `integrations-section.css`, `src/messages/integrations.ts`, `public/integrations/` |
| Seleção e Chroma | `src/state.ts`, `src/components/hero-chart.tsx`, `hero-sinapsi-graph.tsx`, `hero-demo.css` |
| Revisão executiva | `src/components/executive-review-section.tsx`, `executive-review-demo.tsx`, `executive-review-panels.tsx` e estilos |
| Fixture, filtros e agregações | `src/lib/executive-review-data.ts` |
| Copy da revisão | `src/messages/executive-review/` |
| Barras compartilhadas | `packages/react/src/ui/target-distribution-chart/`, a partir da raiz do repositório |
| Verificação automatizada | `tests/executive-review.test.mjs`, `tests/hero-graph.test.mjs`, `tests/home.test.mjs` |

O gráfico de distribuição reutiliza Recharts 3.10.1 já instalado, encapsulado em um componente compartilhado de `packages/react/src/ui`. Como não havia Chart, Card ou Badge shadcn instalados, a composição usa HTML semântico e os tokens existentes, sem novas dependências. Integrações reutiliza o accordion existente; matriz, inspector e timeline usam HTML semântico. O Chroma usa CSS local. Não foi introduzida uma engine de diagramas, um segundo provider de idioma ou uma store compartilhada entre essas seções.

## Verificação realizada

| Verificação final | Resultado |
| --- | --- |
| `pnpm lint` | 182 arquivos, passou. |
| `pnpm typecheck` | Seis pacotes, 6/6 passaram. |
| `pnpm build` | Seis pacotes, 6/6 passaram; inclui Website, Console, SSO, Mobile e os dois pacotes compartilhados. |
| Suítes do website | 25/25 testes passaram; os testes HTTP usaram o build Next de produção em `localhost:3006`. |
| Contrato da revisão | 14 testes cobrem unicidade/associação, todos os recortes numéricos exigidos, deduplicação, independência das dimensões e conteúdo/ICU nos quatro idiomas. |

No Chromium, em 1440 px e 375 px, foram observados:

- Presets, interseções e estado vazio com os totais especificados; barras permanecendo completas e hover sem alterar filtros.
- Clique em segmento preservando o foco da pergunta; filtro somente por classificação realçando os segmentos correspondentes nos três targets.
- Enter, Space e Tab nos controles nativos; reset retornando ao conjunto completo; mudanças rápidas terminando na última seleção.
- E02-D exibindo exatamente a decisão do compromisso manual. Abrir e reabrir a fonte foca/revela seu heading; fechar restaura o acionador visível. Filtrar por Permissions invalida a fonte e mantém foco no filtro.
- Fontes, referências e timeline antigas removidas no recorte vazio, sem overflow horizontal no mobile verificado.
- Estados não padrão do Hero e de Vision → Loop → Evidence preservados ao usar os filtros da revisão. Mudança de tema mantém o recorte; light salvo permanece após reload.
- IDs únicos e referências ARIA resolvidas. Foi corrigido o repasse de IDs dos targets aos paths do Recharts, que antes duplicava inclusive `integrations`; o reteste confirmou uma única âncora e nenhuma duplicata.
- Console sem erros em carregamento fresco após as correções, mantendo apenas mensagens de desenvolvimento e do logger existente.

O Chroma passou por oito grupos de verificações: novo clique no grafo; ausência de pulso em hover, repetição, chart, tema e locale; sequência rápida; preservação da identidade DOM e do foco; largura de 320 px; e movimento reduzido tanto inicial quanto alterado durante a sessão.

Integrações foi verificada em 320, 375, 768 e 1440 px, nos quatro idiomas e nos dois temas. O accordion respondeu a Enter, manteve o conteúdo fechado inerte e permitiu seguir por Tab até o CTA. O drawer fechou e restaurou foco e rolagem. Também foram inspecionados os layouts ja em 375 px e zh-Hant em 768 px, incluindo uma emulação de texto a 200% em zh-Hant; essa emulação não equivale a zoom nativo do navegador.

As seis capturas finais foram geradas e inspecionadas no build de produção. Em `localhost:3006`, um carregamento fresco mostrou somente o logger, sem erro de console, e a preferência light salva persistiu após recarregar.

Avisos não bloqueantes remanescentes: chunk do Mobile acima de 500 kB, ausência de outputs para o build `tsc --noEmit` de `@repo/react` no Turbo e `MODULE_TYPELESS_PACKAGE_JSON` no runner de testes TypeScript.

## Limites da entrega

A revisão usa registros locais e perguntas determinísticas. Não há LLM, microfone, consulta a workspace, backend de evidências, exportação ou avaliação real de uma release. O fixture da revisão é independente dos números do Hero e não modifica sua metodologia.

A validação descrita não inclui dispositivos iOS/Android físicos, avaliação completa com tecnologias assistivas, zoom nativo do navegador ou um novo deploy Vercel. As capturas registram a implementação local; não demonstram conexão real com GitHub, Linear ou Slack.

## Capturas

- [Integrações no desktop, dark](integrations-executive-review/desktop-integrations-dark.png)
- [Revisão executiva no desktop, dark](integrations-executive-review/desktop-review-dark.png)
- [Fonte selecionada no desktop, dark](integrations-executive-review/desktop-review-source-dark.png)
- [Revisão executiva no mobile, dark](integrations-executive-review/mobile-review-dark.png)
- [Recorte vazio no mobile, dark](integrations-executive-review/mobile-review-empty-dark.png)
- [Revisão executiva no desktop, light](integrations-executive-review/desktop-review-light.png)
