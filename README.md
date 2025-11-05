# GraceLedger - Church Tithing & Membership Management System

A comprehensive, role-based full-stack web application for managing church members, tithes, and offerings.

## Tech Stack

- **Frontend:** Next.js 14 (React), Shadcn/ui, TailwindCSS
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** JWT with http-only cookies
- **File Storage:** Cloudinary (free tier)
- **Containerization:** Docker & Docker Compose
- **CI/CD:** GitHub Actions
- **Deployment:** Vercel (frontend), Render/Railway (backend)

## Quick Start with Docker

```bash
# Clone repository
git clone <your-repo-url>
cd graceledger

# Set up environment variables
cp server/.env.example server/.env
cp client/.env.example client/.env

# Start all services
docker-compose up -d

# Run database migrations
docker-compose exec server npx prisma migrate dev

# Seed initial data (optional)
docker-compose exec server npm run seed
```

Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Database: localhost:5432

## Local Development (without Docker)

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Backend Setup
```bash
cd server
npm install
cp .env.example .env
# Update DATABASE_URL in .env
npx prisma migrate dev
npm run dev
```

### Frontend Setup
```bash
cd client
npm install
cp .env.example .env
# Update NEXT_PUBLIC_API_URL in .env
npm run dev
```

## Environment Variables

### Backend (`server/.env`)
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/graceledger
JWT_SECRET=your-super-secret-jwt-key-change-in-production
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:3000
NODE_ENV=development
PORT=5000
```

### Frontend (`client/.env`)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

## Database Schema

- **Users:** Authentication and role management
- **Profiles:** Member information with avatar URLs
- **PaymentTypes:** Tithe, Offering, Special Offering, etc.
- **Payments:** Transaction records with receipts
- **ChurchGroups:** Ministry groups, departments
- **MemberGroups:** Many-to-many relationship

## User Roles

1. **Super Admin:** Full system access, user management
2. **Church Pastor:** Read-only access, analytics
3. **Secretary:** Member registration, payment entry

## API Documentation

API endpoints are documented in `server/API.md` or access Swagger UI at `/api-docs` when running.

## Testing

```bash
# Backend tests
cd server
npm test

# Frontend tests
cd client
npm test
```

## CI/CD Pipeline

GitHub Actions automatically:
- Runs tests on pull requests
- Deploys to staging on `develop` branch
- Deploys to production on `main` branch

## Deployment

### Frontend (Vercel)
1. Connect GitHub repository
2. Set root directory to `client`
3. Add environment variables
4. Deploy

### Backend (Render/Railway)
1. Connect GitHub repository
2. Use Dockerfile deployment
3. Add environment variables
4. Provision PostgreSQL database
5. Deploy

## Project Structure

```
graceledger/
├── client/              # Next.js frontend
├── server/              # Express.js backend
├── docker-compose.yml   # Docker orchestration
├── .github/workflows/   # CI/CD pipelines
└── README.md
```

## License

MIT
