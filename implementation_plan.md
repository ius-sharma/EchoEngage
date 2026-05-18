# EchoEngage — Creator Relationship Memory Agent

Build a hackathon project that helps creators remember every follower, prioritize relationships, and reply personally — powered by **LangGraph** (agent orchestration), **Hindsight** (memory), and **CascadeFlow** (model routing).

**Deadline: 19-05-2026** (tomorrow)

## User Review Required

> [!IMPORTANT]
> **API Keys Needed**: You will need to provide:
> 1. **Groq API key** — for LLM calls (free tier at groq.com)
> 2. **Hindsight API key** — either Hindsight Cloud (use promo `MEMHACK515` for $50 free credits) or a local Docker instance
> 3. These will go into a `.env` file that I'll create as a template

> [!IMPORTANT]
> **LangGraph choice confirmed**: Using LangGraph (Python) for the agent graph instead of a simple Node.js backend. This means:
> - Backend: **Python FastAPI** + **LangGraph** agent
> - Frontend: **React + Vite** (as specified in the dev plan)
> - Styling: **Tailwind CSS** (as specified in the dev plan)

## Architecture

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
│  CascadeFlow: callback handler on LLM calls              │
└──────────────────────────────────────────────────────────┘
```

## Proposed Changes

### 1. Backend — Python FastAPI + LangGraph Agent

#### [NEW] `backend/requirements.txt`
Dependencies: `fastapi`, `uvicorn`, `langgraph`, `langchain-groq`, `hindsight-client`, `hindsight-langgraph`, `cascadeflow[langchain]`, `python-dotenv`, `pydantic`

#### [NEW] `backend/.env.example`
Template for API keys: `GROQ_API_KEY`, `HINDSIGHT_API_URL`, `HINDSIGHT_API_KEY`

#### [NEW] `backend/data/synthetic_data.py`
Realistic demo dataset with 8-12 followers (Riya Sharma, Karan Mehta, Neha Verma, Aman Singh, Priya Nair, etc.) and 20+ comments across multiple interactions per follower. Each follower has pre-seeded memory history.

#### [NEW] `backend/agent/state.py`
LangGraph state definition (`TypedDict`) with fields: `messages`, `comment`, `follower_id`, `memory_context`, `classification`, `routing_decision`, `suggested_reply`, `priority_label`, `explanation`, `memory_updates`, `quality_gate_result`

#### [NEW] `backend/agent/graph.py`
The core LangGraph `StateGraph`:
1. **recall_memory** — Uses Hindsight `create_recall_node` to fetch follower memory by bank_id (each follower = one bank)
2. **classify_comment** — LLM classifies intent (appreciation/question/buying_signal/support/spam) and complexity (simple/medium/complex)
3. **route_model** — CascadeFlow-powered routing: simple → `qwen/qwen3-32b`, complex → `openai/gpt-oss-120b`
4. **generate_reply** — LLM generates personalized reply using memory context, wrapped with CascadeFlow callback for cost tracking
5. **quality_gate** — Evaluates reply quality; if fails, escalates to stronger model
6. **retain_memory** — Uses Hindsight `create_retain_node` to save new memory facts

#### [NEW] `backend/agent/prompts.py`
System prompt, reply generation prompt, quality gate prompt (from the dev plan)

#### [NEW] `backend/api/routes.py`
FastAPI routes:
- `GET /api/comments` — Return synthetic comment inbox
- `GET /api/followers` — Return all followers with memory profiles
- `GET /api/followers/{id}` — Return single follower profile
- `POST /api/process` — Process a comment through the LangGraph agent, return reply + routing + memory
- `GET /api/analytics` — Return aggregated metrics (total processed, cost savings, etc.)

#### [NEW] `backend/main.py`
FastAPI app entry point with CORS middleware

#### [NEW] `backend/services/memory_service.py`
Hindsight memory service: create banks per follower, seed initial memories, recall/retain wrappers. Falls back to local JSON memory if Hindsight is unavailable.

#### [NEW] `backend/services/routing_service.py`
CascadeFlow routing service: wraps LangChain model calls with CascadeFlow harness callback, tracks cost/latency/model decisions, maintains audit trail.

---

### 2. Frontend — React + Vite + Tailwind CSS

#### [NEW] `frontend/` (via `create-vite`)
React + Vite project with Tailwind CSS

#### [NEW] `frontend/src/App.jsx`
Main app with routing: Dashboard (main), Memory Timeline (optional)

#### [NEW] `frontend/src/pages/Dashboard.jsx`
The main demo page with:
- **Top metrics row**: Total comments, personalized replies, VIP followers, cost saved
- **Left panel**: Comment inbox list with priority labels and search/filter
- **Center panel**: Selected comment detail + suggested reply + approve button
- **Right panel**: Follower memory card + routing audit trail

#### [NEW] `frontend/src/components/CommentInbox.jsx`
Scrollable comment list with priority color coding, platform icons, timestamps

#### [NEW] `frontend/src/components/CommentDetail.jsx`
Selected comment view with follower info, suggested reply, explanation, and approve button

#### [NEW] `frontend/src/components/FollowerMemoryCard.jsx`
Follower profile: name, handle, relationship score (animated ring), interests, past questions, interaction count, sentiment trend

#### [NEW] `frontend/src/components/RoutingAudit.jsx`
CascadeFlow routing panel: model selected, reason, complexity score, cost estimate, latency, escalation status

#### [NEW] `frontend/src/components/MetricsBar.jsx`
Top dashboard metrics with animated counters

#### [NEW] `frontend/src/components/SuggestedReply.jsx`
Reply panel with memory-used explanation, priority label badge, memory facts to save

#### [NEW] `frontend/src/services/api.js`
API client for all backend endpoints

#### [NEW] `frontend/src/index.css`
Design system: dark theme, glassmorphism cards, gradient accents, smooth animations

---

### 3. Project Root

#### [NEW] `README.md`
Complete README with project name, problem statement, architecture diagram, Hindsight/CascadeFlow usage explanation, setup instructions, demo script

#### [NEW] `start.sh` / `start.bat`
Single command to start both backend and frontend

## Verification Plan

### Automated Tests
- Start backend: `cd backend && uvicorn main:app --reload`
- Start frontend: `cd frontend && npm run dev`
- Test API endpoints via browser
- Walk through the full demo flow in the browser

### Manual Verification
- Process a comment for a new follower → verify generic reply
- Process multiple comments for Riya Sharma → verify personalized reply using memory
- Check routing audit → verify simple comments use cheap model, complex use expensive
- Verify cost savings metric updates
- Verify memory card shows accumulated knowledge
