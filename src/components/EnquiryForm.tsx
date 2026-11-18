'use client';
import { useState, type FormEvent } from 'react';

// General enquiry form. Posts to POST /api/leads with the given source once the API is connected.
export function EnquiryForm({ source, interestOptions, cta = 'Send enquiry', defaultMessage = '', thanks }: {
  source: string;
  interestOptions?: string[];
  cta?: string;
  defaultMessage?: string;
  thanks?: string;
}) {
  const [sent, setSent] = useState(false);
  const [name, setName] = useState('');
  const id = (f: string) => `${source}-${f}`;
  const submit = (e: FormEvent) => { e.preventDefault(); setSent(true); };

  if (sent) {
    return (
      <div className="form" role="status">
        <div className="form__ok">
          <span className="eyebrow">Message received</span>
          <h3>Thank you{name ? `, ${name.split(' ')[0]}` : ''}.</h3>
          <p style={{ margin: 0, color: 'var(--stone)' }}>{thanks ?? 'The right adviser will reply today, by WhatsApp or email, whichever you prefer.'}</p>
        </div>
        <button className="btn btn--line" type="button" onClick={() => setSent(false)}>Send another message</button>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={submit}>
      <div className="form__row">
        <div className="field">
          <label htmlFor={id('name')}>Full name</label>
          <input id={id('name')} required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor={id('phone')}>Phone or WhatsApp</label>
          <input id={id('phone')} type="tel" required autoComplete="tel" placeholder="+971" />
        </div>
      </div>
      <div className="form__row">
        <div className="field">
          <label htmlFor={id('email')}>Email</label>
          <input id={id('email')} type="email" required autoComplete="email" />
        </div>
        {interestOptions && (
          <div className="field">
            <label htmlFor={id('interest')}>I'm interested in</label>
            <select id={id('interest')} defaultValue={interestOptions[0]}>
              {interestOptions.map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
        )}
      </div>
      <div className="field">
        <label htmlFor={id('message')}>Message</label>
        <textarea id={id('message')} defaultValue={defaultMessage} />
      </div>
      <button className="btn btn--navy" type="submit">{cta}</button>
      <small>We reply within one working day and never share your details.</small>
    </form>
  );
}
