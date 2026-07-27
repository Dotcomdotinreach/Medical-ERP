import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { TRIAGE_COLOR, type ClinicalTriage, type ApptStatus } from "./docData";

type Tone = "brand" | "success" | "warning" | "danger" | "info" | "neutral";

/** Map appointment status → StatusBadge tone. */
export function apptTone(s: ApptStatus): Tone {
  switch (s) {
    case "Completed": return "success";
    case "In Consultation": return "brand";
    case "Checked In": return "info";
    case "Scheduled": return "neutral";
    case "Delayed": return "warning";
    case "Cancelled": return "danger";
    default: return "neutral";
  }
}

/** Small triage badge preview used on cards. */
export function TriagePreview({ triage }: { triage: ClinicalTriage }) {
  const c = TRIAGE_COLOR[triage];
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
      style={{ background: `${c}14`, color: c }}>
      <span className="size-1.5 rounded-full" style={{ background: c }} />{triage}
    </span>
  );
}

/** Labelled field wrapper for forms. */
export function Field({ label, hint, required, children }: { label: string; hint?: string; required?: boolean; children: ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-text-primary">{label}{required && <span className="text-danger"> *</span>}</span>
      {children}
      {hint && <span className="block text-xs text-text-secondary">{hint}</span>}
    </label>
  );
}

/** Vertical workflow rail shown on the left of the encounter. */
export interface WorkflowStep { id: string; label: string; group: string }

export function WorkflowRail({
  steps, activeId, doneIds, onJump,
}: { steps: WorkflowStep[]; activeId: string; doneIds: Set<string>; onJump: (id: string) => void }) {
  let lastGroup = "";
  return (
    <nav className="space-y-1">
      {steps.map((s, i) => {
        const active = s.id === activeId;
        const done = doneIds.has(s.id);
        const showGroup = s.group !== lastGroup;
        lastGroup = s.group;
        return (
          <div key={s.id}>
            {showGroup && <div className="px-2 pb-1 pt-3 text-xs font-semibold uppercase tracking-wide text-text-secondary first:pt-0">{s.group}</div>}
            <button onClick={() => onJump(s.id)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${active ? "bg-primary text-primary-foreground" : "text-text-secondary hover:bg-accent hover:text-text-primary"}`}>
              <span className={`grid size-6 shrink-0 place-items-center rounded-full border text-xs font-semibold ${active ? "border-white/40 bg-white/20 text-white" : done ? "border-success bg-success/10 text-success" : "border-border text-text-secondary"}`}>
                {done && !active ? <Check className="size-3.5" /> : i + 1}
              </span>
              <span className="flex-1 font-medium">{s.label}</span>
            </button>
          </div>
        );
      })}
    </nav>
  );
}

/** Colour-coded clinical value chip with normal-range awareness. */
export function VitalStat({ label, value, unit, status = "normal" }:
  { label: string; value: string | number; unit?: string; status?: "normal" | "high" | "low" | "warn" }) {
  const tone = status === "normal" ? "#16a34a" : status === "warn" ? "#f59e0b" : "#dc2626";
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="text-xs text-text-secondary">{label}</div>
      <div className="mt-1 flex items-baseline gap-1">
        <span className="font-bold text-text-primary" style={{ fontSize: 22, color: tone }}>{value}</span>
        {unit && <span className="text-xs text-text-secondary">{unit}</span>}
      </div>
    </div>
  );
}
