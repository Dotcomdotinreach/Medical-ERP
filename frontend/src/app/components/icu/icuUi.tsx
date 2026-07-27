import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import type { ICUBedStatus, CriticalityLevel, VentilatorMode, IsolationLevel } from "./data";
import { criticalityTone, bedStatusTone } from "./data";

/* ---- Criticality badge ------------------------------------------- */
export function CriticalityBadge({ level }: { level: CriticalityLevel }) {
  const tone = criticalityTone(level);
  const TONES: Record<string, string> = {
    brand: "bg-secondary text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-[#b45309]",
    danger: "bg-danger/10 text-danger",
    info: "bg-info/10 text-[#0369a1]",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${TONES[tone]}`}>
      {level === "Critical" && <span className="size-1.5 rounded-full bg-danger animate-pulse" />}
      {level}
    </span>
  );
}

/* ---- ICU bed status badge ----------------------------------------- */
export function ICUBedStatusBadge({ status }: { status: ICUBedStatus }) {
  const tone = bedStatusTone(status);
  const TONES: Record<string, string> = {
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-[#b45309]",
    danger: "bg-danger/10 text-danger",
    info: "bg-info/10 text-[#0369a1]",
    brand: "bg-secondary text-primary",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${TONES[tone]}`}>
      {status}
    </span>
  );
}

/* ---- Ventilator mode badge --------------------------------------- */
export function VentModeBadge({ mode }: { mode: VentilatorMode }) {
  const TONES: Record<string, string> = {
    "AC/VC": "bg-info/10 text-[#0369a1]",
    "AC/PC": "bg-info/10 text-[#0369a1]",
    "SIMV": "bg-warning/10 text-[#b45309]",
    "PSV": "bg-secondary text-primary",
    CPAP: "bg-success/10 text-success",
    NIV: "bg-warning/10 text-[#b45309]",
    Offline: "bg-success/10 text-success",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${TONES[mode] || "bg-muted text-text-secondary"}`}>
      {mode}
    </span>
  );
}

/* ---- Isolation badge --------------------------------------------- */
export function IsolationBadge({ level }: { level: IsolationLevel }) {
  if (level === "None") return null;
  const TONES: Record<string, string> = {
    Contact: "bg-info/10 text-[#0369a1]",
    Droplet: "bg-warning/10 text-[#b45309]",
    Airborne: "bg-danger/10 text-danger",
    "Negative Pressure": "bg-danger/10 text-danger",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${TONES[level]}`}>
      {(level === "Airborne" || level === "Negative Pressure") && <span className="size-1.5 rounded-full bg-danger animate-pulse" />}
      {level}
    </span>
  );
}

/* ---- ICU stat card ------------------------------------------------- */
export function IcuStatCard({ icon: Icon, label, value, hint, trend, tone = "brand" }: {
  icon: LucideIcon; label: string; value: string | number; hint?: string; trend?: number;
  tone?: "brand" | "success" | "warning" | "danger" | "info" | "neutral";
}) {
  const toneBg: Record<string, string> = {
    brand: "bg-secondary text-primary", success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-[#b45309]", danger: "bg-danger/10 text-danger",
    info: "bg-info/10 text-[#0369a1]", neutral: "bg-muted text-text-secondary",
  };
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="flex items-center justify-between">
        <div className={`grid size-10 place-items-center rounded-lg ${toneBg[tone]}`}><Icon className="size-5" /></div>
        {trend !== undefined && (
          <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${trend >= 0 ? "text-success" : "text-danger"}`}>
            {trend >= 0 ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}{Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="mt-4 font-bold text-text-primary" style={{ fontSize: 24 }}>{value}</div>
      <div className="mt-0.5 text-sm text-text-secondary">{label}</div>
      {hint && <div className="mt-2 text-xs text-text-secondary">{hint}</div>}
    </div>
  );
}

/* ---- Section card -------------------------------------------------- */
export function IcuSection({ title, action, children, className = "" }: {
  title?: string; action?: ReactNode; children: ReactNode; className?: string;
}) {
  return (
    <div className={`rounded-xl border border-border bg-surface ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          {title && <h3 className="font-semibold text-text-primary">{title}</h3>}
          {action}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}

/* ---- Page header --------------------------------------------------- */
export function IcuPageHeader({ title, subtitle, actions }: {
  title: string; subtitle?: string; actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="font-bold text-text-primary" style={{ fontSize: 24 }}>{title}</h1>
        {subtitle && <p className="mt-1 text-text-secondary">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

/* ---- ICU Bed Card -------------------------------------------------- */
export function ICUBedCard({ bed, onClick }: {
  bed: { number: string; type: string; status: string; patientName?: string; intensivist?: string; nurse?: string; isolationLevel: string; onVentilator: boolean };
  onClick?: () => void;
}) {
  const bg: Record<string, string> = {
    Available: "border-success/30 bg-success/5", Occupied: "border-danger/30 bg-danger/5",
    Cleaning: "border-warning/30 bg-warning/5", Reserved: "border-info/30 bg-info/5",
    Maintenance: "border-muted bg-muted/50", Blocked: "border-danger/30 bg-danger/5",
  };
  return (
    <button onClick={onClick} className={`rounded-xl border-2 p-4 text-left transition-colors hover:border-primary ${bg[bed.status] || "border-border"}`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="font-bold text-text-primary">{bed.number}</div>
          <div className="text-xs text-text-secondary">{bed.type}</div>
        </div>
        <ICUBedStatusBadge status={bed.status as ICUBedStatus} />
      </div>
      {bed.patientName && (
        <div className="mt-2">
          <div className="text-sm font-medium text-text-primary">{bed.patientName}</div>
          <div className="text-xs text-text-secondary">{bed.intensivist}</div>
          <div className="text-xs text-text-secondary">Nurse: {bed.nurse}</div>
        </div>
      )}
      <div className="mt-2 flex gap-1">
        {bed.onVentilator && <span className="rounded bg-warning/10 px-1.5 py-0.5 text-[10px] font-medium text-[#b45309]">VENT</span>}
        {bed.isolationLevel !== "None" && <IsolationBadge level={bed.isolationLevel as IsolationLevel} />}
      </div>
    </button>
  );
}

/* ---- Vitals Widget ------------------------------------------------- */
export function VitalsWidget({ vitals, compact }: { vitals: { bp: string; hr: number; spo2: number; rr?: number; temp: number; etco2?: number; cvp?: number }; compact?: boolean }) {
  if (compact) {
    return (
      <div className="grid grid-cols-4 gap-2">
        <div className="rounded bg-muted px-2 py-1 text-center"><div className="text-[9px] text-text-secondary">HR</div><div className="text-xs font-bold text-text-primary">{vitals.hr}</div></div>
        <div className="rounded bg-muted px-2 py-1 text-center"><div className="text-[9px] text-text-secondary">BP</div><div className="text-xs font-bold text-text-primary">{vitals.bp}</div></div>
        <div className="rounded bg-muted px-2 py-1 text-center"><div className="text-[9px] text-text-secondary">SpO2</div><div className="text-xs font-bold text-success">{vitals.spo2}%</div></div>
        <div className="rounded bg-muted px-2 py-1 text-center"><div className="text-[9px] text-text-secondary">Temp</div><div className="text-xs font-bold text-text-primary">{vitals.temp}°</div></div>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      <div className="rounded-lg bg-muted p-3 text-center">
        <div className="text-xs text-text-secondary">Heart Rate</div>
        <div className="text-lg font-bold text-text-primary">{vitals.hr} bpm</div>
      </div>
      <div className="rounded-lg bg-muted p-3 text-center">
        <div className="text-xs text-text-secondary">Blood Pressure</div>
        <div className="text-lg font-bold text-text-primary">{vitals.bp}</div>
      </div>
      <div className="rounded-lg bg-muted p-3 text-center">
        <div className="text-xs text-text-secondary">SpO₂</div>
        <div className="text-lg font-bold text-success">{vitals.spo2}%</div>
      </div>
      <div className="rounded-lg bg-muted p-3 text-center">
        <div className="text-xs text-text-secondary">Temperature</div>
        <div className="text-lg font-bold text-text-primary">{vitals.temp}°C</div>
      </div>
      {vitals.rr !== undefined && (
        <div className="rounded-lg bg-muted p-3 text-center">
          <div className="text-xs text-text-secondary">Resp Rate</div>
          <div className="text-lg font-bold text-text-primary">{vitals.rr}/min</div>
        </div>
      )}
      {vitals.etco2 !== undefined && (
        <div className="rounded-lg bg-muted p-3 text-center">
          <div className="text-xs text-text-secondary">EtCO₂</div>
          <div className="text-lg font-bold text-text-primary">{vitals.etco2} mmHg</div>
        </div>
      )}
      {vitals.cvp !== undefined && (
        <div className="rounded-lg bg-muted p-3 text-center">
          <div className="text-xs text-text-secondary">CVP</div>
          <div className="text-lg font-bold text-text-primary">{vitals.cvp} cmH₂O</div>
        </div>
      )}
    </div>
  );
}

/* ---- Alarm status row ---------------------------------------------- */
export function AlarmRow({ parameter, status }: { parameter: string; status: string }) {
  const color = status === "Normal" ? "text-success" : status === "Warning" ? "text-[#b45309]" : "text-danger";
  return (
    <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
      <span className="text-sm text-text-primary">{parameter}</span>
      <span className={`text-xs font-medium ${color}`}>{status}</span>
    </div>
  );
}
