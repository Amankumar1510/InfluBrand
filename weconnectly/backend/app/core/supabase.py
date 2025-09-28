"""
Supabase client configuration and utilities
"""

from supabase import create_client, Client
from gotrue import SyncGoTrueClient
from typing import Optional, Dict, Any
import logging

from app.core.config import settings

logger = logging.getLogger(__name__)

# Global Supabase client instance
supabase: Optional[Client] = None


def get_supabase_client() -> Client:
    """Get or create Supabase client instance"""
    global supabase
    
    if supabase is None:
        # Check if configuration is properly set
        if (not settings.SUPABASE_URL or 
            settings.SUPABASE_URL == "https://your-project.supabase.co" or
            not settings.SUPABASE_ANON_KEY or 
            settings.SUPABASE_ANON_KEY == "your-anon-key"):
            raise ValueError("Supabase URL and ANON_KEY must be properly configured. Please check your environment variables.")
        
        supabase = create_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_ANON_KEY
        )
        logger.info("Supabase client initialized")
    
    return supabase


def get_supabase_admin_client() -> Client:
    """Get Supabase client with service role key for admin operations"""
    # Check if configuration is properly set
    if (not settings.SUPABASE_URL or 
        settings.SUPABASE_URL == "https://your-project.supabase.co" or
        not settings.SUPABASE_SERVICE_ROLE_KEY or 
        settings.SUPABASE_SERVICE_ROLE_KEY == "your-service-role-key"):
        raise ValueError("Supabase URL and SERVICE_ROLE_KEY must be properly configured. Please check your environment variables.")
    
    return create_client(
        settings.SUPABASE_URL,
        settings.SUPABASE_SERVICE_ROLE_KEY
    )


class SupabaseAuth:
    """Wrapper class for Supabase authentication operations"""
    
    def __init__(self):
        self.client = None
        self.admin_client = None
    
    def _ensure_clients(self):
        """Lazy initialization of Supabase clients"""
        if self.client is None:
            self.client = get_supabase_client()
        if self.admin_client is None:
            self.admin_client = get_supabase_admin_client()
    
    async def sign_in_with_google(self, redirect_url: str = None) -> Dict[str, Any]:
        """Initiate Google OAuth sign-in"""
        self._ensure_clients()
        try:
            response = self.client.auth.sign_in_with_oauth({
                "provider": "google",
                "options": {
                    "redirect_to": redirect_url or f"{settings.ALLOWED_HOSTS[0]}/auth/callback"
                }
            })
            return response
        except Exception as e:
            logger.error(f"Google sign-in error: {e}")
            raise
    
    async def get_user_from_token(self, access_token: str) -> Optional[Dict[str, Any]]:
        """Get user information from access token"""
        self._ensure_clients()
        try:
            # Set the session with the access token
            self.client.auth.set_session(access_token, "")
            
            # Get user information
            user = self.client.auth.get_user()
            return user.user if user else None
        except Exception as e:
            logger.error(f"Error getting user from token: {e}")
            return None
    
    async def refresh_token(self, refresh_token: str) -> Optional[Dict[str, Any]]:
        """Refresh access token using refresh token"""
        self._ensure_clients()
        try:
            response = self.client.auth.refresh_session(refresh_token)
            return response
        except Exception as e:
            logger.error(f"Token refresh error: {e}")
            return None
    
    async def sign_out(self, access_token: str) -> bool:
        """Sign out user"""
        self._ensure_clients()
        try:
            # Set the session first
            self.client.auth.set_session(access_token, "")
            
            # Sign out
            self.client.auth.sign_out()
            return True
        except Exception as e:
            logger.error(f"Sign out error: {e}")
            return False
    
    async def get_user_by_id(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Get user by ID using admin client"""
        self._ensure_clients()
        try:
            response = self.admin_client.auth.admin.get_user_by_id(user_id)
            return response.user if response else None
        except Exception as e:
            logger.error(f"Error getting user by ID: {e}")
            return None
    
    async def update_user_metadata(self, user_id: str, metadata: Dict[str, Any]) -> bool:
        """Update user metadata using admin client"""
        self._ensure_clients()
        try:
            response = self.admin_client.auth.admin.update_user_by_id(
                user_id,
                {"user_metadata": metadata}
            )
            return response is not None
        except Exception as e:
            logger.error(f"Error updating user metadata: {e}")
            return False


# Global auth instance
auth_service = SupabaseAuth()
