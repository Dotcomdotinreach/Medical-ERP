import { useState, useEffect } from "react";
import {
  Activity, AlertTriangle, ArrowLeft, ArrowRight, BarChart3,
  BedDouble, CalendarDays, CheckCircle2, ChevronRight, ClipboardList, Clock,
  FileText, Heart, HeartPulse, ListChecks, Monitor, Phone, Printer,
  Search, ShieldAlert, Stethoscope, Timer, TriangleAlert, Users, Zap, Syringe,
} from "lucide-react";
import { toast } from "sonner";
import { Shell, type NavItem, type Workspace } from "../his/Shell";
import { StatusBadge } from "../his/ui";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  CriticalityBadge, ICUBedStatusBadge, VentModeBadge, IsolationBadge,
  IcuStatCard, IcuSection, IcuPageHeader, ICUBedCard, VitalsWidget, AlarmRow,
} from "./icuUi";
import {
  ICU_BEDS, ICU_PATIENTS, VENTILATOR_RECORDS, INFUSION_PUMPS, CLINICAL_SCORES,
  MEDICATION_RECORDS, DAILY_ROUNDS, CODE_BLUE_RECORDS, FAMILY_UPDATES,
  RECOVERY_ASSESSMENTS, ICU_EQUIPMENT, AUDIT_LOGS,
  type ICUPatient, type VentilatorRecord,
} from "./data";
import { icuApi } from "../../services/icu";

type IcuRoute =
  | "dashboard" | "admission" | "bed-management" | "live-monitoring"
  | "ventilator" | "infusion-pumps" | "clinical-scoring" | "medication"
  | "daily-rounds" | "care-plan" | "code-blue" | "family-communication"
  | "recovery-assessment" | "transfer-to-ward" | "icu-discharge"
  | "equipment" | "analytics" | "complete";

const NAV: NavItem[] = [
  { id: "dashboard", label: "ICU Dashboard", icon: Activity },
  { id: "admission", label: "ICU Admission", icon: BedDouble },
  { id: "bed-management", label: "Bed Management", icon: BedDouble },
  { id: "live-monitoring", label: "Live Monitoring", icon: Monitor, badge: "5", tone: "danger" },
  { id: "ventilator", label: "Ventilator Mgmt", icon: Activity },
  { id: "infusion-pumps", label: "Infusion Pumps", icon: Syringe, badge: "8" },
  { id: "clinical-scoring", label: "Clinical Scoring", icon: ClipboardList },
  { id: "medication", label: "Medication Mgmt", icon: ShieldAlert },
  { id: "daily-rounds", label: "Daily Rounds", icon: Stethoscope },
];
const NAV_SECONDARY: NavItem[] = [
  { id: "care-plan", label: "Care Plan", icon: FileText },
  { id: "code-blue", label: "Code Blue", icon: HeartPulse, badge: "1", tone: "danger" },
  { id: "family-communication", label: "Family Comm", icon: Phone },
  { id: "recovery-assessment", label: "Recovery Assessment", icon: CheckCircle2 },
  { id: "transfer-to-ward", label: "Transfer to Ward", icon: ArrowRight },
  { id: "icu-discharge", label: "ICU Discharge", icon: CheckCircle2 },
  { id: "equipment", label: "Equipment", icon: Monitor },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
];

const CRUMBS: Record<IcuRoute, string[]> = {
  dashboard: ["ICU", "Dashboard"],
  admission: ["ICU", "Admission"],
  "bed-management": ["ICU", "Bed Management"],
  "live-monitoring": ["ICU", "Live Monitoring"],
  ventilator: ["ICU", "Ventilator Management"],
  "infusion-pumps": ["ICU", "Infusion Pump Management"],
  "clinical-scoring": ["ICU", "Clinical Scoring"],
  medication: ["ICU", "Medication Management"],
  "daily-rounds": ["ICU", "Daily ICU Rounds"],
  "care-plan": ["ICU", "Multidisciplinary Care Plan"],
  "code-blue": ["ICU", "Code Blue Management"],
  "family-communication": ["ICU", "Family Communication"],
  "recovery-assessment": ["ICU", "Recovery Assessment"],
  "transfer-to-ward": ["ICU", "Transfer to Ward"],
  "icu-discharge": ["ICU", "ICU Discharge"],
  equipment: ["ICU", "Equipment Management"],
  analytics: ["ICU", "Analytics"],
  complete: ["ICU", "Workflow Complete"],
};

export function IcuApp({ roleName, onSignOut, onSwitchWorkspace, onOpenSettings }: {
  roleName: string; onSignOut: () => void; onSwitchWorkspace: (w: Workspace) => void; onOpenSettings?: (page: string) => void;
}) {
   const [route, setRoute] = useState<IcuRoute>("dashboard");
   const [livePatients, setLivePatients] = useState(ICU_PATIENTS);
   const [liveBeds, setLiveBeds] = useState(ICU_BEDS);
   const [selectedPatient, setSelectedPatient] = useState<ICUPatient>(livePatients[0]);

   useEffect(() => {
     icuApi.listPatients().then(r => {
       if (r.data?.length) setLivePatients(r.data.map((p: any) => ({
         id: p._id,
         name: p.patient ? `${p.patient.firstName} ${p.patient.lastName}` : "",
         bedNumber: p.bed?.bedNumber || "",
         diagnosis: p.admittingDiagnosis || "",
         status: p.status || "Critical",
         vitals: p.vitals,
         ventilator: p.ventilatorStatus || false,
         isolation: p.isolation || "None",
       })));
     }).catch(() => {});

     icuApi.listBeds().then(r => {
       if (r.data?.length) setLiveBeds(r.data.map((b: any) => ({
         id: b._id,
         bedNumber: b.bedNumber || b.bedId,
         status: b.status || "Available",
         occupiedBy: b.patient ? b.patient.firstName : "",
       })));
     }).catch(() => {});
   }, []);

  const navTo = (r: IcuRoute) => setRoute(r);

   const occupiedBeds = liveBeds.filter(b => b.status === "Occupied").length;
   const availableBeds = liveBeds.filter(b => b.status === "Available").length;
   const ventCount = liveBeds.filter(b => b.onVentilator).length;
   const criticalCount = livePatients.filter(p => p.criticality === "Critical").length;
   const avgLos = Math.round(livePatients.reduce((a, p) => a + p.daysInICU, 0) / livePatients.length);

  function renderScreen() {
    switch (route) {
      case "dashboard": return <DashboardScreen />;
      case "admission": return <AdmissionScreen />;
      case "bed-management": return <BedManagementScreen />;
      case "live-monitoring": return <LiveMonitoringScreen />;
      case "ventilator": return <VentilatorScreen />;
      case "infusion-pumps": return <InfusionPumpScreen />;
      case "clinical-scoring": return <ClinicalScoringScreen />;
      case "medication": return <MedicationScreen />;
      case "daily-rounds": return <DailyRoundsScreen />;
      case "care-plan": return <CarePlanScreen />;
      case "code-blue": return <CodeBlueScreen />;
      case "family-communication": return <FamilyCommunicationScreen />;
      case "recovery-assessment": return <RecoveryAssessmentScreen />;
      case "transfer-to-ward": return <TransferToWardScreen />;
      case "icu-discharge": return <ICUDischargeScreen />;
      case "equipment": return <EquipmentScreen />;
      case "analytics": return <AnalyticsScreen />;
      case "complete": return <WorkflowCompleteScreen />;
      default: return <DashboardScreen />;
    }
  }

  /* ──────────────────────────────────────────────────────── SCREEN 01: Dashboard */
  function DashboardScreen() {
    return (
      <div className="space-y-6">
        <IcuPageHeader title="ICU Dashboard" subtitle="Critical care overview — Meridian ICU" actions={
          <Button onClick={() => navTo("admission")} className="bg-primary text-white"><BedDouble className="mr-2 size-4" />New Admission</Button>
        } />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <IcuStatCard icon={BedDouble} label="Occupied Beds" value={`${occupiedBeds}/12`} tone="danger" />
          <IcuStatCard icon={BedDouble} label="Available Beds" value={availableBeds} tone="success" />
          <IcuStatCard icon={Activity} label="On Ventilator" value={ventCount} tone="warning" />
          <IcuStatCard icon={HeartPulse} label="Critical Patients" value={criticalCount} tone="danger" hint="Requiring vasopressors" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <IcuStatCard icon={Clock} label="Avg ICU Stay" value={`${avgLos} days`} tone="info" />
          <IcuStatCard icon={Zap} label="Code Blue Events" value={CODE_BLUE_RECORDS.length} tone="danger" />
          <IcuStatCard icon={Monitor} label="Equipment Alerts" value={1} tone="warning" />
          <IcuStatCard icon={CheckCircle2} label="Ready for Transfer" value={RECOVERY_ASSESSMENTS.filter(r => r.readinessForTransfer).length} tone="success" />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <IcuSection title="Live Patient Tiles" className="lg:col-span-2">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
               {livePatients.map(p => (
                <button key={p.uhid} onClick={() => { setSelectedPatient(p); navTo("live-monitoring"); }} className="rounded-xl border border-border bg-muted/50 p-4 text-left transition-colors hover:border-primary">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-text-primary">{(p.patientName ?? "").split(" ")[0]}</span>
                     <CriticalityBadge level={p.criticality} />
                   </div>
                   <div className="mt-1 text-xs text-text-secondary">{p.bed} · {(p.diagnosis ?? "").split(" — ")[0]}</div>
                  <div className="mt-2 flex gap-1">
                    {p.onVentilator && <VentModeBadge mode={p.ventilatorMode || "SIMV"} />}
                    {p.isolationLevel !== "None" && <IsolationBadge level={p.isolationLevel} />}
                  </div>
                  <div className="mt-2 grid grid-cols-4 gap-1 text-center">
                    <div className="rounded bg-muted px-1 py-0.5"><div className="text-[8px] text-text-secondary">HR</div><div className="text-[10px] font-bold">{78 + Math.floor(Math.random() * 20)}</div></div>
                    <div className="rounded bg-muted px-1 py-0.5"><div className="text-[8px] text-text-secondary">BP</div><div className="text-[10px] font-bold">{110 + Math.floor(Math.random() * 30)}/70</div></div>
                    <div className="rounded bg-muted px-1 py-0.5"><div className="text-[8px] text-text-secondary">SpO2</div><div className="text-[10px] font-bold text-success">{96 + Math.floor(Math.random() * 4)}%</div></div>
                    <div className="rounded bg-muted px-1 py-0.5"><div className="text-[8px] text-text-secondary">GCS</div><div className="text-[10px] font-bold">{p.gcs}</div></div>
                  </div>
                </button>
              ))}
            </div>
          </IcuSection>
          <div className="space-y-6">
            <IcuSection title="Critical Alerts">
              <div className="space-y-2">
                <div className="flex items-start gap-2 rounded-lg border border-danger/30 bg-danger/5 p-3">
                  <TriangleAlert className="mt-0.5 size-4 shrink-0 text-danger" />
                  <div><div className="text-sm font-medium text-danger">Anil Kulkarni — SpO2 94%</div><div className="text-xs text-text-secondary">2 min ago</div></div>
                </div>
                <div className="flex items-start gap-2 rounded-lg border border-warning/30 bg-warning/5 p-3">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0 text-[#b45309]" />
                  <div><div className="text-sm font-medium text-[#b45309]">Lakshmi Iyer — ICP 22 mmHg</div><div className="text-xs text-text-secondary">15 min ago</div></div>
                </div>
                <div className="flex items-start gap-2 rounded-lg border border-info/30 bg-info/5 p-3">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0 text-[#0369a1]" />
                  <div><div className="text-sm font-medium text-[#0369a1]">ICU B11 — Ventilator service due</div><div className="text-xs text-text-secondary">1 hr ago</div></div>
                </div>
              </div>
            </IcuSection>
            <IcuSection title="Recent Activity">
              {AUDIT_LOGS.slice(0, 4).map(log => (
                <div key={log.id} className="flex items-start gap-3 border-b border-border py-3 last:border-b-0">
                  <div className="mt-0.5 size-2 rounded-full bg-primary" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium text-text-primary truncate">{log.action}</span>
                      <span className="shrink-0 text-xs text-text-secondary">{(log.timestamp ?? "").split(" ")[1]}</span>
                    </div>
                    <p className="text-xs text-text-secondary truncate">{log.detail}</p>
                  </div>
                </div>
              ))}
            </IcuSection>
          </div>
        </div>
      </div>
    );
  }

  /* ──────────────────────────────────────────────────────── SCREEN 02: ICU Admission */
  function AdmissionScreen() {
    return (
      <div className="space-y-6">
        <IcuPageHeader title="ICU Admission" subtitle="Process new ICU admission" />
        <IcuSection title="Admission Details">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">Patient Name</label>
              <Input placeholder="Enter patient name" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">UHID</label>
              <Input placeholder="MRD-2026-XXXXXX" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">Transfer Source</label>
              <Input placeholder="Emergency / OT / Ward" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">Diagnosis</label>
              <Input placeholder="Primary diagnosis" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">Assigned Intensivist</label>
              <Input placeholder="Select intensivist" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">Assigned Nurse</label>
              <Input placeholder="Select ICU nurse" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">ICU Bed</label>
              <Input placeholder="Select available bed" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">Isolation Status</label>
              <Input placeholder="None / Contact / Droplet / Airborne" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">Clinical Priority</label>
              <Input placeholder="Critical / Serious / Stable" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium text-text-secondary">Admission Notes</label>
              <Textarea placeholder="Clinical summary and admission notes…" />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={() => toast.success("Patient admitted to ICU")}>Confirm ICU Admission</Button>
            <Button variant="outline">Cancel</Button>
          </div>
        </IcuSection>
      </div>
    );
  }

  /* ──────────────────────────────────────────────────────── SCREEN 03: Bed Management */
  function BedManagementScreen() {
    return (
      <div className="space-y-6">
        <IcuPageHeader title="ICU Bed Management" subtitle="Interactive floor map and bed status" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
           {liveBeds.map(bed => <ICUBedCard key={bed.id} bed={bed} onClick={() => toast.info("Managing bed " + bed.number)} />)}
        </div>
      </div>
    );
  }

  /* ──────────────────────────────────────────────────────── SCREEN 04: Live Monitoring */
  function LiveMonitoringScreen() {
    const p = selectedPatient;
    const ventRec = VENTILATOR_RECORDS.find(v => v.patientName === p.patientName);
    return (
      <div className="space-y-6">
        <IcuPageHeader title="Live Patient Monitoring" subtitle={`${p.patientName} — ${p.bed}`} actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navTo("dashboard")}><ArrowLeft className="mr-2 size-4" />Dashboard</Button>
            <CriticalityBadge level={p.criticality} />
          </div>
        } />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <IcuSection title="Real-Time Vitals">
              <VitalsWidget vitals={{ bp: "110/65", hr: 82, spo2: 98, rr: 14, temp: 37.2, etco2: 35, cvp: 12 }} />
            </IcuSection>
            <IcuSection title="Trend — SOFA / APACHE / GCS">
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-lg bg-muted p-3 text-center"><div className="text-xs text-text-secondary">SOFA</div><div className="text-xl font-bold text-danger">{p.sofa}</div><div className="text-[10px] text-text-secondary">Trend: +1</div></div>
                <div className="rounded-lg bg-muted p-3 text-center"><div className="text-xs text-text-secondary">APACHE II</div><div className="text-xl font-bold text-warning">{p.apache}</div><div className="text-[10px] text-text-secondary">Trend: -3</div></div>
                <div className="rounded-lg bg-muted p-3 text-center"><div className="text-xs text-text-secondary">GCS</div><div className="text-xl font-bold text-danger">{p.gcs}/15</div><div className="text-[10px] text-text-secondary">Trend: +1</div></div>
              </div>
            </IcuSection>
            {ventRec && (
              <IcuSection title="Ventilator Status">
                <div className="flex items-center gap-3 mb-3">
                  <VentModeBadge mode={ventRec.mode} />
                  <span className="text-xs text-text-secondary">Started: {ventRec.startTime} · Last check: {ventRec.lastChecked}</span>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-lg bg-muted p-3 text-center"><div className="text-xs text-text-secondary">FiO₂</div><div className="text-lg font-bold text-text-primary">{ventRec.settings.fio2}%</div></div>
                  <div className="rounded-lg bg-muted p-3 text-center"><div className="text-xs text-text-secondary">PEEP</div><div className="text-lg font-bold text-text-primary">{ventRec.settings.peep}</div></div>
                  <div className="rounded-lg bg-muted p-3 text-center"><div className="text-xs text-text-secondary">TV</div><div className="text-lg font-bold text-text-primary">{ventRec.settings.tv} ml</div></div>
                  <div className="rounded-lg bg-muted p-3 text-center"><div className="text-xs text-text-secondary">RR</div><div className="text-lg font-bold text-text-primary">{ventRec.settings.rr}/min</div></div>
                </div>
              </IcuSection>
            )}
          </div>
          <div className="space-y-6">
            <IcuSection title="Patient Info">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-text-secondary">UHID</span><span className="text-text-primary">{p.uhid}</span></div>
                <div className="flex justify-between"><span className="text-text-secondary">Age / Gender</span><span className="text-text-primary">{p.age}y {p.gender[0]}</span></div>
                <div className="flex justify-between"><span className="text-text-secondary">Blood</span><span className="text-text-primary">{p.blood}</span></div>
                <div className="flex justify-between"><span className="text-text-secondary">Admission</span><span className="text-text-primary">{p.admissionDate}</span></div>
                <div className="flex justify-between"><span className="text-text-secondary">Days in ICU</span><span className="text-text-primary">{p.daysInICU}</span></div>
                <div className="flex justify-between"><span className="text-text-secondary">Diagnosis</span><span className="text-text-primary text-right">{p.diagnosis}</span></div>
                <div className="flex justify-between"><span className="text-text-secondary">Intensivist</span><span className="text-text-primary">{p.intensivist}</span></div>
                <div className="flex justify-between"><span className="text-text-secondary">Nurse</span><span className="text-text-primary">{p.primaryNurse}</span></div>
              </div>
            </IcuSection>
            <IcuSection title="Alarms">
              <div className="space-y-2">
                {ventRec?.alarms.map((a, i) => <AlarmRow key={i} parameter={a.parameter} status={a.status} />)}
              </div>
            </IcuSection>
          </div>
        </div>
      </div>
    );
  }

  /* ──────────────────────────────────────────────────────── SCREEN 05: Ventilator Management */
  function VentilatorScreen() {
    return (
      <div className="space-y-6">
        <IcuPageHeader title="Ventilator Management" subtitle="Monitor and adjust ventilator settings" />
        <div className="space-y-4">
          {VENTILATOR_RECORDS.map((vr, i) => (
            <IcuSection key={i} title={`${vr.patientName} — Bed ${vr.bed}`} action={<VentModeBadge mode={vr.mode} />}>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-6">
                <div className="rounded-lg bg-muted p-3 text-center"><div className="text-xs text-text-secondary">FiO₂</div><div className="text-lg font-bold text-text-primary">{vr.settings.fio2}%</div></div>
                <div className="rounded-lg bg-muted p-3 text-center"><div className="text-xs text-text-secondary">PEEP</div><div className="text-lg font-bold text-text-primary">{vr.settings.peep}</div></div>
                <div className="rounded-lg bg-muted p-3 text-center"><div className="text-xs text-text-secondary">TV</div><div className="text-lg font-bold text-text-primary">{vr.settings.tv}</div></div>
                <div className="rounded-lg bg-muted p-3 text-center"><div className="text-xs text-text-secondary">RR</div><div className="text-lg font-bold text-text-primary">{vr.settings.rr}</div></div>
                {vr.settings.pmax && <div className="rounded-lg bg-muted p-3 text-center"><div className="text-xs text-text-secondary">Pmax</div><div className="text-lg font-bold text-text-primary">{vr.settings.pmax}</div></div>}
                {vr.settings.pplat && <div className="rounded-lg bg-muted p-3 text-center"><div className="text-xs text-text-secondary">Pplat</div><div className="text-lg font-bold text-text-primary">{vr.settings.pplat}</div></div>}
              </div>
              <div className="mt-3 space-y-2">
                {vr.alarms.map((a, j) => <AlarmRow key={j} parameter={a.parameter} status={a.status} />)}
              </div>
              <div className="mt-3 flex gap-2">
                <Button size="sm" onClick={() => toast.success("Ventilator settings updated")}>Change Settings</Button>
                <Button size="sm" variant="outline">Ventilator History</Button>
              </div>
            </IcuSection>
          ))}
        </div>
      </div>
    );
  }

  /* ──────────────────────────────────────────────────────── SCREEN 06: Infusion Pumps */
  function InfusionPumpScreen() {
    return (
      <div className="space-y-6">
        <IcuPageHeader title="Infusion Pump Management" subtitle={`${INFUSION_PUMPS.length} active infusions`} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {INFUSION_PUMPS.map(pump => (
            <div key={pump.id} className="rounded-xl border border-border bg-surface p-5">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-text-primary">{pump.drugName}</div>
                <StatusBadge tone={pump.status === "Running" ? "success" : pump.status === "Alarm" ? "danger" : "warning"}>{pump.status}</StatusBadge>
              </div>
              <div className="mt-2 space-y-1 text-sm text-text-secondary">
                <div>Patient: {pump.patientName}</div>
                <div>Concentration: {pump.concentration}</div>
                <div>Rate: {pump.rate}</div>
                <div>Remaining: {pump.remainingVolume}</div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-text-secondary">Battery: {pump.batteryPercent}%</span>
                <span className={`text-xs font-medium ${pump.occlusionStatus === "Normal" ? "text-success" : "text-danger"}`}>{pump.occlusionStatus}</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                <div className={`h-full rounded-full ${pump.batteryPercent > 50 ? "bg-success" : "bg-warning"}`} style={{ width: `${pump.batteryPercent}%` }} />
              </div>
              <div className="mt-3 flex gap-2">
                <Button size="sm" variant="outline" onClick={() => toast.info("Infusion paused")}>Pause</Button>
                <Button size="sm" variant="outline" onClick={() => toast.success("Syringe replaced")}>Replace</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ──────────────────────────────────────────────────────── SCREEN 07: Clinical Scoring */
  function ClinicalScoringScreen() {
    const cs = CLINICAL_SCORES[0];
    return (
      <div className="space-y-6">
        <IcuPageHeader title="Clinical Scoring" subtitle="APACHE II, SOFA, GCS, NEWS2, qSOFA" />
        <div className="space-y-4">
          {CLINICAL_SCORES.map(c => (
            <IcuSection key={c.patientName} title={c.patientName} action={<span className="text-xs text-text-secondary">Assessed: {c.assessedAt} by {c.assessedBy}</span>}>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                <div className="rounded-lg bg-muted p-3 text-center"><div className="text-xs text-text-secondary">APACHE II</div><div className="text-xl font-bold text-danger">{c.apacheII}</div></div>
                <div className="rounded-lg bg-muted p-3 text-center"><div className="text-xs text-text-secondary">SOFA</div><div className="text-xl font-bold text-warning">{c.sofa}</div></div>
                <div className="rounded-lg bg-muted p-3 text-center"><div className="text-xs text-text-secondary">GCS</div><div className="text-xl font-bold text-danger">{c.gcs.total}/15</div></div>
                <div className="rounded-lg bg-muted p-3 text-center"><div className="text-xs text-text-secondary">NEWS2</div><div className="text-xl font-bold text-danger">{c.news2}</div></div>
                <div className="rounded-lg bg-muted p-3 text-center"><div className="text-xs text-text-secondary">qSOFA</div><div className="text-xl font-bold text-warning">{c.qsofa}</div></div>
                <div className="rounded-lg bg-muted p-3 text-center"><div className="text-xs text-text-secondary">Sepsis</div><div className={`text-xl font-bold ${c.sepsisScreen === "Positive" ? "text-danger" : "text-success"}`}>{c.sepsisScreen === "Positive" ? "+" : "−"}</div></div>
              </div>
              <div className="mt-3 grid grid-cols-4 gap-2 text-sm">
                <div className="rounded bg-muted p-2 text-center"><div className="text-[10px] text-text-secondary">GCS Eye</div><div className="font-bold">{c.gcs.eye}</div></div>
                <div className="rounded bg-muted p-2 text-center"><div className="text-[10px] text-text-secondary">GCS Verbal</div><div className="font-bold">{c.gcs.verbal}</div></div>
                <div className="rounded bg-muted p-2 text-center"><div className="text-[10px] text-text-secondary">GCS Motor</div><div className="font-bold">{c.gcs.motor}</div></div>
                <div className="rounded bg-muted p-2 text-center"><div className="text-[10px] text-text-secondary">RASS</div><div className="font-bold">{c.sedationScale}</div></div>
              </div>
            </IcuSection>
          ))}
        </div>
      </div>
    );
  }

  /* ──────────────────────────────────────────────────────── SCREEN 08: Medication Management */
  function MedicationScreen() {
    const med = MEDICATION_RECORDS[0];
    return (
      <div className="space-y-6">
        <IcuPageHeader title="Medication Management" subtitle="Continuous infusions, antibiotics, sedation, vasopressors" />
        <div className="space-y-4">
          {MEDICATION_RECORDS.map(mr => (
            <IcuSection key={mr.patientName} title={mr.patientName}>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="pb-3 font-medium text-text-secondary">Medication</th>
                      <th className="pb-3 font-medium text-text-secondary">Type</th>
                      <th className="pb-3 font-medium text-text-secondary">Dose</th>
                      <th className="pb-3 font-medium text-text-secondary">Route</th>
                      <th className="pb-3 font-medium text-text-secondary">Frequency</th>
                      <th className="pb-3 font-medium text-text-secondary">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mr.medications.map((m, i) => (
                      <tr key={i} className="border-b border-border hover:bg-muted/50">
                        <td className="py-3 font-medium text-text-primary">{m.name}</td>
                        <td className="py-3 text-text-secondary">{m.type}</td>
                        <td className="py-3 text-text-secondary">{m.dose}</td>
                        <td className="py-3 text-text-secondary">{m.route}</td>
                        <td className="py-3 text-text-secondary">{m.frequency}</td>
                        <td className="py-3"><StatusBadge tone={m.status === "Active" ? "success" : m.status === "Paused" ? "warning" : "info"}>{m.status}</StatusBadge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </IcuSection>
          ))}
        </div>
      </div>
    );
  }

  /* ──────────────────────────────────────────────────────── SCREEN 09: Daily ICU Rounds */
  function DailyRoundsScreen() {
    return (
      <div className="space-y-6">
        <IcuPageHeader title="Daily ICU Rounds" subtitle="Structured multidisciplinary rounds" actions={<Button variant="outline"><Printer className="mr-2 size-4" />Print Rounds</Button>} />
        <div className="space-y-4">
          {DAILY_ROUNDS.map(r => (
            <IcuSection key={r.patientName} title={`${r.patientName} — Bed ${r.bed}`} action={<span className="text-xs text-text-secondary">{r.roundTime} · {r.intensivist}</span>}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-3">
                  <div><span className="text-xs font-medium text-text-secondary">Vitals Summary</span><p className="mt-1 text-sm text-text-primary">{r.vitalsSummary}</p></div>
                  <div><span className="text-xs font-medium text-text-secondary">Lab Results</span><p className="mt-1 text-sm text-text-primary">{r.labSummary}</p></div>
                  <div><span className="text-xs font-medium text-text-secondary">Ventilator</span><p className="mt-1 text-sm text-text-primary">{r.ventSummary}</p></div>
                </div>
                <div className="space-y-3">
                  <div><span className="text-xs font-medium text-text-secondary">Fluid Balance</span><p className="mt-1 text-sm text-text-primary">{r.fluidBalance}</p></div>
                  <div><span className="text-xs font-medium text-text-secondary">Nutrition</span><p className="mt-1 text-sm text-text-primary">{r.nutritionSummary}</p></div>
                  <div><span className="text-xs font-medium text-text-secondary">Consult Notes</span><p className="mt-1 text-sm text-text-primary">{r.consultNotes}</p></div>
                </div>
              </div>
              <div className="mt-3">
                <span className="text-xs font-medium text-text-secondary">Today's Goals</span>
                <div className="mt-2 space-y-1">
                  {r.todaysGoals.map((g, i) => (
                    <label key={i} className="flex items-center gap-2 text-sm text-text-primary">
                      <input type="checkbox" className="size-3 rounded border-border" />{g}
                    </label>
                  ))}
                </div>
              </div>
              <div className="mt-3"><span className="text-xs font-medium text-text-secondary">Plan</span><p className="mt-1 text-sm text-text-primary">{r.plan}</p></div>
            </IcuSection>
          ))}
        </div>
      </div>
    );
  }

  /* ──────────────────────────────────────────────────────── SCREEN 10: Care Plan */
  function CarePlanScreen() {
    return (
      <div className="space-y-6">
        <IcuPageHeader title="Multidisciplinary Care Plan" subtitle="Comprehensive care planning" />
        <IcuSection title="Rajesh Kumar — Post-CABG Cardiogenic Shock">
          <div className="space-y-4">
            {[
              { title: "Diagnosis", content: "Post-CABG cardiogenic shock. Post-operative day 1." },
              { title: "Treatment Goals", content: "1. Wean vasopressors within 24h. 2. Spontaneous breathing trial today. 3. Lactate normalization." },
              { title: "Medical Plan", content: "Continue inotropes. Monitor cardiac output. Repeat echo tomorrow. Anticoagulation per protocol." },
              { title: "Nursing Plan", content: " hourly neuro checks. Strict I&O. Pressure injury prevention. DVT prophylaxis." },
              { title: "Respiratory Therapy", content: "SBT at 10:00. Chest physiotherapy QID. Wean FiO2 if SpO2 stable." },
              { title: "Physiotherapy", content: "Passive ROM exercises. Early mobilization when hemodynamically stable." },
              { title: "Nutrition Plan", content: "Continue Ryle's tube feeds at 50 ml/hr. Dietitian review. Advance as tolerated." },
            ].map((item, i) => (
              <div key={i}>
                <span className="text-xs font-medium text-text-secondary">{item.title}</span>
                <p className="mt-1 text-sm text-text-primary">{item.content}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={() => toast.success("Care plan updated")}>Update Care Plan</Button>
            <Button variant="outline">Review History</Button>
          </div>
        </IcuSection>
      </div>
    );
  }

  /* ──────────────────────────────────────────────────────── SCREEN 11: Code Blue */
  function CodeBlueScreen() {
    const cb = CODE_BLUE_RECORDS[0];
    return (
      <div className="space-y-6">
        <IcuPageHeader title="Code Blue Management" subtitle="Cardiac arrest management and documentation" actions={
          <Button variant="danger" className="bg-danger text-white" onClick={() => toast.error("CODE BLUE ACTIVATED")}><HeartPulse className="mr-2 size-4" />Activate Code Blue</Button>
        } />
        <IcuSection title={`${cb.patientName} — Bed ${cb.bed}`} action={<StatusBadge tone={cb.status === "Resolved" ? "success" : "danger"}>{cb.status}</StatusBadge>}>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div><span className="text-xs text-text-secondary">Activated By</span><div className="mt-1 text-sm font-medium text-text-primary">{cb.activatedBy}</div></div>
            <div><span className="text-xs text-text-secondary">Activated At</span><div className="mt-1 text-sm font-medium text-text-primary">{cb.activatedAt}</div></div>
            <div><span className="text-xs text-text-secondary">Team Lead</span><div className="mt-1 text-sm font-medium text-text-primary">{cb.teamLead}</div></div>
            <div><span className="text-xs text-text-secondary">Duration</span><div className="mt-1 text-lg font-bold text-danger">{cb.duration} min</div></div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-lg bg-muted p-3 text-center"><div className="text-xs text-text-secondary">Defibrillations</div><div className="text-lg font-bold text-text-primary">{cb.defibrillations}</div></div>
            <div className="rounded-lg bg-muted p-3 text-center"><div className="text-xs text-text-secondary">Outcome</div><div className="text-lg font-bold text-success">{cb.outcome}</div></div>
          </div>
        </IcuSection>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <IcuSection title="Interventions Timeline">
            <div className="space-y-3">
              {cb.interventions.map((intv, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-1 size-2 rounded-full bg-primary" />
                  <span className="text-sm text-text-primary">{intv}</span>
                </div>
              ))}
            </div>
          </IcuSection>
          <IcuSection title="Medications Given">
            <div className="space-y-2">
              {cb.medications.map((med, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg border border-border p-3">
                  <span className="text-sm font-medium text-text-primary">{med}</span>
                </div>
              ))}
            </div>
          </IcuSection>
        </div>
        <IcuSection title="Post-Code Notes">
          <p className="text-sm text-text-primary">{cb.postCodeNotes}</p>
        </IcuSection>
      </div>
    );
  }

  /* ──────────────────────────────────────────────────────── SCREEN 12: Family Communication */
  function FamilyCommunicationScreen() {
    const fu = FAMILY_UPDATES[0];
    return (
      <div className="space-y-6">
        <IcuPageHeader title="Family Communication" subtitle={`${fu.patientName} — Contact: ${fu.contactName}`} actions={<Button onClick={() => toast.success("Update sent to family")}><Phone className="mr-2 size-4" />Send Update</Button>} />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <IcuSection title="Contact Details">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-text-secondary">Name</span><span className="text-text-primary">{fu.contactName}</span></div>
              <div className="flex justify-between"><span className="text-text-secondary">Relation</span><span className="text-text-primary">{fu.contactRelation}</span></div>
              <div className="flex justify-between"><span className="text-text-secondary">Phone</span><span className="text-text-primary">{fu.contactPhone}</span></div>
              <div className="flex justify-between"><span className="text-text-secondary">Next Meeting</span><span className="text-text-primary">{fu.nextMeeting}</span></div>
            </div>
          </IcuSection>
          <IcuSection title="Consent Requests">
            <div className="space-y-2">
              {fu.consentRequests.map((cr, i) => (
                <label key={i} className="flex items-center gap-3 rounded-lg border border-border p-3">
                  <input type="checkbox" className="size-4 rounded border-border" />
                  <span className="text-sm text-text-primary">{cr}</span>
                </label>
              ))}
            </div>
          </IcuSection>
        </div>
        <IcuSection title="Family Updates">
          <div className="space-y-3">
            {fu.updates.map((u, i) => (
              <div key={i} className="flex items-start gap-3 border-b border-border py-3 last:border-b-0">
                <div className="mt-0.5 size-2 rounded-full bg-primary" />
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-text-primary">{u.update}</span>
                    <span className="shrink-0 text-xs text-text-secondary">{u.date} {u.time}</span>
                  </div>
                  <p className="text-xs text-text-secondary">Given by: {u.givenBy}</p>
                </div>
              </div>
            ))}
          </div>
        </IcuSection>
        <IcuSection title="Meeting History">
          <div className="space-y-3">
            {fu.meetingHistory.map((m, i) => (
              <div key={i} className="rounded-lg border border-border p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-text-primary">{m.date} {m.time}</span>
                  <span className="text-xs text-text-secondary">{m.conductedBy}</span>
                </div>
                <p className="mt-1 text-sm text-text-secondary">{m.notes}</p>
              </div>
            ))}
          </div>
        </IcuSection>
      </div>
    );
  }

  /* ──────────────────────────────────────────────────────── SCREEN 13: Recovery Assessment */
  function RecoveryAssessmentScreen() {
    return (
      <div className="space-y-6">
        <IcuPageHeader title="Recovery Assessment" subtitle="Weaning, sedation, mobility, readiness for transfer" />
        <div className="space-y-4">
          {RECOVERY_ASSESSMENTS.map(ra => (
            <IcuSection key={ra.patientName} title={ra.patientName}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-3">
                  <div><span className="text-xs font-medium text-text-secondary">Ventilator Weaning</span><div className="mt-1"><StatusBadge tone={ra.ventilatorWeaning === "Completed" ? "success" : ra.ventilatorWeaning === "Failed" ? "danger" : "warning"}>{ra.ventilatorWeaning}</StatusBadge></div></div>
                  <div><span className="text-xs font-medium text-text-secondary">Sedation</span><p className="mt-1 text-sm text-text-primary">{ra.sedationAssessment}</p></div>
                  <div><span className="text-xs font-medium text-text-secondary">Mobility</span><p className="mt-1 text-sm text-text-primary">{ra.mobilityAssessment}</p></div>
                  <div><span className="text-xs font-medium text-text-secondary">Neurological Status</span><p className="mt-1 text-sm text-text-primary">{ra.neurologicalStatus}</p></div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                    <StatusBadge tone={ra.readinessForTransfer ? "success" : "warning"}>{ra.readinessForTransfer ? "Ready" : "Not Ready"}</StatusBadge>
                    <span className="text-sm text-text-primary">Ready for Transfer</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                    <StatusBadge tone={ra.doctorApproval ? "success" : "info"}>{ra.doctorApproval ? "Approved" : "Pending"}</StatusBadge>
                    <span className="text-sm text-text-primary">Doctor Approval</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                    <StatusBadge tone={ra.nurseApproval ? "success" : "info"}>{ra.nurseApproval ? "Approved" : "Pending"}</StatusBadge>
                    <span className="text-sm text-text-primary">Nurse Approval</span>
                  </div>
                </div>
              </div>
              {ra.readinessForTransfer && (
                <div className="mt-4">
                  <Button onClick={() => { toast.success("Transfer initiated for " + ra.patientName); navTo("transfer-to-ward"); }}>Initiate Transfer</Button>
                </div>
              )}
            </IcuSection>
          ))}
        </div>
      </div>
    );
  }

  /* ──────────────────────────────────────────────────────── SCREEN 14: Transfer to Ward */
  function TransferToWardScreen() {
    const ra = RECOVERY_ASSESSMENTS[0];
    return (
      <div className="space-y-6">
        <IcuPageHeader title="Transfer to Ward" subtitle={`${ra.patientName} — Transfer from ICU`} />
        <IcuSection title="Transfer Details">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">Destination Ward</label>
              <Input placeholder="Select ward" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">Bed Assignment</label>
              <Input placeholder="Select bed" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">Receiving Nurse</label>
              <Input placeholder="Enter nurse name" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">Transport Team</label>
              <Input defaultValue="Ward Boy — Sunil" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium text-text-secondary">Clinical Handover</label>
              <Textarea placeholder="Medication summary, ongoing issues, follow-up requirements…" defaultValue={`Patient stable. Off ventilator. On oral medications. Vitals stable for 12 hours. Follow-up echo in 1 week.`} />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={() => toast.success("Patient transferred to ward")}>Confirm Transfer</Button>
            <Button variant="outline">Cancel</Button>
          </div>
        </IcuSection>
      </div>
    );
  }

  /* ──────────────────────────────────────────────────────── SCREEN 15: ICU Discharge */
  function ICUDischargeScreen() {
    return (
      <div className="space-y-6">
        <IcuPageHeader title="ICU Discharge" subtitle="Generate discharge summary and documentation" />
        <IcuSection title="Discharge Summary">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">Final Diagnosis</label>
              <Input defaultValue="Post-CABG cardiogenic shock — resolved" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">Treatment Summary</label>
              <Textarea defaultValue="CABG x3 on 22/07. Post-op cardiogenic shock managed with inotropes and mechanical ventilation. Successfully weaned off ventilator on day 1. Vasopressors discontinued on day 2." />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">Medication at Discharge</label>
              <Textarea defaultValue="Aspirin 75mg, Atorvastatin 20mg, Metoprolol 25mg, Ramipril 2.5mg, Warfarin (target INR 2-3)" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">Follow-Up</label>
              <Textarea defaultValue="Cardiology OPD in 1 week. Repeat echo in 2 weeks. Cardiac rehab referral." />
            </div>
          </div>
        </IcuSection>
        <IcuSection title="Patient Education">
          <Textarea defaultValue="Activity restrictions for 6 weeks. Wound care instructions provided. Warning signs explained. Dietitian counseling completed." />
        </IcuSection>
        <div className="flex gap-2">
          <Button onClick={() => { toast.success("ICU discharge completed"); navTo("complete"); }}>Complete Discharge</Button>
          <Button variant="outline">Cancel</Button>
        </div>
      </div>
    );
  }

  /* ──────────────────────────────────────────────────────── SCREEN 16: Equipment Management */
  function EquipmentScreen() {
    return (
      <div className="space-y-6">
        <IcuPageHeader title="Equipment Management" subtitle="Ventilators, monitors, pumps, and other ICU equipment" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-3 font-medium text-text-secondary">Equipment</th>
                <th className="pb-3 font-medium text-text-secondary">Category</th>
                <th className="pb-3 font-medium text-text-secondary">Status</th>
                <th className="pb-3 font-medium text-text-secondary">Bed</th>
                <th className="pb-3 font-medium text-text-secondary">Last Serviced</th>
                <th className="pb-3 font-medium text-text-secondary">Next Service</th>
              </tr>
            </thead>
            <tbody>
              {ICU_EQUIPMENT.map(e => (
                <tr key={e.id} className="border-b border-border hover:bg-muted/50">
                  <td className="py-3 font-medium text-text-primary">{e.name}</td>
                  <td className="py-3 text-text-secondary">{e.category}</td>
                  <td className="py-3"><StatusBadge tone={e.status === "Available" ? "success" : e.status === "In Use" ? "warning" : e.status === "Alarm" ? "danger" : "info"}>{e.status}</StatusBadge></td>
                  <td className="py-3 text-text-secondary">{e.bedNumber || "—"}</td>
                  <td className="py-3 text-text-secondary text-xs">{e.lastServiced || "—"}</td>
                  <td className="py-3 text-text-secondary text-xs">{e.nextService || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  /* ──────────────────────────────────────────────────────── SCREEN 17: ICU Analytics */
  function AnalyticsScreen() {
    return (
      <div className="space-y-6">
        <IcuPageHeader title="ICU Analytics" subtitle="Performance metrics and clinical outcomes" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <IcuStatCard icon={HeartPulse} label="Mortality Rate" value="12.5%" tone="danger" />
          <IcuStatCard icon={Clock} label="Avg ICU Stay" value="3.2 days" tone="info" />
          <IcuStatCard icon={Activity} label="Ventilator Days" value="2.1 avg" tone="warning" />
          <IcuStatCard icon={BedDouble} label="Bed Occupancy" value="42%" tone="success" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <IcuStatCard icon={HeartPulse} label="Code Blue Rate" value="2.1/100" tone="danger" />
          <IcuStatCard icon={BarChart3} label="Readmission Rate" value="8.3%" tone="warning" />
          <IcuStatCard icon={Monitor} label="Equipment Utilization" value="68%" tone="info" />
          <IcuStatCard icon={ClipboardList} label="Avg SOFA Score" value="7.2" tone="warning" />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <IcuSection title="Diagnosis Distribution">
            <div className="space-y-3">
              {[{ type: "Cardiac", count: 2, pct: 40 }, { type: "Sepsis", count: 1, pct: 20 }, { type: "Neurological", count: 1, pct: 20 }, { type: "Surgical", count: 1, pct: 20 }].map(t => (
                <div key={t.type} className="flex items-center gap-3">
                  <span className="w-24 text-sm text-text-secondary">{t.type}</span>
                  <div className="flex-1"><div className="h-3 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${t.pct}%` }} /></div></div>
                  <span className="w-8 text-right text-sm font-bold text-text-primary">{t.count}</span>
                </div>
              ))}
            </div>
          </IcuSection>
          <IcuSection title="ICU Bed Utilization">
            <div className="space-y-3">
               {liveBeds.map(b => {
                const occ = b.status === "Occupied" ? 100 : b.status === "Cleaning" ? 60 : b.status === "Reserved" ? 50 : 0;
                return (
                  <div key={b.id} className="flex items-center gap-3">
                    <span className="w-12 text-sm text-text-secondary">{b.number}</span>
                    <div className="flex-1"><div className="h-3 overflow-hidden rounded-full bg-muted"><div className={`h-full rounded-full ${occ >= 100 ? "bg-danger" : occ > 0 ? "bg-warning" : "bg-success"}`} style={{ width: `${occ}%` }} /></div></div>
                    <ICUBedStatusBadge status={b.status} />
                  </div>
                );
              })}
            </div>
          </IcuSection>
        </div>
      </div>
    );
  }

  /* ──────────────────────────────────────────────────────── SCREEN 18: Workflow Complete */
  function WorkflowCompleteScreen() {
    const p = selectedPatient;
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="grid size-16 place-items-center rounded-full bg-success/10"><CheckCircle2 className="size-8 text-success" /></div>
        <h2 className="mt-6 text-2xl font-bold text-text-primary">ICU Workflow Complete</h2>
        <p className="mt-2 max-w-md text-text-secondary">All critical care screens demonstrated. In production, this screen summarizes the ICU stay, transfer/discharge status, and generates the clinical report.</p>
        <div className="mt-6 rounded-xl border border-border bg-surface p-6 text-left">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-text-secondary">Patient</span><div className="font-medium text-text-primary">{p.patientName}</div></div>
            <div><span className="text-text-secondary">Diagnosis</span><div className="font-medium text-text-primary">{p.diagnosis}</div></div>
            <div><span className="text-text-secondary">ICU Stay</span><div className="font-medium text-text-primary">{p.daysInICU} days</div></div>
            <div><span className="text-text-secondary">Outcome</span><div className="font-medium text-success">Transferred to Ward</div></div>
          </div>
        </div>
        <div className="mt-8 flex gap-2">
          <Button onClick={() => navTo("dashboard")}>Return to Dashboard</Button>
          <Button variant="outline"><Printer className="mr-2 size-4" />Generate ICU Report</Button>
        </div>
      </div>
    );
  }

  return (
    <Shell
      nav={NAV}
      navSecondary={NAV_SECONDARY}
      sectionLabel="Intensive Care Unit"
      activeId={route}
      onNavigate={(id) => navTo(id as IcuRoute)}
      breadcrumb={CRUMBS[route]}
      roleName={roleName}
      onSignOut={onSignOut}
      workspace="icu"
      onSwitchWorkspace={onSwitchWorkspace}
      onOpenSettings={onOpenSettings}
    >
      {renderScreen()}
    </Shell>
  );
}
