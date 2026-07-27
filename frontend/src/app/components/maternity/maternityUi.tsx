/* ── Maternity, Obstetrics & Labor Room — UI Components ────────────────────── */
import { type Mother, type ANCV, type Ultrasound, type RiskAssessment, type LaborAdmission, type Partograph, type Newborn, type PostpartumCare, type LactationSupport, type AuditLog, riskLevelTone, laborStatusTone, deliveryTypeTone, nicuStatusTone, postpartumStatusTone, ancVisitStatusTone, partographStatusTone, ctgClassificationTone } from "./data";
import { StatusBadge, StatCard, SectionCard, PageHeader, Avatar } from "../his/ui";
import { Users, Baby, Heart, AlertTriangle, Activity, Stethoscope, Calendar, FileText, Shield, BarChart3, Clock, CheckCircle2, XCircle, TrendingUp, Zap, Pill, ChevronRight, Eye, Edit3, Plus, Search, Printer, Download, Filter, MoreHorizontal, Star, Phone, MapPin, Droplets, Thermometer, ThermometerSnowflake, Syringe, ClipboardList, Timer, CircleDot, Siren, Target, ArrowRightLeft, FileBarChart } from "lucide-react";

/* ── Mother Card ──────────────────────────────────────────────────────────── */
export function MotherCard({ mother, onSelect }: { mother: Mother; onSelect?: (m: Mother) => void }) {
  return (
    <button onClick={() => onSelect?.(mother)} className="w-full text-left bg-white border border-slate-200 rounded-xl p-4 hover:border-rose-300 hover:shadow-md transition-all duration-200 group">
      <div className="flex items-start gap-3">
        <Avatar name={mother.name} size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-sm text-slate-900 truncate">{mother.name}</h4>
            <StatusBadge variant={riskLevelTone(mother.riskLevel)}>{mother.riskLevel} Risk</StatusBadge>
            {mother.laborStatus !== "Not in Labor" && (
              <StatusBadge variant={laborStatusTone(mother.laborStatus)}>{mother.laborStatus}</StatusBadge>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">UHID: {mother.uhid} | Age: {mother.age} | {mother.bloodGroup}</p>
          <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-600">
            <span>G{mother.gravida}P{mother.para}A{mother.abortions}</span>
            <span>|</span>
            <span>GA: {mother.currentGestationalAge}</span>
            <span>|</span>
            <span>BP: {mother.bpSystolic}/{mother.bpDiastolic}</span>
          </div>
          <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
            <span>LMP: {mother.lmp}</span>
            <span>EDD: {mother.edd}</span>
          </div>
        </div>
        <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-rose-400 mt-1 transition-colors" />
      </div>
    </button>
  );
}

/* ── ANC Visit Card ───────────────────────────────────────────────────────── */
export function ANCCard({ visit, onSelect }: { visit: ANCV; onSelect?: (v: ANCV) => void }) {
  return (
    <button onClick={() => onSelect?.(visit)} className="w-full text-left bg-white border border-slate-200 rounded-xl p-4 hover:border-rose-300 hover:shadow-md transition-all duration-200 group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-sm text-slate-900">{visit.motherName}</h4>
            <StatusBadge variant={ancVisitStatusTone(visit.status)}>{visit.status}</StatusBadge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">ANC Visit #{visit.visitNumber} | {visit.visitDate} | GA: {visit.gestationalAge}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-slate-600">
            <span className="flex items-center gap-1"><Heart className="h-3 w-3" /> BP: {visit.bpSystolic}/{visit.bpDiastolic}</span>
            <span>WT: {visit.weight}kg</span>
            <span>FH: {visit.fundalHeight}cm</span>
            <span>FHR: {visit.fetalHeartRate}bpm</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">{visit.notes}</p>
        </div>
        <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-rose-400 mt-1 transition-colors" />
      </div>
    </button>
  );
}

/* ── Ultrasound Card ──────────────────────────────────────────────────────── */
export function USCard({ us, onSelect }: { us: Ultrasound; onSelect?: (u: Ultrasound) => void }) {
  return (
    <button onClick={() => onSelect?.(us)} className="w-full text-left bg-white border border-slate-200 rounded-xl p-4 hover:border-rose-300 hover:shadow-md transition-all duration-200 group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-sm text-slate-900">{us.motherName}</h4>
            <StatusBadge variant="info">{us.scanType}</StatusBadge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{us.scanDate} | GA: {us.gestationalAge} | EFW: {us.estimatedFetalWeight}g</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-slate-600">
            <span>BPD: {us.biparietalDiameter}cm</span>
            <span>FL: {us.femurLength}cm</span>
            <span>AC: {us.abdominalCircumference}cm</span>
            <span>AFI: {us.amnioticFluidIndex}</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">{us.findings}</p>
        </div>
        <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-rose-400 mt-1 transition-colors" />
      </div>
    </button>
  );
}

/* ── Risk Assessment Card ─────────────────────────────────────────────────── */
export function RiskCard({ ra, onSelect }: { ra: RiskAssessment; onSelect?: (r: RiskAssessment) => void }) {
  return (
    <button onClick={() => onSelect?.(ra)} className="w-full text-left bg-white border border-slate-200 rounded-xl p-4 hover:border-rose-300 hover:shadow-md transition-all duration-200 group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-sm text-slate-900">{ra.motherName}</h4>
            <StatusBadge variant={riskLevelTone(ra.overallRisk)}>{ra.overallRisk} Risk</StatusBadge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Assessed: {ra.assessmentDate} | Score: {ra.preEclampsiaScore}/10</p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {ra.riskFactors.map((f) => (
              <span key={f} className="px-2 py-0.5 bg-red-50 text-red-700 text-[10px] rounded-full font-medium">{f}</span>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-1.5">{ra.carePlan}</p>
        </div>
        <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-rose-400 mt-1 transition-colors" />
      </div>
    </button>
  );
}

/* ── Labor Admission Card ─────────────────────────────────────────────────── */
export function LaborCard({ admission, onSelect }: { admission: LaborAdmission; onSelect?: (a: LaborAdmission) => void }) {
  return (
    <button onClick={() => onSelect?.(admission)} className="w-full text-left bg-white border border-slate-200 rounded-xl p-4 hover:border-rose-300 hover:shadow-md transition-all duration-200 group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-sm text-slate-900">{admission.motherName}</h4>
            <StatusBadge variant={laborStatusTone(admission.status)}>{admission.status}</StatusBadge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{admission.laborRoom} | Admitted: {admission.admissionTime} | GA: {admission.gestationalAge}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-slate-600">
            <span>Cervix: {admission.cervicalDilatation}cm</span>
            <span>Effacement: {admission.cervicalEffacement}%</span>
            <span>Pain: {admission.painScore}/10</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">{admission.admissionNotes}</p>
        </div>
        <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-rose-400 mt-1 transition-colors" />
      </div>
    </button>
  );
}

/* ── Newborn Card ─────────────────────────────────────────────────────────── */
export function NewbornCard({ nb, onSelect }: { nb: Newborn; onSelect?: (n: Newborn) => void }) {
  return (
    <button onClick={() => onSelect?.(nb)} className="w-full text-left bg-white border border-slate-200 rounded-xl p-4 hover:border-rose-300 hover:shadow-md transition-all duration-200 group">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
          <Baby className="h-5 w-5 text-pink-600" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-sm text-slate-900">{nb.babyId} — {nb.gender}</h4>
            <StatusBadge variant={nicuStatusTone(nb.nicuStatus)}>{nb.nicuStatus}</StatusBadge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Mother: {nb.motherName} | Born: {nb.birthDate} {nb.birthTime}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-slate-600">
            <span>WT: {nb.birthWeight}g</span>
            <span>Len: {nb.length}cm</span>
            <span>HC: {nb.headCircumference}cm</span>
            <span>APGAR: {nb.apgar1min}/{nb.apgar5min}</span>
          </div>
        </div>
        <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-rose-400 mt-1 transition-colors" />
      </div>
    </button>
  );
}

/* ── Postpartum Card ──────────────────────────────────────────────────────── */
export function PostpartumCard({ pc, onSelect }: { pc: PostpartumCare; onSelect?: (p: PostpartumCare) => void }) {
  return (
    <button onClick={() => onSelect?.(pc)} className="w-full text-left bg-white border border-slate-200 rounded-xl p-4 hover:border-rose-300 hover:shadow-md transition-all duration-200 group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-sm text-slate-900">{pc.motherName}</h4>
            <StatusBadge variant={postpartumStatusTone(pc.status)}>{pc.status}</StatusBadge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{pc.assessmentDate} | BP: {pc.bpSystolic}/{pc.bpDiastolic} | Temp: {pc.temperature}°C</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-slate-600">
            <span>Uterus: {pc.uterineInvolution}</span>
            <span>Bleeding: {pc.bleeding}</span>
            <span>Pain: {pc.painScore}/10</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">{pc.notes}</p>
        </div>
        <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-rose-400 mt-1 transition-colors" />
      </div>
    </button>
  );
}

/* ── Lactation Card ───────────────────────────────────────────────────────── */
export function LactationCard({ ls, onSelect }: { ls: LactationSupport; onSelect?: (l: LactationSupport) => void }) {
  return (
    <button onClick={() => onSelect?.(ls)} className="w-full text-left bg-white border border-slate-200 rounded-xl p-4 hover:border-rose-300 hover:shadow-md transition-all duration-200 group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-sm text-slate-900">{ls.motherName}</h4>
            <StatusBadge variant={ls.milkSupply === "Adequate" ? "success" : "warning"}>{ls.milkSupply}</StatusBadge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{ls.assessmentDate} | Latch: {ls.latchScore}/10 | Freq: {ls.feedingFrequency}</p>
          <p className="text-xs text-slate-500 mt-1">{ls.notes}</p>
        </div>
        <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-rose-400 mt-1 transition-colors" />
      </div>
    </button>
  );
}

/* ── Audit Log Row ────────────────────────────────────────────────────────── */
export function AuditRow({ log }: { log: AuditLog }) {
  const severityIcon = { Info: <CheckCircle2 className="h-4 w-4 text-blue-500" />, Warning: <AlertTriangle className="h-4 w-4 text-amber-500" />, Critical: <XCircle className="h-4 w-4 text-red-500" /> };
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

/* ── Partograph Preview ───────────────────────────────────────────────────── */
export function PartographPreview({ pg }: { pg: Partograph }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-sm text-slate-900">Partograph — {pg.motherName}</h4>
        <StatusBadge variant={partographStatusTone(pg.status)}>{pg.status}</StatusBadge>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div className="bg-slate-50 rounded-lg p-2">
          <p className="text-slate-500">Cervical Dilation</p>
          <p className="font-bold text-slate-900">{pg.cervicalDilatation[pg.cervicalDilatation.length - 1]}cm</p>
          <p className="text-slate-400">→ {pg.cervicalDilatation.join(" → ")}</p>
        </div>
        <div className="bg-slate-50 rounded-lg p-2">
          <p className="text-slate-500">Descent of Head</p>
          <p className="font-bold text-slate-900">{pg.descentOfHead[pg.descentOfHead.length - 1]}</p>
          <p className="text-slate-400">→ {pg.descentOfHead.join(" → ")}</p>
        </div>
        <div className="bg-slate-50 rounded-lg p-2">
          <p className="text-slate-500">Fetal Heart Rate</p>
          <p className="font-bold text-slate-900">{pg.fetalHeartRate[pg.fetalHeartRate.length - 1]}bpm</p>
          <p className="text-slate-400">→ {pg.fetalHeartRate.join(" → ")}</p>
        </div>
        <div className="bg-slate-50 rounded-lg p-2">
          <p className="text-slate-500">Contractions</p>
          <p className="font-bold text-slate-900">{pg.contractions[pg.contractions.length - 1]}</p>
          <p className="text-slate-400">→ {pg.contractions.join(" → ")}</p>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div className="bg-slate-50 rounded-lg p-2">
          <p className="text-slate-500">Maternal Pulse</p>
          <p className="font-bold text-slate-900">{pg.maternalPulse[pg.maternalPulse.length - 1]}bpm</p>
        </div>
        <div className="bg-slate-50 rounded-lg p-2">
          <p className="text-slate-500">BP Systolic</p>
          <p className="font-bold text-slate-900">{pg.bpSystolic[pg.bpSystolic.length - 1]}mmHg</p>
        </div>
        <div className="bg-slate-50 rounded-lg p-2">
          <p className="text-slate-500">BP Diastolic</p>
          <p className="font-bold text-slate-900">{pg.bpDiastolic[pg.bpDiastolic.length - 1]}mmHg</p>
        </div>
        <div className="bg-slate-50 rounded-lg p-2">
          <p className="text-slate-500">Urine Output</p>
          <p className="font-bold text-slate-900">{pg.urineOutput[pg.urineOutput.length - 1]}ml/hr</p>
        </div>
      </div>
      <p className="text-xs text-slate-400 mt-2">Obstetrician: {pg.obstetrician} | Started: {pg.startTime}</p>
    </div>
  );
}
