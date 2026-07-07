import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NotFoundPage from '@/pages/NotFound';
import { toast } from '@/lib/toast';

// Define the brand palette
const PALETTE = [
  { name: 'Cream (Background)', token: 'bg-cream', hex: '#F5F1E6', text: 'text-ink', desc: 'Primary backdrop for all screens. Soft on eyes.' },
  { name: 'Cream Muted (Surface)', token: 'bg-cream-muted', hex: '#EFEAD8', text: 'text-ink', desc: 'Used for cards, inputs, and borders when extra contrast is needed.' },
  { name: 'Ink Black (Text & Primary)', token: 'bg-ink', hex: '#111111', text: 'text-cream', desc: 'Main text, primary buttons, and solid borders. Sharp and high-contrast.' },
  { name: 'Orange Accent (Highlight)', token: 'bg-accent', hex: '#FF6A1A', text: 'text-ink', desc: 'Call to actions, stars, highlights, and secondary elements.' },
];

const TYPOGRAPHY = [
  { name: 'Display Font', css: 'font-display', family: 'Archivo Black', sample: 'AI BUILDS. RESEARCH. TOOLS.' },
  { name: 'Body Font', css: 'font-body', family: 'Inter', sample: 'AI automation breakdowns, research digests in plain English, and free tools.' },
  { name: 'Script Font', css: 'font-script', family: 'Caveat', sample: 'Built solo. Shared openly.' },
];

// Inline SVGs for rendering and copying
const SVG_ASSETS = [
  {
    name: 'logo.svg',
    path: '/brand/logo.svg',
    dimensions: '320x64 (5:1 Ratio)',
    desc: 'Primary horizontal wordmark with sharp star icon at left.',
    markup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 64" width="100%" height="100%">
  <!-- Geometric 5-point star mark in ink black -->
  <path d="M 24 18 L 26.5 28.5 L 37 32 L 26.5 35.5 L 24 46 L 21.5 35.5 L 11 32 L 21.5 28.5 Z" fill="#111111" />
  <!-- Wordmark using preloaded Archivo Black font -->
  <text x="52" y="44" font-family="'Archivo Black', 'Arial Black', sans-serif" font-size="36" font-weight="900" letter-spacing="-0.02em">
    <tspan fill="#FF6A1A">ML</tspan><tspan fill="#111111">BUILDER</tspan>
  </text>
</svg>`
  },
  {
    name: 'logo-stacked.svg',
    path: '/brand/logo-stacked.svg',
    dimensions: '256x256 (1:1 Ratio)',
    desc: 'Vertical/square logo variant for icons, avatars, and profile pictures.',
    markup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="100%" height="100%">
  <!-- Centered sharp star mark in ink black -->
  <path d="M 128 20 L 135 50 L 168 60 L 135 70 L 128 100 L 121 70 L 88 60 L 121 50 Z" fill="#111111" />
  <!-- Stacked Wordmark -->
  <text x="128" y="170" text-anchor="middle" font-family="'Archivo Black', 'Arial Black', sans-serif" font-size="64" font-weight="900" fill="#FF6A1A" letter-spacing="-0.02em">ML</text>
  <text x="134" y="215" text-anchor="middle" font-family="'Archivo Black', 'Arial Black', sans-serif" font-size="28" font-weight="900" fill="#111111" letter-spacing="0.12em">BUILDER</text>
</svg>`
  },
  {
    name: 'logo-mark.svg',
    path: '/brand/logo-mark.svg',
    dimensions: '64x64',
    desc: 'Icon-only black star mark. Used for favicons and loading indicators.',
    markup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="100%" height="100%">
  <!-- Icon-only sharp star mark in ink black -->
  <path d="M 32 4 L 37 25 L 60 32 L 37 39 L 32 60 L 27 39 L 4 32 L 27 25 Z" fill="#111111" />
</svg>`
  },
  {
    name: 'logo-mark-orange.svg',
    path: '/brand/logo-mark-orange.svg',
    dimensions: '64x64',
    desc: 'Icon-only orange star mark. Used for active variants or PWA masks.',
    markup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="100%" height="100%">
  <!-- Icon-only sharp star mark in brand orange -->
  <path d="M 32 4 L 37 25 L 60 32 L 37 39 L 32 60 L 27 39 L 4 32 L 27 25 Z" fill="#FF6A1A" />
</svg>`
  },
  {
    name: 'email-logo.svg',
    path: '/brand/email-logo.svg',
    dimensions: '240x48',
    desc: 'Clean horizontal text wordmark optimized for email newsletter header compatibility.',
    markup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 48" width="100%" height="100%">
  <!-- Wordmark only (no star mark) optimized for email clients -->
  <text x="12" y="35" font-family="'Archivo Black', 'Arial Black', sans-serif" font-size="28" font-weight="900" letter-spacing="-0.02em">
    <tspan fill="#FF6A1A">ML</tspan><tspan fill="#111111">BUILDER</tspan>
  </text>
</svg>`
  },
  {
    name: 'letterhead-template.svg',
    path: '/brand/letterhead-template.svg',
    dimensions: '1240x1754 (A4 @ 150 DPI)',
    desc: 'Base template for printed letters and PDF report exports.',
    markup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1240 1754" width="100%" height="100%">
  <!-- Cream Background -->
  <rect width="1240" height="1754" fill="#F5F1E6" />

  <!-- Top Header Brand Frame -->
  <g transform="translate(100, 80)">
    <!-- Star -->
    <path d="M 24 2 L 27.75 17.75 L 43.5 24 L 27.75 30.25 L 24 46 L 20.25 30.25 L 4.5 24 L 20.25 17.75 Z" fill="#111111" />
    <!-- Text -->
    <text x="64" y="34" font-family="'Archivo Black', 'Arial Black', sans-serif" font-size="40" font-weight="900" letter-spacing="-0.02em">
      <tspan fill="#FF6A1A">ML</tspan><tspan fill="#111111">BUILDER</tspan>
    </text>
  </g>
  
  <!-- Divider Line -->
  <line x1="100" y1="160" x2="1140" y2="160" stroke="#111111" stroke-width="2" opacity="0.15" />

  <!-- Bottom Footer Info -->
  <text x="620" y="1660" text-anchor="middle" font-family="'Inter', sans-serif" font-size="20" font-weight="500" fill="#111111" opacity="0.5">mlbuilder.in  ·  hello@mlbuilder.in  ·  @mlbuilder.py</text>
</svg>`
  },
  {
    name: 'lead-magnet-cover-template.svg',
    path: '/brand/lead-magnet-cover-template.svg',
    dimensions: '1240x1754 (A4 @ 150 DPI)',
    desc: 'Base cover page template for lead magnet PDFs in deep Navy color.',
    markup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1240 1754" width="100%" height="100%">
  <defs>
    <!-- Faint grid pattern overlay -->
    <pattern id="cover-grid" width="120" height="120" patternUnits="userSpaceOnUse">
      <path d="M 120 0 L 0 0 0 120" fill="none" stroke="#F5F1E6" stroke-width="1.5" opacity="0.04" />
    </pattern>
  </defs>

  <!-- Deep Navy Background -->
  <rect width="1240" height="1754" fill="#1B2A4E" />
  <!-- Grid overlay -->
  <rect width="1240" height="1754" fill="url(#cover-grid)" />

  <!-- Massive Display Title (Editable placeholder) -->
  <text x="100" y="380" font-family="'Archivo Black', 'Arial Black', sans-serif" font-size="96" font-weight="900" fill="#F5F1E6" letter-spacing="-0.02em">
    <tspan x="100" dy="0">DRAFTING</tspan>
    <tspan x="100" dy="110">THE SYSTEM</tspan>
    <tspan x="100" dy="110">ARCHITECT</tspan>
  </text>

  <!-- Subtitle Tagline (Caveat script font) -->
  <text x="100" y="740" font-family="'Caveat', cursive" font-size="52" font-weight="700" fill="#FF6A1A">A Step-by-Step AI Automation Blueprint</text>

  <!-- Bottom Brand Mark -->
  <g transform="translate(100, 1550)">
    <!-- Star -->
    <path d="M 24 2 L 27.75 17.75 L 43.5 24 L 27.75 30.25 L 24 46 L 20.25 30.25 L 4.5 24 L 20.25 17.75 Z" fill="#F5F1E6" />
    <!-- Text -->
    <text x="64" y="34" font-family="'Archivo Black', 'Arial Black', sans-serif" font-size="40" font-weight="900" letter-spacing="-0.02em">
      <tspan fill="#FF6A1A">ML</tspan><tspan fill="#F5F1E6">BUILDER</tspan>
    </text>
  </g>

  <!-- Bottom Right Free Tag -->
  <g transform="translate(940, 1550)">
    <rect width="200" height="54" rx="27" fill="#FF6A1A" stroke="#F5F1E6" stroke-width="2.5" />
    <text x="100" y="34" text-anchor="middle" font-family="'Archivo Black', 'Arial Black', sans-serif" font-size="20" font-weight="900" fill="#111111">FREE PDF</text>
  </g>
</svg>`
  },
  {
    name: 'profile-picture.svg',
    path: '/brand/instagram/profile-picture.svg',
    dimensions: '320x320',
    desc: 'Instagram profile picture template with border circle crop safe zone.',
    markup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320" width="100%" height="100%">
  <!-- Background Cream -->
  <rect width="320" height="320" fill="#F5F1E6" />
  
  <!-- Outer Guide Circle (shows where Instagram crops, with thin ink border) -->
  <circle cx="160" cy="160" r="140" stroke="#111111" stroke-width="2" fill="none" />
  
  <!-- Centered Orange Star Mark (~180px diameter) -->
  <path d="M 160 70 L 176 137.5 L 250 160 L 176 182.5 L 160 250 L 144 182.5 L 70 160 L 144 137.5 Z" fill="#FF6A1A" />
</svg>`
  },
  {
    name: 'story-template-base.svg',
    path: '/brand/instagram/story-template-base.svg',
    dimensions: '1080x1920 (9:16)',
    desc: 'Instagram story backdrop with safe zone boundary indicators and grid.',
    markup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="100%" height="100%">
  <defs>
    <!-- Graph-paper grid pattern -->
    <pattern id="grid" width="120" height="120" patternUnits="userSpaceOnUse">
      <path d="M 120 0 L 0 0 0 120" fill="none" stroke="#111111" stroke-width="1.5" opacity="0.08" />
    </pattern>
    
    <!-- Reusable Play Decor Icon -->
    <g id="play-decor">
      <circle cx="20" cy="20" r="19" stroke="#111111" stroke-width="2" fill="none" />
      <path d="M 17 13 L 27 20 L 17 27 Z" fill="#111111" />
    </g>
  </defs>

  <!-- Cream Background -->
  <rect width="1080" height="1920" fill="#F5F1E6" />
  <!-- Grid overlay -->
  <rect width="1080" height="1920" fill="url(#grid)" />

  <!-- Top UI Safe Zone Guideline (Visual hint, low opacity) -->
  <line x1="60" y1="220" x2="1020" y2="220" stroke="#111111" stroke-width="1.5" stroke-dasharray="6 6" opacity="0.15" />
  <text x="60" y="210" font-family="'Inter', sans-serif" font-size="14" font-weight="600" fill="#111111" opacity="0.2" letter-spacing="0.1em">TOP SAFE AREA LIMIT</text>

  <!-- Bottom UI Safe Zone Guideline -->
  <line x1="60" y1="1700" x2="1020" y2="1700" stroke="#111111" stroke-width="1.5" stroke-dasharray="6 6" opacity="0.15" />
  <text x="60" y="1725" font-family="'Inter', sans-serif" font-size="14" font-weight="600" fill="#111111" opacity="0.2" letter-spacing="0.1em">BOTTOM SAFE AREA LIMIT</text>

  <!-- Top Brand Bar -->
  <g transform="translate(60, 240)">
    <!-- Star -->
    <path d="M 16 2 L 18.5 12.5 L 29 16 L 18.5 19.5 L 16 30 L 13.5 19.5 L 3 16 L 13.5 12.5 Z" fill="#111111" />
    <!-- Text -->
    <text x="44" y="24" font-family="'Archivo Black', 'Arial Black', sans-serif" font-size="28" font-weight="900" letter-spacing="-0.02em">
      <tspan fill="#FF6A1A">ML</tspan><tspan fill="#111111">BUILDER</tspan>
    </text>
  </g>

  <!-- Bottom Handle Reference -->
  <text x="1020" y="1670" text-anchor="end" font-family="'Inter', sans-serif" font-size="24" font-weight="600" fill="#111111" opacity="0.5">@mlbuilder.py</text>

  <!-- Scattered Play Icons (background decoration) -->
  <use href="#play-decor" x="120" y="480" opacity="0.15" transform="scale(1.5)" />
  <use href="#play-decor" x="520" y="800" opacity="0.12" transform="scale(1.2)" />
  <use href="#play-decor" x="80" y="1250" opacity="0.15" transform="scale(1.4)" />
  <use href="#play-decor" x="580" y="1120" opacity="0.1" transform="scale(1.3)" />
  <use href="#play-decor" x="480" y="1450" opacity="0.15" transform="scale(1.5)" />
</svg>`
  },
  {
    name: 'post-template-base.svg',
    path: '/brand/instagram/post-template-base.svg',
    dimensions: '1080x1350 (4:5)',
    desc: 'Instagram portrait post template with top brand header and bottom CTA bar.',
    markup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1350" width="100%" height="100%">
  <defs>
    <!-- Graph-paper grid pattern -->
    <pattern id="grid" width="120" height="120" patternUnits="userSpaceOnUse">
      <path d="M 120 0 L 0 0 0 120" fill="none" stroke="#111111" stroke-width="1.5" opacity="0.08" />
    </pattern>
    
    <!-- Reusable Play Decor Icon -->
    <g id="play-decor">
      <circle cx="20" cy="20" r="19" stroke="#111111" stroke-width="2" fill="none" />
      <path d="M 17 13 L 27 20 L 17 27 Z" fill="#111111" />
    </g>
  </defs>

  <!-- Cream Background -->
  <rect width="1080" height="1350" fill="#F5F1E6" />
  <!-- Grid overlay -->
  <rect width="1080" height="1350" fill="url(#grid)" />

  <!-- Top Brand Bar -->
  <g transform="translate(60, 60)">
    <!-- Star -->
    <path d="M 16 2 L 18.5 12.5 L 29 16 L 18.5 19.5 L 16 30 L 13.5 19.5 L 3 16 L 13.5 12.5 Z" fill="#111111" />
    <!-- Text -->
    <text x="44" y="24" font-family="'Archivo Black', 'Arial Black', sans-serif" font-size="28" font-weight="900" letter-spacing="-0.02em">
      <tspan fill="#FF6A1A">ML</tspan><tspan fill="#111111">BUILDER</tspan>
    </text>
  </g>

  <!-- Bottom Bar Layout -->
  <line x1="60" y1="1240" x2="1020" y2="1240" stroke="#111111" stroke-width="2" opacity="0.15" />
  <text x="60" y="1285" font-family="'Inter', sans-serif" font-size="22" font-weight="700" fill="#FF6A1A" letter-spacing="0.05em">BUILD SOLO. SHARE OPENLY.</text>
  <text x="1020" y="1285" text-anchor="end" font-family="'Inter', sans-serif" font-size="22" font-weight="600" fill="#111111" opacity="0.6">@mlbuilder.py</text>

  <!-- Scattered Play Icons (background decoration) -->
  <use href="#play-decor" x="120" y="240" opacity="0.15" transform="scale(1.4)" />
  <use href="#play-decor" x="850" y="320" opacity="0.12" transform="scale(1.2)" />
  <use href="#play-decor" x="180" y="750" opacity="0.15" transform="scale(1.3)" />
  <use href="#play-decor" x="780" y="820" opacity="0.1" transform="scale(1.4)" />
</svg>`
  },
  {
    name: 'reel-cover-template.svg',
    path: '/brand/instagram/reel-cover-template.svg',
    dimensions: '1080x1920 (9:16)',
    desc: 'Instagram Reel cover sheet with center 1080x1080 safe grid crop visualization.',
    markup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="100%" height="100%">
  <defs>
    <!-- Graph-paper grid pattern -->
    <pattern id="grid" width="120" height="120" patternUnits="userSpaceOnUse">
      <path d="M 120 0 L 0 0 0 120" fill="none" stroke="#111111" stroke-width="1.5" opacity="0.08" />
    </pattern>
  </defs>

  <!-- Cream Background -->
  <rect width="1080" height="1920" fill="#F5F1E6" />
  <!-- Grid overlay -->
  <rect width="1080" height="1920" fill="url(#grid)" />

  <!-- 1:1 Feed Crop Guidelines -->
  <line x1="0" y1="420" x2="1080" y2="420" stroke="#111111" stroke-width="3" stroke-dasharray="10 10" opacity="0.25" />
  <line x1="0" y1="1500" x2="1080" y2="1500" stroke="#111111" stroke-width="3" stroke-dasharray="10 10" opacity="0.25" />
  
  <rect x="0" y="420" width="1080" height="1080" fill="none" stroke="#111111" stroke-width="2" opacity="0.1" />
  
  <text x="540" y="460" text-anchor="middle" font-family="'Inter', sans-serif" font-size="18" font-weight="700" fill="#111111" opacity="0.3" letter-spacing="0.1em">1:1 FEED SAFE AREA (CENTER SQUARE)</text>
  <text x="540" y="1480" text-anchor="middle" font-family="'Inter', sans-serif" font-size="18" font-weight="700" fill="#111111" opacity="0.3" letter-spacing="0.1em">1:1 FEED SAFE AREA (CENTER SQUARE)</text>

  <!-- WATCH Badge (Pill button layout in upper center) -->
  <g transform="translate(800, 480)">
    <rect width="220" height="64" rx="32" fill="#FF6A1A" stroke="#111111" stroke-width="3" />
    <text x="110" y="40" text-anchor="middle" font-family="'Archivo Black', 'Arial Black', sans-serif" font-size="20" font-weight="900" fill="#111111">▶ WATCH</text>
  </g>

  <!-- Big Display Headline Placeholder (Centered inside 1:1) -->
  <g transform="translate(0, 960)">
    <text x="540" y="-80" text-anchor="middle" font-family="'Archivo Black', 'Arial Black', sans-serif" font-size="72" font-weight="900" fill="#111111" letter-spacing="-0.02em">HOOK HEADLINE</text>
    <text x="540" y="10" text-anchor="middle" font-family="'Archivo Black', 'Arial Black', sans-serif" font-size="72" font-weight="900" fill="#FF6A1A" letter-spacing="-0.02em">GOES HERE</text>
    <text x="540" y="90" text-anchor="middle" font-family="'Caveat', cursive" font-size="44" font-weight="700" fill="#111111">Built solo. Shared openly.</text>
  </g>

  <!-- Logo Mark (Centered bottom of 1:1 safe area) -->
  <g transform="translate(380, 1380)">
    <!-- Star -->
    <path d="M 16 2 L 18.5 12.5 L 29 16 L 18.5 19.5 L 16 30 L 13.5 19.5 L 3 16 L 13.5 12.5 Z" fill="#111111" />
    <!-- Text -->
    <text x="44" y="24" font-family="'Archivo Black', 'Arial Black', sans-serif" font-size="28" font-weight="900" letter-spacing="-0.02em">
      <tspan fill="#FF6A1A">ML</tspan><tspan fill="#111111">BUILDER</tspan>
    </text>
  </g>
</svg>`
  }
];

const CHECKLIST_ITEMS = [
  { path: '/favicon.ico', briefPath: '/favicon.ico.README.txt', name: 'Multi-Res Favicon', dimensions: '16/32/48 ICO', type: 'System' },
  { path: '/favicon-16x16.png', briefPath: '/favicon-16x16.png.README.txt', name: 'Favicon PNG 16x16', dimensions: '16x16 PNG', type: 'System' },
  { path: '/favicon-32x32.png', briefPath: '/favicon-32x32.png.README.txt', name: 'Favicon PNG 32x32', dimensions: '32x32 PNG', type: 'System' },
  { path: '/apple-touch-icon.png', briefPath: '/apple-touch-icon.png.README.txt', name: 'Apple Touch Icon', dimensions: '180x180 PNG', type: 'System' },
  { path: '/icon-192.png', briefPath: '/icon-192.png.README.txt', name: 'PWA Manifest Icon 192', dimensions: '192x192 PNG', type: 'PWA' },
  { path: '/icon-512.png', briefPath: '/icon-512.png.README.txt', name: 'PWA Manifest Icon 512', dimensions: '512x512 PNG', type: 'PWA' },
  { path: '/icon-maskable.png', briefPath: '/icon-maskable.png.README.txt', name: 'PWA Maskable Icon', dimensions: '512x512 PNG', type: 'PWA' },
  { path: '/og-image.png', briefPath: '/og-image.png.README.txt', name: 'Static Open Graph Fallback', dimensions: '1200x630 PNG', type: 'Social' },
  { path: '/founder.jpg', briefPath: '/founder.jpg.README.txt', name: 'Founder Headshot (Kunj)', dimensions: '800x800 JPG', type: 'Content' },
  { path: '/brand/email-logo.png', briefPath: '/brand/email-logo.png.README.txt', name: 'Email Wordmark PNG', dimensions: '480x96 PNG', type: 'Email' }
];

export default function BrandAssets() {
  const [assetStatuses, setAssetStatuses] = useState<Record<string, 'loading' | 'active' | 'placeholder'>>({});
  const [selectedBrief, setSelectedBrief] = useState<string | null>(null);
  const [briefContent, setBriefContent] = useState<string>('');

  useEffect(() => {
    // Check files to see if they exist and are stubs or fully-fledged assets
    const checkStatuses = async () => {
      const statuses: Record<string, 'loading' | 'active' | 'placeholder'> = {};
      
      for (const item of CHECKLIST_ITEMS) {
        try {
          const res = await fetch(item.path);
          if (!res.ok) {
            statuses[item.path] = 'placeholder';
            continue;
          }
          const text = await res.text();
          if (text.trim() === 'stub') {
            statuses[item.path] = 'placeholder';
          } else {
            statuses[item.path] = 'active';
          }
        } catch {
          statuses[item.path] = 'placeholder';
        }
      }
      setAssetStatuses(statuses);
    };

    checkStatuses();
  }, []);

  const handleCopySVG = (markup: string, name: string) => {
    navigator.clipboard.writeText(markup);
    toast.success(`Copied ${name} markup!`);
  };

  const handleDownloadSVG = (markup: string, filename: string) => {
    const blob = new Blob([markup], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${filename}!`);
  };

  const handleViewBrief = async (briefPath: string, name: string) => {
    try {
      const res = await fetch(briefPath);
      if (!res.ok) {
        throw new Error('Brief file not found');
      }
      const text = await res.text();
      setSelectedBrief(name);
      setBriefContent(text);
    } catch {
      toast.error('Failed to load production brief.');
    }
  };

  // Dev-only gate
  if (import.meta.env.PROD) {
    return <NotFoundPage />;
  }

  return (
    <div className="min-h-screen bg-cream py-12 px-4 sm:px-6 lg:px-8 border-t-2 border-ink">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="border-2 border-ink p-8 bg-surface rounded-sharp shadow-hard relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-[30%] -translate-y-[30%] opacity-[0.03]">
            <svg width="400" height="400" viewBox="0 0 64 64" fill="none">
              <path d="M 32 4 L 37 25 L 60 32 L 37 39 L 32 60 L 27 39 L 4 32 L 27 25 Z" fill="#111111" />
            </svg>
          </div>
          <div className="relative z-10 space-y-4">
            <div className="inline-block bg-accent text-ink border-2 border-ink px-3 py-1 font-body text-xs font-semibold uppercase tracking-wider rounded-pill">
              Dev Suite — Brand Hub
            </div>
            <h1 className="font-display text-4xl sm:text-5xl tracking-tight text-ink">
              BRAND ASSETS.
            </h1>
            <p className="font-body text-base text-muted max-w-2xl leading-relaxed">
              MLBuilder visual design specification and digital asset library. Contains core swatches,
              typographic scales, vector assets, content creation templates, and checking metrics.
            </p>
          </div>
        </div>

        {/* Section 1: Color Palette */}
        <div className="space-y-6">
          <h2 className="font-display text-2xl text-ink tracking-tight flex items-center gap-2">
            <span className="text-accent">★</span> 01. COLOR PALETTE
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PALETTE.map((color) => (
              <div key={color.hex} className="border-2 border-ink bg-surface rounded-sharp shadow-hard overflow-hidden flex flex-col">
                <div className={`h-32 ${color.token} border-b-2 border-ink flex items-end p-4 justify-between`}>
                  <span className={`font-display text-lg tracking-tight ${color.text}`}>
                    {color.hex}
                  </span>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(color.hex);
                      toast.success(`Copied hex code ${color.hex}!`);
                    }}
                    className={`p-1.5 border border-current rounded-sharp bg-cream text-ink text-xs hover:scale-105 active:scale-95 transition-all`}
                  >
                    Copy
                  </button>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <h3 className="font-body font-bold text-ink text-sm">{color.name}</h3>
                    <p className="font-body text-xs text-muted mt-1">{color.desc}</p>
                  </div>
                  <div className="bg-cream-muted border border-ink/20 px-2.5 py-1 text-[10px] font-mono text-ink/75 self-start rounded-pill">
                    {color.token}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Typography */}
        <div className="space-y-6">
          <h2 className="font-display text-2xl text-ink tracking-tight flex items-center gap-2">
            <span className="text-accent">★</span> 02. TYPOGRAPHY
          </h2>
          <div className="border-2 border-ink bg-surface rounded-sharp shadow-hard p-6 sm:p-8 space-y-8">
            {TYPOGRAPHY.map((font) => (
              <div key={font.family} className="border-b border-ink/10 last:border-0 pb-6 last:pb-0 space-y-2">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-body font-bold text-ink text-lg">{font.name}</h3>
                  <span className="font-mono text-xs text-muted">{font.family} ({font.css})</span>
                </div>
                <div className={`text-ink ${font.css} text-2xl sm:text-3xl tracking-tight leading-normal`}>
                  {font.sample}
                </div>
                <div className="flex gap-4 text-xs font-mono text-muted">
                  <span>Regular: A-Z, a-z, 0-9</span>
                  <span>Variable weight support</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Logo System */}
        <div className="space-y-6">
          <h2 className="font-display text-2xl text-ink tracking-tight flex items-center gap-2">
            <span className="text-accent">★</span> 03. LOGO SYSTEM (VECTORS)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SVG_ASSETS.slice(0, 4).map((logo) => (
              <div key={logo.name} className="border-2 border-ink bg-surface rounded-sharp shadow-hard flex flex-col justify-between">
                <div className="p-4 border-b border-ink/10 flex justify-between items-center bg-cream-muted/50">
                  <div>
                    <h3 className="font-body font-bold text-ink text-sm">{logo.name}</h3>
                    <p className="text-[10px] font-mono text-muted">{logo.dimensions}</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleCopySVG(logo.markup, logo.name)}
                      className="px-2.5 py-1 border border-ink text-xs font-semibold rounded-sharp bg-cream hover:bg-ink hover:text-cream shadow-hard-sm transition-all"
                    >
                      Copy SVG
                    </button>
                    <button 
                      onClick={() => handleDownloadSVG(logo.markup, logo.name)}
                      className="px-2.5 py-1 border border-ink text-xs font-semibold rounded-sharp bg-accent hover:-translate-y-[1px] active:translate-y-0 transition-all"
                    >
                      Download
                    </button>
                  </div>
                </div>
                <div className="p-8 flex items-center justify-center bg-cream min-h-[160px] border-b border-ink/10">
                  <div className="max-w-[240px] max-h-[120px] w-full" dangerouslySetInnerHTML={{ __html: logo.markup }} />
                </div>
                <div className="p-4">
                  <p className="font-body text-xs text-muted">{logo.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Email & Letterhead Templates */}
        <div className="space-y-6">
          <h2 className="font-display text-2xl text-ink tracking-tight flex items-center gap-2">
            <span className="text-accent">★</span> 04. EMAIL & PRINT UTILITIES
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SVG_ASSETS.slice(4, 7).map((logo) => (
              <div key={logo.name} className="border-2 border-ink bg-surface rounded-sharp shadow-hard flex flex-col justify-between">
                <div className="p-4 border-b border-ink/10 flex justify-between items-center bg-cream-muted/50">
                  <div>
                    <h3 className="font-body font-bold text-ink text-sm">{logo.name}</h3>
                    <p className="text-[10px] font-mono text-muted">{logo.dimensions}</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleCopySVG(logo.markup, logo.name)}
                      className="px-2 py-1 border border-ink text-xs font-semibold rounded-sharp bg-cream hover:bg-ink hover:text-cream transition-all"
                    >
                      Copy
                    </button>
                    <button 
                      onClick={() => handleDownloadSVG(logo.markup, logo.name)}
                      className="px-2 py-1 border border-ink text-xs font-semibold rounded-sharp bg-accent transition-all"
                    >
                      Save
                    </button>
                  </div>
                </div>
                <div className="p-6 flex items-center justify-center bg-cream min-h-[220px] border-b border-ink/10 overflow-hidden">
                  <div className="max-w-[200px] max-h-[200px] w-full shadow-hard-sm border border-ink/10" dangerouslySetInnerHTML={{ __html: logo.markup }} />
                </div>
                <div className="p-4">
                  <p className="font-body text-xs text-muted">{logo.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Instagram Brand Assets */}
        <div className="space-y-6">
          <h2 className="font-display text-2xl text-ink tracking-tight flex items-center gap-2">
            <span className="text-accent">★</span> 05. INSTAGRAM TEMPLATES
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SVG_ASSETS.slice(7).map((logo) => (
              <div key={logo.name} className="border-2 border-ink bg-surface rounded-sharp shadow-hard flex flex-col justify-between">
                <div className="p-3 border-b border-ink/10 flex justify-between items-center bg-cream-muted/50">
                  <div>
                    <h3 className="font-body font-bold text-ink text-xs truncate max-w-[100px]">{logo.name}</h3>
                    <p className="text-[9px] font-mono text-muted">{logo.dimensions}</p>
                  </div>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => handleCopySVG(logo.markup, logo.name)}
                      className="px-1.5 py-0.5 border border-ink text-[10px] font-semibold rounded-sharp bg-cream transition-all"
                    >
                      Copy
                    </button>
                    <button 
                      onClick={() => handleDownloadSVG(logo.markup, logo.name)}
                      className="px-1.5 py-0.5 border border-ink text-[10px] font-semibold rounded-sharp bg-accent transition-all"
                    >
                      Save
                    </button>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-center bg-cream min-h-[200px] border-b border-ink/10">
                  <div className="w-full max-w-[120px] shadow-hard-sm border border-ink/10 overflow-hidden" dangerouslySetInnerHTML={{ __html: logo.markup }} />
                </div>
                <div className="p-3">
                  <p className="font-body text-[11px] text-muted leading-tight">{logo.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 6: Asset Checklist & Production Briefs */}
        <div className="space-y-6">
          <h2 className="font-display text-2xl text-ink tracking-tight flex items-center gap-2">
            <span className="text-accent">★</span> 06. PRODUCTION TRACKER & CHECKLIST
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Table Checklist */}
            <div className="lg:col-span-2 border-2 border-ink bg-surface rounded-sharp shadow-hard overflow-x-auto">
              <table className="min-w-full divide-y-2 divide-ink">
                <thead className="bg-cream-muted">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left font-display text-xs text-ink uppercase tracking-wider border-r border-ink">Asset Info</th>
                    <th scope="col" className="px-6 py-4 text-left font-display text-xs text-ink uppercase tracking-wider border-r border-ink">Format/Size</th>
                    <th scope="col" className="px-6 py-4 text-left font-display text-xs text-ink uppercase tracking-wider border-r border-ink">Status</th>
                    <th scope="col" className="px-6 py-4 text-left font-display text-xs text-ink uppercase tracking-wider">Brief</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/10">
                  {CHECKLIST_ITEMS.map((item) => (
                    <tr key={item.path}>
                      <td className="px-6 py-4 border-r border-ink/10 whitespace-nowrap">
                        <div className="font-body font-bold text-ink text-sm">{item.name}</div>
                        <div className="font-mono text-xs text-muted truncate max-w-[200px]">{item.path}</div>
                      </td>
                      <td className="px-6 py-4 border-r border-ink/10 whitespace-nowrap font-mono text-xs text-ink">
                        {item.dimensions}
                      </td>
                      <td className="px-6 py-4 border-r border-ink/10 whitespace-nowrap">
                        {assetStatuses[item.path] === 'loading' ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-200 text-gray-800">
                            Loading...
                          </span>
                        ) : assetStatuses[item.path] === 'active' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-400">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-400">
                            Placeholder
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleViewBrief(item.briefPath, item.name)}
                          className="text-xs font-bold text-accent hover:underline"
                        >
                          Read Brief →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Brief Render Drawer */}
            <div className="border-2 border-ink bg-surface rounded-sharp shadow-hard p-6 flex flex-col justify-between">
              {selectedBrief ? (
                <div className="space-y-4 flex-1 flex flex-col">
                  <div className="flex justify-between items-center border-b border-ink/10 pb-3">
                    <h3 className="font-display text-sm text-ink">{selectedBrief}</h3>
                    <button 
                      onClick={() => setSelectedBrief(null)} 
                      className="text-xs font-bold text-muted hover:text-ink"
                    >
                      Close ×
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto max-h-[380px] bg-cream p-4 border border-ink/20 font-mono text-xs whitespace-pre-wrap leading-relaxed text-ink/90 rounded-sharp">
                    {briefContent}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-8 flex-1">
                  <svg className="w-16 h-16 text-muted mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <h3 className="font-body font-bold text-ink text-sm">No production brief selected</h3>
                  <p className="font-body text-xs text-muted mt-2">
                    Click "Read Brief →" on any item in the tracker table to load instructions for creating the assets.
                  </p>
                </div>
              )}
              <div className="border-t border-ink/10 mt-6 pt-4 text-xs font-body text-muted leading-tight">
                <strong>Workflow Tip:</strong> Drop generated binary PNG/JPG assets directly into `/public/` replacing the dummy placeholders. The tracker updates automatically upon page reload.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
