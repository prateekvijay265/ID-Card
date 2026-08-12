import { useState, useEffect } from 'react';
import PageTransition from '../components/PageTransition';
import { FAQS, TESTIMONIALS } from '../data';

export default function Community() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  /* ─── intersection observer (reveal) ─── */
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('anim-in'); obs.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
    document.querySelectorAll('[data-anim]').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <PageTransition>
      <div style={{ paddingTop: 'var(--nav-h)', minHeight: '80vh' }}>
        {/* ═══════════════════ TESTIMONIALS ═══════════════════ */}
        <section className="s" style={{ borderBottom: '2px dashed var(--border)' }}>
          <div className="wrap">
            <p className="section-label" data-anim="fade">Community</p>
            <h2 className="section-title" data-anim="up">From the Room.</h2>
            <div className="testi-grid">
              {TESTIMONIALS.map((t, i) => (
                <div key={t.name} className="testi-card" data-anim="up" data-delay={String(i + 1)}>
                  <div className="testi-mark">"</div>
                  <p className="testi-body">"{t.q}"</p>
                  <div>
                    <div className="testi-name">{t.name}</div>
                    <div className="testi-role">{t.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════ FAQ ═══════════════════ */}
        <section className="s" style={{ borderBottom: '2px dashed var(--border)' }}>
          <div className="wrap-sm">
            <p className="section-label" data-anim="fade">FAQs</p>
            <h2 className="section-title" data-anim="up">Questions?</h2>
            <div style={{ borderTop: '2px solid var(--border)' }}>
              {FAQS.map((f, i) => (
                <div key={i} className={`faq-item${openFaq === i ? ' open' : ''}`} data-anim="up" data-delay={String(i % 4 + 1)}>
                  <button className="faq-trigger" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    {f.q}
                    <span className="faq-arrow">+</span>
                  </button>
                  <div className="faq-body">{f.a}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
