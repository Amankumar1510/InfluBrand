# Debug Authentication Flow

## Issue: After signing in, user returns to sign-in page instead of onboarding

## Debugging Steps

### 1. **Check Browser Console**
Open browser DevTools (F12) and check for:
- Console logs from AuthCallback
- Console logs from SignIn component
- Any JavaScript errors
- Network requests to Supabase

### 2. **Expected Flow**
```
SignIn Page → Google OAuth → Supabase → AuthCallback → Onboarding
```

### 3. **Current Debugging Features Added**

#### **AuthDebug Component**
- Shows in top-right corner (development only)
- Displays current auth state
- Click "Log State" to see full details in console

#### **Console Logging**
- AuthCallback now logs all steps
- SignIn component logs authentication checks
- Profile creation attempts are logged

### 4. **Test Steps**

1. **Clear Browser Data**
   ```bash
   - Clear localStorage
   - Clear sessionStorage  
   - Clear cookies for localhost
   ```

2. **Start Frontend**
   ```bash
   cd weconnectly/frontend
   npm run dev
   ```

3. **Test Authentication**
   - Go to `/signin`
   - Check AuthDebug component shows:
     - Loading: No
     - User: ❌ Not logged in
     - Session: ❌ None
     - Profile: ❌ Missing
   
4. **Click "Continue with Google"**
   - Should redirect to Google OAuth
   - After Google auth, should redirect to `/auth/callback`

5. **Monitor AuthCallback**
   - Check console for logs:
     - "Session data: ..."
     - "User ID: ..."
     - "Profile data: ..."
     - Redirect decision logs

### 5. **Common Issues & Solutions**

#### **Issue: Stuck on SignIn page**
**Possible Causes:**
- OAuth redirect not working
- Session not being created
- AuthContext not updating

**Debug:**
```javascript
// In browser console
console.log('Current URL:', window.location.href);
console.log('Supabase session:', await supabase.auth.getSession());
```

#### **Issue: AuthCallback not working**
**Possible Causes:**
- Route not configured
- Session not found
- Profile creation failing

**Debug:**
- Check if `/auth/callback` route loads
- Check console for "Session data" logs
- Verify Supabase project configuration

#### **Issue: Profile not created**
**Possible Causes:**
- Database trigger not working
- RLS policies blocking access
- SQL function errors

**Debug:**
```sql
-- Check if user exists in auth.users
SELECT * FROM auth.users ORDER BY created_at DESC LIMIT 5;

-- Check if profile was created
SELECT * FROM public.user_profiles ORDER BY created_at DESC LIMIT 5;

-- Test the function manually
SELECT public.get_user_profile('USER_ID_HERE'::uuid);
```

### 6. **Environment Checklist**

#### **Frontend Environment**
- [ ] `VITE_SUPABASE_URL` is set correctly
- [ ] `VITE_SUPABASE_ANON_KEY` is set correctly
- [ ] No console errors on page load

#### **Supabase Configuration**
- [ ] Google OAuth provider is enabled
- [ ] Redirect URLs include `http://localhost:5173/auth/callback`
- [ ] RLS is enabled on tables
- [ ] Database triggers are active

### 7. **Manual Testing Commands**

#### **Test Supabase Connection**
```javascript
// In browser console
import { supabase } from './src/lib/supabase';
const { data, error } = await supabase.auth.getUser();
console.log('Current user:', data, error);
```

#### **Test Profile Function**
```javascript
// After authentication
const { data, error } = await supabase.rpc('get_user_profile', { 
  user_uuid: 'USER_ID_HERE' 
});
console.log('Profile:', data, error);
```

### 8. **Expected Console Output**

#### **Successful Flow:**
```
SignIn: User already authenticated: {user object}
AuthCallback: Session data: {session object}
AuthCallback: User ID: uuid-string
AuthCallback: Profile data: null (first time)
AuthCallback: No profile found, creating basic profile
AuthCallback: No profile found or incomplete, redirecting to onboarding
```

#### **Failed Flow:**
```
SignIn: No user found, showing sign-in form
AuthCallback: Authentication failed or No session found
```

### 9. **Quick Fixes to Try**

1. **Clear All Browser Data**
2. **Restart Development Server**
3. **Check Supabase Dashboard for recent auth events**
4. **Verify environment variables are loaded**
5. **Test with different browser/incognito mode**

### 10. **If Still Not Working**

1. **Check Supabase Logs**
   - Go to Supabase Dashboard
   - Check Auth logs
   - Look for failed requests

2. **Simplify the Flow**
   - Temporarily bypass profile check
   - Force redirect to onboarding
   - Test each step individually

3. **Database Direct Check**
   ```sql
   -- Check if trigger is working
   SELECT * FROM auth.users WHERE created_at > NOW() - INTERVAL '1 hour';
   SELECT * FROM user_profiles WHERE created_at > NOW() - INTERVAL '1 hour';
   ```

The debugging components will help identify exactly where the flow is breaking!
