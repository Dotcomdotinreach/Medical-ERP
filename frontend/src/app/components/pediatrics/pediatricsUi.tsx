/* ── Pediatrics & NICU — Reusable UI Components ──────────────────────────── */
import { type ReactNode } from "react";
import {
  Baby, Heart, Thermometer, Activity, AlertTriangle, CheckCircle2,
  Clock, ChevronRight, Stethoscope, Shield, Droplets, ThermometerSun,
  TrendingUp, TrendingDown, Minus, XCircle, Eye, Bell, Cpu,
} from "lucide-react";
import type {
  Baby as BabyType, NICUBed, GrowthRecord, Vaccination,
  VentilatorRecord, CPAPRecord, PhototherapyRecord, FeedingRecord,
  MedicationRecord, DischargeRecord, AuditLog,
  NICUStatus, NICUBedType, VaccinationStatus, PhototherapyStatus,
} from "./data";
import {
  nicuStatusTone, bedStatusTone, vaccinationStatusTone,
  phototherapyStatusTone,
} from "./data";

/* ── Status Pill ──────────────────────────────────────────────────────────── */
const TONE_MAP: Record<string, string> = {
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  danger: "bg-red-50 text-red-700 border-red-200",
  info: "bg-blue-50 text-blue-700 border-blue-200",
  neutral: "bg-gray-50 text-gray-600 border-gray-200",
};

export function StatusPill({ label, tone = "neutral" }: { label: string; tone?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${TONE_MAP[tone] ?? TONE_MAP.neutral}`}>
      {tone === "success" && <span className="size-1.5 rounded-full bg-emerald-500" />}
      {tone === "danger" && <span className="size-1.5 rounded-full bg-red-500 animate-pulse" />}
      {tone === "warning" && <span className="size-1.5 rounded-full bg-amber-500" />}
      {tone === "info" && <span className="size-1.5 rounded-full bg-blue-500" />}
      {label}
    </span>
  );
}

/* ── NICU Status Badge ────────────────────────────────────────────────────── */
export function NICUStatusBadge({ status }: { status: NICUStatus }) {
  return <StatusPill label={status} tone={nicuStatusTone(status)} />;
}

/* ── Bed Status Badge ─────────────────────────────────────────────────────── */
export function BedStatusBadge({ status }: { status: string }) {
  return <StatusPill label={status} tone={bedStatusTone(status)} />;
}

/* ── Vaccination Status Badge ─────────────────────────────────────────────── */
export function VaccinationStatusBadge({ status }: { status: VaccinationStatus }) {
  return <StatusPill label={status} tone={vaccinationStatusTone(status)} />;
}

/* ── Phototherapy Status Badge ────────────────────────────────────────────── */
export function PhototherapyStatusBadge({ status }: { status: PhototherapyStatus }) {
  return <StatusPill label={status} tone={phototherapyStatusTone(status)} />;
}

/* ── Baby Card ────────────────────────────────────────────────────────────── */
export function BabyCard({ baby, onSelect }: { baby: BabyType; onSelect?: (b: BabyType) => void }) {
  return (
    <button onClick={() => onSelect?.(baby)} className="w-full text-left bg-white border border-slate-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition-all duration-200 group">
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${baby.gender === "Male" ? "bg-blue-100" : "bg-pink-100"}`}>
          <Baby className={`h-5 w-5 ${baby.gender === "Male" ? "text-blue-600" : "text-pink-600"}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-sm text-slate-900 truncate">{baby.name}</h4>
            <NICUStatusBadge status={baby.nicuStatus} />
          </div>
          <p className="text-xs text-slate-500 mt-0.5">ID: {baby.babyId} | {baby.gender} | Born: {baby.dateOfBirth}</p>
          <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-600">
            <span>GA: {baby.gestationalAge}</span>
            <span>|</span>
            <span>WT: {baby.birthWeight}g</span>
            <span>|</span>
            <span>APGAR: {baby.apgar1min}/{baby.apgar5min}</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Mother: {baby.motherName}</p>
        </div>
        <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-blue-400 mt-1 transition-colors" />
      </div>
    </button>
  );
}

/* ── NICU Bed Card ────────────────────────────────────────────────────────── */
export function NICUBedCard({ bed, onSelect }: { bed: NICUBed; onSelect?: (b: NICUBed) => void }) {
  const bgMap: Record<string, string> = {
    Available: "border-emerald-200 bg-emerald-50/50",
    Occupied: "border-amber-200 bg-amber-50/50",
    Maintenance: "border-red-200 bg-red-50/50",
    Cleaning: "border-blue-200 bg-blue-50/50",
  };
  return (
    <button onClick={() => onSelect?.(bed)} className={`w-full text-left border-2 rounded-xl p-4 transition-all duration-200 hover:shadow-md ${bgMap[bed.status] ?? "border-slate-200 bg-white"}`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="font-semibold text-sm text-slate-900">{bed.bedNumber}</div>
          <div className="text-xs text-slate-500 mt-0.5">{bed.type}</div>
          {bed.currentBaby && <div className="text-xs text-blue-600 mt-1">{bed.currentBaby}</div>}
        </div>
        <BedStatusBadge status={bed.status} />
      </div>
      {bed.status === "Occupied" && (
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div className="bg-white rounded p-1.5"><div className="text-slate-500">Temp</div><div className="font-bold text-slate-900">{bed.temperature}°C</div></div>
          <div className="bg-white rounded p-1.5"><div className="text-slate-500">Humidity</div><div className="font-bold text-slate-900">{bed.humidity}%</div></div>
        </div>
      )}
    </button>
  );
}

/* ── Growth Record Card ───────────────────────────────────────────────────── */
export function GrowthCard({ record }: { record: GrowthRecord }) {
  const percentileColor = (p: number) => p < 10 ? "text-red-600" : p < 25 ? "text-amber-600" : p > 75 ? "text-amber-600" : "text-emerald-600";
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-sm text-slate-900">{record.babyName} — {record.recordDate}</h4>
        <StatusPill label={record.nutritionStatus} tone={record.nutritionStatus === "Adequate" ? "success" : record.nutritionStatus === "Low" ? "danger" : "warning"} />
      </div>
      <div className="grid grid-cols-3 gap-3 text-xs">
        <div className="bg-slate-50 rounded-lg p-2">
          <div className="text-slate-500">Weight</div>
          <div className="font-bold text-slate-900">{record.weight}g</div>
          <div className={percentileColor(record.weightPercentile)}>P{record.weightPercentile}</div>
        </div>
        <div className="bg-slate-50 rounded-lg p-2">
          <div className="text-slate-500">Length</div>
          <div className="font-bold text-slate-900">{record.length}cm</div>
          <div className={percentileColor(record.lengthPercentile)}>P{record.lengthPercentile}</div>
        </div>
        <div className="bg-slate-50 rounded-lg p-2">
          <div className="text-slate-500">HC</div>
          <div className="font-bold text-slate-900">{record.headCircumference}cm</div>
          <div className={percentileColor(record.hcPercentile)}>P{record.hcPercentile}</div>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-3 text-xs text-slate-600">
        <span>BMI: {record.bmi}</span>
        <span>Velocity: {record.weightVelocity}g/wk</span>
        <span>Feeding: {record.feedingType}</span>
      </div>
      {record.notes && <p className="text-xs text-slate-500 mt-2">{record.notes}</p>}
    </div>
  );
}

/* ── Vaccination Card ─────────────────────────────────────────────────────── */
export function VaccinationCard({ vax }: { vax: Vaccination }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-sm text-slate-900">{vax.vaccineName}</h4>
            <VaccinationStatusBadge status={vax.status} />
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{vax.babyName} | Dose {vax.doseNumber} | Due: {vax.dueDate}</p>
          {vax.givenDate && <p className="text-xs text-emerald-600 mt-1">Given: {vax.givenDate} | Site: {vax.site} | Batch: {vax.batchNumber}</p>}
          {vax.aefiReported && <p className="text-xs text-red-600 mt-1 font-medium">AEFI: {vax.aefiDetails}</p>}
        </div>
        {vax.status === "Given" && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
        {vax.status === "Missed" && <XCircle className="h-5 w-5 text-red-500" />}
        {vax.status === "Due" && <Clock className="h-5 w-5 text-blue-500" />}
      </div>
    </div>
  );
}

/* ── Ventilator Card ──────────────────────────────────────────────────────── */
export function VentilatorCard({ record }: { record: VentilatorRecord }) {
  return (
    <div className="bg-white border border-red-200 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Cpu className="h-4 w-4 text-red-500" />
        <h4 className="font-semibold text-sm text-slate-900">{record.babyName} — {record.deviceId}</h4>
      </div>
      <div className="grid grid-cols-4 gap-2 text-xs">
        <div className="bg-red-50 rounded p-1.5"><div className="text-slate-500">Mode</div><div className="font-bold text-red-700">{record.mode}</div></div>
        <div className="bg-red-50 rounded p-1.5"><div className="text-slate-500">PIP</div><div className="font-bold text-slate-900">{record.pip} cmH₂O</div></div>
        <div className="bg-red-50 rounded p-1.5"><div className="text-slate-500">PEEP</div><div className="font-bold text-slate-900">{record.peep} cmH₂O</div></div>
        <div className="bg-red-50 rounded p-1.5"><div className="text-slate-500">FiO₂</div><div className="font-bold text-slate-900">{record.fio2}%</div></div>
        <div className="bg-red-50 rounded p-1.5"><div className="text-slate-500">Rate</div><div className="font-bold text-slate-900">{record.rate}/min</div></div>
        <div className="bg-red-50 rounded p-1.5"><div className="text-slate-500">MAP</div><div className="font-bold text-slate-900">{record.map} cmH₂O</div></div>
        <div className="bg-red-50 rounded p-1.5"><div className="text-slate-500">I:E</div><div className="font-bold text-slate-900">{record.ieRatio}</div></div>
        <div className="bg-red-50 rounded p-1.5"><div className="text-slate-500">SpO₂ Target</div><div className="font-bold text-slate-900">{record.spo2Target}%</div></div>
      </div>
      <div className="mt-3 flex items-center gap-3 text-xs">
        <StatusPill label={record.alarmStatus} tone={record.alarmStatus === "Normal" ? "success" : "danger"} />
        <StatusPill label={record.weaningStatus} tone="info" />
      </div>
      {record.notes && <p className="text-xs text-slate-500 mt-2">{record.notes}</p>}
    </div>
  );
}

/* ── CPAP Card ────────────────────────────────────────────────────────────── */
export function CPAPCard({ record }: { record: CPAPRecord }) {
  return (
    <div className="bg-white border border-amber-200 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Wind className="h-4 w-4 text-amber-500" />
        <h4 className="font-semibold text-sm text-slate-900">{record.babyName} — {record.deviceId}</h4>
      </div>
      <div className="grid grid-cols-4 gap-2 text-xs">
        <div className="bg-amber-50 rounded p-1.5"><div className="text-slate-500">PEEP</div><div className="font-bold text-slate-900">{record.peep} cmH₂O</div></div>
        <div className="bg-amber-50 rounded p-1.5"><div className="text-slate-500">FiO₂</div><div className="font-bold text-slate-900">{record.fio2}%</div></div>
        <div className="bg-amber-50 rounded p-1.5"><div className="text-slate-500">Flow</div><div className="font-bold text-slate-900">{record.flow} L/min</div></div>
        <div className="bg-amber-50 rounded p-1.5"><div className="text-slate-500">SpO₂ Target</div><div className="font-bold text-slate-900">{record.spo2Target}%</div></div>
      </div>
      <div className="mt-2 flex items-center gap-3 text-xs">
        <StatusPill label={record.alarmStatus} tone={record.alarmStatus === "Normal" ? "success" : "danger"} />
        <span className="text-slate-500">Duration: {record.duration}</span>
      </div>
      {record.notes && <p className="text-xs text-slate-500 mt-2">{record.notes}</p>}
    </div>
  );
}

/* ── Phototherapy Card ────────────────────────────────────────────────────── */
export function PhototherapyCard({ record }: { record: PhototherapyRecord }) {
  return (
    <div className="bg-white border border-amber-200 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <ThermometerSun className="h-4 w-4 text-amber-500" />
        <h4 className="font-semibold text-sm text-slate-900">{record.babyName} — {record.deviceId}</h4>
        <PhototherapyStatusBadge status={record.status} />
      </div>
      <div className="grid grid-cols-4 gap-2 text-xs">
        <div className="bg-amber-50 rounded p-1.5"><div className="text-slate-500">Bilirubin</div><div className="font-bold text-amber-700">{record.bilirubinLevel} mg/dL</div></div>
        <div className="bg-amber-50 rounded p-1.5"><div className="text-slate-500">Trend</div><div className="font-bold text-slate-900">{record.bilirubinTrend}</div></div>
        <div className="bg-amber-50 rounded p-1.5"><div className="text-slate-500">Hours</div><div className="font-bold text-slate-900">{record.treatmentHours}h</div></div>
        <div className="bg-amber-50 rounded p-1.5"><div className="text-slate-500">Sessions</div><div className="font-bold text-slate-900">{record.sessionsCompleted}/{record.totalSessionsRequired}</div></div>
      </div>
      <div className="mt-2 flex items-center gap-3 text-xs">
        <span className="flex items-center gap-1 text-slate-600"><Eye className="h-3 w-3" /> Eye Protection: {record.eyeProtection ? "Yes" : "No"}</span>
        <span className="text-slate-500">Last Reading: {record.lastReading}</span>
      </div>
      {record.notes && <p className="text-xs text-slate-500 mt-2">{record.notes}</p>}
    </div>
  );
}

/* ── Feeding Record Card ──────────────────────────────────────────────────── */
export function FeedingCard({ record }: { record: FeedingRecord }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-sm text-slate-900">{record.babyName} — {record.recordDate}</h4>
        <StatusPill label={record.feedingType} tone="info" />
      </div>
      <div className="grid grid-cols-4 gap-2 text-xs">
        <div className="bg-slate-50 rounded p-1.5"><div className="text-slate-500">Volume</div><div className="font-bold text-slate-900">{record.volume > 0 ? `${record.volume}mL` : "—"}</div></div>
        <div className="bg-slate-50 rounded p-1.5"><div className="text-slate-500">Frequency</div><div className="font-bold text-slate-900">{record.frequency}</div></div>
        <div className="bg-slate-50 rounded p-1.5"><div className="text-slate-500">24h Intake</div><div className="font-bold text-slate-900">{record.totalIntake24h}mL</div></div>
        <div className="bg-slate-50 rounded p-1.5"><div className="text-slate-500">24h Output</div><div className="font-bold text-slate-900">{record.urineOutput24h}L</div></div>
      </div>
      {record.notes && <p className="text-xs text-slate-500 mt-2">{record.notes}</p>}
    </div>
  );
}

/* ── Medication Card ──────────────────────────────────────────────────────── */
export function MedicationCard({ record }: { record: MedicationRecord }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h4 className="font-semibold text-sm text-slate-900">{record.medicationName}</h4>
          <p className="text-xs text-slate-500">{record.babyName} | {record.dose} | {record.route}</p>
        </div>
        <StatusPill label={record.status} tone={record.status === "Active" ? "success" : record.status === "Discontinued" ? "danger" : "info"} />
      </div>
      <div className="flex items-center gap-3 text-xs text-slate-600">
        <span>Frequency: {record.frequency}</span>
        <span>Duration: {record.duration}</span>
        <span>Indication: {record.indication}</span>
      </div>
      {record.notes && <p className="text-xs text-slate-500 mt-2">{record.notes}</p>}
    </div>
  );
}

/* ── Discharge Card ───────────────────────────────────────────────────────── */
export function DischargeCard({ record }: { record: DischargeRecord }) {
  return (
    <div className="bg-white border border-emerald-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h4 className="font-semibold text-sm text-slate-900">{record.babyName} — Discharged {record.dischargeDate}</h4>
          <p className="text-xs text-slate-500">{record.dischargeType} | WT: {record.dischargeWeight}g</p>
        </div>
        <StatusPill label={record.status} tone="success" />
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs mt-2">
        <div className="flex items-center gap-1.5">{record.clinicalClearance ? <CheckCircle2 className="h-3 w-3 text-emerald-500" /> : <XCircle className="h-3 w-3 text-red-500" />} Clinical Clearance</div>
        <div className="flex items-center gap-1.5">{record.vaccinationClearance ? <CheckCircle2 className="h-3 w-3 text-emerald-500" /> : <XCircle className="h-3 w-3 text-red-500" />} Vaccination Status</div>
        <div className="flex items-center gap-1.5">{record.parentEducation ? <CheckCircle2 className="h-3 w-3 text-emerald-500" /> : <XCircle className="h-3 w-3 text-red-500" />} Parent Education</div>
        <div className="text-slate-500">Follow-up: {record.followUpDate}</div>
      </div>
      <p className="text-xs text-slate-500 mt-2">{record.parentInstructions}</p>
    </div>
  );
}

/* ── Audit Row ────────────────────────────────────────────────────────────── */
export function AuditRow({ log }: { log: AuditLog }) {
  const severityIcon: Record<string, ReactNode> = {
    Info: <CheckCircle2 className="h-4 w-4 text-blue-500" />,
    Warning: <AlertTriangle className="h-4 w-4 text-amber-500" />,
    Critical: <XCircle className="h-4 w-4 text-red-500" />,
  };
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
      {severityIcon[log.severity]}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900">{log.action} <span className="text-slate-500 font-normal">— {log.resource}</span></p>
        <p className="text-xs text-slate-600 mt-0.5">{log.details}</p>
        <p className="text-xs text-slate-400 mt-0.5">{log.timestamp} | {log.user}</p>
      </div>
    </div>
  );
}

/* ── Wind icon (CPAP) ─────────────────────────────────────────────────────── */
function Wind({ className }: { className?: string }) {
  return <Activity className={className} />;
}
