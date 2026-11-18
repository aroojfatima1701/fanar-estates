'use client';
import { SiteShell } from '../components/SiteShell';
import { PageHead } from '../components/PageHead';
import { EnquiryForm } from '../components/EnquiryForm';
import { IconWhatsApp } from '../components/Icons';
import { site } from '../lib/site';

export default function Contact() {
  return (
    <SiteShell>
      <PageHead crumbs={[{ label: 'Contact' }]} title={<>Start with a <em>conversation</em></>} lede="Call, WhatsApp or send a message. The right adviser will reply the same working day." />
      <section className="band">
        <div className="wrap split split--top">
          <div className="contact-info">
            <dl className="contact__ways">
              <div><dt>Call</dt><dd>{site.phone}</dd></div>
              <div><dt>WhatsApp</dt><dd>{site.whatsapp}</dd></div>
              <div><dt>Email</dt><dd>{site.email}</dd></div>
              <div><dt>Office</dt><dd>{site.address}</dd></div>
              <div><dt>Hours</dt><dd>{site.hours}</dd></div>
            </dl>
            <a className="btn btn--wa" href={site.whatsappLink} target="_blank" rel="noopener"><IconWhatsApp width={20} height={20} /> Chat on WhatsApp</a>
            <div className="map-card">
              <span className="eyebrow">Find us</span>
              <p>Dubai Marina, a short walk from DMCC metro station. Visitor parking is available in the building.</p>
              <a className="link-arrow" href="https://maps.google.com/?q=Dubai+Marina" target="_blank" rel="noopener">Open in Google Maps</a>
            </div>
          </div>
          <EnquiryForm source="contact" interestOptions={['Buying', 'Renting', 'Selling', 'Off-plan', 'Property management', 'Golden Visa', 'Something else']} />
        </div>
      </section>
    </SiteShell>
  );
}
