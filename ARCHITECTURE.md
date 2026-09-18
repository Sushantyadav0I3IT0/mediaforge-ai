# MediaForge AI — Architecture Document
**Team StellerForged · SIH26154**

## 1. Problem framing
Organizations need to turn a single piece of source content (report, advisory, article,
prompt) into multiple output-ready communication formats without manually re-authoring
each one. MediaForge AI takes one source input plus operator-selected output types and
configuration (audience, tone, language, detail, objective), and generates each
requested deliverable from the same grounded source.

## 2. Prototype architecture (what's built now)

```
┌─────────────────────┐        ┌──────────────────────────┐        ┌─────────────────┐
│   Frontend           │  HTTP  │   Backend                 │  HTTP  │   LLM API        │
│   Next.js / TS /      │ ─────▶│   FastAPI                 │ ─────▶│   (OpenRouter     │
│   Tailwind             │◀──── │   /api/generate            │◀──── │   compatible)      │
│   - content input       │  JSON │   /api/download/{file}     │  text  └─────────────────┘
│   - format selection    │        │                            │
│   - config controls     │        │   Prompt templates          │        ┌─────────────────┐
│   - results display     │        │   (one per format)          │─────▶ │  python-pptx      │
└─────────────────────┘        │                            │        │  (local file gen) │
                                └──────────────────────────┘        └─────────────────┘
```

**Flow:** operator pastes content + selects formats → frontend POSTs to
`/api/generate` → backend builds one prompt per selected format → calls the LLM →
text formats return generated text directly; the presentation format additionally
converts the LLM's structured JSON into a real `.pptx` via `python-pptx` and returns a
download link.

**Why this shape:** every request is stateless and synchronous — no queue, no database,
no object storage. That's the right trade-off for a hackathon prototype: it proves the
core transformation engine works end-to-end and is honest about what's simplified,
rather than half-wiring infrastructure that adds failure points without adding proof.

## 3. Target production architecture (from the original proposal)
The full submission architecture — matching the Technical Approach slide — adds:
- **Async processing**: Redis + Celery background workers, so large/slow generations
  (video rendering, batch multi-format jobs) don't block the request.
- **Persistence**: PostgreSQL for users, projects, generation history; pgvector for
  semantic search/RAG over past content.
- **Storage**: AWS S3 / Cloudinary for uploaded source files and generated media assets.
- **Auth**: JWT/OAuth with role-based access for multi-user/organization use.
- **Media pipeline**: FFmpeg for video assembly, Whisper for transcription of uploaded
  audio/video, OCR for scanned/image inputs.
- **Deployment**: Dockerized services on AWS/Render, with Sentry + analytics for
  monitoring.

The prototype's `llm_service.py` and `routers/generate.py` are deliberately isolated
modules so this infrastructure can be layered in — e.g. wrapping `call_llm()` in a
Celery task, or writing generation history to Postgres after each `/api/generate` call
— without rewriting the generation logic itself.

## 4. Key design decisions
- **One prompt template per format** (`prompts.py`), not one mega-prompt: keeps outputs
  reliable and makes it trivial to add a new format without touching existing ones.
- **Source-grounding instruction in every prompt**: every prompt explicitly forbids
  inventing facts not present in the source, directly addressing the "AI hallucination"
  risk called out in the Feasibility & Viability slide.
- **JSON mode for structured outputs** (presentation slides): text formats return free
  text; anything that needs to become a real file (pptx) is requested as strict JSON
  first, then deterministically rendered — the LLM never touches file generation
  directly, which avoids malformed-file failures during a live demo.
- **Provider-agnostic LLM call**: `call_llm()` is the single integration point, so
  switching between OpenRouter, Gemini, or Claude only touches one file.

## 5. Known limitations (be upfront about these in the demo)
- No persistence — refreshing the page loses generated results.
- No auth — single-operator use only.
- Video and Infographic currently return complete content packages; actual media
  rendering is left for a future FFmpeg/image pipeline.
- Presentation generation depends on the LLM returning well-formed JSON; the backend
  catches and reports malformed output per-format rather than failing the whole request.
