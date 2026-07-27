/* ------------------------------------------------------------------ */
/* Realistic mock Inventory & SCM data                                 */
/* Meridian Multi-Speciality Hospital, Pune                             */
/* ------------------------------------------------------------------ */

export type ItemStatus = "In Stock" | "Low Stock" | "Out of Stock" | "Reserved" | "Expired" | "Quarantine";
export type POStatus = "Draft" | "Submitted" | "Approved" | "Sent to Supplier" | "Partially Received" | "Received" | "Cancelled";
export type GRNStatus = "Pending Inspection" | "Accepted" | "Rejected" | "Partial Accept" | "On Hold";
export type RequisitionStatus = "Draft" | "Submitted" | "Approved" | "Rejected" | "Fulfilled" | "Cancelled";
export type TransferStatus = "Initiated" | "In Transit" | "Received" | "Cancelled";
export type AuditStatus = "Scheduled" | "In Progress" | "Completed" | "Variance Found";
export type InspectionResult = "Pass" | "Fail" | "Conditional" | "Pending";
export type AssetStatus = "Active" | "Under Maintenance" | "Retired" | "Decommissioned" | "In Storage";
export type ExpiryStatus = "Valid" | "Near Expiry" | "Expired";

export interface StockItem {
  id: string;
  code: string;
  name: string;
  category: string;
  subcategory: string;
  manufacturer: string;
  hsnCode: string;
  unit: string;
  gstRate: number;
  minStock: number;
  maxStock: number;
  currentStock: number;
  reorderLevel: number;
  unitCost: number;
  status: ItemStatus;
  location: string;
  lastReceived: string;
  expiryDate?: string;
  batchNumber?: string;
}

export interface DepartmentStock {
  departmentId: string;
  departmentName: string;
  itemCount: number;
  totalValue: number;
  lowStockItems: number;
  criticalItems: number;
  lastUpdated: string;
  items: { itemId: string; itemName: string; quantity: number; status: ItemStatus }[];
}

export interface PurchaseRequisition {
  id: string;
  requisitionNumber: string;
  requestedBy: string;
  department: string;
  requestDate: string;
  status: RequisitionStatus;
  priority: "Urgent" | "High" | "Normal" | "Low";
  totalItems: number;
  estimatedTotal: number;
  items: { name: string; quantity: number; unitPrice: number; status: RequisitionStatus }[];
  approvedBy?: string;
  approvedDate?: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  orderDate: string;
  expectedDelivery: string;
  status: POStatus;
  totalAmount: number;
  gstAmount: number;
  grandTotal: number;
  items: { name: string; quantity: number; unitPrice: number; total: number; gstRate: number }[];
  createdBy: string;
  approvedBy?: string;
  remarks?: string;
}

export interface Supplier {
  id: string;
  name: string;
  gstin: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  rating: number;
  leadTimeDays: number;
  paymentTerms: string;
  totalOrders: number;
  onTimeDelivery: number;
  qualityScore: number;
  status: "Active" | "Inactive" | "Blacklisted";
  categories: string[];
}

export interface GRNRecord {
  id: string;
  grnNumber: string;
  poNumber: string;
  supplierName: string;
  receivedDate: string;
  receivedBy: string;
  status: GRNStatus;
  inspectionResult: InspectionResult;
  totalItems: number;
  acceptedItems: number;
  rejectedItems: number;
  batches: { batchNumber: string; expiryDate: string; quantity: number; manufacturingDate: string }[];
  remarks?: string;
}

export interface BatchRecord {
  id: string;
  batchNumber: string;
  itemName: string;
  itemId: string;
  manufacturer: string;
  manufacturingDate: string;
  expiryDate: string;
  quantity: number;
  remainingQuantity: number;
  unitCost: number;
  status: ExpiryStatus;
  fefoCompliant: boolean;
  storageLocation: string;
}

export interface StockTransfer {
  id: string;
  transferNumber: string;
  fromStore: string;
  toStore: string;
  transferDate: string;
  status: TransferStatus;
  items: { name: string; quantity: number; batchNumber: string }[];
  initiatedBy: string;
  receivedBy?: string;
  remarks?: string;
}

export interface CycleCount {
  id: string;
  countNumber: string;
  scheduledDate: string;
  completedDate?: string;
  store: string;
  countedBy: string;
  status: "Scheduled" | "In Progress" | "Completed";
  totalItems: number;
  matchedItems: number;
  varianceItems: number;
  accuracyPercent: number;
}

export interface AssetRecord {
  id: string;
  assetTag: string;
  name: string;
  category: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  purchaseDate: string;
  purchaseCost: number;
  currentValue: number;
  depreciationMethod: string;
  warrantyExpiry: string;
  location: string;
  department: string;
  status: AssetStatus;
  lastServiceDate: string;
  nextServiceDate: string;
  assignedTo?: string;
}

export interface AlertItem {
  id: string;
  type: "Low Stock" | "Near Expiry" | "Pending Approval" | "Delayed Delivery" | "Maintenance Due" | "Out of Stock" | "Price Alert";
  severity: "Critical" | "High" | "Medium" | "Low";
  title: string;
  description: string;
  timestamp: string;
  acknowledged: boolean;
  itemId?: string;
  itemName?: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  detail: string;
  ipAddress: string;
}
/* ------------------------------------------------------------------ */
/* Stock Items                                                          */
/* ------------------------------------------------------------------ */

export const STOCK_ITEMS: StockItem[] = [
  { id: "SI-001", code: "SYR-001", name: "Disposable Syringe 5ml", category: "Consumables", subcategory: "Syringes", manufacturer: "Hindustan Syringes & Medical Devices", hsnCode: "9018", unit: "Pieces", gstRate: 12, minStock: 5000, maxStock: 50000, currentStock: 12400, reorderLevel: 8000, unitCost: 3.50, status: "In Stock", location: "Central Store - Rack A1", lastReceived: "2026-07-20", batchNumber: "HS-2026-0715" },
  { id: "SI-002", code: "IVC-001", name: "IV Cannula 20G", category: "Consumables", subcategory: "IV Access", manufacturer: "BD India Pvt Ltd", hsnCode: "9018", unit: "Pieces", gstRate: 12, minStock: 3000, maxStock: 30000, currentStock: 8200, reorderLevel: 5000, unitCost: 8.75, status: "In Stock", location: "Central Store - Rack A2", lastReceived: "2026-07-18", batchNumber: "BD-2026-0710" },
  { id: "SI-003", code: "SG-001", name: "Surgical Gloves (Powder-Free)", category: "PPE", subcategory: "Gloves", manufacturer: "Top Glove India Pvt Ltd", hsnCode: "4015", unit: "Pairs", gstRate: 18, minStock: 10000, maxStock: 80000, currentStock: 4200, reorderLevel: 15000, unitCost: 12.50, status: "Low Stock", location: "Central Store - Rack B1", lastReceived: "2026-07-15", batchNumber: "TG-2026-0701" },
  { id: "SI-004", code: "N95-001", name: "N95 Respirator Mask", category: "PPE", subcategory: "Masks", manufacturer: "3M India Ltd", hsnCode: "6307", unit: "Pieces", gstRate: 18, minStock: 2000, maxStock: 20000, currentStock: 0, reorderLevel: 3000, unitCost: 45.00, status: "Out of Stock", location: "Central Store - Rack B2", lastReceived: "2026-06-30", batchNumber: "3M-2026-0615" },
  { id: "SI-005", code: "GR-001", name: "Gauze Roll 10cm", category: "Consumables", subcategory: "Dressings", manufacturer: "Johnson & Johnson India", hsnCode: "3005", unit: "Rolls", gstRate: 12, minStock: 1000, maxStock: 8000, currentStock: 3200, reorderLevel: 1500, unitCost: 22.00, status: "In Stock", location: "Central Store - Rack C1", lastReceived: "2026-07-10", batchNumber: "JJ-2026-0705" },
  { id: "SI-006", code: "SUT-001", name: "Absorbable Sutures 3-0", category: "Surgical", subcategory: "Sutures", manufacturer: "Ethicon India Pvt Ltd", hsnCode: "3006", unit: "Packs", gstRate: 12, minStock: 200, maxStock: 1500, currentStock: 180, reorderLevel: 250, unitCost: 185.00, status: "Low Stock", location: "OT Store - Rack D1", lastReceived: "2026-07-12", batchNumber: "ET-2026-0708" },
  { id: "SI-007", code: "CAT-001", name: "Foley Catheter 16Fr", category: "Consumables", subcategory: "Catheters", manufacturer: "Coloplast India Pvt Ltd", hsnCode: "9018", unit: "Pieces", gstRate: 12, minStock: 500, maxStock: 3000, currentStock: 1100, reorderLevel: 700, unitCost: 95.00, status: "In Stock", location: "Central Store - Rack A3", lastReceived: "2026-07-14", batchNumber: "CL-2026-0710" },
  { id: "SI-008", code: "ECG-001", name: "ECG Electrodes (Pre-gelled)", category: "Diagnostics", subcategory: "ECG", manufacturer: "GE Healthcare India", hsnCode: "9018", unit: "Boxes", gstRate: 18, minStock: 100, maxStock: 800, currentStock: 320, reorderLevel: 150, unitCost: 320.00, status: "In Stock", location: "Central Store - Rack E1", lastReceived: "2026-07-16", batchNumber: "GE-2026-0712" },
  { id: "SI-009", code: "IVF-001", name: "IV Fluid Normal Saline 1000ml", category: "Pharmaceuticals", subcategory: "IV Fluids", manufacturer: "Russo Medicaments Pvt Ltd", hsnCode: "3004", unit: "Bottles", gstRate: 12, minStock: 2000, maxStock: 15000, currentStock: 6800, reorderLevel: 3000, unitCost: 28.00, status: "In Stock", location: "Pharmacy Store - Rack F1", lastReceived: "2026-07-21", batchNumber: "RM-2026-0718" },
  { id: "SI-010", code: "BCT-001", name: "Blood Collection Tubes (EDTA)", category: "Diagnostics", subcategory: "Lab Consumables", manufacturer: "BD India Pvt Ltd", hsnCode: "9018", unit: "Boxes", gstRate: 12, minStock: 200, maxStock: 1500, currentStock: 540, reorderLevel: 300, unitCost: 450.00, status: "In Stock", location: "Laboratory Store - Rack G1", lastReceived: "2026-07-19", batchNumber: "BD-2026-0715" },
  { id: "SI-011", code: "ORT-001", name: "Ortho Implant - Dynamic Hip Screw", category: "Implants", subcategory: "Orthopaedic", manufacturer: "Smith & Nephew India", hsnCode: "9021", unit: "Sets", gstRate: 12, minStock: 10, maxStock: 50, currentStock: 8, reorderLevel: 12, unitCost: 18500.00, status: "Low Stock", location: "OT Implant Store - Rack H1", lastReceived: "2026-07-05", batchNumber: "SN-2026-0701" },
  { id: "SI-012", code: "MESH-001", name: "Surgical Mesh (Polypropylene)", category: "Implants", subcategory: "Surgical", manufacturer: "Bard India Pvt Ltd", hsnCode: "9021", unit: "Pieces", gstRate: 12, minStock: 20, maxStock: 100, currentStock: 35, reorderLevel: 30, unitCost: 4200.00, status: "In Stock", location: "OT Implant Store - Rack H2", lastReceived: "2026-07-08", batchNumber: "BD-2026-0705" },
  { id: "SI-013", code: "CM-001", name: "Contrast Media (Omnipaque 350)", category: "Pharmaceuticals", subcategory: "Contrast", manufacturer: "GE Healthcare India", hsnCode: "3006", unit: "Vials", gstRate: 12, minStock: 50, maxStock: 300, currentStock: 42, reorderLevel: 60, unitCost: 2800.00, status: "Low Stock", location: "Radiology Store - Rack I1", lastReceived: "2026-07-11", batchNumber: "GE-2026-0708" },
];
/* ------------------------------------------------------------------ */
/* Department Stocks                                                    */
/* ------------------------------------------------------------------ */

export const DEPARTMENT_STOCKS: DepartmentStock[] = [
  { departmentId: "DEPT-001", departmentName: "Central Store", itemCount: 13, totalValue: 524800, lowStockItems: 3, criticalItems: 1, lastUpdated: "2026-07-23 08:00", items: [
    { itemId: "SI-001", itemName: "Disposable Syringe 5ml", quantity: 12400, status: "In Stock" },
    { itemId: "SI-002", itemName: "IV Cannula 20G", quantity: 8200, status: "In Stock" },
    { itemId: "SI-003", itemName: "Surgical Gloves", quantity: 4200, status: "Low Stock" },
    { itemId: "SI-004", itemName: "N95 Respirator Mask", quantity: 0, status: "Out of Stock" },
    { itemId: "SI-005", itemName: "Gauze Roll 10cm", quantity: 3200, status: "In Stock" },
    { itemId: "SI-007", itemName: "Foley Catheter 16Fr", quantity: 1100, status: "In Stock" },
    { itemId: "SI-008", itemName: "ECG Electrodes", quantity: 320, status: "In Stock" },
  ] },
  { departmentId: "DEPT-002", departmentName: "Pharmacy", itemCount: 2, totalValue: 285600, lowStockItems: 0, criticalItems: 0, lastUpdated: "2026-07-23 07:30", items: [
    { itemId: "SI-009", itemName: "IV Fluid NS 1000ml", quantity: 6800, status: "In Stock" },
    { itemId: "SI-013", itemName: "Contrast Media Omnipaque", quantity: 42, status: "Low Stock" },
  ] },
  { departmentId: "DEPT-003", departmentName: "Operation Theater", itemCount: 4, totalValue: 412000, lowStockItems: 1, criticalItems: 0, lastUpdated: "2026-07-23 06:45", items: [
    { itemId: "SI-006", itemName: "Absorbable Sutures 3-0", quantity: 180, status: "Low Stock" },
    { itemId: "SI-011", itemName: "Ortho Implant DHS", quantity: 8, status: "Low Stock" },
    { itemId: "SI-012", itemName: "Surgical Mesh", quantity: 35, status: "In Stock" },
    { itemId: "SI-003", itemName: "Surgical Gloves", quantity: 2100, status: "In Stock" },
  ] },
  { departmentId: "DEPT-004", departmentName: "ICU", itemCount: 3, totalValue: 96500, lowStockItems: 0, criticalItems: 0, lastUpdated: "2026-07-23 08:15", items: [
    { itemId: "SI-001", itemName: "Disposable Syringe 5ml", quantity: 2800, status: "In Stock" },
    { itemId: "SI-002", itemName: "IV Cannula 20G", quantity: 1900, status: "In Stock" },
    { itemId: "SI-009", itemName: "IV Fluid NS 1000ml", quantity: 1500, status: "In Stock" },
  ] },
  { departmentId: "DEPT-005", departmentName: "Laboratory", itemCount: 1, totalValue: 243000, lowStockItems: 0, criticalItems: 0, lastUpdated: "2026-07-23 07:00", items: [
    { itemId: "SI-010", itemName: "Blood Collection Tubes", quantity: 540, status: "In Stock" },
  ] },
];
/* ------------------------------------------------------------------ */
/* Purchase Requisitions                                                */
/* ------------------------------------------------------------------ */

export const PURCHASE_REQUISITIONS: PurchaseRequisition[] = [
  { id: "PR-001", requisitionNumber: "REQ-2026-0041", requestedBy: "Neha Deshpande", department: "Central Store", requestDate: "2026-07-20", status: "Submitted", priority: "High", totalItems: 3, estimatedTotal: 187500, items: [
    { name: "N95 Respirator Mask", quantity: 5000, unitPrice: 45, status: "Submitted" },
    { name: "Surgical Gloves", quantity: 10000, unitPrice: 12.50, status: "Submitted" },
    { name: "Absorbable Sutures 3-0", quantity: 300, unitPrice: 185, status: "Submitted" },
  ] },
  { id: "PR-002", requisitionNumber: "REQ-2026-0042", requestedBy: "Suresh Patil", department: "Operation Theater", requestDate: "2026-07-21", status: "Submitted", priority: "Urgent", totalItems: 2, estimatedTotal: 239000, items: [
    { name: "Ortho Implant DHS", quantity: 10, unitPrice: 18500, status: "Submitted" },
    { name: "Surgical Mesh", quantity: 15, unitPrice: 4200, status: "Submitted" },
  ] },
  { id: "PR-003", requisitionNumber: "REQ-2026-0043", requestedBy: "Asha Kute", department: "ICU", requestDate: "2026-07-19", status: "Approved", priority: "Normal", totalItems: 2, estimatedTotal: 48000, items: [
    { name: "Disposable Syringe 5ml", quantity: 5000, unitPrice: 3.50, status: "Approved" },
    { name: "IV Cannula 20G", quantity: 3000, unitPrice: 8.75, status: "Approved" },
  ] },
  { id: "PR-004", requisitionNumber: "REQ-2026-0044", requestedBy: "Ravi Kumar", department: "Laboratory", requestDate: "2026-07-18", status: "Fulfilled", priority: "Normal", totalItems: 1, estimatedTotal: 225000, items: [
    { name: "Blood Collection Tubes", quantity: 500, unitPrice: 450, status: "Fulfilled" },
  ] },
];
/* ------------------------------------------------------------------ */
/* Purchase Orders                                                      */
/* ------------------------------------------------------------------ */

export const PURCHASE_ORDERS: PurchaseOrder[] = [
  { id: "PO-001", poNumber: "PO-2026-0187", supplierId: "SUP-001", supplierName: "Hindustan Syringes & Medical Devices", orderDate: "2026-07-15", expectedDelivery: "2026-07-25", status: "Sent to Supplier", totalAmount: 35000, gstAmount: 4200, grandTotal: 39200, items: [
    { name: "Disposable Syringe 5ml", quantity: 10000, unitPrice: 3.50, total: 35000, gstRate: 12 },
  ], createdBy: "Neha Deshpande", approvedBy: "Dr. Meera Joshi" },
  { id: "PO-002", poNumber: "PO-2026-0188", supplierId: "SUP-004", supplierName: "BD India Pvt Ltd", orderDate: "2026-07-16", expectedDelivery: "2026-07-28", status: "Partially Received", totalAmount: 175000, gstAmount: 21000, grandTotal: 196000, items: [
    { name: "IV Cannula 20G", quantity: 20000, unitPrice: 8.75, total: 175000, gstRate: 12 },
  ], createdBy: "Neha Deshpande", approvedBy: "Dr. Meera Joshi", remarks: "Partial delivery of 12000 received on 2026-07-22" },
  { id: "PO-003", poNumber: "PO-2026-0189", supplierId: "SUP-003", supplierName: "GE Healthcare India", orderDate: "2026-07-18", expectedDelivery: "2026-07-30", status: "Approved", totalAmount: 112000, gstAmount: 20160, grandTotal: 132160, items: [
    { name: "ECG Electrodes", quantity: 200, unitPrice: 320, total: 64000, gstRate: 18 },
    { name: "Contrast Media Omnipaque 350", quantity: 30, unitPrice: 2800, total: 84000, gstRate: 12 },
  ], createdBy: "Suresh Patil", approvedBy: "Dr. Meera Joshi" },
  { id: "PO-004", poNumber: "PO-2026-0190", supplierId: "SUP-002", supplierName: "Ethicon India Pvt Ltd", orderDate: "2026-07-19", expectedDelivery: "2026-08-02", status: "Draft", totalAmount: 55500, gstAmount: 6660, grandTotal: 62160, items: [
    { name: "Absorbable Sutures 3-0", quantity: 300, unitPrice: 185, total: 55500, gstRate: 12 },
  ], createdBy: "Suresh Patil" },
];
/* ------------------------------------------------------------------ */
/* Suppliers                                                            */
/* ------------------------------------------------------------------ */

export const SUPPLIERS: Supplier[] = [
  { id: "SUP-001", name: "Hindustan Syringes & Medical Devices Pvt Ltd", gstin: "06AAACH7409R1ZZ", contactPerson: "Rajesh Gupta", phone: "+91 124 234 5678", email: "orders@hsmd.co.in", address: "Plot 12, Sector 24", city: "Gurugram", state: "Haryana", rating: 4.5, leadTimeDays: 7, paymentTerms: "30 Days", totalOrders: 24, onTimeDelivery: 92, qualityScore: 96, status: "Active", categories: ["Syringes", "Needles", "Blood Collection"] },
  { id: "SUP-002", name: "Ethicon India Pvt Ltd", gstin: "27AAACE1234M1Z5", contactPerson: "Priya Sharma", phone: "+91 22 4567 8900", email: "healthcare@ethicon.co.in", address: "5th Floor, Marathon Futurex", city: "Mumbai", state: "Maharashtra", rating: 4.8, leadTimeDays: 10, paymentTerms: "45 Days", totalOrders: 18, onTimeDelivery: 89, qualityScore: 98, status: "Active", categories: ["Sutures", "Surgical Mesh", "Staplers"] },
  { id: "SUP-003", name: "GE Healthcare India Pvt Ltd", gstin: "29AABCG1234N1Z8", contactPerson: "Anil Mehta", phone: "+91 80 6789 0123", email: "orders@gehealthcare.co.in", address: "2nd Floor, Prestige Tech Park", city: "Bengaluru", state: "Karnataka", rating: 4.6, leadTimeDays: 12, paymentTerms: "30 Days", totalOrders: 15, onTimeDelivery: 87, qualityScore: 95, status: "Active", categories: ["Diagnostics", "Contrast Media", "Imaging Equipment"] },
  { id: "SUP-004", name: "BD India Pvt Ltd", gstin: "06AADCB5678P1Z2", contactPerson: "Sanjay Kulkarni", phone: "+91 124 456 7890", email: "medical.india@bd.com", address: "Tower B, Paras Downtown", city: "Gurugram", state: "Haryana", rating: 4.7, leadTimeDays: 8, paymentTerms: "30 Days", totalOrders: 32, onTimeDelivery: 94, qualityScore: 97, status: "Active", categories: ["IV Cannulas", "Blood Collection", "Syringes"] },
  { id: "SUP-005", name: "3M India Ltd", gstin: "29AABCM9012Q1Z4", contactPerson: "Deepak Verma", phone: "+91 80 2345 6789", email: "healthcare@3mindia.co.in", address: "4th Floor, Bagmane Tech Park", city: "Bengaluru", state: "Karnataka", rating: 4.4, leadTimeDays: 9, paymentTerms: "30 Days", totalOrders: 12, onTimeDelivery: 91, qualityScore: 94, status: "Active", categories: ["PPE", "Masks", "Wound Care"] },
];
/* ------------------------------------------------------------------ */
/* GRN Records                                                          */
/* ------------------------------------------------------------------ */

export const GRN_RECORDS: GRNRecord[] = [
  { id: "GRN-001", grnNumber: "GRN-2026-0089", poNumber: "PO-2026-0188", supplierName: "BD India Pvt Ltd", receivedDate: "2026-07-22", receivedBy: "Neha Deshpande", status: "Accepted", inspectionResult: "Pass", totalItems: 12000, acceptedItems: 12000, rejectedItems: 0, batches: [
    { batchNumber: "BD-2026-0718", expiryDate: "2029-07-18", quantity: 8000, manufacturingDate: "2026-01-18" },
    { batchNumber: "BD-2026-0719", expiryDate: "2029-07-19", quantity: 4000, manufacturingDate: "2026-01-19" },
  ], remarks: "All items passed visual and dimensional inspection" },
  { id: "GRN-002", grnNumber: "GRN-2026-0090", poNumber: "PO-2026-0187", supplierName: "Hindustan Syringes & Medical Devices", receivedDate: "2026-07-23", receivedBy: "Suresh Patil", status: "Pending Inspection", inspectionResult: "Pending", totalItems: 10000, acceptedItems: 0, rejectedItems: 0, batches: [
    { batchNumber: "HS-2026-0722", expiryDate: "2029-07-22", quantity: 10000, manufacturingDate: "2026-01-22" },
  ], remarks: "Awaiting QC inspection" },
];

/* ------------------------------------------------------------------ */
/* Batch Records                                                        */
/* ------------------------------------------------------------------ */

export const BATCH_RECORDS: BatchRecord[] = [
  { id: "BT-001", batchNumber: "HS-2026-0715", itemName: "Disposable Syringe 5ml", itemId: "SI-001", manufacturer: "Hindustan Syringes & Medical Devices", manufacturingDate: "2026-01-15", expiryDate: "2029-01-15", quantity: 15000, remainingQuantity: 12400, unitCost: 3.50, status: "Valid", fefoCompliant: true, storageLocation: "Central Store - Rack A1" },
  { id: "BT-002", batchNumber: "BD-2026-0710", itemName: "IV Cannula 20G", itemId: "SI-002", manufacturer: "BD India Pvt Ltd", manufacturingDate: "2026-01-10", expiryDate: "2029-01-10", quantity: 10000, remainingQuantity: 8200, unitCost: 8.75, status: "Valid", fefoCompliant: true, storageLocation: "Central Store - Rack A2" },
  { id: "BT-003", batchNumber: "3M-2026-0615", itemName: "N95 Respirator Mask", itemId: "SI-004", manufacturer: "3M India Ltd", manufacturingDate: "2025-06-15", expiryDate: "2027-06-15", quantity: 5000, remainingQuantity: 0, unitCost: 45.00, status: "Expired", fefoCompliant: true, storageLocation: "Central Store - Rack B2" },
  { id: "BT-004", batchNumber: "GE-2026-0708", itemName: "Contrast Media (Omnipaque 350)", itemId: "SI-013", manufacturer: "GE Healthcare India", manufacturingDate: "2025-07-08", expiryDate: "2027-07-08", quantity: 60, remainingQuantity: 42, unitCost: 2800.00, status: "Near Expiry", fefoCompliant: true, storageLocation: "Radiology Store - Rack I1" },
];
/* ------------------------------------------------------------------ */
/* Stock Transfers                                                      */
/* ------------------------------------------------------------------ */

export const STOCK_TRANSFERS: StockTransfer[] = [
  { id: "ST-001", transferNumber: "TRF-2026-0021", fromStore: "Central Store", toStore: "Operation Theater", transferDate: "2026-07-22", status: "Received", items: [
    { name: "Surgical Gloves (Powder-Free)", quantity: 2000, batchNumber: "TG-2026-0701" },
    { name: "Absorbable Sutures 3-0", quantity: 50, batchNumber: "ET-2026-0708" },
  ], initiatedBy: "Neha Deshpande", receivedBy: "Suresh Patil", remarks: "Routine OT replenishment" },
  { id: "ST-002", transferNumber: "TRF-2026-0022", fromStore: "Central Store", toStore: "ICU", transferDate: "2026-07-23", status: "In Transit", items: [
    { name: "Disposable Syringe 5ml", quantity: 3000, batchNumber: "HS-2026-0715" },
    { name: "IV Cannula 20G", quantity: 1500, batchNumber: "BD-2026-0710" },
  ], initiatedBy: "Neha Deshpande", remarks: "ICU monthly replenishment" },
];

/* ------------------------------------------------------------------ */
/* Cycle Count                                                          */
/* ------------------------------------------------------------------ */

export const CYCLE_COUNTS: CycleCount[] = [
  { id: "CC-001", countNumber: "CC-2026-0012", scheduledDate: "2026-07-25", store: "Central Store", countedBy: "Neha Deshpande", status: "Scheduled", totalItems: 13, matchedItems: 0, varianceItems: 0, accuracyPercent: 0 },
];

/* ------------------------------------------------------------------ */
/* Asset Records                                                        */
/* ------------------------------------------------------------------ */

export const ASSET_RECORDS: AssetRecord[] = [
  { id: "AST-001", assetTag: "MER-VENT-001", name: "Hamilton G5 Ventilator", category: "Ventilator", manufacturer: "Hamilton Medical", model: "G5", serialNumber: "SN-HAM-2023-4521", purchaseDate: "2023-03-15", purchaseCost: 2850000, currentValue: 2137500, depreciationMethod: "Straight Line 25%", warrantyExpiry: "2028-03-15", location: "ICU - Bed 01", department: "ICU", status: "Active", lastServiceDate: "2026-07-01", nextServiceDate: "2026-08-01", assignedTo: "Dr. Imran Sheikh" },
  { id: "AST-002", assetTag: "MER-MON-001", name: "Philips MX800 Patient Monitor", category: "Monitor", manufacturer: "Philips Healthcare", model: "MX800", serialNumber: "SN-PHI-2024-1187", purchaseDate: "2024-01-10", purchaseCost: 485000, currentValue: 436500, depreciationMethod: "Straight Line 20%", warrantyExpiry: "2029-01-10", location: "ICU - Bed 01", department: "ICU", status: "Active", lastServiceDate: "2026-07-01", nextServiceDate: "2026-10-01", assignedTo: "ICU Nursing" },
  { id: "AST-003", assetTag: "MER-CARM-001", name: "Siemens Cios Alpha C-arm", category: "C-arm", manufacturer: "Siemens Healthineers", model: "Cios Alpha", serialNumber: "SN-SIE-2022-8834", purchaseDate: "2022-08-20", purchaseCost: 6500000, currentValue: 4550000, depreciationMethod: "Straight Line 20%", warrantyExpiry: "2027-08-20", location: "OT - Room 1", department: "Operation Theater", status: "Active", lastServiceDate: "2026-06-15", nextServiceDate: "2026-09-15" },
  { id: "AST-004", assetTag: "MER-CT-001", name: "GE Revolution CT Scanner", category: "CT Scanner", manufacturer: "GE Healthcare", model: "Revolution", serialNumber: "SN-GE-2021-5567", purchaseDate: "2021-06-10", purchaseCost: 12000000, currentValue: 7200000, depreciationMethod: "Straight Line 20%", warrantyExpiry: "2026-06-10", location: "Radiology - CT Suite", department: "Radiology", status: "Active", lastServiceDate: "2026-05-20", nextServiceDate: "2026-08-20" },
  { id: "AST-005", assetTag: "MER-MRI-001", name: "Siemens Magnetom Aera MRI", category: "MRI", manufacturer: "Siemens Healthineers", model: "Magnetom Aera 1.5T", serialNumber: "SN-SIE-2020-3321", purchaseDate: "2020-11-05", purchaseCost: 22000000, currentValue: 13200000, depreciationMethod: "Straight Line 20%", warrantyExpiry: "2025-11-05", location: "Radiology - MRI Suite", department: "Radiology", status: "Under Maintenance", lastServiceDate: "2026-07-15", nextServiceDate: "2026-07-25" },
];

/* ------------------------------------------------------------------ */
/* Alerts                                                               */
/* ------------------------------------------------------------------ */

export const ALERTS: AlertItem[] = [
  { id: "ALT-001", type: "Low Stock", severity: "High", title: "Surgical Gloves below reorder level", description: "Current stock 4,200 pairs against reorder level of 15,000. Immediate procurement required.", timestamp: "2026-07-23 08:00", acknowledged: false, itemId: "SI-003", itemName: "Surgical Gloves (Powder-Free)" },
  { id: "ALT-002", type: "Out of Stock", severity: "Critical", title: "N95 Respirator Mask - OUT OF STOCK", description: "Zero stock of N95 masks. Critical PPE item. Emergency procurement initiated.", timestamp: "2026-07-23 07:45", acknowledged: false, itemId: "SI-004", itemName: "N95 Respirator Mask" },
  { id: "ALT-003", type: "Near Expiry", severity: "Medium", title: "Contrast Media expiring in 12 months", description: "Batch GE-2026-0708 of Omnipaque 350 expires on 2027-07-08. 42 vials remaining.", timestamp: "2026-07-23 07:30", acknowledged: false, itemId: "SI-013", itemName: "Contrast Media (Omnipaque 350)" },
  { id: "ALT-004", type: "Pending Approval", severity: "High", title: "Urgent requisition pending approval", description: "REQ-2026-0042 for OT implants worth Rs 2,39,000 awaiting HOD approval.", timestamp: "2026-07-22 16:00", acknowledged: false, itemId: "PR-002" },
  { id: "ALT-005", type: "Delayed Delivery", severity: "Medium", title: "PO-2026-0189 delivery delayed", description: "GE Healthcare order for ECG electrodes delayed by 3 days. Expected 2026-08-02.", timestamp: "2026-07-22 10:00", acknowledged: true },
  { id: "ALT-006", type: "Maintenance Due", severity: "Low", title: "MRI scanner preventive maintenance due", description: "Siemens Magnetom Aera scheduled for PM on 2026-07-25. Vendor engineer confirmed.", timestamp: "2026-07-21 14:00", acknowledged: true, itemId: "AST-005", itemName: "Siemens Magnetom Aera MRI" },
  { id: "ALT-007", type: "Low Stock", severity: "High", title: "Ortho Implants below minimum", description: "Dynamic Hip Screw sets at 8 against minimum 10. Surgical cases at risk.", timestamp: "2026-07-23 06:30", acknowledged: false, itemId: "SI-011", itemName: "Ortho Implant - Dynamic Hip Screw" },
];

/* ------------------------------------------------------------------ */
/* Audit Logs                                                           */
/* ------------------------------------------------------------------ */

export const AUDIT_LOGS: AuditEntry[] = [
  { id: "AUD-INV-001", timestamp: "2026-07-23 08:00:00", user: "Neha Deshpande", role: "Store Manager", action: "Stock Check", detail: "Low stock alert triggered for Surgical Gloves. Current: 4,200, Reorder: 15,000.", ipAddress: "10.0.5.101" },
  { id: "AUD-INV-002", timestamp: "2026-07-22 16:30:00", user: "Suresh Patil", role: "OT Coordinator", action: "Requisition Created", detail: "REQ-2026-0042 raised for OT implants. Urgent priority. Estimated Rs 2,39,000.", ipAddress: "10.0.5.102" },
  { id: "AUD-INV-003", timestamp: "2026-07-22 14:00:00", user: "Neha Deshpande", role: "Store Manager", action: "GRN Completed", detail: "GRN-2026-0089 completed. BD India - 12,000 IV Cannulas accepted. All passed inspection.", ipAddress: "10.0.5.101" },
  { id: "AUD-INV-004", timestamp: "2026-07-22 10:15:00", user: "Neha Deshpande", role: "Store Manager", action: "PO Approved", detail: "PO-2026-0189 approved for GE Healthcare. ECG Electrodes + Contrast Media. Rs 1,32,160.", ipAddress: "10.0.5.101" },
  { id: "AUD-INV-005", timestamp: "2026-07-21 09:00:00", user: "Ravi Kumar", role: "Lab Supervisor", action: "Requisition Fulfilled", detail: "REQ-2026-0044 fulfilled. 500 Blood Collection Tubes issued to Laboratory.", ipAddress: "10.0.5.103" },
  { id: "AUD-INV-006", timestamp: "2026-07-20 15:00:00", user: "Neha Deshpande", role: "Store Manager", action: "Stock Transfer", detail: "TRF-2026-0021 completed. Surgical Gloves + Sutures transferred to OT.", ipAddress: "10.0.5.101" },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                              */
/* ------------------------------------------------------------------ */

export function poStatusTone(s: POStatus): "success" | "warning" | "danger" | "info" | "brand" | "neutral" {
  switch (s) {
    case "Received": return "success";
    case "Partially Received": return "warning";
    case "Approved": return "brand";
    case "Sent to Supplier": return "info";
    case "Submitted": return "info";
    case "Draft": return "neutral";
    case "Cancelled": return "danger";
    default: return "neutral";
  }
}

export function grnStatusTone(s: GRNStatus): "success" | "warning" | "danger" | "info" | "brand" {
  switch (s) {
    case "Accepted": return "success";
    case "Rejected": return "danger";
    case "Partial Accept": return "warning";
    case "On Hold": return "warning";
    case "Pending Inspection": return "info";
    default: return "info";
  }
}

export function itemStatusTone(s: ItemStatus): "success" | "warning" | "danger" | "info" | "neutral" {
  switch (s) {
    case "In Stock": return "success";
    case "Low Stock": return "warning";
    case "Out of Stock": return "danger";
    case "Reserved": return "info";
    case "Expired": return "danger";
    case "Quarantine": return "warning";
    default: return "neutral";
  }
}

export function transferStatusTone(s: TransferStatus): "success" | "warning" | "danger" | "info" {
  switch (s) {
    case "Received": return "success";
    case "In Transit": return "warning";
    case "Initiated": return "info";
    case "Cancelled": return "danger";
    default: return "info";
  }
}

export function expiryStatusTone(s: ExpiryStatus): "success" | "warning" | "danger" {
  switch (s) {
    case "Valid": return "success";
    case "Near Expiry": return "warning";
    case "Expired": return "danger";
    default: return "success";
  }
}

export function formatINR(amount: number): string {
  return "Rs " + amount.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}
