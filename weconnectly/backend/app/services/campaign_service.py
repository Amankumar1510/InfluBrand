# ============================================================================
# backend/app/services/campaign_service.py - Campaign Service
# ============================================================================

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_, func
from sqlalchemy.orm import selectinload
from fastapi import HTTPException, status
from typing import List, Optional, Dict, Any

from app.models.campaign import Campaign, CampaignStatus
from app.models.user import User
from app.models.profile import Profile
from app.schemas.campaign import CampaignCreate, CampaignUpdate, CampaignResponse, CampaignList

class CampaignService:
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def create_campaign(self, campaign_data: CampaignCreate, brand_id: int) -> CampaignResponse:
        campaign = Campaign(
            brand_id=brand_id,
            **campaign_data.model_dump()
        )
        
        self.db.add(campaign)
        await self.db.commit()
        await self.db.refresh(campaign)
        
        return await self.get_campaign_response(campaign)
    
    async def get_campaign(self, campaign_id: int) -> Optional[CampaignResponse]:
        result = await self.db.execute(
            select(Campaign)
            .options(selectinload(Campaign.brand))
            .where(Campaign.id == campaign_id)
        )
        campaign = result.scalar_one_or_none()
        
        if not campaign:
            return None
        
        return await self.get_campaign_response(campaign)
    
    async def get_campaigns(
        self, 
        skip: int = 0, 
        limit: int = 20,
        status: Optional[CampaignStatus] = None,
        brand_id: Optional[int] = None,
        search: Optional[str] = None
    ) -> CampaignList:
        query = select(Campaign).options(selectinload(Campaign.brand))
        
        # Apply filters
        if status:
            query = query.where(Campaign.status == status)
        if brand_id:
            query = query.where(Campaign.brand_id == brand_id)
        if search:
            query = query.where(
                or_(
                    Campaign.title.ilike(f"%{search}%"),
                    Campaign.description.ilike(f"%{search}%")
                )
            )
        
        # Get total count
        count_query = select(func.count(Campaign.id))
        if status:
            count_query = count_query.where(Campaign.status == status)
        if brand_id:
            count_query = count_query.where(Campaign.brand_id == brand_id)
        if search:
            count_query = count_query.where(
                or_(
                    Campaign.title.ilike(f"%{search}%"),
                    Campaign.description.ilike(f"%{search}%")
                )
            )
        
        total_result = await self.db.execute(count_query)
        total = total_result.scalar()
        
        # Get paginated results
        campaigns_result = await self.db.execute(
            query.offset(skip).limit(limit).order_by(Campaign.created_at.desc())
        )
        campaigns = campaigns_result.scalars().all()
        
        campaign_responses = []
        for campaign in campaigns:
            campaign_response = await self.get_campaign_response(campaign)
            campaign_responses.append(campaign_response)
        
        return CampaignList(
            campaigns=campaign_responses,
            total=total,
            page=(skip // limit) + 1,
            size=limit,
            has_next=(skip + limit) < total
        )
    
    async def update_campaign(
        self, 
        campaign_id: int, 
        campaign_data: CampaignUpdate, 
        brand_id: int
    ) -> CampaignResponse:
        result = await self.db.execute(
            select(Campaign).where(
                and_(Campaign.id == campaign_id, Campaign.brand_id == brand_id)
            )
        )
        campaign = result.scalar_one_or_none()
        
        if not campaign:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Campaign not found"
            )
        
        # Update fields
        update_data = campaign_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(campaign, field, value)
        
        await self.db.commit()
        await self.db.refresh(campaign)
        
        return await self.get_campaign_response(campaign)
    
    async def delete_campaign(self, campaign_id: int, brand_id: int) -> bool:
        result = await self.db.execute(
            select(Campaign).where(
                and_(Campaign.id == campaign_id, Campaign.brand_id == brand_id)
            )
        )
        campaign = result.scalar_one_or_none()
        
        if not campaign:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Campaign not found"
            )
        
        await self.db.delete(campaign)
        await self.db.commit()
        return True
    
    async def get_campaign_response(self, campaign: Campaign) -> CampaignResponse:
        # Get brand name if available
        brand_name = None
        if hasattr(campaign, 'brand') and campaign.brand:
            # Get brand profile for display name
            brand_profile_result = await self.db.execute(
                select(Profile).where(Profile.user_id == campaign.brand.id)
            )
            brand_profile = brand_profile_result.scalar_one_or_none()
            brand_name = brand_profile.display_name if brand_profile else campaign.brand.email
        
        # Get application count
        app_count_result = await self.db.execute(
            select(func.count()).select_from(
                select(1).where(
                    and_(
                        Application.campaign_id == campaign.id,
                        Application.status != "withdrawn"
                    )
                ).subquery()
            )
        )
        application_count = app_count_result.scalar() or 0
        
        campaign_dict = {
            **{c.name: getattr(campaign, c.name) for c in campaign.__table__.columns},
            "brand_name": brand_name,
            "application_count": application_count
        }
        
        return CampaignResponse(**campaign_dict)