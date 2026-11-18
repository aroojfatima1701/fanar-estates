'use client';
import { useState } from 'react';
import { SiteShell } from '../components/SiteShell';
import { Gallery } from '../components/Gallery';
import { PropertyCard } from '../components/PropertyCard';
import { MortgageCalculator, YieldCalculator } from '../components/Calculators';
import { ViewingBooking } from '../components/ViewingBooking';
import { AreaMap } from '../components/AreaMap';
import { AgentAvatar } from '../components/AgentAvatar';
import { IconArrow, IconWhatsApp } from '../components/Icons';
import { agentById, communities, properties } from '../lib/data';
import { href } from '../lib/site';
import { formatArea, formatPrice, GOLDEN_VISA_THRESHOLD_AED, usePreferences } from '../lib/preferences';

// One listing: /property/[slug] (in Next.js, app/property/[slug]/page.tsx).
export default function Property({ slug }: { slug: string }) {
  const { currency, unit } = usePreferences();
  const p = properties.find((x) => x.slug === slug) ?? properties[0];
  const agent = agentById(p.agentId);
  const area = communities.find((c) => c.name === p.community);
  const [tab, setTab] = useState<'mortgage' | 'yield'>('mortgage');

  const buying = p.purpose === 'buy';
  const goldenVisa = buying && p.priceAed >= GOLDEN_VISA_THRESHOLD_AED;
  const pricePerSqft = Math.round(p.priceAed / p.areaSqft);
  const similar = properties
    .filter((x) => x.id !== p.id && x.purpose === p.purpose)
    .sort((a, b) => Number(b.community === p.community) - Number(a.community === p.community) || Math.abs(a.priceAed - p.priceAed) - Math.abs(b.priceAed - p.priceAed))
    .slice(0, 3);
  const waText = encodeURIComponent(`Hello ${agent.name.split(' ')[0]}, I'm interested in ${p.title}, ${p.community} (permit ${p.permitNumber}).`);
  const waLink = `https://wa.me/${agent.phone.replace(/\D/g, '')}?text=${waText}`;

  return (
    <SiteShell>
      <section className="prop-top">
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb">
            <a href={href('/')}>Home</a><span>/</span>
            <a href={href(buying ? '/buy' : '/rent')}>{buying ? 'Buy' : 'Rent'}</a><span>/</span>
            <span>{p.community}</span>
          </nav>
          <Gallery images={p.gallery} title={`${p.title}, ${p.community}`} />
        </div>
      </section>

      <section className="band" style={{ paddingTop: 40 }}>
        <div className="wrap prop">
          <div className="prop__main">
            <div className="prop__head">
              <div className="prop__badges">
                <span className="badge badge--line">{p.completion === 'ready' ? 'Ready to move in' : 'Off-plan'}</span>
                {goldenVisa && <span className="badge badge--gold">Golden Visa eligible</span>}
                {p.tags?.map((t) => <span key={t} className="badge badge--line">{t}</span>)}
              </div>
              <span className="eyebrow">{p.community}{p.building ? ` · ${p.building}` : ''}</span>
              <h1 className="display">{p.title}</h1>
              <p className="prop__price tabular">
                {formatPrice(p.priceAed, currency)}{buying ? '' : ' / year'}
                {!buying && p.cheques && <span> · {p.cheques} {p.cheques === 1 ? 'cheque' : 'cheques'}</span>}
                {buying && <span> · AED {pricePerSqft.toLocaleString('en-US')} / sq ft</span>}
              </p>
            </div>

            <dl className="facts tabular">
              <div><dt>Type</dt><dd>{p.type}</dd></div>
              <div><dt>Bedrooms</dt><dd>{p.beds === 0 ? 'Studio' : p.beds}</dd></div>
              <div><dt>Bathrooms</dt><dd>{p.baths}</dd></div>
              <div><dt>Size</dt><dd>{formatArea(p.areaSqft, unit)}</dd></div>
            </dl>

            <div className="prop__section">
              <h2>About this home</h2>
              <p className="prop__desc">{p.description}</p>
            </div>

            {p.features && (
              <div className="prop__section">
                <h2>Features</h2>
                <ul className="features">{p.features.map((f) => <li key={f}>{f}</li>)}</ul>
              </div>
            )}

            <div className="prop__section">
              <h2>Location</h2>
              <AreaMap items={[p]} active={p.id} height={340} />
              {area && (
                <p className="prop__area">
                  {area.tagline}. Average price AED {area.avgPricePerSqftAed.toLocaleString('en-US')} / sq ft, gross yield around {area.grossYieldPct}%.{' '}
                  <a href={href(`/communities/${area.slug}`)}>Community guide</a>
                </p>
              )}
            </div>

            {buying && (
              <div className="prop__section">
                <div className="tabs" role="tablist" aria-label="Calculators">
                  <button role="tab" type="button" aria-selected={tab === 'mortgage'} onClick={() => setTab('mortgage')}>Mortgage</button>
                  <button role="tab" type="button" aria-selected={tab === 'yield'} onClick={() => setTab('yield')}>Rental yield</button>
                </div>
                {tab === 'mortgage'
                  ? <MortgageCalculator priceAed={p.priceAed} />
                  : <YieldCalculator priceAed={p.priceAed} areaSqft={p.areaSqft} serviceChargePerSqft={p.serviceChargePerSqft} />}
              </div>
            )}

            <dl className="prop__section legal">
              <div><dt>DLD permit number</dt><dd className="tabular">{p.permitNumber}</dd></div>
              <div><dt>Reference</dt><dd>FE-{p.id.toUpperCase()}</dd></div>
              <div><dt>Listed</dt><dd>{new Date(p.listedOn).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</dd></div>
            </dl>
          </div>

          <aside className="prop__side" id="contact-adviser" aria-label="Contact the adviser">
            <div className="agent-card">
              <AgentAvatar agent={agent} className="agent-card__photo" />
              <div>
                <span className="agent__role">{agent.role}</span>
                <h3>{agent.name}</h3>
                <p>Speaks {agent.languages.join(', ')}</p>
              </div>
            </div>
            <div className="contact-btns">
              <a className="btn btn--wa" href={waLink} target="_blank" rel="noopener"><IconWhatsApp width={20} height={20} /> WhatsApp</a>
              <span className="contact-btns__line">Call <b>{agent.phone}</b></span>
              <span className="contact-btns__line">Email <b>{agent.email}</b></span>
            </div>
            <ViewingBooking propertyTitle={p.title} agentName={agent.name} />
          </aside>
        </div>
      </section>

      <div className="mobile-cta">
        <a className="btn btn--wa" href={waLink} target="_blank" rel="noopener"><IconWhatsApp width={20} height={20} /> WhatsApp</a>
        <a className="btn btn--navy" href="#contact-adviser">Book a viewing</a>
      </div>

      {similar.length > 0 && (
        <section className="band band--pearl">
          <div className="wrap">
            <div className="section-head">
              <div>
                <span className="eyebrow">You may also like</span>
                <h2 className="display">Similar <em>homes</em></h2>
              </div>
              <a className="link-arrow" href={href(buying ? '/buy' : '/rent')}>See all <IconArrow /></a>
            </div>
            <div className="cards cards--3">{similar.map((x) => <PropertyCard key={x.id} p={x} />)}</div>
          </div>
        </section>
      )}
    </SiteShell>
  );
}
