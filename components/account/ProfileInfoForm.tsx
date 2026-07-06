"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/lib/toast";
import AvatarUpload from "./AvatarUpload";
import { Label, Body, SectionHeading } from "@/components/typography";

interface ProfileInfoFormProps {
  initialUser: {
    name: string;
    email: string;
    image: string | null;
    createdAt: string;
  };
}

export default function ProfileInfoForm({ initialUser }: ProfileInfoFormProps) {
  const { updateUser, signOut } = useAuth();
  const [name, setName] = useState(initialUser.name || "");
  const [email, setEmail] = useState(initialUser.email || "");
  const [image, setImage] = useState<string | null>(initialUser.image);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if form values changed
  const isDirty =
    name !== (initialUser.name || "") ||
    email !== (initialUser.email || "") ||
    image !== initialUser.image;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setSaving(true);
    setError(null);

    // Store backups for rollback
    const originalName = name;
    const originalEmail = email;
    const originalImage = image;

    try {
      // 1. Submit updates to database
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, image }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update profile.");
      }

      // 2. Synchronize clientside NextAuth session token
      const sessionUpdateResult = updateUser({ name, email });
      
      if (!sessionUpdateResult.success) {
        throw new Error("Failed to synchronize auth session.");
      }

      toast.success("Profile saved successfully.");
      
      // Update page state (or let nextjs refresh values)
      setError(null);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      toast.error(err.message || "Could not save profile changes.");
      
      // Rollback optimistic values
      setName(originalName);
      setEmail(originalEmail);
      setImage(originalImage);
    } finally {
      setSaving(false);
    }
  };

  const formattedJoinedDate = new Date(initialUser.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="space-y-10">
      {/* Form Card */}
      <form onSubmit={handleSave} className="space-y-8 max-w-2xl">
        {error && (
          <div className="p-3.5 bg-red-950/50 border border-red-500 rounded text-red-400 text-body-xs font-semibold font-mono">
            [ERROR] // {error}
          </div>
        )}

        {/* Avatar Section */}
        <AvatarUpload
          currentImage={image}
          name={name}
          onAvatarChange={(base64) => setImage(base64)}
        />

        {/* Form Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div>
            <Label className="text-muted text-body-xs font-bold uppercase tracking-wider block mb-2 font-mono">
              DEVELOPER NAME
            </Label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Full Name"
              className="w-full bg-cream-muted border-2 border-ink rounded-sharp px-4 py-3 text-ink focus:outline-none focus:border-accent transition-colors font-body text-body-sm focus:shadow-[0_0_10px_rgba(79,124,255,0.25)]"
            />
          </div>

          {/* Email Address */}
          <div>
            <Label className="text-muted text-body-xs font-bold uppercase tracking-wider block mb-2 font-mono">
              EMAIL ID (PRIMARY)
            </Label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email Address"
              className="w-full bg-cream-muted border-2 border-ink rounded-sharp px-4 py-3 text-ink focus:outline-none focus:border-accent transition-colors font-body text-body-sm focus:shadow-[0_0_10px_rgba(79,124,255,0.25)]"
            />
          </div>
        </div>

        {/* Metadata Details (Read-only) */}
        <div className="p-5 border border-ink/10 bg-cream-muted/50 rounded-sharp flex justify-between items-center text-body-xs font-mono text-muted">
          <span>SYSTEM_JOINED_DATE:</span>
          <span className="text-ink font-bold">{formattedJoinedDate}</span>
        </div>

        {/* Action Button Row */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={!isDirty || saving}
            className="inline-flex items-center justify-center font-body font-semibold text-body-sm rounded-pill border-2 border-ink bg-accent text-ink shadow-hard hover:shadow-hard-lg hover:-translate-y-[2px] active:translate-y-0 transition-all duration-150 px-8 py-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none"
          >
            {saving ? "SAVING CONFIG..." : "SAVE CHANGES →"}
          </button>
        </div>
      </form>

      {/* Danger Zone / Session Controls */}
      <div className="border-t-2 border-ink pt-8 max-w-2xl">
        <SectionHeading as="h3" size="sm" className="mb-2 text-ink uppercase font-mono tracking-wider">
          System Controls
        </SectionHeading>
        <Body size="xs" muted className="mb-4">
          Safely exit the authenticated session. You can re-authenticate at any time.
        </Body>
        <button
          type="button"
          onClick={() => signOut()}
          className="px-6 py-2.5 border-2 border-red-500/80 bg-cream hover:bg-red-500 hover:text-cream text-red-500 text-body-xs font-bold font-mono transition-all cursor-pointer shadow-hard-sm hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]"
        >
          SIGN OUT SESSION
        </button>
      </div>
    </div>
  );
}
