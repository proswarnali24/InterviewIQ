# InterviewIQ

InterviewIQ is a full-stack AI mock interview platform built to help candidates practice role-specific interviews, upload resumes, generate question sets, answer timed prompts, and review performance reports.

## Overview

The project is split into two apps:

- `client/`: React + Vite frontend
- `server/`: Express + MongoDB backend

The platform supports:

- Resume upload and PDF text extraction
- AI-assisted resume analysis
- Interview question generation based on role, experience, projects, and skills
- Timed interview rounds with structured answer submission
- Interview history and detailed reports
- Credit-based usage flow
- Razorpay payment integration for purchasing credits
- Firebase integration on the frontend
- Render-ready deployment using a single Node web service

## Tech Stack

### Frontend

- React 19
- Vite
- Redux Toolkit
- React Router
- Tailwind CSS
- Recharts
- jsPDF / jspdf-autotable
- Firebase

### Backend

- Node.js
- Express
- MongoDB + Mongoose
- JWT authentication
- Multer
- pdfjs-dist
- Razorpay
- OpenRouter-compatible AI integration

## Project Structure

```text
3.interviewIQ/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   └── utils/
│   └── package.json
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── package.json
└── README.md
```

## Core Flow

1. A user signs up or logs in.
2. The user uploads a resume PDF.
3. The backend extracts text and generates structured profile data.
4. The user starts an interview by selecting role, experience, and interview mode.
5. The system generates five interview questions.
6. Answers are submitted and stored.
7. The final report can be reviewed later from interview history.

## API Areas

The backend exposes these main route groups:

- `/api/auth` for authentication
- `/api/user` for current user data and profile actions
- `/api/interview` for resume analysis, question generation, answer submission, interview completion, history, and reports
- `/api/payment` for Razorpay order creation and payment verification

## Environment Variables

### Client

Create `client/.env`:

```env
VITE_SERVER_URL=http://localhost:6000
VITE_FIREBASE_APIKEY=your_value
VITE_FIREBASE_AUTH_DOMAIN=your_value
VITE_FIREBASE_PROJECT_ID=your_value
VITE_FIREBASE_STORAGE_BUCKET=your_value
VITE_FIREBASE_MESSAGING_SENDER_ID=your_value
VITE_FIREBASE_APP_ID=your_value
VITE_GOOGLE_CLIENT_ID=your_value
VITE_RAZORPAY_KEY_ID=your_value
```

### Server

Create `server/.env`:

```env
PORT=6000
MONGODB_URL=your_mongodb_connection_string
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your_jwt_secret
OPENROUTER_API_KEY=your_openrouter_api_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/proswarnali24/InterviewIQ.git
cd InterviewIQ
```

### 2. Install dependencies

```bash
cd client
npm install
```

```bash
cd ../server
npm install
```

### 3. Start the backend

```bash
cd server
npm run dev
```

### 4. Start the frontend

```bash
cd client
npm run dev
```

Frontend default: `http://localhost:5173`

Backend default: `http://localhost:6000`

## Deploy on Render

This repo includes a top-level `render.yaml` so it can be deployed as a single Render web service.

### Render setup

1. Push the repository to GitHub.
2. In Render, create a new Blueprint deployment from this repository.
3. Render will detect `render.yaml` and create the `interviewiq` web service.
4. Add the required environment variables in Render before the first successful deploy.

### Required Render environment variables

- `MONGODB_URL`
- `JWT_SECRET`
- `OPENROUTER_API_KEY`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `FRONTEND_URL`
- `VITE_GOOGLE_CLIENT_ID`
- `VITE_RAZORPAY_KEY_ID`
- `VITE_FIREBASE_APIKEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

### Important deployment notes

- Set `FRONTEND_URL` to your final Render app URL, for example `https://interviewiq.onrender.com`.
- Add the same Render URL to your Google OAuth authorized JavaScript origins.
- Update Firebase authorized domains to include your Render domain.
- If you want client-side Razorpay checkout to work, also make sure the published frontend has access to `VITE_RAZORPAY_KEY_ID`.

## Notes

- The backend requires a valid MongoDB connection before the app can be used.
- Question generation and resume analysis use AI when `OPENROUTER_API_KEY` is configured.
- The backend includes fallback behavior for question generation when AI is unavailable.
- Razorpay integration is required for live credit purchases.

## Future Improvements

- Add automated tests for interview and payment flows
- Add deployment configuration for frontend and backend
- Improve admin/reporting capabilities
- Support more interview modes and richer scoring signals

## Author

Maintained by [proswarnali24](https://github.com/proswarnali24)
