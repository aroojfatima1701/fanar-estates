// Site-wide settings. Contact details are placeholders for the concept project:
// replace them with the real agency's details before launch.

export const site = {
  name: 'Fanar Estates',
  nameAr: 'فنار',
  tagline: 'Let us guide you home.',
  phone: '+971 4 000 0000',
  whatsapp: '+971 50 000 0000',
  whatsappLink: 'https://wa.me/971500000000',
  email: 'hello@fanar-estates.test',
  address: 'Office [000], Dubai Marina, Dubai, UAE',
  reraOrn: '[00000]',            // RERA Office Registration Number
  hours: 'Sun to Fri, 9am to 7pm',
};

// Where images and videos live. Next.js serves /public at the root ("/media/...").
// The static preview sets globalThis.__MEDIA_BASE__ = "media" so the same code works there.
const base: string = (globalThis as { __MEDIA_BASE__?: string }).__MEDIA_BASE__ ?? '/media';
export const media = (path: string) => `${base}/${path}`;

// Page links. In Next.js these are routes; the static preview maps them to .html files.
const linkMode: string = (globalThis as { __LINK_MODE__?: string }).__LINK_MODE__ ?? 'next';
export const href = (route: string) => {
  if (linkMode !== 'static') return route;
  if (route === '/') return 'index.html';
  const [path, query] = route.split('?');
  return `${path.replace(/^\//, '').replace(/\//g, '-')}.html${query ? `?${query}` : ''}`;
};

export const nav = [
  { label: 'Buy', route: '/buy' },
  { label: 'Rent', route: '/rent' },
  { label: 'Off-plan', route: '/off-plan' },
  { label: 'Communities', route: '/communities' },
  { label: 'Sell', route: '/sell' },
  { label: 'About', route: '/about' },
];
