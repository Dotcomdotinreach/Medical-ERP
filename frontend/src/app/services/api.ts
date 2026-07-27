const BASE = (import.meta as any).env?.VITE_API_URL ?? "http://localhost:5000/api";

let _accessToken: string | null = null;
let _refreshToken: string | null = null;
let _onUnauthorized: (() => void) | null = null;

export function setTokens(access: string, refresh: string) {
  _accessToken = access;
  _refreshToken = refresh;
  localStorage.setItem("access_token", access);
  localStorage.setItem("refresh_token", refresh);
}

export function loadTokens() {
  _accessToken = localStorage.getItem("access_token");
  _refreshToken = localStorage.getItem("refresh_token");
  return { accessToken: _accessToken, refreshToken: _refreshToken };
}

export function clearTokens() {
  _accessToken = null;
  _refreshToken = null;
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

export function onUnauthorized(cb: () => void) {
  _onUnauthorized = cb;
}

async function refreshAccessToken(): Promise<boolean> {
  if (!_refreshToken) return false;
  try {
    const res = await fetch(`${BASE}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: _refreshToken }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    if (data.success && data.data?.accessToken) {
      _accessToken = data.data.accessToken;
      if (data.data.refreshToken) _refreshToken = data.data.refreshToken;
      localStorage.setItem("access_token", _accessToken);
      if (data.data.refreshToken) localStorage.setItem("refresh_token", data.data.refreshToken);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  pagination?: { total: number; page: number; limit: number; pages: number };
}

async function request<T = any>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${BASE}${path}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (_accessToken) headers["Authorization"] = `Bearer ${_accessToken}`;

  let res = await fetch(url, { ...options, headers });

  if (res.status === 401 && _refreshToken) {
    const ok = await refreshAccessToken();
    if (ok) {
      headers["Authorization"] = `Bearer ${_accessToken}`;
      res = await fetch(url, { ...options, headers });
    }
  }

  if (res.status === 401) {
    clearTokens();
    _onUnauthorized?.();
    throw new Error("Session expired. Please sign in again.");
  }

  const json = await res.json().catch(() => ({ success: false, message: "Network error", data: null }));
  if (!res.ok) throw new Error(json.message || `Request failed (${res.status})`);
  return json;
}

export const api = {
  get: <T = any>(path: string) => request<T>(path, { method: "GET" }),
  post: <T = any>(path: string, body?: any) =>
    request<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined }),
  put: <T = any>(path: string, body?: any) =>
    request<T>(path, { method: "PUT", body: body ? JSON.stringify(body) : undefined }),
  patch: <T = any>(path: string, body?: any) =>
    request<T>(path, { method: "PATCH", body: body ? JSON.stringify(body) : undefined }),
  delete: <T = any>(path: string) => request<T>(path, { method: "DELETE" }),
};

export function buildQuery(params: Record<string, any>): string {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") q.set(k, String(v));
  });
  const s = q.toString();
  return s ? `?${s}` : "";
}
