import { createFileRoute } from "@tanstack/react-router";
import { Check, Phone, Plus, Save, Search, TicketPercent, Trash2, UserPlus, X } from "lucide-react";
import * as React from "react";
import { PageHeader } from "@/components/AppShell";
import {
  Button,
  Card,
  CardHead,
  Checkbox,
  ConfirmDialog,
  FormField,
  Input,
  Select,
  useToast,
} from "@/components/kit";
import {
  coupons,
  currency,
  customers,
  products,
  type Coupon,
  type Customer,
  type Product,
} from "@/data/mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/invoices/new")({
  head: () => ({
    meta: [
      { title: "Create Invoice — Billing Desk" },
      {
        name: "description",
        content:
          "Fast GST invoice entry: customer lookup by mobile, product autocomplete, live totals and one-tap billing.",
      },
      { property: "og:title", content: "Create Invoice — Billing Desk" },
      { property: "og:description", content: "Compact billing screen built for fast daily invoicing." },
    ],
  }),
  component: CreateInvoice,
});

type Line = { id: string; name: string; qty: number; price: number; gst: number };

let seq = 1;
const newLine = (p?: Product): Line => ({
  id: "L" + seq++,
  name: p?.name ?? "",
  qty: 1,
  price: p?.price ?? 0,
  gst: p?.gst ?? 18,
});

/* ------------------------------------------------------- CustomerLookup */

function CustomerLookup({ onPick }: { onPick: (c: Customer) => void }) {
  const [q, setQ] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const results = q
    ? customers
        .filter(
          (c) =>
            c.mobile.replace(/\s/g, "").includes(q.replace(/\s/g, "")) ||
            c.name.toLowerCase().includes(q.toLowerCase()),
        )
        .slice(0, 5)
    : [];

  return (
    <div className="relative">
      <Label>Mobile number / customer search</Label>
      <div className="relative">
        <Phone className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={q}
          inputMode="tel"
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Type mobile or name…"
          className="h-10 pl-8 text-[15px] font-semibold tracking-wide"
        />
        {q ? (
          <button
            onClick={() => setQ("")}
            aria-label="Clear"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:bg-secondary"
          >
            <X className="size-3.5" />
          </button>
        ) : null}
      </div>
      {open && q ? (
        <div className="absolute z-40 mt-1 w-full overflow-hidden rounded-lg border border-border bg-popover p-1 shadow-pop">
          {results.length === 0 ? (
            <button className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-[13px] font-semibold text-primary hover:bg-primary-soft">
              <UserPlus className="size-3.5" /> Add “{q}” as new customer
            </button>
          ) : (
            results.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  onPick(c);
                  setQ(c.mobile);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between gap-3 rounded-md px-2 py-1.5 text-left hover:bg-secondary"
              >
                <span className="min-w-0">
                  <span className="block truncate text-[13px] font-semibold">{c.name}</span>
                  <span className="num block text-[11px] text-muted-foreground">{c.mobile}</span>
                </span>
                <span className="num shrink-0 text-[11px] text-muted-foreground">
                  {c.invoices} bills
                </span>
              </button>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
      {children}
    </span>
  );
}

/* -------------------------------------------------------- ProductSelector */

function ProductSelector({
  value,
  onChange,
  onPick,
  invalid,
}: {
  value: string;
  onChange: (v: string) => void;
  onPick: (p: Product) => void;
  invalid?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const results = value
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(value.toLowerCase()) ||
            p.sku.toLowerCase().includes(value.toLowerCase()),
        )
        .slice(0, 6)
    : products.slice(0, 6);
  return (
    <div className="relative">
      <div className="relative">
        <Search className="pointer-events-none absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={value}
          {...(invalid ? { invalid: true } : {})}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 140)}
          placeholder="Search product or SKU…"
          className="h-9 pl-7"
        />
      </div>
      {open ? (
        <div className="absolute z-40 mt-1 max-h-56 w-full min-w-64 overflow-y-auto rounded-lg border border-border bg-popover p-1 shadow-pop">
          {results.map((p) => (
            <button
              key={p.id}
              onMouseDown={() => {
                onPick(p);
                setOpen(false);
              }}
              className="flex w-full items-center justify-between gap-3 rounded-md px-2 py-1.5 text-left hover:bg-secondary"
            >
              <span className="min-w-0">
                <span className="block truncate text-[13px] font-medium">{p.name}</span>
                <span className="num block text-[11px] text-muted-foreground">
                  {p.sku} · HSN {p.hsn}
                </span>
              </span>
              <span className="num shrink-0 text-[12px] font-bold">{currency(p.price)}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------- the screen */

function CreateInvoice() {
  const toast = useToast();
  const [customer, setCustomer] = React.useState<Customer | null>(null);
  const [gstBilling, setGstBilling] = React.useState(true);
  const [discount, setDiscount] = React.useState(0);
  const [lines, setLines] = React.useState<Line[]>([
    newLine(products[0]),
    newLine(products[1]),
  ]);
  const [touched, setTouched] = React.useState(false);
  const [confirm, setConfirm] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [couponCode, setCouponCode] = React.useState("");
  const [coupon, setCoupon] = React.useState<Coupon | null>(null);
  const [couponError, setCouponError] = React.useState<string | null>(null);

  const update = (id: string, patch: Partial<Line>) =>
    setLines((ls) => ls.map((l) => (l.id === id ? { ...l, ...patch } : l)));

  const subtotal = lines.reduce((s, l) => s + l.qty * l.price, 0);
  const taxable = Math.max(0, subtotal - discount);
  const gstTotal = gstBilling ? lines.reduce((s, l) => s + (l.qty * l.price * l.gst) / 100, 0) : 0;
  const couponDiscount = coupon
    ? coupon.type === "percent"
      ? Math.round((taxable * coupon.value) / 100)
      : Math.min(coupon.value, taxable)
    : 0;
  const grand = Math.round(Math.max(0, taxable - couponDiscount + gstTotal));

  const applyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) return;
    const found = coupons.find((c) => c.code === code);
    if (!found || !found.active) {
      setCoupon(null);
      setCouponError("Invalid or expired coupon");
      return;
    }
    if (taxable < found.minOrder) {
      setCoupon(null);
      setCouponError(`Minimum order ${currency(found.minOrder)} required`);
      return;
    }
    setCoupon(found);
    setCouponError(null);
    toast({
      title: "Coupon applied",
      tone: "success",
      message:
        found.type === "percent"
          ? `${found.value}% off on this invoice`
          : `${currency(found.value)} off on this invoice`,
    });
  };

  const removeCoupon = () => {
    setCoupon(null);
    setCouponCode("");
    setCouponError(null);
  };

  const nameError = touched && !customer ? "Select or add a customer" : undefined;
  const lineError = touched && lines.some((l) => !l.name) ? true : false;
  const canSubmit = !!customer && lines.length > 0 && lines.every((l) => l.name && l.qty > 0);

  const submit = () => {
    setTouched(true);
    if (!canSubmit) {
      toast({ title: "Please complete the invoice", tone: "danger", message: "Customer and all product rows are required." });
      return;
    }
    setConfirm(true);
  };

  return (
    <>
      <PageHeader
        title="Create Invoice"
        subtitle="GST invoice · BD/26-27/1421"
        actions={
          <>
            <Button variant="secondary" size="sm" className="hidden sm:inline-flex">
              <Save /> Save draft
            </Button>
            <Button variant="primary" size="sm" className="hidden sm:inline-flex" onClick={submit}>
              <Check /> Create Invoice
            </Button>
          </>
        }
      />

      <div className="grid gap-2.5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-2.5">
          <Card>
            <CardHead
              title="Customer"
              action={
                <Button size="xs" variant="soft">
                  <UserPlus /> New
                </Button>
              }
            />
            <div className="grid gap-2.5 p-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="sm:col-span-2 lg:col-span-2">
                <CustomerLookup onPick={setCustomer} />
                {nameError ? (
                  <p className="mt-1 text-[11px] font-medium text-danger">{nameError}</p>
                ) : null}
              </div>
              <FormField label="Customer name" required>
                <Input
                  value={customer?.name ?? ""}
                  onChange={(e) => setCustomer((c) => (c ? { ...c, name: e.target.value } : c))}
                  placeholder="Walk-in customer"
                  {...(nameError ? { invalid: true } : {})}
                />
              </FormField>
              <FormField label="Email">
                <Input value={customer?.email ?? ""} readOnly placeholder="optional@email.com" />
              </FormField>
            </div>
          </Card>

          <Card>
            <CardHead title="Invoice details" />
            <div className="grid gap-2.5 p-3 sm:grid-cols-2 lg:grid-cols-4">
              <FormField label="Invoice number">
                <Input defaultValue="BD/26-27/1421" className="num font-semibold" readOnly />
              </FormField>
              <FormField label="Invoice date" required>
                <Input type="date" defaultValue="2026-08-26" className="num" />
              </FormField>
              <FormField label="Payment method" required>
                <Select defaultValue="UPI">
                  {["Cash", "UPI", "Card", "Bank", "Credit"].map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </Select>
              </FormField>
              <div className="flex items-end pb-1">
                <Checkbox
                  label="GST Billing"
                  checked={gstBilling}
                  onChange={(e) => setGstBilling(e.target.checked)}
                />
              </div>
            </div>
          </Card>

          <Card>
            <CardHead title="Products" subtitle={`${lines.length} item(s)`} />

            {/* desktop grid */}
            <div className="hidden md:block">
              <div className="grid grid-cols-[minmax(0,1fr)_72px_100px_82px_110px_32px] gap-2 border-b border-border bg-surface-muted/70 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                <span>Product</span>
                <span className="text-right">Qty</span>
                <span className="text-right">Price</span>
                <span className="text-right">GST %</span>
                <span className="text-right">Amount</span>
                <span />
              </div>
              <div className="divide-y divide-border">
                {lines.map((l) => (
                  <div
                    key={l.id}
                    className="grid grid-cols-[minmax(0,1fr)_72px_100px_82px_110px_32px] items-center gap-2 px-3 py-1.5"
                  >
                    <ProductSelector
                      value={l.name}
                      onChange={(v) => update(l.id, { name: v })}
                      onPick={(p) => update(l.id, { name: p.name, price: p.price, gst: p.gst })}
                      {...(lineError && !l.name ? { invalid: true } : {})}
                    />
                    <Input
                      className="num h-9 text-right"
                      inputMode="numeric"
                      value={l.qty}
                      onChange={(e) => update(l.id, { qty: Number(e.target.value) || 0 })}
                    />
                    <Input
                      className="num h-9 text-right"
                      inputMode="decimal"
                      value={l.price}
                      onChange={(e) => update(l.id, { price: Number(e.target.value) || 0 })}
                    />
                    <Input
                      className="num h-9 text-right"
                      inputMode="numeric"
                      value={l.gst}
                      disabled={!gstBilling}
                      onChange={(e) => update(l.id, { gst: Number(e.target.value) || 0 })}
                    />
                    <span className="num text-right text-[13px] font-bold">
                      {currency(l.qty * l.price)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Remove item"
                      className="text-muted-foreground hover:text-danger"
                      onClick={() => setLines((ls) => ls.filter((x) => x.id !== l.id))}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* mobile stacked entry */}
            <div className="divide-y divide-border md:hidden">
              {lines.map((l, i) => (
                <div key={l.id} className="space-y-2 p-3">
                  <div className="flex items-center justify-between">
                    <span className="num text-[11px] font-bold text-muted-foreground">
                      ITEM {String(i + 1).padStart(2, "0")}
                    </span>
                    <button
                      className="text-[11px] font-semibold text-danger"
                      onClick={() => setLines((ls) => ls.filter((x) => x.id !== l.id))}
                    >
                      Remove
                    </button>
                  </div>
                  <ProductSelector
                    value={l.name}
                    onChange={(v) => update(l.id, { name: v })}
                    onPick={(p) => update(l.id, { name: p.name, price: p.price, gst: p.gst })}
                    {...(lineError && !l.name ? { invalid: true } : {})}
                  />
                  <div className="grid grid-cols-4 gap-2">
                    <FormField label="Qty">
                      <Input
                        className="num h-9 text-right"
                        inputMode="numeric"
                        value={l.qty}
                        onChange={(e) => update(l.id, { qty: Number(e.target.value) || 0 })}
                      />
                    </FormField>
                    <FormField label="Price">
                      <Input
                        className="num h-9 text-right"
                        inputMode="decimal"
                        value={l.price}
                        onChange={(e) => update(l.id, { price: Number(e.target.value) || 0 })}
                      />
                    </FormField>
                    <FormField label="GST">
                      <Input
                        className="num h-9 text-right"
                        inputMode="numeric"
                        value={l.gst}
                        disabled={!gstBilling}
                        onChange={(e) => update(l.id, { gst: Number(e.target.value) || 0 })}
                      />
                    </FormField>
                    <FormField label="Amount">
                      <div className="num flex h-9 items-center justify-end rounded-md bg-surface-muted px-2 text-[13px] font-bold">
                        {currency(l.qty * l.price)}
                      </div>
                    </FormField>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end border-t border-border px-3 py-2">
              <Button size="sm" variant="soft" onClick={() => setLines((ls) => [...ls, newLine()])}>
                <Plus /> Add Item
              </Button>
            </div>
          </Card>
        </div>

        {/* summary */}
        <div className="lg:sticky lg:top-16 lg:self-start">
          <Card>
            <CardHead title="Invoice summary" />
            <div className="space-y-2 p-3">
              <Row label="Subtotal" value={currency(subtotal)} />
              <div className="flex items-center justify-between gap-3">
                <span className="text-[12px] font-medium text-muted-foreground">Discount</span>
                <Input
                  className="num h-8 w-28 text-right"
                  inputMode="decimal"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value) || 0)}
                />
              </div>
              {/* coupon */}
              {coupon ? (
                <div className="flex items-center justify-between gap-2 rounded-md border border-success/30 bg-success/10 px-2.5 py-1.5">
                  <span className="flex items-center gap-1.5 text-[12px] font-bold text-success">
                    <TicketPercent className="size-3.5" />
                    {coupon.code}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="num text-[12px] font-bold text-success">
                      −{currency(couponDiscount)}
                    </span>
                    <button
                      onClick={removeCoupon}
                      aria-label="Remove coupon"
                      className="rounded p-0.5 text-muted-foreground hover:text-danger"
                    >
                      <X className="size-3.5" />
                    </button>
                  </span>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <TicketPercent className="pointer-events-none absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        value={couponCode}
                        onChange={(e) => {
                          setCouponCode(e.target.value.toUpperCase());
                          setCouponError(null);
                        }}
                        onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                        placeholder="Coupon code"
                        className="num h-8 pl-7 text-[12px] font-semibold uppercase"
                        {...(couponError ? { invalid: true } : {})}
                      />
                    </div>
                    <Button size="sm" variant="soft" onClick={applyCoupon}>
                      Apply
                    </Button>
                  </div>
                  {couponError ? (
                    <p className="mt-1 text-[11px] font-medium text-danger">{couponError}</p>
                  ) : (
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      Try WELCOME10, FEST50 or VIP15
                    </p>
                  )}
                </div>
              )}
              <Row
                label={gstBilling ? "GST" : "GST (disabled)"}
                value={currency(Math.round(gstTotal))}
                muted={!gstBilling}
              />
              <div className="mt-1 flex items-center justify-between rounded-md bg-primary px-3 py-2.5 text-primary-foreground shadow-md">
                <span className="text-[12px] font-semibold uppercase tracking-wide opacity-90">
                  Grand Total
                </span>
                <span className="num text-lg font-extrabold">{currency(grand)}</span>
              </div>
              <Button
                variant="primary"
                size="lg"
                className="mt-1 w-full"
                disabled={saving}
                onClick={submit}
              >
                {saving ? "Creating…" : "CREATE INVOICE"}
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button size="sm" variant="secondary">
                  Save draft
                </Button>
                <Button size="sm" variant="ghost">
                  Clear
                </Button>
              </div>
              <p className="pt-1 text-center text-[11px] text-muted-foreground">
                Prototype only — no data is saved.
              </p>
            </div>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={confirm}
        onClose={() => setConfirm(false)}
        title="Create this invoice?"
        message={`An invoice of ${currency(grand)} will be generated for ${customer?.name ?? "the customer"} and marked as paid.`}
        confirmLabel="Create Invoice"
        onConfirm={() => {
          setConfirm(false);
          setSaving(true);
          setTimeout(() => {
            setSaving(false);
            toast({ title: "Invoice created", tone: "success", message: "BD/26-27/1421 is ready to print." });
          }, 700);
        }}
      />
    </>
  );
}

function Row({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[12px] font-medium text-muted-foreground">{label}</span>
      <span className={cn("num text-[13px] font-bold", muted && "text-muted-foreground")}>
        {value}
      </span>
    </div>
  );
}
