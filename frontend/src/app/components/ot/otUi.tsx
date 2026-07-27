import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import type { SurgeryStatus, OTRoomStatus, SterilityStatus, ConsentStatus, ChecklistPhase, TurnoverStatus, PacuPhase, ASAClass } from "./data";
import { surgeryStatusTone, otRoomStatusTone, consentStatusTone } from "./data";

/* ---- Surgery status badge ----------------------------------------- */
export function SurgeryStatusBadge({ status, children }: { status: SurgeryStatus; children: ReactNode }) {
  const tone = surgeryStatusTone(status);
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

/* ---- OT Room status badge ----------------------------------------- */
export function OTRoomStatusBadge({ status }: { status: OTRoomStatus }) {
  const tone = otRoomStatusTone(status);
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

/* ---- Consent status badge ----------------------------------------- */
export function ConsentStatusBadge({ status }: { status: ConsentStatus }) {
  const tone = consentStatusTone(status);
  const TONES: Record<string, string> = {
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-[#b45309]",
    info: "bg-info/10 text-[#0369a1]",
    danger: "bg-danger/10 text-danger",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${TONES[tone]}`}>
      {status}
    </span>
  );
}

/* ---- Sterility badge ---------------------------------------------- */
export function SterilityBadge({ status }: { status: SterilityStatus }) {
  const TONES: Record<string, string> = {
    Sterile: "bg-success/10 text-success",
    Unsterile: "bg-danger/10 text-danger",
    Decontaminated: "bg-warning/10 text-[#b45309]",
    Expired: "bg-danger/10 text-danger",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${TONES[status]}`}>
      {status === "Sterile" && <span className="size-1.5 rounded-full bg-success" />}
      {status === "Expired" && <span className="size-1.5 rounded-full bg-danger animate-pulse" />}
      {status}
    </span>
  );
}

/* ---- ASA Classification badge ------------------------------------- */
export function ASABadge({ cls }: { cls: ASAClass }) {
  const TONES: Record<string, string> = {
    I: "bg-success/10 text-success",
    II: "bg-info/10 text-[#0369a1]",
    III: "bg-warning/10 text-[#b45309]",
    IV: "bg-danger/10 text-danger",
    V: "bg-danger/10 text-danger",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${TONES[cls]}`}>
      ASA {cls}
    </span>
  );
}

/* ---- Checklist phase badge ---------------------------------------- */
export function ChecklistPhaseBadge({ phase }: { phase: ChecklistPhase }) {
  const TONES: Record<string, string> = {
    "Sign In": "bg-info/10 text-[#0369a1]",
    "Time Out": "bg-warning/10 text-[#b45309]",
    "Sign Out": "bg-success/10 text-success",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${TONES[phase]}`}>
      {phase}
    </span>
  );
}

/* ---- Turnover status badge ---------------------------------------- */
export function TurnoverStatusBadge({ status }: { status: TurnoverStatus }) {
  const TONES: Record<string, string> = {
    Pending: "bg-muted text-text-secondary",
    "In Progress": "bg-warning/10 text-[#b45309]",
    Disinfection: "bg-info/10 text-[#0369a1]",
    Inspection: "bg-secondary text-primary",
    Ready: "bg-success/10 text-success",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${TONES[status]}`}>
      {status}
    </span>
  );
}

/* ---- PACU phase badge --------------------------------------------- */
export function PacuPhaseBadge({ phase }: { phase: PacuPhase }) {
  const TONES: Record<string, string> = {
    "Phase I": "bg-danger/10 text-danger",
    "Phase II": "bg-warning/10 text-[#b45309]",
    "Phase III": "bg-info/10 text-[#0369a1]",
    Discharged: "bg-success/10 text-success",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${TONES[phase]}`}>
      {phase}
    </span>
  );
}

/* ---- OT stat card ------------------------------------------------- */
export function OtStatCard({ icon: Icon, label, value, hint, trend, tone = "brand" }: {
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
export function OtSection({ title, action, children, className = "" }: {
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
export function OtPageHeader({ title, subtitle, actions }: {
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

/* ---- Surgery card -------------------------------------------------- */
export function SurgeryCard({ surgery, onClick }: {
  surgery: { patientName: string; procedure: string; surgeon: string; otRoom: string; scheduledTime: string; estimatedDuration: number; status: string; priority: string };
  onClick?: () => void;
}) {
  const statusColor: Record<string, string> = {
    Scheduled: "border-l-info", Confirmed: "border-l-secondary", "Pre-Op Ready": "border-l-success",
    "In Progress": "border-l-[#b45309]", Closing: "border-l-warning", Completed: "border-l-success",
    Cancelled: "border-l-muted", Emergency: "border-l-danger",
  };
  return (
    <button onClick={onClick} className={`w-full rounded-xl border border-border border-l-4 bg-surface p-4 text-left transition-colors hover:border-primary ${statusColor[surgery.status] || "border-l-muted"}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-semibold text-text-primary truncate">{surgery.patientName}</div>
          <div className="text-sm text-text-secondary truncate">{surgery.procedure}</div>
          <div className="mt-1 text-xs text-text-secondary">{surgery.surgeon} · {surgery.otRoom}</div>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-sm font-bold text-text-primary">{surgery.scheduledTime}</div>
          <div className="text-xs text-text-secondary">{surgery.estimatedDuration} min</div>
          <span className={`mt-1 inline-block text-xs font-medium ${surgery.priority === "Emergency" ? "text-danger" : surgery.priority === "Urgent" ? "text-[#b45309]" : "text-text-secondary"}`}>{surgery.priority}</span>
        </div>
      </div>
    </button>
  );
}

/* ---- OT Room Card -------------------------------------------------- */
export function OtRoomCard({ room, onClick }: {
  room: { number: string; name: string; type: string; status: string; currentSurgery?: string; equipment: string[] };
  onClick?: () => void;
}) {
  const bg: Record<string, string> = {
    Available: "border-success/30 bg-success/5", Occupied: "border-danger/30 bg-danger/5",
    Cleaning: "border-warning/30 bg-warning/5", Reserved: "border-info/30 bg-info/5",
    Maintenance: "border-muted bg-muted/50",
  };
  return (
    <button onClick={onClick} className={`rounded-xl border-2 p-4 text-left transition-colors hover:border-primary ${bg[room.status] || "border-border"}`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="font-bold text-text-primary">{room.number}</div>
          <div className="text-xs text-text-secondary">{room.name}</div>
          <div className="text-xs text-text-secondary">{room.type}</div>
        </div>
        <OTRoomStatusBadge status={room.status as OTRoomStatus} />
      </div>
      {room.currentSurgery && (
        <div className="mt-2 rounded-lg bg-danger/5 p-2 text-xs text-danger font-medium">
          {room.currentSurgery}
        </div>
      )}
      <div className="mt-2 flex flex-wrap gap-1">
        {room.equipment.slice(0, 3).map((eq, i) => (
          <span key={i} className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-text-secondary">{eq}</span>
        ))}
        {room.equipment.length > 3 && <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-text-secondary">+{room.equipment.length - 3}</span>}
      </div>
    </button>
  );
}

/* ---- Vitals Widget ------------------------------------------------- */
export function VitalsWidget({ vitals }: { vitals: { bp: string; hr: number; spo2: number; etco2?: number; temp: number } }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      <div className="rounded-lg bg-muted p-2 text-center">
        <div className="text-[10px] text-text-secondary">BP</div>
        <div className="text-sm font-bold text-text-primary">{vitals.bp}</div>
      </div>
      <div className="rounded-lg bg-muted p-2 text-center">
        <div className="text-[10px] text-text-secondary">HR</div>
        <div className="text-sm font-bold text-text-primary">{vitals.hr}</div>
      </div>
      <div className="rounded-lg bg-muted p-2 text-center">
        <div className="text-[10px] text-text-secondary">SpO2</div>
        <div className="text-sm font-bold text-success">{vitals.spo2}%</div>
      </div>
      <div className="rounded-lg bg-muted p-2 text-center">
        <div className="text-[10px] text-text-secondary">Temp</div>
        <div className="text-sm font-bold text-text-primary">{vitals.temp}°</div>
      </div>
    </div>
  );
}

/* ---- Team member pill ---------------------------------------------- */
export function TeamMemberPill({ name, role }: { name: string; role: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2">
      <div className="grid size-8 place-items-center rounded-full bg-secondary text-xs font-bold text-primary">{name.split(" ").map(n => n[0]).join("").slice(0, 2)}</div>
      <div className="min-w-0">
        <div className="truncate text-sm font-medium text-text-primary">{name}</div>
        <div className="truncate text-xs text-text-secondary">{role}</div>
      </div>
    </div>
  );
}
