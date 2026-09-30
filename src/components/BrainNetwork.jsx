import React, { useRef, useEffect, useState } from 'react';
import brainImg from '../assets/brain.png';
import './BrainNetwork.css'; // Let's isolate its CSS to a separate file to keep it clean!

// Helper for easing
function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

// Helper to calculate progress within a window
function getLocalProgress(progress, start, end) {
  if (progress <= start) return 0;
  if (progress >= end) return 1;
  return easeInOutQuad((progress - start) / (end - start));
}

export default function BrainNetwork() {
  const wrapperRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!wrapperRef.current) return;
      const rect = wrapperRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // The total scrollable distance for this section is the wrapper's height minus the viewport height
      const totalScrollable = rect.height - windowHeight;
      // How far we have scrolled past the start of the wrapper
      const scrolled = -rect.top;
      
      let p = scrolled / totalScrollable;
      p = Math.max(0, Math.min(1, p)); // clamp to 0 - 1
      
      setScrollProgress(p);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial call
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Card specific progress  // Use a single progress for all cards to bring them in at the same time
  const p = getLocalProgress(scrollProgress, 0.1, 0.9);

  // Cards data - What you will learn
  const cards = [
    {
      id: 'tl',
      title: 'AI & Automation',
      desc: 'Master future toolchains',
      icon: 'M13 10V3L4 14h7v7l9-11h-7z', // Lightning
      progress: p,
      targetX: -32, // vw
      targetY: -28, // vh
      align: 'right'
    },
    {
      id: 'tr',
      title: 'UI/UX Innovation',
      desc: 'Design human-centric tech',
      icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5', // Layers
      progress: p,
      targetX: 32,
      targetY: -28,
      align: 'left'
    },
    {
      id: 'bl',
      title: 'Startup Scaling',
      desc: 'Build products that grow',
      icon: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z', // Hexagon
      progress: p,
      targetX: -32,
      targetY: 28,
      align: 'right'
    },
    {
      id: 'br',
      title: 'Deep Tech',
      desc: 'Explore the bleeding edge',
      icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', // Shield
      progress: p,
      targetX: 32,
      targetY: 28,
      align: 'left'
    },
  ];

  return (
    <section className="brain-network-wrapper" ref={wrapperRef}>
      <div className="brain-network-sticky">
        <div className="brain-section-header">
          <h2>What You'll <span>Learn</span></h2>
          <p>Four core pillars to elevate your career.</p>
        </div>
        
        {/* The SVG lines layer using 0-100 viewBox to map perfectly to vw/vh percentages */}
        <svg className="brain-lines-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="neonGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0055ff" />
              <stop offset="100%" stopColor="#8a2be2" />
            </linearGradient>
            <linearGradient id="neonGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ff1493" />
              <stop offset="100%" stopColor="#8a2be2" />
            </linearGradient>
            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          
          {/* Top Left Line: Starts at 50,50 goes to inner edge of card at 25,22 */}
          <path 
            className="brain-line"
            d="M50,50 C35,50 25,40 25,22" 
            stroke="url(#neonGrad1)" 
            pathLength="100"
            style={{ strokeDashoffset: 100 - (100 * p) }}
          />
          {/* Top Right Line: Starts at 50,50 goes to inner edge of card at 75,22 */}
          <path 
            className="brain-line"
            d="M50,50 C65,50 75,40 75,22" 
            stroke="url(#neonGrad2)" 
            pathLength="100"
            style={{ strokeDashoffset: 100 - (100 * p) }}
          />
          {/* Bottom Left Line: Starts at 50,50 goes to inner edge of card at 25,78 */}
          <path 
            className="brain-line"
            d="M50,50 C35,50 25,60 25,78" 
            stroke="url(#neonGrad2)" 
            pathLength="100"
            style={{ strokeDashoffset: 100 - (100 * p) }}
          />
          {/* Bottom Right Line: Starts at 50,50 goes to inner edge of card at 75,78 */}
          <path 
            className="brain-line"
            d="M50,50 C65,50 75,60 75,78" 
            stroke="url(#neonGrad1)" 
            pathLength="100"
            style={{ strokeDashoffset: 100 - (100 * p) }}
          />
        </svg>

        {/* Central Brain */}
        <div className="brain-center-container">
          <img src={brainImg?.src || brainImg} alt="Network Brain" className="brain-image" />
        </div>

        {/* Cards */}
        {cards.map((card) => (
          <div 
            key={card.id}
            className={`brain-card card-${card.id} align-${card.align}`}
            style={{
              opacity: card.progress,
              transform: `translate(-50%, -50%) translate(${card.targetX * card.progress}vw, ${card.targetY * card.progress}vh) scale(${0.5 + 0.5 * card.progress})`,
            }}
          >
            <div className="brain-card-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d={card.icon} />
              </svg>
            </div>
            <div className="brain-card-info">
              <h4 className="brain-card-name">{card.title}</h4>
              <p className="brain-card-stat">{card.desc}</p>
            </div>
          </div>
        ))}
        
      </div>
    </section>
  );
}
