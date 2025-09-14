# ============================================================================
# backend/app/schemas/application.py - Application Schemas
# ============================================================================

from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from decimal import Decimal
from app.models.application import ApplicationStatus

class ApplicationBase(BaseModel):
    message: Optional[str] = None
    ask_amount: Decimal
    currency: str = "USD"

class ApplicationCreate(ApplicationBase):
    campaign_id: int
    proposed_start_date: Optional[datetime] = None
    proposed_end_date: Optional[datetime] = None

class ApplicationUpdate(BaseModel):
    message: Optional[str] = None
    ask_amount: Optional[Decimal] = None
    proposed_start_date: Optional[datetime] = None
    proposed_end_date: Optional[datetime] = None
    status: Optional[ApplicationStatus] = None

class ApplicationResponse(ApplicationBase):
    id: int
    campaign_id: int
    creator_id: int
    proposed_start_date: Optional[datetime] = None
    proposed_end_date: Optional[datetime] = None
    status: ApplicationStatus
    applied_at: datetime
    reviewed_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    # Related data
    creator_name: Optional[str] = None
    campaign_title: Optional[str] = None
    
    class Config:
        from_attributes = True