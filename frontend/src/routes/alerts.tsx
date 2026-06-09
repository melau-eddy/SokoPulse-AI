import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Check, ShieldAlert, Sparkles, Filter, CheckCircle2, RotateCcw } from "lucide-react";
import { PageHeader } from "@/components/app-shell";
import { SectionCard, KpiCard, SeverityBadge } from "@/components/widgets";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { alerts as seed, type Severity, type Alert } from "@/lib/mock-data";
import { apiClient } from "../lib/api-client";
import { toast } from "sonner";

export const Route = createFileRoute("/alerts")({
  head: () => ({ meta: [{ title: "Alerts & Notifications — SokoPulse AI" }] }),
  component: AlertsPage,
});

const sampleScenarios = [
  { title: "Anomaly detected: Titan Castings demand", desc: "Sales spike +65% over past 12h, suspected supply run by competitor.", category: "Demand", severity: "high" as const },
  { title: "Expiring batch: Lithium cells Mod-8", desc: "150 units expiring in 15 days in East warehouse.", category: "Inventory", severity: "medium" as const },
  { title: "Competitor Price Match opportunity", desc: "Nexus Supply raised Apex-9 price by $35. Recommended parity adjustment: +2.9%.", category: "Pricing", severity: "low" as const },
  { title: "Integration sync failed: NetSuite ERP", desc: "API connection timeout during batch ledger transfer.", category: "System", severity: "critical" as const },
  { title: "Fulfillment delay: SunGrid panels", desc: "Shipment #PO-9471 delayed by 4 days due to port congestion.", category: "Supplier", severity: "medium" as const },
];

function AlertsPage() {
  const [data, setData] = useState<Alert[]>(() =>
    seed.map((a) => ({ ...a, resolved: a.resolved ?? false }))
  );
  const [severityFilter, setSeverityFilter] = useState<"all" | Severity>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Load alerts from backend
  useEffect(() => {
    apiClient.getAlerts().then((data) => {
      if (data) {
        setData(data);
      }
    });
  }, []);

  // Filter computations
  const list = data.filter((a) => {
    const matchesSeverity = severityFilter === "all" || a.severity === severityFilter;
    const matchesCategory = categoryFilter === "all" || a.category === categoryFilter;
    return matchesSeverity && matchesCategory;
  });

  const categories = Array.from(new Set(data.map((a) => a.category)));

  const counts: Record<Severity | "all", number> = {
    all: data.length,
    critical: data.filter((a) => a.severity === "critical").length,
    high: data.filter((a) => a.severity === "high").length,
    medium: data.filter((a) => a.severity === "medium").length,
    low: data.filter((a) => a.severity === "low").length,
  };

  const handleResolve = (id: string, currentlyResolved: boolean) => {
    const nextResolvedState = !currentlyResolved;
    apiClient.resolveAlert(id, nextResolvedState).then((serverAlert) => {
      setData((prev) =>
        prev.map((item) => (item.id === id ? { ...item, resolved: nextResolvedState } : item))
      );
      toast.success(currentlyResolved ? "Alert marked as unresolved" : "Alert marked as resolved");
    });
  };

  const handleResolveAll = () => {
    const unresolved = list.filter((a) => !a.resolved);
    if (unresolved.length === 0) {
      toast.info("No active alerts to resolve in this view.");
      return;
    }

    // Sequentially or bulk resolve on local state
    const resolvePromises = unresolved.map((item) => apiClient.resolveAlert(item.id, true));
    
    Promise.all(resolvePromises).then(() => {
      setData((prev) =>
        prev.map((item) => {
          const matchesSeverity = severityFilter === "all" || item.severity === severityFilter;
          const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
          if (matchesSeverity && matchesCategory) {
            return { ...item, resolved: true };
          }
          return item;
        })
      );
      toast.success(`Resolved ${unresolved.length} alerts in current filter view.`);
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
            },
          },
        });
      } else {
        // Standalone fallback
        const scenario = sampleScenarios[Math.floor(Math.random() * sampleScenarios.length)];
        const newId = `sim-${Date.now()}`;
        const newAlert: Alert = {
          id: newId,
          title: scenario.title,
          description: scenario.desc,
          severity: scenario.severity,
          time: "Just now",
          category: scenario.category,
          resolved: false,
        };

        setData((prev) => [newAlert, ...prev]);
        toast(scenario.title, { description: scenario.desc });
      }
    });
  };

  const resetAll = () => {
    apiClient.getAlerts().then((serverData) => {
      if (serverData) {
        setData(serverData);
      } else {
        setData(seed.map((a) => ({ ...a, resolved: a.resolved ?? false })));
      }
      setSeverityFilter("all");
      setCategoryFilter("all");
      toast.success("Alert list reset to default states.");
    });
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      <PageHeader
        title="Alerts & Notifications"
        description="Real-time predictive telemetry alerts spanning inventory levels, pricing signals, and supply integrity."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={resetAll}>
              <RotateCcw className="size-3.5 mr-1" /> Reset
            </Button>
            <Button variant="outline" size="sm" onClick={handleSimulateAlert} className="border-primary/40 text-primary hover:bg-primary/10">
              <Sparkles className="size-3.5 mr-1.5" /> Trigger Simulated Alert
            </Button>
            <Button size="sm" onClick={handleResolveAll}>
              <CheckCircle2 className="size-3.5 mr-1.5" /> Resolve Filtered
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <KpiCard label="Open Alerts" value={`${data.filter((a) => !a.resolved).length}`} accent="primary" />
        <KpiCard label="Critical Urgency" value={`${counts.critical}`} accent="destructive" />
        <KpiCard label="High Urgency" value={`${counts.high}`} accent="warning" />
        <KpiCard label="Resolved (7d)" value="48" delta="+12" trend="up" accent="success" />
      </div>

      <SectionCard>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4 border-b border-border/40 pb-4">
          <Tabs value={severityFilter} onValueChange={(v) => setSeverityFilter(v as any)} className="w-full md:w-auto">
            <TabsList className="flex-wrap h-auto">
              <TabsTrigger value="all">All ({counts.all})</TabsTrigger>
              <TabsTrigger value="critical" className="data-[state=active]:bg-destructive/10 data-[state=active]:text-destructive">Critical ({counts.critical})</TabsTrigger>
              <TabsTrigger value="high" className="data-[state=active]:bg-warning/10 data-[state=active]:text-warning">High ({counts.high})</TabsTrigger>
              <TabsTrigger value="medium">Medium ({counts.medium})</TabsTrigger>
              <TabsTrigger value="low">Low ({counts.low})</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="size-3.5 text-muted-foreground shrink-0" />
            <span className="text-xs text-muted-foreground whitespace-nowrap">Filter Category:</span>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-44 bg-surface-2"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-3">
          {list.map((a) => (
            <Card key={a.id} className={`p-4 flex flex-row items-start gap-4 transition-all ${a.resolved ? "opacity-45 bg-muted/20" : "bg-card hover:border-primary/20"}`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center flex-wrap gap-2 mb-1.5">
                  <SeverityBadge severity={a.severity} />
                  <Badge variant="secondary" className="text-[10px] py-0">{a.category}</Badge>
                  <span className="text-[10px] text-muted-foreground font-mono">{a.time}</span>
                </div>
                <p className={`font-semibold text-sm ${a.resolved ? "line-through text-muted-foreground" : "text-foreground"}`}>
                  {a.title}
                </p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{a.description}</p>
              </div>
              <Button
                variant={a.resolved ? "ghost" : "outline"}
                size="sm"
                className={`h-8 shrink-0 ${a.resolved ? "text-muted-foreground" : "border-primary/20 hover:bg-primary/5 hover:text-primary"}`}
                onClick={() => handleResolve(a.id, a.resolved)}
              >
                <Check className="size-3.5 mr-1" />
                {a.resolved ? "Resolve" : "Resolve"}
              </Button>
            </Card>
          ))}
          {list.length === 0 && (
            <div className="text-center py-16">
              <CheckCircle2 className="size-10 mx-auto text-success/60 mb-3" />
              <p className="font-semibold text-sm text-foreground">Zero Alerts Found</p>
              <p className="text-xs text-muted-foreground mt-1">No alerts match your current filter preferences.</p>
            </div>
          )}
        </div>
      </SectionCard>
    </div>
  );
}
