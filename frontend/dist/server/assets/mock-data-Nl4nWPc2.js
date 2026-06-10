const kpis = {
  inventoryValue: 4281090,
  turnover: 8.4,
  stockOutRisk: 14,
  overstocked: 23,
  predictedRevenue: 1842e3,
  aiConfidence: 94.2,
  activeSuppliers: 82,
  competitorsMonitored: 47
};
const salesTrend = [
  { month: "Jan", sales: 142e3, forecast: 138e3 },
  { month: "Feb", sales: 158e3, forecast: 161e3 },
  { month: "Mar", sales: 171e3, forecast: 168e3 },
  { month: "Apr", sales: 165e3, forecast: 172e3 },
  { month: "May", sales: 189e3, forecast: 184e3 },
  { month: "Jun", sales: 204e3, forecast: 198e3 },
  { month: "Jul", sales: 221e3, forecast: 218e3 },
  { month: "Aug", sales: 238e3, forecast: 235e3 },
  { month: "Sep", sales: 251e3, forecast: 248e3 }
];
const demandForecast = [
  { week: "W1", actual: 420, forecast: 410, upper: 460, lower: 360 },
  { week: "W2", actual: 480, forecast: 475, upper: 525, lower: 425 },
  { week: "W3", actual: 510, forecast: 520, upper: 570, lower: 470 },
  { week: "W4", actual: 545, forecast: 560, upper: 610, lower: 510 },
  { week: "W5", actual: 612, forecast: 600, upper: 650, lower: 550 },
  { week: "W6", actual: 0, forecast: 640, upper: 700, lower: 580 },
  { week: "W7", actual: 0, forecast: 685, upper: 745, lower: 625 },
  { week: "W8", actual: 0, forecast: 720, upper: 790, lower: 650 }
];
const revenueByCategory = [
  { category: "Electronics", revenue: 482e3 },
  { category: "Apparel", revenue: 312e3 },
  { category: "Home", revenue: 268e3 },
  { category: "Beauty", revenue: 191e3 },
  { category: "Sports", revenue: 154e3 },
  { category: "Foods", revenue: 128e3 }
];
const inventoryDistribution = [
  { name: "Electronics", value: 38, color: "var(--color-primary)" },
  { name: "Apparel", value: 22, color: "var(--color-accent)" },
  { name: "Home Goods", value: 18, color: "var(--color-info)" },
  { name: "Beauty", value: 12, color: "var(--color-success)" },
  { name: "Sports", value: 10, color: "var(--color-warning)" }
];
const competitorPrices = [
  {
    day: "Mon",
    us: 1199,
    competitorA: 1249,
    competitorB: 1179,
    competitorC: 1225
  },
  {
    day: "Tue",
    us: 1199,
    competitorA: 1239,
    competitorB: 1185,
    competitorC: 1220
  },
  {
    day: "Wed",
    us: 1189,
    competitorA: 1239,
    competitorB: 1195,
    competitorC: 1219
  },
  {
    day: "Thu",
    us: 1189,
    competitorA: 1259,
    competitorB: 1199,
    competitorC: 1230
  },
  {
    day: "Fri",
    us: 1199,
    competitorA: 1269,
    competitorB: 1210,
    competitorC: 1245
  },
  {
    day: "Sat",
    us: 1209,
    competitorA: 1289,
    competitorB: 1225,
    competitorC: 1252
  },
  {
    day: "Sun",
    us: 1219,
    competitorA: 1299,
    competitorB: 1230,
    competitorC: 1265
  }
];
const insights = [
  {
    id: "i1",
    title: "Restock Apex-9 Sensors",
    detail: "Increase stock for Apex-9 Optical Sensors by 22% to avoid regional stock-out in 4 days.",
    priority: "critical",
    confidence: 98,
    action: "Trigger Replenishment"
  },
  {
    id: "i2",
    title: "Pricing Opportunity Detected",
    detail: "Competitor 'GlobalLogix' raised prices on Module MK-4. Recommended margin adjustment: +4.5%.",
    priority: "high",
    confidence: 84,
    action: "Apply Pricing"
  },
  {
    id: "i3",
    title: "Slow-mover Liquidation",
    detail: "Ceramic Capacitors are overstocked by 38%. Consider a 12% promotional discount this week.",
    priority: "medium",
    confidence: 76,
    action: "Schedule Promotion"
  },
  {
    id: "i4",
    title: "Supplier Diversification",
    detail: "Single-source risk detected for Titan Castings. Add a secondary supplier within 14 days.",
    priority: "high",
    confidence: 89,
    action: "Review Suppliers"
  }
];
const products = [
  {
    id: "p1",
    name: "Apex-9 Optical Sensor",
    sku: "APX-901-ZH",
    category: "Electronics",
    stock: 14,
    reorderPoint: 120,
    expiry: "2026-12-01",
    status: "critical",
    supplier: "Nexus Supply",
    price: 1199
  },
  {
    id: "p2",
    name: "Titan Grade Castings",
    sku: "TTN-441-B",
    category: "Industrial",
    stock: 142,
    reorderPoint: 200,
    expiry: "2027-03-15",
    status: "low",
    supplier: "Iron Bridge Co.",
    price: 89
  },
  {
    id: "p3",
    name: "Neural Engine Core v2",
    sku: "NRC-990-X",
    category: "Electronics",
    stock: 890,
    reorderPoint: 250,
    expiry: "2027-08-20",
    status: "healthy",
    supplier: "Quantum Foundry",
    price: 2450
  },
  {
    id: "p4",
    name: "Ceramic Capacitor 220uF",
    sku: "CRC-220-A",
    category: "Electronics",
    stock: 85e3,
    reorderPoint: 12e3,
    expiry: "2028-01-10",
    status: "overstocked",
    supplier: "ChipWorks Ltd",
    price: 0.42
  },
  {
    id: "p5",
    name: "Lithium Cell Mod-8",
    sku: "LTM-008-K",
    category: "Power",
    stock: 38,
    reorderPoint: 150,
    expiry: "2026-09-01",
    status: "critical",
    supplier: "VoltCore Industries",
    price: 78
  },
  {
    id: "p6",
    name: "Flex-Cable Assembly",
    sku: "FCA-220-G",
    category: "Electronics",
    stock: 2400,
    reorderPoint: 800,
    expiry: "2027-05-22",
    status: "healthy",
    supplier: "Nexus Supply",
    price: 14
  },
  {
    id: "p7",
    name: "Solar-X Panel 400W",
    sku: "SLX-400-P",
    category: "Energy",
    stock: 64,
    reorderPoint: 100,
    expiry: "2030-01-01",
    status: "low",
    supplier: "SunGrid Co.",
    price: 489
  },
  {
    id: "p8",
    name: "Quantum Processor X2",
    sku: "QPX-002-R",
    category: "Electronics",
    stock: 1240,
    reorderPoint: 300,
    expiry: "2028-02-14",
    status: "healthy",
    supplier: "Quantum Foundry",
    price: 3299
  },
  {
    id: "p9",
    name: "Carbon Fiber Sheet",
    sku: "CFS-100-M",
    category: "Materials",
    stock: 5,
    reorderPoint: 40,
    expiry: "2029-06-01",
    status: "critical",
    supplier: "Iron Bridge Co.",
    price: 320
  },
  {
    id: "p10",
    name: "Smart Hub Z-Wave",
    sku: "SHZ-001-W",
    category: "IoT",
    stock: 612,
    reorderPoint: 250,
    expiry: "2027-10-30",
    status: "healthy",
    supplier: "Nexus Supply",
    price: 149
  }
];
const competitors = [
  {
    id: "c1",
    name: "GlobalLogix",
    marketShare: 28,
    avgPrice: 1289,
    trend: "up",
    monitored: 142
  },
  {
    id: "c2",
    name: "Nexus Supply Pro",
    marketShare: 19,
    avgPrice: 1199,
    trend: "flat",
    monitored: 98
  },
  {
    id: "c3",
    name: "Apex Trading Co.",
    marketShare: 14,
    avgPrice: 1232,
    trend: "up",
    monitored: 76
  },
  {
    id: "c4",
    name: "Meridian Imports",
    marketShare: 11,
    avgPrice: 1156,
    trend: "down",
    monitored: 54
  }
];
const alerts = [
  {
    id: "a1",
    title: "Predicted stock-out: Apex-9 Sensors",
    description: "Inventory will reach zero in approximately 4 days at current burn rate.",
    severity: "critical",
    time: "12 min ago",
    category: "Inventory",
    resolved: false
  },
  {
    id: "a2",
    title: "Competitor price drop detected",
    description: "Meridian Imports dropped Solar-X pricing by 6.2%.",
    severity: "high",
    time: "1 hr ago",
    category: "Pricing",
    resolved: false
  },
  {
    id: "a3",
    title: "Supplier delay: VoltCore",
    description: "Order #PO-22183 delayed by 3 days due to customs hold.",
    severity: "high",
    time: "3 hr ago",
    category: "Supplier",
    resolved: false
  },
  {
    id: "a4",
    title: "Demand spike: Smart Hub Z-Wave",
    description: "Sales velocity +43% over 7-day rolling average.",
    severity: "medium",
    time: "5 hr ago",
    category: "Demand",
    resolved: false
  },
  {
    id: "a5",
    title: "Expiring products in 30 days",
    description: "12 SKUs in Beauty category approaching expiry window.",
    severity: "medium",
    time: "Yesterday",
    category: "Inventory",
    resolved: false
  },
  {
    id: "a6",
    title: "Overstock threshold exceeded",
    description: "Ceramic Capacitors 220uF: 708% of optimal stock level.",
    severity: "low",
    time: "Yesterday",
    category: "Inventory",
    resolved: true
  }
];
const suppliers = [
  {
    id: "s1",
    name: "Nexus Supply",
    reliability: 96,
    leadTime: 4,
    activeOrders: 12,
    country: "Singapore",
    status: "active"
  },
  {
    id: "s2",
    name: "Iron Bridge Co.",
    reliability: 88,
    leadTime: 9,
    activeOrders: 6,
    country: "Germany",
    status: "active"
  },
  {
    id: "s3",
    name: "Quantum Foundry",
    reliability: 99,
    leadTime: 6,
    activeOrders: 8,
    country: "Taiwan",
    status: "active"
  },
  {
    id: "s4",
    name: "ChipWorks Ltd",
    reliability: 81,
    leadTime: 12,
    activeOrders: 4,
    country: "South Korea",
    status: "delayed"
  },
  {
    id: "s5",
    name: "VoltCore Industries",
    reliability: 74,
    leadTime: 14,
    activeOrders: 3,
    country: "China",
    status: "delayed"
  },
  {
    id: "s6",
    name: "SunGrid Co.",
    reliability: 92,
    leadTime: 7,
    activeOrders: 5,
    country: "USA",
    status: "active"
  }
];
const pricingItems = [
  {
    id: "pr1",
    product: "Apex-9 Optical Sensor",
    currentPrice: 1199,
    recommendedPrice: 1259,
    competitorAvg: 1248,
    margin: 32,
    expectedImpact: 4.8
  },
  {
    id: "pr2",
    product: "Smart Hub Z-Wave",
    currentPrice: 149,
    recommendedPrice: 159,
    competitorAvg: 162,
    margin: 41,
    expectedImpact: 6.4
  },
  {
    id: "pr3",
    product: "Solar-X Panel 400W",
    currentPrice: 489,
    recommendedPrice: 469,
    competitorAvg: 462,
    margin: 24,
    expectedImpact: -2.1
  },
  {
    id: "pr4",
    product: "Neural Engine Core v2",
    currentPrice: 2450,
    recommendedPrice: 2520,
    competitorAvg: 2495,
    margin: 38,
    expectedImpact: 3.2
  },
  {
    id: "pr5",
    product: "Flex-Cable Assembly",
    currentPrice: 14,
    recommendedPrice: 15,
    competitorAvg: 15.2,
    margin: 52,
    expectedImpact: 1.9
  }
];
const procurementItems = [
  {
    id: "pc1",
    product: "Apex-9 Optical Sensor",
    qty: 240,
    supplier: "Nexus Supply",
    leadTime: 4,
    cost: 287760,
    urgency: "critical",
    reason: "Predicted stock-out in 4 days; current burn 4.2/day vs 14 on hand."
  },
  {
    id: "pc2",
    product: "Lithium Cell Mod-8",
    qty: 400,
    supplier: "VoltCore Industries",
    leadTime: 14,
    cost: 31200,
    urgency: "critical",
    reason: "Stock at 25% of reorder point; supplier lead time is long, order now."
  },
  {
    id: "pc3",
    product: "Carbon Fiber Sheet",
    qty: 60,
    supplier: "Iron Bridge Co.",
    leadTime: 9,
    cost: 19200,
    urgency: "high",
    reason: "5 units in stock vs 40 reorder point; production demand rising."
  },
  {
    id: "pc4",
    product: "Titan Grade Castings",
    qty: 180,
    supplier: "Iron Bridge Co.",
    leadTime: 9,
    cost: 16020,
    urgency: "medium",
    reason: "Approaching reorder point in 11 days; consolidate with carbon order."
  }
];
const getCurrencySymbol = () => {
  if (typeof window !== "undefined") {
    const curr = localStorage.getItem("sokopulse_currency") || "USD";
    return curr === "KES" ? "KES " : "$";
  }
  return "$";
};
const getCurrencyRate = () => {
  if (typeof window !== "undefined") {
    const curr = localStorage.getItem("sokopulse_currency") || "USD";
    return curr === "KES" ? 130 : 1;
  }
  return 1;
};
const formatPrice = (n, decimals = 2) => {
  const symbol = getCurrencySymbol();
  const rate = getCurrencyRate();
  const val = n * rate;
  return `${symbol}${val.toLocaleString(void 0, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
};
const fmtCurrency = (n) => {
  const symbol = getCurrencySymbol();
  const rate = getCurrencyRate();
  const val = n * rate;
  if (val >= 1e6) {
    return `${symbol}${(val / 1e6).toFixed(2)}M`;
  }
  if (val >= 1e3) {
    return `${symbol}${(val / 1e3).toFixed(1)}K`;
  }
  return `${symbol}${val.toFixed(0)}`;
};
export {
  fmtCurrency as a,
  pricingItems as b,
  products as c,
  demandForecast as d,
  salesTrend as e,
  formatPrice as f,
  competitors as g,
  competitorPrices as h,
  alerts as i,
  insights as j,
  kpis as k,
  inventoryDistribution as l,
  getCurrencySymbol as m,
  getCurrencyRate as n,
  procurementItems as p,
  revenueByCategory as r,
  suppliers as s
};
