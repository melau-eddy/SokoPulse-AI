import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Search,
  SlidersHorizontal,
  Plus,
  History,
  RefreshCw,
  Pencil,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { PageHeader } from "@/components/app-shell";
import { SectionCard, StatusBadge } from "@/components/widgets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import {
  products as seedProducts,
  type Product,
  type InventoryStatus,
} from "@/lib/mock-data";
import { apiClient } from "../lib/api-client";
import { toast } from "sonner";

export const Route = createFileRoute("/inventory")({
  head: () => ({ meta: [{ title: "Inventory — SokoPulse AI" }] }),
  component: InventoryPage,
});

interface AuditLog {
  date: string;
  type: "sale" | "restock" | "audit";
  description: string;
  change: number;
}

const mockHistoryData: Record<string, AuditLog[]> = {
  p1: [
    {
      date: "2026-06-08",
      type: "sale",
      description: "Regular fulfillment",
      change: -5,
    },
    {
      date: "2026-06-05",
      type: "sale",
      description: "Regular fulfillment",
      change: -8,
    },
    {
      date: "2026-06-01",
      type: "audit",
      description: "Cycle count adjustment",
      change: +2,
    },
  ],
  p2: [
    {
      date: "2026-06-07",
      type: "sale",
      description: "Production dispatch",
      change: -40,
    },
    {
      date: "2026-06-01",
      type: "restock",
      description: "Bulk order receipt",
      change: +100,
    },
  ],
  p3: [
    {
      date: "2026-06-09",
      type: "sale",
      description: "Core shipment",
      change: -10,
    },
    {
      date: "2026-06-02",
      type: "restock",
      description: "Foundry batch arrival",
      change: +250,
    },
  ],
};

function InventoryPage() {
  const [products, setProducts] = useState<Product[]>(seedProducts);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");
  const [active, setActive] = useState<Product | null>(null);

  // Drawer States
  const [isEditing, setIsEditing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Product>>({});

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Load products from backend and check search query params
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const searchParam = params.get("search");
      if (searchParam) {
        setQ(searchParam);
      }
    }
    apiClient.getProducts().then((data) => {
      if (data && data.length > 0) {
        setProducts(
          data.map((p: any) => ({
            id: String(p.id),
            name: p.product_name,
            sku: p.sku,
            category: p.category,
            stock: p.stock !== undefined ? p.stock : 14,
            reorderPoint: p.reorder_point || 0,
            expiry: p.expiry_date || "",
            status: p.status,
            supplier: p.supplier || "",
            price: Number(p.unit_price) || 0,
          })),
        );
      }
    });
  }, []);

  const cats = Array.from(new Set(products.map((p) => p.category)));
  const filtered = products.filter(
    (p) =>
      (cat === "all" || p.category === cat) &&
      (q === "" ||
        p.name.toLowerCase().includes(q.toLowerCase()) ||
        p.sku.toLowerCase().includes(q.toLowerCase())),
  );

  // Pagination computation
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filtered.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleOpenProduct = (p: Product) => {
    setActive(p);
    setEditForm(p);
    setIsEditing(false);
    setShowHistory(false);
  };

  const startEdit = () => {
    if (!active) return;
    setEditForm({ ...active });
    setIsEditing(true);
    setShowHistory(false);
  };

  const saveEdit = () => {
    if (!active) return;

    const stockNum = Number(editForm.stock);
    const reorderNum = Number(editForm.reorderPoint);

    let newStatus: InventoryStatus = "healthy";
    if (stockNum === 0 || stockNum <= reorderNum * 0.2) newStatus = "critical";
    else if (stockNum <= reorderNum) newStatus = "low";
    else if (stockNum >= reorderNum * 4) newStatus = "overstocked";

    const payload = {
      sku: editForm.sku ?? active.sku,
      product_name: editForm.name ?? active.name,
      category: editForm.category ?? active.category,
      unit_price: Number(editForm.price) || active.price,
      reorder_point: isNaN(reorderNum) ? active.reorderPoint : reorderNum,
      expiry_date: editForm.expiry || null,
      status: newStatus,
      supplier: editForm.supplier ?? active.supplier,
    };

    apiClient.updateProduct(active.id, payload).then((serverProd) => {
      const finalProd = serverProd
        ? {
            id: String(serverProd.id),
            name: serverProd.product_name,
            sku: serverProd.sku,
            category: serverProd.category,
            stock: serverProd.stock !== undefined ? serverProd.stock : stockNum,
            reorderPoint: serverProd.reorder_point || 0,
            expiry: serverProd.expiry_date || "",
            status: serverProd.status,
            supplier: serverProd.supplier || "",
            price: Number(serverProd.unit_price) || 0,
          }
        : { ...active, ...editForm, status: newStatus, stock: stockNum };

      setProducts((prev) =>
        prev.map((p) => (p.id === active.id ? finalProd : p)),
      );
      setActive(finalProd);
      setIsEditing(false);
      toast.success("Product details updated successfully!");
    });
  };

  const triggerRestock = (id: string) => {
    const p = products.find((prod) => prod.id === id);
    if (!p) return;

    const restockQty = Math.round(p.reorderPoint * 1.5) || 100;
    const updatedStock = p.stock + restockQty;

    apiClient.restockProduct(id).then((serverProd) => {
      const finalProd = serverProd
        ? {
            id: String(serverProd.id),
            name: serverProd.product_name,
            sku: serverProd.sku,
            category: serverProd.category,
            stock:
              serverProd.stock !== undefined ? serverProd.stock : updatedStock,
            reorderPoint: serverProd.reorder_point || 0,
            expiry: serverProd.expiry_date || "",
            status: serverProd.status,
            supplier: serverProd.supplier || "",
            price: Number(serverProd.unit_price) || 0,
          }
        : { ...p, stock: updatedStock, status: "healthy" as const };

      setProducts((prev) =>
        prev.map((prod) => (prod.id === id ? finalProd : prod)),
      );
      setActive(finalProd);

      // Add log to simulated history
      const newLog: AuditLog = {
        date: new Date().toISOString().split("T")[0],
        type: "restock",
        description: "Emergency replenishment restock",
        change: restockQty,
      };
      if (!mockHistoryData[id]) mockHistoryData[id] = [];
      mockHistoryData[id] = [newLog, ...mockHistoryData[id]];

      toast.success(
        `Replenishment triggered: +${restockQty} units ordered for ${p.name}.`,
      );
    });
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      <PageHeader
        title="Inventory"
        description={`Managing ${products.length} active SKUs across categories.`}
        actions={
          <>
            <Button variant="outline" size="sm">
              <SlidersHorizontal className="size-4" /> Filters
            </Button>
            <Button
              size="sm"
              onClick={() => toast.info("Create product workflow launched")}
            >
              <Plus className="size-4" /> Add product
            </Button>
          </>
        }
      />

      <SectionCard>
        <div className="flex flex-col md:flex-row gap-3 mb-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or SKU…"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setCurrentPage(1); // Reset page to 1
              }}
              className="pl-9"
            />
          </div>
          <Select
            value={cat}
            onValueChange={(v) => {
              setCat(v);
              setCurrentPage(1); // Reset page to 1
            }}
          >
            <SelectTrigger className="md:w-56">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {cats.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead className="text-right">Reorder</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedItems.map((p) => (
                <TableRow
                  key={p.id}
                  className="cursor-pointer hover:bg-muted/40"
                  onClick={() => handleOpenProduct(p)}
                >
                  <TableCell>
                    <p className="font-medium text-sm">{p.name}</p>
                    <p className="text-[10px] font-mono text-muted-foreground uppercase">
                      {p.sku}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{p.category}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {p.stock.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-mono text-muted-foreground">
                    {p.reorderPoint.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {p.expiry}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={p.status} />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {p.supplier}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Inspect
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center text-muted-foreground py-12"
                  >
                    No products match your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border pt-4 mt-2">
            <span className="text-xs text-muted-foreground">
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + itemsPerPage, filtered.length)} of{" "}
              {filtered.length} products
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="size-4" />
              </Button>
              <span className="text-xs font-mono">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </SectionCard>

      <Sheet open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          {active && (
            <>
              <SheetHeader>
                <SheetTitle className="text-lg font-bold">
                  {isEditing ? "Edit Product Details" : active.name}
                </SheetTitle>
                <SheetDescription className="font-mono uppercase text-[10px]">
                  {active.sku}
                </SheetDescription>
              </SheetHeader>

              {isEditing ? (
                // Edit Form Layout
                <div className="space-y-4 py-4 px-1">
                  <div className="grid gap-2">
                    <Label htmlFor="editName">Product Name</Label>
                    <Input
                      id="editName"
                      value={editForm.name ?? ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="grid gap-2">
                      <Label htmlFor="editSku">SKU</Label>
                      <Input
                        id="editSku"
                        value={editForm.sku ?? ""}
                        onChange={(e) =>
                          setEditForm({ ...editForm, sku: e.target.value })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="editCategory">Category</Label>
                      <Input
                        id="editCategory"
                        value={editForm.category ?? ""}
                        onChange={(e) =>
                          setEditForm({ ...editForm, category: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="grid gap-2">
                      <Label htmlFor="editStock">Current Stock</Label>
                      <Input
                        id="editStock"
                        type="number"
                        value={editForm.stock ?? 0}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            stock: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="editReorder">Reorder Point</Label>
                      <Input
                        id="editReorder"
                        type="number"
                        value={editForm.reorderPoint ?? 0}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            reorderPoint: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="grid gap-2">
                      <Label htmlFor="editPrice">Unit Price ($)</Label>
                      <Input
                        id="editPrice"
                        type="number"
                        value={editForm.price ?? 0}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            price: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="editExpiry">Expiry Date</Label>
                      <Input
                        id="editExpiry"
                        type="date"
                        value={editForm.expiry ?? ""}
                        onChange={(e) =>
                          setEditForm({ ...editForm, expiry: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="editSupplier">Supplier Name</Label>
                    <Input
                      id="editSupplier"
                      value={editForm.supplier ?? ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, supplier: e.target.value })
                      }
                    />
                  </div>

                  <div className="flex gap-2 pt-4 justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(false)}
                    >
                      <X className="size-3.5 mr-1" /> Cancel
                    </Button>
                    <Button size="sm" onClick={saveEdit}>
                      <Check className="size-3.5 mr-1" /> Save changes
                    </Button>
                  </div>
                </div>
              ) : (
                // Regular Display details
                <div className="space-y-6 py-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Stat
                      label="Stock Level"
                      value={active.stock.toLocaleString()}
                    />
                    <Stat
                      label="Reorder Point"
                      value={active.reorderPoint.toLocaleString()}
                    />
                    <Stat label="Unit Price" value={`$${active.price}`} />
                    <Stat label="Category" value={active.category} />
                    <Stat label="Expiry Date" value={active.expiry} />
                    <Stat label="Primary Supplier" value={active.supplier} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      Inventory Health:
                    </span>
                    <StatusBadge status={active.status} />
                  </div>

                  {/* History Ledger section */}
                  {showHistory && (
                    <div className="space-y-2 border-t border-border pt-4">
                      <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-2 flex items-center gap-1.5">
                        <History className="size-3.5" />
                        Audits & Movements Log
                      </h4>
                      <div className="space-y-1.5 max-h-[180px] overflow-y-auto pr-1">
                        {(mockHistoryData[active.id] ?? []).map((h, i) => (
                          <div
                            key={i}
                            className="flex justify-between items-center text-xs p-2 rounded bg-surface-2 border border-border/40"
                          >
                            <div>
                              <span className="font-medium text-[11px] text-muted-foreground">
                                {h.date}
                              </span>
                              <p className="text-foreground">{h.description}</p>
                            </div>
                            <span
                              className={`font-mono font-semibold ${h.change >= 0 ? "text-success" : "text-destructive"}`}
                            >
                              {h.change >= 0 ? "+" : ""}
                              {h.change}
                            </span>
                          </div>
                        ))}
                        {(!mockHistoryData[active.id] ||
                          mockHistoryData[active.id].length === 0) && (
                          <p className="text-xs text-muted-foreground italic text-center py-4">
                            No recent stock logs recorded.
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-2 border-t border-border pt-6">
                    <Button variant="outline" size="sm" onClick={startEdit}>
                      <Pencil className="size-4 mr-1.5" /> Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowHistory(!showHistory)}
                      className={showHistory ? "bg-muted text-foreground" : ""}
                    >
                      <History className="size-4 mr-1.5" /> History
                    </Button>
                    <Button size="sm" onClick={() => triggerRestock(active.id)}>
                      <RefreshCw className="size-4 mr-1.5" /> Restock
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-surface-2 p-3">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="text-sm font-semibold font-mono mt-1 text-foreground leading-tight">
        {value}
      </p>
    </div>
  );
}
