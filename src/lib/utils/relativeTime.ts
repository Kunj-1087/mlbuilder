/**
 * Simple relative time formatter.
 * Returns strings like "just now", "5 min ago", "3 days ago", "2 weeks ago".
 */

const MINUTE = 60_000;
const HOUR = 3_600_000;
const DAY = 86_400_000;
const WEEK = 604_800_000;

export function relativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;

  if (diff < MINUTE) return 'just now';
  if (diff < HOUR) {
    const mins = Math.floor(diff / MINUTE);
    return `${mins} min ago`;
  }
  if (diff < DAY) {
    const hours = Math.floor(diff / HOUR);
    return `${hours}h ago`;
  }
  if (diff < WEEK) {
    const days = Math.floor(diff / DAY);
    return `${days} day${days === 1 ? '' : 's'} ago`;
  }
  if (diff < 4 * WEEK) {
    const weeks = Math.floor(diff / WEEK);
    return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
  }
  // Fall back to date
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
