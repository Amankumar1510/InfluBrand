"""
Notification models
"""

from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, Enum as SQLEnum, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from enum import Enum

from app.core.database import Base


class NotificationType(str, Enum):
    """Types of notifications"""
    CAMPAIGN_APPLICATION = "campaign_application"
    APPLICATION_STATUS_CHANGE = "application_status_change"
    COLLABORATION_INVITATION = "collaboration_invitation"
    COLLABORATION_UPDATE = "collaboration_update"
    CONTENT_APPROVAL = "content_approval"
    PAYMENT_RECEIVED = "payment_received"
    NEW_MESSAGE = "new_message"
    CAMPAIGN_REMINDER = "campaign_reminder"
    PROFILE_VIEW = "profile_view"
    NEW_FOLLOWER = "new_follower"
    SYSTEM_UPDATE = "system_update"
    VERIFICATION_STATUS = "verification_status"


class NotificationPriority(str, Enum):
    """Notification priority levels"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"


class Notification(Base):
    """User notifications"""
    
    __tablename__ = "notifications"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    
    # Notification content
    type = Column(SQLEnum(NotificationType), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    priority = Column(SQLEnum(NotificationPriority), default=NotificationPriority.MEDIUM)
    
    # Notification metadata
    entity_type = Column(String(50), nullable=True)  # campaign, collaboration, message, etc.
    entity_id = Column(Integer, nullable=True)
    action_url = Column(String(500), nullable=True)  # URL to navigate to
    metadata = Column(JSON, nullable=True)  # Additional notification data
    
    # Status
    is_read = Column(Boolean, default=False)
    is_archived = Column(Boolean, default=False)
    read_at = Column(DateTime(timezone=True), nullable=True)
    
    # Delivery settings
    email_sent = Column(Boolean, default=False)
    push_sent = Column(Boolean, default=False)
    sms_sent = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    expires_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="notifications")
    
    @property
    def is_expired(self) -> bool:
        """Check if notification has expired"""
        if not self.expires_at:
            return False
        return func.now() > self.expires_at
    
    def mark_as_read(self):
        """Mark notification as read"""
        self.is_read = True
        self.read_at = func.now()
    
    def __repr__(self):
        return f"<Notification(id={self.id}, user_id={self.user_id}, type='{self.type}', is_read={self.is_read})>"
