"""
Analytics and metrics tracking models
"""

from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey, Enum as SQLEnum, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from enum import Enum

from app.core.database import Base


class EventType(str, Enum):
    """Types of analytics events"""
    PROFILE_VIEW = "profile_view"
    CAMPAIGN_VIEW = "campaign_view"
    APPLICATION_SUBMITTED = "application_submitted"
    COLLABORATION_STARTED = "collaboration_started"
    COLLABORATION_COMPLETED = "collaboration_completed"
    CONTENT_PUBLISHED = "content_published"
    MESSAGE_SENT = "message_sent"
    SEARCH_PERFORMED = "search_performed"
    FILTER_APPLIED = "filter_applied"
    USER_SIGNUP = "user_signup"
    USER_LOGIN = "user_login"
    PROFILE_UPDATED = "profile_updated"
    SOCIAL_ACCOUNT_CONNECTED = "social_account_connected"


class MetricType(str, Enum):
    """Types of engagement metrics"""
    LIKES = "likes"
    COMMENTS = "comments"
    SHARES = "shares"
    VIEWS = "views"
    SAVES = "saves"
    REACH = "reach"
    IMPRESSIONS = "impressions"
    CLICK_THROUGH_RATE = "ctr"
    ENGAGEMENT_RATE = "engagement_rate"
    FOLLOWER_GROWTH = "follower_growth"


class AnalyticsEvent(Base):
    """Track user interactions and system events for analytics"""
    
    __tablename__ = "analytics_events"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Event information
    event_type = Column(SQLEnum(EventType), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    session_id = Column(String(255), nullable=True, index=True)
    
    # Event context
    entity_type = Column(String(50), nullable=True)  # user, campaign, collaboration, etc.
    entity_id = Column(Integer, nullable=True)
    
    # Event metadata
    properties = Column(JSON, nullable=True)  # Additional event properties
    user_agent = Column(String(500), nullable=True)
    ip_address = Column(String(45), nullable=True)  # IPv6 compatible
    referrer = Column(String(500), nullable=True)
    
    # Geographic information
    country = Column(String(2), nullable=True)  # ISO country code
    city = Column(String(100), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    
    # Relationships
    user = relationship("User")
    
    def __repr__(self):
        return f"<AnalyticsEvent(id={self.id}, event_type='{self.event_type}', user_id={self.user_id})>"


class EngagementMetric(Base):
    """Store engagement metrics for various entities"""
    
    __tablename__ = "engagement_metrics"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Metric identification
    entity_type = Column(String(50), nullable=False, index=True)  # post, campaign, influencer, brand
    entity_id = Column(Integer, nullable=False, index=True)
    metric_type = Column(SQLEnum(MetricType), nullable=False)
    platform = Column(String(50), nullable=True)  # Social media platform if applicable
    
    # Metric values
    value = Column(Float, nullable=False)
    previous_value = Column(Float, nullable=True)
    percentage_change = Column(Float, nullable=True)
    
    # Time period
    period_start = Column(DateTime(timezone=True), nullable=False)
    period_end = Column(DateTime(timezone=True), nullable=False)
    
    # Additional context
    metadata = Column(JSON, nullable=True)  # Additional metric context
    
    # Timestamps
    calculated_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    @property
    def growth_rate(self) -> float:
        """Calculate growth rate compared to previous value"""
        if not self.previous_value or self.previous_value == 0:
            return 0.0
        
        return ((self.value - self.previous_value) / self.previous_value) * 100
    
    def __repr__(self):
        return f"<EngagementMetric(entity_type='{self.entity_type}', entity_id={self.entity_id}, metric_type='{self.metric_type}', value={self.value})>"
