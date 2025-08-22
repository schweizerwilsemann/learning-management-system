# LMS API Backend

This is the NestJS backend for the LMS platform, providing RESTful APIs for authentication, user management, courses, media, and payments.

## Features

- **Authentication**: JWT-based authentication with Google OAuth support
- **User Management**: CRUD operations for users
- **Database Integration**: Prisma ORM with PostgreSQL
- **API Documentation**: Swagger/OpenAPI documentation
- **Validation**: Class-validator for request validation
- **CORS**: Configured for frontend integration

## Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT + Passport.js
- **Documentation**: Swagger/OpenAPI
- **Validation**: class-validator
- **Package Manager**: pnpm

## Prerequisites

- Node.js (v18 or higher)
- pnpm
- PostgreSQL database
- Environment variables configured

## Installation

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Set up environment variables:
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. Generate Prisma client:
   ```bash
   pnpm prisma generate
   ```

4. Run database migrations:
   ```bash
   pnpm prisma migrate dev
   ```

## Development

Start the development server:
```bash
pnpm start:dev
```

The API will be available at `http://localhost:8000`

## API Documentation

Once the server is running, you can access the Swagger documentation at:
`http://localhost:8000/api/docs`

## Available Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/google` - Google OAuth login
- `GET /auth/google/callback` - Google OAuth callback
- `GET /auth/profile` - Get user profile (protected)

### Users
- `GET /users` - Get all users (protected)
- `GET /users/:id` - Get user by ID (protected)
- `PATCH /users/:id` - Update user (protected)
- `DELETE /users/:id` - Delete user (protected)

## Environment Variables

Copy `env.example` to `.env` and configure the following variables:

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

## Scripts

- `pnpm start:dev` - Start development server with hot reload
- `pnpm build` - Build the application
- `pnpm start` - Start production server
- `pnpm test` - Run tests
- `pnpm lint` - Run ESLint

## Project Structure

```
src/
├── auth/                 # Authentication module
│   ├── dto/             # Data transfer objects
│   ├── guards/          # Authentication guards
│   ├── strategies/      # Passport strategies
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
├── users/               # Users module
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.module.ts
├── courses/             # Courses module (placeholder)
├── media/               # Media module (placeholder)
├── payments/            # Payments module (placeholder)
├── database/            # Database configuration
│   ├── prisma.service.ts
│   └── database.module.ts
├── app.module.ts        # Root module
└── main.ts             # Application entry point
```

## Contributing

1. Follow the existing code style
2. Add tests for new features
3. Update API documentation
4. Ensure all tests pass before submitting

## License

This project is licensed under the MIT License.
