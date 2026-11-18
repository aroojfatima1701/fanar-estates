'use client';
import { SiteShell } from '../components/SiteShell';
import { AgentAvatar } from '../components/AgentAvatar';
import { IconArrow } from '../components/Icons';
import { agentById, articles } from '../lib/data';
import { articleBodies } from '../lib/content';
import { href } from '../lib/site';

const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

// /insights/[slug]
export default function Article({ slug }: { slug: string }) {
  const a = articles.find((x) => x.slug === slug) ?? articles[0];
  const body = articleBodies[a.slug];
  const author = agentById(body.author);
  const more = articles.filter((x) => x.slug !== a.slug);

  return (
    <SiteShell>
      <article>
        <header className="article-head">
          <div className="wrap wrap--narrow">
            <nav className="crumbs" aria-label="Breadcrumb"><a href={href('/')}>Home</a><span>/</span><a href={href('/insights')}>Insights</a><span>/</span><span>{a.category}</span></nav>
            <div className="post__meta"><span>{a.category}</span><span>{fmtDate(a.date)}</span><span>{a.readMinutes} min read</span></div>
            <h1 className="display">{a.title}</h1>
            <div className="byline">
              <AgentAvatar agent={author} className="byline__photo" />
              <span>By <a href={href(`/team/${author.id}`)}>{author.name}</a>, {author.role}</span>
            </div>
          </div>
        </header>
        <div className="wrap"><img className="article-img" src={a.image.replace('-card.jpg', '.jpg')} alt="" /></div>
        <div className="wrap wrap--narrow article-body">
          <p className="lede lede--big">{body.intro}</p>
          {body.sections.map((s) => (
            <section key={s.heading}>
              <h2>{s.heading}</h2>
              {s.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
            </section>
          ))}
          <p className="note">This article is general information, not legal or financial advice.</p>
        </div>
      </article>
      <section className="band band--pearl">
        <div className="wrap">
          <div className="section-head"><div><span className="eyebrow">Keep reading</span><h2 className="display">More <em>insights</em></h2></div><a className="link-arrow" href={href('/insights')}>All articles <IconArrow /></a></div>
          <div className="posts posts--2">
            {more.map((m) => (
              <a className="post" key={m.slug} href={href(`/insights/${m.slug}`)}>
                <div className="post__img"><img src={m.image} alt="" loading="lazy" /></div>
                <div className="post__meta"><span>{m.category}</span><span>{m.readMinutes} min read</span></div>
                <h3>{m.title}</h3>
              </a>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
