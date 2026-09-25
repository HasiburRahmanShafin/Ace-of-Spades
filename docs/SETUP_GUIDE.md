# 🚀 Step-by-Step Setup, Testing & Usage Guide
## IndustrySphere AI — Team Ace of Spades
**Infinity AI BuildFest 2026 | Domain: E-Commerce | Challenge: SME Dashboard**

---

## 📋 Table of Contents
1. [System Overview & Architecture](#-system-overview--architecture)
2. [Prerequisites](#-prerequisites)
3. [Quick Start (Local Development Mode)](#-quick-start-local-development-mode)
   - [Step 1: Start Backend (FastAPI)](#step-1-start-the-backend-fastapi)
   - [Step 2: Start Frontend (Next.js)](#step-2-start-the-frontend-nextjs)
4. [Alternative: Running with Docker Compose](#-alternative-running-with-docker-compose)
5. [Step-by-Step Guide to Test Every Feature](#-step-by-step-guide-to-test-every-feature)
   - [Feature 1: Factory Brain (Machine Fleet & Telemetry)](#feature-1-factory-brain-machine-fleet--telemetry)
   - [Feature 2: Predictive Plant (RUL & Anomaly Forecasting)](#feature-2-predictive-plant-rul--anomaly-forecasting)
   - [Feature 3: Quality Vision (Edge YOLOv8 Defect Detection)](#feature-3-quality-vision-edge-yolov8-defect-detection)
   - [Feature 4: Supply Chain Nexus (Graph RAG & Vendor Risk)](#feature-4-supply-chain-nexus-graph-rag--vendor-risk)
   - [Feature 5: Green Manufacturing (Carbon & ESG Tracking)](#feature-5-green-manufacturing-carbon--esg-tracking)
   - [Feature 6: Factory Brain AI Copilot (English & Bangla)](#feature-6-factory-brain-ai-copilot-english--bangla)
6. [Testing the API Endpoints (Swagger Docs)](#-testing-the-api-endpoints-swagger-docs)
7. [Comprehensive Explanation of the Entire System](#-comprehensive-explanation-of-the-entire-system)
   - [Why did we choose this domain?](#why-did-we-choose-this-domain)
   - [How the AI models work](#how-the-ai-models-work)
   - [Rubric alignment and scoring strategy](#rubric-alignment-and-scoring-strategy)

---

## 🛠️ Prerequisites

Make sure you have the following installed on your machine:
- **Node.js**: v18.0 or higher (`node -v`)
- **Python**: v3.10 to v3.12 (`python --version`)
- **Git**: (`git --version`)
- *(Optional)* **Docker Desktop**: If running full microservices (Postgres/TimescaleDB/Redis/Mosquitto)

---

## ⚡ Quick Start (Local Development Mode)

You can run both the Backend and Frontend on your machine in just 2 terminal windows:

### Step 1: Start the Backend (FastAPI)

1. Open your terminal in the backend directory:
   ```bash
   cd c:\Users\DELL\Desktop\Cloudcamp_project\backend
   ```
2. Activate your virtual environment (or create one if needed):
   ```powershell
   # In PowerShell:
   .\venv\Scripts\Activate.ps1
   # If execution policy blocks scripts:
   # Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
   ```
3. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the FastAPI development server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
5. You should see:
   ```
   INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
   ```
6. Open your browser and test the API health:
   - Status: [http://localhost:8000/api/health](http://localhost:8000/api/health)
   - Interactive Swagger Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

---

### Step 2: Start the Frontend (Next.js)

1. Open a **new** terminal window:
   ```bash
   cd c:\Users\DELL\Desktop\Cloudcamp_project\frontend
   ```
2. Install npm packages (if not already installed):
   ```bash
   npm install
   ```
3. Launch the Next.js dev server:
   ```bash
   npm run dev
   ```
4. Open your browser at **[http://localhost:3000](http://localhost:3000)**.
5. You will see the **IndustrySphere AI SME Operations Dashboard** live!

---

## 🐳 Alternative: Running with Docker Compose

If you have Docker Desktop running and want to spin up all services (PostgreSQL, TimescaleDB, Redis, Mosquitto MQTT, MinIO, FastAPI):

```bash
cd c:\Users\DELL\Desktop\Cloudcamp_project
docker compose up -d
```
All infrastructure services will start automatically.

---

## 🧪 Step-by-Step Guide to Test Every Feature

Once `http://localhost:3000` is open:

### Feature 1: Factory Brain (Machine Fleet & Telemetry)
1. Notice the top banner showing:
   - **Factory OEE (84.6%)**
   - **Active Machine Fleet (18/20 operational, 1 Critical)**
   - **Supply Chain Risk (Medium)**
   - **Carbon Saved (3,420 kg)**
2. Click on any machine card in the **Machine Grid**:
   - `CNC-01` (Heavy Milling Machine — Optimal, 91.4% OEE)
   - `CNC-02` (Precision Lathe — Degraded, 74.8% OEE)
   - `HYD-04` (Hydraulic Stamping Press — **Critical Alert**, high vibration 8.7 mm/s)
   - `TEX-08` (High-Speed Circular Loom — Optimal, 94.1% OEE)
3. Notice that clicking a card dynamically updates the **Detail Panel** below it with:
   - ISO 10816 Vibration levels
   - Thermal behavior (°C)
   - Hydraulic pressure (PSI)
   - Remaining Useful Life (RUL countdown)
4. Notice that live vibration and temperature values fluctuate slightly every 3 seconds to reflect real-world MQTT sensor streams.

---

### Feature 2: Predictive Plant (RUL & Anomaly Forecasting)
1. Click the **🔮 Predictive Plant** tab in the navigation bar.
2. Observe the **High-Risk Asset Countdown**:
   - `HYD-04`: 36 hours Remaining Useful Life before predicted bearing failure.
   - `CNC-02`: 184 hours remaining before spindle imbalance.
3. Review the **AI-DLC (AI Development Lifecycle)** box showing:
   - XGBoost Regressor v2.4 (ONNX format)
   - Isolation Forest + Autoencoder Anomaly Detection
   - MLflow tracking server connection
   - Evidently AI data drift monitor (<0.012 drift)

---

### Feature 3: Quality Vision (Edge YOLOv8 Defect Detection)
1. Click the **👁️ Quality Vision** tab.
2. View the simulated **Live Conveyor Inspection Feed (Line #3 - Savar RMG Garments)**:
   - Real-time bounding box highlighting: `Skipped Stitch (94.2% confidence)`
   - RTSP stream running YOLOv8 ONNX model at 30 FPS.
3. Inspect **Today's Defect Summary**:
   - Skipped stitches, oil stains, thread tension variations, and First-Pass Yield (98.4%).

---

### Feature 4: Supply Chain Nexus (Graph RAG & Vendor Risk)
1. Click the **🔗 Supply Chain Nexus** tab.
2. View the **Active Vendor Bottleneck Alert**:
   - `Narsingdi Cotton Spinners Ltd` (Risk: 0.78)
   - Root cause: Dhaka-Sylhet corridor flood warnings delaying raw yarn shipments by +48 hours.
   - AI recommendation: Auto-failover 30% quota to `Cumilla Textile Mills` (+3.2% cost delta).
3. Check the **Neo4j Knowledge Graph statistics**:
   - 42 Suppliers, 118 Raw Materials, 480 Edges, 12 Transport Corridors.

---

### Feature 5: Green Manufacturing (Carbon & ESG Tracking)
1. Click the **🌱 Green Manufacturing** tab.
2. Observe the energy split:
   - 68% National Grid, 22% Rooftop Solar, 10% Biomass Steam.
3. Review the carbon intensity metric (0.42 kg CO₂/unit) aligned with EU CBAM export standards.
4. Click **"Download GRI Report (PDF)"** to test export generation.

---

### Feature 6: Factory Brain AI Copilot (English & Bangla)
At the bottom of the screen, you will find the **Factory Brain AI Copilot**:
1. **Test Machine Diagnosis:**
   - Type: `Why is machine HYD-04 in critical state?`
   - Hit **Send**.
   - Notice the AI returns specific diagnosis on vibration levels, cavitation, and suggests an immediate maintenance work order with citations.
2. **Test Supply Chain Inquiry:**
   - Type: `Are there any supply chain risks for cotton yarn?`
   - Hit **Send**.
   - The AI explains the Dhaka-Sylhet transit risk and cites the Knowledge Graph.
3. **Test Bangla Language:**
   - Switch language at top right to **বাংলা**, or type: `কারখানার বর্তমান অবস্থা কেমন?`
   - Hit **Send**.
   - The AI responds in natural Bangla with current plant health status!

---

## 📡 Testing the API Endpoints (Swagger Docs)

Open [http://localhost:8000/docs](http://localhost:8000/docs) in your browser:
1. `GET /api/health` — Checks service and database status.
2. `GET /api/overview` — Returns factory OEE, machine count, active batch.
3. `GET /api/machines` — Returns all active machines with dynamic telemetry.
4. `GET /api/supply-chain/risks` — Returns vendor risk levels and corridor bottlenecks.
5. `POST /api/agent/chat` — Send any prompt to the AI agent and test JSON responses.

---

## 📖 Comprehensive Explanation of the Entire System

### Why Did We Choose This Domain?
1. **Massive Unmet Need in Bangladesh:**
   - Bangladesh's manufacturing sector employs **20M+ workers** and generates **20% of GDP**.
   - Over **50,000 SME factories** run on manual paper logs, gut instinct, and WhatsApp messages.
   - Unplanned machine downtime costs Bangladeshi industry an estimated **BDT 12,000 crore annually**.
2. **Affordable AI for SMEs:**
   - Enterprise systems from SAP or Siemens cost $50,000 to $500,000+.
   - **IndustrySphere AI** brings enterprise-grade predictive maintenance, automated visual inspection, and graph supply chain intelligence at an affordable cost for Bangladeshi SMEs.
3. **Aligned with Infinity AI BuildFest Rubric:**
   - Falls squarely under **E-Commerce (SME Operations Dashboard / Supply Chain Nexus)**.
   - Leverages **Graph RAG (Neo4j)**, **Contextual RAG**, **Agentic AI (LangChain)**, **Computer Vision (YOLOv8)**, and **Local Offline LLMs (Ollama)** to hit maximum scores across all evaluation criteria.

### How the Architecture Works
- **Edge Layer:** IoT vibration, temperature, and pressure sensors stream data via MQTT into **TimescaleDB hypertables**.
- **Predictive Engine:** Lightweight ONNX models (XGBoost/LSTM) forecast Remaining Useful Life (RUL) and flag anomalies before catastrophic breakdowns occur.
- **Vision Edge:** Conveyor camera feeds run fine-tuned YOLOv8 models for real-time defect detection at 30 FPS.
- **Knowledge Graph (Neo4j):** Models multi-tier supplier relationships, transit corridors, and weather risks for proactive supply chain rerouting.
- **Frontend (Next.js 16 + React 19 + Tailwind v4):** High-performance, dark-mode, responsive industrial dashboard supporting both English and Bangla.
