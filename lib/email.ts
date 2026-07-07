import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';

const resendApiKey = process.env.RESEND_API_KEY;
const resendFromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

// Instantiate Resend if a valid API key is present
export const resend = resendApiKey && resendApiKey !== 're_dev_mock_key' && resendApiKey !== 're_mock_test_key'
  ? new Resend(resendApiKey)
  : null;

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

/**
 * Sends an email using the Resend API.
 * In testing and local dev (if Resend is not configured), it logs emails to temp_emails.json or console.
 */
export async function sendEmail({ to, subject, html }: SendEmailParams) {
  if (resendApiKey === 're_mock_test_key' || !resend) {
    const emailData = {
      to,
      subject,
      html,
      from: resendFromEmail,
    };

    console.log('✉️ [Email Mock] Logging email:');
    console.log(`  To:      ${to}`);
    console.log(`  From:    ${resendFromEmail}`);
    console.log(`  Subject: ${subject}`);

    try {
      const filePath = path.resolve(process.cwd(), 'tests/mocks/temp_emails.json');
      let currentEmails = [];
      if (fs.existsSync(filePath)) {
        try {
          currentEmails = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        } catch (e) {
          // ignore corrupted files
        }
      }
      currentEmails.push(emailData);
      fs.writeFileSync(filePath, JSON.stringify(currentEmails, null, 2));
    } catch (error) {
      console.error('❌ Failed to write mock email to disk:', error);
    }

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
