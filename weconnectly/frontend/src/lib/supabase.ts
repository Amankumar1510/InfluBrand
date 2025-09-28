import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

// Check if Supabase is properly configured
if (supabaseUrl === 'https://your-project.supabase.co' || supabaseAnonKey === 'your-anon-key') {
    console.warn('⚠️ Supabase not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env.local file')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    }
})

// Types for our database
export interface UserProfile {
    id: string
    user_id: string
    username?: string
    first_name?: string
    last_name?: string
    role: 'influencer' | 'brand' | 'admin'
    bio?: string
    website?: string
    location?: string
    avatar_url?: string
    cover_image_url?: string
    is_profile_public: boolean
    is_verified: boolean
    created_at: string
    updated_at: string
}

export interface InfluencerProfile {
    id: string
    user_id: string
    display_name?: string
    tagline?: string
    primary_category: string
    secondary_categories?: string[]
    content_types?: string[]
    languages?: string[]
    collaboration_types?: string[]
    min_rate?: number
    max_rate?: number
    rate_currency: string
    years_experience?: number
    total_collaborations: number
    is_available: boolean
    booking_lead_time_days: number
    is_verified: boolean
    quality_score?: number
    created_at: string
    updated_at: string
}

export interface BrandProfile {
    id: string
    user_id: string
    company_name: string
    brand_name?: string
    tagline?: string
    description?: string
    primary_category: string
    secondary_categories?: string[]
    company_size?: string
    company_website?: string
    company_email?: string
    company_phone?: string
    headquarters_location?: string
    operating_regions?: string[]
    brand_values?: string[]
    target_demographics?: any
    brand_voice?: string
    preferred_collaboration_types?: string[]
    typical_campaign_budget_min?: number
    typical_campaign_budget_max?: number
    budget_currency: string
    is_verified: boolean
    monthly_marketing_budget?: number
    previous_influencer_campaigns: number
    created_at: string
    updated_at: string
}
