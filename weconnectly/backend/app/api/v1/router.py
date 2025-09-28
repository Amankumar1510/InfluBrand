"""
Main API router for v1 endpoints
"""

from fastapi import APIRouter

from app.api.v1.endpoints import (
    auth,
    # users,
    # influencers,
    # brands,
    # campaigns,
    # collaborations,
    # social_media,
    # analytics,
    # notifications,
    # messages,
    # search,
    # admin
)

api_router = APIRouter()

# Include authentication router only for now
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])

# Other routers commented out - focusing on authentication first
# api_router.include_router(users.router, prefix="/users", tags=["Users"])
# api_router.include_router(influencers.router, prefix="/influencers", tags=["Influencers"])
# api_router.include_router(brands.router, prefix="/brands", tags=["Brands"])
# api_router.include_router(campaigns.router, prefix="/campaigns", tags=["Campaigns"])
# api_router.include_router(collaborations.router, prefix="/collaborations", tags=["Collaborations"])
# api_router.include_router(social_media.router, prefix="/social", tags=["Social Media"])
# api_router.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])
# api_router.include_router(notifications.router, prefix="/notifications", tags=["Notifications"])
# api_router.include_router(messages.router, prefix="/messages", tags=["Messages"])
# api_router.include_router(search.router, prefix="/search", tags=["Search"])
# api_router.include_router(admin.router, prefix="/admin", tags=["Admin"])
