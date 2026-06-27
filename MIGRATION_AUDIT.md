# MLBuilder Next.js Migration Audit Report

This document serves as the audit log and checklist for the fullstack migration from Vite + React SPA to Next.js 14+ App Router.

---

## File Categorization (under `/src`)

### 1. REPLACE (Vite scaffolding & configurations)
- [x] [src/main.tsx](file:///d:/Movies/mlbuilder/src/main.tsx) — Replaced by Next.js root layout and App Router entry
- [x] [src/App.tsx](file:///d:/Movies/mlbuilder/src/App.tsx) — Replaced by `/app/layout.tsx` and filesystem routing
- [x] [src/vite-env.d.ts](file:///d:/Movies/mlbuilder/src/vite-env.d.ts) — Replaced by `next-env.d.ts`
- [x] [vite.config.ts](file:///d:/Movies/mlbuilder/vite.config.ts) — Replaced by `next.config.mjs`
- [x] [index.html](file:///d:/Movies/mlbuilder/index.html) — Replaced by `app/layout.tsx` and metadata configurations

---

### 2. PRESERVE WITH MODIFICATIONS (routing, state, or environment variables changes)

#### Pages (Refactored to Page Stubs or dynamic routes in `/app`)
- [ ] [src/pages/Home.tsx](file:///d:/Movies/mlbuilder/src/pages/Home.tsx) → Moved content to `/app/page.tsx`, removed `react-router-dom` imports
- [ ] [src/pages/About.tsx](file:///d:/Movies/mlbuilder/src/pages/About.tsx) → Replaced with stub in `/app/about/page.tsx`
- [ ] [src/pages/Privacy.tsx](file:///d:/Movies/mlbuilder/src/pages/Privacy.tsx) → Replaced with stub in `/app/privacy/page.tsx`
- [ ] [src/pages/ForgotPassword.tsx](file:///d:/Movies/mlbuilder/src/pages/ForgotPassword.tsx) → Replaced with stub in `/app/forgot-password/page.tsx`
- [ ] [src/pages/ResetPassword.tsx](file:///d:/Movies/mlbuilder/src/pages/ResetPassword.tsx) → Replaced with stub in `/app/reset-password/page.tsx`
- [ ] [src/pages/SignIn.tsx](file:///d:/Movies/mlbuilder/src/pages/SignIn.tsx) → Replaced with stub in `/app/sign-in/page.tsx`
- [ ] [src/pages/SignUp.tsx](file:///d:/Movies/mlbuilder/src/pages/SignUp.tsx) → Replaced with stub in `/app/sign-up/page.tsx`
- [ ] [src/pages/newsletter/Newsletter.tsx](file:///d:/Movies/mlbuilder/src/pages/newsletter/Newsletter.tsx) → Replaced with stub in `/app/newsletter/page.tsx`
- [ ] [src/pages/free/FreeCatalogue.tsx](file:///d:/Movies/mlbuilder/src/pages/free/FreeCatalogue.tsx) → Replaced with stub in `/app/free/page.tsx`
- [ ] [src/pages/account/Saved.tsx](file:///d:/Movies/mlbuilder/src/pages/account/Saved.tsx) → Replaced with stub in `/app/account/saved/page.tsx`
- [ ] [src/pages/Account.tsx](file:///d:/Movies/mlbuilder/src/pages/Account.tsx) → Replaced with stub in `/app/account/page.tsx`

#### UI Components (Adding `"use client"` and updating routing imports)
- [ ] [src/components/Navbar.tsx](file:///d:/Movies/mlbuilder/src/components/Navbar.tsx) → Use `next/link` & `next/navigation`, convert to Client Component
- [ ] [src/components/Footer.tsx](file:///d:/Movies/mlbuilder/src/components/Footer.tsx) → Use `next/link`
- [ ] [src/components/DropdownMenu.tsx](file:///d:/Movies/mlbuilder/src/components/DropdownMenu.tsx) → Use `next/link`, add `"use client"`
- [ ] [src/components/PillButton.tsx](file:///d:/Movies/mlbuilder/src/components/PillButton.tsx) → Add `"use client"`, replace `Link`
- [ ] [src/components/PillarLayout.tsx](file:///d:/Movies/mlbuilder/src/components/PillarLayout.tsx) → Remove `react-router-dom` wrappers, support Next.js page hierarchy
- [ ] [src/components/AuthForm.tsx](file:///d:/Movies/mlbuilder/src/components/AuthForm.tsx) → Adapt for NextAuth credentials flow, add `"use client"`
- [ ] [src/components/AuthGuard.tsx](file:///d:/Movies/mlbuilder/src/components/AuthGuard.tsx) → Replaced by Next.js middleware.ts auth gating
- [ ] [src/components/bookmarks/BookmarkButton.tsx](file:///d:/Movies/mlbuilder/src/components/bookmarks/BookmarkButton.tsx) → Use `next/navigation`, add `"use client"`
- [ ] [src/components/bookmarks/SavedItemCard.tsx](file:///d:/Movies/mlbuilder/src/components/bookmarks/SavedItemCard.tsx) → Use `next/link`
- [ ] [src/components/lead-magnet/FeaturedLeadMagnetStrip.tsx](file:///d:/Movies/mlbuilder/src/components/lead-magnet/FeaturedLeadMagnetStrip.tsx) → Use `next/link`
- [ ] [src/components/lead-magnet/LeadMagnetCard.tsx](file:///d:/Movies/mlbuilder/src/components/lead-magnet/LeadMagnetCard.tsx) → Use `next/link`
- [ ] [src/components/search/SearchModal.tsx](file:///d:/Movies/mlbuilder/src/components/search/SearchModal.tsx) → Use `next/navigation`, add `"use client"`
- [ ] [src/components/account/PillarQuickNavCard.tsx](file:///d:/Movies/mlbuilder/src/components/account/PillarQuickNavCard.tsx) → Use `next/link`
- [ ] [src/components/account/AccountSubNav.tsx](file:///d:/Movies/mlbuilder/src/components/account/AccountSubNav.tsx) → Use `next/link` & `next/navigation`, add `"use client"`
- [ ] [src/components/analytics/CookieConsentBanner.tsx](file:///d:/Movies/mlbuilder/src/components/analytics/CookieConsentBanner.tsx) → Use `next/link`
- [ ] [src/components/analytics/PostHogProvider.tsx](file:///d:/Movies/mlbuilder/src/components/analytics/PostHogProvider.tsx) → Add `"use client"`
- [ ] [src/components/errors/ErrorBoundary.tsx](file:///d:/Movies/mlbuilder/src/components/errors/ErrorBoundary.tsx) → Add `"use client"`, use `next/link`
- [ ] [src/components/errors/ErrorPageLayout.tsx](file:///d:/Movies/mlbuilder/src/components/errors/ErrorPageLayout.tsx) → Use `next/link`
- [ ] [src/components/seo/JsonLd.tsx](file:///d:/Movies/mlbuilder/src/components/seo/JsonLd.tsx) → Remove `react-helmet-async`, render raw `<script>` tag
- [ ] [src/components/seo/SeoHead.tsx](file:///d:/Movies/mlbuilder/src/components/seo/SeoHead.tsx) → Replaced by Next.js metadata API
- [ ] [src/components/ui/loading/RouteProgressBar.tsx](file:///d:/Movies/mlbuilder/src/components/ui/loading/RouteProgressBar.tsx) → Adapt for Next.js navigation events, add `"use client"`
- [ ] [src/index.css](file:///d:/Movies/mlbuilder/src/index.css) → Relocated to `/app/globals.css`, keeping brand tokens

#### Library Files & Contexts
- [ ] [src/context/AuthContext.tsx](file:///d:/Movies/mlbuilder/src/context/AuthContext.tsx) → Adapted to wrap NextAuth session context and expose compatible hooks
- [ ] [src/lib/seo/canonical.ts](file:///d:/Movies/mlbuilder/src/lib/seo/canonical.ts) → Replace `import.meta.env` with `process.env`
- [ ] [src/lib/email/send.ts](file:///d:/Movies/mlbuilder/src/lib/email/send.ts) → Replace `import.meta.env` with `process.env`
- [ ] [src/lib/analytics/posthog.ts](file:///d:/Movies/mlbuilder/src/lib/analytics/posthog.ts) → Replace `import.meta.env` with `process.env`

---

### 3. PRESERVE AS-IS (pure UI components / logic)
- [ ] [src/components/BorderedCard.tsx](file:///d:/Movies/mlbuilder/src/components/BorderedCard.tsx)
- [ ] [src/components/ComingSoon.tsx](file:///d:/Movies/mlbuilder/src/components/ComingSoon.tsx)
- [ ] [src/components/FilterPillRow.tsx](file:///d:/Movies/mlbuilder/src/components/FilterPillRow.tsx)
- [ ] [src/components/NewsletterForm.tsx](file:///d:/Movies/mlbuilder/src/components/NewsletterForm.tsx)
- [ ] [src/components/SkeletonLoader.tsx](file:///d:/Movies/mlbuilder/src/components/SkeletonLoader.tsx)
- [ ] [src/components/StatBox.tsx](file:///d:/Movies/mlbuilder/src/components/StatBox.tsx)
- [ ] [src/components/TickerBar.tsx](file:///d:/Movies/mlbuilder/src/components/TickerBar.tsx)
- [ ] [src/components/account/DashboardStatRow.tsx](file:///d:/Movies/mlbuilder/src/components/account/DashboardStatRow.tsx)
- [ ] [src/components/account/InlineDrawer.tsx](file:///d:/Movies/mlbuilder/src/components/account/InlineDrawer.tsx)
- [ ] [src/components/account/NewsletterStatusCard.tsx](file:///d:/Movies/mlbuilder/src/components/account/NewsletterStatusCard.tsx)
- [ ] [src/components/account/TimeGreeting.tsx](file:///d:/Movies/mlbuilder/src/components/account/TimeGreeting.tsx)
- [ ] [src/components/community/ActivePlatformCard.tsx](file:///d:/Movies/mlbuilder/src/components/community/ActivePlatformCard.tsx)
- [ ] [src/components/community/ComingSoonPlatformCard.tsx](file:///d:/Movies/mlbuilder/src/components/community/ComingSoonPlatformCard.tsx)
- [ ] [src/components/community/icons.tsx](file:///d:/Movies/mlbuilder/src/components/community/icons.tsx)
- [ ] [src/components/errors/AlternatingTitle.tsx](file:///d:/Movies/mlbuilder/src/components/errors/AlternatingTitle.tsx)
- [ ] [src/components/icons/PillarIcons.tsx](file:///d:/Movies/mlbuilder/src/components/icons/PillarIcons.tsx)
- [ ] [src/components/lead-magnet/LeadMagnetClaimForm.tsx](file:///d:/Movies/mlbuilder/src/components/lead-magnet/LeadMagnetClaimForm.tsx)
- [ ] [src/components/lead-magnet/LeadMagnetCoverArt.tsx](file:///d:/Movies/mlbuilder/src/components/lead-magnet/LeadMagnetCoverArt.tsx)
- [ ] [src/components/search/SearchShortcutHandler.tsx](file:///d:/Movies/mlbuilder/src/components/search/SearchShortcutHandler.tsx)
- [ ] [src/components/ui/Toaster.tsx](file:///d:/Movies/mlbuilder/src/components/ui/Toaster.tsx)
- [ ] [src/components/ui/loading/InlineSpinner.tsx](file:///d:/Movies/mlbuilder/src/components/ui/loading/InlineSpinner.tsx)
- [ ] [src/components/ui/loading/LoadingBar.tsx](file:///d:/Movies/mlbuilder/src/components/ui/loading/LoadingBar.tsx)
- [ ] All skeletons under [src/components/ui/skeletons/](file:///d:/Movies/mlbuilder/src/components/ui/skeletons/)
- [ ] All email template components under [src/emails/](file:///d:/Movies/mlbuilder/src/emails/)
- [ ] [src/lib/account.ts](file:///d:/Movies/mlbuilder/src/lib/account.ts)
- [ ] [src/lib/bookmarks.ts](file:///d:/Movies/mlbuilder/src/lib/bookmarks.ts)
- [ ] [src/lib/community.ts](file:///d:/Movies/mlbuilder/src/lib/community.ts)
- [ ] [src/lib/data/blogPosts.ts](file:///d:/Movies/mlbuilder/src/lib/data/blogPosts.ts)
- [ ] [src/lib/lead-magnet.ts](file:///d:/Movies/mlbuilder/src/lib/lead-magnet.ts)
- [ ] [src/lib/newsletter.ts](file:///d:/Movies/mlbuilder/src/lib/newsletter.ts)
- [ ] [src/lib/toast.ts](file:///d:/Movies/mlbuilder/src/lib/toast.ts)
- [ ] [src/lib/utils/relativeTime.ts](file:///d:/Movies/mlbuilder/src/lib/utils/relativeTime.ts)

---

## Dependency Audit

### 1. KEEP
- `@react-email/components`
- `@react-email/render`
- `clsx`
- `fuse.js`
- `posthog-js`
- `resend`
- `tailwind-merge`
- `typescript`
- `zod`
- `tailwindcss`

### 2. REPLACE (Vite specific and client-only routing)
- `@tailwindcss/vite` → Remove (tailwindcss uses native next.js plugin)
- `@vitejs/plugin-react` → Remove
- `vite` → Remove
- `vite-plugin-singlefile` → Remove
- `react-router-dom` → Remove (Next.js App Router replaces routing)
- `react-helmet-async` → Remove (Next.js native metadata API handles SEO)

### 3. ADD
- `next@latest` (Next.js Core framework)
- `react@latest`, `react-dom@latest` (upgrade React if needed)
- `next-auth@beta` (auth engine)
- `@auth/prisma-adapter` (NextAuth Prisma binding)
- `@prisma/client` (Prisma DB client)
- `bcryptjs` (password hashing)
- `prisma` (devDependency, Prisma CLI)
- `@types/bcryptjs` (devDependency, typing support)
- `concurrently` (devDependency, multi-runner for Postgres + Next)
- `tsx` (devDependency, type script script executor)
- `@types/node` (updated version)
- `@types/react` (updated version)
- `@types/react-dom` (updated version)

---

## Environment Variables Migration Checklist

1. Rename all instances of `import.meta.env.VITE_SITE_URL` to `process.env.NEXT_PUBLIC_SITE_URL`
2. Rename all instances of `import.meta.env.VITE_POSTHOG_KEY` to `process.env.NEXT_PUBLIC_POSTHOG_KEY`
3. Rename all instances of `import.meta.env.VITE_POSTHOG_HOST` to `process.env.NEXT_PUBLIC_POSTHOG_HOST`
4. Rename `VITE_SITE_URL`, `VITE_POSTHOG_KEY`, `VITE_POSTHOG_HOST` in `.env.example`
5. Add `NEXTAUTH_SECRET` and `NEXTAUTH_URL` variables to `.env.example`
6. Maintain `DATABASE_URL`, `RESEND_API_KEY`, and `RESEND_FROM_EMAIL` variables

---

## Database Schema Status

Prisma setup has been initialized. The `prisma/schema.prisma` is ready and verified.
DATABASE_URL must be configured prior to deploying. A Docker Compose file has been prepared to run a local Postgres instance on port 5432.
