# OpenCyx World Usage

## 1. Demo scenarios

This repo ships `scripts/demo-open-world.ts` to show how OpenCyx World (Open-world + Cyxworld mode) works without a live AI:

1. Run `cmd /c "set PATH=%PNPM_HOME%;%PATH% && pnpm dlx tsx --tsconfig tsconfig.json scripts/demo-open-world.ts"`.  
2. The script iterates through three pre-baked scenarios: **Product Launch Enablement**, **Customer Onboarding Lab**, and **Executive Briefing**.  
3. Each run logs the system & user prompts injected into the pipeline and returns structured outlines (slides, interactive configs, quiz/PBL entries) so you can inspect the JSON output.
4. Swap the stubbed `aiCall` with a real provider once API keys are configured and rerun to capture live responses.

## 2. Tests & verification

- `pnpm test` – runs `vitest run` (77 tests across five spec files).  
- `pnpm lint` – executes `eslint` across the workspace.  
- `pnpm test:e2e` – (optional) launches Playwright when browsers are available.  
- After installing dependencies, verify the demo script still logs both scenarios so documentation matches reality.

## 3. Sample run summary

- The `scripts/demo-open-world.ts` script is the “sample test” you can run without AI. It logs the OpenCyx prompts for Product Launch Enablement and Customer Onboarding Lab and returns canned outlines that mimic a full generation cycle.  
- You’ve already run the scripted flow (see the logs in your terminal), so the only remaining step before real AI is wiring the provider call. No live API requests are made today.

## 3. Workflow tips

- Keep `community/open-world.md` handy as the definitive guide for retargeting prompts and personas.  
- Update `README.md` summary sections if you add more scenarios or rename the Cyxworld flavor.  
- Commit demos + JSON samples whenever you refresh the prompts so others can see how the flow changes.  
