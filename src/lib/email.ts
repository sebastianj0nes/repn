import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY || "",
});

export async function sendConfirmationEmail(to: string, name: string, confirmationLink: string) {
  const sentFrom = new Sender("noreply@yourdomain.com", "FitTrack");
  const recipient = new Recipient(to, name);

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
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    throw error;
  }
}