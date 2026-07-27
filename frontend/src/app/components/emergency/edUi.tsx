import { Heart, Activity, Thermometer, Wind, Droplets, Gauge, Check } from "lucide-react";
import { TRIAGE_META, type Triage, type Vitals, type EDStage } from "./edData";

/* ---- Triage pill -------------------------------------------------- */
export function TriagePill({ triage, showLabel = false }: { triage: Triage; showLabel?: boolean }) {
  const m = TRIAGE_META[triage];
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
      style={{ background: `${m.color}1a`, color: m.color }}>
      <span className="size-2 rounded-full" style={{ background: m.color }} />
      {triage}{showLabel && ` · ${m.label}`}
    </span>
  );
}

/* ---- Vital thresholds --------------------------------------------- */
function tone(ok: boolean) { return ok ? "text-text-primary" : "text-danger"; }

export function VitalsWidget({ v, compact = false }: { v: Vitals; compact?: boolean }) {
  const items = [
    { icon: Heart, label: "Heart Rate", value: `${v.hr}`, unit: "bpm", ok: v.hr >= 60 && v.hr <= 100 },
    { icon: Gauge, label: "Blood Pressure", value: `${v.sbp}/${v.dbp}`, unit: "mmHg", ok: v.sbp >= 90 && v.sbp <= 140 },
    { icon: Droplets, label: "SpO₂", value: `${v.spo2}`, unit: "%", ok: v.spo2 >= 94 },
    { icon: Wind, label: "Resp. Rate", value: `${v.rr}`, unit: "/min", ok: v.rr >= 12 && v.rr <= 20 },
    { icon: Thermometer, label: "Temp", value: `${v.temp}`, unit: "°C", ok: v.temp <= 37.5 },
    { icon: Activity, label: "Pain", value: `${v.pain}`, unit: "/10", ok: v.pain <= 3 },
  ];
  return (
    <div className={`grid gap-3 ${compact ? "grid-cols-3" : "grid-cols-2 sm:grid-cols-3"}`}>
      {items.map((it) => (
        <div key={it.label} className={`rounded-lg border p-3 ${it.ok ? "border-border" : "border-danger/40 bg-danger/5"}`}>
          <div className="flex items-center gap-1.5 text-xs text-text-secondary"><it.icon className={`size-3.5 ${it.ok ? "" : "text-danger"}`} />{it.label}</div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className={`font-bold ${tone(it.ok)}`} style={{ fontSize: 18 }}>{it.value}</span>
            <span className="text-xs text-text-secondary">{it.unit}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---- Stage tracker ------------------------------------------------ */
const STAGES: EDStage[] = ["Registration", "Triage", "Doctor", "Lab", "Radiology", "Treatment", "Observation", "Disposition"];

export function StageTracker({ current }: { current: EDStage }) {
  const idx = STAGES.indexOf(current);
  return (
    <div className="flex items-center overflow-x-auto pb-1">
      {STAGES.map((s, i) => {
        const done = i < idx, active = i === idx;
        return (
          <div key={s} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div className={`grid size-8 place-items-center rounded-full text-xs font-semibold ${done ? "bg-success text-white" : active ? "bg-primary text-white ring-4 ring-primary/15" : "bg-muted text-text-secondary"}`}>
                {done ? <Check className="size-4" /> : i + 1}
              </div>
              <span className={`whitespace-nowrap text-[11px] ${active ? "font-medium text-text-primary" : "text-text-secondary"}`}>{s}</span>
            </div>
            {i < STAGES.length - 1 && <div className={`mx-1 h-0.5 w-8 shrink-0 sm:w-12 ${done ? "bg-success" : "bg-border"}`} />}
          </div>
        );
      })}
    </div>
  );
}
