import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { TicketConfirmationEmail } from '../../../emails/TicketConfirmation';

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key');

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // We fetch the webhook URL and secret from the server's environment variables
    // so it is NEVER exposed to the browser.
    const webhookUrl = process.env.CONNECT_CLUB_WEBHOOK_URL || "http://localhost:3000/api/webhooks/external-registration";
    const secret = process.env.CONNECT_CLUB_WEBHOOK_SECRET || "local_dev_secret_12345";

    if (!secret) {
      console.error("Missing CONNECT_CLUB_WEBHOOK_SECRET in environment variables.");
      return NextResponse.json({ error: "Server Configuration Error" }, { status: 500 });
    }

    // --- SEND EMAIL CONFIRMATION ---
    if (body.email && body.name) {
      try {
        const emailResult = await resend.emails.send({
          from: 'InspireX <onboarding@resend.dev>', // Update this with a verified domain in production
          to: body.email,
          subject: 'Your InspireX Ticket is Confirmed! 🎉',
          react: TicketConfirmationEmail({ 
            name: body.name, 
            rollNo: body.rollNo, 
            branch: body.branch, 
            ticketId: body.ticketId 
          })
        });
        console.log("Email sent successfully:", emailResult);
      } catch (emailError) {
        console.error("Failed to send email confirmation:", emailError);
        // We don't want to fail the registration just because the email failed
      }
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${secret}`
      },
      body: JSON.stringify({
        rollNo: body.rollNo,
        eventId: body.eventId,
        eventTitle: body.eventTitle,
        ticketId: body.ticketId
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Connect Club Webhook Failed:", errorText);
      return NextResponse.json({ error: "Connect Club Webhook Failed" }, { status: 502 });
    }

    return NextResponse.json({ success: true });
    
  } catch (error: any) {
    console.error("Error in /api/register:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
