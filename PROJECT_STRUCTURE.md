# GraceLedger - Project Structure

## Overview

GraceLedger is a production-ready full-stack church tithing and membership management system built with the PERN stack (PostgreSQL, Express.js, React.js, Node.js).

## Directory Structure

```
graceledger/
├── .github/
│   └── workflows/
│       └── deploy.yml              # CI/CD pipeline configuration
├── client/                         # Next.js frontend application
│   ├── src/
│   │   ├── app/                   # Next.js 14 app directory
│   │   │   ├── dashboard/         # Dashboard page
│   │   │   ├── login/             # Login page
│   │   │   ├── globals.css        # Global styles
│   │   │   ├── layout.js          # Root layout
│   │   │   └── page.js            # Home page
│   │   ├── lib/
│   │   │   └── api.js             # Axios instance with interceptors
│   │   └── store/
│   │       └── authStore.js       # Zustand auth state management
│   ├── .dockerignore
│   ├── .env.example
│   ├── Dockerfile                 # Development Docker config
│   ├── Dockerfile.prod            # Production Docker config
│   ├── jest.config.js
│   ├── jest.setup.js
│   ├── next.config.js
│   ├── package.json
│   ├── postcss.config.js
│   └── tailwind.config.js
├── server/                         # Express.js backend API
│   ├── __tests__/
│   │   └── auth.test.js           # Authentication tests
│   ├── prisma/
│   │   └── schema.prisma          # Database schema
│   ├── src/
│   │   ├── middleware/
│   │   │   └── auth.middleware.js # JWT authentication & authorization
│   │   ├── routes/
│   │   │   ├── auth.routes.js     # Authentication endpoints
│   │   │   ├── dashboard.routes.js # Dashboard statistics
│   │   │   ├── group.routes.js    # Church groups management
│   │   │   ├── member.routes.js   # Member CRUD operations
│   │   │   └── payment.routes.js  # Payment management
│   │   ├── index.js               # Express app entry point
│   │   └── seed.js                # Database seeding script
│   ├── .dockerignore
│   ├── .env.example
│   ├── API.md                     # API documentation
│   ├── Dockerfile                 # Development Docker config
│   ├── Dockerfile.prod            # Production Docker config
│   ├── jest.config.js
│   └── package.json
├── .dockerignore
├── .env.example
├── .gitignore
├── CONTRIBUTING.md                 # Contribution guidelines
├── DEPLOYMENT.md                   # Deployment instructions
├── docker-compose.yml              # Docker orchestration
├── LICENSE
├── Makefile                        # Convenience commands
├── README.md                       # Main documentation
└── setup.sh                        # Automated setup script
```

## Technology Stack

### Frontend
- **Framework:** Next.js 14 (React 18)
- **Styling:** TailwindCSS
- **State Management:** Zustand
- **HTTP Client:** Axios
- **Charts:** Recharts
- **Forms:** React Hook Form
- **Testing:** Jest + React Testing Library

### Backend
- **Runtime:** Node.js 18
- **Framework:** Express.js
- **Database:** PostgreSQL 15
- **ORM:** Prisma
- **Authentication:** JWT + bcryptjs
- **Validation:** express-validator
- **File Upload:** Cloudinary
- **Testing:** Jest + Supertest

### DevOps
- **Containerization:** Docker + Docker Compose
- **CI/CD:** GitHub Actions
- **Frontend Hosting:** Vercel
- **Backend Hosting:** Render/Railway
- **Database Hosting:** Render/Neon/Railway

## Key Features

### 1. Authentication & Authorization
- JWT-based authentication with http-only cookies
- Role-based access control (SUPER_ADMIN, PASTOR, SECRETARY)
- Secure password hashing with bcrypt
- Token refresh mechanism

### 2. Member Management
- Complete CRUD operations
- Profile picture upload via Cloudinary
- Member search and filtering
- Status tracking (ACTIVE, INACTIVE, DECEASED)
- Group membership management

### 3. Payment Management
- Multiple payment types (Tithe, Offering, etc.)
- Various payment methods (Cash, Bank Transfer, Mobile Money, etc.)
- Monthly payment tracking
- Digital receipt generation
- Payment history and analytics

### 4. Dashboard & Analytics
- Real-time statistics
- Monthly collection trends (12-month view)
- Payment distribution by type
- Member activity metrics
- Recent payments overview

### 5. Church Groups
- Create and manage ministry groups
- Assign members to groups
- Track group membership

## Database Schema

### Core Tables

**users**
- id (UUID, PK)
- email (unique)
- password (hashed)
- role (enum)
- timestamps

**profiles**
- id (UUID, PK)
- userId (FK → users)
- avatarUrl
- fullName
- phone
- address
- dateJoined
- status (enum)
- timestamps

**payment_types**
- id (UUID, PK)
- name (unique)

**payments**
- id (UUID, PK)
- memberId (FK → profiles)
- amount (decimal)
- paymentTypeId (FK → payment_types)
- paymentDate
- forMonth
- method (enum)
- receiptUrl
- notes
- timestamps

**church_groups**
- id (UUID, PK)
- name (unique)
- description
- timestamps

**member_groups**
- id (UUID, PK)
- memberId (FK → profiles)
- groupId (FK → church_groups)
- joinedAt
- unique(memberId, groupId)

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login
- GET `/api/auth/me` - Get current user
- POST `/api/auth/logout` - Logout

### Members
- GET `/api/members` - List members (paginated)
- GET `/api/members/:id` - Get member details
- POST `/api/members` - Create member
- PUT `/api/members/:id` - Update member
- DELETE `/api/members/:id` - Delete member

### Payments
- GET `/api/payments` - List payments (paginated, filtered)
- GET `/api/payments/:id` - Get payment details
- POST `/api/payments` - Create payment
- PUT `/api/payments/:id` - Update payment
- DELETE `/api/payments/:id` - Delete payment
- GET `/api/payments/types/all` - Get payment types

### Dashboard
- GET `/api/dashboard/stats` - Get statistics
- GET `/api/dashboard/trends/monthly` - Monthly trends
- GET `/api/dashboard/distribution` - Payment distribution
- GET `/api/dashboard/recent-payments` - Recent payments

### Groups
- GET `/api/groups` - List groups
- POST `/api/groups` - Create group
- POST `/api/groups/:groupId/members/:memberId` - Add member to group

## Environment Variables

### Backend
```
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=your-secret-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLIENT_URL=http://localhost:3000
NODE_ENV=development
PORT=5000
```

### Frontend
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
```

## Quick Start Commands

```bash
# Setup and start everything
make setup

# Start services
make start

# Stop services
make stop

# View logs
make logs

# Run migrations
make migrate

# Seed database
make seed

# Run tests
make test

# Clean up
make clean
```

## Testing Strategy

### Backend Tests
- Unit tests for middleware
- Integration tests for API endpoints
- Database transaction rollback in tests
- Mock external services (Cloudinary)

### Frontend Tests
- Component unit tests
- Integration tests for pages
- Mock API calls
- Accessibility testing

## CI/CD Pipeline

### On Pull Request
1. Run backend tests with PostgreSQL service
2. Run frontend tests
3. Check code quality

### On Push to `develop`
1. Run all tests
2. Deploy to staging environment

### On Push to `main`
1. Run all tests
2. Deploy to production environment

## Security Features

- Password hashing with bcrypt (10 rounds)
- JWT tokens with expiration
- HTTP-only cookies for token storage
- CORS configuration
- Input validation and sanitization
- SQL injection prevention (Prisma ORM)
- XSS protection
- Rate limiting (recommended for production)

## Performance Optimizations

- Database indexing on frequently queried fields
- Pagination for large datasets
- Lazy loading of images
- API response caching (recommended)
- Connection pooling
- Optimized Docker images (multi-stage builds)

## Monitoring & Logging

- Express error handling middleware
- Console logging (development)
- Structured logging (recommended for production)
- Health check endpoint
- Database connection monitoring

## Future Enhancements

- [ ] SMS notifications for payment reminders
- [ ] Email receipts
- [ ] Advanced reporting and exports (PDF, Excel)
- [ ] Multi-church support
- [ ] Mobile app (React Native)
- [ ] Automated backup system
- [ ] Two-factor authentication
- [ ] Audit logs
- [ ] Real-time notifications (WebSocket)
- [ ] Bulk import/export

## Support & Documentation

- **API Documentation:** `server/API.md`
- **Deployment Guide:** `DEPLOYMENT.md`
- **Contributing Guide:** `CONTRIBUTING.md`
- **Main README:** `README.md`

## License

MIT License - See LICENSE file for details
