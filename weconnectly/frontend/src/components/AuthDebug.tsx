import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const AuthDebug = () => {
    const { user, session, profile, loading } = useAuth();

    if (!import.meta.env.DEV) {
        return null; // Only show in development
    }

    return (
        <div className="fixed top-4 right-4 z-50">
            <Card className="p-4 max-w-sm bg-background/95 backdrop-blur-sm border-2 border-primary/20">
                <h3 className="font-bold text-sm mb-2">Auth Debug</h3>
                <div className="text-xs space-y-1">
                    <div>Loading: {loading ? "Yes" : "No"}</div>
                    <div>User: {user ? "✅ Logged in" : "❌ Not logged in"}</div>
                    <div>Session: {session ? "✅ Active" : "❌ None"}</div>
                    <div>Profile: {profile ? "✅ Exists" : "❌ Missing"}</div>
                    {profile && (
                        <div className="mt-2 p-2 bg-muted rounded text-xs">
                            <div>Role: {profile.role || "Not set"}</div>
                            <div>Name: {profile.first_name || "Not set"}</div>
                            <div>Username: {profile.username || "Not set"}</div>
                        </div>
                    )}
                    {user && (
                        <div className="mt-2 p-2 bg-muted rounded text-xs">
                            <div>User ID: {user.id}</div>
                            <div>Email: {user.email}</div>
                        </div>
                    )}
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 w-full text-xs"
                    onClick={() => {
                        console.log('Auth State:', { user, session, profile, loading });
                    }}
                >
                    Log State
                </Button>
            </Card>
        </div>
    );
};

export default AuthDebug;
