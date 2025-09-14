# ============================================================================
# backend/app/schemas/campaign.py - Campaign Schemas
# ============================================================================

from pydantic import BaseModel, validator
from typing import Optional, List, Dict, Any
from datetime import datetime
from decimal import Decimal
from app.models.campaign import CampaignStatus

class CampaignBase(BaseModel):
    title: str
    description: str
    brief: Optional[str] = None

class CampaignCreate(CampaignBase):
    budget_min: Optional[Decimal] = None
    budget_max: Optional[Decimal] = None
    currency: str = "USD"
    target_audience: Optional[Dict[str, Any]] = {}
    required_platforms: Optional[List[str]] = []
    deliverables: Optional[Dict[str, Any]] = {}
    application_deadline: Optional[datetime] = None
    campaign_start_date: Optional[datetime] = None
    campaign_end_date: Optional[datetime] = None
    tags: Optional[List[str]] = []

class CampaignUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    brief: Optional[str] = None
    budget_min: Optional[Decimal] = None
    budget_max: Optional[Decimal] = None
    target_audience: Optional[Dict[str, Any]] = None
    required_platforms: Optional[List[str]] = None
    deliverables: Optional[Dict[str, Any]] = None
    application_deadline: Optional[datetime] = None
    campaign_start_date: Optional[datetime] = None
    campaign_end_date: Optional[datetime] = None
    status: Optional[CampaignStatus] = None
    tags: Optional[List[str]] = None

class CampaignResponse(CampaignBase):
    id: int
    brand_id: int
    budget_min: Optional[Decimal] = None
    budget_max: Optional[Decimal] = None
    currency: str
    target_audience: Dict[str, Any]
    required_platforms: List[str]
    deliverables: Dict[str, Any]
    application_deadline: Optional[datetime] = None
    campaign_start_date: Optional[datetime] = None
    campaign_end_date: Optional[datetime] = None
    status: CampaignStatus
    tags: List[str]
    is_featured: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    # Related data
    brand_name: Optional[str] = None
    application_count: Optional[int] = 0
    
    class Config:
        from_attributes = True

class CampaignList(BaseModel):
    campaigns: List[CampaignResponse]
    total: int
    page: int
    size: int
    has_next: bool