import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useRouterState, Link, createRootRouteWithContext, useRouter, Outlet, HeadContent, Scripts, createFileRoute, lazyRouteComponent, createRouter } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import * as React from "react";
import { useState, useEffect } from "react";
import { Toaster as Toaster$1, toast } from "sonner";
import { X, Sparkles, LayoutDashboard, Boxes, Radar, TrendingUp, Tag, ShoppingCart, Truck, Bell, FileText, Settings, ChevronsLeft, Search, Sun, Moon } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as LabelPrimitive from "@radix-ui/react-label";
const Toaster = ({ ...props }) => {
  return /* @__PURE__ */ jsx(
    Toaster$1,
    {
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
const appCss = "/assets/styles-CAMdG5h6.css";
function reportLovableError(error, context = {}) {
  if (typeof window === "undefined") return;
  window.__lovableEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error"
    }
  );
}
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsx(
      Comp,
      {
        className: cn(buttonVariants({ variant, size, className })),
        ref,
        ...props
      }
    );
  }
);
Button.displayName = "Button";
const Avatar = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AvatarPrimitive.Root,
  {
    ref,
    className: cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    ),
    ...props
  }
));
Avatar.displayName = AvatarPrimitive.Root.displayName;
const AvatarImage = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AvatarPrimitive.Image,
  {
    ref,
    className: cn("aspect-square h-full w-full", className),
    ...props
  }
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;
const AvatarFallback = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AvatarPrimitive.Fallback,
  {
    ref,
    className: cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    ),
    ...props
  }
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;
const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({ className, variant, ...props }) {
  return /* @__PURE__ */ jsx("div", { className: cn(badgeVariants({ variant }), className), ...props });
}
const Dialog = DialogPrimitive.Root;
const DialogPortal = DialogPrimitive.Portal;
const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Overlay,
  {
    ref,
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props
  }
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;
const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(DialogPortal, { children: [
  /* @__PURE__ */ jsx(DialogOverlay, {}),
  /* @__PURE__ */ jsxs(
    DialogPrimitive.Content,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxs(DialogPrimitive.Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground", children: [
          /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
DialogContent.displayName = DialogPrimitive.Content.displayName;
const DialogHeader = ({
  className,
  ...props
}) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    ),
    ...props
  }
);
DialogHeader.displayName = "DialogHeader";
const DialogFooter = ({
  className,
  ...props
}) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    ),
    ...props
  }
);
DialogFooter.displayName = "DialogFooter";
const DialogTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Title,
  {
    ref,
    className: cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    ),
    ...props
  }
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;
const DialogDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;
const Input = React.forwardRef(
  ({ className, type, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "input",
      {
        type,
        className: cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Input.displayName = "Input";
const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);
const Label = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  LabelPrimitive.Root,
  {
    ref,
    className: cn(labelVariants(), className),
    ...props
  }
));
Label.displayName = LabelPrimitive.Root.displayName;
const API_BASE_URL = "http://localhost:5000/api";
async function safeFetch(endpoint, options) {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("sokopulse_token") : null;
    const authHeaders = {};
    if (token) {
      authHeaders["Authorization"] = `Bearer ${token}`;
    }
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
        ...options?.headers || {}
      }
    });
    if (res.status === 401 || res.status === 403) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("sokopulse_token");
        window.dispatchEvent(new Event("auth-expired"));
      }
    }
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.warn(
      `Backend connection failed for endpoint ${endpoint}. SokoPulse is running in standalone mock mode.`,
      error
    );
    return null;
  }
}
const apiClient = {
  // Auth
  login: async (credentials) => safeFetch("/auth/login/", {
    method: "POST",
    body: JSON.stringify(credentials)
  }),
  register: async (userData) => safeFetch("/auth/register/", {
    method: "POST",
    body: JSON.stringify(userData)
  }),
  // KPIs
  getKPIs: async () => safeFetch("/dashboard/kpis/"),
  // Products
  getProducts: async () => safeFetch("/products/"),
  updateProduct: async (id, data) => safeFetch(`/products/${id}/`, {
    method: "PUT",
    body: JSON.stringify(data)
  }),
  restockProduct: async (id) => safeFetch(`/products/${id}/restock/`, {
    method: "POST"
  }),
  // Competitors
  getCompetitors: async () => safeFetch("/competitors/"),
  triggerCompetitorScrape: async (industry, currencyOrCompetitors, competitors) => {
    let actualCurrency = void 0;
    let actualCompetitors = void 0;
    if (Array.isArray(currencyOrCompetitors)) {
      actualCompetitors = currencyOrCompetitors;
    } else if (typeof currencyOrCompetitors === "string") {
      actualCurrency = currencyOrCompetitors;
      actualCompetitors = competitors;
    }
    if (!actualCurrency && typeof window !== "undefined") {
      actualCurrency = localStorage.getItem("sokopulse_currency") || "USD";
    }
    return safeFetch("/competitors/", {
      method: "POST",
      body: JSON.stringify({
        industry,
        currency: actualCurrency,
        competitors: actualCompetitors
      })
    });
  },
  // Forecasting
  getForecasting: async () => safeFetch("/forecasting/"),
  // Dynamic Pricing
  getPricing: async () => safeFetch("/pricing/"),
  getRecommendations: async () => safeFetch("/recommendations/"),
  updateRecommendationStatus: async (id, status, overrideData) => safeFetch(`/recommendations/${id}/update_status/`, {
    method: "PUT",
    body: JSON.stringify({ status, ...overrideData })
  }),
  // Procurement
  getProcurement: async () => safeFetch("/procurement/"),
  getPurchaseOrders: async () => safeFetch("/purchase-orders/"),
  createPurchaseOrder: async (data) => safeFetch("/purchase-orders/", {
    method: "POST",
    body: JSON.stringify(data)
  }),
  // Sales
  getSales: async () => safeFetch("/sales/"),
  // Inventory
  getInventory: async () => safeFetch("/inventory/"),
  // Suppliers
  getSuppliers: async () => safeFetch("/suppliers/"),
  // Alerts
  getAlerts: async () => safeFetch("/alerts/"),
  resolveAlert: async (id, resolved) => safeFetch(`/alerts/${id}/resolve/`, {
    method: "PUT",
    body: JSON.stringify({ resolved })
  }),
  simulateAlert: async () => safeFetch("/alerts/simulate/", {
    method: "POST"
  }),
  // Settings
  updateIndustry: async (industry, currency, competitors) => safeFetch("/settings/industry/", {
    method: "POST",
    body: JSON.stringify({ industry, currency, competitors })
  }),
  // Database Sync/Tap Integration
  syncDatabase: async (dbType, filepath) => safeFetch("/sync/database/", {
    method: "POST",
    body: JSON.stringify({ db_type: dbType, filepath })
  })
};
const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/inventory", label: "Inventory", icon: Boxes },
  { to: "/competitors", label: "Competitor Intel", icon: Radar },
  { to: "/forecasting", label: "Demand Forecasting", icon: TrendingUp },
  { to: "/pricing", label: "Dynamic Pricing", icon: Tag },
  { to: "/procurement", label: "Procurement", icon: ShoppingCart },
  { to: "/suppliers", label: "Suppliers", icon: Truck },
  { to: "/alerts", label: "Alerts", icon: Bell },
  { to: "/reports", label: "Reports", icon: FileText },
  { to: "/settings", label: "Settings", icon: Settings }
];
function AppShell({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState("dark");
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [unresolvedCount, setUnresolvedCount] = useState(0);
  const [showAuth, setShowAuth] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [activeCurrency, setActiveCurrency] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("sokopulse_currency") || "USD";
    }
    return "USD";
  });
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [userInitials, setUserInitials] = useState("DC");
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme]);
  useEffect(() => {
    const fetchAlerts = () => {
      apiClient.getAlerts().then((data) => {
        if (data) {
          setUnresolvedCount(data.filter((a) => !a.resolved).length);
        }
      });
    };
    const fetchKPIsAndCheckAuth = () => {
      apiClient.getKPIs().then((res) => {
        if (res === null) {
          setIsOffline(true);
        } else {
          setIsOffline(false);
          const token = localStorage.getItem("sokopulse_token");
          if (!token) {
            setShowAuth(true);
          } else {
            const savedUser = localStorage.getItem("sokopulse_user") || "David Chen";
            const initials = savedUser.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
            setUserInitials(initials || "DC");
          }
        }
      });
    };
    fetchAlerts();
    fetchKPIsAndCheckAuth();
    const handleProfileUpdated = () => {
      const savedUser = localStorage.getItem("sokopulse_user") || "David Chen";
      const initials = savedUser.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
      setUserInitials(initials || "DC");
    };
    const handleAuthExpired = () => {
      setShowAuth(true);
      toast.error("Session expired. Please log in again.");
    };
    const handleCurrencyUpdated = () => {
      setActiveCurrency(localStorage.getItem("sokopulse_currency") || "USD");
    };
    window.addEventListener("alerts-updated", fetchAlerts);
    window.addEventListener("profile-updated", handleProfileUpdated);
    window.addEventListener("auth-expired", handleAuthExpired);
    window.addEventListener("currency-updated", handleCurrencyUpdated);
    return () => {
      window.removeEventListener("alerts-updated", fetchAlerts);
      window.removeEventListener("profile-updated", handleProfileUpdated);
      window.removeEventListener("auth-expired", handleAuthExpired);
      window.removeEventListener("currency-updated", handleCurrencyUpdated);
    };
  }, [pathname]);
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        const searchInput = document.getElementById("global-search-input");
        if (searchInput) searchInput.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  const handleSearchFocus = () => {
    setShowResults(true);
    if (allProducts.length === 0) {
      apiClient.getProducts().then((res) => {
        if (res) setAllProducts(res);
      });
    }
  };
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (isLogin) {
      apiClient.login({ username, password }).then((res) => {
        setIsSubmitting(false);
        if (res && res.access) {
          localStorage.setItem("sokopulse_token", res.access);
          localStorage.setItem("sokopulse_user", username);
          const initials = username.substring(0, 2).toUpperCase();
          setUserInitials(initials);
          setShowAuth(false);
          toast.success(`Welcome back, ${username}! Handshake success.`);
          window.location.reload();
        } else {
          toast.error("Authentication failed. Please check credentials.");
        }
      });
    } else {
      apiClient.register({ username, email, password }).then((res) => {
        setIsSubmitting(false);
        if (res) {
          toast.success("Account registered! Please log in.");
          setIsLogin(true);
        } else {
          toast.error("Registration failed. Try a different username/email.");
        }
      });
    }
  };
  const filteredProducts = searchQuery ? allProducts.filter(
    (p) => p.product_name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5) : [];
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen flex bg-background text-foreground", children: [
    /* @__PURE__ */ jsxs(
      "aside",
      {
        className: cn(
          "border-r border-border bg-sidebar text-sidebar-foreground flex flex-col shrink-0 transition-all duration-200",
          collapsed ? "w-16" : "w-64"
        ),
        children: [
          /* @__PURE__ */ jsxs("div", { className: "h-16 px-4 flex items-center gap-3 border-b border-sidebar-border", children: [
            /* @__PURE__ */ jsx("div", { className: "size-8 rounded-md bg-primary grid place-items-center shrink-0", children: /* @__PURE__ */ jsx(Sparkles, { className: "size-4 text-primary-foreground" }) }),
            !collapsed && /* @__PURE__ */ jsxs("div", { className: "overflow-hidden", children: [
              /* @__PURE__ */ jsx("p", { className: "font-semibold tracking-tight leading-tight", children: "SokoPulse" }),
              /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground -mt-0.5 tracking-wider uppercase", children: "AI Platform" })
            ] })
          ] }),
          /* @__PURE__ */ jsx("nav", { className: "flex-1 p-2 space-y-0.5 overflow-y-auto", children: nav.map((item) => {
            const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            const Icon = item.icon;
            return /* @__PURE__ */ jsxs(
              Link,
              {
                to: item.to,
                className: cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                  active ? "bg-sidebar-accent text-foreground font-medium" : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
                  collapsed && "justify-center px-0"
                ),
                title: collapsed ? item.label : void 0,
                children: [
                  /* @__PURE__ */ jsx(Icon, { className: "size-4 shrink-0" }),
                  !collapsed && /* @__PURE__ */ jsx("span", { className: "truncate", children: item.label }),
                  !collapsed && item.to === "/alerts" && unresolvedCount > 0 && /* @__PURE__ */ jsx(
                    Badge,
                    {
                      variant: "destructive",
                      className: "ml-auto h-5 px-1.5 text-[10px]",
                      children: unresolvedCount
                    }
                  )
                ]
              },
              item.to
            );
          }) }),
          /* @__PURE__ */ jsx("div", { className: "p-2 border-t border-sidebar-border", children: /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setCollapsed((c) => !c),
              className: "flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground transition-colors",
              title: "Toggle sidebar",
              children: [
                /* @__PURE__ */ jsx(
                  ChevronsLeft,
                  {
                    className: cn(
                      "size-4 transition-transform",
                      collapsed && "rotate-180"
                    )
                  }
                ),
                !collapsed && /* @__PURE__ */ jsx("span", { children: "Collapse" })
              ]
            }
          ) })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col min-w-0", children: [
      /* @__PURE__ */ jsxs("header", { className: "h-16 border-b border-border bg-background/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-30", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 flex-1 max-w-xl relative", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative w-full", children: [
            /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                id: "global-search-input",
                type: "text",
                value: searchQuery,
                onChange: (e) => setSearchQuery(e.target.value),
                onFocus: handleSearchFocus,
                onBlur: () => setTimeout(() => setShowResults(false), 200),
                placeholder: "Search products, SKUs, or category… (⌘K)",
                className: "w-full pl-9 pr-16 py-2 bg-surface-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring/40 placeholder:text-muted-foreground"
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-background border border-border text-muted-foreground", children: "⌘K" })
          ] }),
          showResults && searchQuery && /* @__PURE__ */ jsxs("div", { className: "absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-md shadow-lg max-h-60 overflow-y-auto z-50 p-2 space-y-1", children: [
            /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-muted-foreground px-2 py-1 uppercase tracking-wider", children: [
              "Search Results (",
              filteredProducts.length,
              ")"
            ] }),
            filteredProducts.map((p) => /* @__PURE__ */ jsxs(
              Link,
              {
                to: "/inventory",
                onClick: () => {
                  if (typeof window !== "undefined") {
                    const url = new URL(window.location.href);
                    url.pathname = "/inventory";
                    url.searchParams.set("search", p.sku);
                    window.location.href = url.pathname + url.search;
                  }
                },
                className: "flex items-center justify-between px-3 py-2 rounded-md hover:bg-muted text-sm text-foreground",
                children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("p", { className: "font-medium", children: p.product_name }),
                    /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-muted-foreground uppercase font-mono", children: [
                      p.sku,
                      " · ",
                      p.category
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("span", { className: "text-xs font-mono text-primary font-semibold", children: [
                    "$",
                    Number(p.unit_price).toFixed(2)
                  ] })
                ]
              },
              p.id
            )),
            filteredProducts.length === 0 && /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground px-3 py-2", children: "No matching products found." })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: cn(
                "hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full border",
                isOffline ? "bg-warning/10 text-warning border-warning/20" : "bg-success/10 text-success border-success/20"
              ),
              children: [
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: cn(
                      "size-1.5 rounded-full",
                      isOffline ? "bg-warning" : "bg-success animate-pulse"
                    )
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: "text-[11px] font-medium", children: isOffline ? "Standalone Mode" : "AI Live" })
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "ghost",
              size: "sm",
              onClick: () => {
                const nextCurrency = activeCurrency === "USD" ? "KES" : "USD";
                localStorage.setItem("sokopulse_currency", nextCurrency);
                window.dispatchEvent(new Event("currency-updated"));
                toast.success(`Currency switched to ${nextCurrency}`);
              },
              className: "font-mono text-xs font-semibold px-2.5 h-9 hover:bg-muted/60",
              title: "Toggle currency between USD ($) and KES (KES)",
              children: activeCurrency === "KES" ? "KES (KSh)" : "USD ($)"
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              onClick: () => setTheme((t) => t === "dark" ? "light" : "dark"),
              title: "Toggle theme",
              children: theme === "dark" ? /* @__PURE__ */ jsx(Sun, { className: "size-4" }) : /* @__PURE__ */ jsx(Moon, { className: "size-4" })
            }
          ),
          /* @__PURE__ */ jsx(Link, { to: "/alerts", children: /* @__PURE__ */ jsxs(Button, { variant: "ghost", size: "icon", className: "relative", children: [
            /* @__PURE__ */ jsx(Bell, { className: "size-4" }),
            unresolvedCount > 0 && /* @__PURE__ */ jsx("span", { className: "absolute top-1.5 right-1.5 size-2 rounded-full bg-destructive" })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "h-6 w-px bg-border mx-1" }),
          /* @__PURE__ */ jsx(
            Avatar,
            {
              className: "size-8",
              title: typeof window !== "undefined" ? localStorage.getItem("sokopulse_user") || "User Profile" : "User Profile",
              children: /* @__PURE__ */ jsx(AvatarFallback, { className: "bg-primary/15 text-primary text-xs font-semibold", children: userInitials })
            }
          ),
          !isOffline && (typeof window !== "undefined" && localStorage.getItem("sokopulse_token")) && /* @__PURE__ */ jsx(
            Button,
            {
              variant: "ghost",
              size: "xs",
              className: "text-[10px] text-muted-foreground hover:text-foreground",
              onClick: () => {
                localStorage.removeItem("sokopulse_token");
                localStorage.removeItem("sokopulse_user");
                window.location.reload();
              },
              children: "Log Out"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx("main", { className: "flex-1 overflow-y-auto", children })
    ] }),
    /* @__PURE__ */ jsx(Dialog, { open: showAuth, onOpenChange: setShowAuth, children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-[400px]", children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { children: isLogin ? "Sign In to SokoPulse AI" : "Register Organization Account" }),
        /* @__PURE__ */ jsx(DialogDescription, { children: "Connect to your Django secure operational database layer." })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleAuthSubmit, className: "space-y-4 py-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "auth-username", children: "Username" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "auth-username",
              value: username,
              onChange: (e) => setUsername(e.target.value),
              placeholder: "admin",
              required: true
            }
          )
        ] }),
        !isLogin && /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "auth-email", children: "Email Address" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "auth-email",
              type: "email",
              value: email,
              onChange: (e) => setEmail(e.target.value),
              placeholder: "admin@sokopulse.ai",
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "auth-password", children: "Password" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "auth-password",
              type: "password",
              value: password,
              onChange: (e) => setPassword(e.target.value),
              placeholder: "••••••••",
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "submit",
            className: "w-full mt-2",
            disabled: isSubmitting,
            children: isSubmitting ? "Processing Handshake..." : isLogin ? "Sign In" : "Register Account"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 border-t border-border pt-4 text-xs text-center", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setIsLogin(!isLogin),
            className: "text-primary hover:underline",
            children: isLogin ? "Need a new account? Register here" : "Already registered? Login here"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              setShowAuth(false);
              toast.info("Using platform in standalone offline mock mode.");
            },
            className: "text-muted-foreground hover:text-foreground font-medium underline",
            children: "Skip and use standalone mock mode"
          }
        )
      ] })
    ] }) })
  ] });
}
function PageHeader({
  title,
  description,
  actions
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-end justify-between gap-4 mb-8", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold tracking-tight", children: title }),
      description && /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-1", children: description })
    ] }),
    actions && /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: actions })
  ] });
}
function NotFoundComponent() {
  return /* @__PURE__ */ jsx(AppShell, { children: /* @__PURE__ */ jsx("div", { className: "flex min-h-[60vh] items-center justify-center px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-7xl font-bold", children: "404" }),
    /* @__PURE__ */ jsx("h2", { className: "mt-4 text-xl font-semibold", children: "Page not found" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Back to dashboard"
      }
    ) })
  ] }) }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-xl font-semibold tracking-tight", children: "This page didn't load" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$a = createRootRouteWithContext()(
  {
    head: () => ({
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { title: "SokoPulse AI — Supply Chain Intelligence" },
        {
          name: "description",
          content: "AI-powered supply chain optimization, demand forecasting, dynamic pricing, and competitor intelligence."
        },
        { property: "og:title", content: "SokoPulse AI" },
        {
          property: "og:description",
          content: "Intelligent supply chain optimization and decision-support platform."
        },
        { property: "og:type", content: "website" }
      ],
      links: [{ rel: "stylesheet", href: appCss }]
    }),
    shellComponent: RootShell,
    component: RootComponent,
    notFoundComponent: NotFoundComponent,
    errorComponent: ErrorComponent
  }
);
function RootShell({ children }) {
  return /* @__PURE__ */ jsxs("html", { lang: "en", className: "dark", children: [
    /* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$a.useRouteContext();
  return /* @__PURE__ */ jsxs(QueryClientProvider, { client: queryClient, children: [
    /* @__PURE__ */ jsx(AppShell, { children: /* @__PURE__ */ jsx(Outlet, {}) }),
    /* @__PURE__ */ jsx(Toaster, {})
  ] });
}
const $$splitComponentImporter$9 = () => import("./suppliers-DmJItlCd.js");
const Route$9 = createFileRoute("/suppliers")({
  head: () => ({
    meta: [{
      title: "Suppliers — SokoPulse AI"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./settings-BypUrexo.js");
const Route$8 = createFileRoute("/settings")({
  head: () => ({
    meta: [{
      title: "Settings — SokoPulse AI"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./reports-BLl48NNX.js");
const Route$7 = createFileRoute("/reports")({
  head: () => ({
    meta: [{
      title: "Reports — SokoPulse AI"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./procurement-srLLRo48.js");
const Route$6 = createFileRoute("/procurement")({
  head: () => ({
    meta: [{
      title: "Procurement Recommendations — SokoPulse AI"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./pricing-C32KjLYm.js");
const Route$5 = createFileRoute("/pricing")({
  head: () => ({
    meta: [{
      title: "Dynamic Pricing — SokoPulse AI"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./inventory-CCBlfQQY.js");
const Route$4 = createFileRoute("/inventory")({
  head: () => ({
    meta: [{
      title: "Inventory — SokoPulse AI"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./forecasting-BJMP7vt3.js");
const Route$3 = createFileRoute("/forecasting")({
  head: () => ({
    meta: [{
      title: "Demand Forecasting — SokoPulse AI"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./competitors-BhZPpW5q.js");
const Route$2 = createFileRoute("/competitors")({
  head: () => ({
    meta: [{
      title: "Competitor Intelligence — SokoPulse AI"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./alerts-DEbFo-lp.js");
const Route$1 = createFileRoute("/alerts")({
  head: () => ({
    meta: [{
      title: "Alerts & Notifications — SokoPulse AI"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./index-DUz3I32o.js");
const Route = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "Dashboard — SokoPulse AI"
    }, {
      name: "description",
      content: "Executive overview of inventory, demand, pricing, and AI recommendations."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const SuppliersRoute = Route$9.update({
  id: "/suppliers",
  path: "/suppliers",
  getParentRoute: () => Route$a
});
const SettingsRoute = Route$8.update({
  id: "/settings",
  path: "/settings",
  getParentRoute: () => Route$a
});
const ReportsRoute = Route$7.update({
  id: "/reports",
  path: "/reports",
  getParentRoute: () => Route$a
});
const ProcurementRoute = Route$6.update({
  id: "/procurement",
  path: "/procurement",
  getParentRoute: () => Route$a
});
const PricingRoute = Route$5.update({
  id: "/pricing",
  path: "/pricing",
  getParentRoute: () => Route$a
});
const InventoryRoute = Route$4.update({
  id: "/inventory",
  path: "/inventory",
  getParentRoute: () => Route$a
});
const ForecastingRoute = Route$3.update({
  id: "/forecasting",
  path: "/forecasting",
  getParentRoute: () => Route$a
});
const CompetitorsRoute = Route$2.update({
  id: "/competitors",
  path: "/competitors",
  getParentRoute: () => Route$a
});
const AlertsRoute = Route$1.update({
  id: "/alerts",
  path: "/alerts",
  getParentRoute: () => Route$a
});
const IndexRoute = Route.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$a
});
const rootRouteChildren = {
  IndexRoute,
  AlertsRoute,
  CompetitorsRoute,
  ForecastingRoute,
  InventoryRoute,
  PricingRoute,
  ProcurementRoute,
  ReportsRoute,
  SettingsRoute,
  SuppliersRoute
};
const routeTree = Route$a._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Badge as B,
  Dialog as D,
  Input as I,
  Label as L,
  PageHeader as P,
  apiClient as a,
  Button as b,
  DialogContent as c,
  DialogHeader as d,
  DialogTitle as e,
  DialogDescription as f,
  DialogFooter as g,
  cn as h,
  router as r
};
