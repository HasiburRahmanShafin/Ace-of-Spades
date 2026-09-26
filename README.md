<div align="center">

# 🏭 IndustrySphere AI

### Intelligent · Resilient · Sustainable Industrial Operations

**Team: Ace of Spades** &nbsp;|&nbsp; **Infinity AI BuildFest 2026** &nbsp;|&nbsp; **BRAC University, Dhaka**

[![Domain](https://img.shields.io/badge/Domain-E--Commerce%20%2F%20SME%20Dashboard-blue?style=for-the-badge)](/)
[![Event](https://img.shields.io/badge/Event-Infinity%20AI%20BuildFest%202026-purple?style=for-the-badge)](https://cloudcampbd.com)
[![Status](https://img.shields.io/badge/Status-Active%20Development-green?style=for-the-badge)]

[🚀 Live Demo](#) &nbsp;·&nbsp; [📹 Demo Video](#) &nbsp;·&nbsp; [📖 Documentation](./docs/) &nbsp;·&nbsp; [🎯 Why This Project](./docs/WHY_WE_CHOSE_THIS.md)

</div>

---

## 🎯 What is IndustrySphere AI?

**IndustrySphere AI** is a unified AI-powered operations intelligence platform for small and medium-sized manufacturers (SMEs) in Bangladesh. It brings enterprise-grade factory intelligence — real-time monitoring, predictive maintenance, computer vision quality control, and supply chain AI — to factories that have never had access to such tools before.

> *"Bangladesh has 50,000+ SME manufacturers employing 20 million workers. Most of them run on gut instinct and paper records. We're changing that."*

---

## 🧩 Core Modules

| Module | What It Does | Key Tech |
|--------|-------------|----------|
| 🧠 **Factory Brain** | Real-time sensor analytics, OEE dashboard, anomaly detection & alerts | MQTT · TimescaleDB · Isolation Forest · WebSocket |
| 🔧 **Predictive Plant** | Predicts equipment failures 48–96 hrs in advance, auto-generates work orders | LSTM · Prophet · Mistral-7B (Ollama) · MLflow |
| 👁️ **Quality Vision** | Computer vision defect detection at the production line (CPU-based, affordable) | YOLOv8n · ONNX Runtime · SPC Charts |
| 🔗 **Supply Chain Nexus** | Knowledge graph of suppliers + demand forecasting + vendor risk AI | Neo4j · Graph RAG · LangChain · XGBoost |
| 🌱 **Green Manufacturing** | Carbon footprint per unit, energy benchmarking, GRI-format ESG reports | Prophet · Apache Superset · GRI G4 |

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Next.js 14)                    │
│         Recharts · D3.js · shadcn/ui · Socket.IO · Bangla UI   │
└─────────────────────┬───────────────────────────────────────────┘
                      │ REST API + WebSocket
┌─────────────────────▼───────────────────────────────────────────┐
│                     BACKEND (FastAPI + Python 3.12)             │
│   LangChain · LangGraph · Celery · Pydantic v2 · SQLAlchemy    │
└──────┬──────────┬──────────┬──────────┬──────────┬─────────────┘
       │          │          │          │          │
   PostgreSQL  pgvector   Neo4j      Redis     MinIO
   TimescaleDB (vectors)  (graph)   (cache)   (files)
       │
  ┌────▼──────────────────────────────────────────┐
  │              AI LAYER                         │
  │  Claude Sonnet 4 · Mistral-7B (Ollama)       │
  │  GPT-4o-mini · YOLOv8n · Contextual RAG      │
  │  Graph RAG · Variable Chunking · MCP Servers │
  └───────────────────────────────────────────────┘
       │
  ┌────▼──────────────────────────────────────────┐
  │              FACTORY EDGE                      │
  │  Mosquitto MQTT · ONNX Runtime · InfluxDB     │
  │  Ollama (local LLM) · Cloudflare Tunnel       │
  └───────────────────────────────────────────────┘
```

---

## 🤖 AI Stack

- **LLMs:** Claude Sonnet 4, Mistral-7B (Ollama local), GPT-4o-mini
- **RAG:** Contextual RAG + Variable/Semantic Chunking + **Graph RAG** over Neo4j
- **Retrieval:** pgvector (HNSW index) + BM25 → Reciprocal Rank Fusion → Cross-encoder reranking
- **Agents:** LangChain + LangGraph multi-agent orchestration (Supervisor → specialized sub-agents)
- **Computer Vision:** YOLOv8n fine-tuned on manufacturing defect dataset
- **MCP Servers:** 3 custom servers built (factory-data, supply-chain, sustainability)
- **AI-DLC:** MLflow · Weights & Biases · ONNX · Evidently AI

---

## 🛠️ Tech Stack

**Frontend:** `Next.js 14` `React 18` `TypeScript` `Tailwind CSS` `shadcn/ui` `Recharts` `D3.js` `Socket.IO`

**Backend:** `FastAPI` `Python 3.12` `LangChain 0.3` `LangGraph` `Celery` `Apache Airflow` `Scrapy` `Playwright`

**Databases:** `PostgreSQL 16` `TimescaleDB` `pgvector` `Neo4j AuraDB` `Redis` `MinIO` `InfluxDB`

**AI/ML:** `Claude Sonnet 4` `Mistral-7B (Ollama)` `YOLOv8n` `scikit-learn` `Prophet` `XGBoost` `MLflow` `ONNX Runtime`

**Infrastructure:** `Docker` `Railway` `Vercel` `Cloudflare Tunnel` `ngrok`

---

## 📁 Repository Structure

```
industryphere-ai/
├── 📂 frontend/              # Next.js 14 dashboard application
│   ├── app/                  # App Router pages
│   ├── components/           # Reusable UI components
│   └── lib/                  # Utilities, API clients
├── 📂 backend/               # FastAPI Python backend
│   ├── api/                  # REST API routes
│   ├── agents/               # LangChain/LangGraph AI agents
│   ├── ml/                   # ML models (predictive maintenance, forecasting)
│   ├── scrapers/             # Scrapy spiders
│   ├── pipelines/            # Airflow DAGs + Celery tasks
│   └── services/             # Core business logic
├── 📂 mcp-servers/           # Model Context Protocol servers
│   ├── factory-data-mcp-server/
│   ├── supply-chain-mcp-server/
│   └── sustainability-mcp-server/
├── 📂 docs/                  # All project documentation
│   ├── WHY_WE_CHOSE_THIS.md  # Domain rationale for the team
│   ├── ARCHITECTURE.md       # Detailed system architecture
│   ├── TECH_STACK.md         # Technology decisions explained
│   ├── SCORING_STRATEGY.md   # BuildFest scoring strategy
│   └── API_REFERENCE.md      # API documentation
├── 📂 .github/               # GitHub Actions CI/CD workflows
├── docker-compose.yml        # Local development environment
├── docker-compose.prod.yml   # Production Docker Compose
└── README.md                 # This file
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Docker & Docker Compose
- Node.js 20+
- Python 3.12+
- Git

### 1. Clone the repository
```bash
git clone https://github.com/HasiburRahmanShafin/industryphere-ai.git
cd industryphere-ai
```

### 2. Set up environment variables
```bash
cp .env.example .env
# Edit .env and add your API keys:
# ANTHROPIC_API_KEY=...
# OPENAI_API_KEY=...
# NEO4J_URI=...
# NEO4J_PASSWORD=...
```

### 3. Start all services with Docker Compose
```bash
docker-compose up -d
```

### 4. Start the frontend
```bash
cd frontend
npm install
npm run dev
# → http://localhost:3000
```

### 5. Start the backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
# → http://localhost:8000
```

### 6. (Optional) Install Ollama for local LLM
```bash
# Download Ollama from https://ollama.ai
ollama pull mistral:7b-instruct-q4_K_M
ollama pull nomic-embed-text
```

---

## 👥 Team — Ace of Spades

| Role | Responsibility |
|------|---------------|
| 👑 **Team Leader / Project Coordinator** | Vision, execution, milestone tracking, team coordination |
| 📊 **Business Analyst / Data Scientist** | Problem definition, KPIs, data strategy, ML/AI logic |
| 🎨 **UI/UX / Frontend Developer** | Dashboard design, Next.js implementation, mobile-first UX |
| ⚙️ **Backend / Database / Scraper Engineer** | FastAPI, databases, AI agents, data pipelines |
| 📣 **Presentation / Communication Lead** | Demo, pitch deck, documentation, video production |

---

## 📊 Impact Projections

| Metric | Current | With IndustrySphere AI |
|--------|---------|----------------------|
| Unplanned downtime | Industry avg: 15-20% | **Reduced by 60-70%** |
| Defect detection speed | End-of-line sampling | **Real-time (<100ms)** |
| Procurement cost | 25-30% above optimal | **12% improvement** |
| ESG reporting | Manual/none | **Automated GRI G4** |
| Time-to-insight | Days/weeks | **< 2 seconds** |

---

## 🔗 Links

- 🌐 **Live Demo:** [Coming Soon]
- 📹 **Demo Video:** [Coming Soon]
- 🎨 **Figma Design:** [Coming Soon]
- 📋 **Event:** [Infinity AI BuildFest 2026](https://cloudcampbd.com)

---

## 📄 License



---

<div align="center">

Built with ❤️ by **Team Ace of Spades** for **The Infinity AI BuildFest 2026**

*Build Locally. Lead Globally.*

</div>
