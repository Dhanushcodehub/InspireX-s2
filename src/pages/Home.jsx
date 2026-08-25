import React from 'react';
import Link from 'next/link';
import BrainNetwork from '../components/BrainNetwork';
import '../index.css';

export default function Home() {
  return (
    <>
      {/* ============ HERO ============ */}
      <section className="hero" id="home">
        <canvas id="heroCanvas"></canvas>
        <div className="hero-vignette"></div>
        <div className="hero-orb hero-orb-1"></div>
        <div className="hero-orb hero-orb-2"></div>
        <div className="hero-orb hero-orb-3"></div>
        <div className="wrap hero-split">
          <div className="hero-content">
            <div className="hero-eyebrow-row">
              <span className="powered-pill">
                <span className="pulse-dot"></span>
                Powered by <b>Connect Club</b>
              </span>
            </div>
            <h1>
              <div className="line"><span>Ignite Your</span></div>
              <div className="line"><span>Inspire X</span></div>
            </h1>
            <p className="hero-season">Season Two &nbsp;·&nbsp; 13 September 2026</p>
            <p className="hero-tagline">
              "Illuminating Minds, Building Bridges" — a day built around the people whose ideas change the way you see what's possible.
            </p>

            <div className="info-pills">
              <span className="info-pill">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2C8 2 5 5.5 5 9.5 5 15 12 22 12 22s7-7 7-12.5C19 5.5 16 2 12 2z"/>
                  <circle cx="12" cy="9.5" r="2.5"/>
                </svg>
                Vardhaman College of Engineering
              </span>
              <span className="info-pill">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="5" width="18" height="16" rx="2"/>
                  <path d="M3 10h18M8 3v4M16 3v4"/>
                </svg>
                13th September 2026 · 8:00 AM
              </span>
            </div>

            <div className="hero-actions">
              <Link href="/register" className="btn btn-primary" id="heroRegisterBtn">
                Secure Your Spot
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
              </Link>
              <a href="#speakers" className="secondary-btn">Explore Lineup</a>
            </div>

            <div className="countdown" id="countdown" aria-label="Countdown to event">
              <div className="count-box"><span className="num" id="cdDays">00</span><div className="lbl">Days</div></div>
              <div className="count-box"><span className="num" id="cdHrs">00</span><div className="lbl">Hours</div></div>
              <div className="count-box"><span className="num" id="cdMins">00</span><div className="lbl">Mins</div></div>
              <div className="count-box"><span className="num" id="cdSecs">00</span><div className="lbl">Secs</div></div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="ambient-plasma"></div>
            <div id="season-text-top">SEASON</div>
            <div id="season-text-bottom">2</div>
            <div id="earth-canvas-container"></div>
          </div>
        </div>
        <div className="scroll-cue">
          <div className="stick"></div>SCROLL
        </div>
      </section>

      {/* ============ BRAIN NETWORK ============ */}
      <BrainNetwork />

      {/* ============ ABOUT ============ */}
      <section className="about" id="about">
        <div className="wrap about-grid">
          <div className="reveal">
            <div className="eyebrow">The Idea</div>
            <p className="manifesto-quote">
              Season one asked students to look up.
              <em> Season two asks them to build something with what they saw.</em>
            </p>
            <p className="manifesto-body">
              InspireX is Connect Club's flagship speaker series — a single day where founders, creators, and people who've taken the harder, less-charted path sit across from students and talk honestly about how they got there. No stage-only distance. Real Q&amp;A, real conversations, and a room full of people figuring out their next move.
            </p>
          </div>
          <div className="stat-grid reveal">
            <div className="stat-cell">
              <div className="n"><span data-count="6" className="stat-num">0</span><span className="unit">+</span></div>
              <div className="l">Speakers</div>
            </div>
            <div className="stat-cell">
              <div className="n"><span data-count="4" className="stat-num">0</span><span className="unit">hrs</span></div>
              <div className="l">Live Talks</div>
            </div>
            <div className="stat-cell">
              <div className="n"><span data-count="1000" className="stat-num">0</span><span className="unit">+</span></div>
              <div className="l">Attendees Expected</div>
            </div>
            <div className="stat-cell">
              <div className="n"><span data-count="1" className="stat-num">0</span><span className="unit">day</span></div>
              <div className="l">Fully Packed</div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ SPEAKERS ============ */}
      <section className="speakers" id="speakers">
        <div className="wrap">
          <div className="section-head reveal">
            <div>
              <div className="eyebrow">The Lineup</div>
              <h2>Who's Talking</h2>
            </div>
            <p className="section-sub">A mix of founders, creators and specialists — three confirmed, three still being locked in.</p>
          </div>
          <div className="speaker-grid">
            <div className="speaker-card tilt reveal d1">
              <div className="speaker-bg-text">SWAROOP SWAROOP SWAROOP SWAROOP SWAROOP SWAROOP SWAROOP SWAROOP SWAROOP SWAROOP SWAROOP SWAROOP SWAROOP SWAROOP SWAROOP SWAROOP</div>
              <img src="speaker1-removebg-preview.png" className="speaker-img" alt="Swaroop" />
              <div className="speaker-info">
                <h3>Swaroop</h3>
                <div className="speaker-role">Keynote · Founder &amp; CEO</div>
              </div>
            </div>
            <div className="speaker-card tilt reveal d2">
              <div className="speaker-bg-text">NIHAR NIHAR NIHAR NIHAR NIHAR NIHAR NIHAR NIHAR NIHAR NIHAR NIHAR NIHAR NIHAR NIHAR NIHAR NIHAR NIHAR NIHAR NIHAR NIHAR NIHAR</div>
              <img src="speaker2-removebg-preview.png" className="speaker-img" alt="Nihar" />
              <div className="speaker-info">
                <h3>Nihar</h3>
                <div className="speaker-role">Innovation Leader</div>
              </div>
            </div>
            <div className="speaker-card tilt reveal d3">
              <div className="speaker-bg-text">SPEAKER SPEAKER SPEAKER SPEAKER SPEAKER SPEAKER SPEAKER SPEAKER SPEAKER SPEAKER SPEAKER SPEAKER SPEAKER SPEAKER SPEAKER SPEAKER</div>
              <img src="speaker1-removebg-preview.png" className="speaker-img" alt="Speaker 3" />
              <div className="speaker-info">
                <h3>Mystery Guest</h3>
                <div className="speaker-role">Author &amp; Podcaster</div>
              </div>
            </div>
            <div className="speaker-card locked tilt reveal d4">
              <div className="lock-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="4" y="10" width="16" height="10" rx="2"/>
                  <path d="M8 10V7a4 4 0 018 0v3"/>
                </svg>
              </div>
              <h3>Mystery Speaker</h3>
              <p>Reveal dropping soon</p>
            </div>
            <div className="speaker-card locked tilt reveal d5">
              <div className="lock-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="4" y="10" width="16" height="10" rx="2"/>
                  <path d="M8 10V7a4 4 0 018 0v3"/>
                </svg>
              </div>
              <h3>Mystery Speaker</h3>
              <p>Reveal dropping soon</p>
            </div>
            <div className="speaker-card locked tilt reveal d6">
              <div className="lock-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="4" y="10" width="16" height="10" rx="2"/>
                  <path d="M8 10V7a4 4 0 018 0v3"/>
                </svg>
              </div>
              <h3>Mystery Speaker</h3>
              <p>Reveal dropping soon</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ SCHEDULE ============ */}
      <section className="schedule" id="schedule">
        <div className="wrap">
          <div className="section-head reveal">
            <div>
              <div className="eyebrow">Run of Show</div>
              <h2>Event Schedule</h2>
            </div>
            <p className="section-sub">One day, tightly paced — placeholder times, lock in the real agenda once it's finalised.</p>
          </div>
          <div className="timeline">
            <div className="t-item reveal-left d1"><div className="t-time">08:00 AM</div><div className="t-dot"></div><div className="t-content"><h4>Registration &amp; Check-in</h4><p>Badge pickup, welcome kits, seating.</p></div></div>
            <div className="t-item reveal-left d2"><div className="t-time">09:00 AM</div><div className="t-dot"></div><div className="t-content"><h4>Opening Ceremony</h4><p>Welcome address from Connect Club leadership.</p></div></div>
            <div className="t-item reveal-left d3"><div className="t-time">09:30 AM</div><div className="t-dot"></div><div className="t-content"><h4>Keynote Session I</h4><p>Opening talk from a confirmed speaker.</p></div></div>
            <div className="t-item reveal-left d4"><div className="t-time">11:00 AM</div><div className="t-dot"></div><div className="t-content"><h4>Fireside Chat</h4><p>Open Q&amp;A, moderated conversation.</p></div></div>
            <div className="t-item reveal-left d5"><div className="t-time">01:00 PM</div><div className="t-dot"></div><div className="t-content"><h4>Networking Lunch</h4><p>Informal mixing between attendees and speakers.</p></div></div>
            <div className="t-item reveal-left d6"><div className="t-time">02:30 PM</div><div className="t-dot"></div><div className="t-content"><h4>Keynote Session II</h4><p>Afternoon headline talk.</p></div></div>
            <div className="t-item reveal-left" style={{ transitionDelay: "0.56s" }}><div className="t-time">04:30 PM</div><div className="t-dot"></div><div className="t-content"><h4>Closing &amp; Group Photo</h4><p>Wrap-up remarks and the official InspireX S2 photo.</p></div></div>
          </div>
        </div>
      </section>

      {/* ============ TEAM ============ */}
      <section className="team" id="team">
        <div className="wrap">
          <div className="section-head reveal">
            <div>
              <div className="eyebrow">Behind It</div>
              <h2>The Team</h2>
            </div>
            <p className="section-sub">The Connect Club organisers making Season 2 happen.</p>
          </div>
          <div className="team-grid">
            <div className="team-card reveal d1"><div className="team-avatar">EV</div><h4>Name Surname</h4><p>Event Director</p></div>
            <div className="team-card reveal d2"><div className="team-avatar">PL</div><h4>Name Surname</h4><p>Program Lead</p></div>
            <div className="team-card reveal d3"><div className="team-avatar">DL</div><h4>Name Surname</h4><p>Design Lead</p></div>
            <div className="team-card reveal d4"><div className="team-avatar">OL</div><h4>Name Surname</h4><p>Outreach Lead</p></div>
          </div>
        </div>
      </section>

      {/* ============ REVIEWS ============ */}
      <section className="reviews" id="reviews">
        <div className="wrap">
          <div className="section-head reveal">
            <div>
              <div className="eyebrow">Wall of Love</div>
              <h2>What People Say</h2>
            </div>
            <p className="section-sub">Hear from attendees and participants who have joined our previous editions.</p>
          </div>
          <div className="reviews-container reveal">
            <div className="reviews-grid" style={{ display: "contents" }}>
              {/* Column 1 */}
              <div className="review-col col-1">
                <div className="review-track">
                  <div className="review-card"><p>"Super fast and easy to join challenges with our college team. The sessions were well-structured and really helped me prepare for interviews."</p><div className="reviewer"><div className="reviewer-avatar">PN</div><div className="reviewer-info"><h4>Priya Nair</h4><span>Data Science Intern | IIT Delhi</span></div></div></div>
                  <div className="review-card"><p>"We used the platform for our 2024 tech fest and it made the registration process extremely easy. The team management features only required a 5 min setup."</p><div className="reviewer"><div className="reviewer-avatar" style={{ background: "linear-gradient(135deg,#80AAFF,#0055FF)" }}>VP</div><div className="reviewer-info"><h4>Vikram Patel</h4><span>DevOps Engineer | BITS Goa</span></div></div></div>
                  <div className="review-card"><p>"The sessions helped me explore AI and web development challenges more effectively. It was a great way to build and organize my work in one place."</p><div className="reviewer"><div className="reviewer-avatar" style={{ background: "linear-gradient(135deg,#00E5FF,#2EC4A0)" }}>SJ</div><div className="reviewer-info"><h4>Siddharth Joshi</h4><span>Frontend Developer | NIT Trichy</span></div></div></div>
                </div>
                <div className="review-track">
                  <div className="review-card"><p>"Super fast and easy to join challenges with our college team. The sessions were well-structured and really helped me prepare for interviews."</p><div className="reviewer"><div className="reviewer-avatar">PN</div><div className="reviewer-info"><h4>Priya Nair</h4><span>Data Science Intern | IIT Delhi</span></div></div></div>
                  <div className="review-card"><p>"We used the platform for our 2024 tech fest and it made the registration process extremely easy. The team management features only required a 5 min setup."</p><div className="reviewer"><div className="reviewer-avatar" style={{ background: "linear-gradient(135deg,#80AAFF,#0055FF)" }}>VP</div><div className="reviewer-info"><h4>Vikram Patel</h4><span>DevOps Engineer | BITS Goa</span></div></div></div>
                  <div className="review-card"><p>"The sessions helped me explore AI and web development challenges more effectively. It was a great way to build and organize my work in one place."</p><div className="reviewer"><div className="reviewer-avatar" style={{ background: "linear-gradient(135deg,#00E5FF,#2EC4A0)" }}>SJ</div><div className="reviewer-info"><h4>Siddharth Joshi</h4><span>Frontend Developer | NIT Trichy</span></div></div></div>
                </div>
              </div>
              {/* Column 2 */}
              <div className="review-col col-2">
                <div className="review-track">
                  <div className="review-card"><p>"Amazing and seamless experience registering for multiple hackathons! One profile for everything is a game changer."</p><div className="reviewer"><div className="reviewer-avatar" style={{ background: "linear-gradient(135deg,#00E5FF,#2EC4A0)" }}>SG</div><div className="reviewer-info"><h4>Sneha Gupta</h4><span>ML Researcher | IIT Kanpur</span></div></div></div>
                  <div className="review-card"><p>"Using the 1-Click registration made it easier to handle participants for our hackathon. It saved time and made the onboarding process more streamlined."</p><div className="reviewer"><div className="reviewer-avatar">RM</div><div className="reviewer-info"><h4>Rajiv Menon</h4><span>Hackathon Organizer | VIT Vellore</span></div></div></div>
                  <div className="review-card"><p>"I encouraged my peers to use the platform for events and projects. It's simple to manage signups and track contributions across challenges."</p><div className="reviewer"><div className="reviewer-avatar" style={{ background: "linear-gradient(135deg,#80AAFF,#0055FF)" }}>RA</div><div className="reviewer-info"><h4>Ritika Agarwal</h4><span>Student | Amrita University</span></div></div></div>
                </div>
                <div className="review-track">
                  <div className="review-card"><p>"Amazing and seamless experience registering for multiple hackathons! One profile for everything is a game changer."</p><div className="reviewer"><div className="reviewer-avatar" style={{ background: "linear-gradient(135deg,#00E5FF,#2EC4A0)" }}>SG</div><div className="reviewer-info"><h4>Sneha Gupta</h4><span>ML Researcher | IIT Kanpur</span></div></div></div>
                  <div className="review-card"><p>"Using the 1-Click registration made it easier to handle participants for our hackathon. It saved time and made the onboarding process more streamlined."</p><div className="reviewer"><div className="reviewer-avatar">RM</div><div className="reviewer-info"><h4>Rajiv Menon</h4><span>Hackathon Organizer | VIT Vellore</span></div></div></div>
                  <div className="review-card"><p>"I encouraged my peers to use the platform for events and projects. It's simple to manage signups and track contributions across challenges."</p><div className="reviewer"><div className="reviewer-avatar" style={{ background: "linear-gradient(135deg,#80AAFF,#0055FF)" }}>RA</div><div className="reviewer-info"><h4>Ritika Agarwal</h4><span>Student | Amrita University</span></div></div></div>
                </div>
              </div>
              {/* Column 3 */}
              <div className="review-col col-3">
                <div className="review-track">
                  <div className="review-card"><p>"Recommended this platform to our entire design club — onboarding was super easy, took less than 10 minutes to register the whole team."</p><div className="reviewer"><div className="reviewer-avatar" style={{ background: "linear-gradient(135deg,#80AAFF,#0055FF)" }}>MI</div><div className="reviewer-info"><h4>Meera Iyer</h4><span>Product Design Lead | IIIT Bangalore</span></div></div></div>
                  <div className="review-card"><p>"Set up took literally 5 minutes. The platform is very intuitive and quick — helped me discover hackathons I wouldn't have found otherwise. Highly recommend!"</p><div className="reviewer"><div className="reviewer-avatar" style={{ background: "linear-gradient(135deg,#00E5FF,#2EC4A0)" }}>AK</div><div className="reviewer-info"><h4>Aditya Kumar</h4><span>Open Source Contributor | DTU</span></div></div></div>
                  <div className="review-card"><p>"I found the ML challenges very engaging and useful for applying what I learned in class. It helped me get some attention during internship applications."</p><div className="reviewer"><div className="reviewer-avatar">NV</div><div className="reviewer-info"><h4>Neha Verma</h4><span>AI Research Intern | IIIT Hyderabad</span></div></div></div>
                </div>
                <div className="review-track">
                  <div className="review-card"><p>"Recommended this platform to our entire design club — onboarding was super easy, took less than 10 minutes to register the whole team."</p><div className="reviewer"><div className="reviewer-avatar" style={{ background: "linear-gradient(135deg,#80AAFF,#0055FF)" }}>MI</div><div className="reviewer-info"><h4>Meera Iyer</h4><span>Product Design Lead | IIIT Bangalore</span></div></div></div>
                  <div className="review-card"><p>"Set up took literally 5 minutes. The platform is very intuitive and quick — helped me discover hackathons I wouldn't have found otherwise. Highly recommend!"</p><div className="reviewer"><div className="reviewer-avatar" style={{ background: "linear-gradient(135deg,#00E5FF,#2EC4A0)" }}>AK</div><div className="reviewer-info"><h4>Aditya Kumar</h4><span>Open Source Contributor | DTU</span></div></div></div>
                  <div className="review-card"><p>"I found the ML challenges very engaging and useful for applying what I learned in class. It helped me get some attention during internship applications."</p><div className="reviewer"><div className="reviewer-avatar">NV</div><div className="reviewer-info"><h4>Neha Verma</h4><span>AI Research Intern | IIIT Hyderabad</span></div></div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="faq" id="faq">
        <div className="wrap">
          <div className="section-head reveal">
            <div>
              <div className="eyebrow">Good to Know</div>
              <h2>FAQ</h2>
            </div>
          </div>
          <div className="faq-list reveal">
            <div className="faq-item open">
              <button className="faq-q">Who can register for InspireX?<span className="plus"></span></button>
              <div className="faq-a"><p>Any student is welcome — this isn't limited to a single college or branch. Update this once your registration policy is final.</p></div>
            </div>
            <div className="faq-item">
              <button className="faq-q">Is there a registration fee?<span className="plus"></span></button>
              <div className="faq-a"><p>Add your fee details here, or state clearly that entry is free for this edition.</p></div>
            </div>
            <div className="faq-item">
              <button className="faq-q">Will certificates be provided?<span className="plus"></span></button>
              <div className="faq-a"><p>Yes — all registered attendees who check in on the day receive a participation certificate.</p></div>
            </div>
            <div className="faq-item">
              <button className="faq-q">Where do I get updates before the event?<span className="plus"></span></button>
              <div className="faq-a"><p>Follow Connect Club's official channels linked in the footer for speaker reveals and schedule updates.</p></div>
            </div>
            <div className="faq-item">
              <button className="faq-q">Can I attend if I'm from a different college?<span className="plus"></span></button>
              <div className="faq-a"><p>Yes — InspireX is open to students from all institutions. Bring your student ID and your confirmation email on the day.</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ REGISTER CTA ============ */}
      <section className="reg-cta" id="register">
        <div className="wrap">
          <div className="reveal">
            <div className="eyebrow" style={{ justifyContent: "center" }}>Secure Your Spot</div>
            <h2>Ready to Join the <span>Movement?</span></h2>
            <p>Takes under a minute. You'll get a confirmation with your entry pass. Seats are limited — don't miss out.</p>
            <div className="reg-cta-pills">
              <span className="reg-cta-pill">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>
                13 September 2026
              </span>
              <span className="reg-cta-pill">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2C8 2 5 5.5 5 9.5 5 15 12 22 12 22s7-7 7-12.5C19 5.5 16 2 12 2z"/><circle cx="12" cy="9.5" r="2.5"/></svg>
                Vardhaman College, Hyderabad
              </span>
              <span className="reg-cta-pill">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Open to All Students
              </span>
            </div>
            <Link href="/register" className="btn btn-primary">
              Register Now — It's Free
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
