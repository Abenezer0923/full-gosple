# GraceLedger API Documentation

Base URL: `http://localhost:5000/api` (development)

## Authentication

All protected routes require JWT token in:
- Cookie: `token`
- Header: `Authorization: Bearer <token>`

## Endpoints

### Auth

#### POST /auth/register
Register new user

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe",
  "role": "SECRETARY" // optional
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "SECRETARY",
    "profile": { ... }
  },
  "token": "jwt-token"
}
```

#### POST /auth/login
Login user

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### GET /auth/me
Get current user (protected)

#### POST /auth/logout
Logout user

---

### Members

#### GET /members
Get all members (protected)

**Query params:**
- `status`: ACTIVE | INACTIVE | DECEASED
- `search`: search term
- `page`: page number (default: 1)
- `limit`: items per page (default: 20)

#### GET /members/:id
Get member by ID (protected)

#### POST /members
Create member (SUPER_ADMIN, SECRETARY)

**Body:**
```json
{
  "email": "member@example.com",
  "fullName": "Jane Doe",
  "phone": "+1234567890",
  "address": "123 Main St",
  "avatarUrl": "https://cloudinary.com/..."
}
```

#### PUT /members/:id
Update member (SUPER_ADMIN, SECRETARY)

#### DELETE /members/:id
Delete member (SUPER_ADMIN only)

---

### Payments

#### GET /payments
Get all payments (protected)

**Query params:**
- `memberId`: filter by member
- `startDate`: ISO date
- `endDate`: ISO date
- `page`: page number
- `limit`: items per page

#### GET /payments/:id
Get payment by ID (protected)

#### POST /payments
Create payment (SUPER_ADMIN, SECRETARY)

**Body:**
```json
{
  "memberId": "uuid",
  "amount": 100.50,
  "paymentTypeId": "uuid",
  "forMonth": "2024-01-01",
  "method": "CASH",
  "notes": "Optional notes"
}
```

#### PUT /payments/:id
Update payment (SUPER_ADMIN, SECRETARY)

#### DELETE /payments/:id
Delete payment (SUPER_ADMIN only)

#### GET /payments/types/all
Get all payment types

---

### Dashboard

#### GET /dashboard/stats
Get dashboard statistics (protected)

**Response:**
```json
{
  "totalMembers": 150,
  "activeMembers": 140,
  "monthlyCollection": 5000.00,
  "yearlyCollection": 50000.00,
  "totalCollection": 200000.00
}
```

#### GET /dashboard/trends/monthly
Get monthly trends (last 12 months)

#### GET /dashboard/distribution
Get payment distribution by type

#### GET /dashboard/recent-payments
Get recent payments

**Query params:**
- `limit`: number of payments (default: 10)

---

### Groups

#### GET /groups
Get all church groups (protected)

#### POST /groups
Create group (SUPER_ADMIN, SECRETARY)

**Body:**
```json
{
  "name": "Youth Ministry",
  "description": "Young adults group"
}
```

#### POST /groups/:groupId/members/:memberId
Add member to group (SUPER_ADMIN, SECRETARY)

---

## Error Responses

```json
{
  "error": "Error message"
}
```

**Status Codes:**
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## User Roles

- **SUPER_ADMIN**: Full access
- **PASTOR**: Read-only access
- **SECRETARY**: Create/update members and payments

## Payment Methods

- CASH
- BANK_TRANSFER
- MOBILE_MONEY
- CHECK
- CARD

## Member Status

- ACTIVE
- INACTIVE
- DECEASED
