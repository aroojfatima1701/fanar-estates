'use client';
import { SiteShell } from '../components/SiteShell';
import { PageHead } from '../components/PageHead';
import { EnquiryForm } from '../components/EnquiryForm';
import { services } from '../lib/content';
import { href } from '../lib/site';

// /services/[slug]: Golden Visa and Property management
export default function Service({ slug }: { slug: string }) {
  const s = services[slug] ?? services['golden-visa'];
  return (
    <SiteShell>
      <PageHead crumbs={[{ label: 'Services' }, { label: `${s.title} ${s.titleEm}` }]} title={<>{s.title} <em>{s.titleEm}</em></>} lede={s.intro} />
      <section className="band">
        <div className="wrap">
          <div className="section-head"><div><span className="eyebrow">How it works</span><h2 className="display">Step by <em>step</em></h2></div></div>
          <ol className="steps steps--4">
            {s.steps.map((st, i) => (
              <li key={st.title}><span className="steps__n tabular">{String(i + 1).padStart(2, '0')}</span><h3>{st.title}</h3><p>{st.text}</p></li>
            ))}
          </ol>
        </div>
      </section>
      <section className="band band--pearl">
        <div className="wrap split split--top">
          <div>
            <span className="eyebrow">Questions</span>
            <h2 className="display" style={{ fontSize: 'var(--step-4)', margin: '14px 0 28px' }}>Good to <em>know</em></h2>
            <div className="faq">
              {s.faq.map((f) => (
                <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>
              ))}
            </div>
            {slug === 'golden-visa' && <p style={{ marginTop: 24 }}><a href={href('/buy')}>Browse eligible homes</a></p>}
          </div>
          <EnquiryForm source={`service-${slug}`} cta="Talk to an adviser" defaultMessage={slug === 'golden-visa' ? 'I would like to know which properties qualify for the Golden Visa.' : 'I would like a quote to manage my property.'} />
        </div>
      </section>
    </SiteShell>
  );
}
