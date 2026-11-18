'use client';
import { useAdmin, useScoped } from './store';
import { DEMO_TODAY, monthlyLeads, sources, stages } from './data';
import { AgentTag, BarList, Kpi, LineChart, Panel, Pill, aedShort, fmtDay } from './ui';
import { agentById, properties } from '../lib/data';

const daysAgo = (iso: string) => Math.round((Date.parse(DEMO_TODAY) - Date.parse(iso)) / 86_400_000);

export function Dashboard({ go }: { go: (s: string) => void }) {
  const { state } = useAdmin();
  const { leads, listings, viewings } = useScoped();
  const newThisWeek = leads.filter((l) => daysAgo(l.createdOn) < 7).length;
  const active = listings.filter((l) => l.status === 'Available' || l.status === 'Reserved').length;
  const upcoming = viewings.filter((v) => v.date >= DEMO_TODAY && v.status !== 'Done').sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  const closed = leads.filter((l) => l.stage === 'Won' || l.stage === 'Lost');
  const conversion = closed.length ? Math.round((leads.filter((l) => l.stage === 'Won').length / closed.length) * 100) : 0;
  const pipeline = stages.filter((s) => s !== 'Lost').map((s) => ({ label: s, value: leads.filter((l) => l.stage === s).length }));
  const bySource = sources.map((s) => ({ label: s, value: leads.filter((l) => l.source === s).length })).sort((a, b) => b.value - a.value);
  const top = [...listings].sort((a, b) => b.enquiries - a.enquiries).slice(0, 5);
  const fresh = [...leads].sort((a, b) => b.createdOn.localeCompare(a.createdOn) || b.id.localeCompare(a.id)).slice(0, 6);

  return (
    <div className="ascreen">
      <div className="ahead">
        <div>
          <h1>Good morning, {agentById(state.me.agentId).name.split(' ')[0]}</h1>
          <p>{fmtDay(DEMO_TODAY, { weekday: 'long', day: 'numeric', month: 'long' })} · {state.me.role === 'Adviser' ? 'your leads and listings' : 'whole agency'}</p>
        </div>
        <div className="ahead__actions">
          <button type="button" className="abtn" onClick={() => go('leads')}>Open pipeline</button>
          <button type="button" className="abtn abtn--primary" onClick={() => go('listings')}>Add listing</button>
        </div>
      </div>

      <div className="kpis">
        <Kpi label="New leads this week" value={String(newThisWeek)} note="18% vs last week" trend="up" />
        <Kpi label="Active listings" value={String(active)} note={`${listings.filter((l) => l.status === 'Reserved').length} reserved`} />
        <Kpi label="Viewings coming up" value={String(upcoming.length)} note={`${upcoming.filter((v) => v.status === 'Pending').length} awaiting confirmation`} />
        <Kpi label="Win rate" value={`${conversion}%`} note="of closed leads, last 30 days" />
      </div>

      <div className="agrid">
        <Panel title="Leads per month" className="agrid__wide">
          <LineChart points={monthlyLeads.map((m) => ({ x: m.month, y: m.value }))} label="Leads" partialLast />
          <p className="panel__foot">Dashed line: November so far, to the 11th.</p>
        </Panel>
        <Panel title="Pipeline" action={<button type="button" className="alink" onClick={() => go('leads')}>View board</button>}>
          <BarList rows={pipeline} />
        </Panel>
        <Panel title="Leads by source">
          <BarList rows={bySource} />
        </Panel>
        <Panel title="Upcoming viewings" action={<button type="button" className="alink" onClick={() => go('viewings')}>Calendar</button>}>
          <ul className="alist">
            {upcoming.slice(0, 5).map((v) => {
              const p = properties.find((x) => x.id === v.propertyId);
              const lead = state.leads.find((l) => l.id === v.leadId);
              return (
                <li key={v.id}>
                  <span className="alist__when tabular">{fmtDay(v.date, { weekday: 'short', day: 'numeric' })}<b>{v.time}</b></span>
                  <span className="alist__main"><b>{lead?.name}</b><span>{p?.title}, {p?.community}</span></span>
                  <Pill>{v.status}</Pill>
                </li>
              );
            })}
            {upcoming.length === 0 && <li className="alist__empty">No viewings booked.</li>}
          </ul>
        </Panel>
        <Panel title="Most enquired listings">
          <ul className="alist">
            {top.map((l) => (
              <li key={l.id}>
                <img src={l.image} alt="" className="alist__thumb" />
                <span className="alist__main"><b>{l.title}</b><span>{l.community} · {aedShort(l.priceAed)}{l.purpose === 'rent' ? ' / yr' : ''}</span></span>
                <span className="alist__num tabular">{l.enquiries}<small>enquiries</small></span>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Newest leads" className="agrid__wide" action={<button type="button" className="alink" onClick={() => go('leads')}>All leads</button>}>
          <div className="atable-wrap">
            <table className="atable">
              <thead><tr><th>Name</th><th>Interest</th><th>Budget</th><th>Source</th><th>Adviser</th><th>Stage</th><th>Received</th></tr></thead>
              <tbody>
                {fresh.map((l) => (
                  <tr key={l.id}>
                    <td><b>{l.name}</b><small>{l.nationality}</small></td>
                    <td>{l.interest}</td>
                    <td className="tabular">{aedShort(l.budgetAed)}</td>
                    <td>{l.source}</td>
                    <td><AgentTag id={l.agentId} short /></td>
                    <td><Pill>{l.stage}</Pill></td>
                    <td className="tabular">{daysAgo(l.createdOn) === 0 ? 'Today' : `${daysAgo(l.createdOn)}d ago`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </div>
  );
}
