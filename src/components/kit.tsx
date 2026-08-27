import { cva, type VariantProps } from "class-variance-authority";
import { Check, ChevronDown, Search, X, Loader2, Inbox, AlertCircle } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------- Button */

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md font-semibold transition-[background,box-shadow,transform,color] duration-150 outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-1 focus-visible:ring-offset-surface disabled:pointer-events-none disabled:opacity-45 active:translate-y-px [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary-strong hover:shadow-md",
        secondary:
          "bg-surface text-foreground border border-border shadow-xs hover:bg-surface-muted hover:border-border-strong",
        ghost: "text-muted-foreground hover:bg-secondary hover:text-foreground",
        soft: "bg-primary-soft text-primary hover:bg-primary/12",
        danger: "bg-danger text-primary-foreground shadow-sm hover:brightness-95",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        xs: "h-7 px-2 text-[11px] [&_svg]:size-3.5",
        sm: "h-8 px-2.5 text-xs [&_svg]:size-3.5",
        md: "h-9 px-3.5 text-[13px] [&_svg]:size-4",
        lg: "h-10 px-5 text-sm [&_svg]:size-4",
        icon: "size-8 [&_svg]:size-4",
        "icon-sm": "size-7 [&_svg]:size-3.5",
      },
    },
    defaultVariants: { variant: "secondary", size: "md" },
  },
);

export function Button({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants>) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

/* ----------------------------------------------------------------- Card */

export function Card({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("surface-card", className)} {...props} />;
}

export function CardHead({
  title,
  subtitle,
  action,
  className,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border px-4 py-2.5",
        className,
      )}
    >
      <div className="min-w-0">
        <h3 className="truncate text-[13px] font-bold tracking-tight">{title}</h3>
        {subtitle ? (
          <p className="truncate text-[11px] text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

/* ---------------------------------------------------------------- Inputs */

export function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      className={cn(
        "mb-1 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

const fieldBase =
  "w-full rounded-md border border-input bg-surface px-2.5 text-[13px] text-foreground shadow-xs outline-none transition placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-ring/20 disabled:bg-surface-muted disabled:text-muted-foreground";

export function Input({
  className,
  invalid,
  ...props
}: React.ComponentProps<"input"> & { invalid?: boolean }) {
  return (
    <input
      className={cn(
        fieldBase,
        "h-9",
        invalid && "border-danger focus:border-danger focus:ring-danger/20",
        className,
      )}
      {...props}
    />
  );
}

export function Select({
  className,
  invalid,
  children,
  ...props
}: React.ComponentProps<"select"> & { invalid?: boolean }) {
  return (
    <div className="relative">
      <select
        className={cn(
          fieldBase,
          "h-9 appearance-none pr-7",
          invalid && "border-danger focus:border-danger",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}

export function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return <textarea className={cn(fieldBase, "min-h-20 py-2", className)} {...props} />;
}

export function FormField({
  label,
  error,
  hint,
  required,
  className,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      <Label>
        {label}
        {required ? <span className="ml-0.5 text-danger">*</span> : null}
      </Label>
      {children}
      {error ? (
        <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-danger">
          <AlertCircle className="size-3" /> {error}
        </p>
      ) : hint ? (
        <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

export function Checkbox({
  label,
  className,
  ...props
}: React.ComponentProps<"input"> & { label?: string }) {
  return (
    <label className={cn("inline-flex cursor-pointer items-center gap-2 select-none", className)}>
      <span className="relative inline-flex size-4 items-center justify-center">
        <input type="checkbox" className="peer size-4 appearance-none rounded border border-input bg-surface shadow-xs transition checked:border-primary checked:bg-primary focus-visible:ring-2 focus-visible:ring-ring/30 outline-none" {...props} />
        <Check className="pointer-events-none absolute size-3 text-primary-foreground opacity-0 peer-checked:opacity-100" />
      </span>
      {label ? <span className="text-[13px] font-medium">{label}</span> : null}
    </label>
  );
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search…",
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={cn("relative min-w-0", className)}>
      <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(fieldBase, "h-9 pl-8 pr-7")}
      />
      {value ? (
        <button
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:bg-secondary"
        >
          <X className="size-3" />
        </button>
      ) : null}
    </div>
  );
}

/* ---------------------------------------------------------------- Badges */

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold leading-4 ring-1 ring-inset",
  {
    variants: {
      tone: {
        neutral: "bg-secondary text-secondary-foreground ring-border",
        success: "bg-success-soft text-success ring-success/20",
        warning: "bg-warning-soft text-warning ring-warning/25",
        danger: "bg-danger-soft text-danger ring-danger/20",
        info: "bg-info-soft text-info ring-info/20",
        primary: "bg-primary-soft text-primary ring-primary/20",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

export type Tone = NonNullable<VariantProps<typeof badgeVariants>["tone"]>;

export function Badge({
  tone,
  className,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}

const statusTone: Record<string, Tone> = {
  Paid: "success",
  Active: "success",
  Converted: "success",
  Pending: "warning",
  Quoted: "warning",
  "Low stock": "warning",
  Overdue: "danger",
  Lost: "danger",
  Cancelled: "danger",
  Inactive: "neutral",
  New: "info",
  Contacted: "primary",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge tone={statusTone[status] ?? "neutral"}>
      <span className="size-1.5 rounded-full bg-current opacity-70" />
      {status}
    </Badge>
  );
}

/* -------------------------------------------------------------- Dropdown */

export function Dropdown({
  trigger,
  children,
  align = "right",
  className,
  width = "w-48",
}: {
  trigger: (p: { open: boolean }) => React.ReactNode;
  children: React.ReactNode | ((close: () => void) => React.ReactNode);
  align?: "left" | "right";
  className?: string;
  width?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <div onClick={() => setOpen((o) => !o)}>{trigger({ open })}</div>
      {open ? (
        <div
          className={cn(
            "absolute z-50 mt-1.5 overflow-hidden rounded-lg border border-border bg-popover p-1 shadow-pop",
            width,
            align === "right" ? "right-0" : "left-0",
          )}
        >
          {typeof children === "function" ? children(() => setOpen(false)) : children}
        </div>
      ) : null}
    </div>
  );
}

export function MenuItem({
  icon: Icon,
  children,
  tone,
  className,
  ...props
}: React.ComponentProps<"button"> & {
  icon?: React.ComponentType<{ className?: string }>;
  tone?: "danger";
}) {
  return (
    <button
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] font-medium text-popover-foreground transition hover:bg-secondary",
        tone === "danger" && "text-danger hover:bg-danger-soft",
        className,
      )}
      {...props}
    >
      {Icon ? <Icon className="size-3.5 opacity-80" /> : null}
      <span className="truncate">{children}</span>
    </button>
  );
}

export function MenuSep() {
  return <div className="my-1 h-px bg-border" />;
}

/* ----------------------------------------------------------------- Modal */

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}) {
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  const w = size === "sm" ? "max-w-sm" : size === "lg" ? "max-w-2xl" : "max-w-lg";
  return (
    <div className="fixed inset-0 z-100 flex items-end justify-center p-0 sm:items-center sm:p-4">
      <div
        className="absolute inset-0 bg-foreground/35 backdrop-blur-[2px] animate-in fade-in"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative w-full rounded-t-xl border border-border bg-surface shadow-pop animate-in slide-in-from-bottom-4 sm:rounded-xl sm:slide-in-from-bottom-0 sm:zoom-in-95",
          w,
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border px-4 py-3">
          <div className="min-w-0">
            <h2 className="truncate text-sm font-bold tracking-tight">{title}</h2>
            {description ? (
              <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
            ) : null}
          </div>
          <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Close">
            <X />
          </Button>
        </div>
        {children ? <div className="max-h-[70vh] overflow-y-auto px-4 py-3.5">{children}</div> : null}
        {footer ? (
          <div className="flex justify-end gap-2 border-t border-border bg-surface-muted px-4 py-2.5">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  destructive,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  destructive?: boolean;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button size="sm" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" variant={destructive ? "danger" : "primary"} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="text-[13px] leading-relaxed text-muted-foreground">{message}</p>
    </Modal>
  );
}

/* ----------------------------------------------------------------- Toast */

type ToastItem = { id: number; title: string; tone: Tone; message?: string };
const ToastCtx = React.createContext<(t: Omit<ToastItem, "id">) => void>(() => {});
export const useToast = () => React.useContext(ToastCtx);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<ToastItem[]>([]);
  const push = React.useCallback((t: Omit<ToastItem, "id">) => {
    const id = Date.now() + Math.random();
    setItems((s) => [...s, { ...t, id }]);
    setTimeout(() => setItems((s) => s.filter((i) => i.id !== id)), 3200);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-200 flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-2">
        {items.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto flex items-start gap-2.5 rounded-lg border border-border bg-surface p-3 shadow-pop animate-in slide-in-from-right-4"
          >
            <span
              className={cn(
                "mt-0.5 size-2 shrink-0 rounded-full",
                t.tone === "danger" && "bg-danger",
                t.tone === "success" && "bg-success",
                t.tone === "warning" && "bg-warning",
                (t.tone === "info" || t.tone === "primary" || t.tone === "neutral") && "bg-primary",
              )}
            />
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold">{t.title}</p>
              {t.message ? (
                <p className="mt-0.5 text-xs text-muted-foreground">{t.message}</p>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

/* ------------------------------------------------------------- Utilities */

export function EmptyState({
  title,
  message,
  action,
  icon: Icon = Inbox,
}: {
  title: string;
  message?: string;
  action?: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <div className="mb-3 grid size-10 place-items-center rounded-lg bg-surface-muted ring-1 ring-border">
        <Icon className="size-4.5 text-muted-foreground" />
      </div>
      <p className="text-[13px] font-semibold">{title}</p>
      {message ? <p className="mt-1 max-w-xs text-xs text-muted-foreground">{message}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function LoadingState({ rows = 5 }: { rows?: number }) {
  return (
    <div className="divide-y divide-border">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-3">
          <div className="h-3 w-1/4 animate-pulse rounded bg-surface-muted" />
          <div className="h-3 w-1/6 animate-pulse rounded bg-surface-muted" />
          <div className="h-3 flex-1 animate-pulse rounded bg-surface-muted" />
          <div className="h-3 w-16 animate-pulse rounded bg-surface-muted" />
        </div>
      ))}
    </div>
  );
}

export function Spinner({ className }: { className?: string }) {
  return <Loader2 className={cn("size-4 animate-spin", className)} />;
}

export function Pagination({
  page,
  pageCount,
  total,
  pageSize,
  onPage,
}: {
  page: number;
  pageCount: number;
  total: number;
  pageSize: number;
  onPage: (p: number) => void;
}) {
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === pageCount || Math.abs(p - page) <= 1,
  );
  return (
    <div className="grid grid-cols-1 items-center gap-2 border-t border-border px-3 py-2 sm:flex sm:justify-between">
      <p className="num text-[11px] text-muted-foreground">
        Showing <span className="font-semibold text-foreground">{from}</span>–
        <span className="font-semibold text-foreground">{to}</span> of{" "}
        <span className="font-semibold text-foreground">{total}</span>
      </p>
      <div className="flex items-center gap-1 justify-self-end">
        <Button size="sm" variant="secondary" disabled={page === 1} onClick={() => onPage(page - 1)}>
          Prev
        </Button>
        {pages.map((p, i) => (
          <React.Fragment key={p}>
            {i > 0 && p - (pages[i - 1] ?? 0) > 1 ? (
              <span className="px-1 text-xs text-muted-foreground">…</span>
            ) : null}
            <Button
              size="sm"
              variant={p === page ? "primary" : "ghost"}
              className="num min-w-8"
              onClick={() => onPage(p)}
            >
              {p}
            </Button>
          </React.Fragment>
        ))}
        <Button
          size="sm"
          variant="secondary"
          disabled={page === pageCount || pageCount === 0}
          onClick={() => onPage(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
