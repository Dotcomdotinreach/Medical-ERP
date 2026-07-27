import { useState } from "react";
import { Search, ArrowRight, Clock, BedDouble } from "lucide-react";
import { PageHeader, SectionCard, StatusBadge, statusTone, Avatar } from "../his/ui";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { TriagePill } from "./edUi";
import { TRIAGE_META, type EDCase, type Triage } from "./edData";

const TRIAGE_ORDER: Triage[] = ["Red", "Orange", "Yellow", "Green", "Blue"];
const FILTERS = ["All", "Waiting", "Under Treatment", "Observation", "Completed"];

export function EmergencyQueue({ liveCases, openCase }: { liveCases?: EDCase[]; openCase: (c: EDCase) => void }) {
  const edCases = liveCases ?? ED_CASES;
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("All");

  const filtered = edCases
    .filter((c) => filter === "All" || c.status === filter)
    .filter((c) => !q || c.name.toLowerCase().includes(q.toLowerCase()) || c.id.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => TRIAGE_META[a.triage].sev - TRIAGE_META[b.triage].sev);

  return (
    <div className="space-y-6">
      <PageHeader title="Emergency Queue" subtitle="Prioritised by triage severity · auto-sorted"
        actions={
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-secondary" />
            <Input placeholder="Search patient or ID" className="h-10 w-56 pl-9" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>} />

      {/* Triage summary chips */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {TRIAGE_ORDER.map((t) => {
          const count = edCases.filter((c) => c.triage === t).length;
          const m = TRIAGE_META[t];
          return (
            <div key={t} className="rounded-xl border p-3" style={{ borderColor: `${m.color}40`, background: `${m.color}0d` }}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium" style={{ color: m.color }}>{t}</span>
                <span className="font-bold" style={{ color: m.color, fontSize: 18 }}>{count}</span>
              </div>
              <div className="text-xs text-text-secondary">{m.label} · {m.sla}</div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-text-secondary hover:bg-accent"}`}>
            {f}
          </button>
        ))}
      </div>

      <SectionCard title={`${filtered.length} patient${filtered.length === 1 ? "" : "s"}`}>
        <div className="space-y-3">
          {filtered.map((c) => (
            <div key={c.id} className="flex flex-col gap-3 rounded-xl border border-border p-4 sm:flex-row sm:items-center">
              <div className="w-1.5 self-stretch rounded-full" style={{ background: TRIAGE_META[c.triage].color }} />
              <Avatar name={c.name} tone="danger" size={44} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-text-primary">{c.name}</span>
                  <span className="text-xs text-text-secondary">{c.age}y · {c.gender} · {c.blood}</span>
                  <TriagePill triage={c.triage} />
                  <StatusBadge tone={statusTone(c.status === "Under Treatment" ? "In Consultation" : c.status === "Observation" ? "Called" : c.status)}>{c.status}</StatusBadge>
                </div>
                <div className="mt-1 truncate text-sm text-text-secondary">{c.complaint}</div>
              </div>
              <div className="flex items-center gap-4 text-sm text-text-secondary">
                <span className="inline-flex items-center gap-1"><Clock className="size-4" />{c.arrival}</span>
                <span className="inline-flex items-center gap-1"><BedDouble className="size-4" />{c.bed}</span>
              </div>
              <Button size="sm" onClick={() => openCase(c)}>Open Case<ArrowRight className="size-3.5" /></Button>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
