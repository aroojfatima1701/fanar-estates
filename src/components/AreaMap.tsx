'use client';
import type { Property } from '../lib/types';
import { communityPins } from '../lib/data';
import { formatPrice, usePreferences } from '../lib/preferences';

// Schematic Dubai map for the preview. In production swap this for Mapbox or Google Maps,
// placing pins from each listing's latitude and longitude.
export function AreaMap({ items, active, onPick, height = 520 }: {
  items: Property[]; active?: string | null; onPick?: (id: string) => void; height?: number;
}) {
  const { currency } = usePreferences();
  const groups = new Map<string, Property[]>();
  items.forEach((p) => groups.set(p.community, [...(groups.get(p.community) ?? []), p]));

  return (
    <div className="map" style={{ height }}>
      <svg className="map__land" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        <path d="M0 0 H100 V100 H0 Z" fill="#E7EBF0" />
        <path d="M0 0 H62 C52 14 40 24 30 32 C20 40 10 52 0 62 Z" fill="#CFD9E4" />
        <path d="M24 33 C27 36 30 38 32 42 M26 31 C30 33 34 34 36 37 M22 35 C24 39 25 43 26 47" stroke="#E7EBF0" strokeWidth="1.6" fill="none" />
        <path d="M76 100 C74 80 72 62 74 50 C75 44 79 38 84 30" stroke="#CFD9E4" strokeWidth="1.2" fill="none" />
        <path d="M8 74 L96 30" stroke="#FFFFFF" strokeWidth="1.1" fill="none" />
      </svg>
      <span className="map__label" style={{ left: '14%', top: '20%' }}>Arabian Gulf</span>
      <span className="map__label" style={{ left: '66%', top: '66%' }}>Sheikh Zayed Road</span>
      {[...groups.entries()].map(([community, list]) => {
        const pos = communityPins[community] ?? [50, 50];
        const isActive = list.some((p) => p.id === active);
        const from = Math.min(...list.map((p) => p.priceAed));
        return (
          <button
            key={community} type="button"
            className={`pin${pos[0] < 35 ? ' pin--left' : pos[0] > 65 ? ' pin--right' : ''}${isActive ? ' is-active' : ''}`}
            style={{ left: `${pos[0]}%`, top: `${pos[1]}%` }}
            onClick={() => onPick?.(list[0].id)}
            aria-label={`${community}: ${list.length} ${list.length === 1 ? 'property' : 'properties'} from ${formatPrice(from, currency)}`}
          >
            <b>{community}</b><span>{list.length} · from {formatPrice(from, currency, true)}</span>
          </button>
        );
      })}
      <span className="map__note">Map preview · live map in production</span>
    </div>
  );
}
