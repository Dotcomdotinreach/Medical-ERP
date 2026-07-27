// ──────────────────────────────────────────────────────────────────────────────
// Enterprise Interoperability Hub — UI Components
// ──────────────────────────────────────────────────────────────────────────────
import React from "react";
import { ArrowRight, ArrowLeft, Clock, CheckCircle2, XCircle, AlertTriangle, RefreshCw, Activity, Shield, Wifi, WifiOff, Eye, Copy, ExternalLink, ChevronRight, Server, Database, Globe, Lock, Key, FileText, Zap, Radio, Send, Download, Upload, Settings, RotateCcw, Trash2, Search, Filter, Plus, Minus, BarChart3, TrendingUp, TrendingDown, Minus as MinusIcon } from "lucide-react";
import { getStatusColor } from "./data";

interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md";
}

export function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const cls = getStatusColor(status);
  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${cls} ${size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs"}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cls.includes("emerald") ? "bg-emerald-500" : cls.includes("blue") ? "bg-blue-500" : cls.includes("orange") ? "bg-orange-500" : cls.includes("red") ? "bg-red-500" : cls.includes("violet") ? "bg-violet-500" : "bg-slate-400"}`} />
      {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
    </span>
  );
}

interface InterfaceCardProps {
  iface: {
    id: string; name: string; direction: string; protocol: string; status: string;
    sourceSystem: string; destinationSystem: string; messageType: string;
    messagesPerHour: number; avgLatencyMs: number; errorRate: number;
    uptime: number; lastActivity: string; version: string; environment: string;
  };
  onClick?: () => void;
}

export function InterfaceCard({ iface, onClick }: InterfaceCardProps) {
  return (
    <div onClick={onClick} className="bg-white border border-slate-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iface.direction === "inbound" ? "bg-blue-50 text-blue-600" : "bg-violet-50 text-violet-600"}`}>
            {iface.direction === "inbound" ? <Download className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
          </div>
          <div>
            <div className="font-semibold text-sm text-slate-800">{iface.name}</div>
            <div className="text-xs text-slate-500">{iface.id} | v{iface.version}</div>
          </div>
        </div>
        <StatusBadge status={iface.status} />
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
        <div className="text-slate-500">Protocol: <span className="font-medium text-slate-700 uppercase">{iface.protocol}</span></div>
        <div className="text-slate-500">Type: <span className="font-medium text-slate-700">{iface.messageType}</span></div>
        <div className="text-slate-500">From: <span className="font-medium text-slate-700">{iface.sourceSystem}</span></div>
        <div className="text-slate-500">To: <span className="font-medium text-slate-700">{iface.destinationSystem}</span></div>
      </div>
      <div className="flex items-center gap-4 text-xs pt-2 border-t border-slate-100">
        <span className="text-slate-500">{iface.messagesPerHour} msg/hr</span>
        <span className="text-slate-500">{iface.avgLatencyMs}ms avg</span>
        <span className={`${iface.errorRate > 1 ? "text-red-600" : "text-slate-500"}`}>{iface.errorRate}% err</span>
        <span className="text-slate-500 ml-auto">{iface.uptime}% up</span>
      </div>
    </div>
  );
}

interface MessageCardProps {
  msg: {
    id: string; messageType: string; status: string; direction: string;
    sourceSystem: string; destinationSystem: string; correlationId: string;
    timestamp: string; retryCount: number; maxRetries: number; error?: string; size: number;
  };
  onClick?: () => void;
}

export function MessageCard({ msg, onClick }: MessageCardProps) {
  return (
    <div onClick={onClick} className="bg-white border border-slate-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded flex items-center justify-center ${msg.direction === "inbound" ? "bg-blue-50 text-blue-600" : "bg-violet-50 text-violet-600"}`}>
            {msg.direction === "inbound" ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </div>
          <div>
            <span className="font-mono text-xs font-bold text-slate-800">{msg.messageType}</span>
            <span className="text-xs text-slate-400 ml-2">{msg.id}</span>
          </div>
        </div>
        <StatusBadge status={msg.status} />
      </div>
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
        <span>{msg.sourceSystem}</span>
        <ChevronRight className="w-3 h-3" />
        <span>{msg.destinationSystem}</span>
      </div>
      <div className="flex items-center gap-3 text-xs">
        <span className="text-slate-400 font-mono">{msg.correlationId}</span>
        {msg.retryCount > 0 && <span className="text-orange-600">Retry {msg.retryCount}/{msg.maxRetries}</span>}
        {msg.error && <span className="text-red-600 truncate max-w-[200px]">{msg.error}</span>}
      </div>
      <div className="text-xs text-slate-400 mt-2">
        {new Date(msg.timestamp).toLocaleString()} | {(msg.size / 1024).toFixed(1)} KB
      </div>
    </div>
  );
}

interface FhirResourceCardProps {
  endpoint: {
    resource: string; endpoint: string; method: string; totalRequests: number;
    avgResponseMs: number; errorRate: number; lastAccessed: string; supported: boolean;
  };
}

export function FhirResourceCard({ endpoint }: FhirResourceCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 hover:border-emerald-300 transition-all">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center"><Globe className="w-4 h-4" /></div>
          <div>
            <div className="font-semibold text-sm text-slate-800">{endpoint.resource}</div>
            <div className="text-xs text-slate-500 font-mono">{endpoint.endpoint}</div>
          </div>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full ${endpoint.supported ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>{endpoint.supported ? "Supported" : "Unsupported"}</span>
      </div>
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="text-center p-2 bg-slate-50 rounded"><div className="font-bold text-slate-800">{endpoint.method}</div><div className="text-slate-500">Methods</div></div>
        <div className="text-center p-2 bg-slate-50 rounded"><div className="font-bold text-slate-800">{endpoint.totalRequests.toLocaleString()}</div><div className="text-slate-500">Requests</div></div>
        <div className="text-center p-2 bg-slate-50 rounded"><div className={`font-bold ${endpoint.errorRate > 0.5 ? "text-red-600" : "text-slate-800"}`}>{endpoint.avgResponseMs}ms</div><div className="text-slate-500">Avg Latency</div></div>
      </div>
    </div>
  );
}

interface QueueCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  color: string;
  trend?: number;
}

export function QueueCard({ title, count, icon, color, trend }: QueueCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>{icon}</div>
        {trend !== undefined && (
          <span className={`text-xs flex items-center gap-1 ${trend >= 0 ? "text-emerald-600" : "text-red-600"}`}>
            {trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-slate-800">{count.toLocaleString()}</div>
      <div className="text-xs text-slate-500 mt-1">{title}</div>
    </div>
  );
}

interface TimelineEntryProps {
  timestamp: string;
  action: string;
  detail: string;
  status: string;
}

export function TimelineEntry({ timestamp, action, detail, status }: TimelineEntryProps) {
  return (
    <div className="flex items-start gap-3 pb-4">
      <div className="mt-1">
        {status === "success" ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> :
         status === "failed" ? <XCircle className="w-4 h-4 text-red-500" /> :
         <Clock className="w-4 h-4 text-blue-500" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm text-slate-800">{action}</span>
          <StatusBadge status={status} size="sm" />
        </div>
        <div className="text-xs text-slate-500 mt-0.5">{detail}</div>
        <div className="text-xs text-slate-400 mt-0.5">{new Date(timestamp).toLocaleString()}</div>
      </div>
    </div>
  );
}

interface MiniBarChartProps {
  data: { label: string; value: number; color?: string }[];
  maxValue?: number;
  height?: number;
}

export function MiniBarChart({ data, maxValue, height = 80 }: MiniBarChartProps) {
  const max = maxValue || Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex items-end gap-1" style={{ height }}>
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full rounded-t" style={{ height: `${(d.value / max) * 100}%`, backgroundColor: d.color || "#3b82f6", minHeight: 2 }} />
          <span className="text-[9px] text-slate-500 truncate w-full text-center">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

interface SecurityBadgeProps {
  method: string;
}

export function SecurityBadge({ method }: SecurityBadgeProps) {
  const icons: Record<string, React.ReactNode> = {
    oauth2: <Key className="w-3 h-3" />,
    "openid-connect": <Shield className="w-3 h-3" />,
    jwt: <Lock className="w-3 h-3" />,
    mtls: <Server className="w-3 h-3" />,
    "api-key": <FileText className="w-3 h-3" />,
  };
  const colors: Record<string, string> = {
    oauth2: "bg-blue-50 text-blue-600",
    "openid-connect": "bg-violet-50 text-violet-600",
    jwt: "bg-emerald-50 text-emerald-600",
    mtls: "bg-orange-50 text-orange-600",
    "api-key": "bg-slate-100 text-slate-600",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${colors[method] || "bg-slate-100 text-slate-600"}`}>
      {icons[method] || <Lock className="w-3 h-3" />}
      {method}
    </span>
  );
}

interface ProtocolBadgeProps {
  protocol: string;
}

export function ProtocolBadge({ protocol }: ProtocolBadgeProps) {
  const colors: Record<string, string> = {
    hl7v2: "bg-blue-50 text-blue-700", "fhir-r4": "bg-emerald-50 text-emerald-700",
    "fhir-r5": "bg-teal-50 text-teal-700", dicom: "bg-amber-50 text-amber-700",
    rest: "bg-violet-50 text-violet-700", graphql: "bg-pink-50 text-pink-700",
    webhook: "bg-orange-50 text-orange-700", soap: "bg-slate-100 text-slate-700",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium ${colors[protocol] || "bg-slate-100 text-slate-600"}`}>
      {protocol.toUpperCase()}
    </span>
  );
}

interface ProgressRingProps {
  value: number;
  max: number;
  size?: number;
  color?: string;
}

export function ProgressRing({ value, max, size = 48, color = "#3b82f6" }: ProgressRingProps) {
  const pct = Math.min((value / max) * 100, 100);
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth="4" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="4" strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
      <text x={size / 2} y={size / 2} textAnchor="middle" dominantBaseline="central" className="text-[10px] font-bold fill-slate-700" transform={`rotate(90 ${size / 2} ${size / 2})`}>{Math.round(pct)}%</text>
    </svg>
  );
}
