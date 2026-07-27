import { Navigate } from "react-router";
import DoctorLayout from "../layouts/DoctorLayout";
import { DoctorDashboard } from "../components/doctor/DoctorDashboard";
import { DoctorSchedule } from "../components/doctor/DoctorSchedule";
import { DoctorEmergencyQueue } from "../components/doctor/DoctorEmergencyQueue";
import { Encounter } from "../components/doctor/Encounter";
import { APPOINTMENTS } from "../components/doctor/docData";

function DashboardWrap() {
  const openConsult = () => {};
  return <DoctorDashboard go={() => {}} openConsult={openConsult} appointments={APPOINTMENTS as any} />;
}
function ScheduleWrap() {
  const openConsult = () => {};
  return <DoctorSchedule openConsult={openConsult} appointments={APPOINTMENTS as any} />;
}
function EmergencyQueueWrap() {
  const openConsult = () => {};
  return <DoctorEmergencyQueue openConsult={openConsult} />;
}
function EncounterWrap() {
  return <Encounter onExit={() => {}} />;
}

export const doctorRoute = {
  path: "/doctor",
  element: <DoctorLayout />,
  children: [
    { index: true, element: <Navigate to="dashboard" replace /> },
    { path: "dashboard", element: <DashboardWrap /> },
    { path: "schedule", element: <ScheduleWrap /> },
    { path: "emergency", element: <EmergencyQueueWrap /> },
    { path: "encounter", element: <EncounterWrap /> },
  ],
};
