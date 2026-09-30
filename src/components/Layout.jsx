'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { initAnimations, destroyEarth } from '../animations';

export default function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isRegister = pathname === '/register';

  useEffect(() => {
    setMenuOpen(false); // Close menu on route change
    window.scrollTo(0, 0); // Scroll to top
    
    // Animation Lifecycle based on route change (migrated from App.jsx)
    destroyEarth();
    const timer = setTimeout(() => {
      initAnimations();
    }, 150);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      {/* Global UI */}
      <div className="glow-orb volt"></div>
      <div className="glow-orb ember"></div>
      <canvas id="sparkCanvas"></canvas>
      <div id="cursorGlow"></div>
      <div id="ignitionMeter"></div>

      {/* Navigation */}
      <header>
        <div className={`nav-glass ${menuOpen ? 'scrolled' : ''}`}>
          <nav className="wrap">
            <Link href="/" className="logo">
              <span className="mark"></span>INSPIRE X <span className="season-tag">Season2</span>
            </Link>
            
            {!isRegister && (
              <div className="nav-links" id="navLinks">
                <a href="/#home" className="active">Home</a>
                <a href="/#about">About</a>
                <a href="/#speakers">Speakers</a>
                <a href="/#schedule">Schedule</a>
                <a href="/#team">Team</a>
                <a href="/#reviews">Reviews</a>
                <a href="/#faq">FAQ</a>
              </div>
            )}

            <Link href="/register" className="nav-cta">
              Register Now
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M13 6l6 6-6 6"/>
              </svg>
            </Link>

            <button 
              className={`burger ${menuOpen ? 'open' : ''}`} 
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span></span><span></span><span></span>
            </button>
          </nav>
        </div>
        
        <div className={`mobile-panel ${menuOpen ? 'open' : ''}`}>
          {!isRegister && (
            <>
              <a href="/#home" onClick={() => setMenuOpen(false)}>Home</a>
              <a href="/#about" onClick={() => setMenuOpen(false)}>About</a>
              <a href="/#speakers" onClick={() => setMenuOpen(false)}>Speakers</a>
              <a href="/#schedule" onClick={() => setMenuOpen(false)}>Schedule</a>
              <a href="/#team" onClick={() => setMenuOpen(false)}>Team</a>
              <a href="/#reviews" onClick={() => setMenuOpen(false)}>Reviews</a>
              <a href="/#faq" onClick={() => setMenuOpen(false)}>FAQ</a>
            </>
          )}
          <Link href="/register" className="nav-cta" onClick={() => setMenuOpen(false)}>
            Register Now →
          </Link>
        </div>
      </header>

      {/* Page Content */}
      <main>
        {children}
      </main>

      {/* Footer */}
      <footer>
        <div className="wrap">
          <div className="footer-top">
            <div className="footer-brand">
              <Link href="/" className="logo">
                <span className="mark"></span>INSPIRE X
              </Link>
              <p>Illuminating Minds, Building Bridges.<br/>Join us for an unforgettable day of discovery and innovation.</p>
              <div className="socials">
                <a href="#" className="social-btn" aria-label="Twitter">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                </a>
                <a href="#" className="social-btn" aria-label="Instagram">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                </a>
                <a href="#" className="social-btn" aria-label="LinkedIn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
                </a>
              </div>
            </div>
            <div className="footer-col">
              <h5>Event</h5>
              <a href="#about">About Season 2</a>
              <a href="#speakers">Speaker Lineup</a>
              <a href="#schedule">Schedule</a>
              <a href="#faq">FAQ</a>
            </div>
            <div className="footer-col">
              <h5>Connect</h5>
              <a href="#">Contact Us</a>
              <a href="#">Become a Sponsor</a>
              <a href="#">Join the Team</a>
              <a href="#">Code of Conduct</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2026 Connect Club. All rights reserved.</p>
            <p>Designed for the future.</p>
            <button className="to-top" aria-label="Back to top" onClick={() => window.scrollTo(0,0)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
            </button>
          </div>
        </div>
        <div className="footer-fade-text">INSPIRE X</div>
      </footer>
    </>
  );
}
