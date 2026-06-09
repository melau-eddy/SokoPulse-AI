import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  Boxes,
  Radar,
  TrendingUp,
  Tag,
  ShoppingCart,
  Truck,
  Bell,
  FileText,
  Settings,
  Search,
  Sun,
  Moon,
  ChevronsLeft,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

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
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme]);

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <aside
        className={cn(
          "border-r border-border bg-sidebar text-sidebar-foreground flex flex-col shrink-0 transition-all duration-200",
          collapsed ? "w-16" : "w-64",
        )}
      >
        <div className="h-16 px-4 flex items-center gap-3 border-b border-sidebar-border">
          <div className="size-8 rounded-md bg-primary grid place-items-center shrink-0">
            <Sparkles className="size-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="font-semibold tracking-tight leading-tight">SokoPulse</p>
              <p className="text-[10px] text-muted-foreground -mt-0.5 tracking-wider uppercase">AI Platform</p>
            </div>
          )}
        </div>

        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          {nav.map((item) => {
            const active =
              item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                  active
                    ? "bg-sidebar-accent text-foreground font-medium"
                    : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
                  collapsed && "justify-center px-0",
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="size-4 shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
                {!collapsed && item.to === "/alerts" && (
                  <Badge variant="destructive" className="ml-auto h-5 px-1.5 text-[10px]">
                    4
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-2 border-t border-sidebar-border">
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground transition-colors"
            title="Toggle sidebar"
          >
            <ChevronsLeft className={cn("size-4 transition-transform", collapsed && "rotate-180")} />
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3 flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Search products, suppliers, insights…"
                className="w-full pl-9 pr-16 py-2 bg-surface-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring/40 placeholder:text-muted-foreground"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-background border border-border text-muted-foreground">
                ⌘K
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full bg-success/10 text-success border border-success/20">
              <span className="size-1.5 rounded-full bg-success animate-pulse" />
              <span className="text-[11px] font-medium">AI Live</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
              title="Toggle theme"
            >
              {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>
            <Link to="/alerts">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="size-4" />
                <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-destructive" />
              </Button>
            </Link>
            <div className="h-6 w-px bg-border mx-1" />
            <Avatar className="size-8">
              <AvatarFallback className="bg-primary/15 text-primary text-xs font-semibold">DC</AvatarFallback>
            </Avatar>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
