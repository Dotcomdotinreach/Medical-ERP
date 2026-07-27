import { useEffect, useState } from "react";
import { BedDouble, Sparkles, Lock, Check } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, SectionCard, StatCard, StatusBadge, statusTone } from "../his/ui";
import { Button } from "../ui/button";
import { BEDS, WARDS, type Bed, type BedState } from "../his/data";
import { bedApi, type Bed as ApiBed } from "../../services/beds";

const STATE_STYLES: Record<BedState, string> = {
  Available: "border-success/40 bg-success/5 hover:border-success",
  Occupied: "border-danger/40 bg-danger/5",
  Cleaning: "border-warning/40 bg-warning/5",
  Reserved: "border-info/40 bg-info/5",
};

function mapApiBedStatus(s: string): BedState {
  const map: Record<string, BedState> = {
    available: "Available",
    occupied: "Occupied",
    cleaning: "Cleaning",
    reserved: "Reserved",
  };
  return map[s] || "Available";
}

function mapApiBed(b: ApiBed): Bed {
  return {
    id: b.bedNumber,
    ward: b.ward,
    type: b.type,
    state: mapApiBedStatus(b.status),
    patient: b.patient ? `${b.patient.firstName} ${b.patient.lastName}` : undefined,
  };
}

export function Beds() {
  const [beds, setBeds] = useState<Bed[]>(BEDS);
  const [ward, setWard] = useState("All");
  const [selected, setSelected] = useState<Bed | null>(null);

  useEffect(() => {
    bedApi.list()
      .then((r) => setBeds(r.data.map(mapApiBed)))
      .catch(() => {});
  }, []);

  const count = (s: BedState) => beds.filter((b) => b.state === s).length;
  const shown = ward === "All" ? beds : beds.filter((b) => b.ward === ward);

  const assign = (bed: Bed) => {
    setBeds((bs) => bs.map((b) => (b.id === bed.id ? { ...b, state: "Occupied", patient: "New Admission" } : b)));
    setSelected(null);
    toast.success(`${bed.id} assigned successfully`);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Bed Management" subtitle="Live occupancy across all wards · 210 beds total" />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Check} label="Available" value={count("Available")} tone="success" />
        <StatCard icon={BedDouble} label="Occupied" value={count("Occupied")} tone="danger" />
        <StatCard icon={Sparkles} label="Cleaning" value={count("Cleaning")} tone="warning" />
        <StatCard icon={Lock} label="Reserved" value={count("Reserved")} tone="info" />
      </div>

      <div className="flex flex-wrap gap-2">
        {["All", ...WARDS].map((w) => (
          <button key={w} onClick={() => setWard(w)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${ward === w ? "bg-primary text-primary-foreground" : "bg-muted text-text-secondary hover:bg-accent"}`}>
            {w}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <SectionCard title="Floor Map" className="xl:col-span-2">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {shown.map((b, i) => (
              <button key={b.id || i} onClick={() => b.state === "Available" && setSelected(b)}
                className={`rounded-xl border-2 p-3 text-left transition-all ${STATE_STYLES[b.state]} ${selected?.id === b.id ? "ring-2 ring-primary/30" : ""}`}>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-semibold text-text-primary">{b.id}</span>
                  <BedDouble className="size-4 text-text-secondary" />
                </div>
                <div className="mt-1 text-xs text-text-secondary">{b.type}</div>
                <div className="mt-2"><StatusBadge tone={statusTone(b.state)}>{b.state}</StatusBadge></div>
                {b.patient && <div className="mt-1.5 truncate text-xs text-text-secondary">{b.patient}</div>}
              </button>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Bed Details">
          {selected ? (
            <div className="space-y-4">
              <div className="rounded-lg border border-border p-4">
                <div className="font-mono font-bold text-text-primary" style={{ fontSize: 20 }}>{selected.id}</div>
                <div className="mt-1 text-sm text-text-secondary">{selected.ward} · {selected.type}</div>
                <div className="mt-2"><StatusBadge tone={statusTone(selected.state)}>{selected.state}</StatusBadge></div>
              </div>
              <Button className="h-11 w-full" onClick={() => assign(selected)}>Assign to Patient</Button>
              <Button variant="outline" className="h-11 w-full" onClick={() => setSelected(null)}>Cancel</Button>
            </div>
          ) : (
            <div className="py-10 text-center text-sm text-text-secondary">
              <BedDouble className="mx-auto mb-3 size-8 text-border" />
              Select an available bed from the floor map to assign or transfer a patient.
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
