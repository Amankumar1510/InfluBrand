# Supabase Setup Guide for InfluBrand

This guide will walk you through setting up Supabase for the InfluBrand backend with Google OAuth authentication.

## Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- A Google Cloud Console account for OAuth setup

## Step 1: Create a Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. Choose your organization
4. Fill in project details:
   - **Name**: `influbrand`
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose the closest to your users
5. Click "Create new project"

## Step 2: Get Supabase Credentials

Once your project is created:

1. Go to **Settings** > **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://abcdefghijklmnop.supabase.co`)
   - **Project API Keys**:
     - `anon` `public` key (for client-side)
     - `service_role` `secret` key (for server-side)

3. Add these to your `.env` file:
```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

## Step 3: Set up Google OAuth

### 3.1 Configure Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable the Google+ API:
   - Go to **APIs & Services** > **Library**
   - Search for "Google+ API" and enable it
4. Create OAuth credentials:
   - Go to **APIs & Services** > **Credentials**
   - Click **Create Credentials** > **OAuth 2.0 Client IDs**
   - Choose **Web application**
   - Add authorized redirect URIs:
     ```
     https://your-project-id.supabase.co/auth/v1/callback
     ```
   - Save and copy the **Client ID** and **Client Secret**

### 3.2 Configure Supabase Authentication

1. In your Supabase dashboard, go to **Authentication** > **Providers**
2. Click on **Google** provider
3. Enable Google provider
4. Fill in:
   - **Client ID**: Your Google OAuth Client ID
   - **Client Secret**: Your Google OAuth Client Secret
5. Save the configuration

## Step 4: Set up Database Schema

1. Go to **SQL Editor** in your Supabase dashboard
2. Run the SQL scripts in order:

### 4.1 Run Initial Schema
Copy and paste the content from `sql/01_initial_schema.sql` and execute it.

### 4.2 Run Authentication Functions
Copy and paste the content from `sql/02_auth_functions.sql` and execute it.

## Step 5: Configure Row Level Security (RLS)

The SQL scripts already include RLS policies, but here's what they do:

- **User Profiles**: Users can only view public profiles or their own
- **Influencers**: Only available influencers are visible to everyone
- **Brands**: Only verified brands are visible to everyone
- **Own Data**: Users can always manage their own data

## Step 6: Test the Setup

### 6.1 Test Database Connection

Run this query in the SQL Editor to verify the schema:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE';
```

You should see tables like:
- `user_profiles`
- `influencers`
- `brands`
- `brand_profiles`

### 6.2 Test Authentication

1. Start your FastAPI server:
   ```bash
   uvicorn app.main:app --reload
   ```

2. Test the Google auth endpoint:
   ```bash
   curl -X POST "http://localhost:8000/api/v1/auth/google" \
        -H "Content-Type: application/json" \
        -d '{"redirect_url": "http://localhost:3000/auth/callback"}'
   ```

## Step 7: Frontend Integration

### 7.1 Install Supabase Client (Frontend)

In your React frontend:
```bash
npm install @supabase/supabase-js
```

### 7.2 Create Supabase Client (Frontend)

Create `src/lib/supabase.js`:
```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://your-project-id.supabase.co'
const supabaseAnonKey = 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### 7.3 Google Sign-In Component

```javascript
import { supabase } from '../lib/supabase'

const GoogleSignIn = () => {
  const handleGoogleSignIn = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    
    if (error) {
      console.error('Error:', error)
    }
  }

  return (
    <button onClick={handleGoogleSignIn}>
      Sign in with Google
    </button>
  )
}
```

### 7.4 Auth Callback Handler

Create `src/pages/AuthCallback.js`:
```javascript
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const AuthCallback = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Auth error:', error)
        navigate('/signin')
        return
      }

      if (data.session) {
        // Send tokens to your backend
        const response = await fetch('/api/v1/auth/callback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token
          })
        })

        const result = await response.json()
        
        // Store tokens and redirect
        localStorage.setItem('access_token', result.access_token)
        localStorage.setItem('refresh_token', result.refresh_token)
        
        // Check if profile is complete
        if (result.user.profile) {
          navigate('/dashboard')
        } else {
          navigate('/onboarding')
        }
      }
    }

    handleAuthCallback()
  }, [navigate])

  return <div>Processing authentication...</div>
}
```

## Step 8: Environment Variables Summary

Make sure your `.env` file contains:

```env
# Supabase
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Server
HOST=0.0.0.0
PORT=8000
ALLOWED_HOSTS=["localhost", "127.0.0.1", "0.0.0.0", "yourdomain.com"]
```

## Step 9: Testing Authentication Flow

### 9.1 Backend Endpoints

Your backend now provides these auth endpoints:

- `POST /api/v1/auth/google` - Initiate Google OAuth
- `POST /api/v1/auth/callback` - Handle OAuth callback
- `GET /api/v1/auth/me` - Get current user profile
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/signout` - Sign out user
- `POST /api/v1/auth/complete-profile` - Complete user profile

### 9.2 Test with cURL

```bash
# Test auth endpoints
curl -X GET "http://localhost:8000/api/v1/auth/me" \
     -H "Authorization: Bearer your-access-token"
```

## Troubleshooting

### Common Issues

1. **"Invalid redirect URL"**
   - Make sure the redirect URL in Google Console matches exactly
   - Check that the URL is added to authorized redirect URIs

2. **"RLS policy violation"**
   - Check that RLS policies are correctly set up
   - Verify user has proper permissions

3. **"Function does not exist"**
   - Make sure all SQL scripts were executed successfully
   - Check for any SQL syntax errors

4. **"Invalid JWT"**
   - Verify Supabase keys are correct
   - Check token expiration

### Debug Tips

1. Check Supabase logs in the dashboard under **Logs**
2. Use the SQL Editor to test database queries
3. Enable debug logging in your FastAPI app
4. Test authentication flow step by step

## Next Steps

After authentication is working:

1. Test user profile creation
2. Implement role-based access (influencer/brand)
3. Add profile completion flow
4. Set up social media integration
5. Implement campaign management

## Security Considerations

1. **Never expose service role key** on the client side
2. **Use RLS policies** to protect sensitive data
3. **Validate tokens** on every protected endpoint
4. **Implement rate limiting** for auth endpoints
5. **Use HTTPS** in production

This setup provides a secure, scalable authentication system using Supabase with Google OAuth integration.
