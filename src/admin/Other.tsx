'use client';
import { useState, type FormEvent } from 'react';
import { useAdmin } from './store';
import { sources, stages, type Role } from './data';
import { AgentTag, BarList, Drawer, Kpi, LineChart, Panel, Pill, aedShort } from './ui';
import { agents, articles, testimonials } from '../lib/data';
import { monthlyLeads } from './data';

/* ---------- Off-plan projects ---------- */
export function Projects() {
  const { state, dispatch } = useAdmin();
  const [editId, setEditId] = useState<string | null>(null);
  const editing = state.projects.find((p) => p.id === editId) ?? null;
  return (
    <div className="ascreen">
      <div className="ahead"><div><h1>Off-plan projects</h1><p>{state.projects.length} projects on sale</p></div></div>
      <div className="pgrid">
        {state.projects.map((p) => {
          const soldPct = Math.round((p.unitsSold / p.unitsTotal) * 100);
          return (
            <article key={p.id} className="panel pcardx">
              <img src={p.image} alt="" />
              <div className="pcardx__body">
                <h2>{p.name}</h2>
                <p>{p.developer} · {p.community}</p>
                <dl className="pcardx__terms">
                  <div><dt>From</dt><dd className="tabular">{aedShort(p.fromPriceAed)}</dd></div>
                  <div><dt>Plan</dt><dd>{p.paymentPlan}</dd></div>
                  <div><dt>Handover</dt><dd>{p.handover}</dd></div>
                </dl>
                <div className="meter"><span>Construction</span><div className="meter__track"><i style={{ width: `${p.progressPct}%` }} /></div><b className="tabular">{p.progressPct}%</b></div>
                <div className="meter"><span>Units sold</span><div className="meter__track"><i style={{ width: `${soldPct}%` }} /></div><b className="tabular">{p.unitsSold} / {p.unitsTotal}</b></div>
                <button type="button" className="abtn" onClick={() => setEditId(p.id)}>Edit project</button>
              </div>
            </article>
          );
        })}
      </div>
      {editing && (
        <Drawer title={`Edit ${editing.name}`} onClose={() => setEditId(null)}>
          <form className="aform" onSubmit={(e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const d = new FormData(e.currentTarget);
            dispatch({ type: 'project/save', project: { ...editing, fromPriceAed: Number(d.get('from')), paymentPlan: String(d.get('plan')), handover: String(d.get('handover')), progressPct: Number(d.get('progress')), unitsSold: Number(d.get('sold')) } });
            setEditId(null);
          }}>
            <div className="aform__row">
              <div className="aform__field"><label htmlFor="pj-from">Starting price (AED)</label><input id="pj-from" name="from" type="number" className="ainput" defaultValue={editing.fromPriceAed} /></div>
              <div className="aform__field"><label htmlFor="pj-plan">Payment plan</label><input id="pj-plan" name="plan" className="ainput" defaultValue={editing.paymentPlan} /></div>
            </div>
            <div className="aform__row">
              <div className="aform__field"><label htmlFor="pj-hand">Handover</label><input id="pj-hand" name="handover" className="ainput" defaultValue={editing.handover} /></div>
              <div className="aform__field"><label htmlFor="pj-sold">Units sold</label><input id="pj-sold" name="sold" type="number" min={0} max={editing.unitsTotal} className="ainput" defaultValue={editing.unitsSold} /></div>
            </div>
            <div className="aform__field"><label htmlFor="pj-prog">Construction progress (%)</label><input id="pj-prog" name="progress" type="number" min={0} max={100} className="ainput" defaultValue={editing.progressPct} /></div>
            <div className="aform__actions"><button type="button" className="abtn" onClick={() => setEditId(null)}>Cancel</button><button type="submit" className="abtn abtn--primary">Save changes</button></div>
          </form>
        </Drawer>
      )}
    </div>
  );
}

/* ---------- Team and roles ---------- */
const permissions: { label: string; roles: Role[] }[] = [
  { label: 'See all leads', roles: ['Admin', 'Manager'] },
  { label: 'Reassign leads', roles: ['Admin', 'Manager'] },
  { label: 'Add and edit own listings', roles: ['Admin', 'Manager', 'Adviser'] },
  { label: 'Edit any listing', roles: ['Admin', 'Manager'] },
  { label: 'Edit website content', roles: ['Admin', 'Manager'] },
  { label: 'View reports', roles: ['Admin', 'Manager'] },
  { label: 'Manage team and roles', roles: ['Admin'] },
];

export function Team() {
  const { state, dispatch } = useAdmin();
  const canManage = state.me.role === 'Admin';
  const [invited, setInvited] = useState(false);
  return (
    <div className="ascreen">
      <div className="ahead"><div><h1>Team</h1><p>{agents.length} advisers · roles control what each person sees</p></div></div>
      <div className="agrid">
        <Panel title="Advisers" className="agrid__wide">
          <div className="atable-wrap">
            <table className="atable">
              <thead><tr><th>Name</th><th>Role</th><th>Open leads</th><th>Listings</th><th>Active</th></tr></thead>
              <tbody>
                {agents.map((a) => (
                  <tr key={a.id}>
                    <td><AgentTag id={a.id} /><small>{a.email}</small></td>
                    <td>
                      <label className="sr-only" htmlFor={`role-${a.id}`}>Role for {a.name}</label>
                      <select id={`role-${a.id}`} className="ainput ainput--inline" disabled={!canManage} value={state.roles[a.id]} onChange={(e) => dispatch({ type: 'team/role', id: a.id, role: e.target.value as Role })}>
                        {(['Admin', 'Manager', 'Adviser'] as Role[]).map((r) => <option key={r}>{r}</option>)}
                      </select>
                    </td>
                    <td className="tabular">{state.leads.filter((l) => l.agentId === a.id && l.stage !== 'Won' && l.stage !== 'Lost').length}</td>
                    <td className="tabular">{state.listings.filter((l) => l.agentId === a.id).length}</td>
                    <td><button type="button" className={`switch${state.activeAdvisers[a.id] ? ' is-on' : ''}`} role="switch" aria-checked={state.activeAdvisers[a.id]} aria-label={`${a.name} can sign in`} disabled={!canManage} onClick={() => dispatch({ type: 'team/active', id: a.id, active: !state.activeAdvisers[a.id] })}><span /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!canManage && <p className="panel__foot">Only admins can change roles. Switch to the Admin view in the top bar to try it.</p>}
        </Panel>
        <Panel title="What each role can do" className="agrid__wide">
          <div className="atable-wrap">
            <table className="atable atable--matrix">
              <thead><tr><th>Permission</th><th>Admin</th><th>Manager</th><th>Adviser</th></tr></thead>
              <tbody>
                {permissions.map((p) => (
                  <tr key={p.label}><td>{p.label}</td>{(['Admin', 'Manager', 'Adviser'] as Role[]).map((r) => <td key={r}>{p.roles.includes(r) ? <span className="yes">✓<span className="sr-only">Yes</span></span> : <span className="no">–<span className="sr-only">No</span></span>}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
        <Panel title="Invite an adviser">
          {invited ? <p role="status">Invitation saved. They'll receive a sign-in link by email once the API is connected.</p> : (
            <form className="aform" onSubmit={(e) => { e.preventDefault(); setInvited(true); }}>
              <div className="aform__field"><label htmlFor="inv-email">Work email</label><input id="inv-email" type="email" required className="ainput" /></div>
              <div className="aform__field"><label htmlFor="inv-role">Role</label><select id="inv-role" className="ainput" defaultValue="Adviser"><option>Adviser</option><option>Manager</option><option>Admin</option></select></div>
              <div className="aform__actions"><button type="submit" className="abtn abtn--primary" disabled={!canManage}>Send invite</button></div>
            </form>
          )}
        </Panel>
      </div>
    </div>
  );
}

/* ---------- Website content ---------- */
export function Content() {
  const { state, dispatch } = useAdmin();
  return (
    <div className="ascreen">
      <div className="ahead"><div><h1>Website content</h1><p>Turn homepage sections on or off and manage articles and reviews</p></div></div>
      <div className="agrid">
        <Panel title="Homepage sections">
          <ul className="toggles">
            {Object.entries(state.homeSections).map(([k, on]) => (
              <li key={k}><span>{k}</span><button type="button" className={`switch${on ? ' is-on' : ''}`} role="switch" aria-checked={on} aria-label={`Show ${k}`} onClick={() => dispatch({ type: 'content/section', key: k, on: !on })}><span /></button></li>
            ))}
          </ul>
        </Panel>
        <Panel title="Articles" action={<button type="button" className="abtn">New article</button>}>
          <ul className="alist">
            {articles.map((a) => <li key={a.slug}><img src={a.image} alt="" className="alist__thumb" /><span className="alist__main"><b>{a.title}</b><span>{a.category} · {a.readMinutes} min read</span></span><Pill>Published</Pill></li>)}
          </ul>
        </Panel>
        <Panel title="Client reviews" className="agrid__wide">
          <ul className="alist">
            {testimonials.map((t, i) => <li key={i}><span className="alist__main"><b>“{t.quote.slice(0, 90)}…”</b><span>{t.name} · {t.context}</span></span><Pill>Pending</Pill></li>)}
          </ul>
          <p className="panel__foot">Reviews need written consent from the client before they're published.</p>
        </Panel>
      </div>
    </div>
  );
}

/* ---------- Reports ---------- */
export function Reports() {
  const { state } = useAdmin();
  const leads = state.leads;
  const won = leads.filter((l) => l.stage === 'Won');
  const closed = leads.filter((l) => l.stage === 'Won' || l.stage === 'Lost');
  const bySource = sources.map((s) => {
    const all = leads.filter((l) => l.source === s);
    return { label: s, value: all.length, won: all.filter((l) => l.stage === 'Won').length };
  }).sort((a, b) => b.value - a.value);
  const byAgent = agents.map((a) => ({ label: a.name, value: leads.filter((l) => l.agentId === a.id && l.stage === 'Won').length })).sort((a, b) => b.value - a.value);
  const listingStatus = ['Available', 'Reserved', 'Sold', 'Rented', 'Draft'].map((s) => ({ label: s, value: state.listings.filter((l) => l.status === s).length }));
  const funnel = stages.filter((s) => s !== 'Lost').map((s, i, arr) => ({ label: s, value: leads.filter((l) => arr.indexOf(l.stage as typeof s) >= i).length }));

  return (
    <div className="ascreen">
      <div className="ahead"><div><h1>Reports</h1><p>Last 30 days · sample data</p></div></div>
      <div className="kpis">
        <Kpi label="Leads" value={String(leads.length)} />
        <Kpi label="Deals won" value={String(won.length)} />
        <Kpi label="Win rate" value={`${closed.length ? Math.round((won.length / closed.length) * 100) : 0}%`} note="of closed leads" />
        <Kpi label="Pipeline value" value={aedShort(leads.filter((l) => l.stage !== 'Won' && l.stage !== 'Lost').reduce((n, l) => n + l.budgetAed, 0))} note="open leads' budgets" />
      </div>
      <div className="agrid">
        <Panel title="Leads per month" className="agrid__wide"><LineChart points={monthlyLeads.map((m) => ({ x: m.month, y: m.value }))} label="Leads" partialLast /></Panel>
        <Panel title="Funnel: leads reaching each stage"><BarList rows={funnel} /></Panel>
        <Panel title="Deals won by adviser"><BarList rows={byAgent} /></Panel>
        <Panel title="Leads by source" className="agrid__wide">
          <div className="atable-wrap">
            <table className="atable">
              <thead><tr><th>Source</th><th>Leads</th><th>Won</th><th>Win rate</th><th style={{ width: '40%' }}>Share of leads</th></tr></thead>
              <tbody>
                {bySource.map((s) => (
                  <tr key={s.label}>
                    <td>{s.label}</td><td className="tabular">{s.value}</td><td className="tabular">{s.won}</td>
                    <td className="tabular">{s.value ? Math.round((s.won / s.value) * 100) : 0}%</td>
                    <td><div className="meter meter--bare"><div className="meter__track"><i style={{ width: `${(s.value / leads.length) * 100}%` }} /></div><b className="tabular">{Math.round((s.value / leads.length) * 100)}%</b></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
        <Panel title="Listings by status"><BarList rows={listingStatus} /></Panel>
      </div>
    </div>
  );
}
