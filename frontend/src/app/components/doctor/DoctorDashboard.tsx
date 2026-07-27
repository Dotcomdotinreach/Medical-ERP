import {
  CalendarDays, Siren, TriangleAlert, BedDouble, FileClock, FlaskConical, Scan,
  MessageSquare, Search, ArrowRight, Stethoscope, Activity, ClipboardList,
} from "lucide-react";
import { StatCard, SectionCard, PageHeader, StatusBadge, Avatar } from "../his/ui";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { TriagePreview, apptTone } from "./docUi";
import { APPOINTMENTS, EMERGENCY_REFERRALS, DOCTOR, DOCTOR_STATS } from "./docData";

export function DoctorDashboard({ appointments = APPOINTMENTS, go, openConsult }: { appointments?: typeof APPOINTMENTS; go: (r: string) => void; openConsult: (id: string) => void }) {
   const upcoming = appointments.filter((a) => a.status !== "Completed" && a.status !== "Cancelled").slice(0, 5);
  const alerts = EMERGENCY_REFERRALS.filter((e) => e.triage === "Red" || e.triage === "Orange");

  const quick = [
    { label: "Today's Schedule", icon: CalendarDays, route: "schedule", tone: "brand" as const },
    { label: "Emergency Queue", icon: Siren, route: "emergency", tone: "danger" as const },
    { label: "Search Patient", icon: Search, route: "schedule", tone: "info" as const },
    { label: "Admitted Patients", icon: BedDouble, route: "schedule", tone: "success" as const },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Good morning, ${DOCTOR.name.replace("Dr. ", "Dr. ")}`}
        subtitle={`${DOCTOR.speciality} · ${DOCTOR.qualification} · Room ${DOCTOR.room} · Wed, 22 Jul 2026`}
        actions={<>
          <Button variant="outline" onClick={() => go("emergency")}><Siren className="size-4" />Emergency Queue</Button>
          <Button onClick={() => go("schedule")}><CalendarDays className="size-4" />My Schedule</Button>
        </>}
      />

      {/* Critical alerts banner */}
      {alerts.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-danger/30 bg-danger/5 p-4">
          <div className="grid size-10 place-items-center rounded-lg bg-danger/10 text-danger"><TriangleAlert className="size-5" /></div>
          <div className="flex-1">
            <div className="font-semibold text-danger">{alerts.length} critical emergency referrals need review</div>
            <div className="text-sm text-text-secondary">{alerts.map((a) => `${a.name} (${a.triage})`).join(" · ")}</div>
          </div>
          <Button variant="destructive" onClick={() => go("emergency")}>Review now<ArrowRight className="size-4" /></Button>
        </div>
      )}

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
        <StatCard icon={CalendarDays} label="Today's Appointments" value={DOCTOR_STATS.appointments} tone="brand" hint={`${DOCTOR_STATS.completed} completed`} />
        <StatCard icon={Siren} label="Emergency Patients" value={DOCTOR_STATS.emergency} tone="danger" hint="2 critical" />
        <StatCard icon={BedDouble} label="Admitted Patients" value={DOCTOR_STATS.admitted} tone="info" />
        <StatCard icon={FileClock} label="Pending Reports" value={DOCTOR_STATS.pendingReports} tone="warning" />
        <StatCard icon={FlaskConical} label="Pending Lab Results" value={DOCTOR_STATS.pendingLabs} tone="warning" />
        <StatCard icon={Scan} label="Pending Radiology" value={DOCTOR_STATS.pendingRadiology} tone="info" />
        <StatCard icon={MessageSquare} label="Patient Messages" value={DOCTOR_STATS.messages} tone="brand" />
        <StatCard icon={Activity} label="Avg Consult Time" value="12 min" tone="success" />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Today's appointments */}
        <SectionCard title="Today's Appointments" className="xl:col-span-2"
          action={<Button variant="ghost" size="sm" onClick={() => go("schedule")}>View schedule</Button>}>
          <div className="space-y-3">
            {upcoming.map((a) => (
              <div key={a.id} className="flex items-center gap-3 rounded-xl border border-border p-3">
                <div className="w-14 shrink-0 text-center">
                  <div className="font-semibold text-text-primary">{a.time}</div>
                  <div className="text-xs text-text-secondary">{a.type}</div>
                </div>
                <Avatar name={a.name} />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium text-text-primary">{a.name} · {a.age}/{a.gender[0]}</div>
                  <div className="truncate text-sm text-text-secondary">{a.reason}</div>
                </div>
                <StatusBadge tone={apptTone(a.status)}>{a.status}</StatusBadge>
                <Button size="sm" onClick={() => openConsult(a.patientId)}>Open<ArrowRight className="size-3.5" /></Button>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Emergency referrals + search */}
        <div className="space-y-6">
          <SectionCard title="Search Patient">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-secondary" />
              <Input placeholder="Name, UHID or mobile" className="h-10 pl-9" onFocus={() => go("schedule")} readOnly />
            </div>
            <p className="mt-2 text-xs text-text-secondary">Search across all registered patients and admitted records.</p>
          </SectionCard>

          <SectionCard title="Emergency Referrals"
            action={<Button variant="ghost" size="sm" onClick={() => go("emergency")}>All</Button>}>
            <div className="space-y-3">
              {EMERGENCY_REFERRALS.slice(0, 3).map((e) => (
                <button key={e.id} onClick={() => go("emergency")}
                  className="flex w-full items-center gap-3 rounded-xl border border-border p-3 text-left hover:border-primary">
                  <TriagePreview triage={e.triage} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-text-primary">{e.name}</div>
                    <div className="truncate text-xs text-text-secondary">{e.complaint}</div>
                  </div>
                  <ClipboardList className="size-4 text-text-secondary" />
                </button>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>

      <SectionCard title="Care Overview">
        <div className="flex flex-wrap items-center gap-6 text-sm">
          <span className="inline-flex items-center gap-2 text-text-secondary"><Stethoscope className="size-4 text-primary" />{DOCTOR.speciality}</span>
          <span className="inline-flex items-center gap-2 text-text-secondary"><CalendarDays className="size-4 text-info" />Next slot 10:00 · {upcoming[0]?.name}</span>
          <span className="inline-flex items-center gap-2 text-text-secondary"><BedDouble className="size-4 text-success" />6 inpatients under care</span>
        </div>
      </SectionCard>
    </div>
  );
}
