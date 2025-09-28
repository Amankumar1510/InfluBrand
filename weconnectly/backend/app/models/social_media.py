"""
Social media account and post models
"""

from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Float, ForeignKey, Enum as SQLEnum, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from enum import Enum

from app.core.database import Base


class SocialPlatform(str, Enum):
    """Supported social media platforms"""
    INSTAGRAM = "instagram"
    YOUTUBE = "youtube"
    TIKTOK = "tiktok"
    TWITTER = "twitter"
    FACEBOOK = "facebook"
    LINKEDIN = "linkedin"
    SNAPCHAT = "snapchat"
    PINTEREST = "pinterest"
    TWITCH = "twitch"


class PostType(str, Enum):
    """Types of social media posts"""
    POST = "post"
    STORY = "story"
    REEL = "reel"
    VIDEO = "video"
    LIVE = "live"
    IGTV = "igtv"
    CAROUSEL = "carousel"
    SHORTS = "shorts"  # YouTube Shorts
    TWEET = "tweet"
    THREAD = "thread"


class SocialMediaAccount(Base):
    """Social media accounts linked to influencers"""
    
    __tablename__ = "social_media_accounts"
    
    id = Column(Integer, primary_key=True, index=True)
    influencer_id = Column(Integer, ForeignKey("influencers.id"), nullable=False, index=True)
    
    # Account information
    platform = Column(SQLEnum(SocialPlatform), nullable=False)
    username = Column(String(255), nullable=False)
    display_name = Column(String(255), nullable=True)
    profile_url = Column(String(500), nullable=True)
    
    # Account metrics
    followers_count = Column(Integer, default=0)
    following_count = Column(Integer, default=0)
    posts_count = Column(Integer, default=0)
    
    # Verification status
    is_verified = Column(Boolean, default=False)
    is_business_account = Column(Boolean, default=False)
    
    # API integration
    access_token = Column(Text, nullable=True)  # Encrypted
    refresh_token = Column(Text, nullable=True)  # Encrypted
    token_expires_at = Column(DateTime(timezone=True), nullable=True)
    api_user_id = Column(String(255), nullable=True)  # Platform-specific user ID
    
    # Sync settings
    auto_sync_enabled = Column(Boolean, default=False)
    last_synced_at = Column(DateTime(timezone=True), nullable=True)
    sync_error = Column(Text, nullable=True)
    
    # Account status
    is_active = Column(Boolean, default=True)
    is_primary = Column(Boolean, default=False)  # Primary account for this platform
    
    # Timestamps
    connected_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    influencer = relationship("Influencer", back_populates="social_accounts")
    posts = relationship("SocialMediaPost", back_populates="account", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<SocialMediaAccount(id={self.id}, platform='{self.platform}', username='{self.username}')>"


class SocialMediaPost(Base):
    """Individual social media posts and their metrics"""
    
    __tablename__ = "social_media_posts"
    
    id = Column(Integer, primary_key=True, index=True)
    account_id = Column(Integer, ForeignKey("social_media_accounts.id"), nullable=False, index=True)
    
    # Post identification
    platform_post_id = Column(String(255), nullable=False)  # Platform-specific post ID
    post_type = Column(SQLEnum(PostType), nullable=False)
    post_url = Column(String(500), nullable=True)
    
    # Post content
    caption = Column(Text, nullable=True)
    hashtags = Column(JSON, nullable=True)  # List of hashtags
    mentions = Column(JSON, nullable=True)  # List of mentioned accounts
    media_urls = Column(JSON, nullable=True)  # URLs to images/videos
    
    # Post metrics
    likes_count = Column(Integer, default=0)
    comments_count = Column(Integer, default=0)
    shares_count = Column(Integer, default=0)
    views_count = Column(Integer, default=0)
    saves_count = Column(Integer, default=0)
    reach = Column(Integer, default=0)
    impressions = Column(Integer, default=0)
    
    # Engagement metrics
    engagement_rate = Column(Float, default=0.0)
    
    # Campaign association
    campaign_collaboration_id = Column(Integer, ForeignKey("campaign_collaborations.id"), nullable=True, index=True)
    is_sponsored = Column(Boolean, default=False)
    brand_mentions = Column(JSON, nullable=True)  # Brands mentioned in the post
    
    # Post timing
    published_at = Column(DateTime(timezone=True), nullable=False)
    last_updated_metrics_at = Column(DateTime(timezone=True), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    account = relationship("SocialMediaAccount", back_populates="posts")
    collaboration = relationship("CampaignCollaboration")
    
    @property
    def total_engagement(self) -> int:
        """Calculate total engagement (likes + comments + shares)"""
        return (self.likes_count or 0) + (self.comments_count or 0) + (self.shares_count or 0)
    
    @property
    def engagement_rate_calculated(self) -> float:
        """Calculate engagement rate based on followers"""
        if not self.account or not self.account.followers_count:
            return 0.0
        
        total_engagement = self.total_engagement
        if total_engagement == 0:
            return 0.0
        
        return (total_engagement / self.account.followers_count) * 100
    
    def __repr__(self):
        return f"<SocialMediaPost(id={self.id}, platform_post_id='{self.platform_post_id}', post_type='{self.post_type}')>"
