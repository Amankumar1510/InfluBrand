import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase, UserProfile } from '../lib/supabase'

interface AuthContextType {
    user: User | null
    session: Session | null
    profile: UserProfile | null
    loading: boolean
    signInWithGoogle: () => Promise<void>
    signOut: () => Promise<void>
    refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Get initial session
        const getInitialSession = async () => {
            const { data: { session }, error } = await supabase.auth.getSession()

            if (error) {
                console.error('Error getting session:', error)
            } else {
                setSession(session)
                setUser(session?.user ?? null)

                if (session?.user) {
                    await fetchUserProfile(session.user.id)
                }
            }

            setLoading(false)
        }

        getInitialSession()

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                console.log('Auth state changed:', event, session)

                setSession(session)
                setUser(session?.user ?? null)

                if (session?.user && event === 'SIGNED_IN') {
                    await fetchUserProfile(session.user.id)
                } else if (event === 'SIGNED_OUT') {
                    setProfile(null)
                }

                setLoading(false)
            }
        )

        return () => subscription.unsubscribe()
    }, [])

    const fetchUserProfile = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .rpc('get_user_profile', { user_uuid: userId })

            if (error) {
                console.error('Error fetching profile:', error)
                return
            }

            if (data) {
                setProfile(data)
            }
        } catch (error) {
            console.error('Error in fetchUserProfile:', error)
        }
    }

    const signInWithGoogle = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`
                }
            })

            if (error) {
                console.error('Error signing in with Google:', error)
                throw error
            }
        } catch (error) {
            console.error('Error in signInWithGoogle:', error)
            throw error
        }
    }

    const signOut = async () => {
        try {
            const { error } = await supabase.auth.signOut()

            if (error) {
                console.error('Error signing out:', error)
                throw error
            }

            setUser(null)
            setSession(null)
            setProfile(null)
        } catch (error) {
            console.error('Error in signOut:', error)
            throw error
        }
    }

    const refreshProfile = async () => {
        if (user) {
            await fetchUserProfile(user.id)
        }
    }

    const value: AuthContextType = {
        user,
        session,
        profile,
        loading,
        signInWithGoogle,
        signOut,
        refreshProfile
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
