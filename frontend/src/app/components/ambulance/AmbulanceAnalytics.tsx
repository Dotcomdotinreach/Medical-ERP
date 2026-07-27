import { StatCard, KPICard } from "./ambulanceUi";
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { AmbulanceDispatch } from "../../services/ambulance";
import { Ambulance, Activity, TrendingUp, Clock, MapPin } from "lucide-react";

export function AmbulanceAnalytics({ liveDispatches }: { liveDispatches: AmbulanceDispatch[] }) {
  const now = new Date("2026-07-23T14:40:00");
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  
  const priorityData = [
    { name: "Code Red", value: liveDispatches.filter(d => d.priority === "Code Red").length, color: "#DC2626" },
    { name: "Code Yellow", value: liveDispatches.filter(d => d.priority === "Code Yellow").length, color: "#d97706" },
    { name: "Code Green", value: liveDispatches.filter(d => d.priority === "Code Green").length, color: "#059669" },
  ];

  const statusData = [
    { name: "Pending", value: liveDispatches.filter(d => d.status === "Pending").length, color: "#eab308" },
    { name: "Accepted", value: liveDispatches.filter(d => d.status === "Accepted").length, color: "#3b82f6" },
    { name: "En Route", value: liveDispatches.filter(d => d.status === "En Route").length, color: "#8b5cf6" },
    { name: "On Scene", value: liveDispatches.filter(d => d.status === "On Scene").length, color: "#ec4899" },
    { name: "Transporting", value: liveDispatches.filter(d => d.status === "Transporting").length, color: "#6366f1" },
    { name: "At Hospital", value: liveDispatches.filter(d => d.status === "At Hospital").length, color: "#10b981" },
    { name: "Completed", value: liveDispatches.filter(d => d.status === "Completed").length, color: "#84cc16" },
    { name: "Cancelled", value: liveDispatches.filter(d => d.status === "Cancelled").length, color: "#64748b" },
    { name: "Rejected", value: liveDispatches.filter(d => d.status === "Rejected").length, color: "#ef4444" },
  ];

  const lineChartData = [
    { hour: '00:00', dispatched: 2, completed: 1 },
    { hour: '04:00', dispatched: 1, completed: 0 },
    { hour: '08:00', dispatched: 3, completed: 2 },
    { hour: '12:00', dispatched: 4, completed: 3 },
    { hour: '16:00', dispatched: 5, completed: 4 },
    { hour: '20:00', dispatched: 3, completed: 2 },
  ];

  const generateTimeSeries = () => {
    const data = [];
    for (let h = 0; h < 24; h += 2) {
      const hour = h < 10 ? `0${h}:00` : `${h}:00`;
      data.push({
        hour,
        dispatched: Math.floor(Math.random() * 8) + 1,
        completed: Math.floor(Math.random() * 6),
      });
    }
    return data;
  };

  const downtimeData = generateTimeSeries();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[30px] font-bold text-text-primary">Ambulance Analytics & Reports</h2>
          <p className="text-sm text-text-secondary">Performance metrics and operational insights — {now.toLocaleDateString()} at {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard icon={Ambulance} label="Total Dispatches" value={liveDispatches.length} trend="up" trendValue="+12%" tone="blue" />
        <KPICard icon={Clock} label="Avg Response Time" value="12 min" trend="down" trendValue="-15%" tone="green" />
        <KPICard icon={TrendingUp} label="Success Rate" value="94%" trend="up" trendValue="+3%" tone="emerald" />
        <KPICard icon={MapPin} label="Peak Hour" value="16:00-18:00" tone="amber" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Priority Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={priorityData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Dispatch Status Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Dispatch Volume (24-Hour Trends)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={lineChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="dispatched" stroke="#dc2626" strokeWidth={2} name="Dispatched" />
            <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2} name="Completed" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Downtime Analysis</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={downtimeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis yAxisId="left" orientation="left" stroke="#dc2626" />
            <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
            <Tooltip />
            <Line yAxisId="left" type="monotone" dataKey="dispatched" stroke="#dc2626" strokeWidth={2} name="Dispatched" />
            <Line yAxisId="right" type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2} name="Completed" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <h4 className="text-sm font-medium text-text-secondary">Peak Hour</h4>
          <div className="mt-2 text-2xl font-bold text-text-primary">16:00-18:00</div>
          <div className="text-xs text-text-secondary">32 dispatches in 2 hours</div>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <h4 className="text-sm font-medium text-text-secondary">Avg Response Time</h4>
          <div className="mt-2 text-2xl font-bold text-text-primary">12 min</div>
          <div className="text-xs text-text-secondary">Target: &lt;10 min</div>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <h4 className="text-sm font-medium text-text-secondary">Success Rate</h4>
          <div className="mt-2 text-2xl font-bold text-success">94%</div>
          <div className="text-xs text-text-secondary">Of all dispatches</div>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <h4 className="text-sm font-medium text-text-secondary">Equipment Availability</h4>
          <div className="mt-2 text-2xl font-bold text-text-primary">100%</div>
          <div className="text-xs text-text-secondary">All vehicles operational</div>
        </div>
      </div>
    </div>
  );
}
