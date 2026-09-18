"""
Thin wrapper around an LLM chat-completions API.

Uses OpenRouter's OpenAI-compatible chat completions API. The provider is isolated
here so the rest of the app only depends on the call_llm() function.
"""
import requests
from app.config import settings


class LLMError(Exception):
    pass


def call_llm(system_prompt: str, user_prompt: str, json_mode: bool = False) -> str:
    if not settings.OPENROUTER_API_KEY:
        raise LLMError(
            "OPENROUTER_API_KEY is not set. Copy backend/.env.example to backend/.env "
            "and add your key."
        )

    headers = {
        "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "MediaForge AI",
    }
    payload = {
        "model": settings.OPENROUTER_MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        "temperature": 0.7,
    }
    if json_mode:
        payload["response_format"] = {"type": "json_object"}

    try:
        resp = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers=headers,
            json=payload,
            timeout=60,
        )
    except requests.RequestException as e:
        raise LLMError(f"Could not reach LLM API: {e}")

    if resp.status_code != 200:
        raise LLMError(f"LLM API error {resp.status_code}: {resp.text[:300]}")

    data = resp.json()
    try:
        return data["choices"][0]["message"]["content"]
    except (KeyError, IndexError):
        raise LLMError("Unexpected LLM response shape")
