import { useState, useMemo } from "react";
import {
  LayoutDashboard, Building2, Building, Users, Shield, CreditCard, Zap, Search,
  ArrowRightLeft, Package, BarChart3, Lock, ScrollText, Webhook, Palette,
  Server, CheckCircle2, ChevronRight, Download, Filter, Plus, RefreshCw,
  Settings, Eye, Edit3, Trash2, MoreHorizontal, Globe, Key, Database,
  Activity, Bed, Heart, AlertTriangle, AlertCircle, Bell, TrendingUp,
  Clock, MapPin, Phone, Mail, ExternalLink, Copy, RotateCcw, Wifi,
  WifiOff, HardDrive, Cloud, Cpu, MemoryStick, Monitor, UserCheck,
  UserX, FileText, Star, Target, Brain, Stethoscope, Pill, Microscope,
  Scissors, Siren, Smartphone, Ambulance, Banknote, Home,
} from "lucide-react";
import { Shell, type Workspace } from "../his/Shell";
import { StatusBadge } from "../his/ui";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  ORGANIZATIONS, HOSPITALS, BRANCHES, PLATFORM_USERS, ROLES, SUBSCRIPTIONS, FEATURES,
  MPI_PATIENTS, TRANSFERS, GLOBAL_INVENTORY, AUDIT_LOGS, API_KEYS, INTEGRATIONS,
  SECURITY_EVENTS, BACKUPS, SYSTEM_HEALTH, PLATFORM_KPI,
  orgStatusTone, operationalStatusTone, transferStatusTone, backupStatusTone,
  securitySeverityTone, inventoryStatusTone, featureStatusTone, integrationStatusTone,
  formatCurrency, formatBytes, timeAgo,
} from "./data";
import {
  PageHeader, KPICard, HealthBar, OrgCard, HospitalCard, SystemHealthWidget,
  AuditTimeline, FeatureFlagCard, ApiKeyCard, IntegrationCard, SecurityBanner,
  BackupCard, TransferCard, Section, StatusPill,
} from "./superAdminUi";

const NAV = [
  { id: "global-dashboard", label: "Global Dashboard", icon: LayoutDashboard },
  { id: "organizations", label: "Organizations", icon: Building2, badge: String(PLATFORM_KPI.totalOrgs) },
  { id: "hospitals", label: "Hospitals", icon: Building, badge: String(PLATFORM_KPI.totalHospitals) },
  { id: "branches", label: "Branches", icon: MapPin, badge: String(PLATFORM_KPI.totalBranches) },
  { id: "users", label: "User Management", icon: Users, badge: String(PLATFORM_KPI.totalActiveUsers) },
  { id: "roles", label: "Roles & Permissions", icon: Shield },
  { id: "subscriptions", label: "Subscriptions", icon: CreditCard },
  { id: "features", label: "Feature Management", icon: Zap },
  { id: "mpi", label: "Master Patient Index", icon: Search },
  { id: "transfers", label: "Cross-Hospital Transfers", icon: ArrowRightLeft, badge: String(TRANSFERS.filter((t) => t.status === "Pending").length), tone: "warning" as const },
  { id: "global-inventory", label: "Global Inventory", icon: Package },
  { id: "analytics", label: "Global Analytics", icon: BarChart3 },
  { id: "security", label: "Security Center", icon: Lock, badge: String(SECURITY_EVENTS.filter((s) => s.status !== "Resolved").length), tone: "danger" as const },
  { id: "audit-logs", label: "Audit Logs", icon: ScrollText },
  { id: "api-center", label: "API & Integrations", icon: Webhook },
  { id: "white-label", label: "White Label Settings", icon: Palette },
  { id: "disaster-recovery", label: "DR & Monitoring", icon: Server },
  { id: "workflow-complete", label: "Workflow Complete", icon: CheckCircle2 },
];

export function SuperAdminApp({ roleName, onSignOut, onSwitchWorkspace, onOpenSettings }: { roleName: string; onSignOut: () => void; onSwitchWorkspace: (w: Workspace) => void; onOpenSettings?: (page: string) => void }) {
  const [screen, setScreen] = useState("global-dashboard");
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null);

  const activeId = screen;
  const isActive = (id: string) => {
    if (id === screen) return true;
    return false;
  };

  const breadcrumb = useMemo(() => {
    const crumb = ["Super Admin"];
    const nav = NAV.find((n) => n.id === screen);
    if (nav) crumb.push(nav.label);
    if (selectedOrg) {
      const org = ORGANIZATIONS.find((o) => o.id === selectedOrg);
      if (org) crumb.splice(1, 0, org.shortName);
    }
    return crumb;
  }, [screen, selectedOrg]);

  return (
    <Shell
      nav={NAV}
      sectionLabel="SaaS Administration"
      activeId={activeId}
      isActive={isActive}
      onNavigate={setScreen}
      breadcrumb={breadcrumb}
      roleName={roleName}
      onSignOut={onSignOut}
      workspace="super-admin"
      onSwitchWorkspace={onSwitchWorkspace}
      onOpenSettings={onOpenSettings}
      searchPlaceholder="Search organizations, hospitals, users…"
    >
      {screen === "global-dashboard" && <GlobalDashboard onNavigate={setScreen} onSelectOrg={setSelectedOrg} />}
      {screen === "organizations" && <OrganizationManagement onNavigate={setScreen} onSelectOrg={setSelectedOrg} />}
      {screen === "hospitals" && <HospitalManagement selectedOrg={selectedOrg} />}
      {screen === "branches" && <BranchManagement selectedOrg={selectedOrg} />}
      {screen === "users" && <UserManagement />}
      {screen === "roles" && <RolesPermissions />}
      {screen === "subscriptions" && <SubscriptionLicensing />}
      {screen === "features" && <FeatureManagement />}
      {screen === "mpi" && <MasterPatientIndex />}
      {screen === "transfers" && <CrossHospitalTransfers />}
      {screen === "global-inventory" && <GlobalInventoryScreen />}
      {screen === "analytics" && <GlobalAnalytics />}
      {screen === "security" && <SecurityCenter />}
      {screen === "audit-logs" && <AuditLogsScreen />}
      {screen === "api-center" && <ApiIntegrationCenter />}
      {screen === "white-label" && <WhiteLabelSettings />}
      {screen === "disaster-recovery" && <DisasterRecovery />}
      {screen === "workflow-complete" && <WorkflowComplete onNavigate={setScreen} />}
    </Shell>
  );
}

/* ── 01. Global Dashboard ─────────────────────────────────────────────────── */
function GlobalDashboard({ onNavigate, onSelectOrg }: { onNavigate: (s: string) => void; onSelectOrg: (id: string) => void }) {
  const k = PLATFORM_KPI;
  return (
    <div className="space-y-6">
      <PageHeader title="Global Dashboard" subtitle="Multi-hospital SaaS platform overview" icon={LayoutDashboard} actions={<><Button variant="outline" size="sm"><Download className="size-4 mr-1.5" />Export Report</Button><Button size="sm" onClick={() => onNavigate("organizations")}><Plus className="size-4 mr-1.5" />New Organization</Button></>} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard icon={Building2} label="Organizations" value={k.totalOrgs} trend="up" trendValue="+1 this quarter" tone="blue" />
        <KPICard icon={Building} label="Hospitals" value={k.totalHospitals} trend="up" trendValue="+3 this month" tone="green" />
        <KPICard icon={Users} label="Active Users" value={k.totalActiveUsers.toLocaleString()} trend="up" trendValue="+8.2%" tone="purple" />
        <KPICard icon={Heart} label="Today's Patients" value={k.todayPatients.toLocaleString()} trend="up" trendValue="+5.4%" tone="red" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard icon={Banknote} label="Monthly Revenue" value={formatCurrency(k.monthlyRevenue)} trend="up" trendValue={`+${k.monthlyRevenueGrowth}%`} tone="green" />
        <KPICard icon={Globe} label="Platform Uptime" value={`${k.platformUptime}%`} tone="cyan" />
        <KPICard icon={Webhook} label="API Calls (Monthly)" value={`${(k.totalApiCalls / 1000000).toFixed(1)}M`} trend="up" trendValue="+12%" tone="blue" />
        <KPICard icon={Shield} label="Security Score" value={`${k.securityScore}/100`} tone={k.securityScore >= 90 ? "green" : "amber"} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[var(--text-primary,#172B4D)]">Hospital Network Status</h3>
            <Button variant="ghost" size="sm" onClick={() => onNavigate("hospitals")}>View All <ChevronRight className="size-4 ml-1" /></Button>
          </div>
          <div className="space-y-2">
            {HOSPITALS.slice(0, 6).map((h) => (
              <div key={h.id} className="flex items-center justify-between rounded-lg border border-[var(--border,#DFE1E6)] p-3">
                <div className="flex items-center gap-3">
                  <div className={`size-2.5 rounded-full ${h.status === "Operational" ? "bg-emerald-500" : h.status === "Maintenance" ? "bg-red-500" : "bg-amber-500"}`} />
                  <div>
                    <div className="text-sm font-medium text-[var(--text-primary,#172B4D)]">{h.name}</div>
                    <div className="text-xs text-[var(--text-secondary,#6B778C)]">{h.city} · {h.beds} beds</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-[var(--text-secondary,#6B778C)]">
                  <span>{h.bedOccupancy}% occ.</span>
                  <span>{h.monthlyPatients.toLocaleString()} pts/mo</span>
                  <StatusPill label={h.status} tone={operationalStatusTone(h.status)} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <SystemHealthWidget services={SYSTEM_HEALTH} />
          <div className="rounded-xl border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] p-4 shadow-sm">
            <h4 className="font-semibold text-[var(--text-primary,#172B4D)] mb-3">Quick Actions</h4>
            <div className="space-y-2">
              <button onClick={() => onNavigate("organizations")} className="flex w-full items-center gap-3 rounded-lg border border-[var(--border,#DFE1E6)] p-3 text-left text-sm hover:bg-gray-50 transition-colors">
                <Building2 className="size-4 text-[#0052CC]" />Manage Organizations
              </button>
              <button onClick={() => onNavigate("users")} className="flex w-full items-center gap-3 rounded-lg border border-[var(--border,#DFE1E6)] p-3 text-left text-sm hover:bg-gray-50 transition-colors">
                <Users className="size-4 text-[#0052CC]" />Manage Users
              </button>
              <button onClick={() => onNavigate("security")} className="flex w-full items-center gap-3 rounded-lg border border-[var(--border,#DFE1E6)] p-3 text-left text-sm hover:bg-gray-50 transition-colors">
                <Shield className="size-4 text-[#0052CC]" />Security Center
              </button>
              <button onClick={() => onNavigate("analytics")} className="flex w-full items-center gap-3 rounded-lg border border-[var(--border,#DFE1E6)] p-3 text-left text-sm hover:bg-gray-50 transition-colors">
                <BarChart3 className="size-4 text-[#0052CC]" />View Analytics
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-[var(--text-primary,#172B4D)]">Subscription Overview</h3>
            <Button variant="ghost" size="sm" onClick={() => onNavigate("subscriptions")}>Details <ChevronRight className="size-4 ml-1" /></Button>
          </div>
          <div className="space-y-2">
            {SUBSCRIPTIONS.map((sub) => {
              const org = ORGANIZATIONS.find((o) => o.id === sub.orgId);
              if (!org) return null;
              return (
                <div key={sub.orgId} className="flex items-center justify-between rounded-lg border border-[var(--border,#DFE1E6)] p-3">
                  <div>
                    <div className="text-sm font-medium text-[var(--text-primary,#172B4D)]">{org.shortName}</div>
                    <div className="text-xs text-[var(--text-secondary,#6B778C)]">{sub.plan} · {sub.billingCycle}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-[var(--text-primary,#172B4D)]">{formatCurrency(sub.monthlyAmount)}/mo</div>
                    <div className="text-[10px] text-[var(--text-secondary,#6B778C)]">Renews {sub.renewalDate}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-[var(--text-primary,#172B4D)]">Recent Audit Activity</h3>
            <Button variant="ghost" size="sm" onClick={() => onNavigate("audit-logs")}>View All <ChevronRight className="size-4 ml-1" /></Button>
          </div>
          <AuditTimeline logs={AUDIT_LOGS.slice(0, 5)} />
        </div>
      </div>

      <div className="rounded-xl border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-[var(--text-primary,#172B4D)]">AI Monitoring</h3>
          <StatusPill label={`${k.aiModelsActive} Models Active`} tone="info" />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-[var(--border,#DFE1E6)] p-3">
            <div className="flex items-center gap-2 mb-2"><Brain className="size-4 text-purple-500" /><span className="text-sm font-medium text-[var(--text-primary,#172B4D)]">AI Diagnostics</span></div>
            <div className="text-2xl font-bold text-[var(--text-primary,#172B4D)]">{k.aiAccuracy}%</div>
            <div className="text-xs text-[var(--text-secondary,#6B778C)]">Accuracy rate</div>
            <HealthBar value={k.aiAccuracy} max={100} showValue={false} />
          </div>
          <div className="rounded-lg border border-[var(--border,#DFE1E6)] p-3">
            <div className="flex items-center gap-2 mb-2"><Activity className="size-4 text-blue-500" /><span className="text-sm font-medium text-[var(--text-primary,#172B4D)]">Predictive Models</span></div>
            <div className="text-2xl font-bold text-[var(--text-primary,#172B4D)]">847</div>
            <div className="text-xs text-[var(--text-secondary,#6B778C)]">Predictions today</div>
            <HealthBar value={847} max={1000} showValue={false} />
          </div>
          <div className="rounded-lg border border-[var(--border,#DFE1E6)] p-3">
            <div className="flex items-center gap-2 mb-2"><Target className="size-4 text-emerald-500" /><span className="text-sm font-medium text-[var(--text-primary,#172B4D)]">Supply Chain AI</span></div>
            <div className="text-2xl font-bold text-[var(--text-primary,#172B4D)]">92.1%</div>
            <div className="text-xs text-[var(--text-secondary,#6B778C)]">Forecast accuracy</div>
            <HealthBar value={92.1} max={100} showValue={false} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── 02. Organization Management ──────────────────────────────────────────── */
function OrganizationManagement({ onNavigate, onSelectOrg }: { onNavigate: (s: string) => void; onSelectOrg: (id: string) => void }) {
  const [search, setSearch] = useState("");
  const filtered = ORGANIZATIONS.filter((o) => o.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="space-y-6">
      <PageHeader title="Organization Management" subtitle="Manage healthcare organizations and tenants" icon={Building2}
        breadcrumb={["Super Admin", "Organizations"]}
        actions={<><Button variant="outline" size="sm"><Download className="size-4 mr-1.5" />Export</Button><Button size="sm"><Plus className="size-4 mr-1.5" />Create Organization</Button></>} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard icon={Building2} label="Total Organizations" value={ORGANIZATIONS.length} tone="blue" />
        <KPICard icon={CheckCircle2} label="Active" value={ORGANIZATIONS.filter((o) => o.status === "Active").length} tone="green" />
        <KPICard icon={Clock} label="Onboarding" value={ORGANIZATIONS.filter((o) => o.status === "Onboarding").length} tone="info" />
        <KPICard icon={AlertTriangle} label="Suspended / Expired" value={ORGANIZATIONS.filter((o) => o.status === "Suspended" || o.status === "Expired").length} tone="red" />
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--text-secondary,#6B778C)]" />
          <Input placeholder="Search organizations…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Button variant="outline" size="sm"><Filter className="size-4 mr-1.5" />Filters</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((org) => (
          <OrgCard key={org.id} org={org} onClick={() => { onSelectOrg(org.id); onNavigate("hospitals"); }} />
        ))}
      </div>
    </div>
  );
}

/* ── 03. Hospital Management ──────────────────────────────────────────────── */
function HospitalManagement({ selectedOrg }: { selectedOrg: string | null }) {
  const [search, setSearch] = useState("");
  const filtered = HOSPITALS.filter((h) => {
    const matchOrg = !selectedOrg || h.orgId === selectedOrg;
    const matchSearch = h.name.toLowerCase().includes(search.toLowerCase());
    return matchOrg && matchSearch;
  });
  const orgName = selectedOrg ? ORGANIZATIONS.find((o) => o.id === selectedOrg)?.name : "All Organizations";
  return (
    <div className="space-y-6">
      <PageHeader title="Hospital Management" subtitle={`Viewing: ${orgName}`} icon={Building}
        breadcrumb={["Super Admin", selectedOrg ?? "All", "Hospitals"]}
        actions={<><Button variant="outline" size="sm"><Download className="size-4 mr-1.5" />Export</Button><Button size="sm"><Plus className="size-4 mr-1.5" />Add Hospital</Button></>} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard icon={Building} label="Total Hospitals" value={filtered.length} tone="blue" />
        <KPICard icon={CheckCircle2} label="Operational" value={filtered.filter((h) => h.status === "Operational").length} tone="green" />
        <KPICard icon={Bed} label="Total Beds" value={filtered.reduce((a, h) => a + h.beds, 0).toLocaleString()} tone="purple" />
        <KPICard icon={Users} label="Total Doctors" value={filtered.reduce((a, h) => a + h.doctors, 0).toLocaleString()} tone="cyan" />
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--text-secondary,#6B778C)]" />
          <Input placeholder="Search hospitals…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Button variant="outline" size="sm"><Filter className="size-4 mr-1.5" />Filters</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((h) => <HospitalCard key={h.id} hospital={h} />)}
      </div>
    </div>
  );
}

/* ── 04. Branch Management ────────────────────────────────────────────────── */
function BranchManagement({ selectedOrg }: { selectedOrg: string | null }) {
  const filtered = BRANCHES.filter((b) => !selectedOrg || b.orgId === selectedOrg);
  return (
    <div className="space-y-6">
      <PageHeader title="Branch Management" subtitle="Hospital branches, buildings & infrastructure" icon={MapPin}
        breadcrumb={["Super Admin", "Branches"]}
        actions={<><Button variant="outline" size="sm"><Download className="size-4 mr-1.5" />Export</Button><Button size="sm"><Plus className="size-4 mr-1.5" />Add Branch</Button></>} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard icon={MapPin} label="Total Branches" value={filtered.length} tone="blue" />
        <KPICard icon={Building} label="Buildings" value={filtered.reduce((a, b) => a + b.buildings, 0)} tone="green" />
        <KPICard icon={Bed} label="Total Beds" value={filtered.reduce((a, b) => a + b.beds, 0).toLocaleString()} tone="purple" />
        <KPICard icon={Activity} label="Departments" value={filtered.reduce((a, b) => a + b.departments, 0)} tone="cyan" />
      </div>

      <div className="rounded-xl border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border,#DFE1E6)] bg-gray-50/50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary,#6B778C)]">Branch</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary,#6B778C)]">Hospital</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary,#6B778C)]">City</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary,#6B778C)]">Buildings</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary,#6B778C)]">Floors</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary,#6B778C)]">Depts</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary,#6B778C)]">Beds</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary,#6B778C)]">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => {
                const hosp = HOSPITALS.find((h) => h.id === b.hospitalId);
                return (
                  <tr key={b.id} className="border-b border-[var(--border,#DFE1E6)] last:border-0 hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-[var(--text-primary,#172B4D)]">{b.name}</div>
                      <div className="text-xs text-[var(--text-secondary,#6B778C)]">{b.address}</div>
                    </td>
                    <td className="px-4 py-3 text-[var(--text-primary,#172B4D)]">{hosp?.name ?? b.hospitalId}</td>
                    <td className="px-4 py-3 text-[var(--text-primary,#172B4D)]">{b.city}</td>
                    <td className="px-4 py-3 text-[var(--text-primary,#172B4D)]">{b.buildings}</td>
                    <td className="px-4 py-3 text-[var(--text-primary,#172B4D)]">{b.floors}</td>
                    <td className="px-4 py-3 text-[var(--text-primary,#172B4D)]">{b.departments}</td>
                    <td className="px-4 py-3 text-[var(--text-primary,#172B4D)]">{b.beds}</td>
                    <td className="px-4 py-3"><StatusPill label={b.status} tone={operationalStatusTone(b.status)} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ── 05. User Management ──────────────────────────────────────────────────── */
function UserManagement() {
  const [search, setSearch] = useState("");
  const filtered = PLATFORM_USERS.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="space-y-6">
      <PageHeader title="User Management" subtitle="Manage platform and organization users" icon={Users}
        breadcrumb={["Super Admin", "Users"]}
        actions={<><Button variant="outline" size="sm"><Download className="size-4 mr-1.5" />Export</Button><Button variant="outline" size="sm"><UserCheck className="size-4 mr-1.5" />Bulk Import</Button><Button size="sm"><Plus className="size-4 mr-1.5" />Create User</Button></>} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard icon={Users} label="Total Users" value={PLATFORM_USERS.length} tone="blue" />
        <KPICard icon={CheckCircle2} label="Active" value={PLATFORM_USERS.filter((u) => u.status === "Active").length} tone="green" />
        <KPICard icon={Shield} label="Admins" value={PLATFORM_USERS.filter((u) => u.role.includes("Admin")).length} tone="purple" />
        <KPICard icon={Lock} label="MFA Enabled" value={PLATFORM_USERS.filter((u) => u.mfaEnabled).length} tone="cyan" />
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--text-secondary,#6B778C)]" />
          <Input placeholder="Search users…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Button variant="outline" size="sm"><Filter className="size-4 mr-1.5" />Filters</Button>
      </div>

      <div className="rounded-xl border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border,#DFE1E6)] bg-gray-50/50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary,#6B778C)]">User</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary,#6B778C)]">Role</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary,#6B778C)]">Organization</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary,#6B778C)]">Department</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary,#6B778C)]">MFA</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary,#6B778C)]">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary,#6B778C)]">Last Login</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => {
                const org = ORGANIZATIONS.find((o) => o.id === u.orgId);
                return (
                  <tr key={u.id} className="border-b border-[var(--border,#DFE1E6)] last:border-0 hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-[var(--text-primary,#172B4D)]">{u.name}</div>
                      <div className="text-xs text-[var(--text-secondary,#6B778C)]">{u.email}</div>
                    </td>
                    <td className="px-4 py-3"><span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-[var(--text-primary,#172B4D)]">{u.role}</span></td>
                    <td className="px-4 py-3 text-[var(--text-primary,#172B4D)]">{org?.shortName ?? u.orgId}</td>
                    <td className="px-4 py-3 text-[var(--text-primary,#172B4D)]">{u.department}</td>
                    <td className="px-4 py-3">{u.mfaEnabled ? <CheckCircle2 className="size-4 text-emerald-500" /> : <AlertTriangle className="size-4 text-amber-500" />}</td>
                    <td className="px-4 py-3"><StatusPill label={u.status} tone={u.status === "Active" ? "success" : u.status === "Locked" ? "danger" : u.status === "Pending" ? "info" : "warning"} /></td>
                    <td className="px-4 py-3 text-xs text-[var(--text-secondary,#6B778C)]">{u.lastLogin === "Never" ? "Never" : timeAgo(u.lastLogin)}</td>
                    <td className="px-4 py-3"><Button variant="ghost" size="icon" className="size-7"><MoreHorizontal className="size-4" /></Button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ── 06. Roles & Permissions ──────────────────────────────────────────────── */
function RolesPermissions() {
  const modules = ["Organization", "Hospital", "Department", "User", "Patient", "EMR", "LIS", "RIS", "PMS", "IPD", "OT", "ICU", "Billing", "Inventory", "Analytics", "Security", "Audit", "API", "Reports", "Configuration"];
  return (
    <div className="space-y-6">
      <PageHeader title="Roles & Permissions" subtitle="Role-based access control and permission matrix" icon={Shield}
        breadcrumb={["Super Admin", "Roles & Permissions"]}
        actions={<><Button variant="outline" size="sm"><Download className="size-4 mr-1.5" />Export Matrix</Button><Button size="sm"><Plus className="size-4 mr-1.5" />Create Role</Button></>} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard icon={Shield} label="Total Roles" value={ROLES.length} tone="blue" />
        <KPICard icon={CheckCircle2} label="System Roles" value={ROLES.filter((r) => r.isSystem).length} tone="green" />
        <KPICard icon={Users} label="Total Assignments" value={ROLES.reduce((a, r) => a + r.userCount, 0)} tone="purple" />
        <KPICard icon={Lock} label="Platform-Level" value={ROLES.filter((r) => r.level === "Platform").length} tone="cyan" />
      </div>

      <div className="space-y-4">
        {ROLES.map((role) => (
          <div key={role.id} className="rounded-xl border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`grid size-10 place-items-center rounded-lg ${role.level === "Platform" ? "bg-[#0052CC]/10 text-[#0052CC]" : role.level === "Organization" ? "bg-purple-50 text-purple-600" : "bg-emerald-50 text-emerald-600"}`}>
                  <Shield className="size-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[var(--text-primary,#172B4D)]">{role.name}</span>
                    {role.isSystem && <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-[var(--text-secondary,#6B778C)]">System</span>}
                    <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${role.level === "Platform" ? "bg-blue-50 text-blue-600" : role.level === "Organization" ? "bg-purple-50 text-purple-600" : "bg-emerald-50 text-emerald-600"}`}>{role.level}</span>
                  </div>
                  <div className="text-xs text-[var(--text-secondary,#6B778C)]">{role.userCount} users assigned · {role.permissions.length} modules</div>
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="size-7"><Eye className="size-3.5" /></Button>
                {!role.isSystem && <Button variant="ghost" size="icon" className="size-7"><Edit3 className="size-3.5" /></Button>}
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {role.permissions.map((p) => (
                <span key={p.module} className="rounded-lg bg-gray-50 px-2 py-1 text-[10px] text-[var(--text-secondary,#6B778C)]">
                  <span className="font-medium text-[var(--text-primary,#172B4D)]">{p.module}</span>:{p.actions.join(",")}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Section title="Permission Matrix" subtitle="Module access by role">
        <div className="rounded-xl border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[var(--border,#DFE1E6)] bg-gray-50/50">
                  <th className="px-3 py-2 text-left font-semibold text-[var(--text-secondary,#6B778C)]">Module</th>
                  {ROLES.map((r) => <th key={r.id} className="px-3 py-2 text-center font-semibold text-[var(--text-secondary,#6B778C)]">{r.name.substring(0, 8)}</th>)}
                </tr>
              </thead>
              <tbody>
                {modules.map((mod) => (
                  <tr key={mod} className="border-b border-[var(--border,#DFE1E6)] last:border-0">
                    <td className="px-3 py-2 font-medium text-[var(--text-primary,#172B4D)]">{mod}</td>
                    {ROLES.map((r) => {
                      const has = r.permissions.some((p) => p.module === mod || p.module === "All");
                      return <td key={r.id} className="px-3 py-2 text-center">{has ? <CheckCircle2 className="mx-auto size-3.5 text-emerald-500" /> : <span className="inline-block size-3.5 rounded-full bg-gray-100" />}</td>;
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Section>
    </div>
  );
}

/* ── 07. Subscription & Licensing ─────────────────────────────────────────── */
function SubscriptionLicensing() {
  return (
    <div className="space-y-6">
      <PageHeader title="Subscription & Licensing" subtitle="Manage plans, billing & usage across organizations" icon={CreditCard}
        breadcrumb={["Super Admin", "Subscriptions"]}
        actions={<><Button variant="outline" size="sm"><Download className="size-4 mr-1.5" />Invoices</Button><Button size="sm"><Plus className="size-4 mr-1.5" />Create Plan</Button></>} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard icon={CreditCard} label="Monthly Revenue" value={formatCurrency(PLATFORM_KPI.monthlyRevenue)} trend="up" trendValue={`+${PLATFORM_KPI.monthlyRevenueGrowth}%`} tone="green" />
        <KPICard icon={Building2} label="Enterprise Plans" value={SUBSCRIPTIONS.filter((s) => s.plan === "Enterprise").length} tone="blue" />
        <KPICard icon={Clock} label="Trial Accounts" value={SUBSCRIPTIONS.filter((s) => s.trialEnds).length} tone="info" />
        <KPICard icon={Database} label="Storage Used" value={formatBytes(PLATFORM_KPI.storageUsed)} tone="purple" />
      </div>

      <div className="space-y-4">
        {SUBSCRIPTIONS.map((sub) => {
          const org = ORGANIZATIONS.find((o) => o.id === sub.orgId);
          if (!org) return null;
          return (
            <div key={sub.orgId} className="rounded-xl border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid size-12 place-items-center rounded-xl text-sm font-bold text-white" style={{ backgroundColor: org.primaryColor }}>{org.logo}</div>
                  <div>
                    <div className="font-semibold text-[var(--text-primary,#172B4D)]">{org.name}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <StatusPill label={sub.plan} tone={sub.plan === "Enterprise" ? "success" : sub.plan === "Professional" ? "info" : "warning"} />
                      <span className="text-xs text-[var(--text-secondary,#6B778C)]">{sub.billingCycle}</span>
                      {sub.trialEnds && <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-amber-600">Trial ends {sub.trialEnds}</span>}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-[var(--text-primary,#172B4D)]">{formatCurrency(sub.monthlyAmount)}<span className="text-sm font-normal text-[var(--text-secondary,#6B778C)]">/mo</span></div>
                  <div className="text-xs text-[var(--text-secondary,#6B778C)]">Renews {sub.renewalDate}</div>
                </div>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-4">
                <div>
                  <HealthBar value={sub.storageUsed} max={sub.storageTotal} label={`Storage (${formatBytes(sub.storageUsed)} / ${formatBytes(sub.storageTotal)})`} />
                </div>
                <div>
                  <HealthBar value={sub.activeUsers} max={sub.userLimit} label={`Users (${sub.activeUsers.toLocaleString()} / ${sub.userLimit.toLocaleString()})`} />
                </div>
                <div>
                  <HealthBar value={sub.apiCalls} max={sub.apiLimit} label={`API (${(sub.apiCalls / 1000000).toFixed(1)}M / ${(sub.apiLimit / 1000000).toFixed(0)}M)`} />
                </div>
                <div>
                  <div className="text-xs text-[var(--text-secondary,#6B778C)] mb-1">Licensed Modules</div>
                  <div className="flex flex-wrap gap-1">
                    {sub.licensedModules.slice(0, 4).map((m) => <span key={m} className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-[var(--text-secondary,#6B778C)]">{m}</span>)}
                    {sub.licensedModules.length > 4 && <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-[var(--text-secondary,#6B778C)]">+{sub.licensedModules.length - 4}</span>}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── 08. Feature Management ───────────────────────────────────────────────── */
function FeatureManagement() {
  const categories = [...new Set(FEATURES.map((f) => f.category))];
  return (
    <div className="space-y-6">
      <PageHeader title="Feature Management" subtitle="Enable, disable and configure platform features" icon={Zap}
        breadcrumb={["Super Admin", "Features"]}
        actions={<><Button variant="outline" size="sm"><RefreshCw className="size-4 mr-1.5" />Sync Features</Button><Button size="sm"><Plus className="size-4 mr-1.5" />Add Feature</Button></>} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard icon={Zap} label="Total Features" value={FEATURES.length} tone="blue" />
        <KPICard icon={CheckCircle2} label="Enabled" value={FEATURES.filter((f) => f.status === "Enabled").length} tone="green" />
        <KPICard icon={Brain} label="AI-Powered" value={FEATURES.filter((f) => f.aiPowered).length} tone="purple" />
        <KPICard icon={Star} label="Beta" value={FEATURES.filter((f) => f.beta).length} tone="info" />
      </div>

      {categories.map((cat) => (
        <Section key={cat} title={`${cat} Features`} subtitle={`${FEATURES.filter((f) => f.category === cat).length} features`}>
          <div className="space-y-3">
            {FEATURES.filter((f) => f.category === cat).map((f) => <FeatureFlagCard key={f.id} feature={f} />)}
          </div>
        </Section>
      ))}
    </div>
  );
}

/* ── 09. Master Patient Index ─────────────────────────────────────────────── */
function MasterPatientIndex() {
  const [search, setSearch] = useState("");
  const filtered = MPI_PATIENTS.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.uhid.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="space-y-6">
      <PageHeader title="Master Patient Index" subtitle="Cross-hospital patient identity management" icon={Search}
        breadcrumb={["Super Admin", "MPI"]}
        actions={<><Button variant="outline" size="sm"><Download className="size-4 mr-1.5" />Export</Button><Button variant="outline" size="sm"><RefreshCw className="size-4 mr-1.5" />Run Dedup</Button></>} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard icon={Users} label="Total Patients" value={MPI_PATIENTS.length.toLocaleString()} tone="blue" />
        <KPICard icon={CheckCircle2} label="Matched" value={MPI_PATIENTS.filter((p) => p.status === "Matched").length} tone="green" />
        <KPICard icon={AlertTriangle} label="Potential Duplicates" value={MPI_PATIENTS.filter((p) => p.status === "Potential Duplicate").length} tone="amber" />
        <KPICard icon={AlertCircle} label="Unmerged" value={MPI_PATIENTS.filter((p) => p.status === "Unmerged").length} tone="red" />
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--text-secondary,#6B778C)]" />
          <Input placeholder="Search by name, UHID, Aadhaar…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Button variant="outline" size="sm"><Filter className="size-4 mr-1.5" />Filters</Button>
      </div>

      <div className="rounded-xl border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border,#DFE1E6)] bg-gray-50/50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary,#6B778C)]">Patient</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary,#6B778C)]">UHID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary,#6B778C)]">Hospitals</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary,#6B778C)]">Visits</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary,#6B778C)]">Duplicates</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary,#6B778C)]">Confidence</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary,#6B778C)]">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-[var(--border,#DFE1E6)] last:border-0 hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-[var(--text-primary,#172B4D)]">{p.name}</div>
                    <div className="text-xs text-[var(--text-secondary,#6B778C)]">{p.gender} · {p.dob}</div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-[var(--text-primary,#172B4D)]">{p.uhid}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">{p.hospitals.map((h) => <span key={h} className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-[var(--text-secondary,#6B778C)]">{h}</span>)}</div>
                  </td>
                  <td className="px-4 py-3 text-[var(--text-primary,#172B4D)]">{p.totalVisits}</td>
                  <td className="px-4 py-3">
                    {p.duplicates > 0 ? <span className="rounded bg-amber-50 px-1.5 py-0.5 text-xs font-medium text-amber-600">{p.duplicates}</span> : <span className="text-xs text-[var(--text-secondary,#6B778C)]">0</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <HealthBar value={p.confidenceScore} max={100} showValue={false} />
                      <span className="text-xs font-medium text-[var(--text-primary,#172B4D)]">{p.confidenceScore}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3"><StatusPill label={p.status} tone={p.status === "Matched" ? "success" : p.status === "Potential Duplicate" ? "warning" : p.status === "Unmerged" ? "danger" : "info"} /></td>
                  <td className="px-4 py-3"><Button variant="ghost" size="icon" className="size-7"><MoreHorizontal className="size-4" /></Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ── 10. Cross-Hospital Transfers ─────────────────────────────────────────── */
function CrossHospitalTransfers() {
  return (
    <div className="space-y-6">
      <PageHeader title="Cross-Hospital Transfers" subtitle="Patient transfer requests across hospital network" icon={ArrowRightLeft}
        breadcrumb={["Super Admin", "Transfers"]}
        actions={<><Button variant="outline" size="sm"><Download className="size-4 mr-1.5" />Export</Button><Button size="sm"><Plus className="size-4 mr-1.5" />New Transfer</Button></>} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard icon={ArrowRightLeft} label="Total Transfers" value={TRANSFERS.length} tone="blue" />
        <KPICard icon={Clock} label="Pending" value={TRANSFERS.filter((t) => t.status === "Pending").length} tone="amber" />
        <KPICard icon={Activity} label="In Transit" value={TRANSFERS.filter((t) => t.status === "In Transit").length} tone="info" />
        <KPICard icon={CheckCircle2} label="Completed" value={TRANSFERS.filter((t) => t.status === "Completed").length} tone="green" />
      </div>

      <div className="space-y-4">
        {TRANSFERS.map((t) => <TransferCard key={t.id} transfer={t} />)}
      </div>
    </div>
  );
}

/* ── 11. Global Inventory ─────────────────────────────────────────────────── */
function GlobalInventoryScreen() {
  const [search, setSearch] = useState("");
  const filtered = GLOBAL_INVENTORY.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="space-y-6">
      <PageHeader title="Global Inventory" subtitle="Inventory monitoring across all organizations and hospitals" icon={Package}
        breadcrumb={["Super Admin", "Global Inventory"]}
        actions={<><Button variant="outline" size="sm"><Download className="size-4 mr-1.5" />Export</Button><Button variant="outline" size="sm"><RefreshCw className="size-4 mr-1.5" />Refresh</Button></>} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard icon={Package} label="Total Items" value={GLOBAL_INVENTORY.length} tone="blue" />
        <KPICard icon={CheckCircle2} label="OK Stock" value={GLOBAL_INVENTORY.filter((i) => i.status === "OK").length} tone="green" />
        <KPICard icon={AlertTriangle} label="Low Stock" value={GLOBAL_INVENTORY.filter((i) => i.status === "Low").length} tone="amber" />
        <KPICard icon={AlertCircle} label="Critical" value={GLOBAL_INVENTORY.filter((i) => i.status === "Critical").length} tone="red" />
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--text-secondary,#6B778C)]" />
          <Input placeholder="Search inventory…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Button variant="outline" size="sm"><Filter className="size-4 mr-1.5" />Filters</Button>
      </div>

      <div className="rounded-xl border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border,#DFE1E6)] bg-gray-50/50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary,#6B778C)]">Item</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary,#6B778C)]">Category</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary,#6B778C)]">Organization</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary,#6B778C)]">Hospital</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary,#6B778C)]">Stock</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary,#6B778C)]">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary,#6B778C)]">Shared</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-b border-[var(--border,#DFE1E6)] last:border-0 hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-[var(--text-primary,#172B4D)]">{item.name}</div>
                    <div className="text-xs text-[var(--text-secondary,#6B778C)]">₹{item.unitCost}/{item.unit}</div>
                  </td>
                  <td className="px-4 py-3"><span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-[var(--text-secondary,#6B778C)]">{item.category}</span></td>
                  <td className="px-4 py-3 text-[var(--text-primary,#172B4D)]">{item.orgName}</td>
                  <td className="px-4 py-3 text-[var(--text-primary,#172B4D)]">{item.hospitalName}</td>
                  <td className="px-4 py-3">
                    <div className="text-[var(--text-primary,#172B4D)]">{item.currentStock.toLocaleString()} / {item.maxStock.toLocaleString()} {item.unit}</div>
                    <HealthBar value={item.currentStock} max={item.maxStock} showValue={false} />
                  </td>
                  <td className="px-4 py-3"><StatusPill label={item.status} tone={inventoryStatusTone(item.status)} /></td>
                  <td className="px-4 py-3">{item.sharedWarehouse ? <Globe className="size-4 text-[#0052CC]" /> : <span className="text-xs text-[var(--text-secondary,#6B778C)]">—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ── 12. Global Analytics ─────────────────────────────────────────────────── */
function GlobalAnalytics() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
  const revenueData = [22.1, 23.4, 24.8, 25.2, 26.1, 27.3, 28.1];
  const patientData = [72, 75, 78, 80, 82, 83, 84];
  const occupancyData = [74, 76, 78, 77, 79, 80, 81];
  return (
    <div className="space-y-6">
      <PageHeader title="Global Analytics" subtitle="Cross-organization performance and insights" icon={BarChart3}
        breadcrumb={["Super Admin", "Analytics"]}
        actions={<><Button variant="outline" size="sm"><Download className="size-4 mr-1.5" />Export Report</Button><Button variant="outline" size="sm"><Filter className="size-4 mr-1.5" />Date Range</Button></>} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard icon={Banknote} label="Revenue (Monthly)" value={formatCurrency(PLATFORM_KPI.monthlyRevenue)} trend="up" trendValue={`+${PLATFORM_KPI.monthlyRevenueGrowth}%`} tone="green" />
        <KPICard icon={Heart} label="Patients (Monthly)" value={`${(PLATFORM_KPI.todayPatients * 30 / 1000).toFixed(0)}K`} trend="up" trendValue="+5.4%" tone="blue" />
        <KPICard icon={Bed} label="Avg Bed Occupancy" value="81%" trend="up" trendValue="+2.3%" tone="purple" />
        <KPICard icon={TrendingUp} label="Readmission Rate" value="4.2%" trend="down" trendValue="-0.8%" tone="green" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Section title="Revenue Trend" subtitle="Monthly revenue (₹ in Crores)">
          <div className="rounded-xl border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] p-4 shadow-sm">
            <div className="flex items-end gap-2 h-48">
              {revenueData.map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] font-medium text-[var(--text-primary,#172B4D)]">₹{v}Cr</span>
                  <div className="w-full bg-[#0052CC] rounded-t" style={{ height: `${(v / 30) * 100}%` }} />
                  <span className="text-[10px] text-[var(--text-secondary,#6B778C)]">{months[i]}</span>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section title="Patient Volume Trend" subtitle="Monthly patients (in thousands)">
          <div className="rounded-xl border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] p-4 shadow-sm">
            <div className="flex items-end gap-2 h-48">
              {patientData.map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] font-medium text-[var(--text-primary,#172B4D)]">{v}K</span>
                  <div className="w-full bg-emerald-500 rounded-t" style={{ height: `${(v / 100) * 100}%` }} />
                  <span className="text-[10px] text-[var(--text-secondary,#6B778C)]">{months[i]}</span>
                </div>
              ))}
            </div>
          </div>
        </Section>
      </div>

      <Section title="Organization Performance" subtitle="Revenue and occupancy by organization">
        <div className="rounded-xl border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border,#DFE1E6)] bg-gray-50/50">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary,#6B778C)]">Organization</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary,#6B778C)]">Hospitals</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary,#6B778C)]">Patients</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary,#6B778C)]">Revenue</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary,#6B778C)]">Bed Occupancy</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary,#6B778C)]">Compliance</th>
                </tr>
              </thead>
              <tbody>
                {ORGANIZATIONS.filter((o) => o.status === "Active").map((org) => {
                  const orgHospitals = HOSPITALS.filter((h) => h.orgId === org.id);
                  const avgOccupancy = orgHospitals.length > 0 ? Math.round(orgHospitals.reduce((a, h) => a + h.bedOccupancy, 0) / orgHospitals.length) : 0;
                  return (
                    <tr key={org.id} className="border-b border-[var(--border,#DFE1E6)] last:border-0 hover:bg-gray-50/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="grid size-8 place-items-center rounded-lg text-[10px] font-bold text-white" style={{ backgroundColor: org.primaryColor }}>{org.logo}</div>
                          <span className="font-medium text-[var(--text-primary,#172B4D)]">{org.shortName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[var(--text-primary,#172B4D)]">{org.hospitals}</td>
                      <td className="px-4 py-3 text-[var(--text-primary,#172B4D)]">{(org.patients / 1000).toFixed(0)}K</td>
                      <td className="px-4 py-3 text-[var(--text-primary,#172B4D)]">{formatCurrency(org.monthlyRevenue)}/mo</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2"><HealthBar value={avgOccupancy} max={100} showValue={false} /><span className="text-xs font-medium">{avgOccupancy}%</span></div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2"><HealthBar value={org.complianceScore} max={100} showValue={false} /><span className="text-xs font-medium">{org.complianceScore}%</span></div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      <Section title="Bed Occupancy Trend" subtitle="Monthly average occupancy">
        <div className="rounded-xl border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] p-4 shadow-sm">
          <div className="flex items-end gap-2 h-40">
            {occupancyData.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] font-medium text-[var(--text-primary,#172B4D)]">{v}%</span>
                <div className="w-full bg-purple-500 rounded-t" style={{ height: `${v}%` }} />
                <span className="text-[10px] text-[var(--text-secondary,#6B778C)]">{months[i]}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
}

/* ── 13. Security Center ──────────────────────────────────────────────────── */
function SecurityCenter() {
  return (
    <div className="space-y-6">
      <PageHeader title="Security Center" subtitle="Identity, access & threat management" icon={Lock}
        breadcrumb={["Super Admin", "Security"]}
        actions={<Button variant="outline" size="sm"><Download className="size-4 mr-1.5" />Security Report</Button>} />

      <SecurityBanner score={PLATFORM_KPI.securityScore} alerts={SECURITY_EVENTS.filter((s) => s.status !== "Resolved").length} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard icon={Shield} label="Security Score" value={`${PLATFORM_KPI.securityScore}/100`} tone="green" />
        <KPICard icon={AlertTriangle} label="Open Events" value={SECURITY_EVENTS.filter((s) => s.status === "Open").length} tone="red" />
        <KPICard icon={Lock} label="MFA Coverage" value={`${Math.round(PLATFORM_USERS.filter((u) => u.mfaEnabled).length / PLATFORM_USERS.length * 100)}%`} tone="blue" />
        <KPICard icon={Key} label="Active SSO" value="3" tone="purple" />
      </div>

      <Section title="Security Events" subtitle="Active threats and investigations">
        <div className="rounded-xl border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border,#DFE1E6)] bg-gray-50/50">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary,#6B778C)]">Event</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary,#6B778C)]">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary,#6B778C)]">Severity</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary,#6B778C)]">Source IP</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary,#6B778C)]">Time</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary,#6B778C)]">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {SECURITY_EVENTS.map((e) => (
                  <tr key={e.id} className="border-b border-[var(--border,#DFE1E6)] last:border-0 hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-[var(--text-primary,#172B4D)]">{e.description.substring(0, 60)}…</div>
                    </td>
                    <td className="px-4 py-3"><span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-[var(--text-secondary,#6B778C)]">{e.type}</span></td>
                    <td className="px-4 py-3"><StatusPill label={e.severity} tone={securitySeverityTone(e.severity)} /></td>
                    <td className="px-4 py-3 font-mono text-xs text-[var(--text-primary,#172B4D)]">{e.sourceIp}</td>
                    <td className="px-4 py-3 text-xs text-[var(--text-secondary,#6B778C)]">{timeAgo(e.timestamp)}</td>
                    <td className="px-4 py-3"><StatusPill label={e.status} tone={e.status === "Resolved" ? "success" : e.status === "Mitigated" ? "info" : e.status === "Investigating" ? "warning" : "danger"} /></td>
                    <td className="px-4 py-3"><Button variant="ghost" size="icon" className="size-7"><Eye className="size-3.5" /></Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      <div className="grid gap-4 lg:grid-cols-2">
        <Section title="Identity & Access" subtitle="SSO, MFA & device policies">
          <div className="space-y-3">
            {[
              { name: "Single Sign-On (SSO)", desc: "SAML 2.0 / OAuth 2.0 identity providers", status: "Enabled", count: "3 providers" },
              { name: "Multi-Factor Authentication", desc: "TOTP, SMS, Email, Push notification", status: "Required", count: "95% coverage" },
              { name: "Session Management", desc: "Concurrent session limits & timeout policies", status: "Active", count: "30 min timeout" },
              { name: "IP Restrictions", desc: "Whitelist trusted IP ranges", status: "Configured", count: "12 ranges" },
              { name: "Device Trust", desc: "Device fingerprinting & compliance checks", status: "Active", count: "2,847 devices" },
            ].map((item) => (
              <div key={item.name} className="flex items-center justify-between rounded-lg border border-[var(--border,#DFE1E6)] p-3">
                <div>
                  <div className="text-sm font-medium text-[var(--text-primary,#172B4D)]">{item.name}</div>
                  <div className="text-xs text-[var(--text-secondary,#6B778C)]">{item.desc}</div>
                </div>
                <div className="text-right">
                  <StatusPill label={item.status} tone="success" />
                  <div className="mt-0.5 text-[10px] text-[var(--text-secondary,#6B778C)]">{item.count}</div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Compliance Status" subtitle="Regulatory compliance across the platform">
          <div className="space-y-3">
            {[
              { name: "NABH Compliance", score: 96, status: "Compliant" },
              { name: "ABDM Integration", score: 92, status: "Compliant" },
              { name: "Data Privacy (DPDPA)", score: 88, status: "In Progress" },
              { name: "ISO 27001", score: 94, status: "Certified" },
              { name: "HIPAA Equivalent", score: 91, status: "Compliant" },
            ].map((item) => (
              <div key={item.name} className="rounded-lg border border-[var(--border,#DFE1E6)] p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-[var(--text-primary,#172B4D)]">{item.name}</span>
                  <StatusPill label={item.status} tone={item.status === "Compliant" || item.status === "Certified" ? "success" : "info"} />
                </div>
                <HealthBar value={item.score} max={100} label={`Score: ${item.score}/100`} />
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}

/* ── 14. Audit Logs ───────────────────────────────────────────────────────── */
function AuditLogsScreen() {
  const [search, setSearch] = useState("");
  const filtered = AUDIT_LOGS.filter((l) => l.userName.toLowerCase().includes(search.toLowerCase()) || l.details.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="space-y-6">
      <PageHeader title="Audit Logs" subtitle="Platform activity & security event trail" icon={ScrollText}
        breadcrumb={["Super Admin", "Audit Logs"]}
        actions={<><Button variant="outline" size="sm"><Download className="size-4 mr-1.5" />Export Logs</Button><Button variant="outline" size="sm"><Filter className="size-4 mr-1.5" />Filters</Button></>} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard icon={ScrollText} label="Total Events" value={AUDIT_LOGS.length} tone="blue" />
        <KPICard icon={AlertCircle} label="Critical" value={AUDIT_LOGS.filter((l) => l.severity === "Critical").length} tone="red" />
        <KPICard icon={AlertTriangle} label="Warnings" value={AUDIT_LOGS.filter((l) => l.severity === "Warning").length} tone="amber" />
        <KPICard icon={CheckCircle2} label="Info" value={AUDIT_LOGS.filter((l) => l.severity === "Info").length} tone="green" />
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--text-secondary,#6B778C)]" />
        <Input placeholder="Search audit logs…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="rounded-xl border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border,#DFE1E6)] bg-gray-50/50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary,#6B778C)]">Timestamp</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary,#6B778C)]">User</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary,#6B778C)]">Action</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary,#6B778C)]">Resource</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary,#6B778C)]">Details</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary,#6B778C)]">IP</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary,#6B778C)]">Severity</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((log) => (
                <tr key={log.id} className="border-b border-[var(--border,#DFE1E6)] last:border-0 hover:bg-gray-50/50">
                  <td className="px-4 py-3 text-xs text-[var(--text-secondary,#6B778C)] whitespace-nowrap">{new Date(log.timestamp).toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-[var(--text-primary,#172B4D)]">{log.userName}</div>
                  </td>
                  <td className="px-4 py-3"><span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-medium text-[var(--text-secondary,#6B778C)]">{log.action}</span></td>
                  <td className="px-4 py-3 text-[var(--text-primary,#172B4D)]">{log.resource}</td>
                  <td className="px-4 py-3 text-xs text-[var(--text-secondary,#6B778C)] max-w-xs truncate">{log.details}</td>
                  <td className="px-4 py-3 font-mono text-xs text-[var(--text-primary,#172B4D)]">{log.ipAddress}</td>
                  <td className="px-4 py-3"><StatusPill label={log.severity} tone={log.severity === "Critical" ? "danger" : log.severity === "Warning" ? "warning" : "info"} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ── 15. API & Integration Center ─────────────────────────────────────────── */
function ApiIntegrationCenter() {
  return (
    <div className="space-y-6">
      <PageHeader title="API & Integration Center" subtitle="FHIR, HL7, REST APIs & third-party integrations" icon={Webhook}
        breadcrumb={["Super Admin", "API Center"]}
        actions={<><Button variant="outline" size="sm"><Download className="size-4 mr-1.5" />API Docs</Button><Button size="sm"><Plus className="size-4 mr-1.5" />Create API Key</Button></>} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard icon={Key} label="API Keys" value={API_KEYS.length} tone="blue" />
        <KPICard icon={CheckCircle2} label="Active Keys" value={API_KEYS.filter((k) => k.status === "Active").length} tone="green" />
        <KPICard icon={Webhook} label="Integrations" value={INTEGRATIONS.length} tone="purple" />
        <KPICard icon={Activity} label="Connected" value={INTEGRATIONS.filter((i) => i.status === "Connected").length} tone="cyan" />
      </div>

      <Section title="API Keys" subtitle="Manage API access keys">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {API_KEYS.map((k) => <ApiKeyCard key={k.id} apiKey={k} />)}
        </div>
      </Section>

      <Section title="Integrations" subtitle="Active system integrations and data bridges">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {INTEGRATIONS.map((i) => <IntegrationCard key={i.id} integration={i} />)}
        </div>
      </Section>

      <Section title="Usage Analytics" subtitle="API consumption and rate limits">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ORGANIZATIONS.filter((o) => o.status === "Active").map((org) => {
            const sub = SUBSCRIPTIONS.find((s) => s.orgId === org.id);
            return (
              <div key={org.id} className="rounded-xl border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="grid size-8 place-items-center rounded-lg text-[10px] font-bold text-white" style={{ backgroundColor: org.primaryColor }}>{org.logo}</div>
                  <span className="font-medium text-[var(--text-primary,#172B4D)]">{org.shortName}</span>
                </div>
                {sub && (
                  <div className="space-y-2">
                    <HealthBar value={sub.apiCalls} max={sub.apiLimit} label={`API Calls: ${(sub.apiCalls / 1000000).toFixed(1)}M / ${(sub.apiLimit / 1000000).toFixed(0)}M`} />
                    <HealthBar value={sub.storageUsed} max={sub.storageTotal} label={`Storage: ${formatBytes(sub.storageUsed)} / ${formatBytes(sub.storageTotal)}`} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Section>
    </div>
  );
}

/* ── 16. White Label Settings ─────────────────────────────────────────────── */
function WhiteLabelSettings() {
  const [selectedOrg, setSelectedOrg] = useState("ORG-004");
  const org = ORGANIZATIONS.find((o) => o.id === selectedOrg);
  return (
    <div className="space-y-6">
      <PageHeader title="White Label Settings" subtitle="Custom branding per organization" icon={Palette}
        breadcrumb={["Super Admin", "White Label"]}
        actions={<Button size="sm"><CheckCircle2 className="size-4 mr-1.5" />Save Changes</Button>} />

      <div className="flex items-center gap-3">
        <span className="text-sm text-[var(--text-secondary,#6B778C)]">Organization:</span>
        <select value={selectedOrg} onChange={(e) => setSelectedOrg(e.target.value)} className="rounded-lg border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] px-3 py-2 text-sm text-[var(--text-primary,#172B4D)]">
          {ORGANIZATIONS.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
        </select>
      </div>

      {org && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Section title="Brand Identity" subtitle="Logo, colors & typography">
            <div className="space-y-4 rounded-xl border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] p-5 shadow-sm">
              <div>
                <label className="text-sm font-medium text-[var(--text-primary,#172B4D)]">Organization Logo</label>
                <div className="mt-2 flex items-center gap-4">
                  <div className="grid size-20 place-items-center rounded-xl text-2xl font-bold text-white" style={{ backgroundColor: org.primaryColor }}>{org.logo}</div>
                  <Button variant="outline" size="sm"><Upload className="size-4 mr-1.5" />Upload Logo</Button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-[var(--text-primary,#172B4D)]">Primary Color</label>
                <div className="mt-2 flex items-center gap-3">
                  <div className="size-10 rounded-lg border border-[var(--border,#DFE1E6)]" style={{ backgroundColor: org.primaryColor }} />
                  <Input defaultValue={org.primaryColor} className="w-32 font-mono" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-[var(--text-primary,#172B4D)]">Custom Domain</label>
                <Input defaultValue={org.domain} className="mt-2" />
              </div>
              <div>
                <label className="text-sm font-medium text-[var(--text-primary,#172B4D)]">Organization Name</label>
                <Input defaultValue={org.name} className="mt-2" />
              </div>
            </div>
          </Section>

          <Section title="Login Screen Preview" subtitle="How users see the login page">
            <div className="rounded-xl border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] p-6 shadow-sm">
              <div className="mx-auto max-w-sm space-y-6">
                <div className="text-center">
                  <div className="mx-auto grid size-16 place-items-center rounded-2xl text-2xl font-bold text-white" style={{ backgroundColor: org.primaryColor }}>{org.logo}</div>
                  <h2 className="mt-3 text-lg font-bold text-[var(--text-primary,#172B4D)]">{org.name}</h2>
                  <p className="text-sm text-[var(--text-secondary,#6B778C)]">Healthcare Platform Login</p>
                </div>
                <div className="space-y-3">
                  <Input placeholder="Email address" disabled />
                  <Input placeholder="Password" type="password" disabled />
                  <Button className="w-full" disabled style={{ backgroundColor: org.primaryColor }}>Sign In</Button>
                </div>
                <p className="text-center text-xs text-[var(--text-secondary,#6B778C)]">Powered by HealthcarePlatform.in</p>
              </div>
            </div>
          </Section>

          <Section title="Email Branding" subtitle="Customize email templates">
            <div className="space-y-3 rounded-xl border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] p-5 shadow-sm">
              {["Welcome Email", "Password Reset", "Appointment Confirmation", "Lab Report Ready", "Invoice Generated"].map((tpl) => (
                <div key={tpl} className="flex items-center justify-between rounded-lg border border-[var(--border,#DFE1E6)] p-3">
                  <div>
                    <div className="text-sm font-medium text-[var(--text-primary,#172B4D)]">{tpl}</div>
                    <div className="text-xs text-[var(--text-secondary,#6B778C)]">Customized with org branding</div>
                  </div>
                  <Button variant="ghost" size="sm"><Edit3 className="size-4" /></Button>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Mobile App Branding" subtitle="White-label mobile configuration">
            <div className="space-y-3 rounded-xl border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] p-5 shadow-sm">
              {[
                { label: "App Icon", value: "Custom" },
                { label: "Splash Screen", value: "Custom" },
                { label: "App Name", value: org.shortName + " Health" },
                { label: "Push Notification Tone", value: org.primaryColor },
                { label: "iOS Bundle ID", value: `in.${org.shortName.toLowerCase()}.health` },
                { label: "Android Package", value: `in.${org.shortName.toLowerCase()}.health` },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-lg border border-[var(--border,#DFE1E6)] p-3">
                  <span className="text-sm text-[var(--text-primary,#172B4D)]">{item.label}</span>
                  <span className="text-sm text-[var(--text-secondary,#6B778C)]">{item.value}</span>
                </div>
              ))}
            </div>
          </Section>
        </div>
      )}
    </div>
  );
}

function Upload({ className }: { className?: string }) {
  return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></svg>;
}

/* ── 17. Disaster Recovery & Platform Monitoring ──────────────────────────── */
function DisasterRecovery() {
  return (
    <div className="space-y-6">
      <PageHeader title="Disaster Recovery & Platform Monitoring" subtitle="Backups, infrastructure & service health" icon={Server}
        breadcrumb={["Super Admin", "DR & Monitoring"]}
        actions={<><Button variant="outline" size="sm"><RefreshCw className="size-4 mr-1.5" />Run Recovery Test</Button><Button variant="outline" size="sm"><Download className="size-4 mr-1.5" />Report</Button></>} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard icon={Server} label="Platform Uptime" value={`${PLATFORM_KPI.platformUptime}%`} tone="green" />
        <KPICard icon={Database} label="Backups Healthy" value={BACKUPS.filter((b) => b.status === "Healthy").length} tone="blue" />
        <KPICard icon={AlertTriangle} label="Warnings" value={BACKUPS.filter((b) => b.status === "Warning").length} tone="amber" />
        <KPICard icon={HardDrive} label="Total Backup Size" value={`${BACKUPS.reduce((a, b) => a + b.size, 0)} GB`} tone="purple" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SystemHealthWidget services={SYSTEM_HEALTH} />
        </div>
        <Section title="Infrastructure" subtitle="Cloud resources">
          <div className="space-y-3 rounded-xl border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] p-4 shadow-sm">
            {[
              { icon: Cloud, label: "AWS ap-south-1", status: "Operational", detail: "Primary region" },
              { icon: Database, label: "RDS Cluster", status: "Operational", detail: "3 instances, Multi-AZ" },
              { icon: HardDrive, label: "EBS Volumes", status: "Operational", detail: "20.5 TB provisioned" },
              { icon: Globe, label: "CloudFront CDN", status: "Operational", detail: "12 edge locations" },
              { icon: Shield, label: "WAF / Shield", status: "Active", detail: "DDoS protection" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-lg border border-[var(--border,#DFE1E6)] p-3">
                <div className="flex items-center gap-2">
                  <item.icon className="size-4 text-[#0052CC]" />
                  <div>
                    <div className="text-sm font-medium text-[var(--text-primary,#172B4D)]">{item.label}</div>
                    <div className="text-[10px] text-[var(--text-secondary,#6B778C)]">{item.detail}</div>
                  </div>
                </div>
                <StatusPill label={item.status} tone="success" />
              </div>
            ))}
          </div>
        </Section>
      </div>

      <Section title="Backup Status" subtitle="Automated backup records">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BACKUPS.map((b) => <BackupCard key={b.id} backup={b} />)}
        </div>
      </Section>

      <Section title="Recovery Test History" subtitle="Disaster recovery test results">
        <div className="rounded-xl border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border,#DFE1E6)] bg-gray-50/50">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary,#6B778C)]">Test Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary,#6B778C)]">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary,#6B778C)]">RTO Achieved</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary,#6B778C)]">RPO Achieved</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary,#6B778C)]">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { date: "2026-07-20", type: "Full Restore", rto: "18 min", rpo: "< 5 min", status: "Passed" },
                  { date: "2026-07-13", type: "Database Failover", rto: "45 sec", rpo: "0 (sync)", status: "Passed" },
                  { date: "2026-07-06", type: "Partial Restore", rto: "12 min", rpo: "< 2 min", status: "Passed" },
                  { date: "2026-06-29", type: "Full Restore", rto: "22 min", rpo: "< 5 min", status: "Passed" },
                  { date: "2026-06-15", type: "Cross-Region Failover", rto: "8 min", rpo: "< 1 min", status: "Passed" },
                ].map((test, i) => (
                  <tr key={i} className="border-b border-[var(--border,#DFE1E6)] last:border-0 hover:bg-gray-50/50">
                    <td className="px-4 py-3 text-[var(--text-primary,#172B4D)]">{test.date}</td>
                    <td className="px-4 py-3"><span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-[var(--text-secondary,#6B778C)]">{test.type}</span></td>
                    <td className="px-4 py-3 text-[var(--text-primary,#172B4D)]">{test.rto}</td>
                    <td className="px-4 py-3 text-[var(--text-primary,#172B4D)]">{test.rpo}</td>
                    <td className="px-4 py-3"><StatusPill label={test.status} tone="success" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Section>
    </div>
  );
}

/* ── 18. Workflow Complete ────────────────────────────────────────────────── */
function WorkflowComplete({ onNavigate }: { onNavigate: (s: string) => void }) {
  return (
    <div className="space-y-6">
      <PageHeader title="Workflow Complete" subtitle="SaaS administration workflow summary" icon={CheckCircle2}
        breadcrumb={["Super Admin", "Workflow Complete"]} />

      <div className="mx-auto max-w-2xl space-y-6">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
          <div className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-100">
            <CheckCircle2 className="size-8 text-emerald-600" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-[var(--text-primary,#172B4D)]">Configuration Saved Successfully</h2>
          <p className="mt-2 text-sm text-[var(--text-secondary,#6B778C)]">All administrative changes have been applied across the platform and audit-logged.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-lg bg-blue-50 text-blue-600"><BarChart3 className="size-5" /></div>
              <div>
                <div className="text-sm font-medium text-[var(--text-primary,#172B4D)]">Analytics Updated</div>
                <div className="text-xs text-[var(--text-secondary,#6B778C)]">Dashboards refreshed with latest data</div>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-lg bg-purple-50 text-purple-600"><ScrollText className="size-5" /></div>
              <div>
                <div className="text-sm font-medium text-[var(--text-primary,#172B4D)]">Audit Recorded</div>
                <div className="text-xs text-[var(--text-secondary,#6B778C)]">{AUDIT_LOGS.length + 1} events in audit trail</div>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-lg bg-amber-50 text-amber-600"><Bell className="size-5" /></div>
              <div>
                <div className="text-sm font-medium text-[var(--text-primary,#172B4D)]">Notifications Sent</div>
                <div className="text-xs text-[var(--text-secondary,#6B778C)]">Organization admins notified</div>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-lg bg-emerald-50 text-emerald-600"><Server className="size-5" /></div>
              <div>
                <div className="text-sm font-medium text-[var(--text-primary,#172B4D)]">Platform Healthy</div>
                <div className="text-xs text-[var(--text-secondary,#6B778C)]">{PLATFORM_KPI.platformUptime}% uptime maintained</div>
              </div>
            </div>
          </div>
        </div>

        <Section title="Executive Summary" subtitle="Platform performance at a glance">
          <div className="rounded-xl border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] p-5 shadow-sm space-y-3">
            {[
              { label: "Organizations Managed", value: `${PLATFORM_KPI.totalOrgs} active` },
              { label: "Hospitals Onboarded", value: `${PLATFORM_KPI.totalHospitals} across ${PLATFORM_KPI.totalOrgs} orgs` },
              { label: "Monthly Revenue", value: formatCurrency(PLATFORM_KPI.monthlyRevenue) },
              { label: "Platform Uptime", value: `${PLATFORM_KPI.platformUptime}%` },
              { label: "Security Score", value: `${PLATFORM_KPI.securityScore}/100` },
              { label: "AI Models Active", value: `${PLATFORM_KPI.aiModelsActive} (${PLATFORM_KPI.aiAccuracy}% accuracy)` },
              { label: "API Calls (Monthly)", value: `${(PLATFORM_KPI.totalApiCalls / 1000000).toFixed(1)}M` },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-2.5">
                <span className="text-sm text-[var(--text-secondary,#6B778C)]">{item.label}</span>
                <span className="text-sm font-semibold text-[var(--text-primary,#172B4D)]">{item.value}</span>
              </div>
            ))}
          </div>
        </Section>

        <div className="flex justify-center gap-3">
          <Button variant="outline" onClick={() => onNavigate("global-dashboard")}>Return to Dashboard</Button>
          <Button onClick={() => onNavigate("global-dashboard")}>View Dashboard</Button>
        </div>
      </div>
    </div>
  );
}
