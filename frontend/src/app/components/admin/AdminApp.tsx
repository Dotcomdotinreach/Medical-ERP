import { useState } from "react";
import {
  LayoutDashboard, Activity, Bed, AlertTriangle, Bell, Scissors, Heart, Users, Calendar,
  Wallet, Package, Wrench, Shield, Bug, AlertCircle, Star, FileText, Settings, CheckCircle2,
  ChevronRight, Search, Download, Filter, TrendingUp, TrendingDown, Clock, MapPin,
  Eye, RefreshCw, ArrowUpRight, ArrowDownRight, BarChart3, LineChart,
  Stethoscope, Thermometer, Brain, HeartPulse, Microscope, Monitor, Pill, Building2,
  Siren, Truck, Zap, Target, BarChart, PieChart as PieChartIcon, CalendarDays,
  UserCheck, UserX, ClipboardList, Award, ShieldCheck, Crosshair,
} from "lucide-react";
import { toast } from "sonner";
import { Shell, type NavItem, type Workspace } from "../his/Shell";
import {
  ExecutiveKPICard, Section, PageHeader, Badge, ProgressBar, TrendIndicator,
  DepartmentStatusDot, OccupancyGauge, MiniBarChart, AlertBanner, FilterBar, StatRow,
  AlertSeverityBadge, IncidentSeverityBadge, ComplianceBadge,
} from "./adminUi";
import {
  HOSPITAL_CENSUS, DEPARTMENT_KPIS, BED_STATUS, OT_STATUS, STAFF_RECORDS,
  FINANCIAL_KPIS, QUALITY_METRICS, INFECTION_DATA, INCIDENTS, ALERTS, REPORTS,
  formatINR, formatCompact,
} from "./data";

type AdminRoute =
  | "executive-dashboard" | "operations-dashboard" | "bed-management"
  | "emergency-operations" | "ot-overview" | "icu-operations"
  | "staff-management" | "shift-scheduling" | "finance-dashboard"
  | "inventory-overview" | "biomedical-assets" | "quality-accreditation"
  | "infection-control" | "incident-management" | "patient-experience"
  | "reports-analytics" | "alerts-notifications" | "complete";

const NAV: NavItem[] = [
  { id: "executive-dashboard", label: "Executive Dashboard", icon: LayoutDashboard },
  { id: "operations-dashboard", label: "Operations", icon: Activity },
  { id: "bed-management", label: "Bed Management", icon: Bed, badge: "91%" },
  { id: "emergency-operations", label: "Emergency Ops", icon: Siren, badge: "3", tone: "danger" },
  { id: "ot-overview", label: "OT Overview", icon: Scissors },
  { id: "icu-operations", label: "ICU Operations", icon: HeartPulse },
  { id: "staff-management", label: "Staff Management", icon: Users },
  { id: "shift-scheduling", label: "Shift Scheduling", icon: Calendar },
];

const NAV_SECONDARY: NavItem[] = [
  { id: "finance-dashboard", label: "Finance", icon: Wallet },
  { id: "inventory-overview", label: "Inventory", icon: Package, badge: "2", tone: "warning" },
  { id: "biomedical-assets", label: "Biomedical Assets", icon: Wrench },
  { id: "quality-accreditation", label: "Quality & NABH", icon: Shield },
  { id: "infection-control", label: "Infection Control", icon: Bug },
  { id: "incident-management", label: "Incidents", icon: AlertCircle, badge: "1", tone: "danger" },
  { id: "patient-experience", label: "Patient Experience", icon: Star },
  { id: "reports-analytics", label: "Reports & Analytics", icon: BarChart3 },
];

const CRUMBS: Record<AdminRoute, string[]> = {
  "executive-dashboard": ["Admin", "Executive Dashboard"],
  "operations-dashboard": ["Admin", "Operations Dashboard"],
  "bed-management": ["Admin", "Bed Management"],
  "emergency-operations": ["Admin", "Emergency Operations"],
  "ot-overview": ["Admin", "OT Overview"],
  "icu-operations": ["Admin", "ICU Operations"],
  "staff-management": ["Admin", "Staff Management"],
  "shift-scheduling": ["Admin", "Shift Scheduling"],
  "finance-dashboard": ["Admin", "Finance Dashboard"],
  "inventory-overview": ["Admin", "Inventory Overview"],
  "biomedical-assets": ["Admin", "Biomedical Assets"],
  "quality-accreditation": ["Admin", "Quality & Accreditation"],
  "infection-control": ["Admin", "Infection Control"],
  "incident-management": ["Admin", "Incident Management"],
  "patient-experience": ["Admin", "Patient Experience"],
  "reports-analytics": ["Admin", "Reports & Analytics"],
  "alerts-notifications": ["Admin", "Alerts & Notifications"],
  complete: ["Admin", "Workflow Complete"],
};

export function AdminApp({ roleName, onSignOut, onSwitchWorkspace, onOpenSettings }: {
  roleName: string; onSignOut: () => void; onSwitchWorkspace: (w: Workspace) => void; onOpenSettings?: (page: string) => void;
}) {
  const [route, setRoute] = useState<AdminRoute>("executive-dashboard");
  const navTo = (r: AdminRoute) => setRoute(r);
  const census = HOSPITAL_CENSUS;
  const activeAlerts = ALERTS.filter(a => a.status === "Active");

  function renderScreen() {
    switch (route) {
      case "executive-dashboard": return <ExecutiveDashboard />;
      case "operations-dashboard": return <OperationsDashboard />;
      case "bed-management": return <BedManagement />;
      case "emergency-operations": return <EmergencyOperations />;
      case "ot-overview": return <OTOverview />;
      case "icu-operations": return <ICUOperations />;
      case "staff-management": return <StaffManagement />;
      case "shift-scheduling": return <ShiftScheduling />;
      case "finance-dashboard": return <FinanceDashboard />;
      case "inventory-overview": return <InventoryOverview />;
      case "biomedical-assets": return <BiomedicalAssets />;
      case "quality-accreditation": return <QualityAccreditation />;
      case "infection-control": return <InfectionControl />;
      case "incident-management": return <IncidentManagement />;
      case "patient-experience": return <PatientExperience />;
      case "reports-analytics": return <ReportsAnalytics />;
      case "alerts-notifications": return <AlertsNotifications />;
      case "complete": return <WorkflowComplete />;
      default: return <ExecutiveDashboard />;
    }
  }

  /* ========================= 1. Executive Dashboard ========================= */
  function ExecutiveDashboard() {
    const monthlyRev = FINANCIAL_KPIS.find(k => k.metric === "Monthly Revenue");
    return (
      <div className="space-y-6">
        <PageHeader title="Executive Dashboard" subtitle={`${census.date} — Meridian Multi-Speciality Hospital, Pune`} actions={
          <div className="flex gap-2">
            <button onClick={() => navTo("reports-analytics")} className="rounded-lg border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-medium text-[#111827] hover:bg-[#F3F4F6]"><Download className="mr-1.5 inline size-4" />Export</button>
            <button onClick={() => toast.info("Report generated")} className="rounded-lg bg-[#0052CC] px-4 py-2 text-sm font-medium text-white hover:bg-[#0043A8]"><FileText className="mr-1.5 inline size-4" />Generate Report</button>
          </div>
        } />

        {/* Critical Alerts */}
        {activeAlerts.filter(a => a.severity === "Critical").length > 0 && (
          <div className="space-y-2">
            {activeAlerts.filter(a => a.severity === "Critical").map(alert => (
              <AlertBanner key={alert.id} severity={alert.severity} title={alert.title} message={alert.message}
                onAction={() => navTo("alerts-notifications")} />
            ))}
          </div>
        )}

        {/* Top KPIs */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <ExecutiveKPICard icon={Users} label="OPD Today" value={census.opdVisits} trend={5.2} tone="brand" drillDown={() => navTo("operations-dashboard")} />
          <ExecutiveKPICard icon={Bed} label="IPD Occupancy" value={`${census.bedOccupancy}%`} target="85%" tone={census.bedOccupancy > 90 ? "danger" : "success"} drillDown={() => navTo("bed-management")} />
          <ExecutiveKPICard icon={Siren} label="Emergency Cases" value={census.emergencyCases} trend={8.5} tone={census.emergencyCases > 120 ? "warning" : "info"} drillDown={() => navTo("emergency-operations")} />
          <ExecutiveKPICard icon={Scissors} label="OT Utilization" value={`${Math.round((census.otInUse / census.otRooms) * 100)}%`} target="80%" tone="success" drillDown={() => navTo("ot-overview")} />
        </div>

        {/* Revenue & Finance */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <ExecutiveKPICard icon={Wallet} label="Today's Revenue" value={formatINR(18500000)} trend={8.2} tone="success" drillDown={() => navTo("finance-dashboard")} />
          <ExecutiveKPICard icon={TrendingUp} label="Monthly Revenue" value={formatINR(monthlyRev?.value ?? 485000000)} target={formatINR(monthlyRev?.target ?? 550000000)} trend={monthlyRev?.trend ?? 12.5} tone="brand" drillDown={() => navTo("finance-dashboard")} />
          <ExecutiveKPICard icon={HeartPulse} label="ICU Occupancy" value={`${Math.round((census.icuOccupied / census.icuBeds) * 100)}%`} target="80%" tone="warning" drillDown={() => navTo("icu-operations")} />
          <ExecutiveKPICard icon={Star} label="Patient Satisfaction" value="4.7" suffix="/5" trend={2.1} tone="success" drillDown={() => navTo("patient-experience")} />
        </div>

        {/* Department Performance & Alerts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Section title="Department Performance" className="lg:col-span-2" action={<button className="text-sm font-medium text-[#0052CC]">View All</button>}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-[#F3F4F6] text-left text-xs text-[#6B7280]">
                  <th className="pb-3 pr-4">Department</th><th className="pb-3 pr-4">OPD</th><th className="pb-3 pr-4">IPD</th><th className="pb-3 pr-4">Occupancy</th><th className="pb-3 pr-4">Revenue</th><th className="pb-3 pr-4">Satisfaction</th><th className="pb-3">Status</th>
                </tr></thead>
                <tbody>
                  {DEPARTMENT_KPIS.slice(0, 8).map(dept => (
                    <tr key={dept.id} className="border-b border-[#F3F4F6]/50 hover:bg-[#F9FAFB] transition">
                      <td className="py-3 pr-4 font-medium text-[#111827]"><DepartmentStatusDot status={dept.status} /> <span className="ml-2">{dept.name}</span></td>
                      <td className="py-3 pr-4 text-[#6B7280]">{dept.opdVisits}</td>
                      <td className="py-3 pr-4 text-[#6B7280]">{dept.ipdPatients}</td>
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <ProgressBar value={dept.bedOccupancy} color={dept.bedOccupancy > 90 ? "#DC2626" : dept.bedOccupancy > 80 ? "#d97706" : "#059669"} height={6} />
                          <span className="text-xs text-[#6B7280]">{dept.bedOccupancy}%</span>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-[#111827] font-medium">{formatINR(dept.revenue)}</td>
                      <td className="py-3 pr-4"><span className="text-[#d97706]">★</span> {dept.satisfaction}</td>
                      <td className="py-3"><Badge tone={dept.status === "Normal" ? "success" : dept.status === "Busy" ? "warning" : dept.status === "Critical" ? "danger" : "danger"}>{dept.status}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <div className="space-y-6">
            <Section title="Hospital Census">
              <div className="space-y-1">
                <StatRow label="OPD Visits" value={census.opdVisits} trend={5.2} />
                <StatRow label="IPD Admissions" value={census.ipdAdmissions} trend={3.1} />
                <StatRow label="Discharges" value={census.ipdDischarges} />
                <StatRow label="Surgeries" value={census.surgeries} />
                <StatRow label="Births" value={census.births} />
                <StatRow label="Deaths" value={census.deaths} />
                <StatRow label="Average LOS" value={`${census.averageLOS} days`} target="3.5" />
              </div>
            </Section>

            <Section title="Recent Alerts" action={<button onClick={() => navTo("alerts-notifications")} className="text-sm font-medium text-[#0052CC]">View All</button>}>
              <div className="space-y-2">
                {ALERTS.slice(0, 4).map(alert => (
                  <div key={alert.id} className="flex items-start gap-2 rounded-lg p-2 hover:bg-[#F9FAFB]">
                    <AlertSeverityBadge severity={alert.severity} />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-[#111827] truncate">{alert.title}</div>
                      <div className="text-xs text-[#6B7280]">{alert.timestamp.split(" ")[1]}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          </div>
        </div>

        {/* Revenue Trend */}
        <Section title="Revenue Trend (Last 7 Days)">
          <MiniBarChart data={[
            { label: "Mon", value: 16500000 }, { label: "Tue", value: 17200000 }, { label: "Wed", value: 18100000 },
            { label: "Thu", value: 17800000 }, { label: "Fri", value: 19200000 }, { label: "Sat", value: 15800000 }, { label: "Sun", value: 18500000 },
          ]} height={80} color="#0052CC" />
        </Section>
      </div>
    );
  }

  /* ========================= 2. Operations Dashboard ========================= */
  function OperationsDashboard() {
    return (
      <div className="space-y-6">
        <PageHeader title="Operations Dashboard" subtitle="Real-time hospital operations monitoring" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          <ExecutiveKPICard icon={Users} label="OPD Queue" value={42} tone="info" />
          <ExecutiveKPICard icon={Bed} label="Admission Queue" value={8} tone="warning" />
          <ExecutiveKPICard icon={CheckCircle2} label="Discharge Queue" value={12} tone="success" />
          <ExecutiveKPICard icon={Clock} label="Avg Wait Time" value="34m" tone="info" />
          <ExecutiveKPICard icon={Activity} label="Active Transfers" value={3} tone="brand" />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Section title="Patient Flow">
            <MiniBarChart data={[
              { label: "6AM", value: 15 }, { label: "8AM", value: 85 }, { label: "10AM", value: 142 },
              { label: "12PM", value: 98 }, { label: "2PM", value: 165 }, { label: "4PM", value: 120 },
              { label: "6PM", value: 68 }, { label: "8PM", value: 45 },
            ]} height={100} color="#0052CC" />
          </Section>
          <Section title="Department Bottlenecks">
            <div className="space-y-3">
              {DEPARTMENT_KPIS.filter(d => d.status !== "Normal").map(dept => (
                <div key={dept.id} className="flex items-center justify-between rounded-lg bg-[#F9FAFB] p-3">
                  <div className="flex items-center gap-2"><DepartmentStatusDot status={dept.status} /><span className="text-sm font-medium text-[#111827]">{dept.name}</span></div>
                  <Badge tone={dept.status === "Overloaded" ? "danger" : dept.status === "Critical" ? "danger" : "warning"}>{dept.alerts} alerts</Badge>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </div>
    );
  }

  /* ========================= 3. Bed Management ========================= */
  function BedManagement() {
    const totalBeds = BED_STATUS.reduce((a, b) => a + b.totalBeds, 0);
    const totalOccupied = BED_STATUS.reduce((a, b) => a + b.occupied, 0);
    const totalAvailable = BED_STATUS.reduce((a, b) => a + b.available, 0);
    return (
      <div className="space-y-6">
        <PageHeader title="Bed Management Overview" subtitle="Live bed occupancy across all wards" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <ExecutiveKPICard icon={Bed} label="Total Beds" value={totalBeds} tone="brand" />
          <ExecutiveKPICard icon={Bed} label="Occupied" value={totalOccupied} tone="danger" trend={2.1} />
          <ExecutiveKPICard icon={Bed} label="Available" value={totalAvailable} tone="success" />
          <ExecutiveKPICard icon={Bed} label="Occupancy" value={`${Math.round((totalOccupied / totalBeds) * 100)}%`} tone="warning" />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Section title="Occupancy by Ward" className="lg:col-span-2">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-[#F3F4F6] text-left text-xs text-[#6B7280]">
                  <th className="pb-3 pr-4">Ward</th><th className="pb-3 pr-4 text-right">Total</th><th className="pb-3 pr-4 text-right">Occupied</th><th className="pb-3 pr-4 text-right">Available</th><th className="pb-3 pr-4 text-right">Reserved</th><th className="pb-3 pr-4 text-right">Cleaning</th><th className="pb-3">Occupancy</th>
                </tr></thead>
                <tbody>
                  {BED_STATUS.map(ward => (
                    <tr key={ward.ward} className="border-b border-[#F3F4F6]/50 hover:bg-[#F9FAFB]">
                      <td className="py-3 pr-4 font-medium text-[#111827]">{ward.ward}</td>
                      <td className="py-3 pr-4 text-right text-[#6B7280]">{ward.totalBeds}</td>
                      <td className="py-3 pr-4 text-right font-medium text-[#111827]">{ward.occupied}</td>
                      <td className="py-3 pr-4 text-right text-[#059669]">{ward.available}</td>
                      <td className="py-3 pr-4 text-right text-[#0052CC]">{ward.reserved}</td>
                      <td className="py-3 pr-4 text-right text-[#d97706]">{ward.cleaning}</td>
                      <td className="py-3 w-32">
                        <ProgressBar value={ward.occupied} max={ward.totalBeds} color={ward.occupied / ward.totalBeds > 0.9 ? "#DC2626" : "#059669"} height={6} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
          <Section title="Ward Occupancy">
            <div className="flex flex-wrap justify-center gap-4">
              {BED_STATUS.slice(0, 8).map(ward => (
                <OccupancyGauge key={ward.ward} value={Math.round((ward.occupied / ward.totalBeds) * 100)} label={ward.ward.replace(" ", "\n")} size={70} />
              ))}
            </div>
          </Section>
        </div>
      </div>
    );
  }

  /* ========================= 4. Emergency Operations ========================= */
  function EmergencyOperations() {
    return (
      <div className="space-y-6">
        <PageHeader title="Emergency Operations" subtitle="Real-time emergency department monitoring" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          <ExecutiveKPICard icon={Siren} label="Patients in ED" value={22} tone="danger" />
          <ExecutiveKPICard icon={Clock} label="Avg Wait" value="45m" tone="warning" trend={12} />
          <ExecutiveKPICard icon={Truck} label="Ambulances Active" value={4} tone="brand" />
          <ExecutiveKPICard icon={HeartPulse} label="Code Blue Today" value={2} tone="danger" />
          <ExecutiveKPICard icon={Bed} label="Available ED Beds" value={3} tone="warning" />
        </div>
        <Section title="Emergency Queue">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-[#F3F4F6] text-left text-xs text-[#6B7280]">
                <th className="pb-3 pr-4">Patient</th><th className="pb-3 pr-4">Arrival</th><th className="pb-3 pr-4">Complaint</th><th className="pb-3 pr-4">Triage</th><th className="pb-3 pr-4">Wait Time</th><th className="pb-3">Status</th>
              </tr></thead>
              <tbody>
                {[
                  { name: "Rajesh Kumar", arrival: "14:32", complaint: "RTA — multiple injuries", triage: "Code Red", wait: "8m", status: "In Treatment" },
                  { name: "Vikram Sharma", arrival: "14:15", complaint: "Chest pain — suspected STEMI", triage: "Code Red", wait: "25m", status: "Waiting" },
                  { name: "Ananya Deshmukh", arrival: "13:50", complaint: "Obstetric emergency", triage: "Code Yellow", wait: "50m", status: "Waiting" },
                  { name: "Suresh Patil", arrival: "13:20", complaint: "Fracture — right forearm", triage: "Code Green", wait: "1h 20m", status: "Waiting" },
                ].map((p, i) => (
                  <tr key={i} className="border-b border-[#F3F4F6]/50 hover:bg-[#F9FAFB]">
                    <td className="py-3 pr-4 font-medium text-[#111827]">{p.name}</td>
                    <td className="py-3 pr-4 text-[#6B7280]">{p.arrival}</td>
                    <td className="py-3 pr-4 text-[#6B7280] max-w-[200px] truncate">{p.complaint}</td>
                    <td className="py-3 pr-4"><Badge tone={p.triage === "Code Red" ? "danger" : p.triage === "Code Yellow" ? "warning" : "success"}>{p.triage}</Badge></td>
                    <td className="py-3 pr-4 text-[#6B7280]">{p.wait}</td>
                    <td className="py-3"><Badge tone={p.status === "In Treatment" ? "brand" : "warning"}>{p.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      </div>
    );
  }

  /* ========================= 5. OT Overview ========================= */
  function OTOverview() {
    return (
      <div className="space-y-6">
        <PageHeader title="Operation Theater Overview" subtitle="Real-time OT utilization and surgical schedule" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <ExecutiveKPICard icon={Scissors} label="Running Surgeries" value={OT_STATUS.filter(o => o.status === "In Use").length} tone="brand" />
          <ExecutiveKPICard icon={Bed} label="OT Available" value={OT_STATUS.filter(o => o.status === "Available").length} tone="success" />
          <ExecutiveKPICard icon={Clock} label="Avg Turnover" value="28m" trend={-5} tone="success" />
          <ExecutiveKPICard icon={Activity} label="Utilization" value={`${Math.round((OT_STATUS.filter(o => o.status === "In Use").length / OT_STATUS.length) * 100)}%`} tone="info" />
        </div>
        <Section title="OT Room Status">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {OT_STATUS.map(ot => (
              <div key={ot.roomNumber} className={`rounded-xl border p-4 transition ${ot.status === "In Use" ? "border-[#0052CC]/20 bg-[#0052CC]/5" : ot.status === "Available" ? "border-[#059669]/20 bg-[#059669]/5" : ot.status === "Cleaning" ? "border-[#d97706]/20 bg-[#d97706]/5" : "border-[#6B7280]/20 bg-[#6B7280]/5"}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-[#111827]">{ot.roomNumber}</span>
                  <Badge tone={ot.status === "In Use" ? "brand" : ot.status === "Available" ? "success" : ot.status === "Cleaning" ? "warning" : "neutral"}>{ot.status}</Badge>
                </div>
                {ot.currentSurgery && (
                  <div className="space-y-1 text-sm">
                    <div className="text-[#111827] font-medium">{ot.currentSurgery}</div>
                    <div className="text-[#6B7280]">{ot.surgeon}</div>
                    <div className="text-xs text-[#6B7280]">{ot.startTime} — {ot.estimatedEnd}</div>
                  </div>
                )}
                {ot.nextSurgery && (
                  <div className="mt-2 rounded-lg bg-white p-2 text-xs">
                    <span className="text-[#6B7280]">Next: </span>
                    <span className="font-medium text-[#111827]">{ot.nextSurgery}</span>
                    <span className="text-[#6B7280]"> at {ot.nextTime}</span>
                  </div>
                )}
                {ot.status === "Available" && <div className="text-sm text-[#059669]">Ready for next surgery</div>}
              </div>
            ))}
          </div>
        </Section>
      </div>
    );
  }

  /* ========================= 6. ICU Operations ========================= */
  function ICUOperations() {
    return (
      <div className="space-y-6">
        <PageHeader title="ICU Operations" subtitle="Critical care unit monitoring" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <ExecutiveKPICard icon={HeartPulse} label="ICU Patients" value={census.icuOccupied} tone="danger" />
          <ExecutiveKPICard icon={Bed} label="Available ICU Beds" value={census.icuBeds - census.icuOccupied} tone="success" />
          <ExecutiveKPICard icon={Activity} label="Ventilator Use" value={12} tone="warning" />
          <ExecutiveKPICard icon={AlertTriangle} label="Code Blue Today" value={2} tone="danger" />
        </div>
        <Section title="ICU Bed Status">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {BED_STATUS.filter(b => b.ward.startsWith("ICU")).map(ward => (
              <div key={ward.ward} className="rounded-xl border border-[#E5E7EB] p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-[#111827]">{ward.ward}</span>
                  <OccupancyGauge value={Math.round((ward.occupied / ward.totalBeds) * 100)} label="" size={50} />
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-[#6B7280]">Total: <span className="font-medium text-[#111827]">{ward.totalBeds}</span></div>
                  <div className="text-[#6B7280]">Occupied: <span className="font-medium text-[#DC2626]">{ward.occupied}</span></div>
                  <div className="text-[#6B7280]">Available: <span className="font-medium text-[#059669]">{ward.available}</span></div>
                  <div className="text-[#6B7280]">Reserved: <span className="font-medium text-[#0052CC]">{ward.reserved}</span></div>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>
    );
  }

  /* ========================= 7. Staff Management ========================= */
  function StaffManagement() {
    const onDuty = STAFF_RECORDS.filter(s => s.status === "On Duty").length;
    return (
      <div className="space-y-6">
        <PageHeader title="Staff Management" subtitle="Workforce overview and department allocation" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <ExecutiveKPICard icon={Users} label="Total Staff" value={STAFF_RECORDS.length} tone="brand" />
          <ExecutiveKPICard icon={UserCheck} label="On Duty" value={onDuty} tone="success" />
          <ExecutiveKPICard icon={UserX} label="On Leave" value={STAFF_RECORDS.filter(s => s.status === "On Leave").length} tone="warning" />
          <ExecutiveKPICard icon={Activity} label="Avg Workload" value={`${Math.round(STAFF_RECORDS.reduce((a, s) => a + s.workload, 0) / STAFF_RECORDS.length)}%`} tone="info" />
        </div>
        <Section title="Staff Directory">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-[#F3F4F6] text-left text-xs text-[#6B7280]">
                <th className="pb-3 pr-4">Name</th><th className="pb-3 pr-4">Role</th><th className="pb-3 pr-4">Department</th><th className="pb-3 pr-4">Shift</th><th className="pb-3 pr-4">Workload</th><th className="pb-3 pr-4">Rating</th><th className="pb-3">Status</th>
              </tr></thead>
              <tbody>
                {STAFF_RECORDS.map(staff => (
                  <tr key={staff.id} className="border-b border-[#F3F4F6]/50 hover:bg-[#F9FAFB]">
                    <td className="py-3 pr-4 font-medium text-[#111827]">{staff.name}</td>
                    <td className="py-3 pr-4 text-[#6B7280]">{staff.role}</td>
                    <td className="py-3 pr-4 text-[#6B7280]">{staff.department}</td>
                    <td className="py-3 pr-4 text-xs text-[#6B7280]">{staff.shift}</td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <ProgressBar value={staff.workload} color={staff.workload > 90 ? "#DC2626" : staff.workload > 75 ? "#d97706" : "#059669"} height={6} />
                        <span className="text-xs text-[#6B7280]">{staff.workload}%</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4"><span className="text-[#d97706]">★</span> {staff.rating}</td>
                    <td className="py-3"><Badge tone={staff.status === "On Duty" ? "success" : staff.status === "On Leave" ? "warning" : "neutral"}>{staff.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      </div>
    );
  }

  /* ========================= 8. Shift Scheduling ========================= */
  function ShiftScheduling() {
    return (
      <div className="space-y-6">
        <PageHeader title="Shift Scheduling" subtitle="Weekly roster and workforce management" actions={<button className="rounded-lg bg-[#0052CC] px-4 py-2 text-sm font-medium text-white">+ Create Shift</button>} />
        <Section title="Today's Roster">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-[#F3F4F6] text-left text-xs text-[#6B7280]">
                <th className="pb-3 pr-4">Staff</th><th className="pb-3 pr-4">Department</th><th className="pb-3 pr-4">Shift</th><th className="pb-3 pr-4">Start</th><th className="pb-3 pr-4">End</th><th className="pb-3 pr-4">Status</th><th className="pb-3">Actions</th>
              </tr></thead>
              <tbody>
                {STAFF_RECORDS.map(staff => (
                  <tr key={staff.id} className="border-b border-[#F3F4F6]/50 hover:bg-[#F9FAFB]">
                    <td className="py-3 pr-4 font-medium text-[#111827]">{staff.name}</td>
                    <td className="py-3 pr-4 text-[#6B7280]">{staff.department}</td>
                    <td className="py-3 pr-4 text-[#6B7280]">{staff.shift}</td>
                    <td className="py-3 pr-4 text-[#6B7280]">{staff.shift.includes("Morning") ? "07:00" : staff.shift.includes("Afternoon") ? "14:00" : "19:00"}</td>
                    <td className="py-3 pr-4 text-[#6B7280]">{staff.shift.includes("Morning") ? "14:00" : staff.shift.includes("Afternoon") ? "21:00" : "07:00"}</td>
                    <td className="py-3 pr-4"><Badge tone={staff.status === "On Duty" ? "success" : staff.status === "On Leave" ? "warning" : "neutral"}>{staff.status}</Badge></td>
                    <td className="py-3"><button className="text-sm text-[#0052CC]">Edit</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      </div>
    );
  }

  /* ========================= 9. Finance Dashboard ========================= */
  function FinanceDashboard() {
    return (
      <div className="space-y-6">
        <PageHeader title="Finance Dashboard" subtitle="Revenue, expenses, and financial KPIs" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {FINANCIAL_KPIS.slice(0, 4).map((kpi, i) => (
            <ExecutiveKPICard key={i} icon={Wallet} label={kpi.metric} value={formatINR(kpi.value)} target={formatINR(kpi.target)} trend={kpi.trend} tone={kpi.trend >= 0 ? "success" : "warning"} />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Section title="Revenue by Department">
            <MiniBarChart data={[
              { label: "Cardio", value: 2100000 }, { label: "Ortho", value: 1800000 }, { label: "Onco", value: 3200000 },
              { label: "Neuro", value: 1650000 }, { label: "Obs/Gyn", value: 1450000 }, { label: "Peds", value: 980000 },
            ]} height={100} color="#059669" />
          </Section>
          <Section title="Key Financial Metrics">
            <div className="space-y-1">
              {FINANCIAL_KPIS.map((kpi, i) => (
                <StatRow key={i} label={kpi.metric} value={formatINR(kpi.value)} trend={kpi.trend} target={formatINR(kpi.target)} />
              ))}
            </div>
          </Section>
        </div>
      </div>
    );
  }

  /* ========================= 10. Inventory Overview ========================= */
  function InventoryOverview() {
    return (
      <div className="space-y-6">
        <PageHeader title="Inventory Overview" subtitle="Supply chain and inventory monitoring" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <ExecutiveKPICard icon={Package} label="Total Items" value={13} tone="brand" />
          <ExecutiveKPICard icon={AlertTriangle} label="Low Stock" value={4} tone="danger" />
          <ExecutiveKPICard icon={Clock} label="Pending POs" value={3} tone="warning" />
          <ExecutiveKPICard icon={Wallet} label="Inventory Value" value={formatINR(1560000)} tone="info" />
        </div>
        <Section title="Critical Stock Items">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-[#F3F4F6] text-left text-xs text-[#6B7280]">
                <th className="pb-3 pr-4">Item</th><th className="pb-3 pr-4">Stock</th><th className="pb-3 pr-4">Min</th><th className="pb-3 pr-4">Status</th><th className="pb-3">Action</th>
              </tr></thead>
              <tbody>
                {[
                  { name: "N95 Respirator Mask", stock: 0, min: 2000, status: "Out of Stock" },
                  { name: "Surgical Gloves", stock: 4200, min: 10000, status: "Low Stock" },
                  { name: "Absorbable Sutures 3-0", stock: 180, min: 250, status: "Low Stock" },
                  { name: "Ortho Implant DHS", stock: 8, min: 10, status: "Low Stock" },
                  { name: "Contrast Media Omnipaque", stock: 42, min: 50, status: "Low Stock" },
                ].map((item, i) => (
                  <tr key={i} className="border-b border-[#F3F4F6]/50 hover:bg-[#F9FAFB]">
                    <td className="py-3 pr-4 font-medium text-[#111827]">{item.name}</td>
                    <td className="py-3 pr-4 text-[#6B7280]">{item.stock.toLocaleString("en-IN")}</td>
                    <td className="py-3 pr-4 text-[#6B7280]">{item.min.toLocaleString("en-IN")}</td>
                    <td className="py-3 pr-4"><Badge tone={item.stock === 0 ? "danger" : "warning"}>{item.status}</Badge></td>
                    <td className="py-3"><button className="text-sm text-[#0052CC]">Reorder</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      </div>
    );
  }

  /* ========================= 11. Biomedical Assets ========================= */
  function BiomedicalAssets() {
    return (
      <div className="space-y-6">
        <PageHeader title="Biomedical Assets" subtitle="Equipment health and maintenance tracking" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <ExecutiveKPICard icon={Wrench} label="Total Equipment" value={48} tone="brand" />
          <ExecutiveKPICard icon={CheckCircle2} label="Operational" value={42} tone="success" />
          <ExecutiveKPICard icon={AlertTriangle} label="Under Maintenance" value={4} tone="warning" />
          <ExecutiveKPICard icon={Clock} label="Maintenance Due" value={2} tone="danger" />
        </div>
        <Section title="Equipment Status">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-[#F3F4F6] text-left text-xs text-[#6B7280]">
                <th className="pb-3 pr-4">Equipment</th><th className="pb-3 pr-4">Location</th><th className="pb-3 pr-4">Utilization</th><th className="pb-3 pr-4">Last Service</th><th className="pb-3 pr-4">Next Service</th><th className="pb-3">Status</th>
              </tr></thead>
              <tbody>
                {[
                  { name: "CT Scanner — GE Revolution", loc: "Radiology", util: 82, last: "2026-05-20", next: "2026-08-20", status: "Operational" },
                  { name: "MRI — Siemens Magnetom Aera", loc: "Radiology", util: 68, last: "2026-07-15", next: "2026-07-25", status: "Under Maintenance" },
                  { name: "C-arm — Siemens Cios Alpha", loc: "OT", util: 75, last: "2026-06-15", next: "2026-09-15", status: "Operational" },
                  { name: "Ventilator — Hamilton G5", loc: "ICU", util: 88, last: "2026-07-01", next: "2026-08-01", status: "Operational" },
                  { name: "Patient Monitor — Philips MX800", loc: "ICU", util: 92, last: "2026-07-01", next: "2026-10-01", status: "Operational" },
                  { name: "Defibrillator — Zoll X Series", loc: "Emergency", util: 65, last: "2026-06-20", next: "2026-09-20", status: "Operational" },
                ].map((eq, i) => (
                  <tr key={i} className="border-b border-[#F3F4F6]/50 hover:bg-[#F9FAFB]">
                    <td className="py-3 pr-4 font-medium text-[#111827]">{eq.name}</td>
                    <td className="py-3 pr-4 text-[#6B7280]">{eq.loc}</td>
                    <td className="py-3 pr-4"><div className="flex items-center gap-2"><ProgressBar value={eq.util} color={eq.util > 85 ? "#d97706" : "#059669"} height={6} /><span className="text-xs text-[#6B7280]">{eq.util}%</span></div></td>
                    <td className="py-3 pr-4 text-[#6B7280]">{eq.last}</td>
                    <td className="py-3 pr-4 text-[#6B7280]">{eq.next}</td>
                    <td className="py-3"><Badge tone={eq.status === "Operational" ? "success" : "warning"}>{eq.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      </div>
    );
  }

  /* ========================= 12. Quality & Accreditation ========================= */
  function QualityAccreditation() {
    const avgScore = Math.round(QUALITY_METRICS.reduce((a, q) => a + q.score, 0) / QUALITY_METRICS.length);
    return (
      <div className="space-y-6">
        <PageHeader title="Quality & Accreditation" subtitle="NABH & JCI compliance monitoring" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <ExecutiveKPICard icon={Shield} label="Overall Score" value={`${avgScore}%`} tone={avgScore >= 95 ? "success" : "warning"} />
          <ExecutiveKPICard icon={CheckCircle2} label="Compliant" value={QUALITY_METRICS.filter(q => q.status === "Compliant").length} tone="success" />
          <ExecutiveKPICard icon={AlertTriangle} label="Partial" value={QUALITY_METRICS.filter(q => q.status === "Partial").length} tone="warning" />
          <ExecutiveKPICard icon={Award} label="NABH Status" value="Accredited" tone="success" />
        </div>
        <Section title="Quality Metrics">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-[#F3F4F6] text-left text-xs text-[#6B7280]">
                <th className="pb-3 pr-4">Metric</th><th className="pb-3 pr-4">Category</th><th className="pb-3 pr-4">Score</th><th className="pb-3 pr-4">Target</th><th className="pb-3 pr-4">Status</th><th className="pb-3 pr-4">Last Audit</th><th className="pb-3">Next Audit</th>
              </tr></thead>
              <tbody>
                {QUALITY_METRICS.map(qm => (
                  <tr key={qm.id} className="border-b border-[#F3F4F6]/50 hover:bg-[#F9FAFB]">
                    <td className="py-3 pr-4 font-medium text-[#111827]">{qm.name}</td>
                    <td className="py-3 pr-4"><Badge tone={qm.category === "NABH" ? "brand" : "info"}>{qm.category}</Badge></td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2"><ProgressBar value={qm.score} color={qm.score >= qm.target ? "#059669" : "#d97706"} height={6} /><span className="text-xs font-medium text-[#111827]">{qm.score}%</span></div>
                    </td>
                    <td className="py-3 pr-4 text-[#6B7280]">{qm.target}%</td>
                    <td className="py-3 pr-4"><ComplianceBadge status={qm.status} /></td>
                    <td className="py-3 pr-4 text-[#6B7280]">{qm.lastAudit}</td>
                    <td className="py-3 pr-4 text-[#6B7280]">{qm.nextAudit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      </div>
    );
  }

  /* ========================= 13. Infection Control ========================= */
  function InfectionControl() {
    return (
      <div className="space-y-6">
        <PageHeader title="Infection Control" subtitle="Hospital-acquired infection monitoring and prevention" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <ExecutiveKPICard icon={Bug} label="Total HAI Cases" value={INFECTION_DATA.reduce((a, d) => a + d.patients, 0)} tone="warning" />
          <ExecutiveKPICard icon={Shield} label="Hand Hygiene" value={`${Math.round(INFECTION_DATA.reduce((a, d) => a + d.handHygieneCompliance, 0) / INFECTION_DATA.length)}%`} target="95%" tone="warning" />
          <ExecutiveKPICard icon={Bed} label="Isolation Patients" value={INFECTION_DATA.reduce((a, d) => a + d.isolationPatients, 0)} tone="info" />
          <ExecutiveKPICard icon={TrendingDown} label="Trend" value="Improving" tone="success" />
        </div>
        <Section title="Infection Surveillance">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-[#F3F4F6] text-left text-xs text-[#6B7280]">
                <th className="pb-3 pr-4">Infection Type</th><th className="pb-3 pr-4">Department</th><th className="pb-3 pr-4">Patients</th><th className="pb-3 pr-4">Rate</th><th className="pb-3 pr-4">Target</th><th className="pb-3">Trend</th>
              </tr></thead>
              <tbody>
                {INFECTION_DATA.map(inf => (
                  <tr key={inf.id} className="border-b border-[#F3F4F6]/50 hover:bg-[#F9FAFB]">
                    <td className="py-3 pr-4 font-medium text-[#111827]">{inf.type}</td>
                    <td className="py-3 pr-4 text-[#6B7280]">{inf.department}</td>
                    <td className="py-3 pr-4 text-[#111827]">{inf.patients}</td>
                    <td className="py-3 pr-4"><span className={inf.rate > inf.target ? "text-[#DC2626] font-medium" : "text-[#059669] font-medium"}>{inf.rate}‰</span></td>
                    <td className="py-3 pr-4 text-[#6B7280]">{inf.target}‰</td>
                    <td className="py-3"><TrendIndicator value={inf.trend} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      </div>
    );
  }

  /* ========================= 14. Incident Management ========================= */
  function IncidentManagement() {
    return (
      <div className="space-y-6">
        <PageHeader title="Incident Management" subtitle="Patient safety and operational incident tracking" actions={<button className="rounded-lg bg-[#0052CC] px-4 py-2 text-sm font-medium text-white">+ Report Incident</button>} />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <ExecutiveKPICard icon={AlertCircle} label="Open Incidents" value={INCIDENTS.filter(i => i.status === "Open").length} tone="danger" />
          <ExecutiveKPICard icon={Activity} label="Investigating" value={INCIDENTS.filter(i => i.status === "Investigating").length} tone="warning" />
          <ExecutiveKPICard icon={CheckCircle2} label="Resolved" value={INCIDENTS.filter(i => ["Resolved", "Closed"].includes(i.status)).length} tone="success" />
          <ExecutiveKPICard icon={AlertTriangle} label="Sentinel Events" value={INCIDENTS.filter(i => i.severity === "Sentinel").length} tone="danger" />
        </div>
        <Section title="Incident Log">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-[#F3F4F6] text-left text-xs text-[#6B7280]">
                <th className="pb-3 pr-4">Incident #</th><th className="pb-3 pr-4">Type</th><th className="pb-3 pr-4">Severity</th><th className="pb-3 pr-4">Department</th><th className="pb-3 pr-4">Reported</th><th className="pb-3 pr-4">Reporter</th><th className="pb-3">Status</th>
              </tr></thead>
              <tbody>
                {INCIDENTS.map(inc => (
                  <tr key={inc.id} className="border-b border-[#F3F4F6]/50 hover:bg-[#F9FAFB]">
                    <td className="py-3 pr-4 font-mono text-xs font-medium text-[#0052CC]">{inc.incidentNumber}</td>
                    <td className="py-3 pr-4 text-[#111827]">{inc.type}</td>
                    <td className="py-3 pr-4"><IncidentSeverityBadge severity={inc.severity} /></td>
                    <td className="py-3 pr-4 text-[#6B7280]">{inc.department}</td>
                    <td className="py-3 pr-4 text-[#6B7280]">{inc.reportedDate}</td>
                    <td className="py-3 pr-4 text-[#6B7280]">{inc.reportedBy}</td>
                    <td className="py-3"><Badge tone={inc.status === "Open" ? "danger" : inc.status === "Investigating" ? "warning" : "success"}>{inc.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      </div>
    );
  }

  /* ========================= 15. Patient Experience ========================= */
  function PatientExperience() {
    return (
      <div className="space-y-6">
        <PageHeader title="Patient Experience" subtitle="Satisfaction, feedback, and NPS tracking" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <ExecutiveKPICard icon={Star} label="Overall Satisfaction" value="4.7" suffix="/5" trend={2.1} tone="success" />
          <ExecutiveKPICard icon={TrendingUp} label="NPS Score" value={72} tone="success" />
          <ExecutiveKPICard icon={CheckCircle2} label="Complaints Resolved" value="94%" tone="success" />
          <ExecutiveKPICard icon={Clock} label="Avg Response Time" value="2.3h" trend={-15} tone="success" />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Section title="Department Satisfaction">
            <div className="space-y-3">
              {DEPARTMENT_KPIS.filter(d => d.type === "Clinical").slice(0, 6).map(dept => (
                <div key={dept.id}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#111827]">{dept.name}</span>
                    <span className="font-medium text-[#111827]">★ {dept.satisfaction}</span>
                  </div>
                  <ProgressBar value={dept.satisfaction} max={5} color={dept.satisfaction >= 4.5 ? "#059669" : "#d97706"} height={6} />
                </div>
              ))}
            </div>
          </Section>
          <Section title="Recent Feedback">
            <div className="space-y-3">
              {[
                { patient: "Rajesh Kumar", rating: 5, comment: "Excellent care by Dr. Meera Joshi. Very thorough.", dept: "General Medicine" },
                { patient: "Priya Sharma", rating: 4, comment: "Good experience overall. Wait time could be shorter.", dept: "Cardiology" },
                { patient: "Amit Deshmukh", rating: 5, comment: "Dr. Kulkarni was very professional and caring.", dept: "Orthopaedics" },
              ].map((fb, i) => (
                <div key={i} className="rounded-lg bg-[#F9FAFB] p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[#111827]">{fb.patient}</span>
                    <span className="text-[#d97706]">{"★".repeat(fb.rating)}</span>
                  </div>
                  <p className="mt-1 text-sm text-[#6B7280]">{fb.comment}</p>
                  <span className="text-xs text-[#9CA3AF]">{fb.dept}</span>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </div>
    );
  }

  /* ========================= 16. Reports & Analytics ========================= */
  function ReportsAnalytics() {
    return (
      <div className="space-y-6">
        <PageHeader title="Reports & Analytics" subtitle="Generate and schedule operational reports" />
        <Section title="Available Reports">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-[#F3F4F6] text-left text-xs text-[#6B7280]">
                <th className="pb-3 pr-4">Report Name</th><th className="pb-3 pr-4">Category</th><th className="pb-3 pr-4">Frequency</th><th className="pb-3 pr-4">Last Generated</th><th className="pb-3 pr-4">Next Scheduled</th><th className="pb-3 pr-4">Format</th><th className="pb-3">Actions</th>
              </tr></thead>
              <tbody>
                {REPORTS.map(rpt => (
                  <tr key={rpt.id} className="border-b border-[#F3F4F6]/50 hover:bg-[#F9FAFB]">
                    <td className="py-3 pr-4 font-medium text-[#111827]">{rpt.name}</td>
                    <td className="py-3 pr-4"><Badge tone="info">{rpt.category}</Badge></td>
                    <td className="py-3 pr-4 text-[#6B7280]">{rpt.frequency}</td>
                    <td className="py-3 pr-4 text-[#6B7280]">{rpt.lastGenerated}</td>
                    <td className="py-3 pr-4 text-[#6B7280]">{rpt.nextScheduled}</td>
                    <td className="py-3 pr-4">{rpt.format.map(f => <Badge key={f} tone="neutral">{f}</Badge>)}</td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <button onClick={() => toast.success(`Generating ${rpt.name}...`)} className="text-sm text-[#0052CC]">Generate</button>
                        <button className="text-sm text-[#6B7280]">Schedule</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      </div>
    );
  }

  /* ========================= 17. Alerts & Notifications ========================= */
  function AlertsNotifications() {
    const [alerts, setAlerts] = useState(ALERTS);
    const acknowledge = (id: string) => {
      setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: "Acknowledged" as const, acknowledgedBy: "Admin" } : a));
      toast.success("Alert acknowledged");
    };
    return (
      <div className="space-y-6">
        <PageHeader title="Alerts & Notifications" subtitle="Operational alerts and system notifications" actions={<button onClick={() => { setAlerts(prev => prev.map(a => ({ ...a, status: "Acknowledged" as const }))); toast.success("All alerts acknowledged"); }} className="rounded-lg border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-medium">Acknowledge All</button>} />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <ExecutiveKPICard icon={AlertTriangle} label="Critical" value={alerts.filter(a => a.severity === "Critical").length} tone="danger" />
          <ExecutiveKPICard icon={AlertTriangle} label="High" value={alerts.filter(a => a.severity === "High").length} tone="warning" />
          <ExecutiveKPICard icon={Bell} label="Medium" value={alerts.filter(a => a.severity === "Medium").length} tone="info" />
          <ExecutiveKPICard icon={CheckCircle2} label="Acknowledged" value={alerts.filter(a => a.status === "Acknowledged").length} tone="success" />
        </div>
        <Section title="Active Alerts">
          <div className="space-y-3">
            {alerts.map(alert => (
              <div key={alert.id} className={`rounded-xl border p-4 transition ${alert.status === "Acknowledged" ? "border-[#E5E7EB] opacity-60" : alert.severity === "Critical" ? "border-[#DC2626]/30 bg-[#DC2626]/5" : alert.severity === "High" ? "border-[#d97706]/30 bg-[#d97706]/5" : "border-[#E5E7EB]"}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <AlertSeverityBadge severity={alert.severity} />
                    <div>
                      <div className="text-sm font-semibold text-[#111827]">{alert.title}</div>
                      <p className="mt-0.5 text-sm text-[#6B7280]">{alert.message}</p>
                      <div className="mt-1 flex items-center gap-3 text-xs text-[#9CA3AF]">
                        <span>{alert.timestamp}</span>
                        {alert.department && <span>{alert.department}</span>}
                      </div>
                    </div>
                  </div>
                  {alert.status === "Active" && (
                    <button onClick={() => acknowledge(alert.id)} className="rounded-lg bg-[#0052CC] px-3 py-1.5 text-xs font-medium text-white">Acknowledge</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>
    );
  }

  /* ========================= 18. Workflow Complete ========================= */
  function WorkflowComplete() {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-6 grid size-20 place-items-center rounded-full bg-[#059669]/10">
          <CheckCircle2 className="size-10 text-[#059669]" />
        </div>
        <h2 className="text-2xl font-bold text-[#111827]">Executive Review Complete</h2>
        <p className="mt-2 max-w-md text-[#6B7280]">
          All operational dashboards have been reviewed. Executive reports generated and alerts acknowledged.
        </p>
        <div className="mt-6 flex gap-3">
          <button onClick={() => navTo("executive-dashboard")} className="rounded-lg bg-[#0052CC] px-6 py-3 text-sm font-semibold text-white">Return to Dashboard</button>
          <button onClick={() => toast.success("Executive summary exported")} className="rounded-lg border border-[#E5E7EB] px-6 py-3 text-sm font-medium text-[#111827]">Export Summary</button>
        </div>
      </div>
    );
  }

  return (
    <Shell
      nav={NAV}
      navSecondary={NAV_SECONDARY}
      sectionLabel="Hospital Administration"
      activeId={route}
      onNavigate={(id) => navTo(id as AdminRoute)}
      breadcrumb={CRUMBS[route]}
      roleName={roleName}
      onSignOut={onSignOut}
      workspace="admin"
      onSwitchWorkspace={onSwitchWorkspace}
      onOpenSettings={onOpenSettings}
      searchPlaceholder="Search operations..."
    >
      {renderScreen()}
    </Shell>
  );
}
