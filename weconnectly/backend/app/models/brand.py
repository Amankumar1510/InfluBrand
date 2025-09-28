"""
Brand-specific models
"""

from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Float, ForeignKey, Enum as SQLEnum, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from enum import Enum

from app.core.database import Base


class BrandCategory(str, Enum):
    """Brand industry categories"""
    FASHION_BEAUTY = "fashion_beauty"
    TECHNOLOGY = "technology"
    FOOD_BEVERAGE = "food_beverage"
    FITNESS_HEALTH = "fitness_health"
    TRAVEL_TOURISM = "travel_tourism"
    GAMING = "gaming"
    ENTERTAINMENT = "entertainment"
    EDUCATION = "education"
    LIFESTYLE = "lifestyle"
    HOME_GARDEN = "home_garden"
    AUTOMOTIVE = "automotive"
    FINANCE = "finance"
    REAL_ESTATE = "real_estate"
    HEALTHCARE = "healthcare"
    B2B_SERVICES = "b2b_services"
    RETAIL = "retail"
    SPORTS = "sports"
    PETS = "pets"
    OTHER = "other"


class CompanySize(str, Enum):
    """Company size categories"""
    STARTUP = "startup"  # 1-10 employees
    SMALL = "small"      # 11-50 employees
    MEDIUM = "medium"    # 51-200 employees
    LARGE = "large"      # 201-1000 employees
    ENTERPRISE = "enterprise"  # 1000+ employees


class Brand(Base):
    """Brand-specific profile and information"""
    
    __tablename__ = "brands"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True, index=True)
    
    # Company information
    company_name = Column(String(255), nullable=False)
    brand_name = Column(String(255), nullable=True)  # May differ from company name
    tagline = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    
    # Industry and categorization
    primary_category = Column(SQLEnum(BrandCategory), nullable=False)
    secondary_categories = Column(JSON, nullable=True)
    company_size = Column(SQLEnum(CompanySize), nullable=True)
    
    # Contact information
    company_website = Column(String(255), nullable=True)
    company_email = Column(String(255), nullable=True)
    company_phone = Column(String(20), nullable=True)
    
    # Address information
    headquarters_location = Column(String(255), nullable=True)
    operating_regions = Column(JSON, nullable=True)  # List of regions/countries
    
    # Brand information
    brand_values = Column(JSON, nullable=True)  # List of brand values
    target_demographics = Column(JSON, nullable=True)  # Target audience info
    brand_voice = Column(Text, nullable=True)  # Brand voice description
    
    # Collaboration preferences
    preferred_collaboration_types = Column(JSON, nullable=True)
    typical_campaign_budget_min = Column(Float, nullable=True)
    typical_campaign_budget_max = Column(Float, nullable=True)
    budget_currency = Column(String(3), default="USD")
    
    # Verification and quality
    is_verified = Column(Boolean, default=False)
    verification_documents = Column(JSON, nullable=True)  # URLs to verification docs
    
    # Business metrics
    monthly_marketing_budget = Column(Float, nullable=True)
    previous_influencer_campaigns = Column(Integer, default=0)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="brand")
    profile = relationship("BrandProfile", back_populates="brand", uselist=False, cascade="all, delete-orphan")
    
    # Campaign relationships
    campaigns = relationship("Campaign", back_populates="brand", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Brand(id={self.id}, company_name='{self.company_name}', category='{self.primary_category}')>"


class BrandProfile(Base):
    """Extended brand profile information"""
    
    __tablename__ = "brand_profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    brand_id = Column(Integer, ForeignKey("brands.id"), nullable=False, unique=True, index=True)
    
    # Brand assets
    logo_url = Column(String(500), nullable=True)
    banner_image_url = Column(String(500), nullable=True)
    brand_colors = Column(JSON, nullable=True)  # Hex color codes
    brand_fonts = Column(JSON, nullable=True)  # Font preferences
    
    # Brand guidelines
    brand_guidelines_url = Column(String(500), nullable=True)
    content_guidelines = Column(Text, nullable=True)
    dos_and_donts = Column(JSON, nullable=True)
    
    # Social media presence
    instagram_handle = Column(String(100), nullable=True)
    twitter_handle = Column(String(100), nullable=True)
    youtube_channel = Column(String(255), nullable=True)
    tiktok_handle = Column(String(100), nullable=True)
    linkedin_page = Column(String(255), nullable=True)
    
    # Media kit and resources
    media_kit_url = Column(String(500), nullable=True)
    product_catalog_url = Column(String(500), nullable=True)
    press_kit_url = Column(String(500), nullable=True)
    
    # Campaign preferences
    preferred_content_types = Column(JSON, nullable=True)  # Post, Story, Reel, etc.
    preferred_posting_times = Column(JSON, nullable=True)
    content_approval_required = Column(Boolean, default=True)
    usage_rights_required = Column(Boolean, default=False)
    
    # Performance tracking
    tracking_requirements = Column(JSON, nullable=True)  # UTM codes, affiliate links, etc.
    kpi_priorities = Column(JSON, nullable=True)  # Reach, engagement, conversions, etc.
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    brand = relationship("Brand", back_populates="profile")
    
    def __repr__(self):
        return f"<BrandProfile(brand_id={self.brand_id})>"
