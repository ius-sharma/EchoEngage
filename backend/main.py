"""
EchoEngage - Creator Relationship Memory Agent
FastAPI Backend Entry Point
"""

import os
import logging
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    datefmt="%H:%M:%S"
)
logger = logging.getLogger("echoeng")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    logger.info("🚀 EchoEngage backend starting...")
    logger.info(f"   Memory: {os.getenv('HINDSIGHT_API_URL', 'local fallback')}")
    logger.info(f"   Groq API: {'configured' if os.getenv('GROQ_API_KEY') else 'NOT SET'}")

    # Import here to ensure env vars are loaded
    from services.memory_service import memory_service
    from services.routing_service import routing_service

    logger.info(f"   Memory provider: {memory_service.get_memory_stats()['provider']}")
    logger.info(f"   CascadeFlow: {'enabled' if routing_service.cascadeflow_enabled else 'manual routing'}")
    logger.info("✅ EchoEngage ready!")

    yield

    logger.info("👋 EchoEngage shutting down...")


# Create FastAPI app
app = FastAPI(
    title="EchoEngage API",
    description="Creator Relationship Memory Agent - Backend API",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for hackathon demo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import and include routes
from api.routes import router
app.include_router(router)


@app.get("/")
async def root():
    return {
        "name": "EchoEngage API",
        "version": "1.0.0",
        "description": "Creator Relationship Memory Agent",
        "docs": "/docs"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
