/**
 * This is the ONLY file that should import from next/font. 
 * Any other font loading is a bug — fix it by adding to this file instead.
 */

import { Archivo_Black, Inter, Caveat, Geist_Mono } from "next/font/google";

export const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-display",
  display: "swap",
  preload: true,
  fallback: ["Arial Black", "Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
  adjustFontFallback: true,
});

export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
  preload: true,
  fallback: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
  adjustFontFallback: true,
});

export const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-script",
  display: "swap",
  preload: false, // script font is less critical, can lazy-load
  fallback: ["Comic Sans MS", "cursive"],
  adjustFontFallback: false, // Caveat doesn't have a good metric-compatible fallback
});

export const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
  preload: false,
  fallback: ["Menlo", "Monaco", "Consolas", "Liberation Mono", "Courier New", "monospace"],
});
