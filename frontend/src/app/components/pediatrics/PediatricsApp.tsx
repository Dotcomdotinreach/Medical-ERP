import { useState, useMemo } from "react";
import {
  LayoutDashboard, UserPlus, ClipboardList, Calendar, Heart, Activity,
  Stethoscope, Baby as BabyIcon, BarChart3, Shield, CheckCircle2, AlertTriangle,
  ChevronRight, Download, Filter, Plus, RefreshCw, Eye, Edit3, Search,
  FileText, Printer, TrendingUp, Users, Zap, Target, Cpu, Pill, Clock,
} from "lucide-react";
import { Shell, type Workspace } from "../his/Shell";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  BABIES, NICU_BEDS, GROWTH_RECORDS, VACCINATIONS, PEDIATRIC_OPDS,
  VENTILATOR_RECORDS, CPAP_RECORDS, PHOTOTHERAPY_RECORDS, FEEDING_RECORDS,
  MEDICATION_RECORDS, DISCHARGE_RECORDS, AUDIT_LOGS, PEDIATRICS_KPI,
  nicuStatusTone, admissionStatusTone, bedStatusTone,
  type Baby, type NICUBed, type GrowthRecord,
} from "./data";
import {
  BabyCard, NICUBedCard, GrowthCard, VaccinationCard, VentilatorCard,
  CPAPCard, PhototherapyCard, FeedingCard, MedicationCard, DischargeCard,
  AuditRow, StatusPill, NICUStatusBadge, PhototherapyStatusBadge,
} from "./pediatricsUi";
import { StatusBadge, StatCard, SectionCard, PageHeader } from "../his/ui";

type PdRoute =
  | "pd-dashboard" | "patient-registry" | "newborn-assessment" | "growth-monitoring"
  | "development-tracking" | "vaccination-management" | "pediatric-opd"
  | "nicu-admission" | "nicu-monitoring" | "incubator-warmer" | "feeding-management"
  | "phototherapy" | "ventilator-support" | "medication-admin"
  | "discharge-planning" | "reports-analytics" | "quality-compliance" | "workflow-complete";

const NAV = [
  { id: "pd-dashboard", label: "Pediatrics Dashboard", icon: LayoutDashboard },
  { id: "patient-registry", label: "Patient Registry", icon: Users },
  { id: "newborn-assessment", label: "Newborn Assessment", icon: BabyIcon },
  { id: "growth-monitoring", label: "Growth Monitoring", icon: TrendingUp },
  { id: "development-tracking", label: "Development Tracking", icon: Activity },
  { id: "vaccination-management", label: "Vaccinations", icon: Shield, badge: "6", tone: "warning" as const },
  { id: "pediatric-opd", label: "Pediatric OPD", icon: Stethoscope },
  { id: "nicu-admission", label: "NICU Admission", icon: BabyIcon },
  { id: "nicu-monitoring", label: "NICU Monitoring", icon: Activity, badge: "1", tone: "danger" as const },
];

const NAV_SECONDARY = [
  { id: "incubator-warmer", label: "Incubators & Warmers", icon: Cpu },
  { id: "feeding-management", label: "Feeding Management", icon: Heart },
  { id: "phototherapy", label: "Phototherapy", icon: Zap },
  { id: "ventilator-support", label: "Ventilator Support", icon: Cpu },
  { id: "medication-admin", label: "Medications", icon: Pill },
  { id: "discharge-planning", label: "Discharge Planning", icon: FileText },
  { id: "reports-analytics", label: "Reports & Analytics", icon: BarChart3 },
  { id: "quality-compliance", label: "Quality & Compliance", icon: Shield },
  { id: "workflow-complete", label: "Workflow Complete", icon: CheckCircle2 },
];

export function PediatricsApp({ roleName, onSignOut, onSwitchWorkspace, onOpenSettings }: {
  roleName: string; onSignOut: () => void; onSwitchWorkspace: (w: Workspace) => void; onOpenSettings?: (page: string) => void;
}) {
  const [screen, setScreen] = useState<PdRoute>("pd-dashboard");
  const [selectedBaby, setSelectedBaby] = useState<Baby | null>(null);
  const [selectedBed, setSelectedBed] = useState<NICUBed | null>(null);
  const [selectedGrowth, setSelectedGrowth] = useState<GrowthRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const breadcrumb = useMemo(() => {
    const crumb = ["Pediatrics"];
    const nav = [...NAV, ...NAV_SECONDARY].find((n) => n.id === screen);
    if (nav) crumb.push(nav.label);
    if (selectedBaby) crumb.splice(2, 0, selectedBaby.name);
    return crumb;
  }, [screen, selectedBaby]);

  const filteredBabies = BABIES.filter((b) =>
    !searchQuery || b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.babyId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.motherName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Shell
      nav={NAV}
      navSecondary={NAV_SECONDARY}
      sectionLabel="Pediatrics & NICU"
      activeId={screen}
      isActive={(id) => id === screen}
      onNavigate={(id) => { setScreen(id as PdRoute); setSelectedBaby(null); setSelectedBed(null); setSelectedGrowth(null); }}
      breadcrumb={breadcrumb}
      roleName={roleName}
      onSignOut={onSignOut}
      workspace="pediatrics"
      onSwitchWorkspace={onSwitchWorkspace}
      onOpenSettings={onOpenSettings}
      searchPlaceholder="Search babies, mothers, UHID…"
    >
      {/* 01 Dashboard */}
      {screen === "pd-dashboard" && (
        <div className="space-y-6">
          <PageHeader title="Pediatrics Dashboard" subtitle="Neonatal & pediatric care operations" icon={LayoutDashboard}
            actions={<><Button variant="outline" size="sm"><RefreshCw className="mr-1.5 size-4" />Refresh</Button><Button variant="outline" size="sm"><Download className="mr-1.5 size-4" />Export</Button></>} />
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard label="Total Babies" value={PEDIATRICS_KPI.totalBabies} icon={BabyIcon} />
            <StatCard label="Active NICU" value={PEDIATRICS_KPI.activeNICU} icon={Activity} />
            <StatCard label="Available Beds" value={`${PEDIATRICS_KPI.availableNICUBeds}/${PEDIATRICS_KPI.totalNICUBeds}`} icon={Target} />
            <StatCard label="Critical" value={PEDIATRICS_KPI.criticalBabies} icon={AlertTriangle} />
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard label="Today OPD" value={PEDIATRICS_KPI.todayOPDVisits} icon={Stethoscope} />
            <StatCard label="Vaccinations Due" value={PEDIATRICS_KPI.vaccinationsDue} icon={Shield} />
            <StatCard label="Discharges" value={PEDIATRICS_KPI.dischargesToday} icon={CheckCircle2} />
            <StatCard label="Vacc Rate" value={`${PEDIATRICS_KPI.vaccinationCoverage}%`} icon={TrendingUp} />
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard title="NICU Census" actions={<Button variant="outline" size="sm" onClick={() => setScreen("nicu-monitoring")}>View All</Button>}>
              <div className="space-y-3">
                {BABIES.filter((b) => b.nicuStatus === "Critical" || b.nicuStatus === "Admitted").map((b) => (
                  <div key={b.id} className={`rounded-xl border-2 p-4 ${b.nicuStatus === "Critical" ? "border-red-200 bg-red-50/50" : "border-amber-200 bg-amber-50/50"}`}>
                    <div className="flex items-start justify-between">
                      <div><div className="font-semibold text-slate-900">{b.name}</div><div className="text-sm text-slate-600">{b.nicuBed} · GA: {b.gestationalAge} · WT: {b.currentWeight}g</div></div>
                      <NICUStatusBadge status={b.nicuStatus} />
                    </div>
                    <div className="mt-3 grid grid-cols-4 gap-2 text-center text-xs">
                      <div className="rounded bg-white p-1.5"><div className="text-slate-500">HR</div><div className="font-bold text-slate-900">{b.heartRate}</div></div>
                      <div className="rounded bg-white p-1.5"><div className="text-slate-500">RR</div><div className="font-bold text-slate-900">{b.respiratoryRate}</div></div>
                      <div className="rounded bg-white p-1.5"><div className="text-slate-500">SpO₂</div><div className={`font-bold ${b.spo2 < 90 ? "text-red-600" : "text-slate-900"}`}>{b.spo2}%</div></div>
                      <div className="rounded bg-white p-1.5"><div className="text-slate-500">Temp</div><div className="font-bold text-slate-900">{b.temperature}°C</div></div>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
            <SectionCard title="NICU Beds">
              <div className="grid grid-cols-4 gap-2">
                {NICU_BEDS.map((bed) => (
                  <div key={bed.id} className={`rounded-lg border-2 p-2 text-center ${bed.status === "Available" ? "border-emerald-200 bg-emerald-50" : bed.status === "Occupied" ? "border-amber-200 bg-amber-50" : "border-red-200 bg-red-50"}`}>
                    <div className="text-[10px] font-medium text-slate-900">{bed.bedNumber}</div>
                    <div className={`mt-1 text-xs font-bold ${bed.status === "Available" ? "text-emerald-600" : bed.status === "Occupied" ? "text-amber-600" : "text-red-600"}`}>{bed.status === "Available" ? "READY" : bed.status === "Occupied" ? "IN USE" : "MAINT"}</div>
                    {bed.currentBaby && <div className="mt-0.5 text-[9px] text-amber-600 truncate">{bed.currentBaby}</div>}
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
          <SectionCard title="Vaccination Due">
            <div className="space-y-3">{VACCINATIONS.filter((v) => v.status === "Due" || v.status === "Missed").slice(0, 5).map((v) => <VaccinationCard key={v.id} vax={v} />)}</div>
          </SectionCard>
        </div>
      )}

      {/* 02 Patient Registry */}
      {screen === "patient-registry" && !selectedBaby && (
        <div className="space-y-6">
          <PageHeader title="Patient Registry" subtitle={`${BABIES.length} babies registered`} icon={Users}
            actions={<><Button variant="outline" size="sm"><Download className="mr-1.5 size-4" />Export</Button><Button size="sm"><Plus className="mr-1.5 size-4" />Register</Button></>} />
          <div className="flex items-center gap-3">
            <div className="relative flex-1"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><Input className="pl-9" placeholder="Search babies…" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div>
            <Button variant="outline" size="sm"><Filter className="mr-1.5 size-4" />Filter</Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{filteredBabies.map((b) => <BabyCard key={b.id} baby={b} onSelect={() => setSelectedBaby(b)} />)}</div>
        </div>
      )}
      {screen === "patient-registry" && selectedBaby && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setSelectedBaby(null)}><ChevronRight className="size-4 rotate-180" />Back</Button>
            <PageHeader title={selectedBaby.name} subtitle={selectedBaby.babyId} icon={BabyIcon} actions={<><Button variant="outline" size="sm"><Edit3 className="mr-1.5 size-4" />Edit</Button></>} />
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <SectionCard title="Birth Details"><div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-slate-500">Baby ID:</span> <span className="ml-2 font-medium text-slate-900">{selectedBaby.babyId}</span></div>
                <div><span className="text-slate-500">UHID:</span> <span className="ml-2 font-medium text-slate-900">{selectedBaby.uhid}</span></div>
                <div><span className="text-slate-500">DOB:</span> <span className="ml-2 font-medium text-slate-900">{selectedBaby.dateOfBirth} {selectedBaby.timeOfBirth}</span></div>
                <div><span className="text-slate-500">Gender:</span> <span className="ml-2 font-medium text-slate-900">{selectedBaby.gender}</span></div>
                <div><span className="text-slate-500">Weight:</span> <span className="ml-2 font-medium text-slate-900">{selectedBaby.birthWeight}g</span></div>
                <div><span className="text-slate-500">Length:</span> <span className="ml-2 font-medium text-slate-900">{selectedBaby.birthLength}cm</span></div>
                <div><span className="text-slate-500">HC:</span> <span className="ml-2 font-medium text-slate-900">{selectedBaby.headCircumference}cm</span></div>
                <div><span className="text-slate-500">GA:</span> <span className="ml-2 font-medium text-slate-900">{selectedBaby.gestationalAge}</span></div>
                <div><span className="text-slate-500">Type:</span> <span className="ml-2 font-medium text-slate-900">{selectedBaby.birthType}</span></div>
                <div><span className="text-slate-500">Blood:</span> <span className="ml-2 font-medium text-slate-900">{selectedBaby.bloodGroup} {selectedBaby.rhFactor}</span></div>
                <div><span className="text-slate-500">APGAR:</span> <span className="ml-2 font-medium text-slate-900">{selectedBaby.apgar1min}/{selectedBaby.apgar5min}/{selectedBaby.apgar10min}</span></div>
                <div><span className="text-slate-500">Anomalies:</span> <span className="ml-2 font-medium text-slate-900">{selectedBaby.congenitalAnomalies.length > 0 ? selectedBaby.congenitalAnomalies.join(", ") : "None"}</span></div>
              </div></SectionCard>
              <SectionCard title="Guardian"><div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-slate-500">Name:</span> <span className="ml-2 font-medium text-slate-900">{selectedBaby.guardianName}</span></div>
                <div><span className="text-slate-500">Relation:</span> <span className="ml-2 font-medium text-slate-900">{selectedBaby.guardianRelation}</span></div>
                <div><span className="text-slate-500">Phone:</span> <span className="ml-2 font-medium text-slate-900">{selectedBaby.guardianPhone}</span></div>
                <div><span className="text-slate-500">Mother:</span> <span className="ml-2 font-medium text-slate-900">{selectedBaby.motherName}</span></div>
              </div></SectionCard>
            </div>
            <div className="space-y-4">
              <SectionCard title="Status"><div className="space-y-3">
                <div className="flex items-center justify-between"><span className="text-sm text-slate-500">NICU</span><NICUStatusBadge status={selectedBaby.nicuStatus} /></div>
                {selectedBaby.nicuBed && <div className="flex items-center justify-between"><span className="text-sm text-slate-500">Bed</span><span className="font-medium text-slate-900">{selectedBaby.nicuBed}</span></div>}
                <div className="flex items-center justify-between"><span className="text-sm text-slate-500">Vaccines</span><span className="font-medium text-slate-900">{selectedBaby.vaccinationsDone}/{selectedBaby.vaccinationsDone + selectedBaby.vaccinationsDue}</span></div>
              </div></SectionCard>
              <SectionCard title="Vitals"><div className="space-y-3 text-sm">
                <div className="flex items-center justify-between"><span className="text-slate-500">Temp</span><span className="font-medium text-slate-900">{selectedBaby.temperature}°C</span></div>
                <div className="flex items-center justify-between"><span className="text-slate-500">HR</span><span className="font-medium text-slate-900">{selectedBaby.heartRate} bpm</span></div>
                <div className="flex items-center justify-between"><span className="text-slate-500">RR</span><span className="font-medium text-slate-900">{selectedBaby.respiratoryRate} /min</span></div>
                <div className="flex items-center justify-between"><span className="text-slate-500">SpO₂</span><span className={`font-medium ${selectedBaby.spo2 < 90 ? "text-red-600" : "text-slate-900"}`}>{selectedBaby.spo2}%</span></div>
              </div></SectionCard>
            </div>
          </div>
        </div>
      )}

      {/* 03 Newborn Assessment */}
      {screen === "newborn-assessment" && !selectedBaby && (
        <div className="space-y-6">
          <PageHeader title="Newborn Assessment" subtitle="Birth assessment & APGAR" icon={BabyIcon} actions={<Button size="sm"><Plus className="mr-1.5 size-4" />New</Button>} />
          <div className="space-y-4">{BABIES.map((b) => <BabyCard key={b.id} baby={b} onSelect={() => setSelectedBaby(b)} />)}</div>
        </div>
      )}
      {screen === "newborn-assessment" && selectedBaby && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setSelectedBaby(null)}><ChevronRight className="size-4 rotate-180" />Back</Button>
            <PageHeader title={`${selectedBaby.name} — Assessment`} subtitle={selectedBaby.babyId} icon={BabyIcon} />
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard title="APGAR Score"><div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-slate-50 rounded-xl p-4"><div className="text-xs text-slate-500">1 Min</div><div className={`text-3xl font-bold mt-1 ${selectedBaby.apgar1min >= 7 ? "text-emerald-600" : selectedBaby.apgar1min >= 4 ? "text-amber-600" : "text-red-600"}`}>{selectedBaby.apgar1min}</div></div>
              <div className="bg-slate-50 rounded-xl p-4"><div className="text-xs text-slate-500">5 Min</div><div className={`text-3xl font-bold mt-1 ${selectedBaby.apgar5min >= 7 ? "text-emerald-600" : selectedBaby.apgar5min >= 4 ? "text-amber-600" : "text-red-600"}`}>{selectedBaby.apgar5min}</div></div>
              <div className="bg-slate-50 rounded-xl p-4"><div className="text-xs text-slate-500">10 Min</div><div className={`text-3xl font-bold mt-1 ${selectedBaby.apgar10min >= 7 ? "text-emerald-600" : selectedBaby.apgar10min >= 4 ? "text-amber-600" : "text-red-600"}`}>{selectedBaby.apgar10min}</div></div>
            </div></SectionCard>
            <SectionCard title="Measurements"><div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-slate-500">Weight:</span> <span className="ml-2 font-medium text-slate-900">{selectedBaby.birthWeight}g</span></div>
              <div><span className="text-slate-500">Length:</span> <span className="ml-2 font-medium text-slate-900">{selectedBaby.birthLength}cm</span></div>
              <div><span className="text-slate-500">HC:</span> <span className="ml-2 font-medium text-slate-900">{selectedBaby.headCircumference}cm</span></div>
              <div><span className="text-slate-500">GA:</span> <span className="ml-2 font-medium text-slate-900">{selectedBaby.gestationalAge}</span></div>
              <div><span className="text-slate-500">Temp:</span> <span className="ml-2 font-medium text-slate-900">{selectedBaby.temperature}°C</span></div>
              <div><span className="text-slate-500">Resp:</span> <span className="ml-2 font-medium text-slate-900">{selectedBaby.respiratoryStatus}</span></div>
            </div></SectionCard>
          </div>
          <SectionCard title="Details"><div className="space-y-3 text-sm">
            <div><span className="text-slate-500">Anomalies:</span> <span className="ml-2 font-medium text-slate-900">{selectedBaby.congenitalAnomalies.length > 0 ? selectedBaby.congenitalAnomalies.join(", ") : "None"}</span></div>
            <div><span className="text-slate-500">Resuscitation:</span> <span className="ml-2 font-medium text-slate-900">{selectedBaby.apgar1min < 7 ? "Yes" : "No"}</span></div>
          </div></SectionCard>
        </div>
      )}

      {/* 04 Growth Monitoring */}
      {screen === "growth-monitoring" && !selectedGrowth && (
        <div className="space-y-6">
          <PageHeader title="Growth Monitoring" subtitle="WHO growth standards" icon={TrendingUp}
            actions={<><Button variant="outline" size="sm"><Download className="mr-1.5 size-4" />Export</Button><Button size="sm"><Plus className="mr-1.5 size-4" />Record</Button></>} />
          <div className="space-y-4">{GROWTH_RECORDS.map((gr) => <div key={gr.id} onClick={() => setSelectedGrowth(gr)} className="cursor-pointer"><GrowthCard record={gr} /></div>)}</div>
        </div>
      )}
      {screen === "growth-monitoring" && selectedGrowth && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setSelectedGrowth(null)}><ChevronRight className="size-4 rotate-180" />Back</Button>
            <PageHeader title={`${selectedGrowth.babyName} — Growth`} subtitle={selectedGrowth.recordDate} icon={TrendingUp} />
          </div>
          <SectionCard title="WHO Percentiles"><div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-50 rounded-xl p-4 text-center"><div className="text-xs text-slate-500">Weight</div><div className="text-3xl font-bold text-slate-900 mt-1">P{selectedGrowth.weightPercentile}</div><div className="text-xs text-slate-400">{selectedGrowth.weight}g</div></div>
            <div className="bg-slate-50 rounded-xl p-4 text-center"><div className="text-xs text-slate-500">Length</div><div className="text-3xl font-bold text-slate-900 mt-1">P{selectedGrowth.lengthPercentile}</div><div className="text-xs text-slate-400">{selectedGrowth.length}cm</div></div>
            <div className="bg-slate-50 rounded-xl p-4 text-center"><div className="text-xs text-slate-500">HC</div><div className="text-3xl font-bold text-slate-900 mt-1">P{selectedGrowth.hcPercentile}</div><div className="text-xs text-slate-400">{selectedGrowth.headCircumference}cm</div></div>
          </div></SectionCard>
          <SectionCard title="Details"><div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-slate-500">BMI:</span> <span className="ml-2 font-medium text-slate-900">{selectedGrowth.bmi}</span></div>
            <div><span className="text-slate-500">Velocity:</span> <span className="ml-2 font-medium text-slate-900">{selectedGrowth.weightVelocity}g/wk</span></div>
            <div><span className="text-slate-500">Nutrition:</span> <span className="ml-2 font-medium text-slate-900">{selectedGrowth.nutritionStatus}</span></div>
            <div><span className="text-slate-500">Feeding:</span> <span className="ml-2 font-medium text-slate-900">{selectedGrowth.feedingType}</span></div>
            <div className="col-span-2"><span className="text-slate-500">Notes:</span> <span className="ml-2 font-medium text-slate-900">{selectedGrowth.notes}</span></div>
          </div></SectionCard>
        </div>
      )}

      {/* 05 Development Tracking */}
      {screen === "development-tracking" && (
        <div className="space-y-6">
          <PageHeader title="Development Tracking" subtitle="Milestone surveillance" icon={Activity} />
          <div className="space-y-4">{BABIES.filter((b) => b.status === "Active").map((b) => (
            <div key={b.id} className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3"><h4 className="font-semibold text-sm text-slate-900">{b.name}</h4><StatusPill label={b.gestationalWeeks >= 37 ? "On Track" : "At Risk"} tone={b.gestationalWeeks >= 37 ? "success" : "warning"} /></div>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-50 rounded-lg p-2"><div className="text-slate-500">Gross Motor</div><div className="font-bold text-emerald-600">Appropriate</div></div>
                <div className="bg-slate-50 rounded-lg p-2"><div className="text-slate-500">Fine Motor</div><div className="font-bold text-emerald-600">Appropriate</div></div>
                <div className="bg-slate-50 rounded-lg p-2"><div className="text-slate-500">Speech</div><div className="font-bold text-amber-600">Monitor</div></div>
                <div className="bg-slate-50 rounded-lg p-2"><div className="text-slate-500">Cognitive</div><div className="font-bold text-emerald-600">Appropriate</div></div>
                <div className="bg-slate-50 rounded-lg p-2"><div className="text-slate-500">Social</div><div className="font-bold text-emerald-600">Appropriate</div></div>
                <div className="bg-slate-50 rounded-lg p-2"><div className="text-slate-500">Referral</div><div className="font-bold text-slate-600">None</div></div>
              </div>
            </div>
          ))}</div>
        </div>
      )}

      {/* 06 Vaccination Management */}
      {screen === "vaccination-management" && (
        <div className="space-y-6">
          <PageHeader title="Vaccination Management" subtitle="National Immunization Schedule" icon={Shield}
            actions={<><Button variant="outline" size="sm"><Download className="mr-1.5 size-4" />Certificate</Button><Button size="sm"><Plus className="mr-1.5 size-4" />Record</Button></>} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Given" value={VACCINATIONS.filter((v) => v.status === "Given").length} icon={Shield} />
            <StatCard label="Due" value={VACCINATIONS.filter((v) => v.status === "Due").length} icon={Clock} />
            <StatCard label="Missed" value={VACCINATIONS.filter((v) => v.status === "Missed").length} icon={AlertTriangle} />
            <StatCard label="AEFI" value={VACCINATIONS.filter((v) => v.aefiReported).length} icon={AlertTriangle} />
          </div>
          <SectionCard title="Schedule"><div className="overflow-hidden rounded-xl border border-slate-200"><table className="w-full text-left text-sm"><thead className="bg-gray-50 text-xs text-slate-500"><tr><th className="px-4 py-3 font-medium">Vaccine</th><th className="px-4 py-3 font-medium">Age</th><th className="px-4 py-3 font-medium">Dose</th><th className="px-4 py-3 font-medium">Status</th></tr></thead><tbody className="divide-y divide-slate-200">
            <tr className="hover:bg-gray-50/50"><td className="px-4 py-3 font-medium text-slate-900">BCG</td><td className="px-4 py-3 text-slate-600">At birth</td><td className="px-4 py-3 text-slate-600">Single</td><td className="px-4 py-3"><StatusPill label="Given" tone="success" /></td></tr>
            <tr className="hover:bg-gray-50/50"><td className="px-4 py-3 font-medium text-slate-900">Hepatitis B</td><td className="px-4 py-3 text-slate-600">At birth</td><td className="px-4 py-3 text-slate-600">Birth</td><td className="px-4 py-3"><StatusPill label="Given" tone="success" /></td></tr>
            <tr className="hover:bg-gray-50/50"><td className="px-4 py-3 font-medium text-slate-900">OPV-0</td><td className="px-4 py-3 text-slate-600">At birth</td><td className="px-4 py-3 text-slate-600">0</td><td className="px-4 py-3"><StatusPill label="Given" tone="success" /></td></tr>
            <tr className="hover:bg-gray-50/50"><td className="px-4 py-3 font-medium text-slate-900">Pentavalent</td><td className="px-4 py-3 text-slate-600">6 weeks</td><td className="px-4 py-3 text-slate-600">1st</td><td className="px-4 py-3"><StatusPill label="Due" tone="info" /></td></tr>
            <tr className="hover:bg-gray-50/50"><td className="px-4 py-3 font-medium text-slate-900">Rotavirus</td><td className="px-4 py-3 text-slate-600">6 weeks</td><td className="px-4 py-3 text-slate-600">1st</td><td className="px-4 py-3"><StatusPill label="Due" tone="info" /></td></tr>
            <tr className="hover:bg-gray-50/50"><td className="px-4 py-3 font-medium text-slate-900">PCV</td><td className="px-4 py-3 text-slate-600">6 weeks</td><td className="px-4 py-3 text-slate-600">1st</td><td className="px-4 py-3"><StatusPill label="Due" tone="info" /></td></tr>
          </tbody></table></div></SectionCard>
          <SectionCard title="Records"><div className="space-y-3">{VACCINATIONS.map((v) => <VaccinationCard key={v.id} vax={v} />)}</div></SectionCard>
        </div>
      )}

      {/* 07 Pediatric OPD */}
      {screen === "pediatric-opd" && (
        <div className="space-y-6">
          <PageHeader title="Pediatric OPD" subtitle="Outpatient visits" icon={Stethoscope} actions={<Button size="sm"><Plus className="mr-1.5 size-4" />New Visit</Button>} />
          <div className="space-y-4">{PEDIATRIC_OPDS.map((opd) => (
            <div key={opd.id} className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2"><div><h4 className="font-semibold text-sm text-slate-900">{opd.babyName} — {opd.ageAtVisit}</h4><p className="text-xs text-slate-500">{opd.visitDate} | {opd.pediatrician}</p></div><StatusPill label="Completed" tone="success" /></div>
              <div className="grid grid-cols-2 gap-4 text-sm mt-3">
                <div><span className="text-slate-500">CC:</span> <span className="ml-2 font-medium text-slate-900">{opd.chiefComplaint}</span></div>
                <div><span className="text-slate-500">Dx:</span> <span className="ml-2 font-medium text-slate-900">{opd.diagnosis}</span></div>
                <div><span className="text-slate-500">WT:</span> <span className="ml-2 font-medium text-slate-900">{opd.weight}g</span></div>
                <div><span className="text-slate-500">Temp:</span> <span className="ml-2 font-medium text-slate-900">{opd.temperature}°C</span></div>
                <div className="col-span-2"><span className="text-slate-500">Exam:</span> <span className="ml-2 font-medium text-slate-900">{opd.physicalExamination}</span></div>
                <div className="col-span-2"><span className="text-slate-500">Rx:</span> <span className="ml-2 font-medium text-slate-900">{opd.prescription}</span></div>
              </div>
            </div>
          ))}</div>
        </div>
      )}

      {/* 08 NICU Admission */}
      {screen === "nicu-admission" && !selectedBaby && (
        <div className="space-y-6">
          <PageHeader title="NICU Admission" subtitle="Neonatal intensive care" icon={BabyIcon}
            actions={<><Button variant="outline" size="sm"><Download className="mr-1.5 size-4" />Export</Button><Button size="sm"><Plus className="mr-1.5 size-4" />Admit</Button></>} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Census" value={PEDIATRICS_KPI.activeNICU} icon={Activity} />
            <StatCard label="Critical" value={PEDIATRICS_KPI.criticalBabies} icon={AlertTriangle} />
            <StatCard label="Available" value={PEDIATRICS_KPI.availableNICUBeds} icon={Target} />
            <StatCard label="Occupancy" value={`${PEDIATRICS_KPI.nicuOccupancy}%`} icon={BabyIcon} />
          </div>
          <div className="space-y-4">{BABIES.filter((b) => b.nicuStatus !== "Not Required" && b.nicuStatus !== "Discharged").map((b) => <BabyCard key={b.id} baby={b} onSelect={() => setSelectedBaby(b)} />)}</div>
        </div>
      )}
      {screen === "nicu-admission" && selectedBaby && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setSelectedBaby(null)}><ChevronRight className="size-4 rotate-180" />Back</Button>
            <PageHeader title={`${selectedBaby.name} — NICU`} subtitle={selectedBaby.nicuBed ?? ""} icon={BabyIcon} />
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard title="Admission"><div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-slate-500">Date:</span> <span className="ml-2 font-medium text-slate-900">{selectedBaby.nicuAdmissionDate}</span></div>
              <div><span className="text-slate-500">Reason:</span> <span className="ml-2 font-medium text-slate-900">{selectedBaby.admissionReason}</span></div>
              <div><span className="text-slate-500">GA:</span> <span className="ml-2 font-medium text-slate-900">{selectedBaby.gestationalAge}</span></div>
              <div><span className="text-slate-500">Weight:</span> <span className="ml-2 font-medium text-slate-900">{selectedBaby.currentWeight}g</span></div>
              <div><span className="text-slate-500">Bed:</span> <span className="ml-2 font-medium text-slate-900">{selectedBaby.nicuBed}</span></div>
            </div></SectionCard>
            <SectionCard title="Staff"><div className="space-y-3 text-sm">
              <div><span className="text-slate-500">Neonatologist:</span> <span className="ml-2 font-medium text-slate-900">{selectedBaby.assignedNeonatologist}</span></div>
              <div><span className="text-slate-500">Nurse:</span> <span className="ml-2 font-medium text-slate-900">{selectedBaby.assignedNurse}</span></div>
              <div><span className="text-slate-500">Status:</span> <NICUStatusBadge status={selectedBaby.nicuStatus} /></div>
            </div></SectionCard>
          </div>
        </div>
      )}

      {/* 09 NICU Monitoring */}
      {screen === "nicu-monitoring" && !selectedBaby && (
        <div className="space-y-6">
          <PageHeader title="NICU Monitoring" subtitle="Real-time vital signs" icon={Activity} />
          <div className="space-y-4">{BABIES.filter((b) => b.nicuStatus !== "Not Required" && b.nicuStatus !== "Discharged").map((b) => (
            <div key={b.id} onClick={() => setSelectedBaby(b)} className="cursor-pointer">
              <div className={`bg-white border-2 rounded-xl p-4 transition-all hover:shadow-md ${b.nicuStatus === "Critical" ? "border-red-300" : "border-slate-200 hover:border-blue-300"}`}>
                <div className="flex items-center justify-between mb-3"><div className="flex items-center gap-2"><h4 className="font-semibold text-sm text-slate-900">{b.name}</h4><NICUStatusBadge status={b.nicuStatus} /></div><span className="text-xs text-slate-500">{b.nicuBed}</span></div>
                <div className="grid grid-cols-5 gap-2 text-center text-xs">
                  <div className="bg-red-50 rounded p-1.5"><div className="text-slate-500">HR</div><div className="font-bold text-red-700">{b.heartRate}</div></div>
                  <div className="bg-blue-50 rounded p-1.5"><div className="text-slate-500">RR</div><div className="font-bold text-blue-700">{b.respiratoryRate}</div></div>
                  <div className={`rounded p-1.5 ${b.spo2 < 90 ? "bg-red-100" : "bg-emerald-50"}`}><div className="text-slate-500">SpO₂</div><div className={`font-bold ${b.spo2 < 90 ? "text-red-700" : "text-emerald-700"}`}>{b.spo2}%</div></div>
                  <div className="bg-amber-50 rounded p-1.5"><div className="text-slate-500">Temp</div><div className="font-bold text-amber-700">{b.temperature}°C</div></div>
                  <div className="bg-slate-50 rounded p-1.5"><div className="text-slate-500">Resp</div><div className="font-bold text-slate-700">{b.respiratoryStatus.split("—")[0].trim()}</div></div>
                </div>
              </div>
            </div>
          ))}</div>
        </div>
      )}
      {screen === "nicu-monitoring" && selectedBaby && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setSelectedBaby(null)}><ChevronRight className="size-4 rotate-180" />Back</Button>
            <PageHeader title={`${selectedBaby.name} — Monitoring`} subtitle={selectedBaby.nicuBed ?? ""} icon={Activity} />
          </div>
          <div className="grid gap-4 lg:grid-cols-5">
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center"><div className="text-xs text-slate-500">HR</div><div className="text-3xl font-bold text-red-700 mt-1">{selectedBaby.heartRate}</div><div className="text-xs text-slate-400">bpm</div></div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center"><div className="text-xs text-slate-500">RR</div><div className="text-3xl font-bold text-blue-700 mt-1">{selectedBaby.respiratoryRate}</div><div className="text-xs text-slate-400">/min</div></div>
            <div className={`border rounded-xl p-4 text-center ${selectedBaby.spo2 < 90 ? "bg-red-100 border-red-300" : "bg-emerald-50 border-emerald-200"}`}><div className="text-xs text-slate-500">SpO₂</div><div className={`text-3xl font-bold mt-1 ${selectedBaby.spo2 < 90 ? "text-red-700" : "text-emerald-700"}`}>{selectedBaby.spo2}</div><div className="text-xs text-slate-400">%</div></div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center"><div className="text-xs text-slate-500">Temp</div><div className="text-3xl font-bold text-amber-700 mt-1">{selectedBaby.temperature}</div><div className="text-xs text-slate-400">°C</div></div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center"><div className="text-xs text-slate-500">Status</div><div className="text-lg font-bold text-slate-900 mt-2">{selectedBaby.respiratoryStatus}</div></div>
          </div>
          <SectionCard title="Timeline"><div className="space-y-3">{AUDIT_LOGS.filter((l) => l.resource === selectedBaby.id || l.resource === selectedBaby.babyId).map((log) => <AuditRow key={log.id} log={log} />)}</div></SectionCard>
        </div>
      )}

      {/* 10 Incubator & Warmer */}
      {screen === "incubator-warmer" && !selectedBed && (
        <div className="space-y-6">
          <PageHeader title="Incubator & Warmer Management" subtitle="Device status & maintenance" icon={Cpu} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{NICU_BEDS.map((bed) => <NICUBedCard key={bed.id} bed={bed} onSelect={() => setSelectedBed(bed)} />)}</div>
        </div>
      )}
      {screen === "incubator-warmer" && selectedBed && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setSelectedBed(null)}><ChevronRight className="size-4 rotate-180" />Back</Button>
            <PageHeader title={`${selectedBed.bedNumber} — ${selectedBed.type}`} subtitle={selectedBed.status} icon={Cpu} />
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard title="Device"><div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-slate-500">Type:</span> <span className="ml-2 font-medium text-slate-900">{selectedBed.type}</span></div>
              <div><span className="text-slate-500">Status:</span> <StatusPill label={selectedBed.status} tone={bedStatusTone(selectedBed.status)} /></div>
              <div><span className="text-slate-500">Temp:</span> <span className="ml-2 font-medium text-slate-900">{selectedBed.temperature}°C</span></div>
              <div><span className="text-slate-500">Humidity:</span> <span className="ml-2 font-medium text-slate-900">{selectedBed.humidity}%</span></div>
              {selectedBed.currentBaby && <div><span className="text-slate-500">Patient:</span> <span className="ml-2 font-medium text-slate-900">{selectedBed.currentBaby}</span></div>}
            </div></SectionCard>
            <SectionCard title="Maintenance"><div className="space-y-3 text-sm">
              <div><span className="text-slate-500">Cleaned:</span> <span className="ml-2 font-medium text-slate-900">{selectedBed.lastCleaned}</span></div>
              <div><span className="text-slate-500">Calibrated:</span> <span className="ml-2 font-medium text-slate-900">{selectedBed.lastCalibrated}</span></div>
              <div><span className="text-slate-500">Status:</span> <span className="ml-2 font-medium text-slate-900">{selectedBed.maintenanceStatus}</span></div>
            </div></SectionCard>
          </div>
        </div>
      )}

      {/* 11 Feeding Management */}
      {screen === "feeding-management" && (
        <div className="space-y-6">
          <PageHeader title="Feeding Management" subtitle="Breastfeeding, EBM, formula, TPN" icon={Heart} actions={<Button size="sm"><Plus className="mr-1.5 size-4" />Record</Button>} />
          <div className="space-y-4">{FEEDING_RECORDS.map((fr) => <FeedingCard key={fr.id} record={fr} />)}</div>
        </div>
      )}

      {/* 12 Phototherapy */}
      {screen === "phototherapy" && (
        <div className="space-y-6">
          <PageHeader title="Phototherapy" subtitle="Jaundice & bilirubin" icon={Zap} actions={<Button size="sm"><Plus className="mr-1.5 size-4" />Start</Button>} />
          <div className="space-y-4">{PHOTOTHERAPY_RECORDS.map((pt) => <PhototherapyCard key={pt.id} record={pt} />)}</div>
          <SectionCard title="Bilirubin Trend"><div className="overflow-hidden rounded-xl border border-slate-200"><table className="w-full text-left text-sm"><thead className="bg-gray-50 text-xs text-slate-500"><tr><th className="px-4 py-3 font-medium">Baby</th><th className="px-4 py-3 font-medium">Bili</th><th className="px-4 py-3 font-medium">Trend</th><th className="px-4 py-3 font-medium">Hours</th><th className="px-4 py-3 font-medium">Sessions</th><th className="px-4 py-3 font-medium">Status</th></tr></thead><tbody className="divide-y divide-slate-200">
            {PHOTOTHERAPY_RECORDS.map((pt) => (<tr key={pt.id} className="hover:bg-gray-50/50"><td className="px-4 py-3 font-medium text-slate-900">{pt.babyName}</td><td className="px-4 py-3 font-bold text-amber-700">{pt.bilirubinLevel} mg/dL</td><td className="px-4 py-3 text-slate-600">{pt.bilirubinTrend}</td><td className="px-4 py-3 text-slate-600">{pt.treatmentHours}h</td><td className="px-4 py-3 text-slate-600">{pt.sessionsCompleted}/{pt.totalSessionsRequired}</td><td className="px-4 py-3"><PhototherapyStatusBadge status={pt.status} /></td></tr>))}
          </tbody></table></div></SectionCard>
        </div>
      )}

      {/* 13 Ventilator Support */}
      {screen === "ventilator-support" && (
        <div className="space-y-6">
          <PageHeader title="Ventilator Support" subtitle="Mechanical ventilation & CPAP" icon={Cpu} />
          <div className="space-y-4">{VENTILATOR_RECORDS.map((vr) => <VentilatorCard key={vr.id} record={vr} />)}{CPAP_RECORDS.map((cr) => <CPAPCard key={cr.id} record={cr} />)}</div>
          <SectionCard title="Summary"><div className="overflow-hidden rounded-xl border border-slate-200"><table className="w-full text-left text-sm"><thead className="bg-gray-50 text-xs text-slate-500"><tr><th className="px-4 py-3 font-medium">Baby</th><th className="px-4 py-3 font-medium">Device</th><th className="px-4 py-3 font-medium">Mode</th><th className="px-4 py-3 font-medium">FiO₂</th><th className="px-4 py-3 font-medium">PEEP</th><th className="px-4 py-3 font-medium">Weaning</th></tr></thead><tbody className="divide-y divide-slate-200">
            {VENTILATOR_RECORDS.map((vr) => (<tr key={vr.id} className="hover:bg-gray-50/50"><td className="px-4 py-3 font-medium text-slate-900">{vr.babyName}</td><td className="px-4 py-3 text-slate-600">{vr.deviceId}</td><td className="px-4 py-3"><StatusPill label={vr.mode} tone="danger" /></td><td className="px-4 py-3 text-slate-600">{vr.fio2}%</td><td className="px-4 py-3 text-slate-600">{vr.peep}</td><td className="px-4 py-3"><StatusPill label={vr.weaningStatus} tone="info" /></td></tr>))}
          </tbody></table></div></SectionCard>
        </div>
      )}

      {/* 14 Medications */}
      {screen === "medication-admin" && (
        <div className="space-y-6">
          <PageHeader title="Medication Administration" subtitle="NICU & pediatric meds" icon={Pill} actions={<Button size="sm"><Plus className="mr-1.5 size-4" />New</Button>} />
          <div className="space-y-4">{MEDICATION_RECORDS.map((mr) => <MedicationCard key={mr.id} record={mr} />)}</div>
        </div>
      )}

      {/* 15 Discharge Planning */}
      {screen === "discharge-planning" && (
        <div className="space-y-6">
          <PageHeader title="Discharge Planning" subtitle="Discharge readiness" icon={FileText} />
          <SectionCard title="Checklist"><div className="space-y-3">
            {["Clinical clearance", "Vaccinations up to date", "Growth chart reviewed", "Parent education", "Feeding plan", "Follow-up scheduled", "Medications dispensed", "Summary prepared", "Insurance clearance", "Transport arranged"].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">{i < 7 ? <CheckCircle2 className="size-4 text-emerald-500" /> : <AlertTriangle className="size-4 text-amber-500" />}<span className="text-slate-700">{item}</span></div>
            ))}
          </div></SectionCard>
          <SectionCard title="Discharged"><div className="space-y-3">{DISCHARGE_RECORDS.length > 0 ? DISCHARGE_RECORDS.map((dc) => <DischargeCard key={dc.id} record={dc} />) : <p className="text-sm text-slate-500">No records</p>}</div></SectionCard>
        </div>
      )}

      {/* 16 Reports */}
      {screen === "reports-analytics" && (
        <div className="space-y-6">
          <PageHeader title="Reports & Analytics" subtitle="Pediatrics & NICU metrics" icon={BarChart3} actions={<Button variant="outline" size="sm"><Download className="mr-1.5 size-4" />Export</Button>} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Babies" value={PEDIATRICS_KPI.totalBabies} icon={BabyIcon} />
            <StatCard label="NICU Occ." value={`${PEDIATRICS_KPI.nicuOccupancy}%`} icon={Activity} />
            <StatCard label="Avg LOS" value={`${PEDIATRICS_KPI.avgLengthOfStay}d`} icon={Clock} />
            <StatCard label="Vent Util." value={`${PEDIATRICS_KPI.ventilatorUtilization}%`} icon={Cpu} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Mortality" value={`${PEDIATRICS_KPI.mortalityRate}%`} icon={Heart} />
            <StatCard label="Infection" value={`${PEDIATRICS_KPI.infectionRate}%`} icon={Shield} />
            <StatCard label="Vacc Rate" value={`${PEDIATRICS_KPI.vaccinationCoverage}%`} icon={Shield} />
            <StatCard label="Critical" value={PEDIATRICS_KPI.criticalBabies} icon={AlertTriangle} />
          </div>
        </div>
      )}

      {/* 17 Quality & Compliance */}
      {screen === "quality-compliance" && (
        <div className="space-y-6">
          <PageHeader title="Quality & Compliance" subtitle="Neonatal safety & NABH" icon={Shield} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Infection" value={`${PEDIATRICS_KPI.infectionRate}%`} icon={Shield} />
            <StatCard label="Mortality" value={`${PEDIATRICS_KPI.mortalityRate}%`} icon={Heart} />
            <StatCard label="Vacc Rate" value={`${PEDIATRICS_KPI.vaccinationCoverage}%`} icon={Shield} />
            <StatCard label="NICU Occ." value={`${PEDIATRICS_KPI.nicuOccupancy}%`} icon={Activity} />
          </div>
          <SectionCard title="Audit Trail"><div className="space-y-1">{AUDIT_LOGS.map((log) => <AuditRow key={log.id} log={log} />)}</div></SectionCard>
          <SectionCard title="Safety Indicators"><div className="space-y-3">
            {["Hand hygiene — 95%", "Vertical transmission — 100%", "KMC — 60%", "EBF — 78%", "Vitamin K — 100%", "Hearing — 98%", "ROP — 100%", "Med error — 0.2%", "Wrong ID — 0", "NEC — 2.1%"].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">{i < 7 ? <CheckCircle2 className="size-4 text-emerald-500" /> : <AlertTriangle className="size-4 text-amber-500" />}<span className="text-slate-700">{item}</span></div>
            ))}
          </div></SectionCard>
        </div>
      )}

      {/* 18 Workflow Complete */}
      {screen === "workflow-complete" && (
        <div className="space-y-6">
          <PageHeader title="Workflow Complete" subtitle="All done" icon={CheckCircle2} />
          <div className="flex flex-col items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50/50 py-16 text-center">
            <div className="grid size-16 place-items-center rounded-full bg-emerald-100"><CheckCircle2 className="size-8 text-emerald-600" /></div>
            <h2 className="mt-4 text-xl font-bold text-slate-900">All Processes Complete</h2>
            <p className="mt-2 max-w-md text-sm text-slate-500">Baby discharged, vaccinations updated, audit trail maintained.</p>
            <div className="mt-6 flex gap-3">
              <Button variant="outline"><Download className="mr-1.5 size-4" />Summary</Button>
              <Button onClick={() => setScreen("pd-dashboard")}>Dashboard</Button>
            </div>
          </div>
        </div>
      )}

    </Shell>
  );
}
