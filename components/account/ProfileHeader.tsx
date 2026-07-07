import { Label } from "@/components/typography";

interface ProfileHeaderProps {
  name: string;
  email: string;
  createdAt: string;
}

export default function ProfileHeader({ name, email, createdAt }: ProfileHeaderProps) {
  const joinedDate = new Date(createdAt).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  return (
    <div className="border-b-2 border-ink/20 pb-8 mb-8 select-none">
      {/* ── Eyebrow Tag ── */}
      <div className="flex items-center gap-1.5 mb-4">
        <span className="text-accent text-sm">⚡</span>
        <span className="font-mono text-xs font-bold text-accent tracking-widest uppercase">
          MY ACCOUNT
        </span>
      </div>

      {/* ── Main Heading ── */}
      <h1 className="font-display text-4xl sm:text-5xl md:text-7xl uppercase tracking-tight leading-none">
        <span className="text-ink">HEY , </span>
        <span className="text-accent">{name || "DEVELOPER"}</span>
        <span className="text-ink"> .</span>
      </h1>

      {/* ── Subtitle (Cursive Script) ── */}
      <div className="font-script text-muted text-xl md:text-2xl mt-4 flex flex-wrap items-center gap-x-2 gap-y-1">
        <span className="hover:text-accent transition-colors duration-150">{email}</span>
        <span className="text-accent/60 font-sans">·</span>
        <span className="italic">Member since {joinedDate}</span>
      </div>
    </div>
  );
}

