import { useState, useMemo } from "react";
import {
  LayoutDashboard, UserPlus, ClipboardList, Calendar, Monitor, Stethoscope,
  Activity, Pill, TestTube, BarChart3, AlertTriangle, ClipboardCheck,
  Heart, Settings, Package, FileText, ShieldCheck, CheckCircle2,
  ChevronRight, Download, Filter, Plus, RefreshCw, Eye, Edit3, Search,
  Clock, Droplets, Thermometer, AlertCircle, Info, Bell, X, Check, Wrench,
} from "lucide-react";
import { Shell, type Workspace } from "../his/Shell";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  DIALYSIS_PATIENTS, MACHINES, TREATMENT_PLANS, APPOINTMENTS,
  TREATMENT_SESSIONS, PRE_DIALYSIS_ASSESSMENTS, MEDICATION_RECORDS,
  LAB_RESULTS, VASCULAR_ACCESSES, MACHINE_MAINTENANCE, CONSUMABLES,
  WATER_QUALITY, QUALITY_RECORDS, AUDIT_LOGS, DIALYSIS_KPI,
  machineStatusTone, treatmentStatusTone, accessStatusTone,
  appointmentStatusTone, enrollmentStatusTone, maintenanceStatusTone,
  waterQualityTone, formatCurrency,
  type DialysisPatient, type DialysisMachine, type TreatmentPlan,
  type Appointment, type TreatmentSession,
} from "./data";
import {
  PageHeader, Section, KPICard, StatusPill, MachineStatusBadge,
  ChairStatusBadge, TreatmentStatusBadge, AccessStatusBadge,
  AppointmentStatusBadge, EnrollmentStatusBadge, MachineCard,
  PatientCard, VitalsWidget, TreatmentTimeline, LabResultCard,
  AdequacyGauge,
} from "./dialysisUi";

type DsRoute =
  | "ds-dashboard" | "patient-enrollment" | "treatment-plan"
  | "appointment-scheduling" | "machine-chair" | "pre-dialysis"
  | "treatment-monitoring" | "medication-admin" | "laboratory-results"
  | "dialysis-adequacy" | "complication-management" | "post-dialysis"
  | "vascular-access" | "machine-maintenance" | "consumables-inventory"
  | "reports-analytics" | "quality-compliance" | "workflow-complete";

const NAV = [
  { id: "ds-dashboard", label: "DS Dashboard", icon: LayoutDashboard },
  { id: "patient-enrollment", label: "Patient Enrollment", icon: UserPlus },
  { id: "treatment-plan", label: "Treatment Plans", icon: ClipboardList },
  { id: "appointment-scheduling", label: "Scheduling", icon: Calendar },
  { id: "machine-chair", label: "Machine & Chairs", icon: Monitor },
  { id: "pre-dialysis", label: "Pre-Dialysis", icon: Stethoscope },
  { id: "treatment-monitoring", label: "Treatment Monitoring", icon: Activity, badge: "1", tone: "info" as const },
  { id: "medication-admin", label: "Medications", icon: Pill },
  { id: "laboratory-results", label: "Lab Results", icon: TestTube },
];

const NAV_SECONDARY = [
  { id: "dialysis-adequacy", label: "Adequacy", icon: BarChart3 },
  { id: "complication-management", label: "Complications", icon: AlertTriangle },
  { id: "post-dialysis", label: "Post-Dialysis", icon: ClipboardCheck },
  { id: "vascular-access", label: "Vascular Access", icon: Heart },
  { id: "machine-maintenance", label: "Machine Maintenance", icon: Settings },
  { id: "consumables-inventory", label: "Consumables", icon: Package },
  { id: "reports-analytics", label: "Reports & Analytics", icon: BarChart3 },
  { id: "quality-compliance", label: "Quality & Compliance", icon: ShieldCheck },
  { id: "workflow-complete", label: "Workflow Complete", icon: CheckCircle2 },
];

export function DialysisApp({ roleName, onSignOut, onSwitchWorkspace, onOpenSettings }: {
  roleName: string; onSignOut: () => void; onSwitchWorkspace: (w: Workspace) => void; onOpenSettings?: (page: string) => void;
}) {
  const [screen, setScreen] = useState<DsRoute>("ds-dashboard");
  const [selectedPatient, setSelectedPatient] = useState<DialysisPatient | null>(null);
  const [selectedMachine, setSelectedMachine] = useState<DialysisMachine | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<TreatmentPlan | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const breadcrumb = useMemo(() => {
    const crumb = ["Dialysis"];
    const nav = [...NAV, ...NAV_SECONDARY].find((n) => n.id === screen);
    if (nav) crumb.push(nav.label);
    if (selectedPatient && screen === "patient-enrollment") crumb.splice(2, 0, selectedPatient.name);
    if (selectedMachine && screen === "machine-chair") crumb.splice(2, 0, selectedMachine.name);
    return crumb;
  }, [screen, selectedPatient, selectedMachine]);

  const filteredPatients = DIALYSIS_PATIENTS.filter((p) =>
    !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.diagnosis.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Shell
      nav={NAV}
      navSecondary={NAV_SECONDARY}
      sectionLabel="Dialysis Center"
      activeId={screen}
      isActive={(id) => id === screen}
      onNavigate={(id) => { setScreen(id as DsRoute); setSelectedPatient(null); setSelectedMachine(null); setSelectedPlan(null); }}
      breadcrumb={breadcrumb}
      roleName={roleName}
      onSignOut={onSignOut}
      workspace="dialysis"
      onSwitchWorkspace={onSwitchWorkspace}
      onOpenSettings={onOpenSettings}
      searchPlaceholder="Search patients, machines, treatments…"
    >
      {/* ── 01 Dashboard ────────────────────────────────────────────────── */}
      {screen === "ds-dashboard" && (
        <div className="space-y-6">
          <PageHeader title="Dialysis Dashboard" subtitle="Renal care operations overview" icon={LayoutDashboard}
            actions={<><Button variant="outline" size="sm"><RefreshCw className="mr-1.5 size-4" />Refresh</Button><Button variant="outline" size="sm"><Download className="mr-1.5 size-4" />Export</Button></>} />

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <KPICard icon={Activity} label="Today's Sessions" value={DIALYSIS_KPI.todaySessions} sub={`${DIALYSIS_KPI.completedToday} completed · ${DIALYSIS_KPI.activeTreatments} active`} tone="blue" />
            <KPICard icon={Monitor} label="Available Machines" value={`${DIALYSIS_KPI.availableMachines}/${DIALYSIS_KPI.totalMachines}`} tone="green" />
            <KPICard icon={Droplets} label="Available Chairs" value={`${DIALYSIS_KPI.availableChairs}/${DIALYSIS_KPI.totalChairs}`} tone="cyan" />
            <KPICard icon={AlertTriangle} label="Missed Today" value={DIALYSIS_KPI.missedToday} tone={DIALYSIS_KPI.missedToday > 0 ? "red" : "green"} />
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <KPICard icon={BarChart3} label="Avg Kt/V" value={DIALYSIS_KPI.avgKtV} sub="Target: ≥1.4" tone={DIALYSIS_KPI.avgKtV >= 1.4 ? "green" : "amber"} />
            <KPICard icon={BarChart3} label="Avg URR" value={`${DIALYSIS_KPI.avgURR}%`} sub="Target: ≥65%" tone={DIALYSIS_KPI.avgURR >= 65 ? "green" : "amber"} />
            <KPICard icon={Heart} label="Complication Rate" value={`${DIALYSIS_KPI.complicationRate}%`} tone={DIALYSIS_KPI.complicationRate > 5 ? "red" : "green"} />
            <KPICard icon={ShieldCheck} label="Water Quality" value={`${DIALYSIS_KPI.waterQualityCompliance}%`} tone="green" trend="up" trendValue="+0.3%" />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Section title="Active Treatments" actions={<Button variant="outline" size="sm" onClick={() => setScreen("treatment-monitoring")}>View All</Button>}>
              <div className="space-y-3">
                {TREATMENT_SESSIONS.filter((s) => s.status === "In Progress").map((s) => {
                  const patient = DIALYSIS_PATIENTS.find((p) => p.id === s.patientId);
                  const machine = MACHINES.find((m) => m.id === s.machineId);
                  return (
                    <div key={s.id} className="rounded-xl border-2 border-blue-200 bg-blue-50/50 p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-semibold text-[var(--text-primary,#172B4D)]">{s.patientName}</div>
                          <div className="text-sm text-[var(--text-secondary,#6B778C)]">{machine?.name} · {s.chairId} · Started: {s.startTime}</div>
                        </div>
                        <TreatmentStatusBadge status={s.status} />
                      </div>
                      <div className="mt-3 grid grid-cols-4 gap-2 text-center text-xs">
                        <div className="rounded bg-white p-1.5"><div className="text-[var(--text-secondary,#6B778C)]">Pre Wt</div><div className="font-bold text-[var(--text-primary,#172B4D)]">{s.preWeight}kg</div></div>
                        <div className="rounded bg-white p-1.5"><div className="text-[var(--text-secondary,#6B778C)]">UF</div><div className="font-bold text-[var(--text-primary,#172B4D)]">{s.ultrafiltration}L</div></div>
                        <div className="rounded bg-white p-1.5"><div className="text-[var(--text-secondary,#6B778C)]">Qb</div><div className="font-bold text-[var(--text-primary,#172B4D)]">{s.bloodFlowRate}</div></div>
                        <div className="rounded bg-white p-1.5"><div className="text-[var(--text-secondary,#6B778C)]">VP</div><div className="font-bold text-[var(--text-primary,#172B4D)]">{s.venousPressure}</div></div>
                      </div>
                    </div>
                  );
                })}
                {TREATMENT_SESSIONS.filter((s) => s.status === "In Progress").length === 0 && (
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-center text-sm text-[var(--text-secondary,#6B778C)]">No active treatments</div>
                )}
              </div>
            </Section>

            <Section title="Machine Overview">
              <div className="grid grid-cols-4 gap-2">
                {MACHINES.slice(0, 8).map((m) => (
                  <div key={m.id} className={`rounded-lg border-2 p-2 text-center ${m.status === "Available" ? "border-emerald-200 bg-emerald-50" : m.status === "In Use" ? "border-blue-200 bg-blue-50" : m.status === "Maintenance" || m.status === "Out of Service" ? "border-red-200 bg-red-50" : "border-amber-200 bg-amber-50"}`}>
                    <div className="text-[10px] font-medium text-[var(--text-primary,#172B4D)]">{m.id}</div>
                    <div className={`mt-1 text-xs font-bold ${m.status === "Available" ? "text-emerald-600" : m.status === "In Use" ? "text-blue-600" : "text-red-600"}`}>{m.status === "In Use" ? "IN USE" : m.status === "Available" ? "READY" : m.status === "Maintenance" ? "MAINT" : m.status === "Out of Service" ? "OOS" : "CLEAN"}</div>
                    {m.currentPatient && <div className="mt-0.5 text-[9px] text-blue-600">{m.currentPatient}</div>}
                  </div>
                ))}
              </div>
            </Section>
          </div>

          <Section title="Today's Schedule">
            <div className="overflow-hidden rounded-xl border border-[var(--border,#DFE1E6)]">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs text-[var(--text-secondary,#6B778C)]">
                  <tr><th className="px-4 py-3 font-medium">Time</th><th className="px-4 py-3 font-medium">Patient</th><th className="px-4 py-3 font-medium">Type</th><th className="px-4 py-3 font-medium">Machine</th><th className="px-4 py-3 font-medium">Chair</th><th className="px-4 py-3 font-medium">Nephrologist</th><th className="px-4 py-3 font-medium">Status</th></tr>
                </thead>
                <tbody className="divide-y divide-[var(--border,#DFE1E6)]">
                  {APPOINTMENTS.filter((a) => a.date === "2026-07-24").map((a) => (
                    <tr key={a.id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 font-medium text-[var(--text-primary,#172B4D)]">{a.time}</td>
                      <td className="px-4 py-3 font-medium text-[var(--text-primary,#172B4D)]">{a.patientName}</td>
                      <td className="px-4 py-3 text-[var(--text-secondary,#6B778C)]">{a.type}</td>
                      <td className="px-4 py-3 text-[var(--text-secondary,#6B778C)]">{a.machineId}</td>
                      <td className="px-4 py-3 text-[var(--text-secondary,#6B778C)]">{a.chairId}</td>
                      <td className="px-4 py-3 text-[var(--text-secondary,#6B778C)]">{a.nephrologist}</td>
                      <td className="px-4 py-3"><AppointmentStatusBadge status={a.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        </div>
      )}

      {/* ── 02 Patient Enrollment ────────────────────────────────────────── */}
      {screen === "patient-enrollment" && !selectedPatient && (
        <div className="space-y-6">
          <PageHeader title="Patient Enrollment" subtitle={`${DIALYSIS_PATIENTS.length} patients enrolled`} icon={UserPlus}
            actions={<><Button variant="outline" size="sm"><Download className="mr-1.5 size-4" />Export</Button><Button size="sm"><Plus className="mr-1.5 size-4" />Enroll Patient</Button></>} />

          <div className="flex items-center gap-3">
            <div className="relative flex-1"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--text-secondary,#6B778C)]" /><Input className="pl-9" placeholder="Search patients…" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div>
            <Button variant="outline" size="sm"><Filter className="mr-1.5 size-4" />Filter</Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPatients.map((p) => <PatientCard key={p.id} patient={p} onClick={() => setSelectedPatient(p)} />)}
          </div>
        </div>
      )}

      {screen === "patient-enrollment" && selectedPatient && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setSelectedPatient(null)}><ChevronRight className="size-4 rotate-180" />Back</Button>
            <PageHeader title={selectedPatient.name} subtitle={selectedPatient.id} icon={UserPlus}
              actions={<><Button variant="outline" size="sm"><Edit3 className="mr-1.5 size-4" />Edit</Button><Button variant="outline" size="sm"><FileText className="mr-1.5 size-4" />Prescription</Button></>} />
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <Section title="Patient Details">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-[var(--text-secondary,#6B778C)]">UHID:</span> <span className="ml-2 font-medium text-[var(--text-primary,#172B4D)]">{selectedPatient.uhid}</span></div>
                  <div><span className="text-[var(--text-secondary,#6B778C)]">Age/Gender:</span> <span className="ml-2 font-medium text-[var(--text-primary,#172B4D)]">{selectedPatient.age} / {selectedPatient.gender}</span></div>
                  <div><span className="text-[var(--text-secondary,#6B778C)]">Blood Group:</span> <span className="ml-2 font-medium text-[var(--text-primary,#172B4D)]">{selectedPatient.bloodGroup}</span></div>
                  <div><span className="text-[var(--text-secondary,#6B778C)]">Phone:</span> <span className="ml-2 font-medium text-[var(--text-primary,#172B4D)]">{selectedPatient.phone}</span></div>
                  <div><span className="text-[var(--text-secondary,#6B778C)]">Diagnosis:</span> <span className="ml-2 font-medium text-[var(--text-primary,#172B4D)]">{selectedPatient.diagnosis}</span></div>
                  <div><span className="text-[var(--text-secondary,#6B778C)]">Nephrologist:</span> <span className="ml-2 font-medium text-[var(--text-primary,#172B4D)]">{selectedPatient.primaryNephrologist}</span></div>
                  <div><span className="text-[var(--text-secondary,#6B778C)]">Dialysis Type:</span> <span className="ml-2 font-medium text-[var(--text-primary,#172B4D)]">{selectedPatient.dialysisType}</span></div>
                  <div><span className="text-[var(--text-secondary,#6B778C)]">Enrolled:</span> <span className="ml-2 font-medium text-[var(--text-primary,#172B4D)]">{selectedPatient.enrollmentDate}</span></div>
                  <div><span className="text-[var(--text-secondary,#6B778C)]">Access:</span> <span className="ml-2 font-medium text-[var(--text-primary,#172B4D)]">{selectedPatient.accessType} — {selectedPatient.accessSite}</span></div>
                  <div><span className="text-[var(--text-secondary,#6B778C)]">Insurance:</span> <span className="ml-2 font-medium text-[var(--text-primary,#172B4D)]">{selectedPatient.insuranceProvider}</span></div>
                  <div className="col-span-2"><span className="text-[var(--text-secondary,#6B778C)]">Comorbidities:</span> <span className="ml-2 font-medium text-[var(--text-primary,#172B4D)]">{selectedPatient.comorbidities.join(", ")}</span></div>
                </div>
              </Section>
            </div>
            <div className="space-y-4">
              <Section title="Status"><div className="space-y-3">
                <div className="flex items-center justify-between"><span className="text-sm text-[var(--text-secondary,#6B778C)]">Enrollment</span><EnrollmentStatusBadge status={selectedPatient.status} /></div>
                <div className="flex items-center justify-between"><span className="text-sm text-[var(--text-secondary,#6B778C)]">Total Sessions</span><span className="font-medium text-[var(--text-primary,#172B4D)]">{selectedPatient.totalSessions}</span></div>
                <div className="flex items-center justify-between"><span className="text-sm text-[var(--text-secondary,#6B778C)]">Missed</span><span className="font-medium text-[var(--text-primary,#172B4D)]">{selectedPatient.missedSessions}</span></div>
                <div className="flex items-center justify-between"><span className="text-sm text-[var(--text-secondary,#6B778C)]">Dry Weight</span><span className="font-medium text-[var(--text-primary,#172B4D)]">{selectedPatient.dryWeight} kg</span></div>
                <div className="flex items-center justify-between"><span className="text-sm text-[var(--text-secondary,#6B778C)]">Current Weight</span><span className="font-medium text-[var(--text-primary,#172B4D)]">{selectedPatient.currentWeight} kg</span></div>
              </div></Section>
            </div>
          </div>
        </div>
      )}

      {/* ── 03 Treatment Plan ────────────────────────────────────────────── */}
      {screen === "treatment-plan" && (
        <div className="space-y-6">
          <PageHeader title="Treatment Plans" subtitle="Dialysis prescriptions and protocols" icon={ClipboardList}
            actions={<Button size="sm"><Plus className="mr-1.5 size-4" />New Plan</Button>} />

          <div className="space-y-4">
            {TREATMENT_PLANS.map((plan) => (
              <div key={plan.id} className="rounded-xl border border-[var(--border,#DFE1E6)] bg-white p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold text-[var(--text-primary,#172B4D)]">{plan.patientName} — {plan.id}</div>
                    <div className="text-sm text-[var(--text-secondary,#6B778C)]">{plan.dialysisType} · {plan.frequency} · {plan.sessionDuration} min</div>
                  </div>
                  <StatusPill label={plan.status} tone="success" />
                </div>

                <div className="mt-4 grid gap-4 lg:grid-cols-3">
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm">
                    <div className="font-medium text-[var(--text-primary,#172B4D)]">Dialysis Parameters</div>
                    <div className="mt-2 space-y-1 text-[var(--text-secondary,#6B778C)]">
                      <div>Dialyzer: {plan.dialyzerType}</div>
                      {plan.bloodFlowRate > 0 && <div>Qb: {plan.bloodFlowRate} mL/min</div>}
                      {plan.dialysateFlowRate > 0 && <div>Qd: {plan.dialysateFlowRate} mL/min</div>}
                      <div>Dry Weight: {plan.dryWeight} kg</div>
                      <div>Target UF: {plan.targetUltrafiltration} L</div>
                    </div>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm">
                    <div className="font-medium text-[var(--text-primary,#172B4D)]">Anticoagulation</div>
                    <div className="mt-2 space-y-1 text-[var(--text-secondary,#6B778C)]">
                      <div>Agent: {plan.anticoagulation}</div>
                      <div>Dose: {plan.anticoagulationDose}</div>
                    </div>
                    <div className="mt-3 font-medium text-[var(--text-primary,#172B4D)]">Diet</div>
                    <div className="mt-1 text-[var(--text-secondary,#6B778C)]">{plan.dietaryRecommendations}</div>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm">
                    <div className="font-medium text-[var(--text-primary,#172B4D)]">Medications</div>
                    <div className="mt-2 space-y-1 text-[var(--text-secondary,#6B778C)]">
                      {plan.medications.map((med, i) => <div key={i}>{med.name} — {med.dose} ({med.frequency})</div>)}
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-4 text-xs text-[var(--text-secondary,#6B778C)]">
                  <span>Prescribed by: {plan.prescribedBy}</span>
                  <span>Start: {plan.startDate}</span>
                  <span>Review: {plan.reviewDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 04 Appointment Scheduling ────────────────────────────────────── */}
      {screen === "appointment-scheduling" && (
        <div className="space-y-6">
          <PageHeader title="Appointment Scheduling" subtitle="Dialysis session scheduling and calendar" icon={Calendar}
            actions={<Button size="sm"><Plus className="mr-1.5 size-4" />New Appointment</Button>} />

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <KPICard icon={Calendar} label="Today's Appointments" value={APPOINTMENTS.filter((a) => a.date === "2026-07-24").length} tone="blue" />
            <KPICard icon={CheckCircle2} label="Confirmed" value={APPOINTMENTS.filter((a) => a.status === "Confirmed").length} tone="green" />
            <KPICard icon={Clock} label="Pending" value={APPOINTMENTS.filter((a) => a.status === "Pending").length} tone="amber" />
            <KPICard icon={AlertTriangle} label="Missed" value={APPOINTMENTS.filter((a) => a.status === "Missed").length} tone="red" />
          </div>

          <Section title="Appointments">
            <div className="overflow-hidden rounded-xl border border-[var(--border,#DFE1E6)]">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs text-[var(--text-secondary,#6B778C)]">
                  <tr><th className="px-4 py-3 font-medium">ID</th><th className="px-4 py-3 font-medium">Patient</th><th className="px-4 py-3 font-medium">Date</th><th className="px-4 py-3 font-medium">Time</th><th className="px-4 py-3 font-medium">Type</th><th className="px-4 py-3 font-medium">Machine</th><th className="px-4 py-3 font-medium">Nurse</th><th className="px-4 py-3 font-medium">Status</th></tr>
                </thead>
                <tbody className="divide-y divide-[var(--border,#DFE1E6)]">
                  {APPOINTMENTS.map((a) => (
                    <tr key={a.id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 font-medium text-[#0052CC]">{a.id}</td>
                      <td className="px-4 py-3 font-medium text-[var(--text-primary,#172B4D)]">{a.patientName}</td>
                      <td className="px-4 py-3 text-[var(--text-secondary,#6B778C)]">{a.date}</td>
                      <td className="px-4 py-3 text-[var(--text-secondary,#6B778C)]">{a.time}</td>
                      <td className="px-4 py-3 text-[var(--text-secondary,#6B778C)]">{a.type}</td>
                      <td className="px-4 py-3 text-[var(--text-secondary,#6B778C)]">{a.machineId || "—"}</td>
                      <td className="px-4 py-3 text-[var(--text-secondary,#6B778C)]">{a.nurse}</td>
                      <td className="px-4 py-3"><AppointmentStatusBadge status={a.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        </div>
      )}

      {/* ── 05 Machine & Chair Allocation ────────────────────────────────── */}
      {screen === "machine-chair" && !selectedMachine && (
        <div className="space-y-6">
          <PageHeader title="Machine & Chair Allocation" subtitle="Dialysis machine and chair management" icon={Monitor} />

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <KPICard icon={Monitor} label="Available" value={MACHINES.filter((m) => m.status === "Available").length} tone="green" />
            <KPICard icon={Activity} label="In Use" value={MACHINES.filter((m) => m.status === "In Use").length} tone="blue" />
            <KPICard icon={Wrench} label="Maintenance" value={MACHINES.filter((m) => m.status === "Maintenance").length} tone="amber" />
            <KPICard icon={AlertCircle} label="Out of Service" value={MACHINES.filter((m) => m.status === "Out of Service").length} tone="red" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {MACHINES.map((m) => <MachineCard key={m.id} machine={m} onClick={() => setSelectedMachine(m)} />)}
          </div>
        </div>
      )}

      {screen === "machine-chair" && selectedMachine && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setSelectedMachine(null)}><ChevronRight className="size-4 rotate-180" />Back</Button>
            <PageHeader title={selectedMachine.name} subtitle={selectedMachine.id} icon={Monitor} />
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <Section title="Machine Details">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-[var(--text-secondary,#6B778C)]">Model:</span> <span className="ml-2 font-medium text-[var(--text-primary,#172B4D)]">{selectedMachine.model}</span></div>
                  <div><span className="text-[var(--text-secondary,#6B778C)]">Manufacturer:</span> <span className="ml-2 font-medium text-[var(--text-primary,#172B4D)]">{selectedMachine.manufacturer}</span></div>
                  <div><span className="text-[var(--text-secondary,#6B778C)]">Chair:</span> <span className="ml-2 font-medium text-[var(--text-primary,#172B4D)]">{selectedMachine.chairId}</span></div>
                  <div><span className="text-[var(--text-secondary,#6B778C)]">Total Hours:</span> <span className="ml-2 font-medium text-[var(--text-primary,#172B4D)]">{selectedMachine.totalHours.toLocaleString()}</span></div>
                  <div><span className="text-[var(--text-secondary,#6B778C)]">Sessions:</span> <span className="ml-2 font-medium text-[var(--text-primary,#172B4D)]">{selectedMachine.sessionsCompleted}</span></div>
                  <div><span className="text-[var(--text-secondary,#6B778C)]">Disinfection:</span> <span className="ml-2 font-medium text-[var(--text-primary,#172B4D)]">{selectedMachine.disinfectionStatus}</span></div>
                  <div><span className="text-[var(--text-secondary,#6B778C)]">Last Calibration:</span> <span className="ml-2 font-medium text-[var(--text-primary,#172B4D)]">{selectedMachine.lastCalibration}</span></div>
                  <div><span className="text-[var(--text-secondary,#6B778C)]">Next Calibration:</span> <span className="ml-2 font-medium text-[var(--text-primary,#172B4D)]">{selectedMachine.nextCalibration}</span></div>
                  <div><span className="text-[var(--text-secondary,#6B778C)]">Last Maintenance:</span> <span className="ml-2 font-medium text-[var(--text-primary,#172B4D)]">{selectedMachine.lastMaintenance}</span></div>
                  <div><span className="text-[var(--text-secondary,#6B778C)]">Next Maintenance:</span> <span className="ml-2 font-medium text-[var(--text-primary,#172B4D)]">{selectedMachine.nextMaintenance}</span></div>
                </div>
              </Section>
            </div>
            <div className="space-y-4">
              <Section title="Status"><div className="space-y-3">
                <div className="flex items-center justify-between"><span className="text-sm text-[var(--text-secondary,#6B778C)]">Status</span><MachineStatusBadge status={selectedMachine.status} /></div>
                {selectedMachine.currentPatient && <div className="flex items-center justify-between"><span className="text-sm text-[var(--text-secondary,#6B778C)]">Patient</span><span className="font-medium text-[var(--text-primary,#172B4D)]">{selectedMachine.currentPatient}</span></div>}
                {selectedMachine.error && <div className="text-sm font-medium text-red-600">{selectedMachine.error}</div>}
              </div></Section>
            </div>
          </div>
        </div>
      )}

      {/* ── 06 Pre-Dialysis Assessment ───────────────────────────────────── */}
      {screen === "pre-dialysis" && (
        <div className="space-y-6">
          <PageHeader title="Pre-Dialysis Assessment" subtitle="Patient readiness assessment before treatment" icon={Stethoscope}
            actions={<Button size="sm"><Plus className="mr-1.5 size-4" />New Assessment</Button>} />

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <KPICard icon={CheckCircle2} label="Ready" value={PRE_DIALYSIS_ASSESSMENTS.filter((a) => a.readinessStatus === "Ready").length} tone="green" />
            <KPICard icon={Clock} label="Conditional" value={PRE_DIALYSIS_ASSESSMENTS.filter((a) => a.readinessStatus === "Conditional").length} tone="amber" />
            <KPICard icon={AlertTriangle} label="Not Ready" value={PRE_DIALYSIS_ASSESSMENTS.filter((a) => a.readinessStatus === "Not Ready").length} tone="red" />
            <KPICard icon={ClipboardList} label="Total Today" value={PRE_DIALYSIS_ASSESSMENTS.length} tone="blue" />
          </div>

          <div className="space-y-4">
            {PRE_DIALYSIS_ASSESSMENTS.map((a) => (
              <div key={a.id} className={`rounded-xl border-2 p-5 ${a.readinessStatus === "Ready" ? "border-emerald-200 bg-emerald-50/50" : a.readinessStatus === "Conditional" ? "border-amber-200 bg-amber-50/50" : "border-red-200 bg-red-50/50"}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold text-[var(--text-primary,#172B4D)]">{a.patientName} — {a.id}</div>
                    <div className="text-sm text-[var(--text-secondary,#6B778C)]">{a.assessmentDate} · Assessed by: {a.assessedBy}</div>
                  </div>
                  <StatusPill label={a.readinessStatus} tone={a.readinessStatus === "Ready" ? "success" : a.readinessStatus === "Conditional" ? "warning" : "danger"} />
                </div>

                <div className="mt-4">
                  <VitalsWidget vitals={{ bp: `${a.bpSystolic}/${a.bpDiastolic}`, hr: a.heartRate, temp: a.temperature, rr: a.respiratoryRate, weight: a.weight }} />
                </div>

                <div className="mt-3 grid gap-4 lg:grid-cols-2 text-sm">
                  <div>
                    <span className="text-[var(--text-secondary,#6B778C)]">Edema:</span> <span className="ml-2 font-medium text-[var(--text-primary,#172B4D)]">{a.edema}</span>
                    <div className="mt-1"><span className="text-[var(--text-secondary,#6B778C)]">Access:</span> <span className="ml-2 text-[var(--text-primary,#172B4D)]">{a.accessAssessment}</span></div>
                  </div>
                  <div>
                    <span className="text-[var(--text-secondary,#6B778C)]">Lab Review:</span> <span className="ml-2 text-[var(--text-primary,#172B4D)]">{a.labReview}</span>
                    <div className="mt-1"><span className="text-[var(--text-secondary,#6B778C)]">Notes:</span> <span className="ml-2 text-[var(--text-primary,#172B4D)]">{a.notes}</span></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 07 Treatment Monitoring ──────────────────────────────────────── */}
      {screen === "treatment-monitoring" && (
        <div className="space-y-6">
          <PageHeader title="Treatment Monitoring" subtitle="Live dialysis session monitoring" icon={Activity} />

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <KPICard icon={Activity} label="Active" value={TREATMENT_SESSIONS.filter((s) => s.status === "In Progress").length} tone="blue" />
            <KPICard icon={CheckCircle2} label="Completed Today" value={TREATMENT_SESSIONS.filter((s) => s.status === "Completed").length} tone="green" />
            <KPICard icon={AlertTriangle} label="Complications" value={TREATMENT_SESSIONS.filter((s) => s.complications.some((c) => c !== "None")).length} tone="red" />
            <KPICard icon={Clock} label="Scheduled" value={TREATMENT_SESSIONS.filter((s) => s.status === "Scheduled").length} tone="amber" />
          </div>

          <div className="space-y-4">
            {TREATMENT_SESSIONS.map((s) => {
              const machine = MACHINES.find((m) => m.id === s.machineId);
              return (
                <div key={s.id} className={`rounded-xl border-2 p-5 ${s.status === "In Progress" ? "border-blue-200 bg-blue-50/50" : s.status === "Completed" ? "border-emerald-200 bg-emerald-50/50" : "border-gray-200 bg-white"}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold text-[var(--text-primary,#172B4D)]">{s.patientName} — {s.id}</div>
                      <div className="text-sm text-[var(--text-secondary,#6B778C)]">{machine?.name} · {s.chairId} · {s.date}</div>
                    </div>
                    <TreatmentStatusBadge status={s.status} />
                  </div>

                  <div className="mt-4 grid gap-4 lg:grid-cols-2">
                    <div className="rounded-lg border border-gray-200 bg-white p-3">
                      <h4 className="text-sm font-medium text-[var(--text-primary,#172B4D)]">Treatment Parameters</h4>
                      <div className="mt-2 grid grid-cols-4 gap-2 text-center text-xs">
                        <div className="rounded bg-gray-50 p-1.5"><div className="text-[var(--text-secondary,#6B778C)]">Pre Wt</div><div className="font-bold text-[var(--text-primary,#172B4D)]">{s.preWeight}kg</div></div>
                        <div className="rounded bg-gray-50 p-1.5"><div className="text-[var(--text-secondary,#6B778C)]">UF</div><div className="font-bold text-[var(--text-primary,#172B4D)]">{s.ultrafiltration}L</div></div>
                        <div className="rounded bg-gray-50 p-1.5"><div className="text-[var(--text-secondary,#6B778C)]">Qb</div><div className="font-bold text-[var(--text-primary,#172B4D)]">{s.bloodFlowRate}</div></div>
                        <div className="rounded bg-gray-50 p-1.5"><div className="text-[var(--text-secondary,#6B778C)]">Qd</div><div className="font-bold text-[var(--text-primary,#172B4D)]">{s.dialysateFlowRate}</div></div>
                      </div>
                      <div className="mt-2 grid grid-cols-3 gap-2 text-center text-xs">
                        <div className="rounded bg-gray-50 p-1.5"><div className="text-[var(--text-secondary,#6B778C)]">VP</div><div className="font-bold text-[var(--text-primary,#172B4D)]">{s.venousPressure}</div></div>
                        <div className="rounded bg-gray-50 p-1.5"><div className="text-[var(--text-secondary,#6B778C)]">AP</div><div className="font-bold text-[var(--text-primary,#172B4D)]">{s.arterialPressure}</div></div>
                        <div className="rounded bg-gray-50 p-1.5"><div className="text-[var(--text-secondary,#6B778C)]">TMP</div><div className="font-bold text-[var(--text-primary,#172B4D)]">{s.tmp}</div></div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {s.ktV !== undefined && (
                        <div className="rounded-lg border border-gray-200 bg-white p-3">
                          <AdequacyGauge ktV={s.ktV} urr={s.urr} />
                        </div>
                      )}
                      {s.complications.length > 0 && s.complications[0] !== "None" && (
                        <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                          <div className="text-sm font-medium text-red-700">Complications</div>
                          <div className="mt-1 flex flex-wrap gap-1">{s.complications.map((c, i) => <StatusPill key={i} label={c} tone="danger" />)}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-4 text-xs text-[var(--text-secondary,#6B778C)]">
                    <span>Start: {s.startTime}</span>
                    {s.endTime && <span>End: {s.endTime}</span>}
                    <span>Nurse: {s.nurse}</span>
                    <span>Doctor: {s.nephrologist}</span>
                  </div>
                  {s.sessionNotes && <div className="mt-2 text-sm text-[var(--text-primary,#172B4D)]">{s.sessionNotes}</div>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 08 Medication Administration ─────────────────────────────────── */}
      {screen === "medication-admin" && (
        <div className="space-y-6">
          <PageHeader title="Medication Administration" subtitle="Dialysis-related medication tracking" icon={Pill}
            actions={<Button size="sm"><Plus className="mr-1.5 size-4" />Administer Medication</Button>} />

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <KPICard icon={Pill} label="Medications Today" value={MEDICATION_RECORDS.reduce((sum, r) => sum + r.medications.length, 0)} tone="blue" />
            <KPICard icon={CheckCircle2} label="Verified" value={MEDICATION_RECORDS.reduce((sum, r) => sum + r.medications.filter((m) => m.verified).length, 0)} tone="green" />
            <KPICard icon={Clock} label="Pending" value={0} tone="amber" />
            <KPICard icon={AlertTriangle} label="Errors" value={0} tone="red" />
          </div>

          <div className="space-y-4">
            {MEDICATION_RECORDS.map((rec) => (
              <div key={rec.id} className="rounded-xl border border-[var(--border,#DFE1E6)] bg-white p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold text-[var(--text-primary,#172B4D)]">{rec.patientName} — {rec.id}</div>
                    <div className="text-sm text-[var(--text-secondary,#6B778C)]">Session: {rec.sessionId} · {rec.date}</div>
                  </div>
                </div>

                <div className="mt-4 overflow-hidden rounded-lg border border-gray-200">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-xs text-[var(--text-secondary,#6B778C)]">
                      <tr><th className="px-3 py-2 font-medium">Medication</th><th className="px-3 py-2 font-medium">Dose</th><th className="px-3 py-2 font-medium">Route</th><th className="px-3 py-2 font-medium">Time</th><th className="px-3 py-2 font-medium">Administered By</th><th className="px-3 py-2 font-medium">Verified</th></tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {rec.medications.map((med, i) => (
                        <tr key={i} className="hover:bg-gray-50/50">
                          <td className="px-3 py-2 font-medium text-[var(--text-primary,#172B4D)]">{med.name}</td>
                          <td className="px-3 py-2 text-[var(--text-secondary,#6B778C)]">{med.dose}</td>
                          <td className="px-3 py-2 text-[var(--text-secondary,#6B778C)]">{med.route}</td>
                          <td className="px-3 py-2 text-[var(--text-secondary,#6B778C)]">{med.time}</td>
                          <td className="px-3 py-2 text-[var(--text-secondary,#6B778C)]">{med.administeredBy}</td>
                          <td className="px-3 py-2">{med.verified ? <CheckCircle2 className="size-4 text-emerald-500" /> : <Clock className="size-4 text-amber-500" />}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 09 Laboratory Results ────────────────────────────────────────── */}
      {screen === "laboratory-results" && (
        <div className="space-y-6">
          <PageHeader title="Laboratory Results" subtitle="Dialysis-relevant lab values and trends" icon={TestTube} />

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <KPICard icon={TestTube} label="Tests This Week" value={LAB_RESULTS.length} tone="blue" />
            <KPICard icon={AlertTriangle} label="Critical Alerts" value={LAB_RESULTS.reduce((sum, r) => sum + r.criticalAlerts.length, 0)} tone="red" />
            <KPICard icon={CheckCircle2} label="Normal" value={LAB_RESULTS.filter((r) => r.criticalAlerts.length === 0).length} tone="green" />
            <KPICard icon={BarChart3} label="Avg Kt/V" value={LAB_RESULTS.filter((r) => r.ktV).reduce((sum, r, _, arr) => sum + (r.ktV ?? 0) / arr.length, 0).toFixed(1)} tone="cyan" />
          </div>

          <div className="space-y-4">
            {LAB_RESULTS.map((lr) => (
              <div key={lr.id} className="rounded-xl border border-[var(--border,#DFE1E6)] bg-white p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold text-[var(--text-primary,#172B4D)]">{lr.patientName} — {lr.id}</div>
                    <div className="text-sm text-[var(--text-secondary,#6B778C)]">Date: {lr.testDate}</div>
                  </div>
                  {lr.criticalAlerts.length > 0 && <StatusPill label={`${lr.criticalAlerts.length} Alert(s)`} tone="danger" />}
                </div>

                <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5 lg:grid-cols-10">
                  <LabResultCard label="Creatinine" value={lr.creatinine} unit="mg/dL" normal="0.6-1.2" critical={lr.creatinine > 8} />
                  <LabResultCard label="BUN" value={lr.bun} unit="mg/dL" normal="7-20" critical={lr.bun > 60} />
                  <LabResultCard label="K+" value={lr.potassium} unit="mEq/L" normal="3.5-5.0" critical={lr.potassium > 5.5 || lr.potassium < 3.5} />
                  <LabResultCard label="Na+" value={lr.sodium} unit="mEq/L" normal="136-145" />
                  <LabResultCard label="Hb" value={lr.hemoglobin} unit="g/dL" normal="12-16" critical={lr.hemoglobin < 9} />
                  <LabResultCard label="Ca++" value={lr.calcium} unit="mg/dL" normal="8.5-10.5" critical={lr.calcium < 8.5} />
                  <LabResultCard label="PO4" value={lr.phosphate} unit="mg/dL" normal="2.5-4.5" critical={lr.phosphate > 5.5} />
                  <LabResultCard label="Albumin" value={lr.albumin} unit="g/dL" normal="3.5-5.0" critical={lr.albumin < 3.5} />
                  <LabResultCard label="pH" value={lr.ph} unit="" normal="7.35-7.45" />
                  <LabResultCard label="HCO3" value={lr.bicarbonate} unit="mEq/L" normal="22-26" critical={lr.bicarbonate < 20} />
                </div>

                {lr.criticalAlerts.length > 0 && (
                  <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3">
                    <div className="flex flex-wrap gap-1">{lr.criticalAlerts.map((a, i) => <StatusPill key={i} label={a} tone="danger" />)}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 10 Dialysis Adequacy ─────────────────────────────────────────── */}
      {screen === "dialysis-adequacy" && (
        <div className="space-y-6">
          <PageHeader title="Dialysis Adequacy" subtitle="Kt/V, URR, and treatment effectiveness tracking" icon={BarChart3} />

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <KPICard icon={BarChart3} label="Avg Kt/V" value={DIALYSIS_KPI.avgKtV} sub="Target: ≥1.4" tone={DIALYSIS_KPI.avgKtV >= 1.4 ? "green" : "amber"} />
            <KPICard icon={BarChart3} label="Avg URR" value={`${DIALYSIS_KPI.avgURR}%`} sub="Target: ≥65%" tone={DIALYSIS_KPI.avgURR >= 65 ? "green" : "amber"} />
            <KPICard icon={CheckCircle2} label="Adequate" value="4" tone="green" />
            <KPICard icon={AlertTriangle} label="Below Target" value="2" tone="red" />
          </div>

          <Section title="Patient Adequacy">
            <div className="space-y-4">
              {LAB_RESULTS.filter((lr) => lr.ktV !== undefined).map((lr) => (
                <div key={lr.id} className="rounded-xl border border-[var(--border,#DFE1E6)] bg-white p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold text-[var(--text-primary,#172B4D)]">{lr.patientName}</div>
                      <div className="text-xs text-[var(--text-secondary,#6B778C)]">{lr.testDate}</div>
                    </div>
                  </div>
                  <div className="mt-3 max-w-xs">
                    <AdequacyGauge ktV={lr.ktV} urr={lr.urr} />
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>
      )}

      {/* ── 11 Complication Management ───────────────────────────────────── */}
      {screen === "complication-management" && (
        <div className="space-y-6">
          <PageHeader title="Complication Management" subtitle="Dialysis complications and emergency management" icon={AlertTriangle}
            actions={<Button size="sm"><Plus className="mr-1.5 size-4" />Report Complication</Button>} />

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <KPICard icon={AlertTriangle} label="Today" value={TREATMENT_SESSIONS.filter((s) => s.complications.some((c) => c !== "None")).length} tone="red" />
            <KPICard icon={Activity} label="Hypotension" value="1" tone="amber" />
            <KPICard icon={Heart} label="Arrhythmia" value="0" tone="green" />
            <KPICard icon={AlertCircle} label="Access Issues" value="0" tone="green" />
          </div>

          <Section title="Recent Complications">
            <div className="space-y-3">
              {TREATMENT_SESSIONS.filter((s) => s.complications.some((c) => c !== "None")).map((s) => (
                <div key={s.id} className="rounded-xl border-2 border-amber-200 bg-amber-50/50 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold text-[var(--text-primary,#172B4D)]">{s.patientName}</div>
                      <div className="text-sm text-[var(--text-secondary,#6B778C)]">Session: {s.id} · {s.date}</div>
                    </div>
                    <StatusPill label={s.complications[0]} tone="warning" />
                  </div>
                  {s.sessionNotes && <div className="mt-2 text-sm text-[var(--text-primary,#172B4D)]">{s.sessionNotes}</div>}
                </div>
              ))}
              {TREATMENT_SESSIONS.filter((s) => s.complications.some((c) => c !== "None")).length === 0 && (
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-center text-sm text-[var(--text-secondary,#6B778C)]">No complications reported today</div>
              )}
            </div>
          </Section>
        </div>
      )}

      {/* ── 12 Post-Dialysis Assessment ──────────────────────────────────── */}
      {screen === "post-dialysis" && (
        <div className="space-y-6">
          <PageHeader title="Post-Dialysis Assessment" subtitle="Post-treatment evaluation and discharge" icon={ClipboardCheck} />

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <KPICard icon={CheckCircle2} label="Completed" value={TREATMENT_SESSIONS.filter((s) => s.status === "Completed").length} tone="green" />
            <KPICard icon={Clock} label="Pending Assessment" value={0} tone="amber" />
            <KPICard icon={AlertTriangle} label="With Complications" value={1} tone="red" />
            <KPICard icon={FileText} label="Notes Filed" value={2} tone="blue" />
          </div>

          <div className="space-y-4">
            {TREATMENT_SESSIONS.filter((s) => s.status === "Completed").map((s) => (
              <div key={s.id} className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold text-[var(--text-primary,#172B4D)]">{s.patientName} — {s.id}</div>
                    <div className="text-sm text-[var(--text-secondary,#6B778C)]">{s.date} · {s.startTime} - {s.endTime}</div>
                  </div>
                  <TreatmentStatusBadge status={s.status} />
                </div>

                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                  <div className="rounded-lg border border-gray-200 bg-white p-3">
                    <h4 className="text-sm font-medium text-[var(--text-primary,#172B4D)]">Treatment Summary</h4>
                    <div className="mt-2 space-y-1 text-sm text-[var(--text-secondary,#6B778C)]">
                      <div>Pre Weight: {s.preWeight} kg → Post Weight: {s.postWeight} kg</div>
                      <div>Ultrafiltration: {s.ultrafiltration} L (Target: {s.targetUF} L)</div>
                      <div>Kt/V: {s.ktV} · URR: {s.urr}%</div>
                      <div>Duration: {s.startTime} - {s.endTime}</div>
                    </div>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-white p-3">
                    <h4 className="text-sm font-medium text-[var(--text-primary,#172B4D)]">Post-Treatment Vitals</h4>
                    <div className="mt-2 grid grid-cols-4 gap-2 text-center text-xs">
                      <div className="rounded bg-gray-50 p-1.5"><div className="text-[var(--text-secondary,#6B778C)]">Post Wt</div><div className="font-bold text-[var(--text-primary,#172B4D)]">{s.postWeight}kg</div></div>
                      <div className="rounded bg-gray-50 p-1.5"><div className="text-[var(--text-secondary,#6B778C)]">VP</div><div className="font-bold text-[var(--text-primary,#172B4D)]">{s.venousPressure}</div></div>
                      <div className="rounded bg-gray-50 p-1.5"><div className="text-[var(--text-secondary,#6B778C)]">AP</div><div className="font-bold text-[var(--text-primary,#172B4D)]">{s.arterialPressure}</div></div>
                      <div className="rounded bg-gray-50 p-1.5"><div className="text-[var(--text-secondary,#6B778C)]">TMP</div><div className="font-bold text-[var(--text-primary,#172B4D)]">{s.tmp}</div></div>
                    </div>
                  </div>
                </div>

                {s.sessionNotes && <div className="mt-3 rounded-lg border border-gray-200 bg-white p-3 text-sm text-[var(--text-primary,#172B4D)]">{s.sessionNotes}</div>}

                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="outline"><FileText className="mr-1.5 size-3" />Clinical Notes</Button>
                  <Button size="sm" variant="outline"><Calendar className="mr-1.5 size-3" />Schedule Next</Button>
                  <Button size="sm" variant="outline"><Download className="mr-1.5 size-3" />Print Summary</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 13 Vascular Access Management ────────────────────────────────── */}
      {screen === "vascular-access" && (
        <div className="space-y-6">
          <PageHeader title="Vascular Access Management" subtitle="Fistula, graft, and catheter management" icon={Heart} />

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <KPICard icon={Heart} label="Functional" value={VASCULAR_ACCESSES.filter((a) => a.status === "Functional").length} tone="green" />
            <KPICard icon={AlertTriangle} label="Under Observation" value={VASCULAR_ACCESSES.filter((a) => a.status === "Under Observation").length} tone="amber" />
            <KPICard icon={Activity} label="AV Fistula" value={VASCULAR_ACCESSES.filter((a) => a.accessType === "AV Fistula").length} tone="blue" />
            <KPICard icon={Clock} label="Total" value={VASCULAR_ACCESSES.length} tone="cyan" />
          </div>

          <div className="overflow-hidden rounded-xl border border-[var(--border,#DFE1E6)]">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs text-[var(--text-secondary,#6B778C)]">
                <tr><th className="px-4 py-3 font-medium">ID</th><th className="px-4 py-3 font-medium">Patient</th><th className="px-4 py-3 font-medium">Type</th><th className="px-4 py-3 font-medium">Site</th><th className="px-4 py-3 font-medium">Flow Rate</th><th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3 font-medium">Last Assessment</th><th className="px-4 py-3 font-medium">Complications</th></tr>
              </thead>
              <tbody className="divide-y divide-[var(--border,#DFE1E6)]">
                {VASCULAR_ACCESSES.map((va) => (
                  <tr key={va.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-medium text-[#0052CC]">{va.id}</td>
                    <td className="px-4 py-3 font-medium text-[var(--text-primary,#172B4D)]">{va.patientName}</td>
                    <td className="px-4 py-3 text-[var(--text-secondary,#6B778C)]">{va.accessType}</td>
                    <td className="px-4 py-3 text-[var(--text-secondary,#6B778C)]">{va.accessSite}</td>
                    <td className="px-4 py-3 font-medium text-[var(--text-primary,#172B4D)]">{va.flowRate > 0 ? `${va.flowRate} mL/min` : "N/A"}</td>
                    <td className="px-4 py-3"><AccessStatusBadge status={va.status} /></td>
                    <td className="px-4 py-3 text-[var(--text-secondary,#6B778C)]">{va.lastAssessment}</td>
                    <td className="px-4 py-3 text-xs text-[var(--text-secondary,#6B778C)]">{va.complications.length > 0 ? va.complications.join(", ") : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── 14 Machine Maintenance ───────────────────────────────────────── */}
      {screen === "machine-maintenance" && (
        <div className="space-y-6">
          <PageHeader title="Machine Maintenance" subtitle="Preventive and corrective maintenance tracking" icon={Settings}
            actions={<Button size="sm"><Plus className="mr-1.5 size-4" />Schedule Maintenance</Button>} />

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <KPICard icon={Settings} label="Scheduled" value={MACHINE_MAINTENANCE.filter((m) => m.status === "Scheduled").length} tone="blue" />
            <KPICard icon={CheckCircle2} label="Completed" value={MACHINE_MAINTENANCE.filter((m) => m.status === "Completed").length} tone="green" />
            <KPICard icon={Clock} label="In Progress" value={MACHINE_MAINTENANCE.filter((m) => m.status === "In Progress").length} tone="amber" />
            <KPICard icon={AlertTriangle} label="Overdue" value={MACHINE_MAINTENANCE.filter((m) => m.status === "Overdue").length} tone="red" />
          </div>

          <Section title="Maintenance Records">
            <div className="overflow-hidden rounded-xl border border-[var(--border,#DFE1E6)]">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs text-[var(--text-secondary,#6B778C)]">
                  <tr><th className="px-4 py-3 font-medium">ID</th><th className="px-4 py-3 font-medium">Machine</th><th className="px-4 py-3 font-medium">Type</th><th className="px-4 py-3 font-medium">Description</th><th className="px-4 py-3 font-medium">Scheduled</th><th className="px-4 py-3 font-medium">Cost</th><th className="px-4 py-3 font-medium">Status</th></tr>
                </thead>
                <tbody className="divide-y divide-[var(--border,#DFE1E6)]">
                  {MACHINE_MAINTENANCE.map((m) => (
                    <tr key={m.id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 font-medium text-[#0052CC]">{m.id}</td>
                      <td className="px-4 py-3 font-medium text-[var(--text-primary,#172B4D)]">{m.machineName}</td>
                      <td className="px-4 py-3"><StatusPill label={m.type} tone="info" /></td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary,#6B778C)] max-w-xs truncate">{m.description}</td>
                      <td className="px-4 py-3 text-[var(--text-secondary,#6B778C)]">{m.scheduledDate}</td>
                      <td className="px-4 py-3 font-medium text-[var(--text-primary,#172B4D)]">{formatCurrency(m.cost)}</td>
                      <td className="px-4 py-3"><StatusPill label={m.status} tone={maintenanceStatusTone(m.status)} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        </div>
      )}

      {/* ── 15 Consumables Inventory ─────────────────────────────────────── */}
      {screen === "consumables-inventory" && (
        <div className="space-y-6">
          <PageHeader title="Consumables Inventory" subtitle="Dialysis consumables and supply management" icon={Package}
            actions={<><Button variant="outline" size="sm"><Download className="mr-1.5 size-4" />Export</Button><Button size="sm"><Plus className="mr-1.5 size-4" />Add Item</Button></>} />

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <KPICard icon={Package} label="Total Items" value={CONSUMABLES.length} tone="blue" />
            <KPICard icon={AlertTriangle} label="Low Stock" value={CONSUMABLES.filter((c) => c.stock <= c.minStock).length} tone="red" />
            <KPICard icon={CheckCircle2} label="In Stock" value={CONSUMABLES.filter((c) => c.stock > c.minStock).length} tone="green" />
            <KPICard icon={Clock} label="Expiring Soon" value={0} tone="amber" />
          </div>

          <Section title="Stock Levels">
            <div className="overflow-hidden rounded-xl border border-[var(--border,#DFE1E6)]">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs text-[var(--text-secondary,#6B778C)]">
                  <tr><th className="px-4 py-3 font-medium">Item</th><th className="px-4 py-3 font-medium">Category</th><th className="px-4 py-3 font-medium">Stock</th><th className="px-4 py-3 font-medium">Min</th><th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3 font-medium">Batch</th><th className="px-4 py-3 font-medium">Expiry</th><th className="px-4 py-3 font-medium">Action</th></tr>
                </thead>
                <tbody className="divide-y divide-[var(--border,#DFE1E6)]">
                  {CONSUMABLES.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 font-medium text-[var(--text-primary,#172B4D)]">{c.name}</td>
                      <td className="px-4 py-3 text-[var(--text-secondary,#6B778C)]">{c.category}</td>
                      <td className="px-4 py-3 font-medium text-[var(--text-primary,#172B4D)]">{c.stock} {c.unit}</td>
                      <td className="px-4 py-3 text-[var(--text-secondary,#6B778C)]">{c.minStock}</td>
                      <td className="px-4 py-3"><StatusPill label={c.stock <= c.minStock ? "Low" : "OK"} tone={c.stock <= c.minStock ? "danger" : "success"} /></td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary,#6B778C)]">{c.batchNumber}</td>
                      <td className="px-4 py-3 text-[var(--text-secondary,#6B778C)]">{c.expiryDate}</td>
                      <td className="px-4 py-3">{c.stock <= c.minStock && <Button size="sm" variant="outline">Reorder</Button>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        </div>
      )}

      {/* ── 16 Reports & Analytics ───────────────────────────────────────── */}
      {screen === "reports-analytics" && (
        <div className="space-y-6">
          <PageHeader title="Reports & Analytics" subtitle="Dialysis operations performance metrics" icon={BarChart3}
            actions={<><Button variant="outline" size="sm"><Download className="mr-1.5 size-4" />Export Report</Button></>} />

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <KPICard icon={Activity} label="Treatment Volume" value="120" sub="This month" tone="blue" trend="up" trendValue="+8%" />
            <KPICard icon={Monitor} label="Machine Utilization" value={`${DIALYSIS_KPI.machineUtilization}%`} tone="cyan" />
            <KPICard icon={BarChart3} label="Avg Kt/V" value={DIALYSIS_KPI.avgKtV} tone="green" />
            <KPICard icon={AlertTriangle} label="Complication Rate" value={`${DIALYSIS_KPI.complicationRate}%`} tone={DIALYSIS_KPI.complicationRate > 5 ? "red" : "green"} />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Section title="Treatment Volume by Type">
              <div className="space-y-3">
                {(["Hemodialysis", "Peritoneal Dialysis", "CRRT"] as const).map((t) => {
                  const count = t === "Hemodialysis" ? 108 : t === "Peritoneal Dialysis" ? 10 : 2;
                  const pct = Math.round((count / 120) * 100);
                  return (
                    <div key={t}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[var(--text-primary,#172B4D)]">{t}</span>
                        <span className="text-[var(--text-secondary,#6B778C)]">{count} sessions ({pct}%)</span>
                      </div>
                      <div className="mt-1 h-2 overflow-hidden rounded-full bg-gray-200">
                        <div className="h-full rounded-full bg-blue-500" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Section>

            <Section title="Machine Utilization">
              <div className="space-y-3">
                {MACHINES.map((m) => (
                  <div key={m.id}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[var(--text-primary,#172B4D)]">{m.id} — {m.name}</span>
                      <span className="text-[var(--text-secondary,#6B778C)]">{m.status}</span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-gray-200">
                      <div className={`h-full rounded-full ${m.status === "In Use" ? "bg-blue-500" : m.status === "Available" ? "bg-emerald-500" : "bg-red-500"}`} style={{ width: m.status === "In Use" ? "100%" : m.status === "Available" ? "0%" : "50%" }} />
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Key Metrics">
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between"><span className="text-[var(--text-secondary,#6B778C)]">Avg Kt/V</span><span className="font-medium text-[var(--text-primary,#172B4D)]">{DIALYSIS_KPI.avgKtV}</span></div>
                <div className="flex items-center justify-between"><span className="text-[var(--text-secondary,#6B778C)]">Avg URR</span><span className="font-medium text-[var(--text-primary,#172B4D)]">{DIALYSIS_KPI.avgURR}%</span></div>
                <div className="flex items-center justify-between"><span className="text-[var(--text-secondary,#6B778C)]">Complication Rate</span><span className="font-medium text-[var(--text-primary,#172B4D)]">{DIALYSIS_KPI.complicationRate}%</span></div>
                <div className="flex items-center justify-between"><span className="text-[var(--text-secondary,#6B778C)]">Missed Session Rate</span><span className="font-medium text-[var(--text-primary,#172B4D)]">{DIALYSIS_KPI.missedSessionRate}%</span></div>
                <div className="flex items-center justify-between"><span className="text-[var(--text-secondary,#6B778C)]">Machine Utilization</span><span className="font-medium text-[var(--text-primary,#172B4D)]">{DIALYSIS_KPI.machineUtilization}%</span></div>
                <div className="flex items-center justify-between"><span className="text-[var(--text-secondary,#6B778C)]">Water Quality</span><span className="font-medium text-[var(--text-primary,#172B4D)]">{DIALYSIS_KPI.waterQualityCompliance}%</span></div>
              </div>
            </Section>

            <Section title="Patient Outcomes">
              <div className="space-y-3 text-sm">
                {DIALYSIS_PATIENTS.map((p) => {
                  const lr = LAB_RESULTS.find((l) => l.patientId === p.id);
                  return (
                    <div key={p.id} className="flex items-center justify-between">
                      <span className="text-[var(--text-primary,#172B4D)]">{p.name}</span>
                      <span className="text-[var(--text-secondary,#6B778C)]">Kt/V: {lr?.ktV ?? "N/A"} · URR: {lr?.urr ?? "N/A"}%</span>
                    </div>
                  );
                })}
              </div>
            </Section>
          </div>
        </div>
      )}

      {/* ── 17 Quality & Compliance ──────────────────────────────────────── */}
      {screen === "quality-compliance" && (
        <div className="space-y-6">
          <PageHeader title="Quality & Compliance" subtitle="Water quality, infection control, and regulatory compliance" icon={ShieldCheck}
            actions={<><Button variant="outline" size="sm"><Download className="mr-1.5 size-4" />Export</Button></>} />

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <KPICard icon={ShieldCheck} label="QC Tests" value={QUALITY_RECORDS.length} tone="blue" />
            <KPICard icon={CheckCircle2} label="Passed" value={QUALITY_RECORDS.filter((q) => q.result === "Pass").length} tone="green" />
            <KPICard icon={AlertTriangle} label="Failed" value={QUALITY_RECORDS.filter((q) => q.result === "Fail").length} tone="red" />
            <KPICard icon={Droplets} label="Water Quality" value={`${DIALYSIS_KPI.waterQualityCompliance}%`} tone="cyan" />
          </div>

          <Section title="Water Quality Monitoring">
            <div className="overflow-hidden rounded-xl border border-[var(--border,#DFE1E6)]">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs text-[var(--text-secondary,#6B778C)]">
                  <tr><th className="px-4 py-3 font-medium">Date</th><th className="px-4 py-3 font-medium">RO Permeate</th><th className="px-4 py-3 font-medium">Dialysate</th><th className="px-4 py-3 font-medium">Endotoxin</th><th className="px-4 py-3 font-medium">pH</th><th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3 font-medium">Notes</th></tr>
                </thead>
                <tbody className="divide-y divide-[var(--border,#DFE1E6)]">
                  {WATER_QUALITY.map((w) => (
                    <tr key={w.id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 font-medium text-[var(--text-primary,#172B4D)]">{w.date}</td>
                      <td className="px-4 py-3 text-[var(--text-secondary,#6B778C)]">{w.roPermeateConductivity} µS/cm</td>
                      <td className="px-4 py-3 text-[var(--text-secondary,#6B778C)]">{w.dialysateConductivity} mS/cm</td>
                      <td className="px-4 py-3 text-[var(--text-secondary,#6B778C)]">{w.endotoxin} EU/mL</td>
                      <td className="px-4 py-3 text-[var(--text-secondary,#6B778C)]">{w.pH}</td>
                      <td className="px-4 py-3"><StatusPill label={w.status} tone={waterQualityTone(w.status)} /></td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary,#6B778C)]">{w.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section title="Quality Records">
            <div className="overflow-hidden rounded-xl border border-[var(--border,#DFE1E6)]">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs text-[var(--text-secondary,#6B778C)]">
                  <tr><th className="px-4 py-3 font-medium">ID</th><th className="px-4 py-3 font-medium">Test Type</th><th className="px-4 py-3 font-medium">Result</th><th className="px-4 py-3 font-medium">Performed By</th><th className="px-4 py-3 font-medium">Next Due</th><th className="px-4 py-3 font-medium">CAPA</th></tr>
                </thead>
                <tbody className="divide-y divide-[var(--border,#DFE1E6)]">
                  {QUALITY_RECORDS.map((q) => (
                    <tr key={q.id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 font-medium text-[#0052CC]">{q.id}</td>
                      <td className="px-4 py-3 font-medium text-[var(--text-primary,#172B4D)]">{q.testType}</td>
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

      {/* ── 18 Workflow Complete ──────────────────────────────────────────── */}
      {screen === "workflow-complete" && (
        <div className="space-y-6">
          <PageHeader title="Workflow Complete" subtitle="All dialysis processes completed" icon={CheckCircle2} />
          <div className="flex flex-col items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50/50 py-16 text-center">
            <div className="grid size-16 place-items-center rounded-full bg-emerald-100"><CheckCircle2 className="size-8 text-emerald-600" /></div>
            <h2 className="mt-4 text-xl font-bold text-[var(--text-primary,#172B4D)]">All Processes Complete</h2>
            <p className="mt-2 max-w-md text-sm text-[var(--text-secondary,#6B778C)]">
              Treatment completed, documentation saved, inventory updated, and audit trail maintained.
            </p>
            <div className="mt-6 flex gap-3">
              <Button variant="outline"><Download className="mr-1.5 size-4" />Download Summary</Button>
              <Button onClick={() => setScreen("ds-dashboard")}>Return to Dashboard</Button>
            </div>
          </div>
        </div>
      )}

    </Shell>
  );
}
