import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { TicketConfirmationEmail } from '../../../emails/TicketConfirmation';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const rollNo = typeof body.rollNo === "string" ? body.rollNo.trim().toUpperCase() : "";
    const phone = typeof body.phone === "string" ? body.phone.replace(/\D/g, "") : "";

    if (
      name.length < 2 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      !/^[A-Z0-9][A-Z0-9-]{3,29}$/.test(rollNo) ||
      !/^\d{10}$/.test(phone)
    ) {
      return NextResponse.json({ error: "Invalid registration details." }, { status: 400 });
    }

    // --- SEND EMAIL CONFIRMATION ---
    if (resend) {
      try {
        const emailResult = await resend.emails.send({
          from: 'InspireX <onboarding@resend.dev>', // Update this with a verified domain in production
          to: email,
          subject: 'Your InspireX registration was received',
          react: TicketConfirmationEmail({ 
            name,
            rollNo,
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



    return NextResponse.json({ success: true, emailSent: Boolean(resend) });
    
  } catch (error: unknown) {
    console.error("Error in /api/register:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Internal Server Error" }, { status: 500 });
  }
}
