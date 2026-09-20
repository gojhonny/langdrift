# Vision → Loop → Evidence

A primeira seção após o Hero explica a relação entre intenção, mudanças e evidências por meio de três cenários independentes: mudança de prioridade, trade-off de produto e nova oportunidade. As tabs trocam o cenário completo; Vision, Loop e Evidence permanecem abertos. Cada cenário contém três registros, interpretação e pergunta em aberto.

## Integração

- `src/components/vision-loop-evidence-section.tsx` renderiza a composição, introdução e conclusão no servidor.
- `src/components/vision-loop-evidence-demo.tsx` mantém somente a seleção local de cenário. Não há fetch, timers, backend ou ligação ao estado Jotai do Hero.
- `src/lib/vision-loop-content.ts` define IDs estáveis e contratos de conteúdo. Os quatro catálogos em `src/messages/vision-loop/` possuem todos os textos, incluindo contexto adicional e nomes acessíveis. O servidor envia ao componente cliente somente o conteúdo do idioma atual.
- O cenário inicial é sempre `priority-shift`, inclusive no HTML do servidor. Painéis inativos ficam ocultos e sem conteúdo montado; trocar de cenário reinicia apenas seus detalhes. Selecionar novamente a tab ativa preserva os detalhes abertos.
- A nova seção assume `#why`. O bloco anterior permanece logo depois em `#movement-details`, com as quatro referências dos eventos do chart atualizadas. Header/Product e Hero/Veja o que mudou continuam em `#why`; o link de continuidade usa `#attribution`.
- A integração Sinapsi/Jotai, os 48 nodes, a rotação em `0.2` e os dados do Hero foram preservados.

Conforme instrução direta do usuário, não há rótulos visíveis de exemplo, “Illustrative data” ou avisos de protótipo. Os cenários continuam sendo conteúdo local independente, sem novas métricas ou alegações de conexão com dados reais.

## Componentes e acessibilidade

As cópias locais de Animated Tabs e Basic Accordion foram adaptadas dos registries oficiais do Smooth UI, em `packages/react/src/vendors/smoothui/`. Reutilizam Motion e Phosphor existentes, sem novas dependências ou substituição dos tokens globais.

Tabs têm nome localizado, roving tabindex, setas/Home/End, IDs únicos e associação ao painel. O scroll para revelar uma tab fica dentro do seletor e não desloca a página. Accordions usam heading envolvendo o botão, nomes específicos por registro e regiões fechadas com `inert` e `aria-hidden`. Mais de uma fonte pode ser aberta porque cada registro possui seu próprio accordion.

A lista de Evidence é um `ul`/`li` estável, alternativa permitida pelo handoff, sem feed, escala ou opacidade reduzida por posição. Uma breve transição CSS acompanha a entrada do cenário. As regras de movimento reduzido também funcionam quando a preferência muda com a página aberta; supressões pontuais do Biome justificam o uso de `!important` para sobrepor os estilos inline do Motion nesse caso.

## Verificações executadas

| Verificação | Resultado |
| --- | --- |
| `pnpm lint` | 167 arquivos, nenhum erro ou aviso. |
| `pnpm typecheck` | Seis workspaces passaram. |
| `pnpm build` | Seis workspaces passaram; Website, Console, SSO e Mobile geraram seus builds. |
| Testes existentes do website | 10 passaram: sete verificações HTTP contra o preview de produção e três testes do contrato do grafo. |
| Reprodução limpa dos passos do CI | Instalação congelada com store vazia: 581 pacotes baixados, zero reutilizados. Lint (165 arquivos da cópia de fonte), typecheck e seis builds passaram sem cache. |
| Interações no navegador | Seis grupos passaram: teclado das tabs, foco/accordions, IDs/ARIA, independência do Hero, scroll local a 320 px e movimento reduzido inicial/dinâmico. |
| Layout e conteúdo | Chromium a 320, 375, 768 e 1440 px, temas claro/escuro e quatro idiomas; três pilares empilhados quando não cabem lado a lado, sem overflow horizontal da página. |
| Texto ampliado | Texto da seção ampliado a 200% por emulação, sem corte ou overflow; não representa um teste de zoom nativo de todos os navegadores. |
| Console móvel | Menu abre, fecha ao navegar para People, permanece fechado ao voltar e devolve foco ao fechar com Escape; avatares carregam em 28 × 28. |
| Âncoras | Product abre a única seção `#why`; o link do chart abre `#movement-details`. Os destinos ficam abaixo do Header sticky. |

As traduções foram revisadas quanto à equivalência de sentido, preservando a diferença entre hipótese, concessão e decisão aprovada. Não foi realizada revisão editorial por falantes nativos nem avaliação completa com leitores de tela ou aparelhos físicos.

Comandos reproduzíveis na raiz, usando Node 24:

```sh
pnpm lint
pnpm typecheck
pnpm build
pnpm --filter website exec next start --hostname 0.0.0.0 --port 3006
WEBSITE_TEST_URL=http://localhost:3006 node --test apps/website/tests/*.test.mjs
```

## Lint e instalação no CI

O pedido adicional de conferir os deploys incluiu correções no Console (avatares e fechamento do menu por mudança de rota), na ordem de carregamento das fontes do Mobile e em duas regras CSS antigas do Website. A regra Next.js de imagem continua ativa nas aplicações Next; foi desativada apenas no pacote React compartilhado, que também atende o Mobile em Vite.

O CI usa instalação congelada, seguida de lint, typecheck e build. Scripts de instalação e verificações dos scaffolds ficam fora dessa execução, conforme a orientação do usuário durante a reestruturação. Biome também exclui `.agents`, `.drifts` e `.audits`; essas pastas não foram alteradas.

O [job anterior do GitHub](https://github.com/gojhonny/langdrift/actions/runs/35483147642/job/106004467296) falhou antes do lint, com `ERR_PNPM_FETCH_404` ao baixar `sinapsi-0.2.0.tgz`. Durante esta entrega, o proprietário publicou a versão `0.2.0`; a consulta ao registro passou a retornar a versão e a mesma integridade registrada no lockfile. Uma cópia isolada de fonte/configuração, sem `.env`, `node_modules`, store ou artefatos anteriores, passou por `pnpm install --frozen-lockfile --ignore-scripts`, lint, typecheck e build. Essa reprodução usou macOS, Node 24.19.0 e pnpm 10.32.1. Não houve alteração de dependência nem publicação de pacote por esta tarefa.

Os logs privados da Vercel não estavam acessíveis nesta sessão. A causa acima foi confirmada no GitHub, sem atribuir aos logs da Vercel um diagnóstico que não foi observado. Não foi feito deploy de produção.

Permanecem avisos não bloqueantes sobre o tamanho do bundle Mobile e sobre ausência de arquivos de saída nas tarefas compartilhadas que apenas verificam tipos. O teste Node do grafo emite um aviso de detecção de módulo TypeScript; os três testes passam.

## Capturas do preview de produção

As capturas são documentos de revisão e não são carregadas pela página.

- [Desktop, português, tema claro — 1440 × 1900](vision-loop-evidence/desktop-pt-light.png)
- [Desktop, português, tema escuro — 1440 × 1900](vision-loop-evidence/desktop-pt-dark.png)
- [Mobile, português, tema escuro — 375 × 1050](vision-loop-evidence/mobile-pt-dark.png)
- [Mobile, contexto de uma fonte aberto — 375 × 1050](vision-loop-evidence/mobile-source-pt-dark.png)

Referências de implementação: [Animated Tabs](https://smoothui.dev/r/animated-tabs.json), [Basic Accordion](https://smoothui.dev/r/basic-accordion.json), [WAI-ARIA Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) e [WAI-ARIA Accordion](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/).
