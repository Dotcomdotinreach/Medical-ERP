import { Outlet, useNavigate, useLocation } from "react-router";
import { LayoutDashboard, Users, Search, UserPlus, Siren, CalendarDays, ClipboardList, BedDouble, Stethoscope, Receipt, BarChart3, Settings } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Shell, type NavItem, type Workspace } from "../components/his/Shell";

const NAV: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "patients", label: "Patient Management", icon: Users, children: [
    { id: "patients/search", label: "Patient Search", icon: Search },
    { id: "patients/register", label: "Register Patient", icon: UserPlus },
  ]},
  { id: "emergency", label: "Emergency Check-in", icon: Siren, badge: "3" },
  { id: "scheduling", label: "Scheduling", icon: CalendarDays, children: [
    { id: "appointments", label: "Appointments", icon: CalendarDays },
    { id: "queue", label: "Queue Management", icon: ClipboardList, badge: "7", tone: "warning" },
  ]},
  { id: "beds", label: "Bed Management", icon: BedDouble },
];
const NAV_SECONDARY: NavItem[] = [
  { id: "doctors", label: "Doctors", icon: Stethoscope },
  { id: "billing", label: "Billing", icon: Receipt },
  { id: "reports", label: "Reports", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
];

const CRUMBS: Record<string, string[]> = {
  dashboard: ["Reception", "Dashboard"],
  "patients/search": ["Reception", "Patients", "Search"],
  "patients/register": ["Reception", "Patients", "Register"],
  emergency: ["Reception", "Emergency Check-in"],
  appointments: ["Reception", "Appointments"],
  queue: ["Reception", "Queue Management"],
  beds: ["Reception", "Bed Management"],
  doctors: ["Reception", "Doctors"],
  billing: ["Reception", "Billing"],
  reports: ["Reception", "Reports"],
};

export default function ReceptionLayout() {
  const { user } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const roleName = user?.role === "super_admin" ? "Super Admin" :
    user?.role === "admin" ? "Administrator" :
    user?.role === "receptionist" ? "Receptionist" : "Staff";

  const screen = loc.pathname.replace("/reception/", "").replace("/reception", "") || "dashboard";
  const parentScreen = screen.split("/")[0];
  const breadcrumb = CRUMBS[screen] ?? CRUMBS[parentScreen] ?? ["Reception", screen];

  return (
    <Shell
      nav={NAV} navSecondary={NAV_SECONDARY} sectionLabel="Reception"
      activeId={screen} onNavigate={(id) => nav(`/reception/${id}`)}
      breadcrumb={breadcrumb} roleName={roleName}
      onSignOut={() => {}} workspace="reception" onSwitchWorkspace={(w: Workspace) => nav("/" + w)}
      onOpenSettings={(page: string) => nav("/settings/" + page)}
      userRole={user?.role}
    >
      <Outlet />
    </Shell>
  );
}
