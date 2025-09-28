-- Authentication functions for Supabase
-- Run this script after the initial schema

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_role_from_metadata user_role;
BEGIN
    -- Extract role from user metadata (set during registration)
    user_role_from_metadata := COALESCE(
        (NEW.raw_user_meta_data->>'role')::user_role,
        'influencer'::user_role
    );
    
    -- Create user profile
    INSERT INTO public.user_profiles (
        user_id,
        username,
        first_name,
        last_name,
        role,
        avatar_url
    ) VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'username',
        NEW.raw_user_meta_data->>'first_name',
        NEW.raw_user_meta_data->>'last_name',
        user_role_from_metadata,
        NEW.raw_user_meta_data->>'avatar_url'
    );
    
    -- Create role-specific profile
    IF user_role_from_metadata = 'influencer' THEN
        INSERT INTO public.influencers (
            user_id,
            display_name,
            primary_category
        ) VALUES (
            NEW.id,
            COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'first_name'),
            COALESCE(
                (NEW.raw_user_meta_data->>'primary_category')::content_category,
                'other'::content_category
            )
        );
    ELSIF user_role_from_metadata = 'brand' THEN
        INSERT INTO public.brands (
            user_id,
            company_name,
            primary_category
        ) VALUES (
            NEW.id,
            COALESCE(NEW.raw_user_meta_data->>'company_name', 'Unnamed Company'),
            COALESCE(
                (NEW.raw_user_meta_data->>'primary_category')::brand_category,
                'other'::brand_category
            )
        );
        
        -- Create brand profile
        INSERT INTO public.brand_profiles (brand_id)
        SELECT id FROM public.brands WHERE user_id = NEW.id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to get user profile with role-specific data
CREATE OR REPLACE FUNCTION public.get_user_profile(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
    profile_data JSON;
    user_profile RECORD;
BEGIN
    -- Get basic user profile
    SELECT * INTO user_profile
    FROM public.user_profiles
    WHERE user_id = user_uuid;
    
    IF NOT FOUND THEN
        RETURN NULL;
    END IF;
    
    -- Build base profile data
    profile_data := json_build_object(
        'id', user_profile.id,
        'user_id', user_profile.user_id,
        'username', user_profile.username,
        'first_name', user_profile.first_name,
        'last_name', user_profile.last_name,
        'role', user_profile.role,
        'bio', user_profile.bio,
        'website', user_profile.website,
        'location', user_profile.location,
        'avatar_url', user_profile.avatar_url,
        'cover_image_url', user_profile.cover_image_url,
        'is_profile_public', user_profile.is_profile_public,
        'is_verified', user_profile.is_verified,
        'created_at', user_profile.created_at,
        'updated_at', user_profile.updated_at
    );
    
    -- Add role-specific data
    IF user_profile.role = 'influencer' THEN
        profile_data := profile_data || json_build_object(
            'influencer_data',
            (SELECT row_to_json(i) FROM public.influencers i WHERE i.user_id = user_uuid)
        );
    ELSIF user_profile.role = 'brand' THEN
        profile_data := profile_data || json_build_object(
            'brand_data',
            (SELECT row_to_json(b) FROM public.brands b WHERE b.user_id = user_uuid)
        );
        profile_data := profile_data || json_build_object(
            'brand_profile_data',
            (SELECT row_to_json(bp) FROM public.brand_profiles bp 
             JOIN public.brands b ON bp.brand_id = b.id 
             WHERE b.user_id = user_uuid)
        );
    END IF;
    
    RETURN profile_data;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update user profile
CREATE OR REPLACE FUNCTION public.update_user_profile(
    user_uuid UUID,
    profile_updates JSON
)
RETURNS JSON AS $$
DECLARE
    updated_profile JSON;
BEGIN
    -- Update user_profiles table
    UPDATE public.user_profiles SET
        username = COALESCE((profile_updates->>'username')::VARCHAR(50), username),
        first_name = COALESCE(profile_updates->>'first_name', first_name),
        last_name = COALESCE(profile_updates->>'last_name', last_name),
        phone = COALESCE(profile_updates->>'phone', phone),
        bio = COALESCE(profile_updates->>'bio', bio),
        website = COALESCE(profile_updates->>'website', website),
        location = COALESCE(profile_updates->>'location', location),
        avatar_url = COALESCE(profile_updates->>'avatar_url', avatar_url),
        cover_image_url = COALESCE(profile_updates->>'cover_image_url', cover_image_url),
        is_profile_public = COALESCE((profile_updates->>'is_profile_public')::BOOLEAN, is_profile_public),
        show_email = COALESCE((profile_updates->>'show_email')::BOOLEAN, show_email),
        show_phone = COALESCE((profile_updates->>'show_phone')::BOOLEAN, show_phone)
    WHERE user_id = user_uuid;
    
    -- Get updated profile
    SELECT public.get_user_profile(user_uuid) INTO updated_profile;
    
    RETURN updated_profile;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to search influencers
CREATE OR REPLACE FUNCTION public.search_influencers(
    search_query TEXT DEFAULT '',
    category_filter content_category DEFAULT NULL,
    min_followers INTEGER DEFAULT NULL,
    max_followers INTEGER DEFAULT NULL,
    location_filter TEXT DEFAULT NULL,
    is_available_filter BOOLEAN DEFAULT true,
    limit_count INTEGER DEFAULT 20,
    offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    user_id UUID,
    display_name VARCHAR(100),
    username VARCHAR(50),
    avatar_url VARCHAR(500),
    primary_category content_category,
    tagline VARCHAR(255),
    location VARCHAR(255),
    is_verified BOOLEAN,
    is_available BOOLEAN,
    total_collaborations INTEGER,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        i.id,
        i.user_id,
        i.display_name,
        up.username,
        up.avatar_url,
        i.primary_category,
        i.tagline,
        up.location,
        i.is_verified,
        i.is_available,
        i.total_collaborations,
        i.created_at
    FROM public.influencers i
    JOIN public.user_profiles up ON i.user_id = up.user_id
    WHERE 
        (search_query = '' OR 
         i.display_name ILIKE '%' || search_query || '%' OR
         up.username ILIKE '%' || search_query || '%' OR
         up.first_name ILIKE '%' || search_query || '%' OR
         up.last_name ILIKE '%' || search_query || '%')
        AND (category_filter IS NULL OR i.primary_category = category_filter)
        AND (location_filter IS NULL OR up.location ILIKE '%' || location_filter || '%')
        AND (is_available_filter IS NULL OR i.is_available = is_available_filter)
        AND up.is_profile_public = true
    ORDER BY 
        i.is_verified DESC,
        i.total_collaborations DESC,
        i.created_at DESC
    LIMIT limit_count
    OFFSET offset_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to search brands
CREATE OR REPLACE FUNCTION public.search_brands(
    search_query TEXT DEFAULT '',
    category_filter brand_category DEFAULT NULL,
    company_size_filter company_size DEFAULT NULL,
    location_filter TEXT DEFAULT NULL,
    limit_count INTEGER DEFAULT 20,
    offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    user_id UUID,
    company_name VARCHAR(255),
    brand_name VARCHAR(255),
    tagline VARCHAR(255),
    primary_category brand_category,
    company_size company_size,
    headquarters_location VARCHAR(255),
    is_verified BOOLEAN,
    logo_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        b.id,
        b.user_id,
        b.company_name,
        b.brand_name,
        b.tagline,
        b.primary_category,
        b.company_size,
        b.headquarters_location,
        b.is_verified,
        bp.logo_url,
        b.created_at
    FROM public.brands b
    LEFT JOIN public.brand_profiles bp ON b.id = bp.brand_id
    JOIN public.user_profiles up ON b.user_id = up.user_id
    WHERE 
        (search_query = '' OR 
         b.company_name ILIKE '%' || search_query || '%' OR
         b.brand_name ILIKE '%' || search_query || '%' OR
         b.tagline ILIKE '%' || search_query || '%')
        AND (category_filter IS NULL OR b.primary_category = category_filter)
        AND (company_size_filter IS NULL OR b.company_size = company_size_filter)
        AND (location_filter IS NULL OR b.headquarters_location ILIKE '%' || location_filter || '%')
        AND up.is_profile_public = true
    ORDER BY 
        b.is_verified DESC,
        b.previous_influencer_campaigns DESC,
        b.created_at DESC
    LIMIT limit_count
    OFFSET offset_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
