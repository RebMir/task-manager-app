 # ✅ Task Management App (MERN Stack)

A full-featured Task Management web app built using the MERN stack (MongoDB, Express.js, React, Node.js). It supports user authentication, task CRUD operations, dashboard statistics, and deployment with CI/CD and monitoring.

## 🌐 Live URLs

- 🔗 **Frontend**: (https://task-manager-app-1-3vuo.onrender.com)
- 🔗 **Backend API**: (https://task-manager-app-mvmv.onrender.com)
---

## 🧩 Tech Stack

- **Frontend**: React, Tailwind CSS, Redux Toolkit, RTK Query, Vite
- **Backend**: Node.js, Express.js, MongoDB (Atlas)
- **Authentication**: JWT + HttpOnly Cookies
- **Deployment**: Vercel (Frontend), Render (Backend)
- **CI/CD**: GitHub Actions
- **Monitoring**: UptimeRobot, Sentry

---

## ✨ Features

- ✅ User registration and login
- ✅ JWT-based authentication with cookies
- ✅ Dashboard with task stats
- ✅ Task creation, editing, deletion, filtering
- ✅ Soft delete & recovery (trash bin)
- ✅ Role-based access (e.g., admin vs. regular user)
- ✅ Responsive UI with dark mode

---

## ⚙️ Project Structure

TaskManagerApp/

├── client/ # React frontend (Vite)

├── server/ # Node + Express backend

├── .github/workflows/ # GitHub Actions CI/CD pipelines

├── README.md

└── .env.example


## 📦 Environment Variables

### 🔐 `.env.example`

```env
# === Backend ===
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLIENT_URL=https://your-frontend-url.com

# === Frontend ===
VITE_API_URL=https://your-backend-url.com/api
Copy this to .env in both server/ and client/ folders and provide actual values.
```

## 🚀 Deployment Instructions
### 🧭 Backend Deployment (Render)
```
- Go to https://render.com

- Create a new Web Service from your GitHub repo

- Set build command: npm install

- Set start command: npm run dev or node index.js

- Add environment variables from .env

- Enable "Auto Deploy from GitHub"
```
### 🌐 Frontend Deployment (Vercel)
```
- Go to https://vercel.com

- Import GitHub repo and select /client as root

- Add VITE_API_URL env var

- Build command: npm run build

- Output directory: dist
```

## 🔍 Monitoring & Maintenance
- Health Check: GET /api/health (returns { status: 'ok' })

- Uptime Monitor: UptimeRobot

- Error Tracking: Sentry

- Logs: View via Render/Vercel dashboard

## 🧪 Testing
```
# Backend
cd server
npm run test

# Frontend
cd client
npm run test
```

## 🧼 Maintenance Plan
- Weekly updates of dependencies (npm update)

- Monthly MongoDB backups via Atlas

- Watch logs for errors or warnings

- Plan for future feature updates

## 📸 Screenshots

