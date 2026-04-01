# Open-World Mode

OpenMAIC is already a multi-agent engine, so the "classroom" framing mainly lives in the prompt templates and agent personas. To pivot to "open-world" domains, keep the runtime and data flow but rewrite what you ask the agents to do. This document outlines where those prompts live and how to reshape them so the system can confidently cover any topic the user describes.

---

## Architecture Overview

### How Content Generation Works

```
User Prompt → Outline Generator → Scene Generator → Playback Engine
                    ↓                    ↓                 ↓
            (requirements-to-outlines)  (slide-content)   (actions)
                    ↓                    ↓                 ↓
              Structured Outline    Scene Content      AI Narration
```

### Key Files and What They Do

| File/Directory | Purpose |
|----------------|---------|
| `scripts/demo-open-world.ts` | Demo script that runs 4 scenarios via Gemini API |
| `lib/generation/outline-generator.ts` | Converts user prompts into structured outlines |
| `lib/generation/scene-generator.ts` | Converts outlines into rich scene content |
| `lib/generation/pipeline-runner.ts` | Orchestrates the full generation pipeline |
| `lib/generation/prompts/templates/` | Prompt templates that control AI output |
| `lib/orchestration/director-graph.ts` | LangGraph state machine for agent turns |
| `lib/orchestration/registry/store.ts` | Agent persona definitions |
| `lib/playback/engine.ts` | State machine for classroom playback |
| `lib/action/engine.ts` | Executes actions (speech, whiteboard, effects) |

### Prompt Template Structure

```
lib/generation/prompts/templates/
├── requirements-to-outlines/    # Stage 1: User input → Outline
│   ├── system.md               # AI persona and instructions
│   └── user.md                 # User context template
├── slide-content/              # Stage 2: Outline → Slide content
│   ├── system.md
│   └── user.md
├── quiz-content/               # Quiz generation
├── interactive-html/           # Interactive simulation generation
├── slide-actions/              # Narration and action generation
└── interactive-actions/        # Interactive scene actions
```

---

## Quick Demo

Run all four Open-world scenarios with:

```bash
pnpm demo
```

This uses `gemini-2.5-flash` via the Gemini API. Requires `GOOGLE_API_KEY` in `.env.local`.

**Demo scenarios:**
1. **Product Launch Enablement** — Sales/CS briefing with pain points, differentiators, demo checklist
2. **Customer Onboarding Lab** — Setup tasks, success metrics, interactive walkthroughs
3. **Executive Briefing** — AI roadmap, metrics, risks, board decisions
4. **Interview Readiness Lab** — Mock questions, behavioral scenarios, feedback guidance

See [USAGE.md](../USAGE.md) for step-by-step instructions on adding your own scenarios.

---

## 1. Reword the Generation Prompts

The outline → scene → action pipeline is driven by Markdown templates in `lib/generation/prompts/templates`. Each template pair (`system.md` / `user.md`) defines a stage.

### Outline Stage

**File:** `lib/generation/prompts/templates/requirements-to-outlines/system.md`

**What it does:** Converts user prompts into a structured outline with scenes.

**How to customize:**
- Change "teacher" language to "experience architect" or "guide"
- Replace "classroom" with "experience" or "walkthrough"
- Adjust scene types (slide, quiz, interactive, pbl) based on your domain

**Example customization:**
```markdown
# Before (classroom)
You are a skilled teacher creating a lesson plan...

# After (open-world)
You are an experience architect designing a guided journey...
```

### Scene Content Stage

**File:** `lib/generation/prompts/templates/slide-content/system.md`

**What it does:** Generates detailed content for each scene (text, images, layout).

**How to customize:**
- Shift from "slides" to "scenes" or "steps"
- Add domain-specific elements (checklists, demos, comparisons)
- Keep structure reusable (title, body, call-to-action)

### Quiz Content

**File:** `lib/generation/prompts/templates/quiz-content/`

**What it does:** Generates quiz questions and answers.

**How to customize:**
- Rename "quiz" to "reflection checkpoint" or "knowledge check"
- Replace "student" with "participant" or "team member"
- Adjust question types for your domain

### Interactive Content

**File:** `lib/generation/prompts/templates/interactive-html/`

**What it does:** Generates HTML-based interactive simulations.

**How to customize:**
- Frame as "product demos" or "workflow simulations"
- Define interaction patterns (click, drag, compare)
- Specify expected outcomes

### Action Prompts

**Files:** `lib/generation/prompts/templates/slide-actions/`, `interactive-actions/`

**What they do:** Generate narration scripts and whiteboard actions.

**How to customize:**
- Change "lecture" to "walkthrough" or "narration"
- Adjust tone (casual, executive, technical)
- Define action sequences

---

## 2. Reframe the Agents

### Agent Definitions

**File:** `lib/orchestration/registry/store.ts`

**What it does:** Defines agent personas, roles, and allowed actions.

**How to customize:**

```typescript
// Before (classroom)
{
  name: 'Professor Chen',
  role: 'teacher',
  persona: 'A patient educator who explains complex topics...',
}

// After (open-world)
{
  name: 'Alex',
  role: 'experience_lead',
  persona: 'A product expert who guides stakeholders through walkthroughs...',
}
```

### Agent Roles for Different Domains

| Domain | Lead Agent | Support Agent |
|--------|------------|---------------|
| Product Launch | Product Manager | Sales Engineer |
| Onboarding | Success Manager | Technical Advisor |
| Executive Briefing | Strategy Lead | Data Analyst |
| Training | Coach | Mentor |

---

## 3. Surface Open-World to Users

### Update UI Copy

- Change "Start learning" to "Create your experience"
- Add example prompts for different domains
- Show enterprise use cases alongside learning examples

### Add Mode Selection (Optional)

If you want multiple flavors (classroom vs. enterprise):

1. Create separate prompt directories:
   ```
   lib/generation/prompts/templates/
   ├── classroom/           # Traditional learning
   ├── enterprise/          # Business scenarios
   └── custom/              # User-defined
   ```

2. Map them with a mode flag in the UI or API

---

## 4. Test Your Open-World Flow

1. **Run the demo script:**
   ```bash
   pnpm demo
   ```

2. **Start the web app:**
   ```bash
   pnpm dev
   ```

3. **Test in browser:** Open http://localhost:3000 and try:
   - "Show me a product launch walkthrough"
   - "Guide the first-week onboarding lab"
   - "Prepare a board presentation"

4. **Verify output:** Check that generated JSON has no "classroom" language

5. **Run tests:**
   ```bash
   pnpm test
   ```

---

## 5. What We Added for This Demo

### Files Created/Modified

| File | Change |
|------|--------|
| `scripts/demo-open-world.ts` | Created demo script with 4 scenarios |
| `package.json` | Added `"demo"` script |
| `USAGE.md` | Documented scenarios and how to add your own |
| `community/open-world.md` | This guide |
| `README.md` | Added "What is OpenCyxWorld?" section |

### Demo Script Architecture

```typescript
// scripts/demo-open-world.ts

// 1. Import the outline generator
import { generateSceneOutlinesFromRequirements } from '@/lib/generation/outline-generator';

// 2. Define scenarios with prompts
const scenarios = [
  {
    name: 'Product Launch Enablement',
    requirements: {
      requirement: 'Design a product launch briefing...',
      language: 'en-US',
      userNickname: 'Alex',
      userBio: 'Head of Enablement',
    },
    sampleOutlines: [ /* fallback data */ ],
  },
];

// 3. Call Gemini API with custom aiCall function
const result = await generateSceneOutlinesFromRequirements(
  scenario.requirements,
  undefined,
  undefined,
  createAiCall(scenario.sampleOutlines),
);

// 4. Output results
console.log(JSON.stringify(result.data, null, 2));
```

---

## Next Steps

1. Run `pnpm demo` to see the 4 scenarios in action
2. Add your own scenario to `scripts/demo-open-world.ts`
3. Customize prompt templates for your domain
4. Update agent personas to match your use case
5. Submit a PR with your new templates and scenarios

Need help? See [USAGE.md](../USAGE.md) for detailed instructions.
