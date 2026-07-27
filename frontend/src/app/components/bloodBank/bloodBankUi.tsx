/* ── Blood Bank — Reusable UI Components ───────────────────────────────────── */
import { type ReactNode } from "react";
import {
  TrendingUp, TrendingDown, Minus, ChevronRight, Droplets, Thermometer,
  Clock, AlertTriangle, CheckCircle2, Package, Heart, Shield, ThermometerSnowflake,
} from "lucide-react";
import type {
  BloodGroup, BloodUnitStatus, DonorStatus, ComponentType,
  CrossmatchResult, TransfusionStatus, ReactionSeverity, ColdChainStatus,
} from "./data";
import {
  bloodGroupTone, unitStatusTone, donorStatusTone, crossmatchTone,
  transfusionStatusTone, reactionSeverityTone, coldChainTone,
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
          {Icon && <div className="grid size-10 place-items-center rounded-xl bg-red-50 text-red-600"><Icon className="size-5" /></div>}
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

/* ── Blood Group Badge ────────────────────────────────────────────────────── */
export function BloodGroupBadge({ group, size = "md" }: { group: BloodGroup; size?: "sm" | "md" | "lg" }) {
  const tone = bloodGroupTone(group);
  const TONES: Record<string, string> = {
    success: "bg-emerald-100 text-emerald-800 border-emerald-300",
    warning: "bg-amber-100 text-amber-800 border-amber-300",
    danger: "bg-red-100 text-red-800 border-red-300",
    info: "bg-blue-100 text-blue-800 border-blue-300",
  };
  const sizes: Record<string, string> = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border font-bold ${TONES[tone]} ${sizes[size]}`}>
      <Droplets className="size-3" />
      {group}
    </span>
  );
}

/* ── Blood Unit Status Badge ──────────────────────────────────────────────── */
export function BloodUnitStatusBadge({ status }: { status: BloodUnitStatus }) {
  const tone = unitStatusTone(status);
  return <StatusPill label={status} tone={tone} />;
}

/* ── Donor Status Badge ───────────────────────────────────────────────────── */
export function DonorStatusBadge({ status }: { status: DonorStatus }) {
  const tone = donorStatusTone(status);
  return <StatusPill label={status} tone={tone} />;
}

/* ── Crossmatch Badge ─────────────────────────────────────────────────────── */
export function CrossmatchBadge({ result }: { result: CrossmatchResult }) {
  const tone = crossmatchTone(result);
  return <StatusPill label={result} tone={tone} />;
}

/* ── Transfusion Status Badge ─────────────────────────────────────────────── */
export function TransfusionStatusBadge({ status }: { status: TransfusionStatus }) {
  const tone = transfusionStatusTone(status);
  return <StatusPill label={status} tone={tone} />;
}

/* ── Cold Chain Widget ────────────────────────────────────────────────────── */
export function ColdChainWidget({ log }: {
  log: { location: string; temperature: number; minTemp: number; maxTemp: number; status: ColdChainStatus; alarmTriggered: boolean };
}) {
  const tone = coldChainTone(log.status);
  const bg: Record<string, string> = {
    success: "border-emerald-200 bg-emerald-50/50",
    warning: "border-amber-200 bg-amber-50/50",
    danger: "border-red-200 bg-red-50/50",
  };
  const text: Record<string, string> = {
    success: "text-emerald-700",
    warning: "text-amber-700",
    danger: "text-red-700",
  };
  return (
    <div className={`rounded-xl border-2 p-4 ${bg[tone] ?? "border-gray-200 bg-gray-50/50"}`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="font-semibold text-[var(--text-primary,#172B4D)]">{log.location}</div>
          <div className="text-xs text-[var(--text-secondary,#6B778C)]">Range: {log.minTemp}°C to {log.maxTemp}°C</div>
        </div>
        {log.alarmTriggered && <AlertTriangle className="size-5 text-red-500 animate-pulse" />}
      </div>
      <div className={`mt-3 text-3xl font-bold ${text[tone]}`}>{log.temperature}°C</div>
      <div className="mt-1">
        <StatusPill label={log.status} tone={tone} />
      </div>
    </div>
  );
}

/* ── Blood Unit Card ──────────────────────────────────────────────────────── */
export function BloodUnitCard({ unit, onClick }: {
  unit: { id: string; unitNumber: string; bloodGroup: BloodGroup; component: ComponentType; status: BloodUnitStatus; volume: number; expiryDate: string; storageLocation: string; temperature: number };
  onClick?: () => void;
}) {
  const bg: Record<string, string> = {
    Available: "border-emerald-200 bg-emerald-50/50",
    Reserved: "border-blue-200 bg-blue-50/50",
    Issued: "border-purple-200 bg-purple-50/50",
    Transfused: "border-gray-200 bg-gray-50/50",
    Expired: "border-red-200 bg-red-50/50",
    Discarded: "border-gray-200 bg-gray-100",
    Quarantined: "border-red-200 bg-red-50/50",
    "Under Testing": "border-amber-200 bg-amber-50/50",
    "In Processing": "border-amber-200 bg-amber-50/50",
  };
  const isCold = unit.temperature < 0;
  const isWarm = unit.temperature > 20;
  return (
    <button onClick={onClick} className={`rounded-xl border-2 p-4 text-left transition-all hover:shadow-md ${bg[unit.status] ?? "border-gray-200 bg-white"}`}>
      <div className="flex items-start justify-between">
        <BloodGroupBadge group={unit.bloodGroup} />
        <BloodUnitStatusBadge status={unit.status} />
      </div>
      <div className="mt-2 font-semibold text-[var(--text-primary,#172B4D)] text-sm">{unit.unitNumber}</div>
      <div className="mt-0.5 text-xs text-[var(--text-secondary,#6B778C)]">{unit.component} — {unit.volume}mL</div>
      <div className="mt-3 flex items-center gap-3 text-xs text-[var(--text-secondary,#6B778C)]">
        <span className="flex items-center gap-1">
          {isCold ? <ThermometerSnowflake className="size-3" /> : <Thermometer className="size-3" />}
          {unit.temperature}°C
        </span>
        <span className="flex items-center gap-1">
          <Clock className="size-3" />
          Exp: {unit.expiryDate}
        </span>
      </div>
      <div className="mt-1 text-xs text-[var(--text-secondary,#6B778C)]">{unit.storageLocation}</div>
    </button>
  );
}

/* ── Donor Card ───────────────────────────────────────────────────────────── */
export function DonorCard({ donor, onClick }: {
  donor: { id: string; name: string; age: number; gender: string; bloodGroup: BloodGroup; phone: string; totalDonations: number; status: string; hemoglobin: number; weight: number };
  onClick?: () => void;
}) {
  return (
    <button onClick={onClick} className="rounded-xl border-2 border-gray-200 bg-white p-4 text-left transition-all hover:shadow-md hover:border-red-200">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-semibold text-[var(--text-primary,#172B4D)]">{donor.name}</div>
          <div className="text-xs text-[var(--text-secondary,#6B778C)]">{donor.gender} · {donor.age} yrs · {donor.phone}</div>
        </div>
        <BloodGroupBadge group={donor.bloodGroup} size="sm" />
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="rounded bg-gray-50 p-1.5"><div className="text-[var(--text-secondary,#6B778C)]">Donations</div><div className="font-bold text-[var(--text-primary,#172B4D)]">{donor.totalDonations}</div></div>
        <div className="rounded bg-gray-50 p-1.5"><div className="text-[var(--text-secondary,#6B778C)]">Hb</div><div className="font-bold text-[var(--text-primary,#172B4D)]">{donor.hemoglobin}</div></div>
        <div className="rounded bg-gray-50 p-1.5"><div className="text-[var(--text-secondary,#6B778C)]">Weight</div><div className="font-bold text-[var(--text-primary,#172B4D)]">{donor.weight}kg</div></div>
      </div>
      <div className="mt-2"><DonorStatusBadge status={donor.status as DonorStatus} /></div>
    </button>
  );
}

/* ── Blood Request Card ───────────────────────────────────────────────────── */
export function BloodRequestCard({ request, onClick }: {
  request: { id: string; patientName: string; bloodGroup: BloodGroup; component: ComponentType; units: number; urgency: string; department: string; approvalStatus: string };
  onClick?: () => void;
}) {
  const urgencyBg: Record<string, string> = {
    Emergency: "border-red-200 bg-red-50/50",
    Urgent: "border-amber-200 bg-amber-50/50",
    Routine: "border-gray-200 bg-gray-50/50",
  };
  return (
    <button onClick={onClick} className={`rounded-xl border-2 p-4 text-left transition-all hover:shadow-md ${urgencyBg[request.urgency] ?? "border-gray-200 bg-white"}`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="font-semibold text-[var(--text-primary,#172B4D)]">{request.patientName}</div>
          <div className="text-xs text-[var(--text-secondary,#6B778C)]">{request.department} · {request.id}</div>
        </div>
        <StatusPill label={request.urgency} tone={request.urgency === "Emergency" ? "danger" : request.urgency === "Urgent" ? "warning" : "info"} />
      </div>
      <div className="mt-3 flex items-center gap-3">
        <BloodGroupBadge group={request.bloodGroup} size="sm" />
        <span className="text-xs text-[var(--text-secondary,#6B778C)]">{request.component} × {request.units}</span>
      </div>
      <div className="mt-2"><StatusPill label={request.approvalStatus} tone={request.approvalStatus === "Approved" ? "success" : request.approvalStatus === "Rejected" ? "danger" : "warning"} /></div>
    </button>
  );
}

/* ── Temperature Widget ───────────────────────────────────────────────────── */
export function TemperatureWidget({ location, temperature, min, max, status }: {
  location: string; temperature: number; min: number; max: number; status: string;
}) {
  const pct = Math.min(100, Math.max(0, ((temperature - min) / (max - min)) * 100));
  const barColor = status === "Normal" ? "bg-emerald-500" : status === "Warning" ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="rounded-lg border border-[var(--border,#DFE1E6)] bg-white p-3">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-[var(--text-primary,#172B4D)]">{location}</span>
        <span className="font-bold text-[var(--text-primary,#172B4D)]">{temperature}°C</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200">
        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-[var(--text-secondary,#6B778C)]">
        <span>{min}°C</span><span>{max}°C</span>
      </div>
    </div>
  );
}

/* ── Expiry Warning Badge ─────────────────────────────────────────────────── */
export function ExpiryBadge({ expiryDate }: { expiryDate: string }) {
  const now = new Date();
  const exp = new Date(expiryDate);
  const daysLeft = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (daysLeft <= 0) return <StatusPill label="Expired" tone="danger" />;
  if (daysLeft <= 3) return <StatusPill label={`${daysLeft}d left`} tone="danger" />;
  if (daysLeft <= 7) return <StatusPill label={`${daysLeft}d left`} tone="warning" />;
  return <StatusPill label={`${daysLeft}d left`} tone="success" />;
}
