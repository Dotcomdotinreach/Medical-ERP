import { useEffect, useState } from "react";
import { ArrowLeft, CalendarCheck, Video, Repeat, Footprints, Ticket } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, SectionCard, StatusBadge } from "../his/ui";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { DEPARTMENTS, DOCTORS } from "../his/data";
import { doctorApi, type Doctor as ApiDoctor } from "../../services/doctors";
import type { Route } from "../his/Shell";

const SLOTS = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "15:00", "15:30", "16:00", "16:30"];
const BOOKED = new Set(["10:00", "11:30", "15:30"]);
const TYPES = [
  { id: "walkin", label: "Walk-in", icon: Footprints },
  { id: "video", label: "Video", icon: Video },
  { id: "followup", label: "Follow-up", icon: Repeat },
];

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

export function Appointment({ go }: { go: (r: Route) => void }) {
  const [dept, setDept] = useState<string>("");
  const [doctor, setDoctor] = useState<string>("");
  const [slot, setSlot] = useState<string>("");
  const [type, setType] = useState("walkin");
  const [doctors, setDoctors] = useState(DOCTORS);

  useEffect(() => {
    doctorApi.list()
      .then((r) => setDoctors(r.data.map(mapApiDoctor)))
      .catch(() => {});
  }, []);

  const docs = dept ? doctors.filter((d) => d.dept === dept) : doctors;

  const book = () => {
    toast.success(`Appointment booked · Token A-021 · ${slot}`);
    go("queue");
  };

  return (
    <div className="space-y-6">
      <button onClick={() => go("dashboard")} className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary">
        <ArrowLeft className="size-4" />Back to dashboard
      </button>
      <PageHeader title="Book Appointment" subtitle="Schedule an OPD consultation and issue a queue token" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <SectionCard title="Department & Doctor">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5"><label className="text-sm font-medium">Department</label>
                <Select value={dept} onValueChange={(v) => { setDept(v); setDoctor(""); }}>
                  <SelectTrigger className="h-11"><SelectValue placeholder="Select department" /></SelectTrigger>
                  <SelectContent>{DEPARTMENTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-1.5"><label className="text-sm font-medium">Doctor</label>
                <Select value={doctor} onValueChange={setDoctor}>
                  <SelectTrigger className="h-11"><SelectValue placeholder="Select doctor" /></SelectTrigger>
                  <SelectContent>{docs.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}{d.available ? "" : " (busy)"} · ₹{d.fee}</SelectItem>)}</SelectContent></Select></div>
            </div>
          </SectionCard>

          <SectionCard title="Available Slots · Today, 22 Jul">
            <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 lg:grid-cols-6">
              {SLOTS.map((s) => {
                const booked = BOOKED.has(s);
                const active = slot === s;
                return (
                  <button key={s} disabled={booked} onClick={() => setSlot(s)}
                    className={`rounded-lg border py-2.5 text-sm font-medium transition-all ${booked ? "cursor-not-allowed border-border bg-muted text-text-secondary line-through" : active ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"}`}>
                    {s}
                  </button>
                );
              })}
            </div>
          </SectionCard>

          <SectionCard title="Consultation Type">
            <div className="grid grid-cols-3 gap-3">
              {TYPES.map((t) => {
                const active = type === t.id;
                return (
                  <button key={t.id} onClick={() => setType(t.id)}
                    className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all ${active ? "border-primary bg-secondary" : "border-border hover:border-text-secondary"}`}>
                    <t.icon className={`size-5 ${active ? "text-primary" : "text-text-secondary"}`} />
                    <span className="text-sm font-medium text-text-primary">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </SectionCard>
        </div>

        <SectionCard title="Summary">
          <div className="space-y-3 text-sm">
            <Row label="Department" value={dept || "—"} />
            <Row label="Doctor" value={doctors.find((d) => d.id === doctor)?.name || "—"} />
            <Row label="Date" value="22 Jul 2026" />
            <Row label="Time" value={slot || "—"} />
            <Row label="Type" value={TYPES.find((t) => t.id === type)?.label || "—"} />
            <div className="flex items-center justify-between border-t border-border pt-3">
              <span className="text-text-secondary">Consultation fee</span>
              <span className="font-semibold text-text-primary">₹{doctors.find((d) => d.id === doctor)?.fee ?? 0}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-secondary p-3">
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary"><Ticket className="size-4" />Next token</span>
              <StatusBadge tone="brand">A-021</StatusBadge>
            </div>
            <Button className="h-11 w-full" disabled={!doctor || !slot} onClick={book}>
              <CalendarCheck className="size-4" />Book & Add to Queue
            </Button>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-text-secondary">{label}</span>
      <span className="font-medium text-text-primary">{value}</span>
    </div>
  );
}
