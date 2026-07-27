import { useState, useEffect } from "react";
import {
  Activity, ArrowLeft, ArrowRight, BarChart3, CheckCircle2, ChevronRight,
  ClipboardList, CreditCard, FileText, ListChecks, Printer, RotateCcw,
  Search, ShieldAlert, Users, Wallet, Banknote, Building2, FileCheck, Zap,
} from "lucide-react";
import { toast } from "sonner";
import { Shell, type NavItem, type Workspace } from "../his/Shell";
import { StatusBadge } from "../his/ui";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  PaymentStatusBadge, InvoiceStatusBadge, ClaimStatusBadge, ClearanceStatusBadge,
  BillingStatCard, BillingSection, BillingPageHeader, InvoiceCard, AmountDisplay,
} from "./billingUi";
import {
  INVOICES, PAYMENTS, INSURANCE_POLICIES, PRE_AUTH_REQUESTS,
  CORPORATE_ACCOUNTS, TPA_RECORDS, ADVANCE_RECORDS, REFUND_RECORDS,
  CHARGE_CAPTURES, AUDIT_LOGS, formatINR,
  type Invoice, type InsurancePolicy,
} from "./data";
import { billingApi } from "../../services/billing";

type BillingRoute =
  | "dashboard" | "patient-search" | "financial-summary" | "cost-estimate"
  | "advance-payment" | "insurance-verification" | "pre-auth"
  | "auto-charge" | "billing-review" | "invoice-generation"
  | "payment-collection" | "refund-management" | "corporate-billing"
  | "tpa-management" | "discharge-clearance" | "revenue-analytics"
  | "audit-compliance" | "complete";

const NAV: NavItem[] = [
  { id: "dashboard", label: "Billing Dashboard", icon: Activity },
  { id: "patient-search", label: "Patient Search", icon: Search },
  { id: "financial-summary", label: "Financial Summary", icon: Wallet },
  { id: "cost-estimate", label: "Cost Estimate", icon: ClipboardList },
  { id: "advance-payment", label: "Advance Payment", icon: Banknote, badge: "2" },
  { id: "insurance-verification", label: "Insurance Verify", icon: ShieldAlert },
  { id: "pre-auth", label: "Pre-Authorization", icon: FileCheck, badge: "1", tone: "warning" },
  { id: "auto-charge", label: "Auto Charge", icon: Zap, badge: "4", tone: "danger" },
  { id: "billing-review", label: "Billing Review", icon: ListChecks },
];
const NAV_SECONDARY: NavItem[] = [
  { id: "invoice-generation", label: "Invoice Generation", icon: FileText },
  { id: "payment-collection", label: "Payment Collection", icon: CreditCard },
  { id: "refund-management", label: "Refund Management", icon: RotateCcw },
  { id: "corporate-billing", label: "Corporate Billing", icon: Building2 },
  { id: "tpa-management", label: "TPA Management", icon: Users },
  { id: "discharge-clearance", label: "Discharge Clearance", icon: CheckCircle2 },
  { id: "revenue-analytics", label: "Revenue Analytics", icon: BarChart3 },
  { id: "audit-compliance", label: "Audit & Compliance", icon: ShieldAlert },
];

const CRUMBS: Record<BillingRoute, string[]> = {
  dashboard: ["Billing", "Dashboard"],
  "patient-search": ["Billing", "Patient Search"],
  "financial-summary": ["Billing", "Financial Summary"],
  "cost-estimate": ["Billing", "Cost Estimate"],
  "advance-payment": ["Billing", "Advance Payment"],
  "insurance-verification": ["Billing", "Insurance Verification"],
  "pre-auth": ["Billing", "Pre-Authorization"],
  "auto-charge": ["Billing", "Auto Charge Capture"],
  "billing-review": ["Billing", "Billing Review"],
  "invoice-generation": ["Billing", "Invoice Generation"],
  "payment-collection": ["Billing", "Payment Collection"],
  "refund-management": ["Billing", "Refund Management"],
  "corporate-billing": ["Billing", "Corporate Billing"],
  "tpa-management": ["Billing", "TPA Management"],
  "discharge-clearance": ["Billing", "Discharge Clearance"],
  "revenue-analytics": ["Billing", "Revenue Analytics"],
  "audit-compliance": ["Billing", "Audit & Compliance"],
  complete: ["Billing", "Workflow Complete"],
};

export function BillingApp({ roleName, onSignOut, onSwitchWorkspace, onOpenSettings }: {
  roleName: string; onSignOut: () => void; onSwitchWorkspace: (w: Workspace) => void; onOpenSettings?: (page: string) => void;
}) {
  const [route, setRoute] = useState<BillingRoute>("dashboard");
  const [liveInvoices, setLiveInvoices] = useState(INVOICES);
  const [livePayments, setLivePayments] = useState(PAYMENTS);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice>(INVOICES[0]);
  const navTo = (r: BillingRoute) => setRoute(r);

  useEffect(() => {
    billingApi.listInvoices().then(r => {
      if (r.data?.length) {
        const mapped = r.data.map((inv: any) => ({
          id: inv._id,
          invoiceNumber: inv.invoiceNumber || `INV-${inv._id.slice(-6).toUpperCase()}`,
          patientName: inv.patient ? `${inv.patient.firstName} ${inv.patient.lastName}` : "",
          uhid: inv.patient?.uhid || "",
          admissionId: inv.admission || "",
          date: inv.createdAt || "",
          dueDate: "",
          department: "General",
          lineItems: (inv.items || []).map((item: any, idx: number) => ({
            id: `LI-${inv._id}-${idx}`,
            description: item.description || "",
            category: item.category || "",
            hsnSac: "9993",
            quantity: item.quantity || 1,
            unitPrice: item.unitPrice || 0,
            total: item.total || 0,
            gstRate: 0,
            gstAmount: 0,
          })),
          subtotal: inv.subtotal || 0,
          discountAmount: inv.discount || 0,
          taxableAmount: (inv.subtotal || 0) - (inv.discount || 0),
          cgst: 0,
          sgst: 0,
          igst: 0,
          totalGST: inv.tax || 0,
          grandTotal: inv.total || 0,
          status: inv.status === "paid" ? "Generated" : "Generated",
          paymentStatus: inv.status === "paid" ? "Paid" : inv.status === "partial" ? "Partial" : "Pending",
          insuranceCovered: 0,
          patientPayable: inv.total || 0,
          billingExecutive: "",
        }));
        setLiveInvoices(mapped);
        setSelectedInvoice(mapped[0]);
      }
    }).catch(() => {});
  }, []);

  const totalRevenue = liveInvoices.reduce((a, inv) => a + inv.grandTotal, 0);
  const totalPending = liveInvoices.filter(i => i.paymentStatus !== "Paid").reduce((a, inv) => a + inv.patientPayable, 0);
  const insuranceClaims = liveInvoices.reduce((a, inv) => a + inv.insuranceCovered, 0);

  function renderScreen() {
    switch (route) {
      case "dashboard": return <DashboardScreen />;
      case "patient-search": return <PatientSearchScreen />;
      case "financial-summary": return <FinancialSummaryScreen />;
      case "cost-estimate": return <CostEstimateScreen />;
      case "advance-payment": return <AdvancePaymentScreen />;
      case "insurance-verification": return <InsuranceVerificationScreen />;
      case "pre-auth": return <PreAuthScreen />;
      case "auto-charge": return <AutoChargeScreen />;
      case "billing-review": return <BillingReviewScreen />;
      case "invoice-generation": return <InvoiceGenerationScreen />;
      case "payment-collection": return <PaymentCollectionScreen />;
      case "refund-management": return <RefundManagementScreen />;
      case "corporate-billing": return <CorporateBillingScreen />;
      case "tpa-management": return <TPAManagementScreen />;
      case "discharge-clearance": return <DischargeClearanceScreen />;
      case "revenue-analytics": return <RevenueAnalyticsScreen />;
      case "audit-compliance": return <AuditComplianceScreen />;
      case "complete": return <WorkflowCompleteScreen />;
      default: return <DashboardScreen />;
    }
  }

  function DashboardScreen() {
    return (
      <div className="space-y-6">
        <BillingPageHeader title="Billing Dashboard" subtitle="Revenue cycle overview — 23 July 2026" actions={
          <Button onClick={() => navTo("patient-search")} className="bg-primary text-white"><Search className="mr-2 size-4" />Search Patient</Button>
        } />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <BillingStatCard icon={Banknote} label="Today's Revenue" value={formatINR(891832)} trend={18} tone="success" />
          <BillingStatCard icon={FileText} label="Pending Bills" value={liveInvoices.filter(i => i.paymentStatus !== "Paid").length} tone="warning" hint={formatINR(totalPending) + " outstanding"} />
          <BillingStatCard icon={ShieldAlert} label="Insurance Claims" value={formatINR(insuranceClaims)} tone="info" />
          <BillingStatCard icon={Wallet} label="Total Revenue" value={formatINR(totalRevenue)} trend={12} tone="brand" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <BillingStatCard icon={CreditCard} label="Cash Collection" value={formatINR(150000)} tone="success" />
          <BillingStatCard icon={RotateCcw} label="Refund Requests" value={REFUND_RECORDS.length} tone="warning" hint={formatINR(REFUND_RECORDS.reduce((a, r) => a + r.amount, 0))} />
          <BillingStatCard icon={Building2} label="Corporate Pending" value={formatINR(CORPORATE_ACCOUNTS.reduce((a, c) => a + c.pendingAmount, 0))} tone="info" />
          <BillingStatCard icon={Users} label="TPA Settlements" value={formatINR(TPA_RECORDS.reduce((a, t) => a + t.settledAmount, 0))} tone="success" />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <BillingSection title="Recent Invoices" className="lg:col-span-2" action={<Button variant="ghost" size="sm" onClick={() => navTo("billing-review")}>View All <ChevronRight className="ml-1 size-4" /></Button>}>
            <div className="space-y-3">{liveInvoices.map(inv => <InvoiceCard key={inv.id} invoice={inv} onClick={() => { setSelectedInvoice(inv); navTo("invoice-generation"); }} />)}</div>
          </BillingSection>
          <div className="space-y-6">
            <BillingSection title="Revenue by Department">
              <div className="space-y-3">
                {[{ dept: "Cardiac Surgery", amount: 847320 }, { dept: "Orthopaedics", amount: 567480 }, { dept: "General Surgery", amount: 124352 }, { dept: "Critical Care", amount: 170040 }].map(d => (
                  <div key={d.dept} className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">{d.dept}</span>
                    <span className="text-sm font-bold text-text-primary">{formatINR(d.amount)}</span>
                  </div>
                ))}
              </div>
            </BillingSection>
            <BillingSection title="Recent Activity">
              {AUDIT_LOGS.slice(0, 4).map(log => (
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
            </BillingSection>
          </div>
        </div>
      </div>
    );
  }

  function PatientSearchScreen() {
    return (
      <div className="space-y-6">
        <BillingPageHeader title="Patient Billing Search" subtitle="Find patient by UHID, name, phone, or invoice" />
        <Input placeholder="Search by UHID, name, phone, admission ID, or invoice…" icon={<Search className="size-4" />} className="max-w-2xl" />
        <BillingSection title="Recent Patients">
          <div className="space-y-3">
            {liveInvoices.map(inv => (
              <button key={inv.id} onClick={() => { setSelectedInvoice(inv); navTo("financial-summary"); }} className="flex w-full items-center justify-between rounded-lg border border-border p-3 text-left transition-colors hover:border-primary">
                <div>
                  <span className="font-medium text-text-primary">{inv.patientName}</span>
                  <span className="ml-2 text-xs text-text-secondary">{inv.uhid}</span>
                  <div className="text-xs text-text-secondary">{inv.department} · {inv.date}</div>
                </div>
                <div className="flex items-center gap-2">
                  <InvoiceStatusBadge status={inv.status} />
                  <span className="text-sm font-bold text-text-primary">{formatINR(inv.grandTotal)}</span>
                </div>
              </button>
            ))}
          </div>
        </BillingSection>
      </div>
    );
  }

  function FinancialSummaryScreen() {
    const inv = selectedInvoice;
    const policy = INSURANCE_POLICIES.find(p => p.uhid === inv.uhid);
    return (
      <div className="space-y-6">
        <BillingPageHeader title="Patient Financial Summary" subtitle={`${inv.patientName} — ${inv.uhid}`} actions={<Button variant="outline" onClick={() => navTo("patient-search")}><ArrowLeft className="mr-2 size-4" />Back</Button>} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <AmountDisplay label="Total Bill" amount={inv.grandTotal} />
          <AmountDisplay label="Insurance" amount={inv.insuranceCovered} tone="info" />
          <AmountDisplay label="Paid" amount={inv.grandTotal - inv.patientPayable} tone="success" />
          <AmountDisplay label="Outstanding" amount={inv.patientPayable} tone={inv.patientPayable > 0 ? "danger" : "success"} />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <BillingSection title="Invoice Details">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-text-secondary">Invoice</span><span className="text-primary font-medium">{inv.invoiceNumber}</span></div>
              <div className="flex justify-between"><span className="text-text-secondary">Date</span><span className="text-text-primary">{inv.date}</span></div>
              <div className="flex justify-between"><span className="text-text-secondary">Due</span><span className="text-text-primary">{inv.dueDate}</span></div>
              <div className="flex justify-between"><span className="text-text-secondary">Department</span><span className="text-text-primary">{inv.department}</span></div>
              <div className="flex justify-between"><span className="text-text-secondary">Status</span><InvoiceStatusBadge status={inv.status} /></div>
              <div className="flex justify-between"><span className="text-text-secondary">Payment</span><PaymentStatusBadge status={inv.paymentStatus} /></div>
            </div>
          </BillingSection>
          {policy && (
            <BillingSection title="Insurance Details">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-text-secondary">Insurer</span><span className="text-text-primary">{policy.insuranceCompany}</span></div>
                <div className="flex justify-between"><span className="text-text-secondary">Policy</span><span className="text-text-primary">{policy.policyNumber}</span></div>
                <div className="flex justify-between"><span className="text-text-secondary">Type</span><span className="text-text-primary">{policy.policyType}</span></div>
                <div className="flex justify-between"><span className="text-text-secondary">Coverage</span><span className="text-text-primary">{formatINR(policy.coverageAmount)}</span></div>
                <div className="flex justify-between"><span className="text-text-secondary">Remaining</span><span className="text-success font-medium">{formatINR(policy.remainingAmount)}</span></div>
                <div className="flex justify-between"><span className="text-text-secondary">Cashless</span><StatusBadge tone={policy.cashlessEligible ? "success" : "danger"}>{policy.cashlessEligible ? "Eligible" : "Not Eligible"}</StatusBadge></div>
                <div className="flex justify-between"><span className="text-text-secondary">TPA</span><span className="text-text-primary">{policy.tpaName}</span></div>
              </div>
            </BillingSection>
          )}
        </div>
        <BillingSection title="Charge Line Items">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border text-left">
                <th className="pb-3 font-medium text-text-secondary">Category</th>
                <th className="pb-3 font-medium text-text-secondary">Description</th>
                <th className="pb-3 font-medium text-text-secondary">HSN/SAC</th>
                <th className="pb-3 font-medium text-text-secondary text-right">Qty</th>
                <th className="pb-3 font-medium text-text-secondary text-right">Rate</th>
                <th className="pb-3 font-medium text-text-secondary text-right">Amount</th>
                <th className="pb-3 font-medium text-text-secondary text-right">GST</th>
              </tr></thead>
              <tbody>
                {inv.lineItems.map(li => (
                  <tr key={li.id} className="border-b border-border">
                    <td className="py-3 text-text-primary">{li.category}</td>
                    <td className="py-3 text-text-secondary">{li.description}</td>
                    <td className="py-3 text-text-secondary">{li.hsnSac}</td>
                    <td className="py-3 text-right text-text-secondary">{li.quantity}</td>
                    <td className="py-3 text-right text-text-primary">{formatINR(li.unitPrice)}</td>
                    <td className="py-3 text-right font-medium text-text-primary">{formatINR(li.total)}</td>
                    <td className="py-3 text-right text-text-secondary">{li.gstAmount > 0 ? formatINR(li.gstAmount) : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 space-y-1 text-sm text-right">
            <div>Subtotal: <span className="font-medium text-text-primary">{formatINR(inv.subtotal)}</span></div>
            <div>Discount: <span className="font-medium text-danger">-{formatINR(inv.discountAmount)}</span></div>
            <div>CGST: <span className="font-medium text-text-primary">{formatINR(inv.cgst)}</span></div>
            <div>SGST: <span className="font-medium text-text-primary">{formatINR(inv.sgst)}</span></div>
            <div className="text-lg font-bold">Grand Total: <span className="text-primary">{formatINR(inv.grandTotal)}</span></div>
          </div>
        </BillingSection>
        <BillingSection title="Payment History">
          {livePayments.filter(p => p.invoiceId === inv.id).map(p => (
            <div key={p.id} className="flex items-center justify-between border-b border-border py-3 last:border-b-0">
              <div>
                <span className="text-sm font-medium text-text-primary">{p.mode} — {p.reference}</span>
                <div className="text-xs text-text-secondary">{p.receiptNumber} · {p.date} {p.time}</div>
              </div>
              <span className="text-sm font-bold text-success">{formatINR(p.amount)}</span>
            </div>
          ))}
          {livePayments.filter(p => p.invoiceId === inv.id).length === 0 && <p className="text-sm text-text-secondary">No payments recorded</p>}
        </BillingSection>
      </div>
    );
  }

  function CostEstimateScreen() {
    return (
      <div className="space-y-6">
        <BillingPageHeader title="Cost Estimate" subtitle="Generate pre-treatment cost estimate" actions={<Button variant="outline"><Printer className="mr-2 size-4" />Export PDF</Button>} />
        <BillingSection title="Treatment Estimate">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2"><label className="text-sm font-medium text-text-secondary">Patient Name</label><Input placeholder="Enter patient name" /></div>
            <div className="space-y-2"><label className="text-sm font-medium text-text-secondary">UHID</label><Input placeholder="MRD-2026-XXXXXX" /></div>
            <div className="space-y-2"><label className="text-sm font-medium text-text-secondary">Planned Procedure</label><Input placeholder="Enter procedure" /></div>
            <div className="space-y-2"><label className="text-sm font-medium text-text-secondary">Estimated Stay (days)</label><Input type="number" placeholder="0" /></div>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border text-left">
                <th className="pb-3 font-medium text-text-secondary">Category</th>
                <th className="pb-3 font-medium text-text-secondary">Description</th>
                <th className="pb-3 font-medium text-text-secondary text-right">Amount</th>
              </tr></thead>
              <tbody>
                {[
                  { cat: "Room", desc: "ICU — 3 days", amt: 45000 },
                  { cat: "Doctor", desc: "Consultant fees", amt: 15000 },
                  { cat: "OT", desc: "Procedure charges", amt: 250000 },
                  { cat: "Anaesthesia", desc: "General anaesthesia", amt: 45000 },
                  { cat: "Laboratory", desc: "Pre-op & post-op tests", amt: 12000 },
                  { cat: "Radiology", desc: "X-ray, CT, Echo", amt: 15000 },
                  { cat: "Pharmacy", desc: "Medications", amt: 20000 },
                  { cat: "Consumables", desc: "Sutures, dressings", amt: 8000 },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-border">
                    <td className="py-3 text-text-primary">{row.cat}</td>
                    <td className="py-3 text-text-secondary">{row.desc}</td>
                    <td className="py-3 text-right font-medium text-text-primary">{formatINR(row.amt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 space-y-1 text-sm text-right">
            <div>Subtotal: <span className="font-medium">{formatINR(410000)}</span></div>
            <div>GST (18% on applicable): <span className="font-medium">{formatINR(15300)}</span></div>
            <div>Estimated Total: <span className="text-lg font-bold text-primary">{formatINR(425300)}</span></div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={() => toast.success("Estimate generated")}>Generate Estimate</Button>
            <Button variant="outline">Cancel</Button>
          </div>
        </BillingSection>
      </div>
    );
  }

  function AdvancePaymentScreen() {
    return (
      <div className="space-y-6">
        <BillingPageHeader title="Advance Payment" subtitle="Collect advance deposits before treatment" actions={<Button onClick={() => toast.success("Advance recorded")} className="bg-primary text-white"><Banknote className="mr-2 size-4" />New Advance</Button>} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <AmountDisplay label="Total Advances" amount={ADVANCE_RECORDS.reduce((a, r) => a + r.amount, 0)} tone="success" />
          <AmountDisplay label="Balance Available" amount={ADVANCE_RECORDS.reduce((a, r) => a + r.balance, 0)} tone="info" />
          <AmountDisplay label="Advance Count" amount={ADVANCE_RECORDS.length} />
        </div>
        <BillingSection title="Advance Records">
          <div className="space-y-3">
            {ADVANCE_RECORDS.map(adv => (
              <div key={adv.id} className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <span className="font-medium text-text-primary">{adv.patientName}</span>
                  <span className="ml-2 text-xs text-text-secondary">{adv.uhid}</span>
                  <div className="text-xs text-text-secondary">{adv.mode} · {adv.reference}</div>
                  <div className="text-xs text-text-secondary">Receipt: {adv.receiptNumber} · {adv.date}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-success">{formatINR(adv.amount)}</div>
                  {adv.balance > 0 && <div className="text-xs text-warning">Balance: {formatINR(adv.balance)}</div>}
                </div>
              </div>
            ))}
          </div>
        </BillingSection>
      </div>
    );
  }

  function InsuranceVerificationScreen() {
    return (
      <div className="space-y-6">
        <BillingPageHeader title="Insurance Verification" subtitle="Verify patient insurance coverage" />
        <Input placeholder="Search by UHID or policy number…" icon={<Search className="size-4" />} className="max-w-2xl" />
        <div className="space-y-4">
          {INSURANCE_POLICIES.map(p => (
            <BillingSection key={p.uhid} title={p.patientName} action={<StatusBadge tone={p.cashlessEligible ? "success" : "danger"}>{p.cashlessEligible ? "Cashless Eligible" : "Reimbursement Only"}</StatusBadge>}>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div><span className="text-xs text-text-secondary">Insurer</span><div className="text-sm font-medium text-text-primary">{p.insuranceCompany}</div></div>
                <div><span className="text-xs text-text-secondary">Policy #</span><div className="text-sm font-medium text-text-primary">{p.policyNumber}</div></div>
                <div><span className="text-xs text-text-secondary">Type</span><div className="text-sm font-medium text-text-primary">{p.policyType}</div></div>
                <div><span className="text-xs text-text-secondary">TPA</span><div className="text-sm font-medium text-text-primary">{p.tpaName}</div></div>
                <div><span className="text-xs text-text-secondary">Coverage</span><div className="text-sm font-medium text-text-primary">{formatINR(p.coverageAmount)}</div></div>
                <div><span className="text-xs text-text-secondary">Consumed</span><div className="text-sm font-medium text-warning">{formatINR(p.consumedAmount)}</div></div>
                <div><span className="text-xs text-text-secondary">Remaining</span><div className="text-sm font-medium text-success">{formatINR(p.remainingAmount)}</div></div>
                <div><span className="text-xs text-text-secondary">Valid Till</span><div className="text-sm font-medium text-text-primary">{p.validTill}</div></div>
              </div>
              <div className="mt-3 flex gap-2">
                <div className="flex items-center gap-2 text-sm"><StatusBadge tone={p.networkHospital ? "success" : "danger"}>{p.networkHospital ? "Network Hospital" : "Non-Network"}</StatusBadge></div>
                <div className="flex items-center gap-2 text-sm"><StatusBadge tone={p.preAuthRequired ? "warning" : "success"}>{p.preAuthRequired ? "Pre-Auth Required" : "No Pre-Auth"}</StatusBadge></div>
                <span className="text-sm text-text-secondary">Room: {p.roomCategory}</span>
              </div>
            </BillingSection>
          ))}
        </div>
      </div>
    );
  }

  function PreAuthScreen() {
    return (
      <div className="space-y-6">
        <BillingPageHeader title="Insurance Pre-Authorization" subtitle="Submit and track pre-authorization requests" actions={<Button onClick={() => toast.info("New pre-auth form")} className="bg-primary text-white"><FileCheck className="mr-2 size-4" />New Request</Button>} />
        <div className="space-y-4">
          {PRE_AUTH_REQUESTS.map(pa => (
            <BillingSection key={pa.id} title={`${pa.patientName} — ${pa.insuranceCompany}`} action={<ClaimStatusBadge status={pa.status === "Draft" ? "Submitted" : pa.status === "Submitted" ? "In Process" : pa.status === "Approved" ? "Approved" : "Rejected"} />}>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div><span className="text-xs text-text-secondary">Diagnosis</span><div className="text-sm font-medium text-text-primary">{pa.diagnosis}</div></div>
                <div><span className="text-xs text-text-secondary">Estimated Cost</span><div className="text-sm font-bold text-text-primary">{formatINR(pa.estimatedCost)}</div></div>
                <div><span className="text-xs text-text-secondary">Submitted</span><div className="text-sm text-text-primary">{pa.submittedAt || "—"}</div></div>
                <div><span className="text-xs text-text-secondary">Approved Amount</span><div className="text-sm font-bold text-success">{pa.approvedAmount ? formatINR(pa.approvedAmount) : "—"}</div></div>
              </div>
              <p className="mt-3 text-sm text-text-secondary">{pa.clinicalNotes}</p>
              <p className="text-sm text-text-secondary">Doctor: {pa.doctorRecommendation}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {pa.documents.map((doc, i) => <span key={i} className="rounded bg-muted px-2 py-1 text-xs text-text-secondary">{doc}</span>)}
              </div>
            </BillingSection>
          ))}
        </div>
      </div>
    );
  }

  function AutoChargeScreen() {
    return (
      <div className="space-y-6">
        <BillingPageHeader title="Auto Charge Capture" subtitle="Charges automatically captured from clinical modules" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <BillingStatCard icon={Zap} label="Auto-Captured Today" value={CHARGE_CAPTURES.filter(c => c.autoCaptured).length} tone="success" />
          <BillingStatCard icon={ListChecks} label="Pending Review" value={CHARGE_CAPTURES.filter(c => !c.reviewed).length} tone="warning" />
          <BillingStatCard icon={Banknote} label="Total Captured" value={formatINR(CHARGE_CAPTURES.reduce((a, c) => a + c.amount, 0))} tone="brand" />
        </div>
        <BillingSection title="Captured Charges">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border text-left">
                <th className="pb-3 font-medium text-text-secondary">Source</th>
                <th className="pb-3 font-medium text-text-secondary">Patient</th>
                <th className="pb-3 font-medium text-text-secondary">Item</th>
                <th className="pb-3 font-medium text-text-secondary">Amount</th>
                <th className="pb-3 font-medium text-text-secondary">Time</th>
                <th className="pb-3 font-medium text-text-secondary">Status</th>
              </tr></thead>
              <tbody>
                {CHARGE_CAPTURES.map((cc, i) => (
                  <tr key={i} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3"><StatusBadge tone={cc.source === "OT" ? "danger" : cc.source === "Pharmacy" ? "warning" : "info"}>{cc.source}</StatusBadge></td>
                    <td className="py-3 text-text-primary">{cc.patientName}</td>
                    <td className="py-3 text-text-secondary">{cc.item}</td>
                    <td className="py-3 font-medium text-text-primary">{formatINR(cc.amount)}</td>
                    <td className="py-3 text-text-secondary text-xs">{cc.capturedAt}</td>
                    <td className="py-3"><StatusBadge tone={cc.reviewed ? "success" : "warning"}>{cc.reviewed ? "Reviewed" : "Pending"}</StatusBadge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </BillingSection>
      </div>
    );
  }

  function BillingReviewScreen() {
    const inv = selectedInvoice;
    return (
      <div className="space-y-6">
        <BillingPageHeader title="Billing Review" subtitle="Review charges before final invoice" />
        <BillingSection title="Charge Summary — Rajesh Kumar">
          <div className="space-y-3">
            {inv.lineItems.map(li => (
              <div key={li.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div><span className="text-sm font-medium text-text-primary">{li.description}</span><span className="ml-2 text-xs text-text-secondary">{li.category}</span></div>
                <span className="text-sm font-bold text-text-primary">{formatINR(li.total)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2 text-sm text-right">
            <div>Subtotal: <span className="font-medium">{formatINR(inv.subtotal)}</span></div>
            <div>Discount (5%): <span className="font-medium text-danger">-{formatINR(inv.discountAmount)}</span></div>
            <div>Taxable: <span className="font-medium">{formatINR(inv.taxableAmount)}</span></div>
            <div>GST (CGST + SGST): <span className="font-medium">{formatINR(inv.totalGST)}</span></div>
            <div className="text-lg font-bold">Final Total: <span className="text-primary">{formatINR(inv.grandTotal)}</span></div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div><span className="text-xs text-text-secondary">Insurance Coverage</span><div className="text-sm font-bold text-info">{formatINR(inv.insuranceCovered)}</div></div>
            <div><span className="text-xs text-text-secondary">Patient Liability</span><div className="text-sm font-bold text-danger">{formatINR(inv.patientPayable)}</div></div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={() => { toast.success("Bill approved — generating invoice"); navTo("invoice-generation"); }}>Approve & Generate Invoice</Button>
            <Button variant="outline">Request Discount Approval</Button>
          </div>
        </BillingSection>
      </div>
    );
  }

  function InvoiceGenerationScreen() {
    const inv = selectedInvoice;
    return (
      <div className="space-y-6">
        <BillingPageHeader title="Invoice Generation" subtitle="GST-compliant invoice" actions={<div className="flex gap-2"><Button variant="outline"><Printer className="mr-2 size-4" />Print</Button><Button variant="outline"><FileText className="mr-2 size-4" />Download PDF</Button></div>} />
        <BillingSection title="GST Invoice">
          <div className="rounded-xl border-2 border-border p-6">
            <div className="flex items-start justify-between border-b border-border pb-4">
              <div>
                <div className="text-lg font-bold text-primary">MERIDIAN MULTI-SPECIALITY HOSPITAL</div>
                <div className="text-xs text-text-secondary">CIN: U85100MH2020PTC123456 · GSTIN: 27AAACM1234A1Z5</div>
                <div className="text-xs text-text-secondary">123 Healthcare Avenue, Andheri West, Mumbai 400058</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-text-primary">TAX INVOICE</div>
                <div className="text-xs text-text-secondary">{inv.invoiceNumber}</div>
                <div className="text-xs text-text-secondary">Date: {inv.date}</div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-medium text-text-secondary">Bill To:</div>
                <div className="font-medium text-text-primary">{inv.patientName}</div>
                <div className="text-text-secondary">{inv.uhid}</div>
              </div>
              <div className="text-right">
                <div className="text-text-secondary">HSN/SAC: 9993</div>
                <div className="text-text-secondary">Payment Terms: Due on Receipt</div>
              </div>
            </div>
            <table className="mt-4 w-full text-sm">
              <thead><tr className="border-b border-border text-left">
                <th className="pb-2 font-medium text-text-secondary">#</th>
                <th className="pb-2 font-medium text-text-secondary">Description</th>
                <th className="pb-2 font-medium text-text-secondary">HSN</th>
                <th className="pb-2 font-medium text-text-secondary text-right">Qty</th>
                <th className="pb-2 font-medium text-text-secondary text-right">Rate</th>
                <th className="pb-2 font-medium text-text-secondary text-right">Amount</th>
                <th className="pb-2 font-medium text-text-secondary text-right">GST</th>
              </tr></thead>
              <tbody>
                {inv.lineItems.map((li, i) => (
                  <tr key={li.id} className="border-b border-border">
                    <td className="py-2 text-text-secondary">{i + 1}</td>
                    <td className="py-2 text-text-primary">{li.description}</td>
                    <td className="py-2 text-text-secondary">{li.hsnSac}</td>
                    <td className="py-2 text-right text-text-secondary">{li.quantity}</td>
                    <td className="py-2 text-right text-text-primary">{formatINR(li.unitPrice)}</td>
                    <td className="py-2 text-right font-medium text-text-primary">{formatINR(li.total)}</td>
                      <td className="py-2 text-right text-text-secondary">{li.gstAmount > 0 ? formatINR(li.gstAmount) : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 space-y-1 text-sm text-right">
              <div>Subtotal: {formatINR(inv.subtotal)}</div>
              <div>Discount: -{formatINR(inv.discountAmount)}</div>
              <div>CGST (18%): {formatINR(inv.cgst)}</div>
              <div>SGST (18%): {formatINR(inv.sgst)}</div>
              <div className="text-lg font-bold border-t border-border pt-2">Grand Total: {formatINR(inv.grandTotal)}</div>
            </div>
            <div className="mt-4 text-xs text-text-secondary">
              Amount in words: Eight Lakh Forty-Seven Thousand Three Hundred Twenty Rupees Only
            </div>
          </div>
        </BillingSection>
      </div>
    );
  }

  function PaymentCollectionScreen() {
    return (
      <div className="space-y-6">
        <BillingPageHeader title="Payment Collection" subtitle="Record patient payments" />
        <BillingSection title="New Payment">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2"><label className="text-sm font-medium text-text-secondary">Patient</label><Input placeholder="Search patient" /></div>
            <div className="space-y-2"><label className="text-sm font-medium text-text-secondary">Invoice Number</label><Input placeholder="Invoice #" /></div>
            <div className="space-y-2"><label className="text-sm font-medium text-text-secondary">Amount (₹)</label><Input type="number" placeholder="0" /></div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">Payment Mode</label>
              <div className="flex flex-wrap gap-2">
                {["Cash", "Card", "UPI", "Net Banking", "Cheque", "Wallet"].map(m => (
                  <Button key={m} variant="outline" size="sm" onClick={() => toast.info(m + " selected")}>{m}</Button>
                ))}
              </div>
            </div>
            <div className="space-y-2"><label className="text-sm font-medium text-text-secondary">Reference / Transaction ID</label><Input placeholder="Enter reference" /></div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={() => toast.success("Payment recorded successfully")}>Collect Payment</Button>
            <Button variant="outline">Split Payment</Button>
          </div>
        </BillingSection>
        <BillingSection title="Recent Payments">
          <div className="space-y-3">
            {livePayments.map(p => (
              <div key={p.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <span className="text-sm font-medium text-text-primary">{p.patientName}</span>
                  <div className="text-xs text-text-secondary">{p.mode} · {p.reference}</div>
                  <div className="text-xs text-text-secondary">{p.receiptNumber} · {p.date}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-success">{formatINR(p.amount)}</div>
                  <StatusBadge tone={p.status === "Success" ? "success" : "danger"}>{p.status}</StatusBadge>
                </div>
              </div>
            ))}
          </div>
        </BillingSection>
      </div>
    );
  }

  function RefundManagementScreen() {
    return (
      <div className="space-y-6">
        <BillingPageHeader title="Refund Management" subtitle="Process refund requests and credit notes" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <BillingStatCard icon={RotateCcw} label="Total Refunds" value={REFUND_RECORDS.length} tone="warning" />
          <BillingStatCard icon={Banknote} label="Refund Amount" value={formatINR(REFUND_RECORDS.reduce((a, r) => a + r.amount, 0))} tone="danger" />
          <BillingStatCard icon={CheckCircle2} label="Processed" value={REFUND_RECORDS.filter(r => r.status === "Processed").length} tone="success" />
        </div>
        <BillingSection title="Refund Requests">
          <div className="space-y-3">
            {REFUND_RECORDS.map(r => (
              <div key={r.id} className="rounded-xl border border-border bg-surface p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-text-primary">{r.patientName}</span>
                      <StatusBadge tone={r.status === "Processed" ? "success" : r.status === "Approved" ? "warning" : r.status === "Rejected" ? "danger" : "info"}>{r.status}</StatusBadge>
                    </div>
                    <p className="mt-1 text-sm text-text-secondary">{r.invoiceNumber}</p>
                    <p className="text-sm text-text-secondary">Reason: {r.reason}</p>
                    <p className="text-xs text-text-secondary">Requested by: {r.requestedBy} · {r.requestedAt}</p>
                    {r.creditNoteNumber && <p className="text-xs text-primary font-medium">Credit Note: {r.creditNoteNumber}</p>}
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-danger">{formatINR(r.amount)}</div>
                    {r.status === "Requested" && <Button size="sm" onClick={() => toast.success("Refund approved")}>Approve</Button>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </BillingSection>
      </div>
    );
  }

  function CorporateBillingScreen() {
    return (
      <div className="space-y-6">
        <BillingPageHeader title="Corporate Billing" subtitle="Manage corporate accounts and credit billing" />
        <div className="space-y-4">
          {CORPORATE_ACCOUNTS.map(c => (
            <BillingSection key={c.agreementId} title={c.companyName} action={<span className="text-xs text-text-secondary">{c.agreementId}</span>}>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div><span className="text-xs text-text-secondary">Contact</span><div className="text-sm font-medium text-text-primary">{c.contactPerson}</div></div>
                <div><span className="text-xs text-text-secondary">Credit Limit</span><div className="text-sm font-bold text-text-primary">{formatINR(c.creditLimit)}</div></div>
                <div><span className="text-xs text-text-secondary">Utilized</span><div className="text-sm font-bold text-warning">{formatINR(c.utilized)}</div></div>
                <div><span className="text-xs text-text-secondary">Pending</span><div className="text-sm font-bold text-danger">{formatINR(c.pendingAmount)}</div></div>
              </div>
              <div className="mt-3 h-3 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: `${(c.utilized / c.creditLimit) * 100}%` }} />
              </div>
              <div className="mt-2 flex justify-between text-xs text-text-secondary">
                <span>Discount: {c.discountPercent}%</span>
                <span>Invoice Cycle: {c.invoiceCycle}</span>
                <span>Patients: {c.patientCount}</span>
                <span>Last Invoice: {c.lastInvoiceDate}</span>
              </div>
            </BillingSection>
          ))}
        </div>
      </div>
    );
  }

  function TPAManagementScreen() {
    return (
      <div className="space-y-6">
        <BillingPageHeader title="TPA Management" subtitle="Third-party administrator claim tracking" />
        <div className="space-y-4">
          {TPA_RECORDS.map(tpa => (
            <BillingSection key={tpa.tpaName} title={tpa.tpaName}>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div><span className="text-xs text-text-secondary">Claims Submitted</span><div className="text-lg font-bold text-text-primary">{tpa.claimsSubmitted}</div></div>
                <div><span className="text-xs text-text-secondary">Approved</span><div className="text-lg font-bold text-success">{tpa.claimsApproved}</div></div>
                <div><span className="text-xs text-text-secondary">Rejected</span><div className="text-lg font-bold text-danger">{tpa.claimsRejected}</div></div>
                <div><span className="text-xs text-text-secondary">Pending</span><div className="text-lg font-bold text-warning">{tpa.claimsPending}</div></div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                <div>Total Claim: <span className="font-bold">{formatINR(tpa.totalClaimAmount)}</span></div>
                <div>Settled: <span className="font-bold text-success">{formatINR(tpa.settledAmount)}</span></div>
                <div>Pending: <span className="font-bold text-danger">{formatINR(tpa.pendingAmount)}</span></div>
              </div>
              <div className="mt-2 text-xs text-text-secondary">
                Avg Processing: {tpa.avgProcessingDays} days · Deficiencies: {tpa.deficiencyCount}
              </div>
            </BillingSection>
          ))}
        </div>
      </div>
    );
  }

  function DischargeClearanceScreen() {
    const inv = selectedInvoice;
    return (
      <div className="space-y-6">
        <BillingPageHeader title="Discharge Financial Clearance" subtitle="Verify all dues before patient discharge" />
        <BillingSection title={`${inv.patientName} — ${inv.uhid}`}>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <AmountDisplay label="Total Bill" amount={inv.grandTotal} />
            <AmountDisplay label="Insurance" amount={inv.insuranceCovered} tone="info" />
            <AmountDisplay label="Paid" amount={inv.grandTotal - inv.patientPayable} tone="success" />
            <AmountDisplay label="Outstanding" amount={inv.patientPayable} tone={inv.patientPayable > 0 ? "danger" : "success"} />
          </div>
          <div className="mt-4 space-y-3">
            {[
              { label: "Outstanding Charges", status: inv.patientPayable === 0 ? "Cleared" : "Pending", icon: Banknote },
              { label: "Insurance Clearance", status: inv.insuranceCovered > 0 ? "Cleared" : "N/A", icon: ShieldAlert },
              { label: "Corporate Clearance", status: "N/A", icon: Building2 },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div className="flex items-center gap-3">
                  <item.icon className="size-4 text-text-secondary" />
                  <span className="text-sm font-medium text-text-primary">{item.label}</span>
                </div>
                <ClearanceStatusBadge status={item.status as "Pending" | "Cleared"} />
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={() => toast.success("Financial clearance granted — patient cleared for discharge")} disabled={inv.patientPayable > 0}>
              <CheckCircle2 className="mr-2 size-4" />Grant Discharge Clearance
            </Button>
            <Button variant="outline">Block Discharge</Button>
          </div>
        </BillingSection>
      </div>
    );
  }

  function RevenueAnalyticsScreen() {
    return (
      <div className="space-y-6">
        <BillingPageHeader title="Revenue Analytics" subtitle="Financial performance and KPIs" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <BillingStatCard icon={Banknote} label="Total Revenue" value={formatINR(totalRevenue)} trend={12} tone="success" />
          <BillingStatCard icon={CreditCard} label="Collection Rate" value="82%" trend={5} tone="success" />
          <BillingStatCard icon={ShieldAlert} label="Insurance Revenue" value={formatINR(insuranceClaims)} tone="info" />
          <BillingStatCard icon={Wallet} label="Outstanding" value={formatINR(totalPending)} tone="danger" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <BillingStatCard icon={Building2} label="Corporate Revenue" value={formatINR(CORPORATE_ACCOUNTS.reduce((a, c) => a + c.utilized, 0))} tone="brand" />
          <BillingStatCard icon={Users} label="TPA Settlements" value={formatINR(TPA_RECORDS.reduce((a, t) => a + t.settledAmount, 0))} tone="success" />
          <BillingStatCard icon={RotateCcw} label="Refunds" value={formatINR(REFUND_RECORDS.reduce((a, r) => a + r.amount, 0))} tone="warning" />
          <BillingStatCard icon={CheckCircle2} label="Clearance Rate" value="94%" tone="success" />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <BillingSection title="Revenue by Department">
            <div className="space-y-3">
              {[{ dept: "Cardiac Surgery", amount: 847320 }, { dept: "Orthopaedics", amount: 567480 }, { dept: "General Surgery", amount: 124352 }, { dept: "Critical Care", amount: 170040 }].map(d => (
                <div key={d.dept} className="flex items-center gap-3">
                  <span className="w-32 text-sm text-text-secondary">{d.dept}</span>
                  <div className="flex-1"><div className="h-3 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${(d.amount / 847320) * 100}%` }} /></div></div>
                  <span className="w-24 text-right text-sm font-bold text-text-primary">{formatINR(d.amount)}</span>
                </div>
              ))}
            </div>
          </BillingSection>
          <BillingSection title="Payment Mode Distribution">
            <div className="space-y-3">
              {[{ mode: "Insurance", count: 1, pct: 33 }, { mode: "UPI", count: 1, pct: 25 }, { mode: "Card", count: 1, pct: 22 }, { mode: "Cash", count: 1, pct: 12 }, { mode: "Cheque", count: 1, pct: 8 }].map(p => (
                <div key={p.mode} className="flex items-center gap-3">
                  <span className="w-20 text-sm text-text-secondary">{p.mode}</span>
                  <div className="flex-1"><div className="h-3 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-secondary" style={{ width: `${p.pct}%` }} /></div></div>
                  <span className="w-8 text-right text-sm font-bold text-text-primary">{p.count}</span>
                </div>
              ))}
            </div>
          </BillingSection>
        </div>
      </div>
    );
  }

  function AuditComplianceScreen() {
    return (
      <div className="space-y-6">
        <BillingPageHeader title="Audit & Compliance" subtitle="Financial audit trail and compliance logging" actions={<Button variant="outline"><Printer className="mr-2 size-4" />Export Report</Button>} />
        <BillingSection title="Financial Audit Log">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border text-left">
                <th className="pb-3 font-medium text-text-secondary">Timestamp</th>
                <th className="pb-3 font-medium text-text-secondary">User</th>
                <th className="pb-3 font-medium text-text-secondary">Action</th>
                <th className="pb-3 font-medium text-text-secondary">Detail</th>
                <th className="pb-3 font-medium text-text-secondary">Amount</th>
              </tr></thead>
              <tbody>
                {AUDIT_LOGS.map(log => (
                  <tr key={log.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 text-text-secondary text-xs">{log.timestamp}</td>
                    <td className="py-3 text-text-primary text-xs">{log.user}</td>
                    <td className="py-3 text-text-primary">{log.action}</td>
                    <td className="py-3 text-text-secondary text-xs max-w-xs truncate">{log.detail}</td>
                    <td className="py-3 font-medium text-text-primary text-xs">{log.amount ? formatINR(log.amount) : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </BillingSection>
      </div>
    );
  }

  function WorkflowCompleteScreen() {
    const inv = selectedInvoice;
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="grid size-16 place-items-center rounded-full bg-success/10"><CheckCircle2 className="size-8 text-success" /></div>
        <h2 className="mt-6 text-2xl font-bold text-text-primary">Revenue Cycle Complete</h2>
        <p className="mt-2 max-w-md text-text-secondary">All billing screens demonstrated. In production, this screen confirms payment, invoice generation, insurance settlement, and financial clearance.</p>
        <div className="mt-6 rounded-xl border border-border bg-surface p-6 text-left">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-text-secondary">Patient</span><div className="font-medium text-text-primary">{inv.patientName}</div></div>
            <div><span className="text-text-secondary">Invoice</span><div className="font-medium text-primary">{inv.invoiceNumber}</div></div>
            <div><span className="text-text-secondary">Amount</span><div className="font-medium text-text-primary">{formatINR(inv.grandTotal)}</div></div>
            <div><span className="text-text-secondary">Status</span><div className="font-medium text-success">Financially Cleared</div></div>
          </div>
        </div>
        <div className="mt-8 flex gap-2">
          <Button onClick={() => navTo("dashboard")}>Return to Dashboard</Button>
          <Button variant="outline"><Printer className="mr-2 size-4" />Generate Revenue Report</Button>
        </div>
      </div>
    );
  }

  return (
    <Shell
      nav={NAV}
      navSecondary={NAV_SECONDARY}
      sectionLabel="Billing & Revenue Cycle"
      activeId={route}
      onNavigate={(id) => navTo(id as BillingRoute)}
      breadcrumb={CRUMBS[route]}
      roleName={roleName}
      onSignOut={onSignOut}
      workspace="billing"
      onSwitchWorkspace={onSwitchWorkspace}
      onOpenSettings={onOpenSettings}
    >
      {renderScreen()}
    </Shell>
  );
}
