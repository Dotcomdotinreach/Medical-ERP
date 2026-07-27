import { useEffect, useState } from "react";
import {
  Activity, ArrowLeft, ArrowRight, Eye, EyeOff, Fingerprint, Loader2, Lock, Mail,
  ShieldCheck, HeartPulse, Ambulance, Brain, CheckCircle2, AlertTriangle, Globe,
  Stethoscope, Syringe, ClipboardList, FlaskConical, Scan, Truck, UserCog, Crown,
  ChevronRight, Smartphone, KeyRound, MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { AuthShell, Logo, HOSPITAL_FULL, HOSPITAL_NAME } from "./Brand";

export type Screen =
  | "splash" | "onboarding" | "welcome" | "login" | "forgot" | "otp"
  | "reset" | "biometric" | "role" | "twofactor" | "success" | "locked";

/* ------------------------------------------------------------------ */
/* SCREEN 01 — Splash                                                  */
/* ------------------------------------------------------------------ */
export function Splash({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2600);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="relative grid h-full w-full place-items-center overflow-hidden bg-primary text-primary-foreground">
      <div className="pointer-events-none absolute inset-0 opacity-[0.10]"
        style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "26px 26px" }} />
      <div className="relative z-10 flex flex-col items-center gap-6 text-center">
        <div className="grid size-20 animate-pulse place-items-center rounded-3xl bg-white/15 backdrop-blur">
          <Activity className="size-10" strokeWidth={2.4} />
        </div>
        <div>
          <div className="font-bold" style={{ fontSize: 30 }}>{HOSPITAL_NAME}</div>
          <div className="mt-1 text-sm text-white/70">Advancing care through technology</div>
        </div>
        {/* heartbeat line */}
        <svg width="220" height="40" viewBox="0 0 220 40" className="text-white/80">
          <polyline points="0,20 40,20 55,20 65,6 80,34 95,20 130,20 145,20 155,10 170,30 185,20 220,20"
            fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <Loader2 className="size-5 animate-spin text-white/80" />
      </div>
      <div className="absolute bottom-8 text-center text-xs text-white/50">
        <div>Version 4.2.0</div>
        <div>© 2026 Meridian Health Systems · All rights reserved</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* SCREENS 02-04 — Onboarding                                          */
/* ------------------------------------------------------------------ */
const SLIDES = [
  { icon: HeartPulse, tag: "Enterprise HIS", title: "Enterprise Hospital Management",
    desc: "Run OPD, IPD, Emergency, Pharmacy, Lab and Billing from a single, unified command center built for multi-speciality hospitals." },
  { icon: Ambulance, tag: "Emergency Ready", title: "Rapid Emergency Response",
    desc: "Coordinate ambulances, triage, on-call doctors and real-time bed availability so critical patients are seen in seconds — not minutes." },
  { icon: Brain, tag: "Smart & Connected", title: "AI-Assisted Clinical Care",
    desc: "Electronic medical records, laboratory and pharmacy tightly integrated with intelligent alerts to reduce errors and save time." },
];
export function Onboarding({ onFinish }: { onFinish: () => void }) {
  const [i, setI] = useState(0);
  const S = SLIDES[i];
  const last = i === SLIDES.length - 1;
  return (
    <div className="flex h-full w-full flex-col bg-canvas">
      <div className="flex items-center justify-between p-6">
        <Logo />
        <Button variant="ghost" onClick={onFinish}>Skip</Button>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="grid size-24 place-items-center rounded-3xl bg-secondary text-primary">
          <S.icon className="size-12" strokeWidth={1.8} />
        </div>
        <span className="mt-6 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-primary">{S.tag}</span>
        <h1 className="mt-4 max-w-lg font-bold text-text-primary" style={{ fontSize: 30 }}>{S.title}</h1>
        <p className="mt-3 max-w-md text-text-secondary">{S.desc}</p>
      </div>
      <div className="flex items-center justify-between p-6">
        <div className="flex gap-2">
          {SLIDES.map((_, idx) => (
            <div key={idx} className={`h-2 rounded-full transition-all ${idx === i ? "w-8 bg-primary" : "w-2 bg-border"}`} />
          ))}
        </div>
        <div className="flex gap-2">
          {i > 0 && <Button variant="outline" onClick={() => setI(i - 1)}><ArrowLeft className="size-4" />Previous</Button>}
          <Button onClick={() => (last ? onFinish() : setI(i + 1))}>
            {last ? "Finish" : "Next"}<ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* SCREEN 05 — Welcome                                                 */
/* ------------------------------------------------------------------ */
export function Welcome({ onLogin }: { onLogin: () => void }) {
  return (
    <AuthShell>
      <div className="flex flex-col items-center text-center">
        <Logo size={56} showName={false} />
        <h1 className="mt-6 font-bold text-text-primary" style={{ fontSize: 30 }}>Welcome to {HOSPITAL_NAME}</h1>
        <p className="mt-2 text-text-secondary">{HOSPITAL_FULL}</p>
        <div className="mt-8 w-full space-y-3">
          <Button className="h-11 w-full" onClick={onLogin}>Sign in to your account</Button>
          <Button variant="outline" className="h-11 w-full" onClick={() => toast.info("Contact your hospital administrator to create staff accounts.")}>
            Create account
          </Button>
        </div>
        <div className="mt-6 flex items-center gap-4 text-sm text-text-secondary">
          <button className="inline-flex items-center gap-1.5 hover:text-text-primary"><Globe className="size-4" />English (IN)</button>
          <span className="text-border">|</span>
          <span>Need help? support@meridian.health</span>
        </div>
      </div>
    </AuthShell>
  );
}

/* ------------------------------------------------------------------ */
/* SCREEN 06 — Login                                                   */
/* ------------------------------------------------------------------ */
export function Login({ onSuccess, onForgot, onBiometric, onLogin }: { onSuccess: () => void; onForgot: () => void; onBiometric: () => void; onLogin?: (email: string, password: string) => Promise<void> }) {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; pwd?: string }>({});

  const submit = async () => {
    const e: typeof errors = {};
    if (!email.trim()) e.email = "Email address is required";
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) e.email = "Enter a valid email address";
    if (!pwd) e.pwd = "Password is required";
    setErrors(e);
    if (Object.keys(e).length) return;
    setLoading(true);
    try {
      if (onLogin) {
        await onLogin(email, pwd);
        toast.success("Signed in successfully");
        onSuccess();
      } else {
        await new Promise((r) => setTimeout(r, 1200));
        toast.success("Credentials verified");
        onSuccess();
      }
    } catch (err: any) {
      toast.error(err?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <div className="lg:hidden"><Logo /></div>
      <div className="mt-6 lg:mt-0">
        <h1 className="font-bold text-text-primary" style={{ fontSize: 24 }}>Welcome back</h1>
        <p className="mt-1 text-text-secondary">Sign in to continue to the hospital dashboard.</p>
      </div>

      <div className="mt-8 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email address</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-secondary" />
            <Input id="email" type="email" placeholder="dr.name@meridian.health" className="h-11 pl-9"
              value={email} onChange={(e) => setEmail(e.target.value)}
              aria-invalid={!!errors.email} />
          </div>
          {errors.email && <p className="text-sm text-danger">{errors.email}</p>}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="pwd">Password</Label>
            <button className="text-sm font-medium text-primary hover:underline" onClick={onForgot}>Forgot password?</button>
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-secondary" />
            <Input id="pwd" type={show ? "text" : "password"} placeholder="Enter your password" className="h-11 px-9"
              value={pwd} onChange={(e) => setPwd(e.target.value)} aria-invalid={!!errors.pwd} />
            <button type="button" onClick={() => setShow((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary" aria-label="Toggle password">
              {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {errors.pwd && <p className="text-sm text-danger">{errors.pwd}</p>}
        </div>

        <label className="flex items-center gap-2 text-sm text-text-secondary">
          <Checkbox checked={remember} onCheckedChange={(v) => setRemember(!!v)} /> Keep me signed in on this device
        </label>

        <Button className="h-11 w-full" onClick={submit} disabled={loading}>
          {loading ? <><Loader2 className="size-4 animate-spin" />Verifying…</> : "Sign in"}
        </Button>

        <div className="flex items-center gap-3 py-1 text-xs text-text-secondary">
          <div className="h-px flex-1 bg-border" />OR<div className="h-px flex-1 bg-border" />
        </div>

        <Button variant="outline" className="h-11 w-full" onClick={onBiometric}>
          <Fingerprint className="size-4" />Sign in with biometrics
        </Button>
      </div>

      <p className="mt-6 text-center text-xs text-text-secondary">
        By continuing you agree to our <a className="text-primary hover:underline">Terms</a> and{" "}
        <a className="text-primary hover:underline">Privacy Policy</a>.
      </p>
    </AuthShell>
  );
}

/* ------------------------------------------------------------------ */
/* SCREEN 07 — Forgot Password                                         */
/* ------------------------------------------------------------------ */
export function Forgot({ onSent, onBack }: { onSent: () => void; onBack: () => void }) {
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");
  return (
    <AuthShell>
      <button onClick={onBack} className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary">
        <ArrowLeft className="size-4" />Back to login
      </button>
      <h1 className="mt-6 font-bold text-text-primary" style={{ fontSize: 24 }}>Forgot password?</h1>
      <p className="mt-1 text-text-secondary">Enter your registered email and we'll send a 6-digit verification code.</p>
      <div className="mt-8 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="fp-email">Email address</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-secondary" />
            <Input id="fp-email" className="h-11 pl-9" placeholder="dr.name@meridian.health"
              value={email} onChange={(e) => { setEmail(e.target.value); setErr(""); }} aria-invalid={!!err} />
          </div>
          {err && <p className="text-sm text-danger">{err}</p>}
        </div>
        <Button className="h-11 w-full" onClick={() => {
          if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return setErr("Enter a valid email address");
          toast.success("Verification code sent to your email"); onSent();
        }}>Send OTP</Button>
      </div>
    </AuthShell>
  );
}

/* ------------------------------------------------------------------ */
/* SCREEN 08 — OTP Verification                                        */
/* ------------------------------------------------------------------ */
export function Otp({ onVerified, onBack }: { onVerified: () => void; onBack: () => void }) {
  const [code, setCode] = useState("");
  const [left, setLeft] = useState(30);
  useEffect(() => {
    if (left <= 0) return;
    const t = setTimeout(() => setLeft((l) => l - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);
  return (
    <AuthShell>
      <button onClick={onBack} className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary">
        <ArrowLeft className="size-4" />Back
      </button>
      <h1 className="mt-6 font-bold text-text-primary" style={{ fontSize: 24 }}>Verify your identity</h1>
      <p className="mt-1 text-text-secondary">Enter the 6-digit code sent to your email address.</p>
      <div className="mt-8 flex flex-col items-center gap-6">
        <InputOTP maxLength={6} value={code} onChange={setCode}>
          <InputOTPGroup>
            {[0, 1, 2, 3, 4, 5].map((i) => <InputOTPSlot key={i} index={i} className="size-12" />)}
          </InputOTPGroup>
        </InputOTP>
        <div className="text-sm text-text-secondary">
          {left > 0 ? <>Resend code in <span className="font-medium text-text-primary">0:{left.toString().padStart(2, "0")}</span></>
            : <button className="font-medium text-primary hover:underline" onClick={() => { setLeft(30); toast.success("New code sent"); }}>Resend OTP</button>}
        </div>
        <Button className="h-11 w-full" disabled={code.length < 6} onClick={() => { toast.success("Identity verified"); onVerified(); }}>Verify</Button>
      </div>
    </AuthShell>
  );
}

/* ------------------------------------------------------------------ */
/* SCREEN 09 — Reset Password                                          */
/* ------------------------------------------------------------------ */
function strength(p: string) {
  let s = 0;
  if (p.length >= 8) s++;
  if (/[A-Z]/.test(p)) s++;
  if (/[0-9]/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return s;
}
export function Reset({ onDone }: { onDone: () => void }) {
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [err, setErr] = useState("");
  const s = strength(p1);
  const labels = ["Very weak", "Weak", "Fair", "Good", "Strong"];
  const colors = ["#dc2626", "#dc2626", "#f59e0b", "#0ea5e9", "#16a34a"];
  return (
    <AuthShell>
      <h1 className="font-bold text-text-primary" style={{ fontSize: 24 }}>Set a new password</h1>
      <p className="mt-1 text-text-secondary">Choose a strong password you haven't used before.</p>
      <div className="mt-8 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="np">New password</Label>
          <Input id="np" type="password" className="h-11" value={p1} onChange={(e) => { setP1(e.target.value); setErr(""); }} />
          {p1 && (
            <div className="mt-1.5">
              <div className="flex gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="h-1.5 flex-1 rounded-full" style={{ background: i < s ? colors[s] : "#e5e7eb" }} />
                ))}
              </div>
              <p className="mt-1 text-xs" style={{ color: colors[s] }}>{labels[s]}</p>
            </div>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="cp">Confirm password</Label>
          <Input id="cp" type="password" className="h-11" value={p2} onChange={(e) => { setP2(e.target.value); setErr(""); }} aria-invalid={!!err} />
          {err && <p className="text-sm text-danger">{err}</p>}
        </div>
        <Button className="h-11 w-full" onClick={() => {
          if (s < 3) return setErr("Password is too weak — add a capital letter, number and symbol");
          if (p1 !== p2) return setErr("Passwords do not match");
          toast.success("Password reset successfully"); onDone();
        }}>Reset password</Button>
      </div>
    </AuthShell>
  );
}

/* ------------------------------------------------------------------ */
/* SCREEN 10 — Biometric                                               */
/* ------------------------------------------------------------------ */
export function Biometric({ onSuccess, onCancel }: { onSuccess: () => void; onCancel: () => void }) {
  const [scanning, setScanning] = useState(false);
  return (
    <AuthShell>
      <div className="flex flex-col items-center text-center">
        <h1 className="font-bold text-text-primary" style={{ fontSize: 24 }}>Biometric sign in</h1>
        <p className="mt-1 text-text-secondary">Place your finger on the sensor or use Face ID to continue.</p>
        <button
          onClick={() => { setScanning(true); setTimeout(() => { toast.success("Biometric verified"); onSuccess(); }, 1600); }}
          className={`mt-10 grid size-32 place-items-center rounded-full border-2 transition-all ${scanning ? "animate-pulse border-primary bg-secondary" : "border-border bg-surface hover:border-primary"}`}>
          <Fingerprint className={`size-16 ${scanning ? "text-primary" : "text-text-secondary"}`} strokeWidth={1.5} />
        </button>
        <p className="mt-6 text-sm text-text-secondary">{scanning ? "Scanning…" : "Tap to authenticate"}</p>
        <Button variant="outline" className="mt-8 h-11 w-full" onClick={onCancel}>Cancel</Button>
      </div>
    </AuthShell>
  );
}

/* ------------------------------------------------------------------ */
/* SCREEN 11 — Role Selection                                          */
/* ------------------------------------------------------------------ */
export const ROLES = [
  { id: "doctor", name: "Doctor", icon: Stethoscope, desc: "Consultations, EMR, prescriptions" },
  { id: "nurse", name: "Nurse", icon: Syringe, desc: "Vitals, ward rounds, medication" },
  { id: "receptionist", name: "Receptionist", icon: ClipboardList, desc: "Registration, appointments, queue" },
  { id: "pharmacist", name: "Pharmacist", icon: Activity, desc: "Dispensing, inventory, billing" },
  { id: "lab", name: "Laboratory", icon: FlaskConical, desc: "Sample collection, results" },
  { id: "radiologist", name: "Radiologist", icon: Scan, desc: "Imaging, reports, PACS" },
  { id: "ambulance", name: "Ambulance Driver", icon: Truck, desc: "Dispatch, routes, ETA" },
  { id: "admin", name: "Hospital Administrator", icon: UserCog, desc: "Operations, staff, reports" },
  { id: "super", name: "Super Administrator", icon: Crown, desc: "Full system configuration" },
] as const;

export function RoleSelection({ onSelect, onBack }: { onSelect: (role: string) => void; onBack: () => void }) {
  const [sel, setSel] = useState<string | null>("receptionist");
  return (
    <div className="mx-auto flex min-h-full w-full max-w-5xl flex-col p-6 sm:p-10">
      <button onClick={onBack} className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary">
        <ArrowLeft className="size-4" />Back
      </button>
      <div className="mt-6">
        <h1 className="font-bold text-text-primary" style={{ fontSize: 24 }}>Select your role</h1>
        <p className="mt-1 text-text-secondary">Choose the workspace you want to sign in to. Your access is scoped to your role.</p>
      </div>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ROLES.map((r) => {
          const active = sel === r.id;
          return (
            <button key={r.id} onClick={() => setSel(r.id)}
              className={`flex flex-col items-start gap-3 rounded-xl border bg-surface p-5 text-left transition-all hover:border-primary hover:shadow-sm ${active ? "border-primary ring-2 ring-primary/20" : "border-border"}`}>
              <div className={`grid size-11 place-items-center rounded-lg ${active ? "bg-primary text-primary-foreground" : "bg-secondary text-primary"}`}>
                <r.icon className="size-5" />
              </div>
              <div>
                <div className="font-medium text-text-primary">{r.name}</div>
                <div className="text-sm text-text-secondary">{r.desc}</div>
              </div>
              {active && <span className="inline-flex items-center gap-1 text-xs font-medium text-primary"><CheckCircle2 className="size-3.5" />Selected</span>}
            </button>
          );
        })}
      </div>
      <div className="mt-8 flex justify-end">
        <Button className="h-11 px-8" disabled={!sel} onClick={() => sel && onSelect(sel)}>Continue<ChevronRight className="size-4" /></Button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* SCREEN 12 — Two Factor                                              */
/* ------------------------------------------------------------------ */
export function TwoFactor({ onContinue, onBack }: { onContinue: () => void; onBack: () => void }) {
  const methods = [
    { id: "app", icon: Smartphone, name: "Authenticator app", desc: "Use a code from Google/Microsoft Authenticator" },
    { id: "sms", icon: MessageSquare, name: "SMS OTP", desc: "Send a code to •••• •••• 4821" },
    { id: "email", icon: Mail, name: "Email OTP", desc: "Send a code to d•••@meridian.health" },
    { id: "recovery", icon: KeyRound, name: "Recovery code", desc: "Use a saved backup code" },
  ];
  const [m, setM] = useState("app");
  const [remember, setRemember] = useState(false);
  return (
    <AuthShell>
      <button onClick={onBack} className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary">
        <ArrowLeft className="size-4" />Back
      </button>
      <div className="mt-6 flex items-center gap-2 text-primary"><ShieldCheck className="size-5" /><span className="text-sm font-medium">Two-factor authentication</span></div>
      <h1 className="mt-2 font-bold text-text-primary" style={{ fontSize: 24 }}>Verify it's you</h1>
      <p className="mt-1 text-text-secondary">Choose how you'd like to receive your verification code.</p>
      <div className="mt-6 space-y-3">
        {methods.map((x) => {
          const active = m === x.id;
          return (
            <button key={x.id} onClick={() => setM(x.id)}
              className={`flex w-full items-center gap-3 rounded-xl border bg-surface p-4 text-left transition-all hover:border-primary ${active ? "border-primary ring-2 ring-primary/20" : "border-border"}`}>
              <div className={`grid size-10 place-items-center rounded-lg ${active ? "bg-primary text-primary-foreground" : "bg-secondary text-primary"}`}><x.icon className="size-5" /></div>
              <div className="flex-1">
                <div className="font-medium text-text-primary">{x.name}</div>
                <div className="text-sm text-text-secondary">{x.desc}</div>
              </div>
              <div className={`size-4 rounded-full border-2 ${active ? "border-primary bg-primary" : "border-border"}`} />
            </button>
          );
        })}
      </div>
      <label className="mt-4 flex items-center gap-2 text-sm text-text-secondary">
        <Checkbox checked={remember} onCheckedChange={(v) => setRemember(!!v)} /> Remember this device for 30 days
      </label>
      <Button className="mt-6 h-11 w-full" onClick={() => { toast.success("Verification method confirmed"); onContinue(); }}>Continue</Button>
    </AuthShell>
  );
}

/* ------------------------------------------------------------------ */
/* SCREEN 18 — Successful Login                                        */
/* ------------------------------------------------------------------ */
export function LoginSuccess({ role, onDone }: { role: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2200);
    return () => clearTimeout(t);
  }, [onDone]);
  const roleName = ROLES.find((r) => r.id === role)?.name ?? "Staff";
  return (
    <div className="grid h-full w-full place-items-center bg-canvas">
      <div className="flex flex-col items-center gap-5 text-center">
        <div className="grid size-20 place-items-center rounded-full bg-success/10 text-success">
          <CheckCircle2 className="size-12" />
        </div>
        <div>
          <h1 className="font-bold text-text-primary" style={{ fontSize: 24 }}>Welcome back!</h1>
          <p className="mt-1 text-text-secondary">Signed in as <span className="font-medium text-text-primary">{roleName}</span></p>
        </div>
        <div className="flex items-center gap-2 text-sm text-text-secondary"><Loader2 className="size-4 animate-spin" />Loading your dashboard…</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* SCREEN 15 — Account Locked (error state)                            */
/* ------------------------------------------------------------------ */
export function AccountLocked({ onBack }: { onBack: () => void }) {
  return (
    <AuthShell>
      <div className="flex flex-col items-center text-center">
        <div className="grid size-16 place-items-center rounded-full bg-danger/10 text-danger"><AlertTriangle className="size-8" /></div>
        <h1 className="mt-6 font-bold text-text-primary" style={{ fontSize: 24 }}>Account temporarily locked</h1>
        <p className="mt-1 text-text-secondary">For your security, this account has been locked after 5 failed sign-in attempts.</p>
        <div className="mt-6 w-full rounded-xl border border-warning/30 bg-warning/10 p-4 text-left text-sm">
          <div className="font-medium text-text-primary">Remaining unlock attempts: 0 of 5</div>
          <div className="mt-1 text-text-secondary">Try again in 30 minutes or contact your administrator.</div>
        </div>
        <div className="mt-6 w-full space-y-3">
          <Button className="h-11 w-full" onClick={onBack}>Back to login</Button>
          <Button variant="outline" className="h-11 w-full" onClick={() => toast.info("Please contact your system administrator at admin@hospital.org")}>Contact administrator</Button>
        </div>
      </div>
    </AuthShell>
  );
}
