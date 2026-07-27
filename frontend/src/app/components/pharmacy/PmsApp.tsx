import { useEffect, useMemo, useState } from "react";
import {
  Activity, AlertTriangle, Archive, ArrowLeft, ArrowRight, BadgeCheck, BadgeAlert, BarChart3,
  BookOpen, CalendarDays, CheckCircle2, ChevronRight, ClipboardList, Clock, CreditCard,
  FileText, FolderOpen, Hammer, Inbox, Layers, ListChecks, Package, Pill, Printer,
  QrCode, RefreshCw, RotateCcw, ScanLine, Search, Send, ShieldAlert, ShoppingCart,
  Timer, Trash2, TrendingUp, TriangleAlert, Truck, Users, XCircle, Zap, Shield,
} from "lucide-react";
import { toast } from "sonner";
import { Shell, type NavItem, type Workspace } from "../his/Shell";
import { StatusBadge } from "../his/ui";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import {
  RxStatusBadge, StockStatusBadge, POStatusBadge, InsuranceStatusBadge, PmsStatCard, PmsSection, PmsPageHeader,
  DrugInteractionAlert, ControlledDrugBadge, MedicationCard,
} from "./pmsUi";
import {
  PRESCRIPTIONS, MEDICATIONS, STOCK, SUPPLIERS, AUDIT_LOGS,
  type Prescription, type StockItem,
} from "./data";
import { pharmacyApi } from "../../services/pharmacy";

type PmsRoute =
  | "dashboard" | "queue" | "details" | "verification" | "search"
  | "stock" | "dispensing" | "emergency" | "controlled" | "returns"
  | "inventory" | "purchase" | "billing" | "counselling" | "expiry"
  | "suppliers" | "analytics" | "complete";

const NAV: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: Activity },
  { id: "queue", label: "Prescription Queue", icon: ClipboardList, badge: "8" },
  { id: "details", label: "Prescription Details", icon: FileText },
  { id: "verification", label: "Medication Verification", icon: ShieldAlert, badge: "3", tone: "warning" },
  { id: "dispensing", label: "Dispensing", icon: Pill },
  { id: "emergency", label: "Emergency Dispensing", icon: Zap, badge: "2", tone: "danger" },
  { id: "controlled", label: "Controlled Drugs", icon: Shield },
  { id: "returns", label: "Medication Returns", icon: RotateCcw },
  { id: "inventory", label: "Inventory", icon: Package },
];
const NAV_SECONDARY: NavItem[] = [
  { id: "purchase", label: "Purchase Orders", icon: ShoppingCart },
  { id: "billing", label: "Billing & Insurance", icon: CreditCard },
  { id: "counselling", label: "Patient Counselling", icon: BookOpen },
  { id: "expiry", label: "Expiry Management", icon: Clock },
  { id: "suppliers", label: "Suppliers", icon: Truck },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
];

const CRUMBS: Record<PmsRoute, string[]> = {
  dashboard: ["Pharmacy", "Dashboard"],
  queue: ["Pharmacy", "Prescription Queue"],
  details: ["Pharmacy", "Prescription Queue", "Prescription Details"],
  verification: ["Pharmacy", "Medication Verification"],
  search: ["Pharmacy", "Medicine Search"],
  stock: ["Pharmacy", "Stock Availability"],
  dispensing: ["Pharmacy", "Barcode Dispensing"],
  emergency: ["Pharmacy", "Emergency Dispensing"],
  controlled: ["Pharmacy", "Controlled Drug Register"],
  returns: ["Pharmacy", "Medication Returns"],
  inventory: ["Pharmacy", "Inventory Management"],
  purchase: ["Pharmacy", "Purchase Orders"],
  billing: ["Pharmacy", "Billing & Insurance"],
  counselling: ["Pharmacy", "Patient Counselling"],
  expiry: ["Pharmacy", "Expiry Management"],
  suppliers: ["Pharmacy", "Supplier Management"],
  analytics: ["Pharmacy", "Analytics"],
  complete: ["Pharmacy", "Workflow Complete"],
};

function ActivityIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/></svg>;
}

export function PmsApp({ roleName, onSignOut, onSwitchWorkspace, onOpenSettings }: {
  roleName: string; onSignOut: () => void; onSwitchWorkspace: (w: Workspace) => void; onOpenSettings?: (page: string) => void;
}) {
  const [route, setRoute] = useState<PmsRoute>("dashboard");
  const [selectedRx, setSelectedRx] = useState<Prescription>(livePrescriptions[0]);
  const [dispenseConfirm, setDispenseConfirm] = useState(false);
  const [controlAuth, setControlAuth] = useState(false);
  const [livePrescriptions, setLivePrescriptions] = useState(PRESCRIPTIONS);
  const [liveStock, setLiveStock] = useState(STOCK);

  useEffect(() => {
    pharmacyApi.listPrescriptions().then(r => {
      if (r.data?.length) setLivePrescriptions(r.data.map((p: any) => ({
        rxNumber: p.prescriptionNumber || p._id,
        patientName: p.patient ? `${p.patient.firstName} ${p.patient.lastName}` : "",
        uhid: p.patient?.uhid || "",
        doctor: p.doctor?.name || "",
        date: p.createdAt || "",
        department: "General",
        medications: (p.medications || []).map((m: any) => ({
          name: m.drug || "",
          dosage: m.dosage || "",
          frequency: m.frequency || "",
          duration: m.duration || "",
          route: m.route || "Oral",
          instructions: m.instructions || "",
        })),
        status: p.status || "Pending",
        priority: "Routine",
        totalAmount: 0,
        notes: "",
        interactions: [],
      })));
    }).catch(() => {});

    pharmacyApi.listStock().then(r => {
      if (r.data?.length) setLiveStock(r.data.map((s: any) => ({
        name: s.name || "",
        genericName: s.genericName || "",
        form: s.form || "",
        strength: s.strength || "",
        batchNumber: s.batchNumber || "",
        manufacturer: s.manufacturer || "",
        stock: s.quantity || 0,
        minStock: s.reorderLevel || 0,
        maxStock: (s.reorderLevel || 0) * 3,
        mrp: s.unitPrice || 0,
        rack: "",
        expiryDate: s.expiryDate || "",
        gst: s.gst || 0,
        schedule: s.schedule || "N/A",
      })));
    }).catch(() => {});
  }, []);

  return (
    <Shell
      nav={NAV} navSecondary={NAV_SECONDARY} sectionLabel="Pharmacy"
      activeId={route} onNavigate={(id) => setRoute(id as PmsRoute)}
      breadcrumb={CRUMBS[route]} roleName={roleName} onSignOut={onSignOut}
      workspace="pharmacy" onSwitchWorkspace={onSwitchWorkspace}
      onOpenSettings={onOpenSettings}
      searchPlaceholder="Search patients, prescriptions, medicines…"
    >
      {route === "dashboard" && <Dashboard go={setRoute} openRx={(rx) => { setSelectedRx(rx); setRoute("details"); }} prescriptions={livePrescriptions} stock={liveStock} />}
      {route === "queue" && <PrescriptionQueue go={setRoute} openRx={(rx) => { setSelectedRx(rx); setRoute("details"); }} prescriptions={livePrescriptions} />}
      {route === "details" && <PrescriptionDetails rx={selectedRx} go={setRoute} />}
      {route === "verification" && <MedicationVerification go={setRoute} rx={selectedRx} />}
      {route === "search" && <MedicineSearch go={setRoute} stock={liveStock} />}
      {route === "stock" && <StockAvailability go={setRoute} stock={liveStock} />}
      {route === "dispensing" && <BarcodeDispensing go={setRoute} onConfirm={() => setDispenseConfirm(true)} />}
      {route === "emergency" && <EmergencyDispensing go={setRoute} />}
      {route === "controlled" && <ControlledDrugRegister go={setRoute} onAuth={() => setControlAuth(true)} stock={liveStock} />}
      {route === "returns" && <MedicationReturns go={setRoute} />}
      {route === "inventory" && <InventoryManagement go={setRoute} stock={liveStock} />}
      {route === "purchase" && <PurchaseOrders go={setRoute} />}
      {route === "billing" && <BillingInsurance go={setRoute} />}
      {route === "counselling" && <PatientCounselling go={setRoute} />}
      {route === "expiry" && <ExpiryManagement stock={liveStock} />}
      {route === "suppliers" && <SupplierManagement />}
      {route === "analytics" && <PharmacyAnalytics />}
      {route === "complete" && <WorkflowComplete go={setRoute} />}

      <Dialog open={dispenseConfirm} onOpenChange={setDispenseConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Dispensing</DialogTitle>
            <DialogDescription>Verify all medications have been barcode-scanned and verified before dispensing.</DialogDescription>
          </DialogHeader>
          <div className="rounded-lg bg-muted p-4 text-sm">
            <div className="font-medium">Rajesh Kumar · RX-2026-0722-001</div>
            <div className="mt-2 space-y-1 text-text-secondary">
              <div>• Paracetamol 650mg × 30</div>
              <div>• Amoxicillin 500mg × 21</div>
              <div>• Pantoprazole 40mg × 14</div>
              <div>• Metformin 500mg × 60</div>
            </div>
            <div className="mt-2 font-semibold">Total: ₹554.30</div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDispenseConfirm(false)}>Cancel</Button>
            <Button onClick={() => { setDispenseConfirm(false); toast.success("Medications dispensed", { description: "Labels printed. Proceed to billing." }); setRoute("billing"); }}>Confirm & Dispense</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={controlAuth} onOpenChange={setControlAuth}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Controlled Drug — Dual Authorization</DialogTitle>
            <DialogDescription>Both the dispensing pharmacist and witness must sign before releasing controlled substances.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <div className="rounded-lg bg-danger/5 p-4">
              <div className="font-medium text-danger">Morphine 10 mg × 2 ampoules</div>
              <div className="text-text-secondary">Schedule H drug · Requires controlled drug register entry</div>
            </div>
            <label className="block text-sm font-medium">Dispensing Pharmacist PIN</label>
            <Input type="password" placeholder="Enter PIN" />
            <label className="block text-sm font-medium">Witness Pharmacist PIN</label>
            <Input type="password" placeholder="Enter PIN" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setControlAuth(false)}>Cancel</Button>
            <Button onClick={() => { setControlAuth(false); toast.success("Controlled drug dispensed", { description: "Dual authorization recorded. Register updated." }); }}>Authorize & Dispense</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Shell>
  );
}

/* ================================================================== */
/* SCREEN 01 — DASHBOARD                                              */
/* ================================================================== */
function Dashboard({ go, openRx, prescriptions, stock }: { go: (r: PmsRoute) => void; openRx: (rx: Prescription) => void; prescriptions: Prescription[]; stock: StockItem[] }) {
   const pending = prescriptions.filter((rx) => rx.status === "Pending").length;
   const dispensing = prescriptions.filter((rx) => rx.status === "Dispensing").length;
   const lowStock = stock.filter((s) => s.status === "Low Stock").length;
   const expired = stock.filter((s) => s.status === "Expired").length;
   const controlled = prescriptions.some((rx) => rx.medications.some((m) => m.schedule !== "N/A"));

  return (
    <div className="space-y-6">
      <PmsPageHeader title="Pharmacy Dashboard" subtitle="Thursday, 22 July 2026 · Day Shift" actions={
        <Button onClick={() => go("queue")}><ClipboardList className="size-4" />View queue</Button>
      } />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <PmsStatCard icon={ClipboardList} label="Today's Prescriptions" value={prescriptions.length} hint={`${pending} pending verification`} tone="brand" />
        <PmsStatCard icon={Pill} label="Pending Dispensing" value={dispensing + pending} hint="Awaiting verification" tone="warning" />
        <PmsStatCard icon={Package} label="Low Stock Alerts" value={lowStock} hint="Reorder required" tone="danger" />
        <PmsStatCard icon={CreditCard} label="Revenue Today" value="₹18,420" hint="8 prescriptions dispensed" trend={12} tone="success" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <PmsStatCard icon={Clock} label="Expired Medicines" value={expired} hint="Remove from stock" tone="danger" />
        <PmsStatCard icon={Shield} label="Controlled Drugs" value={controlled ? "1 pending" : "0"} hint="Dual authorization" tone="warning" />
        <PmsStatCard icon={Truck} label="Purchase Orders" value="3" hint="1 awaiting approval" tone="info" />
        <PmsStatCard icon={Users} label="Patient Counselling" value="5" hint="Pending today" tone="info" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <PmsSection title="STAT Prescriptions" action={<Button variant="ghost" size="sm" onClick={() => go("queue")}>All prescriptions <ChevronRight className="size-4" /></Button>}>
          <div className="divide-y divide-border">
            {prescriptions.filter((rx) => rx.priority === "STAT").map((rx) => (
              <button key={rx.rxId} onClick={() => openRx(rx)} className="flex w-full items-center gap-3 px-5 py-4 text-left hover:bg-accent">
                <div className="grid size-9 place-items-center rounded-lg bg-danger/10 text-danger"><Zap className="size-4" /></div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{rx.patientName}</span>
                    <StatusBadge tone="danger">STAT</StatusBadge>
                    <RxStatusBadge status={rx.status}>{rx.status}</RxStatusBadge>
                  </div>
                  <p className="mt-1 text-xs text-text-secondary">{rx.medications.length} medications · {rx.orderingDoctor} · ₹{rx.totalAmount.toLocaleString("en-IN")}</p>
                </div>
                <div className="text-right text-xs text-text-secondary">{rx.rxTime}</div>
              </button>
            ))}
          </div>
        </PmsSection>

        <div className="space-y-6">
          <PmsSection title="Low Stock Alerts">
            <div className="space-y-3">
              {stock.filter((s) => s.status === "Low Stock").map((s) => (
                <div key={s.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <div className="text-sm font-medium">{s.brandName}</div>
                    <div className="text-xs text-text-secondary">{s.strength} · {s.currentStock}/{s.minStock} min</div>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => go("purchase")}>Reorder</Button>
                </div>
              ))}
            </div>
          </PmsSection>

          <PmsSection title="Recent Activity">
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
          </PmsSection>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* SCREEN 02 — PRESCRIPTION QUEUE                                     */
/* ================================================================== */
function PrescriptionQueue({ go, openRx, prescriptions }: { go: (r: PmsRoute) => void; openRx: (rx: Prescription) => void; prescriptions: Prescription[] }) {
   const [query, setQuery] = useState("");
   const [filter, setFilter] = useState("All");
   const rxs = useMemo(() => {
     let list = prescriptions;
     if (query) list = list.filter((rx) => `${rx.patientName} ${rx.uhid} ${rx.rxId}`.toLowerCase().includes(query.toLowerCase()));
     if (filter !== "All") list = list.filter((rx) => rx.status === filter);
     return list;
   }, [query, filter, prescriptions]);

   const statuses = ["All", "Pending", "Verified", "Dispensing", "Dispensed", "Billed"];

   return (
     <div className="space-y-6">
       <PmsPageHeader title="Prescription Queue" subtitle={`${prescriptions.length} prescriptions today`} actions={
         <Button onClick={() => go("search")}><Search className="size-4" />Search medicines</Button>
       } />
      <div className="flex flex-wrap items-center gap-3">
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search patient, UHID, prescription ID…" className="max-w-sm" />
        <div className="flex gap-1 overflow-x-auto">
          {statuses.map((s) => (
            <Button key={s} size="sm" variant={filter === s ? "default" : "outline"} onClick={() => setFilter(s)}>{s}</Button>
          ))}
        </div>
      </div>

      <PmsSection title={`${rxs.length} prescriptions`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-muted text-left text-xs uppercase tracking-wide text-text-secondary">
              <tr>
                <th className="px-5 py-3 font-medium">Patient</th>
                <th className="px-5 py-3 font-medium">Rx ID</th>
                <th className="px-5 py-3 font-medium">Doctor</th>
                <th className="px-5 py-3 font-medium">Meds</th>
                <th className="px-5 py-3 font-medium">Priority</th>
                <th className="px-5 py-3 font-medium">Amount</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Time</th>
                <th className="px-5 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {rxs.map((rx) => (
                <tr key={rx.rxId} className="border-t border-border hover:bg-accent">
                  <td className="px-5 py-4">
                    <div className="font-medium">{rx.patientName}</div>
                    <div className="text-xs text-text-secondary">{rx.uhid} · {rx.age}{rx.gender[0]}</div>
                  </td>
                  <td className="px-5 py-4 font-mono text-xs">{rx.rxId}</td>
                  <td className="px-5 py-4">{rx.orderingDoctor}<div className="text-xs text-text-secondary">{rx.department}</div></td>
                  <td className="px-5 py-4">{rx.medications.length}</td>
                  <td className="px-5 py-4"><StatusBadge tone={rx.priority === "STAT" ? "danger" : rx.priority === "Urgent" ? "warning" : "info"}>{rx.priority}</StatusBadge></td>
                  <td className="px-5 py-4 font-medium">₹{rx.totalAmount.toLocaleString("en-IN")}</td>
                  <td className="px-5 py-4"><RxStatusBadge status={rx.status}>{rx.status}</RxStatusBadge></td>
                  <td className="px-5 py-4 text-xs text-text-secondary">{rx.rxTime}</td>
                  <td className="px-5 py-4">
                    <Button size="sm" variant="outline" onClick={() => openRx(rx)}>Open</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PmsSection>
    </div>
  );
}

/* ================================================================== */
/* SCREEN 03 — PRESCRIPTION DETAILS                                   */
/* ================================================================== */
function PrescriptionDetails({ rx, go }: { rx: Prescription; go: (r: PmsRoute) => void }) {
  return (
    <div className="space-y-6">
      <PmsPageHeader title="Prescription Details" subtitle={`Rx: ${rx.rxId} · ${rx.patientName}`} actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => go("queue")}><ArrowLeft className="size-4" />Back</Button>
          <Button onClick={() => go("verification")}><ShieldAlert className="size-4" />Verify</Button>
        </div>
      } />

      <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
        <div className="space-y-4">
          <PmsSection title="Patient Information">
            <div className="grid grid-cols-2 gap-4 text-sm lg:grid-cols-4">
              <div><span className="text-text-secondary">Patient</span><p className="font-medium">{rx.patientName}</p></div>
              <div><span className="text-text-secondary">UHID</span><p className="font-medium">{rx.uhid}</p></div>
              <div><span className="text-text-secondary">Age/Sex</span><p className="font-medium">{rx.age}{rx.gender[0]}</p></div>
              <div><span className="text-text-secondary">Insurance</span><p className="font-medium">{rx.insurance}</p></div>
            </div>
            {rx.allergies.length > 0 && (
              <div className="mt-3 rounded-lg border border-danger/20 bg-danger/5 p-3 text-sm">
                <span className="font-semibold text-danger">Allergies:</span> <span className="text-text-primary">{rx.allergies.join(", ")}</span>
              </div>
            )}
          </PmsSection>

          <PmsSection title="Medication List">
            <div className="space-y-3">
              {rx.medications.map((m) => (
                <MedicationCard key={m.id} med={m} />
              ))}
            </div>
          </PmsSection>

          <PmsSection title="Clinical Notes">
            <p className="text-sm text-text-secondary">{rx.clinicalNotes}</p>
          </PmsSection>
        </div>

        <div className="space-y-4">
          <PmsSection title="Prescription Summary">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-text-secondary">Rx ID</span><span className="font-mono font-medium">{rx.rxId}</span></div>
              <div className="flex justify-between"><span className="text-text-secondary">Doctor</span><span className="font-medium">{rx.orderingDoctor}</span></div>
              <div className="flex justify-between"><span className="text-text-secondary">Department</span><span className="font-medium">{rx.department}</span></div>
              <div className="flex justify-between"><span className="text-text-secondary">Priority</span><StatusBadge tone={rx.priority === "STAT" ? "danger" : "info"}>{rx.priority}</StatusBadge></div>
              <div className="flex justify-between"><span className="text-text-secondary">Status</span><RxStatusBadge status={rx.status}>{rx.status}</RxStatusBadge></div>
              <div className="flex justify-between"><span className="text-text-secondary">Time</span><span className="font-medium">{rx.rxTime}</span></div>
            </div>
          </PmsSection>

          <PmsSection title="Billing">
            <div className="space-y-2 text-sm">
              {rx.medications.map((m) => (
                <div key={m.id} className="flex justify-between">
                  <span className="text-text-secondary">{m.brandName} × {m.quantity}</span>
                  <span className="font-medium">₹{m.totalPrice.toLocaleString("en-IN")}</span>
                </div>
              ))}
              <div className="border-t border-border pt-2 flex justify-between font-semibold">
                <span>Total</span><span>₹{rx.totalAmount.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </PmsSection>

          <PmsSection title="Quick Actions">
            <div className="space-y-2">
              <Button className="w-full" onClick={() => go("verification")}><ShieldAlert className="size-4" />Verify Prescription</Button>
              <Button className="w-full" variant="outline" onClick={() => go("dispensing")}><ScanLine className="size-4" />Barcode Dispensing</Button>
              <Button className="w-full" variant="outline" onClick={() => go("billing")}><CreditCard className="size-4" />Billing</Button>
              <Button className="w-full" variant="outline" onClick={() => go("counselling")}><BookOpen className="size-4" />Patient Counselling</Button>
            </div>
          </PmsSection>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* SCREEN 04 — MEDICATION VERIFICATION                                */
/* ================================================================== */
function MedicationVerification({ go, rx }: { go: (r: PmsRoute) => void; rx: Prescription }) {
  return (
    <div className="space-y-6">
      <PmsPageHeader title="Medication Verification" subtitle={`Verify ${rx.patientName} — ${rx.rxId}`} actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => go("details")}><ArrowLeft className="size-4" />Back</Button>
          <Button onClick={() => { toast.success("Prescription verified", { description: "Ready for dispensing." }); go("dispensing"); }}>
            <CheckCircle2 className="size-4" />Approve
          </Button>
        </div>
      } />

      <div className="rounded-xl border border-warning/20 bg-warning/5 p-4 text-sm text-[#b45309]">
        <b>Clinical Validation:</b> Review drug interactions, allergies, duplicate therapy, and dose appropriateness before approving.
      </div>

      <div className="space-y-4">
        <DrugInteractionAlert drugs={["Heparin", "Aspirin"]} severity="Severe" description="Increased risk of bleeding. Monitor closely. Consider alternative anticoagulant." />

        <PmsSection title="Interaction & Allergy Check">
          <div className="space-y-3">
            {rx.medications.map((m) => {
              const hasAllergy = rx.allergies.some((a) => m.genericName.toLowerCase().includes(a.toLowerCase()));
              return (
                <div key={m.id} className="flex items-center gap-4 rounded-lg border border-border p-4">
                  <CheckCircle2 className="size-5 text-success" />
                  <div className="flex-1">
                    <div className="font-medium">{m.genericName} {m.strength}</div>
                    <div className="text-xs text-text-secondary">{m.brandName} · {m.dosageForm} · {m.frequency}</div>
                  </div>
                  {hasAllergy ? (
                    <StatusBadge tone="danger">Allergy Alert</StatusBadge>
                  ) : (
                    <StatusBadge tone="success">No Issues</StatusBadge>
                  )}
                </div>
              );
            })}
          </div>
        </PmsSection>

        <PmsSection title="Dose Appropriateness">
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-success"><CheckCircle2 className="size-4" />Renal dose: No adjustment required</div>
            <div className="flex items-center gap-2 text-success"><CheckCircle2 className="size-4" />Hepatic dose: No adjustment required</div>
            <div className="flex items-center gap-2 text-success"><CheckCircle2 className="size-4" />Pediatric dose: Not applicable (adult patient)</div>
            <div className="flex items-center gap-2 text-success"><CheckCircle2 className="size-4" />Duplicate therapy: None detected</div>
          </div>
        </PmsSection>
      </div>
    </div>
  );
}

/* ================================================================== */
/* SCREEN 05 — MEDICINE SEARCH                                        */
/* ================================================================== */
function MedicineSearch({ go, stock }: { go: (r: PmsRoute) => void; stock: StockItem[] }) {
   const [query, setQuery] = useState("");
   const results = useMemo(() => {
     if (!query) return stock;
     return stock.filter((s) => `${s.genericName} ${s.brandName}`.toLowerCase().includes(query.toLowerCase()));
   }, [query, stock]);

  return (
    <div className="space-y-6">
      <PmsPageHeader title="Medicine Search" subtitle="Search by generic name, brand, or manufacturer" actions={
        <Button variant="outline" onClick={() => go("queue")}><ArrowLeft className="size-4" />Back</Button>
      } />
      <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search medicines…" className="max-w-md" />

      <PmsSection title={`${results.length} results`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-sm">
            <thead className="bg-muted text-left text-xs uppercase tracking-wide text-text-secondary">
              <tr>
                <th className="px-5 py-3 font-medium">Medicine</th>
                <th className="px-5 py-3 font-medium">Form</th>
                <th className="px-5 py-3 font-medium">Stock</th>
                <th className="px-5 py-3 font-medium">Batch</th>
                <th className="px-5 py-3 font-medium">Expiry</th>
                <th className="px-5 py-3 font-medium">MRP</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {results.map((s) => (
                <tr key={s.id} className="border-t border-border hover:bg-accent">
                  <td className="px-5 py-4">
                    <div className="font-medium">{s.genericName} {s.strength}</div>
                    <div className="text-xs text-text-secondary">{s.brandName} · {s.manufacturer}</div>
                  </td>
                  <td className="px-5 py-4">{s.dosageForm}</td>
                  <td className="px-5 py-4">{s.currentStock} {s.dosageForm === "Tablet" || s.dosageForm === "Capsule" ? "tabs" : "units"}</td>
                  <td className="px-5 py-4 font-mono text-xs">{s.batchNumber}</td>
                  <td className="px-5 py-4 text-xs">{s.expiryDate}</td>
                  <td className="px-5 py-4 font-medium">₹{s.mrp}</td>
                  <td className="px-5 py-4"><StockStatusBadge status={s.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PmsSection>
    </div>
  );
}

/* ================================================================== */
/* SCREEN 06 — STOCK AVAILABILITY                                     */
/* ================================================================== */
function StockAvailability({ go, stock }: { go: (r: PmsRoute) => void; stock: StockItem[] }) {
   return (
     <div className="space-y-6">
       <PmsPageHeader title="Stock Availability" subtitle="Batch-wise stock details" actions={
         <Button variant="outline" onClick={() => go("inventory")}><ArrowLeft className="size-4" />Inventory</Button>
       } />

       <PmsSection title="Stock by Medicine">
         <div className="overflow-x-auto">
           <table className="w-full min-w-[900px] text-sm">
             <thead className="bg-muted text-left text-xs uppercase tracking-wide text-text-secondary">
               <tr>
                 <th className="px-5 py-3 font-medium">Medicine</th>
                 <th className="px-5 py-3 font-medium">Batch</th>
                 <th className="px-5 py-3 font-medium">Expiry</th>
                 <th className="px-5 py-3 font-medium">Stock</th>
                 <th className="px-5 py-3 font-medium">Min</th>
                 <th className="px-5 py-3 font-medium">Rack</th>
                 <th className="px-5 py-3 font-medium">FIFO</th>
                 <th className="px-5 py-3 font-medium">Status</th>
               </tr>
             </thead>
             <tbody>
               {stock.map((s) => (
                <tr key={s.id} className="border-t border-border hover:bg-accent">
                  <td className="px-5 py-4">
                    <div className="font-medium">{s.brandName} {s.strength}</div>
                    <div className="text-xs text-text-secondary">{s.genericName} · {s.dosageForm}</div>
                  </td>
                  <td className="px-5 py-4 font-mono text-xs">{s.batchNumber}</td>
                  <td className="px-5 py-4 text-xs">{s.expiryDate}</td>
                  <td className="px-5 py-4 font-semibold">{s.currentStock}</td>
                  <td className="px-5 py-4 text-text-secondary">{s.minStock}</td>
                  <td className="px-5 py-4 font-mono text-xs">{s.rackLocation}</td>
                  <td className="px-5 py-4 text-xs">FIFO</td>
                  <td className="px-5 py-4"><StockStatusBadge status={s.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PmsSection>
    </div>
  );
}

/* ================================================================== */
/* SCREEN 07 — BARCODE DISPENSING                                     */
/* ================================================================== */
function BarcodeDispensing({ go, onConfirm }: { go: (r: PmsRoute) => void; onConfirm: () => void }) {
  const [scanned, setScanned] = useState(false);
  return (
    <div className="space-y-6">
      <PmsPageHeader title="Barcode Dispensing" subtitle="Scan medicine barcodes to verify and dispense" actions={
        <Button variant="outline" onClick={() => go("queue")}><ArrowLeft className="size-4" />Back</Button>
      } />

      <div className="rounded-xl border border-info/20 bg-info/5 p-4 text-sm text-[#0369a1]">
        <b>Step 1:</b> Scan patient wristband. <b>Step 2:</b> Scan each medicine barcode. <b>Step 3:</b> Verify and dispense.
      </div>

      <PmsSection title="Barcode Scanner">
        <div className="flex items-center gap-3">
          <Input value={scanned ? "PAR-650-2026-0891" : ""} onChange={() => {}} placeholder="Scan medicine barcode…" className="max-w-md" />
          <Button onClick={() => setScanned(true)}><ScanLine className="size-4" />Scan</Button>
        </div>
        {scanned && (
          <div className="mt-4 rounded-lg border border-success/30 bg-success/5 p-4 text-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Paracetamol 650mg — Crocin 650</div>
                <div className="text-text-secondary">Batch: BAT-2026-0891 · Expiry: 2027-06-30 · Qty: 30</div>
              </div>
              <StatusBadge tone="success">Verified</StatusBadge>
            </div>
          </div>
        )}
      </PmsSection>

      {scanned && (
        <PmsSection title="Verified Medications">
          <div className="space-y-2">
            {MEDICATIONS.slice(0, 4).map((m) => (
              <div key={m.id} className="flex items-center gap-4 rounded-lg border border-border p-4">
                <CheckCircle2 className="size-5 text-success" />
                <div className="flex-1">
                  <div className="font-medium">{m.brandName} {m.strength}</div>
                  <div className="text-xs text-text-secondary">Batch: {m.batchNumber} · Qty: {m.quantity} · ₹{m.totalPrice}</div>
                </div>
                <StatusBadge tone="success">Verified</StatusBadge>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-end gap-3">
            <Button onClick={onConfirm}><Pill className="size-4" />Dispense Medications</Button>
          </div>
        </PmsSection>
      )}
    </div>
  );
}

/* ================================================================== */
/* SCREEN 08 — EMERGENCY DISPENSING                                   */
/* ================================================================== */
function EmergencyDispensing({ go }: { go: (r: PmsRoute) => void }) {
  return (
    <div className="space-y-6">
      <PmsPageHeader title="Emergency Dispensing" subtitle="STAT medications — override authorization" actions={
        <Button variant="outline" onClick={() => go("queue")}><ArrowLeft className="size-4" />Back</Button>
      } />

      <div className="rounded-xl border border-danger/20 bg-danger/5 p-4 text-sm text-danger">
        <b>Emergency Override:</b> These medications can be dispensed without prior clinical verification. Pharmacist must document clinical justification.
      </div>

      <PmsSection title="Emergency Drug Kit">
        <div className="space-y-3">
          {[
            { name: "Adrenaline 1mg", use: "Cardiac arrest, anaphylaxis", stock: 10 },
            { name: "Atropine 0.6mg", use: "Symptomatic bradycardia", stock: 8 },
            { name: "Amiodarone 150mg", use: "Ventricular arrhythmia", stock: 5 },
            { name: "Dextrose 50%", use: "Hypoglycemia", stock: 12 },
            { name: "Naloxone 0.4mg", use: "Opioid overdose", stock: 6 },
            { name: "Lorazepam 2mg", use: "Status epilepticus", stock: 4 },
          ].map((d) => (
            <div key={d.name} className="flex items-center gap-4 rounded-lg border border-border p-4">
              <div className="grid size-9 place-items-center rounded-lg bg-danger/10 text-danger"><Zap className="size-4" /></div>
              <div className="flex-1">
                <div className="font-medium">{d.name}</div>
                <div className="text-xs text-text-secondary">{d.use} · Stock: {d.stock}</div>
              </div>
              <Button size="sm" onClick={() => toast.success(`${d.name} dispensed`, { description: "Override authorization recorded." })}>Dispense</Button>
            </div>
          ))}
        </div>
      </PmsSection>
    </div>
  );
}

/* ================================================================== */
/* SCREEN 09 — CONTROLLED DRUG REGISTER                               */
/* ================================================================== */
function ControlledDrugRegister({ go, onAuth, stock }: { go: (r: PmsRoute) => void; onAuth: () => void; stock: StockItem[] }) {
   return (
     <div className="space-y-6">
       <PmsPageHeader title="Controlled Drug Register" subtitle="Schedule H/H1 drug management" actions={
         <Button variant="outline" onClick={() => go("queue")}><ArrowLeft className="size-4" />Back</Button>
       } />

      <div className="rounded-xl border border-danger/20 bg-danger/5 p-4 text-sm text-danger">
        <b>Controlled Drug Protocol:</b> All Schedule H and H1 drugs require dual authorization, witness verification, and register entry before dispensing.
      </div>

      <PmsSection title="Controlled Drug Inventory">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-sm">
            <thead className="bg-muted text-left text-xs uppercase tracking-wide text-text-secondary">
              <tr>
                <th className="px-5 py-3 font-medium">Drug</th>
                <th className="px-5 py-3 font-medium">Schedule</th>
                <th className="px-5 py-3 font-medium">Stock</th>
                <th className="px-5 py-3 font-medium">Issued Today</th>
                <th className="px-5 py-3 font-medium">Balance</th>
                <th className="px-5 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {stock.filter((s) => s.schedule !== "N/A").map((s) => (
                <tr key={s.id} className="border-t border-border hover:bg-accent">
                  <td className="px-5 py-4">
                    <div className="font-medium">{s.brandName} {s.strength}</div>
                    <div className="text-xs text-text-secondary">{s.genericName}</div>
                  </td>
                  <td className="px-5 py-4"><ControlledDrugBadge /></td>
                  <td className="px-5 py-4 font-semibold">{s.currentStock}</td>
                  <td className="px-5 py-4">2</td>
                  <td className="px-5 py-4 font-semibold">{s.currentStock - 2}</td>
                  <td className="px-5 py-4"><Button size="sm" onClick={onAuth}>Issue</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PmsSection>

      <PmsSection title="Issue Register">
        <div className="divide-y divide-border">
          {AUDIT_LOGS.filter((a) => a.action.includes("Controlled") || a.detail.includes("controlled")).map((a) => (
            <div key={a.id} className="flex items-start gap-3 px-5 py-4">
              <div className="mt-1 size-2 shrink-0 rounded-full bg-danger" />
              <div className="min-w-0 flex-1">
                <div className="font-medium">{a.action}</div>
                <div className="text-xs text-text-secondary">{a.detail}</div>
                <div className="mt-1 text-[10px] text-text-secondary">{a.timestamp} · {a.user}</div>
              </div>
            </div>
          ))}
        </div>
      </PmsSection>
    </div>
  );
}

/* ================================================================== */
/* SCREEN 10 — MEDICATION RETURNS                                     */
/* ================================================================== */
function MedicationReturns({ go }: { go: (r: PmsRoute) => void }) {
  return (
    <div className="space-y-6">
      <PmsPageHeader title="Medication Returns" subtitle="Process returned medicines" actions={
        <Button variant="outline" onClick={() => go("inventory")}><ArrowLeft className="size-4" />Inventory</Button>
      } />

      <PmsSection title="Pending Returns">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-sm">
            <thead className="bg-muted text-left text-xs uppercase tracking-wide text-text-secondary">
              <tr>
                <th className="px-5 py-3 font-medium">Medicine</th>
                <th className="px-5 py-3 font-medium">Batch</th>
                <th className="px-5 py-3 font-medium">Qty</th>
                <th className="px-5 py-3 font-medium">Reason</th>
                <th className="px-5 py-3 font-medium">Expiry</th>
                <th className="px-5 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                { med: "Paracetamol 650mg", batch: "BAT-2026-0891", qty: 5, reason: "Patient discharged", expiry: "2027-06-30", quality: "OK" },
                { med: "Diclofenac 50mg", batch: "BAT-2026-0698", qty: 10, reason: "Expired stock", expiry: "2025-10-31", quality: "Expired" },
                { med: "Amoxicillin 500mg", batch: "BAT-2026-0755", qty: 3, reason: "Adverse reaction", expiry: "2027-03-15", quality: "OK" },
              ].map((r, i) => (
                <tr key={i} className="border-t border-border hover:bg-accent">
                  <td className="px-5 py-4 font-medium">{r.med}</td>
                  <td className="px-5 py-4 font-mono text-xs">{r.batch}</td>
                  <td className="px-5 py-4">{r.qty}</td>
                  <td className="px-5 py-4 text-xs">{r.reason}</td>
                  <td className="px-5 py-4 text-xs">{r.expiry}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => toast.success("Return accepted — restocked")}>Accept</Button>
                      <Button size="sm" variant="ghost" onClick={() => toast.success("Return rejected")}>Reject</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PmsSection>
    </div>
  );
}

/* ================================================================== */
/* SCREEN 11 — INVENTORY MANAGEMENT                                   */
/* ================================================================== */
function InventoryManagement({ go, stock }: { go: (r: PmsRoute) => void; stock: StockItem[] }) {
  return (
    <div className="space-y-6">
      <PmsPageHeader title="Inventory Management" subtitle="Medicine inventory and batch management" actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => go("stock")}><Package className="size-4" />Stock check</Button>
          <Button onClick={() => toast.success("Cycle count initiated")}><RefreshCw className="size-4" />Cycle count</Button>
        </div>
      } />

      <PmsSection title="Inventory Overview">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-muted text-left text-xs uppercase tracking-wide text-text-secondary">
              <tr>
                <th className="px-5 py-3 font-medium">Medicine</th>
                <th className="px-5 py-3 font-medium">Batch</th>
                <th className="px-5 py-3 font-medium">Expiry</th>
                <th className="px-5 py-3 font-medium">Stock</th>
                <th className="px-5 py-3 font-medium">Min/Max</th>
                <th className="px-5 py-3 font-medium">Value</th>
                <th className="px-5 py-3 font-medium">Rack</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
{stock.map((s) => (
	                 <tr key={s.id} className="border-t border-border hover:bg-accent">
	                   <td className="px-5 py-4">
	                     <div className="font-medium">{s.brandName} {s.strength}</div>
	                     <div className="text-xs text-text-secondary">{s.genericName} · {s.dosageForm}</div>
	                   </td>
	                   <td className="px-5 py-4 font-mono text-xs">{s.batchNumber}</td>
	                   <td className="px-5 py-4 text-xs">{s.expiryDate}</td>
	                   <td className="px-5 py-4 font-semibold">{s.currentStock}</td>
	                   <td className="px-5 py-4 text-xs">{s.minStock}/{s.maxStock}</td>
	                   <td className="px-5 py-4 font-medium">₹{(s.currentStock * s.unitPrice).toLocaleString("en-IN")}</td>
	                   <td className="px-5 py-4 font-mono text-xs">{s.rackLocation}</td>
	                   <td className="px-5 py-4"><StockStatusBadge status={s.status} /></td>
	                 </tr>
	               ))}
            </tbody>
          </table>
        </div>
      </PmsSection>
    </div>
  );
}

/* ================================================================== */
/* SCREEN 12 — PURCHASE ORDERS                                        */
/* ================================================================== */
function PurchaseOrders({ go }: { go: (r: PmsRoute) => void }) {
  const poStatuses: { po: string; supplier: string; items: number; amount: string; status: "Draft" | "Pending Approval" | "Approved" | "Ordered" | "Received"; date: string }[] = [
    { po: "PO-2026-0722-001", supplier: "Cipla Pharma", items: 3, amount: "₹45,200", status: "Pending Approval", date: "22 Jul" },
    { po: "PO-2026-0720-003", supplier: "Sanofi India", items: 1, amount: "₹18,900", status: "Approved", date: "20 Jul" },
    { po: "PO-2026-0718-002", supplier: "Lupin Pharma", items: 5, amount: "₹32,100", status: "Ordered", date: "18 Jul" },
    { po: "PO-2026-0715-001", supplier: "Alkem Labs", items: 2, amount: "₹12,500", status: "Received", date: "15 Jul" },
  ];

  return (
    <div className="space-y-6">
      <PmsPageHeader title="Purchase Orders" subtitle="Manage orders and supplier invoices" actions={
        <Button onClick={() => toast.success("New purchase order form opened")}><ShoppingCart className="size-4" />New PO</Button>
      } />

      <PmsSection title="Purchase Orders">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-sm">
            <thead className="bg-muted text-left text-xs uppercase tracking-wide text-text-secondary">
              <tr>
                <th className="px-5 py-3 font-medium">PO Number</th>
                <th className="px-5 py-3 font-medium">Supplier</th>
                <th className="px-5 py-3 font-medium">Items</th>
                <th className="px-5 py-3 font-medium">Amount</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {poStatuses.map((po) => (
                <tr key={po.po} className="border-t border-border hover:bg-accent">
                  <td className="px-5 py-4 font-mono text-xs">{po.po}</td>
                  <td className="px-5 py-4">{po.supplier}</td>
                  <td className="px-5 py-4">{po.items}</td>
                  <td className="px-5 py-4 font-medium">{po.amount}</td>
                  <td className="px-5 py-4 text-xs">{po.date}</td>
                  <td className="px-5 py-4"><POStatusBadge status={po.status} /></td>
                  <td className="px-5 py-4">
                    <Button size="sm" variant="outline" onClick={() => toast.info("PO details opened")}>View</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PmsSection>
    </div>
  );
}

/* ================================================================== */
/* SCREEN 13 — BILLING & INSURANCE                                    */
/* ================================================================== */
function BillingInsurance({ go }: { go: (r: PmsRoute) => void }) {
  return (
    <div className="space-y-6">
      <PmsPageHeader title="Billing & Insurance" subtitle="Process payments and insurance claims" actions={
        <Button variant="outline" onClick={() => go("dispensing")}><ArrowLeft className="size-4" />Back</Button>
      } />

      <PmsSection title="Medication Charges — Rajesh Kumar">
        <div className="space-y-3">
          {MEDICATIONS.slice(0, 4).map((m) => (
            <div key={m.id} className="flex items-center justify-between px-5 py-3">
              <div>
                <div className="font-medium">{m.brandName} {m.strength} × {m.quantity}</div>
                <div className="text-xs text-text-secondary">{m.genericName} · {m.dosageForm}</div>
              </div>
              <div className="text-right">
                <div className="font-medium">₹{m.totalPrice.toLocaleString("en-IN")}</div>
                <div className="text-xs text-text-secondary">MRP: ₹{m.unitPrice}/unit</div>
              </div>
            </div>
          ))}
          <div className="border-t border-border px-5 py-3">
            <div className="flex justify-between font-semibold"><span>Subtotal</span><span>₹554.30</span></div>
            <div className="flex justify-between text-sm text-success"><span>Insurance Discount (10%)</span><span>-₹55.43</span></div>
            <div className="flex justify-between text-sm"><span>Co-payment</span><span>₹55.43</span></div>
            <div className="flex justify-between text-sm"><span>GST (5%)</span><span>₹24.94</span></div>
            <div className="mt-2 flex justify-between border-t border-border pt-2 font-bold text-lg"><span>Total Payable</span><span>₹523.84</span></div>
          </div>
        </div>
      </PmsSection>

      <div className="grid gap-6 lg:grid-cols-2">
        <PmsSection title="Insurance Details">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-text-secondary">Insurance</span><span className="font-medium">Star Health — Family Optima</span></div>
            <div className="flex justify-between"><span className="text-text-secondary">Policy No</span><span className="font-medium">SH-2024-78901</span></div>
            <div className="flex justify-between"><span className="text-text-secondary">Coverage</span><InsuranceStatusBadge status="Approved" /></div>
            <div className="flex justify-between"><span className="text-text-secondary">Claim Amount</span><span className="font-medium">₹55.43</span></div>
          </div>
        </PmsSection>

        <PmsSection title="Payment">
          <div className="space-y-3">
            <Button className="w-full" onClick={() => toast.success("Payment processed", { description: "Receipt #REC-2026-0722-018 generated" })}>
              <CreditCard className="size-4" />Process Payment — ₹523.84
            </Button>
            <Button className="w-full" variant="outline" onClick={() => toast.success("Insurance claim submitted")}>
              <Send className="size-4" />Submit Insurance Claim
            </Button>
          </div>
        </PmsSection>
      </div>
    </div>
  );
}

/* ================================================================== */
/* SCREEN 14 — PATIENT COUNSELLING                                    */
/* ================================================================== */
function PatientCounselling({ go }: { go: (r: PmsRoute) => void }) {
  return (
    <div className="space-y-6">
      <PmsPageHeader title="Patient Counselling" subtitle="Medication instructions for Rajesh Kumar" actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => go("billing")}><ArrowLeft className="size-4" />Back</Button>
          <Button onClick={() => { toast.success("Counselling completed", { description: "Information leaflet sent to patient portal." }); go("complete"); }}>
            <CheckCircle2 className="size-4" />Confirm Counselling
          </Button>
        </div>
      } />

      <div className="space-y-4">
        {MEDICATIONS.slice(0, 4).map((m) => (
          <PmsSection key={m.id} title={`${m.brandName} ${m.strength}`}>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <div><span className="text-text-secondary">Dosage</span><p className="font-medium">{m.strength} · {m.dosageForm}</p></div>
                <div><span className="text-text-secondary">Frequency</span><p className="font-medium">{m.frequency}</p></div>
                <div><span className="text-text-secondary">Duration</span><p className="font-medium">{m.duration}</p></div>
                <div><span className="text-text-secondary">Route</span><p className="font-medium">{m.route}</p></div>
              </div>
              <div className="rounded-lg bg-muted p-3">
                <div className="font-medium text-text-primary">Instructions</div>
                <p className="mt-1 text-text-secondary">{m.instructions}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="rounded-lg bg-info/5 p-3 text-[#0369a1]"><b>Food interaction:</b> {m.route === "Oral" ? "Take after food to reduce gastric irritation" : "No food restrictions"}</div>
                <div className="rounded-lg bg-warning/5 p-3 text-[#b45309]"><b>Missed dose:</b> Take as soon as remembered. Do not double the dose.</div>
              </div>
              <div className="rounded-lg bg-muted p-3 text-xs text-text-secondary">
                <b>Storage:</b> Store at room temperature (15–25°C). Keep away from direct sunlight. {m.dosageForm === "Injection" ? "Refrigerate after reconstitution." : "Keep out of reach of children."}
              </div>
            </div>
          </PmsSection>
        ))}
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => toast.success("Leaflet printed")}><Printer className="size-4" />Print Leaflet</Button>
        <Button variant="outline" onClick={() => toast.success("Information sent to patient portal")}><Send className="size-4" />Send to Portal</Button>
      </div>
    </div>
  );
}

/* ================================================================== */
/* SCREEN 15 — EXPIRY MANAGEMENT                                      */
/* ================================================================== */
function ExpiryManagement({ stock }: { stock: StockItem[] }) {
   return (
     <div className="space-y-6">
       <PmsPageHeader title="Expiry Management" subtitle="Monitor and manage medicine expiry" actions={
         <Button onClick={() => toast.success("Disposal order generated")}><Trash2 className="size-4" />Dispose Expired</Button>
       } />

       <div className="grid gap-4 sm:grid-cols-3">
         <PmsStatCard icon={Clock} label="Expired Medicines" value={stock.filter((s) => s.status === "Expired").length} tone="danger" />
         <PmsStatCard icon={AlertTriangle} label="Expiring within 90 days" value={2} tone="warning" />
         <PmsStatCard icon={Package} label="Quarantine Stock" value={3} tone="info" />
       </div>

       <PmsSection title="Expiry Alert List">
         <div className="overflow-x-auto">
           <table className="w-full min-w-[700px] text-sm">
             <thead className="bg-muted text-left text-xs uppercase tracking-wide text-text-secondary">
               <tr>
                 <th className="px-5 py-3 font-medium">Medicine</th>
                 <th className="px-5 py-3 font-medium">Batch</th>
                 <th className="px-5 py-3 font-medium">Expiry</th>
                 <th className="px-5 py-3 font-medium">Stock</th>
                 <th className="px-5 py-3 font-medium">Status</th>
                 <th className="px-5 py-3 font-medium">Action</th>
               </tr>
             </thead>
             <tbody>
               {stock.filter((s) => s.status === "Expired" || new Date(s.expiryDate).getTime() - Date.now() < 90 * 24 * 60 * 60 * 1000).map((s) => (
                <tr key={s.id} className="border-t border-border hover:bg-accent">
                  <td className="px-5 py-4"><div className="font-medium">{s.brandName} {s.strength}</div></td>
                  <td className="px-5 py-4 font-mono text-xs">{s.batchNumber}</td>
                  <td className="px-5 py-4 text-xs">{s.expiryDate}</td>
                  <td className="px-5 py-4">{s.currentStock}</td>
                  <td className="px-5 py-4"><StockStatusBadge status={s.status} /></td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => toast.success("Moved to quarantine")}>Quarantine</Button>
                      <Button size="sm" variant="ghost" onClick={() => toast.success("Disposal initiated")}>Dispose</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PmsSection>
    </div>
  );
}

/* ================================================================== */
/* SCREEN 16 — SUPPLIER MANAGEMENT                                    */
/* ================================================================== */
function SupplierManagement() {
  return (
    <div className="space-y-6">
      <PmsPageHeader title="Supplier Management" subtitle="Supplier directory and performance" actions={
        <Button onClick={() => toast.success("New supplier form opened")}><Truck className="size-4" />Add Supplier</Button>
      } />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {SUPPLIERS.map((sup) => (
          <PmsSection key={sup.id} title={sup.name}>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Rating</span>
                <span className="font-medium">{sup.rating}/5.0 ★</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><span className="text-text-secondary">Lead Time</span><p className="font-medium">{sup.leadTime}</p></div>
                <div><span className="text-text-secondary">Total Orders</span><p className="font-medium">{sup.totalOrders}</p></div>
                <div><span className="text-text-secondary">Payment Terms</span><p className="font-medium">{sup.paymentTerms}</p></div>
                <div><span className="text-text-secondary">Last Order</span><p className="font-medium">{sup.lastOrder}</p></div>
              </div>
              <div><span className="text-text-secondary">Contact</span><p className="font-medium">{sup.contact}</p></div>
              <div><span className="text-text-secondary">Email</span><p className="font-medium">{sup.email}</p></div>
            </div>
          </PmsSection>
        ))}
      </div>
    </div>
  );
}

/* ================================================================== */
/* SCREEN 17 — PHARMACY ANALYTICS                                     */
/* ================================================================== */
function PharmacyAnalytics() {
  const topMeds = [
    { name: "Paracetamol 650mg", dispensed: 245, revenue: 857 },
    { name: "Amoxicillin 500mg", dispensed: 180, revenue: 2160 },
    { name: "Pantoprazole 40mg", dispensed: 165, revenue: 1188 },
    { name: "Metformin 500mg", dispensed: 142, revenue: 795 },
    { name: "Insulin Glargine", dispensed: 28, revenue: 39760 },
  ];

  return (
    <div className="space-y-6">
      <PmsPageHeader title="Pharmacy Analytics" subtitle="Performance metrics and insights" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <PmsStatCard icon={Pill} label="Total Prescriptions" value="842" trend={8} tone="brand" />
        <PmsStatCard icon={CreditCard} label="Revenue (July)" value="₹12.4L" trend={12} tone="success" />
        <PmsStatCard icon={Package} label="Inventory Value" value="₹8.2L" tone="info" />
        <PmsStatCard icon={Clock} label="Avg Dispensing Time" value="12 min" trend={-15} tone="success" />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <PmsSection title="Top Dispensed Medicines">
          <div className="space-y-3">
            {topMeds.map((m, i) => (
              <div key={m.name} className="flex items-center gap-4 px-5 py-3">
                <span className="text-lg font-bold text-text-secondary">{i + 1}</span>
                <div className="flex-1">
                  <div className="font-medium">{m.name}</div>
                  <div className="text-xs text-text-secondary">{m.dispensed} units dispensed</div>
                </div>
                <div className="text-right font-medium">₹{m.revenue.toLocaleString("en-IN")}</div>
              </div>
            ))}
          </div>
        </PmsSection>

        <PmsSection title="Monthly Prescription Volume">
          <div className="p-5">
            <div className="flex h-48 items-end gap-3 border-b border-l border-border px-3">
              {[720, 780, 850, 690, 920, 880, 842].map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full rounded-t bg-brand/70" style={{ height: `${(v / 1000) * 100}%` }} />
                  <span className="text-[10px] text-text-secondary">{["Jan","Feb","Mar","Apr","May","Jun","Jul"][i]}</span>
                </div>
              ))}
            </div>
          </div>
        </PmsSection>
      </div>
    </div>
  );
}

/* ================================================================== */
/* SCREEN 18 — WORKFLOW COMPLETE                                      */
/* ================================================================== */
function WorkflowComplete({ go }: { go: (r: PmsRoute) => void }) {
  return (
    <div className="space-y-6">
      <PmsPageHeader title="Workflow Complete" subtitle="All pharmacy steps completed" />

      <div className="rounded-xl border border-success/30 bg-success/5 p-8 text-center">
        <CheckCircle2 className="mx-auto size-16 text-success" />
        <h2 className="mt-4 text-2xl font-bold text-success">Pharmacy Workflow Complete</h2>
        <p className="mt-2 text-text-secondary">Rajesh Kumar · RX-2026-0722-001 · All medications dispensed, billed, and counselled</p>
      </div>

      <PmsSection title="Dispensing Summary">
        <div className="space-y-3">
          {[
            { step: "Prescription Received", time: "08:30 AM", user: "Dr. Arjun Mehta" },
            { step: "Clinical Verification", time: "08:35 AM", user: "Priya Kulkarni" },
            { step: "Drug Interaction Check", time: "08:36 AM", user: "System" },
            { step: "Allergy Check", time: "08:36 AM", user: "System" },
            { step: "Stock Verified", time: "08:40 AM", user: "System" },
            { step: "Barcode Dispensing", time: "09:00 AM", user: "Rahul Deshmukh" },
            { step: "Billing Complete", time: "09:10 AM", user: "System" },
            { step: "Insurance Claim", time: "09:12 AM", user: "System" },
            { step: "Patient Counselling", time: "09:15 AM", user: "Priya Kulkarni" },
            { step: "Medications Delivered", time: "09:20 AM", user: "Rahul Deshmukh" },
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
      </PmsSection>

      <div className="flex justify-center gap-3">
        <Button onClick={() => go("dashboard")}><ArrowLeft className="size-4" />Return to Dashboard</Button>
        <Button variant="outline" onClick={() => toast.success("Workflow report generated")}><FileText className="size-4" />Generate Report</Button>
      </div>
    </div>
  );
}
