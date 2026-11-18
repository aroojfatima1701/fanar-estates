import type { ReactNode } from 'react';
import { href } from '../lib/site';

// Navy title band used at the top of inner pages.
export function PageHead({ crumbs, title, lede, image, children }: {
  crumbs: { label: string; route?: string }[];
  title: ReactNode;
  lede?: string;
  image?: string;
  children?: ReactNode;
}) {
  return (
    <section className={`page-head${image ? ' page-head--image' : ''}`}>
      {image && <img className="page-head__bg" src={image} alt="" />}
      <div className="wrap">
        <nav className="crumbs" aria-label="Breadcrumb">
          <a href={href('/')}>Home</a>
          {crumbs.map((c) => (
            <span key={c.label} style={{ display: 'contents' }}>
              <span>/</span>
              {c.route ? <a href={href(c.route)}>{c.label}</a> : <span>{c.label}</span>}
            </span>
          ))}
        </nav>
        <div className="page-head__row">
          <div className="page-head__text">
            <h1 className="display">{title}</h1>
            {lede && <p className="lede">{lede}</p>}
          </div>
          {children}
        </div>
      </div>
    </section>
  );
}
