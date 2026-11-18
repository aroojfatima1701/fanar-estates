'use client';
import { SiteShell } from '../components/SiteShell';
import { href } from '../lib/site';

// Stand-in for pages that are planned but not built yet in the preview.
export default function Soon({ title = 'This page' }: { title?: string }) {
  return (
    <SiteShell>
      <section className="soon">
        <div className="wrap">
          <div>
            <span className="eyebrow">Coming in the next phase</span>
            <h1 className="display" style={{ fontSize: 'var(--step-4)' }}>{title} is <em>on its way</em></h1>
            <p className="lede">This page is part of the build plan and will be added soon.</p>
            <a className="btn btn--navy" href={href('/')}>Back to home</a>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
