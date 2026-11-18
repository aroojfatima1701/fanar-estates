'use client';
import { SiteShell } from '../components/SiteShell';
import { PageHead } from '../components/PageHead';
import { communities, properties } from '../lib/data';
import { communityDetails } from '../lib/content';
import { href, media } from '../lib/site';

export default function Communities() {
  return (
    <SiteShell>
      <PageHead
        crumbs={[{ label: 'Communities' }]}
        title={<>Find the right <em>neighbourhood</em></>}
        lede="Guides to the areas we know best: what it's like to live there, typical prices and rents, and what's nearby."
        image={media('communities/community-dubai-marina.jpg')}
      />
      <section className="band">
        <div className="wrap guide-list">
          {communities.map((c, i) => {
            const d = communityDetails[c.slug];
            const count = properties.filter((p) => p.community === c.name).length;
            return (
              <a key={c.slug} className={`guide-row${i % 2 ? ' guide-row--flip' : ''}`} href={href(`/communities/${c.slug}`)}>
                <div className="guide-row__img"><img src={c.image} alt={c.name} loading="lazy" /></div>
                <div className="guide-row__body">
                  <span className="eyebrow">{d.bestFor.join(' · ')}</span>
                  <h2 className="display">{c.name}</h2>
                  <p>{d.intro}</p>
                  <dl className="guide-row__nums tabular">
                    <div><dt>Avg price</dt><dd>AED {c.avgPricePerSqftAed.toLocaleString('en-US')} / sq ft</dd></div>
                    <div><dt>Gross yield</dt><dd>{c.grossYieldPct}%</dd></div>
                    <div><dt>Listings</dt><dd>{count}</dd></div>
                  </dl>
                  <span className="link-arrow">Read the guide</span>
                </div>
              </a>
            );
          })}
          <p className="note">Prices and yields are indicative.</p>
        </div>
      </section>
    </SiteShell>
  );
}
