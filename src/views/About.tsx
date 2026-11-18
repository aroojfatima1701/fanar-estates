'use client';
import { SiteShell } from '../components/SiteShell';
import { PageHead } from '../components/PageHead';
import { AgentAvatar } from '../components/AgentAvatar';
import { agents, stats } from '../lib/data';
import { href, media } from '../lib/site';

const values = [
  { title: 'Honest advice', text: 'We tell you when a property is overpriced or a project is risky, even if it costs us the deal.' },
  { title: 'Local depth', text: 'Each adviser covers a few communities and knows them building by building.' },
  { title: 'One point of contact', text: 'The same adviser from the first call to the transfer, reachable on WhatsApp.' },
];

export default function About() {
  return (
    <SiteShell>
      <PageHead
        crumbs={[{ label: 'About' }]}
        title={<>A lighthouse for <em>finding home</em></>}
        lede="Fanar means lighthouse in Arabic. We started the agency to give buyers, sellers and investors in Dubai a steady, honest guide."
        image={media('hero/hero-1-downtown-skyline-poster.jpg')}
      />
      <section className="stats" aria-label="Fanar in numbers">
        <div className="wrap stats__grid">
          {stats.map((s) => (<div className="stat" key={s.label}><b className="tabular">{s.value}</b><span>{s.label}</span></div>))}
        </div>
      </section>
      <section className="band">
        <div className="wrap split">
          <div className="split__copy">
            <span className="eyebrow">Our story</span>
            <h2 className="display">Built on <em>straight answers</em></h2>
          </div>
          <div className="prose">
            <p>Dubai moves fast, and buying here can feel like guesswork: new launches every week, prices that change by the month and rules that differ from home. Fanar was founded to make those decisions clearer.</p>
            <p>We focus on a small number of communities and know them in depth, from which towers have the best management to which developers deliver on time. That focus is why most of our clients come back, or send their friends.</p>
            <p>Today our advisers speak eight languages and work with buyers from more than forty countries, but the promise is the same as on day one: honest advice, and one person who stays with you until you have the keys.</p>
          </div>
        </div>
      </section>
      <section className="band band--pearl">
        <div className="wrap">
          <div className="section-head"><div><span className="eyebrow">What we stand for</span><h2 className="display">Three <em>promises</em></h2></div></div>
          <div className="why why--3">{values.map((v) => (<div key={v.title}><h3>{v.title}</h3><p>{v.text}</p></div>))}</div>
        </div>
      </section>
      <section className="band">
        <div className="wrap">
          <div className="section-head"><div><span className="eyebrow">Leadership</span><h2 className="display">The <em>team</em></h2></div><a className="link-arrow" href={href('/team')}>Meet everyone</a></div>
          <div className="team">
            {agents.map((a) => (
              <div className="agent" key={a.id}>
                <AgentAvatar agent={a} />
                <span className="agent__role">{a.role}</span>
                <h3>{a.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="band band--navy on-dark">
        <div className="wrap split">
          <div className="split__copy">
            <span className="eyebrow">Licensed and regulated</span>
            <h2 className="display">Registered with <em>RERA</em></h2>
          </div>
          <div className="prose prose--dark">
            <p>Fanar Estates is a RERA-registered brokerage (ORN [00000]). Every adviser holds a valid RERA broker card, and every listing carries its DLD advertising permit.</p>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
