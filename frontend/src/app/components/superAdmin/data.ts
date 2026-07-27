/* ── Super Admin — Multi-Hospital SaaS Platform Data ───────────────────────── */

export type TenantStatus = "Active" | "Suspended" | "Trial" | "Expired";
export type PlanTier = "Starter" | "Professional" | "Enterprise" | "Custom";
export type OrgStatus = "Active" | "Inactive" | "Onboarding" | "Suspended";
export type HospitalType = "Multi-Speciality" | "Single-Speciality" | "Teaching" | "Corporate" | "Government";
export type OperationalStatus = "Operational" | "Partial" | "Down" | "Maintenance";
export type SecurityLevel = "Standard" | "Enhanced" | "Maximum";
export type IncidentSeverityLevel = "Critical" | "High" | "Medium" | "Low";
export type AuditAction = "Create" | "Read" | "Update" | "Delete" | "Login" | "Logout" | "Export" | "Configure";
export type FeatureStatus = "Enabled" | "Disabled" | "Beta" | "Deprecated";
export type TransferStatus = "Pending" | "Approved" | "In Transit" | "Completed" | "Rejected";
export type BackupStatus = "Healthy" | "Warning" | "Critical" | "Unknown";
export type IntegrationType = "FHIR" | "HL7" | "REST" | "Webhook" | "DICOM";
export type ApiKeyType = "Production" | "Sandbox" | "Internal";

/* ── Organizations ─────────────────────────────────────────────────────────── */
export interface Organization {
  id: string;
  name: string;
  shortName: string;
  status: OrgStatus;
  plan: PlanTier;
  hospitals: number;
  branches: number;
  activeUsers: number;
  patients: number;
  monthlyRevenue: number;
  storageUsed: number;
  storageTotal: number;
  apiCalls: number;
  apiLimit: number;
  createdAt: string;
  contactEmail: string;
  contactPhone: string;
  logo: string;
  primaryColor: string;
  domain: string;
  complianceScore: number;
  uptime: number;
}

export const ORGANIZATIONS: Organization[] = [
  { id: "ORG-001", name: "Sunrise Healthcare Group", shortName: "Sunrise", status: "Active", plan: "Enterprise", hospitals: 12, branches: 34, activeUsers: 2847, patients: 184320, monthlyRevenue: 8450000, storageUsed: 2400, storageTotal: 5000, apiCalls: 4820000, apiLimit: 10000000, createdAt: "2022-03-15", contactEmail: "admin@sunrisehealthcare.in", contactPhone: "+91-22-4567-8900", logo: "SR", primaryColor: "#0052CC", domain: "sunrise.healthcareplatform.in", complianceScore: 96, uptime: 99.98 },
  { id: "ORG-002", name: "MedCare Network", shortName: "MedCare", status: "Active", plan: "Enterprise", hospitals: 8, branches: 22, activeUsers: 1923, patients: 127650, monthlyRevenue: 5230000, storageUsed: 1800, storageTotal: 3000, apiCalls: 3150000, apiLimit: 8000000, createdAt: "2021-08-20", contactEmail: "ops@medcare.in", contactPhone: "+91-80-2345-6789", logo: "MC", primaryColor: "#00875A", domain: "medcare.healthcareplatform.in", complianceScore: 94, uptime: 99.95 },
  { id: "ORG-003", name: "CityCare Hospitals", shortName: "CityCare", status: "Active", plan: "Professional", hospitals: 5, branches: 14, activeUsers: 987, patients: 67430, monthlyRevenue: 2890000, storageUsed: 950, storageTotal: 2000, apiCalls: 1870000, apiLimit: 5000000, createdAt: "2023-01-10", contactEmail: "admin@citycare.in", contactPhone: "+91-44-3456-7890", logo: "CC", primaryColor: "#6554C0", domain: "citycare.healthcareplatform.in", complianceScore: 91, uptime: 99.92 },
  { id: "ORG-004", name: "Apex Multispeciality Hospitals", shortName: "Apex", status: "Active", plan: "Enterprise", hospitals: 15, branches: 42, activeUsers: 3420, patients: 245800, monthlyRevenue: 11200000, storageUsed: 3200, storageTotal: 8000, apiCalls: 6780000, apiLimit: 15000000, createdAt: "2020-11-05", contactEmail: "platform@apexhospitals.in", contactPhone: "+91-11-6789-0123", logo: "AX", primaryColor: "#FF5630", domain: "apex.healthcareplatform.in", complianceScore: 98, uptime: 99.99 },
  { id: "ORG-005", name: "GreenLife Medical Centre", shortName: "GreenLife", status: "Onboarding", plan: "Starter", hospitals: 2, branches: 5, activeUsers: 124, patients: 8900, monthlyRevenue: 340000, storageUsed: 120, storageTotal: 500, apiCalls: 230000, apiLimit: 1000000, createdAt: "2026-06-01", contactEmail: "setup@greenlife.in", contactPhone: "+91-79-4567-8901", logo: "GL", primaryColor: "#36B37E", domain: "greenlife.healthcareplatform.in", complianceScore: 78, uptime: 99.80 },
  { id: "ORG-006", name: "Prima Health Alliance", shortName: "Prima", status: "Trial", plan: "Professional", hospitals: 3, branches: 8, activeUsers: 256, patients: 18700, monthlyRevenue: 0, storageUsed: 340, storageTotal: 2000, apiCalls: 560000, apiLimit: 5000000, createdAt: "2026-07-01", contactEmail: "trial@primahealth.in", contactPhone: "+91-33-5678-9012", logo: "PA", primaryColor: "#FFAB00", domain: "prima.healthcareplatform.in", complianceScore: 82, uptime: 99.85 },
];

/* ── Hospitals ─────────────────────────────────────────────────────────────── */
export interface Hospital {
  id: string;
  orgId: string;
  name: string;
  type: HospitalType;
  status: OperationalStatus;
  beds: number;
  icuBeds: number;
  otCount: number;
  doctors: number;
  nurses: number;
  location: string;
  city: string;
  state: string;
  specialties: string[];
  accreditation: string;
  administrator: string;
  monthlyPatients: number;
  bedOccupancy: number;
  monthlyRevenue: number;
  uptime: number;
}

export const HOSPITALS: Hospital[] = [
  { id: "HOS-001", orgId: "ORG-001", name: "Sunrise General Hospital", type: "Multi-Speciality", status: "Operational", beds: 450, icuBeds: 60, otCount: 12, doctors: 180, nurses: 420, location: "Andheri West", city: "Mumbai", state: "Maharashtra", specialties: ["Cardiology", "Neurology", "Oncology", "Orthopedics", "Pediatrics"], accreditation: "NABH", administrator: "Dr. Rajesh Mehta", monthlyPatients: 14500, bedOccupancy: 82, monthlyRevenue: 2850000, uptime: 99.99 },
  { id: "HOS-002", orgId: "ORG-001", name: "Sunrise Cancer Institute", type: "Single-Speciality", status: "Operational", beds: 200, icuBeds: 30, otCount: 6, doctors: 85, nurses: 200, location: "Bandra East", city: "Mumbai", state: "Maharashtra", specialties: ["Oncology", "Radiation Therapy", "Surgical Oncology"], accreditation: "NABH", administrator: "Dr. Priya Sharma", monthlyPatients: 6800, bedOccupancy: 78, monthlyRevenue: 3200000, uptime: 99.97 },
  { id: "HOS-003", orgId: "ORG-001", name: "Sunrise Children's Hospital", type: "Single-Speciality", status: "Operational", beds: 150, icuBeds: 20, otCount: 4, doctors: 60, nurses: 150, location: "Powai", city: "Mumbai", state: "Maharashtra", specialties: ["Pediatrics", "Neonatology", "Pediatric Surgery"], accreditation: "NABH", administrator: "Dr. Ananya Desai", monthlyPatients: 5200, bedOccupancy: 71, monthlyRevenue: 1450000, uptime: 99.96 },
  { id: "HOS-004", orgId: "ORG-002", name: "MedCare Super Speciality", type: "Multi-Speciality", status: "Operational", beds: 380, icuBeds: 50, otCount: 10, doctors: 155, nurses: 380, location: "Whitefield", city: "Bangalore", state: "Karnataka", specialties: ["Cardiology", "Gastroenterology", "Nephrology", "Pulmonology"], accreditation: "NABH", administrator: "Dr. Suresh Kumar", monthlyPatients: 12300, bedOccupancy: 85, monthlyRevenue: 2650000, uptime: 99.95 },
  { id: "HOS-005", orgId: "ORG-002", name: "MedCare Heart Centre", type: "Single-Speciality", status: "Operational", beds: 120, icuBeds: 25, otCount: 5, doctors: 45, nurses: 120, location: "Koramangala", city: "Bangalore", state: "Karnataka", specialties: ["Cardiology", "Cardiac Surgery", "Interventional Cardiology"], accreditation: "NABH", administrator: "Dr. Vikram Reddy", monthlyPatients: 4100, bedOccupancy: 88, monthlyRevenue: 1890000, uptime: 99.98 },
  { id: "HOS-006", orgId: "ORG-003", name: "CityCare Central Hospital", type: "Multi-Speciality", status: "Operational", beds: 300, icuBeds: 40, otCount: 8, doctors: 120, nurses: 290, location: "T. Nagar", city: "Chennai", state: "Tamil Nadu", specialties: ["General Medicine", "Surgery", "Orthopedics", "ENT"], accreditation: "NABH", administrator: "Dr. Lakshmi Narayan", monthlyPatients: 9800, bedOccupancy: 79, monthlyRevenue: 2100000, uptime: 99.93 },
  { id: "HOS-007", orgId: "ORG-004", name: "Apex Institute of Medical Sciences", type: "Teaching", status: "Operational", beds: 800, icuBeds: 100, otCount: 20, doctors: 320, nurses: 750, location: "Saket", city: "New Delhi", state: "Delhi", specialties: ["All Specialties", "Research", "Medical Education"], accreditation: "NABH+JCI", administrator: "Dr. Arun Bhatia", monthlyPatients: 22000, bedOccupancy: 76, monthlyRevenue: 4500000, uptime: 99.99 },
  { id: "HOS-008", orgId: "ORG-004", name: "Apex Emergency & Trauma Centre", type: "Single-Speciality", status: "Operational", beds: 100, icuBeds: 20, otCount: 4, doctors: 40, nurses: 100, location: "Connaught Place", city: "New Delhi", state: "Delhi", specialties: ["Emergency Medicine", "Trauma Surgery", "Critical Care"], accreditation: "NABH", administrator: "Dr. Meera Joshi", monthlyPatients: 8500, bedOccupancy: 72, monthlyRevenue: 1650000, uptime: 99.97 },
  { id: "HOS-009", orgId: "ORG-004", name: "Apex Women & Child Hospital", type: "Single-Speciality", status: "Maintenance", beds: 200, icuBeds: 25, otCount: 6, doctors: 75, nurses: 180, location: "Lajpat Nagar", city: "New Delhi", state: "Delhi", specialties: ["Obstetrics", "Gynecology", "Pediatrics", "Neonatology"], accreditation: "NABH", administrator: "Dr. Kavita Singh", monthlyPatients: 6200, bedOccupancy: 0, monthlyRevenue: 0, uptime: 0 },
  { id: "HOS-010", orgId: "ORG-005", name: "GreenLife Medical Centre", type: "Multi-Speciality", status: "Partial", beds: 80, icuBeds: 10, otCount: 2, doctors: 25, nurses: 60, location: "Satellite Road", city: "Ahmedabad", state: "Gujarat", specialties: ["General Medicine", "General Surgery", "Pediatrics"], accreditation: "NABH Entry Level", administrator: "Dr. Hitesh Patel", monthlyPatients: 2800, bedOccupancy: 65, monthlyRevenue: 420000, uptime: 99.80 },
];

/* ── Branches ──────────────────────────────────────────────────────────────── */
export interface Branch {
  id: string;
  hospitalId: string;
  orgId: string;
  name: string;
  buildings: number;
  floors: number;
  departments: number;
  beds: number;
  status: OperationalStatus;
  city: string;
  address: string;
}

export const BRANCHES: Branch[] = [
  { id: "BR-001", hospitalId: "HOS-001", orgId: "ORG-001", name: "Main Campus", buildings: 3, floors: 12, departments: 24, beds: 450, status: "Operational", city: "Mumbai", address: "Sunrise Tower, Andheri West, Mumbai 400058" },
  { id: "BR-002", hospitalId: "HOS-001", orgId: "ORG-001", name: "Annex Building", buildings: 1, floors: 5, departments: 8, beds: 120, status: "Operational", city: "Mumbai", address: "Sunrise Annex, Link Road, Andheri West, Mumbai 400064" },
  { id: "BR-003", hospitalId: "HOS-004", orgId: "ORG-002", name: "Main Campus", buildings: 2, floors: 8, departments: 18, beds: 380, status: "Operational", city: "Bangalore", address: "MedCare Tower, Whitefield Main Road, Bangalore 560066" },
  { id: "BR-004", hospitalId: "HOS-007", orgId: "ORG-004", name: "Main Campus — Block A", buildings: 4, floors: 14, departments: 35, beds: 500, status: "Operational", city: "New Delhi", address: "Apex Complex, Saket, New Delhi 110017" },
  { id: "BR-005", hospitalId: "HOS-007", orgId: "ORG-004", name: "Research Wing — Block B", buildings: 2, floors: 6, departments: 12, beds: 300, status: "Operational", city: "New Delhi", address: "Apex Research Block, Saket, New Delhi 110017" },
  { id: "BR-006", hospitalId: "HOS-006", orgId: "ORG-003", name: "Main Hospital", buildings: 2, floors: 7, departments: 16, beds: 300, status: "Operational", city: "Chennai", address: "CityCare Main, Usman Road, T. Nagar, Chennai 600017" },
];

/* ── Users ─────────────────────────────────────────────────────────────────── */
export type UserRole = "Super Admin" | "Org Admin" | "Hospital Admin" | "Doctor" | "Nurse" | "Receptionist" | "Pharmacist" | "Lab Technician" | "Radiologist" | "Billing Staff" | "Inventory Manager" | "Support" | "Auditor";
export type UserStatus = "Active" | "Inactive" | "Locked" | "Pending";

export interface PlatformUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  orgId: string;
  hospitalId?: string;
  status: UserStatus;
  lastLogin: string;
  mfaEnabled: boolean;
  department: string;
  createdAt: string;
}

export const PLATFORM_USERS: PlatformUser[] = [
  { id: "USR-001", name: "Arvind Kapoor", email: "arvind.kapoor@platform.in", role: "Super Admin", orgId: "ORG-000", status: "Active", lastLogin: "2026-07-23T08:15:00", mfaEnabled: true, department: "Platform Operations", createdAt: "2020-01-15" },
  { id: "USR-002", name: "Neha Gupta", email: "neha.gupta@platform.in", role: "Super Admin", orgId: "ORG-000", status: "Active", lastLogin: "2026-07-23T07:45:00", mfaEnabled: true, department: "Security", createdAt: "2020-06-20" },
  { id: "USR-003", name: "Dr. Rajesh Mehta", email: "rajesh.mehta@sunrise.in", role: "Org Admin", orgId: "ORG-001", status: "Active", lastLogin: "2026-07-23T09:00:00", mfaEnabled: true, department: "Administration", createdAt: "2022-03-15" },
  { id: "USR-004", name: "Priya Nair", email: "priya.nair@sunrise.in", role: "Hospital Admin", orgId: "ORG-001", hospitalId: "HOS-001", status: "Active", lastLogin: "2026-07-23T08:30:00", mfaEnabled: true, department: "Administration", createdAt: "2022-05-10" },
  { id: "USR-005", name: "Dr. Suresh Kumar", email: "suresh.kumar@medcare.in", role: "Org Admin", orgId: "ORG-002", status: "Active", lastLogin: "2026-07-22T18:00:00", mfaEnabled: true, department: "Administration", createdAt: "2021-08-20" },
  { id: "USR-006", name: "Dr. Lakshmi Narayan", email: "lakshmi@citycare.in", role: "Org Admin", orgId: "ORG-003", status: "Active", lastLogin: "2026-07-23T07:00:00", mfaEnabled: false, department: "Administration", createdAt: "2023-01-10" },
  { id: "USR-007", name: "Dr. Arun Bhatia", email: "arun.bhatia@apex.in", role: "Org Admin", orgId: "ORG-004", status: "Active", lastLogin: "2026-07-23T06:30:00", mfaEnabled: true, department: "Administration", createdAt: "2020-11-05" },
  { id: "USR-008", name: "Kavita Singh", email: "kavita.singh@apex.in", role: "Hospital Admin", orgId: "ORG-004", hospitalId: "HOS-009", status: "Active", lastLogin: "2026-07-21T16:00:00", mfaEnabled: true, department: "Administration", createdAt: "2021-02-14" },
  { id: "USR-009", name: "Sanjay Verma", email: "sanjay.verma@platform.in", role: "Auditor", orgId: "ORG-000", status: "Active", lastLogin: "2026-07-23T09:15:00", mfaEnabled: true, department: "Compliance", createdAt: "2023-04-01" },
  { id: "USR-010", name: "Ravi Shankar", email: "ravi.shankar@platform.in", role: "Support", orgId: "ORG-000", status: "Active", lastLogin: "2026-07-23T08:00:00", mfaEnabled: true, department: "Support", createdAt: "2024-01-15" },
  { id: "USR-011", name: "Dr. Hitesh Patel", email: "hitesh@greenlife.in", role: "Org Admin", orgId: "ORG-005", status: "Active", lastLogin: "2026-07-22T10:00:00", mfaEnabled: false, department: "Administration", createdAt: "2026-06-01" },
  { id: "USR-012", name: "Amit Deshmukh", email: "amit.d@primahealth.in", role: "Org Admin", orgId: "ORG-006", status: "Pending", lastLogin: "Never", mfaEnabled: false, department: "Administration", createdAt: "2026-07-01" },
];

/* ── Roles & Permissions ───────────────────────────────────────────────────── */
export interface Permission {
  module: string;
  actions: string[];
}

export interface RoleDefinition {
  id: string;
  name: string;
  level: "Platform" | "Organization" | "Hospital";
  userCount: number;
  permissions: Permission[];
  isSystem: boolean;
}

export const ROLES: RoleDefinition[] = [
  { id: "ROLE-001", name: "Super Admin", level: "Platform", userCount: 2, permissions: [{ module: "All", actions: ["Create", "Read", "Update", "Delete", "Configure", "Export"] }], isSystem: true },
  { id: "ROLE-002", name: "Organization Admin", level: "Organization", userCount: 6, permissions: [{ module: "Organization", actions: ["Read", "Update", "Configure"] }, { module: "Hospital", actions: ["Create", "Read", "Update", "Delete"] }, { module: "User", actions: ["Create", "Read", "Update", "Delete"] }, { module: "Billing", actions: ["Read", "Export"] }, { module: "Analytics", actions: ["Read", "Export"] }], isSystem: true },
  { id: "ROLE-003", name: "Hospital Admin", level: "Hospital", userCount: 14, permissions: [{ module: "Hospital", actions: ["Read", "Update"] }, { module: "User", actions: ["Create", "Read", "Update"] }, { module: "Department", actions: ["Create", "Read", "Update", "Delete"] }, { module: "Inventory", actions: ["Read", "Update", "Configure"] }, { module: "Analytics", actions: ["Read"] }], isSystem: true },
  { id: "ROLE-004", name: "Security Admin", level: "Platform", userCount: 3, permissions: [{ module: "Security", actions: ["Read", "Update", "Configure"] }, { module: "Audit", actions: ["Read", "Export"] }, { module: "User", actions: ["Read"] }, { module: "SSO", actions: ["Read", "Update", "Configure"] }, { module: "MFA", actions: ["Read", "Update", "Configure"] }], isSystem: false },
  { id: "ROLE-005", name: "Compliance Officer", level: "Organization", userCount: 5, permissions: [{ module: "Audit", actions: ["Read", "Export"] }, { module: "Security", actions: ["Read"] }, { module: "Analytics", actions: ["Read", "Export"] }, { module: "Reports", actions: ["Create", "Read", "Export"] }], isSystem: false },
  { id: "ROLE-006", name: "Support Engineer", level: "Platform", userCount: 8, permissions: [{ module: "Ticket", actions: ["Create", "Read", "Update"] }, { module: "User", actions: ["Read"] }, { module: "Hospital", actions: ["Read"] }, { module: "Logs", actions: ["Read"] }], isSystem: false },
  { id: "ROLE-007", name: "Billing Admin", level: "Organization", userCount: 4, permissions: [{ module: "Subscription", actions: ["Read", "Update"] }, { module: "Billing", actions: ["Read", "Update", "Export"] }, { module: "Invoice", actions: ["Create", "Read", "Export"] }], isSystem: false },
  { id: "ROLE-008", name: "DevOps Engineer", level: "Platform", userCount: 6, permissions: [{ module: "Infrastructure", actions: ["Read", "Update", "Configure"] }, { module: "API", actions: ["Read", "Update", "Configure"] }, { module: "Monitoring", actions: ["Read", "Configure"] }, { module: "Backup", actions: ["Read", "Update"] }], isSystem: false },
];

/* ── Subscriptions ─────────────────────────────────────────────────────────── */
export type BillingCycle = "Monthly" | "Quarterly" | "Annual";

export interface Subscription {
  orgId: string;
  plan: PlanTier;
  billingCycle: BillingCycle;
  monthlyAmount: number;
  renewalDate: string;
  startDate: string;
  storageUsed: number;
  storageTotal: number;
  activeUsers: number;
  userLimit: number;
  apiCalls: number;
  apiLimit: number;
  licensedModules: string[];
  nextInvoiceDate: string;
  autoRenew: boolean;
  trialEnds?: string;
}

export const SUBSCRIPTIONS: Subscription[] = [
  { orgId: "ORG-001", plan: "Enterprise", billingCycle: "Annual", monthlyAmount: 850000, renewalDate: "2027-03-15", startDate: "2022-03-15", storageUsed: 2400, storageTotal: 5000, activeUsers: 2847, userLimit: 5000, apiCalls: 4820000, apiLimit: 10000000, licensedModules: ["EMR", "LIS", "RIS", "PMS", "IPD", "OT", "ICU", "Billing", "Inventory", "Analytics", "MPI", "API Gateway"], nextInvoiceDate: "2026-09-15", autoRenew: true },
  { orgId: "ORG-002", plan: "Enterprise", billingCycle: "Annual", monthlyAmount: 525000, renewalDate: "2027-08-20", startDate: "2021-08-20", storageUsed: 1800, storageTotal: 3000, activeUsers: 1923, userLimit: 3000, apiCalls: 3150000, apiLimit: 8000000, licensedModules: ["EMR", "LIS", "RIS", "PMS", "IPD", "OT", "ICU", "Billing", "Inventory", "Analytics", "MPI"], nextInvoiceDate: "2026-11-20", autoRenew: true },
  { orgId: "ORG-003", plan: "Professional", billingCycle: "Quarterly", monthlyAmount: 290000, renewalDate: "2026-10-10", startDate: "2023-01-10", storageUsed: 950, storageTotal: 2000, activeUsers: 987, userLimit: 1500, apiCalls: 1870000, apiLimit: 5000000, licensedModules: ["EMR", "LIS", "RIS", "PMS", "IPD", "Billing", "Inventory", "Analytics"], nextInvoiceDate: "2026-10-10", autoRenew: true },
  { orgId: "ORG-004", plan: "Enterprise", billingCycle: "Annual", monthlyAmount: 1120000, renewalDate: "2027-11-05", startDate: "2020-11-05", storageUsed: 3200, storageTotal: 8000, activeUsers: 3420, userLimit: 8000, apiCalls: 6780000, apiLimit: 15000000, licensedModules: ["EMR", "LIS", "RIS", "PMS", "IPD", "OT", "ICU", "Billing", "Inventory", "Analytics", "MPI", "API Gateway", "White Label", "Advanced Security"], nextInvoiceDate: "2027-01-05", autoRenew: true },
  { orgId: "ORG-005", plan: "Starter", billingCycle: "Monthly", monthlyAmount: 35000, renewalDate: "2026-08-01", startDate: "2026-06-01", storageUsed: 120, storageTotal: 500, activeUsers: 124, userLimit: 200, apiCalls: 230000, apiLimit: 1000000, licensedModules: ["EMR", "LIS", "Billing"], nextInvoiceDate: "2026-08-01", autoRenew: true },
  { orgId: "ORG-006", plan: "Professional", billingCycle: "Monthly", monthlyAmount: 0, renewalDate: "2026-08-01", startDate: "2026-07-01", storageUsed: 340, storageTotal: 2000, activeUsers: 256, userLimit: 1500, apiCalls: 560000, apiLimit: 5000000, licensedModules: ["EMR", "LIS", "RIS", "PMS", "IPD", "Billing", "Inventory"], nextInvoiceDate: "2026-08-01", autoRenew: false, trialEnds: "2026-07-31" },
];

/* ── Features ──────────────────────────────────────────────────────────────── */
export interface Feature {
  id: string;
  name: string;
  description: string;
  category: string;
  status: FeatureStatus;
  enabledByDefault: boolean;
  hospitalCount: number;
  beta: boolean;
  aiPowered: boolean;
}

export const FEATURES: Feature[] = [
  { id: "FEA-001", name: "EMR Core", description: "Electronic Medical Records with clinical documentation", category: "Clinical", status: "Enabled", enabledByDefault: true, hospitalCount: 45, beta: false, aiPowered: false },
  { id: "FEA-002", name: "LIS Module", description: "Laboratory Information System with sample tracking", category: "Clinical", status: "Enabled", enabledByDefault: true, hospitalCount: 42, beta: false, aiPowered: false },
  { id: "FEA-003", name: "RIS/PACS", description: "Radiology Information System with DICOM viewer", category: "Clinical", status: "Enabled", enabledByDefault: true, hospitalCount: 38, beta: false, aiPowered: false },
  { id: "FEA-004", name: "Pharmacy PMS", description: "Pharmacy management with inventory and dispensing", category: "Clinical", status: "Enabled", enabledByDefault: true, hospitalCount: 45, beta: false, aiPowered: false },
  { id: "FEA-005", name: "AI Diagnostics", description: "AI-powered diagnostic assistance for radiology and pathology", category: "AI", status: "Beta", enabledByDefault: false, hospitalCount: 8, beta: true, aiPowered: true },
  { id: "FEA-006", name: "Predictive Analytics", description: "ML-based patient deterioration and readmission prediction", category: "AI", status: "Beta", enabledByDefault: false, hospitalCount: 12, beta: true, aiPowered: true },
  { id: "FEA-007", name: "Teleconsultation", description: "Video consultation with integrated EMR access", category: "Patient", status: "Enabled", enabledByDefault: true, hospitalCount: 35, beta: false, aiPowered: false },
  { id: "FEA-008", name: "Patient Portal", description: "Patient-facing mobile app and web portal", category: "Patient", status: "Enabled", enabledByDefault: true, hospitalCount: 40, beta: false, aiPowered: false },
  { id: "FEA-009", name: "Master Patient Index", description: "Cross-hospital patient identity matching and deduplication", category: "Platform", status: "Enabled", enabledByDefault: true, hospitalCount: 45, beta: false, aiPowered: true },
  { id: "FEA-010", name: "FHIR R4 APIs", description: "HL7 FHIR R4 compliant interoperability APIs", category: "Integration", status: "Enabled", enabledByDefault: true, hospitalCount: 30, beta: false, aiPowered: false },
  { id: "FEA-011", name: "Voice Documentation", description: "AI-powered clinical voice-to-text documentation", category: "AI", status: "Beta", enabledByDefault: false, hospitalCount: 5, beta: true, aiPowered: true },
  { id: "FEA-012", name: "Supply Chain AI", description: "AI-driven inventory optimization and demand forecasting", category: "AI", status: "Beta", enabledByDefault: false, hospitalCount: 10, beta: true, aiPowered: true },
  { id: "FEA-013", name: "Multi-Hospital Transfer", description: "Cross-hospital patient transfer with clinical summary", category: "Platform", status: "Enabled", enabledByDefault: true, hospitalCount: 25, beta: false, aiPowered: false },
  { id: "FEA-014", name: "White Label Branding", description: "Custom branding, logos, colors, and domain per organization", category: "Platform", status: "Enabled", enabledByDefault: false, hospitalCount: 4, beta: false, aiPowered: false },
  { id: "FEA-015", name: "Advanced Security Suite", description: "SSO, MFA, threat detection, and compliance monitoring", category: "Security", status: "Enabled", enabledByDefault: true, hospitalCount: 45, beta: false, aiPowered: false },
];

/* ── MPI (Master Patient Index) ────────────────────────────────────────────── */
export interface MPIPatient {
  id: string;
  uhid: string;
  name: string;
  dob: string;
  gender: "Male" | "Female" | "Other";
  phone: string;
  email: string;
  aadhaar: string;
  hospitals: string[];
  orgIds: string[];
  totalVisits: number;
  lastVisit: string;
  duplicates: number;
  confidenceScore: number;
  status: "Matched" | "Potential Duplicate" | "Unmerged" | "Resolved";
}

export const MPI_PATIENTS: MPIPatient[] = [
  { id: "MPI-001", uhid: "UH-2024-0001", name: "Rajesh Kumar Patel", dob: "1985-04-12", gender: "Male", phone: "+91-98765-43210", email: "rajesh.patel@gmail.com", aadhaar: "XXXX-XXXX-4521", hospitals: ["HOS-001", "HOS-004"], orgIds: ["ORG-001", "ORG-002"], totalVisits: 18, lastVisit: "2026-07-20", duplicates: 2, confidenceScore: 96, status: "Matched" },
  { id: "MPI-002", uhid: "UH-2024-0045", name: "Sunita Devi Sharma", dob: "1978-09-23", gender: "Female", phone: "+91-87654-32109", email: "sunita.sharma@yahoo.com", aadhaar: "XXXX-XXXX-7823", hospitals: ["HOS-007"], orgIds: ["ORG-004"], totalVisits: 24, lastVisit: "2026-07-22", duplicates: 0, confidenceScore: 99, status: "Matched" },
  { id: "MPI-003", uhid: "UH-2025-0102", name: "Mohammed Ali Khan", dob: "1992-01-05", gender: "Male", phone: "+91-76543-21098", email: "mohammed.ali@outlook.com", aadhaar: "XXXX-XXXX-9105", hospitals: ["HOS-004", "HOS-006"], orgIds: ["ORG-002", "ORG-003"], totalVisits: 8, lastVisit: "2026-07-15", duplicates: 1, confidenceScore: 88, status: "Potential Duplicate" },
  { id: "MPI-004", uhid: "UH-2023-0078", name: "Priya Venkatesh", dob: "1988-06-17", gender: "Female", phone: "+91-65432-10987", email: "priya.v@gmail.com", aadhaar: "XXXX-XXXX-3417", hospitals: ["HOS-001", "HOS-002", "HOS-007"], orgIds: ["ORG-001", "ORG-004"], totalVisits: 31, lastVisit: "2026-07-23", duplicates: 3, confidenceScore: 92, status: "Potential Duplicate" },
  { id: "MPI-005", uhid: "UH-2026-0201", name: "Arun Prasad Reddy", dob: "1995-11-28", gender: "Male", phone: "+91-54321-09876", email: "arun.reddy@gmail.com", aadhaar: "XXXX-XXXX-6228", hospitals: ["HOS-005"], orgIds: ["ORG-002"], totalVisits: 5, lastVisit: "2026-07-10", duplicates: 0, confidenceScore: 99, status: "Matched" },
  { id: "MPI-006", uhid: "UH-2024-0312", name: "Kavitha Ramanathan", dob: "1982-03-09", gender: "Female", phone: "+91-43210-98765", email: "kavitha.r@hotmail.com", aadhaar: "XXXX-XXXX-1509", hospitals: ["HOS-006", "HOS-001"], orgIds: ["ORG-003", "ORG-001"], totalVisits: 14, lastVisit: "2026-07-18", duplicates: 1, confidenceScore: 85, status: "Unmerged" },
];

/* ── Cross-Hospital Transfers ──────────────────────────────────────────────── */
export interface TransferRequest {
  id: string;
  patientName: string;
  uhid: string;
  fromHospital: string;
  toHospital: string;
  fromOrg: string;
  toOrg: string;
  reason: string;
  status: TransferStatus;
  requestDate: string;
  approvedBy?: string;
  transportType: "Ambulance" | "Air" | "Ground";
  clinicalSummary: string;
  bedRequired: string;
  urgency: "Emergency" | "Urgent" | "Routine";
}

export const TRANSFERS: TransferRequest[] = [
  { id: "TRF-001", patientName: "Rajesh Kumar Patel", uhid: "UH-2024-0001", fromHospital: "Sunrise General Hospital", toHospital: "MedCare Super Speciality", fromOrg: "ORG-001", toOrg: "ORG-002", reason: "Specialized cardiac intervention required", status: "Completed", requestDate: "2026-07-20T10:00:00", approvedBy: "Dr. Suresh Kumar", transportType: "Ambulance", clinicalSummary: "Acute MI, requires PCI. Local cath lab unavailable.", bedRequired: "ICU Bed", urgency: "Emergency" },
  { id: "TRF-002", patientName: "Priya Venkatesh", uhid: "UH-2023-0078", fromHospital: "Sunrise General Hospital", toHospital: "Apex Institute of Medical Sciences", fromOrg: "ORG-001", toOrg: "ORG-004", reason: "Complex neurosurgery consultation", status: "Approved", requestDate: "2026-07-22T14:30:00", approvedBy: "Dr. Rajesh Mehta", transportType: "Ground", clinicalSummary: "Intracranial mass lesion, requires neurosurgical evaluation.", bedRequired: "General Ward", urgency: "Urgent" },
  { id: "TRF-003", patientName: "Mohammed Ali Khan", uhid: "UH-2025-0102", fromHospital: "MedCare Super Speciality", toHospital: "CityCare Central Hospital", fromOrg: "ORG-002", toOrg: "ORG-003", reason: "Patient preference — closer to family", status: "Pending", requestDate: "2026-07-23T08:00:00", transportType: "Ground", clinicalSummary: "Stable post-op, conservative management. Transfer for convenience.", bedRequired: "General Ward", urgency: "Routine" },
  { id: "TRF-004", patientName: "Lakshmi Iyer", uhid: "UH-2024-0445", fromHospital: "Apex Emergency & Trauma Centre", toHospital: "Sunrise Cancer Institute", fromOrg: "ORG-004", toOrg: "ORG-001", reason: "Oncology follow-up at treating center", status: "In Transit", requestDate: "2026-07-23T06:00:00", approvedBy: "Dr. Meera Joshi", transportType: "Ambulance", clinicalSummary: "Post-chemotherapy, stable. Transferring back to primary oncology center.", bedRequired: "Oncology Ward", urgency: "Routine" },
];

/* ── Global Inventory ──────────────────────────────────────────────────────── */
export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  orgId: string;
  orgName: string;
  hospitalId: string;
  hospitalName: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  unitCost: number;
  lastRestocked: string;
  status: "OK" | "Low" | "Critical" | "Overstocked";
  sharedWarehouse: boolean;
}

export const GLOBAL_INVENTORY: InventoryItem[] = [
  { id: "INV-001", name: "Paracetamol 500mg", category: "Pharmaceuticals", orgId: "ORG-001", orgName: "Sunrise Healthcare Group", hospitalId: "HOS-001", hospitalName: "Sunrise General Hospital", currentStock: 45000, minStock: 10000, maxStock: 80000, unit: "Tablets", unitCost: 2.5, lastRestocked: "2026-07-20", status: "OK", sharedWarehouse: false },
  { id: "INV-002", name: "Normal Saline 1L", category: "Infusion", orgId: "ORG-001", orgName: "Sunrise Healthcare Group", hospitalId: "HOS-001", hospitalName: "Sunrise General Hospital", currentStock: 800, minStock: 500, maxStock: 3000, unit: "Bottles", unitCost: 35, lastRestocked: "2026-07-18", status: "Low", sharedWarehouse: true },
  { id: "INV-003", name: "Surgical Gloves (M)", category: "Consumables", orgId: "ORG-004", orgName: "Apex Multispeciality Hospitals", hospitalId: "HOS-007", hospitalName: "Apex Institute of Medical Sciences", currentStock: 125000, minStock: 50000, maxStock: 200000, unit: "Pairs", unitCost: 8, lastRestocked: "2026-07-22", status: "OK", sharedWarehouse: false },
  { id: "INV-004", name: "PPE Kit (Level 3)", category: "Safety", orgId: "ORG-004", orgName: "Apex Multispeciality Hospitals", hospitalId: "HOS-008", hospitalName: "Apex Emergency & Trauma Centre", currentStock: 120, minStock: 200, maxStock: 1000, unit: "Kits", unitCost: 180, lastRestocked: "2026-07-15", status: "Critical", sharedWarehouse: true },
  { id: "INV-005", name: "Insulin Glargine", category: "Pharmaceuticals", orgId: "ORG-002", orgName: "MedCare Network", hospitalId: "HOS-004", hospitalName: "MedCare Super Speciality", currentStock: 2400, minStock: 500, maxStock: 5000, unit: "Vials", unitCost: 450, lastRestocked: "2026-07-21", status: "OK", sharedWarehouse: false },
  { id: "INV-006", name: "Disposable Syringes 5ml", category: "Consumables", orgId: "ORG-003", orgName: "CityCare Hospitals", hospitalId: "HOS-006", hospitalName: "CityCare Central Hospital", currentStock: 28000, minStock: 15000, maxStock: 50000, unit: "Pieces", unitCost: 3, lastRestocked: "2026-07-19", status: "OK", sharedWarehouse: false },
  { id: "INV-007", name: "Oxygen Cylinder (B-Type)", category: "Medical Gas", orgId: "ORG-001", orgName: "Sunrise Healthcare Group", hospitalId: "HOS-003", hospitalName: "Sunrise Children's Hospital", currentStock: 35, minStock: 40, maxStock: 100, unit: "Cylinders", unitCost: 2800, lastRestocked: "2026-07-17", status: "Low", sharedWarehouse: true },
  { id: "INV-008", name: "IV Cannula 22G", category: "Consumables", orgId: "ORG-004", orgName: "Apex Multispeciality Hospitals", hospitalId: "HOS-009", hospitalName: "Apex Women & Child Hospital", currentStock: 0, minStock: 5000, maxStock: 20000, unit: "Pieces", unitCost: 12, lastRestocked: "2026-07-10", status: "Critical", sharedWarehouse: false },
];

/* ── Audit Logs ────────────────────────────────────────────────────────────── */
export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: AuditAction;
  resource: string;
  resourceId: string;
  orgId: string;
  hospitalId?: string;
  ipAddress: string;
  userAgent: string;
  details: string;
  severity: "Info" | "Warning" | "Critical";
}

export const AUDIT_LOGS: AuditLog[] = [
  { id: "AUD-001", timestamp: "2026-07-23T09:15:23", userId: "USR-001", userName: "Arvind Kapoor", action: "Configure", resource: "Platform Settings", resourceId: "SET-001", orgId: "ORG-000", ipAddress: "10.0.1.100", userAgent: "Chrome/125.0 Windows", details: "Updated global security policy — session timeout changed to 30 minutes", severity: "Info" },
  { id: "AUD-002", timestamp: "2026-07-23T09:10:05", userId: "USR-002", userName: "Neha Gupta", action: "Update", resource: "User Account", resourceId: "USR-008", orgId: "ORG-004", hospitalId: "HOS-009", ipAddress: "10.0.1.101", userAgent: "Chrome/125.0 Windows", details: "Reset password for Kavitha Singh — account was locked after 5 failed attempts", severity: "Warning" },
  { id: "AUD-003", timestamp: "2026-07-23T08:45:12", userId: "USR-003", userName: "Dr. Rajesh Mehta", action: "Create", resource: "Hospital", resourceId: "HOS-NEW", orgId: "ORG-001", ipAddress: "172.16.0.50", userAgent: "Chrome/125.0 macOS", details: "Initiated onboarding for new hospital — Sunrise Rural Health Centre, Thane", severity: "Info" },
  { id: "AUD-004", timestamp: "2026-07-23T08:30:00", userId: "USR-007", userName: "Dr. Arun Bhatia", action: "Update", resource: "Subscription", resourceId: "SUB-ORG-004", orgId: "ORG-004", ipAddress: "192.168.1.25", userAgent: "Firefox/128.0 Windows", details: "Upgraded API limit from 15M to 20M calls/month for Apex Multispeciality Hospitals", severity: "Info" },
  { id: "AUD-005", timestamp: "2026-07-23T07:55:44", userId: "USR-009", userName: "Sanjay Verma", action: "Read", resource: "Audit Logs", resourceId: "AUD-BULK", orgId: "ORG-000", ipAddress: "10.0.1.105", userAgent: "Chrome/125.0 Windows", details: "Exported audit logs for Q2 2026 compliance review — 12,450 records", severity: "Info" },
  { id: "AUD-006", timestamp: "2026-07-23T07:30:18", userId: "SYSTEM", userName: "Platform Monitor", action: "Create", resource: "Security Alert", resourceId: "SEC-ALERT-042", orgId: "ORG-002", ipAddress: "N/A", userAgent: "System", details: "Unusual login pattern detected — 3 failed MFA attempts from IP 203.0.113.45 for MedCare Network", severity: "Critical" },
  { id: "AUD-007", timestamp: "2026-07-23T07:15:00", userId: "USR-005", userName: "Dr. Suresh Kumar", action: "Update", resource: "Feature Flag", resourceId: "FEA-005", orgId: "ORG-002", ipAddress: "10.0.2.50", userAgent: "Chrome/125.0 Android", details: "Enabled AI Diagnostics beta for MedCare Super Speciality Hospital", severity: "Info" },
  { id: "AUD-008", timestamp: "2026-07-23T06:45:30", userId: "USR-010", userName: "Ravi Shankar", action: "Create", resource: "Support Ticket", resourceId: "TKT-2847", orgId: "ORG-005", ipAddress: "10.0.1.110", userAgent: "Chrome/125.0 Windows", details: "Opened ticket — GreenLife Medical Centre reporting slow LIS response times", severity: "Info" },
  { id: "AUD-009", timestamp: "2026-07-22T22:00:00", userId: "SYSTEM", userName: "Backup Service", action: "Create", resource: "Backup", resourceId: "BKP-DLY-20260722", orgId: "ORG-000", ipAddress: "N/A", userAgent: "System", details: "Daily full backup completed — 4.2 TB across 6 organizations. All backups verified.", severity: "Info" },
  { id: "AUD-010", timestamp: "2026-07-22T18:30:00", userId: "USR-006", userName: "Dr. Lakshmi Narayan", action: "Delete", resource: "User Account", resourceId: "USR-DEL-089", orgId: "ORG-003", hospitalId: "HOS-006", ipAddress: "10.0.3.50", userAgent: "Safari/17.5 macOS", details: "Deactivated user account — former contractor access revoked per policy", severity: "Warning" },
];

/* ── API & Integrations ────────────────────────────────────────────────────── */
export interface ApiKey {
  id: string;
  name: string;
  type: ApiKeyType;
  orgId: string;
  hospitalId?: string;
  key: string;
  createdAt: string;
  lastUsed: string;
  requestsToday: number;
  rateLimit: number;
  status: "Active" | "Revoked" | "Expired";
  permissions: string[];
}

export interface Integration {
  id: string;
  name: string;
  type: IntegrationType;
  orgId: string;
  hospitalId?: string;
  status: "Connected" | "Disconnected" | "Error" | "Pending";
  lastSync: string;
  messagesProcessed: number;
  errorRate: number;
  endpoint: string;
}

export const API_KEYS: ApiKey[] = [
  { id: "KEY-001", name: "Sunrise Production API", type: "Production", orgId: "ORG-001", key: "sk_live_SR••••••••••••4521", createdAt: "2022-04-01", lastUsed: "2026-07-23T09:00:00", requestsToday: 142000, rateLimit: 500, status: "Active", permissions: ["patient:read", "patient:write", "lab:read", "billing:read"] },
  { id: "KEY-002", name: "MedCare FHIR Endpoint", type: "Production", orgId: "ORG-002", key: "fhir_MC••••••••••••7823", createdAt: "2021-09-15", lastUsed: "2026-07-23T08:45:00", requestsToday: 89000, rateLimit: 300, status: "Active", permissions: ["fhir:read", "fhir:write", "patient:read"] },
  { id: "KEY-003", name: "Apex Sandbox", type: "Sandbox", orgId: "ORG-004", key: "sb_AX••••••••••••1509", createdAt: "2024-06-01", lastUsed: "2026-07-22T16:00:00", requestsToday: 3400, rateLimit: 100, status: "Active", permissions: ["patient:read", "lab:read"] },
  { id: "KEY-004", name: "CityCare Integration", type: "Production", orgId: "ORG-003", key: "sk_live_CC••••••••••••6228", createdAt: "2023-02-10", lastUsed: "2026-07-23T07:30:00", requestsToday: 52000, rateLimit: 200, status: "Active", permissions: ["patient:read", "patient:write", "billing:read", "billing:write"] },
  { id: "KEY-005", name: "Legacy Integration Key", type: "Internal", orgId: "ORG-001", key: "int_SR••••••••••••9105", createdAt: "2022-06-15", lastUsed: "2025-12-01", requestsToday: 0, rateLimit: 50, status: "Expired", permissions: ["patient:read"] },
];

export const INTEGRATIONS: Integration[] = [
  { id: "INT-001", name: "ABDM Health ID Bridge", type: "FHIR", orgId: "ORG-001", hospitalId: "HOS-001", status: "Connected", lastSync: "2026-07-23T09:05:00", messagesProcessed: 2450000, errorRate: 0.02, endpoint: "https://abdm.gov.in/fhir/v4" },
  { id: "INT-002", name: "NHIF Claims Gateway", type: "HL7", orgId: "ORG-002", status: "Connected", lastSync: "2026-07-23T08:00:00", messagesProcessed: 1870000, errorRate: 0.15, endpoint: "https://nhif.gov.in/hl7/v2" },
  { id: "INT-003", name: "Insurance Verification API", type: "REST", orgId: "ORG-004", status: "Connected", lastSync: "2026-07-23T08:30:00", messagesProcessed: 890000, errorRate: 0.08, endpoint: "https://api.insurancverify.in/v2" },
  { id: "INT-004", name: "Pharma Supplier Portal", type: "Webhook", orgId: "ORG-001", status: "Error", lastSync: "2026-07-22T23:00:00", messagesProcessed: 340000, errorRate: 4.2, endpoint: "https://webhooks.pharmasupply.in/events" },
  { id: "INT-005", name: "PACS DICOM Router", type: "DICOM", orgId: "ORG-003", hospitalId: "HOS-006", status: "Connected", lastSync: "2026-07-23T07:45:00", messagesProcessed: 567000, errorRate: 0.01, endpoint: "dicom://pacs.citycare.in:11112" },
  { id: "INT-006", name: "COVID Surveillance API", type: "REST", orgId: "ORG-000", status: "Disconnected", lastSync: "2026-03-01T00:00:00", messagesProcessed: 12300000, errorRate: 0, endpoint: "https://covid19.gov.in/api/v3" },
];

/* ── Security ──────────────────────────────────────────────────────────────── */
export interface SecurityEvent {
  id: string;
  timestamp: string;
  type: string;
  severity: IncidentSeverityLevel;
  description: string;
  orgId: string;
  hospitalId?: string;
  sourceIp: string;
  userId?: string;
  status: "Open" | "Investigating" | "Mitigated" | "Resolved";
}

export const SECURITY_EVENTS: SecurityEvent[] = [
  { id: "SEC-001", timestamp: "2026-07-23T07:55:44", type: "Brute Force", severity: "High", description: "Multiple failed login attempts (5x) from IP 203.0.113.45 targeting MedCare Network admin accounts", orgId: "ORG-002", sourceIp: "203.0.113.45", userId: "USR-005", status: "Investigating" },
  { id: "SEC-002", timestamp: "2026-07-23T06:30:00", type: "Unusual Access", severity: "Medium", description: "Admin user accessed 47 patient records in 10 minutes —超出 normal usage pattern", orgId: "ORG-001", hospitalId: "HOS-001", sourceIp: "172.16.0.50", userId: "USR-004", status: "Open" },
  { id: "SEC-003", timestamp: "2026-07-22T22:15:00", type: "Data Export", severity: "Low", description: "Bulk patient data export (2,450 records) by Compliance Officer for quarterly audit", orgId: "ORG-000", sourceIp: "10.0.1.105", userId: "USR-009", status: "Resolved" },
  { id: "SEC-004", timestamp: "2026-07-22T14:00:00", type: "API Abuse", severity: "High", description: "API rate limit exceeded — 12,000 requests/minute from CityCare Integration key", orgId: "ORG-003", sourceIp: "10.0.3.50", status: "Mitigated" },
  { id: "SEC-005", timestamp: "2026-07-21T09:00:00", type: "Policy Violation", severity: "Medium", description: "MFA not enabled for 3 Organization Admin accounts — compliance policy violation", orgId: "ORG-000", status: "Open" },
  { id: "SEC-006", timestamp: "2026-07-20T16:00:00", type: "Certificate Expiry", severity: "Critical", description: "SSL certificate for apex.healthcareplatform.in expires in 7 days — auto-renewal failed", orgId: "ORG-004", sourceIp: "N/A", status: "Open" },
];

/* ── Disaster Recovery ─────────────────────────────────────────────────────── */
export interface BackupRecord {
  id: string;
  type: "Full" | "Incremental" | "Differential";
  orgId: string;
  timestamp: string;
  size: number;
  status: BackupStatus;
  location: string;
  retentionDays: number;
  lastTested: string;
}

export interface SystemHealth {
  service: string;
  status: OperationalStatus;
  uptime30d: number;
  latency: number;
  instances: number;
  region: string;
}

export const BACKUPS: BackupRecord[] = [
  { id: "BKP-001", type: "Full", orgId: "ORG-001", timestamp: "2026-07-23T02:00:00", size: 850, status: "Healthy", location: "ap-south-1", retentionDays: 90, lastTested: "2026-07-20" },
  { id: "BKP-002", type: "Incremental", orgId: "ORG-001", timestamp: "2026-07-23T08:00:00", size: 45, status: "Healthy", location: "ap-south-1", retentionDays: 30, lastTested: "2026-07-23" },
  { id: "BKP-003", type: "Full", orgId: "ORG-002", timestamp: "2026-07-23T03:00:00", size: 620, status: "Healthy", location: "ap-south-1", retentionDays: 90, lastTested: "2026-07-19" },
  { id: "BKP-004", type: "Full", orgId: "ORG-004", timestamp: "2026-07-23T01:30:00", size: 1200, status: "Warning", location: "ap-south-1", retentionDays: 120, lastTested: "2026-07-15" },
  { id: "BKP-005", type: "Incremental", orgId: "ORG-004", timestamp: "2026-07-23T07:00:00", size: 78, status: "Healthy", location: "ap-south-1", retentionDays: 30, lastTested: "2026-07-23" },
  { id: "BKP-006", type: "Full", orgId: "ORG-003", timestamp: "2026-07-23T04:00:00", size: 380, status: "Healthy", location: "ap-south-1", retentionDays: 60, lastTested: "2026-07-21" },
];

export const SYSTEM_HEALTH: SystemHealth[] = [
  { service: "API Gateway", status: "Operational", uptime30d: 99.99, latency: 23, instances: 4, region: "ap-south-1" },
  { service: "Database Cluster", status: "Operational", uptime30d: 99.98, latency: 8, instances: 3, region: "ap-south-1" },
  { service: "Auth Service", status: "Operational", uptime30d: 99.99, latency: 15, instances: 3, region: "ap-south-1" },
  { service: "File Storage", status: "Operational", uptime30d: 99.97, latency: 45, instances: 2, region: "ap-south-1" },
  { service: "FHIR Server", status: "Operational", uptime30d: 99.95, latency: 32, instances: 2, region: "ap-south-1" },
  { service: "HL7 Engine", status: "Partial", uptime30d: 99.80, latency: 67, instances: 2, region: "ap-south-1" },
  { service: "Analytics Pipeline", status: "Operational", uptime30d: 99.92, latency: 120, instances: 2, region: "ap-south-1" },
  { service: "Notification Service", status: "Operational", uptime30d: 99.96, latency: 18, instances: 3, region: "ap-south-1" },
  { service: "CDN Edge", status: "Operational", uptime30d: 100.00, latency: 5, instances: 12, region: "Global" },
  { service: "Backup Service", status: "Operational", uptime30d: 99.99, latency: 200, instances: 2, region: "ap-south-1" },
];

/* ── Platform KPIs ─────────────────────────────────────────────────────────── */
export const PLATFORM_KPI = {
  totalOrgs: 6,
  totalHospitals: 45,
  totalBranches: 125,
  totalActiveUsers: 9557,
  todayPatients: 8420,
  monthlyRevenue: 28110000,
  monthlyRevenueGrowth: 12.4,
  platformUptime: 99.97,
  totalApiCalls: 17410000,
  storageUsed: 8810,
  storageTotal: 20500,
  openIncidents: 3,
  criticalAlerts: 1,
  securityScore: 94,
  complianceScore: 93,
  aiModelsActive: 4,
  aiAccuracy: 94.2,
};

/* ── Helpers ───────────────────────────────────────────────────────────────── */
export function orgStatusTone(s: OrgStatus): "success" | "warning" | "danger" | "info" {
  switch (s) { case "Active": return "success"; case "Onboarding": return "info"; case "Suspended": return "danger"; default: return "warning"; }
}
export function tenantStatusTone(s: TenantStatus): "success" | "warning" | "danger" | "info" {
  switch (s) { case "Active": return "success"; case "Trial": return "info"; case "Suspended": return "danger"; default: return "warning"; }
}
export function operationalStatusTone(s: OperationalStatus): "success" | "warning" | "danger" | "info" {
  switch (s) { case "Operational": return "success"; case "Partial": return "warning"; case "Down": case "Maintenance": return "danger"; default: return "info"; }
}
export function transferStatusTone(s: TransferStatus): "success" | "warning" | "danger" | "info" {
  switch (s) { case "Completed": return "success"; case "In Transit": return "info"; case "Approved": return "warning"; case "Rejected": return "danger"; default: return "warning"; }
}
export function backupStatusTone(s: BackupStatus): "success" | "warning" | "danger" | "info" {
  switch (s) { case "Healthy": return "success"; case "Warning": return "warning"; case "Critical": return "danger"; default: return "info"; }
}
export function securitySeverityTone(s: IncidentSeverityLevel): "success" | "warning" | "danger" | "info" {
  switch (s) { case "Critical": return "danger"; case "High": return "danger"; case "Medium": return "warning"; default: return "info"; }
}
export function inventoryStatusTone(s: string): "success" | "warning" | "danger" | "info" {
  switch (s) { case "OK": return "success"; case "Low": return "warning"; case "Critical": return "danger"; default: return "info"; }
}
export function featureStatusTone(s: FeatureStatus): "success" | "warning" | "danger" | "info" {
  switch (s) { case "Enabled": return "success"; case "Beta": return "info"; case "Deprecated": return "danger"; default: return "warning"; }
}
export function integrationStatusTone(s: string): "success" | "warning" | "danger" | "info" {
  switch (s) { case "Connected": return "success"; case "Pending": return "info"; case "Error": return "danger"; default: return "warning"; }
}
export function formatCurrency(n: number): string { return n >= 10000000 ? `₹${(n / 10000000).toFixed(1)}Cr` : n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : `₹${n.toLocaleString("en-IN")}`; }
export function formatBytes(mb: number): string { return mb >= 1000 ? `${(mb / 1000).toFixed(1)} TB` : `${mb} GB`; }
export function timeAgo(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}
