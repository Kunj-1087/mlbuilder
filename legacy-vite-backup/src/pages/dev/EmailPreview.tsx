/**
 * Email Preview Page — dev-only utility for previewing all email templates.
 *
 * Renders each template with sample data in an iframe for accurate email rendering.
 * Only accessible in development mode.
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ConfirmationEmail } from '@/emails/ConfirmationEmail';
import { WelcomeEmail } from '@/emails/WelcomeEmail';
import { LeadMagnetDeliveryEmail } from '@/emails/LeadMagnetDeliveryEmail';
import { SignupWelcomeEmail } from '@/emails/SignupWelcomeEmail';
import { PasswordResetEmail } from '@/emails/PasswordResetEmail';
import { EmailChangeVerificationEmail } from '@/emails/EmailChangeVerificationEmail';
import { EmailChangeCompletedEmail } from '@/emails/EmailChangeCompletedEmail';
import { AccountDeletionConfirmationEmail } from '@/emails/AccountDeletionConfirmationEmail';
import { AccountDeletionFarewellEmail } from '@/emails/AccountDeletionFarewellEmail';

type TemplateEntry = {
  name: string;
  slug: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: (...args: any[]) => React.JSX.Element;
  props: Record<string, unknown>;
};

const TEMPLATES: TemplateEntry[] = [
  { name: 'Confirmation', slug: 'confirmation', component: ConfirmationEmail, props: { confirmationToken: 'sample-token-123' } },
  { name: 'Welcome', slug: 'welcome', component: WelcomeEmail, props: {} },
  { name: 'Lead Magnet Delivery', slug: 'lead-magnet', component: LeadMagnetDeliveryEmail, props: { title: 'n8n Workflow Guide', downloadToken: 'sample-token-456', alreadySubscribed: false } },
  { name: 'Signup Welcome', slug: 'signup-welcome', component: SignupWelcomeEmail, props: { firstName: 'Alex' } },
  { name: 'Password Reset', slug: 'password-reset', component: PasswordResetEmail, props: { resetToken: 'sample-reset-token', email: 'user@example.com' } },
  { name: 'Email Change Verification', slug: 'email-change-verify', component: EmailChangeVerificationEmail, props: { verificationToken: 'sample-verify-token', newEmail: 'new@example.com' } },
  { name: 'Email Change Completed', slug: 'email-change-done', component: EmailChangeCompletedEmail, props: { maskedNewEmail: 'n****@gmail.com', changeDate: 'Jan 15, 2026' } },
  { name: 'Account Deletion Confirmation', slug: 'deletion-confirm', component: AccountDeletionConfirmationEmail, props: { confirmationToken: 'sample-delete-token' } },
  { name: 'Account Deletion Farewell', slug: 'deletion-farewell', component: AccountDeletionFarewellEmail, props: {} },
];

export default function EmailPreview() {
  const [selected, setSelected] = useState<string | null>(null);
  const [html, setHtml] = useState('');

  const handlePreview = (slug: string) => {
    const template = TEMPLATES.find((t) => t.slug === slug);
    if (!template) return;

    setSelected(slug);
    // Render the React component directly — React Email components
    // render to standard HTML that works in an iframe srcDoc.
    try {
      // Render the template to HTML using React's DOM rendering
      const container = document.createElement('div');
      import('react-dom/client').then(({ createRoot }) => {
        const root = createRoot(container);
        root.render(template.component(template.props));
        setTimeout(() => {
          setHtml(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: 'Helvetica Neue', Arial, sans-serif; background: #F5F1E6; margin: 0; padding: 20px; }
                .preview-banner { background: #FF6A1A; color: #111; padding: 12px 20px; border-radius: 4px; margin-bottom: 20px; font-weight: 600; }
              </style>
            </head>
            <body>
              <div class="preview-banner">📧 ${template.name}</div>
              ${container.innerHTML}
            </body>
            </html>
          `);
        }, 100);
      }).catch(() => {
        // Fallback: show template name
        setHtml(`<html><body><p>Template: ${template.name}</p></body></html>`);
      });
    } catch (err) {
      setHtml(`<p style="color:red">Error rendering template: ${err}</p>`);
    }
  };

  // Dev-only gate
  if (import.meta.env.PROD) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>Not available in production</h1>
        <Link to="/">Go home →</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontFamily: "'Arial Black', sans-serif", fontSize: '36px', marginBottom: '8px' }}>
        EMAIL PREVIEWS.
      </h1>
      <p style={{ fontFamily: 'sans-serif', color: '#6B6B6B', marginBottom: '32px' }}>
        Dev tool — renders all MLBuilder email templates with sample data.
      </p>

      {/* Template list */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '12px', marginBottom: '32px' }}>
        {TEMPLATES.map((t) => (
          <button
            key={t.slug}
            onClick={() => handlePreview(t.slug)}
            style={{
              padding: '16px',
              border: selected === t.slug ? '3px solid #FF6A1A' : '2px solid #111111',
              borderRadius: '4px',
              backgroundColor: selected === t.slug ? '#FFF5EB' : '#FBF8F0',
              cursor: 'pointer',
              textAlign: 'left',
              fontFamily: 'sans-serif',
              fontWeight: 600,
            }}
          >
            {t.name}
          </button>
        ))}
      </div>

      {/* Preview iframe */}
      {selected && (
        <div>
          <div style={{ marginBottom: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
            <h2 style={{ fontFamily: 'sans-serif', margin: 0 }}>
              {TEMPLATES.find((t) => t.slug === selected)?.name}
            </h2>
            <button
              onClick={() => handlePreview(selected)}
              style={{
                padding: '6px 16px',
                border: '2px solid #111111',
                borderRadius: '9999px',
                backgroundColor: '#FF6A1A',
                cursor: 'pointer',
                fontFamily: 'sans-serif',
                fontWeight: 600,
                fontSize: '13px',
              }}
            >
              Refresh
            </button>
          </div>

          <iframe
            srcDoc={html}
            style={{
              width: '100%',
              height: '800px',
              border: '2px solid #111111',
              borderRadius: '4px',
              backgroundColor: '#fff',
            }}
            title="Email preview"
          />
        </div>
      )}
    </div>
  );
}
