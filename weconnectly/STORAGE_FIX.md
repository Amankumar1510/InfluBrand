# 🔧 Storage Bucket Fix

## ❌ **Error**
```
StorageApiError: Bucket not found
```

## ✅ **Solution**

### **Option 1: Run SQL Script (Recommended)**

1. Go to your **Supabase Dashboard**
2. Navigate to **SQL Editor**
3. Run this SQL script: `backend/sql/04_storage_setup.sql`

```sql
-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'profile-images', 
    'profile-images', 
    true, 
    5242880, -- 5MB
    ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;
```

### **Option 2: Manual Setup in Dashboard**

1. Go to **Supabase Dashboard**
2. Navigate to **Storage**
3. Click **Create Bucket**
4. Set:
   - **Name**: `profile-images`
   - **Public**: ✅ Enabled
   - **File size limit**: 5MB
   - **Allowed MIME types**: `image/jpeg, image/png, image/webp`

### **Option 3: Temporary Workaround**

If you want to test without images for now, you can comment out the file upload sections in the onboarding form.

## 🔍 **Why This Happened**

Supabase Storage buckets need to be created before they can be used. The frontend code now automatically tries to create the bucket, but it's better to set it up properly through the dashboard or SQL.

## ✅ **After Setup**

Once the bucket is created, the file upload will work perfectly:
- Upload from device ✅
- Image preview ✅
- Proper file validation ✅
- Secure storage ✅

The upload functionality is fully implemented and ready to work once the storage is configured!
