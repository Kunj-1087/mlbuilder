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

  // Edit Mode toggle
  const [isEditing, setIsEditing] = useState(false);

  // Deletion confirm state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

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

      // Check if email changed
      const emailChanged = email.toLowerCase() !== initialUser.email.toLowerCase();

      if (emailChanged) {
        toast.success("Email changed. Re-authenticating...");
        await signOut({ callbackUrl: "/sign-in" });
        return;
      }

      // 2. Synchronize clientside NextAuth session token
      const sessionUpdateResult = updateUser({ name, email });
      
      if (!sessionUpdateResult.success) {
        throw new Error("Failed to synchronize auth session.");
      }

      toast.success("Profile saved successfully.");
      setIsEditing(false);
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

  const handleDeleteForever = async () => {
    if (deleteConfirmText !== "DELETE") return;
    setDeleting(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Failed to delete account");
      }
      toast.success("Account deleted permanently.");
      await signOut({ callbackUrl: "/sign-in" });
    } catch (err: any) {
      toast.error(err.message || "Something went wrong.");
      setDeleting(false);
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
          <div className="p-3.5 bg-accent/10 border-2 border-ink rounded text-ink text-body-xs font-semibold font-mono select-none">
            [ERROR] // {error}
          </div>
        )}

        {/* Avatar Section */}
        <AvatarUpload
          currentImage={image}
          name={name}
          onAvatarChange={(base64) => {
            setImage(base64);
            setIsEditing(true);
          }}
        />

        {/* Form Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div>
            <Label className="text-muted text-body-xs font-bold uppercase tracking-wider block mb-2 font-mono select-none">
              DEVELOPER NAME
            </Label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={!isEditing}
              placeholder="Full Name"
              className={`w-full bg-cream-muted border-2 border-ink rounded-sharp px-4 py-3 text-ink focus:outline-none focus:border-accent transition-colors font-body text-body-sm focus:shadow-[0_0_10px_rgba(79,124,255,0.25)] ${
                !isEditing ? "opacity-75 cursor-not-allowed" : ""
              }`}
            />
          </div>

          {/* Email Address */}
          <div>
            <Label className="text-muted text-body-xs font-bold uppercase tracking-wider block mb-2 font-mono select-none">
              EMAIL ID (PRIMARY)
            </Label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={!isEditing}
              placeholder="Email Address"
              className={`w-full bg-cream-muted border-2 border-ink rounded-sharp px-4 py-3 text-ink focus:outline-none focus:border-accent transition-colors font-body text-body-sm focus:shadow-[0_0_10px_rgba(79,124,255,0.25)] ${
                !isEditing ? "opacity-75 cursor-not-allowed" : ""
              }`}
            />
          </div>
        </div>

        {/* Metadata Details (Read-only) */}
        <div className="p-5 border border-ink/10 bg-cream-muted/50 rounded-sharp flex justify-between items-center text-body-xs font-mono text-muted select-none">
          <span>SYSTEM_JOINED_DATE:</span>
          <span className="text-ink font-bold">{formattedJoinedDate}</span>
        </div>

        {/* Action Button Row */}
        <div className="pt-2 flex gap-3">
          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center justify-center font-body font-semibold text-body-sm rounded-pill border-2 border-ink bg-cream text-ink shadow-hard hover:shadow-hard-lg hover:-translate-y-[2px] active:translate-y-0 transition-all duration-150 px-8 py-3 cursor-pointer select-none"
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center font-body font-semibold text-body-sm rounded-pill border-2 border-ink bg-accent text-ink shadow-hard hover:shadow-hard-lg hover:-translate-y-[2px] active:translate-y-0 transition-all duration-150 px-8 py-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none"
              >
                {saving ? "Saving Changes..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setName(initialUser.name || "");
                  setEmail(initialUser.email || "");
                  setImage(initialUser.image);
                  setError(null);
                }}
                className="inline-flex items-center justify-center font-body font-semibold text-body-sm rounded-pill border-2 border-ink bg-cream text-ink hover:bg-cream-muted transition-all duration-150 px-8 py-3 cursor-pointer select-none"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </form>

      {/* Danger Zone / Session Controls */}
      <div className="border-t-2 border-ink pt-8 max-w-2xl">
        <SectionHeading as="h3" size="sm" className="mb-2 text-ink uppercase font-mono tracking-wider select-none">
          System Controls
        </SectionHeading>
        <Body size="xs" muted className="mb-6 select-none">
          Safely delete your account forever or sign out of the authenticated session.
        </Body>

        <div className="flex flex-col gap-4 items-start">
          {!showDeleteConfirm ? (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => signOut()}
                className="px-6 py-2.5 border-2 border-ink bg-cream hover:bg-cream-muted text-ink text-body-xs font-bold font-mono transition-all cursor-pointer shadow-hard-sm hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] select-none"
              >
                Sign Out
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="px-6 py-2.5 border-2 border-red-500 bg-cream hover:bg-red-50 text-red-500 text-body-xs font-bold font-mono transition-all cursor-pointer shadow-hard-sm hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]"
              >
                Delete Account
              </button>
            </div>
          ) : (
            <div className="border-2 border-red-500 rounded-sharp p-6 bg-red-50/50 w-full space-y-4">
              <h4 className="font-display text-lg text-red-600 font-semibold select-none">
                ARE YOU ABSOLUTELY SURE?
              </h4>
              <p className="font-body text-body-xs text-red-700 select-none">
                This action is irreversible. All of your bookmarks and logs will be permanently deleted.
              </p>
              <div className="space-y-3">
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="Type DELETE to confirm"
                  className="w-full bg-cream border-2 border-red-500 rounded-sharp px-4 py-2.5 text-ink focus:outline-none transition-colors font-body text-body-sm"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={deleteConfirmText !== "DELETE" || deleting}
                    onClick={handleDeleteForever}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-cream rounded-pill font-body text-body-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {deleting ? "Deleting..." : "Delete Forever"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeleteConfirmText("");
                    }}
                    className="px-4 py-2 border border-ink/30 bg-cream text-ink rounded-pill font-body text-body-xs font-semibold cursor-pointer hover:bg-cream-muted select-none"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

