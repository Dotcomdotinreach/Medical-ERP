import { StatCard, EMSAvatar, PriorityPulse, DispatchBadge, PriorityPulse as PriorityIndicator } from "./ambulanceUi";
import { AmbulanceDispatch } from "../../services/ambulance";
import { Ambulance, Activity, Clock, MapPin } from "lucide-react";

export type Stats = {
  totalDispatches: number;
  activeDispatches: number;
  pendingDispatches: number;
  avgETAMin: number;
};

export function AmbulanceDashboard({
  liveDispatches,
  stats,
  onNavigate,
}: {
  liveDispatches: AmbulanceDispatch[];
  stats: Stats;
  onNavigate: (route: "dispatches" | "analytics") => void;
}) {
  const now = new Date("2026-07-23T14:40:00");
  const activeDispatches = liveDispatches.filter(d => d.status === "Dispatched" || d.status === "On Route");

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Code Red": return "#DC2626";
      case "Code Yellow": return "#d97706";
      case "Code Green": return "#059669";
      default: return "#6B7280";
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[30px] font-bold text-text-primary">Ambulance Operations</h2>
          <p className="text-sm text-text-secondary">Live dispatch dashboard — Meridian Multi-Speciality Hospital</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => onNavigate("dispatches")} className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-white font-medium hover:bg-primary/90 transition"><StatCard icon={Ambulance} label="Active Dispatches" value={activeDispatches.length} />Active Dispatches</button>
          <button onClick={() => onNavigate("analytics")} className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-5 py-2.5 font-medium hover:bg-muted/50 transition">
            <StatCard icon={Activity} label="Analytics" value="" />Analytics & Reports
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <h3 className="text-sm font-medium text-text-secondary">Active Dispatches</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-[28px] font-bold text-text-primary">{stats.activeDispatches}</span>
            <span className="text-xs text-text-secondary">of {stats.totalDispatches} total</span>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <h3 className="text-sm font-medium text-text-secondary">Pending Requests</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-[28px] font-bold text-warning">{stats.pendingDispatches}</span>
            <span className="text-xs text-text-secondary">awaiting assignment</span>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <h3 className="text-sm font-medium text-text-secondary">Average ETA</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-[28px] font-bold text-text-primary">{Math.round(stats.avgETAMin)} min</span>
            <span className="text-xs text-text-secondary">average response time</span>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <h3 className="text-sm font-medium text-text-secondary">Next ICU Bed</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-[28px] font-bold text-success">B12</span>
            <span className="text-xs text-text-secondary">available ICU bed</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-text-primary">Critical Alerts</h3>
            <span className="text-xs text-text-secondary">Updated {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div className="space-y-4">
            {activeDispatches.filter(d => d.priority === "Code Red").slice(0, 3).map(disp => {
              const etaTime = new Date(now.getTime() + (disp.eta || 0) * 60000);
              return (
                <div key={disp._id} className="rounded-xl bg-danger/5 p-4 border-l-4 border-danger">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <PriorityPulse priority={disp.priority as any} />
                        <h4 className="font-semibold text-text-primary">{disp.patient?.firstName} {disp.patient?.lastName}</h4>
                        <span className="text-xs text-text-secondary">• UHID: {disp.patient?.uhid}</span>
                      </div>
                      <p className="mt-1 text-sm text-text-secondary">{disp.emergencyType} — {disp.location.address}</p>
                      <div className="mt-3 flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Clock className="size-4 text-text-secondary" />{etaTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="size-4 text-text-secondary" />{disp.distanceKm} km
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <PriorityPulse priority={disp.priority as any} />
                      <span className="text-xs text-text-secondary">ETA: {disp.eta} min</span>
                      <button className="text-xs font-medium text-danger hover:text-danger/80">Track</button>
                    </div>
                  </div>
                </div>
              );
            })}
            {activeDispatches.filter(d => d.priority !== "Code Red").slice(0, 2).map(disp => {
              const etaTime = new Date(now.getTime() + (disp.eta || 0) * 60000);
              return (
                <div key={disp._id} className="rounded-xl bg-surface p-4 border-l-4 border-warning">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-text-primary">{disp.patient?.firstName} {disp.patient?.lastName}</h4>
                        <span className="text-xs text-text-secondary">• UHID: {disp.patient?.uhid}</span>
                      </div>
                      <p className="mt-1 text-sm text-text-secondary">{disp.emergencyType}</p>
                      <div className="mt-2 flex items-center gap-3">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="size-4 text-text-secondary" />{etaTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="size-4 text-text-secondary" />{disp.distanceKm} km
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-xs font-medium text-text-primary">Patient: {disp.priority}</span>
                      <span className="text-xs text-text-secondary">ETA: {disp.eta} min</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-text-primary">Team & Vehicle Status</h3>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <EMSAvatar name="Vikram Jadhav" size={44} />
                  <div>
                    <div className="font-medium text-text-primary">Driver: Vikram Jadhav</div>
                    <div className="text-xs text-text-secondary">Vehicle: MH-12-A-4521</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-medium text-success">On Duty</div>
                  <div className="text-xs text-text-secondary">4 active trips</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <EMSAvatar name="Rajesh More" size={44} />
                  <div>
                    <div className="font-medium text-text-primary">Driver: Rajesh More</div>
                    <div className="text-xs text-text-secondary">Vehicle: MH-12-B-3387</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-medium text-success">On Duty</div>
                  <div className="text-xs text-text-secondary">2 active trips</div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-text-primary">Equipment Status</h3>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                <span className="text-sm text-text-primary">Defibrillators</span>
                <span className="text-sm font-medium text-success">Available (10)</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                <span className="text-sm text-text-primary">Oxygen Cylinders</span>
                <span className="text-sm font-medium text-success">Available (25)</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                <span className="text-sm text-text-primary">Ventilators</span>
                <span className="text-sm font-medium text-warning">Low (2 left)</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                <span className="text-sm text-text-primary">Medical Kits</span>
                <span className="text-sm font-medium text-success">Ready (15)</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-text-primary">Recent Activity</h3>
            <div className="mt-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 size-2 rounded-full bg-brand" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-text-primary">Dispatched 2 new incidents</div>
                  <div className="text-xs text-text-secondary">15 min ago</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 size-2 rounded-full bg-success" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-text-primary">Vehicle MH-12-A-4521 completed transport</div>
                  <div className="text-xs text-text-secondary">45 min ago</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 size-2 rounded-full bg-warning" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-text-primary">Driver shift change completed</div>
                  <div className="text-xs text-text-secondary">1 hr ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
