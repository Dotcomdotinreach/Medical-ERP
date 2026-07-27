import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import type { SampleStatus, QCStatus, AnalyzerStatus, ResultEntry } from "./data";
import { statusTone, qcStatusTone, analyzerStatusTone, abnormalFlagTone } from "./data";

/* ---- Lab status badge --------------------------------------------- */
export function LabStatusBadge({ status, children }: { status: SampleStatus; children: ReactNode }) {
  const tone = statusTone(status);
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

/* ---- QC status badge ---------------------------------------------- */
export function QCStatusBadge({ status }: { status: QCStatus }) {
  const tone = qcStatusTone(status);
  const TONES: Record<string, string> = {
    success: "bg-success/10 text-success",
    danger: "bg-danger/10 text-danger",
    warning: "bg-warning/10 text-[#b45309]",
    info: "bg-info/10 text-[#0369a1]",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${TONES[tone]}`}>
      {status === "Pass" && <span className="size-1.5 rounded-full bg-success" />}
      {status === "Fail" && <span className="size-1.5 rounded-full bg-danger" />}
      {status === "Pending" && <span className="size-1.5 rounded-full bg-warning" />}
      {status === "Recalibration" && <span className="size-1.5 rounded-full bg-info" />}
      {status}
    </span>
  );
}

/* ---- Analyzer status badge ---------------------------------------- */
export function AnalyzerStatusBadge({ status }: { status: AnalyzerStatus }) {
  const tone = analyzerStatusTone(status);
  const TONES: Record<string, string> = {
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-[#b45309]",
    danger: "bg-danger/10 text-danger",
    neutral: "bg-muted text-text-secondary",
  };
  const labels: Record<string, string> = {
    Online: "Online",
    Offline: "Offline",
    Maintenance: "Maintenance",
    Error: "Error",
    Idle: "Idle",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${TONES[tone]}`}>
      <span className={`size-1.5 rounded-full ${status === "Online" ? "bg-success" : status === "Error" || status === "Offline" ? "bg-danger" : status === "Maintenance" ? "bg-warning" : "bg-text-secondary"}`} />
      {labels[status]}
    </span>
  );
}

/* ---- Lab stat card ------------------------------------------------- */
export function LabStatCard({ icon: Icon, label, value, hint, trend, tone = "brand" }: {
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
export function LabSection({ title, action, children, className = "" }: {
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
export function LabPageHeader({ title, subtitle, actions }: {
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

/* ---- Barcode label ------------------------------------------------- */
export function BarcodeLabel({ specimenId, patientName, uhid, sampleType, tubeType, collectionTime }: {
  specimenId: string; patientName: string; uhid: string; sampleType: string; tubeType: string; collectionTime: string;
}) {
  return (
    <div className="rounded-lg border-2 border-dashed border-border bg-white p-4 text-center" style={{ fontFamily: "monospace" }}>
      <div className="text-xs font-bold text-text-primary">MERIDIAN HOSPITAL</div>
      <div className="mt-1 text-[10px] text-text-secondary">Laboratory Information System</div>
      <div className="my-2 border-t border-border" />
      <div className="text-lg font-black tracking-wider text-text-primary">{specimenId}</div>
      <div className="my-1 flex justify-center gap-0.5">
        {Array.from({ length: 40 }).map((_, i) => (
          <div key={i} className={`w-0.5 ${i % 3 === 0 ? "h-5" : i % 2 === 0 ? "h-4" : "h-3"} bg-text-primary`} />
        ))}
      </div>
      <div className="my-2 border-t border-border" />
      <div className="text-left text-[11px] leading-relaxed">
        <div><span className="text-text-secondary">Patient:</span> <span className="font-semibold">{patientName}</span></div>
        <div><span className="text-text-secondary">UHID:</span> <span className="font-semibold">{uhid}</span></div>
        <div><span className="text-text-secondary">Sample:</span> <span className="font-semibold">{sampleType}</span></div>
        <div><span className="text-text-secondary">Tube:</span> <span className="font-semibold">{tubeType}</span></div>
        <div><span className="text-text-secondary">Collected:</span> <span className="font-semibold">{collectionTime}</span></div>
      </div>
    </div>
  );
}

/* ---- Reference range badge ----------------------------------------- */
export function ReferenceRangeBadge({ flag }: { flag: ResultEntry["abnormalFlag"] }) {
  const colorClass = abnormalFlagTone(flag);
  return (
    <span className={`text-xs font-medium ${colorClass}`}>
      {flag}
    </span>
  );
}

/* ---- Critical alert banner ----------------------------------------- */
export function CriticalAlertBanner({ test, value, unit, threshold, patient }: {
  test: string; value: string; unit: string; threshold: string; patient: string;
}) {
  return (
    <div className="rounded-lg border border-danger/30 bg-danger/5 p-4">
      <div className="flex items-center gap-2">
        <span className="size-2 animate-pulse rounded-full bg-danger" />
        <span className="text-sm font-semibold text-danger">CRITICAL VALUE DETECTED</span>
      </div>
      <div className="mt-2 text-sm">
        <span className="font-medium">{patient}</span> — <span className="font-semibold text-danger">{test}: {value} {unit}</span>
      </div>
      <div className="mt-1 text-xs text-text-secondary">Threshold: {threshold}</div>
    </div>
  );
}

/* ---- Specimen tracker timeline ------------------------------------- */
export function SpecimenTimeline({ steps }: { steps: { label: string; time: string; done: boolean; active?: boolean }[] }) {
  return (
    <div className="flex items-center gap-0">
      {steps.map((s, i) => (
        <div key={s.label} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className={`size-3 rounded-full ${s.done ? "bg-success" : s.active ? "bg-primary ring-4 ring-primary/20" : "bg-border"}`} />
            <div className="mt-1 text-[10px] font-medium text-text-secondary">{s.label}</div>
            {s.time && <div className="text-[10px] text-text-secondary">{s.time}</div>}
          </div>
          {i < steps.length - 1 && <div className={`mx-1 mb-5 h-0.5 w-8 ${s.done ? "bg-success" : "bg-border"}`} />}
        </div>
      ))}
    </div>
  );
}
