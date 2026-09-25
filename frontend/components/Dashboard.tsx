"use client";

import React, { useState, useEffect } from "react";
import { MachineGrid, Machine } from "./MachineGrid";

const DEFAULT_MACHINES: Machine[] = [
  {
    id: "CNC-01",
    name: "Heavy Milling Machine #1",
    section: "Machining Line A (Gazipur)",
    status: "healthy",
    vibration_mm_s: 2.1,
    temperature_c: 64.2,
    pressure_psi: 88.0,
    rul_hours: 1420,
    oee_percent: 91.4,
    anomaly_score: 0.08,
    last_maintenance: "2026-09-10"
  },
  {
    id: "CNC-02",
    name: "Precision Lathe #2",
    section: "Machining Line A (Gazipur)",
    status: "warning",
    vibration_mm_s: 5.4,
    temperature_c: 79.5,
    pressure_psi: 94.2,
    rul_hours: 184,
    oee_percent: 74.8,
    anomaly_score: 0.72,
    last_maintenance: "2026-08-14"
  },
  {
    id: "HYD-04",
    name: "Hydraulic Stamping Press",
    section: "Forming Unit B (Narsingdi)",
    status: "critical",
    vibration_mm_s: 8.7,
    temperature_c: 92.1,
    pressure_psi: 128.5,
    rul_hours: 36,
    oee_percent: 58.2,
    anomaly_score: 0.94,
    last_maintenance: "2026-07-29"
  },
  {
    id: "TEX-08",
    name: "High-Speed Circular Loom",
    section: "Weaving Floor (Savar)",
    status: "healthy",
    vibration_mm_s: 1.8,
    temperature_c: 58.0,
    pressure_psi: 72.0,
    rul_hours: 2100,
    oee_percent: 94.1,
    anomaly_score: 0.05,
    last_maintenance: "2026-09-18"
  },
  {
    id: "BOIL-02",
    name: "Biomass Steam Boiler",
    section: "Utilities & Power",
    status: "healthy",
    vibration_mm_s: 2.9,
    temperature_c: 110.4,
    pressure_psi: 140.0,
    rul_hours: 980,
    oee_percent: 88.5,
    anomaly_score: 0.14,
    last_maintenance: "2026-09-01"
  }
];

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"factory" | "predictive" | "vision" | "supply" | "green">("factory");
  const [machines, setMachines] = useState<Machine[]>(DEFAULT_MACHINES);
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(DEFAULT_MACHINES[2]); // Default to critical HYD-04
  const [lang, setLang] = useState<"en" | "bn">("en");
  const [backendConnected, setBackendConnected] = useState<boolean>(false);

  // Chat copilot state
  const [chatInput, setChatInput] = useState<string>("");
  const [messages, setMessages] = useState<Array<{ sender: "user" | "ai"; text: string; action?: string; sources?: string[] }>>([
    {
      sender: "ai",
      text: "Factory Brain Copilot active. Monitoring 18 industrial assets across Gazipur, Savar, and Narsingdi hubs. How can I assist you with plant operations today?",
      sources: ["TimescaleDB Telemetry Hypertable", "Neo4j Industrial Graph", "YOLOv8 Vision Edge"]
    }
  ]);
  const [isSending, setIsSending] = useState<boolean>(false);

  // Poll backend if available, otherwise simulate fluctuations
  useEffect(() => {
    const fetchBackend = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/machines");
        if (res.ok) {
          const data = await res.json();
          setMachines(data);
          setBackendConnected(true);
          return;
        }
      } catch {
        // Backend not running locally yet, use dynamic client simulation
        setBackendConnected(false);
      }

      // Fallback: subtle dynamic vibration simulation
      setMachines((prev) =>
        prev.map((m) => ({
          ...m,
          vibration_mm_s: +(m.vibration_mm_s + (Math.random() * 0.1 - 0.05)).toFixed(2),
          temperature_c: +(m.temperature_c + (Math.random() * 0.2 - 0.1)).toFixed(1),
        }))
      );
    };

    const interval = setInterval(fetchBackend, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isSending) return;

    const userText = chatInput.trim();
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setChatInput("");
    setIsSending(true);

    try {
      if (backendConnected) {
        const res = await fetch("http://localhost:8000/api/agent/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userText }),
        });
        if (res.ok) {
          const data = await res.json();
          setMessages((prev) => [
            ...prev,
            {
              sender: "ai",
              text: data.response,
              action: data.action_suggested,
              sources: data.sources,
            },
          ]);
          setIsSending(false);
          return;
        }
      }
    } catch {
      // Fall through to client mock response
    }

    // Client mock intelligent response
    setTimeout(() => {
      const lower = userText.toLowerCase();
      let reply = "";
      let action = "";
      let sources = ["Local Context Engine", "Edge Sensor Model"];

      if (lower.includes("hyd") || lower.includes("press") || lower.includes("vibrat")) {
        reply = "⚠️ Warning: Machine HYD-04 (Hydraulic Stamping Press) vibration is in the danger zone at 8.7 mm/s. Predicted failure window: 36 operating hours. Root cause candidate: Hydraulic manifold cavitation & bearing cage wear.";
        action = "Schedule preventive maintenance inspection for Shift B.";
        sources = ["XGBoost RUL Predictor", "ISO 10816-3 Thresholds"];
      } else if (lower.includes("supply") || lower.includes("cotton") || lower.includes("yarn") || lower.includes("vendor")) {
        reply = "Supply Chain Nexus: Narsingdi Cotton Spinners Ltd has an elevated risk score (0.78) due to logistics corridor bottleneck. Recommended failover supplier: Cumilla Textile Mills (lead time +2 days).";
        action = "Issue RFQ to Cumilla Textile Mills via Graph RAG pipeline.";
        sources = ["Neo4j Supply Chain Graph", "BMD Meteorological Floods API"];
      } else if (lower.includes("বাংলা") || lower.includes("কেমন") || lower.includes("অবস্থা")) {
        reply = "ইন্ডাস্ট্রিস্ফিয়ার এআই সক্রিয় আছে। বর্তমানে ১টি মেশিন (HYD-04) ক্রিটিক্যাল সতর্কতা দেখাচ্ছে। কারখানা গড় OEE ৮৪.৬%।";
        action = "মেইনটেন্যান্স টিমকে সতর্ক করুন।";
        sources = ["বাংলা ন্যাচারাল ল্যাঙ্গুয়েজ মডেল", "প্ল্যান্ট ডেটাবেস"];
      } else {
        reply = `Factory Brain processed query: "${userText}". All systems operational with OEE at 84.6%. 1 Critical machine flagged for review.`;
        sources = ["LangGraph Multi-Agent", "VectorDB pgvector"];
      }

      setMessages((prev) => [...prev, { sender: "ai", text: reply, action, sources }]);
      setIsSending(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-emerald-400 p-[1px] flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 text-lg">
                  ⚙️
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base tracking-tight text-white">IndustrySphere AI</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 px-2 py-0.5 rounded-full">
                  Team Ace of Spades
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Infinity AI BuildFest 2026 · SME Operations & Supply Chain Nexus</p>
            </div>
          </div>

          {/* Quick status & language */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs">
              <span className={`w-2 h-2 rounded-full ${backendConnected ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" : "bg-amber-400"}`} />
              <span className="text-slate-300">
                {backendConnected ? "Backend API Online (Port 8000)" : "Edge Simulation Active"}
              </span>
            </div>

            <button
              onClick={() => setLang(lang === "en" ? "bn" : "en")}
              className="px-3 py-1 text-xs font-medium rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
            >
              {lang === "en" ? "বাংলা" : "English"}
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1 overflow-x-auto border-t border-slate-800/60 py-1 text-xs font-medium">
          {[
            { id: "factory", label: lang === "bn" ? "ফ্যাক্টরি ব্রেন" : "🧠 Factory Brain", desc: "Fleet & Health" },
            { id: "predictive", label: lang === "bn" ? "প্রেডিক্টিভ প্ল্যান্ট" : "🔮 Predictive Plant", desc: "RUL & Vibration" },
            { id: "vision", label: lang === "bn" ? "কোয়ালিটি ভিশন" : "👁️ Quality Vision", desc: "YOLOv8 Edge" },
            { id: "supply", label: lang === "bn" ? "সাপ্লাই চেইন নেক্সাস" : "🔗 Supply Chain Nexus", desc: "Graph RAG" },
            { id: "green", label: lang === "bn" ? "গ্রিন ম্যানুফ্যাকচারিং" : "🌱 Green Manufacturing", desc: "ESG & Carbon" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-semibold"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Top KPIs Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
            <span className="text-xs text-slate-400 block mb-1">Factory OEE</span>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold font-mono text-emerald-400">84.6%</span>
              <span className="text-xs text-emerald-500 font-medium">↑ +3.2% vs last wk</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">World Class benchmark: 85%</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
            <span className="text-xs text-slate-400 block mb-1">Active Machine Fleet</span>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold font-mono text-cyan-400">18 / 20</span>
              <span className="text-xs text-rose-400 font-medium">1 Critical</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Gazipur & Narsingdi Plants</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
            <span className="text-xs text-slate-400 block mb-1">Supply Chain Risk</span>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold font-mono text-amber-400">Medium</span>
              <span className="text-xs text-amber-400 font-medium">1 Vendor Alert</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Dhaka-Sylhet corridor flood risk</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
            <span className="text-xs text-slate-400 block mb-1">Carbon Saved (MTD)</span>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold font-mono text-emerald-400">3,420 kg</span>
              <span className="text-xs text-emerald-500 font-medium">↓ -14% kWh</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">GRI-aligned ESG standard</p>
          </div>
        </div>

        {/* Tab 1: Factory Brain */}
        {activeTab === "factory" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">Factory Floor Telemetry & Digital Twin</h2>
                <p className="text-xs text-slate-400">Real-time edge sensor ingestion via MQTT & TimescaleDB hypertable</p>
              </div>
              <span className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
                Live stream (3s sync)
              </span>
            </div>

            <MachineGrid
              machines={machines}
              selectedMachine={selectedMachine}
              onSelectMachine={(m) => setSelectedMachine(m)}
            />

            {/* Selected Machine Detail Panel */}
            {selectedMachine && (
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-cyan-500/30 backdrop-blur-md">
                <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-2">
                  <div>
                    <span className="text-xs font-mono text-cyan-400 font-semibold">{selectedMachine.id}</span>
                    <h3 className="text-base font-bold text-white">{selectedMachine.name}</h3>
                    <p className="text-xs text-slate-400">{selectedMachine.section}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 block">ANOMALY CONFIDENCE</span>
                      <span className="font-mono text-sm font-bold text-rose-400">
                        {(selectedMachine.anomaly_score * 100).toFixed(0)}% Risk
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setChatInput(`Analyze telemetry and failure risk for machine ${selectedMachine.id}`);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs shadow-md transition"
                    >
                      Ask AI Diagnosis
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 text-xs font-mono">
                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-500 block">VIBRATION (ISO 10816)</span>
                    <span className="text-lg font-bold text-slate-100">{selectedMachine.vibration_mm_s} mm/s</span>
                    <span className="text-[10px] text-rose-400 block mt-0.5">Threshold: 4.5 mm/s</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-500 block">THERMAL BEHAVIOR</span>
                    <span className="text-lg font-bold text-slate-100">{selectedMachine.temperature_c}°C</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Normal max: 80°C</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-500 block">HYDRAULIC PRESSURE</span>
                    <span className="text-lg font-bold text-slate-100">{selectedMachine.pressure_psi} PSI</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Rated: 90 PSI</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-500 block">REMAINING USEFUL LIFE</span>
                    <span className="text-lg font-bold text-cyan-400">{selectedMachine.rul_hours} Hours</span>
                    <span className="text-[10px] text-amber-400 block mt-0.5">Maint due: {selectedMachine.last_maintenance}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Predictive Plant */}
        {activeTab === "predictive" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-white">Predictive Plant & Anomaly Intelligence</h2>
              <p className="text-xs text-slate-400">XGBoost & LSTM Remaining Useful Life (RUL) inference models</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                <h3 className="text-sm font-semibold text-slate-200">High-Risk Asset Countdown</h3>
                <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono text-xs font-bold text-rose-400">HYD-04 — Stamping Press</span>
                      <p className="text-xs text-slate-300 mt-1">High probability of catastrophic bearing seizure</p>
                    </div>
                    <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-rose-500/20 text-rose-300">
                      36h Remaining
                    </span>
                  </div>
                  <div className="mt-3 text-xs text-slate-400">
                    <strong>Recommended Action:</strong> Replace seal pack 4B and check hydraulic pump cavitation during night shift maintenance.
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono text-xs font-bold text-amber-400">CNC-02 — Precision Lathe</span>
                      <p className="text-xs text-slate-300 mt-1">Spindle imbalance detected at 4,200 RPM</p>
                    </div>
                    <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-amber-500/20 text-amber-300">
                      184h Remaining
                    </span>
                  </div>
                  <div className="mt-3 text-xs text-slate-400">
                    <strong>Recommended Action:</strong> Recalibrate spindle balancing weights before high-tolerance milling batch.
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                <h3 className="text-sm font-semibold text-slate-200">ML Model Lifecycle & Governance (AI-DLC)</h3>
                <div className="space-y-3 text-xs font-mono">
                  <div className="flex justify-between py-2 border-b border-slate-800">
                    <span className="text-slate-400">RUL Model:</span>
                    <span className="text-slate-200 font-semibold">XGBoost-Regressor-v2.4 (ONNX)</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-800">
                    <span className="text-slate-400">Anomaly Detection:</span>
                    <span className="text-slate-200 font-semibold">IsolationForest + Autoencoder</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-800">
                    <span className="text-slate-400">Tracking Server:</span>
                    <span className="text-cyan-400 font-semibold">MLflow 2.14 @ :5000</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-800">
                    <span className="text-slate-400">Drift Monitoring:</span>
                    <span className="text-emerald-400 font-semibold">Evidently AI (0.012 Drift - OK)</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-slate-400">Local Edge Runtime:</span>
                    <span className="text-purple-400 font-semibold">Ollama (Mistral-7B Offline)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Quality Vision */}
        {activeTab === "vision" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-white">Quality Vision — Real-time Automated Optical Inspection (AOI)</h2>
              <p className="text-xs text-slate-400">Ultralytics YOLOv8 defect detection at 30 FPS on factory conveyor</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono text-slate-300">Conveyor Inspection Line #3 — Savar RMG Garments</span>
                  <span className="flex items-center space-x-1.5 text-xs text-rose-400 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    <span>DEFECT DETECTED</span>
                  </span>
                </div>

                {/* Simulated Camera Feed Frame */}
                <div className="aspect-video w-full rounded-xl bg-slate-950 border border-slate-800 relative flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent pointer-events-none" />
                  
                  {/* Bounding box simulation */}
                  <div className="absolute w-44 h-28 border-2 border-rose-500 rounded bg-rose-500/10 flex flex-col justify-between p-1.5 shadow-[0_0_15px_rgba(244,63,94,0.3)]">
                    <span className="bg-rose-600 text-white font-mono text-[10px] font-bold px-1.5 py-0.5 rounded w-max">
                      Skipped Stitch (94.2%)
                    </span>
                    <span className="text-[9px] font-mono text-rose-300">x:342 y:120 w:176 h:112</span>
                  </div>

                  <div className="text-center">
                    <p className="font-mono text-xs text-slate-500">Live RTSP Feed Simulated</p>
                    <p className="font-mono text-[11px] text-slate-600">Model: yolov8n-garment-defect.pt (ONNX Edge)</p>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                <h3 className="text-sm font-semibold text-slate-200">Today's Defect Summary</h3>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center p-2 rounded bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-300">Skipped Stitching</span>
                    <span className="font-mono font-bold text-rose-400">24 units</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-300">Oil Stain Contamination</span>
                    <span className="font-mono font-bold text-amber-400">8 units</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-300">Thread Tension Variation</span>
                    <span className="font-mono font-bold text-cyan-400">14 units</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-300">Pass Rate (First-Pass Yield)</span>
                    <span className="font-mono font-bold text-emerald-400">98.4%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Supply Chain Nexus */}
        {activeTab === "supply" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-white">Supply Chain Nexus — Graph RAG Knowledge Graph</h2>
              <p className="text-xs text-slate-400">Multi-tier vendor risk with Bangladesh logistics corridors and raw material dependencies</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                <h3 className="text-sm font-semibold text-slate-200">Active Vendor Bottleneck Alerts</h3>
                <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40">
                  <div className="flex justify-between">
                    <span className="font-bold text-amber-400 text-xs">Narsingdi Cotton Spinners Ltd</span>
                    <span className="font-mono text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">Risk: 0.78</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-2">
                    Flood warning triggered along Dhaka-Sylhet corridor. Transit delay estimated at +48 hours for 40s Cotton Yarn.
                  </p>
                  <div className="mt-3 p-2.5 rounded bg-slate-950/70 border border-slate-800 text-xs">
                    <span className="text-emerald-400 font-semibold block mb-0.5">AI Graph RAG Recommendation:</span>
                    <span>Failover 30% capacity to Cumilla Textile Mills (Lead time: 3 days, Cost delta: +3.2%).</span>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                <h3 className="text-sm font-semibold text-slate-200">Knowledge Graph Entities (Neo4j)</h3>
                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block">SUPPLIERS</span>
                    <span className="text-lg font-bold text-cyan-400">42 Nodes</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block">RAW MATERIALS</span>
                    <span className="text-lg font-bold text-indigo-400">118 Nodes</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block">RELATIONSHIPS</span>
                    <span className="text-lg font-bold text-emerald-400">480 Edges</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block">CORRIDORS</span>
                    <span className="text-lg font-bold text-amber-400">12 Routes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Green Manufacturing */}
        {activeTab === "green" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-white">Green Manufacturing & ESG Compliance</h2>
              <p className="text-xs text-slate-400">Automated Scope 1 & 2 carbon accounting with Global Reporting Initiative (GRI) exports</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <span className="text-xs text-slate-400 block">Energy Consumption Today</span>
                <span className="text-2xl font-bold font-mono text-emerald-400">14,280 kWh</span>
                <p className="text-xs text-slate-400">Grid: 68% · Rooftop Solar: 22% · Biomass: 10%</p>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden flex">
                  <div className="bg-cyan-500 h-full w-[68%]" />
                  <div className="bg-emerald-400 h-full w-[22%]" />
                  <div className="bg-amber-400 h-full w-[10%]" />
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <span className="text-xs text-slate-400 block">Carbon Intensity</span>
                <span className="text-2xl font-bold font-mono text-cyan-400">0.42 kg CO₂/unit</span>
                <p className="text-xs text-emerald-400 font-medium">↓ 18% lower than national SME baseline</p>
                <p className="text-[11px] text-slate-500">EU Carbon Border Adjustment Mechanism (CBAM) ready</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="text-xs text-slate-400 block mb-1">GRI Compliance Export</span>
                  <p className="text-xs text-slate-300">Generate certified sustainability report for international buyers & auditors.</p>
                </div>
                <button
                  onClick={() => alert("Downloading GRI Sustainability Audit PDF (Simulated)...")}
                  className="w-full mt-4 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition"
                >
                  Download GRI Report (PDF)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* AI Copilot Chat Drawer / Bottom Bar */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <h3 className="text-sm font-bold text-white">Factory Brain AI Copilot</h3>
              <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded font-mono">
                LangChain + Neo4j + pgvector
              </span>
            </div>
            <span className="text-xs text-slate-400">Bangla & English supported</span>
          </div>

          {/* Messages Container */}
          <div className="space-y-3 my-4 max-h-56 overflow-y-auto pr-2">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl text-xs ${
                  m.sender === "user"
                    ? "bg-cyan-950/60 border border-cyan-500/30 text-cyan-100 ml-auto max-w-[85%]"
                    : "bg-slate-950/80 border border-slate-800/80 text-slate-200 mr-auto max-w-[95%]"
                }`}
              >
                <div className="font-semibold text-[10px] text-slate-400 mb-1">
                  {m.sender === "user" ? "You" : "🤖 Factory Brain"}
                </div>
                <p className="leading-relaxed">{m.text}</p>
                {m.action && (
                  <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-amber-300">
                    💡 <strong>Suggested Action:</strong> {m.action}
                  </div>
                )}
                {m.sources && m.sources.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1 text-[9px] text-slate-500">
                    {m.sources.map((s, i) => (
                      <span key={i} className="px-1.5 py-0.5 bg-slate-900 rounded border border-slate-800">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isSending && (
              <div className="text-xs text-slate-400 italic">Factory Brain is analyzing plant data...</div>
            )}
          </div>

          {/* Input form */}
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder={lang === "bn" ? "কারখানা বা মেশিন সম্পর্কে প্রশ্ন লিখুন..." : "Ask Factory Brain (e.g. 'Why is HYD-04 vibration high?' or 'বাংলায় বলো')..."}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
            />
            <button
              type="submit"
              disabled={isSending}
              className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-cyan-600/20 disabled:opacity-50 transition"
            >
              Send
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-4 text-center text-xs text-slate-500 bg-slate-950">
        IndustrySphere AI · Team Ace of Spades · Infinity AI BuildFest 2026 (BRAC University, Dhaka)
      </footer>
    </div>
  );
};
