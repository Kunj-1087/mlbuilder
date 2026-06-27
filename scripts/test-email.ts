/**
 * Test email script
 *
 * Sends a test confirmation email to verify Resend setup.
 * Run with: npx tsx scripts/test-email.ts
 *
 * Prerequisites:
 *   1. Set RESEND_API_KEY in .env.local
 *   2. Install tsx: npm install -D tsx
 *   3. Install resend: npm install resend
 */

// To run this script, uncomment the code below and install the dependencies.
//
// import { Resend } from 'resend';
// import { getConfirmationEmailHtml } from '../src/emails/ConfirmationEmail';
//
// const resend = new Resend(process.env.RESEND_API_KEY);
//
// const TEST_EMAIL = 'your-test-email@example.com'; // ← Change this
// const TEST_TOKEN = 'test-confirmation-token-123';
//
// async function main() {
//   console.log('Sending test confirmation email to:', TEST_EMAIL);
//
//   const html = getConfirmationEmailHtml({
//     confirmationToken: TEST_TOKEN,
//     siteUrl: 'http://localhost:3000',
//   });
//
//   const { data, error } = await resend.emails.send({
//     from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
//     to: TEST_EMAIL,
//     subject: 'Confirm your MLBuilder subscription',
//     html,
//   });
//
//   if (error) {
//     console.error('Failed to send:', error);
//     process.exit(1);
//   }
//
//   console.log('Email sent successfully! ID:', data?.id);
//   console.log('Check your inbox at:', TEST_EMAIL);
// }
//
// main();

console.log('Test email script — uncomment code and install dependencies to run.');
console.log('See script file for instructions.');
