"""
Simple profile management endpoints
"""
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, status
from pydantic import BaseModel
import logging

from app.core.supabase import get_supabase_client

logger = logging.getLogger(__name__)
router = APIRouter()

# Enhanced request models
class SocialPlatform(BaseModel):
    platform: str
    handle: str
    followers: str
    verified: bool = False

class ProfileRates(BaseModel):
    post: Optional[int] = None
    story: Optional[int] = None
    reel: Optional[int] = None
    video: Optional[int] = None

class InfluencerProfileRequest(BaseModel):
    username: str
    display_name: str
    primary_platform: str
    platform_username: str
    categories: List[str]
    bio: str
    profile_picture_url: Optional[str] = None
    cover_image_url: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    website: Optional[str] = None
    location: Optional[str] = None
    birth_date: Optional[str] = None
    gender: Optional[str] = None
    languages: Optional[List[str]] = None
    content_types: Optional[List[str]] = None
    collaboration_types: Optional[List[str]] = None
    social_platforms: Optional[List[SocialPlatform]] = None
    rates: Optional[ProfileRates] = None
    availability: Optional[str] = None
    response_time: Optional[str] = None
    min_campaign_budget: Optional[int] = None

class BrandProfileRequest(BaseModel):
    username: str
    brand_name: str
    description: str
    industry_categories: List[str]
    website: Optional[str] = None
    logo_url: Optional[str] = None
    company_email: Optional[str] = None

# Simple dependency to get user from session
async def get_current_user_simple():
    # For now, we'll handle auth in frontend
    # This is a simplified version
    return {"id": "temp-user-id"}

@router.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):
    """Simple image upload placeholder"""
    try:
        # For now, return a placeholder URL
        # In production, this would upload to Supabase Storage
        return {
            "success": True,
            "url": f"https://placeholder-image-url/{file.filename}",
            "message": "Image uploaded successfully"
        }
    except Exception as e:
        logger.error(f"Image upload error: {e}")
        raise HTTPException(status_code=500, detail="Failed to upload image")

@router.post("/influencer")
async def create_influencer_profile(profile_data: InfluencerProfileRequest):
    """Create influencer profile"""
    try:
        # For now, use the frontend's direct approach
        # Backend API can be enhanced later with proper auth
        return {
            "success": True,
            "message": "Influencer profile created successfully",
            "redirect_url": "/brand-discovery"
        }
    except Exception as e:
        logger.error(f"Influencer profile creation error: {e}")
        raise HTTPException(status_code=500, detail="Failed to create influencer profile")

@router.post("/brand")
async def create_brand_profile(profile_data: BrandProfileRequest):
    """Create brand profile"""
    try:
        # For now, use the frontend's direct approach
        # Backend API can be enhanced later with proper auth
        return {
            "success": True,
            "message": "Brand profile created successfully",
            "redirect_url": "/influencer-discovery"
        }
    except Exception as e:
        logger.error(f"Brand profile creation error: {e}")
        raise HTTPException(status_code=500, detail="Failed to create brand profile")

@router.get("/influencer/{user_id}")
async def get_influencer_profile(user_id: str):
    """Get detailed influencer profile"""
    try:
        # This would fetch from database in production
        # For now, return mock data structure
        return {
            "success": True,
            "profile": {
                "id": user_id,
                "username": "@fashionista_emma",
                "name": "Emma Rodriguez",
                "bio": "Fashion enthusiast & lifestyle creator",
                "email": "emma@example.com",
                "phone": "+1 (555) 123-4567",
                "website": "www.emmarodriguez.com",
                "location": "Los Angeles, CA",
                "birth_date": "1995-06-15",
                "gender": "Female",
                "languages": ["English", "Spanish"],
                "content_types": ["Photos", "Videos", "Stories", "Reels"],
                "collaboration_types": ["Sponsored Posts", "Brand Partnerships"],
                "rates": {
                    "post": 500,
                    "story": 200,
                    "reel": 800,
                    "video": 1200
                },
                "availability": "Available",
                "response_time": "Within 24 hours",
                "min_campaign_budget": 1000
            }
        }
    except Exception as e:
        logger.error(f"Get influencer profile error: {e}")
        raise HTTPException(status_code=500, detail="Failed to get influencer profile")

@router.put("/influencer/{user_id}")
async def update_influencer_profile(user_id: str, profile_data: InfluencerProfileRequest):
    """Update detailed influencer profile"""
    try:
        # This would update database in production
        # For now, return success response
        return {
            "success": True,
            "message": "Profile updated successfully",
            "profile": profile_data.dict()
        }
    except Exception as e:
        logger.error(f"Update influencer profile error: {e}")
        raise HTTPException(status_code=500, detail="Failed to update influencer profile")

@router.get("/profile-completion/{user_id}")
async def get_profile_completion(user_id: str):
    """Calculate profile completion percentage"""
    try:
        # This would calculate based on actual profile data
        # For now, return mock completion percentage
        return {
            "success": True,
            "completion_percentage": 85,
            "missing_fields": ["phone", "website", "rates"],
            "suggestions": [
                "Add your phone number for better contact options",
                "Include your website to showcase your work",
                "Set your collaboration rates"
            ]
        }
    except Exception as e:
        logger.error(f"Profile completion calculation error: {e}")
        raise HTTPException(status_code=500, detail="Failed to calculate profile completion")
