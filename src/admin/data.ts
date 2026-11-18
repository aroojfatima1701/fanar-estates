// Sample data for the admin panel demo. In production every list here comes from the Laravel API:
// GET /api/admin/leads, /api/admin/viewings, /api/admin/listings, ... with the signed-in user's role applied.
import { agents, projects, properties } from '../lib/data';
import type { OffPlanProject, Property } from '../lib/types';

export const DEMO_TODAY = '2026-11-11'; // fixed so the demo always looks the same

export type ListingStatus = 'Available' | 'Reserved' | 'Sold' | 'Rented' | 'Draft';
export interface AdminListing extends Property { status: ListingStatus; views: number; enquiries: number }

const statusFor = (p: Property, i: number): ListingStatus =>
  i === 5 ? 'Reserved' : i === 8 ? 'Draft' : 'Available';

export const seedListings: AdminListing[] = properties.map((p, i) => ({
  ...p, status: statusFor(p, i), views: [1840, 960, 1320, 1110, 540, 870, 610, 790, 300, 720, 650, 410, 380, 260][i] ?? 300,
  enquiries: [34, 22, 27, 19, 9, 14, 8, 17, 4, 15, 12, 6, 7, 5][i] ?? 3,
}));

export const seedProjects: (OffPlanProject & { progressPct: number; unitsTotal: number; unitsSold: number })[] = projects.map((o, i) => ({
  ...o, progressPct: [35, 12][i] ?? 0, unitsTotal: [312, 186][i] ?? 100, unitsSold: [204, 61][i] ?? 0,
}));

export const stages = ['New', 'Contacted', 'Viewing', 'Negotiating', 'Won', 'Lost'] as const;
export type Stage = typeof stages[number];
export const sources = ['Website form', 'WhatsApp', 'Property Finder', 'Bayut', 'Referral', 'Valuation form'] as const;
export type Source = typeof sources[number];

export interface Lead {
  id: string; name: string; phone: string; email: string; nationality: string;
  interest: string; budgetAed: number; source: Source; stage: Stage; agentId: string;
  propertyId?: string; createdOn: string; notes: { on: string; text: string; by: string }[];
}

const people: [string, string, string][] = [
  ['James Whitmore', 'United Kingdom', 'Buy villa'], ['Aisha Al Mansoori', 'UAE', 'Buy apartment'], ['Rohan Mehta', 'India', 'Off-plan'],
  ['Elena Petrova', 'Russia', 'Buy penthouse'], ['Bilal Chaudhry', 'Pakistan', 'Off-plan'], ['Sophie Laurent', 'France', 'Rent apartment'],
  ['Khalid Rahman', 'Saudi Arabia', 'Buy villa'], ['Hannah Becker', 'Germany', 'Rent villa'], ['Daniel O\'Connor', 'Ireland', 'Sell'],
  ['Mei Lin', 'China', 'Buy apartment'], ['Omar Farouk', 'Egypt', 'Rent apartment'], ['Priya Nair', 'India', 'Buy apartment'],
  ['Lucas Silva', 'Brazil', 'Rent apartment'], ['Fatima Zahra', 'Morocco', 'Golden Visa'], ['Tom Harris', 'United Kingdom', 'Property management'],
  ['Yusuf Kaya', 'Turkey', 'Off-plan'], ['Anna Kowalski', 'Poland', 'Buy apartment'], ['Hamza Sheikh', 'Pakistan', 'Buy villa'],
  ['Chloe Martin', 'Canada', 'Rent villa'], ['Ivan Novak', 'Croatia', 'Sell'], ['Sara Haddad', 'Lebanon', 'Buy apartment'],
  ['Michael Chen', 'Singapore', 'Off-plan'], ['Noura Al Suwaidi', 'UAE', 'Sell'], ['David Cohen', 'United States', 'Golden Visa'],
];
const stagePlan: Stage[] = ['New', 'New', 'New', 'New', 'New', 'Contacted', 'Contacted', 'Contacted', 'Contacted', 'Viewing', 'Viewing', 'Viewing', 'Viewing', 'Negotiating', 'Negotiating', 'Negotiating', 'Won', 'Won', 'Won', 'Won', 'Lost', 'Lost', 'Contacted', 'New'];
const sourcePlan: Source[] = ['Website form', 'WhatsApp', 'Property Finder', 'WhatsApp', 'Website form', 'Bayut', 'Referral', 'Property Finder', 'Valuation form', 'WhatsApp', 'Website form', 'Property Finder', 'Bayut', 'Referral', 'Website form', 'WhatsApp', 'Referral', 'Property Finder', 'Website form', 'Valuation form', 'Bayut', 'WhatsApp', 'Valuation form', 'Website form'];
const budgets = [38_000_000, 2_900_000, 1_500_000, 9_800_000, 2_300_000, 185_000, 15_000_000, 360_000, 3_200_000, 1_700_000, 140_000, 2_850_000, 72_000, 2_100_000, 120_000, 2_400_000, 1_000_000, 24_000_000, 520_000, 3_400_000, 1_650_000, 2_200_000, 6_500_000, 2_500_000];
const agentPlan = ['a1', 'a3', 'a2', 'a4', 'a2', 'a4', 'a1', 'a4', 'a1', 'a3', 'a4', 'a3', 'a4', 'a1', 'a4', 'a2', 'a3', 'a1', 'a4', 'a1', 'a4', 'a2', 'a3', 'a1'];
const propPlan = ['p1', 'p2', 'p8', 'p4', 'p8', 'r1', 'p3', 'r3', undefined, 'p5', 'r2', 'p2', 'r5', 'p7', undefined, 'p8', 'p9', 'p6', 'r4', undefined, 'p5', 'p8', undefined, 'p3'];
const dayOffset = [0, 0, 1, 1, 2, 2, 3, 4, 4, 5, 6, 6, 7, 8, 9, 10, 12, 15, 18, 21, 9, 14, 3, 1];

const minusDays = (iso: string, n: number) => { const d = new Date(`${iso}T09:00:00Z`); d.setUTCDate(d.getUTCDate() - n); return d.toISOString().slice(0, 10); };

export const seedLeads: Lead[] = people.map(([name, nationality, interest], i) => ({
  id: `L${1040 + i}`, name, nationality, interest, budgetAed: budgets[i], source: sourcePlan[i], stage: stagePlan[i], agentId: agentPlan[i],
  propertyId: propPlan[i], createdOn: minusDays(DEMO_TODAY, dayOffset[i]),
  phone: `+971 5${i % 10} ${String(100 + i * 7).padStart(3, '0')} ${String(1000 + i * 37).slice(-4)}`,
  email: `${name.toLowerCase().replace(/[^a-z]+/g, '.')}@example.com`,
  notes: i % 3 === 0 ? [{ on: minusDays(DEMO_TODAY, Math.max(0, dayOffset[i] - 1)), text: 'Called, prefers WhatsApp. Sending shortlist.', by: agentPlan[i] }] : [],
}));

export interface Viewing { id: string; leadId: string; propertyId: string; agentId: string; date: string; time: string; status: 'Confirmed' | 'Pending' | 'Done' }
const wk = ['2026-11-09', '2026-11-10', '2026-11-11', '2026-11-12', '2026-11-13', '2026-11-15'];
export const seedViewings: Viewing[] = [
  ['L1049', 'p5', 'a3', wk[0], '11:30', 'Done'], ['L1050', 'r2', 'a4', wk[0], '16:30', 'Done'], ['L1051', 'p2', 'a3', wk[1], '10:00', 'Done'],
  ['L1052', 'r5', 'a4', wk[1], '15:00', 'Done'], ['L1046', 'p3', 'a1', wk[2], '10:00', 'Confirmed'], ['L1047', 'r3', 'a4', wk[2], '13:00', 'Confirmed'],
  ['L1041', 'p2', 'a3', wk[2], '16:30', 'Confirmed'], ['L1040', 'p1', 'a1', wk[3], '11:30', 'Confirmed'], ['L1042', 'p8', 'a2', wk[3], '15:00', 'Pending'],
  ['L1053', 'p7', 'a1', wk[4], '10:00', 'Confirmed'], ['L1055', 'p8', 'a2', wk[4], '13:00', 'Pending'], ['L1043', 'p4', 'a4', wk[5], '18:00', 'Pending'],
].map(([leadId, propertyId, agentId, date, time, status], i) => ({ id: `V${200 + i}`, leadId, propertyId, agentId, date, time, status } as Viewing));

export const weekDays = wk;
export const timeSlots = ['10:00', '11:30', '13:00', '15:00', '16:30', '18:00'];

// Adviser colours for the calendar. Validated as a categorical set (colour-blind safe on white).
export const agentColor: Record<string, string> = { a1: '#2563B8', a2: '#C9772A', a3: '#0E9A80', a4: '#9050A8' };

export type Role = 'Admin' | 'Manager' | 'Adviser';
export const teamRoles: Record<string, Role> = { a1: 'Admin', a2: 'Manager', a3: 'Adviser', a4: 'Manager' };

export const monthlyLeads = [
  { month: 'Jun', value: 61 }, { month: 'Jul', value: 58 }, { month: 'Aug', value: 64 },
  { month: 'Sep', value: 79 }, { month: 'Oct', value: 92 }, { month: 'Nov', value: 41 },
];

export { agents };
