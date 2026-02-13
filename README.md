# Vampire

**AI agent that sucks up your GitHub issues and bleeds out pull requests.**

Feed it an issue — Vampire clones the repo into an isolated workspace, unleashes an AI coding agent, commits the result, pushes the branch, and serves up a PR-ready diff. All while you watch in real-time from the dashboard.

## How it works

```
GitHub Issue #42          ┌──────────┐
  "Add dark mode" ──────▸ │ Vampire  │ ──▸ Branch pushed, PR ready
                          │          │
Direct task               │  Clone   │
  "Refactor auth" ──────▸ │  Agent   │ ──▸ Review diff, create PR
                          │  Commit  │
Follow-up                 │  Push    │
  "Use CSS vars" ──────▸  └──────────┘ ──▸ Iterates on same branch
```

## Quick Start

### Prerequisites

- Node.js 20+
- [GitHub CLI](https://cli.github.com/) (`gh`) — authenticated
- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) CLI

### Run

```bash
npx vampire
```

The server starts on a random available port (assigned by the OS).
Use `--port` to specify a port:

```bash
npx vampire --port 3333
```

### Get started

1. **New Project** — browse to a local git repo
2. **Settings** — test your AI provider connection
3. **New Assignment** — describe the task or import a GitHub issue
4. Watch Vampire work

## Features

- **Issue-driven** — Point at a GitHub issue, get a branch with the fix
- **Direct mode** — No issue? Just describe the task
- **Real-time logs** — Watch the AI read, edit, and run commands live via SSE
- **PR from dashboard** — Review diffs, edit title/body, create PR in one click
- **Follow-up** — Send feedback, AI iterates on the same branch
- **Auto-retry** — No changes on first attempt? Vampire tries a different approach
- **Multi-provider** — Pluggable AI system (Claude Code now, Gemini & Codex coming)
- **Safe** — Isolated clones, never touches your working tree, force-with-lease pushes

## Development

```bash
git clone https://github.com/baealex/claude-worker.git vampire
cd vampire
pnpm install
pnpm db:push
pnpm dev        # client(:5173) + server(:3333)
```

## Architecture

```
apps/
  client/          React 19 + Vite + Tailwind CSS 4
  server/          Fastify 5 + Prisma 6 + SQLite
    src/
      index.ts       createApp() factory
      routes/        projects, jobs, providers
      providers/     AI provider interface (Claude Code)
      services/      GitHub API helpers
      worker.ts      Clone → Agent → Commit → Push pipeline
  cli/             npm package (vampire)
    src/index.ts     CLI entry — DB init + server start
prisma/
  schema.prisma    Shared schema
```

## Release

```bash
# Tag triggers GitHub Actions → npm publish
git tag v1.0.0
git push origin v1.0.0

# Or publish manually
pnpm release
```

## Adding a provider

```typescript
// apps/server/src/providers/my-agent.ts
import type { Provider } from './types.js';

export const myProvider: Provider = {
  info: {
    name: 'my-agent',
    displayName: 'My Agent',
    coAuthor: 'My Agent <noreply@example.com>',
  },
  async testConnection() { /* ... */ },
  runAgent({ prompt, cwd, callbacks }) { /* ... */ },
};
```

```typescript
// apps/server/src/providers/registry.ts
providers.set('my-agent', myProvider);
```

UI, API, worker pick it up automatically.

## Tech Stack

| Layer | Tech |
|-------|------|
| Server | Node.js, Fastify 5, Prisma 6, SQLite |
| Client | React 19, React Router 7, Tailwind CSS 4, Radix UI |
| Build | Vite 6, tsup, TypeScript 5 |
| AI | Claude Code (pluggable) |
| CI/CD | GitHub Actions → npm |

## License

MIT
