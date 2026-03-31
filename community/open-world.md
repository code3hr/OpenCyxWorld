# Open-world Mode Guide

This repo is an Open-world fork of OpenMAIC. Use this guide whenever you want to retarget the prompts, agents, and documentation toward a new domain (product launch, onboarding lab, executive briefing, etc.).

## 1. Retarget the prompts

- Files under `lib/generation/prompts/templates` drive the two-stage pipeline: `requirements-to-outlines` (outline generation), `slide-content`/`slide-actions` (scene content + narration). Rewrite the system/user Markdown so they describe your new experience instead of a classroom lecture.
- Keep the loader structure (`buildPrompt`, `PROMPT_IDS`) intact; just replace the instructions and tone. Use neutral words like “experience,” “agenda,” or “outcome” and strip any mention of “class,” “lecture,” or “teacher.”

## 2. Update the personas

- Default agents live in `lib/orchestration/registry/store.ts` and describe How the Lead, Assistant, and students behave. Replace their personas with business-aligned voices (e.g., Experience Lead, Implementation Coach, Curiosity Catalyst) and keep their allowed actions the same.
- If you have custom personas saved in `skills/openmaic`, edit their metadata there so the skill layer surfaces the right tone.

## 3. Surface the mode

- Mention the mode in the README (see the “Open-world Mode” and “Cyxworld flavor” sections) and add a script or badge showing how to run the demo flows.
- The demo script (`scripts/demo-open-world.ts`) now logs the generated prompts/outlines for Product Launch Enablement and Customer Onboarding Lab even when you don’t have a live AI.
- When you want to ship a branded experience, call it Cyxworld mode or OpenCyx World so contributors know which prompt/persona set to load.

## 4. Run the demos

1. `pnpm test` – validates the TypeScript/Vitest pipeline.  
2. `pnpm lint` – runs ESLint.  
3. `pnpm test:e2e` – (optional) runs Playwright tests once browsers are configured.  
4. `cmd /c "set PATH=%PNPM_HOME%;%PATH% && pnpm dlx tsx --tsconfig tsconfig.json scripts/demo-open-world.ts"` – logs the prompts and outlines for both sample scenarios.

Keep shipping prompt variations + output snapshots so the Open-world experience remains obvious even when the underlying runtime stays the same.
