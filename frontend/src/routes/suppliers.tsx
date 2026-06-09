import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/app-shell";
import { SectionCard, KpiCard } from "@/components/widgets";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { suppliers as seedSuppliers } from "@/lib/mock-data";
import { apiClient } from "../lib/api-client";
import { toast } from "sonner";

export const Route = createFileRoute("/suppliers")({
  head: () => ({ meta: [{ title: "Suppliers — SokoPulse AI" }] }),
  component: SuppliersPage,
});

function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<any[]>(seedSuppliers);

  useEffect(() => {
    apiClient.getSuppliers().then((data) => {
      if (data && data.length > 0) {
        setSuppliers(data.map((s: any) => ({
          id: String(s.id),
          name: s.supplier_name,
          reliability: Number(s.reliability_score) || 90,
          leadTime: s.lead_time_days || 7,
          activeOrders: s.active_orders || 0,
          country: s.country || "Global Partner",
          status: s.status || "active",
        })));
      }
    });
  }, []);

  // Compute stats dynamically
  const activeCount = suppliers.length;
  const avgReliability = activeCount > 0
    ? Math.round(suppliers.reduce((sum, s) => sum + s.reliability, 0) / activeCount)
    : 88;
  const avgLeadTime = activeCount > 0
    ? (suppliers.reduce((sum, s) => sum + s.leadTime, 0) / activeCount).toFixed(1)
    : "8.2";
  const delayedCount = suppliers.filter(s => s.status === "delayed").length;

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      <PageHeader title="Suppliers" description="Performance, reliability, and active orders across the supplier network." />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <KpiCard label="Active Suppliers" value={`${activeCount}`} accent="primary" />
        <KpiCard label="Avg. Reliability" value={`${avgReliability}%`} delta="+2%" trend="up" />
        <KpiCard label="Avg. Lead Time" value={`${avgLeadTime} days`} />
        <KpiCard label="Delayed Shipments" value={`${delayedCount}`} accent={delayedCount > 0 ? "destructive" : undefined} />
      </div>

      <SectionCard title="Top Suppliers" description="Sorted by active orders">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Supplier</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Reliability</TableHead>
              <TableHead className="text-right">Lead Time</TableHead>
              <TableHead className="text-right">Active Orders</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suppliers.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-medium">{s.name}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{s.country}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 w-44">
                    <Progress value={s.reliability} className="h-1.5 flex-1" />
                    <span className="text-xs font-mono">{s.reliability}%</span>
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono">{s.leadTime}d</TableCell>
                <TableCell className="text-right font-mono">{s.activeOrders}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      s.status === "active"
                        ? "bg-success/10 text-success border-success/30 capitalize"
                        : s.status === "delayed"
                          ? "bg-warning/10 text-warning border-warning/30 capitalize"
                          : "bg-muted text-muted-foreground capitalize"
                    }
                  >
                    {s.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => toast.info(`Viewing supplier audit for ${s.name}...`)}>View</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>
    </div>
  );
}
