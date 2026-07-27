import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown } from "lucide-react";
import type { AlertSeverity, ComplianceStatus, IncidentSeverity } from "./data";
import { alertSeverityTone, complianceTone, incidentSeverityTone } from "./data";

type Tone = "brand" | "success" | "warning" | "danger" | "info" | "neutral";

/* ---- Badge ----------------------------------------------------------- */
const BADGE_TONES: Record<Tone, string> = {
  brand: "bg-[#0052CC]/10 text-[#0052CC]",
  success: "bg-[#059669]/10 text-[#059669]",
  warning: "bg-[#d97706]/10 text-[#b45309]",
  danger: "bg-[#DC2626]/10 text-[#DC2626]",
  info: "bg-[#0369a1]/10 text-[#0369a1]",
  neutral: "bg-[#6B7280]/10 text-[#6B7280]",
};
export function Badge({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${BADGE_TONES[tone]}`}>
      {children}
    </span>
  );
}

export function AlertSeverityBadge({ severity }: { severity: AlertSeverity }) {
  return <Badge tone={alertSeverityTone(severity)}>{severity}</Badge>;
}
export function IncidentSeverityBadge({ severity }: { severity: IncidentSeverity }) {
  return <Badge tone={incidentSeverityTone(severity)}>{severity}</Badge>;
}
export function ComplianceBadge({ status }: { status: ComplianceStatus }) {
  return <Badge tone={complianceTone(status)}>{status}</Badge>;
}

/* ---- Executive KPI card ---------------------------------------------- */
export function ExecutiveKPICard({ icon: Icon, label, value, target, trend, tone = "brand", suffix, drillDown }: {
  icon: LucideIcon; label: string; value: string | number; target?: string | number;
  trend?: number; tone?: Tone; suffix?: string; drillDown?: () => void;
}) {
  const bg: Record<Tone, string> = {
    brand: "bg-[#0052CC]/10 text-[#0052CC]",
    success: "bg-[#059669]/10 text-[#059669]",
    warning: "bg-[#d97706]/10 text-[#b45309]",
    danger: "bg-[#DC2626]/10 text-[#DC2626]",
    info: "bg-[#0369a1]/10 text-[#0369a1]",
    neutral: "bg-[#6B7280]/10 text-[#6B7280]",
  };
  return (
    <div onClick={drillDown} className={`rounded-xl border border-[#E5E7EB] bg-white p-5 transition hover:shadow-md ${drillDown ? "cursor-pointer" : ""}`}>
      <div className="flex items-center justify-between">
        <div className={`grid size-10 place-items-center rounded-lg ${bg[tone]}`}><Icon className="size-5" /></div>
        {trend !== undefined && (
          <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${trend >= 0 ? "text-[#059669]" : "text-[#DC2626]"}`}>
            {trend >= 0 ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}{Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="mt-3 text-2xl font-bold text-[#111827]">{value}{suffix}</div>
      <div className="mt-0.5 text-sm text-[#6B7280]">{label}</div>
      {target && <div className="mt-1 text-xs text-[#9CA3AF]">Target: {target}</div>}
    </div>
  );
}

/* ---- Section card ---------------------------------------------------- */
export function Section({ title, action, children, className = "" }: {
  title?: string; action?: ReactNode; children: ReactNode; className?: string;
}) {
  return (
    <div className={`rounded-xl border border-[#E5E7EB] bg-white ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between border-b border-[#F3F4F6] px-5 py-4">
          {title && <h3 className="font-semibold text-[#111827]">{title}</h3>}
          {action}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}

/* ---- Page header ----------------------------------------------------- */
export function PageHeader({ title, subtitle, actions }: {
  title: string; subtitle?: string; actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-[#6B7280]">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}

/* ---- Progress bar ---------------------------------------------------- */
export function ProgressBar({ value, max = 100, color = "#0052CC", height = 8 }: {
  value: number; max?: number; color?: string; height?: number;
}) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="w-full overflow-hidden rounded-full bg-[#E5E7EB]" style={{ height }}>
      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
    </div>
  );
}

/* ---- Trend indicator ------------------------------------------------- */
export function TrendIndicator({ value, suffix = "%" }: { value: number; suffix?: string }) {
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${value >= 0 ? "text-[#059669]" : "text-[#DC2626]"}`}>
      {value >= 0 ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
      {Math.abs(value)}{suffix}
    </span>
  );
}

/* ---- Department status dot ------------------------------------------- */
export function DepartmentStatusDot({ status }: { status: "Normal" | "Busy" | "Critical" | "Overloaded" }) {
  const colors = { Normal: "bg-[#059669]", Busy: "bg-[#d97706]", Critical: "bg-[#DC2626]", Overloaded: "bg-[#DC2626] animate-pulse" };
  return <span className={`inline-block size-2.5 rounded-full ${colors[status]}`} />;
}

/* ---- Occupancy gauge ------------------------------------------------- */
export function OccupancyGauge({ value, label, size = 80 }: { value: number; label: string; size?: number }) {
  const color = value >= 95 ? "#DC2626" : value >= 85 ? "#d97706" : "#059669";
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#E5E7EB" strokeWidth="8" />
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={`${circumference - offset} ${circumference}`} transform={`rotate(-90 ${size/2} ${size/2})`} />
        <text x={size/2} y={size/2 - 2} textAnchor="middle" className="fill-[#111827]" fontSize="16" fontWeight="bold">{value}%</text>
        <text x={size/2} y={size/2 + 12} textAnchor="middle" className="fill-[#6B7280]" fontSize="9">{label}</text>
      </svg>
    </div>
  );
}

/* ---- Mini bar chart -------------------------------------------------- */
export function MiniBarChart({ data, height = 60, color = "#0052CC" }: {
  data: { label: string; value: number }[]; height?: number; color?: string;
}) {
  const max = Math.max(...data.map(d => d.value));
  return (
    <div className="flex items-end gap-1" style={{ height }}>
      {data.map((d, i) => (
        <div key={i} className="flex flex-1 flex-col items-center gap-1">
          <div className="w-full rounded-t" style={{ height: `${(d.value / max) * 100}%`, backgroundColor: color, minHeight: 2 }} />
          <span className="text-[9px] text-[#6B7280]">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ---- Alert banner ---------------------------------------------------- */
export function AlertBanner({ severity, title, message, onAction }: {
  severity: AlertSeverity; title: string; message: string; onAction?: () => void;
}) {
  const tones = {
    Critical: "border-[#DC2626] bg-[#DC2626]/5",
    High: "border-[#d97706] bg-[#d97706]/5",
    Medium: "border-[#0369a1] bg-[#0369a1]/5",
    Low: "border-[#E5E7EB] bg-[#F9FAFB]",
  };
  return (
    <div className={`rounded-lg border p-4 ${tones[severity]}`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <AlertSeverityBadge severity={severity} />
            <span className="text-sm font-semibold text-[#111827]">{title}</span>
          </div>
          <p className="mt-1 text-sm text-[#6B7280]">{message}</p>
        </div>
        {onAction && <button onClick={onAction} className="text-xs font-medium text-[#0052CC] hover:underline">Investigate</button>}
      </div>
    </div>
  );
}

/* ---- Filter bar ------------------------------------------------------ */
export function FilterBar({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-[#E5E7EB] bg-white px-4 py-3">
      {children}
    </div>
  );
}

/* ---- Stat row -------------------------------------------------------- */
export function StatRow({ label, value, trend, target }: {
  label: string; value: string | number; trend?: number; target?: string;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-[#6B7280]">{label}</span>
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-[#111827]">{value}</span>
        {trend !== undefined && <TrendIndicator value={trend} />}
        {target && <span className="text-xs text-[#9CA3AF]">/ {target}</span>}
      </div>
    </div>
  );
}
