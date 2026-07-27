import { useState, useEffect, useMemo } from "react";
import { useApi } from "../../hooks/useApi";
import { cdssApi } from "../../services/cdss";
import {
  LayoutDashboard, AlertTriangle, Shield, Activity, Clock, CheckCircle,
  TrendingUp, TrendingDown, Eye, FileText, Zap, Target, BookOpen,
  Beaker, Pill, Heart, Settings, BarChart3, ClipboardCheck, Users,
  Bell, Search, Plus, RefreshCw, Download, ArrowRight, ArrowUp,
  ArrowDown, Minus, XCircle, Calendar, Stethoscope, TestTube2,
  ShieldCheck, Brain, Layers, GitBranch, AlertCircle,
} from "lucide-react";
import { Shell, type Workspace } from "../his/Shell";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Progress } from "../ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { StatusBadge, StatCard, SectionCard, PageHeader } from "../his/ui";
import {
  AlertCard, RiskScoreCard, MedSafetyCard, GuidelineCard,
  OverrideCard, AuditLogRow,
} from "./cdssUi";
import {
  CLINICAL_ALERTS, RISK_SCORES, MED_SAFETY_ALERTS,
  DIAGNOSTIC_RECS, CLINICAL_GUIDELINES, ORDER_SETS,
  PREVENTIVE_CARE, CARE_GAPS, CLINICAL_PATHWAYS,
  EARLY_WARNING_SCORES, OVERRIDE_RECORDS, OUTCOME_RECORDS,
  AUDIT_LOGS, CDSS_KPI, alertSeverityTone, riskLevelTone,
} from "./data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

type CdssRoute =
  | "cdss-dashboard" | "cdss-alerts" | "cdss-riskStrat" | "cdss-medSafety"
  | "cdss-diagnostic" | "cdss-guidelines" | "cdss-orderSets" | "cdss-preventive"
  | "cdss-careGaps" | "cdss-pathways" | "cdss-ews" | "cdss-overrides"
  | "cdss-outcomes" | "cdss-reports" | "cdss-knowledge" | "cdss-config"
  | "cdss-audit" | "cdss-workflowComplete";

const NAV = [
  { id: "cdss-dashboard", label: "CDSS Dashboard", icon: LayoutDashboard },
  { id: "cdss-alerts", label: "Clinical Alerts", icon: AlertTriangle, badge: "8", tone: "danger" as const },
  { id: "cdss-riskStrat", label: "Risk Stratification", icon: Target },
  { id: "cdss-medSafety", label: "Medication Safety", icon: Pill, badge: "4", tone: "warning" as const },
  { id: "cdss-diagnostic", label: "Diagnostic Support", icon: Brain },
  { id: "cdss-guidelines", label: "Clinical Guidelines", icon: BookOpen },
  { id: "cdss-orderSets", label: "Order Sets", icon: Layers },
  { id: "cdss-preventive", label: "Preventive Care", icon: Shield },
  { id: "cdss-careGaps", label: "Care Gap Detection", icon: AlertCircle },
];

const NAV_SECONDARY = [
  { id: "cdss-pathways", label: "Clinical Pathways", icon: GitBranch },
  { id: "cdss-ews", label: "Early Warning Scores", icon: Activity, badge: "2", tone: "danger" as const },
  { id: "cdss-overrides", label: "Override Management", icon: XCircle },
  { id: "cdss-outcomes", label: "Outcome Tracking", icon: TrendingUp },
  { id: "cdss-reports", label: "Reports & Analytics", icon: BarChart3 },
  { id: "cdss-knowledge", label: "Knowledge Base", icon: BookOpen },
  { id: "cdss-config", label: "Configuration", icon: Settings },
  { id: "cdss-audit", label: "Audit & Compliance", icon: ClipboardCheck },
  { id: "cdss-workflowComplete", label: "Workflow Complete", icon: CheckCircle },
];

export function CdssApp({ roleName, onSignOut, onSwitchWorkspace, onOpenSettings }: {
  roleName: string; onSignOut: () => void; onSwitchWorkspace: (w: Workspace) => void; onOpenSettings?: (page: string) => void;
}) {
  const [screen, setScreen] = useState<CdssRoute>("cdss-dashboard");

  const breadcrumb = useMemo(() => {
    const crumb = ["CDSS"];
    const nav = [...NAV, ...NAV_SECONDARY].find((n) => n.id === screen);
    if (nav) crumb.push(nav.label);
    return crumb;
  }, [screen]);

  return (
    <Shell
      nav={NAV}
      navSecondary={NAV_SECONDARY}
      sectionLabel="Clinical Decision Support"
      activeId={screen}
      isActive={(id) => id === screen}
      onNavigate={(id) => setScreen(id as CdssRoute)}
      breadcrumb={breadcrumb}
      roleName={roleName}
      onSignOut={onSignOut}
      workspace="cdss"
      onSwitchWorkspace={onSwitchWorkspace}
      onOpenSettings={onOpenSettings}
      searchPlaceholder="Search patients, alerts, guidelines…"
    >
      {screen === "cdss-dashboard" && <DashboardScreen />}
      {screen === "cdss-alerts" && <AlertsScreen />}
      {screen === "cdss-riskStrat" && <RiskStratScreen />}
      {screen === "cdss-medSafety" && <MedSafetyScreen />}
      {screen === "cdss-diagnostic" && <DiagnosticScreen />}
      {screen === "cdss-guidelines" && <GuidelinesScreen />}
      {screen === "cdss-orderSets" && <OrderSetsScreen />}
      {screen === "cdss-preventive" && <PreventiveScreen />}
      {screen === "cdss-careGaps" && <CareGapsScreen />}
      {screen === "cdss-pathways" && <PathwaysScreen />}
      {screen === "cdss-ews" && <EarlyWarningScreen />}
      {screen === "cdss-overrides" && <OverridesScreen />}
      {screen === "cdss-outcomes" && <OutcomesScreen />}
      {screen === "cdss-reports" && <ReportsScreen />}
      {screen === "cdss-knowledge" && <KnowledgeScreen />}
      {screen === "cdss-config" && <ConfigScreen />}
      {screen === "cdss-audit" && <AuditScreen />}
      {screen === "cdss-workflowComplete" && <WorkflowCompleteScreen />}
    </Shell>
  );
}

/* ── Screen: Dashboard ────────────────────────────────────────────────────── */
function DashboardScreen() {
  const { data: stats = CDSS_KPI, loading: statsLoading } = useApi(
    () => cdssApi.stats(),
    CDSS_KPI,
    []
  );
  const { data: criticalAlerts = CLINICAL_ALERTS.filter(a => a.severity === "Critical" || a.severity === "High"), loading: alertsLoading } = useApi(
    () => cdssApi.listAlerts({ status: "active", severity: "critical", limit: 10 }),
    CLINICAL_ALERTS.filter(a => a.severity === "Critical" || a.severity === "High"),
    []
  );
  return (
    <div className="space-y-4">
      <PageHeader title="CDSS Dashboard" subtitle="Real-time clinical decision support overview" icon={LayoutDashboard}
        actions={<><Button variant="outline" size="sm" onClick={() => {}}><RefreshCw className="mr-1.5 size-4" />Refresh</Button><Button variant="outline" size="sm"><Download className="mr-1.5 size-4" />Export</Button></>} />
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <StatCard label="Active Alerts" value={stats.activeAlerts ?? CDSS_KPI.activeAlerts} icon={AlertTriangle} />
        <StatCard label="Critical Alerts" value={stats.criticalAlerts ?? CDSS_KPI.criticalAlerts} icon={XCircle} />
        <StatCard label="High Risk Patients" value={stats.highRiskPatients ?? CDSS_KPI.highRiskPatients} icon={Target} />
        <StatCard label="Acceptance Rate" value={stats.acceptanceRate ? `${stats.acceptanceRate}%` : `${CDSS_KPI.acceptanceRate}%`} icon={CheckCircle} />
        <StatCard label="Override Rate" value={stats.overrideRate ? `${stats.overrideRate}%` : `${CDSS_KPI.overrideRate}%`} icon={XCircle} />
        <StatCard label="Guideline Compliance" value={stats.guidelineCompliance ? `${stats.guidelineCompliance}%` : `${CDSS_KPI.guidelineCompliance}%`} icon={ShieldCheck} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SectionCard title="Critical & High Alerts" className="lg:col-span-2">
          <div className="space-y-3">
            {(criticalAlerts as any[]).map(a => (
              <AlertCard key={a.id} a={a} />
            ))}
          </div>
        </SectionCard>
        <div className="space-y-4">
          <SectionCard title="Risk Overview">
            <div className="space-y-2">
              {RISK_SCORES.map(r => (
                <div key={r.patientId} className="flex items-center justify-between p-2 border rounded text-sm">
                  <span className="font-medium truncate">{r.patientName}</span>
                  <StatusBadge tone={riskLevelTone(r.overallRisk)}>{r.overallRisk}</StatusBadge>
                </div>
              ))}
            </div>
          </SectionCard>
          <SectionCard title="Recent Activity">
            <div className="space-y-1">
              {AUDIT_LOGS.slice(0, 4).map(a => (
                <AuditLogRow key={a.id} e={a} />
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

/* ── Screen: Clinical Alerts ──────────────────────────────────────────────── */
function AlertsScreen() {
  const [severityFilter, setSeverityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const { data: alertData, loading: alertsLoading } = useApi(
    () => cdssApi.listAlerts({
      status: statusFilter === "all" ? undefined : statusFilter,
      severity: severityFilter === "all" ? undefined : severityFilter,
      limit: 50,
    }),
    CLINICAL_ALERTS,
    [severityFilter, statusFilter]
  );
  const alerts = (alertData ?? CLINICAL_ALERTS) as typeof CLINICAL_ALERTS;
  return (
    <div className="space-y-4">
      <PageHeader title="Clinical Alerts" subtitle="Real-time clinical alerts and recommendations" icon={AlertTriangle}
        actions={<Button variant="outline" size="sm"><Download className="mr-1.5 size-4" />Export</Button>} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total Active" value={alerts.filter(a => a.status === "Active").length} icon={AlertTriangle} />
        <StatCard label="Critical" value={alerts.filter(a => a.severity === "Critical").length} icon={XCircle} />
        <StatCard label="Pending Review" value={alerts.filter(a => a.status === "Pending").length} icon={Clock} />
        <StatCard label="Escalated" value={alerts.filter(a => a.status === "Escalated").length} icon={ArrowUp} />
      </div>
      <div className="flex gap-2 flex-wrap">
        <Input placeholder="Search alerts…" className="max-w-xs" />
        <Select defaultValue="all" onValueChange={setSeverityFilter}>
          <SelectTrigger className="w-32"><SelectValue placeholder="Severity" /></SelectTrigger>
          <SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="critical">Critical</SelectItem><SelectItem value="high">High</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="low">Low</SelectItem></SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-32"><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent><SelectItem value="all">All Types</SelectItem><SelectItem value="medication">Medication</SelectItem><SelectItem value="sepsis">Sepsis</SelectItem><SelectItem value="aki">AKI</SelectItem><SelectItem value="vte">VTE</SelectItem></SelectContent>
        </Select>
        <Select defaultValue="all" onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="acknowledged">Acknowledged</SelectItem><SelectItem value="escalated">Escalated</SelectItem></SelectContent>
        </Select>
      </div>
      <SectionCard title="All Alerts">
        <div className="space-y-3">
          {alerts.map(a => (
            <AlertCard key={a.id} a={a} onAction={() => {}} />
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

/* ── Screen: Risk Stratification ──────────────────────────────────────────── */
function RiskStratScreen() {
  return (
    <div className="space-y-4">
      <PageHeader title="Risk Stratification" subtitle="Sepsis, AKI, VTE, Falls, Pressure, Readmission, Mortality scores" icon={Target} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Very High Risk" value={RISK_SCORES.filter(r => r.overallRisk === "Very High").length} icon={AlertTriangle} />
        <StatCard label="High Risk" value={RISK_SCORES.filter(r => r.overallRisk === "High").length} icon={Target} />
        <StatCard label="Moderate Risk" value={RISK_SCORES.filter(r => r.overallRisk === "Moderate").length} icon={Activity} />
        <StatCard label="Low Risk" value={RISK_SCORES.filter(r => r.overallRisk === "Low").length} icon={CheckCircle} />
      </div>
      <SectionCard title="Patient Risk Scores">
        <div className="space-y-4">
          {RISK_SCORES.map(r => (
            <div key={r.patientId} className="p-4 rounded-lg border space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{r.patientName}</p>
                  <p className="text-xs text-muted-foreground">Overall: <StatusBadge tone={riskLevelTone(r.overallRisk)}>{r.overallRisk}</StatusBadge></p>
                </div>
              </div>
              <div className="grid grid-cols-3 md:grid-cols-7 gap-2">
                <RiskScoreCard label="Sepsis" score={r.sepsis.score} level={r.sepsis.level} trend={r.sepsis.trend} />
                <RiskScoreCard label="AKI" score={r.aki.score} level={r.aki.level} trend={r.aki.trend} />
                <RiskScoreCard label="VTE" score={r.vte.score} level={r.vte.level} trend={r.vte.trend} />
                <RiskScoreCard label="Fall" score={r.fall.score} level={r.fall.level} trend={r.fall.trend} />
                <RiskScoreCard label="Pressure" score={r.pressure.score} level={r.pressure.level} trend={r.pressure.trend} />
                <RiskScoreCard label="Readmit" score={r.readmission.score} level={r.readmission.level} trend={r.readmission.trend} />
                <RiskScoreCard label="Mortality" score={r.mortality.score} level={r.mortality.level} trend={r.mortality.trend} />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

/* ── Screen: Medication Safety ────────────────────────────────────────────── */
function MedSafetyScreen() {
  return (
    <div className="space-y-4">
      <PageHeader title="Medication Safety" subtitle="Drug interactions, allergies, contraindications, dose adjustments" icon={Pill}
        actions={<Button size="sm"><Pill className="mr-1.5 size-4" />Run Safety Check</Button>} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Drug Interactions" value={MED_SAFETY_ALERTS.filter(m => m.alertType === "Drug Interaction").length} icon={AlertTriangle} />
        <StatCard label="Allergy Alerts" value={MED_SAFETY_ALERTS.filter(m => m.alertType === "Allergy").length} icon={Shield} />
        <StatCard label="Renal Adjustments" value={MED_SAFETY_ALERTS.filter(m => m.alertType === "Renal Dose").length} icon={Beaker} />
        <StatCard label="Duplicate Therapy" value={MED_SAFETY_ALERTS.filter(m => m.alertType === "Duplicate Therapy").length} icon={Layers} />
      </div>
      <SectionCard title="Medication Safety Alerts">
        <div className="space-y-3">
          {MED_SAFETY_ALERTS.map(m => (
            <MedSafetyCard key={m.id} m={m} />
          ))}
        </div>
      </SectionCard>
      <SectionCard title="Drug Interaction Checker">
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input placeholder="Drug 1" className="flex-1" />
            <Input placeholder="Drug 2" className="flex-1" />
            <Button>Check Interaction</Button>
          </div>
          <div className="p-4 rounded-lg border text-center text-muted-foreground">
            <Pill className="h-8 w-8 mx-auto mb-2" />
            <p className="text-sm">Enter two drugs to check for interactions</p>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

/* ── Screen: Diagnostic Decision Support ──────────────────────────────────── */
function DiagnosticScreen() {
  const rec = DIAGNOSTIC_RECS[0];
  return (
    <div className="space-y-4">
      <PageHeader title="Diagnostic Decision Support" subtitle="Differential diagnosis, evidence, suggested tests" icon={Brain}
        actions={<Button size="sm"><Brain className="mr-1.5 size-4" />AI Analysis</Button>} />
      <SectionCard title={`Presenting Symptoms — ${rec.patientName}`}>
        <div className="flex flex-wrap gap-2">
          {rec.presentingSymptoms.map((s, i) => (
            <Badge key={i} variant="outline">{s}</Badge>
          ))}
        </div>
      </SectionCard>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="Differential Diagnoses (Ranked)">
          <div className="space-y-3">
            {rec.differentialDiagnoses.map((d, i) => (
              <div key={i} className="p-4 rounded-lg border space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm">{i + 1}. {d.diagnosis}</p>
                    <p className="text-xs text-muted-foreground">ICD-10: {d.icd10}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{d.probability}%</p>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className={`h-2 rounded-full ${d.probability >= 70 ? "bg-red-500" : d.probability >= 40 ? "bg-yellow-500" : "bg-blue-500"}`} style={{ width: `${d.probability}%` }} />
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="space-y-1">
                    <p className="text-green-600 font-medium">Supporting:</p>
                    {d.supportingFindings.map((f, j) => <p key={j} className="text-muted-foreground">+ {f}</p>)}
                  </div>
                  <div className="space-y-1">
                    <p className="text-red-600 font-medium">Opposing:</p>
                    {d.opposingFindings.map((f, j) => <p key={j} className="text-muted-foreground">- {f}</p>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
        <div className="space-y-4">
          <SectionCard title="Suggested Tests">
            <div className="space-y-2">
              {rec.suggestedTests.map((t, i) => (
                <div key={i} className="flex items-center gap-3 p-3 border rounded">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{t.test}</p>
                    <p className="text-xs text-muted-foreground">{t.rationale}</p>
                  </div>
                  <StatusBadge tone={t.priority === "STAT" ? "danger" : t.priority === "Urgent" ? "warning" : "info"}>{t.priority}</StatusBadge>
                </div>
              ))}
            </div>
          </SectionCard>
          <SectionCard title="Clinical Confidence">
            <div className="space-y-2 text-center">
              <p className="text-4xl font-bold">{rec.clinicalConfidence}%</p>
              <p className="text-sm text-muted-foreground">Overall Diagnostic Confidence</p>
              <Progress value={rec.clinicalConfidence} className="h-3" />
              <p className="text-xs text-muted-foreground">Source: {rec.evidenceSource}</p>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

/* ── Screen: Clinical Guidelines ──────────────────────────────────────────── */
function GuidelinesScreen() {
  return (
    <div className="space-y-4">
      <PageHeader title="Clinical Guidelines" subtitle="Evidence-based guidelines, protocols, literature" icon={BookOpen}
        actions={<Button size="sm"><Plus className="mr-1.5 size-4" />Add Guideline</Button>} />
      <div className="flex gap-2">
        <Input placeholder="Search guidelines…" className="max-w-xs" />
        <Select defaultValue="all"><SelectTrigger className="w-40"><SelectValue placeholder="Specialty" /></SelectTrigger>
          <SelectContent><SelectItem value="all">All Specialties</SelectItem><SelectItem value="critical">Critical Care</SelectItem><SelectItem value="nephro">Nephrology</SelectItem><SelectItem value="heme">Hematology</SelectItem></SelectContent>
        </Select>
      </div>
      <SectionCard title="Guideline Library">
        <div className="space-y-3">
          {CLINICAL_GUIDELINES.map(g => (
            <GuidelineCard key={g.id} g={g} />
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

/* ── Screen: Order Sets ───────────────────────────────────────────────────── */
function OrderSetsScreen() {
  return (
    <div className="space-y-4">
      <PageHeader title="Order Set Recommendations" subtitle="Evidence-based order sets for common conditions" icon={Layers}
        actions={<Button size="sm"><Plus className="mr-1.5 size-4" />Create Order Set</Button>} />
      <SectionCard title="Available Order Sets">
        <div className="space-y-4">
          {ORDER_SETS.map(o => (
            <div key={o.id} className="p-4 rounded-lg border space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-semibold">{o.name}</p>
                  <p className="text-xs text-muted-foreground">{o.condition} — {o.category}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="outline">{o.orders.length} orders</Badge>
                </div>
              </div>
              <div className="p-3 rounded bg-muted">
                <p className="text-xs font-semibold mb-1">Clinical Justification:</p>
                <p className="text-xs text-muted-foreground">{o.clinicalJustification}</p>
              </div>
              <div className="space-y-1">
                {o.orders.map((ord, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 border rounded text-xs">
                    <span className="font-medium min-w-[180px]">{ord.name}</span>
                    <Badge variant="outline">{ord.type}</Badge>
                    <span className="text-muted-foreground flex-1">{ord.details}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Compliance: {o.complianceRate}% | Used: {o.usageCount} times</span>
                <Button size="sm"><Layers className="mr-1 h-3 w-3" />Apply Order Set</Button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

/* ── Screen: Preventive Care ──────────────────────────────────────────────── */
function PreventiveScreen() {
  return (
    <div className="space-y-4">
      <PageHeader title="Preventive Care" subtitle="Vaccinations, screenings, lifestyle counseling" icon={Shield}
        actions={<Button size="sm"><Plus className="mr-1.5 size-4" />Add Recommendation</Button>} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Vaccinations Due" value={3} icon={Shield} />
        <StatCard label="Screenings Overdue" value={1} icon={AlertTriangle} />
        <StatCard label="Recommendations" value={8} icon={FileText} />
        <StatCard label="Care Plans Active" value={5} icon={Calendar} />
      </div>
      {PREVENTIVE_CARE.map(pc => (
        <SectionCard key={pc.id} title={`Preventive Care — ${pc.patientName}`}>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-sm mb-2">Recommendations</h4>
              <div className="space-y-2">
                {pc.recommendations.map((r, i) => (
                  <div key={i} className="flex items-center justify-between p-2 border rounded text-sm">
                    <div className="flex items-center gap-2">
                      {r.status === "Completed" ? <CheckCircle className="h-4 w-4 text-green-600" /> : r.status === "Overdue" ? <AlertTriangle className="h-4 w-4 text-red-600" /> : <Clock className="h-4 w-4 text-muted-foreground" />}
                      <span>{r.item}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{r.dueDate}</span>
                      <StatusBadge tone={r.status === "Completed" ? "success" : r.status === "Overdue" ? "danger" : "warning"}>{r.status}</StatusBadge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-2">Vaccinations</h4>
              <div className="space-y-2">
                {pc.vaccinations.map((v, i) => (
                  <div key={i} className="flex items-center justify-between p-2 border rounded text-sm">
                    <span>{v.vaccine}</span>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Last: {v.lastDate}</span>
                      <span>Next: {v.nextDue}</span>
                      <StatusBadge tone={v.status === "Current" ? "success" : "warning"}>{v.status}</StatusBadge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SectionCard>
      ))}
    </div>
  );
}

/* ── Screen: Care Gap Detection ───────────────────────────────────────────── */
function CareGapsScreen() {
  return (
    <div className="space-y-4">
      <PageHeader title="Care Gap Detection" subtitle="Missing tests, incomplete documentation, overdue screenings" icon={AlertCircle}
        actions={<Button size="sm"><RefreshCw className="mr-1.5 size-4" />Scan for Gaps</Button>} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total Gaps" value={CARE_GAPS.length} icon={AlertCircle} />
        <StatCard label="High Priority" value={CARE_GAPS.filter(g => g.priority === "High").length} icon={AlertTriangle} />
        <StatCard label="Medium Priority" value={CARE_GAPS.filter(g => g.priority === "Medium").length} icon={Clock} />
        <StatCard label="Closed This Week" value={CDSS_KPI.careGapsClosed} icon={CheckCircle} />
      </div>
      <SectionCard title="Detected Care Gaps">
        <div className="space-y-2">
          {CARE_GAPS.map(g => (
            <div key={g.id} className={`p-4 rounded-lg border-l-4 ${g.priority === "High" ? "border-l-red-500 bg-red-50" : "border-l-yellow-500 bg-yellow-50"}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <StatusBadge tone={g.priority === "High" ? "danger" : "warning"}>{g.priority}</StatusBadge>
                    <Badge variant="outline">{g.gapType}</Badge>
                  </div>
                  <p className="font-semibold text-sm mt-1">{g.description}</p>
                  <p className="text-xs text-muted-foreground">{g.patientName} — Due: {g.dueDate}</p>
                  <p className="text-xs text-muted-foreground mt-1">Linked: {g.linkedRecommendation}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button size="sm">Resolve</Button>
                  <Button size="sm" variant="outline">Dismiss</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

/* ── Screen: Clinical Pathways ────────────────────────────────────────────── */
function PathwaysScreen() {
  return (
    <div className="space-y-4">
      <PageHeader title="Clinical Pathways" subtitle="Care pathways, stage tracking, deviation alerts" icon={GitBranch} />
      <SectionCard title="Active Clinical Pathways">
        <div className="space-y-4">
          {CLINICAL_PATHWAYS.map(p => (
            <div key={p.id} className="p-4 rounded-lg border space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold">{p.condition}</p>
                  <p className="text-xs text-muted-foreground">Stage: <Badge variant="outline">{p.currentStage}</Badge></p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{p.patientCount} patients</p>
                  <p className="text-xs text-muted-foreground">Compliance: {p.complianceRate}%</p>
                </div>
              </div>
              <div className="p-3 rounded bg-primary/5 border border-primary/10">
                <p className="text-xs font-semibold text-primary mb-0.5">Recommended Next Step</p>
                <p className="text-xs">{p.recommendedNextStep}</p>
              </div>
              {p.deviations.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-destructive">Deviations:</p>
                  {p.deviations.map((d, i) => <p key={i} className="text-xs text-muted-foreground">• {d}</p>)}
                </div>
              )}
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

/* ── Screen: Early Warning Scores ─────────────────────────────────────────── */
function EarlyWarningScreen() {
  return (
    <div className="space-y-4">
      <PageHeader title="Early Warning Scores" subtitle="NEWS2, MEWS, SOFA, qSOFA — Real-time monitoring" icon={Activity} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="NEWS2 >= 7" value={EARLY_WARNING_SCORES.filter(e => e.news2.score >= 7).length} icon={AlertTriangle} />
        <StatCard label="qSOFA Positive" value={EARLY_WARNING_SCORES.filter(e => e.qsofa.score >= 2).length} icon={Shield} />
        <StatCard label="Rapid Response" value={EARLY_WARNING_SCORES.filter(e => e.rapidResponse).length} icon={Activity} />
        <StatCard label="ICU Transfers" value={1} icon={ArrowUp} />
      </div>
      <SectionCard title="Patient Early Warning Scores">
        <div className="space-y-4">
          {EARLY_WARNING_SCORES.map(e => (
            <div key={e.patientId} className="p-4 rounded-lg border space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{e.patientName}</p>
                  {e.rapidResponse && <Badge variant="destructive" className="animate-pulse ml-2">RAPID RESPONSE</Badge>}
                </div>
                <span className="text-xs text-muted-foreground">{e.escalation}</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {[
                  { label: "NEWS2", score: e.news2.score, level: e.news2.level, threshold: 7 },
                  { label: "MEWS", score: e.mews.score, level: e.mews.level, threshold: 5 },
                  { label: "SOFA", score: e.sofa.score, level: e.sofa.level, threshold: 6 },
                  { label: "qSOFA", score: e.qsofa.score, level: e.qsofa.level, threshold: 2 },
                  { label: "PEWS", score: e.pevs.score, level: e.pevs.level, threshold: 4 },
                ].map((s, i) => (
                  <div key={i} className="p-2 rounded bg-muted text-center">
                    <p className="text-[10px] text-muted-foreground">{s.label}</p>
                    <p className={`text-lg font-bold ${s.score >= s.threshold ? "text-red-600" : s.score >= s.threshold - 2 ? "text-yellow-600" : "text-green-600"}`}>{s.score}</p>
                    <p className="text-[10px] text-muted-foreground">{s.level}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

/* ── Screen: Override Management ──────────────────────────────────────────── */
function OverridesScreen() {
  return (
    <div className="space-y-4">
      <PageHeader title="Override Management" subtitle="Recommendation overrides, reasons, supervisor review" icon={XCircle} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total Overrides" value={OVERRIDE_RECORDS.length} icon={XCircle} />
        <StatCard label="Approved" value={OVERRIDE_RECORDS.filter(o => o.outcome === "Approved").length} icon={CheckCircle} />
        <StatCard label="Pending Review" value={OVERRIDE_RECORDS.filter(o => o.outcome === "Pending").length} icon={Clock} />
        <StatCard label="Override Rate" value={`${CDSS_KPI.overrideRate}%`} icon={TrendingDown} />
      </div>
      <SectionCard title="Override Records">
        <div className="space-y-3">
          {OVERRIDE_RECORDS.map(r => (
            <OverrideCard key={r.id} r={r} />
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

/* ── Screen: Outcome Tracking ─────────────────────────────────────────────── */
function OutcomesScreen() {
  return (
    <div className="space-y-4">
      <PageHeader title="Outcome Tracking" subtitle="Recommendation acceptance, clinical outcomes, quality" icon={TrendingUp} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Acceptance Rate" value={`${CDSS_KPI.acceptanceRate}%`} icon={CheckCircle} />
        <StatCard label="Total Recommendations" value={CDSS_KPI.totalRecommendations} icon={FileText} />
        <StatCard label="Clinical Impact" value="High" icon={TrendingUp} />
        <StatCard label="Quality Score" value="92%" icon={ShieldCheck} />
      </div>
      <SectionCard title="Outcome Records">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Accepted</TableHead>
              <TableHead>Overridden</TableHead>
              <TableHead>Acceptance Rate</TableHead>
              <TableHead>Clinical Outcome</TableHead>
              <TableHead>Impact</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {OUTCOME_RECORDS.map(o => (
              <TableRow key={o.id}>
                <TableCell className="font-medium">{o.recommendationType}</TableCell>
                <TableCell className="text-green-600 font-medium">{o.accepted}</TableCell>
                <TableCell className="text-red-600 font-medium">{o.overridden}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={(o.accepted / (o.accepted + o.overridden + o.notApplicable)) * 100} className="h-2 w-16" />
                    <span className="text-xs">{Math.round((o.accepted / (o.accepted + o.overridden + o.notApplicable)) * 100)}%</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm">{o.clinicalOutcome}</TableCell>
                <TableCell><StatusBadge tone={o.impact === "High" ? "success" : "info"}>{o.impact}</StatusBadge></TableCell>
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
      <PageHeader title="Reports & Analytics" subtitle="Alert volume, acceptance rates, guideline compliance" icon={BarChart3}
        actions={<><Button size="sm"><Download className="mr-1.5 size-4" />Export</Button></>} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Alerts Generated" value={50 + CDSS_KPI.activeAlerts} icon={AlertTriangle} />
        <StatCard label="Acceptance Rate" value={`${CDSS_KPI.acceptanceRate}%`} icon={CheckCircle} />
        <StatCard label="Override Rate" value={`${CDSS_KPI.overrideRate}%`} icon={XCircle} />
        <StatCard label="Guideline Compliance" value={`${CDSS_KPI.guidelineCompliance}%`} icon={ShieldCheck} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="Alert Volume by Type">
          <div className="space-y-2">
            {[
              { type: "Medication", count: 18, color: "bg-blue-500" },
              { type: "Sepsis", count: 12, color: "bg-red-500" },
              { type: "AKI", count: 8, color: "bg-orange-500" },
              { type: "VTE", count: 10, color: "bg-purple-500" },
              { type: "Fall Risk", count: 6, color: "bg-yellow-500" },
              { type: "Preventive", count: 14, color: "bg-green-500" },
            ].map((a, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-sm w-24">{a.type}</span>
                <div className="flex-1 bg-muted rounded-full h-4">
                  <div className={`${a.color} h-4 rounded-full`} style={{ width: `${(a.count / 18) * 100}%` }} />
                </div>
                <span className="text-sm text-muted-foreground w-8 text-right">{a.count}</span>
              </div>
            ))}
          </div>
        </SectionCard>
        <SectionCard title="Risk Distribution">
          <div className="space-y-2">
            {[
              { level: "Very High", count: 1, color: "bg-red-600" },
              { level: "High", count: 2, color: "bg-red-500" },
              { level: "Moderate", count: 4, color: "bg-yellow-500" },
              { level: "Low", count: 8, color: "bg-green-500" },
              { level: "Very Low", count: 12, color: "bg-green-600" },
            ].map((r, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-sm w-20">{r.level}</span>
                <div className="flex-1 bg-muted rounded-full h-4">
                  <div className={`${r.color} h-4 rounded-full`} style={{ width: `${(r.count / 12) * 100}%` }} />
                </div>
                <span className="text-sm text-muted-foreground w-8 text-right">{r.count}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

/* ── Screen: Knowledge Base ───────────────────────────────────────────────── */
function KnowledgeScreen() {
  return (
    <div className="space-y-4">
      <PageHeader title="Knowledge Base" subtitle="Clinical references, protocols, decision trees" icon={BookOpen}
        actions={<Button size="sm"><Plus className="mr-1.5 size-4" />Add Reference</Button>} />
      <Tabs defaultValue="guidelines">
        <TabsList>
          <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
          <TabsTrigger value="protocols">Protocols</TabsTrigger>
          <TabsTrigger value="decisionTrees">Decision Trees</TabsTrigger>
          <TabsTrigger value="research">Research</TabsTrigger>
        </TabsList>
        <TabsContent value="guidelines">
          <SectionCard title="Clinical Reference Library">
            <div className="space-y-3">
              {CLINICAL_GUIDELINES.map(g => (
                <GuidelineCard key={g.id} g={g} />
              ))}
            </div>
          </SectionCard>
        </TabsContent>
        <TabsContent value="protocols">
          <SectionCard title="Hospital Protocols">
            <div className="space-y-2">
              {[
                { name: "Sepsis Protocol", version: "3.2", updated: "2026-06", status: "Current" },
                { name: "AKI Management Protocol", version: "2.1", updated: "2026-03", status: "Current" },
                { name: "VTE Prophylaxis Protocol", version: "4.0", updated: "2026-01", status: "Current" },
                { name: "Antibiotic Stewardship", version: "5.1", updated: "2026-05", status: "Current" },
              ].map((p, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">v{p.version} — Updated {p.updated}</p>
                  </div>
                  <StatusBadge tone="success">{p.status}</StatusBadge>
                </div>
              ))}
            </div>
          </SectionCard>
        </TabsContent>
        <TabsContent value="decisionTrees">
          <SectionCard title="Clinical Decision Trees">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { name: "Chest Pain Algorithm", specialty: "Cardiology", steps: 8 },
                { name: "Sepsis Screening Flowchart", specialty: "Critical Care", steps: 6 },
                { name: "AKI Staging Algorithm", specialty: "Nephrology", steps: 5 },
                { name: "Diabetic Emergency Protocol", specialty: "Endocrinology", steps: 7 },
              ].map((t, i) => (
                <div key={i} className="p-4 rounded-lg border space-y-2">
                  <h4 className="font-semibold text-sm">{t.name}</h4>
                  <p className="text-xs text-muted-foreground">{t.specialty} — {t.steps} steps</p>
                  <Button size="sm" variant="outline">View Tree</Button>
                </div>
              ))}
            </div>
          </SectionCard>
        </TabsContent>
        <TabsContent value="research">
          <SectionCard title="Recent Research Updates">
            <div className="space-y-2">
              {[
                { title: "Updated Sepsis Definition (Sepsis-4)", source: "JAMA 2026", date: "2026-07-01", relevance: "High" },
                { title: "New AKI Biomarkers — NGAL and KIM-1", source: "NEJM 2026", date: "2026-06-15", relevance: "Medium" },
                { title: "AI in Sepsis Prediction — Meta-analysis", source: "Lancet 2026", date: "2026-06-01", relevance: "High" },
              ].map((r, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="text-sm font-medium">{r.title}</p>
                    <p className="text-xs text-muted-foreground">{r.source} — {r.date}</p>
                  </div>
                  <StatusBadge tone={r.relevance === "High" ? "success" : "info"}>{r.relevance}</StatusBadge>
                </div>
              ))}
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ── Screen: Configuration ────────────────────────────────────────────────── */
function ConfigScreen() {
  return (
    <div className="space-y-4">
      <PageHeader title="Configuration" subtitle="Alert rules, thresholds, risk models, notifications" icon={Settings} />
      <Tabs defaultValue="alerts">
        <TabsList>
          <TabsTrigger value="alerts">Alert Rules</TabsTrigger>
          <TabsTrigger value="thresholds">Thresholds</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="ai">AI Config</TabsTrigger>
        </TabsList>
        <TabsContent value="alerts">
          <SectionCard title="Alert Rule Configuration">
            <div className="space-y-3">
              {[
                { rule: "Sepsis Screening", trigger: "qSOFA >= 2 + Lactate > 2", severity: "Critical" as const, enabled: true },
                { rule: "AKI Detection", trigger: "Creatinine rise > 0.3mg/dL in 48h", severity: "High" as const, enabled: true },
                { rule: "VTE Risk Assessment", trigger: "Caprini >= 5 without prophylaxis", severity: "High" as const, enabled: true },
                { rule: "Drug Interaction", trigger: "Major interaction detected", severity: "High" as const, enabled: true },
                { rule: "Fall Risk", trigger: "Morse Score >= 45", severity: "Medium" as const, enabled: true },
                { rule: "NEWS2 Escalation", trigger: "NEWS2 >= 7", severity: "Critical" as const, enabled: true },
              ].map((r, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="text-sm font-medium">{r.rule}</p>
                    <p className="text-xs text-muted-foreground">{r.trigger}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge tone={alertSeverityTone(r.severity)}>{r.severity}</StatusBadge>
                    <div className={`w-10 h-5 rounded-full cursor-pointer ${r.enabled ? "bg-primary" : "bg-muted"}`}>
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform ${r.enabled ? "translate-x-5" : "translate-x-0.5"}`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </TabsContent>
        <TabsContent value="thresholds">
          <SectionCard title="Risk Score Thresholds">
            <div className="space-y-3">
              {[
                { model: "NEWS2", low: "0-4", moderate: "5-6", high: "7+", escalation: "Urgent review" },
                { model: "qSOFA", low: "0-1", moderate: "N/A", high: "2-3", escalation: "Sepsis screen" },
                { model: "Caprini (VTE)", low: "0-2", moderate: "3-4", high: "5+", escalation: "LMWH" },
                { model: "Morse (Fall)", low: "0-24", moderate: "25-44", high: "45+", escalation: "Fall precautions" },
                { model: "SOFA", low: "0-2", moderate: "3-5", high: "6+", escalation: "ICU consult" },
              ].map((t, i) => (
                <div key={i} className="p-3 border rounded space-y-1">
                  <p className="text-sm font-medium">{t.model}</p>
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    <div className="p-1 bg-green-50 rounded text-center">Low: {t.low}</div>
                    <div className="p-1 bg-yellow-50 rounded text-center">Mod: {t.moderate}</div>
                    <div className="p-1 bg-red-50 rounded text-center">High: {t.high}</div>
                    <div className="p-1 bg-muted rounded text-center">{t.escalation}</div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </TabsContent>
        <TabsContent value="notifications">
          <SectionCard title="Notification Preferences">
            <div className="space-y-2">
              {[
                { channel: "Critical Alerts", method: "In-App + SMS + Pager", enabled: true },
                { channel: "High Alerts", method: "In-App + Email", enabled: true },
                { channel: "Medium Alerts", method: "In-App Only", enabled: true },
                { channel: "Daily Digest", method: "Email (8 AM)", enabled: true },
              ].map((n, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="text-sm font-medium">{n.channel}</p>
                    <p className="text-xs text-muted-foreground">{n.method}</p>
                  </div>
                  <div className={`w-10 h-5 rounded-full cursor-pointer ${n.enabled ? "bg-primary" : "bg-muted"}`}>
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${n.enabled ? "translate-x-5" : "translate-x-0.5"}`} />
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </TabsContent>
        <TabsContent value="ai">
          <SectionCard title="AI Configuration">
            <div className="space-y-2">
              {[
                { setting: "Confidence Threshold", value: "80%" },
                { setting: "Auto-escalation", value: "95%" },
                { setting: "Model Version", value: "v3.2.1" },
                { setting: "Last Retrained", value: "2026-07-01" },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between p-2 border rounded text-sm">
                  <span className="font-medium">{s.setting}</span>
                  <Badge variant="outline">{s.value}</Badge>
                </div>
              ))}
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ── Screen: Audit & Compliance ───────────────────────────────────────────── */
function AuditScreen() {
  return (
    <div className="space-y-4">
      <PageHeader title="Audit & Compliance" subtitle="Alert history, rule changes, user activity" icon={ClipboardCheck}
        actions={<><Button size="sm"><Download className="mr-1.5 size-4" />Export</Button></>} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Audit Entries" value={AUDIT_LOGS.length} icon={ClipboardCheck} />
        <StatCard label="Critical Events" value={AUDIT_LOGS.filter(a => a.severity === "Critical").length} icon={AlertTriangle} />
        <StatCard label="Overrides Logged" value={OVERRIDE_RECORDS.length} icon={XCircle} />
        <StatCard label="Compliance Score" value="96%" icon={ShieldCheck} />
      </div>
      <SectionCard title="Audit Trail">
        <div className="space-y-1">
          {AUDIT_LOGS.map(e => (
            <AuditLogRow key={e.id} e={e} />
          ))}
        </div>
      </SectionCard>
      <SectionCard title="Compliance Reports">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>Actual</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              { cat: "Alert Acknowledgement", target: "100%", actual: "98%", status: "Pass" },
              { cat: "Override Justification", target: "100%", actual: "100%", status: "Pass" },
              { cat: "Sepsis Bundle", target: ">=85%", actual: "78%", status: "Warning" },
              { cat: "VTE Prophylaxis", target: ">=90%", actual: "71%", status: "Warning" },
              { cat: "Documentation", target: ">=95%", actual: "96%", status: "Pass" },
            ].map((c, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{c.cat}</TableCell>
                <TableCell>{c.target}</TableCell>
                <TableCell className="font-medium">{c.actual}</TableCell>
                <TableCell><StatusBadge tone={c.status === "Pass" ? "success" : "warning"}>{c.status}</StatusBadge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>
    </div>
  );
}

/* ── Screen: Workflow Complete ────────────────────────────────────────────── */
function WorkflowCompleteScreen() {
  return (
    <div className="space-y-4">
      <PageHeader title="Workflow Complete" subtitle="CDSS workflow summary" icon={CheckCircle} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SectionCard title="CDSS Workflow Summary" className="lg:col-span-2">
          <div className="space-y-3">
            {[
              { title: "Clinical Data Aggregation", desc: "Real-time data from EMR, Labs, Pharmacy, ICU, Vitals" },
              { title: "Risk Score Calculation", desc: "NEWS2, qSOFA, SOFA, Caprini, Morse, KDIGO computed" },
              { title: "Knowledge Engine Evaluation", desc: "Evidence-based rules, guidelines, drug databases" },
              { title: "Clinical Recommendation Generated", desc: "8 active recommendations with evidence and confidence" },
              { title: "Clinician Review", desc: "Alerts presented contextually within clinical workflow" },
              { title: "Accept / Override Decision", desc: "35 accepted, 5 overridden today — 87.5% acceptance" },
              { title: "Clinical Documentation", desc: "All decisions documented with reasons and audit trail" },
              { title: "EMR Synchronization", desc: "Recommendations synced to EMR, Pharmacy, Lab, ICU" },
              { title: "Outcome Monitoring", desc: "Mortality reduced 10%, VTE reduced 1.4%, errors reduced 42%" },
              { title: "Audit Recorded", desc: "Complete audit trail with governance compliance" },
            ].map((s, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg border bg-green-50 border-green-200">
                <div className="h-8 w-8 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm">{s.title}</p>
                  <p className="text-xs text-muted-foreground">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
        <div className="space-y-4">
          <SectionCard title="Impact Summary">
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                <p className="text-sm font-medium text-green-700">10/10 Steps Completed</p>
                <Progress value={100} className="mt-2" />
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Sepsis Mortality</span><span className="font-medium text-green-600">28% to 18%</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">VTE Events</span><span className="font-medium text-green-600">3.2% to 1.8%</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Med Errors</span><span className="font-medium text-green-600">42% reduction</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Acceptance Rate</span><span className="font-medium">87.5%</span></div>
              </div>
            </div>
          </SectionCard>
          <SectionCard title="Quick Actions">
            <div className="space-y-2">
              <Button className="w-full" variant="outline"><FileText className="mr-2 h-4 w-4" />Generate Summary PDF</Button>
              <Button className="w-full" variant="outline"><Download className="mr-2 h-4 w-4" />Export to EMR</Button>
              <Button className="w-full" variant="outline"><BarChart3 className="mr-2 h-4 w-4" />View Analytics</Button>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
