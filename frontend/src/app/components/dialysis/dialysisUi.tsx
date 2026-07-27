/* ── Dialysis — Reusable UI Components ─────────────────────────────────────── */
import { type ReactNode } from "react";
import {
  TrendingUp, TrendingDown, Minus, ChevronRight, Activity, AlertTriangle,
  CheckCircle2, Clock, Heart, Thermometer, Droplets,
} from "lucide-react";
import type {
  MachineStatus, ChairStatus, TreatmentStatus, AccessStatus,
  AppointmentStatus, EnrollmentStatus, MaintenanceStatus, WaterQualityStatus,
} from "./data";
import {
  machineStatusTone, chairStatusTone, treatmentStatusTone, accessStatusTone,
  appointmentStatusTone, enrollmentStatusTone, maintenanceStatusTone,
  waterQualityTone,
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
          {Icon && <div className="grid size-10 place-items-center rounded-xl bg-blue-50 text-blue-600"><Icon className="size-5" /></div>}
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

/* ── Machine Status Badge ─────────────────────────────────────────────────── */
export function MachineStatusBadge({ status }: { status: MachineStatus }) {
  const tone = machineStatusTone(status);
  return <StatusPill label={status} tone={tone} />;
}

/* ── Chair Status Badge ───────────────────────────────────────────────────── */
export function ChairStatusBadge({ status }: { status: ChairStatus }) {
  const tone = chairStatusTone(status);
  return <StatusPill label={status} tone={tone} />;
}

/* ── Treatment Status Badge ───────────────────────────────────────────────── */
export function TreatmentStatusBadge({ status }: { status: TreatmentStatus }) {
  const tone = treatmentStatusTone(status);
  return <StatusPill label={status} tone={tone} />;
}

/* ── Access Status Badge ──────────────────────────────────────────────────── */
export function AccessStatusBadge({ status }: { status: AccessStatus }) {
  const tone = accessStatusTone(status);
  return <StatusPill label={status} tone={tone} />;
}

/* ── Appointment Status Badge ─────────────────────────────────────────────── */
export function AppointmentStatusBadge({ status }: { status: AppointmentStatus }) {
  const tone = appointmentStatusTone(status);
  return <StatusPill label={status} tone={tone} />;
}

/* ── Enrollment Status Badge ──────────────────────────────────────────────── */
export function EnrollmentStatusBadge({ status }: { status: EnrollmentStatus }) {
  const tone = enrollmentStatusTone(status);
  return <StatusPill label={status} tone={tone} />;
}

/* ── Machine Card ─────────────────────────────────────────────────────────── */
export function MachineCard({ machine, onClick }: {
  machine: { id: string; name: string; status: MachineStatus; currentPatient?: string; chairId: string; totalHours: number; sessionsCompleted: number; disinfectionStatus: string; error?: string };
  onClick?: () => void;
}) {
  const bg: Record<string, string> = {
    Available: "border-emerald-200 bg-emerald-50/50",
    "In Use": "border-blue-200 bg-blue-50/50",
    Maintenance: "border-amber-200 bg-amber-50/50",
    "Out of Service": "border-red-200 bg-red-50/50",
    Cleaning: "border-amber-200 bg-amber-50/50",
  };
  return (
    <button onClick={onClick} className={`rounded-xl border-2 p-4 text-left transition-all hover:shadow-md ${bg[machine.status] ?? "border-gray-200 bg-white"}`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="font-semibold text-[var(--text-primary,#172B4D)]">{machine.name}</div>
          <div className="text-xs text-[var(--text-secondary,#6B778C)]">{machine.id} · {machine.chairId}</div>
        </div>
        <MachineStatusBadge status={machine.status} />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-center text-xs">
        <div className="rounded bg-gray-100 px-2 py-1"><div className="text-[var(--text-secondary,#6B778C)]">Hours</div><div className="font-bold text-[var(--text-primary,#172B4D)]">{machine.totalHours.toLocaleString()}</div></div>
        <div className="rounded bg-gray-100 px-2 py-1"><div className="text-[var(--text-secondary,#6B778C)]">Sessions</div><div className="font-bold text-[var(--text-primary,#172B4D)]">{machine.sessionsCompleted}</div></div>
      </div>
      {machine.currentPatient && <div className="mt-2 text-xs text-blue-600">Patient: {machine.currentPatient}</div>}
      <div className="mt-2 text-xs text-[var(--text-secondary,#6B778C)]">Disinfection: {machine.disinfectionStatus}</div>
      {machine.error && <div className="mt-1 text-xs font-medium text-red-600">{machine.error}</div>}
    </button>
  );
}

/* ── Patient Card ─────────────────────────────────────────────────────────── */
export function PatientCard({ patient, onClick }: {
  patient: { id: string; name: string; age: number; gender: string; diagnosis: string; dialysisType: string; accessType: string; totalSessions: number; missedSessions: number; lastSessionDate?: string; status: string };
  onClick?: () => void;
}) {
  return (
    <button onClick={onClick} className="rounded-xl border-2 border-gray-200 bg-white p-4 text-left transition-all hover:shadow-md hover:border-blue-200">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-semibold text-[var(--text-primary,#172B4D)]">{patient.name}</div>
          <div className="text-xs text-[var(--text-secondary,#6B778C)]">{patient.gender} · {patient.age} yrs · {patient.id}</div>
        </div>
        <EnrollmentStatusBadge status={patient.status as EnrollmentStatus} />
      </div>
      <div className="mt-2 text-xs text-[var(--text-secondary,#6B778C)]">{patient.diagnosis}</div>
      <div className="mt-3 flex items-center gap-3 text-xs text-[var(--text-secondary,#6B778C)]">
        <span>{patient.dialysisType}</span>
        <span>{patient.accessType}</span>
      </div>
      <div className="mt-2 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="rounded bg-gray-50 p-1.5"><div className="text-[var(--text-secondary,#6B778C)]">Sessions</div><div className="font-bold text-[var(--text-primary,#172B4D)]">{patient.totalSessions}</div></div>
        <div className="rounded bg-gray-50 p-1.5"><div className="text-[var(--text-secondary,#6B778C)]">Missed</div><div className="font-bold text-[var(--text-primary,#172B4D)]">{patient.missedSessions}</div></div>
        <div className="rounded bg-gray-50 p-1.5"><div className="text-[var(--text-secondary,#6B778C)]">Last</div><div className="font-bold text-[var(--text-primary,#172B4D)]">{patient.lastSessionDate?.slice(5) ?? "—"}</div></div>
      </div>
    </button>
  );
}

/* ── Vitals Widget ────────────────────────────────────────────────────────── */
export function VitalsWidget({ vitals }: {
  vitals: { bp: string; hr: number; temp: number; rr: number; weight?: number };
}) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
      <div className="rounded-lg bg-gray-50 p-2 text-center"><div className="text-[10px] text-[var(--text-secondary,#6B778C)]">BP</div><div className="text-sm font-bold text-[var(--text-primary,#172B4D)]">{vitals.bp}</div></div>
      <div className="rounded-lg bg-gray-50 p-2 text-center"><div className="text-[10px] text-[var(--text-secondary,#6B778C)]">HR</div><div className="text-sm font-bold text-[var(--text-primary,#172B4D)]">{vitals.hr}</div></div>
      <div className="rounded-lg bg-gray-50 p-2 text-center"><div className="text-[10px] text-[var(--text-secondary,#6B778C)]">Temp</div><div className="text-sm font-bold text-[var(--text-primary,#172B4D)]">{vitals.temp}°</div></div>
      <div className="rounded-lg bg-gray-50 p-2 text-center"><div className="text-[10px] text-[var(--text-secondary,#6B778C)]">RR</div><div className="text-sm font-bold text-[var(--text-primary,#172B4D)]">{vitals.rr}</div></div>
      {vitals.weight !== undefined && <div className="rounded-lg bg-gray-50 p-2 text-center"><div className="text-[10px] text-[var(--text-secondary,#6B778C)]">Weight</div><div className="text-sm font-bold text-[var(--text-primary,#172B4D)]">{vitals.weight}kg</div></div>}
    </div>
  );
}

/* ── Treatment Timeline ───────────────────────────────────────────────────── */
export function TreatmentTimeline({ steps }: { steps: { label: string; time: string; status: "completed" | "active" | "pending" }[] }) {
  return (
    <div className="flex items-center gap-0 overflow-x-auto pb-2">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className={`size-3 rounded-full ${step.status === "completed" ? "bg-emerald-500" : step.status === "active" ? "bg-blue-500 animate-pulse" : "bg-gray-300"}`} />
            <div className="mt-1 text-center">
              <div className={`text-[10px] font-medium ${step.status === "pending" ? "text-gray-400" : "text-[var(--text-primary,#172B4D)]"}`}>{step.label}</div>
              <div className="text-[9px] text-[var(--text-secondary,#6B778C)]">{step.time}</div>
            </div>
          </div>
          {i < steps.length - 1 && <div className={`mx-1 h-0.5 w-8 ${step.status === "completed" ? "bg-emerald-500" : "bg-gray-200"}`} />}
        </div>
      ))}
    </div>
  );
}

/* ── Lab Result Card ──────────────────────────────────────────────────────── */
export function LabResultCard({ label, value, unit, normal, critical }: {
  label: string; value: number | string; unit: string; normal: string; critical?: boolean;
}) {
  return (
    <div className={`rounded-lg border p-2.5 text-center ${critical ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"}`}>
      <div className="text-[10px] text-[var(--text-secondary,#6B778C)]">{label}</div>
      <div className={`text-lg font-bold ${critical ? "text-red-600" : "text-[var(--text-primary,#172B4D)]"}`}>{value}<span className="text-xs font-normal">{unit}</span></div>
      <div className="text-[9px] text-[var(--text-secondary,#6B778C)]">{normal}</div>
    </div>
  );
}

/* ── Adequacy Gauge ───────────────────────────────────────────────────────── */
export function AdequacyGauge({ ktV, urr }: { ktV?: number; urr?: number }) {
  const ktVPct = ktV !== undefined ? Math.min(100, (ktV / 1.5) * 100) : 0;
  const urrPct = urr !== undefined ? Math.min(100, (urr / 70) * 100) : 0;
  return (
    <div className="space-y-3">
      {ktV !== undefined && (
        <div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[var(--text-secondary,#6B778C)]">Kt/V</span>
            <span className={`font-bold ${ktV >= 1.4 ? "text-emerald-600" : ktV >= 1.2 ? "text-amber-600" : "text-red-600"}`}>{ktV}</span>
          </div>
          <div className="mt-1 h-2 overflow-hidden rounded-full bg-gray-200">
            <div className={`h-full rounded-full ${ktV >= 1.4 ? "bg-emerald-500" : ktV >= 1.2 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${ktVPct}%` }} />
          </div>
          <div className="mt-0.5 text-[10px] text-[var(--text-secondary,#6B778C)]">Target: ≥1.4</div>
        </div>
      )}
      {urr !== undefined && (
        <div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[var(--text-secondary,#6B778C)]">URR</span>
            <span className={`font-bold ${urr >= 65 ? "text-emerald-600" : urr >= 55 ? "text-amber-600" : "text-red-600"}`}>{urr}%</span>
          </div>
          <div className="mt-1 h-2 overflow-hidden rounded-full bg-gray-200">
            <div className={`h-full rounded-full ${urr >= 65 ? "bg-emerald-500" : urr >= 55 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${urrPct}%` }} />
          </div>
          <div className="mt-0.5 text-[10px] text-[var(--text-secondary,#6B778C)]">Target: ≥65%</div>
        </div>
      )}
    </div>
  );
}
