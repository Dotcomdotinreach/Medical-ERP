import { useState, useMemo } from "react";
import {
  LayoutDashboard, UserPlus, ClipboardList, Droplets, Beaker, TestTube,
  Package, FileText, GitMerge, CalendarCheck, ArrowRight, BedDouble,
  Activity, AlertTriangle, Trash2, ShieldCheck, BarChart3, CheckCircle2,
  ChevronRight, Download, Filter, Plus, RefreshCw, Eye, Edit3, Search,
  Printer, ScanLine, Thermometer, Clock, Heart, ThermometerSnowflake,
  AlertCircle, Info, Bell, X, Check, Shield, Stethoscope, User,
} from "lucide-react";
import { Shell, type Workspace } from "../his/Shell";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  DONORS, BLOOD_UNITS, COLLECTIONS, COMPONENT_BATCHES, LAB_TESTS,
  BLOOD_REQUESTS, CROSSMATCHES, RESERVATIONS, BLOOD_ISSUES, TRANSFUSIONS,
  ADVERSE_REACTIONS, BLOOD_DISPOSALS, TEMPERATURE_LOGS, QUALITY_CONTROLS,
  AUDIT_LOGS, BB_KPI,
  bloodGroupTone, unitStatusTone, donorStatusTone, collectionStatusTone,
  screeningTone, testResultTone, crossmatchTone, reservationStatusTone,
  issueStatusTone, transfusionStatusTone, reactionSeverityTone,
  coldChainTone, approvalTone, formatCurrency,
  type Donor, type BloodUnit, type BloodRequest, type Crossmatch,
  type Autoclave,
} from "./data";
import {
  PageHeader, Section, KPICard, StatusPill, BloodGroupBadge,
  BloodUnitStatusBadge, DonorStatusBadge, CrossmatchBadge,
  TransfusionStatusBadge, ColdChainWidget, BloodUnitCard, DonorCard,
  BloodRequestCard, TemperatureWidget, ExpiryBadge,
} from "./bloodBankUi";

type BbRoute =
  | "bb-dashboard" | "donor-registration" | "donor-screening"
  | "blood-collection" | "component-processing" | "laboratory-testing"
  | "blood-inventory" | "blood-request" | "crossmatching"
  | "blood-reservation" | "blood-issue" | "bedside-transfusion"
  | "transfusion-monitoring" | "adverse-reaction" | "blood-disposal"
  | "quality-control" | "reports-analytics" | "workflow-complete";

const NAV = [
  { id: "bb-dashboard", label: "BB Dashboard", icon: LayoutDashboard },
  { id: "donor-registration", label: "Donor Registration", icon: UserPlus },
  { id: "donor-screening", label: "Donor Screening", icon: ClipboardList },
  { id: "blood-collection", label: "Blood Collection", icon: Droplets },
  { id: "component-processing", label: "Component Processing", icon: Beaker },
  { id: "laboratory-testing", label: "Laboratory Testing", icon: TestTube },
  { id: "blood-inventory", label: "Blood Inventory", icon: Package, badge: String(BB_KPI.availableUnits) },
  { id: "blood-request", label: "Request Management", icon: FileText, badge: String(BB_KPI.pendingRequests), tone: "warning" as const },
  { id: "crossmatching", label: "Crossmatching", icon: GitMerge },
];

const NAV_SECONDARY = [
  { id: "blood-reservation", label: "Reservation", icon: CalendarCheck },
  { id: "blood-issue", label: "Blood Issue", icon: ArrowRight },
  { id: "bedside-transfusion", label: "Bedside Verification", icon: BedDouble },
  { id: "transfusion-monitoring", label: "Transfusion Monitoring", icon: Activity },
  { id: "adverse-reaction", label: "Adverse Reactions", icon: AlertTriangle, badge: String(BB_KPI.adverseReactions), tone: "danger" as const },
  { id: "blood-disposal", label: "Blood Disposal", icon: Trash2 },
  { id: "quality-control", label: "Quality Control", icon: ShieldCheck },
  { id: "reports-analytics", label: "Reports & Analytics", icon: BarChart3 },
  { id: "workflow-complete", label: "Workflow Complete", icon: CheckCircle2 },
];

export function BloodBankApp({ roleName, onSignOut, onSwitchWorkspace, onOpenSettings }: {
  roleName: string; onSignOut: () => void; onSwitchWorkspace: (w: Workspace) => void; onOpenSettings?: (page: string) => void;
}) {
  const [screen, setScreen] = useState<BbRoute>("bb-dashboard");
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<BloodUnit | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<BloodRequest | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const breadcrumb = useMemo(() => {
    const crumb = ["Blood Bank"];
    const nav = [...NAV, ...NAV_SECONDARY].find((n) => n.id === screen);
    if (nav) crumb.push(nav.label);
    if (selectedDonor && screen === "donor-registration") crumb.splice(2, 0, selectedDonor.name);
    if (selectedUnit && screen === "blood-inventory") crumb.splice(2, 0, selectedUnit.unitNumber);
    if (selectedRequest && screen === "blood-request") crumb.splice(2, 0, selectedRequest.id);
    return crumb;
  }, [screen, selectedDonor, selectedUnit, selectedRequest]);

  const filteredUnits = BLOOD_UNITS.filter((u) =>
    !searchQuery || u.unitNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.bloodGroup.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.donorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDonors = DONORS.filter((d) =>
    !searchQuery || d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.bloodGroup.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Shell
      nav={NAV}
      navSecondary={NAV_SECONDARY}
      sectionLabel="Blood Bank & Transfusion"
      activeId={screen}
      isActive={(id) => id === screen}
      onNavigate={(id) => { setScreen(id as BbRoute); setSelectedDonor(null); setSelectedUnit(null); setSelectedRequest(null); }}
      breadcrumb={breadcrumb}
      roleName={roleName}
      onSignOut={onSignOut}
      workspace="blood-bank"
      onSwitchWorkspace={onSwitchWorkspace}
      onOpenSettings={onOpenSettings}
      searchPlaceholder="Search donors, units, patients…"
    >
      {/* ── 01 Blood Bank Dashboard ─────────────────────────────────────── */}
      {screen === "bb-dashboard" && (
        <div className="space-y-6">
          <PageHeader title="Blood Bank Dashboard" subtitle="Transfusion medicine operations overview" icon={LayoutDashboard}
            actions={<>
              <Button variant="outline" size="sm"><RefreshCw className="mr-1.5 size-4" />Refresh</Button>
              <Button variant="outline" size="sm"><Download className="mr-1.5 size-4" />Export</Button>
            </>} />

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <KPICard icon={Package} label="Available Units" value={BB_KPI.availableUnits} sub={`${BB_KPI.totalUnits} total`} tone="green" />
            <KPICard icon={AlertTriangle} label="Critical Groups" value={BB_KPI.criticalBloodGroups.length} sub={BB_KPI.criticalBloodGroups.join(", ")} tone="red" />
            <KPICard icon={Droplets} label="Today's Donations" value={BB_KPI.todayDonations} tone="blue" trend="up" trendValue="+1" />
            <KPICard icon={FileText} label="Pending Requests" value={BB_KPI.pendingRequests} sub={`${BB_KPI.emergencyRequests} emergency`} tone="amber" />
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <KPICard icon={CalendarCheck} label="Reserved Units" value={BB_KPI.reservedUnits} tone="info" />
            <KPICard icon={Clock} label="Expiring Soon" value={BB_KPI.expiredUnits} sub="Within 7 days" tone="amber" />
            <KPICard icon={Trash2} label="Discarded" value={BB_KPI.discardedUnits} tone="red" />
            <KPICard icon={Activity} label="Transfusions Today" value={BB_KPI.completedTransfusions} sub={`${BB_KPI.adverseReactions} reactions`} tone="green" />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Section title="Blood Group Availability" actions={<Button variant="outline" size="sm" onClick={() => setScreen("blood-inventory")}>View Inventory</Button>}>
              <div className="grid grid-cols-4 gap-3">
                {(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const).map((g) => {
                  const units = BLOOD_UNITS.filter((u) => u.bloodGroup === g && u.status === "Available");
                  const isCritical = BB_KPI.criticalBloodGroups.includes(g);
                  return (
                    <div key={g} className={`rounded-lg border-2 p-3 text-center ${isCritical ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"}`}>
                      <BloodGroupBadge group={g} />
                      <div className="mt-2 text-2xl font-bold text-[var(--text-primary,#172B4D)]">{units.length}</div>
                      <div className="text-xs text-[var(--text-secondary,#6B778C)]">units</div>
                      {isCritical && <div className="mt-1 text-[10px] font-medium text-red-600">CRITICAL</div>}
                    </div>
                  );
                })}
              </div>
            </Section>

            <Section title="Cold Chain Status">
              <div className="space-y-3">
                {TEMPERATURE_LOGS.slice(0, 4).map((log) => (
                  <TemperatureWidget key={log.id} location={log.location} temperature={log.temperature} min={log.minTemp} max={log.maxTemp} status={log.status} />
                ))}
              </div>
            </Section>
          </div>

          <Section title="Recent Emergency Requests">
            <div className="overflow-hidden rounded-xl border border-[var(--border,#DFE1E6)]">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs text-[var(--text-secondary,#6B778C)]">
                  <tr><th className="px-4 py-3 font-medium">Patient</th><th className="px-4 py-3 font-medium">Blood Group</th><th className="px-4 py-3 font-medium">Component</th><th className="px-4 py-3 font-medium">Units</th><th className="px-4 py-3 font-medium">Department</th><th className="px-4 py-3 font-medium">Status</th></tr>
                </thead>
                <tbody className="divide-y divide-[var(--border,#DFE1E6)]">
                  {BLOOD_REQUESTS.filter((r) => r.urgency === "Emergency").map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 font-medium text-[var(--text-primary,#172B4D)]">{r.patientName}</td>
                      <td className="px-4 py-3"><BloodGroupBadge group={r.bloodGroup} size="sm" /></td>
                      <td className="px-4 py-3 text-[var(--text-secondary,#6B778C)]">{r.component}</td>
                      <td className="px-4 py-3 font-medium text-[var(--text-primary,#172B4D)]">{r.units}</td>
                      <td className="px-4 py-3 text-[var(--text-secondary,#6B778C)]">{r.department}</td>
                      <td className="px-4 py-3"><StatusPill label={r.approvalStatus} tone={r.approvalStatus === "Approved" ? "success" : "warning"} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section title="Recent Audit Log">
            <div className="overflow-hidden rounded-xl border border-[var(--border,#DFE1E6)]">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs text-[var(--text-secondary,#6B778C)]">
                  <tr><th className="px-4 py-3 font-medium">Time</th><th className="px-4 py-3 font-medium">User</th><th className="px-4 py-3 font-medium">Action</th><th className="px-4 py-3 font-medium">Details</th><th className="px-4 py-3 font-medium">Severity</th></tr>
                </thead>
                <tbody className="divide-y divide-[var(--border,#DFE1E6)]">
                  {AUDIT_LOGS.slice(0, 5).map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary,#6B778C)]">{log.timestamp}</td>
                      <td className="px-4 py-3 font-medium text-[var(--text-primary,#172B4D)]">{log.user}</td>
                      <td className="px-4 py-3 text-[var(--text-secondary,#6B778C)]">{log.action}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary,#6B778C)] max-w-xs truncate">{log.details}</td>
                      <td className="px-4 py-3"><StatusPill label={log.severity} tone={log.severity === "Critical" ? "danger" : log.severity === "Warning" ? "warning" : "info"} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        </div>
      )}

      {/* ── 02 Donor Registration ───────────────────────────────────────── */}
      {screen === "donor-registration" && !selectedDonor && (
        <div className="space-y-6">
          <PageHeader title="Donor Registration" subtitle={`${DONORS.length} donors registered`} icon={UserPlus}
            actions={<><Button variant="outline" size="sm"><Download className="mr-1.5 size-4" />Export</Button><Button size="sm"><Plus className="mr-1.5 size-4" />Register Donor</Button></>} />

          <div className="flex items-center gap-3">
            <div className="relative flex-1"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--text-secondary,#6B778C)]" /><Input className="pl-9" placeholder="Search donors by name, blood group, ID…" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div>
            <Button variant="outline" size="sm"><Filter className="mr-1.5 size-4" />Filter</Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDonors.map((d) => <DonorCard key={d.id} donor={d} onClick={() => setSelectedDonor(d)} />)}
          </div>
        </div>
      )}

      {screen === "donor-registration" && selectedDonor && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setSelectedDonor(null)}><ChevronRight className="size-4 rotate-180" />Back</Button>
            <PageHeader title={selectedDonor.name} subtitle={selectedDonor.id} icon={UserPlus} actions={<><Button variant="outline" size="sm"><Edit3 className="mr-1.5 size-4" />Edit</Button><Button variant="outline" size="sm"><Printer className="mr-1.5 size-4" />Print Donor Card</Button></>} />
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <Section title="Personal Details">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-[var(--text-secondary,#6B778C)]">Name:</span> <span className="ml-2 font-medium text-[var(--text-primary,#172B4D)]">{selectedDonor.name}</span></div>
                  <div><span className="text-[var(--text-secondary,#6B778C)]">Age:</span> <span className="ml-2 font-medium text-[var(--text-primary,#172B4D)]">{selectedDonor.age} years</span></div>
                  <div><span className="text-[var(--text-secondary,#6B778C)]">Gender:</span> <span className="ml-2 font-medium text-[var(--text-primary,#172B4D)]">{selectedDonor.gender}</span></div>
                  <div><span className="text-[var(--text-secondary,#6B778C)]">Blood Group:</span> <span className="ml-2"><BloodGroupBadge group={selectedDonor.bloodGroup} size="sm" /></span></div>
                  <div><span className="text-[var(--text-secondary,#6B778C)]">Phone:</span> <span className="ml-2 font-medium text-[var(--text-primary,#172B4D)]">{selectedDonor.phone}</span></div>
                  <div><span className="text-[var(--text-secondary,#6B778C)]">Address:</span> <span className="ml-2 font-medium text-[var(--text-primary,#172B4D)]">{selectedDonor.address}</span></div>
                  <div><span className="text-[var(--text-secondary,#6B778C)]">Aadhaar (Last 4):</span> <span className="ml-2 font-medium text-[var(--text-primary,#172B4D)]">****{selectedDonor.aadhaarLast4}</span></div>
                  <div><span className="text-[var(--text-secondary,#6B778C)]">Donation Type:</span> <span className="ml-2 font-medium text-[var(--text-primary,#172B4D)]">{selectedDonor.donationType}</span></div>
                </div>
              </Section>
              <Section title="Donation History">
                <div className="text-sm text-[var(--text-secondary,#6B778C)]">
                  Total Donations: <span className="font-bold text-[var(--text-primary,#172B4D)]">{selectedDonor.totalDonations}</span>
                  {selectedDonor.lastDonationDate && <span className="ml-4">Last Donation: <span className="font-bold text-[var(--text-primary,#172B4D)]">{selectedDonor.lastDonationDate}</span></span>}
                </div>
              </Section>
            </div>
            <div className="space-y-4">
              <Section title="Status"><div className="space-y-3">
                <div className="flex items-center justify-between"><span className="text-sm text-[var(--text-secondary,#6B778C)]">Status</span><DonorStatusBadge status={selectedDonor.status} /></div>
                <div className="flex items-center justify-between"><span className="text-sm text-[var(--text-secondary,#6B778C)]">Weight</span><span className="font-medium text-[var(--text-primary,#172B4D)]">{selectedDonor.weight} kg</span></div>
                <div className="flex items-center justify-between"><span className="text-sm text-[var(--text-secondary,#6B778C)]">Hemoglobin</span><span className="font-medium text-[var(--text-primary,#172B4D)]">{selectedDonor.hemoglobin} g/dL</span></div>
                <div className="flex items-center justify-between"><span className="text-sm text-[var(--text-secondary,#6B778C)]">Medical Clearance</span><StatusPill label={selectedDonor.medicalClearance ? "Cleared" : "Pending"} tone={selectedDonor.medicalClearance ? "success" : "warning"} /></div>
                <div className="flex items-center justify-between"><span className="text-sm text-[var(--text-secondary,#6B778C)]">Consent</span><StatusPill label={selectedDonor.consentGiven ? "Given" : "Pending"} tone={selectedDonor.consentGiven ? "success" : "warning"} /></div>
              </div></Section>
              <Section title="Quick Actions"><div className="space-y-2">
                <Button className="w-full justify-start" variant="outline"><ClipboardList className="mr-2 size-4" />Start Screening</Button>
                <Button className="w-full justify-start" variant="outline"><Droplets className="mr-2 size-4" />Schedule Collection</Button>
                <Button className="w-full justify-start" variant="outline"><Eye className="mr-2 size-4" />View Full History</Button>
              </div></Section>
            </div>
          </div>
        </div>
      )}

      {/* ── 03 Donor Screening ──────────────────────────────────────────── */}
      {screen === "donor-screening" && (
        <div className="space-y-6">
          <PageHeader title="Donor Screening" subtitle="Medical eligibility assessment" icon={ClipboardList}
            actions={<Button size="sm"><Plus className="mr-1.5 size-4" />New Screening</Button>} />

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <KPICard icon={CheckCircle2} label="Passed Today" value="3" tone="green" />
            <KPICard icon={AlertTriangle} label="Deferred" value="1" tone="red" />
            <KPICard icon={Clock} label="Pending" value="1" tone="amber" />
            <KPICard icon={User} label="Total Screened" value="5" tone="blue" />
          </div>

          <Section title="Screening Queue">
            <div className="overflow-hidden rounded-xl border border-[var(--border,#DFE1E6)]">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs text-[var(--text-secondary,#6B778C)]">
                  <tr><th className="px-4 py-3 font-medium">Donor</th><th className="px-4 py-3 font-medium">Blood Group</th><th className="px-4 py-3 font-medium">Weight</th><th className="px-4 py-3 font-medium">Hb</th><th className="px-4 py-3 font-medium">BP</th><th className="px-4 py-3 font-medium">Medical Hx</th><th className="px-4 py-3 font-medium">Result</th><th className="px-4 py-3 font-medium">Action</th></tr>
                </thead>
                <tbody className="divide-y divide-[var(--border,#DFE1E6)]">
                  {COLLECTIONS.map((c) => {
                    const donor = DONORS.find((d) => d.id === c.donorId);
                    return (
                      <tr key={c.id} className="hover:bg-gray-50/50">
                        <td className="px-4 py-3 font-medium text-[var(--text-primary,#172B4D)]">{c.donorName}</td>
                        <td className="px-4 py-3"><BloodGroupBadge group={c.bloodGroup} size="sm" /></td>
                        <td className="px-4 py-3 text-[var(--text-secondary,#6B778C)]">{c.weight} kg</td>
                        <td className="px-4 py-3"><span className={`font-medium ${c.hemoglobin < 12.5 ? "text-red-600" : "text-[var(--text-primary,#172B4D)]"}`}>{c.hemoglobin} g/dL</span></td>
                        <td className="px-4 py-3 text-[var(--text-secondary,#6B778C)]">{c.bloodPressure}</td>
                        <td className="px-4 py-3 text-[var(--text-secondary,#6B778C)]">{donor?.medicalClearance ? "Cleared" : "Pending"}</td>
                        <td className="px-4 py-3"><StatusPill label={c.status === "Deferral" ? "Deferred" : c.status === "Completed" ? "Pass" : "Pending"} tone={c.status === "Deferral" ? "danger" : c.status === "Completed" ? "success" : "warning"} /></td>
                        <td className="px-4 py-3"><Button size="sm" variant="outline"><Eye className="mr-1 size-3" />Review</Button></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Section>
        </div>
      )}

      {/* ── 04 Blood Collection ─────────────────────────────────────────── */}
      {screen === "blood-collection" && (
        <div className="space-y-6">
          <PageHeader title="Blood Collection" subtitle="Phlebotomy and collection tracking" icon={Droplets}
            actions={<Button size="sm"><Plus className="mr-1.5 size-4" />New Collection</Button>} />

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <KPICard icon={Droplets} label="Today's Collections" value="2" tone="blue" />
            <KPICard icon={CheckCircle2} label="Completed" value="2" tone="green" />
            <KPICard icon={AlertTriangle} label="Deferrals" value="1" tone="red" />
            <KPICard icon={Clock} label="Scheduled" value="1" tone="amber" />
          </div>

          <Section title="Collection Records">
            <div className="overflow-hidden rounded-xl border border-[var(--border,#DFE1E6)]">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs text-[var(--text-secondary,#6B778C)]">
                  <tr><th className="px-4 py-3 font-medium">ID</th><th className="px-4 py-3 font-medium">Donor</th><th className="px-4 py-3 font-medium">Blood Group</th><th className="px-4 py-3 font-medium">Volume</th><th className="px-4 py-3 font-medium">Bag</th><th className="px-4 py-3 font-medium">Phlebotomist</th><th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3 font-medium">Reaction</th></tr>
                </thead>
                <tbody className="divide-y divide-[var(--border,#DFE1E6)]">
                  {COLLECTIONS.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 font-medium text-[#0052CC]">{c.id}</td>
                      <td className="px-4 py-3 font-medium text-[var(--text-primary,#172B4D)]">{c.donorName}</td>
                      <td className="px-4 py-3"><BloodGroupBadge group={c.bloodGroup} size="sm" /></td>
                      <td className="px-4 py-3 text-[var(--text-secondary,#6B778C)]">{c.volume > 0 ? `${c.volume}mL` : "—"}</td>
                      <td className="px-4 py-3 text-[var(--text-secondary,#6B778C)]">{c.bagId || "—"}</td>
                      <td className="px-4 py-3 text-[var(--text-secondary,#6B778C)]">{c.phlebotomist}</td>
                      <td className="px-4 py-3"><StatusPill label={c.status} tone={collectionStatusTone(c.status)} /></td>
                      <td className="px-4 py-3">{c.adverseReaction ? <AlertTriangle className="size-4 text-red-500" /> : <CheckCircle2 className="size-4 text-emerald-500" />}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        </div>
      )}

      {/* ── 05 Component Processing ─────────────────────────────────────── */}
      {screen === "component-processing" && (
        <div className="space-y-6">
          <PageHeader title="Component Processing" subtitle="Whole blood separation and component production" icon={Beaker}
            actions={<Button size="sm"><Plus className="mr-1.5 size-4" />New Batch</Button>} />

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <KPICard icon={Beaker} label="Batches Today" value="2" tone="blue" />
            <KPICard icon={CheckCircle2} label="Components Produced" value="5" tone="green" />
            <KPICard icon={AlertTriangle} label="Failed" value="0" tone="green" />
            <KPICard icon={Clock} label="In Processing" value="1" tone="amber" />
          </div>

          <Section title="Processing Batches">
            <div className="space-y-4">
              {COMPONENT_BATCHES.map((batch) => (
                <div key={batch.id} className="rounded-xl border border-[var(--border,#DFE1E6)] bg-white p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold text-[var(--text-primary,#172B4D)]">{batch.id} — Batch {batch.batchNumber}</div>
                      <div className="text-sm text-[var(--text-secondary,#6B778C)]">Collection: {batch.collectionId} · Blood Group: <BloodGroupBadge group={batch.bloodGroup} size="sm" /></div>
                    </div>
                    <div className="text-xs text-[var(--text-secondary,#6B778C)]">{batch.processedDate}</div>
                  </div>
                  <div className="mt-4 overflow-hidden rounded-lg border border-gray-200">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50 text-xs text-[var(--text-secondary,#6B778C)]">
                        <tr><th className="px-3 py-2 font-medium">Component</th><th className="px-3 py-2 font-medium">Volume</th><th className="px-3 py-2 font-medium">Unit ID</th><th className="px-3 py-2 font-medium">Status</th></tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {batch.components.map((comp, i) => (
                          <tr key={i} className="hover:bg-gray-50/50">
                            <td className="px-3 py-2 font-medium text-[var(--text-primary,#172B4D)]">{comp.type}</td>
                            <td className="px-3 py-2 text-[var(--text-secondary,#6B778C)]">{comp.volume}mL</td>
                            <td className="px-3 py-2 font-medium text-[#0052CC]">{comp.unitId}</td>
                            <td className="px-3 py-2"><StatusPill label={comp.status} tone={comp.status === "Available" ? "success" : comp.status === "Quarantined" ? "danger" : "info"} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-2 text-xs text-[var(--text-secondary,#6B778C)]">Processed by: {batch.processedBy} · Centrifuge: {batch.centrifugeId}</div>
                </div>
              ))}
            </div>
          </Section>
        </div>
      )}

      {/* ── 06 Laboratory Testing ────────────────────────────────────────── */}
      {screen === "laboratory-testing" && (
        <div className="space-y-6">
          <PageHeader title="Laboratory Testing" subtitle="Blood grouping, serology, and NAT testing" icon={TestTube}
            actions={<Button size="sm"><Plus className="mr-1.5 size-4" />New Test</Button>} />

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <KPICard icon={TestTube} label="Tests Today" value={LAB_TESTS.length} tone="blue" />
            <KPICard icon={CheckCircle2} label="Released" value={LAB_TESTS.filter((t) => t.released).length} tone="green" />
            <KPICard icon={AlertTriangle} label="Reactive" value={LAB_TESTS.filter((t) => t.hiv === "Reactive" || t.hbsag === "Reactive" || t.hcv === "Reactive").length} tone="red" />
            <KPICard icon={Clock} label="Pending" value={LAB_TESTS.filter((t) => !t.released && !t.quarantineReason).length} tone="amber" />
          </div>

          <Section title="Test Results">
            <div className="overflow-hidden rounded-xl border border-[var(--border,#DFE1E6)]">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs text-[var(--text-secondary,#6B778C)]">
                  <tr><th className="px-4 py-3 font-medium">Lab ID</th><th className="px-4 py-3 font-medium">Unit</th><th className="px-4 py-3 font-medium">ABO</th><th className="px-4 py-3 font-medium">Rh</th><th className="px-4 py-3 font-medium">Anti-Screen</th><th className="px-4 py-3 font-medium">HIV</th><th className="px-4 py-3 font-medium">HBsAg</th><th className="px-4 py-3 font-medium">HCV</th><th className="px-4 py-3 font-medium">NAT</th><th className="px-4 py-3 font-medium">Released</th></tr>
                </thead>
                <tbody className="divide-y divide-[var(--border,#DFE1E6)]">
                  {LAB_TESTS.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 font-medium text-[#0052CC]">{t.id}</td>
                      <td className="px-4 py-3 text-[var(--text-secondary,#6B778C)]">{t.unitId}</td>
                      <td className="px-4 py-3"><StatusPill label={t.aboGrouping} tone={screeningTone(t.aboGrouping)} /></td>
                      <td className="px-4 py-3"><StatusPill label={t.rhTyping} tone={screeningTone(t.rhTyping)} /></td>
                      <td className="px-4 py-3"><StatusPill label={t.antibodyScreen} tone={screeningTone(t.antibodyScreen)} /></td>
                      <td className="px-4 py-3"><StatusPill label={t.hiv} tone={testResultTone(t.hiv)} /></td>
                      <td className="px-4 py-3"><StatusPill label={t.hbsag} tone={testResultTone(t.hbsag)} /></td>
                      <td className="px-4 py-3"><StatusPill label={t.hcv} tone={testResultTone(t.hcv)} /></td>
                      <td className="px-4 py-3"><StatusPill label={t.nat} tone={testResultTone(t.nat)} /></td>
                      <td className="px-4 py-3">{t.released ? <CheckCircle2 className="size-4 text-emerald-500" /> : t.quarantineReason ? <AlertTriangle className="size-4 text-red-500" /> : <Clock className="size-4 text-amber-500" />}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        </div>
      )}

      {/* ── 07 Blood Inventory ──────────────────────────────────────────── */}
      {screen === "blood-inventory" && !selectedUnit && (
        <div className="space-y-6">
          <PageHeader title="Blood Inventory" subtitle={`${BLOOD_UNITS.length} units tracked`} icon={Package}
            actions={<><Button variant="outline" size="sm"><Download className="mr-1.5 size-4" />Export</Button><Button variant="outline" size="sm"><Thermometer className="mr-1.5 size-4" />Cold Chain</Button></>} />

          <div className="flex items-center gap-3">
            <div className="relative flex-1"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--text-secondary,#6B778C)]" /><Input className="pl-9" placeholder="Search by unit number, blood group, donor…" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div>
            <Button variant="outline" size="sm"><Filter className="mr-1.5 size-4" />Filter</Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredUnits.map((u) => <BloodUnitCard key={u.id} unit={u} onClick={() => setSelectedUnit(u)} />)}
          </div>
        </div>
      )}

      {screen === "blood-inventory" && selectedUnit && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setSelectedUnit(null)}><ChevronRight className="size-4 rotate-180" />Back</Button>
            <PageHeader title={selectedUnit.unitNumber} subtitle={selectedUnit.id} icon={Package}
              actions={<><Button variant="outline" size="sm"><Printer className="mr-1.5 size-4" />Print Label</Button><Button variant="outline" size="sm"><Eye className="mr-1.5 size-4" />Traceability</Button></>} />
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <Section title="Unit Details">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-[var(--text-secondary,#6B778C)]">Unit Number:</span> <span className="ml-2 font-medium text-[var(--text-primary,#172B4D)]">{selectedUnit.unitNumber}</span></div>
                  <div><span className="text-[var(--text-secondary,#6B778C)]">Blood Group:</span> <span className="ml-2"><BloodGroupBadge group={selectedUnit.bloodGroup} size="sm" /></span></div>
                  <div><span className="text-[var(--text-secondary,#6B778C)]">Component:</span> <span className="ml-2 font-medium text-[var(--text-primary,#172B4D)]">{selectedUnit.component}</span></div>
                  <div><span className="text-[var(--text-secondary,#6B778C)]">Volume:</span> <span className="ml-2 font-medium text-[var(--text-primary,#172B4D)]">{selectedUnit.volume}mL</span></div>
                  <div><span className="text-[var(--text-secondary,#6B778C)]">Donor:</span> <span className="ml-2 font-medium text-[var(--text-primary,#172B4D)]">{selectedUnit.donorName}</span></div>
                  <div><span className="text-[var(--text-secondary,#6B778C)]">Collection Date:</span> <span className="ml-2 font-medium text-[var(--text-primary,#172B4D)]">{selectedUnit.collectionDate}</span></div>
                  <div><span className="text-[var(--text-secondary,#6B778C)]">Expiry Date:</span> <span className="ml-2 font-medium text-[var(--text-primary,#172B4D)]">{selectedUnit.expiryDate}</span></div>
                  <div><span className="text-[var(--text-secondary,#6B778C)]">Storage Location:</span> <span className="ml-2 font-medium text-[var(--text-primary,#172B4D)]">{selectedUnit.storageLocation}</span></div>
                  <div><span className="text-[var(--text-secondary,#6B778C)]">Temperature:</span> <span className="ml-2 font-medium text-[var(--text-primary,#172B4D)]">{selectedUnit.temperature}°C</span></div>
                  <div><span className="text-[var(--text-secondary,#6B778C)]">Barcode:</span> <span className="ml-2 font-medium text-[var(--text-primary,#172B4D)]">{selectedUnit.barcode}</span></div>
                  <div><span className="text-[var(--text-secondary,#6B778C)]">Batch:</span> <span className="ml-2 font-medium text-[var(--text-primary,#172B4D)]">{selectedUnit.batchNumber}</span></div>
                  <div><span className="text-[var(--text-secondary,#6B778C)]">Collection ID:</span> <span className="ml-2 font-medium text-[var(--text-primary,#172B4D)]">{selectedUnit.collectionId}</span></div>
                </div>
              </Section>
            </div>
            <div className="space-y-4">
              <Section title="Status"><div className="space-y-3">
                <div className="flex items-center justify-between"><span className="text-sm text-[var(--text-secondary,#6B778C)]">Status</span><BloodUnitStatusBadge status={selectedUnit.status} /></div>
                <div className="flex items-center justify-between"><span className="text-sm text-[var(--text-secondary,#6B778C)]">Testing</span><StatusPill label={selectedUnit.testingComplete ? "Complete" : "Pending"} tone={selectedUnit.testingComplete ? "success" : "warning"} /></div>
                <div className="flex items-center justify-between"><span className="text-sm text-[var(--text-secondary,#6B778C)]">QC</span><StatusPill label={selectedUnit.qcPassed ? "Passed" : "Pending"} tone={selectedUnit.qcPassed ? "success" : "warning"} /></div>
                <div className="flex items-center justify-between"><span className="text-sm text-[var(--text-secondary,#6B778C)]">Expiry</span><ExpiryBadge expiryDate={selectedUnit.expiryDate} /></div>
              </div></Section>
              <Section title="Quick Actions"><div className="space-y-2">
                <Button className="w-full justify-start" variant="outline"><GitMerge className="mr-2 size-4" />Crossmatch</Button>
                <Button className="w-full justify-start" variant="outline"><CalendarCheck className="mr-2 size-4" />Reserve</Button>
                <Button className="w-full justify-start" variant="outline"><ArrowRight className="mr-2 size-4" />Issue</Button>
                <Button className="w-full justify-start" variant="outline"><Trash2 className="mr-2 size-4" />Discard</Button>
              </div></Section>
            </div>
          </div>
        </div>
      )}

      {/* ── 08 Blood Request Management ─────────────────────────────────── */}
      {screen === "blood-request" && !selectedRequest && (
        <div className="space-y-6">
          <PageHeader title="Blood Request Management" subtitle="Track and manage blood requests from departments" icon={FileText}
            actions={<Button size="sm"><Plus className="mr-1.5 size-4" />New Request</Button>} />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {BLOOD_REQUESTS.map((r) => <BloodRequestCard key={r.id} request={r} onClick={() => setSelectedRequest(r)} />)}
          </div>
        </div>
      )}

      {screen === "blood-request" && selectedRequest && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setSelectedRequest(null)}><ChevronRight className="size-4 rotate-180" />Back</Button>
            <PageHeader title={`Request ${selectedRequest.id}`} subtitle={selectedRequest.patientName} icon={FileText}
                actions={<><Button variant="outline" size="sm"><Check className="mr-1.5 size-4" />Approve</Button><Button variant="destructive" size="sm"><X className="mr-1.5 size-4" />Reject</Button></>} />
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <Section title="Request Details">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-[var(--text-secondary,#6B778C)]">Patient:</span> <span className="ml-2 font-medium text-[var(--text-primary,#172B4D)]">{selectedRequest.patientName}</span></div>
                  <div><span className="text-[var(--text-secondary,#6B778C)]">UHID:</span> <span className="ml-2 font-medium text-[var(--text-primary,#172B4D)]">{selectedRequest.uhid}</span></div>
                  <div><span className="text-[var(--text-secondary,#6B778C)]">Department:</span> <span className="ml-2 font-medium text-[var(--text-primary,#172B4D)]">{selectedRequest.department}</span></div>
                  <div><span className="text-[var(--text-secondary,#6B778C)]">Doctor:</span> <span className="ml-2 font-medium text-[var(--text-primary,#172B4D)]">{selectedRequest.doctor}</span></div>
                  <div><span className="text-[var(--text-secondary,#6B778C)]">Blood Group:</span> <span className="ml-2"><BloodGroupBadge group={selectedRequest.bloodGroup} size="sm" /></span></div>
                  <div><span className="text-[var(--text-secondary,#6B778C)]">Component:</span> <span className="ml-2 font-medium text-[var(--text-primary,#172B4D)]">{selectedRequest.component}</span></div>
                  <div><span className="text-[var(--text-secondary,#6B778C)]">Units:</span> <span className="ml-2 font-medium text-[var(--text-primary,#172B4D)]">{selectedRequest.units}</span></div>
                  <div><span className="text-[var(--text-secondary,#6B778C)]">Urgency:</span> <span className="ml-2"><StatusPill label={selectedRequest.urgency} tone={selectedRequest.urgency === "Emergency" ? "danger" : selectedRequest.urgency === "Urgent" ? "warning" : "info"} /></span></div>
                  <div><span className="text-[var(--text-secondary,#6B778C)]">Required By:</span> <span className="ml-2 font-medium text-[var(--text-primary,#172B4D)]">{selectedRequest.requiredTime}</span></div>
                  <div><span className="text-[var(--text-secondary,#6B778C)]">Requested:</span> <span className="ml-2 font-medium text-[var(--text-primary,#172B4D)]">{selectedRequest.requestedTime}</span></div>
                  <div className="col-span-2"><span className="text-[var(--text-secondary,#6B778C)]">Clinical Indication:</span> <span className="ml-2 font-medium text-[var(--text-primary,#172B4D)]">{selectedRequest.clinicalIndication}</span></div>
                </div>
              </Section>
            </div>
            <div className="space-y-4">
              <Section title="Approval"><div className="space-y-3">
                <div className="flex items-center justify-between"><span className="text-sm text-[var(--text-secondary,#6B778C)]">Status</span><StatusPill label={selectedRequest.approvalStatus} tone={approvalTone(selectedRequest.approvalStatus)} /></div>
                {selectedRequest.approvedBy && <div className="flex items-center justify-between"><span className="text-sm text-[var(--text-secondary,#6B778C)]">Approved By</span><span className="font-medium text-[var(--text-primary,#172B4D)]">{selectedRequest.approvedBy}</span></div>}
                {selectedRequest.approvedTime && <div className="flex items-center justify-between"><span className="text-sm text-[var(--text-secondary,#6B778C)]">Approved At</span><span className="font-medium text-[var(--text-primary,#172B4D)]">{selectedRequest.approvedTime}</span></div>}
              </div></Section>
            </div>
          </div>
        </div>
      )}

      {/* ── 09 Crossmatching ────────────────────────────────────────────── */}
      {screen === "crossmatching" && (
        <div className="space-y-6">
          <PageHeader title="Crossmatching" subtitle="Compatibility testing before blood issue" icon={GitMerge}
            actions={<Button size="sm"><Plus className="mr-1.5 size-4" />New Crossmatch</Button>} />

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <KPICard icon={GitMerge} label="Tests Today" value={CROSSMATCHES.length} tone="blue" />
            <KPICard icon={CheckCircle2} label="Compatible" value={CROSSMATCHES.filter((x) => x.result === "Compatible").length} tone="green" />
            <KPICard icon={AlertTriangle} label="Incompatible" value={CROSSMATCHES.filter((x) => x.result === "Incompatible").length} tone="red" />
            <KPICard icon={Clock} label="Pending" value={CROSSMATCHES.filter((x) => x.result === "Pending").length} tone="amber" />
          </div>

          <Section title="Crossmatch Results">
            <div className="overflow-hidden rounded-xl border border-[var(--border,#DFE1E6)]">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs text-[var(--text-secondary,#6B778C)]">
                  <tr><th className="px-4 py-3 font-medium">ID</th><th className="px-4 py-3 font-medium">Patient</th><th className="px-4 py-3 font-medium">Patient BG</th><th className="px-4 py-3 font-medium">Donor Unit</th><th className="px-4 py-3 font-medium">Donor BG</th><th className="px-4 py-3 font-medium">Method</th><th className="px-4 py-3 font-medium">Result</th><th className="px-4 py-3 font-medium">Tested By</th></tr>
                </thead>
                <tbody className="divide-y divide-[var(--border,#DFE1E6)]">
                  {CROSSMATCHES.map((x) => (
                    <tr key={x.id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 font-medium text-[#0052CC]">{x.id}</td>
                      <td className="px-4 py-3 font-medium text-[var(--text-primary,#172B4D)]">{x.patientName}</td>
                      <td className="px-4 py-3"><BloodGroupBadge group={x.patientBloodGroup} size="sm" /></td>
                      <td className="px-4 py-3 text-[var(--text-secondary,#6B778C)]">{x.donorUnitNumber}</td>
                      <td className="px-4 py-3"><BloodGroupBadge group={x.donorBloodGroup} size="sm" /></td>
                      <td className="px-4 py-3 text-[var(--text-secondary,#6B778C)]">{x.method}</td>
                      <td className="px-4 py-3"><CrossmatchBadge result={x.result} /></td>
                      <td className="px-4 py-3 text-[var(--text-secondary,#6B778C)]">{x.testedBy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        </div>
      )}

      {/* ── 10 Blood Reservation ────────────────────────────────────────── */}
      {screen === "blood-reservation" && (
        <div className="space-y-6">
          <PageHeader title="Blood Reservation" subtitle="Reserve units for scheduled procedures" icon={CalendarCheck}
            actions={<Button size="sm"><Plus className="mr-1.5 size-4" />New Reservation</Button>} />

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <KPICard icon={CalendarCheck} label="Active Reservations" value={RESERVATIONS.filter((r) => r.status === "Active").length} tone="blue" />
            <KPICard icon={CheckCircle2} label="Converted" value={0} tone="green" />
            <KPICard icon={AlertTriangle} label="Expiring Soon" value={0} tone="amber" />
            <KPICard icon={Clock} label="Total" value={RESERVATIONS.length} tone="cyan" />
          </div>

          <Section title="Active Reservations">
            <div className="overflow-hidden rounded-xl border border-[var(--border,#DFE1E6)]">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs text-[var(--text-secondary,#6B778C)]">
                  <tr><th className="px-4 py-3 font-medium">Reservation</th><th className="px-4 py-3 font-medium">Patient</th><th className="px-4 py-3 font-medium">Blood Group</th><th className="px-4 py-3 font-medium">Component</th><th className="px-4 py-3 font-medium">Units</th><th className="px-4 py-3 font-medium">Expiry</th><th className="px-4 py-3 font-medium">Procedure</th><th className="px-4 py-3 font-medium">Status</th></tr>
                </thead>
                <tbody className="divide-y divide-[var(--border,#DFE1E6)]">
                  {RESERVATIONS.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 font-medium text-[#0052CC]">{r.id}</td>
                      <td className="px-4 py-3 font-medium text-[var(--text-primary,#172B4D)]">{r.patientName}</td>
                      <td className="px-4 py-3"><BloodGroupBadge group={r.bloodGroup} size="sm" /></td>
                      <td className="px-4 py-3 text-[var(--text-secondary,#6B778C)]">{r.component}</td>
                      <td className="px-4 py-3 font-medium text-[var(--text-primary,#172B4D)]">{r.unitIds.length}</td>
                      <td className="px-4 py-3 text-[var(--text-secondary,#6B778C)]">{r.expiryTime}</td>
                      <td className="px-4 py-3 text-[var(--text-secondary,#6B778C)]">{r.procedure}</td>
                      <td className="px-4 py-3"><StatusPill label={r.status} tone={reservationStatusTone(r.status)} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        </div>
      )}

      {/* ── 11 Blood Issue ──────────────────────────────────────────────── */}
      {screen === "blood-issue" && (
        <div className="space-y-6">
          <PageHeader title="Blood Issue" subtitle="Issue blood units with barcode verification" icon={ArrowRight}
            actions={<Button size="sm"><Plus className="mr-1.5 size-4" />New Issue</Button>} />

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <KPICard icon={ArrowRight} label="Issued Today" value={BLOOD_ISSUES.length} tone="blue" />
            <KPICard icon={CheckCircle2} label="Delivered" value={BLOOD_ISSUES.filter((i) => i.transportStatus === "Delivered").length} tone="green" />
            <KPICard icon={Clock} label="In Transit" value={BLOOD_ISSUES.filter((i) => i.transportStatus === "In Transit").length} tone="amber" />
            <KPICard icon={Shield} label="Verified" value={BLOOD_ISSUES.filter((i) => i.verifiedBy).length} tone="cyan" />
          </div>

          <Section title="Issue Records">
            <div className="overflow-hidden rounded-xl border border-[var(--border,#DFE1E6)]">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs text-[var(--text-secondary,#6B778C)]">
                  <tr><th className="px-4 py-3 font-medium">Issue ID</th><th className="px-4 py-3 font-medium">Patient</th><th className="px-4 py-3 font-medium">Blood Group</th><th className="px-4 py-3 font-medium">Component</th><th className="px-4 py-3 font-medium">Units</th><th className="px-4 py-3 font-medium">Issued By</th><th className="px-4 py-3 font-medium">Verified By</th><th className="px-4 py-3 font-medium">Transport</th><th className="px-4 py-3 font-medium">Delivered To</th></tr>
                </thead>
                <tbody className="divide-y divide-[var(--border,#DFE1E6)]">
                  {BLOOD_ISSUES.map((i) => (
                    <tr key={i.id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 font-medium text-[#0052CC]">{i.id}</td>
                      <td className="px-4 py-3 font-medium text-[var(--text-primary,#172B4D)]">{i.patientName}</td>
                      <td className="px-4 py-3"><BloodGroupBadge group={i.bloodGroup} size="sm" /></td>
                      <td className="px-4 py-3 text-[var(--text-secondary,#6B778C)]">{i.component}</td>
                      <td className="px-4 py-3 font-medium text-[var(--text-primary,#172B4D)]">{i.unitIds.length}</td>
                      <td className="px-4 py-3 text-[var(--text-secondary,#6B778C)]">{i.issuedBy}</td>
                      <td className="px-4 py-3 text-[var(--text-secondary,#6B778C)]">{i.verifiedBy}</td>
                      <td className="px-4 py-3"><StatusPill label={i.transportStatus} tone={i.transportStatus === "Delivered" ? "success" : i.transportStatus === "In Transit" ? "info" : "warning"} /></td>
                      <td className="px-4 py-3 text-[var(--text-secondary,#6B778C)]">{i.deliveredTo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        </div>
      )}

      {/* ── 12 Bedside Transfusion Verification ─────────────────────────── */}
      {screen === "bedside-transfusion" && (
        <div className="space-y-6">
          <PageHeader title="Bedside Transfusion Verification" subtitle="Two-person verification before transfusion" icon={BedDouble} />

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <KPICard icon={BedDouble} label="Scheduled" value={1} tone="blue" />
            <KPICard icon={CheckCircle2} label="Verified" value={0} tone="green" />
            <KPICard icon={Clock} label="Pending" value={1} tone="amber" />
            <KPICard icon={Shield} label="Two-Person Verified" value={0} tone="cyan" />
          </div>

          <Section title="Pending Verifications">
            <div className="space-y-4">
              <div className="rounded-xl border-2 border-blue-200 bg-blue-50/50 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold text-[var(--text-primary,#172B4D)] text-lg">Transfusion Verification Required</div>
                    <div className="text-sm text-[var(--text-secondary,#6B778C)]">Patient: Lakshmi Iyer · Blood Group: O- · Unit: BLD-2026-07-005</div>
                  </div>
                  <StatusPill label="Pending Verification" tone="warning" />
                </div>

                <div className="mt-6 grid gap-4 lg:grid-cols-2">
                  <div className="rounded-lg border border-gray-200 bg-white p-4">
                    <h4 className="font-medium text-[var(--text-primary,#172B4D)]">Step 1: Patient Identity</h4>
                    <div className="mt-3 space-y-2 text-sm">
                      <div className="flex items-center justify-between"><span className="text-[var(--text-secondary,#6B778C)]">Patient Name</span><span className="font-medium text-[var(--text-primary,#172B4D)]">Lakshmi Iyer</span></div>
                      <div className="flex items-center justify-between"><span className="text-[var(--text-secondary,#6B778C)]">UHID</span><span className="font-medium text-[var(--text-primary,#172B4D)]">UHID-2026-002</span></div>
                      <div className="flex items-center justify-between"><span className="text-[var(--text-secondary,#6B778C)]">Blood Group</span><BloodGroupBadge group="O-" size="sm" /></div>
                      <div className="flex items-center justify-between"><span className="text-[var(--text-secondary,#6B778C)]">Bed</span><span className="font-medium text-[var(--text-primary,#172B4D)]">ICU Bed-05</span></div>
                    </div>
                    <Button className="mt-3 w-full" variant="outline"><Check className="mr-1.5 size-4" />Confirm Identity</Button>
                  </div>

                  <div className="rounded-lg border border-gray-200 bg-white p-4">
                    <h4 className="font-medium text-[var(--text-primary,#172B4D)]">Step 2: Blood Unit Verification</h4>
                    <div className="mt-3 space-y-2 text-sm">
                      <div className="flex items-center justify-between"><span className="text-[var(--text-secondary,#6B778C)]">Unit Number</span><span className="font-medium text-[var(--text-primary,#172B4D)]">BLD-2026-07-005</span></div>
                      <div className="flex items-center justify-between"><span className="text-[var(--text-secondary,#6B778C)]">Blood Group</span><BloodGroupBadge group="O-" size="sm" /></div>
                      <div className="flex items-center justify-between"><span className="text-[var(--text-secondary,#6B778C)]">Component</span><span className="font-medium text-[var(--text-primary,#172B4D)]">Packed RBC</span></div>
                      <div className="flex items-center justify-between"><span className="text-[var(--text-secondary,#6B778C)]">Expiry</span><span className="font-medium text-[var(--text-primary,#172B4D)]">2026-08-15</span></div>
                    </div>
                    <Button className="mt-3 w-full" variant="outline"><ScanLine className="mr-1.5 size-4" />Scan Barcode</Button>
                  </div>
                </div>

                <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4">
                  <h4 className="font-medium text-[var(--text-primary,#172B4D)]">Step 3: Two-Person Verification</h4>
                  <div className="mt-3 grid gap-4 lg:grid-cols-2">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between"><span className="text-[var(--text-secondary,#6B778C)]">Verifier 1 (Nurse)</span><span className="font-medium text-[var(--text-primary,#172B4D)]">Nurse Kavita</span></div>
                      <div className="flex items-center justify-between"><span className="text-[var(--text-secondary,#6B778C)]">Verifier 2 (Doctor)</span><span className="font-medium text-[var(--text-primary,#172B4D)]">Dr. Meera Joshi</span></div>
                    </div>
                    <Button className="w-full"><CheckCircle2 className="mr-1.5 size-4" />Complete Two-Person Verification & Start Transfusion</Button>
                  </div>
                </div>
              </div>
            </div>
          </Section>
        </div>
      )}

      {/* ── 13 Transfusion Monitoring ───────────────────────────────────── */}
      {screen === "transfusion-monitoring" && (
        <div className="space-y-6">
          <PageHeader title="Transfusion Monitoring" subtitle="Track active transfusions and vital signs" icon={Activity} />

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <KPICard icon={Activity} label="Active" value={TRANSFUSIONS.filter((t) => t.status === "In Progress").length} tone="blue" />
            <KPICard icon={CheckCircle2} label="Completed" value={TRANSFUSIONS.filter((t) => t.status === "Completed").length} tone="green" />
            <KPICard icon={AlertTriangle} label="Reactions" value={TRANSFUSIONS.filter((t) => t.status === "Reaction").length} tone="red" />
            <KPICard icon={Clock} label="Total Today" value={TRANSFUSIONS.length} tone="cyan" />
          </div>

          <Section title="Transfusion Records">
            <div className="space-y-4">
              {TRANSFUSIONS.map((t) => (
                <div key={t.id} className={`rounded-xl border-2 p-5 ${t.status === "Completed" ? "border-emerald-200 bg-emerald-50/50" : t.status === "In Progress" ? "border-blue-200 bg-blue-50/50" : "border-gray-200 bg-white"}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold text-[var(--text-primary,#172B4D)]">{t.patientName} — {t.id}</div>
                      <div className="text-sm text-[var(--text-secondary,#6B778C)]">{t.component} · <BloodGroupBadge group={t.bloodGroup} size="sm" /> · Unit: {t.unitId}</div>
                    </div>
                    <TransfusionStatusBadge status={t.status} />
                  </div>

                  <div className="mt-4 grid gap-4 lg:grid-cols-2">
                    <div className="rounded-lg border border-gray-200 bg-white p-3">
                      <h4 className="text-sm font-medium text-[var(--text-primary,#172B4D)]">Pre-Transfusion Vitals</h4>
                      <div className="mt-2 grid grid-cols-4 gap-2 text-center text-xs">
                        <div className="rounded bg-gray-50 p-1.5"><div className="text-[var(--text-secondary,#6B778C)]">BP</div><div className="font-bold text-[var(--text-primary,#172B4D)]">{t.preVitals.bp}</div></div>
                        <div className="rounded bg-gray-50 p-1.5"><div className="text-[var(--text-secondary,#6B778C)]">HR</div><div className="font-bold text-[var(--text-primary,#172B4D)]">{t.preVitals.hr}</div></div>
                        <div className="rounded bg-gray-50 p-1.5"><div className="text-[var(--text-secondary,#6B778C)]">Temp</div><div className="font-bold text-[var(--text-primary,#172B4D)]">{t.preVitals.temp}°</div></div>
                        <div className="rounded bg-gray-50 p-1.5"><div className="text-[var(--text-secondary,#6B778C)]">RR</div><div className="font-bold text-[var(--text-primary,#172B4D)]">{t.preVitals.rr}</div></div>
                      </div>
                    </div>
                    {t.postVitals && (
                      <div className="rounded-lg border border-gray-200 bg-white p-3">
                        <h4 className="text-sm font-medium text-[var(--text-primary,#172B4D)]">Post-Transfusion Vitals</h4>
                        <div className="mt-2 grid grid-cols-4 gap-2 text-center text-xs">
                          <div className="rounded bg-gray-50 p-1.5"><div className="text-[var(--text-secondary,#6B778C)]">BP</div><div className="font-bold text-[var(--text-primary,#172B4D)]">{t.postVitals.bp}</div></div>
                          <div className="rounded bg-gray-50 p-1.5"><div className="text-[var(--text-secondary,#6B778C)]">HR</div><div className="font-bold text-[var(--text-primary,#172B4D)]">{t.postVitals.hr}</div></div>
                          <div className="rounded bg-gray-50 p-1.5"><div className="text-[var(--text-secondary,#6B778C)]">Temp</div><div className="font-bold text-[var(--text-primary,#172B4D)]">{t.postVitals.temp}°</div></div>
                          <div className="rounded bg-gray-50 p-1.5"><div className="text-[var(--text-secondary,#6B778C)]">RR</div><div className="font-bold text-[var(--text-primary,#172B4D)]">{t.postVitals.rr}</div></div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 flex items-center gap-4 text-xs text-[var(--text-secondary,#6B778C)]">
                    <span>Start: {t.startTime}</span>
                    {t.endTime && <span>End: {t.endTime}</span>}
                    <span>Nurse: {t.nurse}</span>
                    <span>Doctor: {t.doctor}</span>
                  </div>
                  {t.outcome && <div className="mt-2 text-sm text-[var(--text-primary,#172B4D)]">{t.outcome}</div>}
                </div>
              ))}
            </div>
          </Section>
        </div>
      )}

      {/* ── 14 Adverse Reaction Reporting ───────────────────────────────── */}
      {screen === "adverse-reaction" && (
        <div className="space-y-6">
          <PageHeader title="Adverse Reaction Reporting" subtitle="Haemovigilance and transfusion reaction tracking" icon={AlertTriangle}
            actions={<Button size="sm"><Plus className="mr-1.5 size-4" />Report Reaction</Button>} />

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <KPICard icon={AlertTriangle} label="Reactions Today" value={ADVERSE_REACTIONS.length} tone="red" />
            <KPICard icon={Shield} label="Haemovigilance Reported" value={ADVERSE_REACTIONS.filter((r) => r.haemovigilanceReported).length} tone="blue" />
            <KPICard icon={CheckCircle2} label="Resolved" value={ADVERSE_REACTIONS.filter((r) => r.outcome.includes("Resolved") || r.outcome.includes("completed")).length} tone="green" />
            <KPICard icon={Clock} label="CAPA Required" value={ADVERSE_REACTIONS.filter((r) => r.capaRequired).length} tone="amber" />
          </div>

          <Section title="Reaction Records">
            <div className="space-y-4">
              {ADVERSE_REACTIONS.map((r) => (
                <div key={r.id} className="rounded-xl border-2 border-red-200 bg-red-50/50 p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold text-[var(--text-primary,#172B4D)]">{r.id} — {r.patientName}</div>
                      <div className="text-sm text-[var(--text-secondary,#6B778C)]">{r.reactionType} · {r.severity}</div>
                    </div>
                    <StatusPill label={r.severity} tone={reactionSeverityTone(r.severity)} />
                  </div>

                  <div className="mt-4 grid gap-4 lg:grid-cols-2">
                    <div className="space-y-2 text-sm">
                      <div><span className="text-[var(--text-secondary,#6B778C)]">Onset Time:</span> <span className="ml-2 font-medium text-[var(--text-primary,#172B4D)]">{r.onsetTime}</span></div>
                      <div><span className="text-[var(--text-secondary,#6B778C)]">Reported By:</span> <span className="ml-2 font-medium text-[var(--text-primary,#172B4D)]">{r.reportedBy}</span></div>
                      <div><span className="text-[var(--text-secondary,#6B778C)]">Report Date:</span> <span className="ml-2 font-medium text-[var(--text-primary,#172B4D)]">{r.reportDate}</span></div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div><span className="text-[var(--text-secondary,#6B778C)]">Symptoms:</span></div>
                      <div className="flex flex-wrap gap-1">{r.symptoms.map((s, i) => <StatusPill key={i} label={s} tone="danger" />)}</div>
                      <div><span className="text-[var(--text-secondary,#6B778C)]">Haemovigilance:</span> <span className="ml-2"><StatusPill label={r.haemovigilanceReported ? "Reported" : "Pending"} tone={r.haemovigilanceReported ? "success" : "warning"} /></span></div>
                    </div>
                  </div>

                  <div className="mt-4 rounded-lg border border-gray-200 bg-white p-3 text-sm">
                    <div><span className="font-medium text-[var(--text-primary,#172B4D)]">Immediate Actions:</span> <span className="text-[var(--text-secondary,#6B778C)]">{r.immediateActions}</span></div>
                    <div className="mt-2"><span className="font-medium text-[var(--text-primary,#172B4D)]">Investigation:</span> <span className="text-[var(--text-secondary,#6B778C)]">{r.investigation}</span></div>
                    <div className="mt-2"><span className="font-medium text-[var(--text-primary,#172B4D)]">Outcome:</span> <span className="text-[var(--text-secondary,#6B778C)]">{r.outcome}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>
      )}

      {/* ── 15 Blood Disposal ───────────────────────────────────────────── */}
      {screen === "blood-disposal" && (
        <div className="space-y-6">
          <PageHeader title="Blood Disposal" subtitle="Expired, damaged, and quarantined unit disposal" icon={Trash2}
            actions={<Button size="sm"><Plus className="mr-1.5 size-4" />New Disposal</Button>} />

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <KPICard icon={Trash2} label="Disposed Today" value={BLOOD_DISPOSALS.length} tone="red" />
            <KPICard icon={Clock} label="Awaiting Disposal" value={BLOOD_UNITS.filter((u) => u.status === "Expired" || u.status === "Discarded").length} tone="amber" />
            <KPICard icon={CheckCircle2} label="Approved" value={BLOOD_DISPOSALS.length} tone="green" />
            <KPICard icon={Shield} label="Traceability" value="100%" tone="cyan" />
          </div>

          <Section title="Disposal Records">
            <div className="overflow-hidden rounded-xl border border-[var(--border,#DFE1E6)]">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs text-[var(--text-secondary,#6B778C)]">
                  <tr><th className="px-4 py-3 font-medium">Disposal ID</th><th className="px-4 py-3 font-medium">Unit</th><th className="px-4 py-3 font-medium">Blood Group</th><th className="px-4 py-3 font-medium">Component</th><th className="px-4 py-3 font-medium">Reason</th><th className="px-4 py-3 font-medium">Approved By</th><th className="px-4 py-3 font-medium">Date</th><th className="px-4 py-3 font-medium">Waste Bag</th></tr>
                </thead>
                <tbody className="divide-y divide-[var(--border,#DFE1E6)]">
                  {BLOOD_DISPOSALS.map((d) => (
                    <tr key={d.id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 font-medium text-[#0052CC]">{d.id}</td>
                      <td className="px-4 py-3 font-medium text-[var(--text-primary,#172B4D)]">{d.unitNumber}</td>
                      <td className="px-4 py-3"><BloodGroupBadge group={d.bloodGroup} size="sm" /></td>
                      <td className="px-4 py-3 text-[var(--text-secondary,#6B778C)]">{d.component}</td>
                      <td className="px-4 py-3"><StatusPill label={d.disposalReason} tone="danger" /></td>
                      <td className="px-4 py-3 text-[var(--text-secondary,#6B778C)]">{d.approvedBy}</td>
                      <td className="px-4 py-3 text-[var(--text-secondary,#6B778C)]">{d.disposalDate}</td>
                      <td className="px-4 py-3 font-medium text-[var(--text-primary,#172B4D)]">{d.wasteBagId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        </div>
      )}

      {/* ── 16 Quality Control ──────────────────────────────────────────── */}
      {screen === "quality-control" && (
        <div className="space-y-6">
          <PageHeader title="Quality Control" subtitle="Temperature monitoring, equipment QC, and compliance" icon={ShieldCheck}
            actions={<><Button variant="outline" size="sm"><Download className="mr-1.5 size-4" />Export Report</Button><Button size="sm"><Plus className="mr-1.5 size-4" />New QC Test</Button></>} />

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <KPICard icon={ShieldCheck} label="QC Tests Today" value={QUALITY_CONTROLS.length} tone="blue" />
            <KPICard icon={CheckCircle2} label="Passed" value={QUALITY_CONTROLS.filter((q) => q.result === "Pass").length} tone="green" />
            <KPICard icon={AlertTriangle} label="Failed" value={QUALITY_CONTROLS.filter((q) => q.result === "Fail").length} tone="red" />
            <KPICard icon={Clock} label="Pending" value={QUALITY_CONTROLS.filter((q) => q.result === "Pending").length} tone="amber" />
          </div>

          <Section title="Cold Chain Monitoring">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {TEMPERATURE_LOGS.slice(0, 4).map((log) => (
                <ColdChainWidget key={log.id} log={log} />
              ))}
            </div>
          </Section>

          <Section title="QC Records">
            <div className="overflow-hidden rounded-xl border border-[var(--border,#DFE1E6)]">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs text-[var(--text-secondary,#6B778C)]">
                  <tr><th className="px-4 py-3 font-medium">ID</th><th className="px-4 py-3 font-medium">Test Type</th><th className="px-4 py-3 font-medium">Equipment</th><th className="px-4 py-3 font-medium">Result</th><th className="px-4 py-3 font-medium">Performed By</th><th className="px-4 py-3 font-medium">Next Due</th><th className="px-4 py-3 font-medium">CAPA</th></tr>
                </thead>
                <tbody className="divide-y divide-[var(--border,#DFE1E6)]">
                  {QUALITY_CONTROLS.map((q) => (
                    <tr key={q.id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 font-medium text-[#0052CC]">{q.id}</td>
                      <td className="px-4 py-3 font-medium text-[var(--text-primary,#172B4D)]">{q.testType}</td>
                      <td className="px-4 py-3 text-[var(--text-secondary,#6B778C)]">{q.equipmentName}</td>
                      <td className="px-4 py-3"><StatusPill label={q.result} tone={q.result === "Pass" ? "success" : q.result === "Fail" ? "danger" : "warning"} /></td>
                      <td className="px-4 py-3 text-[var(--text-secondary,#6B778C)]">{q.performedBy}</td>
                      <td className="px-4 py-3 text-[var(--text-secondary,#6B778C)]">{q.nextDue}</td>
                      <td className="px-4 py-3">{q.capaRequired ? <StatusPill label="Required" tone="danger" /> : <span className="text-[var(--text-secondary,#6B778C)]">—</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        </div>
      )}

      {/* ── 17 Reports & Analytics ──────────────────────────────────────── */}
      {screen === "reports-analytics" && (
        <div className="space-y-6">
          <PageHeader title="Reports & Analytics" subtitle="Blood bank performance metrics and reporting" icon={BarChart3}
            actions={<><Button variant="outline" size="sm"><Download className="mr-1.5 size-4" />Export Report</Button></>} />

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <KPICard icon={Droplets} label="Total Donations" value="45" sub="This month" tone="blue" trend="up" trendValue="+12%" />
            <KPICard icon={Package} label="Units Issued" value="38" sub="This month" tone="green" />
            <KPICard icon={Trash2} label="Discard Rate" value={`${BB_KPI.discardRate}%`} sub="Target: <5%" tone={BB_KPI.discardRate > 5 ? "red" : "green"} />
            <KPICard icon={Thermometer} label="Cold Chain" value={`${BB_KPI.coldChainCompliance}%`} tone="cyan" trend="up" trendValue="+1.2%" />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Section title="Blood Group Distribution">
              <div className="space-y-3">
                {(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const).map((g) => {
                  const units = BLOOD_UNITS.filter((u) => u.bloodGroup === g);
                  const pct = Math.round((units.length / BLOOD_UNITS.length) * 100);
                  return (
                    <div key={g}>
                      <div className="flex items-center justify-between text-sm">
                        <BloodGroupBadge group={g} size="sm" />
                        <span className="text-[var(--text-secondary,#6B778C)]">{units.length} units ({pct}%)</span>
                      </div>
                      <div className="mt-1 h-2 overflow-hidden rounded-full bg-gray-200">
                        <div className="h-full rounded-full bg-red-500" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Section>

            <Section title="Component Production">
              <div className="space-y-3">
                {(["Packed RBC", "Platelets", "Fresh Frozen Plasma", "Cryoprecipitate", "Whole Blood"] as const).map((c) => {
                  const units = BLOOD_UNITS.filter((u) => u.component === c);
                  const pct = Math.round((units.length / BLOOD_UNITS.length) * 100);
                  return (
                    <div key={c}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[var(--text-primary,#172B4D)]">{c}</span>
                        <span className="text-[var(--text-secondary,#6B778C)]">{units.length} units ({pct}%)</span>
                      </div>
                      <div className="mt-1 h-2 overflow-hidden rounded-full bg-gray-200">
                        <div className="h-full rounded-full bg-blue-500" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Section>

            <Section title="Inventory Status">
              <div className="space-y-3">
                {([
                  { status: "Available", count: BB_KPI.availableUnits, color: "bg-emerald-500" },
                  { status: "Reserved", count: BB_KPI.reservedUnits, color: "bg-blue-500" },
                  { status: "Issued", count: BB_KPI.issuedUnits, color: "bg-purple-500" },
                  { status: "Expired", count: BB_KPI.expiredUnits, color: "bg-red-500" },
                  { status: "Discarded", count: BB_KPI.discardedUnits, color: "bg-gray-400" },
                  { status: "Quarantined", count: BB_KPI.quarantinedUnits, color: "bg-amber-500" },
                ]).map((s) => (
                  <div key={s.status}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[var(--text-primary,#172B4D)]">{s.status}</span>
                      <span className="text-[var(--text-secondary,#6B778C)]">{s.count} units</span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-gray-200">
                      <div className={`h-full rounded-full ${s.color}`} style={{ width: `${(s.count / BB_KPI.totalUnits) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Key Performance Indicators">
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between"><span className="text-[var(--text-secondary,#6B778C)]">Deferral Rate</span><span className="font-medium text-[var(--text-primary,#172B4D)]">{BB_KPI.deferralRate}%</span></div>
                <div className="flex items-center justify-between"><span className="text-[var(--text-secondary,#6B778C)]">Discard Rate</span><span className="font-medium text-[var(--text-primary,#172B4D)]">{BB_KPI.discardRate}%</span></div>
                <div className="flex items-center justify-between"><span className="text-[var(--text-secondary,#6B778C)]">Cold Chain Compliance</span><span className="font-medium text-[var(--text-primary,#172B4D)]">{BB_KPI.coldChainCompliance}%</span></div>
                <div className="flex items-center justify-between"><span className="text-[var(--text-secondary,#6B778C)]">Avg Turnaround</span><span className="font-medium text-[var(--text-primary,#172B4D)]">{BB_KPI.avgTurnaroundTime}h</span></div>
                <div className="flex items-center justify-between"><span className="text-[var(--text-secondary,#6B778C)]">Emergency Requests</span><span className="font-medium text-[var(--text-primary,#172B4D)]">{BB_KPI.emergencyRequests}</span></div>
                <div className="flex items-center justify-between"><span className="text-[var(--text-secondary,#6B778C)]">Adverse Reactions</span><span className="font-medium text-[var(--text-primary,#172B4D)]">{BB_KPI.adverseReactions}</span></div>
              </div>
            </Section>
          </div>
        </div>
      )}

      {/* ── 18 Workflow Complete ─────────────────────────────────────────── */}
      {screen === "workflow-complete" && (
        <div className="space-y-6">
          <PageHeader title="Workflow Complete" subtitle="All blood bank processes completed" icon={CheckCircle2} />
          <div className="flex flex-col items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50/50 py-16 text-center">
            <div className="grid size-16 place-items-center rounded-full bg-emerald-100"><CheckCircle2 className="size-8 text-emerald-600" /></div>
            <h2 className="mt-4 text-xl font-bold text-[var(--text-primary,#172B4D)]">All Processes Complete</h2>
            <p className="mt-2 max-w-md text-sm text-[var(--text-secondary,#6B778C)]">
              Blood issued, transfusion recorded, inventory updated, haemovigilance reported, and audit trail maintained.
            </p>
            <div className="mt-6 flex gap-3">
              <Button variant="outline"><Download className="mr-1.5 size-4" />Download Summary</Button>
              <Button onClick={() => setScreen("bb-dashboard")}>Return to Dashboard</Button>
            </div>
          </div>
        </div>
      )}

    </Shell>
  );
}
