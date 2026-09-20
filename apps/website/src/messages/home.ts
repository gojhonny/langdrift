const en = {
  metadata: {
    title: 'LangDrift — we still in charge',
    description:
      'Visual product intelligence for understanding how products evolve relative to their vision.'
  },
  skip: 'Skip to product explanation',
  hero: {
    title:
      'Why did your Product Vision fall from <movement>91% to 73%?</movement>',
    description:
      'LangDrift shows how your product moved from the vision you intended — what changed, who moved it, why it happened, and whether the change was intentional.',
    seeMovement: 'See what moved',
    howItWorks: 'How it works',
    illustrative: 'Illustrative data',
    caption:
      'Drift describes movement relative to a product vision. It can reveal a gap, a realignment, or a positive change.',
    summary:
      'This illustrative Product Vision curve moves from 91% in April to 73% in August. Select a marked point to explore its context. The graph shows relationships and can be explored independently.'
  },
  why: {
    kicker: 'Know why',
    title: 'Every movement keeps its context.',
    description:
      'Select a marked point in the Product Vision curve to see what changed, its impact, why it happened, who was involved, and the recorded decision state.',
    selected: 'Selected movement',
    reason: 'Why it moved',
    decision: 'Decision state',
    people: 'Who was involved',
    product: 'Product'
  },
  attribution: {
    kicker: 'Know who',
    title: 'Know who moved the product.',
    description:
      'Important movement stays connected to people, teams, product areas, decisions, and review state without turning LangDrift into punitive surveillance.'
  },
  intent: {
    kicker: 'Intent matters',
    title: 'Evolution is expected. Unexplained movement is different.',
    points: '{count, plural, one {# point} other {# points}}',
    events: '{count, plural, one {# event} other {# events}}',
    intentional:
      'Movement backed by a recorded decision, reason, and attributable actors.',
    unexplained:
      'Meaningful movement without enough recorded product rationale.',
    review:
      'Evidence exists, but the relationship is not ready for a confident classification.'
  },
  voice: {
    kicker: 'Executive voice',
    title: 'Ask the same model you can see.',
    description:
      'Voice sits on top of structured Product Vision, Drift, attribution, and evidence — not a separate chat history.',
    question: '“Why did Product Vision move this week?”',
    ask: 'Ask this question',
    points: '{count} pts',
    largest: 'largest move',
    answerTitle: 'Pricing direction changed.',
    answer:
      'Proposed by Product, approved in the Q3 review, classified as Intentional Evolution with linked evidence.',
    listening: 'Listening to the sample question',
    thinking: 'Preparing the sample answer',
    speaking: 'Presenting the sample answer',
    idle: 'Voice demonstration ready'
  },
  report: {
    kicker: 'Executive output',
    title:
      'A report should read like a decision brief, not an engineering dump.',
    weekly: 'Weekly product evolution',
    vision: 'Product Vision · {from} → {to}',
    largest: 'Largest movement',
    movement: 'Authentication · {delta}',
    why: 'Why',
    rationale: 'No linked product decision',
    who: 'Who',
    actor: 'Carlos · Platform',
    status: 'Status',
    attention: 'Needs attention',
    action: 'Review authentication rationale'
  },
  pricing: {
    kicker: 'Plans',
    title: 'Built for founder-led teams and growing product organizations.',
    description:
      'Packaging is being finalized. Start with the product experience now.',
    cta: 'Get started'
  },
  earlyAccess: {
    title: 'Early access',
    description: 'Early access registration is not open yet.'
  },
  footer: {
    description: 'From vision to reality, and everything in between.',
    tagline: 'Visual-first for truth. Voice-first for inquiry.'
  }
}

type HomeMessages = typeof en

const ptBR: HomeMessages = {
  metadata: {
    title: 'LangDrift — continuamos no comando',
    description:
      'Inteligência visual de produto para entender como os produtos evoluem em relação à sua visão.'
  },
  skip: 'Ir para a explicação do produto',
  hero: {
    title:
      'Por que seu Product Vision caiu de <movement>91% para 73%?</movement>',
    description:
      'O LangDrift mostra como seu produto se moveu em relação à visão que você pretendia construir — o que mudou, quem o moveu, por que aconteceu e se a mudança foi intencional.',
    seeMovement: 'Veja o que mudou',
    howItWorks: 'Como funciona',
    illustrative: 'Dados ilustrativos',
    caption:
      'Drift descreve o movimento em relação à visão de um produto. Pode revelar um afastamento, um realinhamento ou uma mudança positiva.',
    summary:
      'Esta curva ilustrativa de Product Vision vai de 91% em abril a 73% em agosto. Selecione um ponto marcado para explorar seu contexto. O grafo mostra relações e pode ser explorado de forma independente.'
  },
  why: {
    kicker: 'Entenda o porquê',
    title: 'Cada movimento preserva seu contexto.',
    description:
      'Selecione um ponto marcado na curva de Product Vision para ver o que mudou, seu impacto, por que aconteceu, quem participou e o estado da decisão registrada.',
    selected: 'Movimento selecionado',
    reason: 'Por que mudou',
    decision: 'Estado da decisão',
    people: 'Quem participou',
    product: 'Produto'
  },
  attribution: {
    kicker: 'Saiba quem',
    title: 'Saiba quem moveu o produto.',
    description:
      'Movimentos importantes permanecem conectados a pessoas, equipes, áreas de produto, decisões e estados de revisão sem transformar o LangDrift em vigilância punitiva.'
  },
  intent: {
    kicker: 'A intenção importa',
    title: 'Evoluir é esperado. Movimento sem explicação é diferente.',
    points: '{count, plural, one {# ponto} other {# pontos}}',
    events: '{count, plural, one {# evento} other {# eventos}}',
    intentional:
      'Movimento respaldado por uma decisão registrada, uma justificativa e participantes identificáveis.',
    unexplained:
      'Movimento relevante sem justificativa de produto suficientemente registrada.',
    review:
      'Existem evidências, mas a relação ainda não permite uma classificação segura.'
  },
  voice: {
    kicker: 'Voz executiva',
    title: 'Pergunte ao mesmo modelo que você vê.',
    description:
      'A voz se apoia em Product Vision, Drift, atribuição e evidências estruturadas — não em um histórico de conversa separado.',
    question: '“Por que o Product Vision mudou nesta semana?”',
    ask: 'Fazer esta pergunta',
    points: '{count} pts',
    largest: 'maior movimento',
    answerTitle: 'A direção de preços mudou.',
    answer:
      'Proposta por Produto, aprovada na revisão do 3º trimestre e classificada como Evolução Intencional, com evidências vinculadas.',
    listening: 'Ouvindo a pergunta de exemplo',
    thinking: 'Preparando a resposta de exemplo',
    speaking: 'Apresentando a resposta de exemplo',
    idle: 'Demonstração de voz pronta'
  },
  report: {
    kicker: 'Relatório executivo',
    title:
      'Um relatório deve ser um resumo para decisões, não um amontoado de detalhes de engenharia.',
    weekly: 'Evolução semanal do produto',
    vision: 'Product Vision · {from} → {to}',
    largest: 'Maior movimento',
    movement: 'Autenticação · {delta}',
    why: 'Por quê',
    rationale: 'Sem decisão de produto vinculada',
    who: 'Quem',
    actor: 'Carlos · Plataforma',
    status: 'Estado',
    attention: 'Precisa de atenção',
    action: 'Revisar a justificativa da autenticação'
  },
  pricing: {
    kicker: 'Planos',
    title:
      'Feito para equipes lideradas por fundadores e organizações de produto em crescimento.',
    description:
      'Os planos estão sendo finalizados. Comece pela experiência do produto agora.',
    cta: 'Começar'
  },
  earlyAccess: {
    title: 'Acesso antecipado',
    description:
      'As inscrições para o acesso antecipado ainda não estão abertas.'
  },
  footer: {
    description: 'Da visão à realidade, e tudo o que acontece no caminho.',
    tagline: 'O visual revela a verdade. A voz conduz as perguntas.'
  }
}

const zhHant: HomeMessages = {
  metadata: {
    title: 'LangDrift — 我們依然掌握方向',
    description: '以視覺化產品洞察，了解產品如何相對於願景持續演進。'
  },
  skip: '跳至產品說明',
  hero: {
    title: '為什麼您的 Product Vision 從 <movement>91% 降至 73%？</movement>',
    description:
      'LangDrift 呈現您的產品相對於原定願景如何變動——改變了什麼、誰參與其中、為何發生，以及這項變更是否出於明確意圖。',
    seeMovement: '查看變動',
    howItWorks: '運作方式',
    illustrative: '示範資料',
    caption:
      'Drift 描述產品相對於願景的變動。它可能揭示差距、重新對齊，或正向改變。',
    summary:
      '此示範 Product Vision 曲線從四月的 91% 變為八月的 73%。選取標記的資料點以探索背景。關聯圖呈現各項關係，可獨立探索。'
  },
  why: {
    kicker: '了解原因',
    title: '每一次變動，都保留完整背景。',
    description:
      '選取 Product Vision 曲線上標記的資料點，查看改變的內容、影響、原因、參與者，以及已記錄的決策狀態。',
    selected: '選取的變動',
    reason: '變動原因',
    decision: '決策狀態',
    people: '參與者',
    product: '產品'
  },
  attribution: {
    kicker: '了解參與者',
    title: '了解誰推動了產品變動。',
    description:
      '重要變動始終連結到人員、團隊、產品領域、決策及審查狀態，而不讓 LangDrift 變成懲罰性的監控工具。'
  },
  intent: {
    kicker: '意圖很重要',
    title: '演進是預期之中的。缺乏解釋的變動則不同。',
    points: '{count} 點',
    events: '{count} 個事件',
    intentional: '有已記錄的決策、原因及可追溯參與者支持的變動。',
    unexplained: '缺乏充分產品決策理由紀錄的重要變動。',
    review: '已有證據，但其關係尚不足以做出有把握的分類。'
  },
  voice: {
    kicker: '主管語音',
    title: '向您眼前的同一個模型提問。',
    description:
      '語音建立在結構化的 Product Vision、Drift、歸因及證據之上，而非另一份獨立的對話紀錄。',
    question: '「Product Vision 本週為什麼發生變動？」',
    ask: '提出此問題',
    points: '{count} 點',
    largest: '最大變動',
    answerTitle: '定價方向已改變。',
    answer:
      '由產品團隊提案，於第三季審查中核准，分類為有意演進，並附有相關證據。',
    listening: '正在聆聽示範問題',
    thinking: '正在準備示範回答',
    speaking: '正在呈現示範回答',
    idle: '語音示範已就緒'
  },
  report: {
    kicker: '主管報告',
    title: '報告應該是決策摘要，而非堆砌工程細節。',
    weekly: '每週產品演進',
    vision: 'Product Vision · {from} → {to}',
    largest: '最大變動',
    movement: '身分驗證 · {delta}',
    why: '原因',
    rationale: '沒有連結的產品決策',
    who: '參與者',
    actor: 'Carlos · 平台團隊',
    status: '狀態',
    attention: '需要關注',
    action: '審查身分驗證的決策理由'
  },
  pricing: {
    kicker: '方案',
    title: '為創辦人領導的團隊及持續成長的產品組織打造。',
    description: '方案內容正在定案中。現在就從產品體驗開始。',
    cta: '開始使用'
  },
  earlyAccess: {
    title: '搶先體驗',
    description: '搶先體驗尚未開放報名。'
  },
  footer: {
    description: '從願景到現實，以及其間的每一步。',
    tagline: '以視覺呈現真相，以語音探索問題。'
  }
}

const ja: HomeMessages = {
  metadata: {
    title: 'LangDrift — 私たちが方向を決める',
    description:
      '製品がビジョンに対してどのように進化しているかを理解するための、視覚的な製品インテリジェンス。'
  },
  skip: '製品の説明へ移動',
  hero: {
    title:
      'なぜ Product Vision は <movement>91% から 73% に下がったのでしょうか？</movement>',
    description:
      'LangDrift は、製品が意図したビジョンからどう変化したかを示します。何が変わり、誰が関わり、なぜ起きたのか、そしてその変化が意図的だったのかを確認できます。',
    seeMovement: '変化を見る',
    howItWorks: '仕組みを見る',
    illustrative: 'デモデータ',
    caption:
      'Drift は製品ビジョンに対する変化を表します。隔たり、再調整、または前向きな変化を示すことがあります。',
    summary:
      'このデモの Product Vision 曲線は、4月の 91% から8月の 73% に変化しています。マークされた点を選ぶと背景を確認できます。グラフは関係性を示しており、独立して探索できます。'
  },
  why: {
    kicker: '理由を知る',
    title: 'すべての変化に、背景が残ります。',
    description:
      'Product Vision 曲線のマークされた点を選ぶと、変更内容、影響、理由、関係者、記録された意思決定の状態を確認できます。',
    selected: '選択した変化',
    reason: '変化の理由',
    decision: '意思決定の状態',
    people: '関係者',
    product: '製品'
  },
  attribution: {
    kicker: '関係者を知る',
    title: '誰が製品を動かしたのかを知る。',
    description:
      '重要な変化を、人、チーム、製品領域、意思決定、レビュー状況と結びつけます。LangDrift を懲罰的な監視ツールにすることはありません。'
  },
  intent: {
    kicker: '意図が重要',
    title: '進化は自然なこと。説明のない変化は別です。',
    points: '{count} ポイント',
    events: '{count} 件のイベント',
    intentional:
      '記録された意思決定、理由、特定可能な関係者に裏付けられた変化。',
    unexplained: '製品上の理由が十分に記録されていない、重要な変化。',
    review: '証拠はありますが、関係性を確信を持って分類するには至っていません。'
  },
  voice: {
    kicker: '経営者のための音声',
    title: '目に見える、その同じモデルに質問する。',
    description:
      '音声は、構造化された Product Vision、Drift、関係者の情報、証拠に基づきます。独立したチャット履歴ではありません。',
    question: '「今週、Product Vision が変化したのはなぜですか？」',
    ask: 'この質問をする',
    points: '{count} ポイント',
    largest: '最大の変化',
    answerTitle: '価格設定の方向性が変わりました。',
    answer:
      'プロダクトチームが提案し、第3四半期のレビューで承認されました。関連する証拠とともに、意図的な進化に分類されています。',
    listening: 'サンプルの質問を聞いています',
    thinking: 'サンプルの回答を準備しています',
    speaking: 'サンプルの回答を表示しています',
    idle: '音声デモの準備ができました'
  },
  report: {
    kicker: '経営向けレポート',
    title:
      'レポートは技術情報の羅列ではなく、意思決定のための要約であるべきです。',
    weekly: '週次の製品進化',
    vision: 'Product Vision · {from} → {to}',
    largest: '最大の変化',
    movement: '認証 · {delta}',
    why: '理由',
    rationale: '関連する製品の意思決定がありません',
    who: '関係者',
    actor: 'Carlos · プラットフォーム',
    status: '状態',
    attention: '対応が必要',
    action: '認証の変更理由を確認する'
  },
  pricing: {
    kicker: 'プラン',
    title: '創業者が率いるチームと、成長する製品組織のために。',
    description:
      'プランの内容は最終調整中です。まずは製品の体験から始めましょう。',
    cta: '始める'
  },
  earlyAccess: {
    title: '早期アクセス',
    description: '早期アクセスの登録はまだ受け付けていません。'
  },
  footer: {
    description: 'ビジョンから現実へ。その間にあるすべてを。',
    tagline: '視覚で事実をつかみ、音声で問いを深める。'
  }
}

export const homeMessages = { en, 'pt-BR': ptBR, 'zh-Hant': zhHant, ja }
