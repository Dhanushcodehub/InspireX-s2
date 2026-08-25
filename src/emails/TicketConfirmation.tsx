import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Row,
  Column,
  Button,
  Img
} from '@react-email/components';

interface TicketConfirmationEmailProps {
  name: string;
  rollNo: string;
  branch: string;
  ticketId: string;
}

export const TicketConfirmationEmail = ({
  name = 'DHANUSH M',
  rollNo = '25881A05FZ',
  branch = 'CSE',
  ticketId = 'MMJGXQJ4'
}: TicketConfirmationEmailProps) => {
  const previewText = `You're in, ${name}! Your InspireX Ticket is ready.`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(ticketId)}`;

  return (
    <Html>
      <Head>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Syne:wght@600;700;800&family=Unbounded:wght@600;700;800&display=swap');
          
          /* Basic responsive rules for smaller screens */
          @media only screen and (max-width: 600px) {
            .mobile-col {
              display: block !important;
              width: 100% !important;
              border-right: none !important;
              border-bottom: 2px dashed #2d2d3a !important;
            }
            .mobile-padding {
              padding: 20px !important;
            }
            .mobile-title {
              font-size: 22px !important;
            }
          }
        `}</style>
      </Head>
      <Preview>{previewText}</Preview>
      <Body style={main}>
        
        {/* Helper text for some clients */}
        <Container style={headerNotice}>
          <Text style={headerNoticeText}>
            Download this ticket and keep it safe. You'll need it for check-in on the day of the event.
          </Text>
        </Container>

        <Container style={container}>
          
          {/* Boarding Pass Container */}
          <Section style={ticketCard}>
            <Row>
              
              {/* LEFT COLUMN: Ticket Details */}
              <Column style={leftColumn} className="mobile-col mobile-padding">
                
                {/* Logo & Ticket Type */}
                <Row style={ticketHeaderRow}>
                  <Column align="left" style={{ width: '50%' }}>
                    <Text style={logoMain}>Inspire<span style={{color: '#00e5ff'}}>X</span></Text>
                    <Text style={logoSub}>SEASON TWO</Text>
                  </Column>
                  <Column align="right" style={{ width: '50%' }}>
                    <Text style={typeLabel}>TICKET TYPE</Text>
                    <Text style={typeValue}>GENERAL ADMISSION</Text>
                  </Column>
                </Row>
                
                {/* Attendee Info */}
                <Section style={attendeeSection}>
                  <Text style={admitLabel}>ADMIT ONE</Text>
                  <Text style={attendeeName} className="mobile-title">{name.toUpperCase()}</Text>
                  <Text style={attendeeMeta}>{branch} • {rollNo}</Text>
                </Section>
                
                {/* Details Grid */}
                <Section style={detailsSection}>
                  <Row>
                    <Column style={{ width: '33%', paddingRight: '8px' }}>
                      <Text style={gridLabel}>DATE</Text>
                      <Text style={gridValue}>13 Sept</Text>
                      <Text style={gridValue}>2026</Text>
                    </Column>
                    <Column style={{ width: '33%', paddingRight: '8px' }}>
                      <Text style={gridLabel}>TIME</Text>
                      <Text style={gridValue}>08:00</Text>
                      <Text style={gridValue}>AM</Text>
                    </Column>
                    <Column style={{ width: '34%' }}>
                      <Text style={gridLabel}>VENUE</Text>
                      <Text style={gridValue}>Vardhaman</Text>
                      <Text style={gridValue}>College</Text>
                    </Column>
                  </Row>
                </Section>

              </Column>
              
              {/* RIGHT COLUMN: Scannable Area */}
              <Column style={rightColumn} className="mobile-col mobile-padding">
                
                <Section style={scanSection}>
                  <div style={qrContainer}>
                    <Img 
                      src={qrUrl} 
                      width="120" 
                      height="120" 
                      alt="QR Code" 
                      style={qrImage}
                    />
                  </div>
                  <Text style={scanLabel}>SCAN TO CHECK IN</Text>
                </Section>

              </Column>
            </Row>
          </Section>

          {/* CTA Section */}
          <Section style={ctaSection}>
            <Button style={ctaButton} href={`http://localhost:3000/ticket/${ticketId}`}>
              Download Ticket PDF
            </Button>
            <Text style={footerLegal}>
              Need help? Contact <Link style={footerLink} href="mailto:support@connectclub.com">support@connectclub.com</Link><br/>
              InspireX Season 2 © 2026. All rights reserved.
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  );
};

export default TicketConfirmationEmail;

// --- Styles ---

const main = {
  backgroundColor: '#09090b',
  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  padding: '40px 0',
  color: '#ffffff',
};

const headerNotice = {
  margin: '0 auto 24px auto',
  textAlign: 'center' as const,
  maxWidth: '600px',
};

const headerNoticeText = {
  color: '#a1a1aa',
  fontSize: '12px',
  lineHeight: '20px',
};

const container = {
  margin: '0 auto',
  maxWidth: '600px',
};

const ticketCard = {
  backgroundColor: '#1E1E26',
  borderRadius: '16px',
  border: '1px solid #2d2d3a',
  overflow: 'hidden',
  width: '100%',
};

const leftColumn = {
  width: '70%',
  padding: '24px 20px 24px 24px',
  borderRight: '2px dashed #2d2d3a',
  verticalAlign: 'top',
};

const rightColumn = {
  width: '30%',
  padding: '24px 16px',
  backgroundColor: '#191921',
  verticalAlign: 'middle',
};

// --- Left Column Styles ---

const ticketHeaderRow = {
  width: '100%',
  marginBottom: '32px',
};

const logoMain = {
  fontFamily: '"Unbounded", "Helvetica Neue", sans-serif',
  fontSize: '20px',
  fontWeight: '800',
  color: '#00e5ff',
  margin: '0 0 2px 0',
  letterSpacing: '-0.5px',
};

const logoSub = {
  fontFamily: '"Unbounded", "Helvetica Neue", sans-serif',
  fontSize: '9px',
  fontWeight: '600',
  color: '#a1a1aa',
  margin: '0',
  letterSpacing: '2px',
};

const typeLabel = {
  fontSize: '9px',
  fontWeight: '600',
  color: '#71717a',
  margin: '0 0 2px 0',
  letterSpacing: '1px',
};

const typeValue = {
  fontSize: '11px',
  fontWeight: '800',
  color: '#ffffff',
  margin: '0',
  letterSpacing: '0.5px',
};

const attendeeSection = {
  marginBottom: '32px',
};

const admitLabel = {
  fontSize: '10px',
  fontWeight: '700',
  color: '#71717a',
  letterSpacing: '1.5px',
  margin: '0 0 6px 0',
};

const attendeeName = {
  fontFamily: '"Unbounded", "Helvetica Neue", sans-serif',
  fontSize: '22px',
  fontWeight: '800',
  color: '#ffffff',
  margin: '0 0 6px 0',
  lineHeight: '1.2',
};

const attendeeMeta = {
  fontSize: '13px',
  fontWeight: '500',
  color: '#a1a1aa',
  margin: '0',
};

const detailsSection = {
  width: '100%',
};

const gridLabel = {
  fontSize: '10px',
  fontWeight: '600',
  color: '#71717a',
  letterSpacing: '1px',
  margin: '0 0 4px 0',
};

const gridValue = {
  fontSize: '12px',
  fontWeight: '700',
  color: '#ffffff',
  margin: '0 0 2px 0',
};

// --- Right Column Styles ---

const scanSection = {
  textAlign: 'center' as const,
  width: '100%',
};

const qrContainer = {
  backgroundColor: '#ffffff',
  padding: '10px',
  borderRadius: '10px',
  display: 'inline-block',
  marginBottom: '16px',
};

const qrImage = {
  display: 'block',
  margin: '0 auto',
};

const scanLabel = {
  fontSize: '10px',
  fontWeight: '600',
  color: '#a1a1aa',
  letterSpacing: '1.5px',
  margin: '0',
};

// --- CTA / Footer Styles ---

const ctaSection = {
  textAlign: 'center' as const,
  padding: '32px 20px',
};

const ctaButton = {
  backgroundColor: '#00e5ff',
  color: '#09090b',
  fontWeight: '700',
  fontSize: '15px',
  textDecoration: 'none',
  padding: '14px 28px',
  borderRadius: '8px',
  display: 'inline-block',
  marginBottom: '24px',
  fontFamily: '"Inter", sans-serif',
};

const footerLegal = {
  color: '#71717a',
  fontSize: '12px',
  lineHeight: '20px',
  margin: '0',
};

const footerLink = {
  color: '#00e5ff',
  textDecoration: 'none',
};
