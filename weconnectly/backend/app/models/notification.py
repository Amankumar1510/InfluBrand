# ============================================================================
# backend/app/models/notification.py - Notification Model
# ============================================================================

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.config.database import Base

class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Notification Content
    type = Column(String(50), nullable=False)  # campaign_applied, message_received, etc.
    title = Column(String(200), nullable=False)
    message = Column(String(500), nullable=False)
    
    # Reference to related entity
    entity_type = Column(String(50))  # campaign, application, message
    entity_id = Column(Integer)
    
    # Status
    is_read = Column(Boolean, default=False)
    is_sent = Column(Boolean, default=False)  # For push notifications
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    read_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="notifications")