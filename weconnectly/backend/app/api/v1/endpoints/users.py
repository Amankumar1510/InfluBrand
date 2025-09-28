"""
User management endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from typing import Optional, List

from app.core.database import get_async_session
from app.core.security import get_current_verified_user
from app.models.user import User
from app.repositories.user_repository import UserRepository

router = APIRouter()


class UserProfileUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    username: Optional[str] = None
    phone: Optional[str] = None
    bio: Optional[str] = None
    website: Optional[str] = None
    location: Optional[str] = None


class UserResponse(BaseModel):
    id: int
    email: str
    username: Optional[str]
    first_name: Optional[str]
    last_name: Optional[str]
    role: str
    is_active: bool
    is_verified: bool
    created_at: str
    
    class Config:
        from_attributes = True


@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(
    current_user: User = Depends(get_current_verified_user)
):
    """Get current user's profile"""
    return current_user


@router.put("/me", response_model=UserResponse)
async def update_current_user_profile(
    profile_update: UserProfileUpdate,
    current_user: User = Depends(get_current_verified_user),
    session: AsyncSession = Depends(get_async_session)
):
    """Update current user's profile"""
    user_repo = UserRepository(session)
    
    # Check if username is already taken
    if profile_update.username and profile_update.username != current_user.username:
        existing_user = await user_repo.get_by_username(profile_update.username)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken"
            )
    
    # Update user
    updated_user = await user_repo.update(
        current_user.id, 
        profile_update.model_dump(exclude_unset=True)
    )
    
    return updated_user


@router.delete("/me")
async def deactivate_current_user_account(
    current_user: User = Depends(get_current_verified_user),
    session: AsyncSession = Depends(get_async_session)
):
    """Deactivate current user's account"""
    user_repo = UserRepository(session)
    
    success = await user_repo.deactivate_user(current_user.id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to deactivate account"
        )
    
    return {"message": "Account deactivated successfully"}


@router.get("/{user_id}", response_model=UserResponse)
async def get_user_by_id(
    user_id: int,
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_verified_user)
):
    """Get user by ID (public profile)"""
    user_repo = UserRepository(session)
    
    user = await user_repo.get_by_id(user_id)
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user


@router.get("/", response_model=List[UserResponse])
async def search_users(
    q: Optional[str] = None,
    role: Optional[str] = None,
    skip: int = 0,
    limit: int = 20,
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_verified_user)
):
    """Search users"""
    user_repo = UserRepository(session)
    
    users = await user_repo.search_users(
        query=q,
        role=role,
        is_verified=True,  # Only show verified users
        skip=skip,
        limit=min(limit, 100)  # Cap at 100
    )
    
    return users
