'use client';
import { SiteShell } from '../components/SiteShell';
import { PageHead } from '../components/PageHead';
import { ValuationForm } from '../components/ValuationForm';
import { media } from '../lib/site';

const steps = [
  { title: 'Free valuation', text: 'We price your home from recent sales in your building, not from asking prices on the portals.' },
  { title: 'Form A and permit', text: 'We sign the RERA listing agreement (Form A) with you and obtain the DLD advertising permit.' },
  { title: 'Photography and launch', text: 'Professional photos, video and a floor plan, then your home goes live to our buyer list and the main portals.' },
  { title: 'Viewings and offers', text: 'We qualify every buyer before a viewing and negotiate on your behalf.' },
  { title: 'Transfer', text: 'We manage the MOU (Form F), the bank, the NOC from the developer and the transfer at the DLD trustee office.' },
];

const why = [
  { title: '21 days', text: 'Typical time from listing to accepted offer.' },
  { title: 'Buyer list', text: 'Qualified buyers from the UK, Europe, the Gulf and South Asia, many looking off-market.' },
  { title: 'One adviser', text: 'The same person from valuation to transfer, available on WhatsApp.' },
];

// The process names Dubai's real paperwork (Form A, Form F, NOC) so sellers see that we know it.
export default function Sell() {
  return (
    <SiteShell>
      <PageHead
        crumbs={[{ label: 'Sell' }]}
        title={<>Sell with <em>confidence</em></>}
        lede="An honest valuation, a strong launch and an adviser who stays with you until the keys change hands."
        image={media('properties/villa-modern-minimal.jpg')}
      />
      <section className="band band--navy on-dark" id="valuation">
        <div className="wrap valuation">
          <div className="valuation__copy">
            <span className="eyebrow">Step one</span>
            <h2 className="display" style={{ fontSize: 'var(--step-4)' }}>What is your home <em>worth today?</em></h2>
            <p className="lede">Share a few details and an adviser will call you within one working day with a valuation range and recent comparable sales.</p>
            <div className="why why--3 why--dark">{why.map((w) => (<div key={w.title}><h3>{w.title}</h3><p>{w.text}</p></div>))}</div>
          </div>
          <ValuationForm />
        </div>
      </section>
      <section className="band">
        <div className="wrap">
          <div className="section-head"><div><span className="eyebrow">How selling works</span><h2 className="display">Five steps to <em>sold</em></h2></div></div>
          <ol className="steps">
            {steps.map((s, i) => (
              <li key={s.title}>
                <span className="steps__n tabular">{String(i + 1).padStart(2, '0')}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </SiteShell>
  );
}
