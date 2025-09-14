# ============================================================================
# backend/app/services/auth_service.py - Authentication Service
# ============================================================================

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status
from typing import Optional
from datetime import datetime

from app.models.user import User, UserStatus
from app.models.profile import Profile
from app.schemas.auth import UserSignup, UserLogin, Token
from app.schemas.user import UserResponse
from app.core.security import verify_password, get_password_hash, create_access_token, create_refresh_token

class AuthService:
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def signup(self, user_data: UserSignup) -> UserResponse:
        # Check if user already exists
        existing_user = await self.get_user_by_email(user_data.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Create user
        hashed_password = get_password_hash(user_data.password)
        user = User(
            email=user_data.email,
            password_hash=hashed_password,
            role=user_data.role,
            status=UserStatus.PENDING_VERIFICATION
        )
        
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)
        
        # Create profile
        profile = Profile(
            user_id=user.id,
            display_name=user_data.display_name
        )
        self.db.add(profile)
        await self.db.commit()
        
        return UserResponse.model_validate(user)
    
    async def login(self, login_data: UserLogin) -> Token:
        user = await self.authenticate_user(login_data.email, login_data.password)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password"
            )
        
        # Update last login
        user.last_login = datetime.utcnow()
        await self.db.commit()
        
        # Create tokens
        access_token = create_access_token(data={"sub": str(user.id), "email": user.email})
        refresh_token = create_refresh_token(data={"sub": str(user.id)})
        
        return Token(
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=1800  # 30 minutes
        )
    
    async def authenticate_user(self, email: str, password: str) -> Optional[User]:
        user = await self.get_user_by_email(email)
        if not user:
            return None
        if not verify_password(password, user.password_hash):
            return None
        return user
    
    async def get_user_by_email(self, email: str) -> Optional[User]:
        result = await self.db.execute(select(User).where(User.email == email))
        return result.scalar_one_or_none()
    
    async def get_user_by_id(self, user_id: int) -> Optional[User]:
        result = await self.db.execute(select(User).where(User.id == user_id))
        return result.scalar_one_or_none()