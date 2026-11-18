'use client';
import { useEffect, useState } from 'react';
import type { Property } from '../lib/types';
import { href } from '../lib/site';
import { formatArea, formatPrice, GOLDEN_VISA_THRESHOLD_AED, usePreferences } from '../lib/preferences';
import { IconHeart } from './Icons';

const SAVED_KEY = 'fanar-saved';
const readSaved = (): string[] => {
  try { return JSON.parse(window.localStorage.getItem(SAVED_KEY) || '[]'); } catch { return []; }
};

export function PropertyCard({ p }: { p: Property }) {
  const { currency, unit } = usePreferences();
  const [saved, setSaved] = useState(false);
  useEffect(() => { setSaved(readSaved().includes(p.id)); }, [p.id]);

  const toggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    const list = readSaved();
    const next = list.includes(p.id) ? list.filter((x) => x !== p.id) : [...list, p.id];
    try { window.localStorage.setItem(SAVED_KEY, JSON.stringify(next)); } catch { /* storage unavailable */ }
    setSaved(next.includes(p.id));
  };

  const goldenVisa = p.purpose === 'buy' && p.priceAed >= GOLDEN_VISA_THRESHOLD_AED;
  const bedLabel = p.beds === 0 ? 'Studio' : `${p.beds} bed`;
  const link = href(`/property/${p.slug}`);

  return (
    <article className="pcard">
      <div className="pcard__img">
        <a href={link} tabIndex={-1} aria-hidden>
          <img src={p.image} alt="" loading="lazy" />
        </a>
        <div className="pcard__badges">
          <span className="badge">{p.completion === 'ready' ? 'Ready' : 'Off-plan'}</span>
          {goldenVisa && <span className="badge badge--gold">Golden Visa eligible</span>}
        </div>
        <button className="pcard__save" type="button" aria-pressed={saved} aria-label={saved ? 'Remove from saved' : 'Save property'} onClick={toggleSave}>
          <IconHeart />
        </button>
      </div>
      <div className="pcard__body">
        <span className="pcard__where">{p.community}{p.building ? ` · ${p.building}` : ''}</span>
        <h3><a href={link}>{p.title}</a></h3>
        <span className="pcard__price tabular">
          {formatPrice(p.priceAed, currency)}{p.purpose === 'rent' ? ' / yr' : ''}
        </span>
        <div className="pcard__facts tabular">
          <span>{p.type}</span><span>{bedLabel}</span><span>{p.baths} bath</span><span>{formatArea(p.areaSqft, unit)}</span>
        </div>
        <span className="pcard__permit">DLD permit {p.permitNumber}</span>
      </div>
    </article>
  );
}
