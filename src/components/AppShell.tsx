import { Link, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  Boxes,
  ChevronDown,
  FileText,
  Home,
  LogOut,
  Menu,
  MessageSquareText,
  Palette,
  Plus,
  Printer,
  Receipt,
  Settings,
  Sliders,
  User,
  Users,
  X,
} from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Button, Dropdown, MenuItem, MenuSep, ToastProvider } from "./kit";

/* ------------------------------------------------------------ theme ctx */

const THEMES = [
  "royal",
  "navy",
  "emerald",
  "burgundy",
  "purple",
  "teal",
  "indigo",
  "slate",
  "orange",
  "charcoal",
] as const;
export type ThemeId = (typeof THEMES)[number];

const ThemeCtx = React.createContext<{ theme: ThemeId; setTheme: (t: ThemeId) => void }>({
  theme: "royal",
  setTheme: () => {},
});
export const useTheme = () => React.useContext(ThemeCtx);

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<ThemeId>("royal");

  React.useEffect(() => {
    const saved = window.localStorage.getItem("bd-theme") as ThemeId | null;
    if (saved && (THEMES as readonly string[]).includes(saved)) setThemeState(saved);
  }, []);

  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const setTheme = React.useCallback((t: ThemeId) => {
    setThemeState(t);
    window.localStorage.setItem("bd-theme", t);
  }, []);

  return <ThemeCtx.Provider value={{ theme, setTheme }}>{children}</ThemeCtx.Provider>;
}

/* -------------------------------------------------------------- nav data */

const NAV = [
  { to: "/", label: "Home", icon: Home },
  { to: "/invoices/new", label: "Create Invoice", icon: Plus },
  { to: "/customers", label: "Customers", icon: Users },
  { to: "/products", label: "Products", icon: Boxes },
  { to: "/enquiries", label: "Enquiries", icon: MessageSquareText },
  { to: "/invoices", label: "Invoice History", icon: Receipt },
  { to: "/reports", label: "Reports", icon: BarChart3 },
] as const;

const MORE = [
  { to: "/setup", label: "Setup", icon: Settings },
  { to: "/themes", label: "Themes", icon: Palette },
  { to: "/print", label: "Print Preview", icon: Printer },
] as const;

/* ---------------------------------------------------------------- header */

function Brand() {
  return (
    <Link to="/" className="flex shrink-0 items-center gap-2">
      <span className="grid size-7 place-items-center rounded-md bg-primary text-primary-foreground shadow-sm ring-1 ring-inset ring-white/15">
        <FileText className="size-4" />
      </span>
      <span className="text-[15px] font-extrabold leading-none tracking-tight">
        Billing<span className="text-primary">Desk</span>
      </span>
    </Link>
  );
}

function ProfileMenu() {
  return (
    <Dropdown
      width="w-52"
      trigger={({ open }) => (
        <button
          className={cn(
            "flex items-center gap-2 rounded-md border border-transparent py-1 pl-1 pr-1.5 transition hover:bg-secondary",
            open && "border-border bg-secondary",
          )}
        >
          <span className="grid size-7 shrink-0 place-items-center rounded-md bg-primary-soft text-[11px] font-bold text-primary ring-1 ring-inset ring-primary/15">
            MR
          </span>
          <span className="hidden text-left leading-tight lg:block">
            <span className="block text-[12px] font-semibold">Madhan R</span>
            <span className="block text-[10px] text-muted-foreground">Administrator</span>
          </span>
          <ChevronDown className="size-3.5 text-muted-foreground" />
        </button>
      )}
    >
      <div className="border-b border-border px-2 pb-2 pt-1">
        <p className="text-[13px] font-semibold">Madhan R</p>
        <p className="truncate text-[11px] text-muted-foreground">madhan@billingdesk.in</p>
      </div>
      <div className="pt-1">
        <Link to="/profile">
          <MenuItem icon={User}>Profile</MenuItem>
        </Link>
        <Link to="/setup">
          <MenuItem icon={Sliders}>Setup</MenuItem>
        </Link>
        <MenuSep />
        <MenuItem icon={LogOut} tone="danger">
          Logout
        </MenuItem>
      </div>
    </Dropdown>
  );
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      {NAV.map((n) => (
        <Link
          key={n.to}
          to={n.to}
          onClick={onNavigate}
          activeOptions={{ exact: n.to === "/" }}
          className="group relative rounded-md px-2.5 py-1.5 text-[13px] font-semibold text-muted-foreground transition hover:bg-secondary hover:text-foreground data-[status=active]:bg-primary-soft data-[status=active]:text-primary"
        >
          {n.label}
        </Link>
      ))}
    </>
  );
}

function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-100 lg:hidden">
      <div className="absolute inset-0 bg-foreground/40" onClick={onClose} />
      <nav className="absolute inset-y-0 left-0 flex w-72 max-w-[82%] flex-col border-r border-border bg-surface shadow-pop animate-in slide-in-from-left">
        <div className="flex items-center justify-between border-b border-border px-3 py-2.5">
          <Brand />
          <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Close menu">
            <X />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {[...NAV, ...MORE].map((n) => (
            <Link
              key={n.to}
              to={n.to}
              onClick={onClose}
              activeOptions={{ exact: n.to === "/" }}
              className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] font-semibold text-muted-foreground transition data-[status=active]:bg-primary-soft data-[status=active]:text-primary"
            >
              <n.icon className="size-4" />
              {n.label}
            </Link>
          ))}
        </div>
        <div className="border-t border-border p-2">
          <Link to="/invoices/new" onClick={onClose}>
            <Button variant="primary" size="md" className="w-full">
              <Plus /> Create Invoice
            </Button>
          </Link>
        </div>
      </nav>
    </div>
  );
}

function MobileTabBar() {
  const tabs = [
    { to: "/", label: "Home", icon: Home },
    { to: "/customers", label: "Customers", icon: Users },
    { to: "/invoices/new", label: "Bill", icon: Plus },
    { to: "/products", label: "Products", icon: Boxes },
    { to: "/invoices", label: "History", icon: Receipt },
  ] as const;
  return (
    <nav className="no-print fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-border bg-surface/95 backdrop-blur pb-[env(safe-area-inset-bottom)] shadow-[0_-2px_10px_oklch(0.2_0.03_260/0.06)] md:hidden">
      {tabs.map((t) =>
        t.label === "Bill" ? (
          <Link key={t.to} to={t.to} className="flex flex-col items-center justify-center py-1.5">
            <span className="grid size-9 -translate-y-2 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg ring-4 ring-surface">
              <t.icon className="size-4.5" />
            </span>
            <span className="-mt-1.5 text-[10px] font-semibold text-primary">{t.label}</span>
          </Link>
        ) : (
          <Link
            key={t.to}
            to={t.to}
            activeOptions={{ exact: t.to === "/" }}
            className="flex flex-col items-center gap-0.5 py-2 text-[10px] font-semibold text-muted-foreground data-[status=active]:text-primary"
          >
            <t.icon className="size-4.5" />
            {t.label}
          </Link>
        ),
      )}
    </nav>
  );
}

function Header() {
  const [drawer, setDrawer] = React.useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const moreActive = MORE.some((m) => path.startsWith(m.to));

  return (
    <>
      <header className="no-print sticky top-0 z-50 border-b border-border topbar-grad backdrop-blur supports-[backdrop-filter]:bg-surface/85">
        <div className="mx-auto grid max-w-[1400px] grid-cols-[auto_1fr_auto] items-center gap-2 px-3 py-2 sm:px-4">
          <div className="flex min-w-0 items-center gap-2">
            <Button
              variant="ghost"
              size="icon-sm"
              className="lg:hidden"
              onClick={() => setDrawer(true)}
              aria-label="Open menu"
            >
              <Menu />
            </Button>
            <Brand />
          </div>

          <nav className="hidden items-center gap-0.5 justify-self-center lg:flex">
            <NavLinks />
            <Dropdown
              width="w-44"
              trigger={({ open }) => (
                <button
                  className={cn(
                    "flex items-center gap-1 rounded-md px-2.5 py-1.5 text-[13px] font-semibold text-muted-foreground transition hover:bg-secondary hover:text-foreground",
                    (open || moreActive) && "bg-primary-soft text-primary",
                  )}
                >
                  More <ChevronDown className="size-3.5" />
                </button>
              )}
            >
              {MORE.map((m) => (
                <Link key={m.to} to={m.to}>
                  <MenuItem icon={m.icon}>{m.label}</MenuItem>
                </Link>
              ))}
            </Dropdown>
          </nav>

          <div className="flex items-center gap-2 justify-self-end">
            <Link to="/invoices/new" className="hidden sm:block">
              <Button variant="primary" size="sm">
                <Plus /> Create Invoice
              </Button>
            </Link>
            <ProfileMenu />
          </div>
        </div>
      </header>
      <MobileDrawer open={drawer} onClose={() => setDrawer(false)} />
    </>
  );
}

/* ------------------------------------------------------------ page parts */

export function PageHeader({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-3 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
      <div className="min-w-0">
        <h1 className="truncate text-lg font-extrabold tracking-tight sm:text-xl">{title}</h1>
        {subtitle ? (
          <p className="mt-0.5 truncate text-xs text-muted-foreground">{subtitle}</p>
        ) : null}
        {children}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <div className="min-h-screen">
          <Header />
          <main className="mx-auto max-w-[1400px] px-3 pb-24 pt-3 sm:px-4 sm:pb-8">{children}</main>
          <MobileTabBar />
        </div>
      </ToastProvider>
    </ThemeProvider>
  );
}
