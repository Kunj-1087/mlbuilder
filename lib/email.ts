import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const resendFromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

// Instantiate Resend if a valid API key is present
export const resend = resendApiKey && resendApiKey !== 're_dev_mock_key'
  ? new Resend(resendApiKey)
  : null;

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

/**
 * Sends an email using the Resend API.
 * In development, if the Resend API key is not configured, it will print the email to the console.
 */
export async function sendEmail({ to, subject, html }: SendEmailParams) {
  if (!resend) {
    console.log('✉️ [Email Mock] Sending email:');
    console.log(`  To:      ${to}`);
    console.log(`  From:    ${resendFromEmail}`);
    console.log(`  Subject: ${subject}`);
    console.log(`  Content: ${html}`);
    return { success: true, id: 'mock-id' };
  }

  try {
    const response = await resend.emails.send({
      from: resendFromEmail,
      to,
      subject,
      html,
    });

    if (response.error) {
      console.error('❌ Resend API returned an error:', response.error);
      return { success: false, error: response.error };
    }

    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ Failed to send email via Resend:', error);
    return { success: false, error };
  }
}
