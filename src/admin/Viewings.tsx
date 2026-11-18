'use client';
import { useState, type FormEvent } from 'react';
import { useAdmin, useScoped } from './store';
import { agentColor, DEMO_TODAY, timeSlots, weekDays, type Viewing } from './data';
import { Drawer, Pill, fmtDay } from './ui';
import { agentById, agents, properties } from '../lib/data';

// Week view: days across, time slots down. Colour plus the adviser's name identifies who is attending.
export function Viewings() {
  const { state, dispatch } = useAdmin();
  const { viewings, own } = useScoped();
  const [openId, setOpenId] = useState<string | null>(null);
  const [adding, setAdding] = useState<{ date: string; time: string } | null>(null);
  const open = state.viewings.find((v) => v.id === openId) ?? null;
  const leadName = (id: string) => state.leads.find((l) => l.id === id)?.name ?? 'Unknown';

  return (
    <div className="ascreen">
      <div className="ahead">
        <div><h1>Viewings</h1><p>Week of {fmtDay(weekDays[0], { day: 'numeric', month: 'long' })} · {viewings.length} viewings · offices closed Saturday</p></div>
        <div className="ahead__actions"><button type="button" className="abtn abtn--primary" onClick={() => setAdding({ date: DEMO_TODAY, time: '10:00' })}>Book viewing</button></div>
      </div>
      {!own && (
        <ul className="legend" aria-label="Advisers">
          {agents.map((a) => <li key={a.id}><span style={{ background: agentColor[a.id] }} aria-hidden />{a.name}</li>)}
        </ul>
      )}
      <div className="panel">
        <div className="cal-wrap">
          <div className="cal" style={{ gridTemplateColumns: `72px repeat(${weekDays.length}, minmax(120px, 1fr))` }}>
            <div className="cal__corner" />
            {weekDays.map((d) => (
              <div key={d} className={`cal__day${d === DEMO_TODAY ? ' is-today' : ''}`}>
                <span>{fmtDay(d, { weekday: 'short' })}</span><b className="tabular">{fmtDay(d, { day: 'numeric' })}</b>
              </div>
            ))}
            {timeSlots.map((t) => (
              <div key={t} style={{ display: 'contents' }}>
                <div className="cal__time tabular">{t}</div>
                {weekDays.map((d) => {
                  const here = viewings.filter((v) => v.date === d && v.time === t);
                  return (
                    <div key={d + t} className={`cal__cell${d < DEMO_TODAY ? ' is-past' : ''}`}>
                      {here.map((v) => {
                        const p = properties.find((x) => x.id === v.propertyId);
                        return (
                          <button key={v.id} type="button" className="vblock" style={{ ['--c' as string]: agentColor[v.agentId] }} onClick={() => setOpenId(v.id)}>
                            <b>{leadName(v.leadId)}</b>
                            <span>{p?.title}</span>
                            <small>{agentById(v.agentId).name.split(' ')[0]} · {v.status}</small>
                          </button>
                        );
                      })}
                      {here.length === 0 && d >= DEMO_TODAY && (
                        <button type="button" className="cal__add" aria-label={`Book a viewing on ${fmtDay(d, { weekday: 'long', day: 'numeric', month: 'long' })} at ${t}`} onClick={() => setAdding({ date: d, time: t })}>+</button>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {open && (
        <Drawer title="Viewing" onClose={() => setOpenId(null)}>
          <div className="lead">
            <div className="lead__top"><Pill>{open.status}</Pill><span className="lead__id">{fmtDay(open.date, { weekday: 'long', day: 'numeric', month: 'long' })} at {open.time}</span></div>
            <dl className="lead__facts">
              <div><dt>Client</dt><dd>{leadName(open.leadId)}</dd></div>
              <div><dt>Property</dt><dd>{properties.find((x) => x.id === open.propertyId)?.title}</dd></div>
              <div><dt>Adviser</dt><dd>{agentById(open.agentId).name}</dd></div>
            </dl>
            <div className="lead__actions">
              {(['Pending', 'Confirmed', 'Done'] as const).map((s) => (
                <button key={s} type="button" className={`abtn${open.status === s ? ' abtn--primary' : ''}`} aria-pressed={open.status === s} onClick={() => dispatch({ type: 'viewing/status', id: open.id, status: s })}>{s === 'Done' ? 'Mark done' : s}</button>
              ))}
            </div>
          </div>
        </Drawer>
      )}
      {adding && (
        <BookViewing slot={adding} ownAgent={own ? state.me.agentId : null} onClose={() => setAdding(null)}
          onSave={(v) => { dispatch({ type: 'viewing/add', viewing: v }); setAdding(null); }} />
      )}
    </div>
  );
}

function BookViewing({ slot, ownAgent, onClose, onSave }: { slot: { date: string; time: string }; ownAgent: string | null; onClose: () => void; onSave: (v: Viewing) => void }) {
  const { leads } = useScoped();
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    onSave({ id: `V${Date.now().toString().slice(-4)}`, leadId: String(d.get('lead')), propertyId: String(d.get('property')), agentId: ownAgent ?? String(d.get('agent')), date: String(d.get('date')), time: String(d.get('time')), status: 'Pending' });
  };
  return (
    <Drawer title="Book a viewing" onClose={onClose}>
      <form className="aform" onSubmit={submit}>
        <div className="aform__field"><label htmlFor="v-lead">Client</label><select id="v-lead" name="lead" className="ainput">{leads.filter((l) => l.stage !== 'Lost' && l.stage !== 'Won').map((l) => <option key={l.id} value={l.id}>{l.name} · {l.interest}</option>)}</select></div>
        <div className="aform__field"><label htmlFor="v-prop">Property</label><select id="v-prop" name="property" className="ainput">{properties.map((p) => <option key={p.id} value={p.id}>{p.title}, {p.community}</option>)}</select></div>
        <div className="aform__row">
          <div className="aform__field"><label htmlFor="v-date">Day</label><select id="v-date" name="date" className="ainput" defaultValue={slot.date}>{weekDays.filter((d) => d >= DEMO_TODAY).map((d) => <option key={d} value={d}>{fmtDay(d, { weekday: 'short', day: 'numeric', month: 'short' })}</option>)}</select></div>
          <div className="aform__field"><label htmlFor="v-time">Time</label><select id="v-time" name="time" className="ainput" defaultValue={slot.time}>{timeSlots.map((t) => <option key={t}>{t}</option>)}</select></div>
        </div>
        {!ownAgent && <div className="aform__field"><label htmlFor="v-agent">Adviser</label><select id="v-agent" name="agent" className="ainput">{agents.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}</select></div>}
        <p className="aform__hint">The client gets a WhatsApp confirmation once the API is connected.</p>
        <div className="aform__actions"><button type="button" className="abtn" onClick={onClose}>Cancel</button><button type="submit" className="abtn abtn--primary">Book viewing</button></div>
      </form>
    </Drawer>
  );
}
