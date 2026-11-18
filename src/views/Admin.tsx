'use client';
import { useEffect, useState } from 'react';
import { AdminStore, useAdmin } from '../admin/store';
import { Dashboard } from '../admin/Dashboard';
import { Listings } from '../admin/Listings';
import { Leads } from '../admin/Leads';
import { Viewings } from '../admin/Viewings';
import { Content, Projects, Reports, Team } from '../admin/Other';
import { AgentAvatar } from '../components/AgentAvatar';
import { agentById } from '../lib/data';
import { href, site } from '../lib/site';
import type { Role } from '../admin/data';

const sections = [
  { id: 'dashboard', label: 'Dashboard', roles: ['Admin', 'Manager', 'Adviser'] },
  { id: 'leads', label: 'Leads', roles: ['Admin', 'Manager', 'Adviser'] },
  { id: 'listings', label: 'Listings', roles: ['Admin', 'Manager', 'Adviser'] },
  { id: 'viewings', label: 'Viewings', roles: ['Admin', 'Manager', 'Adviser'] },
  { id: 'projects', label: 'Off-plan projects', roles: ['Admin', 'Manager'] },
  { id: 'team', label: 'Team', roles: ['Admin', 'Manager'] },
  { id: 'content', label: 'Website content', roles: ['Admin', 'Manager'] },
  { id: 'reports', label: 'Reports', roles: ['Admin', 'Manager'] },
] as const;
type SectionId = typeof sections[number]['id'];

// Demo sign-ins to show how roles change the panel.
const personas: { agentId: string; role: Role; label: string }[] = [
  { agentId: 'a1', role: 'Admin', label: 'Layla · Admin' },
  { agentId: 'a2', role: 'Manager', label: 'Omar · Manager' },
  { agentId: 'a3', role: 'Adviser', label: 'Sara · Adviser' },
];

// The admin panel: /admin (in Next.js, app/admin/[[...section]]/page.tsx behind Laravel Sanctum auth).
export default function Admin() {
  return <AdminStore><AdminApp /></AdminStore>;
}

function AdminApp() {
  const { state, dispatch } = useAdmin();
  const [section, setSection] = useState<SectionId>('dashboard');
  const [menuOpen, setMenuOpen] = useState(false);
  const allowed = sections.filter((s) => (s.roles as readonly string[]).includes(state.me.role));

  useEffect(() => {
    const read = () => {
      const h = window.location.hash.replace('#', '') as SectionId;
      if (sections.some((s) => s.id === h)) setSection(h);
    };
    read();
    window.addEventListener('hashchange', read);
    return () => window.removeEventListener('hashchange', read);
  }, []);

  useEffect(() => {
    if (!allowed.some((s) => s.id === section)) setSection('dashboard');
  }, [state.me.role]); // eslint-disable-line react-hooks/exhaustive-deps

  const go = (id: string) => {
    setSection(id as SectionId);
    setMenuOpen(false);
    try { history.replaceState(null, '', `#${id}`); } catch { /* hash routing unavailable */ }
    window.scrollTo(0, 0);
  };
  const me = agentById(state.me.agentId);
  const newLeads = state.leads.filter((l) => l.stage === 'New' && (state.me.role !== 'Adviser' || l.agentId === state.me.agentId)).length;

  return (
    <div className="admin">
      <aside className={`aside${menuOpen ? ' is-open' : ''}`} aria-label="Admin navigation">
        <div className="aside__brand">
          <span className="logo__ar" lang="ar" dir="rtl">{site.nameAr}</span>
          <span className="logo__rule" aria-hidden />
          <span className="aside__name">FANAR <small>Admin</small></span>
        </div>
        <nav className="aside__nav">
          {allowed.map((s) => (
            <a key={s.id} href={`#${s.id}`} aria-current={section === s.id ? 'page' : undefined} onClick={(e) => { e.preventDefault(); go(s.id); }}>
              {s.label}
              {s.id === 'leads' && newLeads > 0 && <span className="aside__count tabular">{newLeads}</span>}
            </a>
          ))}
        </nav>
        <div className="aside__foot">
          <a href={href('/')}>View website</a>
          <button type="button" onClick={() => dispatch({ type: 'reset' })}>Reset demo data</button>
        </div>
      </aside>
      {menuOpen && <div className="aside-scrim" onClick={() => setMenuOpen(false)} aria-hidden />}

      <div className="amain">
        <header className="atop">
          <button type="button" className="icon-btn atop__menu" aria-label="Open menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}>☰</button>
          <span className="atop__demo">Demo admin · sample data</span>
          <div className="atop__right">
            <label htmlFor="persona" className="atop__label">Signed in as</label>
            <select id="persona" className="ainput ainput--inline" value={`${state.me.agentId}|${state.me.role}`}
              onChange={(e) => { const [agentId, role] = e.target.value.split('|'); dispatch({ type: 'me', agentId, role: role as Role }); }}>
              {personas.map((p) => <option key={p.agentId} value={`${p.agentId}|${p.role}`}>{p.label}</option>)}
            </select>
            <AgentAvatar agent={me} className="atop__avatar" alt={false} />
          </div>
        </header>
        <main className="acontent" id="admin-main">
          {section === 'dashboard' && <Dashboard go={go} />}
          {section === 'leads' && <Leads />}
          {section === 'listings' && <Listings />}
          {section === 'viewings' && <Viewings />}
          {section === 'projects' && <Projects />}
          {section === 'team' && <Team />}
          {section === 'content' && <Content />}
          {section === 'reports' && <Reports />}
        </main>
      </div>
    </div>
  );
}

