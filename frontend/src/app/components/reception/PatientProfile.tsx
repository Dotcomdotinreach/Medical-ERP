import { useState } from "react";
import {
  ArrowLeft, CalendarPlus, Siren, Printer, Pencil, Phone, Mail, MapPin, Droplet,
  ShieldCheck, HeartPulse, TriangleAlert, FileText, Activity, Stethoscope,
} from "lucide-react";
import { PageHeader, SectionCard, StatusBadge, statusTone, Avatar } from "../his/ui";
import { Button } from "../ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { toast } from "sonner";
import type { Patient } from "../his/data";
import type { Route } from "../his/Shell";

export function PatientProfile({ patient, go }: { patient: Patient; go: (r: Route) => void }) {
  const [tab, setTab] = useState("overview");
  const full = `${patient.first} ${patient.last}`;

  const timeline = [
    { date: "20 Jul 2026", title: "Admitted to General Ward A (GA-01)", desc: "Under Dr. Arjun Mehta · Cardiology", tone: "brand" as const },
    { date: "20 Jul 2026", title: "ECG & Troponin ordered", desc: "Lab report received — mild elevation", tone: "warning" as const },
    { date: "12 Mar 2026", title: "OPD consultation", desc: "Routine diabetes follow-up · HbA1c 7.2%", tone: "info" as const },
    { date: "08 Nov 2025", title: "Prescription issued", desc: "Metformin 500mg, Telmisartan 40mg", tone: "success" as const },
  ];

  return (
    <div className="space-y-6">
      <button onClick={() => go("search")} className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary">
        <ArrowLeft className="size-4" />Back to search
      </button>

      <PageHeader title="Patient Profile" subtitle={`UHID ${patient.uhid}`}
        actions={<>
          <Button variant="outline" onClick={() => toast.success("Registration card sent to printer")}><Printer className="size-4" />Print</Button>
          <Button variant="outline" onClick={() => toast.info("Edit patient — opening editable form")}><Pencil className="size-4" />Edit</Button>
          <Button variant="destructive" onClick={() => go("emergency")}><Siren className="size-4" />Emergency</Button>
          <Button onClick={() => go("appointment")}><CalendarPlus className="size-4" />Book Appointment</Button>
        </>} />

      {/* Header card */}
      <div className="rounded-xl border border-border bg-surface p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <Avatar name={full} tone={statusTone(patient.status)} size={72} />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-bold text-text-primary" style={{ fontSize: 20 }}>{full}</h2>
              <StatusBadge tone={statusTone(patient.status)}>{patient.status}</StatusBadge>
              {patient.allergies.length > 0 && (
                <StatusBadge tone="danger"><TriangleAlert className="size-3.5" />Allergy: {patient.allergies.join(", ")}</StatusBadge>
              )}
            </div>
            <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-text-secondary">
              <span>{patient.age} years · {patient.gender}</span>
              <span className="inline-flex items-center gap-1.5"><Droplet className="size-3.5 text-danger" />{patient.blood}</span>
              <span className="inline-flex items-center gap-1.5"><Phone className="size-3.5" />{patient.phone}</span>
              <span className="inline-flex items-center gap-1.5"><Mail className="size-3.5" />{patient.email}</span>
            </div>
          </div>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="history">Medical History</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <SectionCard title="Demographics" className="lg:col-span-2">
              <dl className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
                <Field label="Full name" value={full} />
                <Field label="Date of birth" value={new Date(patient.dob).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })} />
                <Field label="Gender" value={patient.gender} />
                <Field label="Blood group" value={patient.blood} />
                <Field label="Aadhaar" value={patient.aadhaar} />
                <Field label="Address" value={`${patient.address}, ${patient.city}, ${patient.state}`} icon={MapPin} />
              </dl>
            </SectionCard>
            <div className="space-y-6">
              <SectionCard title="Insurance">
                <div className="flex items-start gap-3">
                  <div className="grid size-9 place-items-center rounded-lg bg-secondary text-primary"><ShieldCheck className="size-5" /></div>
                  <div><div className="text-sm font-medium text-text-primary">{patient.insurance}</div>
                    <div className="text-xs text-text-secondary">{patient.insurance === "None" ? "Self-pay" : "Cashless eligible"}</div></div>
                </div>
              </SectionCard>
              <SectionCard title="Emergency Contact">
                <div className="text-sm font-medium text-text-primary">{patient.emergencyRelation}</div>
                <div className="text-sm text-text-secondary">{patient.emergencyContact}</div>
              </SectionCard>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <SectionCard title="Active Conditions">
              <div className="space-y-2">
                {patient.conditions.map((c) => (
                  <div key={c} className="flex items-center gap-2.5 rounded-lg border border-border p-3">
                    <HeartPulse className="size-4 text-danger" /><span className="text-sm text-text-primary">{c}</span>
                  </div>
                ))}
              </div>
            </SectionCard>
            <SectionCard title="Allergies">
              {patient.allergies.length ? (
                <div className="space-y-2">
                  {patient.allergies.map((a) => (
                    <div key={a} className="flex items-center gap-2.5 rounded-lg border border-danger/30 bg-danger/5 p-3">
                      <TriangleAlert className="size-4 text-danger" /><span className="text-sm text-text-primary">{a}</span>
                    </div>
                  ))}
                </div>
              ) : <p className="text-sm text-text-secondary">No known allergies.</p>}
            </SectionCard>
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="mt-4">
          <SectionCard title="Activity Timeline">
            <ol className="relative space-y-6 border-l border-border pl-6">
              {timeline.map((t, i) => (
                <li key={i} className="relative">
                  <span className={`absolute -left-[29px] grid size-6 place-items-center rounded-full ring-4 ring-surface ${t.tone === "brand" ? "bg-secondary text-primary" : t.tone === "warning" ? "bg-warning/15 text-[#b45309]" : t.tone === "info" ? "bg-info/10 text-[#0369a1]" : "bg-success/10 text-success"}`}>
                    {t.tone === "brand" ? <Stethoscope className="size-3.5" /> : t.tone === "warning" ? <Activity className="size-3.5" /> : <FileText className="size-3.5" />}
                  </span>
                  <div className="text-xs text-text-secondary">{t.date}</div>
                  <div className="text-sm font-medium text-text-primary">{t.title}</div>
                  <div className="text-sm text-text-secondary">{t.desc}</div>
                </li>
              ))}
            </ol>
          </SectionCard>
        </TabsContent>

        <TabsContent value="documents" className="mt-4">
          <SectionCard title="Documents">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {["Discharge Summary — Mar 2026", "ECG Report — 20 Jul", "Insurance Card", "Aadhaar Copy"].map((d) => (
                <div key={d} className="flex items-center gap-3 rounded-lg border border-border p-3">
                  <div className="grid size-9 place-items-center rounded-lg bg-muted text-text-secondary"><FileText className="size-4" /></div>
                  <span className="text-sm text-text-primary">{d}</span>
                </div>
              ))}
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Field({ label, value, icon: Icon }: { label: string; value: string; icon?: typeof MapPin }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-text-secondary">{label}</dt>
      <dd className="mt-0.5 flex items-center gap-1.5 text-sm font-medium text-text-primary">
        {Icon && <Icon className="size-3.5 text-text-secondary" />}{value}
      </dd>
    </div>
  );
}
