import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowDownRight,
  ArrowUpRight,
  IndianRupee,
  Plus,
  Receipt,
  Users,
  Percent,
  CalendarRange,
  Wallet,
} from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { DonutChart, RankBars, SalesTrendChart, Sparkline } from "@/components/charts";
import { Button, Card, CardHead, StatusBadge } from "@/components/kit";
import {
  currency,
  dashboardStats as s,
  invoices,
  paymentMix,
  salesTrend,
  topCustomers,
  topProducts,
} from "@/data/mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Billing Desk" },
      {
        name: "description",
        content:
          "Billing Desk dashboard: today's sales, monthly revenue, GST collected, invoice trends and recent billing activity at a glance.",
      },
      { property: "og:title", content: "Dashboard — Billing Desk" },
      {
        property: "og:description",
        content: "Track sales, invoices, GST and customers from one compact billing dashboard.",
      },
    ],
  }),
  component: Dashboard,
});

const spark = [12, 18, 14, 22, 19, 26, 24, 31];

function StatCard({
  label,
  value,
  delta,
  icon: Icon,
  sub,
}: {
  label: string;
  value: string;
  delta: number;
  icon: React.ComponentType<{ className?: string }>;
  sub: string;
}) {
  const up = delta >= 0;
  return (
    <Card className="group relative overflow-hidden p-3 transition hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          <p className="num mt-1 truncate text-[19px] font-extrabold tracking-tight">{value}</p>
        </div>
        <span className="grid size-7 shrink-0 place-items-center rounded-md bg-primary-soft text-primary ring-1 ring-inset ring-primary/12">
          <Icon className="size-3.5" />
        </span>
      </div>
      <div className="mt-2 flex items-end justify-between gap-2">
        <div className="min-w-0">
          <span
            className={cn(
              "num inline-flex items-center gap-0.5 text-[11px] font-bold",
              up ? "text-success" : "text-danger",
            )}
          >
            {up ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
            {Math.abs(delta)}%
          </span>
          <span className="ml-1.5 text-[11px] text-muted-foreground">{sub}</span>
        </div>
        <Sparkline points={up ? spark : [...spark].reverse()} tone={up ? "up" : "down"} />
      </div>
    </Card>
  );
}

function Dashboard() {
  const recent = invoices.slice(0, 6);
  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Wednesday, 26 August 2026 · FY 2026–27"
        actions={
          <>
            <Button variant="secondary" size="sm" className="hidden sm:inline-flex">
              <CalendarRange /> This month
            </Button>
            <Link to="/invoices/new">
              <Button variant="primary" size="sm">
                <Plus /> Create Invoice
              </Button>
            </Link>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-6">
        <StatCard label="Today's Sales" value={currency(s.todaySales)} delta={s.todayDelta} icon={IndianRupee} sub="vs yesterday" />
        <StatCard label="Monthly Sales" value={currency(s.monthSales)} delta={s.monthDelta} icon={Wallet} sub="vs last month" />
        <StatCard label="Invoices" value={s.invoiceCount.toLocaleString("en-IN")} delta={s.invoiceDelta} icon={Receipt} sub="this month" />
        <StatCard label="Customers" value={s.customerCount.toLocaleString("en-IN")} delta={s.customerDelta} icon={Users} sub="active" />
        <StatCard label="Avg Invoice" value={currency(s.avgInvoice)} delta={s.avgDelta} icon={Receipt} sub="per bill" />
        <StatCard label="GST Collected" value={currency(s.gstCollected)} delta={s.gstDelta} icon={Percent} sub="this month" />
      </div>

      <div className="mt-3 grid gap-2.5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHead
            title="Sales trend"
            subtitle="Daily net sales — August 2026"
            action={
              <div className="hidden items-center gap-1 sm:flex">
                {["7D", "30D", "90D"].map((r, i) => (
                  <Button key={r} size="xs" variant={i === 1 ? "soft" : "ghost"}>
                    {r}
                  </Button>
                ))}
              </div>
            }
          />
          <div className="px-2 pb-2 pt-3">
            <SalesTrendChart data={salesTrend} />
          </div>
        </Card>

        <Card>
          <CardHead title="Payment methods" subtitle="Share of collections" />
          <DonutChart data={paymentMix} />
        </Card>

        <Card>
          <CardHead title="Top products" subtitle="By revenue this month" />
          <RankBars data={topProducts} />
        </Card>

        <Card>
          <CardHead title="Top customers" subtitle="By lifetime value" />
          <RankBars data={topCustomers} />
        </Card>

        <Card>
          <CardHead title="Collections summary" subtitle="Outstanding & received" />
          <div className="space-y-2 p-4">
            {[
              { label: "Received today", value: currency(164200), tone: "text-success" },
              { label: "Pending (0–30 days)", value: currency(286400), tone: "text-warning" },
              { label: "Overdue (30+ days)", value: currency(94800), tone: "text-danger" },
              { label: "Cancelled this month", value: currency(18600), tone: "text-muted-foreground" },
            ].map((r) => (
              <div
                key={r.label}
                className="flex items-center justify-between rounded-md bg-surface-muted px-3 py-2"
              >
                <span className="text-[12px] font-medium text-muted-foreground">{r.label}</span>
                <span className={cn("num text-[13px] font-bold", r.tone)}>{r.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="mt-3 overflow-hidden">
        <CardHead
          title="Recent invoices"
          subtitle="Latest billing activity"
          action={
            <Link to="/invoices">
              <Button size="xs" variant="ghost">
                View all
              </Button>
            </Link>
          }
        />
        <div className="scrollbar-thin overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border bg-surface-muted/70 text-[11px] uppercase tracking-wide text-muted-foreground">
                <th className="px-3 py-2 text-left font-bold">Invoice</th>
                <th className="px-3 py-2 text-left font-bold">Customer</th>
                <th className="px-3 py-2 text-left font-bold">Date</th>
                <th className="px-3 py-2 text-left font-bold">Payment</th>
                <th className="px-3 py-2 text-right font-bold">Amount</th>
                <th className="px-3 py-2 text-center font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recent.map((inv) => (
                <tr key={inv.id} className="transition hover:bg-primary-soft/40">
                  <td className="num px-3 py-2 font-semibold">{inv.number}</td>
                  <td className="max-w-40 truncate px-3 py-2">{inv.customer}</td>
                  <td className="num px-3 py-2 text-muted-foreground">{inv.date}</td>
                  <td className="px-3 py-2 text-muted-foreground">{inv.payment}</td>
                  <td className="num px-3 py-2 text-right font-bold">{currency(inv.amount)}</td>
                  <td className="px-3 py-2 text-center">
                    <StatusBadge status={inv.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
