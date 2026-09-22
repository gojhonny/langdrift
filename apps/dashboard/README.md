# Dashboard

Authenticated analytical app. Next.js 16 on port 3001. Shared dashboard state uses Zustand.

Primary navigation is Overview, Evolution, Decisions, People, and Reports. Settings is available from the shell. Evolution also has drill-down routes for the curve, timeline, events, team, product area, intentional evolution, unexplained drift, and the vision baseline. Evidence is a contextual route, not a primary destination.

Scores and events in the current views are illustrative fixtures. They do not define the Product Vision formula.

```sh
./cli/drift dev dashboard
```
