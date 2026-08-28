import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Eye, MessageCircle, MoreHorizontal, Phone, Receipt } from "lucide-react";
import * as React from "react";
import { PageHeader } from "@/components/AppShell";
import { DataTable, type Column } from "@/components/DataTable";
import {
  Button,
  Card,
  Dropdown,
  MenuItem,
  MenuSep,
  SearchBar,
  Select,
  StatusBadge,
} from "@/components/kit";
import { enquiries, type Enquiry } from "@/data/mock";

export const Route = createFileRoute("/enquiries")({
  head: () => ({
    meta: [
      { title: "Enquiries — Billing Desk" },
      {
        name: "description",
        content: "Track walk-in and phone enquiries, follow up on WhatsApp and convert them into invoices.",
      },
      { property: "og:title", content: "Enquiries — Billing Desk" },
      { property: "og:description", content: "Enquiry pipeline from first contact to billed order." },
    ],
  }),
  component: EnquiriesPage,
});

function EnquiriesPage() {
  const navigate = useNavigate();
  const [q, setQ] = React.useState("");
  const [status, setStatus] = React.useState("All");

  const rows = enquiries.filter(
    (e) =>
      (status === "All" || e.status === status) &&
      (e.customer.toLowerCase().includes(q.toLowerCase()) ||
        e.mobile.includes(q) ||
        e.location.toLowerCase().includes(q.toLowerCase())),
  );

  const cols: Column<Enquiry>[] = [
    {
      key: "customer",
      header: "Customer",
      sortable: true,
      sortValue: (r) => r.customer,
      cell: (r) => (
        <div className="min-w-0">
          <span className="block truncate font-semibold">{r.customer}</span>
          <span className="block truncate text-[11px] text-muted-foreground">{r.interest}</span>
        </div>
      ),
    },
    { key: "mobile", header: "Mobile", sortable: true, sortValue: (r) => r.mobile, cell: (r) => <span className="num">{r.mobile}</span> },
    { key: "location", header: "Location", sortable: true, sortValue: (r) => r.location, cell: (r) => <span className="text-muted-foreground">{r.location}</span> },
    { key: "date", header: "Date", sortable: true, sortValue: (r) => r.date, cell: (r) => <span className="num text-muted-foreground">{r.date}</span> },
    { key: "status", header: "Status", align: "center", sortable: true, sortValue: (r) => r.status, cell: (r) => <StatusBadge status={r.status} /> },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      cell: () => (
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
                <MenuItem icon={Phone} onClick={close}>Call</MenuItem>
                <MenuItem icon={MessageCircle} onClick={close}>WhatsApp</MenuItem>
                <MenuSep />
                <MenuItem icon={Receipt} onClick={() => { close(); navigate({ to: "/invoices/new" }); }}>
                  Bill Now
                </MenuItem>
                <MenuItem icon={Eye} onClick={close}>View</MenuItem>
              </>
            )}
          </Dropdown>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader title="Enquiries" subtitle={`${enquiries.length} enquiries · 3 awaiting follow-up`} />
      <Card className="overflow-hidden">
        <div className="grid grid-cols-1 gap-2 border-b border-border p-3 sm:grid-cols-[minmax(0,1fr)_160px]">
          <SearchBar value={q} onChange={setQ} placeholder="Search customer, mobile or location…" />
          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            {["All", "New", "Contacted", "Quoted", "Converted", "Lost"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </Select>
        </div>
        <DataTable
          columns={cols}
          rows={rows}
          pageSize={8}
          mobileRow={(r) => (
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold">{r.customer}</p>
                <p className="num truncate text-[11px] text-muted-foreground">
                  {r.mobile} · {r.location}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <StatusBadge status={r.status} />
                <span className="num text-[11px] text-muted-foreground">{r.date}</span>
              </div>
            </div>
          )}
        />
      </Card>
    </>
  );
}
