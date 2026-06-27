/**
 * EmailLayout — universal wrapper for all MLBuilder transactional emails.
 *
 * Provides: preheader text, branded header with wordmark, content area, and footer.
 * All emails wrap their content in this component.
 */
import { Html, Head, Body, Container, Preview, Font } from '@react-email/components';
import { EmailFooter } from './EmailFooter';

interface EmailLayoutProps {
  preheader: string;
  footerContext: string;
  children: React.ReactNode;
}

export function EmailLayout({ preheader, footerContext, children }: EmailLayoutProps) {
  return (
    <Html lang="en">
      <Head>
        <Font
          fontFamily="Arial Black"
          fallbackFontFamily="Arial"
          webFont={{
            url: 'https://fonts.gstatic.com/s/ariablack/v21/tssqApdaRQokwFjFJjvM6h2Wpg.woff2',
            format: 'woff2',
          }}
          fontWeight={900}
          fontStyle="normal"
        />
      </Head>
      <Body style={bodyStyle}>
        {/* Preheader — hidden preview text in inbox */}
        <Preview style={preheaderStyle}>{preheader}</Preview>

        <Container style={containerStyle}>
          {/* Header — branded wordmark */}
          <table style={headerTableStyle}>
            <tbody>
              <tr>
                <td style={headerCellStyle}>
                  <span style={wordmarkOrangeStyle}>ML</span>
                  <span style={wordmarkBlackStyle}>BUILDER</span>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Main content */}
          <table style={contentTableStyle}>
            <tbody>
              <tr>
                <td style={contentCellStyle}>
                  {children}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Footer */}
          <EmailFooter context={footerContext} />
        </Container>
      </Body>
    </Html>
  );
}

// ── Styles ──

const bodyStyle: React.CSSProperties = {
  margin: '0',
  padding: '0',
  backgroundColor: '#F5F1E6',
  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  color: '#111111',
};

const preheaderStyle: React.CSSProperties = {
  display: 'none',
  fontSize: '0',
  lineHeight: '0',
  maxHeight: '0',
  maxWidth: '0',
  opacity: 0,
  overflow: 'hidden',
  // @ts-expect-error — msoHide is Outlook-specific but valid in email CSS
  msoHide: 'all',
};

const containerStyle: React.CSSProperties = {
  maxWidth: '600px',
  margin: '0 auto',
};

const headerTableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  backgroundColor: '#EFEAD8',
  borderBottom: '2px solid #111111',
};

const headerCellStyle: React.CSSProperties = {
  padding: '20px 32px',
  textAlign: 'left',
};

const wordmarkOrangeStyle: React.CSSProperties = {
  fontFamily: "'Arial Black', 'Helvetica Neue', Helvetica, Arial, sans-serif",
  fontSize: '18px',
  fontWeight: 900,
  color: '#FF6A1A',
  letterSpacing: '-0.02em',
};

const wordmarkBlackStyle: React.CSSProperties = {
  fontFamily: "'Arial Black', 'Helvetica Neue', Helvetica, Arial, sans-serif",
  fontSize: '18px',
  fontWeight: 900,
  color: '#111111',
  letterSpacing: '-0.02em',
};

const contentTableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  backgroundColor: '#FBF8F0',
  borderLeft: '2px solid #111111',
  borderRight: '2px solid #111111',
};

const contentCellStyle: React.CSSProperties = {
  padding: '40px 32px',
};
