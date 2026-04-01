# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

OpenMAIC fork focused on **Open-world Mode** (branded as **Cyxworld**). The same multi-agent engine that powers interactive classrooms now delivers product launches, onboarding labs, executive briefings, and any domain described via prompts. The runtime (LangGraph director, outline/scene pipeline, exports, UI) stays intact—only the prompt templates and agent personas change.

## Commands

```bash
pnpm install          # Install dependencies (builds internal packages)
pnpm dev              # Dev server at http://localhost:3000
pnpm build && pnpm start  # Production build

pnpm test             # Vitest unit tests (77 tests in tests/**)
pnpm test:e2e         # Playwright e2e (port 3002, requires browsers)
pnpm lint             # ESLint
pnpm lint --fix       # ESLint with auto-fix
pnpm format           # Prettier format
npx tsc --noEmit      # Type check

# Open-world demo (4 scenarios: Product Launch, Onboarding Lab, Executive Briefing, Interview Readiness)
pnpm dlx tsx --tsconfig tsconfig.json scripts/demo-open-world.ts
```

## Architecture

### Generation Pipeline (`lib/generation/`)
Two-stage: outline → scene content. Templates in `lib/generation/prompts/templates/`:
- `requirements-to-outlines/` — Converts user intent to structured outline
- `slide-content/`, `quiz-content/`, `interactive-html/` — Scene generators
- `slide-actions/`, `interactive-actions/` — Action narration prompts

For Open-world, these templates use "experience architect" framing instead of classroom language.

### Multi-Agent Orchestration (`lib/orchestration/`)
- `director-graph.ts` — LangGraph state machine for agent turns
- `registry/store.ts` — Agent personas (Open-world uses "Experience Lead", "Implementation Coach", "Curiosity Catalyst")
- `tool-schemas.ts` — Agent tools (whiteboard, spotlight, etc.)

### Playback & Action Engines
- `lib/playback/engine.ts` — State machine: idle → playing → live
- `lib/action/engine.ts` — Executes 28+ action types (speech, whiteboard draw/text/shape/chart, spotlight, laser)

### State Management (`lib/store/`)
Zustand stores: `stage.ts` (scene/playback), `canvas.ts` (elements), `settings.ts` (providers), `whiteboard-history.ts`

### API Routes (`app/api/`)
- `generate-classroom/` — Async job submission + polling
- `generate/` — Scene generation (outlines, content, images, TTS)
- `chat/` — Multi-agent discussion (SSE streaming)
- `pbl/` — Project-Based Learning

### Internal Packages (`packages/`)
- `pptxgenjs/` — PowerPoint export
- `mathml2omml/` — MathML → Office Math for PPTX

## Open-world / Cyxworld

See `community/open-world.md` for full guide. Key customization points:
1. **Prompt templates** (`lib/generation/prompts/templates/`) — Reframe from classroom to experience/walkthrough language
2. **Agent personas** (`lib/orchestration/registry/store.ts`, `skills/openmaic/`) — Enterprise roles instead of teacher/student
3. **Mode flag** — Map different `promptId`s to load different template sets

Demo scenarios in `scripts/demo-open-world.ts` and documented in `USAGE.md`.

## Code Conventions

- **Path alias**: `@/` maps to project root
- **Unused variables**: Prefix with `_` to avoid lint errors
- **i18n**: All UI text must be internationalized (files in `messages/`)
- **Providers**: Configured via env vars (`{PROVIDER}_API_KEY`) or `server-providers.yml`
