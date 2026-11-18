// Sample content for the concept project. In production these come from the Laravel API
// (GET /api/properties, /api/projects, /api/communities, /api/agents, /api/articles).
import type { Agent, Article, Community, OffPlanProject, Property, Testimonial } from './types';
import { media } from './site';

export const agents: Agent[] = [
  { id: 'a1', photo: media('team/adviser-layla.jpg'), name: 'Layla Haddad', role: 'Head of Sales', languages: ['English', 'Arabic', 'French'], specialty: 'Palm Jumeirah villas', phone: '+971 50 000 0001', email: 'layla@fanar-estates.test' },
  { id: 'a2', photo: media('team/adviser-omar.jpg'), name: 'Omar Siddiqui', role: 'Off-plan Specialist', languages: ['English', 'Arabic', 'Urdu'], specialty: 'New launches and payment plans', phone: '+971 50 000 0002', email: 'omar@fanar-estates.test' },
  { id: 'a3', photo: media('team/adviser-sara.jpg'), name: 'Sara Whitfield', role: 'Senior Adviser', languages: ['English', 'German'], specialty: 'Dubai Marina and JBR', phone: '+971 50 000 0003', email: 'sara@fanar-estates.test' },
  { id: 'a4', photo: media('team/adviser-daniyal.jpg'), name: 'Daniyal Khan', role: 'Leasing Manager', languages: ['English', 'Urdu', 'Hindi'], specialty: 'Downtown and Business Bay rentals', phone: '+971 50 000 0004', email: 'daniyal@fanar-estates.test' },
];

const img = {
  villaPalms: media('properties/villa-white-palms.jpg'), villaPalmsCard: media('properties/villa-white-palms-card.jpg'),
  villaModern: media('properties/villa-modern-minimal.jpg'), villaModernCard: media('properties/villa-modern-minimal-card.jpg'),
  living: media('properties/interior-luxury-living.jpg'), livingCard: media('properties/interior-luxury-living-card.jpg'),
  livingPool: media('hero/hero-3-living-room-poster.jpg'),
  palmVillas: media('hero/hero-2-palm-villas-poster.jpg'),
  skyline: media('hero/hero-1-downtown-skyline-poster.jpg'),
  marina: media('communities/community-dubai-marina.jpg'), marinaCard: media('communities/community-dubai-marina-card.jpg'),
  downtown: media('communities/community-downtown.jpg'), downtownCard: media('communities/community-downtown-card.jpg'),
  bay: media('communities/community-business-bay.jpg'), bayCard: media('communities/community-business-bay-card.jpg'),
  palm: media('communities/community-palm-jumeirah.jpg'),
  tower: media('off-plan/offplan-tower-view.jpg'), towerCard: media('off-plan/offplan-tower-view-card.jpg'),
};

export const properties: Property[] = [
  {
    id: 'p1', slug: 'signature-villa-palm-jumeirah', title: 'Signature beachfront villa',
    community: 'Palm Jumeirah', building: 'Frond G', type: 'Villa', purpose: 'buy', completion: 'ready',
    priceAed: 38_500_000, beds: 6, baths: 8, areaSqft: 11_200, permitNumber: '7120000001',
    image: img.villaPalmsCard, gallery: [img.villaPalms, img.livingPool, img.palmVillas, img.living],
    featured: true, agentId: 'a1', tags: ['Private beach', 'Pool'], listedOn: '2026-11-02', serviceChargePerSqft: 6,
    description: 'A six-bedroom villa on the tip of Frond G with 70 metres of private beach and an uninterrupted view of the Dubai Marina skyline. The ground floor opens fully to the terrace and a 20-metre infinity pool, with a separate guest suite, cinema and staff quarters.',
    features: ['Private beach', 'Infinity pool', 'Home cinema', 'Staff quarters', 'Smart home system', '4-car garage', 'Marina skyline view', 'Landscaped garden'],
  },
  {
    id: 'p2', slug: 'marina-view-apartment', title: 'Marina-view apartment',
    community: 'Dubai Marina', building: 'Marina Gate', type: 'Apartment', purpose: 'buy', completion: 'ready',
    priceAed: 2_850_000, beds: 2, baths: 3, areaSqft: 1_410, permitNumber: '7120000002',
    image: img.marinaCard, gallery: [img.marina, img.living, img.skyline],
    featured: true, agentId: 'a3', tags: ['Marina view'], listedOn: '2026-10-29', serviceChargePerSqft: 19,
    description: 'A bright two-bedroom on a high floor with floor-to-ceiling windows over the marina. Walking distance to the tram, JBR beach and the promenade. Currently vacant and ready to move in.',
    features: ['Full marina view', 'Balcony', 'Built-in wardrobes', 'Gym and pool', '24-hour security', 'Covered parking', 'Walk to tram'],
  },
  {
    id: 'p3', slug: 'contemporary-villa-dubai-hills', title: 'Contemporary family villa',
    community: 'Dubai Hills Estate', building: 'Golf Place', type: 'Villa', purpose: 'buy', completion: 'ready',
    priceAed: 14_900_000, beds: 5, baths: 6, areaSqft: 7_850, permitNumber: '7120000003',
    image: img.villaModernCard, gallery: [img.villaModern, img.living, img.villaPalms],
    featured: true, agentId: 'a1', tags: ['Golf course', 'Pool'], listedOn: '2026-10-21', serviceChargePerSqft: 4,
    description: 'A modern five-bedroom villa backing onto the championship golf course, with a private pool, double-height living room and a family kitchen that opens onto the garden. Schools and Dubai Hills Mall are five minutes away.',
    features: ['Golf course view', 'Private pool', 'Maid\'s room', 'Double-height living', 'Landscaped garden', 'Near top schools'],
  },
  {
    id: 'p4', slug: 'downtown-penthouse', title: 'Burj-view penthouse',
    community: 'Downtown Dubai', building: 'Boulevard Heights', type: 'Penthouse', purpose: 'buy', completion: 'ready',
    priceAed: 9_750_000, beds: 3, baths: 4, areaSqft: 3_260, permitNumber: '7120000004',
    image: img.livingCard, gallery: [img.living, img.downtown, img.skyline],
    featured: true, agentId: 'a4', tags: ['Burj Khalifa view'], listedOn: '2026-10-15', serviceChargePerSqft: 22,
    description: 'A full-floor penthouse with a wraparound terrace facing the Burj Khalifa and the Dubai Fountain. Refurbished in 2025 with Italian marble, a chef\'s kitchen and a private lift lobby.',
    features: ['Burj Khalifa view', 'Wraparound terrace', 'Private lift', 'Italian marble', 'Chef\'s kitchen', 'Fountain view'],
  },
  {
    id: 'p5', slug: 'business-bay-canal-apartment', title: 'Canal-front one bedroom',
    community: 'Business Bay', building: 'Canal Residence', type: 'Apartment', purpose: 'buy', completion: 'ready',
    priceAed: 1_650_000, beds: 1, baths: 2, areaSqft: 860, permitNumber: '7120000005',
    image: img.bayCard, gallery: [img.bay, img.living],
    agentId: 'a4', tags: ['Canal view', 'Tenanted'], listedOn: '2026-11-05', serviceChargePerSqft: 17,
    description: 'A one-bedroom investment apartment overlooking the Dubai Water Canal, currently tenanted at AED 115,000 a year until August 2027.',
    features: ['Canal view', 'Tenanted', 'Pool and gym', 'Near metro'],
  },
  {
    id: 'p6', slug: 'palm-garden-homes-villa', title: 'Garden Homes villa',
    community: 'Palm Jumeirah', building: 'Garden Homes', type: 'Villa', purpose: 'buy', completion: 'ready',
    priceAed: 24_000_000, beds: 5, baths: 6, areaSqft: 6_950, permitNumber: '7120000006',
    image: img.palmVillas, gallery: [img.palmVillas, img.palm, img.livingPool],
    agentId: 'a1', tags: ['Beach access', 'Upgraded'], listedOn: '2026-09-30', serviceChargePerSqft: 6,
    description: 'An upgraded Mediterranean-style villa on the trunk side of the Palm with direct beach access and views back to the Marina.',
    features: ['Beach access', 'Upgraded throughout', 'Private pool', 'Garden', 'Maid\'s room'],
  },
  {
    id: 'p7', slug: 'downtown-two-bedroom', title: 'Boulevard two bedroom',
    community: 'Downtown Dubai', building: 'Burj Royale', type: 'Apartment', purpose: 'buy', completion: 'ready',
    priceAed: 3_400_000, beds: 2, baths: 2, areaSqft: 1_120, permitNumber: '7120000007',
    image: img.downtownCard, gallery: [img.downtown, img.living],
    agentId: 'a4', tags: ['Boulevard view'], listedOn: '2026-10-08', serviceChargePerSqft: 20,
    description: 'A two-bedroom apartment steps from Dubai Mall and the Opera, with views along the Boulevard.',
    features: ['Boulevard view', 'Walk to Dubai Mall', 'Pool and gym', 'Concierge'],
  },
  {
    id: 'p8', slug: 'lumiere-two-bedroom-off-plan', title: 'Lumière two bedroom',
    community: 'Business Bay', building: 'Lumière Residences', type: 'Apartment', purpose: 'buy', completion: 'off-plan',
    priceAed: 2_350_000, beds: 2, baths: 3, areaSqft: 1_240, permitNumber: '7120000008',
    image: img.towerCard, gallery: [img.tower, img.living],
    agentId: 'a2', tags: ['60/40 plan', 'Handover Q4 2028'], listedOn: '2026-11-07', serviceChargePerSqft: 18,
    description: 'An off-plan two-bedroom in Lumière Residences. Pay 10% on booking, 50% during construction and 40% on handover in Q4 2028.',
    features: ['60/40 payment plan', 'Canal view', 'Infinity pool', 'Handover Q4 2028'],
  },
  {
    id: 'p9', slug: 'marina-studio', title: 'Furnished marina studio',
    community: 'Dubai Marina', building: 'Marina Promenade', type: 'Apartment', purpose: 'buy', completion: 'ready',
    priceAed: 980_000, beds: 0, baths: 1, areaSqft: 520, permitNumber: '7120000009',
    image: img.marinaCard, gallery: [img.marina],
    agentId: 'a3', tags: ['Furnished', 'Holiday-home ready'], listedOn: '2026-10-25', serviceChargePerSqft: 18,
    description: 'A fully furnished studio licensed for short-term rental, on the marina promenade.',
    features: ['Furnished', 'Holiday-home licence', 'Marina view', 'Walk to beach'],
  },

  // Rentals: price is yearly rent
  {
    id: 'r1', slug: 'rent-marina-two-bedroom', title: 'Marina two bedroom',
    community: 'Dubai Marina', building: 'Marina Gate', type: 'Apartment', purpose: 'rent', completion: 'ready',
    priceAed: 185_000, cheques: 4, beds: 2, baths: 3, areaSqft: 1_380, permitNumber: '7120000101',
    image: img.marinaCard, gallery: [img.marina, img.living], agentId: 'a3', tags: ['Unfurnished'], listedOn: '2026-11-06',
    description: 'A two-bedroom with full marina views, available from December. Chiller included.',
    features: ['Marina view', 'Chiller free', 'Pool and gym', 'Parking'],
  },
  {
    id: 'r2', slug: 'rent-downtown-one-bedroom', title: 'Downtown one bedroom',
    community: 'Downtown Dubai', building: 'Boulevard Point', type: 'Apartment', purpose: 'rent', completion: 'ready',
    priceAed: 140_000, cheques: 2, beds: 1, baths: 2, areaSqft: 910, permitNumber: '7120000102',
    image: img.downtownCard, gallery: [img.downtown, img.living], agentId: 'a4', tags: ['Furnished'], listedOn: '2026-11-03',
    description: 'A furnished one-bedroom with a Burj Khalifa view, ready to move in.',
    features: ['Furnished', 'Burj Khalifa view', 'Concierge'],
  },
  {
    id: 'r3', slug: 'rent-dubai-hills-villa', title: 'Dubai Hills family villa',
    community: 'Dubai Hills Estate', building: 'Maple', type: 'Townhouse', purpose: 'rent', completion: 'ready',
    priceAed: 360_000, cheques: 2, beds: 4, baths: 5, areaSqft: 3_100, permitNumber: '7120000103',
    image: img.villaModernCard, gallery: [img.villaModern], agentId: 'a4', tags: ['Park view'], listedOn: '2026-10-30',
    description: 'A four-bedroom townhouse facing the community park, close to schools.',
    features: ['Park view', 'Garden', 'Maid\'s room', 'Near schools'],
  },
  {
    id: 'r4', slug: 'rent-palm-penthouse', title: 'Palm beach penthouse',
    community: 'Palm Jumeirah', building: 'Shoreline', type: 'Penthouse', purpose: 'rent', completion: 'ready',
    priceAed: 520_000, cheques: 1, beds: 3, baths: 4, areaSqft: 3_050, permitNumber: '7120000104',
    image: img.livingCard, gallery: [img.livingPool, img.palm], agentId: 'a1', tags: ['Beach access'], listedOn: '2026-10-19',
    description: 'A three-bedroom penthouse with a private terrace and beach club access.',
    features: ['Beach access', 'Private terrace', 'Sea view'],
  },
  {
    id: 'r5', slug: 'rent-business-bay-studio', title: 'Business Bay studio',
    community: 'Business Bay', building: 'Bay Square', type: 'Apartment', purpose: 'rent', completion: 'ready',
    priceAed: 72_000, cheques: 4, beds: 0, baths: 1, areaSqft: 480, permitNumber: '7120000105',
    image: img.bayCard, gallery: [img.bay], agentId: 'a4', tags: ['Near metro'], listedOn: '2026-11-08',
    description: 'A compact studio a short walk from the metro and the canal.',
    features: ['Near metro', 'Pool', 'Gym'],
  },
];

// Approximate positions on the preview map (percent across, percent down).
export const communityPins: Record<string, [number, number]> = {
  'Palm Jumeirah': [26, 34], 'Dubai Marina': [14, 64], 'Dubai Harbour': [20, 50], 'Dubai Hills Estate': [50, 80],
  'Downtown Dubai': [74, 26], 'Business Bay': [80, 52],
};

export const agentById = (id: string) => agents.find((a) => a.id === id) ?? agents[0];

export const projects: OffPlanProject[] = [
  {
    id: 'o1', slug: 'lumiere-residences', name: 'Lumière Residences', developer: 'Lumen Developments',
    community: 'Business Bay', fromPriceAed: 1_450_000, paymentPlan: '60/40', handover: 'Q4 2028',
    unitTypes: '1 to 3 bedroom apartments', image: media('off-plan/offplan-tower-view.jpg'),
  },
  {
    id: 'o2', slug: 'azure-cove', name: 'Azure Cove', developer: 'Qamar Developments',
    community: 'Dubai Harbour', fromPriceAed: 2_200_000, paymentPlan: '70/30', handover: 'Q2 2029',
    unitTypes: '2 to 4 bedroom apartments and penthouses', image: media('off-plan/offplan-construction.jpg'),
  },
];

// Indicative figures for the concept project.
export const communities: Community[] = [
  { slug: 'dubai-marina', name: 'Dubai Marina', tagline: 'Waterfront towers and a 7 km promenade', avgPricePerSqftAed: 2_150, grossYieldPct: 6.4, image: media('communities/community-dubai-marina-card.jpg') },
  { slug: 'palm-jumeirah', name: 'Palm Jumeirah', tagline: 'Beachfront villas on the world-famous island', avgPricePerSqftAed: 4_900, grossYieldPct: 5.1, image: media('communities/community-palm-jumeirah-card.jpg') },
  { slug: 'downtown-dubai', name: 'Downtown Dubai', tagline: 'Living beside the Burj Khalifa', avgPricePerSqftAed: 2_900, grossYieldPct: 5.6, image: media('communities/community-downtown-card.jpg') },
  { slug: 'business-bay', name: 'Business Bay', tagline: 'Canal-side homes in the business district', avgPricePerSqftAed: 2_050, grossYieldPct: 6.9, image: media('communities/community-business-bay-card.jpg') },
];

export const articles: Article[] = [
  { slug: 'dubai-market-q3', title: 'Dubai property market: what the third quarter told us', category: 'Market report', date: '2026-10-14', readMinutes: 6, image: media('communities/community-downtown-card.jpg') },
  { slug: 'golden-visa-guide', title: 'Buying for a Golden Visa: the AED 2 million rule explained', category: 'Guide', date: '2026-09-28', readMinutes: 5, image: media('properties/villa-modern-minimal-card.jpg') },
  { slug: 'off-plan-payment-plans', title: 'Off-plan payment plans: 60/40 vs post-handover', category: 'Investing', date: '2026-09-02', readMinutes: 7, image: media('off-plan/offplan-tower-view-card.jpg') },
];

export const testimonials: Testimonial[] = [
  { quote: 'They found us a villa on the Palm in three weeks and handled the transfer from start to finish while we were still in London.', name: 'Sample client', context: 'Bought on Palm Jumeirah' },
  { quote: 'Clear advice on which off-plan projects had realistic handover dates. That honesty is why we bought through Fanar.', name: 'Sample client', context: 'Off-plan investor' },
  { quote: 'Our apartment was rented within ten days, and the quarterly reports mean we never have to chase anyone.', name: 'Sample client', context: 'Landlord, Dubai Marina' },
];

export const stats = [
  { value: '12+', label: 'Years in Dubai' },
  { value: 'AED 4.2B', label: 'Property sold' },
  { value: '45', label: 'Advisers' },
  { value: '30', label: 'Communities covered' },
];
