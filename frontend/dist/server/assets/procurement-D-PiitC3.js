import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { RefreshCw, X, Sparkles } from "lucide-react";
import { a as apiClient, P as PageHeader, b as Button, B as Badge, D as Dialog, c as DialogContent, d as DialogHeader, e as DialogTitle, f as DialogDescription, L as Label, I as Input, g as DialogFooter } from "./router-piqkfnbA.js";
import { K as KpiCard, C as Card, a as SeverityBadge } from "./widgets-CtN5f3kO.js";
import { T as Tabs, a as TabsList, b as TabsTrigger } from "./tabs-Cqhe8ux0.js";
import { p as procurementItems, f as fmtCurrency } from "./mock-data-BF-8ZobF.js";
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
import "@radix-ui/react-tabs";
const mockActivePOs = [{
  id: "active1",
  product: "Titan Grade Castings",
  qty: 120,
  supplier: "Iron Bridge Co.",
  leadTime: 9,
  cost: 10680,
  urgency: "medium",
  reason: "Scheduled restocking cycle",
  status: "approved",
  poNumber: "PO-22180",
  etaDate: "2026-06-18",
  trackingStatus: "In Transit"
}, {
  id: "active2",
  product: "Lithium Cell Mod-8",
  qty: 300,
  supplier: "VoltCore Industries",
  leadTime: 14,
  cost: 23400,
  urgency: "critical",
  reason: "Delayed previous delivery fallback",
  status: "approved",
  poNumber: "PO-22183",
  etaDate: "2026-06-24",
  trackingStatus: "Delayed (Customs Hold)"
}];
function ProcurementPage() {
  const [recommendations, setRecommendations] = useState(() => procurementItems.map((item) => ({
    ...item,
    status: "pending"
  })));
  const [activePOs, setActivePOs] = useState(mockActivePOs);
  const [activeTab, setActiveTab] = useState("pending");
  const [adjustItem, setAdjustItem] = useState(null);
  const [adjustQty, setAdjustQty] = useState("");
  const [adjustSupplier, setAdjustSupplier] = useState("");
  const [isBulkApproving, setIsBulkApproving] = useState(false);
  useEffect(() => {
    apiClient.getProcurement().then((data) => {
      if (data && data.length > 0) {
        setRecommendations(data);
      }
    });
    apiClient.getPurchaseOrders().then((data) => {
      if (data && data.length > 0) {
        setActivePOs(data.map((po) => ({
          id: String(po.id),
          product: po.product_name || "Unknown Product",
          qty: po.qty,
          supplier: po.supplier_name || "Unknown Supplier",
          leadTime: po.lead_time_days || 7,
          cost: Number(po.cost),
          urgency: po.status === "delayed" ? "critical" : "medium",
          reason: "Active purchase order",
          status: "approved",
          poNumber: po.po_number,
          etaDate: po.expected_delivery,
          trackingStatus: po.status.charAt(0).toUpperCase() + po.status.slice(1)
        })));
      }
    });
  }, []);
  const pendingItems = recommendations.filter((r) => r.status === "pending");
  const totalBudgetImpact = pendingItems.reduce((s, p) => s + p.cost, 0);
  const criticalCount = pendingItems.filter((p) => p.urgency === "critical").length;
  const handleCreatePO = (id) => {
    const item = recommendations.find((r) => r.id === id);
    if (!item) return;
    const poNumber = `PO-${Math.floor(1e4 + Math.random() * 9e4)}`;
    const eta = /* @__PURE__ */ new Date();
    eta.setDate(eta.getDate() + item.leadTime);
    const etaStr = eta.toISOString().split("T")[0];
    apiClient.createPurchaseOrder({
      po_number: poNumber,
      product: item.productId || 1,
      supplier: item.supplierId || 1,
      qty: item.qty,
      cost: item.cost,
      expected_delivery: etaStr,
      status: "pending"
    }).then((res) => {
      apiClient.updateRecommendationStatus(item.id, "approved");
      const approvedItem = {
        ...item,
        status: "approved",
        poNumber,
        etaDate: etaStr,
        trackingStatus: "Awaiting Confirmation"
      };
      setRecommendations((prev) => prev.filter((r) => r.id !== id));
      setActivePOs((prev) => [approvedItem, ...prev]);
      toast.success(`Purchase Order ${poNumber} created for ${item.product}!`);
    });
  };
  const handleIgnore = (id) => {
    apiClient.updateRecommendationStatus(id, "rejected").then(() => {
      setRecommendations((prev) => prev.filter((r) => r.id !== id));
      toast.info("Recommendation dismissed.");
    });
  };
  const handleBulkApprove = () => {
    const criticalPOs = pendingItems.filter((r) => r.urgency === "critical");
    if (criticalPOs.length === 0) {
      toast.info("No critical PO recommendations pending.");
      return;
    }
    setIsBulkApproving(true);
    const promises = criticalPOs.map((item) => {
      const poNumber = `PO-${Math.floor(1e4 + Math.random() * 9e4)}`;
      const eta = /* @__PURE__ */ new Date();
      eta.setDate(eta.getDate() + item.leadTime);
      const etaStr = eta.toISOString().split("T")[0];
      return apiClient.createPurchaseOrder({
        po_number: poNumber,
        product: item.productId || 1,
        supplier: item.supplierId || 1,
        qty: item.qty,
        cost: item.cost,
        expected_delivery: etaStr,
        status: "pending"
      }).then(() => {
        return apiClient.updateRecommendationStatus(item.id, "approved").then(() => {
          return {
            ...item,
            status: "approved",
            poNumber,
            etaDate: etaStr,
            trackingStatus: "Awaiting Confirmation"
          };
        });
      });
    });
    Promise.all(promises).then((newApprovedItems) => {
      setRecommendations((prev) => prev.filter((r) => r.urgency !== "critical"));
      setActivePOs((prev) => [...newApprovedItems, ...prev]);
      setIsBulkApproving(false);
      toast.success(`Bulk approved ${criticalPOs.length} critical purchase orders.`);
    }).catch((err) => {
      setIsBulkApproving(false);
      toast.error("Bulk approval failed.");
    });
  };
  const openAdjustDialog = (item) => {
    setAdjustItem(item);
    setAdjustQty(item.qty.toString());
    setAdjustSupplier(item.supplier);
  };
  const saveAdjustment = () => {
    if (!adjustItem) return;
    const newQty = parseInt(adjustQty);
    if (isNaN(newQty) || newQty <= 0) {
      toast.error("Please enter a valid quantity");
      return;
    }
    const unitCost = adjustItem.cost / adjustItem.qty;
    const newCost = Math.round(newQty * unitCost);
    setRecommendations((prev) => prev.map((r) => r.id === adjustItem.id ? {
      ...r,
      qty: newQty,
      cost: newCost,
      supplier: adjustSupplier
    } : r));
    toast.success(`Adjusted PO order details for ${adjustItem.product}.`);
    setAdjustItem(null);
  };
  return /* @__PURE__ */ jsxs("div", { className: "p-6 lg:p-8 max-w-[1600px] mx-auto", children: [
    /* @__PURE__ */ jsx(PageHeader, { title: "Procurement Recommendations", description: "AI-generated purchase orders ranked by urgency, supplier reliability, and budget impact.", actions: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", onClick: () => {
        setRecommendations(procurementItems.map((r) => ({
          ...r,
          status: "pending"
        })));
        setActivePOs(mockActivePOs);
        toast.success("Procurement states reset to default.");
      }, children: "Reset Data" }),
      /* @__PURE__ */ jsxs(Button, { size: "sm", onClick: handleBulkApprove, disabled: isBulkApproving || criticalCount === 0, children: [
        /* @__PURE__ */ jsx(RefreshCw, { className: `size-3.5 mr-1.5 ${isBulkApproving ? "animate-spin" : ""}` }),
        "Approve All Critical"
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-6", children: [
      /* @__PURE__ */ jsx(KpiCard, { label: "Recommended POs", value: `${pendingItems.length}`, accent: "primary" }),
      /* @__PURE__ */ jsx(KpiCard, { label: "Total Budget Impact", value: fmtCurrency(totalBudgetImpact), hint: "Across all recommendations" }),
      /* @__PURE__ */ jsx(KpiCard, { label: "Critical Urgency", value: `${criticalCount}`, accent: criticalCount > 0 ? "destructive" : void 0 }),
      /* @__PURE__ */ jsx(KpiCard, { label: "Active POs In-Flight", value: `${activePOs.length}`, accent: "success" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mb-4", children: /* @__PURE__ */ jsx(Tabs, { value: activeTab, onValueChange: (v) => setActiveTab(v), children: /* @__PURE__ */ jsxs(TabsList, { children: [
      /* @__PURE__ */ jsxs(TabsTrigger, { value: "pending", children: [
        "Recommendations (",
        pendingItems.length,
        ")"
      ] }),
      /* @__PURE__ */ jsxs(TabsTrigger, { value: "active", children: [
        "Active Orders (",
        activePOs.length,
        ")"
      ] })
    ] }) }) }),
    activeTab === "pending" ? /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      pendingItems.map((p) => /* @__PURE__ */ jsxs(Card, { className: "p-6 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-start justify-between gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
              /* @__PURE__ */ jsx("h3", { className: "font-semibold text-base", children: p.product }),
              /* @__PURE__ */ jsx(SeverityBadge, { severity: p.urgency })
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
              "Supplier: ",
              p.supplier,
              " · Lead time: ",
              p.leadTime,
              " days"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", className: "h-9 text-destructive hover:bg-destructive/10", onClick: () => handleIgnore(p.id), children: /* @__PURE__ */ jsx(X, { className: "size-4" }) }),
            /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", className: "h-9", onClick: () => openAdjustDialog(p), children: "Adjust" }),
            /* @__PURE__ */ jsx(Button, { size: "sm", className: "h-9", onClick: () => handleCreatePO(p.id), children: "Create PO" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
          /* @__PURE__ */ jsx(Stat, { label: "Recommended Qty", value: `${p.qty.toLocaleString()} units` }),
          /* @__PURE__ */ jsx(Stat, { label: "Estimated Cost", value: fmtCurrency(p.cost) }),
          /* @__PURE__ */ jsx(Stat, { label: "Lead Time", value: `${p.leadTime} days` })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-md border border-border bg-surface-2 p-3 flex gap-2", children: [
          /* @__PURE__ */ jsx(Sparkles, { className: "size-4 text-primary shrink-0 mt-0.5" }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground leading-relaxed", children: [
            /* @__PURE__ */ jsx("span", { className: "font-medium text-foreground", children: "AI reasoning:" }),
            " ",
            p.reason
          ] })
        ] })
      ] }, p.id)),
      pendingItems.length === 0 && /* @__PURE__ */ jsx("div", { className: "text-center py-12 bg-card border border-border rounded-lg", children: /* @__PURE__ */ jsx("p", { className: "font-medium text-sm text-muted-foreground", children: "All recommendations resolved." }) })
    ] }) : /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      activePOs.map((p) => /* @__PURE__ */ jsxs(Card, { className: "p-6 gap-4 border-l-2 border-l-success", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-start justify-between gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
              /* @__PURE__ */ jsx("span", { className: "font-mono text-xs text-muted-foreground", children: p.poNumber }),
              /* @__PURE__ */ jsx("h3", { className: "font-semibold text-base", children: p.product }),
              /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "bg-success/10 text-success border-success/30 font-mono text-[10px]", children: p.trackingStatus })
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
              "Supplier: ",
              p.supplier,
              " · Handled via platform"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", onClick: () => toast.info(`Syncing status for PO ${p.poNumber}...`), children: "Track" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-4 gap-3", children: [
          /* @__PURE__ */ jsx(Stat, { label: "Ordered Qty", value: `${p.qty.toLocaleString()} units` }),
          /* @__PURE__ */ jsx(Stat, { label: "Spend", value: fmtCurrency(p.cost) }),
          /* @__PURE__ */ jsx(Stat, { label: "ETA Delivery", value: p.etaDate ?? "N/A" }),
          /* @__PURE__ */ jsx(Stat, { label: "Fulfillment Speed", value: `${p.leadTime} days` })
        ] })
      ] }, p.id)),
      activePOs.length === 0 && /* @__PURE__ */ jsx("div", { className: "text-center py-12 bg-card border border-border rounded-lg", children: /* @__PURE__ */ jsx("p", { className: "font-medium text-sm text-muted-foreground", children: "No active purchase orders." }) })
    ] }),
    /* @__PURE__ */ jsx(Dialog, { open: !!adjustItem, onOpenChange: (o) => !o && setAdjustItem(null), children: /* @__PURE__ */ jsx(DialogContent, { className: "sm:max-w-[425px]", children: adjustItem && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { children: "Adjust Recommendation" }),
        /* @__PURE__ */ jsx(DialogDescription, { children: "Modify quantity and supplier for your upcoming purchase order. Cost will recalculate." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-4 py-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "qtyInput", children: "Order Quantity" }),
          /* @__PURE__ */ jsx(Input, { id: "qtyInput", type: "number", value: adjustQty, onChange: (e) => setAdjustQty(e.target.value), className: "font-mono" }),
          /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-muted-foreground", children: [
            "Baseline recommendation: ",
            adjustItem.qty.toLocaleString(),
            " ",
            "units"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "supplierSelect", children: "Supplier Choice" }),
          /* @__PURE__ */ jsx(Input, { id: "supplierSelect", value: adjustSupplier, onChange: (e) => setAdjustSupplier(e.target.value) })
        ] }),
        parseInt(adjustQty) > 0 && /* @__PURE__ */ jsxs("div", { className: "rounded-lg bg-surface-2 border border-border p-3 space-y-2 text-xs", children: [
          /* @__PURE__ */ jsx("p", { className: "font-semibold text-foreground", children: "Live Budget Impact" }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "New Quantity:" }),
            /* @__PURE__ */ jsxs("span", { className: "font-mono", children: [
              parseInt(adjustQty).toLocaleString(),
              " units"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "New Estimated Cost:" }),
            /* @__PURE__ */ jsx("span", { className: "font-mono font-bold text-primary", children: (() => {
              const unitCost = adjustItem.cost / adjustItem.qty;
              return fmtCurrency(Math.round(parseInt(adjustQty) * unitCost));
            })() })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => setAdjustItem(null), children: "Cancel" }),
        /* @__PURE__ */ jsx(Button, { onClick: saveAdjustment, children: "Apply Adjustments" })
      ] })
    ] }) }) })
  ] });
}
function Stat({
  label,
  value
}) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-md border border-border bg-surface-2 p-3", children: [
    /* @__PURE__ */ jsx("p", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: label }),
    /* @__PURE__ */ jsx("p", { className: "text-sm font-medium font-mono mt-1", children: value })
  ] });
}
export {
  ProcurementPage as component
};
