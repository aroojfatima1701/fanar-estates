'use client';
import { useState, type FormEvent } from 'react';
import { href, nav, site } from '../lib/site';
import { communities } from '../lib/data';
import { Logo } from './Logo';
import { IconWhatsApp } from './Icons';

export function Footer() {
  const [joined, setJoined] = useState(false);
  const join = (e: FormEvent) => { e.preventDefault(); setJoined(true); };

  return (
    <>
      <footer className="footer">
        <div className="wrap">
          <div className="footer__grid">
            <div className="footer__brand">
              <Logo />
              <p>Luxury homes, off-plan investments and property management across Dubai.</p>
              {joined ? (
                <p role="status" style={{ color: 'var(--lantern)' }}>You're on the list for our monthly market notes.</p>
              ) : (
                <form className="news" onSubmit={join} aria-label="Newsletter">
                  <label className="sr-only" htmlFor="news-email">Email address</label>
                  <input id="news-email" type="email" required placeholder="Email for monthly market notes" />
                  <button className="btn btn--gold" type="submit">Join</button>
                </form>
              )}
            </div>
            <div>
              <h4>Explore</h4>
              <ul>{nav.map((n) => <li key={n.route}><a href={href(n.route)}>{n.label}</a></li>)}<li><a href={href('/team')}>Our team</a></li><li><a href={href('/insights')}>Insights</a></li></ul>
            </div>
            <div>
              <h4>Communities</h4>
              <ul>{communities.map((c) => <li key={c.slug}><a href={href(`/communities/${c.slug}`)}>{c.name}</a></li>)}</ul>
            </div>
            <div>
              <h4>Contact</h4>
              <ul>
                <li>{site.address}</li>
                <li>{site.phone}</li>
                <li>{site.email}</li>
                <li>{site.hours}</li>
              </ul>
            </div>
          </div>
          <div className="footer__legal">
            <span>© 2026 Fanar Estates · RERA ORN {site.reraOrn}</span>
            <span>Concept project designed and built by Arooj Fatima · <a href={href('/admin')}>Admin panel demo</a></span>
          </div>
        </div>
      </footer>
      <a className="wa" href={site.whatsappLink} target="_blank" rel="noopener" aria-label={`Chat on WhatsApp, ${site.whatsapp}`}>
        <IconWhatsApp />
      </a>
    </>
  );
}
