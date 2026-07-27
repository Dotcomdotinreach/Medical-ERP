/* ------------------------------------------------------------------ */
/* Realistic mock Billing & RCM data for Meridian Multi-Speciality     */
/* ------------------------------------------------------------------ */

export type PaymentStatus = "Paid" | "Pending" | "Partial" | "Overdue" | "Refunded" | "Cancelled";
export type InvoiceStatus = "Draft" | "Generated" | "Sent" | "Paid" | "Overdue" | "Cancelled";
export type InsuranceClaimStatus = "Submitted" | "In Process" | "Approved" | "Rejected" | "Deficiency" | "Settled";
export type ClearanceStatus = "Pending" | "Cleared" | "Blocked";
export type PaymentMode = "Cash" | "Card" | "UPI" | "Net Banking" | "Cheque" | "Wallet" | "Insurance" | "Corporate";
export type DiscountType = "Percentage" | "Flat";
export type RefundStatus = "Requested" | "Approved" | "Processed" | "Rejected";
export type GSTCategory = "Standard" | "Exempt" | "Reduced";

export interface InvoiceLineItem {
  id: string;
  category: string;
  description: string;
  hsnSac: string;
  quantity: number;
  unitPrice: number;
  total: number;
  gstRate: number;
  gstAmount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  patientName: string;
  uhid: string;
  admissionId?: string;
  date: string;
  dueDate: string;
  lineItems: InvoiceLineItem[];
  subtotal: number;
  discountAmount: number;
  taxableAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalGST: number;
  grandTotal: number;
  status: InvoiceStatus;
  paymentStatus: PaymentStatus;
  insuranceCovered: number;
  patientPayable: number;
  department: string;
  billingExecutive: string;
}

export interface Payment {
  id: string;
  invoiceId: string;
  patientName: string;
  uhid: string;
  amount: number;
  mode: PaymentMode;
  reference: string;
  date: string;
  time: string;
  receivedBy: string;
  receiptNumber: string;
  status: "Success" | "Pending" | "Failed" | "Refunded";
}

export interface InsurancePolicy {
  patientName: string;
  uhid: string;
  insuranceCompany: string;
  policyNumber: string;
  policyType: "Individual" | "Family Floater" | "Group" | "Government";
  coverageAmount: number;
  consumedAmount: number;
  remainingAmount: number;
  cashlessEligible: boolean;
  networkHospital: boolean;
  tpaName: string;
  validFrom: string;
  validTill: string;
  preAuthRequired: boolean;
  roomCategory: string;
}

export interface PreAuthRequest {
  id: string;
  patientName: string;
  uhid: string;
  insuranceCompany: string;
  policyNumber: string;
  diagnosis: string;
  estimatedCost: number;
  clinicalNotes: string;
  doctorRecommendation: string;
  status: "Draft" | "Submitted" | "Approved" | "Rejected" | "Partial";
  submittedAt?: string;
  approvedAt?: string;
  approvedAmount?: number;
  documents: string[];
}

export interface CorporateAccount {
  companyName: string;
  agreementId: string;
  contactPerson: string;
  creditLimit: number;
  utilized: number;
  pendingAmount: number;
  invoiceCycle: string;
  discountPercent: number;
  patientCount: number;
  lastInvoiceDate: string;
}

export interface TPARecord {
  tpaName: string;
  claimsSubmitted: number;
  claimsApproved: number;
  claimsRejected: number;
  claimsPending: number;
  totalClaimAmount: number;
  settledAmount: number;
  pendingAmount: number;
  avgProcessingDays: number;
  deficiencyCount: number;
}

export interface AdvanceRecord {
  id: string;
  patientName: string;
  uhid: string;
  amount: number;
  mode: PaymentMode;
  reference: string;
  date: string;
  receivedBy: string;
  receiptNumber: string;
  balance: number;
}

export interface RefundRecord {
  id: string;
  patientName: string;
  uhid: string;
  invoiceNumber: string;
  amount: number;
  reason: string;
  requestedBy: string;
  requestedAt: string;
  status: RefundStatus;
  approvedBy?: string;
  approvedAt?: string;
  processedAt?: string;
  creditNoteNumber?: string;
}

export interface ChargeCapture {
  source: string;
  patientName: string;
  uhid: string;
  department: string;
  item: string;
  amount: number;
  capturedAt: string;
  capturedBy: string;
  autoCaptured: boolean;
  reviewed: boolean;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  detail: string;
  patientName?: string;
  amount?: number;
  ipAddress: string;
}

/* ------------------------------------------------------------------ */
/* Invoices                                                             */
/* ------------------------------------------------------------------ */

export const INVOICES: Invoice[] = [
  {
    id: "INV-001", invoiceNumber: "MRD-BIL-2026-0722-001", patientName: "Rajesh Kumar", uhid: "MRD-2026-004821", admissionId: "ADM-2026-0722-001", date: "2026-07-22", dueDate: "2026-07-25",
    lineItems: [
      { id: "LI-001", category: "Room Charges", description: "ICU Bed — B01 (2 days)", hsnSac: "9993", quantity: 2, unitPrice: 15000, total: 30000, gstRate: 0, gstAmount: 0 },
      { id: "LI-002", category: "Doctor Fees", description: "Consultant — Dr. Imran Sheikh", hsnSac: "9993", quantity: 2, unitPrice: 3000, total: 6000, gstRate: 18, gstAmount: 1080 },
      { id: "LI-003", category: "Procedure Charges", description: "CABG — Triple Bypass", hsnSac: "9993", quantity: 1, unitPrice: 450000, total: 450000, gstRate: 0, gstAmount: 0 },
      { id: "LI-004", category: "OT Charges", description: "Major OT-1 (4 hrs)", hsnSac: "9993", quantity: 4, unitPrice: 25000, total: 100000, gstRate: 18, gstAmount: 18000 },
      { id: "LI-005", category: "Anaesthesia", description: "General Anaesthesia — Dr. Suresh Patil", hsnSac: "9993", quantity: 1, unitPrice: 45000, total: 45000, gstRate: 18, gstAmount: 8100 },
      { id: "LI-006", category: "Laboratory", description: "Blood tests, cultures, ABG", hsnSac: "9993", quantity: 1, unitPrice: 12000, total: 12000, gstRate: 0, gstAmount: 0 },
      { id: "LI-007", category: "Pharmacy", description: "Medications & consumables", hsnSac: "9993", quantity: 1, unitPrice: 28000, total: 28000, gstRate: 12, gstAmount: 3360 },
      { id: "LI-008", category: "Implant", description: "Coronary Stent x3", hsnSac: "9021", quantity: 3, unitPrice: 65000, total: 195000, gstRate: 12, gstAmount: 23400 },
    ],
    subtotal: 866000, discountAmount: 43300, taxableAmount: 822700, cgst: 12310, sgst: 12310, igst: 0, totalGST: 24620, grandTotal: 847320, status: "Generated", paymentStatus: "Partial", insuranceCovered: 500000, patientPayable: 347320, department: "Cardiac Surgery", billingExecutive: "Priya Mane",
  },
  {
    id: "INV-002", invoiceNumber: "MRD-BIL-2026-0723-001", patientName: "Vikram Patil", uhid: "MRD-2026-004840", admissionId: "ADM-2026-0723-001", date: "2026-07-23", dueDate: "2026-07-26",
    lineItems: [
      { id: "LI-009", category: "Room Charges", description: "Private Room (1 day)", hsnSac: "9993", quantity: 1, unitPrice: 8000, total: 8000, gstRate: 0, gstAmount: 0 },
      { id: "LI-010", category: "Doctor Fees", description: "Consultant — Dr. Sneha Iyer", hsnSac: "9993", quantity: 1, unitPrice: 3500, total: 3500, gstRate: 18, gstAmount: 630 },
      { id: "LI-011", category: "Procedure Charges", description: "TKR — Left", hsnSac: "9993", quantity: 1, unitPrice: 280000, total: 280000, gstRate: 0, gstAmount: 0 },
      { id: "LI-012", category: "Implant", description: "TKR Implant Set — Smith+Nephew", hsnSac: "9021", quantity: 1, unitPrice: 180000, total: 180000, gstRate: 12, gstAmount: 21600 },
      { id: "LI-013", category: "OT Charges", description: "Major OT-2 (2.5 hrs)", hsnSac: "9993", quantity: 2.5, unitPrice: 25000, total: 62500, gstRate: 18, gstAmount: 11250 },
    ],
    subtotal: 534000, discountAmount: 0, taxableAmount: 534000, cgst: 16740, sgst: 16740, igst: 0, totalGST: 33480, grandTotal: 567480, status: "Generated", paymentStatus: "Pending", insuranceCovered: 400000, patientPayable: 167480, department: "Orthopaedics", billingExecutive: "Priya Mane",
  },
  {
    id: "INV-003", invoiceNumber: "MRD-BIL-2026-0723-002", patientName: "Kavita Joshi", uhid: "MRD-2026-004841", date: "2026-07-23", dueDate: "2026-07-23",
    lineItems: [
      { id: "LI-014", category: "Procedure Charges", description: "Laparoscopic Cholecystectomy", hsnSac: "9993", quantity: 1, unitPrice: 95000, total: 95000, gstRate: 0, gstAmount: 0 },
      { id: "LI-015", category: "OT Charges", description: "Minor OT-1 (1.5 hrs)", hsnSac: "9993", quantity: 1.5, unitPrice: 15000, total: 22500, gstRate: 18, gstAmount: 4050 },
      { id: "LI-016", category: "Doctor Fees", description: "Consultant — Dr. Kavya Nair", hsnSac: "9993", quantity: 1, unitPrice: 2500, total: 2500, gstRate: 18, gstAmount: 450 },
      { id: "LI-017", category: "Pharmacy", description: "Medications", hsnSac: "9993", quantity: 1, unitPrice: 5500, total: 5500, gstRate: 12, gstAmount: 660 },
    ],
    subtotal: 125500, discountAmount: 6275, taxableAmount: 119225, cgst: 2563.5, sgst: 2563.5, igst: 0, totalGST: 5127, grandTotal: 124352, status: "Generated", paymentStatus: "Paid", insuranceCovered: 100000, patientPayable: 24352, department: "General Surgery", billingExecutive: "Priya Mane",
  },
  {
    id: "INV-004", invoiceNumber: "MRD-BIL-2026-0723-003", patientName: "Anil Kulkarni", uhid: "MRD-2026-004833", admissionId: "ADM-2026-0722-005", date: "2026-07-23", dueDate: "2026-07-26",
    lineItems: [
      { id: "LI-018", category: "Room Charges", description: "ICU Bed — B02 (3 days)", hsnSac: "9993", quantity: 3, unitPrice: 15000, total: 45000, gstRate: 0, gstAmount: 0 },
      { id: "LI-019", category: "ICU Charges", description: "Ventilator, monitoring, nursing", hsnSac: "9993", quantity: 3, unitPrice: 12000, total: 36000, gstRate: 18, gstAmount: 6480 },
      { id: "LI-020", category: "Pharmacy", description: "Antibiotics, vasopressors, sedation", hsnSac: "9993", quantity: 1, unitPrice: 45000, total: 45000, gstRate: 12, gstAmount: 5400 },
      { id: "LI-021", category: "Laboratory", description: "Blood cultures, procalcitonin, ABGs", hsnSac: "9993", quantity: 1, unitPrice: 18000, total: 18000, gstRate: 0, gstAmount: 0 },
      { id: "LI-022", category: "Doctor Fees", description: "Intensivist — Dr. Imran Sheikh", hsnSac: "9993", quantity: 3, unitPrice: 4000, total: 12000, gstRate: 18, gstAmount: 2160 },
    ],
    subtotal: 156000, discountAmount: 0, taxableAmount: 156000, cgst: 7020, sgst: 7020, igst: 0, totalGST: 14040, grandTotal: 170040, status: "Generated", paymentStatus: "Partial", insuranceCovered: 0, patientPayable: 170040, department: "Critical Care", billingExecutive: "Priya Mane",
  },
];

/* ------------------------------------------------------------------ */
/* Payments                                                             */
/* ------------------------------------------------------------------ */

export const PAYMENTS: Payment[] = [
  { id: "PAY-001", invoiceId: "INV-001", patientName: "Rajesh Kumar", uhid: "MRD-2026-004821", amount: 500000, mode: "Insurance", reference: "Star Health — Cashless", date: "2026-07-22", time: "08:00", receivedBy: "Insurance Desk", receiptNumber: "RCP-2026-0722-001", status: "Success" },
  { id: "PAY-002", invoiceId: "INV-001", patientName: "Rajesh Kumar", uhid: "MRD-2026-004821", amount: 100000, mode: "UPI", reference: "UPI: rajesh.kumar@ybl", date: "2026-07-22", time: "08:15", receivedBy: "Cashier", receiptNumber: "RCP-2026-0722-002", status: "Success" },
  { id: "PAY-003", invoiceId: "INV-003", patientName: "Kavita Joshi", uhid: "MRD-2026-004841", amount: 124352, mode: "Card", reference: "HDFC Credit Card ****4521", date: "2026-07-23", time: "10:30", receivedBy: "Cashier", receiptNumber: "RCP-2026-0723-001", status: "Success" },
  { id: "PAY-004", invoiceId: "INV-002", patientName: "Vikram Patil", uhid: "MRD-2026-004840", amount: 50000, mode: "Cash", reference: "Cash deposit at counter", date: "2026-07-23", time: "07:30", receivedBy: "Cashier", receiptNumber: "RCP-2026-0723-002", status: "Success" },
  { id: "PAY-005", invoiceId: "INV-004", patientName: "Anil Kulkarni", uhid: "MRD-2026-004833", amount: 75000, mode: "Cheque", reference: "Cheque No. 456789 — HDFC Bank", date: "2026-07-23", time: "11:00", receivedBy: "Cashier", receiptNumber: "RCP-2026-0723-003", status: "Success" },
];

/* ------------------------------------------------------------------ */
/* Insurance Policies                                                   */
/* ------------------------------------------------------------------ */

export const INSURANCE_POLICIES: InsurancePolicy[] = [
  { patientName: "Rajesh Kumar", uhid: "MRD-2026-004821", insuranceCompany: "Star Health Insurance", policyNumber: "SH-2025-48210", policyType: "Family Floater", coverageAmount: 500000, consumedAmount: 120000, remainingAmount: 380000, cashlessEligible: true, networkHospital: true, tpaName: "Medi Assist", validFrom: "2025-04-01", validTill: "2026-03-31", preAuthRequired: false, roomCategory: "Single" },
  { patientName: "Vikram Patil", uhid: "MRD-2026-004840", insuranceCompany: "Niva Bupa", policyNumber: "NB-2025-48400", policyType: "Individual", coverageAmount: 400000, consumedAmount: 50000, remainingAmount: 350000, cashlessEligible: true, networkHospital: true, tpaName: "FHPL", validFrom: "2025-06-01", validTill: "2026-05-31", preAuthRequired: true, roomCategory: "Semi-Private" },
  { patientName: "Anil Kulkarni", uhid: "MRD-2026-004833", insuranceCompany: "None", policyNumber: "N/A", policyType: "Individual", coverageAmount: 0, consumedAmount: 0, remainingAmount: 0, cashlessEligible: false, networkHospital: false, tpaName: "N/A", validFrom: "N/A", validTill: "N/A", preAuthRequired: false, roomCategory: "N/A" },
  { patientName: "Lakshmi Iyer", uhid: "MRD-2026-004824", insuranceCompany: "ICICI Lombard", policyNumber: "IL-2024-48240", policyType: "Individual", coverageAmount: 600000, consumedAmount: 350000, remainingAmount: 250000, cashlessEligible: true, networkHospital: true, tpaName: "Vidal Health", validFrom: "2024-10-01", validTill: "2026-09-30", preAuthRequired: true, roomCategory: "Single" },
];

/* ------------------------------------------------------------------ */
/* Pre-Authorization Requests                                          */
/* ------------------------------------------------------------------ */

export const PRE_AUTH_REQUESTS: PreAuthRequest[] = [
  { id: "PA-001", patientName: "Vikram Patil", uhid: "MRD-2026-004840", insuranceCompany: "Niva Bupa", policyNumber: "NB-2025-48400", diagnosis: "Severe osteoarthritis — Left knee", estimatedCost: 567480, clinicalNotes: "TKR planned. Conservative treatment failed. Severe pain, limited mobility.", doctorRecommendation: "Left TKR recommended. Patient has failed 6 months of conservative management.", status: "Approved", submittedAt: "2026-07-22 16:00", approvedAt: "2026-07-22 18:30", approvedAmount: 400000, documents: ["Clinical notes", "X-ray Left Knee", "MRI Left Knee", "Doctor recommendation"] },
  { id: "PA-002", patientName: "Lakshmi Iyer", uhid: "MRD-2026-004824", insuranceCompany: "ICICI Lombard", policyNumber: "IL-2024-48240", diagnosis: "Right femoral neck fracture", estimatedCost: 500000, clinicalNotes: "Hip hemiarthroplasty needed. Elderly patient, fall from standing height.", doctorRecommendation: "Urgent hip replacement recommended. High risk of avascular necrosis.", status: "Submitted", submittedAt: "2026-07-23 09:00", documents: ["Clinical notes", "X-ray Hip", "CT scan", "Pre-op assessment"] },
];

/* ------------------------------------------------------------------ */
/* Corporate Accounts                                                   */
/* ------------------------------------------------------------------ */

export const CORPORATE_ACCOUNTS: CorporateAccount[] = [
  { companyName: "Tata Consultancy Services (TCS)", agreementId: "CORP-TCS-2025", contactPerson: "Rajesh Menon — HR Head", creditLimit: 5000000, utilized: 2350000, pendingAmount: 450000, invoiceCycle: "Monthly", discountPercent: 15, patientCount: 47, lastInvoiceDate: "2026-07-01" },
  { companyName: "Infosys Limited", agreementId: "CORP-INFY-2025", contactPerson: "Anita Sharma — Benefits Lead", creditLimit: 3000000, utilized: 1200000, pendingAmount: 280000, invoiceCycle: "Monthly", discountPercent: 12, patientCount: 28, lastInvoiceDate: "2026-07-01" },
  { companyName: "Reliance Industries", agreementId: "CORP-RIL-2025", contactPerson: "Vikram Joshi — Admin", creditLimit: 8000000, utilized: 4500000, pendingAmount: 800000, invoiceCycle: "Bi-Weekly", discountPercent: 18, patientCount: 62, lastInvoiceDate: "2026-07-15" },
];

/* ------------------------------------------------------------------ */
/* TPA Records                                                          */
/* ------------------------------------------------------------------ */

export const TPA_RECORDS: TPARecord[] = [
  { tpaName: "Medi Assist", claimsSubmitted: 124, claimsApproved: 98, claimsRejected: 8, claimsPending: 18, totalClaimAmount: 4500000, settledAmount: 3600000, pendingAmount: 900000, avgProcessingDays: 12, deficiencyCount: 5 },
  { tpaName: "FHPL", claimsSubmitted: 87, claimsApproved: 72, claimsRejected: 5, claimsPending: 10, totalClaimAmount: 2800000, settledAmount: 2300000, pendingAmount: 500000, avgProcessingDays: 14, deficiencyCount: 3 },
  { tpaName: "Paramount TPA", claimsSubmitted: 56, claimsApproved: 42, claimsRejected: 6, claimsPending: 8, totalClaimAmount: 1500000, settledAmount: 1100000, pendingAmount: 400000, avgProcessingDays: 16, deficiencyCount: 2 },
  { tpaName: "Vidal Health", claimsSubmitted: 43, claimsApproved: 38, claimsRejected: 2, claimsPending: 3, totalClaimAmount: 1200000, settledAmount: 950000, pendingAmount: 250000, avgProcessingDays: 10, deficiencyCount: 1 },
];

/* ------------------------------------------------------------------ */
/* Advance Records                                                      */
/* ------------------------------------------------------------------ */

export const ADVANCE_RECORDS: AdvanceRecord[] = [
  { id: "ADV-001", patientName: "Rajesh Kumar", uhid: "MRD-2026-004821", amount: 200000, mode: "UPI", reference: "UPI: rajesh.kumar@ybl", date: "2026-07-20", receivedBy: "Cashier", receiptNumber: "ADV-RCP-2026-0720-001", balance: 0 },
  { id: "ADV-002", patientName: "Vikram Patil", uhid: "MRD-2026-004840", amount: 100000, mode: "Cash", reference: "Cash at counter", date: "2026-07-22", receivedBy: "Cashier", receiptNumber: "ADV-RCP-2026-0722-001", balance: 50000 },
  { id: "ADV-003", patientName: "Anil Kulkarni", uhid: "MRD-2026-004833", amount: 75000, mode: "Cheque", reference: "Cheque No. 456789 — HDFC", date: "2026-07-21", receivedBy: "Cashier", receiptNumber: "ADV-RCP-2026-0721-001", balance: 0 },
];

/* ------------------------------------------------------------------ */
/* Refund Records                                                       */
/* ------------------------------------------------------------------ */

export const REFUND_RECORDS: RefundRecord[] = [
  { id: "REF-001", patientName: "Ravi Gaikwad", uhid: "MRD-2026-004847", invoiceNumber: "MRD-BIL-2026-0723-005", amount: 3500, reason: "Overcharged — cataract surgery package includes post-op meds", requestedBy: "Billing Exec", requestedAt: "2026-07-23 12:00", status: "Approved", approvedBy: "Finance Manager", approvedAt: "2026-07-23 13:00", creditNoteNumber: "CN-2026-0723-001" },
  { id: "REF-002", patientName: "Sunita Reddy", uhid: "MRD-2026-004826", invoiceNumber: "MRD-BIL-2026-0721-003", amount: 5000, reason: "Patient cancelled procedure before start", requestedBy: "Patient", requestedAt: "2026-07-21 10:00", status: "Processed", approvedBy: "Finance Manager", approvedAt: "2026-07-21 11:00", processedAt: "2026-07-21 14:00", creditNoteNumber: "CN-2026-0721-001" },
];

/* ------------------------------------------------------------------ */
/* Auto Charge Captures                                                 */
/* ------------------------------------------------------------------ */

export const CHARGE_CAPTURES: ChargeCapture[] = [
  { source: "OT", patientName: "Rajesh Kumar", uhid: "MRD-2026-004821", department: "Cardiac Surgery", item: "CABG Procedure", amount: 450000, capturedAt: "2026-07-22 12:00", capturedBy: "System", autoCaptured: true, reviewed: true },
  { source: "Laboratory", patientName: "Rajesh Kumar", uhid: "MRD-2026-004821", department: "Pathology", item: "Blood Panel, Cultures, ABG", amount: 12000, capturedAt: "2026-07-22 14:00", capturedBy: "System", autoCaptured: true, reviewed: true },
  { source: "Pharmacy", patientName: "Rajesh Kumar", uhid: "MRD-2026-004821", department: "Pharmacy", item: "Medications — ICU", amount: 28000, capturedAt: "2026-07-22 18:00", capturedBy: "System", autoCaptured: true, reviewed: false },
  { source: "OT", patientName: "Vikram Patil", uhid: "MRD-2026-004840", department: "Orthopaedics", item: "TKR Procedure", amount: 280000, capturedAt: "2026-07-23 10:30", capturedBy: "System", autoCaptured: true, reviewed: false },
  { source: "ICU", patientName: "Anil Kulkarni", uhid: "MRD-2026-004833", department: "Critical Care", item: "ICU charges — 3 days", amount: 81000, capturedAt: "2026-07-23 06:00", capturedBy: "System", autoCaptured: true, reviewed: false },
  { source: "Radiology", patientName: "Anil Kulkarni", uhid: "MRD-2026-004833", department: "Radiology", item: "CT Abdomen, Chest X-ray", amount: 8500, capturedAt: "2026-07-21 22:00", capturedBy: "System", autoCaptured: true, reviewed: true },
];

/* ------------------------------------------------------------------ */
/* Audit Logs                                                           */
/* ------------------------------------------------------------------ */

export const AUDIT_LOGS: AuditEntry[] = [
  { id: "AUD-BIL-001", timestamp: "2026-07-22 08:00:00", user: "Insurance Desk", role: "Insurance Coordinator", action: "Insurance Verification", detail: "Rajesh Kumar — Star Health policy verified. Cashless approved.", patientName: "Rajesh Kumar", ipAddress: "10.0.5.501" },
  { id: "AUD-BIL-002", timestamp: "2026-07-22 08:15:00", user: "Cashier", role: "Cashier", action: "Advance Collected", detail: "Rajesh Kumar — ₹2,00,000 advance via UPI.", patientName: "Rajesh Kumar", amount: 200000, ipAddress: "10.0.5.502" },
  { id: "AUD-BIL-003", timestamp: "2026-07-22 12:00:00", user: "System", role: "Auto-Capture", action: "Charge Captured", detail: "CABG procedure charge ₹4,50,000 auto-captured from OT module.", patientName: "Rajesh Kumar", amount: 450000, ipAddress: "10.0.5.500" },
  { id: "AUD-BIL-004", timestamp: "2026-07-22 16:00:00", user: "Insurance Desk", role: "Insurance Coordinator", action: "Pre-Auth Submitted", detail: "TKR pre-auth submitted to Niva Bupa for Vikram Patil. Est: ₹5,67,480.", patientName: "Vikram Patil", amount: 567480, ipAddress: "10.0.5.501" },
  { id: "AUD-BIL-005", timestamp: "2026-07-22 18:30:00", user: "Niva Bupa", role: "Insurance", action: "Pre-Auth Approved", detail: "Pre-auth approved for Vikram Patil. Approved: ₹4,00,000.", patientName: "Vikram Patil", amount: 400000, ipAddress: "10.0.5.500" },
  { id: "AUD-BIL-006", timestamp: "2026-07-23 10:30:00", user: "Cashier", role: "Cashier", action: "Payment Received", detail: "Kavita Joshi — ₹1,24,352 paid via HDFC Credit Card.", patientName: "Kavita Joshi", amount: 124352, ipAddress: "10.0.5.502" },
  { id: "AUD-BIL-007", timestamp: "2026-07-23 12:00:00", user: "Priya Mane", role: "Billing Executive", action: "Invoice Generated", detail: "Invoice MRD-BIL-2026-0722-001 generated for Rajesh Kumar. Total: ₹8,47,320.", patientName: "Rajesh Kumar", amount: 847320, ipAddress: "10.0.5.503" },
  { id: "AUD-BIL-008", timestamp: "2026-07-23 13:00:00", user: "Finance Manager", role: "Finance Manager", action: "Refund Approved", detail: "Refund ₹3,500 approved for Ravi Gaikwad — cataract overcharge.", patientName: "Ravi Gaikwad", amount: 3500, ipAddress: "10.0.5.504" },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                              */
/* ------------------------------------------------------------------ */

export function paymentStatusTone(s: PaymentStatus): "success" | "warning" | "danger" | "info" | "neutral" {
  switch (s) {
    case "Paid": return "success";
    case "Partial": return "warning";
    case "Pending": return "info";
    case "Overdue": return "danger";
    case "Refunded": return "info";
    case "Cancelled": return "danger";
    default: return "neutral";
  }
}

export function invoiceStatusTone(s: InvoiceStatus): "brand" | "success" | "warning" | "danger" | "info" | "neutral" {
  switch (s) {
    case "Draft": return "neutral";
    case "Generated": return "brand";
    case "Sent": return "info";
    case "Paid": return "success";
    case "Overdue": return "danger";
    case "Cancelled": return "danger";
    default: return "neutral";
  }
}

export function claimStatusTone(s: InsuranceClaimStatus): "brand" | "success" | "warning" | "danger" | "info" {
  switch (s) {
    case "Submitted": return "info";
    case "In Process": return "warning";
    case "Approved": return "success";
    case "Rejected": return "danger";
    case "Deficiency": return "danger";
    case "Settled": return "success";
    default: return "info";
  }
}

export function clearanceStatusTone(s: ClearanceStatus): "success" | "warning" | "danger" {
  switch (s) {
    case "Cleared": return "success";
    case "Pending": return "warning";
    case "Blocked": return "danger";
    default: return "warning";
  }
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
}
