# OpenCyx World Usage

This guide explains the four scripted scenarios we keep to demonstrate Open-world + Cyxworld. Each section covers why the scenario matters, how we configure the prompts, and what you should expect after the run.

## Quick Start

### Demo Script (Gemini only)

Run all four demo scenarios with a single command:

```bash
pnpm demo
```

This requires `GOOGLE_API_KEY` in your `.env.local` file. The script uses `gemini-2.5-flash` via the Gemini API and prints token usage for each scenario.

### Web App (Any Provider)

The web UI at http://localhost:3000 works with **any configured provider**:

| Provider | Env Variable |
|----------|--------------|
| OpenAI | `OPENAI_API_KEY` |
| Anthropic | `ANTHROPIC_API_KEY` |
| Google Gemini | `GOOGLE_API_KEY` |
| DeepSeek | `DEEPSEEK_API_KEY` |
| MiniMax | `MINIMAX_API_KEY` |
| Grok (xAI) | `GROK_API_KEY` |

Configure at least one provider in `.env.local`, then run `pnpm dev`.

---

## How We Built This Demo

The demo script lives in `scripts/demo-open-world.ts`. Here's what we modified to create it:

### Files Modified

| File | What We Did |
|------|-------------|
| `scripts/demo-open-world.ts` | Created scenarios with prompts and sample outlines |
| `package.json` | Added `"demo": "tsx --env-file=.env.local scripts/demo-open-world.ts"` |

### Script Structure

```typescript
// scripts/demo-open-world.ts

import { generateSceneOutlinesFromRequirements } from '@/lib/generation/outline-generator';
import type { UserRequirements } from '@/lib/types/generation';

// 1. Define your scenario
const scenarios = [
  {
    name: 'Product Launch Enablement',
    requirements: {
      requirement: 'Design a product launch enablement briefing...',
      language: 'en-US',
      userNickname: 'Alex',
      userBio: 'Head of Enablement at Velocity Systems',
    },
    sampleOutlines: [ /* fallback data if API fails */ ],
  },
];

// 2. Call the outline generator
const result = await generateSceneOutlinesFromRequirements(
  scenario.requirements,
  undefined,
  undefined,
  aiCallFunction,  // Custom function to call Gemini API
);

// 3. Output the generated scenes
console.log(JSON.stringify(result.data, null, 2));
```

### Adding Your Own Scenario

**Step 1:** Open `scripts/demo-open-world.ts`

**Step 2:** Add a new scenario to the `scenarios` array:

```typescript
{
  name: 'Compliance Training',
  requirements: {
    requirement: 'Create a GDPR compliance training for engineering teams, covering data handling, user consent, and breach reporting procedures.',
    language: 'en-US',
    userNickname: 'Jordan',
    userBio: 'Security Lead at TechCorp',
  },
  sampleOutlines: [
    {
      id: 'scene_intro',
      type: 'slide',
      title: 'Why GDPR Matters',
      description: 'Set context for compliance requirements.',
      keyPoints: ['Fines up to 4% of revenue', 'User trust', 'Legal obligations'],
      order: 1,
    },
    // Add more sample scenes...
  ],
},
```

**Step 3:** Run the demo:

```bash
pnpm demo
```

### Key Fields Explained

| Field | Description |
|-------|-------------|
| `requirement` | The main prompt describing what to generate |
| `language` | Output language (`en-US`, `zh-CN`, etc.) |
| `userNickname` | Name shown in personalized content |
| `userBio` | Context about the user for tailored content |
| `sampleOutlines` | Fallback data if API call fails |

---

## Demo Scenarios

### 1. Product Launch Enablement

- **Prompt:** `Design a product launch enablement briefing that covers customer pain points, key differentiators, demo checklist, and follow-up actions for the sales and customer success teams.`
- **Outcome:** 9-10 scenes with vision slides, interactive demo checklists, PBL role-plays, and quiz checkpoints.
- **Token usage:** ~6,000 tokens

### 2. Customer Onboarding Lab

- **Prompt:** `Plan a customer onboarding lab for new analytics users, including setup tasks, success metrics, interactive walkthroughs, and accountability checkpoints.`
- **Outcome:** 10 scenes with structured interactive configs and PBL missions.
- **Token usage:** ~5,500 tokens

### 3. Executive Briefing

- **Prompt:** `Prepare an executive briefing that summarizes the AI roadmap, performance metrics, risks, and next decisions for the board.`
- **Outcome:** Scenes with metrics slides, decision tree interactives, and strategic summaries.

### 4. Interview Readiness Lab

- **Prompt:** `Design an interview readiness lab for senior product managers, including mock questions, behavioral scenarios, and immediate feedback guidance.`
- **Outcome:** Mission slides, interactive question flows, and feedback slides with quiz checkpoints.

---

## Test & Verification Commands

| Command | Description |
|---------|-------------|
| `pnpm demo` | Run all 4 Open-world scenarios with Gemini API |
| `pnpm test` | Vitest suite (77 tests across 5 spec files) |
| `pnpm lint` | ESLint check |
| `pnpm test:e2e` | Playwright end-to-end tests (requires browsers) |
| `pnpm dev` | Start dev server at http://localhost:3000 |

---

## Web UI Testing

After running `pnpm dev`, open http://localhost:3000 and paste any of the scenario prompts above to generate a full interactive experience in the browser.

---

## Advanced Customization

For deeper customization (prompt templates, agent personas, mode flags), see:

- **[community/open-world.md](community/open-world.md)** — Full guide on rewriting prompts and reframing agents for any domain

### Quick Reference

| Customization | File to Modify |
|---------------|----------------|
| Outline prompts | `lib/generation/prompts/templates/requirements-to-outlines/` |
| Scene prompts | `lib/generation/prompts/templates/slide-content/` |
| Quiz prompts | `lib/generation/prompts/templates/quiz-content/` |
| Interactive prompts | `lib/generation/prompts/templates/interactive-html/` |
| Agent personas | `lib/orchestration/registry/store.ts` |

---

## Next Steps

1. Run `pnpm demo` to verify your Google API key works.
2. Add your own scenario to `scripts/demo-open-world.ts`.
3. Try the web UI at http://localhost:3000 with custom prompts.
4. Read [community/open-world.md](community/open-world.md) for deeper customization.
