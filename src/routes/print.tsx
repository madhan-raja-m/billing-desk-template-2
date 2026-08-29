import { createFileRoute } from "@tanstack/react-router";
import { Printer } from "lucide-react";
import * as React from "react";
import { PageHeader } from "@/components/AppShell";
import { Button, Card, CardHead } from "@/components/kit";
import { business, currency } from "@/data/mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/print")({
  head: () => ({
    meta: [
      { title: "Print Preview — Billing Desk" },
      {
        name: "description",
        content: "Visual mockups of A4 formal invoices, A5 invoices and 80mm / 58mm thermal receipts.",
      },
      { property: "og:title", content: "Print Preview — Billing Desk" },
      { property: "og:description", content: "See exactly how each Billing Desk print format looks." },
    ],
  }),
  component: PrintPage,
});

const items = [
  ["Copper Wire 2.5sqmm — 90m", 2, 2450, 18],
  ["LED Panel Light 18W", 6, 640, 12],
  ["Modular Switch 6A", 12, 96, 18],
] as const;

const sub = items.reduce((s, [, q, p]) => s + q * p, 0);
const gst = items.reduce((s, [, q, p, g]) => s + (q * p * g) / 100, 0);
const grand = Math.round(sub + gst);

const FORMATS = ["A4 Formal Invoice", "A5 Invoice", "80mm Thermal Receipt", "58mm Thermal Receipt"] as const;

function PrintPage() {
  const [fmt, setFmt] = React.useState<(typeof FORMATS)[number]>("A4 Formal Invoice");

  return (
    <>
      <PageHeader
        title="Print Preview"
        subtitle="Static mockups — no printing is performed in this prototype"
        actions={
          <Button variant="primary" size="sm">
            <Printer /> Print
          </Button>
        }
      />

      <Card className="mb-2.5 p-2">
        <div className="scrollbar-thin flex gap-1 overflow-x-auto">
          {FORMATS.map((f) => (
            <button
              key={f}
              onClick={() => setFmt(f)}
              className={cn(
                "shrink-0 rounded-md px-3 py-1.5 text-[12px] font-semibold transition",
                fmt === f ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-secondary",
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </Card>

      <Card className="overflow-hidden">
        <CardHead title={fmt} subtitle="Sample invoice BD/26-27/1420 · Aarav Traders" />
        <div className="flex justify-center bg-surface-muted p-4 sm:p-8">
          {fmt === "A4 Formal Invoice" ? <SheetInvoice size="a4" /> : null}
          {fmt === "A5 Invoice" ? <SheetInvoice size="a5" /> : null}
          {fmt === "80mm Thermal Receipt" ? <Thermal width={300} /> : null}
          {fmt === "58mm Thermal Receipt" ? <Thermal width={220} /> : null}
        </div>
      </Card>
    </>
  );
}

function SheetInvoice({ size }: { size: "a4" | "a5" }) {
  const a4 = size === "a4";
  return (
    <div
      className={cn(
        "w-full bg-white text-[#1a1a1a] shadow-lg ring-1 ring-black/10",
        a4 ? "max-w-[620px] p-7" : "max-w-[460px] p-5",
      )}
      style={{ fontFamily: "var(--font-sans)" }}
    >
      <div className="flex items-start justify-between gap-4 border-b-2 border-[#1a1a1a] pb-3">
        <div>
          <p className={cn("font-extrabold tracking-tight", a4 ? "text-lg" : "text-base")}>
            {business.legalName}
          </p>
          <p className="mt-0.5 max-w-72 text-[10px] leading-snug text-[#555]">{business.address}</p>
          <p className="num text-[10px] text-[#555]">
            GSTIN {business.gstin} · {business.phone}
          </p>
        </div>
        <div className="text-right">
          <p className={cn("font-bold uppercase tracking-widest", a4 ? "text-sm" : "text-xs")}>Tax Invoice</p>
          <p className="num text-[11px] font-semibold">BD/26-27/1420</p>
          <p className="num text-[10px] text-[#555]">26 Aug 2026</p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-4 text-[10.5px]">
        <div>
          <p className="mb-0.5 font-bold uppercase tracking-wide text-[#777]">Bill To</p>
          <p className="text-[12px] font-semibold">Aarav Traders</p>
          <p className="text-[#555]">No. 18, Anna Salai, Chennai 600002</p>
          <p className="num text-[#555]">GSTIN 33AABCU9600R1Z0 · 98404 21188</p>
        </div>
        <div className="text-right">
          <p className="mb-0.5 font-bold uppercase tracking-wide text-[#777]">Payment</p>
          <p className="font-semibold">UPI · Paid</p>
          <p className="text-[#555]">Place of supply: Tamil Nadu (33)</p>
        </div>
      </div>

      <table className="mt-3 w-full border-collapse text-[10.5px]">
        <thead>
          <tr className="bg-[#f2f2f2] text-left">
            <th className="border border-[#ddd] px-2 py-1 font-bold">#</th>
            <th className="border border-[#ddd] px-2 py-1 font-bold">Description</th>
            <th className="border border-[#ddd] px-2 py-1 text-right font-bold">Qty</th>
            <th className="border border-[#ddd] px-2 py-1 text-right font-bold">Rate</th>
            <th className="border border-[#ddd] px-2 py-1 text-right font-bold">GST</th>
            <th className="border border-[#ddd] px-2 py-1 text-right font-bold">Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.map(([n, q, p, g], i) => (
            <tr key={n}>
              <td className="num border border-[#ddd] px-2 py-1">{i + 1}</td>
              <td className="border border-[#ddd] px-2 py-1">{n}</td>
              <td className="num border border-[#ddd] px-2 py-1 text-right">{q}</td>
              <td className="num border border-[#ddd] px-2 py-1 text-right">{p.toLocaleString("en-IN")}</td>
              <td className="num border border-[#ddd] px-2 py-1 text-right">{g}%</td>
              <td className="num border border-[#ddd] px-2 py-1 text-right">
                {(q * p).toLocaleString("en-IN")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-2 flex justify-end">
        <table className="w-56 text-[10.5px]">
          <tbody>
            <tr>
              <td className="py-0.5 text-[#555]">Subtotal</td>
              <td className="num py-0.5 text-right font-semibold">{currency(sub)}</td>
            </tr>
            <tr>
              <td className="py-0.5 text-[#555]">CGST + SGST</td>
              <td className="num py-0.5 text-right font-semibold">{currency(Math.round(gst))}</td>
            </tr>
            <tr className="border-t border-[#1a1a1a]">
              <td className="py-1 font-bold uppercase">Grand Total</td>
              <td className="num py-1 text-right text-[13px] font-extrabold">{currency(grand)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-end justify-between gap-6 border-t border-[#ddd] pt-3 text-[9.5px] text-[#666]">
        <p className="max-w-64 leading-snug">
          Goods once sold will not be taken back. Interest @18% p.a. on overdue amounts. Subject to Chennai
          jurisdiction.
        </p>
        <div className="text-center">
          <div className="h-8" />
          <p className="border-t border-[#999] pt-1 font-semibold text-[#333]">Authorised Signatory</p>
        </div>
      </div>
    </div>
  );
}

function Thermal({ width }: { width: number }) {
  return (
    <div
      className="bg-white px-3 py-4 font-mono text-[#111] shadow-lg ring-1 ring-black/10"
      style={{ width, fontFamily: "var(--font-mono)" }}
    >
      <div className="text-center">
        <p className="text-[12px] font-bold uppercase">Billing Desk</p>
        <p className="text-[8.5px] leading-tight">Mount Road, Guindy, Chennai 600032</p>
        <p className="text-[8.5px]">GSTIN {business.gstin}</p>
      </div>
      <p className="my-2 text-[9px]">{"-".repeat(width > 260 ? 42 : 30)}</p>
      <div className="flex justify-between text-[9px]">
        <span>BD/26-27/1420</span>
        <span>26/08/26</span>
      </div>
      <p className="my-2 text-[9px]">{"-".repeat(width > 260 ? 42 : 30)}</p>
      {items.map(([n, q, p]) => (
        <div key={n} className="mb-1 text-[9px]">
          <p className="truncate">{n}</p>
          <div className="flex justify-between">
            <span>
              {q} x {p}
            </span>
            <span>{(q * p).toLocaleString("en-IN")}</span>
          </div>
        </div>
      ))}
      <p className="my-2 text-[9px]">{"-".repeat(width > 260 ? 42 : 30)}</p>
      <div className="space-y-0.5 text-[9px]">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{sub.toLocaleString("en-IN")}</span>
        </div>
        <div className="flex justify-between">
          <span>GST</span>
          <span>{Math.round(gst).toLocaleString("en-IN")}</span>
        </div>
        <div className="flex justify-between text-[11px] font-bold">
          <span>TOTAL</span>
          <span>{grand.toLocaleString("en-IN")}</span>
        </div>
        <div className="flex justify-between">
          <span>Paid via</span>
          <span>UPI</span>
        </div>
      </div>
      <p className="my-2 text-[9px]">{"-".repeat(width > 260 ? 42 : 30)}</p>
      <p className="text-center text-[9px]">Thank you, visit again!</p>
    </div>
  );
}
