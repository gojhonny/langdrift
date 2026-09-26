import type { en } from './en'

export const zhHant = {
  sections: {
    overview: {
      title: '總覽',
      description: '了解目前狀態、變動原因，以及需要關注的事項。'
    },
    evolution: { title: '演進', description: '查看曲線、篩選變動並檢視基準。' },
    decisions: {
      title: '決策',
      description: '了解產品方向為何改變、由誰核准，以及造成的影響。'
    },
    people: {
      title: '人員',
      description: '查看負責人，以及決策、實作和審查的參與情況。'
    },
    reports: {
      title: '報告',
      description: '產品願景變動與關注事項的主管摘要。'
    },
    settings: {
      title: '設定',
      description: '工作空間外觀與確定性的產品脈絡。'
    },
    evidence: { title: '證據', description: '支撐產品結論的脈絡與佐證。' },
    'drift-by-product-area': {
      title: '演進',
      description: '依產品領域分組的產品願景變動。'
    },
    'drift-by-team': {
      title: '演進',
      description: '依團隊分組的產品願景變動。'
    },
    'drift-events': {
      title: '演進',
      description: '重要的產品願景事件及其分類。'
    },
    'drift-graph': { title: '演進', description: '產品願景隨時間的變動。' },
    'drift-report': { title: '報告', description: '所選期間的主管說明。' },
    'drift-timeline': {
      title: '演進',
      description: '依時間順序排列的產品演進。'
    },
    'intentional-drift': {
      title: '演進',
      description: '從同一產品歷程中篩選的有意演進。'
    },
    'unexplained-drift': {
      title: '演進',
      description: '從同一產品歷程中篩選的未解釋變動。'
    },
    'vision-baseline': {
      title: '演進',
      description: '目前願景基準的可稽核來源。'
    }
  },
  classifications: {
    baseline: '基準',
    intentional: '有意演進',
    review: '審查中',
    unexplained: '未解釋偏移'
  },
  range: { '30d': '30天', '90d': '90天', '1y': '1年', all: '全部' },
  months: { apr: '4月', may: '5月', jun: '6月', jul: '7月', aug: '8月' },
  dates: {
    baseline: '4月2日',
    pricing: '6月28日',
    authentication: '7月22日',
    exports: '8月20日'
  },
  teams: { leadership: '管理團隊', product: '產品團隊', platform: '平台團隊' },
  areas: {
    vision: '願景',
    pricing: '定價',
    authentication: '驗證',
    exports: '匯出'
  },
  events: {
    baseline: {
      title: '願景基準已核准',
      decision: '願景基準已記錄',
      reason: '管理團隊記錄了本期間作為參考的產品方向。'
    },
    pricing: {
      title: '定價策略已變更',
      decision: '決策已記錄',
      reason: '企業客戶需要不同的產品方案組合。'
    },
    authentication: {
      title: '驗證已重新設計',
      decision: '找不到決策',
      reason: '未找到相符的產品決策。'
    },
    exports: {
      title: '匯出行為已變更',
      decision: '等待審查',
      reason: '已有證據，但產品決策理由仍不完整。'
    }
  },
  vision: {
    product: '產品願景',
    delta: '↓ 較所選基準下降18點',
    baselineDelta: '↓ 較願景基準 v1.0 下降18點',
    baselineTag: '基準 v1.0',
    timeRange: '時間範圍',
    comment: '定價變動是有意的。驗證仍未獲解釋，匯出也仍在審查中。',
    commentLabel: '{author} 的留言',
    summary: '產品願景從91%變為73%。曲線上的重要事件可透過鍵盤選取。',
    describeEvent: '{date}：{title}。{classification}。變動：{delta}點。',
    loading: '正在載入產品願景曲線',
    why: '原因？'
  },
  movement: {
    why: '產品願景為何變動？',
    summary: '三項變動說明了目前狀態。',
    totals: '14點有意演進 · 4點未解釋'
  },
  attention: {
    heading: '需要關注',
    authentication: '驗證缺少已記錄的產品決策。',
    classification: '分類為未解釋偏移 · Carlos · 平台團隊',
    reviewDecision: '查看決策脈絡',
    exports: '匯出行為已變更，但尚未完成最終分類。',
    inspectEvolution: '檢視演進'
  },
  overview: {
    intentionalPoints: '點變動由已記錄的決策說明',
    unexplainedPoints: '點變動仍需要產品脈絡'
  },
  baseline: {
    approvedAt: '核准日期',
    approvedBy: '核准人',
    sources: '來源文件',
    sourceValue: 'PRD-001 · 產品策略 v3',
    scope: '範圍',
    scopeValue: 'Atlas Home Hub · 核心產品',
    areas: '產品領域',
    areasValue: '定價 · 驗證 · 新手引導 · 匯出',
    supersedes: '取代',
    supersedesValue: '創辦人初始意圖快照',
    reason: '原因',
    reasonValue: '首個經組織核准的產品參考。',
    reference: '目前參考',
    title: '願景基準 v1.0',
    current: '目前'
  },
  filters: {
    all: '全部',
    intentional: '有意',
    unexplained: '未解釋',
    classification: '分類',
    empty: '沒有符合此篩選條件的事件。'
  },
  groups: {
    event: '事件',
    productArea: '產品領域',
    team: '團隊',
    label: '分組依據'
  },
  teamGroups: {
    productAreas: '定價 · 匯出',
    productDetail: '2項決策',
    platformAreas: '定價 · 驗證',
    platformDetail: '1項決策 · 1項未解釋',
    leadershipAreas: '基準核准',
    leadershipDetail: '1項核准'
  },
  decisions: {
    note: '決策記錄',
    reviewMarina: 'Marina 審查',
    pricingPeople: 'Ana 提案 · Marina 核准 · Carlos 實作',
    pricingTitle: '企業方案組合',
    reviewAna: 'Ana 審查',
    noDecision: '沒有相符的產品決策',
    authenticationPeople: 'Carlos 實作 · Ana 審查',
    authenticationTitle: '驗證重新設計',
    why: '為何得出此結論？'
  },
  people: {
    anaRole: '產品總監',
    anaDetail: '5項決策 · 3項核准 · 負責定價',
    carlosRole: '工程主管',
    carlosDetail: '4項實作 · 2項審查 · 負責驗證',
    marinaDetail: '3項核准 · 願景負責人',
    liaRole: '設計主管',
    liaDetail: '3項提案 · 負責產品導覽'
  },
  reports: {
    digest: '每週主管摘要',
    title: '產品願景從79變為73。',
    summary:
      '驗證是影響最大的未解釋因素。匯出行為仍在審查中。定價變動已連結至核准的決策。',
    points: '{count}點'
  },
  evidence: {
    context: '證據提供深入的脈絡，而非主管檢視的主要頁面。',
    artifact: '文件',
    observation: '觀察',
    status: '狀態',
    authentication: '驗證實作已變更',
    linked: '已連結',
    strategy: '企業驗證策略'
  },
  settings: {
    appearance: '外觀',
    appearanceDescription: '完整支援淺色與深色產品主題。',
    switchDark: '切換至深色模式',
    switchLight: '切換至淺色模式',
    voice: '主管語音',
    voiceDescription: '語音專注於結構化的產品脈絡。'
  }
} satisfies typeof en
