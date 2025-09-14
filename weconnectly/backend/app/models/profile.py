# ============================================================================
# backend/app/models/profile.py - Profile Model
# ============================================================================

from sqlalchemy import Column, Integer, String, Text, JSON, Boolean, ForeignKey, ARRAY
from sqlalchemy.orm import relationship
from app.config.database import Base

class Profile(Base):
    __tablename__ = "profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    
    # Basic Info
    display_name = Column(String(100), nullable=False)
    bio = Column(Text)
    location = Column(String(100))
    avatar_url = Column(String(500))
    cover_url = Column(String(500))
    
    # Creator-specific
    niches = Column(ARRAY(String), default=[])  # ["fashion", "tech", "lifestyle"]
    languages = Column(ARRAY(String), default=[])  # ["en", "hi", "es"]
    
    # Social Platform Stats (JSONB for flexibility)
    platforms = Column(JSON, default={})
    # Example: {
    #   "instagram": {"handle": "@creator", "followers": 50000, "engagement_rate": 3.5},
    #   "youtube": {"handle": "creator", "subscribers": 10000, "avg_views": 5000},
    #   "tiktok": {"handle": "@creator", "followers": 25000, "engagement_rate": 8.2}
    # }
    
    # Pricing (for creators)
    rates = Column(JSON, default={})
    # Example: {
    #   "instagram_post": {"min": 500, "max": 2000, "currency": "USD"},
    #   "youtube_integration": {"min": 1000, "max": 5000, "currency": "USD"}
    # }
    
    # Portfolio
    portfolio_urls = Column(ARRAY(String), default=[])
    
    # Verification & Trust
    is_verified = Column(Boolean, default=False)
    verification_level = Column(String(20), default="none")  # none, basic, premium
    
    # Brand-specific
    company_name = Column(String(100))
    industry = Column(String(50))
    website_url = Column(String(500))
    
    # Relationships
    user = relationship("User", back_populates="profile")