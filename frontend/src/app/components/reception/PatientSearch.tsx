import { useEffect, useMemo, useState } from "react";
import { Search, UserPlus, Eye, Phone, SlidersHorizontal, Clock } from "lucide-react";
import { PageHeader, SectionCard, StatusBadge, statusTone, Avatar } from "../his/ui";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { PATIENTS, type Patient } from "../his/data";
import { patientApi, type Patient as ApiPatient } from "../../services/patients";
import type { Route } from "../his/Shell";

function mapApiPatient(p: ApiPatient): Patient {
  const age = p.dateOfBirth
    ? Math.floor((Date.now() - new Date(p.dateOfBirth).getTime()) / 31557600000)
    : 0;
  return {
    uhid: p.uhid,
    first: p.firstName,
    last: p.lastName,
    gender: p.gender as any,
    dob: p.dateOfBirth,
    age,
    blood: p.bloodGroup || "",
    phone: p.phone,
    email: p.email || "",
    address: p.address?.line1 || "",
    city: p.address?.city || "",
    state: p.address?.state || "",
    aadhaar: p.abhaId || "",
    insurance: "None",
    emergencyContact: p.emergencyContact?.phone || "",
    emergencyRelation: p.emergencyContact?.relation || "",
    status: (p.status as any) || "OPD",
    lastVisit: p.createdAt,
    conditions: [],
    allergies: [],
  };
}

const SEARCH_BY = ["UHID", "Phone", "Name", "Aadhaar", "Email"];
const RECENT = ["Rajesh Kumar", "MRD-2026-004824", "+91 90284 33127"];

export function PatientSearch({ go, onOpen }: { go: (r: Route) => void; onOpen: (p: Patient) => void }) {
  const [by, setBy] = useState("Name");
  const [q, setQ] = useState("");
  const [patients, setPatients] = useState<Patient[]>(PATIENTS);

  useEffect(() => {
    patientApi.list()
      .then((r) => setPatients(r.data.map(mapApiPatient)))
      .catch(() => {});
  }, []);

  const results = useMemo(() => {
    if (!q.trim()) return patients;
    const s = q.toLowerCase();
    return patients.filter((p) =>
      `${p.first} ${p.last}`.toLowerCase().includes(s) ||
      p.uhid.toLowerCase().includes(s) ||
      p.phone.toLowerCase().includes(s) ||
      p.email.toLowerCase().includes(s));
  }, [q, patients]);

  return (
    <div className="space-y-6">
      <PageHeader title="Patient Search" subtitle="Find an existing patient before registering a new record"
        actions={<Button onClick={() => go("register")}><UserPlus className="size-4" />Register New Patient</Button>} />

      <SectionCard>
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            {SEARCH_BY.map((s) => (
              <button key={s} onClick={() => setBy(s)}
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${by === s ? "bg-primary text-primary-foreground" : "bg-muted text-text-secondary hover:bg-accent"}`}>
                {s}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-secondary" />
              <Input autoFocus placeholder={`Search by ${by.toLowerCase()}…`} className="h-11 pl-9"
                value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
            <Button variant="outline" className="h-11"><SlidersHorizontal className="size-4" />Filters</Button>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm text-text-secondary">
            <Clock className="size-4" /> Recent:
            {RECENT.map((r) => (
              <button key={r} onClick={() => setQ(r)} className="rounded-md bg-muted px-2 py-0.5 text-xs hover:bg-accent">{r}</button>
            ))}
          </div>
        </div>
      </SectionCard>

      <SectionCard title={`${results.length} patient${results.length === 1 ? "" : "s"} found`}>
        <div className="-mx-5 overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-text-secondary">
                <th className="px-5 py-2 font-medium">Patient</th>
                <th className="px-5 py-2 font-medium">UHID</th>
                <th className="px-5 py-2 font-medium">Age / Gender</th>
                <th className="px-5 py-2 font-medium">Contact</th>
                <th className="px-5 py-2 font-medium">Status</th>
                <th className="px-5 py-2 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {results.map((p) => (
                <tr key={p.uhid} className="border-b border-border last:border-0 hover:bg-accent/50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={`${p.first} ${p.last}`} tone={statusTone(p.status)} />
                      <div>
                        <div className="font-medium text-text-primary">{p.first} {p.last}</div>
                        <div className="text-xs text-text-secondary">{p.blood} · {p.city}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-text-secondary">{p.uhid}</td>
                  <td className="px-5 py-3 text-text-secondary">{p.age}y · {p.gender}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1.5 text-text-secondary"><Phone className="size-3.5" />{p.phone}</div>
                  </td>
                  <td className="px-5 py-3"><StatusBadge tone={statusTone(p.status)}>{p.status}</StatusBadge></td>
                  <td className="px-5 py-3 text-right">
                    <Button size="sm" variant="outline" onClick={() => onOpen(p)}><Eye className="size-4" />View</Button>
                  </td>
                </tr>
              ))}
              {results.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-10 text-center">
                  <p className="text-text-secondary">No patient matches “{q}”.</p>
                  <Button className="mt-3" onClick={() => go("register")}><UserPlus className="size-4" />Register as new patient</Button>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
