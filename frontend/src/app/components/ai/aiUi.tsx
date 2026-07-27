import type { ReactNode } from "react";
import { AlertTriangle, CheckCircle2, Info, XCircle, TrendingUp, TrendingDown, Minus, Brain, Shield, Clock, Star, Users, BarChart3 } from "lucide-react";
import { riskColor, confidenceColor, confidenceLabel, statusBadge, severityColor } from "./data";

// ── Prediction Card ──
export function PredictionCard({ label, score, confidence, status, model, timestamp, children }: { label: string; score: number; confidence: number; status: string; model: string; timestamp: string; children?: ReactNode }) {
  const rc = riskColor(score);
  const cc = confidenceColor(confidence);
  const cl = confidenceLabel(confidence);
  const sb = statusBadge(status);
  return (
    <div className="border rounded-lg p-4 bg-white space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-800">{label}</span>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${sb}`}>{status}</span>
      </div>
      <div className="flex items-center gap-4">
        <div className={`px-3 py-2 rounded-lg border ${rc}`}>
          <div className="text-2xl font-bold">{(score * 100).toFixed(0)}%</div>
          <div className="text-xs text-slate-500">Risk Score</div>
        </div>
        <div className="flex-1 space-y-1">
          <div className={`text-sm font-medium ${cc}`}>Confidence: {(confidence * 100).toFixed(0)}% ({cl})</div>
          <div className="text-xs text-slate-500">Model: {model}</div>
          <div className="text-xs text-slate-400">{timestamp}</div>
        </div>
      </div>
      {children}
    </div>
  );
}

// ── Risk Card ──
export function RiskCard({ title, score, subtitle, icon }: { title: string; score: number; subtitle: string; icon?: ReactNode }) {
  const rc = riskColor(score);
  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-sm font-medium text-slate-700">{title}</span>
      </div>
      <div className={`text-3xl font-bold ${rc.split(" ")[0]}`}>{(score * 100).toFixed(0)}%</div>
      <div className="text-xs text-slate-500 mt-1">{subtitle}</div>
    </div>
  );
}

// ── Forecast Card ──
export function ForecastCard({ metric, current, predicted, unit, confidence, trend, model }: { metric: string; current: number; predicted: number; unit: string; confidence: number; trend: string; model: string }) {
  const diff = predicted - current;
  const diffPct = current > 0 ? ((diff / current) * 100).toFixed(1) : "0";
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor = trend === "up" ? "text-orange-500" : trend === "down" ? "text-green-500" : "text-slate-400";
  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="text-sm font-medium text-slate-700 mb-1">{metric}</div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-slate-900">{typeof current === "number" && current > 10000 ? `${(current / 100000).toFixed(1)}L` : current}{unit === "%" ? "%" : ""}</span>
        <TrendIcon className={`w-5 h-5 ${trendColor}`} />
        <span className="text-lg font-medium text-slate-600">{typeof predicted === "number" && predicted > 10000 ? `${(predicted / 100000).toFixed(1)}L` : predicted}{unit === "%" ? "%" : ""}</span>
      </div>
      <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
        <span>{diff > 0 ? "+" : ""}{diffPct}% predicted</span>
        <span>|</span>
        <span>{(confidence * 100).toFixed(0)}% confidence</span>
      </div>
      <div className="text-xs text-slate-400 mt-1">{model}</div>
    </div>
  );
}

// ── AI Insight Card ──
export function AiInsightCard({ title, content, type, source }: { title: string; content: string; type: "info" | "warning" | "success" | "error"; source: string }) {
  const icons = { info: <Info className="w-4 h-4 text-blue-500" />, warning: <AlertTriangle className="w-4 h-4 text-yellow-500" />, success: <CheckCircle2 className="w-4 h-4 text-emerald-500" />, error: <XCircle className="w-4 h-4 text-red-500" /> };
  const borders = { info: "border-l-blue-500", warning: "border-l-yellow-500", success: "border-l-emerald-500", error: "border-l-red-500" };
  return (
    <div className={`border rounded-lg p-4 bg-white border-l-4 ${borders[type]}`}>
      <div className="flex items-center gap-2 mb-2">
        {icons[type]}
        <span className="text-sm font-semibold text-slate-800">{title}</span>
      </div>
      <p className="text-sm text-slate-600 mb-2">{content}</p>
      <div className="text-xs text-slate-400">Source: {source}</div>
    </div>
  );
}

// ── Executive KPI Card ──
export function ExecutiveKpiCard({ name, value, change, trend, target, status, category }: { name: string; value: string; change: number; trend: string; target: string; status: string; category: string }) {
  const trendColor = trend === "up" ? "text-emerald-600" : trend === "down" ? "text-red-600" : "text-slate-400";
  const statusColor = status === "on_track" ? "text-emerald-600" : status === "at_risk" ? "text-yellow-600" : "text-red-600";
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="text-xs text-slate-500 mb-1">{category}</div>
      <div className="text-sm font-semibold text-slate-800 mb-1">{name}</div>
      <div className="text-2xl font-bold text-slate-900">{value}</div>
      <div className="flex items-center gap-1 mt-2">
        <TrendIcon className={`w-4 h-4 ${trendColor}`} />
        <span className={`text-sm font-medium ${trendColor}`}>{change > 0 ? "+" : ""}{change}%</span>
      </div>
      <div className="flex items-center justify-between mt-2 text-xs">
        <span className="text-slate-500">Target: {target}</span>
        <span className={`font-medium ${statusColor}`}>{status.replace("_", " ")}</span>
      </div>
    </div>
  );
}

// ── Model Card ──
export function ModelCard({ name, version, accuracy, status, drift, category, department }: { name: string; version: string; accuracy: number; status: string; drift: string; category: string; department: string }) {
  const sb = statusBadge(status);
  const dc = drift === "normal" ? "text-emerald-600" : drift === "warning" ? "text-yellow-600" : "text-red-600";
  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="flex items-center justify-between mb-2">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${sb}`}>{status}</span>
        <span className="text-xs text-slate-400">v{version}</span>
      </div>
      <div className="text-sm font-semibold text-slate-800 mb-1">{name}</div>
      <div className="text-xs text-slate-500 mb-2">{category} | {department}</div>
      <div className="flex items-center justify-between">
        <div className="text-lg font-bold text-slate-900">{(accuracy * 100).toFixed(1)}%</div>
        <div className={`text-xs font-medium ${dc}`}>Drift: {drift}</div>
      </div>
    </div>
  );
}

// ── Explainability Panel ──
export function ExplainabilityPanel({ factors, confidence }: { factors: { feature: string; importance: number; direction: string; description: string }[]; confidence: number }) {
  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="flex items-center gap-2 mb-3">
        <Brain className="w-4 h-4 text-indigo-500" />
        <span className="text-sm font-semibold text-slate-800">Explainability</span>
        <span className={`text-xs font-medium ${confidenceColor(confidence)}`}>{(confidence * 100).toFixed(0)}% confidence</span>
      </div>
      <div className="space-y-2">
        {factors.map((f, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-24 text-xs text-slate-600 truncate">{f.feature}</div>
            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${f.direction === "positive" ? "bg-red-400" : "bg-emerald-400"}`} style={{ width: `${f.importance * 100}%` }} />
            </div>
            <span className="text-xs text-slate-500 w-10 text-right">{(f.importance * 100).toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Governance Card ──
export function GovernanceCard({ modelName, version, status, committee, fairnessScore, biasStatus }: { modelName: string; version: string; status: string; committee: string; fairnessScore: number; biasStatus: string }) {
  const sb = statusBadge(status);
  const bc = biasStatus === "pass" ? "text-emerald-600" : biasStatus === "warning" ? "text-yellow-600" : "text-red-600";
  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="flex items-center justify-between mb-2">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${sb}`}>{status}</span>
        <span className="text-xs text-slate-400">v{version}</span>
      </div>
      <div className="text-sm font-semibold text-slate-800 mb-1">{modelName}</div>
      <div className="text-xs text-slate-500 mb-2">{committee}</div>
      <div className="flex items-center gap-4 text-xs">
        <span className="text-slate-600">Fairness: <span className="font-medium">{(fairnessScore * 100).toFixed(1)}%</span></span>
        <span className={`font-medium ${bc}`}>Bias: {biasStatus}</span>
      </div>
    </div>
  );
}

// ── Audit Log Row ──
export function AuditLogRow({ timestamp, user, action, entity, details }: { timestamp: string; user: string; action: string; entity: string; details: string }) {
  const ac = action === "approved" ? "text-emerald-600" : action === "rejected" ? "text-red-600" : action === "deployed" ? "text-blue-600" : "text-slate-600";
  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0">
      <div className="w-2 h-2 rounded-full bg-slate-300 mt-1.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">{timestamp}</span>
          <span className={`text-xs font-medium ${ac}`}>{action}</span>
        </div>
        <div className="text-sm text-slate-700 mt-0.5">{entity}</div>
        <div className="text-xs text-slate-500 mt-0.5">{user}</div>
        <div className="text-xs text-slate-400 mt-0.5">{details}</div>
      </div>
    </div>
  );
}

// ── Timeline Entry ──
export function TimelineEntry({ timestamp, title, description, icon }: { timestamp: string; title: string; description: string; icon?: ReactNode }) {
  return (
    <div className="flex items-start gap-3 pb-4">
      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
        {icon || <Clock className="w-4 h-4 text-indigo-600" />}
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium text-slate-800">{title}</div>
        <div className="text-xs text-slate-500 mt-0.5">{description}</div>
        <div className="text-xs text-slate-400 mt-0.5">{timestamp}</div>
      </div>
    </div>
  );
}

// ── Alert Banner ──
export function AlertBanner({ title, message, severity, source }: { title: string; message: string; severity: string; source: string }) {
  const bg = severity === "critical" ? "bg-red-50 border-red-200" : severity === "high" ? "bg-orange-50 border-orange-200" : severity === "medium" ? "bg-yellow-50 border-yellow-200" : "bg-blue-50 border-blue-200";
  const tc = severity === "critical" ? "text-red-800" : severity === "high" ? "text-orange-800" : severity === "medium" ? "text-yellow-800" : "text-blue-800";
  return (
    <div className={`border rounded-lg p-4 ${bg}`}>
      <div className="flex items-center gap-2">
        <AlertTriangle className={`w-4 h-4 ${tc}`} />
        <span className={`text-sm font-semibold ${tc}`}>{title}</span>
        <span className={`ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${severityColor(severity)} text-white`}>{severity}</span>
      </div>
      <p className="text-sm text-slate-700 mt-1">{message}</p>
      <div className="text-xs text-slate-400 mt-1">Source: {source}</div>
    </div>
  );
}

// ── Status Dot ──
export function StatusDot({ status }: { status: string }) {
  const color = status === "active" || status === "normal" || status === "pass" || status === "approved" || status === "implemented" || status === "accepted" || status === "completed" ? "bg-emerald-500" : status === "warning" || status === "pending" || status === "review" || status === "in_review" || status === "draft" || status === "staging" ? "bg-yellow-500" : status === "critical" || status === "fail" || status === "drifted" || status === "rejected" || status === "deprecated" ? "bg-red-500" : "bg-slate-400";
  return <span className={`inline-block w-2 h-2 rounded-full ${color}`} />;
}

// ── Metric Bar ──
export function MetricBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-600">{label}</span>
        <span className="text-slate-500">{(value * 100).toFixed(1)}%</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// ── Section Header ──
export function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
    </div>
  );
}
