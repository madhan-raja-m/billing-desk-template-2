import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
import { Badge, Button, Card, CardHead, FormField, Input, Select, useToast } from "@/components/kit";
import { activityLog } from "@/data/mock";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — Billing Desk" },
      {
        name: "description",
        content: "Your Billing Desk operator profile: contact details, role, counter defaults and recent activity.",
      },
      { property: "og:title", content: "Profile — Billing Desk" },
      { property: "og:description", content: "Manage your operator account and billing preferences." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const toast = useToast();
  return (
    <>
      <PageHeader
        title="Profile"
        subtitle="Madhan R · Administrator"
        actions={
          <Button size="sm" variant="primary" onClick={() => toast({ title: "Profile updated", tone: "success" })}>
            Save changes
          </Button>
        }
      />

      <div className="grid gap-2.5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Card>
          <CardHead title="Account details" />
          <div className="grid gap-3 p-3 sm:grid-cols-2">
            <FormField label="Full name" required>
              <Input defaultValue="Madhan R" />
            </FormField>
            <FormField label="Email" required>
              <Input defaultValue="madhan@billingdesk.in" />
            </FormField>
            <FormField label="Mobile">
              <Input defaultValue="98404 21188" className="num" />
            </FormField>
            <FormField label="Role">
              <Select defaultValue="Administrator" disabled>
                <option>Administrator</option>
              </Select>
            </FormField>
            <FormField label="Default counter">
              <Select defaultValue="Counter 1">
                {["Counter 1", "Counter 2", "Warehouse"].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </Select>
            </FormField>
            <FormField label="Default print format">
              <Select defaultValue="80mm Thermal">
                {["A4 Formal Invoice", "A5 Invoice", "80mm Thermal", "58mm Thermal"].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </Select>
            </FormField>
          </div>
        </Card>

        <div className="space-y-2.5">
          <Card className="p-4 text-center">
            <span className="mx-auto grid size-14 place-items-center rounded-xl bg-primary-soft text-lg font-extrabold text-primary ring-1 ring-inset ring-primary/15">
              MR
            </span>
            <p className="mt-2 text-[15px] font-bold">Madhan R</p>
            <p className="text-[12px] text-muted-foreground">madhan@billingdesk.in</p>
            <div className="mt-2 flex justify-center gap-1.5">
              <Badge tone="primary">Administrator</Badge>
              <Badge tone="success">Active</Badge>
            </div>
          </Card>
          <Card>
            <CardHead title="Recent activity" />
            <ul className="divide-y divide-border">
              {activityLog.slice(0, 4).map((a, i) => (
                <li key={i} className="px-3 py-2.5">
                  <p className="truncate text-[12px] font-medium">{a.action}</p>
                  <p className="text-[11px] text-muted-foreground">{a.time}</p>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}
