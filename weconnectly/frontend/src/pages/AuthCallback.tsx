import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Card } from '../components/ui/card'
import { Loader2 } from 'lucide-react'
import AuthDebug from '../components/AuthDebug'

const AuthCallback = () => {
    const navigate = useNavigate()
    const [status, setStatus] = useState('Processing authentication...')

    useEffect(() => {
        const handleAuthCallback = async () => {
            try {
                // Get the session from the URL
                const { data, error } = await supabase.auth.getSession()

                if (error) {
                    console.error('Auth callback error:', error)
                    setStatus('Authentication failed. Redirecting...')
                    setTimeout(() => navigate('/signin'), 2000)
                    return
                }

                if (data.session) {
                    setStatus('Authentication successful!')
                    console.log('Session data:', data.session)
                    console.log('User ID:', data.session.user.id)

                    // Wait a bit for the trigger to complete, then check profile
                    setStatus('Checking your profile...')
                    await new Promise(resolve => setTimeout(resolve, 2000)) // Wait 2 seconds

                    // Check if user has a complete profile using direct table query
                    const { data: profileData, error: profileError } = await supabase
                        .from('user_profiles')
                        .select('*')
                        .eq('user_id', data.session.user.id)
                        .single()

                    console.log('Profile data:', profileData)
                    console.log('Profile error:', profileError)

                    if (profileError && profileError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
                        console.error('Error fetching profile:', profileError)
                    }

                    // If no profile exists or profile is incomplete, go to onboarding
                    if (!profileData || !profileData.role) {
                        console.log('No profile found or incomplete, redirecting to onboarding')

                        // Try to create a basic profile if it doesn't exist
                        if (!profileData) {
                            console.log('Creating basic profile from user metadata')
                            try {
                                const userMetadata = data.session.user.user_metadata;
                                const basicProfile = {
                                    user_id: data.session.user.id,
                                    username: userMetadata?.preferred_username || userMetadata?.name || '',
                                    first_name: userMetadata?.given_name || userMetadata?.full_name?.split(' ')[0] || '',
                                    last_name: userMetadata?.family_name || userMetadata?.full_name?.split(' ').slice(1).join(' ') || '',
                                    avatar_url: userMetadata?.avatar_url || userMetadata?.picture || null,
                                    role: 'influencer' // Default role, user can change in onboarding
                                };

                                const { error: createError } = await supabase
                                    .from('user_profiles')
                                    .upsert(basicProfile, { onConflict: 'user_id' });

                                if (createError) {
                                    console.error('Error creating basic profile:', createError);
                                }
                            } catch (createProfileError) {
                                console.error('Failed to create basic profile:', createProfileError);
                            }
                        }

                        setStatus('Setting up your profile...')
                        setTimeout(() => navigate('/onboarding'), 1000)
                    } else {
                        // Profile exists, redirect based on role
                        console.log('Profile found with role:', profileData.role)
                        setStatus('Welcome back!')
                        setTimeout(() => {
                            if (profileData.role === 'influencer') {
                                navigate('/brand-discovery')
                            } else if (profileData.role === 'brand') {
                                navigate('/influencer-discovery')
                            } else {
                                navigate('/')
                            }
                        }, 1000)
                    }
                } else {
                    setStatus('No session found. Redirecting...')
                    setTimeout(() => navigate('/signin'), 2000)
                }
            } catch (error) {
                console.error('Unexpected error in auth callback:', error)
                setStatus('An unexpected error occurred. Redirecting...')
                setTimeout(() => navigate('/signin'), 2000)
            }
        }

        handleAuthCallback()
    }, [navigate])

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4">
            <AuthDebug />
            <Card className="p-8 max-w-md w-full text-center shadow-glow border-0 bg-card/80 backdrop-blur-sm">
                <div className="flex flex-col items-center space-y-4">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <h2 className="text-xl font-poppins font-semibold">Almost there!</h2>
                    <p className="text-muted-foreground">{status}</p>
                </div>
            </Card>
        </div>
    )
}

export default AuthCallback
