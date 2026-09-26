export const en = {
  sections: {
    overview: {
      title: 'Overview',
      description: 'Where we are now, why we moved, and what needs attention.'
    },
    evolution: {
      title: 'Evolution',
      description: 'See the curve, filter movement, and inspect the baseline.'
    },
    decisions: {
      title: 'Decisions',
      description:
        'Why product direction changed, who approved it, and what it affected.'
    },
    people: {
      title: 'People',
      description:
        'Ownership, decisions, implementation, and review participation.'
    },
    reports: {
      title: 'Reports',
      description:
        'Executive summaries of Product Vision movement and attention items.'
    },
    settings: {
      title: 'Settings',
      description: 'Workspace appearance and deterministic product context.'
    },
    evidence: {
      title: 'Evidence',
      description: 'Contextual proof behind product conclusions.'
    },
    'drift-by-product-area': {
      title: 'Evolution',
      description: 'Product-area grouping of Product Vision movement.'
    },
    'drift-by-team': {
      title: 'Evolution',
      description: 'Team grouping of Product Vision movement.'
    },
    'drift-events': {
      title: 'Evolution',
      description: 'Important Product Vision events and their classifications.'
    },
    'drift-graph': {
      title: 'Evolution',
      description: 'How Product Vision moved over time.'
    },
    'drift-report': {
      title: 'Reports',
      description: 'Executive explanations over a selected period.'
    },
    'drift-timeline': {
      title: 'Evolution',
      description: 'Product evolution in chronological order.'
    },
    'intentional-drift': {
      title: 'Evolution',
      description:
        'Intentional Evolution filtered from the same product history.'
    },
    'unexplained-drift': {
      title: 'Evolution',
      description:
        'Unexplained movement filtered from the same product history.'
    },
    'vision-baseline': {
      title: 'Evolution',
      description: 'Auditable provenance for the current Vision baseline.'
    }
  },
  classifications: {
    baseline: 'Baseline',
    intentional: 'Intentional Evolution',
    review: 'Under Review',
    unexplained: 'Unexplained Drift'
  },
  range: { '30d': '30d', '90d': '90d', '1y': '1y', all: 'all' },
  months: { apr: 'Apr', may: 'May', jun: 'Jun', jul: 'Jul', aug: 'Aug' },
  dates: {
    baseline: 'Apr 02',
    pricing: 'Jun 28',
    authentication: 'Jul 22',
    exports: 'Aug 20'
  },
  teams: { leadership: 'Leadership', product: 'Product', platform: 'Platform' },
  areas: {
    vision: 'Vision',
    pricing: 'Pricing',
    authentication: 'Authentication',
    exports: 'Exports'
  },
  events: {
    baseline: {
      title: 'Vision baseline approved',
      decision: 'Vision baseline recorded',
      reason:
        'Leadership recorded the product direction used as the reference for this period.'
    },
    pricing: {
      title: 'Pricing strategy changed',
      decision: 'Decision recorded',
      reason: 'Enterprise customers required a different packaging model.'
    },
    authentication: {
      title: 'Authentication redesigned',
      decision: 'Decision not found',
      reason: 'No matching product decision was found.'
    },
    exports: {
      title: 'Export behavior changed',
      decision: 'Review pending',
      reason: 'Evidence exists, but the product rationale is still incomplete.'
    }
  },
  vision: {
    product: 'Product Vision',
    delta: '↓ 18 from the selected baseline',
    baselineDelta: '↓ 18 from Vision Baseline v1.0',
    baselineTag: 'Baseline v1.0',
    timeRange: 'Time range',
    comment:
      'Pricing was intentional. Authentication remains unexplained and exports are still under review.',
    commentLabel: 'Comment from {author}',
    summary:
      'Product Vision moves from 91% to 73%. Important events are available as keyboard-focusable points on the curve.',
    describeEvent: '{date}: {title}. {classification}. Change: {delta} points.',
    loading: 'Loading Product Vision curve',
    why: 'Why?'
  },
  movement: {
    why: 'Why did Product Vision move?',
    summary: 'Three movements explain the current state.',
    totals: '14 intentional · 4 unexplained'
  },
  attention: {
    heading: 'Needs attention',
    authentication: 'Authentication lacks a recorded product decision.',
    classification: 'Classified as Unexplained Drift · Carlos · Platform',
    reviewDecision: 'Review decision context',
    exports: 'Export behavior changed without final classification.',
    inspectEvolution: 'Inspect evolution'
  },
  overview: {
    intentionalPoints: 'points explained by recorded decisions',
    unexplainedPoints: 'points still requiring product context'
  },
  baseline: {
    approvedAt: 'Approved at',
    approvedBy: 'Approved by',
    sources: 'Source artifacts',
    sourceValue: 'PRD-001 · Product Strategy v3',
    scope: 'Scope',
    scopeValue: 'Atlas Home Hub · Core product',
    areas: 'Product areas',
    areasValue: 'Pricing · Authentication · Onboarding · Exports',
    supersedes: 'Supersedes',
    supersedesValue: 'Initial founder intent snapshot',
    reason: 'Reason',
    reasonValue: 'First organization-approved product reference.',
    reference: 'Current reference',
    title: 'Vision Baseline v1.0',
    current: 'Current'
  },
  filters: {
    all: 'All',
    intentional: 'Intentional',
    unexplained: 'Unexplained',
    classification: 'Classification',
    empty: 'No events match this filter.'
  },
  groups: {
    event: 'Event',
    productArea: 'Product Area',
    team: 'Team',
    label: 'Group by'
  },
  teamGroups: {
    productAreas: 'Pricing · Exports',
    productDetail: '2 decisions',
    platformAreas: 'Pricing · Authentication',
    platformDetail: '1 decision · 1 unexplained',
    leadershipAreas: 'Baseline approval',
    leadershipDetail: '1 approval'
  },
  decisions: {
    note: 'Decision note',
    reviewMarina: 'Review by Marina',
    pricingPeople: 'Ana proposed · Marina approved · Carlos implemented',
    pricingTitle: 'Enterprise packaging model',
    reviewAna: 'Review by Ana',
    noDecision: 'No matching product decision',
    authenticationPeople: 'Carlos implemented · Ana reviewed',
    authenticationTitle: 'Authentication redesign',
    why: 'Why do we believe this?'
  },
  people: {
    anaRole: 'Product Director',
    anaDetail: '5 decisions · 3 approvals · owns Pricing',
    carlosRole: 'Engineering Lead',
    carlosDetail: '4 implementations · 2 reviews · owns Authentication',
    marinaDetail: '3 approvals · Vision owner',
    liaRole: 'Design Lead',
    liaDetail: '3 proposals · owns product navigation'
  },
  reports: {
    digest: 'Weekly executive digest',
    title: 'Product Vision moved from 79 to 73.',
    summary:
      'Authentication was the largest unresolved contributor. Export behavior remains under review. Pricing movement is linked to an approved decision.',
    points: '{count} points'
  },
  evidence: {
    context:
      'Evidence is a contextual drill-down, not a primary executive destination.',
    artifact: 'Artifact',
    observation: 'Observation',
    status: 'Status',
    authentication: 'Authentication implementation changed',
    linked: 'Linked',
    strategy: 'Enterprise authentication strategy'
  },
  settings: {
    appearance: 'Appearance',
    appearanceDescription: 'Light and dark are first-class product themes.',
    switchDark: 'Switch to dark mode',
    switchLight: 'Switch to light mode',
    voice: 'Executive Voice',
    voiceDescription: 'Voice stays focused on structured product context.'
  }
}
