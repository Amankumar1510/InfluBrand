import { supabase } from '@/lib/supabase';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Simple API service for profile operations
export const profileApi = {
    // Upload image to Supabase Storage
    uploadImage: async (file: File): Promise<string> => {
        try {
            // Generate unique filename with user folder structure
            const fileExt = file.name.split('.').pop();
            const { data: { user } } = await supabase.auth.getUser();
            const userId = user?.id || 'anonymous';
            const fileName = `${userId}/${Date.now()}.${fileExt}`;

            // First, try to create the bucket if it doesn't exist
            try {
                await supabase.storage.createBucket('profile-images', {
                    public: true,
                    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
                    fileSizeLimit: 5242880 // 5MB
                });
                console.log('Created profile-images bucket');
            } catch (bucketError: any) {
                // Bucket might already exist, that's okay
                if (!bucketError.message?.includes('already exists') && !bucketError.message?.includes('Duplicate')) {
                    console.warn('Bucket creation warning:', bucketError);
                }
            }

            // Upload to Supabase Storage
            const { data, error } = await supabase.storage
                .from('profile-images')
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) {
                console.error('Storage upload error:', error);

                // If bucket still doesn't exist, provide helpful error
                if (error.message?.includes('Bucket not found')) {
                    throw new Error('Storage not configured. Please run the storage setup SQL script first.');
                }

                throw error;
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('profile-images')
                .getPublicUrl(fileName);

            return publicUrl;
        } catch (error: any) {
            console.error('Image upload error:', error);
            throw new Error(`Failed to upload image: ${error.message || 'Unknown error'}`);
        }
    },

    // Create influencer profile via backend API
    createInfluencerProfile: async (profileData: {
        username: string;
        display_name: string;
        primary_platform: string;
        platform_username: string;
        categories: string[];
        bio: string;
        profile_picture_url?: string;
    }) => {
        try {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session?.access_token) {
                throw new Error('No authentication token');
            }

            const response = await fetch(`${API_BASE_URL}/api/v1/profiles/influencer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`,
                },
                body: JSON.stringify(profileData),
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.detail || 'Failed to create influencer profile');
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // Create brand profile via backend API
    createBrandProfile: async (profileData: {
        username: string;
        brand_name: string;
        description: string;
        industry_categories: string[];
        website?: string;
        logo_url?: string;
        company_email?: string;
    }) => {
        try {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session?.access_token) {
                throw new Error('No authentication token');
            }

            const response = await fetch(`${API_BASE_URL}/api/v1/profiles/brand`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`,
                },
                body: JSON.stringify(profileData),
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.detail || 'Failed to create brand profile');
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // Get detailed influencer profile
    getInfluencerProfile: async (userId: string) => {
        try {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session?.access_token) {
                throw new Error('No authentication token');
            }

            const response = await fetch(`${API_BASE_URL}/api/v1/profiles/influencer/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${session.access_token}`,
                },
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.detail || 'Failed to get influencer profile');
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // Update detailed influencer profile
    updateInfluencerProfile: async (userId: string, profileData: any) => {
        try {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session?.access_token) {
                throw new Error('No authentication token');
            }

            const response = await fetch(`${API_BASE_URL}/api/v1/profiles/influencer/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`,
                },
                body: JSON.stringify(profileData),
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.detail || 'Failed to update influencer profile');
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // Get profile completion percentage
    getProfileCompletion: async (userId: string) => {
        try {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session?.access_token) {
                throw new Error('No authentication token');
            }

            const response = await fetch(`${API_BASE_URL}/api/v1/profiles/profile-completion/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${session.access_token}`,
                },
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.detail || 'Failed to get profile completion');
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // For now, fallback to direct Supabase calls
    createProfileDirect: async (formData: any, user: any) => {
        try {
            // Update user profile
            const profileData = {
                username: formData.username,
                role: formData.role,
                avatar_url: formData.profile_picture || formData.logo || null,
                first_name: user.user_metadata?.given_name || user.user_metadata?.full_name?.split(' ')[0] || '',
                last_name: user.user_metadata?.family_name || user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || ''
            };

            const { error: profileError } = await supabase
                .from('user_profiles')
                .upsert({
                    user_id: user.id,
                    ...profileData
                }, {
                    onConflict: 'user_id'
                });

            if (profileError) {
                throw profileError;
            }

            // Create role-specific profile
            if (formData.role === 'influencer') {
                const influencerData = {
                    user_id: user.id,
                    display_name: formData.display_name || user.user_metadata?.full_name || user.user_metadata?.name || '',
                    primary_category: 'other',
                    secondary_categories: formData.categories || [],
                    content_types: [formData.primary_platform || 'other'],
                    languages: ['en'],
                    collaboration_types: [],
                    is_available: true,
                    booking_lead_time_days: 7
                };

                const { error: influencerError } = await supabase
                    .from('influencers')
                    .upsert(influencerData, {
                        onConflict: 'user_id'
                    });

                if (influencerError) {
                    throw influencerError;
                }
            } else if (formData.role === 'brand') {
                const brandData = {
                    user_id: user.id,
                    company_name: formData.brand_name || 'Unnamed Company',
                    brand_name: formData.brand_name || null,
                    description: formData.description || null,
                    primary_category: 'other',
                    secondary_categories: formData.industry_categories || [],
                    company_website: formData.website || null,
                    company_email: formData.company_email || user.email || null,
                    is_verified: false,
                    previous_influencer_campaigns: 0
                };

                const { error: brandError } = await supabase
                    .from('brands')
                    .upsert(brandData, {
                        onConflict: 'user_id'
                    });

                if (brandError) {
                    throw brandError;
                }
            }

            return { success: true };
        } catch (error) {
            console.error('Direct profile creation error:', error);
            throw error;
        }
    }
};
