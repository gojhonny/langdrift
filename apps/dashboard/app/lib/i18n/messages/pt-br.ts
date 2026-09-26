import type { en } from './en'

export const ptBR = {
  sections: {
    overview: {
      title: 'Visão geral',
      description: 'Onde estamos, por que mudamos e o que precisa de atenção.'
    },
    evolution: {
      title: 'Evolução',
      description:
        'Veja a curva, filtre os movimentos e inspecione a referência.'
    },
    decisions: {
      title: 'Decisões',
      description:
        'Por que a direção do produto mudou, quem aprovou e o que foi afetado.'
    },
    people: {
      title: 'Pessoas',
      description:
        'Responsabilidade e participação em decisões, implementações e revisões.'
    },
    reports: {
      title: 'Relatórios',
      description:
        'Resumos executivos dos movimentos da Visão do Produto e dos pontos de atenção.'
    },
    settings: {
      title: 'Configurações',
      description:
        'Aparência do espaço de trabalho e contexto determinístico do produto.'
    },
    evidence: {
      title: 'Evidências',
      description: 'Provas contextuais por trás das conclusões sobre o produto.'
    },
    'drift-by-product-area': {
      title: 'Evolução',
      description: 'Movimentos da Visão do Produto agrupados por área.'
    },
    'drift-by-team': {
      title: 'Evolução',
      description: 'Movimentos da Visão do Produto agrupados por equipe.'
    },
    'drift-events': {
      title: 'Evolução',
      description:
        'Eventos importantes da Visão do Produto e suas classificações.'
    },
    'drift-graph': {
      title: 'Evolução',
      description: 'Como a Visão do Produto mudou ao longo do tempo.'
    },
    'drift-report': {
      title: 'Relatórios',
      description: 'Explicações executivas sobre o período selecionado.'
    },
    'drift-timeline': {
      title: 'Evolução',
      description: 'Evolução do produto em ordem cronológica.'
    },
    'intentional-drift': {
      title: 'Evolução',
      description:
        'Evolução Intencional filtrada do mesmo histórico do produto.'
    },
    'unexplained-drift': {
      title: 'Evolução',
      description:
        'Movimentos sem explicação filtrados do mesmo histórico do produto.'
    },
    'vision-baseline': {
      title: 'Evolução',
      description: 'Proveniência auditável da referência atual da Visão.'
    }
  },
  classifications: {
    baseline: 'Referência',
    intentional: 'Evolução Intencional',
    review: 'Em Análise',
    unexplained: 'Desvio Sem Explicação'
  },
  range: { '30d': '30d', '90d': '90d', '1y': '1a', all: 'tudo' },
  months: { apr: 'Abr', may: 'Mai', jun: 'Jun', jul: 'Jul', aug: 'Ago' },
  dates: {
    baseline: '02 abr',
    pricing: '28 jun',
    authentication: '22 jul',
    exports: '20 ago'
  },
  teams: {
    leadership: 'Liderança',
    product: 'Produto',
    platform: 'Plataforma'
  },
  areas: {
    vision: 'Visão',
    pricing: 'Preços',
    authentication: 'Autenticação',
    exports: 'Exportações'
  },
  events: {
    baseline: {
      title: 'Referência da Visão aprovada',
      decision: 'Referência da Visão registrada',
      reason:
        'A liderança registrou a direção do produto usada como referência neste período.'
    },
    pricing: {
      title: 'Estratégia de preços alterada',
      decision: 'Decisão registrada',
      reason: 'Clientes empresariais precisavam de outro modelo de pacotes.'
    },
    authentication: {
      title: 'Autenticação redesenhada',
      decision: 'Decisão não encontrada',
      reason: 'Nenhuma decisão de produto correspondente foi encontrada.'
    },
    exports: {
      title: 'Comportamento de exportação alterado',
      decision: 'Análise pendente',
      reason:
        'Há evidências, mas a justificativa de produto ainda está incompleta.'
    }
  },
  vision: {
    product: 'Visão do Produto',
    delta: '↓ 18 em relação à referência selecionada',
    baselineDelta: '↓ 18 em relação à Referência da Visão v1.0',
    baselineTag: 'Referência v1.0',
    timeRange: 'Período',
    comment:
      'A mudança de preços foi intencional. Autenticação continua sem explicação e exportações ainda estão em análise.',
    commentLabel: 'Comentário de {author}',
    summary:
      'A Visão do Produto passa de 91% para 73%. Eventos importantes estão disponíveis como pontos da curva acessíveis pelo teclado.',
    describeEvent:
      '{date}: {title}. {classification}. Variação: {delta} pontos.',
    loading: 'Carregando a curva da Visão do Produto',
    why: 'Por quê?'
  },
  movement: {
    why: 'Por que a Visão do Produto mudou?',
    summary: 'Três movimentos explicam o estado atual.',
    totals: '14 intencionais · 4 sem explicação'
  },
  attention: {
    heading: 'Precisa de atenção',
    authentication: 'Autenticação não tem uma decisão de produto registrada.',
    classification:
      'Classificado como Desvio Sem Explicação · Carlos · Plataforma',
    reviewDecision: 'Revisar contexto da decisão',
    exports: 'O comportamento de exportação mudou sem classificação final.',
    inspectEvolution: 'Inspecionar evolução'
  },
  overview: {
    intentionalPoints: 'pontos explicados por decisões registradas',
    unexplainedPoints: 'pontos que ainda precisam de contexto de produto'
  },
  baseline: {
    approvedAt: 'Aprovada em',
    approvedBy: 'Aprovada por',
    sources: 'Artefatos de origem',
    sourceValue: 'PRD-001 · Estratégia de Produto v3',
    scope: 'Escopo',
    scopeValue: 'Atlas Home Hub · Produto principal',
    areas: 'Áreas do produto',
    areasValue: 'Preços · Autenticação · Integração inicial · Exportações',
    supersedes: 'Substitui',
    supersedesValue: 'Registro inicial da intenção do fundador',
    reason: 'Motivo',
    reasonValue: 'Primeira referência de produto aprovada pela organização.',
    reference: 'Referência atual',
    title: 'Referência da Visão v1.0',
    current: 'Atual'
  },
  filters: {
    all: 'Todos',
    intentional: 'Intencional',
    unexplained: 'Sem explicação',
    classification: 'Classificação',
    empty: 'Nenhum evento corresponde a este filtro.'
  },
  groups: {
    event: 'Evento',
    productArea: 'Área do Produto',
    team: 'Equipe',
    label: 'Agrupar por'
  },
  teamGroups: {
    productAreas: 'Preços · Exportações',
    productDetail: '2 decisões',
    platformAreas: 'Preços · Autenticação',
    platformDetail: '1 decisão · 1 sem explicação',
    leadershipAreas: 'Aprovação da referência',
    leadershipDetail: '1 aprovação'
  },
  decisions: {
    note: 'Nota da decisão',
    reviewMarina: 'Revisão de Marina',
    pricingPeople: 'Ana propôs · Marina aprovou · Carlos implementou',
    pricingTitle: 'Modelo de pacotes empresariais',
    reviewAna: 'Revisão de Ana',
    noDecision: 'Nenhuma decisão de produto correspondente',
    authenticationPeople: 'Carlos implementou · Ana revisou',
    authenticationTitle: 'Redesenho da autenticação',
    why: 'Por que acreditamos nisso?'
  },
  people: {
    anaRole: 'Diretora de Produto',
    anaDetail: '5 decisões · 3 aprovações · responsável por Preços',
    carlosRole: 'Líder de Engenharia',
    carlosDetail:
      '4 implementações · 2 revisões · responsável por Autenticação',
    marinaDetail: '3 aprovações · responsável pela Visão',
    liaRole: 'Líder de Design',
    liaDetail: '3 propostas · responsável pela navegação do produto'
  },
  reports: {
    digest: 'Resumo executivo semanal',
    title: 'A Visão do Produto passou de 79 para 73.',
    summary:
      'Autenticação foi o maior fator ainda não explicado. O comportamento de exportação continua em análise. A mudança de preços está vinculada a uma decisão aprovada.',
    points: '{count} pontos'
  },
  evidence: {
    context:
      'Evidências aprofundam o contexto, não são o destino principal da visão executiva.',
    artifact: 'Artefato',
    observation: 'Observação',
    status: 'Situação',
    authentication: 'Implementação da autenticação alterada',
    linked: 'Vinculado',
    strategy: 'Estratégia de autenticação empresarial'
  },
  settings: {
    appearance: 'Aparência',
    appearanceDescription: 'Claro e escuro são temas completos do produto.',
    switchDark: 'Mudar para o tema escuro',
    switchLight: 'Mudar para o tema claro',
    voice: 'Voz Executiva',
    voiceDescription: 'A voz mantém o foco no contexto estruturado do produto.'
  }
} satisfies typeof en
