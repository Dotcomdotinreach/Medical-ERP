import { useState } from "react";
import {
  MapPin, Clock, User, Wrench, Check, X, Shuffle, Radio, Ambulance as AmbulanceIcon,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader, SectionCard, StatusBadge } from "../his/ui";
import { Button } from "../ui/button";
import { TriagePill as TD } from "../emergency/edUi";
import { AmbulanceDispatch } from "../../services/ambulance";

export function IncomingAmbulances({
  liveDispatches,
  onUpdate,
}: {
  liveDispatches: AmbulanceDispatch[];
  onUpdate: (dispatches: AmbulanceDispatch[]) => void;
}) {
  const [selectedDispatch, setSelectedDispatch] = useState<AmbulanceDispatch | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Accepted": return "text-success";
      case "En Route": return "text-brand";
      case "Pending": return "text-warning";
      case "Cancelled": return "text-danger";
      default: return "text-text-secondary";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Code Red": return "#dc2626";
      case "Code Yellow": return "#d97706";
      case "Code Green": return "#16a34a";
      default: return "#6b7280";
    }
  };

  const mapDispatchToAmbulance = (dispatch: AmbulanceDispatch) => {
    return {
      id: dispatch._id,
      vehicle: dispatch.ambulance?.vehicleNumber || "AMB-UNKNOWN",
      driver: dispatch.ambulance?.driver || "Driver",
      paramedic: "Paramedic",
      condition: "Patient on board",
      triage: dispatch.priority === "Code Red" ? "Red" : dispatch.priority === "Code Yellow" ? "Yellow" : "Green",
      distanceKm: Math.round((dispatch.location.lat - 18.5204) * 111 + Math.random() * 10),
      etaMins: dispatch.eta || Math.round(Math.random() * 20) + 5,
      equipment: {
        oxygen: true,
        ventilator: Math.random() > 0.5,
        defibrillator: Math.random() > 0.3,
      },
    };
  };

  const ambulances = liveDispatches.map(mapDispatchToAmbulance);

  const acceptedDispatches = liveDispatches.filter(d => d.status === "Accepted" || d.status === "En Route");

  const acceptDispatch = (dispatch: AmbulanceDispatch) => {
    const updated = liveDispatches.map(d =>
      d._id === dispatch._id ? { ...d, status: "Accepted" } : d
    );
    onUpdate(updated);
    toast.success(`Dispatch ${dispatch._id} accepted · RESUS bay reserved · team alerted`);
  };

  const redirectDispatch = (dispatch: AmbulanceDispatch) => {
    const updated = liveDispatches.map(d =>
      d._id === dispatch._id ? { ...d, status: "En Route" } : d
    );
    onUpdate(updated);
    toast.info("Redirect request sent to dispatch");
  };

  const cancelDispatch = (dispatch: AmbulanceDispatch) => {
    const updated = liveDispatches.map(d =>
      d._id === dispatch._id ? { ...d, status: "Cancelled" } : d
    );
    onUpdate(updated);
    toast.error("Dispatch cancelled");
  };

  const selected = selectedDispatch ? mapDispatchToAmbulance(selectedDispatch) : ambulances[0];

  return (
    <div className="space-y-6">
      <PageHeader title="Active Dispatches" subtitle="Live GPS tracking and management of active ambulance dispatches" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="space-y-3">
            {ambulances.map((a) => {
              const dispatch = liveDispatches.find(d => d._id === a.id);
              if (!dispatch) return null;
              return (
                <button
                  key={a.id}
                  onClick={() => setSelectedDispatch(dispatch)}
                  className={`flex w-full items-center gap-4 rounded-xl border bg-surface p-4 text-left transition-all hover:border-primary ${selected?.id === a.id ? "border-primary ring-2 ring-primary/15" : "border-border"}`}
                >
                  <div className="grid size-11 place-items-center rounded-lg bg-danger/10 text-danger">
                    <AmbulanceIcon className="size-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-semibold text-text-primary">{a.vehicle}</span>
                      <TD triage={a.triage} />
                      {acceptedDispatches.includes(a.id) && (
                        <StatusBadge tone="success"><Check className="size-3" />Accepted</StatusBadge>
                      )}
                    </div>
                    <div className="mt-0.5 truncate text-sm text-text-secondary">
                      {dispatch.patient?.firstName} {dispatch.patient?.lastName} — {dispatch.emergencyType}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 font-semibold text-text-primary">
                      <Clock className="size-4 text-danger" />{a.etaMins} min
                    </div>
                    <div className="text-xs text-text-secondary">{a.distanceKm} km</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <SectionCard title="Dispatch Details">
          <div className="space-y-4">
            {selected ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-text-primary" style={{ fontSize: 18 }}>{selected.vehicle}</span>
                  <TD triage={selected.triage} showLabel />
                </div>
                <div className="rounded-lg bg-danger/5 p-3 text-sm">
                  <div className="font-medium text-danger">Patient condition</div>
                  <div className="text-text-secondary">{selectedDispatch?.emergencyType}</div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="flex items-center gap-1 text-xs text-text-secondary"><User className="size-3.5" />Driver</div>
                    <div className="mt-0.5 font-medium text-text-primary">{selected.driver}</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-xs text-text-secondary"><User className="size-3.5" />Paramedic</div>
                    <div className="mt-0.5 font-medium text-text-primary">{selected.paramedic}</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-xs text-text-secondary"><MapPin className="size-3.5" />Distance</div>
                    <div className="mt-0.5 font-medium text-text-primary">{selected.distanceKm} km</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-xs text-text-secondary"><Clock className="size-3.5" />ETA</div>
                    <div className="mt-0.5 font-medium text-text-primary">{selected.etaMins} min</div>
                  </div>
                </div>
                <div>
                  <div className="mb-2 flex items-center gap-1.5 text-sm font-medium text-text-primary">
                    <Wrench className="size-4" />Equipment status
                  </div>
                  <div className="space-y-1.5">
                    {[
                      ["Oxygen", selected.equipment.oxygen],
                      ["Ventilator", selected.equipment.ventilator],
                      ["Defibrillator", selected.equipment.defibrillator],
                    ].map(([k, v]) => (
                      <div key={k as string} className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm">
                        <span className="text-text-secondary">{k as string}</span>
                        {v ? (
                          <StatusBadge tone="success"><Check className="size-3" />Onboard</StatusBadge>
                        ) : (
                          <StatusBadge tone="neutral">Not available</StatusBadge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2 pt-1">
                  <Button
                    className="h-11 w-full"
                    onClick={() => acceptDispatch(selectedDispatch!)}
                    disabled={acceptedDispatches.includes(selectedDispatch!._id)}
                  >
                    <Check className="size-4" />{acceptedDispatches.includes(selectedDispatch!._id) ? "Accepted" : "Accept & Prepare Bay"}
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => redirectDispatch(selectedDispatch!)}
                    ><Shuffle className="size-4" />Redirect</Button>
                    <Button
                      variant="outline"
                      className="flex-1 text-danger"
                      onClick={() => cancelDispatch(selectedDispatch!)}
                    ><X className="size-4" />Cancel</Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center text-text-secondary">Select a dispatch to view details</div>
            )}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
