import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { PageHeader, useTheme, type ThemeId } from "@/components/AppShell";
import { Badge, Button, Card, CardHead, StatusBadge } from "@/components/kit";
import { currency, themes } from "@/data/mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/themes")({
  head: () => ({
    meta: [
      { title: "Themes — Billing Desk" },
      {
        name: "description",
        content: "Ten professional colour themes driven by centralised design tokens across the whole app.",
      },
      { property: "og:title", content: "Themes — Billing Desk" },
      { property: "og:description", content: "Pick a brand colour and every screen updates instantly." },
    ],
  }),
  component: ThemesPage,
});

function ThemesPage() {
  const { theme, setTheme } = useTheme();

  return (
    <>
      <PageHeader
        title="Themes"
        subtitle="Colour tokens are centralised — one variable set drives buttons, charts, badges and tables"
      />

      <div className="grid gap-2.5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Card>
          <CardHead title="Available themes" subtitle="Selection is remembered on this device" />
          <div className="grid grid-cols-2 gap-2.5 p-3 sm:grid-cols-3 xl:grid-cols-5">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id as ThemeId)}
                className={cn(
                  "group overflow-hidden rounded-lg border text-left transition hover:shadow-md",
                  theme === t.id ? "border-primary ring-2 ring-ring/25" : "border-border",
                )}
              >
                <div className="relative h-16" style={{ background: t.swatch }}>
                  <div className="absolute inset-x-2 bottom-2 flex gap-1">
                    <span className="h-1.5 flex-1 rounded-full bg-white/70" />
                    <span className="h-1.5 w-4 rounded-full bg-white/40" />
                  </div>
                  {theme === t.id ? (
                    <span className="absolute right-1.5 top-1.5 grid size-5 place-items-center rounded-full bg-white/90 text-[var(--primary)]">
                      <Check className="size-3" />
                    </span>
                  ) : null}
                </div>
                <div className="px-2.5 py-2">
                  <p className="truncate text-[12px] font-semibold">{t.name}</p>
                  <p className="text-[10px] text-muted-foreground">Light · Professional</p>
                </div>
              </button>
            ))}
          </div>
        </Card>

        <Card className="h-fit">
          <CardHead title="Live preview" subtitle="Components using the active theme" />
          <div className="space-y-3 p-3">
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="primary">
                Create Invoice
              </Button>
              <Button size="sm" variant="secondary">
                Export
              </Button>
              <Button size="sm" variant="soft">
                Filters
              </Button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <StatusBadge status="Paid" />
              <StatusBadge status="Pending" />
              <StatusBadge status="Overdue" />
              <Badge tone="primary">GST 18%</Badge>
            </div>
            <div className="rounded-md border border-border">
              <div className="flex items-center justify-between border-b border-border bg-surface-muted px-3 py-1.5 text-[11px] font-bold uppercase text-muted-foreground">
                <span>Invoice</span>
                <span>Amount</span>
              </div>
              {[
                ["BD/26-27/1420", 18420],
                ["BD/26-27/1419", 6240],
              ].map(([n, a]) => (
                <div key={n as string} className="flex items-center justify-between px-3 py-2 text-[13px]">
                  <span className="num font-semibold">{n as string}</span>
                  <span className="num font-bold">{currency(a as number)}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between rounded-md bg-primary px-3 py-2.5 text-primary-foreground shadow-md">
              <span className="text-[12px] font-semibold uppercase tracking-wide opacity-90">Grand Total</span>
              <span className="num text-lg font-extrabold">{currency(24660)}</span>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
