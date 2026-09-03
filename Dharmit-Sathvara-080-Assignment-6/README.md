# Library Management API

Node.js + Express + Firebase Firestore + JWT + bcrypt + Swagger.

## Features

- Student and Librarian roles
- JWT authentication
- bcrypt password hashing
- User profile management
- Librarian-only book CRUD
- Student borrow/return
- Transaction history
- Firebase Firestore database
- Authentication and role middleware
- Request logging
- Rate limiting
- Validation
- Global error handler
- Swagger UI

## Setup

```bash
npm install
cp .env.example .env
```

Create a Firebase project and enable Firestore.

Create a Firebase Admin service account and copy its credentials into `.env`.

Then:

```bash
npm run dev
```

API:
http://localhost:4000

Swagger:
http://localhost:4000/api-docs

## Main endpoints

POST /api/auth/register
POST /api/auth/login
GET /api/auth/profile
PUT /api/auth/profile

GET /api/books
GET /api/books/search?q=node
GET /api/books/:id
POST /api/books
PUT /api/books/:id
DELETE /api/books/:id

POST /api/books/:id/borrow
POST /api/books/:id/return

GET /api/transactions
GET /api/transactions/my

GET /api/users
GET /api/users/:id
PUT /api/users/:id/role
DELETE /api/users/:id

Protected endpoints require:

Authorization: Bearer YOUR_JWT_TOKEN
