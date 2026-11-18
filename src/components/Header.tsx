'use client';
import { useEffect, useState } from 'react';
import { href, nav } from '../lib/site';
import { currencies, usePreferences, type AreaUnit, type Currency } from '../lib/preferences';
import { Logo } from './Logo';
import { IconClose, IconMenu } from './Icons';

function Prefs({ idPrefix }: { idPrefix: string }) {
  const { currency, unit, setCurrency, setUnit } = usePreferences();
  return (
    <div className="prefs">
      <label className="sr-only" htmlFor={`${idPrefix}-currency`}>Currency</label>
      <select id={`${idPrefix}-currency`} value={currency} onChange={(e) => setCurrency(e.target.value as Currency)}>
        {Object.keys(currencies).map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
      <label className="sr-only" htmlFor={`${idPrefix}-unit`}>Area unit</label>
      <select id={`${idPrefix}-unit`} value={unit} onChange={(e) => setUnit(e.target.value as AreaUnit)}>
        <option value="sqft">sq ft</option>
        <option value="m2">m²</option>
      </select>
    </div>
  );
}

// `overHero`: transparent over the hero video, turning solid navy once the visitor scrolls.
export function Header({ overHero = false }: { overHero?: boolean }) {
  const [solid, setSolid] = useState(!overHero);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!overHero) return;
    const onScroll = () => setSolid(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [overHero]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const cls = overHero && !solid ? 'header header--over' : 'header header--solid';
  const style = overHero && solid ? { position: 'fixed' as const, left: 0, right: 0, top: 0 } : undefined;

  return (
    <>
      <header className={cls} style={style}>
        <div className="wrap header__in">
          <Logo />
          <nav className="nav" aria-label="Main">
            {nav.map((n) => <a key={n.route} href={href(n.route)}>{n.label}</a>)}
          </nav>
          <div className="header__tools">
            <Prefs idPrefix="hdr" />
            <a className="btn btn--gold" href={href('/sell')}>List your property</a>
            <button className="menu-btn" type="button" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)}>
              <IconMenu />
            </button>
          </div>
        </div>
      </header>
      {open && (
        <div className="drawer" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="drawer__top">
            <Logo />
            <button className="menu-btn" style={{ display: 'inline-flex' }} type="button" aria-label="Close menu" onClick={() => setOpen(false)}>
              <IconClose />
            </button>
          </div>
          <nav aria-label="Mobile">
            {nav.map((n) => <a key={n.route} href={href(n.route)} onClick={() => setOpen(false)}>{n.label}</a>)}
          </nav>
          <Prefs idPrefix="drw" />
          <a className="btn btn--gold" href={href('/sell')}>List your property</a>
        </div>
      )}
    </>
  );
}
