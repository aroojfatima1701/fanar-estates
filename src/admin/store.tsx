'use client';
import { createContext, useContext, useEffect, useReducer, type ReactNode } from 'react';
import { seedLeads, seedListings, seedProjects, seedViewings, teamRoles, type AdminListing, type Lead, type Role, type Stage, type Viewing } from './data';

// Admin state for the demo. In production each action is an API call (PATCH /api/admin/leads/{id} and so on);
// here changes are kept in the browser so the demo can be clicked through and reset.
type Project = typeof seedProjects[number];
export interface State {
  listings: AdminListing[]; leads: Lead[]; viewings: Viewing[]; projects: Project[];
  roles: Record<string, Role>; activeAdvisers: Record<string, boolean>;
  homeSections: Record<string, boolean>;
  me: { agentId: string; role: Role };
}

type Action =
  | { type: 'listing/save'; listing: AdminListing }
  | { type: 'listing/delete'; id: string }
  | { type: 'listing/toggleFeatured'; id: string }
  | { type: 'lead/stage'; id: string; stage: Stage }
  | { type: 'lead/assign'; id: string; agentId: string }
  | { type: 'lead/note'; id: string; text: string; by: string; on: string }
  | { type: 'lead/add'; lead: Lead }
  | { type: 'viewing/add'; viewing: Viewing }
  | { type: 'viewing/status'; id: string; status: Viewing['status'] }
  | { type: 'project/save'; project: Project }
  | { type: 'team/role'; id: string; role: Role }
  | { type: 'team/active'; id: string; active: boolean }
  | { type: 'content/section'; key: string; on: boolean }
  | { type: 'me'; agentId: string; role: Role }
  | { type: 'reset' }
  | { type: 'load'; state: State };

export const initialState = (): State => ({
  listings: seedListings, leads: seedLeads, viewings: seedViewings, projects: seedProjects,
  roles: { ...teamRoles }, activeAdvisers: { a1: true, a2: true, a3: true, a4: true },
  homeSections: { 'Hero video slideshow': true, 'Stats bar': true, 'Featured properties': true, 'Services': true, 'Off-plan launches': true, 'Communities': true, 'Valuation form': true, 'Golden Visa strip': true, 'Advisers': true, 'Client stories': true, 'Insights': true },
  me: { agentId: 'a1', role: 'Admin' },
});

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case 'listing/save': {
      const exists = s.listings.some((l) => l.id === a.listing.id);
      return { ...s, listings: exists ? s.listings.map((l) => (l.id === a.listing.id ? a.listing : l)) : [a.listing, ...s.listings] };
    }
    case 'listing/delete': return { ...s, listings: s.listings.filter((l) => l.id !== a.id) };
    case 'listing/toggleFeatured': return { ...s, listings: s.listings.map((l) => (l.id === a.id ? { ...l, featured: !l.featured } : l)) };
    case 'lead/stage': return { ...s, leads: s.leads.map((l) => (l.id === a.id ? { ...l, stage: a.stage } : l)) };
    case 'lead/assign': return { ...s, leads: s.leads.map((l) => (l.id === a.id ? { ...l, agentId: a.agentId } : l)) };
    case 'lead/note': return { ...s, leads: s.leads.map((l) => (l.id === a.id ? { ...l, notes: [{ on: a.on, text: a.text, by: a.by }, ...l.notes] } : l)) };
    case 'lead/add': return { ...s, leads: [a.lead, ...s.leads] };
    case 'viewing/add': return { ...s, viewings: [...s.viewings, a.viewing] };
    case 'viewing/status': return { ...s, viewings: s.viewings.map((v) => (v.id === a.id ? { ...v, status: a.status } : v)) };
    case 'project/save': return { ...s, projects: s.projects.map((p) => (p.id === a.project.id ? a.project : p)) };
    case 'team/role': return { ...s, roles: { ...s.roles, [a.id]: a.role } };
    case 'team/active': return { ...s, activeAdvisers: { ...s.activeAdvisers, [a.id]: a.active } };
    case 'content/section': return { ...s, homeSections: { ...s.homeSections, [a.key]: a.on } };
    case 'me': return { ...s, me: { agentId: a.agentId, role: a.role } };
    case 'reset': return initialState();
    case 'load': return a.state;
  }
}

const KEY = 'fanar-admin-demo-v1';
const Ctx = createContext<{ state: State; dispatch: (a: Action) => void }>({ state: initialState(), dispatch: () => {} });

export function AdminStore({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  useEffect(() => {
    try { const raw = window.localStorage.getItem(KEY); if (raw) dispatch({ type: 'load', state: { ...initialState(), ...JSON.parse(raw) } }); } catch { /* start fresh */ }
  }, []);
  useEffect(() => {
    try { window.localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* storage unavailable */ }
  }, [state]);
  return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>;
}

export const useAdmin = () => useContext(Ctx);

// What the signed-in person may see: advisers only see their own leads, listings and viewings.
export function useScoped() {
  const { state } = useAdmin();
  const own = state.me.role === 'Adviser';
  const mine = <T extends { agentId: string }>(rows: T[]) => (own ? rows.filter((r) => r.agentId === state.me.agentId) : rows);
  return { leads: mine(state.leads), listings: mine(state.listings), viewings: mine(state.viewings), own };
}
