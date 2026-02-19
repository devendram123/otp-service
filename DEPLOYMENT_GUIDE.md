# 🚀 Deploy a REST API for Free — Complete Guide

A step-by-step guide to deploy a Node.js API on a **100% free** server and test it with **curl** and **Postman**.

---

## Platform: Render.com (Free Tier)

| Feature | Details |
|---------|---------|
| **Cost** | $0 — no credit card required |
| **Stack** | Node.js, Python, Go, Docker, etc. |
| **Deploy from** | GitHub / GitLab |
| **Free tier limits** | 750 hours/month, spins down after 15 min of inactivity (cold starts ~30s) |
| **Public URL** | `https://your-app-name.onrender.com` |

> [!TIP]
> **Alternatives** if you want instant, zero-setup hosting:
> - [**Glitch.com**](https://glitch.com) — edit and run in-browser, no Git needed
> - [**Vercel**](https://vercel.com) — great for serverless functions (no persistent server)

---

## Step 1 — Minimal API Source Code

Create a project folder with **3 files**. You can use your existing `d:\API` project or create a new one.

### `server.js`

```js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// ── Parse JSON bodies ────────────────────────────────────
app.use(express.json());

// ── GET / — Health check ─────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'API is live!',
    timestamp: new Date().toISOString()
  });
});

// ── POST /api/test — Sample endpoint ─────────────────────
app.post('/api/test', (req, res) => {
  const { name, message } = req.body;

  // Validate input
  if (!name || !message) {
    return res.status(400).json({
      success: false,
      error: 'Both "name" and "message" fields are required.'
    });
  }

  // Return a response
  res.status(200).json({
    success: true,
    data: {
      greeting: `Hello, ${name}!`,
      echo: message,
      receivedAt: new Date().toISOString()
    }
  });
});

// ── Start server ─────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### `package.json`

```json
{
  "name": "free-api-demo",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.21.0"
  }
}
```

### `.gitignore`

```
node_modules/
.env
```

---

## Step 2 — Push Code to GitHub

### 2.1 — Create a GitHub account (skip if you have one)

Go to [github.com/signup](https://github.com/signup) → sign up for free.

### 2.2 — Create a new repository

1. Click the **+** icon (top-right) → **New repository**
2. Name: `free-api-demo`
3. Visibility: **Public** (Render free tier requires public repos, or connect GitHub App for private)
4. **Do NOT** initialize with README (we'll push our own code)
5. Click **Create repository**

### 2.3 — Push your code

Open a terminal in your project folder and run:

```bash
git init
git add .
git commit -m "Initial commit - minimal API"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/free-api-demo.git
git push -u origin main
```

> [!IMPORTANT]
> Replace `YOUR_USERNAME` with your actual GitHub username.

---

## Step 3 — Deploy on Render.com

### 3.1 — Create a Render account

1. Go to [render.com](https://render.com)
2. Click **Get Started for Free**
3. Sign up with **GitHub** (easiest — links your repos automatically)

### 3.2 — Create a new Web Service

1. From the Render Dashboard, click **New** → **Web Service**
2. Connect your GitHub repository (`free-api-demo`)
3. Configure the service:

| Setting | Value |
|---------|-------|
| **Name** | `free-api-demo` (or any name you like) |
| **Region** | Choose the closest to you |
| **Branch** | `main` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `node server.js` |
| **Instance Type** | **Free** |

4. Click **Create Web Service**

### 3.3 — Wait for deployment

- Render will install dependencies and start your server
- Takes **1–3 minutes** on first deploy
- Once done, you'll see: **"Your service is live 🎉"**
- Your public URL will be displayed at the top:

```
https://free-api-demo.onrender.com
```

> [!NOTE]
> The free tier **spins down after 15 minutes of inactivity**. The first request after inactivity takes ~30 seconds (cold start). Subsequent requests are fast.

---

## Step 4 — Test with curl

### 4.1 — Health check (GET)

```bash
curl https://free-api-demo.onrender.com/
```

**Expected response:**

```json
{
  "status": "ok",
  "message": "API is live!",
  "timestamp": "2026-02-19T07:15:00.000Z"
}
```

### 4.2 — POST request (happy path)

```bash
curl -X POST https://free-api-demo.onrender.com/api/test \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"Devendra\", \"message\": \"Hello from curl!\"}"
```

**Expected response (`200 OK`):**

```json
{
  "success": true,
  "data": {
    "greeting": "Hello, Devendra!",
    "echo": "Hello from curl!",
    "receivedAt": "2026-02-19T07:15:05.000Z"
  }
}
```

### 4.3 — POST request (validation error)

```bash
curl -X POST https://free-api-demo.onrender.com/api/test \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"Devendra\"}"
```

**Expected response (`400 Bad Request`):**

```json
{
  "success": false,
  "error": "Both \"name\" and \"message\" fields are required."
}
```

### 💡 Windows CMD / PowerShell users

If you're on **Windows CMD**, use double quotes for the entire `-d` argument:

```cmd
curl -X POST https://free-api-demo.onrender.com/api/test -H "Content-Type: application/json" -d "{\"name\": \"Devendra\", \"message\": \"Hello from curl!\"}"
```

If you're on **PowerShell**, use `Invoke-RestMethod`:

```powershell
$body = @{ name = "Devendra"; message = "Hello from PowerShell!" } | ConvertTo-Json
Invoke-RestMethod -Uri "https://free-api-demo.onrender.com/api/test" -Method POST -Body $body -ContentType "application/json"
```

---

## Step 5 — Test with Postman

### 5.1 — Install Postman

Download from [postman.com/downloads](https://www.postman.com/downloads/) (free, no account required to use).

### 5.2 — Create a GET request (health check)

| Setting | Value |
|---------|-------|
| **Method** | `GET` |
| **URL** | `https://free-api-demo.onrender.com/` |

Click **Send** → you should see the health check JSON response.

### 5.3 — Create a POST request

| Setting | Value |
|---------|-------|
| **Method** | `POST` |
| **URL** | `https://free-api-demo.onrender.com/api/test` |

**Headers tab:**

| Key | Value |
|-----|-------|
| `Content-Type` | `application/json` |

**Body tab:**

1. Select **raw**
2. Choose **JSON** from the dropdown
3. Paste this JSON:

```json
{
  "name": "Devendra",
  "message": "Hello from Postman!"
}
```

4. Click **Send**

**Expected response:**

```json
{
  "success": true,
  "data": {
    "greeting": "Hello, Devendra!",
    "echo": "Hello from Postman!",
    "receivedAt": "2026-02-19T07:20:00.000Z"
  }
}
```

---

## Quick Reference

| What | URL / Command |
|------|---------------|
| **Live API** | `https://free-api-demo.onrender.com` |
| **Health check** | `GET /` |
| **Test endpoint** | `POST /api/test` |
| **Render Dashboard** | [dashboard.render.com](https://dashboard.render.com) |
| **View logs** | Render Dashboard → your service → **Logs** tab |
| **Redeploy** | Push to GitHub → Render auto-deploys, OR click **Manual Deploy** in dashboard |

---

## Deploying Your OTP API

Once you're comfortable with this minimal example, you can deploy the full OTP API from `d:\API` the same way:

1. Push the `d:\API` project to a GitHub repo
2. Create a new Render Web Service pointing to that repo
3. Add **environment variables** in Render Dashboard → **Environment** tab:
   - `MONGODB_URI` → Use [MongoDB Atlas](https://cloud.mongodb.com) free tier (M0 cluster)
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM`
   - `NODE_ENV=production`
4. Deploy — your OTP API will be live at `https://your-otp-api.onrender.com`

> [!CAUTION]
> Never commit `.env` files or secrets to GitHub. Always use the hosting platform's environment variables UI.
