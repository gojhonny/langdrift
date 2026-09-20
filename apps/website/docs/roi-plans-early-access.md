# ROI, planos, FAQ e validação de acesso antecipado

A home termina com Integrações → Revisão executiva → ROI → FAQ → acesso antecipado → footer. Voz e relatório foram preservados antes de Integrações. O briefing de ROI retoma E02/R01 e seus registros existentes, sem inventar retorno financeiro ou uma segunda base de eventos.

Planos fica em `/pricing`, `/pt-br/pricing`, `/zh-hant/pricing` e `/ja/pricing`, com título, descrição, canonical e alternates próprios. Header, drawer e footer usam navegação localizada. O antigo fragmento `#pricing` aponta para o convite de explorar planos no ROI. Os três CTAs dos cards levam ao formulário da própria página.

A oferta é teste gratuito de 15 dias, iniciado na ativação do acesso. Plus e Pro permanecem planejados, com preços a anunciar e sem limites, cobrança ou benefícios exclusivos inventados. FAQ reutiliza o BasicAccordion existente, fechado inicialmente e com uma resposta por vez.

## Formulário e estado

Conforme a instrução mais recente do proprietário, o formulário **apenas valida o e-mail localmente**. Não há requests, endpoint, persistência, inscrição na lista, envio de e-mail ou ativação de trial. A confirmação exibida significa somente que o endereço é válido. Essas partes operacionais do handoff foram retiradas do escopo, não simuladas.

O mesmo `EarlyAccessSection`/`EarlyAccessForm` atende home e planos. Zod **4.6.5** e Immer **11.1.18** foram adicionados diretamente ao Website; já estavam no lockfile transitivo. O código usa React `useState` e `produce`, sem novo provider ou biblioteca de formulários.

`components/early-access/` reúne UI, handlers, mappers, inicializador, tipos e schema. As receitas de Immer são puras; os handlers validam mudanças, blur e submit. Erros usam códigos traduzidos; input, ajuda e feedback têm associações acessíveis. E-mail pessoal é aceito, espaços externos são normalizados, o limite é 254 caracteres e erros anteriores são removidos após correção. O conteúdo digitado não vai para atoms, logs, URLs ou storage.

`AGENTS.md` esclarece estado compartilhado versus local e as ofertas aprovadas do Website. A convenção de formulários está em [local-state-and-forms.md](local-state-and-forms.md). Por instrução direta do proprietário, `.agents`, `.drifts` e `.audits` continuam fora de leitura, escrita e validação; a regra foi documentada aqui em vez de ser inserida nessas pastas. Não houve migração de SSO, Mobile ou Console.

## Footer

Home e planos compartilham o footer. A frase anterior foi substituída por links com ícones de LinkedIn e GitHub. À esquerda, o Web Component Orbz já instalado renderiza o preset `neongate`, ao lado de “Neongate AI © 2026 LangDrift made in Brazil”. O tema escuro padrão e a preferência de tema salva foram mantidos.

## Verificação

- Biome: 202 arquivos, sem erros ou avisos.
- Typecheck e build: os seis workspaces passaram. Foi corrigida a importação dos ícones do footer para a variante SSR do Phosphor.
- 38 testes passaram, incluindo nove testes de validação local e HTTP contra o build de produção para as quatro homes e quatro rotas de planos.
- Navegador: PT-BR desktop, japonês a 768 px, chinês tradicional a 360 px e inglês mobile, nos dois temas; sem overflow horizontal nos tamanhos inspecionados.
- E-mail vazio e corrigido: foco/erro associados, feedback de validade e zero chamadas de fetch; nenhuma query com e-mail. Troca de idioma preservou a rota de planos, e o link FAQ voltou à âncora da home.
- FAQ: oito entradas inicialmente fechadas, Enter/Space, uma resposta aberta e regiões fechadas inert. IDs verificados sem duplicatas.
- Footer: orb neongate renderizado, crédito solicitado e links sociais. Callback público do Sinapsi continuou atualizando o chart; grafo com 48 nodes pronto.
- Texto das novas seções ampliado a 200% por emulação sem overflow horizontal; não equivale a zoom nativo de todos os navegadores.

Persistem somente os avisos já existentes de bundle Mobile acima de 500 kB, outputs do build compartilhado que só verifica tipos e detecção de módulo TypeScript nos testes Node. Doctor/audits não foram executados por instrução do proprietário.

As verificações visuais usam Chromium local, com temas claro/escuro e larguras de desktop/mobile. Não representam testes em aparelhos físicos ou uma avaliação completa por tecnologia assistiva. Nenhuma captura de lead é reivindicada por estes testes.


## Capturas do build de produção local

- [Planos, desktop escuro](roi-plans-early-access/pricing-desktop-dark.png)
- [Validação local e footer](roi-plans-early-access/form-footer-dark.png)
- [Planos, mobile em chinês tradicional](roi-plans-early-access/pricing-mobile-dark.png)
- [FAQ, mobile claro](roi-plans-early-access/faq-mobile-light.png)
- [ROI, desktop claro](roi-plans-early-access/roi-desktop-light.png)
