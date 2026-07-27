/* ── CSSD — Reusable UI Components ─────────────────────────────────────────── */
import { type ReactNode } from "react";
import {
  TrendingUp, TrendingDown, Minus, ChevronRight,
} from "lucide-react";
import type {
  InstrumentStatus, TrayStatus, SterilityStatus, CycleStatus,
  AutoclaveStatus, IssueStatus,
} from "./data";
import {
  instrumentStatusTone, trayStatusTone, sterilityTone, cycleStatusTone,
  autoclaveStatusTone, issueStatusTone,
} from "./data";

/* ── Status Pill ──────────────────────────────────────────────────────────── */
const TONE_MAP: Record<string, string> = {
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  danger: "bg-red-50 text-red-700 border-red-200",
  info: "bg-blue-50 text-blue-700 border-blue-200",
  neutral: "bg-gray-50 text-gray-600 border-gray-200",
};

export function StatusPill({ label, tone = "neutral" }: { label: string; tone?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${TONE_MAP[tone] ?? TONE_MAP.neutral}`}>
      {tone === "success" && <span className="size-1.5 rounded-full bg-emerald-500" />}
      {tone === "danger" && <span className="size-1.5 rounded-full bg-red-500 animate-pulse" />}
      {tone === "warning" && <span className="size-1.5 rounded-full bg-amber-500" />}
      {tone === "info" && <span className="size-1.5 rounded-full bg-blue-500" />}
      {label}
    </span>
  );
}

/* ── Page Header ──────────────────────────────────────────────────────────── */
export function PageHeader({ title, subtitle, icon: Icon, actions, breadcrumb }: {
  title: string; subtitle?: string; icon?: React.ElementType; actions?: ReactNode; breadcrumb?: string[];
}) {
  return (
    <div className="space-y-3">
      {breadcrumb && breadcrumb.length > 0 && (
        <div className="flex items-center gap-1.5 text-sm text-[var(--text-secondary,#6B778C)]">
          {breadcrumb.map((b, i) => (
            <span key={b} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="size-3" />}
              <span className={i === breadcrumb.length - 1 ? "font-medium text-[var(--text-primary,#172B4D)]" : ""}>{b}</span>
            </span>
          ))}
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {Icon && <div className="grid size-10 place-items-center rounded-xl bg-[#0052CC]/10 text-[#0052CC]"><Icon className="size-5" /></div>}
          <div>
            <h1 className="text-xl font-bold text-[var(--text-primary,#172B4D)]">{title}</h1>
            {subtitle && <p className="text-sm text-[var(--text-secondary,#6B778C)]">{subtitle}</p>}
          </div>
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}

/* ── Section ──────────────────────────────────────────────────────────────── */
export function Section({ title, subtitle, actions, children }: { title: string; subtitle?: string; actions?: ReactNode; children: ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-[var(--text-primary,#172B4D)]">{title}</h3>
          {subtitle && <p className="mt-0.5 text-sm text-[var(--text-secondary,#6B778C)]">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      {children}
    </div>
  );
}

/* ── KPI Card ─────────────────────────────────────────────────────────────── */
export function KPICard({ icon: Icon, label, value, sub, trend, trendValue, tone }: {
  icon: React.ElementType; label: string; value: string | number; sub?: string;
  trend?: "up" | "down" | "flat"; trendValue?: string; tone?: string;
}) {
  const tones: Record<string, string> = {
    blue: "bg-[#0052CC]/10 text-[#0052CC]",
    green: "bg-emerald-50 text-emerald-600",
    red: "bg-red-50 text-red-600",
    amber: "bg-amber-50 text-amber-600",
    purple: "bg-purple-50 text-purple-600",
    cyan: "bg-cyan-50 text-cyan-600",
  };
  return (
    <div className="rounded-xl border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div className={`grid size-10 place-items-center rounded-lg ${tones[tone ?? "blue"]}`}><Icon className="size-5" /></div>
        {trend && (
          <span className={`flex items-center gap-0.5 text-xs font-medium ${trend === "up" ? "text-emerald-600" : trend === "down" ? "text-red-600" : "text-gray-500"}`}>
            {trend === "up" ? <TrendingUp className="size-3.5" /> : trend === "down" ? <TrendingDown className="size-3.5" /> : <Minus className="size-3.5" />}
            {trendValue}
          </span>
        )}
      </div>
      <div className="mt-3 text-2xl font-bold text-[var(--text-primary,#172B4D)]">{value}</div>
      <div className="mt-0.5 text-sm text-[var(--text-secondary,#6B778C)]">{label}</div>
      {sub && <div className="mt-1 text-xs text-[var(--text-secondary,#6B778C)]">{sub}</div>}
    </div>
  );
}

/* ── Instrument Status Badge ──────────────────────────────────────────────── */
export function InstrumentStatusBadge({ status }: { status: InstrumentStatus }) {
  const tone = instrumentStatusTone(status);
  return <StatusPill label={status} tone={tone} />;
}

/* ── Tray Status Badge ────────────────────────────────────────────────────── */
export function TrayStatusBadge({ status }: { status: TrayStatus }) {
  const tone = trayStatusTone(status);
  return <StatusPill label={status} tone={tone} />;
}

/* ── Sterility Badge ──────────────────────────────────────────────────────── */
export function SterilityBadge({ status }: { status: SterilityStatus }) {
  const tone = sterilityTone(status);
  return <StatusPill label={status} tone={tone} />;
}

/* ── Cycle Status Badge ───────────────────────────────────────────────────── */
export function CycleStatusBadge({ status }: { status: CycleStatus }) {
  const tone = cycleStatusTone(status);
  return <StatusPill label={status} tone={tone} />;
}

/* ── Autoclave Status Badge ───────────────────────────────────────────────── */
export function AutoclaveStatusBadge({ status }: { status: AutoclaveStatus }) {
  const tone = autoclaveStatusTone(status);
  return <StatusPill label={status} tone={tone} />;
}

/* ── Issue Status Badge ───────────────────────────────────────────────────── */
export function IssueStatusBadge({ status }: { status: IssueStatus }) {
  const tone = issueStatusTone(status);
  return <StatusPill label={status} tone={tone} />;
}

/* ── Priority Badge ───────────────────────────────────────────────────────── */
export function PriorityBadge({ priority }: { priority: string }) {
  const tones: Record<string, string> = {
    Emergency: "bg-red-50 text-red-700 border-red-200",
    Urgent: "bg-amber-50 text-amber-700 border-amber-200",
    Routine: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${tones[priority] ?? "bg-gray-50 text-gray-600 border-gray-200"}`}>
      {priority === "Emergency" && <span className="size-1.5 rounded-full bg-red-500 animate-pulse" />}
      {priority}
    </span>
  );
}

/* ── Instrument Card ──────────────────────────────────────────────────────── */
export function InstrumentCard({ instrument, onClick }: {
  instrument: { id: string; name: string; category: string; status: InstrumentStatus; condition: string; currentLocation: string; lifecycleCount: number; maxCycles: number };
  onClick?: () => void;
}) {
  const bg: Record<string, string> = {
    Available: "border-emerald-200 bg-emerald-50/50",
    "In Use": "border-blue-200 bg-blue-50/50",
    "In Sterilization": "border-blue-200 bg-blue-50/50",
    "Under Maintenance": "border-amber-200 bg-amber-50/50",
    Quarantined: "border-red-200 bg-red-50/50",
    Retired: "border-gray-200 bg-gray-50/50",
    "Awaiting Repair": "border-amber-200 bg-amber-50/50",
  };
  const pct = Math.round((instrument.lifecycleCount / instrument.maxCycles) * 100);
  return (
    <button onClick={onClick} className={`rounded-xl border-2 p-4 text-left transition-all hover:shadow-md ${bg[instrument.status] ?? "border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)]"}`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="font-semibold text-[var(--text-primary,#172B4D)]">{instrument.name}</div>
          <div className="mt-0.5 text-xs text-[var(--text-secondary,#6B778C)]">{instrument.category}</div>
        </div>
        <InstrumentStatusBadge status={instrument.status} />
      </div>
      <div className="mt-3 flex items-center gap-4 text-xs text-[var(--text-secondary,#6B778C)]">
        <span>{instrument.currentLocation}</span>
        <span>{instrument.condition}</span>
      </div>
      <div className="mt-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[var(--text-secondary,#6B778C)]">Lifecycle</span>
          <span className="font-medium text-[var(--text-primary,#172B4D)]">{instrument.lifecycleCount}/{instrument.maxCycles} ({pct}%)</span>
        </div>
        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-gray-200">
          <div className={`h-full rounded-full ${pct >= 90 ? "bg-red-500" : pct >= 70 ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${pct}%` }} />
        </div>
      </div>
    </button>
  );
}

/* ── Tray Card ────────────────────────────────────────────────────────────── */
export function TrayCard({ tray, onClick }: {
  tray: { id: string; name: string; procedureType: string; instrumentCount: number; actualCount: number; status: TrayStatus; sterilityStatus: SterilityStatus; location: string; expiryDate?: string };
  onClick?: () => void;
}) {
  const bg: Record<string, string> = {
    Sterilized: "border-emerald-200 bg-emerald-50/50",
    Issued: "border-blue-200 bg-blue-50/50",
    Returned: "border-gray-200 bg-gray-50/50",
    Assembled: "border-amber-200 bg-amber-50/50",
    Packed: "border-amber-200 bg-amber-50/50",
    Failed: "border-red-200 bg-red-50/50",
    Quarantined: "border-red-200 bg-red-50/50",
    "Awaiting Assembly": "border-gray-200 bg-gray-50/50",
  };
  return (
    <button onClick={onClick} className={`rounded-xl border-2 p-4 text-left transition-all hover:shadow-md ${bg[tray.status] ?? "border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)]"}`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="font-semibold text-[var(--text-primary,#172B4D)]">{tray.name}</div>
          <div className="mt-0.5 text-xs text-[var(--text-secondary,#6B778C)]">{tray.procedureType}</div>
        </div>
        <TrayStatusBadge status={tray.status} />
      </div>
      <div className="mt-3 flex items-center gap-3 text-xs text-[var(--text-secondary,#6B778C)]">
        <span>{tray.instrumentCount} instruments</span>
        <span>{tray.location}</span>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <SterilityBadge status={tray.sterilityStatus} />
        {tray.expiryDate && <span className="text-xs text-[var(--text-secondary,#6B778C)]">Exp: {tray.expiryDate}</span>}
      </div>
    </button>
  );
}

/* ── Autoclave Widget ─────────────────────────────────────────────────────── */
export function AutoclaveWidget({ autoclave, onClick }: {
  autoclave: { id: string; name: string; status: AutoclaveStatus; temperature: number; pressure: number; cycleTimeRemaining: number; totalCycleTime: number; currentCycle?: string; error?: string };
  onClick?: () => void;
}) {
  const bg: Record<string, string> = {
    Running: "border-blue-200 bg-blue-50/50",
    Idle: "border-emerald-200 bg-emerald-50/50",
    Standby: "border-gray-200 bg-gray-50/50",
    Maintenance: "border-amber-200 bg-amber-50/50",
    Error: "border-red-200 bg-red-50/50",
  };
  const pct = autoclave.totalCycleTime > 0 ? Math.round(((autoclave.totalCycleTime - autoclave.cycleTimeRemaining) / autoclave.totalCycleTime) * 100) : 0;
  return (
    <button onClick={onClick} className={`rounded-xl border-2 p-4 text-left transition-all hover:shadow-md ${bg[autoclave.status] ?? "border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)]"}`}>
      <div className="flex items-start justify-between">
        <div className="font-semibold text-[var(--text-primary,#172B4D)]">{autoclave.name}</div>
        <AutoclaveStatusBadge status={autoclave.status} />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded bg-gray-100 px-2 py-1 text-center">
          <div className="text-[var(--text-secondary,#6B778C)]">Temp</div>
          <div className="font-bold text-[var(--text-primary,#172B4D)]">{autoclave.temperature}°C</div>
        </div>
        <div className="rounded bg-gray-100 px-2 py-1 text-center">
          <div className="text-[var(--text-secondary,#6B778C)]">Pressure</div>
          <div className="font-bold text-[var(--text-primary,#172B4D)]">{autoclave.pressure} bar</div>
        </div>
      </div>
      {autoclave.status === "Running" && (
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[var(--text-secondary,#6B778C)]">{autoclave.cycleTimeRemaining} min remaining</span>
            <span className="font-medium text-[var(--text-primary,#172B4D)]">{pct}%</span>
          </div>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-gray-200">
            <div className="h-full rounded-full bg-blue-500" style={{ width: `${pct}%` }} />
          </div>
        </div>
      )}
      {autoclave.currentCycle && <div className="mt-2 text-xs text-[var(--text-secondary,#6B778C)]">{autoclave.currentCycle}</div>}
      {autoclave.error && <div className="mt-2 text-xs font-medium text-red-600">{autoclave.error}</div>}
    </button>
  );
}

/* ── Lifecycle Bar ────────────────────────────────────────────────────────── */
export function LifecycleBar({ current, max }: { current: number; max: number }) {
  const pct = Math.round((current / max) * 100);
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-[var(--text-secondary,#6B778C)]">Lifecycle</span>
        <span className="font-medium text-[var(--text-primary,#172B4D)]">{current}/{max} ({pct}%)</span>
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-gray-200">
        <div className={`h-full rounded-full ${pct >= 90 ? "bg-red-500" : pct >= 70 ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
