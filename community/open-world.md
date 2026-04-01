# Open-World Mode

OpenMAIC is already a multi-agent engine, so the "classroom" framing mainly lives in the prompt templates and agent personas. To pivot to "open-world" domains, keep the runtime and data flow but rewrite what you ask the agents to do. This document outlines where those prompts live and how to reshape them so the system can confidently cover any topic the user describes.

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

## 1. Reword the generation prompts

The outline → scene → action pipeline is driven by Markdown templates in `lib/generation/prompts/templates`. Each template pair (`system.md` / `user.md`) defines a stage. Update them to emphasize a free-form, user-driven experience:

- **Outline stage:** `lib/generation/prompts/templates/requirements-to-outlines/system.md`
  - Tell the model it is a "creative experience designer" whose job is to ingest a user topic/goal and return a structure (sections, key takeaways, deliverables) that works for any domain (training, onboarding, product narratives, community stories, etc.).
  - Keep the return format the same (outline with scenes/steps) but remove classroom-specific language (greetings, lectures, quizzes). Focus on "intent → narrative → checkpoints."
  - Example system text: "You are designing a guided experience. Mirror the user's tone, ask clarifying questions only when required, aim for 4–6 progressive scenes, and mark which scene is for reflection/action."

- **Scene content:** `lib/generation/prompts/templates/slide-content/system.md` and `user.md`
  - Shift instructions from "slides" to "scenes" or "steps." Ask the LLM to describe each scene with context, visuals, next actions, and optional media pointers.
  - Encourage cross-domain features (checklists, demos, comparisons) and remind it to keep the structure reusable (title, body, call-to-action, optional resources).

- **Quiz & interactive prompts:** (`lib/generation/prompts/templates/quiz-content`, `interactive-html`, etc.)
  - Instead of calling them "quizzes," frame them as "reflection checkpoints," "challenge questions," or "product demos." Replace mentions of students/teachers with "participants," "stakeholders," or "team members."

- **Action prompts:** (`lib/generation/prompts/templates/slide-actions/system.md`, `interactive-actions/system.md`)
  - Generalize the speech to "narration/voiceover" and actions to "highlight the current artifact" or "launch the demo." Keep the JSON schema but describe actions as "guide the listener through the element."
  - Reuse these prompts for other mediums (whiteboard, demo view) by suggesting the director tone itself ("You are delivering a walkthrough, not a class session.")

- **Snippets:** directory `lib/generation/prompts/snippets/…`
  - If snippets still reference "lessons," rename them (e.g., `lesson_outline` → `experience_flow`) and strip any "students" or "teacher" language.

## 2. Reframe the agents

Agents get their definitions from `lib/orchestration/registry/store.ts` and the `skills/openmaic` metadata. To make the director treat the conversation as open-world:

- Adjust persona text to describe the new roles ("Experience Guide," "Product Coach," "Customer Partner") and remove the classroom cues that the director uses to balance turns.
- Update `allowedActions` if you don't want every persona touching slides/whiteboards; you can keep them whiteboard-only or add new action aliases (e.g., `spotlight` → `highlight artifact`).
- If you persist agents in JSON/config files, include fields like `role`, `persona`, and `priority`. If you auto-generate agents from the director, seed it with prompts that ask for adaptable, multi-domain voices rather than fixed archetypes.
- Example persona snippet: "You are the Product Guide. Translate any input into a practical walkthrough, summarize decisions at each step, and keep the momentum moving toward the user's goal; ask clarifying questions only when critical details are missing."

## 3. Surface "open-world" to users

- Update copy (README, landing page, UI banners) so the interface invites people to ask about onboarding, product tours, training labs, etc. The loop remains the same—only the prompt goal changes.
- Provide a toggle or instructions that tell a visitor which prompt set or persona combination to load when they want a particular "flavor."
- If you want multiple flavors (classroom vs. enterprise), keep several prompt directories in `lib/generation/prompts/templates` and map them with a mode flag (the loader already accepts any template directory).

## 4. Test your open-world flow

1. Run `pnpm demo` to test all four scenarios via the Gemini API.
2. Run `pnpm dev` and open http://localhost:3000 to test in the browser.
3. Try generating a scenario such as "Show me a product launch walkthrough" or "Guide the first-week onboarding lab."
4. Look at the generated JSON to ensure there's no "classroom" language—just the experience you wanted.
5. If you create new prompt directories, plug them in via `PROMPT_IDS` or a config flag without changing the rendering layer.

## 5. Document your idea

- Link this guide in the README (see the "Open-world Mode" and "Cyxworld flavor" sections) so others can reuse it.
- Once you have a prompt/persona set you like, submit a PR with the templates, the hero copy, and optional sample `.json` output.
- See `USAGE.md` for detailed scenario breakdowns and expected outcomes.

Need help turning any of these steps into files? Just say which part to tackle next.
