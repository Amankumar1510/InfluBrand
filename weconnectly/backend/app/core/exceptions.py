"""
Custom exception classes for the application
"""

from typing import Any, Dict, Optional


class BaseAPIException(Exception):
    """Base exception class for API errors"""
    
    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        self.message = message
        self.details = details or {}
        super().__init__(self.message)


class ValidationException(BaseAPIException):
    """Exception for validation errors (400)"""
    pass


class AuthenticationException(BaseAPIException):
    """Exception for authentication errors (401)"""
    pass


class AuthorizationException(BaseAPIException):
    """Exception for authorization errors (403)"""
    pass


class NotFoundException(BaseAPIException):
    """Exception for not found errors (404)"""
    pass


class ConflictException(BaseAPIException):
    """Exception for conflict errors (409)"""
    pass


class RateLimitException(BaseAPIException):
    """Exception for rate limiting errors (429)"""
    pass


class ExternalServiceException(BaseAPIException):
    """Exception for external service errors (502)"""
    pass


class DatabaseException(BaseAPIException):
    """Exception for database errors (500)"""
    pass


class FileUploadException(BaseAPIException):
    """Exception for file upload errors (400)"""
    pass


class SocialMediaAPIException(BaseAPIException):
    """Exception for social media API errors (502)"""
    pass


class EmailException(BaseAPIException):
    """Exception for email sending errors (500)"""
    pass
