'use client';
import { useState, type FormEvent } from 'react';
import { useAdmin, useScoped } from './store';
import { DEMO_TODAY, sources, stages, type Lead, type Stage } from './data';
import { AgentTag, Drawer, Pill, aed, aedShort, fmtDay } from './ui';
import { agentById, agents, properties } from '../lib/data';

export function Leads() {
  const { state, dispatch } = useAdmin();
  const { leads, own } = useScoped();
  const [view, setView] = useState<'board' | 'list'>('board');
  const [q, setQ] = useState('');
  const [source, setSource] = useState('');
  const [agent, setAgent] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overStage, setOverStage] = useState<Stage | null>(null);

  const rows = leads.filter((l) =>
    (!q || `${l.name} ${l.email} ${l.phone} ${l.interest}`.toLowerCase().includes(q.toLowerCase())) &&
    (!source || l.source === source) && (!agent || l.agentId === agent));
  const open = state.leads.find((l) => l.id === openId) ?? null;
  const move = (id: string, stage: Stage) => dispatch({ type: 'lead/stage', id, stage });

  return (
    <div className="ascreen">
      <div className="ahead">
        <div><h1>Leads</h1><p>{leads.length} leads · {leads.filter((l) => l.stage === 'New').length} new, waiting for first contact</p></div>
        <div className="ahead__actions">
          <div className="aseg" role="group" aria-label="View">
            <button type="button" aria-pressed={view === 'board'} onClick={() => setView('board')}>Board</button>
            <button type="button" aria-pressed={view === 'list'} onClick={() => setView('list')}>List</button>
          </div>
          <button type="button" className="abtn abtn--primary" onClick={() => setAdding(true)}>Add lead</button>
        </div>
      </div>

      <div className="afilters">
        <label className="sr-only" htmlFor="ld-q">Search leads</label>
        <input id="ld-q" className="ainput" placeholder="Search name, phone, email or interest" value={q} onChange={(e) => setQ(e.target.value)} />
        <label className="sr-only" htmlFor="ld-src">Source</label>
        <select id="ld-src" className="ainput" value={source} onChange={(e) => setSource(e.target.value)}><option value="">All sources</option>{sources.map((s) => <option key={s}>{s}</option>)}</select>
        {!own && (<>
          <label className="sr-only" htmlFor="ld-agent">Adviser</label>
          <select id="ld-agent" className="ainput" value={agent} onChange={(e) => setAgent(e.target.value)}><option value="">All advisers</option>{agents.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}</select>
        </>)}
      </div>

      {view === 'board' ? (
        <div className="board" aria-label="Lead pipeline">
          {stages.map((st) => {
            const col = rows.filter((l) => l.stage === st);
            const value = col.reduce((n, l) => n + l.budgetAed, 0);
            return (
              <section key={st} className={`board__col${overStage === st ? ' is-over' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setOverStage(st); }}
                onDragLeave={() => setOverStage((s) => (s === st ? null : s))}
                onDrop={(e) => { e.preventDefault(); if (dragId) move(dragId, st); setDragId(null); setOverStage(null); }}>
                <header className="board__head"><h2><Pill>{st}</Pill></h2><span className="tabular">{col.length} · {aedShort(value)}</span></header>
                <div className="board__cards">
                  {col.map((l) => (
                    <article key={l.id} className="lcard" draggable onDragStart={() => setDragId(l.id)} onDragEnd={() => setDragId(null)}>
                      <button type="button" className="lcard__open" onClick={() => setOpenId(l.id)}>
                        <b>{l.name}</b>
                        <span>{l.interest} · {aedShort(l.budgetAed)}</span>
                      </button>
                      <div className="lcard__meta"><AgentTag id={l.agentId} short /><span>{l.source}</span></div>
                      <label className="sr-only" htmlFor={`mv-${l.id}`}>Move {l.name} to stage</label>
                      <select id={`mv-${l.id}`} className="lcard__move" value={l.stage} onChange={(e) => move(l.id, e.target.value as Stage)}>
                        {stages.map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </article>
                  ))}
                  {col.length === 0 && <p className="board__empty">Drop a lead here</p>}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <div className="panel">
          <div className="atable-wrap">
            <table className="atable">
              <thead><tr><th>Name</th><th>Contact</th><th>Interest</th><th>Budget</th><th>Source</th><th>Adviser</th><th>Stage</th><th>Received</th></tr></thead>
              <tbody>
                {rows.map((l) => (
                  <tr key={l.id} className="atable__click" onClick={() => setOpenId(l.id)}>
                    <td><button type="button" className="alink alink--strong" onClick={() => setOpenId(l.id)}>{l.name}</button><small>{l.nationality}</small></td>
                    <td><small className="tabular">{l.phone}</small><small>{l.email}</small></td>
                    <td>{l.interest}</td>
                    <td className="tabular">{aedShort(l.budgetAed)}</td>
                    <td>{l.source}</td>
                    <td><AgentTag id={l.agentId} short /></td>
                    <td><Pill>{l.stage}</Pill></td>
                    <td className="tabular">{fmtDay(l.createdOn)}</td>
                  </tr>
                ))}
                {rows.length === 0 && <tr><td colSpan={8} className="atable__empty">No leads match these filters.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {open && <LeadDrawer lead={open} canReassign={!own} onClose={() => setOpenId(null)} />}
      {adding && <AddLead agentId={state.me.agentId} onClose={() => setAdding(false)} onAdd={(lead) => { dispatch({ type: 'lead/add', lead }); setAdding(false); }} />}
    </div>
  );
}

function LeadDrawer({ lead, canReassign, onClose }: { lead: Lead; canReassign: boolean; onClose: () => void }) {
  const { state, dispatch } = useAdmin();
  const [note, setNote] = useState('');
  const p = properties.find((x) => x.id === lead.propertyId);
  const viewings = state.viewings.filter((v) => v.leadId === lead.id);
  const wa = `https://wa.me/${lead.phone.replace(/\D/g, '')}`;
  const addNote = (e: FormEvent) => { e.preventDefault(); if (!note.trim()) return; dispatch({ type: 'lead/note', id: lead.id, text: note.trim(), by: state.me.agentId, on: DEMO_TODAY }); setNote(''); };

  return (
    <Drawer title={lead.name} onClose={onClose}>
      <div className="lead">
        <div className="lead__top">
          <Pill>{lead.stage}</Pill>
          <span className="lead__id">{lead.id} · {lead.source} · {fmtDay(lead.createdOn, { day: 'numeric', month: 'long' })}</span>
        </div>
        <dl className="lead__facts">
          <div><dt>Phone</dt><dd className="tabular">{lead.phone}</dd></div>
          <div><dt>Email</dt><dd>{lead.email}</dd></div>
          <div><dt>Nationality</dt><dd>{lead.nationality}</dd></div>
          <div><dt>Interest</dt><dd>{lead.interest}</dd></div>
          <div><dt>Budget</dt><dd className="tabular">{aed(lead.budgetAed)}</dd></div>
          <div><dt>Property</dt><dd>{p ? `${p.title}, ${p.community}` : 'Not linked'}</dd></div>
        </dl>
        <div className="lead__actions">
          <a className="abtn abtn--wa" href={wa} target="_blank" rel="noopener">WhatsApp</a>
          <label className="sr-only" htmlFor="lead-stage">Stage</label>
          <select id="lead-stage" className="ainput" value={lead.stage} onChange={(e) => dispatch({ type: 'lead/stage', id: lead.id, stage: e.target.value as Stage })}>{stages.map((s) => <option key={s}>{s}</option>)}</select>
          <label className="sr-only" htmlFor="lead-agent">Adviser</label>
          <select id="lead-agent" className="ainput" value={lead.agentId} disabled={!canReassign} onChange={(e) => dispatch({ type: 'lead/assign', id: lead.id, agentId: e.target.value })}>{agents.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}</select>
        </div>
        {viewings.length > 0 && (
          <div className="lead__block">
            <h3>Viewings</h3>
            <ul className="alist">{viewings.map((v) => <li key={v.id}><span className="alist__main"><b>{fmtDay(v.date, { weekday: 'short', day: 'numeric', month: 'short' })} at {v.time}</b><span>{properties.find((x) => x.id === v.propertyId)?.title}</span></span><Pill>{v.status}</Pill></li>)}</ul>
          </div>
        )}
        <div className="lead__block">
          <h3>Notes</h3>
          <form className="note-form" onSubmit={addNote}>
            <label className="sr-only" htmlFor="lead-note">Add a note</label>
            <textarea id="lead-note" className="ainput" rows={2} placeholder="Add a note, e.g. called, sent shortlist" value={note} onChange={(e) => setNote(e.target.value)} />
            <button type="submit" className="abtn">Add note</button>
          </form>
          <ul className="notes">
            {lead.notes.map((n, i) => <li key={i}><p>{n.text}</p><small>{agentById(n.by).name} · {fmtDay(n.on)}</small></li>)}
            {lead.notes.length === 0 && <li className="alist__empty">No notes yet.</li>}
          </ul>
        </div>
      </div>
    </Drawer>
  );
}

function AddLead({ agentId, onClose, onAdd }: { agentId: string; onClose: () => void; onAdd: (l: Lead) => void }) {
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    onAdd({
      id: `L${Date.now().toString().slice(-4)}`, name: String(d.get('name')), phone: String(d.get('phone')), email: String(d.get('email')),
      nationality: String(d.get('nationality') || 'Not given'), interest: String(d.get('interest')), budgetAed: Number(d.get('budget') || 0),
      source: d.get('source') as Lead['source'], stage: 'New', agentId: String(d.get('agent') || agentId), createdOn: DEMO_TODAY, notes: [],
    });
  };
  return (
    <Drawer title="Add lead" onClose={onClose}>
      <form className="aform" onSubmit={submit}>
        <div className="aform__field"><label htmlFor="n-name">Full name</label><input id="n-name" name="name" className="ainput" required /></div>
        <div className="aform__row">
          <div className="aform__field"><label htmlFor="n-phone">Phone</label><input id="n-phone" name="phone" className="ainput" type="tel" required placeholder="+971" /></div>
          <div className="aform__field"><label htmlFor="n-email">Email</label><input id="n-email" name="email" className="ainput" type="email" /></div>
        </div>
        <div className="aform__row">
          <div className="aform__field"><label htmlFor="n-int">Interest</label><select id="n-int" name="interest" className="ainput">{['Buy apartment', 'Buy villa', 'Off-plan', 'Rent apartment', 'Rent villa', 'Sell', 'Golden Visa', 'Property management'].map((i) => <option key={i}>{i}</option>)}</select></div>
          <div className="aform__field"><label htmlFor="n-budget">Budget (AED)</label><input id="n-budget" name="budget" className="ainput" type="number" min={0} /></div>
        </div>
        <div className="aform__row">
          <div className="aform__field"><label htmlFor="n-src">Source</label><select id="n-src" name="source" className="ainput">{sources.map((s) => <option key={s}>{s}</option>)}</select></div>
          <div className="aform__field"><label htmlFor="n-agent">Adviser</label><select id="n-agent" name="agent" className="ainput" defaultValue={agentId}>{agents.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}</select></div>
        </div>
        <div className="aform__field"><label htmlFor="n-nat">Nationality</label><input id="n-nat" name="nationality" className="ainput" /></div>
        <div className="aform__actions"><button type="button" className="abtn" onClick={onClose}>Cancel</button><button type="submit" className="abtn abtn--primary">Add lead</button></div>
      </form>
    </Drawer>
  );
}
