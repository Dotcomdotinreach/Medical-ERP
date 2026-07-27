import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

/* ---- Status badge ------------------------------------------------- */
type Tone = "brand" | "success" | "warning" | "danger" | "info" | "neutral";
const TONES: Record<Tone, string> = {
  brand: "bg-secondary text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-[#b45309]",
  danger: "bg-danger/10 text-danger",
  info: "bg-info/10 text-[#0369a1]",
  neutral: "bg-muted text-text-secondary",
};
export function StatusBadge({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${TONES[tone]}`}>
      {children}
    </span>
  );
}

export function statusTone(s: string): Tone {
  switch (s) {
    case "OPD": return "info";
    case "IPD": return "brand";
    case "Emergency": return "danger";
    case "Discharged": return "neutral";
    case "Available": return "success";
    case "Occupied": return "danger";
    case "Cleaning": return "warning";
    case "Reserved": return "info";
    case "Waiting": return "warning";
    case "Called": return "info";
    case "In Consultation": return "brand";
    case "Completed": return "success";
    case "Skipped": return "neutral";
    default: return "neutral";
  }
}

/* ---- Stat card ---------------------------------------------------- */
export function StatCard({ icon: Icon, label, value, hint, trend, tone = "brand" }:
  { icon: LucideIcon; label: string; value: string | number; hint?: string; trend?: number; tone?: Tone }) {
  const toneBg: Record<Tone, string> = {
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

/* ---- Section card / page header ----------------------------------- */
export function SectionCard({ title, action, children, className = "" }:
  { title?: string; action?: ReactNode; children: ReactNode; className?: string }) {
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

export function PageHeader({ title, subtitle, actions }:
  { title: string; subtitle?: string; actions?: ReactNode }) {
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

export function Avatar({ name, tone = "brand", size = 40 }: { name: string; tone?: Tone; size?: number }) {
  const initials = name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  const bg: Record<Tone, string> = {
    brand: "bg-secondary text-primary", success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-[#b45309]", danger: "bg-danger/10 text-danger",
    info: "bg-info/10 text-[#0369a1]", neutral: "bg-muted text-text-secondary",
  };
  return (
    <div className={`grid shrink-0 place-items-center rounded-full font-semibold ${bg[tone]}`}
      style={{ width: size, height: size, fontSize: size * 0.36 }}>{initials}</div>
  );
}
