import type { SVGProps } from 'react';

const base = (p: SVGProps<SVGSVGElement>) => ({
  width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
  strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true, ...p,
});

export const IconMenu = (p: SVGProps<SVGSVGElement>) => (<svg {...base(p)}><path d="M3 7h18M3 12h18M3 17h18" /></svg>);
export const IconClose = (p: SVGProps<SVGSVGElement>) => (<svg {...base(p)}><path d="M6 6l12 12M18 6L6 18" /></svg>);
export const IconArrow = (p: SVGProps<SVGSVGElement>) => (<svg {...base({ width: 16, height: 16, ...p })}><path d="M5 12h14M13 6l6 6-6 6" /></svg>);
export const IconHeart = (p: SVGProps<SVGSVGElement>) => (<svg {...base({ width: 20, height: 20, ...p })}><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" /></svg>);
export const IconKey = (p: SVGProps<SVGSVGElement>) => (<svg {...base(p)}><circle cx="8" cy="15" r="4" /><path d="M11 12l9-9M17 6l3 3M15 8l2 2" /></svg>);
export const IconTag = (p: SVGProps<SVGSVGElement>) => (<svg {...base(p)}><path d="M3 12V4h8l10 10-8 8L3 12z" /><circle cx="7.5" cy="8.5" r="1.5" /></svg>);
export const IconBuilding = (p: SVGProps<SVGSVGElement>) => (<svg {...base(p)}><path d="M4 21V5l8-3v19M12 21V9l8 3v9M2 21h20M7 8h2M7 12h2M7 16h2M15 14h2M15 18h2" /></svg>);
export const IconCrane = (p: SVGProps<SVGSVGElement>) => (<svg {...base(p)}><path d="M6 21V3l14 3H6M10 6v4M6 21h6M20 6v5" /><rect x="17" y="11" width="6" height="4" /></svg>);
export const IconShield = (p: SVGProps<SVGSVGElement>) => (<svg {...base(p)}><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" /><path d="M9 12l2 2 4-4" /></svg>);
export const IconPassport = (p: SVGProps<SVGSVGElement>) => (<svg {...base(p)}><rect x="5" y="3" width="14" height="18" /><circle cx="12" cy="10" r="3" /><path d="M9 17h6" /></svg>);
export const IconWhatsApp = (p: SVGProps<SVGSVGElement>) => (
  <svg width={28} height={28} viewBox="0 0 24 24" aria-hidden {...p}>
    <path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.2-.2-.5-.3z" />
  </svg>
);
