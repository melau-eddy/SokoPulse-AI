import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { RotateCcw, Sparkles, CheckCircle2, Filter, Check } from "lucide-react";
import { a as apiClient, P as PageHeader, b as Button, B as Badge } from "./router-BD5aXVYo.js";
import { K as KpiCard, S as SectionCard, C as Card, a as SeverityBadge } from "./widgets-B7hjCtKN.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-B8T-_lti.js";
import { T as Tabs, a as TabsList, b as TabsTrigger } from "./tabs-C_n_QZck.js";
import { h as alerts } from "./mock-data-DR5Lercr.js";
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
import "@radix-ui/react-select";
import "@radix-ui/react-tabs";
const sampleScenarios = [{
  title: "Anomaly detected: Titan Castings demand",
  desc: "Sales spike +65% over past 12h, suspected supply run by competitor.",
  category: "Demand",
  severity: "high"
}, {
  title: "Expiring batch: Lithium cells Mod-8",
  desc: "150 units expiring in 15 days in East warehouse.",
  category: "Inventory",
  severity: "medium"
}, {
  title: "Competitor Price Match opportunity",
  desc: "Nexus Supply raised Apex-9 price by $35. Recommended parity adjustment: +2.9%.",
  category: "Pricing",
  severity: "low"
}, {
  title: "Integration sync failed: NetSuite ERP",
  desc: "API connection timeout during batch ledger transfer.",
  category: "System",
  severity: "critical"
}, {
  title: "Fulfillment delay: SunGrid panels",
  desc: "Shipment #PO-9471 delayed by 4 days due to port congestion.",
  category: "Supplier",
  severity: "medium"
}];
function AlertsPage() {
  const [data, setData] = useState(() => alerts.map((a) => ({
    ...a,
    resolved: a.resolved ?? false
  })));
  const [severityFilter, setSeverityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  useEffect(() => {
    apiClient.getAlerts().then((data2) => {
      if (data2) {
        setData(data2);
      }
    });
  }, []);
  const list = data.filter((a) => {
    const matchesSeverity = severityFilter === "all" || a.severity === severityFilter;
    const matchesCategory = categoryFilter === "all" || a.category === categoryFilter;
    return matchesSeverity && matchesCategory;
  });
  const categories = Array.from(new Set(data.map((a) => a.category)));
  const counts = {
    all: data.length,
    critical: data.filter((a) => a.severity === "critical").length,
    high: data.filter((a) => a.severity === "high").length,
    medium: data.filter((a) => a.severity === "medium").length,
    low: data.filter((a) => a.severity === "low").length
  };
  const handleResolve = (id, currentlyResolved) => {
    const nextResolvedState = !currentlyResolved;
    apiClient.resolveAlert(id, nextResolvedState).then((serverAlert) => {
      setData((prev) => prev.map((item) => item.id === id ? {
        ...item,
        resolved: nextResolvedState
      } : item));
      toast.success(currentlyResolved ? "Alert marked as unresolved" : "Alert marked as resolved");
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("alerts-updated"));
      }
    });
  };
  const handleResolveAll = () => {
    const unresolved = list.filter((a) => !a.resolved);
    if (unresolved.length === 0) {
      toast.info("No active alerts to resolve in this view.");
      return;
    }
    const resolvePromises = unresolved.map((item) => apiClient.resolveAlert(item.id, true));
    Promise.all(resolvePromises).then(() => {
      setData((prev) => prev.map((item) => {
        const matchesSeverity = severityFilter === "all" || item.severity === severityFilter;
        const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
        if (matchesSeverity && matchesCategory) {
          return {
            ...item,
            resolved: true
          };
        }
        return item;
      }));
      toast.success(`Resolved ${unresolved.length} alerts in current filter view.`);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("alerts-updated"));
      }
    });
  };
  const handleSimulateAlert = () => {
    apiClient.simulateAlert().then((serverAlert) => {
      if (serverAlert) {
        setData((prev) => [serverAlert, ...prev]);
        toast(serverAlert.title, {
          description: serverAlert.description,
          action: {
            label: "View",
            onClick: () => {
              setSeverityFilter(serverAlert.severity);
              setCategoryFilter(serverAlert.category);
            }
          }
        });
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("alerts-updated"));
        }
      } else {
        const scenario = sampleScenarios[Math.floor(Math.random() * sampleScenarios.length)];
        const newId = `sim-${Date.now()}`;
        const newAlert = {
          id: newId,
          title: scenario.title,
          description: scenario.desc,
          severity: scenario.severity,
          time: "Just now",
          category: scenario.category,
          resolved: false
        };
        setData((prev) => [newAlert, ...prev]);
        toast(scenario.title, {
          description: scenario.desc
        });
      }
    });
  };
  const resetAll = () => {
    apiClient.getAlerts().then((serverData) => {
      if (serverData) {
        setData(serverData);
      } else {
        setData(alerts.map((a) => ({
          ...a,
          resolved: a.resolved ?? false
        })));
      }
      setSeverityFilter("all");
      setCategoryFilter("all");
      toast.success("Alert list reset to default states.");
    });
  };
  return /* @__PURE__ */ jsxs("div", { className: "p-6 lg:p-8 max-w-[1600px] mx-auto", children: [
    /* @__PURE__ */ jsx(PageHeader, { title: "Alerts & Notifications", description: "Real-time predictive telemetry alerts spanning inventory levels, pricing signals, and supply integrity.", actions: /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", onClick: resetAll, children: [
        /* @__PURE__ */ jsx(RotateCcw, { className: "size-3.5 mr-1" }),
        " Reset"
      ] }),
      /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", onClick: handleSimulateAlert, className: "border-primary/40 text-primary hover:bg-primary/10", children: [
        /* @__PURE__ */ jsx(Sparkles, { className: "size-3.5 mr-1.5" }),
        " Trigger Simulated Alert"
      ] }),
      /* @__PURE__ */ jsxs(Button, { size: "sm", onClick: handleResolveAll, children: [
        /* @__PURE__ */ jsx(CheckCircle2, { className: "size-3.5 mr-1.5" }),
        " Resolve Filtered"
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-6", children: [
      /* @__PURE__ */ jsx(KpiCard, { label: "Open Alerts", value: `${data.filter((a) => !a.resolved).length}`, accent: "primary" }),
      /* @__PURE__ */ jsx(KpiCard, { label: "Critical Urgency", value: `${counts.critical}`, accent: "destructive" }),
      /* @__PURE__ */ jsx(KpiCard, { label: "High Urgency", value: `${counts.high}`, accent: "warning" }),
      /* @__PURE__ */ jsx(KpiCard, { label: "Resolved (7d)", value: "48", delta: "+12", trend: "up", accent: "success" })
    ] }),
    /* @__PURE__ */ jsxs(SectionCard, { children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4 border-b border-border/40 pb-4", children: [
        /* @__PURE__ */ jsx(Tabs, { value: severityFilter, onValueChange: (v) => setSeverityFilter(v), className: "w-full md:w-auto", children: /* @__PURE__ */ jsxs(TabsList, { className: "flex-wrap h-auto", children: [
          /* @__PURE__ */ jsxs(TabsTrigger, { value: "all", children: [
            "All (",
            counts.all,
            ")"
          ] }),
          /* @__PURE__ */ jsxs(TabsTrigger, { value: "critical", className: "data-[state=active]:bg-destructive/10 data-[state=active]:text-destructive", children: [
            "Critical (",
            counts.critical,
            ")"
          ] }),
          /* @__PURE__ */ jsxs(TabsTrigger, { value: "high", className: "data-[state=active]:bg-warning/10 data-[state=active]:text-warning", children: [
            "High (",
            counts.high,
            ")"
          ] }),
          /* @__PURE__ */ jsxs(TabsTrigger, { value: "medium", children: [
            "Medium (",
            counts.medium,
            ")"
          ] }),
          /* @__PURE__ */ jsxs(TabsTrigger, { value: "low", children: [
            "Low (",
            counts.low,
            ")"
          ] })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 w-full md:w-auto", children: [
          /* @__PURE__ */ jsx(Filter, { className: "size-3.5 text-muted-foreground shrink-0" }),
          /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground whitespace-nowrap", children: "Filter Category:" }),
          /* @__PURE__ */ jsxs(Select, { value: categoryFilter, onValueChange: setCategoryFilter, children: [
            /* @__PURE__ */ jsx(SelectTrigger, { className: "w-full md:w-44 bg-surface-2", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "All Categories" }),
              categories.map((cat) => /* @__PURE__ */ jsx(SelectItem, { value: cat, children: cat }, cat))
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        list.map((a) => /* @__PURE__ */ jsxs(Card, { className: `p-4 flex flex-row items-start gap-4 transition-all ${a.resolved ? "opacity-45 bg-muted/20" : "bg-card hover:border-primary/20"}`, children: [
          /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center flex-wrap gap-2 mb-1.5", children: [
              /* @__PURE__ */ jsx(SeverityBadge, { severity: a.severity }),
              /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-[10px] py-0", children: a.category }),
              /* @__PURE__ */ jsx("span", { className: "text-[10px] text-muted-foreground font-mono", children: a.time })
            ] }),
            /* @__PURE__ */ jsx("p", { className: `font-semibold text-sm ${a.resolved ? "line-through text-muted-foreground" : "text-foreground"}`, children: a.title }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1 leading-relaxed", children: a.description })
          ] }),
          /* @__PURE__ */ jsxs(Button, { variant: a.resolved ? "ghost" : "outline", size: "sm", className: `h-8 shrink-0 ${a.resolved ? "text-muted-foreground" : "border-primary/20 hover:bg-primary/5 hover:text-primary"}`, onClick: () => handleResolve(a.id, a.resolved), children: [
            /* @__PURE__ */ jsx(Check, { className: "size-3.5 mr-1" }),
            a.resolved ? "Resolve" : "Resolve"
          ] })
        ] }, a.id)),
        list.length === 0 && /* @__PURE__ */ jsxs("div", { className: "text-center py-16", children: [
          /* @__PURE__ */ jsx(CheckCircle2, { className: "size-10 mx-auto text-success/60 mb-3" }),
          /* @__PURE__ */ jsx("p", { className: "font-semibold text-sm text-foreground", children: "Zero Alerts Found" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "No alerts match your current filter preferences." })
        ] })
      ] })
    ] })
  ] });
}
export {
  AlertsPage as component
};
