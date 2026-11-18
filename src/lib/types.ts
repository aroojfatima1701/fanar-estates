// Shared data shapes. These mirror the JSON the Laravel API will return,
// so the components stay the same when mock data is swapped for real data.

export type Purpose = 'buy' | 'rent';
export type Completion = 'ready' | 'off-plan';
export type PropertyType = 'Apartment' | 'Villa' | 'Townhouse' | 'Penthouse';

export interface Property {
  id: string;
  slug: string;
  title: string;
  community: string;
  building?: string;
  type: PropertyType;
  purpose: Purpose;
  completion: Completion;
  priceAed: number;          // sale price, or yearly rent when purpose is 'rent'
  cheques?: number;          // rentals: number of cheques accepted
  beds: number;              // 0 = studio
  baths: number;
  areaSqft: number;
  permitNumber: string;      // DLD Trakheesi permit, required on every Dubai property ad
  image: string;
  gallery: string[];
  featured?: boolean;
  agentId: string;
  tags?: string[];
  listedOn: string;          // ISO date
  description?: string;
  features?: string[];
  serviceChargePerSqft?: number; // yearly service charge, AED per sq ft
}

export interface OffPlanProject {
  id: string;
  slug: string;
  name: string;
  developer: string;
  community: string;
  fromPriceAed: number;
  paymentPlan: string;       // e.g. "60/40"
  handover: string;          // e.g. "Q4 2028"
  unitTypes: string;
  image: string;
}

export interface Community {
  slug: string;
  name: string;
  tagline: string;
  avgPricePerSqftAed: number;
  grossYieldPct: number;
  image: string;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  languages: string[];
  specialty: string;
  photo?: string;            // headshot; initials are shown until one is added
  phone: string;
  email: string;
}

export interface Article {
  slug: string;
  title: string;
  category: string;
  date: string;
  readMinutes: number;
  image: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  context: string;
}
