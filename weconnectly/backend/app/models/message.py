# ============================================================================
# backend/app/models/message.py - Message Model
# ============================================================================

from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON, ARRAY
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.config.database import Base

class Message(Base):
    __tablename__ = "messages"
    
    id = Column(Integer, primary_key=True, index=True)
    thread_id = Column(Integer, ForeignKey("threads.id"), nullable=False)
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Message Content
    body = Column(Text, nullable=False)
    attachments = Column(ARRAY(String), default=[])  # File URLs
    message_type = Column(String(20), default="text")  # text, image, file
    
    # Metadata
    is_edited = Column(Boolean, default=False)
    edited_at = Column(DateTime(timezone=True), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    sender = relationship("User", back_populates="sent_messages")
    thread = relationship("Thread", back_populates="messages")

class Thread(Base):
    __tablename__ = "threads"
    
    id = Column(Integer, primary_key=True, index=True)
    participant_ids = Column(ARRAY(Integer), nullable=False)  # [user1_id, user2_id]
    campaign_id = Column(Integer, ForeignKey("campaigns.id"), nullable=True)
    
    # Thread metadata
    title = Column(String(200))
    is_active = Column(Boolean, default=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_message_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    messages = relationship("Message", back_populates="thread")