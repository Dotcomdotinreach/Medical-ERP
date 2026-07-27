// ──────────────────────────────────────────────────────────────────────────────
// Enterprise Interoperability Hub — Main App (18 Screens)
// ──────────────────────────────────────────────────────────────────────────────
import React, { useState, useMemo } from "react";
import type { Workspace } from "../his/Shell";
import {
  Activity, ArrowRight, ArrowLeft, BarChart3, CheckCircle2, ChevronRight, Clock,
  Download, ExternalLink, Eye, Filter, Globe, Image, Key, LayoutDashboard,
  Link2, Lock, MessageSquare, Network, Radio, RefreshCw, RotateCcw, Search,
  Send, Server, Settings, Shield, Terminal, Upload, Users, AlertTriangle,
  XCircle, FileText, Database, Zap, Wifi, WifiOff, Copy, Trash2, Play,
  Pause, RotateCcw as RotateCcwIcon, Plus, Minus, TrendingUp, TrendingDown,
  BarChart, PieChart, Layers, GitBranch, ArrowUpRight, ArrowDownLeft, Cpu,
  HardDrive, Thermometer, Signal, Bell, Bookmark, Archive, Workflow,
  UserCheck, Stethoscope, Pill, ClipboardList, Microscope, Box, Heart,
  ShieldCheck, ShieldAlert, Fingerprint, Scan, QrCode, BookOpen, Scale,
  Building, Landmark, Briefcase, GraduationCap, Phone, Mail, MapPin, Star, Save,
} from "lucide-react";
import { StatusBadge, InterfaceCard, MessageCard, FhirResourceCard, QueueCard, TimelineEntry, MiniBarChart, SecurityBadge, ProtocolBadge, ProgressRing } from "./interopUi";
import {
  interfaces as interfacesData, messages as messagesData, fhirEndpoints, dicomStudies,
  smartApps, apiEndpoints, oauthClients, mpiRecords, duplicatePairs,
  providerRecords, terminologyMappings, externalSystems, monitoringMetrics,
  securityEvents, certificates, auditEntries, transformationRules,
  webhookSubscriptions, backupRecords, drDrills, dashboardKpis, chartData,
  getStatusColor, formatBytes,
} from "./data";

type Screen = "dashboard" | "engine" | "fhir" | "hl7" | "dicom" | "smart" | "apiGateway" | "mpi" | "provider" | "terminology" | "external" | "monitoring" | "security" | "audit" | "reports" | "config" | "dr" | "workflow";

export default function InteropApp({ roleName, onSignOut, onSwitchWorkspace, onOpenSettings }: {
  roleName: string; onSignOut: () => void; onSwitchWorkspace: (w: Workspace) => void; onOpenSettings?: (page: string) => void;
}) {
  const [screen, setScreen] = useState<Screen>("dashboard");
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterProtocol, setFilterProtocol] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDirection, setFilterDirection] = useState("all");

  const navItems: { id: Screen; label: string; icon: React.ReactNode }[] = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "engine", label: "Integration Engine", icon: <Workflow className="w-4 h-4" /> },
    { id: "fhir", label: "FHIR API", icon: <Globe className="w-4 h-4" /> },
    { id: "hl7", label: "HL7 Center", icon: <MessageSquare className="w-4 h-4" /> },
    { id: "dicom", label: "DICOM Gateway", icon: <Image className="w-4 h-4" /> },
    { id: "smart", label: "SMART on FHIR", icon: <Key className="w-4 h-4" /> },
    { id: "apiGateway", label: "API Gateway", icon: <Terminal className="w-4 h-4" /> },
    { id: "mpi", label: "Master Patient Index", icon: <Users className="w-4 h-4" /> },
    { id: "provider", label: "Provider Registry", icon: <Stethoscope className="w-4 h-4" /> },
    { id: "terminology", label: "Terminology", icon: <BookOpen className="w-4 h-4" /> },
    { id: "external", label: "External Systems", icon: <Network className="w-4 h-4" /> },
    { id: "monitoring", label: "Monitoring", icon: <Activity className="w-4 h-4" /> },
    { id: "security", label: "Security", icon: <Shield className="w-4 h-4" /> },
    { id: "audit", label: "Audit Logs", icon: <FileText className="w-4 h-4" /> },
    { id: "reports", label: "Reports", icon: <BarChart3 className="w-4 h-4" /> },
    { id: "config", label: "Configuration", icon: <Settings className="w-4 h-4" /> },
    { id: "dr", label: "Disaster Recovery", icon: <Database className="w-4 h-4" /> },
    { id: "workflow", label: "Workflow Complete", icon: <CheckCircle2 className="w-4 h-4" /> },
  ];

  const filteredInterfaces = useMemo(() => {
    return interfacesData.filter((i) => {
      if (filterProtocol !== "all" && i.protocol !== filterProtocol) return false;
      if (filterStatus !== "all" && i.status !== filterStatus) return false;
      if (filterDirection !== "all" && i.direction !== filterDirection) return false;
      if (searchQuery && !i.name.toLowerCase().includes(searchQuery.toLowerCase()) && !i.sourceSystem.toLowerCase().includes(searchQuery.toLowerCase()) && !i.destinationSystem.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [filterProtocol, filterStatus, filterDirection, searchQuery]);

  const filteredMessages = useMemo(() => {
    return messagesData.filter((m) => {
      if (filterStatus !== "all" && m.status !== filterStatus) return false;
      if (filterDirection !== "all" && m.direction !== filterDirection) return false;
      if (searchQuery && !m.id.toLowerCase().includes(searchQuery.toLowerCase()) && !m.correlationId.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [filterStatus, filterDirection, searchQuery]);

  return (
    <div className="flex h-full bg-slate-50">
      {/* Sidebar Navigation */}
      <div className="w-56 bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white"><Network className="w-4 h-4" /></div>
            <div>
              <div className="font-bold text-sm text-slate-800">Interop Hub</div>
              <div className="text-[10px] text-slate-500">Enterprise Integration</div>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => { setScreen(item.id); setSelectedItem(null); }}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${screen === item.id ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"}`}>
              {item.icon}{item.label}
            </button>
          ))}
        </div>
        <div className="p-3 border-t border-slate-200">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Engine Running | v4.2.1
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <div className="h-12 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="font-bold text-sm text-slate-800">{navItems.find((n) => n.id === screen)?.label}</h1>
            <div className="flex items-center gap-1 text-[10px] text-slate-400">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Production
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs w-56 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search interfaces, messages..." />
            </div>
            <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"><Bell className="w-4 h-4" /></button>
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">IA</div>
          </div>
        </div>

        {/* Screen Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {screen === "dashboard" && <DashboardScreen setScreen={setScreen} setSelectedItem={setSelectedItem} />}
          {screen === "engine" && <EngineScreen filteredInterfaces={filteredInterfaces} filterDirection={filterDirection} setFilterDirection={setFilterDirection} filterProtocol={filterProtocol} setFilterProtocol={setFilterProtocol} filterStatus={filterStatus} setFilterStatus={setFilterStatus} setScreen={setScreen} setSelectedItem={setSelectedItem} />}
          {screen === "fhir" && <FhirScreen searchQuery={searchQuery} />}
          {screen === "hl7" && <Hl7Screen filteredMessages={filteredMessages} filterStatus={filterStatus} setFilterStatus={setFilterStatus} filterDirection={filterDirection} setFilterDirection={setFilterDirection} />}
          {screen === "dicom" && <DicomScreen searchQuery={searchQuery} />}
          {screen === "smart" && <SmartScreen />}
          {screen === "apiGateway" && <ApiGatewayScreen searchQuery={searchQuery} />}
          {screen === "mpi" && <MpiScreen searchQuery={searchQuery} />}
          {screen === "provider" && <ProviderScreen searchQuery={searchQuery} />}
          {screen === "terminology" && <TerminologyScreen searchQuery={searchQuery} />}
          {screen === "external" && <ExternalScreen searchQuery={searchQuery} />}
          {screen === "monitoring" && <MonitoringScreen />}
          {screen === "security" && <SecurityScreen />}
          {screen === "audit" && <AuditScreen searchQuery={searchQuery} />}
          {screen === "reports" && <ReportsScreen />}
          {screen === "config" && <ConfigScreen />}
          {screen === "dr" && <DrScreen />}
          {screen === "workflow" && <WorkflowScreen setScreen={setScreen} />}
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Screen 01: Dashboard
// ──────────────────────────────────────────────────────────────────────────────
function DashboardScreen({ setScreen, setSelectedItem }: { setScreen: (s: Screen) => void; setSelectedItem: (s: string | null) => void }) {
  const kpis = dashboardKpis;
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Interoperability Dashboard</h2>
          <p className="text-xs text-slate-500">Enterprise Integration Overview | Last updated: {new Date().toLocaleString()}</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 flex items-center gap-1.5"><RefreshCw className="w-3.5 h-3.5" /> Refresh</button>
          <button className="px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50 flex items-center gap-1.5"><Download className="w-3.5 h-3.5" /> Export</button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-6 gap-3">
        <QueueCard title="Active Interfaces" count={kpis.activeInterfaces} icon={<Network className="w-5 h-5" />} color="bg-blue-50 text-blue-600" />
        <QueueCard title="Connected Systems" count={kpis.connectedSystems} icon={<Link2 className="w-5 h-5" />} color="bg-emerald-50 text-emerald-600" />
        <QueueCard title="Queued Messages" count={kpis.queuedMessages} icon={<Clock className="w-5 h-5" />} color="bg-orange-50 text-orange-600" trend={-12} />
        <QueueCard title="FHIR Requests" count={kpis.fhirRequests} icon={<Globe className="w-5 h-5" />} color="bg-teal-50 text-teal-600" trend={18} />
        <QueueCard title="DICOM Transfers" count={kpis.dicomTransfers} icon={<Image className="w-5 h-5" />} color="bg-amber-50 text-amber-600" />
        <QueueCard title="Failed Txns" count={kpis.failedTransactions} icon={<AlertTriangle className="w-5 h-5" />} color="bg-red-50 text-red-600" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <h3 className="text-xs font-semibold text-slate-700 mb-3">Message Volume (24h)</h3>
          <MiniBarChart data={chartData.messageVolume.map((d) => ({ ...d, color: "#3b82f6" }))} height={100} />
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <h3 className="text-xs font-semibold text-slate-700 mb-3">Protocol Distribution</h3>
          <div className="space-y-2">
            {chartData.protocolDistribution.map((p) => (
              <div key={p.label} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                <span className="text-xs text-slate-600 flex-1">{p.label}</span>
                <span className="text-xs font-medium text-slate-800">{p.value}%</span>
                <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${p.value}%`, backgroundColor: p.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <h3 className="text-xs font-semibold text-slate-700 mb-3">Error Trends (7d)</h3>
          <MiniBarChart data={chartData.errorTrends.map((d) => ({ ...d, color: d.value > 5 ? "#ef4444" : "#f59e0b" }))} height={100} />
        </div>
      </div>

      {/* Quick Actions + Recent Events */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <h3 className="text-xs font-semibold text-slate-700 mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Integration Engine", icon: <Workflow className="w-4 h-4" />, screen: "engine" as Screen },
              { label: "FHIR Explorer", icon: <Globe className="w-4 h-4" />, screen: "fhir" as Screen },
              { label: "HL7 Messages", icon: <MessageSquare className="w-4 h-4" />, screen: "hl7" as Screen },
              { label: "MPI Lookup", icon: <Users className="w-4 h-4" />, screen: "mpi" as Screen },
              { label: "Security Center", icon: <Shield className="w-4 h-4" />, screen: "security" as Screen },
              { label: "Monitoring", icon: <Activity className="w-4 h-4" />, screen: "monitoring" as Screen },
            ].map((a) => (
              <button key={a.label} onClick={() => setScreen(a.screen)} className="flex items-center gap-2 p-2.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all">
                {a.icon}{a.label}
              </button>
            ))}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4 col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-slate-700">Recent Events</h3>
            <button onClick={() => setScreen("audit")} className="text-xs text-blue-600 hover:text-blue-700">View All</button>
          </div>
          <div className="space-y-2">
            {auditEntries.slice(0, 5).map((e) => (
              <div key={e.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50">
                <div className={`w-7 h-7 rounded flex items-center justify-center ${e.status === "success" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
                  {e.status === "success" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-slate-800">{e.action.replace(/_/g, " ")}</div>
                  <div className="text-[10px] text-slate-500 truncate">{e.details}</div>
                </div>
                <span className="text-[10px] text-slate-400">{new Date(e.timestamp).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{kpis.avgLatency}ms</div>
          <div className="text-xs text-slate-500 mt-1">Avg Latency</div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(kpis.avgLatency / 5, 100)}%` }} />
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-emerald-600">{kpis.throughput.toLocaleString()}</div>
          <div className="text-xs text-slate-500 mt-1">Msg/min Throughput</div>
          <div className="flex items-center justify-center gap-1 text-xs text-emerald-600 mt-1"><TrendingUp className="w-3 h-3" /> +5.2%</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-emerald-600">{kpis.uptime}%</div>
          <div className="text-xs text-slate-500 mt-1">System Uptime</div>
          <ProgressRing value={kpis.uptime} max={100} size={40} color="#10b981" />
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-slate-800">{kpis.hl7Messages.toLocaleString()}</div>
          <div className="text-xs text-slate-500 mt-1">HL7 Messages Today</div>
          <div className="flex items-center justify-center gap-1 text-xs text-slate-500 mt-1"><MessageSquare className="w-3 h-3" /> ADT, ORU, ORM</div>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Screen 02: Integration Engine
// ──────────────────────────────────────────────────────────────────────────────
function EngineScreen({ filteredInterfaces, filterDirection, setFilterDirection, filterProtocol, setFilterProtocol, filterStatus, setFilterStatus, setScreen, setSelectedItem }: {
  filteredInterfaces: any[]; filterDirection: string; setFilterDirection: (v: string) => void;
  filterProtocol: string; setFilterProtocol: (v: string) => void; filterStatus: string;
  setFilterStatus: (v: string) => void; setScreen: (s: Screen) => void; setSelectedItem: (s: string | null) => void;
}) {
  const [view, setView] = useState<"interfaces" | "transformations" | "dead-letter" | "retry">("interfaces");
  const deadLetter = messagesData.filter((m) => m.status === "dead-letter");
  const retryQueue = messagesData.filter((m) => m.status === "retrying");
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Integration Engine</h2>
          <p className="text-xs text-slate-500">Interface Management | v4.2.1 | Environment: Production</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 flex items-center gap-1.5"><Play className="w-3.5 h-3.5" /> Deploy Interface</button>
          <button className="px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50"><Settings className="w-3.5 h-3.5" /></button>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {(["interfaces", "transformations", "dead-letter", "retry"] as const).map((v) => (
          <button key={v} onClick={() => setView(v)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${view === v ? "bg-blue-50 text-blue-700 border border-blue-200" : "text-slate-600 border border-slate-200 hover:bg-slate-50"}`}>
            {v === "interfaces" ? "Interfaces" : v === "transformations" ? "Transformations" : v === "dead-letter" ? `Dead Letter (${deadLetter.length})` : `Retry Queue (${retryQueue.length})`}
          </button>
        ))}
      </div>
      {view === "interfaces" && (
        <>
          <div className="flex items-center gap-2">
            <select value={filterDirection} onChange={(e) => setFilterDirection(e.target.value)} className="px-2 py-1 border border-slate-200 rounded text-xs"><option value="all">All Directions</option><option value="inbound">Inbound</option><option value="outbound">Outbound</option></select>
            <select value={filterProtocol} onChange={(e) => setFilterProtocol(e.target.value)} className="px-2 py-1 border border-slate-200 rounded text-xs"><option value="all">All Protocols</option><option value="hl7v2">HL7v2</option><option value="fhir-r4">FHIR R4</option><option value="fhir-r5">FHIR R5</option><option value="dicom">DICOM</option><option value="rest">REST</option><option value="webhook">Webhook</option></select>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-2 py-1 border border-slate-200 rounded text-xs"><option value="all">All Status</option><option value="active">Active</option><option value="warning">Warning</option><option value="failed">Failed</option><option value="maintenance">Maintenance</option></select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {filteredInterfaces.map((iface) => (<InterfaceCard key={iface.id} iface={iface} />))}
          </div>
        </>
      )}
      {view === "transformations" && (
        <div className="bg-white border border-slate-200 rounded-lg">
          <table className="w-full text-xs">
            <thead><tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left p-3 font-semibold text-slate-600">Rule</th>
              <th className="text-left p-3 font-semibold text-slate-600">Source</th>
              <th className="text-left p-3 font-semibold text-slate-600">Target</th>
              <th className="text-left p-3 font-semibold text-slate-600">Mappings</th>
              <th className="text-left p-3 font-semibold text-slate-600">Status</th>
              <th className="text-left p-3 font-semibold text-slate-600">Version</th>
            </tr></thead>
            <tbody>{transformationRules.map((r) => (
              <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="p-3 font-medium text-slate-800">{r.name}<div className="text-[10px] text-slate-400">{r.description}</div></td>
                <td className="p-3"><ProtocolBadge protocol={r.sourceFormat.includes("HL7") ? "hl7v2" : r.sourceFormat.includes("FHIR") ? "fhir-r4" : r.sourceFormat.includes("DICOM") ? "dicom" : "rest"} /></td>
                <td className="p-3"><ProtocolBadge protocol={r.targetFormat.includes("FHIR") ? "fhir-r4" : "rest"} /></td>
                <td className="p-3 text-slate-700">{r.mappings} fields</td>
                <td className="p-3"><StatusBadge status={r.status} /></td>
                <td className="p-3 text-slate-500">v{r.version}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
      {view === "dead-letter" && (
        <div className="space-y-2">
          {deadLetter.length === 0 ? <div className="text-center py-8 text-slate-500 text-sm">No dead-letter messages</div> :
            deadLetter.map((m) => (<MessageCard key={m.id} msg={m} />))}
        </div>
      )}
      {view === "retry" && (
        <div className="space-y-2">
          {retryQueue.length === 0 ? <div className="text-center py-8 text-slate-500 text-sm">No messages in retry queue</div> :
            retryQueue.map((m) => (<MessageCard key={m.id} msg={m} />))}
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Screen 03: FHIR API Management
// ──────────────────────────────────────────────────────────────────────────────
function FhirScreen({ searchQuery }: { searchQuery: string }) {
  const [selectedResource, setSelectedResource] = useState<string | null>(null);
  const [tab, setTab] = useState<"resources" | "explorer" | "capability">("resources");
  const filtered = fhirEndpoints.filter((e) => !searchQuery || e.resource.toLowerCase().includes(searchQuery.toLowerCase()));
  const capabilityStatement = {
    fhirVersion: "4.0.1", software: "HMIS Interop Engine", version: "4.2.1",
    format: ["json", "xml"], security: { cors: true, oauth: { authorization: "https://auth.hospital.org/oauth2/authorize", token: "https://auth.hospital.org/oauth2/token", scopes: ["patient/*.read", "user/*.read", "user/*.write"] } },
    rest: [{ mode: "server", resource: fhirEndpoints.map((e) => ({ type: e.resource, interaction: [{ code: "read" }, { code: "search-type" }], versioning: "versioned" })) }],
  };
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h2 className="text-lg font-bold text-slate-800">FHIR API Management</h2><p className="text-xs text-slate-500">HL7 FHIR R4 | /api/fhir/r4 | FHIR Version 4.0.1</p></div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-full"><Globe className="w-3 h-3" /> FHIR R4 Active</span>
          <button className="px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50"><Eye className="w-3.5 h-3.5" /> Capability Statement</button>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {(["resources", "explorer", "capability"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${tab === t ? "bg-blue-50 text-blue-700 border border-blue-200" : "text-slate-600 border border-slate-200 hover:bg-slate-50"}`}>
            {t === "resources" ? "Resources" : t === "explorer" ? "API Explorer" : "Capability Statement"}
          </button>
        ))}
      </div>
      {tab === "resources" && <div className="grid grid-cols-3 gap-3">{filtered.map((e) => (<FhirResourceCard key={e.resource} endpoint={e} />))}</div>}
      {tab === "explorer" && (
        <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2">
            <select className="px-2 py-1.5 border border-slate-200 rounded text-xs font-medium"><option>GET</option><option>POST</option><option>PUT</option><option>DELETE</option></select>
            <input defaultValue="/api/fhir/r4/Patient" className="flex-1 px-3 py-1.5 border border-slate-200 rounded text-xs font-mono" />
            <button className="px-4 py-1.5 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700"><Send className="w-3.5 h-3.5 inline mr-1" />Send</button>
          </div>
          <div className="bg-slate-900 rounded-lg p-4 text-xs font-mono text-green-400 overflow-x-auto">
            <pre>{JSON.stringify({ resourceType: "Bundle", type: "searchset", total: filtered.length, entry: filtered.slice(0, 2).map((e) => ({ resource: { resourceType: e.resource, id: e.resource.toLowerCase() + "-001" } })) }, null, 2)}</pre>
          </div>
        </div>
      )}
      {tab === "capability" && (
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div><span className="text-slate-500">FHIR Version:</span> <span className="font-medium text-slate-800">{capabilityStatement.fhirVersion}</span></div>
            <div><span className="text-slate-500">Software:</span> <span className="font-medium text-slate-800">{capabilityStatement.software}</span></div>
            <div><span className="text-slate-500">Formats:</span> <span className="font-medium text-slate-800">{capabilityStatement.format.join(", ")}</span></div>
            <div><span className="text-slate-500">Security:</span> <span className="font-medium text-slate-800">OAuth 2.0 + CORS</span></div>
          </div>
          <div className="mt-4"><h4 className="text-xs font-semibold text-slate-700 mb-2">Supported Resources ({capabilityStatement.rest[0].resource.length})</h4>
            <div className="grid grid-cols-4 gap-2">{capabilityStatement.rest[0].resource.map((r) => (<div key={r.type} className="flex items-center gap-2 p-2 bg-slate-50 rounded text-xs"><CheckCircle2 className="w-3 h-3 text-emerald-500" />{r.type}</div>))}</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Screen 04: HL7 Message Center
// ──────────────────────────────────────────────────────────────────────────────
function Hl7Screen({ filteredMessages, filterStatus, setFilterStatus, filterDirection, setFilterDirection }: {
  filteredMessages: any[]; filterStatus: string; setFilterStatus: (s: string) => void;
  filterDirection: string; setFilterDirection: (d: string) => void;
}) {
  const [selectedMsg, setSelectedMsg] = useState<string | null>(null);
  const msg = filteredMessages.find((m) => m.id === selectedMsg);
  const msgTypes = ["ADT", "ORM", "ORU", "SIU", "DFT", "MDM", "ACK"];
  const typeCounts = msgTypes.map((t) => ({ type: t, count: messagesData.filter((m) => m.messageType.startsWith(t)).length }));
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h2 className="text-lg font-bold text-slate-800">HL7 Message Center</h2><p className="text-xs text-slate-500">HL7 v2.x Messaging | MLLP over TLS | Port 5100</p></div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700"><RotateCcw className="w-3.5 h-3.5 inline mr-1" />Replay Failed</button>
          <button className="px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50"><Download className="w-3.5 h-3.5 inline mr-1" />Export</button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {typeCounts.map((t) => (
          <div key={t.type} className="bg-white border border-slate-200 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-slate-800">{t.count}</div>
            <div className="text-[10px] font-mono text-slate-500">{t.type}</div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <select value={filterDirection} onChange={(e) => setFilterDirection(e.target.value)} className="px-2 py-1 border border-slate-200 rounded text-xs"><option value="all">All Directions</option><option value="inbound">Inbound</option><option value="outbound">Outbound</option></select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-2 py-1 border border-slate-200 rounded text-xs"><option value="all">All Status</option><option value="acknowledged">Acknowledged</option><option value="delivered">Delivered</option><option value="failed">Failed</option><option value="processing">Processing</option><option value="retrying">Retrying</option><option value="dead-letter">Dead Letter</option></select>
      </div>
      {selectedMsg && msg ? (
        <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button onClick={() => setSelectedMsg(null)} className="text-slate-400 hover:text-slate-600"><ArrowLeft className="w-4 h-4" /></button>
              <span className="font-mono text-sm font-bold">{msg.id}</span>
              <StatusBadge status={msg.status} />
            </div>
            <div className="flex items-center gap-2">
              {msg.status === "failed" && <button className="px-3 py-1 bg-orange-500 text-white rounded text-xs hover:bg-orange-600"><RefreshCw className="w-3 h-3 inline mr-1" />Retry</button>}
              {msg.status === "dead-letter" && <button className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"><RotateCcw className="w-3 h-3 inline mr-1" />Replay</button>}
              <button className="px-3 py-1 border border-slate-200 rounded text-xs hover:bg-slate-50"><Copy className="w-3 h-3 inline mr-1" />Copy</button>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-3 text-xs">
            <div className="p-2 bg-slate-50 rounded"><span className="text-slate-500">Type:</span> <span className="font-mono font-medium">{msg.messageType}</span></div>
            <div className="p-2 bg-slate-50 rounded"><span className="text-slate-500">Direction:</span> <span className="font-medium">{msg.direction}</span></div>
            <div className="p-2 bg-slate-50 rounded"><span className="text-slate-500">Correlation:</span> <span className="font-mono font-medium">{msg.correlationId}</span></div>
            <div className="p-2 bg-slate-50 rounded"><span className="text-slate-500">Size:</span> <span className="font-medium">{(msg.size / 1024).toFixed(1)} KB</span></div>
          </div>
          <div className="bg-slate-900 rounded-lg p-4 text-xs font-mono text-green-400 overflow-x-auto max-h-64 overflow-y-auto">
            <pre>{msg.payload}</pre>
          </div>
          {msg.error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700"><AlertTriangle className="w-3.5 h-3.5 inline mr-1" />{msg.error}</div>}
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span>Received: {new Date(msg.timestamp).toLocaleString()}</span>
            {msg.processedAt && <span>Processed: {new Date(msg.processedAt).toLocaleString()}</span>}
            {msg.acknowledgedAt && <span>ACK: {new Date(msg.acknowledgedAt).toLocaleString()}</span>}
          </div>
        </div>
      ) : (
        <div className="space-y-2">{filteredMessages.map((m) => (<MessageCard key={m.id} msg={m} onClick={() => setSelectedMsg(m.id)} />))}</div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Screen 05: DICOM Gateway
// ──────────────────────────────────────────────────────────────────────────────
function DicomScreen({ searchQuery }: { searchQuery: string }) {
  const [selectedStudy, setSelectedStudy] = useState<string | null>(null);
  const filtered = dicomStudies.filter((s) => !searchQuery || s.patientName.toLowerCase().includes(searchQuery.toLowerCase()) || s.studyDescription.toLowerCase().includes(searchQuery.toLowerCase()));
  const study = dicomStudies.find((s) => s.id === selectedStudy);
  const totalImages = dicomStudies.reduce((sum, s) => sum + s.imageCount, 0);
  const totalSize = dicomStudies.reduce((sum, s) => sum + s.sizeMb, 0);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h2 className="text-lg font-bold text-slate-800">DICOM Gateway</h2><p className="text-xs text-slate-500">DICOM Web | C-STORE/C-FIND/C-MOVE | AET: HIS_MAIN</p></div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs px-2.5 py-1 bg-amber-50 text-amber-600 rounded-full"><Image className="w-3 h-3" /> {dicomStudies.length} Studies</span>
          <button className="px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50"><Settings className="w-3.5 h-3.5" /></button>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-lg p-3 text-center"><div className="text-xl font-bold text-slate-800">{dicomStudies.length}</div><div className="text-xs text-slate-500">Studies</div></div>
        <div className="bg-white border border-slate-200 rounded-lg p-3 text-center"><div className="text-xl font-bold text-blue-600">{totalImages.toLocaleString()}</div><div className="text-xs text-slate-500">Total Images</div></div>
        <div className="bg-white border border-slate-200 rounded-lg p-3 text-center"><div className="text-xl font-bold text-amber-600">{(totalSize / 1024).toFixed(1)} GB</div><div className="text-xs text-slate-500">Total Size</div></div>
        <div className="bg-white border border-slate-200 rounded-lg p-3 text-center"><div className="text-xl font-bold text-emerald-600">2</div><div className="text-xs text-slate-500">PACS Nodes</div></div>
      </div>
      {study ? (
        <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2">
            <button onClick={() => setSelectedStudy(null)} className="text-slate-400 hover:text-slate-600"><ArrowLeft className="w-4 h-4" /></button>
            <span className="font-semibold text-sm">{study.studyDescription}</span>
            <StatusBadge status={study.status} />
          </div>
          <div className="grid grid-cols-4 gap-3 text-xs">
            <div className="p-2 bg-slate-50 rounded"><span className="text-slate-500">Patient:</span> <span className="font-medium">{study.patientName.replace("^", " ")}</span></div>
            <div className="p-2 bg-slate-50 rounded"><span className="text-slate-500">Modality:</span> <span className="font-medium">{study.modality}</span></div>
            <div className="p-2 bg-slate-50 rounded"><span className="text-slate-500">AET:</span> <span className="font-mono font-medium">{study.aet}</span></div>
            <div className="p-2 bg-slate-50 rounded"><span className="text-slate-500">PACS Node:</span> <span className="font-medium">{study.pacNode}</span></div>
            <div className="p-2 bg-slate-50 rounded"><span className="text-slate-500">Series:</span> <span className="font-medium">{study.seriesCount}</span></div>
            <div className="p-2 bg-slate-50 rounded"><span className="text-slate-500">Images:</span> <span className="font-medium">{study.imageCount}</span></div>
            <div className="p-2 bg-slate-50 rounded"><span className="text-slate-500">Size:</span> <span className="font-medium">{study.sizeMb} MB</span></div>
            <div className="p-2 bg-slate-50 rounded"><span className="text-slate-500">Transfer:</span> <span className="font-medium">{study.transferSyntax}</span></div>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg text-xs font-mono text-slate-600">
            Study UID: {study.studyInstanceUid}
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"><Download className="w-3 h-3 inline mr-1" />Transfer to Cloud</button>
            <button className="px-3 py-1.5 border border-slate-200 rounded text-xs hover:bg-slate-50"><Eye className="w-3 h-3 inline mr-1" />View in PACS</button>
            <button className="px-3 py-1.5 border border-slate-200 rounded text-xs hover:bg-slate-50"><RefreshCw className="w-3 h-3 inline mr-1" />Storage Commit</button>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-lg">
          <table className="w-full text-xs">
            <thead><tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left p-3 font-semibold text-slate-600">Study</th>
              <th className="text-left p-3 font-semibold text-slate-600">Patient</th>
              <th className="text-left p-3 font-semibold text-slate-600">Modality</th>
              <th className="text-left p-3 font-semibold text-slate-600">Images</th>
              <th className="text-left p-3 font-semibold text-slate-600">Size</th>
              <th className="text-left p-3 font-semibold text-slate-600">PACS Node</th>
              <th className="text-left p-3 font-semibold text-slate-600">Status</th>
            </tr></thead>
            <tbody>{filtered.map((s) => (
              <tr key={s.id} onClick={() => setSelectedStudy(s.id)} className="border-b border-slate-100 hover:bg-blue-50 cursor-pointer">
                <td className="p-3 font-medium text-slate-800">{s.studyDescription}<div className="text-[10px] text-slate-400">{s.studyDate}</div></td>
                <td className="p-3 text-slate-700">{s.patientName.replace("^", " ")}</td>
                <td className="p-3"><span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-mono font-bold">{s.modality}</span></td>
                <td className="p-3 text-slate-700">{s.imageCount}</td>
                <td className="p-3 text-slate-700">{s.sizeMb} MB</td>
                <td className="p-3 text-slate-700 font-mono text-[10px]">{s.pacNode}</td>
                <td className="p-3"><StatusBadge status={s.status} /></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Screen 06: SMART on FHIR
// ──────────────────────────────────────────────────────────────────────────────
function SmartScreen() {
  const [tab, setTab] = useState<"installed" | "catalog" | "sessions">("installed");
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h2 className="text-lg font-bold text-slate-800">SMART on FHIR</h2><p className="text-xs text-slate-500">OAuth 2.0 Launch Framework | SMART App Launch v2.0</p></div>
        <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700"><Plus className="w-3.5 h-3.5 inline mr-1" />Install App</button>
      </div>
      <div className="flex items-center gap-2">
        {(["installed", "catalog", "sessions"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${tab === t ? "bg-blue-50 text-blue-700 border border-blue-200" : "text-slate-600 border border-slate-200 hover:bg-slate-50"}`}>
            {t === "installed" ? "Installed Apps" : t === "catalog" ? "App Catalog" : "Session History"}
          </button>
        ))}
      </div>
      {tab === "installed" && (
        <div className="grid grid-cols-2 gap-3">
          {smartApps.filter((a) => a.status === "active" || a.status === "pending").map((app) => (
            <div key={app.id} className="bg-white border border-slate-200 rounded-lg p-4 hover:border-blue-300 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center"><Key className="w-5 h-5" /></div>
                  <div><div className="font-semibold text-sm text-slate-800">{app.name}</div><div className="text-[10px] text-slate-500">{app.developer} | v{app.version}</div></div>
                </div>
                <StatusBadge status={app.status} />
              </div>
              <div className="space-y-2 mb-3">
                <div className="text-xs text-slate-500">Scopes: <span className="font-mono text-[10px] text-slate-700">{app.scopes.join(", ")}</span></div>
                <div className="text-xs text-slate-500">Launch: <span className="font-medium text-slate-700">{app.launchContext}</span></div>
                <div className="text-xs text-slate-500">Auth: <SecurityBadge method={app.authMethod} /></div>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100">
                <span>{app.installs} installs</span>
                <span>Last used: {new Date(app.lastUsed).toLocaleDateString()}</span>
              </div>
              <div className="mt-3"><h4 className="text-[10px] font-semibold text-slate-600 mb-1">Permissions</h4>
                <div className="flex flex-wrap gap-1">{app.permissions.map((p) => (<span key={p} className="px-1.5 py-0.5 bg-slate-50 text-slate-600 rounded text-[10px]">{p}</span>))}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      {tab === "catalog" && (
        <div className="grid grid-cols-3 gap-3">
          {smartApps.map((app) => (
            <div key={app.id} className="bg-white border border-slate-200 rounded-lg p-4 hover:border-blue-300 transition-all">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center"><Key className="w-4 h-4" /></div>
                <div><div className="font-semibold text-xs text-slate-800">{app.name}</div><div className="text-[10px] text-slate-500">by {app.developer}</div></div>
              </div>
              <p className="text-xs text-slate-500 mb-2">{app.permissions.length} permissions required</p>
              <div className="flex items-center justify-between">
                <StatusBadge status={app.status} />
                <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">{app.status === "active" ? "Manage" : "Install"}</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {tab === "sessions" && (
        <div className="bg-white border border-slate-200 rounded-lg">
          <table className="w-full text-xs">
            <thead><tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left p-3 font-semibold text-slate-600">Application</th>
              <th className="text-left p-3 font-semibold text-slate-600">User</th>
              <th className="text-left p-3 font-semibold text-slate-600">Patient</th>
              <th className="text-left p-3 font-semibold text-slate-600">Started</th>
              <th className="text-left p-3 font-semibold text-slate-600">Status</th>
            </tr></thead>
            <tbody>
              {[{ app: "Clinical Notes Assistant", user: "Dr. Chen", patient: "MRN001", started: "2026-07-24T10:30:00Z", status: "active" },
                { app: "Radiology AI Triage", user: "Dr. Taylor", patient: "MRN002", started: "2026-07-24T10:15:00Z", status: "active" },
                { app: "Pharmacy Order Entry", user: "Pharm. Williams", patient: "MRN003", started: "2026-07-24T09:45:00Z", status: "expired" },
              ].map((s, i) => (
                <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-3 font-medium text-slate-800">{s.app}</td>
                  <td className="p-3 text-slate-700">{s.user}</td>
                  <td className="p-3 text-slate-700 font-mono">{s.patient}</td>
                  <td className="p-3 text-slate-500">{new Date(s.started).toLocaleString()}</td>
                  <td className="p-3"><StatusBadge status={s.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Screen 07: API Gateway
// ──────────────────────────────────────────────────────────────────────────────
function ApiGatewayScreen({ searchQuery }: { searchQuery: string }) {
  const [tab, setTab] = useState<"apis" | "clients" | "webhooks">("apis");
  const filtered = apiEndpoints.filter((e) => !searchQuery || e.path.toLowerCase().includes(searchQuery.toLowerCase()) || e.description.toLowerCase().includes(searchQuery.toLowerCase()));
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h2 className="text-lg font-bold text-slate-800">API Gateway</h2><p className="text-xs text-slate-500">REST & GraphQL APIs | Rate Limiting | OAuth 2.0</p></div>
        <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700"><Plus className="w-3.5 h-3.5 inline mr-1" />Register API</button>
      </div>
      <div className="flex items-center gap-2">
        {(["apis", "clients", "webhooks"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${tab === t ? "bg-blue-50 text-blue-700 border border-blue-200" : "text-slate-600 border border-slate-200 hover:bg-slate-50"}`}>
            {t === "apis" ? "API Endpoints" : t === "clients" ? "OAuth Clients" : "Webhooks"}
          </button>
        ))}
      </div>
      {tab === "apis" && (
        <div className="bg-white border border-slate-200 rounded-lg">
          <table className="w-full text-xs">
            <thead><tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left p-3 font-semibold text-slate-600">Endpoint</th>
              <th className="text-left p-3 font-semibold text-slate-600">Method</th>
              <th className="text-left p-3 font-semibold text-slate-600">Protocol</th>
              <th className="text-left p-3 font-semibold text-slate-600">Rate Limit</th>
              <th className="text-left p-3 font-semibold text-slate-600">Calls</th>
              <th className="text-left p-3 font-semibold text-slate-600">Latency</th>
              <th className="text-left p-3 font-semibold text-slate-600">Status</th>
            </tr></thead>
            <tbody>{filtered.map((ep) => (
              <tr key={ep.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="p-3"><div className="font-mono font-medium text-slate-800">{ep.path}</div><div className="text-[10px] text-slate-500">{ep.description}</div></td>
                <td className="p-3"><span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded font-mono text-[10px] font-bold">{ep.method}</span></td>
                <td className="p-3"><ProtocolBadge protocol={ep.protocol.toLowerCase()} /></td>
                <td className="p-3 text-slate-700">{ep.rateLimit}/min</td>
                <td className="p-3 text-slate-700">{ep.totalCalls.toLocaleString()}</td>
                <td className="p-3 text-slate-700">{ep.avgLatencyMs}ms</td>
                <td className="p-3"><StatusBadge status={ep.status} /></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
      {tab === "clients" && (
        <div className="grid grid-cols-2 gap-3">
          {oauthClients.map((c) => (
            <div key={c.id} className="bg-white border border-slate-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div><div className="font-semibold text-sm text-slate-800">{c.name}</div><div className="text-[10px] font-mono text-slate-500">{c.clientId}</div></div>
                <StatusBadge status={c.status} />
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="text-slate-500">Grants: <span className="font-medium text-slate-700">{c.grantTypes.join(", ")}</span></div>
                <div className="text-slate-500">Scopes: <span className="font-mono text-[10px] text-slate-700">{c.scopes.join(", ")}</span></div>
                <div className="text-slate-500">Tokens: <span className="font-medium text-slate-700">{c.tokenCount} active</span></div>
                <div className="text-slate-500">Last Used: <span className="text-slate-700">{new Date(c.lastUsed).toLocaleString()}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}
      {tab === "webhooks" && (
        <div className="space-y-2">
          {webhookSubscriptions.map((w) => (
            <div key={w.id} className="bg-white border border-slate-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div><div className="font-semibold text-sm text-slate-800">{w.name}</div><div className="text-[10px] font-mono text-slate-500">{w.url}</div></div>
                <StatusBadge status={w.status} />
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span>Events: <span className="font-mono text-slate-700">{w.events.join(", ")}</span></span>
                <span>Success: <span className={`font-medium ${w.successRate > 95 ? "text-emerald-600" : "text-red-600"}`}>{w.successRate}%</span></span>
                <span>Retry: {w.retryPolicy}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Screen 08: Master Patient Index (MPI)
// ──────────────────────────────────────────────────────────────────────────────
function MpiScreen({ searchQuery }: { searchQuery: string }) {
  const [tab, setTab] = useState<"patients" | "duplicates" | "merge">("patients");
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const filtered = mpiRecords.filter((r) => !searchQuery || r.firstName.toLowerCase().includes(searchQuery.toLowerCase()) || r.lastName.toLowerCase().includes(searchQuery.toLowerCase()) || r.mrn.includes(searchQuery));
  const patient = mpiRecords.find((r) => r.id === selectedPatient);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h2 className="text-lg font-bold text-slate-800">Master Patient Index</h2><p className="text-xs text-slate-500">Enterprise MPI | Identity Resolution | {mpiRecords.length} Patients Indexed</p></div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 bg-orange-50 text-orange-600 rounded-full">{duplicatePairs.filter((d) => d.status === "pending").length} Duplicates Pending</span>
          <button className="px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50"><Search className="w-3.5 h-3.5 inline mr-1" />Advanced Search</button>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {(["patients", "duplicates", "merge"] as const).map((t) => (
          <button key={t} onClick={() => { setTab(t); setSelectedPatient(null); }} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${tab === t ? "bg-blue-50 text-blue-700 border border-blue-200" : "text-slate-600 border border-slate-200 hover:bg-slate-50"}`}>
            {t === "patients" ? "All Patients" : t === "duplicates" ? `Duplicates (${duplicatePairs.length})` : "Merge Center"}
          </button>
        ))}
      </div>
      {tab === "patients" && !patient && (
        <div className="bg-white border border-slate-200 rounded-lg">
          <table className="w-full text-xs">
            <thead><tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left p-3 font-semibold text-slate-600">Enterprise ID</th>
              <th className="text-left p-3 font-semibold text-slate-600">Name</th>
              <th className="text-left p-3 font-semibold text-slate-600">DOB</th>
              <th className="text-left p-3 font-semibold text-slate-600">MRN</th>
              <th className="text-left p-3 font-semibold text-slate-600">Sources</th>
              <th className="text-left p-3 font-semibold text-slate-600">Confidence</th>
              <th className="text-left p-3 font-semibold text-slate-600">Verified</th>
            </tr></thead>
            <tbody>{filtered.map((r) => (
              <tr key={r.id} onClick={() => setSelectedPatient(r.id)} className="border-b border-slate-100 hover:bg-blue-50 cursor-pointer">
                <td className="p-3 font-mono text-slate-800">{r.enterpriseId}</td>
                <td className="p-3 font-medium text-slate-800">{r.lastName}, {r.firstName}</td>
                <td className="p-3 text-slate-700">{r.dateOfBirth}</td>
                <td className="p-3 font-mono text-slate-700">{r.mrn}</td>
                <td className="p-3">{r.sourceIds.length} systems</td>
                <td className="p-3"><StatusBadge status={r.matchConfidence} /></td>
                <td className="p-3">{r.verified ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-slate-300" />}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
      {tab === "patients" && patient && (
        <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2">
            <button onClick={() => setSelectedPatient(null)} className="text-slate-400 hover:text-slate-600"><ArrowLeft className="w-4 h-4" /></button>
            <span className="font-semibold text-sm">{patient.lastName}, {patient.firstName}</span>
            <StatusBadge status={patient.matchConfidence} />
            {patient.verified && <span className="text-xs text-emerald-600 flex items-center gap-1"><ShieldCheck className="w-3 h-3" />Verified</span>}
          </div>
          <div className="grid grid-cols-4 gap-3 text-xs">
            <div className="p-2 bg-slate-50 rounded"><span className="text-slate-500">Enterprise ID:</span> <span className="font-mono font-medium">{patient.enterpriseId}</span></div>
            <div className="p-2 bg-slate-50 rounded"><span className="text-slate-500">DOB:</span> <span className="font-medium">{patient.dateOfBirth}</span></div>
            <div className="p-2 bg-slate-50 rounded"><span className="text-slate-500">Gender:</span> <span className="font-medium">{patient.gender}</span></div>
            <div className="p-2 bg-slate-50 rounded"><span className="text-slate-500">SSN:</span> <span className="font-medium">{patient.ssn}</span></div>
          </div>
          <div><h4 className="text-xs font-semibold text-slate-700 mb-2">Source System Records</h4>
            <div className="space-y-1">{patient.sourceIds.map((s, i) => (
              <div key={i} className="flex items-center gap-3 p-2 bg-slate-50 rounded text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span className="font-medium text-slate-700">{s.system}</span>
                <span className="font-mono text-slate-500">{s.id}</span>
              </div>
            ))}</div>
          </div>
          {patient.duplicateCount > 0 && <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg text-xs text-orange-700"><AlertTriangle className="w-3.5 h-3.5 inline mr-1" />{patient.duplicateCount} potential duplicate(s) detected</div>}
        </div>
      )}
      {tab === "duplicates" && (
        <div className="space-y-3">
          {duplicatePairs.map((d) => (
            <div key={d.id} className="bg-white border border-slate-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-800">Match Score: {d.matchScore}%</span>
                  <StatusBadge status={d.status} />
                </div>
                {d.status === "pending" && (
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-emerald-600 text-white rounded text-xs hover:bg-emerald-700"><UserCheck className="w-3 h-3 inline mr-1" />Merge</button>
                    <button className="px-3 py-1 border border-slate-200 rounded text-xs hover:bg-slate-50">Reject</button>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-blue-50 rounded-lg text-xs">
                  <div className="font-semibold text-blue-800 mb-1">Record A: {d.recordA.mrn}</div>
                  <div>{d.recordA.lastName}, {d.recordA.firstName} | DOB: {d.recordA.dateOfBirth}</div>
                </div>
                <div className="p-3 bg-violet-50 rounded-lg text-xs">
                  <div className="font-semibold text-violet-800 mb-1">Record B: {d.recordB.mrn}</div>
                  <div>{d.recordB.lastName}, {d.recordB.firstName} | DOB: {d.recordB.dateOfBirth}</div>
                </div>
              </div>
              <div className="mt-2 text-xs text-slate-500">Matching Fields: <span className="font-medium text-slate-700">{d.matchingFields.join(", ")}</span></div>
            </div>
          ))}
        </div>
      )}
      {tab === "merge" && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 text-center">
          <Database className="w-12 h-12 text-blue-500 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800 mb-1">Identity Resolution Engine</h3>
          <p className="text-xs text-slate-500 mb-4">Automated patient matching using probabilistic and deterministic algorithms</p>
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto text-xs">
            <div className="p-3 bg-slate-50 rounded-lg"><div className="font-bold text-lg text-emerald-600">{mpiRecords.filter((r) => r.matchConfidence === "high").length}</div><div className="text-slate-500">High Confidence</div></div>
            <div className="p-3 bg-slate-50 rounded-lg"><div className="font-bold text-lg text-orange-600">{mpiRecords.filter((r) => r.matchConfidence === "medium").length}</div><div className="text-slate-500">Medium</div></div>
            <div className="p-3 bg-slate-50 rounded-lg"><div className="font-bold text-lg text-red-600">{mpiRecords.filter((r) => r.matchConfidence === "low").length}</div><div className="text-slate-500">Low</div></div>
          </div>
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Screen 09: Provider Registry
// ──────────────────────────────────────────────────────────────────────────────
function ProviderScreen({ searchQuery }: { searchQuery: string }) {
  const filtered = providerRecords.filter((r) => !searchQuery || r.firstName.toLowerCase().includes(searchQuery.toLowerCase()) || r.lastName.toLowerCase().includes(searchQuery.toLowerCase()) || r.specialty.toLowerCase().includes(searchQuery.toLowerCase()) || r.npi.includes(searchQuery));
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h2 className="text-lg font-bold text-slate-800">Provider Registry</h2><p className="text-xs text-slate-500">National Provider Identifier | Directory | {providerRecords.length} Providers</p></div>
        <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700"><Plus className="w-3.5 h-3.5 inline mr-1" />Register Provider</button>
      </div>
      <div className="bg-white border border-slate-200 rounded-lg">
        <table className="w-full text-xs">
          <thead><tr className="border-b border-slate-200 bg-slate-50">
            <th className="text-left p-3 font-semibold text-slate-600">Provider</th>
            <th className="text-left p-3 font-semibold text-slate-600">NPI</th>
            <th className="text-left p-3 font-semibold text-slate-600">Specialty</th>
            <th className="text-left p-3 font-semibold text-slate-600">Department</th>
            <th className="text-left p-3 font-semibold text-slate-600">License</th>
            <th className="text-left p-3 font-semibold text-slate-600">Privileges</th>
            <th className="text-left p-3 font-semibold text-slate-600">Status</th>
          </tr></thead>
          <tbody>{filtered.map((p) => (
            <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50">
              <td className="p-3"><div className="font-medium text-slate-800">{p.lastName}, {p.firstName}</div><div className="text-[10px] text-slate-500">{p.email}</div></td>
              <td className="p-3 font-mono text-slate-700">{p.npi}</td>
              <td className="p-3 text-slate-700">{p.specialty}</td>
              <td className="p-3 text-slate-700">{p.department}</td>
              <td className="p-3"><div className="text-slate-700">{p.licenseNumber}</div><div className={`text-[10px] ${new Date(p.licenseExpiry) < new Date("2026-12-31") ? "text-orange-600" : "text-slate-500"}`}>Exp: {p.licenseExpiry}</div></td>
              <td className="p-3"><div className="flex flex-wrap gap-1">{p.privileges.map((pr) => (<span key={pr} className="px-1.5 py-0.5 bg-slate-50 text-slate-600 rounded text-[10px]">{pr}</span>))}</div></td>
              <td className="p-3"><StatusBadge status={p.status} /></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Screen 10: Terminology Services
// ──────────────────────────────────────────────────────────────────────────────
function TerminologyScreen({ searchQuery }: { searchQuery: string }) {
  const [system, setSystem] = useState("all");
  const filtered = terminologyMappings.filter((m) => {
    if (system !== "all" && m.sourceSystem !== system && m.targetSystem !== system) return false;
    if (searchQuery && !m.sourceCode.toLowerCase().includes(searchQuery.toLowerCase()) && !m.sourceDisplay.toLowerCase().includes(searchQuery.toLowerCase()) && !m.targetCode.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });
  const systems = ["ICD-10", "SNOMED-CT", "LOINC", "RxNorm", "UCUM", "CPT", "NDC"];
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h2 className="text-lg font-bold text-slate-800">Terminology Services</h2><p className="text-xs text-slate-500">Code Systems | Value Sets | Code Mapping | {terminologyMappings.length} Active Mappings</p></div>
        <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700"><Plus className="w-3.5 h-3.5 inline mr-1" />Add Mapping</button>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {systems.map((s) => (
          <button key={s} onClick={() => setSystem(system === s ? "all" : s)} className={`p-2 rounded-lg text-xs font-medium text-center transition-all ${system === s ? "bg-blue-50 text-blue-700 border-2 border-blue-300" : "bg-white border border-slate-200 text-slate-600 hover:border-blue-200"}`}>
            <div className="font-bold">{terminologyMappings.filter((m) => m.sourceSystem === s || m.targetSystem === s).length}</div>
            <div className="text-[10px]">{s}</div>
          </button>
        ))}
      </div>
      <div className="bg-white border border-slate-200 rounded-lg">
        <table className="w-full text-xs">
          <thead><tr className="border-b border-slate-200 bg-slate-50">
            <th className="text-left p-3 font-semibold text-slate-600">Source</th>
            <th className="text-left p-3 font-semibold text-slate-600">Target</th>
            <th className="text-left p-3 font-semibold text-slate-600">Equivalence</th>
            <th className="text-left p-3 font-semibold text-slate-600">Validated</th>
            <th className="text-left p-3 font-semibold text-slate-600">Updated</th>
          </tr></thead>
          <tbody>{filtered.map((m) => (
            <tr key={m.id} className="border-b border-slate-100 hover:bg-slate-50">
              <td className="p-3"><div className="flex items-center gap-2"><ProtocolBadge protocol={m.sourceSystem === "ICD-10" ? "hl7v2" : m.sourceSystem === "LOINC" ? "fhir-r4" : "rest"} /><div><span className="font-mono font-medium text-slate-800">{m.sourceCode}</span><div className="text-[10px] text-slate-500 max-w-[200px] truncate">{m.sourceDisplay}</div></div></div></td>
              <td className="p-3"><div className="flex items-center gap-2"><ProtocolBadge protocol={m.targetSystem === "SNOMED-CT" ? "fhir-r4" : m.targetSystem === "UCUM" ? "dicom" : "rest"} /><div><span className="font-mono font-medium text-slate-800">{m.targetCode}</span><div className="text-[10px] text-slate-500 max-w-[200px] truncate">{m.targetDisplay}</div></div></div></td>
              <td className="p-3"><StatusBadge status={m.equivalence} /></td>
              <td className="p-3">{m.validated ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Clock className="w-4 h-4 text-orange-400" />}</td>
              <td className="p-3 text-slate-500">{new Date(m.lastUpdated).toLocaleDateString()}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Screen 11: External Systems
// ──────────────────────────────────────────────────────────────────────────────
function ExternalScreen({ searchQuery }: { searchQuery: string }) {
  const filtered = externalSystems.filter((s) => !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.type.toLowerCase().includes(searchQuery.toLowerCase()));
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h2 className="text-lg font-bold text-slate-800">External Systems</h2><p className="text-xs text-slate-500">Connected Partners | {externalSystems.filter((s) => s.status === "connected").length}/{externalSystems.length} Online</p></div>
        <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700"><Plus className="w-3.5 h-3.5 inline mr-1" />Connect System</button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {filtered.map((s) => (
          <div key={s.id} className="bg-white border border-slate-200 rounded-lg p-4 hover:border-blue-300 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.status === "connected" ? "bg-emerald-50 text-emerald-600" : s.status === "error" ? "bg-red-50 text-red-600" : "bg-orange-50 text-orange-600"}`}>
                  {s.status === "connected" ? <Wifi className="w-5 h-5" /> : s.status === "error" ? <WifiOff className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
                </div>
                <div><div className="font-semibold text-sm text-slate-800">{s.name}</div><div className="text-[10px] text-slate-500">{s.type} | v{s.version}</div></div>
              </div>
              <StatusBadge status={s.status} />
            </div>
            <div className="space-y-1.5 text-xs mb-3">
              <div className="text-slate-500">Endpoint: <span className="font-mono text-[10px] text-slate-700">{s.endpoint}</span></div>
              <div className="text-slate-500">Sync: <span className="font-medium text-slate-700">{s.syncFrequency}</span></div>
              <div className="text-slate-500">Last Sync: <span className="text-slate-700">{new Date(s.lastSync).toLocaleString()}</span></div>
            </div>
            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
              <span className="text-slate-500">{s.messageCount.toLocaleString()} messages</span>
              <span className={`${s.errorRate > 1 ? "text-red-600" : "text-slate-500"}`}>{s.errorRate}% error</span>
              <button className="text-blue-600 hover:text-blue-700 font-medium">Test Connection</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Screen 12: Interface Monitoring
// ──────────────────────────────────────────────────────────────────────────────
function MonitoringScreen() {
  const [timeRange, setTimeRange] = useState("24h");
  const latestMetrics = monitoringMetrics[monitoringMetrics.length - 1];
  const avgThroughput = Math.round(monitoringMetrics.reduce((sum, m) => sum + m.throughput, 0) / monitoringMetrics.length);
  const avgLatency = Math.round(monitoringMetrics.reduce((sum, m) => sum + m.latencyMs, 0) / monitoringMetrics.length);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h2 className="text-lg font-bold text-slate-800">Interface Monitoring</h2><p className="text-xs text-slate-500">Real-Time Monitoring | Queue Health | Performance Analytics</p></div>
        <div className="flex items-center gap-2">
          <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="px-2 py-1 border border-slate-200 rounded text-xs"><option value="1h">Last Hour</option><option value="24h">Last 24h</option><option value="7d">Last 7 Days</option><option value="30d">Last 30 Days</option></select>
          <button className="px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50"><RefreshCw className="w-3.5 h-3.5" /></button>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-lg p-4"><div className="text-2xl font-bold text-blue-600">{latestMetrics.queueDepth}</div><div className="text-xs text-slate-500 mt-1">Queue Depth</div><MiniBarChart data={monitoringMetrics.slice(-12).map((m) => ({ label: "", value: m.queueDepth, color: "#3b82f6" }))} height={40} /></div>
        <div className="bg-white border border-slate-200 rounded-lg p-4"><div className="text-2xl font-bold text-emerald-600">{latestMetrics.throughput}</div><div className="text-xs text-slate-500 mt-1">Msg/min Throughput</div><MiniBarChart data={monitoringMetrics.slice(-12).map((m) => ({ label: "", value: m.throughput, color: "#10b981" }))} height={40} /></div>
        <div className="bg-white border border-slate-200 rounded-lg p-4"><div className="text-2xl font-bold text-amber-600">{latestMetrics.latencyMs}ms</div><div className="text-xs text-slate-500 mt-1">Avg Latency</div><MiniBarChart data={monitoringMetrics.slice(-12).map((m) => ({ label: "", value: m.latencyMs, color: "#f59e0b" }))} height={40} /></div>
        <div className="bg-white border border-slate-200 rounded-lg p-4"><div className="text-2xl font-bold text-red-600">{latestMetrics.errorCount}</div><div className="text-xs text-slate-500 mt-1">Errors</div><MiniBarChart data={monitoringMetrics.slice(-12).map((m) => ({ label: "", value: m.errorCount, color: "#ef4444" }))} height={40} /></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <h3 className="text-xs font-semibold text-slate-700 mb-3">Queue Depth Over Time</h3>
          <MiniBarChart data={monitoringMetrics.map((m) => ({ label: new Date(m.timestamp).getHours() + ":00", value: m.queueDepth, color: "#3b82f6" }))} height={120} />
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <h3 className="text-xs font-semibold text-slate-700 mb-3">Latency Over Time</h3>
          <MiniBarChart data={monitoringMetrics.map((m) => ({ label: new Date(m.timestamp).getHours() + ":00", value: m.latencyMs, color: m.latencyMs > 100 ? "#ef4444" : "#10b981" }))} height={120} />
        </div>
      </div>
      <div className="bg-white border border-slate-200 rounded-lg p-4">
        <h3 className="text-xs font-semibold text-slate-700 mb-3">Interface Health Status</h3>
        <div className="space-y-2">
          {interfacesData.map((i) => (
            <div key={i.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50">
              <StatusBadge status={i.status} />
              <span className="text-xs font-medium text-slate-800 w-40">{i.name}</span>
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${i.uptime}%`, backgroundColor: i.uptime > 99 ? "#10b981" : i.uptime > 95 ? "#f59e0b" : "#ef4444" }} />
              </div>
              <span className="text-xs text-slate-600 w-16 text-right">{i.uptime}%</span>
              <span className="text-xs text-slate-500 w-20 text-right">{i.avgLatencyMs}ms</span>
              <span className="text-xs text-slate-500 w-20 text-right">{i.messagesPerHour}/hr</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Screen 13: Security Center
// ──────────────────────────────────────────────────────────────────────────────
function SecurityScreen() {
  const [tab, setTab] = useState<"overview" | "certificates" | "events" | "policies">("overview");
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h2 className="text-lg font-bold text-slate-800">Security Center</h2><p className="text-xs text-slate-500">OAuth 2.0 | OpenID Connect | JWT | mTLS | Certificate Management</p></div>
        <span className="flex items-center gap-1.5 text-xs px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-full"><ShieldCheck className="w-3 h-3" /> Security Active</span>
      </div>
      <div className="flex items-center gap-2">
        {(["overview", "certificates", "events", "policies"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${tab === t ? "bg-blue-50 text-blue-700 border border-blue-200" : "text-slate-600 border border-slate-200 hover:bg-slate-50"}`}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
      {tab === "overview" && (
        <>
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-white border border-slate-200 rounded-lg p-4"><div className="flex items-center gap-2 mb-2"><Key className="w-5 h-5 text-blue-600" /><span className="text-xs font-semibold text-slate-700">OAuth 2.0</span></div><div className="text-2xl font-bold text-slate-800">{oauthClients.filter((c) => c.status === "active").length}</div><div className="text-xs text-slate-500">Active Clients</div></div>
            <div className="bg-white border border-slate-200 rounded-lg p-4"><div className="flex items-center gap-2 mb-2"><Shield className="w-5 h-5 text-violet-600" /><span className="text-xs font-semibold text-slate-700">OpenID Connect</span></div><div className="text-2xl font-bold text-slate-800">12</div><div className="text-xs text-slate-500">Active Sessions</div></div>
            <div className="bg-white border border-slate-200 rounded-lg p-4"><div className="flex items-center gap-2 mb-2"><Lock className="w-5 h-5 text-emerald-600" /><span className="text-xs font-semibold text-slate-700">JWT Tokens</span></div><div className="text-2xl font-bold text-slate-800">156</div><div className="text-xs text-slate-500">Issued Today</div></div>
            <div className="bg-white border border-slate-200 rounded-lg p-4"><div className="flex items-center gap-2 mb-2"><Server className="w-5 h-5 text-amber-600" /><span className="text-xs font-semibold text-slate-700">mTLS</span></div><div className="text-2xl font-bold text-slate-800">{certificates.filter((c) => c.status === "valid").length}/{certificates.length}</div><div className="text-xs text-slate-500">Valid Certs</div></div>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <h3 className="text-xs font-semibold text-slate-700 mb-3">Security Events (Unresolved)</h3>
            <div className="space-y-2">{securityEvents.filter((e) => !e.resolved).map((e) => (
              <div key={e.id} className="flex items-center gap-3 p-2 rounded-lg bg-red-50">
                <ShieldAlert className="w-4 h-4 text-red-500" />
                <div className="flex-1"><div className="text-xs font-medium text-red-800">{e.type}</div><div className="text-[10px] text-red-600">{e.description}</div></div>
                <span className="text-[10px] text-red-500">{new Date(e.timestamp).toLocaleString()}</span>
              </div>
            ))}</div>
          </div>
        </>
      )}
      {tab === "certificates" && (
        <div className="bg-white border border-slate-200 rounded-lg">
          <table className="w-full text-xs">
            <thead><tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left p-3 font-semibold text-slate-600">Certificate</th>
              <th className="text-left p-3 font-semibold text-slate-600">Subject</th>
              <th className="text-left p-3 font-semibold text-slate-600">Issuer</th>
              <th className="text-left p-3 font-semibold text-slate-600">Algorithm</th>
              <th className="text-left p-3 font-semibold text-slate-600">Expires</th>
              <th className="text-left p-3 font-semibold text-slate-600">Status</th>
            </tr></thead>
            <tbody>{certificates.map((c) => (
              <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="p-3 font-medium text-slate-800">{c.name}<div className="text-[10px] font-mono text-slate-400">{c.fingerprint.slice(0, 30)}...</div></td>
                <td className="p-3 font-mono text-slate-700">{c.subject}</td>
                <td className="p-3 text-slate-700">{c.issuer}</td>
                <td className="p-3 text-slate-700">{c.algorithm} ({c.keySize} bit)</td>
                <td className="p-3 text-slate-700">{new Date(c.expiresAt).toLocaleDateString()}</td>
                <td className="p-3"><StatusBadge status={c.status} /></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
      {tab === "events" && (
        <div className="bg-white border border-slate-200 rounded-lg">
          <table className="w-full text-xs">
            <thead><tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left p-3 font-semibold text-slate-600">Event</th>
              <th className="text-left p-3 font-semibold text-slate-600">Severity</th>
              <th className="text-left p-3 font-semibold text-slate-600">Source</th>
              <th className="text-left p-3 font-semibold text-slate-600">User</th>
              <th className="text-left p-3 font-semibold text-slate-600">Time</th>
              <th className="text-left p-3 font-semibold text-slate-600">Status</th>
            </tr></thead>
            <tbody>{securityEvents.map((e) => (
              <tr key={e.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="p-3"><div className="font-medium text-slate-800">{e.type}</div><div className="text-[10px] text-slate-500 max-w-[300px] truncate">{e.description}</div></td>
                <td className="p-3"><StatusBadge status={e.severity} /></td>
                <td className="p-3 text-slate-700">{e.source}</td>
                <td className="p-3 text-slate-700">{e.user || "System"}</td>
                <td className="p-3 text-slate-500">{new Date(e.timestamp).toLocaleString()}</td>
                <td className="p-3">{e.resolved ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-red-500" />}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
      {tab === "policies" && (
        <div className="grid grid-cols-2 gap-3">
          {[{ name: "Token Expiry Policy", desc: "Access tokens expire in 1 hour, refresh tokens in 30 days", status: "active" },
            { name: "Rate Limiting Policy", desc: "1000 req/min for standard clients, 100 req/min for analytics", status: "active" },
            { name: "CORS Policy", desc: "Allowlisted origins for cross-origin requests", status: "active" },
            { name: "Certificate Rotation", desc: "Automatic rotation 30 days before expiry", status: "active" },
            { name: "IP Allowlisting", desc: "Restrict API access to registered IP ranges", status: "active" },
            { name: "Data Encryption", desc: "AES-256 at rest, TLS 1.3 in transit", status: "active" },
          ].map((p) => (
            <div key={p.name} className="bg-white border border-slate-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm text-slate-800">{p.name}</span>
                <StatusBadge status={p.status} />
              </div>
              <p className="text-xs text-slate-500">{p.desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Screen 14: Audit Logs
// ──────────────────────────────────────────────────────────────────────────────
function AuditScreen({ searchQuery }: { searchQuery: string }) {
  const [filter, setFilter] = useState("all");
  const filtered = auditEntries.filter((e) => {
    if (filter !== "all" && e.status !== filter) return false;
    if (searchQuery && !e.action.toLowerCase().includes(searchQuery.toLowerCase()) && !e.userName.toLowerCase().includes(searchQuery.toLowerCase()) && !e.correlationId.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h2 className="text-lg font-bold text-slate-800">Audit Logs</h2><p className="text-xs text-slate-500">Immutable Transaction Trail | Compliance | {auditEntries.length} Entries</p></div>
        <div className="flex items-center gap-2">
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="px-2 py-1 border border-slate-200 rounded text-xs"><option value="all">All Status</option><option value="success">Success</option><option value="failed">Failed</option></select>
          <button className="px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50"><Download className="w-3.5 h-3.5 inline mr-1" />Export CSV</button>
        </div>
      </div>
      <div className="bg-white border border-slate-200 rounded-lg">
        <table className="w-full text-xs">
          <thead><tr className="border-b border-slate-200 bg-slate-50">
            <th className="text-left p-3 font-semibold text-slate-600">Timestamp</th>
            <th className="text-left p-3 font-semibold text-slate-600">Action</th>
            <th className="text-left p-3 font-semibold text-slate-600">User</th>
            <th className="text-left p-3 font-semibold text-slate-600">Source</th>
            <th className="text-left p-3 font-semibold text-slate-600">Destination</th>
            <th className="text-left p-3 font-semibold text-slate-600">Correlation</th>
            <th className="text-left p-3 font-semibold text-slate-600">Status</th>
          </tr></thead>
          <tbody>{filtered.map((e) => (
            <tr key={e.id} className="border-b border-slate-100 hover:bg-slate-50">
              <td className="p-3 text-slate-500">{new Date(e.timestamp).toLocaleString()}</td>
              <td className="p-3"><span className="font-medium text-slate-800">{e.action.replace(/_/g, " ")}</span><div className="text-[10px] text-slate-500 max-w-[200px] truncate">{e.details}</div></td>
              <td className="p-3 text-slate-700">{e.userName}</td>
              <td className="p-3 text-slate-700">{e.sourceSystem}</td>
              <td className="p-3 text-slate-700">{e.destinationSystem}</td>
              <td className="p-3 font-mono text-[10px] text-slate-500">{e.correlationId}</td>
              <td className="p-3"><StatusBadge status={e.status} /></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Screen 15: Reports & Analytics
// ──────────────────────────────────────────────────────────────────────────────
function ReportsScreen() {
  const [reportType, setReportType] = useState("volume");
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h2 className="text-lg font-bold text-slate-800">Reports & Analytics</h2><p className="text-xs text-slate-500">Executive Dashboard | Performance Reports | Partner Analytics</p></div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700"><Download className="w-3.5 h-3.5 inline mr-1" />Generate Report</button>
          <button className="px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50"><BarChart3 className="w-3.5 h-3.5 inline mr-1" />Schedule</button>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total Messages", value: dashboardKpis.hl7Messages.toLocaleString(), icon: <MessageSquare className="w-5 h-5" />, color: "text-blue-600" },
          { label: "FHIR Requests", value: dashboardKpis.fhirRequests.toLocaleString(), icon: <Globe className="w-5 h-5" />, color: "text-emerald-600" },
          { label: "API Calls", value: apiEndpoints.reduce((s, e) => s + e.totalCalls, 0).toLocaleString(), icon: <Terminal className="w-5 h-5" />, color: "text-violet-600" },
          { label: "Error Rate", value: dashboardKpis.errorRate + "%", icon: <AlertTriangle className="w-5 h-5" />, color: "text-red-600" },
        ].map((k) => (
          <div key={k.label} className="bg-white border border-slate-200 rounded-lg p-4">
            <div className={`${k.color} mb-2`}>{k.icon}</div>
            <div className="text-xl font-bold text-slate-800">{k.value}</div>
            <div className="text-xs text-slate-500">{k.label}</div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        {(["volume", "performance", "errors", "partners"] as const).map((t) => (
          <button key={t} onClick={() => setReportType(t)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${reportType === t ? "bg-blue-50 text-blue-700 border border-blue-200" : "text-slate-600 border border-slate-200 hover:bg-slate-50"}`}>
            {t === "volume" ? "Message Volume" : t === "performance" ? "Performance" : t === "errors" ? "Error Trends" : "Partner Activity"}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <h3 className="text-xs font-semibold text-slate-700 mb-3">Message Volume by Hour</h3>
          <MiniBarChart data={chartData.messageVolume.map((d) => ({ ...d, color: "#3b82f6" }))} height={140} />
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <h3 className="text-xs font-semibold text-slate-700 mb-3">Protocol Distribution</h3>
          <div className="space-y-3 mt-4">
            {chartData.protocolDistribution.map((p) => (
              <div key={p.label} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
                <span className="text-xs text-slate-600 w-20">{p.label}</span>
                <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${p.value}%`, backgroundColor: p.color }} />
                </div>
                <span className="text-xs font-medium text-slate-800 w-10 text-right">{p.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-white border border-slate-200 rounded-lg p-4">
        <h3 className="text-xs font-semibold text-slate-700 mb-3">Interface Performance Summary</h3>
        <table className="w-full text-xs">
          <thead><tr className="border-b border-slate-200">
            <th className="text-left p-2 font-semibold text-slate-600">Interface</th>
            <th className="text-left p-2 font-semibold text-slate-600">Messages/hr</th>
            <th className="text-left p-2 font-semibold text-slate-600">Avg Latency</th>
            <th className="text-left p-2 font-semibold text-slate-600">Error Rate</th>
            <th className="text-left p-2 font-semibold text-slate-600">Uptime</th>
            <th className="text-left p-2 font-semibold text-slate-600">Trend</th>
          </tr></thead>
          <tbody>{interfacesData.map((i) => (
            <tr key={i.id} className="border-b border-slate-50 hover:bg-slate-50">
              <td className="p-2 font-medium text-slate-800">{i.name}</td>
              <td className="p-2 text-slate-700">{i.messagesPerHour}</td>
              <td className="p-2 text-slate-700">{i.avgLatencyMs}ms</td>
              <td className={`p-2 ${i.errorRate > 1 ? "text-red-600" : "text-slate-700"}`}>{i.errorRate}%</td>
              <td className="p-2 text-slate-700">{i.uptime}%</td>
              <td className="p-2">{i.errorRate > 1 ? <TrendingDown className="w-3 h-3 text-red-500" /> : <TrendingUp className="w-3 h-3 text-emerald-500" />}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Screen 16: Configuration
// ──────────────────────────────────────────────────────────────────────────────
function ConfigScreen() {
  const [tab, setTab] = useState<"profiles" | "transformations" | "connections" | "environments">("profiles");
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h2 className="text-lg font-bold text-slate-800">Configuration</h2><p className="text-xs text-slate-500">Integration Profiles | Transformation Rules | Connection Settings</p></div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700"><Save className="w-3.5 h-3.5 inline mr-1" />Save Configuration</button>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {(["profiles", "transformations", "connections", "environments"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${tab === t ? "bg-blue-50 text-blue-700 border border-blue-200" : "text-slate-600 border border-slate-200 hover:bg-slate-50"}`}>
            {t === "profiles" ? "Integration Profiles" : t === "transformations" ? "Transformation Rules" : t === "connections" ? "Connection Settings" : "Environments"}
          </button>
        ))}
      </div>
      {tab === "profiles" && (
        <div className="space-y-3">
          {[{ name: "Epic EMR Integration", desc: "ADT feed from Epic to HMIS Core", protocol: "HL7v2", status: "active" },
            { name: "FHIR R4 API Gateway", desc: "External FHIR API access", protocol: "FHIR-R4", status: "active" },
            { name: "PACS DICOM Router", desc: "DICOM study routing to cloud", protocol: "DICOM", status: "active" },
            { name: "LabCorp Interface", desc: "Lab results from LabCorp", protocol: "HL7v2", status: "active" },
            { name: "CMS Claims Feed", desc: "Claims submission to CMS", protocol: "HL7v2", status: "failed" },
          ].map((p) => (
            <div key={p.name} className="bg-white border border-slate-200 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600"><Workflow className="w-5 h-5" /></div>
                <div><div className="font-semibold text-sm text-slate-800">{p.name}</div><div className="text-xs text-slate-500">{p.desc}</div></div>
              </div>
              <div className="flex items-center gap-3">
                <ProtocolBadge protocol={p.protocol.toLowerCase().replace("-", "")} />
                <StatusBadge status={p.status} />
                <button className="text-xs text-blue-600 hover:text-blue-700">Edit</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {tab === "transformations" && (
        <div className="bg-white border border-slate-200 rounded-lg">
          <table className="w-full text-xs">
            <thead><tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left p-3 font-semibold text-slate-600">Rule Name</th>
              <th className="text-left p-3 font-semibold text-slate-600">Source Format</th>
              <th className="text-left p-3 font-semibold text-slate-600">Target Format</th>
              <th className="text-left p-3 font-semibold text-slate-600">Mappings</th>
              <th className="text-left p-3 font-semibold text-slate-600">Status</th>
              <th className="text-left p-3 font-semibold text-slate-600">Actions</th>
            </tr></thead>
            <tbody>{transformationRules.map((r) => (
              <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="p-3 font-medium text-slate-800">{r.name}<div className="text-[10px] text-slate-400">v{r.version}</div></td>
                <td className="p-3"><span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-mono">{r.sourceFormat}</span></td>
                <td className="p-3"><span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] font-mono">{r.targetFormat}</span></td>
                <td className="p-3 text-slate-700">{r.mappings} fields</td>
                <td className="p-3"><StatusBadge status={r.status} /></td>
                <td className="p-3"><button className="text-blue-600 hover:text-blue-700 mr-2">Edit</button><button className="text-slate-500 hover:text-slate-700">Test</button></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
      {tab === "connections" && (
        <div className="grid grid-cols-2 gap-3">
          {[{ name: "MLLP Listener", port: 5100, status: "active", tls: true },
            { name: "FHIR HTTPS", port: 443, status: "active", tls: true },
            { name: "DICOM SCP", port: 11112, status: "active", tls: false },
            { name: "REST API", port: 8443, status: "active", tls: true },
            { name: "GraphQL", port: 8444, status: "active", tls: true },
            { name: "Webhook Listener", port: 9090, status: "maintenance", tls: true },
          ].map((c) => (
            <div key={c.name} className="bg-white border border-slate-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm text-slate-800">{c.name}</span>
                <StatusBadge status={c.status} />
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span>Port: <span className="font-mono font-medium text-slate-700">{c.port}</span></span>
                <span>TLS: {c.tls ? <Lock className="w-3 h-3 inline text-emerald-500" /> : <span className="text-orange-500">No</span>}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      {tab === "environments" && (
        <div className="grid grid-cols-3 gap-4">
          {[{ name: "Sandbox", desc: "Development & testing", env: "sandbox", status: "active" },
            { name: "Staging", desc: "Pre-production validation", env: "staging", status: "active" },
            { name: "Production", desc: "Live environment", env: "production", status: "active" },
          ].map((e) => (
            <div key={e.name} className="bg-white border border-slate-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-sm text-slate-800">{e.name}</span>
                <StatusBadge status={e.status} />
              </div>
              <p className="text-xs text-slate-500 mb-3">{e.desc}</p>
              <div className="space-y-1 text-xs">
                <div className="text-slate-500">URL: <span className="font-mono text-slate-700">https://{e.env}.hospital.org</span></div>
                <div className="text-slate-500">Interfaces: <span className="font-medium text-slate-700">{interfacesData.filter((i) => i.environment === e.env).length}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Screen 17: Disaster Recovery
// ──────────────────────────────────────────────────────────────────────────────
function DrScreen() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h2 className="text-lg font-bold text-slate-800">Disaster Recovery</h2><p className="text-xs text-slate-500">Backup | Replication | Failover | Business Continuity</p></div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700"><Play className="w-3.5 h-3.5 inline mr-1" />Run DR Drill</button>
          <button className="px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50"><Download className="w-3.5 h-3.5 inline mr-1" />Export Report</button>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-lg p-4 text-center"><div className="text-2xl font-bold text-emerald-600">{backupRecords.filter((b) => b.status === "completed").length}/{backupRecords.length}</div><div className="text-xs text-slate-500">Backups Completed</div></div>
        <div className="bg-white border border-slate-200 rounded-lg p-4 text-center"><div className="text-2xl font-bold text-emerald-600">{drDrills.filter((d) => d.status === "passed").length}/{drDrills.length}</div><div className="text-xs text-slate-500">DR Drills Passed</div></div>
        <div className="bg-white border border-slate-200 rounded-lg p-4 text-center"><div className="text-2xl font-bold text-blue-600">15 min</div><div className="text-xs text-slate-500">Target RTO</div></div>
        <div className="bg-white border border-slate-200 rounded-lg p-4 text-center"><div className="text-2xl font-bold text-blue-600">5 min</div><div className="text-xs text-slate-500">Target RPO</div></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <h3 className="text-xs font-semibold text-slate-700 mb-3">Backup Status</h3>
          <div className="space-y-2">{backupRecords.map((b) => (
            <div key={b.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50">
              <div className={`w-7 h-7 rounded flex items-center justify-center ${b.status === "completed" ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"}`}>
                {b.status === "completed" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-slate-800">{b.name}</div>
                <div className="text-[10px] text-slate-500">{b.type} | {b.size} | Retention: {b.retention}</div>
              </div>
              <span className="text-[10px] text-slate-400">{new Date(b.timestamp).toLocaleDateString()}</span>
            </div>
          ))}</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <h3 className="text-xs font-semibold text-slate-700 mb-3">DR Drill History</h3>
          <div className="space-y-2">{drDrills.map((d) => (
            <div key={d.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50">
              <StatusBadge status={d.status} />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-slate-800">{d.name}</div>
                <div className="text-[10px] text-slate-500">RTO: {d.rto} | RPO: {d.rpo} | Duration: {d.duration}</div>
              </div>
              <span className="text-xs font-medium text-slate-700">{d.successRate}%</span>
            </div>
          ))}</div>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Screen 18: Workflow Complete
// ──────────────────────────────────────────────────────────────────────────────
function WorkflowScreen({ setScreen }: { setScreen: (s: Screen) => void }) {
  const steps = [
    { label: "Authentication", status: "completed", detail: "OAuth 2.0 token validated" },
    { label: "Authorization", status: "completed", detail: "Scope: patient/*.read verified" },
    { label: "Validation", status: "completed", detail: "Message schema validated" },
    { label: "Terminology Mapping", status: "completed", detail: "ICD-10 to SNOMED CT mapped" },
    { label: "Message Transformation", status: "completed", detail: "HL7v2 to FHIR R4 transformed" },
    { label: "Routing", status: "completed", detail: "Message routed to destination" },
    { label: "Destination Processing", status: "completed", detail: "Patient resource created" },
    { label: "Acknowledgement", status: "completed", detail: "ACK received from destination" },
    { label: "Monitoring", status: "completed", detail: "Metrics updated in real-time" },
    { label: "Audit Logging", status: "completed", detail: "Immutable audit record created" },
    { label: "Analytics", status: "completed", detail: "Dashboard KPIs refreshed" },
  ];
  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Interoperability Workflow Complete</h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">All integration steps completed successfully. Transaction authenticated, validated, transformed, routed, acknowledged, monitored, and audit-logged.</p>
      </div>
      <div className="max-w-2xl mx-auto space-y-2">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg">
            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /></div>
            <span className="text-sm font-medium text-slate-800 flex-1">{s.label}</span>
            <span className="text-xs text-emerald-600">{s.detail}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-3">
        <button onClick={() => setScreen("dashboard")} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"><LayoutDashboard className="w-4 h-4 inline mr-1.5" />Return to Dashboard</button>
        <button className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50"><Download className="w-4 h-4 inline mr-1.5" />Generate Integration Report</button>
      </div>
    </div>
  );
}
