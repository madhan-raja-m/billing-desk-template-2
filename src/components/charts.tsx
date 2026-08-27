import { currency } from "@/data/mock";
import { cn } from "@/lib/utils";

/* Lightweight SVG charts — no runtime data fetching, purely presentational. */

export function SalesTrendChart({ data }: { data: { day: string; sales: number }[] }) {
  const w = 640;
  const h = 190;
  const pad = { l: 8, r: 8, t: 14, b: 20 };
  const max = Math.max(...data.map((d) => d.sales)) * 1.12;
  const step = (w - pad.l - pad.r) / Math.max(1, data.length - 1);
  const pts = data.map((d, i) => ({
    x: pad.l + i * step,
    y: pad.t + (1 - d.sales / max) * (h - pad.t - pad.b),
    d,
  }));
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const area = `${line} L${pts[pts.length - 1]?.x ?? 0},${h - pad.b} L${pts[0]?.x ?? 0},${h - pad.b} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-48 w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="bd-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.22" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75, 1].map((g) => (
        <line
          key={g}
          x1={pad.l}
          x2={w - pad.r}
          y1={pad.t + g * (h - pad.t - pad.b)}
          y2={pad.t + g * (h - pad.t - pad.b)}
          stroke="var(--border)"
          strokeDasharray="3 4"
        />
      ))}
      <path d={area} fill="url(#bd-area)" />
      <path d={line} fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinejoin="round" />
      {pts.map((p) => (
        <g key={p.d.day}>
          <circle cx={p.x} cy={p.y} r="2.6" fill="var(--surface)" stroke="var(--primary)" strokeWidth="1.8" />
          <text x={p.x} y={h - 6} textAnchor="middle" className="fill-muted-foreground" fontSize="9">
            {p.d.day}
          </text>
        </g>
      ))}
    </svg>
  );
}

export function RankBars({
  data,
  format = currency,
}: {
  data: { name: string; value: number }[];
  format?: (n: number) => string;
}) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <ul className="space-y-2.5 p-4">
      {data.map((d, i) => (
        <li key={d.name}>
          <div className="mb-1 flex items-baseline justify-between gap-3">
            <span className="truncate text-[12px] font-medium">
              <span className="num mr-1.5 text-[10px] font-bold text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              {d.name}
            </span>
            <span className="num shrink-0 text-[12px] font-bold">{format(d.value)}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-surface-muted">
            <div
              className="h-full rounded-full bg-primary/85"
              style={{ width: `${(d.value / max) * 100}%`, opacity: 1 - i * 0.12 }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function DonutChart({ data }: { data: { name: string; value: number }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const r = 52;
  const c = 2 * Math.PI * r;
  let offset = 0;
  const opacities = [1, 0.78, 0.58, 0.4, 0.26];

  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4 p-4">
      <svg viewBox="0 0 140 140" className="size-32 -rotate-90">
        <circle cx="70" cy="70" r={r} fill="none" stroke="var(--surface-muted)" strokeWidth="16" />
        {data.map((d, i) => {
          const len = (d.value / total) * c;
          const el = (
            <circle
              key={d.name}
              cx="70"
              cy="70"
              r={r}
              fill="none"
              stroke="var(--primary)"
              strokeOpacity={opacities[i] ?? 0.2}
              strokeWidth="16"
              strokeDasharray={`${len} ${c - len}`}
              strokeDashoffset={-offset}
            />
          );
          offset += len;
          return el;
        })}
      </svg>
      <ul className="space-y-1.5">
        {data.map((d, i) => (
          <li key={d.name} className="flex items-center gap-2 text-[12px]">
            <span
              className="size-2.5 rounded-sm bg-primary"
              style={{ opacity: opacities[i] ?? 0.2 }}
            />
            <span className="flex-1 truncate font-medium">{d.name}</span>
            <span className="num font-bold">{d.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Sparkline({ points, tone }: { points: number[]; tone?: "up" | "down" }) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const path = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * 100;
      const y = 26 - ((p - min) / Math.max(1, max - min)) * 22;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg viewBox="0 0 100 28" preserveAspectRatio="none" className="h-7 w-20">
      <path
        d={path}
        fill="none"
        strokeWidth="2"
        className={cn(tone === "down" ? "stroke-danger" : "stroke-success")}
        strokeLinecap="round"
      />
    </svg>
  );
}
