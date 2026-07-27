import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, ArrowDownRight, AlertTriangle } from "lucide-react";
import type { PrescriptionStatus, MedicationStatus, POStatus, InsuranceStatus } from "./data";
import { prescriptionStatusTone, stockStatusTone, poStatusTone, insuranceStatusTone } from "./data";

/* ---- Prescription status badge ------------------------------------ */
export function RxStatusBadge({ status, children }: { status: PrescriptionStatus; children: ReactNode }) {
  const tone = prescriptionStatusTone(status);
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

/* ---- Stock status badge ------------------------------------------- */
export function StockStatusBadge({ status }: { status: MedicationStatus }) {
  const tone = stockStatusTone(status);
  const TONES: Record<string, string> = {
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-[#b45309]",
    danger: "bg-danger/10 text-danger",
    info: "bg-info/10 text-[#0369a1]",
    neutral: "bg-muted text-text-secondary",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${TONES[tone]}`}>
      {status === "In Stock" && <span className="size-1.5 rounded-full bg-success" />}
      {status === "Low Stock" && <span className="size-1.5 rounded-full bg-warning" />}
      {status === "Out of Stock" && <span className="size-1.5 rounded-full bg-danger" />}
      {status === "Expired" && <span className="size-1.5 rounded-full bg-danger" />}
      {status}
    </span>
  );
}

/* ---- PO status badge ---------------------------------------------- */
export function POStatusBadge({ status }: { status: POStatus }) {
  const tone = poStatusTone(status);
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

/* ---- Insurance status badge --------------------------------------- */
export function InsuranceStatusBadge({ status }: { status: InsuranceStatus }) {
  const tone = insuranceStatusTone(status);
  const TONES: Record<string, string> = {
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-[#b45309]",
    danger: "bg-danger/10 text-danger",
    info: "bg-info/10 text-[#0369a1]",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${TONES[tone]}`}>
      {status}
    </span>
  );
}

/* ---- PMS stat card ------------------------------------------------- */
export function PmsStatCard({ icon: Icon, label, value, hint, trend, tone = "brand" }: {
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
export function PmsSection({ title, action, children, className = "" }: {
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
export function PmsPageHeader({ title, subtitle, actions }: {
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

/* ---- Drug interaction alert ---------------------------------------- */
export function DrugInteractionAlert({ drugs, severity, description }: {
  drugs: string[]; severity: "Mild" | "Moderate" | "Severe" | "Contraindicated"; description: string;
}) {
  const colors = {
    Mild: "border-warning/30 bg-warning/5 text-[#b45309]",
    Moderate: "border-warning/30 bg-warning/5 text-[#b45309]",
    Severe: "border-danger/30 bg-danger/5 text-danger",
    Contraindicated: "border-danger/30 bg-danger/5 text-danger",
  };
  return (
    <div className={`rounded-lg border p-4 ${colors[severity]}`}>
      <div className="flex items-center gap-2">
        <AlertTriangle className="size-4" />
        <span className="text-sm font-semibold">{severity} Drug Interaction</span>
      </div>
      <p className="mt-1 text-sm">{drugs.join(" + ")}: {description}</p>
    </div>
  );
}

/* ---- Controlled drug badge ----------------------------------------- */
export function ControlledDrugBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-danger/10 px-2.5 py-1 text-xs font-semibold text-danger">
      <span className="size-1.5 rounded-full bg-danger animate-pulse" />
      Controlled Drug — Schedule H
    </span>
  );
}

/* ---- Medication card ----------------------------------------------- */
export function MedicationCard({ med }: { med: { genericName: string; brandName: string; strength: string; dosageForm: string; quantity: number; frequency: string; duration: string; route: string; instructions: string } }) {
  return (
    <div className="rounded-lg border border-border p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-medium text-text-primary">{med.genericName} {med.strength}</div>
          <div className="text-xs text-text-secondary">{med.brandName} · {med.manufacturer || "Generic"} · {med.dosageForm}</div>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
        <div><span className="text-text-secondary">Qty:</span> <span className="font-medium">{med.quantity}</span></div>
        <div><span className="text-text-secondary">Freq:</span> <span className="font-medium">{med.frequency}</span></div>
        <div><span className="text-text-secondary">Duration:</span> <span className="font-medium">{med.duration}</span></div>
        <div><span className="text-text-secondary">Route:</span> <span className="font-medium">{med.route}</span></div>
      </div>
      {med.instructions && <div className="mt-2 rounded bg-muted p-2 text-xs text-text-secondary">{med.instructions}</div>}
    </div>
  );
}
