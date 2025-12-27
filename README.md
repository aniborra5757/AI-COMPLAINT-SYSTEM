# 🧠 Cortex AI - Intelligent Complaint Management System

![License](https://img.shields.io/badge/License-MIT-blue.svg) 
![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?logo=react) 
![Node](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb)
![AI](https://img.shields.io/badge/AI-Gemini%20Pro-8E75B2?logo=google)
![Status](https://img.shields.io/badge/Status-Production%20Ready-success)

> **Next-Gen Customer Support Automation**  
> Cortex AI revolutionizes complaint tracking by using Google Gemini LLMs to auto-classify, prioritize, and draft solutions for customer issues. Built for speed, security, and scale.

---

## 🌟 Key Features

### 🤖 **AI-Driven Core**
- **Smart Triage**: Automatically categorizes tickets (Billing, Technical, etc.) and assigns priority based on sentiment analysis using **Google Gemini Pro**.
- **Auto-Draft Responses**: Empowers agents with one-click, AI-generated professional responses.

### 🎨 **Enterprise-Grade UI/UX**
- **"Dark Mode" by Default**: A visually stunning, high-contrast interface inspired by tools like Linear and Vercel.
- **Role-Based Experience**:
    - **User Portal**: Distraction-free submission and tracking.
    - **Agent Workspace**: A "Gmail-style" 3-pane efficient inbox.
    - **Executive Dashboard**: Real-time analytics, charts, and system health metrics.

### ⚡ **Real-Time Operations**
- **Instant Notifications**: Automated email alerts via Nodemailer for ticket status updates ("In Progress", "Resolved").
- **Live Metrics**: Dynamic charts visualizing ticket volume and resolution rates.

---

## 🏗️ Architecture & Tech Stack

The application is built as a **Monorepo** containing both the Client and Server.

### **Frontend (`/frontend`)**
- **Framework**: React 18 (Vite) for blazing fast performance.
- **Styling**: Custom CSS Variables (No external UI libraries bloat).
- **Animations**: `framer-motion` for smooth, professional transitions.
- **Visualization**: `recharts` for data analytics.
- **Routing**: `react-router-dom` with protected role-based routes.

### **Backend (`/backend`)**
- **Runtime**: Node.js & Express.js.
- **Database**: MongoDB (Mongoose Schema).
- **Authentication**: Supabase Auth (JWT Verification).
- **AI Engine**: Google Generative AI SDK (`@google/generative-ai`).
- **Email**: Nodemailer (SMTP).

---

## � Project Structure

```bash
ai-complaint-system/
├── frontend/             # React Client
│   ├── src/
│   │   ├── components/   # Reusable UI (Sidebar, Forms)
│   │   ├── pages/        # Portals (Admin, Employee, User)
│   │   ├── api/          # Axios interceptors & endpoints
│   │   └── index.css     # Enterprise Design System
├── backend/              # Node/Express API
│   ├── src/
│   │   ├── controllers/  # Business Logic
│   │   ├── models/       # Mongoose Schemas
│   │   ├── services/     # AI & Email Services
│   │   └── middleware/   # Auth & Validation
├── README.md             # You are here
└── .gitignore            # Security rules
```

---

## 🚀 Deployment Guide (Go Live!)

This system is designed to be deployed separately: free hosting works perfectly.

### **Step 1: Backend Deployment (Render / Railway)**

1.  **Push to GitHub**: Ensure this code is in your GitHub repo.
2.  **Create Web Service**: Go to [Render.com](https://render.com) -> New + -> Web Service.
3.  **Connect Repo**: Select your `ai-complaint-system` repo.
4.  **Settings**:
    - **Root Directory**: `backend`
    - **Build Command**: `npm install`
    - **Start Command**: `npm start`
5.  **Environment Variables**: Add these in the Render dashboard:
    - `MONGO_URI`: Your MongoDB Connection String.
    - `SUPABASE_URL`: Your Supabase URL.
    - `SUPABASE_ANON_KEY`: Your Supabase Key.
    - `GEMINI_KEY`: Your Google AI API Key.
    - `EMAIL_USER` / `EMAIL_PASS`: Your Gmail credentials.
6.  **Deploy**: Click Create. Render will give you a URL (e.g., `https://cortex-api.onrender.com`).

### **Step 2: Frontend Deployment (Vercel)**

1.  **Import Project**: Go to [Vercel.com](https://vercel.com) -> Add New -> Project.
2.  **Connect Repo**: Select `ai-complaint-system`.
3.  **Framework Preset**: Select **Vite**.
4.  **Root Directory**: Click "Edit" and select `frontend`.
5.  **Environment Variables**:
    - `VITE_API_URL`: The URL you got from Render (step 1) + `/api` (e.g., `https://cortex-api.onrender.com/api`).
    - `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`: Same as backend.
6.  **Deploy**: Click Deploy. You are live! 🌍

---

## 👨‍💻 Local Development Setup

If you want to run this locally on your machine:

1.  **Clone the Repo**
    ```bash
    git clone https://github.com/aniborra5757/ai-complaint-system.git
    cd ai-complaint-system
    ```

2.  **Backend**
    ```bash
    cd backend
    npm install
    # Setup .env file
    npm run dev
    ```

3.  **Frontend**
    ```bash
    cd frontend(new terminal)
    npm install
    # Setup .env file
    npm run dev
    ```

---

## 🤝 Contribution

This project is open-source. We welcome contributions to make it even better.

1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---

## 👑 Credits

**Creator & Lead Architect:**
**[aniborra5757](https://github.com/aniborra5757)** - *Built with precision, focused on Quality.*

---

**License**: Distributed under the MIT License.
