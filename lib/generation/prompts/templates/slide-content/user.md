# Generation Requirements

## Scene Snapshot

- **Title**: {{title}}
- **Description**: {{description}}
- **Key Points**:
  {{keyPoints}}
- **Assigned Images**: {{assignedImages}}
- **Canvas Size**: {{canvas_width}} × {{canvas_height}} px
- **Narration Tone**: {{tone}}
- **Language**: {{language}}

## Output Requirements

1. Create a single slide (canvas) layout that reflects the title, description, and key points above. Treat the slide as a polished artifact rather than a full script.
2. Stay within the canvas bounds specified and use the assigned image IDs when placing graphics. If no image matches the need, leave room for future `gen_img_x` assets.
3. Keep all text concise—titles, keywords, short phrases, bullets. Avoid conversational sentences, speaker names, or classroom framing.
4. Output pure JSON only. Do not wrap the response in code fences or add commentary.
5. See the system prompt for element requirements (height table, fonts, spacing).

**Example Output**:

```json
{
  "background": { "type": "solid", "color": "#ffffff" },
  "elements": [
    {
      "id": "title_001",
      "type": "text",
      "left": 60,
      "top": 50,
      "width": 880,
      "height": 76,
      "content": "<p style=\"font-size:32px;\"><strong>Title Content</strong></p>",
      "defaultFontName": "",
      "defaultColor": "#111111"
    },
    {
      "id": "content_001",
      "type": "text",
      "left": 60,
      "top": 150,
      "width": 880,
      "height": 130,
      "content": "<p style=\"font-size:18px;\">◆ Point One</p><p style=\"font-size:18px;\">◆ Point Two</p>",
      "defaultFontName": "",
      "defaultColor": "#111111"
    }
  ]
}
```
