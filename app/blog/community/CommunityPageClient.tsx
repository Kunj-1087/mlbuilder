"use client";

import { useState, useEffect } from 'react';
import ActivePlatformCard from '@/components/community/ActivePlatformCard';
import ComingSoonPlatformCard from '@/components/community/ComingSoonPlatformCard';
import {
  InstagramIcon,
  EnvelopeIcon,
  DiscordIcon,
  YouTubeIcon,
  TwitterIcon,
  TelegramIcon,
} from '@/components/community/icons';
import {
  getUserVotedPlatforms,
  getVoteCounts,
  voteForPlatform,
  type Platform,
} from '@/lib/community';
import { useAuth } from '@/context/AuthContext';
import PillButton from '@/components/PillButton';

export default function CommunityPageClient() {
  const { user } = useAuth();
  const [userVotes, setUserVotes] = useState<Platform[]>([]);
  const [counts, setCounts] = useState<Record<Platform, number>>({
    discord: 0,
    youtube: 0,
    twitter: 0,
    telegram: 0,
  });

  useEffect(() => {
    if (user?.id) {
      setUserVotes(getUserVotedPlatforms(user.id));
      setCounts(getVoteCounts());
    }
  }, [user?.id]);

  const handleVote = (platform: Platform) => {
    if (!user?.id) return;
    const newCount = voteForPlatform(user.id, platform);
    if (newCount === -1) return; // Already voted

    // Optimistic update
    setUserVotes((prev) => [...prev, platform]);
    setCounts((prev) => ({ ...prev, [platform]: newCount }));
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
      {/* SECTION 1 — Hero */}
      <section>
        <p className="font-body text-[13px] font-semibold uppercase tracking-[0.1em] text-ink mb-4">
          § MLBUILDER / BLOG / COMMUNITY
        </p>

        <h1 className="font-display text-[60px] sm:text-7xl md:text-8xl lg:text-9xl xl:text-[120px] leading-[0.95] tracking-tight mb-4 select-none">
          <span className="block">
            <span className="text-ink">FIND</span>{' '}
            <span className="text-accent">YOUR</span>{' '}
            <span className="text-ink">CREW</span>
          </span>
          <span className="block">
            <span className="text-accent">BUILD</span>{' '}
            <span className="text-ink">OUT</span>{' '}
            <span className="text-accent">LOUD</span>
          </span>
        </h1>

        <p className="font-script text-ink text-[22px] sm:text-2xl md:text-[26px] leading-snug max-w-xl mb-0 select-none">
          Small but growing — wherever you hang out online, MLBuilder probably has a corner there too. Or will soon.
        </p>

        <div className="h-[2px] bg-ink mt-12 select-none" />
      </section>

      {/* SECTION 2 — Active Platforms */}
      <section className="mt-10">
        <p className="font-body text-[13px] font-semibold uppercase tracking-[0.1em] text-ink mb-2 select-none">
          § WHERE WE'RE ACTIVE
        </p>
        <p className="font-script text-muted text-xl mb-6 select-none">Real platforms. Real people. Jump in.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ActivePlatformCard
            icon={<InstagramIcon />}
            name="INSTAGRAM"
            handle="@mlbuilder.py"
            description="Daily reels and carousels breaking down AI automations, n8n builds, and tool experiments."
            stats={[
              { value: 'Day 1', label: 'Posting since' },
              { value: 'Daily', label: 'Drop cadence' },
            ]}
            ctaLabel="Follow on Instagram →"
            ctaHref="https://instagram.com/mlbuilder.py"
          />

          <ActivePlatformCard
            icon={<EnvelopeIcon />}
            name="NEWSLETTER"
            handle="weekly drop"
            description="Build logs, research notes, and tool drops — straight to your inbox, no algorithm in the way."
            stats={[
              { value: 'Weekly', label: 'Cadence' },
              { value: '$0', label: 'To read' },
            ]}
            ctaLabel="Subscribe →"
            ctaType="newsletter-inline"
            newsletterSource="community-newsletter"
          />
        </div>
      </section>

      {/* SECTION 3 — Coming Soon Platforms */}
      <div className="h-[2px] bg-ink mt-16 select-none" />

      <section className="mt-10">
        <p className="font-body text-[13px] font-semibold uppercase tracking-[0.1em] text-ink mb-2 select-none">
          § COMING SOON
        </p>
        <p className="font-script text-muted text-xl mb-6 select-none">
          Planning to expand here as MLBuilder grows. Tell me which one you want first.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ComingSoonPlatformCard
            icon={<DiscordIcon />}
            name="DISCORD"
            description="A space to share builds, ask questions, and get unstuck together."
            voteCount={counts.discord}
            hasVoted={userVotes.includes('discord')}
            onVote={() => handleVote('discord')}
          />

          <ComingSoonPlatformCard
            icon={<YouTubeIcon />}
            name="YOUTUBE"
            description="Long-form build videos and full automation walkthroughs."
            voteCount={counts.youtube}
            hasVoted={userVotes.includes('youtube')}
            onVote={() => handleVote('youtube')}
          />

          <ComingSoonPlatformCard
            icon={<TwitterIcon />}
            name="TWITTER"
            description="Quick build updates, hot takes on AI tools, and threads."
            voteCount={counts.twitter}
            hasVoted={userVotes.includes('twitter')}
            onVote={() => handleVote('twitter')}
          />

          <ComingSoonPlatformCard
            icon={<TelegramIcon />}
            name="TELEGRAM"
            description="Daily AI tool drops and quick links — no fluff."
            voteCount={counts.telegram}
            hasVoted={userVotes.includes('telegram')}
            onVote={() => handleVote('telegram')}
          />
        </div>
      </section>

      {/* SECTION 4 — Final CTA */}
      <section className="mt-24 select-none">
        <div className="border-2 border-ink rounded-sharp bg-cream shadow-hard p-10 md:p-12 text-center">
          <h2 className="font-display text-[36px] text-ink leading-tight mb-3">
            ONE BUILDER. MULTIPLE CORNERS.
          </h2>
          <p className="font-script text-ink text-xl max-w-lg mx-auto mb-8 leading-relaxed">
            Community matters even at the start — it's how a solo project stops being just one person shouting into the void.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://instagram.com/mlbuilder.py"
              target="_blank"
              rel="noopener noreferrer"
            >
              <PillButton variant="primary" size="md">
                Follow on Instagram →
              </PillButton>
            </a>
            <PillButton to="/newsletter" variant="ghost" size="md">
              Subscribe to newsletter
            </PillButton>
          </div>
        </div>
      </section>
    </div>
  );
}
