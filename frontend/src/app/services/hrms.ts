import { api, buildQuery } from "./api";

export interface Employee {
  _id: string;
  employeeId: string;
  name: string;
  department: string;
  designation: string;
  phone: string;
  email: string;
  joiningDate: string;
  status: string;
  shift?: string;
  leaves?: { total: number; taken: number; balance: number };
}

export interface LeaveRequest {
  _id: string;
  employee: { _id: string; name: string; department: string };
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
  approvedBy?: string;
  createdAt: string;
}

export interface EmployeeFilters {
  search?: string;
  department?: string;
  designation?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export const hrmsApi = {
  listEmployees: (filters?: EmployeeFilters) =>
    api.get<Employee[]>(`/hrms/employees${buildQuery(filters || {})}`),

  getEmployee: (id: string) => api.get<Employee>(`/hrms/employees/${id}`),

  createEmployee: (data: Partial<Employee>) =>
    api.post<Employee>("/hrms/employees", data),

  updateEmployee: (id: string, data: Partial<Employee>) =>
    api.put<Employee>(`/hrms/employees/${id}`, data),

  listLeaves: (filters?: { status?: string; employee?: string; page?: number; limit?: number }) =>
    api.get<LeaveRequest[]>(`/hrms/leaves${buildQuery(filters || {})}`),

  applyLeave: (data: { employeeId: string; type: string; startDate: string; endDate: string; reason: string }) =>
    api.post<LeaveRequest>("/hrms/leaves", data),

  approveLeave: (id: string, approved: boolean, comment?: string) =>
    api.patch(`/hrms/leaves/${id}/approve`, { approved, comment }),

  stats: () => api.get("/hrms/stats"),
};
