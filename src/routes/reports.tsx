import { createFileRoute } from "@tanstack/react-router";
import { FileSpreadsheet, Filter } from "lucide-react";
import * as React from "react";
import { PageHeader } from "@/components/AppShell";
import { RankBars, SalesTrendChart } from "@/components/charts";
import {
  Button,
  Card,
  CardHead,
  Input,
  Pagination,
  SearchBar,
  Select,
  useToast,
} from "@/components/kit";
import { currency, invoices, reportCategories, salesTrend, topProducts } from "@/data/mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports — Billing Desk" },
      {
        name: "description",
        content:
          "Sales, GST, customer and product reports with date ranges, filters and one-click Excel export.",
      },
      { property: "og:title", content: "Reports — Billing Desk" },
      { property: "og:description", content: "Every billing report your accountant asks for, in one place." },
    ],
  }),
  component: ReportsPage,
});

function ReportsPage() {
  const toast = useToast();
  const [active, setActive] = React.useState("Daily Sales");
  const [q, setQ] = React.useState("");
  const [page, setPage] = React.useState(1);

  const rows = invoices
    .filter((i) => i.customer.toLowerCase().includes(q.toLowerCase()) || i.number.includes(q))
    .slice(0, 24);
  const view = rows.slice((page - 1) * 8, page * 8);
  const total = rows.reduce((s, r) => s + r.amount, 0);

  return (
    <>
      <PageHeader
        title="Reports"
        subtitle="01 Aug 2026 – 26 Aug 2026 · FY 2026–27"
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => toast({ title: "Export queued", tone: "success", message: `${active}.xlsx will download shortly.` })}
          >
            <FileSpreadsheet /> Export Excel
          </Button>
        }
      />

      <div className="grid gap-2.5 lg:grid-cols-[220px_minmax(0,1fr)]">
        <Card className="h-fit overflow-hidden lg:sticky lg:top-16">
          <div className="scrollbar-thin max-h-[70vh] overflow-y-auto p-2">
            {reportCategories.map((g) => (
              <div key={g.group} className="mb-2">
                <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  {g.group}
                </p>
                {g.items.map((item) => (
                  <button
                    key={item}
                    onClick={() => setActive(item)}
                    className={cn(
                      "block w-full truncate rounded-md px-2 py-1.5 text-left text-[13px] font-medium transition",
                      active === item
                        ? "bg-primary-soft font-semibold text-primary"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                    )}
                  >
                    {item}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-2.5">
          <Card>
            <CardHead
              title={active}
              subtitle="Generated from sample data"
              action={
                <Button size="xs" variant="ghost">
                  <Filter /> More filters
                </Button>
              }
            />
            <div className="grid grid-cols-2 gap-2 p-3 lg:grid-cols-[130px_130px_150px_minmax(0,1fr)]">
              <Input type="date" defaultValue="2026-08-01" className="num" />
              <Input type="date" defaultValue="2026-08-26" className="num" />
              <Select defaultValue="All payments">
                {["All payments", "Cash", "UPI", "Card", "Bank", "Credit"].map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </Select>
              <SearchBar value={q} onChange={setQ} placeholder="Search within report…" className="col-span-2 lg:col-span-1" />
            </div>
          </Card>

          <div className="grid gap-2.5 lg:grid-cols-3">
            {[
              ["Gross sales", currency(3846500)],
              ["Taxable value", currency(3260180)],
              ["GST collected", currency(486320)],
            ].map(([k, v]) => (
              <Card key={k} className="p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{k}</p>
                <p className="num mt-1 text-[18px] font-extrabold">{v}</p>
              </Card>
            ))}
          </div>

          <div className="grid gap-2.5 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHead title="Trend" subtitle="Daily totals for the selected range" />
              <div className="px-2 pb-2 pt-3">
                <SalesTrendChart data={salesTrend} />
              </div>
            </Card>
            <Card>
              <CardHead title="Breakdown" subtitle="Top contributors" />
              <RankBars data={topProducts} />
            </Card>
          </div>

          <Card className="overflow-hidden">
            <CardHead title="Report data" subtitle={`${rows.length} rows · ${currency(total)}`} />
            <div className="scrollbar-thin overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-border bg-surface-muted/70 text-[11px] uppercase tracking-wide text-muted-foreground">
                    <th className="px-3 py-2 text-left font-bold">Invoice</th>
                    <th className="px-3 py-2 text-left font-bold">Date</th>
                    <th className="px-3 py-2 text-left font-bold">Customer</th>
                    <th className="px-3 py-2 text-left font-bold">Payment</th>
                    <th className="px-3 py-2 text-right font-bold">Taxable</th>
                    <th className="px-3 py-2 text-right font-bold">GST</th>
                    <th className="px-3 py-2 text-right font-bold">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {view.map((r) => {
                    const gst = Math.round(r.amount * 0.15);
                    return (
                      <tr key={r.id} className="hover:bg-primary-soft/40">
                        <td className="num px-3 py-1.5 font-semibold">{r.number}</td>
                        <td className="num px-3 py-1.5 text-muted-foreground">{r.date}</td>
                        <td className="max-w-40 truncate px-3 py-1.5">{r.customer}</td>
                        <td className="px-3 py-1.5 text-muted-foreground">{r.payment}</td>
                        <td className="num px-3 py-1.5 text-right">{currency(r.amount - gst)}</td>
                        <td className="num px-3 py-1.5 text-right">{currency(gst)}</td>
                        <td className="num px-3 py-1.5 text-right font-bold">{currency(r.amount)}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t border-border bg-surface-muted text-[13px] font-bold">
                    <td className="px-3 py-2" colSpan={6}>
                      Total
                    </td>
                    <td className="num px-3 py-2 text-right">{currency(total)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <Pagination
              page={page}
              pageCount={Math.ceil(rows.length / 8)}
              total={rows.length}
              pageSize={8}
              onPage={setPage}
            />
          </Card>
        </div>
      </div>
    </>
  );
}
