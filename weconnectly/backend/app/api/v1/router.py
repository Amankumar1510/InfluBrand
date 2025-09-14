# ============================================================================
# backend/app/api/v1/router.py - Main API Router
# ============================================================================

from fastapi import APIRouter
from app.api.v1 import auth, campaigns

api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(campaigns.router)