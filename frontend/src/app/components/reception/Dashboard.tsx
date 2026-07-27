import {
  Users, CalendarCheck, Footprints, Siren, ClipboardList, Stethoscope, BedDouble,
  IndianRupee, UserPlus, Search, Printer, ArrowRight,
} from "lucide-react";
import { StatCard, SectionCard, PageHeader, StatusBadge, statusTone, Avatar } from "../his/ui";
import { Button } from "../ui/button";
import { RECENT_REGISTRATIONS, FOOTFALL, DOCTORS } from "../his/data";
import type { Route } from "../his/Shell";

export function Dashboard({ go, patients = RECENT_REGISTRATIONS, doctors = DOCTORS }: { go: (r: Route) => void; patients?: typeof RECENT_REGISTRATIONS; doctors?: typeof DOCTORS }) {
  const quick = [
    { label: "Register Patient", icon: UserPlus, route: "register" as Route, tone: "brand" as const },
    { label: "Emergency Check-in", icon: Siren, route: "emergency" as Route, tone: "danger" as const },
    { label: "Search Patient", icon: Search, route: "search" as Route, tone: "info" as const },
    { label: "Print Token", icon: Printer, route: "queue" as Route, tone: "success" as const },
  ];
  const availableDoctors = doctors.filter((d) => d.available);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reception Dashboard"
        subtitle="Wednesday, 22 July 2026 · Morning shift · Front Desk 2"
        actions={<>
          <Button variant="outline" onClick={() => go("search")}><Search className="size-4" />Search</Button>
          <Button onClick={() => go("register")}><UserPlus className="size-4" />Register Patient</Button>
        </>}
      />

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {quick.map((q) => (
          <button key={q.label} onClick={() => go(q.route)}
            className="group flex items-center gap-3 rounded-xl border border-border bg-surface p-4 text-left transition-all hover:border-primary hover:shadow-sm">
            <div className={`grid size-11 place-items-center rounded-lg ${q.tone === "brand" ? "bg-secondary text-primary" : q.tone === "danger" ? "bg-danger/10 text-danger" : q.tone === "info" ? "bg-info/10 text-[#0369a1]" : "bg-success/10 text-success"}`}>
              <q.icon className="size-5" />
            </div>
            <span className="flex-1 font-medium text-text-primary">{q.label}</span>
            <ArrowRight className="size-4 text-text-secondary transition-transform group-hover:translate-x-0.5" />
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Users} label="Today's Patients" value={248} trend={8} tone="brand" hint="184 OPD · 64 IPD" />
        <StatCard icon={CalendarCheck} label="Appointments" value={132} trend={5} tone="info" hint="21 pending check-in" />
        <StatCard icon={Footprints} label="Walk-in Patients" value={57} trend={-3} tone="warning" />
        <StatCard icon={Siren} label="Emergency Cases" value={9} trend={12} tone="danger" hint="2 critical (RED)" />
        <StatCard icon={ClipboardList} label="Current Queue" value={7} tone="warning" hint="Avg wait 14 min" />
        <StatCard icon={Stethoscope} label="Doctors Available" value={`${availableDoctors.length}/${doctors.length}`} tone="success" />
        <StatCard icon={BedDouble} label="Beds Available" value={38} tone="info" hint="of 210 total" />
        <StatCard icon={IndianRupee} label="Revenue Today" value="₹4.82L" trend={6} tone="success" />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Footfall chart */}
        <SectionCard title="OPD Footfall — Today" className="xl:col-span-2">
          <div className="flex h-[280px] items-end gap-2 border-b border-border px-2 pb-7 pt-5" role="img" aria-label="OPD footfall by hour">
            {FOOTFALL.map((entry) => (
              <div key={`footfall-${entry.hour}`} className="group relative flex h-full min-w-0 flex-1 flex-col justify-end">
                <div className="pointer-events-none absolute -top-7 left-1/2 hidden -translate-x-1/2 rounded bg-text-primary px-2 py-1 text-xs font-medium text-white group-hover:block">
                  {entry.patients} patients
                </div>
                <div
                  className="min-h-1 rounded-t-md bg-brand transition-colors group-hover:bg-primary/80"
                  style={{ height: `${Math.max((entry.patients / 50) * 100, 4)}%` }}
                />
                <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] text-text-secondary sm:text-xs">{entry.hour}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Available doctors */}
        <SectionCard title="Doctors Available Now" action={<Button variant="ghost" size="sm">View all</Button>}>
          <div className="space-y-3">
            {availableDoctors.map((d) => (
              <div key={d.id} className="flex items-center gap-3">
                <Avatar name={d.name.replace("Dr. ", "")} tone="brand" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-text-primary">{d.name}</div>
                  <div className="truncate text-xs text-text-secondary">{d.dept} · Room {d.room}</div>
                </div>
                <StatusBadge tone="success">Available</StatusBadge>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Recent registrations */}
      <SectionCard title="Recent Registrations" action={<Button variant="ghost" size="sm" onClick={() => go("search")}>View all</Button>}>
        <div className="-mx-5 overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-text-secondary">
                <th className="px-5 py-2 font-medium">Patient</th>
                <th className="px-5 py-2 font-medium">UHID</th>
                <th className="px-5 py-2 font-medium">Type</th>
                <th className="px-5 py-2 font-medium">Department</th>
                <th className="px-5 py-2 font-medium">Time</th>
                <th className="px-5 py-2 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((r) => (
                <tr key={r.uhid} className="border-b border-border last:border-0 hover:bg-accent/50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5"><Avatar name={r.name} size={32} /><span className="font-medium text-text-primary">{r.name}</span></div>
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-text-secondary">{r.uhid}</td>
                  <td className="px-5 py-3"><StatusBadge tone={statusTone(r.type)}>{r.type}</StatusBadge></td>
                  <td className="px-5 py-3 text-text-secondary">{r.dept}</td>
                  <td className="px-5 py-3 text-text-secondary">{r.time}</td>
                  <td className="px-5 py-3 text-right font-medium text-text-primary">{r.amount ? `₹${r.amount}` : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
