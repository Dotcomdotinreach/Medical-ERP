import { useState } from "react";
import {
  ArrowLeft, TriangleAlert, Stethoscope, User, FlaskConical, Scan, Pill, Timer,
  ClipboardList, Activity, Heart, Save, Send, LogOut, ArrowRightLeft, Building2,
  BedDouble, HeartPulse, Check,
} from "lucide-react";
import { toast } from "sonner";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { PageHeader, SectionCard, StatusBadge, Avatar } from "../his/ui";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger,
} from "../ui/dialog";
import { TriagePill, VitalsWidget, StageTracker } from "./edUi";
import {
  TRIAGE_META, ED_DOCTORS, ED_NURSES, LAB_TESTS, RADIOLOGY_TESTS, VITALS_TREND,
  type EDCase, type Triage,
} from "./edData";
import type { EDRoute } from "./EmergencyApp";

const TRANSFER_OPTIONS = [
  { id: "icu", label: "Transfer to ICU", icon: HeartPulse, desc: "ICU-02 available · critical care", tone: "danger" },
  { id: "ot", label: "Transfer to OT", icon: Building2, desc: "OT-3 available · emergency surgery", tone: "warning" },
  { id: "ward", label: "Admit to Ward", icon: BedDouble, desc: "General Ward A · GA-02", tone: "brand" },
  { id: "discharge", label: "Discharge", icon: LogOut, desc: "Stable · home with prescription", tone: "success" },
  { id: "referral", label: "Refer to another hospital", icon: ArrowRightLeft, desc: "Higher centre / speciality", tone: "info" },
] as const;

export function CaseDetail({ edCase, go }: { edCase: EDCase; go: (r: EDRoute) => void }) {
  const [tab, setTab] = useState("summary");
  const [triage, setTriage] = useState<Triage>(edCase.triage);
  const [doctor, setDoctor] = useState(edCase.doctor);
  const [nurse, setNurse] = useState(edCase.nurse);
  const [labs, setLabs] = useState<string[]>(["CBC", "Troponin-I", "Electrolytes (Na/K/Cl)"]);
  const [rads, setRads] = useState<string[]>(["X-Ray"]);
  const [transferOpen, setTransferOpen] = useState(false);

  const toggle = (arr: string[], set: (v: string[]) => void, v: string) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  return (
    <div className="space-y-6">
      <button onClick={() => go("queue")} className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary">
        <ArrowLeft className="size-4" />Back to queue
      </button>

      <PageHeader title="Emergency Case" subtitle={`${edCase.id} · Arrived ${edCase.arrival} via ${edCase.arrivalMode}`}
        actions={
          <Dialog open={transferOpen} onOpenChange={setTransferOpen}>
            <DialogTrigger asChild><Button><ArrowRightLeft className="size-4" />Disposition / Transfer</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Disposition decision</DialogTitle>
                <DialogDescription>Choose where {edCase.name} goes next. This closes the ED encounter.</DialogDescription>
              </DialogHeader>
              <div className="space-y-2 py-2">
                {TRANSFER_OPTIONS.map((o) => (
                  <button key={o.id}
                    onClick={() => { setTransferOpen(false); toast.success(`${edCase.name} — ${o.label} confirmed`); go("dashboard"); }}
                    className="flex w-full items-center gap-3 rounded-lg border border-border p-3 text-left hover:border-primary hover:bg-accent/50">
                    <div className={`grid size-9 place-items-center rounded-lg ${o.tone === "danger" ? "bg-danger/10 text-danger" : o.tone === "warning" ? "bg-warning/15 text-[#b45309]" : o.tone === "success" ? "bg-success/10 text-success" : o.tone === "info" ? "bg-info/10 text-[#0369a1]" : "bg-secondary text-primary"}`}>
                      <o.icon className="size-5" />
                    </div>
                    <div><div className="text-sm font-medium text-text-primary">{o.label}</div>
                      <div className="text-xs text-text-secondary">{o.desc}</div></div>
                  </button>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        } />

      {/* Patient header */}
      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Avatar name={edCase.name} tone="danger" size={64} />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="font-bold text-text-primary" style={{ fontSize: 20 }}>{edCase.name}</h2>
              <TriagePill triage={triage} showLabel />
              {edCase.allergies.length > 0 && (
                <StatusBadge tone="danger"><TriangleAlert className="size-3.5" />{edCase.allergies.join(", ")}</StatusBadge>
              )}
            </div>
            <div className="mt-1 flex flex-wrap gap-x-5 gap-y-1 text-sm text-text-secondary">
              <span>UHID {edCase.uhid}</span><span>{edCase.age}y · {edCase.gender}</span>
              <span>Blood {edCase.blood}</span><span>Bed {edCase.bed}</span>
            </div>
          </div>
          <div className="rounded-lg bg-danger/5 p-3 text-sm sm:max-w-xs">
            <div className="font-medium text-danger">Working diagnosis</div>
            <div className="text-text-secondary">{edCase.diagnosis}</div>
          </div>
        </div>
        <div className="mt-5 border-t border-border pt-4"><StageTracker current={edCase.stage} /></div>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <div className="overflow-x-auto">
          <TabsList>
            <TabsTrigger value="summary"><ClipboardList className="size-4" />Summary</TabsTrigger>
            <TabsTrigger value="triage"><Activity className="size-4" />Triage</TabsTrigger>
            <TabsTrigger value="care"><Stethoscope className="size-4" />Care Team</TabsTrigger>
            <TabsTrigger value="exam"><ClipboardList className="size-4" />Examination</TabsTrigger>
            <TabsTrigger value="vitals"><Heart className="size-4" />Vitals</TabsTrigger>
            <TabsTrigger value="lab"><FlaskConical className="size-4" />Lab</TabsTrigger>
            <TabsTrigger value="radiology"><Scan className="size-4" />Radiology</TabsTrigger>
            <TabsTrigger value="treatment"><Pill className="size-4" />Treatment</TabsTrigger>
            <TabsTrigger value="observation"><Timer className="size-4" />Observation</TabsTrigger>
          </TabsList>
        </div>

        {/* Summary */}
        <TabsContent value="summary" className="mt-4">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <SectionCard title="Presenting Complaint" className="lg:col-span-2">
              <p className="text-sm text-text-primary">{edCase.complaint}</p>
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4 text-sm">
                <Meta label="Arrival" value={edCase.arrival} /><Meta label="Mode" value={edCase.arrivalMode} />
                <Meta label="Status" value={edCase.status} /><Meta label="Bed" value={edCase.bed} />
              </div>
            </SectionCard>
            <SectionCard title="Current Vitals"><VitalsWidget v={edCase.vitals} compact /></SectionCard>
            <SectionCard title="Known Allergies">
              {edCase.allergies.length ? edCase.allergies.map((a) => (
                <div key={a} className="mb-2 flex items-center gap-2 rounded-lg border border-danger/30 bg-danger/5 p-2.5 text-sm"><TriangleAlert className="size-4 text-danger" />{a}</div>
              )) : <p className="text-sm text-text-secondary">No known allergies</p>}
            </SectionCard>
            <SectionCard title="Medical History" className="lg:col-span-2">
              {edCase.history.length ? (
                <div className="flex flex-wrap gap-2">{edCase.history.map((h) => <StatusBadge key={h} tone="neutral">{h}</StatusBadge>)}</div>
              ) : <p className="text-sm text-text-secondary">No significant past history recorded</p>}
            </SectionCard>
          </div>
        </TabsContent>

        {/* Triage */}
        <TabsContent value="triage" className="mt-4">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <SectionCard title="Assign Priority (ESI / Manchester)" className="lg:col-span-2">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {(Object.keys(TRIAGE_META) as Triage[]).map((t) => {
                  const m = TRIAGE_META[t]; const active = triage === t;
                  return (
                    <button key={t} onClick={() => { setTriage(t); toast.success(`Triage set to ${t} — ${m.label}`); }}
                      className="flex items-center gap-3 rounded-lg border-2 p-3 text-left transition-all"
                      style={active ? { borderColor: m.color, background: `${m.color}0d` } : { borderColor: "#e5e7eb" }}>
                      <span className="grid size-9 place-items-center rounded-full text-sm font-bold text-white" style={{ background: m.color }}>{m.sev}</span>
                      <div className="flex-1"><div className="text-sm font-medium text-text-primary">{t} · {m.label}</div>
                        <div className="text-xs text-text-secondary">Target: {m.sla}</div></div>
                      {active && <Check className="size-4" style={{ color: m.color }} />}
                    </button>
                  );
                })}
              </div>
            </SectionCard>
            <SectionCard title="Triage Vitals"><VitalsWidget v={edCase.vitals} /></SectionCard>
          </div>
        </TabsContent>

        {/* Care team */}
        <TabsContent value="care" className="mt-4">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <SectionCard title="Assign Doctor">
              <div className="space-y-2.5">
                {ED_DOCTORS.map((d) => (
                  <button key={d.id} onClick={() => { setDoctor(d.name); toast.success(`${d.name} assigned`); }} disabled={!d.available}
                    className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-all disabled:opacity-50 ${doctor === d.name ? "border-primary ring-2 ring-primary/15" : "border-border hover:border-primary"}`}>
                    <Avatar name={d.name.replace("Dr. ", "")} />
                    <div className="min-w-0 flex-1"><div className="text-sm font-medium text-text-primary">{d.name}</div>
                      <div className="text-xs text-text-secondary">{d.speciality} · {d.exp}y exp · load {d.load}</div></div>
                    {d.available ? <StatusBadge tone="success">{d.wait}</StatusBadge> : <StatusBadge tone="neutral">Busy</StatusBadge>}
                  </button>
                ))}
              </div>
            </SectionCard>
            <SectionCard title="Assign Nurse">
              <div className="space-y-2.5">
                {ED_NURSES.map((n) => (
                  <button key={n.id} onClick={() => { setNurse(n.name); toast.success(`${n.name} assigned`); }}
                    className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-all ${nurse === n.name ? "border-primary ring-2 ring-primary/15" : "border-border hover:border-primary"}`}>
                    <Avatar name={n.name.replace("Sr. ", "")} tone="info" />
                    <div className="min-w-0 flex-1"><div className="text-sm font-medium text-text-primary">{n.name}</div>
                      <div className="text-xs text-text-secondary">{n.shift} · {n.assigned} patients</div></div>
                    <StatusBadge tone="success">Available</StatusBadge>
                  </button>
                ))}
              </div>
            </SectionCard>
          </div>
        </TabsContent>

        {/* Examination */}
        <TabsContent value="exam" className="mt-4">
          <SectionCard title="Emergency Examination">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <Field label="Symptoms"><Textarea rows={3} defaultValue={edCase.complaint} /></Field>
              <Field label="Clinical Notes"><Textarea rows={3} placeholder="Examination findings, GCS, systemic review…" /></Field>
              <Field label="Provisional Diagnosis"><Textarea rows={2} defaultValue={edCase.diagnosis} /></Field>
              <Field label="Procedures Performed"><Textarea rows={2} placeholder="e.g. IV access secured, oxygen 4L via mask" /></Field>
            </div>
            <div className="mt-4 flex justify-end"><Button onClick={() => toast.success("Examination saved to record")}><Save className="size-4" />Save Examination</Button></div>
          </SectionCard>
        </TabsContent>

        {/* Vitals monitoring */}
        <TabsContent value="vitals" className="mt-4">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <SectionCard title="Live Vitals" className="lg:col-span-1"><VitalsWidget v={edCase.vitals} /></SectionCard>
            <SectionCard title="Monitoring Trend (last 60 min)" className="lg:col-span-2">
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={VITALS_TREND} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis dataKey="t" tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} allowDuplicatedCategory={false} />
                  <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 13 }} />
                  <Line type="monotone" dataKey="hr" name="Heart Rate" stroke="#dc2626" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="spo2" name="SpO₂" stroke="#0ea5e9" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="sbp" name="Systolic BP" stroke="#1565ff" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
              {edCase.vitals.spo2 < 94 && (
                <div className="mt-3 flex items-center gap-2 rounded-lg border border-danger/30 bg-danger/5 p-3 text-sm text-danger">
                  <TriangleAlert className="size-4" />SpO₂ below 94% — supplemental oxygen recommended
                </div>
              )}
            </SectionCard>
          </div>
        </TabsContent>

        {/* Lab */}
        <TabsContent value="lab" className="mt-4">
          <SectionCard title="Emergency Lab Orders" action={<StatusBadge tone="danger">STAT</StatusBadge>}>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {LAB_TESTS.map((g) => (
                <div key={g.group}>
                  <div className="mb-2 text-sm font-medium text-text-primary">{g.group}</div>
                  <div className="space-y-1.5">
                    {g.tests.map((t) => (
                      <label key={t} className="flex items-center gap-2.5 rounded-lg border border-border p-2.5 text-sm">
                        <Checkbox checked={labs.includes(t)} onCheckedChange={() => toggle(labs, setLabs, t)} />{t}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <span className="text-sm text-text-secondary">{labs.length} tests selected</span>
              <Button onClick={() => toast.success(`${labs.length} lab tests ordered (STAT)`)}><Send className="size-4" />Submit STAT Order</Button>
            </div>
          </SectionCard>
        </TabsContent>

        {/* Radiology */}
        <TabsContent value="radiology" className="mt-4">
          <SectionCard title="Emergency Radiology" action={<StatusBadge tone="danger">STAT</StatusBadge>}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {RADIOLOGY_TESTS.map((r) => {
                const active = rads.includes(r.name);
                return (
                  <button key={r.name} onClick={() => toggle(rads, setRads, r.name)}
                    className={`flex items-center gap-3 rounded-lg border-2 p-3 text-left transition-all ${active ? "border-primary bg-secondary" : "border-border hover:border-primary"}`}>
                    <div className={`grid size-10 place-items-center rounded-lg ${active ? "bg-primary text-primary-foreground" : "bg-muted text-text-secondary"}`}><Scan className="size-5" /></div>
                    <div><div className="text-sm font-medium text-text-primary">{r.name}</div><div className="text-xs text-text-secondary">{r.desc}</div></div>
                  </button>
                );
              })}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <span className="text-sm text-text-secondary">{rads.length} scans selected</span>
              <Button onClick={() => toast.success(`${rads.length} imaging orders sent to Radiology (STAT)`)}><Send className="size-4" />Submit STAT Order</Button>
            </div>
          </SectionCard>
        </TabsContent>

        {/* Treatment */}
        <TabsContent value="treatment" className="mt-4">
          <SectionCard title="Treatment Plan">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {["IV Fluids (NS 500ml)", "Oxygen Therapy (4L)", "Injection Analgesic", "Antibiotics", "Blood Transfusion", "Nebulisation", "Ventilator Support", "Cardiac Monitoring", "Emergency Surgery"].map((t) => (
                <label key={t} className="flex items-center gap-2.5 rounded-lg border border-border p-3 text-sm">
                  <Checkbox defaultChecked={["IV Fluids (NS 500ml)", "Oxygen Therapy (4L)", "Cardiac Monitoring"].includes(t)} />{t}
                </label>
              ))}
            </div>
            <div className="mt-4"><Field label="Additional Instructions"><Textarea rows={2} placeholder="Dosage, frequency, monitoring instructions…" /></Field></div>
            <div className="mt-4 flex justify-end"><Button onClick={() => toast.success("Treatment plan saved & nurse notified")}><Save className="size-4" />Save Treatment Plan</Button></div>
          </SectionCard>
        </TabsContent>

        {/* Observation */}
        <TabsContent value="observation" className="mt-4">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <SectionCard title="Observation Timer" className="lg:col-span-1">
              <div className="text-center">
                <div className="mx-auto grid size-24 place-items-center rounded-full border-4 border-primary/20 text-primary">
                  <span className="font-bold" style={{ fontSize: 22 }}>01:45</span>
                </div>
                <div className="mt-3 text-sm text-text-secondary">of 4:00 hr observation window</div>
                <div className="mt-3 flex items-center justify-center gap-2 text-sm">
                  <span className="text-text-secondary">Nurse:</span><span className="font-medium text-text-primary">{nurse}</span>
                </div>
              </div>
            </SectionCard>
            <SectionCard title="Medication & Notes Timeline" className="lg:col-span-2">
              <ol className="relative space-y-5 border-l border-border pl-6">
                {[
                  { t: "11:05", title: "IV fluids started", desc: `${doctor} · NS 500ml @ 100ml/hr`, tone: "brand" },
                  { t: "11:20", title: "Vitals recheck", desc: "HR 118, SpO₂ 92% — improving", tone: "info" },
                  { t: "11:35", title: "Analgesic administered", desc: "Inj. Tramadol 50mg IV", tone: "success" },
                  { t: "11:50", title: "Doctor review", desc: "Stable, continue observation", tone: "brand" },
                ].map((e, i) => (
                  <li key={i}>
                    <span className={`absolute -left-[13px] size-3 rounded-full ring-4 ring-surface ${e.tone === "brand" ? "bg-primary" : e.tone === "info" ? "bg-info" : "bg-success"}`} />
                    <div className="text-xs text-text-secondary">{e.t}</div>
                    <div className="text-sm font-medium text-text-primary">{e.title}</div>
                    <div className="text-sm text-text-secondary">{e.desc}</div>
                  </li>
                ))}
              </ol>
              <div className="mt-4 flex justify-end"><Button onClick={() => setTransferOpen(true)}>Proceed to Disposition<ArrowRightLeft className="size-4" /></Button></div>
            </SectionCard>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><label className="text-sm font-medium text-text-primary">{label}</label>{children}</div>;
}
function Meta({ label, value }: { label: string; value: string }) {
  return <div><div className="text-xs uppercase tracking-wide text-text-secondary">{label}</div><div className="mt-0.5 font-medium text-text-primary">{value}</div></div>;
}
