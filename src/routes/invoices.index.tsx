import { createFileRoute } from "@tanstack/react-router";
import { Ban, Copy, Eye, Mail, MoreHorizontal, Printer } from "lucide-react";
import * as React from "react";
import { PageHeader } from "@/components/AppShell";
import { DataTable, type Column } from "@/components/DataTable";
import {
  Button,
  Card,
  ConfirmDialog,
  Dropdown,
  Input,
  MenuItem,
  MenuSep,
  SearchBar,
  Select,
  StatusBadge,
  useToast,
} from "@/components/kit";
import { currency, customers, invoices, type Invoice } from "@/data/mock";

export const Route = createFileRoute("/invoices/")({
  head: () => ({
    meta: [
      { title: "Invoice History — Billing Desk" },
      {
        name: "description",
        content:
          "Search every invoice by date, customer, status and payment method, then print, email or duplicate in one click.",
      },
      { property: "og:title", content: "Invoice History — Billing Desk" },
      { property: "og:description", content: "A complete, filterable register of your billing history." },
    ],
  }),
  component: InvoiceHistory,
});

function InvoiceHistory() {
  const toast = useToast();
  const [q, setQ] = React.useState("");
  const [customer, setCustomer] = React.useState("All");
  const [status, setStatus] = React.useState("All");
  const [payment, setPayment] = React.useState("All");
  const [from, setFrom] = React.useState("");
  const [cancel, setCancel] = React.useState<Invoice | null>(null);

  const rows = invoices.filter(
    (i) =>
      (customer === "All" || i.customer === customer) &&
      (status === "All" || i.status === status) &&
      (payment === "All" || i.payment === payment) &&
      (!from || i.date >= from) &&
      (i.number.toLowerCase().includes(q.toLowerCase()) ||
        i.customer.toLowerCase().includes(q.toLowerCase())),
  );

  const cols: Column<Invoice>[] = [
    { key: "number", header: "Invoice", sortable: true, sortValue: (r) => r.number, cell: (r) => <span className="num font-semibold">{r.number}</span> },
    {
      key: "customer",
      header: "Customer",
      sortable: true,
      sortValue: (r) => r.customer,
      cell: (r) => <span className="block max-w-44 truncate">{r.customer}</span>,
    },
    { key: "date", header: "Date", sortable: true, sortValue: (r) => r.date, cell: (r) => <span className="num text-muted-foreground">{r.date}</span> },
    { key: "amount", header: "Amount", align: "right", sortable: true, sortValue: (r) => r.amount, cell: (r) => <span className="num font-bold">{currency(r.amount)}</span> },
    { key: "payment", header: "Payment", sortable: true, sortValue: (r) => r.payment, cell: (r) => <span className="text-muted-foreground">{r.payment}</span> },
    { key: "status", header: "Status", align: "center", sortable: true, sortValue: (r) => r.status, cell: (r) => <StatusBadge status={r.status} /> },
    { key: "createdBy", header: "Created By", cell: (r) => <span className="text-muted-foreground">{r.createdBy}</span> },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      cell: (r) => (
        <div className="flex justify-end">
          <Dropdown
            trigger={() => (
              <Button variant="ghost" size="icon-sm" aria-label="Actions">
                <MoreHorizontal />
              </Button>
            )}
          >
            {(close) => (
              <>
                <MenuItem icon={Eye} onClick={close}>View</MenuItem>
                <MenuItem icon={Printer} onClick={close}>Print</MenuItem>
                <MenuItem icon={Mail} onClick={close}>Email</MenuItem>
                <MenuItem icon={Copy} onClick={close}>Duplicate</MenuItem>
                <MenuSep />
                <MenuItem icon={Ban} tone="danger" onClick={() => { close(); setCancel(r); }}>
                  Cancel
                </MenuItem>
              </>
            )}
          </Dropdown>
        </div>
      ),
    },
  ];

  const total = rows.reduce((s, r) => s + (r.status === "Cancelled" ? 0 : r.amount), 0);

  return (
    <>
      <PageHeader
        title="Invoice History"
        subtitle={`${rows.length} invoices · ${currency(total)} billed`}
        actions={
          <Button variant="secondary" size="sm">
            <Printer /> Print register
          </Button>
        }
      />

      <Card className="overflow-hidden">
        <div className="grid grid-cols-2 gap-2 border-b border-border p-3 lg:grid-cols-[minmax(0,1fr)_140px_150px_130px_130px]">
          <SearchBar value={q} onChange={setQ} placeholder="Search invoice or customer…" className="col-span-2 lg:col-span-1" />
          <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="num" />
          <Select value={customer} onChange={(e) => setCustomer(e.target.value)}>
            {["All", ...customers.map((c) => c.name)].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </Select>
          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            {["All", "Paid", "Pending", "Overdue", "Cancelled"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </Select>
          <Select value={payment} onChange={(e) => setPayment(e.target.value)}>
            {["All", "Cash", "UPI", "Card", "Bank", "Credit"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </Select>
        </div>
        <DataTable
          columns={cols}
          rows={rows}
          pageSize={10}
          dense
          mobileRow={(r) => (
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
              <div className="min-w-0">
                <p className="num truncate text-[13px] font-semibold">{r.number}</p>
                <p className="truncate text-[11px] text-muted-foreground">
                  {r.customer} · {r.payment}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="num text-[13px] font-bold">{currency(r.amount)}</span>
                <StatusBadge status={r.status} />
              </div>
            </div>
          )}
        />
      </Card>

      <ConfirmDialog
        open={!!cancel}
        onClose={() => setCancel(null)}
        destructive
        title="Cancel this invoice?"
        confirmLabel="Cancel invoice"
        message={`Invoice ${cancel?.number} for ${currency(cancel?.amount ?? 0)} will be marked as cancelled and excluded from sales reports.`}
        onConfirm={() => {
          setCancel(null);
          toast({ title: "Invoice cancelled", tone: "danger", message: "The register has been updated." });
        }}
      />
    </>
  );
}
