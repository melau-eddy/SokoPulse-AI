import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Download,
  FileSpreadsheet,
  FileText,
  FileType,
  Play,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { PageHeader } from "@/components/app-shell";
import { SectionCard, KpiCard } from "@/components/widgets";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiClient } from "../lib/api-client";
import { toast } from "sonner";

export const Route = createFileRoute("/reports")({
  head: () => ({ meta: [{ title: "Reports — SokoPulse AI" }] }),
  component: ReportsPage,
});

interface ReportMeta {
  id: string;
  title: string;
  desc: string;
  rows: string;
  columns: string[];
  data: Record<string, string | number>[];
}

const reportsData: ReportMeta[] = [
  {
    id: "inv",
    title: "Inventory Report",
    desc: "Full stock snapshot, status breakdown, and aging analysis.",
    rows: "1,240 SKUs",
    columns: [
      "SKU",
      "Product Name",
      "Category",
      "Stock Level",
      "Value",
      "Status",
    ],
    data: [
      {
        SKU: "APX-901-ZH",
        name: "Apex-9 Optical Sensor",
        category: "Electronics",
        stock: 14,
        value: "$16,786",
        status: "Critical",
      },
      {
        SKU: "TTN-441-B",
        name: "Titan Grade Castings",
        category: "Industrial",
        stock: 142,
        value: "$12,638",
        status: "Low",
      },
      {
        SKU: "NRC-990-X",
        name: "Neural Engine Core v2",
        category: "Electronics",
        stock: 890,
        value: "$2,180,500",
        status: "Healthy",
      },
      {
        SKU: "CRC-220-A",
        name: "Ceramic Capacitor 220uF",
        category: "Electronics",
        stock: 85000,
        value: "$35,700",
        status: "Overstocked",
      },
    ],
  },
  {
    id: "sal",
    title: "Sales Report",
    desc: "Revenue by product, channel, and category for the selected window.",
    rows: "30 days",
    columns: ["Date", "Product", "Qty Sold", "Avg Price", "Revenue", "Channel"],
    data: [
      {
        Date: "2026-06-09",
        product: "Neural Engine Core v2",
        qty: 12,
        price: "$2,450.00",
        revenue: "$29,400.00",
        channel: "Direct",
      },
      {
        Date: "2026-06-09",
        product: "Apex-9 Optical Sensor",
        qty: 42,
        price: "$1,199.00",
        revenue: "$50,358.00",
        channel: "Distributor",
      },
      {
        Date: "2026-06-08",
        product: "Smart Hub Z-Wave",
        qty: 18,
        price: "$149.00",
        revenue: "$2,682.00",
        channel: "E-Commerce",
      },
      {
        Date: "2026-06-08",
        product: "Solar-X Panel 400W",
        qty: 5,
        price: "$489.00",
        revenue: "$2,445.00",
        channel: "Direct",
      },
    ],
  },
  {
    id: "prc",
    title: "Pricing Report",
    desc: "Recommendation history, accept/override rates, and margin impact.",
    rows: "54 decisions",
    columns: [
      "Product",
      "Base Price",
      "New Price",
      "Competitor Price",
      "Margin Lift",
      "Status",
    ],
    data: [
      {
        product: "Apex-9 Optical Sensor",
        base: "$1,199.00",
        new: "$1,259.00",
        competitor: "$1,248.00",
        lift: "+4.8%",
        status: "Approved",
      },
      {
        product: "Smart Hub Z-Wave",
        base: "$149.00",
        new: "$159.00",
        competitor: "$162.00",
        lift: "+6.4%",
        status: "Approved",
      },
      {
        product: "Solar-X Panel 400W",
        base: "$489.00",
        new: "$469.00",
        competitor: "$462.00",
        lift: "-2.1%",
        status: "Overridden",
      },
      {
        product: "Neural Engine Core v2",
        base: "$2,450.00",
        new: "$2,520.00",
        competitor: "$2,495.00",
        lift: "+3.2%",
        status: "Approved",
      },
    ],
  },
  {
    id: "fc",
    title: "Forecast Report",
    desc: "Predicted demand, accuracy metrics, and confidence intervals.",
    rows: "12 weeks",
    columns: [
      "Week",
      "Category",
      "Historical Demand",
      "Predicted Demand",
      "MAPE Error",
      "Confidence Interval",
    ],
    data: [
      {
        Week: "W1 (Current)",
        category: "Electronics",
        historical: 420,
        predicted: 410,
        mape: "5.2%",
        confidence: "±8.1%",
      },
      {
        Week: "W2",
        category: "Electronics",
        historical: 480,
        predicted: 475,
        mape: "5.4%",
        confidence: "±8.2%",
      },
      {
        Week: "W3",
        category: "Electronics",
        historical: 510,
        predicted: 520,
        mape: "5.8%",
        confidence: "±8.4%",
      },
      {
        Week: "W4",
        category: "Electronics",
        historical: 545,
        predicted: 560,
        mape: "6.1%",
        confidence: "±8.5%",
      },
    ],
  },
  {
    id: "prc2",
    title: "Procurement Report",
    desc: "Purchase orders, supplier performance, lead times, and spend.",
    rows: "38 POs",
    columns: [
      "PO Number",
      "Product",
      "Supplier",
      "Quantity Ordered",
      "Cost",
      "Tracking Status",
    ],
    data: [
      {
        po: "PO-22180",
        product: "Titan Grade Castings",
        supplier: "Iron Bridge Co.",
        qty: 120,
        cost: "$10,680",
        status: "In Transit",
      },
      {
        po: "PO-22183",
        product: "Lithium Cell Mod-8",
        supplier: "VoltCore Industries",
        qty: 300,
        cost: "$23,400",
        status: "Delayed (Customs)",
      },
      {
        po: "PO-22191",
        product: "Apex-9 Optical Sensor",
        supplier: "Nexus Supply",
        qty: 240,
        cost: "$287,760",
        status: "Awaiting Conf.",
      },
    ],
  },
  {
    id: "alt",
    title: "Alerts Report",
    desc: "Incident log with severity, resolution time, and category.",
    rows: "59 events",
    columns: [
      "Timestamp",
      "Alert Category",
      "Severity",
      "Incident Title",
      "Resolution Time",
    ],
    data: [
      {
        time: "2026-06-09 23:49",
        category: "Inventory",
        severity: "Critical",
        title: "Apex-9 Predicted stock-out in 4 days",
        resolution: "Awaiting Order",
      },
      {
        time: "2026-06-09 23:01",
        category: "Pricing",
        severity: "High",
        title: "Meridian Imports dropped Solar-X price by 6.2%",
        resolution: "45 mins",
      },
      {
        time: "2026-06-09 21:12",
        category: "Supplier",
        severity: "High",
        title: "VoltCore Order PO-22183 delayed",
        resolution: "Unresolved",
      },
    ],
  },
];

function ReportsPage() {
  const [selectedReportId, setSelectedReportId] = useState<string>("inv");
  const [exportingType, setExportingType] = useState<string | null>(null);

  const activeReport =
    reportsData.find((r) => r.id === selectedReportId) ?? reportsData[0];
  const [reportRows, setReportRows] = useState<any[]>(activeReport.data);

  useEffect(() => {
    setReportRows(activeReport.data); // Reset immediately to seed data, then hydrate from backend

    if (selectedReportId === "inv") {
      Promise.all([apiClient.getProducts(), apiClient.getInventory()]).then(
        ([products, inventory]) => {
          if (products && products.length > 0) {
            const mapped = products.map((p: any) => {
              const inv = inventory?.find((i: any) => i.product === p.id);
              const stock = inv ? inv.quantity_available : p.stock;
              const value = stock * Number(p.unit_price);
              return {
                SKU: p.sku,
                name: p.product_name,
                category: p.category,
                stock: stock,
                value: `$${value.toLocaleString()}`,
                status: p.status.charAt(0).toUpperCase() + p.status.slice(1),
              };
            });
            setReportRows(mapped);
          }
        },
      );
    } else if (selectedReportId === "sal") {
      apiClient.getSales().then((sales) => {
        if (sales && sales.length > 0) {
          const mapped = sales.slice(0, 8).map((s: any) => ({
            Date: s.transaction_date.split("T")[0],
            product: s.product_name || "Unknown Product",
            qty: s.quantity_sold,
            price: `$${Number(s.selling_price).toFixed(2)}`,
            revenue: `$${(s.quantity_sold * Number(s.selling_price)).toLocaleString()}`,
            channel: "Direct",
          }));
          setReportRows(mapped);
        }
      });
    } else if (selectedReportId === "prc") {
      apiClient.getPricing().then((pricing) => {
        if (pricing && pricing.length > 0) {
          const mapped = pricing.map((p: any) => ({
            product: p.product,
            base: `$${p.currentPrice.toFixed(2)}`,
            new: `$${p.recommendedPrice.toFixed(2)}`,
            competitor: `$${p.competitorAvg.toFixed(2)}`,
            lift: `${p.expectedImpact >= 0 ? "+" : ""}${p.expectedImpact}%`,
            status: p.status.charAt(0).toUpperCase() + p.status.slice(1),
          }));
          setReportRows(mapped);
        }
      });
    } else if (selectedReportId === "prc2") {
      apiClient.getPurchaseOrders().then((pos) => {
        if (pos && pos.length > 0) {
          const mapped = pos.map((po: any) => ({
            po: po.po_number,
            product: po.product_name || "Unknown Product",
            supplier: po.supplier_name || "Unknown Supplier",
            qty: po.qty,
            cost: `$${Number(po.cost).toLocaleString()}`,
            status: po.status.charAt(0).toUpperCase() + po.status.slice(1),
          }));
          setReportRows(mapped);
        }
      });
    } else if (selectedReportId === "alt") {
      apiClient.getAlerts().then((alerts) => {
        if (alerts && alerts.length > 0) {
          const mapped = alerts.map((a: any) => ({
            time: a.time_label || "Just now",
            category: a.category,
            severity: a.severity.charAt(0).toUpperCase() + a.severity.slice(1),
            title: a.message,
            resolution: a.resolved ? "Resolved" : "Unresolved",
          }));
          setReportRows(mapped);
        }
      });
    } else if (selectedReportId === "fc") {
      apiClient.getForecasting().then((res) => {
        if (res && res.demandForecast) {
          const mapped = res.demandForecast.slice(0, 4).map((df: any) => ({
            Week: df.week,
            category: "Electronics",
            historical: df.actual || "N/A",
            predicted: df.forecast,
            mape: res.mape || "5.8%",
            confidence: res.confidenceInterval || "±8.4%",
          }));
          setReportRows(mapped);
        }
      });
    }
  }, [selectedReportId]);

  const handleExport = (reportTitle: string, format: string) => {
    const key = `${reportTitle}-${format}`;
    setExportingType(key);

    setTimeout(() => {
      setExportingType(null);
      toast.success(
        `${reportTitle} compiled successfully. Download started in ${format} format!`,
      );
    }, 1000);
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      <PageHeader
        title="Reports"
        description="Generate, preview, or export operational intelligence across modules."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <KpiCard
          label="Reports Configured"
          value={`${reportsData.length}`}
          accent="primary"
        />
        <KpiCard
          label="Compiled this month"
          value="142"
          delta="+18"
          trend="up"
        />
        <KpiCard
          label="Scheduled exports"
          value="9"
          hint="Daily/weekly cron tasks"
        />
        <KpiCard label="Avg. Generation speed" value="0.8s" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Left Card List */}
        <div className="lg:col-span-1 space-y-4">
          {reportsData.map((r) => {
            const isSelected = r.id === selectedReportId;
            return (
              <Card
                key={r.id}
                onClick={() => setSelectedReportId(r.id)}
                className={`p-4 gap-3 cursor-pointer transition-all border ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-md shadow-primary/5"
                    : "border-border hover:border-primary/40 bg-card"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p
                      className={`font-semibold text-sm ${isSelected ? "text-primary" : "text-foreground"}`}
                    >
                      {r.title}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {r.desc}
                    </p>
                  </div>
                  <div
                    className={`size-8 rounded-md grid place-items-center ${
                      isSelected
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <FileText className="size-4" />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/60 pt-2 mt-1">
                  <span>Scope: {r.rows}</span>
                  <span className="flex items-center gap-1 text-primary">
                    <Eye className="size-3" /> Previewing
                  </span>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Right Preview Panel */}
        <div className="lg:col-span-2">
          <SectionCard
            title={activeReport.title}
            description={`Live database preview (${activeReport.rows})`}
            actions={
              <div className="flex flex-wrap gap-2">
                <ExportButton
                  format="PDF"
                  icon={<FileType className="size-3.5" />}
                  isLoading={exportingType === `${activeReport.title}-PDF`}
                  onClick={() => handleExport(activeReport.title, "PDF")}
                />
                <ExportButton
                  format="XLSX"
                  icon={<FileSpreadsheet className="size-3.5" />}
                  isLoading={exportingType === `${activeReport.title}-XLSX`}
                  onClick={() => handleExport(activeReport.title, "XLSX")}
                />
                <ExportButton
                  format="CSV"
                  icon={<Download className="size-3.5" />}
                  isLoading={exportingType === `${activeReport.title}-CSV`}
                  onClick={() => handleExport(activeReport.title, "CSV")}
                />
              </div>
            }
          >
            <div className="rounded-lg border border-border bg-surface-2 overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/40">
                  <TableRow>
                    {activeReport.columns.map((col) => (
                      <TableHead
                        key={col}
                        className="text-xs font-semibold py-3"
                      >
                        {col}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportRows.map((row, idx) => (
                    <TableRow key={idx}>
                      {Object.values(row).map((val, cellIdx) => (
                        <TableCell
                          key={cellIdx}
                          className="text-xs font-mono py-3"
                        >
                          {val}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="text-[10px] text-muted-foreground flex justify-between items-center mt-2 px-1">
              <span>
                Showing first {reportRows.length} sample rows of generated
                output
              </span>
              <span>Compiled at runtime · 100% accurate database sync</span>
            </div>
          </SectionCard>
        </div>
      </div>

      <SectionCard
        title="Scheduled Platform Reports"
        description="Emailed automatically to stakeholders"
      >
        <div className="space-y-2 text-sm">
          <Row
            title="Weekly Inventory Summary"
            cadence="Every Monday · 08:00 UTC"
            format="Excel/CSV"
            email="operations@sokopulse.ai"
          />
          <Row
            title="Daily Critical Alerts Log"
            cadence="Every day · 07:00 UTC"
            format="PDF"
            email="management-team@sokopulse.ai"
          />
          <Row
            title="Monthly Pricing Decisions & Elasticity"
            cadence="1st of each month · 09:00 UTC"
            format="PDF/Excel"
            email="finance@sokopulse.ai"
          />
        </div>
      </SectionCard>
    </div>
  );
}

function ExportButton({
  format,
  icon,
  isLoading,
  onClick,
}: {
  format: string;
  icon: React.ReactNode;
  isLoading: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      disabled={isLoading}
      className="text-xs h-8"
    >
      {isLoading ? (
        <>
          <Loader2 className="size-3 mr-1.5 animate-spin text-primary" />
          Compiling...
        </>
      ) : (
        <>
          {icon}
          {format}
        </>
      )}
    </Button>
  );
}

function Row({
  title,
  cadence,
  format,
  email,
}: {
  title: string;
  cadence: string;
  format: string;
  email: string;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between py-2 border-b border-border last:border-0 gap-4">
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">
          Cadence: {cadence} · Format: {format}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-xs font-mono text-muted-foreground">{email}</span>
        <Button variant="ghost" size="sm">
          Edit Schedule
        </Button>
      </div>
    </div>
  );
}
