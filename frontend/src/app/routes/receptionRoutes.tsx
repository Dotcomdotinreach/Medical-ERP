import { Navigate } from "react-router";
import ReceptionLayout from "../layouts/ReceptionLayout";
import { Dashboard } from "../components/reception/Dashboard";
import { PatientSearch } from "../components/reception/PatientSearch";
import { RegisterPatient } from "../components/reception/RegisterPatient";
import { Emergency } from "../components/reception/Emergency";
import { Appointment } from "../components/reception/Appointment";
import { Queue } from "../components/reception/Queue";
import { Beds } from "../components/reception/Beds";
import { useModuleGo } from "../hooks/useModuleGo";
import { DOCTORS } from "../components/his/data";

function DashboardWrap() { const go = useModuleGo("reception"); return <Dashboard go={go as any} doctors={DOCTORS as any} />; }
function PatientSearchWrap() { const go = useModuleGo("reception"); return <PatientSearch go={go as any} onOpen={() => {}} />; }
function RegisterPatientWrap() { const go = useModuleGo("reception"); return <RegisterPatient go={go as any} />; }
function EmergencyWrap() { const go = useModuleGo("reception"); return <Emergency go={go as any} />; }
function AppointmentWrap() { const go = useModuleGo("reception"); return <Appointment go={go as any} />; }

export const receptionRoute = {
  path: "/reception",
  element: <ReceptionLayout />,
  children: [
    { index: true, element: <Navigate to="dashboard" replace /> },
    { path: "dashboard", element: <DashboardWrap /> },
    { path: "patients/search", element: <PatientSearchWrap /> },
    { path: "patients/register", element: <RegisterPatientWrap /> },
    { path: "emergency", element: <EmergencyWrap /> },
    { path: "appointments", element: <AppointmentWrap /> },
    { path: "queue", element: <Queue /> },
    { path: "beds", element: <Beds /> },
  ],
};
