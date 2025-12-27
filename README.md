# 🧠 Cortex AI - Intelligent Complaint Management System

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![React](https://img.shields.io/badge/Frontend-React%2018-61DAFB?logo=react)
![Node](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb)
![AI](https://img.shields.io/badge/AI-Gemini%20Pro-8E75B2?logo=google)
![Status](https://img.shields.io/badge/Status-Production%20Ready-success)

> **Next-Gen Customer Support Automation**
> 
> **Cortex AI** is an enterprise-grade platform that revolutionizes complaint tracking. It leverages **Google Gemini LLM** to automatically classify, prioritize, and draft solutions for customer issues, packaged in a stunning "Enterprise Dark" UI.

---

## 🔗 Live Demo & Links

| Component | Status | URL |
| :--- | :--- | :--- |
| **Frontend (App)** | 🟢 Live | [**Launch App on Vercel**](https://ai-complaint-system.vercel.app) *(Update to your Vercel URL)* |
| **Backend (API)** | 🟢 Live | [**API Health Check**](https://ai-complaint-system-rm9f.onrender.com) |
| **Repository** | 📁 GitHub | [**View Source**](https://github.com/aniborra5757/ai-complaint-system) |

---

## 🌟 Application Modules

### 1. **User Portal (Client)**
*   **Zero-Friction Reporting**: Simple, distraction-free form for submitting complaints.
*   **Live Tracking**: Users can see real-time updates on their ticket status.
*   **Smart History**: A clean card-view history of all past interactions.

### 2. **Employee Workspace (Agent)**
*   **"Outlook-Style" Inbox**: High-efficiency 3-column layout for rapid ticket processing.
*   **AI Copilot**:
    *   **Auto-Sentiment**: Instantly see if a user is "Angry", "Neutral", or "Happy".
    *   **Smart Drafts**: Generate professional email responses with one click.
*   **Real-Time Status**: Instant visual cues for 'Open', 'In Progress', and 'Resolved' tickets.

### 3. **Executive Dashboard (Admin)**
*   **Bento-Grid Analytics**: A minimal, data-first dashboard visualizing ticket volume and resolution health.
*   **Priority Distribution**: Pie charts breaking down Critical vs. Routine issues.
*   **System Health**: Real-time monitoring of API uptime and AI confidence levels.

---

## 🔐 User Management & Access Control

The system uses a **Hybrid Auth** model:
1.  **Supabase**: Handles Identity (Login/Sign Up/Passwords).
2.  **MongoDB**: Handles Roles (Admin/Employee/User).

### **How to Create Admins & Employees**
Since typical "Sign Up" only creates standard Users, you must **Pre-Authorize** Admins and Employees using the Seed Script.

#### **Method A: The "Seed" Script (Recommended)**
This script tells the database: *"Hey, if **test_admin@demo.com** signs up, make them an **Admin**."*

1.  Open `backend/seed.js` and edit the credentials if needed:
    ```javascript
    // backend/seed.js
    const users = [
        { email: 'my_admin@sys.com', role: 'admin' },
        { email: 'my_agent@sys.com', role: 'employee' }
    ];
    ```
2.  Run the seeder:
    ```bash
    cd backend
    npm run seed
    ```
3.  **CRITICAL STEP**: Now, go to the Frontend and **Sign Up** using that exact email (`my_admin@sys.com`).
    *   The system will detect the pre-authorized role and grant Admin access immediately.

#### **Method B: Manual Entry (MongoDB Atlas)**
If you cannot run the script, add the user directly to your MongoDB `users` collection:
```json
{
  "email": "executive@company.com",
  "role": "admin",
  "supabase_uid": "placeholder_until_signup"
}
```
*Then, perform the standard Sign Up on the frontend.*

---

## 🛠️ Technology Stack

*   **Frontend**: React 18, Vite, Framer Motion, Recharts, Lucide Icons.
*   **Backend**: Node.js, Express.js, REST API.
*   **Database**: MongoDB Atlas (Data), Supabase (Auth).
*   **AI Engine**: Google Generative AI (`gemini-pro`).
*   **Infrastructure**: Vercel (Frontend), Render (Backend).

---

## 🚀 Deployment Instructions

### **Phase 1: Backend (Render)**
1.  Fork/Clone this repo.
2.  Create a **Web Service** on Render connected to the `backend` folder.
3.  Set **Build Command**: `npm install`
4.  Set **Start Command**: `npm start`
5.  Add Env Vars used locally (`MONGO_URI`, `SUPABASE_URL`, `GEMINI_KEY`, etc.).

### **Phase 2: Frontend (Vercel)**
1.  Import the project to Vercel and select the `frontend` folder.
2.  Set **Framework Preset**: Vite.
3.  Add Env Vars:
    *   `VITE_API_URL`: Your Render URL + `/api` (e.g., `https://my-api.onrender.com/api`)
    *   `VITE_SUPABASE_URL`: Your Supabase URL.
    *   `VITE_SUPABASE_ANON_KEY`: Your Supabase Anon Key.
4.  **Deploy**!

---

## 🤝 Contribution

We welcome contributions! Please fork the repository and submit a Pull Request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 👑 Credits

**Creator & Lead Architect:**
**[aniborra5757](https://github.com/aniborra5757)** - *Engineering Excellence.*

---

**License**: Distributed under the MIT License.
