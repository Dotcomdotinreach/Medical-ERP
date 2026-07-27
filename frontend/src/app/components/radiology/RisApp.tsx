import { useEffect, useMemo, useState } from "react";
import {
  Activity, AlertTriangle, Archive, ArrowLeft, ArrowRight, BadgeCheck, BadgeAlert, BarChart3,
  CalendarDays, CheckCircle2, ChevronRight, ClipboardList, Clock, FileText, Film,
  FolderOpen, Hammer, Image, Layers, ListChecks, Maximize, Mic, Minimize, Package,
  Printer, QrCode, RefreshCw, ScanLine, Send, ShieldAlert, Square, Timer, Trash2,
  TrendingUp, TriangleAlert, Upload, Users, XCircle, Zap,
} from "lucide-react";
import { toast } from "sonner";
import { Shell, type NavItem, type Workspace } from "../his/Shell";
import { StatusBadge } from "../his/ui";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import {
  StudyStatusBadge, EquipmentStatusBadge, SeverityBadge, RisStatCard, RisSection, RisPageHeader,
  DoseIndicator, DicomViewerPlaceholder, AIFindingCard, ModalityBadge,
} from "./risUi";
import {
  IMAGING_ORDERS, EQUIPMENT, AI_FINDINGS, AUDIT_LOGS, STUDY_TEMPLATES,
  type ImagingOrder, type Modality,
} from "./data";
import { radiologyApi } from "../../services/radiology";

type RisRoute =
  | "dashboard" | "orders" | "scheduling" | "checkin" | "worklist"
  | "acquisition" | "upload" | "viewer" | "ai" | "reporting"
  | "critical" | "signature" | "final-report" | "delivery" | "archive"
  | "equipment" | "analytics" | "complete";

const NAV: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "orders", label: "Imaging Orders", icon: ClipboardList, badge: "10" },
  { id: "scheduling", label: "Scheduling", icon: CalendarDays },
  { id: "checkin", label: "Patient Check-In", icon: ScanLine },
  { id: "worklist", label: "Modality Worklist", icon: ListChecks, badge: "4" },
  { id: "acquisition", label: "Image Acquisition", icon: Image },
  { id: "upload", label: "PACS Upload", icon: Upload },
  { id: "viewer", label: "PACS Viewer", icon: Film },
  { id: "ai", label: "AI Findings", icon: Zap, badge: "3", tone: "warning" },
  { id: "reporting", label: "Reporting", icon: FileText },
  { id: "critical", label: "Critical Findings", icon: TriangleAlert, badge: "1", tone: "danger" },
];
const NAV_SECONDARY: NavItem[] = [
  { id: "signature", label: "Digital Signature", icon: BadgeCheck },
  { id: "final-report", label: "Final Report", icon: Layers },
  { id: "delivery", label: "Result Delivery", icon: Send },
  { id: "archive", label: "Image Archive", icon: Archive },
  { id: "equipment", label: "Equipment", icon: Hammer },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
];

function LayoutDashboard(props: React.SVGProps<SVGSVGElement>) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>;
}

const CRUMBS: Record<RisRoute, string[]> = {
  dashboard: ["Radiology", "Dashboard"],
  orders: ["Radiology", "Imaging Orders"],
  scheduling: ["Radiology", "Scheduling"],
  checkin: ["Radiology", "Patient Check-In"],
  worklist: ["Radiology", "Modality Worklist"],
  acquisition: ["Radiology", "Image Acquisition"],
  upload: ["Radiology", "PACS Upload"],
  viewer: ["Radiology", "PACS Viewer"],
  ai: ["Radiology", "AI Findings"],
  reporting: ["Radiology", "Radiologist Reporting"],
  critical: ["Radiology", "Critical Findings"],
  signature: ["Radiology", "Digital Signature"],
  "final-report": ["Radiology", "Final Report"],
  delivery: ["Radiology", "Result Delivery"],
  archive: ["Radiology", "Image Archive"],
  equipment: ["Radiology", "Equipment Management"],
  analytics: ["Radiology", "Analytics"],
  complete: ["Radiology", "Workflow Complete"],
};

export function RisApp({ roleName, onSignOut, onSwitchWorkspace, onOpenSettings }: {
  roleName: string; onSignOut: () => void; onSwitchWorkspace: (w: Workspace) => void; onOpenSettings?: (page: string) => void;
}) {
  const [route, setRoute] = useState<RisRoute>("dashboard");
  const [selectedOrder, setSelectedOrder] = useState<ImagingOrder>(IMAGING_ORDERS[0]);
  const [criticalAck, setCriticalAck] = useState(false);
  const [signOpen, setSignOpen] = useState(false);
  const [liveOrders, setLiveOrders] = useState(IMAGING_ORDERS);

  useEffect(() => {
    radiologyApi.listOrders().then(r => {
      if (r.data?.length) setLiveOrders(r.data.map((o: any) => ({
        id: o._id,
        orderId: o.orderId || o._id,
        patientName: o.patient ? `${o.patient.firstName} ${o.patient.lastName}` : "",
        doctor: o.doctor?.name || "",
        modality: o.modality || "",
        bodyPart: o.bodyPart || "",
        priority: o.priority || "Routine",
        status: o.status || "Ordered",
        scheduledDate: o.scheduledDate || "",
        clinicalIndication: o.clinicalIndication || "",
        results: o.results || "",
      })));
    }).catch(() => {});
  }, []);

  return (
    <Shell
      nav={NAV} navSecondary={NAV_SECONDARY} sectionLabel="Radiology"
      activeId={route} onNavigate={(id) => setRoute(id as RisRoute)}
      breadcrumb={CRUMBS[route]} roleName={roleName} onSignOut={onSignOut}
      workspace="radiology" onSwitchWorkspace={onSwitchWorkspace}
      onOpenSettings={onOpenSettings}
      searchPlaceholder="Search patients, study IDs, orders…"
    >
      {route === "dashboard" && <Dashboard go={setRoute} openOrder={(o) => { setSelectedOrder(o); setRoute("orders"); }} liveOrders={liveOrders} />}
      {route === "orders" && <ImagingOrdersScreen go={setRoute} openOrder={(o) => { setSelectedOrder(o); setRoute("scheduling"); }} liveOrders={liveOrders} />}
      {route === "scheduling" && <SchedulingScreen go={setRoute} order={selectedOrder} />}
      {route === "checkin" && <PatientCheckIn go={setRoute} />}
      {route === "worklist" && <ModalityWorklist go={setRoute} liveOrders={liveOrders} />}
      {route === "acquisition" && <ImageAcquisition go={setRoute} liveOrders={liveOrders} />}
      {route === "upload" && <PACSUpload go={setRoute} liveOrders={liveOrders} />}
      {route === "viewer" && <PACSViewer go={setRoute} liveOrders={liveOrders} />}
      {route === "ai" && <AIFindings go={setRoute} liveOrders={liveOrders} />}
      {route === "reporting" && <RadiologistReporting go={setRoute} liveOrders={liveOrders} />}
      {route === "critical" && <CriticalFindings go={setRoute} onAck={() => setCriticalAck(true)} />}
      {route === "signature" && <DigitalSignature go={setRoute} onOpen={() => setSignOpen(true)} />}
      {route === "final-report" && <FinalReport go={setRoute} liveOrders={liveOrders} />}
      {route === "delivery" && <PatientResultDelivery go={setRoute} />}
      {route === "archive" && <ImageArchive liveOrders={liveOrders} />}
      {route === "equipment" && <EquipmentManagement />}
      {route === "analytics" && <RadiologyAnalytics />}
      {route === "complete" && <WorkflowComplete go={setRoute} />}

      <Dialog open={criticalAck} onOpenChange={setCriticalAck}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Critical Finding Acknowledged</DialogTitle>
            <DialogDescription>Read-back confirmation has been recorded in the audit trail.</DialogDescription>
          </DialogHeader>
          <div className="rounded-lg bg-success/10 p-4 text-sm text-success">
            <b>Confirmed.</b> The critical finding has been acknowledged by the treating physician.
          </div>
          <DialogFooter>
            <Button onClick={() => setCriticalAck(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={signOpen} onOpenChange={setSignOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Digital Signature Verification</DialogTitle>
            <DialogDescription>Sign and release the radiology report. This action is recorded in the audit trail.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <div className="rounded-lg bg-muted p-4">
              <div className="font-medium">Verification Summary</div>
              <div className="mt-2 space-y-1 text-text-secondary">
                <div>• Study: CT Coronary Angiography</div>
                <div>• Patient: Rajesh Kumar · MRD-2026-004821</div>
                <div>• Radiologist: Dr. Priya Menon, MD (Radiology)</div>
                <div>• AI findings reviewed: 2 accepted, 0 rejected</div>
              </div>
            </div>
            <label className="block text-sm font-medium">Password / PIN</label>
            <Input type="password" placeholder="Enter your signing PIN" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSignOpen(false)}>Cancel</Button>
            <Button onClick={() => { setSignOpen(false); toast.success("Report signed and released", { description: "Reports are now available for delivery." }); setRoute("final-report"); }}>
              <BadgeCheck className="size-4" />Sign & Release
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Shell>
  );
}

/* ================================================================== */
/* SCREEN 01 — DASHBOARD                                              */
/* ================================================================== */
function Dashboard({ go, openOrder, liveOrders }: { go: (r: RisRoute) => void; openOrder: (o: ImagingOrder) => void; liveOrders: ImagingOrder[] }) {
  const today = liveOrders;
  const statOrders = today.filter((o) => o.priority === "STAT");
  const pending = today.filter((o) => ["Ordered", "Scheduled", "Checked In"].includes(o.status));
  const completed = today.filter((o) => ["Signed Off", "Delivered", "Reported"].includes(o.status));
  const criticalCount = AI_FINDINGS.filter((f) => f.severity === "Critical").length;
  const onlineEquip = EQUIPMENT.filter((e) => e.status === "Online").length;

  return (
    <div className="space-y-6">
      <RisPageHeader title="Radiology Dashboard" subtitle="Thursday, 22 July 2026 · Day Shift" actions={
        <Button onClick={() => go("orders")}><ClipboardList className="size-4" />View all orders</Button>
      } />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <RisStatCard icon={ClipboardList} label="Today's Orders" value={today.length} hint={`${statOrders.length} STAT`} tone="brand" />
        <RisStatCard icon={Clock} label="Pending Scans" value={pending.length} hint="Awaiting acquisition" tone="warning" />
        <RisStatCard icon={CheckCircle2} label="Completed Studies" value={completed.length} hint="Reported & signed" tone="success" />
        <RisStatCard icon={TriangleAlert} label="Critical Findings" value={criticalCount} hint="Require validation" tone="danger" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <RisStatCard icon={Hammer} label="Equipment Online" value={`${onlineEquip}/${EQUIPMENT.length}`} tone="success" />
        <RisStatCard icon={Film} label="Studies Today" value="48" hint="Across all modalities" tone="info" />
        <RisStatCard icon={Timer} label="Avg Turnaround" value="38 min" hint="Within 45 min target" trend={-5} tone="info" />
        <RisStatCard icon={RefreshCw} label="Repeat Rate" value="1.2%" trend={-12} tone="danger" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <RisSection title="STAT Orders — Priority Queue" action={<Button variant="ghost" size="sm" onClick={() => go("orders")}>All orders <ChevronRight className="size-4" /></Button>}>
          <div className="divide-y divide-border">
            {statOrders.map((o) => (
              <button key={o.orderId} onClick={() => openOrder(o)} className="flex w-full items-center gap-3 px-5 py-4 text-left hover:bg-accent">
                <div className="grid size-9 place-items-center rounded-lg bg-danger/10 text-danger"><Zap className="size-4" /></div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{o.patientName}</span>
                    <StatusBadge tone="danger">STAT</StatusBadge>
                    <StudyStatusBadge status={o.status}>{o.status}</StudyStatusBadge>
                  </div>
                  <p className="mt-1 text-xs text-text-secondary">{o.study} · {o.orderingDoctor} · {o.department}</p>
                </div>
                <div className="text-right text-xs text-text-secondary">{o.scheduledTime}</div>
              </button>
            ))}
          </div>
        </RisSection>

        <div className="space-y-6">
          <RisSection title="Equipment Status">
            <div className="space-y-3">
              {EQUIPMENT.slice(0, 5).map((e) => (
                <div key={e.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <div className="text-sm font-medium">{e.name} — {e.room}</div>
                    <div className="text-xs text-text-secondary">{e.model} · {e.studiesToday}/{e.dailyCapacity} studies</div>
                  </div>
                  <EquipmentStatusBadge status={e.status} />
                </div>
              ))}
            </div>
          </RisSection>

          <RisSection title="Recent Activity">
            <div className="space-y-3">
              {AUDIT_LOGS.slice(0, 5).map((a) => (
                <div key={a.id} className="flex items-start gap-3 px-4 py-2">
                  <div className="mt-1 size-2 shrink-0 rounded-full bg-brand" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium">{a.action}</div>
                    <div className="text-xs text-text-secondary">{a.detail.slice(0, 80)}…</div>
                    <div className="mt-1 text-[10px] text-text-secondary">{a.timestamp} · {a.user}</div>
                  </div>
                </div>
              ))}
            </div>
          </RisSection>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* SCREEN 02 — IMAGING ORDERS                                         */
/* ================================================================== */
function ImagingOrdersScreen({ go, openOrder, liveOrders }: { go: (r: RisRoute) => void; openOrder: (o: ImagingOrder) => void; liveOrders: ImagingOrder[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const orders = useMemo(() => {
    let list = liveOrders;
    if (query) list = list.filter((o) => `${o.patientName} ${o.uhid} ${o.orderId}`.toLowerCase().includes(query.toLowerCase()));
    if (filter !== "All") list = list.filter((o) => o.status === filter);
    return list;
  }, [query, filter]);

  const statuses = ["All", "Ordered", "Scheduled", "Checked In", "In Progress", "Acquired", "Uploaded", "Under Review", "Reported", "Signed Off"];

  return (
    <div className="space-y-6">
      <RisPageHeader title="Imaging Orders" subtitle={`${liveOrders.length} orders · ${liveOrders.filter((o) => o.priority === "STAT").length} STAT`} actions={
        <Button onClick={() => go("scheduling")}><CalendarDays className="size-4" />Schedule study</Button>
      } />
      <div className="flex flex-wrap items-center gap-3">
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search patient, UHID, order ID…" className="max-w-sm" />
        <div className="flex gap-1 overflow-x-auto">
          {statuses.map((s) => (
            <Button key={s} size="sm" variant={filter === s ? "default" : "outline"} onClick={() => setFilter(s)}>{s}</Button>
          ))}
        </div>
      </div>

      <RisSection title={`${orders.length} orders`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-sm">
            <thead className="bg-muted text-left text-xs uppercase tracking-wide text-text-secondary">
              <tr>
                <th className="px-5 py-3 font-medium">Patient</th>
                <th className="px-5 py-3 font-medium">Study</th>
                <th className="px-5 py-3 font-medium">Modality</th>
                <th className="px-5 py-3 font-medium">Doctor</th>
                <th className="px-5 py-3 font-medium">Priority</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Scheduled</th>
                <th className="px-5 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.orderId} className="border-t border-border hover:bg-accent">
                  <td className="px-5 py-4">
                    <div className="font-medium">{o.patientName}</div>
                    <div className="text-xs text-text-secondary">{o.uhid} · {o.age}{o.gender[0]}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-medium">{o.study}</div>
                    <div className="text-xs text-text-secondary">{o.bodyPart}{o.contrast ? " · Contrast" : ""}</div>
                  </td>
                  <td className="px-5 py-4"><ModalityBadge modality={o.modality} /></td>
                  <td className="px-5 py-4">{o.orderingDoctor}<div className="text-xs text-text-secondary">{o.department}</div></td>
                  <td className="px-5 py-4"><StatusBadge tone={o.priority === "STAT" ? "danger" : o.priority === "Urgent" ? "warning" : "info"}>{o.priority}</StatusBadge></td>
                  <td className="px-5 py-4"><StudyStatusBadge status={o.status}>{o.status}</StudyStatusBadge></td>
                  <td className="px-5 py-4 text-xs text-text-secondary">{o.scheduledTime}</td>
                  <td className="px-5 py-4">
                    <Button size="sm" variant="outline" onClick={() => openOrder(o)}>Schedule</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </RisSection>
    </div>
  );
}

/* ================================================================== */
/* SCREEN 03 — SCHEDULING                                             */
/* ================================================================== */
function SchedulingScreen({ go, order }: { go: (r: RisRoute) => void; order: ImagingOrder }) {
  const [confirmed, setConfirmed] = useState(false);
  const times = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30"];
  const rooms = EQUIPMENT.filter((e) => e.modality === order.modality && e.status === "Online");

  if (confirmed) {
    return (
      <div className="space-y-6">
        <RisPageHeader title="Study Scheduled" subtitle={`${order.study} — ${order.patientName}`} />
        <div className="rounded-xl border border-success/30 bg-success/5 p-8 text-center">
          <CheckCircle2 className="mx-auto size-12 text-success" />
          <h2 className="mt-4 text-xl font-semibold text-success">Scheduling Confirmed</h2>
          <p className="mt-2 text-text-secondary">Patient has been scheduled. Preparation instructions sent.</p>
          <div className="mt-6 flex justify-center gap-3">
            <Button onClick={() => go("checkin")}><ScanLine className="size-4" />Patient Check-In</Button>
            <Button variant="outline" onClick={() => { setConfirmed(false); go("orders"); }}>Back to Orders</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <RisPageHeader title="Scheduling" subtitle={`Schedule ${order.study} for ${order.patientName}`} actions={
        <Button variant="outline" onClick={() => go("orders")}><ArrowLeft className="size-4" />Back</Button>
      } />

      <div className="rounded-xl border border-border bg-surface p-4 text-sm">
        <div className="flex flex-wrap gap-4">
          <div><span className="text-text-secondary">Patient:</span> <span className="font-medium">{order.patientName}</span></div>
          <div><span className="text-text-secondary">Study:</span> <span className="font-medium">{order.study}</span></div>
          <div><span className="text-text-secondary">Modality:</span> <span className="font-medium">{order.modality}</span></div>
          <div><span className="text-text-secondary">Priority:</span> <StatusBadge tone={order.priority === "STAT" ? "danger" : "warning"}>{order.priority}</StatusBadge></div>
          {order.contrast && <div><span className="text-text-secondary">Contrast:</span> <span className="font-medium">{order.contrastType}</span></div>}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RisSection title="Select Time Slot">
          <div className="grid grid-cols-5 gap-2">
            {times.map((t) => (
              <button key={t} className="rounded-lg border border-border p-3 text-center text-sm font-medium hover:bg-accent hover:border-primary">
                {t}
              </button>
            ))}
          </div>
        </RisSection>

        <RisSection title="Available Rooms">
          {rooms.length === 0 ? (
            <p className="text-sm text-text-secondary">No rooms available for this modality.</p>
          ) : (
            <div className="space-y-2">
              {rooms.map((r) => (
                <button key={r.id} className="flex w-full items-center justify-between rounded-lg border border-border p-4 text-left hover:bg-accent">
                  <div>
                    <div className="font-medium">{r.room} — {r.name}</div>
                    <div className="text-xs text-text-secondary">{r.model} · {r.studiesToday}/{r.dailyCapacity} today</div>
                  </div>
                  <StatusBadge tone="success">Available</StatusBadge>
                </button>
              ))}
            </div>
          )}
        </RisSection>
      </div>

      <RisSection title="Assignment">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-text-primary">Radiologist</label>
          <label className="block text-sm font-medium text-text-primary">Technician</label>
          <select className="rounded-lg border border-border p-2.5 text-sm">
            <option>Dr. Priya Menon — Radiology</option>
            <option>Dr. Sanjay Gupta — Radiology</option>
            <option>Dr. Meera Rajan — Radiology</option>
          </select>
          <select className="rounded-lg border border-border p-2.5 text-sm">
            <option>Vikram Singh — CT</option>
            <option>Arun Kulkarni — MRI</option>
            <option>Priya Deshpande — X-Ray/USG</option>
          </select>
        </div>
      </RisSection>

      <div className="rounded-lg bg-info/5 p-4 text-sm text-[#0369a1]">
        <b>Preparation Instructions:</b> {order.contrast ? "NPO 4 hours before study. Check creatinine. IV access required." : "No special preparation required."}
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => go("orders")}>Cancel</Button>
        <Button onClick={() => { setConfirmed(true); toast.success("Study scheduled successfully"); }}>
          <CalendarDays className="size-4" />Confirm Schedule
        </Button>
      </div>
    </div>
  );
}

/* ================================================================== */
/* SCREEN 04 — PATIENT CHECK-IN                                       */
/* ================================================================== */
function PatientCheckIn({ go }: { go: (r: RisRoute) => void }) {
  const [verified, setVerified] = useState(false);
  const [consent, setConsent] = useState(false);

  return (
    <div className="space-y-6">
      <RisPageHeader title="Patient Check-In" subtitle="Verify patient and prepare for scan" actions={
        <Button variant="outline" onClick={() => go("worklist")}><ArrowLeft className="size-4" />Worklist</Button>
      } />

      <div className="rounded-xl border border-info/20 bg-info/5 p-4 text-sm text-[#0369a1]">
        <b>Step 1:</b> Scan patient wristband to verify identity before proceeding.
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RisSection title="Patient Verification">
          <div className="space-y-4">
            <Input placeholder="Scan wristband or enter UHID…" />
            <div className="rounded-lg border border-border p-4 text-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{liveOrders[0].patientName}</div>
                  <div className="text-text-secondary">{liveOrders[0].uhid} · {liveOrders[0].age}{liveOrders[0].gender[0]} · {liveOrders[0].blood}</div>
                </div>
                {verified ? <StatusBadge tone="success">Verified</StatusBadge> : <StatusBadge tone="warning">Unverified</StatusBadge>}
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                <div><span className="text-text-secondary">Study:</span> <span className="font-medium">{liveOrders[0].study}</span></div>
                <div><span className="text-text-secondary">Contrast:</span> <span className="font-medium">{liveOrders[0].contrast ? liveOrders[0].contrastType : "None"}</span></div>
              </div>
              {!verified && <Button className="mt-3" onClick={() => { setVerified(true); toast.success("Patient identity verified"); }}>Verify Identity</Button>}
            </div>
          </div>
        </RisSection>

        <RisSection title="Safety Checklist">
          <div className="space-y-3">
            {[
              { label: "Consent form signed", checked: consent, onChange: () => setConsent(!consent) },
              { label: "Pregnancy test (if applicable)", checked: false, onChange: () => {} },
              { label: "Contrast allergy check", checked: true, onChange: () => {} },
              { label: "Kidney function (creatinine)", checked: true, onChange: () => {} },
              { label: "Metal implant screening", checked: false, onChange: () => {} },
              { label: "Patient preparation verified", checked: false, onChange: () => {} },
            ].map((c) => (
              <label key={c.label} className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-accent cursor-pointer">
                <input type="checkbox" checked={c.checked} onChange={c.onChange} className="size-4 accent-primary" />
                <span className="text-sm">{c.label}</span>
              </label>
            ))}
          </div>
        </RisSection>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => go("worklist")}>Cancel</Button>
        <Button onClick={() => { toast.success("Patient checked in — ready for scan"); go("worklist"); }}>
          <CheckCircle2 className="size-4" />Ready for Scan
        </Button>
      </div>
    </div>
  );
}

/* ================================================================== */
/* SCREEN 05 — MODALITY WORKLIST                                      */
/* ================================================================== */
function ModalityWorklist({ go, liveOrders }: { go: (r: RisRoute) => void; liveOrders: ImagingOrder[] }) {
  const [modality, setModality] = useState<Modality | "All">("All");
  const modalities: (Modality | "All")[] = ["All", "CT", "MRI", "X-Ray", "Ultrasound", "Mammography", "2D Echo", "Portable X-Ray"];
  const studies = useMemo(() => {
    let list = liveOrders.filter((o) => ["Scheduled", "Checked In", "In Progress"].includes(o.status));
    if (modality !== "All") list = list.filter((o) => o.modality === modality);
    return list;
  }, [modality]);

  return (
    <div className="space-y-6">
      <RisPageHeader title="Modality Worklist" subtitle={`${studies.length} studies in queue`} actions={
        <Button onClick={() => go("acquisition")}><Image className="size-4" />Start acquisition</Button>
      } />
      <div className="flex gap-2 overflow-x-auto">
        {modalities.map((m) => (
          <Button key={m} size="sm" variant={modality === m ? "default" : "outline"} onClick={() => setModality(m)}>{m}</Button>
        ))}
      </div>

      <RisSection title="Queue">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-muted text-left text-xs uppercase tracking-wide text-text-secondary">
              <tr>
                <th className="px-5 py-3 font-medium">Patient</th>
                <th className="px-5 py-3 font-medium">Study</th>
                <th className="px-5 py-3 font-medium">Modality</th>
                <th className="px-5 py-3 font-medium">Room</th>
                <th className="px-5 py-3 font-medium">Priority</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Technician</th>
                <th className="px-5 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {studies.map((o) => (
                <tr key={o.orderId} className="border-t border-border hover:bg-accent">
                  <td className="px-5 py-4">
                    <div className="font-medium">{o.patientName}</div>
                    <div className="text-xs text-text-secondary">{o.uhid}</div>
                  </td>
                  <td className="px-5 py-4 font-medium">{o.study}</td>
                  <td className="px-5 py-4"><ModalityBadge modality={o.modality} /></td>
                  <td className="px-5 py-4">{o.room || "—"}</td>
                  <td className="px-5 py-4"><StatusBadge tone={o.priority === "STAT" ? "danger" : "warning"}>{o.priority}</StatusBadge></td>
                  <td className="px-5 py-4"><StudyStatusBadge status={o.status}>{o.status}</StudyStatusBadge></td>
                  <td className="px-5 py-4 text-xs">{o.technician || "—"}</td>
                  <td className="px-5 py-4">
                    <Button size="sm" variant="outline" onClick={() => go("acquisition")}>Begin</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </RisSection>
    </div>
  );
}

/* ================================================================== */
/* SCREEN 06 — IMAGE ACQUISITION                                      */
/* ================================================================== */
function ImageAcquisition({ go, liveOrders }: { go: (r: RisRoute) => void; liveOrders: ImagingOrder[] }) {
  const order = liveOrders[0];
  const [progress, setProgress] = useState(0);

  return (
    <div className="space-y-6">
      <RisPageHeader title="Image Acquisition" subtitle={`${order.study} — ${order.patientName}`} actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => go("worklist")}><ArrowLeft className="size-4" />Worklist</Button>
          <Button onClick={() => { setProgress(100); toast.success("Study completed — images acquired"); go("upload"); }}>
            <CheckCircle2 className="size-4" />Complete Study
          </Button>
        </div>
      } />

      <div className="grid gap-6 lg:grid-cols-2">
        <RisSection title="Scan Details">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-text-secondary">Modality</span><ModalityBadge modality={order.modality} /></div>
            <div className="flex justify-between"><span className="text-text-secondary">Protocol</span><span className="font-medium max-w-[250px] truncate">{order.study}</span></div>
            <div className="flex justify-between"><span className="text-text-secondary">Room</span><span className="font-medium">{order.room}</span></div>
            <div className="flex justify-between"><span className="text-text-secondary">Technician</span><span className="font-medium">{order.technician}</span></div>
            <div className="flex justify-between"><span className="text-text-secondary">Radiologist</span><span className="font-medium">{order.radiologist}</span></div>
            {order.contrast && <div className="flex justify-between"><span className="text-text-secondary">Contrast</span><span className="font-medium">{order.contrastType}</span></div>}
          </div>
        </RisSection>

        <RisSection title="Acquisition Status">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm"><span>Progress</span><span className="font-medium">{progress}%</span></div>
              <div className="mt-2 h-3 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-text-secondary">Images Acquired</span><p className="font-semibold">{Math.floor(progress * 3.24)}</p></div>
              <div><span className="text-text-secondary">Estimated Total</span><p className="font-semibold">324</p></div>
              <div><span className="text-text-secondary">Radiation Dose</span><p className="font-semibold">{(progress * 0.124).toFixed(1)} mGy</p></div>
              <div><span className="text-text-secondary">Scan Time</span><p className="font-semibold">{Math.floor(progress * 0.12)} min</p></div>
            </div>
            <DoseIndicator mgy={progress * 0.124} />
          </div>
        </RisSection>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => setProgress(Math.max(0, progress - 20))}><RefreshCw className="size-4" />Repeat Scan</Button>
        <Button variant="outline" onClick={() => toast.info("Pause scan — resume when ready")}>Pause</Button>
      </div>
    </div>
  );
}

/* ================================================================== */
/* SCREEN 07 — PACS UPLOAD                                            */
/* ================================================================== */
function PACSUpload({ go, liveOrders }: { go: (r: RisRoute) => void; liveOrders: ImagingOrder[] }) {
  const [uploaded, setUploaded] = useState(false);
  const order = liveOrders[0];

  return (
    <div className="space-y-6">
      <RisPageHeader title="PACS Upload" subtitle={`Upload DICOM images for ${order.patientName}`} actions={
        <Button variant="outline" onClick={() => go("acquisition")}><ArrowLeft className="size-4" />Back</Button>
      } />

      <div className="grid gap-6 lg:grid-cols-2">
        <RisSection title="Upload Progress">
          <div className="space-y-4">
            <div className="rounded-lg border border-border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">DICOM Transfer</div>
                  <div className="text-xs text-text-secondary">{order.studyId} · 324 images</div>
                </div>
                {uploaded ? <StatusBadge tone="success">Complete</StatusBadge> : <StatusBadge tone="warning">Uploading</StatusBadge>}
              </div>
              <div className="mt-3 h-3 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-success transition-all" style={{ width: uploaded ? "100%" : "75%" }} />
              </div>
              <div className="mt-2 flex justify-between text-xs text-text-secondary">
                <span>{uploaded ? 324 : 243} / 324 images</span>
                <span>{uploaded ? "Complete" : "12.4 MB/s"}</span>
              </div>
            </div>
            {uploaded && (
              <div className="rounded-lg bg-success/5 p-4 text-sm text-success">
                <b>Upload complete.</b> All images archived to PACS server.
              </div>
            )}
          </div>
        </RisSection>

        <RisSection title="Study Details">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-text-secondary">Study UID</span><span className="font-mono text-xs">{order.dicomUid}</span></div>
            <div className="flex justify-between"><span className="text-text-secondary">Patient</span><span className="font-medium">{order.patientName}</span></div>
            <div className="flex justify-between"><span className="text-text-secondary">Modality</span><ModalityBadge modality={order.modality} /></div>
            <div className="flex justify-between"><span className="text-text-secondary">Images</span><span className="font-medium">324</span></div>
            <div className="flex justify-between"><span className="text-text-secondary">Compression</span><span className="font-medium">JPEG 2000 Lossless</span></div>
            <div className="flex justify-between"><span className="text-text-secondary">Archive</span><span className="font-medium">Primary + Backup</span></div>
          </div>
        </RisSection>
      </div>

      <div className="flex justify-end gap-3">
        {!uploaded && <Button onClick={() => { setUploaded(true); toast.success("DICOM upload complete"); }}>Complete Upload</Button>}
        {uploaded && <Button onClick={() => go("viewer")}>Open PACS Viewer <ArrowRight className="size-4" /></Button>}
      </div>
    </div>
  );
}

/* ================================================================== */
/* SCREEN 08 — PACS VIEWER                                            */
/* ================================================================== */
function PACSViewer({ go, liveOrders }: { go: (r: RisRoute) => void; liveOrders: ImagingOrder[] }) {
  const order = liveOrders[0];
  return (
    <div className="space-y-6">
      <RisPageHeader title="PACS Viewer" subtitle={`${order.study} — ${order.patientName}`} actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => go("upload")}><ArrowLeft className="size-4" />Back</Button>
          <Button variant="outline" onClick={() => toast.info("Previous studies loaded")}>Compare Previous</Button>
          <Button onClick={() => go("ai")}><Zap className="size-4" />AI Analysis</Button>
        </div>
      } />

      <DicomViewerPlaceholder study={order.study} />

      <div className="grid gap-4 sm:grid-cols-3">
        <RisSection title="Series Navigator">
          <div className="space-y-2">
            {["Axial", "Coronal", "Sagittal", "3D VRT", "MIP"].map((s, i) => (
              <div key={s} className={`flex items-center justify-between rounded-lg border p-3 text-sm ${i === 0 ? "border-primary bg-primary/5" : "border-border hover:bg-accent cursor-pointer"}`}>
                <span className="font-medium">{s}</span>
                <span className="text-xs text-text-secondary">{120 + i * 15} images</span>
              </div>
            ))}
          </div>
        </RisSection>

        <RisSection title="Study Info">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-text-secondary">Study Date</span><span>22 Jul 2026</span></div>
            <div className="flex justify-between"><span className="text-text-secondary">Modality</span><ModalityBadge modality={order.modality} /></div>
            <div className="flex justify-between"><span className="text-text-secondary">Body Part</span><span>{order.bodyPart}</span></div>
            <div className="flex justify-between"><span className="text-text-secondary">Contrast</span><span>{order.contrast ? order.contrastType : "None"}</span></div>
            <div className="flex justify-between"><span className="text-text-secondary">Dose</span><DoseIndicator mgy={order.doseMgy || 0} /></div>
          </div>
        </RisSection>

        <RisSection title="Previous Studies">
          <div className="space-y-2">
            {["CT Chest — 15 Jul 2026", "X-Ray Chest — 08 Jul 2026", "CT Brain — 01 Jul 2026"].map((s) => (
              <button key={s} className="flex w-full items-center gap-2 rounded-lg border border-border p-3 text-left text-sm hover:bg-accent">
                <Film className="size-4 text-text-secondary" />
                <span>{s}</span>
              </button>
            ))}
          </div>
        </RisSection>
      </div>
    </div>
  );
}

/* ================================================================== */
/* SCREEN 09 — AI FINDINGS                                            */
/* ================================================================== */
function AIFindings({ go, liveOrders }: { go: (r: RisRoute) => void; liveOrders: ImagingOrder[] }) {
  const findings = AI_FINDINGS.filter((f) => f.studyId === liveOrders[0].studyId);
  return (
    <div className="space-y-6">
      <RisPageHeader title="AI Findings" subtitle={`${liveOrders[0].study} — ${liveOrders[0].patientName}`} actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => go("viewer")}><ArrowLeft className="size-4" />PACS Viewer</Button>
          <Button onClick={() => go("reporting")}><FileText className="size-4" />Start Report</Button>
        </div>
      } />

      <div className="rounded-xl border border-info/20 bg-info/5 p-4 text-sm text-[#0369a1]">
        <b>AI-Assisted Analysis:</b> Review AI-detected findings. Accept, reject, or modify each finding before incorporating into your report.
      </div>

      <div className="space-y-4">
        {findings.length === 0 ? (
          <RisSection title="No AI Findings"><p className="text-sm text-text-secondary">No findings detected for this study.</p></RisSection>
        ) : (
          findings.map((f) => <AIFindingCard key={f.id} finding={f} />)
        )}
      </div>

      <div className="flex justify-end">
        <Button onClick={() => go("reporting")}>Proceed to Reporting <ArrowRight className="size-4" /></Button>
      </div>
    </div>
  );
}

/* ================================================================== */
/* SCREEN 10 — RADIOLOGIST REPORTING                                  */
/* ================================================================== */
function RadiologistReporting({ go, liveOrders }: { go: (r: RisRoute) => void; liveOrders: ImagingOrder[] }) {
  const [impression, setImpression] = useState("");
  const [recommendations, setRecommendations] = useState("");
  const order = liveOrders[0];

  return (
    <div className="space-y-6">
      <RisPageHeader title="Radiologist Reporting" subtitle={`Dictate report for ${order.patientName}`} actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => go("ai")}><ArrowLeft className="size-4" />Back</Button>
          <Button variant="outline" onClick={() => toast.success("Draft saved")}><FileText className="size-4" />Save Draft</Button>
          <Button onClick={() => go("critical")}><BadgeCheck className="size-4" />Submit Report</Button>
        </div>
      } />

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-4">
          <RisSection title="Structured Report Template">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Clinical Indication</label>
                <Textarea defaultValue="Chest pain, rule out coronary artery disease. Elevated troponin." className="min-h-[80px]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Technique</label>
                <Textarea defaultValue={STUDY_TEMPLATES[order.study] || "Standard protocol."} className="min-h-[80px]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Findings</label>
                <Textarea defaultValue="Left anterior descending artery demonstrates 70% stenosis at mid segment. Right coronary artery shows mild calcification. Left circumflex and right coronary arteries are patent. No pericardial effusion. Cardiac chambers are normal in size." className="min-h-[120px]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Impression <span className="text-danger">*</span></label>
                <Textarea value={impression} onChange={(e) => setImpression(e.target.value)} placeholder="Enter impression…" className="min-h-[100px]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Recommendations</label>
                <Textarea value={recommendations} onChange={(e) => setRecommendations(e.target.value)} placeholder="Enter recommendations…" className="min-h-[80px]" />
              </div>
            </div>
          </RisSection>
        </div>

        <div className="space-y-4">
          <RisSection title="Voice Dictation">
            <div className="text-center">
              <button className="mx-auto grid size-16 place-items-center rounded-full bg-danger/10 text-danger hover:bg-danger/20 transition-colors">
                <Mic className="size-8" />
              </button>
              <p className="mt-2 text-sm text-text-secondary">Click to start dictating</p>
              <p className="text-xs text-text-secondary">Voice recognition active</p>
            </div>
          </RisSection>

          <RisSection title="AI Suggestions">
            <div className="space-y-2">
              {AI_FINDINGS.filter((f) => f.studyId === order.studyId).map((f) => (
                <div key={f.id} className="rounded-lg border border-border p-2 text-xs">
                  <div className="flex items-center gap-1"><SeverityBadge severity={f.severity} /><span className="font-medium">{f.confidence}%</span></div>
                  <p className="mt-1 text-text-secondary">{f.finding.slice(0, 60)}…</p>
                </div>
              ))}
            </div>
          </RisSection>

          <RisSection title="Attachments">
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-text-secondary"><FileText className="size-4" />DICOM Series (5 files)</div>
              <div className="flex items-center gap-2 text-text-secondary"><Image className="size-4" />Key Images (3 saved)</div>
            </div>
          </RisSection>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* SCREEN 11 — CRITICAL FINDINGS                                      */
/* ================================================================== */
function CriticalFindings({ go, onAck }: { go: (r: RisRoute) => void; onAck: () => void }) {
  const critical = AI_FINDINGS.filter((f) => f.severity === "Critical" || f.severity === "Severe");
  return (
    <div className="space-y-6">
      <RisPageHeader title="Critical Findings" subtitle="Mandatory review before report release" actions={
        <Button variant="outline" onClick={() => go("reporting")}><ArrowLeft className="size-4" />Back</Button>
      } />

      <div className="space-y-4">
        {critical.map((f) => (
          <RisSection key={f.id}>
            <div className="space-y-4">
              <div className="rounded-lg border border-danger/30 bg-danger/5 p-4">
                <div className="flex items-center gap-2">
                  <span className="size-2 animate-pulse rounded-full bg-danger" />
                  <span className="text-sm font-semibold text-danger">CRITICAL FINDING</span>
                </div>
                <p className="mt-2 text-sm font-medium text-danger">{f.finding}</p>
                <p className="mt-1 text-xs text-text-secondary">Confidence: {f.confidence}% · Location: {f.location}</p>
              </div>
              <div className="flex gap-3">
                <Button onClick={() => { onAck(); toast.success("Critical finding acknowledged", { description: `Read-back confirmed for: ${f.finding.slice(0, 50)}…` }); }}>
                  <CheckCircle2 className="size-4" />Acknowledge & Sign
                </Button>
                <Button variant="outline" onClick={() => toast.success("Ordering doctor notified by phone")}>
                  <Users className="size-4" />Notify Doctor
                </Button>
                <Button variant="outline" onClick={() => toast.success("Escalation sent to Radiology Manager")}>
                  <AlertTriangle className="size-4" />Escalate
                </Button>
              </div>
            </div>
          </RisSection>
        ))}
      </div>
    </div>
  );
}

/* ================================================================== */
/* SCREEN 12 — DIGITAL SIGNATURE                                      */
/* ================================================================== */
function DigitalSignature({ go, onOpen }: { go: (r: RisRoute) => void; onOpen: () => void }) {
  return (
    <div className="space-y-6">
      <RisPageHeader title="Digital Signature" subtitle="Sign and release the radiology report" actions={
        <Button variant="outline" onClick={() => go("critical")}><ArrowLeft className="size-4" />Back</Button>
      } />

      <RisSection title="Signature Panel">
        <div className="space-y-4">
          <div className="rounded-lg border border-border p-6 text-center">
            <div className="mx-auto mb-4 grid size-20 place-items-center rounded-full bg-secondary text-primary text-xl font-bold">
              PM
            </div>
            <div className="font-medium">Dr. Priya Menon</div>
            <div className="text-sm text-text-secondary">MD (Radiology) · Reg. No. MCI-2017-3298</div>
            <div className="mt-2 text-xs text-text-secondary">Department of Radiology · Meridian Multi-Speciality Hospital</div>
          </div>

          <div className="rounded-lg bg-muted p-4 text-sm">
            <div className="font-medium">Report to Sign</div>
            <div className="mt-2 space-y-1 text-text-secondary">
              <div>• Study: CT Coronary Angiography</div>
              <div>• Patient: Rajesh Kumar · MRD-2026-004821</div>
              <div>• Findings: LAD 70% stenosis, RCA mild calcification</div>
              <div>• Impression: Significant coronary artery disease</div>
              <div>• AI findings reviewed and incorporated</div>
            </div>
          </div>

          <Button onClick={onOpen} className="w-full"><BadgeCheck className="size-4" />Sign Report</Button>
        </div>
      </RisSection>
    </div>
  );
}

/* ================================================================== */
/* SCREEN 13 — FINAL REPORT                                           */
/* ================================================================== */
function FinalReport({ go, liveOrders }: { go: (r: RisRoute) => void; liveOrders: ImagingOrder[] }) {
  const order = liveOrders[0];
  return (
    <div className="space-y-6">
      <RisPageHeader title="Final Report" subtitle={`Specimen: ${order.studyId}`} actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => toast.success("Report downloaded as PDF")}><FileText className="size-4" />Download PDF</Button>
          <Button onClick={() => toast.success("Report sent to printer")}><Printer className="size-4" />Print</Button>
          <Button variant="outline" onClick={() => go("delivery")}><Send className="size-4" />Deliver to patient</Button>
        </div>
      } />

      <div className="rounded-xl border border-border bg-white p-8">
        <div className="text-center">
          <h2 className="text-xl font-bold text-text-primary">MERIDIAN MULTI-SPECIALITY HOSPITAL</h2>
          <p className="text-sm text-text-secondary">Department of Radiology · NABH Accredited</p>
          <div className="my-3 border-t-2 border-primary" />
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-text-secondary">Patient</div>
            <div className="font-medium">{order.patientName}</div>
            <div className="text-text-secondary">{order.uhid} · {order.age}{order.gender[0]} · {order.blood}</div>
          </div>
          <div className="text-right">
            <div className="text-text-secondary">Report Date</div>
            <div className="font-medium">22 July 2026</div>
            <div className="text-text-secondary">Ordering: {order.orderingDoctor}</div>
          </div>
        </div>

        <div className="space-y-4 text-sm">
          <div><div className="font-semibold text-text-primary">Study:</div><p>{order.study} — {order.bodyPart}{order.contrast ? ` with ${order.contrastType}` : " without contrast"}</p></div>
          <div><div className="font-semibold text-text-primary">Clinical Indication:</div><p>Chest pain, rule out coronary artery disease.</p></div>
          <div><div className="font-semibold text-text-primary">Technique:</div><p>{STUDY_TEMPLATES[order.study] || "Standard protocol."}</p></div>
          <div><div className="font-semibold text-text-primary">Findings:</div>
            <p>Left anterior descending artery demonstrates 70% stenosis at mid segment. Right coronary artery shows mild calcification. Left circumflex and right coronary arteries are patent. No pericardial effusion. Cardiac chambers are normal in size.</p>
          </div>
          <div><div className="font-semibold text-text-primary">Impression:</div>
            <p className="font-medium">1. Significant stenosis (70%) of the left anterior descending artery at mid segment.</p>
            <p className="font-medium">2. Mild atherosclerotic changes in the right coronary artery.</p>
          </div>
          <div><div className="font-semibold text-text-primary">Recommendations:</div>
            <p>Correlation with clinical presentation. Interventional cardiology consult for possible coronary intervention. Follow-up lipid profile and HbA1c.</p>
          </div>
        </div>

        <div className="mt-8 flex items-end justify-between">
          <div>
            <div className="text-text-secondary text-xs">Digitally signed by</div>
            <div className="mt-1 font-semibold">Dr. Priya Menon</div>
            <div className="text-xs text-text-secondary">MD (Radiology) · Reg. No. MCI-2017-3298</div>
            <div className="mt-1 text-[10px] text-text-secondary">Digitally signed · 22 Jul 2026 11:30 AM</div>
          </div>
          <div className="text-center">
            <div className="grid size-16 place-items-center rounded border border-border">
              <QrCode className="size-10 text-text-secondary" />
            </div>
            <div className="mt-1 text-[10px] text-text-secondary">Scan to verify</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* SCREEN 14 — PATIENT RESULT DELIVERY                                */
/* ================================================================== */
function PatientResultDelivery({ go }: { go: (r: RisRoute) => void }) {
  const channels = [
    { name: "Patient Portal", icon: Layers, desc: "View in patient portal", done: true },
    { name: "Email", icon: FileText, desc: "rajesh.kumar@gmail.com", done: true },
    { name: "SMS", icon: Zap, desc: "+91 98201 44582", done: false },
    { name: "WhatsApp", icon: Zap, desc: "+91 98201 44582", done: false },
    { name: "Print Copy", icon: Printer, desc: "Front desk pickup", done: false },
  ];

  return (
    <div className="space-y-6">
      <RisPageHeader title="Patient Result Delivery" subtitle="Deliver verified reports to patient and clinician" actions={
        <Button variant="outline" onClick={() => go("final-report")}><ArrowLeft className="size-4" />Back to report</Button>
      } />

      <RisSection title="Delivery Channels">
        <div className="space-y-3">
          {channels.map((c) => (
            <div key={c.name} className="flex items-center gap-4 px-5 py-4">
              <div className="grid size-9 place-items-center rounded-lg bg-secondary text-primary"><c.icon className="size-4" /></div>
              <div className="flex-1">
                <div className="font-medium">{c.name}</div>
                <div className="text-xs text-text-secondary">{c.desc}</div>
              </div>
              {c.done ? (
                <StatusBadge tone="success">Delivered</StatusBadge>
              ) : (
                <Button size="sm" variant="outline" onClick={() => toast.success(`${c.name} delivery initiated`)}>Send</Button>
              )}
            </div>
          ))}
        </div>
      </RisSection>

      <div className="flex justify-end">
        <Button onClick={() => { toast.success("All channels dispatched"); go("complete"); }}>
          Complete Delivery <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}

/* ================================================================== */
/* SCREEN 15 — IMAGE ARCHIVE                                          */
/* ================================================================== */
function ImageArchive({ liveOrders }: { liveOrders: ImagingOrder[] }) {
  const [query, setQuery] = useState("");
  const studies = useMemo(() => {
    if (!query) return liveOrders;
    return liveOrders.filter((o) => `${o.patientName} ${o.uhid} ${o.studyId}`.toLowerCase().includes(query.toLowerCase()));
  }, [query]);

  return (
    <div className="space-y-6">
      <RisPageHeader title="Image Archive" subtitle="Search and retrieve archived studies" actions={
        <Button variant="outline" onClick={() => toast.success("Archive exported")}><Archive className="size-4" />Export</Button>
      } />
      <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by patient, UHID, study ID…" className="max-w-md" />

      <RisSection title={`${studies.length} studies`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-muted text-left text-xs uppercase tracking-wide text-text-secondary">
              <tr>
                <th className="px-5 py-3 font-medium">Study ID</th>
                <th className="px-5 py-3 font-medium">Patient</th>
                <th className="px-5 py-3 font-medium">Study</th>
                <th className="px-5 py-3 font-medium">Modality</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {studies.map((o) => (
                <tr key={o.studyId} className="border-t border-border hover:bg-accent">
                  <td className="px-5 py-4 font-mono text-xs">{o.studyId}</td>
                  <td className="px-5 py-4">{o.patientName}<div className="text-xs text-text-secondary">{o.uhid}</div></td>
                  <td className="px-5 py-4 font-medium">{o.study}</td>
                  <td className="px-5 py-4"><ModalityBadge modality={o.modality} /></td>
                  <td className="px-5 py-4 text-xs">22 Jul 2026</td>
                  <td className="px-5 py-4"><StudyStatusBadge status={o.status}>{o.status}</StudyStatusBadge></td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => toast.info("DICOM download started")}>Download</Button>
                      <Button size="sm" variant="ghost" onClick={() => toast.success("Study restored")}>Restore</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </RisSection>
    </div>
  );
}

/* ================================================================== */
/* SCREEN 16 — EQUIPMENT MANAGEMENT                                   */
/* ================================================================== */
function EquipmentManagement() {
  return (
    <div className="space-y-6">
      <RisPageHeader title="Equipment Management" subtitle="Modality status, maintenance and calibration" actions={
        <Button onClick={() => toast.success("Service request form opened")}><Hammer className="size-4" />Service Request</Button>
      } />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {EQUIPMENT.map((eq) => (
          <RisSection key={eq.id} title={`${eq.name} — ${eq.room}`}>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <ModalityBadge modality={eq.modality} />
                <EquipmentStatusBadge status={eq.status} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><span className="text-text-secondary">Manufacturer</span><p className="font-medium">{eq.manufacturer}</p></div>
                <div><span className="text-text-secondary">Model</span><p className="font-medium">{eq.model}</p></div>
                <div><span className="text-text-secondary">Studies Today</span><p className="font-medium">{eq.studiesToday}/{eq.dailyCapacity}</p></div>
                <div><span className="text-text-secondary">Errors</span><p className={eq.errorCount > 0 ? "font-semibold text-danger" : "font-medium"}>{eq.errorCount}</p></div>
                <div><span className="text-text-secondary">Last Maintenance</span><p className="font-medium">{eq.lastMaintenance}</p></div>
                <div><span className="text-text-secondary">Next Maintenance</span><p className="font-medium">{eq.nextMaintenance}</p></div>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-brand/70" style={{ width: `${(eq.studiesToday / eq.dailyCapacity) * 100}%` }} />
              </div>
              {eq.errorCount > 0 && (
                <div className="rounded-lg bg-danger/5 p-2 text-xs text-danger">{eq.errorCount} error(s) recorded</div>
              )}
            </div>
          </RisSection>
        ))}
      </div>
    </div>
  );
}

/* ================================================================== */
/* SCREEN 17 — RADIOLOGY ANALYTICS                                    */
/* ================================================================== */
function RadiologyAnalytics() {
  const monthlyData = [
    { month: "Jan", studies: 890, tat: 42, critical: 12, repeats: 8 },
    { month: "Feb", studies: 950, tat: 38, critical: 15, repeats: 6 },
    { month: "Mar", studies: 1020, tat: 35, critical: 18, repeats: 9 },
    { month: "Apr", studies: 870, tat: 44, critical: 10, repeats: 5 },
    { month: "May", studies: 1100, tat: 32, critical: 22, repeats: 7 },
    { month: "Jun", studies: 980, tat: 40, critical: 14, repeats: 10 },
    { month: "Jul", studies: 920, tat: 38, critical: 16, repeats: 6 },
  ];

  return (
    <div className="space-y-6">
      <RisPageHeader title="Radiology Analytics" subtitle="Performance metrics and operational insights" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <RisStatCard icon={Film} label="Total Studies (July)" value="920" trend={-6} tone="brand" />
        <RisStatCard icon={Timer} label="Avg Turnaround" value="38 min" hint="Target: <45 min" trend={-5} tone="success" />
        <RisStatCard icon={TriangleAlert} label="Critical Findings" value="16" hint="This month" tone="danger" />
        <RisStatCard icon={RefreshCw} label="Repeat Scan Rate" value="0.65%" trend={-22} tone="warning" />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <RisSection title="Monthly Study Volume">
          <div className="p-5">
            <div className="flex h-48 items-end gap-3 border-b border-l border-border px-3">
              {monthlyData.map((d) => (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full rounded-t bg-brand/70" style={{ height: `${(d.studies / 1200) * 100}%` }} />
                  <span className="text-[10px] text-text-secondary">{d.month}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 flex justify-center gap-4 text-xs text-text-secondary">
              <span>Total: 6,730 studies</span>
              <span>Avg: 961/month</span>
            </div>
          </div>
        </RisSection>

        <RisSection title="Modality Distribution">
          <div className="p-5">
            <div className="space-y-3">
              {[
                { modality: "CT", count: 280, pct: 30 },
                { modality: "MRI", count: 180, pct: 20 },
                { modality: "X-Ray", count: 230, pct: 25 },
                { modality: "Ultrasound", count: 150, pct: 16 },
                { modality: "Mammography", count: 50, pct: 5 },
                { modality: "2D Echo", count: 30, pct: 4 },
              ].map((m) => (
                <div key={m.modality} className="flex items-center gap-3">
                  <div className="w-20 text-sm font-medium">{m.modality}</div>
                  <div className="flex-1 h-4 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-brand/70" style={{ width: `${m.pct}%` }} />
                  </div>
                  <div className="w-16 text-right text-xs text-text-secondary">{m.count} ({m.pct}%)</div>
                </div>
              ))}
            </div>
          </div>
        </RisSection>
      </div>

      <RisSection title="Radiologist Productivity">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-sm">
            <thead className="bg-muted text-left text-xs uppercase tracking-wide text-text-secondary">
              <tr>
                <th className="px-5 py-3 font-medium">Radiologist</th>
                <th className="px-5 py-3 font-medium">Studies Read</th>
                <th className="px-5 py-3 font-medium">Avg TAT</th>
                <th className="px-5 py-3 font-medium">Critical Found</th>
                <th className="px-5 py-3 font-medium">Correlation Rate</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Dr. Priya Menon", studies: 210, tat: "32 min", critical: 8, corr: "94%" },
                { name: "Dr. Sanjay Gupta", studies: 185, tat: "38 min", critical: 5, corr: "91%" },
                { name: "Dr. Meera Rajan", studies: 165, tat: "42 min", critical: 3, corr: "89%" },
              ].map((r) => (
                <tr key={r.name} className="border-t border-border hover:bg-accent">
                  <td className="px-5 py-4 font-medium">{r.name}</td>
                  <td className="px-5 py-4">{r.studies}</td>
                  <td className="px-5 py-4">{r.tat}</td>
                  <td className="px-5 py-4">{r.critical > 0 ? <span className="font-semibold text-danger">{r.critical}</span> : "0"}</td>
                  <td className="px-5 py-4">{r.corr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </RisSection>
    </div>
  );
}

/* ================================================================== */
/* SCREEN 18 — WORKFLOW COMPLETE                                      */
/* ================================================================== */
function WorkflowComplete({ go }: { go: (r: RisRoute) => void }) {
  return (
    <div className="space-y-6">
      <RisPageHeader title="Workflow Complete" subtitle="All radiology steps finished for this study" />

      <div className="rounded-xl border border-success/30 bg-success/5 p-8 text-center">
        <CheckCircle2 className="mx-auto size-16 text-success" />
        <h2 className="mt-4 text-2xl font-bold text-success">Radiology Workflow Complete</h2>
        <p className="mt-2 text-text-secondary">Rajesh Kumar · STU-2026-0722-001 · CT Coronary Angiography — Report signed and delivered</p>
      </div>

      <RisSection title="Completed Workflow Summary">
        <div className="space-y-3">
          {[
            { step: "Order Received", time: "08:15 AM", user: "Dr. Arjun Mehta" },
            { step: "Study Scheduled", time: "08:30 AM", user: "Scheduling Desk" },
            { step: "Patient Checked In", time: "08:55 AM", user: "Vikram Singh" },
            { step: "Image Acquisition", time: "09:00 AM", user: "Vikram Singh" },
            { step: "DICOM Upload", time: "09:12 AM", user: "System" },
            { step: "Quality Check", time: "09:13 AM", user: "System" },
            { step: "AI Analysis", time: "09:15 AM", user: "AI System" },
            { step: "PACS Archive", time: "09:16 AM", user: "System" },
            { step: "Radiologist Report", time: "09:30 AM", user: "Dr. Priya Menon" },
            { step: "Critical Finding Acknowledged", time: "09:45 AM", user: "Dr. Arjun Mehta" },
            { step: "Digital Signature", time: "11:30 AM", user: "Dr. Priya Menon" },
            { step: "Report Delivered", time: "11:35 AM", user: "System" },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-3">
              <CheckCircle2 className="size-5 text-success" />
              <div className="flex-1">
                <div className="font-medium">{s.step}</div>
                <div className="text-xs text-text-secondary">{s.user} · {s.time}</div>
              </div>
              <StatusBadge tone="success">Complete</StatusBadge>
            </div>
          ))}
        </div>
      </RisSection>

      <RisSection title="Notifications Sent">
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-success"><CheckCircle2 className="size-4" />Dr. Arjun Mehta — Critical finding notification (phone + portal)</div>
          <div className="flex items-center gap-2 text-success"><CheckCircle2 className="size-4" />Rajesh Kumar — Report delivery (portal + email)</div>
          <div className="flex items-center gap-2 text-success"><CheckCircle2 className="size-4" />Nurse Station — Report available in EMR</div>
        </div>
      </RisSection>

      <div className="flex justify-center gap-3">
        <Button onClick={() => go("dashboard")}><ArrowLeft className="size-4" />Return to Dashboard</Button>
        <Button variant="outline" onClick={() => toast.success("Workflow report generated")}><FileText className="size-4" />Generate Report</Button>
      </div>
    </div>
  );
}
