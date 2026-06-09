import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useRouterState, Link, createRootRouteWithContext, useRouter, Outlet, HeadContent, Scripts, createFileRoute, lazyRouteComponent, createRouter } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import * as React from "react";
import { useState, useEffect } from "react";
import { Toaster as Toaster$1 } from "sonner";
import { Sparkles, LayoutDashboard, Boxes, Radar, TrendingUp, Tag, ShoppingCart, Truck, Bell, FileText, Settings, ChevronsLeft, Search, Sun, Moon } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
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
const appCss = "/assets/styles-CYH6X3EX.css";
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
    return /* @__PURE__ */ jsx(Comp, { className: cn(buttonVariants({ variant, size, className })), ref, ...props });
  }
);
Button.displayName = "Button";
const Avatar = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AvatarPrimitive.Root,
  {
    ref,
    className: cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className),
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
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme]);
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
                  !collapsed && item.to === "/alerts" && /* @__PURE__ */ jsx(Badge, { variant: "destructive", className: "ml-auto h-5 px-1.5 text-[10px]", children: "4" })
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
                /* @__PURE__ */ jsx(ChevronsLeft, { className: cn("size-4 transition-transform", collapsed && "rotate-180") }),
                !collapsed && /* @__PURE__ */ jsx("span", { children: "Collapse" })
              ]
            }
          ) })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col min-w-0", children: [
      /* @__PURE__ */ jsxs("header", { className: "h-16 border-b border-border bg-background/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-30", children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-3 flex-1 max-w-xl", children: /* @__PURE__ */ jsxs("div", { className: "relative w-full", children: [
          /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              placeholder: "Search products, suppliers, insights…",
              className: "w-full pl-9 pr-16 py-2 bg-surface-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring/40 placeholder:text-muted-foreground"
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-background border border-border text-muted-foreground", children: "⌘K" })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full bg-success/10 text-success border border-success/20", children: [
            /* @__PURE__ */ jsx("span", { className: "size-1.5 rounded-full bg-success animate-pulse" }),
            /* @__PURE__ */ jsx("span", { className: "text-[11px] font-medium", children: "AI Live" })
          ] }),
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
            /* @__PURE__ */ jsx("span", { className: "absolute top-1.5 right-1.5 size-2 rounded-full bg-destructive" })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "h-6 w-px bg-border mx-1" }),
          /* @__PURE__ */ jsx(Avatar, { className: "size-8", children: /* @__PURE__ */ jsx(AvatarFallback, { className: "bg-primary/15 text-primary text-xs font-semibold", children: "DC" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsx("main", { className: "flex-1 overflow-y-auto", children })
    ] })
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
const Route$a = createRootRouteWithContext()({
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
});
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
const $$splitComponentImporter$9 = () => import("./suppliers-CrrR4bko.js");
const Route$9 = createFileRoute("/suppliers")({
  head: () => ({
    meta: [{
      title: "Suppliers — SokoPulse AI"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./settings-Co4yeAxn.js");
const Route$8 = createFileRoute("/settings")({
  head: () => ({
    meta: [{
      title: "Settings — SokoPulse AI"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./reports-QZz3V8MM.js");
const Route$7 = createFileRoute("/reports")({
  head: () => ({
    meta: [{
      title: "Reports — SokoPulse AI"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./procurement-CNP4ErN5.js");
const Route$6 = createFileRoute("/procurement")({
  head: () => ({
    meta: [{
      title: "Procurement Recommendations — SokoPulse AI"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./pricing-Bm8yRxeZ.js");
const Route$5 = createFileRoute("/pricing")({
  head: () => ({
    meta: [{
      title: "Dynamic Pricing — SokoPulse AI"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./inventory-CBT5yf-z.js");
const Route$4 = createFileRoute("/inventory")({
  head: () => ({
    meta: [{
      title: "Inventory — SokoPulse AI"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./forecasting-adJi1tFv.js");
const Route$3 = createFileRoute("/forecasting")({
  head: () => ({
    meta: [{
      title: "Demand Forecasting — SokoPulse AI"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./competitors-frTgglMO.js");
const Route$2 = createFileRoute("/competitors")({
  head: () => ({
    meta: [{
      title: "Competitor Intelligence — SokoPulse AI"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./alerts-8PLxBNeW.js");
const Route$1 = createFileRoute("/alerts")({
  head: () => ({
    meta: [{
      title: "Alerts & Notifications — SokoPulse AI"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./index-BFQw1vLe.js");
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
  PageHeader as P,
  Button as a,
  cn as c,
  router as r
};
