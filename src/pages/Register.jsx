import React, { useState, useRef } from 'react';
import '../index.css';
import { submitRegistration } from '../services/registrationService';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export default function Register() {
  const [currentStep, setCurrentStep] = useState(1);
  const [registrationId, setRegistrationId] = useState('');
  
  const [formData, setFormData] = useState({
    fname: '',
    roll: '',
    email: '',
    phone: '',
    college: '',
    branch: '',
    year: '',
    regType: 'solo',
    groupAction: 'create',
    groupCode: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const ticketRef = useRef(null);

  const handleInputChange = (e) => {
    const key = e.target.name || e.target.id;
    setFormData({
      ...formData,
      [key]: e.target.value
    });
  };

  const handleStep1Submit = (e) => {
    e.preventDefault();
    setCurrentStep(2);
  };

  const handleStep2Submit = () => {
    setCurrentStep(3);
  };

  const handlePayment = async () => {
    setIsSubmitting(true);
    
    try {
      const result = await submitRegistration({
        name: formData.fname,
        branch: formData.branch,
        rollNo: formData.roll,
        year: formData.year,
        email: formData.email
      });
      
      const docId = typeof result === 'string' ? result : (result?.id || 'INX-' + Math.floor(100000 + Math.random() * 900000));
      window.location.href = `/ticket/${docId}`;
      
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const downloadTicket = async () => {
    if (!ticketRef.current) return;
    
    try {
      const canvas = await html2canvas(ticketRef.current, {
        scale: 2,
        backgroundColor: '#0C0C0E',
        useCORS: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`InspireX_Ticket_${formData.fname.replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
      console.error("Failed to generate ticket PDF", err);
      alert("Failed to download ticket. Please try again.");
    }
  };

  return (
    <main className="reg-layout">

      {/* ── LEFT: BRANDING PANEL ── */}
      <div className="reg-left">
        <div className="reg-left-content">
          <div className="reg-brand-logo">
            <div className="eyebrow">Connect Club Presents</div>
            <h1 className="reg-heading">
              Secure<br />Your<br /><span>Spot</span>
            </h1>
            <p className="reg-subtext">
              Join 1,000+ students, founders, and thinkers for a day of real talks from people who've actually done it. No theory — just honest stories and sharp ideas.
            </p>
          </div>

          <div className="reg-details">
            <div className="reg-detail-row">
              <div className="reg-detail-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>
              </div>
              <div className="reg-detail-body">
                <strong>13th September 2026</strong>
                <span>8:00 AM onwards · One packed day</span>
              </div>
            </div>
            <div className="reg-detail-row">
              <div className="reg-detail-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2C8 2 5 5.5 5 9.5 5 15 12 22 12 22s7-7 7-12.5C19 5.5 16 2 12 2z"/><circle cx="12" cy="9.5" r="2.5"/></svg>
              </div>
              <div className="reg-detail-body">
                <strong>Vardhaman College of Engineering</strong>
                <span>Hyderabad, Telangana</span>
              </div>
            </div>
            <div className="reg-detail-row">
              <div className="reg-detail-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M9 13h6M9 17h4"/></svg>
              </div>
              <div className="reg-detail-body">
                <strong>Participation Certificate</strong>
                <span>Issued digitally to all attendees</span>
              </div>
            </div>
            <div className="reg-detail-row">
              <div className="reg-detail-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <div className="reg-detail-body">
                <strong>Open to All Students</strong>
                <span>Any college, any branch, any year</span>
              </div>
            </div>
          </div>

          {/* Mini countdown */}
          <div>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "0.1em", color: "var(--muted-2)", textTransform: "uppercase", marginBottom: "12px" }}>Event starts in</p>
            <div className="reg-countdown" aria-label="Countdown to event">
              <div className="reg-count-box"><span className="num" id="cd-days">00</span><div className="lbl">Days</div></div>
              <div className="reg-count-box"><span className="num" id="cd-hours">00</span><div className="lbl">Hrs</div></div>
              <div className="reg-count-box"><span className="num" id="cd-mins">00</span><div className="lbl">Mins</div></div>
              <div className="reg-count-box"><span className="num" id="cd-secs">00</span><div className="lbl">Secs</div></div>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT: FORM PANEL ── */}
      <div className="reg-right">
        <div className="reg-form-wrap">
          <div className="reg-form-eyebrow">
            <div className="eyebrow">Registration Wizard</div>
            <h2 className="reg-form-title">Secure Your Spot</h2>
            <p className="reg-form-sub" id="formSubtitle">
              {currentStep === 1 && "Step 1: Your Details"}
              {currentStep === 2 && "Step 2: Review Information"}
              {currentStep === 3 && "Step 3: Complete Payment"}
              {currentStep === 4 && "You're all set!"}
            </p>
          </div>

          <div className="form-card">
            {/* Progress Bar */}
            <div className="wizard-progress" id="wizardProgress">
              <div className={`wizard-step-dot ${currentStep >= 1 ? 'active' : ''}`} id="dot-1">1</div>
              <div className={`wizard-step-dot ${currentStep >= 2 ? 'active' : ''}`} id="dot-2">2</div>
              <div className={`wizard-step-dot ${currentStep >= 3 ? 'active' : ''}`} id="dot-3">3</div>
              <div className={`wizard-step-dot ${currentStep >= 4 ? 'active' : ''}`} id="dot-4">4</div>
            </div>

            {/* STEP 1: DETAILS */}
            {currentStep === 1 && (
              <div className="wizard-step active" id="step-1">
                <form id="regForm" onSubmit={handleStep1Submit}>
                  <div className="field-row" style={{ marginBottom: "0" }}>
                    <div className="field" id="field-fname">
                      <label htmlFor="fname">Full Name *</label>
                      <input id="fname" type="text" placeholder="Your full name" autoComplete="name" value={formData.fname} onChange={handleInputChange} required />
                      <span className="field-error">Please enter your name</span>
                    </div>
                    <div className="field" id="field-roll">
                      <label htmlFor="roll">Roll Number *</label>
                      <input id="roll" type="text" placeholder="e.g. 21VE1A0501" value={formData.roll} onChange={handleInputChange} required />
                      <span className="field-error">Enter roll number</span>
                    </div>
                  </div>

                  <div className="field-row" style={{ marginBottom: "0" }}>
                    <div className="field" id="field-email">
                      <label htmlFor="email">Email Address *</label>
                      <input id="email" type="email" placeholder="you@example.com" autoComplete="email" value={formData.email} onChange={handleInputChange} required />
                      <span className="field-error">Enter a valid email</span>
                    </div>
                    <div className="field" id="field-phone">
                      <label htmlFor="phone">Phone Number *</label>
                      <input id="phone" type="tel" placeholder="10-digit number" autoComplete="tel" value={formData.phone} onChange={handleInputChange} required />
                      <span className="field-error">Enter 10 digits</span>
                    </div>
                  </div>

                  <div className="field-row" style={{ marginBottom: "0" }}>
                    <div className="field" id="field-college">
                      <label htmlFor="college">College Name *</label>
                      <input id="college" type="text" placeholder="e.g. Vardhaman College" value={formData.college} onChange={handleInputChange} required />
                      <span className="field-error">Enter your college</span>
                    </div>
                    <div className="field" id="field-branch">
                      <label htmlFor="branch">Branch *</label>
                      <input id="branch" type="text" placeholder="e.g. CSE" value={formData.branch} onChange={handleInputChange} required />
                      <span className="field-error">Enter your branch</span>
                    </div>
                  </div>

                  <div className="field" id="field-year">
                    <label htmlFor="year">Year of Study *</label>
                    <select id="year" value={formData.year} onChange={handleInputChange} required>
                      <option value="">Select year</option>
                      <option>1st Year</option>
                      <option>2nd Year</option>
                      <option>3rd Year</option>
                      <option>4th Year</option>
                      <option>Other / Working</option>
                    </select>
                    <span className="field-error">Select your year</span>
                  </div>

                  <label style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "8px", display: "block" }}>Registration Type *</label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input type="radio" name="regType" value="solo" checked={formData.regType === 'solo'} onChange={handleInputChange} />
                      Register Solo
                    </label>
                    <label className="radio-label">
                      <input type="radio" name="regType" value="group" checked={formData.regType === 'group'} onChange={handleInputChange} />
                      Register as Group
                    </label>
                  </div>

                  {formData.regType === 'group' && (
                    <div id="groupLogicWrap">
                      <div className="radio-group" style={{ marginBottom: "12px" }}>
                        <label className="radio-label" style={{ fontSize: "11px", padding: "8px" }}>
                          <input type="radio" name="groupAction" value="create" checked={formData.groupAction === 'create'} onChange={handleInputChange} />
                          Create New Group
                        </label>
                        <label className="radio-label" style={{ fontSize: "11px", padding: "8px" }}>
                          <input type="radio" name="groupAction" value="join" checked={formData.groupAction === 'join'} onChange={handleInputChange} />
                          Join Existing
                        </label>
                      </div>

                      {formData.groupAction === 'join' && (
                        <div className="field" id="field-groupCode">
                          <input id="groupCode" type="text" placeholder="Enter Group Code (e.g. GRP-1234)" value={formData.groupCode} onChange={handleInputChange} />
                          <span className="field-error" id="groupCodeError">Invalid Group Code</span>
                        </div>
                      )}
                      
                      {formData.groupAction === 'create' && (
                        <div className="group-status" id="groupStatusDisplay">Create a group to unlock a free 6th ticket!</div>
                      )}
                    </div>
                  )}

                  <div className="price-display">
                    <div style={{ fontSize: "12px", color: "var(--muted)" }}>Total Amount Payable</div>
                    <div className="price-val" id="priceDisplay">₹499</div>
                  </div>

                  <button type="submit" className="btn btn-primary submit-btn" id="btnNext1">
                    Next Step: Review Details
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                  </button>
                </form>
              </div>
            )}

            {/* STEP 2: REVIEW */}
            {currentStep === 2 && (
              <div className="wizard-step active" id="step-2">
                <div className="review-list">
                  <div className="review-item"><span>Full Name</span><span>{formData.fname}</span></div>
                  <div className="review-item"><span>Roll Number</span><span>{formData.roll}</span></div>
                  <div className="review-item"><span>Email</span><span>{formData.email}</span></div>
                  <div className="review-item"><span>Phone</span><span>{formData.phone}</span></div>
                  <div className="review-item"><span>College</span><span>{formData.college}</span></div>
                  <div className="review-item"><span>Branch &amp; Year</span><span>{formData.branch} - {formData.year}</span></div>
                  
                  {formData.regType === 'group' && (
                    <div className="review-item" id="rev-group-row">
                      <span>Group Action</span>
                      <span style={{ color: "var(--volt)" }}>
                        {formData.groupAction === 'create' ? "Creating New Group" : `Joining: ${formData.groupCode}`}
                      </span>
                    </div>
                  )}
                </div>

                <div className="price-display" style={{ background: "var(--ink-soft)", borderColor: "var(--line-hi)" }}>
                  <div style={{ fontSize: "12px", color: "var(--muted)" }}>Final Amount to Pay</div>
                  <div className="price-val" id="finalPriceDisplay">₹499</div>
                </div>

                <div className="btn-group">
                  <button type="button" className="btn secondary-btn" id="btnBack2" onClick={() => setCurrentStep(1)}>Edit Details</button>
                  <button type="button" className="btn btn-primary" id="btnNext2" onClick={handleStep2Submit}>Proceed to Payment</button>
                </div>
              </div>
            )}

            {/* STEP 3: PAYMENT */}
            {currentStep === 3 && (
              <div className="wizard-step active" id="step-3">
                <div className="mock-payment">
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "18px", marginBottom: "8px" }}>Scan to Pay</h3>
                  <p style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "20px" }}>Use any UPI app to complete the transaction.</p>
                  <div className="mock-qr">
                    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" width="100" height="100">
                      <rect width="100" height="100" fill="#fff"/>
                      <path d="M10 10h30v30H10V10zm10 10h10v10H20V20zM60 10h30v30H60V10zm10 10h10v10H70V20zM10 60h30v30H10V60zm10 10h10v10H20V70zM50 50h10v10H50V50zm20 0h10v10H70V50zm-20 20h10v10H50V70zm20 20h10v10H70V90zm10-20h10v10H80V70zm10-20h10v10H90V50zm0 40h10v10H90V90z" fill="#000"/>
                    </svg>
                  </div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", fontWeight: "700" }}>UPI: inspirex@upi</div>
                </div>
                
                <div className="btn-group">
                  <button type="button" className="btn secondary-btn" onClick={() => setCurrentStep(2)} disabled={isSubmitting}>Back</button>
                  <button type="button" className="btn btn-primary submit-btn" id="btnPayNow" onClick={handlePayment} disabled={isSubmitting}>
                    {isSubmitting ? "Processing..." : "I have paid ₹499"}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: CONFIRMATION */}
            {currentStep === 4 && (
              <div className="wizard-step active" id="step-4">
                <div className="success-icon" style={{ margin: "0 auto 20px", animation: "none", transform: "scale(1)", opacity: "1" }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                </div>
                <h3 style={{ textAlign: "center", fontFamily: "var(--font-display)", fontSize: "24px", marginBottom: "24px" }}>Registration Successful!</h3>

                <div className="ticket-card" ref={ticketRef} style={{ padding: "24px", background: "var(--ink-soft)", borderRadius: "12px", border: "1px solid var(--line)", marginBottom: "24px" }}>
                  <div className="ticket-header" style={{ fontFamily: "var(--font-mono)", fontSize: "14px", color: "var(--muted)", letterSpacing: "2px", marginBottom: "16px", borderBottom: "1px dashed var(--line)", paddingBottom: "12px" }}>INSPIRE X — S02</div>
                  <div className="ticket-row" style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}><span style={{ color: "var(--muted)" }}>Attendee</span><span style={{ fontWeight: "600" }}>{formData.fname}</span></div>
                  <div className="ticket-row" style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}><span style={{ color: "var(--muted)" }}>Registration ID</span><span style={{ color: "var(--volt)", fontWeight: "600", fontFamily: "var(--font-mono)" }}>{registrationId}</span></div>
                  
                  {formData.regType === 'group' && (
                    <div className="ticket-row" style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}><span style={{ color: "var(--muted)" }}>Group Status</span><span>{formData.groupAction === 'create' ? 'Creator' : `Member (${formData.groupCode})`}</span></div>
                  )}
                  
                  <div className="ticket-row" style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}><span style={{ color: "var(--muted)" }}>Price Paid</span><span>₹499</span></div>
                  <div className="ticket-row" style={{ display: "flex", justifyContent: "space-between", marginTop: "16px", borderTop: "1px dashed var(--line)", paddingTop: "12px" }}><span style={{ color: "var(--muted)" }}>Event Date</span><span style={{ fontWeight: "600" }}>13 Sep 2026</span></div>
                </div>

                <div className="btn-group" style={{ flexDirection: "column" }}>
                  <button type="button" className="btn btn-primary" onClick={downloadTicket}>Download Ticket (PDF)</button>
                  <button type="button" className="btn secondary-btn" onClick={() => window.location.reload()}>Register Another Member</button>
                </div>
              </div>
            )}

          </div>{/* /form-card */}
        </div>{/* /reg-form-wrap */}
      </div>{/* /reg-right */}

    </main>
  );
}
