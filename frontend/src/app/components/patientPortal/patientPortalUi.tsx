import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowUpRight, ArrowDownRight, ChevronLeft, Bell, Search,
} from "lucide-react";
import type {
  AppointmentStatus, ReportStatus, PaymentStatus, ClaimStatus,
  MedicationReminder,
} from "./data";
import {
  appointmentStatusTone, reportStatusTone, paymentStatusTone, claimStatusTone, timeAgo,
} from "./data";

type Tone = "brand" | "success" | "warning" | "danger" | "info" | "neutral";

/* ---- Status badge --------------------------------------------------- */
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

export function AppointmentBadge({ status }: { status: AppointmentStatus }) {
  return <Badge tone={appointmentStatusTone(status)}>{status}</Badge>;
}
export function ReportBadge({ status }: { status: ReportStatus }) {
  return <Badge tone={reportStatusTone(status)}>{status}</Badge>;
}
export function PaymentBadge({ status }: { status: PaymentStatus }) {
  return <Badge tone={paymentStatusTone(status)}>{status}</Badge>;
}
export function ClaimBadge({ status }: { status: ClaimStatus }) {
  return <Badge tone={claimStatusTone(status)}>{status}</Badge>;
}

/* ---- Mobile page header --------------------------------------------- */
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

/* ---- Mobile stat card ------------------------------------------------ */
export function MobileStatCard({ icon: Icon, label, value, tone = "brand" }: {
  icon: LucideIcon; label: string; value: string | number; tone?: Tone;
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
    </div>
  );
}

/* ---- Mobile section -------------------------------------------------- */
export function MobileSection({ title, action, children, className = "" }: {
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
export function PatientAvatar({ name, size = 40 }: { name: string; size?: number }) {
  const initials = name.split(" ").filter(Boolean).slice(0, 2).map(w => w[0]).join("").toUpperCase();
  return (
    <div
      className="grid shrink-0 place-items-center rounded-full bg-[#0052CC]/10 text-[13px] font-bold text-[#0052CC]"
      style={{ width: size, height: size }}
    >
      {initials}
    </div>
  );
}

/* ---- Health score ring ------------------------------------------------ */
export function HealthScoreRing({ score, size = 120 }: { score: number; size?: number }) {
  const color = score >= 80 ? "#059669" : score >= 60 ? "#d97706" : "#DC2626";
  const label = score >= 80 ? "Good" : score >= 60 ? "Fair" : "Needs Attention";
  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="50" fill="none" stroke="#E5E7EB" strokeWidth="8" />
        <circle cx="60" cy="60" r="50" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={`${(score / 100) * 314.16} 314.16`}
          transform="rotate(-90 60 60)" />
        <text x="60" y="55" textAnchor="middle" className="fill-[#111827]" fontSize="28" fontWeight="bold">{score}</text>
        <text x="60" y="75" textAnchor="middle" className="fill-[#6B7280]" fontSize="11">{label}</text>
      </svg>
    </div>
  );
}

/* ---- Quick action button --------------------------------------------- */
export function QuickAction({ icon: Icon, label, onClick, tone = "brand" }: {
  icon: LucideIcon; label: string; onClick?: () => void; tone?: Tone;
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
    <button onClick={onClick} className="flex flex-col items-center gap-2 rounded-2xl border border-[#E5E7EB] bg-white p-4 transition hover:shadow-sm active:scale-[0.97]">
      <div className={`grid size-12 place-items-center rounded-2xl ${bg[tone]}`}>
        <Icon className="size-6" />
      </div>
      <span className="text-[12px] font-medium text-[#111827] text-center leading-tight">{label}</span>
    </button>
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
            className={`flex flex-col items-center gap-0.5 py-2 px-3 ${active ? "text-[#0052CC]" : "text-[#6B7280]"}`}>
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

/* ---- Notification badge icon ----------------------------------------- */
export function BellIcon({ count, onClick }: { count: number; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="relative rounded-full p-2 hover:bg-[#F3F4F6] transition">
      <Bell className="size-5 text-[#111827]" />
      {count > 0 && (
        <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-[#DC2626] text-[9px] font-bold text-white">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </button>
  );
}

/* ---- SOS button ------------------------------------------------------ */
export function SOSButton({ onActivate, size = "lg" }: { onActivate: () => void; size?: "sm" | "lg" }) {
  const cls = size === "lg"
    ? "flex items-center gap-3 rounded-2xl bg-[#DC2626] px-6 py-4 text-white shadow-lg active:scale-[0.97]"
    : "flex items-center gap-2 rounded-xl bg-[#DC2626] px-4 py-2.5 text-white active:scale-[0.97]";
  return (
    <button onClick={onActivate} className={cls}>
      <svg width={size === "lg" ? 24 : 18} height={size === "lg" ? 24 : 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
        <path d="M12 8v4"/>
        <circle cx="12" cy="16" r="1" fill="currentColor"/>
      </svg>
      <span className={size === "lg" ? "text-[17px] font-bold" : "text-[13px] font-bold"}>Emergency SOS</span>
    </button>
  );
}

/* ---- Empty state ----------------------------------------------------- */
export function EmptyState({ icon: Icon, title, description, action }: {
  icon: LucideIcon; title: string; description: string; action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center py-12 text-center">
      <div className="mb-4 grid size-16 place-items-center rounded-full bg-[#F3F4F6]">
        <Icon className="size-8 text-[#9CA3AF]" />
      </div>
      <h3 className="text-[15px] font-semibold text-[#111827]">{title}</h3>
      <p className="mt-1 max-w-xs text-[13px] text-[#6B7280]">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

/* ---- Tab bar --------------------------------------------------------- */
export function TabBar({ tabs, activeTab, onTabChange }: {
  tabs: string[]; activeTab: string; onTabChange: (tab: string) => void;
}) {
  return (
    <div className="flex gap-1 rounded-xl bg-[#F3F4F6] p-1">
      {tabs.map(tab => (
        <button key={tab} onClick={() => onTabChange(tab)}
          className={`flex-1 rounded-lg py-2 text-[13px] font-medium transition ${
            activeTab === tab ? "bg-white text-[#111827] shadow-sm" : "text-[#6B7280]"
          }`}>
          {tab}
        </button>
      ))}
    </div>
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

/* ---- Floating action button ------------------------------------------ */
export function FAB({ icon: Icon, onClick, label }: { icon: LucideIcon; onClick?: () => void; label?: string }) {
  return (
    <button onClick={onClick}
      className="fixed bottom-24 right-5 z-40 flex items-center gap-2 rounded-2xl bg-[#0052CC] px-5 py-3.5 text-white shadow-lg transition hover:bg-[#0043A8] active:scale-[0.95]">
      <Icon className="size-5" />
      {label && <span className="text-[14px] font-semibold">{label}</span>}
    </button>
  );
}

/* ---- Reminder status helper ------------------------------------------ */
export function ReminderStatusBadge({ status }: { status: MedicationReminder["status"] }) {
  const tones: Record<string, string> = {
    Taken: "bg-[#059669]/10 text-[#059669]",
    Skipped: "bg-[#DC2626]/10 text-[#DC2626]",
    Pending: "bg-[#d97706]/10 text-[#b45309]",
    Snoozed: "bg-[#0369a1]/10 text-[#0369a1]",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${tones[status] || "bg-[#6B7280]/10 text-[#6B7280]"}`}>
      {status}
    </span>
  );
}
