project-root/
├── backend/                      # FastAPI backend
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py               # FastAPI entrypoint
│   │   ├── api/                  # API route definitions
│   │   │   ├── __init__.py
│   │   │   └── endpoints/
│   │   │       ├── __init__.py
│   │   │       ├── users.py
│   │   │       └── items.py
│   │   ├── core/                 # Settings, config, security utils
│   │   │   ├── config.py
│   │   │   └── security.py
│   │   ├── models/               # SQLAlchemy / ORM models
│   │   │   └── user.py
│   │   ├── services/             # Business logic (service layer)
│   │   │   └── user_service.py
│   │   ├── db/                   # Database connection & migrations
│   │   │   ├── base.py
│   │   │   └── session.py
│   │   └── schemas/              # Pydantic models
│   │       └── user_schema.py
│   ├── tests/                    # Backend unit & integration tests
│   │   └── test_users.py
│   └── requirements.txt          # Backend dependencies
│
├── frontend/                     # React frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── assets/               # Images, fonts, icons
│   │   ├── components/           # Reusable components
│   │   │   └── Button.jsx
│   │   ├── pages/                # Page components (for routes)
│   │   │   └── HomePage.jsx
│   │   ├── services/             # API calls
│   │   │   └── apiClient.js
│   │   │   └── userService.js
│   │   ├── context/              # React context for state management
│   │   │   └── AuthContext.js
│   │   ├── hooks/                # Custom hooks
│   │   │   └── useAuth.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── routes.js             # React Router config
│   ├── tests/                    # Frontend unit & integration tests
│   │   └── Button.test.jsx
│   └── package.json              # Frontend dependencies
│
├── .gitignore
├── docker-compose.yml            # Optionally for local dev environment
├── README.md
├── .env                          # Shared environment variables
└── LICENSE
