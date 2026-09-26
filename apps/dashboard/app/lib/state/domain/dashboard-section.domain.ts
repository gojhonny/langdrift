export type DashboardSection =
  | 'decisions'
  | 'drift-by-product-area'
  | 'drift-by-team'
  | 'drift-events'
  | 'drift-graph'
  | 'drift-report'
  | 'drift-timeline'
  | 'evidence'
  | 'evolution'
  | 'intentional-drift'
  | 'overview'
  | 'people'
  | 'reports'
  | 'settings'
  | 'unexplained-drift'
  | 'vision-baseline'

// AGENT: This shouldn't be a type. Who defines what page is, it's not a injectable component, it's the file system structure itself
