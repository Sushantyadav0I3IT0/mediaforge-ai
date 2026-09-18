"""
Prompt templates: one builder per output format.
Each returns (system_prompt, user_prompt).

This is the file to edit when you add a new output format (e.g. infographic,
video script) or tune existing ones for the demo.
"""

BASE_CONTEXT = (
    "You are MediaForge AI, a content-transformation engine used by organizations "
    "to turn source material into ready-to-publish communication formats. Always "
    "ground your output strictly in the SOURCE CONTENT provided below — never invent "
    "facts, figures, names, or claims that are not present in or directly inferable "
    "from the source."
)


def _config_block(req) -> str:
    return (
        f"Audience: {req.audience}\n"
        f"Tone: {req.tone}\n"
        f"Language: {req.language}\n"
        f"Detail level: {req.detail_level}\n"
        f"Communication objective: {req.objective}"
    )


def linkedin_prompt(req):
    system = BASE_CONTEXT
    user = f"""SOURCE CONTENT:
\"\"\"{req.content}\"\"\"

CONFIGURATION:
{_config_block(req)}

TASK: Write one professional LinkedIn post based on the source content above.
Rules:
- 120-220 words
- Start with a strong hook line
- Short paragraphs, line breaks for readability
- End with a call-to-action or reflective question
- Add 3-5 relevant hashtags on a final line
- No markdown headers
Return only the post text, nothing else."""
    return system, user


def twitter_prompt(req):
    system = BASE_CONTEXT
    user = f"""SOURCE CONTENT:
\"\"\"{req.content}\"\"\"

CONFIGURATION:
{_config_block(req)}

TASK: Write a Twitter/X thread (4-7 tweets) based on the source content.
Rules:
- Each tweet under 280 characters
- Number each tweet "1/", "2/", etc.
- First tweet is a hook, last tweet is a summary or call-to-action
Return only the numbered tweets, one per line, nothing else."""
    return system, user


def executive_summary_prompt(req):
    system = BASE_CONTEXT
    user = f"""SOURCE CONTENT:
\"\"\"{req.content}\"\"\"

CONFIGURATION:
{_config_block(req)}

TASK: Write a concise executive summary/briefing based on the source content.
Rules:
- 150-300 words depending on detail level
- Structure: Context, Key Points (bulleted), Implication/Recommendation
- Plain professional language, no fluff
Return only the summary text (markdown bullets allowed), nothing else."""
    return system, user


def advisory_prompt(req):
    system = BASE_CONTEXT
    user = f"""SOURCE CONTENT:
\"\"\"{req.content}\"\"\"

CONFIGURATION:
{_config_block(req)}

TASK: Write a structured advisory document based on the source content.
Rules:
- Sections: Title, Summary, Background, Key Points, Recommended Actions, Target Audience
- Use markdown headers (##) for each section
Return only the advisory document in markdown, nothing else."""
    return system, user


def infographic_prompt(req):
    system = BASE_CONTEXT
    user = f"""SOURCE CONTENT:
\"\"\"{req.content}\"\"\"

CONFIGURATION:
{_config_block(req)}

TASK: Create an infographic content package based on the source content.
Include: a short title, one-sentence key message, 3-6 sections with a heading and
supporting copy, important facts or figures from the source, and a visual/layout
recommendation. Keep every claim grounded in the source.
Return only the infographic content package in markdown, nothing else."""
    return system, user


def video_prompt(req):
    system = BASE_CONTEXT
    user = f"""SOURCE CONTENT:
\"\"\"{req.content}\"\"\"

CONFIGURATION:
{_config_block(req)}

TASK: Create a complete short-form video package based on the source content.
Include: a title, target duration, scene-by-scene storyboard with visual description,
narration and on-screen text, a complete narration script, subtitle text, and visual
recommendations. Do not invent facts beyond the source.
Return only the video package in markdown, nothing else."""
    return system, user


def presentation_prompt(req):
    system = BASE_CONTEXT + " You output structured JSON only, with no prose outside the JSON object."
    user = f"""SOURCE CONTENT:
\"\"\"{req.content}\"\"\"

CONFIGURATION:
{_config_block(req)}

TASK: Create a slide-by-slide presentation outline (5-8 content slides) based on the
source content.
Return a JSON object with EXACTLY this shape:
{{
  "title": "Presentation title",
  "slides": [
    {{"heading": "Slide heading", "bullets": ["point 1", "point 2", "point 3"], "speaker_notes": "1-2 sentence speaker note"}}
  ]
}}
Return only valid JSON, nothing else."""
    return system, user
