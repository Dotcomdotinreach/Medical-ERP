import { useState, useEffect, useMemo } from "react";
import {
  LayoutDashboard, Video, Phone, MessageSquare, Clock, Users, CheckCircle,
  AlertTriangle, Wifi, WifiOff, Shield, CreditCard, Calendar, Star,
  TrendingUp, TrendingDown, FileText, Send, Paperclip, Eye, Download,
  Activity, Mic, MicOff, Camera, CameraOff, Monitor, Signal, CircleDot,
  ChevronRight, MoreHorizontal, Bell, Search, Plus, RefreshCw,
  Settings, Zap, Radio, Headphones, ScreenShare, Image as ImageIcon,
  File, Stethoscope, Pill, TestTube2, ScanLine, UserCheck,
  CalendarClock, BarChart3, ClipboardCheck, Headphones as HPhone,
  BookOpen, FileCheck, CircleAlert, Power, ArrowRight, Play, Pause,
  Square, Timer, Wifi as WifiIcon, Globe, Smartphone, Laptop, ShieldCheck,
} from "lucide-react";
import { Shell, type Workspace } from "../his/Shell";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { StatusBadge, StatCard, SectionCard, PageHeader } from "../his/ui";
import {
  AppointmentCard, WaitingRoomCard, MessageBubble, BillingRow,
  ConsentCard, ConnectivityRow, AuditEntryRow, QualityMetricRow,
} from "./telemedicineUi";
import {
  PROVIDERS, VIRTUAL_APPOINTMENTS, WAITING_ROOM, CLINICAL_NOTES,
  PRESCRIPTIONS, LAB_ORDERS, RADIOLOGY_ORDERS, SECURE_MESSAGES,
  BILLING_RECORDS, CONSENT_RECORDS, FOLLOW_UP_PLANS, PROVIDER_ANALYTICS,
  CONNECTIVITY_LOGS, AUDIT_LOGS, QUALITY_METRICS, MEDICAL_CERTIFICATES,
  TELEMEDICINE_KPI, apptStatusTone, formatCurrency,
} from "./data";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import { telemedicineApi } from "../../services/telemedicine";

type TmRoute =
  | "tm-dashboard" | "tm-appointments" | "tm-waitingRoom" | "tm-patientIntake"
  | "tm-digitalConsent" | "tm-videoConsult" | "tm-clinicalDoc" | "tm-ePrescription"
  | "tm-labRadiologyOrders" | "tm-secureMessaging" | "tm-fileImageViewer"
  | "tm-billingIntegration" | "tm-followUpScheduling" | "tm-providerAnalytics"
  | "tm-clinicalQuality" | "tm-deviceConnectivity" | "tm-reportsAudit" | "tm-workflowComplete";

const NAV = [
  { id: "tm-dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "tm-appointments", label: "Appointments", icon: Calendar, badge: "8" },
  { id: "tm-waitingRoom", label: "Waiting Room", icon: Users, badge: "2", tone: "warning" as const },
  { id: "tm-patientIntake", label: "Patient Intake", icon: ClipboardCheck },
  { id: "tm-digitalConsent", label: "Digital Consent", icon: Shield },
  { id: "tm-videoConsult", label: "Video Consultation", icon: Video },
  { id: "tm-clinicalDoc", label: "Clinical Documentation", icon: FileText },
  { id: "tm-ePrescription", label: "E-Prescription", icon: Pill },
  { id: "tm-labRadiologyOrders", label: "Lab & Radiology", icon: TestTube2 },
];

const NAV_SECONDARY = [
  { id: "tm-secureMessaging", label: "Secure Messaging", icon: MessageSquare, badge: "3", tone: "warning" as const },
  { id: "tm-fileImageViewer", label: "File & Image Viewer", icon: ImageIcon },
  { id: "tm-billingIntegration", label: "Billing Integration", icon: CreditCard },
  { id: "tm-followUpScheduling", label: "Follow-up Scheduling", icon: CalendarClock },
  { id: "tm-providerAnalytics", label: "Provider Analytics", icon: BarChart3 },
  { id: "tm-clinicalQuality", label: "Clinical Quality", icon: ShieldCheck },
  { id: "tm-deviceConnectivity", label: "Device & Connectivity", icon: WifiIcon },
  { id: "tm-reportsAudit", label: "Reports & Audit", icon: BookOpen },
  { id: "tm-workflowComplete", label: "Workflow Complete", icon: CheckCircle },
];

export function TelemedicineApp({ roleName, onSignOut, onSwitchWorkspace, onOpenSettings }: {
  roleName: string; onSignOut: () => void; onSwitchWorkspace: (w: Workspace) => void; onOpenSettings?: (page: string) => void;
}) {
  const [screen, setScreen] = useState<TmRoute>("tm-dashboard");
  const [selectedAppointment, setSelectedAppointment] = useState<any>(VIRTUAL_APPOINTMENTS[0]);
  const [consultations, setConsultations] = useState<any[]>(VIRTUAL_APPOINTMENTS);
  const [rooms, setRooms] = useState<any[]>(WAITING_ROOM);
  const [kpi, setKpi] = useState<any>(TELEMEDICINE_KPI);

  useEffect(() => {
    telemedicineApi.listConsultations()
      .then(res => setConsultations(res.data))
      .catch(() => {});
    telemedicineApi.listRooms()
      .then(res => setRooms(res.data))
      .catch(() => {});
    telemedicineApi.stats()
      .then(res => setKpi(res.data))
      .catch(() => {});
  }, []);

  const breadcrumb = useMemo(() => {
    const crumb = ["Telemedicine"];
    const nav = [...NAV, ...NAV_SECONDARY].find((n) => n.id === screen);
    if (nav) crumb.push(nav.label);
    return crumb;
  }, [screen]);

  return (
    <Shell
      nav={NAV}
      navSecondary={NAV_SECONDARY}
      sectionLabel="Telemedicine Portal"
      activeId={screen}
      isActive={(id) => id === screen}
      onNavigate={(id) => setScreen(id as TmRoute)}
      breadcrumb={breadcrumb}
      roleName={roleName}
      onSignOut={onSignOut}
      workspace="telemedicine"
      onSwitchWorkspace={onSwitchWorkspace}
      onOpenSettings={onOpenSettings}
      searchPlaceholder="Search patients, appointments…"
    >
      {screen === "tm-dashboard" && <DashboardScreen kpi={kpi} consultations={consultations} onSelectAppointment={(a) => { setSelectedAppointment(a); setScreen("tm-appointments"); }} />}
      {screen === "tm-appointments" && <AppointmentsScreen consultations={consultations} selected={selectedAppointment} onSelect={(a) => setSelectedAppointment(a)} onJoin={() => setScreen("tm-videoConsult")} />}
      {screen === "tm-waitingRoom" && <WaitingRoomScreen rooms={rooms} kpi={kpi} onAccept={() => setScreen("tm-videoConsult")} />}
      {screen === "tm-patientIntake" && <PatientIntakeScreen appointment={selectedAppointment} />}
      {screen === "tm-digitalConsent" && <DigitalConsentScreen />}
      {screen === "tm-videoConsult" && <VideoConsultScreen appointment={selectedAppointment} onDoc={() => setScreen("tm-clinicalDoc")} />}
      {screen === "tm-clinicalDoc" && <ClinicalDocScreen />}
      {screen === "tm-ePrescription" && <EPrescriptionScreen />}
      {screen === "tm-labRadiologyOrders" && <LabRadiologyScreen />}
      {screen === "tm-secureMessaging" && <SecureMessagingScreen />}
      {screen === "tm-fileImageViewer" && <FileImageViewerScreen />}
      {screen === "tm-billingIntegration" && <BillingScreen />}
      {screen === "tm-followUpScheduling" && <FollowUpScreen />}
      {screen === "tm-providerAnalytics" && <ProviderAnalyticsScreen />}
      {screen === "tm-clinicalQuality" && <ClinicalQualityScreen />}
      {screen === "tm-deviceConnectivity" && <DeviceConnectivityScreen kpi={kpi} />}
      {screen === "tm-reportsAudit" && <ReportsAuditScreen consultations={consultations} />}
      {screen === "tm-workflowComplete" && <WorkflowCompleteScreen />}
    </Shell>
  );
}

/* ── Screen: Dashboard ────────────────────────────────────────────────────── */
function DashboardScreen({ kpi, consultations, onSelectAppointment }: { kpi: any; consultations: any[]; onSelectAppointment: (a: any) => void }) {
  return (
    <div className="space-y-4">
      <PageHeader title="Telemedicine Dashboard" subtitle="Virtual care operations overview" icon={LayoutDashboard}
        actions={<><Button variant="outline" size="sm"><RefreshCw className="mr-1.5 size-4" />Refresh</Button><Button variant="outline" size="sm"><Download className="mr-1.5 size-4" />Export</Button></>} />
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <StatCard label="Today's Consultations" value={kpi.todayConsultations} icon={Video} />
        <StatCard label="Waiting Patients" value={kpi.waitingPatients} icon={Users} />
        <StatCard label="Completed Visits" value={kpi.completedVisits} icon={CheckCircle} />
        <StatCard label="Missed" value={kpi.missedAppointments} icon={AlertTriangle} />
        <StatCard label="Unread Messages" value={kpi.unreadMessages} icon={MessageSquare} />
        <StatCard label="Revenue" value={formatCurrency(kpi.revenue)} icon={CreditCard} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SectionCard title="Today's Schedule" className="lg:col-span-2">
          <div className="space-y-2">
            {consultations.filter(a => a.status !== "Completed" && a.status !== "Cancelled").map(a => (
              <AppointmentCard key={a.id} a={a} onJoin={() => onSelectAppointment(a)} />
            ))}
          </div>
        </SectionCard>

        <div className="space-y-4">
          <SectionCard title="Quick Actions">
            <div className="space-y-2">
              {[
                { label: "Start Next Consultation", icon: Video, action: () => {}, color: "bg-primary text-primary-foreground" },
                { label: "Review Pending Documentation", icon: FileText, action: () => {}, color: "bg-muted" },
                { label: "Send Prescription", icon: Pill, action: () => {}, color: "bg-muted" },
                { label: "Order Lab Tests", icon: TestTube2, action: () => {}, color: "bg-muted" },
              ].map((q, i) => (
                <button key={i} onClick={q.action} className={`w-full flex items-center gap-3 p-3 rounded-lg ${q.color} text-sm font-medium hover:opacity-90 transition`}>
                  <q.icon className="h-4 w-4" />{q.label}
                </button>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Connectivity Status">
            <div className="space-y-2">
              {CONNECTIVITY_LOGS.slice(0, 2).map(c => (
                <ConnectivityRow key={c.id} c={c} />
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Recent Activity">
            <div className="space-y-1">
              {AUDIT_LOGS.slice(0, 4).map(a => (
                <AuditEntryRow key={a.id} e={a} />
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

/* ── Screen: Appointments ─────────────────────────────────────────────────── */
function AppointmentsScreen({ consultations, selected, onSelect, onJoin }: { consultations: any[]; selected: any; onSelect: (a: any) => void; onJoin: () => void }) {
  return (
    <div className="space-y-4">
      <PageHeader title="Appointment Management" subtitle="Virtual consultation scheduling and management" icon={Calendar}
        actions={<><Button size="sm"><Plus className="mr-1.5 size-4" />New Appointment</Button><Button variant="outline" size="sm"><Download className="mr-1.5 size-4" />Export</Button></>} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total Today" value={consultations.length} icon={Calendar} />
        <StatCard label="Scheduled" value={consultations.filter(a => a.status === "Scheduled").length} icon={Clock} />
        <StatCard label="In Progress" value={consultations.filter(a => a.status === "In Progress").length} icon={Video} />
        <StatCard label="Completed" value={consultations.filter(a => a.status === "Completed").length} icon={CheckCircle} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SectionCard title="All Appointments" className="lg:col-span-2">
          <div className="flex gap-2 mb-3 flex-wrap">
            <Input placeholder="Search appointments…" className="max-w-xs" />
            <Select defaultValue="all"><SelectTrigger className="w-32"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="scheduled">Scheduled</SelectItem><SelectItem value="waiting">Waiting</SelectItem><SelectItem value="inprogress">In Progress</SelectItem><SelectItem value="completed">Completed</SelectItem></SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            {VIRTUAL_APPOINTMENTS.map(a => (
              <div key={a.id} onClick={() => onSelect(a)} className={`p-4 rounded-lg border cursor-pointer transition hover:ring-2 hover:ring-primary/30 ${selected?.id === a.id ? "ring-2 ring-primary" : ""}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar className="h-10 w-10"><AvatarFallback>{a.patientAvatar}</AvatarFallback></Avatar>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate">{a.patientName}</p>
                      <p className="text-xs text-muted-foreground">{a.specialty} — {a.consultType}</p>
                      <p className="text-xs text-muted-foreground truncate">{a.chiefComplaint}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <StatusBadge tone={apptStatusTone(a.status)}>{a.status}</StatusBadge>
                    <span className="text-xs text-muted-foreground">{new Date(a.appointmentTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Appointment Details">
          {selected ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12"><AvatarFallback>{selected.patientAvatar}</AvatarFallback></Avatar>
                <div>
                  <p className="font-semibold">{selected.patientName}</p>
                  <p className="text-sm text-muted-foreground">{selected.patientAge}y {selected.patientGender} — {selected.specialty}</p>
                </div>
              </div>
              <Separator />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Appointment</span><span>{selected.id}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Type</span><Badge variant="outline">{selected.consultType}</Badge></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Time</span><span>{new Date(selected.appointmentTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Duration</span><span>{selected.duration} min</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Status</span><StatusBadge tone={apptStatusTone(selected.status)}>{selected.status}</StatusBadge></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Consent</span><StatusBadge tone={selected.consentStatus === "Signed" ? "success" : "warning"}>{selected.consentStatus}</StatusBadge></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Payment</span><StatusBadge tone={selected.paymentStatus === "Paid" ? "success" : "warning"}>{selected.paymentStatus}</StatusBadge></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Fee</span><span className="font-medium">{formatCurrency(selected.paymentAmount)}</span></div>
                {selected.insuranceProvider && <div className="flex justify-between"><span className="text-muted-foreground">Insurance</span><span>{selected.insuranceProvider}</span></div>}
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Chief Complaint</h4>
                <p className="text-sm text-muted-foreground">{selected.chiefComplaint}</p>
              </div>
              {selected.vitals && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Patient-Reported Vitals</h4>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="p-2 bg-muted rounded text-center"><p className="text-muted-foreground">BP</p><p className="font-medium">{selected.vitals.bp}</p></div>
                    <div className="p-2 bg-muted rounded text-center"><p className="text-muted-foreground">HR</p><p className="font-medium">{selected.vitals.heartRate}</p></div>
                    <div className="p-2 bg-muted rounded text-center"><p className="text-muted-foreground">Temp</p><p className="font-medium">{selected.vitals.temp}°F</p></div>
                    <div className="p-2 bg-muted rounded text-center"><p className="text-muted-foreground">SpO2</p><p className="font-medium">{selected.vitals.spo2}%</p></div>
                    <div className="p-2 bg-muted rounded text-center"><p className="text-muted-foreground">Weight</p><p className="font-medium">{selected.vitals.weight}kg</p></div>
                  </div>
                </div>
              )}
              {selected.status === "Waiting" || selected.status === "Checked In" || selected.status === "Scheduled" ? (
                <Button className="w-full" onClick={onJoin}><Video className="mr-2 h-4 w-4" />Join Consultation</Button>
              ) : null}
            </div>
          ) : <p className="text-sm text-muted-foreground text-center py-8">Select an appointment</p>}
        </SectionCard>
      </div>
    </div>
  );
}

/* ── Screen: Virtual Waiting Room ─────────────────────────────────────────── */
function WaitingRoomScreen({ onAccept }: { onAccept: () => void }) {
  return (
    <div className="space-y-4">
      <PageHeader title="Virtual Waiting Room" subtitle="Patient queue, check-in status, connectivity" icon={Users}
        actions={<Button variant="outline" size="sm"><RefreshCw className="mr-1.5 size-4" />Refresh Queue</Button>} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="In Waiting Room" value={WAITING_ROOM.length} icon={Users} />
        <StatCard label="Ready for Consult" value={WAITING_ROOM.filter(w => w.readyForConsultation).length} icon={CheckCircle} />
        <StatCard label="Avg Wait Time" value={`${TELEMEDICINE_KPI.avgWaitTime} min`} icon={Clock} />
        <StatCard label="Connectivity Issues" value={TELEMEDICINE_KPI.connectivityIssues} icon={WifiOff} />
      </div>

      <SectionCard title="Patient Queue">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {WAITING_ROOM.map(w => (
            <WaitingRoomCard key={w.id} w={w} onAccept={onAccept} />
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Pre-Consultation Checklist">
        <div className="space-y-2">
          {[
            { step: "Digital Intake Completed", desc: "Chief complaint, symptoms, history, medications", status: true },
            { step: "Identity Verified", desc: "Aadhaar / PAN / Photo ID verified", status: true },
            { step: "Digital Consent Signed", desc: "Telemedicine consent + Privacy notice + OTP verified", status: true },
            { step: "Payment Confirmed", desc: "Consultation fee paid via UPI / Card / Insurance", status: true },
            { step: "Vitals Recorded", desc: "Patient-reported vitals entered in intake form", status: true },
            { step: "Connectivity Tested", desc: "Camera, microphone, internet speed verified", status: true },
            { step: "Medical Records Uploaded", desc: "Previous prescriptions, reports, imaging uploaded", status: false },
          ].map((c, i) => (
            <div key={i} className="flex items-center gap-3 p-2 border rounded">
              {c.status ? <CheckCircle className="h-4 w-4 text-green-600" /> : <Clock className="h-4 w-4 text-muted-foreground" />}
              <div className="flex-1">
                <p className="text-sm font-medium">{c.step}</p>
                <p className="text-xs text-muted-foreground">{c.desc}</p>
              </div>
              <StatusBadge tone={c.status ? "success" : "warning"}>{c.status ? "Done" : "Pending"}</StatusBadge>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

/* ── Screen: Patient Intake ───────────────────────────────────────────────── */
function PatientIntakeScreen({ appointment }: { appointment: any }) {
  return (
    <div className="space-y-4">
      <PageHeader title="Digital Patient Intake" subtitle="Pre-consultation questionnaire and vitals" icon={ClipboardCheck} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="Patient Information">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12"><AvatarFallback>{appointment.patientAvatar}</AvatarFallback></Avatar>
              <div>
                <p className="font-semibold">{appointment.patientName}</p>
                <p className="text-sm text-muted-foreground">{appointment.patientAge}y {appointment.patientGender} — {appointment.specialty}</p>
              </div>
            </div>
            <Separator />
            <div className="space-y-3">
              <div><Label className="text-xs">Chief Complaint</Label><Textarea defaultValue={appointment.chiefComplaint} rows={2} /></div>
              <div><Label className="text-xs">Duration of Symptoms</Label><Input defaultValue="2 weeks" /></div>
              <div><Label className="text-xs">Associated Symptoms</Label><Input defaultValue="Mild fever, fatigue, mild chest discomfort" /></div>
              <div><Label className="text-xs">Previous Treatments</Label><Textarea defaultValue="OTC paracetamol — partial relief. No antibiotics taken." rows={2} /></div>
            </div>
          </div>
        </SectionCard>

        <div className="space-y-4">
          <SectionCard title="Medical History">
            <div className="space-y-2 text-sm">
              {[
                { label: "Chronic Diseases", value: "None" },
                { label: "Previous Surgeries", value: "Appendectomy (2018)" },
                { label: "Family History", value: "Father — Hypertension, Mother — Diabetes" },
                { label: "Allergies", value: "Penicillin (rash)" },
                { label: "Current Medications", value: "Amlodipine 5mg daily (self-medicated)" },
                { label: "Smoking", value: "Former smoker — quit 2022" },
                { label: "Alcohol", value: "Social drinker" },
              ].map((h, i) => (
                <div key={i} className="flex justify-between p-2 border rounded">
                  <span className="text-muted-foreground">{h.label}</span>
                  <span className="font-medium text-right">{h.value}</span>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Patient-Reported Vitals">
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Blood Pressure", value: appointment.vitals?.bp || "128/82", unit: "mmHg" },
                { label: "Heart Rate", value: appointment.vitals?.heartRate || 88, unit: "bpm" },
                { label: "Temperature", value: appointment.vitals?.temp || 99.2, unit: "°F" },
                { label: "SpO2", value: appointment.vitals?.spo2 || 96, unit: "%" },
                { label: "Weight", value: appointment.vitals?.weight || 72, unit: "kg" },
                { label: "Respiratory Rate", value: 18, unit: "/min" },
              ].map((v, i) => (
                <div key={i} className="p-3 rounded-lg bg-muted text-center">
                  <p className="text-xs text-muted-foreground">{v.label}</p>
                  <p className="text-lg font-bold">{v.value}</p>
                  <p className="text-[10px] text-muted-foreground">{v.unit}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Uploaded Documents">
            <div className="space-y-2">
              {[
                { name: "chest_xray_2025.pdf", type: "PDF", size: "2.4 MB", date: "2026-07-24" },
                { name: "blood_test_report.pdf", type: "PDF", size: "1.1 MB", date: "2026-07-20" },
                { name: "previous_prescription.jpg", type: "Image", size: "856 KB", date: "2026-07-10" },
              ].map((d, i) => (
                <div key={i} className="flex items-center gap-3 p-2 border rounded">
                  <File className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{d.name}</p>
                    <p className="text-xs text-muted-foreground">{d.type} — {d.size}</p>
                  </div>
                  <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="sm"><Download className="h-4 w-4" /></Button>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

/* ── Screen: Digital Consent ──────────────────────────────────────────────── */
function DigitalConsentScreen() {
  return (
    <div className="space-y-4">
      <PageHeader title="Digital Consent" subtitle="Telemedicine consent, privacy notice, electronic signatures" icon={Shield} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="Consent Records">
          <div className="space-y-3">
            {CONSENT_RECORDS.map(c => (
              <ConsentCard key={c.id} c={c} />
            ))}
          </div>
        </SectionCard>

        <div className="space-y-4">
          <SectionCard title="Consent Template">
            <div className="space-y-3">
              <div className="p-4 rounded-lg border space-y-2">
                <h4 className="font-semibold text-sm">Telemedicine Consultation Consent</h4>
                <div className="text-xs text-muted-foreground space-y-2">
                  <p>I understand that telemedicine involves the delivery of healthcare services using electronic communications, information technology, or other means between a healthcare provider and a patient who are not in the same physical location.</p>
                  <p>I understand that telemedicine has limitations and does not replace in-person visits when deemed necessary by the healthcare provider.</p>
                  <p>I consent to the recording of the consultation for quality assurance and medical record purposes.</p>
                  <p>I understand my right to withdraw consent at any time.</p>
                  <p>I have been informed about the privacy and security measures in place to protect my health information.</p>
                </div>
              </div>
              <div className="p-4 rounded-lg border space-y-2">
                <h4 className="font-semibold text-sm">Privacy Notice (ABDM Compliant)</h4>
                <div className="text-xs text-muted-foreground space-y-2">
                  <p>This consultation is conducted in compliance with the Ayushman Bharat Digital Mission (ABDM) and applicable Indian data protection regulations.</p>
                  <p>Your health data is stored securely and shared only with authorized healthcare providers involved in your care.</p>
                  <p>You have the right to access, correct, and request deletion of your health records.</p>
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Consent Verification">
            <div className="space-y-3">
              <div className="p-4 rounded-lg border text-center space-y-3">
                <Shield className="h-12 w-12 mx-auto text-primary" />
                <h4 className="font-semibold">OTP Verification Required</h4>
                <p className="text-sm text-muted-foreground">An OTP will be sent to the patient's registered mobile number for consent verification.</p>
                <div className="flex gap-2 justify-center">
                  <Input className="w-32" placeholder="Enter OTP" />
                  <Button size="sm">Verify OTP</Button>
                </div>
              </div>
              <div className="p-4 rounded-lg border space-y-2">
                <h4 className="font-semibold text-sm">Electronic Signature</h4>
                <p className="text-xs text-muted-foreground">Patient signs using touch/mouse on the digital signature pad below.</p>
                <div className="h-24 border-2 border-dashed rounded-lg flex items-center justify-center text-muted-foreground text-sm">
                  Sign here
                </div>
                <Button className="w-full">Submit Signed Consent</Button>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

/* ── Screen: Video Consultation ───────────────────────────────────────────── */
function VideoConsultScreen({ appointment, onDoc }: { appointment: any; onDoc: () => void }) {
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  return (
    <div className="space-y-4">
      <PageHeader title="Video Consultation" subtitle="HD Video • Audio • Screen Share • Secure Chat" icon={Video}
        actions={<><Badge variant="outline" className="animate-pulse"><span className="h-2 w-2 rounded-full bg-green-500 mr-1 inline-block" />LIVE</Badge><Button variant="outline" size="sm" onClick={onDoc}><FileText className="mr-1.5 size-4" />Documentation</Button></>} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SectionCard title="Consultation" className="lg:col-span-2">
          <div className="space-y-3">
            <div className="relative aspect-video bg-gray-900 rounded-lg flex items-center justify-center overflow-hidden">
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <Badge variant="destructive" className="animate-pulse">REC</Badge>
                <Badge variant="outline" className="bg-black/50 text-white border-white/20">00:12:34</Badge>
              </div>
              <div className="absolute top-3 right-3 flex items-center gap-2">
                <Badge variant="outline" className="bg-black/50 text-white border-white/20"><Signal className="h-3 w-3 mr-1" />Excellent</Badge>
              </div>
              <div className="text-center text-white">
                <Avatar className="h-20 w-20 mx-auto mb-2"><AvatarFallback className="text-2xl">{appointment.patientAvatar}</AvatarFallback></Avatar>
                <p className="font-medium">{appointment.patientName}</p>
                <p className="text-sm text-gray-400">{appointment.consultType} — {appointment.specialty}</p>
              </div>
              <div className="absolute bottom-3 right-3 w-32 h-24 bg-gray-800 rounded-lg border-2 border-white/20 flex items-center justify-center">
                <Avatar className="h-10 w-10"><AvatarFallback>PS</AvatarFallback></Avatar>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <Button variant={micOn ? "default" : "destructive"} size="icon" className="rounded-full h-12 w-12" onClick={() => setMicOn(!micOn)}>
                {micOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
              </Button>
              <Button variant={camOn ? "default" : "destructive"} size="icon" className="rounded-full h-12 w-12" onClick={() => setCamOn(!camOn)}>
                {camOn ? <Camera className="h-5 w-5" /> : <CameraOff className="h-5 w-5" />}
              </Button>
              <Button variant="outline" size="icon" className="rounded-full h-12 w-12"><ScreenShare className="h-5 w-5" /></Button>
              <Button variant="outline" size="icon" className="rounded-full h-12 w-12"><ImageIcon className="h-5 w-5" /></Button>
              <Button variant="outline" size="icon" className="rounded-full h-12 w-12"><FileText className="h-5 w-5" /></Button>
              <Button variant="outline" size="icon" className="rounded-full h-12 w-12"><MessageSquare className="h-5 w-5" /></Button>
              <Button variant="destructive" size="icon" className="rounded-full h-12 w-12"><Phone className="h-5 w-5" /></Button>
            </div>
          </div>
        </SectionCard>

        <div className="space-y-4">
          <SectionCard title="Patient Info">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Name</span><span className="font-medium">{appointment.patientName}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Age/Gender</span><span>{appointment.patientAge}y {appointment.patientGender}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Consultation</span><span>{appointment.id}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Duration</span><span>{appointment.duration} min</span></div>
            </div>
          </SectionCard>

          <SectionCard title="Live Notes">
            <Textarea placeholder="Type consultation notes here…" rows={6} defaultValue="" />
            <Button size="sm" className="mt-2"><FileText className="mr-1.5 h-4 w-4" />Save Notes</Button>
          </SectionCard>

          <SectionCard title="Quick Actions">
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start"><Pill className="mr-2 h-4 w-4" />E-Prescription</Button>
              <Button variant="outline" className="w-full justify-start"><TestTube2 className="mr-2 h-4 w-4" />Order Lab Test</Button>
              <Button variant="outline" className="w-full justify-start"><ScanLine className="mr-2 h-4 w-4" />Order Radiology</Button>
              <Button variant="outline" className="w-full justify-start"><CalendarClock className="mr-2 h-4 w-4" />Schedule Follow-up</Button>
              <Button variant="outline" className="w-full justify-start"><FileText className="mr-2 h-4 w-4" />Medical Certificate</Button>
              <Button variant="outline" className="w-full justify-start"><ArrowRight className="mr-2 h-4 w-4" />Emergency Referral</Button>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

/* ── Screen: Clinical Documentation ───────────────────────────────────────── */
function ClinicalDocScreen() {
  return (
    <div className="space-y-4">
      <PageHeader title="Clinical Documentation" subtitle="SOAP notes, AI-assisted documentation, ICD-10 coding" icon={FileText}
        actions={<><Button size="sm"><Zap className="mr-1.5 size-4" />AI Generate Notes</Button><Button variant="outline" size="sm"><Download className="mr-1.5 size-4" />Export to EMR</Button></>} />

      <Tabs defaultValue="soap">
        <TabsList>
          <TabsTrigger value="soap">SOAP Notes</TabsTrigger>
          <TabsTrigger value="diagnosis">ICD-10 / SNOMED</TabsTrigger>
          <TabsTrigger value="ai">AI Assisted</TabsTrigger>
        </TabsList>

        <TabsContent value="soap">
          <SectionCard title="SOAP Documentation">
            <div className="space-y-3">
              {CLINICAL_NOTES.map(n => (
                <div key={n.id} className="p-4 rounded-lg border space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{n.patientName} — {n.providerName}</p>
                      <p className="text-xs text-muted-foreground">{n.consultationDate}</p>
                    </div>
                    {n.aiGenerated && <Badge variant="outline"><Zap className="h-3 w-3 mr-1" />AI Assisted</Badge>}
                  </div>
                  <div className="space-y-2">
                    <div className="p-3 rounded bg-muted">
                      <p className="text-xs font-semibold text-primary mb-1">SUBJECTIVE</p>
                      <p className="text-sm">{n.soapNote.subjective}</p>
                    </div>
                    <div className="p-3 rounded bg-muted">
                      <p className="text-xs font-semibold text-primary mb-1">OBJECTIVE</p>
                      <p className="text-sm">{n.soapNote.objective}</p>
                    </div>
                    <div className="p-3 rounded bg-muted">
                      <p className="text-xs font-semibold text-primary mb-1">ASSESSMENT</p>
                      <p className="text-sm">{n.soapNote.assessment}</p>
                    </div>
                    <div className="p-3 rounded bg-muted">
                      <p className="text-xs font-semibold text-primary mb-1">PLAN</p>
                      <p className="text-sm whitespace-pre-line">{n.soapNote.plan}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {n.icd10Codes.map((c, i) => <Badge key={i} variant="outline">ICD-10: {c}</Badge>)}
                    {n.snomedCodes.map((c, i) => <Badge key={i} variant="outline">SNOMED: {c}</Badge>)}
                  </div>
                  {n.savedToEMR && <StatusBadge tone="success">Saved to EMR</StatusBadge>}
                </div>
              ))}
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="diagnosis">
          <SectionCard title="ICD-10 & SNOMED CT Coding">
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input placeholder="Search ICD-10 codes…" className="flex-1" />
                <Button>Search</Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { code: "G44.2", desc: "Tension-type headache", cat: "Neurological" },
                    { code: "R51", desc: "Headache", cat: "Symptoms" },
                    { code: "J06.9", desc: "Acute upper respiratory infection", cat: "Respiratory" },
                    { code: "I10", desc: "Essential hypertension", cat: "Cardiovascular" },
                    { code: "E11.9", desc: "Type 2 diabetes mellitus", cat: "Endocrine" },
                  ].map((c, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-mono text-sm">{c.code}</TableCell>
                      <TableCell>{c.desc}</TableCell>
                      <TableCell><Badge variant="outline">{c.cat}</Badge></TableCell>
                      <TableCell><Button variant="ghost" size="sm"><Plus className="h-4 w-4" /></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="ai">
          <SectionCard title="AI-Assisted Documentation">
            <div className="space-y-3">
              <div className="p-4 rounded-lg border-2 border-dashed text-center space-y-2">
                <Zap className="h-12 w-12 mx-auto text-primary" />
                <h4 className="font-semibold">AI Clinical Note Generation</h4>
                <p className="text-sm text-muted-foreground">Upload consultation transcript or type notes — AI will generate structured SOAP documentation.</p>
                <Button><Zap className="mr-2 h-4 w-4" />Generate AI Notes</Button>
              </div>
              <div className="p-4 rounded-lg bg-muted space-y-2">
                <p className="text-xs font-semibold">AI-Generated Draft:</p>
                <div className="text-sm space-y-1">
                  <p><strong>Subjective:</strong> Patient presents with persistent frontal headaches for 1 week. Reports stress at work. Taking OTC paracetamol with partial relief.</p>
                  <p><strong>Objective:</strong> Alert, oriented. Vitals stable. Neurological exam normal. No focal deficits.</p>
                  <p><strong>Assessment:</strong> Tension-type headache (G44.2). Stress-related. No red flags.</p>
                  <p><strong>Plan:</strong> Naproxen 250mg BD x 5d. Omeprazole 20mg daily. Stress management. Follow-up 1 week.</p>
                </div>
              </div>
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ── Screen: E-Prescription ───────────────────────────────────────────────── */
function EPrescriptionScreen() {
  return (
    <div className="space-y-4">
      <PageHeader title="E-Prescription" subtitle="Digital prescriptions with drug interaction and allergy checking" icon={Pill}
        actions={<Button size="sm"><Plus className="mr-1.5 size-4" />New Prescription</Button>} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="Prescription Builder">
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input placeholder="Search medications…" className="flex-1" />
              <Button>Search</Button>
            </div>
            <div className="space-y-2">
              {[
                { name: "Naproxen", strength: "250mg", form: "Tablet", freq: "BD", duration: "5 days", instructions: "Take after food" },
                { name: "Omeprazole", strength: "20mg", form: "Capsule", freq: "Once daily", duration: "5 days", instructions: "Take before breakfast" },
              ].map((m, i) => (
                <div key={i} className="p-3 border rounded space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">{m.name} {m.strength} {m.form}</p>
                    <Button variant="ghost" size="sm" className="text-destructive">Remove</Button>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div><Label className="text-xs">Frequency</Label><Input defaultValue={m.freq} /></div>
                    <div><Label className="text-xs">Duration</Label><Input defaultValue={m.duration} /></div>
                    <div><Label className="text-xs">Qty</Label><Input defaultValue={i === 0 ? "10" : "5"} /></div>
                  </div>
                  <Input defaultValue={m.instructions} placeholder="Instructions" />
                </div>
              ))}
            </div>
            <div className="p-3 bg-muted rounded space-y-1">
              <p className="text-xs font-semibold">Pharmacy Notes</p>
              <Textarea placeholder="Additional notes for pharmacy…" rows={2} />
            </div>
            <Button className="w-full"><Pill className="mr-2 h-4 w-4" />Generate Prescription</Button>
          </div>
        </SectionCard>

        <div className="space-y-4">
          <SectionCard title="Drug Interaction Check">
            <div className="space-y-2">
              <div className="p-3 rounded bg-green-50 border border-green-200 flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-700">No Drug Interactions Found</p>
                  <p className="text-xs text-green-600">Naproxen + Omeprazole — Safe combination (PPI gastroprotection)</p>
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Allergy Check">
            <div className="space-y-2">
              <div className="p-3 rounded bg-amber-50 border border-amber-200 flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <div>
                  <p className="text-sm font-medium text-amber-700">Patient Allergy: Penicillin</p>
                  <p className="text-xs text-amber-600">No penicillin-class drugs in current prescription. Verified safe.</p>
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Prescription Preview">
            <div className="p-4 border rounded space-y-3">
              <div className="text-center border-b pb-3">
                <p className="font-bold">Dr. Priya Sharma</p>
                <p className="text-xs text-muted-foreground">MBBS, MD (Medicine) — Reg: MCI-12345</p>
                <p className="text-xs text-muted-foreground">Consultation: Telemedicine — 25 Jul 2026</p>
              </div>
              <div className="space-y-2 text-sm">
                <p><strong>Patient:</strong> Lakshmi Iyer (29/F)</p>
                <p><strong>Diagnosis:</strong> Tension-type headache (G44.2)</p>
                <Separator />
                <div className="space-y-1">
                  <p>1. Tab Naproxen 250mg — BD x 5 days — After food</p>
                  <p>2. Cap Omeprazole 20mg — OD x 5 days — Before breakfast</p>
                </div>
                <Separator />
                <p className="text-xs text-muted-foreground">Follow up if no improvement in 1 week.</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Digitally Signed — {new Date().toLocaleString("en-IN")}</span>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

/* ── Screen: Lab & Radiology Orders ───────────────────────────────────────── */
function LabRadiologyScreen() {
  return (
    <div className="space-y-4">
      <PageHeader title="Laboratory & Radiology Orders" subtitle="Diagnostic test ordering and tracking" icon={TestTube2}
        actions={<><Button size="sm"><Plus className="mr-1.5 size-4" />New Order</Button><Button variant="outline" size="sm"><Download className="mr-1.5 size-4" />Export</Button></>} />

      <Tabs defaultValue="lab">
        <TabsList>
          <TabsTrigger value="lab">Laboratory Orders</TabsTrigger>
          <TabsTrigger value="radiology">Radiology Orders</TabsTrigger>
          <TabsTrigger value="packages">Diagnostic Packages</TabsTrigger>
        </TabsList>

        <TabsContent value="lab">
          <SectionCard title="Laboratory Orders">
            <div className="space-y-3">
              {LAB_ORDERS.map(o => (
                <div key={o.id} className="p-4 rounded-lg border space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-sm">{o.patientName}</p>
                      <p className="text-xs text-muted-foreground">{o.id} — {o.providerName}</p>
                    </div>
                    <StatusBadge tone={o.status === "Completed" ? "success" : "warning"}>{o.status}</StatusBadge>
                  </div>
                  <div className="space-y-1">
                    {o.tests.map((t, i) => (
                      <div key={i} className="flex items-center justify-between p-2 bg-muted rounded text-xs">
                        <span>{t.name}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{t.category}</Badge>
                          <StatusBadge tone={t.priority === "Urgent" ? "danger" : "info"}>{t.priority}</StatusBadge>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">Clinical Notes: {o.clinicalNotes}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="radiology">
          <SectionCard title="Radiology Orders">
            <div className="space-y-3">
              {RADIOLOGY_ORDERS.map(o => (
                <div key={o.id} className="p-4 rounded-lg border space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-sm">{o.patientName}</p>
                      <p className="text-xs text-muted-foreground">{o.id} — {o.providerName}</p>
                    </div>
                    <StatusBadge tone={o.status === "Completed" ? "success" : "warning"}>{o.status}</StatusBadge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div><span className="text-muted-foreground">Study:</span> <span className="font-medium">{o.study}</span></div>
                    <div><span className="text-muted-foreground">Body Part:</span> <span>{o.bodyPart}</span></div>
                    <div><span className="text-muted-foreground">Indication:</span> <span>{o.indication}</span></div>
                    <div><span className="text-muted-foreground">Priority:</span> <StatusBadge tone={o.priority === "Urgent" ? "danger" : "info"}>{o.priority}</StatusBadge></div>
                  </div>
                  <p className="text-xs text-muted-foreground">Notes: {o.clinicalNotes}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="packages">
          <SectionCard title="Diagnostic Packages">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { name: "General Health Check", tests: "CBC, CMP, Lipid, Thyroid, Urine", price: 2500 },
                { name: "Cardiac Package", tests: "ECG, Echo, Troponin, BNP, Lipid", price: 5000 },
                { name: "Diabetes Panel", tests: "Fasting Glucose, HbA1c, Insulin, Renal", price: 3000 },
              ].map((p, i) => (
                <div key={i} className="p-4 rounded-lg border space-y-2">
                  <h4 className="font-semibold text-sm">{p.name}</h4>
                  <p className="text-xs text-muted-foreground">{p.tests}</p>
                  <p className="text-lg font-bold">Rs.{p.price.toLocaleString("en-IN")}</p>
                  <Button size="sm" className="w-full">Order Package</Button>
                </div>
              ))}
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ── Screen: Secure Messaging ─────────────────────────────────────────────── */
function SecureMessagingScreen() {
  return (
    <div className="space-y-4">
      <PageHeader title="Secure Messaging" subtitle="HIPAA-compliant patient-provider communication" icon={MessageSquare} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SectionCard title="Conversations" className="lg:col-span-1">
          <div className="space-y-2">
            {SECURE_MESSAGES.filter((m, i, arr) => arr.findIndex(x => x.senderId === m.senderId || x.receiverId === m.senderId) === i).map((m, i) => (
              <div key={i} className="p-3 rounded-lg border cursor-pointer hover:bg-accent transition">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10"><AvatarFallback>{m.senderName.split(" ").map(n => n[0]).join("")}</AvatarFallback></Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm truncate">{m.senderName}</p>
                      <StatusBadge tone={m.status === "Unread" ? "warning" : "info"}>{m.status}</StatusBadge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{m.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Chat — Amit Joshi" className="lg:col-span-2">
          <div className="space-y-3">
            <ScrollArea className="h-80">
              <div className="space-y-2 p-2">
                {SECURE_MESSAGES.filter(m => m.consultationId === "VAP-001").map(m => (
                  <MessageBubble key={m.id} m={m} isOwn={m.senderId === "DR-001"} />
                ))}
              </div>
            </ScrollArea>
            <div className="flex gap-2">
              <Button variant="outline" size="icon"><Paperclip className="h-4 w-4" /></Button>
              <Input placeholder="Type a message…" className="flex-1" />
              <Button size="icon"><Send className="h-4 w-4" /></Button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {["Thank you", "Please join waiting room", "Prescription sent", "Follow-up needed"].map((t, i) => (
                <Button key={i} variant="outline" size="sm" className="text-xs">{t}</Button>
              ))}
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

/* ── Screen: File & Image Viewer ──────────────────────────────────────────── */
function FileImageViewerScreen() {
  return (
    <div className="space-y-4">
      <PageHeader title="File & Image Viewer" subtitle="Medical reports, radiology images, clinical photographs" icon={ImageIcon} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SectionCard title="Files" className="lg:col-span-1">
          <div className="space-y-2">
            {[
              { name: "chest_xray_2025.pdf", type: "PDF", size: "2.4 MB", patient: "Amit Joshi", date: "2026-07-24" },
              { name: "blood_test_report.pdf", type: "PDF", size: "1.1 MB", patient: "Amit Joshi", date: "2026-07-20" },
              { name: "ecg_report.pdf", type: "PDF", size: "890 KB", patient: "Meera Gupta", date: "2026-07-18" },
              { name: "skin_lesion.jpg", type: "Image", size: "3.2 MB", patient: "Ravi Teja", date: "2026-07-15" },
              { name: "mri_knee.dcm", type: "DICOM", size: "45 MB", patient: "Deepak Nair", date: "2026-07-10" },
            ].map((f, i) => (
              <div key={i} className="p-3 rounded-lg border cursor-pointer hover:bg-accent transition">
                <div className="flex items-center gap-3">
                  <File className="h-5 w-5 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{f.name}</p>
                    <p className="text-xs text-muted-foreground">{f.patient} — {f.size}</p>
                  </div>
                  <Badge variant="outline">{f.type}</Badge>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Viewer" className="lg:col-span-2">
          <div className="space-y-3">
            <div className="aspect-[4/3] bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <ImageIcon className="h-16 w-16 mx-auto mb-2" />
                <p>Select a file to view</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Button variant="outline" size="sm"><ZoomIn className="mr-1 h-4 w-4" />Zoom In</Button>
              <Button variant="outline" size="sm"><ZoomOut className="mr-1 h-4 w-4" />Zoom Out</Button>
              <Button variant="outline" size="sm"><Download className="mr-1 h-4 w-4" />Download</Button>
              <Button variant="outline" size="sm"><Printer className="mr-1 h-4 w-4" />Print</Button>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

function ZoomIn(props: React.SVGProps<SVGSVGElement>) { return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="M11 8v6M8 11h6"/></svg>; }
function ZoomOut(props: React.SVGProps<SVGSVGElement>) { return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="M8 11h6"/></svg>; }
function Printer(props: React.SVGProps<SVGSVGElement>) { return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>; }

/* ── Screen: Billing Integration ──────────────────────────────────────────── */
function BillingScreen() {
  return (
    <div className="space-y-4">
      <PageHeader title="Billing Integration" subtitle="Consultation charges, insurance, online payments" icon={CreditCard}
        actions={<Button size="sm"><Download className="mr-1.5 size-4" />Export Invoices</Button>} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total Revenue" value={formatCurrency(BILLING_RECORDS.reduce((a, b) => a + b.netAmount, 0))} icon={CreditCard} />
        <StatCard label="Paid" value={BILLING_RECORDS.filter(b => b.paymentStatus === "Paid").length} icon={CheckCircle} />
        <StatCard label="Refunded" value={BILLING_RECORDS.filter(b => b.paymentStatus === "Refunded").length} icon={TrendingDown} />
        <StatCard label="Insurance Claims" value={BILLING_RECORDS.filter(b => b.insuranceClaim).length} icon={Shield} />
      </div>

      <SectionCard title="Invoices">
        <div className="space-y-3">
          {BILLING_RECORDS.map(b => (
            <BillingRow key={b.id} b={b} />
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

/* ── Screen: Follow-up Scheduling ─────────────────────────────────────────── */
function FollowUpScreen() {
  return (
    <div className="space-y-4">
      <PageHeader title="Follow-up Scheduling" subtitle="Next visits, reminders, recurring appointments" icon={CalendarClock}
        actions={<Button size="sm"><CalendarClock className="mr-1.5 size-4" />Schedule Follow-up</Button>} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Scheduled" value={FOLLOW_UP_PLANS.length} icon={Calendar} />
        <StatCard label="Reminder Sent" value={FOLLOW_UP_PLANS.filter(f => f.notified).length} icon={Bell} />
        <StatCard label="Recurring" value={FOLLOW_UP_PLANS.filter(f => f.recurring).length} icon={RefreshCw} />
        <StatCard label="Referrals" value={FOLLOW_UP_PLANS.filter(f => f.referralRequired).length} icon={ArrowRight} />
      </div>

      <SectionCard title="Follow-up Plans">
        <div className="space-y-3">
          {FOLLOW_UP_PLANS.map(f => (
            <div key={f.id} className="p-4 rounded-lg border space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-sm">{f.patientName}</p>
                  <p className="text-xs text-muted-foreground">{f.providerName} — {f.specialty || "General Medicine"}</p>
                </div>
                <Badge variant="outline">{f.visitType}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1 text-muted-foreground"><Calendar className="h-3 w-3" /><span>{f.nextVisitDate}</span></div>
                <div className="flex items-center gap-1 text-muted-foreground"><Bell className="h-3 w-3" /><span>Reminder: {f.reminderSet ? "Set" : "Not Set"}</span></div>
                {f.recurring && <div className="flex items-center gap-1 text-muted-foreground"><RefreshCw className="h-3 w-3" /><span>Recurring</span></div>}
                {f.referralRequired && <div className="flex items-center gap-1 text-muted-foreground"><ArrowRight className="h-3 w-3" /><span>Referral: {f.referralSpecialty}</span></div>}
              </div>
              <p className="text-xs text-muted-foreground">{f.reason}</p>
              <p className="text-xs text-muted-foreground">Instructions: {f.instructions}</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

/* ── Screen: Provider Analytics ───────────────────────────────────────────── */
function ProviderAnalyticsScreen() {
  return (
    <div className="space-y-4">
      <PageHeader title="Provider Analytics" subtitle="Consultation volume, satisfaction, revenue, productivity" icon={BarChart3}
        actions={<><Button variant="outline" size="sm"><Download className="mr-1.5 size-4" />Export</Button><Button variant="outline" size="sm"><RefreshCw className="mr-1.5 size-4" />Refresh</Button></>} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {PROVIDER_ANALYTICS.slice(0, 4).map((a, i) => (
          <StatCard key={i} label={a.metric} value={a.value} icon={a.trend === "up" ? TrendingUp : a.trend === "down" ? TrendingDown : Activity} />
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {PROVIDER_ANALYTICS.slice(4).map((a, i) => (
          <StatCard key={i} label={a.metric} value={a.value} icon={a.trend === "up" ? TrendingUp : a.trend === "down" ? TrendingDown : Activity} />
        ))}
      </div>

      <SectionCard title="Consultation Volume by Day">
        <div className="space-y-2">
          {[
            { day: "Mon", count: 18, revenue: 14400 },
            { day: "Tue", count: 22, revenue: 17600 },
            { day: "Wed", count: 15, revenue: 12000 },
            { day: "Thu", count: 20, revenue: 16000 },
            { day: "Fri", count: 25, revenue: 20000 },
            { day: "Sat", count: 12, revenue: 9600 },
            { day: "Sun", count: 0, revenue: 0 },
          ].map((d, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-sm w-10">{d.day}</span>
              <div className="flex-1 bg-muted rounded-full h-6">
                <div className="bg-primary h-6 rounded-full flex items-center pl-2" style={{ width: `${(d.count / 25) * 100}%` }}>
                  {d.count > 0 && <span className="text-xs text-primary-foreground font-medium">{d.count}</span>}
                </div>
              </div>
              <span className="text-sm text-muted-foreground w-20 text-right">Rs.{d.revenue.toLocaleString("en-IN")}</span>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Patient Satisfaction Breakdown">
        <div className="space-y-2">
          {[
            { stars: 5, count: 45, pct: 55 },
            { stars: 4, count: 28, pct: 34 },
            { stars: 3, count: 6, pct: 7 },
            { stars: 2, count: 2, pct: 2 },
            { stars: 1, count: 1, pct: 1 },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-sm w-12">{s.stars} <Star className="h-3 w-3 inline" /></span>
              <div className="flex-1 bg-muted rounded-full h-4">
                <div className="bg-yellow-500 h-4 rounded-full" style={{ width: `${s.pct}%` }} />
              </div>
              <span className="text-sm text-muted-foreground w-16 text-right">{s.count} ({s.pct}%)</span>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

/* ── Screen: Clinical Quality ─────────────────────────────────────────────── */
function ClinicalQualityScreen() {
  return (
    <div className="space-y-4">
      <PageHeader title="Clinical Quality" subtitle="Documentation completeness, safety, compliance" icon={ShieldCheck} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Compliance Score" value="96%" icon={ShieldCheck} />
        <StatCard label="Safety Incidents" value={0} icon={AlertTriangle} />
        <StatCard label="Patient Complaints" value={1} icon={CircleAlert} />
        <StatCard label="Audit Pass Rate" value="98%" icon={ClipboardCheck} />
      </div>

      <SectionCard title="Quality Metrics">
        <div className="space-y-1">
          {QUALITY_METRICS.map((q, i) => (
            <QualityMetricRow key={i} q={q} />
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Compliance Dashboard">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { category: "Documentation", score: 96, items: ["SOAP notes complete", "ICD-10 coded", "Vitals recorded"] },
            { category: "Prescription Safety", score: 99, items: ["Drug interactions checked", "Allergies verified", "Digital signature"] },
            { category: "Consent Compliance", score: 100, items: ["Telemedicine consent", "Privacy notice", "OTP verified"] },
          ].map((c, i) => (
            <div key={i} className="p-4 rounded-lg border space-y-2">
              <h4 className="font-semibold text-sm">{c.category}</h4>
              <div className="flex items-center gap-2">
                <Progress value={c.score} className="flex-1" />
                <span className="text-sm font-medium">{c.score}%</span>
              </div>
              <div className="space-y-1">
                {c.items.map((item, j) => (
                  <div key={j} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle className="h-3 w-3 text-green-600" />{item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

/* ── Screen: Device & Connectivity ────────────────────────────────────────── */
function DeviceConnectivityScreen() {
  return (
    <div className="space-y-4">
      <PageHeader title="Device & Connectivity" subtitle="Camera, microphone, browser, network testing" icon={WifiIcon} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Connection Issues" value={TELEMEDICINE_KPI.connectivityIssues} icon={WifiOff} />
        <StatCard label="Avg Speed" value="25 Mbps" icon={WifiIcon} />
        <StatCard label="Active Sessions" value={TELEMEDICINE_KPI.activeSessions} icon={Video} />
        <StatCard label="Device Compatibility" value="100%" icon={Smartphone} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="Device Tests">
          <div className="space-y-3">
            {[
              { name: "Camera Test", status: "Pass", detail: "HD 1080p — Front camera working", icon: Camera },
              { name: "Microphone Test", status: "Pass", detail: "Clear audio — No background noise", icon: Mic },
              { name: "Speaker Test", status: "Pass", detail: "Audio output working — Volume adequate", icon: Headphones },
              { name: "Internet Speed", status: "Good", detail: "Download: 45.2 Mbps / Upload: 12.8 Mbps", icon: WifiIcon },
              { name: "Browser Compatibility", status: "Pass", detail: "Chrome 125 — Full support", icon: Globe },
              { name: "Device Compatibility", status: "Pass", detail: "Desktop — Windows 11 — Chrome 125", icon: Laptop },
            ].map((t, i) => (
              <div key={i} className="flex items-center gap-3 p-3 border rounded">
                <t.icon className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.detail}</p>
                </div>
                <StatusBadge tone={t.status === "Pass" || t.status === "Good" ? "success" : "warning"}>{t.status}</StatusBadge>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Connection History">
          <div className="space-y-1">
            {CONNECTIVITY_LOGS.map(c => (
              <ConnectivityRow key={c.id} c={c} />
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Troubleshooting Guide">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { issue: "Poor Video Quality", solution: "Check internet speed (min 5 Mbps). Close other tabs. Move closer to router." },
            { issue: "Audio Not Working", solution: "Check browser permissions for microphone. Restart browser. Test with headphone." },
            { issue: "Screen Sharing Failed", solution: "Use Chrome browser. Grant screen sharing permission. Try window share instead of full screen." },
            { issue: "Connection Dropping", solution: "Switch to audio-only. Move to stable WiFi. Disable VPN. Close bandwidth-heavy apps." },
          ].map((t, i) => (
            <div key={i} className="p-3 rounded-lg border space-y-1">
              <p className="text-sm font-medium">{t.issue}</p>
              <p className="text-xs text-muted-foreground">{t.solution}</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

/* ── Screen: Reports & Audit Logs ─────────────────────────────────────────── */
function ReportsAuditScreen() {
  return (
    <div className="space-y-4">
      <PageHeader title="Reports & Audit Logs" subtitle="Consultation history, access logs, compliance reports" icon={BookOpen}
        actions={<><Button size="sm"><Download className="mr-1.5 size-4" />Export All</Button><Button variant="outline" size="sm"><RefreshCw className="mr-1.5 size-4" />Refresh</Button></>} />

      <Tabs defaultValue="audit">
        <TabsList>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          <TabsTrigger value="consultation">Consultation History</TabsTrigger>
          <TabsTrigger value="billing">Billing Reports</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="audit">
          <SectionCard title="Audit Trail">
            <div className="space-y-1">
              {AUDIT_LOGS.map(e => (
                <AuditEntryRow key={e.id} e={e} />
              ))}
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="consultation">
          <SectionCard title="Consultation History">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {VIRTUAL_APPOINTMENTS.filter(a => a.status === "Completed").map(a => (
                  <TableRow key={a.id}>
                    <TableCell className="font-mono text-xs">{a.id}</TableCell>
                    <TableCell className="font-medium">{a.patientName}</TableCell>
                    <TableCell>{a.providerName}</TableCell>
                    <TableCell><Badge variant="outline">{a.consultType}</Badge></TableCell>
                    <TableCell>{new Date(a.appointmentTime).toLocaleDateString("en-IN")}</TableCell>
                    <TableCell><StatusBadge tone="success">{a.status}</StatusBadge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </SectionCard>
        </TabsContent>

        <TabsContent value="billing">
          <SectionCard title="Billing Summary">
            <div className="space-y-3">
              {BILLING_RECORDS.map(b => (
                <BillingRow key={b.id} b={b} />
              ))}
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="compliance">
          <SectionCard title="Compliance Reports">
            <div className="space-y-1">
              {QUALITY_METRICS.map((q, i) => (
                <QualityMetricRow key={i} q={q} />
              ))}
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ── Screen: Workflow Complete ────────────────────────────────────────────── */
function WorkflowCompleteScreen() {
  return (
    <div className="space-y-4">
      <PageHeader title="Workflow Complete" subtitle="End-to-end telemedicine consultation workflow" icon={CheckCircle} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SectionCard title="Consultation Summary" className="lg:col-span-2">
          <div className="space-y-3">
            {[
              { step: "1", title: "Virtual Appointment Booked", desc: "Patient booked video consultation via portal", date: "2026-07-24", status: "completed" },
              { step: "2", title: "Digital Patient Intake", desc: "Chief complaint, symptoms, history, medications recorded", date: "2026-07-25 08:45", status: "completed" },
              { step: "3", title: "Identity Verified", desc: "Aadhaar verified via OTP — ABDM compliant", date: "2026-07-25 08:48", status: "completed" },
              { step: "4", title: "Digital Consent Signed", desc: "Telemedicine consent + Privacy notice — OTP verified", date: "2026-07-25 08:50", status: "completed" },
              { step: "5", title: "Virtual Waiting Room", desc: "Patient checked in — Connectivity: Excellent", date: "2026-07-25 08:52", status: "completed" },
              { step: "6", title: "Video Consultation", desc: "HD Video — 12:34 minutes — Audio clear", date: "2026-07-25 09:00", status: "completed" },
              { step: "7", title: "Clinical Documentation", desc: "SOAP notes — ICD-10: G44.2, R51 — AI-assisted", date: "2026-07-25 09:12", status: "completed" },
              { step: "8", title: "E-Prescription", desc: "Naproxen 250mg BD + Omeprazole 20mg OD — Digital signature", date: "2026-07-25 09:15", status: "completed" },
              { step: "9", title: "Lab & Radiology Orders", desc: "CBC, CRP ordered — Chest X-ray requested", date: "2026-07-25 09:16", status: "completed" },
              { step: "10", title: "Billing Completed", desc: "Rs.1,003 paid via UPI — Insurance claim submitted", date: "2026-07-25 09:18", status: "completed" },
              { step: "11", title: "Follow-up Scheduled", desc: "1 Aug 2026 — Video consultation — Reminder set", date: "2026-07-25 09:20", status: "completed" },
              { step: "12", title: "Patient Portal Synced", desc: "Prescription, notes, orders synced to patient portal", date: "2026-07-25 09:21", status: "completed" },
              { step: "13", title: "Audit Recorded", desc: "Complete consultation audit trail logged", date: "2026-07-25 09:22", status: "completed" },
            ].map(s => (
              <div key={s.step} className="flex items-start gap-3 p-3 rounded-lg border bg-green-50 border-green-200">
                <div className="h-8 w-8 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm">{s.title}</p>
                  <p className="text-xs text-muted-foreground">{s.desc}</p>
                  <p className="text-xs text-muted-foreground mt-1">{s.date}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <div className="space-y-4">
          <SectionCard title="Workflow Summary">
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                <p className="text-sm font-medium text-green-700">13/13 Steps Completed</p>
                <Progress value={100} className="mt-2" />
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Patient</span><span className="font-medium">Amit Joshi</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Provider</span><span className="font-medium">Dr. Priya Sharma</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Duration</span><span className="font-medium">12:34 min</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Revenue</span><span className="font-medium">{formatCurrency(1003)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Consultation ID</span><span className="font-mono text-xs">VAP-007</span></div>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Quick Actions">
            <div className="space-y-2">
              <Button className="w-full" variant="outline"><FileText className="mr-2 h-4 w-4" />Generate Summary PDF</Button>
              <Button className="w-full" variant="outline"><Send className="mr-2 h-4 w-4" />Send to Patient</Button>
              <Button className="w-full" variant="outline"><Download className="mr-2 h-4 w-4" />Export to EMR</Button>
              <Button className="w-full" variant="outline"><Printer className="mr-2 h-4 w-4" />Print Prescription</Button>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
