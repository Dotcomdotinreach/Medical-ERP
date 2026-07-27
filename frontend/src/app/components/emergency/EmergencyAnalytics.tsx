import { Clock, Timer, Activity, TrendingUp, Ambulance, HeartPulse } from "lucide-react";
import {
  Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
} from "recharts";
import { StatCard, SectionCard, PageHeader, Avatar } from "../his/ui";
import { HOURLY_ARRIVALS, ED_DOCTORS } from "./edData";

const OUTCOMES = [
  { day: "Mon", admitted: 14, discharged: 22, transferred: 4 },
  { day: "Tue", admitted: 11, discharged: 26, transferred: 3 },
  { day: "Wed", admitted: 18, discharged: 19, transferred: 6 },
  { day: "Thu", admitted: 9, discharged: 24, transferred: 2 },
  { day: "Fri", admitted: 16, discharged: 28, transferred: 5 },
  { day: "Sat", admitted: 21, discharged: 31, transferred: 7 },
  { day: "Sun", admitted: 13, discharged: 20, transferred: 3 },
];

export function EmergencyAnalytics() {
  return (
    <div className="space-y-6">
      <PageHeader title="Emergency Analytics" subtitle="ED performance · last 7 days" />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Clock} label="Avg Waiting Time" value="14 min" trend={-6} tone="success" hint="door-to-triage" />
        <StatCard icon={Timer} label="Avg Treatment Time" value="1h 52m" trend={-4} tone="info" />
        <StatCard icon={Ambulance} label="Ambulance Response" value="8.3 min" trend={-2} tone="brand" />
        <StatCard icon={Activity} label="Admissions" value={102} trend={5} tone="warning" />
        <StatCard icon={TrendingUp} label="Total ED Cases" value={289} trend={7} tone="danger" />
        <StatCard icon={HeartPulse} label="Transfers (ICU/OT)" value={30} tone="warning" />
        <StatCard icon={Activity} label="Left Without Being Seen" value="1.2%" trend={-1} tone="success" />
        <StatCard icon={HeartPulse} label="Mortality" value="0.4%" tone="neutral" />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <SectionCard title="Disposition Outcomes — This Week">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={OUTCOMES} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} allowDuplicatedCategory={false} />
              <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 13 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="discharged" name="Discharged" stackId="a" fill="#16a34a" radius={[0, 0, 0, 0]} maxBarSize={40} />
              <Bar dataKey="admitted" name="Admitted" stackId="a" fill="#1565ff" maxBarSize={40} />
              <Bar dataKey="transferred" name="Transferred" stackId="a" fill="#f59e0b" radius={[6, 6, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Peak Arrival Hours">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={HOURLY_ARRIVALS} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="hour" tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} allowDuplicatedCategory={false} />
              <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: "#fef2f2" }} contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 13 }} />
              <Bar dataKey="cases" name="Cases" fill="#dc2626" radius={[6, 6, 0, 0]} maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      <SectionCard title="Doctor Performance">
        <div className="-mx-5 overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-text-secondary">
                <th className="px-5 py-2 font-medium">Doctor</th><th className="px-5 py-2 font-medium">Speciality</th>
                <th className="px-5 py-2 font-medium">Cases</th><th className="px-5 py-2 font-medium">Avg Time</th>
                <th className="px-5 py-2 font-medium">Satisfaction</th>
              </tr>
            </thead>
            <tbody>
              {ED_DOCTORS.map((d, i) => (
                <tr key={d.id} className="border-b border-border last:border-0 hover:bg-accent/50">
                  <td className="px-5 py-3"><div className="flex items-center gap-2.5"><Avatar name={d.name.replace("Dr. ", "")} size={32} /><span className="font-medium text-text-primary">{d.name}</span></div></td>
                  <td className="px-5 py-3 text-text-secondary">{d.speciality}</td>
                  <td className="px-5 py-3 text-text-primary">{40 - i * 5}</td>
                  <td className="px-5 py-3 text-text-secondary">{1}h {30 + i * 6}m</td>
                  <td className="px-5 py-3 text-text-primary">{(4.8 - i * 0.1).toFixed(1)} / 5</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
