import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

const AuthTester = () => {
    const [testResults, setTestResults] = useState<string[]>([]);
    const { user, session, profile, loading } = useAuth();

    const addResult = (message: string) => {
        setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    };

    const testSupabaseConnection = async () => {
        addResult('Testing Supabase connection...');
        try {
            const { data, error } = await supabase.from('user_profiles').select('count').limit(1);
            if (error) {
                addResult(`❌ Supabase connection failed: ${error.message}`);
            } else {
                addResult('✅ Supabase connection successful');
            }
        } catch (err) {
            addResult(`❌ Supabase connection error: ${err.message}`);
        }
    };

    const testAuth = async () => {
        addResult('Testing auth state...');
        try {
            const { data, error } = await supabase.auth.getUser();
            if (error) {
                addResult(`❌ Auth error: ${error.message}`);
            } else if (data.user) {
                addResult(`✅ User authenticated: ${data.user.email}`);
            } else {
                addResult('ℹ️ No authenticated user');
            }
        } catch (err) {
            addResult(`❌ Auth test error: ${err.message}`);
        }
    };

    const testProfileQuery = async () => {
        if (!user) {
            addResult('❌ No user to test profile query');
            return;
        }

        addResult(`Testing profile query for user: ${user.id}`);
        try {
            const { data, error } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (error) {
                addResult(`❌ Profile query error: ${error.message} (Code: ${error.code})`);
            } else if (data) {
                addResult(`✅ Profile found: ${JSON.stringify(data, null, 2)}`);
            } else {
                addResult('ℹ️ No profile data returned');
            }
        } catch (err) {
            addResult(`❌ Profile query exception: ${err.message}`);
        }
    };

    const testGoogleAuth = async () => {
        addResult('Initiating Google OAuth...');
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`
                }
            });

            if (error) {
                addResult(`❌ Google OAuth error: ${error.message}`);
            } else {
                addResult('✅ Google OAuth initiated (redirecting...)');
            }
        } catch (err) {
            addResult(`❌ Google OAuth exception: ${err.message}`);
        }
    };

    const clearResults = () => {
        setTestResults([]);
    };

    if (!import.meta.env.DEV) {
        return null; // Only show in development
    }

    return (
        <div className="fixed bottom-4 left-4 z-50 max-w-md">
            <Card className="p-4 bg-background/95 backdrop-blur-sm border-2 border-blue-500/20">
                <h3 className="font-bold text-sm mb-3">Auth Tester</h3>

                <div className="space-y-2 mb-3">
                    <div className="text-xs">
                        <strong>Current State:</strong>
                    </div>
                    <div className="text-xs space-y-1 p-2 bg-muted rounded">
                        <div>Loading: {loading ? 'Yes' : 'No'}</div>
                        <div>User: {user ? `✅ ${user.email}` : '❌ None'}</div>
                        <div>Session: {session ? '✅ Active' : '❌ None'}</div>
                        <div>Profile: {profile ? `✅ ${profile.role || 'No role'}` : '❌ None'}</div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3">
                    <Button size="sm" onClick={testSupabaseConnection} className="text-xs">
                        Test DB
                    </Button>
                    <Button size="sm" onClick={testAuth} className="text-xs">
                        Test Auth
                    </Button>
                    <Button size="sm" onClick={testProfileQuery} className="text-xs">
                        Test Profile
                    </Button>
                    <Button size="sm" onClick={testGoogleAuth} className="text-xs">
                        Test Google
                    </Button>
                </div>

                <div className="flex gap-2 mb-3">
                    <Button size="sm" variant="outline" onClick={clearResults} className="text-xs">
                        Clear
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                            console.log('Full Auth State:', { user, session, profile, loading });
                            console.log('Environment:', {
                                SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
                                HAS_SUPABASE_KEY: !!import.meta.env.VITE_SUPABASE_ANON_KEY
                            });
                        }}
                        className="text-xs"
                    >
                        Log All
                    </Button>
                </div>

                {testResults.length > 0 && (
                    <div className="max-h-32 overflow-y-auto bg-black/5 p-2 rounded text-xs">
                        {testResults.map((result, i) => (
                            <div key={i} className="mb-1">{result}</div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
};

export default AuthTester;
