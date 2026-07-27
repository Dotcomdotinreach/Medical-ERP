import { useState, useEffect } from "react";
import { useApi } from "../../hooks/useApi";
import { portalApi } from "../../services/portal";
import type { Workspace } from "../his/Shell";
import {
  Home, Calendar, FileText, Pill, CreditCard, Video, AlertTriangle, Bell,
  Users, Settings, Search, ChevronRight, Download, Share2, Star, Clock,
  Phone, MapPin, Camera, CheckCircle2, XCircle, ArrowRight, MessageSquare,
  Shield, LogOut, Heart, Package, User, CircleDot, Play, Pause, Mic, MicOff,
  Monitor, Send, Paperclip, Image as ImageIcon, Info, Zap, Stethoscope,
  Thermometer, Activity, CalendarDays, Wallet, PillBottle, FlaskConical,
  ScanLine, Circle, ChevronDown, RefreshCw, RotateCcw, Eye,
  Globe, Moon, Fingerprint, HelpCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  MobileHeader, MobileStatCard, MobileSection, Badge, PatientAvatar,
  HealthScoreRing, QuickAction, BottomNav, BellIcon, SOSButton, EmptyState,
  TabBar, ProgressBar, FAB, AppointmentBadge, ReportBadge, PaymentBadge,
  ClaimBadge, ReminderStatusBadge,
} from "./patientPortalUi";
import {
  PATIENT_PROFILE, FAMILY_MEMBERS, APPOINTMENTS, DOCTORS, PRESCRIPTIONS,
  LAB_REPORTS, RADIOLOGY_REPORTS, MEDICATION_REMINDERS, INSURANCE_POLICY,
  INSURANCE_CLAIMS, INVOICES, TELECONSULTATIONS, NOTIFICATIONS,
  EMERGENCY_CONTACTS, HEALTH_PACKAGES, HEALTH_SCORE, formatINR, timeAgo,
  type Appointment,
} from "./data";

type PortalRoute =
  | "splash" | "onboarding" | "login" | "dashboard" | "appointments"
  | "book-appointment" | "health-record" | "prescriptions" | "lab-reports"
  | "radiology-reports" | "medication-reminder" | "insurance-billing"
  | "teleconsultation" | "emergency" | "notifications" | "family"
  | "profile-settings" | "feedback" | "health-packages" | "complete";

const BOTTOM_NAV = [
  { id: "dashboard", label: "Home", icon: Home },
  { id: "appointments", label: "Appointments", icon: Calendar },
  { id: "health-record", label: "Records", icon: FileText },
  { id: "notifications", label: "Alerts", icon: Bell, badge: 4 },
  { id: "profile-settings", label: "Profile", icon: User },
];

export function PatientPortalApp({ roleName, onSignOut, onSwitchWorkspace, onOpenSettings }: {
  roleName: string; onSignOut: () => void; onSwitchWorkspace: (w: Workspace) => void; onOpenSettings?: (page: string) => void;
}) {
  const [route, setRoute] = useState<PortalRoute>("splash");
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [selectedDoctor, setSelectedDoctor] = useState(DOCTORS[0]);
  const [selectedDate, setSelectedDate] = useState("2026-07-25");
  const [selectedSlot, setSelectedSlot] = useState("10:00");
  const [consultType, setConsultType] = useState<"In-Person" | "Video" | "Audio">("In-Person");
  const [activeBottomNav, setActiveBottomNav] = useState("dashboard");
  const [reminders, setReminders] = useState(MEDICATION_REMINDERS);
  const [selectedTab, setSelectedTab] = useState("Upcoming");
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [sosStatus, setSosStatus] = useState<"Idle" | "Activating" | "Active">("Idle");
  const [feedbackText, setFeedbackText] = useState("");
  const [loginMethod, setLoginMethod] = useState<"otp" | "biometric">("otp");
  const [otp, setOtp] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(PATIENT_PROFILE.mobile);
  const [selectedPackage, setSelectedPackage] = useState<typeof HEALTH_PACKAGES[0] | null>(null);

  const [liveData, setLiveData] = useState({
    appointments: APPOINTMENTS,
    labResults: LAB_REPORTS,
    invoices: INVOICES,
    prescriptions: PRESCRIPTIONS,
  });

  const { data: appointmentsData, refetch: refetchAppointments } = useApi(
    () => portalApi.getAppointments({ status: "Upcoming" }).then(r => {
      setLiveData(prev => ({ ...prev, appointments: r.data }));
      return { data: r.data };
    }),
    APPOINTMENTS
  );
  const { data: labResultsData } = useApi(
    () => portalApi.getLabResults({}).then(r => {
      setLiveData(prev => ({ ...prev, labResults: r.data }));
      return { data: r.data };
    }),
    LAB_REPORTS
  );
  const { data: invoicesData } = useApi(
    () => portalApi.getInvoices({ status: "Pending" }).then(r => {
      setLiveData(prev => ({ ...prev, invoices: r.data }));
      return { data: r.data };
    }),
    INVOICES
  );
  const { data: prescriptionsData } = useApi(
    () => portalApi.getPrescriptions({}).then(r => {
      setLiveData(prev => ({ ...prev, prescriptions: r.data }));
      return { data: r.data };
    }),
    PRESCRIPTIONS
  );

  useEffect(() => {
    if (route === "dashboard" || route === "appointments") {
      refetchAppointments();
    }
  }, [route, refetchAppointments]);

  /* Splash auto-advance */
  useEffect(() => {
    if (route === "splash") {
      const t = setTimeout(() => setRoute("onboarding"), 2500);
      return () => clearTimeout(t);
    }
  }, [route]);

  const navigateBottomNav = (id: string) => {
    setActiveBottomNav(id);
    setRoute(id as PortalRoute);
  };

  const unreadNotifications = NOTIFICATIONS.filter(n => !n.read).length;

  /* ========================= 1. Splash Screen ========================= */
  function Splash() {
    return (
      <div className="flex h-[100dvh] flex-col items-center justify-center bg-gradient-to-b from-[#0052CC] to-[#003D99] text-white">
        <div className="grid size-24 place-items-center rounded-3xl bg-white/20 backdrop-blur-sm mb-6">
          <Stethoscope className="size-12" />
        </div>
        <h1 className="text-[28px] font-bold">Meridian Health</h1>
        <p className="mt-1 text-[14px] text-white/70">Your Health, Your Control</p>
        <div className="mt-8 flex items-center gap-2">
          <div className="size-2 animate-bounce rounded-full bg-white/60" style={{ animationDelay: "0ms" }} />
          <div className="size-2 animate-bounce rounded-full bg-white/60" style={{ animationDelay: "150ms" }} />
          <div className="size-2 animate-bounce rounded-full bg-white/60" style={{ animationDelay: "300ms" }} />
        </div>
        <p className="mt-6 text-[11px] text-white/50">Version 2.4.1 • HIPAA Compliant</p>
      </div>
    );
  }

  /* ========================= 2. Onboarding ========================= */
  function Onboarding() {
    const slides = [
      { icon: Calendar, title: "Book Appointments", desc: "Schedule visits with top doctors in seconds. Choose your specialist, pick a time, and you're set." },
      { icon: FileText, title: "Digital Health Records", desc: "Access prescriptions, lab reports, and radiology results anytime, anywhere. Your health data in your pocket." },
      { icon: Video, title: "Teleconsultation", desc: "Consult doctors from home via video, audio, or chat. Get prescriptions without visiting the hospital." },
      { icon: AlertTriangle, title: "Emergency SOS", desc: "One-tap emergency call with live location sharing and ambulance tracking when every second counts." },
    ];
    const slide = slides[onboardingStep];
    return (
      <div className="flex h-[100dvh] flex-col bg-white px-6 pt-16">
        <div className="flex-1 flex flex-col items-center text-center">
          <div className="mb-8 grid size-20 place-items-center rounded-3xl bg-[#0052CC]/10">
            <slide.icon className="size-10 text-[#0052CC]" />
          </div>
          <h2 className="text-[22px] font-bold text-[#111827]">{slide.title}</h2>
          <p className="mt-3 max-w-xs text-[14px] leading-relaxed text-[#6B7280]">{slide.desc}</p>
          <div className="mt-8 flex gap-2">
            {slides.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all ${i === onboardingStep ? "w-8 bg-[#0052CC]" : "w-2 bg-[#D1D5DB]"}`} />
            ))}
          </div>
        </div>
        <div className="pb-10 space-y-3">
          {onboardingStep < slides.length - 1 ? (
            <button onClick={() => setOnboardingStep(s => s + 1)}
              className="w-full rounded-2xl bg-[#0052CC] py-4 text-[15px] font-semibold text-white active:bg-[#0043A8]">
              Next
            </button>
          ) : (
            <button onClick={() => setRoute("login")}
              className="w-full rounded-2xl bg-[#0052CC] py-4 text-[15px] font-semibold text-white active:bg-[#0043A8]">
              Get Started
            </button>
          )}
          <button onClick={() => setRoute("login")}
            className="w-full py-3 text-[14px] font-medium text-[#6B7280]">
            Skip
          </button>
        </div>
      </div>
    );
  }

  /* ========================= 3. Login ========================= */
  function Login() {
    return (
      <div className="flex h-[100dvh] flex-col bg-white px-6 pt-16">
        <div className="flex-1">
          <div className="mb-8 flex items-center gap-3">
            <div className="grid size-12 place-items-center rounded-2xl bg-[#0052CC]/10">
              <Stethoscope className="size-6 text-[#0052CC]" />
            </div>
            <div>
              <h1 className="text-[22px] font-bold text-[#111827]">Welcome Back</h1>
              <p className="text-[13px] text-[#6B7280]">Sign in to your health portal</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-[#111827]">Mobile Number</label>
              <div className="flex rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3">
                <span className="mr-2 text-[14px] text-[#6B7280]">+91</span>
                <input type="tel" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)}
                  className="flex-1 bg-transparent text-[15px] text-[#111827] outline-none placeholder:text-[#9CA3AF]"
                  placeholder="Enter mobile number" />
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={() => setLoginMethod("otp")}
                className={`flex-1 rounded-2xl py-3 text-[13px] font-semibold transition ${loginMethod === "otp" ? "bg-[#0052CC] text-white" : "bg-[#F3F4F6] text-[#6B7280]"}`}>
                OTP Login
              </button>
              <button onClick={() => setLoginMethod("biometric")}
                className={`flex-1 rounded-2xl py-3 text-[13px] font-semibold transition ${loginMethod === "biometric" ? "bg-[#0052CC] text-white" : "bg-[#F3F4F6] text-[#6B7280]"}`}>
                Biometric
              </button>
            </div>

            {loginMethod === "otp" ? (
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-[#111827]">Enter OTP</label>
                <div className="flex gap-2">
                  {[0,1,2,3,4,5].map(i => (
                    <input key={i} maxLength={1}
                      className="h-12 w-12 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] text-center text-[18px] font-bold text-[#111827] outline-none focus:border-[#0052CC]"
                      value={otp[i] || ""} onChange={e => setOtp(otp.slice(0, i) + e.target.value + otp.slice(i + 1))} />
                  ))}
                </div>
                <p className="mt-2 text-[12px] text-[#6B7280]">OTP sent to +91 {phoneNumber}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] py-10">
                <div className="grid size-16 place-items-center rounded-full bg-[#0052CC]/10 mb-3">
                  <Shield className="size-8 text-[#0052CC]" />
                </div>
                <p className="text-[14px] font-medium text-[#111827]">Touch Sensor to Authenticate</p>
                <p className="mt-1 text-[12px] text-[#6B7280]">Use Face ID or Fingerprint</p>
              </div>
            )}

            <button onClick={() => { toast.success("Logged in successfully"); setRoute("dashboard"); }}
              className="w-full rounded-2xl bg-[#0052CC] py-4 text-[15px] font-semibold text-white active:bg-[#0043A8]">
              {loginMethod === "otp" ? "Verify OTP" : "Authenticate"}
            </button>
          </div>
        </div>

        <div className="pb-8 text-center">
          <button className="text-[13px] font-medium text-[#0052CC]">Forgot Password?</button>
          <p className="mt-3 text-[11px] text-[#9CA3AF]">Secured with 256-bit encryption • HIPAA compliant</p>
        </div>
      </div>
    );
  }

  /* ========================= 4. Dashboard ========================= */
  function Dashboard() {
    return (
      <div className="flex flex-col min-h-[100dvh] bg-[#F9FAFB] pb-24">
        <MobileHeader title={`Hi, ${PATIENT_PROFILE.name.split(" ")[0]}`} subtitle="Here's your health summary"
          rightAction={<BellIcon count={unreadNotifications} onClick={() => setRoute("notifications")} />} />

        <div className="flex-1 space-y-5 px-4 pt-4">
          {/* Health Score */}
          <MobileSection>
            <div className="flex items-center gap-5">
              <HealthScoreRing score={HEALTH_SCORE.overall} />
              <div className="flex-1 space-y-2">
                <div className="text-[14px] font-semibold text-[#111827]">Health Score</div>
                <div className="space-y-1.5">
                  {[
                    { label: "Cardiac", score: HEALTH_SCORE.cardiac, color: "#DC2626" },
                    { label: "Metabolic", score: HEALTH_SCORE.metabolic, color: "#059669" },
                    { label: "Mental", score: HEALTH_SCORE.mental, color: "#0052CC" },
                  ].map(item => (
                    <div key={item.label}>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-[#6B7280]">{item.label}</span>
                        <span className="font-medium text-[#111827]">{item.score}/100</span>
                      </div>
                      <ProgressBar value={item.score} color={item.color} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </MobileSection>

          {/* Upcoming Appointment */}
          {appointmentsData.find(a => a.status === "Upcoming") && (
            <MobileSection title="Next Appointment"
              action={<button onClick={() => setRoute("appointments")} className="text-[13px] font-medium text-[#0052CC]">View All</button>}>
              {(() => {
                const apt = appointmentsData.find(a => a.status === "Upcoming")!;
                return (
                  <div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <PatientAvatar name={apt.doctorName} size={44} />
                        <div>
                          <div className="text-[14px] font-semibold text-[#111827]">{apt.doctorName}</div>
                          <div className="text-[12px] text-[#6B7280]">{apt.doctorSpecialty}</div>
                          <div className="mt-1 flex items-center gap-1.5 text-[12px] text-[#6B7280]">
                            <CalendarDays className="size-3.5" /> {apt.date} • {apt.time}
                          </div>
                          <div className="flex items-center gap-1.5 text-[12px] text-[#6B7280]">
                            <MapPin className="size-3.5" /> {apt.room} • {apt.floor}
                          </div>
                        </div>
                      </div>
                      <AppointmentBadge status={apt.status} />
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button className="flex-1 rounded-xl bg-[#0052CC] py-2.5 text-[12px] font-semibold text-white active:bg-[#0043A8]">Check In</button>
                      <button className="rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-[12px] font-medium text-[#6B7280]">Reschedule</button>
                    </div>
                  </div>
                );
              })()}
            </MobileSection>
          )}

          {/* Today's Medications */}
          <MobileSection title="Today's Medications"
            action={<button onClick={() => setRoute("medication-reminder")} className="text-[13px] font-medium text-[#0052CC]">View All</button>}>
            <div className="space-y-2">
              {reminders.slice(0, 3).map(r => (
                <div key={r.id} className="flex items-center justify-between rounded-xl bg-[#F9FAFB] p-3">
                  <div className="flex items-center gap-3">
                    <div className={`grid size-9 place-items-center rounded-xl ${r.status === "Taken" ? "bg-[#059669]/10 text-[#059669]" : "bg-[#d97706]/10 text-[#b45309]"}`}>
                      <Pill className="size-4" />
                    </div>
                    <div>
                      <div className="text-[13px] font-medium text-[#111827]">{r.medicineName}</div>
                      <div className="text-[11px] text-[#6B7280]">{r.dosage} • {r.reminderTime} • {r.timing}</div>
                    </div>
                  </div>
                  <ReminderStatusBadge status={r.status} />
                </div>
              ))}
            </div>
          </MobileSection>

          {/* Quick Actions */}
          <div className="grid grid-cols-4 gap-3">
            <QuickAction icon={Calendar} label="Book Now" onClick={() => setRoute("book-appointment")} tone="brand" />
            <QuickAction icon={Video} label="Teleconsult" onClick={() => setRoute("teleconsultation")} tone="info" />
            <QuickAction icon={Pill} label="Medicines" onClick={() => setRoute("prescriptions")} tone="success" />
            <QuickAction icon={AlertTriangle} label="SOS" onClick={() => setRoute("emergency")} tone="danger" />
          </div>

          {/* Recent Reports */}
          <MobileSection title="Recent Reports"
            action={<button onClick={() => setRoute("lab-reports")} className="text-[13px] font-medium text-[#0052CC]">View All</button>}>
            <div className="space-y-2">
              {LAB_REPORTS.filter(r => r.status !== "Pending").slice(0, 3).map(report => (
                <div key={report.id} className="flex items-center justify-between rounded-xl bg-[#F9FAFB] p-3">
                  <div className="flex items-center gap-3">
                    <div className="grid size-9 place-items-center rounded-xl bg-[#0369a1]/10 text-[#0369a1]">
                      <FlaskConical className="size-4" />
                    </div>
                    <div>
                      <div className="text-[13px] font-medium text-[#111827]">{report.testName}</div>
                      <div className="text-[11px] text-[#6B7280]">{report.orderedDate} • {report.labName}</div>
                    </div>
                  </div>
                  <ReportBadge status={report.status} />
                </div>
              ))}
            </div>
          </MobileSection>

          {/* Outstanding Bills */}
          {invoicesData.filter(i => i.paymentStatus === "Pending").length > 0 && (
            <MobileSection title="Outstanding Bills"
              action={<button onClick={() => setRoute("insurance-billing")} className="text-[13px] font-medium text-[#0052CC]">Pay Now</button>}>
              {invoicesData.filter(i => i.paymentStatus === "Pending").map(inv => (
                <div key={inv.id} className="flex items-center justify-between rounded-xl bg-[#F9FAFB] p-3">
                  <div className="flex items-center gap-3">
                    <div className="grid size-9 place-items-center rounded-xl bg-[#d97706]/10 text-[#b45309]">
                      <CreditCard className="size-4" />
                    </div>
                    <div>
                      <div className="text-[13px] font-medium text-[#111827]">{inv.description}</div>
                      <div className="text-[11px] text-[#6B7280]">{inv.date} • {inv.invoiceNumber}</div>
                    </div>
                  </div>
                  <span className="text-[14px] font-bold text-[#DC2626]">{formatINR(inv.balanceAmount)}</span>
                </div>
              ))}
            </MobileSection>
          )}
        </div>

        <BottomNav activeId={activeBottomNav} onNavigate={navigateBottomNav} items={BOTTOM_NAV} />
      </div>
    );
  }

  /* ========================= 5. My Appointments ========================= */
  function Appointments() {
    const tabs = ["Upcoming", "Completed", "Cancelled"];
    const filtered = appointmentsData.filter(a => selectedTab === "Upcoming" ? ["Upcoming", "In Queue", "Checked In"].includes(a.status) : a.status === selectedTab);
    return (
      <div className="flex flex-col min-h-[100dvh] bg-[#F9FAFB] pb-24">
        <MobileHeader title="My Appointments" rightAction={<button onClick={() => setRoute("book-appointment")} className="rounded-xl bg-[#0052CC] px-3 py-1.5 text-[12px] font-semibold text-white">+ Book</button>} />
        <div className="px-4 pt-4"><TabBar tabs={tabs} activeTab={selectedTab} onTabChange={setSelectedTab} /></div>
        <div className="flex-1 space-y-3 px-4 pt-4">
          {filtered.length === 0 ? (
            <EmptyState icon={Calendar} title="No Appointments" description="You don't have any appointments in this category." />
          ) : filtered.map(apt => (
            <div key={apt.id} className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <PatientAvatar name={apt.doctorName} size={44} />
                  <div>
                    <div className="text-[14px] font-semibold text-[#111827]">{apt.doctorName}</div>
                    <div className="text-[12px] text-[#6B7280]">{apt.doctorSpecialty}</div>
                  </div>
                </div>
                <AppointmentBadge status={apt.status} />
              </div>
              <div className="mt-3 space-y-1 text-[12px] text-[#6B7280]">
                <div className="flex items-center gap-1.5"><CalendarDays className="size-3.5" />{apt.date} at {apt.time}</div>
                {apt.room && <div className="flex items-center gap-1.5"><MapPin className="size-3.5" />{apt.room}, {apt.floor}</div>}
                <div className="flex items-center gap-1.5"><Stethoscope className="size-3.5" />{apt.consultationType} • {apt.reason}</div>
                {apt.queueNumber && <div className="flex items-center gap-1.5"><CircleDot className="size-3.5" />Queue #{apt.queueNumber} • Token {apt.tokenNumber}</div>}
              </div>
              <div className="mt-3 flex gap-2">
                {apt.status === "Upcoming" && (
                  <>
                    <button className="flex-1 rounded-xl bg-[#0052CC] py-2.5 text-[12px] font-semibold text-white active:bg-[#0043A8]">
                      {apt.consultationType === "Video" ? "Join Call" : "Check In"}
                    </button>
                    <button className="rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-[12px] font-medium text-[#6B7280]">Reschedule</button>
                  </>
                )}
                {apt.status === "Completed" && (
                  <>
                    <button className="flex-1 rounded-xl bg-[#059669]/10 py-2.5 text-[12px] font-semibold text-[#059669]">
                      <Eye className="mr-1 inline size-3.5" />View Summary
                    </button>
                    <button onClick={() => setRoute("feedback")} className="rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-[12px] font-medium text-[#0052CC]">
                      <Star className="mr-1 inline size-3.5" />Rate
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
        <BottomNav activeId={activeBottomNav} onNavigate={navigateBottomNav} items={BOTTOM_NAV} />
      </div>
    );
  }

  /* ========================= 6. Book Appointment ========================= */
  function BookAppointment() {
    return (
      <div className="flex flex-col min-h-[100dvh] bg-[#F9FAFB] pb-24">
        <MobileHeader title="Book Appointment" onBack={() => setRoute("dashboard")} />
        <div className="flex-1 space-y-4 px-4 pt-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9CA3AF]" />
            <input className="w-full rounded-2xl border border-[#E5E7EB] bg-white py-3 pl-10 pr-4 text-[14px] text-[#111827] placeholder:text-[#9CA3AF] outline-none focus:border-[#0052CC]" placeholder="Search doctor or specialty..." />
          </div>

          {/* Consultation Type */}
          <MobileSection title="Consultation Type">
            <div className="flex gap-2">
              {(["In-Person", "Video", "Audio"] as const).map(t => (
                <button key={t} onClick={() => setConsultType(t)}
                  className={`flex-1 rounded-xl py-2.5 text-[13px] font-semibold transition ${consultType === t ? "bg-[#0052CC] text-white" : "bg-[#F3F4F6] text-[#6B7280]"}`}>
                  {t}
                </button>
              ))}
            </div>
          </MobileSection>

          {/* Doctor List */}
          <MobileSection title="Select Doctor">
            <div className="space-y-3">
              {DOCTORS.map(doc => (
                <button key={doc.id} onClick={() => { setSelectedDoctor(doc); setRoute("complete"); toast.success(`Appointment booked with ${doc.name}`); }}
                  className={`w-full rounded-xl border p-3 text-left transition ${selectedDoctor.id === doc.id ? "border-[#0052CC] bg-[#0052CC]/5" : "border-[#E5E7EB] hover:bg-[#F9FAFB]"}`}>
                  <div className="flex items-start gap-3">
                    <PatientAvatar name={doc.name} size={48} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[14px] font-semibold text-[#111827]">{doc.name}</div>
                      <div className="text-[12px] text-[#6B7280]">{doc.specialty} • {doc.experience} yrs exp</div>
                      <div className="mt-1 flex items-center gap-2">
                        <div className="flex items-center gap-0.5"><Star className="size-3 fill-[#d97706] text-[#d97706]" /><span className="text-[12px] font-medium text-[#111827]">{doc.rating}</span></div>
                        <span className="text-[11px] text-[#6B7280]">•</span>
                        <span className="text-[12px] font-semibold text-[#059669]">{formatINR(doc.consultationFee)}</span>
                      </div>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {doc.languages.slice(0, 3).map(l => <span key={l} className="rounded-full bg-[#F3F4F6] px-2 py-0.5 text-[10px] text-[#6B7280]">{l}</span>)}
                      </div>
                    </div>
                    <ChevronRight className="size-5 shrink-0 text-[#9CA3AF]" />
                  </div>
                  {/* Slots */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {doc.availableSlots.slice(0, 5).map(slot => (
                      <button key={slot} onClick={e => { e.stopPropagation(); setSelectedSlot(slot); }}
                        className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition ${selectedSlot === slot && selectedDoctor.id === doc.id ? "bg-[#0052CC] text-white" : "bg-[#F3F4F6] text-[#6B7280]"}`}>
                        {slot}
                      </button>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </MobileSection>
        </div>
      </div>
    );
  }

  /* ========================= 7. Digital Health Record ========================= */
  function HealthRecord() {
    return (
      <div className="flex flex-col min-h-[100dvh] bg-[#F9FAFB] pb-24">
        <MobileHeader title="Health Record" subtitle={PATIENT_PROFILE.uhid} rightAction={<button onClick={() => toast.info("Downloading health record...")} className="rounded-xl bg-[#F3F4F6] px-3 py-1.5 text-[12px] font-semibold text-[#0052CC]"><Download className="mr-1 inline size-3.5" />PDF</button>} />
        <div className="flex-1 space-y-4 px-4 pt-4">
          {/* Patient Info */}
          <MobileSection>
            <div className="flex items-center gap-4">
              <PatientAvatar name={PATIENT_PROFILE.name} size={56} />
              <div>
                <div className="text-[17px] font-bold text-[#111827]">{PATIENT_PROFILE.name}</div>
                <div className="text-[12px] text-[#6B7280]">UHID: {PATIENT_PROFILE.uhid}</div>
                <div className="text-[12px] text-[#6B7280]">{PATIENT_PROFILE.age} yrs • {PATIENT_PROFILE.gender} • {PATIENT_PROFILE.bloodGroup}</div>
              </div>
            </div>
          </MobileSection>

          {/* Allergies & Conditions */}
          <MobileSection title="Allergies & Conditions">
            <div className="space-y-2">
              {PATIENT_PROFILE.allergies.length > 0 && (
                <div>
                  <div className="mb-1.5 text-[12px] font-medium text-[#DC2626]">Allergies</div>
                  <div className="flex flex-wrap gap-1.5">
                    {PATIENT_PROFILE.allergies.map(a => <span key={a} className="rounded-full bg-[#DC2626]/10 px-2.5 py-1 text-[11px] font-medium text-[#DC2626]">{a}</span>)}
                  </div>
                </div>
              )}
              {PATIENT_PROFILE.chronicConditions.length > 0 ? (
                <div>
                  <div className="mb-1.5 text-[12px] font-medium text-[#b45309]">Chronic Conditions</div>
                  <div className="flex flex-wrap gap-1.5">
                    {PATIENT_PROFILE.chronicConditions.map(c => <span key={c} className="rounded-full bg-[#d97706]/10 px-2.5 py-1 text-[11px] font-medium text-[#b45309]">{c}</span>)}
                  </div>
                </div>
              ) : (
                <p className="text-[12px] text-[#059669]">No chronic conditions on record</p>
              )}
            </div>
          </MobileSection>

          {/* Medical History Timeline */}
          <MobileSection title="Medical History">
            <div className="space-y-3">
              {[
                { date: "2026-07-20", event: "Annual Health Checkup", doctor: "Dr. Meera Joshi", dept: "General Medicine", type: "OPD" },
                { date: "2026-07-15", event: "Dermatology Consultation", doctor: "Dr. Sneha Kapoor", dept: "Dermatology", type: "Teleconsultation" },
                { date: "2026-06-20", event: "Fever & Cold Treatment", doctor: "Dr. Meera Joshi", dept: "General Medicine", type: "OPD" },
                { date: "2026-05-10", event: "Day Care Procedure", doctor: "Dr. Arjun Mehta", dept: "Cardiology", type: "IPD" },
              ].map((visit, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="grid size-8 place-items-center rounded-full bg-[#0052CC]/10 text-[#0052CC]">
                      <Stethoscope className="size-4" />
                    </div>
                    {i < 3 && <div className="w-0.5 flex-1 bg-[#E5E7EB]" />}
                  </div>
                  <div className="pb-3">
                    <div className="text-[13px] font-semibold text-[#111827]">{visit.event}</div>
                    <div className="text-[11px] text-[#6B7280]">{visit.doctor} • {visit.dept}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] text-[#6B7280]">{visit.date}</span>
                      <Badge tone="info">{visit.type}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </MobileSection>

          {/* Vaccination History */}
          <MobileSection title="Vaccination Records">
            <div className="space-y-2">
              {[
                { vaccine: "COVID-19 Booster (Covishield)", date: "2026-01-15", dose: "Booster" },
                { vaccine: "Influenza (Flu Shot)", date: "2025-10-20", dose: "Annual" },
                { vaccine: "Tetanus (Td)", date: "2024-06-10", dose: "10-year" },
              ].map((v, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl bg-[#F9FAFB] p-3">
                  <div className="flex items-center gap-3">
                    <div className="grid size-9 place-items-center rounded-xl bg-[#059669]/10 text-[#059669]"><CheckCircle2 className="size-4" /></div>
                    <div>
                      <div className="text-[13px] font-medium text-[#111827]">{v.vaccine}</div>
                      <div className="text-[11px] text-[#6B7280]">{v.dose} • {v.date}</div>
                    </div>
                  </div>
                  <Badge tone="success">Done</Badge>
                </div>
              ))}
            </div>
          </MobileSection>
        </div>
        <BottomNav activeId={activeBottomNav} onNavigate={navigateBottomNav} items={BOTTOM_NAV} />
      </div>
    );
  }

  /* ========================= 8. Prescriptions ========================= */
  function Prescriptions() {
    return (
      <div className="flex flex-col min-h-[100dvh] bg-[#F9FAFB] pb-24">
        <MobileHeader title="Prescriptions" onBack={() => setRoute("dashboard")} />
        <div className="flex-1 space-y-3 px-4 pt-4">
          {PRESCRIPTIONS.map(rx => (
            <MobileSection key={rx.id} title={rx.prescriptionNumber} action={<Badge tone={rx.status === "Active" ? "success" : "neutral"}>{rx.status}</Badge>}>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <PatientAvatar name={rx.doctorName} size={40} />
                  <div>
                    <div className="text-[14px] font-semibold text-[#111827]">{rx.doctorName}</div>
                    <div className="text-[12px] text-[#6B7280]">{rx.specialty} • {rx.date}</div>
                  </div>
                </div>
                <div className="rounded-xl bg-[#F9FAFB] p-3">
                  <div className="text-[12px] font-medium text-[#0052CC]">Diagnosis</div>
                  <div className="text-[13px] text-[#111827]">{rx.diagnosis}</div>
                </div>
                <div className="space-y-2">
                  {rx.medicines.map(med => (
                    <div key={med.id} className="rounded-xl border border-[#E5E7EB] p-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-[13px] font-semibold text-[#111827]">{med.name}</div>
                          <div className="text-[11px] text-[#6B7280]">{med.genericName}</div>
                        </div>
                        <Badge tone="info">{med.category}</Badge>
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
                        <div><span className="text-[#6B7280]">Dosage:</span> <span className="font-medium text-[#111827]">{med.dosage}</span></div>
                        <div><span className="text-[#6B7280]">Frequency:</span> <span className="font-medium text-[#111827]">{med.frequency}</span></div>
                        <div><span className="text-[#6B7280]">Duration:</span> <span className="font-medium text-[#111827]">{med.duration}</span></div>
                        <div><span className="text-[#6B7280]">Timing:</span> <span className="font-medium text-[#111827]">{med.timing.join(", ")}</span></div>
                      </div>
                      {med.instructions && <p className="mt-2 text-[11px] text-[#b45309] italic">{med.instructions}</p>}
                      {med.currentSupply !== undefined && med.refillAt && (
                        <div className="mt-2">
                          <div className="flex justify-between text-[10px]"><span className="text-[#6B7280]">Supply: {med.currentSupply} remaining</span><span className="text-[#6B7280]">Refill at {med.refillAt}</span></div>
                          <ProgressBar value={med.currentSupply} max={med.refillAt * 2} color={med.currentSupply <= med.refillAt ? "#DC2626" : "#059669"} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {rx.followUp && <div className="rounded-xl bg-[#0052CC]/5 p-3 text-[12px] text-[#0052CC]"><CalendarDays className="mr-1 inline size-3.5" />Follow-up: {rx.followUp}</div>}
                <div className="flex gap-2">
                  <button onClick={() => toast.success("Prescription PDF downloaded")} className="flex-1 rounded-xl bg-[#0052CC]/10 py-2.5 text-[12px] font-semibold text-[#0052CC]"><Download className="mr-1 inline size-3.5" />Download PDF</button>
                  <button onClick={() => toast.success("Share link copied")} className="rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-[12px] font-medium text-[#6B7280]"><Share2 className="size-3.5" /></button>
                </div>
              </div>
            </MobileSection>
          ))}
        </div>
      </div>
    );
  }

  /* ========================= 9. Laboratory Reports ========================= */
  function LabReports() {
    return (
      <div className="flex flex-col min-h-[100dvh] bg-[#F9FAFB] pb-24">
        <MobileHeader title="Laboratory Reports" onBack={() => setRoute("dashboard")} />
        <div className="flex-1 space-y-3 px-4 pt-4">
          {/* Pending */}
          {labResultsData.filter(r => r.status === "Pending").length > 0 && (
            <MobileSection title="Pending Reports">
              {labResultsData.filter(r => r.status === "Pending").map(r => (
                <div key={r.id} className="flex items-center justify-between rounded-xl bg-[#F9FAFB] p-3">
                  <div className="flex items-center gap-3">
                    <div className="grid size-9 place-items-center rounded-xl bg-[#d97706]/10 text-[#b45309]"><Clock className="size-4" /></div>
                    <div>
                      <div className="text-[13px] font-medium text-[#111827]">{r.testName}</div>
                      <div className="text-[11px] text-[#6B7280]">Ordered: {r.orderedDate} • {r.orderedBy}</div>
                    </div>
                  </div>
                  <ReportBadge status="Pending" />
                </div>
              ))}
            </MobileSection>
          )}

          {/* Completed */}
          <MobileSection title="Completed Reports">
            <div className="space-y-2">
              {labResultsData.filter(r => r.status !== "Pending").map(r => (
                <div key={r.id} className="rounded-xl border border-[#E5E7EB] p-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-[13px] font-semibold text-[#111827]">{r.testName}</div>
                      <div className="text-[11px] text-[#6B7280]">{r.testCategory} • {r.resultDate}</div>
                    </div>
                    <ReportBadge status={r.status} />
                  </div>
                  {r.value && (
                    <div className="mt-2 rounded-lg bg-[#F9FAFB] p-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] text-[#6B7280]">Result</span>
                        {r.isAbnormal && <Badge tone="warning">Abnormal</Badge>}
                      </div>
                      <div className={`text-[14px] font-semibold ${r.isAbnormal ? "text-[#b45309]" : "text-[#111827]"}`}>{r.value}</div>
                      {r.referenceRange && <div className="text-[11px] text-[#6B7280]">Ref: {r.referenceRange}</div>}
                    </div>
                  )}
                  <div className="mt-2 flex gap-2">
                    <button onClick={() => toast.info("Downloading report...")} className="flex-1 rounded-lg bg-[#F3F4F6] py-2 text-[11px] font-medium text-[#0052CC]"><Download className="mr-1 inline size-3" />Download</button>
                    <button onClick={() => toast.success("Report shared")} className="flex-1 rounded-lg bg-[#F3F4F6] py-2 text-[11px] font-medium text-[#6B7280]"><Share2 className="mr-1 inline size-3" />Share</button>
                  </div>
                </div>
              ))}
            </div>
          </MobileSection>
        </div>
      </div>
    );
  }

  /* ========================= 10. Radiology Reports ========================= */
  function RadiologyReports() {
    return (
      <div className="flex flex-col min-h-[100dvh] bg-[#F9FAFB] pb-24">
        <MobileHeader title="Radiology Reports" onBack={() => setRoute("dashboard")} />
        <div className="flex-1 space-y-3 px-4 pt-4">
          {RADIOLOGY_REPORTS.map(r => (
            <MobileSection key={r.id} title={`${r.studyType} — ${r.studyName}`} action={<ReportBadge status={r.status} />}>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-[12px]">
                  <div><span className="text-[#6B7280]">Body Part:</span> <span className="text-[#111827]">{r.bodyPart}</span></div>
                  <div><span className="text-[#6B7280]">Ordered:</span> <span className="text-[#111827]">{r.orderedDate}</span></div>
                  <div><span className="text-[#6B7280]">Radiologist:</span> <span className="text-[#111827]">{r.radiologist}</span></div>
                  <div><span className="text-[#6B7280]">Completed:</span> <span className="text-[#111827]">{r.completedDate}</span></div>
                </div>
                {r.findings && (
                  <div className="rounded-xl bg-[#F9FAFB] p-3">
                    <div className="text-[11px] font-medium text-[#0052CC]">Findings</div>
                    <p className="mt-1 text-[12px] text-[#111827] leading-relaxed">{r.findings}</p>
                  </div>
                )}
                {r.impression && (
                  <div className="rounded-xl bg-[#059669]/5 p-3">
                    <div className="text-[11px] font-medium text-[#059669]">Impression</div>
                    <p className="mt-1 text-[12px] text-[#111827]">{r.impression}</p>
                  </div>
                )}
                <div className="flex gap-2">
                  {r.hasDicomImages && (
                    <button onClick={() => toast.info("Opening DICOM viewer...")} className="flex-1 rounded-xl bg-[#0052CC]/10 py-2.5 text-[12px] font-semibold text-[#0052CC]"><Monitor className="mr-1 inline size-3.5" />View Images</button>
                  )}
                  <button onClick={() => toast.success("Report downloaded")} className="flex-1 rounded-xl bg-[#F3F4F6] py-2.5 text-[12px] font-medium text-[#6B7280]"><Download className="mr-1 inline size-3.5" />Download</button>
                </div>
              </div>
            </MobileSection>
          ))}
        </div>
      </div>
    );
  }

  /* ========================= 11. Medication Reminder ========================= */
  function MedicationReminder() {
    const toggleReminder = (id: string, newStatus: "Taken" | "Skipped") => {
      setReminders(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
      toast.success(`Medication marked as ${newStatus.toLowerCase()}`);
    };
    return (
      <div className="flex flex-col min-h-[100dvh] bg-[#F9FAFB] pb-24">
        <MobileHeader title="Medication Reminders" onBack={() => setRoute("dashboard")} />
        <div className="px-4 pt-4">
          <MobileSection>
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-[#6B7280]">Today's adherence</span>
              <span className="font-semibold text-[#059669]">{reminders.filter(r => r.status === "Taken").length}/{reminders.length} taken</span>
            </div>
            <ProgressBar value={reminders.filter(r => r.status === "Taken").length} max={reminders.length} color="#059669" />
          </MobileSection>
        </div>
        <div className="flex-1 space-y-3 px-4 pt-3">
          {reminders.map(r => (
            <div key={r.id} className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`grid size-10 place-items-center rounded-xl ${r.status === "Taken" ? "bg-[#059669]/10 text-[#059669]" : r.status === "Skipped" ? "bg-[#DC2626]/10 text-[#DC2626]" : "bg-[#d97706]/10 text-[#b45309]"}`}>
                    <Pill className="size-5" />
                  </div>
                  <div>
                    <div className="text-[14px] font-semibold text-[#111827]">{r.medicineName}</div>
                    <div className="text-[12px] text-[#6B7280]">{r.dosage} • {r.timing} • {r.reminderTime}</div>
                    {r.notes && <div className="text-[11px] text-[#b45309] italic">{r.notes}</div>}
                  </div>
                </div>
                <ReminderStatusBadge status={r.status} />
              </div>
              {r.status === "Pending" && (
                <div className="mt-3 flex gap-2">
                  <button onClick={() => toggleReminder(r.id, "Taken")} className="flex-1 rounded-xl bg-[#059669] py-2.5 text-[12px] font-semibold text-white"><CheckCircle2 className="mr-1 inline size-3.5" />Taken</button>
                  <button onClick={() => toggleReminder(r.id, "Skipped")} className="rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-[12px] font-medium text-[#DC2626]">Skip</button>
                </div>
              )}
              {r.currentSupply !== undefined && r.refillAt && (
                <div className="mt-3">
                  <div className="flex justify-between text-[10px]"><span className="text-[#6B7280]">Supply: {r.currentSupply} left</span>{r.currentSupply <= r.refillAt && <span className="text-[#DC2626] font-medium">Refill needed</span>}</div>
                  <ProgressBar value={r.currentSupply} max={r.refillAt * 2} color={r.currentSupply <= r.refillAt ? "#DC2626" : "#059669"} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ========================= 12. Insurance & Billing ========================= */
  function InsuranceBilling() {
    const [billingTab, setBillingTab] = useState("Insurance");
    return (
      <div className="flex flex-col min-h-[100dvh] bg-[#F9FAFB] pb-24">
        <MobileHeader title="Insurance & Billing" onBack={() => setRoute("dashboard")} />
        <div className="px-4 pt-4"><TabBar tabs={["Insurance", "Invoices", "Claims"]} activeTab={billingTab} onTabChange={setBillingTab} /></div>
        <div className="flex-1 space-y-3 px-4 pt-4">
          {billingTab === "Insurance" && (
            <>
              <MobileSection title="Policy Details">
                <div className="space-y-2 text-[12px]">
                  <div className="flex justify-between"><span className="text-[#6B7280]">Provider</span><span className="font-medium text-[#111827]">{INSURANCE_POLICY.provider}</span></div>
                  <div className="flex justify-between"><span className="text-[#6B7280]">Policy No.</span><span className="font-mono text-[#111827]">{INSURANCE_POLICY.policyNumber}</span></div>
                  <div className="flex justify-between"><span className="text-[#6B7280]">Type</span><span className="text-[#111827]">{INSURANCE_POLICY.policyType}</span></div>
                  <div className="flex justify-between"><span className="text-[#6B7280]">Valid</span><span className="text-[#111827]">{INSURANCE_POLICY.validFrom} to {INSURANCE_POLICY.validTill}</span></div>
                  <div className="flex justify-between"><span className="text-[#6B7280]">TPA</span><span className="text-[#111827]">{INSURANCE_POLICY.tpaName}</span></div>
                  <div className="flex justify-between"><span className="text-[#6B7280]">Cashless</span><Badge tone={INSURANCE_POLICY.cashlessEligible ? "success" : "neutral"}>{INSURANCE_POLICY.cashlessEligible ? "Eligible" : "Not Eligible"}</Badge></div>
                </div>
              </MobileSection>
              <MobileSection title="Coverage">
                <div className="space-y-2">
                  <div className="flex justify-between text-[12px]"><span className="text-[#6B7280]">Total Coverage</span><span className="font-semibold text-[#111827]">{formatINR(INSURANCE_POLICY.coverageAmount)}</span></div>
                  <div className="flex justify-between text-[12px]"><span className="text-[#6B7280]">Consumed</span><span className="font-semibold text-[#DC2626]">{formatINR(INSURANCE_POLICY.consumedAmount)}</span></div>
                  <div className="flex justify-between text-[12px]"><span className="text-[#6B7280]">Remaining</span><span className="font-semibold text-[#059669]">{formatINR(INSURANCE_POLICY.remainingAmount)}</span></div>
                  <ProgressBar value={INSURANCE_POLICY.consumedAmount} max={INSURANCE_POLICY.coverageAmount} color="#DC2626" />
                </div>
              </MobileSection>
            </>
          )}
          {billingTab === "Invoices" && (
            <MobileSection title="Invoices">
              <div className="space-y-2">
                {INVOICES.map(inv => (
                  <div key={inv.id} className="rounded-xl border border-[#E5E7EB] p-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-[13px] font-semibold text-[#111827]">{inv.invoiceNumber}</div>
                        <div className="text-[11px] text-[#6B7280]">{inv.description}</div>
                        <div className="text-[11px] text-[#6B7280]">{inv.date} • {inv.department}</div>
                      </div>
                      <PaymentBadge status={inv.paymentStatus} />
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[14px] font-bold text-[#111827]">{formatINR(inv.totalAmount)}</span>
                      {inv.paymentStatus === "Pending" && <button onClick={() => toast.info("Redirecting to payment...")} className="rounded-xl bg-[#0052CC] px-4 py-2 text-[12px] font-semibold text-white">Pay Now</button>}
                    </div>
                  </div>
                ))}
              </div>
            </MobileSection>
          )}
          {billingTab === "Claims" && (
            <MobileSection title="Insurance Claims">
              <div className="space-y-2">
                {INSURANCE_CLAIMS.map(clm => (
                  <div key={clm.id} className="rounded-xl border border-[#E5E7EB] p-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-[13px] font-semibold text-[#111827]">{clm.claimNumber}</div>
                        <div className="text-[11px] text-[#6B7280]">Invoice: {clm.invoiceNumber}</div>
                        <div className="text-[11px] text-[#6B7280]">{clm.admissionDate} — {clm.dischargeDate || "Ongoing"}</div>
                      </div>
                      <ClaimBadge status={clm.status} />
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-[12px]">
                      <div><span className="text-[#6B7280]">Claimed:</span> <span className="font-medium text-[#111827]">{formatINR(clm.claimAmount)}</span></div>
                      {clm.approvedAmount && <div><span className="text-[#6B7280]">Approved:</span> <span className="font-medium text-[#059669]">{formatINR(clm.approvedAmount)}</span></div>}
                    </div>
                  </div>
                ))}
              </div>
            </MobileSection>
          )}
        </div>
      </div>
    );
  }

  /* ========================= 13. Teleconsultation ========================= */
  function Teleconsultation() {
    return (
      <div className="flex flex-col min-h-[100dvh] bg-[#F9FAFB] pb-24">
        <MobileHeader title="Teleconsultation" onBack={() => setRoute("dashboard")} />
        <div className="flex-1 space-y-3 px-4 pt-4">
          {/* Scheduled */}
          <MobileSection title="Upcoming Consultations">
            {TELECONSULTATIONS.filter(t => t.status === "Scheduled").map(tc => (
              <div key={tc.id} className="rounded-xl border border-[#E5E7EB] p-4">
                <div className="flex items-start gap-3">
                  <PatientAvatar name={tc.doctorName} size={44} />
                  <div className="flex-1">
                    <div className="text-[14px] font-semibold text-[#111827]">{tc.doctorName}</div>
                    <div className="text-[12px] text-[#6B7280]">{tc.specialty}</div>
                    <div className="mt-1 flex items-center gap-1.5 text-[12px] text-[#6B7280]">
                      <CalendarDays className="size-3.5" /> {tc.scheduledDate} at {tc.scheduledTime}
                    </div>
                    <Badge tone="info">{tc.consultationType}</Badge>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <button className="flex-1 rounded-xl bg-[#059669] py-2.5 text-[12px] font-semibold text-white"><Video className="mr-1 inline size-3.5" />Join Call</button>
                  <button className="rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-[12px] font-medium text-[#6B7280]"><MessageSquare className="size-3.5" /></button>
                </div>
              </div>
            ))}
          </MobileSection>

          {/* Consultation Interface */}
          <MobileSection title="Consultation Room">
            <div className="flex flex-col items-center rounded-2xl bg-[#111827] p-6 text-white">
              <div className="mb-4 grid size-16 place-items-center rounded-full bg-[#374151]">
                <Video className="size-8 text-[#60A5FA]" />
              </div>
              <div className="text-[15px] font-semibold">Video Consultation</div>
              <div className="text-[12px] text-[#9CA3AF]">Connect with your doctor securely</div>
              <div className="mt-4 flex gap-4">
                <button className="grid size-12 place-items-center rounded-full bg-[#374151] transition hover:bg-[#4B5563]"><Mic className="size-5" /></button>
                <button className="grid size-12 place-items-center rounded-full bg-[#DC2626] transition hover:bg-[#B91C1C]"><Phone className="size-5" /></button>
                <button className="grid size-12 place-items-center rounded-full bg-[#374151] transition hover:bg-[#4B5563]"><Camera className="size-5" /></button>
              </div>
            </div>
          </MobileSection>

          {/* Past Consultations */}
          <MobileSection title="Past Consultations">
            {TELECONSULTATIONS.filter(t => t.status === "Completed").map(tc => (
              <div key={tc.id} className="flex items-center justify-between rounded-xl bg-[#F9FAFB] p-3">
                <div>
                  <div className="text-[13px] font-medium text-[#111827]">{tc.doctorName}</div>
                  <div className="text-[11px] text-[#6B7280]">{tc.scheduledDate} • {tc.duration} min • {tc.consultationType}</div>
                </div>
                <Badge tone="success">Completed</Badge>
              </div>
            ))}
          </MobileSection>
        </div>
      </div>
    );
  }

  /* ========================= 14. Emergency & Ambulance ========================= */
  function Emergency() {
    const activateSOS = () => {
      setSosStatus("Activating");
      toast.error("Emergency SOS activated! Notifying emergency contacts...");
      setTimeout(() => setSosStatus("Active"), 2000);
    };
    return (
      <div className="flex flex-col min-h-[100dvh] bg-[#F9FAFB] pb-24">
        <MobileHeader title="Emergency & Ambulance" onBack={() => setRoute("dashboard")} />
        <div className="flex-1 space-y-4 px-4 pt-4">
          {/* SOS Button */}
          <MobileSection>
            <div className="flex flex-col items-center py-4">
              {sosStatus === "Idle" ? (
                <SOSButton onActivate={activateSOS} />
              ) : (
                <div className="flex flex-col items-center">
                  <div className="mb-3 flex size-16 items-center justify-center rounded-full bg-[#DC2626] animate-pulse">
                    <AlertTriangle className="size-8 text-white" />
                  </div>
                  <div className="text-[17px] font-bold text-[#DC2626]">SOS Active</div>
                  <div className="text-[12px] text-[#6B7280]">Emergency contacts notified • Location shared</div>
                  <button onClick={() => { setSosStatus("Idle"); toast.success("SOS deactivated"); }}
                    className="mt-3 rounded-xl bg-[#F3F4F6] px-6 py-2.5 text-[13px] font-semibold text-[#6B7280]">Deactivate SOS</button>
                </div>
              )}
            </div>
          </MobileSection>

          {/* Quick Emergency Call */}
          <div className="grid grid-cols-2 gap-3">
            <button className="flex flex-col items-center gap-2 rounded-2xl border border-[#DC2626]/20 bg-[#DC2626]/5 p-4 active:scale-[0.97]">
              <Phone className="size-6 text-[#DC2626]" />
              <span className="text-[12px] font-semibold text-[#DC2626]">Call 108</span>
            </button>
            <button className="flex flex-col items-center gap-2 rounded-2xl border border-[#DC2626]/20 bg-[#DC2626]/5 p-4 active:scale-[0.97]">
              <Phone className="size-6 text-[#DC2626]" />
              <span className="text-[12px] font-semibold text-[#DC2626]">Call 112</span>
            </button>
          </div>

          {/* Nearest Hospital */}
          <MobileSection title="Nearest Hospital">
            <div className="rounded-xl bg-[#F9FAFB] p-3">
              <div className="flex items-start gap-3">
                <div className="grid size-10 place-items-center rounded-xl bg-[#0052CC]/10 text-[#0052CC]"><MapPin className="size-5" /></div>
                <div className="flex-1">
                  <div className="text-[14px] font-semibold text-[#111827]">Meridian Multi-Speciality Hospital</div>
                  <div className="text-[12px] text-[#6B7280]">Koregaon Park, Pune</div>
                  <div className="mt-1 text-[11px] text-[#059669] font-medium">2.3 km away • ETA: 8 min</div>
                </div>
                <button className="rounded-xl bg-[#0052CC] px-3 py-2 text-[11px] font-semibold text-white">Navigate</button>
              </div>
            </div>
          </MobileSection>

          {/* Ambulance Tracking */}
          <MobileSection title="Ambulance Tracking">
            <div className="flex flex-col items-center rounded-2xl bg-[#F9FAFB] p-6">
              <div className="mb-3 flex size-16 items-center justify-center rounded-full bg-[#0052CC]/10">
                <Activity className="size-8 text-[#0052CC] animate-pulse" />
              </div>
              <div className="text-[14px] font-semibold text-[#111827]">Ambulance Dispatched</div>
              <div className="text-[12px] text-[#6B7280]">ETA: 6 minutes</div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[#E5E7EB]">
                <div className="h-full w-3/4 rounded-full bg-[#0052CC] animate-pulse" />
              </div>
              <div className="mt-3 text-[11px] text-[#6B7280]">Vehicle: MH-12-A-4521 • Driver: Rajesh</div>
            </div>
          </MobileSection>

          {/* Emergency Contacts */}
          <MobileSection title="Emergency Contacts">
            <div className="space-y-2">
              {EMERGENCY_CONTACTS.map(ec => (
                <div key={ec.id} className="flex items-center justify-between rounded-xl bg-[#F9FAFB] p-3">
                  <div className="flex items-center gap-3">
                    <PatientAvatar name={ec.name} size={36} />
                    <div>
                      <div className="text-[13px] font-medium text-[#111827]">{ec.name}</div>
                      <div className="text-[11px] text-[#6B7280]">{ec.relationship}</div>
                    </div>
                  </div>
                  <button className="grid size-9 place-items-center rounded-full bg-[#059669]/10 text-[#059669]"><Phone className="size-4" /></button>
                </div>
              ))}
            </div>
          </MobileSection>

          {/* Medical ID */}
          <MobileSection title="Medical ID">
            <div className="rounded-xl bg-[#F9FAFB] p-3 text-[12px] space-y-1.5">
              <div className="flex justify-between"><span className="text-[#6B7280]">Blood Group</span><span className="font-semibold text-[#DC2626]">{PATIENT_PROFILE.bloodGroup}</span></div>
              <div className="flex justify-between"><span className="text-[#6B7280]">Allergies</span><span className="text-[#DC2626]">{PATIENT_PROFILE.allergies.join(", ")}</span></div>
              <div className="flex justify-between"><span className="text-[#6B7280]">Emergency</span><span className="text-[#111827]">{PATIENT_PROFILE.emergencyContact}</span></div>
            </div>
          </MobileSection>
        </div>
      </div>
    );
  }

  /* ========================= 15. Notifications ========================= */
  function NotificationsScreen() {
    return (
      <div className="flex flex-col min-h-[100dvh] bg-[#F9FAFB] pb-24">
        <MobileHeader title="Notifications" onBack={() => setRoute("dashboard")} rightAction={<button onClick={() => toast.success("All marked as read")} className="text-[12px] font-medium text-[#0052CC]">Mark All Read</button>} />
        <div className="flex-1 space-y-2 px-4 pt-4">
          {NOTIFICATIONS.map(n => (
            <div key={n.id} className={n.read ? "rounded-2xl border border-[#E5E7EB] bg-white p-4 transition" : "rounded-2xl border border-[#0052CC]/20 bg-[#0052CC]/5 p-4 transition"}>
              <div className="flex items-start gap-3">
                <div className={n.type === "Emergency" ? "grid size-9 shrink-0 place-items-center rounded-xl bg-[#DC2626]/10 text-[#DC2626]" : n.type === "Appointment" ? "grid size-9 shrink-0 place-items-center rounded-xl bg-[#0052CC]/10 text-[#0052CC]" : n.type === "Lab Result" ? "grid size-9 shrink-0 place-items-center rounded-xl bg-[#0369a1]/10 text-[#0369a1]" : "grid size-9 shrink-0 place-items-center rounded-xl bg-[#F3F4F6] text-[#6B7280]"}>
                  {n.type === "Appointment" ? <Calendar className="size-4" /> : n.type === "Lab Result" ? <FlaskConical className="size-4" /> : n.type === "Reminder" ? <Bell className="size-4" /> : n.type === "Billing" ? <CreditCard className="size-4" /> : <Info className="size-4" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-semibold text-[#111827]">{n.title}</span>
                    {!n.read && <span className="size-2 rounded-full bg-[#0052CC]" />}
                  </div>
                  <p className="mt-0.5 text-[12px] leading-relaxed text-[#6B7280]">{n.message}</p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span className="text-[10px] text-[#9CA3AF]">{timeAgo(n.timestamp)}</span>
                    {n.actionLabel && <button className="text-[11px] font-medium text-[#0052CC]">{n.actionLabel}</button>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ========================= 16. Family Profiles ========================= */
  function FamilyProfiles() {
    return (
      <div className="flex flex-col min-h-[100dvh] bg-[#F9FAFB] pb-24">
        <MobileHeader title="Family Profiles" onBack={() => setRoute("dashboard")} rightAction={<button className="rounded-xl bg-[#0052CC] px-3 py-1.5 text-[12px] font-semibold text-white"><Users className="mr-1 inline size-3.5" />Add</button>} />
        <div className="flex-1 space-y-3 px-4 pt-4">
          {FAMILY_MEMBERS.map(fm => (
            <MobileSection key={fm.id}>
              <div className="flex items-center gap-4">
                <PatientAvatar name={fm.name} size={48} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[15px] font-semibold text-[#111827]">{fm.name}</span>
                    {fm.isPrimary && <Badge tone="brand">You</Badge>}
                  </div>
                  <div className="text-[12px] text-[#6B7280]">{fm.relationship} • {fm.age} yrs • {fm.gender} • {fm.bloodGroup}</div>
                  <div className="text-[11px] text-[#6B7280]">UHID: {fm.uhid}</div>
                  <div className="mt-1 text-[11px] text-[#6B7280]">{fm.linkedAppointments} appointments</div>
                </div>
                {!fm.isPrimary && (
                  <button onClick={() => toast.info(`Switched to ${fm.name}'s profile`)}
                    className="rounded-xl border border-[#E5E7EB] px-3 py-2 text-[11px] font-semibold text-[#0052CC]">Switch</button>
                )}
              </div>
            </MobileSection>
          ))}
          <MobileSection title="Permissions">
            <div className="space-y-2 text-[12px]">
              <div className="flex items-center justify-between rounded-xl bg-[#F9FAFB] p-3"><span className="text-[#111827]">Share records with family</span><div className="size-10 rounded-full bg-[#0052CC] p-0.5"><div className="ml-auto size-4 rounded-full bg-white" /></div></div>
              <div className="flex items-center justify-between rounded-xl bg-[#F9FAFB] p-3"><span className="text-[#111827]">Allow appointment booking for dependents</span><div className="size-10 rounded-full bg-[#0052CC] p-0.5"><div className="ml-auto size-4 rounded-full bg-white" /></div></div>
              <div className="flex items-center justify-between rounded-xl bg-[#F9FAFB] p-3"><span className="text-[#111827]">Medication reminders for dependents</span><div className="size-10 rounded-full bg-[#D1D5DB] p-0.5"><div className="size-4 rounded-full bg-white" /></div></div>
            </div>
          </MobileSection>
        </div>
      </div>
    );
  }

  /* ========================= 17. Profile & Settings ========================= */
  function ProfileSettings() {
    return (
      <div className="flex flex-col min-h-[100dvh] bg-[#F9FAFB] pb-24">
        <MobileHeader title="Profile & Settings" />
        <div className="flex-1 space-y-3 px-4 pt-4">
          {/* Profile Card */}
          <MobileSection>
            <div className="flex items-center gap-4">
              <PatientAvatar name={PATIENT_PROFILE.name} size={56} />
              <div>
                <div className="text-[17px] font-bold text-[#111827]">{PATIENT_PROFILE.name}</div>
                <div className="text-[12px] text-[#6B7280]">{PATIENT_PROFILE.email}</div>
                <div className="text-[12px] text-[#6B7280]">{PATIENT_PROFILE.mobile}</div>
              </div>
            </div>
          </MobileSection>

          {/* Settings Groups */}
          <MobileSection title="Account">
            <div className="space-y-1">
              {[
                { icon: User, label: "Personal Information", route: "profile-settings" },
                { icon: Users, label: "Family Profiles", route: "family" },
                { icon: Shield, label: "Privacy & Security", route: "profile-settings" },
                { icon: Bell, label: "Notification Preferences", route: "notifications" },
              ].map((item, i) => (
                <button key={i} onClick={() => item.route !== "profile-settings" && setRoute(item.route as PortalRoute)}
                  className="flex w-full items-center gap-3 rounded-xl py-3 text-left transition hover:bg-[#F3F4F6]">
                  <item.icon className="size-5 text-[#6B7280]" />
                  <span className="flex-1 text-[14px] text-[#111827]">{item.label}</span>
                  <ChevronRight className="size-4 text-[#9CA3AF]" />
                </button>
              ))}
            </div>
          </MobileSection>

          <MobileSection title="Preferences">
            <div className="space-y-1">
              {[
                { icon: Globe, label: "Language", value: "English" },
                { icon: Moon, label: "Dark Mode", value: "Off" },
                { icon: Fingerprint, label: "Biometric Login", value: "On" },
                { icon: Download, label: "Offline Data", value: "Enabled" },
              ].map((item, i) => (
                <button key={i} className="flex w-full items-center gap-3 rounded-xl py-3 text-left transition hover:bg-[#F3F4F6]">
                  <item.icon className="size-5 text-[#6B7280]" />
                  <span className="flex-1 text-[14px] text-[#111827]">{item.label}</span>
                  <span className="text-[12px] text-[#6B7280]">{item.value}</span>
                  <ChevronRight className="size-4 text-[#9CA3AF]" />
                </button>
              ))}
            </div>
          </MobileSection>

          <MobileSection title="Support">
            <div className="space-y-1">
              {[
                { icon: HelpCircle, label: "Help Center" },
                { icon: MessageSquare, label: "Support Chat" },
                { icon: Star, label: "Rate the App" },
                { icon: Info, label: "About" },
              ].map((item, i) => (
                <button key={i} className="flex w-full items-center gap-3 rounded-xl py-3 text-left transition hover:bg-[#F3F4F6]">
                  <item.icon className="size-5 text-[#6B7280]" />
                  <span className="flex-1 text-[14px] text-[#111827]">{item.label}</span>
                  <ChevronRight className="size-4 text-[#9CA3AF]" />
                </button>
              ))}
            </div>
          </MobileSection>

          <button onClick={() => { onSignOut(); setRoute("splash"); onSwitchWorkspace("reception"); }}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#DC2626]/20 bg-[#DC2626]/5 py-4 text-[14px] font-semibold text-[#DC2626]">
            <LogOut className="size-5" /> Sign Out
          </button>
          <p className="pb-4 text-center text-[11px] text-[#9CA3AF]">Meridian Health v2.4.1 • HIPAA Compliant</p>
        </div>
      </div>
    );
  }

  /* ========================= 18. Feedback & Ratings ========================= */
  function Feedback() {
    return (
      <div className="flex flex-col min-h-[100dvh] bg-[#F9FAFB] pb-24">
        <MobileHeader title="Feedback & Ratings" onBack={() => setRoute("dashboard")} />
        <div className="flex-1 space-y-4 px-4 pt-4">
          <MobileSection title="Rate Your Experience">
            <div className="flex flex-col items-center py-4">
              <PatientAvatar name="Dr. Meera Joshi" size={56} />
              <div className="mt-3 text-[15px] font-semibold text-[#111827]">Dr. Meera Joshi</div>
              <div className="text-[12px] text-[#6B7280]">General Medicine • 20 Jul 2026</div>
              <div className="mt-4 flex gap-2">
                {[1,2,3,4,5].map(star => (
                  <button key={star} onClick={() => setFeedbackRating(star)}>
                    <Star className={`size-8 ${star <= feedbackRating ? "fill-[#d97706] text-[#d97706]" : "text-[#D1D5DB]"}`} />
                  </button>
                ))}
              </div>
              <div className="mt-2 text-[13px] text-[#6B7280]">
                {feedbackRating === 5 ? "Excellent" : feedbackRating === 4 ? "Very Good" : feedbackRating === 3 ? "Good" : feedbackRating === 2 ? "Fair" : "Poor"}
              </div>
            </div>
          </MobileSection>

          <MobileSection title="Your Comments">
            <textarea value={feedbackText} onChange={e => setFeedbackText(e.target.value)}
              className="w-full rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-3 text-[14px] text-[#111827] placeholder:text-[#9CA3AF] outline-none focus:border-[#0052CC] min-h-[100px]"
              placeholder="Tell us about your experience..." />
          </MobileSection>

          <MobileSection title="Category">
            <div className="flex flex-wrap gap-2">
              {["Doctor Care", "Wait Time", "Facility", "Staff", "Billing", "Overall"].map(cat => (
                <button key={cat} className="rounded-full border border-[#E5E7EB] bg-white px-3 py-1.5 text-[12px] font-medium text-[#6B7280] transition hover:bg-[#F3F4F6]">{cat}</button>
              ))}
            </div>
          </MobileSection>

          <MobileSection title="Attach Photos">
            <button className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#E5E7EB] py-6 text-[13px] font-medium text-[#6B7280] transition hover:border-[#0052CC] hover:text-[#0052CC]">
              <Camera className="size-5" /> Add Photo
            </button>
          </MobileSection>

          <button onClick={() => { toast.success("Thank you for your feedback!"); setRoute("dashboard"); }}
            className="w-full rounded-2xl bg-[#0052CC] py-4 text-[15px] font-semibold text-white active:bg-[#0043A8]">
            Submit Feedback
          </button>
        </div>
      </div>
    );
  }

  /* ========================= 19. Health Packages ========================= */
  function HealthPackages() {
    return (
      <div className="flex flex-col min-h-[100dvh] bg-[#F9FAFB] pb-24">
        <MobileHeader title="Health Packages" onBack={() => setRoute("dashboard")} />
        <div className="flex-1 space-y-3 px-4 pt-4">
          {HEALTH_PACKAGES.map(pkg => (
            <MobileSection key={pkg.id} title={pkg.name} action={pkg.popular ? <Badge tone="brand">Popular</Badge> : undefined}>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-[17px] font-bold text-[#111827]">{formatINR(pkg.price)}</span>
                  <span className="text-[13px] text-[#9CA3AF] line-through">{formatINR(pkg.originalPrice)}</span>
                  <Badge tone="success">{Math.round((1 - pkg.price / pkg.originalPrice) * 100)}% off</Badge>
                </div>
                <p className="text-[12px] text-[#6B7280] leading-relaxed">{pkg.description}</p>
                <div className="text-[12px] font-medium text-[#111827]">Includes {pkg.tests.length} tests:</div>
                <div className="flex flex-wrap gap-1">
                  {pkg.tests.slice(0, 6).map(t => <span key={t} className="rounded-full bg-[#F3F4F6] px-2 py-0.5 text-[10px] text-[#6B7280]">{t}</span>)}
                  {pkg.tests.length > 6 && <span className="rounded-full bg-[#F3F4F6] px-2 py-0.5 text-[10px] text-[#6B7280]">+{pkg.tests.length - 6} more</span>}
                </div>
                <div className="space-y-1">
                  {pkg.benefits.map(b => (
                    <div key={b} className="flex items-center gap-2 text-[11px] text-[#059669]">
                      <CheckCircle2 className="size-3.5 shrink-0" /> {b}
                    </div>
                  ))}
                </div>
                <button onClick={() => { setSelectedPackage(pkg); toast.success(`Booking ${pkg.name}...`); }}
                  className="w-full rounded-xl bg-[#0052CC] py-3 text-[13px] font-semibold text-white active:bg-[#0043A8]">
                  Book Package • {formatINR(pkg.price)}
                </button>
              </div>
            </MobileSection>
          ))}
        </div>
      </div>
    );
  }

  /* ========================= 20. Workflow Complete ========================= */
  function WorkflowComplete() {
    return (
      <div className="flex flex-col min-h-[100dvh] items-center justify-center bg-white px-6 text-center">
        <div className="mb-6 grid size-20 place-items-center rounded-full bg-[#059669]/10">
          <CheckCircle2 className="size-10 text-[#059669]" />
        </div>
        <h2 className="text-[22px] font-bold text-[#111827]">Appointment Booked!</h2>
        <p className="mt-2 max-w-xs text-[14px] text-[#6B7280]">
          Your appointment with {selectedDoctor.name} on {selectedDate} at {selectedSlot} has been confirmed.
        </p>
        <div className="mt-6 w-full max-w-xs space-y-2">
          <div className="flex items-center justify-between rounded-xl bg-[#F9FAFB] px-4 py-3 text-[13px]">
            <span className="text-[#6B7280]">Reports Synced</span>
            <CheckCircle2 className="size-4 text-[#059669]" />
          </div>
          <div className="flex items-center justify-between rounded-xl bg-[#F9FAFB] px-4 py-3 text-[13px]">
            <span className="text-[#6B7280]">Notifications Sent</span>
            <CheckCircle2 className="size-4 text-[#059669]" />
          </div>
          <div className="flex items-center justify-between rounded-xl bg-[#F9FAFB] px-4 py-3 text-[13px]">
            <span className="text-[#6B7280]">Health Timeline Updated</span>
            <CheckCircle2 className="size-4 text-[#059669]" />
          </div>
        </div>
        <div className="mt-8 w-full max-w-xs space-y-3">
          <button onClick={() => { setRoute("dashboard"); setActiveBottomNav("dashboard"); }}
            className="w-full rounded-2xl bg-[#0052CC] py-4 text-[15px] font-semibold text-white active:bg-[#0043A8]">Return to Dashboard</button>
          <button onClick={() => setRoute("health-record")}
            className="w-full rounded-2xl border border-[#E5E7EB] py-4 text-[15px] font-medium text-[#111827] active:bg-[#F9FAFB]">View Health Summary</button>
        </div>
      </div>
    );
  }

  /* ========================= Render Router ========================= */
  function renderScreen() {
    switch (route) {
      case "splash": return <Splash />;
      case "onboarding": return <Onboarding />;
      case "login": return <Login />;
      case "dashboard": return <Dashboard />;
      case "appointments": return <Appointments />;
      case "book-appointment": return <BookAppointment />;
      case "health-record": return <HealthRecord />;
      case "prescriptions": return <Prescriptions />;
      case "lab-reports": return <LabReports />;
      case "radiology-reports": return <RadiologyReports />;
      case "medication-reminder": return <MedicationReminder />;
      case "insurance-billing": return <InsuranceBilling />;
      case "teleconsultation": return <Teleconsultation />;
      case "emergency": return <Emergency />;
      case "notifications": return <NotificationsScreen />;
      case "family": return <FamilyProfiles />;
      case "profile-settings": return <ProfileSettings />;
      case "feedback": return <Feedback />;
      case "health-packages": return <HealthPackages />;
      case "complete": return <WorkflowComplete />;
      default: return <Dashboard />;
    }
  }

  return renderScreen();
}
