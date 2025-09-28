-- InfluBrand Database Schema for Supabase
-- Run this script in your Supabase SQL editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('influencer', 'brand', 'admin');
CREATE TYPE content_category AS ENUM (
    'fashion_beauty', 'technology', 'fitness_health', 'food_cooking',
    'travel', 'gaming', 'entertainment', 'education', 'lifestyle',
    'parenting', 'business', 'art_design', 'music', 'sports',
    'home_garden', 'automotive', 'pets', 'other'
);
CREATE TYPE brand_category AS ENUM (
    'fashion_beauty', 'technology', 'food_beverage', 'fitness_health',
    'travel_tourism', 'gaming', 'entertainment', 'education',
    'lifestyle', 'home_garden', 'automotive', 'finance',
    'real_estate', 'healthcare', 'b2b_services', 'retail',
    'sports', 'pets', 'other'
);
CREATE TYPE company_size AS ENUM ('startup', 'small', 'medium', 'large', 'enterprise');
CREATE TYPE campaign_status AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled');
CREATE TYPE campaign_type AS ENUM (
    'product_launch', 'brand_awareness', 'sales_promotion',
    'event_promotion', 'content_creation', 'long_term_partnership',
    'giveaway', 'review', 'unboxing', 'tutorial', 'other'
);
CREATE TYPE application_status AS ENUM ('pending', 'under_review', 'approved', 'rejected', 'withdrawn');
CREATE TYPE collaboration_status AS ENUM (
    'negotiating', 'confirmed', 'in_progress', 'content_submitted',
    'content_approved', 'content_published', 'completed', 'cancelled', 'disputed'
);
CREATE TYPE social_platform AS ENUM (
    'instagram', 'youtube', 'tiktok', 'twitter', 'facebook',
    'linkedin', 'snapchat', 'pinterest', 'twitch'
);
CREATE TYPE post_type AS ENUM (
    'post', 'story', 'reel', 'video', 'live', 'igtv',
    'carousel', 'shorts', 'tweet', 'thread'
);
CREATE TYPE notification_type AS ENUM (
    'campaign_application', 'application_status_change', 'collaboration_invitation',
    'collaboration_update', 'content_approval', 'payment_received',
    'new_message', 'campaign_reminder', 'profile_view', 'new_follower',
    'system_update', 'verification_status'
);
CREATE TYPE notification_priority AS ENUM ('low', 'medium', 'high', 'urgent');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(50) UNIQUE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    role user_role NOT NULL,
    
    -- Profile details
    bio TEXT,
    website VARCHAR(255),
    location VARCHAR(255),
    timezone VARCHAR(50),
    
    -- Profile images
    avatar_url VARCHAR(500),
    cover_image_url VARCHAR(500),
    
    -- Privacy settings
    is_profile_public BOOLEAN DEFAULT true,
    show_email BOOLEAN DEFAULT false,
    show_phone BOOLEAN DEFAULT false,
    
    -- Account status
    is_verified BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT user_profiles_user_id_key UNIQUE (user_id)
);

-- Influencers table
CREATE TABLE public.influencers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Professional information
    display_name VARCHAR(100),
    tagline VARCHAR(255),
    
    -- Content information
    primary_category content_category NOT NULL,
    secondary_categories JSONB DEFAULT '[]'::jsonb,
    content_types JSONB DEFAULT '[]'::jsonb,
    languages JSONB DEFAULT '["en"]'::jsonb,
    
    -- Collaboration information
    collaboration_types JSONB DEFAULT '[]'::jsonb,
    min_rate DECIMAL(10,2),
    max_rate DECIMAL(10,2),
    rate_currency VARCHAR(3) DEFAULT 'USD',
    
    -- Experience and portfolio
    years_experience INTEGER,
    total_collaborations INTEGER DEFAULT 0,
    
    -- Availability
    is_available BOOLEAN DEFAULT true,
    booking_lead_time_days INTEGER DEFAULT 7,
    
    -- Verification and quality
    is_verified BOOLEAN DEFAULT false,
    quality_score DECIMAL(3,2),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT influencers_user_id_key UNIQUE (user_id)
);

-- Brands table
CREATE TABLE public.brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Company information
    company_name VARCHAR(255) NOT NULL,
    brand_name VARCHAR(255),
    tagline VARCHAR(255),
    description TEXT,
    
    -- Industry and categorization
    primary_category brand_category NOT NULL,
    secondary_categories JSONB DEFAULT '[]'::jsonb,
    company_size company_size,
    
    -- Contact information
    company_website VARCHAR(255),
    company_email VARCHAR(255),
    company_phone VARCHAR(20),
    
    -- Address information
    headquarters_location VARCHAR(255),
    operating_regions JSONB DEFAULT '[]'::jsonb,
    
    -- Brand information
    brand_values JSONB DEFAULT '[]'::jsonb,
    target_demographics JSONB DEFAULT '{}'::jsonb,
    brand_voice TEXT,
    
    -- Collaboration preferences
    preferred_collaboration_types JSONB DEFAULT '[]'::jsonb,
    typical_campaign_budget_min DECIMAL(10,2),
    typical_campaign_budget_max DECIMAL(10,2),
    budget_currency VARCHAR(3) DEFAULT 'USD',
    
    -- Verification and quality
    is_verified BOOLEAN DEFAULT false,
    verification_documents JSONB DEFAULT '[]'::jsonb,
    
    -- Business metrics
    monthly_marketing_budget DECIMAL(12,2),
    previous_influencer_campaigns INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT brands_user_id_key UNIQUE (user_id)
);

-- Brand profiles table (extended brand information)
CREATE TABLE public.brand_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
    
    -- Brand assets
    logo_url VARCHAR(500),
    banner_image_url VARCHAR(500),
    brand_colors JSONB DEFAULT '[]'::jsonb,
    brand_fonts JSONB DEFAULT '[]'::jsonb,
    
    -- Brand guidelines
    brand_guidelines_url VARCHAR(500),
    content_guidelines TEXT,
    dos_and_donts JSONB DEFAULT '[]'::jsonb,
    
    -- Social media presence
    instagram_handle VARCHAR(100),
    twitter_handle VARCHAR(100),
    youtube_channel VARCHAR(255),
    tiktok_handle VARCHAR(100),
    linkedin_page VARCHAR(255),
    
    -- Media kit and resources
    media_kit_url VARCHAR(500),
    product_catalog_url VARCHAR(500),
    press_kit_url VARCHAR(500),
    
    -- Campaign preferences
    preferred_content_types JSONB DEFAULT '[]'::jsonb,
    preferred_posting_times JSONB DEFAULT '[]'::jsonb,
    content_approval_required BOOLEAN DEFAULT true,
    usage_rights_required BOOLEAN DEFAULT false,
    
    -- Performance tracking
    tracking_requirements JSONB DEFAULT '[]'::jsonb,
    kpi_priorities JSONB DEFAULT '[]'::jsonb,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT brand_profiles_brand_id_key UNIQUE (brand_id)
);

-- Create indexes for better performance
CREATE INDEX idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX idx_user_profiles_username ON public.user_profiles(username);
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_influencers_user_id ON public.influencers(user_id);
CREATE INDEX idx_influencers_primary_category ON public.influencers(primary_category);
CREATE INDEX idx_influencers_is_available ON public.influencers(is_available);
CREATE INDEX idx_brands_user_id ON public.brands(user_id);
CREATE INDEX idx_brands_primary_category ON public.brands(primary_category);
CREATE INDEX idx_brand_profiles_brand_id ON public.brand_profiles(brand_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view public profiles" ON public.user_profiles
    FOR SELECT USING (is_profile_public = true);

CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for influencers
CREATE POLICY "Anyone can view available influencers" ON public.influencers
    FOR SELECT USING (is_available = true);

CREATE POLICY "Influencers can manage own profile" ON public.influencers
    FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for brands
CREATE POLICY "Anyone can view verified brands" ON public.brands
    FOR SELECT USING (is_verified = true);

CREATE POLICY "Brands can manage own profile" ON public.brands
    FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for brand_profiles
CREATE POLICY "Brand profiles inherit brand policies" ON public.brand_profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.brands 
            WHERE brands.id = brand_profiles.brand_id 
            AND brands.user_id = auth.uid()
        )
    );

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER set_updated_at_user_profiles
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_influencers
    BEFORE UPDATE ON public.influencers
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_brands
    BEFORE UPDATE ON public.brands
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_brand_profiles
    BEFORE UPDATE ON public.brand_profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
