import { NextResponse } from 'next/server';
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY || "",
});

export async function POST(request: Request) {
  const { email, name, confirmationLink } = await request.json();

  const sentFrom = new Sender("noreply@yourdomain.com", "FitTrack");
  const recipient = new Recipient(email, name);

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo([recipient])
    .setSubject("Confirm Your FitTrack Account")
    .setHtml(`
      <h1>Welcome to FitTrack, ${name}!</h1>
      <p>Please confirm your email address by clicking the link below:</p>
      <a href="${confirmationLink}">Confirm Email</a>
    `);

  try {
    await mailerSend.email.send(emailParams);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    return NextResponse.json({ success: false, error: 'Failed to send email' }, { status: 500 });
  }
}
