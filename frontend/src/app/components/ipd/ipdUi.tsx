import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import type { BedStatus, AdmissionStatus, TransferStatus, CleaningStatus, IsolationType } from "./data";
import { bedStatusTone, admissionStatusTone, transferStatusTone, cleaningStatusTone } from "./data";

/* ---- Bed status badge --------------------------------------------- */
export function BedStatusBadge({ status, children }: { status: BedStatus; children: ReactNode }) {
  const tone = bedStatusTone(status);
  const TONES: Record<string, string> = {
    brand: "bg-secondary text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-[#b45309]",
    danger: "bg-danger/10 text-danger",
    info: "bg-info/10 text-[#0369a1]",
    neutral: "bg-muted text-text-secondary",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${TONES[tone]}`}>
      {children}
    </span>
  );
}

/* ---- Admission status badge --------------------------------------- */
export function AdmissionStatusBadge({ status }: { status: AdmissionStatus }) {
  const tone = admissionStatusTone(status);
  const TONES: Record<string, string> = {
    brand: "bg-secondary text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-[#b45309]",
    danger: "bg-danger/10 text-danger",
    info: "bg-info/10 text-[#0369a1]",
    neutral: "bg-muted text-text-secondary",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${TONES[tone]}`}>
      {status}
    </span>
  );
}

/* ---- Transfer status badge ---------------------------------------- */
export function TransferStatusBadge({ status }: { status: TransferStatus }) {
  const tone = transferStatusTone(status);
  const TONES: Record<string, string> = {
    brand: "bg-secondary text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-[#b45309]",
    info: "bg-info/10 text-[#0369a1]",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${TONES[tone]}`}>
      {status}
    </span>
  );
}

/* ---- Cleaning status badge ---------------------------------------- */
export function CleaningStatusBadge({ status }: { status: CleaningStatus }) {
  const tone = cleaningStatusTone(status);
  const TONES: Record<string, string> = {
    brand: "bg-secondary text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-[#b45309]",
    info: "bg-info/10 text-[#0369a1]",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${TONES[tone]}`}>
      {status}
    </span>
  );
}

/* ---- Isolation badge ---------------------------------------------- */
export function IsolationBadge({ type }: { type: IsolationType }) {
  const colors: Record<string, string> = {
    Contact: "bg-info/10 text-[#0369a1]",
    Droplet: "bg-warning/10 text-[#b45309]",
    Airborne: "bg-danger/10 text-danger",
    "Negative Pressure": "bg-danger/10 text-danger",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${colors[type]}`}>
      {type === "Airborne" || type === "Negative Pressure" ? <span className="size-1.5 rounded-full bg-danger animate-pulse" /> : null}
      {type} Isolation
    </span>
  );
}

/* ---- IPD stat card ------------------------------------------------- */
export function IpdStatCard({ icon: Icon, label, value, hint, trend, tone = "brand" }: {
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
export function IpdSection({ title, action, children, className = "" }: {
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
export function IpdPageHeader({ title, subtitle, actions }: {
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

/* ---- Ward card ----------------------------------------------------- */
export function WardCard({ ward, onClick }: { ward: { name: string; type: string; totalBeds: number; occupiedBeds: number; availableBeds: number; cleaningBeds: number; headNurse: string }; onClick?: () => void }) {
  const pct = Math.round((ward.occupiedBeds / ward.totalBeds) * 100);
  const barColor = pct >= 90 ? "bg-danger" : pct >= 75 ? "bg-warning" : "bg-success";
  return (
    <button onClick={onClick} className="rounded-xl border border-border bg-surface p-5 text-left transition-colors hover:border-primary">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold text-text-primary">{ward.name}</div>
          <div className="text-xs text-text-secondary">{ward.type} · {ward.headNurse}</div>
        </div>
        <span className={`text-lg font-bold ${pct >= 90 ? "text-danger" : pct >= 75 ? "text-[#b45309]" : "text-success"}`}>{pct}%</span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-2 flex justify-between text-xs text-text-secondary">
        <span>{ward.occupiedBeds} occupied</span>
        <span>{ward.availableBeds} available</span>
        <span>{ward.cleaningBeds} cleaning</span>
      </div>
    </button>
  );
}

/* ---- Bed cell for floor map ---------------------------------------- */
export function BedCell({ bed }: { bed: { number: string; status: string; patientName?: string } }) {
  const bg: Record<string, string> = {
    Available: "bg-success/10 border-success/30 text-success",
    Occupied: "bg-danger/10 border-danger/30 text-danger",
    Reserved: "bg-info/10 border-info/30 text-[#0369a1]",
    Cleaning: "bg-warning/10 border-warning/30 text-[#b45309]",
    Maintenance: "bg-muted border-border text-text-secondary",
    Blocked: "bg-danger/10 border-danger/30 text-danger",
  };
  return (
    <div className={`rounded-lg border p-2 text-center text-xs ${bg[bed.status] || "bg-muted border-border"}`}>
      <div className="font-semibold">{bed.number}</div>
      <div className="mt-0.5 truncate text-[10px]">{bed.status}</div>
      {bed.patientName && <div className="mt-0.5 truncate text-[10px] font-medium">{bed.patientName.split(" ")[0]}</div>}
    </div>
  );
}
