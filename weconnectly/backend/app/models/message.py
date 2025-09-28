"""
Messaging system models
"""

from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, Enum as SQLEnum, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from enum import Enum

from app.core.database import Base


class MessageType(str, Enum):
    """Types of messages"""
    TEXT = "text"
    IMAGE = "image"
    FILE = "file"
    SYSTEM = "system"
    COLLABORATION_REQUEST = "collaboration_request"
    CONTRACT = "contract"


class ConversationType(str, Enum):
    """Types of conversations"""
    DIRECT = "direct"  # Direct message between two users
    GROUP = "group"    # Group conversation
    SUPPORT = "support"  # Support conversation


class Conversation(Base):
    """Conversation threads between users"""
    
    __tablename__ = "conversations"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Conversation details
    type = Column(SQLEnum(ConversationType), default=ConversationType.DIRECT)
    title = Column(String(255), nullable=True)  # For group conversations
    
    # Participants (for direct messages, stored as JSON for simplicity)
    participants = Column(JSON, nullable=False)  # List of user IDs
    
    # Conversation metadata
    is_active = Column(Boolean, default=True)
    is_archived = Column(Boolean, default=False)
    
    # Last activity
    last_message_at = Column(DateTime(timezone=True), nullable=True)
    last_message_preview = Column(Text, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    messages = relationship("Message", back_populates="conversation", cascade="all, delete-orphan", order_by="Message.created_at")
    
    def get_other_participant(self, current_user_id: int) -> int:
        """Get the other participant in a direct conversation"""
        if self.type != ConversationType.DIRECT or len(self.participants) != 2:
            return None
        
        return next((p for p in self.participants if p != current_user_id), None)
    
    def __repr__(self):
        return f"<Conversation(id={self.id}, type='{self.type}', participants={self.participants})>"


class Message(Base):
    """Individual messages within conversations"""
    
    __tablename__ = "messages"
    
    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey("conversations.id"), nullable=False, index=True)
    
    # Message sender and recipient
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    recipient_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)  # For direct messages
    
    # Message content
    type = Column(SQLEnum(MessageType), default=MessageType.TEXT)
    content = Column(Text, nullable=False)
    
    # Attachments
    attachments = Column(JSON, nullable=True)  # URLs to attached files
    
    # Message metadata
    metadata = Column(JSON, nullable=True)  # Additional message data
    
    # Message status
    is_read = Column(Boolean, default=False)
    is_deleted = Column(Boolean, default=False)
    read_at = Column(DateTime(timezone=True), nullable=True)
    
    # Reply information
    reply_to_id = Column(Integer, ForeignKey("messages.id"), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    edited_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    conversation = relationship("Conversation", back_populates="messages")
    sender = relationship("User", foreign_keys=[sender_id], back_populates="sent_messages")
    recipient = relationship("User", foreign_keys=[recipient_id], back_populates="received_messages")
    reply_to = relationship("Message", remote_side=[id])
    
    def mark_as_read(self):
        """Mark message as read"""
        if not self.is_read:
            self.is_read = True
            self.read_at = func.now()
    
    @property
    def is_system_message(self) -> bool:
        """Check if this is a system-generated message"""
        return self.type == MessageType.SYSTEM
    
    def __repr__(self):
        return f"<Message(id={self.id}, sender_id={self.sender_id}, type='{self.type}', is_read={self.is_read})>"
