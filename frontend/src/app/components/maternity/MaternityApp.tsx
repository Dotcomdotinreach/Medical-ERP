import { useState, useMemo } from "react";
import {
  LayoutDashboard, UserPlus, ClipboardList, Calendar, AlertTriangle,
  Activity, Heart, Baby, Stethoscope, BarChart3, Shield, CheckCircle2,
  ChevronRight, Download, Filter, Plus, RefreshCw, Eye, Edit3, Search,
  Clock, FileText, Printer, TrendingUp, Users, Zap, Target,
} from "lucide-react";
import { Shell, type Workspace } from "../his/Shell";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  MOTHERS, ANC_VISITS, ULTRASOUNDS, RISK_ASSESSMENTS, LABOR_ADMISSIONS,
  PARTOGRAPHS, NEWBORNS, POSTPARTUM_CARES, LACTATION_SUPPORTS, AUDIT_LOGS,
  MATERNITY_KPI, riskLevelTone, laborStatusTone, deliveryTypeTone,
  formatCurrency, type Mother, type ANCV, type Ultrasound,
  type RiskAssessment, type LaborAdmission,
} from "./data";
import {
  MotherCard, ANCCard, USCard, RiskCard, LaborCard, NewbornCard,
  PostpartumCard, LactationCard, AuditRow, PartographPreview,
} from "./maternityUi";
import { StatusBadge, StatCard, SectionCard, PageHeader } from "../his/ui";

type MRoute =
  | "mty-dashboard" | "anc-registration" | "anc-visits" | "pregnancy-timeline"
  | "risk-assessment" | "ultrasound" | "labor-admission" | "partograph"
  | "ctg-monitoring" | "delivery-management" | "newborn-record"
  | "postpartum-care" | "lactation-support" | "mother-baby-dashboard"
  | "discharge-planning" | "reports-analytics" | "quality-compliance" | "workflow-complete";

const NAV = [
  { id: "mty-dashboard", label: "Maternity Dashboard", icon: LayoutDashboard },
  { id: "anc-registration", label: "ANC Registration", icon: UserPlus },
  { id: "anc-visits", label: "ANC Visits", icon: ClipboardList },
  { id: "pregnancy-timeline", label: "Pregnancy Timeline", icon: Calendar },
  { id: "risk-assessment", label: "Risk Assessment", icon: AlertTriangle },
  { id: "ultrasound", label: "Ultrasound", icon: Activity },
  { id: "labor-admission", label: "Labor Admission", icon: Stethoscope, badge: "1", tone: "warning" as const },
  { id: "partograph", label: "Partograph", icon: Activity },
  { id: "ctg-monitoring", label: "CTG / Fetal Monitoring", icon: Heart },
];

const NAV_SECONDARY = [
  { id: "delivery-management", label: "Delivery Management", icon: Baby },
  { id: "newborn-record", label: "Newborn Record", icon: Baby },
  { id: "postpartum-care", label: "Postpartum Care", icon: Heart },
  { id: "lactation-support", label: "Lactation Support", icon: Activity },
  { id: "mother-baby-dashboard", label: "Mother & Baby Dashboard", icon: Users },
  { id: "discharge-planning", label: "Discharge Planning", icon: FileText },
  { id: "reports-analytics", label: "Reports & Analytics", icon: BarChart3 },
  { id: "quality-compliance", label: "Quality & Compliance", icon: Shield },
  { id: "workflow-complete", label: "Workflow Complete", icon: CheckCircle2 },
];

export function MaternityApp({ roleName, onSignOut, onSwitchWorkspace, onOpenSettings }: {
  roleName: string; onSignOut: () => void; onSwitchWorkspace: (w: Workspace) => void; onOpenSettings?: (page: string) => void;
}) {
  const [screen, setScreen] = useState<MRoute>("mty-dashboard");
  const [selectedMother, setSelectedMother] = useState<Mother | null>(null);
  const [selectedVisit, setSelectedVisit] = useState<ANCV | null>(null);
  const [selectedUS, setSelectedUS] = useState<Ultrasound | null>(null);
  const [selectedRisk, setSelectedRisk] = useState<RiskAssessment | null>(null);
  const [selectedAdmission, setSelectedAdmission] = useState<LaborAdmission | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const breadcrumb = useMemo(() => {
    const crumb = ["Maternity"];
    const nav = [...NAV, ...NAV_SECONDARY].find((n) => n.id === screen);
    if (nav) crumb.push(nav.label);
    if (selectedMother) crumb.splice(2, 0, selectedMother.name);
    return crumb;
  }, [screen, selectedMother]);

  const filteredMothers = MOTHERS.filter((m) =>
    !searchQuery || m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.uhid.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Shell
      nav={NAV}
      navSecondary={NAV_SECONDARY}
      sectionLabel="Maternity & OB"
      activeId={screen}
      isActive={(id) => id === screen}
      onNavigate={(id) => { setScreen(id as MRoute); setSelectedMother(null); setSelectedVisit(null); setSelectedUS(null); setSelectedRisk(null); setSelectedAdmission(null); }}
      breadcrumb={breadcrumb}
      roleName={roleName}
      onSignOut={onSignOut}
      workspace="maternity"
      onSwitchWorkspace={onSwitchWorkspace}
      onOpenSettings={onOpenSettings}
      searchPlaceholder="Search mothers, UHID, babies…"
    >
      {/* ── 01 Maternity Dashboard ──────────────────────────────────────── */}
      {screen === "mty-dashboard" && (
        <div className="space-y-6">
          <PageHeader title="Maternity Dashboard" subtitle="Obstetrics & labor room operations" icon={LayoutDashboard}
            actions={<><Button variant="outline" size="sm"><RefreshCw className="mr-1.5 size-4" />Refresh</Button><Button variant="outline" size="sm"><Download className="mr-1.5 size-4" />Export</Button></>} />

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard label="Active Mothers" value={MATERNITY_KPI.activeMothers} icon={Users} />
            <StatCard label="Today ANC Visits" value={MATERNITY_KPI.todayANCVisits} icon={ClipboardList} />
            <StatCard label="Labor Admissions" value={MATERNITY_KPI.laborAdmissions} icon={Stethoscope} />
            <StatCard label="High Risk" value={MATERNITY_KPI.highRiskPregnancies} icon={AlertTriangle} />
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard label="Deliveries This Month" value={MATERNITY_KPI.totalDeliveriesThisMonth} icon={Baby} />
            <StatCard label="C-Section Rate" value={`${MATERNITY_KPI.cesareanRate}%`} icon={Zap} />
            <StatCard label="NICU Admission Rate" value={`${MATERNITY_KPI.nicuAdmissionRate}%`} icon={Activity} />
            <StatCard label="Labor Rooms Available" value={`${MATERNITY_KPI.laborRoomsAvailable}/${MATERNITY_KPI.laborRooms}`} icon={Target} />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard title="Active Labor" actions={<Button variant="outline" size="sm" onClick={() => setScreen("labor-admission")}>View All</Button>}>
              <div className="space-y-3">
                {LABOR_ADMISSIONS.filter((a) => a.status === "Active Labor").map((a) => (
                  <div key={a.id} className="rounded-xl border-2 border-rose-200 bg-rose-50/50 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold text-slate-900">{a.motherName}</div>
                        <div className="text-sm text-slate-600">{a.laborRoom} · GA: {a.gestationalAge} · Admitted: {a.admissionTime}</div>
                      </div>
                      <StatusBadge variant="warning">{a.status}</StatusBadge>
                    </div>
                    <div className="mt-3 grid grid-cols-4 gap-2 text-center text-xs">
                      <div className="rounded bg-white p-1.5"><div className="text-slate-500">Cervix</div><div className="font-bold text-slate-900">{a.cervicalDilatation}cm</div></div>
                      <div className="rounded bg-white p-1.5"><div className="text-slate-500">Effacement</div><div className="font-bold text-slate-900">{a.cervicalEffacement}%</div></div>
                      <div className="rounded bg-white p-1.5"><div className="text-slate-500">Pain</div><div className="font-bold text-slate-900">{a.painScore}/10</div></div>
                      <div className="rounded bg-white p-1.5"><div className="text-slate-500">Presentation</div><div className="font-bold text-slate-900">{a.presentingPart.split("—")[0].trim()}</div></div>
                    </div>
                  </div>
                ))}
                {LABOR_ADMISSIONS.filter((a) => a.status === "Active Labor").length === 0 && (
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-center text-sm text-slate-500">No active labor cases</div>
                )}
              </div>
            </SectionCard>

            <SectionCard title="High Risk Mothers">
              <div className="space-y-3">
                {MOTHERS.filter((m) => m.riskLevel === "High" || m.riskLevel === "Very High").map((m) => (
                  <MotherCard key={m.id} mother={m} onSelect={() => { setSelectedMother(m); setScreen("anc-registration"); }} />
                ))}
              </div>
            </SectionCard>
          </div>

          <SectionCard title="All Mothers">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredMothers.slice(0, 6).map((m) => (
                <MotherCard key={m.id} mother={m} onSelect={() => { setSelectedMother(m); setScreen("anc-registration"); }} />
              ))}
            </div>
          </SectionCard>
        </div>
      )}

      {/* ── 02 ANC Registration ─────────────────────────────────────────── */}
      {screen === "anc-registration" && !selectedMother && (
        <div className="space-y-6">
          <PageHeader title="ANC Registration" subtitle="Antenatal care registration & profiles" icon={UserPlus}
            actions={<><Button variant="outline" size="sm"><Download className="mr-1.5 size-4" />Export</Button><Button size="sm"><Plus className="mr-1.5 size-4" />Register Mother</Button></>} />
          <div className="flex items-center gap-3">
            <div className="relative flex-1"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><Input className="pl-9" placeholder="Search mothers…" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div>
            <Button variant="outline" size="sm"><Filter className="mr-1.5 size-4" />Filter</Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredMothers.map((m) => <MotherCard key={m.id} mother={m} onSelect={() => setSelectedMother(m)} />)}
          </div>
        </div>
      )}

      {screen === "anc-registration" && selectedMother && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setSelectedMother(null)}><ChevronRight className="size-4 rotate-180" />Back</Button>
            <PageHeader title={selectedMother.name} subtitle={selectedMother.uhid} icon={UserPlus}
              actions={<><Button variant="outline" size="sm"><Edit3 className="mr-1.5 size-4" />Edit</Button><Button variant="outline" size="sm"><FileText className="mr-1.5 size-4" />Report</Button></>} />
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <SectionCard title="Mother Profile">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-slate-500">UHID:</span> <span className="ml-2 font-medium text-slate-900">{selectedMother.uhid}</span></div>
                  <div><span className="text-slate-500">Age:</span> <span className="ml-2 font-medium text-slate-900">{selectedMother.age} years</span></div>
                  <div><span className="text-slate-500">Blood Group:</span> <span className="ml-2 font-medium text-slate-900">{selectedMother.bloodGroup} ({selectedMother.rhFactor})</span></div>
                  <div><span className="text-slate-500">Phone:</span> <span className="ml-2 font-medium text-slate-900">{selectedMother.phone}</span></div>
                  <div><span className="text-slate-500">Husband:</span> <span className="ml-2 font-medium text-slate-900">{selectedMother.husbandName}</span></div>
                  <div><span className="text-slate-500">Emergency Contact:</span> <span className="ml-2 font-medium text-slate-900">{selectedMother.emergencyContact}</span></div>
                  <div><span className="text-slate-500">Insurance:</span> <span className="ml-2 font-medium text-slate-900">{selectedMother.insuranceProvider} — {selectedMother.insurancePolicyNo}</span></div>
                  <div className="col-span-2"><span className="text-slate-500">Allergies:</span> <span className="ml-2 font-medium text-slate-900">{selectedMother.allergies.join(", ")}</span></div>
                </div>
              </SectionCard>
              <SectionCard title="Obstetric History">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-slate-500">Gravida:</span> <span className="ml-2 font-medium text-slate-900">{selectedMother.gravida}</span></div>
                  <div><span className="text-slate-500">Para:</span> <span className="ml-2 font-medium text-slate-900">{selectedMother.para}</span></div>
                  <div><span className="text-slate-500">Abortions:</span> <span className="ml-2 font-medium text-slate-900">{selectedMother.abortions}</span></div>
                  <div><span className="text-slate-500">Living Children:</span> <span className="ml-2 font-medium text-slate-900">{selectedMother.livingChildren}</span></div>
                  <div><span className="text-slate-500">LMP:</span> <span className="ml-2 font-medium text-slate-900">{selectedMother.lmp}</span></div>
                  <div><span className="text-slate-500">EDD:</span> <span className="ml-2 font-medium text-slate-900">{selectedMother.edd}</span></div>
                  <div><span className="text-slate-500">Gestational Age:</span> <span className="ml-2 font-medium text-slate-900">{selectedMother.currentGestationalAge}</span></div>
                  <div><span className="text-slate-500">Weight:</span> <span className="ml-2 font-medium text-slate-900">{selectedMother.currentWeight} kg</span></div>
                </div>
              </SectionCard>
            </div>
            <div className="space-y-4">
              <SectionCard title="Status">
                <div className="space-y-3">
                  <div className="flex items-center justify-between"><span className="text-sm text-slate-500">Risk Level</span><StatusBadge variant={riskLevelTone(selectedMother.riskLevel)}>{selectedMother.riskLevel}</StatusBadge></div>
                  <div className="flex items-center justify-between"><span className="text-sm text-slate-500">Labor Status</span><StatusBadge variant={laborStatusTone(selectedMother.laborStatus)}>{selectedMother.laborStatus}</StatusBadge></div>
                  <div className="flex items-center justify-between"><span className="text-sm text-slate-500">ANC Visits</span><span className="font-medium text-slate-900">{selectedMother.totalANCVisits}</span></div>
                  <div className="flex items-center justify-between"><span className="text-sm text-slate-500">ANC Registered</span><span className="font-medium text-slate-900">{selectedMother.ancRegistered ? "Yes" : "No"}</span></div>
                  {selectedMother.roomAssignment && <div className="flex items-center justify-between"><span className="text-sm text-slate-500">Room</span><span className="font-medium text-slate-900">{selectedMother.roomAssignment}</span></div>}
                </div>
              </SectionCard>
              <SectionCard title="Current Vitals">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between"><span className="text-slate-500">BP</span><span className="font-medium text-slate-900">{selectedMother.bpSystolic}/{selectedMother.bpDiastolic} mmHg</span></div>
                  <div className="flex items-center justify-between"><span className="text-slate-500">Weight</span><span className="font-medium text-slate-900">{selectedMother.currentWeight} kg</span></div>
                  <div className="flex items-center justify-between"><span className="text-slate-500">Gestational Age</span><span className="font-medium text-slate-900">{selectedMother.currentGestationalAge}</span></div>
                </div>
              </SectionCard>
            </div>
          </div>
        </div>
      )}

      {/* ── 03 ANC Visits ───────────────────────────────────────────────── */}
      {screen === "anc-visits" && !selectedVisit && (
        <div className="space-y-6">
          <PageHeader title="ANC Visits" subtitle="Antenatal care visit records" icon={ClipboardList}
            actions={<><Button variant="outline" size="sm"><Download className="mr-1.5 size-4" />Export</Button><Button size="sm"><Plus className="mr-1.5 size-4" />New Visit</Button></>} />
          <div className="space-y-4">
            {ANC_VISITS.map((v) => <ANCCard key={v.id} visit={v} onSelect={() => setSelectedVisit(v)} />)}
          </div>
        </div>
      )}

      {screen === "anc-visits" && selectedVisit && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setSelectedVisit(null)}><ChevronRight className="size-4 rotate-180" />Back</Button>
            <PageHeader title={`${selectedVisit.motherName} — ANC #${selectedVisit.visitNumber}`} subtitle={selectedVisit.visitDate} icon={ClipboardList}
              actions={<><Button variant="outline" size="sm"><Edit3 className="mr-1.5 size-4" />Edit</Button><Button variant="outline" size="sm"><Printer className="mr-1.5 size-4" />Print</Button></>} />
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard title="Visit Details">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-slate-500">Visit Date:</span> <span className="ml-2 font-medium text-slate-900">{selectedVisit.visitDate}</span></div>
                <div><span className="text-slate-500">Gestational Age:</span> <span className="ml-2 font-medium text-slate-900">{selectedVisit.gestationalAge}</span></div>
                <div><span className="text-slate-500">Weight:</span> <span className="ml-2 font-medium text-slate-900">{selectedVisit.weight} kg</span></div>
                <div><span className="text-slate-500">BP:</span> <span className="ml-2 font-medium text-slate-900">{selectedVisit.bpSystolic}/{selectedVisit.bpDiastolic}</span></div>
                <div><span className="text-slate-500">Fundal Height:</span> <span className="ml-2 font-medium text-slate-900">{selectedVisit.fundalHeight} cm</span></div>
                <div><span className="text-slate-500">Fetal Heart Rate:</span> <span className="ml-2 font-medium text-slate-900">{selectedVisit.fetalHeartRate} bpm</span></div>
                <div><span className="text-slate-500">Presentation:</span> <span className="ml-2 font-medium text-slate-900">{selectedVisit.presentation}</span></div>
                <div><span className="text-slate-500">Edema:</span> <span className="ml-2 font-medium text-slate-900">{selectedVisit.edema}</span></div>
                <div><span className="text-slate-500">Hb:</span> <span className="ml-2 font-medium text-slate-900">{selectedVisit.hb} g/dL</span></div>
                <div><span className="text-slate-500">Urine Protein:</span> <span className="ml-2 font-medium text-slate-900">{selectedVisit.urineProtein}</span></div>
                <div><span className="text-slate-500">Urine Sugar:</span> <span className="ml-2 font-medium text-slate-900">{selectedVisit.urineSugar}</span></div>
                <div><span className="text-slate-500">Obstetrician:</span> <span className="ml-2 font-medium text-slate-900">{selectedVisit.obstetrician}</span></div>
              </div>
            </SectionCard>
            <SectionCard title="Medications & Supplements">
              <div className="space-y-3 text-sm">
                <div><span className="text-slate-500">Medications:</span> <span className="ml-2 font-medium text-slate-900">{selectedVisit.medications.join(", ") || "None"}</span></div>
                <div><span className="text-slate-500">Vaccinations:</span> <span className="ml-2 font-medium text-slate-900">{selectedVisit.vaccinations.join(", ") || "None"}</span></div>
                <div><span className="text-slate-500">Supplements:</span> <span className="ml-2 font-medium text-slate-900">{selectedVisit.supplements.join(", ")}</span></div>
                <div><span className="text-slate-500">Next Visit:</span> <span className="ml-2 font-medium text-slate-900">{selectedVisit.nextVisitDate}</span></div>
              </div>
            </SectionCard>
          </div>
          <SectionCard title="Clinical Notes">
            <p className="text-sm text-slate-700">{selectedVisit.notes}</p>
          </SectionCard>
        </div>
      )}

      {/* ── 04 Pregnancy Timeline ───────────────────────────────────────── */}
      {screen === "pregnancy-timeline" && (
        <div className="space-y-6">
          <PageHeader title="Pregnancy Timeline" subtitle="Track pregnancy milestones & visits" icon={Calendar} />
          <div className="space-y-6">
            {MOTHERS.filter((m) => m.ancRegistered).map((m) => (
              <div key={m.id} className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="font-semibold text-slate-900">{m.name}</h3>
                  <StatusBadge variant={riskLevelTone(m.riskLevel)}>{m.riskLevel} Risk</StatusBadge>
                  <span className="text-sm text-slate-500">GA: {m.currentGestationalAge}</span>
                </div>
                <div className="relative ml-4 border-l-2 border-rose-200 pl-6 space-y-4">
                  <div className="relative">
                    <div className="absolute -left-[31px] top-1 size-3 rounded-full bg-rose-400" />
                    <div className="text-xs font-medium text-rose-600">LMP — {m.lmp}</div>
                    <div className="text-sm text-slate-700">Last Menstrual Period recorded</div>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[31px] top-1 size-3 rounded-full bg-amber-400" />
                    <div className="text-xs font-medium text-amber-600">EDD — {m.edd}</div>
                    <div className="text-sm text-slate-700">Expected Date of Delivery</div>
                  </div>
                  {ANC_VISITS.filter((v) => v.motherId === m.id).map((v) => (
                    <div key={v.id} className="relative">
                      <div className="absolute -left-[31px] top-1 size-3 rounded-full bg-emerald-400" />
                      <div className="text-xs font-medium text-emerald-600">ANC Visit #{v.visitNumber} — {v.visitDate}</div>
                      <div className="text-sm text-slate-700">GA: {v.gestationalAge} | BP: {v.bpSystolic}/{v.bpDiastolic} | Weight: {v.weight}kg</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 05 Risk Assessment ──────────────────────────────────────────── */}
      {screen === "risk-assessment" && !selectedRisk && (
        <div className="space-y-6">
          <PageHeader title="Risk Assessment" subtitle="Maternal & fetal risk evaluation" icon={AlertTriangle}
            actions={<><Button size="sm"><Plus className="mr-1.5 size-4" />New Assessment</Button></>} />
          <div className="space-y-4">
            {RISK_ASSESSMENTS.map((ra) => <RiskCard key={ra.id} ra={ra} onSelect={() => setSelectedRisk(ra)} />)}
          </div>
        </div>
      )}

      {screen === "risk-assessment" && selectedRisk && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setSelectedRisk(null)}><ChevronRight className="size-4 rotate-180" />Back</Button>
            <PageHeader title={`${selectedRisk.motherName} — Risk Assessment`} subtitle={selectedRisk.assessmentDate} icon={AlertTriangle} />
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard title="Assessment Details">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-slate-500">Maternal Age:</span> <span className="ml-2 font-medium text-slate-900">{selectedRisk.maternalAge} years</span></div>
                <div><span className="text-slate-500">Gravida:</span> <span className="ml-2 font-medium text-slate-900">{selectedRisk.gravida}</span></div>
                <div><span className="text-slate-500">GDM:</span> <span className="ml-2 font-medium text-slate-900">{selectedRisk.gestationalDiabetes ? selectedRisk.gdmScreenResult : "Negative"}</span></div>
                <div><span className="text-slate-500">PIH:</span> <span className="ml-2 font-medium text-slate-900">{selectedRisk.pregnancyInducedHypertension ? selectedRisk.pihtResult : "Normal"}</span></div>
                <div><span className="text-slate-500">Pre-eclampsia Score:</span> <span className="ml-2 font-medium text-slate-900">{selectedRisk.preEclampsiaScore}/10</span></div>
                <div><span className="text-slate-500">Pre-eclampsia Risk:</span> <span className="ml-2 font-medium text-slate-900">{selectedRisk.preEclampsiaRisk}</span></div>
                <div><span className="text-slate-500">Previous C-Section:</span> <span className="ml-2 font-medium text-slate-900">{selectedRisk.previousCesarean ? `Yes (${selectedRisk.previousCesareanCount})` : "No"}</span></div>
                <div><span className="text-slate-500">Multiple Pregnancy:</span> <span className="ml-2 font-medium text-slate-900">{selectedRisk.multiplePregnancy ? "Yes" : "No"}</span></div>
              </div>
            </SectionCard>
            <SectionCard title="Risk Factors & Care Plan">
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-slate-500">Overall Risk:</span>
                  <StatusBadge variant={riskLevelTone(selectedRisk.overallRisk)}>{selectedRisk.overallRisk}</StatusBadge>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedRisk.riskFactors.map((f) => (
                    <span key={f} className="px-2 py-0.5 bg-red-50 text-red-700 text-xs rounded-full font-medium">{f}</span>
                  ))}
                </div>
                <div>
                  <span className="text-sm font-medium text-slate-500">Care Plan:</span>
                  <p className="mt-1 text-sm text-slate-700">{selectedRisk.carePlan}</p>
                </div>
                <div><span className="text-sm text-slate-500">Assessed By:</span> <span className="ml-2 text-sm font-medium text-slate-900">{selectedRisk.assessedBy}</span></div>
              </div>
            </SectionCard>
          </div>
        </div>
      )}

      {/* ── 06 Ultrasound ───────────────────────────────────────────────── */}
      {screen === "ultrasound" && !selectedUS && (
        <div className="space-y-6">
          <PageHeader title="Ultrasound" subtitle="Obstetric ultrasound & imaging" icon={Activity}
            actions={<><Button size="sm"><Plus className="mr-1.5 size-4" />New Scan</Button></>} />
          <div className="space-y-4">
            {ULTRASOUNDS.map((us) => <USCard key={us.id} us={us} onSelect={() => setSelectedUS(us)} />)}
          </div>
        </div>
      )}

      {screen === "ultrasound" && selectedUS && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setSelectedUS(null)}><ChevronRight className="size-4 rotate-180" />Back</Button>
            <PageHeader title={`${selectedUS.motherName} — ${selectedUS.scanType}`} subtitle={selectedUS.scanDate} icon={Activity}
              actions={<Button variant="outline" size="sm"><Printer className="mr-1.5 size-4" />Print Report</Button>} />
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard title="Biometry">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-slate-500">BPD:</span> <span className="ml-2 font-medium text-slate-900">{selectedUS.biparietalDiameter} cm</span></div>
                <div><span className="text-slate-500">FL:</span> <span className="ml-2 font-medium text-slate-900">{selectedUS.femurLength} cm</span></div>
                <div><span className="text-slate-500">AC:</span> <span className="ml-2 font-medium text-slate-900">{selectedUS.abdominalCircumference} cm</span></div>
                <div><span className="text-slate-500">EFW:</span> <span className="ml-2 font-medium text-slate-900">{selectedUS.estimatedFetalWeight} g</span></div>
                <div><span className="text-slate-500">AFI:</span> <span className="ml-2 font-medium text-slate-900">{selectedUS.amnioticFluidIndex}</span></div>
                <div><span className="text-slate-500">Placenta:</span> <span className="ml-2 font-medium text-slate-900">{selectedUS.placentaPosition}</span></div>
                <div><span className="text-slate-500">Gestational Age:</span> <span className="ml-2 font-medium text-slate-900">{selectedUS.gestationalAge}</span></div>
                {selectedUS.dopplerAssessment && <div className="col-span-2"><span className="text-slate-500">Doppler:</span> <span className="ml-2 font-medium text-slate-900">{selectedUS.dopplerAssessment}</span></div>}
              </div>
            </SectionCard>
            <SectionCard title="Findings">
              <p className="text-sm text-slate-700">{selectedUS.findings}</p>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2"><span className="text-slate-500">Anomaly Screen:</span> {selectedUS.anomalyScreened ? <StatusBadge variant="success">Done</StatusBadge> : <StatusBadge variant="info">Pending</StatusBadge>}</div>
                <div className="flex items-center gap-2"><span className="text-slate-500">Growth Scan:</span> {selectedUS.growthScanDone ? <StatusBadge variant="success">Done</StatusBadge> : <StatusBadge variant="info">Pending</StatusBadge>}</div>
              </div>
              <div className="mt-3 text-sm">
                <div><span className="text-slate-500">Performed By:</span> <span className="ml-2 font-medium text-slate-900">{selectedUS.performedBy}</span></div>
                <div><span className="text-slate-500">Reported By:</span> <span className="ml-2 font-medium text-slate-900">{selectedUS.reportedBy}</span></div>
              </div>
            </SectionCard>
          </div>
        </div>
      )}

      {/* ── 07 Labor Admission ──────────────────────────────────────────── */}
      {screen === "labor-admission" && !selectedAdmission && (
        <div className="space-y-6">
          <PageHeader title="Labor Admission" subtitle="Labor room admissions & monitoring" icon={Stethoscope}
            actions={<><Button size="sm"><Plus className="mr-1.5 size-4" />New Admission</Button></>} />
          <div className="space-y-4">
            {LABOR_ADMISSIONS.map((a) => <LaborCard key={a.id} admission={a} onSelect={() => setSelectedAdmission(a)} />)}
            {LABOR_ADMISSIONS.length === 0 && (
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 text-center">
                <Stethoscope className="mx-auto size-8 text-slate-300" />
                <p className="mt-2 text-sm text-slate-500">No labor admissions currently</p>
              </div>
            )}
          </div>
        </div>
      )}

      {screen === "labor-admission" && selectedAdmission && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setSelectedAdmission(null)}><ChevronRight className="size-4 rotate-180" />Back</Button>
            <PageHeader title={`${selectedAdmission.motherName} — Labor Admission`} subtitle={selectedAdmission.laborRoom} icon={Stethoscope}
              actions={<><Button variant="outline" size="sm"><Edit3 className="mr-1.5 size-4" />Edit</Button><Button variant="outline" size="sm"><Printer className="mr-1.5 size-4" />Print</Button></>} />
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard title="Admission Details">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-slate-500">Admission Time:</span> <span className="ml-2 font-medium text-slate-900">{selectedAdmission.admissionTime}</span></div>
                <div><span className="text-slate-500">Gestational Age:</span> <span className="ml-2 font-medium text-slate-900">{selectedAdmission.gestationalAge}</span></div>
                <div><span className="text-slate-500">Cervical Dilatation:</span> <span className="ml-2 font-medium text-slate-900">{selectedAdmission.cervicalDilatation} cm</span></div>
                <div><span className="text-slate-500">Effacement:</span> <span className="ml-2 font-medium text-slate-900">{selectedAdmission.cervicalEffacement}%</span></div>
                <div><span className="text-slate-500">Membrane:</span> <span className="ml-2 font-medium text-slate-900">{selectedAdmission.membraneStatus}</span></div>
                <div><span className="text-slate-500">Pain Score:</span> <span className="ml-2 font-medium text-slate-900">{selectedAdmission.painScore}/10</span></div>
                <div><span className="text-slate-500">Presentation:</span> <span className="ml-2 font-medium text-slate-900">{selectedAdmission.presentingPart}</span></div>
                <div><span className="text-slate-500">Contractions:</span> <span className="ml-2 font-medium text-slate-900">{selectedAdmission.contractions}</span></div>
              </div>
            </SectionCard>
            <SectionCard title="Staff Assignment">
              <div className="space-y-3 text-sm">
                <div><span className="text-slate-500">Obstetrician:</span> <span className="ml-2 font-medium text-slate-900">{selectedAdmission.obstetrician}</span></div>
                <div><span className="text-slate-500">Midwife:</span> <span className="ml-2 font-medium text-slate-900">{selectedAdmission.midwife}</span></div>
                <div><span className="text-slate-500">Labor Room:</span> <span className="ml-2 font-medium text-slate-900">{selectedAdmission.laborRoom}</span></div>
                <div><span className="text-slate-500">Status:</span> <StatusBadge variant={laborStatusTone(selectedAdmission.status)}>{selectedAdmission.status}</StatusBadge></div>
              </div>
            </SectionCard>
          </div>
          <SectionCard title="Admission Notes">
            <p className="text-sm text-slate-700">{selectedAdmission.admissionNotes}</p>
          </SectionCard>
        </div>
      )}

      {/* ── 08 Partograph ───────────────────────────────────────────────── */}
      {screen === "partograph" && (
        <div className="space-y-6">
          <PageHeader title="Partograph Monitoring" subtitle="Cervical dilatation & labor progress tracking" icon={Activity} />
          {PARTOGRAPHS.length > 0 ? (
            <div className="space-y-6">
              {PARTOGRAPHS.map((pg) => <PartographPreview key={pg.id} pg={pg} />)}
            </div>
          ) : (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 text-center">
              <Activity className="mx-auto size-8 text-slate-300" />
              <p className="mt-2 text-sm text-slate-500">No active partographs</p>
            </div>
          )}
        </div>
      )}

      {/* ── 09 CTG / Fetal Monitoring ───────────────────────────────────── */}
      {screen === "ctg-monitoring" && (
        <div className="space-y-6">
          <PageHeader title="CTG / Fetal Monitoring" subtitle="Cardiotocography & fetal heart rate monitoring" icon={Heart} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {LABOR_ADMISSIONS.filter((a) => a.status === "Active Labor").map((a) => {
              const mother = MOTHERS.find((m) => m.id === a.motherId);
              return (
                <div key={a.id} className="rounded-xl border border-rose-200 bg-rose-50/50 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Heart className="size-4 text-rose-500" />
                    <h4 className="font-semibold text-sm text-slate-900">{a.motherName}</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-slate-500">FHR:</span><span className="font-bold text-slate-900">{mother?.bpSystolic ? "140" : "144"} bpm</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Contractions:</span><span className="font-medium text-slate-900">{a.contractions}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Cervix:</span><span className="font-medium text-slate-900">{a.cervicalDilatation}cm</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">CTG Status:</span><StatusBadge variant="success">Normal</StatusBadge></div>
                  </div>
                </div>
              );
            })}
            {LABOR_ADMISSIONS.filter((a) => a.status === "Active Labor").length === 0 && (
              <div className="col-span-3 rounded-xl border border-gray-200 bg-gray-50 p-8 text-center">
                <Heart className="mx-auto size-8 text-slate-300" />
                <p className="mt-2 text-sm text-slate-500">No active CTG monitoring</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── 10 Delivery Management ──────────────────────────────────────── */}
      {screen === "delivery-management" && (
        <div className="space-y-6">
          <PageHeader title="Delivery Management" subtitle="Delivery recording & documentation" icon={Baby} />
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
            <Baby className="mx-auto size-8 text-slate-300" />
            <p className="mt-2 text-sm text-slate-500">No deliveries recorded today</p>
            <Button size="sm" className="mt-4"><Plus className="mr-1.5 size-4" />Record Delivery</Button>
          </div>
          <SectionCard title="Recent Deliveries">
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs text-slate-500">
                  <tr><th className="px-4 py-3 font-medium">Mother</th><th className="px-4 py-3 font-medium">Date</th><th className="px-4 py-3 font-medium">Type</th><th className="px-4 py-3 font-medium">Outcome</th><th className="px-4 py-3 font-medium">Doctor</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr className="hover:bg-gray-50/50"><td className="px-4 py-3 text-slate-500" colSpan={5}>No delivery records available</td></tr>
                </tbody>
              </table>
            </div>
          </SectionCard>
        </div>
      )}

      {/* ── 11 Newborn Record ───────────────────────────────────────────── */}
      {screen === "newborn-record" && (
        <div className="space-y-6">
          <PageHeader title="Newborn Record" subtitle="Birth records & neonatal assessment" icon={Baby} />
          {NEWBORNS.length > 0 ? (
            <div className="space-y-4">
              {NEWBORNS.map((nb) => <NewbornCard key={nb.id} nb={nb} />)}
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
              <Baby className="mx-auto size-8 text-slate-300" />
              <p className="mt-2 text-sm text-slate-500">No newborn records yet</p>
            </div>
          )}
        </div>
      )}

      {/* ── 12 Postpartum Care ──────────────────────────────────────────── */}
      {screen === "postpartum-care" && (
        <div className="space-y-6">
          <PageHeader title="Postpartum Care" subtitle="Post-delivery maternal recovery monitoring" icon={Heart} />
          {POSTPARTUM_CARES.length > 0 ? (
            <div className="space-y-4">
              {POSTPARTUM_CARES.map((pc) => <PostpartumCard key={pc.id} pc={pc} />)}
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
              <Heart className="mx-auto size-8 text-slate-300" />
              <p className="mt-2 text-sm text-slate-500">No postpartum records yet</p>
            </div>
          )}
        </div>
      )}

      {/* ── 13 Lactation Support ────────────────────────────────────────── */}
      {screen === "lactation-support" && (
        <div className="space-y-6">
          <PageHeader title="Lactation Support" subtitle="Breastfeeding assessment & counselling" icon={Activity} />
          {LACTATION_SUPPORTS.length > 0 ? (
            <div className="space-y-4">
              {LACTATION_SUPPORTS.map((ls) => <LactationCard key={ls.id} ls={ls} />)}
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
              <Activity className="mx-auto size-8 text-slate-300" />
              <p className="mt-2 text-sm text-slate-500">No lactation records yet</p>
            </div>
          )}
        </div>
      )}

      {/* ── 14 Mother & Baby Dashboard ──────────────────────────────────── */}
      {screen === "mother-baby-dashboard" && (
        <div className="space-y-6">
          <PageHeader title="Mother & Baby Dashboard" subtitle="Unified view of mother and neonate care" icon={Users} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total Mothers" value={MATERNITY_KPI.totalMothers} icon={Users} />
            <StatCard label="Active Mothers" value={MATERNITY_KPI.activeMothers} icon={Heart} />
            <StatCard label="Labor Admissions" value={MATERNITY_KPI.laborAdmissions} icon={Stethoscope} />
            <StatCard label="High Risk" value={MATERNITY_KPI.highRiskPregnancies} icon={AlertTriangle} />
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard title="Mothers in Labor">
              <div className="space-y-3">
                {MOTHERS.filter((m) => m.laborStatus !== "Not in Labor").map((m) => (
                  <MotherCard key={m.id} mother={m} />
                ))}
                {MOTHERS.filter((m) => m.laborStatus !== "Not in Labor").length === 0 && (
                  <p className="text-sm text-slate-500">No mothers currently in labor</p>
                )}
              </div>
            </SectionCard>
            <SectionCard title="All Mothers Overview">
              <div className="space-y-3">
                {MOTHERS.slice(0, 5).map((m) => (
                  <MotherCard key={m.id} mother={m} />
                ))}
              </div>
            </SectionCard>
          </div>
        </div>
      )}

      {/* ── 15 Discharge Planning ───────────────────────────────────────── */}
      {screen === "discharge-planning" && (
        <div className="space-y-6">
          <PageHeader title="Discharge Planning" subtitle="Mother & baby discharge readiness" icon={FileText} />
          <SectionCard title="Discharge Checklist">
            <div className="space-y-3">
              {["Maternal vitals stable", "Involution of uterus satisfactory", "Lochia normal", "Breastfeeding established", "Baby feeding well", "Baby weight > 2500g", "Vitamin K given", "Newborn screening done", "Discharge medications dispensed", "Follow-up appointment scheduled"].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <div className="size-4 rounded border border-slate-300" />
                  <span className="text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </SectionCard>
          <SectionCard title="Ready for Discharge">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 text-center">
              <FileText className="mx-auto size-8 text-slate-300" />
              <p className="mt-2 text-sm text-slate-500">No mothers currently ready for discharge</p>
            </div>
          </SectionCard>
        </div>
      )}

      {/* ── 16 Reports & Analytics ──────────────────────────────────────── */}
      {screen === "reports-analytics" && (
        <div className="space-y-6">
          <PageHeader title="Reports & Analytics" subtitle="Maternity department performance metrics" icon={BarChart3}
            actions={<><Button variant="outline" size="sm"><Download className="mr-1.5 size-4" />Export Report</Button></>} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total Deliveries (Month)" value={MATERNITY_KPI.totalDeliveriesThisMonth} icon={Baby} />
            <StatCard label="C-Section Rate" value={`${MATERNITY_KPI.cesareanRate}%`} icon={Zap} />
            <StatCard label="Preterm Rate" value={`${MATERNITY_KPI.pretermRate}%`} icon={AlertTriangle} />
            <StatCard label="Maternal Mortality" value={MATERNITY_KPI.maternalMortality} icon={Heart} />
          </div>
          <SectionCard title="Monthly Delivery Statistics">
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs text-slate-500">
                  <tr><th className="px-4 py-3 font-medium">Month</th><th className="px-4 py-3 font-medium">Normal</th><th className="px-4 py-3 font-medium">C-Section</th><th className="px-4 py-3 font-medium">Assisted</th><th className="px-4 py-3 font-medium">Total</th><th className="px-4 py-3 font-medium">NICU Admits</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr className="hover:bg-gray-50/50"><td className="px-4 py-3 font-medium text-slate-900">July 2026</td><td className="px-4 py-3 text-slate-600">28</td><td className="px-4 py-3 text-slate-600">12</td><td className="px-4 py-3 text-slate-600">5</td><td className="px-4 py-3 font-medium text-slate-900">45</td><td className="px-4 py-3 text-slate-600">4</td></tr>
                  <tr className="hover:bg-gray-50/50"><td className="px-4 py-3 font-medium text-slate-900">June 2026</td><td className="px-4 py-3 text-slate-600">30</td><td className="px-4 py-3 text-slate-600">10</td><td className="px-4 py-3 text-slate-600">6</td><td className="px-4 py-3 font-medium text-slate-900">46</td><td className="px-4 py-3 text-slate-600">3</td></tr>
                  <tr className="hover:bg-gray-50/50"><td className="px-4 py-3 font-medium text-slate-900">May 2026</td><td className="px-4 py-3 text-slate-600">32</td><td className="px-4 py-3 text-slate-600">11</td><td className="px-4 py-3 text-slate-600">4</td><td className="px-4 py-3 font-medium text-slate-900">47</td><td className="px-4 py-3 text-slate-600">2</td></tr>
                </tbody>
              </table>
            </div>
          </SectionCard>
        </div>
      )}

      {/* ── 17 Quality & Compliance ─────────────────────────────────────── */}
      {screen === "quality-compliance" && (
        <div className="space-y-6">
          <PageHeader title="Quality & Compliance" subtitle="Quality metrics, audits & regulatory compliance" icon={Shield} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Maternal Mortality" value={MATERNITY_KPI.maternalMortality} icon={Heart} />
            <StatCard label="NICU Admission Rate" value={`${MATERNITY_KPI.nicuAdmissionRate}%`} icon={Activity} />
            <StatCard label="Preterm Rate" value={`${MATERNITY_KPI.pretermRate}%`} icon={AlertTriangle} />
            <StatCard label="C-Section Rate" value={`${MATERNITY_KPI.cesareanRate}%`} icon={Zap} />
          </div>
          <SectionCard title="Audit Trail">
            <div className="space-y-1">
              {AUDIT_LOGS.map((log) => <AuditRow key={log.id} log={log} />)}
            </div>
          </SectionCard>
          <SectionCard title="Compliance Checklist">
            <div className="space-y-3">
              {["Partograph documentation for all labors", "Vital signs monitoring every 15 min in active labor", "Emergency cesarean within 30 minutes protocol", "Newborn identification band verification", "Vitamin K administration for all neonates", "Blood transfusion consent documentation", "Infection control audit — hand hygiene compliance", "Fire safety drill — quarterly completed"].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  {i < 6 ? <CheckCircle2 className="size-4 text-emerald-500" /> : <AlertTriangle className="size-4 text-amber-500" />}
                  <span className="text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      )}

      {/* ── 18 Workflow Complete ──────────────────────────────────────────── */}
      {screen === "workflow-complete" && (
        <div className="space-y-6">
          <PageHeader title="Workflow Complete" subtitle="All maternity processes completed" icon={CheckCircle2} />
          <div className="flex flex-col items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50/50 py-16 text-center">
            <div className="grid size-16 place-items-center rounded-full bg-emerald-100"><CheckCircle2 className="size-8 text-emerald-600" /></div>
            <h2 className="mt-4 text-xl font-bold text-slate-900">All Processes Complete</h2>
            <p className="mt-2 max-w-md text-sm text-slate-500">
              ANC documentation, labor monitoring, delivery records, and audit trail maintained.
            </p>
            <div className="mt-6 flex gap-3">
              <Button variant="outline"><Download className="mr-1.5 size-4" />Download Summary</Button>
              <Button onClick={() => setScreen("mty-dashboard")}>Return to Dashboard</Button>
            </div>
          </div>
        </div>
      )}

    </Shell>
  );
}
