# ============================================================================
# backend/app/models/event.py - Event Model (Analytics)
# ============================================================================

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON
from sqlalchemy.sql import func
from app.config.database import Base

class Event(Base):
    __tablename__ = "events"
    
    id = Column(Integer, primary_key=True, index=True)
    type = Column(String(100), nullable=False)  # user_signup, campaign_created, etc.
    actor_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    # Event target
    entity_type = Column(String(50), nullable=False)  # user, campaign, application
    entity_id = Column(Integer, nullable=False)
    
    # Event payload
    payload = Column(JSON, default={})
    
    # Metadata
    ip_address = Column(String(45))
    user_agent = Column(String(500))
    
    # Timestamp
    created_at = Column(DateTime(timezone=True), server_default=func.now())