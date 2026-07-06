import { DisplayHeading, Label } from "@/components/typography";

interface ProfileHeaderProps {
  name: string;
  email: string;
}

export default function ProfileHeader({ name, email }: ProfileHeaderProps) {
  return (
    <div className="border-b-2 border-ink pb-8 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 mb-2 select-none">
          <span className="text-accent font-mono text-xs">§</span>
          <Label className="text-body-xs font-bold text-muted tracking-widest uppercase">
            ACCOUNT PROFILE
          </Label>
        </div>
        <DisplayHeading as="h1" size="md" className="leading-none text-ink uppercase">
          {name || "DEVELOPER"}
        </DisplayHeading>
      </div>
      <div className="flex flex-col md:items-end text-muted font-mono text-body-xs">
        <span className="text-accent">ID: {email}</span>
        <span className="opacity-60">STATUS: ACTIVE_DEVELOPER</span>
      </div>
    </div>
  );
}
