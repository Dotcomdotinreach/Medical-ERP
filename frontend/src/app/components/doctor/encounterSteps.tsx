import { useState } from "react";
import {
  Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
} from "recharts";
import {
  Phone, ShieldCheck, AlertTriangle, Pill, ClipboardList, HeartPulse, Activity,
  Search, Plus, X, Check, FlaskConical, Scan, Mic,
  FileText, Stethoscope, CalendarDays, Video, PenLine, Printer, Download, Send, BedDouble,
  Building2, Home, ArrowUpRight, ClipboardCheck, TriangleAlert,
} from "lucide-react";
import { toast } from "sonner";
import { SectionCard, StatusBadge, Avatar } from "../his/ui";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Field, VitalStat } from "./docUi";
import {
  ACTIVE_PATIENT, CURRENT_VITALS, BMI, VITALS_TREND, SUGAR_TREND, ICD10, LAB_TESTS, RAD_TESTS,
  MEDICINES, FREQUENCIES, MEAL_REL, INTERACTIONS, DOCTOR,
  type EmrPatient,
} from "./docData";

export interface Rx { id: number; generic: string; brand: string; dose: string; freq: string; duration: string; meal: string }
export interface Dx { code: string; label: string; kind: "primary" | "secondary" }

export interface EncounterState {
  examSymptoms: string[];
  examFindings: string;
  diagnoses: Dx[];
  severity: string;
  impression: string;
  labOrders: string[];
  labPriority: "STAT" | "Routine";
  radOrders: string[];
  radPriority: "STAT" | "Routine";
  prescriptions: Rx[];
  treatment: string[];
  diet: string;
  specialInstr: string;
  soap: { s: string; o: string; a: string; p: string };
  admission: string;
  ward: string;
  followUpDate: string;
  followUpMode: "Physical Visit" | "Video";
  signed: boolean;
}

export const INITIAL_ENCOUNTER: EncounterState = {
  examSymptoms: ["Fatigue", "Polydipsia"],
  examFindings: "",
  diagnoses: [],
  severity: "Moderate",
  impression: "",
  labOrders: [],
  labPriority: "Routine",
  radOrders: [],
  radPriority: "Routine",
  prescriptions: [],
  treatment: [],
  diet: "Diabetic diet — low glycaemic index, controlled carbohydrate",
  specialInstr: "",
  soap: { s: "", o: "", a: "", p: "" },
  admission: "",
  ward: "",
  followUpDate: "2026-08-05",
  followUpMode: "Physical Visit",
  signed: false,
};

type StepProps = {
  patient: EmrPatient;
  state: EncounterState;
  update: (patch: Partial<EncounterState>) => void;
};

/* ============================ 04 · Patient Summary ============================ */
export function SummaryStep({ patient }: StepProps) {
  const p = patient;
  return (
    <div className="space-y-6">
      <SectionCard>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Avatar name={p.name} size={72} tone="brand" />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-bold text-text-primary" style={{ fontSize: 22 }}>{p.name}</h2>
              <StatusBadge tone="danger">{p.blood}</StatusBadge>
            </div>
            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-text-secondary">
              <span>UHID {p.uhid}</span><span>{p.age} yrs · {p.gender}</span>
              <span className="inline-flex items-center gap-1"><Phone className="size-3.5" />{p.phone}</span>
            </div>
          </div>
        </div>
        <div className="mt-4 rounded-xl border border-primary/20 bg-secondary/50 p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-primary">Chief Complaint</div>
          <div className="mt-1 text-text-primary">{p.chiefComplaint}</div>
        </div>
      </SectionCard>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SectionCard title="Known Allergies">
          <div className="flex flex-wrap gap-2">
            {p.allergies.map((a) => (
              <span key={a} className="inline-flex items-center gap-1.5 rounded-full bg-danger/10 px-3 py-1.5 text-sm font-medium text-danger">
                <AlertTriangle className="size-3.5" />{a}
              </span>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Current Medications">
          <div className="space-y-2">
            {p.currentMeds.map((m) => (
              <div key={m.name} className="flex items-center gap-2 text-sm">
                <Pill className="size-4 text-primary" /><span className="font-medium text-text-primary">{m.name}</span>
                <span className="text-text-secondary">· {m.dose}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Medical History">
          <ul className="space-y-1.5 text-sm text-text-secondary">
            {p.history.map((h) => <li key={h} className="flex gap-2"><ClipboardList className="size-4 shrink-0 text-text-secondary" />{h}</li>)}
          </ul>
        </SectionCard>

        <SectionCard title="Insurance & Emergency Contact">
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2"><ShieldCheck className="size-4 text-success" /><span className="font-medium text-text-primary">{p.insurance.provider}</span></div>
            <div className="text-text-secondary">Policy {p.insurance.policy} · {p.insurance.coverage}</div>
            <div className="text-text-secondary">Valid till {p.insurance.validTill}</div>
            <div className="mt-3 border-t border-border pt-3 text-text-secondary">
              <span className="font-medium text-text-primary">{p.emergencyContact.name}</span> ({p.emergencyContact.relation}) · {p.emergencyContact.phone}
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

/* ============================ 05 · EMR tabs ============================ */
export function EmrStep({ patient }: StepProps) {
  const p = patient;
  return (
    <SectionCard title="Electronic Medical Record">
      <Tabs defaultValue="overview">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="history">Medical</TabsTrigger>
          <TabsTrigger value="surgical">Surgical</TabsTrigger>
          <TabsTrigger value="family">Family</TabsTrigger>
          <TabsTrigger value="allergies">Allergies</TabsTrigger>
          <TabsTrigger value="vaccinations">Vaccinations</TabsTrigger>
          <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
          <TabsTrigger value="admissions">Admissions</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="pt-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border p-4"><div className="text-xs text-text-secondary">Blood Group</div><div className="mt-1 font-medium text-text-primary">{p.blood}</div></div>
            <div className="rounded-xl border border-border p-4"><div className="text-xs text-text-secondary">Active Conditions</div><div className="mt-1 font-medium text-text-primary">{p.history.length}</div></div>
            <div className="rounded-xl border border-border p-4"><div className="text-xs text-text-secondary">Allergies</div><div className="mt-1 font-medium text-danger">{p.allergies.length} recorded</div></div>
            <div className="rounded-xl border border-border p-4"><div className="text-xs text-text-secondary">Previous Admissions</div><div className="mt-1 font-medium text-text-primary">{p.admissions.length}</div></div>
          </div>
        </TabsContent>
        <TabsContent value="history" className="space-y-2 pt-4 text-sm text-text-secondary">
          {p.history.map((h) => <div key={h} className="flex gap-2"><ClipboardList className="size-4 text-primary" />{h}</div>)}
        </TabsContent>
        <TabsContent value="surgical" className="space-y-2 pt-4 text-sm">
          {p.surgical.map((s) => <div key={s.procedure} className="flex justify-between border-b border-border py-2"><span className="text-text-primary">{s.procedure}</span><span className="text-text-secondary">{s.year}</span></div>)}
        </TabsContent>
        <TabsContent value="family" className="space-y-2 pt-4 text-sm text-text-secondary">
          {p.family.map((f) => <div key={f} className="flex gap-2"><HeartPulse className="size-4 text-danger" />{f}</div>)}
        </TabsContent>
        <TabsContent value="allergies" className="flex flex-wrap gap-2 pt-4">
          {p.allergies.map((a) => <span key={a} className="inline-flex items-center gap-1.5 rounded-full bg-danger/10 px-3 py-1.5 text-sm font-medium text-danger"><AlertTriangle className="size-3.5" />{a}</span>)}
        </TabsContent>
        <TabsContent value="vaccinations" className="space-y-2 pt-4 text-sm">
          {p.vaccinations.map((v) => <div key={v.name} className="flex justify-between border-b border-border py-2"><span className="text-text-primary">{v.name}</span><span className="text-text-secondary">{v.date}</span></div>)}
        </TabsContent>
        <TabsContent value="lifestyle" className="grid grid-cols-2 gap-4 pt-4 sm:grid-cols-4">
          {p.lifestyle.map((l) => <div key={l.label} className="rounded-xl border border-border p-4"><div className="text-xs text-text-secondary">{l.label}</div><div className="mt-1 font-medium text-text-primary">{l.value}</div></div>)}
        </TabsContent>
        <TabsContent value="admissions" className="space-y-2 pt-4 text-sm">
          {p.admissions.map((a) => (
            <div key={a.reason} className="rounded-xl border border-border p-4">
              <div className="font-medium text-text-primary">{a.reason}</div>
              <div className="text-text-secondary">{a.ward} · {a.from} → {a.to}</div>
            </div>
          ))}
        </TabsContent>
        <TabsContent value="timeline" className="pt-4">
          <ol className="relative space-y-4 border-l border-border pl-5 text-sm">
            {["Registered at Meridian (2016)", "Diagnosed T2DM (2016)", "DKA admission (Feb 2023)", "Today — OPD review"].map((t) => (
              <li key={t} className="relative"><span className="absolute -left-[23px] top-1 size-2.5 rounded-full bg-primary" /><span className="text-text-primary">{t}</span></li>
            ))}
          </ol>
        </TabsContent>
      </Tabs>
    </SectionCard>
  );
}

/* ============================ 06 · Vitals ============================ */
export function VitalsStep() {
  const v = CURRENT_VITALS;
  return (
    <div className="space-y-6">
      <SectionCard title="Current Vitals — recorded 09:32">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <VitalStat label="Heart Rate" value={v.hr} unit="bpm" status="normal" />
          <VitalStat label="Blood Pressure" value={`${v.bpSys}/${v.bpDia}`} unit="mmHg" status="high" />
          <VitalStat label="Temperature" value={v.temp} unit="°C" status="normal" />
          <VitalStat label="Respiratory Rate" value={v.rr} unit="/min" status="normal" />
          <VitalStat label="SpO₂" value={v.spo2} unit="%" status="normal" />
          <VitalStat label="Pain Score" value={`${v.pain}/10`} status="normal" />
          <VitalStat label="Height" value={v.height} unit="cm" status="normal" />
          <VitalStat label="Weight" value={v.weight} unit="kg" status="normal" />
          <VitalStat label="BMI" value={BMI} unit="kg/m²" status="warn" />
        </div>
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-warning/10 px-3 py-2 text-sm text-[#b45309]">
          <TriangleAlert className="size-4" />BP elevated (Stage 2 HTN) and BMI in overweight range — correlate clinically.
        </div>
      </SectionCard>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <SectionCard title="BP & Heart Rate Trend">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={VITALS_TREND} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="time" tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} allowDuplicatedCategory={false} />
              <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 13 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="bpSys" name="Systolic" stroke="#dc2626" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="bpDia" name="Diastolic" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="hr" name="Heart Rate" stroke="#1565ff" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Blood Sugar Trend (mg/dL)">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={SUGAR_TREND} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="time" tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} allowDuplicatedCategory={false} />
              <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 13 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="fasting" name="Fasting" stroke="#1565ff" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="pp" name="Post-Prandial" stroke="#0ea5e9" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>
    </div>
  );
}

/* ============================ 07 · Clinical Examination ============================ */
const SYMPTOM_BANK = ["Fatigue", "Polydipsia", "Polyuria", "Blurred vision", "Weight loss", "Numbness in feet", "Chest pain", "Breathlessness", "Headache", "Dizziness"];
const BODY_REGIONS = ["Head & Neck", "Chest / CVS", "Respiratory", "Abdomen", "CNS / Neuro", "Extremities"];

export function ExaminationStep({ state, update }: StepProps) {
  const toggleSymptom = (s: string) =>
    update({ examSymptoms: state.examSymptoms.includes(s) ? state.examSymptoms.filter((x) => x !== s) : [...state.examSymptoms, s] });

  return (
    <div className="space-y-6">
      <SectionCard title="Symptoms">
        <div className="flex flex-wrap gap-2">
          {SYMPTOM_BANK.map((s) => {
            const on = state.examSymptoms.includes(s);
            return (
              <button key={s} onClick={() => toggleSymptom(s)}
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${on ? "bg-primary text-primary-foreground" : "bg-muted text-text-secondary hover:bg-accent"}`}>
                {on && <Check className="mr-1 inline size-3.5" />}{s}
              </button>
            );
          })}
        </div>
      </SectionCard>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SectionCard title="Physical Examination · Body Systems">
          <div className="space-y-2">
            {BODY_REGIONS.map((r) => (
              <label key={r} className="flex items-center gap-3 rounded-lg border border-border p-3 text-sm">
                <Checkbox defaultChecked={r === "Chest / CVS" || r === "Abdomen"} />
                <span className="flex-1 font-medium text-text-primary">{r}</span>
                <span className="text-xs text-text-secondary">examined</span>
              </label>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Clinical Findings">
          <Field label="Findings & observations" hint="Documented in the encounter note">
            <Textarea rows={7} placeholder="e.g. Afebrile, mild pedal oedema, chest clear, S1S2 normal, no murmurs, abdomen soft & non-tender…"
              value={state.examFindings} onChange={(e) => update({ examFindings: e.target.value })} />
          </Field>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => toast.info("Attachment picker (demo)")}> <FileText className="size-4" />Attach image</Button>
            <Button variant="outline" size="sm" onClick={() => toast.info("Voice note recording started (demo)")}> <Mic className="size-4" />Voice note</Button>
            <Button variant="ghost" size="sm" onClick={() => toast.success("Draft saved")}>Save draft</Button>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

/* ============================ 08 · Diagnosis ============================ */
export function DiagnosisStep({ state, update }: StepProps) {
  const [q, setQ] = useState("");
  const results = ICD10.filter((d) => !q || d.label.toLowerCase().includes(q.toLowerCase()) || d.code.toLowerCase().includes(q.toLowerCase()));
  const suggestions = ICD10.slice(0, 3);

  const add = (code: string, label: string, kind: Dx["kind"]) => {
    if (state.diagnoses.some((d) => d.code === code)) { toast.info("Already added"); return; }
    update({ diagnoses: [...state.diagnoses, { code, label, kind }] });
  };
  const remove = (code: string) => update({ diagnoses: state.diagnoses.filter((d) => d.code !== code) });

  return (
    <div className="space-y-6">
      <SectionCard title="ICD-10 Diagnosis Search">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-secondary" />
          <Input placeholder="Search ICD-10 code or condition…" className="h-11 pl-9" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        {q && (
          <div className="mt-3 max-h-56 space-y-1 overflow-y-auto">
            {results.map((d) => (
              <div key={d.code} className="flex items-center gap-3 rounded-lg border border-border p-2.5">
                <span className="rounded bg-muted px-2 py-0.5 font-mono text-xs text-text-secondary">{d.code}</span>
                <span className="flex-1 text-sm text-text-primary">{d.label}</span>
                <Button size="sm" variant="outline" onClick={() => add(d.code, d.label, "primary")}>Primary</Button>
                <Button size="sm" variant="ghost" onClick={() => add(d.code, d.label, "secondary")}>Secondary</Button>
              </div>
            ))}
          </div>
        )}
        {!q && (
          <div className="mt-3">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">AI Suggestions (based on history & vitals)</div>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((d) => (
                <button key={d.code} onClick={() => add(d.code, d.label, "primary")}
                  className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-secondary px-3 py-1.5 text-sm font-medium text-primary hover:bg-secondary/70">
                  <Plus className="size-3.5" />{d.code} · {d.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </SectionCard>

      <SectionCard title={`Selected Diagnoses (${state.diagnoses.length})`}>
        {state.diagnoses.length === 0 ? (
          <p className="text-sm text-text-secondary">No diagnosis added yet. Search or pick a suggestion above.</p>
        ) : (
          <div className="space-y-2">
            {state.diagnoses.map((d) => (
              <div key={d.code} className="flex items-center gap-3 rounded-lg border border-border p-3">
                <StatusBadge tone={d.kind === "primary" ? "brand" : "neutral"}>{d.kind}</StatusBadge>
                <span className="rounded bg-muted px-2 py-0.5 font-mono text-xs text-text-secondary">{d.code}</span>
                <span className="flex-1 text-sm text-text-primary">{d.label}</span>
                <button onClick={() => remove(d.code)} className="text-text-secondary hover:text-danger"><X className="size-4" /></button>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SectionCard title="Severity">
          <div className="flex flex-wrap gap-2">
            {["Mild", "Moderate", "Severe", "Critical"].map((s) => (
              <button key={s} onClick={() => update({ severity: s })}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${state.severity === s ? "bg-primary text-primary-foreground" : "bg-muted text-text-secondary hover:bg-accent"}`}>{s}</button>
            ))}
          </div>
        </SectionCard>
        <SectionCard title="Clinical Impression">
          <Textarea rows={4} placeholder="Summarise clinical reasoning…" value={state.impression} onChange={(e) => update({ impression: e.target.value })} />
        </SectionCard>
      </div>
    </div>
  );
}

/* ============================ 09 · Laboratory Orders ============================ */
export function LabStep({ state, update }: StepProps) {
  const toggle = (id: string) => update({ labOrders: state.labOrders.includes(id) ? state.labOrders.filter((x) => x !== id) : [...state.labOrders, id] });
  const groups = [...new Set(LAB_TESTS.map((t) => t.group))];
  return (
    <div className="space-y-6">
      <SectionCard title="Laboratory Orders"
        action={<div className="flex gap-2">
          {(["Routine", "STAT"] as const).map((p) => (
            <button key={p} onClick={() => update({ labPriority: p })}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${state.labPriority === p ? (p === "STAT" ? "bg-danger text-white" : "bg-primary text-primary-foreground") : "bg-muted text-text-secondary"}`}>{p}</button>
          ))}
        </div>}>
        <div className="space-y-4">
          {groups.map((g) => (
            <div key={g}>
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">{g}</div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {LAB_TESTS.filter((t) => t.group === g).map((t) => {
                  const on = state.labOrders.includes(t.id);
                  return (
                    <label key={t.id} className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm ${on ? "border-primary bg-secondary/50" : "border-border"}`}>
                      <Checkbox checked={on} onCheckedChange={() => toggle(t.id)} />
                      <span className="flex-1"><span className="font-medium text-text-primary">{t.name}</span>{t.note && <span className="block text-xs text-text-secondary">{t.note}</span>}</span>
                      <FlaskConical className="size-4 text-text-secondary" />
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
      {state.labOrders.length > 0 && (
        <div className="flex items-center justify-between rounded-xl border border-border bg-surface p-4">
          <span className="text-sm text-text-secondary">{state.labOrders.length} test(s) selected · Priority <b className="text-text-primary">{state.labPriority}</b></span>
          <Button onClick={() => toast.success(`${state.labOrders.length} lab orders submitted to laboratory`)}><Check className="size-4" />Submit Orders</Button>
        </div>
      )}
    </div>
  );
}

/* ============================ 10 · Radiology Orders ============================ */
export function RadiologyStep({ state, update }: StepProps) {
  const toggle = (id: string) => update({ radOrders: state.radOrders.includes(id) ? state.radOrders.filter((x) => x !== id) : [...state.radOrders, id] });
  return (
    <div className="space-y-6">
      <SectionCard title="Radiology Orders"
        action={<div className="flex gap-2">
          {(["Routine", "STAT"] as const).map((p) => (
            <button key={p} onClick={() => update({ radPriority: p })}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${state.radPriority === p ? (p === "STAT" ? "bg-danger text-white" : "bg-primary text-primary-foreground") : "bg-muted text-text-secondary"}`}>{p}</button>
          ))}
        </div>}>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {RAD_TESTS.map((t) => {
            const on = state.radOrders.includes(t.id);
            return (
              <label key={t.id} className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm ${on ? "border-primary bg-secondary/50" : "border-border"}`}>
                <Checkbox checked={on} onCheckedChange={() => toggle(t.id)} />
                <span className="flex-1 font-medium text-text-primary">{t.name}</span>
                <span className="rounded bg-muted px-2 py-0.5 text-xs text-text-secondary">{t.modality}</span>
                <Scan className="size-4 text-text-secondary" />
              </label>
            );
          })}
        </div>
      </SectionCard>
      {state.radOrders.length > 0 && (
        <div className="flex items-center justify-between rounded-xl border border-border bg-surface p-4">
          <span className="text-sm text-text-secondary">{state.radOrders.length} study(ies) selected · Priority <b className="text-text-primary">{state.radPriority}</b></span>
          <Button onClick={() => toast.success(`${state.radOrders.length} radiology orders submitted`)}><Check className="size-4" />Submit Orders</Button>
        </div>
      )}
    </div>
  );
}

/* ============================ 11 · Prescription ============================ */
export function PrescriptionStep({ patient, state, update }: StepProps) {
  const [q, setQ] = useState("");
  const [draft, setDraft] = useState<Rx>({ id: 0, generic: "", brand: "", dose: "1 tablet", freq: FREQUENCIES[0], duration: "7 days", meal: MEAL_REL[1] });
  const results = MEDICINES.filter((m) => !q || m.generic.toLowerCase().includes(q.toLowerCase()) || m.brand.toLowerCase().includes(q.toLowerCase()));

  const pick = (generic: string, brand: string) => { setDraft({ ...draft, generic, brand }); setQ(""); };
  const add = () => {
    if (!draft.generic) { toast.error("Select a medicine first"); return; }
    update({ prescriptions: [...state.prescriptions, { ...draft, id: Date.now() }] });
    setDraft({ id: 0, generic: "", brand: "", dose: "1 tablet", freq: FREQUENCIES[0], duration: "7 days", meal: MEAL_REL[1] });
  };
  const remove = (id: number) => update({ prescriptions: state.prescriptions.filter((r) => r.id !== id) });

  // Drug-interaction check against current meds + selected Rx.
  const activeNames = [...patient.currentMeds.map((m) => m.name), ...state.prescriptions.map((r) => r.generic), draft.generic].filter(Boolean);
  const warnings = Object.entries(INTERACTIONS).filter(([k]) => k.split("+").every((n) => activeNames.some((a) => a.includes(n))));

  return (
    <div className="space-y-6">
      {warnings.length > 0 && (
        <div className="space-y-2 rounded-xl border border-danger/30 bg-danger/5 p-4">
          <div className="flex items-center gap-2 font-semibold text-danger"><TriangleAlert className="size-4" />Drug Interaction Warning</div>
          {warnings.map(([k, v]) => <div key={k} className="text-sm text-text-secondary"><b className="text-text-primary">{k.replace("+", " + ")}:</b> {v}</div>)}
        </div>
      )}

      <SectionCard title="Prescription Builder">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-secondary" />
          <Input placeholder="Search medicine (generic or brand)…" className="h-11 pl-9" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        {q && (
          <div className="mt-2 max-h-48 space-y-1 overflow-y-auto">
            {results.map((m) => (
              <button key={m.brand} onClick={() => pick(m.generic, m.brand)}
                className="flex w-full items-center gap-3 rounded-lg border border-border p-2.5 text-left text-sm hover:border-primary">
                <Pill className="size-4 text-primary" />
                <span className="flex-1"><span className="font-medium text-text-primary">{m.brand}</span> <span className="text-text-secondary">({m.generic}) · {m.form}</span></span>
                <Plus className="size-4 text-text-secondary" />
              </button>
            ))}
          </div>
        )}

        {draft.generic && (
          <div className="mt-4 rounded-xl border border-primary/30 bg-secondary/40 p-4">
            <div className="mb-3 font-medium text-text-primary">{draft.brand} <span className="text-text-secondary">({draft.generic})</span></div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Field label="Dosage"><Input value={draft.dose} onChange={(e) => setDraft({ ...draft, dose: e.target.value })} /></Field>
              <Field label="Frequency">
                <select className="h-9 w-full rounded-md border border-border bg-input-background px-3 text-sm" value={draft.freq} onChange={(e) => setDraft({ ...draft, freq: e.target.value })}>
                  {FREQUENCIES.map((f) => <option key={f}>{f}</option>)}
                </select>
              </Field>
              <Field label="Duration"><Input value={draft.duration} onChange={(e) => setDraft({ ...draft, duration: e.target.value })} /></Field>
              <Field label="Instructions">
                <select className="h-9 w-full rounded-md border border-border bg-input-background px-3 text-sm" value={draft.meal} onChange={(e) => setDraft({ ...draft, meal: e.target.value })}>
                  {MEAL_REL.map((m) => <option key={m}>{m}</option>)}
                </select>
              </Field>
            </div>
            <div className="mt-3 flex justify-end"><Button size="sm" onClick={add}><Plus className="size-4" />Add to prescription</Button></div>
          </div>
        )}
      </SectionCard>

      <SectionCard title={`Prescription (${state.prescriptions.length})`}
        action={<Button variant="outline" size="sm" disabled={state.prescriptions.length === 0} onClick={() => toast.success("Digital prescription generated & signed")}><FileText className="size-4" />Generate</Button>}>
        {state.prescriptions.length === 0 ? (
          <p className="text-sm text-text-secondary">No medicines added yet.</p>
        ) : (
          <div className="-mx-5 overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead><tr className="border-b border-border text-left text-xs uppercase tracking-wide text-text-secondary">
                <th className="px-5 py-2 font-medium">Medicine</th><th className="px-5 py-2 font-medium">Dosage</th>
                <th className="px-5 py-2 font-medium">Frequency</th><th className="px-5 py-2 font-medium">Duration</th>
                <th className="px-5 py-2 font-medium">Instructions</th><th className="px-5 py-2" />
              </tr></thead>
              <tbody>
                {state.prescriptions.map((r) => (
                  <tr key={r.id} className="border-b border-border last:border-0">
                    <td className="px-5 py-3"><span className="font-medium text-text-primary">{r.brand}</span> <span className="text-text-secondary">({r.generic})</span></td>
                    <td className="px-5 py-3 text-text-secondary">{r.dose}</td>
                    <td className="px-5 py-3 text-text-secondary">{r.freq}</td>
                    <td className="px-5 py-3 text-text-secondary">{r.duration}</td>
                    <td className="px-5 py-3 text-text-secondary">{r.meal}</td>
                    <td className="px-5 py-3 text-right"><button onClick={() => remove(r.id)} className="text-text-secondary hover:text-danger"><X className="size-4" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </div>
  );
}

/* ============================ 12 · Treatment Plan ============================ */
const TREATMENTS = ["IV Fluids (NS/RL)", "Injection", "Oral Medication", "Observation", "Physiotherapy", "Insulin titration", "Dietary counselling", "Nebulisation"];
export function TreatmentStep({ state, update }: StepProps) {
  const toggle = (t: string) => update({ treatment: state.treatment.includes(t) ? state.treatment.filter((x) => x !== t) : [...state.treatment, t] });
  return (
    <div className="space-y-6">
      <SectionCard title="Procedures & Therapy">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {TREATMENTS.map((t) => {
            const on = state.treatment.includes(t);
            return (
              <label key={t} className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm ${on ? "border-primary bg-secondary/50" : "border-border"}`}>
                <Checkbox checked={on} onCheckedChange={() => toggle(t)} />
                <span className="flex-1 font-medium text-text-primary">{t}</span>
              </label>
            );
          })}
        </div>
      </SectionCard>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SectionCard title="Diet">
          <Textarea rows={4} value={state.diet} onChange={(e) => update({ diet: e.target.value })} />
        </SectionCard>
        <SectionCard title="Special Instructions">
          <Textarea rows={4} placeholder="e.g. Monitor blood sugar QID, strict I/O charting, escalate if SBP > 180…"
            value={state.specialInstr} onChange={(e) => update({ specialInstr: e.target.value })} />
        </SectionCard>
      </div>
    </div>
  );
}

/* ============================ 13 · Clinical Notes (SOAP) ============================ */
export function NotesStep({ state, update }: StepProps) {
  const set = (k: keyof EncounterState["soap"], v: string) => update({ soap: { ...state.soap, [k]: v } });
  const fields: { k: keyof EncounterState["soap"]; label: string; hint: string }[] = [
    { k: "s", label: "Subjective", hint: "Patient-reported symptoms & history" },
    { k: "o", label: "Objective", hint: "Exam findings, vitals, investigation results" },
    { k: "a", label: "Assessment", hint: "Diagnosis & clinical reasoning" },
    { k: "p", label: "Plan", hint: "Management, orders & follow-up" },
  ];
  return (
    <div className="space-y-6">
      <SectionCard title="SOAP Note"
        action={<Button variant="outline" size="sm" onClick={() => toast.info("Voice dictation started (demo)")}> <Mic className="size-4" />Dictate</Button>}>
        <div className="space-y-4">
          {fields.map((f) => (
            <Field key={f.k} label={f.label} hint={f.hint}>
              <Textarea rows={3} value={state.soap[f.k]} onChange={(e) => set(f.k, e.target.value)} />
            </Field>
          ))}
        </div>
        <div className="mt-3 flex justify-end"><Button variant="ghost" size="sm" onClick={() => toast.success("Progress note saved")}>Save note</Button></div>
      </SectionCard>
    </div>
  );
}

/* ============================ 14 · Admission Decision ============================ */
const DISPOSITIONS = [
  { id: "Ward", label: "Admit to Ward", icon: BedDouble, desc: "General Medicine ward bed" },
  { id: "ICU", label: "Admit to ICU", icon: HeartPulse, desc: "Intensive monitoring" },
  { id: "OT", label: "Operation Theater", icon: Building2, desc: "Schedule surgery" },
  { id: "Day Care", label: "Day Care", icon: ClipboardCheck, desc: "Same-day procedure" },
  { id: "Referral", label: "Refer / Transfer", icon: ArrowUpRight, desc: "To specialist / higher centre" },
  { id: "Observation", label: "Observation", icon: Activity, desc: "Short-stay monitoring" },
  { id: "Discharge", label: "Discharge Home", icon: Home, desc: "Manage as outpatient" },
];
const WARDS = ["General Medicine — Ward A", "General Medicine — Ward B", "ICU", "HDU", "Day Care Unit"];

export function AdmissionStep({ state, update }: StepProps) {
  return (
    <div className="space-y-6">
      <SectionCard title="Admission Decision">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {DISPOSITIONS.map((d) => {
            const on = state.admission === d.id;
            return (
              <button key={d.id} onClick={() => update({ admission: d.id })}
                className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-all ${on ? "border-primary bg-secondary/50 ring-1 ring-primary" : "border-border hover:border-primary"}`}>
                <div className={`grid size-10 place-items-center rounded-lg ${on ? "bg-primary text-primary-foreground" : "bg-muted text-text-secondary"}`}><d.icon className="size-5" /></div>
                <div><div className="font-medium text-text-primary">{d.label}</div><div className="text-xs text-text-secondary">{d.desc}</div></div>
              </button>
            );
          })}
        </div>
      </SectionCard>

      {(state.admission === "Ward" || state.admission === "ICU" || state.admission === "Day Care") && (
        <SectionCard title="Assign Ward / Bed">
          <div className="flex flex-wrap gap-2">
            {WARDS.map((w) => (
              <button key={w} onClick={() => update({ ward: w })}
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium ${state.ward === w ? "bg-primary text-primary-foreground" : "bg-muted text-text-secondary hover:bg-accent"}`}>{w}</button>
            ))}
          </div>
        </SectionCard>
      )}
    </div>
  );
}

/* ============================ 15 · Discharge Summary ============================ */
export function DischargeStep({ patient, state }: StepProps) {
  const primary = state.diagnoses.find((d) => d.kind === "primary");
  return (
    <div className="space-y-6">
      <SectionCard title="Discharge Summary"
        action={<Button variant="outline" size="sm" onClick={() => toast.success("Medical certificate generated")}><FileText className="size-4" />Medical Certificate</Button>}>
        <div className="space-y-4 text-sm">
          <Row label="Patient" value={`${patient.name} · ${patient.age}/${patient.gender[0]} · ${patient.uhid}`} />
          <Row label="Final Diagnosis" value={primary ? `${primary.code} — ${primary.label}` : "—"} />
          <Row label="Treatment Given" value={state.treatment.length ? state.treatment.join(", ") : "Conservative management"} />
          <Row label="Hospital Stay" value={state.admission && state.admission !== "Discharge" ? `${state.admission}${state.ward ? " · " + state.ward : ""}` : "OPD — same day"} />
          <Row label="Discharge Medication" value={state.prescriptions.length ? state.prescriptions.map((r) => `${r.brand} ${r.freq.split(" ")[0]}`).join(", ") : "As prescribed"} />
          <Row label="Diet Advice" value={state.diet} />
          <Row label="Exercise" value="30 min brisk walk daily; avoid strenuous activity for 1 week" />
          <Row label="Instructions" value={state.specialInstr || "Return if symptoms worsen — fever, chest pain, breathlessness."} />
        </div>
      </SectionCard>
    </div>
  );
}
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-border pb-3 last:border-0 sm:flex-row sm:gap-4">
      <span className="w-44 shrink-0 text-text-secondary">{label}</span>
      <span className="flex-1 text-text-primary">{value}</span>
    </div>
  );
}

/* ============================ 16 · Follow-up ============================ */
export function FollowUpStep({ state, update }: StepProps) {
  return (
    <div className="space-y-6">
      <SectionCard title="Schedule Follow-up">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Follow-up date" required>
            <Input type="date" value={state.followUpDate} onChange={(e) => update({ followUpDate: e.target.value })} />
          </Field>
          <Field label="Consulting Doctor">
            <Input value={DOCTOR.name} readOnly />
          </Field>
        </div>
        <div className="mt-4">
          <div className="mb-2 text-sm font-medium text-text-primary">Consultation Mode</div>
          <div className="flex gap-3">
            {([
              { m: "Physical Visit" as const, icon: Stethoscope },
              { m: "Video" as const, icon: Video },
            ]).map(({ m, icon: Icon }) => (
              <button key={m} onClick={() => update({ followUpMode: m })}
                className={`flex flex-1 items-center gap-3 rounded-xl border p-4 text-left ${state.followUpMode === m ? "border-primary bg-secondary/50 ring-1 ring-primary" : "border-border hover:border-primary"}`}>
                <Icon className="size-5 text-primary" /><span className="font-medium text-text-primary">{m}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-info/10 px-3 py-2 text-sm text-[#0369a1]">
          <CalendarDays className="size-4" />Reminder will be sent to the patient 24 hours before via SMS & patient portal.
        </div>
      </SectionCard>
    </div>
  );
}

/* ============================ 17 · Digital Signature ============================ */
export function SignatureStep({ state, update }: StepProps) {
  return (
    <div className="space-y-6">
      <SectionCard title="Digital Signature & Authentication">
        <div className="rounded-xl border border-border p-5">
          <div className="flex items-center gap-3">
            <Avatar name={DOCTOR.name} tone="brand" />
            <div><div className="font-medium text-text-primary">{DOCTOR.name}</div><div className="text-sm text-text-secondary">{DOCTOR.qualification}</div></div>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 text-sm">
            <div className="rounded-lg bg-muted/60 p-3"><div className="text-xs text-text-secondary">Medical Council Registration</div><div className="mt-0.5 font-medium text-text-primary">{DOCTOR.regNo}</div></div>
            <div className="rounded-lg bg-muted/60 p-3"><div className="text-xs text-text-secondary">Timestamp</div><div className="mt-0.5 font-medium text-text-primary">22 Jul 2026, 09:58 IST</div></div>
          </div>

          <div className="mt-4 grid h-28 place-items-center rounded-xl border-2 border-dashed border-border bg-canvas">
            {state.signed
              ? <div className="text-center"><PenLine className="mx-auto size-6 text-primary" /><div className="mt-1 font-semibold text-primary" style={{ fontFamily: "cursive" }}>{DOCTOR.name}</div></div>
              : <span className="text-sm text-text-secondary">Signature pad — click Sign to authenticate</span>}
          </div>

          <div className="mt-4 flex items-center justify-between">
            {state.signed
              ? <span className="inline-flex items-center gap-1.5 text-sm font-medium text-success"><ShieldCheck className="size-4" />Verified & digitally signed</span>
              : <span className="text-sm text-text-secondary">Not yet signed</span>}
            {state.signed
              ? <Button variant="outline" onClick={() => update({ signed: false })}>Re-sign</Button>
              : <Button onClick={() => { update({ signed: true }); toast.success("Record digitally signed & verified"); }}><PenLine className="size-4" />Sign & Verify</Button>}
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

/* ============================ 18 · Case Completed ============================ */
export function CompleteStep({ patient, state, onReturn }: StepProps & { onReturn: () => void }) {
  const primary = state.diagnoses.find((d) => d.kind === "primary");
  const timeline = [
    "09:32 · Patient checked in & vitals recorded",
    "09:40 · Clinical examination completed",
    `09:46 · Diagnosis — ${primary ? primary.code : "recorded"}`,
    `09:50 · ${state.labOrders.length} lab & ${state.radOrders.length} radiology orders raised`,
    `09:54 · Prescription (${state.prescriptions.length} meds) generated`,
    "09:58 · Record signed & case closed",
  ];
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <SectionCard>
        <div className="flex flex-col items-center py-4 text-center">
          <div className="grid size-16 place-items-center rounded-full bg-success/10 text-success"><Check className="size-8" /></div>
          <h2 className="mt-4 font-bold text-text-primary" style={{ fontSize: 22 }}>Case Completed</h2>
          <p className="mt-1 text-text-secondary">{patient.name} · {patient.uhid} · encounter closed & recorded to EMR.</p>
        </div>
      </SectionCard>

      <SectionCard title="Case Timeline">
        <ol className="relative space-y-4 border-l border-border pl-5 text-sm">
          {timeline.map((t) => <li key={t} className="relative"><span className="absolute -left-[23px] top-1 size-2.5 rounded-full bg-success" /><span className="text-text-primary">{t}</span></li>)}
        </ol>
      </SectionCard>

      <SectionCard title="Summary">
        <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
          <div className="rounded-lg bg-muted/60 p-3"><div className="text-xs text-text-secondary">Diagnoses</div><div className="mt-0.5 font-semibold text-text-primary">{state.diagnoses.length}</div></div>
          <div className="rounded-lg bg-muted/60 p-3"><div className="text-xs text-text-secondary">Medicines</div><div className="mt-0.5 font-semibold text-text-primary">{state.prescriptions.length}</div></div>
          <div className="rounded-lg bg-muted/60 p-3"><div className="text-xs text-text-secondary">Investigations</div><div className="mt-0.5 font-semibold text-text-primary">{state.labOrders.length + state.radOrders.length}</div></div>
          <div className="rounded-lg bg-muted/60 p-3"><div className="text-xs text-text-secondary">Disposition</div><div className="mt-0.5 font-semibold text-text-primary">{state.admission || "OPD"}</div></div>
        </div>
      </SectionCard>

      <div className="flex flex-wrap justify-center gap-3">
        <Button variant="outline" onClick={() => toast.success("Sent to print queue")}><Printer className="size-4" />Print</Button>
        <Button variant="outline" onClick={() => toast.success("PDF downloaded")}><Download className="size-4" />Download PDF</Button>
        <Button variant="outline" onClick={() => toast.success("Shared to patient portal")}><Send className="size-4" />Patient Portal</Button>
        <Button onClick={onReturn}>Return to Dashboard</Button>
      </div>
    </div>
  );
}

export { ACTIVE_PATIENT };
