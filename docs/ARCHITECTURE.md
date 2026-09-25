# System Architecture — IndustrySphere AI

## Overview

IndustrySphere AI follows a microservices architecture with a clear separation between the frontend, backend, AI/ML layer, and factory edge. The system is designed to be modular — each module (Factory Brain, Predictive Plant, Quality Vision, Supply Chain Nexus, Green Manufacturing) can be deployed independently.

---

## High-Level Architecture

```
                            ┌─────────────────────────────────┐
                            │      END USERS (Browser/Mobile)  │
                            └────────────┬────────────────────┘
                                         │ HTTPS / WebSocket
                            ┌────────────▼────────────────────┐
                            │    FRONTEND — Next.js 14         │
                            │    Vercel (Global CDN)           │
                            │  Recharts · D3.js · shadcn/ui   │
                            └────────────┬────────────────────┘
                                         │ REST API + WebSocket
                            ┌────────────▼────────────────────┐
                            │    BACKEND — FastAPI (Python)    │
                            │    Railway (Docker containers)   │
                            │  LangChain · LangGraph · Celery │
                            └───┬────┬────┬────┬────┬─────────┘
                                │    │    │    │    │
                          ┌─────┘    │    │    │    └─────┐
                          │          │    │    │          │
                   ┌──────▼──┐ ┌────▼──┐ │ ┌─▼───┐  ┌───▼──┐
                   │Postgres │ │pgvec- │ │ │Neo4j│  │Redis │
                   │+TimescDB│ │ tor   │ │ │Graph│  │Cache │
                   └─────────┘ └───────┘ │ └─────┘  └──────┘
                                         │
                                    ┌────▼────┐
                                    │  MinIO  │
                                    │ (Files) │
                                    └─────────┘

                            ┌────────────────────────────────┐
                            │          AI LAYER               │
                            ├────────────────────────────────┤
                            │  Claude Sonnet 4  (Anthropic)  │
                            │  Mistral-7B       (Ollama)      │
                            │  GPT-4o-mini      (OpenAI)      │
                            │  Contextual RAG   (pgvector)    │
                            │  Graph RAG        (Neo4j)       │
                            │  3x MCP Servers   (custom)      │
                            └────────────────────────────────┘

                            ┌────────────────────────────────┐
                            │       FACTORY EDGE              │
                            ├────────────────────────────────┤
                            │  Mosquitto MQTT Broker          │
                            │  ONNX Runtime (YOLOv8n)        │
                            │  Ollama (Mistral local)         │
                            │  InfluxDB (edge buffer)         │
                            │  Cloudflare Tunnel              │
                            └────────────────────────────────┘
```

---

## Module Architecture

### Module 1: Factory Brain

**Purpose:** Real-time factory operations monitoring dashboard.

**Data Flow:**
```
Factory Sensors (MPU-6050, current clamps)
    → MQTT (paho-mqtt, Mosquitto broker)
    → FastAPI MQTT consumer
    → TimescaleDB (raw time-series storage)
    → Continuous aggregates (1min, 15min, 1hr rollups)
    → Isolation Forest anomaly detection (real-time, <10ms)
    → WebSocket broadcast (Socket.IO)
    → React dashboard (live charts, alerts)
    → Alert dispatch (SMS via SSLCommerz, WhatsApp via WATI)
```

**Key components:**
- `backend/api/sensors.py` — MQTT consumer and WebSocket broadcaster
- `backend/services/anomaly_detection.py` — Isolation Forest inference
- `frontend/app/dashboard/` — Real-time OEE dashboard

### Module 2: Predictive Plant

**Purpose:** Predict equipment failures 48-96 hours before they happen.

**Data Flow:**
```
TimescaleDB (historical sensor data, 30-day window)
    → Feature engineering (rolling stats, FFT vibration features)
    → Isolation Forest (real-time anomaly score)
    → LSTM-Prophet hybrid (batch, nightly Airflow DAG)
    → Failure probability score stored in PostgreSQL
    → Mistral-7B via Ollama (natural language maintenance advice)
    → Work order auto-creation
    → Manager notification
```

**Key components:**
- `backend/ml/predictive_maintenance.py` — Model training and inference
- `backend/agents/maintenance_agent.py` — LangChain agent for NL advice
- `backend/pipelines/dags/nightly_prediction.py` — Airflow DAG

### Module 3: Quality Vision

**Purpose:** Real-time defect detection at the production line using computer vision.

**Data Flow:**
```
USB/IP Camera
    → OpenCV frame capture (edge device, 15 FPS)
    → YOLOv8n inference via ONNX Runtime (CPU, <70ms/frame)
    → Defect classification (scratch/dimensional/color/contamination)
    → Confidence score threshold (>0.75 = alert)
    → Conveyor stop signal (GPIO / PLC relay)
    → Defect metadata logged to PostgreSQL
    → SPC chart update (WebSocket)
```

**Key components:**
- `backend/ml/quality_vision.py` — YOLOv8n ONNX inference
- `backend/api/quality.py` — Quality metrics API
- `frontend/app/quality/` — SPC charts dashboard

### Module 4: Supply Chain Nexus

**Purpose:** AI-powered supply chain intelligence using a knowledge graph.

**Data Flow:**
```
Supplier profiles (curated + scraped)
    → Neo4j graph ingestion
    → Nodes: Factory, Machine, Product, Supplier, Material, WorkOrder
    → Relationships: SUPPLIES, REQUIRES, PRODUCES, RISKS

User query (natural language)
    → Supervisor Agent (LangGraph router)
    → Supply Chain Agent (LangChain)
    → query_supplier_graph_tool (Neo4j Cypher)  ← Graph RAG
    → search_maintenance_history_tool (pgvector)  ← Vector RAG
    → Claude Sonnet 4 reasoning
    → Structured JSON response
    → Vendor risk score + recommendations
```

**Key components:**
- `backend/agents/supply_chain_agent.py` — LangChain supply chain agent
- `backend/services/graph_rag.py` — Neo4j + pgvector hybrid retrieval
- `mcp-servers/supply-chain-mcp-server/` — MCP server

### Module 5: Green Manufacturing

**Purpose:** Carbon footprint tracking and GRI-format ESG reporting.

**Data Flow:**
```
Smart meters / Manual input
    → Energy consumption API (FastAPI)
    → Carbon intensity calculation (kgCO2/unit)
    → Industry benchmark comparison
    → Claude Sonnet 4 → ESG recommendations
    → GRI G4 XML/PDF report generation
    → Automated email delivery (SendGrid)
```

---

## AI Architecture

### RAG Pipeline

```
Document Ingestion:
PDF/DOCX/XLSX → Parser (PyMuPDF/python-docx/openpyxl)
    → Text extraction
    → spaCy NER entity enrichment
    → Contextual chunk summarization (GPT-4o-mini)  ← Contextual RAG
    → Variable/Semantic chunking (256-2048 tokens)   ← Semantic Chunking
    → text-embedding-3-small / nomic-embed-text
    → pgvector storage (HNSW index)

Query Time:
User query
    → Query embedding
    → BM25 search + Vector search → RRF fusion   ← Hybrid Retrieval
    → Cross-encoder reranking (top-20 → top-5)
    → Context injection into LLM prompt
    → Claude Sonnet 4 / Mistral-7B response
    → Guardrails AI validation
    → Final response
```

### Agent Architecture (LangGraph)

```
User Query
    │
    ▼
┌─────────────────┐
│ Supervisor Agent │  (routes to appropriate specialist)
└────────┬────────┘
         │
    ┌────┴──────────────────────────────────┐
    │                                       │
    ▼                                       ▼
┌───────────────┐                 ┌─────────────────┐
│ Maintenance   │                 │  Supply Chain   │
│ Agent         │                 │  Agent          │
│ (Mistral/     │                 │  (Claude +      │
│  Claude)      │                 │   Graph RAG)    │
└───────────────┘                 └─────────────────┘
    │                                       │
    ▼                                       ▼
Tools:                            Tools:
- query_sensor_data               - query_supplier_graph
- search_maintenance_logs         - get_vendor_risk_score
- create_work_order               - find_alternative_suppliers
                                  - get_demand_forecast
```

### MCP Server Architecture

```
┌──────────────────────┐     stdio/SSE      ┌─────────────────────┐
│   Claude Desktop     │ ◄────────────────► │ factory-data-mcp    │
│   Cursor AI IDE      │                    │   server            │
│   FastAPI backend    │                    │ Tools:              │
└──────────────────────┘                    │ - get_sensor_readings│
                                            │ - get_machine_status │
                                            │ - create_work_order  │
                                            └─────────────────────┘

                                            ┌─────────────────────┐
                                            │ supply-chain-mcp    │
                                            │   server            │
                                            │ Tools:              │
                                            │ - query_supplier_   │
                                            │   graph             │
                                            │ - get_vendor_risk   │
                                            └─────────────────────┘

                                            ┌─────────────────────┐
                                            │ sustainability-mcp  │
                                            │   server            │
                                            │ Tools:              │
                                            │ - get_energy_data   │
                                            │ - calc_carbon       │
                                            └─────────────────────┘
```

---

## Database Schema (Summary)

### PostgreSQL (Primary)
- `machines` — factory machine inventory
- `sensor_readings` (TimescaleDB hypertable) — raw IoT sensor data
- `anomaly_alerts` — detected anomalies and their status
- `work_orders` — maintenance work orders
- `products` — product catalog
- `defect_records` — quality vision defect log
- `production_batches` — production run records
- `energy_consumption` — energy meter readings
- `users` — factory staff accounts

### pgvector (Embeddings)
- `document_chunks` — chunked text with 1536-dim embeddings
- `contextual_summaries` — pre-computed chunk context strings

### Neo4j (Knowledge Graph)
```cypher
(Factory)-[:OPERATES]->(Machine)
(Machine)-[:PRODUCES]->(Product)
(Product)-[:REQUIRES]->(Material)
(Supplier)-[:SUPPLIES]->(Material)
(Supplier)-[:HAS_RISK]->(RiskFactor)
(Machine)-[:HAS_WORKORDER]->(WorkOrder)
```

### Redis (Cache)
- Real-time sensor cache (60s TTL)
- Session management
- Rate limiting counters
- Pub/Sub for anomaly alert broadcast

---

## Deployment Architecture

```
Production:
├── Vercel           → Frontend (Next.js, global CDN)
├── Railway          → Backend services
│   ├── FastAPI container (2x replicas)
│   ├── Celery worker (1x)
│   └── Airflow webserver + scheduler
├── Neo4j AuraDB     → Managed graph database
├── Redis Cloud      → Managed Redis
├── MinIO            → Self-hosted on Railway
└── Factory Edge (per factory)
    ├── Intel NUC / Raspberry Pi 5 (8GB)
    ├── Docker Compose (Ollama + ONNX + InfluxDB + Mosquitto)
    └── Cloudflare Tunnel (edge-to-cloud)
```

---

## Security

- All API endpoints protected by JWT authentication
- Factory sensor data encrypted at rest (AES-256) and in transit (TLS 1.3)
- Worker PII pseudonymized (SHA-256 hash)
- MCP server tool calls logged to audit trail
- Cloudflare Tunnel with zero-trust access policies
- API key rotation for all external LLM APIs
- Rate limiting on all public endpoints (100 req/min per IP)
