// SokoPulse AI - API Client
// Connects to Node/Express backend on port 5000 with automatic fallback to local mock data.

const API_BASE_URL = "http://localhost:5000/api";

async function safeFetch<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T | null> {
  try {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("sokopulse_token")
        : null;
    const authHeaders: Record<string, string> = {};
    if (token) {
      authHeaders["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
        ...(options?.headers || {}),
      },
    });

    if (res.status === 401 || res.status === 403) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("sokopulse_token");
        window.dispatchEvent(new Event("auth-expired"));
      }
    }

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return (await res.json()) as T;
  } catch (error) {
    // Graceful fallback logger
    console.warn(
      `Backend connection failed for endpoint ${endpoint}. SokoPulse is running in standalone mock mode.`,
      error,
    );
    return null;
  }
}

export const apiClient = {
  // Auth
  login: async (credentials: any) =>
    safeFetch<any>("/auth/login/", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),
  register: async (userData: any) =>
    safeFetch<any>("/auth/register/", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  // KPIs
  getKPIs: async () => safeFetch<any>("/dashboard/kpis/"),

  // Products
  getProducts: async () => safeFetch<any[]>("/products/"),
  updateProduct: async (id: string, data: any) =>
    safeFetch<any>(`/products/${id}/`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  restockProduct: async (id: string) =>
    safeFetch<any>(`/products/${id}/restock/`, {
      method: "POST",
    }),

  // Competitors
  getCompetitors: async () => safeFetch<any>("/competitors/"),
  triggerCompetitorScrape: async (industry?: string, currency?: string, competitors?: string[]) =>
    safeFetch<any>("/competitors/", {
      method: "POST",
      body: JSON.stringify({ industry, currency, competitors }),
    }),

  // Forecasting
  getForecasting: async () => safeFetch<any>("/forecasting/"),

  // Dynamic Pricing
  getPricing: async () => safeFetch<any[]>("/pricing/"),
  getRecommendations: async () => safeFetch<any[]>("/recommendations/"),
  updateRecommendationStatus: async (
    id: string,
    status: string,
    overrideData?: any,
  ) =>
    safeFetch<any>(`/recommendations/${id}/update_status/`, {
      method: "PUT",
      body: JSON.stringify({ status, ...overrideData }),
    }),

  // Procurement
  getProcurement: async () => safeFetch<any[]>("/procurement/"),
  getPurchaseOrders: async () => safeFetch<any[]>("/purchase-orders/"),
  createPurchaseOrder: async (data: any) =>
    safeFetch<any>("/purchase-orders/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Sales
  getSales: async () => safeFetch<any[]>("/sales/"),

  // Inventory
  getInventory: async () => safeFetch<any[]>("/inventory/"),

  // Suppliers
  getSuppliers: async () => safeFetch<any[]>("/suppliers/"),

  // Alerts
  getAlerts: async () => safeFetch<any[]>("/alerts/"),
  resolveAlert: async (id: string, resolved: boolean) =>
    safeFetch<any>(`/alerts/${id}/resolve/`, {
      method: "PUT",
      body: JSON.stringify({ resolved }),
    }),
  simulateAlert: async () =>
    safeFetch<any>("/alerts/simulate/", {
      method: "POST",
    }),

  // Settings
  updateIndustry: async (industry: string, currency: string, competitors?: string[]) =>
    safeFetch<any>("/settings/industry/", {
      method: "POST",
      body: JSON.stringify({ industry, currency, competitors }),
    }),
};
