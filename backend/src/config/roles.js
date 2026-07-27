export const ROLES = {
  super_admin: ["*"],
  admin: ["patient:*", "appointment:*", "encounter:*", "billing:*", "inventory:*", "employee:*", "admin:*"],
  doctor: ["patient:read", "patient:write", "appointment:read", "appointment:write", "encounter:read", "encounter:write", "lab_order:*", "imaging_order:*", "prescription:*"],
  nurse: ["patient:read", "patient:write", "encounter:read", "vitals:write", "medication:write", "task:*"],
  receptionist: ["patient:read", "patient:write", "appointment:read", "appointment:write", "queue:*", "registration:*"],
  pharmacist: ["pharmacy:*", "prescription:read", "prescription:write", "inventory:read", "inventory:write"],
  lab_tech: ["lab_order:read", "lab_order:write", "lab_result:*", "specimen:*"],
  radiologist: ["imaging_order:read", "imaging_order:write", "radiology_report:*"],
  billing: ["billing:*", "invoice:*", "payment:*", "insurance:*"],
  inventory: ["inventory:*", "purchase_order:*", "supplier:*"],
  hr: ["employee:*", "attendance:*", "payroll:*", "leave:*", "training:*"],
};
