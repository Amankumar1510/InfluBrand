# ============================================================================
# backend/app/models/payment.py - Payment Model
# ============================================================================

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Numeric, JSON
from sqlalchemy.sql import func
from app.config.database import Base
import enum

class PaymentStatus(str, enum.Enum):
    PENDING = "pending"
    HELD = "held"
    RELEASED = "released"
    FAILED = "failed"
    REFUNDED = "refunded"

class Payment(Base):
    __tablename__ = "payments"
    
    id = Column(Integer, primary_key=True, index=True)
    contract_id = Column(Integer, ForeignKey("contracts.id"), nullable=False)
    
    # Payment Details
    provider = Column(String(50), nullable=False)  # stripe, razorpay
    provider_ref = Column(String(200), nullable=False)  # External payment ID
    amount = Column(Numeric(10, 2), nullable=False)
    currency = Column(String(3), default="USD")
    
    # Status
    status = Column(String(20), default=PaymentStatus.PENDING)
    
    # Events log (webhooks, status changes)
    events = Column(JSON, default=[])
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    released_at = Column(DateTime(timezone=True), nullable=True)
