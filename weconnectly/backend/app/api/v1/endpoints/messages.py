"""
Messaging system endpoints
"""

from fastapi import APIRouter, Depends
from app.core.security import get_current_verified_user

router = APIRouter()

# TODO: Implement messaging endpoints
# - GET /conversations - Get user conversations
# - POST /conversations - Start new conversation
# - GET /conversations/{conversation_id} - Get conversation messages
# - POST /conversations/{conversation_id}/messages - Send message
# - PUT /messages/{message_id}/read - Mark message as read
# - DELETE /messages/{message_id} - Delete message
