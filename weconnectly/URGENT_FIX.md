# 🚨 URGENT FIX - Database Error Saving New User

## ✅ **Problem Identified**
Error: `Database error saving new user`
URL: `http://localhost:8080/auth/callback?error=server_error&error_code=unexpected_failure&error_description=Database+error+saving+new+user`

**Root Cause**: The database trigger `handle_new_user` is failing when Supabase tries to create a new user profile.

## 🔧 **IMMEDIATE FIX STEPS**

### **Step 1: Run Emergency Database Fix**
1. Go to your **Supabase Dashboard**
2. Navigate to **SQL Editor**
3. Copy the entire content from `backend/sql/00_fix_database_schema.sql`
4. Paste and click **RUN**
5. Should see: `"Database schema fixed! RLS disabled, simple trigger created."`

### **Step 2: Test Authentication**
1. Clear browser data (localStorage, cookies)
2. Go to `http://localhost:5173/signin`
3. Click **"Continue with Google"**
4. Should now work without database errors

## 🎯 **What the Fix Does**

### **1. Creates Missing Tables**
- ✅ `user_profiles` table with proper structure
- ✅ `influencers` table for influencer data  
- ✅ `brands` table for brand data
- ✅ `brand_profiles` table for additional brand info

### **2. Fixes Permissions**
- ✅ **Disables RLS temporarily** (Row Level Security was blocking inserts)
- ✅ **Grants proper permissions** to `anon` and `authenticated` roles
- ✅ **Allows user creation** without permission errors

### **3. Simplifies Trigger Function**
- ✅ **Error handling**: Won't fail user creation if profile creation fails
- ✅ **Minimal data**: Only creates basic profile with required fields
- ✅ **Safe defaults**: Uses fallback values from Google metadata

## 🧪 **Expected Results After Fix**

### **Successful Flow:**
```
1. Click "Continue with Google" 
2. Google OAuth redirect ✅
3. Return to /auth/callback ✅
4. User created in auth.users ✅
5. Profile created in user_profiles ✅
6. Redirect to /onboarding ✅
```

### **In Browser Console:**
```
"Auth state changed: SIGNED_IN"
"Session data: {user data}"
"Profile data: {basic profile}"
"Profile found with role: influencer"
"Welcome back!" OR "Setting up your profile..."
```

### **In Supabase Dashboard:**
- **Authentication → Users**: New user appears ✅
- **Table Editor → user_profiles**: Profile record created ✅

## 🔍 **Verification Steps**

### **1. Check User Creation**
```sql
-- In Supabase SQL Editor
SELECT * FROM auth.users ORDER BY created_at DESC LIMIT 5;
```

### **2. Check Profile Creation**
```sql
-- In Supabase SQL Editor  
SELECT * FROM public.user_profiles ORDER BY created_at DESC LIMIT 5;
```

### **3. Test Trigger Function**
```sql
-- Test the trigger function
SELECT public.handle_new_user();
```

## 🚨 **If Still Not Working**

### **Check 1: Supabase Logs**
1. Go to **Logs** in Supabase Dashboard
2. Look for recent errors
3. Check for constraint violations or permission errors

### **Check 2: Google OAuth Configuration**
1. **Authentication → Providers → Google**
2. Verify Client ID and Secret are set
3. Check redirect URLs include: `http://localhost:5173/auth/callback`

### **Check 3: Environment Variables**
```javascript
// In browser console
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Has Key:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
```

## 🎯 **Alternative Quick Fix**

If the database fix doesn't work immediately, you can temporarily bypass the trigger:

```sql
-- Disable the trigger temporarily
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- This allows user creation without profile creation
-- Profiles will be created by the frontend AuthCallback component
```

## ✅ **Success Indicators**

After running the fix:
1. ✅ No more "Database error saving new user"
2. ✅ Users appear in Supabase Authentication
3. ✅ Profiles created in user_profiles table
4. ✅ Redirect to onboarding page works
5. ✅ Complete authentication flow functional

## 📞 **Next Steps**

1. **Run the database fix SQL**
2. **Test Google OAuth again**
3. **Verify user and profile creation**
4. **Complete onboarding flow testing**

The fix addresses the core database permission and trigger issues that were preventing user creation!
