import { useState, useEffect } from "react";
import {
  LayoutDashboard, CalendarDays, Siren, Users, BedDouble, FlaskConical, Scan, Pill,
  FileText, MessageSquare, BarChart3,
} from "lucide-react";
import { Shell, type NavItem, type Workspace } from "../his/Shell";
import { DoctorDashboard } from "./DoctorDashboard";
import { DoctorSchedule } from "./DoctorSchedule";
import { DoctorEmergencyQueue } from "./DoctorEmergencyQueue";
import { Encounter } from "./Encounter";
import { appointmentApi } from "../../services/appointments";
import { APPOINTMENTS } from "./docData";

type DocRoute =
  | "dashboard" | "schedule" | "emergency" | "encounter"
  | "patients" | "inpatients" | "lab" | "radiology" | "prescriptions"
  | "reports" | "messages" | "analytics";

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

const FUNCTIONAL: DocRoute[] = ["dashboard", "schedule", "emergency", "encounter"];

const CRUMBS: Partial<Record<DocRoute, string[]>> = {
  dashboard: ["Doctor", "Dashboard"],
  schedule: ["Doctor", "Today's Schedule"],
  emergency: ["Doctor", "Emergency Queue"],
  encounter: ["Doctor", "Patient Encounter"],
};

export function DoctorApp({
  roleName, onSignOut, onSwitchWorkspace, onOpenSettings,
}: { roleName: string; onSignOut: () => void; onSwitchWorkspace: (w: Workspace) => void; onOpenSettings?: (page: string) => void }) {
  const [route, setRoute] = useState<DocRoute>("dashboard");
  const [liveAppointments, setLiveAppointments] = useState(APPOINTMENTS);

  useEffect(() => {
    appointmentApi.list().then(r => {
      if (r.data?.length) setLiveAppointments(r.data.map((a: any) => ({
        id: a._id,
        time: a.timeSlot || "",
        patientId: a.patient?._id || a._id,
        name: a.patient ? `${a.patient.firstName} ${a.patient.lastName}` : "",
        age: 0,
        gender: "" as const,
        uhid: a.patient?.uhid || "",
        type: (a.type || "New") as any,
        reason: a.reason || "",
        status: (a.status || "Scheduled") as any,
      })));
    }).catch(() => {});
  }, []);

  // All patient/queue selections open the unified EMR encounter workflow.
  const openConsult = (_id: string) => setRoute("encounter");

  const navigate = (id: string) => {
    const r = id as DocRoute;
    if (FUNCTIONAL.includes(r)) { setRoute(r); return; }
    setRoute("schedule"); // non-built sections route to the schedule
  };

  const activeId = route === "encounter" ? "schedule" : route;
  const crumb = CRUMBS[route] ?? ["Doctor", "Dashboard"];

  return (
    <Shell
      nav={NAV} navSecondary={NAV_SECONDARY} sectionLabel="Doctor Workstation"
      activeId={activeId} onNavigate={navigate}
      breadcrumb={crumb} roleName={roleName} onSignOut={onSignOut}
      workspace="doctor" onSwitchWorkspace={onSwitchWorkspace}
      onOpenSettings={onOpenSettings}
      searchPlaceholder="Search patients, UHID, records…"
      onSearchFocus={() => setRoute("schedule")}
    >
      {route === "dashboard" && <DoctorDashboard go={navigate} openConsult={openConsult} appointments={liveAppointments} />}
      {route === "schedule" && <DoctorSchedule openConsult={openConsult} appointments={liveAppointments} />}
      {route === "emergency" && <DoctorEmergencyQueue openConsult={openConsult} />}
      {route === "encounter" && <Encounter onExit={() => setRoute("dashboard")} />}
    </Shell>
  );
}
