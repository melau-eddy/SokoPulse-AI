import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { a as apiClient, P as PageHeader, B as Badge, b as Button, D as Dialog, c as DialogContent, d as DialogHeader, e as DialogTitle, f as DialogDescription, g as DialogFooter } from "./router-DTaeCIgy.js";
import { K as KpiCard, S as SectionCard, P as Progress } from "./widgets-CxcUKQRj.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-zU7fJY9A.js";
import { s as suppliers } from "./mock-data-Nl4nWPc2.js";
import { toast } from "sonner";
import "@tanstack/react-query";
import "@tanstack/react-router";
import "lucide-react";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-avatar";
import "@radix-ui/react-dialog";
import "@radix-ui/react-label";
import "@radix-ui/react-progress";
function SuppliersPage() {
  const [suppliers$1, setSuppliers] = useState(suppliers);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
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
        /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", onClick: () => setSelectedSupplier(s), children: "View" }) })
      ] }, s.id)) })
    ] }) }),
    /* @__PURE__ */ jsx(Dialog, { open: !!selectedSupplier, onOpenChange: (open) => !open && setSelectedSupplier(null), children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-[500px]", children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { children: selectedSupplier?.name }),
        /* @__PURE__ */ jsx(DialogDescription, { children: "Performance profile and logistics dashboard." })
      ] }),
      selectedSupplier && /* @__PURE__ */ jsxs("div", { className: "space-y-4 py-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground uppercase", children: "Country" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium", children: selectedSupplier.country })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground uppercase", children: "Status" }),
            /* @__PURE__ */ jsx(Badge, { variant: "outline", className: selectedSupplier.status === "active" ? "bg-success/10 text-success border-success/30 capitalize" : "bg-warning/10 text-warning border-warning/30 capitalize", children: selectedSupplier.status })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground uppercase", children: "Reliability Score" }),
            /* @__PURE__ */ jsxs("p", { className: "text-sm font-mono font-medium", children: [
              selectedSupplier.reliability,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground uppercase", children: "Avg. Lead Time" }),
            /* @__PURE__ */ jsxs("p", { className: "text-sm font-mono font-medium", children: [
              selectedSupplier.leadTime,
              " Days"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2 pt-2 border-t border-border", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Order Overview" }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center bg-surface-2 p-3 rounded-md", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-medium", children: "Active Purchase Orders" }),
              /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground", children: "Currently in transit or production" })
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "text-sm font-mono font-semibold", children: [
              selectedSupplier.activeOrders,
              " POs"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2 pt-2 border-t border-border", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Contact Details" }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
            "Email:",
            " ",
            /* @__PURE__ */ jsxs("span", { className: "text-foreground font-mono", children: [
              "logistics@",
              selectedSupplier.name.toLowerCase().replace(/[^a-z0-9]/g, ""),
              ".com"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
            "Support Hotline:",
            " ",
            /* @__PURE__ */ jsxs("span", { className: "text-foreground font-mono", children: [
              "+1 (800) 555-019",
              selectedSupplier.id
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => setSelectedSupplier(null), children: "Close Profile" }),
        /* @__PURE__ */ jsx(Button, { onClick: () => {
          setSelectedSupplier(null);
          toast.success(`Procurement pipeline synced with ${selectedSupplier?.name}`);
        }, children: "Sync Pipeline" })
      ] })
    ] }) })
  ] });
}
export {
  SuppliersPage as component
};
