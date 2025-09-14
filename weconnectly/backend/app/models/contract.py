# ============================================================================
# backend/app/models/contract.py - Contract Model
# ============================================================================

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Numeric, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.config.database import Base
import enum

class ContractStatus(str, enum.Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    DELIVERED = "delivered"
    DISPUTED = "disputed"
    RELEASED = "released"
    CANCELLED = "cancelled"

class Contract(Base):
    __tablename__ = "contracts"
    
    id = Column(Integer, primary_key=True, index=True)
    campaign_id = Column(Integer, ForeignKey("campaigns.id"), nullable=False)
    brand_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    creator_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Contract Terms
    terms = Column(JSON, default={})  # Contract terms and conditions
    amount = Column(Numeric(10, 2), nullable=False)
    currency = Column(String(3), default="USD")
    
    # Payment
    escrow_id = Column(String(100))  # External escrow reference
    
    # Status
    status = Column(String(20), default=ContractStatus.DRAFT)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    signed_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)