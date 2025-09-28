"""
Influencer-specific models
"""

from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Float, ForeignKey, Enum as SQLEnum, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from enum import Enum
from typing import Dict, Any

from app.core.database import Base


class ContentCategory(str, Enum):
    """Content categories for influencers"""
    FASHION_BEAUTY = "fashion_beauty"
    TECHNOLOGY = "technology"
    FITNESS_HEALTH = "fitness_health"
    FOOD_COOKING = "food_cooking"
    TRAVEL = "travel"
    GAMING = "gaming"
    ENTERTAINMENT = "entertainment"
    EDUCATION = "education"
    LIFESTYLE = "lifestyle"
    PARENTING = "parenting"
    BUSINESS = "business"
    ART_DESIGN = "art_design"
    MUSIC = "music"
    SPORTS = "sports"
    HOME_GARDEN = "home_garden"
    AUTOMOTIVE = "automotive"
    PETS = "pets"
    OTHER = "other"


class CollaborationRate(str, Enum):
    """Collaboration rate types"""
    PER_POST = "per_post"
    PER_STORY = "per_story"
    PER_REEL = "per_reel"
    PER_VIDEO = "per_video"
    MONTHLY = "monthly"
    PER_CAMPAIGN = "per_campaign"


class Influencer(Base):
    """Influencer-specific profile and information"""
    
    __tablename__ = "influencers"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True, index=True)
    
    # Professional information
    display_name = Column(String(100), nullable=True)
    tagline = Column(String(255), nullable=True)
    
    # Content information
    primary_category = Column(SQLEnum(ContentCategory), nullable=False)
    secondary_categories = Column(JSON, nullable=True)  # List of additional categories
    content_types = Column(JSON, nullable=True)  # Types of content they create
    languages = Column(JSON, nullable=True)  # Languages they create content in
    
    # Collaboration information
    collaboration_types = Column(JSON, nullable=True)  # Types of collaborations they accept
    min_rate = Column(Float, nullable=True)
    max_rate = Column(Float, nullable=True)
    rate_type = Column(SQLEnum(CollaborationRate), nullable=True)
    currency = Column(String(3), default="USD")
    
    # Experience and portfolio
    years_experience = Column(Integer, nullable=True)
    total_collaborations = Column(Integer, default=0)
    
    # Availability
    is_available = Column(Boolean, default=True)
    booking_lead_time_days = Column(Integer, default=7)
    
    # Verification and quality
    is_verified = Column(Boolean, default=False)
    quality_score = Column(Float, nullable=True)  # Internal quality rating
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="influencer")
    categories = relationship("InfluencerCategory", back_populates="influencer", cascade="all, delete-orphan")
    metrics = relationship("InfluencerMetrics", back_populates="influencer", cascade="all, delete-orphan")
    social_accounts = relationship("SocialMediaAccount", back_populates="influencer", cascade="all, delete-orphan")
    
    # Campaign relationships
    applications = relationship("CampaignApplication", back_populates="influencer")
    collaborations = relationship("CampaignCollaboration", back_populates="influencer")
    
    def __repr__(self):
        return f"<Influencer(id={self.id}, user_id={self.user_id}, category='{self.primary_category}')>"


class InfluencerCategory(Base):
    """Categories that an influencer creates content for"""
    
    __tablename__ = "influencer_categories"
    
    id = Column(Integer, primary_key=True, index=True)
    influencer_id = Column(Integer, ForeignKey("influencers.id"), nullable=False, index=True)
    category = Column(SQLEnum(ContentCategory), nullable=False)
    is_primary = Column(Boolean, default=False)
    expertise_level = Column(Integer, default=1)  # 1-5 scale
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    influencer = relationship("Influencer", back_populates="categories")
    
    def __repr__(self):
        return f"<InfluencerCategory(influencer_id={self.influencer_id}, category='{self.category}')>"


class InfluencerMetrics(Base):
    """Aggregated metrics for influencers across all platforms"""
    
    __tablename__ = "influencer_metrics"
    
    id = Column(Integer, primary_key=True, index=True)
    influencer_id = Column(Integer, ForeignKey("influencers.id"), nullable=False, index=True)
    
    # Follower metrics
    total_followers = Column(Integer, default=0)
    total_following = Column(Integer, default=0)
    follower_growth_rate = Column(Float, default=0.0)  # Monthly growth rate
    
    # Engagement metrics
    avg_likes = Column(Float, default=0.0)
    avg_comments = Column(Float, default=0.0)
    avg_shares = Column(Float, default=0.0)
    avg_views = Column(Float, default=0.0)
    engagement_rate = Column(Float, default=0.0)
    
    # Content metrics
    total_posts = Column(Integer, default=0)
    posts_per_week = Column(Float, default=0.0)
    
    # Audience metrics (stored as JSON for flexibility)
    audience_demographics = Column(JSON, nullable=True)
    audience_interests = Column(JSON, nullable=True)
    top_locations = Column(JSON, nullable=True)
    
    # Performance metrics
    avg_reach = Column(Float, default=0.0)
    avg_impressions = Column(Float, default=0.0)
    
    # Collaboration metrics
    brand_mention_rate = Column(Float, default=0.0)
    collaboration_success_rate = Column(Float, default=0.0)
    
    # Timestamps
    calculated_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    influencer = relationship("Influencer", back_populates="metrics")
    
    @property
    def engagement_quality_score(self) -> float:
        """Calculate engagement quality score based on various factors"""
        if self.total_followers == 0:
            return 0.0
        
        # Base engagement rate score
        engagement_score = min(self.engagement_rate / 5.0, 1.0)  # Normalize to 0-1
        
        # Adjust for follower count (micro-influencers often have better engagement)
        if self.total_followers < 10000:
            follower_bonus = 0.2
        elif self.total_followers < 100000:
            follower_bonus = 0.1
        else:
            follower_bonus = 0.0
        
        return min(engagement_score + follower_bonus, 1.0)
    
    def __repr__(self):
        return f"<InfluencerMetrics(influencer_id={self.influencer_id}, followers={self.total_followers}, engagement_rate={self.engagement_rate})>"
