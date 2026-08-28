import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  MessageCircle,
  MoreHorizontal,
  Phone,
  Plus,
  Mail,
  Eye,
  FileText,
} from "lucide-react";
import * as React from "react";
import { PageHeader } from "@/components/AppShell";
import { DataTable, type Column } from "@/components/DataTable";
import {
  Button,
  Card,
  Dropdown,
  FormField,
  Input,
  MenuItem,
  MenuSep,
  Modal,
  SearchBar,
  Select,
  useToast,
} from "@/components/kit";
import { currency, customers, type Customer } from "@/data/mock";

export const Route = createFileRoute("/customers/")({
  head: () => ({
    meta: [
      { title: "Customers — Billing Desk" },
      {
        name: "description",
        content:
          "Customer ledger with purchase history, invoice counts and one-tap call, WhatsApp and email actions.",
      },
      { property: "og:title", content: "Customers — Billing Desk" },
      { property: "og:description", content: "Search, sort and manage your billing customers." },
    ],
  }),
  component: CustomersPage,
});

function CustomersPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [q, setQ] = React.useState("");
  const [city, setCity] = React.useState("All");
  const [add, setAdd] = React.useState(false);

  const rows = customers.filter(
    (c) =>
      (city === "All" || c.city === city) &&
      (c.name.toLowerCase().includes(q.toLowerCase()) ||
        c.mobile.includes(q) ||
        c.email.toLowerCase().includes(q.toLowerCase())),
  );

  const cols: Column<Customer>[] = [
    {
      key: "name",
      header: "Name",
      sortable: true,
      sortValue: (r) => r.name,
      cell: (r) => (
        <div className="flex min-w-0 items-center gap-2">
          <span className="grid size-7 shrink-0 place-items-center rounded-md bg-primary-soft text-[11px] font-bold text-primary">
            {r.name.slice(0, 2).toUpperCase()}
          </span>
          <span className="min-w-0">
            <span className="block truncate font-semibold">{r.name}</span>
            <span className="block truncate text-[11px] text-muted-foreground">{r.city}</span>
          </span>
        </div>
      ),
    },
    { key: "mobile", header: "Mobile", sortable: true, sortValue: (r) => r.mobile, cell: (r) => <span className="num">{r.mobile}</span> },
    {
      key: "email",
      header: "Email",
      cell: (r) => <span className="block max-w-52 truncate text-muted-foreground">{r.email}</span>,
    },
    { key: "invoices", header: "Invoices", align: "right", sortable: true, sortValue: (r) => r.invoices, cell: (r) => <span className="num">{r.invoices}</span> },
    {
      key: "total",
      header: "Total Purchase",
      align: "right",
      sortable: true,
      sortValue: (r) => r.totalPurchase,
      cell: (r) => <span className="num font-bold">{currency(r.totalPurchase)}</span>,
    },
    {
      key: "last",
      header: "Last Purchase",
      align: "right",
      sortable: true,
      sortValue: (r) => r.lastPurchase,
      cell: (r) => <span className="num text-muted-foreground">{r.lastPurchase}</span>,
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      cell: (r) => (
        <div onClick={(e) => e.stopPropagation()} className="flex justify-end">
          <Dropdown
            trigger={() => (
              <Button variant="ghost" size="icon-sm" aria-label="Actions">
                <MoreHorizontal />
              </Button>
            )}
          >
            {(close) => (
              <>
                <MenuItem icon={Eye} onClick={() => { close(); navigate({ to: "/customers/$id", params: { id: r.id } }); }}>
                  View
                </MenuItem>
                <MenuItem icon={FileText} onClick={() => { close(); navigate({ to: "/invoices/new" }); }}>
                  Create Invoice
                </MenuItem>
                <MenuSep />
                <MenuItem icon={Phone} onClick={close}>Call</MenuItem>
                <MenuItem icon={MessageCircle} onClick={close}>WhatsApp</MenuItem>
                <MenuItem icon={Mail} onClick={close}>Email</MenuItem>
              </>
            )}
          </Dropdown>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Customers"
        subtitle={`${customers.length} customers · ${currency(customers.reduce((s, c) => s + c.totalPurchase, 0))} lifetime value`}
        actions={
          <Button variant="primary" size="sm" onClick={() => setAdd(true)}>
            <Plus /> Add Customer
          </Button>
        }
      />

      <Card className="overflow-hidden">
        <div className="grid grid-cols-1 gap-2 border-b border-border p-3 sm:grid-cols-[minmax(0,1fr)_150px]">
          <SearchBar value={q} onChange={setQ} placeholder="Search name, mobile or email…" />
          <Select value={city} onChange={(e) => setCity(e.target.value)}>
            {["All", ...Array.from(new Set(customers.map((c) => c.city)))].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </Select>
        </div>
        <DataTable
          columns={cols}
          rows={rows}
          pageSize={8}
          rowHref={(r) => navigate({ to: "/customers/$id", params: { id: r.id } })}
          mobileRow={(r) => (
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold">{r.name}</p>
                <p className="num truncate text-[11px] text-muted-foreground">
                  {r.mobile} · {r.invoices} bills
                </p>
              </div>
              <div className="text-right">
                <p className="num text-[13px] font-bold">{currency(r.totalPurchase)}</p>
                <p className="num text-[11px] text-muted-foreground">{r.lastPurchase}</p>
              </div>
            </div>
          )}
        />
      </Card>

      <Modal
        open={add}
        onClose={() => setAdd(false)}
        title="Add customer"
        description="Customer records are mock data in this prototype."
        footer={
          <>
            <Button size="sm" variant="secondary" onClick={() => setAdd(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={() => {
                setAdd(false);
                toast({ title: "Customer added", tone: "success" });
              }}
            >
              Save customer
            </Button>
          </>
        }
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <FormField label="Customer name" required>
            <Input placeholder="e.g. Aarav Traders" />
          </FormField>
          <FormField label="Mobile" required>
            <Input placeholder="98404 21188" inputMode="tel" className="num" />
          </FormField>
          <FormField label="Email">
            <Input placeholder="accounts@example.com" />
          </FormField>
          <FormField label="City">
            <Input placeholder="Chennai" />
          </FormField>
          <FormField label="GSTIN" className="sm:col-span-2" hint="Optional — required for GST invoices.">
            <Input placeholder="33AABCU9603R1Z2" className="num uppercase" />
          </FormField>
        </div>
      </Modal>
    </>
  );
}
