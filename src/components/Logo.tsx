import { href, site } from '../lib/site';

export function Logo() {
  return (
    <a className="logo" href={href('/')} aria-label={`${site.name} home`}>
      <span className="logo__ar" lang="ar" dir="rtl">{site.nameAr}</span>
      <span className="logo__rule" aria-hidden />
      <span className="logo__en">FANAR</span>
    </a>
  );
}
