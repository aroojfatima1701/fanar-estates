'use client';
import { useState } from 'react';
import { SiteShell } from '../components/SiteShell';
import { PageHead } from '../components/PageHead';
import { articles } from '../lib/data';
import { href } from '../lib/site';

const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

export default function Insights() {
  const cats = ['All', ...Array.from(new Set(articles.map((a) => a.category)))];
  const [cat, setCat] = useState('All');
  const list = articles.filter((a) => cat === 'All' || a.category === cat);
  const [lead, ...rest] = list;

  return (
    <SiteShell>
      <PageHead crumbs={[{ label: 'Insights' }]} title={<>Market notes from <em>the ground</em></>} lede="Prices, rules and practical guides from the people who close deals in Dubai every week.">
        <div className="seg" role="group" aria-label="Filter by category">
          {cats.map((c) => <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)}>{c}</button>)}
        </div>
      </PageHead>
      <section className="band">
        <div className="wrap">
          {lead && (
            <a className="post post--lead" href={href(`/insights/${lead.slug}`)}>
              <div className="post__img"><img src={lead.image.replace('-card.jpg', '.jpg')} alt="" /></div>
              <div className="post__lead-body">
                <div className="post__meta"><span>{lead.category}</span><span>{fmtDate(lead.date)}</span><span>{lead.readMinutes} min read</span></div>
                <h2 className="display">{lead.title}</h2>
                <span className="link-arrow">Read article</span>
              </div>
            </a>
          )}
          {rest.length > 0 && (
            <div className="posts" style={{ marginTop: 56 }}>
              {rest.map((a) => (
                <a className="post" key={a.slug} href={href(`/insights/${a.slug}`)}>
                  <div className="post__img"><img src={a.image} alt="" loading="lazy" /></div>
                  <div className="post__meta"><span>{a.category}</span><span>{fmtDate(a.date)}</span><span>{a.readMinutes} min read</span></div>
                  <h3>{a.title}</h3>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>
    </SiteShell>
  );
}
