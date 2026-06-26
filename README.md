# AI-Powered Resume Screener & HR Tracker

A full-stack MERN application that leverages **Google Gemini AI** to automatically screen and score candidate resumes against job descriptions. Built with a modern dark-mode dashboard for HR teams to manage job postings, review AI-analyzed applications, and track their hiring pipeline.

![Stack](https://img.shields.io/badge/MERN-Express%20%7C%20React%20%7C%20MongoDB%20%7C%20Node.js-6366f1)
![AI](https://img.shields.io/badge/AI-Google%20Gemini%202.5%20Flash-34d399)
![Frontend](https://img.shields.io/badge/Frontend-Vite%20%7C%20Tailwind%20CSS%20%7C%20Lucide-0ea5e9)

---

## Features

- **Dashboard Overview** — Aggregate stats across all job postings: total applications, average AI match score, and shortlisted candidate count with a recent activity table.
- **Job Listings Management** — Create and view job openings with candidate counts per position.
- **AI Resume Screening** — Submit a candidate's resume text against a specific job; Gemini 2.5 Flash analyzes skill alignment, experience depth, and gaps, returning a fit score (0–100) and a bullet-point summary.
- **Candidate Review** — Browse all applications per job with visual score rings, expandable AI summaries, and status badges.
- **Dark-Mode Dashboard** — Clean, minimal SaaS aesthetic (inspired by Linear/Vercel) with responsive sidebar navigation that collapses to a bottom tab bar on mobile.

---

## Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| [React 18](https://react.dev) | UI framework |
| [Vite 5](https://vitejs.dev) | Dev server & bundler |
| [Tailwind CSS 3](https://tailwindcss.com) | Utility-first styling |
| [Lucide React](https://lucide.dev) | Icon library |
| [React Router 6](https://reactrouter.com) | Client-side routing |
| [Axios](https://axios-http.com) | HTTP client |

### Backend

| Technology | Purpose |
|---|---|
| [Express 5](https://expressjs.com) | HTTP server & routing |
| [MongoDB + Mongoose 9](https://mongoosejs.com) | Database & ODM |
| [Google Gemini AI](https://ai.google.dev) (`@google/genai`) | Resume analysis |
| [dotenv](https://github.com/motdotla/dotenv) | Environment variables |
| [cors](https://github.com/expressjs/cors) | Cross-origin requests |

---

## Project Structure

```
resume-screener-hr-tracker2/
├── server/                          # Express backend
│   ├── server.js                    # App entry, middleware, DB connection
│   ├── models/
│   │   ├── Job2.js                  # Job schema (title, description)
│   │   └── Application2.js          # Application schema (candidate, AI fields)
│   ├── routes/
│   │   ├── job2routes.js            # CRUD for jobs
│   │   └── application2routes.js    # Submit + list applications (triggers AI)
│   ├── services/
│   │   └── aiService.js             # Gemini integration with fallback
│   ├── .env                         # MONGO_URI, GEMINI_API_KEY, PORT
│   └── package.json
│
├── client/                          # React frontend
│   ├── src/
│   │   ├── api/axios.js             # Axios instance → localhost:5000/api
│   │   ├── components/              # Reusable UI kit
│   │   │   ├── Layout.jsx           # Responsive shell (sidebar + bottom nav)
│   │   │   ├── Sidebar.jsx          # Desktop sidebar & mobile bottom nav
│   │   │   ├── Button.jsx           # 4 variants, 3 sizes, loading state
│   │   │   ├── StatCard.jsx         # Summary card with icon & trend
│   │   │   ├── Modal.jsx            # Overlay modal with ESC close
│   │   │   ├── Badge.jsx            # 5 color variants
│   │   │   ├── ScoreRing.jsx        # SVG circular score indicator
│   │   │   ├── DropZone.jsx         # Drag-and-drop file upload
│   │   │   ├── LoadingSkeleton.jsx  # Card/table/list skeletons
│   │   │   └── ErrorAlert.jsx       # Dismissable error banner
│   │   └── pages/
│   │       ├── Dashboard.jsx        # Stats cards + recent applications table
│   │       ├── Jobs.jsx             # Job listings + create modal
│   │       └── Applications.jsx     # Job selector + upload form + candidate cards
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## API Endpoints

### Jobs (`/api/jobs`)

| Method | Path | Description | Body |
|---|---|---|---|
| `GET` | `/` | List all jobs (newest first) | — |
| `POST` | `/` | Create a new job posting | `{ title, description }` |

### Applications (`/api/applications`)

| Method | Path | Description | Body / Params |
|---|---|---|---|
| `POST` | `/` | Submit application (triggers AI analysis) | `{ job2Id, candidateName, email, resumeRawText }` |
| `GET` | `/job/:job2Id` | Get all applications for a specific job | URL param `job2Id` |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) 18+
- [MongoDB](https://www.mongodb.com) instance (local or Atlas)
- [Google Gemini API key](https://aistudio.google.com/apikey)

### 1. Clone & Install

```bash
git clone https://github.com/mehdi869/resume-screener-hr-tracker2.git
cd resume-screener-hr-tracker2

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Environment

Create `server/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
```

### 3. Run the Application

Start the backend (from `server/`):

```bash
npm run dev     # with nodemon (hot reload)
# or
npm start       # production mode
```

Start the frontend (from `client/`):

```bash
npm run dev     # → http://localhost:5173
```

The frontend proxies API calls to `http://localhost:5000/api` via the Axios instance configured in `src/api/axios.js`.

### 4. Build for Production

```bash
cd client
npm run build   # outputs to client/dist/
```

---

## How AI Screening Works

1. A job posting is created with a title and description.
2. When an application is submitted, the raw resume text is sent alongside the job details to Google Gemini 2.5 Flash.
3. The model evaluates the resume against the job requirements and returns a JSON response containing:
   - **aiScore** (0–100) — how well the candidate matches the role.
   - **aiSummary** — a bullet-point assessment covering skill alignment, experience level, and critical gaps.
4. If the API key is missing or the Gemini call fails, a fallback mock response is returned so the app remains usable during development.

---

## Frontend Design

The UI follows a **dark mode-first** approach with a zinc/indigo color palette:

- **Desktop**: Fixed left sidebar (64px wide) with navigation links.
- **Mobile**: Bottom tab navigation bar with three icons.
- **Loading states**: Skeleton placeholders for cards, tables, and lists.
- **Error states**: Dismissable alert banners with icon indicators.
- **Score visualization**: SVG circular progress rings with color thresholds (green ≥80, amber ≥60, orange ≥40, red <40).

All components are modular and reusable — `Button`, `Modal`, `Badge`, `StatCard`, `ScoreRing`, `DropZone`, `LoadingSkeleton`, and `ErrorAlert` are independently composable.

---

## License

ISC
