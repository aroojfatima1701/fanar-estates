'use client';
import { SiteShell } from '../components/SiteShell';
import { PageHead } from '../components/PageHead';
import { PropertyCard } from '../components/PropertyCard';
import { IconArrow } from '../components/Icons';
import { communities, properties } from '../lib/data';
import { communityDetails } from '../lib/content';
import { href } from '../lib/site';

// /communities/[slug]
export default function Community({ slug }: { slug: string }) {
  const c = communities.find((x) => x.slug === slug) ?? communities[0];
  const d = communityDetails[c.slug];
  const listings = properties.filter((p) => p.community === c.name);
  const big = c.image.replace('-card.jpg', '.jpg');

  return (
    <SiteShell>
      <PageHead crumbs={[{ label: 'Communities', route: '/communities' }, { label: c.name }]} title={<>{c.name}</>} lede={c.tagline} image={big}>
        <dl className="head-terms">
          <div><dt>Avg price</dt><dd className="tabular">AED {c.avgPricePerSqftAed.toLocaleString('en-US')} / sq ft</dd></div>
          <div><dt>Gross yield</dt><dd className="tabular">{c.grossYieldPct}%</dd></div>
        </dl>
      </PageHead>

      <section className="band">
        <div className="wrap community">
          <div className="community__main">
            <p className="lede lede--big">{d.intro}</p>
            <div className="why why--3">
              {d.highlights.map((h) => (<div key={h.title}><h3>{h.title}</h3><p>{h.text}</p></div>))}
            </div>
          </div>
          <aside className="community__side">
            <div>
              <h3>Best for</h3>
              <div className="chips">{d.bestFor.map((b) => <span key={b}>{b}</span>)}</div>
            </div>
            <div>
              <h3>Typical rents</h3>
              <p>{d.rentRange}</p>
            </div>
            <div>
              <h3>Drive times</h3>
              <dl className="drive">{d.nearby.map((n) => <div key={n.place}><dt>{n.place}</dt><dd className="tabular">{n.time}</dd></div>)}</dl>
            </div>
          </aside>
        </div>
      </section>

      <section className="band band--pearl">
        <div className="wrap">
          <div className="section-head">
            <div><span className="eyebrow">Available now</span><h2 className="display">Homes in <em>{c.name}</em></h2></div>
            <a className="link-arrow" href={href(`/buy?q=${encodeURIComponent(c.name)}`)}>Search {c.name} <IconArrow /></a>
          </div>
          {listings.length ? (
            <div className="cards cards--3">{listings.map((p) => <PropertyCard key={p.id} p={p} />)}</div>
          ) : (
            <p className="lede">No homes listed here right now. Ask us about off-market options.</p>
          )}
        </div>
      </section>
    </SiteShell>
  );
}
