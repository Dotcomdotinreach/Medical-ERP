/* ── HRMS — Reusable UI Components ────────────────────────────────────────── */
import { type ReactNode } from "react";
import {
  ChevronRight, TrendingUp, TrendingDown, Minus, Search, Filter,
  Download, RefreshCw, MoreHorizontal, ExternalLink, CheckCircle2,
  AlertTriangle, AlertCircle, Info, Clock, Users, Bed, Activity,
  Shield, Calendar, Award, FileText, Edit3, Eye, Phone, Mail,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

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
      <div className="mt-3">
        <p className="text-2xl font-bold text-[var(--text-primary,#172B4D)]">{value}</p>
        <p className="text-sm text-[var(--text-secondary,#6B778C)]">{label}</p>
      </div>
      {sub && <p className="mt-1 text-xs text-[var(--text-secondary,#6B778C)]">{sub}</p>}
    </div>
  );
}

/* ── Health Bar ───────────────────────────────────────────────────────────── */
export function HealthBar({ value, max, label, showValue = true }: { value: number; max: number; label?: string; showValue?: boolean }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const color = pct > 80 ? "bg-emerald-500" : pct > 50 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="space-y-1">
      {(label || showValue) && (
        <div className="flex items-center justify-between text-xs text-[var(--text-secondary,#6B778C)]">
          {label && <span>{label}</span>}
          {showValue && <span className="font-medium text-[var(--text-primary,#172B4D)]">{pct}%</span>}
        </div>
      )}
      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/* ── Employee Card ────────────────────────────────────────────────────────── */
export function EmployeeCard({ employee, onClick }: { employee: { id: string; name: string; employeeId: string; department: string; designation: string; status: string; avatar: string; profileColor: string; phone: string; email: string; location: string; }; onClick?: () => void }) {
  const statusTone = employee.status === "Active" ? "success" : employee.status === "On Notice" ? "warning" : employee.status === "Probation" ? "info" : employee.status === "On Leave" ? "info" : "danger";
  return (
    <button onClick={onClick} className="w-full rounded-xl border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] p-4 text-left shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center gap-3">
        <div className="grid size-12 place-items-center rounded-xl text-sm font-bold text-white" style={{ backgroundColor: employee.profileColor }}>{employee.avatar}</div>
        <div className="min-w-0 flex-1">
          <div className="truncate font-semibold text-[var(--text-primary,#172B4D)]">{employee.name}</div>
          <div className="text-xs text-[var(--text-secondary,#6B778C)]">{employee.designation} · {employee.department}</div>
          <div className="flex items-center gap-2 mt-1">
            <StatusPill label={employee.status} tone={statusTone} />
            <span className="text-[10px] text-[var(--text-secondary,#6B778C)]">{employee.employeeId}</span>
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-4 text-xs text-[var(--text-secondary,#6B778C)]">
        <span className="flex items-center gap-1"><Phone className="size-3" />{employee.phone}</span>
        <span className="flex items-center gap-1"><Mail className="size-3" />{employee.email.split("@")[0]}</span>
      </div>
    </button>
  );
}

/* ── Credential Card ──────────────────────────────────────────────────────── */
export function CredentialCard({ credential }: { credential: { id: string; employeeName: string; type: string; name: string; number: string; issuedBy: string; issuedDate: string; expiryDate: string; status: string; daysToExpiry: number; }; }) {
  const statusTone = credential.status === "Valid" ? "success" : credential.status === "Expiring Soon" ? "warning" : credential.status === "Expired" ? "danger" : "info";
  return (
    <div className="rounded-xl border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-medium text-[var(--text-primary,#172B4D)]">{credential.name}</div>
          <div className="text-xs text-[var(--text-secondary,#6B778C)]">{credential.employeeName} · {credential.type}</div>
        </div>
        <StatusPill label={credential.status} tone={statusTone} />
      </div>
      <div className="mt-3 rounded-lg bg-gray-50 px-3 py-2 font-mono text-xs text-[var(--text-secondary,#6B778C)]">{credential.number}</div>
      <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
        <div><span className="text-[var(--text-secondary,#6B778C)]">Issued</span><div className="font-medium text-[var(--text-primary,#172B4D)]">{credential.issuedDate}</div></div>
        <div><span className="text-[var(--text-secondary,#6B778C)]">Expires</span><div className={`font-medium ${credential.daysToExpiry < 0 ? "text-red-600" : credential.daysToExpiry < 90 ? "text-amber-600" : "text-[var(--text-primary,#172B4D)]"}`}>{credential.expiryDate}</div></div>
      </div>
      {credential.daysToExpiry < 0 && <p className="mt-2 text-xs font-medium text-red-600">Expired {Math.abs(credential.daysToExpiry)} days ago</p>}
      {credential.daysToExpiry > 0 && credential.daysToExpiry < 90 && <p className="mt-2 text-xs font-medium text-amber-600">Expires in {credential.daysToExpiry} days</p>}
    </div>
  );
}

/* ── Training Card ────────────────────────────────────────────────────────── */
export function TrainingCard({ training }: { training: { id: string; title: string; type: string; category: string; instructor: string; startDate: string; duration: string; credits?: number; enrolled: number; capacity: number; status: string; mandatory: boolean; }; }) {
  const statusTone = training.status === "Completed" ? "success" : training.status === "Enrolled" || training.status === "In Progress" ? "info" : training.status === "Overdue" ? "danger" : "warning";
  return (
    <div className="rounded-xl border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-[var(--text-primary,#172B4D)]">{training.title}</span>
            {training.mandatory && <span className="rounded bg-red-50 px-1.5 py-0.5 text-[10px] font-medium text-red-600">Mandatory</span>}
          </div>
          <div className="text-xs text-[var(--text-secondary,#6B778C)]">{training.instructor} · {training.category}</div>
        </div>
        <StatusPill label={training.status} tone={statusTone} />
      </div>
      <div className="mt-3 grid grid-cols-3 gap-3 text-xs">
        <div><span className="text-[var(--text-secondary,#6B778C)]">Start</span><div className="font-medium text-[var(--text-primary,#172B4D)]">{training.startDate}</div></div>
        <div><span className="text-[var(--text-secondary,#6B778C)]">Duration</span><div className="font-medium text-[var(--text-primary,#172B4D)]">{training.duration}</div></div>
        <div><span className="text-[var(--text-secondary,#6B778C)]">Credits</span><div className="font-medium text-[var(--text-primary,#172B4D)]">{training.credits ?? "—"}</div></div>
      </div>
      <div className="mt-3">
        <HealthBar value={training.enrolled} max={training.capacity} label={`${training.enrolled}/${training.capacity} enrolled`} />
      </div>
    </div>
  );
}

/* ── Performance Card ─────────────────────────────────────────────────────── */
export function PerformanceCard({ record }: { record: { id: string; employeeName: string; department: string; designation: string; reviewPeriod: string; overallRating: string; kpiScore: number; goalScore: number; feedbackScore: number; status: string; promotionRecommended: boolean; }; }) {
  const ratingTone = record.overallRating === "Exceptional" || record.overallRating === "Exceeds" ? "success" : record.overallRating === "Meets" ? "info" : record.overallRating === "Needs Improvement" ? "warning" : "danger";
  return (
    <div className="rounded-xl border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-medium text-[var(--text-primary,#172B4D)]">{record.employeeName}</div>
          <div className="text-xs text-[var(--text-secondary,#6B778C)]">{record.designation} · {record.department}</div>
        </div>
        <div className="flex gap-1.5">
          <StatusPill label={record.overallRating} tone={ratingTone} />
          {record.promotionRecommended && <span className="rounded bg-purple-50 px-1.5 py-0.5 text-[10px] font-medium text-purple-600">Promotion</span>}
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg bg-gray-50 p-2">
          <div className="text-lg font-bold text-[var(--text-primary,#172B4D)]">{record.kpiScore}</div>
          <div className="text-[10px] text-[var(--text-secondary,#6B778C)]">KPI</div>
        </div>
        <div className="rounded-lg bg-gray-50 p-2">
          <div className="text-lg font-bold text-[var(--text-primary,#172B4D)]">{record.goalScore}</div>
          <div className="text-[10px] text-[var(--text-secondary,#6B778C)]">Goals</div>
        </div>
        <div className="rounded-lg bg-gray-50 p-2">
          <div className="text-lg font-bold text-[var(--text-primary,#172B4D)]">{record.feedbackScore}</div>
          <div className="text-[10px] text-[var(--text-secondary,#6B778C)]">Feedback</div>
        </div>
      </div>
      <div className="mt-3 text-xs text-[var(--text-secondary,#6B778C)]">Review: {record.reviewPeriod} · Status: {record.status}</div>
    </div>
  );
}

/* ── Incident Card ────────────────────────────────────────────────────────── */
export function IncidentCard({ incident }: { incident: { id: string; type: string; severity: string; date: string; time: string; location: string; department: string; reportedBy: string; description: string; injured?: string; status: string; correctiveActions?: string[]; }; }) {
  const severityTone = incident.severity === "Critical" ? "danger" : incident.severity === "Major" ? "danger" : incident.severity === "Minor" ? "warning" : "info";
  const statusTone = incident.status === "Closed" || incident.status === "Resolved" ? "success" : incident.status === "Investigating" ? "warning" : "danger";
  return (
    <div className="rounded-xl border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-[var(--text-primary,#172B4D)]">{incident.id}</span>
            <StatusPill label={incident.severity} tone={severityTone} />
            <StatusPill label={incident.status} tone={statusTone} />
          </div>
          <div className="text-xs text-[var(--text-secondary,#6B778C)]">{incident.type} · {incident.department} · {incident.location}</div>
        </div>
        <span className="text-xs text-[var(--text-secondary,#6B778C)]">{incident.date} {incident.time}</span>
      </div>
      <p className="mt-2 text-sm text-[var(--text-primary,#172B4D)]">{incident.description}</p>
      {incident.injured && <p className="mt-1 text-xs text-[var(--text-secondary,#6B778C)]">Injured: {incident.injured}</p>}
      {incident.correctiveActions && incident.correctiveActions.length > 0 && (
        <div className="mt-3">
          <div className="text-xs font-medium text-[var(--text-secondary,#6B778C)] mb-1">Corrective Actions:</div>
          <div className="flex flex-wrap gap-1">
            {incident.correctiveActions.map((a, i) => <span key={i} className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-[var(--text-secondary,#6B778C)]">{a}</span>)}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Leave Card ───────────────────────────────────────────────────────────── */
export function LeaveCard({ leave }: { leave: { id: string; employeeName: string; department: string; type: string; fromDate: string; toDate: string; days: number; reason: string; status: string; appliedDate: string; approvedBy?: string; comments?: string; }; }) {
  const statusTone = leave.status === "Approved" ? "success" : leave.status === "Pending" ? "warning" : leave.status === "Rejected" ? "danger" : "info";
  return (
    <div className="rounded-xl border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-medium text-[var(--text-primary,#172B4D)]">{leave.employeeName}</div>
          <div className="text-xs text-[var(--text-secondary,#6B778C)]">{leave.department} · {leave.type} · {leave.days} day{leave.days > 1 ? "s" : ""}</div>
        </div>
        <StatusPill label={leave.status} tone={statusTone} />
      </div>
      <div className="mt-3 flex items-center gap-2 text-sm">
        <span className="rounded-lg bg-gray-50 px-2 py-1 text-[var(--text-primary,#172B4D)]">{leave.fromDate}</span>
        <ChevronRight className="size-3 text-[var(--text-secondary,#6B778C)]" />
        <span className="rounded-lg bg-gray-50 px-2 py-1 text-[var(--text-primary,#172B4D)]">{leave.toDate}</span>
      </div>
      <p className="mt-2 text-xs text-[var(--text-secondary,#6B778C)]">{leave.reason}</p>
      {leave.approvedBy && <p className="mt-1 text-[10px] text-[var(--text-secondary,#6B778C)]">Approved by: {leave.approvedBy}</p>}
    </div>
  );
}

/* ── Shift Badge ──────────────────────────────────────────────────────────── */
export function ShiftBadge({ shift, color }: { shift: string; color?: string }) {
  const colors: Record<string, string> = {
    Morning: "bg-amber-50 text-amber-700 border-amber-200",
    Evening: "bg-orange-50 text-orange-700 border-orange-200",
    Night: "bg-purple-50 text-purple-700 border-purple-200",
    "On-Call": "bg-red-50 text-red-700 border-red-200",
    Flexible: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${colors[shift] ?? "bg-gray-50 text-gray-600 border-gray-200"}`}>
      {shift}
    </span>
  );
}
