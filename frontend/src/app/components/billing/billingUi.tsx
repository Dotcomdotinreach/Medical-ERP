import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import type { PaymentStatus, InvoiceStatus, InsuranceClaimStatus, ClearanceStatus } from "./data";
import { paymentStatusTone, invoiceStatusTone, claimStatusTone, clearanceStatusTone, formatINR } from "./data";

/* ---- Payment status badge ----------------------------------------- */
export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const tone = paymentStatusTone(status);
  const TONES: Record<string, string> = {
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

/* ---- Invoice status badge ----------------------------------------- */
export function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  const tone = invoiceStatusTone(status);
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

/* ---- Claim status badge ------------------------------------------- */
export function ClaimStatusBadge({ status }: { status: InsuranceClaimStatus }) {
  const tone = claimStatusTone(status);
  const TONES: Record<string, string> = {
    brand: "bg-secondary text-primary",
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

/* ---- Clearance status badge --------------------------------------- */
export function ClearanceStatusBadge({ status }: { status: ClearanceStatus }) {
  const tone = clearanceStatusTone(status);
  const TONES: Record<string, string> = {
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-[#b45309]",
    danger: "bg-danger/10 text-danger",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${TONES[tone]}`}>
      {status === "Cleared" && <span className="size-1.5 rounded-full bg-success" />}
      {status}
    </span>
  );
}

/* ---- Billing stat card -------------------------------------------- */
export function BillingStatCard({ icon: Icon, label, value, hint, trend, tone = "brand" }: {
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
export function BillingSection({ title, action, children, className = "" }: {
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
export function BillingPageHeader({ title, subtitle, actions }: {
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

/* ---- Invoice card -------------------------------------------------- */
export function InvoiceCard({ invoice, onClick }: {
  invoice: { invoiceNumber: string; patientName: string; grandTotal: number; status: string; paymentStatus: string; date: string };
  onClick?: () => void;
}) {
  return (
    <button onClick={onClick} className="w-full rounded-xl border border-border bg-surface p-4 text-left transition-colors hover:border-primary">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-bold text-primary">{invoice.invoiceNumber}</div>
          <div className="font-semibold text-text-primary">{invoice.patientName}</div>
          <div className="text-xs text-text-secondary">{invoice.date}</div>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-lg font-bold text-text-primary">{formatINR(invoice.grandTotal)}</div>
          <InvoiceStatusBadge status={invoice.status as InvoiceStatus} />
          <div className="mt-1"><PaymentStatusBadge status={invoice.paymentStatus as PaymentStatus} /></div>
        </div>
      </div>
    </button>
  );
}

/* ---- Amount display ------------------------------------------------ */
export function AmountDisplay({ label, amount, tone }: { label: string; amount: number; tone?: string }) {
  const color = tone === "success" ? "text-success" : tone === "danger" ? "text-danger" : tone === "warning" ? "text-[#b45309]" : "text-text-primary";
  return (
    <div className="rounded-lg bg-muted p-3 text-center">
      <div className="text-xs text-text-secondary">{label}</div>
      <div className={`text-lg font-bold ${color}`}>{formatINR(amount)}</div>
    </div>
  );
}
