from typing import List, Literal, Optional
from pydantic import BaseModel, Field

OutputFormat = Literal[
    "linkedin_post",
    "twitter_thread",
    "executive_summary",
    "advisory",
    "presentation",
    "infographic",
    "video",
]


class GenerationRequest(BaseModel):
    content: str = Field(..., min_length=20, description="Source content to transform")
    formats: List[OutputFormat] = Field(..., min_length=1)
    audience: Optional[str] = "general public"
    tone: Optional[str] = "professional"
    language: Optional[str] = "English"
    detail_level: Optional[str] = "medium"  # brief | medium | detailed
    objective: Optional[str] = "inform"


class GenerationResult(BaseModel):
    format: str
    content: Optional[str] = None
    file_url: Optional[str] = None
    error: Optional[str] = None


class GenerationResponse(BaseModel):
    results: List[GenerationResult]
