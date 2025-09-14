# ============================================================================
# backend/app/main.py - FastAPI Application Entry Point
# ============================================================================

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from contextlib import asynccontextmanager
import uvicorn

from app.config.settings import get_settings
from app.config.database import engine, create_tables
from app.api.v1.router import api_router
from app.core.middleware import SecurityMiddleware

settings = get_settings()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await create_tables()
    print("🚀 WeConnectly API starting up...")
    yield
    # Shutdown
    print("🛑 WeConnectly API shutting down...")

app = FastAPI(
    title="WeConnectly API",
    description="A platform connecting influencers and brands for collaborations",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs" if settings.ENVIRONMENT == "development" else None,
    redoc_url="/redoc" if settings.ENVIRONMENT == "development" else None,
)

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_HOSTS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=settings.ALLOWED_HOSTS
)

app.add_middleware(SecurityMiddleware)

# Include API router
app.include_router(api_router, prefix="/api/v1")

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "weconnectly-api"}

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.ENVIRONMENT == "development"
    )