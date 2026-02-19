# 🔐 OTP Service API

A secure, production-ready OTP (One-Time Password) generation and verification REST API built with Node.js, Express, and MongoDB.

## Features

- **Cryptographically secure** OTP generation using `crypto.randomInt()`
- **Bcrypt-hashed** OTP storage — plaintext never persisted
- **60-second auto-expiry** via MongoDB TTL index
- **Rate limiting** on both endpoints (5 req / 15 min per IP)
- **Secure HTTP headers** with Helmet
- **Input validation** with express-validator
- **Professional HTML email** delivery via Nodemailer

---

## Quick Start

### 1. Prerequisites

- **Node.js** ≥ 18
- **MongoDB** running locally or a MongoDB Atlas URI

### 2. Install & Configure

```bash
# Install dependencies
npm install

# Create your .env file from the template
cp .env.example .env

# Edit .env with your MongoDB URI and SMTP credentials
```

### 3. Run

```bash
# Development (auto-restart on file changes)
npm run dev

# Production
npm start
```

---

## API Endpoints

### `POST /api/v1/otp/generate`

Send a 6-digit OTP to the given email.

```bash
curl -X POST http://localhost:3000/api/v1/otp/generate \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'
```

**Response `200`:**
```json
{
  "success": true,
  "message": "OTP sent successfully to user@example.com",
  "data": { "expiresInSeconds": 60 }
}
```

---

### `POST /api/v1/otp/verify`

Verify the OTP the user received.

```bash
curl -X POST http://localhost:3000/api/v1/otp/verify \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "otp": "482913"}'
```

**Response `200`:**
```json
{
  "success": true,
  "message": "OTP verified successfully"
}
```

---

### `GET /health`

Health check endpoint.

```bash
curl http://localhost:3000/health
```

---

## Error Codes

| Status | Meaning |
|--------|---------|
| `400` | Validation error (missing/invalid email or OTP) |
| `401` | Invalid or expired OTP |
| `410` | OTP already used |
| `429` | Rate limit exceeded |
| `500` | Internal server error |

---

## Project Structure

```
├── src/
│   ├── config/db.js              # MongoDB connection
│   ├── controllers/otp.controller.js
│   ├── middleware/
│   │   ├── errorHandler.js       # Central error handler
│   │   ├── rateLimiter.js        # Rate limiting config
│   │   └── validate.js           # Input validation rules
│   ├── models/otp.model.js       # Mongoose schema + TTL
│   ├── routes/otp.routes.js      # Route definitions
│   ├── services/
│   │   ├── email.service.js      # Nodemailer SMTP
│   │   └── otp.service.js        # OTP crypto + hashing
│   ├── utils/ApiError.js         # Custom error class
│   └── app.js                    # Express app assembly
├── server.js                     # Entry point
├── .env.example                  # Environment template
└── package.json
```

---

## Environment Variables

See [.env.example](.env.example) for the full list. Key variables:

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 3000) |
| `MONGODB_URI` | MongoDB connection string |
| `SMTP_HOST` | Email server hostname |
| `SMTP_PORT` | Email server port |
| `SMTP_USER` | SMTP username |
| `SMTP_PASS` | SMTP password |
| `EMAIL_FROM` | Sender address |

---

## Security Measures

1. **OTP Hashing** — OTPs are bcrypt-hashed before storage
2. **TTL Auto-Expiry** — MongoDB deletes OTP documents after 60 seconds
3. **Rate Limiting** — Prevents brute-force and spam
4. **Helmet** — Sets secure HTTP response headers
5. **Input Validation** — All inputs sanitized and validated
6. **JSON Body Limit** — Request body capped at 10 KB
7. **No Sensitive Data Leakage** — Stack traces hidden in production
