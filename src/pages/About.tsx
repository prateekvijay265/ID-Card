import { useEffect } from 'react';
import PageTransition from '../components/PageTransition';

export default function About() {
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
        <section className="s" style={{ borderBottom: '2px dashed var(--border)' }}>
          <div className="wrap">
            <p className="section-label" data-anim="fade">The Concept</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 60, alignItems: 'center' }}>
              <div>
                <h2 className="section-title" data-anim="up">Build. Break. <br/>Build Better.</h2>
                <p style={{ fontSize: '1rem', color: 'var(--beige-mute)', marginBottom: 24 }} data-anim="up" data-delay="1">
                  Most hackathons are just hype and no substance. We're changing that. From October 28–31, we're taking over Goa for the country's biggest build-station.
                </p>
              </div>
              <div data-anim="fade" data-delay="2">
                <div style={{ border: '4px solid var(--yellow)', padding: '8px', background: 'var(--green-light)', transform: 'rotate(2deg)' }}>
                  <img src="/card_bg.jpg" alt="Vintage Goa" style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover' }} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
