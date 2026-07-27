import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import type { ItemStatus, POStatus, GRNStatus, RequisitionStatus, TransferStatus, ExpiryStatus } from "./data";
import { poStatusTone, grnStatusTone, itemStatusTone, transferStatusTone, expiryStatusTone } from "./data";

/* ---- Item status badge -------------------------------------------- */
export function ItemStatusBadge({ status }: { status: ItemStatus }) {
  const tone = itemStatusTone(status);
  const TONES: Record<string, string> = {
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-[#b45309]",
    danger: "bg-danger/10 text-danger",
    info: "bg-info/10 text-[#0369a1]",
    neutral: "bg-muted text-text-secondary",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${TONES[tone]}`}>
      {status === "Out of Stock" && <span className="size-1.5 rounded-full bg-danger animate-pulse" />}
      {status}
    </span>
  );
}

/* ---- PO status badge ----------------------------------------------- */
export function POStatusBadge({ status }: { status: POStatus }) {
  const tone = poStatusTone(status);
  const TONES: Record<string, string> = {
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-[#b45309]",
    danger: "bg-danger/10 text-danger",
    info: "bg-info/10 text-[#0369a1]",
    brand: "bg-secondary text-primary",
    neutral: "bg-muted text-text-secondary",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${TONES[tone]}`}>
      {status}
    </span>
  );
}

/* ---- GRN status badge ---------------------------------------------- */
export function GRNStatusBadge({ status }: { status: GRNStatus }) {
  const tone = grnStatusTone(status);
  const TONES: Record<string, string> = {
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-[#b45309]",
    danger: "bg-danger/10 text-danger",
    info: "bg-info/10 text-[#0369a1]",
    brand: "bg-secondary text-primary",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${TONES[tone]}`}>
      {status}
    </span>
  );
}

/* ---- Requisition status badge -------------------------------------- */
export function RequisitionStatusBadge({ status }: { status: RequisitionStatus }) {
  const TONES: Record<string, string> = {
    Draft: "bg-muted text-text-secondary",
    Submitted: "bg-info/10 text-[#0369a1]",
    Approved: "bg-success/10 text-success",
    Rejected: "bg-danger/10 text-danger",
    Fulfilled: "bg-secondary text-primary",
    Cancelled: "bg-muted text-text-secondary",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${TONES[status] || "bg-muted text-text-secondary"}`}>
      {status}
    </span>
  );
}

/* ---- Transfer status badge ----------------------------------------- */
export function TransferStatusBadge({ status }: { status: TransferStatus }) {
  const tone = transferStatusTone(status);
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

/* ---- Expiry status badge ------------------------------------------- */
export function ExpiryStatusBadge({ status }: { status: ExpiryStatus }) {
  const tone = expiryStatusTone(status);
  const TONES: Record<string, string> = {
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-[#b45309]",
    danger: "bg-danger/10 text-danger",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${TONES[tone]}`}>
      {status === "Near Expiry" && <span className="size-1.5 rounded-full bg-warning animate-pulse" />}
      {status}
    </span>
  );
}

/* ---- Inventory stat card ------------------------------------------- */
export function InventoryStatCard({ icon: Icon, label, value, hint, trend, tone = "brand" }: {
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
export function InventorySection({ title, action, children, className = "" }: {
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
export function InventoryPageHeader({ title, subtitle, actions }: {
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

/* ---- Stock level bar ------------------------------------------------ */
export function StockBar({ current, min, max }: { current: number; min: number; max: number }) {
  const pct = max > 0 ? Math.min((current / max) * 100, 100) : 0;
  const isLow = current <= min;
  const isEmpty = current === 0;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-text-secondary">{current.toLocaleString("en-IN")}</span>
        <span className="text-text-secondary">{max.toLocaleString("en-IN")}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full transition-all ${isEmpty ? "bg-danger" : isLow ? "bg-warning" : "bg-success"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-[10px] text-text-secondary">
        <span>Min: {min.toLocaleString("en-IN")}</span>
        {isLow && !isEmpty && <span className="text-warning font-medium">Below reorder</span>}
        {isEmpty && <span className="text-danger font-medium">Out of stock</span>}
      </div>
    </div>
  );
}
