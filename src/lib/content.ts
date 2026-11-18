// Longer sample copy for detail pages. In production this comes from the CMS section of the admin panel.

export interface Milestone { label: string; pct: number; when: string }
export interface UnitType { type: string; sizeSqft: string; fromAed: number }

export const projectDetails: Record<string, {
  description: string;
  progressPct: number;
  milestones: Milestone[];
  units: UnitType[];
  amenities: string[];
  agentId: string;
  launch: string;
}> = {
  'lumiere-residences': {
    description: 'A 42-storey residential tower on the Dubai Water Canal with a rooftop infinity pool, residents\' lounge and direct access to the canal boardwalk. Interiors are by a Milan studio, with full-height glazing and private balconies on every unit.',
    progressPct: 35,
    launch: 'Launched March 2026',
    milestones: [
      { label: 'On booking', pct: 10, when: 'Today' },
      { label: 'During construction', pct: 50, when: 'Six instalments to Q3 2028' },
      { label: 'On handover', pct: 40, when: 'Q4 2028' },
    ],
    units: [
      { type: '1 bedroom', sizeSqft: '760 to 840', fromAed: 1_450_000 },
      { type: '2 bedroom', sizeSqft: '1,180 to 1,320', fromAed: 2_350_000 },
      { type: '3 bedroom', sizeSqft: '1,750 to 1,900', fromAed: 3_600_000 },
    ],
    amenities: ['Rooftop infinity pool', 'Canal boardwalk access', 'Residents\' lounge', 'Gym and spa', 'Children\'s play area', 'Concierge', '5 minutes to Downtown'],
    agentId: 'a2',
  },
  'azure-cove': {
    description: 'Two slender towers on the Dubai Harbour waterfront with views across to Palm Jumeirah and Bluewaters. Residents get a private beach, a marina berth programme and a sky garden on level 38.',
    progressPct: 12,
    launch: 'Launched September 2026',
    milestones: [
      { label: 'On booking', pct: 20, when: 'Today' },
      { label: 'During construction', pct: 50, when: 'Quarterly to Q1 2029' },
      { label: 'On handover', pct: 30, when: 'Q2 2029' },
    ],
    units: [
      { type: '2 bedroom', sizeSqft: '1,250 to 1,400', fromAed: 2_200_000 },
      { type: '3 bedroom', sizeSqft: '1,850 to 2,100', fromAed: 3_900_000 },
      { type: '4 bedroom penthouse', sizeSqft: '4,200 to 5,600', fromAed: 11_500_000 },
    ],
    amenities: ['Private beach', 'Marina berths', 'Sky garden', 'Infinity pool', 'Wellness centre', 'Valet parking'],
    agentId: 'a2',
  },
};

export const communityDetails: Record<string, {
  intro: string;
  bestFor: string[];
  highlights: { title: string; text: string }[];
  nearby: { place: string; time: string }[];
  rentRange: string;
}> = {
  'dubai-marina': {
    intro: 'Dubai Marina is a 3 km man-made canal lined with more than 200 towers, a promenade, restaurants and the beach at JBR a short walk away. It is one of the most rented areas in the city and a favourite for first-time investors.',
    bestFor: ['Young professionals', 'Investors', 'Beach lovers'],
    highlights: [
      { title: 'Walkable', text: 'The Marina Walk, JBR beach and the tram connect almost everything on foot.' },
      { title: 'Strong rental demand', text: 'Short and long-term tenants keep vacancy low across the year.' },
      { title: 'Transport', text: 'Two metro stations and the tram link the Marina to the rest of Dubai.' },
    ],
    nearby: [{ place: 'JBR beach', time: '5 min' }, { place: 'Palm Jumeirah', time: '10 min' }, { place: 'Downtown Dubai', time: '25 min' }, { place: 'Al Maktoum Airport', time: '30 min' }],
    rentRange: 'AED 85,000 to 260,000 a year for 1 to 3 bedrooms',
  },
  'palm-jumeirah': {
    intro: 'The Palm is Dubai\'s most famous address: private beachfront villas on the fronds, hotel-branded residences on the crescent and apartments along the trunk with views back to the Marina.',
    bestFor: ['Families', 'Luxury buyers', 'Holiday homes'],
    highlights: [
      { title: 'Private beaches', text: 'Every frond villa has its own stretch of sand and sea access.' },
      { title: 'Branded living', text: 'Residences serviced by five-star hotels on the crescent.' },
      { title: 'Prime value', text: 'Historically one of the strongest areas for capital growth.' },
    ],
    nearby: [{ place: 'Dubai Marina', time: '10 min' }, { place: 'Mall of the Emirates', time: '15 min' }, { place: 'Downtown Dubai', time: '25 min' }, { place: 'DXB Airport', time: '35 min' }],
    rentRange: 'AED 150,000 for apartments to over 1,000,000 a year for villas',
  },
  'downtown-dubai': {
    intro: 'Downtown is built around the Burj Khalifa, Dubai Mall and the Fountain. Homes range from boulevard apartments to penthouses with direct views of the tower.',
    bestFor: ['City lovers', 'Professionals', 'Short-term rental investors'],
    highlights: [
      { title: 'Iconic views', text: 'Burj Khalifa and Fountain views command the highest rents.' },
      { title: 'Everything nearby', text: 'Dubai Mall, the Opera and DIFC are minutes away.' },
      { title: 'Holiday-home demand', text: 'Strong nightly rates thanks to year-round visitors.' },
    ],
    nearby: [{ place: 'Dubai Mall', time: '3 min' }, { place: 'DIFC', time: '8 min' }, { place: 'DXB Airport', time: '15 min' }, { place: 'Dubai Marina', time: '25 min' }],
    rentRange: 'AED 110,000 to 400,000 a year for 1 to 3 bedrooms',
  },
  'business-bay': {
    intro: 'Business Bay sits along the Dubai Water Canal next to Downtown. Offices and homes share the same waterfront, with newer towers and some of the best yields in central Dubai.',
    bestFor: ['Investors', 'Professionals', 'Off-plan buyers'],
    highlights: [
      { title: 'High yields', text: 'Entry prices below Downtown with comparable rents.' },
      { title: 'Canal living', text: 'Boardwalks, cycle paths and waterfront cafés.' },
      { title: 'New launches', text: 'Many of the city\'s off-plan projects launch here.' },
    ],
    nearby: [{ place: 'Downtown Dubai', time: '5 min' }, { place: 'DIFC', time: '10 min' }, { place: 'DXB Airport', time: '15 min' }, { place: 'City Walk', time: '10 min' }],
    rentRange: 'AED 70,000 to 220,000 a year for studios to 3 bedrooms',
  },
};

export const articleBodies: Record<string, { intro: string; sections: { heading: string; paragraphs: string[] }[]; author: string }> = {
  'dubai-market-q3': {
    author: 'a1',
    intro: 'Transaction volumes stayed high through the summer, but the mix of what people bought changed. Here is what the third quarter told us, and what it means if you are buying or selling in the months ahead.',
    sections: [
      { heading: 'Ready homes regained ground', paragraphs: ['After two years in which off-plan sales led the market, ready properties took a larger share of deals. Buyers who need to move in, or who want rental income straight away, kept prices for finished villas firm.', 'Villa communities with limited new supply, such as Palm Jumeirah and Dubai Hills, saw the steadiest prices.'] },
      { heading: 'Rents are levelling off', paragraphs: ['Rental growth slowed in most apartment communities as new towers completed. Tenants now have more choice, which means well-presented homes let quickly while tired ones sit empty longer.'] },
      { heading: 'What this means for you', paragraphs: ['If you are selling, price against recent transactions rather than asking prices. If you are buying to rent out, focus on buildings with good management and low service charges, since they protect your net yield.'] },
    ],
  },
  'golden-visa-guide': {
    author: 'a1',
    intro: 'The UAE Golden Visa gives you and your family 10-year residency, and property is one of the simplest ways to qualify. These are the rules that matter when you buy.',
    sections: [
      { heading: 'The AED 2 million threshold', paragraphs: ['You qualify by owning property worth at least AED 2 million. That value can come from one property or several, as long as they are in your name.', 'Off-plan property can count when it is bought from an approved developer, so check eligibility before you book.'] },
      { heading: 'Mortgaged property', paragraphs: ['A mortgage does not rule you out. Some banks issue a letter confirming the amount you have paid, which the authorities use to assess the application.'] },
      { heading: 'How we help', paragraphs: ['Every eligible listing on our site is marked. Once you buy, our team prepares the title deed, valuation and application documents with you.'] },
    ],
  },
  'off-plan-payment-plans': {
    author: 'a2',
    intro: 'Payment plans are what make off-plan attractive: you pay in stages instead of all at once. But the split matters more than most buyers realise.',
    sections: [
      { heading: 'How a 60/40 plan works', paragraphs: ['You pay 60% in instalments while the building rises and 40% when you receive the keys. Your money is held in an escrow account regulated by the Dubai Land Department until each stage is reached.'] },
      { heading: 'Post-handover plans', paragraphs: ['Some developers let you keep paying for two to five years after handover. Rent from the unit can cover part of those payments, but the overall price is usually higher.'] },
      { heading: 'What to check', paragraphs: ['Look at the developer\'s record of delivering on time, the escrow registration and the service charge estimate. A slightly lower price is not worth a two-year delay.'] },
    ],
  },
};

export const agentBios: Record<string, string> = {
  a1: 'Layla has sold villas on the Palm and in Emirates Hills for twelve years. She leads our sales team and handles most of our private, off-market listings.',
  a2: 'Omar tracks every major launch in Dubai and has a reputation for straight answers about developers and handover dates. He advises investors from the UK, Pakistan and the Gulf.',
  a3: 'Sara knows Dubai Marina and JBR tower by tower, including which buildings have the best management and the lowest service charges.',
  a4: 'Daniyal runs our leasing team across Downtown and Business Bay, matching landlords with long-term tenants and handling Ejari, renewals and maintenance.',
};

export const services: Record<string, { title: string; titleEm: string; intro: string; steps: { title: string; text: string }[]; faq: { q: string; a: string }[] }> = {
  'golden-visa': {
    title: 'Golden Visa', titleEm: 'through property',
    intro: 'Invest AED 2 million or more in Dubai property and you can apply for 10-year UAE residency for yourself, your spouse and your children.',
    steps: [
      { title: 'Choose an eligible property', text: 'Every listing worth AED 2 million or more is marked on our site. We confirm eligibility before you commit.' },
      { title: 'Complete the purchase', text: 'We handle the sale agreement, the DLD transfer and your title deed.' },
      { title: 'Prepare your application', text: 'We gather the title deed, valuation and personal documents with you.' },
      { title: 'Medical, biometrics and visa', text: 'After approval you complete a medical test and biometrics, then receive your 10-year residency.' },
    ],
    faq: [
      { q: 'Can I combine more than one property?', a: 'Yes. Several properties in your name can be combined to reach AED 2 million.' },
      { q: 'Does a mortgaged home qualify?', a: 'It can, if your bank confirms the amount you have paid. We can recommend banks that issue this letter.' },
      { q: 'Can I include my family?', a: 'Yes. Your spouse and children can be sponsored on the same visa.' },
    ],
  },
  management: {
    title: 'Property', titleEm: 'management',
    intro: 'We look after your Dubai property so it earns without needing your time: tenants, rent, maintenance and renewals, with a clear statement every quarter.',
    steps: [
      { title: 'Valuation and listing', text: 'We price the rent from recent leases and market the home with professional photography.' },
      { title: 'Tenant and contract', text: 'We vet tenants, register the Ejari contract and collect the cheques.' },
      { title: 'Maintenance', text: 'Our team handles repairs and annual servicing, approving larger jobs with you first.' },
      { title: 'Statements and renewals', text: 'Quarterly statements, plus renewals and rent reviews handled on time.' },
    ],
    faq: [
      { q: 'What does it cost?', a: 'Management is 5% of the yearly rent, with leasing charged separately at 5% for new tenants.' },
      { q: 'Do you manage holiday homes?', a: 'Yes, including the DTCM holiday-home licence, cleaning and guest check-in.' },
      { q: 'Can I see my statements online?', a: 'Yes. Owners get a login to view rent received, expenses and documents.' },
    ],
  },
};
