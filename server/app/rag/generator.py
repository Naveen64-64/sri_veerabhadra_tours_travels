"""
RAG generator — sends context + query to Ollama LLM for answer generation.
"""
import httpx
import logging
from typing import Optional

from app.config import settings
from app.rag.prompts import SYSTEM_PROMPT, CONTEXT_TEMPLATE

logger = logging.getLogger(__name__)


async def generate_answer(context: str, question: str) -> str:
    """
    Generate an answer using Ollama LLM with the given context.
    Falls back to a helpful message if Ollama is unavailable.
    """
    prompt = CONTEXT_TEMPLATE.format(context=context, question=question)

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                f"{settings.ollama_base_url}/api/generate",
                json={
                    "model": settings.ollama_model,
                    "prompt": prompt,
                    "system": SYSTEM_PROMPT,
                    "stream": False,
                    "options": {
                        "temperature": 0.3,
                        "top_p": 0.9,
                        "num_predict": 500,
                    },
                },
            )
            response.raise_for_status()
            data = response.json()
            return data.get("response", "I couldn't generate an answer. Please try again.")

    except httpx.ConnectError:
        logger.error("Cannot connect to Ollama. Is it running?")
        return (
            "The AI assistant is currently unavailable (Ollama is not running). "
            "Please contact Sri Veerabhadra Tours and Travels directly at 9542659999 "
            "or email sriveerabhadratoursandtravels@gmail.com for assistance."
        )
    except httpx.HTTPStatusError as e:
        logger.error(f"Ollama HTTP error: {e}")
        if "model" in str(e).lower() or "not found" in str(e).lower():
            return (
                f"The AI model '{settings.ollama_model}' is not available. "
                "Please contact the administrator to set up the AI model."
            )
        return (
            "The AI assistant encountered an error. "
            "Please contact Sri Veerabhadra Tours and Travels at 9542659999."
        )
    except Exception as e:
        logger.error(f"LLM generation error: {e}")
        return (
            "I'm having trouble generating an answer right now. "
            "Please contact Sri Veerabhadra Tours and Travels at 9542659999 for help."
        )


async def check_ollama_status() -> dict:
    """Check if Ollama is running and the model is available."""
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            # Check Ollama is running
            response = await client.get(f"{settings.ollama_base_url}/api/tags")
            response.raise_for_status()
            data = response.json()

            models = [m["name"] for m in data.get("models", [])]
            model_available = any(
                settings.ollama_model in m for m in models
            )

            return {
                "ollama_running": True,
                "model": settings.ollama_model,
                "model_available": model_available,
                "available_models": models,
            }
    except Exception:
        return {
            "ollama_running": False,
            "model": settings.ollama_model,
            "model_available": False,
            "available_models": [],
        }
