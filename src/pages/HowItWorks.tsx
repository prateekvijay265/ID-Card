import { useEffect } from 'react';
import PageTransition from '../components/PageTransition';
import { PROGRAMS } from '../data';

export default function HowItWorks() {
  /* ─── intersection observer (reveal) ─── */
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('anim-in'); obs.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
    document.querySelectorAll('[data-anim]').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  /* ─── hz drag scroll ─── */
  useEffect(() => {
    document.querySelectorAll<HTMLElement>('.hz-track').forEach(t => {
      let down = false, sx = 0, sl = 0;
      t.addEventListener('mousedown', e => { down = true; sx = e.pageX - t.offsetLeft; sl = t.scrollLeft; });
      t.addEventListener('mouseleave', () => { down = false; });
      t.addEventListener('mouseup', () => { down = false; });
      t.addEventListener('mousemove', e => {
        if (!down) return; e.preventDefault();
        t.scrollLeft = sl - (e.pageX - t.offsetLeft - sx) * 1.6;
      });
    });
  }, []);

  return (
    <PageTransition>
      <div style={{ paddingTop: 'var(--nav-h)', minHeight: '80vh' }}>
        {/* ═══════════════════ 4 DAYS ═══════════════════ */}
        <section style={{ borderBottom: '2px dashed var(--border)' }}>
          <div style={{ padding: '60px 5%', maxWidth: 'var(--wrap)', margin: '0 auto' }}>
            <p className="section-label" data-anim="fade">Inside the Room</p>
            <p style={{ fontSize: '1.2rem', color: 'var(--beige)', fontWeight: 700 }} data-anim="up">4 days. One rhythm.</p>
          </div>
          <div className="hz-track" style={{ paddingLeft: '5%', paddingRight: '5%', paddingBottom: '60px' }}>
            {PROGRAMS.map((p, i) => (
              <div key={p.num} className="hz-item" data-anim="up" data-delay={String(i % 4 + 1)}>
                <div className="prog-card">
                  <div className="prog-card-num">DAY {p.num}</div>
                  <div className="prog-card-title">{p.title}</div>
                  <div className="prog-card-body">{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
