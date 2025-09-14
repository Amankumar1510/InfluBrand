# ============================================================================
# backend/app/models/campaign.py - Campaign Model
# ============================================================================

from sqlalchemy import Column, Integer, String, Text, JSON, DateTime, ForeignKey, Numeric, ARRAY
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.config.database import Base
import enum

class CampaignStatus(str, enum.Enum):
    DRAFT = "draft"
    PUBLISHED = "published"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class Campaign(Base):
    __tablename__ = "campaigns"
    
    id = Column(Integer, primary_key=True, index=True)
    brand_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Campaign Details
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    brief = Column(Text)  # Detailed campaign brief
    
    # Budget
    budget_min = Column(Numeric(10, 2))
    budget_max = Column(Numeric(10, 2))
    currency = Column(String(3), default="USD")
    
    # Target & Requirements
    target_audience = Column(JSON, default={})
    # Example: {
    #   "age_range": {"min": 18, "max": 35},
    #   "gender": ["female", "male"],
    #   "location": ["US", "CA", "UK"],
    #   "interests": ["fashion", "beauty", "lifestyle"]
    # }
    
    required_platforms = Column(ARRAY(String), default=[])  # ["instagram", "youtube"]
    
    # Deliverables
    deliverables = Column(JSON, default={})
    # Example: {
    #   "instagram_posts": {"count": 3, "requirements": ["product showcase", "hashtags"]},
    #   "stories": {"count": 5, "requirements": ["brand mention", "swipe up"]},
    #   "youtube_video": {"duration_min": 60, "requirements": ["product review"]}
    # }
    
    # Timeline
    application_deadline = Column(DateTime(timezone=True))
    campaign_start_date = Column(DateTime(timezone=True))
    campaign_end_date = Column(DateTime(timezone=True))
    
    # Status & Metadata
    status = Column(String(20), default=CampaignStatus.DRAFT)
    tags = Column(ARRAY(String), default=[])
    is_featured = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    brand = relationship("User", back_populates="campaigns")
    applications = relationship("Application", back_populates="campaign")