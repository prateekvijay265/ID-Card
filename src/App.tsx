import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Home from './pages/Home';
import About from './pages/About';
import HowItWorks from './pages/HowItWorks';
import Community from './pages/Community';
import Generator from './pages/Generator';

export default function App() {
  const [navScrolled, setNavScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [backTopVis, setBackTopVis] = useState(false);
  const location = useLocation();

  /* ─── dismiss loader ─── */
  useEffect(() => {
    const tid = setTimeout(() => {
      document.getElementById('pageLoader')?.classList.add('out');
    }, 1200);
    return () => clearTimeout(tid);
  }, []);

  /* ─── scroll events ─── */
  useEffect(() => {
    const onScroll = () => {
      const sy = window.scrollY;
      setNavScrolled(sy > 60);
      setBackTopVis(sy > 500);
      const bar = document.getElementById('scrollProgress');
      if (bar) bar.style.width = (sy / (document.body.scrollHeight - window.innerHeight) * 100) + '%';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ─── Scroll to top on route change ─── */
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    setDrawerOpen(false);
  }, [location.pathname]);

  return (
    <>
      <div id="scrollProgress" />

      {/* PAGE LOADER */}
      <div id="pageLoader">
        <div className="loader-wordmark">HACKER HOUSE</div>
        <div className="loader-bar" />
        <div className="loader-sub">GOA, INDIA · 28 – 31 OCT 2026</div>
      </div>

      {/* NAV */}
      <header id="siteNav" className={navScrolled ? 'scrolled' : ''}>
        <div className="wrap nav-inner">
          <Link to="/" className="nav-logo" onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>
            <span className="nav-logo-mark">HACKER HOUSE</span>
          </Link>

          <nav className="nav-links" aria-label="Primary">
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/how-it-works" className="nav-link">How It Works</Link>
            <Link to="/community" className="nav-link">Community</Link>
            <a href="https://hacker-house-goa-2026.devfolio.co/" target="_blank" rel="noopener" className="nav-link" style={{color: 'var(--pink)'}}>Apply ↗</a>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link to="/generator" className="btn btn-primary" id="btn-nav-create">Get ID Card</Link>
            <button className={`hamburger${drawerOpen ? ' open' : ''}`} onClick={() => setDrawerOpen(o => !o)} aria-label="Menu" id="hamburger">
              <span /><span /><span />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE DRAWER */}
      <nav className={`mobile-drawer${drawerOpen ? ' open' : ''}`} aria-label="Mobile navigation">
        <Link to="/" className="drawer-link" onClick={() => setDrawerOpen(false)}>HOME</Link>
        <Link to="/about" className="drawer-link" onClick={() => setDrawerOpen(false)}>ABOUT</Link>
        <Link to="/how-it-works" className="drawer-link" onClick={() => setDrawerOpen(false)}>HOW IT WORKS</Link>
        <Link to="/community" className="drawer-link" onClick={() => setDrawerOpen(false)}>COMMUNITY</Link>
        <a href="https://hacker-house-goa-2026.devfolio.co/" className="drawer-link" onClick={() => setDrawerOpen(false)}>APPLY ↗</a>
        <div className="drawer-footer">
          <Link to="/generator" className="btn btn-primary" onClick={() => setDrawerOpen(false)} style={{ width: '100%', fontSize: '1.2rem', textAlign: 'center' }}>
            CREATE CARD
          </Link>
        </div>
      </nav>

      <div className="page-wrap">
        {/* MAIN ROUTING CONTENT WITH TRANSITIONS */}
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/community" element={<Community />} />
            <Route path="/generator" element={<Generator />} />
          </Routes>
        </AnimatePresence>

        {/* ═══════════════════ FOOTER ═══════════════════ */}
        <footer className="site-footer">
          <div className="wrap">
            <div className="footer-top">
              <div>
                <div className="footer-brand">HACKER HOUSE GOA</div>
                <p style={{ color: 'var(--beige-mute)', marginBottom: 20 }}>28 – 31 OCT 2026</p>
                <div style={{ display: 'flex', gap: 10 }}>
                  <a href="https://x.com/247pmstudio" className="btn btn-outline" style={{ padding: '8px 16px' }}>X / TWITTER</a>
                </div>
              </div>
              <div>
                <p style={{ color: 'var(--yellow)', fontWeight: 700, marginBottom: 16 }}>NAVIGATE</p>
                <nav className="footer-nav">
                  <Link to="/">Home</Link>
                  <Link to="/about">About</Link>
                  <Link to="/how-it-works">How It Works</Link>
                  <Link to="/community">Community</Link>
                </nav>
              </div>
              <div>
                <p style={{ color: 'var(--yellow)', fontWeight: 700, marginBottom: 16 }}>CREATE</p>
                <nav className="footer-nav">
                  <Link to="/generator">ID Card / PFP Frame</Link>
                </nav>
              </div>
              <div>
                <p style={{ color: 'var(--yellow)', fontWeight: 700, marginBottom: 16 }}>APPLY</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--beige-mute)', marginBottom: 16 }}>Ready to build your legacy?</p>
                <a href="https://hacker-house-goa-2026.devfolio.co/" target="_blank" rel="noopener" className="btn btn-pink">Submit Application</a>
              </div>
            </div>
            <div className="footer-bottom">
              <span>© 2026 HH-Goa. All rights reserved.</span>
              <a href="https://hhgoa.com" target="_blank" rel="noopener" style={{ color: 'var(--yellow)' }}>hhgoa.com ↗</a>
            </div>
          </div>
        </footer>
      </div>

      <button id="backTop" className={backTopVis ? 'visible' : ''} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>↑</button>
    </>
  );
}
