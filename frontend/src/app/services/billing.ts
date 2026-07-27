import { api, buildQuery } from "./api";

export interface Invoice {
  _id: string;
  invoiceNumber: string;
  patient: { _id: string; firstName: string; lastName: string; uhid: string };
  admission?: string;
  items: { description: string; category: string; quantity: number; unitPrice: number; total: number }[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: string;
  paymentMethod?: string;
  paidAt?: string;
  createdAt: string;
}

export interface Payment {
  _id: string;
  invoice: string;
  amount: number;
  method: string;
  reference?: string;
  receivedBy?: string;
  createdAt: string;
}

export interface BillingFilters {
  status?: string;
  patient?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export const billingApi = {
  listInvoices: (filters?: BillingFilters) =>
    api.get<Invoice[]>(`/billing/invoices${buildQuery(filters || {})}`),

  getInvoice: (id: string) => api.get<Invoice>(`/billing/invoices/${id}`),

  createInvoice: (data: { patientId: string; admissionId?: string; items: Invoice["items"] }) =>
    api.post<Invoice>("/billing/invoices", data),

  updateInvoice: (id: string, data: Partial<Invoice>) =>
    api.put<Invoice>(`/billing/invoices/${id}`, data),

  voidInvoice: (id: string, reason: string) =>
    api.patch(`/billing/invoices/${id}/void`, { reason }),

  addPayment: (invoiceId: string, data: { amount: number; method: string; reference?: string }) =>
    api.post<Payment>(`/billing/invoices/${invoiceId}/payments`, data),

  getPayments: (invoiceId: string) =>
    api.get<Payment[]>(`/billing/invoices/${invoiceId}/payments`),

  generateHibo: (id: string) =>
    api.get(`/billing/invoices/${id}/hibo`),

  stats: () => api.get("/billing/stats"),
};
