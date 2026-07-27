import { useState, useMemo } from "react";
import { Users, BadgeAlert, Pill, ClipboardList, ChevronRight, HeartPulse, Activity, Zap, CheckCircle2 } from "lucide-react";
import { Shell, type NavItem } from "../../his/Shell";
import { PageHeader, StatCard, StatusBadge, Avatar } from "../../his/ui";
import { Button } from "../../ui/button";

type NurseRoute = "dashboard" | "patients" | "mar" | "vitals" | "tasks";

const PATIENTS = [
  { name: "Lakshmi Iyer", uhid: "UHID-240718-1842", age: 62, sex: "Female", ward: "ICU", bed: "ICU-01", diagnosis: "Acute coronary syndrome", doctor: "Dr. Arjun Mehta", priority: "Critical", blood: "B+", allergy: "Penicillin" },
  { name: "Rajesh Kumar", uhid: "UHID-240718-1906", age: 54, sex: "Male", ward: "Cardiology", bed: "C-208", diagnosis: "NSTEMI · post angioplasty", doctor: "Dr. Arjun Mehta", priority: "High", blood: "O+", allergy: "No known allergies" },
  { name: "Ananya Nair", uhid: "UHID-240718-1917", age: 29, sex: "Female", ward: "General Ward", bed: "GW-314", diagnosis: "Dengue fever with thrombocytopenia", doctor: "Dr. R. Krishnan", priority: "Routine", blood: "A+", allergy: "Diclofenac" },
  { name: "Mohanlal Sharma", uhid: "UHID-240718-1889", age: 71, sex: "Male", ward: "Ortho Ward", bed: "OW-112", diagnosis: "Post-op total knee replacement", doctor: "Dr. Neha Kapoor", priority: "High", blood: "AB+", allergy: "No known allergies" },
];

function priorityTone(p: string) { return p === "Critical" ? "danger" : p === "High" ? "warning" : "info" as const; }
function Section({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) { return <section className="rounded-xl border border-border bg-surface"><div className="flex items-center justify-between border-b border-border px-5 py-4"><h2 className="text-sm font-semibold text-text-primary">{title}</h2>{action}</div>{children}</section>; }

export function NurseDashboard({ go }: { go: (r: string) => void }) {
  return (
    <div className="space-y-6">
      <PageHeader title="Good morning, Priya" subtitle="Thursday, 18 July · Day shift · Cardiology & ICU"
        actions={<Button onClick={() => go("patients")}><Users className="size-4" />View assignments</Button>} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} label="Assigned patients" value="8" hint="2 new since handover" />
        <StatCard icon={BadgeAlert} label="Critical patients" value="1" hint="ICU-01 requires review" tone="danger" />
        <StatCard icon={Pill} label="Medication due" value="3" hint="Next at 09:00" tone="warning" />
        <StatCard icon={ClipboardList} label="Pending tasks" value="5" hint="2 due within 30 min" tone="info" />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.45fr_0.9fr]">
        <Section title="Priority patient watchlist" action={<Button variant="ghost" size="sm" onClick={() => go("patients")}>All patients <ChevronRight className="size-4" /></Button>}>
          <div className="divide-y divide-border">
            {PATIENTS.slice(0, 3).map((p) => (
              <button key={p.uhid} onClick={() => go("patients")} className="flex w-full items-center gap-3 px-5 py-4 text-left hover:bg-accent">
                <Avatar name={p.name} tone={p.priority === "Critical" ? "danger" : "brand"} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{p.name}</span>
                    <StatusBadge tone={priorityTone(p.priority)}>{p.priority}</StatusBadge>
                  </div>
                  <p className="mt-1 text-xs text-text-secondary">{p.ward} · {p.bed} · {p.diagnosis}</p>
                </div>
                <HeartPulse className="size-5 text-text-secondary" />
              </button>
            ))}
          </div>
        </Section>
        <div className="space-y-6">
          <Section title="Emergency alerts">
            <div className="space-y-3 p-4">
              <div className="rounded-lg border border-danger/20 bg-danger/5 p-3 text-sm">
                <div className="font-semibold text-danger">Code Blue readiness</div>
                <p className="mt-1 text-text-secondary">ICU-01: Confirm crash cart check at shift start.</p>
              </div>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}
