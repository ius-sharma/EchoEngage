# EchoEngage — Creator Relationship Memory Agent

> **Hackathon Project** | Built with LangGraph · Hindsight · CascadeFlow

EchoEngage helps creators **remember every follower**, prioritize relationships, and reply personally — so no loyal fan ever feels like a stranger.

---

## 🎯 Problem

Creators with growing audiences lose track of who their followers are. Repeat commenters get generic replies, VIPs go unrecognized, and buying signals are missed. The result: followers feel invisible, creators miss revenue, and community bonds weaken.

## 💡 Solution

EchoEngage is a **Creator Relationship Memory Agent** that:

1. **Remembers** every interaction with every follower (via Hindsight memory)
2. **Prioritizes** comments by relationship strength, buying signals, and engagement history
3. **Generates** personalized, context-aware replies that reference past conversations
4. **Routes** to the right AI model for cost efficiency (via CascadeFlow)

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   React + Vite Frontend                  │
│  Dashboard │ Comment Inbox │ Memory Card │ Routing Audit │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP/REST
┌──────────────────────▼──────────────────────────────────┐
│                   FastAPI Backend                         │
│  /api/comments  │  /api/process  │  /api/followers       │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│              LangGraph Agent (StateGraph)                 │
│                                                          │
│  START → [recall_memory] → [classify_comment]            │
│       → [route_model] → [generate_reply]                 │
│       → [quality_gate] → [retain_memory] → END           │
│                                                          │
│  Hindsight: recall/retain nodes (per-follower bank)      │
│  CascadeFlow: model routing with cost tracking           │
└──────────────────────────────────────────────────────────┘
```

### LangGraph Pipeline (6 Nodes)

| Node | Purpose | Integration |
|------|---------|-------------|
| `recall_memory` | Fetch follower history | **Hindsight** |
| `classify_comment` | Detect intent & complexity | LLM |
| `route_model` | Pick cheap vs premium model | **CascadeFlow** |
| `generate_reply` | Personalized reply with memory | LLM |
| `quality_gate` | Score reply, escalate if needed | LLM |
| `retain_memory` | Save new facts to remember | **Hindsight** |

---

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- API Keys: Groq, Hindsight Cloud

### 1. Clone & Setup

```bash
cd EchoEngage
```

### 2. Backend Setup

```bash
cd backend
pip install -r requirements.txt

# Copy and fill in your API keys
cp .env.example .env
# Edit .env with your GROQ_API_KEY and HINDSIGHT_API_KEY
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

### 4. Run

```bash
# Option A: Use the start script (Windows)
start.bat

# Option B: Manual
# Terminal 1: Backend
cd backend && python -m uvicorn main:app --reload --port 8000

# Terminal 2: Frontend
cd frontend && npm run dev
```

### 5. Open Dashboard

Visit **http://localhost:5173** → Click "Seed Memories" → Select a comment → Click "Generate AI Reply"

---

## 🔑 API Keys

| Service | Get Key | Free Tier |
|---------|---------|-----------|
| **Groq** | [groq.com](https://groq.com) | Free tier available |
| **Hindsight** | [hindsight.vectorize.io](https://hindsight.vectorize.io) | Use promo `MEMHACK515` for $50 free |

---

## 📁 Project Structure

```
EchoEngage/
├── backend/
│   ├── agent/
│   │   ├── graph.py          # LangGraph StateGraph (6 nodes)
│   │   ├── state.py          # Agent state definition
│   │   └── prompts.py        # All prompt templates
│   ├── services/
│   │   ├── memory_service.py  # Hindsight integration + fallback
│   │   └── routing_service.py # CascadeFlow routing + cost tracking
│   ├── data/
│   │   └── synthetic_data.py  # Demo dataset (10 followers, 12 comments)
│   ├── api/
│   │   └── routes.py          # FastAPI REST endpoints
│   ├── main.py                # App entry point
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CommentInbox.jsx
│   │   │   ├── CommentDetail.jsx
│   │   │   ├── FollowerMemoryCard.jsx
│   │   │   ├── RoutingAudit.jsx
│   │   │   └── MetricsBar.jsx
│   │   ├── services/api.js
│   │   ├── App.jsx
│   │   └── index.css          # Design system
│   └── package.json
├── start.bat
└── README.md
```

---

## 🎮 Demo Script

1. **Open Dashboard** → See comment inbox with priority badges
2. **Click "Seed Memories"** → Pre-load follower history into Hindsight
3. **Select Riya Sharma's comment** → See her memory card (VIP, 15 interactions)
4. **Click "Generate AI Reply"** → Watch the LangGraph pipeline:
   - Memory recalled from Hindsight
   - Comment classified as "buying_signal / complex"
   - CascadeFlow routes to premium model
   - Reply references her past purchases
   - Quality gate passes at 9/10
   - New facts saved to memory
5. **Select a simple comment** → See it routed to cheap model (cost savings!)
6. **Check Routing Audit** → See cost breakdown and savings percentage

---

## 🛠️ Technology Stack

- **Agent Framework**: LangGraph (Python)
- **Memory**: Hindsight by Vectorize (per-follower memory banks)
- **Model Routing**: CascadeFlow (complexity-based routing with cost tracking)
- **LLMs**: Groq (Qwen 32B for simple, GPT-OSS 120B for complex)
- **Backend**: FastAPI + Python
- **Frontend**: React + Vite + Tailwind CSS
- **Design**: Dark theme, glassmorphism, animated score rings

---


