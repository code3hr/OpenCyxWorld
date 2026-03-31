# Generation Requirements

## Experience Input

- **Title**: {{title}}
- **Description**: {{description}}
- **User Goal / Intent**: {{requirement}}
- **Tone / Style**: {{style}}
- **Language**: {{language}}
- **Audience Profile**: {{userProfile}}

## Available Resources

- **PDF Summary**: {{pdfContent}}
- **Assigned Media IDs**: {{availableImages}}
- **Research & Search Context**: {{researchContext}}
- **Optional Notes**: {{extraNotes}}

## Output Expectations

1. Infer the experience structure from the inputs above: topic, persona, pacing, and desired deliverables.
2. Compose a JSON array of scene outlines. Each outline object must contain `id`, `type`, `title`, `description`, `keyPoints`, and `order`. Add other fields (interactiveConfig, quizConfig, mediaGenerations, etc.) only when required by the scene type.
3. Keep the language consistent with the requested `language` (zh-CN → Chinese, en-US → English).
4. Avoid any mentions of classrooms, lectures, or teachers—frame the experience as a product briefing, onboarding journey, or mission statement.
5. Output valid JSON only. Do not wrap it in code fences or add narrative explanation. Example:

```json
[{"id":"scene_1","type":"slide","title":"Vision","description":"Set the context","keyPoints":["Point A","Point B"]}]
```
