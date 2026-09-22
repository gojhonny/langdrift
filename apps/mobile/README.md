# Mobile

Installed executive companion. Vite and React on port 3003, with a PWA plugin. Shared state uses Jotai.

The home view puts the Product Vision summary and the Voice Orb first. Voice answers are a fixed local set of executive questions. The full curve opens on demand. Curve values such as `73%` and `91%` are illustrative fixtures, not the Product Vision formula.

```sh
./cli/drift dev mobile
```

`pnpm --filter mobile build` typechecks and writes `dist`. `start` serves that build with Vite preview on port 3003.
