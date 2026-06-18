import json
import re
import httpx
from fastapi import APIRouter, Depends, HTTPException
from dependencies import get_current_user
import schemas

router = APIRouter(prefix="/quiz", tags=["Quiz"])

# Key now lives ONLY here on the backend — never shipped in the app bundle.
#*******************************************************************************************
OPENROUTER_API_KEY = ""
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
MODEL_FALLBACK_CHAIN = [
    "qwen/qwen3-coder:free",
    "deepseek/deepseek-r1:free",
    "meta-llama/llama-3.3-70b-instruct:free",
    "mistralai/mistral-7b-instruct:free",
]


def build_prompt(topic: str, difficulty: str, num_questions: int) -> str:
    return f"""Generate {num_questions} multiple-choice questions about "{topic}" at a {difficulty} difficulty level, suitable for a Computer Science university student.

Respond with ONLY valid JSON, no markdown formatting, no code fences, no explanation — exactly this shape:

{{
  "questions": [
    {{ "question": "string", "options": ["string", "string", "string", "string"], "answer": 0 }}
  ]
}}

"answer" is the zero-based index (0-3) of the correct option. Generate exactly {num_questions} questions."""


def parse_ai_response(raw_text: str, num_questions: int):
    cleaned = re.sub(r"```json|```", "", raw_text).strip()
    parsed = json.loads(cleaned)
    questions = parsed.get("questions", [])
    if not questions:
        raise ValueError("AI response missing a valid questions array.")

    return [
        {"id": f"q_{i}", "question": q["question"], "options": q["options"], "answer": q["answer"]}
        for i, q in enumerate(questions[:num_questions])
    ]


async def call_model(model: str, prompt: str) -> str:
    async with httpx.AsyncClient(timeout=20.0) as client:
        response = await client.post(
            OPENROUTER_URL,
            headers={"Authorization": f"Bearer {OPENROUTER_API_KEY}", "Content-Type": "application/json"},
            json={"model": model, "messages": [{"role": "user", "content": prompt}]},
        )
        if response.status_code != 200:
            raise ValueError(f"OpenRouter {model} returned status {response.status_code}")

        data = response.json()
        content = data.get("choices", [{}])[0].get("message", {}).get("content")
        if not content:
            raise ValueError(f"OpenRouter {model} returned no content")
        return content


async def call_openrouter_with_fallback(prompt: str) -> str:
    last_error = None
    for model in MODEL_FALLBACK_CHAIN:
        try:
            return await call_model(model, prompt)
        except Exception as e:
            last_error = e
            print(f"Model failed, trying next → {model}: {e}")
    raise last_error or ValueError("All AI models failed.")


@router.post("/generate", response_model=schemas.QuizGenerateResponse)
async def generate_quiz(payload: schemas.QuizGenerateRequest, current_user=Depends(get_current_user)):
    prompt = build_prompt(payload.topic, payload.difficulty, payload.numQuestions)
    try:
        raw_content = await call_openrouter_with_fallback(prompt)
        questions = parse_ai_response(raw_content, payload.numQuestions)
        return {"questions": questions, "source": "ai"}
    except Exception as e:
        print(f"AI quiz generation failed entirely: {e}")
        raise HTTPException(status_code=503, detail="AI quiz generation is temporarily unavailable.")