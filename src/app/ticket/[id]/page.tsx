"use client";
import React, { useEffect, useState, useRef } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { CheckCircle, Download, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function TicketPage({ params }: { params: Promise<{ id: string }> }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  
  const ticketRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 3D Parallax State
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [5, -5]);
  const rotateY = useTransform(x, [-100, 100], [-5, 5]);

  useEffect(() => {
    if (data && !loading) {
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#00e5ff', '#fff', '#1a1a2e']
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#00e5ff', '#fff', '#1a1a2e']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [data, loading]);

  useEffect(() => {
    async function fetchData() {
      try {
        const resolvedParams = await params;
        const docRef = doc(db, "registrations", resolvedParams.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setData({ id: docSnap.id, ...docSnap.data() });
          
          // Trigger Confetti on successful load
          setTimeout(() => {
            const duration = 3 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
      
            const interval: any = setInterval(function() {
              const timeLeft = animationEnd - Date.now();
      
              if (timeLeft <= 0) {
                return clearInterval(interval);
              }
      
              const particleCount = 50 * (timeLeft / duration);
              confetti({ ...defaults, particleCount, origin: { x: Math.random(), y: Math.random() - 0.2 } });
            }, 250);
          }, 500);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [params]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    // Calculate mouse position relative to center of container
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Check if prefers-reduced-motion is active
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const downloadTicket = async () => {
    if (!ticketRef.current || !data) return;
    setIsDownloading(true);
    
    try {
      await new Promise(r => setTimeout(r, 100));

      const canvas = await html2canvas(ticketRef.current, { 
        scale: 3, 
        useCORS: true, 
        backgroundColor: '#11111a',
        onclone: (clonedDoc) => {
          // Show PDF footer
          const pdfFooter = clonedDoc.getElementById('pdf-only-footer');
          if (pdfFooter) pdfFooter.style.display = 'block';
          
          // Hide elements that break html2canvas
          const noise = clonedDoc.getElementById('noise-overlay');
          if (noise) noise.style.display = 'none';
          const foil = clonedDoc.getElementById('holographic-foil');
          if (foil) foil.style.display = 'none';

          // FORCE desktop layout and strip problematic CSS
          const ticketWrapper = clonedDoc.getElementById('ticket-inner-static');
          if (ticketWrapper) {
            ticketWrapper.style.width = '1000px';
            ticketWrapper.style.minWidth = '1000px';
            ticketWrapper.style.transform = 'none';
            ticketWrapper.style.boxShadow = 'none'; // Removes the huge grey padding
            ticketWrapper.classList.remove('ticket-wrapper-premium'); // Removes the fake black cutouts
            ticketWrapper.style.borderRadius = '0'; // Flat edges for PDF
          }
          
          const flexRow = clonedDoc.getElementById('ticket-flex-row');
          if (flexRow) {
            flexRow.style.flexDirection = 'row';
          }
          
          const leftSide = clonedDoc.getElementById('ticket-left-side');
          if (leftSide) {
             leftSide.style.borderRight = '2px solid rgba(255,255,255,0.1)'; // Fix dashed border not rendering
          }
        }
      });
      
      const imgData = canvas.toDataURL('image/png', 1.0);
      
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width / 3, canvas.height / 3]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 3, canvas.height / 3);
      
      const userName = (data.name || 'Guest').replace(/\s+/g, '_');
      pdf.save(`${userName}_InspireX_Ticket.pdf`);

      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);

    } catch (error) {
      console.error("Failed to generate PDF:", error);
      alert("There was an issue downloading your ticket. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#09090b' }}>
        <Loader2 className="lucide-spin" style={{ color: 'var(--volt)', width: '40px', height: '40px' }} />
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexDirection: 'column', background: '#09090b' }}>
        <h1>Ticket Not Found</h1>
        <p style={{ color: 'var(--muted)' }}>This registration does not exist or was deleted.</p>
        <Link href="/" className="btn btn-primary" style={{ marginTop: '20px' }}>Go Home</Link>
      </div>
    );
  }

  const name = data.name || 'Guest';
  const branch = data.branch || 'Unknown Branch';
  const roll = data.rollNo || 'N/A';
  const ticketId = data.id.substring(0, 8).toUpperCase();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: '120px 20px 60px', // Increased top padding to clear the navbar
      position: 'relative',
      zIndex: 10,
      background: 'transparent',
      overflowX: 'hidden' // Allow vertical scrolling on mobile!
    }}>
      
      {/* Toast Notification */}
      <div className={`ticket-toast ${showToast ? 'visible' : ''}`}>
        <CheckCircle size={20} color="var(--volt)" />
        <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>Ticket downloaded successfully!</span>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ textAlign: 'center', marginBottom: '40px', position: 'relative', zIndex: 2 }}
      >
        <div className="eyebrow" style={{ justifyContent: 'center', color: 'var(--volt)' }}>Registration Confirmed</div>
        <h1 style={{ fontSize: '3rem', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          You're in. <CheckCircle size={40} color="var(--volt)" />
        </h1>
        <p style={{ color: 'var(--muted)', maxWidth: '450px', margin: '0 auto', fontSize: '1.1rem' }}>
          Download this ticket and keep it safe. You'll need it for check-in on the day of the event.
        </p>
      </motion.div>

      {/* Ticket Wrapper with Parallax */}
      <motion.div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ 
          perspective: 1000, 
          width: '100%', 
          display: 'flex', 
          justifyContent: 'center',
          padding: '20px 0',
          zIndex: 2
        }}
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 100, delay: 0.2 }}
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
            width: '100%',
            maxWidth: '1000px',
          }}
        >
          {/* Main Ticket Silhouette with Mask */}
          <div 
            id="ticket-inner-static"
            ref={ticketRef}
            className="ticket-wrapper-premium"
            style={{
              display: 'flex',
              flexDirection: 'column', 
              width: '100%',
              minHeight: '320px',
              background: 'linear-gradient(135deg, #11111a 0%, #1a1a2e 100%)',
              borderRadius: '24px',
              boxShadow: '0 30px 60px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.1)',
              color: '#fff',
              position: 'relative',
              overflow: 'hidden' // Important so holographic foil doesn't spill out
            }}
          >
            
            {/* SVG Noise Texture Overlay */}
            <div id="noise-overlay" style={{
              position: 'absolute', inset: 0, opacity: 0.2, mixBlendMode: 'overlay', pointerEvents: 'none',
              backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")'
            }}></div>

            {/* InspireX Watermark */}
            <div className="ticket-watermark">INSPIRE X</div>

            {/* Holographic Foil Strip */}
            <div id="holographic-foil" className="holographic-foil" style={{
              position: 'absolute', left: 0, top: 0, bottom: 0, width: '12px', borderTopLeftRadius: '24px', borderBottomLeftRadius: '24px'
            }}></div>

            <div id="ticket-flex-row" className="ticket-layout-wrapper">
              {/* Left Side (Main) */}
              <div id="ticket-left-side" className="ticket-left-side">
                <div className="ticket-header-row">
                  <div>
                    <h2 style={{ fontSize: '2rem', margin: 0, color: '#00e5ff', fontFamily: 'var(--font-display)', fontWeight: 800, textShadow: '0 0 20px rgba(0,229,255,0.3)' }}>InspireX</h2>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.3em', fontWeight: 600 }}>SEASON TWO</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="info-label" style={{ marginBottom: '2px' }}>Ticket Type</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: 700, color: '#fff', letterSpacing: '1px' }}>GENERAL ADMISSION</div>
                  </div>
                </div>

                <div style={{ margin: '30px 0' }}>
                  <div className="info-label" style={{ letterSpacing: '0.2em', marginBottom: '8px', fontWeight: 600 }}>Admit One</div>
                  <div className="ticket-name-display" style={{ fontWeight: 800, fontFamily: 'var(--font-display)', lineHeight: 1, textTransform: 'uppercase', letterSpacing: '-0.03em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</div>
                  <div style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)', marginTop: '8px', fontWeight: 500 }}>{branch} · {roll}</div>
                </div>

                <div className="ticket-info-row">
                  <div>
                    <div className="info-label">Date</div>
                    <div className="info-value">13 Sept 2026</div>
                  </div>
                  <div>
                    <div className="info-label">Time</div>
                    <div className="info-value">08:00 AM</div>
                  </div>
                  <div>
                    <div className="info-label">Venue</div>
                    <div className="info-value">Vardhaman College</div>
                  </div>
                </div>
              </div>

              {/* Right Side (Stub) */}
              <div className="ticket-right-side">
                <div style={{ background: 'white', padding: '16px', borderRadius: '16px', marginBottom: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.4)', position: 'relative' }}>
                  <QRCodeSVG value={roll} size={130} level={"H"} />
                </div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '4px', textAlign: 'center' }}>Scan to check in</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', fontWeight: 800, color: '#fff', letterSpacing: '3px', marginTop: '10px' }}>{ticketId}</div>
                
                {/* Decorative Barcode */}
                <div style={{ marginTop: '20px', height: '30px', width: '100%', backgroundImage: 'repeating-linear-gradient(to right, #fff 0, #fff 2px, transparent 2px, transparent 5px, #fff 5px, #fff 6px, transparent 6px, transparent 10px, #fff 10px, #fff 14px, transparent 14px, transparent 15px)', opacity: 0.2 }}></div>
              </div>
            </div>

            {/* Hidden PDF Footer (Injected during html2canvas onclone) */}
            <div id="pdf-only-footer" style={{ display: 'none', width: '100%', padding: '20px 40px', background: '#09090b', borderTop: '1px solid rgba(255,255,255,0.1)', zIndex: 10, marginTop: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>
                <div><strong>Terms:</strong> Non-transferable. Valid ID required matching registration roll number.</div>
                <div><strong>Support:</strong> contact@connectclub.com</div>
              </div>
            </div>

          </div>
        </motion.div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        style={{ marginTop: '50px', display: 'flex', gap: '20px', alignItems: 'center', zIndex: 2 }}
      >
        <button 
          className="btn" 
          onClick={downloadTicket} 
          disabled={isDownloading}
          style={{ 
            cursor: isDownloading ? 'wait' : 'pointer',
            background: 'linear-gradient(135deg, var(--ember) 0%, var(--volt) 100%)',
            border: 'none',
            padding: '16px 32px',
            fontSize: '1.1rem',
            fontWeight: 600,
            color: '#fff',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 10px 20px rgba(0,229,255,0.3)',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          {isDownloading ? (
            <><Loader2 className="lucide-spin" size={20} /> Generating PDF...</>
          ) : (
            <><Download size={20} /> Download Ticket PDF</>
          )}
        </button>
        <Link href="/" className="secondary-btn" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', padding: '16px 24px', borderRadius: '12px' }}>
          Return Home
        </Link>
      </motion.div>
    </div>
  );
}
