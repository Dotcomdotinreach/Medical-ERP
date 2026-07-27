import { useState } from "react";
import {
  Ambulance, MapPin, Clock, Navigation, User, Wrench, Check, X, Shuffle, Radio,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader, SectionCard, StatusBadge } from "../his/ui";
import { Button } from "../ui/button";
import { TriagePill } from "./edUi";
import { AMBULANCES, type Ambulance as Amb } from "./edData";

export function IncomingAmbulances() {
  const [selected, setSelected] = useState<Amb>(AMBULANCES[0]);
  const [accepted, setAccepted] = useState<string[]>([]);

  const accept = (a: Amb) => { setAccepted((s) => [...s, a.id]); toast.success(`${a.vehicle} accepted · RESUS bay reserved · team alerted`); };

  return (
    <div className="space-y-6">
      <PageHeader title="Incoming Ambulances" subtitle="Live GPS tracking of inbound emergency transport" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Map + list */}
        <div className="space-y-4 lg:col-span-2">
          {/* Simulated live map */}
          <div className="relative h-64 overflow-hidden rounded-xl border border-border bg-[#eef2f7]">
            <div className="absolute inset-0 opacity-60"
              style={{ backgroundImage: "linear-gradient(#dbe3ec 1px, transparent 1px), linear-gradient(90deg, #dbe3ec 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
            {/* roads */}
            <div className="absolute left-0 right-0 top-1/2 h-3 -translate-y-1/2 bg-white" />
            <div className="absolute bottom-0 left-1/2 top-0 w-3 -translate-x-1/2 bg-white" />
            {/* hospital */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="grid size-10 place-items-center rounded-lg bg-primary text-primary-foreground shadow-lg"><MapPin className="size-5" /></div>
              <div className="mt-1 text-center text-xs font-medium text-text-primary">Meridian</div>
            </div>
            {/* ambulance markers */}
            {AMBULANCES.map((a, i) => (
              <button key={a.id} onClick={() => setSelected(a)}
                className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${20 + i * 28}%`, top: `${25 + i * 18}%` }}>
                <div className={`grid size-8 place-items-center rounded-full text-white shadow-md ${selected.id === a.id ? "ring-4 ring-danger/30" : ""}`}
                  style={{ background: "#dc2626" }}><Ambulance className="size-4" /></div>
              </button>
            ))}
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 text-xs font-medium text-text-secondary shadow">
              <Radio className="size-3.5 animate-pulse text-danger" />Live · updated 5s ago
            </div>
          </div>

          <div className="space-y-3">
            {AMBULANCES.map((a) => {
              const isAccepted = accepted.includes(a.id);
              return (
                <button key={a.id} onClick={() => setSelected(a)}
                  className={`flex w-full items-center gap-4 rounded-xl border bg-surface p-4 text-left transition-all hover:border-primary ${selected.id === a.id ? "border-primary ring-2 ring-primary/15" : "border-border"}`}>
                  <div className="grid size-11 place-items-center rounded-lg bg-danger/10 text-danger"><Ambulance className="size-6" /></div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-semibold text-text-primary">{a.vehicle}</span>
                      <TriagePill triage={a.triage} />
                      {isAccepted && <StatusBadge tone="success"><Check className="size-3" />Accepted</StatusBadge>}
                    </div>
                    <div className="mt-0.5 truncate text-sm text-text-secondary">{a.condition}</div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 font-semibold text-text-primary"><Clock className="size-4 text-danger" />{a.etaMins} min</div>
                    <div className="text-xs text-text-secondary">{a.distanceKm} km</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Ambulance details */}
        <SectionCard title="Ambulance Details">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-text-primary" style={{ fontSize: 18 }}>{selected.vehicle}</span>
              <TriagePill triage={selected.triage} showLabel />
            </div>
            <div className="rounded-lg bg-danger/5 p-3 text-sm">
              <div className="font-medium text-danger">Patient condition</div>
              <div className="text-text-secondary">{selected.condition}</div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Info icon={User} label="Driver" value={selected.driver} />
              <Info icon={User} label="Paramedic" value={selected.paramedic} />
              <Info icon={Navigation} label="Distance" value={`${selected.distanceKm} km`} />
              <Info icon={Clock} label="ETA" value={`${selected.etaMins} min`} />
            </div>
            <div>
              <div className="mb-2 flex items-center gap-1.5 text-sm font-medium text-text-primary"><Wrench className="size-4" />Equipment status</div>
              <div className="space-y-1.5">
                {[["Oxygen", selected.equipment.oxygen], ["Ventilator", selected.equipment.ventilator], ["Defibrillator", selected.equipment.defibrillator]].map(([k, v]) => (
                  <div key={k as string} className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm">
                    <span className="text-text-secondary">{k as string}</span>
                    {v ? <StatusBadge tone="success"><Check className="size-3" />Onboard</StatusBadge> : <StatusBadge tone="neutral">Not available</StatusBadge>}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2 pt-1">
              <Button className="h-11 w-full" onClick={() => accept(selected)} disabled={accepted.includes(selected.id)}>
                <Check className="size-4" />{accepted.includes(selected.id) ? "Accepted" : "Accept & Prepare Bay"}
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => toast.info("Redirect request sent to dispatch")}><Shuffle className="size-4" />Redirect</Button>
                <Button variant="outline" className="flex-1 text-danger" onClick={() => toast.error("Ambulance cancelled")}><X className="size-4" />Cancel</Button>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

function Info({ icon: Icon, label, value }: { icon: typeof User; label: string; value: string }) {
  return (
    <div>
      <div className="flex items-center gap-1 text-xs text-text-secondary"><Icon className="size-3.5" />{label}</div>
      <div className="mt-0.5 font-medium text-text-primary">{value}</div>
    </div>
  );
}
