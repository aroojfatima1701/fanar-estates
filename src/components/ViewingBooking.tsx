'use client';
import { useEffect, useState, type FormEvent } from 'react';

const slots = ['10:00', '11:30', '13:00', '15:00', '16:30', '18:00'];

// Lets a visitor pick a day and time for a viewing. Posts to POST /api/viewings once the API is connected.
export function ViewingBooking({ propertyTitle, agentName }: { propertyTitle: string; agentName: string }) {
  const [days, setDays] = useState<Date[]>([]);
  const [day, setDay] = useState(0);
  const [slot, setSlot] = useState('');
  const [name, setName] = useState('');
  const [sent, setSent] = useState(false);

  // Dates are computed in the browser so the server render and the visitor's calendar agree.
  useEffect(() => {
    const out: Date[] = [];
    const d = new Date();
    while (out.length < 7) {
      d.setDate(d.getDate() + 1);
      if (d.getDay() !== 6) out.push(new Date(d)); // offices closed on Saturday
    }
    setDays(out);
  }, []);

  const fmt = (d: Date) => ({
    wd: d.toLocaleDateString('en-GB', { weekday: 'short' }),
    dm: d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
  });

  const submit = (e: FormEvent) => { e.preventDefault(); if (slot) setSent(true); };

  if (sent && days[day]) {
    const f = fmt(days[day]);
    return (
      <div className="book" role="status">
        <span className="eyebrow">Viewing requested</span>
        <h3>{f.wd} {f.dm} at {slot}</h3>
        <p>{agentName} will confirm by WhatsApp within the hour{name ? `, ${name.split(' ')[0]}` : ''}. Please bring your passport or Emirates ID.</p>
        <button className="text-btn" type="button" onClick={() => setSent(false)}>Change time</button>
      </div>
    );
  }

  return (
    <form className="book" onSubmit={submit} aria-label={`Book a viewing of ${propertyTitle}`}>
      <h3>Book a viewing</h3>
      <fieldset>
        <legend className="sr-only">Day</legend>
        <div className="book__days">
          {days.length === 0 && <span className="book__loading">Loading dates…</span>}
          {days.map((d, i) => {
            const f = fmt(d);
            return (
              <button key={i} type="button" aria-pressed={i === day} onClick={() => setDay(i)}>
                <span>{f.wd}</span><b>{f.dm}</b>
              </button>
            );
          })}
        </div>
      </fieldset>
      <fieldset>
        <legend className="sr-only">Time</legend>
        <div className="book__slots">
          {slots.map((s) => <button key={s} type="button" aria-pressed={slot === s} onClick={() => setSlot(s)}>{s}</button>)}
        </div>
      </fieldset>
      <div className="field">
        <label htmlFor="b-name">Your name</label>
        <input id="b-name" required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="field">
        <label htmlFor="b-phone">Phone or WhatsApp</label>
        <input id="b-phone" type="tel" required autoComplete="tel" placeholder="+971" />
      </div>
      <button className="btn btn--navy" type="submit" disabled={!slot}>{slot ? `Request ${slot} viewing` : 'Choose a time'}</button>
    </form>
  );
}
