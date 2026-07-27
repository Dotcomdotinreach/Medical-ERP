import { useEffect, useState } from "react";
import { ArrowLeft, Siren, Ambulance, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, SectionCard } from "../his/ui";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { DOCTORS, BEDS } from "../his/data";
import { doctorApi, type Doctor as ApiDoctor } from "../../services/doctors";
import { bedApi, type Bed as ApiBed } from "../../services/beds";
import type { Route } from "../his/Shell";

const TRIAGE = [
  { id: "Red", label: "Red — Immediate", color: "#dc2626", desc: "Life-threatening" },
  { id: "Orange", label: "Orange — Very urgent", color: "#f59e0b", desc: "≤ 10 min" },
  { id: "Yellow", label: "Yellow — Urgent", color: "#eab308", desc: "≤ 60 min" },
  { id: "Green", label: "Green — Standard", color: "#16a34a", desc: "Non-urgent" },
];
const ARRIVAL = ["Walk-in", "Ambulance", "Police", "Referral"];

function mapApiDoctor(d: ApiDoctor): typeof DOCTORS[number] {
  return {
    id: d._id,
    name: d.name,
    dept: d.department,
    qualification: d.qualification?.join(", ") || "",
    available: d.status === "active",
    room: "",
    fee: d.consultingFee || 0,
  };
}

function mapApiBed(b: ApiBed): typeof BEDS[number] {
  return {
    id: b.bedNumber,
    ward: b.ward,
    type: b.type,
    state: (b.status as any) || "Available",
    patient: b.patient ? `${b.patient.firstName} ${b.patient.lastName}` : undefined,
  };
}

export function Emergency({ go }: { go: (r: Route) => void }) {
  const [unknown, setUnknown] = useState(false);
  const [triage, setTriage] = useState("Red");
  const [arrival, setArrival] = useState("Ambulance");
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [arrivalTime, setArrivalTime] = useState("10:55");
  const [complaint, setComplaint] = useState("");
  const [doctors, setDoctors] = useState(DOCTORS);
  const [beds, setBeds] = useState(BEDS);

  useEffect(() => {
    doctorApi.list()
      .then((r) => setDoctors(r.data.map(mapApiDoctor)))
      .catch(() => {});
    bedApi.list()
      .then((r) => setBeds(r.data.map(mapApiBed)))
      .catch(() => {});
  }, []);

  const emergencyDocs = doctors.filter((d) => d.dept === "Emergency Medicine" || d.available);
  const icuBeds = beds.filter((b) => b.ward === "ICU" && b.state === "Available");

  const save = () => {
    if (!unknown && !name.trim()) { toast.error("Patient name is required"); return; }
    if (!gender) { toast.error("Gender is required"); return; }
    if (!age.trim()) { toast.error("Age is required"); return; }
    toast.success("Emergency patient checked in · bed assigned · doctor notified");
    go("queue");
  };

  return (
    <div className="space-y-6">
      <button onClick={() => go("dashboard")} className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary">
        <ArrowLeft className="size-4" />Back to dashboard
      </button>

      <div className="flex items-center gap-3 rounded-xl border border-danger/30 bg-danger/5 p-4">
        <div className="grid size-11 place-items-center rounded-lg bg-danger/10 text-danger"><Siren className="size-6" /></div>
        <div><h1 className="font-bold text-text-primary" style={{ fontSize: 20 }}>Emergency Check-in</h1>
          <p className="text-sm text-text-secondary">Fast-track registration — full details can be completed later.</p></div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <SectionCard title="Patient Information">
            <label className="mb-4 flex items-center gap-3 rounded-lg border border-border p-3">
              <Switch checked={unknown} onCheckedChange={setUnknown} />
              <div><div className="text-sm font-medium text-text-primary">Unknown / unidentified patient</div>
                <div className="text-xs text-text-secondary">Register without identity and update later</div></div>
            </label>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Patient Name</Label>
                <Input className="h-11" disabled={unknown} value={unknown ? "UNKNOWN — Emergency" : name}
                  onChange={(e) => setName(e.target.value)} placeholder="Full name" />
              </div>
              <div className="space-y-1.5"><Label>Gender</Label>
                <Select value={gender} onValueChange={setGender}><SelectTrigger className="h-11"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{["Male", "Female", "Other", "Unknown"].map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-1.5"><Label>Approx. Age</Label><Input className="h-11" placeholder="e.g. 45" value={age} onChange={(e) => setAge(e.target.value)} /></div>
              <div className="space-y-1.5"><Label>Arrival Time</Label><Input type="time" className="h-11" value={arrivalTime} onChange={(e) => setArrivalTime(e.target.value)} /></div>
              <div className="space-y-1.5"><Label>Arrival Method</Label>
                <Select value={arrival} onValueChange={setArrival}><SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                  <SelectContent>{ARRIVAL.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent></Select></div>
            </div>
            <div className="mt-4 space-y-1.5">
              <Label>Chief Complaint</Label>
              <Input className="h-11" value={complaint} onChange={(e) => setComplaint(e.target.value)} placeholder="e.g. Chest pain, breathlessness for 30 min" />
            </div>
          </SectionCard>

          <SectionCard title="Triage Level">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {TRIAGE.map((t) => {
                const active = triage === t.id;
                return (
                  <button key={t.id} onClick={() => setTriage(t.id)}
                    className={`flex items-center gap-3 rounded-lg border-2 p-3 text-left transition-all ${active ? "shadow-sm" : "border-border hover:border-text-secondary"}`}
                    style={active ? { borderColor: t.color, background: `${t.color}0d` } : {}}>
                    <span className="size-4 rounded-full" style={{ background: t.color }} />
                    <div><div className="text-sm font-medium text-text-primary">{t.label}</div>
                      <div className="text-xs text-text-secondary">{t.desc}</div></div>
                  </button>
                );
              })}
            </div>
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard title="Assign Care Team">
            <div className="space-y-4">
              <div className="space-y-1.5"><Label>Assign Doctor</Label>
                <Select defaultValue={emergencyDocs[0]?.id}><SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                  <SelectContent>{emergencyDocs.map((d) => <SelectItem key={d.id} value={d.id}>{d.name} · {d.dept}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-1.5"><Label>Assign Nurse</Label>
                <Select><SelectTrigger className="h-11"><SelectValue placeholder="Select nurse" /></SelectTrigger>
                  <SelectContent>{["Sr. Anjali Deshpande", "Sr. Rekha Menon", "Sr. Fatima Khan"].map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-1.5"><Label>Assign Bed</Label>
                <Select defaultValue={icuBeds[0]?.id}><SelectTrigger className="h-11"><SelectValue placeholder="Select bed" /></SelectTrigger>
                  <SelectContent>{icuBeds.map((b) => <SelectItem key={b.id} value={b.id}>{b.id} · {b.ward}</SelectItem>)}</SelectContent></Select></div>
            </div>
          </SectionCard>

          <div className="rounded-xl border border-warning/30 bg-warning/5 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-[#b45309]"><TriangleAlert className="size-4" />Priority alert</div>
            <p className="mt-1 text-sm text-text-secondary">Saving will immediately notify the on-call team and reserve the selected bed.</p>
          </div>

          <div className="flex flex-col gap-2">
            <Button variant="destructive" className="h-11 w-full" onClick={save}><Ambulance className="size-4" />Check in & Notify Team</Button>
            <Button variant="outline" className="h-11 w-full" onClick={() => go("dashboard")}>Cancel</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
