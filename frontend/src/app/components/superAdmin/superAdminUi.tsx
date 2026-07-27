/* ── Super Admin — Reusable UI Components ──────────────────────────────────── */
import { type ReactNode } from "react";
import {
  ChevronRight, TrendingUp, TrendingDown, Minus, Search, Filter,
  Download, RefreshCw, MoreHorizontal, ExternalLink, CheckCircle2,
  AlertTriangle, AlertCircle, Info, Clock, Building2, Users, Bed,
  Activity, Shield, Wifi, WifiOff, Server, Database, HardDrive,
  Globe, Key, Eye, EyeOff, Copy, RotateCcw, Zap, BarChart3,
} from "lucide-react";
import { SectionCard, StatCard } from "../his/ui";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

/* ── Status Badge ─────────────────────────────────────────────────────────── */
const TONE_MAP: Record<string, string> = {
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  danger: "bg-red-50 text-red-700 border-red-200",
  info: "bg-blue-50 text-blue-700 border-blue-200",
  neutral: "bg-gray-50 text-gray-600 border-gray-200",
};

export function StatusPill({ label, tone = "neutral" }: { label: string; tone?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${TONE_MAP[tone] ?? TONE_MAP.neutral}`}>
      {tone === "success" && <span className="size-1.5 rounded-full bg-emerald-500" />}
      {tone === "danger" && <span className="size-1.5 rounded-full bg-red-500 animate-pulse" />}
      {tone === "warning" && <span className="size-1.5 rounded-full bg-amber-500" />}
      {tone === "info" && <span className="size-1.5 rounded-full bg-blue-500" />}
      {label}
    </span>
  );
}

/* ── Section Header ───────────────────────────────────────────────────────── */
export function Section({ title, subtitle, actions, children }: { title: string; subtitle?: string; actions?: ReactNode; children: ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-[var(--text-primary,#172B4D)]">{title}</h3>
          {subtitle && <p className="mt-0.5 text-sm text-[var(--text-secondary,#6B778C)]">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      {children}
    </div>
  );
}

/* ── Page Header ──────────────────────────────────────────────────────────── */
export function PageHeader({ title, subtitle, icon: Icon, actions, breadcrumb }: {
  title: string; subtitle?: string; icon?: React.ElementType; actions?: ReactNode; breadcrumb?: string[];
}) {
  return (
    <div className="space-y-3">
      {breadcrumb && breadcrumb.length > 0 && (
        <div className="flex items-center gap-1.5 text-sm text-[var(--text-secondary,#6B778C)]">
          {breadcrumb.map((b, i) => (
            <span key={b} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="size-3" />}
              <span className={i === breadcrumb.length - 1 ? "font-medium text-[var(--text-primary,#172B4D)]" : ""}>{b}</span>
            </span>
          ))}
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {Icon && <div className="grid size-10 place-items-center rounded-xl bg-[#0052CC]/10 text-[#0052CC]"><Icon className="size-5" /></div>}
          <div>
            <h1 className="text-xl font-bold text-[var(--text-primary,#172B4D)]">{title}</h1>
            {subtitle && <p className="text-sm text-[var(--text-secondary,#6B778C)]">{subtitle}</p>}
          </div>
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}

/* ── KPICard ──────────────────────────────────────────────────────────────── */
export function KPICard({ icon: Icon, label, value, sub, trend, trendValue, tone }: {
  icon: React.ElementType; label: string; value: string | number; sub?: string;
  trend?: "up" | "down" | "flat"; trendValue?: string; tone?: string;
}) {
  const tones: Record<string, string> = {
    blue: "bg-[#0052CC]/10 text-[#0052CC]",
    green: "bg-emerald-50 text-emerald-600",
    red: "bg-red-50 text-red-600",
    amber: "bg-amber-50 text-amber-600",
    purple: "bg-purple-50 text-purple-600",
    cyan: "bg-cyan-50 text-cyan-600",
  };
  return (
    <div className="rounded-xl border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div className={`grid size-10 place-items-center rounded-lg ${tones[tone ?? "blue"]}`}><Icon className="size-5" /></div>
        {trend && (
          <span className={`flex items-center gap-0.5 text-xs font-medium ${trend === "up" ? "text-emerald-600" : trend === "down" ? "text-red-600" : "text-gray-500"}`}>
            {trend === "up" ? <TrendingUp className="size-3.5" /> : trend === "down" ? <TrendingDown className="size-3.5" /> : <Minus className="size-3.5" />}
            {trendValue}
          </span>
        )}
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold text-[var(--text-primary,#172B4D)]">{value}</p>
        <p className="text-sm text-[var(--text-secondary,#6B778C)]">{label}</p>
      </div>
      {sub && <p className="mt-1 text-xs text-[var(--text-secondary,#6B778C)]">{sub}</p>}
    </div>
  );
}

/* ── Health Bar ───────────────────────────────────────────────────────────── */
export function HealthBar({ value, max, label, showValue = true }: { value: number; max: number; label?: string; showValue?: boolean }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const color = pct > 80 ? "bg-emerald-500" : pct > 50 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="space-y-1">
      {(label || showValue) && (
        <div className="flex items-center justify-between text-xs text-[var(--text-secondary,#6B778C)]">
          {label && <span>{label}</span>}
          {showValue && <span className="font-medium text-[var(--text-primary,#172B4D)]">{pct}%</span>}
        </div>
      )}
      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/* ── Org Card ─────────────────────────────────────────────────────────────── */
export function OrgCard({ org, onClick }: { org: { id: string; name: string; shortName: string; status: string; plan: string; hospitals: number; activeUsers: number; monthlyRevenue: number; complianceScore: number; logo: string; primaryColor: string; }; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="w-full rounded-xl border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] p-4 text-left shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center gap-3">
        <div className="grid size-12 place-items-center rounded-xl text-sm font-bold text-white" style={{ backgroundColor: org.primaryColor }}>{org.logo}</div>
        <div className="min-w-0 flex-1">
          <div className="truncate font-semibold text-[var(--text-primary,#172B4D)]">{org.name}</div>
          <div className="flex items-center gap-2 mt-0.5">
            <StatusPill label={org.status} tone={org.status === "Active" ? "success" : org.status === "Onboarding" ? "info" : org.status === "Trial" ? "warning" : "danger"} />
            <span className="text-xs text-[var(--text-secondary,#6B778C)]">{org.plan}</span>
          </div>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <div><div className="text-sm font-bold text-[var(--text-primary,#172B4D)]">{org.hospitals}</div><div className="text-[10px] text-[var(--text-secondary,#6B778C)]">Hospitals</div></div>
        <div><div className="text-sm font-bold text-[var(--text-primary,#172B4D)]">{org.activeUsers.toLocaleString()}</div><div className="text-[10px] text-[var(--text-secondary,#6B778C)]">Users</div></div>
        <div><div className="text-sm font-bold text-[var(--text-primary,#172B4D)]">{org.complianceScore}%</div><div className="text-[10px] text-[var(--text-secondary,#6B778C)]">Compliance</div></div>
      </div>
    </button>
  );
}

/* ── Hospital Card ────────────────────────────────────────────────────────── */
export function HospitalCard({ hospital, onClick }: { hospital: { id: string; name: string; type: string; status: string; beds: number; bedOccupancy: number; doctors: number; city: string; accreditation: string; monthlyRevenue: number; }; onClick?: () => void }) {
  const statusTone = hospital.status === "Operational" ? "success" : hospital.status === "Maintenance" ? "danger" : hospital.status === "Partial" ? "warning" : "info";
  return (
    <button onClick={onClick} className="w-full rounded-xl border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] p-4 text-left shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-semibold text-[var(--text-primary,#172B4D)]">{hospital.name}</div>
          <div className="text-xs text-[var(--text-secondary,#6B778C)]">{hospital.type} · {hospital.city}</div>
        </div>
        <StatusPill label={hospital.status} tone={statusTone} />
      </div>
      <div className="mt-3 grid grid-cols-4 gap-2 text-center text-xs">
        <div><div className="font-bold text-[var(--text-primary,#172B4D)]">{hospital.beds}</div><div className="text-[var(--text-secondary,#6B778C)]">Beds</div></div>
        <div><div className="font-bold text-[var(--text-primary,#172B4D)]">{hospital.bedOccupancy}%</div><div className="text-[var(--text-secondary,#6B778C)]">Occupancy</div></div>
        <div><div className="font-bold text-[var(--text-primary,#172B4D)]">{hospital.doctors}</div><div className="text-[var(--text-secondary,#6B778C)]">Doctors</div></div>
        <div><div className="font-bold text-[var(--text-primary,#172B4D)]">{hospital.accreditation}</div><div className="text-[var(--text-secondary,#6B778C)]">Accred.</div></div>
      </div>
      <div className="mt-3"><HealthBar value={hospital.bedOccupancy} max={100} label="Bed Occupancy" /></div>
    </button>
  );
}

/* ── System Health Widget ─────────────────────────────────────────────────── */
export function SystemHealthWidget({ services }: { services: { service: string; status: string; uptime30d: number; latency: number; instances: number; region: string; }[] }) {
  const operational = services.filter((s) => s.status === "Operational").length;
  const total = services.length;
  return (
    <div className="rounded-xl border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-[var(--text-primary,#172B4D)]">Platform Health</h4>
        <StatusPill label={`${operational}/${total} Healthy`} tone={operational === total ? "success" : "warning"} />
      </div>
      <div className="space-y-2.5">
        {services.map((s) => (
          <div key={s.service} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              {s.status === "Operational" ? <CheckCircle2 className="size-4 text-emerald-500" /> : s.status === "Partial" ? <AlertTriangle className="size-4 text-amber-500" /> : <AlertCircle className="size-4 text-red-500" />}
              <span className="text-[var(--text-primary,#172B4D)]">{s.service}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-[var(--text-secondary,#6B778C)]">
              <span>{s.uptime30d}%</span>
              <span>{s.latency}ms</span>
              <span>{s.instances}x</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Audit Timeline ───────────────────────────────────────────────────────── */
export function AuditTimeline({ logs }: { logs: { id: string; timestamp: string; userName: string; action: string; resource: string; details: string; severity: string; }[] }) {
  const severityIcon = (sev: string) => {
    if (sev === "Critical") return <AlertCircle className="size-4 text-red-500" />;
    if (sev === "Warning") return <AlertTriangle className="size-4 text-amber-500" />;
    return <Info className="size-4 text-blue-500" />;
  };
  return (
    <div className="space-y-3">
      {logs.map((log) => (
        <div key={log.id} className="flex gap-3 rounded-lg border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] p-3">
          <div className="mt-0.5">{severityIcon(log.severity)}</div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-[var(--text-primary,#172B4D)]">{log.userName}</span>
              <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-[var(--text-secondary,#6B778C)]">{log.action}</span>
              <span className="text-[10px] text-[var(--text-secondary,#6B778C)]">{log.resource}</span>
            </div>
            <p className="mt-0.5 text-xs text-[var(--text-secondary,#6B778C)]">{log.details}</p>
          </div>
          <span className="shrink-0 text-[10px] text-[var(--text-secondary,#6B778C)]">{new Date(log.timestamp).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Feature Flag Card ────────────────────────────────────────────────────── */
export function FeatureFlagCard({ feature, onToggle }: { feature: { id: string; name: string; description: string; category: string; status: string; hospitalCount: number; beta: boolean; aiPowered: boolean; }; onToggle?: () => void }) {
  const enabled = feature.status === "Enabled" || feature.status === "Beta";
  return (
    <div className="flex items-center justify-between rounded-xl border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] p-4">
      <div className="flex items-center gap-3">
        <div className={`grid size-10 place-items-center rounded-lg ${enabled ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-400"}`}>
          {feature.aiPowered ? <Zap className="size-5" /> : <Server className="size-5" />}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-[var(--text-primary,#172B4D)]">{feature.name}</span>
            {feature.beta && <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-600">Beta</span>}
            {feature.aiPowered && <span className="rounded bg-purple-50 px-1.5 py-0.5 text-[10px] font-medium text-purple-600">AI</span>}
          </div>
          <p className="text-xs text-[var(--text-secondary,#6B778C)]">{feature.description}</p>
          <p className="mt-0.5 text-[10px] text-[var(--text-secondary,#6B778C)]">{feature.hospitalCount} hospitals · {feature.category}</p>
        </div>
      </div>
      <button onClick={onToggle} className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors ${enabled ? "bg-[#0052CC]" : "bg-gray-200"}`}>
        <span className={`inline-block size-5 transform rounded-full bg-white shadow-sm transition-transform ${enabled ? "translate-x-5.5" : "translate-x-0.5"} mt-0.5`} />
      </button>
    </div>
  );
}

/* ── API Key Card ─────────────────────────────────────────────────────────── */
export function ApiKeyCard({ apiKey }: { apiKey: { id: string; name: string; type: string; key: string; lastUsed: string; requestsToday: number; rateLimit: number; status: string; permissions: string[]; } }) {
  return (
    <div className="rounded-xl border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-medium text-[var(--text-primary,#172B4D)]">{apiKey.name}</div>
          <div className="flex items-center gap-2 mt-0.5">
            <StatusPill label={apiKey.status} tone={apiKey.status === "Active" ? "success" : apiKey.status === "Expired" ? "warning" : "danger"} />
            <span className="text-xs text-[var(--text-secondary,#6B778C)]">{apiKey.type}</span>
          </div>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="size-7"><Copy className="size-3.5" /></Button>
          <Button variant="ghost" size="icon" className="size-7"><Eye className="size-3.5" /></Button>
          <Button variant="ghost" size="icon" className="size-7"><MoreHorizontal className="size-3.5" /></Button>
        </div>
      </div>
      <div className="mt-3 rounded-lg bg-gray-50 px-3 py-2 font-mono text-xs text-[var(--text-secondary,#6B778C)]">{apiKey.key}</div>
      <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
        <div><span className="text-[var(--text-secondary,#6B778C)]">Requests today</span><div className="font-medium text-[var(--text-primary,#172B4D)]">{apiKey.requestsToday.toLocaleString()}</div></div>
        <div><span className="text-[var(--text-secondary,#6B778C)]">Rate limit</span><div className="font-medium text-[var(--text-primary,#172B4D)]">{apiKey.rateLimit}/min</div></div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1">
        {apiKey.permissions.map((p) => <span key={p} className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-[var(--text-secondary,#6B778C)]">{p}</span>)}
      </div>
    </div>
  );
}

/* ── Integration Card ─────────────────────────────────────────────────────── */
export function IntegrationCard({ integration }: { integration: { id: string; name: string; type: string; status: string; lastSync: string; messagesProcessed: number; errorRate: number; endpoint: string; } }) {
  const statusTone = integration.status === "Connected" ? "success" : integration.status === "Error" ? "danger" : integration.status === "Pending" ? "info" : "warning";
  return (
    <div className="rounded-xl border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-medium text-[var(--text-primary,#172B4D)]">{integration.name}</div>
          <div className="flex items-center gap-2 mt-0.5">
            <StatusPill label={integration.status} tone={statusTone} />
            <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-[var(--text-secondary,#6B778C)]">{integration.type}</span>
          </div>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
        <div><span className="text-[var(--text-secondary,#6B778C)]">Messages</span><div className="font-medium text-[var(--text-primary,#172B4D)]">{(integration.messagesProcessed / 1000).toFixed(0)}K</div></div>
        <div><span className="text-[var(--text-secondary,#6B778C)]">Error Rate</span><div className={`font-medium ${integration.errorRate > 1 ? "text-red-600" : "text-[var(--text-primary,#172B4D)]"}`}>{integration.errorRate}%</div></div>
      </div>
      <div className="mt-3 rounded-lg bg-gray-50 px-3 py-2 font-mono text-[10px] text-[var(--text-secondary,#6B778C)] truncate">{integration.endpoint}</div>
      <div className="mt-2 text-[10px] text-[var(--text-secondary,#6B778C)]">Last sync: {new Date(integration.lastSync).toLocaleString("en-IN")}</div>
    </div>
  );
}

/* ── Security Banner ──────────────────────────────────────────────────────── */
export function SecurityBanner({ score, alerts }: { score: number; alerts: number }) {
  const tone = score >= 90 ? "success" : score >= 70 ? "warning" : "danger";
  return (
    <div className={`flex items-center gap-3 rounded-xl border p-4 ${tone === "success" ? "border-emerald-200 bg-emerald-50" : tone === "warning" ? "border-amber-200 bg-amber-50" : "border-red-200 bg-red-50"}`}>
      <Shield className={`size-5 ${tone === "success" ? "text-emerald-600" : tone === "warning" ? "text-amber-600" : "text-red-600"}`} />
      <div className="flex-1">
        <div className="text-sm font-semibold text-[var(--text-primary,#172B4D)]">Security Score: {score}/100</div>
        <div className="text-xs text-[var(--text-secondary,#6B778C)]">{alerts} active security alert{alerts !== 1 ? "s" : ""}</div>
      </div>
      <StatusPill label={tone === "success" ? "Secure" : tone === "warning" ? "Attention Needed" : "Action Required"} tone={tone} />
    </div>
  );
}

/* ── Backup Card ──────────────────────────────────────────────────────────── */
export function BackupCard({ backup }: { backup: { id: string; type: string; orgId: string; timestamp: string; size: number; status: string; location: string; retentionDays: number; lastTested: string; } }) {
  const statusTone = backup.status === "Healthy" ? "success" : backup.status === "Warning" ? "warning" : "danger";
  return (
    <div className="rounded-xl border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-medium text-[var(--text-primary,#172B4D)]">{backup.type} Backup</div>
          <div className="text-xs text-[var(--text-secondary,#6B778C)]">{backup.orgId} · {backup.location}</div>
        </div>
        <StatusPill label={backup.status} tone={statusTone} />
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
        <div><span className="text-[var(--text-secondary,#6B778C)]">Size</span><div className="font-medium text-[var(--text-primary,#172B4D)]">{backup.size} GB</div></div>
        <div><span className="text-[var(--text-secondary,#6B778C)]">Retention</span><div className="font-medium text-[var(--text-primary,#172B4D)]">{backup.retentionDays}d</div></div>
        <div><span className="text-[var(--text-secondary,#6B778C)]">Last Tested</span><div className="font-medium text-[var(--text-primary,#172B4D)]">{backup.lastTested}</div></div>
      </div>
      <div className="mt-2 text-[10px] text-[var(--text-secondary,#6B778C)]">Created: {new Date(backup.timestamp).toLocaleString("en-IN")}</div>
    </div>
  );
}

/* ── Transfer Card ────────────────────────────────────────────────────────── */
export function TransferCard({ transfer }: { transfer: { id: string; patientName: string; uhid: string; fromHospital: string; toHospital: string; reason: string; status: string; urgency: string; transportType: string; requestDate: string; clinicalSummary: string; } }) {
  const statusTone = transfer.status === "Completed" ? "success" : transfer.status === "In Transit" ? "info" : transfer.status === "Approved" ? "warning" : transfer.status === "Rejected" ? "danger" : "warning";
  const urgencyTone = transfer.urgency === "Emergency" ? "danger" : transfer.urgency === "Urgent" ? "warning" : "info";
  return (
    <div className="rounded-xl border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-semibold text-[var(--text-primary,#172B4D)]">{transfer.patientName}</div>
          <div className="text-xs text-[var(--text-secondary,#6B778C)]">{transfer.uhid}</div>
        </div>
        <div className="flex gap-1.5">
          <StatusPill label={transfer.urgency} tone={urgencyTone} />
          <StatusPill label={transfer.status} tone={statusTone} />
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 text-sm">
        <span className="rounded-lg bg-gray-50 px-2 py-1 text-[var(--text-primary,#172B4D)]">{transfer.fromHospital}</span>
        <ChevronRight className="size-4 text-[var(--text-secondary,#6B778C)]" />
        <span className="rounded-lg bg-gray-50 px-2 py-1 text-[var(--text-primary,#172B4D)]">{transfer.toHospital}</span>
      </div>
      <p className="mt-2 text-xs text-[var(--text-secondary,#6B778C)]">{transfer.reason}</p>
      <div className="mt-2 flex items-center gap-3 text-[10px] text-[var(--text-secondary,#6B778C)]">
        <span>{transfer.transportType}</span>
        <span>{new Date(transfer.requestDate).toLocaleDateString("en-IN")}</span>
      </div>
    </div>
  );
}
