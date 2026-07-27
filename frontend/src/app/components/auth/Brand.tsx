import { Activity, ShieldCheck, HeartPulse, Stethoscope } from "lucide-react";

export const HOSPITAL_NAME = "Meridian Health";
export const HOSPITAL_FULL = "Meridian Multi-Speciality Hospital";

export function Logo({ size = 40, showName = true }: { size?: number; showName?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="grid place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm"
        style={{ width: size, height: size }}
      >
        <Activity style={{ width: size * 0.55, height: size * 0.55 }} strokeWidth={2.4} />
      </div>
      {showName && (
        <div className="leading-tight">
          <div className="font-semibold text-text-primary">{HOSPITAL_NAME}</div>
          <div className="text-xs text-text-secondary">Hospital Information System</div>
        </div>
      )}
    </div>
  );
}

/** Left branding panel used across the auth flow (desktop only). */
export function BrandPanel() {
  const features = [
    { icon: HeartPulse, title: "Real-time patient monitoring", desc: "Vitals, alerts & triage in one view" },
    { icon: Stethoscope, title: "Connected clinical workflows", desc: "OPD, IPD, Lab, Radiology & Pharmacy" },
    { icon: ShieldCheck, title: "HIPAA & ABDM compliant", desc: "End-to-end encryption, full audit trail" },
  ];
  return (
    <div className="relative hidden h-full flex-col justify-between overflow-hidden bg-primary p-12 text-primary-foreground lg:flex">
      {/* decorative grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-white/10 blur-2xl" />

      <div className="relative z-10">
        <Logo size={44} showName={false} />
        <div className="mt-4 font-semibold text-white" style={{ fontSize: 20 }}>{HOSPITAL_FULL}</div>
        <div className="mt-1 text-sm text-white/70">NABH Accredited · 24×7 Emergency · 32 Departments</div>
      </div>

      <div className="relative z-10 space-y-6">
        <div>
          <div className="font-bold text-white" style={{ fontSize: 30, lineHeight: 1.25 }}>
            One platform for<br />the entire hospital.
          </div>
          <p className="mt-3 max-w-sm text-sm text-white/75">
            Secure, unified access for doctors, nurses, reception, pharmacy, lab and administration.
          </p>
        </div>
        <div className="space-y-3">
          {features.map((f) => (
            <div key={f.title} className="flex items-start gap-3 rounded-xl bg-white/10 p-3 backdrop-blur-sm">
              <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-white/15">
                <f.icon className="size-5" />
              </div>
              <div>
                <div className="text-sm font-medium text-white">{f.title}</div>
                <div className="text-xs text-white/70">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-between text-xs text-white/60">
        <span>© 2026 Meridian Health Systems</span>
        <span>v4.2.0</span>
      </div>
    </div>
  );
}

/** Standard right-side auth shell: brand panel + centered card content. */
export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid h-full w-full grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <BrandPanel />
      <div className="flex h-full items-center justify-center overflow-y-auto bg-canvas p-6 sm:p-10">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
