"""
Global search endpoints
"""

from fastapi import APIRouter, Depends
from app.core.security import get_current_verified_user

router = APIRouter()

# TODO: Implement search endpoints
# - GET /global - Global search across users, campaigns, etc.
# - GET /influencers - Search influencers
# - GET /brands - Search brands
# - GET /campaigns - Search campaigns
# - GET /suggestions - Get search suggestions
