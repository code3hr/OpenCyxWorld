# OpenCyx World Usage

This guide explains the four scripted scenarios we keep to demonstrate Open-world + Cyxworld. Each section covers why the scenario matters, how we configure the prompts, and what you should expect after the run.

## Quick Start

Run all four demo scenarios with a single command:

```bash
pnpm demo
```

This requires `GOOGLE_API_KEY` in your `.env.local` file. The script uses `gemini-2.5-flash` via the Gemini API and prints token usage for each scenario.

## 1. Product Launch Enablement

- **Why it exists:** Showcasing an enterprise-ready briefing proves that OpenCyx World can turn a product story into narrated scenes, demos, and actions.
- **Prompt:** `Design a product launch enablement briefing that covers customer pain points, key differentiators, demo checklist, and follow-up actions for the sales and customer success teams.`
- **Open-world hooks:** The outline prompt treats the scenario as "Outcome Narrative → Demo Walkthrough → Post-launch Actions." The scene prompts and agents use persona-neutral frames (experience lead + assistant); no classroom language remains.
- **Outcome:** JSON output with 9-10 scenes including vision slides, interactive demo checklists, PBL role-plays, and quiz checkpoints. Typical token usage: ~6,000 tokens.

## 2. Customer Onboarding Lab

- **Why it exists:** This scenario proves the engine can double as an onboarding workshop—checklists, walkthroughs, and cadences are all represented as scenes.
- **Prompt:** `Plan a customer onboarding lab for new analytics users, including setup tasks, success metrics, interactive walkthroughs, and accountability checkpoints.`
- **Open-world hooks:** Prompts mention "launch checklist," "guided walkthrough," and "cadence playbook" instead of "class," while the agent personas remain the enterprise voices you tuned in the registry.
- **Outcome:** 10 scenes with structured interactive configs and PBL missions, showing you can reuse the action templates for practical enablement labs. Typical token usage: ~5,500 tokens.

## 3. Executive Briefing

- **Why it exists:** Executive audiences expect high-level narratives and decision workshops. This scenario demonstrates how OpenCyx World can model board-ready content with minimal prompt changes.
- **Prompt:** `Prepare an executive briefing that summarizes the AI roadmap, performance metrics, risks, and next decisions for the board.`
- **Open-world hooks:** The outline stage produces "Strategic Summary → Impact Metrics → Decision Workshop," while the scene prompts still rely on the shared schema (slides + interactive actions).
- **Outcome:** Scenes include metrics slides, decision tree interactives, and strategic summary content suitable for board presentations.

## 4. Interview Readiness Lab

- **Why it exists:** Interview prep is demanding—this scenario shows how OpenCyx World can simulate coaching sessions with stock questions, role-play guidance, and feedback loops.
- **Prompt:** `Design an interview readiness lab for senior product managers, including mock questions, behavioral scenarios, and immediate feedback guidance.`
- **Open-world hooks:** The prompts emphasize "mission," "mock questions," and "feedback rubrics," while the narrative cards still rely on the same slide/interactive templates plus Cyxworld sentiments.
- **Outcome:** JSON output containing mission slides, interactive question flows, and feedback slides with quiz checkpoints for coaching/interview prep.

## Test & Verification Commands

| Command | Description |
|---------|-------------|
| `pnpm demo` | Run all 4 Open-world scenarios with Gemini API |
| `pnpm test` | Vitest suite (77 tests across 5 spec files) |
| `pnpm lint` | ESLint check |
| `pnpm test:e2e` | Playwright end-to-end tests (requires browsers) |
| `pnpm dev` | Start dev server at http://localhost:3000 |

## Web UI Testing

After running `pnpm dev`, open http://localhost:3000 and paste any of the scenario prompts above to generate a full interactive experience in the browser.

## Next Steps

1. Run `pnpm demo` to verify your Google API key works with the Gemini model.
2. Try the web UI at http://localhost:3000 with the scenario prompts.
3. Customize the prompt templates in `lib/generation/prompts/templates/` for your own domains.
4. Update agent personas in `lib/orchestration/registry/store.ts` for your branded experience.
