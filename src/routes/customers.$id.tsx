import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Mail, MessageCircle, Phone, Plus } from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { Button, Card, CardHead, EmptyState, StatusBadge } from "@/components/kit";
import { currency, customers, invoices } from "@/data/mock";

export const Route = createFileRoute("/customers/$id")({
  head: () => ({
    meta: [
      { title: "Customer details — Billing Desk" },
      {
        name: "description",
        content: "Customer profile with purchase totals, invoice history and quick contact actions.",
      },
      { property: "og:title", content: "Customer details — Billing Desk" },
      { property: "og:description", content: "Full billing history for a single customer." },
    ],
  }),
  component: CustomerDetail,
});

function CustomerDetail() {
  const { id } = useParams({ from: "/customers/$id" });
  const customer = customers.find((c) => c.id === id);
  const history = invoices.filter((i) => i.customerId === id);

  if (!customer)
    return (
      <Card>
        <EmptyState
          title="Customer not found"
          message="This record does not exist in the sample dataset."
          action={
            <Link to="/customers">
              <Button size="sm" variant="primary">
                Back to customers
              </Button>
            </Link>
          }
        />
      </Card>
    );

  return (
    <>
      <Link
        to="/customers"
        className="mb-2 inline-flex items-center gap-1 text-[12px] font-semibold text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" /> Customers
      </Link>

      <PageHeader
        title={customer.name}
        subtitle={`${customer.id} · ${customer.city}${customer.gstin ? " · GSTIN " + customer.gstin : ""}`}
        actions={
          <Link to="/invoices/new">
            <Button variant="primary" size="sm">
              <Plus /> Create Invoice
            </Button>
          </Link>
        }
      />

      <div className="grid gap-2.5 lg:grid-cols-[300px_minmax(0,1fr)]">
        <div className="space-y-2.5">
          <Card>
            <CardHead title="Customer information" />
            <dl className="divide-y divide-border text-[13px]">
              {[
                ["Mobile", customer.mobile],
                ["Email", customer.email],
                ["City", customer.city],
                ["GSTIN", customer.gstin ?? "Not registered"],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between gap-3 px-3 py-2">
                  <dt className="text-[12px] text-muted-foreground">{k}</dt>
                  <dd className="num min-w-0 truncate font-medium">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="grid grid-cols-3 gap-1.5 border-t border-border p-2.5">
              <Button size="sm" variant="secondary">
                <Phone /> Call
              </Button>
              <Button size="sm" variant="secondary">
                <MessageCircle /> Chat
              </Button>
              <Button size="sm" variant="secondary">
                <Mail /> Email
              </Button>
            </div>
          </Card>

          <div className="grid grid-cols-3 gap-2.5 lg:grid-cols-1">
            {[
              ["Total purchases", currency(customer.totalPurchase)],
              ["Invoice count", String(customer.invoices)],
              ["Last purchase", customer.lastPurchase],
            ].map(([k, v]) => (
              <Card key={k} className="p-3">
                <p className="truncate text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {k}
                </p>
                <p className="num mt-1 truncate text-[17px] font-extrabold">{v}</p>
              </Card>
            ))}
          </div>
        </div>

        <Card className="overflow-hidden">
          <CardHead title="Invoice history" subtitle={`${history.length} invoices on record`} />
          {history.length === 0 ? (
            <EmptyState title="No invoices yet" message="Invoices raised for this customer will appear here." />
          ) : (
            <div className="scrollbar-thin overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-border bg-surface-muted/70 text-[11px] uppercase tracking-wide text-muted-foreground">
                    <th className="px-3 py-2 text-left font-bold">Invoice</th>
                    <th className="px-3 py-2 text-left font-bold">Date</th>
                    <th className="px-3 py-2 text-left font-bold">Payment</th>
                    <th className="px-3 py-2 text-right font-bold">Amount</th>
                    <th className="px-3 py-2 text-center font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {history.map((i) => (
                    <tr key={i.id} className="hover:bg-primary-soft/40">
                      <td className="num px-3 py-2 font-semibold">{i.number}</td>
                      <td className="num px-3 py-2 text-muted-foreground">{i.date}</td>
                      <td className="px-3 py-2 text-muted-foreground">{i.payment}</td>
                      <td className="num px-3 py-2 text-right font-bold">{currency(i.amount)}</td>
                      <td className="px-3 py-2 text-center">
                        <StatusBadge status={i.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
