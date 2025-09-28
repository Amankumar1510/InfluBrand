# Profile Creation Testing Guide

## What Was Fixed

### 🔧 **Major Issues Resolved**

1. **Form Data Binding**: All form fields now properly use controlled components with `formData` state
2. **Category Mapping**: Added proper mapping from frontend category names to database enums
3. **Database Constraints**: Fixed data insertion to match database schema requirements
4. **Error Handling**: Improved error messages and debugging information
5. **Profile Update Logic**: Changed from `insert` to `upsert` to handle existing profiles

### 🎯 **Key Changes Made**

#### **Frontend (Onboarding.tsx)**
- ✅ **All form fields now controlled**: Every input connects to `formData` state
- ✅ **Category mapping**: Maps frontend categories to database enum values
- ✅ **Proper data types**: Numbers are parsed, nulls handled correctly
- ✅ **Upsert operations**: Uses `onConflict` to handle existing records
- ✅ **Better error messages**: Shows specific error details to user

#### **Form Field Mapping**
**Influencer Fields:**
- `display_name` → Uses first_name as fallback
- `primary_category` → Maps to content_category enum
- `years_experience` → Numeric field
- `min_rate`/`max_rate` → Rate range with USD currency
- `content_types` → Array of content types
- `languages` → Array with English default

**Brand Fields:**
- `company_name` → Required field
- `brand_name` → Optional, different from company
- `primary_category` → Maps to brand_category enum
- `company_size` → Maps to company_size enum
- `monthly_marketing_budget` → Numeric with USD currency
- `headquarters_location` → Location field

## Testing Steps

### 1. **Test Influencer Profile Creation**
```bash
1. Start frontend: npm run dev
2. Sign in with Google
3. Choose "Influencer" role
4. Fill out form with test data:
   - Username: @testinfluencer
   - Display Name: Test Influencer
   - Bio: "I create amazing content"
   - Phone: +1-555-123-4567
   - Website: https://test.com
   - Location: New York, USA
   - Category: Fashion & Beauty
   - Experience: 3 years
   - Rate: $500-2000
5. Submit form
6. Check if redirected to /brand-discovery
```

### 2. **Test Brand Profile Creation**
```bash
1. Sign in with Google (new account)
2. Choose "Brand" role
3. Fill out form with test data:
   - Company Name: Test Company Inc
   - Brand Name: TestBrand
   - Tagline: "Making awesome products"
   - Description: "We create innovative solutions"
   - Category: Technology
   - Company Size: Small (11-50)
   - Website: https://testcompany.com
   - Email: hello@testcompany.com
   - Phone: +1-555-987-6543
   - Location: San Francisco, USA
   - Budget: $10000
4. Submit form
5. Check if redirected to /influencer-discovery
```

### 3. **Verify Database Records**

**Check in Supabase Dashboard:**
```sql
-- Check user profiles
SELECT * FROM user_profiles ORDER BY created_at DESC LIMIT 5;

-- Check influencer data
SELECT 
    up.username, 
    up.first_name, 
    up.role,
    i.display_name,
    i.primary_category,
    i.min_rate,
    i.max_rate
FROM user_profiles up
LEFT JOIN influencers i ON up.user_id = i.user_id
WHERE up.role = 'influencer'
ORDER BY up.created_at DESC LIMIT 5;

-- Check brand data
SELECT 
    up.username,
    up.first_name,
    up.role,
    b.company_name,
    b.brand_name,
    b.primary_category,
    b.company_size,
    b.monthly_marketing_budget
FROM user_profiles up
LEFT JOIN brands b ON up.user_id = b.user_id
WHERE up.role = 'brand'
ORDER BY up.created_at DESC LIMIT 5;
```

### 4. **Test Profile Retrieval**
```sql
-- Test the get_user_profile function
SELECT public.get_user_profile('USER_ID_HERE'::uuid);
```

## Expected Behavior

### ✅ **Success Indicators**
1. **Form Submission**: No errors in browser console
2. **Database Insertion**: Records appear in all relevant tables
3. **Profile Retrieval**: `get_user_profile` returns complete data
4. **Navigation**: Correct redirect based on user role
5. **Auth Context**: Profile data loads in frontend

### ❌ **Common Issues to Watch**
1. **Enum Errors**: Category names not matching database enums
2. **Null Constraints**: Required fields not being populated
3. **Type Errors**: String/number mismatches
4. **Unique Constraints**: Duplicate usernames or user_ids

## Debugging Tips

### **Browser Console**
```javascript
// Check form data before submission
console.log('Form data:', formData);

// Check Supabase response
console.log('Profile creation response:', response);
```

### **Supabase Logs**
- Check the Supabase logs for SQL errors
- Look for constraint violations or type mismatches

### **Network Tab**
- Check the actual data being sent to Supabase
- Verify the response status and error messages

## Next Steps After Testing

1. **If tests pass**: Profile creation is working correctly
2. **If issues found**: Check specific error messages and debug accordingly
3. **Performance**: Monitor response times for profile creation
4. **User Experience**: Test edge cases like network failures

The profile creation flow should now work seamlessly with proper data validation and error handling!
