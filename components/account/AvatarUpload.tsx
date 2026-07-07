"use client";

import { useRef, useState } from "react";
import { Label, Body } from "@/components/typography";

interface AvatarUploadProps {
  currentImage: string | null;
  name: string;
  onAvatarChange: (base64Image: string | null) => void;
}

export default function AvatarUpload({
  currentImage,
  name,
  onAvatarChange,
}: AvatarUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (e.g. 5MB raw, we compress it anyway)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be under 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        // Downscale image using canvas to minimize DB bloat
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const size = 120; // 120x120px avatar is optimal

        canvas.width = size;
        canvas.height = size;

        if (ctx) {
          // Draw image cropped in center square
          const minDim = Math.min(img.width, img.height);
          const sx = (img.width - minDim) / 2;
          const sy = (img.height - minDim) / 2;

          ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size);
          
          // Compress as JPEG
          const base64 = canvas.toDataURL("image/jpeg", 0.8);
          setPreviewUrl(base64);
          onAvatarChange(base64);
        }
      };
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    onAvatarChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const initials = (name || "U").charAt(0).toUpperCase();

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 p-6 border-2 border-ink rounded-sharp bg-cream-muted select-none">
      <div className="relative w-20 h-20 border-2 border-ink bg-surface flex-shrink-0 flex items-center justify-center overflow-hidden">
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt="Profile Avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-display-sm font-bold text-accent select-none font-display">
            {initials}
          </span>
        )}
      </div>

      <div className="flex-1 text-center sm:text-left">
        <Label className="text-body-xs font-bold text-ink uppercase tracking-wider block mb-1">
          Profile Avatar
        </Label>
        <Body size="xs" muted className="mb-4">
          Recommended: square JPG or PNG. Image will be optimized client-side.
        </Body>

        <div className="flex flex-wrap justify-center sm:justify-start gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/jpg"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 border-2 border-ink bg-surface hover:bg-ink hover:text-cream text-body-xs font-bold font-mono transition-all cursor-pointer shadow-hard-sm hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]"
          >
            UPLOAD
          </button>
          {previewUrl && (
            <button
              type="button"
              onClick={handleRemove}
              className="px-4 py-2 border-2 border-ink bg-transparent text-red-500 hover:bg-red-500 hover:text-cream text-body-xs font-bold font-mono transition-all cursor-pointer shadow-hard-sm hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]"
            >
              REMOVE
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


