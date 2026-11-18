'use client';
import { SiteShell } from '../components/SiteShell';
import { PageHead } from '../components/PageHead';
import { ProjectCard } from '../components/ProjectCard';
import { EnquiryForm } from '../components/EnquiryForm';
import { projects } from '../lib/data';
import { media } from '../lib/site';

const why = [
  { title: 'Pay in stages', text: 'Typically 10 to 20% on booking, with the rest spread across construction and handover.' },
  { title: 'Protected by escrow', text: 'Your payments sit in a DLD-regulated escrow account and are released only as the building rises.' },
  { title: 'Launch pricing', text: 'Early buyers usually pay less than the price of the same unit at completion.' },
  { title: 'Honest shortlists', text: 'We only recommend developers with a record of delivering on time.' },
];

export default function OffPlan() {
  return (
    <SiteShell>
      <PageHead
        crumbs={[{ label: 'Off-plan' }]}
        title={<>New projects, <em>early access</em></>}
        lede="Launches from Dubai's established developers, with payment plans, handover dates and our honest view of each one."
        image={media('off-plan/offplan-tower-view.jpg')}
      />
      <section className="band">
        <div className="wrap">
          <div className="projects">{projects.map((o) => <ProjectCard key={o.id} o={o} />)}</div>
        </div>
      </section>
      <section className="band band--pearl">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="eyebrow">Why buy off-plan</span>
              <h2 className="display">Buy early, pay <em>over time</em></h2>
            </div>
          </div>
          <div className="why">
            {why.map((w) => (<div key={w.title}><h3>{w.title}</h3><p>{w.text}</p></div>))}
          </div>
        </div>
      </section>
      <section className="band">
        <div className="wrap split">
          <div className="split__copy">
            <span className="eyebrow">Launch list</span>
            <h2 className="display">Hear about launches <em>before they open</em></h2>
            <p className="lede">Tell us your budget and preferred communities. Omar, our off-plan specialist, will send you floor plans and prices as soon as a project is announced.</p>
          </div>
          <EnquiryForm source="offplan-list" interestOptions={['Investment', 'Home to live in', 'Both']} cta="Join the launch list" />
        </div>
      </section>
    </SiteShell>
  );
}
