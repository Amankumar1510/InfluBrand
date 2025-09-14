# ============================================================================
# backend/test_main.py - Basic Test File
# ============================================================================

import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_health_check(client: AsyncClient):
    """Test health check endpoint"""
    response = await client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy", "service": "weconnectly-api"}

@pytest.mark.asyncio
async def test_signup_creator(client: AsyncClient, test_user_data):
    """Test creator signup"""
    response = await client.post("/api/v1/auth/signup", json=test_user_data)
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == test_user_data["email"]
    assert data["role"] == test_user_data["role"]
    assert "id" in data

@pytest.mark.asyncio
async def test_signup_brand(client: AsyncClient, test_brand_data):
    """Test brand signup"""
    response = await client.post("/api/v1/auth/signup", json=test_brand_data)
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == test_brand_data["email"]
    assert data["role"] == test_brand_data["role"]

@pytest.mark.asyncio
async def test_login(client: AsyncClient, test_user_data):
    """Test user login"""
    # First signup
    await client.post("/api/v1/auth/signup", json=test_user_data)
    
    # Then login
    login_data = {
        "email": test_user_data["email"],
        "password": test_user_data["password"]
    }
    response = await client.post("/api/v1/auth/login", json=login_data)
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["token_type"] == "bearer"

@pytest.mark.asyncio
async def test_protected_route(client: AsyncClient, test_user_data):
    """Test protected route access"""
    # Signup and login
    await client.post("/api/v1/auth/signup", json=test_user_data)
    login_response = await client.post("/api/v1/auth/login", json={
        "email": test_user_data["email"],
        "password": test_user_data["password"]
    })
    token = login_response.json()["access_token"]
    
    # Access protected route
    headers = {"Authorization": f"Bearer {token}"}
    response = await client.get("/api/v1/auth/me", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == test_user_data["email"]

@pytest.mark.asyncio
async def test_create_campaign(client: AsyncClient, test_brand_data):
    """Test campaign creation by brand"""
    # Signup and login as brand
    await client.post("/api/v1/auth/signup", json=test_brand_data)
    login_response = await client.post("/api/v1/auth/login", json={
        "email": test_brand_data["email"],
        "password": test_brand_data["password"]
    })
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Create campaign
    campaign_data = {
        "title": "Summer Fashion Campaign",
        "description": "Looking for fashion influencers for summer collection",
        "brief": "Detailed brief about summer fashion collaboration",
        "budget_min": 500.00,
        "budget_max": 2000.00,
        "required_platforms": ["instagram", "tiktok"],
        "tags": ["fashion", "summer", "clothing"]
    }
    
    response = await client.post("/api/v1/campaigns/", json=campaign_data, headers=headers)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == campaign_data["title"]
    assert data["brand_id"] is not None

@pytest.mark.asyncio
async def test_get_campaigns(client: AsyncClient, test_user_data):
    """Test getting campaigns list"""
    # Signup and login as creator
    await client.post("/api/v1/auth/signup", json=test_user_data)
    login_response = await client.post("/api/v1/auth/login", json={
        "email": test_user_data["email"],
        "password": test_user_data["password"]
    })
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Get campaigns
    response = await client.get("/api/v1/campaigns/", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert "campaigns" in data
    assert "total" in data
    assert "page" in data