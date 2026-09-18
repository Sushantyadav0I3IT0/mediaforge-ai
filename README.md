# MediaForge AI — Prototype
**Team StellerForged · SIH26154 · "Gen AI Platform for Automated Content Transformation"**

One source of content in → multiple communication-ready formats out. This is a working
prototype scoped for a hackathon demo: it implements all **7 requested output formats**
as usable text or downloadable deliverables.

## What it does
Paste source content (article, report, advisory, prompt) into the dashboard, choose one
or more output formats and configure audience/tone/language/detail, and it generates:

| Format | Output |
|---|---|
| LinkedIn Post | Publish-ready post text with hashtags |
| X / Twitter Thread | Numbered 4–7 tweet thread |
| Executive Summary | Structured briefing (context, key points, recommendation) |
| Advisory | Structured markdown advisory document |
| Presentation | **Real downloadable `.pptx`** file with slide content + speaker notes |
| Infographic | Content package with key messages and layout recommendations |
| Video Package | Script, storyboard, narration, subtitles, and visual recommendations |

Video and infographic outputs are delivered as complete content packages. Rendering an
actual video or image asset remains a future media-pipeline extension.

## Architecture
```
frontend (Next.js/TS/Tailwind)  →  backend (FastAPI)  →  LLM API (OpenAI-compatible)
        dashboard UI                 /api/generate         text generation
                                      /api/download/*    →  generated/*.pptx (python-pptx)
```
No database, queue, or object storage in this prototype — every generation is stateless
and synchronous, which is the right trade-off for proving the concept. `ARCHITECTURE.md`
covers the target production architecture (matches your Technical Approach slide) and
what's simplified here.

## Setup

### 1. Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # then paste your OPENROUTER_API_KEY into .env
uvicorn main:app --reload --port 8000
```
Backend runs at `http://localhost:8000`. Visit `http://localhost:8000/docs` for the
interactive Swagger UI — useful for testing `/api/generate` without the frontend.

### 2. Frontend
```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```
Frontend runs at `http://localhost:3000`.

### 3. Try it
Open `http://localhost:3000`, paste a paragraph or two of source content (a news
article, an advisory, a report excerpt), pick a couple of formats, hit **Generate**.

## Getting an API key
This prototype calls OpenRouter's OpenAI-compatible chat completions API by default
using `openai/gpt-4o-mini`. Create an API key at openrouter.ai and set it as
`OPENROUTER_API_KEY` in `backend/.env`. The provider integration is isolated in
`backend/app/services/llm_service.py`.

## Extending the media outputs
- **Video**: pass the existing video package into an FFmpeg or hosted rendering
  pipeline to produce an actual clip.
- **Infographic**: render the existing layout brief as an HTML/SVG template or image.
- **All formats**: prompt builders are in `backend/app/services/prompts.py` and the
  routing map is in `backend/app/routers/generate.py`.
  `backend/app/services/prompts.py` and `backend/app/routers/generate.py`.

## Deliverables checklist (from the PS)
- [x] Source code (this repo)
- [x] README with setup instructions (this file)
- [x] Architecture document (`ARCHITECTURE.md`, 2 pages)
- [ ] Demo video (record after you have a working local demo)
- [ ] Technical presentation (5 slides — can extend your existing SIH154.pdf deck)
