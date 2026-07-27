import { Outlet, useNavigate, useLocation } from "react-router";
import { LayoutDashboard, ClipboardList, TestTube, Activity, Inbox, Microscope, ShieldAlert, FileText, TriangleAlert, BadgeCheck, Layers, Zap, Package, Hammer, BarChart3, FolderOpen } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Shell, type NavItem, type Workspace } from "../components/his/Shell";

const NAV: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "orders", label: "Today's Orders", icon: ClipboardList, badge: "10" },
  { id: "collection", label: "Sample Collection", icon: TestTube },
  { id: "tracking", label: "Sample Tracking", icon: Activity },
  { id: "receiving", label: "Sample Receiving", icon: Inbox, badge: "3" },
  { id: "analyzer", label: "Analyzer Queue", icon: Microscope },
  { id: "qc", label: "Quality Control", icon: ShieldAlert },
  { id: "result-entry", label: "Result Entry", icon: FileText },
  { id: "critical", label: "Critical Results", icon: TriangleAlert, badge: "3", tone: "danger" },
  { id: "verification", label: "Verification", icon: BadgeCheck },
  { id: "report", label: "Lab Report", icon: Layers },
];
const NAV_SECONDARY: NavItem[] = [
  { id: "delivery", label: "Result Delivery", icon: Zap },
  { id: "inventory", label: "Inventory", icon: Package },
  { id: "equipment", label: "Equipment", icon: Hammer },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "audit", label: "Audit Logs", icon: FolderOpen },
];

const CRUMBS: Record<string, string[]> = {
  dashboard: ["Laboratory", "Dashboard"],
  orders: ["Laboratory", "Today's Orders"],
  collection: ["Laboratory", "Sample Collection"],
  tracking: ["Laboratory", "Sample Tracking"],
  receiving: ["Laboratory", "Sample Receiving"],
  analyzer: ["Laboratory", "Analyzer Queue"],
  qc: ["Laboratory", "Quality Control"],
  "result-entry": ["Laboratory", "Result Entry"],
  critical: ["Laboratory", "Critical Results"],
  verification: ["Laboratory", "Result Verification"],
  report: ["Laboratory", "Lab Report"],
  delivery: ["Laboratory", "Result Delivery"],
  inventory: ["Laboratory", "Inventory"],
  equipment: ["Laboratory", "Equipment"],
  analytics: ["Laboratory", "Analytics"],
  audit: ["Laboratory", "Audit Logs"],
};

export default function LaboratoryLayout() {
  const { user } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const roleName = user?.role === "super_admin" ? "Super Admin" :
    user?.role === "admin" ? "Administrator" :
    user?.role === "lab_tech" ? "Lab Technician" : "Staff";

  const screen = loc.pathname.replace("/laboratory/", "").replace("/laboratory", "") || "dashboard";
  const breadcrumb = CRUMBS[screen] ?? ["Laboratory", screen];

  return (
    <Shell
      nav={NAV} navSecondary={NAV_SECONDARY} sectionLabel="Laboratory"
      activeId={screen} onNavigate={(id) => nav(`/laboratory/${id}`)}
      breadcrumb={breadcrumb} roleName={roleName}
      onSignOut={() => {}} workspace="laboratory" onSwitchWorkspace={(w: Workspace) => nav("/" + w)}
      onOpenSettings={(page: string) => nav("/settings/" + page)}
      userRole={user?.role}
    >
      <Outlet />
    </Shell>
  );
}
