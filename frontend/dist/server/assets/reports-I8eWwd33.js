import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { FileText, Eye, FileType, FileSpreadsheet, Download, Loader2 } from "lucide-react";
import { a as apiClient, P as PageHeader, b as Button } from "./router-DmYFa0HW.js";
import { K as KpiCard, C as Card, S as SectionCard } from "./widgets-CqJ4_jAo.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-CeW7GHO_.js";
import { toast } from "sonner";
import "@tanstack/react-query";
import "@tanstack/react-router";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-avatar";
import "@radix-ui/react-dialog";
import "@radix-ui/react-label";
import "@radix-ui/react-progress";
const reportsData = [{
  id: "inv",
  title: "Inventory Report",
  desc: "Full stock snapshot, status breakdown, and aging analysis.",
  rows: "1,240 SKUs",
  columns: ["SKU", "Product Name", "Category", "Stock Level", "Value", "Status"],
  data: [{
    SKU: "APX-901-ZH",
    name: "Apex-9 Optical Sensor",
    category: "Electronics",
    stock: 14,
    value: "$16,786",
    status: "Critical"
  }, {
    SKU: "TTN-441-B",
    name: "Titan Grade Castings",
    category: "Industrial",
    stock: 142,
    value: "$12,638",
    status: "Low"
  }, {
    SKU: "NRC-990-X",
    name: "Neural Engine Core v2",
    category: "Electronics",
    stock: 890,
    value: "$2,180,500",
    status: "Healthy"
  }, {
    SKU: "CRC-220-A",
    name: "Ceramic Capacitor 220uF",
    category: "Electronics",
    stock: 85e3,
    value: "$35,700",
    status: "Overstocked"
  }]
}, {
  id: "sal",
  title: "Sales Report",
  desc: "Revenue by product, channel, and category for the selected window.",
  rows: "30 days",
  columns: ["Date", "Product", "Qty Sold", "Avg Price", "Revenue", "Channel"],
  data: [{
    Date: "2026-06-09",
    product: "Neural Engine Core v2",
    qty: 12,
    price: "$2,450.00",
    revenue: "$29,400.00",
    channel: "Direct"
  }, {
    Date: "2026-06-09",
    product: "Apex-9 Optical Sensor",
    qty: 42,
    price: "$1,199.00",
    revenue: "$50,358.00",
    channel: "Distributor"
  }, {
    Date: "2026-06-08",
    product: "Smart Hub Z-Wave",
    qty: 18,
    price: "$149.00",
    revenue: "$2,682.00",
    channel: "E-Commerce"
  }, {
    Date: "2026-06-08",
    product: "Solar-X Panel 400W",
    qty: 5,
    price: "$489.00",
    revenue: "$2,445.00",
    channel: "Direct"
  }]
}, {
  id: "prc",
  title: "Pricing Report",
  desc: "Recommendation history, accept/override rates, and margin impact.",
  rows: "54 decisions",
  columns: ["Product", "Base Price", "New Price", "Competitor Price", "Margin Lift", "Status"],
  data: [{
    product: "Apex-9 Optical Sensor",
    base: "$1,199.00",
    new: "$1,259.00",
    competitor: "$1,248.00",
    lift: "+4.8%",
    status: "Approved"
  }, {
    product: "Smart Hub Z-Wave",
    base: "$149.00",
    new: "$159.00",
    competitor: "$162.00",
    lift: "+6.4%",
    status: "Approved"
  }, {
    product: "Solar-X Panel 400W",
    base: "$489.00",
    new: "$469.00",
    competitor: "$462.00",
    lift: "-2.1%",
    status: "Overridden"
  }, {
    product: "Neural Engine Core v2",
    base: "$2,450.00",
    new: "$2,520.00",
    competitor: "$2,495.00",
    lift: "+3.2%",
    status: "Approved"
  }]
}, {
  id: "fc",
  title: "Forecast Report",
  desc: "Predicted demand, accuracy metrics, and confidence intervals.",
  rows: "12 weeks",
  columns: ["Week", "Category", "Historical Demand", "Predicted Demand", "MAPE Error", "Confidence Interval"],
  data: [{
    Week: "W1 (Current)",
    category: "Electronics",
    historical: 420,
    predicted: 410,
    mape: "5.2%",
    confidence: "±8.1%"
  }, {
    Week: "W2",
    category: "Electronics",
    historical: 480,
    predicted: 475,
    mape: "5.4%",
    confidence: "±8.2%"
  }, {
    Week: "W3",
    category: "Electronics",
    historical: 510,
    predicted: 520,
    mape: "5.8%",
    confidence: "±8.4%"
  }, {
    Week: "W4",
    category: "Electronics",
    historical: 545,
    predicted: 560,
    mape: "6.1%",
    confidence: "±8.5%"
  }]
}, {
  id: "prc2",
  title: "Procurement Report",
  desc: "Purchase orders, supplier performance, lead times, and spend.",
  rows: "38 POs",
  columns: ["PO Number", "Product", "Supplier", "Quantity Ordered", "Cost", "Tracking Status"],
  data: [{
    po: "PO-22180",
    product: "Titan Grade Castings",
    supplier: "Iron Bridge Co.",
    qty: 120,
    cost: "$10,680",
    status: "In Transit"
  }, {
    po: "PO-22183",
    product: "Lithium Cell Mod-8",
    supplier: "VoltCore Industries",
    qty: 300,
    cost: "$23,400",
    status: "Delayed (Customs)"
  }, {
    po: "PO-22191",
    product: "Apex-9 Optical Sensor",
    supplier: "Nexus Supply",
    qty: 240,
    cost: "$287,760",
    status: "Awaiting Conf."
  }]
}, {
  id: "alt",
  title: "Alerts Report",
  desc: "Incident log with severity, resolution time, and category.",
  rows: "59 events",
  columns: ["Timestamp", "Alert Category", "Severity", "Incident Title", "Resolution Time"],
  data: [{
    time: "2026-06-09 23:49",
    category: "Inventory",
    severity: "Critical",
    title: "Apex-9 Predicted stock-out in 4 days",
    resolution: "Awaiting Order"
  }, {
    time: "2026-06-09 23:01",
    category: "Pricing",
    severity: "High",
    title: "Meridian Imports dropped Solar-X price by 6.2%",
    resolution: "45 mins"
  }, {
    time: "2026-06-09 21:12",
    category: "Supplier",
    severity: "High",
    title: "VoltCore Order PO-22183 delayed",
    resolution: "Unresolved"
  }]
}];
function ReportsPage() {
  const [selectedReportId, setSelectedReportId] = useState("inv");
  const [exportingType, setExportingType] = useState(null);
  const activeReport = reportsData.find((r) => r.id === selectedReportId) ?? reportsData[0];
  const [reportRows, setReportRows] = useState(activeReport.data);
  useEffect(() => {
    setReportRows(activeReport.data);
    if (selectedReportId === "inv") {
      Promise.all([apiClient.getProducts(), apiClient.getInventory()]).then(([products, inventory]) => {
        if (products && products.length > 0) {
          const mapped = products.map((p) => {
            const inv = inventory?.find((i) => i.product === p.id);
            const stock = inv ? inv.quantity_available : p.stock;
            const value = stock * Number(p.unit_price);
            return {
              SKU: p.sku,
              name: p.product_name,
              category: p.category,
              stock,
              value: `$${value.toLocaleString()}`,
              status: p.status.charAt(0).toUpperCase() + p.status.slice(1)
            };
          });
          setReportRows(mapped);
        }
      });
    } else if (selectedReportId === "sal") {
      apiClient.getSales().then((sales) => {
        if (sales && sales.length > 0) {
          const mapped = sales.slice(0, 8).map((s) => ({
            Date: s.transaction_date.split("T")[0],
            product: s.product_name || "Unknown Product",
            qty: s.quantity_sold,
            price: `$${Number(s.selling_price).toFixed(2)}`,
            revenue: `$${(s.quantity_sold * Number(s.selling_price)).toLocaleString()}`,
            channel: "Direct"
          }));
          setReportRows(mapped);
        }
      });
    } else if (selectedReportId === "prc") {
      apiClient.getPricing().then((pricing) => {
        if (pricing && pricing.length > 0) {
          const mapped = pricing.map((p) => ({
            product: p.product,
            base: `$${p.currentPrice.toFixed(2)}`,
            new: `$${p.recommendedPrice.toFixed(2)}`,
            competitor: `$${p.competitorAvg.toFixed(2)}`,
            lift: `${p.expectedImpact >= 0 ? "+" : ""}${p.expectedImpact}%`,
            status: p.status.charAt(0).toUpperCase() + p.status.slice(1)
          }));
          setReportRows(mapped);
        }
      });
    } else if (selectedReportId === "prc2") {
      apiClient.getPurchaseOrders().then((pos) => {
        if (pos && pos.length > 0) {
          const mapped = pos.map((po) => ({
            po: po.po_number,
            product: po.product_name || "Unknown Product",
            supplier: po.supplier_name || "Unknown Supplier",
            qty: po.qty,
            cost: `$${Number(po.cost).toLocaleString()}`,
            status: po.status.charAt(0).toUpperCase() + po.status.slice(1)
          }));
          setReportRows(mapped);
        }
      });
    } else if (selectedReportId === "alt") {
      apiClient.getAlerts().then((alerts) => {
        if (alerts && alerts.length > 0) {
          const mapped = alerts.map((a) => ({
            time: a.time_label || "Just now",
            category: a.category,
            severity: a.severity.charAt(0).toUpperCase() + a.severity.slice(1),
            title: a.message,
            resolution: a.resolved ? "Resolved" : "Unresolved"
          }));
          setReportRows(mapped);
        }
      });
    } else if (selectedReportId === "fc") {
      apiClient.getForecasting().then((res) => {
        if (res && res.demandForecast) {
          const mapped = res.demandForecast.slice(0, 4).map((df) => ({
            Week: df.week,
            category: "Electronics",
            historical: df.actual || "N/A",
            predicted: df.forecast,
            mape: res.mape || "5.8%",
            confidence: res.confidenceInterval || "±8.4%"
          }));
          setReportRows(mapped);
        }
      });
    }
  }, [selectedReportId]);
  const handleExport = (reportTitle, format) => {
    const key = `${reportTitle}-${format}`;
    setExportingType(key);
    setTimeout(() => {
      setExportingType(null);
      toast.success(`${reportTitle} compiled successfully. Download started in ${format} format!`);
    }, 1e3);
  };
  return /* @__PURE__ */ jsxs("div", { className: "p-6 lg:p-8 max-w-[1600px] mx-auto", children: [
    /* @__PURE__ */ jsx(PageHeader, { title: "Reports", description: "Generate, preview, or export operational intelligence across modules." }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-6", children: [
      /* @__PURE__ */ jsx(KpiCard, { label: "Reports Configured", value: `${reportsData.length}`, accent: "primary" }),
      /* @__PURE__ */ jsx(KpiCard, { label: "Compiled this month", value: "142", delta: "+18", trend: "up" }),
      /* @__PURE__ */ jsx(KpiCard, { label: "Scheduled exports", value: "9", hint: "Daily/weekly cron tasks" }),
      /* @__PURE__ */ jsx(KpiCard, { label: "Avg. Generation speed", value: "0.8s" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6", children: [
      /* @__PURE__ */ jsx("div", { className: "lg:col-span-1 space-y-4", children: reportsData.map((r) => {
        const isSelected = r.id === selectedReportId;
        return /* @__PURE__ */ jsxs(Card, { onClick: () => setSelectedReportId(r.id), className: `p-4 gap-3 cursor-pointer transition-all border ${isSelected ? "border-primary bg-primary/5 shadow-md shadow-primary/5" : "border-border hover:border-primary/40 bg-card"}`, children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsx("p", { className: `font-semibold text-sm ${isSelected ? "text-primary" : "text-foreground"}`, children: r.title }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground line-clamp-2 leading-relaxed", children: r.desc })
            ] }),
            /* @__PURE__ */ jsx("div", { className: `size-8 rounded-md grid place-items-center ${isSelected ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`, children: /* @__PURE__ */ jsx(FileText, { className: "size-4" }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/60 pt-2 mt-1", children: [
            /* @__PURE__ */ jsxs("span", { children: [
              "Scope: ",
              r.rows
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1 text-primary", children: [
              /* @__PURE__ */ jsx(Eye, { className: "size-3" }),
              " Previewing"
            ] })
          ] })
        ] }, r.id);
      }) }),
      /* @__PURE__ */ jsx("div", { className: "lg:col-span-2", children: /* @__PURE__ */ jsxs(SectionCard, { title: activeReport.title, description: `Live database preview (${activeReport.rows})`, actions: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
        /* @__PURE__ */ jsx(ExportButton, { format: "PDF", icon: /* @__PURE__ */ jsx(FileType, { className: "size-3.5" }), isLoading: exportingType === `${activeReport.title}-PDF`, onClick: () => handleExport(activeReport.title, "PDF") }),
        /* @__PURE__ */ jsx(ExportButton, { format: "XLSX", icon: /* @__PURE__ */ jsx(FileSpreadsheet, { className: "size-3.5" }), isLoading: exportingType === `${activeReport.title}-XLSX`, onClick: () => handleExport(activeReport.title, "XLSX") }),
        /* @__PURE__ */ jsx(ExportButton, { format: "CSV", icon: /* @__PURE__ */ jsx(Download, { className: "size-3.5" }), isLoading: exportingType === `${activeReport.title}-CSV`, onClick: () => handleExport(activeReport.title, "CSV") })
      ] }), children: [
        /* @__PURE__ */ jsx("div", { className: "rounded-lg border border-border bg-surface-2 overflow-hidden", children: /* @__PURE__ */ jsxs(Table, { children: [
          /* @__PURE__ */ jsx(TableHeader, { className: "bg-muted/40", children: /* @__PURE__ */ jsx(TableRow, { children: activeReport.columns.map((col) => /* @__PURE__ */ jsx(TableHead, { className: "text-xs font-semibold py-3", children: col }, col)) }) }),
          /* @__PURE__ */ jsx(TableBody, { children: reportRows.map((row, idx) => /* @__PURE__ */ jsx(TableRow, { children: Object.values(row).map((val, cellIdx) => /* @__PURE__ */ jsx(TableCell, { className: "text-xs font-mono py-3", children: val }, cellIdx)) }, idx)) })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "text-[10px] text-muted-foreground flex justify-between items-center mt-2 px-1", children: [
          /* @__PURE__ */ jsxs("span", { children: [
            "Showing first ",
            reportRows.length,
            " sample rows of generated output"
          ] }),
          /* @__PURE__ */ jsx("span", { children: "Compiled at runtime · 100% accurate database sync" })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(SectionCard, { title: "Scheduled Platform Reports", description: "Emailed automatically to stakeholders", children: /* @__PURE__ */ jsxs("div", { className: "space-y-2 text-sm", children: [
      /* @__PURE__ */ jsx(Row, { title: "Weekly Inventory Summary", cadence: "Every Monday · 08:00 UTC", format: "Excel/CSV", email: "operations@sokopulse.ai" }),
      /* @__PURE__ */ jsx(Row, { title: "Daily Critical Alerts Log", cadence: "Every day · 07:00 UTC", format: "PDF", email: "management-team@sokopulse.ai" }),
      /* @__PURE__ */ jsx(Row, { title: "Monthly Pricing Decisions & Elasticity", cadence: "1st of each month · 09:00 UTC", format: "PDF/Excel", email: "finance@sokopulse.ai" })
    ] }) })
  ] });
}
function ExportButton({
  format,
  icon,
  isLoading,
  onClick
}) {
  return /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", onClick, disabled: isLoading, className: "text-xs h-8", children: isLoading ? /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Loader2, { className: "size-3 mr-1.5 animate-spin text-primary" }),
    "Compiling..."
  ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
    icon,
    format
  ] }) });
}
function Row({
  title,
  cadence,
  format,
  email
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between py-2 border-b border-border last:border-0 gap-4", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("p", { className: "font-medium", children: title }),
      /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
        "Cadence: ",
        cadence,
        " · Format: ",
        format
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsx("span", { className: "text-xs font-mono text-muted-foreground", children: email }),
      /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", children: "Edit Schedule" })
    ] })
  ] });
}
export {
  ReportsPage as component
};
