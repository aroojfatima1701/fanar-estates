'use client';
import { useState, type FormEvent } from 'react';
import { communities } from '../lib/data';

// Posts to the Laravel API (POST /api/leads, source "valuation") once the backend is connected.
// In the preview it shows the confirmation without sending anything.
export function ValuationForm() {
  const [sent, setSent] = useState(false);
  const [name, setName] = useState('');

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
  };

  if (sent) {
    return (
      <div className="form" role="status">
        <div className="form__ok">
          <span className="eyebrow">Request received</span>
          <h3>Thank you{name ? `, ${name.split(' ')[0]}` : ''}.</h3>
          <p style={{ margin: 0, color: 'var(--stone)' }}>An adviser who covers your community will call you within one working day with a valuation range and recent comparable sales.</p>
        </div>
        <button className="btn btn--line" type="button" onClick={() => setSent(false)}>Value another property</button>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={submit} aria-label="Request a free valuation">
      <div className="form__row">
        <div className="field">
          <label htmlFor="val-type">Property type</label>
          <select id="val-type" required defaultValue="">
            <option value="" disabled>Select</option>
            <option>Apartment</option><option>Villa</option><option>Townhouse</option><option>Penthouse</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="val-beds">Bedrooms</label>
          <select id="val-beds" required defaultValue="">
            <option value="" disabled>Select</option>
            <option>Studio</option>{[1, 2, 3, 4, 5, 6].map((b) => <option key={b}>{b}{b === 6 ? '+' : ''}</option>)}
          </select>
        </div>
      </div>
      <div className="field">
        <label htmlFor="val-community">Community or building</label>
        <input id="val-community" list="val-communities" required placeholder="e.g. Dubai Marina, Marina Gate 1" />
        <datalist id="val-communities">{communities.map((c) => <option key={c.slug} value={c.name} />)}</datalist>
      </div>
      <div className="form__row">
        <div className="field">
          <label htmlFor="val-name">Your name</label>
          <input id="val-name" required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="val-phone">Phone or WhatsApp</label>
          <input id="val-phone" type="tel" required autoComplete="tel" placeholder="+971" />
        </div>
      </div>
      <button className="btn btn--navy" type="submit">Get my free valuation</button>
      <small>No obligation. We use your details only to contact you about this valuation.</small>
    </form>
  );
}
