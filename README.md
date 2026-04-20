# 🌺 FemFlow — Menstrual Health Tracker with AI Insights

## 🎯 Problem Statement

Most period tracking apps only tell you *when* your next period is coming. They don't tell you **why** you feel the way you do, **what** to expect each phase, or **how** your symptoms are connected to your cycle.

**Who is the user?**
People who menstruate — students, working professionals, or anyone who wants to understand their body better and make informed decisions about their health, energy, and lifestyle.

**What problem are we solving?**
Users lack visibility into their own cycle patterns. They experience recurring symptoms — cramps, fatigue, brain fog, mood swings — without understanding that these are predictable and phase-specific. Existing apps treat the cycle as a countdown timer, not a health tool.

**Why does it matter?**
Understanding your cycle is understanding yourself. When someone knows they'll be low-energy in their luteal phase, they can plan accordingly. When they see that headaches always cluster during menstruation, they can manage it proactively. This app turns passive logging into **actionable insight**.

---

## ✨ Features

### Core Features
- **Authentication** — Email/password sign up & login via Firebase Auth
- **Cycle Logging** — Log daily flow intensity, mood, symptoms, and notes
- **Period Prediction** — Predicts next period and ovulation window from logged history
- **Protected Routes** — All pages require authentication

### Key Features (Problem-Solving)
- **Dashboard** — Shows current cycle phase, cycle day, days until next period, and a quick-log form
- **Calendar** — Color-coded monthly view with predicted phase overlays and logged-day markers
- **History** — Searchable log of all past entries with delete functionality
- **Insights** — Symptom frequency charts, mood pattern analysis, and symptom-by-phase matrix
- **Trends** — Recharts visualisations: cycle length history, flow intensity over time, symptom frequency bar chart, and a regularity score
- **Education** — Deep-dive cards for all 4 cycle phases (menstrual, follicular, ovulation, luteal) with self-care tips, hormone explanations, and an FAQ
- **AI Assistant** — Powered by Google Gemini 2.5 Flash; answers health questions personalised to the user's actual cycle data (phase, cycle day, top symptoms)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 (Vite) |
| Routing | React Router v6 |
| State Management | Context API (AuthContext + LogsContext) |
| Backend / Auth | Firebase Authentication |
| Database | Cloud Firestore |
| Charts | Recharts |
| AI | Google Gemini 2.5 Flash API |
| Styling | Custom CSS (DM Sans + DM Serif Display) |
| Deployment | Vercel / Netlify |

---

## ⚛️ React Concepts Demonstrated

| Concept | Where Used |
|---|---|
| Functional Components | Every file |
| `useState` | Dashboard, Login, Calendar, Education, History, Assistant |
| `useEffect` | AuthContext (auth listener), LogsContext (data fetch), Assistant (scroll) |
| `useMemo` | useLogs.js (cycle calculations), Insights, Trends, Calendar, History |
| `useCallback` | LogsContext (`fetchLogs`) |
| `useRef` | Assistant (auto-scroll to latest message) |
| `useContext` | Every page via `useAuth()` and `useLogs()` |
| Lifting State Up | LogsContext provides shared state to all pages |
| Controlled Components | All forms (log form, login form, search, date picker) |
| Conditional Rendering | Auth guards, empty states, loading states, error banners |
| Lists & Keys | History, Insights, LogItem, Trends charts |
| React Router | 8 routes with protected route wrapper |
| Context API | AuthContext + LogsContext for global state |
| Lazy Loading | All pages loaded with `React.lazy` + `Suspense` |
| Code Splitting | Automatic via lazy imports |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── ButtonGroup.jsx     # Reusable toggle button group (flow, mood, symptoms)
│   ├── Card.jsx            # Reusable card wrapper
│   ├── LogItem.jsx         # Single history entry with confirm-delete
│   ├── Navbar.jsx          # Sidebar (desktop) + bottom nav (mobile)
│   └── Navbar.css
├── context/
│   ├── AuthContext.jsx     # Firebase auth state — provides useAuth()
│   └── LogsContext.jsx     # CRUD operations — provides useLogs()
├── hooks/
│   └── useLogs.js          # Cycle prediction logic, derived stats, phase detection
├── pages/
│   ├── Login.jsx           # Sign in / Create account with toggle
│   ├── Dashboard.jsx       # Cycle overview + quick-log form
│   ├── Calendar.jsx        # Monthly calendar with phase colour overlay
│   ├── History.jsx         # All entries, searchable
│   ├── Insights.jsx        # Symptom patterns, mood stats, phase matrix
│   ├── Trends.jsx          # Recharts data visualisations
│   ├── Education.jsx       # Phase education cards + FAQ accordion
│   └── Assistant.jsx       # AI chat powered by Gemini API
├── services/
│   └── firebase.js         # Firebase init + auth + Firestore helpers
├── App.jsx                 # Router, providers, lazy loading, protected routes
├── App.css                 # Global design system
└── index.css               # Reset + scrollbar
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+
- A Firebase account (free)
- A Google AI Studio account (free)

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/femflow.git
cd femflow
npm install
```

### 2. Firebase setup

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create a new project
3. Enable **Authentication** → Email/Password
4. Create a **Firestore Database** (start in production mode)
5. Go to Project Settings → Your Apps → Add Web App
6. Copy your config into `src/services/firebase.js`

**Firestore Security Rules** (paste in Firebase console → Firestore → Rules):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 3. Gemini API key

1. Go to [aistudio.google.com](https://aistudio.google.com) → Get API Key → Create API Key
2. Create a `.env` file in the project root:

```env
VITE_GEMINI_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXX
```

> ⚠️ Add `.env` to `.gitignore` before pushing to GitHub.

### 4. Run locally

```bash
npm run dev
```

### 5. Deploy

```bash
# Vercel
npx vercel

# or Netlify
npx netlify deploy --prod
```


## 🤖 AI Assistant — How It Works

The AI Assistant page is the differentiating feature. On every message, the app:

1. Reads the user's current cycle data from the `useLogs` hook — phase, cycle day, average cycle length, next period date, and top 5 symptoms
2. Builds a personalised system prompt with this data
3. Sends it to **Gemini 2.5 Flash** (`v1beta` endpoint) alongside the full conversation history
4. Streams back a response that is contextually aware of the user's body

This means the AI doesn't give generic advice — it knows you're on Day 22 in your luteal phase with frequent headaches, and responds accordingly.

##Live link

https://fem-flow-menstrual-cycle-tracker-sh.vercel.app/

## 👩‍💻 Author
Anoushka Deolia

---
