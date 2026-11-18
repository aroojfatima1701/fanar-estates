'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { media } from '../lib/site';

const scenes = [
  { label: 'Downtown Dubai', file: 'hero-1-downtown-skyline' },
  { label: 'Palm Jumeirah', file: 'hero-2-palm-villas' },
  { label: 'Interiors', file: 'hero-3-living-room' },
];

// Three clips that cross-fade in a loop. Only the current clip downloads at first;
// the next one starts loading while the current one plays. Phones get lighter 720p files.
// Visitors who prefer reduced motion see still images and change scenes by hand.
export function HeroSlideshow({ children, search }: { children: ReactNode; search: ReactNode }) {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [still, setStill] = useState(false);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    setMobile(window.matchMedia('(max-width: 760px)').matches);
    setStill(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    if (still) return;
    videos.current.forEach((v, i) => {
      if (!v) return;
      if (i === index) {
        v.currentTime = 0;
        v.play().catch(() => setStill(true)); // autoplay blocked: fall back to stills
      } else {
        v.pause();
      }
    });
    const next = videos.current[(index + 1) % scenes.length];
    if (next) next.preload = 'auto';
    setProgress(0);
  }, [index, still, mobile]);

  const go = (i: number) => setIndex(i);
  const advance = () => setIndex((i) => (i + 1) % scenes.length);

  return (
    <section className="hero" aria-label="Featured scenes">
      <div className="hero__media">
        {scenes.map((s, i) => (
          <img key={`p${s.file}`} src={media(`hero/${s.file}-poster.jpg`)} alt="" className={i === index ? 'is-on' : ''} />
        ))}
        {!still && scenes.map((s, i) => (
          <video
            key={`${s.file}-${mobile ? 'm' : 'd'}`}
            ref={(el) => { videos.current[i] = el; }}
            src={media(`hero/${s.file}${mobile ? '-mobile' : ''}.mp4`)}
            poster={media(`hero/${s.file}-poster.jpg`)}
            muted playsInline preload={i === 0 ? 'auto' : 'none'}
            className={i === index && playing ? 'is-on' : ''}
            aria-hidden
            onPlaying={() => i === index && setPlaying(true)}
            onTimeUpdate={(e) => { if (i === index) { const v = e.currentTarget; setProgress(v.duration ? v.currentTime / v.duration : 0); } }}
            onEnded={() => i === index && advance()}
          />
        ))}
      </div>
      <div className="hero__shade" aria-hidden />
      <div className="wrap hero__body">
        {children}
        <div className="hero__foot">
          {search}
          <div className="scenes">
            <div className="scenes__now" aria-live="polite">
              <span>0{index + 1} · {scenes[index].label}</span>
              <span>{scenes.length} scenes</span>
            </div>
            <div className="scenes__bars">
              {scenes.map((s, i) => (
                <button key={s.file} type="button" aria-current={i === index} onClick={() => go(i)} aria-label={`Show ${s.label}`}>
                  <span className="scenes__track">
                    <span className="scenes__fill" style={{
                      width: i < index ? '100%' : i === index ? `${(still ? 1 : progress) * 100}%` : '0%',
                      transition: i === index && !still ? 'width .3s linear' : 'none',
                    }} />
                  </span>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
