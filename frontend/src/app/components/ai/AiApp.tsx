import { useState } from "react";
import { Shell, type Workspace } from "../his/Shell";
import { AI_MODELS, CLINICAL_PREDICTIONS, POPULATION_HEALTH, OPERATIONAL_FORECASTS, EXECUTIVE_KPIS, DOCUMENTATION_AI, RADIOLOGY_AI_CASES, PATHOLOGY_AI_CASES, RESOURCE_OPTIMIZATIONS, PATIENT_FLOW, EXPLANATION_RECORDS, MODEL_VERSIONS, MODEL_MONITOR_RECORDS, GOVERNANCE_RECORDS, BIAS_ASSESSMENTS, ALERT_NOTIFICATIONS, AI_CONFIG, AI_AUDIT_LOGS, DASHBOARD_KPIS, riskColor, confidenceColor, confidenceLabel, statusBadge, driftColor } from "./data";
import { PredictionCard, RiskCard, ForecastCard, AiInsightCard, ExecutiveKpiCard, ModelCard, ExplainabilityPanel, GovernanceCard, AuditLogRow, AlertBanner, StatusDot, MetricBar, SectionHeader, TimelineEntry } from "./aiUi";
import { Brain, Activity, Users, Settings, FileText, Bell, Shield, BarChart3, TrendingUp, Search, Filter, ChevronDown, Eye, CheckCircle2, XCircle, AlertTriangle, Clock, Download, RefreshCw, Zap, Target, Layers, GitBranch, Stethoscope, Microscope, HeartPulse, BedDouble, IndianRupee, Star, ArrowUpRight, ArrowDownRight, Minus, Sparkles, Bot, Workflow, ShieldCheck, Lightbulb, PieChart, LineChart } from "lucide-react";

type AiScreen = "dashboard" | "predictions" | "population" | "forecasting" | "executive" | "documentation" | "radiology" | "pathology" | "resources" | "flow" | "xai" | "monitoring" | "governance" | "reports" | "alerts" | "config" | "audit" | "workflow";

interface AiAppProps { roleName: string; onSignOut: () => void; onSwitchWorkspace: (ws: Workspace) => void; onOpenSettings?: (page: string) => void; }

export function AiApp({ roleName, onSignOut, onSwitchWorkspace, onOpenSettings }: AiAppProps) {
  const [screen, setScreen] = useState<AiScreen>("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPrediction, setSelectedPrediction] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [showOverrideModal, setShowOverrideModal] = useState(false);

  const nav = [
    { id: "dashboard" as AiScreen, label: "AI Dashboard", icon: Brain },
    { id: "predictions" as AiScreen, label: "Clinical Predictions", icon: Activity },
    { id: "population" as AiScreen, label: "Population Health", icon: Users },
    { id: "forecasting" as AiScreen, label: "Operational Forecasting", icon: TrendingUp },
    { id: "executive" as AiScreen, label: "Executive Intelligence", icon: Target },
    { id: "documentation" as AiScreen, label: "Clinical Documentation AI", icon: FileText },
    { id: "radiology" as AiScreen, label: "Radiology & Imaging AI", icon: Layers },
    { id: "pathology" as AiScreen, label: "Pathology AI", icon: Microscope },
    { id: "resources" as AiScreen, label: "Resource Optimization", icon: Settings },
    { id: "flow" as AiScreen, label: "Patient Flow Intelligence", icon: Workflow },
    { id: "xai" as AiScreen, label: "Explainable AI (XAI)", icon: Lightbulb },
    { id: "monitoring" as AiScreen, label: "Model Monitoring", icon: BarChart3 },
    { id: "governance" as AiScreen, label: "AI Governance", icon: Shield },
    { id: "reports" as AiScreen, label: "Reports & Analytics", icon: PieChart },
    { id: "alerts" as AiScreen, label: "Alerts & Notifications", icon: Bell },
    { id: "config" as AiScreen, label: "Configuration", icon: Settings },
    { id: "audit" as AiScreen, label: "Audit & Compliance", icon: ShieldCheck },
    { id: "workflow" as AiScreen, label: "Workflow Complete", icon: CheckCircle2 },
  ];

  const unreadAlerts = ALERT_NOTIFICATIONS.filter(a => !a.read).length;

  return (
    <Shell
      nav={nav.map(n => ({ id: n.id, label: n.label, icon: n.icon }))}
      navSecondary={[{ id: "workflow", label: "Workflow Complete", icon: CheckCircle2 }]}
      activeId={screen}
      onNavigate={(id) => setScreen(id as AiScreen)}
      breadcrumb={["Home", "AI Platform", nav.find(n => n.id === screen)?.label || ""]}
      roleName={roleName}
      onSignOut={onSignOut}
      workspace="ai"
      sectionLabel="AI Analytics"
      onSwitchWorkspace={onSwitchWorkspace}
      onOpenSettings={onOpenSettings}
    >
      <div className="space-y-6">
        {screen === "dashboard" && <DashboardScreen searchQuery={searchQuery} setSearchQuery={setSearchQuery} setScreen={setScreen} />}
        {screen === "predictions" && <PredictionsScreen searchQuery={searchQuery} setSearchQuery={setSearchQuery} selectedPrediction={selectedPrediction} setSelectedPrediction={setSelectedPrediction} filterStatus={filterStatus} setFilterStatus={setFilterStatus} setShowOverrideModal={setShowOverrideModal} showOverrideModal={showOverrideModal} />}
        {screen === "population" && <PopulationScreen />}
        {screen === "forecasting" && <ForecastingScreen />}
        {screen === "executive" && <ExecutiveScreen />}
        {screen === "documentation" && <DocumentationScreen />}
        {screen === "radiology" && <RadiologyScreen />}
        {screen === "pathology" && <PathologyScreen />}
        {screen === "resources" && <ResourcesScreen />}
        {screen === "flow" && <FlowScreen />}
        {screen === "xai" && <XaiScreen />}
        {screen === "monitoring" && <MonitoringScreen />}
        {screen === "governance" && <GovernanceScreen />}
        {screen === "reports" && <ReportsScreen />}
        {screen === "alerts" && <AlertsScreen />}
        {screen === "config" && <ConfigScreen />}
        {screen === "audit" && <AuditScreen />}
        {screen === "workflow" && <WorkflowScreen setScreen={setScreen} />}
      </div>
    </Shell>
  );
}

// ── 01 Dashboard ──
function DashboardScreen({ searchQuery, setSearchQuery, setScreen }: { searchQuery: string; setSearchQuery: (s: string) => void; setScreen: (s: AiScreen) => void }) {
  const kpis = DASHBOARD_KPIS;
  const criticalPreds = CLINICAL_PREDICTIONS.filter(p => p.riskScore >= 0.8 && p.status !== "accepted");
  const recentAlerts = ALERT_NOTIFICATIONS.slice(0, 5);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Enterprise AI Dashboard</h2>
          <p className="text-sm text-slate-500 mt-1">Real-time AI analytics and predictive intelligence</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input className="pl-9 pr-4 py-2 border rounded-lg text-sm w-64" placeholder="Search predictions, models..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
            <Sparkles className="w-4 h-4" /> Generate Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="border rounded-lg p-4 bg-gradient-to-br from-indigo-50 to-white">
          <div className="flex items-center gap-2 mb-2"><Brain className="w-5 h-5 text-indigo-600" /><span className="text-sm font-medium text-slate-700">Active Models</span></div>
          <div className="text-3xl font-bold text-slate-900">{kpis.activeModels}</div>
          <div className="text-xs text-emerald-600 mt-1">All performing well</div>
        </div>
        <div className="border rounded-lg p-4 bg-gradient-to-br from-red-50 to-white">
          <div className="flex items-center gap-2 mb-2"><AlertTriangle className="w-5 h-5 text-red-600" /><span className="text-sm font-medium text-slate-700">High-Risk Patients</span></div>
          <div className="text-3xl font-bold text-red-600">{kpis.highRiskPatients}</div>
          <div className="text-xs text-red-500 mt-1">{kpis.pendingReviews} pending review</div>
        </div>
        <div className="border rounded-lg p-4 bg-gradient-to-br from-emerald-50 to-white">
          <div className="flex items-center gap-2 mb-2"><Activity className="w-5 h-5 text-emerald-600" /><span className="text-sm font-medium text-slate-700">Today's Predictions</span></div>
          <div className="text-3xl font-bold text-slate-900">{kpis.totalPredictionsToday}</div>
          <div className="text-xs text-emerald-600 mt-1">{kpis.acknowledgedPredictions} acknowledged</div>
        </div>
        <div className="border rounded-lg p-4 bg-gradient-to-br from-yellow-50 to-white">
          <div className="flex items-center gap-2 mb-2"><BarChart3 className="w-5 h-5 text-yellow-600" /><span className="text-sm font-medium text-slate-700">Model Accuracy</span></div>
          <div className="text-3xl font-bold text-slate-900">{kpis.modelAccuracyAvg}%</div>
          <div className="text-xs text-yellow-600 mt-1">{kpis.driftDetected} drift detected</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="border rounded-lg p-4 bg-white">
          <SectionHeader title="Executive KPIs" subtitle="Key performance indicators" />
          <div className="grid grid-cols-2 gap-3">
            {EXECUTIVE_KPIS.slice(0, 4).map(k => (
              <ExecutiveKpiCard key={k.id} name={k.name} value={k.value} change={k.change} trend={k.trend} target={k.target} status={k.status} category={k.category} />
            ))}
          </div>
        </div>
        <div className="border rounded-lg p-4 bg-white">
          <SectionHeader title="Critical Predictions Requiring Attention" subtitle="High-risk patients identified by AI" />
          <div className="space-y-3">
            {criticalPreds.map(p => (
              <div key={p.id} className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-100 cursor-pointer hover:bg-red-100" onClick={() => setScreen("predictions")}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold ${riskColor(p.riskScore).includes("red") ? "bg-red-500" : "bg-orange-500"}`}>{(p.riskScore * 100).toFixed(0)}</div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-800">{p.patientName}</div>
                  <div className="text-xs text-slate-500">{p.predictionType} | {p.modelName}</div>
                </div>
                <div className={`text-xs font-medium ${confidenceColor(p.confidence)}`}>{(p.confidence * 100).toFixed(0)}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="border rounded-lg p-4 bg-white">
          <SectionHeader title="Operational Alerts" subtitle="AI-generated operational warnings" />
          <div className="space-y-2">
            {recentAlerts.map(a => (
              <AlertBanner key={a.id} title={a.title} message={a.message} severity={a.severity} source={a.source} />
            ))}
          </div>
        </div>
        <div className="border rounded-lg p-4 bg-white">
          <SectionHeader title="Model Health" subtitle="Active AI model status" />
          <div className="space-y-2">
            {AI_MODELS.filter(m => m.status === "active").slice(0, 5).map(m => (
              <div key={m.id} className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-0">
                <StatusDot status={m.status} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-700 truncate">{m.name}</div>
                  <div className="text-xs text-slate-400">v{m.version} | {m.department}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-slate-800">{(m.accuracy * 100).toFixed(1)}%</div>
                  <div className={`text-xs ${driftColor(m.driftStatus)}`}>Drift: {(m.driftScore * 100).toFixed(1)}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 02 Clinical Predictions ──
function PredictionsScreen({ searchQuery, setSearchQuery, selectedPrediction, setSelectedPrediction, filterStatus, setFilterStatus, setShowOverrideModal, showOverrideModal }: { searchQuery: string; setSearchQuery: (s: string) => void; selectedPrediction: string | null; setSelectedPrediction: (s: string | null) => void; filterStatus: string; setFilterStatus: (s: string) => void; setShowOverrideModal: (s: boolean) => void; showOverrideModal: boolean }) {
  const filtered = CLINICAL_PREDICTIONS.filter(p => {
    if (filterStatus !== "all" && p.status !== filterStatus) return false;
    if (searchQuery && !p.patientName.toLowerCase().includes(searchQuery.toLowerCase()) && !p.diagnosis.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });
  const selected = selectedPrediction ? CLINICAL_PREDICTIONS.find(p => p.id === selectedPrediction) : null;
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Clinical Predictions</h2>
          <p className="text-sm text-slate-500 mt-1">AI-powered clinical risk assessment and prediction management</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input className="pl-9 pr-4 py-2 border rounded-lg text-sm w-64" placeholder="Search patients..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <select className="border rounded-lg px-3 py-2 text-sm" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="acknowledged">Acknowledged</option>
            <option value="accepted">Accepted</option>
            <option value="disregarded">Disregarded</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <RiskCard title="Sepsis Risk" score={0.87} subtitle="Rajesh Kumar Singh" icon={<HeartPulse className="w-4 h-4 text-red-500" />} />
        <RiskCard title="Readmission Risk" score={0.74} subtitle="Anita Devi Sharma" icon={<RefreshCw className="w-4 h-4 text-orange-500" />} />
        <RiskCard title="ICU Transfer Risk" score={0.68} subtitle="Vikram Patel" icon={<BedDouble className="w-4 h-4 text-yellow-500" />} />
        <RiskCard title="Mortality Risk" score={0.42} subtitle="Sunita Rani Gupta" icon={<Activity className="w-4 h-4 text-blue-500" />} />
      </div>

      <div className="grid grid-cols-5 gap-6">
        <div className="col-span-3 space-y-3">
          {filtered.map(p => (
            <div key={p.id} className={`border rounded-lg p-4 bg-white cursor-pointer hover:border-indigo-300 ${selectedPrediction === p.id ? "border-indigo-500 ring-2 ring-indigo-100" : ""}`} onClick={() => setSelectedPrediction(p.id)}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-800">{p.patientName}</span>
                  <span className="text-xs text-slate-400">{p.patientId}</span>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge(p.status)}`}>{p.status}</span>
              </div>
              <div className="text-xs text-slate-500 mb-2">{p.predictionType} | {p.diagnosis} | Age {p.age} {p.gender}</div>
              <div className="flex items-center gap-4">
                <div className={`px-3 py-1.5 rounded border text-sm font-bold ${riskColor(p.riskScore)}`}>{(p.riskScore * 100).toFixed(0)}% risk</div>
                <div className={`text-sm font-medium ${confidenceColor(p.confidence)}`}>{(p.confidence * 100).toFixed(0)}% confidence</div>
                <div className="text-xs text-slate-400 ml-auto">{p.modelName} v{p.modelVersion}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="col-span-2">
          {selected ? (
            <div className="border rounded-lg p-5 bg-white space-y-4 sticky top-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Prediction Details</h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge(selected.status)}`}>{selected.status}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-slate-500">Patient:</span> <span className="font-medium">{selected.patientName}</span></div>
                <div><span className="text-slate-500">Risk:</span> <span className={`font-bold ${riskColor(selected.riskScore).split(" ")[0]}`}>{(selected.riskScore * 100).toFixed(0)}%</span></div>
                <div><span className="text-slate-500">Model:</span> <span className="font-medium">{selected.modelName}</span></div>
                <div><span className="text-slate-500">Version:</span> <span className="font-medium">{selected.modelVersion}</span></div>
                <div><span className="text-slate-500">Confidence:</span> <span className={`font-medium ${confidenceColor(selected.confidence)}`}>{(selected.confidence * 100).toFixed(0)}%</span></div>
                <div><span className="text-slate-500">Predicted:</span> <span className="font-medium">{selected.predictedAt}</span></div>
              </div>
              <div>
                <div className="text-sm font-medium text-slate-700 mb-1">Key Contributing Factors</div>
                <div className="space-y-1">{selected.factors.map((f, i) => <div key={i} className="flex items-start gap-2 text-xs"><span className="text-red-500 mt-0.5">*</span><span className="text-slate-600">{f}</span></div>)}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-slate-700 mb-1">Supporting Evidence</div>
                <div className="space-y-1">{selected.evidence.map((e, i) => <div key={i} className="flex items-start gap-2 text-xs"><span className="text-blue-500 mt-0.5">-</span><span className="text-slate-600">{e}</span></div>)}</div>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <div className="text-sm font-medium text-slate-700 mb-1">Clinical Rationale</div>
                <p className="text-xs text-slate-600">{selected.clinicalRationale}</p>
                <div className="text-xs text-slate-400 mt-1">Guideline: {selected.guidelineReference}</div>
              </div>
              <div className="bg-indigo-50 rounded-lg p-3">
                <div className="text-sm font-medium text-indigo-800 mb-1">Recommended Action</div>
                <p className="text-xs text-indigo-700">{selected.recommendedAction}</p>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t">
                <button className="flex-1 px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700">Accept</button>
                <button className="flex-1 px-3 py-2 bg-yellow-500 text-white rounded-lg text-sm font-medium hover:bg-yellow-600" onClick={() => setShowOverrideModal(true)}>Disregard</button>
                <button className="flex-1 px-3 py-2 border rounded-lg text-sm font-medium hover:bg-slate-50">Request Review</button>
              </div>
              {selected.overrideReason && (
                <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                  <div className="text-sm font-medium text-orange-800 mb-1">Override Reason</div>
                  <p className="text-xs text-orange-700">{selected.overrideReason}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="border rounded-lg p-8 bg-white text-center text-slate-400"><Eye className="w-8 h-8 mx-auto mb-2" /><p className="text-sm">Select a prediction to view details</p></div>
          )}
        </div>
      </div>

      {showOverrideModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Disregard Prediction</h3>
            <p className="text-sm text-slate-600">Provide a reason for disregarding this AI prediction.</p>
            <textarea className="w-full border rounded-lg p-3 text-sm" rows={3} placeholder="Clinical reasoning for override..." />
            <div className="flex gap-2">
              <button className="flex-1 px-3 py-2 border rounded-lg text-sm font-medium hover:bg-slate-50" onClick={() => setShowOverrideModal(false)}>Cancel</button>
              <button className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700" onClick={() => setShowOverrideModal(false)}>Confirm Override</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── 03 Population Health ──
function PopulationScreen() {
  const totalPop = POPULATION_HEALTH.reduce((s, p) => s + p.population, 0);
  const totalAffected = POPULATION_HEALTH.reduce((s, p) => s + p.affected, 0);
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Population Health Analytics</h2>
        <p className="text-sm text-slate-500 mt-1">Community health trends, disease surveillance, and preventive care analytics</p>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <div className="border rounded-lg p-4 bg-white"><div className="text-xs text-slate-500">Target Population</div><div className="text-2xl font-bold text-slate-900">{(totalPop / 1000).toFixed(0)}K</div></div>
        <div className="border rounded-lg p-4 bg-white"><div className="text-xs text-slate-500">Chronic Disease Burden</div><div className="text-2xl font-bold text-red-600">{(totalAffected / 1000).toFixed(1)}K</div></div>
        <div className="border rounded-lg p-4 bg-white"><div className="text-xs text-slate-500">Total Care Gaps</div><div className="text-2xl font-bold text-yellow-600">{POPULATION_HEALTH.reduce((s, p) => s + p.careGapCount, 0).toLocaleString()}</div></div>
        <div className="border rounded-lg p-4 bg-white"><div className="text-xs text-slate-500">Avg Preventive Score</div><div className="text-2xl font-bold text-emerald-600">{(POPULATION_HEALTH.reduce((s, p) => s + p.preventiveScore, 0) / POPULATION_HEALTH.length).toFixed(0)}%</div></div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {POPULATION_HEALTH.map(p => (
          <div key={p.id} className="border rounded-lg p-4 bg-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-slate-800">{p.diseaseName}</span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge(p.riskLevel)}`}>{p.riskLevel}</span>
            </div>
            <div className="text-xs text-slate-500 mb-3">{p.category} | {p.region}</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><span className="text-slate-500">Prevalence:</span> <span className="font-medium">{p.prevalenceRate}%</span></div>
              <div><span className="text-slate-500">Incidence:</span> <span className="font-medium">{p.incidenceRate}%</span></div>
              <div><span className="text-slate-500">Trend:</span> <span className={`font-medium ${p.trendDirection === "up" ? "text-red-500" : p.trendDirection === "down" ? "text-emerald-500" : "text-slate-500"}`}>{p.trendDirection === "up" ? "+" : p.trendDirection === "down" ? "" : "~"}{Math.abs(p.trendChange)}%</span></div>
              <div><span className="text-slate-500">Care Gaps:</span> <span className="font-medium text-yellow-600">{p.careGapCount.toLocaleString()}</span></div>
            </div>
            {p.vaccinated > 0 && (
              <div className="mt-2 text-xs"><span className="text-slate-500">Vaccination Rate: </span><span className="font-medium text-emerald-600">{p.vaccinationRate}%</span> ({(p.vaccinated / 1000).toFixed(1)}K)</div>
            )}
            <div className="mt-2 text-xs"><span className="text-slate-500">Preventive Score: </span><span className={`font-medium ${p.preventiveScore >= 70 ? "text-emerald-600" : p.preventiveScore >= 50 ? "text-yellow-600" : "text-red-600"}`}>{p.preventiveScore}%</span></div>
            <div className="mt-3 space-y-1">
              {p.forecast.map((f, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">{f.month}</span>
                  <span className="font-medium text-slate-700">{typeof f.predicted === "number" && f.predicted > 100 ? `${(f.predicted / 1000).toFixed(1)}K` : f.predicted}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 04 Operational Forecasting ──
function ForecastingScreen() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Operational Forecasting</h2>
        <p className="text-sm text-slate-500 mt-1">AI-powered demand forecasting for hospital operations</p>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {OPERATIONAL_FORECASTS.slice(0, 4).map(f => (
          <ForecastCard key={f.id} metric={f.metric} current={f.currentValue} predicted={f.predictedValue} unit={f.unit} confidence={f.confidence} trend={f.trend} model={f.modelUsed} />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-6">
        {OPERATIONAL_FORECASTS.slice(4).map(f => (
          <div key={f.id} className="border rounded-lg p-4 bg-white">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-sm font-semibold text-slate-800">{f.category}</div>
                <div className="text-xs text-slate-500">{f.department} | {f.forecastPeriod}</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-slate-900">{f.predictedValue.toLocaleString()} {f.unit}</div>
                <div className={`text-xs font-medium ${f.trend === "up" ? "text-orange-500" : "text-emerald-500"}`}>{f.trend === "up" ? "+" : ""}{((f.predictedValue - f.currentValue) / f.currentValue * 100).toFixed(1)}% predicted</div>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs text-slate-500">Current: {f.currentValue.toLocaleString()}</span>
              <span className="text-xs text-slate-400">|</span>
              <span className="text-xs text-slate-500">Accuracy: {(f.accuracy * 100).toFixed(1)}%</span>
              <span className="text-xs text-slate-400">|</span>
              <span className="text-xs text-slate-500">Confidence: {(f.confidence * 100).toFixed(0)}%</span>
            </div>
            <div className="space-y-2">
              <div className="text-xs font-medium text-slate-600">Department Breakdown</div>
              {f.breakdown.map((b, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 w-32">{b.label}</span>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-400 rounded-full" style={{ width: `${(b.value / Math.max(...f.breakdown.map(x => x.value))) * 100}%` }} />
                  </div>
                  <span className="text-xs text-slate-600 w-12 text-right">{b.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 text-xs text-slate-400">Model: {f.modelUsed}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 05 Executive Intelligence ──
function ExecutiveScreen() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Executive Intelligence</h2>
        <p className="text-sm text-slate-500 mt-1">Strategic AI-powered insights for hospital leadership</p>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {EXECUTIVE_KPIS.map(k => (
          <ExecutiveKpiCard key={k.id} name={k.name} value={k.value} change={k.change} trend={k.trend} target={k.target} status={k.status} category={k.category} />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="border rounded-lg p-4 bg-white">
          <SectionHeader title="Revenue Forecast" subtitle="Quarterly revenue projection" />
          <div className="space-y-3">
            <div className="flex items-end justify-between">
              <div><div className="text-3xl font-bold text-slate-900">Rs 12.8 Cr</div><div className="text-sm text-slate-500">Current Quarter Forecast</div></div>
              <div className="text-right"><div className="text-lg font-medium text-emerald-600">+8.2%</div><div className="text-xs text-slate-500">vs last quarter</div></div>
            </div>
            <div className="space-y-2">
              {[{ label: "Inpatient Services", value: 45 }, { label: "Outpatient Services", value: 25 }, { label: "Diagnostics", value: 15 }, { label: "Surgery", value: 12 }, { label: "Others", value: 3 }].map(s => (
                <div key={s.label} className="flex items-center gap-3">
                  <span className="text-xs text-slate-600 w-32">{s.label}</span>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-emerald-400 rounded-full" style={{ width: `${s.value}%` }} /></div>
                  <span className="text-xs text-slate-500 w-8 text-right">{s.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="border rounded-lg p-4 bg-white">
          <SectionHeader title="Service Line Performance" subtitle="AI-assisted service line analysis" />
          <div className="space-y-3">
            {[{ name: "Cardiology", revenue: "Rs 2.8 Cr", growth: 12.4, satisfaction: 4.7 }, { name: "Orthopedics", revenue: "Rs 1.9 Cr", growth: 8.2, satisfaction: 4.5 }, { name: "Oncology", revenue: "Rs 2.1 Cr", growth: 15.6, satisfaction: 4.6 }, { name: "Neurology", revenue: "Rs 1.4 Cr", growth: 6.8, satisfaction: 4.4 }].map(s => (
              <div key={s.name} className="flex items-center gap-4 py-2 border-b border-slate-100 last:border-0">
                <div className="flex-1"><div className="text-sm font-medium text-slate-800">{s.name}</div><div className="text-xs text-slate-500">{s.revenue}</div></div>
                <div className="text-right"><div className="text-sm font-medium text-emerald-600">+{s.growth}%</div><div className="text-xs text-slate-500">{s.satisfaction}/5</div></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="border rounded-lg p-4 bg-white">
        <SectionHeader title="AI Executive Summary" subtitle="AI-generated strategic insights for this period" />
        <div className="bg-indigo-50 rounded-lg p-4 text-sm text-indigo-800">
          <p className="font-medium mb-2">Key Findings:</p>
          <ul className="space-y-1 text-xs text-indigo-700">
            <li>Revenue on track to meet Q3 target of Rs 13.0 Cr with current forecast of Rs 12.8 Cr (+8.2% QoQ)</li>
            <li>AI sepsis prediction model contributing to 2.4% reduction in sepsis mortality (12.1% vs 14.5% pre-AI)</li>
            <li>Bed occupancy within optimal range at 82% with ICU at 88% requiring attention</li>
            <li>Readmission rate improved to 8.2% (target: {"<"}10%) driven by AI-guided discharge planning</li>
            <li>Staff efficiency at 94.2% with AI scheduling optimization saving Rs 3.1L/month</li>
            <li>Drug Interaction GNN model requires immediate retraining due to drift detection</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// ── 06 Clinical Documentation AI ──
function DocumentationScreen() {
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const doc = selectedDoc ? DOCUMENTATION_AI.find(d => d.id === selectedDoc) : null;
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold text-slate-900">Clinical Documentation AI</h2><p className="text-sm text-slate-500 mt-1">AI-assisted clinical documentation with human review</p></div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"><Sparkles className="w-4 h-4" /> Generate New</button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {DOCUMENTATION_AI.map(d => (
          <div key={d.id} className={`border rounded-lg p-4 bg-white cursor-pointer hover:border-indigo-300 ${selectedDoc === d.id ? "border-indigo-500 ring-2 ring-indigo-100" : ""}`} onClick={() => setSelectedDoc(d.id)}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{d.type.replace("_", " ")}</span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge(d.status)}`}>{d.status}</span>
            </div>
            <div className="text-sm font-medium text-slate-800 mb-1">{d.patientName}</div>
            <div className="text-xs text-slate-500 mb-2">{d.patientId}</div>
            <div className="flex items-center gap-3 text-xs">
              <span className="text-slate-500">Quality: <span className="font-medium text-emerald-600">{d.qualityScore}%</span></span>
              <span className="text-slate-500">Words: {d.wordCount}</span>
            </div>
            <div className="text-xs text-slate-400 mt-1">Generated: {d.generatedAt}</div>
          </div>
        ))}
      </div>
      {doc && (
        <div className="border rounded-lg p-5 bg-white space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Documentation Detail</h3>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge(doc.status)}`}>{doc.status}</span>
              {doc.status === "draft" && <button className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-medium hover:bg-emerald-700">Approve</button>}
            </div>
          </div>
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="text-xs text-slate-400 mb-2 uppercase tracking-wide">AI-Generated Content</div>
            <div className="text-sm text-slate-700 whitespace-pre-wrap font-mono leading-relaxed">{doc.content}</div>
          </div>
          <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
            <div className="text-xs text-amber-800 font-medium mb-1">Clinician Review Required</div>
            <textarea className="w-full border rounded p-2 text-sm mt-1" rows={2} placeholder="Add clinician notes or edits..." defaultValue={doc.clinicianNotes} />
          </div>
          <div className="grid grid-cols-4 gap-3 text-sm">
            <div className="border rounded-lg p-3 text-center"><div className="text-lg font-bold text-slate-900">{doc.qualityScore}%</div><div className="text-xs text-slate-500">Quality Score</div></div>
            <div className="border rounded-lg p-3 text-center"><div className="text-lg font-bold text-slate-900">{doc.accuracyScore * 100}%</div><div className="text-xs text-slate-500">Accuracy</div></div>
            <div className="border rounded-lg p-3 text-center"><div className="text-lg font-bold text-slate-900">{doc.wordCount}</div><div className="text-xs text-slate-500">Words</div></div>
            <div className="border rounded-lg p-3 text-center"><div className="text-lg font-bold text-slate-900">{doc.type.split("_").length}</div><div className="text-xs text-slate-500">Sections</div></div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── 07 Radiology & Imaging AI ──
function RadiologyScreen() {
  const criticalCount = RADIOLOGY_AI_CASES.filter(c => c.urgency === "critical").length;
  const pendingCount = RADIOLOGY_AI_CASES.filter(c => c.status === "pending").length;
  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold text-slate-900">Radiology & Imaging AI</h2><p className="text-sm text-slate-500 mt-1">AI-powered radiology triage, prioritization, and finding detection</p></div>
      <div className="grid grid-cols-4 gap-4">
        <div className="border rounded-lg p-4 bg-white"><div className="text-xs text-slate-500">Total Studies</div><div className="text-2xl font-bold text-slate-900">{RADIOLOGY_AI_CASES.length}</div></div>
        <div className="border rounded-lg p-4 bg-red-50 border-red-200"><div className="text-xs text-red-600">Critical Cases</div><div className="text-2xl font-bold text-red-600">{criticalCount}</div></div>
        <div className="border rounded-lg p-4 bg-white"><div className="text-xs text-slate-500">Pending Review</div><div className="text-2xl font-bold text-yellow-600">{pendingCount}</div></div>
        <div className="border rounded-lg p-4 bg-white"><div className="text-xs text-slate-500">AI Model Accuracy</div><div className="text-2xl font-bold text-emerald-600">94.2%</div></div>
      </div>
      <div className="space-y-3">
        {RADIOLOGY_AI_CASES.sort((a, b) => a.aiTriagePriority - b.aiTriagePriority).map(c => (
          <div key={c.id} className={`border rounded-lg p-4 bg-white ${c.urgency === "critical" ? "border-red-300 bg-red-50" : ""}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${c.aiTriagePriority === 1 ? "bg-red-500" : c.aiTriagePriority === 2 ? "bg-orange-500" : c.aiTriagePriority === 3 ? "bg-yellow-500" : "bg-slate-400"}`}>{c.aiTriagePriority}</span>
                <div>
                  <div className="text-sm font-semibold text-slate-800">{c.patientName} <span className="text-xs text-slate-400">{c.patientId}</span></div>
                  <div className="text-xs text-slate-500">{c.studyType} | {c.bodyPart}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge(c.status)}`}>{c.status}</span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge(c.urgency)}`}>{c.urgency}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-medium text-slate-600 mb-1">AI Suggested Findings</div>
                <div className="space-y-1">{c.suggestedFindings.map((f, i) => <div key={i} className="text-xs text-slate-600 flex items-start gap-1"><span className="text-emerald-500">+</span>{f}</div>)}</div>
              </div>
              <div>
                <div className="text-xs font-medium text-slate-600 mb-1">Confidence & Model</div>
                <div className={`text-sm font-medium ${confidenceColor(c.confidence)}`}>{(c.confidence * 100).toFixed(0)}% confidence</div>
                <div className="text-xs text-slate-400">Model: Radiology Triage CNN v{c.aiModelVersion}</div>
                {c.criticalFindings.length > 0 && (
                  <div className="mt-2 bg-red-50 rounded p-2 border border-red-200">
                    <div className="text-xs font-medium text-red-700">Critical Findings:</div>
                    {c.criticalFindings.map((f, i) => <div key={i} className="text-xs text-red-600">{f}</div>)}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 08 Pathology AI ──
function PathologyScreen() {
  const flaggedCount = PATHOLOGY_AI_CASES.filter(c => c.status === "flagged").length;
  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold text-slate-900">Pathology AI</h2><p className="text-sm text-slate-500 mt-1">AI-powered digital pathology analysis and cancer detection</p></div>
      <div className="grid grid-cols-4 gap-4">
        <div className="border rounded-lg p-4 bg-white"><div className="text-xs text-slate-500">Total Cases</div><div className="text-2xl font-bold text-slate-900">{PATHOLOGY_AI_CASES.length}</div></div>
        <div className="border rounded-lg p-4 bg-red-50 border-red-200"><div className="text-xs text-red-600">AI Flagged</div><div className="text-2xl font-bold text-red-600">{flaggedCount}</div></div>
        <div className="border rounded-lg p-4 bg-white"><div className="text-xs text-slate-500">Avg Confidence</div><div className="text-2xl font-bold text-emerald-600">{(PATHOLOGY_AI_CASES.reduce((s, c) => s + c.confidence, 0) / PATHOLOGY_AI_CASES.length * 100).toFixed(0)}%</div></div>
        <div className="border rounded-lg p-4 bg-white"><div className="text-xs text-slate-500">Model Accuracy</div><div className="text-2xl font-bold text-emerald-600">95.6%</div></div>
      </div>
      <div className="space-y-3">
        {PATHOLOGY_AI_CASES.map(c => (
          <div key={c.id} className={`border rounded-lg p-4 bg-white ${c.status === "flagged" ? "border-red-300 bg-red-50" : ""}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <Microscope className="w-5 h-5 text-indigo-500" />
                <div>
                  <div className="text-sm font-semibold text-slate-800">{c.patientName} <span className="text-xs text-slate-400">{c.patientId}</span></div>
                  <div className="text-xs text-slate-500">{c.specimenType} | {c.biopsySite}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge(c.status)}`}>{c.status}</span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge(c.priority)}`}>{c.priority}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-medium text-slate-600 mb-1">AI Flags</div>
                <div className="space-y-1">{c.aiFlags.map((f, i) => <div key={i} className="text-xs text-slate-600 flex items-start gap-1"><span className="text-red-500">!</span>{f}</div>)}</div>
              </div>
              <div>
                <div className="text-xs font-medium text-slate-600 mb-1">Suggested Diagnosis</div>
                <div className="text-sm font-medium text-indigo-700">{c.suggestedDiagnosis}</div>
                <div className={`text-xs font-medium mt-1 ${confidenceColor(c.confidence)}`}>{(c.confidence * 100).toFixed(0)}% confidence</div>
                <div className="text-xs text-slate-400 mt-1">Reported: {c.reportedAt}</div>
                {c.pathologistId && <div className="text-xs text-slate-500 mt-1">Pathologist: {c.pathologistId}</div>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 09 Resource Optimization ──
function ResourcesScreen() {
  const totalSavings = RESOURCE_OPTIMIZATIONS.filter(r => r.status === "accepted" || r.status === "implemented").reduce((s, r) => s + parseInt(r.potentialSaving.replace(/[^0-9]/g, "")), 0);
  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold text-slate-900">Resource Optimization</h2><p className="text-sm text-slate-500 mt-1">AI-powered resource allocation and utilization optimization</p></div>
      <div className="grid grid-cols-4 gap-4">
        <div className="border rounded-lg p-4 bg-white"><div className="text-xs text-slate-500">Optimizations</div><div className="text-2xl font-bold text-slate-900">{RESOURCE_OPTIMIZATIONS.length}</div></div>
        <div className="border rounded-lg p-4 bg-emerald-50 border-emerald-200"><div className="text-xs text-emerald-600">Accepted</div><div className="text-2xl font-bold text-emerald-600">{RESOURCE_OPTIMIZATIONS.filter(r => r.status === "accepted").length}</div></div>
        <div className="border rounded-lg p-4 bg-blue-50 border-blue-200"><div className="text-xs text-blue-600">Implemented</div><div className="text-2xl font-bold text-blue-600">{RESOURCE_OPTIMIZATIONS.filter(r => r.status === "implemented").length}</div></div>
        <div className="border rounded-lg p-4 bg-white"><div className="text-xs text-slate-500">Potential Savings</div><div className="text-2xl font-bold text-emerald-600">Rs {totalSavings}L</div></div>
      </div>
      <div className="space-y-3">
        {RESOURCE_OPTIMIZATIONS.map(r => (
          <div key={r.id} className="border rounded-lg p-4 bg-white">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-slate-900">{r.resource}</span>
                <span className="text-xs text-slate-500">{r.department} | {r.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge(r.status)}`}>{r.status}</span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge(r.priority)}`}>{r.priority}</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-3">
              <div className="text-center p-2 bg-slate-50 rounded-lg"><div className="text-lg font-bold text-slate-900">{r.currentUtilization}%</div><div className="text-xs text-slate-500">Current Utilization</div></div>
              <div className="text-center p-2 bg-emerald-50 rounded-lg"><div className="text-lg font-bold text-emerald-600">{r.optimizedUtilization}%</div><div className="text-xs text-slate-500">Optimized Target</div></div>
              <div className="text-center p-2 bg-blue-50 rounded-lg"><div className="text-lg font-bold text-blue-600">{r.savingsPercent}%</div><div className="text-xs text-slate-500">Savings Potential</div></div>
            </div>
            <div className="bg-indigo-50 rounded-lg p-3">
              <div className="text-sm font-medium text-indigo-800">Recommendation</div>
              <p className="text-xs text-indigo-700 mt-1">{r.recommendation}</p>
              <div className="text-xs text-indigo-500 mt-1">Potential Saving: {r.potentialSaving}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 10 Patient Flow Intelligence ──
function FlowScreen() {
  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold text-slate-900">Patient Flow Intelligence</h2><p className="text-sm text-slate-500 mt-1">AI-powered patient flow analysis, bottleneck detection, and optimization</p></div>
      <div className="grid grid-cols-4 gap-4">
        {PATIENT_FLOW.slice(-1).map(p => (
          <div key={p.id}>
            <div className="border rounded-lg p-4 bg-white"><div className="text-xs text-slate-500">Capacity Utilization</div><div className="text-2xl font-bold text-slate-900">{p.capacityUtilization}%</div></div>
            <div className="border rounded-lg p-4 bg-white mt-4"><div className="text-xs text-slate-500">Bottleneck</div><div className="text-sm font-bold text-orange-600">{p.bottleneckDepartment}</div></div>
          </div>
        ))}
        <div className="border rounded-lg p-4 bg-white"><div className="text-xs text-slate-500">Current Admissions</div><div className="text-2xl font-bold text-slate-900">{PATIENT_FLOW[PATIENT_FLOW.length - 1].admissions}</div></div>
        <div className="border rounded-lg p-4 bg-white"><div className="text-xs text-slate-500">Predicted Admissions</div><div className="text-2xl font-bold text-indigo-600">{PATIENT_FLOW[PATIENT_FLOW.length - 1].predictedAdmissions}</div></div>
        <div className="border rounded-lg p-4 bg-white"><div className="text-xs text-slate-500">ED Visits</div><div className="text-2xl font-bold text-slate-900">{PATIENT_FLOW[PATIENT_FLOW.length - 1].edVisits}</div></div>
      </div>
      <div className="space-y-3">
        {PATIENT_FLOW.map(f => (
          <div key={f.id} className="border rounded-lg p-4 bg-white">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-slate-400" />
                <div>
                  <div className="text-sm font-semibold text-slate-800">{f.timestamp}</div>
                  <div className="text-xs text-slate-500">Capacity: {f.capacityUtilization}%</div>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${f.predictedDelayMinutes > 60 ? "bg-red-100 text-red-700" : f.predictedDelayMinutes > 30 ? "bg-yellow-100 text-yellow-700" : "bg-emerald-100 text-emerald-700"}`}>
                {f.predictedDelayMinutes}min delay predicted
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3 mb-3">
              <div className="text-center"><div className="text-lg font-bold text-slate-900">{f.admissions}</div><div className="text-xs text-slate-500">Admissions</div></div>
              <div className="text-center"><div className="text-lg font-bold text-slate-900">{f.transfers}</div><div className="text-xs text-slate-500">Transfers</div></div>
              <div className="text-center"><div className="text-lg font-bold text-slate-900">{f.discharges}</div><div className="text-xs text-slate-500">Discharges</div></div>
              <div className="text-center"><div className="text-lg font-bold text-indigo-600">{f.predictedAdmissions}</div><div className="text-xs text-slate-500">Predicted Admits</div></div>
            </div>
            <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
              <div className="text-xs font-medium text-orange-800">Bottleneck: {f.bottleneckDepartment}</div>
              <p className="text-xs text-orange-700 mt-0.5">{f.bottleneckDescription}</p>
            </div>
            <div className="bg-emerald-50 rounded-lg p-3 mt-2 border border-emerald-200">
              <div className="text-xs font-medium text-emerald-800">AI Recommendation</div>
              <p className="text-xs text-emerald-700 mt-0.5">{f.recommendation}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 11 Explainable AI (XAI) ──
function XaiScreen() {
  const [selectedExplanation, setSelectedExplanation] = useState<string | null>(null);
  const explanation = selectedExplanation ? EXPLANATION_RECORDS.find(e => e.id === selectedExplanation) : EXPLANATION_RECORDS[0];
  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold text-slate-900">Explainable AI (XAI)</h2><p className="text-sm text-slate-500 mt-1">Transparent AI explanations with feature importance and clinical context</p></div>
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-3">
          {EXPLANATION_RECORDS.map(e => (
            <div key={e.id} className={`border rounded-lg p-4 bg-white cursor-pointer hover:border-indigo-300 ${selectedExplanation === e.id || (!selectedExplanation && e.id === "exp-001") ? "border-indigo-500 ring-2 ring-indigo-100" : ""}`} onClick={() => setSelectedExplanation(e.id)}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-indigo-500" />
                  <span className="text-sm font-semibold text-slate-800">{e.modelName}</span>
                </div>
                <span className={`text-xs font-medium ${confidenceColor(e.confidence)}`}>{(e.confidence * 100).toFixed(0)}%</span>
              </div>
              <div className="text-xs text-slate-500">Type: {e.explanationType.toUpperCase()} | {e.timestamp}</div>
            </div>
          ))}
        </div>
        {explanation && (
          <div className="border rounded-lg p-5 bg-white space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Explanation Detail</h3>
              <span className={`text-sm font-medium ${confidenceColor(explanation.confidence)}`}>{(explanation.confidence * 100).toFixed(0)}% confidence</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="text-slate-500">Model: <span className="font-medium">{explanation.modelName}</span></span>
              <span className="text-slate-500">Type: <span className="font-medium uppercase">{explanation.explanationType}</span></span>
            </div>
            <ExplainabilityPanel factors={explanation.keyFactors} confidence={explanation.confidence} />
            <div className="space-y-3">
              <div>
                <div className="text-sm font-medium text-slate-700 mb-2">Feature Importance Details</div>
                <div className="space-y-2">{explanation.keyFactors.map((f, i) => (
                  <div key={i} className="border rounded-lg p-3 bg-slate-50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-800">{f.feature}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-medium ${f.direction === "positive" ? "text-red-500" : "text-emerald-500"}`}>{f.direction === "positive" ? "Increases risk" : "Decreases risk"}</span>
                        <span className="text-sm font-bold text-slate-700">{(f.importance * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600">{f.description}</p>
                  </div>
                ))}</div>
              </div>
              <div className="bg-indigo-50 rounded-lg p-4">
                <div className="text-sm font-medium text-indigo-800 mb-1">Clinical Context</div>
                <p className="text-xs text-indigo-700">{explanation.clinicalContext}</p>
              </div>
              <div className="bg-emerald-50 rounded-lg p-4">
                <div className="text-sm font-medium text-emerald-800 mb-1">Supporting Evidence</div>
                <div className="space-y-1">{explanation.supportingEvidence.map((e, i) => <div key={i} className="text-xs text-emerald-700 flex items-start gap-1"><span>+</span>{e}</div>)}</div>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="text-sm font-medium text-slate-700 mb-1">Guidelines Referenced</div>
                <div className="space-y-1">{explanation.guidelinesReferenced.map((g, i) => <div key={i} className="text-xs text-slate-600">{g}</div>)}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── 12 Model Monitoring ──
function MonitoringScreen() {
  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold text-slate-900">Model Monitoring</h2><p className="text-sm text-slate-500 mt-1">Real-time model performance monitoring, drift detection, and health tracking</p></div>
      <div className="grid grid-cols-4 gap-4">
        <div className="border rounded-lg p-4 bg-emerald-50 border-emerald-200"><div className="text-xs text-emerald-600">Healthy Models</div><div className="text-2xl font-bold text-emerald-600">{MODEL_MONITOR_RECORDS.filter(m => m.driftStatus === "normal").length}</div></div>
        <div className="border rounded-lg p-4 bg-yellow-50 border-yellow-200"><div className="text-xs text-yellow-600">Warning</div><div className="text-2xl font-bold text-yellow-600">{MODEL_MONITOR_RECORDS.filter(m => m.driftStatus === "warning").length}</div></div>
        <div className="border rounded-lg p-4 bg-red-50 border-red-200"><div className="text-xs text-red-600">Drifted</div><div className="text-2xl font-bold text-red-600">{MODEL_MONITOR_RECORDS.filter(m => m.driftStatus === "drifted").length}</div></div>
        <div className="border rounded-lg p-4 bg-white"><div className="text-xs text-slate-500">Avg Accuracy</div><div className="text-2xl font-bold text-slate-900">{(MODEL_MONITOR_RECORDS.reduce((s, m) => s + m.accuracy, 0) / MODEL_MONITOR_RECORDS.length * 100).toFixed(1)}%</div></div>
      </div>
      <div className="border rounded-lg bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50"><tr>
            <th className="text-left px-4 py-3 font-medium text-slate-600">Model</th>
            <th className="text-left px-4 py-3 font-medium text-slate-600">Version</th>
            <th className="text-left px-4 py-3 font-medium text-slate-600">Accuracy</th>
            <th className="text-left px-4 py-3 font-medium text-slate-600">Precision</th>
            <th className="text-left px-4 py-3 font-medium text-slate-600">Recall</th>
            <th className="text-left px-4 py-3 font-medium text-slate-600">F1</th>
            <th className="text-left px-4 py-3 font-medium text-slate-600">AUC</th>
            <th className="text-left px-4 py-3 font-medium text-slate-600">Drift</th>
            <th className="text-left px-4 py-3 font-medium text-slate-600">Volume</th>
          </tr></thead>
          <tbody>{MODEL_MONITOR_RECORDS.map(m => (
            <tr key={m.id} className="border-t border-slate-100 hover:bg-slate-50">
              <td className="px-4 py-3 font-medium text-slate-800">{m.modelName}</td>
              <td className="px-4 py-3 text-slate-600">v{m.modelVersion}</td>
              <td className="px-4 py-3 font-medium text-slate-800">{(m.accuracy * 100).toFixed(1)}%</td>
              <td className="px-4 py-3 text-slate-600">{(m.precision * 100).toFixed(1)}%</td>
              <td className="px-4 py-3 text-slate-600">{(m.recall * 100).toFixed(1)}%</td>
              <td className="px-4 py-3 text-slate-600">{(m.f1Score * 100).toFixed(1)}%</td>
              <td className="px-4 py-3 text-slate-600">{(m.auc * 100).toFixed(1)}%</td>
              <td className="px-4 py-3"><span className={`text-xs font-medium ${driftColor(m.driftStatus)}`}>{m.driftStatus} ({(m.driftScore * 100).toFixed(1)}%)</span></td>
              <td className="px-4 py-3 text-slate-600">{m.predictionVolume}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      <div className="space-y-3">
        <SectionHeader title="Version History" subtitle="Model version tracking and deployment history" />
        {MODEL_VERSIONS.map(v => (
          <div key={v.id} className="border rounded-lg p-4 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge(v.status)}`}>{v.status}</span>
                <span className="text-sm font-semibold text-slate-800">{AI_MODELS.find(m => m.id === v.modelId)?.name} v{v.version}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-slate-800">{(v.accuracy * 100).toFixed(1)}% accuracy</div>
                <div className={`text-xs font-medium ${v.performanceDelta >= 0 ? "text-emerald-600" : "text-red-600"}`}>{v.performanceDelta >= 0 ? "+" : ""}{v.performanceDelta}% vs previous</div>
              </div>
            </div>
            <div className="text-xs text-slate-500 mt-1">{v.changes}</div>
            <div className="text-xs text-slate-400 mt-1">Deployed: {v.deployedAt} by {v.deployedBy} | Samples: {v.trainingSamples.toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 13 AI Governance ──
function GovernanceScreen() {
  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold text-slate-900">AI Governance</h2><p className="text-sm text-slate-500 mt-1">Model governance, compliance, bias assessment, and approval workflows</p></div>
      <div className="grid grid-cols-4 gap-4">
        <div className="border rounded-lg p-4 bg-emerald-50 border-emerald-200"><div className="text-xs text-emerald-600">Approved Models</div><div className="text-2xl font-bold text-emerald-600">{GOVERNANCE_RECORDS.filter(g => g.status === "approved").length}</div></div>
        <div className="border rounded-lg p-4 bg-yellow-50 border-yellow-200"><div className="text-xs text-yellow-600">Pending Review</div><div className="text-2xl font-bold text-yellow-600">{GOVERNANCE_RECORDS.filter(g => g.status === "revision").length}</div></div>
        <div className="border rounded-lg p-4 bg-white"><div className="text-xs text-slate-500">Bias Assessments</div><div className="text-2xl font-bold text-slate-900">{BIAS_ASSESSMENTS.length}</div></div>
        <div className="border rounded-lg p-4 bg-white"><div className="text-xs text-slate-500">Avg Fairness Score</div><div className="text-2xl font-bold text-slate-900">{(BIAS_ASSESSMENTS.reduce((s, b) => s + b.fairnessScore, 0) / BIAS_ASSESSMENTS.length * 100).toFixed(1)}%</div></div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-3">
          <SectionHeader title="Governance Records" subtitle="Model approval and compliance tracking" />
          {GOVERNANCE_RECORDS.map(g => (
            <GovernanceCard key={g.id} modelName={g.modelName} version={g.version} status={g.status} committee={g.committee} fairnessScore={g.fairnessScore} biasStatus={g.biasStatus} />
          ))}
        </div>
        <div className="space-y-3">
          <SectionHeader title="Bias Assessments" subtitle="Fairness and bias evaluation results" />
          {BIAS_ASSESSMENTS.map(b => (
            <div key={b.id} className="border rounded-lg p-4 bg-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-800">{b.modelName}</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge(b.overallBiasStatus)}`}>{b.overallBiasStatus}</span>
              </div>
              <div className="text-xs text-slate-500 mb-2">Assessed: {b.assessmentDate} by {b.assessedBy}</div>
              <div className="space-y-1">
                {b.metrics.map((m, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs">
                    <span className="w-20 text-slate-600">{m.demographic}</span>
                    <span className="w-32 text-slate-500">{m.metric}</span>
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${m.status === "pass" ? "bg-emerald-400" : m.status === "warning" ? "bg-yellow-400" : "bg-red-400"}`} style={{ width: `${(m.value / 1) * 100}%` }} />
                    </div>
                    <span className="w-12 text-right font-medium">{(m.value * 100).toFixed(1)}%</span>
                    <span className={`w-12 text-right font-medium ${m.status === "pass" ? "text-emerald-600" : m.status === "warning" ? "text-yellow-600" : "text-red-600"}`}>{m.status}</span>
                  </div>
                ))}
              </div>
              <div className="mt-2 space-y-1">
                {b.recommendations.map((r, i) => <div key={i} className="text-xs text-slate-500 flex items-start gap-1"><span className="text-yellow-500">*</span>{r}</div>)}
              </div>
              <div className="text-xs text-slate-400 mt-1">Next assessment: {b.nextAssessment}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── 14 Reports & Analytics ──
function ReportsScreen() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold text-slate-900">Reports & Analytics</h2><p className="text-sm text-slate-500 mt-1">AI performance reports, operational savings, and clinical outcomes</p></div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"><Download className="w-4 h-4" /> Export Report</button>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <div className="border rounded-lg p-4 bg-white"><div className="text-xs text-slate-500">Prediction Accuracy</div><div className="text-2xl font-bold text-emerald-600">92.4%</div><div className="text-xs text-emerald-600">+1.8% this month</div></div>
        <div className="border rounded-lg p-4 bg-white"><div className="text-xs text-slate-500">Operational Savings</div><div className="text-2xl font-bold text-emerald-600">Rs 40.2L</div><div className="text-xs text-emerald-600">This quarter</div></div>
        <div className="border rounded-lg p-4 bg-white"><div className="text-xs text-slate-500">Clinical Outcomes Improved</div><div className="text-2xl font-bold text-emerald-600">23%</div><div className="text-xs text-emerald-600">Sepsis mortality reduction</div></div>
        <div className="border rounded-lg p-4 bg-white"><div className="text-xs text-slate-500">AI Adoption Rate</div><div className="text-2xl font-bold text-indigo-600">87%</div><div className="text-xs text-indigo-600">Clinicians using AI</div></div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="border rounded-lg p-4 bg-white">
          <SectionHeader title="Model Utilization" subtitle="How often each model is used" />
          <div className="space-y-3">
            {AI_MODELS.filter(m => m.status === "active").map(m => (
              <div key={m.id} className="flex items-center gap-3">
                <span className="text-xs text-slate-600 w-40 truncate">{m.name}</span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-400 rounded-full" style={{ width: `${m.accuracy * 100}%` }} />
                </div>
                <span className="text-xs text-slate-500 w-12 text-right">{(m.accuracy * 100).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
        <div className="border rounded-lg p-4 bg-white">
          <SectionHeader title="Clinical Impact" subtitle="AI impact on clinical outcomes" />
          <div className="space-y-3">
            {[{ metric: "Sepsis Mortality", before: "14.5%", after: "12.1%", improvement: "-2.4%" }, { metric: "Readmission Rate", before: "9.5%", after: "8.2%", improvement: "-1.3%" }, { metric: "Avg LOS", before: "5.1 days", after: "4.8 days", improvement: "-0.3 days" }, { metric: "ICU Transfer Delay", before: "4.2 hrs", after: "2.8 hrs", improvement: "-1.4 hrs" }, { metric: "Documentation Time", before: "22 min", after: "8 min", improvement: "-14 min" }].map(c => (
              <div key={c.metric} className="flex items-center gap-4 py-2 border-b border-slate-100 last:border-0">
                <span className="text-xs text-slate-700 font-medium w-32">{c.metric}</span>
                <span className="text-xs text-slate-500">{c.before}</span>
                <ArrowUpRight className="w-3 h-3 text-emerald-500" />
                <span className="text-xs font-medium text-emerald-600">{c.after}</span>
                <span className="text-xs text-emerald-600 ml-auto">{c.improvement}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 15 Alerts & Notifications ──
function AlertsScreen() {
  const [filterType, setFilterType] = useState("all");
  const filtered = ALERT_NOTIFICATIONS.filter(a => filterType === "all" || a.type === filterType);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold text-slate-900">Alerts & Notifications</h2><p className="text-sm text-slate-500 mt-1">AI-generated alerts, capacity warnings, and governance notifications</p></div>
        <select className="border rounded-lg px-3 py-2 text-sm" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="all">All Types</option>
          <option value="critical_prediction">Critical Predictions</option>
          <option value="capacity_alert">Capacity Alerts</option>
          <option value="model_health">Model Health</option>
          <option value="governance">Governance</option>
          <option value="operational_risk">Operational Risks</option>
        </select>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <div className="border rounded-lg p-4 bg-red-50 border-red-200"><div className="text-xs text-red-600">Critical</div><div className="text-2xl font-bold text-red-600">{ALERT_NOTIFICATIONS.filter(a => a.severity === "critical").length}</div></div>
        <div className="border rounded-lg p-4 bg-orange-50 border-orange-200"><div className="text-xs text-orange-600">High</div><div className="text-2xl font-bold text-orange-600">{ALERT_NOTIFICATIONS.filter(a => a.severity === "high").length}</div></div>
        <div className="border rounded-lg p-4 bg-yellow-50 border-yellow-200"><div className="text-xs text-yellow-600">Medium</div><div className="text-2xl font-bold text-yellow-600">{ALERT_NOTIFICATIONS.filter(a => a.severity === "medium").length}</div></div>
        <div className="border rounded-lg p-4 bg-white"><div className="text-xs text-slate-500">Unread</div><div className="text-2xl font-bold text-indigo-600">{ALERT_NOTIFICATIONS.filter(a => !a.read).length}</div></div>
      </div>
      <div className="space-y-3">
        {filtered.map(a => (
          <div key={a.id} className={`border rounded-lg p-4 bg-white ${!a.read ? "border-l-4 border-l-indigo-500" : ""} ${a.severity === "critical" ? "bg-red-50 border-red-200" : ""}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge(a.severity)}`}>{a.severity}</span>
                <span className="text-xs text-slate-500">{a.type.replace(/_/g, " ")}</span>
              </div>
              <div className="flex items-center gap-2">
                {a.actionRequired && <span className="text-xs text-orange-600 font-medium">Action Required</span>}
                <span className="text-xs text-slate-400">{a.createdAt}</span>
              </div>
            </div>
            <div className="text-sm font-semibold text-slate-800 mb-1">{a.title}</div>
            <p className="text-sm text-slate-600">{a.message}</p>
            <div className="text-xs text-slate-400 mt-2">Source: {a.source}</div>
            <div className="flex items-center gap-2 mt-3">
              {!a.acknowledged && <button className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700">Acknowledge</button>}
              {a.actionRequired && <button className="px-3 py-1.5 border rounded-lg text-xs font-medium hover:bg-slate-50">Take Action</button>}
              {!a.read && <button className="px-3 py-1.5 border rounded-lg text-xs font-medium hover:bg-slate-50">Mark Read</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 16 Configuration ──
function ConfigScreen() {
  const categories = [...new Set(AI_CONFIG.map(c => c.category))];
  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold text-slate-900">Configuration</h2><p className="text-sm text-slate-500 mt-1">AI platform configuration, thresholds, and feature management</p></div>
      {categories.map(cat => (
        <div key={cat} className="border rounded-lg p-4 bg-white">
          <SectionHeader title={cat} />
          <div className="space-y-3">
            {AI_CONFIG.filter(c => c.category === cat).map(c => (
              <div key={c.id} className="flex items-center gap-4 py-3 border-b border-slate-100 last:border-0">
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-800">{c.label}</div>
                  <div className="text-xs text-slate-500">{c.description}</div>
                </div>
                <div className="w-48">
                  {c.type === "toggle" ? (
                    <div className={`w-12 h-6 rounded-full relative cursor-pointer ${c.value === "true" ? "bg-emerald-500" : "bg-slate-300"}`}>
                      <div className={`w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition-all ${c.value === "true" ? "left-6" : "left-0.5"}`} />
                    </div>
                  ) : c.type === "select" ? (
                    <select className="w-full border rounded px-3 py-1.5 text-sm" defaultValue={c.value}>
                      {c.options?.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : c.type === "number" ? (
                    <input type="number" className="w-full border rounded px-3 py-1.5 text-sm" defaultValue={c.value} />
                  ) : (
                    <input type="text" className="w-full border rounded px-3 py-1.5 text-sm" defaultValue={c.value} />
                  )}
                </div>
                <div className="text-xs text-slate-400 w-32 text-right">Updated: {c.lastUpdated}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── 17 Audit & Compliance ──
function AuditScreen() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold text-slate-900">Audit & Compliance</h2><p className="text-sm text-slate-500 mt-1">Complete audit trail of AI predictions, model changes, and user actions</p></div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"><Download className="w-4 h-4" /> Export Audit Log</button>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <div className="border rounded-lg p-4 bg-white"><div className="text-xs text-slate-500">Total Actions</div><div className="text-2xl font-bold text-slate-900">{AI_AUDIT_LOGS.length}</div></div>
        <div className="border rounded-lg p-4 bg-emerald-50 border-emerald-200"><div className="text-xs text-emerald-600">Approvals</div><div className="text-2xl font-bold text-emerald-600">{AI_AUDIT_LOGS.filter(a => a.action === "approved").length}</div></div>
        <div className="border rounded-lg p-4 bg-red-50 border-red-200"><div className="text-xs text-red-600">Rejections</div><div className="text-2xl font-bold text-red-600">{AI_AUDIT_LOGS.filter(a => a.action === "rejected").length}</div></div>
        <div className="border rounded-lg p-4 bg-blue-50 border-blue-200"><div className="text-xs text-blue-600">Deployments</div><div className="text-2xl font-bold text-blue-600">{AI_AUDIT_LOGS.filter(a => a.action === "deployed").length}</div></div>
      </div>
      <div className="border rounded-lg bg-white">
        <div className="p-4 border-b border-slate-200">
          <SectionHeader title="Audit Timeline" subtitle="Immutable record of all AI platform activities" />
        </div>
        <div className="divide-y divide-slate-100">
          {AI_AUDIT_LOGS.map(log => (
            <AuditLogRow key={log.id} timestamp={log.timestamp} user={log.userName} action={log.action} entity={log.entityName} details={log.details} />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="border rounded-lg p-4 bg-white">
          <SectionHeader title="Compliance Summary" />
          <div className="space-y-2">
            {[{ item: "AI predictions logged", count: 842, status: "pass" }, { item: "Model changes tracked", count: 6, status: "pass" }, { item: "Governance approvals", count: 2, status: "pass" }, { item: "Bias assessments completed", count: 3, status: "pass" }, { item: "User actions audited", count: 8, status: "pass" }].map(c => (
              <div key={c.item} className="flex items-center justify-between py-2">
                <span className="text-sm text-slate-700">{c.item}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-800">{c.count}</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="border rounded-lg p-4 bg-white">
          <SectionHeader title="Recent Model Changes" />
          <div className="space-y-2">
            {AI_AUDIT_LOGS.filter(a => a.entityType === "AiModel" || a.entityType === "ModelVersion").map(a => (
              <div key={a.id} className="flex items-start gap-3 py-2 border-b border-slate-100 last:border-0">
                <StatusDot status={a.action} />
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-800">{a.entityName}</div>
                  <div className="text-xs text-slate-500">{a.details}</div>
                  <div className="text-xs text-slate-400">{a.timestamp} by {a.userName}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 18 Workflow Complete ──
function WorkflowScreen({ setScreen }: { setScreen: (s: AiScreen) => void }) {
  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4"><CheckCircle2 className="w-8 h-8 text-emerald-600" /></div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">AI Workflow Complete</h2>
        <p className="text-sm text-slate-500 max-w-lg mx-auto">All AI predictions have been generated, reviewed by humans, incorporated into decision-making, outcomes monitored, model performance evaluated, and governance requirements satisfied.</p>
      </div>
      <div className="grid grid-cols-4 gap-4 max-w-4xl mx-auto">
        {[
          { label: "Predictions Generated", value: "842", icon: <Brain className="w-5 h-5 text-indigo-500" /> },
          { label: "Human Reviews Completed", value: "45", icon: <Users className="w-5 h-5 text-emerald-500" /> },
          { label: "Decisions Recorded", value: "38", icon: <CheckCircle2 className="w-5 h-5 text-blue-500" /> },
          { label: "Audit Trail Complete", value: "100%", icon: <ShieldCheck className="w-5 h-5 text-purple-500" /> },
        ].map(s => (
          <div key={s.label} className="border rounded-lg p-4 bg-white text-center">
            <div className="flex justify-center mb-2">{s.icon}</div>
            <div className="text-2xl font-bold text-slate-900">{s.value}</div>
            <div className="text-xs text-slate-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="max-w-4xl mx-auto space-y-3">
        <SectionHeader title="Workflow Summary" subtitle="Complete AI enterprise workflow steps" />
        {[
          { step: 1, title: "Enterprise Data Collection", desc: "Data collected from EMR, CDSS, Lab, Radiology, Pharmacy, ICU, Emergency, Billing, Inventory, HRMS", status: "completed" },
          { step: 2, title: "Data Validation & Feature Engineering", desc: "47-86 features extracted per model, data quality validated", status: "completed" },
          { step: 3, title: "AI Processing & Prediction Generation", desc: "12 models processed 842 predictions today across clinical, operational, and financial domains", status: "completed" },
          { step: 4, title: "Confidence Scoring & Explainability", desc: "SHAP, LIME, and attention-based explanations generated for all predictions", status: "completed" },
          { step: 5, title: "Human Review & Decision Support", desc: "45 predictions reviewed, 38 accepted, 7 disregarded with documented reasoning", status: "completed" },
          { step: 6, title: "Outcome Tracking & Model Feedback", desc: "6 outcomes recorded, feedback stored for model improvement", status: "completed" },
          { step: 7, title: "Model Performance Evaluation", desc: "All models monitored for accuracy, precision, recall, drift, and bias", status: "completed" },
          { step: 8, title: "Governance & Compliance", desc: "9 models approved, 1 pending revision, complete audit trail maintained", status: "completed" },
        ].map(s => (
          <div key={s.step} className="flex items-start gap-4 border rounded-lg p-4 bg-white">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0"><CheckCircle2 className="w-4 h-4 text-emerald-600" /></div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-slate-800">Step {s.step}: {s.title}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.desc}</div>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">{s.status}</span>
          </div>
        ))}
      </div>
      <div className="text-center pt-4">
        <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700" onClick={() => setScreen("dashboard")}>Return to AI Dashboard</button>
      </div>
    </div>
  );
}
