"""
Campaign and collaboration models
"""

from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Float, ForeignKey, Enum as SQLEnum, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from enum import Enum
from typing import Dict, Any

from app.core.database import Base


class CampaignStatus(str, Enum):
    """Campaign status types"""
    DRAFT = "draft"
    ACTIVE = "active"
    PAUSED = "paused"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class CampaignType(str, Enum):
    """Types of campaigns"""
    PRODUCT_LAUNCH = "product_launch"
    BRAND_AWARENESS = "brand_awareness"
    SALES_PROMOTION = "sales_promotion"
    EVENT_PROMOTION = "event_promotion"
    CONTENT_CREATION = "content_creation"
    LONG_TERM_PARTNERSHIP = "long_term_partnership"
    GIVEAWAY = "giveaway"
    REVIEW = "review"
    UNBOXING = "unboxing"
    TUTORIAL = "tutorial"
    OTHER = "other"


class ApplicationStatus(str, Enum):
    """Campaign application status"""
    PENDING = "pending"
    UNDER_REVIEW = "under_review"
    APPROVED = "approved"
    REJECTED = "rejected"
    WITHDRAWN = "withdrawn"


class CollaborationStatus(str, Enum):
    """Collaboration status between brand and influencer"""
    NEGOTIATING = "negotiating"
    CONFIRMED = "confirmed"
    IN_PROGRESS = "in_progress"
    CONTENT_SUBMITTED = "content_submitted"
    CONTENT_APPROVED = "content_approved"
    CONTENT_PUBLISHED = "content_published"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    DISPUTED = "disputed"


class Campaign(Base):
    """Brand campaigns looking for influencers"""
    
    __tablename__ = "campaigns"
    
    id = Column(Integer, primary_key=True, index=True)
    brand_id = Column(Integer, ForeignKey("brands.id"), nullable=False, index=True)
    
    # Basic campaign information
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    campaign_type = Column(SQLEnum(CampaignType), nullable=False)
    status = Column(SQLEnum(CampaignStatus), default=CampaignStatus.DRAFT)
    
    # Campaign requirements
    required_categories = Column(JSON, nullable=True)  # Content categories
    required_platforms = Column(JSON, nullable=True)  # Social media platforms
    min_followers = Column(Integer, nullable=True)
    max_followers = Column(Integer, nullable=True)
    target_demographics = Column(JSON, nullable=True)
    target_locations = Column(JSON, nullable=True)
    
    # Content requirements
    content_requirements = Column(Text, nullable=True)
    deliverables = Column(JSON, nullable=False)  # List of required deliverables
    content_guidelines = Column(Text, nullable=True)
    hashtags_required = Column(JSON, nullable=True)
    mentions_required = Column(JSON, nullable=True)
    
    # Budget and compensation
    budget_min = Column(Float, nullable=True)
    budget_max = Column(Float, nullable=True)
    budget_currency = Column(String(3), default="USD")
    compensation_type = Column(String(50), nullable=True)  # monetary, product, both
    product_value = Column(Float, nullable=True)
    
    # Timeline
    application_deadline = Column(DateTime(timezone=True), nullable=True)
    campaign_start_date = Column(DateTime(timezone=True), nullable=True)
    campaign_end_date = Column(DateTime(timezone=True), nullable=True)
    content_due_date = Column(DateTime(timezone=True), nullable=True)
    
    # Campaign settings
    max_participants = Column(Integer, nullable=True)
    auto_approve_applications = Column(Boolean, default=False)
    requires_approval = Column(Boolean, default=True)
    
    # Performance tracking
    target_reach = Column(Integer, nullable=True)
    target_engagement = Column(Integer, nullable=True)
    tracking_links = Column(JSON, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    brand = relationship("Brand", back_populates="campaigns")
    applications = relationship("CampaignApplication", back_populates="campaign", cascade="all, delete-orphan")
    collaborations = relationship("CampaignCollaboration", back_populates="campaign", cascade="all, delete-orphan")
    
    @property
    def is_active(self) -> bool:
        """Check if campaign is currently active and accepting applications"""
        if self.status != CampaignStatus.ACTIVE:
            return False
        
        now = func.now()
        if self.application_deadline and now > self.application_deadline:
            return False
            
        return True
    
    @property
    def budget_range_display(self) -> str:
        """Get formatted budget range"""
        if self.budget_min and self.budget_max:
            return f"{self.budget_currency} {self.budget_min:,.0f} - {self.budget_max:,.0f}"
        elif self.budget_min:
            return f"{self.budget_currency} {self.budget_min:,.0f}+"
        elif self.budget_max:
            return f"Up to {self.budget_currency} {self.budget_max:,.0f}"
        return "Budget not specified"
    
    def __repr__(self):
        return f"<Campaign(id={self.id}, title='{self.title}', status='{self.status}')>"


class CampaignApplication(Base):
    """Influencer applications to campaigns"""
    
    __tablename__ = "campaign_applications"
    
    id = Column(Integer, primary_key=True, index=True)
    campaign_id = Column(Integer, ForeignKey("campaigns.id"), nullable=False, index=True)
    influencer_id = Column(Integer, ForeignKey("influencers.id"), nullable=False, index=True)
    
    # Application details
    status = Column(SQLEnum(ApplicationStatus), default=ApplicationStatus.PENDING)
    cover_letter = Column(Text, nullable=True)
    proposed_content = Column(Text, nullable=True)
    proposed_rate = Column(Float, nullable=True)
    proposed_deliverables = Column(JSON, nullable=True)
    
    # Portfolio/samples
    portfolio_links = Column(JSON, nullable=True)
    previous_work_examples = Column(JSON, nullable=True)
    
    # Review information
    reviewed_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    reviewed_at = Column(DateTime(timezone=True), nullable=True)
    review_notes = Column(Text, nullable=True)
    rejection_reason = Column(Text, nullable=True)
    
    # Timestamps
    applied_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    campaign = relationship("Campaign", back_populates="applications")
    influencer = relationship("Influencer", back_populates="applications")
    reviewer = relationship("User", foreign_keys=[reviewed_by])
    
    def __repr__(self):
        return f"<CampaignApplication(id={self.id}, campaign_id={self.campaign_id}, influencer_id={self.influencer_id}, status='{self.status}')>"


class CampaignCollaboration(Base):
    """Active collaborations between brands and influencers"""
    
    __tablename__ = "campaign_collaborations"
    
    id = Column(Integer, primary_key=True, index=True)
    campaign_id = Column(Integer, ForeignKey("campaigns.id"), nullable=False, index=True)
    influencer_id = Column(Integer, ForeignKey("influencers.id"), nullable=False, index=True)
    application_id = Column(Integer, ForeignKey("campaign_applications.id"), nullable=True, index=True)
    
    # Collaboration details
    status = Column(SQLEnum(CollaborationStatus), default=CollaborationStatus.NEGOTIATING)
    agreed_rate = Column(Float, nullable=True)
    agreed_deliverables = Column(JSON, nullable=False)
    special_terms = Column(Text, nullable=True)
    
    # Contract information
    contract_signed = Column(Boolean, default=False)
    contract_signed_at = Column(DateTime(timezone=True), nullable=True)
    contract_url = Column(String(500), nullable=True)
    
    # Timeline
    content_due_date = Column(DateTime(timezone=True), nullable=True)
    publish_date = Column(DateTime(timezone=True), nullable=True)
    
    # Content submission
    submitted_content = Column(JSON, nullable=True)  # URLs to submitted content
    submitted_at = Column(DateTime(timezone=True), nullable=True)
    approved_at = Column(DateTime(timezone=True), nullable=True)
    published_at = Column(DateTime(timezone=True), nullable=True)
    
    # Performance tracking
    performance_metrics = Column(JSON, nullable=True)  # Likes, comments, reach, etc.
    final_urls = Column(JSON, nullable=True)  # URLs to published content
    
    # Payment information
    payment_status = Column(String(50), default="pending")
    payment_date = Column(DateTime(timezone=True), nullable=True)
    payment_reference = Column(String(255), nullable=True)
    
    # Ratings and feedback
    brand_rating = Column(Integer, nullable=True)  # 1-5 stars
    influencer_rating = Column(Integer, nullable=True)  # 1-5 stars
    brand_feedback = Column(Text, nullable=True)
    influencer_feedback = Column(Text, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    campaign = relationship("Campaign", back_populates="collaborations")
    influencer = relationship("Influencer", back_populates="collaborations")
    application = relationship("CampaignApplication")
    
    @property
    def is_completed(self) -> bool:
        """Check if collaboration is completed"""
        return self.status == CollaborationStatus.COMPLETED
    
    @property
    def days_since_start(self) -> int:
        """Get number of days since collaboration started"""
        if not self.created_at:
            return 0
        return (func.now() - self.created_at).days
    
    def __repr__(self):
        return f"<CampaignCollaboration(id={self.id}, campaign_id={self.campaign_id}, influencer_id={self.influencer_id}, status='{self.status}')>"
