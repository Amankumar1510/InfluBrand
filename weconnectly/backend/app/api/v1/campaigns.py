# ============================================================================
# backend/app/api/v1/campaigns.py - Campaign API Routes
# ============================================================================

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional

from app.config.database import get_db
from app.schemas.campaign import CampaignCreate, CampaignUpdate, CampaignResponse, CampaignList
from app.models.campaign import CampaignStatus
from app.models.user import User
from app.services.campaign_service import CampaignService
from app.core.dependencies import get_current_active_user, get_brand_user

router = APIRouter(prefix="/campaigns", tags=["campaigns"])

@router.post("/", response_model=CampaignResponse, status_code=status.HTTP_201_CREATED)
async def create_campaign(
    campaign_data: CampaignCreate,
    current_user: User = Depends(get_brand_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new campaign (brands only)"""
    campaign_service = CampaignService(db)
    return await campaign_service.create_campaign(campaign_data, current_user.id)

@router.get("/", response_model=CampaignList)
async def get_campaigns(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    status: Optional[CampaignStatus] = None,
    search: Optional[str] = None,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Get campaigns list with filtering and pagination"""
    campaign_service = CampaignService(db)
    
    # Brands see only their campaigns, creators see published campaigns
    brand_id = current_user.id if current_user.role == "brand" else None
    if current_user.role == "creator" and not status:
        status = CampaignStatus.PUBLISHED
    
    return await campaign_service.get_campaigns(
        skip=skip,
        limit=limit,
        status=status,
        brand_id=brand_id,
        search=search
    )

@router.get("/{campaign_id}", response_model=CampaignResponse)
async def get_campaign(
    campaign_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Get campaign by ID"""
    campaign_service = CampaignService(db)
    campaign = await campaign_service.get_campaign(campaign_id)
    
    if not campaign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Campaign not found"
        )
    
    return campaign

@router.put("/{campaign_id}", response_model=CampaignResponse)
async def update_campaign(
    campaign_id: int,
    campaign_data: CampaignUpdate,
    current_user: User = Depends(get_brand_user),
    db: AsyncSession = Depends(get_db)
):
    """Update campaign (brand owner only)"""
    campaign_service = CampaignService(db)
    return await campaign_service.update_campaign(campaign_id, campaign_data, current_user.id)

@router.delete("/{campaign_id}")
async def delete_campaign(
    campaign_id: int,
    current_user: User = Depends(get_brand_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete campaign (brand owner only)"""
    campaign_service = CampaignService(db)
    await campaign_service.delete_campaign(campaign_id, current_user.id)
    return {"message": "Campaign deleted successfully"}

@router.post("/{campaign_id}/publish")
async def publish_campaign(
    campaign_id: int,
    current_user: User = Depends(get_brand_user),
    db: AsyncSession = Depends(get_db)
):
    """Publish a draft campaign"""
    campaign_service = CampaignService(db)
    update_data = CampaignUpdate(status=CampaignStatus.PUBLISHED)
    campaign = await campaign_service.update_campaign(campaign_id, update_data, current_user.id)
    return {"message": "Campaign published successfully", "campaign": campaign}