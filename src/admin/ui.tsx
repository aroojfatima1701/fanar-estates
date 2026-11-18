'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { agentById } from '../lib/data';
import { agentColor } from './data';

export const aed = (n: number) => `AED ${n.toLocaleString('en-US')}`;
export const aedShort = (n: number) => (n >= 1_000_000 ? `AED ${(n / 1_000_000).toFixed(n >= 10_000_000 ? 1 : 2).replace(/\.?0+$/, '')}M` : n >= 1000 ? `AED ${Math.round(n / 1000)}k` : `AED ${n}`);
export const fmtDay = (iso: string, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' }) => new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-GB', { ...opts, timeZone: 'UTC' });

const tone: Record<string, string> = {
  Available: 'good', Published: 'good', Won: 'good', Confirmed: 'good', Done: 'muted',
  Reserved: 'warn', Pending: 'warn', Negotiating: 'warn', Viewing: 'info', Contacted: 'info', New: 'new',
  Sold: 'muted', Rented: 'muted', Draft: 'muted', Lost: 'bad',
};
export function Pill({ children }: { children: string }) {
  return <span className={`apill apill--${tone[children] ?? 'muted'}`}>{children}</span>;
}

export function AgentTag({ id, short = false }: { id: string; short?: boolean }) {
  const a = agentById(id);
  return (
    <span className="atag">
      <span className="atag__dot" style={{ background: agentColor[id] }} aria-hidden />
      {short ? a.name.split(' ')[0] : a.name}
    </span>
  );
}

export function Kpi({ label, value, note, trend }: { label: string; value: string; note?: string; trend?: 'up' | 'down' | 'flat' }) {
  return (
    <div className="kpi">
      <span className="kpi__label">{label}</span>
      <b className="kpi__value tabular">{value}</b>
      {note && <span className={`kpi__note kpi__note--${trend ?? 'flat'}`}>{trend === 'up' ? '▲ ' : trend === 'down' ? '▼ ' : ''}{note}</span>}
    </div>
  );
}

export function Panel({ title, action, children, className = '' }: { title: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`panel ${className}`}>
      <header className="panel__head"><h2>{title}</h2>{action}</header>
      {children}
    </section>
  );
}

// Side drawer for add / edit forms. Closes on Escape and returns focus to the page.
export function Drawer({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    ref.current?.querySelector<HTMLElement>('input, select, textarea, button')?.focus();
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className="drawer-wrap" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="adrawer" role="dialog" aria-modal="true" aria-label={title} ref={ref}>
        <header className="adrawer__head">
          <h2>{title}</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">✕</button>
        </header>
        <div className="adrawer__body">{children}</div>
      </div>
    </div>
  );
}

// Horizontal bars: one series, one hue, values labelled at the bar end.
export function BarList({ rows, format = (n: number) => String(n), max }: { rows: { label: string; value: number; color?: string }[]; format?: (n: number) => string; max?: number }) {
  const top = max ?? Math.max(1, ...rows.map((r) => r.value));
  return (
    <div className="barlist" role="table">
      {rows.map((r) => (
        <div className="barlist__row" role="row" key={r.label} title={`${r.label}: ${format(r.value)}`}>
          <span role="cell" className="barlist__label">{r.label}</span>
          <span role="cell" className="barlist__track">
            <span className="barlist__bar" style={{ width: `${(r.value / top) * 100}%`, background: r.color ?? 'var(--a-series)' }} />
          </span>
          <span role="cell" className="barlist__value tabular">{format(r.value)}</span>
        </div>
      ))}
    </div>
  );
}

// Single-series line chart with a hover crosshair and tooltip.
export function LineChart({ points, height = 220, label, partialLast = false }: { points: { x: string; y: number }[]; height?: number; label: string; partialLast?: boolean }) {
  const [hover, setHover] = useState<number | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const [W, setW] = useState(600);
  useEffect(() => {
    const el = box.current; if (!el) return;
    const ro = new ResizeObserver(() => setW(Math.max(280, Math.round(el.clientWidth))));
    ro.observe(el); return () => ro.disconnect();
  }, []);
  const H = height, padL = 36, padR = 44, padT = 16, padB = 28;
  const maxY = Math.ceil(Math.max(...points.map((p) => p.y)) / 20) * 20;
  const ticks = [0, maxY / 2, maxY];
  const x = (i: number) => padL + (i * (W - padL - padR)) / (points.length - 1);
  const y = (v: number) => padT + (1 - v / maxY) * (H - padT - padB);
  const solidTo = partialLast ? points.length - 2 : points.length - 1;
  const path = (from: number, to: number) => points.slice(from, to + 1).map((p, k) => `${k ? 'L' : 'M'}${x(from + k).toFixed(1)} ${y(p.y).toFixed(1)}`).join(' ');
  const d = path(0, solidTo);
  const area = `${d} L${x(solidTo)} ${y(0)} L${x(0)} ${y(0)} Z`;
  return (
    <div className="lchart" ref={box}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${label}: ${points.map((p) => `${p.x} ${p.y}`).join(', ')}`}
        onMouseLeave={() => setHover(null)}
        onMouseMove={(e) => {
          const r = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
          const px = ((e.clientX - r.left) / r.width) * W;
          const i = Math.round(((px - padL) / (W - padL - padR)) * (points.length - 1));
          setHover(Math.max(0, Math.min(points.length - 1, i)));
        }}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={padL} x2={W - padR} y1={y(t)} y2={y(t)} stroke="var(--a-grid)" strokeWidth="1" />
            <text x={padL - 8} y={y(t) + 4} textAnchor="end" fontSize="11" fill="var(--a-muted)">{t}</text>
          </g>
        ))}
        <path d={area} fill="var(--a-series)" opacity="0.08" />
        <path d={d} fill="none" stroke="var(--a-series)" strokeWidth="2" strokeLinejoin="round" />
        {partialLast && <path d={path(points.length - 2, points.length - 1)} fill="none" stroke="var(--a-series)" strokeWidth="2" strokeDasharray="4 4" />}
        {points.map((p, i) => (
          <text key={p.x} x={x(i)} y={H - 8} textAnchor="middle" fontSize="11" fill="var(--a-muted)">{p.x}{partialLast && i === points.length - 1 ? ' (so far)' : ''}</text>
        ))}
        {hover !== null && <line x1={x(hover)} x2={x(hover)} y1={padT} y2={y(0)} stroke="var(--a-muted)" strokeDasharray="3 3" />}
        {points.map((p, i) => (
          <circle key={p.x} cx={x(i)} cy={y(p.y)} r={i === points.length - 1 || i === hover ? 5 : 0} fill="var(--a-series)" stroke="var(--a-surface)" strokeWidth="2" />
        ))}
      </svg>
      {hover !== null && (
        <div className="lchart__tip" style={{ left: `${(x(hover) / W) * 100}%`, top: `${(y(points[hover].y) / H) * 100}%` }}>
          <b className="tabular">{points[hover].y}</b> {label.toLowerCase()} · {points[hover].x}
        </div>
      )}
    </div>
  );
}
