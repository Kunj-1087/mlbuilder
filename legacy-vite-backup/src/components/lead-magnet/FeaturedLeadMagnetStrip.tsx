import { Link } from 'react-router-dom';
import { getFirstPublishedMagnet } from '@/lib/lead-magnet';

/**
 * FeaturedLeadMagnetStrip — slim horizontal CTA strip.
 *
 * Renders a bordered strip with a "📥 FREE PDF" tag, the magnet title,
 * and a "Grab it →" orange link. Used on homepage hero and blog index.
 *
 * Returns null if no published magnets exist.
 */
export default function FeaturedLeadMagnetStrip() {
  const magnet = getFirstPublishedMagnet();

  if (!magnet) return null;

  return (
    <Link
      to={`/free/${magnet.slug}`}
      className="
        block max-w-[720px] mx-auto
        border-2 border-ink rounded-sharp
        bg-cream shadow-hard
        px-4 py-3
        transition-all duration-150
        hover:shadow-hard-lg hover:-translate-y-[1px]
      "
    >
      <div className="flex items-center gap-3">
        {/* Tag pill */}
        <span className="flex-shrink-0 px-2.5 py-1 rounded-pill border-2 border-ink bg-surface font-body text-[11px] font-semibold text-ink tracking-wide">
          📥 FREE PDF
        </span>

        {/* Title */}
        <span className="font-body text-[14px] font-medium text-ink truncate flex-1 min-w-0">
          {magnet.title}
        </span>

        {/* CTA */}
        <span className="flex-shrink-0 font-body text-[14px] font-semibold text-accent">
          Grab it →
        </span>
      </div>
    </Link>
  );
}
