import {
  Siren, HeartPulse, Ambulance, Stethoscope, Users, BedDouble, TriangleAlert,
  Activity, ArrowRight, Zap,
} from "lucide-react";
import {
  Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell,
} from "recharts";
import { StatCard, SectionCard, PageHeader, Avatar } from "../his/ui";
import { Button } from "../ui/button";
import { TriagePill } from "./edUi";
import { toast } from "sonner";
import {
  AMBULANCES, HOURLY_ARRIVALS, TRIAGE_DISTRIBUTION, ED_BEDS,
} from "./edData";
import type { EDRoute } from "./EmergencyApp";
import type { EDCase } from "./edData";

export function EmergencyDashboard({ liveCases, go, openCase }: { liveCases?: EDCase[]; go: (r: EDRoute) => void; openCase: (c: EDCase) => void }) {
  const edCases = liveCases ?? ED_CASES;
  const critical = edCases.filter((c) => c.triage === "Red");
  const live = [...edCases].sort((a, b) => (a.triage === "Red" ? -1 : 1)).slice(0, 5);

  return (
    <div className="space-y-6">
      <PageHeader title="Emergency Dashboard" subtitle="Live ED status · 22 Jul 2026, 11:10 AM · Dr. Imran Sheikh on duty"
        actions={<>
          <Button variant="outline" onClick={() => go("ambulances")}><Ambulance className="size-4" />Incoming ({AMBULANCES.length})</Button>
          <Button variant="destructive" onClick={() => toast.error("CODE BLUE broadcast to rapid response team")}><Zap className="size-4" />Code Blue</Button>
        </>} />

      {/* Critical alert banner */}
      {critical.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-danger/30 bg-danger/5 p-4">
          <div className="grid size-10 place-items-center rounded-lg bg-danger/10 text-danger"><TriangleAlert className="size-5" /></div>
          <div className="flex-1">
            <div className="font-semibold text-danger">{critical.length} critical (RED) patients under active resuscitation</div>
            <div className="text-sm text-text-secondary">{critical.map((c) => c.name).join(" · ")}</div>
          </div>
          <Button variant="destructive" size="sm" onClick={() => go("queue")}>View queue<ArrowRight className="size-4" /></Button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Siren} label="Today's Emergency Cases" value={42} trend={9} tone="danger" hint="17 active now" />
        <StatCard icon={HeartPulse} label="Critical Patients" value={critical.length} tone="danger" hint="RESUS bays" />
        <StatCard icon={Ambulance} label="Incoming Ambulances" value={AMBULANCES.length} tone="warning" hint="Nearest ETA 4 min" />
        <StatCard icon={Stethoscope} label="ED Doctors Available" value="4/5" tone="success" />
        <StatCard icon={Users} label="Nurses On Shift" value={8} tone="info" />
        <StatCard icon={BedDouble} label="ED Beds" value={`${ED_BEDS.total - ED_BEDS.occupied}/${ED_BEDS.total}`} tone="brand" hint="free / total" />
        <StatCard icon={Activity} label="ICU Beds Free" value={ED_BEDS.icuFree} tone="warning" />
        <StatCard icon={Zap} label="Code Blue (24h)" value={2} tone="danger" />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <SectionCard title="Emergency Arrivals — Today" className="xl:col-span-2">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={HOURLY_ARRIVALS} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="edArrivals" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#dc2626" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#dc2626" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="hour" tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} allowDuplicatedCategory={false} />
              <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 13 }} />
              <Area type="monotone" dataKey="cases" stroke="#dc2626" strokeWidth={2.5} fill="url(#edArrivals)" />
            </AreaChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Triage Distribution">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={TRIAGE_DISTRIBUTION} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                {TRIAGE_DISTRIBUTION.map((d) => <Cell key={d.name} fill={d.color} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 13 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {TRIAGE_DISTRIBUTION.map((d) => (
              <div key={d.name} className="flex items-center gap-2 text-sm">
                <span className="size-2.5 rounded-full" style={{ background: d.color }} />
                <span className="text-text-secondary">{d.name}</span>
                <span className="ml-auto font-medium text-text-primary">{d.value}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Live Emergency Queue" action={<Button variant="ghost" size="sm" onClick={() => go("queue")}>View all</Button>}>
        <div className="-mx-5 overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-text-secondary">
                <th className="px-5 py-2 font-medium">Emergency ID</th>
                <th className="px-5 py-2 font-medium">Patient</th>
                <th className="px-5 py-2 font-medium">Complaint</th>
                <th className="px-5 py-2 font-medium">Triage</th>
                <th className="px-5 py-2 font-medium">Doctor</th>
                <th className="px-5 py-2 font-medium">Bed</th>
                <th className="px-5 py-2 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {live.map((c) => (
                <tr key={c.id} className="border-b border-border last:border-0 hover:bg-accent/50">
                  <td className="px-5 py-3 font-mono text-xs text-text-secondary">{c.id}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5"><Avatar name={c.name} size={32} tone="danger" />
                      <div><div className="font-medium text-text-primary">{c.name}</div><div className="text-xs text-text-secondary">{c.age}y · {c.gender}</div></div></div>
                  </td>
                  <td className="px-5 py-3 text-text-secondary">{c.complaint}</td>
                  <td className="px-5 py-3"><TriagePill triage={c.triage} /></td>
                  <td className="px-5 py-3 text-text-secondary">{c.doctor}</td>
                  <td className="px-5 py-3 font-mono text-xs text-text-secondary">{c.bed}</td>
                  <td className="px-5 py-3 text-right"><Button size="sm" variant="outline" onClick={() => openCase(c)}>Open<ArrowRight className="size-3.5" /></Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
