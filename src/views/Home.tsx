'use client';
import { SiteShell } from '../components/SiteShell';
import { HeroSlideshow } from '../components/HeroSlideshow';
import { SearchBar } from '../components/SearchBar';
import { PropertyCard } from '../components/PropertyCard';
import { ValuationForm } from '../components/ValuationForm';
import { AgentAvatar } from '../components/AgentAvatar';
import { IconArrow, IconBuilding, IconCrane, IconKey, IconPassport, IconShield, IconTag } from '../components/Icons';
import { agents, articles, communities, projects, properties, stats, testimonials } from '../lib/data';
import { href, site } from '../lib/site';
import { formatPrice, usePreferences } from '../lib/preferences';

const services = [
  { icon: IconKey, title: 'Buy a home', text: 'Shortlists matched to your brief, private viewings and support through to the DLD transfer.', route: '/buy' },
  { icon: IconTag, title: 'Sell your property', text: 'Accurate pricing from recent sales, professional photography and qualified buyers.', route: '/sell' },
  { icon: IconBuilding, title: 'Rent and lease', text: 'Tenants vetted, Ejari registered and cheques collected, for landlords and tenants alike.', route: '/rent' },
  { icon: IconCrane, title: 'Off-plan investment', text: 'Early access to launches, honest developer track records and payment plan advice.', route: '/off-plan' },
  { icon: IconShield, title: 'Property management', text: 'Maintenance, renewals and quarterly statements, so your investment runs itself.', route: '/services/management' },
  { icon: IconPassport, title: 'Golden Visa support', text: 'Buy AED 2 million or more and we guide your 10-year residency application.', route: '/services/golden-visa' },
];

const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

export default function Home() {
  const { currency } = usePreferences();

  return (
    <SiteShell overHero>
      <HeroSlideshow search={<SearchBar />}>
        <div className="hero__copy">
          <span className="eyebrow">Luxury real estate · Dubai</span>
          <h1 className="display">Let us guide you <em>home.</em></h1>
          <p className="lede">Villas, penthouses and off-plan residences across Dubai's most sought-after communities.</p>
        </div>
      </HeroSlideshow>

      <section className="stats" aria-label="Fanar in numbers">
        <div className="wrap stats__grid">
          {stats.map((s) => (<div className="stat" key={s.label}><b className="tabular">{s.value}</b><span>{s.label}</span></div>))}
        </div>
      </section>

      <section className="band">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="eyebrow">Featured properties</span>
              <h2 className="display">Homes we would <em>live in</em> ourselves</h2>
            </div>
            <a className="link-arrow" href={href('/buy')}>View all properties <IconArrow /></a>
          </div>
          <div className="cards">
            {properties.filter((p) => p.featured).map((p) => <PropertyCard key={p.id} p={p} />)}
          </div>
        </div>
      </section>

      <section className="band band--pearl">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="eyebrow">What we do</span>
              <h2 className="display">One team for every <em>step</em></h2>
            </div>
            <p className="lede">Whether you are buying your first apartment or managing a portfolio, one adviser stays with you from first call to handover.</p>
          </div>
          <div className="services">
            {services.map((s) => (
              <div className="service" key={s.title}>
                <s.icon width={32} height={32} />
                <h3>{s.title}</h3>
                <p>{s.text}</p>
                <a className="link-arrow" href={href(s.route)}>Learn more <IconArrow /></a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="band">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="eyebrow">Off-plan launches</span>
              <h2 className="display">Buy early, pay <em>over time</em></h2>
            </div>
            <a className="link-arrow" href={href('/off-plan')}>All new projects <IconArrow /></a>
          </div>
          <div className="projects">
            {projects.map((o) => (
              <a className="project" key={o.id} href={href(`/off-plan/${o.slug}`)}>
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
            ))}
          </div>
        </div>
      </section>

      <section className="band band--pearl">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="eyebrow">Explore communities</span>
              <h2 className="display">Find the right <em>neighbourhood</em></h2>
            </div>
            <a className="link-arrow" href={href('/communities')}>All communities <IconArrow /></a>
          </div>
          <div className="areas">
            {communities.map((c) => (
              <a className="area" key={c.slug} href={href(`/communities/${c.slug}`)}>
                <img src={c.image} alt="" loading="lazy" />
                <div className="area__body">
                  <h3>{c.name}</h3>
                  <p>{c.tagline}</p>
                  <div className="area__nums tabular">
                    <span>AED {c.avgPricePerSqftAed.toLocaleString('en-US')} / sq ft</span>
                    <span>{c.grossYieldPct}% yield</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
          <p className="note">Average sale price per square foot and gross rental yield are indicative.</p>
        </div>
      </section>

      <section className="band band--navy on-dark" id="valuation">
        <div className="wrap valuation">
          <div className="valuation__copy">
            <span className="eyebrow">Thinking of selling?</span>
            <h2 className="display" style={{ fontSize: 'var(--step-4)' }}>What is your home <em>worth today?</em></h2>
            <p className="lede">Tell us a little about your property and an adviser will send you a valuation range based on recent sales in your building.</p>
            <ul>
              <li>Based on real transactions, not asking prices</li>
              <li>A call within one working day</li>
              <li>No obligation to list with us</li>
            </ul>
          </div>
          <ValuationForm />
        </div>
      </section>

      <section className="band" style={{ paddingBottom: 0 }}>
        <div className="wrap">
          <div className="gv">
            <span className="gv__num">10 years</span>
            <div>
              <h3>Golden Visa through property</h3>
              <p>Invest AED 2 million or more in Dubai property and you can apply for 10-year UAE residency for you and your family. Eligible homes are marked on every listing.</p>
            </div>
            <a className="btn btn--line" href={href('/services/golden-visa')}>How it works</a>
          </div>
        </div>
      </section>

      <section className="band">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="eyebrow">Our advisers</span>
              <h2 className="display">People who know <em>every street</em></h2>
            </div>
            <a className="link-arrow" href={href('/team')}>Meet the team <IconArrow /></a>
          </div>
          <div className="team">
            {agents.map((a) => (
              <div className="agent" key={a.id}>
                <AgentAvatar agent={a} />
                <span className="agent__role">{a.role}</span>
                <h3>{a.name}</h3>
                <p>{a.specialty} · {a.languages.join(', ')}</p>
                <div className="agent__actions">
                  <a href={href(`/team/${a.id}`)}>View listings</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="band band--navy on-dark">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="eyebrow">Client stories</span>
              <h2 className="display">Trusted with the <em>move that matters</em></h2>
            </div>
          </div>
          <div className="quotes">
            {testimonials.map((t, i) => (
              <figure className="quote" key={i} style={{ margin: 0 }}>
                <blockquote>“{t.quote}”</blockquote>
                <figcaption>{t.name} · {t.context}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="band">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="eyebrow">Insights</span>
              <h2 className="display">Market notes from <em>the ground</em></h2>
            </div>
            <a className="link-arrow" href={href('/insights')}>All articles <IconArrow /></a>
          </div>
          <div className="posts">
            {articles.map((a) => (
              <a className="post" key={a.slug} href={href(`/insights/${a.slug}`)}>
                <div className="post__img"><img src={a.image} alt="" loading="lazy" /></div>
                <div className="post__meta"><span>{a.category}</span><span>{fmtDate(a.date)}</span><span>{a.readMinutes} min read</span></div>
                <h3>{a.title}</h3>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="band band--pearl">
        <div className="wrap contact">
          <div style={{ display: 'grid', gap: 20 }}>
            <span className="eyebrow">Talk to us</span>
            <h2 className="display" style={{ fontSize: 'var(--step-4)' }}>Start with a <em>conversation</em></h2>
            <p className="lede">Tell us what you are looking for and the right adviser will be in touch the same day.</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <a className="btn btn--navy" href={href('/contact')}>Send an enquiry</a>
              <a className="btn btn--line" href={href('/team')}>Choose an adviser</a>
            </div>
          </div>
          <ContactWays />
        </div>
      </section>
    </SiteShell>
  );
}

function ContactWays() {
  return (
    <dl className="contact__ways">
      <div><dt>Call</dt><dd>{site.phone}</dd></div>
      <div><dt>WhatsApp</dt><dd>{site.whatsapp}</dd></div>
      <div><dt>Email</dt><dd>{site.email}</dd></div>
      <div><dt>Visit</dt><dd>{site.address}</dd></div>
    </dl>
  );
}
