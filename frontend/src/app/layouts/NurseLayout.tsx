import { Outlet, useNavigate, useLocation } from "react-router";
import { Activity, Users, Pill, HeartPulse, ClipboardCheck, ClipboardList, Stethoscope, FileText, Truck, UserCheck, ShieldAlert, Send, CalendarDays, CheckCircle2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Shell, type NavItem, type Workspace } from "../components/his/Shell";

const NAV: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: Activity },
  { id: "patients", label: "Assigned Patients", icon: Users, badge: "8" },
  { id: "mar", label: "Medication Administration", icon: Pill, badge: "3", tone: "warning" },
  { id: "vitals", label: "Vitals", icon: HeartPulse },
  { id: "care-plan", label: "Care Plans", icon: ClipboardCheck },
  { id: "tasks", label: "Tasks", icon: ClipboardList, badge: "5", tone: "warning" },
  { id: "orders", label: "Doctors Orders", icon: Stethoscope, badge: "2" },
  { id: "notes", label: "Clinical Notes", icon: FileText },
  { id: "transfer", label: "Patient Transfers", icon: Truck },
  { id: "handover", label: "Shift Handover", icon: UserCheck },
];
const NAV_SECONDARY: NavItem[] = [
  { id: "incident", label: "Incident Reports", icon: ShieldAlert },
  { id: "education", label: "Patient Education", icon: Send },
  { id: "reports", label: "Reports", icon: CalendarDays },
  { id: "discharge", label: "Discharge Preparation", icon: CheckCircle2 },
];

const CRUMBS: Record<string, string[]> = {
  dashboard: ["Nursing", "Dashboard"],
  patients: ["Nursing", "Assigned Patients"],
  mar: ["Nursing", "Medication Administration"],
  vitals: ["Nursing", "Vitals"],
  "care-plan": ["Nursing", "Care Plans"],
  tasks: ["Nursing", "Tasks"],
  orders: ["Nursing", "Doctors Orders"],
  notes: ["Nursing", "Clinical Notes"],
  transfer: ["Nursing", "Patient Transfers"],
  handover: ["Nursing", "Shift Handover"],
  incident: ["Nursing", "Incident Reports"],
  education: ["Nursing", "Patient Education"],
  reports: ["Nursing", "Reports"],
  discharge: ["Nursing", "Discharge Preparation"],
};

export default function NurseLayout() {
  const { user } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const roleName = user?.role === "super_admin" ? "Super Admin" :
    user?.role === "admin" ? "Administrator" :
    user?.role === "nurse" ? "Nurse" : "Staff";

  const screen = loc.pathname.replace("/nurse/", "").replace("/nurse", "") || "dashboard";
  const breadcrumb = CRUMBS[screen] ?? ["Nursing", screen];

  return (
    <Shell
      nav={NAV} navSecondary={NAV_SECONDARY} sectionLabel="Nurse Workstation"
      activeId={screen} onNavigate={(id) => nav(`/nurse/${id}`)}
      breadcrumb={breadcrumb} roleName={roleName}
      onSignOut={() => {}} workspace="nurse" onSwitchWorkspace={(w: Workspace) => nav("/" + w)}
      onOpenSettings={(page: string) => nav("/settings/" + page)}
      searchPlaceholder="Search assigned patients, UHID, bed…"
      userRole={user?.role}
    >
      <Outlet />
    </Shell>
  );
}
