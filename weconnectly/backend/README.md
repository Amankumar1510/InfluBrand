# InfluBrand Backend API

A comprehensive FastAPI backend for connecting influencers and brands for authentic collaborations.

## Features

### Core Functionality
- **Dual User System**: Separate interfaces for Influencers and Brands
- **Advanced Matching**: AI-powered algorithm to match collaborators based on niche, audience, and goals
- **Campaign Management**: Full lifecycle management from creation to completion
- **Social Media Integration**: Connect Instagram, YouTube, TikTok, Twitter accounts
- **Real-time Analytics**: Performance tracking and audience insights
- **Messaging System**: Direct communication between brands and influencers
- **Content Management**: Upload, review, and approve collaboration content

### Technical Features
- **FastAPI Framework**: Modern, fast, type-safe API development
- **Async/Await**: Full asynchronous support for high performance
- **PostgreSQL**: Robust relational database with async support
- **Redis**: Caching and background task management
- **JWT Authentication**: Secure token-based authentication
- **Role-based Access**: Different permissions for influencers, brands, and admins
- **File Upload**: Secure image and document upload with cloud storage
- **Email Integration**: Automated notifications and verification
- **Background Tasks**: Celery for long-running operations
- **Docker Support**: Containerized deployment

## Project Structure

```
backend/
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── endpoints/          # API endpoints
│   │       │   ├── auth.py         # Authentication
│   │       │   ├── users.py        # User management
│   │       │   ├── influencers.py  # Influencer discovery
│   │       │   ├── brands.py       # Brand discovery
│   │       │   ├── campaigns.py    # Campaign management
│   │       │   ├── collaborations.py # Collaboration tracking
│   │       │   ├── social_media.py # Social media integration
│   │       │   ├── analytics.py    # Analytics and reporting
│   │       │   ├── notifications.py # Notification system
│   │       │   ├── messages.py     # Messaging system
│   │       │   ├── search.py       # Global search
│   │       │   └── admin.py        # Admin endpoints
│   │       └── router.py           # Main API router
│   ├── core/
│   │   ├── config.py              # Application configuration
│   │   ├── database.py            # Database setup
│   │   ├── security.py            # Authentication & authorization
│   │   └── exceptions.py          # Custom exceptions
│   ├── models/
│   │   ├── user.py                # User and profile models
│   │   ├── influencer.py          # Influencer-specific models
│   │   ├── brand.py               # Brand-specific models
│   │   ├── campaign.py            # Campaign and collaboration models
│   │   ├── social_media.py        # Social media account models
│   │   ├── analytics.py           # Analytics and metrics models
│   │   ├── notification.py        # Notification models
│   │   └── message.py             # Messaging models
│   ├── repositories/
│   │   ├── base_repository.py     # Base CRUD operations
│   │   └── user_repository.py     # User-specific queries
│   ├── schemas/                   # Pydantic schemas
│   ├── services/                  # Business logic
│   └── main.py                    # Application entry point
├── alembic/                       # Database migrations
├── requirements.txt               # Python dependencies
├── Dockerfile                     # Docker configuration
├── docker-compose.yml             # Multi-container setup
├── alembic.ini                    # Alembic configuration
├── env.example                    # Environment variables example
└── README.md                      # This file
```

## Database Models

### User System
- **User**: Base user model with authentication
- **UserProfile**: Extended profile information
- **Influencer**: Influencer-specific data and metrics
- **Brand**: Brand company information and preferences

### Campaign System
- **Campaign**: Brand campaigns seeking influencers
- **CampaignApplication**: Influencer applications to campaigns
- **CampaignCollaboration**: Active collaborations with tracking

### Social Media Integration
- **SocialMediaAccount**: Connected social media accounts
- **SocialMediaPost**: Individual posts and their metrics
- **InfluencerMetrics**: Aggregated analytics across platforms

### Communication
- **Message**: Direct messaging between users
- **Conversation**: Message threads
- **Notification**: System notifications

### Analytics
- **AnalyticsEvent**: User interaction tracking
- **EngagementMetric**: Performance metrics storage

## API Endpoints

### Authentication (`/api/v1/auth`)
- `POST /register` - User registration
- `POST /login` - User login
- `POST /refresh` - Refresh access token
- `GET /me` - Get current user info
- `POST /verify-email` - Verify email address
- `POST /forgot-password` - Request password reset
- `POST /reset-password` - Reset password

### Users (`/api/v1/users`)
- `GET /me` - Get current user profile
- `PUT /me` - Update current user profile
- `DELETE /me` - Deactivate account
- `GET /{user_id}` - Get user by ID
- `GET /` - Search users

### Influencer Discovery (`/api/v1/influencers`)
- `GET /discover` - Discover influencers (brands only)
- `GET /{influencer_id}` - Get influencer profile
- `GET /{influencer_id}/analytics` - Get influencer analytics
- `GET /{influencer_id}/posts` - Get recent posts
- `POST /{influencer_id}/contact` - Contact influencer

### Brand Discovery (`/api/v1/brands`)
- `GET /discover` - Discover brands (influencers only)
- `GET /{brand_id}` - Get brand profile
- `GET /{brand_id}/campaigns` - Get brand campaigns
- `POST /{brand_id}/contact` - Contact brand

### Campaign Management (`/api/v1/campaigns`)
- `POST /` - Create campaign (brands)
- `GET /` - Get campaigns
- `GET /{campaign_id}` - Get campaign details
- `PUT /{campaign_id}` - Update campaign
- `DELETE /{campaign_id}` - Delete campaign
- `GET /discover` - Discover campaigns (influencers)
- `POST /{campaign_id}/apply` - Apply to campaign

### Collaborations (`/api/v1/collaborations`)
- `GET /` - Get collaborations
- `GET /{collaboration_id}` - Get collaboration details
- `PUT /{collaboration_id}` - Update collaboration
- `POST /{collaboration_id}/submit-content` - Submit content
- `POST /{collaboration_id}/approve-content` - Approve content

## Installation & Setup

### Prerequisites
- Python 3.11+
- PostgreSQL 13+
- Redis 6+
- Docker & Docker Compose (optional)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

5. **Set up database**
   ```bash
   # Create PostgreSQL database
   createdb influbrand_db
   
   # Run migrations
   alembic upgrade head
   ```

6. **Start Redis**
   ```bash
   redis-server
   ```

7. **Run the application**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

### Docker Deployment

1. **Using Docker Compose**
   ```bash
   docker-compose up -d
   ```

   This will start:
   - PostgreSQL database
   - Redis server
   - FastAPI backend
   - Celery worker
   - Celery beat scheduler

2. **Run migrations**
   ```bash
   docker-compose exec backend alembic upgrade head
   ```

## Environment Variables

Key environment variables (see `env.example` for complete list):

```env
# Database
DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/influbrand_db

# Security
SECRET_KEY=your-secret-key
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Redis
REDIS_URL=redis://localhost:6379

# Email
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Social Media APIs
INSTAGRAM_CLIENT_ID=your-instagram-client-id
YOUTUBE_API_KEY=your-youtube-api-key
```

## API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Testing

```bash
# Run tests
pytest

# Run tests with coverage
pytest --cov=app

# Run specific test file
pytest tests/test_auth.py
```

## Background Tasks

The application uses Celery for background tasks:

- **Email sending**: Verification emails, notifications
- **Social media sync**: Fetch posts and metrics from connected accounts
- **Analytics calculation**: Compute engagement metrics and audience insights
- **Report generation**: Generate periodic performance reports

Start Celery worker:
```bash
celery -A app.core.celery worker --loglevel=info
```

Start Celery beat (scheduler):
```bash
celery -A app.core.celery beat --loglevel=info
```

## Social Media Integration

The platform integrates with major social media APIs:

### Instagram Basic Display API
- Fetch user profile information
- Retrieve posts and their metrics
- Access audience insights (for business accounts)

### YouTube Data API
- Channel information and statistics
- Video details and performance metrics
- Subscriber demographics

### Twitter API v2
- Tweet metrics and engagement
- Follower information
- Account analytics

### TikTok for Developers
- Video performance data
- Profile statistics
- Audience insights

## Security Features

- **JWT Authentication**: Secure token-based auth with refresh tokens
- **Password Hashing**: bcrypt for secure password storage
- **Rate Limiting**: Prevent API abuse
- **CORS Protection**: Configurable cross-origin resource sharing
- **Input Validation**: Pydantic schemas for request validation
- **SQL Injection Prevention**: SQLAlchemy ORM with parameterized queries
- **File Upload Security**: Type validation and size limits

## Performance Optimizations

- **Async/Await**: Non-blocking database operations
- **Connection Pooling**: Efficient database connection management
- **Redis Caching**: Cache frequently accessed data
- **Database Indexing**: Optimized queries with proper indexes
- **Pagination**: Limit response sizes for large datasets
- **Background Processing**: Offload heavy operations to Celery

## Monitoring & Logging

- **Health Checks**: `/health` endpoint for monitoring
- **Structured Logging**: JSON logs for better parsing
- **Error Tracking**: Sentry integration for error monitoring
- **Performance Metrics**: Prometheus metrics collection
- **Request Tracing**: Track request lifecycle

## Deployment

### Production Considerations

1. **Environment Variables**: Use secure secret management
2. **Database**: Use managed PostgreSQL service
3. **Redis**: Use managed Redis service
4. **File Storage**: Use AWS S3 or similar cloud storage
5. **Load Balancing**: Use Nginx or cloud load balancer
6. **SSL/TLS**: Enable HTTPS with proper certificates
7. **Monitoring**: Set up logging, metrics, and alerting
8. **Backup**: Regular database and file backups

### Scaling

- **Horizontal Scaling**: Multiple API server instances
- **Database Scaling**: Read replicas for read-heavy workloads
- **Caching**: Redis cluster for distributed caching
- **Background Tasks**: Multiple Celery workers
- **CDN**: Content delivery network for static assets

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Run the test suite
6. Submit a pull request

## License

[Your License Here]
