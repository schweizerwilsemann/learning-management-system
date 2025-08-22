# LMS Platform

A comprehensive Learning Management System (LMS) platform built with Next.js frontend and NestJS backend, featuring modern architecture and robust functionality.

## 🏗️ Architecture

This project uses a monorepo structure with the following components:

- **Frontend**: Next.js 14 with TypeScript, Tailwind CSS, and Shadcn/ui
- **Backend**: NestJS with TypeScript, JWT authentication, and Swagger documentation
- **Database**: PostgreSQL with Prisma ORM
- **Storage**: AWS S3 (MinIO for local development)
- **Package Manager**: pnpm with workspace support

## 📁 Project Structure

```
lms-wrapper/
├── lms/
│   ├── lms-ui/          # Next.js frontend
│   └── lms-api/         # NestJS backend
├── packages/
│   └── db/              # Shared database package
├── infra/               # Infrastructure configuration
├── Makefile             # Development commands
└── pnpm-workspace.yaml  # Workspace configuration
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm
- PostgreSQL
- MinIO (for local S3 storage)

### 1. Install Dependencies

```bash
# Install all dependencies
make install
```

### 2. Setup Environment

```bash
# Setup environment files
make setup:env
```

### 3. Database Setup

```bash
# Generate Prisma client
make db:generate

# Run migrations
make db:migrate
```

### 4. Start Development Servers

```bash
# Start both frontend and backend
make dev
```

Or start them separately:

```bash
# Frontend only (port 3000)
make dev:frontend

# Backend only (port 8000)
make dev:backend
```

## 🔧 Configuration

### Frontend Environment (.env.local)

```env
DATABASE_URL="postgresql://lms:1772313@localhost:5432/lms?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXTAUTH_SECRET="a-random-secret-key"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# AWS S3 (MinIO)
ACCESS_KEY="minioadmin"
SECRET_ACCESS_KEY="supersecretpassword"
REGION="us-east-1"
S3_BUCKET_NAME="media"
S3_ENDPOINT="http://localhost:9000"
S3_PREFIX_FOLDER_NAME="lms"

NEXT_PUBLIC_APP_NAME="UTC2LMS"
NEXT_PUBLIC_ADMIN_EMAIL="admin@example.com"
NEXT_PUBLIC_TRANSCODE_URL="http://localhost:8000/transcode"
NEXT_PUBLIC_API_URL="http://localhost:8000"
```

### Backend Environment (.env)

```env
# Database
DATABASE_URL="postgresql://lms:1772313@localhost:5432/lms?schema=public"

# JWT
JWT_SECRET="your-jwt-secret"
JWT_EXPIRES_IN="7d"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# AWS S3 (MinIO)
ACCESS_KEY="minioadmin"
SECRET_ACCESS_KEY="supersecretpassword"
REGION="us-east-1"
S3_BUCKET_NAME="media"
S3_ENDPOINT="http://localhost:9000"
S3_PREFIX_FOLDER_NAME="lms"

# App Configuration
APP_NAME="UTC2LMS"
ADMIN_EMAIL="admin@example.com"
FRONTEND_URL="http://localhost:3000"

# Server Configuration
PORT=8000
NODE_ENV=development
```

## 📚 Available Commands

### Development

```bash
make dev              # Start both frontend and backend
make dev:frontend     # Start frontend only
make dev:backend      # Start backend only
```

### Building

```bash
make build            # Build all packages
make build:frontend   # Build frontend only
make build:backend    # Build backend only
```

### Database

```bash
make db:generate      # Generate Prisma client
make db:migrate       # Run migrations
make db:studio        # Open Prisma Studio
make db:reset         # Reset database
```

### Utilities

```bash
make clean            # Clean build artifacts
make test             # Run tests
make setup            # Complete setup
```

## 🌐 API Documentation

Once the backend is running, access the Swagger documentation at:
- **Swagger UI**: http://localhost:8000/api/docs

### Available Endpoints

#### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/google` - Google OAuth login
- `GET /auth/google/callback` - Google OAuth callback
- `GET /auth/profile` - Get user profile (protected)

#### Users
- `GET /users` - Get all users (protected)
- `GET /users/:id` - Get user by ID (protected)
- `PATCH /users/:id` - Update user (protected)
- `DELETE /users/:id` - Delete user (protected)

#### Transcode
- `POST /transcode/success` - Handle video transcode success

## 🎯 Features

### Frontend (Next.js)
- Server-side rendering for SEO
- Google OAuth authentication
- Tailwind CSS for styling
- Shadcn/ui component library
- Custom video player
- Admin dashboard
- Responsive design

### Backend (NestJS)
- JWT-based authentication
- Google OAuth integration
- RESTful API design
- Swagger documentation
- Request validation
- CORS configuration
- Modular architecture

### Database
- PostgreSQL with Prisma ORM
- Type-safe database operations
- Migration management
- Database seeding

## 🔒 Security

- JWT token authentication
- Password hashing with bcrypt
- CORS protection
- Input validation
- Environment variable protection

## 🧪 Testing

```bash
# Run backend tests
make test

# Run frontend tests
cd lms/lms-ui && npm test
```

## 📦 Deployment

### Frontend
```bash
make build:frontend
cd lms/lms-ui && npm start
```

### Backend
```bash
make build:backend
cd lms/lms-api && npm run start:prod
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation
- Open an issue on GitHub
- Review the API documentation at `/api/docs`
