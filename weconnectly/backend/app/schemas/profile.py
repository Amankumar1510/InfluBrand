# ============================================================================
# backend/app/schemas/profile.py - Profile Schemas
# ============================================================================

from pydantic import BaseModel, HttpUrl, validator
from typing import Optional, List, Dict, Any
from decimal import Decimal

class ProfileBase(BaseModel):
    display_name: str
    bio: Optional[str] = None
    location: Optional[str] = None

class ProfileCreate(ProfileBase):
    niches: Optional[List[str]] = []
    languages: Optional[List[str]] = []
    platforms: Optional[Dict[str, Any]] = {}
    rates: Optional[Dict[str, Any]] = {}
    portfolio_urls: Optional[List[str]] = []
    company_name: Optional[str] = None
    industry: Optional[str] = None
    website_url: Optional[str] = None

class ProfileUpdate(BaseModel):
    display_name: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    niches: Optional[List[str]] = None
    languages: Optional[List[str]] = None
    platforms: Optional[Dict[str, Any]] = None
    rates: Optional[Dict[str, Any]] = None
    portfolio_urls: Optional[List[str]] = None
    avatar_url: Optional[str] = None
    cover_url: Optional[str] = None
    company_name: Optional[str] = None
    industry: Optional[str] = None
    website_url: Optional[str] = None

class ProfileResponse(ProfileBase):
    id: int
    user_id: int
    niches: List[str]
    languages: List[str]
    platforms: Dict[str, Any]
    rates: Dict[str, Any]
    portfolio_urls: List[str]
    avatar_url: Optional[str] = None
    cover_url: Optional[str] = None
    is_verified: bool
    verification_level: str
    company_name: Optional[str] = None
    industry: Optional[str] = None
    website_url: Optional[str] = None
    
    class Config:
        from_attributes = True