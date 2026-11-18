'use client';
import { SiteShell } from '../components/SiteShell';
import { PropertyCard } from '../components/PropertyCard';
import { AgentAvatar } from '../components/AgentAvatar';
import { EnquiryForm } from '../components/EnquiryForm';
import { IconWhatsApp } from '../components/Icons';
import { agentById, properties } from '../lib/data';
import { agentBios } from '../lib/content';
import { href } from '../lib/site';

// /team/[id]
export default function Agent({ id }: { id: string }) {
  const a = agentById(id);
  const listings = properties.filter((p) => p.agentId === a.id);
  const first = a.name.split(' ')[0];
  const wa = `https://wa.me/${a.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${first}, I found you on the Fanar Estates website.`)}`;

  return (
    <SiteShell>
      <section className="band agent-hero">
        <div className="wrap agent-hero__in">
          <AgentAvatar agent={a} className="agent-hero__photo" />
          <div className="agent-hero__text">
            <nav className="crumbs" aria-label="Breadcrumb"><a href={href('/')}>Home</a><span>/</span><a href={href('/team')}>Our team</a><span>/</span><span>{a.name}</span></nav>
            <span className="agent__role">{a.role}</span>
            <h1 className="display">{a.name}</h1>
            <p className="lede">{agentBios[a.id]}</p>
            <dl className="drive">
              <div><dt>Specialises in</dt><dd>{a.specialty}</dd></div>
              <div><dt>Languages</dt><dd>{a.languages.join(', ')}</dd></div>
              <div><dt>Phone</dt><dd className="tabular" style={{ userSelect: 'all' }}>{a.phone}</dd></div>
              <div><dt>Email</dt><dd style={{ userSelect: 'all' }}>{a.email}</dd></div>
            </dl>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <a className="btn btn--wa" href={wa} target="_blank" rel="noopener"><IconWhatsApp width={20} height={20} /> WhatsApp {first}</a>
              <a className="btn btn--line" href="#message">Send a message</a>
            </div>
          </div>
        </div>
      </section>
      <section className="band band--pearl">
        <div className="wrap">
          <div className="section-head"><div><span className="eyebrow">Listings</span><h2 className="display">{first}'s <em>homes</em></h2></div></div>
          {listings.length ? <div className="cards cards--3">{listings.map((p) => <PropertyCard key={p.id} p={p} />)}</div> : <p className="lede">No active listings right now.</p>}
        </div>
      </section>
      <section className="band" id="message">
        <div className="wrap split">
          <div className="split__copy">
            <span className="eyebrow">Contact</span>
            <h2 className="display">Message <em>{first}</em></h2>
            <p className="lede">Tell {first} what you're looking for, your budget and when you plan to move.</p>
          </div>
          <EnquiryForm source={`agent-${a.id}`} interestOptions={['Buying', 'Renting', 'Selling', 'Off-plan', 'Property management']} />
        </div>
      </section>
    </SiteShell>
  );
}
