import { jsx, jsxs } from "react/jsx-runtime";
import { ArrowUpRight, ArrowDownRight, Sparkles } from "lucide-react";
import { c as cn, B as Badge, a as Button } from "./router-DpanUk2p.js";
import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
const Card = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      className: cn("rounded-xl border bg-card text-card-foreground shadow", className),
      ...props
    }
  )
);
Card.displayName = "Card";
const CardHeader = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("flex flex-col space-y-1.5 p-6", className), ...props })
);
CardHeader.displayName = "CardHeader";
const CardTitle = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      className: cn("font-semibold leading-none tracking-tight", className),
      ...props
    }
  )
);
CardTitle.displayName = "CardTitle";
const CardDescription = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("text-sm text-muted-foreground", className), ...props })
);
CardDescription.displayName = "CardDescription";
const CardContent = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("p-6 pt-0", className), ...props })
);
CardContent.displayName = "CardContent";
const CardFooter = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("flex items-center p-6 pt-0", className), ...props })
);
CardFooter.displayName = "CardFooter";
const Progress = React.forwardRef(({ className, value, ...props }, ref) => /* @__PURE__ */ jsx(
  ProgressPrimitive.Root,
  {
    ref,
    className: cn("relative h-2 w-full overflow-hidden rounded-full bg-primary/20", className),
    ...props,
    children: /* @__PURE__ */ jsx(
      ProgressPrimitive.Indicator,
      {
        className: "h-full w-full flex-1 bg-primary transition-all",
        style: { transform: `translateX(-${100 - (value || 0)}%)` }
      }
    )
  }
));
Progress.displayName = ProgressPrimitive.Root.displayName;
function KpiCard({
  label,
  value,
  delta,
  hint,
  trend = "up",
  accent
}) {
  const accentBar = {
    primary: "bg-primary",
    success: "bg-success",
    warning: "bg-warning",
    destructive: "bg-destructive"
  };
  return /* @__PURE__ */ jsxs(Card, { className: "p-5 relative overflow-hidden gap-3", children: [
    accent && /* @__PURE__ */ jsx("span", { className: cn("absolute left-0 top-4 bottom-4 w-0.5 rounded-full", accentBar[accent]) }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
      /* @__PURE__ */ jsx("span", { className: "text-[11px] font-medium tracking-wider uppercase text-muted-foreground", children: label }),
      delta && /* @__PURE__ */ jsxs(
        "span",
        {
          className: cn(
            "text-[10px] font-mono px-1.5 py-0.5 rounded inline-flex items-center gap-0.5",
            trend === "up" && "text-success bg-success/10",
            trend === "down" && "text-destructive bg-destructive/10",
            trend === "flat" && "text-muted-foreground bg-muted"
          ),
          children: [
            trend === "up" && /* @__PURE__ */ jsx(ArrowUpRight, { className: "size-3" }),
            trend === "down" && /* @__PURE__ */ jsx(ArrowDownRight, { className: "size-3" }),
            delta
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold font-mono tracking-tight", children: value }),
    hint && /* @__PURE__ */ jsx("p", { className: "text-[11px] text-muted-foreground", children: hint })
  ] });
}
function SectionCard({
  title,
  description,
  actions,
  children,
  className
}) {
  return /* @__PURE__ */ jsxs(Card, { className: cn("p-6 gap-4", className), children: [
    (title || actions) && /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        title && /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold", children: title }),
        description && /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: description })
      ] }),
      actions
    ] }),
    children
  ] });
}
const sevColors = {
  critical: "bg-destructive/10 text-destructive border-destructive/30",
  high: "bg-warning/10 text-warning border-warning/30",
  medium: "bg-info/10 text-info border-info/30",
  low: "bg-muted text-muted-foreground border-border"
};
function SeverityBadge({ severity }) {
  return /* @__PURE__ */ jsx(Badge, { variant: "outline", className: cn("capitalize", sevColors[severity]), children: severity });
}
const statusColors = {
  healthy: "bg-success/10 text-success border-success/30",
  low: "bg-warning/10 text-warning border-warning/30",
  overstocked: "bg-info/10 text-info border-info/30",
  critical: "bg-destructive/10 text-destructive border-destructive/30"
};
function StatusBadge({ status }) {
  return /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: cn("capitalize", statusColors[status]), children: [
    /* @__PURE__ */ jsx(
      "span",
      {
        className: cn(
          "size-1.5 rounded-full mr-1.5",
          status === "healthy" && "bg-success",
          status === "low" && "bg-warning",
          status === "overstocked" && "bg-info",
          status === "critical" && "bg-destructive animate-pulse"
        )
      }
    ),
    status
  ] });
}
function InsightCard({ insight, onAction }) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-border bg-surface-2 p-4 hover:border-primary/40 transition-colors group", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
      /* @__PURE__ */ jsx(SeverityBadge, { severity: insight.priority }),
      /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-mono text-muted-foreground", children: [
        insight.confidence,
        "% confidence"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("h4", { className: "text-sm font-semibold flex items-center gap-1.5 mb-1", children: [
      /* @__PURE__ */ jsx(Sparkles, { className: "size-3.5 text-primary" }),
      insight.title
    ] }),
    /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground leading-relaxed mb-3", children: insight.detail }),
    /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsx(Progress, { value: insight.confidence, className: "h-1 flex-1" }) }),
    /* @__PURE__ */ jsx(
      Button,
      {
        variant: "outline",
        size: "sm",
        onClick: onAction,
        className: "w-full mt-3 text-xs h-8 group-hover:border-primary/40",
        children: insight.action
      }
    )
  ] });
}
export {
  Card as C,
  InsightCard as I,
  KpiCard as K,
  Progress as P,
  SectionCard as S,
  SeverityBadge as a,
  StatusBadge as b
};
