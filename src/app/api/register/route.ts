import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { TicketConfirmationEmail } from '../../../emails/TicketConfirmation';

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key');

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // We fetch the webhook URL from the server's environment variables
    const webhookUrl = process.env.CONNECT_CLUB_WEBHOOK_URL;
    const secret = process.env.CONNECT_CLUB_WEBHOOK_SECRET || "local_dev_secret_12345";

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

    // --- WEBHOOK PING ---
    // Only ping the webhook if it's explicitly configured (prevents hanging on Vercel)
    if (webhookUrl && !webhookUrl.includes("localhost")) {
      try {
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
          console.error("Connect Club Webhook Failed:", await response.text());
        }
      } catch (webhookError) {
        console.error("Connect Club Webhook Network Error:", webhookError);
      }
    }

    return NextResponse.json({ success: true });
    
  } catch (error: any) {
    console.error("Error in /api/register:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
