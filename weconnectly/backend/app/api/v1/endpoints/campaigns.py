"""
Campaign management endpoints
"""

from fastapi import APIRouter, Depends
from app.core.security import require_brand, require_influencer, get_current_verified_user

router = APIRouter()

# TODO: Implement campaign endpoints
# Brand endpoints:
# - POST / - Create new campaign
# - GET / - Get brand's campaigns
# - GET /{campaign_id} - Get campaign details
# - PUT /{campaign_id} - Update campaign
# - DELETE /{campaign_id} - Delete campaign
# - GET /{campaign_id}/applications - Get campaign applications
# - POST /{campaign_id}/applications/{application_id}/approve - Approve application
# - POST /{campaign_id}/applications/{application_id}/reject - Reject application

# Influencer endpoints:
# - GET /discover - Discover available campaigns
# - POST /{campaign_id}/apply - Apply to campaign
# - GET /applications - Get my applications
