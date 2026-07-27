import { useEffect, useState } from "react";
import {
  Activity, AlertTriangle, Archive, ArrowLeft, ArrowRight, BadgeCheck, BarChart3,
  BedDouble, CalendarDays, CheckCircle2, ChevronRight, ClipboardList, Clock,
  FileText, FolderOpen, Hammer, Inbox, Layers, ListChecks, Printer, QrCode,
  RefreshCw, RotateCcw, ScanLine, Search, Send, ShieldAlert, ShieldCheck,
  Timer, Trash2, TrendingUp, TriangleAlert, Users, XCircle, Zap, Bed as BedIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Shell, type NavItem, type Workspace } from "../his/Shell";
import { StatusBadge } from "../his/ui";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "../ui/dialog";
import {
  BedStatusBadge, AdmissionStatusBadge, TransferStatusBadge, CleaningStatusBadge,
  IsolationBadge, IpdStatCard, IpdSection, IpdPageHeader, WardCard, BedCell,
} from "./ipdUi";
import {
  WARDS, ROOMS, BEDS, INPATIENTS, ADMISSION_REQUESTS, TRANSFERS, CLEANING_REQUESTS, AUDIT_LOGS,
  type Ward, type Room, type Bed, type Inpatient, type AdmissionRequest,
} from "./data";
import { bedApi } from "../../services/beds";
import { admissionApi } from "../../services/admissions";

type IpdRoute =
  | "dashboard" | "admission-requests" | "ward-management" | "room-management"
  | "bed-management" | "patient-admission" | "current-inpatients" | "patient-transfer"
  | "isolation-management" | "daily-bedside" | "discharge-planning" | "discharge-checklist"
  | "bed-release" | "bed-cleaning" | "occupancy-dashboard" | "reports"
  | "alerts" | "complete";

const NAV: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: Activity },
  { id: "admission-requests", label: "Admission Requests", icon: ClipboardList, badge: "3" },
  { id: "ward-management", label: "Ward Management", icon: BedDouble },
  { id: "room-management", label: "Room Management", icon: BedDouble },
  { id: "bed-management", label: "Bed Management", icon: BedIcon },
  { id: "patient-admission", label: "Patient Admission", icon: UserPlus },
  { id: "current-inpatients", label: "Current Inpatients", icon: Users, badge: "8" },
  { id: "patient-transfer", label: "Patient Transfer", icon: ArrowRight, badge: "1", tone: "warning" },
  { id: "isolation-management", label: "Isolation Mgmt", icon: ShieldAlert, badge: "2", tone: "danger" },
];
const NAV_SECONDARY: NavItem[] = [
  { id: "daily-bedside", label: "Daily Bedside Status", icon: ClipboardList },
  { id: "discharge-planning", label: "Discharge Planning", icon: CalendarDays },
  { id: "discharge-checklist", label: "Discharge Checklist", icon: ListChecks },
  { id: "bed-release", label: "Bed Release", icon: BedDouble },
  { id: "bed-cleaning", label: "Bed Cleaning", icon: Hammer, badge: "1", tone: "warning" },
  { id: "occupancy-dashboard", label: "Occupancy Dashboard", icon: BarChart3 },
  { id: "reports", label: "Reports", icon: FileText },
  { id: "alerts", label: "Alerts & Notifications", icon: Bell },
];

function UserPlus(props: React.SVGProps<SVGSVGElement>) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>;
}

function Bell(props: React.SVGProps<SVGSVGElement>) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>;
}

const CRUMBS: Record<IpdRoute, string[]> = {
  dashboard: ["IPD", "Dashboard"],
  "admission-requests": ["IPD", "Admission Requests"],
  "ward-management": ["IPD", "Ward Management"],
  "room-management": ["IPD", "Room Management"],
  "bed-management": ["IPD", "Bed Management"],
  "patient-admission": ["IPD", "Patient Admission"],
  "current-inpatients": ["IPD", "Current Inpatients"],
  "patient-transfer": ["IPD", "Patient Transfer"],
  "isolation-management": ["IPD", "Isolation Management"],
  "daily-bedside": ["IPD", "Daily Bedside Status"],
  "discharge-planning": ["IPD", "Discharge Planning"],
  "discharge-checklist": ["IPD", "Discharge Checklist"],
  "bed-release": ["IPD", "Bed Release"],
  "bed-cleaning": ["IPD", "Bed Cleaning"],
  "occupancy-dashboard": ["IPD", "Occupancy Dashboard"],
  reports: ["IPD", "Reports"],
  alerts: ["IPD", "Alerts & Notifications"],
  complete: ["IPD", "Workflow Complete"],
};

export function IpdApp({ roleName, onSignOut, onSwitchWorkspace, onOpenSettings }: {
  roleName: string; onSignOut: () => void; onSwitchWorkspace: (w: Workspace) => void; onOpenSettings?: (page: string) => void;
}) {
  const [route, setRoute] = useState<IpdRoute>("dashboard");
  const [selectedPatient, setSelectedPatient] = useState<Inpatient>(INPATIENTS[0]);
  const [selectedWard, setSelectedWard] = useState<Ward>(WARDS[0]);
  const [selectedRoom, setSelectedRoom] = useState<Room>(ROOMS[0]);
  const [selectedBed, setSelectedBed] = useState<Bed>(BEDS[0]);

  const [liveBeds, setLiveBeds] = useState(BEDS);
  const [liveAdmissions, setLiveAdmissions] = useState(INPATIENTS);
  const [liveRequests, setLiveRequests] = useState(ADMISSION_REQUESTS);

  useEffect(() => {
    bedApi.list().then(r => {
      if (r.data?.length) setLiveBeds(r.data.map((b: any) => ({
        id: b.bedNumber || b._id,
        number: b.bedNumber || "",
        roomId: "",
        roomNumber: "",
        wardId: b._id || "",
        wardName: b.ward || "",
        status: (b.status || "Available") as Bed["status"],
        patientName: b.patient ? `${b.patient.firstName} ${b.patient.lastName}` : "",
        uhid: b.patient?.uhid || "",
        doctor: "",
        admissionDate: b.createdAt || "",
        expectedDischarge: "",
        lengthOfStay: 0,
        cleaningStaff: "",
        cleaningStartTime: "",
        cleaningEndTime: "",
      })));
    }).catch(() => {});

    admissionApi.list().then(r => {
      if (r.data?.length) {
        setLiveAdmissions(r.data.map((a: any) => ({
          uhid: a.patient?.uhid || "",
          admissionId: a._id,
          patientName: a.patient ? `${a.patient.firstName} ${a.patient.lastName}` : "",
          age: 0,
          gender: "Male" as const,
          blood: "",
          doctor: a.doctor?.name || "",
          department: a.department || "",
          ward: a.bed?.ward || "",
          room: "",
          bed: a.bed?.bedNumber || "",
          admissionDate: a.admittedAt || a.createdAt || "",
          expectedDischarge: a.expectedDischarge || "",
          lengthOfStay: 0,
          diagnosis: a.diagnosis || a.reason || "",
          insurance: "",
          status: (a.status || "Admitted") as Inpatient["status"],
          isolation: undefined,
          clinicalStatus: "Stable" as const,
        })));
        setLiveRequests(r.data.filter((a: any) => a.status === "Requested").map((a: any) => ({
          requestId: a._id,
          patientName: a.patient ? `${a.patient.firstName} ${a.patient.lastName}` : "",
          uhid: a.patient?.uhid || "",
          age: 0,
          gender: "Male" as const,
          doctor: a.doctor?.name || "",
          department: a.department || "",
          priority: "Routine" as const,
          diagnosis: a.diagnosis || a.reason || "",
          requestTime: a.createdAt || "",
          insurance: "",
          estimatedStay: 0,
          specialRequirements: undefined,
        })));
      }
    }).catch(() => {});
  }, []);

  const navTo = (r: IpdRoute) => setRoute(r);

  const totalBeds = WARDS.reduce((a, w) => a + w.totalBeds, 0);
  const occupiedBeds = WARDS.reduce((a, w) => a + w.occupiedBeds, 0);
  const occupancyPct = Math.round((occupiedBeds / totalBeds) * 100);

  function renderScreen() {
    switch (route) {
      case "dashboard": return <DashboardScreen />;
      case "admission-requests": return <AdmissionRequestsScreen />;
      case "ward-management": return <WardManagementScreen />;
      case "room-management": return <RoomManagementScreen />;
      case "bed-management": return <BedManagementScreen />;
      case "patient-admission": return <PatientAdmissionScreen />;
      case "current-inpatients": return <CurrentInpatientsScreen />;
      case "patient-transfer": return <PatientTransferScreen />;
      case "isolation-management": return <IsolationManagementScreen />;
      case "daily-bedside": return <DailyBedsideStatusScreen />;
      case "discharge-planning": return <DischargePlanningScreen />;
      case "discharge-checklist": return <DischargeChecklistScreen />;
      case "bed-release": return <BedReleaseScreen />;
      case "bed-cleaning": return <BedCleaningScreen />;
      case "occupancy-dashboard": return <OccupancyDashboardScreen />;
      case "reports": return <ReportsScreen />;
      case "alerts": return <AlertsNotificationsScreen />;
      case "complete": return <WorkflowCompleteScreen />;
      default: return <DashboardScreen />;
    }
  }

  function DashboardScreen() {
    return (
      <div className="space-y-6">
        <IpdPageHeader title="IPD Dashboard" subtitle="Overview of inpatient department operations" actions={
          <Button onClick={() => navTo("admission-requests")} className="bg-primary text-white"><ClipboardList className="mr-2 size-4" />Admission Requests</Button>
        } />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <IpdStatCard icon={BedDouble} label="Total Beds" value={totalBeds} trend={5} />
          <IpdStatCard icon={Users} label="Occupied Beds" value={occupiedBeds} tone="danger" />
          <IpdStatCard icon={AlertTriangle} label="Critical Patients" value={liveAdmissions.filter(p => p.clinicalStatus === "Critical").length} tone="warning" />
          <IpdStatCard icon={ShieldAlert} label="Isolation Patients" value={liveAdmissions.filter(p => p.isolation).length} tone="info" />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <IpdSection title="Occupancy by Ward" className="lg:col-span-2">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {WARDS.map(w => <WardCard key={w.id} ward={w} onClick={() => { setSelectedWard(w); navTo("ward-management"); }} />)}
            </div>
          </IpdSection>
          <IpdSection title="Pending Admissions" action={<Button variant="ghost" size="sm" onClick={() => navTo("admission-requests")}>View All <ChevronRight className="ml-1 size-4" /></Button>}>
            {liveRequests.map(req => (
              <div key={req.requestId} className="border-b border-border py-3 last:border-b-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-text-primary">{req.patientName}</span>
                  <span className={`text-xs font-medium ${req.priority === "Emergency" ? "text-danger" : req.priority === "Urgent" ? "text-[#b45309]" : "text-text-secondary"}`}>{req.priority}</span>
                </div>
                <p className="text-xs text-text-secondary">{req.department} · {req.doctor}</p>
              </div>
            ))}
          </IpdSection>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <IpdSection title="Recent Audit Log">
            {AUDIT_LOGS.slice(0, 5).map(log => (
              <div key={log.id} className="flex items-start gap-3 border-b border-border py-3 last:border-b-0">
                <div className="mt-0.5 size-2 rounded-full bg-primary" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-text-primary truncate">{log.action}</span>
                    <span className="shrink-0 text-xs text-text-secondary">{log.timestamp.split(" ")[1]}</span>
                  </div>
                  <p className="text-xs text-text-secondary truncate">{log.detail}</p>
                </div>
              </div>
            ))}
          </IpdSection>
          <IpdSection title="Transfer Requests">
            {TRANSFERS.map(tf => (
              <div key={tf.transferId} className="border-b border-border py-3 last:border-b-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-text-primary">{tf.patientName}</span>
                  <TransferStatusBadge status={tf.status} />
                </div>
                <p className="text-xs text-text-secondary">{tf.fromWard} → {tf.toWard}</p>
                <p className="text-xs text-text-secondary">Reason: {tf.reason}</p>
              </div>
            ))}
          </IpdSection>
        </div>
      </div>
    );
  }

  function AdmissionRequestsScreen() {
    const [filterPriority, setFilterPriority] = useState<string>("all");
    const filtered = filterPriority === "all" ? liveRequests : liveRequests.filter(r => r.priority === filterPriority);
    return (
      <div className="space-y-6">
        <IpdPageHeader title="Admission Requests" subtitle={`${liveRequests.length} pending admission requests`} />
        <div className="flex flex-wrap gap-2">
          {["all", "Emergency", "Urgent", "Routine"].map(p => (
            <Button key={p} variant={filterPriority === p ? "default" : "outline"} size="sm" onClick={() => setFilterPriority(p)}>
              {p === "all" ? "All" : p}
            </Button>
          ))}
        </div>
        <div className="space-y-4">
          {filtered.map(req => (
            <div key={req.requestId} className="rounded-xl border border-border bg-surface p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-text-primary">{req.patientName}</span>
                    <span className="text-xs text-text-secondary">{req.uhid}</span>
                    <span className={`text-xs font-medium ${req.priority === "Emergency" ? "text-danger" : req.priority === "Urgent" ? "text-[#b45309]" : "text-text-secondary"}`}>{req.priority}</span>
                  </div>
                  <p className="mt-1 text-sm text-text-secondary">{req.age}y {req.gender} · {req.department} · {req.doctor}</p>
                  <p className="mt-0.5 text-sm text-text-secondary">Diagnosis: {req.diagnosis}</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-text-secondary">
                    <span>Insurance: {req.insurance}</span>
                    <span>·</span>
                    <span>Est. Stay: {req.estimatedStay} days</span>
                    <span>·</span>
                    <span>Requested: {req.requestTime}</span>
                  </div>
                  {req.specialRequirements && <p className="mt-1 text-xs text-[#b45309]">⚠ {req.specialRequirements}</p>}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => toast.success("Admission approved for " + req.patientName)}>Approve</Button>
                  <Button size="sm" variant="outline" onClick={() => toast.info("Admission deferred for " + req.patientName)}>Defer</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function WardManagementScreen() {
    return (
      <div className="space-y-6">
        <IpdPageHeader title="Ward Management" subtitle="Manage wards, beds, and capacity" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {WARDS.map(w => (
            <WardCard key={w.id} ward={w} onClick={() => { setSelectedWard(w); toast.info("Viewing " + w.name); }} />
          ))}
        </div>
      </div>
    );
  }

  function RoomManagementScreen() {
    return (
      <div className="space-y-6">
        <IpdPageHeader title="Room Management" subtitle="Room-level view across all wards" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-3 font-medium text-text-secondary">Room</th>
                <th className="pb-3 font-medium text-text-secondary">Ward</th>
                <th className="pb-3 font-medium text-text-secondary">Type</th>
                <th className="pb-3 font-medium text-text-secondary">Beds</th>
                <th className="pb-3 font-medium text-text-secondary">Occupied</th>
                <th className="pb-3 font-medium text-text-secondary">Status</th>
                <th className="pb-3 font-medium text-text-secondary">Facilities</th>
              </tr>
            </thead>
            <tbody>
              {ROOMS.map(r => (
                <tr key={r.id} className="border-b border-border hover:bg-muted/50">
                  <td className="py-3 font-medium text-text-primary">{r.number}</td>
                  <td className="py-3 text-text-secondary">{r.wardName}</td>
                  <td className="py-3 text-text-secondary">{r.type}</td>
                  <td className="py-3 text-text-secondary">{r.totalBeds}</td>
                  <td className="py-3 text-text-secondary">{r.occupiedBeds}</td>
                  <td className="py-3">
                    <StatusBadge tone={r.status === "Active" ? "success" : "warning"}>{r.status}</StatusBadge>
                  </td>
                  <td className="py-3 text-text-secondary">
                    <div className="flex gap-1">
                      {r.hasAC && <span className="rounded bg-info/10 px-1.5 py-0.5 text-xs text-[#0369a1]">AC</span>}
                      {r.hasTV && <span className="rounded bg-info/10 px-1.5 py-0.5 text-xs text-[#0369a1]">TV</span>}
                      {r.hasAttachedBath && <span className="rounded bg-info/10 px-1.5 py-0.5 text-xs text-[#0369a1]">Bath</span>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  function BedManagementScreen() {
    return (
      <div className="space-y-6">
        <IpdPageHeader title="Bed Management" subtitle="Individual bed status and assignment" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-3 font-medium text-text-secondary">Bed</th>
                <th className="pb-3 font-medium text-text-secondary">Room</th>
                <th className="pb-3 font-medium text-text-secondary">Ward</th>
                <th className="pb-3 font-medium text-text-secondary">Status</th>
                <th className="pb-3 font-medium text-text-secondary">Patient</th>
                <th className="pb-3 font-medium text-text-secondary">Doctor</th>
                <th className="pb-3 font-medium text-text-secondary">LOS</th>
              </tr>
            </thead>
            <tbody>
              {liveBeds.map(b => (
                <tr key={b.id} className="border-b border-border hover:bg-muted/50">
                  <td className="py-3 font-medium text-text-primary">{b.number}</td>
                  <td className="py-3 text-text-secondary">{b.roomNumber}</td>
                  <td className="py-3 text-text-secondary">{b.wardName}</td>
                  <td className="py-3"><BedStatusBadge status={b.status}>{b.status}</BedStatusBadge></td>
                  <td className="py-3 text-text-secondary">{b.patientName || "—"}</td>
                  <td className="py-3 text-text-secondary">{b.doctor || "—"}</td>
                  <td className="py-3 text-text-secondary">{b.lengthOfStay !== undefined ? `${b.lengthOfStay}d` : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  function PatientAdmissionScreen() {
    return (
      <div className="space-y-6">
        <IpdPageHeader title="Patient Admission" subtitle="Process new patient admission" />
        <IpdSection title="Admission Form">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">Patient Name</label>
              <Input placeholder="Enter patient name" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">UHID</label>
              <Input placeholder="MRD-2026-XXXXXX" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">Doctor</label>
              <Input placeholder="Select doctor" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">Department</label>
              <Input placeholder="Select department" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">Ward</label>
              <Input placeholder="Select ward" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">Room</label>
              <Input placeholder="Select room" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">Bed</label>
              <Input placeholder="Select bed" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">Estimated Stay (days)</label>
              <Input type="number" placeholder="0" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium text-text-secondary">Diagnosis</label>
              <Textarea placeholder="Enter diagnosis" />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={() => toast.success("Patient admitted successfully")}>Admit Patient</Button>
            <Button variant="outline">Cancel</Button>
          </div>
        </IpdSection>
      </div>
    );
  }

  function CurrentInpatientsScreen() {
    const [search, setSearch] = useState("");
    const filtered = liveAdmissions.filter(p => p.patientName.toLowerCase().includes(search.toLowerCase()) || p.uhid.toLowerCase().includes(search.toLowerCase()));
    return (
      <div className="space-y-6">
        <IpdPageHeader title="Current Inpatients" subtitle={`${liveAdmissions.length} patients currently admitted`} actions={<Button variant="outline"><Printer className="mr-2 size-4" />Print List</Button>} />
        <Input placeholder="Search by name or UHID…" icon={<Search className="size-4" />} value={search} onChange={e => setSearch(e.target.value)} className="max-w-sm" />
        <div className="space-y-4">
          {filtered.map(p => (
            <div key={p.uhid} className="rounded-xl border border-border bg-surface p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-text-primary">{p.patientName}</span>
                    <span className="text-xs text-text-secondary">{p.uhid}</span>
                    {p.isolation && <IsolationBadge type={p.isolation} />}
                  </div>
                  <p className="mt-1 text-sm text-text-secondary">{p.age}y {p.gender} · {p.department} · {p.doctor}</p>
                  <p className="mt-0.5 text-sm text-text-secondary">Ward: {p.ward} · Room: {p.room} · Bed: {p.bed}</p>
                  <p className="mt-0.5 text-xs text-text-secondary">Admitted: {p.admissionDate} · LOS: {p.lengthOfStay}d · Exp. Discharge: {p.expectedDischarge}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge tone={p.clinicalStatus === "Critical" ? "danger" : p.clinicalStatus === "Guarded" ? "warning" : "success"}>{p.clinicalStatus}</StatusBadge>
                  <Button size="sm" variant="outline" onClick={() => { setSelectedPatient(p); navTo("discharge-planning"); }}>Discharge</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function PatientTransferScreen() {
    return (
      <div className="space-y-6">
        <IpdPageHeader title="Patient Transfer" subtitle="Inpatient transfer requests and tracking" />
        <div className="space-y-4">
          {TRANSFERS.map(tf => (
            <div key={tf.transferId} className="rounded-xl border border-border bg-surface p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-text-primary">{tf.patientName}</span>
                    <span className="text-xs text-text-secondary">{tf.uhid}</span>
                    <TransferStatusBadge status={tf.status} />
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-sm text-text-secondary">
                    <span>{tf.fromWard} · {tf.fromRoom} · {tf.fromBed}</span>
                    <ArrowRight className="size-4" />
                    <span>{tf.toWard} · {tf.toRoom} · {tf.toBed}</span>
                  </div>
                  <p className="mt-1 text-sm text-text-secondary">Reason: {tf.reason}</p>
                  <p className="mt-0.5 text-xs text-text-secondary">Requested by: {tf.requestedBy} · Transport: {tf.transportTeam}</p>
                </div>
                {tf.status === "Pending" && (
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => toast.success("Transfer approved for " + tf.patientName)}>Approve</Button>
                    <Button size="sm" variant="outline" onClick={() => toast.info("Transfer cancelled for " + tf.patientName)}>Cancel</Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function IsolationManagementScreen() {
    const isolatedPatients = liveAdmissions.filter(p => p.isolation);
    return (
      <div className="space-y-6">
        <IpdPageHeader title="Isolation Management" subtitle={`${isolatedPatients.length} patients under isolation precautions`} />
        <div className="space-y-4">
          {isolatedPatients.map(p => (
            <div key={p.uhid} className="rounded-xl border border-border bg-surface p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-text-primary">{p.patientName}</span>
                    <IsolationBadge type={p.isolation!} />
                  </div>
                  <p className="mt-1 text-sm text-text-secondary">{p.age}y {p.gender} · {p.ward} · {p.room} · {p.bed}</p>
                  <p className="mt-0.5 text-sm text-text-secondary">Diagnosis: {p.diagnosis}</p>
                </div>
                <StatusBadge tone={p.clinicalStatus === "Critical" ? "danger" : p.clinicalStatus === "Guarded" ? "warning" : "success"}>{p.clinicalStatus}</StatusBadge>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function DailyBedsideStatusScreen() {
    return (
      <div className="space-y-6">
        <IpdPageHeader title="Daily Bedside Status" subtitle="Record vitals and bedside observations" actions={<Button><Printer className="mr-2 size-4" />Print Report</Button>} />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {liveAdmissions.map(p => (
            <div key={p.uhid} className="rounded-xl border border-border bg-surface p-5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-text-primary">{p.patientName}</span>
                <StatusBadge tone={p.clinicalStatus === "Critical" ? "danger" : p.clinicalStatus === "Guarded" ? "warning" : "success"}>{p.clinicalStatus}</StatusBadge>
              </div>
              <p className="text-xs text-text-secondary">{p.ward} · {p.room} · {p.bed}</p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg bg-muted p-2"><span className="text-text-secondary">BP</span><div className="font-medium">120/80</div></div>
                <div className="rounded-lg bg-muted p-2"><span className="text-text-secondary">HR</span><div className="font-medium">78</div></div>
                <div className="rounded-lg bg-muted p-2"><span className="text-text-secondary">Temp</span><div className="font-medium">98.2°F</div></div>
                <div className="rounded-lg bg-muted p-2"><span className="text-text-secondary">SpO2</span><div className="font-medium">97%</div></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function DischargePlanningScreen() {
    return (
      <div className="space-y-6">
        <IpdPageHeader title="Discharge Planning" subtitle="Plan and schedule patient discharges" />
        <div className="space-y-4">
          {liveAdmissions.map(p => (
            <div key={p.uhid} className="rounded-xl border border-border bg-surface p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-text-primary">{p.patientName}</span>
                    <span className="text-xs text-text-secondary">{p.uhid}</span>
                  </div>
                  <p className="mt-1 text-sm text-text-secondary">Expected: {p.expectedDischarge} · LOS: {p.lengthOfStay}d</p>
                  <p className="mt-0.5 text-sm text-text-secondary">Diagnosis: {p.diagnosis}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => { setSelectedPatient(p); navTo("discharge-checklist"); }}>Discharge</Button>
                  <Button size="sm" variant="outline">Defer</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function DischargeChecklistScreen() {
    const p = selectedPatient;
    return (
      <div className="space-y-6">
        <IpdPageHeader title="Discharge Checklist" subtitle={`${p.patientName} — ${p.uhid}`} actions={<Button variant="ghost" onClick={() => navTo("discharge-planning")}><ArrowLeft className="mr-2 size-4" />Back</Button>} />
        <IpdSection title="Discharge Checklist">
          <div className="space-y-3">
            {["Doctor approval obtained", "Prescriptions reviewed", "Medications dispensed", "Lab results reviewed", "Insurance pre-authorization", "Follow-up appointments scheduled", "Patient education completed", "Discharge summary printed", "Bed released for cleaning", "Patient belongings returned"].map((item, i) => (
              <label key={i} className="flex items-center gap-3 rounded-lg border border-border p-3">
                <input type="checkbox" className="size-4 rounded border-border" defaultChecked={i < 3} />
                <span className="text-sm text-text-primary">{item}</span>
              </label>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={() => { toast.success("Patient discharged successfully"); navTo("bed-release"); }}>Complete Discharge</Button>
            <Button variant="outline" onClick={() => navTo("discharge-planning")}>Cancel</Button>
          </div>
        </IpdSection>
      </div>
    );
  }

  function BedReleaseScreen() {
    return (
      <div className="space-y-6">
        <IpdPageHeader title="Bed Release" subtitle="Release beds after patient discharge" />
        <div className="space-y-4">
          {liveBeds.filter(b => b.status === "Reserved" || (b.patientName && b.status === "Occupied")).map(b => (
            <div key={b.id} className="rounded-xl border border-border bg-surface p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-text-primary">Bed {b.number}</span>
                    <BedStatusBadge status={b.status}>{b.status}</BedStatusBadge>
                  </div>
                  <p className="text-sm text-text-secondary">{b.wardName} · Room {b.roomNumber}</p>
                  {b.patientName && <p className="mt-0.5 text-sm text-text-secondary">Patient: {b.patientName}</p>}
                </div>
                <Button size="sm" onClick={() => { toast.success("Bed released for cleaning"); navTo("bed-cleaning"); }}>Release Bed</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function BedCleaningScreen() {
    return (
      <div className="space-y-6">
        <IpdPageHeader title="Bed Cleaning Workflow" subtitle="Track cleaning status and turnaround time" />
        <div className="space-y-4">
          {CLEANING_REQUESTS.map(cr => (
            <div key={cr.requestId} className="rounded-xl border border-border bg-surface p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-text-primary">Bed {cr.bedNumber}</span>
                    <CleaningStatusBadge status={cr.status}>{cr.status}</CleaningStatusBadge>
                  </div>
                  <p className="text-sm text-text-secondary">{cr.wardName} · Room {cr.roomNumber}</p>
                  <p className="mt-0.5 text-sm text-text-secondary">Assigned: {cr.assignedTo}</p>
                  {cr.startTime && <p className="text-xs text-text-secondary">Started: {cr.startTime}</p>}
                  {cr.endTime && <p className="text-xs text-text-secondary">Completed: {cr.endTime}</p>}
                  {cr.inspectionBy && <p className="text-xs text-text-secondary">Inspected by: {cr.inspectionBy}</p>}
                </div>
                {cr.status === "In Progress" && (
                  <Button size="sm" onClick={() => toast.success("Cleaning completed for bed " + cr.bedNumber)}>Mark Complete</Button>
                )}
                {cr.status === "Completed" && (
                  <Button size="sm" variant="outline" onClick={() => toast.success("Inspection passed for bed " + cr.bedNumber)}>Inspect & Approve</Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function OccupancyDashboardScreen() {
    const wardOccupancy = WARDS.map(w => ({
      ...w,
      occupancyPct: Math.round((w.occupiedBeds / w.totalBeds) * 100),
    }));
    return (
      <div className="space-y-6">
        <IpdPageHeader title="Occupancy Dashboard" subtitle="Real-time occupancy overview" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <IpdStatCard icon={BedDouble} label="Total Beds" value={totalBeds} />
          <IpdStatCard icon={Users} label="Occupied" value={occupiedBeds} tone="danger" />
          <IpdStatCard icon={BedDouble} label="Available" value={totalBeds - occupiedBeds} tone="success" />
          <IpdStatCard icon={BarChart3} label="Occupancy %" value={`${occupancyPct}%`} tone={occupancyPct >= 90 ? "danger" : "success"} />
        </div>
        <IpdSection title="Ward-wise Occupancy">
          <div className="space-y-4">
            {wardOccupancy.map(w => (
              <div key={w.id} className="flex items-center gap-4">
                <span className="w-40 text-sm font-medium text-text-primary">{w.name}</span>
                <div className="flex-1">
                  <div className="h-3 overflow-hidden rounded-full bg-muted">
                    <div className={`h-full rounded-full ${w.occupancyPct >= 90 ? "bg-danger" : w.occupancyPct >= 75 ? "bg-warning" : "bg-success"}`} style={{ width: `${w.occupancyPct}%` }} />
                  </div>
                </div>
                <span className={`w-12 text-right text-sm font-bold ${w.occupancyPct >= 90 ? "text-danger" : w.occupancyPct >= 75 ? "text-[#b45309]" : "text-success"}`}>{w.occupancyPct}%</span>
                <span className="w-24 text-xs text-text-secondary">{w.occupiedBeds}/{w.totalBeds}</span>
              </div>
            ))}
          </div>
        </IpdSection>
      </div>
    );
  }

  function ReportsScreen() {
    return (
      <div className="space-y-6">
        <IpdPageHeader title="Reports" subtitle="Generate and view IPD reports" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "Occupancy Report", desc: "Ward-wise bed occupancy summary" },
            { title: "Admission Summary", desc: "Admissions, discharges, and transfers" },
            { title: "Length of Stay Report", desc: "Average LOS by ward and department" },
            { title: "Isolation Report", desc: "Isolation patients and precautions" },
            { title: "Cleaning Turnaround", desc: "Bed cleaning time metrics" },
            { title: "Transfer Report", desc: "Inter-ward transfer statistics" },
          ].map((r, i) => (
            <div key={i} className="rounded-xl border border-border bg-surface p-5">
              <h3 className="font-semibold text-text-primary">{r.title}</h3>
              <p className="mt-1 text-sm text-text-secondary">{r.desc}</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={() => toast.info("Generating " + r.title)}>Generate</Button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function AlertsNotificationsScreen() {
    return (
      <div className="space-y-6">
        <IpdPageHeader title="Alerts & Notifications" subtitle="Real-time alerts and system notifications" />
        <div className="space-y-4">
          {[
            { type: "danger", title: "ICU Bed Critical", desc: "ICU occupancy at 83% — only 1 bed available", time: "2m ago" },
            { type: "warning", title: "Cleaning Delayed", desc: "Bed 402-A cleaning exceeded 30 min SLA", time: "15m ago" },
            { type: "info", title: "Transfer Request", desc: "Rajesh Kumar — General Ward A → Cardiac Ward", time: "30m ago" },
            { type: "success", title: "Bed Ready", desc: "Bed 102-B cleaned and inspected", time: "1h ago" },
            { type: "danger", title: "Isolation Alert", desc: "Anil Kulkarni — airborne isolation ordered", time: "2h ago" },
          ].map((a, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4">
              <div className={`mt-0.5 size-2 rounded-full ${a.type === "danger" ? "bg-danger" : a.type === "warning" ? "bg-warning" : a.type === "success" ? "bg-success" : "bg-info"}`} />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-text-primary">{a.title}</span>
                  <span className="text-xs text-text-secondary">{a.time}</span>
                </div>
                <p className="text-sm text-text-secondary">{a.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function WorkflowCompleteScreen() {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="grid size-16 place-items-center rounded-full bg-success/10"><CheckCircle2 className="size-8 text-success" /></div>
        <h2 className="mt-6 text-2xl font-bold text-text-primary">IPD Workflow Complete</h2>
        <p className="mt-2 max-w-md text-text-secondary">All IPD screens have been demonstrated. In production, this screen guides ward staff through admission, bedside care, and discharge workflows.</p>
        <Button className="mt-8" onClick={() => navTo("dashboard")}>Return to Dashboard</Button>
      </div>
    );
  }

  return (
    <Shell
      nav={NAV}
      navSecondary={NAV_SECONDARY}
      sectionLabel="Inpatient Department"
      activeId={route}
      onNavigate={(id) => navTo(id as IpdRoute)}
      breadcrumb={CRUMBS[route]}
      roleName={roleName}
      onSignOut={onSignOut}
      workspace="ipd"
      onSwitchWorkspace={onSwitchWorkspace}
      onOpenSettings={onOpenSettings}
    >
      {renderScreen()}
    </Shell>
  );
}
