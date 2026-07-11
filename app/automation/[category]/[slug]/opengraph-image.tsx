import { ImageResponse } from 'next/og';
import { getAutomation } from '@/lib/content/automation';

export const alt = 'MLBuilder Automation';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

interface ImageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

export default async function Image({ params }: ImageProps) {
  const { category, slug } = await params;
  const automation = await getAutomation(category, slug);
  if (!automation) {
    return new Response('Not Found', { status: 404 });
  }

  // Cover background colors mapping matching brand colors
  const brandColors: Record<string, string> = {
    navy: '#1B2A4E',
    black: '#1A1A1A',
    teal: '#2D6A6B',
    beige: '#E8DCC4',
    maroon: '#6B2D3A',
    olive: '#3D4A2A',
  };

  let sum = 0;
  for (let i = 0; i < slug.length; i++) {
    sum += slug.charCodeAt(i);
  }
  const colorName = ['navy', 'black', 'teal', 'beige', 'maroon', 'olive'][sum % 6];
  const bgColor = brandColors[colorName];
  const textColor = colorName === 'beige' ? '#111111' : '#F5F1E6';
  const tagBgColor = colorName === 'beige' ? '#cf5c36' : '#cf5c36';

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: bgColor,
          color: textColor,
          padding: '80px',
          border: '12px solid #111111',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: '18px',
              fontWeight: '900',
              letterSpacing: '3px',
              opacity: 0.8,
              marginBottom: '32px',
            }}
          >
            <span>§ MLBUILDER // AUTOMATION // {category.replace('-', ' ').toUpperCase()}</span>
          </div>

          <h1
            style={{
              fontSize: '60px',
              fontWeight: '900',
              lineHeight: '1.15',
              margin: '0',
              padding: '0',
              textTransform: 'uppercase',
              letterSpacing: '-2px',
              maxWidth: '1000px',
              fontFamily: 'sans-serif',
            }}
          >
            {automation.title}
          </h1>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%' }}>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span
              style={{
                padding: '8px 20px',
                border: '3px solid #111111',
                borderRadius: '9999px',
                backgroundColor: tagBgColor,
                color: '#111111',
                fontSize: '16px',
                fontWeight: '900',
                textTransform: 'uppercase',
              }}
            >
              {automation.difficulty}
            </span>
            <span
              style={{
                padding: '8px 20px',
                border: '3px solid #111111',
                borderRadius: '9999px',
                backgroundColor: '#F5F1E6',
                color: '#111111',
                fontSize: '16px',
                fontWeight: '900',
                textTransform: 'uppercase',
              }}
            >
              ⏱️ {automation.estimatedTime}
            </span>
          </div>
          <span
            style={{
              fontSize: '28px',
              fontWeight: 'bold',
              letterSpacing: '1px',
              opacity: 0.9,
            }}
          >
            mlbuilder.in
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
