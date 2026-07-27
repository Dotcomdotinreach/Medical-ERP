import React from "react";
import { StatusBadge, StatCard, SectionCard } from "../his/ui";
import {
  type ClinicalAlert, type RiskScore, type MedicationSafetyAlert,
  type DiagnosticRecommendation, type Guideline, type OverrideRecord,
  type AuditEntry, alertSeverityTone, alertStatusTone, riskLevelTone,
  evidenceLevelTone, overrideStatusTone,
} from "./data";
import {
  AlertTriangle, Shield, Activity, Clock, CheckCircle, XCircle,
  TrendingUp, TrendingDown, ArrowUp, ArrowDown, Minus, Eye,
  FileText, Zap, Target, BookOpen, Beaker, Pill, Heart,
} from "lucide-react";

/* ── Alert Card ───────────────────────────────────────────────────────────── */
export function AlertCard({ a, onAction }: { a: ClinicalAlert; onAction?: () => void }) {
  return (
    <div className={`p-4 rounded-lg border-l-4 space-y-2 ${
      a.severity === "Critical" ? "border-l-red-500 bg-red-50" :
      a.severity === "High" ? "border-l-orange-500 bg-orange-50" :
      a.severity === "Medium" ? "border-l-yellow-500 bg-yellow-50" :
      "border-l-blue-500 bg-blue-50"
    }`}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <StatusBadge tone={alertSeverityTone(a.severity)}>{a.severity}</StatusBadge>
            <StatusBadge tone={alertStatusTone(a.status)}>{a.status}</StatusBadge>
            <span className="text-[10px] text-muted-foreground">{a.alertType}</span>
          </div>
          <p className="font-semibold text-sm mt-1">{a.title}</p>
          <p className="text-xs text-muted-foreground">{a.patientName}</p>
        </div>
        <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
          {new Date(a.timestamp).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
      <p className="text-xs text-muted-foreground">{a.description}</p>
      <div className="flex items-center gap-2 text-xs flex-wrap">
        <span className="px-1.5 py-0.5 rounded bg-muted font-medium">Trigger: {a.trigger}</span>
        <span className="px-1.5 py-0.5 rounded bg-muted">Confidence: {a.confidence}%</span>
      </div>
      <div className="p-2 rounded bg-primary/5 border border-primary/10">
        <p className="text-xs font-semibold text-primary mb-0.5">Recommended Action</p>
        <p className="text-xs">{a.recommendedAction}</p>
      </div>
      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
        <span>Evidence: {a.evidenceLevel}</span>
        <span>•</span>
        <span>{a.evidenceSource}</span>
      </div>
      {onAction && a.status === "Active" && (
        <div className="flex gap-2 pt-1">
          <button className="px-3 py-1.5 rounded bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition">Accept</button>
          <button className="px-3 py-1.5 rounded border text-xs font-medium hover:bg-accent transition">Override</button>
          <button className="px-3 py-1.5 rounded border text-xs font-medium hover:bg-accent transition">Escalate</button>
        </div>
      )}
    </div>
  );
}

/* ── Risk Score Card ──────────────────────────────────────────────────────── */
export function RiskScoreCard({ label, score, level, trend, icon }: { label: string; score: number; level: string; trend?: string; icon?: React.ReactNode }) {
  const TrendIcon = trend === "rising" ? TrendingUp : trend === "falling" ? TrendingDown : Minus;
  const trendColor = trend === "rising" ? "text-red-500" : trend === "falling" ? "text-green-500" : "text-muted-foreground";
  return (
    <div className="p-3 rounded-lg border space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground flex items-center gap-1">{icon}{label}</span>
        {trend && <TrendIcon className={`h-3 w-3 ${trendColor}`} />}
      </div>
      <p className="text-xl font-bold">{score}</p>
      <StatusBadge tone={riskLevelTone(level as any)}>{level}</StatusBadge>
    </div>
  );
}

/* ── Medication Safety Card ───────────────────────────────────────────────── */
export function MedSafetyCard({ m }: { m: MedicationSafetyAlert }) {
  return (
    <div className="p-4 rounded-lg border border-border bg-card space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <StatusBadge tone={alertSeverityTone(m.severity)}>{m.severity}</StatusBadge>
            <span className="text-xs text-muted-foreground">{m.alertType}</span>
          </div>
          <p className="font-semibold text-sm mt-1">{m.description}</p>
          <p className="text-xs text-muted-foreground">{m.patientName}</p>
        </div>
        <StatusBadge tone={alertStatusTone(m.status)}>{m.status}</StatusBadge>
      </div>
      {m.medication2 && (
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2 py-1 rounded bg-muted font-medium">{m.medication1}</span>
          <span className="text-destructive font-bold">+</span>
          <span className="px-2 py-1 rounded bg-muted font-medium">{m.medication2}</span>
        </div>
      )}
      <p className="text-xs text-muted-foreground">{m.mechanism}</p>
      <div className="p-2 rounded bg-primary/5 border border-primary/10">
        <p className="text-xs font-semibold text-primary mb-0.5">Recommended Action</p>
        <p className="text-xs">{m.recommendedAction}</p>
      </div>
    </div>
  );
}

/* ── Guideline Card ───────────────────────────────────────────────────────── */
export function GuidelineCard({ g }: { g: Guideline }) {
  return (
    <div className="p-4 rounded-lg border border-border bg-card space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-semibold text-sm">{g.title}</p>
          <p className="text-xs text-muted-foreground">{g.specialty} — v{g.version}</p>
        </div>
        <StatusBadge tone={evidenceLevelTone(g.evidenceLevel)}>{g.evidenceLevel}</StatusBadge>
      </div>
      <p className="text-xs text-muted-foreground">{g.summary}</p>
      <div className="flex items-center gap-2 text-xs">
        <span className="text-muted-foreground">Compliance:</span>
        <div className="flex-1 bg-muted rounded-full h-2">
          <div className={`h-2 rounded-full ${g.complianceRate >= 80 ? "bg-green-500" : g.complianceRate >= 60 ? "bg-yellow-500" : "bg-red-500"}`} style={{ width: `${g.complianceRate}%` }} />
        </div>
        <span className="font-medium">{g.complianceRate}%</span>
      </div>
    </div>
  );
}

/* ── Override Record Card ─────────────────────────────────────────────────── */
export function OverrideCard({ r }: { r: OverrideRecord }) {
  return (
    <div className="p-4 rounded-lg border border-border bg-card space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-semibold text-sm">{r.alertTitle}</p>
          <p className="text-xs text-muted-foreground">{r.patientName} — {r.clinician}</p>
        </div>
        <StatusBadge tone={overrideStatusTone(r.outcome)}>{r.outcome}</StatusBadge>
      </div>
      <div className="p-2 rounded bg-muted text-xs">
        <p className="font-semibold mb-0.5">Override Reason:</p>
        <p>{r.overrideReason}</p>
      </div>
      {r.supervisorReview && (
        <div className="p-2 rounded bg-muted text-xs">
          <p className="font-semibold mb-0.5">Supervisor Review:</p>
          <p>{r.supervisorReview}</p>
        </div>
      )}
      <p className="text-xs text-muted-foreground">{r.documentationNotes}</p>
    </div>
  );
}

/* ── Audit Row ────────────────────────────────────────────────────────────── */
export function AuditLogRow({ e }: { e: AuditEntry }) {
  const sev = e.severity === "Critical" ? "danger" : e.severity === "Warning" ? "warning" : "info";
  return (
    <div className="flex items-start gap-3 p-3 border-b last:border-0">
      <StatusBadge tone={sev}>{e.severity}</StatusBadge>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-medium text-sm">{e.action}</p>
          <span className="text-xs text-muted-foreground">{e.user}</span>
        </div>
        <p className="text-xs text-muted-foreground truncate">{e.details}</p>
      </div>
      <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
        {new Date(e.timestamp).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
      </span>
    </div>
  );
}

/* ── Section Heading ──────────────────────────────────────────────────────── */
export function SectionHeading({ icon, children }: { icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <h2 className="text-lg font-bold flex items-center gap-2">
      {icon}<span>{children}</span>
    </h2>
  );
}
