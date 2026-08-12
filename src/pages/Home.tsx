import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import { TYPED_WORDS, STATS, TIMELINE } from '../data';

export default function Home() {
  const [typedDisplay, setTypedDisplay] = useState('');

  /* ─── intersection observer (reveal + counters) ─── */
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('anim-in'); obs.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
    document.querySelectorAll('[data-anim], .stat-cell').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  /* ─── counter animation ─── */
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.querySelectorAll<HTMLElement>('[data-target]').forEach(el => {
          const t = parseInt(el.dataset.target!, 10);
          const dur = 2000; const start = performance.now();
          const run = (now: number) => {
            const p = Math.min((now - start) / dur, 1);
            const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
            el.textContent = Math.floor(eased * t).toString();
            if (p < 1) requestAnimationFrame(run); else el.textContent = t.toString();
          };
          requestAnimationFrame(run);
        });
        obs.unobserve(e.target);
      });
    }, { threshold: 0.3 });
    document.querySelectorAll('.stats-strip').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  /* ─── typed text ─── */
  useEffect(() => {
    let wi = 0, ci = 0, del = false, paused = false;
    let tid: ReturnType<typeof setTimeout>;
    const tick = () => {
      if (paused) { tid = setTimeout(tick, 80); return; }
      const word = TYPED_WORDS[wi];
      const display = del ? word.slice(0, ci - 1) : word.slice(0, ci + 1);
      setTypedDisplay(display);
      ci = del ? ci - 1 : ci + 1;
      let delay = del ? 70 : 110;
      if (!del && ci === word.length + 1) {
        paused = true;
        setTimeout(() => { paused = false; del = true; }, 2000);
        delay = 0;
      }
      if (del && ci === 0) { del = false; wi = (wi + 1) % TYPED_WORDS.length; delay = 300; }
      tid = setTimeout(tick, delay);
    };
    tick();
    return () => clearTimeout(tid);
  }, []);

  return (
    <PageTransition>
      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="hero">
        <div className="hero-content">
          <p className="hero-label" data-anim="fade" data-delay="1">Hacker House Goa · 2026</p>
          <h1 className="hero-title">
            <span style={{ display: 'block' }} data-anim="up" data-delay="1">HACKER HOUSE</span>
            <span style={{ display: 'block', color: 'var(--beige)' }} data-anim="up" data-delay="2">GOA</span>
            <span className="typed-line" data-anim="up" data-delay="3">
              {typedDisplay}<span className="typed-cursor" aria-hidden="true" />
            </span>
          </h1>

          <div className="hero-actions" data-anim="fade" data-delay="5">
            <Link to="/generator" className="btn btn-primary">Get ID Card</Link>
            <a href="https://hacker-house-goa-2026.devfolio.co/" target="_blank" rel="noopener" className="btn btn-outline">Apply →</a>
          </div>
        </div>
      </section>

      {/* ═══════════════════ STATS ═══════════════════ */}
      <div className="stats-strip">
        {STATS.map((s, i) => (
          <div key={s.label} className="stat-cell">
            <div className="stat-num">
              <span data-target={s.target} data-anim="up" data-delay={String(i + 1)}>0</span>
              {s.suf}
            </div>
            <p className="stat-label">{s.label}</p>
          </div>
        ))}
      </div>



      {/* ═══════════════════ TIMELINE ═══════════════════ */}
      <section className="s" style={{ borderBottom: '2px dashed var(--border)' }}>
        <div className="wrap-sm">
          <p className="section-label" data-anim="fade">Roadmap</p>
          <h2 className="section-title" data-anim="up">The Timeline.</h2>
          <div style={{ marginTop: 40 }}>
            {TIMELINE.map((t, i) => (
              <div key={t.idx} className="timeline-row" data-anim="up" data-delay={String(i % 5 + 1)}>
                <div className="timeline-idx">{t.idx}</div>
                <div>
                  <div className="timeline-title">{t.title}</div>
                  <div className="timeline-desc">{t.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
