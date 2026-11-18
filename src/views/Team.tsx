'use client';
import { SiteShell } from '../components/SiteShell';
import { PageHead } from '../components/PageHead';
import { AgentAvatar } from '../components/AgentAvatar';
import { agents, properties } from '../lib/data';
import { agentBios } from '../lib/content';
import { href } from '../lib/site';

export default function Team() {
  return (
    <SiteShell>
      <PageHead
        crumbs={[{ label: 'Our team' }]}
        title={<>People who know <em>every street</em></>}
        lede="Each adviser specialises in a handful of communities, so you get answers from someone who sells there every week."
      />
      <section className="band">
        <div className="wrap team">
          {agents.map((a) => {
            const count = properties.filter((p) => p.agentId === a.id).length;
            return (
              <div className="agent" key={a.id}>
                <AgentAvatar agent={a} />
                <span className="agent__role">{a.role}</span>
                <h3><a href={href(`/team/${a.id}`)} style={{ textDecoration: 'none' }}>{a.name}</a></h3>
                <p>{agentBios[a.id]}</p>
                <p className="tabular">{a.languages.join(', ')} · {count} {count === 1 ? 'listing' : 'listings'}</p>
                <div className="agent__actions"><a href={href(`/team/${a.id}`)}>Profile and listings</a></div>
              </div>
            );
          })}
        </div>
      </section>
      <section className="band band--pearl">
        <div className="wrap split">
          <div className="split__copy">
            <span className="eyebrow">Careers</span>
            <h2 className="display">Join <em>Fanar</em></h2>
            <p className="lede">We hire RERA-certified advisers who would rather give honest advice than chase a quick deal. Send your CV and the communities you know best.</p>
          </div>
          <a className="btn btn--navy" href={href('/contact')} style={{ justifySelf: 'start' }}>Get in touch</a>
        </div>
      </section>
    </SiteShell>
  );
}
