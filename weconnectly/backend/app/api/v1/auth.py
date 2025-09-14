# ============================================================================
# backend/app/api/v1/auth.py - Authentication API Routes
# ============================================================================

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.config.database import get_db
from app.schemas.auth import UserSignup, UserLogin, Token, RefreshToken
from app.schemas.user import UserResponse
from app.services.auth_service import AuthService
from app.core.security import verify_token
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/auth", tags=["authentication"])

@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def signup(
    user_data: UserSignup,
    db: AsyncSession = Depends(get_db)
):
    """Register a new user (creator or brand)"""
    auth_service = AuthService(db)
    return await auth_service.signup(user_data)

@router.post("/login", response_model=Token)
async def login(
    login_data: UserLogin,
    db: AsyncSession = Depends(get_db)
):
    """Authenticate user and return JWT tokens"""
    auth_service = AuthService(db)
    return await auth_service.login(login_data)

@router.post("/refresh", response_model=Token)
async def refresh_token(
    refresh_data: RefreshToken,
    db: AsyncSession = Depends(get_db)
):
    """Refresh access token using refresh token"""
    payload = verify_token(refresh_data.refresh_token, token_type="refresh")
    user_id = payload.get("sub")
    
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )
    
    auth_service = AuthService(db)
    user = await auth_service.get_user_by_id(int(user_id))
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    # Create new tokens
    from app.core.security import create_access_token, create_refresh_token
    access_token = create_access_token(data={"sub": str(user.id), "email": user.email})
    new_refresh_token = create_refresh_token(data={"sub": str(user.id)})
    
    return Token(
        access_token=access_token,
        refresh_token=new_refresh_token,
        expires_in=1800
    )

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user information"""
    return UserResponse.model_validate(current_user)

@router.post("/logout")
async def logout(current_user: User = Depends(get_current_user)):
    """Logout user (client should delete tokens)"""
    return {"message": "Successfully logged out"}