import { useState, useEffect } from "react";
import { Toaster } from "./components/ui/sonner";
import {
  Splash, Onboarding, Welcome, Login, Forgot, Otp, Reset, Biometric,
  RoleSelection, TwoFactor, LoginSuccess, type Screen,
} from "./components/auth/screens";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { receptionRoute } from "./routes/receptionRoutes";
import { doctorRoute } from "./routes/doctorRoutes";
import { EmergencyApp } from "./components/emergency/EmergencyApp";
import { NurseApp } from "./components/nurse/NurseApp";
import { LisApp } from "./components/laboratory/LisApp";
import { RisApp } from "./components/radiology/RisApp";
import { PmsApp } from "./components/pharmacy/PmsApp";
import { IpdApp } from "./components/ipd/IpdApp";
import { OtApp } from "./components/ot/OtApp";
import { IcuApp } from "./components/icu/IcuApp";
import { BillingApp } from "./components/billing/BillingApp";
import { InventoryApp } from "./components/inventory/InventoryApp";
import { PatientPortalApp } from "./components/patientPortal/PatientPortalApp";
import { AmbulanceApp } from "./components/ambulance/AmbulanceApp";
import { AdminApp } from "./components/admin/AdminApp";
import { SuperAdminApp } from "./components/superAdmin/SuperAdminApp";
import { HrmsApp } from "./components/hrms/HrmsApp";
import { CssdApp } from "./components/cssd/CssdApp";
import { BloodBankApp } from "./components/bloodBank/BloodBankApp";
import { DialysisApp } from "./components/dialysis/DialysisApp";
import { MaternityApp } from "./components/maternity/MaternityApp";
import { PediatricsApp } from "./components/pediatrics/PediatricsApp";
import { OncologyApp } from "./components/oncology/OncologyApp";
import { TelemedicineApp } from "./components/telemedicine/TelemedicineApp";
import { CdssApp } from "./components/cdss/CdssApp";
import { AiApp } from "./components/ai/AiApp";
import { ResearchApp } from "./components/research/ResearchApp";
import InteropApp from "./components/interop/InteropApp";
import { ProfilePreferencesApp } from "./components/settings/ProfilePreferencesApp";
import { ShiftAttendanceApp } from "./components/settings/ShiftAttendanceApp";
import { KeyboardShortcutsApp } from "./components/settings/KeyboardShortcutsApp";
import { WORKSPACE_NAVS } from "./components/his/workspaceNavs";
import type { Workspace } from "./components/his/Shell";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router";

const ALL_ROLES = ["super_admin", "admin", "doctor", "nurse", "receptionist", "pharmacist", "lab_tech", "radiologist", "billing", "inventory", "hr"];

function AppInner() {
  const { user, loading, login, logout } = useAuth();
  const [screen, setScreen] = useState<Screen>("splash");
  const [role, setRole] = useState<string>("receptionist");
  const [settingsPage, setSettingsPage] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const pathSegment = location.pathname.substring(1).split("/")[0];
  const workspace = (pathSegment || "reception") as Workspace;

  const go = (s: Screen) => setScreen(s);

  useEffect(() => {
    if (user && location.pathname === "/") {
      navigate("/reception", { replace: true });
    }
  }, [user, location.pathname, navigate]);

  if (loading) {
    return (
      <div className="h-full w-full grid place-items-center bg-primary">
        <div className="text-white text-lg animate-pulse">Loading…</div>
      </div>
    );
  }

  if (user) {
    const roleName = user.role === "super_admin" ? "Super Admin" :
      user.role === "admin" ? "Administrator" :
      user.role === "doctor" ? "Doctor" :
      user.role === "nurse" ? "Nurse" :
      user.role === "receptionist" ? "Receptionist" :
      user.role === "pharmacist" ? "Pharmacist" :
      user.role === "lab_tech" ? "Lab Technician" :
      user.role === "radiologist" ? "Radiologist" :
      user.role === "billing" ? "Billing Staff" :
      user.role === "inventory" ? "Inventory Staff" :
      user.role === "hr" ? "HR Manager" : "Staff";

    const signOut = () => { logout(); setScreen("welcome"); setSettingsPage(null); navigate("/", { replace: true }); };
    const openSettings = (page: string) => setSettingsPage(page);
    const closeSettings = () => setSettingsPage(null);
    const wsNav = WORKSPACE_NAVS[workspace] ?? WORKSPACE_NAVS.reception;
    const switchWorkspace = (w: Workspace) => navigate("/" + w);
    const shellProps = { roleName, onSignOut: signOut, onSwitchWorkspace: switchWorkspace, onOpenSettings: openSettings };

    if (settingsPage === "profile") {
      return <><ProfilePreferencesApp {...shellProps} onBack={closeSettings} nav={wsNav.nav} navSecondary={wsNav.navSecondary} sectionLabel={wsNav.sectionLabel} /><Toaster position="top-right" richColors /></>;
    }
    if (settingsPage === "shift") {
      return <><ShiftAttendanceApp {...shellProps} onBack={closeSettings} nav={wsNav.nav} navSecondary={wsNav.navSecondary} sectionLabel={wsNav.sectionLabel} /><Toaster position="top-right" richColors /></>;
    }
    if (settingsPage === "shortcuts") {
      return <><KeyboardShortcutsApp {...shellProps} onBack={closeSettings} nav={wsNav.nav} navSecondary={wsNav.navSecondary} sectionLabel={wsNav.sectionLabel} /><Toaster position="top-right" richColors /></>;
    }

    return (
      <>
        <Routes>
          <Route element={<ProtectedRoute />}>
            {receptionRoute.children && <Route path={receptionRoute.path} element={receptionRoute.element}>
              {receptionRoute.children.map((child: any) => (
                <Route key={child.path || "index"} path={child.path} index={child.index} element={child.element} />
              ))}
            </Route>}
            {doctorRoute.children && <Route path={doctorRoute.path} element={doctorRoute.element}>
              {doctorRoute.children.map((child: any) => (
                <Route key={child.path || "index"} path={child.path} index={child.index} element={child.element} />
              ))}
            </Route>}
            <Route path="/emergency" element={<EmergencyApp {...shellProps} />} />
            <Route path="/nurse" element={<NurseApp {...shellProps} />} />
            <Route path="/laboratory" element={<LisApp {...shellProps} />} />
            <Route path="/radiology" element={<RisApp {...shellProps} />} />
            <Route path="/pharmacy" element={<PmsApp {...shellProps} />} />
            <Route path="/ipd" element={<IpdApp {...shellProps} />} />
            <Route path="/ot" element={<OtApp {...shellProps} />} />
            <Route path="/icu" element={<IcuApp {...shellProps} />} />
            <Route path="/billing" element={<BillingApp {...shellProps} />} />
            <Route path="/inventory" element={<InventoryApp {...shellProps} />} />
            <Route path="/patient-portal" element={<PatientPortalApp {...shellProps} />} />
            <Route path="/ambulance" element={<AmbulanceApp {...shellProps} />} />
            <Route path="/admin" element={<AdminApp {...shellProps} />} />
            <Route path="/super-admin" element={<SuperAdminApp {...shellProps} />} />
            <Route path="/hrms" element={<HrmsApp {...shellProps} />} />
            <Route path="/cssd" element={<CssdApp {...shellProps} />} />
            <Route path="/blood-bank" element={<BloodBankApp {...shellProps} />} />
            <Route path="/dialysis" element={<DialysisApp {...shellProps} />} />
            <Route path="/maternity" element={<MaternityApp {...shellProps} />} />
            <Route path="/pediatrics" element={<PediatricsApp {...shellProps} />} />
            <Route path="/oncology" element={<OncologyApp {...shellProps} />} />
            <Route path="/telemedicine" element={<TelemedicineApp {...shellProps} />} />
            <Route path="/cdss" element={<CdssApp {...shellProps} />} />
            <Route path="/ai" element={<AiApp {...shellProps} />} />
            <Route path="/research" element={<ResearchApp {...shellProps} />} />
            <Route path="/interop" element={<InteropApp {...shellProps} />} />
          </Route>
          <Route path="*" element={<Navigate to="/reception" replace />} />
        </Routes>
        <Toaster position="top-right" richColors />
      </>
    );
  }

  return (
    <div className="h-full w-full">
      {screen === "splash" && <Splash onDone={() => go("onboarding")} />}
      {screen === "onboarding" && <Onboarding onFinish={() => go("welcome")} />}
      {screen === "welcome" && <Welcome onLogin={() => go("login")} />}
      {screen === "login" && (
        <Login
          onSuccess={() => go("role")}
          onForgot={() => go("forgot")}
          onBiometric={() => go("biometric")}
          onLogin={login}
        />
      )}
      {screen === "forgot" && <Forgot onSent={() => go("otp")} onBack={() => go("login")} />}
      {screen === "otp" && <Otp onVerified={() => go("reset")} onBack={() => go("forgot")} />}
      {screen === "reset" && <Reset onDone={() => go("login")} />}
      {screen === "biometric" && <Biometric onSuccess={() => go("role")} onCancel={() => go("login")} />}
      {screen === "role" && <RoleSelection onSelect={(r) => { setRole(r); go("twofactor"); }} onBack={() => go("login")} />}
      {screen === "twofactor" && <TwoFactor onContinue={() => go("success")} onBack={() => go("role")} />}
      {screen === "success" && <LoginSuccess role={role} onDone={() => {}} />}
      <Toaster position="top-right" richColors />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppInner />
      </BrowserRouter>
    </AuthProvider>
  );
}
