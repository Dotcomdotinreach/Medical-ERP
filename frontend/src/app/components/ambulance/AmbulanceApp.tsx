"use client";

import { useState, useEffect } from "react";
import {
  Ambulance, LayoutDashboard,
} from "lucide-react";
import { Shell, type NavItem, type Workspace } from "../his/Shell";
import { IncomingAmbulances } from "./IncomingAmbulances";
import { AmbulanceDashboard } from "./AmbulanceDashboard";
import { AmbulanceAnalytics } from "./AmbulanceAnalytics";
import { ambulanceApi, AmbulanceDispatch } from "../../services/ambulance";

export type AmbulanceRoute = "dashboard" | "dispatches" | "analytics";

const NAV: NavItem[] = [
  { id: "dashboard", label: "Ambulance Dashboard", icon: LayoutDashboard },
  { id: "dispatches", label: "Active Dispatches", icon: Ambulance, badge: "12" },
];

const CRUMBS: Partial<Record<AmbulanceRoute, string[]>> = {
  dashboard: ["Ambulance", "Dashboard"],
  dispatches: ["Ambulance", "Active Dispatches"],
};

export function AmbulanceApp({
  roleName,
  onSignOut,
  onSwitchWorkspace,
  onOpenSettings,
}: {
  roleName: string;
  onSignOut: () => void;
  onSwitchWorkspace: (w: Workspace) => void;
  onOpenSettings?: (page: string) => void;
}) {
  const [route, setRoute] = useState<AmbulanceRoute>("dashboard");
  const [liveDispatches, setLiveDispatches] = useState<AmbulanceDispatch[]>(AMBULANCE_DISPATCHES);

  useEffect(() => {
    ambulanceApi.listDispatches().then((r) => {
      if (r.data?.length) {
        setLiveDispatches(r.data);
      }
    }).catch(() => {
      console.error("Failed to fetch ambulance dispatches from API, using mock data");
    });
  }, []);

  const activeDispatches = liveDispatches.filter(d => d.status === "Dispatched" || d.status === "On Route");

  const dashboardStats = {
    totalDispatches: liveDispatches.length,
    activeDispatches: activeDispatches.length,
    pendingDispatches: liveDispatches.filter(d => d.status === "Pending").length,
    avgETAMin: liveDispatches.reduce((sum, d) => sum + (d.eta || 0), 0) / liveDispatches.length || 0,
  };

  const navigate = (id: string) => {
    const r = id as AmbulanceRoute;
    setRoute(r);
  };

  return (
    <Shell
      nav={NAV}
      sectionLabel="Emergency Ambulance"
      activeId={route}
      onNavigate={navigate}
      breadcrumb={CRUMBS[route] ?? ["Ambulance", "Dashboard"]}
      roleName={roleName}
      onSignOut={onSignOut}
      workspace="ambulance"
      onSwitchWorkspace={onSwitchWorkspace}
      onOpenSettings={onOpenSettings}
      searchPlaceholder="Search dispatches, patients…"
    >
      {route === "dashboard" && (
        <AmbulanceDashboard
          liveDispatches={liveDispatches}
          stats={dashboardStats}
          onNavigate={setRoute}
        />
      )}
      {route === "dispatches" && <IncomingAmbulances liveDispatches={liveDispatches} onUpdate={setLiveDispatches} />}
      {route === "analytics" && <AmbulanceAnalytics liveDispatches={liveDispatches} />}
    </Shell>
  );
}
