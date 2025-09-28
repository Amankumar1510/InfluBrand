"""
User repository for database operations
"""

from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from sqlalchemy.sql import func
from datetime import datetime

from app.models.user import User, UserProfile
from app.repositories.base_repository import BaseRepository


class UserRepository(BaseRepository[User, dict, dict]):
    """Repository for user operations"""
    
    def __init__(self, session: AsyncSession):
        super().__init__(User, session)
    
    async def get_by_email(self, email: str) -> Optional[User]:
        """Get user by email address"""
        result = await self.session.execute(
            select(User).where(User.email == email)
        )
        return result.scalar_one_or_none()
    
    async def get_by_username(self, username: str) -> Optional[User]:
        """Get user by username"""
        result = await self.session.execute(
            select(User).where(User.username == username)
        )
        return result.scalar_one_or_none()
    
    async def get_by_verification_token(self, token: str) -> Optional[User]:
        """Get user by verification token"""
        result = await self.session.execute(
            select(User).where(User.verification_token == token)
        )
        return result.scalar_one_or_none()
    
    async def get_by_reset_token(self, token: str) -> Optional[User]:
        """Get user by password reset token"""
        result = await self.session.execute(
            select(User).where(
                User.reset_token == token,
                User.reset_expires > func.now()
            )
        )
        return result.scalar_one_or_none()
    
    async def verify_user(self, user_id: int) -> bool:
        """Mark user as verified"""
        result = await self.session.execute(
            update(User)
            .where(User.id == user_id)
            .values(
                is_verified=True,
                verification_token=None,
                verification_expires=None
            )
        )
        await self.session.commit()
        return result.rowcount > 0
    
    async def update_last_login(self, user_id: int) -> bool:
        """Update user's last login timestamp"""
        result = await self.session.execute(
            update(User)
            .where(User.id == user_id)
            .values(last_login=func.now())
        )
        await self.session.commit()
        return result.rowcount > 0
    
    async def set_reset_token(self, user_id: int, token: str, expires_at: datetime = None) -> bool:
        """Set password reset token"""
        if expires_at is None:
            # Default to 1 hour from now
            expires_at = func.now() + func.interval('1 hour')
        
        result = await self.session.execute(
            update(User)
            .where(User.id == user_id)
            .values(
                reset_token=token,
                reset_expires=expires_at
            )
        )
        await self.session.commit()
        return result.rowcount > 0
    
    async def update_password(self, user_id: int, hashed_password: str) -> bool:
        """Update user password"""
        result = await self.session.execute(
            update(User)
            .where(User.id == user_id)
            .values(
                hashed_password=hashed_password,
                reset_token=None,
                reset_expires=None
            )
        )
        await self.session.commit()
        return result.rowcount > 0
    
    async def deactivate_user(self, user_id: int) -> bool:
        """Deactivate user account"""
        result = await self.session.execute(
            update(User)
            .where(User.id == user_id)
            .values(is_active=False)
        )
        await self.session.commit()
        return result.rowcount > 0
    
    async def activate_user(self, user_id: int) -> bool:
        """Activate user account"""
        result = await self.session.execute(
            update(User)
            .where(User.id == user_id)
            .values(is_active=True)
        )
        await self.session.commit()
        return result.rowcount > 0
    
    async def get_with_profile(self, user_id: int) -> Optional[User]:
        """Get user with profile information"""
        result = await self.session.execute(
            select(User)
            .options(selectinload(User.profile))
            .where(User.id == user_id)
        )
        return result.scalar_one_or_none()
    
    async def search_users(
        self,
        query: str,
        role: Optional[str] = None,
        is_verified: Optional[bool] = None,
        skip: int = 0,
        limit: int = 20
    ) -> List[User]:
        """Search users by name, username, or email"""
        search_query = select(User)
        
        # Text search
        if query:
            search_term = f"%{query}%"
            search_query = search_query.where(
                User.first_name.ilike(search_term) |
                User.last_name.ilike(search_term) |
                User.username.ilike(search_term) |
                User.email.ilike(search_term)
            )
        
        # Role filter
        if role:
            search_query = search_query.where(User.role == role)
        
        # Verification filter
        if is_verified is not None:
            search_query = search_query.where(User.is_verified == is_verified)
        
        # Active users only
        search_query = search_query.where(User.is_active == True)
        
        # Pagination
        search_query = search_query.offset(skip).limit(limit)
        
        result = await self.session.execute(search_query)
        return result.scalars().all()
