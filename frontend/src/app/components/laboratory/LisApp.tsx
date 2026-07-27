import { useEffect, useMemo, useState } from "react";
import {
  Activity, AlertTriangle, ArrowLeft, ArrowRight, BadgeCheck, BadgeAlert, BarChart3,
  Barcode, Box, CheckCircle2, ChevronRight, ClipboardList, Clock, FileText,
  FlaskConical, FolderOpen, Grid3X3, Hammer, Inbox, Label, Layers, Leaf,
  ListChecks, Microscope, Package, Printer, QrCode, RefreshCw, RotateCcw,
  ScanLine, ShieldAlert, TestTube, Timer, Trash2, TrendingUp, TriangleAlert,
  Users, Warehouse, XCircle, Zap,
} from "lucide-react";
import { toast } from "sonner";
import { Shell, type NavItem, type Workspace } from "../his/Shell";
import { StatusBadge } from "../his/ui";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import {
  LabStatusBadge, QCStatusBadge, AnalyzerStatusBadge, LabStatCard, LabSection, LabPageHeader,
  BarcodeLabel, ReferenceRangeBadge, CriticalAlertBanner, SpecimenTimeline,
} from "./lisUi";
import {
  TEST_ORDERS, ANALYZERS, QC_RECORDS, RESULT_ENTRIES, CRITICAL_RESULTS,
  INVENTORY, EQUIPMENT, AUDIT_LOGS, TEST_RANGES,
  type LabTestOrder, type SampleStatus,
} from "./data";
import { labApi } from "../../services/labs";

type LisRoute =
  | "dashboard" | "orders" | "collection" | "barcode" | "tracking"
  | "receiving" | "analyzer" | "qc" | "result-entry" | "critical"
  | "verification" | "report" | "delivery" | "inventory" | "equipment"
  | "analytics" | "audit" | "complete";

const NAV: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "orders", label: "Today's Orders", icon: ClipboardList, badge: "10" },
  { id: "collection", label: "Sample Collection", icon: TestTube },
  { id: "tracking", label: "Sample Tracking", icon: Activity },
  { id: "receiving", label: "Sample Receiving", icon: Inbox, badge: "3" },
  { id: "analyzer", label: "Analyzer Queue", icon: Microscope },
  { id: "qc", label: "Quality Control", icon: ShieldAlert },
  { id: "result-entry", label: "Result Entry", icon: FileText },
  { id: "critical", label: "Critical Results", icon: TriangleAlert, badge: "3", tone: "danger" },
  { id: "verification", label: "Verification", icon: BadgeCheck },
  { id: "report", label: "Lab Report", icon: Layers },
];
const NAV_SECONDARY: NavItem[] = [
  { id: "delivery", label: "Result Delivery", icon: Zap },
  { id: "inventory", label: "Inventory", icon: Package },
  { id: "equipment", label: "Equipment", icon: Hammer },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "audit", label: "Audit Logs", icon: FolderOpen },
];

const CRUMBS: Record<LisRoute, string[]> = {
  dashboard: ["Laboratory", "Dashboard"],
  orders: ["Laboratory", "Today's Orders"],
  collection: ["Laboratory", "Sample Collection"],
  barcode: ["Laboratory", "Sample Collection", "Barcode Label"],
  tracking: ["Laboratory", "Sample Tracking"],
  receiving: ["Laboratory", "Sample Receiving"],
  analyzer: ["Laboratory", "Analyzer Queue"],
  qc: ["Laboratory", "Quality Control"],
  "result-entry": ["Laboratory", "Result Entry"],
  critical: ["Laboratory", "Critical Results"],
  verification: ["Laboratory", "Result Verification"],
  report: ["Laboratory", "Laboratory Report"],
  delivery: ["Laboratory", "Result Delivery"],
  inventory: ["Laboratory", "Inventory Management"],
  equipment: ["Laboratory", "Equipment Management"],
  analytics: ["Laboratory", "Analytics"],
  audit: ["Laboratory", "Audit Logs"],
  complete: ["Laboratory", "Workflow Complete"],
};

function LayoutDashboard(props: React.SVGProps<SVGSVGElement>) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>;
}

export function LisApp({ roleName, onSignOut, onSwitchWorkspace, onOpenSettings }: {
  roleName: string; onSignOut: () => void; onSwitchWorkspace: (w: Workspace) => void; onOpenSettings?: (page: string) => void;
}) {
  const [route, setRoute] = useState<LisRoute>("dashboard");
  const [liveOrders, setLiveOrders] = useState(TEST_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<LabTestOrder>(TEST_ORDERS[0]);
  const [criticalAck, setCriticalAck] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);

  useEffect(() => {
    labApi.listOrders().then(r => {
      if (r.data?.length) setLiveOrders(r.data.map((o: any) => ({
        orderId: o.orderId || o._id,
        specimenId: o.orderId || `SP-${o._id.slice(-8).toUpperCase()}`,
        patientName: o.patient ? `${o.patient.firstName} ${o.patient.lastName}` : "",
        uhid: o.patient?.uhid || "",
        age: 0,
        gender: "Male" as const,
        blood: "",
        orderingDoctor: o.doctor?.name || "",
        department: "General",
        tests: (o.tests || []).map((t: any) => t.name || t.testName || ""),
        sampleType: "Blood" as const,
        tubeType: "SST" as const,
        status: o.status || "Ordered",
        priority: o.priority || "Routine",
        orderTime: o.createdAt || "",
        collectionTime: o.createdAt || "",
        collectorName: "",
        receivedBy: "",
        receivedTime: "",
        processingBy: "",
        analyzerId: "",
      })));
    }).catch(() => {});
  }, []);

  const breadcrumb = CRUMBS[route];

  return (
    <Shell
      nav={NAV} navSecondary={NAV_SECONDARY} sectionLabel="Laboratory"
      activeId={route} onNavigate={(id) => setRoute(id as LisRoute)}
      breadcrumb={breadcrumb} roleName={roleName} onSignOut={onSignOut}
      workspace="laboratory" onSwitchWorkspace={onSwitchWorkspace}
      onOpenSettings={onOpenSettings}
      searchPlaceholder="Search patients, specimen IDs, orders…"
    >
      {route === "dashboard" && <Dashboard go={setRoute} openOrder={(o) => { setSelectedOrder(o); setRoute("orders"); }} orders={liveOrders} />}
      {route === "orders" && <TestOrders go={setRoute} openOrder={setSelectedOrder} orders={liveOrders} />}
      {route === "collection" && <SampleCollection go={setRoute} />}
      {route === "barcode" && <BarcodeScreen go={setRoute} orders={liveOrders} />}
      {route === "tracking" && <SampleTracking go={setRoute} orders={liveOrders} />}
      {route === "receiving" && <SampleReceiving go={setRoute} onReject={() => setRejectOpen(true)} orders={liveOrders} />}
      {route === "analyzer" && <AnalyzerQueue go={setRoute} orders={liveOrders} />}
      {route === "qc" && <QualityControl go={setRoute} />}
      {route === "result-entry" && <ResultEntry go={setRoute} orders={liveOrders} />}
      {route === "critical" && <CriticalResultValidation go={setRoute} onAck={() => setCriticalAck(true)} />}
      {route === "verification" && <ResultVerification go={setRoute} />}
      {route === "report" && <LabReport go={setRoute} orders={liveOrders} />}
      {route === "delivery" && <PatientResultDelivery go={setRoute} />}
      {route === "inventory" && <InventoryManagement />}
      {route === "equipment" && <EquipmentManagement />}
      {route === "analytics" && <LaboratoryAnalytics />}
      {route === "audit" && <AuditLogs />}
      {route === "complete" && <WorkflowComplete go={setRoute} />}

      <Dialog open={criticalAck} onOpenChange={setCriticalAck}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Critical Result Acknowledged</DialogTitle>
            <DialogDescription>Read-back confirmation has been recorded in the audit trail.</DialogDescription>
          </DialogHeader>
          <div className="rounded-lg bg-success/10 p-4 text-sm text-success">
            <b>Confirmed.</b> The critical value has been acknowledged by the treating physician.
          </div>
          <DialogFooter>
            <Button onClick={() => setCriticalAck(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Sample</DialogTitle>
            <DialogDescription>Select a reason for rejection. A recollection request will be sent automatically.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 text-sm">
            {["Hemolyzed sample", "Insufficient volume", "Clotted sample", "Wrong container", "Leaked sample", "Mislabelled"].map((r) => (
              <label key={r} className="flex items-center gap-2 rounded-lg border border-border p-3 hover:bg-accent cursor-pointer">
                <input type="radio" name="reject" className="accent-danger" />
                {r}
              </label>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => { setRejectOpen(false); toast.success("Sample rejected", { description: "Recollection request sent to ward." }); }}>Reject & request recollection</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Shell>
  );
}

/* ================================================================== */
/* SCREEN 01 — DASHBOARD                                              */
/* ================================================================== */
function Dashboard({ go, openOrder, orders }: { go: (r: LisRoute) => void; openOrder: (o: LabTestOrder) => void; orders: LabTestOrder[] }) {
  const today = orders;
  const statOrders = today.filter((o) => o.priority === "STAT");
  const pending = today.filter((o) => ["Ordered", "Collected", "In Transit"].includes(o.status));
  const completed = today.filter((o) => ["Analyzed", "Verified", "Reported"].includes(o.status));
  const rejected = today.filter((o) => o.status === "Rejected");
  const criticalCount = CRITICAL_RESULTS.length;
  const qcFailed = QC_RECORDS.filter((q) => q.status === "Fail").length;
  const onlineAnalyzers = ANALYZERS.filter((a) => a.status === "Online").length;
  const lowStock = INVENTORY.filter((i) => i.currentStock <= i.minStock).length;

  return (
    <div className="space-y-6">
      <LabPageHeader title="Laboratory Dashboard" subtitle="Thursday, 22 July 2026 · Day Shift" actions={
        <Button onClick={() => go("orders")}><ClipboardList className="size-4" />View all orders</Button>
      } />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <LabStatCard icon={ClipboardList} label="Today's Orders" value={today.length} hint={`${statOrders.length} STAT`} tone="brand" />
        <LabStatCard icon={Clock} label="Pending Samples" value={pending.length} hint="Awaiting collection/receiving" tone="warning" />
        <LabStatCard icon={CheckCircle2} label="Completed Tests" value={completed.length} hint="Verified & reported" tone="success" />
        <LabStatCard icon={TriangleAlert} label="Critical Results" value={criticalCount} hint="Require validation" tone="danger" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <LabStatCard icon={ShieldAlert} label="QC Failed" value={qcFailed} hint="Requires recalibration" tone="danger" />
        <LabStatCard icon={Microscope} label="Analyzers Online" value={`${onlineAnalyzers}/${ANALYZERS.length}`} hint="1 in maintenance" tone="success" />
        <LabStatCard icon={Package} label="Low Stock Alerts" value={lowStock} hint="Reorder required" tone="warning" />
        <LabStatCard icon={Timer} label="Avg Turnaround" value="42 min" hint="Within 60 min target" trend={-8} tone="info" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <LabSection title="STAT Orders — Priority Queue" action={<Button variant="ghost" size="sm" onClick={() => go("orders")}>All orders <ChevronRight className="size-4" /></Button>}>
          <div className="divide-y divide-border">
            {statOrders.map((o) => (
              <button key={o.orderId} onClick={() => openOrder(o)} className="flex w-full items-center gap-3 px-5 py-4 text-left hover:bg-accent">
                <div className="grid size-9 place-items-center rounded-lg bg-danger/10 text-danger"><Zap className="size-4" /></div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{o.patientName}</span>
                    <StatusBadge tone="danger">STAT</StatusBadge>
                    <LabStatusBadge status={o.status}>{o.status}</LabStatusBadge>
                  </div>
                  <p className="mt-1 text-xs text-text-secondary">{o.tests.slice(0, 3).join(", ")}{o.tests.length > 3 ? ` +${o.tests.length - 3} more` : ""} · {o.orderingDoctor}</p>
                </div>
                <div className="text-right text-xs text-text-secondary">{o.orderTime}</div>
              </button>
            ))}
          </div>
        </LabSection>

        <div className="space-y-6">
          <LabSection title="Equipment Status">
            <div className="space-y-3">
              {ANALYZERS.slice(0, 4).map((a) => (
                <div key={a.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <div className="text-sm font-medium">{a.name}</div>
                    <div className="text-xs text-text-secondary">{a.type}</div>
                  </div>
                  <AnalyzerStatusBadge status={a.status} />
                </div>
              ))}
            </div>
          </LabSection>

          <LabSection title="Recent Activity">
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
          </LabSection>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* SCREEN 02 — TODAY'S TEST ORDERS                                    */
/* ================================================================== */
function TestOrders({ go, openOrder, orders: initialOrders }: { go: (r: LisRoute) => void; openOrder: (o: LabTestOrder) => void; orders: LabTestOrder[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<string>("All");
  const orders = useMemo(() => {
    let list = initialOrders;
    if (query) list = list.filter((o) => `${o.patientName} ${o.uhid} ${o.orderId}`.toLowerCase().includes(query.toLowerCase()));
    if (filter !== "All") list = list.filter((o) => o.status === filter);
    return list;
  }, [query, filter]);

  const statuses = ["All", "Ordered", "Collected", "In Transit", "Received", "Processing", "Analyzed", "Verified", "Rejected"];

  return (
    <div className="space-y-6">
      <LabPageHeader title="Today's Test Orders" subtitle={`${initialOrders.length} orders · ${initialOrders.filter((o) => o.priority === "STAT").length} STAT`} actions={
        <Button onClick={() => go("collection")}><TestTube className="size-4" />New collection</Button>
      } />
      <div className="flex flex-wrap items-center gap-3">
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search patient, UHID, order ID…" className="max-w-sm" />
        <div className="flex gap-1 overflow-x-auto">
          {statuses.map((s) => (
            <Button key={s} size="sm" variant={filter === s ? "default" : "outline"} onClick={() => setFilter(s)}>{s}</Button>
          ))}
        </div>
      </div>

      <LabSection title={`${orders.length} orders`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-muted text-left text-xs uppercase tracking-wide text-text-secondary">
              <tr>
                <th className="px-5 py-3 font-medium">Patient</th>
                <th className="px-5 py-3 font-medium">Order ID</th>
                <th className="px-5 py-3 font-medium">Doctor</th>
                <th className="px-5 py-3 font-medium">Tests</th>
                <th className="px-5 py-3 font-medium">Priority</th>
                <th className="px-5 py-3 font-medium">Sample</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Time</th>
                <th className="px-5 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.orderId} className="border-t border-border hover:bg-accent">
                  <td className="px-5 py-4">
                    <div className="font-medium">{o.patientName}</div>
                    <div className="text-xs text-text-secondary">{o.uhid} · {o.age}{o.gender[0]} · {o.blood}</div>
                  </td>
                  <td className="px-5 py-4 text-xs font-mono">{o.orderId}</td>
                  <td className="px-5 py-4">{o.orderingDoctor}<div className="text-xs text-text-secondary">{o.department}</div></td>
                  <td className="px-5 py-4"><div className="max-w-[200px] truncate text-xs">{o.tests.join(", ")}</div></td>
                  <td className="px-5 py-4">
                    <StatusBadge tone={o.priority === "STAT" ? "danger" : o.priority === "Urgent" ? "warning" : "info"}>{o.priority}</StatusBadge>
                  </td>
                  <td className="px-5 py-4 text-xs">{o.sampleType}<div className="text-text-secondary">{o.tubeType}</div></td>
                  <td className="px-5 py-4"><LabStatusBadge status={o.status}>{o.status}</LabStatusBadge></td>
                  <td className="px-5 py-4 text-xs text-text-secondary">{o.orderTime}</td>
                  <td className="px-5 py-4">
                    <Button size="sm" variant="outline" onClick={() => { openOrder(o); go("tracking"); }}>Track</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LabSection>
    </div>
  );
}

/* ================================================================== */
/* SCREEN 03 — SAMPLE COLLECTION                                      */
/* ================================================================== */
function SampleCollection({ go }: { go: (r: LisRoute) => void }) {
  const [patient, setPatient] = useState("");
  const [sampleType, setSampleType] = useState("Blood");
  const [tubeType, setTubeType] = useState("SST");
  const [site, setSite] = useState("");
  const [collected, setCollected] = useState(false);

  const sampleTypes = ["Blood", "Urine", "Stool", "Sputum", "CSF", "Swab"];
  const tubeMap: Record<string, string[]> = {
    Blood: ["EDTA", "SST", "Fluoride", "Plain", "Citrate"],
    Urine: ["Urine Container"],
    Stool: ["Stool Container"],
    Sputum: ["Sterile Container"],
    CSF: ["Sterile Container"],
    Swab: ["Culture Swab"],
  };

  const handleCollect = () => {
    if (!patient || !site) return toast.error("Fill all required fields");
    setCollected(true);
    toast.success("Sample collected successfully", { description: "Scan barcode to print label." });
  };

  if (collected) {
    return (
      <div className="space-y-6">
        <LabPageHeader title="Sample Collected" subtitle="Patient verified · Sample drawn" />
        <div className="rounded-xl border border-success/30 bg-success/5 p-8 text-center">
          <CheckCircle2 className="mx-auto size-12 text-success" />
          <h2 className="mt-4 text-xl font-semibold text-success">Collection Complete</h2>
          <p className="mt-2 text-text-secondary">Specimen has been collected and labelled. Proceed to barcode printing.</p>
          <div className="mt-6 flex justify-center gap-3">
            <Button onClick={() => go("barcode")}><Printer className="size-4" />Print Barcode</Button>
            <Button variant="outline" onClick={() => { setCollected(false); setPatient(""); setSite(""); }}>Collect Another</Button>
            <Button variant="ghost" onClick={() => go("tracking")}>Go to Tracking <ArrowRight className="size-4" /></Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <LabPageHeader title="Sample Collection" subtitle="Verify patient and collect specimen" actions={
        <Button variant="outline" onClick={() => go("orders")}><ArrowLeft className="size-4" />Back to orders</Button>
      } />

      <div className="rounded-xl border border-info/20 bg-info/5 p-4 text-sm text-[#0369a1]">
        <b>Step 1:</b> Scan patient wristband or search by UHID to verify identity before collection.
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <LabSection title="Patient Verification">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-text-primary">Patient / UHID <span className="text-danger">*</span></label>
            <Input value={patient} onChange={(e) => setPatient(e.target.value)} placeholder="Scan wristband or type UHID" />
            {patient && (
              <div className="rounded-lg border border-border p-4 text-sm">
                <div className="font-medium">Rajesh Kumar</div>
                <div className="text-text-secondary">MRD-2026-004821 · 47M · B+ · Cardiology</div>
                <div className="mt-2 text-xs text-danger">Allergy: Penicillin</div>
              </div>
            )}
          </div>
        </LabSection>

        <LabSection title="Collection Details">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary">Sample Type <span className="text-danger">*</span></label>
              <div className="mt-2 flex flex-wrap gap-2">
                {sampleTypes.map((t) => (
                  <Button key={t} size="sm" variant={sampleType === t ? "default" : "outline"} onClick={() => { setSampleType(t); setTubeType(tubeMap[t][0]); }}>{t}</Button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary">Tube / Container <span className="text-danger">*</span></label>
              <div className="mt-2 flex flex-wrap gap-2">
                {(tubeMap[sampleType] || []).map((t) => (
                  <Button key={t} size="sm" variant={tubeType === t ? "default" : "outline"} onClick={() => setTubeType(t)}>{t}</Button>
                ))}
              </div>
            </div>
            <label className="block text-sm font-medium text-text-primary">Collection Site <span className="text-danger">*</span></label>
            <Input value={site} onChange={(e) => setSite(e.target.value)} placeholder="e.g. Left antecubital fossa" />
            <label className="block text-sm font-medium text-text-primary">Collector Name</label>
            <Input defaultValue="Anita Deshmukh" readOnly className="bg-muted" />
          </div>
        </LabSection>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => go("orders")}>Cancel</Button>
        <Button onClick={handleCollect}><TestTube className="size-4" />Confirm Collection</Button>
      </div>
    </div>
  );
}

/* ================================================================== */
/* SCREEN 04 — BARCODE & SAMPLE LABEL                                 */
/* ================================================================== */
function BarcodeScreen({ go, orders }: { go: (r: LisRoute) => void; orders: LabTestOrder[] }) {
  const specimen = orders[0];
  return (
    <div className="space-y-6">
      <LabPageHeader title="Barcode & Sample Label" subtitle="Print specimen labels for tracking" actions={
        <Button variant="outline" onClick={() => go("collection")}><ArrowLeft className="size-4" />Back</Button>
      } />
      <div className="grid gap-6 lg:grid-cols-2">
        <LabSection title="Specimen Label">
          <BarcodeLabel
            specimenId={specimen.specimenId} patientName={specimen.patientName}
            uhid={specimen.uhid} sampleType={specimen.sampleType}
            tubeType={specimen.tubeType} collectionTime={specimen.collectionTime}
          />
          <div className="mt-4 flex justify-center gap-3">
            <Button onClick={() => toast.success("Label printed", { description: `Barcode sent to Lab Printer · ${new Date().toLocaleTimeString()}` })}>
              <Printer className="size-4" />Print Label
            </Button>
            <Button variant="outline" onClick={() => toast.success("Labels reprinted")}><RefreshCw className="size-4" />Reprint</Button>
          </div>
        </LabSection>

        <LabSection title="Order Details">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-text-secondary">Order ID</span><span className="font-medium">{specimen.orderId}</span></div>
            <div className="flex justify-between"><span className="text-text-secondary">Specimen ID</span><span className="font-mono font-medium">{specimen.specimenId}</span></div>
            <div className="flex justify-between"><span className="text-text-secondary">Patient</span><span className="font-medium">{specimen.patientName}</span></div>
            <div className="flex justify-between"><span className="text-text-secondary">UHID</span><span className="font-medium">{specimen.uhid}</span></div>
            <div className="flex justify-between"><span className="text-text-secondary">Sample Type</span><span className="font-medium">{specimen.sampleType}</span></div>
            <div className="flex justify-between"><span className="text-text-secondary">Tube</span><span className="font-medium">{specimen.tubeType}</span></div>
            <div className="flex justify-between"><span className="text-text-secondary">Collection Time</span><span className="font-medium">{specimen.collectionTime}</span></div>
            <div className="flex justify-between"><span className="text-text-secondary">Collector</span><span className="font-medium">{specimen.collectorName}</span></div>
            <div className="flex justify-between"><span className="text-text-secondary">Tests</span><span className="max-w-[200px] truncate font-medium">{specimen.tests.join(", ")}</span></div>
          </div>
        </LabSection>
      </div>

      <div className="flex justify-end">
        <Button onClick={() => go("tracking")}>Proceed to Tracking <ArrowRight className="size-4" /></Button>
      </div>
    </div>
  );
}

/* ================================================================== */
/* SCREEN 05 — SAMPLE TRACKING                                        */
/* ================================================================== */
function SampleTracking({ go, orders }: { go: (r: LisRoute) => void; orders: LabTestOrder[] }) {
  const specimen = orders[0];
  const steps = [
    { label: "Ordered", time: specimen.orderTime, done: true },
    { label: "Collected", time: specimen.collectionTime, done: true },
    { label: "In Transit", time: "08:40 AM", done: true },
    { label: "Received", time: specimen.receivedTime || "", done: !!specimen.receivedTime },
    { label: "Processing", time: specimen.status === "Processing" ? "Now" : "", done: false, active: specimen.status === "Processing" },
    { label: "Analyzed", time: "", done: false },
    { label: "Verified", time: "", done: false },
    { label: "Reported", time: "", done: false },
  ];

  return (
    <div className="space-y-6">
      <LabPageHeader title="Sample Tracking" subtitle={`Specimen: ${specimen.specimenId}`} actions={
        <Button variant="outline" onClick={() => go("orders")}><ArrowLeft className="size-4" />All orders</Button>
      } />

      <LabSection title="Specimen Timeline">
        <div className="overflow-x-auto p-4">
          <SpecimenTimeline steps={steps} />
        </div>
      </LabSection>

      <div className="grid gap-6 lg:grid-cols-2">
        <LabSection title="Specimen Details">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-text-secondary">Patient</span><span className="font-medium">{specimen.patientName}</span></div>
            <div className="flex justify-between"><span className="text-text-secondary">UHID</span><span className="font-medium">{specimen.uhid}</span></div>
            <div className="flex justify-between"><span className="text-text-secondary">Specimen ID</span><span className="font-mono font-medium">{specimen.specimenId}</span></div>
            <div className="flex justify-between"><span className="text-text-secondary">Sample Type</span><span className="font-medium">{specimen.sampleType}</span></div>
            <div className="flex justify-between"><span className="text-text-secondary">Tube</span><span className="font-medium">{specimen.tubeType}</span></div>
            <div className="flex justify-between"><span className="text-text-secondary">Assigned Analyzer</span><span className="font-medium">{specimen.analyzerId || "Pending"}</span></div>
          </div>
        </LabSection>

        <LabSection title="Location History">
          <div className="space-y-3">
            {[
              { loc: "Ward C-204, Cardiology", time: "08:30 AM", user: "Anita Deshmukh", action: "Collected" },
              { loc: "Transit Corridor B", time: "08:40 AM", user: "Anita Deshmukh", action: "In Transit" },
              { loc: "Laboratory Reception", time: specimen.receivedTime || "Pending", user: specimen.receivedBy || "—", action: "Received" },
              { loc: "Haematology Section", time: specimen.status === "Processing" ? "Now" : "Pending", user: specimen.processingBy || "—", action: specimen.status === "Processing" ? "Processing" : "Pending" },
            ].map((h, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`mt-1 size-2 shrink-0 rounded-full ${i < 3 ? "bg-success" : "bg-border"}`} />
                <div>
                  <div className="text-sm font-medium">{h.action}</div>
                  <div className="text-xs text-text-secondary">{h.loc} · {h.user} · {h.time}</div>
                </div>
              </div>
            ))}
          </div>
        </LabSection>
      </div>

      <div className="flex justify-end">
        <Button onClick={() => go("receiving")}>Go to Receiving <ArrowRight className="size-4" /></Button>
      </div>
    </div>
  );
}

/* ================================================================== */
/* SCREEN 06 — SAMPLE RECEIVING                                       */
/* ================================================================== */
function SampleReceiving({ go, onReject, orders }: { go: (r: LisRoute) => void; onReject: () => void; orders: LabTestOrder[] }) {
  const [scanned, setScanned] = useState(false);
  const pending = orders.filter((o) => ["Collected", "In Transit"].includes(o.status));

  return (
    <div className="space-y-6">
      <LabPageHeader title="Sample Receiving" subtitle="Scan and verify incoming specimens" actions={
        <Button onClick={() => go("analyzer")}><Microscope className="size-4" />Analyzer queue</Button>
      } />

      <div className="rounded-xl border border-info/20 bg-info/5 p-4 text-sm text-[#0369a1]">
        <b>Step 1:</b> Scan specimen barcode to verify identity, check sample condition, and record temperature.
      </div>

      <LabSection title="Barcode Scanner">
        <div className="flex items-center gap-3">
          <Input value={scanned ? "SP-2026-0722-002" : ""} onChange={() => {}} placeholder="Scan specimen barcode…" className="max-w-md" />
          <Button onClick={() => setScanned(true)}><ScanLine className="size-4" />Scan</Button>
        </div>
        {scanned && (
          <div className="mt-4 rounded-lg border border-border p-4 text-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Meena Patil · MRD-2026-004822</div>
                <div className="text-text-secondary">SP-2026-0722-002 · Blood · SST · Thyroid Profile, Vitamin D, KFT</div>
              </div>
              <StatusBadge tone="info">Verified</StatusBadge>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
              <div><span className="text-text-secondary">Temperature</span><p className="font-medium">4.2°C ✓</p></div>
              <div><span className="text-text-secondary">Volume</span><p className="font-medium">Sufficient ✓</p></div>
              <div><span className="text-text-secondary">Hemolysis</span><p className="font-medium">None ✓</p></div>
            </div>
            <div className="mt-4 flex gap-3">
              <Button onClick={() => { toast.success("Sample accepted", { description: "Added to analyzer queue." }); go("analyzer"); }}>
                <CheckCircle2 className="size-4" />Accept Sample
              </Button>
              <Button variant="destructive" onClick={onReject}><XCircle className="size-4" />Reject Sample</Button>
            </div>
          </div>
        )}
      </LabSection>

      <LabSection title="Pending Samples for Receiving">
        <div className="divide-y divide-border">
          {pending.map((o) => (
            <div key={o.orderId} className="flex items-center gap-3 px-5 py-4">
              <div className="grid size-9 place-items-center rounded-lg bg-secondary text-primary"><TestTube className="size-4" /></div>
              <div className="min-w-0 flex-1">
                <div className="font-medium">{o.patientName}</div>
                <div className="text-xs text-text-secondary">{o.specimenId} · {o.sampleType} · {o.tubeType} · Collected {o.collectionTime}</div>
              </div>
              <StatusBadge tone={o.status === "In Transit" ? "info" : "brand"}>{o.status}</StatusBadge>
            </div>
          ))}
        </div>
      </LabSection>
    </div>
  );
}

/* ================================================================== */
/* SCREEN 07 — ANALYZER QUEUE                                         */
/* ================================================================== */
function AnalyzerQueue({ go, orders }: { go: (r: LisRoute) => void; orders: LabTestOrder[] }) {
  return (
    <div className="space-y-6">
      <LabPageHeader title="Analyzer Queue" subtitle="Monitor instrument status and pending samples" actions={
        <Button variant="outline" onClick={() => go("qc")}><ShieldAlert className="size-4" />Quality control</Button>
      } />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {ANALYZERS.map((a) => (
          <LabSection key={a.id} title={a.name}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">{a.type}</span>
                <AnalyzerStatusBadge status={a.status} />
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-text-secondary">Queue</span><p className="font-semibold">{a.samples}/{a.capacity}</p></div>
                <div><span className="text-text-secondary">Est. Time</span><p className="font-semibold">{a.estTime}</p></div>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div className={`h-full rounded-full ${a.status === "Online" ? "bg-success" : a.status === "Error" ? "bg-danger" : "bg-warning"}`} style={{ width: `${(a.samples / a.capacity) * 100}%` }} />
              </div>
              {a.status === "Error" && <div className="rounded-lg bg-danger/5 p-2 text-xs text-danger">Instrument error — contact service engineer</div>}
            </div>
          </LabSection>
        ))}
      </div>

      <LabSection title="Pending Samples on Queue">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-sm">
            <thead className="bg-muted text-left text-xs uppercase tracking-wide text-text-secondary">
              <tr>
                <th className="px-5 py-3 font-medium">Specimen</th>
                <th className="px-5 py-3 font-medium">Patient</th>
                <th className="px-5 py-3 font-medium">Tests</th>
                <th className="px-5 py-3 font-medium">Analyzer</th>
                <th className="px-5 py-3 font-medium">Priority</th>
                <th className="px-5 py-3 font-medium">Est. Completion</th>
              </tr>
            </thead>
            <tbody>
              {orders.filter((o) => ["Received", "Processing"].includes(o.status)).map((o) => (
                <tr key={o.orderId} className="border-t border-border hover:bg-accent">
                  <td className="px-5 py-4 font-mono text-xs">{o.specimenId}</td>
                  <td className="px-5 py-4">{o.patientName}</td>
                  <td className="px-5 py-4 text-xs">{o.tests.slice(0, 2).join(", ")}{o.tests.length > 2 ? ` +${o.tests.length - 2}` : ""}</td>
                  <td className="px-5 py-4">{o.analyzerId || "—"}</td>
                  <td className="px-5 py-4"><StatusBadge tone={o.priority === "STAT" ? "danger" : "info"}>{o.priority}</StatusBadge></td>
                  <td className="px-5 py-4 text-xs text-text-secondary">{o.analyzerId ? "15–22 min" : "Pending"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LabSection>
    </div>
  );
}

/* ================================================================== */
/* SCREEN 08 — QUALITY CONTROL                                        */
/* ================================================================== */
function QualityControl({ go }: { go: (r: LisRoute) => void }) {
  const passed = QC_RECORDS.filter((q) => q.status === "Pass").length;
  const failed = QC_RECORDS.filter((q) => q.status === "Fail").length;

  return (
    <div className="space-y-6">
      <LabPageHeader title="Quality Control" subtitle="Daily QC monitoring and Levey-Jennings charts" actions={
        <Button onClick={() => { toast.success("QC run initiated", { description: "Running normal and abnormal controls…" }); }}>
          <FlaskConical className="size-4" />Run QC
        </Button>
      } />

      <div className="grid gap-4 sm:grid-cols-3">
        <LabStatCard icon={CheckCircle2} label="QC Passed" value={passed} tone="success" />
        <LabStatCard icon={XCircle} label="QC Failed" value={failed} tone="danger" />
        <LabStatCard icon={RefreshCw} label="Recalibration" value={QC_RECORDS.filter((q) => q.status === "Recalibration").length} tone="warning" />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <LabSection title="Levey-Jennings Chart — Haemoglobin">
          <div className="p-5">
            <div className="flex h-48 items-end gap-2 border-b border-l border-border px-3">
              {[14.0, 14.2, 13.8, 14.5, 14.1, 13.9, 14.3, 14.2, 14.0, 13.7, 14.4, 14.1].map((v, i) => (
                <div key={i} className="flex-1 rounded-t bg-brand/70" style={{ height: `${((v - 12) / 4) * 100}%` }} />
              ))}
            </div>
            <div className="mt-2 flex justify-between text-[10px] text-text-secondary">
              <span>07:00</span><span>08:00</span><span>09:00</span><span>10:00</span><span>11:00</span><span>12:00</span>
            </div>
            <div className="mt-3 flex gap-4 text-xs">
              <span className="text-text-secondary">Mean: 14.1 g/dL</span>
              <span className="text-text-secondary">SD: 0.22</span>
              <span className="text-success">✓ Within ±2 SD</span>
            </div>
          </div>
        </LabSection>

        <LabSection title="Levey-Jennings Chart — Prothrombin Time">
          <div className="p-5">
            <div className="flex h-48 items-end gap-2 border-b border-l border-border px-3">
              {[12.1, 12.3, 11.9, 12.5, 13.8, 14.2, 14.2, 0, 0, 0, 0, 0].map((v, i) => (
                <div key={i} className={`flex-1 rounded-t ${v > 13.5 ? "bg-danger/70" : "bg-brand/70"}`} style={{ height: v ? `${((v - 10) / 6) * 100}%` : "0%" }} />
              ))}
            </div>
            <div className="mt-2 flex justify-between text-[10px] text-text-secondary">
              <span>07:00</span><span>08:00</span><span>09:00</span><span>10:00</span><span>11:00</span><span>12:00</span>
            </div>
            <div className="mt-3 flex gap-4 text-xs">
              <span className="text-text-secondary">Mean: 12.4 sec</span>
              <span className="text-danger">✗ Above +2 SD</span>
              <StatusBadge tone="danger">QC Fail</StatusBadge>
            </div>
          </div>
        </LabSection>
      </div>

      <LabSection title="QC Records">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-sm">
            <thead className="bg-muted text-left text-xs uppercase tracking-wide text-text-secondary">
              <tr>
                <th className="px-5 py-3 font-medium">Test</th>
                <th className="px-5 py-3 font-medium">Analyzer</th>
                <th className="px-5 py-3 font-medium">Level</th>
                <th className="px-5 py-3 font-medium">Expected</th>
                <th className="px-5 py-3 font-medium">Observed</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Operator</th>
              </tr>
            </thead>
            <tbody>
              {QC_RECORDS.map((q) => (
                <tr key={q.id} className="border-t border-border hover:bg-accent">
                  <td className="px-5 py-4 font-medium">{q.testName}</td>
                  <td className="px-5 py-4 text-xs">{q.analyzer}</td>
                  <td className="px-5 py-4"><StatusBadge tone={q.level === "Critical" ? "danger" : q.level === "Abnormal" ? "warning" : "info"}>{q.level}</StatusBadge></td>
                  <td className="px-5 py-4 text-xs">{q.expectedRange} {q.unit}</td>
                  <td className="px-5 py-4 font-medium">{q.observedValue} {q.unit}</td>
                  <td className="px-5 py-4"><QCStatusBadge status={q.status} /></td>
                  <td className="px-5 py-4 text-xs">{q.operator}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LabSection>
    </div>
  );
}

/* ================================================================== */
/* SCREEN 09 — RESULT ENTRY                                           */
/* ================================================================== */
function ResultEntry({ go, orders }: { go: (r: LisRoute) => void; orders: LabTestOrder[] }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const specimen = orders[0];

  return (
    <div className="space-y-6">
      <LabPageHeader title="Result Entry" subtitle={`Specimen: ${specimen.specimenId} · ${specimen.patientName}`} actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => go("analyzer")}><ArrowLeft className="size-4" />Back</Button>
          <Button onClick={() => { toast.success("Results saved as draft", { description: "Autosave enabled." }); }}>
            <CheckCircle2 className="size-4" />Save Draft
          </Button>
        </div>
      } />

      <div className="rounded-xl border border-border bg-surface p-4 text-sm">
        <div className="flex flex-wrap gap-4">
          <div><span className="text-text-secondary">Patient:</span> <span className="font-medium">{specimen.patientName}</span></div>
          <div><span className="text-text-secondary">UHID:</span> <span className="font-medium">{specimen.uhid}</span></div>
          <div><span className="text-text-secondary">Ordering Doctor:</span> <span className="font-medium">{specimen.orderingDoctor}</span></div>
          <div><span className="text-text-secondary">Department:</span> <span className="font-medium">{specimen.department}</span></div>
        </div>
      </div>

      <LabSection title="Enter Results">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-sm">
            <thead className="bg-muted text-left text-xs uppercase tracking-wide text-text-secondary">
              <tr>
                <th className="px-5 py-3 font-medium">Test</th>
                <th className="px-5 py-3 font-medium">Reference Range</th>
                <th className="px-5 py-3 font-medium">Units</th>
                <th className="px-5 py-3 font-medium">Observed Value</th>
                <th className="px-5 py-3 font-medium">Flag</th>
                <th className="px-5 py-3 font-medium">Delta Check</th>
                <th className="px-5 py-3 font-medium">Comments</th>
              </tr>
            </thead>
            <tbody>
              {RESULT_ENTRIES.filter((r) => r.specimenId === specimen.specimenId).map((r) => {
                const range = TEST_RANGES[r.testName];
                const val = values[r.testName] ?? r.observedValue;
                return (
                  <tr key={r.testName} className="border-t border-border">
                    <td className="px-5 py-4 font-medium">{r.testName}</td>
                    <td className="px-5 py-4 text-xs">{range?.range ?? r.referenceRange}</td>
                    <td className="px-5 py-4 text-xs">{range?.unit ?? r.unit}</td>
                    <td className="px-5 py-4">
                      <Input value={val} onChange={(e) => setValues({ ...values, [r.testName]: e.target.value })} className="h-8 w-24 text-sm" />
                    </td>
                    <td className="px-5 py-4"><ReferenceRangeBadge flag={r.abnormalFlag} /></td>
                    <td className="px-5 py-4">
                      {r.deltaCheck ? (
                        <span className="inline-flex items-center gap-1 text-xs text-warning">
                          <RefreshCw className="size-3" />Prev: {r.previousValue}
                        </span>
                      ) : <span className="text-xs text-text-secondary">—</span>}
                    </td>
                    <td className="px-5 py-4">
                      <Input defaultValue={r.comments} className="h-8 max-w-[200px] text-xs" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </LabSection>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => go("analyzer")}>Cancel</Button>
        <Button onClick={() => { toast.success("Results submitted for verification"); go("verification"); }}>
          Submit for Verification <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}

/* ================================================================== */
/* SCREEN 10 — CRITICAL RESULT VALIDATION                             */
/* ================================================================== */
function CriticalResultValidation({ go, onAck }: { go: (r: LisRoute) => void; onAck: () => void }) {
  return (
    <div className="space-y-6">
      <LabPageHeader title="Critical Result Validation" subtitle="Mandatory review before report release" actions={
        <Button variant="outline" onClick={() => go("verification")}><ArrowLeft className="size-4" />Back</Button>
      } />

      <div className="space-y-4">
        {CRITICAL_RESULTS.map((c) => (
          <LabSection key={c.specimenId}>
            <div className="space-y-4">
              <CriticalAlertBanner test={c.test} value={c.value} unit={c.unit} threshold={c.threshold} patient={c.patientName} />
              <div className="grid grid-cols-2 gap-4 text-sm lg:grid-cols-4">
                <div><span className="text-text-secondary">Specimen</span><p className="font-mono font-medium">{c.specimenId}</p></div>
                <div><span className="text-text-secondary">UHID</span><p className="font-medium">{c.uhid}</p></div>
                <div><span className="text-text-secondary">Doctor</span><p className="font-medium">{c.doctor}</p></div>
                <div><span className="text-text-secondary">Time</span><p className="font-medium">{c.time}</p></div>
              </div>
              <div className="flex gap-3">
                <Button onClick={() => { onAck(); toast.success("Critical result acknowledged", { description: `Read-back confirmed for ${c.test}: ${c.value} ${c.unit}` }); }}>
                  <CheckCircle2 className="size-4" />Acknowledge & Sign
                </Button>
                <Button variant="outline" onClick={() => toast.success("Doctor notified by phone")}>
                  <Users className="size-4" />Notify Doctor
                </Button>
                <Button variant="outline" onClick={() => toast.success("Escalation sent to Lab Manager")}>
                  <AlertTriangle className="size-4" />Escalate
                </Button>
              </div>
            </div>
          </LabSection>
        ))}
      </div>
    </div>
  );
}

/* ================================================================== */
/* SCREEN 11 — RESULT VERIFICATION                                    */
/* ================================================================== */
function ResultVerification({ go }: { go: (r: LisRoute) => void }) {
  const [signOpen, setSignOpen] = useState(false);

  return (
    <div className="space-y-6">
      <LabPageHeader title="Result Verification" subtitle="Pathologist review and digital signature" actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => go("critical")}><TriangleAlert className="size-4" />Critical results</Button>
          <Button onClick={() => setSignOpen(true)}><BadgeCheck className="size-4" />Verify & Sign</Button>
        </div>
      } />

      <LabSection title="Results Pending Verification">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-sm">
            <thead className="bg-muted text-left text-xs uppercase tracking-wide text-text-secondary">
              <tr>
                <th className="px-5 py-3 font-medium">Specimen</th>
                <th className="px-5 py-3 font-medium">Patient</th>
                <th className="px-5 py-3 font-medium">Test</th>
                <th className="px-5 py-3 font-medium">Result</th>
                <th className="px-5 py-3 font-medium">Flag</th>
                <th className="px-5 py-3 font-medium">Entered By</th>
                <th className="px-5 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {RESULT_ENTRIES.slice(0, 6).map((r) => (
                <tr key={r.testName} className="border-t border-border hover:bg-accent">
                  <td className="px-5 py-4 font-mono text-xs">{r.specimenId}</td>
                  <td className="px-5 py-4">{r.patientName}</td>
                  <td className="px-5 py-4 font-medium">{r.testName}</td>
                  <td className="px-5 py-4">{r.observedValue} {r.unit}</td>
                  <td className="px-5 py-4"><ReferenceRangeBadge flag={r.abnormalFlag} /></td>
                  <td className="px-5 py-4 text-xs">Ravi Verma</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => toast.success(`${r.testName} verified`)}>Approve</Button>
                      <Button size="sm" variant="ghost" onClick={() => toast.error(`${r.testName} sent for correction`)}>Reject</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LabSection>

      <Dialog open={signOpen} onOpenChange={setSignOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Digital Signature Verification</DialogTitle>
            <DialogDescription>Sign and release all approved results. This action is recorded in the audit trail.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <div className="rounded-lg bg-muted p-4">
              <div className="font-medium">Verification Summary</div>
              <div className="mt-2 space-y-1 text-text-secondary">
                <div>• 6 results approved</div>
                <div>• 0 results rejected</div>
                <div>• Critical values acknowledged: 2</div>
                <div>• Pathologist: Dr. Meera Rajan, MD (Pathology)</div>
              </div>
            </div>
            <label className="block text-sm font-medium">Password / PIN</label>
            <Input type="password" placeholder="Enter your signing PIN" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSignOpen(false)}>Cancel</Button>
            <Button onClick={() => { setSignOpen(false); toast.success("Results verified and released", { description: "Reports are now available for delivery." }); go("report"); }}>
              <BadgeCheck className="size-4" />Sign & Release
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ================================================================== */
/* SCREEN 12 — LABORATORY REPORT                                      */
/* ================================================================== */
function LabReport({ go, orders }: { go: (r: LisRoute) => void; orders: LabTestOrder[] }) {
  const specimen = orders[0];
  const results = RESULT_ENTRIES.filter((r) => r.specimenId === specimen.specimenId);

  return (
    <div className="space-y-6">
      <LabPageHeader title="Laboratory Report" subtitle={`Specimen: ${specimen.specimenId}`} actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => toast.success("Report downloaded as PDF")}><FileText className="size-4" />Download PDF</Button>
          <Button onClick={() => { toast.success("Report sent to printer"); }}><Printer className="size-4" />Print</Button>
          <Button variant="outline" onClick={() => go("delivery")}><Zap className="size-4" />Deliver to patient</Button>
        </div>
      } />

      <div className="rounded-xl border border-border bg-white p-8">
        <div className="text-center">
          <h2 className="text-xl font-bold text-text-primary">MERIDIAN MULTI-SPECIALITY HOSPITAL</h2>
          <p className="text-sm text-text-secondary">Laboratory Department · NABH Accredited</p>
          <div className="my-3 border-t-2 border-primary" />
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-text-secondary">Patient</div>
            <div className="font-medium">{specimen.patientName}</div>
            <div className="text-text-secondary">{specimen.uhid} · {specimen.age}{specimen.gender[0]} · {specimen.blood}</div>
          </div>
          <div className="text-right">
            <div className="text-text-secondary">Report Date</div>
            <div className="font-medium">22 July 2026</div>
            <div className="text-text-secondary">Ordering: {specimen.orderingDoctor}</div>
          </div>
        </div>

        <table className="w-full text-sm">
          <thead className="border-t border-b border-border bg-muted text-left text-xs uppercase tracking-wide text-text-secondary">
            <tr>
              <th className="px-4 py-2 font-medium">Test</th>
              <th className="px-4 py-2 font-medium">Result</th>
              <th className="px-4 py-2 font-medium">Unit</th>
              <th className="px-4 py-2 font-medium">Reference Range</th>
              <th className="px-4 py-2 font-medium">Flag</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => {
              const range = TEST_RANGES[r.testName];
              return (
                <tr key={r.testName} className="border-b border-border">
                  <td className="px-4 py-3 font-medium">{r.testName}</td>
                  <td className="px-4 py-3 font-semibold">{r.observedValue}</td>
                  <td className="px-4 py-3 text-text-secondary">{range?.unit ?? r.unit}</td>
                  <td className="px-4 py-3 text-text-secondary">{range?.range ?? r.referenceRange}</td>
                  <td className="px-4 py-3"><ReferenceRangeBadge flag={r.abnormalFlag} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="mt-6 border-t border-border pt-4 text-sm">
          <div className="text-text-secondary">Comments</div>
          <p className="mt-1">Uncontrolled diabetes with dyslipidaemia. Please correlate clinically.</p>
        </div>

        <div className="mt-8 flex items-end justify-between">
          <div>
            <div className="text-text-secondary text-xs">Verified by</div>
            <div className="mt-1 font-semibold">Dr. Meera Rajan</div>
            <div className="text-xs text-text-secondary">MD (Pathology) · Reg. No. MCI-2018-4521</div>
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
/* SCREEN 13 — PATIENT RESULT DELIVERY                                */
/* ================================================================== */
function PatientResultDelivery({ go }: { go: (r: LisRoute) => void }) {
  const [sent, setSent] = useState(false);
  const channels = [
    { name: "Patient Portal", icon: Layers, desc: "View in patient portal", done: true },
    { name: "Email", icon: FileText, desc: "rajesh.kumar@gmail.com", done: true },
    { name: "SMS", icon: Zap, desc: "+91 98201 44582", done: false },
    { name: "WhatsApp", icon: Zap, desc: "+91 98201 44582", done: false },
    { name: "Print Copy", icon: Printer, desc: "Front desk pickup", done: false },
  ];

  return (
    <div className="space-y-6">
      <LabPageHeader title="Patient Result Delivery" subtitle="Deliver verified results to patient and clinician" actions={
        <Button variant="outline" onClick={() => go("report")}><ArrowLeft className="size-4" />Back to report</Button>
      } />

      <LabSection title="Delivery Channels">
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
      </LabSection>

      <LabSection title="Delivery Status">
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-success"><CheckCircle2 className="size-4" />Patient Portal — Delivered at 11:35 AM</div>
          <div className="flex items-center gap-2 text-success"><CheckCircle2 className="size-4" />Email — Sent to rajesh.kumar@gmail.com at 11:35 AM</div>
          <div className="flex items-center gap-2 text-text-secondary"><Clock className="size-4" />SMS — Pending</div>
          <div className="flex items-center gap-2 text-text-secondary"><Clock className="size-4" />WhatsApp — Pending</div>
          <div className="flex items-center gap-2 text-text-secondary"><Clock className="size-4" />Print — Not initiated</div>
        </div>
      </LabSection>

      <div className="flex justify-end">
        <Button onClick={() => { setSent(true); toast.success("All channels dispatched"); go("complete"); }}>
          Complete Delivery <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}

/* ================================================================== */
/* SCREEN 14 — INVENTORY MANAGEMENT                                   */
/* ================================================================== */
function InventoryManagement() {
  const [filter, setFilter] = useState("All");
  const items = useMemo(() => {
    if (filter === "All") return INVENTORY;
    if (filter === "Low Stock") return INVENTORY.filter((i) => i.currentStock <= i.minStock);
    return INVENTORY.filter((i) => i.category === filter);
  }, [filter]);

  return (
    <div className="space-y-6">
      <LabPageHeader title="Inventory Management" subtitle="Reagents, consumables and supplies" actions={
        <Button onClick={() => toast.success("Purchase request form opened")}><Package className="size-4" />New Purchase Request</Button>
      } />

      <div className="flex gap-2 overflow-x-auto">
        {["All", "Reagent", "Consumable", "Kit", "Control", "Low Stock"].map((f) => (
          <Button key={f} size="sm" variant={filter === f ? "default" : "outline"} onClick={() => setFilter(f)}>{f}</Button>
        ))}
      </div>

      <LabSection title={`${items.length} items`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-muted text-left text-xs uppercase tracking-wide text-text-secondary">
              <tr>
                <th className="px-5 py-3 font-medium">Item</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Lot Number</th>
                <th className="px-5 py-3 font-medium">Stock</th>
                <th className="px-5 py-3 font-medium">Expiry</th>
                <th className="px-5 py-3 font-medium">Supplier</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const low = item.currentStock <= item.minStock;
                return (
                  <tr key={item.id} className="border-t border-border hover:bg-accent">
                    <td className="px-5 py-4">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-text-secondary">₹{item.cost.toLocaleString("en-IN")}/{item.unit}</div>
                    </td>
                    <td className="px-5 py-4"><StatusBadge tone="info">{item.category}</StatusBadge></td>
                    <td className="px-5 py-4 font-mono text-xs">{item.lotNumber}</td>
                    <td className="px-5 py-4">
                      <span className={low ? "font-semibold text-danger" : "font-medium"}>{item.currentStock} {item.unit}</span>
                      <div className="text-xs text-text-secondary">Min: {item.minStock}</div>
                    </td>
                    <td className="px-5 py-4 text-xs">{item.expiryDate}</td>
                    <td className="px-5 py-4 text-xs">{item.supplier}</td>
                    <td className="px-5 py-4">
                      {low ? <StatusBadge tone="danger">Low Stock</StatusBadge> : <StatusBadge tone="success">In Stock</StatusBadge>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </LabSection>
    </div>
  );
}

/* ================================================================== */
/* SCREEN 15 — EQUIPMENT MANAGEMENT                                   */
/* ================================================================== */
function EquipmentManagement() {
  return (
    <div className="space-y-6">
      <LabPageHeader title="Equipment Management" subtitle="Analyzer status, maintenance and calibration" actions={
        <Button onClick={() => toast.success("Service request form opened")}><Hammer className="size-4" />Service Request</Button>
      } />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {EQUIPMENT.map((eq) => (
          <LabSection key={eq.id} title={eq.name}>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">{eq.manufacturer}</span>
                <AnalyzerStatusBadge status={eq.status} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><span className="text-text-secondary">Department</span><p className="font-medium">{eq.department}</p></div>
                <div><span className="text-text-secondary">Model</span><p className="font-medium">{eq.model}</p></div>
                <div><span className="text-text-secondary">Last Maintenance</span><p className="font-medium">{eq.lastMaintenance}</p></div>
                <div><span className="text-text-secondary">Next Maintenance</span><p className="font-medium">{eq.nextMaintenance}</p></div>
                <div><span className="text-text-secondary">Calibration Due</span><p className="font-medium">{eq.calibrationDue}</p></div>
                <div><span className="text-text-secondary">Errors Today</span><p className={eq.errorCount > 0 ? "font-semibold text-danger" : "font-medium"}>{eq.errorCount}</p></div>
              </div>
              {eq.errorCount > 0 && (
                <div className="rounded-lg bg-danger/5 p-2 text-xs text-danger">
                  {eq.errorCount} error(s) recorded. {eq.status === "Error" ? "Immediate attention required." : "Monitor closely."}
                </div>
              )}
            </div>
          </LabSection>
        ))}
      </div>
    </div>
  );
}

/* ================================================================== */
/* SCREEN 16 — LABORATORY ANALYTICS                                   */
/* ================================================================== */
function LaboratoryAnalytics() {
  const monthlyData = [
    { month: "Jan", tests: 1240, tat: 45, rejected: 12 },
    { month: "Feb", tests: 1380, tat: 42, rejected: 8 },
    { month: "Mar", tests: 1520, tat: 38, rejected: 15 },
    { month: "Apr", tests: 1190, tat: 44, rejected: 10 },
    { month: "May", tests: 1650, tat: 36, rejected: 7 },
    { month: "Jun", tests: 1480, tat: 40, rejected: 11 },
    { month: "Jul", tests: 1320, tat: 42, rejected: 9 },
  ];

  return (
    <div className="space-y-6">
      <LabPageHeader title="Laboratory Analytics" subtitle="Performance metrics and operational insights" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <LabStatCard icon={ClipboardList} label="Total Tests (July)" value="1,320" trend={-8} tone="brand" />
        <LabStatCard icon={Timer} label="Avg Turnaround" value="42 min" hint="Target: <60 min" trend={5} tone="success" />
        <LabStatCard icon={XCircle} label="Rejection Rate" value="0.7%" hint="9 of 1,320" trend={-15} tone="danger" />
        <LabStatCard icon={TriangleAlert} label="Critical Results" value="23" hint="This month" tone="warning" />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <LabSection title="Monthly Test Volume">
          <div className="p-5">
            <div className="flex h-48 items-end gap-3 border-b border-l border-border px-3">
              {monthlyData.map((d, i) => (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full rounded-t bg-brand/70" style={{ height: `${(d.tests / 1700) * 100}%` }} />
                  <span className="text-[10px] text-text-secondary">{d.month}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 flex justify-center gap-4 text-xs text-text-secondary">
              <span>Total: 10,780 tests</span>
              <span>Avg: 1,540/month</span>
            </div>
          </div>
        </LabSection>

        <LabSection title="Turnaround Time Trend">
          <div className="p-5">
            <div className="flex h-48 items-end gap-3 border-b border-l border-border px-3">
              {monthlyData.map((d, i) => (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                  <div className={`w-full rounded-t ${d.tat > 42 ? "bg-warning/70" : "bg-success/70"}`} style={{ height: `${(d.tat / 60) * 100}%` }} />
                  <span className="text-[10px] text-text-secondary">{d.month}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 flex justify-center gap-4 text-xs text-text-secondary">
              <span>Target: &lt;60 min</span>
              <span>Current: 42 min</span>
            </div>
          </div>
        </LabSection>
      </div>

      <LabSection title="Department Statistics">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-sm">
            <thead className="bg-muted text-left text-xs uppercase tracking-wide text-text-secondary">
              <tr>
                <th className="px-5 py-3 font-medium">Department</th>
                <th className="px-5 py-3 font-medium">Tests</th>
                <th className="px-5 py-3 font-medium">Avg TAT</th>
                <th className="px-5 py-3 font-medium">Rejections</th>
                <th className="px-5 py-3 font-medium">Critical</th>
              </tr>
            </thead>
            <tbody>
              {[
                { dept: "Cardiology", tests: 340, tat: "38 min", rejections: 2, critical: 8 },
                { dept: "Emergency Medicine", tests: 280, tat: "25 min", rejections: 3, critical: 12 },
                { dept: "General Medicine", tests: 310, tat: "45 min", rejections: 2, critical: 1 },
                { dept: "Paediatrics", tests: 180, tat: "42 min", rejections: 1, critical: 0 },
                { dept: "Neurology", tests: 120, tat: "50 min", rejections: 1, critical: 2 },
                { dept: "Gynaecology", tests: 90, tat: "48 min", rejections: 0, critical: 0 },
              ].map((d) => (
                <tr key={d.dept} className="border-t border-border hover:bg-accent">
                  <td className="px-5 py-4 font-medium">{d.dept}</td>
                  <td className="px-5 py-4">{d.tests}</td>
                  <td className="px-5 py-4">{d.tat}</td>
                  <td className="px-5 py-4">{d.rejections}</td>
                  <td className="px-5 py-4">{d.critical > 0 ? <span className="font-semibold text-danger">{d.critical}</span> : "0"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LabSection>
    </div>
  );
}

/* ================================================================== */
/* SCREEN 17 — AUDIT LOGS                                             */
/* ================================================================== */
function AuditLogs() {
  return (
    <div className="space-y-6">
      <LabPageHeader title="Audit Logs" subtitle="Complete trail of laboratory actions and system events" actions={
        <Button variant="outline" onClick={() => toast.success("Audit log exported as CSV")}><FileText className="size-4" />Export CSV</Button>
      } />

      <LabSection title="Audit Timeline">
        <div className="space-y-0">
          {AUDIT_LOGS.map((log, i) => (
            <div key={log.id} className="flex gap-4 px-5 py-4">
              <div className="flex flex-col items-center">
                <div className={`size-3 rounded-full ${log.action.includes("Critical") || log.action.includes("Fail") ? "bg-danger" : log.action.includes("Notified") || log.action.includes("Acknowledged") ? "bg-warning" : "bg-success"}`} />
                {i < AUDIT_LOGS.length - 1 && <div className="mt-1 w-0.5 flex-1 bg-border" />}
              </div>
              <div className="min-w-0 flex-1 pb-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-text-primary">{log.action}</span>
                  <span className="text-xs text-text-secondary">{log.timestamp}</span>
                </div>
                <p className="mt-1 text-sm text-text-secondary">{log.detail}</p>
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-text-secondary">
                  <span>{log.user} · {log.role}</span>
                  {log.specimenId && <span className="font-mono">{log.specimenId}</span>}
                  {log.patientName && <span>{log.patientName}</span>}
                  <span>IP: {log.ipAddress}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </LabSection>
    </div>
  );
}

/* ================================================================== */
/* SCREEN 18 — WORKFLOW COMPLETE                                      */
/* ================================================================== */
function WorkflowComplete({ go }: { go: (r: LisRoute) => void }) {
  return (
    <div className="space-y-6">
      <LabPageHeader title="Workflow Complete" subtitle="All laboratory steps finished for this specimen" />

      <div className="rounded-xl border border-success/30 bg-success/5 p-8 text-center">
        <CheckCircle2 className="mx-auto size-16 text-success" />
        <h2 className="mt-4 text-2xl font-bold text-success">Laboratory Workflow Complete</h2>
        <p className="mt-2 text-text-secondary">Rajesh Kumar · SP-2026-0722-001 · All tests verified and delivered</p>
      </div>

      <LabSection title="Completed Workflow Summary">
        <div className="space-y-3">
          {[
            { step: "Order Received", time: "08:15 AM", user: "Dr. Arjun Mehta", status: "Done" },
            { step: "Patient Verified", time: "08:20 AM", user: "Anita Deshmukh", status: "Done" },
            { step: "Sample Collected", time: "08:30 AM", user: "Anita Deshmukh", status: "Done" },
            { step: "Barcode Generated", time: "08:31 AM", user: "System", status: "Done" },
            { step: "Sample Received", time: "08:45 AM", user: "Suresh Pawar", status: "Done" },
            { step: "Analysis Complete", time: "10:00 AM", user: "Ravi Verma", status: "Done" },
            { step: "QC Passed", time: "07:30 AM", user: "Ravi Verma", status: "Done" },
            { step: "Results Verified", time: "11:30 AM", user: "Dr. Meera Rajan", status: "Done" },
            { step: "Critical Values Acknowledged", time: "11:00 AM", user: "Dr. Arjun Mehta", status: "Done" },
            { step: "Report Generated", time: "11:35 AM", user: "System", status: "Done" },
            { step: "Results Delivered", time: "11:40 AM", user: "System", status: "Done" },
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
      </LabSection>

      <LabSection title="Notifications Sent">
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-success"><CheckCircle2 className="size-4" />Dr. Arjun Mehta — Critical value notification (phone + portal)</div>
          <div className="flex items-center gap-2 text-success"><CheckCircle2 className="size-4" />Rajesh Kumar — Result delivery (portal + email)</div>
          <div className="flex items-center gap-2 text-success"><CheckCircle2 className="size-4" />Nurse Station — Result available in EMR</div>
        </div>
      </LabSection>

      <div className="flex justify-center gap-3">
        <Button onClick={() => go("dashboard")}><ArrowLeft className="size-4" />Return to Dashboard</Button>
        <Button variant="outline" onClick={() => toast.success("Workflow report generated")}><FileText className="size-4" />Generate Report</Button>
      </div>
    </div>
  );
}
