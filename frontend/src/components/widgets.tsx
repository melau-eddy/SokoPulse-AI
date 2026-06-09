import type { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { Insight, InventoryStatus, Severity } from "@/lib/mock-data";

export function KpiCard({
  label,
  value,
  delta,
  hint,
  trend = "up",
  accent,
}: {
  label: string;
  value: string;
  delta?: string;
  hint?: string;
  trend?: "up" | "down" | "flat";
  accent?: "primary" | "success" | "warning" | "destructive";
}) {
  const accentBar = {
    primary: "bg-primary",
    success: "bg-success",
    warning: "bg-warning",
    destructive: "bg-destructive",
  } as const;
  return (
    <Card className="p-5 relative overflow-hidden gap-3">
      {accent && (
        <span
          className={cn(
            "absolute left-0 top-4 bottom-4 w-0.5 rounded-full",
            accentBar[accent],
          )}
        />
      )}
      <div className="flex items-start justify-between">
        <span className="text-[11px] font-medium tracking-wider uppercase text-muted-foreground">
          {label}
        </span>
        {delta && (
          <span
            className={cn(
              "text-[10px] font-mono px-1.5 py-0.5 rounded inline-flex items-center gap-0.5",
              trend === "up" && "text-success bg-success/10",
              trend === "down" && "text-destructive bg-destructive/10",
              trend === "flat" && "text-muted-foreground bg-muted",
            )}
          >
            {trend === "up" && <ArrowUpRight className="size-3" />}
            {trend === "down" && <ArrowDownRight className="size-3" />}
            {delta}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold font-mono tracking-tight">{value}</div>
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
    </Card>
  );
}

export function SectionCard({
  title,
  description,
  actions,
  children,
  className,
}: {
  title?: ReactNode;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("p-6 gap-4", className)}>
      {(title || actions) && (
        <div className="flex items-start justify-between gap-4">
          <div>
            {title && <h3 className="text-sm font-semibold">{title}</h3>}
            {description && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {description}
              </p>
            )}
          </div>
          {actions}
        </div>
      )}
      {children}
    </Card>
  );
}

const sevColors: Record<Severity, string> = {
  critical: "bg-destructive/10 text-destructive border-destructive/30",
  high: "bg-warning/10 text-warning border-warning/30",
  medium: "bg-info/10 text-info border-info/30",
  low: "bg-muted text-muted-foreground border-border",
};

export function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <Badge variant="outline" className={cn("capitalize", sevColors[severity])}>
      {severity}
    </Badge>
  );
}

const statusColors: Record<InventoryStatus, string> = {
  healthy: "bg-success/10 text-success border-success/30",
  low: "bg-warning/10 text-warning border-warning/30",
  overstocked: "bg-info/10 text-info border-info/30",
  critical: "bg-destructive/10 text-destructive border-destructive/30",
};

export function StatusBadge({ status }: { status: InventoryStatus }) {
  return (
    <Badge variant="outline" className={cn("capitalize", statusColors[status])}>
      <span
        className={cn(
          "size-1.5 rounded-full mr-1.5",
          status === "healthy" && "bg-success",
          status === "low" && "bg-warning",
          status === "overstocked" && "bg-info",
          status === "critical" && "bg-destructive animate-pulse",
        )}
      />
      {status}
    </Badge>
  );
}

export function InsightCard({
  insight,
  onAction,
}: {
  insight: Insight;
  onAction?: () => void;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface-2 p-4 hover:border-primary/40 transition-colors group">
      <div className="flex items-center justify-between mb-2">
        <SeverityBadge severity={insight.priority} />
        <span className="text-[10px] font-mono text-muted-foreground">
          {insight.confidence}% confidence
        </span>
      </div>
      <h4 className="text-sm font-semibold flex items-center gap-1.5 mb-1">
        <Sparkles className="size-3.5 text-primary" />
        {insight.title}
      </h4>
      <p className="text-xs text-muted-foreground leading-relaxed mb-3">
        {insight.detail}
      </p>
      <div className="flex items-center gap-2">
        <Progress value={insight.confidence} className="h-1 flex-1" />
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onAction}
        className="w-full mt-3 text-xs h-8 group-hover:border-primary/40"
      >
        {insight.action}
      </Button>
    </div>
  );
}

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="text-center py-12 px-6">
      <div className="size-12 mx-auto rounded-full bg-muted grid place-items-center mb-4">
        <Sparkles className="size-5 text-muted-foreground" />
      </div>
      <p className="font-medium text-sm">{title}</p>
      {description && (
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      )}
    </div>
  );
}
