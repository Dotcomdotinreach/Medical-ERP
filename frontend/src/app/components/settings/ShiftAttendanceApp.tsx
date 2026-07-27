import { useState } from "react";
import { Clock, Calendar, ArrowLeft, CheckCircle, XCircle, AlertCircle, Timer, MapPin, FileText, Plus } from "lucide-react";
import { Shell, type NavItem, type Workspace } from "../his/Shell";
import { PageHeader, SectionCard, StatusBadge } from "../his/ui";
import { Button } from "../ui/button";

interface Props {
  roleName: string;
  onSignOut: () => void;
  onSwitchWorkspace: (w: Workspace) => void;
  onOpenSettings?: (page: string) => void;
  onBack: () => void;
  nav: NavItem[];
  navSecondary?: NavItem[];
  sectionLabel: string;
}

const TODAY_ATTENDANCE = [
  { time: "08:02 AM", action: "Clock In", status: "success", loc: "Main Building, Gate A" },
  { time: "12:30 PM", action: "Lunch Break", status: "info", loc: "Staff Cafeteria" },
  { time: "01:15 PM", action: "Return from Break", status: "success", loc: "Main Building, Gate A" },
];

const WEEKLY_SCHEDULE = [
  { day: "Monday", shift: "Morning", time: "08:00 AM – 04:00 PM", status: "present" },
  { day: "Tuesday", shift: "Morning", time: "08:00 AM – 04:00 PM", status: "present" },
  { day: "Wednesday", shift: "Morning", time: "08:00 AM – 04:00 PM", status: "present" },
  { day: "Thursday", shift: "Off", time: "—", status: "off" },
  { day: "Friday", shift: "Morning", time: "08:00 AM – 04:00 PM", status: "present" },
  { day: "Saturday", shift: "Morning", time: "08:00 AM – 02:00 PM", status: "present" },
  { day: "Sunday", shift: "Off", time: "—", status: "off" },
];

const ATTENDANCE_HISTORY = [
  { date: "24 Jul 2026", in: "08:01 AM", out: "04:05 PM", hours: "8h 04m", status: "present" },
  { date: "23 Jul 2026", in: "07:58 AM", out: "04:02 PM", hours: "8h 04m", status: "present" },
  { date: "22 Jul 2026", in: "08:05 AM", out: "03:50 PM", hours: "7h 45m", status: "present" },
  { date: "21 Jul 2026", in: "08:00 AM", out: "04:00 PM", hours: "8h 00m", status: "present" },
  { date: "20 Jul 2026", in: "—", out: "—", hours: "—", status: "off" },
  { date: "19 Jul 2026", in: "—", out: "—", hours: "—", status: "off" },
  { date: "18 Jul 2026", in: "08:15 AM", out: "02:00 PM", hours: "5h 45m", status: "half-day" },
  { date: "17 Jul 2026", in: "08:02 AM", out: "04:01 PM", hours: "7h 59m", status: "present" },
  { date: "16 Jul 2026", in: "09:30 AM", out: "04:00 PM", hours: "6h 30m", status: "late" },
  { date: "15 Jul 2026", in: "—", out: "—", hours: "—", status: "absent" },
];

const LEAVE_REQUESTS = [
  { type: "Casual Leave", from: "01 Aug 2026", to: "02 Aug 2026", days: 2, status: "approved" },
  { type: "Sick Leave", from: "18 Jul 2026", to: "18 Jul 2026", days: 1, status: "approved" },
  { type: "Earned Leave", from: "15 Sep 2026", to: "19 Sep 2026", days: 5, status: "pending" },
];

export function ShiftAttendanceApp({ roleName, onSignOut, onSwitchWorkspace, onOpenSettings, onBack, nav, navSecondary, sectionLabel }: Props) {
  const [clockedIn, setClockedIn] = useState(true);
  const [showLeaveForm, setShowLeaveForm] = useState(false);

  const statusIcon = (s: string) => {
    if (s === "present") return <CheckCircle className="size-4 text-success" />;
    if (s === "late") return <AlertCircle className="size-4 text-warning" />;
    if (s === "absent") return <XCircle className="size-4 text-danger" />;
    if (s === "half-day") return <Timer className="size-4 text-warning" />;
    return <span className="text-xs text-text-secondary">OFF</span>;
  };

  const statusBadge = (s: string) => {
    if (s === "approved") return <StatusBadge tone="success">Approved</StatusBadge>;
    if (s === "pending") return <StatusBadge tone="info">Pending</StatusBadge>;
    return <StatusBadge tone="neutral">Rejected</StatusBadge>;
  };

  return (
    <Shell
      nav={nav}
      navSecondary={navSecondary}
      sectionLabel={sectionLabel}
      activeId="dashboard"
      onNavigate={() => onBack()}
      breadcrumb={["Home", "Shift & Attendance"]}
      roleName={roleName}
      onSignOut={onSignOut}
      workspace="reception"
      onSwitchWorkspace={onSwitchWorkspace}
      onOpenSettings={onOpenSettings}
    >
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="rounded-lg border border-border p-2 hover:bg-accent"><ArrowLeft className="size-4" /></button>
          <PageHeader title="Shift & Attendance" subtitle="Track your work hours and manage leave requests" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <SectionCard title="Today's Status">
            <div className="flex items-center gap-3">
              <div className={`flex h-12 w-12 items-center justify-center rounded-full ${clockedIn ? "bg-success/10 text-success" : "bg-gray-200 text-text-secondary"}`}>
                <Clock className="size-6" />
              </div>
              <div>
                <div className="text-lg font-bold text-text-primary">{clockedIn ? "Clocked In" : "Clocked Out"}</div>
                <div className="text-xs text-text-secondary">{clockedIn ? "Since 08:02 AM" : "Last clock out: 04:05 PM"}</div>
              </div>
            </div>
            <Button className="mt-3 w-full" onClick={() => setClockedIn(!clockedIn)}>
              {clockedIn ? "Clock Out" : "Clock In"}
            </Button>
          </SectionCard>
          <SectionCard title="Hours Today">
            <div className="text-3xl font-bold text-primary">5h 13m</div>
            <div className="text-xs text-text-secondary mt-1">Target: 8h 00m</div>
            <div className="mt-2 h-2 rounded-full bg-secondary overflow-hidden">
              <div className="h-full rounded-full bg-primary" style={{ width: "65%" }} />
            </div>
          </SectionCard>
          <SectionCard title="This Month">
            <div className="text-3xl font-bold text-text-primary">18</div>
            <div className="text-xs text-text-secondary mt-1">Working days · 156h 30m total</div>
            <div className="mt-1 text-xs"><span className="text-success font-medium">15 present</span> · <span className="text-warning font-medium">1 late</span> · <span className="text-danger font-medium">1 absent</span> · <span className="text-text-secondary">1 off</span></div>
          </SectionCard>
          <SectionCard title="Leave Balance">
            <div className="space-y-2">
              {[{ type: "Casual", remaining: 6, total: 12 }, { type: "Sick", remaining: 8, total: 10 }, { type: "Earned", remaining: 12, total: 15 }].map((l) => (
                <div key={l.type} className="flex items-center justify-between">
                  <span className="text-xs text-text-secondary">{l.type}</span>
                  <span className="text-xs font-medium text-text-primary">{l.remaining}/{l.total}</span>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        <SectionCard title="Today's Activity Log">
          <div className="space-y-3">
            {TODAY_ATTENDANCE.map((a, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10"><Clock className="size-4 text-primary" /></div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-text-primary">{a.action}</div>
                  <div className="text-xs text-text-secondary flex items-center gap-1"><MapPin className="size-3" />{a.loc}</div>
                </div>
                <span className="text-sm text-text-secondary">{a.time}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <SectionCard title="Weekly Schedule">
            <div className="space-y-2">
              {WEEKLY_SCHEDULE.map((d) => (
                <div key={d.day} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                  {statusIcon(d.status)}
                  <div className="flex-1">
                    <div className="text-sm font-medium text-text-primary">{d.day}</div>
                    <div className="text-xs text-text-secondary">{d.shift}</div>
                  </div>
                  <span className="text-xs text-text-secondary">{d.time}</span>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Leave Requests">
            <div className="mb-3 flex justify-end">
              <Button onClick={() => setShowLeaveForm(!showLeaveForm)}><Plus className="size-4 mr-1" />New Request</Button>
            </div>
            {showLeaveForm && (
              <div className="mb-4 rounded-lg border border-border p-4 space-y-3 bg-secondary/30">
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="mb-1 block text-xs font-medium text-text-secondary">Leave Type</label>
                    <select className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"><option>Casual Leave</option><option>Sick Leave</option><option>Earned Leave</option><option>Maternity Leave</option></select>
                  </div>
                  <div><label className="mb-1 block text-xs font-medium text-text-secondary">From</label><input type="date" className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm" /></div>
                  <div><label className="mb-1 block text-xs font-medium text-text-secondary">To</label><input type="date" className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm" /></div>
                  <div><label className="mb-1 block text-xs font-medium text-text-secondary">Reason</label><input className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm" placeholder="Brief reason..." /></div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button onClick={() => setShowLeaveForm(false)}>Cancel</Button>
                  <Button onClick={() => setShowLeaveForm(false)}>Submit</Button>
                </div>
              </div>
            )}
            <div className="space-y-2">
              {LEAVE_REQUESTS.map((l, i) => (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                  <FileText className="size-4 text-text-secondary" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-text-primary">{l.type}</div>
                    <div className="text-xs text-text-secondary">{l.from} – {l.to} · {l.days} day{l.days > 1 ? "s" : ""}</div>
                  </div>
                  {statusBadge(l.status)}
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        <SectionCard title="Monthly Attendance Overview">
          <div className="grid grid-cols-7 gap-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <div key={d} className="text-center text-xs font-medium text-text-secondary pb-1">{d}</div>
            ))}
            {Array.from({ length: 31 }, (_, i) => {
              const day = i + 1;
              const isOff = [4, 5, 11, 12, 18, 19, 25, 26].includes(day);
              const isAbsent = day === 15;
              const isLate = day === 16;
              const isHalfDay = day === 18;
              const isFuture = day > 24;
              let bg = "bg-success/10 text-success";
              if (isOff) bg = "bg-secondary text-text-secondary";
              else if (isAbsent) bg = "bg-danger/10 text-danger";
              else if (isLate) bg = "bg-warning/10 text-warning";
              else if (isHalfDay) bg = "bg-warning/10 text-warning";
              else if (isFuture) bg = "bg-secondary/50 text-text-secondary";
              return (
                <div key={day} className={`flex h-9 items-center justify-center rounded-lg text-xs font-medium ${bg}`}>
                  {day}
                </div>
              );
            })}
          </div>
          <div className="mt-3 flex gap-4 text-xs text-text-secondary">
            <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-success" />Present</span>
            <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-warning" />Late/Half-day</span>
            <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-danger" />Absent</span>
            <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-gray-300" />Day Off</span>
          </div>
        </SectionCard>
      </div>
    </Shell>
  );
}
