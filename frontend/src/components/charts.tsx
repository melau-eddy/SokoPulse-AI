import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const axisProps = {
  stroke: "var(--color-muted-foreground)",
  fontSize: 11,
  tickLine: false,
  axisLine: false,
};

const tooltipStyle = {
  backgroundColor: "var(--color-popover)",
  border: "1px solid var(--color-border)",
  borderRadius: 8,
  fontSize: 12,
  color: "var(--color-popover-foreground)",
};

export function SalesTrendChart({
  data,
}: {
  data: { month: string; sales: number; forecast: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart
        data={data}
        margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--color-border)"
          vertical={false}
        />
        <XAxis dataKey="month" {...axisProps} />
        <YAxis {...axisProps} tickFormatter={(v) => `$${v / 1000}k`} />
        <Tooltip
          contentStyle={tooltipStyle}
          cursor={{ stroke: "var(--color-border)" }}
        />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        <Line
          type="monotone"
          dataKey="sales"
          stroke="var(--color-primary)"
          strokeWidth={2.5}
          dot={false}
          name="Actual"
        />
        <Line
          type="monotone"
          dataKey="forecast"
          stroke="var(--color-accent)"
          strokeWidth={2}
          strokeDasharray="4 4"
          dot={false}
          name="Forecast"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function DemandAreaChart({
  data,
}: {
  data: {
    week: string;
    actual: number;
    forecast: number;
    upper: number;
    lower: number;
  }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
      >
        <defs>
          <linearGradient id="gActual" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor="var(--color-primary)"
              stopOpacity={0.4}
            />
            <stop
              offset="100%"
              stopColor="var(--color-primary)"
              stopOpacity={0}
            />
          </linearGradient>
          <linearGradient id="gForecast" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor="var(--color-accent)"
              stopOpacity={0.3}
            />
            <stop
              offset="100%"
              stopColor="var(--color-accent)"
              stopOpacity={0}
            />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--color-border)"
          vertical={false}
        />
        <XAxis dataKey="week" {...axisProps} />
        <YAxis {...axisProps} />
        <Tooltip contentStyle={tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        <Area
          type="monotone"
          dataKey="upper"
          stackId="band"
          stroke="none"
          fill="var(--color-accent)"
          fillOpacity={0.08}
          name="Upper bound"
        />
        <Area
          type="monotone"
          dataKey="actual"
          stroke="var(--color-primary)"
          strokeWidth={2.5}
          fill="url(#gActual)"
          name="Actual"
        />
        <Area
          type="monotone"
          dataKey="forecast"
          stroke="var(--color-accent)"
          strokeWidth={2}
          strokeDasharray="4 4"
          fill="url(#gForecast)"
          name="Forecast"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function RevenueBarChart({
  data,
}: {
  data: { category: string; revenue: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart
        data={data}
        margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--color-border)"
          vertical={false}
        />
        <XAxis dataKey="category" {...axisProps} />
        <YAxis {...axisProps} tickFormatter={(v) => `$${v / 1000}k`} />
        <Tooltip
          contentStyle={tooltipStyle}
          cursor={{ fill: "var(--color-muted)" }}
        />
        <Bar
          dataKey="revenue"
          fill="var(--color-primary)"
          radius={[6, 6, 0, 0]}
          maxBarSize={48}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function InventoryDonut({
  data,
}: {
  data: { name: string; value: number; color: string }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Tooltip contentStyle={tooltipStyle} />
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={60}
          outerRadius={95}
          paddingAngle={2}
          stroke="var(--color-background)"
          strokeWidth={2}
        >
          {data.map((d, i) => (
            <Cell key={i} fill={d.color} />
          ))}
        </Pie>
        <Legend wrapperStyle={{ fontSize: 11 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function CompetitorPriceChart({
  data,
}: {
  data: any[];
}) {
  if (!data || data.length === 0) return null;

  const firstPoint = data[0];
  const keys = Object.keys(firstPoint).filter((k) => k !== "day" && k !== "us");

  const colors = [
    "var(--color-accent)",
    "var(--color-success)",
    "var(--color-warning)",
    "var(--color-destructive)",
    "var(--color-info)",
  ];

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart
        data={data}
        margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--color-border)"
          vertical={false}
        />
        <XAxis dataKey="day" {...axisProps} />
        <YAxis {...axisProps} tickFormatter={(v) => `$${v}`} />
        <Tooltip contentStyle={tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        <Line
          type="monotone"
          dataKey="us"
          stroke="var(--color-primary)"
          strokeWidth={2.5}
          dot={false}
          name="SokoPulse"
        />
        {keys.map((key, idx) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={colors[idx % colors.length]}
            strokeWidth={2}
            dot={false}
            name={key}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
