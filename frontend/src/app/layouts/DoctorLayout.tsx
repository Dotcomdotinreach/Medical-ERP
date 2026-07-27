import { Outlet, useNavigate, useLocation } from "react-router";
import { LayoutDashboard, CalendarDays, Siren, Users, BedDouble, FlaskConical, Scan, Pill, FileText, MessageSquare, BarChart3 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Shell, type NavItem, type Workspace } from "../components/his/Shell";

const NAV: NavItem[] = [
  { id: "dashboard", label: "Doctor Dashboard", icon: LayoutDashboard },
  { id: "schedule", label: "Today's Schedule", icon: CalendarDays, badge: "8" },
  { id: "emergency", label: "Emergency Queue", icon: Siren, badge: "4", tone: "danger" },
  { id: "inpatients", label: "Admitted Patients", icon: BedDouble },
  { id: "messages", label: "Patient Messages", icon: MessageSquare, badge: "4", tone: "warning" },
];
const NAV_SECONDARY: NavItem[] = [
  { id: "patients", label: "Patient Directory", icon: Users },
  { id: "lab", label: "Lab Results", icon: FlaskConical },
  { id: "radiology", label: "Radiology", icon: Scan },
  { id: "prescriptions", label: "Prescriptions", icon: Pill },
  { id: "reports", label: "Reports", icon: FileText },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
];

const CRUMBS: Record<string, string[]> = {
  dashboard: ["Doctor", "Dashboard"],
  schedule: ["Doctor", "Today's Schedule"],
  emergency: ["Doctor", "Emergency Queue"],
  inpatients: ["Doctor", "Admitted Patients"],
  messages: ["Doctor", "Patient Messages"],
  patients: ["Doctor", "Patient Directory"],
  lab: ["Doctor", "Lab Results"],
  radiology: ["Doctor", "Radiology"],
  prescriptions: ["Doctor", "Prescriptions"],
  reports: ["Doctor", "Reports"],
  analytics: ["Doctor", "Analytics"],
};

export default function DoctorLayout() {
  const { user } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const roleName = user?.role === "super_admin" ? "Super Admin" :
    user?.role === "admin" ? "Administrator" :
    user?.role === "doctor" ? "Doctor" : "Staff";

  const screen = loc.pathname.replace("/doctor/", "").replace("/doctor", "") || "dashboard";
  const breadcrumb = CRUMBS[screen] ?? ["Doctor", screen];

  return (
    <Shell
      nav={NAV} navSecondary={NAV_SECONDARY} sectionLabel="Doctor Workstation"
      activeId={screen} onNavigate={(id) => nav(`/doctor/${id}`)}
      breadcrumb={breadcrumb} roleName={roleName}
      onSignOut={() => {}} workspace="doctor" onSwitchWorkspace={(w: Workspace) => nav("/" + w)}
      onOpenSettings={(page: string) => nav("/settings/" + page)}
      searchPlaceholder="Search patients, UHID, records…"
      userRole={user?.role}
    >
      <Outlet />
    </Shell>
  );
}
