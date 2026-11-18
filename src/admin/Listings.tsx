'use client';
import { useState, type FormEvent } from 'react';
import { useAdmin, useScoped } from './store';
import { DEMO_TODAY, type AdminListing, type ListingStatus } from './data';
import { AgentTag, Drawer, Pill, aedShort } from './ui';
import { agents } from '../lib/data';
import { media } from '../lib/site';
import type { PropertyType } from '../lib/types';

const statuses: ListingStatus[] = ['Available', 'Reserved', 'Sold', 'Rented', 'Draft'];
const communitiesList = ['Dubai Marina', 'Palm Jumeirah', 'Downtown Dubai', 'Business Bay', 'Dubai Hills Estate', 'Dubai Harbour'];

const blank = (agentId: string): AdminListing => ({
  id: `p${Date.now().toString(36)}`, slug: '', title: '', community: 'Dubai Marina', building: '', type: 'Apartment', purpose: 'buy',
  completion: 'ready', priceAed: 0, beds: 1, baths: 1, areaSqft: 0, permitNumber: '', image: media('communities/community-dubai-marina-card.jpg'),
  gallery: [], agentId, listedOn: DEMO_TODAY, status: 'Draft', views: 0, enquiries: 0, description: '', features: [],
});

export function Listings() {
  const { state, dispatch } = useAdmin();
  const { listings, own } = useScoped();
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [purpose, setPurpose] = useState('');
  const [editing, setEditing] = useState<AdminListing | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const rows = listings.filter((l) =>
    (!q || `${l.title} ${l.community} ${l.building} ${l.permitNumber}`.toLowerCase().includes(q.toLowerCase())) &&
    (!status || l.status === status) && (!purpose || l.purpose === purpose));

  return (
    <div className="ascreen">
      <div className="ahead">
        <div><h1>Listings</h1><p>{listings.length} listings · {listings.filter((l) => l.status === 'Available').length} available</p></div>
        <div className="ahead__actions">
          <button type="button" className="abtn abtn--primary" onClick={() => setEditing(blank(state.me.agentId))}>Add listing</button>
        </div>
      </div>

      <div className="afilters">
        <label className="sr-only" htmlFor="l-q">Search listings</label>
        <input id="l-q" className="ainput" placeholder="Search title, community, building or permit" value={q} onChange={(e) => setQ(e.target.value)} />
        <label className="sr-only" htmlFor="l-status">Status</label>
        <select id="l-status" className="ainput" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>{statuses.map((s) => <option key={s}>{s}</option>)}
        </select>
        <label className="sr-only" htmlFor="l-purpose">Purpose</label>
        <select id="l-purpose" className="ainput" value={purpose} onChange={(e) => setPurpose(e.target.value)}>
          <option value="">Sale and rent</option><option value="buy">For sale</option><option value="rent">For rent</option>
        </select>
      </div>

      <div className="panel">
        <div className="atable-wrap">
          <table className="atable atable--listings">
            <thead><tr><th>Property</th><th>Price</th><th>Status</th><th>Adviser</th><th>Views</th><th>Enquiries</th><th>Featured</th><th><span className="sr-only">Actions</span></th></tr></thead>
            <tbody>
              {rows.map((l) => (
                <tr key={l.id}>
                  <td>
                    <div className="arow-prop">
                      <img src={l.image} alt="" />
                      <span><b>{l.title || 'Untitled listing'}</b><small>{l.community}{l.building ? ` · ${l.building}` : ''} · {l.beds === 0 ? 'Studio' : `${l.beds} bed`} · Permit {l.permitNumber || 'missing'}</small></span>
                    </div>
                  </td>
                  <td className="tabular">{aedShort(l.priceAed)}{l.purpose === 'rent' ? ' / yr' : ''}</td>
                  <td>
                    <label className="sr-only" htmlFor={`st-${l.id}`}>Status of {l.title}</label>
                    <select id={`st-${l.id}`} className="ainput ainput--inline" value={l.status} onChange={(e) => dispatch({ type: 'listing/save', listing: { ...l, status: e.target.value as ListingStatus } })}>
                      {statuses.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                  <td><AgentTag id={l.agentId} short /></td>
                  <td className="tabular">{l.views.toLocaleString('en-US')}</td>
                  <td className="tabular">{l.enquiries}</td>
                  <td>
                    <button type="button" className={`switch${l.featured ? ' is-on' : ''}`} role="switch" aria-checked={!!l.featured} aria-label={`Feature ${l.title} on the homepage`} onClick={() => dispatch({ type: 'listing/toggleFeatured', id: l.id })}><span /></button>
                  </td>
                  <td className="atable__actions">
                    {confirmDelete === l.id ? (
                      <span className="confirm">Delete? <button type="button" className="alink alink--bad" onClick={() => { dispatch({ type: 'listing/delete', id: l.id }); setConfirmDelete(null); }}>Yes, delete</button> <button type="button" className="alink" onClick={() => setConfirmDelete(null)}>Keep</button></span>
                    ) : (
                      <>
                        <button type="button" className="alink" onClick={() => setEditing(l)}>Edit</button>
                        <button type="button" className="alink alink--bad" onClick={() => setConfirmDelete(l.id)}>Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {rows.length === 0 && <tr><td colSpan={8} className="atable__empty">No listings match these filters.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {editing && <ListingForm listing={editing} lockAgent={own} onClose={() => setEditing(null)} onSave={(l) => { dispatch({ type: 'listing/save', listing: l }); setEditing(null); }} />}
    </div>
  );
}

function ListingForm({ listing, onClose, onSave, lockAgent }: { listing: AdminListing; onClose: () => void; onSave: (l: AdminListing) => void; lockAgent: boolean }) {
  const [f, setF] = useState(listing);
  const set = <K extends keyof AdminListing>(k: K, v: AdminListing[K]) => setF((x) => ({ ...x, [k]: v }));
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const slug = f.slug || f.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    onSave({ ...f, slug, features: f.features ?? [] });
  };
  const isNew = !listing.title;
  return (
    <Drawer title={isNew ? 'Add listing' : `Edit ${listing.title}`} onClose={onClose}>
      <form className="aform" onSubmit={submit}>
        <div className="aform__field"><label htmlFor="f-title">Title</label><input id="f-title" className="ainput" required value={f.title} onChange={(e) => set('title', e.target.value)} placeholder="e.g. Marina-view apartment" /></div>
        <div className="aform__row">
          <div className="aform__field"><label htmlFor="f-purpose">Purpose</label>
            <select id="f-purpose" className="ainput" value={f.purpose} onChange={(e) => set('purpose', e.target.value as AdminListing['purpose'])}><option value="buy">For sale</option><option value="rent">For rent</option></select></div>
          <div className="aform__field"><label htmlFor="f-type">Type</label>
            <select id="f-type" className="ainput" value={f.type} onChange={(e) => set('type', e.target.value as PropertyType)}>{['Apartment', 'Villa', 'Townhouse', 'Penthouse'].map((t) => <option key={t}>{t}</option>)}</select></div>
        </div>
        <div className="aform__row">
          <div className="aform__field"><label htmlFor="f-comm">Community</label>
            <select id="f-comm" className="ainput" value={f.community} onChange={(e) => set('community', e.target.value)}>{communitiesList.map((c) => <option key={c}>{c}</option>)}</select></div>
          <div className="aform__field"><label htmlFor="f-bld">Building or cluster</label><input id="f-bld" className="ainput" value={f.building ?? ''} onChange={(e) => set('building', e.target.value)} /></div>
        </div>
        <div className="aform__row aform__row--3">
          <div className="aform__field"><label htmlFor="f-price">{f.purpose === 'rent' ? 'Rent per year (AED)' : 'Price (AED)'}</label><input id="f-price" className="ainput" type="number" min={0} required value={f.priceAed || ''} onChange={(e) => set('priceAed', Number(e.target.value))} /></div>
          <div className="aform__field"><label htmlFor="f-beds">Beds</label><input id="f-beds" className="ainput" type="number" min={0} max={12} value={f.beds} onChange={(e) => set('beds', Number(e.target.value))} /></div>
          <div className="aform__field"><label htmlFor="f-baths">Baths</label><input id="f-baths" className="ainput" type="number" min={1} max={14} value={f.baths} onChange={(e) => set('baths', Number(e.target.value))} /></div>
        </div>
        <div className="aform__row">
          <div className="aform__field"><label htmlFor="f-size">Size (sq ft)</label><input id="f-size" className="ainput" type="number" min={0} required value={f.areaSqft || ''} onChange={(e) => set('areaSqft', Number(e.target.value))} /></div>
          <div className="aform__field"><label htmlFor="f-permit">DLD permit number</label><input id="f-permit" className="ainput" required pattern="[0-9]{6,12}" title="6 to 12 digits" value={f.permitNumber} onChange={(e) => set('permitNumber', e.target.value)} /></div>
        </div>
        <div className="aform__row">
          <div className="aform__field"><label htmlFor="f-status">Status</label>
            <select id="f-status" className="ainput" value={f.status} onChange={(e) => set('status', e.target.value as ListingStatus)}>{statuses.map((s) => <option key={s}>{s}</option>)}</select></div>
          <div className="aform__field"><label htmlFor="f-agent">Adviser</label>
            <select id="f-agent" className="ainput" value={f.agentId} disabled={lockAgent} onChange={(e) => set('agentId', e.target.value)}>{agents.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}</select></div>
        </div>
        <div className="aform__field"><label htmlFor="f-desc">Description</label><textarea id="f-desc" className="ainput" rows={4} value={f.description ?? ''} onChange={(e) => set('description', e.target.value)} /></div>
        <div className="aform__field"><label htmlFor="f-feat">Features (comma separated)</label><input id="f-feat" className="ainput" value={(f.features ?? []).join(', ')} onChange={(e) => set('features', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))} /></div>
        <div className="aform__field">
          <span className="aform__label">Photos</span>
          <div className="upload">
            {f.image && <img src={f.image} alt="Cover photo" />}
            <label className="abtn" htmlFor="f-photos">Upload photos</label>
            <input id="f-photos" type="file" accept="image/*" multiple className="sr-only" onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) set('image', URL.createObjectURL(file));
            }} />
          </div>
        </div>
        <label className="acheck" htmlFor="f-featured"><input id="f-featured" type="checkbox" checked={!!f.featured} onChange={(e) => set('featured', e.target.checked)} /> Feature on the homepage</label>
        <div className="aform__actions">
          <button type="button" className="abtn" onClick={onClose}>Cancel</button>
          <button type="submit" className="abtn abtn--primary">{isNew ? 'Add listing' : 'Save changes'}</button>
        </div>
      </form>
    </Drawer>
  );
}
