import type { ReactNode } from "react";
import { CheckCircle2, AlertTriangle, Clock, FileText, Users, Shield, TrendingUp, TrendingDown, Minus, ExternalLink } from "lucide-react";
import { studyStatusColor, consentStatusColor, queryStatusColor, safetySeverityColor, monitoringStatusColor, phaseLabel, enrollmentPercentage, enrollmentColor, priorityColor, riskColor } from "./data";

// ── Study Card ──
export function StudyCard({ protocolNumber, title, sponsor, phase, status, piName, enrollmentCurrent, enrollmentTarget, sites, onClick }: { protocolNumber: string; title: string; sponsor: string; phase: string; status: string; piName: string; enrollmentCurrent: number; enrollmentTarget: number; sites: number; onClick?: () => void }) {
  const pct = enrollmentPercentage(enrollmentCurrent, enrollmentTarget);
  const ec = enrollmentColor(pct);
  return (
    <div className="border rounded-lg p-4 bg-white hover:border-indigo-300 cursor-pointer" onClick={onClick}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-mono text-indigo-600">{protocolNumber}</span>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${studyStatusColor(status)}`}>{status.replace(/_/g, " ")}</span>
      </div>
      <div className="text-sm font-semibold text-slate-800 mb-1 line-clamp-2">{title}</div>
      <div className="text-xs text-slate-500 mb-2">{sponsor} | {phaseLabel(phase)}</div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-500">PI: {piName}</span>
        <span className="text-slate-500">{sites} site{sites > 1 ? "s" : ""}</span>
      </div>
      <div className="mt-3">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-slate-500">Enrollment</span>
          <span className={`font-medium ${ec}`}>{enrollmentCurrent}/{enrollmentTarget} ({pct}%)</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
}

// ── Participant Card ──
export function ParticipantCard({ subjectId, initials, age, gender, studyName, status, consentStatus, lastVisit, nextVisit, piName }: { subjectId: string; initials: string; age: number; gender: string; studyName: string; status: string; consentStatus: string; lastVisit: string | null; nextVisit: string | null; piName: string }) {
  const sc = status === "active" ? "bg-emerald-100 text-emerald-700" : status === "screening" ? "bg-yellow-100 text-yellow-700" : status === "withdrawn" ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-600";
  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-700">{initials}</div>
          <div>
            <div className="text-sm font-semibold text-slate-800">{subjectId}</div>
            <div className="text-xs text-slate-500">{age}{gender} | {piName}</div>
          </div>
        </div>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${sc}`}>{status}</span>
      </div>
      <div className="text-xs text-slate-500 mb-2">{studyName}</div>
      <div className="flex items-center gap-2 text-xs">
        <span className={`px-2 py-0.5 rounded ${consentStatusColor(consentStatus)}`}>{consentStatus.replace(/_/g, " ")}</span>
      </div>
      <div className="flex items-center justify-between mt-2 text-xs text-slate-400">
        <span>Last: {lastVisit || "N/A"}</span>
        <span>Next: {nextVisit || "N/A"}</span>
      </div>
    </div>
  );
}

// ── Safety Card ──
export function SafetyCard({ eventType, description, severity, causality, participantId, studyName, onsetDate, outcome }: { eventType: string; description: string; severity: string; causality: string; participantId: string; studyName: string; onsetDate: string; outcome: string }) {
  const tc = eventType === "SAE" || eventType === "SUSAR" ? "text-red-600" : "text-orange-600";
  return (
    <div className={`border rounded-lg p-4 bg-white ${eventType === "SAE" ? "border-red-200 bg-red-50" : ""}`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`text-sm font-bold ${tc}`}>{eventType}</span>
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${safetySeverityColor(severity)}`}>{severity}</span>
      </div>
      <div className="text-sm text-slate-800 mb-1">{description}</div>
      <div className="text-xs text-slate-500 mb-2">{participantId} | {studyName}</div>
      <div className="flex items-center gap-3 text-xs">
        <span className="text-slate-500">Onset: {onsetDate}</span>
        <span className="text-slate-500">Causality: {causality}</span>
        <span className="text-slate-500">Outcome: {outcome}</span>
      </div>
    </div>
  );
}

// ── Query Card ──
export function QueryCard({ queryText, queryType, status, participantId, raisedBy, raisedDate, priority, age }: { queryText: string; queryType: string; status: string; participantId: string; raisedBy: string; raisedDate: string; priority: string; age: number }) {
  return (
    <div className={`border rounded-lg p-4 bg-white ${status === "escalated" ? "border-red-200 bg-red-50" : ""}`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${queryStatusColor(status)}`}>{status}</span>
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${priorityColor(priority)}`}>{priority}</span>
      </div>
      <div className="text-sm text-slate-800 mb-2">{queryText}</div>
      <div className="flex items-center gap-3 text-xs text-slate-500">
        <span>{participantId}</span>
        <span>{queryType}</span>
        <span>By: {raisedBy}</span>
        <span>{raisedDate}</span>
        <span className={age > 30 ? "text-red-600 font-medium" : ""}>{age}d old</span>
      </div>
    </div>
  );
}

// ── Monitoring Card ──
export function MonitoringCard({ visitDate, monitorName, visitType, status, sdvPerformed, sdvTotal, findings, riskScore, nextVisitDate }: { visitDate: string; monitorName: string; visitType: string; status: string; sdvPerformed: number; sdvTotal: number; findings: string[]; riskScore: string; nextVisitDate: string | null }) {
  const sdvPct = sdvTotal > 0 ? Math.round((sdvPerformed / sdvTotal) * 100) : 0;
  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="flex items-center justify-between mb-2">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${monitoringStatusColor(status)}`}>{status.replace(/_/g, " ")}</span>
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${riskColor(riskScore)}`}>{riskScore} risk</span>
      </div>
      <div className="text-sm font-semibold text-slate-800">{visitType} Visit</div>
      <div className="text-xs text-slate-500 mb-2">{monitorName} | {visitDate}</div>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs text-slate-500">SDV: {sdvPerformed}/{sdvTotal} ({sdvPct}%)</span>
        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-400 rounded-full" style={{ width: `${sdvPct}%` }} />
        </div>
      </div>
      {findings.length > 0 && (
        <div className="space-y-1">{findings.map((f, i) => <div key={i} className="text-xs text-slate-600 flex items-start gap-1"><span className="text-orange-500">*</span>{f}</div>)}</div>
      )}
      {nextVisitDate && <div className="text-xs text-slate-400 mt-2">Next visit: {nextVisitDate}</div>}
    </div>
  );
}

// ── Document Card ──
export function DocumentCard({ documentName, documentType, version, uploadDate, expiryDate, status, uploadedBy, fileSize, category }: { documentName: string; documentType: string; version: string; uploadDate: string; expiryDate: string | null; status: string; uploadedBy: string; fileSize: string; category: string }) {
  const sc = status === "current" ? "bg-emerald-100 text-emerald-700" : status === "expired" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700";
  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="flex items-center justify-between mb-2">
        <FileText className="w-5 h-5 text-indigo-500" />
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${sc}`}>{status}</span>
      </div>
      <div className="text-sm font-semibold text-slate-800 mb-1">{documentName}</div>
      <div className="text-xs text-slate-500 mb-2">{category} | v{version} | {fileSize}</div>
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>Uploaded: {uploadDate}</span>
        {expiryDate && <span className={expiryDate < "2026-12-31" ? "text-orange-600" : ""}>Expires: {expiryDate}</span>}
      </div>
      <div className="text-xs text-slate-400 mt-1">By: {uploadedBy}</div>
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
      </div>
      <p className="text-sm text-slate-700 mt-1">{message}</p>
      <div className="text-xs text-slate-400 mt-1">Source: {source}</div>
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

// ── Status Dot ──
export function StatusDot({ status }: { status: string }) {
  const color = status === "active" || status === "completed" || status === "approved" || status === "signed" || status === "current" || status === "normal" ? "bg-emerald-500" : status === "open" || status === "in_progress" || status === "pending" || status === "scheduled" || status === "draft" ? "bg-yellow-500" : status === "suspended" || status === "terminated" || status === "withdrawn" || status === "expired" || status === "rejected" || status === "escalated" ? "bg-red-500" : "bg-slate-400";
  return <span className={`inline-block w-2 h-2 rounded-full ${color}`} />;
}
