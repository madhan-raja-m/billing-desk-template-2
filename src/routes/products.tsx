import { createFileRoute } from "@tanstack/react-router";
import { Copy, Download, MoreHorizontal, Pencil, Plus, Trash2, Upload } from "lucide-react";
import * as React from "react";
import { PageHeader } from "@/components/AppShell";
import { DataTable, type Column } from "@/components/DataTable";
import {
  Button,
  Card,
  ConfirmDialog,
  Dropdown,
  FormField,
  Input,
  MenuItem,
  MenuSep,
  Modal,
  SearchBar,
  Select,
  StatusBadge,
  useToast,
} from "@/components/kit";
import { currency, products, type Product } from "@/data/mock";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Products — Billing Desk" },
      {
        name: "description",
        content: "Product catalogue with SKU, HSN/SAC, pricing, GST rate and stock status for fast billing.",
      },
      { property: "og:title", content: "Products — Billing Desk" },
      { property: "og:description", content: "Manage your billing catalogue, pricing and GST rates." },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const toast = useToast();
  const [q, setQ] = React.useState("");
  const [cat, setCat] = React.useState("All");
  const [status, setStatus] = React.useState("All");
  const [add, setAdd] = React.useState(false);
  const [del, setDel] = React.useState<Product | null>(null);

  const rows = products.filter(
    (p) =>
      (cat === "All" || p.category === cat) &&
      (status === "All" || p.status === status) &&
      (p.name.toLowerCase().includes(q.toLowerCase()) || p.sku.toLowerCase().includes(q.toLowerCase())),
  );

  const cols: Column<Product>[] = [
    {
      key: "name",
      header: "Product",
      sortable: true,
      sortValue: (r) => r.name,
      cell: (r) => (
        <div className="min-w-0">
          <span className="block truncate font-semibold">{r.name}</span>
          <span className="num block text-[11px] text-muted-foreground">
            {r.stock} in stock
          </span>
        </div>
      ),
    },
    { key: "sku", header: "SKU", sortable: true, sortValue: (r) => r.sku, cell: (r) => <span className="num text-muted-foreground">{r.sku}</span> },
    { key: "category", header: "Category", sortable: true, sortValue: (r) => r.category, cell: (r) => r.category },
    { key: "hsn", header: "HSN/SAC", cell: (r) => <span className="num text-muted-foreground">{r.hsn}</span> },
    {
      key: "price",
      header: "Price",
      align: "right",
      sortable: true,
      sortValue: (r) => r.price,
      cell: (r) => <span className="num font-bold">{currency(r.price)}</span>,
    },
    { key: "gst", header: "GST", align: "right", sortable: true, sortValue: (r) => r.gst, cell: (r) => <span className="num">{r.gst}%</span> },
    { key: "status", header: "Status", align: "center", cell: (r) => <StatusBadge status={r.status} /> },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      cell: (r) => (
        <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
          <Dropdown
            trigger={() => (
              <Button variant="ghost" size="icon-sm" aria-label="Actions">
                <MoreHorizontal />
              </Button>
            )}
          >
            {(close) => (
              <>
                <MenuItem icon={Pencil} onClick={close}>Edit</MenuItem>
                <MenuItem icon={Copy} onClick={close}>Duplicate</MenuItem>
                <MenuSep />
                <MenuItem icon={Trash2} tone="danger" onClick={() => { close(); setDel(r); }}>
                  Delete
                </MenuItem>
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
        title="Products"
        subtitle={`${products.length} items in catalogue`}
        actions={
          <>
            <Button variant="secondary" size="sm" className="hidden sm:inline-flex">
              <Upload /> Import
            </Button>
            <Button variant="secondary" size="sm" className="hidden sm:inline-flex">
              <Download /> Export
            </Button>
            <Button variant="primary" size="sm" onClick={() => setAdd(true)}>
              <Plus /> Add Product
            </Button>
          </>
        }
      />

      <Card className="overflow-hidden">
        <div className="grid grid-cols-2 gap-2 border-b border-border p-3 sm:grid-cols-[minmax(0,1fr)_150px_150px]">
          <SearchBar value={q} onChange={setQ} placeholder="Search product or SKU…" className="col-span-2 sm:col-span-1" />
          <Select value={cat} onChange={(e) => setCat(e.target.value)}>
            {["All", ...Array.from(new Set(products.map((p) => p.category)))].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </Select>
          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            {["All", "Active", "Low stock", "Inactive"].map((c) => (
              <option key={c}>{c}</option>
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
                <p className="truncate text-[13px] font-semibold">{r.name}</p>
                <p className="num truncate text-[11px] text-muted-foreground">
                  {r.sku} · HSN {r.hsn} · GST {r.gst}%
                </p>
              </div>
              <div className="text-right">
                <p className="num text-[13px] font-bold">{currency(r.price)}</p>
                <StatusBadge status={r.status} />
              </div>
            </div>
          )}
        />
      </Card>

      <Modal
        open={add}
        onClose={() => setAdd(false)}
        title="Add product"
        size="lg"
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
                toast({ title: "Product saved", tone: "success" });
              }}
            >
              Save product
            </Button>
          </>
        }
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <FormField label="Product name" required className="sm:col-span-2">
            <Input placeholder="e.g. LED Panel Light 18W" />
          </FormField>
          <FormField label="SKU" required>
            <Input placeholder="LED-1801" className="num uppercase" />
          </FormField>
          <FormField label="Category">
            <Select>
              {Array.from(new Set(products.map((p) => p.category))).map((c) => (
                <option key={c}>{c}</option>
              ))}
            </Select>
          </FormField>
          <FormField label="HSN / SAC">
            <Input placeholder="9405" className="num" />
          </FormField>
          <FormField label="Selling price" required>
            <Input placeholder="640" className="num" inputMode="decimal" />
          </FormField>
          <FormField label="GST rate">
            <Select defaultValue="18">
              {[0, 5, 12, 18, 28].map((g) => (
                <option key={g} value={g}>
                  {g}%
                </option>
              ))}
            </Select>
          </FormField>
          <FormField label="Opening stock">
            <Input placeholder="0" className="num" inputMode="numeric" />
          </FormField>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!del}
        onClose={() => setDel(null)}
        destructive
        confirmLabel="Delete product"
        title="Delete product?"
        message={`“${del?.name}” will be removed from the catalogue. This cannot be undone.`}
        onConfirm={() => {
          setDel(null);
          toast({ title: "Product deleted", tone: "danger" });
        }}
      />
    </>
  );
}
