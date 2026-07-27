import { useEffect, useState } from "react";
import { PhoneCall, ArrowRightLeft, X, Search, Printer, Bell } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, SectionCard, StatusBadge, statusTone, Avatar } from "../his/ui";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { QUEUE, type QueueEntry, type QueueState } from "../his/data";
import { queueApi, type QueueEntry as ApiQueueEntry } from "../../services/queue";

const COLUMNS: QueueState[] = ["Waiting", "Called", "In Consultation", "Completed", "Skipped"];

function mapApiQueueStatus(s: string): QueueState {
  const map: Record<string, QueueState> = {
    waiting: "Waiting",
    called: "Called",
    serving: "In Consultation",
    completed: "Completed",
    skipped: "Skipped",
    "no-show": "Skipped",
    cancelled: "Skipped",
  };
  return map[s] || "Waiting";
}

function mapApiQueueEntry(e: ApiQueueEntry): QueueEntry {
  return {
    token: `T-${e.tokenNumber}`,
    patient: `${e.patient.firstName} ${e.patient.lastName}`,
    uhid: e.patient.uhid,
    doctor: e.doctor?.name || "",
    dept: e.department,
    state: mapApiQueueStatus(e.status),
    priority: (e.priority as any) || "Normal",
    waitMins: e.calledAt
      ? Math.floor((Date.now() - new Date(e.calledAt).getTime()) / 60000)
      : e.createdAt
        ? Math.floor((Date.now() - new Date(e.createdAt).getTime()) / 60000)
        : 0,
  };
}

export function Queue() {
  const [queue, setQueue] = useState<QueueEntry[]>(QUEUE);
  const [q, setQ] = useState("");

  useEffect(() => {
    queueApi.list()
      .then((r) => setQueue(r.data.map(mapApiQueueEntry)))
      .catch(() => {});
  }, []);

  const move = (token: string, to: QueueState) => {
    setQueue((qs) => qs.map((e) => (e.token === token ? { ...e, state: to } : e)));
    toast.success(`Token ${token} → ${to}`);
  };

  const filtered = queue.filter((e) =>
    !q || e.patient.toLowerCase().includes(q.toLowerCase()) || e.token.toLowerCase().includes(q.toLowerCase()));

  const counts = (s: QueueState) => filtered.filter((e) => e.state === s).length;

  return (
    <div className="space-y-6">
      <PageHeader title="Queue Management" subtitle="Live OPD & consultation queue · auto-refreshing"
        actions={<>
          <div className="relative hidden sm:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-secondary" />
            <Input placeholder="Search token or patient" className="h-10 w-56 pl-9" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <Button variant="outline" onClick={() => toast.success("Token slip sent to printer")}><Printer className="size-4" />Print Token</Button>
        </>} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        {COLUMNS.map((col) => (
          <SectionCard key={col} title={col} action={<StatusBadge tone={statusTone(col)}>{counts(col)}</StatusBadge>}>
            <div className="space-y-3">
              {filtered.filter((e) => e.state === col).map((e) => (
                <div key={e.token} className="rounded-lg border border-border p-3">
                  <div className="flex items-center justify-between">
                    <span className="rounded-md bg-primary px-2 py-0.5 font-mono text-xs font-semibold text-primary-foreground">{e.token}</span>
                    {e.priority !== "Normal" && (
                      <StatusBadge tone={e.priority === "Emergency" ? "danger" : "warning"}>{e.priority}</StatusBadge>
                    )}
                  </div>
                  <div className="mt-2 flex items-center gap-2.5">
                    <Avatar name={e.patient} size={32} tone={statusTone(col)} />
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-text-primary">{e.patient}</div>
                      <div className="truncate text-xs text-text-secondary">{e.doctor}</div>
                    </div>
                  </div>
                  {col === "Waiting" && <div className="mt-2 text-xs text-text-secondary">Waiting {e.waitMins} min · {e.dept}</div>}

                  <div className="mt-3 flex gap-1.5">
                    {col === "Waiting" && <Button size="sm" className="h-8 flex-1" onClick={() => move(e.token, "Called")}><Bell className="size-3.5" />Call</Button>}
                    {col === "Called" && <Button size="sm" className="h-8 flex-1" onClick={() => move(e.token, "In Consultation")}><PhoneCall className="size-3.5" />Start</Button>}
                    {col === "In Consultation" && <Button size="sm" variant="outline" className="h-8 flex-1" onClick={() => move(e.token, "Completed")}>Complete</Button>}
                    {(col === "Waiting" || col === "Called") && (
                      <>
                        <Button size="sm" variant="outline" className="h-8 px-2" title="Move to next"
                          onClick={() => move(e.token, "Skipped")}><ArrowRightLeft className="size-3.5" /></Button>
                        <Button size="sm" variant="outline" className="h-8 px-2 text-danger" title="Cancel"
                          onClick={() => setQueue((qs) => qs.filter((x) => x.token !== e.token))}><X className="size-3.5" /></Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
              {counts(col) === 0 && <p className="py-6 text-center text-sm text-text-secondary">No patients</p>}
            </div>
          </SectionCard>
        ))}
      </div>
    </div>
  );
}
