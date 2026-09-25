"use client";

import React from "react";

export interface Machine {
  id: string;
  name: string;
  section: string;
  status: "healthy" | "warning" | "critical";
  vibration_mm_s: number;
  temperature_c: number;
  pressure_psi: number;
  rul_hours: number;
  oee_percent: number;
  anomaly_score: number;
  last_maintenance: string;
}

interface MachineGridProps {
  machines: Machine[];
  selectedMachine: Machine | null;
  onSelectMachine: (machine: Machine) => void;
}

export const MachineGrid: React.FC<MachineGridProps> = ({
  machines,
  selectedMachine,
  onSelectMachine,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {machines.map((m) => {
        const isSelected = selectedMachine?.id === m.id;
        const statusConfig = {
          healthy: {
            bg: "bg-emerald-950/40 border-emerald-500/30 text-emerald-400",
            dot: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]",
            label: "Optimal",
          },
          warning: {
            bg: "bg-amber-950/40 border-amber-500/30 text-amber-400",
            dot: "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]",
            label: "Degraded",
          },
          critical: {
            bg: "bg-rose-950/40 border-rose-500/30 text-rose-400",
            dot: "bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.8)] animate-ping",
            label: "Critical Alert",
          },
        }[m.status];

        return (
          <div
            key={m.id}
            onClick={() => onSelectMachine(m)}
            className={`p-5 rounded-xl border transition-all duration-200 cursor-pointer backdrop-blur-md relative overflow-hidden ${
              isSelected
                ? "border-cyan-500/80 bg-slate-900/90 shadow-[0_0_20px_rgba(6,182,212,0.2)]"
                : "border-slate-800/80 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900/80"
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className={`w-2.5 h-2.5 rounded-full ${statusConfig.dot}`} />
                <span className="font-mono text-xs font-semibold tracking-wider text-slate-300">
                  {m.id}
                </span>
              </div>
              <span
                className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${statusConfig.bg}`}
              >
                {statusConfig.label}
              </span>
            </div>

            <h3 className="font-semibold text-slate-100 text-sm mb-1">{m.name}</h3>
            <p className="text-xs text-slate-400 mb-4">{m.section}</p>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-lg bg-slate-950/60 border border-slate-800/60 font-mono text-xs">
              <div>
                <span className="text-[10px] text-slate-500 block">VIB</span>
                <span className={`font-semibold ${m.vibration_mm_s > 4.5 ? "text-rose-400" : "text-slate-200"}`}>
                  {m.vibration_mm_s} mm/s
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">TEMP</span>
                <span className={`font-semibold ${m.temperature_c > 85 ? "text-rose-400" : "text-slate-200"}`}>
                  {m.temperature_c}°C
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">RUL</span>
                <span className={`font-semibold ${m.rul_hours < 50 ? "text-rose-400" : "text-cyan-400"}`}>
                  {m.rul_hours}h
                </span>
              </div>
            </div>

            {/* OEE Progress bar */}
            <div className="mt-3">
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>OEE Efficiency</span>
                <span className="font-mono font-medium text-slate-200">{m.oee_percent}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    m.oee_percent > 85
                      ? "bg-emerald-500"
                      : m.oee_percent > 70
                      ? "bg-amber-500"
                      : "bg-rose-500"
                  }`}
                  style={{ width: `${m.oee_percent}%` }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
