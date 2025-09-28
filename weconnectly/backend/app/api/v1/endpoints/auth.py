"""
Authentication endpoints using Supabase
"""

from fastapi import APIRouter, Depends, HTTPException, status, Request
from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any
import logging

from app.core.supabase import auth_service, get_supabase_client
from app.core.config import settings
from app.core.exceptions import ValidationException, AuthenticationException

router = APIRouter()
logger = logging.getLogger(__name__)


# Request/Response schemas
class GoogleAuthRequest(BaseModel):
    redirect_url: Optional[str] = None


class AuthCallbackRequest(BaseModel):
    access_token: str
    refresh_token: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    user: Dict[str, Any]
    expires_in: int


class UserProfileResponse(BaseModel):
    id: str
    email: str
    username: Optional[str]
    first_name: Optional[str]
    last_name: Optional[str]
    role: str
    avatar_url: Optional[str]
    is_verified: bool
    created_at: str


@router.post("/google")
async def google_auth_initiate(auth_request: GoogleAuthRequest):
    """Initiate Google OAuth sign-in"""
    try:
        response = await auth_service.sign_in_with_google(
            redirect_url=auth_request.redirect_url
        )
        return response
    except Exception as e:
        logger.error(f"Google auth initiation failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to initiate Google authentication"
        )


@router.post("/callback", response_model=TokenResponse)
async def auth_callback(callback_data: AuthCallbackRequest):
    """Handle OAuth callback and exchange tokens"""
    try:
        # Get user information from Supabase
        user = await auth_service.get_user_from_token(callback_data.access_token)
        
        if not user:
            raise AuthenticationException("Invalid access token")
        
        # Get full user profile from database
        supabase = get_supabase_client()
        profile_response = supabase.rpc(
            'get_user_profile',
            {'user_uuid': user['id']}
        ).execute()
        
        user_profile = profile_response.data if profile_response.data else {}
        
        return {
            "access_token": callback_data.access_token,
            "refresh_token": callback_data.refresh_token,
            "user": {
                "id": user['id'],
                "email": user['email'],
                "name": user.get('user_metadata', {}).get('full_name', ''),
                "avatar_url": user.get('user_metadata', {}).get('avatar_url', ''),
                "profile": user_profile
            },
            "expires_in": 3600  # 1 hour default
        }
    except Exception as e:
        logger.error(f"Auth callback failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Authentication callback failed"
        )


@router.post("/refresh")
async def refresh_access_token(refresh_token: str):
    """Refresh access token using refresh token"""
    try:
        response = await auth_service.refresh_token(refresh_token)
        
        if not response:
            raise AuthenticationException("Invalid refresh token")
        
        return {
            "access_token": response.session.access_token,
            "refresh_token": response.session.refresh_token,
            "expires_in": response.session.expires_in
        }
    except Exception as e:
        logger.error(f"Token refresh failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token refresh failed"
        )


@router.get("/me", response_model=UserProfileResponse)
async def get_current_user_profile(request: Request):
    """Get current user profile"""
    try:
        # Extract token from Authorization header
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            raise AuthenticationException("Missing or invalid authorization header")
        
        access_token = auth_header.split(" ")[1]
        
        # Get user from Supabase
        user = await auth_service.get_user_from_token(access_token)
        if not user:
            raise AuthenticationException("Invalid access token")
        
        # Get full profile from database
        supabase = get_supabase_client()
        profile_response = supabase.rpc(
            'get_user_profile',
            {'user_uuid': user['id']}
        ).execute()
        
        if not profile_response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User profile not found"
            )
        
        profile = profile_response.data
        
        return UserProfileResponse(
            id=profile['user_id'],
            email=user['email'],
            username=profile.get('username'),
            first_name=profile.get('first_name'),
            last_name=profile.get('last_name'),
            role=profile['role'],
            avatar_url=profile.get('avatar_url'),
            is_verified=profile.get('is_verified', False),
            created_at=profile['created_at']
        )
    except Exception as e:
        logger.error(f"Get user profile failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Failed to get user profile"
        )


@router.post("/signout")
async def sign_out(request: Request):
    """Sign out current user"""
    try:
        # Extract token from Authorization header
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            raise AuthenticationException("Missing or invalid authorization header")
        
        access_token = auth_header.split(" ")[1]
        
        # Sign out from Supabase
        success = await auth_service.sign_out(access_token)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to sign out"
            )
        
        return {"message": "Successfully signed out"}
    except Exception as e:
        logger.error(f"Sign out failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Sign out failed"
        )


@router.post("/complete-profile")
async def complete_user_profile(
    profile_data: Dict[str, Any],
    request: Request
):
    """Complete user profile after initial registration"""
    try:
        # Extract token from Authorization header
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            raise AuthenticationException("Missing or invalid authorization header")
        
        access_token = auth_header.split(" ")[1]
        
        # Get user from Supabase
        user = await auth_service.get_user_from_token(access_token)
        if not user:
            raise AuthenticationException("Invalid access token")
        
        # Update user profile in database
        supabase = get_supabase_client()
        response = supabase.rpc(
            'update_user_profile',
            {
                'user_uuid': user['id'],
                'profile_updates': profile_data
            }
        ).execute()
        
        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update profile"
            )
        
        return {"message": "Profile updated successfully", "profile": response.data}
    except Exception as e:
        logger.error(f"Complete profile failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to complete profile"
        )
