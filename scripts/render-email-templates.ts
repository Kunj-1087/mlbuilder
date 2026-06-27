/**
 * Test Script — renders all email templates with sample data and logs output.
 *
 * Usage: npx tsx scripts/render-email-templates.ts
 *
 * Note: This is a client-side SPA, so Resend sending requires API keys.
 * This script renders templates to HTML for visual QA.
 */
import { render } from '@react-email/render';

// Import all templates
import { ConfirmationEmail } from '../src/emails/ConfirmationEmail';
import { WelcomeEmail } from '../src/emails/WelcomeEmail';
import { LeadMagnetDeliveryEmail } from '../src/emails/LeadMagnetDeliveryEmail';
import { SignupWelcomeEmail } from '../src/emails/SignupWelcomeEmail';
import { PasswordResetEmail } from '../src/emails/PasswordResetEmail';
import { EmailChangeVerificationEmail } from '../src/emails/EmailChangeVerificationEmail';
import { EmailChangeCompletedEmail } from '../src/emails/EmailChangeCompletedEmail';
import { AccountDeletionConfirmationEmail } from '../src/emails/AccountDeletionConfirmationEmail';
import { AccountDeletionFarewellEmail } from '../src/emails/AccountDeletionFarewellEmail';

const templates = [
  { name: 'Confirmation', component: ConfirmationEmail, props: { confirmationToken: 'test-token-123' } },
  { name: 'Welcome', component: WelcomeEmail, props: { email: 'test@example.com' } },
  { name: 'Lead Magnet Delivery', component: LeadMagnetDeliveryEmail, props: { title: 'n8n Workflow Guide', downloadToken: 'test-token-456', alreadySubscribed: false } },
  { name: 'Lead Magnet (Already Subscribed)', component: LeadMagnetDeliveryEmail, props: { title: 'n8n Workflow Guide', downloadToken: 'test-token-789', alreadySubscribed: true } },
  { name: 'Signup Welcome', component: SignupWelcomeEmail, props: { firstName: 'Alex' } },
  { name: 'Password Reset', component: PasswordResetEmail, props: { resetToken: 'test-reset-token', email: 'user@example.com' } },
  { name: 'Email Change Verification', component: EmailChangeVerificationEmail, props: { verificationToken: 'test-verify-token', newEmail: 'new@example.com' } },
  { name: 'Email Change Completed', component: EmailChangeCompletedEmail, props: { maskedNewEmail: 'n****@gmail.com', changeDate: 'Jan 15, 2026' } },
  { name: 'Account Deletion Confirmation', component: AccountDeletionConfirmationEmail, props: { confirmationToken: 'test-delete-token' } },
  { name: 'Account Deletion Farewell', component: AccountDeletionFarewellEmail, props: {} },
];

console.log(`\n📧 MLBuilder Email Template Renderer`);
console.log(`${'═'.repeat(50)}\n`);

let successCount = 0;
let errorCount = 0;

for (const template of templates) {
  try {
    // @ts-expect-error — React Email render expects JSX element
    const html = render(template.component(template.props));
    const size = new Blob([html]).size;
    console.log(`✅ ${template.name.padEnd(40)} (${(size / 1024).toFixed(1)} KB)`);
    successCount++;
  } catch (err) {
    console.log(`❌ ${template.name.padEnd(40)} ERROR: ${err}`);
    errorCount++;
  }
}

console.log(`\n${'═'.repeat(50)}`);
console.log(`Results: ${successCount} rendered, ${errorCount} errors`);
console.log(`Total templates: ${templates.length}\n`);
