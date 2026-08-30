import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  Building2,
  DatabaseBackup,
  FileText,
  LayoutGrid,
  Palette,
  Printer,
  ShieldCheck,
  Users,
} from "lucide-react";
import * as React from "react";
import { PageHeader, useTheme, type ThemeId } from "@/components/AppShell";
import {
  Badge,
  Button,
  Card,
  CardHead,
  Checkbox,
  FormField,
  Input,
  Select,
  StatusBadge,
  Textarea,
  useToast,
} from "@/components/kit";
import { activityLog, business, themes } from "@/data/mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/setup")({
  head: () => ({
    meta: [
      { title: "Setup — Billing Desk" },
      {
        name: "description",
        content:
          "Configure business details, invoice numbering, print formats, themes, users, permissions and backups.",
      },
      { property: "og:title", content: "Setup — Billing Desk" },
      { property: "og:description", content: "All Billing Desk settings in one two-column workspace." },
    ],
  }),
  component: SetupPage,
});

const SECTIONS = [
  { id: "Business", icon: Building2 },
  { id: "Invoice", icon: FileText },
  { id: "Printing", icon: Printer },
  { id: "Themes", icon: Palette },
  { id: "Modules & Tabs", icon: LayoutGrid },
  { id: "Users", icon: Users },
  { id: "Permissions", icon: ShieldCheck },
  { id: "Activity Log", icon: Activity },
  { id: "Backup", icon: DatabaseBackup },
] as const;

function SetupPage() {
  const [active, setActive] = React.useState<string>("Business");
  const toast = useToast();
  const { theme, setTheme } = useTheme();

  return (
    <>
      <PageHeader
        title="Setup"
        subtitle="Configuration for Billing Desk Solutions Pvt Ltd"
        actions={
          <Button variant="primary" size="sm" onClick={() => toast({ title: "Settings saved", tone: "success" })}>
            Save changes
          </Button>
        }
      />

      <div className="grid gap-2.5 lg:grid-cols-[220px_minmax(0,1fr)]">
        <Card className="h-fit p-2 lg:sticky lg:top-16">
          <div className="flex flex-col gap-1">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-[13px] font-medium transition",
                  active === s.id
                    ? "bg-primary-soft font-semibold text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                <s.icon className="size-4 shrink-0" />
                <span className="truncate">{s.id}</span>
              </button>
            ))}
          </div>
        </Card>

        <div className="space-y-2.5">
          {active === "Business" && (
            <Card>
              <CardHead title="Business profile" subtitle="Printed on every invoice" />
              <div className="grid gap-3 p-3 sm:grid-cols-2">
                <FormField label="Business name" required>
                  <Input defaultValue={business.name} />
                </FormField>
                <FormField label="Legal name">
                  <Input defaultValue={business.legalName} />
                </FormField>
                <FormField label="GSTIN" required>
                  <Input defaultValue={business.gstin} className="num uppercase" />
                </FormField>
                <FormField label="Phone">
                  <Input defaultValue={business.phone} className="num" />
                </FormField>
                <FormField label="Email">
                  <Input defaultValue={business.email} />
                </FormField>
                <FormField label="State code">
                  <Input defaultValue="33 — Tamil Nadu" />
                </FormField>
                <FormField label="Registered address" className="sm:col-span-2">
                  <Textarea defaultValue={business.address} />
                </FormField>
              </div>
            </Card>
          )}

          {active === "Invoice" && (
            <Card>
              <CardHead title="Invoice settings" subtitle="Numbering, tax defaults and terms" />
              <div className="grid gap-3 p-3 sm:grid-cols-2">
                <FormField label="Number prefix">
                  <Input defaultValue="BD/26-27/" className="num" />
                </FormField>
                <FormField label="Next number">
                  <Input defaultValue="1421" className="num" />
                </FormField>
                <FormField label="Default GST rate">
                  <Select defaultValue="18">
                    {[0, 5, 12, 18, 28].map((g) => (
                      <option key={g} value={g}>
                        {g}%
                      </option>
                    ))}
                  </Select>
                </FormField>
                <FormField label="Default payment method">
                  <Select defaultValue="UPI">
                    {["Cash", "UPI", "Card", "Bank", "Credit"].map((p) => (
                      <option key={p}>{p}</option>
                    ))}
                  </Select>
                </FormField>
                <FormField label="Invoice terms" className="sm:col-span-2">
                  <Textarea defaultValue="Goods once sold will not be taken back. Interest @18% p.a. is charged on overdue amounts. Subject to Chennai jurisdiction." />
                </FormField>
                <div className="space-y-2 sm:col-span-2">
                  <Checkbox label="Round off grand total" defaultChecked />
                  <Checkbox label="Show HSN/SAC column on invoice" defaultChecked />
                  <Checkbox label="Allow negative stock billing" />
                </div>
              </div>
            </Card>
          )}

          {active === "Printing" && (
            <Card>
              <CardHead
                title="Print formats"
                subtitle="Choose the default template per counter"
                action={
                  <Link to="/print">
                    <Button size="xs" variant="soft">
                      Preview formats
                    </Button>
                  </Link>
                }
              />
              <div className="grid gap-2.5 p-3 sm:grid-cols-2">
                {[
                  ["A4 Formal Invoice", "Full GST invoice with terms and signature block"],
                  ["A5 Invoice", "Compact half-page invoice for counter sales"],
                  ["80mm Thermal", "Standard receipt printer roll"],
                  ["58mm Thermal", "Handheld / portable printer roll"],
                ].map(([t, d], i) => (
                  <label
                    key={t}
                    className={cn(
                      "flex cursor-pointer items-start gap-2.5 rounded-lg border p-3 transition",
                      i === 0 ? "border-primary bg-primary-soft/50" : "border-border hover:border-border-strong",
                    )}
                  >
                    <input type="radio" name="fmt" defaultChecked={i === 0} className="mt-0.5 accent-[var(--primary)]" />
                    <span className="min-w-0">
                      <span className="block text-[13px] font-semibold">{t}</span>
                      <span className="block text-[11px] text-muted-foreground">{d}</span>
                    </span>
                  </label>
                ))}
              </div>
            </Card>
          )}

          {active === "Themes" && (
            <Card>
              <CardHead title="Application theme" subtitle="Applies across every screen instantly" />
              <div className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-4">
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id as ThemeId)}
                    className={cn(
                      "flex items-center gap-2 rounded-lg border p-2.5 text-left transition",
                      theme === t.id ? "border-primary ring-2 ring-ring/25" : "border-border hover:border-border-strong",
                    )}
                  >
                    <span className="size-6 shrink-0 rounded-md shadow-sm" style={{ background: t.swatch }} />
                    <span className="truncate text-[12px] font-semibold">{t.name}</span>
                  </button>
                ))}
              </div>
            </Card>
          )}

          {active === "Modules & Tabs" && (
            <Card>
              <CardHead title="Modules & tabs" subtitle="Show or hide navigation for this account" />
              <ul className="divide-y divide-border">
                {["Home", "Create Invoice", "Customers", "Products", "Enquiries", "Invoice History", "Reports"].map(
                  (m, i) => (
                    <li key={m} className="flex items-center justify-between px-3 py-2.5">
                      <span className="text-[13px] font-medium">{m}</span>
                      <Checkbox defaultChecked={i !== 4} />
                    </li>
                  ),
                )}
              </ul>
            </Card>
          )}

          {active === "Users" && (
            <Card className="overflow-hidden">
              <CardHead title="Users" subtitle="4 seats in use" action={<Button size="xs" variant="soft">Invite user</Button>} />
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-border bg-surface-muted/70 text-[11px] uppercase tracking-wide text-muted-foreground">
                    <th className="px-3 py-2 text-left font-bold">User</th>
                    <th className="px-3 py-2 text-left font-bold">Role</th>
                    <th className="px-3 py-2 text-center font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    ["Madhan R", "Administrator", "Active"],
                    ["Priya S", "Billing Operator", "Active"],
                    ["Vignesh K", "Billing Operator", "Active"],
                    ["Divya M", "Accountant", "Inactive"],
                  ].map(([n, r, s]) => (
                    <tr key={n}>
                      <td className="px-3 py-2 font-semibold">{n}</td>
                      <td className="px-3 py-2 text-muted-foreground">{r}</td>
                      <td className="px-3 py-2 text-center">
                        <StatusBadge status={s as string} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}

          {active === "Permissions" && (
            <Card>
              <CardHead title="Role permissions" subtitle="Billing Operator" />
              <ul className="divide-y divide-border">
                {[
                  ["Create invoices", true],
                  ["Cancel invoices", false],
                  ["Edit products & pricing", false],
                  ["View reports", true],
                  ["Export data", false],
                  ["Manage users", false],
                ].map(([label, on]) => (
                  <li key={label as string} className="flex items-center justify-between px-3 py-2.5">
                    <span className="text-[13px] font-medium">{label as string}</span>
                    <Checkbox defaultChecked={on as boolean} />
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {active === "Activity Log" && (
            <Card>
              <CardHead title="Activity log" subtitle="Last 5 actions" />
              <ul className="divide-y divide-border">
                {activityLog.map((a, i) => (
                  <li key={i} className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 px-3 py-2.5">
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-medium">{a.action}</p>
                      <p className="text-[11px] text-muted-foreground">{a.user}</p>
                    </div>
                    <span className="num shrink-0 text-[11px] text-muted-foreground">{a.time}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {active === "Backup" && (
            <Card>
              <CardHead title="Backup & restore" subtitle="Nightly automatic backup enabled" />
              <div className="space-y-3 p-3">
                <div className="flex items-center justify-between rounded-md bg-surface-muted px-3 py-2.5">
                  <div>
                    <p className="text-[13px] font-semibold">Last backup</p>
                    <p className="num text-[11px] text-muted-foreground">26 Aug 2026, 02:00 AM · 48.2 MB</p>
                  </div>
                  <Badge tone="success">Healthy</Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="primary" onClick={() => toast({ title: "Backup started", tone: "info" })}>
                    Backup now
                  </Button>
                  <Button size="sm" variant="secondary">
                    Download latest
                  </Button>
                  <Button size="sm" variant="ghost">
                    Restore from file
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
