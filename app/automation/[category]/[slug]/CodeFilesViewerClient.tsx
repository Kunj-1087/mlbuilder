"use client";

import { useState } from 'react';
import { track } from '@/lib/analytics/track';

interface CodeFileWithHtml {
  filename: string;
  language: string;
  content: string;
  lineCount: number;
  highlightedHtml: string;
}

interface CodeFilesViewerClientProps {
  categorySlug: string;
  automationSlug: string;
  codeFiles: CodeFileWithHtml[];
}

export default function CodeFilesViewerClient({
  categorySlug,
  automationSlug,
  codeFiles,
}: CodeFilesViewerClientProps) {
  // First file is expanded by default
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [copiedFilename, setCopiedFilename] = useState<string | null>(null);

  const toggleExpand = (index: number, filename: string) => {
    const isExpanding = expandedIndex !== index;
    setExpandedIndex(isExpanding ? index : null);

    if (isExpanding) {
      track('automation_code_file_expanded', {
        category: categorySlug,
        slug: automationSlug,
        filename,
        position_in_list: index + 1,
      });
    }
  };

  const handleCopy = (e: React.MouseEvent, code: string, filename: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code.trim());
    setCopiedFilename(filename);
    
    track('automation_code_copied', {
      category: categorySlug,
      slug: automationSlug,
      filename,
    });

    setTimeout(() => setCopiedFilename(null), 2000);
  };

  return (
    <div className="space-y-4">
      {codeFiles.map((file, idx) => {
        const isExpanded = expandedIndex === idx;
        const fileSizeKb = Math.ceil(file.content.length / 1024);
        const isCopied = copiedFilename === file.filename;

        return (
          <div key={file.filename} className="border-2 border-ink rounded-sharp overflow-hidden bg-[#FBF8F0] shadow-none">
            {/* Header row (always visible) */}
            <div
              onClick={() => toggleExpand(idx, file.filename)}
              className="flex items-center justify-between px-6 py-4 bg-[#EFEAD8] border-b-2 border-ink cursor-pointer hover:bg-[#EFEAD8]/80 transition-colors select-none"
            >
              <div className="flex items-center gap-3">
                <span className="font-body text-body-sm font-bold text-ink uppercase">
                  {file.filename}
                </span>
                <span className="font-body text-body-xs text-muted">
                  {file.lineCount} lines · {fileSizeKb} KB
                </span>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={(e) => handleCopy(e, file.content, file.filename)}
                  className="px-3 py-1 border-2 border-ink rounded-pill bg-cream text-xs font-bold text-ink hover:bg-accent transition-colors cursor-pointer select-none"
                >
                  {isCopied ? 'Copied ✓' : 'Copy'}
                </button>
                <span className="text-ink font-bold transform transition-transform duration-150 text-sm select-none">
                  {isExpanded ? '▲' : '▼'}
                </span>
              </div>
            </div>

            {/* Collapsible Body */}
            {isExpanded && (
              <div 
                className="p-6 overflow-x-auto font-mono text-body-xs leading-relaxed bg-[#FBF8F0] text-ink [&>pre]:bg-transparent [&>pre]:p-0"
                dangerouslySetInnerHTML={{ __html: file.highlightedHtml }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
