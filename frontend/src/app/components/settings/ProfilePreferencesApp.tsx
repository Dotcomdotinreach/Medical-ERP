import { useState, useEffect } from "react";
import { toast } from "sonner";
import { User, Bell, Palette, Globe, Lock, Camera, Mail, Phone, Shield, Save, ArrowLeft } from "lucide-react";
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

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "security", label: "Security", icon: Lock },
  { id: "language", label: "Language & Region", icon: Globe },
];

const NOTIFICATION_SETTINGS = [
  { label: "Patient admission alerts", desc: "Get notified when new patients are admitted", enabled: true },
  { label: "Lab result ready", desc: "Alert when STAT or critical lab results are available", enabled: true },
  { label: "Emergency department queue", desc: "Real-time updates on ED patient flow", enabled: false },
  { label: "Shift schedule changes", desc: "Notify when your upcoming shift is modified", enabled: true },
  { label: "Medication reminders", desc: "Patient medication administration reminders", enabled: true },
  { label: "System maintenance", desc: "Scheduled downtime and system updates", enabled: false },
  { label: "New messages", desc: "Direct messages from colleagues", enabled: true },
  { label: "Billing anomalies", desc: "Flag unusual billing patterns or claim rejections", enabled: false },
];

export function ProfilePreferencesApp({ roleName, onSignOut, onSwitchWorkspace, onOpenSettings, onBack, nav, navSecondary, sectionLabel }: Props) {
  const [activeTab, setActiveTab] = useState("profile");
  const [name, setName] = useState("Priya Sharma");
  const [email, setEmail] = useState("priya.sharma@hospital.org");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [department, setDepartment] = useState("Administration");
  const [designation, setDesignation] = useState("Super Administrator");
  const [notifs, setNotifs] = useState(NOTIFICATION_SETTINGS.map((n) => n.enabled));
  const [theme, setTheme] = useState(() => localStorage.getItem("meridian-theme") || "light");
  const [fontSize, setFontSize] = useState(() => localStorage.getItem("meridian-font-size") || "medium");
  const [lang, setLang] = useState("en");
  const [timezone, setTimezone] = useState("Asia/Kolkata");

  const toggleNotif = (i: number) => setNotifs((p) => p.map((v, idx) => (idx === i ? !v : v)));

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.style.setProperty("color-scheme", "dark");
    } else if (theme === "light") {
      root.classList.remove("dark");
      root.style.setProperty("color-scheme", "light");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.toggle("dark", prefersDark);
      root.style.setProperty("color-scheme", prefersDark ? "dark" : "light");
    }
    localStorage.setItem("meridian-theme", theme);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    const sizes: Record<string, string> = { small: "14px", medium: "16px", large: "18px" };
    root.style.setProperty("font-size", sizes[fontSize] || "16px");
    localStorage.setItem("meridian-font-size", fontSize);
  }, [fontSize]);

  return (
    <Shell
      nav={nav}
      navSecondary={navSecondary}
      sectionLabel={sectionLabel}
      activeId="profile"
      onNavigate={() => onBack()}
      breadcrumb={["Home", "Settings", "Profile & Preferences"]}
      roleName={roleName}
      onSignOut={onSignOut}
      workspace="reception"
      onSwitchWorkspace={onSwitchWorkspace}
      onOpenSettings={onOpenSettings}
    >
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="rounded-lg border border-border p-2 hover:bg-accent"><ArrowLeft className="size-4" /></button>
          <PageHeader title="Profile & Preferences" subtitle="Manage your account settings and preferences" />
        </div>

        <div className="flex gap-2 overflow-x-auto border-b border-border pb-2">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors ${activeTab === t.id ? "bg-primary text-primary-foreground" : "text-text-secondary hover:bg-accent"}`}>
              <t.icon className="size-4" />{t.label}
            </button>
          ))}
        </div>

        {activeTab === "profile" && (
          <div className="space-y-6">
            <SectionCard title="Personal Information">
              <div className="flex items-start gap-6">
                <div className="relative">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">PS</div>
                  <button className="absolute bottom-0 right-0 rounded-full bg-primary p-1.5 text-white shadow"><Camera className="size-3" /></button>
                </div>
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-text-secondary">Full Name</label>
                      <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none" />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-text-secondary">Email</label>
                      <div className="flex items-center gap-2">
                        <Mail className="size-4 text-text-secondary" />
                        <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none" />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-text-secondary">Phone</label>
                      <div className="flex items-center gap-2">
                        <Phone className="size-4 text-text-secondary" />
                        <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none" />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-text-secondary">Role</label>
                      <input value={roleName} readOnly className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-text-secondary" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-text-secondary">Department</label>
                      <input value={department} onChange={(e) => setDepartment(e.target.value)} className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none" />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-text-secondary">Designation</label>
                      <input value={designation} onChange={(e) => setDesignation(e.target.value)} className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none" />
                    </div>
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Account Status">
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2"><StatusBadge tone="success">Active</StatusBadge><span className="text-sm text-text-secondary">Account Status</span></div>
                <div className="flex items-center gap-2"><Shield className="size-4 text-primary" /><span className="text-sm text-text-secondary">{roleName} Access Level</span></div>
                <div className="flex items-center gap-2"><span className="text-sm text-text-secondary">Last login: Today 08:15 AM</span></div>
              </div>
            </SectionCard>

            <div className="flex justify-end"><Button onClick={() => toast.success("Profile saved successfully")}><Save className="size-4 mr-1" />Save Changes</Button></div>
          </div>
        )}

        {activeTab === "notifications" && (
          <SectionCard title="Notification Preferences">
            <div className="space-y-1">
              {NOTIFICATION_SETTINGS.map((n, i) => (
                <div key={n.label} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div><div className="text-sm font-medium text-text-primary">{n.label}</div><div className="text-xs text-text-secondary">{n.desc}</div></div>
                  <div className={`w-10 h-5 rounded-full cursor-pointer transition-colors ${notifs[i] ? "bg-primary" : "bg-gray-300"}`} onClick={() => toggleNotif(i)}>
                    <div className={`w-4 h-4 rounded-full bg-white mt-0.5 transition-transform ${notifs[i] ? "translate-x-5" : "translate-x-0.5"}`} />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-4"><Button onClick={() => toast.success("Preferences saved")}><Save className="size-4 mr-1" />Save Preferences</Button></div>
          </SectionCard>
        )}

        {activeTab === "appearance" && (
          <div className="space-y-6">
            <SectionCard title="Theme">
              <div className="grid grid-cols-3 gap-3">
                {["light", "dark", "system"].map((t) => (
                  <button key={t} onClick={() => setTheme(t)}
                    className={`rounded-lg border-2 p-4 text-center text-sm font-medium transition-colors ${theme === t ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/50"}`}>
                    {t === "light" ? "☀️" : t === "dark" ? "🌙" : "💻"} {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </SectionCard>
            <SectionCard title="Font Size">
              <div className="flex gap-3">
                {["small", "medium", "large"].map((s) => (
                  <button key={s} onClick={() => setFontSize(s)}
                    className={`rounded-lg border-2 px-6 py-2 text-sm font-medium transition-colors ${fontSize === s ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/50"}`}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </SectionCard>
          </div>
        )}

        {activeTab === "security" && (
          <div className="space-y-6">
            <SectionCard title="Change Password">
              <div className="space-y-4 max-w-md">
                <div><label className="mb-1 block text-xs font-medium text-text-secondary">Current Password</label><input type="password" className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none" /></div>
                <div><label className="mb-1 block text-xs font-medium text-text-secondary">New Password</label><input type="password" className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none" /></div>
                <div><label className="mb-1 block text-xs font-medium text-text-secondary">Confirm New Password</label><input type="password" className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none" /></div>
                <Button onClick={() => {}}><Lock className="size-4 mr-1" />Update Password</Button>
              </div>
            </SectionCard>
            <SectionCard title="Two-Factor Authentication">
              <div className="flex items-center justify-between">
                <div><div className="text-sm font-medium text-text-primary">2FA is enabled</div><div className="text-xs text-text-secondary">Authenticator app</div></div>
                <StatusBadge tone="success">Active</StatusBadge>
              </div>
            </SectionCard>
            <SectionCard title="Active Sessions">
              <div className="space-y-3">
                {[{ device: "Chrome on Windows", ip: "192.168.1.5", time: "Current session" }, { device: "Safari on iPhone", ip: "10.0.0.12", time: "2 hours ago" }].map((s) => (
                  <div key={s.device} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div><div className="text-sm font-medium text-text-primary">{s.device}</div><div className="text-xs text-text-secondary">{s.ip} · {s.time}</div></div>
                    {s.time !== "Current session" && <button className="text-xs text-danger hover:underline">Revoke</button>}
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        )}

        {activeTab === "language" && (
          <div className="space-y-6">
            <SectionCard title="Language & Region">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 max-w-lg">
                <div>
                  <label className="mb-1 block text-xs font-medium text-text-secondary">Language</label>
                  <select value={lang} onChange={(e) => setLang(e.target.value)} className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none">
                    <option value="en">English</option><option value="hi">Hindi</option><option value="mr">Marathi</option><option value="ta">Tamil</option><option value="te">Telugu</option><option value="kn">Kannada</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-text-secondary">Timezone</label>
                  <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none">
                    <option value="Asia/Kolkata">IST (UTC+5:30)</option><option value="UTC">UTC</option><option value="America/New_York">EST (UTC-5)</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-text-secondary">Date Format</label>
                  <select className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none">
                    <option>DD/MM/YYYY</option><option>MM/DD/YYYY</option><option>YYYY-MM-DD</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-text-secondary">Time Format</label>
                  <select className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none">
                    <option>12-hour (AM/PM)</option><option>24-hour</option>
                  </select>
                </div>
              </div>
            </SectionCard>
          </div>
        )}
      </div>
    </Shell>
  );
}
