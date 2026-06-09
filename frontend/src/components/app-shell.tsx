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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiClient } from "../lib/api-client";
import { toast } from "sonner";

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

  // Stateful items
  const [unresolvedCount, setUnresolvedCount] = useState(0);
  const [showAuth, setShowAuth] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  // Authentication inputs
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Global Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Profile data
  const [userInitials, setUserInitials] = useState("DC");

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme]);

  // Load telemetry & security credentials
  useEffect(() => {
    const fetchAlerts = () => {
      apiClient.getAlerts().then((data) => {
        if (data) {
          setUnresolvedCount(data.filter((a: any) => !a.resolved).length);
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
            const initials = savedUser.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
            setUserInitials(initials || "DC");
          }
        }
      });
    };

    fetchAlerts();
    fetchKPIsAndCheckAuth();

    const handleProfileUpdated = () => {
      const savedUser = localStorage.getItem("sokopulse_user") || "David Chen";
      const initials = savedUser.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
      setUserInitials(initials || "DC");
    };

    const handleAuthExpired = () => {
      setShowAuth(true);
      toast.error("Session expired. Please log in again.");
    };

    window.addEventListener("alerts-updated", fetchAlerts);
    window.addEventListener("profile-updated", handleProfileUpdated);
    window.addEventListener("auth-expired", handleAuthExpired);

    return () => {
      window.removeEventListener("alerts-updated", fetchAlerts);
      window.removeEventListener("profile-updated", handleProfileUpdated);
      window.removeEventListener("auth-expired", handleAuthExpired);
    };
  }, [pathname]);

  // Keyboard shortcut listener for Cmd+K search focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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

  const handleAuthSubmit = (e: React.FormEvent) => {
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
          // Reload route validation
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

  const filteredProducts = searchQuery
    ? allProducts.filter((p: any) =>
        p.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

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
                {!collapsed && item.to === "/alerts" && unresolvedCount > 0 && (
                  <Badge variant="destructive" className="ml-auto h-5 px-1.5 text-[10px]">
                    {unresolvedCount}
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
          <div className="flex items-center gap-3 flex-1 max-w-xl relative">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <input
                id="global-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={handleSearchFocus}
                onBlur={() => setTimeout(() => setShowResults(false), 200)}
                placeholder="Search products, SKUs, or category… (⌘K)"
                className="w-full pl-9 pr-16 py-2 bg-surface-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring/40 placeholder:text-muted-foreground"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-background border border-border text-muted-foreground">
                ⌘K
              </span>
            </div>

            {/* Float Command Search Results Dropdown */}
            {showResults && searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-md shadow-lg max-h-60 overflow-y-auto z-50 p-2 space-y-1">
                <p className="text-[10px] text-muted-foreground px-2 py-1 uppercase tracking-wider">Search Results ({filteredProducts.length})</p>
                {filteredProducts.map((p: any) => (
                  <Link
                    key={p.id}
                    to="/inventory"
                    onClick={() => {
                      if (typeof window !== "undefined") {
                        const url = new URL(window.location.href);
                        url.pathname = "/inventory";
                        url.searchParams.set("search", p.sku);
                        window.location.href = url.pathname + url.search;
                      }
                    }}
                    className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-muted text-sm text-foreground"
                  >
                    <div>
                      <p className="font-medium">{p.product_name}</p>
                      <p className="text-[10px] text-muted-foreground uppercase font-mono">{p.sku} · {p.category}</p>
                    </div>
                    <span className="text-xs font-mono text-primary font-semibold">${Number(p.unit_price).toFixed(2)}</span>
                  </Link>
                ))}
                {filteredProducts.length === 0 && (
                  <p className="text-xs text-muted-foreground px-3 py-2">No matching products found.</p>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className={cn(
              "hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full border",
              isOffline
                ? "bg-warning/10 text-warning border-warning/20"
                : "bg-success/10 text-success border-success/20"
            )}>
              <span className={cn("size-1.5 rounded-full", isOffline ? "bg-warning" : "bg-success animate-pulse")} />
              <span className="text-[11px] font-medium">{isOffline ? "Standalone Mode" : "AI Live"}</span>
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
                {unresolvedCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-destructive" />
                )}
              </Button>
            </Link>
            <div className="h-6 w-px bg-border mx-1" />
            <Avatar className="size-8" title={localStorage.getItem("sokopulse_user") || "User Profile"}>
              <AvatarFallback className="bg-primary/15 text-primary text-xs font-semibold">{userInitials}</AvatarFallback>
            </Avatar>
            {!isOffline && localStorage.getItem("sokopulse_token") && (
              <Button
                variant="ghost"
                size="xs"
                className="text-[10px] text-muted-foreground hover:text-foreground"
                onClick={() => {
                  localStorage.removeItem("sokopulse_token");
                  localStorage.removeItem("sokopulse_user");
                  window.location.reload();
                }}
              >
                Log Out
              </Button>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>

      {/* Gated Authentication Dialog */}
      <Dialog open={showAuth} onOpenChange={setShowAuth}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>{isLogin ? "Sign In to SokoPulse AI" : "Register Organization Account"}</DialogTitle>
            <DialogDescription>
              Connect to your Django secure operational database layer.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAuthSubmit} className="space-y-4 py-2">
            <div className="space-y-1">
              <Label htmlFor="auth-username">Username</Label>
              <Input
                id="auth-username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                required
              />
            </div>
            {!isLogin && (
              <div className="space-y-1">
                <Label htmlFor="auth-email">Email Address</Label>
                <Input
                  id="auth-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@sokopulse.ai"
                  required
                />
              </div>
            )}
            <div className="space-y-1">
              <Label htmlFor="auth-password">Password</Label>
              <Input
                id="auth-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
              {isSubmitting ? "Processing Handshake..." : isLogin ? "Sign In" : "Register Account"}
            </Button>
          </form>

          <div className="flex flex-col gap-2 border-t border-border pt-4 text-xs text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:underline"
            >
              {isLogin ? "Need a new account? Register here" : "Already registered? Login here"}
            </button>
            <button
              onClick={() => {
                setShowAuth(false);
                toast.info("Using platform in standalone offline mock mode.");
              }}
              className="text-muted-foreground hover:text-foreground font-medium underline"
            >
              Skip and use standalone mock mode
            </button>
          </div>
        </DialogContent>
      </Dialog>
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
