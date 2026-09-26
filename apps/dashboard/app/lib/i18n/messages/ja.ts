import type { en } from './en'

export const ja = {
  sections: {
    overview: {
      title: '概要',
      description: '現在の状況、変化の理由、注意が必要な項目を確認します。'
    },
    evolution: {
      title: '進化',
      description: '曲線を確認し、変化を絞り込み、基準を調べます。'
    },
    decisions: {
      title: '意思決定',
      description: '製品の方向性が変わった理由、承認者、影響を確認します。'
    },
    people: {
      title: 'メンバー',
      description:
        '担当者と、意思決定・実装・レビューへの参加状況を確認します。'
    },
    reports: {
      title: 'レポート',
      description: '製品ビジョンの変化と注意項目をまとめた経営層向けサマリー。'
    },
    settings: {
      title: '設定',
      description: 'ワークスペースの表示と、確定的な製品コンテキスト。'
    },
    evidence: {
      title: '証拠',
      description: '製品に関する結論の背景にある根拠。'
    },
    'drift-by-product-area': {
      title: '進化',
      description: '製品領域別にまとめた製品ビジョンの変化。'
    },
    'drift-by-team': {
      title: '進化',
      description: 'チーム別にまとめた製品ビジョンの変化。'
    },
    'drift-events': {
      title: '進化',
      description: '製品ビジョンの重要なイベントとその分類。'
    },
    'drift-graph': {
      title: '進化',
      description: '製品ビジョンの経時的な変化。'
    },
    'drift-report': {
      title: 'レポート',
      description: '選択した期間についての経営層向けの説明。'
    },
    'drift-timeline': {
      title: '進化',
      description: '製品の進化を時系列で確認します。'
    },
    'intentional-drift': {
      title: '進化',
      description: '同じ製品履歴から意図的な進化を抽出します。'
    },
    'unexplained-drift': {
      title: '進化',
      description: '同じ製品履歴から説明のない変化を抽出します。'
    },
    'vision-baseline': {
      title: '進化',
      description: '現在のビジョン基準の監査可能な来歴。'
    }
  },
  classifications: {
    baseline: '基準',
    intentional: '意図的な進化',
    review: '確認中',
    unexplained: '説明のない乖離'
  },
  range: { '30d': '30日', '90d': '90日', '1y': '1年', all: '全期間' },
  months: { apr: '4月', may: '5月', jun: '6月', jul: '7月', aug: '8月' },
  dates: {
    baseline: '4月2日',
    pricing: '6月28日',
    authentication: '7月22日',
    exports: '8月20日'
  },
  teams: {
    leadership: '経営チーム',
    product: '製品チーム',
    platform: 'プラットフォームチーム'
  },
  areas: {
    vision: 'ビジョン',
    pricing: '価格設定',
    authentication: '認証',
    exports: 'エクスポート'
  },
  events: {
    baseline: {
      title: 'ビジョン基準を承認',
      decision: 'ビジョン基準を記録済み',
      reason: '経営チームが、この期間の基準となる製品の方向性を記録しました。'
    },
    pricing: {
      title: '価格戦略を変更',
      decision: '意思決定を記録済み',
      reason: '法人顧客には異なるパッケージ構成が必要でした。'
    },
    authentication: {
      title: '認証を再設計',
      decision: '意思決定が見つかりません',
      reason: '対応する製品の意思決定は見つかりませんでした。'
    },
    exports: {
      title: 'エクスポートの動作を変更',
      decision: '確認待ち',
      reason: '証拠はありますが、製品上の理由はまだ十分に記録されていません。'
    }
  },
  vision: {
    product: '製品ビジョン',
    delta: '↓ 選択した基準から18ポイント',
    baselineDelta: '↓ ビジョン基準 v1.0 から18ポイント',
    baselineTag: '基準 v1.0',
    timeRange: '期間',
    comment:
      '価格の変更は意図的でした。認証は説明がなく、エクスポートは引き続き確認中です。',
    commentLabel: '{author}のコメント',
    summary:
      '製品ビジョンは91%から73%へ変化しています。曲線上の重要なイベントはキーボードで選択できます。',
    describeEvent: '{date}：{title}。{classification}。変化：{delta}ポイント。',
    loading: '製品ビジョンの曲線を読み込み中',
    why: '理由は？'
  },
  movement: {
    why: '製品ビジョンが変化した理由は？',
    summary: '3つの変化が現在の状態を説明しています。',
    totals: '意図的14ポイント · 説明なし4ポイント'
  },
  attention: {
    heading: '注意が必要',
    authentication: '認証には製品の意思決定が記録されていません。',
    classification: '説明のない乖離に分類 · Carlos · プラットフォームチーム',
    reviewDecision: '意思決定の背景を確認',
    exports: 'エクスポートの動作が変わりましたが、最終分類は未確定です。',
    inspectEvolution: '進化を調べる'
  },
  overview: {
    intentionalPoints: 'ポイントは記録された意思決定で説明できます',
    unexplainedPoints: 'ポイントは製品の背景情報がまだ必要です'
  },
  baseline: {
    approvedAt: '承認日',
    approvedBy: '承認者',
    sources: '参照資料',
    sourceValue: 'PRD-001 · 製品戦略 v3',
    scope: '対象範囲',
    scopeValue: 'Atlas Home Hub · コア製品',
    areas: '製品領域',
    areasValue: '価格設定 · 認証 · オンボーディング · エクスポート',
    supersedes: '置き換える基準',
    supersedesValue: '創業者の初期意図の記録',
    reason: '理由',
    reasonValue: '組織が承認した最初の製品基準。',
    reference: '現在の参照基準',
    title: 'ビジョン基準 v1.0',
    current: '現在'
  },
  filters: {
    all: 'すべて',
    intentional: '意図的',
    unexplained: '説明なし',
    classification: '分類',
    empty: 'このフィルターに一致するイベントはありません。'
  },
  groups: {
    event: 'イベント',
    productArea: '製品領域',
    team: 'チーム',
    label: 'グループ化'
  },
  teamGroups: {
    productAreas: '価格設定 · エクスポート',
    productDetail: '意思決定2件',
    platformAreas: '価格設定 · 認証',
    platformDetail: '意思決定1件 · 説明なし1件',
    leadershipAreas: '基準の承認',
    leadershipDetail: '承認1件'
  },
  decisions: {
    note: '意思決定メモ',
    reviewMarina: 'Marinaによるレビュー',
    pricingPeople: 'Anaが提案 · Marinaが承認 · Carlosが実装',
    pricingTitle: '法人向けパッケージ構成',
    reviewAna: 'Anaによるレビュー',
    noDecision: '対応する製品の意思決定なし',
    authenticationPeople: 'Carlosが実装 · Anaがレビュー',
    authenticationTitle: '認証の再設計',
    why: 'この結論の根拠は？'
  },
  people: {
    anaRole: '製品ディレクター',
    anaDetail: '意思決定5件 · 承認3件 · 価格設定を担当',
    carlosRole: 'エンジニアリングリード',
    carlosDetail: '実装4件 · レビュー2件 · 認証を担当',
    marinaDetail: '承認3件 · ビジョン責任者',
    liaRole: 'デザインリード',
    liaDetail: '提案3件 · 製品ナビゲーションを担当'
  },
  reports: {
    digest: '週次経営サマリー',
    title: '製品ビジョンは79から73へ変化しました。',
    summary:
      '認証が、未解決の変化の最大要因でした。エクスポートの動作は引き続き確認中です。価格の変化は承認された意思決定に関連付けられています。',
    points: '{count}ポイント'
  },
  evidence: {
    context:
      '証拠は背景を詳しく確認するためのもので、経営層向けの主画面ではありません。',
    artifact: '資料',
    observation: '観察内容',
    status: '状態',
    authentication: '認証の実装が変更されました',
    linked: '関連付け済み',
    strategy: '法人向け認証戦略'
  },
  settings: {
    appearance: '外観',
    appearanceDescription:
      'ライトとダークの両テーマを完全にサポートしています。',
    switchDark: 'ダークモードに切り替え',
    switchLight: 'ライトモードに切り替え',
    voice: 'エグゼクティブ音声',
    voiceDescription: '音声は構造化された製品の背景情報に集中します。'
  }
} satisfies typeof en
