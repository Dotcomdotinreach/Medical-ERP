import { useState, useMemo } from "react";
import {
  LayoutDashboard, Users, Calendar, AlertTriangle, Stethoscope, Beaker, Activity,
  Pill, Bed, FileText, TrendingUp, TrendingDown, CheckCircle, Clock, Target,
  Shield, HeartPulse, Radiation, Syringe, Brain, ClipboardList, Microscope,
  FlaskConical, Bone, Eye, BarChart3, Settings, CircleDot, ChevronRight, Search,
  Plus, Download, Upload, RefreshCw, Printer, Filter, Bell, Star, Heart,
  Zap, Clock3, Timer, CalendarClock, UserCheck, UserX, ArrowRight,
  ShieldCheck, ShieldAlert, ClipboardCheck, Thermometer, Droplets, Scale, Gauge,
  PillBottle, TestTube2, ScanLine, Dna,
} from "lucide-react";
import { Shell, type Workspace } from "../his/Shell";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import { StatusBadge, StatCard, SectionCard, PageHeader } from "../his/ui";
import {
  OncologyKPIRow, CancerPatientCard, ChemoProtocolCard,
  InfusionChairCard, RadiationCard, TumorBoardCard,
  ResponseCard, ScreeningCard, PalliativeCard, AuditLogRow, SectionHeading,
} from "./oncologyUi";
import {
  CANCER_PATIENTS, CHEMO_PROTOCOLS, INFUSION_SESSIONS,
  RADIATION_SESSIONS, TUMOR_BOARDS, RESPONSE_ASSESSMENTS,
  SCREENING_RECORDS, PALLIATIVE_RECORDS, AUDIT_LOGS,
  ONCOLOGY_KPI, treatmentIntentTone, treatmentStatusTone, recistTone,
} from "./data";

type OncRoute =
  | "onc-dashboard" | "onc-registry" | "onc-screening" | "onc-diagnostics"
  | "onc-staging" | "onc-tumorBoard" | "onc-treatmentPlan" | "onc-chemotherapy"
  | "onc-radiation" | "onc-infusionCenter" | "onc-medicationTox" | "onc-responseAssessment"
  | "onc-survivorship" | "onc-palliative" | "onc-followUp" | "onc-reports"
  | "onc-qualityCompliance" | "onc-workflowComplete";

const NAV = [
  { id: "onc-dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "onc-registry", label: "Cancer Registry", icon: ClipboardList },
  { id: "onc-screening", label: "Screening", icon: Search },
  { id: "onc-diagnostics", label: "Diagnostics", icon: Microscope },
  { id: "onc-staging", label: "Cancer Staging", icon: Target },
  { id: "onc-tumorBoard", label: "Tumor Board", icon: Brain, badge: "1", tone: "warning" as const },
  { id: "onc-treatmentPlan", label: "Treatment Plan", icon: FileText },
  { id: "onc-chemotherapy", label: "Chemotherapy", icon: Syringe },
  { id: "onc-radiation", label: "Radiation Oncology", icon: Radiation },
];

const NAV_SECONDARY = [
  { id: "onc-infusionCenter", label: "Infusion Center", icon: Droplets },
  { id: "onc-medicationTox", label: "Med & Toxicity", icon: Pill },
  { id: "onc-responseAssessment", label: "Response Assessment", icon: TrendingUp },
  { id: "onc-survivorship", label: "Survivorship Care", icon: Heart },
  { id: "onc-palliative", label: "Palliative Care", icon: Shield },
  { id: "onc-followUp", label: "Follow-up", icon: CalendarClock },
  { id: "onc-reports", label: "Reports & Analytics", icon: BarChart3 },
  { id: "onc-qualityCompliance", label: "Quality & Compliance", icon: ShieldCheck },
  { id: "onc-workflowComplete", label: "Workflow Complete", icon: CheckCircle },
];

export function OncologyApp({ roleName, onSignOut, onSwitchWorkspace, onOpenSettings }: {
  roleName: string; onSignOut: () => void; onSwitchWorkspace: (w: Workspace) => void; onOpenSettings?: (page: string) => void;
}) {
  const [screen, setScreen] = useState<OncRoute>("onc-dashboard");
  const [selectedPatient, setSelectedPatient] = useState(CANCER_PATIENTS[0]);

  const breadcrumb = useMemo(() => {
    const crumb = ["Oncology"];
    const nav = [...NAV, ...NAV_SECONDARY].find((n) => n.id === screen);
    if (nav) crumb.push(nav.label);
    return crumb;
  }, [screen]);

  return (
    <Shell
      nav={NAV}
      navSecondary={NAV_SECONDARY}
      sectionLabel="Oncology Management"
      activeId={screen}
      isActive={(id) => id === screen}
      onNavigate={(id) => setScreen(id as OncRoute)}
      breadcrumb={breadcrumb}
      roleName={roleName}
      onSignOut={onSignOut}
      workspace="oncology"
      onSwitchWorkspace={onSwitchWorkspace}
      onOpenSettings={onOpenSettings}
      searchPlaceholder="Search cancer patients, UHID…"
    >
      {screen === "onc-dashboard" && <DashboardScreen onSelectPatient={(p) => { setSelectedPatient(p); setScreen("onc-registry"); }} />}
      {screen === "onc-registry" && <RegistryScreen patient={selectedPatient} onBack={() => setScreen("onc-dashboard")} />}
      {screen === "onc-screening" && <ScreeningScreen />}
      {screen === "onc-diagnostics" && <DiagnosticsScreen patient={selectedPatient} />}
      {screen === "onc-staging" && <StagingScreen patient={selectedPatient} />}
      {screen === "onc-tumorBoard" && <TumorBoardScreen />}
      {screen === "onc-treatmentPlan" && <TreatmentPlanScreen patient={selectedPatient} />}
      {screen === "onc-chemotherapy" && <ChemotherapyScreen />}
      {screen === "onc-radiation" && <RadiationScreen />}
      {screen === "onc-infusionCenter" && <InfusionCenterScreen />}
      {screen === "onc-medicationTox" && <MedicationToxScreen />}
      {screen === "onc-responseAssessment" && <ResponseAssessmentScreen />}
      {screen === "onc-survivorship" && <SurvivorshipScreen />}
      {screen === "onc-palliative" && <PalliativeScreen />}
      {screen === "onc-followUp" && <FollowUpScreen />}
      {screen === "onc-reports" && <ReportsScreen />}
      {screen === "onc-qualityCompliance" && <QualityComplianceScreen />}
      {screen === "onc-workflowComplete" && <WorkflowCompleteScreen />}
    </Shell>
  );
}

export default OncologyApp;

/* ── Screen: Dashboard ────────────────────────────────────────────────────── */
function DashboardScreen({ onSelectPatient }: { onSelectPatient: (p: any) => void }) {
  return (
    <div className="space-y-4">
      <PageHeader title="Oncology Dashboard" subtitle="Overview of cancer care operations" icon={LayoutDashboard}
        actions={<><Button variant="outline" size="sm"><RefreshCw className="mr-1.5 size-4" />Refresh</Button><Button variant="outline" size="sm"><Download className="mr-1.5 size-4" />Export</Button></>} />
      <OncologyKPIRow />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SectionCard title="Active Patients" className="lg:col-span-2">
          <div className="space-y-2">
            {CANCER_PATIENTS.filter(p => p.treatmentStatus === "In Progress").map(p => (
              <CancerPatientCard key={p.id} p={p} onSelect={() => onSelectPatient(p)} />
            ))}
          </div>
        </SectionCard>

        <div className="space-y-4">
          <SectionCard title="Today's Infusion Schedule">
            <div className="space-y-2">
              {INFUSION_SESSIONS.map(s => (
                <InfusionChairCard key={s.id} s={s} />
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Upcoming Tumor Boards">
            <div className="space-y-2">
              {TUMOR_BOARDS.filter(t => t.status === "Scheduled").map(t => (
                <TumorBoardCard key={t.id} t={t} />
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Recent Alerts">
            <div className="space-y-2">
              {AUDIT_LOGS.filter(a => a.severity !== "Info").map(a => (
                <AuditLogRow key={a.id} log={a} />
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

/* ── Screen: Cancer Registry ──────────────────────────────────────────────── */
function RegistryScreen({ patient, onBack }: { patient: any; onBack: () => void }) {
  return (
    <div className="space-y-4">
      <PageHeader title="Cancer Registry" subtitle="Comprehensive cancer patient profiles and staging" icon={ClipboardList}
        actions={<Button variant="outline" size="sm" onClick={onBack}><ArrowRight className="mr-1.5 size-4" />Back to Dashboard</Button>} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SectionCard title="Patient Profile" className="lg:col-span-1">
          <div className="space-y-3">
            <div className="text-center">
              <Avatar className="h-16 w-16 mx-auto">
                <AvatarFallback className="text-lg">{patient.name.split(" ").map((n: string) => n[0]).join("")}</AvatarFallback>
              </Avatar>
              <h3 className="font-semibold mt-2">{patient.name}</h3>
              <p className="text-sm text-muted-foreground">{patient.uhid} | {patient.age}y {patient.gender}</p>
            </div>
            <Separator />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Cancer Type</span><span className="font-medium">{patient.cancerType}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Primary Site</span><span className="font-medium">{patient.primarySite}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Histology</span><span className="font-medium text-right max-w-[200px] truncate">{patient.histology}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Stage</span><Badge variant="outline">{patient.ajccStage}</Badge></div>
              <div className="flex justify-between"><span className="text-muted-foreground">ECOG</span><StatusBadge tone={parseInt(patient.ecogStatus) <= 1 ? "success" : parseInt(patient.ecogStatus) <= 2 ? "warning" : "danger"}>ECOG {patient.ecogStatus}</StatusBadge></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Intent</span><StatusBadge tone={treatmentIntentTone(patient.treatmentIntent)}>{patient.treatmentIntent}</StatusBadge></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Status</span><StatusBadge tone={treatmentStatusTone(patient.treatmentStatus)}>{patient.treatmentStatus}</StatusBadge></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Oncologist</span><span className="font-medium">{patient.assignedOncologist}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Registry ID</span><span className="font-mono text-xs">{patient.registryId}</span></div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="TNM Staging & Biomarkers" className="lg:col-span-2">
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-muted text-center">
                <p className="text-xs text-muted-foreground">T (Tumor)</p>
                <p className="text-xl font-bold">{patient.tnmT}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted text-center">
                <p className="text-xs text-muted-foreground">N (Nodes)</p>
                <p className="text-xl font-bold">{patient.tnmN}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted text-center">
                <p className="text-xs text-muted-foreground">M (Metastasis)</p>
                <p className="text-xl font-bold">{patient.tnmM}</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-2">Biomarkers & Molecular Profile</h4>
              <div className="flex flex-wrap gap-2">
                {patient.biomarkers.map((b: string, i: number) => (
                  <Badge key={i} variant="outline" className="text-xs">{b}</Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-2">Molecular: {patient.molecularProfile}</p>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-2">Diagnosis Timeline</h4>
              <div className="flex items-center gap-4 text-sm flex-wrap">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Diagnosed: {patient.diagnosisDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Last Visit: {patient.lastVisit}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarClock className="h-4 w-4 text-muted-foreground" />
                  <span>Next Visit: {patient.nextVisit}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-2">Insurance</h4>
              <p className="text-sm text-muted-foreground">{patient.insuranceProvider} — Policy: {patient.insurancePolicyNo}</p>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

/* ── Screen: Screening ────────────────────────────────────────────────────── */
function ScreeningScreen() {
  return (
    <div className="space-y-4">
      <PageHeader title="Cancer Screening" subtitle="Population screening programs and risk assessment" icon={Search}
        actions={<Button size="sm"><Plus className="mr-1.5 size-4" />New Screening</Button>} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total Screened" value={156} icon={Search} />
        <StatCard label="Abnormal Results" value={12} icon={AlertTriangle} />
        <StatCard label="Pending Follow-up" value={8} icon={Clock} />
        <StatCard label="Cancers Detected" value={5} icon={Target} />
      </div>

      <SectionCard title="Screening Records">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {SCREENING_RECORDS.map(s => (
            <ScreeningCard key={s.id} s={s} />
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Screening Protocols">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Screening Type</TableHead>
              <TableHead>Eligible Population</TableHead>
              <TableHead>Frequency</TableHead>
              <TableHead>Current Cohort</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Mammography</TableCell>
              <TableCell>Women 40-74 years</TableCell>
              <TableCell>Every 2 years</TableCell>
              <TableCell>89 women</TableCell>
              <TableCell><StatusBadge tone="success">Active</StatusBadge></TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Pap Smear + HPV</TableCell>
              <TableCell>Women 25-65 years</TableCell>
              <TableCell>Every 3-5 years</TableCell>
              <TableCell>120 women</TableCell>
              <TableCell><StatusBadge tone="success">Active</StatusBadge></TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Colonoscopy</TableCell>
              <TableCell>Adults 45-75 years</TableCell>
              <TableCell>Every 10 years</TableCell>
              <TableCell>45 adults</TableCell>
              <TableCell><StatusBadge tone="warning">Scheduled</StatusBadge></TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Low-dose CT</TableCell>
              <TableCell>Smokers 50-80 years</TableCell>
              <TableCell>Annual</TableCell>
              <TableCell>32 patients</TableCell>
              <TableCell><StatusBadge tone="info">Pending</StatusBadge></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </SectionCard>
    </div>
  );
}

/* ── Screen: Diagnostics ──────────────────────────────────────────────────── */
function DiagnosticsScreen({ patient }: { patient: any }) {
  return (
    <div className="space-y-4">
      <PageHeader title="Diagnostics" subtitle="Pathology, histopathology, molecular diagnostics" icon={Microscope}
        actions={<Button size="sm"><Plus className="mr-1.5 size-4" />Order Test</Button>} />

      <Tabs defaultValue="pathology">
        <TabsList>
          <TabsTrigger value="pathology">Pathology</TabsTrigger>
          <TabsTrigger value="molecular">Molecular</TabsTrigger>
          <TabsTrigger value="imaging">Imaging</TabsTrigger>
          <TabsTrigger value="labs">Tumor Markers</TabsTrigger>
        </TabsList>

        <TabsContent value="pathology">
          <SectionCard title={`Pathology Results — ${patient.name}`}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Test</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead>Pathologist</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Biopsy — H&E</TableCell>
                  <TableCell>{patient.diagnosisDate}</TableCell>
                  <TableCell>{patient.histology}</TableCell>
                  <TableCell>Dr. Asha Pathologist</TableCell>
                  <TableCell><StatusBadge tone="success">Reported</StatusBadge></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">IHC Panel</TableCell>
                  <TableCell>{patient.diagnosisDate}</TableCell>
                  <TableCell>{patient.biomarkers.join(", ")}</TableCell>
                  <TableCell>Dr. Asha Pathologist</TableCell>
                  <TableCell><StatusBadge tone="success">Reported</StatusBadge></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Ki-67 Index</TableCell>
                  <TableCell>{patient.diagnosisDate}</TableCell>
                  <TableCell>{patient.biomarkers.find((b: string) => b.includes("Ki-67")) || "25%"}</TableCell>
                  <TableCell>Dr. Asha Pathologist</TableCell>
                  <TableCell><StatusBadge tone="success">Reported</StatusBadge></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </SectionCard>
        </TabsContent>

        <TabsContent value="molecular">
          <SectionCard title="Molecular Diagnostics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-4 rounded-lg border space-y-2">
                <div className="flex items-center gap-2">
                  <Dna className="h-5 w-5 text-primary" />
                  <h4 className="font-semibold text-sm">Next-Generation Sequencing (NGS)</h4>
                </div>
                <p className="text-sm text-muted-foreground">Comprehensive genomic profiling for targetable mutations</p>
                <Badge variant="outline">{patient.molecularProfile}</Badge>
              </div>
              <div className="p-4 rounded-lg border space-y-2">
                <div className="flex items-center gap-2">
                  <FlaskConical className="h-5 w-5 text-primary" />
                  <h4 className="font-semibold text-sm">PD-L1 TPS</h4>
                </div>
                <p className="text-sm text-muted-foreground">Programmed Death-Ligand 1 Tumor Proportion Score</p>
                <Badge variant="outline">{patient.biomarkers.find((b: string) => b.includes("PD-L1")) || "Not applicable"}</Badge>
              </div>
              <div className="p-4 rounded-lg border space-y-2">
                <div className="flex items-center gap-2">
                  <Beaker className="h-5 w-5 text-primary" />
                  <h4 className="font-semibold text-sm">MSI / MMR Status</h4>
                </div>
                <p className="text-sm text-muted-foreground">Microsatellite Instability — Mismatch Repair</p>
                <Badge variant="outline">{patient.biomarkers.find((b: string) => b.includes("MSI")) || "Stable"}</Badge>
              </div>
              <div className="p-4 rounded-lg border space-y-2">
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  <h4 className="font-semibold text-sm">Tumor Mutational Burden (TMB)</h4>
                </div>
                <p className="text-sm text-muted-foreground">TMB-High (&gt;10 mut/Mb) may predict IO response</p>
                <Badge variant="outline">8 mut/Mb — TMB Low</Badge>
              </div>
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="imaging">
          <SectionCard title="Imaging Studies">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Study</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Findings</TableHead>
                  <TableHead>Radiologist</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">PET-CT</TableCell>
                  <TableCell>2026-07-15</TableCell>
                  <TableCell>Partial metabolic response in primary site</TableCell>
                  <TableCell>Dr. Priya Radiologist</TableCell>
                  <TableCell><StatusBadge tone="success">Completed</StatusBadge></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">MRI Brain</TableCell>
                  <TableCell>2026-06-20</TableCell>
                  <TableCell>No intracranial metastases</TableCell>
                  <TableCell>Dr. Priya Radiologist</TableCell>
                  <TableCell><StatusBadge tone="success">Completed</StatusBadge></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">CT Chest/Abdomen</TableCell>
                  <TableCell>2026-07-10</TableCell>
                  <TableCell>Stable disease — no new lesions</TableCell>
                  <TableCell>Dr. Priya Radiologist</TableCell>
                  <TableCell><StatusBadge tone="success">Completed</StatusBadge></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </SectionCard>
        </TabsContent>

        <TabsContent value="labs">
          <SectionCard title="Tumor Markers">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Marker</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Reference Range</TableHead>
                  <TableHead>Trend</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">CA-125</TableCell>
                  <TableCell>180 U/mL</TableCell>
                  <TableCell>0-35 U/mL</TableCell>
                  <TableCell><TrendingDown className="h-4 w-4 text-green-600" /></TableCell>
                  <TableCell>2026-07-05</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">CEA</TableCell>
                  <TableCell>8.2 ng/mL</TableCell>
                  <TableCell>0-3 ng/mL</TableCell>
                  <TableCell><TrendingDown className="h-4 w-4 text-green-600" /></TableCell>
                  <TableCell>2026-07-15</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">PSA</TableCell>
                  <TableCell>12.5 ng/mL</TableCell>
                  <TableCell>0-4 ng/mL</TableCell>
                  <TableCell><TrendingUp className="h-4 w-4 text-red-600" /></TableCell>
                  <TableCell>2026-07-12</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">AFP</TableCell>
                  <TableCell>5.8 ng/mL</TableCell>
                  <TableCell>0-10 ng/mL</TableCell>
                  <TableCell><TrendingDown className="h-4 w-4 text-green-600" /></TableCell>
                  <TableCell>2026-07-08</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ── Screen: Cancer Staging ───────────────────────────────────────────────── */
function StagingScreen({ patient }: { patient: any }) {
  return (
    <div className="space-y-4">
      <PageHeader title="Cancer Staging" subtitle="TNM staging, AJCC classification, staging workup" icon={Target} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="TNM Classification">
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="p-4 rounded-lg bg-muted text-center space-y-1">
                <p className="text-xs text-muted-foreground">T — Primary Tumor</p>
                <p className="text-3xl font-bold">{patient.tnmT}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted text-center space-y-1">
                <p className="text-xs text-muted-foreground">N — Regional Nodes</p>
                <p className="text-3xl font-bold">{patient.tnmN}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted text-center space-y-1">
                <p className="text-xs text-muted-foreground">M — Distant Metastasis</p>
                <p className="text-3xl font-bold">{patient.tnmM}</p>
              </div>
            </div>
            <div className="p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground mb-1">AJCC 8th Edition Staging</p>
              <p className="text-lg font-bold">{patient.ajccStage}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-muted text-center">
                <p className="text-xs text-muted-foreground">Histological Grade</p>
                <p className="text-lg font-semibold">Grade 2 (Moderate)</p>
              </div>
              <div className="p-3 rounded-lg bg-muted text-center">
                <p className="text-xs text-muted-foreground">ECOG Performance</p>
                <p className="text-lg font-semibold">ECOG {patient.ecogStatus}</p>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Staging Workup Checklist">
          <div className="space-y-3">
            {[
              { item: "History & Physical Examination", done: true },
              { item: "Complete Blood Count (CBC)", done: true },
              { item: "Comprehensive Metabolic Panel", done: true },
              { item: "Tumor Markers", done: true },
              { item: "CT Chest/Abdomen/Pelvis", done: true },
              { item: "PET-CT Scan", done: true },
              { item: "MRI (site-specific)", done: true },
              { item: "Bone Scan", done: false },
              { item: "Brain MRI", done: true },
              { item: "Biopsy & Histopathology", done: true },
              { item: "Molecular Profiling / NGS", done: true },
              { item: "Multidisciplinary Tumor Board", done: false },
            ].map((w, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded border">
                {w.done ? <CheckCircle className="h-4 w-4 text-green-600" /> : <Clock className="h-4 w-4 text-muted-foreground" />}
                <span className={`text-sm ${w.done ? "" : "text-muted-foreground"}`}>{w.item}</span>
                <StatusBadge tone={w.done ? "success" : "warning"}>{w.done ? "Done" : "Pending"}</StatusBadge>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

/* ── Screen: Tumor Board ──────────────────────────────────────────────────── */
function TumorBoardScreen() {
  return (
    <div className="space-y-4">
      <PageHeader title="Tumor Board (MDT)" subtitle="Multidisciplinary team meetings" icon={Brain}
        actions={<Button size="sm"><Plus className="mr-1.5 size-4" />Schedule Meeting</Button>} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="This Month" value={TUMOR_BOARDS.length} icon={Brain} />
        <StatCard label="Cases Discussed" value={TUMOR_BOARDS.reduce((a, t) => a + t.caseCount, 0)} icon={Users} />
        <StatCard label="Decisions Made" value={TUMOR_BOARDS.reduce((a, t) => a + t.decisions.length, 0)} icon={CheckCircle} />
        <StatCard label="Pending Review" value={1} icon={Clock} />
      </div>

      <SectionCard title="Meeting Schedule">
        <div className="space-y-3">
          {TUMOR_BOARDS.map(t => (
            <TumorBoardCard key={t.id} t={t} />
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Tumor Board Protocol">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {[
            { step: "1", title: "Case Presentation", desc: "Oncologist presents patient history, staging, biomarkers" },
            { step: "2", title: "Imaging Review", desc: "Radiologist presents imaging findings and measurements" },
            { step: "3", title: "Pathology Review", desc: "Pathologist confirms histology, IHC, molecular results" },
            { step: "4", title: "MDT Decision", desc: "Consensus treatment recommendation documented" },
          ].map(s => (
            <div key={s.step} className="p-3 rounded-lg border space-y-2">
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">{s.step}</div>
              <h4 className="font-semibold text-sm">{s.title}</h4>
              <p className="text-xs text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

/* ── Screen: Treatment Planning ───────────────────────────────────────────── */
function TreatmentPlanScreen({ patient }: { patient: any }) {
  return (
    <div className="space-y-4">
      <PageHeader title="Treatment Planning" subtitle="Individualized cancer treatment protocols" icon={FileText}
        actions={<Button size="sm"><Plus className="mr-1.5 size-4" />New Plan</Button>} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SectionCard title="Current Treatment Plan" className="lg:col-span-2">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback>{patient.name.split(" ").map((n: string) => n[0]).join("")}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{patient.name}</p>
                <p className="text-sm text-muted-foreground">{patient.cancerType} — {patient.ajccStage}</p>
              </div>
              <div className="ml-auto">
                <StatusBadge tone={treatmentIntentTone(patient.treatmentIntent)}>{patient.treatmentIntent}</StatusBadge>
              </div>
            </div>

            <div className="p-4 rounded-lg border space-y-3">
              <h4 className="font-semibold">Treatment Sequence</h4>
              <div className="space-y-2">
                {patient.treatmentIntent === "Curative" ? (
                  <>
                    <div className="flex items-center gap-2 p-2 bg-muted rounded">
                      <span className="h-6 w-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold">1</span>
                      <span className="text-sm">Neoadjuvant Chemotherapy (if indicated)</span>
                      <StatusBadge tone="info">Optional</StatusBadge>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-muted rounded">
                      <span className="h-6 w-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">2</span>
                      <span className="text-sm">Surgical Resection</span>
                      <StatusBadge tone="warning">Planned</StatusBadge>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-muted rounded">
                      <span className="h-6 w-6 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs font-bold">3</span>
                      <span className="text-sm">Adjuvant Chemotherapy</span>
                      <StatusBadge tone="info">In Progress</StatusBadge>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-muted rounded">
                      <span className="h-6 w-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold">4</span>
                      <span className="text-sm">Radiation Therapy (if indicated)</span>
                      <StatusBadge tone="info">Pending</StatusBadge>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2 p-2 bg-muted rounded">
                      <span className="h-6 w-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">1</span>
                      <span className="text-sm">First-line Systemic Therapy</span>
                      <StatusBadge tone="info">In Progress</StatusBadge>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-muted rounded">
                      <span className="h-6 w-6 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs font-bold">2</span>
                      <span className="text-sm">Response Assessment (q2-3 cycles)</span>
                      <StatusBadge tone="warning">Scheduled</StatusBadge>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-muted rounded">
                      <span className="h-6 w-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold">3</span>
                      <span className="text-sm">Second-line (if progression)</span>
                      <StatusBadge tone="info">Contingency</StatusBadge>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Supportive Care">
          <div className="space-y-3">
            {[
              { icon: Pill, title: "Anti-emetic Prophylaxis", desc: "5-HT3 antagonist + Dexamethasone + NK1", status: "Active" },
              { icon: HeartPulse, title: "Cardiac Monitoring", desc: "ECHO q3 cycles (Anthracycline protocol)", status: "Due" },
              { icon: Shield, title: "Infection Prophylaxis", desc: "Filgrastim — ANC support", status: "Active" },
              { icon: Scale, title: "Nutritional Support", desc: "Dietitian consultation — High protein diet", status: "Active" },
              { icon: Brain, title: "Psycho-oncology", desc: "Psychological support & counseling", status: "Referred" },
            ].map((c, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded border">
                <div className="h-8 w-8 rounded bg-muted flex items-center justify-center shrink-0"><c.icon className="h-4 w-4" /></div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm">{c.title}</p>
                  <p className="text-xs text-muted-foreground">{c.desc}</p>
                </div>
                <StatusBadge tone={c.status === "Active" ? "success" : "warning"}>{c.status}</StatusBadge>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

/* ── Screen: Chemotherapy ─────────────────────────────────────────────────── */
function ChemotherapyScreen() {
  return (
    <div className="space-y-4">
      <PageHeader title="Chemotherapy Management" subtitle="Protocols, cycles, dose calculations" icon={Syringe}
        actions={<Button size="sm"><Plus className="mr-1.5 size-4" />New Protocol</Button>} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Active Protocols" value={CHEMO_PROTOCOLS.length} icon={Syringe} />
        <StatCard label="Cycles Today" value={2} icon={Clock} />
        <StatCard label="Dose Modifications" value={1} icon={AlertTriangle} />
        <StatCard label="Completed This Month" value={8} icon={CheckCircle} />
      </div>

      <SectionCard title="Active Protocols">
        <div className="space-y-3">
          {CHEMO_PROTOCOLS.map(c => (
            <ChemoProtocolCard key={c.id} c={c} />
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Dose Calculation">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Body Surface Area (BSA)</h4>
            <div className="flex gap-3">
              <div className="flex-1">
                <Label className="text-xs">Weight (kg)</Label>
                <Input type="number" defaultValue="65" />
              </div>
              <div className="flex-1">
                <Label className="text-xs">Height (cm)</Label>
                <Input type="number" defaultValue="165" />
              </div>
            </div>
            <div className="p-3 bg-muted rounded text-center">
              <p className="text-xs text-muted-foreground">Calculated BSA</p>
              <p className="text-2xl font-bold">1.72 m²</p>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Drug Doses (BSA-based)</h4>
            <div className="space-y-2">
              {[
                { drug: "Doxorubicin", dose: "60 mg/m²", total: "103.2 mg", adjusted: "100 mg" },
                { drug: "Cyclophosphamide", dose: "600 mg/m²", total: "1032 mg", adjusted: "1000 mg" },
              ].map((d, i) => (
                <div key={i} className="flex items-center justify-between p-2 border rounded text-sm">
                  <span className="font-medium">{d.drug}</span>
                  <span className="text-muted-foreground">{d.dose}</span>
                  <span className="text-muted-foreground">{d.total}</span>
                  <Badge variant="outline">{d.adjusted}</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

/* ── Screen: Radiation Oncology ───────────────────────────────────────────── */
function RadiationScreen() {
  return (
    <div className="space-y-4">
      <PageHeader title="Radiation Oncology" subtitle="External beam, brachytherapy, treatment planning" icon={Radiation}
        actions={<Button size="sm"><Plus className="mr-1.5 size-4" />New RT Plan</Button>} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Active RT Patients" value={RADIATION_SESSIONS.filter(r => r.status === "In Progress").length} icon={Radiation} />
        <StatCard label="Completed This Month" value={5} icon={CheckCircle} />
        <StatCard label="LINACs Available" value="2/2" icon={Settings} />
        <StatCard label="Avg Wait Time" value="3.2d" icon={Clock} />
      </div>

      <SectionCard title="Treatment Plans">
        <div className="space-y-3">
          {RADIATION_SESSIONS.map(r => (
            <RadiationCard key={r.id} r={r} />
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Techniques & Machines">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { name: "IMRT", desc: "Intensity-Modulated Radiation Therapy — Conformal dose distribution", used: 2 },
            { name: "VMAT", desc: "Volumetric Modulated Arc Therapy — Faster delivery, same conformity", used: 1 },
            { name: "SBRT", desc: "Stereotactic Body Radiation Therapy — Hypofractionated, ablative", used: 0 },
          ].map((t, i) => (
            <div key={i} className="p-4 rounded-lg border space-y-2">
              <div className="flex items-center gap-2">
                <Radiation className="h-5 w-5 text-primary" />
                <h4 className="font-semibold text-sm">{t.name}</h4>
              </div>
              <p className="text-xs text-muted-foreground">{t.desc}</p>
              <p className="text-xs"><span className="font-medium">{t.used}</span> patients currently</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

/* ── Screen: Infusion Center ──────────────────────────────────────────────── */
function InfusionCenterScreen() {
  return (
    <div className="space-y-4">
      <PageHeader title="Infusion Center" subtitle="Chair management, real-time infusion tracking" icon={Droplets}
        actions={<Button size="sm"><Plus className="mr-1.5 size-4" />Schedule Infusion</Button>} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total Chairs" value={ONCOLOGY_KPI.totalInfusionChairs} icon={Bed} />
        <StatCard label="Occupied" value={ONCOLOGY_KPI.totalInfusionChairs - ONCOLOGY_KPI.availableChairs} icon={Users} />
        <StatCard label="Available" value={ONCOLOGY_KPI.availableChairs} icon={CheckCircle} />
        <StatCard label="Avg Duration" value="3.5h" icon={Timer} />
      </div>

      <SectionCard title="Active Infusions">
        <div className="space-y-3">
          {INFUSION_SESSIONS.map(s => (
            <InfusionChairCard key={s.id} s={s} />
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Chair Status Overview">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: ONCOLOGY_KPI.totalInfusionChairs }, (_, i) => {
            const session = INFUSION_SESSIONS.find(s => s.chairId === `IC-${String(i + 1).padStart(2, "0")}`);
            const occupied = !!session;
            return (
              <div key={i} className={`p-3 rounded-lg border text-center space-y-1 ${occupied ? "bg-primary/5 border-primary/20" : "bg-green-50 border-green-200"}`}>
                <p className="text-xs text-muted-foreground">Chair IC-{String(i + 1).padStart(2, "0")}</p>
                {occupied ? (
                  <>
                    <p className="text-sm font-medium">{session!.patientName}</p>
                    <StatusBadge tone={session!.status === "In Progress" ? "info" : session!.status === "Completed" ? "success" : "warning"}>{session!.status}</StatusBadge>
                  </>
                ) : (
                  <p className="text-sm text-green-600 font-medium">Available</p>
                )}
              </div>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}

/* ── Screen: Medication & Toxicity ────────────────────────────────────────── */
function MedicationToxScreen() {
  return (
    <div className="space-y-4">
      <PageHeader title="Medication & Toxicity Monitoring" subtitle="Chemotherapy toxicity grading, supportive medications" icon={Pill} />

      <Tabs defaultValue="toxicity">
        <TabsList>
          <TabsTrigger value="toxicity">Toxicity Log</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="labs">Lab Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="toxicity">
          <SectionCard title="CTCAE Toxicity Grading">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Toxicity</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Agent</TableHead>
                  <TableHead>Management</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Anita Patel</TableCell>
                  <TableCell>Peripheral Neuropathy</TableCell>
                  <TableCell><Badge variant="destructive">Grade 3</Badge></TableCell>
                  <TableCell>Oxaliplatin</TableCell>
                  <TableCell>Dose reduced 25%. Pyridoxine 50mg TID.</TableCell>
                  <TableCell><StatusBadge tone="warning">Monitoring</StatusBadge></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Priya Sharma</TableCell>
                  <TableCell>Neutropenia</TableCell>
                  <TableCell><Badge variant="destructive">Grade 2</Badge></TableCell>
                  <TableCell>Doxorubicin</TableCell>
                  <TableCell>Filgrastim 5mcg/kg. ANC monitoring q48h.</TableCell>
                  <TableCell><StatusBadge tone="info">In Progress</StatusBadge></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Rajesh Kumar</TableCell>
                  <TableCell>Nausea/Vomiting</TableCell>
                  <TableCell><Badge variant="outline">Grade 1</Badge></TableCell>
                  <TableCell>Cisplatin</TableCell>
                  <TableCell>Ondansetron 8mg PRN. Appetite adequate.</TableCell>
                  <TableCell><StatusBadge tone="success">Controlled</StatusBadge></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </SectionCard>
        </TabsContent>

        <TabsContent value="medications">
          <SectionCard title="Supportive Medications">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Drug</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Frequency</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Anti-emetic</TableCell>
                  <TableCell>Ondansetron</TableCell>
                  <TableCell>Chemotherapy-induced nausea</TableCell>
                  <TableCell>8mg IV/PO Q8H</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Anti-emetic</TableCell>
                  <TableCell>Aprepitant</TableCell>
                  <TableCell>NK1 receptor antagonist</TableCell>
                  <TableCell>125mg Day 1, 80mg Day 2-3</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Growth Factor</TableCell>
                  <TableCell>Filgrastim</TableCell>
                  <TableCell>G-CSF — ANC support</TableCell>
                  <TableCell>5mcg/kg SC daily</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Bone Health</TableCell>
                  <TableCell>Zoledronic Acid</TableCell>
                  <TableCell>Bone metastasis / Osteoporosis</TableCell>
                  <TableCell>4mg IV q4 weeks</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Gastrointestinal</TableCell>
                  <TableCell>Omeprazole</TableCell>
                  <TableCell>Gastric protection</TableCell>
                  <TableCell>20mg PO daily</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </SectionCard>
        </TabsContent>

        <TabsContent value="labs">
          <SectionCard title="Pre-Chemotherapy Labs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { test: "CBC with Differential", required: "ANC ≥ 1500, Platelets ≥ 100K", status: "Pass" },
                { test: "Comprehensive Metabolic Panel", required: "Creatinine ≤ 1.5x ULN, LFTs < 3x ULN", status: "Pass" },
                { test: "Coagulation Profile", required: "PT/INR normal", status: "Pass" },
                { test: "Cardiac (ECHO)", required: "LVEF ≥ 50% (Anthracyclines)", status: "Due" },
                { test: "Renal Function (GFR)", required: "GFR ≥ 45 mL/min (Cisplatin)", status: "Pass" },
                { test: "Pregnancy Test", required: "Negative (women of childbearing age)", status: "Pass" },
              ].map((l, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="text-sm font-medium">{l.test}</p>
                    <p className="text-xs text-muted-foreground">{l.required}</p>
                  </div>
                  <StatusBadge tone={l.status === "Pass" ? "success" : "warning"}>{l.status}</StatusBadge>
                </div>
              ))}
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ── Screen: Response Assessment ──────────────────────────────────────────── */
function ResponseAssessmentScreen() {
  return (
    <div className="space-y-4">
      <PageHeader title="Response Assessment" subtitle="RECIST criteria, treatment response evaluation" icon={TrendingUp}
        actions={<Button size="sm"><Plus className="mr-1.5 size-4" />New Assessment</Button>} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="CR (Complete)" value={0} icon={CheckCircle} />
        <StatCard label="PR (Partial)" value={RESPONSE_ASSESSMENTS.filter(r => r.recistResponse === "PR").length} icon={TrendingDown} />
        <StatCard label="SD (Stable)" value={RESPONSE_ASSESSMENTS.filter(r => r.recistResponse === "SD").length} icon={Target} />
        <StatCard label="PD (Progression)" value={0} icon={AlertTriangle} />
      </div>

      <SectionCard title="Assessments">
        <div className="space-y-3">
          {RESPONSE_ASSESSMENTS.map(r => (
            <ResponseCard key={r.id} r={r} />
          ))}
        </div>
      </SectionCard>

      <SectionCard title="RECIST 1.1 Criteria">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {[
            { code: "CR", name: "Complete Response", desc: "Disappearance of all target lesions", color: "green" },
            { code: "PR", name: "Partial Response", desc: "≥30% decrease in sum of diameters", color: "blue" },
            { code: "SD", name: "Stable Disease", desc: "Neither PR nor PD criteria met", color: "yellow" },
            { code: "PD", name: "Progressive Disease", desc: "≥20% increase + absolute increase ≥5mm", color: "red" },
          ].map(r => (
            <div key={r.code} className="p-3 rounded-lg border space-y-1">
              <Badge variant="outline">{r.code}</Badge>
              <h4 className="font-semibold text-sm">{r.name}</h4>
              <p className="text-xs text-muted-foreground">{r.desc}</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

/* ── Screen: Survivorship Care ────────────────────────────────────────────── */
function SurvivorshipScreen() {
  return (
    <div className="space-y-4">
      <PageHeader title="Survivorship Care" subtitle="Post-treatment surveillance, survivorship plans" icon={Heart} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Active Survivors" value={12} icon={Heart} />
        <StatCard label="Due for Follow-up" value={3} icon={CalendarClock} />
        <StatCard label="Survivorship Plans" value={10} icon={FileText} />
        <StatCard label="5-Year Survival" value={`${ONCOLOGY_KPI.survivalRate5Year}%`} icon={TrendingUp} />
      </div>

      <SectionCard title="Survivorship Care Plans">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Cancer Type</TableHead>
              <TableHead>Treatment Completed</TableHead>
              <TableHead>Surveillance Protocol</TableHead>
              <TableHead>Next Follow-up</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Kavita Reddy</TableCell>
              <TableCell>Cervical — IIB</TableCell>
              <TableCell>Concurrent ChemoRT</TableCell>
              <TableCell>Q3mo — Pelvic exam + Pap smear</TableCell>
              <TableCell>2026-10-18</TableCell>
              <TableCell><StatusBadge tone="success">Active</StatusBadge></TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Deepak Gupta</TableCell>
              <TableCell>Prostate — IIA</TableCell>
              <TableCell>Prostatectomy + RT</TableCell>
              <TableCell>Q6mo — PSA monitoring</TableCell>
              <TableCell>2026-08-12</TableCell>
              <TableCell><StatusBadge tone="warning">Upcoming</StatusBadge></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </SectionCard>

      <SectionCard title="Long-term Effects Monitoring">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { effect: "Cardiotoxicity", agents: "Anthracyclines, Trastuzumab", monitor: "ECHO q6-12 months", icon: HeartPulse },
            { effect: "Peripheral Neuropathy", agents: "Platinum, Taxanes", monitor: "Clinical assessment q3mo", icon: Activity },
            { effect: "Osteoporosis", agents: "Aromatase Inhibitors", monitor: "DEXA scan annually", icon: Bone },
          ].map((e, i) => (
            <div key={i} className="p-4 rounded-lg border space-y-2">
              <div className="flex items-center gap-2">
                <e.icon className="h-4 w-4" />
                <h4 className="font-semibold text-sm">{e.effect}</h4>
              </div>
              <p className="text-xs text-muted-foreground">Agents: {e.agents}</p>
              <p className="text-xs text-muted-foreground">Monitor: {e.monitor}</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

/* ── Screen: Palliative Care ──────────────────────────────────────────────── */
function PalliativeScreen() {
  return (
    <div className="space-y-4">
      <PageHeader title="Palliative Care" subtitle="Symptom management, end-of-life care, advance directives" icon={Shield}
        actions={<Button size="sm"><Plus className="mr-1.5 size-4" />New Assessment</Button>} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Active Patients" value={PALLIATIVE_RECORDS.length} icon={Shield} />
        <StatCard label="Pain > 5/10" value={PALLIATIVE_RECORDS.filter(p => p.painScore > 5).length} icon={AlertTriangle} />
        <StatCard label="Advance Directives" value={PALLIATIVE_RECORDS.filter(p => p.advanceDirective).length} icon={FileText} />
        <StatCard label="Family Meetings" value={PALLIATIVE_RECORDS.length} icon={Users} />
      </div>

      <SectionCard title="Palliative Patients">
        <div className="space-y-3">
          {PALLIATIVE_RECORDS.map(p => (
            <PalliativeCard key={p.id} p={p} />
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Pain Management Protocol">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { step: "1", title: "Assess", desc: "NRS pain score, location, character, aggravating/alleviating factors" },
            { step: "2", title: "Plan", desc: "WHO analgesic ladder: Non-opioid → Weak opioid → Strong opioid" },
            { step: "3", title: "Reassess", desc: "Response to treatment, side effects, dose titration" },
          ].map(s => (
            <div key={s.step} className="p-3 rounded-lg border space-y-2">
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">{s.step}</div>
              <h4 className="font-semibold text-sm">{s.title}</h4>
              <p className="text-xs text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

/* ── Screen: Follow-up ────────────────────────────────────────────────────── */
function FollowUpScreen() {
  return (
    <div className="space-y-4">
      <PageHeader title="Follow-up Scheduling" subtitle="Surveillance and treatment follow-up appointments" icon={CalendarClock}
        actions={<Button size="sm"><CalendarClock className="mr-1.5 size-4" />Schedule Follow-up</Button>} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="This Week" value={5} icon={Calendar} />
        <StatCard label="Overdue" value={1} icon={AlertTriangle} />
        <StatCard label="Completed" value={12} icon={CheckCircle} />
        <StatCard label="Rescheduled" value={2} icon={RefreshCw} />
      </div>

      <SectionCard title="Upcoming Follow-ups">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Cancer</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {CANCER_PATIENTS.slice(0, 5).map(p => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell>{p.cancerType}</TableCell>
                <TableCell>Treatment cycle review</TableCell>
                <TableCell>{p.nextVisit}</TableCell>
                <TableCell>In-person</TableCell>
                <TableCell><StatusBadge tone="warning">Scheduled</StatusBadge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>
    </div>
  );
}

/* ── Screen: Reports & Analytics ──────────────────────────────────────────── */
function ReportsScreen() {
  return (
    <div className="space-y-4">
      <PageHeader title="Reports & Analytics" subtitle="Clinical outcomes, quality metrics, operational reports" icon={BarChart3}
        actions={<Button size="sm"><Download className="mr-1.5 size-4" />Export Report</Button>} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Incidence (2026)" value={89} icon={TrendingUp} />
        <StatCard label="Mortality (2026)" value={8} icon={TrendingDown} />
        <StatCard label="5-Year Survival" value={`${ONCOLOGY_KPI.survivalRate5Year}%`} icon={Heart} />
        <StatCard label="Clinical Trials" value={ONCOLOGY_KPI.clinicalTrialCount} icon={Beaker} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="Cancer Type Distribution">
          <div className="space-y-2">
            {[
              { type: "Breast", count: 18, pct: 20 },
              { type: "Lung", count: 15, pct: 17 },
              { type: "Colorectal", count: 12, pct: 13 },
              { type: "Head & Neck", count: 10, pct: 11 },
              { type: "Gynecological", count: 9, pct: 10 },
              { type: "Prostate", count: 8, pct: 9 },
              { type: "Hepatobiliary", count: 7, pct: 8 },
              { type: "Hematological", count: 6, pct: 7 },
              { type: "Others", count: 4, pct: 5 },
            ].map((c, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-sm w-24">{c.type}</span>
                <div className="flex-1 bg-muted rounded-full h-4">
                  <div className="bg-primary h-4 rounded-full" style={{ width: `${c.pct}%` }} />
                </div>
                <span className="text-sm text-muted-foreground w-16 text-right">{c.count} ({c.pct}%)</span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Stage at Diagnosis">
          <div className="space-y-2">
            {[
              { stage: "Stage I", count: 12, pct: 13 },
              { stage: "Stage II", count: 25, pct: 28 },
              { stage: "Stage III", count: 32, pct: 36 },
              { stage: "Stage IV", count: 20, pct: 23 },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-sm w-20">{s.stage}</span>
                <div className="flex-1 bg-muted rounded-full h-4">
                  <div className="bg-primary h-4 rounded-full" style={{ width: `${s.pct}%` }} />
                </div>
                <span className="text-sm text-muted-foreground w-16 text-right">{s.count} ({s.pct}%)</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Treatment Outcomes">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Protocol</TableHead>
              <TableHead>Cases</TableHead>
              <TableHead>CR Rate</TableHead>
              <TableHead>PR Rate</TableHead>
              <TableHead>ORR</TableHead>
              <TableHead>Median PFS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">AC → T (Breast)</TableCell>
              <TableCell>12</TableCell>
              <TableCell>25%</TableCell>
              <TableCell>50%</TableCell>
              <TableCell>75%</TableCell>
              <TableCell>24 months</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">FOLFOX (CRC)</TableCell>
              <TableCell>8</TableCell>
              <TableCell>12%</TableCell>
              <TableCell>62%</TableCell>
              <TableCell>74%</TableCell>
              <TableCell>18 months</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Concurrent ChemoRT (Lung)</TableCell>
              <TableCell>6</TableCell>
              <TableCell>17%</TableCell>
              <TableCell>50%</TableCell>
              <TableCell>67%</TableCell>
              <TableCell>16 months</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </SectionCard>
    </div>
  );
}

/* ── Screen: Quality & Compliance ─────────────────────────────────────────── */
function QualityComplianceScreen() {
  return (
    <div className="space-y-4">
      <PageHeader title="Quality & Compliance" subtitle="Accreditation standards, protocol adherence, safety" icon={ShieldCheck} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="NABH Compliance" value="94%" icon={ShieldCheck} />
        <StatCard label="Protocol Adherence" value="91%" icon={ClipboardCheck} />
        <StatCard label="Incidents (MTD)" value={2} icon={AlertTriangle} />
        <StatCard label="Audit Score" value="4.6/5" icon={Star} />
      </div>

      <SectionCard title="Audit Trail">
        <div className="space-y-1">
          {AUDIT_LOGS.map(log => (
            <AuditLogRow key={log.id} log={log} />
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Compliance Checklist">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { item: "Chemotherapy Consent", compliance: 98, status: "Pass" },
            { item: "Medication Reconciliation", compliance: 95, status: "Pass" },
            { item: "Radiation Safety Protocols", compliance: 100, status: "Pass" },
            { item: "Informed Consent (Biopsy)", compliance: 97, status: "Pass" },
            { item: "Specimen Labeling", compliance: 92, status: "Warning" },
            { item: "Tumor Board Documentation", compliance: 88, status: "Warning" },
          ].map((c, i) => (
            <div key={i} className="flex items-center justify-between p-3 border rounded">
              <div>
                <p className="text-sm font-medium">{c.item}</p>
                <p className="text-xs text-muted-foreground">Target: ≥95%</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{c.compliance}%</span>
                <StatusBadge tone={c.status === "Pass" ? "success" : "warning"}>{c.status}</StatusBadge>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

/* ── Screen: Workflow Complete ────────────────────────────────────────────── */
function WorkflowCompleteScreen() {
  return (
    <div className="space-y-4">
      <PageHeader title="Complete Workflow" subtitle="End-to-end cancer patient journey" icon={CheckCircle} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SectionCard title="Patient Journey — Priya Sharma" className="lg:col-span-2">
          <div className="space-y-3">
            {[
              { step: "1", title: "Screening & Detection", desc: "Mammography — BI-RADS 4", date: "2026-02-10", status: "completed" },
              { step: "2", title: "Biopsy & Diagnosis", desc: "Core needle biopsy — IDC confirmed", date: "2026-02-20", status: "completed" },
              { step: "3", title: "Staging Workup", desc: "PET-CT, MRI, Molecular profiling", date: "2026-03-01", status: "completed" },
              { step: "4", title: "MDT Discussion", desc: "Tumor board — Curative intent", date: "2026-03-10", status: "completed" },
              { step: "5", title: "Treatment Planning", desc: "AC → T protocol, 8 cycles", date: "2026-03-15", status: "completed" },
              { step: "6", title: "Chemotherapy", desc: "Cycle 3/8 — In progress", date: "2026-06-01", status: "active" },
              { step: "7", title: "Response Assessment", desc: "PR — 35% reduction", date: "2026-07-15", status: "completed" },
              { step: "8", title: "Surgery (Planned)", desc: "Bilateral mastectomy — Pending", date: "TBD", status: "pending" },
              { step: "9", title: "Adjuvant RT (if needed)", desc: "After surgery — Pending", date: "TBD", status: "pending" },
              { step: "10", title: "Survivorship", desc: "Surveillance program", date: "TBD", status: "pending" },
            ].map(s => (
              <div key={s.step} className={`flex items-start gap-3 p-3 rounded-lg border ${s.status === "active" ? "bg-primary/5 border-primary/20" : ""}`}>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${s.status === "completed" ? "bg-green-500 text-white" : s.status === "active" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  {s.status === "completed" ? <CheckCircle className="h-4 w-4" /> : s.step}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">{s.title}</p>
                    {s.status === "active" && <Badge variant="outline" className="animate-pulse">Active</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground">{s.desc}</p>
                  <p className="text-xs text-muted-foreground mt-1">{s.date}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <div className="space-y-4">
          <SectionCard title="Workflow Summary">
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                <p className="text-sm font-medium text-green-700">6/10 Steps Completed</p>
                <Progress value={60} className="mt-2" />
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Days since diagnosis</span><span className="font-medium">131 days</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Treatment duration</span><span className="font-medium">84 days</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Current response</span><Badge variant="outline" className="text-green-600">PR — 35%</Badge></div>
                <div className="flex justify-between"><span className="text-muted-foreground">ECOG Performance</span><span className="font-medium">1 (Good)</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Treatment intent</span><Badge variant="outline">Curative</Badge></div>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Next Actions">
            <div className="space-y-2">
              {[
                { action: "Cycle 4 — AC Chemotherapy", date: "2026-07-27", priority: "High" },
                { action: "Pre-chemo labs (CBC, CMP)", date: "2026-07-25", priority: "High" },
                { action: "Response Assessment — Cycle 4", date: "2026-08-20", priority: "Medium" },
                { action: "Cardiology referral — ECHO", date: "2026-08-01", priority: "Medium" },
              ].map((a, i) => (
                <div key={i} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <p className="text-sm font-medium">{a.action}</p>
                    <p className="text-xs text-muted-foreground">{a.date}</p>
                  </div>
                  <Badge variant={a.priority === "High" ? "destructive" : "outline"}>{a.priority}</Badge>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
