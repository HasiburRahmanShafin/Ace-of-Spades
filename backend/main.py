import os
import random
import time
from typing import Dict, List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(
    title="IndustrySphere AI API",
    description="Backend API for IndustrySphere AI — Industrial Operations & Supply Chain Intelligence",
    version="1.0.0"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simulated Machine Fleet
MACHINES = [
    {
        "id": "CNC-01",
        "name": "Heavy Milling Machine #1",
        "section": "Machining Line A (Gazipur)",
        "status": "healthy",
        "vibration_mm_s": 2.1,
        "temperature_c": 64.2,
        "pressure_psi": 88.0,
        "rul_hours": 1420,
        "oee_percent": 91.4,
        "anomaly_score": 0.08,
        "last_maintenance": "2026-09-10"
    },
    {
        "id": "CNC-02",
        "name": "Precision Lathe #2",
        "section": "Machining Line A (Gazipur)",
        "status": "warning",
        "vibration_mm_s": 5.4,
        "temperature_c": 79.5,
        "pressure_psi": 94.2,
        "rul_hours": 184,
        "oee_percent": 74.8,
        "anomaly_score": 0.72,
        "last_maintenance": "2026-08-14"
    },
    {
        "id": "HYD-04",
        "name": "Hydraulic Stamping Press",
        "section": "Forming Unit B (Narsingdi)",
        "status": "critical",
        "vibration_mm_s": 8.7,
        "temperature_c": 92.1,
        "pressure_psi": 128.5,
        "rul_hours": 36,
        "oee_percent": 58.2,
        "anomaly_score": 0.94,
        "last_maintenance": "2026-07-29"
    },
    {
        "id": "TEX-08",
        "name": "High-Speed Circular Loom",
        "section": "Weaving Floor (Savar)",
        "status": "healthy",
        "vibration_mm_s": 1.8,
        "temperature_c": 58.0,
        "pressure_psi": 72.0,
        "rul_hours": 2100,
        "oee_percent": 94.1,
        "anomaly_score": 0.05,
        "last_maintenance": "2026-09-18"
    },
    {
        "id": "BOIL-02",
        "name": "Biomass Steam Boiler",
        "section": "Utilities & Power",
        "status": "healthy",
        "vibration_mm_s": 2.9,
        "temperature_c": 110.4,
        "pressure_psi": 140.0,
        "rul_hours": 980,
        "oee_percent": 88.5,
        "anomaly_score": 0.14,
        "last_maintenance": "2026-09-01"
    }
]

class ChatRequest(BaseModel):
    message: str
    context: Optional[str] = "factory_floor"

class ChatResponse(BaseModel):
    response: str
    action_suggested: Optional[str] = None
    confidence: float
    sources: List[str]

@app.get("/")
def read_root():
    return {
        "project": "IndustrySphere AI",
        "team": "Ace of Spades",
        "version": "1.0.0",
        "status": "online",
        "documentation": "/docs"
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "timestamp": time.time(),
        "services": {
            "api": "healthy",
            "predictive_engine": "active",
            "knowledge_graph": "connected (mock)",
            "timeseries_db": "active"
        }
    }

@app.get("/api/machines")
def get_machines():
    # Add slight real-time fluctuation for dynamic simulation
    updated_machines = []
    for m in MACHINES:
        m_copy = dict(m)
        m_copy["vibration_mm_s"] = round(m["vibration_mm_s"] + random.uniform(-0.1, 0.1), 2)
        m_copy["temperature_c"] = round(m["temperature_c"] + random.uniform(-0.3, 0.3), 1)
        updated_machines.append(m_copy)
    return updated_machines

@app.get("/api/overview")
def get_overview():
    return {
        "factory_oee": 84.6,
        "active_machines": 18,
        "critical_alerts": 1,
        "warnings": 1,
        "carbon_saved_kg": 3420,
        "total_energy_kwh": 14280,
        "production_target_met_pct": 92.4,
        "active_batch": "Export Order #BGMEA-982 (RMG Garment Accessories)"
    }

@app.get("/api/supply-chain/risks")
def get_supply_chain_risks():
    return [
        {
            "supplier": "Narsingdi Cotton Spinners Ltd",
            "material": "Raw Yarn 40s",
            "risk_score": 0.78,
            "risk_level": "High",
            "reason": "Flood risk detected along Dhaka-Sylhet highway corridor + delayed customs clearance",
            "alternative_supplier": "Cumilla Textile Mills (Lead time: +2 days, Cost: +3.2%)"
        },
        {
            "supplier": "Meghna Industrial Gases",
            "material": "Liquid Nitrogen & Argon",
            "risk_score": 0.22,
            "risk_level": "Low",
            "reason": "Buffer stock adequate for 28 days",
            "alternative_supplier": "Standard supplier active"
        }
    ]

@app.post("/api/agent/chat", response_model=ChatResponse)
def chat_agent(req: ChatRequest):
    user_msg = req.message.lower()
    
    if "hydraulic" in user_msg or "hyd-04" in user_msg or "press" in user_msg:
        return ChatResponse(
            response="⚠️ Machine HYD-04 (Hydraulic Stamping Press) is in CRITICAL state. Vibration reached 8.7 mm/s (threshold: 4.5 mm/s) with Remaining Useful Life estimated at under 36 hours. Recommendation: Halt non-essential cycle runs, check hydraulic fluid viscosity and valve seal 3B.",
            action_suggested="Issue preventive work-order to Gazipur Line technician team immediately.",
            confidence=0.96,
            sources=["Sensor Telemetry: HYD-04", "Predictive Failure Model: XGBoost-v2", "ISO 10816 Vibration Standard"]
        )
    elif "supply" in user_msg or "cotton" in user_msg or "yarn" in user_msg or "vendor" in user_msg:
        return ChatResponse(
            response="Supply Chain Nexus Alert: Narsingdi Cotton Spinners Ltd has an elevated risk score of 0.78 due to localized transport delays on the Dhaka-Sylhet corridor. Recommend rerouting 30% quota to Cumilla Textile Mills to preserve on-time delivery for Export Order #BGMEA-982.",
            action_suggested="Trigger auto-RFQ to Cumilla Textile Mills via Supply Chain MCP.",
            confidence=0.91,
            sources=["Supply Chain Graph (Neo4j)", "Bangladesh Meteorological Dept flood bulletin", "Logistics transit logs"]
        )
    elif "bangla" in user_msg or "বাংলা" in user_msg or "কেমন" in user_msg:
        return ChatResponse(
            response="ইন্ডাস্ট্রিস্ফিয়ার এআই সক্রিয় আছে। কারখানা লাইনে এই মুহূর্তে ১টি মেশিন (HYD-04) ক্রিটিক্যাল অবস্থায় রয়েছে। অনতিবিলম্বে হাইড্রোলিক ভালভ ও কম্পন পরীক্ষা করার পরামর্শ দেওয়া হচ্ছে।",
            action_suggested="ওয়ার্ক অর্ডার তৈরি করুন।",
            confidence=0.98,
            sources=["ইন্ডাস্ট্রিস্ফিয়ার লোকাল নলেজ বেস", "ফ্যাক্টরি ব্রেন"]
        )
    else:
        return ChatResponse(
            response=f"Factory Brain analyzed query: '{req.message}'. Current plant health is at 84.6% OEE with 18 machines operational. Predictive anomaly detection has flagged HYD-04 for bearing degradation and highlighted low-risk yarn supply buffers.",
            action_suggested="View Machine Fleet tab or run detailed vibration frequency spectrum analysis.",
            confidence=0.88,
            sources=["Enterprise VectorDB (pgvector)", "TimescaleDB telemetry stream", "Factory Brain Orchestrator"]
        )
