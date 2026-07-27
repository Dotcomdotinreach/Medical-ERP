import { useState, useMemo } from "react";
import {
  LayoutDashboard, Wrench, Box, ArrowLeftRight, Droplets, ScanLine,
  CheckCircle2, PackageCheck, Tag, Thermometer, Monitor, ShieldCheck,
  Warehouse, Settings, BarChart3, ClipboardCheck, History, Workflow,
  ChevronRight, Download, Filter, Plus, RefreshCw, Eye, Edit3, Search,
  AlertTriangle, Clock, Package, Trash2, Bell, Info, ChevronDown, X, Printer,
} from "lucide-react";
import { Shell, type Workspace } from "../his/Shell";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  INSTRUMENTS, TRAYS, AUTOCLAVES, CYCLES, DEPT_REQUESTS,
  DECONTAMINATION, QUALITY_RECORDS, MAINTENANCE, AUDIT_LOGS, CSSD_KPI,
  instrumentStatusTone, trayStatusTone, sterilityTone, cycleStatusTone,
  autoclaveStatusTone, issueStatusTone, priorityTone, formatCurrency,
  type Instrument, type Tray, type Autoclave, type SterilizationCycle,
  type DepartmentRequest, type DecontaminationRecord, type QualityRecord,
  type MaintenanceRecord, type AuditLog,
} from "./data";
import {
  PageHeader, Section, KPICard, StatusPill, InstrumentCard, TrayCard,
  AutoclaveWidget, LifecycleBar, InstrumentStatusBadge, TrayStatusBadge,
  SterilityBadge, CycleStatusBadge, AutoclaveStatusBadge, IssueStatusBadge,
  PriorityBadge,
} from "./cssdUi";

type CssdRoute =
  | "cssd-dashboard" | "instrument-master" | "tray-management"
  | "instrument-issue-return" | "decontamination" | "cleaning-washing"
  | "instrument-inspection" | "tray-assembly" | "packing-labelling"
  | "sterilization-cycles" | "autoclave-monitoring" | "quality-control"
  | "storage-distribution" | "maintenance" | "inventory-integration"
  | "reports-analytics" | "audit-compliance" | "workflow-complete";

const NAV = [
  { id: "cssd-dashboard", label: "CSSD Dashboard", icon: LayoutDashboard },
  { id: "instrument-master", label: "Instrument Master", icon: Wrench },
  { id: "tray-management", label: "Tray Management", icon: Box },
  { id: "instrument-issue-return", label: "Issue & Return", icon: ArrowLeftRight, badge: "2", tone: "warning" as const },
  { id: "decontamination", label: "Decontamination", icon: Droplets },
  { id: "cleaning-washing", label: "Cleaning & Washing", icon: Droplets },
  { id: "instrument-inspection", label: "Instrument Inspection", icon: ScanLine },
  { id: "tray-assembly", label: "Tray Assembly", icon: PackageCheck },
  { id: "packing-labelling", label: "Packing & Labelling", icon: Tag },
];

const NAV_SECONDARY = [
  { id: "sterilization-cycles", label: "Sterilization Cycles", icon: Thermometer },
  { id: "autoclave-monitoring", label: "Autoclave Monitoring", icon: Monitor, badge: "2", tone: "info" as const },
  { id: "quality-control", label: "Quality Control", icon: ShieldCheck },
  { id: "storage-distribution", label: "Storage & Distribution", icon: Warehouse },
  { id: "maintenance", label: "Maintenance", icon: Settings, badge: "1", tone: "warning" as const },
  { id: "inventory-integration", label: "Inventory", icon: Package },
  { id: "reports-analytics", label: "Reports & Analytics", icon: BarChart3 },
  { id: "audit-compliance", label: "Audit & Compliance", icon: ClipboardCheck },
  { id: "workflow-complete", label: "Workflow Complete", icon: CheckCircle2 },
];

export function CssdApp({ roleName, onSignOut, onSwitchWorkspace, onOpenSettings }: {
  roleName: string; onSignOut: () => void; onSwitchWorkspace: (w: Workspace) => void; onOpenSettings?: (page: string) => void;
}) {
  const [screen, setScreen] = useState<CssdRoute>("cssd-dashboard");
  const [selectedInstrument, setSelectedInstrument] = useState<Instrument | null>(null);
  const [selectedTray, setSelectedTray] = useState<Tray | null>(null);
  const [selectedAutoclave, setSelectedAutoclave] = useState<Autoclave | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const breadcrumb = useMemo(() => {
    const crumb = ["CSSD"];
    const nav = [...NAV, ...NAV_SECONDARY].find((n) => n.id === screen);
    if (nav) crumb.push(nav.label);
    if (selectedInstrument && screen === "instrument-master") {
      crumb.splice(2, 0, selectedInstrument.name);
    }
    if (selectedTray && screen === "tray-management") {
      crumb.splice(2, 0, selectedTray.name);
    }
    if (selectedAutoclave && screen === "autoclave-monitoring") {
      crumb.splice(2, 0, selectedAutoclave.name);
    }
    return crumb;
  }, [screen, selectedInstrument, selectedTray, selectedAutoclave]);

  const filteredInstruments = INSTRUMENTS.filter((i) =>
    !searchQuery || i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTrays = TRAYS.filter((t) =>
    !searchQuery || t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.procedureType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Shell
      nav={NAV}
      navSecondary={NAV_SECONDARY}
      sectionLabel="Central Sterile Services"
      activeId={screen}
      isActive={(id) => id === screen}
      onNavigate={(id) => { setScreen(id as CssdRoute); setSelectedInstrument(null); setSelectedTray(null); setSelectedAutoclave(null); }}
      breadcrumb={breadcrumb}
      roleName={roleName}
      onSignOut={onSignOut}
      workspace="cssd"
      onSwitchWorkspace={onSwitchWorkspace}
      onOpenSettings={onOpenSettings}
      searchPlaceholder="Search instruments, trays, batches…"
    >
      {/* Dashboard */}
      {screen === "cssd-dashboard" && (
        <div className="space-y-6">
          <PageHeader title="CSSD Dashboard" subtitle="Central Sterile Services Department overview" icon={LayoutDashboard}
            actions={<>
              <Button variant="outline" size="sm"><RefreshCw className="mr-1.5 size-4" />Refresh</Button>
              <Button variant="outline" size="sm"><Download className="mr-1.5 size-4" />Export</Button>
            </>} />

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <KPICard icon={Thermometer} label="Today's Cycles" value={CSSD_KPI.todayCycles} sub={`${CSSD_KPI.completedCycles} completed · ${CSSD_KPI.runningCycles} running`} tone="blue" trend="up" trendValue="+12%" />
            <KPICard icon={Box} label="Sterile Trays Ready" value={CSSD_KPI.availableSterileTrays} sub="Available for issue" tone="green" />
            <KPICard icon={ArrowLeftRight} label="Pending Returns" value={CSSD_KPI.pendingReturns} sub="Overdue or pending" tone="amber" />
            <KPICard icon={Wrench} label="Total Instruments" value={CSSD_KPI.totalInstruments} sub={`${CSSD_KPI.quarantinedInstruments} quarantined`} tone="purple" />
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <KPICard icon={ShieldCheck} label="Compliance" value={`${CSSD_KPI.sterilizationCompliance}%`} sub="Sterilization compliance" tone="green" trend="up" trendValue="+0.5%" />
            <KPICard icon={Monitor} label="Autoclaves Running" value="2" sub="1 idle · 1 maintenance" tone="blue" />
            <KPICard icon={AlertTriangle} label="Failed Cycles" value={CSSD_KPI.failedCycles} sub="Requires attention" tone="red" />
            <KPICard icon={Clock} label="Avg Turnaround" value={`${CSSD_KPI.avgTurnaroundTime}h`} sub="Issue to return" tone="cyan" />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Section title="Active Autoclaves" actions={<Button variant="outline" size="sm" onClick={() => setScreen("autoclave-monitoring")}>View All</Button>}>
              <div className="space-y-3">
                {AUTOCLAVES.filter((a) => a.status === "Running").map((a) => (
                  <AutoclaveWidget key={a.id} autoclave={a} onClick={() => { setSelectedAutoclave(a); setScreen("autoclave-monitoring"); }} />
                ))}
              </div>
            </Section>

            <Section title="Recent Department Requests" actions={<Button variant="outline" size="sm" onClick={() => setScreen("instrument-issue-return")}>View All</Button>}>
              <div className="overflow-hidden rounded-xl border border-[var(--border,#DFE1E6)]">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-xs text-[var(--text-secondary,#6B778C)]">
                    <tr><th className="px-4 py-3 font-medium">Department</th><th className="px-4 py-3 font-medium">Tray</th><th className="px-4 py-3 font-medium">Priority</th><th className="px-4 py-3 font-medium">Status</th></tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border,#DFE1E6)]">
                    {DEPT_REQUESTS.slice(0, 5).map((r) => (
                      <tr key={r.id} className="hover:bg-gray-50/50">
                        <td className="px-4 py-3 font-medium text-[var(--text-primary,#172B4D)]">{r.department}</td>
                        <td className="px-4 py-3 text-[var(--text-secondary,#6B778C)]">{r.trayName}</td>
                        <td className="px-4 py-3"><PriorityBadge priority={r.priority} /></td>
                        <td className="px-4 py-3"><IssueStatusBadge status={r.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>
          </div>

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
                      <td className="px-4 py-3 text-[var(--text-secondary,#6B778C)]">{log.details}</td>
                      <td className="px-4 py-3">
                        <StatusPill label={log.severity} tone={log.severity === "Critical" ? "danger" : log.severity === "Warning" ? "warning" : "info"} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        </div>
      )}

      {/* Instrument Master */}
      {screen === "instrument-master" && !selectedInstrument && (
        <div className="space-y-6">
          <PageHeader title="Instrument Master" subtitle={`${INSTRUMENTS.length} instruments tracked`} icon={Wrench}
            actions={<>
              <Button variant="outline" size="sm"><Download className="mr-1.5 size-4" />Export</Button>
              <Button size="sm"><Plus className="mr-1.5 size-4" />Add Instrument</Button>
            </>} />

          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--text-secondary,#6B778C)]" />
              <Input className="pl-9" placeholder="Search instruments…" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <Button variant="outline" size="sm"><Filter className="mr-1.5 size-4" />Filter</Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredInstruments.map((inst) => (
              <InstrumentCard key={inst.id} instrument={inst} onClick={() => setSelectedInstrument(inst)} />
            ))}
          </div>
        </div>
      )}

      {/* Instrument Detail */}
      {screen === "instrument-master" && selectedInstrument && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setSelectedInstrument(null)}><ChevronRight className="size-4 rotate-180" />Back</Button>
            <PageHeader title={selectedInstrument.name} subtitle={selectedInstrument.id} icon={Wrench}
              actions={<><Button variant="outline" size="sm"><Edit3 className="mr-1.5 size-4" />Edit</Button><Button variant="outline" size="sm"><History className="mr-1.5 size-4" />History</Button></>} />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <Section title="Instrument Details">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-[var(--text-secondary,#6B778C)]">Barcode:</span> <span className="ml-2 font-medium text-[var(--text-primary,#172B4D)]">{selectedInstrument.barcode}</span></div>
                  <div><span className="text-[var(--text-secondary,#6B778C)]">RFID:</span> <span className="ml-2 font-medium text-[var(--text-primary,#172B4D)]">{selectedInstrument.rfid}</span></div>
                  <div><span className="text-[var(--text-secondary,#6B778C)]">Category:</span> <span className="ml-2 font-medium text-[var(--text-primary,#172B4D)]">{selectedInstrument.category}</span></div>
                  <div><span className="text-[var(--text-secondary,#6B778C)]">Manufacturer:</span> <span className="ml-2 font-medium text-[var(--text-primary,#172B4D)]">{selectedInstrument.manufacturer}</span></div>
                  <div><span className="text-[var(--text-secondary,#6B778C)]">Model:</span> <span className="ml-2 font-medium text-[var(--text-primary,#172B4D)]">{selectedInstrument.model}</span></div>
                  <div><span className="text-[var(--text-secondary,#6B778C)]">Cost:</span> <span className="ml-2 font-medium text-[var(--text-primary,#172B4D)]">{formatCurrency(selectedInstrument.cost)}</span></div>
                  <div><span className="text-[var(--text-secondary,#6B778C)]">Purchase Date:</span> <span className="ml-2 font-medium text-[var(--text-primary,#172B4D)]">{selectedInstrument.purchaseDate}</span></div>
                  <div><span className="text-[var(--text-secondary,#6B778C)]">Warranty Expiry:</span> <span className="ml-2 font-medium text-[var(--text-primary,#172B4D)]">{selectedInstrument.warrantyExpiry}</span></div>
                  <div><span className="text-[var(--text-secondary,#6B778C)]">Location:</span> <span className="ml-2 font-medium text-[var(--text-primary,#172B4D)]">{selectedInstrument.currentLocation}</span></div>
                  <div><span className="text-[var(--text-secondary,#6B778C)]">Department:</span> <span className="ml-2 font-medium text-[var(--text-primary,#172B4D)]">{selectedInstrument.department}</span></div>
                </div>
              </Section>

              <Section title="Lifecycle & Maintenance">
                <div className="space-y-4">
                  <LifecycleBar current={selectedInstrument.lifecycleCount} max={selectedInstrument.maxCycles} />
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="text-[var(--text-secondary,#6B778C)]">Last Calibration:</span> <span className="ml-2 font-medium text-[var(--text-primary,#172B4D)]">{selectedInstrument.lastCalibration}</span></div>
                    <div><span className="text-[var(--text-secondary,#6B778C)]">Next Calibration:</span> <span className="ml-2 font-medium text-[var(--text-primary,#172B4D)]">{selectedInstrument.nextCalibration}</span></div>
                    <div><span className="text-[var(--text-secondary,#6B778C)]">Maintenance Due:</span> <span className="ml-2 font-medium text-[var(--text-primary,#172B4D)]">{selectedInstrument.maintenanceDue}</span></div>
                    <div><span className="text-[var(--text-secondary,#6B778C)]">Condition:</span> <span className="ml-2 font-medium text-[var(--text-primary,#172B4D)]">{selectedInstrument.condition}</span></div>
                  </div>
                </div>
              </Section>
            </div>

            <div className="space-y-4">
              <Section title="Status">
                <div className="space-y-3">
                  <div className="flex items-center justify-between"><span className="text-sm text-[var(--text-secondary,#6B778C)]">Status</span><InstrumentStatusBadge status={selectedInstrument.status} /></div>
                  <div className="flex items-center justify-between"><span className="text-sm text-[var(--text-secondary,#6B778C)]">Condition</span><StatusPill label={selectedInstrument.condition} tone={selectedInstrument.condition === "Excellent" || selectedInstrument.condition === "Good" ? "success" : selectedInstrument.condition === "Fair" ? "warning" : "danger"} /></div>
                </div>
              </Section>

              <Section title="Quick Actions">
                <div className="space-y-2">
                  <Button className="w-full justify-start" variant="outline"><ArrowLeftRight className="mr-2 size-4" />Issue / Return</Button>
                  <Button className="w-full justify-start" variant="outline"><Settings className="mr-2 size-4" />Schedule Maintenance</Button>
                  <Button className="w-full justify-start" variant="outline"><History className="mr-2 size-4" />View History</Button>
                  <Button className="w-full justify-start" variant="outline"><Trash2 className="mr-2 size-4" />Retire Instrument</Button>
                </div>
              </Section>
            </div>
          </div>
        </div>
      )}

      {/* Tray Management */}
      {screen === "tray-management" && !selectedTray && (
        <div className="space-y-6">
          <PageHeader title="Tray Management" subtitle={`${TRAYS.length} trays tracked`} icon={Box}
            actions={<>
              <Button variant="outline" size="sm"><Download className="mr-1.5 size-4" />Export</Button>
              <Button size="sm"><Plus className="mr-1.5 size-4" />Add Tray</Button>
            </>} />

          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--text-secondary,#6B778C)]" />
              <Input className="pl-9" placeholder="Search trays…" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <Button variant="outline" size="sm"><Filter className="mr-1.5 size-4" />Filter</Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTrays.map((tray) => (
              <TrayCard key={tray.id} tray={tray} onClick={() => setSelectedTray(tray)} />
            ))}
          </div>
        </div>
      )}

      {/* Tray Detail */}
      {screen === "tray-management" && selectedTray && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setSelectedTray(null)}><ChevronRight className="size-4 rotate-180" />Back</Button>
            <PageHeader title={selectedTray.name} subtitle={selectedTray.id} icon={Box}
              actions={<><Button variant="outline" size="sm"><Edit3 className="mr-1.5 size-4" />Edit</Button><Button variant="outline" size="sm"><History className="mr-1.5 size-4" />History</Button></>} />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <Section title="Tray Details">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-[var(--text-secondary,#6B778C)]">Procedure Type:</span> <span className="ml-2 font-medium text-[var(--text-primary,#172B4D)]">{selectedTray.procedureType}</span></div>
                  <div><span className="text-[var(--text-secondary,#6B778C)]">Version:</span> <span className="ml-2 font-medium text-[var(--text-primary,#172B4D)]">v{selectedTray.version}</span></div>
                  <div><span className="text-[var(--text-secondary,#6B778C)]">Barcode:</span> <span className="ml-2 font-medium text-[var(--text-primary,#172B4D)]">{selectedTray.barcode}</span></div>
                  <div><span className="text-[var(--text-secondary,#6B778C)]">RFID:</span> <span className="ml-2 font-medium text-[var(--text-primary,#172B4D)]">{selectedTray.rfid}</span></div>
                  <div><span className="text-[var(--text-secondary,#6B778C)]">Instruments:</span> <span className="ml-2 font-medium text-[var(--text-primary,#172B4D)]">{selectedTray.actualCount}/{selectedTray.instrumentCount}</span></div>
                  <div><span className="text-[var(--text-secondary,#6B778C)]">Location:</span> <span className="ml-2 font-medium text-[var(--text-primary,#172B4D)]">{selectedTray.location}</span></div>
                  <div><span className="text-[var(--text-secondary,#6B778C)]">Assembly Tech:</span> <span className="ml-2 font-medium text-[var(--text-primary,#172B4D)]">{selectedTray.assemblyTechnician || "—"}</span></div>
                  <div><span className="text-[var(--text-secondary,#6B778C)]">Packed By:</span> <span className="ml-2 font-medium text-[var(--text-primary,#172B4D)]">{selectedTray.packedBy || "—"}</span></div>
                  <div><span className="text-[var(--text-secondary,#6B778C)]">Sterilized By:</span> <span className="ml-2 font-medium text-[var(--text-primary,#172B4D)]">{selectedTray.sterilizedBy || "—"}</span></div>
                  <div><span className="text-[var(--text-secondary,#6B778C)]">Last Sterilized:</span> <span className="ml-2 font-medium text-[var(--text-primary,#172B4D)]">{selectedTray.lastSterilized || "—"}</span></div>
                  {selectedTray.assignedOT && <div><span className="text-[var(--text-secondary,#6B778C)]">Assigned OT:</span> <span className="ml-2 font-medium text-[var(--text-primary,#172B4D)]">{selectedTray.assignedOT}</span></div>}
                  {selectedTray.expiryDate && <div><span className="text-[var(--text-secondary,#6B778C)]">Expiry:</span> <span className="ml-2 font-medium text-[var(--text-primary,#172B4D)]">{selectedTray.expiryDate}</span></div>}
                </div>
              </Section>
            </div>

            <div className="space-y-4">
              <Section title="Status">
                <div className="space-y-3">
                  <div className="flex items-center justify-between"><span className="text-sm text-[var(--text-secondary,#6B778C)]">Tray Status</span><TrayStatusBadge status={selectedTray.status} /></div>
                  <div className="flex items-center justify-between"><span className="text-sm text-[var(--text-secondary,#6B778C)]">Sterility</span><SterilityBadge status={selectedTray.sterilityStatus} /></div>
                </div>
              </Section>

              <Section title="Quick Actions">
                <div className="space-y-2">
                  <Button className="w-full justify-start" variant="outline"><Droplets className="mr-2 size-4" />Send to Decontamination</Button>
                  <Button className="w-full justify-start" variant="outline"><PackageCheck className="mr-2 size-4" />Assemble</Button>
                  <Button className="w-full justify-start" variant="outline"><Tag className="mr-2 size-4" />Pack & Label</Button>
                  <Button className="w-full justify-start" variant="outline"><Thermometer className="mr-2 size-4" />Sterilize</Button>
                  <Button className="w-full justify-start" variant="outline"><ArrowLeftRight className="mr-2 size-4" />Issue to OT</Button>
                </div>
              </Section>
            </div>
          </div>
        </div>
      )}

      {/* Instrument Issue & Return */}
      {screen === "instrument-issue-return" && (
        <div className="space-y-6">
          <PageHeader title="Instrument Issue & Return" subtitle="Track tray issuance and returns from departments" icon={ArrowLeftRight}
            actions={<Button size="sm"><Plus className="mr-1.5 size-4" />New Request</Button>} />

          <div className="overflow-hidden rounded-xl border border-[var(--border,#DFE1E6)]">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs text-[var(--text-secondary,#6B778C)]">
                <tr>
                  <th className="px-4 py-3 font-medium">Request ID</th>
                  <th className="px-4 py-3 font-medium">Department</th>
                  <th className="px-4 py-3 font-medium">Tray</th>
                  <th className="px-4 py-3 font-medium">Requested By</th>
                  <th className="px-4 py-3 font-medium">Priority</th>
                  <th className="px-4 py-3 font-medium">Required</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border,#DFE1E6)]">
                {DEPT_REQUESTS.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-medium text-[#0052CC]">{r.id}</td>
                    <td className="px-4 py-3 font-medium text-[var(--text-primary,#172B4D)]">{r.department}</td>
                    <td className="px-4 py-3 text-[var(--text-secondary,#6B778C)]">{r.trayName}</td>
                    <td className="px-4 py-3 text-[var(--text-secondary,#6B778C)]">{r.requestedBy}</td>
                    <td className="px-4 py-3"><PriorityBadge priority={r.priority} /></td>
                    <td className="px-4 py-3 text-xs text-[var(--text-secondary,#6B778C)]">{r.requiredTime}</td>
                    <td className="px-4 py-3"><IssueStatusBadge status={r.status} /></td>
                    <td className="px-4 py-3">
                      {r.status === "Requested" && <Button size="sm" variant="outline">Issue</Button>}
                      {r.status === "Issued" && <Button size="sm" variant="outline">Return</Button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Decontamination */}
      {screen === "decontamination" && (
        <div className="space-y-6">
          <PageHeader title="Decontamination" subtitle="Incoming instrument decontamination tracking" icon={Droplets}
            actions={<Button size="sm"><Plus className="mr-1.5 size-4" />New Record</Button>} />

          <div className="overflow-hidden rounded-xl border border-[var(--border,#DFE1E6)]">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs text-[var(--text-secondary,#6B778C)]">
                <tr>
                  <th className="px-4 py-3 font-medium">ID</th>
                  <th className="px-4 py-3 font-medium">Tray</th>
                  <th className="px-4 py-3 font-medium">Received From</th>
                  <th className="px-4 py-3 font-medium">Operator</th>
                  <th className="px-4 py-3 font-medium">Steps</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border,#DFE1E6)]">
                {DECONTAMINATION.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-medium text-[#0052CC]">{d.id}</td>
                    <td className="px-4 py-3 font-medium text-[var(--text-primary,#172B4D)]">{d.trayName}</td>
                    <td className="px-4 py-3 text-[var(--text-secondary,#6B778C)]">{d.receivedFrom}</td>
                    <td className="px-4 py-3 text-[var(--text-secondary,#6B778C)]">{d.operator}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {d.sortingComplete && <CheckCircle2 className="size-4 text-emerald-500" />}
                        {d.preCleaned && <CheckCircle2 className="size-4 text-emerald-500" />}
                        {d.disinfected && <CheckCircle2 className="size-4 text-emerald-500" />}
                        {!d.sortingComplete && <Clock className="size-4 text-gray-300" />}
                        {!d.preCleaned && <Clock className="size-4 text-gray-300" />}
                        {!d.disinfected && <Clock className="size-4 text-gray-300" />}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusPill label={d.status} tone={d.status === "Completed" ? "success" : d.status === "In Progress" ? "info" : "warning"} />
                    </td>
                    <td className="px-4 py-3 text-xs text-[var(--text-secondary,#6B778C)]">{d.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Cleaning & Washing */}
      {screen === "cleaning-washing" && (
        <div className="space-y-6">
          <PageHeader title="Cleaning & Washing" subtitle="Manual and ultrasonic cleaning stations" icon={Droplets} />

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <KPICard icon={Droplets} label="Ultrasonic Cleaners" value="2" sub="Both operational" tone="blue" />
            <KPICard icon={CheckCircle2} label="Completed Today" value="8" sub="Cleaning cycles" tone="green" />
            <KPICard icon={Clock} label="In Progress" value="1" sub="Ultrasonic #1" tone="amber" />
            <KPICard icon={AlertTriangle} label="Failed" value="0" sub="No failures" tone="green" />
          </div>

          <Section title="Cleaning Stations">
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { name: "Ultrasonic Cleaner #1", status: "Running", cycle: "15 min cycle — Orthopedic Set", temp: "40°C", timeLeft: "8 min" },
                { name: "Ultrasonic Cleaner #2", status: "Idle", cycle: "", temp: "22°C", timeLeft: "" },
                { name: "Manual Wash Station A", status: "Idle", cycle: "", temp: "—", timeLeft: "" },
                { name: "Manual Wash Station B", status: "Idle", cycle: "", temp: "—", timeLeft: "" },
              ].map((s, i) => (
                <div key={i} className={`rounded-xl border-2 p-4 ${s.status === "Running" ? "border-blue-200 bg-blue-50/50" : "border-gray-200 bg-gray-50/50"}`}>
                  <div className="flex items-start justify-between">
                    <div className="font-semibold text-[var(--text-primary,#172B4D)]">{s.name}</div>
                    <StatusPill label={s.status} tone={s.status === "Running" ? "info" : "neutral"} />
                  </div>
                  {s.cycle && <div className="mt-2 text-sm text-[var(--text-secondary,#6B778C)]">{s.cycle}</div>}
                  <div className="mt-3 flex gap-4 text-xs text-[var(--text-secondary,#6B778C)]">
                    <span>Temp: {s.temp}</span>
                    {s.timeLeft && <span>Time left: {s.timeLeft}</span>}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>
      )}

      {/* Instrument Inspection */}
      {screen === "instrument-inspection" && (
        <div className="space-y-6">
          <PageHeader title="Instrument Inspection" subtitle="Quality inspection before assembly" icon={ScanLine}
            actions={<Button size="sm"><Plus className="mr-1.5 size-4" />New Inspection</Button>} />

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <KPICard icon={CheckCircle2} label="Passed Today" value="6" tone="green" />
            <KPICard icon={AlertTriangle} label="Repair Required" value="1" tone="amber" />
            <KPICard icon={Clock} label="Pending" value="2" tone="blue" />
            <KPICard icon={Wrench} label="Failed" value="0" tone="red" />
          </div>

          <Section title="Inspection Queue">
            <div className="overflow-hidden rounded-xl border border-[var(--border,#DFE1E6)]">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs text-[var(--text-secondary,#6B778C)]">
                  <tr><th className="px-4 py-3 font-medium">Instrument</th><th className="px-4 py-3 font-medium">Category</th><th className="px-4 py-3 font-medium">Lifecycle</th><th className="px-4 py-3 font-medium">Condition</th><th className="px-4 py-3 font-medium">Result</th><th className="px-4 py-3 font-medium">Action</th></tr>
                </thead>
                <tbody className="divide-y divide-[var(--border,#DFE1E6)]">
                  {INSTRUMENTS.filter((i) => i.status !== "Retired" && i.status !== "In Use").slice(0, 6).map((inst) => (
                    <tr key={inst.id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 font-medium text-[var(--text-primary,#172B4D)]">{inst.name}</td>
                      <td className="px-4 py-3 text-[var(--text-secondary,#6B778C)]">{inst.category}</td>
                      <td className="px-4 py-3"><LifecycleBar current={inst.lifecycleCount} max={inst.maxCycles} /></td>
                      <td className="px-4 py-3"><StatusPill label={inst.condition} tone={inst.condition === "Excellent" || inst.condition === "Good" ? "success" : inst.condition === "Fair" ? "warning" : "danger"} /></td>
                      <td className="px-4 py-3"><StatusPill label="Pending" tone="info" /></td>
                      <td className="px-4 py-3"><Button size="sm" variant="outline">Inspect</Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        </div>
      )}

      {/* Tray Assembly */}
      {screen === "tray-assembly" && (
        <div className="space-y-6">
          <PageHeader title="Tray Assembly" subtitle="Assemble trays with verified instruments" icon={PackageCheck} />

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <KPICard icon={PackageCheck} label="Awaiting Assembly" value="1" sub="Urology Tray" tone="amber" />
            <KPICard icon={CheckCircle2} label="Assembled Today" value="3" tone="green" />
            <KPICard icon={Box} label="In Assembly" value="0" tone="blue" />
            <KPICard icon={AlertTriangle} label="Incomplete" value="1" sub="1 missing instrument" tone="red" />
          </div>

          <Section title="Assembly Queue">
            <div className="space-y-3">
              {TRAYS.filter((t) => t.status === "Awaiting Assembly" || t.status === "Assembled").map((tray) => (
                <div key={tray.id} className={`rounded-xl border-2 p-4 ${tray.status === "Awaiting Assembly" ? "border-amber-200 bg-amber-50/50" : "border-emerald-200 bg-emerald-50/50"}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold text-[var(--text-primary,#172B4D)]">{tray.name}</div>
                      <div className="text-sm text-[var(--text-secondary,#6B778C)]">{tray.procedureType} — {tray.instrumentCount} instruments expected</div>
                    </div>
                    <TrayStatusBadge status={tray.status} />
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-[var(--text-secondary,#6B778C)]">Actual: {tray.actualCount}/{tray.instrumentCount}</span>
                    <Button size="sm" variant="outline">{tray.status === "Awaiting Assembly" ? "Start Assembly" : "Complete"}</Button>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>
      )}

      {/* Packing & Labelling */}
      {screen === "packing-labelling" && (
        <div className="space-y-6">
          <PageHeader title="Packing & Labelling" subtitle="Pack and label trays for sterilization" icon={Tag} />

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <KPICard icon={Tag} label="Awaiting Packing" value="1" sub="Minor Surgery Tray" tone="amber" />
            <KPICard icon={CheckCircle2} label="Packed Today" value="2" tone="green" />
            <KPICard icon={Box} label="In Packing" value="0" tone="blue" />
            <KPICard icon={Printer} label="Labels Printed" value="2" tone="cyan" />
          </div>

          <Section title="Packing Queue">
            <div className="space-y-3">
              {TRAYS.filter((t) => t.status === "Packed" || t.status === "Assembled").slice(0, 3).map((tray) => (
                <div key={tray.id} className="rounded-xl border-2 border-gray-200 bg-gray-50/50 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold text-[var(--text-primary,#172B4D)]">{tray.name}</div>
                      <div className="text-sm text-[var(--text-secondary,#6B778C)]">{tray.instrumentCount} instruments — {tray.procedureType}</div>
                    </div>
                    <TrayStatusBadge status={tray.status} />
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" variant="outline"><Tag className="mr-1.5 size-3" />CSR Wrap</Button>
                    <Button size="sm" variant="outline"><Tag className="mr-1.5 size-3" />Peel Pouch</Button>
                    <Button size="sm" variant="outline"><Printer className="mr-1.5 size-3" />Print Label</Button>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>
      )}

      {/* Sterilization Cycles */}
      {screen === "sterilization-cycles" && (
        <div className="space-y-6">
          <PageHeader title="Sterilization Cycles" subtitle="Monitor and manage sterilization batches" icon={Thermometer}
            actions={<Button size="sm"><Plus className="mr-1.5 size-4" />New Cycle</Button>} />

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <KPICard icon={Thermometer} label="Running" value={CSSD_KPI.runningCycles} sub="Active cycles" tone="blue" />
            <KPICard icon={CheckCircle2} label="Completed" value={CSSD_KPI.completedCycles} sub="Today" tone="green" />
            <KPICard icon={AlertTriangle} label="Failed" value={CSSD_KPI.failedCycles} sub="Requires review" tone="red" />
            <KPICard icon={Clock} label="Avg Cycle" value="52 min" sub="Steam sterilization" tone="cyan" />
          </div>

          <Section title="Cycle History">
            <div className="overflow-hidden rounded-xl border border-[var(--border,#DFE1E6)]">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs text-[var(--text-secondary,#6B778C)]">
                  <tr>
                    <th className="px-4 py-3 font-medium">Cycle ID</th>
                    <th className="px-4 py-3 font-medium">Batch</th>
                    <th className="px-4 py-3 font-medium">Autoclave</th>
                    <th className="px-4 py-3 font-medium">Type</th>
                    <th className="px-4 py-3 font-medium">Load</th>
                    <th className="px-4 py-3 font-medium">Bio</th>
                    <th className="px-4 py-3 font-medium">Chem</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border,#DFE1E6)]">
                  {CYCLES.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 font-medium text-[#0052CC]">{c.id}</td>
                      <td className="px-4 py-3 text-[var(--text-secondary,#6B778C)]">{c.batchNumber}</td>
                      <td className="px-4 py-3 font-medium text-[var(--text-primary,#172B4D)]">{c.autoclaveName}</td>
                      <td className="px-4 py-3 text-[var(--text-secondary,#6B778C)]">{c.type}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary,#6B778C)]">{c.loadDetails}</td>
                      <td className="px-4 py-3">
                        {c.biologicalIndicator && <StatusPill label={c.biologicalIndicator} tone={c.biologicalIndicator === "Pass" ? "success" : "danger"} />}
                      </td>
                      <td className="px-4 py-3">
                        {c.chemicalIndicator && <StatusPill label={c.chemicalIndicator} tone={c.chemicalIndicator === "Pass" ? "success" : "danger"} />}
                      </td>
                      <td className="px-4 py-3"><CycleStatusBadge status={c.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        </div>
      )}

      {/* Autoclave Monitoring */}
      {screen === "autoclave-monitoring" && (
        <div className="space-y-6">
          <PageHeader title="Autoclave Monitoring" subtitle="Real-time autoclave status and cycle tracking" icon={Monitor} />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {AUTOCLAVES.map((a) => (
              <AutoclaveWidget key={a.id} autoclave={a} />
            ))}
          </div>

          <Section title="Autoclave Details">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                {AUTOCLAVES.filter((a) => a.status === "Running").map((a) => (
                  <div key={a.id} className="rounded-xl border border-blue-200 bg-blue-50/50 p-4">
                    <div className="flex items-start justify-between">
                      <div className="font-semibold text-[var(--text-primary,#172B4D)]">{a.name} — {a.model}</div>
                      <AutoclaveStatusBadge status={a.status} />
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="rounded bg-white p-2"><div className="text-[var(--text-secondary,#6B778C)]">Temp</div><div className="font-bold text-[var(--text-primary,#172B4D)]">{a.temperature}°C</div></div>
                      <div className="rounded bg-white p-2"><div className="text-[var(--text-secondary,#6B778C)]">Pressure</div><div className="font-bold text-[var(--text-primary,#172B4D)]">{a.pressure} bar</div></div>
                      <div className="rounded bg-white p-2"><div className="text-[var(--text-secondary,#6B778C)]">Remaining</div><div className="font-bold text-[var(--text-primary,#172B4D)]">{a.cycleTimeRemaining}m</div></div>
                    </div>
                    {a.currentCycle && <div className="mt-2 text-sm text-[var(--text-secondary,#6B778C)]">{a.currentCycle}</div>}
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                {AUTOCLAVES.filter((a) => a.status !== "Running").map((a) => (
                  <div key={a.id} className={`rounded-xl border p-4 ${a.status === "Error" || a.status === "Maintenance" ? "border-red-200 bg-red-50/50" : "border-gray-200 bg-gray-50/50"}`}>
                    <div className="flex items-start justify-between">
                      <div className="font-semibold text-[var(--text-primary,#172B4D)]">{a.name} — {a.model}</div>
                      <AutoclaveStatusBadge status={a.status} />
                    </div>
                    {a.error && <div className="mt-2 text-sm font-medium text-red-600">{a.error}</div>}
                    <div className="mt-2 text-xs text-[var(--text-secondary,#6B778C)]">Manufacturer: {a.manufacturer}</div>
                    <div className="text-xs text-[var(--text-secondary,#6B778C)]">Last Maintenance: {a.lastMaintenance}</div>
                  </div>
                ))}
              </div>
            </div>
          </Section>
        </div>
      )}

      {/* Quality Control */}
      {screen === "quality-control" && (
        <div className="space-y-6">
          <PageHeader title="Quality Control" subtitle="Sterilization quality assurance and testing" icon={ShieldCheck}
            actions={<Button size="sm"><Plus className="mr-1.5 size-4" />New Test</Button>} />

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <KPICard icon={ShieldCheck} label="Tests Today" value={QUALITY_RECORDS.length} tone="blue" />
            <KPICard icon={CheckCircle2} label="Passed" value={QUALITY_RECORDS.filter((q) => q.result === "Pass").length} tone="green" />
            <KPICard icon={AlertTriangle} label="Failed" value={QUALITY_RECORDS.filter((q) => q.result === "Fail").length} tone="red" />
            <KPICard icon={Clock} label="Pending" value={QUALITY_RECORDS.filter((q) => q.result === "Pending").length} tone="amber" />
          </div>

          <Section title="Quality Records">
            <div className="overflow-hidden rounded-xl border border-[var(--border,#DFE1E6)]">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs text-[var(--text-secondary,#6B778C)]">
                  <tr><th className="px-4 py-3 font-medium">ID</th><th className="px-4 py-3 font-medium">Type</th><th className="px-4 py-3 font-medium">Autoclave</th><th className="px-4 py-3 font-medium">Batch</th><th className="px-4 py-3 font-medium">Result</th><th className="px-4 py-3 font-medium">Notes</th></tr>
                </thead>
                <tbody className="divide-y divide-[var(--border,#DFE1E6)]">
                  {QUALITY_RECORDS.map((q) => (
                    <tr key={q.id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 font-medium text-[#0052CC]">{q.id}</td>
                      <td className="px-4 py-3 font-medium text-[var(--text-primary,#172B4D)]">{q.type}</td>
                      <td className="px-4 py-3 text-[var(--text-secondary,#6B778C)]">{q.autoclaveName}</td>
                      <td className="px-4 py-3 text-[var(--text-secondary,#6B778C)]">{q.batchNumber}</td>
                      <td className="px-4 py-3"><StatusPill label={q.result} tone={q.result === "Pass" ? "success" : q.result === "Fail" ? "danger" : "warning"} /></td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary,#6B778C)] max-w-xs truncate">{q.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        </div>
      )}

      {/* Storage & Distribution */}
      {screen === "storage-distribution" && (
        <div className="space-y-6">
          <PageHeader title="Storage & Distribution" subtitle="Sterile storage and dispatch tracking" icon={Warehouse} />

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <KPICard icon={Warehouse} label="Sterile Store" value="4" sub="Trays ready" tone="green" />
            <KPICard icon={Box} label="Total Capacity" value="120" sub="Tray slots" tone="blue" />
            <KPICard icon={ArrowLeftRight} label="Dispatched Today" value="3" tone="cyan" />
            <KPICard icon={Clock} label="Awaiting Pickup" value="1" tone="amber" />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Section title="Sterile Store A">
              <div className="space-y-2">
                {TRAYS.filter((t) => t.location.includes("Store A")).map((t) => (
                  <div key={t.id} className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50/50 px-4 py-3">
                    <div>
                      <div className="font-medium text-[var(--text-primary,#172B4D)]">{t.name}</div>
                      <div className="text-xs text-[var(--text-secondary,#6B778C)]">{t.location} — Exp: {t.expiryDate}</div>
                    </div>
                    <SterilityBadge status={t.sterilityStatus} />
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Sterile Store B">
              <div className="space-y-2">
                {TRAYS.filter((t) => t.location.includes("Store B")).map((t) => (
                  <div key={t.id} className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50/50 px-4 py-3">
                    <div>
                      <div className="font-medium text-[var(--text-primary,#172B4D)]">{t.name}</div>
                      <div className="text-xs text-[var(--text-secondary,#6B778C)]">{t.location} — Exp: {t.expiryDate}</div>
                    </div>
                    <SterilityBadge status={t.sterilityStatus} />
                  </div>
                ))}
              </div>
            </Section>
          </div>
        </div>
      )}

      {/* Maintenance */}
      {screen === "maintenance" && (
        <div className="space-y-6">
          <PageHeader title="Maintenance" subtitle="Equipment maintenance scheduling and tracking" icon={Settings}
            actions={<Button size="sm"><Plus className="mr-1.5 size-4" />Schedule Maintenance</Button>} />

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <KPICard icon={Settings} label="Scheduled" value={MAINTENANCE.filter((m) => m.status === "Scheduled").length} tone="blue" />
            <KPICard icon={CheckCircle2} label="Completed" value={MAINTENANCE.filter((m) => m.status === "Completed").length} tone="green" />
            <KPICard icon={Clock} label="In Progress" value={MAINTENANCE.filter((m) => m.status === "In Progress").length} tone="amber" />
            <KPICard icon={AlertTriangle} label="Overdue" value={MAINTENANCE.filter((m) => m.status === "Overdue").length} tone="red" />
          </div>

          <Section title="Maintenance Records">
            <div className="overflow-hidden rounded-xl border border-[var(--border,#DFE1E6)]">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs text-[var(--text-secondary,#6B778C)]">
                  <tr><th className="px-4 py-3 font-medium">ID</th><th className="px-4 py-3 font-medium">Equipment</th><th className="px-4 py-3 font-medium">Type</th><th className="px-4 py-3 font-medium">Description</th><th className="px-4 py-3 font-medium">Scheduled</th><th className="px-4 py-3 font-medium">Cost</th><th className="px-4 py-3 font-medium">Status</th></tr>
                </thead>
                <tbody className="divide-y divide-[var(--border,#DFE1E6)]">
                  {MAINTENANCE.map((m) => (
                    <tr key={m.id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 font-medium text-[#0052CC]">{m.id}</td>
                      <td className="px-4 py-3 font-medium text-[var(--text-primary,#172B4D)]">{m.equipmentName}</td>
                      <td className="px-4 py-3"><StatusPill label={m.type} tone="info" /></td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary,#6B778C)] max-w-xs truncate">{m.description}</td>
                      <td className="px-4 py-3 text-[var(--text-secondary,#6B778C)]">{m.scheduledDate}</td>
                      <td className="px-4 py-3 font-medium text-[var(--text-primary,#172B4D)]">{formatCurrency(m.cost)}</td>
                      <td className="px-4 py-3"><StatusPill label={m.status} tone={m.status === "Completed" ? "success" : m.status === "Overdue" ? "danger" : m.status === "In Progress" ? "info" : "warning"} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        </div>
      )}

      {/* Inventory Integration */}
      {screen === "inventory-integration" && (
        <div className="space-y-6">
          <PageHeader title="Inventory Integration" subtitle="CSSD inventory and supply chain integration" icon={Package} />

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <KPICard icon={Package} label="Consumables" value="24" sub="Items tracked" tone="blue" />
            <KPICard icon={AlertTriangle} label="Low Stock" value="3" tone="amber" />
            <KPICard icon={CheckCircle2} label="Reorders Sent" value="1" tone="green" />
            <KPICard icon={Clock} label="Pending Receipt" value="2" tone="cyan" />
          </div>

          <Section title="Consumables Stock">
            <div className="overflow-hidden rounded-xl border border-[var(--border,#DFE1E6)]">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs text-[var(--text-secondary,#6B778C)]">
                  <tr><th className="px-4 py-3 font-medium">Item</th><th className="px-4 py-3 font-medium">Category</th><th className="px-4 py-3 font-medium">Stock</th><th className="px-4 py-3 font-medium">Min</th><th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3 font-medium">Action</th></tr>
                </thead>
                <tbody className="divide-y divide-[var(--border,#DFE1E6)]">
                  {[
                    { name: "CSR Wrap Rolls", cat: "Packaging", stock: 45, min: 20, status: "OK" },
                    { name: "Chemical Indicators", cat: "Quality", stock: 8, min: 10, status: "Low" },
                    { name: "Biological Indicators", cat: "Quality", stock: 12, min: 5, status: "OK" },
                    { name: "Peel Pouches (Large)", cat: "Packaging", stock: 3, min: 15, status: "Critical" },
                    { name: "Autoclave Tape", cat: "Packaging", stock: 22, min: 10, status: "OK" },
                    { name: "Enzymatic Cleaner", cat: "Cleaning", stock: 6, min: 8, status: "Low" },
                  ].map((item, i) => (
                    <tr key={i} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 font-medium text-[var(--text-primary,#172B4D)]">{item.name}</td>
                      <td className="px-4 py-3 text-[var(--text-secondary,#6B778C)]">{item.cat}</td>
                      <td className="px-4 py-3 font-medium text-[var(--text-primary,#172B4D)]">{item.stock}</td>
                      <td className="px-4 py-3 text-[var(--text-secondary,#6B778C)]">{item.min}</td>
                      <td className="px-4 py-3"><StatusPill label={item.status} tone={item.status === "OK" ? "success" : item.status === "Low" ? "warning" : "danger"} /></td>
                      <td className="px-4 py-3">{item.status !== "OK" && <Button size="sm" variant="outline">Reorder</Button>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        </div>
      )}

      {/* Reports & Analytics */}
      {screen === "reports-analytics" && (
        <div className="space-y-6">
          <PageHeader title="Reports & Analytics" subtitle="CSSD performance metrics and reporting" icon={BarChart3}
            actions={<><Button variant="outline" size="sm"><Download className="mr-1.5 size-4" />Export Report</Button></>} />

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <KPICard icon={Thermometer} label="Sterilization Compliance" value={`${CSSD_KPI.sterilizationCompliance}%`} tone="green" trend="up" trendValue="+0.5%" />
            <KPICard icon={Wrench} label="Instrument Utilization" value={`${CSSD_KPI.instrumentUtilization}%`} tone="blue" />
            <KPICard icon={Box} label="Tray Utilization" value={`${CSSD_KPI.trayUtilization}%`} tone="cyan" />
            <KPICard icon={Clock} label="Avg Turnaround" value={`${CSSD_KPI.avgTurnaroundTime}h`} tone="purple" />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Section title="Cycles by Type">
              <div className="space-y-3">
                {[
                  { type: "Steam", count: 4, pct: 67 },
                  { type: "Plasma", count: 1, pct: 17 },
                  { type: "ETO", count: 0, pct: 0 },
                  { type: "Dry Heat", count: 1, pct: 16 },
                ].map((t) => (
                  <div key={t.type}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[var(--text-primary,#172B4D)]">{t.type}</span>
                      <span className="text-[var(--text-secondary,#6B778C)]">{t.count} cycles ({t.pct}%)</span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-gray-200">
                      <div className="h-full rounded-full bg-[#0052CC]" style={{ width: `${t.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Instrument Status Distribution">
              <div className="space-y-3">
                {[
                  { status: "Available", count: 5, color: "bg-emerald-500" },
                  { status: "In Use", count: 2, color: "bg-blue-500" },
                  { status: "In Sterilization", count: 2, color: "bg-blue-400" },
                  { status: "Under Maintenance", count: 1, color: "bg-amber-500" },
                  { status: "Quarantined", count: 1, color: "bg-red-500" },
                  { status: "Retired", count: 1, color: "bg-gray-400" },
                ].map((s) => (
                  <div key={s.status}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[var(--text-primary,#172B4D)]">{s.status}</span>
                      <span className="text-[var(--text-secondary,#6B778C)]">{s.count}</span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-gray-200">
                      <div className={`h-full rounded-full ${s.color}`} style={{ width: `${(s.count / 12) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          </div>
        </div>
      )}

      {/* Audit & Compliance */}
      {screen === "audit-compliance" && (
        <div className="space-y-6">
          <PageHeader title="Audit & Compliance" subtitle="Regulatory compliance and audit trail" icon={ClipboardCheck}
            actions={<><Button variant="outline" size="sm"><Download className="mr-1.5 size-4" />Export Audit Log</Button></>} />

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <KPICard icon={ClipboardCheck} label="Total Events" value={AUDIT_LOGS.length} tone="blue" />
            <KPICard icon={Info} label="Info" value={AUDIT_LOGS.filter((a) => a.severity === "Info").length} tone="green" />
            <KPICard icon={AlertTriangle} label="Warnings" value={AUDIT_LOGS.filter((a) => a.severity === "Warning").length} tone="amber" />
            <KPICard icon={AlertTriangle} label="Critical" value={AUDIT_LOGS.filter((a) => a.severity === "Critical").length} tone="red" />
          </div>

          <Section title="Audit Log">
            <div className="overflow-hidden rounded-xl border border-[var(--border,#DFE1E6)]">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs text-[var(--text-secondary,#6B778C)]">
                  <tr><th className="px-4 py-3 font-medium">Timestamp</th><th className="px-4 py-3 font-medium">User</th><th className="px-4 py-3 font-medium">Action</th><th className="px-4 py-3 font-medium">Resource</th><th className="px-4 py-3 font-medium">Details</th><th className="px-4 py-3 font-medium">Severity</th></tr>
                </thead>
                <tbody className="divide-y divide-[var(--border,#DFE1E6)]">
                  {AUDIT_LOGS.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary,#6B778C)]">{log.timestamp}</td>
                      <td className="px-4 py-3 font-medium text-[var(--text-primary,#172B4D)]">{log.user}</td>
                      <td className="px-4 py-3 text-[var(--text-secondary,#6B778C)]">{log.action}</td>
                      <td className="px-4 py-3 font-medium text-[#0052CC]">{log.resource}</td>
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

      {/* Workflow Complete */}
      {screen === "workflow-complete" && (
        <div className="space-y-6">
          <PageHeader title="Workflow Complete" subtitle="All CSSD processes completed successfully" icon={CheckCircle2} />
          <div className="flex flex-col items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50/50 py-16 text-center">
            <div className="grid size-16 place-items-center rounded-full bg-emerald-100"><CheckCircle2 className="size-8 text-emerald-600" /></div>
            <h2 className="mt-4 text-xl font-bold text-[var(--text-primary,#172B4D)]">All Processes Complete</h2>
            <p className="mt-2 max-w-md text-sm text-[var(--text-secondary,#6B778C)]">
              All sterilization cycles, decontamination processes, quality checks, and maintenance tasks have been completed and logged.
            </p>
            <div className="mt-6 flex gap-3">
              <Button variant="outline"><Download className="mr-1.5 size-4" />Download Summary</Button>
              <Button onClick={() => setScreen("cssd-dashboard")}>Return to Dashboard</Button>
            </div>
          </div>
        </div>
      )}

    </Shell>
  );
}
