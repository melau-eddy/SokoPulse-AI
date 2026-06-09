import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/app-shell";
import { SectionCard, KpiCard } from "@/components/widgets";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { suppliers as seedSuppliers } from "@/lib/mock-data";
import { apiClient } from "../lib/api-client";
import { toast } from "sonner";

export const Route = createFileRoute("/suppliers")({
  head: () => ({ meta: [{ title: "Suppliers — SokoPulse AI" }] }),
  component: SuppliersPage,
});

function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<any[]>(seedSuppliers);
  const [selectedSupplier, setSelectedSupplier] = useState<any | null>(null);

  useEffect(() => {
    apiClient.getSuppliers().then((data) => {
      if (data && data.length > 0) {
        setSuppliers(
          data.map((s: any) => ({
            id: String(s.id),
            name: s.supplier_name,
            reliability: Number(s.reliability_score) || 90,
            leadTime: s.lead_time_days || 7,
            activeOrders: s.active_orders || 0,
            country: s.country || "Global Partner",
            status: s.status || "active",
          })),
        );
      }
    });
  }, []);

  // Compute stats dynamically
  const activeCount = suppliers.length;
  const avgReliability =
    activeCount > 0
      ? Math.round(
          suppliers.reduce((sum, s) => sum + s.reliability, 0) / activeCount,
        )
      : 88;
  const avgLeadTime =
    activeCount > 0
      ? (
          suppliers.reduce((sum, s) => sum + s.leadTime, 0) / activeCount
        ).toFixed(1)
      : "8.2";
  const delayedCount = suppliers.filter((s) => s.status === "delayed").length;

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      <PageHeader
        title="Suppliers"
        description="Performance, reliability, and active orders across the supplier network."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <KpiCard
          label="Active Suppliers"
          value={`${activeCount}`}
          accent="primary"
        />
        <KpiCard
          label="Avg. Reliability"
          value={`${avgReliability}%`}
          delta="+2%"
          trend="up"
        />
        <KpiCard label="Avg. Lead Time" value={`${avgLeadTime} days`} />
        <KpiCard
          label="Delayed Shipments"
          value={`${delayedCount}`}
          accent={delayedCount > 0 ? "destructive" : undefined}
        />
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
                <TableCell className="text-muted-foreground text-sm">
                  {s.country}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 w-44">
                    <Progress value={s.reliability} className="h-1.5 flex-1" />
                    <span className="text-xs font-mono">{s.reliability}%</span>
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono">
                  {s.leadTime}d
                </TableCell>
                <TableCell className="text-right font-mono">
                  {s.activeOrders}
                </TableCell>
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
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedSupplier(s)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>

      {/* Supplier Detail Dialog */}
      <Dialog
        open={!!selectedSupplier}
        onOpenChange={(open) => !open && setSelectedSupplier(null)}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{selectedSupplier?.name}</DialogTitle>
            <DialogDescription>
              Performance profile and logistics dashboard.
            </DialogDescription>
          </DialogHeader>

          {selectedSupplier && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase">
                    Country
                  </p>
                  <p className="text-sm font-medium">
                    {selectedSupplier.country}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase">
                    Status
                  </p>
                  <Badge
                    variant="outline"
                    className={
                      selectedSupplier.status === "active"
                        ? "bg-success/10 text-success border-success/30 capitalize"
                        : "bg-warning/10 text-warning border-warning/30 capitalize"
                    }
                  >
                    {selectedSupplier.status}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase">
                    Reliability Score
                  </p>
                  <p className="text-sm font-mono font-medium">
                    {selectedSupplier.reliability}%
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase">
                    Avg. Lead Time
                  </p>
                  <p className="text-sm font-mono font-medium">
                    {selectedSupplier.leadTime} Days
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-border">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Order Overview
                </p>
                <div className="flex justify-between items-center bg-surface-2 p-3 rounded-md">
                  <div>
                    <p className="text-xs font-medium">
                      Active Purchase Orders
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Currently in transit or production
                    </p>
                  </div>
                  <span className="text-sm font-mono font-semibold">
                    {selectedSupplier.activeOrders} POs
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-border">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Contact Details
                </p>
                <p className="text-xs text-muted-foreground">
                  Email:{" "}
                  <span className="text-foreground font-mono">
                    logistics@
                    {selectedSupplier.name
                      .toLowerCase()
                      .replace(/[^a-z0-9]/g, "")}
                    .com
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Support Hotline:{" "}
                  <span className="text-foreground font-mono">
                    +1 (800) 555-019{selectedSupplier.id}
                  </span>
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedSupplier(null)}>
              Close Profile
            </Button>
            <Button
              onClick={() => {
                setSelectedSupplier(null);
                toast.success(
                  `Procurement pipeline synced with ${selectedSupplier?.name}`,
                );
              }}
            >
              Sync Pipeline
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
