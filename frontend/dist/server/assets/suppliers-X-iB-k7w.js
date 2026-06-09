import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { P as PageHeader, B as Badge, a as Button } from "./router-D42ivKTs.js";
import { K as KpiCard, S as SectionCard, P as Progress } from "./widgets-CDL6XJpG.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-BAu7Cy9V.js";
import { s as suppliers } from "./mock-data-CXBJH4HK.js";
import { a as apiClient } from "./api-client-DkeUMLsG.js";
import { toast } from "sonner";
import "@tanstack/react-query";
import "@tanstack/react-router";
import "lucide-react";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-avatar";
import "@radix-ui/react-progress";
function SuppliersPage() {
  const [suppliers$1, setSuppliers] = useState(suppliers);
  useEffect(() => {
    apiClient.getSuppliers().then((data) => {
      if (data && data.length > 0) {
        setSuppliers(data.map((s) => ({
          id: String(s.id),
          name: s.supplier_name,
          reliability: Number(s.reliability_score) || 90,
          leadTime: s.lead_time_days || 7,
          activeOrders: s.active_orders || 0,
          country: s.country || "Global Partner",
          status: s.status || "active"
        })));
      }
    });
  }, []);
  const activeCount = suppliers$1.length;
  const avgReliability = activeCount > 0 ? Math.round(suppliers$1.reduce((sum, s) => sum + s.reliability, 0) / activeCount) : 88;
  const avgLeadTime = activeCount > 0 ? (suppliers$1.reduce((sum, s) => sum + s.leadTime, 0) / activeCount).toFixed(1) : "8.2";
  const delayedCount = suppliers$1.filter((s) => s.status === "delayed").length;
  return /* @__PURE__ */ jsxs("div", { className: "p-6 lg:p-8 max-w-[1600px] mx-auto", children: [
    /* @__PURE__ */ jsx(PageHeader, { title: "Suppliers", description: "Performance, reliability, and active orders across the supplier network." }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-6", children: [
      /* @__PURE__ */ jsx(KpiCard, { label: "Active Suppliers", value: `${activeCount}`, accent: "primary" }),
      /* @__PURE__ */ jsx(KpiCard, { label: "Avg. Reliability", value: `${avgReliability}%`, delta: "+2%", trend: "up" }),
      /* @__PURE__ */ jsx(KpiCard, { label: "Avg. Lead Time", value: `${avgLeadTime} days` }),
      /* @__PURE__ */ jsx(KpiCard, { label: "Delayed Shipments", value: `${delayedCount}`, accent: delayedCount > 0 ? "destructive" : void 0 })
    ] }),
    /* @__PURE__ */ jsx(SectionCard, { title: "Top Suppliers", description: "Sorted by active orders", children: /* @__PURE__ */ jsxs(Table, { children: [
      /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableHead, { children: "Supplier" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Country" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Reliability" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Lead Time" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Active Orders" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Status" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-right" })
      ] }) }),
      /* @__PURE__ */ jsx(TableBody, { children: suppliers$1.map((s) => /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: s.name }),
        /* @__PURE__ */ jsx(TableCell, { className: "text-muted-foreground text-sm", children: s.country }),
        /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 w-44", children: [
          /* @__PURE__ */ jsx(Progress, { value: s.reliability, className: "h-1.5 flex-1" }),
          /* @__PURE__ */ jsxs("span", { className: "text-xs font-mono", children: [
            s.reliability,
            "%"
          ] })
        ] }) }),
        /* @__PURE__ */ jsxs(TableCell, { className: "text-right font-mono", children: [
          s.leadTime,
          "d"
        ] }),
        /* @__PURE__ */ jsx(TableCell, { className: "text-right font-mono", children: s.activeOrders }),
        /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, { variant: "outline", className: s.status === "active" ? "bg-success/10 text-success border-success/30 capitalize" : s.status === "delayed" ? "bg-warning/10 text-warning border-warning/30 capitalize" : "bg-muted text-muted-foreground capitalize", children: s.status }) }),
        /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", onClick: () => toast.info(`Viewing supplier audit for ${s.name}...`), children: "View" }) })
      ] }, s.id)) })
    ] }) })
  ] });
}
export {
  SuppliersPage as component
};
