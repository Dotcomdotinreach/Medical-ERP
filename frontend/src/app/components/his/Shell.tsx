import { useState, useMemo, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard, Search, Bell, ChevronRight, ChevronDown, LogOut, Menu, HelpCircle, Command,
  ClipboardPlus, Siren, ChevronsUpDown, Check, Stethoscope, HeartPulse, Microscope, Monitor, Pill, BedDouble, Scissors, Banknote, Package, Smartphone, Ambulance, Shield, Globe, UserCheck, Activity, Baby, Video, Brain, Sparkles, FlaskConical, Network,
} from "lucide-react";
import { Logo } from "../auth/Brand";
import { Avatar } from "./ui";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
  tone?: "danger" | "warning";
  children?: NavItem[];
}

export type Workspace = "reception" | "emergency" | "doctor" | "nurse" | "laboratory" | "radiology" | "pharmacy" | "ipd" | "ot" | "icu" | "billing" | "inventory" | "patient-portal" | "ambulance" | "admin" | "super-admin" | "hrms" | "cssd" | "blood-bank" | "dialysis" | "maternity" | "pediatrics" | "oncology" | "telemedicine" | "cdss" | "ai" | "research" | "interop";

const WORKSPACES: { id: Workspace; label: string; icon: LucideIcon; desc: string }[] = [
  { id: "reception", label: "Reception", icon: ClipboardPlus, desc: "Registration & front desk" },
  { id: "emergency", label: "Emergency Dept.", icon: Siren, desc: "Triage, ambulance & ICU" },
  { id: "doctor", label: "Doctor Workstation", icon: Stethoscope, desc: "EMR & clinical workflow" },
  { id: "nurse", label: "Nurse Workstation", icon: HeartPulse, desc: "Medication & bedside care" },
  { id: "laboratory", label: "Laboratory (LIS)", icon: Microscope, desc: "Lab orders, samples & results" },
  { id: "radiology", label: "Radiology (RIS/PACS)", icon: Monitor, desc: "Imaging, PACS & reporting" },
  { id: "pharmacy", label: "Pharmacy (PMS)", icon: Pill, desc: "Prescriptions, dispensing & inventory" },
  { id: "ipd", label: "IPD / Wards", icon: BedDouble, desc: "Inpatient admissions, beds & discharges" },
  { id: "ot", label: "Operation Theater", icon: Scissors, desc: "Surgery scheduling, periop & PACU" },
  { id: "icu", label: "ICU / Critical Care", icon: HeartPulse, desc: "ICU monitoring, ventilators & care" },
  { id: "billing", label: "Billing & RCM", icon: Banknote, desc: "Billing, insurance & revenue cycle" },
  { id: "inventory", label: "Inventory & SCM", icon: Package, desc: "Inventory, procurement & supply chain" },
  { id: "patient-portal", label: "Patient Portal", icon: Smartphone, desc: "Patient mobile app & portal" },
  { id: "ambulance", label: "Ambulance / EMS", icon: Ambulance, desc: "Emergency response & dispatch" },
  { id: "admin", label: "Admin / Command Center", icon: Shield, desc: "System admin & analytics" },
  { id: "super-admin", label: "Super Admin (SaaS)", icon: Globe, desc: "Multi-hospital SaaS platform" },
  { id: "hrms", label: "HRMS", icon: UserCheck, desc: "Workforce & HR management" },
  { id: "cssd", label: "CSSD", icon: Shield, desc: "Central Sterile Services Dept." },
  { id: "blood-bank", label: "Blood Bank", icon: HeartPulse, desc: "Blood bank & transfusion medicine" },
  { id: "dialysis", label: "Dialysis Center", icon: Activity, desc: "Dialysis & renal care management" },
  { id: "maternity", label: "Maternity & OB", icon: Baby, desc: "Maternity, obstetrics & labor room" },
  { id: "pediatrics", label: "Pediatrics & NICU", icon: Baby, desc: "Pediatrics & neonatal intensive care" },
  { id: "oncology", label: "Oncology", icon: Activity, desc: "Cancer care, chemotherapy & tumor board" },
  { id: "telemedicine", label: "Telemedicine", icon: Video, desc: "Virtual consultations & telehealth" },
  { id: "cdss", label: "CDSS", icon: Brain, desc: "Clinical Decision Support System" },
  { id: "ai", label: "AI Platform", icon: Sparkles, desc: "AI & Predictive Analytics Platform" },
  { id: "research", label: "Research & Trials", icon: FlaskConical, desc: "Clinical Trials Management System" },
  { id: "interop", label: "Interop Hub", icon: Network, desc: "Enterprise Interoperability Hub" },
];

const NOTIFICATIONS = [
  { title: "Code Blue — ICU-01", desc: "Rapid response team paged · Lakshmi Iyer", time: "1m", tone: "text-danger" },
  { title: "Ambulance inbound", desc: "MH-12-AB-4521 · RTA · ETA 4 min · triage RED", time: "3m", tone: "text-danger" },
  { title: "Lab STAT result ready", desc: "Troponin — Rajesh Kumar · elevated", time: "12m", tone: "text-warning" },
];

export const WORKSPACE_ACCESS: Record<string, string[]> = {
  reception: ["receptionist", "admin", "super_admin"],
  emergency: ["receptionist", "doctor", "nurse", "admin", "super_admin"],
  doctor: ["doctor", "admin", "super_admin"],
  nurse: ["nurse", "admin", "super_admin"],
  laboratory: ["lab_tech", "admin", "super_admin"],
  radiology: ["radiologist", "admin", "super_admin"],
  pharmacy: ["pharmacist", "admin", "super_admin"],
  ipd: ["doctor", "nurse", "admin", "super_admin"],
  ot: ["doctor", "nurse", "admin", "super_admin"],
  icu: ["doctor", "nurse", "admin", "super_admin"],
  billing: ["billing", "admin", "super_admin"],
  inventory: ["inventory", "admin", "super_admin"],
  "patient-portal": ["patient", "admin", "super_admin"],
  ambulance: ["nurse", "admin", "super_admin"],
  admin: ["admin", "super_admin"],
  "super-admin": ["super_admin"],
  hrms: ["hr", "admin", "super_admin"],
  cssd: ["nurse", "admin", "super_admin"],
  "blood-bank": ["nurse", "pharmacist", "admin", "super_admin"],
  dialysis: ["doctor", "nurse", "admin", "super_admin"],
  maternity: ["doctor", "nurse", "admin", "super_admin"],
  pediatrics: ["doctor", "nurse", "admin", "super_admin"],
  oncology: ["doctor", "admin", "super_admin"],
  telemedicine: ["doctor", "nurse", "admin", "super_admin"],
  cdss: ["doctor", "nurse", "admin", "super_admin"],
  ai: ["doctor", "admin", "super_admin"],
  research: ["doctor", "admin", "super_admin"],
  interop: ["admin", "super_admin"],
};

export function Shell({
  nav = [], navSecondary = [], sectionLabel, activeId, isActive, onNavigate, breadcrumb = [], children,
  roleName, onSignOut, workspace, onSwitchWorkspace, searchPlaceholder, onSearchFocus,
  onOpenSettings, userRole,
}: {
  nav: NavItem[];
  navSecondary?: NavItem[];
  sectionLabel: string;
  activeId: string;
  isActive?: (id: string) => boolean;
  onNavigate: (id: string) => void;
  breadcrumb: string[];
  children: ReactNode;
  roleName: string;
  onSignOut: () => void;
  workspace: Workspace;
  onSwitchWorkspace: (w: Workspace) => void;
  searchPlaceholder?: string;
  onSearchFocus?: () => void;
  onOpenSettings?: (page: string) => void;
  userRole?: string;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const current = WORKSPACES.find((w) => w.id === workspace) ?? WORKSPACES[0];
  const accessibleWorkspaces = userRole
    ? WORKSPACES.filter((w) => {
        if (userRole === "super_admin") return true;
        const allowed = WORKSPACE_ACCESS[w.id];
        return allowed ? allowed.includes(userRole) : true;
      })
    : WORKSPACES;
  const active = (id: string) => (isActive ? isActive(id) : activeId === id);

  const hasActiveChild = (item: NavItem): boolean => {
    if (item.children) return item.children.some((c) => active(c.id));
    return false;
  };

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleNavClick = (item: NavItem) => {
    const id = item.id;
    if (item.children && item.children.length > 0) {
      toggleExpand(id);
      return;
    }
    if (id === "settings") {
      onOpenSettings?.("profile");
      return;
    }

    const workspaceMap: Record<string, Workspace> = {
      reception: "reception",
      emergency: "emergency",
      doctor: "doctor",
      doctors: "doctor",
      nurse: "nurse",
      nurses: "nurse",
      laboratory: "laboratory",
      lab: "laboratory",
      radiology: "radiology",
      pharmacy: "pharmacy",
      ipd: "ipd",
      ot: "ot",
      icu: "icu",
      billing: "billing",
      inventory: "inventory",
      "patient-portal": "patient-portal",
      ambulance: "ambulance",
      admin: "admin",
      "super-admin": "super-admin",
      hrms: "hrms",
      cssd: "cssd",
      "blood-bank": "blood-bank",
      dialysis: "dialysis",
      maternity: "maternity",
      pediatrics: "pediatrics",
      oncology: "oncology",
      telemedicine: "telemedicine",
      cdss: "cdss",
      ai: "ai",
      research: "research",
      interop: "interop",
    };

    if (workspaceMap[id] && workspaceMap[id] !== workspace) {
      onSwitchWorkspace(workspaceMap[id]);
      return;
    }

    onNavigate(id);
  };

  return (
    <div className="flex h-full w-full bg-canvas">
      {/* Sidebar */}
      <aside className={`hidden shrink-0 flex-col border-r border-border bg-surface transition-all md:flex ${collapsed ? "w-[76px]" : "w-64"}`}>
        <div className="flex h-16 items-center border-b border-border px-4">
          {collapsed ? <Logo size={36} showName={false} /> : <Logo size={36} />}
        </div>

        {/* Workspace switcher */}
        {!collapsed && (
          <div className="p-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex w-full items-center gap-2.5 rounded-lg border border-border p-2.5 text-left hover:bg-accent">
                  <div className={`grid size-8 place-items-center rounded-md ${workspace === "emergency" ? "bg-danger/10 text-danger" : "bg-secondary text-primary"}`}>
                    <current.icon className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-text-primary">{current.label}</div>
                    <div className="truncate text-xs text-text-secondary">{current.desc}</div>
                  </div>
                  <ChevronsUpDown className="size-4 text-text-secondary" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-60">
                <DropdownMenuLabel>Switch workspace</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {accessibleWorkspaces.map((w) => (
                  <DropdownMenuItem key={w.id} onClick={() => onSwitchWorkspace(w.id)} className="gap-2.5">
                    <div className={`grid size-7 place-items-center rounded-md ${w.id === "emergency" ? "bg-danger/10 text-danger" : "bg-secondary text-primary"}`}>
                      <w.icon className="size-4" />
                    </div>
                    <div className="flex-1"><div className="text-sm font-medium">{w.label}</div>
                      <div className="text-xs text-text-secondary">{w.desc}</div></div>
                    {w.id === workspace && <Check className="size-4 text-primary" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-3">
          {!collapsed && nav.length > 0 && <div className="px-2 pb-1 pt-1 text-xs font-semibold uppercase tracking-wide text-text-secondary">{sectionLabel}</div>}
          {nav.map((n) => (
            <NavButton key={n.id} item={n} collapsed={collapsed} active={active} expanded={expanded} hasActiveChild={hasActiveChild} onNavigate={handleNavClick} />
          ))}
          {navSecondary && navSecondary.length > 0 && (
            <>
              {!collapsed && <div className="px-2 pb-1 pt-4 text-xs font-semibold uppercase tracking-wide text-text-secondary">More</div>}
              {navSecondary.map((n) => (
                <NavButton key={n.id} item={n} collapsed={collapsed} active={active} expanded={expanded} hasActiveChild={hasActiveChild} onNavigate={handleNavClick} />
              ))}
            </>
          )}
        </nav>
        <div className="border-t border-border p-3">
          <button onClick={() => setCollapsed((c) => !c)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-text-secondary hover:bg-accent hover:text-text-primary">
            <Menu className="size-5 shrink-0" />{!collapsed && <span className="font-medium">Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center gap-4 border-b border-border bg-surface px-4 sm:px-6">
          <div className="relative hidden max-w-md flex-1 sm:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-secondary" />
            <Input placeholder={searchPlaceholder ?? "Search patients, UHID, doctors…"} className="h-10 pl-9 pr-16"
              onFocus={onSearchFocus} readOnly />
            <span className="absolute right-3 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded border border-border px-1.5 py-0.5 text-xs text-text-secondary lg:flex">
              <Command className="size-3" />K
            </span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {workspace === "emergency" && (
              <span className="hidden items-center gap-1.5 rounded-full bg-danger/10 px-3 py-1.5 text-xs font-semibold text-danger sm:flex">
                <span className="size-2 animate-pulse rounded-full bg-danger" />2 CRITICAL
              </span>
            )}
            <Button variant="ghost" size="icon" className="text-text-secondary"><HelpCircle className="size-5" /></Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative grid size-10 place-items-center rounded-lg text-text-secondary hover:bg-accent">
                  <Bell className="size-5" />
                  <span className="absolute right-2 top-2 size-2 rounded-full bg-danger ring-2 ring-surface" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between">Notifications
                  <span className="rounded-full bg-danger/10 px-2 py-0.5 text-xs font-medium text-danger">3 new</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {NOTIFICATIONS.map((n) => (
                  <DropdownMenuItem key={n.title} className="flex-col items-start gap-0.5 py-2.5">
                    <div className="flex w-full items-center justify-between">
                      <span className={`text-sm font-medium ${n.tone}`}>{n.title}</span>
                      <span className="text-xs text-text-secondary">{n.time}</span>
                    </div>
                    <span className="text-xs text-text-secondary">{n.desc}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 hover:bg-accent">
                  <Avatar name="Priya Sharma" size={34} />
                  <div className="hidden text-left leading-tight sm:block">
                    <div className="text-sm font-medium text-text-primary">Priya Sharma</div>
                    <div className="text-xs text-text-secondary">{roleName}</div>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onOpenSettings?.("profile")}>Profile & preferences</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onOpenSettings?.("shift")}>Shift & attendance</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onOpenSettings?.("shortcuts")}>Keyboard shortcuts</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onSignOut} className="text-danger focus:text-danger">
                  <LogOut className="size-4" />Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <div className="flex items-center gap-1.5 border-b border-border bg-surface px-4 py-2.5 text-sm sm:px-6">
          {breadcrumb.map((b, i) => (
            <span key={b} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="size-3.5 text-text-secondary" />}
              <span className={i === breadcrumb.length - 1 ? "font-medium text-text-primary" : "text-text-secondary"}>{b}</span>
            </span>
          ))}
        </div>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}

function NavButton({
  item,
  collapsed,
  active,
  expanded,
  hasActiveChild,
  onNavigate,
  depth = 0,
}: {
  item: NavItem;
  collapsed: boolean;
  active: (id: string) => boolean;
  expanded: Set<string>;
  hasActiveChild: (item: NavItem) => boolean;
  onNavigate: (item: NavItem) => void;
  depth?: number;
}) {
  const on = active(item.id);
  const hasChildren = item.children && item.children.length > 0;
  const isOpen = expanded.has(item.id);
  const childActive = hasActiveChild(item);

  if (collapsed || !hasChildren) {
    return (
      <button key={item.id} onClick={() => onNavigate(item)}
        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${on ? "bg-primary text-primary-foreground" : "text-text-secondary hover:bg-accent hover:text-text-primary"}`}
        title={item.label}>
        <item.icon className="size-5 shrink-0" />
        {!collapsed && <span className="flex-1 text-left font-medium">{item.label}</span>}
        {!collapsed && item.badge && (
          <span className={`rounded-full px-1.5 py-0.5 text-xs font-semibold ${on ? "bg-white/20 text-white" : item.tone === "warning" ? "bg-warning/15 text-[#b45309]" : "bg-danger/10 text-danger"}`}>{item.badge}</span>
        )}
      </button>
    );
  }

  return (
    <div key={item.id}>
      <button onClick={() => onNavigate(item)}
        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${on || childActive ? "bg-primary text-primary-foreground" : "text-text-secondary hover:bg-accent hover:text-text-primary"}`}
        title={item.label}>
        <item.icon className="size-5 shrink-0" />
        <span className="flex-1 text-left font-medium">{item.label}</span>
        {item.badge && (
          <span className={`rounded-full px-1.5 py-0.5 text-xs font-semibold ${on ? "bg-white/20 text-white" : item.tone === "warning" ? "bg-warning/15 text-[#b45309]" : "bg-danger/10 text-danger"}`}>{item.badge}</span>
        )}
        <ChevronDown className={`size-4 shrink-0 transition-transform ${isOpen ? "" : "-rotate-90"}`} />
      </button>
      {isOpen && item.children && (
        <div className="ml-4 mt-0.5 space-y-0.5 border-l border-border pl-3">
          {item.children.map((child) => (
            <NavButton key={child.id} item={child} collapsed={collapsed} active={active} expanded={expanded} hasActiveChild={hasActiveChild} onNavigate={onNavigate} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

/** Reception route ids — kept for the Reception module's screens. */
export type Route =
  | "dashboard" | "search" | "profile" | "register" | "uhid"
  | "emergency" | "appointment" | "queue" | "beds";
