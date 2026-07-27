import { useState, useEffect, useMemo } from "react";
import {
  LayoutDashboard, Users, UserPlus, Briefcase, ClipboardList, FileCheck,
  Award, Clock, Calendar, CalendarDays, Banknote, GraduationCap, Target,
  Heart, AlertTriangle, UserMinus, BarChart3, CheckCircle2, ChevronRight,
  Download, Filter, Plus, RefreshCw, Settings, Eye, Edit3, Search,
  Phone, Mail, MapPin, Shield, Activity, Bed, Stethoscope, Pill,
  Microscope, Scissors, Siren, Smartphone, Package, ChevronDown,
  TrendingUp, TrendingDown, Minus, MoreHorizontal, ExternalLink,
  Copy, Bell, AlertCircle, Info, Building2, Star,
} from "lucide-react";
import { Shell, type Workspace } from "../his/Shell";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  EMPLOYEES, DEPARTMENTS, JOB_OPENINGS, APPLICANTS, CREDENTIALS,
  ATTENDANCE, SHIFTS, SHIFT_ROSTER, LEAVE_REQUESTS, PAYSLIPS,
  TRAININGS, PERFORMANCE, STAFF_HEALTH, INCIDENTS, EXITS, ONBOARDINGS,
  HR_KPI,
  empStatusTone, leaveStatusTone, payrollStatusTone, trainingStatusTone,
  performanceRatingTone, incidentSeverityTone, incidentStatusTone,
  credentialStatusTone, applicationStatusTone, jobStatusTone,
  formatCurrency, formatCurrencyFull, timeAgo,
} from "./data";
import { hrmsApi } from "../../services/hrms";
import {
  PageHeader, Section, KPICard, HealthBar, StatusPill, EmployeeCard,
  CredentialCard, TrainingCard, PerformanceCard, IncidentCard, LeaveCard,
  ShiftBadge,
} from "./hrmsUi";

const NAV = [
  { id: "hr-dashboard", label: "HR Dashboard", icon: LayoutDashboard },
  { id: "employees", label: "Employee Directory", icon: Users, badge: String(HR_KPI.totalEmployees) },
  { id: "employee-profile", label: "Employee Profile", icon: UserPlus },
  { id: "recruitment", label: "Recruitment", icon: Briefcase, badge: String(HR_KPI.openPositions) },
  { id: "applicant-tracking", label: "Applicant Tracking", icon: ClipboardList },
  { id: "onboarding", label: "Onboarding", icon: FileCheck },
  { id: "credentialing", label: "Credentialing", icon: Award, badge: String(HR_KPI.expiringLicenses), tone: "danger" as const },
  { id: "attendance", label: "Attendance", icon: Clock },
  { id: "shift-scheduling", label: "Shift Scheduling", icon: Calendar },
  { id: "leave-management", label: "Leave Management", icon: CalendarDays, badge: String(HR_KPI.pendingLeaves), tone: "warning" as const },
  { id: "payroll", label: "Payroll Overview", icon: Banknote },
  { id: "training", label: "Training & CME", icon: GraduationCap },
  { id: "performance", label: "Performance", icon: Target },
  { id: "staff-health", label: "Staff Health", icon: Heart },
  { id: "incident-reporting", label: "Incident Reporting", icon: AlertTriangle },
  { id: "exit-management", label: "Exit Management", icon: UserMinus },
  { id: "hr-analytics", label: "HR Analytics", icon: BarChart3 },
  { id: "workflow-complete", label: "Workflow Complete", icon: CheckCircle2 },
];

export function HrmsApp({ roleName, onSignOut, onSwitchWorkspace, onOpenSettings }: { roleName: string; onSignOut: () => void; onSwitchWorkspace: (w: Workspace) => void; onOpenSettings?: (page: string) => void }) {
  const [screen, setScreen] = useState("hr-dashboard");
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);

  const [liveEmployees, setLiveEmployees] = useState(EMPLOYEES);
  const [liveLeaves, setLiveLeaves] = useState(LEAVE_REQUESTS);

  useEffect(() => {
    hrmsApi.listEmployees().then(r => {
      if (r.data?.length) setLiveEmployees(r.data.map((e: any) => ({
        id: e._id,
        employeeId: e.employeeId || e._id,
        name: e.name || "",
        department: e.department || "",
        designation: e.designation || "",
        phone: e.phone || "",
        email: e.email || "",
        joiningDate: e.joiningDate || "",
        status: e.status || "Active",
        shift: e.shift || "",
      })));
    }).catch(() => {});

    hrmsApi.listLeaves().then(r => {
      if (r.data?.length) setLiveLeaves(r.data.map((l: any) => ({
        id: l._id,
        employee: { name: l.employee?.name || "" },
        type: l.type || "",
        startDate: l.startDate || "",
        endDate: l.endDate || "",
        reason: l.reason || "",
        status: l.status || "Pending",
        approvedBy: l.approvedBy || "",
        createdAt: l.createdAt || "",
      })));
    }).catch(() => {});
  }, []);

  const breadcrumb = useMemo(() => {
    const crumb = ["HRMS"];
    const nav = NAV.find((n) => n.id === screen);
    if (nav) crumb.push(nav.label);
    if (selectedEmployee && screen === "employee-profile") {
      const emp = liveEmployees.find((e) => e.id === selectedEmployee);
      if (emp) crumb.splice(2, 0, emp.name);
    }
    return crumb;
  }, [screen, selectedEmployee]);

  return (
    <Shell
      nav={NAV}
      sectionLabel="Human Resources"
      activeId={screen}
      isActive={(id) => id === screen}
      onNavigate={setScreen}
      breadcrumb={breadcrumb}
      roleName={roleName}
      onSignOut={onSignOut}
      workspace="hrms"
      onSwitchWorkspace={onSwitchWorkspace}
      onOpenSettings={onOpenSettings}
      searchPlaceholder="Search employees, departments…"
    >
      {screen === "hr-dashboard" && <HRDashboard onNavigate={setScreen} />}
      {screen === "employees" && <EmployeeDirectory onNavigate={setScreen} onSelectEmployee={setSelectedEmployee} employees={liveEmployees} />}
      {screen === "employee-profile" && <EmployeeProfile employeeId={selectedEmployee ?? "EMP-001"} onNavigate={setScreen} employees={liveEmployees} />}
      {screen === "recruitment" && <Recruitment />}
      {screen === "applicant-tracking" && <ApplicantTracking />}
      {screen === "onboarding" && <OnboardingScreen employees={liveEmployees} />}
      {screen === "credentialing" && <CredentialingScreen />}
      {screen === "attendance" && <AttendanceScreen />}
      {screen === "shift-scheduling" && <ShiftScheduling />}
      {screen === "leave-management" && <LeaveManagement leaves={liveLeaves} />}
      {screen === "payroll" && <PayrollOverview />}
      {screen === "training" && <TrainingScreen />}
      {screen === "performance" && <PerformanceScreen />}
      {screen === "staff-health" && <StaffHealthScreen employees={liveEmployees} />}
      {screen === "incident-reporting" && <IncidentReporting />}
      {screen === "exit-management" && <ExitManagement employees={liveEmployees} />}
      {screen === "hr-analytics" && <HRAnalytics />}
      {screen === "workflow-complete" && <WorkflowComplete onNavigate={setScreen} />}
    </Shell>
  );
}

/* ── 01. HR Dashboard ─────────────────────────────────────────────────────── */
function HRDashboard({ onNavigate }: { onNavigate: (s: string) => void }) {
  const k = HR_KPI;
  return (
    <div className="space-y-6">
      <PageHeader title="HR Dashboard" subtitle="Hospital workforce management overview" icon={LayoutDashboard}
        actions={<><Button variant="outline" size="sm"><Download className="size-4 mr-1.5" />Export Report</Button><Button size="sm" onClick={() => onNavigate("recruitment")}><Plus className="size-4 mr-1.5" />New Position</Button></>} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard icon={Users} label="Total Employees" value={k.totalEmployees} trend="up" trendValue="+12 this month" tone="blue" />
        <KPICard icon={Stethoscope} label="Doctors" value={k.doctors} tone="green" />
        <KPICard icon={Heart} label="Nurses" value={k.nurses} tone="purple" />
        <KPICard icon={Users} label="Support Staff" value={k.supportStaff} tone="cyan" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard icon={Briefcase} label="Open Positions" value={k.openPositions} tone="amber" sub={`${k.vacantPositions} vacant`} />
        <KPICard icon={Clock} label="Attendance Today" value={`${k.attendanceToday}%`} trend="up" trendValue="+1.2%" tone="green" />
        <KPICard icon={CalendarDays} label="Pending Leaves" value={k.pendingLeaves} tone="warning" sub="Awaiting approval" />
        <KPICard icon={Award} label="Expiring Licenses" value={k.expiringLicenses} tone="red" sub={`${k.expiringSoon} expiring soon`} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[var(--text-primary,#172B4D)]">Department Headcount</h3>
            <Button variant="ghost" size="sm" onClick={() => onNavigate("hr-analytics")}>Details <ChevronRight className="size-4 ml-1" /></Button>
          </div>
          <div className="space-y-3">
            {DEPARTMENTS.slice(0, 8).map((d) => (
              <div key={d.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="text-sm text-[var(--text-primary,#172B4D)] truncate w-32">{d.name}</span>
                  <HealthBar value={d.employeeCount} max={200} showValue={false} />
                </div>
                <span className="text-sm font-medium text-[var(--text-primary,#172B4D)] ml-3">{d.employeeCount}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] p-4 shadow-sm">
            <h4 className="font-semibold text-[var(--text-primary,#172B4D)] mb-3">Workforce KPIs</h4>
            <div className="space-y-3">
              {[
                { label: "Avg Tenure", value: `${k.avgTenure} years`, color: "text-[var(--text-primary,#172B4D)]" },
                { label: "Turnover Rate", value: `${k.turnoverRate}%`, color: "text-amber-600" },
                { label: "Absenteeism", value: `${k.absenteeismRate}%`, color: "text-[var(--text-primary,#172B4D)]" },
                { label: "Training Compliance", value: `${k.trainingCompliance}%`, color: "text-emerald-600" },
                { label: "Credential Compliance", value: `${k.credentialCompliance}%`, color: "text-emerald-600" },
                { label: "Satisfaction", value: `${k.employeeSatisfaction}/5`, color: "text-[var(--text-primary,#172B4D)]" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between text-sm">
                  <span className="text-[var(--text-secondary,#6B778C)]">{item.label}</span>
                  <span className={`font-medium ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] p-4 shadow-sm">
            <h4 className="font-semibold text-[var(--text-primary,#172B4D)] mb-3">Quick Actions</h4>
            <div className="space-y-2">
              <button onClick={() => onNavigate("employees")} className="flex w-full items-center gap-3 rounded-lg border border-[var(--border,#DFE1E6)] p-3 text-left text-sm hover:bg-gray-50 transition-colors">
                <Users className="size-4 text-[#0052CC]" />Employee Directory
              </button>
              <button onClick={() => onNavigate("recruitment")} className="flex w-full items-center gap-3 rounded-lg border border-[var(--border,#DFE1E6)] p-3 text-left text-sm hover:bg-gray-50 transition-colors">
                <Briefcase className="size-4 text-[#0052CC]" />Recruitment
              </button>
              <button onClick={() => onNavigate("attendance")} className="flex w-full items-center gap-3 rounded-lg border border-[var(--border,#DFE1E6)] p-3 text-left text-sm hover:bg-gray-50 transition-colors">
                <Clock className="size-4 text-[#0052CC]" />Attendance
              </button>
              <button onClick={() => onNavigate("hr-analytics")} className="flex w-full items-center gap-3 rounded-lg border border-[var(--border,#DFE1E6)] p-3 text-left text-sm hover:bg-gray-50 transition-colors">
                <BarChart3 className="size-4 text-[#0052CC]" />Analytics
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-[var(--text-primary,#172B4D)]">Upcoming Training</h3>
            <Button variant="ghost" size="sm" onClick={() => onNavigate("training")}>View All <ChevronRight className="size-4 ml-1" /></Button>
          </div>
          <div className="space-y-2">
            {TRAININGS.filter((t) => t.status !== "Completed").slice(0, 4).map((t) => (
              <div key={t.id} className="flex items-center justify-between rounded-lg border border-[var(--border,#DFE1E6)] p-3">
                <div>
                  <div className="text-sm font-medium text-[var(--text-primary,#172B4D)]">{t.title}</div>
                  <div className="text-xs text-[var(--text-secondary,#6B778C)]">{t.startDate} · {t.duration}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-[var(--text-primary,#172B4D)]">{t.enrolled}/{t.capacity}</div>
                  <div className="text-[10px] text-[var(--text-secondary,#6B778C)]">enrolled</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-[var(--text-primary,#172B4D)]">Expiring Credentials</h3>
            <Button variant="ghost" size="sm" onClick={() => onNavigate("credentialing")}>View All <ChevronRight className="size-4 ml-1" /></Button>
          </div>
          <div className="space-y-2">
            {CREDENTIALS.filter((c) => c.status !== "Valid").slice(0, 4).map((c) => (
              <div key={c.id} className="flex items-center justify-between rounded-lg border border-[var(--border,#DFE1E6)] p-3">
                <div>
                  <div className="text-sm font-medium text-[var(--text-primary,#172B4D)]">{c.employeeName}</div>
                  <div className="text-xs text-[var(--text-secondary,#6B778C)]">{c.name} · {c.type}</div>
                </div>
                <StatusPill label={c.status} tone={credentialStatusTone(c.status)} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── 02. Employee Directory ───────────────────────────────────────────────── */
function EmployeeDirectory({ onNavigate, onSelectEmployee, employees }: { onNavigate: (s: string) => void; onSelectEmployee: (id: string) => void; employees: typeof EMPLOYEES }) {
  const [search, setSearch] = useState("");
  const filtered = employees.filter((e) => e.name.toLowerCase().includes(search.toLowerCase()) || e.department.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="space-y-6">
      <PageHeader title="Employee Directory" subtitle="Manage hospital workforce" icon={Users}
        breadcrumb={["HRMS", "Employees"]}
        actions={<><Button variant="outline" size="sm"><Download className="size-4 mr-1.5" />Export</Button><Button variant="outline" size="sm"><UserPlus className="size-4 mr-1.5" />Bulk Import</Button><Button size="sm"><Plus className="size-4 mr-1.5" />Add Employee</Button></>} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard icon={Users} label="Total Employees" value={HR_KPI.totalEmployees} tone="blue" />
        <KPICard icon={CheckCircle2} label="Active" value={employees.filter((e) => e.status === "Active").length} tone="green" />
        <KPICard icon={AlertTriangle} label="On Notice" value={employees.filter((e) => e.status === "On Notice").length} tone="amber" />
        <KPICard icon={Info} label="Probation" value={employees.filter((e) => e.status === "Probation").length} tone="info" />
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--text-secondary,#6B778C)]" />
          <Input placeholder="Search employees…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Button variant="outline" size="sm"><Filter className="size-4 mr-1.5" />Filters</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((emp) => (
          <EmployeeCard key={emp.id} employee={emp} onClick={() => { onSelectEmployee(emp.id); onNavigate("employee-profile"); }} />
        ))}
      </div>
    </div>
  );
}

/* ── 03. Employee Profile ─────────────────────────────────────────────────── */
function EmployeeProfile({ employeeId, onNavigate, employees }: { employeeId: string; onNavigate: (s: string) => void; employees: typeof EMPLOYEES }) {
  const emp = employees.find((e) => e.id === employeeId) ?? employees[0];
  const empCredentials = CREDENTIALS.filter((c) => c.employeeId === emp.id);
  const empPerformance = PERFORMANCE.find((p) => p.employeeId === emp.id);
  const empAttendance = ATTENDANCE.filter((a) => a.employeeId === emp.id);
  return (
    <div className="space-y-6">
      <PageHeader title={emp.name} subtitle={`${emp.designation} · ${emp.department}`} icon={Users}
        breadcrumb={["HRMS", "Employees", emp.name]}
        actions={<><Button variant="outline" size="sm"><Edit3 className="size-4 mr-1.5" />Edit</Button><Button variant="outline" size="sm"><Download className="size-4 mr-1.5" />Export</Button></>} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="grid size-20 place-items-center rounded-2xl text-2xl font-bold text-white" style={{ backgroundColor: emp.profileColor }}>{emp.avatar}</div>
              <div>
                <h2 className="text-xl font-bold text-[var(--text-primary,#172B4D)]">{emp.name}</h2>
                <div className="text-sm text-[var(--text-secondary,#6B778C)]">{emp.designation} · {emp.department}</div>
                <div className="flex items-center gap-2 mt-1">
                  <StatusPill label={emp.status} tone={empStatusTone(emp.status)} />
                  <span className="text-xs text-[var(--text-secondary,#6B778C)]">{emp.employeeId}</span>
                </div>
              </div>
            </div>
          </div>

          <Section title="Personal Information" subtitle="Employee personal details">
            <div className="grid gap-4 sm:grid-cols-2 rounded-xl border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] p-5 shadow-sm">
              {[
                { label: "Date of Birth", value: emp.dob },
                { label: "Gender", value: emp.gender },
                { label: "Blood Group", value: emp.bloodGroup },
                { label: "Marital Status", value: emp.maritalStatus },
                { label: "Phone", value: emp.phone },
                { label: "Email", value: emp.email },
                { label: "Address", value: emp.address },
                { label: "City, State", value: `${emp.city}, ${emp.state} ${emp.pincode}` },
                { label: "Emergency Contact", value: emp.emergencyContact },
                { label: "Emergency Phone", value: emp.emergencyPhone },
              ].map((item) => (
                <div key={item.label}>
                  <div className="text-xs text-[var(--text-secondary,#6B778C)]">{item.label}</div>
                  <div className="text-sm font-medium text-[var(--text-primary,#172B4D)]">{item.value}</div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Employment Details" subtitle="Current employment information">
            <div className="grid gap-4 sm:grid-cols-2 rounded-xl border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] p-5 shadow-sm">
              {[
                { label: "Department", value: emp.department },
                { label: "Designation", value: emp.designation },
                { label: "Employment Type", value: emp.employmentType },
                { label: "Date of Joining", value: emp.dateOfJoining },
                { label: "Reporting Manager", value: emp.reportingManager },
                { label: "Location", value: emp.location },
                { label: "Floor", value: emp.floor },
                { label: "Experience", value: `${emp.experience} years` },
                { label: "Base Salary", value: formatCurrencyFull(emp.baseSalary) },
                { label: "Probation End", value: emp.probationEnd ?? "N/A" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="text-xs text-[var(--text-secondary,#6B778C)]">{item.label}</div>
                  <div className="text-sm font-medium text-[var(--text-primary,#172B4D)]">{item.value}</div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Qualifications" subtitle="Education and certifications">
            <div className="flex flex-wrap gap-2 rounded-xl border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] p-5 shadow-sm">
              {emp.qualifications.map((q) => (
                <span key={q} className="rounded-lg bg-[#0052CC]/10 px-3 py-1.5 text-sm font-medium text-[#0052CC]">{q}</span>
              ))}
            </div>
          </Section>

          {empCredentials.length > 0 && (
            <Section title="Credentials" subtitle="Licenses and certifications">
              <div className="grid gap-4 sm:grid-cols-2">
                {empCredentials.map((c) => <CredentialCard key={c.id} credential={c} />)}
              </div>
            </Section>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] p-4 shadow-sm">
            <h4 className="font-semibold text-[var(--text-primary,#172B4D)] mb-3">Employment Timeline</h4>
            <div className="space-y-3">
              {[
                { date: emp.dateOfJoining, event: "Joined as " + emp.designation, icon: UserPlus, color: "text-emerald-500" },
                { date: "2024-01-01", event: "Promoted to " + emp.designation, icon: Award, color: "text-[#0052CC]" },
                { date: "2025-06-15", event: "Annual appraisal — Exceeds", icon: Target, color: "text-purple-500" },
                { date: "2026-01-10", event: "Salary revision", icon: Banknote, color: "text-amber-500" },
              ].map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <item.icon className={`size-4 ${item.color}`} />
                    {i < 3 && <div className="w-px flex-1 bg-gray-200 mt-1" />}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[var(--text-primary,#172B4D)]">{item.event}</div>
                    <div className="text-xs text-[var(--text-secondary,#6B778C)]">{item.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {empPerformance && (
            <div className="rounded-xl border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] p-4 shadow-sm">
              <h4 className="font-semibold text-[var(--text-primary,#172B4D)] mb-3">Latest Review</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--text-secondary,#6B778C)]">Rating</span>
                  <StatusPill label={empPerformance.overallRating} tone={performanceRatingTone(empPerformance.overallRating)} />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--text-secondary,#6B778C)]">KPI Score</span>
                  <span className="font-medium text-[var(--text-primary,#172B4D)]">{empPerformance.kpiScore}/100</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--text-secondary,#6B778C)]">Period</span>
                  <span className="text-[var(--text-primary,#172B4D)]">{empPerformance.reviewPeriod}</span>
                </div>
                {empPerformance.promotionRecommended && <div className="rounded bg-purple-50 p-2 text-xs font-medium text-purple-600 text-center mt-2">Promotion Recommended</div>}
              </div>
            </div>
          )}

          <div className="rounded-xl border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] p-4 shadow-sm">
            <h4 className="font-semibold text-[var(--text-primary,#172B4D)] mb-3">Recent Attendance</h4>
            <div className="space-y-2">
              {empAttendance.slice(0, 5).map((a) => (
                <div key={a.id} className="flex items-center justify-between text-sm">
                  <span className="text-[var(--text-secondary,#6B778C)]">{a.date}</span>
                  <StatusPill label={a.status} tone={a.status === "Present" ? "success" : a.status === "Late" ? "warning" : a.status === "On Leave" ? "info" : "danger"} />
                  <span className="text-xs text-[var(--text-primary,#172B4D)]">{a.clockIn || "—"}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── 04. Recruitment ──────────────────────────────────────────────────────── */
function Recruitment() {
  return (
    <div className="space-y-6">
      <PageHeader title="Recruitment" subtitle="Job openings and hiring pipeline" icon={Briefcase}
        breadcrumb={["HRMS", "Recruitment"]}
        actions={<><Button variant="outline" size="sm"><Download className="size-4 mr-1.5" />Export</Button><Button size="sm"><Plus className="size-4 mr-1.5" />Post Job</Button></>} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard icon={Briefcase} label="Open Positions" value={JOB_OPENINGS.filter((j) => j.status === "Open").length} tone="blue" />
        <KPICard icon={Users} label="Total Applicants" value={JOB_OPENINGS.reduce((a, j) => a + j.applicants, 0)} tone="green" />
        <KPICard icon={ClipboardList} label="Interviewed" value={JOB_OPENINGS.reduce((a, j) => a + j.interviewed, 0)} tone="purple" />
        <KPICard icon={CheckCircle2} label="Offered" value={JOB_OPENINGS.reduce((a, j) => a + j.offered, 0)} tone="cyan" />
      </div>

      <div className="space-y-4">
        {JOB_OPENINGS.map((job) => (
          <div key={job.id} className="rounded-xl border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[var(--text-primary,#172B4D)]">{job.title}</span>
                  <StatusPill label={job.status} tone={jobStatusTone(job.status)} />
                  <StatusPill label={job.priority} tone={job.priority === "Critical" ? "danger" : job.priority === "High" ? "warning" : "info"} />
                </div>
                <div className="text-xs text-[var(--text-secondary,#6B778C)] mt-0.5">{job.department} · {job.hiringManager} · {job.type} · {job.salaryRange}</div>
              </div>
              <Button variant="ghost" size="icon" className="size-7"><MoreHorizontal className="size-4" /></Button>
            </div>
            <p className="mt-2 text-sm text-[var(--text-secondary,#6B778C)]">{job.description}</p>
            <div className="mt-3 flex flex-wrap gap-1">
              {job.requirements.map((r) => <span key={r} className="rounded bg-gray-100 px-2 py-0.5 text-[10px] text-[var(--text-secondary,#6B778C)]">{r}</span>)}
            </div>
            <div className="mt-3 grid grid-cols-4 gap-3 text-center text-xs">
              <div className="rounded-lg bg-gray-50 p-2"><div className="font-bold text-[var(--text-primary,#172B4D)]">{job.applicants}</div><div className="text-[var(--text-secondary,#6B778C)]">Applied</div></div>
              <div className="rounded-lg bg-gray-50 p-2"><div className="font-bold text-[var(--text-primary,#172B4D)]">{job.shortlisted}</div><div className="text-[var(--text-secondary,#6B778C)]">Shortlisted</div></div>
              <div className="rounded-lg bg-gray-50 p-2"><div className="font-bold text-[var(--text-primary,#172B4D)]">{job.interviewed}</div><div className="text-[var(--text-secondary,#6B778C)]">Interviewed</div></div>
              <div className="rounded-lg bg-gray-50 p-2"><div className="font-bold text-[var(--text-primary,#172B4D)]">{job.offered}</div><div className="text-[var(--text-secondary,#6B778C)]">Offered</div></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── 05. Applicant Tracking ───────────────────────────────────────────────── */
function ApplicantTracking() {
  return (
    <div className="space-y-6">
      <PageHeader title="Applicant Tracking" subtitle="Manage job applications and candidates" icon={ClipboardList}
        breadcrumb={["HRMS", "Recruitment", "Applicants"]}
        actions={<Button variant="outline" size="sm"><Download className="size-4 mr-1.5" />Export</Button>} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {["Applied", "Screening", "Interview", "Offer", "Hired"].map((stage) => {
          const count = APPLICANTS.filter((a) => a.status === stage).length;
          return (
            <div key={stage} className="rounded-xl border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] p-4 shadow-sm text-center">
              <div className="text-2xl font-bold text-[var(--text-primary,#172B4D)]">{count}</div>
              <div className="text-xs text-[var(--text-secondary,#6B778C)]">{stage}</div>
            </div>
          );
        })}
      </div>

      <div className="space-y-3">
        {APPLICANTS.map((app) => {
          const job = JOB_OPENINGS.find((j) => j.id === app.jobId);
          return (
            <div key={app.id} className="rounded-xl border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[var(--text-primary,#172B4D)]">{app.name}</span>
                    <StatusPill label={app.status} tone={applicationStatusTone(app.status)} />
                  </div>
                  <div className="text-xs text-[var(--text-secondary,#6B778C)]">{job?.title ?? app.jobId} · {app.experience} yrs exp · {app.source}</div>
                </div>
                <div className="flex items-center gap-3">
                  {app.resumeScore > 0 && <div className="text-center"><div className="text-sm font-bold text-[var(--text-primary,#172B4D)]">{app.resumeScore}</div><div className="text-[10px] text-[var(--text-secondary,#6B778C)]">Resume</div></div>}
                  {app.interviewScore && <div className="text-center"><div className="text-sm font-bold text-[var(--text-primary,#172B4D)]">{app.interviewScore}</div><div className="text-[10px] text-[var(--text-secondary,#6B778C)]">Interview</div></div>}
                  <Button variant="ghost" size="icon" className="size-7"><Eye className="size-3.5" /></Button>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {app.qualifications.map((q) => <span key={q} className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-[var(--text-secondary,#6B778C)]">{q}</span>)}
              </div>
              {app.notes && <p className="mt-2 text-xs text-[var(--text-secondary,#6B778C)] italic">"{app.notes}"</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── 06. Onboarding ───────────────────────────────────────────────────────── */
function OnboardingScreen({ employees }: { employees: typeof EMPLOYEES }) {
  return (
    <div className="space-y-6">
      <PageHeader title="Onboarding" subtitle="New employee onboarding management" icon={FileCheck}
        breadcrumb={["HRMS", "Onboarding"]}
        actions={<Button size="sm"><Plus className="size-4 mr-1.5" />Start Onboarding</Button>} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard icon={FileCheck} label="Total Onboardings" value={ONBOARDINGS.length} tone="blue" />
        <KPICard icon={CheckCircle2} label="Completed" value={ONBOARDINGS.filter((o) => o.status === "Completed").length} tone="green" />
        <KPICard icon={Clock} label="In Progress" value={ONBOARDINGS.filter((o) => o.status === "In Progress").length} tone="info" />
        <KPICard icon={AlertTriangle} label="Overdue" value={ONBOARDINGS.filter((o) => o.status === "Overdue").length} tone="red" />
      </div>

      <div className="space-y-4">
        {ONBOARDINGS.map((onb) => {
          const emp = employees.find((e) => e.id === onb.employeeId);
          const completedCount = onb.checklist.filter((c) => c.done).length;
          return (
            <div key={onb.id} className="rounded-xl border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid size-12 place-items-center rounded-xl text-sm font-bold text-white" style={{ backgroundColor: emp?.profileColor ?? "#0052CC" }}>{emp?.avatar ?? "?"}</div>
                  <div>
                    <div className="font-semibold text-[var(--text-primary,#172B4D)]">{onb.employeeName}</div>
                    <div className="text-xs text-[var(--text-secondary,#6B778C)]">{onb.designation} · {onb.department} · Joined {onb.dateOfJoining}</div>
                  </div>
                </div>
                <StatusPill label={onb.status} tone={onb.status === "Completed" ? "success" : onb.status === "In Progress" ? "info" : "danger"} />
              </div>
              <div className="mt-4">
                <HealthBar value={completedCount} max={onb.checklist.length} label={`Checklist: ${completedCount}/${onb.checklist.length} completed`} />
              </div>
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
                {onb.checklist.map((c, i) => (
                  <div key={i} className={`flex items-center gap-1.5 text-xs ${c.done ? "text-emerald-600" : "text-[var(--text-secondary,#6B778C)]"}`}>
                    {c.done ? <CheckCircle2 className="size-3.5" /> : <span className="size-3.5 rounded-full border border-gray-300" />}
                    {c.item}
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-4 text-xs text-[var(--text-secondary,#6B778C)]">
                {onb.itAssets.length > 0 && <span>IT Assets: {onb.itAssets.join(", ")}</span>}
                <span>Email: {onb.emailCreated ? "Created" : "Pending"}</span>
                <span>Orientation: {onb.orientationDate}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── 07. Credentialing ────────────────────────────────────────────────────── */
function CredentialingScreen() {
  return (
    <div className="space-y-6">
      <PageHeader title="Credentialing" subtitle="License and certification management" icon={Award}
        breadcrumb={["HRMS", "Credentialing"]}
        actions={<><Button variant="outline" size="sm"><Download className="size-4 mr-1.5" />Export</Button><Button size="sm"><Plus className="size-4 mr-1.5" />Add Credential</Button></>} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard icon={Award} label="Total Credentials" value={CREDENTIALS.length} tone="blue" />
        <KPICard icon={CheckCircle2} label="Valid" value={CREDENTIALS.filter((c) => c.status === "Valid").length} tone="green" />
        <KPICard icon={AlertTriangle} label="Expiring Soon" value={CREDENTIALS.filter((c) => c.status === "Expiring Soon").length} tone="amber" />
        <KPICard icon={AlertCircle} label="Expired" value={CREDENTIALS.filter((c) => c.status === "Expired").length} tone="red" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CREDENTIALS.map((c) => <CredentialCard key={c.id} credential={c} />)}
      </div>
    </div>
  );
}

/* ── 08. Attendance ───────────────────────────────────────────────────────── */
function AttendanceScreen() {
  return (
    <div className="space-y-6">
      <PageHeader title="Attendance" subtitle="Daily attendance and time tracking" icon={Clock}
        breadcrumb={["HRMS", "Attendance"]}
        actions={<><Button variant="outline" size="sm"><Download className="size-4 mr-1.5" />Export</Button><Button variant="outline" size="sm"><RefreshCw className="size-4 mr-1.5" />Sync Biometric</Button></>} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard icon={CheckCircle2} label="Present Today" value={ATTENDANCE.filter((a) => a.status === "Present" || a.status === "Late").length} tone="green" />
        <KPICard icon={AlertTriangle} label="Late Arrivals" value={ATTENDANCE.filter((a) => a.status === "Late").length} tone="amber" />
        <KPICard icon={CalendarDays} label="On Leave" value={ATTENDANCE.filter((a) => a.status === "On Leave").length} tone="info" />
        <KPICard icon={Clock} label="Overtime Hours" value={ATTENDANCE.reduce((a, r) => a + r.overtime, 0).toFixed(1)} tone="purple" />
      </div>

      <div className="rounded-xl border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border,#DFE1E6)] bg-gray-50/50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary,#6B778C)]">Employee</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary,#6B778C)]">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary,#6B778C)]">Clock In</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary,#6B778C)]">Clock Out</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary,#6B778C)]">Hours</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary,#6B778C)]">Overtime</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary,#6B778C)]">Late</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary,#6B778C)]">Shift</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary,#6B778C)]">Status</th>
              </tr>
            </thead>
            <tbody>
              {ATTENDANCE.map((a) => (
                <tr key={a.id} className="border-b border-[var(--border,#DFE1E6)] last:border-0 hover:bg-gray-50/50">
                  <td className="px-4 py-3 font-medium text-[var(--text-primary,#172B4D)]">{a.employeeName}</td>
                  <td className="px-4 py-3 text-[var(--text-primary,#172B4D)]">{a.date}</td>
                  <td className="px-4 py-3 text-[var(--text-primary,#172B4D)]">{a.clockIn || "—"}</td>
                  <td className="px-4 py-3 text-[var(--text-primary,#172B4D)]">{a.clockOut || "—"}</td>
                  <td className="px-4 py-3 text-[var(--text-primary,#172B4D)]">{a.hoursWorked}h</td>
                  <td className="px-4 py-3 text-[var(--text-primary,#172B4D)]">{a.overtime > 0 ? `${a.overtime}h` : "—"}</td>
                  <td className="px-4 py-3 text-[var(--text-primary,#172B4D)]">{a.lateMinutes > 0 ? `${a.lateMinutes}m` : "—"}</td>
                  <td className="px-4 py-3"><ShiftBadge shift={a.shift} /></td>
                  <td className="px-4 py-3"><StatusPill label={a.status} tone={a.status === "Present" ? "success" : a.status === "Late" ? "warning" : a.status === "On Leave" ? "info" : "danger"} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ── 09. Shift Scheduling ─────────────────────────────────────────────────── */
function ShiftScheduling() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return (
    <div className="space-y-6">
      <PageHeader title="Shift Scheduling" subtitle="Roster management and shift planning" icon={Calendar}
        breadcrumb={["HRMS", "Shifts"]}
        actions={<><Button variant="outline" size="sm"><Download className="size-4 mr-1.5" />Export</Button><Button size="sm"><Plus className="size-4 mr-1.5" />Add Shift</Button></>} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {SHIFTS.map((s) => (
          <div key={s.id} className="rounded-xl border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="size-3 rounded-full" style={{ backgroundColor: s.color }} />
              <span className="font-medium text-[var(--text-primary,#172B4D)]">{s.name}</span>
            </div>
            <div className="text-xs text-[var(--text-secondary,#6B778C)]">{s.startTime} — {s.endTime}</div>
            <div className="text-xs text-[var(--text-secondary,#6B778C)]">{s.breakMinutes} min break</div>
            <div className="mt-2 text-sm font-bold text-[var(--text-primary,#172B4D)]">{SHIFT_ROSTER.filter((r) => r.shiftId === s.id).length} staff</div>
          </div>
        ))}
      </div>

      <Section title="Roster — This Week" subtitle="Shift assignments for the week">
        <div className="rounded-xl border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border,#DFE1E6)] bg-gray-50/50">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary,#6B778C)]">Employee</th>
                  {days.map((d) => <th key={d} className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary,#6B778C)]">{d}</th>)}
                </tr>
              </thead>
              <tbody>
                {SHIFT_ROSTER.map((r) => {
                  const shift = SHIFTS.find((s) => s.id === r.shiftId);
                  return (
                    <tr key={r.id} className="border-b border-[var(--border,#DFE1E6)] last:border-0 hover:bg-gray-50/50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-[var(--text-primary,#172B4D)]">{r.employeeName}</div>
                        <div className="text-xs text-[var(--text-secondary,#6B778C)]">{r.department}</div>
                      </td>
                      {days.map((d, i) => (
                        <td key={d} className="px-3 py-3 text-center">
                          {i < 5 ? <ShiftBadge shift={shift?.name ?? "Off"} /> : <span className="text-xs text-[var(--text-secondary,#6B778C)]">Off</span>}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </Section>
    </div>
  );
}

/* ── 10. Leave Management ─────────────────────────────────────────────────── */
function LeaveManagement({ leaves }: { leaves: typeof LEAVE_REQUESTS }) {
  return (
    <div className="space-y-6">
      <PageHeader title="Leave Management" subtitle="Leave requests, balances & approvals" icon={CalendarDays}
        breadcrumb={["HRMS", "Leaves"]}
        actions={<><Button variant="outline" size="sm"><Download className="size-4 mr-1.5" />Export</Button><Button size="sm"><Plus className="size-4 mr-1.5" />Apply Leave</Button></>} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard icon={CalendarDays} label="Total Requests" value={leaves.length} tone="blue" />
        <KPICard icon={Clock} label="Pending" value={leaves.filter((l) => l.status === "Pending").length} tone="amber" />
        <KPICard icon={CheckCircle2} label="Approved" value={leaves.filter((l) => l.status === "Approved").length} tone="green" />
        <KPICard icon={AlertCircle} label="Rejected" value={leaves.filter((l) => l.status === "Rejected").length} tone="red" />
      </div>

      <div className="space-y-4">
        {leaves.map((l) => <LeaveCard key={l.id} leave={l} />)}
      </div>
    </div>
  );
}

/* ── 11. Payroll Overview ─────────────────────────────────────────────────── */
function PayrollOverview() {
  return (
    <div className="space-y-6">
      <PageHeader title="Payroll Overview" subtitle="Salary, payslips & compensation" icon={Banknote}
        breadcrumb={["HRMS", "Payroll"]}
        actions={<><Button variant="outline" size="sm"><Download className="size-4 mr-1.5" />Export Payslips</Button><Button size="sm"><Banknote className="size-4 mr-1.5" />Process Payroll</Button></>} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard icon={Banknote} label="Total Payroll" value={formatCurrencyFull(HR_KPI.totalPayroll)} tone="blue" sub="July 2026" />
        <KPICard icon={CheckCircle2} label="Processed" value={PAYSLIPS.filter((p) => p.status === "Processed" || p.status === "Paid").length} tone="green" />
        <KPICard icon={Clock} label="Processing" value={PAYSLIPS.filter((p) => p.status === "Processing").length} tone="info" />
        <KPICard icon={Edit3} label="Draft" value={PAYSLIPS.filter((p) => p.status === "Draft").length} tone="warning" />
      </div>

      <div className="rounded-xl border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border,#DFE1E6)] bg-gray-50/50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary,#6B778C)]">Employee</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary,#6B778C)]">Dept</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary,#6B778C)]">Basic</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary,#6B778C)]">Earnings</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary,#6B778C)]">Deductions</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary,#6B778C)]">Net Pay</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary,#6B778C)]">Status</th>
              </tr>
            </thead>
            <tbody>
              {PAYSLIPS.map((p) => (
                <tr key={p.id} className="border-b border-[var(--border,#DFE1E6)] last:border-0 hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-[var(--text-primary,#172B4D)]">{p.employeeName}</div>
                    <div className="text-xs text-[var(--text-secondary,#6B778C)]">{p.designation}</div>
                  </td>
                  <td className="px-4 py-3 text-[var(--text-primary,#172B4D)]">{p.department}</td>
                  <td className="px-4 py-3 text-right text-[var(--text-primary,#172B4D)]">{formatCurrencyFull(p.basic)}</td>
                  <td className="px-4 py-3 text-right text-emerald-600">{formatCurrencyFull(p.grossEarnings)}</td>
                  <td className="px-4 py-3 text-right text-red-600">{formatCurrencyFull(p.totalDeductions)}</td>
                  <td className="px-4 py-3 text-right font-bold text-[var(--text-primary,#172B4D)]">{formatCurrencyFull(p.netPay)}</td>
                  <td className="px-4 py-3"><StatusPill label={p.status} tone={payrollStatusTone(p.status)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ── 12. Training & CME ──────────────────────────────────────────────────── */
function TrainingScreen() {
  return (
    <div className="space-y-6">
      <PageHeader title="Training & CME" subtitle="Mandatory training, CME credits & certifications" icon={GraduationCap}
        breadcrumb={["HRMS", "Training"]}
        actions={<><Button variant="outline" size="sm"><Download className="size-4 mr-1.5" />Export</Button><Button size="sm"><Plus className="size-4 mr-1.5" />Create Training</Button></>} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard icon={GraduationCap} label="Total Programs" value={TRAININGS.length} tone="blue" />
        <KPICard icon={CheckCircle2} label="Completed" value={TRAININGS.filter((t) => t.status === "Completed").length} tone="green" />
        <KPICard icon={Clock} label="Upcoming" value={TRAININGS.filter((t) => t.status === "Enrolled").length} tone="info" />
        <KPICard icon={Award} label="Total CME Credits" value={TRAININGS.reduce((a, t) => a + (t.credits ?? 0), 0)} tone="purple" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TRAININGS.map((t) => <TrainingCard key={t.id} training={t} />)}
      </div>
    </div>
  );
}

/* ── 13. Performance Management ───────────────────────────────────────────── */
function PerformanceScreen() {
  return (
    <div className="space-y-6">
      <PageHeader title="Performance Management" subtitle="Appraisals, goals & 360° feedback" icon={Target}
        breadcrumb={["HRMS", "Performance"]}
        actions={<><Button variant="outline" size="sm"><Download className="size-4 mr-1.5" />Export</Button><Button size="sm"><Plus className="size-4 mr-1.5" />Start Review</Button></>} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard icon={Target} label="Reviews Completed" value={PERFORMANCE.filter((p) => p.status === "Completed").length} tone="blue" />
        <KPICard icon={Star} label="Exceptional" value={PERFORMANCE.filter((p) => p.overallRating === "Exceptional").length} tone="green" />
        <KPICard icon={TrendingUp} label="Promotion Recommended" value={PERFORMANCE.filter((p) => p.promotionRecommended).length} tone="purple" />
        <KPICard icon={Clock} label="In Progress" value={PERFORMANCE.filter((p) => p.status !== "Completed").length} tone="info" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {PERFORMANCE.map((p) => <PerformanceCard key={p.id} record={p} />)}
      </div>

      <Section title="Goal Details" subtitle="Individual performance breakdown">
        {PERFORMANCE.slice(0, 2).map((p) => (
          <div key={p.id} className="rounded-xl border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-semibold text-[var(--text-primary,#172B4D)]">{p.employeeName}</div>
                <div className="text-xs text-[var(--text-secondary,#6B778C)]">{p.reviewPeriod} · Reviewer: {p.reviewerName}</div>
              </div>
              <StatusPill label={p.overallRating} tone={performanceRatingTone(p.overallRating)} />
            </div>
            <div className="space-y-3">
              {p.goals.map((g, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-[var(--text-primary,#172B4D)]">{g.name}</span>
                      <span className="text-xs text-[var(--text-secondary,#6B778C)]">Weight: {g.weight}%</span>
                    </div>
                    <HealthBar value={g.actual} max={g.target} label={`Target: ${g.target} · Actual: ${g.actual}`} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-medium text-emerald-600 mb-1">Strengths</div>
                <div className="flex flex-wrap gap-1">{p.strengths.map((s) => <span key={s} className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] text-emerald-700">{s}</span>)}</div>
              </div>
              <div>
                <div className="text-xs font-medium text-amber-600 mb-1">Improvements</div>
                <div className="flex flex-wrap gap-1">{p.improvements.map((s) => <span key={s} className="rounded bg-amber-50 px-1.5 py-0.5 text-[10px] text-amber-700">{s}</span>)}</div>
              </div>
            </div>
          </div>
        ))}
      </Section>
    </div>
  );
}

/* ── 14. Staff Health ─────────────────────────────────────────────────────── */
function StaffHealthScreen({ employees }: { employees: typeof EMPLOYEES }) {
  return (
    <div className="space-y-6">
      <PageHeader title="Staff Health" subtitle="Vaccinations, fitness & occupational health" icon={Heart}
        breadcrumb={["HRMS", "Staff Health"]}
        actions={<><Button variant="outline" size="sm"><Download className="size-4 mr-1.5" />Export</Button><Button size="sm"><Plus className="size-4 mr-1.5" />Record Checkup</Button></>} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard icon={Heart} label="Health Records" value={STAFF_HEALTH.length} tone="blue" />
        <KPICard icon={CheckCircle2} label="Fit" value={STAFF_HEALTH.filter((s) => s.medicalFitness === "Fit").length} tone="green" />
        <KPICard icon={AlertTriangle} label="Conditional" value={STAFF_HEALTH.filter((s) => s.medicalFitness === "Conditional").length} tone="amber" />
        <KPICard icon={Shield} label="Clearance" value={STAFF_HEALTH.filter((s) => s.healthClearance).length} tone="purple" />
      </div>

      <div className="space-y-4">
        {STAFF_HEALTH.map((sh) => {
          const emp = employees.find((e) => e.id === sh.employeeId);
          return (
            <div key={sh.id} className="rounded-xl border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-lg text-sm font-bold text-white" style={{ backgroundColor: emp?.profileColor ?? "#0052CC" }}>{emp?.avatar ?? "?"}</div>
                  <div>
                    <div className="font-semibold text-[var(--text-primary,#172B4D)]">{sh.employeeName}</div>
                    <div className="text-xs text-[var(--text-secondary,#6B778C)]">{sh.department} · Last checkup: {sh.lastCheckup}</div>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <StatusPill label={sh.medicalFitness} tone={sh.medicalFitness === "Fit" ? "success" : sh.medicalFitness === "Conditional" ? "warning" : "danger"} />
                  {sh.healthClearance && <StatusPill label="Cleared" tone="success" />}
                </div>
              </div>
              <div className="mt-3 grid grid-cols-4 gap-3 text-center text-xs">
                <div className="rounded-lg bg-gray-50 p-2"><div className="font-bold text-[var(--text-primary,#172B4D)]">{sh.bloodPressure}</div><div className="text-[var(--text-secondary,#6B778C)]">BP</div></div>
                <div className="rounded-lg bg-gray-50 p-2"><div className="font-bold text-[var(--text-primary,#172B4D)]">{sh.bloodSugar}</div><div className="text-[var(--text-secondary,#6B778C)]">Sugar</div></div>
                <div className="rounded-lg bg-gray-50 p-2"><div className="font-bold text-[var(--text-primary,#172B4D)]">{sh.bmi}</div><div className="text-[var(--text-secondary,#6B778C)]">BMI</div></div>
                <div className="rounded-lg bg-gray-50 p-2"><div className="font-bold text-[var(--text-primary,#172B4D)]">{sh.exposureIncidents}</div><div className="text-[var(--text-secondary,#6B778C)]">Exposures</div></div>
              </div>
              <div className="mt-3">
                <div className="text-xs font-medium text-[var(--text-secondary,#6B778C)] mb-2">Vaccinations</div>
                <div className="flex flex-wrap gap-2">
                  {sh.vaccinations.map((v, i) => (
                    <span key={i} className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${v.status === "Completed" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : v.status === "Scheduled" ? "bg-blue-50 text-blue-700 border-blue-200" : v.status === "Overdue" ? "bg-red-50 text-red-700 border-red-200" : "bg-gray-50 text-gray-600 border-gray-200"}`}>
                      {v.name} {v.status === "Completed" ? "✓" : v.status === "Overdue" ? "!" : ""}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── 15. Incident Reporting ───────────────────────────────────────────────── */
function IncidentReporting() {
  return (
    <div className="space-y-6">
      <PageHeader title="Incident Reporting" subtitle="Workplace safety and incident management" icon={AlertTriangle}
        breadcrumb={["HRMS", "Incidents"]}
        actions={<><Button variant="outline" size="sm"><Download className="size-4 mr-1.5" />Export</Button><Button size="sm"><Plus className="size-4 mr-1.5" />Report Incident</Button></>} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard icon={AlertTriangle} label="Total Incidents" value={INCIDENTS.length} tone="blue" />
        <KPICard icon={AlertCircle} label="Critical/Major" value={INCIDENTS.filter((i) => i.severity === "Critical" || i.severity === "Major").length} tone="red" />
        <KPICard icon={Clock} label="Investigating" value={INCIDENTS.filter((i) => i.status === "Investigating").length} tone="warning" />
        <KPICard icon={CheckCircle2} label="Resolved" value={INCIDENTS.filter((i) => i.status === "Closed" || i.status === "Resolved").length} tone="green" />
      </div>

      <div className="space-y-4">
        {INCIDENTS.map((inc) => <IncidentCard key={inc.id} incident={inc} />)}
      </div>
    </div>
  );
}

/* ── 16. Exit Management ──────────────────────────────────────────────────── */
function ExitManagement({ employees }: { employees: typeof EMPLOYEES }) {
  return (
    <div className="space-y-6">
      <PageHeader title="Exit Management" subtitle="Resignation, clearance & final settlement" icon={UserMinus}
        breadcrumb={["HRMS", "Exit"]}
        actions={<><Button variant="outline" size="sm"><Download className="size-4 mr-1.5" />Export</Button><Button size="sm"><Plus className="size-4 mr-1.5" />Initiate Exit</Button></>} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard icon={UserMinus} label="Active Exits" value={EXITS.length} tone="blue" />
        <KPICard icon={Clock} label="Clearance In Progress" value={EXITS.filter((e) => e.status === "Clearance In Progress").length} tone="warning" />
        <KPICard icon={CheckCircle2} label="Completed" value={EXITS.filter((e) => e.status === "Completed").length} tone="green" />
        <KPICard icon={Banknote} label="Settlement Pending" value={EXITS.filter((e) => e.status === "Settlement Pending").length} tone="amber" />
      </div>

      <div className="space-y-4">
        {EXITS.map((exit) => {
          const emp = employees.find((e) => e.id === exit.employeeId);
          const clearanceCount = Object.values(exit.clearance).filter(Boolean).length;
          const clearanceTotal = Object.keys(exit.clearance).length;
          return (
            <div key={exit.id} className="rounded-xl border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid size-12 place-items-center rounded-xl text-sm font-bold text-white" style={{ backgroundColor: emp?.profileColor ?? "#0052CC" }}>{emp?.avatar ?? "?"}</div>
                  <div>
                    <div className="font-semibold text-[var(--text-primary,#172B4D)]">{exit.employeeName}</div>
                    <div className="text-xs text-[var(--text-secondary,#6B778C)]">{exit.designation} · {exit.department} · {exit.type}</div>
                  </div>
                </div>
                <StatusPill label={exit.status} tone={exit.status === "Completed" ? "success" : exit.status === "Clearance In Progress" ? "warning" : "info"} />
              </div>
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div><span className="text-[var(--text-secondary,#6B778C)]">Notice Date</span><div className="font-medium text-[var(--text-primary,#172B4D)]">{exit.noticeDate}</div></div>
                <div><span className="text-[var(--text-secondary,#6B778C)]">Last Working Day</span><div className="font-medium text-[var(--text-primary,#172B4D)]">{exit.lastWorkingDay}</div></div>
                <div><span className="text-[var(--text-secondary,#6B778C)]">Reason</span><div className="font-medium text-[var(--text-primary,#172B4D)]">{exit.reason}</div></div>
                <div><span className="text-[var(--text-secondary,#6B778C)]">Exit Interview</span><div className="font-medium text-[var(--text-primary,#172B4D)]">{exit.exitInterviewDone ? "Done" : "Pending"}</div></div>
              </div>
              <div className="mt-3">
                <HealthBar value={clearanceCount} max={clearanceTotal} label={`Clearance: ${clearanceCount}/${clearanceTotal} departments`} />
              </div>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                {Object.entries(exit.clearance).map(([dept, done]) => (
                  <span key={dept} className={`flex items-center gap-1 rounded px-2 py-0.5 ${done ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                    {done ? <CheckCircle2 className="size-3" /> : <span className="size-3 rounded-full border border-gray-300" />}
                    {dept}
                  </span>
                ))}
              </div>
              {exit.assetsReturned.length > 0 && <div className="mt-2 text-xs text-[var(--text-secondary,#6B778C)]">Assets returned: {exit.assetsReturned.join(", ")}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── 17. HR Analytics ─────────────────────────────────────────────────────── */
function HRAnalytics() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
  const headcountData = [632, 638, 641, 645, 650, 654, 658];
  const turnoverData = [9.2, 8.8, 8.5, 8.1, 8.0, 8.2, 8.3];
  return (
    <div className="space-y-6">
      <PageHeader title="HR Analytics" subtitle="Workforce insights and metrics" icon={BarChart3}
        breadcrumb={["HRMS", "Analytics"]}
        actions={<><Button variant="outline" size="sm"><Download className="size-4 mr-1.5" />Export Report</Button><Button variant="outline" size="sm"><Filter className="size-4 mr-1.5" />Date Range</Button></>} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard icon={Users} label="Headcount" value={HR_KPI.totalEmployees} trend="up" trendValue="+26 YTD" tone="blue" />
        <KPICard icon={TrendingDown} label="Turnover Rate" value={`${HR_KPI.turnoverRate}%`} trend="down" trendValue="-0.5%" tone="amber" />
        <KPICard icon={Clock} label="Absenteeism" value={`${HR_KPI.absenteeismRate}%`} tone="green" />
        <KPICard icon={GraduationCap} label="Training Compliance" value={`${HR_KPI.trainingCompliance}%`} tone="purple" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Section title="Headcount Trend" subtitle="Monthly headcount">
          <div className="rounded-xl border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] p-4 shadow-sm">
            <div className="flex items-end gap-2 h-48">
              {headcountData.map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] font-medium text-[var(--text-primary,#172B4D)]">{v}</span>
                  <div className="w-full bg-[#0052CC] rounded-t" style={{ height: `${((v - 620) / 50) * 100}%` }} />
                  <span className="text-[10px] text-[var(--text-secondary,#6B778C)]">{months[i]}</span>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section title="Turnover Rate" subtitle="Monthly turnover (%)">
          <div className="rounded-xl border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] p-4 shadow-sm">
            <div className="flex items-end gap-2 h-48">
              {turnoverData.map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] font-medium text-[var(--text-primary,#172B4D)]">{v}%</span>
                  <div className="w-full bg-amber-500 rounded-t" style={{ height: `${(v / 12) * 100}%` }} />
                  <span className="text-[10px] text-[var(--text-secondary,#6B778C)]">{months[i]}</span>
                </div>
              ))}
            </div>
          </div>
        </Section>
      </div>

      <Section title="Department Distribution" subtitle="Employee count by department">
        <div className="rounded-xl border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border,#DFE1E6)] bg-gray-50/50">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary,#6B778C)]">Department</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary,#6B778C)]">Head</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary,#6B778C)]">Employees</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary,#6B778C)]">Budget</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary,#6B778C)]">Location</th>
                </tr>
              </thead>
              <tbody>
                {DEPARTMENTS.map((d) => (
                  <tr key={d.id} className="border-b border-[var(--border,#DFE1E6)] last:border-0 hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-medium text-[var(--text-primary,#172B4D)]">{d.name}</td>
                    <td className="px-4 py-3 text-[var(--text-primary,#172B4D)]">{d.head}</td>
                    <td className="px-4 py-3 text-right text-[var(--text-primary,#172B4D)]">{d.employeeCount}</td>
                    <td className="px-4 py-3 text-right text-[var(--text-primary,#172B4D)]">{formatCurrencyFull(d.budget)}</td>
                    <td className="px-4 py-3 text-[var(--text-primary,#172B4D)]">{d.location} · {d.floor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Section>
    </div>
  );
}

/* ── 18. Workflow Complete ────────────────────────────────────────────────── */
function WorkflowComplete({ onNavigate }: { onNavigate: (s: string) => void }) {
  return (
    <div className="space-y-6">
      <PageHeader title="Workflow Complete" subtitle="HR lifecycle workflow summary" icon={CheckCircle2}
        breadcrumb={["HRMS", "Workflow Complete"]} />

      <div className="mx-auto max-w-2xl space-y-6">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
          <div className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-100">
            <CheckCircle2 className="size-8 text-emerald-600" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-[var(--text-primary,#172B4D)]">HR Workflow Completed</h2>
          <p className="mt-2 text-sm text-[var(--text-secondary,#6B778C)]">All HR lifecycle processes have been executed and audit-logged.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-lg bg-blue-50 text-blue-600"><Users className="size-5" /></div>
              <div>
                <div className="text-sm font-medium text-[var(--text-primary,#172B4D)]">Employee Record Updated</div>
                <div className="text-xs text-[var(--text-secondary,#6B778C)]">{HR_KPI.totalEmployees} employees managed</div>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-lg bg-purple-50 text-purple-600"><Bell className="size-5" /></div>
              <div>
                <div className="text-sm font-medium text-[var(--text-primary,#172B4D)]">Notifications Sent</div>
                <div className="text-xs text-[var(--text-secondary,#6B778C)]">Managers and employees notified</div>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-lg bg-amber-50 text-amber-600"><BarChart3 className="size-5" /></div>
              <div>
                <div className="text-sm font-medium text-[var(--text-primary,#172B4D)]">Reports Generated</div>
                <div className="text-xs text-[var(--text-secondary,#6B778C)]">Workforce analytics updated</div>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-lg bg-emerald-50 text-emerald-600"><Shield className="size-5" /></div>
              <div>
                <div className="text-sm font-medium text-[var(--text-primary,#172B4D)]">Audit Recorded</div>
                <div className="text-xs text-[var(--text-secondary,#6B778C)]">Complete HR audit trail maintained</div>
              </div>
            </div>
          </div>
        </div>

        <Section title="HR Summary" subtitle="Workforce overview at a glance">
          <div className="rounded-xl border border-[var(--border,#DFE1E6)] bg-[var(--surface,#FFFFFF)] p-5 shadow-sm space-y-3">
            {[
              { label: "Total Employees", value: String(HR_KPI.totalEmployees) },
              { label: "Doctors / Nurses / Support", value: `${HR_KPI.doctors} / ${HR_KPI.nurses} / ${HR_KPI.supportStaff}` },
              { label: "Open Positions", value: String(HR_KPI.openPositions) },
              { label: "Attendance Rate", value: `${HR_KPI.attendanceToday}%` },
              { label: "Training Compliance", value: `${HR_KPI.trainingCompliance}%` },
              { label: "Credential Compliance", value: `${HR_KPI.credentialCompliance}%` },
              { label: "Monthly Payroll", value: formatCurrencyFull(HR_KPI.totalPayroll) },
              { label: "Employee Satisfaction", value: `${HR_KPI.employeeSatisfaction}/5` },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-2.5">
                <span className="text-sm text-[var(--text-secondary,#6B778C)]">{item.label}</span>
                <span className="text-sm font-semibold text-[var(--text-primary,#172B4D)]">{item.value}</span>
              </div>
            ))}
          </div>
        </Section>

        <div className="flex justify-center gap-3">
          <Button variant="outline" onClick={() => onNavigate("hr-dashboard")}>Return to Dashboard</Button>
          <Button onClick={() => onNavigate("hr-dashboard")}>View Dashboard</Button>
        </div>
      </div>
    </div>
  );
}
