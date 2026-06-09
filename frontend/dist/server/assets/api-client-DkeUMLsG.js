const API_BASE_URL = "http://localhost:5000/api";
async function safeFetch(endpoint, options) {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("sokopulse_token") : null;
    const authHeaders = {};
    if (token) {
      authHeaders["Authorization"] = `Bearer ${token}`;
    }
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
        ...options?.headers || {}
      }
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.warn(`Backend connection failed for endpoint ${endpoint}. SokoPulse is running in standalone mock mode.`, error);
    return null;
  }
}
const apiClient = {
  // KPIs
  getKPIs: async () => safeFetch("/dashboard/kpis/"),
  // Products
  getProducts: async () => safeFetch("/products"),
  updateProduct: async (id, data) => safeFetch(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  }),
  restockProduct: async (id) => safeFetch(`/products/${id}/restock`, {
    method: "POST"
  }),
  // Competitors
  getCompetitors: async () => safeFetch("/competitors/"),
  triggerCompetitorScrape: async () => safeFetch("/competitors/", {
    method: "POST"
  }),
  // Forecasting
  getForecasting: async () => safeFetch("/forecasting"),
  // Dynamic Pricing
  getPricing: async () => safeFetch("/pricing"),
  getRecommendations: async () => safeFetch("/recommendations/"),
  updateRecommendationStatus: async (id, status, overrideData) => safeFetch(`/recommendations/${id}/update_status/`, {
    method: "PUT",
    body: JSON.stringify({ status, ...overrideData })
  }),
  // Procurement
  getProcurement: async () => safeFetch("/procurement"),
  getPurchaseOrders: async () => safeFetch("/purchase-orders/"),
  createPurchaseOrder: async (data) => safeFetch("/purchase-orders/", {
    method: "POST",
    body: JSON.stringify(data)
  }),
  // Sales
  getSales: async () => safeFetch("/sales/"),
  // Inventory
  getInventory: async () => safeFetch("/inventory/"),
  // Suppliers
  getSuppliers: async () => safeFetch("/suppliers/"),
  // Alerts
  getAlerts: async () => safeFetch("/alerts/"),
  resolveAlert: async (id, resolved) => safeFetch(`/alerts/${id}/resolve/`, {
    method: "PUT",
    body: JSON.stringify({ resolved })
  }),
  simulateAlert: async () => safeFetch("/alerts/simulate/", {
    method: "POST"
  })
};
export {
  apiClient as a
};
