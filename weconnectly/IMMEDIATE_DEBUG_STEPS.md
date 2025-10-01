# 🔍 Immediate Debug Steps - Authentication Issue

## 🎯 **Current Issue**
- Users can sign in with Google but aren't being redirected to onboarding
- Need to verify if users are being created in Supabase
- Need to check if the authentication flow is working properly

## 🛠️ **Debug Tools Added**

### **1. AuthTester Component (Bottom-left)**
- **Test DB**: Check Supabase database connection
- **Test Auth**: Check authentication state
- **Test Profile**: Query user profile from database
- **Test Google**: Test Google OAuth flow
- **Log All**: Log complete state to console

### **2. AuthDebug Component (Top-right)**
- Shows real-time authentication state
- Displays user, session, and profile status
- Click "Log State" to see full details

### **3. Debug Buttons (SignIn page)**
- **Test Onboarding**: Direct navigation to onboarding
- **Test Callback**: Direct navigation to auth callback

## 📋 **Step-by-Step Testing**

### **Step 1: Check Configuration**
1. Open `/signin` page
2. Look at AuthTester (bottom-left)
3. Click **"Test DB"** - Should show "✅ Supabase connection successful"
4. If failed, check your `.env.local` file configuration

### **Step 2: Test Google OAuth**
1. Click **"Test Google"** in AuthTester
2. Should redirect to Google OAuth
3. If it stays on same page, there's an OAuth configuration issue

### **Step 3: Manual Authentication Test**
1. Try clicking **"Continue with Google"** (main button)
2. Complete Google authentication
3. Check browser console for logs
4. Should see logs from AuthCallback component

### **Step 4: Check Database**
1. After Google auth, click **"Test Profile"** in AuthTester
2. Should show either:
   - "✅ Profile found: {profile data}"
   - "❌ Profile query error: no rows returned"

### **Step 5: Manual Navigation Test**
1. Click **"Test Onboarding"** button
2. Should navigate to onboarding page
3. If this works, the issue is in the authentication flow

## 🔍 **What to Look For**

### **In Browser Console:**
```javascript
// Successful flow should show:
"Auth state changed: SIGNED_IN {session object}"
"Session data: {session object}"
"User ID: uuid-string"
"Profile data: null or {profile object}"
"No profile found or incomplete, redirecting to onboarding"
```

### **In Supabase Dashboard:**
1. Go to **Authentication** → **Users**
2. Should see new users after Google OAuth
3. If no users appear, Google OAuth isn't configured correctly

### **In Database:**
1. Go to **Table Editor** → **user_profiles**
2. Should see profile records for authenticated users
3. If no profiles, database trigger isn't working

## 🚨 **Common Issues & Solutions**

### **Issue: "❌ Supabase connection failed"**
**Solution:**
1. Check `.env.local` file exists in frontend folder
2. Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
3. Restart development server: `npm run dev`

### **Issue: Google OAuth doesn't work**
**Solution:**
1. Check Supabase Dashboard → Authentication → Providers
2. Ensure Google provider is enabled
3. Verify redirect URLs include `http://localhost:5173/auth/callback`
4. Check Google Cloud Console OAuth configuration

### **Issue: Users created but no profiles**
**Solution:**
1. Check if database trigger `handle_new_user` exists
2. Run the SQL scripts from `backend/sql/` in Supabase SQL Editor
3. Check RLS policies are properly configured

### **Issue: Profile query returns "no rows"**
**Solution:**
1. This is expected for new users
2. AuthCallback should create basic profile automatically
3. Check AuthCallback console logs for profile creation attempts

## 🧪 **Quick Tests**

### **Test 1: Environment Check**
```javascript
// In browser console
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Has Supabase Key:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
```

### **Test 2: Direct Supabase Test**
```javascript
// In browser console
const { data, error } = await supabase.auth.getUser();
console.log('Current user:', data, error);
```

### **Test 3: Manual Profile Creation**
```javascript
// In browser console (after authentication)
const { data, error } = await supabase.from('user_profiles').insert({
  user_id: 'USER_ID_HERE',
  username: 'test_user',
  first_name: 'Test',
  last_name: 'User',
  role: 'influencer'
});
console.log('Profile creation:', data, error);
```

## 🎯 **Expected Results**

### **Working Flow:**
1. **Test DB**: ✅ Connection successful
2. **Google OAuth**: Redirects to Google → Returns to `/auth/callback`
3. **AuthCallback**: Creates user profile → Redirects to `/onboarding`
4. **Onboarding**: Form loads correctly

### **Current State Analysis:**
Use the debug tools to identify exactly where the flow is breaking:
- ❌ Database connection issue → Fix environment
- ❌ OAuth redirect issue → Fix Google configuration  
- ❌ Profile creation issue → Fix database setup
- ❌ Navigation issue → Fix routing logic

## 📞 **Next Steps**
1. Run through all tests systematically
2. Report exact error messages from console
3. Check Supabase dashboard for user creation
4. Verify database schema is properly set up

The debug tools will show exactly what's working and what's not!
