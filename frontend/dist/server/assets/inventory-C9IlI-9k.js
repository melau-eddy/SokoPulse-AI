import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import * as React from "react";
import { useState, useEffect } from "react";
import { X, SlidersHorizontal, Plus, Search, ChevronLeft, ChevronRight, Check, History, Pencil, RefreshCw } from "lucide-react";
import { h as cn, a as apiClient, P as PageHeader, b as Button, I as Input, B as Badge, L as Label } from "./router-CW7eBXfp.js";
import { S as SectionCard, b as StatusBadge } from "./widgets-DfMMOCsK.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BY8DFhlG.js";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cva } from "class-variance-authority";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-CA8m2P1H.js";
import { b as products } from "./mock-data-CXBJH4HK.js";
import { toast } from "sonner";
import "@tanstack/react-query";
import "@tanstack/react-router";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "@radix-ui/react-avatar";
import "@radix-ui/react-label";
import "@radix-ui/react-progress";
import "@radix-ui/react-select";
const Sheet = DialogPrimitive.Root;
const SheetPortal = DialogPrimitive.Portal;
const SheetOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Overlay,
  {
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props,
    ref
  }
));
SheetOverlay.displayName = DialogPrimitive.Overlay.displayName;
const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
      }
    },
    defaultVariants: {
      side: "right"
    }
  }
);
const SheetContent = React.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ jsxs(SheetPortal, { children: [
  /* @__PURE__ */ jsx(SheetOverlay, {}),
  /* @__PURE__ */ jsxs(DialogPrimitive.Content, { ref, className: cn(sheetVariants({ side }), className), ...props, children: [
    /* @__PURE__ */ jsxs(DialogPrimitive.Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary", children: [
      /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }),
      /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
    ] }),
    children
  ] })
] }));
SheetContent.displayName = DialogPrimitive.Content.displayName;
const SheetHeader = ({ className, ...props }) => /* @__PURE__ */ jsx("div", { className: cn("flex flex-col space-y-2 text-center sm:text-left", className), ...props });
SheetHeader.displayName = "SheetHeader";
const SheetTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Title,
  {
    ref,
    className: cn("text-lg font-semibold text-foreground", className),
    ...props
  }
));
SheetTitle.displayName = DialogPrimitive.Title.displayName;
const SheetDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
SheetDescription.displayName = DialogPrimitive.Description.displayName;
const mockHistoryData = {
  p1: [{
    date: "2026-06-08",
    type: "sale",
    description: "Regular fulfillment",
    change: -5
  }, {
    date: "2026-06-05",
    type: "sale",
    description: "Regular fulfillment",
    change: -8
  }, {
    date: "2026-06-01",
    type: "audit",
    description: "Cycle count adjustment",
    change: 2
  }],
  p2: [{
    date: "2026-06-07",
    type: "sale",
    description: "Production dispatch",
    change: -40
  }, {
    date: "2026-06-01",
    type: "restock",
    description: "Bulk order receipt",
    change: 100
  }],
  p3: [{
    date: "2026-06-09",
    type: "sale",
    description: "Core shipment",
    change: -10
  }, {
    date: "2026-06-02",
    type: "restock",
    description: "Foundry batch arrival",
    change: 250
  }]
};
function InventoryPage() {
  const [products$1, setProducts] = useState(products);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [active, setActive] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
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
        setProducts(data.map((p) => ({
          id: String(p.id),
          name: p.product_name,
          sku: p.sku,
          category: p.category,
          stock: p.stock !== void 0 ? p.stock : 14,
          reorderPoint: p.reorder_point || 0,
          expiry: p.expiry_date || "",
          status: p.status,
          supplier: p.supplier || "",
          price: Number(p.unit_price) || 0
        })));
      }
    });
  }, []);
  const cats = Array.from(new Set(products$1.map((p) => p.category)));
  const filtered = products$1.filter((p) => (cat === "all" || p.category === cat) && (q === "" || p.name.toLowerCase().includes(q.toLowerCase()) || p.sku.toLowerCase().includes(q.toLowerCase())));
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filtered.slice(startIndex, startIndex + itemsPerPage);
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  const handleOpenProduct = (p) => {
    setActive(p);
    setEditForm(p);
    setIsEditing(false);
    setShowHistory(false);
  };
  const startEdit = () => {
    if (!active) return;
    setEditForm({
      ...active
    });
    setIsEditing(true);
    setShowHistory(false);
  };
  const saveEdit = () => {
    if (!active) return;
    const stockNum = Number(editForm.stock);
    const reorderNum = Number(editForm.reorderPoint);
    let newStatus = "healthy";
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
      supplier: editForm.supplier ?? active.supplier
    };
    apiClient.updateProduct(active.id, payload).then((serverProd) => {
      const finalProd = serverProd ? {
        id: String(serverProd.id),
        name: serverProd.product_name,
        sku: serverProd.sku,
        category: serverProd.category,
        stock: serverProd.stock !== void 0 ? serverProd.stock : stockNum,
        reorderPoint: serverProd.reorder_point || 0,
        expiry: serverProd.expiry_date || "",
        status: serverProd.status,
        supplier: serverProd.supplier || "",
        price: Number(serverProd.unit_price) || 0
      } : {
        ...active,
        ...editForm,
        status: newStatus,
        stock: stockNum
      };
      setProducts((prev) => prev.map((p) => p.id === active.id ? finalProd : p));
      setActive(finalProd);
      setIsEditing(false);
      toast.success("Product details updated successfully!");
    });
  };
  const triggerRestock = (id) => {
    const p = products$1.find((prod) => prod.id === id);
    if (!p) return;
    const restockQty = Math.round(p.reorderPoint * 1.5) || 100;
    const updatedStock = p.stock + restockQty;
    apiClient.restockProduct(id).then((serverProd) => {
      const finalProd = serverProd ? {
        id: String(serverProd.id),
        name: serverProd.product_name,
        sku: serverProd.sku,
        category: serverProd.category,
        stock: serverProd.stock !== void 0 ? serverProd.stock : updatedStock,
        reorderPoint: serverProd.reorder_point || 0,
        expiry: serverProd.expiry_date || "",
        status: serverProd.status,
        supplier: serverProd.supplier || "",
        price: Number(serverProd.unit_price) || 0
      } : {
        ...p,
        stock: updatedStock,
        status: "healthy"
      };
      setProducts((prev) => prev.map((prod) => prod.id === id ? finalProd : prod));
      setActive(finalProd);
      const newLog = {
        date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
        type: "restock",
        description: "Emergency replenishment restock",
        change: restockQty
      };
      if (!mockHistoryData[id]) mockHistoryData[id] = [];
      mockHistoryData[id] = [newLog, ...mockHistoryData[id]];
      toast.success(`Replenishment triggered: +${restockQty} units ordered for ${p.name}.`);
    });
  };
  return /* @__PURE__ */ jsxs("div", { className: "p-6 lg:p-8 max-w-[1600px] mx-auto", children: [
    /* @__PURE__ */ jsx(PageHeader, { title: "Inventory", description: `Managing ${products$1.length} active SKUs across categories.`, actions: /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", children: [
        /* @__PURE__ */ jsx(SlidersHorizontal, { className: "size-4" }),
        " Filters"
      ] }),
      /* @__PURE__ */ jsxs(Button, { size: "sm", onClick: () => toast.info("Create product workflow launched"), children: [
        /* @__PURE__ */ jsx(Plus, { className: "size-4" }),
        " Add product"
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs(SectionCard, { children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row gap-3 mb-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative flex-1", children: [
          /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" }),
          /* @__PURE__ */ jsx(Input, { placeholder: "Search by name or SKU…", value: q, onChange: (e) => {
            setQ(e.target.value);
            setCurrentPage(1);
          }, className: "pl-9" })
        ] }),
        /* @__PURE__ */ jsxs(Select, { value: cat, onValueChange: (v) => {
          setCat(v);
          setCurrentPage(1);
        }, children: [
          /* @__PURE__ */ jsx(SelectTrigger, { className: "md:w-56", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "All categories" }),
            cats.map((c) => /* @__PURE__ */ jsx(SelectItem, { value: c, children: c }, c))
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableHead, { children: "Product" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Category" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Stock" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Reorder" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Expiry" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Status" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Supplier" }),
          /* @__PURE__ */ jsx(TableHead, {})
        ] }) }),
        /* @__PURE__ */ jsxs(TableBody, { children: [
          paginatedItems.map((p) => /* @__PURE__ */ jsxs(TableRow, { className: "cursor-pointer hover:bg-muted/40", onClick: () => handleOpenProduct(p), children: [
            /* @__PURE__ */ jsxs(TableCell, { children: [
              /* @__PURE__ */ jsx("p", { className: "font-medium text-sm", children: p.name }),
              /* @__PURE__ */ jsx("p", { className: "text-[10px] font-mono text-muted-foreground uppercase", children: p.sku })
            ] }),
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, { variant: "secondary", children: p.category }) }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-right font-mono", children: p.stock.toLocaleString() }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-right font-mono text-muted-foreground", children: p.reorderPoint.toLocaleString() }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-muted-foreground text-sm", children: p.expiry }),
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(StatusBadge, { status: p.status }) }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-sm text-muted-foreground", children: p.supplier }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", children: "Inspect" }) })
          ] }, p.id)),
          filtered.length === 0 && /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 8, className: "text-center text-muted-foreground py-12", children: "No products match your filters." }) })
        ] })
      ] }) }),
      totalPages > 1 && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-t border-border pt-4 mt-2", children: [
        /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground", children: [
          "Showing ",
          startIndex + 1,
          " to ",
          Math.min(startIndex + itemsPerPage, filtered.length),
          " of ",
          filtered.length,
          " products"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", className: "h-8 w-8 p-0", onClick: () => handlePageChange(currentPage - 1), disabled: currentPage === 1, children: /* @__PURE__ */ jsx(ChevronLeft, { className: "size-4" }) }),
          /* @__PURE__ */ jsxs("span", { className: "text-xs font-mono", children: [
            "Page ",
            currentPage,
            " of ",
            totalPages
          ] }),
          /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", className: "h-8 w-8 p-0", onClick: () => handlePageChange(currentPage + 1), disabled: currentPage === totalPages, children: /* @__PURE__ */ jsx(ChevronRight, { className: "size-4" }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Sheet, { open: !!active, onOpenChange: (o) => !o && setActive(null), children: /* @__PURE__ */ jsx(SheetContent, { className: "sm:max-w-md overflow-y-auto", children: active && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs(SheetHeader, { children: [
        /* @__PURE__ */ jsx(SheetTitle, { className: "text-lg font-bold", children: isEditing ? "Edit Product Details" : active.name }),
        /* @__PURE__ */ jsx(SheetDescription, { className: "font-mono uppercase text-[10px]", children: active.sku })
      ] }),
      isEditing ? (
        // Edit Form Layout
        /* @__PURE__ */ jsxs("div", { className: "space-y-4 py-4 px-1", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "editName", children: "Product Name" }),
            /* @__PURE__ */ jsx(Input, { id: "editName", value: editForm.name ?? "", onChange: (e) => setEditForm({
              ...editForm,
              name: e.target.value
            }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "editSku", children: "SKU" }),
              /* @__PURE__ */ jsx(Input, { id: "editSku", value: editForm.sku ?? "", onChange: (e) => setEditForm({
                ...editForm,
                sku: e.target.value
              }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "editCategory", children: "Category" }),
              /* @__PURE__ */ jsx(Input, { id: "editCategory", value: editForm.category ?? "", onChange: (e) => setEditForm({
                ...editForm,
                category: e.target.value
              }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "editStock", children: "Current Stock" }),
              /* @__PURE__ */ jsx(Input, { id: "editStock", type: "number", value: editForm.stock ?? 0, onChange: (e) => setEditForm({
                ...editForm,
                stock: Number(e.target.value)
              }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "editReorder", children: "Reorder Point" }),
              /* @__PURE__ */ jsx(Input, { id: "editReorder", type: "number", value: editForm.reorderPoint ?? 0, onChange: (e) => setEditForm({
                ...editForm,
                reorderPoint: Number(e.target.value)
              }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "editPrice", children: "Unit Price ($)" }),
              /* @__PURE__ */ jsx(Input, { id: "editPrice", type: "number", value: editForm.price ?? 0, onChange: (e) => setEditForm({
                ...editForm,
                price: Number(e.target.value)
              }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "editExpiry", children: "Expiry Date" }),
              /* @__PURE__ */ jsx(Input, { id: "editExpiry", type: "date", value: editForm.expiry ?? "", onChange: (e) => setEditForm({
                ...editForm,
                expiry: e.target.value
              }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "editSupplier", children: "Supplier Name" }),
            /* @__PURE__ */ jsx(Input, { id: "editSupplier", value: editForm.supplier ?? "", onChange: (e) => setEditForm({
              ...editForm,
              supplier: e.target.value
            }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2 pt-4 justify-end", children: [
            /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", onClick: () => setIsEditing(false), children: [
              /* @__PURE__ */ jsx(X, { className: "size-3.5 mr-1" }),
              " Cancel"
            ] }),
            /* @__PURE__ */ jsxs(Button, { size: "sm", onClick: saveEdit, children: [
              /* @__PURE__ */ jsx(Check, { className: "size-3.5 mr-1" }),
              " Save changes"
            ] })
          ] })
        ] })
      ) : (
        // Regular Display details
        /* @__PURE__ */ jsxs("div", { className: "space-y-6 py-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsx(Stat, { label: "Stock Level", value: active.stock.toLocaleString() }),
            /* @__PURE__ */ jsx(Stat, { label: "Reorder Point", value: active.reorderPoint.toLocaleString() }),
            /* @__PURE__ */ jsx(Stat, { label: "Unit Price", value: `$${active.price}` }),
            /* @__PURE__ */ jsx(Stat, { label: "Category", value: active.category }),
            /* @__PURE__ */ jsx(Stat, { label: "Expiry Date", value: active.expiry }),
            /* @__PURE__ */ jsx(Stat, { label: "Primary Supplier", value: active.supplier })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: "Inventory Health:" }),
            /* @__PURE__ */ jsx(StatusBadge, { status: active.status })
          ] }),
          showHistory && /* @__PURE__ */ jsxs("div", { className: "space-y-2 border-t border-border pt-4", children: [
            /* @__PURE__ */ jsxs("h4", { className: "text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-2 flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsx(History, { className: "size-3.5" }),
              "Audits & Movements Log"
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-1.5 max-h-[180px] overflow-y-auto pr-1", children: [
              (mockHistoryData[active.id] ?? []).map((h, i) => /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center text-xs p-2 rounded bg-surface-2 border border-border/40", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("span", { className: "font-medium text-[11px] text-muted-foreground", children: h.date }),
                  /* @__PURE__ */ jsx("p", { className: "text-foreground", children: h.description })
                ] }),
                /* @__PURE__ */ jsxs("span", { className: `font-mono font-semibold ${h.change >= 0 ? "text-success" : "text-destructive"}`, children: [
                  h.change >= 0 ? "+" : "",
                  h.change
                ] })
              ] }, i)),
              (!mockHistoryData[active.id] || mockHistoryData[active.id].length === 0) && /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground italic text-center py-4", children: "No recent stock logs recorded." })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2 border-t border-border pt-6", children: [
            /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", onClick: startEdit, children: [
              /* @__PURE__ */ jsx(Pencil, { className: "size-4 mr-1.5" }),
              " Edit"
            ] }),
            /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", onClick: () => setShowHistory(!showHistory), className: showHistory ? "bg-muted text-foreground" : "", children: [
              /* @__PURE__ */ jsx(History, { className: "size-4 mr-1.5" }),
              " History"
            ] }),
            /* @__PURE__ */ jsxs(Button, { size: "sm", onClick: () => triggerRestock(active.id), children: [
              /* @__PURE__ */ jsx(RefreshCw, { className: "size-4 mr-1.5" }),
              " Restock"
            ] })
          ] })
        ] })
      )
    ] }) }) })
  ] });
}
function Stat({
  label,
  value
}) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-md border border-border bg-surface-2 p-3", children: [
    /* @__PURE__ */ jsx("p", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: label }),
    /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold font-mono mt-1 text-foreground leading-tight", children: value })
  ] });
}
export {
  InventoryPage as component
};
