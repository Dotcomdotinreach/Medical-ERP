import React from "react";
import { StatusBadge, StatCard, SectionCard } from "../his/ui";
import {
  type CancerPatient, type ChemoProtocol, type InfusionSession,
  type RadiationSession, type TumorBoard, type ResponseAssessment,
  type ScreeningRecord, type PalliativeRecord, type AuditLog,
  treatmentIntentTone, treatmentStatusTone, ecogTone,
  recistTone, infusionStatusTone, tbStatusTone, registryStatusTone,
  palliativeStatusTone, ONCOLOGY_KPI,
} from "./data";
import { Users, Calendar, AlertTriangle, Stethoscope, Beaker, Activity, Pill, Bed, FileText, TrendingUp, TrendingDown, CheckCircle, Clock, Target, Shield, HeartPulse, Radiation, Syringe, Brain, ClipboardList, Microscope, FlaskConical, Bone, Eye, BarChart3, Settings, CircleDot } from "lucide-react";

/* ── KPI Row ──────────────────────────────────────────────────────────────── */
export function OncologyKPIRow() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
      <StatCard label="Active Patients" value={ONCOLOGY_KPI.activePatients} icon={<Users className="h-4 w-4" />} color="blue" />
      <StatCard label="Today Infusions" value={ONCOLOGY_KPI.todayInfusions} icon={<Syringe className="h-4 w-4" />} color="purple" />
      <StatCard label="RT Sessions Today" value={ONCOLOGY_KPI.radiationSessions} icon={<Radiation className="h-4 w-4" />} color="cyan" />
      <StatCard label="Tumor Boards" value={ONCOLOGY_KPI.tumorBoardMeetings} icon={<Brain className="h-4 w-4" />} color="indigo" />
      <StatCard label="Critical Alerts" value={ONCOLOGY_KPI.criticalAlerts} icon={<AlertTriangle className="h-4 w-4" />} color="red" />
      <StatCard label="5-Year Survival" value={`${ONCOLOGY_KPI.survivalRate5Year}%`} icon={<TrendingUp className="h-4 w-4" />} color="green" />
    </div>
  );
}

/* ── Cancer Patient Card ──────────────────────────────────────────────────── */
export function CancerPatientCard({ p, onSelect }: { p: CancerPatient; onSelect?: () => void }) {
  return (
    <button onClick={onSelect} className="w-full text-left p-4 rounded-lg border border-border bg-card hover:ring-2 hover:ring-primary/30 transition space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-semibold text-sm truncate">{p.name}</p>
          <p className="text-xs text-muted-foreground">{p.cancerType} — {p.stage} ({p.ajccStage})</p>
          <p className="text-xs text-muted-foreground truncate">{p.histology}</p>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <StatusBadge tone={treatmentIntentTone(p.treatmentIntent)}>{p.treatmentIntent}</StatusBadge>
          <StatusBadge tone={treatmentStatusTone(p.treatmentStatus)}>{p.treatmentStatus}</StatusBadge>
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
        <span>ECOG {p.ecogStatus}</span>
        <span className="text-border">|</span>
        <span>{p.assignedOncologist}</span>
        <span className="text-border">|</span>
        <span>{p.nextVisit}</span>
      </div>
      {p.biomarkers.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {p.biomarkers.map((b, i) => <span key={i} className="px-1.5 py-0.5 text-[10px] bg-muted rounded">{b}</span>)}
        </div>
      )}
    </button>
  );
}

/* ── Protocol Card ────────────────────────────────────────────────────────── */
export function ChemoProtocolCard({ c, onSelect }: { c: ChemoProtocol; onSelect?: () => void }) {
  return (
    <button onClick={onSelect} className="w-full text-left p-4 rounded-lg border border-border bg-card hover:ring-2 hover:ring-primary/30 transition space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-semibold text-sm truncate">{c.patientName}</p>
          <p className="text-xs text-muted-foreground">{c.protocolName} — Cycle {c.cycleNumber}/{c.totalCycles}</p>
          <p className="text-xs text-muted-foreground">BSA: {c.bsa} m²</p>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <StatusBadge tone={treatmentIntentTone(c.treatmentIntent)}>{c.treatmentIntent}</StatusBadge>
          <StatusBadge tone={treatmentStatusTone(c.status)}>{c.status}</StatusBadge>
        </div>
      </div>
      <div className="flex flex-wrap gap-1">
        {c.regimen.map((r, i) => <span key={i} className="px-1.5 py-0.5 text-[10px] bg-muted rounded">{r}</span>)}
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
        <span>Next: {c.nextCycleDate}</span>
        <span className="text-border">|</span>
        <span>{c.oncologist}</span>
      </div>
    </button>
  );
}

/* ── Infusion Chair Card ──────────────────────────────────────────────────── */
export function InfusionChairCard({ s, onSelect }: { s: InfusionSession; onSelect?: () => void }) {
  return (
    <button onClick={onSelect} className="w-full text-left p-4 rounded-lg border border-border bg-card hover:ring-2 hover:ring-primary/30 transition space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-semibold text-sm truncate">{s.patientName}</p>
          <p className="text-xs text-muted-foreground">{s.protocolName} — Cycle {s.cycleNumber}</p>
          <p className="text-xs text-muted-foreground">Chair: {s.chairId} | {s.medication}</p>
        </div>
        <StatusBadge tone={infusionStatusTone(s.status)}>{s.status}</StatusBadge>
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
        <span>Scheduled: {s.scheduledTime}</span>
        {s.startTime && <><span className="text-border">|</span><span>Started: {s.startTime}</span></>}
        <span className="text-border">|</span>
        <span>{s.nurse}</span>
      </div>
      <p className="text-xs text-muted-foreground">Volume: {s.volume}ml @ {s.rate}ml/hr | Pump: {s.pumpId}</p>
    </button>
  );
}

/* ── Radiation Card ───────────────────────────────────────────────────────── */
export function RadiationCard({ r, onSelect }: { r: RadiationSession; onSelect?: () => void }) {
  const pct = r.fractionsPlanned > 0 ? Math.round((r.fractionsDelivered / r.fractionsPlanned) * 100) : 0;
  return (
    <button onClick={onSelect} className="w-full text-left p-4 rounded-lg border border-border bg-card hover:ring-2 hover:ring-primary/30 transition space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-semibold text-sm truncate">{r.patientName}</p>
          <p className="text-xs text-muted-foreground">{r.treatmentSite}</p>
          <p className="text-xs text-muted-foreground">{r.machine} — {r.technique}</p>
        </div>
        <StatusBadge tone={treatmentStatusTone(r.status)}>{r.status}</StatusBadge>
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
        <span>Dose: {r.deliveredDose} / {r.prescribedDose}</span>
        <span className="text-border">|</span>
        <span>Fractions: {r.fractionsDelivered}/{r.fractionsPlanned}</span>
      </div>
      <div className="w-full bg-muted rounded-full h-2 mt-1">
        <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
      <p className="text-xs text-muted-foreground text-right">{pct}% complete</p>
    </button>
  );
}

/* ── Tumor Board Card ─────────────────────────────────────────────────────── */
export function TumorBoardCard({ t, onSelect }: { t: TumorBoard; onSelect?: () => void }) {
  return (
    <button onClick={onSelect} className="w-full text-left p-4 rounded-lg border border-border bg-card hover:ring-2 hover:ring-primary/30 transition space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-semibold text-sm truncate">{t.title}</p>
          <p className="text-xs text-muted-foreground">{t.meetingDate} at {t.time}</p>
          <p className="text-xs text-muted-foreground">{t.caseCount} cases</p>
        </div>
        <StatusBadge tone={tbStatusTone(t.status)}>{t.status}</StatusBadge>
      </div>
      <div className="flex flex-wrap gap-1">
        {t.participants.map((p, i) => <span key={i} className="px-1.5 py-0.5 text-[10px] bg-muted rounded">{p}</span>)}
      </div>
      {t.decisions.length > 0 && (
        <div className="space-y-1">
          {t.decisions.map((d, i) => <p key={i} className="text-xs text-muted-foreground truncate">• {d}</p>)}
        </div>
      )}
    </button>
  );
}

/* ── Response Assessment Card ─────────────────────────────────────────────── */
export function ResponseCard({ r, onSelect }: { r: ResponseAssessment; onSelect?: () => void }) {
  return (
    <button onClick={onSelect} className="w-full text-left p-4 rounded-lg border border-border bg-card hover:ring-2 hover:ring-primary/30 transition space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-semibold text-sm truncate">{r.patientName}</p>
          <p className="text-xs text-muted-foreground">{r.assessmentDate} — {r.imagingModality}</p>
        </div>
        <StatusBadge tone={recistTone(r.recistResponse)}>{r.recistResponse}</StatusBadge>
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>{r.overallResponse}</span>
        <span className="text-border">|</span>
        <span className={r.targetLesionChange < 0 ? "text-green-600" : "text-red-600"}>
          {r.targetLesionChange}%
        </span>
      </div>
      <p className="text-xs text-muted-foreground truncate">Plan: {r.nextPlan}</p>
    </button>
  );
}

/* ── Screening Card ───────────────────────────────────────────────────────── */
export function ScreeningCard({ s, onSelect }: { s: ScreeningRecord; onSelect?: () => void }) {
  return (
    <button onClick={onSelect} className="w-full text-left p-4 rounded-lg border border-border bg-card hover:ring-2 hover:ring-primary/30 transition space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-semibold text-sm truncate">{s.patientName} ({s.age}y)</p>
          <p className="text-xs text-muted-foreground">{s.screeningType} — Risk: {s.riskLevel}</p>
        </div>
        <StatusBadge tone={s.status === "Abnormal" ? "danger" : s.status === "Completed" ? "success" : "warning"}>{s.status}</StatusBadge>
      </div>
      <p className="text-xs text-muted-foreground">Family Hx: {s.familyHistory}</p>
      <p className="text-xs text-muted-foreground truncate">Result: {s.screeningResult}</p>
    </button>
  );
}

/* ── Palliative Card ──────────────────────────────────────────────────────── */
export function PalliativeCard({ p, onSelect }: { p: PalliativeRecord; onSelect?: () => void }) {
  return (
    <button onClick={onSelect} className="w-full text-left p-4 rounded-lg border border-border bg-card hover:ring-2 hover:ring-primary/30 transition space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-semibold text-sm truncate">{p.patientName}</p>
          <p className="text-xs text-muted-foreground">Pain: {p.painScore}/10 — {p.painLocation}</p>
        </div>
        <StatusBadge tone={palliativeStatusTone(p.status)}>{p.status}</StatusBadge>
      </div>
      <p className="text-xs text-muted-foreground truncate">Symptoms: {p.symptomBurden}</p>
      <p className="text-xs text-muted-foreground truncate">Goals: {p.careGoals}</p>
      <div className="flex flex-wrap gap-1">
        {p.medications.map((m, i) => <span key={i} className="px-1.5 py-0.5 text-[10px] bg-muted rounded">{m}</span>)}
      </div>
    </button>
  );
}

/* ── Audit Row ────────────────────────────────────────────────────────────── */
export function AuditLogRow({ log }: { log: AuditLog }) {
  const sev = log.severity === "Critical" ? "danger" : log.severity === "Warning" ? "warning" : "info";
  return (
    <div className="flex items-start gap-3 p-3 border-b last:border-0">
      <StatusBadge tone={sev}>{log.severity}</StatusBadge>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-medium text-sm">{log.action}</p>
          <span className="text-xs text-muted-foreground">{log.user}</span>
        </div>
        <p className="text-xs text-muted-foreground truncate">{log.details}</p>
      </div>
      <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
        {new Date(log.timestamp).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
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
