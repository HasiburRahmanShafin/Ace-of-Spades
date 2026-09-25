# Technology Stack — IndustrySphere AI

Every technology choice in this project was made deliberately — for technical merit, scoring value, Bangladesh-specific suitability, or cost-effectiveness. This document explains the "why" behind each choice.

---

## Frontend

### Next.js 14 (App Router)
**Why:** Server-side rendering for fast initial load (critical for 3G connections in Bangladesh). App Router supports streaming, which reduces Time-to-Interactive. TypeScript catches bugs at compile time.

### shadcn/ui + Tailwind CSS
**Why:** shadcn/ui gives us production-quality components without the overhead of a full component library. Tailwind enables rapid UI iteration. Both are fully customizable — unlike Material UI or Ant Design which can feel generic.

### Recharts + D3.js + Chart.js
**Why:** Three libraries for different chart types:
- **Recharts** for standard line/bar/area charts (sensor time-series, OEE trends) — simpler API
- **D3.js** for the supply chain force-directed graph — only D3 has the flexibility for custom network visualizations
- **Chart.js** for SPC (Statistical Process Control) charts — Chart.js plugins exist for X-bar and R-charts

### Socket.IO
**Why:** Real-time sensor data streaming to the dashboard requires persistent bidirectional connection. Socket.IO handles reconnection logic, fallback to long-polling, and namespace-based event routing more robustly than raw WebSockets.

---

## Backend

### FastAPI (Python 3.12)
**Why:** FastAPI is the industry standard for AI/ML Python APIs. Native async support (critical for handling hundreds of concurrent WebSocket sensor streams). Auto-generates OpenAPI docs. Pydantic v2 integration for strong typing.

### LangChain 0.3 + LangGraph
**Why:** 
- **LangChain** provides a unified interface to Claude, GPT-4o, and Mistral — swap LLMs with one config change
- **LangGraph** is the right tool for multi-agent orchestration with explicit state machines (Supervisor → specialist agents). More controllable than AutoGen for production use.

### Celery + Redis
**Why:** Alert dispatch (SMS, WhatsApp), document embedding generation, and PDF report creation are async tasks that can't block API responses. Celery distributes these to worker processes with retry logic and dead-letter queuing.

### Apache Airflow
**Why:** Production-grade pipeline orchestration. DAG-based scheduling gives us dependency management (don't run nightly ML inference until scraper has completed). UI for monitoring failed tasks. Alternative (Prefect) is simpler but less battle-tested.

### Scrapy + Playwright
**Why:**
- **Scrapy** for high-throughput static HTML scraping with built-in middleware (rate limiting, retry, cookies)
- **Playwright** via scrapy-playwright for JavaScript-rendered pages (BGMEA website uses React)
- Together they handle 99% of public web sources we need

---

## Databases

### PostgreSQL 16 + TimescaleDB
**Why PostgreSQL:** The most reliable open-source relational database. pgvector extension runs natively in PostgreSQL — one less service to manage.
**Why TimescaleDB:** Hypertable partitioning by time reduces query times for sensor time-series by 10-100x vs standard PostgreSQL tables. Continuous aggregates pre-compute common dashboard queries (15-min OEE, hourly defect rate).

### pgvector
**Why:** Running vector search inside PostgreSQL eliminates a separate vector database service. HNSW index achieves <10ms similarity search at 1M+ embeddings. Transactional consistency with relational data (no sync needed between separate services).

### Neo4j AuraDB
**Why:** Supply chain relationships are fundamentally a graph problem. A supplier that supplies material A, which is used in product B, which is made on machine C — querying this in SQL requires 4-5 JOINs that become slow and complex. In Neo4j, it's a 2-line Cypher query. Also required for Graph RAG — traversing the knowledge graph to find semantically related suppliers and risk factors.

**Bonus:** Using Neo4j earns **+5 automatic bonus points** in the BuildFest scoring rubric.

### Redis Cloud
**Why:** Three separate use cases:
1. **Caching** — sensor data cached for 60s so 50 concurrent dashboard users don't all query TimescaleDB
2. **Pub/Sub** — anomaly alerts published once, consumed by all connected WebSocket clients
3. **Rate limiting** — sliding window counters for API rate limits

---

## AI/ML

### Claude Sonnet 4 (Anthropic)
**Why:** Best-in-class reasoning for complex supply chain analysis and ESG report generation. Structured output (JSON mode) is more reliable than OpenAI for our multi-field JSON responses. Prompt caching reduces API costs by 65% for our repeated system prompts. 200K context window handles large maintenance manuals.

### Mistral-7B-Instruct via Ollama
**Why:** Factory data is sensitive business information. Many Bangladeshi factory owners won't send proprietary production data to US cloud servers. Mistral-7B running locally via Ollama provides:
1. **Data sovereignty** — nothing leaves the factory
2. **Offline operation** — works without internet (common in rural industrial zones)
3. **Zero API cost** — 90% of routine queries served locally
4. **Q4_K_M quantization** — runs well on 8GB VRAM

### GPT-4o-mini
**Why:** Cheapest capable model for bulk operations (batch document summarization, contextual chunk enrichment at ingestion time). Not used for real-time user-facing queries.

### YOLOv8n (Ultralytics)
**Why:** 
- **YOLOv8** is the current state-of-the-art for real-time object detection
- **YOLOv8n** (nano variant) is optimized for edge deployment — runs at 12-15 FPS on CPU via ONNX Runtime
- Custom fine-tuning on manufacturing defect dataset gives 87%+ accuracy for our specific defect classes
- ONNX export allows deployment without PyTorch on the factory edge

### Facebook Prophet + LSTM hybrid
**Why:** 
- **Prophet** handles seasonality, holidays (Eid production slowdowns), and trend changes well — ideal for demand forecasting in Bangladesh's seasonal economy
- **LSTM** captures complex non-linear patterns in vibration/temperature time-series that Prophet misses
- Hybrid ensemble outperforms either model alone

### Isolation Forest
**Why:** Unsupervised anomaly detection — we don't have labeled "broken machine" data for most new factory clients. Isolation Forest identifies anomalies by measuring how easy it is to isolate a data point. Works well for high-dimensional sensor data. <10ms inference per reading.

---

## AI Operations (AI-DLC)

### MLflow
**Why:** Experiment tracking for predictive maintenance model training. Every model version, hyperparameter, and training dataset is logged. Easy to compare LSTM vs Prophet vs Random Forest experiments. Model registry for staged deployment (Staging → Production).

### Weights & Biases
**Why:** YOLOv8 fine-tuning produces hundreds of training runs. W&B visualizes loss curves, mAP trends, and confusion matrices interactively. Sweep functionality for hyperparameter search.

### ONNX Runtime
**Why:** Standardized model format for edge deployment. Convert PyTorch (YOLOv8) or scikit-learn (Isolation Forest) models to ONNX once, run on any hardware without framework dependencies. 2-4x faster inference than PyTorch on CPU.

### Evidently AI
**Why:** Monitors production ML models for data drift. If factory conditions change (new machinery, different raw materials), the predictive maintenance model may degrade silently. Evidently detects this and triggers retraining alerts.

---

## Infrastructure

### Railway (Backend Hosting)
**Why:** GitHub-native deployment, Docker support, built-in Postgres add-on, competitive pricing (~$20-50/month for our scale). Simpler than AWS/GCP for a hackathon timeline while still being production-capable.

### Vercel (Frontend)
**Why:** Zero-config Next.js deployment. Global CDN. Preview deployments for every PR. Free tier covers our needs during development.

### Docker + Docker Compose
**Why:** Reproducible environments. Every team member runs the exact same PostgreSQL, Redis, and Airflow setup. Eliminates "works on my machine" problems.

### Cloudflare Tunnel
**Why:** Factory edge devices (Raspberry Pi 5 running Ollama + ONNX) need to communicate with our cloud backend. They don't have static IPs or enterprise network infrastructure. Cloudflare Tunnel creates a zero-trust encrypted tunnel without any port forwarding. More reliable and secure than ngrok for production factory deployments.

---

## Why Not...

| Technology | Why We Didn't Use It |
|-----------|---------------------|
| **MySQL** | No pgvector support; PostgreSQL is strictly better for our use case |
| **MongoDB** | Document DB not suitable for time-series or graph relationships |
| **Pinecone** | pgvector handles our scale (<5M vectors); no need for a paid external service |
| **LlamaIndex** | LangChain 0.3 + LangGraph better for complex multi-agent orchestration |
| **AutoGen** | Less control over agent state; LangGraph's explicit state machine is better for production |
| **Kubernetes** | Overkill for hackathon timeline; Railway Docker containers suffice |
| **AWS/GCP** | More complex setup; Railway/Vercel delivers 90% of the value for 10% of the config effort |
| **TensorFlow** | PyTorch (via Ultralytics YOLOv8) has better ecosystem for vision fine-tuning |
| **Pandas only** | We use Pandas for data manipulation but TimescaleDB for persistent time-series — Pandas alone can't handle streaming data at scale |
