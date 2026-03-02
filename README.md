# ComplianceQA — Frontend

React + Vite + Tailwind CSS frontend for the AI-powered YouTube video compliance auditing system.

---

## Architecture

```
frontend/
├── index.html
├── src/
│   ├── main.jsx                  # App entry point
│   ├── App.jsx                   # Router
│   ├── index.css                 # Global styles + Tailwind
│   ├── pages/
│   │   ├── DashboardPage.jsx
│   │   ├── AuditPage.jsx
│   │   ├── HistoryPage.jsx
│   │   └── DocsPage.jsx
│   ├── components/
│   │   ├── audit/
│   │   │   ├── AuditForm.jsx     # URL input + submit
│   │   │   └── AuditStatus.jsx   # Live polling + progress
│   │   ├── report/
│   │   │   └── AuditReport.jsx   # Violations + transcript accordion
│   │   └── ui/
│   │       ├── Sidebar.jsx
│   │       ├── ProgressBar.jsx
│   │       ├── ViolationCard.jsx
│   │       └── StatusBadge.jsx
│   ├── store/
│   │   └── useStore.js           # Zustand global state + polling logic
│   └── services/
│       └── api.js                # Axios API client
├── .env.example
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── package.json
```

---

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Set the backend API URL
```

### 3. Start the dev server

```bash
npm run dev
```

Open **http://localhost:5173**

---

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | `http://localhost:8000` |

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

---

## Tech Stack

| Library | Purpose |
|---|---|
| React 18 | UI framework |
| Vite 5 | Build tool + dev server |
| Tailwind CSS 3 | Utility-first CSS |
| React Router 6 | Client-side routing |
| Zustand | Global state management |
| Axios | HTTP client |
| Lucide React | Icons |
