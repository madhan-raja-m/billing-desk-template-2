import { ChevronsUpDown, ChevronUp, ChevronDown } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";
import { EmptyState, LoadingState, Pagination } from "./kit";

export type Column<T> = {
  key: string;
  header: string;
  sortable?: boolean;
  align?: "left" | "right" | "center";
  className?: string;
  cell: (row: T) => React.ReactNode;
  sortValue?: (row: T) => string | number;
};

export function SortableTableHeader({
  label,
  active,
  dir,
  onClick,
  align,
}: {
  label: string;
  active: boolean;
  dir: "asc" | "desc";
  onClick: () => void;
  align?: "left" | "right" | "center";
}) {
  const Icon = !active ? ChevronsUpDown : dir === "asc" ? ChevronUp : ChevronDown;
  return (
    <button
      onClick={onClick}
      className={cn(
        "group inline-flex items-center gap-1 text-inherit transition hover:text-foreground",
        align === "right" && "flex-row-reverse",
      )}
    >
      {label}
      <Icon
        className={cn("size-3 transition", active ? "text-primary" : "opacity-40 group-hover:opacity-70")}
      />
    </button>
  );
}

export function DataTable<T extends { id: string }>({
  columns,
  rows,
  loading,
  empty,
  pageSize = 8,
  rowHref,
  mobileRow,
  dense,
}: {
  columns: Column<T>[];
  rows: T[];
  loading?: boolean;
  empty?: React.ReactNode;
  pageSize?: number;
  rowHref?: (row: T) => void;
  mobileRow?: (row: T) => React.ReactNode;
  dense?: boolean;
}) {
  const [sort, setSort] = React.useState<{ key: string; dir: "asc" | "desc" } | null>(null);
  const [page, setPage] = React.useState(1);

  React.useEffect(() => setPage(1), [rows.length]);

  const sorted = React.useMemo(() => {
    if (!sort) return rows;
    const col = columns.find((c) => c.key === sort.key);
    if (!col?.sortValue) return rows;
    const f = col.sortValue;
    return [...rows].sort((a, b) => {
      const av = f(a);
      const bv = f(b);
      const r = typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv));
      return sort.dir === "asc" ? r : -r;
    });
  }, [rows, sort, columns]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const view = sorted.slice((page - 1) * pageSize, page * pageSize);

  const toggle = (key: string) =>
    setSort((s) => (s?.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }));

  if (loading) return <LoadingState rows={pageSize} />;
  if (rows.length === 0)
    return <>{empty ?? <EmptyState title="No records found" message="Try adjusting your search or filters." />}</>;

  return (
    <div>
      {/* Desktop table */}
      <div className={cn("scrollbar-thin overflow-x-auto", mobileRow && "hidden md:block")}>
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="border-b border-border bg-surface-muted/70">
              {columns.map((c) => (
                <th
                  key={c.key}
                  className={cn(
                    "whitespace-nowrap px-3 py-2 text-[11px] font-bold uppercase tracking-wide text-muted-foreground",
                    c.align === "right" ? "text-right" : c.align === "center" ? "text-center" : "text-left",
                    c.className,
                  )}
                >
                  {c.sortable ? (
                    <SortableTableHeader
                      label={c.header}
                      active={sort?.key === c.key}
                      dir={sort?.key === c.key ? sort.dir : "asc"}
                      onClick={() => toggle(c.key)}
                      {...(c.align ? { align: c.align } : {})}
                    />
                  ) : (
                    c.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {view.map((row) => (
              <tr
                key={row.id}
                onClick={rowHref ? () => rowHref(row) : undefined}
                className={cn(
                  "transition-colors hover:bg-primary-soft/40",
                  rowHref && "cursor-pointer",
                )}
              >
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className={cn(
                      dense ? "px-3 py-1.5" : "px-3 py-2.5",
                      "align-middle",
                      c.align === "right" ? "text-right" : c.align === "center" ? "text-center" : "text-left",
                      c.className,
                    )}
                  >
                    {c.cell(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      {mobileRow ? (
        <ul className="divide-y divide-border md:hidden">
          {view.map((row) => (
            <li
              key={row.id}
              onClick={rowHref ? () => rowHref(row) : undefined}
              className={cn("px-3 py-2.5 transition active:bg-secondary", rowHref && "cursor-pointer")}
            >
              {mobileRow(row)}
            </li>
          ))}
        </ul>
      ) : null}

      <Pagination
        page={page}
        pageCount={pageCount}
        total={sorted.length}
        pageSize={pageSize}
        onPage={setPage}
      />
    </div>
  );
}
