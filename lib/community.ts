/**
 * Client-side community voting service.
 *
 * In production, replace with real API calls:
 *   GET  /api/community/vote         — returns user's voted platforms
 *   POST /api/community/vote         { platform }
 *
 * The simulated version stores votes in localStorage so the
 * full voting flow works in the demo.
 */

const VOTES_KEY = 'mlbuilder_community_votes';
const COUNTS_KEY = 'mlbuilder_community_vote_counts';

const PLATFORMS = ['discord', 'youtube', 'twitter', 'telegram'] as const;
export type Platform = (typeof PLATFORMS)[number];

// Seed some initial votes so the counts aren't all zero
const SEED_COUNTS: Record<Platform, number> = {
  discord: 3,
  youtube: 2,
  twitter: 1,
  telegram: 1,
};

interface UserVotes {
  [userId: string]: Platform[];
}

function getUserVotes(): UserVotes {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(VOTES_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveUserVotes(votes: UserVotes) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(VOTES_KEY, JSON.stringify(votes));
  } catch {
    // ignore
  }
}

function getCounts(): Record<Platform, number> {
  if (typeof window === 'undefined') return { ...SEED_COUNTS };
  try {
    const stored = JSON.parse(localStorage.getItem(COUNTS_KEY) || 'null');
    if (stored) return stored;
  } catch {
    // fall through
  }
  // Initialize with seed counts
  try {
    localStorage.setItem(COUNTS_KEY, JSON.stringify(SEED_COUNTS));
  } catch {
    // fall through
  }
  return { ...SEED_COUNTS };
}

function saveCounts(counts: Record<Platform, number>) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(COUNTS_KEY, JSON.stringify(counts));
  } catch {
    // ignore
  }
}

/**
 * Get the platforms the current user has voted for.
 */
export function getUserVotedPlatforms(userId: string): Platform[] {
  const votes = getUserVotes();
  return votes[userId] || [];
}

/**
 * Get current vote counts for all platforms.
 */
export function getVoteCounts(): Record<Platform, number> {
  return getCounts();
}

/**
 * Vote for a platform. Returns updated count, or -1 if already voted.
 */
export function voteForPlatform(userId: string, platform: Platform): number {
  const votes = getUserVotes();
  const userVotes = votes[userId] || [];

  if (userVotes.includes(platform)) {
    return -1; // Already voted
  }

  userVotes.push(platform);
  votes[userId] = userVotes;
  saveUserVotes(votes);

  const counts = getCounts();
  counts[platform] = (counts[platform] || 0) + 1;
  saveCounts(counts);

  return counts[platform];
}
