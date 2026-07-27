import { useState, useEffect } from "react"
import {
  LayoutDashboard, Ambulance, ClipboardList, Activity, MonitorDot, Stethoscope,
  Users, BedDouble, HeartPulse, Building2, Pill, FlaskConical, Scan, Receipt, BarChart3,
} from "lucide-react";
import { Shell, type NavItem, type Workspace } from "../his/Shell";
import { EmergencyDashboard } from "./EmergencyDashboard";
import { IncomingAmbulances } from "./IncomingAmbulances";
import { EmergencyQueue } from "./EmergencyQueue";
import { CaseDetail } from "./CaseDetail";
import { EmergencyAnalytics } from "./EmergencyAnalytics";
import { ED_CASES, type EDCase } from "./edData";
import { emergencyApi } from "../../services/emergency";

export type EDRoute =
  | "dashboard" | "ambulances" | "queue" | "case" | "analytics"
  | "triage" | "tracking" | "monitoring" | "doctors" | "nurses"
  | "beds" | "icu" | "ot" | "pharmacy" | "lab" | "radiology" | "billing";

const NAV: NavItem[] = [
  { id: "dashboard", label: "Emergency Dashboard", icon: LayoutDashboard },
  { id: "ambulances", label: "Incoming Ambulances", icon: Ambulance, badge: "3", tone: "danger" },
  { id: "queue", label: "Emergency Queue", icon: ClipboardList, badge: "8", tone: "warning" },
  { id: "triage", label: "Triage", icon: Activity },
  { id: "tracking", label: "Patient Tracking", icon: MonitorDot },
  { id: "monitoring", label: "Live Monitoring", icon: HeartPulse },
  { id: "analytics", label: "Reports & Analytics", icon: BarChart3 },
];
const NAV_SECONDARY: NavItem[] = [
  { id: "doctors", label: "Emergency Doctors", icon: Stethoscope },
  { id: "nurses", label: "Emergency Nurses", icon: Users },
  { id: "beds", label: "Emergency Beds", icon: BedDouble },
  { id: "icu", label: "ICU", icon: HeartPulse },
  { id: "ot", label: "Operation Theater", icon: Building2 },
  { id: "pharmacy", label: "Emergency Pharmacy", icon: Pill },
  { id: "lab", label: "Emergency Laboratory", icon: FlaskConical },
  { id: "radiology", label: "Radiology", icon: Scan },
  { id: "billing", label: "Emergency Billing", icon: Receipt },
];

const FUNCTIONAL: EDRoute[] = ["dashboard", "ambulances", "queue", "case", "analytics"];

const CRUMBS: Partial<Record<EDRoute, string[]>> = {
  dashboard: ["Emergency", "Dashboard"],
  ambulances: ["Emergency", "Incoming Ambulances"],
  queue: ["Emergency", "Queue"],
  case: ["Emergency", "Queue", "Case"],
  analytics: ["Emergency", "Reports & Analytics"],
};

export function EmergencyApp({
  roleName, onSignOut, onSwitchWorkspace, onOpenSettings,
}: { roleName: string; onSignOut: () => void; onSwitchWorkspace: (w: Workspace) => void; onOpenSettings?: (page: string) => void }) {
  const [route, setRoute] = useState<EDRoute>("dashboard");
  const [edCase, setEdCase] = useState<EDCase>(ED_CASES[0]);
  const [liveCases, setLiveCases] = useState<EDCase[]>(ED_CASES);

  useEffect(() => {
    emergencyApi.list().then(r => {
      if (r.data?.length) setLiveCases(r.data.map((e: any) => ({
        id: e._id,
        uhid: e.patient?.uhid || "",
        name: e.patient ? `${e.patient.firstName} ${e.patient.lastName}` : "Unknown",
        age: 0,
        gender: "Other" as const,
        blood: "",
        phone: "",
        complaint: e.chiefComplaint || "",
        diagnosis: "",
        triage: (e.triageLevel || "Yellow") as EDCase["triage"],
        stage: "Registration" as const,
        status: (e.status || "Waiting") as EDCase["status"],
        arrival: e.createdAt ? new Date(e.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        arrivalMode: (e.arrivalMode || "Walk-in") as EDCase["arrivalMode"],
        bed: e.bed?.bedNumber || "—",
        doctor: e.assignedDoctor?.name || "—",
        nurse: "—",
        allergies: [] as string[],
        history: [] as string[],
        vitals: e.vitals
          ? { hr: e.vitals.heartRate || 0, sbp: parseInt(e.vitals.bloodPressure?.split("/")[0]) || 0, dbp: parseInt(e.vitals.bloodPressure?.split("/")[1]) || 0, temp: e.vitals.temperature || 0, rr: e.vitals.respiratoryRate || 0, spo2: e.vitals.oxygenSaturation || 0, pain: 0 }
          : { hr: 0, sbp: 0, dbp: 0, temp: 0, rr: 0, spo2: 0, pain: 0 },
      })));
    }).catch(() => {});
  }, []);

  const openCase = (c: EDCase) => { setEdCase(c); setRoute("case"); };

  // Non-functional sidebar items map to a sensible functional screen.
  const navigate = (id: string) => {
    const r = id as EDRoute;
    if (FUNCTIONAL.includes(r)) { setRoute(r); return; }
    if (r === "triage" || r === "tracking" || r === "monitoring") { setRoute("queue"); return; }
    if (r === "analytics" || r === "billing") { setRoute("analytics"); return; }
    setRoute("queue");
  };

  const activeId = route === "case" ? "queue" : route;
  const crumb = CRUMBS[route] ?? ["Emergency", "Dashboard"];

  return (
    <Shell
      nav={NAV} navSecondary={NAV_SECONDARY} sectionLabel="Emergency Department"
      activeId={activeId} onNavigate={navigate}
      breadcrumb={crumb} roleName={roleName} onSignOut={onSignOut}
      workspace="emergency" onSwitchWorkspace={onSwitchWorkspace}
      onOpenSettings={onOpenSettings}
      searchPlaceholder="Search emergency cases, ambulances…"
      onSearchFocus={() => setRoute("queue")}
    >
      {route === "dashboard" && <EmergencyDashboard liveCases={liveCases} go={setRoute} openCase={openCase} />}
      {route === "ambulances" && <IncomingAmbulances />}
      {route === "queue" && <EmergencyQueue liveCases={liveCases} openCase={openCase} />}
      {route === "case" && <CaseDetail edCase={edCase} go={setRoute} />}
      {route === "analytics" && <EmergencyAnalytics />}
    </Shell>
  );
}
