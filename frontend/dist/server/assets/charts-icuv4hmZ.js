import { jsx, jsxs } from "react/jsx-runtime";
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Area, LineChart, Line, PieChart, Pie, Cell, BarChart, Bar } from "recharts";
const axisProps = {
  stroke: "var(--color-muted-foreground)",
  fontSize: 11,
  tickLine: false,
  axisLine: false
};
const tooltipStyle = {
  backgroundColor: "var(--color-popover)",
  border: "1px solid var(--color-border)",
  borderRadius: 8,
  fontSize: 12,
  color: "var(--color-popover-foreground)"
};
function SalesTrendChart({ data }) {
  return /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 260, children: /* @__PURE__ */ jsxs(LineChart, { data, margin: { top: 10, right: 10, left: -10, bottom: 0 }, children: [
    /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "var(--color-border)", vertical: false }),
    /* @__PURE__ */ jsx(XAxis, { dataKey: "month", ...axisProps }),
    /* @__PURE__ */ jsx(YAxis, { ...axisProps, tickFormatter: (v) => `$${v / 1e3}k` }),
    /* @__PURE__ */ jsx(Tooltip, { contentStyle: tooltipStyle, cursor: { stroke: "var(--color-border)" } }),
    /* @__PURE__ */ jsx(Legend, { wrapperStyle: { fontSize: 11 } }),
    /* @__PURE__ */ jsx(Line, { type: "monotone", dataKey: "sales", stroke: "var(--color-primary)", strokeWidth: 2.5, dot: false, name: "Actual" }),
    /* @__PURE__ */ jsx(Line, { type: "monotone", dataKey: "forecast", stroke: "var(--color-accent)", strokeWidth: 2, strokeDasharray: "4 4", dot: false, name: "Forecast" })
  ] }) });
}
function DemandAreaChart({
  data
}) {
  return /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 280, children: /* @__PURE__ */ jsxs(AreaChart, { data, margin: { top: 10, right: 10, left: -10, bottom: 0 }, children: [
    /* @__PURE__ */ jsxs("defs", { children: [
      /* @__PURE__ */ jsxs("linearGradient", { id: "gActual", x1: "0", y1: "0", x2: "0", y2: "1", children: [
        /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "var(--color-primary)", stopOpacity: 0.4 }),
        /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "var(--color-primary)", stopOpacity: 0 })
      ] }),
      /* @__PURE__ */ jsxs("linearGradient", { id: "gForecast", x1: "0", y1: "0", x2: "0", y2: "1", children: [
        /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "var(--color-accent)", stopOpacity: 0.3 }),
        /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "var(--color-accent)", stopOpacity: 0 })
      ] })
    ] }),
    /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "var(--color-border)", vertical: false }),
    /* @__PURE__ */ jsx(XAxis, { dataKey: "week", ...axisProps }),
    /* @__PURE__ */ jsx(YAxis, { ...axisProps }),
    /* @__PURE__ */ jsx(Tooltip, { contentStyle: tooltipStyle }),
    /* @__PURE__ */ jsx(Legend, { wrapperStyle: { fontSize: 11 } }),
    /* @__PURE__ */ jsx(Area, { type: "monotone", dataKey: "upper", stackId: "band", stroke: "none", fill: "var(--color-accent)", fillOpacity: 0.08, name: "Upper bound" }),
    /* @__PURE__ */ jsx(Area, { type: "monotone", dataKey: "actual", stroke: "var(--color-primary)", strokeWidth: 2.5, fill: "url(#gActual)", name: "Actual" }),
    /* @__PURE__ */ jsx(Area, { type: "monotone", dataKey: "forecast", stroke: "var(--color-accent)", strokeWidth: 2, strokeDasharray: "4 4", fill: "url(#gForecast)", name: "Forecast" })
  ] }) });
}
function RevenueBarChart({ data }) {
  return /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 260, children: /* @__PURE__ */ jsxs(BarChart, { data, margin: { top: 10, right: 10, left: -10, bottom: 0 }, children: [
    /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "var(--color-border)", vertical: false }),
    /* @__PURE__ */ jsx(XAxis, { dataKey: "category", ...axisProps }),
    /* @__PURE__ */ jsx(YAxis, { ...axisProps, tickFormatter: (v) => `$${v / 1e3}k` }),
    /* @__PURE__ */ jsx(Tooltip, { contentStyle: tooltipStyle, cursor: { fill: "var(--color-muted)" } }),
    /* @__PURE__ */ jsx(Bar, { dataKey: "revenue", fill: "var(--color-primary)", radius: [6, 6, 0, 0], maxBarSize: 48 })
  ] }) });
}
function InventoryDonut({
  data
}) {
  return /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 260, children: /* @__PURE__ */ jsxs(PieChart, { children: [
    /* @__PURE__ */ jsx(Tooltip, { contentStyle: tooltipStyle }),
    /* @__PURE__ */ jsx(
      Pie,
      {
        data,
        dataKey: "value",
        nameKey: "name",
        innerRadius: 60,
        outerRadius: 95,
        paddingAngle: 2,
        stroke: "var(--color-background)",
        strokeWidth: 2,
        children: data.map((d, i) => /* @__PURE__ */ jsx(Cell, { fill: d.color }, i))
      }
    ),
    /* @__PURE__ */ jsx(Legend, { wrapperStyle: { fontSize: 11 } })
  ] }) });
}
function CompetitorPriceChart({
  data
}) {
  return /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 280, children: /* @__PURE__ */ jsxs(LineChart, { data, margin: { top: 10, right: 10, left: -10, bottom: 0 }, children: [
    /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "var(--color-border)", vertical: false }),
    /* @__PURE__ */ jsx(XAxis, { dataKey: "day", ...axisProps }),
    /* @__PURE__ */ jsx(YAxis, { ...axisProps, tickFormatter: (v) => `$${v}` }),
    /* @__PURE__ */ jsx(Tooltip, { contentStyle: tooltipStyle }),
    /* @__PURE__ */ jsx(Legend, { wrapperStyle: { fontSize: 11 } }),
    /* @__PURE__ */ jsx(Line, { type: "monotone", dataKey: "us", stroke: "var(--color-primary)", strokeWidth: 2.5, dot: false, name: "SokoPulse" }),
    /* @__PURE__ */ jsx(Line, { type: "monotone", dataKey: "competitorA", stroke: "var(--color-accent)", strokeWidth: 2, dot: false, name: "GlobalLogix" }),
    /* @__PURE__ */ jsx(Line, { type: "monotone", dataKey: "competitorB", stroke: "var(--color-success)", strokeWidth: 2, dot: false, name: "Nexus Pro" }),
    /* @__PURE__ */ jsx(Line, { type: "monotone", dataKey: "competitorC", stroke: "var(--color-warning)", strokeWidth: 2, dot: false, name: "Apex Trading" })
  ] }) });
}
export {
  CompetitorPriceChart as C,
  DemandAreaChart as D,
  InventoryDonut as I,
  RevenueBarChart as R,
  SalesTrendChart as S
};
