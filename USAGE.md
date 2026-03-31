# OpenCyx World Usage

This guide explains the four scripted scenarios we keep to demonstrate Open-world + Cyxworld without a live AI. Each section covers why the scenario matters, how we configure the prompts, and what you should expect after the run.

## 1. Product Launch Enablement

- **Why it exists:** Showcasing an enterprise-ready briefing proves that OpenCyx World can turn a product story into narrated scenes, demos, and actions.  
- **Setup:** Run `pnpm dlx tsx --tsconfig tsconfig.json scripts/demo-open-world.ts`. The script feeds the Product Launch Enablement prompts (outline stage plus slide content) into the pipeline while logging the injected system/user prompts for transparency.  
- **Open-world hooks:** The outline prompt treats the scenario as “Outcome Narrative → Demo Walkthrough → Post-launch Actions.” The scene prompts and agents are already using the persona-neutral frames you defined (experience lead + assistant); no classroom language remains.  
- **Outcome:** You get JSON output with a vision slide, an interactive demo checklist, and a transcribed action slide with a quiz, proving the runtime can narrate a launch without touching the UI layer.

## 2. Customer Onboarding Lab

- **Why it exists:** This scenario proves the engine can double as an onboarding workshop—checklists, walkthroughs, and cadences are all represented as scenes.  
- **Setup:** Same command as above reruns the script; it now injects the onboarding prompts with guided walkthrough and PBL mission instructions.  
- **Open-world hooks:** Prompts mention “launch checklist,” “guided walkthrough,” and “cadence playbook” instead of “class,” while the agent personas remain the enterprise voices you tuned in the registry.  
- **Outcome:** The run logs structured interactive configs and the PBL mission, showing you can reuse the action templates for practical enablement labs.

## 3. Executive Briefing

- **Why it exists:** Executive audiences expect high-level narratives and decision workshops. This scenario demonstrates how OpenCyx World can model board-ready content with minimal prompt changes.  
- **Setup:** Same demo script again injects the executive briefing prompts, logging both system and user prompts for the executive persona.  
- **Open-world hooks:** The outline stage now produces “Strategic Summary → Impact Metrics → Decision Workshop,” while the scene prompts still rely on the shared schema (slides + interactive actions).  
- **Outcome:** The script prints the metrics slide, decision tree interactive, and the JSON output you can use to validate open-world behavior before you swap in real AI.

## 4. Interview Readiness Lab

- **Why it exists:** Interview prep is demanding—this scenario shows how OpenCyx World can simulate coaching sessions with stock questions, role-play guidance, and feedback loops.  
- **Setup:** The same script injects the Interview Readiness prompts, logging the system/user prompts that describe “Interview Mission → Mock Questions → Feedback & Next Steps.”  
- **Open-world hooks:** The prompts emphasize “mission,” “mock questions,” and “feedback rubrics,” while the narrative cards still rely on the same slide/interactive templates plus Cyxworld sentiments.  
- **Outcome:** You get JSON output containing the mission slide, interactive question flow, and feedback slide with quiz, which proves the engine can center on coaching/interview prep before you wire in real AI responses.

## Test & verification commands

- `pnpm test` – Vitest suite (77 tests across five spec files).  
- `pnpm lint` – ESLint.  
- `pnpm test:e2e` – Playwright (requires browsers).  
- `cmd /c "set PATH=%PNPM_HOME%;%PATH% && pnpm dlx tsx --tsconfig tsconfig.json scripts/demo-open-world.ts"` – runs the scripted scenarios above. No live AI calls are made; the stubbed `aiCall` prints the outlines you see in this guide.

## Next steps

1. Replace the stubbed `aiCall` inside `scripts/demo-open-world.ts` with your provider of choice once API keys are configured.  
2. Capture the real AI outputs (JSON + logs) and store them alongside this file for future comparisons.  
3. Update the README/guide to include any new branded scenario names or persona sets you add under the OpenCyx World umbrella.
