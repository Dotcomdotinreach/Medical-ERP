import { useEffect, useState } from "react";
import {
  LayoutDashboard, Search, UserPlus, Siren, CalendarDays, ClipboardList, BedDouble,
  Stethoscope, Receipt, Users, BarChart3, Settings, IndianRupee, Phone, Clock,
  User, Keyboard,
} from "lucide-react";
import { toast } from "sonner";
import { Shell, type Route, type NavItem, type Workspace } from "../his/Shell";
import { Dashboard } from "./Dashboard";
import { PatientSearch } from "./PatientSearch";
import { PatientProfile } from "./PatientProfile";
import { RegisterPatient } from "./RegisterPatient";
import { Emergency } from "./Emergency";
import { Appointment } from "./Appointment";
import { Queue } from "./Queue";
import { Beds } from "./Beds";
import { PATIENTS, DOCTORS, type Patient } from "../his/data";
import { patientApi, type Patient as ApiPatient } from "../../services/patients";
import { doctorApi, type Doctor as ApiDoctor } from "../../services/doctors";
import { PageHeader, SectionCard, StatCard, StatusBadge, statusTone } from "../his/ui";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Input } from "../ui/input";

const NAV: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  {
    id: "patient-mgmt", label: "Patient Management", icon: Users, children: [
      { id: "search", label: "Patient Search", icon: Search },
      { id: "register", label: "Register Patient", icon: UserPlus },
    ],
  },
  { id: "emergency", label: "Emergency Check-in", icon: Siren, badge: "3" },
  {
    id: "scheduling", label: "Scheduling", icon: CalendarDays, children: [
      { id: "appointment", label: "Appointments", icon: CalendarDays },
      { id: "queue", label: "Queue Management", icon: ClipboardList, badge: "7", tone: "warning" },
    ],
  },
  { id: "beds", label: "Bed Management", icon: BedDouble },
];
const NAV_SECONDARY: NavItem[] = [
  { id: "doctors", label: "Doctors", icon: Stethoscope },
  { id: "billing", label: "Billing", icon: Receipt },
  { id: "visitors", label: "Visitors", icon: Users },
  { id: "reports", label: "Reports", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
];

const CRUMBS: Record<Route, string[]> = {
  dashboard: ["Reception", "Dashboard"],
  search: ["Reception", "Patient Search"],
  profile: ["Reception", "Patient Search", "Patient Profile"],
  register: ["Reception", "Register Patient"],
  uhid: ["Reception", "Register Patient", "Generate UHID"],
  emergency: ["Reception", "Emergency Check-in"],
  appointment: ["Reception", "Appointments", "Book Appointment"],
  queue: ["Reception", "Queue Management"],
  beds: ["Reception", "Bed Management"],
  doctors: ["Reception", "Doctors"],
  billing: ["Reception", "Billing"],
  visitors: ["Reception", "Visitors"],
  reports: ["Reception", "Reports"],
  settings: ["Reception", "Settings"],
};

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

function mapApiPatientForVisitor(p: ApiPatient): Patient {
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

export function ReceptionApp({
  roleName, onSignOut, onSwitchWorkspace, onOpenSettings,
}: { roleName: string; onSignOut: () => void; onSwitchWorkspace: (w: Workspace) => void; onOpenSettings?: (page: string) => void }) {
  const [route, setRoute] = useState<Route>("dashboard");
  const [patient, setPatient] = useState<Patient>(PATIENTS[0]);
  const [showVisitorDialog, setShowVisitorDialog] = useState(false);
  const [visitorName, setVisitorName] = useState("");
  const [visitorPhone, setVisitorPhone] = useState("");
  const [visitorPatient, setVisitorPatient] = useState("");
  const [visitorRelation, setVisitorRelation] = useState("");
  const [toggles, setToggles] = useState([true, true, true, false, true]);
  const toggleSetting = (i: number) => setToggles((prev) => prev.map((v, idx) => idx === i ? !v : v));
  const [livePatients, setLivePatients] = useState(PATIENTS);
  const [liveDoctors, setLiveDoctors] = useState(DOCTORS);

  useEffect(() => {
    patientApi.list()
      .then((r) => {
        const mapped = r.data.map((p: ApiPatient) => mapApiPatientForVisitor(p));
        setLivePatients(mapped);
      })
      .catch(() => {});
    doctorApi.list()
      .then((r) => setLiveDoctors(r.data.map(mapApiDoctor)))
      .catch(() => {});
  }, []);

  const openPatient = (p: Patient) => { setPatient(p); setRoute("profile"); };
  const isActive = (id: string) =>
    route === id || (route === "profile" && id === "search") || (route === "uhid" && id === "register");

  const registerVisitor = () => {
    if (!visitorName || !visitorPhone || !visitorPatient) {
      toast.error("Please fill all required fields");
      return;
    }
    toast.success(`Visitor registered: ${visitorName} → ${visitorPatient}`);
    setShowVisitorDialog(false);
    setVisitorName("");
    setVisitorPhone("");
    setVisitorPatient("");
    setVisitorRelation("");
  };

  return (
    <Shell
      nav={NAV} navSecondary={NAV_SECONDARY} sectionLabel="Reception"
      activeId={route} isActive={isActive} onNavigate={(id) => setRoute(id as Route)}
      breadcrumb={CRUMBS[route]} roleName={roleName} onSignOut={onSignOut}
      workspace="reception" onSwitchWorkspace={onSwitchWorkspace}
      onOpenSettings={onOpenSettings}
      onSearchFocus={() => setRoute("search")}
    >
      {route === "dashboard" && <Dashboard go={setRoute} doctors={liveDoctors} />}
      {route === "search" && <PatientSearch go={setRoute} onOpen={openPatient} />}
      {route === "profile" && <PatientProfile patient={patient} go={setRoute} />}
      {route === "register" && <RegisterPatient go={setRoute} />}
      {route === "emergency" && <Emergency go={setRoute} />}
      {route === "appointment" && <Appointment go={setRoute} />}
      {route === "queue" && <Queue />}
      {route === "beds" && <Beds />}
      {route === "doctors" && (
        <div className="space-y-6">
          <PageHeader title="Doctors" subtitle="Available physicians and on-call schedule" />
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
            {liveDoctors.map((d) => (
              <SectionCard key={d.id}>
                <div className="flex items-start gap-3">
                  <div className="grid size-10 place-items-center rounded-lg bg-secondary text-primary"><Stethoscope className="size-5" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-text-primary text-sm">{d.name}</div>
                    <div className="text-xs text-text-secondary">{d.dept}</div>
                    <div className="text-xs text-text-secondary">{d.qualification}</div>
                    <div className="mt-2"><StatusBadge tone={d.available ? "success" : "neutral"}>{d.available ? "Available" : "Off Duty"}</StatusBadge></div>
                  </div>
                </div>
              </SectionCard>
            ))}
          </div>
        </div>
      )}
      {route === "billing" && (
        <div className="space-y-6">
          <PageHeader title="Billing Overview" subtitle="Recent invoices and outstanding payments"
            actions={<Button variant="outline"><IndianRupee className="size-4" />Generate Invoice</Button>} />
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard icon={IndianRupee} label="Today's Revenue" value="₹1,24,500" />
            <StatCard icon={Receipt} label="Pending Invoices" value="18" tone="warning" />
            <StatCard icon={IndianRupee} label="Outstanding" value="₹3,45,000" tone="danger" />
            <StatCard icon={IndianRupee} label="Collected This Week" value="₹8,67,200" tone="success" />
          </div>
          <SectionCard title="Recent Invoices">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border text-left text-xs uppercase tracking-wide text-text-secondary">
                <th className="pb-2 font-semibold">Invoice</th><th className="pb-2 font-semibold">Patient</th><th className="pb-2 font-semibold">Amount</th><th className="pb-2 font-semibold">Status</th>
              </tr></thead>
              <tbody>{[ { id: "INV-2026-0741", patient: "Rajesh Kumar", amt: "₹12,500", status: "Paid" }, { id: "INV-2026-0742", patient: "Sunita Devi", amt: "₹8,300", status: "Pending" }, { id: "INV-2026-0743", patient: "Amit Patel", amt: "₹45,000", status: "Pending" }, { id: "INV-2026-0744", patient: "Lakshmi Iyer", amt: "₹3,200", status: "Paid" } ].map((r) => (
                <tr key={r.id} className="border-b border-border">
                  <td className="py-2.5 font-mono text-xs text-text-primary">{r.id}</td>
                  <td className="py-2.5 text-text-primary">{r.patient}</td>
                  <td className="py-2.5 text-text-primary">{r.amt}</td>
                  <td className="py-2.5"><StatusBadge tone={r.status === "Paid" ? "success" : "warning"}>{r.status}</StatusBadge></td>
                </tr>
              ))}</tbody>
            </table>
          </SectionCard>
        </div>
      )}
      {route === "visitors" && (
        <div className="space-y-6">
          <PageHeader title="Visitor Log" subtitle="Track patient visitors and entry/exit times"
            actions={<Button onClick={() => setShowVisitorDialog(true)}><UserPlus className="size-4" />Register Visitor</Button>} />
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard icon={Users} label="Currently Visiting" value="12" />
            <StatCard icon={Users} label="Today's Total" value="47" />
            <StatCard icon={Siren} label="ICU Visitors" value="3" tone="danger" />
            <StatCard icon={Clock} label="Avg Visit Duration" value="34 min" />
          </div>
          <SectionCard title="Recent Visitors">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border text-left text-xs uppercase tracking-wide text-text-secondary">
                <th className="pb-2 font-semibold">Visitor</th><th className="pb-2 font-semibold">Patient</th><th className="pb-2 font-semibold">Ward/Bed</th><th className="pb-2 font-semibold">Time In</th><th className="pb-2 font-semibold">Status</th>
              </tr></thead>
              <tbody>{[ { vis: "Anita Kumar", patient: "Rajesh Kumar", ward: "Med-204", time: "10:30 AM", status: "In Visit" }, { vis: "Suresh Patel", patient: "Amit Patel", ward: "ICU-03", time: "11:00 AM", status: "In Visit" }, { vis: "Meena Devi", patient: "Sunita Devi", ward: "Obs-102", time: "09:15 AM", status: "Checked Out" }, { vis: "Ravi Shankar", patient: "Lakshmi Iyer", ward: "Med-108", time: "08:45 AM", status: "Checked Out" } ].map((v, i) => (
                <tr key={i} className="border-b border-border">
                  <td className="py-2.5 text-text-primary">{v.vis}</td>
                  <td className="py-2.5 text-text-primary">{v.patient}</td>
                  <td className="py-2.5 text-text-primary">{v.ward}</td>
                  <td className="py-2.5 text-text-primary">{v.time}</td>
                  <td className="py-2.5"><StatusBadge tone={v.status === "In Visit" ? "success" : "neutral"}>{v.status}</StatusBadge></td>
                </tr>
              ))}</tbody>
            </table>
          </SectionCard>
        </div>
      )}
      {route === "reports" && (
        <div className="space-y-6">
          <PageHeader title="Reception Reports" subtitle="Operational analytics for the front desk"
            actions={<Button variant="outline"><BarChart3 className="size-4" />Export Report</Button>} />
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard icon={UserPlus} label="Today's Registrations" value="24" />
            <StatCard icon={CalendarDays} label="Appointments Booked" value="38" />
            <StatCard icon={ClipboardList} label="Patients in Queue" value="7" tone="warning" />
            <StatCard icon={Siren} label="Emergency Check-ins" value="3" tone="danger" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <SectionCard title="Weekly Registration Trend">
              <div className="flex items-end gap-2 h-32">
                {[18, 22, 24, 20, 31, 28, 24].map((v, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full bg-primary rounded-t" style={{ height: `${(v / 35) * 100}%` }} />
                    <span className="text-[10px] text-text-secondary">{["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][i]}</span>
                  </div>
                ))}
              </div>
            </SectionCard>
            <SectionCard title="Queue Distribution">
              <div className="flex items-end gap-2 h-32">
                {[3, 12, 8, 5, 2].map((v, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full bg-secondary rounded-t" style={{ height: `${(v / 15) * 100}%` }} />
                    <span className="text-[10px] text-text-secondary">{["OPD","Emergency","Lab","Pharmacy","Radiology"][i]}</span>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        </div>
      )}
      {route === "settings" && (
        <div className="space-y-6">
          <PageHeader title="Reception Settings" subtitle="Configure front desk preferences" />
          <SectionCard title="General">
            <div className="space-y-4">
              {[ { label: "Auto-assign queue numbers", desc: "Automatically generate token numbers on patient registration" }, { label: "SMS appointment reminders", desc: "Send SMS reminders 24 hours before scheduled appointments" }, { label: "Emergency bypass protocol", desc: "Allow emergency check-ins to skip the regular queue" }, { label: "Print registration slips", desc: "Auto-print patient registration slip on check-in" }, { label: "Visitor badge printing", desc: "Print visitor badges with QR code on entry" } ].map((s, i) => (
                <div key={s.label} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div><div className="text-sm font-medium text-text-primary">{s.label}</div><div className="text-xs text-text-secondary">{s.desc}</div></div>
                  <div className={`w-10 h-5 rounded-full cursor-pointer transition-colors ${toggles[i] ? "bg-primary" : "bg-gray-300"}`} onClick={() => toggleSetting(i)}>
                    <div className={`w-4 h-4 rounded-full bg-white mt-0.5 transition-transform ${toggles[i] ? "translate-x-5" : "translate-x-0.5"}`} />
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
          <SectionCard title="Desk Configuration">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-xs font-semibold text-text-secondary uppercase tracking-wide">Front Desk Name</label><div className="mt-1 px-3 py-2 border border-border rounded-lg text-sm text-text-primary bg-canvas">Front Desk 2</div></div>
              <div><label className="text-xs font-semibold text-text-secondary uppercase tracking-wide">Department</label><div className="mt-1 px-3 py-2 border border-border rounded-lg text-sm text-text-primary bg-canvas">Reception</div></div>
              <div><label className="text-xs font-semibold text-text-secondary uppercase tracking-wide">Operating Hours</label><div className="mt-1 px-3 py-2 border border-border rounded-lg text-sm text-text-primary bg-canvas">08:00 AM – 08:00 PM</div></div>
              <div><label className="text-xs font-semibold text-text-secondary uppercase tracking-wide">Time Zone</label><div className="mt-1 px-3 py-2 border border-border rounded-lg text-sm text-text-primary bg-canvas">Asia/Kolkata (IST)</div></div>
            </div>
          </SectionCard>
          <SectionCard title="Quick Access">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button onClick={() => onOpenSettings?.("profile")} className="flex items-center gap-3 rounded-lg border border-border p-4 text-left hover:border-primary/50 hover:bg-primary/5 transition-colors">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10"><User className="size-5 text-primary" /></div>
                <div><div className="text-sm font-medium text-text-primary">Profile & Preferences</div><div className="text-xs text-text-secondary">Edit your profile, notifications, theme & security</div></div>
              </button>
              <button onClick={() => onOpenSettings?.("shortcuts")} className="flex items-center gap-3 rounded-lg border border-border p-4 text-left hover:border-primary/50 hover:bg-primary/5 transition-colors">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10"><Keyboard className="size-5 text-primary" /></div>
                <div><div className="text-sm font-medium text-text-primary">Keyboard Shortcuts</div><div className="text-xs text-text-secondary">View all keyboard shortcuts for faster navigation</div></div>
              </button>
            </div>
          </SectionCard>
        </div>
      )}
      <Dialog open={showVisitorDialog} onOpenChange={setShowVisitorDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Register Visitor</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5"><label className="text-sm font-medium">Visitor Name *</label>
              <Input placeholder="Full name" value={visitorName} onChange={(e) => setVisitorName(e.target.value)} /></div>
            <div className="space-y-1.5"><label className="text-sm font-medium">Phone Number *</label>
              <Input placeholder="+91 9XXXXXXXXX" value={visitorPhone} onChange={(e) => setVisitorPhone(e.target.value)} /></div>
            <div className="space-y-1.5"><label className="text-sm font-medium">Visiting Patient *</label>
              <select value={visitorPatient} onChange={(e) => setVisitorPatient(e.target.value)} className="w-full h-10 px-3 border border-border rounded-lg text-sm bg-canvas">
                <option value="">Select patient</option>
                {livePatients.map((p) => <option key={p.uhid} value={p.first + " " + p.last}>{p.first} {p.last} ({p.uhid})</option>)}
              </select></div>
            <div className="space-y-1.5"><label className="text-sm font-medium">Relationship</label>
              <select value={visitorRelation} onChange={(e) => setVisitorRelation(e.target.value)} className="w-full h-10 px-3 border border-border rounded-lg text-sm bg-canvas">
                <option value="">Select relationship</option>
                <option value="Spouse">Spouse</option><option value="Parent">Parent</option><option value="Child">Child</option>
                <option value="Sibling">Sibling</option><option value="Friend">Friend</option><option value="Other">Other</option>
              </select></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVisitorDialog(false)}>Cancel</Button>
            <Button onClick={registerVisitor}><UserPlus className="size-4" />Register</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Shell>
  );
}
