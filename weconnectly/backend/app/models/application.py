# ============================================================================
# backend/app/models/application.py - Application Model
# ============================================================================

from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Numeric
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.config.database import Base
import enum

class ApplicationStatus(str, enum.Enum):
    APPLIED = "applied"
    SHORTLISTED = "shortlisted"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    WITHDRAWN = "withdrawn"

class Application(Base):
    __tablename__ = "applications"
    
    id = Column(Integer, primary_key=True, index=True)
    campaign_id = Column(Integer, ForeignKey("campaigns.id"), nullable=False)
    creator_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Application Details
    message = Column(Text)  # Creator's pitch message
    ask_amount = Column(Numeric(10, 2), nullable=False)
    currency = Column(String(3), default="USD")
    
    # Proposed timeline
    proposed_start_date = Column(DateTime(timezone=True))
    proposed_end_date = Column(DateTime(timezone=True))
    
    # Status tracking
    status = Column(String(20), default=ApplicationStatus.APPLIED)
    
    # Timestamps
    applied_at = Column(DateTime(timezone=True), server_default=func.now())
    reviewed_at = Column(DateTime(timezone=True), nullable=True)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    campaign = relationship("Campaign", back_populates="applications")
    creator = relationship("User", back_populates="applications")