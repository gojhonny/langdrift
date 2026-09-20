const en = {
  chart: {
    title: 'Product Vision',
    movement: 'Vision movement',
    movementDetail: 'down from {baseline} · 14 intentional · 4 unexplained',
    summary:
      'Product Vision moves from {from} to {to}. Important events are available as keyboard-focusable points on the curve.',
    event: '{title}, {delta} Product Vision, {classification}, {date}',
    why: 'Why?',
    product: 'Product'
  },
  graph: {
    title: 'Connected context',
    description: 'Explore the relationships behind product movement.',
    instructions:
      'Hover or select a node to explore its connections. With a keyboard, use the Up and Down arrow keys to move between nodes and Enter or Space to select.',
    summary:
      'An illustrative network connects Vision, a target, the product loop, decisions, and evidence. Its selection is independent of the Product Vision chart.',
    loading: 'Loading connected context…',
    fallback:
      'The interactive graph is temporarily unavailable. Vision, decisions, and evidence remain connected in this illustrative example.'
  },
  classifications: {
    baseline: 'Baseline',
    intentional: 'Intentional Evolution',
    review: 'Under Review',
    unexplained: 'Unexplained Drift'
  },
  teams: { product: 'Product', platform: 'Platform', leadership: 'Leadership' },
  areas: {
    vision: 'Vision',
    pricing: 'Pricing',
    authentication: 'Authentication',
    exports: 'Exports'
  },
  events: {
    baseline: {
      action: 'See baseline context',
      decision: 'Vision baseline recorded',
      reason:
        'Leadership recorded the product direction used as the reference for this period.',
      title: 'Vision baseline approved'
    },
    pricing: {
      action: 'View decision context',
      decision: 'Decision recorded',
      reason: 'Enterprise customers required a different packaging model.',
      title: 'Pricing strategy changed'
    },
    authentication: {
      action: 'Review context',
      decision: 'No matching product decision found',
      reason:
        'LangDrift found implementation evidence, but no matching recorded product decision.',
      title: 'Authentication redesigned'
    },
    exports: {
      action: 'Inspect review state',
      decision: 'Classification under review',
      reason:
        'Evidence shows the behavior changed, but the product rationale is not complete yet.',
      title: 'Export behavior changed'
    }
  },
  nodes: {
    vision: 'Vision',
    target: 'Target',
    loop: 'Loop',
    strategy: 'Strategy',
    baseline: 'Baseline',
    scope: 'Scope',
    experience: 'Experience',
    quality: 'Quality',
    decision: 'Decision',
    delivery: 'Delivery',
    feedback: 'Feedback',
    pricing: 'Pricing',
    onboarding: 'Onboarding',
    evidence: 'Evidence',
    review: 'Review',
    exports: 'Exports',
    accessibility: 'Access',
    tests: 'Tests',
    reliability: 'Reliability',
    context: 'Context',
    intent: 'Intent',
    release: 'Release',
    research: 'Research',
    authentication: 'Identity'
  }
}

const ptBR: typeof en = {
  chart: {
    title: 'Product Vision',
    movement: 'Movimento da visão',
    movementDetail: 'antes {baseline} · 14 intencionais · 4 sem explicação',
    summary:
      'Product Vision passa de {from} para {to}. Os eventos importantes podem ser selecionados pelo teclado nos pontos da curva.',
    event: '{title}, {delta} em Product Vision, {classification}, {date}',
    why: 'Por quê?',
    product: 'Produto'
  },
  graph: {
    title: 'Contexto conectado',
    description: 'Explore as relações por trás do movimento do produto.',
    instructions:
      'Passe o ponteiro ou selecione um nó para explorar suas conexões. No teclado, use as setas para cima e para baixo para navegar pelos nós e Enter ou Espaço para selecionar.',
    summary:
      'Uma rede ilustrativa conecta a visão, um objetivo, o ciclo do produto, decisões e evidências. Sua seleção é independente do gráfico de Product Vision.',
    loading: 'Carregando o contexto conectado…',
    fallback:
      'O grafo interativo está temporariamente indisponível. Visão, decisões e evidências permanecem conectadas neste exemplo ilustrativo.'
  },
  classifications: {
    baseline: 'Referência inicial',
    intentional: 'Evolução intencional',
    review: 'Em revisão',
    unexplained: 'Drift sem explicação'
  },
  teams: {
    product: 'Produto',
    platform: 'Plataforma',
    leadership: 'Liderança'
  },
  areas: {
    vision: 'Visão',
    pricing: 'Preços',
    authentication: 'Autenticação',
    exports: 'Exportações'
  },
  events: {
    baseline: {
      action: 'Ver contexto da referência',
      decision: 'Referência da visão registrada',
      reason:
        'A liderança registrou a direção do produto usada como referência para este período.',
      title: 'Referência da visão aprovada'
    },
    pricing: {
      action: 'Ver contexto da decisão',
      decision: 'Decisão registrada',
      reason: 'Clientes corporativos precisavam de outro modelo de oferta.',
      title: 'Estratégia de preços alterada'
    },
    authentication: {
      action: 'Revisar contexto',
      decision: 'Nenhuma decisão de produto correspondente encontrada',
      reason:
        'O LangDrift encontrou evidências de implementação, mas nenhuma decisão de produto correspondente registrada.',
      title: 'Autenticação redesenhada'
    },
    exports: {
      action: 'Ver estado da revisão',
      decision: 'Classificação em revisão',
      reason:
        'As evidências mostram uma mudança de comportamento, mas a justificativa de produto ainda está incompleta.',
      title: 'Comportamento de exportação alterado'
    }
  },
  nodes: {
    vision: 'Visão',
    target: 'Objetivo',
    loop: 'Ciclo',
    strategy: 'Estratégia',
    baseline: 'Referência',
    scope: 'Escopo',
    experience: 'Experiência',
    quality: 'Qualidade',
    decision: 'Decisão',
    delivery: 'Entrega',
    feedback: 'Retorno',
    pricing: 'Preços',
    onboarding: 'Introdução',
    evidence: 'Evidências',
    review: 'Revisão',
    exports: 'Exportações',
    accessibility: 'Acesso',
    tests: 'Testes',
    reliability: 'Confiança',
    context: 'Contexto',
    intent: 'Intenção',
    release: 'Versão',
    research: 'Pesquisa',
    authentication: 'Identidade'
  }
}

const zhHant: typeof en = {
  chart: {
    title: 'Product Vision',
    movement: '願景變化',
    movementDetail: '原為 {baseline} · 14 點有意演進 · 4 點未有解釋',
    summary:
      'Product Vision 從 {from} 變為 {to}。您可以使用鍵盤聚焦並選取曲線上的重要事件。',
    event: '{title}，Product Vision {delta}，{classification}，{date}',
    why: '原因？',
    product: '產品'
  },
  graph: {
    title: '相連的脈絡',
    description: '探索產品變化背後的關聯。',
    instructions:
      '將游標移至節點或選取節點，以探索其連結。使用鍵盤時，以上下方向鍵切換節點，並按 Enter 或空白鍵選取。',
    summary:
      '此示意網絡連結願景、目標、產品循環、決策與證據。節點選取與 Product Vision 圖表互相獨立。',
    loading: '正在載入相連的脈絡…',
    fallback:
      '互動關聯圖暫時無法使用。在此示意範例中，願景、決策與證據仍彼此相連。'
  },
  classifications: {
    baseline: '基準',
    intentional: '有意演進',
    review: '審查中',
    unexplained: '未解釋的偏移'
  },
  teams: { product: '產品', platform: '平台', leadership: '領導團隊' },
  areas: {
    vision: '願景',
    pricing: '定價',
    authentication: '身分驗證',
    exports: '匯出'
  },
  events: {
    baseline: {
      action: '查看基準脈絡',
      decision: '已記錄願景基準',
      reason: '領導團隊記錄了產品方向，作為這段期間的參考基準。',
      title: '願景基準已核准'
    },
    pricing: {
      action: '查看決策脈絡',
      decision: '已記錄決策',
      reason: '企業客戶需要不同的方案組合模式。',
      title: '定價策略已變更'
    },
    authentication: {
      action: '審查脈絡',
      decision: '找不到對應的產品決策',
      reason: 'LangDrift 找到了實作證據，但沒有對應的產品決策紀錄。',
      title: '身分驗證已重新設計'
    },
    exports: {
      action: '查看審查狀態',
      decision: '分類審查中',
      reason: '證據顯示行為已改變，但產品層面的理由尚不完整。',
      title: '匯出行為已變更'
    }
  },
  nodes: {
    vision: '願景',
    target: '目標',
    loop: '循環',
    strategy: '策略',
    baseline: '基準',
    scope: '範圍',
    experience: '體驗',
    quality: '品質',
    decision: '決策',
    delivery: '交付',
    feedback: '回饋',
    pricing: '定價',
    onboarding: '引導',
    evidence: '證據',
    review: '審查',
    exports: '匯出',
    accessibility: '無障礙',
    tests: '測試',
    reliability: '可靠性',
    context: '脈絡',
    intent: '意圖',
    release: '發布',
    research: '研究',
    authentication: '身分'
  }
}

const ja: typeof en = {
  chart: {
    title: 'Product Vision',
    movement: 'ビジョンの変化',
    movementDetail: '{baseline} から低下 · 意図的 14 · 未説明 4',
    summary:
      'Product Vision は {from} から {to} に変化しています。曲線上の重要なイベントはキーボードでフォーカスして選択できます。',
    event: '{title}、Product Vision {delta}、{classification}、{date}',
    why: '理由は？',
    product: 'プロダクト'
  },
  graph: {
    title: 'つながる背景',
    description: 'プロダクトの変化の背景にあるつながりを探る。',
    instructions:
      'ノードにポインターを合わせるか選択すると、つながりを確認できます。キーボードでは上下の矢印キーでノードを移動し、Enter またはスペースキーで選択します。',
    summary:
      'このデモのネットワークは、ビジョン、目標、プロダクトのループ、意思決定、根拠をつないでいます。ノードの選択は Product Vision のグラフと独立しています。',
    loading: 'つながる背景を読み込み中…',
    fallback:
      'インタラクティブなネットワークは一時的に利用できません。このデモでは、ビジョン、意思決定、根拠が互いにつながっています。'
  },
  classifications: {
    baseline: '基準',
    intentional: '意図的な進化',
    review: '確認中',
    unexplained: '未説明のドリフト'
  },
  teams: {
    product: 'プロダクト',
    platform: 'プラットフォーム',
    leadership: '経営陣'
  },
  areas: {
    vision: 'ビジョン',
    pricing: '価格設定',
    authentication: '認証',
    exports: 'エクスポート'
  },
  events: {
    baseline: {
      action: '基準の背景を見る',
      decision: 'ビジョンの基準を記録済み',
      reason:
        '経営陣は、この期間の基準となるプロダクトの方向性を記録しました。',
      title: 'ビジョンの基準を承認'
    },
    pricing: {
      action: '意思決定の背景を見る',
      decision: '意思決定を記録済み',
      reason: '大企業の顧客には異なるプラン構成が必要でした。',
      title: '価格戦略を変更'
    },
    authentication: {
      action: '背景を確認',
      decision: '対応するプロダクトの意思決定が見つかりません',
      reason:
        'LangDrift は実装の根拠を検出しましたが、対応するプロダクトの意思決定の記録は見つかりませんでした。',
      title: '認証を再設計'
    },
    exports: {
      action: '確認状況を見る',
      decision: '分類を確認中',
      reason:
        '根拠は動作の変化を示していますが、プロダクトとしての理由はまだ十分に記録されていません。',
      title: 'エクスポートの動作を変更'
    }
  },
  nodes: {
    vision: 'ビジョン',
    target: '目標',
    loop: 'ループ',
    strategy: '戦略',
    baseline: '基準',
    scope: '範囲',
    experience: '体験',
    quality: '品質',
    decision: '意思決定',
    delivery: '提供',
    feedback: '反応',
    pricing: '価格',
    onboarding: '導入',
    evidence: '根拠',
    review: '確認',
    exports: '出力',
    accessibility: '使いやすさ',
    tests: 'テスト',
    reliability: '信頼性',
    context: '背景',
    intent: '意図',
    release: 'リリース',
    research: '調査',
    authentication: '認証'
  }
}

export const demoMessages = { en, 'pt-BR': ptBR, 'zh-Hant': zhHant, ja }
