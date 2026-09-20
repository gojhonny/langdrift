# Header, Hero e idiomas — implementação

Implementado na branch `draft/drifts-setup-scaffolds`, a partir de `0cd9ed842695594bcc68d46462131a5f38ea0e83`, seguindo o handoff de 20/09/2026. Alterações locais para revisão; não houve publicação do website.

## Resultado

- Header próprio do website: marca estática, navegação central, glass sticky, pill de idiomas, links Sign in/Get started para early access e tema por último.
- Drawer modal nativo com Escape, fundo inerte, bloqueio/restauração de scroll e restauração de foco, inclusive após trocar de idioma.
- Hero com headline e descrição originais, CTAs acima da demonstração, chart à esquerda e grafo à direita. Em larguras intermediárias/mobile, chart seguido do grafo.
- Chart mantém o cenário e a seleção Jotai. Eixos e detalhes maiores, espaço para o eixo esquerdo e padding entre o primeiro avatar e seus valores.
- Grafo com 24 IDs estáveis, relações explícitas, nomes localizados, `move="idle"`, paleta hexadecimal e importação assíncrona de `sinapsi/browser` somente no cliente.
- Home inteira traduzida, incluindo Voice demonstrativo, estados, seleção, atribuição, relatório, planos, footer e metadata. A página é renderizada no servidor, com componentes cliente para interações.
- Destino `#early-access` informativo junto de `#pricing`: inscrições ainda não abertas. Nenhum formulário, endpoint, provedor ou confirmação de trial foi criado.

## Arquivos e dependências

As rotas estão em `src/app/[locale]`; routing/proxy em `src/i18n` e `src/proxy.ts`; catálogos em `src/messages`; header/chart/grafo em `src/components`; fixtures em `src/lib/hero-demo-data.ts`.

Dependências diretas adicionadas e fixadas no lockfile:

- `next-intl@4.14.5`
- `sinapsi@0.1.2`

Next.js, React e Motion não foram atualizados. O componente compartilhado `ProductVisionCurve` recebeu props opcionais de tradução/formatação/padding; consumidores existentes conservam defaults em inglês. Console, SSO e Mobile passaram no typecheck e build.

URLs públicas: `/` (en), `/pt-br` (pt-BR), `/zh-hant` (zh-Hant) e `/ja` (ja). Inglês permanece em `/`, independentemente de cookies antigos e idioma do navegador. Trocas explícitas preservam query/hash e seleção do chart; IDs não são traduzidos.

## Verificação executada

Runtime dos gates: Node 24.21.0, pnpm 10.32.1.

| Comando | Resultado |
| --- | --- |
| `./cli/drift doctor --ci` | Falha preexistente: ainda exige `.audits`, ausente neste checkout. O scaffold não foi alterado. |
| `pnpm exec biome lint apps packages cli package.json biome.json turbo.json --files-ignore-unknown=true` | Passou; oito avisos preexistentes. Escopo exclui os diretórios que o proprietário pediu para ignorar. |
| `pnpm typecheck` | Seis pacotes/apps passaram. |
| `pnpm build` | Seis pacotes/apps passaram; quatro versões da home prerenderizadas. |
| `pnpm --filter website build` | Passou novamente após a alteração final para importação somente de tipos do Sinapsi. |
| `WEBSITE_TEST_URL=http://localhost:3005 pnpm --filter website test:smoke` | Sete testes passaram contra a versão de produção local. |

Os testes HTTP cobrem acesso direto e repetido aos quatro idiomas, HTML/metadata, âncoras e destinos, tradução abaixo do hero, inglês independente da detecção automática, rotas inválidas e assets.

No Chromium real foram verificados layouts de 320, 375, 768, 1024 e 1440 px, ambos os temas, tradução de português/chinês tradicional/japonês, navegação por teclado, drawer, tema, seleção do chart e clique/teclado nativos do grafo. Ao trocar o idioma pelo drawer, query/hash e evento selecionado são preservados e o foco retorna ao hamburger traduzido.

O reflow equivalente a 200% em uma janela de 1440 px foi verificado com viewport de 720 CSS px: sem overflow horizontal, com navegação compacta e chart redimensionado. Essa verificação não acionou o zoom nativo do navegador.

O chart redimensiona corretamente com a aba visível. Abas em segundo plano suspendem ResizeObserver/renderização no navegador de testes; as capturas finais foram feitas com a aba visível.

Touch foi verificado em Chromium com viewport de iPhone 15 (393 × 852) e emulação CDP: eventos de ponteiro chegaram como `touch`/`isTrusted: true`. Toques abriram e fecharam o drawer; um toque no canvas emitiu `sinapsi-node-click` para `release`, mantendo o chart no evento de preços e o grafo em `idle`. É uma verificação de toque emulado, não em aparelho físico.

O bloqueio do chunk de browser do Sinapsi em uma sessão nova produziu `failed` e fallback localizado em português; o chart continuou utilizável. Nenhum erro de página apareceu no fluxo normal.

Movimento reduzido: headline sem animação e scroll sem suavização. No grafo visível, duas capturas após estabilização e separadas por 1,2 s foram idênticas, mantendo `move="idle"`. Isso não significa que o loop de renderização do pacote seja interrompido.

Axe 4.12.1 não encontrou violações automáticas nos temas claro/escuro após os ajustes de contraste. Gradientes e parte do SVG/canvas exigem avaliação manual; este resultado não é certificação de acessibilidade. Não houve revisão de tradutor nativo nem validação em aparelho iOS/Android físico.

Uma observação de recursos JavaScript carregados comparou o site live com a produção local: aproximadamente 313 kB → 441 kB comprimidos e 1,03 MB → 1,54 MB descomprimidos, incluindo o novo grafo. São observações de duas páginas/ambientes, não uma medição controlada nem aprovação de Core Web Vitals.

## Capturas

- [Desktop claro](/Users/sky/.codex/visualizations/2026/09/19/01a0bc0f-8e00-7da3-81a7-8538ab7dde6a/langdrift-website/desktop-light.png)
- [Desktop escuro](/Users/sky/.codex/visualizations/2026/09/19/01a0bc0f-8e00-7da3-81a7-8538ab7dde6a/langdrift-website/desktop-dark.png)
- [Mobile claro, português](/Users/sky/.codex/visualizations/2026/09/19/01a0bc0f-8e00-7da3-81a7-8538ab7dde6a/langdrift-website/mobile-light-pt-br.png)
- [Hero mobile escuro, português](/Users/sky/.codex/visualizations/2026/09/19/01a0bc0f-8e00-7da3-81a7-8538ab7dde6a/langdrift-website/mobile-hero-dark-pt-br.png)
- [Seções abaixo do hero, português](/Users/sky/.codex/visualizations/2026/09/19/01a0bc0f-8e00-7da3-81a7-8538ab7dde6a/langdrift-website/translated-sections-pt-br.png)
- [Seleção nativa por toque emulado — inclui sobreposição de labels do pacote](/Users/sky/.codex/visualizations/2026/09/19/01a0bc0f-8e00-7da3-81a7-8538ab7dde6a/langdrift-website/mobile-touch-graph-selected.png)

## Limitações preservadas para a próxima etapa

O Sinapsi não foi modificado, publicado, copiado nem corrigido com patches. Não há sincronização grafo–chart, cards ou avatares novos nos nodes. Labels nativas expandidas podem se sobrepor; o enquadramento não tem API pública; o listbox interno ainda anuncia “Graph nodes” em inglês. O pacote mantém revelação inicial e loop de renderização mesmo com movimento reduzido.

Os valores ilustrativos existentes foram preservados: curva 91 → 88 → 84 → 79 → 73; eventos −9, −6 e −3; resumo 14 intencionais/4 sem explicação; relatório separado 81 → 76. Há inconsistências entre intervalos, impactos e classificações que precisam de revisão editorial futura. Nenhuma fórmula foi inventada.

`.agents` e `.drifts` não foram editadas. A ausência de `.audits` permanece como pendência do doctor para o trabalho de reestruturação.

Routing foi conferido com a [configuração oficial do next-intl](https://next-intl.dev/docs/routing/configuration); a pill foi comparada com a [Neongate](https://neongate.com.br/) nos dois temas.
