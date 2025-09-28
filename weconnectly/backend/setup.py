#!/usr/bin/env python3
"""
Setup script for InfluBrand backend
"""

import os
import sys
from pathlib import Path

def create_env_file():
    """Create .env file with default configuration"""
    env_path = Path(__file__).parent / ".env"
    
    if env_path.exists():
        print("✅ .env file already exists")
        return
    
    env_content = """# Supabase Configuration (REQUIRED - Replace with your actual values)
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Server Settings
HOST=0.0.0.0
PORT=8000
ALLOWED_HOSTS=["localhost", "127.0.0.1", "0.0.0.0"]

# Environment
ENVIRONMENT=development
DEBUG=true

# Security (change in production)
SECRET_KEY=change-this-in-production-make-it-long-and-random
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
"""
    
    with open(env_path, "w") as f:
        f.write(env_content)
    
    print("✅ Created .env file with default configuration")
    print("⚠️  IMPORTANT: Update the Supabase credentials in .env file")

def install_dependencies():
    """Install Python dependencies"""
    print("📦 Installing dependencies...")
    os.system("pip install -r requirements.txt")
    print("✅ Dependencies installed")

def main():
    """Main setup function"""
    print("🚀 Setting up InfluBrand Backend")
    print("=" * 40)
    
    # Create environment file
    create_env_file()
    
    # Install dependencies
    install_dependencies()
    
    print("\n🎉 Setup complete!")
    print("\n📋 Next steps:")
    print("1. Set up your Supabase project (see SUPABASE_SETUP.md)")
    print("2. Update the Supabase credentials in .env file")
    print("3. Run: uvicorn app.main:app --reload")
    print("\n💡 The server will show a helpful error if Supabase is not configured")

if __name__ == "__main__":
    main()
