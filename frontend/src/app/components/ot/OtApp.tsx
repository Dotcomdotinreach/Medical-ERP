import { useState, useEffect } from "react";
import {
  Activity, AlertTriangle, ArrowLeft, ArrowRight, BadgeCheck, BarChart3,
  CalendarDays, CheckCircle2, ChevronRight, ClipboardList, Clock,
  FileText, Hammer, Heart, ListChecks, Printer, Search, Send,
  ShieldAlert, Stethoscope, Timer, TriangleAlert, Users, Zap,
  Scissors as ScissorsIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Shell, type NavItem, type Workspace } from "../his/Shell";
import { StatusBadge } from "../his/ui";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  SurgeryStatusBadge, OTRoomStatusBadge, ConsentStatusBadge, SterilityBadge,
  ASABadge, ChecklistPhaseBadge, TurnoverStatusBadge, PacuPhaseBadge,
  OtStatCard, OtSection, OtPageHeader, SurgeryCard, OtRoomCard,
  VitalsWidget, TeamMemberPill,
} from "./otUi";
import {
  SURGERIES, OT_ROOMS, SURGEONS, ANESTHESIOLOGISTS, TEAM_ASSIGNMENTS,
  CONSENTS, PRE_OP_ASSESSMENTS, EQUIPMENT, ANESTHESIA_RECORDS,
  PACU_RECORDS, TURNOVER_RECORDS, AUDIT_LOGS,
  type Surgery, type OTRoom,
} from "./data";
import { otApi } from "../../services/ot";

type OtRoute =
  | "dashboard" | "surgery-schedule" | "ot-calendar" | "pre-op-assessment"
  | "consent-management" | "ot-room-allocation" | "team-assignment"
  | "equipment-management" | "who-checklist" | "anesthesia-management"
  | "live-surgery" | "intraop-documentation" | "procedure-completion"
  | "pacu-recovery" | "transfer-to-ward" | "ot-cleaning"
  | "ot-analytics" | "complete";

function Scissors(props: React.SVGProps<SVGSVGElement>) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="6" cy="6" r="3"/><path d="M8.12 8.12 12 12"/><path d="M20 4 8.12 15.88"/><circle cx="6" cy="18" r="3"/><path d="M14.8 14.8 20 20"/></svg>;
}

const NAV: NavItem[] = [
  { id: "dashboard", label: "OT Dashboard", icon: Activity },
  { id: "surgery-schedule", label: "Surgery Schedule", icon: ClipboardList, badge: "9" },
  { id: "ot-calendar", label: "OT Calendar", icon: CalendarDays },
  { id: "pre-op-assessment", label: "Pre-Op Assessment", icon: Stethoscope },
  { id: "consent-management", label: "Consent Mgmt", icon: ShieldAlert, badge: "2", tone: "warning" },
  { id: "ot-room-allocation", label: "Room Allocation", icon: Scissors },
  { id: "team-assignment", label: "Team Assignment", icon: Users },
  { id: "equipment-management", label: "Equipment", icon: Hammer },
  { id: "who-checklist", label: "WHO Checklist", icon: CheckCircle2 },
];
const NAV_SECONDARY: NavItem[] = [
  { id: "anesthesia-management", label: "Anesthesia", icon: Heart },
  { id: "live-surgery", label: "Live Surgery", icon: Activity, badge: "2", tone: "danger" },
  { id: "intraop-documentation", label: "Intra-Op Docs", icon: FileText },
  { id: "procedure-completion", label: "Procedure Complete", icon: CheckCircle2 },
  { id: "pacu-recovery", label: "PACU Recovery", icon: Heart },
  { id: "transfer-to-ward", label: "Transfer", icon: ArrowRight },
  { id: "ot-cleaning", label: "OT Cleaning", icon: Hammer, badge: "1", tone: "warning" },
  { id: "ot-analytics", label: "Analytics", icon: BarChart3 },
];

const CRUMBS: Record<OtRoute, string[]> = {
  dashboard: ["OT", "Dashboard"],
  "surgery-schedule": ["OT", "Surgery Schedule"],
  "ot-calendar": ["OT", "OT Calendar"],
  "pre-op-assessment": ["OT", "Pre-Op Assessment"],
  "consent-management": ["OT", "Consent Management"],
  "ot-room-allocation": ["OT", "Room Allocation"],
  "team-assignment": ["OT", "Team Assignment"],
  "equipment-management": ["OT", "Equipment Management"],
  "who-checklist": ["OT", "WHO Checklist"],
  "anesthesia-management": ["OT", "Anesthesia Management"],
  "live-surgery": ["OT", "Live Surgery Status"],
  "intraop-documentation": ["OT", "Intra-Op Documentation"],
  "procedure-completion": ["OT", "Procedure Completion"],
  "pacu-recovery": ["OT", "PACU Recovery"],
  "transfer-to-ward": ["OT", "Transfer to Ward"],
  "ot-cleaning": ["OT", "OT Cleaning & Turnover"],
  "ot-analytics": ["OT", "Analytics"],
  complete: ["OT", "Workflow Complete"],
};

export function OtApp({ roleName, onSignOut, onSwitchWorkspace, onOpenSettings }: {
  roleName: string; onSignOut: () => void; onSwitchWorkspace: (w: Workspace) => void; onOpenSettings?: (page: string) => void;
}) {
  const [route, setRoute] = useState<OtRoute>("dashboard");
  const [liveSurgeries, setLiveSurgeries] = useState<any[]>(SURGERIES);
  const [selectedSurgery, setSelectedSurgery] = useState<Surgery>(liveSurgeries[0] || SURGERIES[0]);

  useEffect(() => {
    otApi.listSurgeries().then(r => {
      if (r.data?.length) setLiveSurgeries(r.data.map((s: any) => ({
        id: s._id,
        surgeryId: s.surgeryId || s._id,
        patientName: s.patient ? `${s.patient.firstName} ${s.patient.lastName}` : "",
        uhid: s.patient?.uhid || "",
        doctor: s.doctor?.name || "",
        procedure: s.procedure || "",
        type: s.type || " elective",
        priority: s.priority || "Routine",
        status: s.status || "Scheduled",
        scheduledDate: s.scheduledDate || "",
        scheduledTime: s.scheduledTime || "",
        duration: s.estimatedDuration || 0,
        anesthesiaType: s.anesthesiaType || "GA",
        otRoom: s.otRoom || "",
        preOpDiagnosis: s.preOpDiagnosis || "",
      })));
    }).catch(() => {});
  }, []);

  const navTo = (r: OtRoute) => setRoute(r);

  const todaySurgeries = liveSurgeries.filter(s => s.scheduledDate === "2026-07-23");
  const runningCount = liveSurgeries.filter(s => s.status === "In Progress").length;
  const emergencyCount = liveSurgeries.filter(s => s.status === "Emergency").length;
  const availableRooms = OT_ROOMS.filter(r => r.status === "Available").length;
  const pacuOccupancy = PACU_RECORDS.filter(r => !r.dischargeTime).length;

  function renderScreen() {
    switch (route) {
      case "dashboard": return <DashboardScreen />;
      case "surgery-schedule": return <SurgeryScheduleScreen />;
      case "ot-calendar": return <OTCalendarScreen />;
      case "pre-op-assessment": return <PreOpAssessmentScreen />;
      case "consent-management": return <ConsentManagementScreen />;
      case "ot-room-allocation": return <OTRoomAllocationScreen />;
      case "team-assignment": return <TeamAssignmentScreen />;
      case "equipment-management": return <EquipmentManagementScreen />;
      case "who-checklist": return <WHOChecklistScreen />;
      case "anesthesia-management": return <AnesthesiaManagementScreen />;
      case "live-surgery": return <LiveSurgeryScreen />;
      case "intraop-documentation": return <IntraopDocumentationScreen />;
      case "procedure-completion": return <ProcedureCompletionScreen />;
      case "pacu-recovery": return <PACURecoveryScreen />;
      case "transfer-to-ward": return <TransferToWardScreen />;
      case "ot-cleaning": return <OTCleaningScreen />;
      case "ot-analytics": return <OTAnalyticsScreen />;
      case "complete": return <WorkflowCompleteScreen />;
      default: return <DashboardScreen />;
    }
  }

  /* ──────────────────────────────────────────────────────── SCREEN 01: Dashboard */
  function DashboardScreen() {
    return (
      <div className="space-y-6">
        <OtPageHeader title="OT Dashboard" subtitle="Today's perioperative overview — 23 July 2026" actions={
          <Button onClick={() => navTo("surgery-schedule")} className="bg-primary text-white"><ClipboardList className="mr-2 size-4" />Surgery Schedule</Button>
        } />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <OtStatCard icon={ClipboardList} label="Today's Surgeries" value={todaySurgeries.length} trend={12} />
          <OtStatCard icon={Activity} label="Running" value={runningCount} tone="warning" hint="2 in progress now" />
          <OtStatCard icon={Zap} label="Emergency Cases" value={emergencyCount} tone="danger" />
          <OtStatCard icon={Scissors} label="Available OT Rooms" value={`${availableRooms}/${OT_ROOMS.length}`} tone="success" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <OtStatCard icon={Clock} label="Delayed Cases" value={0} tone="neutral" />
          <OtStatCard icon={Heart} label="PACU Occupancy" value={pacuOccupancy} tone="info" />
          <OtStatCard icon={AlertTriangle} label="Equipment Alerts" value={1} tone="warning" />
          <OtStatCard icon={CheckCircle2} label="Completed" value={todaySurgeries.filter(s => s.status === "Completed").length} tone="success" />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <OtSection title="OT Room Status" className="lg:col-span-2" action={<Button variant="ghost" size="sm" onClick={() => navTo("ot-room-allocation")}>View All <ChevronRight className="ml-1 size-4" /></Button>}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {OT_ROOMS.map(room => <OtRoomCard key={room.id} room={room} onClick={() => navTo("ot-room-allocation")} />)}
            </div>
          </OtSection>
          <OtSection title="Running Surgeries" action={<Button variant="ghost" size="sm" onClick={() => navTo("live-surgery")}>Live <ChevronRight className="ml-1 size-4" /></Button>}>
            {liveSurgeries.filter(s => s.status === "In Progress").map(s => (
              <div key={s.id} className="border-b border-border py-3 last:border-b-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-text-primary">{s.patientName}</span>
                  <SurgeryStatusBadge status={s.status}>{s.status}</SurgeryStatusBadge>
                </div>
                <p className="text-xs text-text-secondary">{s.procedure} · {s.otRoom}</p>
                <p className="text-xs text-text-secondary">Surgeon: {s.surgeon}</p>
              </div>
            ))}
          </OtSection>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <OtSection title="Upcoming Procedures">
            {todaySurgeries.filter(s => s.status === "Scheduled").map(s => (
              <div key={s.id} className="flex items-center justify-between border-b border-border py-3 last:border-b-0">
                <div>
                  <span className="text-sm font-medium text-text-primary">{s.scheduledTime} — {s.patientName}</span>
                  <p className="text-xs text-text-secondary">{s.procedure} · {s.otRoom}</p>
                </div>
                <span className={`text-xs font-medium ${s.priority === "Emergency" ? "text-danger" : s.priority === "Urgent" ? "text-[#b45309]" : "text-text-secondary"}`}>{s.priority}</span>
              </div>
            ))}
          </OtSection>
          <OtSection title="Recent Activity">
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
          </OtSection>
        </div>
      </div>
    );
  }

  /* ──────────────────────────────────────────────────────── SCREEN 02: Surgery Schedule */
  function SurgeryScheduleScreen() {
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const filtered = filterStatus === "all" ? liveSurgeries : liveSurgeries.filter(s => s.status === filterStatus);
    return (
      <div className="space-y-6">
        <OtPageHeader title="Surgery Schedule" subtitle={`${liveSurgeries.length} procedures today`} actions={<Button variant="outline"><Printer className="mr-2 size-4" />Print Schedule</Button>} />
        <Input placeholder="Search by patient, procedure, or surgeon…" icon={<Search className="size-4" />} className="max-w-sm" />
        <div className="flex flex-wrap gap-2">
          {["all", "Scheduled", "In Progress", "Completed", "Emergency"].map(f => (
            <Button key={f} variant={filterStatus === f ? "default" : "outline"} size="sm" onClick={() => setFilterStatus(f)}>
              {f === "all" ? "All" : f}
            </Button>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-3 font-medium text-text-secondary">Time</th>
                <th className="pb-3 font-medium text-text-secondary">Patient</th>
                <th className="pb-3 font-medium text-text-secondary">Procedure</th>
                <th className="pb-3 font-medium text-text-secondary">Surgeon</th>
                <th className="pb-3 font-medium text-text-secondary">Anesthesia</th>
                <th className="pb-3 font-medium text-text-secondary">OT Room</th>
                <th className="pb-3 font-medium text-text-secondary">Duration</th>
                <th className="pb-3 font-medium text-text-secondary">Status</th>
                <th className="pb-3 font-medium text-text-secondary">Priority</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id} className="border-b border-border hover:bg-muted/50 cursor-pointer" onClick={() => { setSelectedSurgery(s); navTo("live-surgery"); }}>
                  <td className="py-3 font-medium text-text-primary">{s.scheduledTime}</td>
                  <td className="py-3 text-text-secondary">{s.patientName}<br /><span className="text-xs text-text-secondary">{s.uhid}</span></td>
                  <td className="py-3 text-text-secondary">{s.procedure}</td>
                  <td className="py-3 text-text-secondary">{s.surgeon}</td>
                  <td className="py-3 text-text-secondary">{s.anesthesiaType}</td>
                  <td className="py-3 text-text-secondary">{s.otRoom}</td>
                  <td className="py-3 text-text-secondary">{s.estimatedDuration} min</td>
                  <td className="py-3"><SurgeryStatusBadge status={s.status}>{s.status}</SurgeryStatusBadge></td>
                  <td className="py-3"><span className={`text-xs font-medium ${s.priority === "Emergency" ? "text-danger" : s.priority === "Urgent" ? "text-[#b45309]" : "text-text-secondary"}`}>{s.priority}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  /* ──────────────────────────────────────────────────────── SCREEN 03: OT Calendar */
  function OTCalendarScreen() {
    const days = ["Mon 21", "Tue 22", "Wed 23", "Thu 24", "Fri 25", "Sat 26", "Sun 27"];
    return (
      <div className="space-y-6">
        <OtPageHeader title="OT Calendar" subtitle="Weekly view — July 2026" actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Daily</Button>
            <Button variant="default" size="sm">Weekly</Button>
            <Button variant="outline" size="sm">Monthly</Button>
          </div>
        } />
        <div className="overflow-x-auto rounded-xl border border-border bg-surface">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-8 border-b border-border">
              <div className="border-r border-border p-3 text-xs font-medium text-text-secondary">OT Room</div>
              {days.map((d, i) => (
                <div key={i} className={`border-r border-border p-3 text-center text-xs font-medium ${i === 2 ? "bg-secondary text-primary" : "text-text-secondary"}`}>{d}</div>
              ))}
            </div>
            {OT_ROOMS.slice(0, 5).map(room => (
              <div key={room.id} className="grid grid-cols-8 border-b border-border">
                <div className="border-r border-border p-3">
                  <div className="text-sm font-medium text-text-primary">{room.number}</div>
                  <div className="text-[10px] text-text-secondary">{room.type}</div>
                </div>
                {days.map((_, i) => {
                  const surgeries = liveSurgeries.filter(s => s.otRoomId === room.id && s.scheduledDate === `2026-07-${21 + i}`);
                  return (
                    <div key={i} className={`border-r border-border p-2 ${i === 2 ? "bg-secondary/5" : ""}`}>
                      {surgeries.map(s => (
                        <div key={s.id} className="mb-1 rounded bg-primary/10 px-1.5 py-1 text-[10px] text-primary">
                          {s.scheduledTime} {s.procedure.split(" ").slice(0, 2).join(" ")}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ──────────────────────────────────────────────────────── SCREEN 04: Pre-Op Assessment */
  function PreOpAssessmentScreen() {
    const a = PRE_OP_ASSESSMENTS[0];
    return (
      <div className="space-y-6">
        <OtPageHeader title="Pre-Operative Assessment" subtitle="Complete surgical workup before procedure" />
        <div className="space-y-4">
          {PRE_OP_ASSESSMENTS.map(p => (
            <div key={p.surgeryId} className="rounded-xl border border-border bg-surface p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-text-primary">{p.patientName}</span>
                    <span className="text-xs text-text-secondary">{p.uhid}</span>
                    <ASABadge cls={p.asaClass} />
                  </div>
                  <p className="mt-1 text-sm text-text-secondary">Airway: {p.airwayAssessment}</p>
                  <p className="text-sm text-text-secondary">Allergies: {p.allergies}</p>
                  <p className="text-sm text-text-secondary">Medications: {p.currentMedications}</p>
                  <p className="mt-2 text-sm text-text-secondary font-medium">Risk: {p.riskScore}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <StatusBadge tone={p.labClearance ? "success" : "danger"}>Lab {p.labClearance ? "✓" : "✗"}</StatusBadge>
                  <StatusBadge tone={p.radiologyClearance ? "success" : "danger"}>Radiology {p.radiologyClearance ? "✓" : "✗"}</StatusBadge>
                  <StatusBadge tone={p.anesthesiaClearance ? "success" : "danger"}>Anesthesia {p.anesthesiaClearance ? "✓" : "✗"}</StatusBadge>
                  <StatusBadge tone={p.surgicalClearance ? "success" : "danger"}>Surgical {p.surgicalClearance ? "✓" : "✗"}</StatusBadge>
                </div>
              </div>
              {p.notes && <p className="mt-3 rounded-lg bg-muted p-3 text-xs text-text-secondary">{p.notes}</p>}
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ──────────────────────────────────────────────────────── SCREEN 05: Consent Management */
  function ConsentManagementScreen() {
    return (
      <div className="space-y-6">
        <OtPageHeader title="Consent Management" subtitle="Surgical, anesthesia, blood transfusion, and implant consents" />
        <div className="space-y-4">
          {CONSENTS.map(c => (
            <div key={c.id} className="rounded-xl border border-border bg-surface p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-text-primary">{c.patientName}</span>
                    <span className="text-xs text-text-secondary">{c.uhid}</span>
                    <ConsentStatusBadge status={c.status} />
                  </div>
                  <p className="mt-1 text-sm text-text-secondary">Type: {c.consentType} Consent</p>
                  {c.signedBy && <p className="text-xs text-text-secondary">Signed by: {c.signedBy} at {c.signedAt}</p>}
                  {c.witnessBy && <p className="text-xs text-text-secondary">Witness: {c.witnessBy}</p>}
                  {c.verifiedBy && <p className="text-xs text-text-secondary">Verified by: {c.verifiedBy} at {c.verifiedAt}</p>}
                </div>
                <div className="flex gap-2">
                  {c.status === "Pending" && <Button size="sm" onClick={() => toast.success("Consent signed")}>Sign Consent</Button>}
                  {c.status === "Signed" && <Button size="sm" onClick={() => toast.success("Consent verified")}>Verify</Button>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ──────────────────────────────────────────────────────── SCREEN 06: OT Room Allocation */
  function OTRoomAllocationScreen() {
    return (
      <div className="space-y-6">
        <OtPageHeader title="OT Room Allocation" subtitle="Assign and manage OT rooms" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {OT_ROOMS.map(room => <OtRoomCard key={room.id} room={room} onClick={() => toast.info("Managing " + room.name)} />)}
        </div>
      </div>
    );
  }

  /* ──────────────────────────────────────────────────────── SCREEN 07: Team Assignment */
  function TeamAssignmentScreen() {
    return (
      <div className="space-y-6">
        <OtPageHeader title="Surgical Team Assignment" subtitle="Assign surgical teams to procedures" />
        <div className="space-y-4">
          {TEAM_ASSIGNMENTS.map(t => (
            <div key={t.surgeryId} className="rounded-xl border border-border bg-surface p-5">
              <div className="mb-4">
                <span className="font-semibold text-text-primary">{t.patientName}</span>
                <span className="ml-2 text-sm text-text-secondary">{t.procedure}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
                <TeamMemberPill name={t.primarySurgeon} role="Surgeon" />
                {t.assistantSurgeon && <TeamMemberPill name={t.assistantSurgeon} role="Assistant" />}
                <TeamMemberPill name={t.anesthesiologist} role="Anesthesiologist" />
                <TeamMemberPill name={t.scrubNurse} role="Scrub Nurse" />
                <TeamMemberPill name={t.circulatingNurse} role="Circulating Nurse" />
                {t.technician && <TeamMemberPill name={t.technician} role="Technician" />}
                {t.perfusionist && <TeamMemberPill name={t.perfusionist} role="Perfusionist" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ──────────────────────────────────────────────────────── SCREEN 08: Equipment Management */
  function EquipmentManagementScreen() {
    return (
      <div className="space-y-6">
        <OtPageHeader title="Equipment & Instrument Management" subtitle="Track sterilization, availability, and assignment" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-3 font-medium text-text-secondary">Equipment</th>
                <th className="pb-3 font-medium text-text-secondary">Category</th>
                <th className="pb-3 font-medium text-text-secondary">Status</th>
                <th className="pb-3 font-medium text-text-secondary">Sterility</th>
                <th className="pb-3 font-medium text-text-secondary">Sterilized</th>
                <th className="pb-3 font-medium text-text-secondary">Expires</th>
                <th className="pb-3 font-medium text-text-secondary">Assigned To</th>
              </tr>
            </thead>
            <tbody>
              {EQUIPMENT.map(e => (
                <tr key={e.id} className="border-b border-border hover:bg-muted/50">
                  <td className="py-3 font-medium text-text-primary">{e.name}</td>
                  <td className="py-3 text-text-secondary">{e.category}</td>
                  <td className="py-3">
                    <StatusBadge tone={e.status === "Available" ? "success" : e.status === "In Use" ? "warning" : "danger"}>{e.status}</StatusBadge>
                  </td>
                  <td className="py-3"><SterilityBadge status={e.sterilizationStatus} /></td>
                  <td className="py-3 text-text-secondary text-xs">{e.sterilizedAt || "—"}</td>
                  <td className="py-3 text-text-secondary text-xs">{e.expiresAt || "—"}</td>
                  <td className="py-3 text-text-secondary text-xs">{e.assignedTo || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  /* ──────────────────────────────────────────────────────── SCREEN 09: WHO Checklist */
  function WHOChecklistScreen() {
    const [signin, setSignin] = useState([true, true, true, true, true]);
    const [timeout_, setTimeout_] = useState([true, false, false, false, false]);
    const [signout, setSignout] = useState([false, false, false, false, false]);
    const s = selectedSurgery;
    const CheckItem = ({ label, checked, onToggle }: { label: string; checked: boolean; onToggle: () => void }) => (
      <label className="flex items-center gap-3 rounded-lg border border-border p-3 cursor-pointer hover:bg-muted/50">
        <input type="checkbox" checked={checked} onChange={onToggle} className="size-4 rounded border-border" />
        <span className={`text-sm ${checked ? "text-text-primary" : "text-text-secondary"}`}>{label}</span>
      </label>
    );
    return (
      <div className="space-y-6">
        <OtPageHeader title="WHO Surgical Safety Checklist" subtitle={`${s.patientName} — ${s.procedure}`} actions={
          <div className="flex gap-2">
            <ChecklistPhaseBadge phase="Sign In" />
            <ChecklistPhaseBadge phase="Time Out" />
            <ChecklistPhaseBadge phase="Sign Out" />
          </div>
        } />
        <OtSection title="Sign In — Before Anesthesia Induction">
          <div className="space-y-2">
            {["Hospital identified", "Patient identity confirmed (name, DOB, UHID)", "Procedure consent verified", "Surgical site marked", "Anesthesia safety check completed"].map((item, i) => (
              <CheckItem key={i} label={item} checked={signin[i]} onToggle={() => { const n = [...signin]; n[i] = !n[i]; setSignin(n); }} />
            ))}
          </div>
        </OtSection>
        <OtSection title="Time Out — Before Skin Incision">
          <div className="space-y-2">
            {["Team introduction (names & roles)", "Correct patient, procedure, site confirmed", "Antibiotic prophylaxis given within 60 min", "Imaging displayed", "Critical steps discussed"].map((item, i) => (
              <CheckItem key={i} label={item} checked={timeout_[i]} onToggle={() => { const n = [...timeout_]; n[i] = !n[i]; setTimeout_(n); }} />
            ))}
          </div>
        </OtSection>
        <OtSection title="Sign Out — Before Patient Leaves OT">
          <div className="space-y-2">
            {["Instrument count correct", "Specimen labeled correctly", "Equipment issues noted", "Key concerns for recovery", "Procedure & implant details recorded"].map((item, i) => (
              <CheckItem key={i} label={item} checked={signout[i]} onToggle={() => { const n = [...signout]; n[i] = !n[i]; setSignout(n); }} />
            ))}
          </div>
        </OtSection>
        <Button onClick={() => toast.success("WHO Checklist completed")}>Confirm Checklist Complete</Button>
      </div>
    );
  }

  /* ──────────────────────────────────────────────────────── SCREEN 10: Anesthesia Management */
  function AnesthesiaManagementScreen() {
    const rec = ANESTHESIA_RECORDS[0];
    return (
      <div className="space-y-6">
        <OtPageHeader title="Anesthesia Management" subtitle={`${rec.patientName} — ${rec.anesthesiaType}`} />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <OtSection title="Current Vitals">
            {rec.vitals.length > 0 && <VitalsWidget vitals={rec.vitals[rec.vitals.length - 1]} />}
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border"><th className="pb-2 text-left text-text-secondary">Time</th><th className="pb-2 text-left text-text-secondary">BP</th><th className="pb-2 text-left text-text-secondary">HR</th><th className="pb-2 text-left text-text-secondary">SpO2</th><th className="pb-2 text-left text-text-secondary">EtCO2</th><th className="pb-2 text-left text-text-secondary">Temp</th></tr>
                </thead>
                <tbody>
                  {rec.vitals.map((v, i) => (
                    <tr key={i} className="border-b border-border"><td className="py-2 text-text-primary">{v.time}</td><td className="py-2 text-text-secondary">{v.bp}</td><td className="py-2 text-text-secondary">{v.hr}</td><td className="py-2 text-text-secondary">{v.spo2}%</td><td className="py-2 text-text-secondary">{v.etco2 || "—"}</td><td className="py-2 text-text-secondary">{v.temp}°</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </OtSection>
          <OtSection title="Drug Administration">
            <div className="space-y-2">
              {rec.drugs.map((d, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg border border-border p-3">
                  <div className="grid size-8 place-items-center rounded bg-secondary text-xs font-bold text-primary">{d.time}</div>
                  <div>
                    <div className="text-sm font-medium text-text-primary">{d.name}</div>
                    <div className="text-xs text-text-secondary">{d.dose}</div>
                  </div>
                </div>
              ))}
            </div>
          </OtSection>
        </div>
        <OtSection title="Ventilator Settings">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-lg bg-muted p-3 text-center"><div className="text-xs text-text-secondary">TV</div><div className="text-lg font-bold text-text-primary">{rec.ventilatorSettings.tv} ml</div></div>
            <div className="rounded-lg bg-muted p-3 text-center"><div className="text-xs text-text-secondary">RR</div><div className="text-lg font-bold text-text-primary">{rec.ventilatorSettings.rr}/min</div></div>
            <div className="rounded-lg bg-muted p-3 text-center"><div className="text-xs text-text-secondary">FiO2</div><div className="text-lg font-bold text-text-primary">{rec.ventilatorSettings.fio2}%</div></div>
            <div className="rounded-lg bg-muted p-3 text-center"><div className="text-xs text-text-secondary">PEEP</div><div className="text-lg font-bold text-text-primary">{rec.ventilatorSettings.peep} cmH₂O</div></div>
          </div>
        </OtSection>
      </div>
    );
  }

  /* ──────────────────────────────────────────────────────── SCREEN 11: Live Surgery Status */
  function LiveSurgeryScreen() {
    const s = selectedSurgery;
    const elapsed = s.actualStartTime ? Math.floor((Date.now() - new Date(`2026-07-23T${s.actualStartTime}:00`).getTime()) / 60000) : 0;
    return (
      <div className="space-y-6">
        <OtPageHeader title="Live Surgery Status" subtitle={`Monitoring — ${s.patientName}`} actions={<Button variant="outline" onClick={() => navTo("surgery-schedule")}><ArrowLeft className="mr-2 size-4" />Back to Schedule</Button>} />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <OtSection title={`${s.procedure}`}>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div><span className="text-xs text-text-secondary">Status</span><div className="mt-1"><SurgeryStatusBadge status={s.status}>{s.status}</SurgeryStatusBadge></div></div>
                <div><span className="text-xs text-text-secondary">Surgeon</span><div className="mt-1 text-sm font-medium text-text-primary">{s.surgeon}</div></div>
                <div><span className="text-xs text-text-secondary">OT Room</span><div className="mt-1 text-sm font-medium text-text-primary">{s.otRoom}</div></div>
                <div><span className="text-xs text-text-secondary">Elapsed</span><div className="mt-1 text-lg font-bold text-text-primary">{elapsed} min</div></div>
              </div>
            </OtSection>
            <OtSection title="Vitals Monitor">
              <VitalsWidget vitals={{ bp: "118/72", hr: 68, spo2: 100, temp: 36.2 }} />
            </OtSection>
            <OtSection title="Intraoperative Summary">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-lg bg-muted p-3 text-center"><div className="text-xs text-text-secondary">Blood Loss</div><div className="text-lg font-bold text-text-primary">350 ml</div></div>
                <div className="rounded-lg bg-muted p-3 text-center"><div className="text-xs text-text-secondary">IV Fluid</div><div className="text-lg font-bold text-text-primary">1500 ml</div></div>
                <div className="rounded-lg bg-muted p-3 text-center"><div className="text-xs text-text-secondary">Urine Output</div><div className="text-lg font-bold text-text-primary">400 ml</div></div>
                <div className="rounded-lg bg-muted p-3 text-center"><div className="text-xs text-text-secondary">Blood Products</div><div className="text-lg font-bold text-text-primary">0 units</div></div>
              </div>
            </OtSection>
          </div>
          <div className="space-y-6">
            <OtSection title="Surgical Team">
              {TEAM_ASSIGNMENTS.filter(t => t.surgeryId === s.id).map(t => (
                <div key={t.surgeryId} className="space-y-2">
                  <TeamMemberPill name={t.primarySurgeon} role="Surgeon" />
                  {t.assistantSurgeon && <TeamMemberPill name={t.assistantSurgeon} role="Assistant" />}
                  <TeamMemberPill name={t.anesthesiologist} role="Anesthesiologist" />
                  <TeamMemberPill name={t.scrubNurse} role="Scrub Nurse" />
                  <TeamMemberPill name={t.circulatingNurse} role="Circulating Nurse" />
                  {t.perfusionist && <TeamMemberPill name={t.perfusionist} role="Perfusionist" />}
                </div>
              ))}
            </OtSection>
            <OtSection title="Procedure Timeline">
              <div className="space-y-3">
                {[{ time: "07:30", event: "Patient arrived in OT" }, { time: "07:40", event: "Anesthesia induction" }, { time: "07:45", event: "Surgery started" }, { time: "09:00", event: "Procedure ongoing" }].map((e, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-1 size-2 rounded-full bg-primary" />
                    <div><div className="text-sm font-medium text-text-primary">{e.event}</div><div className="text-xs text-text-secondary">{e.time}</div></div>
                  </div>
                ))}
              </div>
            </OtSection>
          </div>
        </div>
      </div>
    );
  }

  /* ──────────────────────────────────────────────────────── SCREEN 12: Intra-Op Documentation */
  function IntraopDocumentationScreen() {
    const s = selectedSurgery;
    return (
      <div className="space-y-6">
        <OtPageHeader title="Intraoperative Documentation" subtitle={`${s.patientName} — ${s.procedure}`} actions={<Button variant="outline"><Printer className="mr-2 size-4" />Print</Button>} />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <OtSection title="Procedure Notes">
            <Textarea placeholder="Enter operative notes…" defaultValue="Skin incision made. Anatomical landmarks identified. Procedure performed as planned. Hemostasis achieved. Wound closed in layers. Sterile dressing applied." className="min-h-[120px]" />
          </OtSection>
          <OtSection title="Implants Used">
            <div className="space-y-2">
              <div className="rounded-lg border border-border p-3"><div className="text-sm font-medium text-text-primary">Cementless Femoral Component — Size 3</div><div className="text-xs text-text-secondary">Implant ID: IMP-2026-001 · Lot: LOT-A123</div></div>
              <div className="rounded-lg border border-border p-3"><div className="text-sm font-medium text-text-primary">Polyethylene Insert — Size 3</div><div className="text-xs text-text-secondary">Implant ID: IMP-2026-002 · Lot: LOT-B456</div></div>
            </div>
          </OtSection>
          <OtSection title="Blood Products">
            <div className="rounded-lg border border-border p-3"><div className="text-sm font-medium text-text-primary">Packed RBC — 1 unit</div><div className="text-xs text-text-secondary">Blood ID: BLD-2026-04821 · Transfused at 09:15</div></div>
          </OtSection>
          <OtSection title="Specimens">
            <div className="rounded-lg border border-border p-3"><div className="text-sm font-medium text-text-primary">Right Femoral Head</div><div className="text-xs text-text-secondary">Container: Formalin · Sent to: Histopathology</div></div>
          </OtSection>
        </div>
        <OtSection title="Estimated Blood Loss">
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg bg-muted p-3 text-center"><div className="text-xs text-text-secondary">EBL</div><div className="text-lg font-bold text-text-primary">350 ml</div></div>
            <div className="rounded-lg bg-muted p-3 text-center"><div className="text-xs text-text-secondary">Intake</div><div className="text-lg font-bold text-text-primary">2000 ml</div></div>
            <div className="rounded-lg bg-muted p-3 text-center"><div className="text-xs text-text-secondary">Output</div><div className="text-lg font-bold text-text-primary">750 ml</div></div>
          </div>
        </OtSection>
        <Button onClick={() => toast.success("Documentation saved")}>Save Documentation</Button>
      </div>
    );
  }

  /* ──────────────────────────────────────────────────────── SCREEN 13: Procedure Completion */
  function ProcedureCompletionScreen() {
    const s = selectedSurgery;
    return (
      <div className="space-y-6">
        <OtPageHeader title="Procedure Completion" subtitle={`${s.patientName} — ${s.procedure}`} />
        <OtSection title="Final Summary">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div><span className="text-xs text-text-secondary">Duration</span><div className="mt-1 text-lg font-bold text-text-primary">2h 15m</div></div>
            <div><span className="text-xs text-text-secondary">Blood Loss</span><div className="mt-1 text-lg font-bold text-text-primary">350 ml</div></div>
            <div><span className="text-xs text-text-secondary">Outcome</span><div className="mt-1"><StatusBadge tone="success">Routine</StatusBadge></div></div>
            <div><span className="text-xs text-text-secondary">Instrument Count</span><div className="mt-1"><StatusBadge tone="success">Correct</StatusBadge></div></div>
          </div>
        </OtSection>
        <OtSection title="Complications">
          <Textarea placeholder="No complications…" defaultValue="No intraoperative complications. Patient stable." className="min-h-[80px]" />
        </OtSection>
        <OtSection title="Surgeon Notes">
          <Textarea placeholder="Enter final notes…" defaultValue="Procedure completed successfully. Patient hemodynamically stable. Transferred to PACU." className="min-h-[80px]" />
        </OtSection>
        <div className="flex gap-2">
          <Button onClick={() => { toast.success("Procedure completed — report generated"); navTo("pacu-recovery"); }}>Complete Procedure</Button>
          <Button variant="outline" onClick={() => navTo("live-surgery")}>Back to Surgery</Button>
        </div>
      </div>
    );
  }

  /* ──────────────────────────────────────────────────────── SCREEN 14: PACU Recovery */
  function PACURecoveryScreen() {
    const rec = PACU_RECORDS[0];
    return (
      <div className="space-y-6">
        <OtPageHeader title="PACU Recovery" subtitle="Post-Anesthesia Care Unit monitoring" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <OtSection title={`${rec.patientName} — ${rec.uhid}`}>
            <div className="grid grid-cols-2 gap-4">
              <div><span className="text-xs text-text-secondary">Phase</span><div className="mt-1"><PacuPhaseBadge phase={rec.phase} /></div></div>
              <div><span className="text-xs text-text-secondary">Aldrete Score</span><div className="mt-1 text-lg font-bold text-text-primary">{rec.aldreteScore}/10</div></div>
              <div><span className="text-xs text-text-secondary">Pain Score</span><div className="mt-1 text-lg font-bold text-text-primary">{rec.painScore}/10</div></div>
              <div><span className="text-xs text-text-secondary">Arrival</span><div className="mt-1 text-sm font-medium text-text-primary">{rec.arrivalTime}</div></div>
            </div>
          </OtSection>
          <OtSection title="Vitals">
            {rec.vitals.length > 0 && <VitalsWidget vitals={rec.vitals[rec.vitals.length - 1]} />}
          </OtSection>
        </div>
        <OtSection title="Medications Administered">
          <div className="space-y-2">
            {rec.medications.map((m, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg border border-border p-3">
                <span className="text-sm font-medium text-text-primary">{m.name}</span>
                <span className="text-xs text-text-secondary">{m.dose} {m.route}</span>
                <span className="ml-auto text-xs text-text-secondary">{m.time}</span>
              </div>
            ))}
          </div>
        </OtSection>
        <OtSection title="Discharge Criteria">
          <div className="space-y-2">
            {["Aldrete Score ≥ 9", "Pain controlled (NRS ≤ 3)", "No PONV", "Orientation to person/place/time", "Stable vital signs for 30 min"].map((c, i) => (
              <label key={i} className="flex items-center gap-3 rounded-lg border border-border p-3">
                <input type="checkbox" className="size-4 rounded border-border" defaultChecked={i < 3} />
                <span className="text-sm text-text-primary">{c}</span>
              </label>
            ))}
          </div>
        </OtSection>
        <div className="flex gap-2">
          <Button onClick={() => { toast.success("PACU discharge approved"); navTo("transfer-to-ward"); }}>Discharge from PACU</Button>
          <Button variant="outline">Continue Monitoring</Button>
        </div>
      </div>
    );
  }

  /* ──────────────────────────────────────────────────────── SCREEN 15: Transfer to Ward */
  function TransferToWardScreen() {
    const rec = PACU_RECORDS[0];
    return (
      <div className="space-y-6">
        <OtPageHeader title="Transfer to ICU / Ward" subtitle={`${rec.patientName} — PACU discharge`} />
        <OtSection title="Transfer Details">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">Destination Unit</label>
              <Input defaultValue={rec.destination} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">Receiving Unit</label>
              <Input defaultValue={rec.receivingUnit || ""} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">Receiving Nurse</label>
              <Input placeholder="Enter nurse name" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">Transport Team</label>
              <Input defaultValue="Ward Boy — Sunil" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium text-text-secondary">Transfer Notes</label>
              <Textarea placeholder="Enter transfer notes…" defaultValue="Patient stable. Vitals normal. Pain controlled. Ready for ward transfer." />
            </div>
          </div>
        </OtSection>
        <div className="flex gap-2">
          <Button onClick={() => toast.success("Patient transferred successfully")}>Confirm Transfer</Button>
          <Button variant="outline">Cancel</Button>
        </div>
      </div>
    );
  }

  /* ──────────────────────────────────────────────────────── SCREEN 16: OT Cleaning & Turnover */
  function OTCleaningScreen() {
    return (
      <div className="space-y-6">
        <OtPageHeader title="OT Cleaning & Turnover" subtitle="Room turnover after surgery completion" />
        <div className="space-y-4">
          {TURNOVER_RECORDS.map(tr => (
            <div key={tr.surgeryId} className="rounded-xl border border-border bg-surface p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-text-primary">{tr.otRoom}</span>
                    <TurnoverStatusBadge status={tr.status} />
                  </div>
                  <p className="mt-1 text-sm text-text-secondary">Previous: {tr.previousSurgery}</p>
                  {tr.nextSurgery && <p className="text-xs text-text-secondary">Next: {tr.nextSurgery}</p>}
                  <p className="text-xs text-text-secondary">Assigned: {tr.cleaningAssignedTo}</p>
                  {tr.cleaningStarted && <p className="text-xs text-text-secondary">Started: {tr.cleaningStarted}</p>}
                </div>
                <div className="flex flex-col gap-2">
                  <StatusBadge tone={tr.disinfectionDone ? "success" : "warning"}>Disinfection {tr.disinfectionDone ? "✓" : "…"}</StatusBadge>
                  <StatusBadge tone={tr.inspectionDone ? "success" : "warning"}>Inspection {tr.inspectionDone ? "✓" : "…"}</StatusBadge>
                </div>
              </div>
              {tr.status === "In Progress" && (
                <Button size="sm" className="mt-3" onClick={() => toast.success("Cleaning completed for " + tr.otRoom)}>Mark Cleaning Complete</Button>
              )}
              {tr.status === "Disinfection" && (
                <Button size="sm" className="mt-3" onClick={() => toast.success("Inspection passed for " + tr.otRoom)}>Inspect & Approve</Button>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ──────────────────────────────────────────────────────── SCREEN 17: OT Analytics */
  function OTAnalyticsScreen() {
    return (
      <div className="space-y-6">
        <OtPageHeader title="OT Analytics" subtitle="Performance metrics and utilization data" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <OtStatCard icon={ClipboardList} label="Surgery Volume" value="9" trend={15} hint="Today" />
          <OtStatCard icon={Activity} label="OT Utilization" value="78%" trend={5} tone="success" />
          <OtStatCard icon={Clock} label="Avg Procedure Time" value="128 min" tone="info" />
          <OtStatCard icon={AlertTriangle} label="Cancellation Rate" value="4.2%" trend={-2} tone="success" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <OtStatCard icon={Zap} label="Emergency Surgery Rate" value="11%" tone="warning" />
          <OtStatCard icon={Timer} label="Avg Turnover Time" value="22 min" trend={-8} tone="success" />
          <OtStatCard icon={Hammer} label="Equipment Usage" value="73%" tone="info" />
          <OtStatCard icon={CheckCircle2} label="WHO Compliance" value="100%" tone="success" />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <OtSection title="Surgery Volume by Type">
            <div className="space-y-3">
              {[{ type: "Cardiac", count: 1, pct: 11 }, { type: "Ortho", count: 2, pct: 22 }, { type: "General", count: 3, pct: 33 }, { type: "Gynae", count: 2, pct: 22 }, { type: "Ophthal", count: 1, pct: 11 }].map(t => (
                <div key={t.type} className="flex items-center gap-3">
                  <span className="w-20 text-sm text-text-secondary">{t.type}</span>
                  <div className="flex-1"><div className="h-3 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${t.pct}%` }} /></div></div>
                  <span className="w-12 text-right text-sm font-bold text-text-primary">{t.count}</span>
                </div>
              ))}
            </div>
          </OtSection>
          <OtSection title="OT Room Utilization">
            <div className="space-y-3">
              {OT_ROOMS.map(r => {
                const occ = r.status === "Occupied" ? 100 : r.status === "Cleaning" ? 60 : 0;
                return (
                  <div key={r.id} className="flex items-center gap-3">
                    <span className="w-16 text-sm text-text-secondary">{r.number}</span>
                    <div className="flex-1"><div className="h-3 overflow-hidden rounded-full bg-muted"><div className={`h-full rounded-full ${occ >= 100 ? "bg-danger" : occ > 0 ? "bg-warning" : "bg-success"}`} style={{ width: `${occ}%` }} /></div></div>
                    <OTRoomStatusBadge status={r.status} />
                  </div>
                );
              })}
            </div>
          </OtSection>
        </div>
      </div>
    );
  }

  /* ──────────────────────────────────────────────────────── SCREEN 18: Workflow Complete */
  function WorkflowCompleteScreen() {
    const s = selectedSurgery;
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="grid size-16 place-items-center rounded-full bg-success/10"><CheckCircle2 className="size-8 text-success" /></div>
        <h2 className="mt-6 text-2xl font-bold text-text-primary">Perioperative Workflow Complete</h2>
        <p className="mt-2 max-w-md text-text-secondary">All perioperative screens demonstrated. In production, this screen summarizes the surgical case with operative report, transfer status, and audit trail.</p>
        <div className="mt-6 rounded-xl border border-border bg-surface p-6 text-left">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-text-secondary">Patient</span><div className="font-medium text-text-primary">{s.patientName}</div></div>
            <div><span className="text-text-secondary">Procedure</span><div className="font-medium text-text-primary">{s.procedure}</div></div>
            <div><span className="text-text-secondary">Surgeon</span><div className="font-medium text-text-primary">{s.surgeon}</div></div>
            <div><span className="text-text-secondary">OT Room</span><div className="font-medium text-text-primary">{s.otRoom}</div></div>
          </div>
        </div>
        <div className="mt-8 flex gap-2">
          <Button onClick={() => navTo("dashboard")}>Return to Dashboard</Button>
          <Button variant="outline"><Printer className="mr-2 size-4" />Generate Report</Button>
        </div>
      </div>
    );
  }

  return (
    <Shell
      nav={NAV}
      navSecondary={NAV_SECONDARY}
      sectionLabel="Operation Theater"
      activeId={route}
      onNavigate={(id) => navTo(id as OtRoute)}
      breadcrumb={CRUMBS[route]}
      roleName={roleName}
      onSignOut={onSignOut}
      workspace="ot"
      onSwitchWorkspace={onSwitchWorkspace}
      onOpenSettings={onOpenSettings}
    >
      {renderScreen()}
    </Shell>
  );
}
