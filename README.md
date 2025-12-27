# AI Complaint System

A full-stack intelligent complaint management system featuring a React frontend and Node.js/Express backend. The system uses a hybrid AI approach (Cloud LLM with local fallback) to automatically categorize and prioritize customer complaints.

## Tech Stack

- **Frontend**: React (Vite), Vanilla CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas (Data), Supabase (Auth)
- **AI**: Hybrid (OpenAI/Claude compatible + Local NLP Fallback)

## Prerequisites

- Node.js (LTS recommended)
- MongoDB Atlas Account
- Supabase Account

## Setup

### Backend

1. Navigate to `backend/`
2. `npm install`
3. Create `.env` file (see `.env.example`)
4. `npm start`

### Frontend

1. Navigate to `frontend/`
2. `npm install`
3. `npm run dev`
