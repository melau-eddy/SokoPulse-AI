import { jsxs, jsx } from "react/jsx-runtime";
import { P as PageHeader, B as Badge, a as Button } from "./router-DpanUk2p.js";
import { K as KpiCard, S as SectionCard, P as Progress } from "./widgets-DJY_Wxub.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-BY6zAHFy.js";
import { s as suppliers } from "./mock-data-CXBJH4HK.js";
import "@tanstack/react-query";
import "@tanstack/react-router";
import "react";
import "sonner";
import "lucide-react";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-avatar";
import "@radix-ui/react-progress";
function SuppliersPage() {
  return /* @__PURE__ */ jsxs("div", { className: "p-6 lg:p-8 max-w-[1600px] mx-auto", children: [
    /* @__PURE__ */ jsx(PageHeader, { title: "Suppliers", description: "Performance, reliability, and active orders across the supplier network." }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-6", children: [
      /* @__PURE__ */ jsx(KpiCard, { label: "Active Suppliers", value: "82", accent: "primary" }),
      /* @__PURE__ */ jsx(KpiCard, { label: "Avg. Reliability", value: "88%", delta: "+2%", trend: "up" }),
      /* @__PURE__ */ jsx(KpiCard, { label: "Avg. Lead Time", value: "8.2 days" }),
      /* @__PURE__ */ jsx(KpiCard, { label: "Delayed Shipments", value: "3", accent: "destructive" })
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
      /* @__PURE__ */ jsx(TableBody, { children: suppliers.map((s) => /* @__PURE__ */ jsxs(TableRow, { children: [
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
        /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", children: "View" }) })
      ] }, s.id)) })
    ] }) })
  ] });
}
export {
  SuppliersPage as component
};
