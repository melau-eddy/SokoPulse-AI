// Mock data + TS interfaces for SokoPulse AI

export type InventoryStatus = "healthy" | "low" | "overstocked" | "critical";
export type Severity = "critical" | "high" | "medium" | "low";

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  reorderPoint: number;
  expiry: string;
  status: InventoryStatus;
  supplier: string;
  price: number;
}

export interface Insight {
  id: string;
  title: string;
  detail: string;
  priority: Severity;
  confidence: number;
  action: string;
}

export interface Competitor {
  id: string;
  name: string;
  marketShare: number;
  avgPrice: number;
  trend: "up" | "down" | "flat";
  monitored: number;
}

export interface Alert {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  time: string;
  category: string;
  resolved: boolean;
}

export interface Supplier {
  id: string;
  name: string;
  reliability: number;
  leadTime: number;
  activeOrders: number;
  country: string;
  status: "active" | "delayed" | "paused";
}

export interface PricingItem {
  id: string;
  product: string;
  currentPrice: number;
  recommendedPrice: number;
  competitorAvg: number;
  margin: number;
  expectedImpact: number;
  demandElasticity?: string;
  seasonalityFactor?: string;
  supplierCostFactor?: string;
  externalFactor?: string;
  recommendationText?: string;
}

export interface ProcurementItem {
  id: string;
  product: string;
  qty: number;
  supplier: string;
  leadTime: number;
  cost: number;
  urgency: Severity;
  reason: string;
}

export const kpis = {
  inventoryValue: 0,
  turnover: 0,
  stockOutRisk: 0,
  overstocked: 0,
  predictedRevenue: 0,
  aiConfidence: 0,
  activeSuppliers: 0,
  competitorsMonitored: 0,
};

export const salesTrend = [];

export const demandForecast = [];

export const revenueByCategory = [];

export const inventoryDistribution = [];

export const competitorPrices = [];

export const insights: Insight[] = [];

export const products: Product[] = [];

export const competitors: Competitor[] = [];

export const alerts: Alert[] = [];

export const suppliers: Supplier[] = [];

export const pricingItems: PricingItem[] = [];

export const procurementItems: ProcurementItem[] = [];

export const getCurrencySymbol = () => {
  if (typeof window !== "undefined") {
    const curr = localStorage.getItem("sokopulse_currency") || "USD";
    return curr === "KES" ? "KES " : "$";
  }
  return "$";
};

export const getCurrencyRate = () => {
  if (typeof window !== "undefined") {
    const curr = localStorage.getItem("sokopulse_currency") || "USD";
    return curr === "KES" ? 130.0 : 1.0;
  }
  return 1.0;
};

export const formatPrice = (n: number, decimals = 2) => {
  const symbol = getCurrencySymbol();
  const rate = getCurrencyRate();
  const val = n * rate;
  return `${symbol}${val.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
};

export const fmtCurrency = (n: number) => {
  const symbol = getCurrencySymbol();
  const rate = getCurrencyRate();
  const val = n * rate;
  
  if (val >= 1_000_000) {
    return `${symbol}${(val / 1_000_000).toFixed(2)}M`;
  }
  if (val >= 1000) {
    return `${symbol}${(val / 1000).toFixed(1)}K`;
  }
  return `${symbol}${val.toFixed(0)}`;
};

export const fmtNumber = (n: number) =>
  n >= 1_000_000
    ? `${(n / 1_000_000).toFixed(2)}M`
    : n >= 1000
      ? `${(n / 1000).toFixed(1)}K`
      : `${n}`;
