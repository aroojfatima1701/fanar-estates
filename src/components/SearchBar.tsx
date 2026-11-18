'use client';
import { useState, type FormEvent } from 'react';
import { href } from '../lib/site';
import { communities } from '../lib/data';

type Mode = 'buy' | 'rent' | 'off-plan';
const modes: { id: Mode; label: string }[] = [
  { id: 'buy', label: 'Buy' }, { id: 'rent', label: 'Rent' }, { id: 'off-plan', label: 'Off-plan' },
];

const buyPrices = [['', 'Any price'], ['2000000', 'Up to AED 2M'], ['5000000', 'Up to AED 5M'], ['10000000', 'Up to AED 10M'], ['25000000', 'Up to AED 25M']];
const rentPrices = [['', 'Any rent'], ['100000', 'Up to AED 100k / yr'], ['200000', 'Up to AED 200k / yr'], ['400000', 'Up to AED 400k / yr']];

export function SearchBar() {
  const [mode, setMode] = useState<Mode>('buy');
  const [q, setQ] = useState('');
  const [price, setPrice] = useState('');
  const [beds, setBeds] = useState('');

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (price) params.set('maxPrice', price);
    if (beds) params.set('beds', beds);
    const qs = params.toString();
    window.location.href = href(`/${mode}${qs ? `?${qs}` : ''}`);
  };

  const prices = mode === 'rent' ? rentPrices : buyPrices;

  return (
    <form className="search" onSubmit={submit} role="search" aria-label="Find a property">
      <div className="search__tabs">
        {modes.map((m) => (
          <button key={m.id} type="button" aria-pressed={mode === m.id} onClick={() => { setMode(m.id); setPrice(''); }}>{m.label}</button>
        ))}
      </div>
      <div className="search__row">
        <label className="sr-only" htmlFor="search-q">Community, building or project</label>
        <input id="search-q" list="search-communities" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Community, building or project" autoComplete="off" />
        <datalist id="search-communities">
          {communities.map((c) => <option key={c.slug} value={c.name} />)}
          <option value="Dubai Hills Estate" />
          <option value="Dubai Harbour" />
        </datalist>
        <label className="sr-only" htmlFor="search-price">Price</label>
        <select id="search-price" value={price} onChange={(e) => setPrice(e.target.value)}>
          {prices.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <label className="sr-only" htmlFor="search-beds">Bedrooms</label>
        <select id="search-beds" value={beds} onChange={(e) => setBeds(e.target.value)}>
          <option value="">Beds</option>
          <option value="0">Studio</option>
          {[1, 2, 3, 4, 5].map((b) => <option key={b} value={b}>{b}{b === 5 ? '+' : ''} bed</option>)}
        </select>
        <button className="btn btn--navy" type="submit">Search</button>
      </div>
    </form>
  );
}
