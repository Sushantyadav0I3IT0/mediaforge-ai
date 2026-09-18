import os

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

from app.schemas import GenerationRequest, GenerationResponse, GenerationResult
from app.services import prompts
from app.services.llm_service import LLMError, call_llm
from app.services.pptx_service import OUTPUT_DIR, build_pptx

router = APIRouter()

# Formats that are plain LLM text generation map straight to a prompt builder.
TEXT_FORMAT_HANDLERS = {
    "linkedin_post": prompts.linkedin_prompt,
    "twitter_thread": prompts.twitter_prompt,
    "executive_summary": prompts.executive_summary_prompt,
    "advisory": prompts.advisory_prompt,
    "infographic": prompts.infographic_prompt,
    "video": prompts.video_prompt,
}


@router.post("/generate", response_model=GenerationResponse)
def generate(req: GenerationRequest):
    results = []

    for fmt in req.formats:
        try:
            if fmt in TEXT_FORMAT_HANDLERS:
                system, user = TEXT_FORMAT_HANDLERS[fmt](req)
                text = call_llm(system, user)
                results.append(GenerationResult(format=fmt, content=text))

            elif fmt == "presentation":
                system, user = prompts.presentation_prompt(req)
                raw_json = call_llm(system, user, json_mode=True)
                filename = build_pptx(raw_json)
                results.append(
                    GenerationResult(format=fmt, file_url=f"/api/download/{filename}")
                )

            else:
                results.append(
                    GenerationResult(
                        format=fmt,
                        error="This format isn't implemented in the prototype yet.",
                    )
                )

        except LLMError as e:
            results.append(GenerationResult(format=fmt, error=str(e)))
        except Exception as e:  # keep the demo alive even if one format fails
            results.append(GenerationResult(format=fmt, error=f"Generation failed: {e}"))

    return GenerationResponse(results=results)


@router.get("/download/{filename}")
def download(filename: str):
    path = os.path.join(OUTPUT_DIR, filename)
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(
        path,
        filename=filename,
        media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation",
    )
