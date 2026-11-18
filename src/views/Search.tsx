'use client';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { SiteShell } from '../components/SiteShell';
import { PropertyCard } from '../components/PropertyCard';
import { AreaMap } from '../components/AreaMap';
import { properties } from '../lib/data';
import { href } from '../lib/site';
import type { Purpose } from '../lib/types';
import { GOLDEN_VISA_THRESHOLD_AED } from '../lib/preferences';

type Sort = 'newest' | 'price-asc' | 'price-desc' | 'size-desc';

const priceSteps: Record<Purpose, number[]> = {
  buy: [1_000_000, 2_000_000, 3_000_000, 5_000_000, 10_000_000, 15_000_000, 25_000_000, 50_000_000],
  rent: [50_000, 80_000, 100_000, 150_000, 200_000, 300_000, 500_000, 800_000],
};
const short = (n: number) => (n >= 1_000_000 ? `${n / 1_000_000}M` : `${n / 1000}k`);

// Buy and Rent share this page: /buy and /rent (in Next.js, app/buy/page.tsx and app/rent/page.tsx).
export default function Search({ purpose = 'buy' }: { purpose?: Purpose }) {
  const [q, setQ] = useState('');
  const [type, setType] = useState('');
  const [beds, setBeds] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [completion, setCompletion] = useState('');
  const [goldenVisa, setGoldenVisa] = useState(false);
  const [sort, setSort] = useState<Sort>('newest');
  const [view, setView] = useState<'grid' | 'map'>('grid');
  const [active, setActive] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Pick up filters sent from the homepage search, e.g. buy.html?q=Dubai%20Marina&beds=2
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setQ(p.get('q') ?? '');
    setBeds(p.get('beds') ?? '');
    setMaxPrice(p.get('maxPrice') ?? '');
  }, []);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    const list = properties.filter((p) => {
      if (p.purpose !== purpose) return false;
      if (term && !`${p.community} ${p.building ?? ''} ${p.title}`.toLowerCase().includes(term)) return false;
      if (type && p.type !== type) return false;
      if (beds !== '' && (beds === '5' ? p.beds < 5 : p.beds !== Number(beds))) return false;
      if (minPrice && p.priceAed < Number(minPrice)) return false;
      if (maxPrice && p.priceAed > Number(maxPrice)) return false;
      if (completion && p.completion !== completion) return false;
      if (goldenVisa && p.priceAed < GOLDEN_VISA_THRESHOLD_AED) return false;
      return true;
    });
    const sorters: Record<Sort, (a: typeof list[0], b: typeof list[0]) => number> = {
      newest: (a, b) => b.listedOn.localeCompare(a.listedOn),
      'price-asc': (a, b) => a.priceAed - b.priceAed,
      'price-desc': (a, b) => b.priceAed - a.priceAed,
      'size-desc': (a, b) => b.areaSqft - a.areaSqft,
    };
    return [...list].sort(sorters[sort]);
  }, [purpose, q, type, beds, minPrice, maxPrice, completion, goldenVisa, sort]);

  const activeCount = [q, type, beds, minPrice, maxPrice, completion].filter(Boolean).length + (goldenVisa ? 1 : 0);
  const reset = () => { setQ(''); setType(''); setBeds(''); setMinPrice(''); setMaxPrice(''); setCompletion(''); setGoldenVisa(false); };
  const steps = priceSteps[purpose];
  const unitLabel = purpose === 'rent' ? ' / yr' : '';

  return (
    <SiteShell>
      <section className="page-head">
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb"><a href={href('/')}>Home</a><span>/</span><span>{purpose === 'buy' ? 'Buy' : 'Rent'}</span></nav>
          <div className="page-head__row">
            <h1 className="display">{purpose === 'buy' ? <>Properties <em>for sale</em></> : <>Properties <em>for rent</em></>}</h1>
            <div className="seg" role="group" aria-label="Buy or rent">
              <a href={href('/buy')} aria-current={purpose === 'buy' ? 'page' : undefined}>Buy</a>
              <a href={href('/rent')} aria-current={purpose === 'rent' ? 'page' : undefined}>Rent</a>
            </div>
          </div>
        </div>
      </section>

      <section className="filters-bar">
        <div className="wrap">
          <button className="btn btn--line filters-toggle" type="button" aria-expanded={filtersOpen} onClick={() => setFiltersOpen((o) => !o)}>
            Filters{activeCount ? ` (${activeCount})` : ''}
          </button>
          <form className={`filters${filtersOpen ? ' is-open' : ''}`} onSubmit={(e) => e.preventDefault()} aria-label="Filter properties">
            <div className="field field--grow">
              <label htmlFor="f-q">Location</label>
              <input id="f-q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Community or building" />
            </div>
            <div className="field">
              <label htmlFor="f-type">Type</label>
              <select id="f-type" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="">Any</option><option>Apartment</option><option>Villa</option><option>Townhouse</option><option>Penthouse</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="f-beds">Beds</label>
              <select id="f-beds" value={beds} onChange={(e) => setBeds(e.target.value)}>
                <option value="">Any</option><option value="0">Studio</option>
                {[1, 2, 3, 4].map((b) => <option key={b} value={b}>{b}</option>)}<option value="5">5+</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="f-min">Min price</label>
              <select id="f-min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)}>
                <option value="">No min</option>{steps.map((s) => <option key={s} value={s}>AED {short(s)}{unitLabel}</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor="f-max">Max price</label>
              <select id="f-max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}>
                <option value="">No max</option>{steps.map((s) => <option key={s} value={s}>AED {short(s)}{unitLabel}</option>)}
              </select>
            </div>
            {purpose === 'buy' && (
              <div className="field">
                <label htmlFor="f-comp">Status</label>
                <select id="f-comp" value={completion} onChange={(e) => setCompletion(e.target.value)}>
                  <option value="">Ready and off-plan</option><option value="ready">Ready</option><option value="off-plan">Off-plan</option>
                </select>
              </div>
            )}
            {purpose === 'buy' && (
              <label className="check" htmlFor="f-gv">
                <input id="f-gv" type="checkbox" checked={goldenVisa} onChange={(e) => setGoldenVisa(e.target.checked)} />
                Golden Visa eligible
              </label>
            )}
            {activeCount > 0 && <button className="text-btn" type="button" onClick={reset}>Clear all</button>}
          </form>
        </div>
      </section>

      <section className="band" style={{ paddingTop: 36 }}>
        <div className="wrap">
          <div className="results-bar">
            <p className="tabular" aria-live="polite"><b>{results.length}</b> {results.length === 1 ? 'property' : 'properties'}</p>
            <div className="results-bar__tools">
              <label className="sr-only" htmlFor="f-sort">Sort by</label>
              <select id="f-sort" className="plain-select" value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
                <option value="newest">Newest first</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
                <option value="size-desc">Largest first</option>
              </select>
              <div className="seg seg--small" role="group" aria-label="View">
                <button type="button" aria-pressed={view === 'grid'} onClick={() => setView('grid')}>Grid</button>
                <button type="button" aria-pressed={view === 'map'} onClick={() => setView('map')}>Map</button>
              </div>
            </div>
          </div>

          {results.length === 0 ? (
            <div className="empty">
              <h2 className="display">No matches <em>yet</em></h2>
              <p className="lede">Try a wider price range or another community, or set up an alert below and we will tell you when one is listed.</p>
              <button className="btn btn--navy" type="button" onClick={reset}>Clear filters</button>
            </div>
          ) : view === 'grid' ? (
            <div className="cards cards--3">{results.map((p) => <PropertyCard key={p.id} p={p} />)}</div>
          ) : (
            <div className="map-split">
              <AreaMap items={results} active={active} onPick={(id) => { setActive(id); document.getElementById(`res-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }} />
              <div className="map-split__list">
                {results.map((p) => (
                  <div key={p.id} id={`res-${p.id}`} className={active === p.id ? 'is-active' : ''} onMouseEnter={() => setActive(p.id)}>
                    <PropertyCard p={p} />
                  </div>
                ))}
              </div>
            </div>
          )}

          <SearchAlert purpose={purpose} summary={[q, type, beds && `${beds === '0' ? 'Studio' : `${beds}${beds === '5' ? '+' : ''} bed`}`].filter(Boolean).join(', ')} />
        </div>
      </section>
    </SiteShell>
  );
}

function SearchAlert({ purpose, summary }: { purpose: Purpose; summary: string }) {
  const [done, setDone] = useState(false);
  const submit = (e: FormEvent) => { e.preventDefault(); setDone(true); };
  return (
    <div className="alert-box">
      <div>
        <span className="eyebrow">Property alerts</span>
        <h2 className="display">Be first to hear about <em>new listings</em></h2>
        <p>We email you when a {purpose === 'buy' ? 'property for sale' : 'rental'}{summary ? ` matching “${summary}”` : ''} is listed, often before it reaches the portals.</p>
      </div>
      {done ? (
        <p role="status" className="alert-box__ok">Alert saved. You can change or stop it from any alert email.</p>
      ) : (
        <form className="news news--light" onSubmit={submit} aria-label="Create a property alert">
          <label className="sr-only" htmlFor="alert-email">Email address</label>
          <input id="alert-email" type="email" required placeholder="Your email" />
          <button className="btn btn--navy" type="submit">Create alert</button>
        </form>
      )}
    </div>
  );
}
