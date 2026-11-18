'use client';
import { SiteShell } from '../components/SiteShell';
import { PageHead } from '../components/PageHead';
import { EnquiryForm } from '../components/EnquiryForm';
import { AgentAvatar } from '../components/AgentAvatar';
import { ProjectCard } from '../components/ProjectCard';
import { IconWhatsApp } from '../components/Icons';
import { agentById, projects } from '../lib/data';
import { projectDetails } from '../lib/content';
import { formatPrice, usePreferences } from '../lib/preferences';

// /off-plan/[slug]
export default function Project({ slug }: { slug: string }) {
  const { currency } = usePreferences();
  const o = projects.find((p) => p.slug === slug) ?? projects[0];
  const d = projectDetails[o.slug];
  const agent = agentById(d.agentId);
  const others = projects.filter((p) => p.id !== o.id);
  const wa = `https://wa.me/${agent.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${agent.name.split(' ')[0]}, please send me the brochure and price list for ${o.name}.`)}`;

  return (
    <SiteShell>
      <PageHead
        crumbs={[{ label: 'Off-plan', route: '/off-plan' }, { label: o.name }]}
        title={<>{o.name}</>}
        lede={`${o.developer} · ${o.community} · ${d.launch}`}
        image={o.image}
      >
        <dl className="head-terms">
          <div><dt>From</dt><dd className="tabular">{formatPrice(o.fromPriceAed, currency, true)}</dd></div>
          <div><dt>Payment plan</dt><dd>{o.paymentPlan}</dd></div>
          <div><dt>Handover</dt><dd>{o.handover}</dd></div>
        </dl>
      </PageHead>

      <section className="band">
        <div className="wrap prop">
          <div className="prop__main">
            <div className="prop__section">
              <h2>About the project</h2>
              <p className="prop__desc">{d.description}</p>
            </div>

            <div className="prop__section">
              <h2>Construction progress</h2>
              <div className="progress" role="img" aria-label={`${d.progressPct}% complete`}>
                <span style={{ width: `${d.progressPct}%` }} />
              </div>
              <p className="prop__area tabular">{d.progressPct}% complete · handover expected {o.handover}</p>
            </div>

            <div className="prop__section">
              <h2>Payment plan · {o.paymentPlan}</h2>
              <ol className="plan">
                {d.milestones.map((m) => (
                  <li key={m.label}>
                    <b className="tabular">{m.pct}%</b>
                    <span>{m.label}</span>
                    <small>{m.when}</small>
                  </li>
                ))}
              </ol>
              <p className="prop__area">Payments are made into a DLD-registered escrow account. A 4% DLD registration fee is due on booking.</p>
            </div>

            <div className="prop__section">
              <h2>Unit types and prices</h2>
              <div className="table-wrap">
                <table className="units">
                  <thead><tr><th scope="col">Unit</th><th scope="col">Size (sq ft)</th><th scope="col">Starting price</th></tr></thead>
                  <tbody>
                    {d.units.map((u) => (
                      <tr key={u.type}><td>{u.type}</td><td className="tabular">{u.sizeSqft}</td><td className="tabular">{formatPrice(u.fromAed, currency)}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="prop__section">
              <h2>Amenities</h2>
              <ul className="features">{d.amenities.map((a) => <li key={a}>{a}</li>)}</ul>
            </div>
          </div>

          <aside className="prop__side" id="contact-adviser" aria-label="Request the brochure">
            <div className="agent-card">
              <AgentAvatar agent={agent} className="agent-card__photo" />
              <div>
                <span className="agent__role">{agent.role}</span>
                <h3>{agent.name}</h3>
                <p>Speaks {agent.languages.join(', ')}</p>
              </div>
            </div>
            <a className="btn btn--wa" href={wa} target="_blank" rel="noopener"><IconWhatsApp width={20} height={20} /> Brochure on WhatsApp</a>
            <EnquiryForm source={`project-${o.slug}`} interestOptions={d.units.map((u) => u.type)} cta="Request brochure and prices" thanks="The brochure, floor plans and latest price list are on their way to your email." />
          </aside>
        </div>
      </section>

      {others.length > 0 && (
        <section className="band band--pearl">
          <div className="wrap">
            <div className="section-head"><div><span className="eyebrow">More launches</span><h2 className="display">Other <em>projects</em></h2></div></div>
            <div className="projects">{others.map((p) => <ProjectCard key={p.id} o={p} />)}</div>
          </div>
        </section>
      )}
    </SiteShell>
  );
}
