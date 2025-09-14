# ============================================================================
# backend/app/schemas/user.py - User Schemas
# ============================================================================

from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from app.models.user import UserRole, UserStatus

class UserBase(BaseModel):
    email: EmailStr
    role: UserRole

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    is_verified: Optional[bool] = None
    status: Optional[UserStatus] = None

class UserResponse(UserBase):
    id: int
    status: UserStatus
    is_verified: bool
    created_at: datetime
    last_login: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class UserProfile(UserResponse):
    profile: Optional["ProfileResponse"] = None
    
    class Config:
        from_attributes = True