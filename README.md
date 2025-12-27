# Cortex AI Complaint System 🤖✨

![License](https://img.shields.io/badge/license-MIT-blue.svg) ![Node.js](https://img.shields.io/badge/Node.js-v18-green.svg) ![React](https://img.shields.io/badge/React-v18-blue.svg) ![Status](https://img.shields.io/badge/Status-Production%20Ready-success)

A next-generation, **AI-powered Customer Support & Complaint Management System**. 
Designed for speed, elegance, and enterprise-grade reliability.

---

## 🚀 Features

### **🔥 AI-Powered Automation**
- **Smart Triage**: Google Gemini API analyzes incoming complaints to automatically determine **Category**, **Priority**, and **Department**.
- **Auto-Suggestions**: AI drafts suggested resolution responses for agents.

### **🎨 Enterprise UI (Dark Mode)**
- **Professional Dashboard**: Inspired by Linear/Vercel. High contrast, precise typography, and rigid bento-grid layouts.
- **Role-Based Portals**:
  - **User**: Clean, distraction-free interface to track history and submit new issues.
  - **Employee**: "Outlook-style" 3-pane inbox for high-speed ticket processing.
  - **Admin**: Executive analytics with real-time charts and system health monitoring.

### **⚡ Real-Time Notifications**
- Instant **Email Alerts** (via Nodemailer) when tickets are marked *In Progress* or *Resolved*.

---

## 🛠️ Technology Stack

- **Frontend**: React (Vite), Framer Motion, Recharts, Lucide Icons.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Data), Supabase (Auth).
- **AI Engine**: Google Gemini Pro.

---

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas URI
- Supabase Project (URL & Anon Key)
- Google Gemini API Key
- Gmail App Password (for notifications)

### 1. Clone the Repository
\`\`\`bash
git clone https://github.com/aniborra5757/ai-complaint-system.git
cd ai-complaint-system
\`\`\`

### 2. Backend Setup
\`\`\`bash
cd backend
npm install
cp .env.example .env
# Fill in your .env variables (MONGO_URI, SUPABASE_URL, GEMINI_KEY, EMAIL_PASS)
npm run seed  # (Optional) Seeds initial admin/employee accounts
npm run dev
\`\`\`

### 3. Frontend Setup
\`\`\`bash
cd frontend
npm install
cp .env.example .env
# Add VITE_API_URL and VITE_SUPABASE_URL
npm run dev
\`\`\`

---

## ☁️ Deployment Guide

### **Frontend (Vercel/Netlify)**
1.  Push this repo to GitHub.
2.  Import the project into Vercel.
3.  Set the **Root Directory** to `frontend`.
4.  Add Environment Variables (`VITE_API_URL`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) in the Vercel dashboard.
5.  Deploy! 🚀

### **Backend (Render/Railway)**
1.  Create a new Web Service on Render.
2.  Connect your GitHub repo.
3.  Set **Root Directory** to `backend`.
4.  Set **Build Command**: `npm install`
5.  Set **Start Command**: `npm start`
6.  Add all backend `.env` variables in the Render dashboard.
7.  Deploy! (Copy the Render URL and update your Frontend's `VITE_API_URL`).

---

## 🤝 Contribution

We welcome contributions! Please fork the repository and submit a Pull Request.

**Current Maintainer & Creator:**
**[aniborra5757](https://github.com/aniborra5757)** - *Lead Developer & Architect*

Built with ❤️ by **aniborra5757**.
