# ComplianceQA — Brand Guardian AI

AI-powered YouTube video compliance auditing system built with **React + Node.js/Express** and **Azure AI Services**.

---

## 🏗️ System Design

![ComplianceQA Architecture](./backend/data/img/Full%20system%20design.png)

![Workflow Diagram](./backend/data/img/System%20design.png)

*High-level architecture and processing workflow showing the flow between the React Frontend, Node.js API, and Azure AI Services.*

## Repositories

This project is split into two independent repositories:

| Repository | Description | Tech Stack |
|---|---|---|
| [`backend/`](./backend/) | Express.js REST API — video processing pipeline, RAG compliance auditing | Node.js, Express, Azure OpenAI, Azure Video Indexer, Azure AI Search |
| [`frontend/`](./frontend/) | React SPA — audit dashboard, real-time status, violation reports | React 18, Vite, Tailwind CSS, Zustand |

Each repository is **fully standalone** with its own `package.json`, `.gitignore`, `README.md`, and `.env.example`.

---

## Quick Start

### Backend

```bash
cd backend
npm install
cp .env.example .env    # Fill in Azure credentials
npm run dev              # Starts on http://localhost:8000
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env    # Set VITE_API_URL
npm run dev              # Starts on http://localhost:5173
```

---

## Required Azure Services

| Service | Purpose |
|---|---|
| Azure OpenAI (gpt-4o) | Compliance reasoning |
| Azure OpenAI (text-embedding-3-small) | RAG embeddings |
| Azure Video Indexer | Transcript + OCR extraction |
| Azure AI Search | Vector knowledge base |
| Azure Monitor | Telemetry (optional) |

---

See each repository's `README.md` for detailed setup instructions and API documentation.
