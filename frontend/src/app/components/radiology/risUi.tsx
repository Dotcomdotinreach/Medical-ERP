import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import type { StudyStatus, EquipmentStatus, FindingSeverity, AIFinding } from "./data";
import { studyStatusTone, equipmentStatusTone, severityTone } from "./data";

/* ---- Study status badge ------------------------------------------- */
export function StudyStatusBadge({ status, children }: { status: StudyStatus; children: ReactNode }) {
  const tone = studyStatusTone(status);
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

/* ---- Equipment status badge --------------------------------------- */
export function EquipmentStatusBadge({ status }: { status: EquipmentStatus }) {
  const tone = equipmentStatusTone(status);
  const TONES: Record<string, string> = {
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-[#b45309]",
    danger: "bg-danger/10 text-danger",
    neutral: "bg-muted text-text-secondary",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${TONES[tone]}`}>
      <span className={`size-1.5 rounded-full ${status === "Online" ? "bg-success" : status === "Error" || status === "Offline" ? "bg-danger" : status === "Maintenance" ? "bg-warning" : "bg-text-secondary"}`} />
      {status}
    </span>
  );
}

/* ---- Severity badge ------------------------------------------------ */
export function SeverityBadge({ severity }: { severity: FindingSeverity }) {
  const tone = severityTone(severity);
  const TONES: Record<string, string> = {
    success: "bg-success/10 text-success",
    info: "bg-info/10 text-[#0369a1]",
    warning: "bg-warning/10 text-[#b45309]",
    danger: "bg-danger/10 text-danger",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${TONES[tone]}`}>
      {severity === "Critical" && <span className="size-1.5 rounded-full bg-danger animate-pulse" />}
      {severity}
    </span>
  );
}

/* ---- RIS stat card ------------------------------------------------- */
export function RisStatCard({ icon: Icon, label, value, hint, trend, tone = "brand" }: {
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
export function RisSection({ title, action, children, className = "" }: {
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
export function RisPageHeader({ title, subtitle, actions }: {
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

/* ---- Dose indicator ------------------------------------------------ */
export function DoseIndicator({ mgy, maxMgy = 50 }: { mgy: number; maxMgy?: number }) {
  const pct = Math.min((mgy / maxMgy) * 100, 100);
  const color = mgy > 30 ? "bg-danger" : mgy > 15 ? "bg-warning" : "bg-success";
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-20 overflow-hidden rounded-full bg-muted">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-medium">{mgy} mGy</span>
    </div>
  );
}

/* ---- DICOM viewer placeholder -------------------------------------- */
export function DicomViewerPlaceholder({ study }: { study: string }) {
  return (
    <div className="relative flex h-[400px] items-center justify-center rounded-xl border-2 border-dashed border-border bg-black/5">
      <div className="text-center">
        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-text-primary/10">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
        </div>
        <p className="text-sm font-medium text-text-primary">{study}</p>
        <p className="mt-1 text-xs text-text-secondary">DICOM Viewer — Click to open full viewer</p>
      </div>
      <div className="absolute left-3 top-3 flex flex-col gap-1">
        {["W/L", "Zoom", "Pan", "Measure", "Annotate"].map((t) => (
          <button key={t} className="rounded bg-black/60 px-2 py-1 text-[10px] text-white hover:bg-black/80">{t}</button>
        ))}
      </div>
    </div>
  );
}

/* ---- AI finding card ----------------------------------------------- */
export function AIFindingCard({ finding }: { finding: AIFinding }) {
  return (
    <div className="rounded-lg border border-border p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <SeverityBadge severity={finding.severity} />
            <span className="text-xs text-text-secondary">{finding.location}</span>
          </div>
          <p className="mt-2 text-sm font-medium text-text-primary">{finding.finding}</p>
          {finding.measurement && <p className="mt-1 text-xs text-text-secondary">Measurement: {finding.measurement}</p>}
          <p className="mt-2 text-xs text-text-secondary italic">AI: {finding.aiSuggestion}</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-text-secondary">Confidence</div>
          <div className="text-lg font-bold text-text-primary">{finding.confidence}%</div>
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${finding.status === "Accepted" ? "bg-success/10 text-success" : finding.status === "Rejected" ? "bg-danger/10 text-danger" : "bg-warning/10 text-[#b45309]"}`}>
          {finding.status}
        </span>
      </div>
    </div>
  );
}

/* ---- Modality icon badge ------------------------------------------- */
export function ModalityBadge({ modality }: { modality: string }) {
  const colors: Record<string, string> = {
    CT: "bg-brand/10 text-primary",
    MRI: "bg-info/10 text-[#0369a1]",
    "X-Ray": "bg-warning/10 text-[#b45309]",
    "Portable X-Ray": "bg-warning/10 text-[#b45309]",
    Ultrasound: "bg-success/10 text-success",
    Mammography: "bg-danger/10 text-danger",
    "PET-CT": "bg-brand/10 text-primary",
    Fluoroscopy: "bg-info/10 text-[#0369a1]",
    "2D Echo": "bg-success/10 text-success",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${colors[modality] || "bg-muted text-text-secondary"}`}>
      {modality}
    </span>
  );
}
