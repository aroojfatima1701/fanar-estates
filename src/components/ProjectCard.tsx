'use client';
import type { OffPlanProject } from '../lib/types';
import { href } from '../lib/site';
import { formatPrice, usePreferences } from '../lib/preferences';

export function ProjectCard({ o }: { o: OffPlanProject }) {
  const { currency } = usePreferences();
  return (
    <a className="project" href={href(`/off-plan/${o.slug}`)}>
      <div className="project__img"><img src={o.image} alt={`${o.name}, ${o.community}`} loading="lazy" /></div>
      <div className="project__body">
        <div className="project__top">
          <h3>{o.name}</h3>
          <span className="project__dev">{o.developer} · {o.community}</span>
        </div>
        <span style={{ color: 'var(--mist)' }}>{o.unitTypes}</span>
        <dl className="project__terms">
          <div><dt>From</dt><dd className="tabular">{formatPrice(o.fromPriceAed, currency, true)}</dd></div>
          <div><dt>Payment plan</dt><dd>{o.paymentPlan}</dd></div>
          <div><dt>Handover</dt><dd>{o.handover}</dd></div>
        </dl>
      </div>
    </a>
  );
}
