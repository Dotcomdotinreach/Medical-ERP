import { useState } from "react";
import { Shell, type Workspace } from "../his/Shell";
import { CLINICAL_STUDIES, PROTOCOL_VERSIONS, IRB_SUBMISSIONS, INVESTIGATORS, STUDY_PARTICIPANTS, ELIGIBILITY_SCREENINGS, CONSENT_RECORDS, STUDY_VISITS, ECRF_FORMS, SAFETY_EVENTS, IP_ACCOUNTABILITY, MONITORING_VISITS, QUERY_RECORDS, REGULATORY_DOCUMENTS, PROTOCOL_DEVIATIONS, RESEARCH_AUDIT_LOGS, DASHBOARD_KPIS, studyStatusColor, phaseLabel, enrollmentPercentage, enrollmentColor, consentStatusColor, queryStatusColor, safetySeverityColor, monitoringStatusColor } from "./data";
import { StudyCard, ParticipantCard, SafetyCard, QueryCard, MonitoringCard, DocumentCard, TimelineEntry, AlertBanner, SectionHeader, StatusDot } from "./researchUi";
import { Search, Filter, Plus, Download, Eye, CheckCircle2, XCircle, AlertTriangle, Clock, FileText, Users, Shield, FlaskConical, ClipboardCheck, BookOpen, Stethoscope, Calendar, Database, MessageSquare, Bell, Settings, BarChart3, Lock, ArrowRight, UserPlus } from "lucide-react";

type ResearchScreen = "dashboard" | "portfolio" | "protocol" | "ethics" | "investigators" | "recruitment" | "screening" | "consent" | "visits" | "ecrf" | "safety" | "ip" | "monitoring" | "queries" | "documents" | "reports" | "closeout" | "workflow";

interface ResearchAppProps { roleName: string; onSignOut: () => void; onSwitchWorkspace: (ws: Workspace) => void; onOpenSettings?: (page: string) => void; }

export function ResearchApp({ roleName, onSignOut, onSwitchWorkspace, onOpenSettings }: ResearchAppProps) {
  const [screen, setScreen] = useState<ResearchScreen>("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const nav = [
    { id: "dashboard" as ResearchScreen, label: "Research Dashboard", icon: BarChart3 },
    { id: "portfolio" as ResearchScreen, label: "Trial Portfolio", icon: FlaskConical },
    { id: "protocol" as ResearchScreen, label: "Protocol Management", icon: FileText },
    { id: "ethics" as ResearchScreen, label: "Ethics / IRB Review", icon: Shield },
    { id: "investigators" as ResearchScreen, label: "Investigator Management", icon: Users },
    { id: "recruitment" as ResearchScreen, label: "Participant Recruitment", icon: UserPlus },
    { id: "screening" as ResearchScreen, label: "Eligibility Screening", icon: ClipboardCheck },
    { id: "consent" as ResearchScreen, label: "Electronic Consent", icon: CheckCircle2 },
    { id: "visits" as ResearchScreen, label: "Study Visit Management", icon: Calendar },
    { id: "ecrf" as ResearchScreen, label: "eCRF / EDC", icon: Database },
    { id: "safety" as ResearchScreen, label: "Safety Event Reporting", icon: AlertTriangle },
    { id: "ip" as ResearchScreen, label: "IP Accountability", icon: FlaskConical },
    { id: "monitoring" as ResearchScreen, label: "Study Monitoring", icon: Eye },
    { id: "queries" as ResearchScreen, label: "Query Management", icon: MessageSquare },
    { id: "documents" as ResearchScreen, label: "Regulatory Documents", icon: BookOpen },
    { id: "reports" as ResearchScreen, label: "Reports & Analytics", icon: BarChart3 },
    { id: "closeout" as ResearchScreen, label: "Database Lock & Closeout", icon: Lock },
    { id: "workflow" as ResearchScreen, label: "Workflow Complete", icon: CheckCircle2 },
  ];

  return (
    <Shell
      nav={nav.map(n => ({ id: n.id, label: n.label, icon: n.icon }))}
      navSecondary={[{ id: "workflow", label: "Workflow Complete", icon: CheckCircle2 }]}
      activeId={screen}
      onNavigate={(id) => setScreen(id as ResearchScreen)}
      breadcrumb={["Home", "Research", nav.find(n => n.id === screen)?.label || ""]}
      roleName={roleName}
      onSignOut={onSignOut}
      workspace="research"
      sectionLabel="Research"
      onSwitchWorkspace={onSwitchWorkspace}
      onOpenSettings={onOpenSettings}
    >
      <div className="space-y-6">
        {screen === "dashboard" && <DashboardScreen setScreen={setScreen} />}
        {screen === "portfolio" && <PortfolioScreen />}
        {screen === "protocol" && <ProtocolScreen />}
        {screen === "ethics" && <EthicsScreen />}
        {screen === "investigators" && <InvestigatorsScreen />}
        {screen === "recruitment" && <RecruitmentScreen />}
        {screen === "screening" && <ScreeningScreen />}
        {screen === "consent" && <ConsentScreen />}
        {screen === "visits" && <VisitsScreen />}
        {screen === "ecrf" && <ECRFScreen />}
        {screen === "safety" && <SafetyScreen />}
        {screen === "ip" && <IPScreen />}
        {screen === "monitoring" && <MonitoringScreen />}
        {screen === "queries" && <QueriesScreen />}
        {screen === "documents" && <DocumentsScreen />}
        {screen === "reports" && <ReportsScreen />}
        {screen === "closeout" && <CloseoutScreen />}
        {screen === "workflow" && <WorkflowScreen setScreen={setScreen} />}
      </div>
    </Shell>
  );
}

// ── 01 Research Dashboard ──
function DashboardScreen({ setScreen }: { setScreen: (s: ResearchScreen) => void }) {
  const [searchQuery, setSearchQuery] = useState("");
  const k = DASHBOARD_KPIS;
  const recentActivities = RESEARCH_AUDIT_LOGS.slice(0, 6);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold text-slate-900">Research Dashboard</h2><p className="text-sm text-slate-500 mt-1">Clinical trial operations overview and management</p></div>
        <div className="flex items-center gap-3">
          <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input className="pl-9 pr-4 py-2 border rounded-lg text-sm w-64" placeholder="Search studies, participants..." value={searchQuery} onChange={() => {}} /></div>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"><Plus className="w-4 h-4" /> New Study</button>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <div className="border rounded-lg p-4 bg-gradient-to-br from-indigo-50 to-white"><div className="flex items-center gap-2 mb-2"><FlaskConical className="w-5 h-5 text-indigo-600" /><span className="text-sm font-medium text-slate-700">Active Studies</span></div><div className="text-3xl font-bold text-slate-900">{k.activeStudies}</div></div>
        <div className="border rounded-lg p-4 bg-gradient-to-br from-emerald-50 to-white"><div className="flex items-center gap-2 mb-2"><Users className="w-5 h-5 text-emerald-600" /><span className="text-sm font-medium text-slate-700">Participants</span></div><div className="text-3xl font-bold text-slate-900">{k.totalParticipants}</div></div>
        <div className="border rounded-lg p-4 bg-gradient-to-br from-yellow-50 to-white"><div className="flex items-center gap-2 mb-2"><MessageSquare className="w-5 h-5 text-yellow-600" /><span className="text-sm font-medium text-slate-700">Open Queries</span></div><div className="text-3xl font-bold text-yellow-600">{k.openQueries}</div></div>
        <div className="border rounded-lg p-4 bg-gradient-to-br from-red-50 to-white"><div className="flex items-center gap-2 mb-2"><AlertTriangle className="w-5 h-5 text-red-600" /><span className="text-sm font-medium text-slate-700">Safety Events</span></div><div className="text-3xl font-bold text-red-600">{k.safetyEvents}</div></div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="border rounded-lg p-4 bg-white"><SectionHeader title="Active Studies" subtitle="Currently enrolling or active trials" /><div className="space-y-3">{CLINICAL_STUDIES.filter(s => s.status === "enrolling" || s.status === "open" || s.status === "active").map(s => (
          <div key={s.id} className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-0 cursor-pointer hover:bg-slate-50" onClick={() => setScreen("portfolio")}>
            <StatusDot status={s.status} /><div className="flex-1"><div className="text-sm font-medium text-slate-800">{s.title.substring(0, 60)}...</div><div className="text-xs text-slate-500">{s.protocolNumber} | {phaseLabel(s.phase)}</div></div>
            <div className="text-right"><div className={`text-sm font-medium ${enrollmentColor(enrollmentPercentage(s.enrollmentCurrent, s.enrollmentTarget))}`}>{s.enrollmentCurrent}/{s.enrollmentTarget}</div><div className="text-xs text-slate-400">{enrollmentPercentage(s.enrollmentCurrent, s.enrollmentTarget)}%</div></div>
          </div>
        ))}</div></div>
        <div className="border rounded-lg p-4 bg-white"><SectionHeader title="Recent Activity" subtitle="Latest research activities" /><div className="space-y-1">{recentActivities.map(a => (
          <TimelineEntry key={a.id} timestamp={a.timestamp} title={`${a.action} ${a.entityType}`} description={`${a.entityName} by ${a.userName}`} />
        ))}</div></div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="border rounded-lg p-4 bg-white"><SectionHeader title="Enrollment Progress" subtitle="Study enrollment targets" /><div className="space-y-3">{CLINICAL_STUDIES.map(s => { const pct = enrollmentPercentage(s.enrollmentCurrent, s.enrollmentTarget); return (
          <div key={s.id}><div className="flex items-center justify-between text-xs mb-1"><span className="text-slate-600">{s.protocolNumber}</span><span className={`font-medium ${enrollmentColor(pct)}`}>{pct}% ({s.enrollmentCurrent}/{s.enrollmentTarget})</span></div><div className="h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-indigo-500 rounded-full" style={{ width: `${pct}%` }} /></div></div>
        )})}</div></div>
        <div className="border rounded-lg p-4 bg-white"><SectionHeader title="Operational KPIs" /><div className="grid grid-cols-2 gap-3">
          <div className="border rounded-lg p-3 text-center"><div className="text-2xl font-bold text-slate-900">{k.pendingApprovals}</div><div className="text-xs text-slate-500">Pending Approvals</div></div>
          <div className="border rounded-lg p-3 text-center"><div className="text-2xl font-bold text-slate-900">{k.upcomingVisits}</div><div className="text-xs text-slate-500">Upcoming Visits</div></div>
          <div className="border rounded-lg p-3 text-center"><div className="text-2xl font-bold text-slate-900">{k.protocolDeviations}</div><div className="text-xs text-slate-500">Deviations</div></div>
          <div className="border rounded-lg p-3 text-center"><div className="text-2xl font-bold text-emerald-600">{k.enrollmentRate}%</div><div className="text-xs text-slate-500">Enrollment Rate</div></div>
        </div></div>
      </div>
    </div>
  );
}

// ── 02 Clinical Trial Portfolio ──
function PortfolioScreen() {
  const [filterPhase, setFilterPhase] = useState("all");
  const filtered = CLINICAL_STUDIES.filter(s => filterPhase === "all" || s.phase === filterPhase);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold text-slate-900">Clinical Trial Portfolio</h2><p className="text-sm text-slate-500 mt-1">Overview of all clinical studies and trials</p></div>
        <div className="flex items-center gap-3">
          <select className="border rounded-lg px-3 py-2 text-sm" value={filterPhase} onChange={(e) => setFilterPhase(e.target.value)}>
            <option value="all">All Phases</option><option value="phase_1">Phase I</option><option value="phase_2">Phase II</option><option value="phase_3">Phase III</option><option value="observational">Observational</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"><Plus className="w-4 h-4" /> New Study</button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {filtered.map(s => <StudyCard key={s.id} protocolNumber={s.protocolNumber} title={s.title} sponsor={s.sponsor} phase={s.phase} status={s.status} piName={s.piName} enrollmentCurrent={s.enrollmentCurrent} enrollmentTarget={s.enrollmentTarget} sites={s.sites} />)}
      </div>
    </div>
  );
}

// ── 03 Protocol Management ──
function ProtocolScreen() {
  const [selectedStudy, setSelectedStudy] = useState(CLINICAL_STUDIES[0].id);
  const study = CLINICAL_STUDIES.find(s => s.id === selectedStudy)!;
  const versions = PROTOCOL_VERSIONS.filter(v => v.studyId === selectedStudy);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold text-slate-900">Protocol Management</h2><p className="text-sm text-slate-500 mt-1">Protocol authoring, versioning, and amendment tracking</p></div>
        <select className="border rounded-lg px-3 py-2 text-sm" value={selectedStudy} onChange={(e) => setSelectedStudy(e.target.value)}>
          {CLINICAL_STUDIES.map(s => <option key={s.id} value={s.id}>{s.protocolNumber} - {s.title.substring(0, 40)}</option>)}
        </select>
      </div>
      <div className="border rounded-lg p-5 bg-white space-y-4">
        <div className="flex items-center justify-between"><div><div className="text-lg font-semibold text-slate-900">{study.title}</div><div className="text-sm text-slate-500">{study.protocolNumber} | {study.sponsor}</div></div><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${studyStatusColor(study.status)}`}>{study.status.replace(/_/g, " ")}</span></div>
        <div className="grid grid-cols-3 gap-4 text-sm"><div><span className="text-slate-500">Phase:</span> <span className="font-medium">{phaseLabel(study.phase)}</span></div><div><span className="text-slate-500">PI:</span> <span className="font-medium">{study.piName}</span></div><div><span className="text-slate-500">Amendments:</span> <span className="font-medium">{study.amendmentCount}</span></div></div>
        <div className="bg-indigo-50 rounded-lg p-4"><div className="text-sm font-medium text-indigo-800 mb-1">Study Description</div><p className="text-xs text-indigo-700">{study.description}</p></div>
      </div>
      <div className="border rounded-lg bg-white">
        <div className="p-4 border-b border-slate-200"><SectionHeader title="Protocol Versions" subtitle="Version control and amendment history" /></div>
        <div className="divide-y divide-slate-100">{versions.map(v => (
          <div key={v.id} className="flex items-center gap-4 p-4 hover:bg-slate-50">
            <StatusDot status={v.status} /><div className="flex-1"><div className="text-sm font-medium text-slate-800">Version {v.version} <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${v.status === "approved" ? "bg-emerald-100 text-emerald-700" : v.status === "submitted" ? "bg-yellow-100 text-yellow-700" : "bg-slate-100 text-slate-600"}`}>{v.status}</span></div><div className="text-xs text-slate-500 mt-0.5">{v.changes}</div><div className="text-xs text-slate-400 mt-0.5">Effective: {v.effectiveDate} {v.reconsentRequired && <span className="text-orange-600 font-medium">| Re-consent required</span>}</div></div>
            <div className="text-right"><div className="text-xs text-slate-400">{v.approvedBy || "Pending"}</div></div>
          </div>
        ))}</div>
      </div>
    </div>
  );
}

// ── 04 Ethics / IRB Review ──
function EthicsScreen() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold text-slate-900">Ethics / IRB Review</h2><p className="text-sm text-slate-500 mt-1">Ethics committee submissions, approvals, and compliance</p></div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"><Plus className="w-4 h-4" /> New Submission</button>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <div className="border rounded-lg p-4 bg-emerald-50 border-emerald-200"><div className="text-xs text-emerald-600">Approved</div><div className="text-2xl font-bold text-emerald-600">{IRB_SUBMISSIONS.filter(i => i.status === "approved").length}</div></div>
        <div className="border rounded-lg p-4 bg-yellow-50 border-yellow-200"><div className="text-xs text-yellow-600">Pending</div><div className="text-2xl font-bold text-yellow-600">{IRB_SUBMISSIONS.filter(i => i.status === "pending").length}</div></div>
        <div className="border rounded-lg p-4 bg-white"><div className="text-xs text-slate-500">Total Submissions</div><div className="text-2xl font-bold text-slate-900">{IRB_SUBMISSIONS.length}</div></div>
        <div className="border rounded-lg p-4 bg-white"><div className="text-xs text-slate-500">Expiring Soon</div><div className="text-2xl font-bold text-orange-600">{IRB_SUBMISSIONS.filter(i => i.approvalExpiry && i.approvalExpiry < "2027-01-01").length}</div></div>
      </div>
      <div className="space-y-3">{IRB_SUBMISSIONS.map(irb => {
        const study = CLINICAL_STUDIES.find(s => s.id === irb.studyId);
        return (
          <div key={irb.id} className={`border rounded-lg p-4 bg-white ${irb.status === "pending" ? "border-l-4 border-l-yellow-400" : irb.status === "approved" ? "border-l-4 border-l-emerald-400" : ""}`}>
            <div className="flex items-center justify-between mb-2">
              <div><div className="text-sm font-semibold text-slate-800">{irb.committeeName}</div><div className="text-xs text-slate-500">{study?.protocolNumber} | Protocol v{irb.protocolVersion}</div></div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${irb.status === "approved" ? "bg-emerald-100 text-emerald-700" : irb.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-slate-100 text-slate-600"}`}>{irb.status}</span>
            </div>
            <div className="grid grid-cols-4 gap-3 text-xs text-slate-500">
              <div>Submitted: {irb.submissionDate}</div><div>Meeting: {irb.meetingDate || "TBD"}</div><div>Decision: {irb.decision || "Pending"}</div><div>Expiry: {irb.approvalExpiry || "N/A"}</div>
            </div>
            {irb.conditions.length > 0 && <div className="mt-2 bg-yellow-50 rounded p-2 border border-yellow-200"><div className="text-xs font-medium text-yellow-800">Conditions:</div>{irb.conditions.map((c, i) => <div key={i} className="text-xs text-yellow-700">- {c}</div>)}</div>}
            <div className="text-xs text-slate-400 mt-2">Documents: {irb.documents.join(", ")}</div>
          </div>
        );
      })}</div>
    </div>
  );
}

// ── 05 Investigator Management ──
function InvestigatorsScreen() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold text-slate-900">Investigator Management</h2><p className="text-sm text-slate-500 mt-1">Research team credentials, training, and delegation tracking</p></div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"><Plus className="w-4 h-4" /> Add Investigator</button>
      </div>
      <div className="grid grid-cols-3 gap-4">{INVESTIGATORS.map(inv => (
        <div key={inv.id} className="border rounded-lg p-4 bg-white">
          <div className="flex items-center justify-between mb-2">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${inv.role === "PI" ? "bg-indigo-100 text-indigo-700" : inv.role === "Sub-I" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"}`}>{inv.role}</span>
            {inv.trainingComplete ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <AlertTriangle className="w-4 h-4 text-yellow-500" />}
          </div>
          <div className="text-sm font-semibold text-slate-800 mb-1">{inv.name}</div>
          <div className="text-xs text-slate-500 mb-2">{inv.qualification}</div>
          <div className="text-xs text-slate-500 mb-2">{inv.siteName}</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div><span className="text-slate-500">GCP Cert:</span> <span className="font-medium">{inv.gcpCertDate}</span></div>
            <div><span className="text-slate-500">Expires:</span> <span className={`font-medium ${inv.gcpExpiry < "2027-01-01" ? "text-orange-600" : ""}`}>{inv.gcpExpiry}</span></div>
            <div><span className="text-slate-500">Experience:</span> <span className="font-medium">{inv.experience}y</span></div>
            <div><span className="text-slate-500">Active Studies:</span> <span className="font-medium">{inv.studiesActive}</span></div>
          </div>
          <div className="mt-2 text-xs text-slate-500">Delegated: {inv.delegatedTasks.join(", ")}</div>
        </div>
      ))}</div>
    </div>
  );
}

// ── 06 Participant Recruitment ──
function RecruitmentScreen() {
  const funnel = [
    { stage: "Pre-screened", count: 28, color: "bg-slate-400" },
    { stage: "Screened", count: 22, color: "bg-blue-400" },
    { stage: "Eligible", count: 18, color: "bg-indigo-400" },
    { stage: "Consented", count: 16, color: "bg-purple-400" },
    { stage: "Randomized", count: 14, color: "bg-emerald-400" },
    { stage: "Active", count: 12, color: "bg-emerald-500" },
  ];
  const maxCount = Math.max(...funnel.map(f => f.count));
  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold text-slate-900">Participant Recruitment</h2><p className="text-sm text-slate-500 mt-1">Recruitment funnel, metrics, and diversity tracking</p></div>
      <div className="grid grid-cols-4 gap-4">
        <div className="border rounded-lg p-4 bg-white"><div className="text-xs text-slate-500">Total Enrolled</div><div className="text-2xl font-bold text-slate-900">{STUDY_PARTICIPANTS.filter(p => p.status !== "screening").length}</div></div>
        <div className="border rounded-lg p-4 bg-white"><div className="text-xs text-slate-500">Currently Active</div><div className="text-2xl font-bold text-emerald-600">{STUDY_PARTICIPANTS.filter(p => p.status === "active").length}</div></div>
        <div className="border rounded-lg p-4 bg-white"><div className="text-xs text-slate-500">Withdrawn</div><div className="text-2xl font-bold text-red-600">{STUDY_PARTICIPANTS.filter(p => p.status === "withdrawn").length}</div></div>
        <div className="border rounded-lg p-4 bg-white"><div className="text-xs text-slate-500">Enrollment Rate</div><div className="text-2xl font-bold text-indigo-600">73.5%</div></div>
      </div>
      <div className="border rounded-lg p-5 bg-white">
        <SectionHeader title="Recruitment Funnel" subtitle="Participant flow from screening to enrollment" />
        <div className="space-y-3">{funnel.map(f => (
          <div key={f.stage} className="flex items-center gap-4">
            <span className="w-28 text-xs text-slate-600 text-right">{f.stage}</span>
            <div className="flex-1 h-8 bg-slate-100 rounded-lg overflow-hidden relative">
              <div className={`h-full ${f.color} rounded-lg flex items-center px-3`} style={{ width: `${(f.count / maxCount) * 100}%` }}>
                <span className="text-xs font-bold text-white">{f.count}</span>
              </div>
            </div>
          </div>
        ))}</div>
      </div>
      <div className="border rounded-lg p-4 bg-white">
        <SectionHeader title="Recent Enrollments" />
        <div className="space-y-2">{STUDY_PARTICIPANTS.filter(p => p.status !== "withdrawn").slice(0, 5).map(p => (
          <div key={p.id} className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-0">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700">{p.initials}</div>
            <div className="flex-1"><div className="text-sm font-medium text-slate-800">{p.subjectId}</div><div className="text-xs text-slate-500">{p.studyName}</div></div>
            <div className="text-right"><div className="text-xs text-slate-500">Enrolled: {p.enrollmentDate}</div><div className={`text-xs font-medium ${p.status === "active" ? "text-emerald-600" : "text-slate-500"}`}>{p.status}</div></div>
          </div>
        ))}</div>
      </div>
    </div>
  );
}

// ── 07 Eligibility Screening ──
function ScreeningScreen() {
  const [selectedScreening, setSelectedScreening] = useState(ELIGIBILITY_SCREENINGS[0].id);
  const screening = ELIGIBILITY_SCREENINGS.find(e => e.id === selectedScreening)!;
  const participant = STUDY_PARTICIPANTS.find(p => p.id === screening.participantId);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold text-slate-900">Eligibility Screening</h2><p className="text-sm text-slate-500 mt-1">Inclusion/exclusion validation and screening workflow</p></div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-3">
          {ELIGIBILITY_SCREENINGS.map(el => {
            const p = STUDY_PARTICIPANTS.find(pt => pt.id === el.participantId);
            return (
              <div key={el.id} className={`border rounded-lg p-4 bg-white cursor-pointer hover:border-indigo-300 ${selectedScreening === el.id ? "border-indigo-500 ring-2 ring-indigo-100" : ""}`} onClick={() => setSelectedScreening(el.id)}>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-semibold text-slate-800">{p?.subjectId} ({p?.initials})</div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${el.eligibilityDecision === "eligible" ? "bg-emerald-100 text-emerald-700" : el.eligibilityDecision === "ineligible" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>{el.eligibilityDecision}</span>
                </div>
                <div className="text-xs text-slate-500">Screened: {el.screenedAt} by {el.screenedBy}</div>
              </div>
            );
          })}
        </div>
        <div className="border rounded-lg p-5 bg-white space-y-4 sticky top-4">
          <h3 className="text-lg font-semibold text-slate-900">Screening Details</h3>
          <div className="grid grid-cols-2 gap-3 text-sm"><div><span className="text-slate-500">Subject:</span> <span className="font-medium">{participant?.subjectId}</span></div><div><span className="text-slate-500">Decision:</span> <span className={`font-medium ${screening.eligibilityDecision === "eligible" ? "text-emerald-600" : "text-red-600"}`}>{screening.eligibilityDecision}</span></div></div>
          <div><div className="text-sm font-medium text-slate-700 mb-2">Inclusion Criteria</div><div className="space-y-2">{screening.inclusionCriteria.map((c, i) => (
            <div key={i} className="flex items-start gap-2 text-xs">{c.met ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> : <XCircle className="w-4 h-4 text-red-500 shrink-0" />}<div><span className={c.met ? "text-slate-700" : "text-red-600 font-medium"}>{c.criterion}</span><div className="text-slate-400">{c.evidence}</div></div></div>
          ))}</div></div>
          <div><div className="text-sm font-medium text-slate-700 mb-2">Exclusion Criteria</div><div className="space-y-2">{screening.exclusionCriteria.map((c, i) => (
            <div key={i} className="flex items-start gap-2 text-xs">{!c.met ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> : <XCircle className="w-4 h-4 text-red-500 shrink-0" />}<div><span className={!c.met ? "text-slate-700" : "text-red-600 font-medium"}>{c.criterion}</span><div className="text-slate-400">{c.evidence}</div></div></div>
          ))}</div></div>
          <div><div className="text-sm font-medium text-slate-700 mb-2">Lab Results</div><div className="space-y-1">{screening.labResults.map((l, i) => (
            <div key={i} className="flex items-center justify-between text-xs"><span className="text-slate-600">{l.test}</span><span className={`font-medium ${l.status === "abnormal" ? "text-orange-600" : l.status === "critical" ? "text-red-600" : "text-slate-700"}`}>{l.value} {l.unit} ({l.normal})</span></div>
          ))}</div></div>
        </div>
      </div>
    </div>
  );
}

// ── 08 Electronic Consent ──
function ConsentScreen() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold text-slate-900">Electronic Consent (eConsent)</h2><p className="text-sm text-slate-500 mt-1">Consent management, versioning, and audit tracking</p></div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <div className="border rounded-lg p-4 bg-emerald-50 border-emerald-200"><div className="text-xs text-emerald-600">Signed</div><div className="text-2xl font-bold text-emerald-600">{CONSENT_RECORDS.filter(c => c.status === "signed").length}</div></div>
        <div className="border rounded-lg p-4 bg-orange-50 border-orange-200"><div className="text-xs text-orange-600">Re-consent Required</div><div className="text-2xl font-bold text-orange-600">{CONSENT_RECORDS.filter(c => c.status === "reconsent_required").length}</div></div>
        <div className="border rounded-lg p-4 bg-red-50 border-red-200"><div className="text-xs text-red-600">Withdrawn</div><div className="text-2xl font-bold text-red-600">{CONSENT_RECORDS.filter(c => c.status === "withdrawn").length}</div></div>
        <div className="border rounded-lg p-4 bg-white"><div className="text-xs text-slate-500">Multimedia Viewed</div><div className="text-2xl font-bold text-indigo-600">{CONSENT_RECORDS.filter(c => c.multimediaViewed).length}/{CONSENT_RECORDS.length}</div></div>
      </div>
      <div className="space-y-3">{CONSENT_RECORDS.map(con => {
        const p = STUDY_PARTICIPANTS.find(pt => pt.id === con.participantId);
        const study = CLINICAL_STUDIES.find(s => s.id === con.studyId);
        return (
          <div key={con.id} className={`border rounded-lg p-4 bg-white ${con.status === "withdrawn" ? "border-red-200 bg-red-50" : ""}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-700">{p?.initials}</div>
                <div><div className="text-sm font-semibold text-slate-800">{p?.subjectId}</div><div className="text-xs text-slate-500">{study?.protocolNumber} | Consent v{con.version}</div></div>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${consentStatusColor(con.status)}`}>{con.status.replace(/_/g, " ")}</span>
            </div>
            <div className="grid grid-cols-4 gap-3 text-xs text-slate-500">
              <div>Type: {con.consentType}</div><div>Date: {con.consentDate}</div><div>Witness: {con.witnessName}</div><div>Multimedia: {con.multimediaViewed ? "Yes" : "No"}</div>
            </div>
            {con.questionsAsked.length > 0 && <div className="mt-2 text-xs text-slate-500">Questions: {con.questionsAsked.join("; ")}</div>}
            {con.withdrawalDate && <div className="mt-2 bg-red-50 rounded p-2 border border-red-200 text-xs text-red-700">Withdrawn: {con.withdrawalDate} - {con.withdrawalReason}</div>}
          </div>
        );
      })}</div>
    </div>
  );
}

// ── 09 Study Visit Management ──
function VisitsScreen() {
  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold text-slate-900">Study Visit Management</h2><p className="text-sm text-slate-500 mt-1">Visit scheduling, windows, and completion tracking</p></div>
      <div className="grid grid-cols-4 gap-4">
        <div className="border rounded-lg p-4 bg-white"><div className="text-xs text-slate-500">Total Visits</div><div className="text-2xl font-bold text-slate-900">{STUDY_VISITS.length}</div></div>
        <div className="border rounded-lg p-4 bg-emerald-50 border-emerald-200"><div className="text-xs text-emerald-600">Completed</div><div className="text-2xl font-bold text-emerald-600">{STUDY_VISITS.filter(v => v.status === "completed").length}</div></div>
        <div className="border rounded-lg p-4 bg-yellow-50 border-yellow-200"><div className="text-xs text-yellow-600">Scheduled</div><div className="text-2xl font-bold text-yellow-600">{STUDY_VISITS.filter(v => v.status === "scheduled").length}</div></div>
        <div className="border rounded-lg p-4 bg-white"><div className="text-xs text-slate-500">Missed</div><div className="text-2xl font-bold text-red-600">{STUDY_VISITS.filter(v => v.status === "missed").length}</div></div>
      </div>
      <div className="space-y-3">{STUDY_VISITS.map(v => {
        const p = STUDY_PARTICIPANTS.find(pt => pt.id === v.participantId);
        return (
          <div key={v.id} className={`border rounded-lg p-4 bg-white ${v.status === "completed" ? "border-l-4 border-l-emerald-400" : v.status === "scheduled" ? "border-l-4 border-l-yellow-400" : "border-l-4 border-l-red-400"}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-700">{p?.initials}</div>
                <div><div className="text-sm font-semibold text-slate-800">Visit {v.visitNumber}: {v.visitName}</div><div className="text-xs text-slate-500">{p?.subjectId} | {p?.studyName}</div></div>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${v.status === "completed" ? "bg-emerald-100 text-emerald-700" : v.status === "scheduled" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>{v.status}</span>
            </div>
            <div className="grid grid-cols-3 gap-3 text-xs text-slate-500">
              <div>Scheduled: {v.scheduledDate}</div><div>Window: {v.windowStart} to {v.windowEnd}</div><div>Actual: {v.actualDate || "Pending"}</div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-3">
              <div><div className="text-xs font-medium text-slate-600 mb-1">Procedures</div><div className="space-y-0.5">{v.procedures.map((pr, i) => <div key={i} className="text-xs text-slate-500">- {pr}</div>)}</div></div>
              <div><div className="text-xs font-medium text-slate-600 mb-1">Lab Orders</div><div className="space-y-0.5">{v.labOrders.map((l, i) => <div key={i} className="text-xs text-slate-500">- {l}</div>)}</div></div>
              <div><div className="text-xs font-medium text-slate-600 mb-1">Assessments</div><div className="space-y-0.5">{v.assessments.map((a, i) => <div key={i} className="text-xs text-slate-500">- {a}</div>)}</div></div>
            </div>
            {v.notes && <div className="mt-2 text-xs text-slate-400">Notes: {v.notes}</div>}
          </div>
        );
      })}</div>
    </div>
  );
}

// ── 10 eCRF / EDC ──
function ECRFScreen() {
  const [selectedCRF, setSelectedCRF] = useState(ECRF_FORMS[0].id);
  const crf = ECRF_FORMS.find(f => f.id === selectedCRF)!;
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold text-slate-900">Electronic Case Report Forms (eCRF)</h2><p className="text-sm text-slate-500 mt-1">Electronic data capture with validation and edit checks</p></div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="border rounded-lg p-4 bg-white"><div className="text-xs text-slate-500">Total Forms</div><div className="text-2xl font-bold text-slate-900">{ECRF_FORMS.length}</div></div>
        <div className="border rounded-lg p-4 bg-emerald-50 border-emerald-200"><div className="text-xs text-emerald-600">Completed</div><div className="text-2xl font-bold text-emerald-600">{ECRF_FORMS.filter(f => f.formStatus === "completed").length}</div></div>
        <div className="border rounded-lg p-4 bg-white"><div className="text-xs text-slate-500">Open Queries</div><div className="text-2xl font-bold text-yellow-600">{ECRF_FORMS.reduce((s, f) => s + f.queryCount, 0)}</div></div>
      </div>
      <div className="grid grid-cols-3 gap-6">
        <div className="space-y-3">
          {ECRF_FORMS.map(f => {
            const p = STUDY_PARTICIPANTS.find(pt => pt.id === f.participantId);
            return (
              <div key={f.id} className={`border rounded-lg p-4 bg-white cursor-pointer hover:border-indigo-300 ${selectedCRF === f.id ? "border-indigo-500 ring-2 ring-indigo-100" : ""}`} onClick={() => setSelectedCRF(f.id)}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-slate-800">{p?.subjectId}</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${f.formStatus === "completed" ? "bg-emerald-100 text-emerald-700" : f.formStatus === "queried" ? "bg-yellow-100 text-yellow-700" : "bg-slate-100 text-slate-600"}`}>{f.formStatus}</span>
                </div>
                <div className="text-xs text-slate-500">{f.formName}</div>
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                  {f.queryCount > 0 && <span className="text-yellow-600">{f.queryCount} queries</span>}
                  {f.lockedBy && <span className="text-emerald-600">Locked</span>}
                </div>
              </div>
            );
          })}
        </div>
        <div className="col-span-2 border rounded-lg p-5 bg-white space-y-4 sticky top-4">
          <h3 className="text-lg font-semibold text-slate-900">{crf.formName}</h3>
          <div className="grid grid-cols-2 gap-3 text-sm"><div><span className="text-slate-500">Subject:</span> <span className="font-medium">{crf.participantId}</span></div><div><span className="text-slate-500">Status:</span> <span className={`font-medium ${crf.formStatus === "completed" ? "text-emerald-600" : "text-yellow-600"}`}>{crf.formStatus}</span></div><div><span className="text-slate-500">Completed:</span> <span className="font-medium">{crf.completionDate || "Pending"}</span></div><div><span className="text-slate-500">By:</span> <span className="font-medium">{crf.completedBy || "N/A"}</span></div></div>
          <div><div className="text-sm font-medium text-slate-700 mb-2">Form Data</div><div className="space-y-2">{crf.data.map((d, i) => (
            <div key={i} className={`flex items-center justify-between py-2 px-3 rounded ${d.status === "query" ? "bg-yellow-50 border border-yellow-200" : "bg-slate-50"}`}>
              <span className="text-xs text-slate-600">{d.field}</span>
              <span className={`text-sm font-medium ${d.status === "query" ? "text-yellow-700" : "text-slate-800"}`}>{d.value}{d.status === "query" && <span className="ml-2 text-xs text-yellow-600">(query)</span>}</span>
            </div>
          ))}</div></div>
          <div className="text-xs text-slate-400">Locked by: {crf.lockedBy || "Not locked"} {crf.lockedAt && `at ${crf.lockedAt}`}</div>
        </div>
      </div>
    </div>
  );
}

// ── 11 Safety Event Reporting ──
function SafetyScreen() {
  const [filterType, setFilterType] = useState("all");
  const filtered = SAFETY_EVENTS.filter(e => filterType === "all" || e.eventType === filterType);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold text-slate-900">Safety Event Reporting</h2><p className="text-sm text-slate-500 mt-1">Adverse events, SAEs, SUSAR reporting and tracking</p></div>
        <div className="flex items-center gap-3">
          <select className="border rounded-lg px-3 py-2 text-sm" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="all">All Events</option><option value="AE">AE</option><option value="SAE">SAE</option><option value="SUSAR">SUSAR</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"><Plus className="w-4 h-4" /> Report SAE</button>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <div className="border rounded-lg p-4 bg-white"><div className="text-xs text-slate-500">Total Events</div><div className="text-2xl font-bold text-slate-900">{SAFETY_EVENTS.length}</div></div>
        <div className="border rounded-lg p-4 bg-orange-50 border-orange-200"><div className="text-xs text-orange-600">AEs</div><div className="text-2xl font-bold text-orange-600">{SAFETY_EVENTS.filter(e => e.eventType === "AE").length}</div></div>
        <div className="border rounded-lg p-4 bg-red-50 border-red-200"><div className="text-xs text-red-600">SAEs</div><div className="text-2xl font-bold text-red-600">{SAFETY_EVENTS.filter(e => e.eventType === "SAE").length}</div></div>
        <div className="border rounded-lg p-4 bg-white"><div className="text-xs text-slate-500">Reported to Regulatory</div><div className="text-2xl font-bold text-indigo-600">{SAFETY_EVENTS.filter(e => e.reportedToRegulatory).length}</div></div>
      </div>
      <div className="space-y-3">{filtered.map(e => <SafetyCard key={e.id} eventType={e.eventType} description={e.description} severity={e.severity} causality={e.causality} participantId={e.participantId} studyName={e.studyName} onsetDate={e.onsetDate} outcome={e.outcome} />)}</div>
    </div>
  );
}

// ── 12 IP Accountability ──
function IPScreen() {
  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold text-slate-900">Investigational Product Accountability</h2><p className="text-sm text-slate-500 mt-1">Drug inventory, dispensing, returns, and cold chain monitoring</p></div>
      <div className="space-y-4">{IP_ACCOUNTABILITY.map(ip => {
        const study = CLINICAL_STUDIES.find(s => s.id === ip.studyId);
        return (
          <div key={ip.id} className="border rounded-lg p-5 bg-white space-y-4">
            <div className="flex items-center justify-between"><div><div className="text-lg font-semibold text-slate-900">{ip.drugName}</div><div className="text-sm text-slate-500">{study?.protocolNumber} | Batch: {ip.batchNumber}</div></div><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">Active</span></div>
            <div className="grid grid-cols-5 gap-3">
              <div className="border rounded-lg p-3 text-center"><div className="text-lg font-bold text-slate-900">{ip.receivedQuantity}</div><div className="text-xs text-slate-500">Received</div></div>
              <div className="border rounded-lg p-3 text-center"><div className="text-lg font-bold text-blue-600">{ip.dispensedQuantity}</div><div className="text-xs text-slate-500">Dispensed</div></div>
              <div className="border rounded-lg p-3 text-center"><div className="text-lg font-bold text-yellow-600">{ip.returnedQuantity}</div><div className="text-xs text-slate-500">Returned</div></div>
              <div className="border rounded-lg p-3 text-center"><div className="text-lg font-bold text-red-600">{ip.destroyedQuantity}</div><div className="text-xs text-slate-500">Destroyed</div></div>
              <div className="border rounded-lg p-3 text-center"><div className="text-lg font-bold text-emerald-600">{ip.currentInventory}</div><div className="text-xs text-slate-500">Inventory</div></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><div className="text-sm font-medium text-slate-700 mb-2">Storage Conditions</div><div className="text-xs text-slate-500">Condition: {ip.storageCondition}</div><div className="text-xs text-slate-500">Current Temp: {ip.temperature}</div><div className="text-xs text-slate-500">Expiry: {ip.expiryDate}</div></div>
              <div><div className="text-sm font-medium text-slate-700 mb-2">Temperature Log</div><div className="space-y-1">{ip.temperatureLog.map((t, i) => (
                <div key={i} className="flex items-center gap-2 text-xs"><span className="text-slate-500">{t.date}</span><span className={`font-medium ${t.status === "normal" ? "text-emerald-600" : "text-red-600"}`}>{t.temperature}</span><span className={`text-xs ${t.status === "normal" ? "text-emerald-600" : "text-red-600"}`}>{t.status}</span></div>
              ))}</div></div>
            </div>
            <div><div className="text-sm font-medium text-slate-700 mb-2">Dispensing Log</div><div className="space-y-1">{ip.dispensingLog.map((d, i) => (
              <div key={i} className="flex items-center gap-3 text-xs py-1 border-b border-slate-100 last:border-0"><span className="text-slate-500">{d.date}</span><span className="font-medium text-slate-700">{d.participantId}</span><span className="text-slate-500">Qty: {d.quantity}</span><span className="text-slate-400">By: {d.dispensedBy}</span></div>
            ))}</div></div>
          </div>
        );
      })}</div>
    </div>
  );
}

// ── 13 Study Monitoring ──
function MonitoringScreen() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold text-slate-900">Study Monitoring</h2><p className="text-sm text-slate-500 mt-1">Monitoring visits, SDV, and risk-based monitoring</p></div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"><Plus className="w-4 h-4" /> Schedule Visit</button>
      </div>
      <div className="space-y-3">{MONITORING_VISITS.map(m => {
        const study = CLINICAL_STUDIES.find(s => s.id === m.studyId);
        return (
          <div key={m.id} className="border rounded-lg p-4 bg-white">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3"><StatusDot status={m.status} /><div><div className="text-sm font-semibold text-slate-800">{m.visitType} Visit</div><div className="text-xs text-slate-500">{study?.protocolNumber} | {m.monitorName} ({m.monitorRole})</div></div></div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${m.status === "completed" ? "bg-emerald-100 text-emerald-700" : "bg-yellow-100 text-yellow-700"}`}>{m.status.replace(/_/g, " ")}</span>
            </div>
            <div className="grid grid-cols-4 gap-3 text-xs text-slate-500 mb-3"><div>Date: {m.visitDate}</div><div>SDV: {m.sdvPerformed}/{m.sdvTotal}</div><div className={`font-medium ${m.riskScore === "high" ? "text-red-600" : m.riskScore === "medium" ? "text-yellow-600" : "text-emerald-600"}`}>Risk: {m.riskScore}</div><div>Report: {m.reportSubmitted ? "Submitted" : "Pending"}</div></div>
            {m.findings.length > 0 && <div className="mb-2">{m.findings.map((f, i) => <div key={i} className="text-xs text-orange-600 flex items-start gap-1"><span>*</span>{f}</div>)}</div>}
            {m.actionItems.length > 0 && <div className="bg-yellow-50 rounded p-2 border border-yellow-200"><div className="text-xs font-medium text-yellow-800">Action Items:</div>{m.actionItems.map((a, i) => <div key={i} className="text-xs text-yellow-700">- {a}</div>)}</div>}
          </div>
        );
      })}</div>
    </div>
  );
}

// ── 14 Query Management ──
function QueriesScreen() {
  const [filterStatus, setFilterStatus] = useState("all");
  const filtered = QUERY_RECORDS.filter(q => filterStatus === "all" || q.status === filterStatus);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold text-slate-900">Query Management</h2><p className="text-sm text-slate-500 mt-1">Data discrepancies, validation issues, and resolution tracking</p></div>
        <select className="border rounded-lg px-3 py-2 text-sm" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="all">All Status</option><option value="open">Open</option><option value="answered">Answered</option><option value="closed">Closed</option><option value="escalated">Escalated</option>
        </select>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <div className="border rounded-lg p-4 bg-yellow-50 border-yellow-200"><div className="text-xs text-yellow-600">Open</div><div className="text-2xl font-bold text-yellow-600">{QUERY_RECORDS.filter(q => q.status === "open").length}</div></div>
        <div className="border rounded-lg p-4 bg-blue-50 border-blue-200"><div className="text-xs text-blue-600">Answered</div><div className="text-2xl font-bold text-blue-600">{QUERY_RECORDS.filter(q => q.status === "answered").length}</div></div>
        <div className="border rounded-lg p-4 bg-red-50 border-red-200"><div className="text-xs text-red-600">Escalated</div><div className="text-2xl font-bold text-red-600">{QUERY_RECORDS.filter(q => q.status === "escalated").length}</div></div>
        <div className="border rounded-lg p-4 bg-emerald-50 border-emerald-200"><div className="text-xs text-emerald-600">Closed</div><div className="text-2xl font-bold text-emerald-600">{QUERY_RECORDS.filter(q => q.status === "closed").length}</div></div>
      </div>
      <div className="space-y-3">{filtered.map(q => <QueryCard key={q.id} queryText={q.queryText} queryType={q.queryType} status={q.status} participantId={q.participantId} raisedBy={q.raisedBy} raisedDate={q.raisedDate} priority={q.priority} age={q.queryAge} />)}</div>
    </div>
  );
}

// ── 15 Regulatory Documents ──
function DocumentsScreen() {
  const [filterCategory, setFilterCategory] = useState("all");
  const filtered = REGULATORY_DOCUMENTS.filter(d => filterCategory === "all" || d.category === filterCategory);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold text-slate-900">Regulatory Documents</h2><p className="text-sm text-slate-500 mt-1">Essential documents, eTMF, version control, and secure repository</p></div>
        <div className="flex items-center gap-3">
          <select className="border rounded-lg px-3 py-2 text-sm" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="all">All Categories</option><option value="protocol">Protocol</option><option value="irb">IRB</option><option value="regulatory">Regulatory</option><option value="safety">Safety</option><option value="monitoring">Monitoring</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"><Plus className="w-4 h-4" /> Upload Document</button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">{filtered.map(d => <DocumentCard key={d.id} documentName={d.documentName} documentType={d.documentType} version={d.version} uploadDate={d.uploadDate} expiryDate={d.expiryDate} status={d.status} uploadedBy={d.uploadedBy} fileSize={d.fileSize} category={d.category} />)}</div>
    </div>
  );
}

// ── 16 Reports & Analytics ──
function ReportsScreen() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold text-slate-900">Reports & Analytics</h2><p className="text-sm text-slate-500 mt-1">Enrollment trends, safety metrics, and operational KPIs</p></div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"><Download className="w-4 h-4" /> Export Report</button>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <div className="border rounded-lg p-4 bg-white"><div className="text-xs text-slate-500">Enrollment Rate</div><div className="text-2xl font-bold text-emerald-600">73.5%</div></div>
        <div className="border rounded-lg p-4 bg-white"><div className="text-xs text-slate-500">Query Resolution</div><div className="text-2xl font-bold text-emerald-600">85%</div></div>
        <div className="border rounded-lg p-4 bg-white"><div className="text-xs text-slate-500">Protocol Compliance</div><div className="text-2xl font-bold text-emerald-600">96.2%</div></div>
        <div className="border rounded-lg p-4 bg-white"><div className="text-xs text-slate-500">SAE Reporting Time</div><div className="text-2xl font-bold text-emerald-600">4.2 hrs</div></div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="border rounded-lg p-4 bg-white"><SectionHeader title="Enrollment by Study" /><div className="space-y-3">{CLINICAL_STUDIES.map(s => { const pct = enrollmentPercentage(s.enrollmentCurrent, s.enrollmentTarget); return (
          <div key={s.id}><div className="flex items-center justify-between text-xs mb-1"><span className="text-slate-600">{s.protocolNumber}</span><span className={`font-medium ${enrollmentColor(pct)}`}>{pct}%</span></div><div className="h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-indigo-500 rounded-full" style={{ width: `${pct}%` }} /></div></div>
        )})}</div></div>
        <div className="border rounded-lg p-4 bg-white"><SectionHeader title="Safety Summary" /><div className="space-y-2">
          {[{ label: "Total AEs", value: SAFETY_EVENTS.filter(e => e.eventType === "AE").length, color: "text-orange-600" }, { label: "Total SAEs", value: SAFETY_EVENTS.filter(e => e.eventType === "SAE").length, color: "text-red-600" }, { label: "Recoveries", value: SAFETY_EVENTS.filter(e => e.outcome === "recovered").length, color: "text-emerald-600" }, { label: "Drug Related", value: SAFETY_EVENTS.filter(e => e.causality === "probable" || e.causality === "definite").length, color: "text-yellow-600" }].map(s => (
            <div key={s.label} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"><span className="text-sm text-slate-700">{s.label}</span><span className={`text-lg font-bold ${s.color}`}>{s.value}</span></div>
          ))}
        </div></div>
      </div>
      <div className="border rounded-lg p-4 bg-white">
        <SectionHeader title="Operational KPIs" subtitle="Key research metrics" />
        <div className="grid grid-cols-3 gap-4">
          {[{ label: "Avg Query Age", value: "12 days" }, { label: "SDV Completion", value: "87.5%" }, { label: "Deviation Rate", value: "2.1%" }, { label: "Consent Rate", value: "94.3%" }, { label: "Visit Compliance", value: "91.2%" }, { label: "Data Completeness", value: "96.8%" }].map(k => (
            <div key={k.label} className="border rounded-lg p-3 text-center"><div className="text-lg font-bold text-slate-900">{k.value}</div><div className="text-xs text-slate-500">{k.label}</div></div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── 17 Database Lock & Study Closeout ──
function CloseoutScreen() {
  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold text-slate-900">Database Lock & Study Closeout</h2><p className="text-sm text-slate-500 mt-1">Final verification, database lock, archiving, and study closure</p></div>
      <div className="grid grid-cols-3 gap-4">
        <div className="border rounded-lg p-4 bg-white"><div className="text-xs text-slate-500">Studies Near Close</div><div className="text-2xl font-bold text-slate-900">{CLINICAL_STUDIES.filter(s => s.status === "completed").length}</div></div>
        <div className="border rounded-lg p-4 bg-yellow-50 border-yellow-200"><div className="text-xs text-yellow-600">Pending Lock</div><div className="text-2xl font-bold text-yellow-600">0</div></div>
        <div className="border rounded-lg p-4 bg-emerald-50 border-emerald-200"><div className="text-xs text-emerald-600">Locked & Archived</div><div className="text-2xl font-bold text-emerald-600">1</div></div>
      </div>
      <div className="border rounded-lg p-5 bg-white">
        <SectionHeader title="Study Closeout Checklist" subtitle="STU-2026-005 - Biosimilar Insulin Glargine Trial" />
        <div className="space-y-3">
          {[{ step: 1, title: "Verify All Queries Resolved", status: "completed", desc: "0 open queries remaining" }, { step: 2, title: "Complete Outstanding eCRFs", status: "completed", desc: "All forms completed and locked" }, { step: 3, title: "Final Source Data Verification", status: "completed", desc: "100% SDV completed" }, { step: 4, title: "Reconcile IP Accountability", status: "completed", desc: "All drug accountability verified" }, { step: 5, title: "Generate Database Lock Report", status: "completed", desc: "Lock report generated and reviewed" }, { step: 6, title: "Lock Study Database", status: "completed", desc: "Database locked on 2026-06-30" }, { step: 7, title: "Archive Regulatory Documents", status: "completed", desc: "All documents archived in eTMF" }, { step: 8, title: "Submit Final Study Report", status: "completed", desc: "CSR submitted to IRB and sponsor" }].map(s => (
            <div key={s.step} className="flex items-center gap-4 py-3 border-b border-slate-100 last:border-0">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <div className="flex-1"><div className="text-sm font-medium text-slate-800">Step {s.step}: {s.title}</div><div className="text-xs text-slate-500">{s.desc}</div></div>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">{s.status}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="border rounded-lg p-4 bg-white">
        <SectionHeader title="Completed Studies" />
        <div className="space-y-2">{CLINICAL_STUDIES.filter(s => s.status === "completed").map(s => (
          <div key={s.id} className="flex items-center gap-4 py-3 border-b border-slate-100 last:border-0">
            <StatusDot status={s.status} /><div className="flex-1"><div className="text-sm font-medium text-slate-800">{s.title.substring(0, 60)}...</div><div className="text-xs text-slate-500">{s.protocolNumber} | {s.enrollmentCurrent} participants enrolled</div></div>
            <span className="text-xs text-slate-500">Budget: Rs {(s.spent / 100000).toFixed(1)}L / Rs {(s.budget / 100000).toFixed(1)}L</span>
          </div>
        ))}</div>
      </div>
    </div>
  );
}

// ── 18 Workflow Complete ──
function WorkflowScreen({ setScreen }: { setScreen: (s: ResearchScreen) => void }) {
  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4"><CheckCircle2 className="w-8 h-8 text-emerald-600" /></div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Research Workflow Complete</h2>
        <p className="text-sm text-slate-500 max-w-lg mx-auto">All clinical trial workflow steps have been completed successfully. Study data is locked, archived, and regulatory submissions are finalized.</p>
      </div>
      <div className="grid grid-cols-4 gap-4 max-w-4xl mx-auto">
        {[{ label: "Studies Completed", value: "1", icon: <FlaskConical className="w-5 h-5 text-indigo-500" /> }, { label: "Participants Enrolled", value: "300", icon: <Users className="w-5 h-5 text-emerald-500" /> }, { label: "eCRFs Completed", value: "2,847", icon: <Database className="w-5 h-5 text-blue-500" /> }, { label: "Audit Trail", value: "100%", icon: <Shield className="w-5 h-5 text-purple-500" /> }].map(s => (
          <div key={s.label} className="border rounded-lg p-4 bg-white text-center"><div className="flex justify-center mb-2">{s.icon}</div><div className="text-2xl font-bold text-slate-900">{s.value}</div><div className="text-xs text-slate-500 mt-1">{s.label}</div></div>
        ))}
      </div>
      <div className="max-w-4xl mx-auto space-y-3">
        <SectionHeader title="Workflow Summary" subtitle="Complete clinical research workflow steps" />
        {[{ step: 1, title: "Study Creation & Protocol Authoring", desc: "Protocol v3.0 authored with 2 amendments", status: "completed" }, { step: 2, title: "Ethics / IRB Approval", desc: "AIIMS Ethics Committee approved with conditions", status: "completed" }, { step: 3, title: "Site Activation & Investigator Assignment", desc: "8 sites activated, 6 investigators assigned", status: "completed" }, { step: 4, title: "Participant Recruitment & Screening", desc: "156 participants enrolled out of 240 target", status: "completed" }, { step: 5, title: "Electronic Consent", desc: "All consent records with multimedia education", status: "completed" }, { step: 6, title: "Study Visits & eCRF Completion", desc: "All visits completed within protocol windows", status: "completed" }, { step: 7, title: "Safety Reporting & Monitoring", desc: "4 safety events reported, 3 monitoring visits completed", status: "completed" }, { step: 8, title: "Query Resolution & Database Lock", desc: "All queries resolved, database locked and archived", status: "completed" }].map(s => (
          <div key={s.step} className="flex items-start gap-4 border rounded-lg p-4 bg-white">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0"><CheckCircle2 className="w-4 h-4 text-emerald-600" /></div>
            <div className="flex-1"><div className="text-sm font-semibold text-slate-800">Step {s.step}: {s.title}</div><div className="text-xs text-slate-500 mt-0.5">{s.desc}</div></div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">{s.status}</span>
          </div>
        ))}
      </div>
      <div className="text-center pt-4"><button className="px-6 py-3 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700" onClick={() => setScreen("dashboard")}>Return to Research Dashboard</button></div>
    </div>
  );
}
