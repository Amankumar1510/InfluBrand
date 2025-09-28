# InfluBrand Setup Guide

This guide will help you set up the InfluBrand application with Supabase authentication.

## Quick Start

### 1. Backend Setup

```bash
cd weconnectly/backend

# Run the setup script
python setup.py

# This will:
# - Create .env file with default configuration
# - Install Python dependencies
```

### 2. Frontend Setup

```bash
cd weconnectly/frontend

# Install dependencies
npm install

# Create environment file
cp env.example .env.local
```

### 3. Supabase Configuration

1. **Create Supabase Project**:
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and API keys

2. **Configure Google OAuth**:
   - Follow the detailed steps in `backend/SUPABASE_SETUP.md`

3. **Run Database Scripts**:
   - Copy content from `backend/sql/01_initial_schema.sql`
   - Run in Supabase SQL Editor
   - Copy content from `backend/sql/02_auth_functions.sql`
   - Run in Supabase SQL Editor

4. **Update Environment Variables**:

   **Backend** (`.env`):
   ```env
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=your-actual-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-actual-service-role-key
   ```

   **Frontend** (`.env.local`):
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-actual-anon-key
   ```

### 4. Start Development Servers

```bash
# Backend (Terminal 1)
cd weconnectly/backend
uvicorn app.main:app --reload

# Frontend (Terminal 2)
cd weconnectly/frontend
npm run dev
```

## Project Structure

```
weconnectly/
├── backend/
│   ├── app/
│   │   ├── api/v1/endpoints/
│   │   │   └── auth.py          # Authentication endpoints
│   │   ├── core/
│   │   │   ├── config.py        # Configuration settings
│   │   │   └── supabase.py      # Supabase client
│   │   └── main.py              # FastAPI app
│   ├── sql/
│   │   ├── 01_initial_schema.sql    # Database schema
│   │   └── 02_auth_functions.sql    # Auth functions
│   ├── requirements.txt         # Python dependencies
│   ├── setup.py                 # Setup script
│   └── SUPABASE_SETUP.md       # Detailed Supabase guide
└── frontend/
    ├── src/
    │   ├── contexts/
    │   │   └── AuthContext.tsx   # Authentication context
    │   ├── lib/
    │   │   └── supabase.ts       # Supabase client
    │   ├── pages/
    │   │   ├── SignIn.tsx        # Sign in page
    │   │   ├── AuthCallback.tsx  # OAuth callback
    │   │   └── Onboarding.tsx    # Profile creation
    │   └── App.tsx               # Main app component
    └── package.json              # Node dependencies
```

## Troubleshooting

### Common Issues

1. **"Supabase not configured" Error**:
   - Make sure you've updated the environment variables
   - Restart the development servers after updating .env files

2. **"TypeError: Client.__init__() got an unexpected keyword argument 'proxy'"**:
   - This was a version compatibility issue, now fixed
   - Make sure you have the correct dependency versions

3. **Google OAuth not working**:
   - Check that you've configured Google OAuth in Supabase
   - Verify the redirect URLs match exactly

4. **Database errors**:
   - Make sure you've run both SQL scripts in Supabase
   - Check that RLS policies are enabled

### Dependency Issues

If you encounter dependency conflicts:

```bash
# Backend - reinstall with exact versions
cd weconnectly/backend
pip install -r requirements.txt --force-reinstall

# Frontend - clear cache and reinstall
cd weconnectly/frontend
rm -rf node_modules package-lock.json
npm install
```

## Features Implemented

✅ **Google OAuth Authentication** via Supabase
✅ **User Profile Management** with role-based routing
✅ **Dual User Types**: Influencers and Brands
✅ **Database Integration** with proper security (RLS)
✅ **Session Management** with auto-refresh
✅ **Error Handling** and user feedback
✅ **TypeScript Support** throughout

## Next Steps

After successful setup:

1. Test the authentication flow
2. Complete user profile creation
3. Implement discovery features
4. Add campaign management
5. Integrate social media APIs

## Development Workflow

1. **Backend Changes**:
   - Modify FastAPI endpoints
   - Server auto-reloads with `--reload` flag

2. **Frontend Changes**:
   - Modify React components
   - Vite provides hot module replacement

3. **Database Changes**:
   - Create new SQL migration files
   - Run in Supabase SQL Editor
   - Update TypeScript interfaces

## Environment Variables Reference

### Backend (.env)
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key (server-side only)
- `HOST`: Server host (default: 0.0.0.0)
- `PORT`: Server port (default: 8000)
- `ENVIRONMENT`: Environment type (development/production)

### Frontend (.env.local)
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Supabase anonymous key (client-safe)
- `VITE_API_URL`: Backend API URL (optional)
- `VITE_ENVIRONMENT`: Environment type

## Support

For detailed Supabase setup, see `backend/SUPABASE_SETUP.md`.

For issues, check the troubleshooting section above or review the error messages in the browser console and server logs.
