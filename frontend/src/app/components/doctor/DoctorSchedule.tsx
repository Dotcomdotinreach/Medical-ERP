import { useState } from "react";
import { Search, ArrowRight, Clock, Video, Stethoscope } from "lucide-react";
import { PageHeader, SectionCard, StatusBadge, Avatar } from "../his/ui";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { apptTone } from "./docUi";
import { APPOINTMENTS, type ApptStatus } from "./docData";

const FILTERS: ("All" | ApptStatus)[] = ["All", "Scheduled", "Checked In", "In Consultation", "Completed", "Delayed", "Cancelled"];

export function DoctorSchedule({ appointments = APPOINTMENTS, openConsult }: { appointments?: typeof APPOINTMENTS; openConsult: (id: string) => void }) {
   const [q, setQ] = useState("");
   const [filter, setFilter] = useState<"All" | ApptStatus>("All");
 
   const list = appointments
     .filter((a) => filter === "All" || a.status === filter)
     .filter((a) => !q || a.name.toLowerCase().includes(q.toLowerCase()) || a.uhid.toLowerCase().includes(q.toLowerCase()));
 
   const counts = {
     total: appointments.length,
     completed: appointments.filter((a) => a.status === "Completed").length,
     waiting: appointments.filter((a) => a.status === "Checked In").length,
     cancelled: appointments.filter((a) => a.status === "Cancelled").length,
   };

  return (
    <div className="space-y-6">
      <PageHeader title="Today's Schedule" subtitle="Wednesday, 22 July 2026 · OPD-214 · Morning session"
        actions={
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-secondary" />
            <Input placeholder="Search patient or UHID" className="h-10 w-56 pl-9" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>} />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { l: "Total", v: counts.total, t: "brand" as const },
          { l: "Completed", v: counts.completed, t: "success" as const },
          { l: "Waiting", v: counts.waiting, t: "info" as const },
          { l: "Cancelled", v: counts.cancelled, t: "danger" as const },
        ].map((s) => (
          <div key={s.l} className="rounded-xl border border-border bg-surface p-4">
            <div className="text-sm text-text-secondary">{s.l}</div>
            <div className="mt-1 font-bold text-text-primary" style={{ fontSize: 24 }}>{s.v}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-text-secondary hover:bg-accent"}`}>
            {f}
          </button>
        ))}
      </div>

      <SectionCard title={`Timeline · ${list.length} appointment${list.length === 1 ? "" : "s"}`}>
        <div className="space-y-3">
          {list.map((a) => (
            <div key={a.id} className={`flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center ${a.status === "Cancelled" ? "border-border bg-muted/40 opacity-70" : "border-border"}`}>
              <div className="flex w-16 shrink-0 flex-col items-center">
                <Clock className="size-4 text-text-secondary" />
                <div className="mt-1 font-semibold text-text-primary">{a.time}</div>
              </div>
              <Avatar name={a.name} tone={a.type === "Emergency" ? "danger" : "brand"} size={44} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-text-primary">{a.name}</span>
                  <span className="text-xs text-text-secondary">{a.age}y · {a.gender} · {a.uhid}</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-primary">
                    {a.type === "Tele-consult" ? <Video className="size-3" /> : <Stethoscope className="size-3" />}{a.type}
                  </span>
                </div>
                <div className="mt-1 truncate text-sm text-text-secondary">{a.reason}</div>
              </div>
              <StatusBadge tone={apptTone(a.status)}>{a.status}</StatusBadge>
              <Button size="sm" disabled={a.status === "Cancelled"} onClick={() => openConsult(a.patientId)}>
                {a.status === "Completed" ? "View Record" : "Start Consult"}<ArrowRight className="size-3.5" />
              </Button>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
