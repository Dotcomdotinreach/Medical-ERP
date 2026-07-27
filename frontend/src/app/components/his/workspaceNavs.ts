import {
  LayoutDashboard, Search, UserPlus, Siren, CalendarDays, ClipboardList, BedDouble,
  Stethoscope, Receipt, Users, BarChart3, Settings, HeartPulse, Microscope, Monitor,
  Pill, BedDouble as BedIcon, Scissors, Banknote, Package, Smartphone, Ambulance,
  Shield, Globe, UserCheck, Activity, Baby, Video, Brain, Sparkles, FlaskConical, Network,
  ClipboardPlus, FileText, Clock,
} from "lucide-react";
import type { NavItem } from "./Shell";

export const WORKSPACE_NAVS: Record<string, { sectionLabel: string; nav: NavItem[]; navSecondary?: NavItem[] }> = {
  reception: {
    sectionLabel: "Reception",
    nav: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      {
        id: "patient-mgmt", label: "Patient Management", icon: Users, children: [
          { id: "search", label: "Patient Search", icon: Search },
          { id: "register", label: "Register Patient", icon: UserPlus },
        ],
      },
      { id: "emergency", label: "Emergency Check-in", icon: Siren, badge: "3" },
      {
        id: "scheduling", label: "Scheduling", icon: CalendarDays, children: [
          { id: "appointment", label: "Appointments", icon: CalendarDays },
          { id: "queue", label: "Queue Management", icon: ClipboardList, badge: "7", tone: "warning" },
        ],
      },
      { id: "beds", label: "Bed Management", icon: BedDouble },
    ],
    navSecondary: [
      { id: "doctors", label: "Doctors", icon: Stethoscope },
      { id: "billing", label: "Billing", icon: Receipt },
      { id: "visitors", label: "Visitors", icon: Users },
      { id: "reports", label: "Reports", icon: BarChart3 },
      { id: "settings", label: "Settings", icon: Settings },
    ],
  },
  emergency: {
    sectionLabel: "Emergency",
    nav: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "triage", label: "Triage", icon: Siren, badge: "5", tone: "danger" },
      { id: "patients", label: "Patients", icon: Users },
      { id: "ambulance", label: "Ambulance", icon: Ambulance },
      { id: "reports", label: "Reports", icon: BarChart3 },
    ],
    navSecondary: [
      { id: "settings", label: "Settings", icon: Settings },
    ],
  },
  doctor: {
    sectionLabel: "Clinical",
    nav: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "patients", label: "My Patients", icon: Users },
      { id: "appointments", label: "Appointments", icon: CalendarDays },
      { id: "emr", label: "EMR", icon: FileText },
      { id: "orders", label: "Orders", icon: ClipboardList },
    ],
    navSecondary: [
      { id: "settings", label: "Settings", icon: Settings },
    ],
  },
  nurse: {
    sectionLabel: "Nursing",
    nav: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "patients", label: "Patients", icon: Users },
      { id: "medications", label: "Medications", icon: Pill },
      { id: "vitals", label: "Vitals", icon: Activity },
      { id: "tasks", label: "Tasks", icon: ClipboardList },
    ],
    navSecondary: [
      { id: "settings", label: "Settings", icon: Settings },
    ],
  },
  laboratory: {
    sectionLabel: "Laboratory",
    nav: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "orders", label: "Test Orders", icon: ClipboardList },
      { id: "results", label: "Results", icon: FlaskConical },
      { id: "samples", label: "Samples", icon: Microscope },
      { id: "equipment", label: "Equipment", icon: Monitor },
    ],
    navSecondary: [
      { id: "settings", label: "Settings", icon: Settings },
    ],
  },
  radiology: {
    sectionLabel: "Radiology",
    nav: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "orders", label: "Imaging Orders", icon: ClipboardList },
      { id: "studies", label: "Studies", icon: Monitor },
      { id: "reports", label: "Reports", icon: FileText },
    ],
    navSecondary: [
      { id: "settings", label: "Settings", icon: Settings },
    ],
  },
  pharmacy: {
    sectionLabel: "Pharmacy",
    nav: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "prescriptions", label: "Prescriptions", icon: Pill },
      { id: "inventory", label: "Inventory", icon: Package },
      { id: "dispensing", label: "Dispensing", icon: Receipt },
    ],
    navSecondary: [
      { id: "settings", label: "Settings", icon: Settings },
    ],
  },
  ipd: {
    sectionLabel: "Inpatient",
    nav: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "admissions", label: "Admissions", icon: BedDouble },
      { id: "patients", label: "Patients", icon: Users },
      { id: "discharges", label: "Discharges", icon: ClipboardList },
    ],
    navSecondary: [
      { id: "settings", label: "Settings", icon: Settings },
    ],
  },
  ot: {
    sectionLabel: "Operating Theater",
    nav: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "schedule", label: "Schedule", icon: CalendarDays },
      { id: "surgeries", label: "Surgeries", icon: Scissors },
      { id: "anaesthesia", label: "Anaesthesia", icon: Activity },
    ],
    navSecondary: [
      { id: "settings", label: "Settings", icon: Settings },
    ],
  },
  icu: {
    sectionLabel: "ICU",
    nav: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "patients", label: "Patients", icon: Users },
      { id: "ventilators", label: "Ventilators", icon: Activity },
      { id: "monitors", label: "Monitors", icon: Monitor },
    ],
    navSecondary: [
      { id: "settings", label: "Settings", icon: Settings },
    ],
  },
  billing: {
    sectionLabel: "Billing",
    nav: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "invoices", label: "Invoices", icon: Receipt },
      { id: "payments", label: "Payments", icon: Banknote },
      { id: "insurance", label: "Insurance", icon: Shield },
    ],
    navSecondary: [
      { id: "settings", label: "Settings", icon: Settings },
    ],
  },
  inventory: {
    sectionLabel: "Inventory",
    nav: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "stock", label: "Stock", icon: Package },
      { id: "procurement", label: "Procurement", icon: ClipboardList },
      { id: "suppliers", label: "Suppliers", icon: Users },
    ],
    navSecondary: [
      { id: "settings", label: "Settings", icon: Settings },
    ],
  },
  admin: {
    sectionLabel: "Administration",
    nav: [
      { id: "dashboard", label: "Command Center", icon: LayoutDashboard },
      { id: "departments", label: "Departments", icon: Globe },
      { id: "staff", label: "Staff", icon: Users },
      { id: "analytics", label: "Analytics", icon: BarChart3 },
    ],
    navSecondary: [
      { id: "settings", label: "Settings", icon: Settings },
    ],
  },
  "super-admin": {
    sectionLabel: "SaaS Admin",
    nav: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "tenants", label: "Tenants", icon: Globe },
      { id: "billing", label: "Billing", icon: Banknote },
      { id: "analytics", label: "Analytics", icon: BarChart3 },
    ],
    navSecondary: [
      { id: "settings", label: "Settings", icon: Settings },
    ],
  },
  hrms: {
    sectionLabel: "HRMS",
    nav: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "employees", label: "Employees", icon: Users },
      { id: "attendance", label: "Attendance", icon: Clock },
      { id: "payroll", label: "Payroll", icon: Banknote },
    ],
    navSecondary: [
      { id: "settings", label: "Settings", icon: Settings },
    ],
  },
  cssd: {
    sectionLabel: "CSSD",
    nav: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "instruments", label: "Instruments", icon: Scissors },
      { id: "sterilization", label: "Sterilization", icon: Activity },
      { id: "inventory", label: "Inventory", icon: Package },
    ],
    navSecondary: [
      { id: "settings", label: "Settings", icon: Settings },
    ],
  },
  "blood-bank": {
    sectionLabel: "Blood Bank",
    nav: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "inventory", label: "Inventory", icon: Package },
      { id: "requests", label: "Requests", icon: ClipboardList },
      { id: "donors", label: "Donors", icon: Users },
    ],
    navSecondary: [
      { id: "settings", label: "Settings", icon: Settings },
    ],
  },
  dialysis: {
    sectionLabel: "Dialysis",
    nav: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "patients", label: "Patients", icon: Users },
      { id: "sessions", label: "Sessions", icon: Activity },
      { id: "equipment", label: "Equipment", icon: Monitor },
    ],
    navSecondary: [
      { id: "settings", label: "Settings", icon: Settings },
    ],
  },
  maternity: {
    sectionLabel: "Maternity",
    nav: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "patients", label: "Patients", icon: Users },
      { id: "labour", label: "Labour Room", icon: Baby },
      { id: "newborn", label: "Newborn", icon: Baby },
    ],
    navSecondary: [
      { id: "settings", label: "Settings", icon: Settings },
    ],
  },
  pediatrics: {
    sectionLabel: "Pediatrics",
    nav: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "patients", label: "Patients", icon: Users },
      { id: "nicu", label: "NICU", icon: Baby },
      { id: "vaccinations", label: "Vaccinations", icon: Activity },
    ],
    navSecondary: [
      { id: "settings", label: "Settings", icon: Settings },
    ],
  },
  oncology: {
    sectionLabel: "Oncology",
    nav: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "patients", label: "Patients", icon: Users },
      { id: "protocols", label: "Protocols", icon: ClipboardList },
      { id: "chemotherapy", label: "Chemotherapy", icon: Activity },
    ],
    navSecondary: [
      { id: "settings", label: "Settings", icon: Settings },
    ],
  },
  telemedicine: {
    sectionLabel: "Telemedicine",
    nav: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "consultations", label: "Consultations", icon: Video },
      { id: "patients", label: "Patients", icon: Users },
      { id: "schedule", label: "Schedule", icon: CalendarDays },
    ],
    navSecondary: [
      { id: "settings", label: "Settings", icon: Settings },
    ],
  },
  cdss: {
    sectionLabel: "CDSS",
    nav: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "alerts", label: "Alerts", icon: Activity },
      { id: "protocols", label: "Protocols", icon: ClipboardList },
      { id: "analytics", label: "Analytics", icon: BarChart3 },
    ],
    navSecondary: [
      { id: "settings", label: "Settings", icon: Settings },
    ],
  },
  ai: {
    sectionLabel: "AI Analytics",
    nav: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "predictions", label: "Predictions", icon: Brain },
      { id: "models", label: "Models", icon: Sparkles },
      { id: "analytics", label: "Analytics", icon: BarChart3 },
    ],
    navSecondary: [
      { id: "settings", label: "Settings", icon: Settings },
    ],
  },
  research: {
    sectionLabel: "Research",
    nav: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "trials", label: "Clinical Trials", icon: FlaskConical },
      { id: "participants", label: "Participants", icon: Users },
      { id: "analytics", label: "Analytics", icon: BarChart3 },
    ],
    navSecondary: [
      { id: "settings", label: "Settings", icon: Settings },
    ],
  },
  interop: {
    sectionLabel: "Interoperability",
    nav: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "integrations", label: "Integrations", icon: Network },
      { id: "messages", label: "Messages", icon: FileText },
      { id: "analytics", label: "Analytics", icon: BarChart3 },
    ],
    navSecondary: [
      { id: "settings", label: "Settings", icon: Settings },
    ],
  },
  "patient-portal": {
    sectionLabel: "Patient Portal",
    nav: [
      { id: "dashboard", label: "Dashboard", icon: Smartphone },
      { id: "records", label: "My Records", icon: FileText },
      { id: "appointments", label: "Appointments", icon: CalendarDays },
      { id: "prescriptions", label: "Prescriptions", icon: Pill },
    ],
    navSecondary: [
      { id: "settings", label: "Settings", icon: Settings },
    ],
  },
  ambulance: {
    sectionLabel: "Ambulance",
    nav: [
      { id: "dashboard", label: "Dashboard", icon: Ambulance },
      { id: "fleet", label: "Fleet Status", icon: Activity },
      { id: "dispatch", label: "Dispatch", icon: Siren },
      { id: "calls", label: "Active Calls", icon: ClipboardList },
    ],
    navSecondary: [
      { id: "settings", label: "Settings", icon: Settings },
    ],
  },
};
