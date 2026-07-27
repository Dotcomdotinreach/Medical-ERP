import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ChevronLeft, ArrowUpRight, ArrowDownRight } from "lucide-react";
import type { DispatchPriority, DispatchStatus } from "./data";
import { priorityTone, dispatchStatusTone } from "./data";

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
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold leading-tight ${BADGE_TONES[tone]}`}>
      {children}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: DispatchPriority }) {
  const tone = priorityTone(priority);
  const label = priority === "Code Red" ? "RED" : priority === "Code Yellow" ? "YELLOW" : "GREEN";
  return <Badge tone={tone}>{label}</Badge>;
}

export function DispatchBadge({ status }: { status: DispatchStatus }) {
  return <Badge tone={dispatchStatusTone(status)}>{status}</Badge>;
}

/* ---- Mobile header --------------------------------------------------- */
export function MobileHeader({ title, subtitle, onBack, rightAction }: {
  title: string; subtitle?: string; onBack?: () => void; rightAction?: ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-[#E5E7EB] bg-white px-4 py-3">
      {onBack && (
        <button onClick={onBack} className="flex size-9 shrink-0 items-center justify-center rounded-full hover:bg-[#F3F4F6] transition">
          <ChevronLeft className="size-5 text-[#111827]" />
        </button>
      )}
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-[17px] font-bold text-[#111827]">{title}</h1>
        {subtitle && <p className="truncate text-[12px] text-[#6B7280]">{subtitle}</p>}
      </div>
      {rightAction && <div className="shrink-0">{rightAction}</div>}
    </div>
  );
}

/* ---- Stat card ------------------------------------------------------- */
export function StatCard({ icon: Icon, label, value, tone = "brand", trend }: {
  icon: LucideIcon; label: string; value: string | number; tone?: Tone; trend?: number;
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
    <div className="flex items-center gap-3 rounded-2xl border border-[#E5E7EB] bg-white p-4">
      <div className={`grid size-10 shrink-0 place-items-center rounded-xl ${bg[tone]}`}>
        <Icon className="size-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[12px] text-[#6B7280]">{label}</div>
        <div className="text-[17px] font-bold text-[#111827]">{value}</div>
      </div>
      {trend !== undefined && (
        <span className={`inline-flex items-center gap-0.5 text-[11px] font-medium ${trend >= 0 ? "text-[#059669]" : "text-[#DC2626]"}`}>
          {trend >= 0 ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}{Math.abs(trend)}%
        </span>
      )}
    </div>
  );
}

/* ---- Section --------------------------------------------------------- */
export function Section({ title, action, children, className = "" }: {
  title?: string; action?: ReactNode; children: ReactNode; className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-[#E5E7EB] bg-white ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between border-b border-[#F3F4F6] px-4 py-3">
          {title && <h3 className="text-[15px] font-semibold text-[#111827]">{title}</h3>}
          {action}
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}

/* ---- Avatar ---------------------------------------------------------- */
export function EMSAvatar({ name, size = 40 }: { name: string; size?: number }) {
  const initials = name.split(" ").filter(Boolean).slice(0, 2).map(w => w[0]).join("").toUpperCase();
  return (
    <div
      className="grid shrink-0 place-items-center rounded-full bg-[#DC2626]/10 text-[13px] font-bold text-[#DC2626]"
      style={{ width: size, height: size }}
    >
      {initials}
    </div>
  );
}

/* ---- Priority pulse indicator ---------------------------------------- */
export function PriorityPulse({ priority }: { priority: DispatchPriority }) {
  const color = priority === "Code Red" ? "#DC2626" : priority === "Code Yellow" ? "#d97706" : "#059669";
  return (
    <span className="relative flex size-3">
      <span className="absolute inline-flex size-full animate-ping rounded-full opacity-75" style={{ backgroundColor: color }} />
      <span className="relative inline-flex size-3 rounded-full" style={{ backgroundColor: color }} />
    </span>
  );
}

/* ---- Bottom nav ------------------------------------------------------ */
export function BottomNav({ activeId, onNavigate, items }: {
  activeId: string; onNavigate: (id: string) => void;
  items: { id: string; label: string; icon: LucideIcon; badge?: number }[];
}) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-[#E5E7EB] bg-white px-2 pb-[env(safe-area-inset-bottom)]">
      {items.map(item => {
        const active = activeId === item.id;
        return (
          <button key={item.id} onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center gap-0.5 py-2 px-3 ${active ? "text-[#DC2626]" : "text-[#6B7280]"}`}>
            <div className="relative">
              <item.icon className="size-5" />
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -right-2 -top-1 flex size-4 items-center justify-center rounded-full bg-[#DC2626] text-[9px] font-bold text-white">
                  {item.badge > 9 ? "9+" : item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

/* ---- Progress bar ---------------------------------------------------- */
export function ProgressBar({ value, max = 100, color = "#0052CC" }: {
  value: number; max?: number; color?: string;
}) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="h-2 overflow-hidden rounded-full bg-[#E5E7EB]">
      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
    </div>
  );
}

/* ---- Offline banner -------------------------------------------------- */
export function OfflineBanner({ isOffline }: { isOffline: boolean }) {
  if (!isOffline) return null;
  return (
    <div className="flex items-center justify-center gap-2 bg-[#d97706] px-4 py-2 text-[12px] font-semibold text-white">
      <span className="size-2 rounded-full bg-white animate-pulse" />
      Offline Mode — Data will sync when connected
    </div>
  );
}

/* ---- SOS button ------------------------------------------------------ */
export function SOSButton({ onActivate }: { onActivate: () => void }) {
  return (
    <button onClick={onActivate}
      className="flex items-center gap-3 rounded-2xl bg-[#DC2626] px-6 py-4 text-white shadow-lg active:scale-[0.97]">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
        <path d="M12 8v4"/><circle cx="12" cy="16" r="1" fill="currentColor"/>
      </svg>
      <span className="text-[17px] font-bold">SOS</span>
    </button>
  );
}

/* ---- Empty state ----------------------------------------------------- */
export function EmptyState({ icon: Icon, title, description }: {
  icon: LucideIcon; title: string; description: string;
}) {
  return (
    <div className="flex flex-col items-center py-12 text-center">
      <div className="mb-4 grid size-16 place-items-center rounded-full bg-[#F3F4F6]">
        <Icon className="size-8 text-[#9CA3AF]" />
      </div>
      <h3 className="text-[15px] font-semibold text-[#111827]">{title}</h3>
      <p className="mt-1 max-w-xs text-[13px] text-[#6B7280]">{description}</p>
    </div>
  );
}

/* ---- Vitals mini card ------------------------------------------------ */
export function VitalMiniCard({ label, value, unit, status = "normal" }: {
  label: string; value: string | number; unit?: string; status?: "normal" | "abnormal" | "critical";
}) {
  const colors = {
    normal: "text-[#059669]",
    abnormal: "text-[#b45309]",
    critical: "text-[#DC2626]",
  };
  return (
    <div className="flex flex-col items-center rounded-xl bg-[#F9FAFB] p-3">
      <span className="text-[10px] text-[#6B7280]">{label}</span>
      <span className={`text-[18px] font-bold ${colors[status]}`}>{value}</span>
      {unit && <span className="text-[10px] text-[#9CA3AF]">{unit}</span>}
    </div>
  );
}

/* ---- KPI Card -------------------------------------------------------- */
export function KPICard({ icon: Icon, label, value, trend, trendValue, tone = "brand" }: {
  icon: LucideIcon; label: string; value: string | number; trend?: "up" | "down"; trendValue?: string; tone?: string;
}) {
  const toneBg: Record<string, string> = {
    blue: "bg-[#0052CC]/10 text-[#0052CC]",
    green: "bg-[#059669]/10 text-[#059669]",
    emerald: "bg-[#059669]/10 text-[#059669]",
    amber: "bg-[#d97706]/10 text-[#b45309]",
    brand: "bg-[#0052CC]/10 text-[#0052CC]",
  };
  const color = toneBg[tone] || "bg-[#6B7280]/10 text-[#6B7280]";

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm">
      <div className={`grid size-10 shrink-0 place-items-center rounded-xl ${color}`}>
        <Icon className="size-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[12px] text-[#6B7280]">{label}</div>
        <div className="text-[17px] font-bold text-[#111827]">{value}</div>
      </div>
      {trend && trendValue && (
        <span className={`inline-flex items-center gap-0.5 text-[11px] font-medium ${trend === "up" ? "text-[#059669]" : "text-[#DC2626]"}`}>
          {trend === "up" ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}{trendValue}
        </span>
      )}
    </div>
  );
}
