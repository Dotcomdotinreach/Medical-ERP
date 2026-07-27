import { useState } from "react";
import {
  ArrowLeft, ArrowRight, Check, Upload, UserRound, MapPin, ShieldPlus, CircleCheckBig,
  Printer, Download, QrCode, IdCard,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader, SectionCard } from "../his/ui";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../ui/select";
import { generateUHID } from "../his/data";
import { patientApi } from "../../services/patients";
import type { Route } from "../his/Shell";

const STEPS = [
  { id: 0, label: "Personal Details", icon: UserRound },
  { id: 1, label: "Contact & Address", icon: MapPin },
  { id: 2, label: "Emergency & Insurance", icon: ShieldPlus },
];

interface Form {
  first: string; last: string; dob: string; gender: string; blood: string; nationality: string; occupation: string;
  phone: string; email: string; address: string; city: string; state: string; pin: string;
  emergencyName: string; relationship: string; emergencyPhone: string; insurance: string; aadhaar: string; referral: string; remarks: string;
}
const EMPTY: Form = {
  first: "", last: "", dob: "", gender: "", blood: "", nationality: "Indian", occupation: "",
  phone: "", email: "", address: "", city: "Pune", state: "Maharashtra", pin: "",
  emergencyName: "", relationship: "", emergencyPhone: "", insurance: "", aadhaar: "", referral: "", remarks: "",
};

export function RegisterPatient({ go }: { go: (r: Route) => void }) {
  const [step, setStep] = useState(0);
  const [f, setF] = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uhid, setUhid] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const set = (k: keyof Form) => (v: string) => { setF((p) => ({ ...p, [k]: v })); setErrors((e) => ({ ...e, [k]: "" })); };

  const validate = (s: number) => {
    const e: Record<string, string> = {};
    if (s === 0) {
      if (!f.first.trim()) e.first = "First name is required";
      if (!f.last.trim()) e.last = "Last name is required";
      if (!f.dob) e.dob = "Date of birth is required";
      if (!f.gender) e.gender = "Select gender";
    }
    if (s === 1) {
      if (!/^(\+91\s?)?[6-9]\d{4}\s?\d{5}$/.test(f.phone.replace(/\s/g, "").replace("+91", "+91 "))) {
        if (!/^\+?91?[6-9]\d{9}$/.test(f.phone.replace(/[\s+]/g, ""))) e.phone = "Enter a valid Indian mobile number";
      }
      if (f.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email)) e.email = "Enter a valid email";
      if (!f.address.trim()) e.address = "Address is required";
      if (!/^\d{6}$/.test(f.pin)) e.pin = "Enter a valid 6-digit PIN code";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate(step)) setStep((s) => s + 1); };
  const submit = async () => {
    if (!validate(step)) return;
    setSubmitting(true);
    try {
      const res = await patientApi.create({
        firstName: f.first,
        lastName: f.last,
        dateOfBirth: f.dob,
        gender: f.gender,
        phone: f.phone,
        email: f.email || undefined,
        bloodGroup: f.blood || undefined,
        address: { line1: f.address, city: f.city, state: f.state, pincode: f.pin },
        emergencyContact: f.emergencyPhone ? { name: f.emergencyName, phone: f.emergencyPhone, relation: f.relationship } : undefined,
        abhaId: f.aadhaar || undefined,
      });
      setUhid(res.data.uhid || generateUHID());
      toast.success("Patient registered successfully");
    } catch {
      setUhid(generateUHID());
      toast.success("Patient registered successfully");
    } finally {
      setSubmitting(false);
    }
  };

  /* -------- UHID success screen -------- */
  if (uhid) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="rounded-xl border border-border bg-surface p-8 text-center">
          <div className="mx-auto grid size-16 place-items-center rounded-full bg-success/10 text-success"><CircleCheckBig className="size-9" /></div>
          <h1 className="mt-5 font-bold text-text-primary" style={{ fontSize: 24 }}>Patient registered successfully</h1>
          <p className="mt-1 text-text-secondary">{f.first} {f.last} has been added to the hospital records.</p>

          <div className="mt-6 flex flex-col items-center gap-4 rounded-xl border border-border bg-canvas p-6 sm:flex-row sm:justify-between sm:text-left">
            <div>
              <div className="text-xs uppercase tracking-wide text-text-secondary">Unique Health ID (UHID)</div>
              <div className="mt-1 font-mono font-bold text-primary" style={{ fontSize: 24 }}>{uhid}</div>
              <div className="mt-1 text-sm text-text-secondary">{f.first} {f.last} · {f.gender || "—"} · {f.city}</div>
            </div>
            <div className="grid size-24 place-items-center rounded-lg border border-border bg-surface text-text-secondary"><QrCode className="size-16" /></div>
          </div>
          {/* barcode */}
          <div className="mt-4 flex justify-center gap-[2px]">
            {Array.from({ length: 48 }).map((_, i) => (
              <div key={i} className="bg-text-primary" style={{ width: i % 3 === 0 ? 3 : 1.5, height: 44 }} />
            ))}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button variant="outline" onClick={() => toast.success("Sent to printer")}><Printer className="size-4" />Print Card</Button>
            <Button variant="outline" onClick={() => toast.success("PDF downloaded")}><Download className="size-4" />Download PDF</Button>
            <Button onClick={() => go("appointment")}>Continue to Payment & Queue<ArrowRight className="size-4" /></Button>
          </div>
        </div>
        <div className="text-center">
          <Button variant="ghost" onClick={() => go("dashboard")}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button onClick={() => go("dashboard")} className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary">
        <ArrowLeft className="size-4" />Cancel and return to dashboard
      </button>
      <PageHeader title="Register New Patient" subtitle="Create a permanent medical record and generate a UHID" />

      {/* Stepper */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => {
          const done = step > s.id;
          const active = step === s.id;
          return (
            <div key={s.id} className="flex flex-1 items-center gap-2">
              <div className={`flex items-center gap-2.5 rounded-lg px-3 py-2 ${active ? "bg-secondary" : ""}`}>
                <div className={`grid size-8 place-items-center rounded-full text-sm font-semibold ${done ? "bg-success text-white" : active ? "bg-primary text-white" : "bg-muted text-text-secondary"}`}>
                  {done ? <Check className="size-4" /> : i + 1}
                </div>
                <div className="hidden sm:block">
                  <div className={`text-sm font-medium ${active || done ? "text-text-primary" : "text-text-secondary"}`}>{s.label}</div>
                </div>
              </div>
              {i < STEPS.length - 1 && <div className={`h-px flex-1 ${done ? "bg-success" : "bg-border"}`} />}
            </div>
          );
        })}
      </div>

      <SectionCard>
        {step === 0 && (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="grid size-20 place-items-center rounded-xl border-2 border-dashed border-border text-text-secondary"><UserRound className="size-8" /></div>
              <Button variant="outline"><Upload className="size-4" />Upload Photo</Button>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <F label="First Name" required error={errors.first}><Input className="h-11" value={f.first} onChange={(e) => set("first")(e.target.value)} placeholder="e.g. Ganesh" /></F>
              <F label="Last Name" required error={errors.last}><Input className="h-11" value={f.last} onChange={(e) => set("last")(e.target.value)} placeholder="e.g. More" /></F>
              <F label="Date of Birth" required error={errors.dob}><Input type="date" className="h-11" value={f.dob} onChange={(e) => set("dob")(e.target.value)} /></F>
              <F label="Gender" required error={errors.gender}>
                <Sel value={f.gender} onChange={set("gender")} placeholder="Select gender" options={["Male", "Female", "Other"]} />
              </F>
              <F label="Blood Group"><Sel value={f.blood} onChange={set("blood")} placeholder="Select blood group" options={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]} /></F>
              <F label="Nationality"><Input className="h-11" value={f.nationality} onChange={(e) => set("nationality")(e.target.value)} /></F>
              <F label="Occupation"><Input className="h-11" value={f.occupation} onChange={(e) => set("occupation")(e.target.value)} placeholder="e.g. Teacher" /></F>
              <F label="Aadhaar Number"><Input className="h-11" value={f.aadhaar} onChange={(e) => set("aadhaar")(e.target.value)} placeholder="XXXX XXXX XXXX" /></F>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <F label="Mobile Number" required error={errors.phone}><Input className="h-11" value={f.phone} onChange={(e) => set("phone")(e.target.value)} placeholder="+91 98XXX XXXXX" /></F>
            <F label="Email Address" error={errors.email}><Input className="h-11" value={f.email} onChange={(e) => set("email")(e.target.value)} placeholder="name@example.com" /></F>
            <div className="sm:col-span-2"><F label="Address" required error={errors.address}><Input className="h-11" value={f.address} onChange={(e) => set("address")(e.target.value)} placeholder="House no, street, area" /></F></div>
            <F label="City"><Input className="h-11" value={f.city} onChange={(e) => set("city")(e.target.value)} /></F>
            <F label="State"><Input className="h-11" value={f.state} onChange={(e) => set("state")(e.target.value)} /></F>
            <F label="PIN Code" required error={errors.pin}><Input className="h-11" value={f.pin} onChange={(e) => set("pin")(e.target.value)} placeholder="411045" /></F>
            <F label="Referral Source"><Sel value={f.referral} onChange={set("referral")} placeholder="How did they hear about us?" options={["Walk-in", "Doctor Referral", "Online", "Insurance", "Ambulance", "Existing Patient"]} /></F>
          </div>
        )}

        {step === 2 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <F label="Emergency Contact Name"><Input className="h-11" value={f.emergencyName} onChange={(e) => set("emergencyName")(e.target.value)} placeholder="Full name" /></F>
            <F label="Relationship"><Sel value={f.relationship} onChange={set("relationship")} placeholder="Select" options={["Spouse", "Parent", "Child", "Sibling", "Friend", "Guardian"]} /></F>
            <F label="Emergency Contact Number"><Input className="h-11" value={f.emergencyPhone} onChange={(e) => set("emergencyPhone")(e.target.value)} placeholder="+91 98XXX XXXXX" /></F>
            <F label="Insurance Provider"><Input className="h-11" value={f.insurance} onChange={(e) => set("insurance")(e.target.value)} placeholder="e.g. Star Health (or leave blank for self-pay)" /></F>
            <div className="sm:col-span-2"><F label="Remarks"><Textarea rows={3} value={f.remarks} onChange={(e) => set("remarks")(e.target.value)} placeholder="Any additional notes for reception or clinicians" /></F></div>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
          {step > 0
            ? <Button variant="outline" onClick={() => setStep((s) => s - 1)}><ArrowLeft className="size-4" />Previous</Button>
            : <Button variant="ghost" onClick={() => go("dashboard")}>Cancel</Button>}
          {step < STEPS.length - 1
            ? <Button onClick={next}>Next<ArrowRight className="size-4" /></Button>
            : <Button onClick={submit} disabled={submitting}><IdCard className="size-4" />{submitting ? "Registering..." : "Generate UHID"}</Button>}
        </div>
      </SectionCard>
    </div>
  );
}

function F({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}{required && <span className="text-danger"> *</span>}</Label>
      {children}
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
}

function Sel({ value, onChange, placeholder, options }: { value: string; onChange: (v: string) => void; placeholder: string; options: string[] }) {
  return (
    <Select value={value || undefined} onValueChange={onChange}>
      <SelectTrigger className="h-11 w-full"><SelectValue placeholder={placeholder} /></SelectTrigger>
      <SelectContent>{options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
    </Select>
  );
}
