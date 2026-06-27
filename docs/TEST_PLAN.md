# MLBuilder Manual QA & Automated Testing Plan

This document details the comprehensive testing plan for MLBuilder. It is divided into automated test instructions and a manual QA step-by-step checklist.

---

## Part 1: How to Run Automated Tests

### Prerequisites
1. Ensure your local PostgreSQL test container is running:
   ```bash
   npm run test:db:start
   ```
2. The testing database connection defaults to port `5433` as defined in `docker-compose.test.yml`.

### Quick Test Commands

- **Run all tests (unit + E2E):**
  ```bash
  npm run test
  ```
- **Run only unit & component tests (Vitest):**
  ```bash
  npm run test:unit
  ```
- **Run unit tests in watch mode:**
  ```bash
  npm run test:unit:watch
  ```
- **Run only E2E browser tests (Playwright):**
  ```bash
  npm run test:e2e
  ```
- **Run E2E tests with Playwright interactive UI:**
  ```bash
  npm run test:e2e:ui
  ```
- **Show test coverage report (Vitest):**
  - Runs Vitest coverage and updates HTML files in `/coverage/index.html`.
- **Show Playwright HTML report:**
  ```bash
  npx playwright show-report
  ```
- **Stop test database container:**
  ```bash
  npm run test:db:stop
  ```

---

## Part 2: Manual QA Test Checklist

Follow these checklists to perform human verification of the website layout, responsiveness, animations, and email delivery.

### Section A — Public Route Accessibility (No Auth)
- [ ] **A1.** Visit `/` (homepage) — loads without errors, hero renders, all CTAs visible, navbar shows "Sign In" button (NOT account avatar), footer renders with all link columns.
- [ ] **A2.** Visit `/about` — loads, founder section renders with photo placeholder (or real photo if added), all sections present.
- [ ] **A3.** Visit `/newsletter` — loads, newsletter form is visible and submittable.
- [ ] **A4.** Visit `/free` — loads, catalogue shows at least 1 lead magnet card (seeded), each card has cover + content visible.
- [ ] **A5.** Visit `/free/[slug-of-seeded-magnet]` — loads, 2-column layout, claim form on left, cover preview on right (sticky on desktop).
- [ ] **A6.** Visit `/sign-in` — loads with email/password form.
- [ ] **A7.** Visit `/sign-up` — loads with name/email/password form.
- [ ] **A8.** Visit `/forgot-password` — loads with email-only form.
- [ ] **A9.** Visit `/privacy` — loads with all sections, current consent state shown.
- [ ] **A10.** Visit `/blog` — gets REDIRECTED to `/sign-in?callbackUrl=/blog` (auth gate working).
- [ ] **A11.** Visit `/automation` — gets REDIRECTED to `/sign-in`.
- [ ] **A12.** Visit `/research` — gets REDIRECTED to `/sign-in`.
- [ ] **A13.** Visit `/tools` — gets REDIRECTED to `/sign-in`.
- [ ] **A14.** Visit `/account` — gets REDIRECTED to `/sign-in`.
- [ ] **A15.** Visit `/account/saved` — gets REDIRECTED to `/sign-in`.
- [ ] **A16.** Visit `/blog/community` — gets REDIRECTED to `/sign-in`.
- [ ] **A17.** Visit `/asdfnonexistent123` — shows branded 404 page with MLBuilder styling (NOT default Next.js 404), search suggestions visible, three CTAs work.

### Section B — Authentication Flows
- [ ] **B1.** From `/sign-up`, submit empty form → see inline validation errors.
- [ ] **B2.** From `/sign-up`, submit invalid email format → see "valid email" error.
- [ ] **B3.** From `/sign-up`, submit password under 8 chars → see length error.
- [ ] **B4.** From `/sign-up`, submit valid {name, email, password} → account created, auto-signed-in, redirected to `/automation`.
- [ ] **B5.** Check inbox of signup email → `SignupWelcomeEmail` received with personalized first name, 3 action cards, plain-text version readable.
- [ ] **B6.** From `/account`, click "Sign Out" → redirected to `/`, navbar shows "Sign In" again.
- [ ] **B7.** From `/sign-in`, submit wrong password → see "That email and password don't match" error.
- [ ] **B8.** From `/sign-in`, submit valid credentials → signed in, redirected appropriately.
- [ ] **B9.** From `/sign-in` URL like `/sign-in?callbackUrl=/blog/community`, sign in → redirected to `/blog/community`.
- [ ] **B10.** From `/sign-in`, click "Forgot password?" → arrives at `/forgot-password`.
- [ ] **B11.** From `/forgot-password`, submit a valid registered email → see success message.
- [ ] **B12.** Check inbox → `PasswordResetEmail` received with reset link.
- [ ] **B13.** Click reset link → arrives at `/reset-password?token=...` → enter new password → submit → success → redirected to `/sign-in`.
- [ ] **B14.** Sign in with new password → works.
- [ ] **B15.** Try to use the same reset link again → fails with appropriate error (token marked as used).
- [ ] **B16.** Manually craft an expired token URL → fails appropriately.

### Section C — Newsletter Subscription Flow
- [ ] **C1.** From `/`, scroll to newsletter section → form is visible.
- [ ] **C2.** Submit form with invalid email → inline error.
- [ ] **C3.** Submit form with valid email → success state replaces form ("CHECK YOUR INBOX").
- [ ] **C4.** Check inbox → `ConfirmationEmail` received with confirm button.
- [ ] **C5.** Click confirm button → redirected to `/newsletter/confirmed` → check inbox again.
- [ ] **C6.** Verify `WelcomeEmail` received after confirmation.
- [ ] **C7.** Try to subscribe SAME email again from any form → see "you're already on the list" message.
- [ ] **C8.** Go to `/account` (must be signed in) → newsletter status section shows "SUBSCRIBED ✓".
- [ ] **C9.** From `/account`, click "Unsubscribe" → status updates optimistically to "NOT SUBSCRIBED YET" → page reload confirms persistence.
- [ ] **C10.** Check inbox of unsubscribed email → verify no farewell email is triggered.
- [ ] **C11.** Try to subscribe same (now-unsubscribed) email → re-enters PENDING state, new confirmation email sent.
- [ ] **C12.** Test newsletter forms in ALL placement locations: homepage card variant, blog inline variant, site footer strip variant, `/newsletter` page card variant — each should work independently.
- [ ] **C13.** Submit form with email that's PENDING → see "Check your inbox — we just resent the confirmation link".
- [ ] **C14.** Check that the new confirmation email IS sent (token regenerated).

### Section D — Lead Magnet Flow
- [ ] **D1.** From `/`, see featured lead magnet strip ABOVE the "Get Started" CTA → strip shows correct magnet title.
- [ ] **D2.** Click strip → arrives at `/free/[slug]` landing page.
- [ ] **D3.** Visit `/free` directly → catalogue page loads with at least 1 magnet card.
- [ ] **D4.** Click magnet card → arrives at `/free/[slug]`.
- [ ] **D5.** Verify visual: cover image preview on right (sticky on desktop), 2-column layout, what's-inside bullets, claim form, FAQ accordion, final CTA.
- [ ] **D6.** Submit claim form with invalid email → inline error.
- [ ] **D7.** Submit claim form with valid email → success state ("CHECK YOUR INBOX").
- [ ] **D8.** Check inbox → `LeadMagnetDeliveryEmail` received with download button + bonus newsletter signup notice (if first-time email).
- [ ] **D9.** Click download button → PDF file downloads with correct filename derived from magnet title.
- [ ] **D10.** Verify in browser network tab: download route hit `/api/lead-magnet/download?token=...`.
- [ ] **D11.** Click download link AGAIN (re-download test) → file downloads again successfully (token NOT invalidated by use).
- [ ] **D12.** Check inbox AGAIN — verify newsletter confirmation email also arrived (cross-system integration).
- [ ] **D13.** Confirm newsletter from email → `/newsletter/confirmed` loads.
- [ ] **D14.** Submit claim form with email that's ALREADY confirmed newsletter subscriber → magnet delivered, but NO new newsletter confirmation email.
- [ ] **D15.** Submit claim form with email that's UNSUBSCRIBED → magnet delivered, but NO auto-resubscribe.
- [ ] **D16.** Try crafted invalid download token URL → redirected to `/free/error` with branded error page.
- [ ] **D17.** From `/free`, browse with filter (if filters exist) — verify filtering works.
- [ ] **D18.** Visit `/free/[invalid-slug]` → branded 404 page.

### Section E — Site-Wide Search
- [ ] **E1.** From any page, press `⌘+K` (Mac) or `Ctrl+K` (Windows) → search modal opens with cursor focused in input.
- [ ] **E2.** From any page, press `/` (forward slash) → search modal opens (UNLESS focus is in another input).
- [ ] **E3.** With focus in a form input, press `/` → does NOT open modal (typed as character).
- [ ] **E4.** Click navbar search trigger on desktop → modal opens.
- [ ] **E5.** Click navbar search icon on mobile → modal opens.
- [ ] **E6.** With empty input, verify "TRY SEARCHING FOR" suggestions render → click a suggestion → input populates and search runs.
- [ ] **E7.** Verify "QUICK LINKS" section shows static navigation (Home, About, Free Resources, Newsletter, Community, My Account).
- [ ] **E8.** Type "n8n" → results render grouped by type (BLOG, AUTOMATION, etc.), matched text highlighted.
- [ ] **E9.** Press `↓` arrow → focus moves to first result.
- [ ] **E10.** Press `↓` arrow repeatedly → focus moves through results.
- [ ] **E11.** Press `Enter` on a focused result → modal closes, navigates to result URL.
- [ ] **E12.** Press `Esc` → modal closes.
- [ ] **E13.** Click filter pill "Blog" → results filter to only blog type.
- [ ] **E14.** Click "All" → all results return.
- [ ] **E15.** Type query that matches nothing → empty state renders "NOTHING MATCHED" with helpful subtext + "Browse all content" link.
- [ ] **E16.** Verify in DB: `SearchLog` rows created for queries.
- [ ] **E17.** Click a result → verify `hadClick` logged.
- [ ] **E18.** Verify cached behavior: open modal, close, reopen — second open is INSTANT.
- [ ] **E19.** Mobile: open modal, verify body scroll is locked, input doesn't trigger iOS zoom (font-size >= 16px).

### Section F — Bookmark System
- [ ] **F1.** Sign in. Visit `/blog` → see bookmark button (variant: card-corner) on each blog card top-right.
- [ ] **F2.** Click bookmark icon on a card → icon fills with orange instantly (optimistic UI) → toast appears "Saved to your library".
- [ ] **F3.** Reload page → bookmark icon stays filled (persisted via bulk-check).
- [ ] **F4.** Click filled bookmark → icon empties instantly → toast "Removed from library".
- [ ] **F5.** Click bookmark on a search modal result → save works, modal stays open.
- [ ] **F6.** Click bookmark icon on `/free` catalogue card → saves.
- [ ] **F7.** Visit `/free/[slug]` detail page → see bookmark button (variant: icon-label) below title → click → toggles.
- [ ] **F8.** Sign out. Visit `/blog`. Click bookmark icon → tooltip flash "Sign in to save items" → redirected to `/sign-in?callbackUrl=/blog&reason=save`.
- [ ] **F9.** Sign in via that redirected flow → arrives back on `/blog` (callback honored).
- [ ] **F10.** Visit `/account` → "Items saved" stat shows real count.
- [ ] **F11.** Click "View all →" link (only visible if count > 0) → arrives at `/account/saved`.
- [ ] **F12.** `/account/saved` renders correctly: page hero with stats, sub-nav tabs (Dashboard, Saved Items), filter pills, search input, sort dropdown, grid of saved items.
- [ ] **F13.** Each saved item card shows cover, category tag, title, excerpt, "Saved X ago" footer.
- [ ] **F14.** Click "+ Add note" on a card → note editor opens → type note → click Save → note persists → reload to verify.
- [ ] **F15.** Edit existing note → save → persists.
- [ ] **F16.** Clear note text and save → note removed.
- [ ] **F17.** Click bookmark icon on a saved item card → optimistically removes → toast confirms → grid updates.
- [ ] **F18.** Use filter pills to filter saved items by type — only matching items shown.
- [ ] **F19.** Use search input → filters by title/excerpt/note.
- [ ] **F20.** Change sort dropdown → grid re-sorts.
- [ ] **F21.** Reset to empty saved list — verify empty state: "NOTHING SAVED YET" with Browse Blog + Free Resources CTAs.

### Section G — Account Dashboard
- [ ] **G1.** Sign in. Visit `/account` → personalized greeting renders with correct time-based prefix ("GOOD MORNING/AFTERNOON/EVENING/STILL UP").
- [ ] **G2.** First name renders in solid orange in headline.
- [ ] **G3.** Script subtext varies based on newsletter status (subscribed vs not).
- [ ] **G4.** Profile card shows: avatar (initial letter OR photo if user.image), name, email, member-since date, 3 action pills.
- [ ] **G5.** Activity card shows 3 stats: Posts read (placeholder 0), Items saved (real count), Days as member (real calculation).
- [ ] **G6.** Click "Edit Profile" → inline drawer slides down → form pre-filled with current name + email.
- [ ] **G7.** Change name only → click Save Changes → optimistically updates, ✓ checkmark appears briefly, drawer closes.
- [ ] **G8.** Reload → name persists.
- [ ] **G9.** Click Edit Profile → change email → click Save → redirected to `/sign-in` (forced sign-out).
- [ ] **G10.** Sign-in page shows banner "Your email has been updated. Sign in with your new email."
- [ ] **G11.** Check NEW email inbox → `EmailChangeVerificationEmail` received → click confirm → email actually updates. Check OLD email inbox → `EmailChangeCompletedEmail` received as notification.
- [ ] **G12.** Newsletter status section accurately reflects subscription state.
- [ ] **G13.** From newsletter section, click Subscribe (if not subscribed) → form embeds, pre-filled email, works.
- [ ] **G14.** Pillar quick-nav cards render with correct titles, icons, descriptions.
- [ ] **G15.** Click a pillar quick-nav card → navigates to corresponding pillar page.
- [ ] **G16.** Danger zone section visible at bottom with appropriate visual subtlety.
- [ ] **G17.** Click "Delete Account" → confirmation drawer slides down → text-to-confirm input visible → "Delete Forever" button DISABLED.
- [ ] **G18.** Type "delete" (lowercase) → button stays disabled.
- [ ] **G19.** Type "DELETE" → button enables.
- [ ] **G20.** Click Delete Forever → check inbox → `AccountDeletionConfirmationEmail` received with 24h confirmation link.
- [ ] **G21.** Click confirm link → account deleted → redirected to `/` with `?account=deleted` param → farewell toast appears.
- [ ] **G22.** Check inbox → `AccountDeletionFarewellEmail` received as final confirmation.
- [ ] **G23.** Try to sign in with deleted account credentials → fails appropriately.

### Section H — Community Page
- [ ] **H1.** Sign in. Visit `/blog/community` → page loads with hero, active platforms section, coming soon section, final CTA.
- [ ] **H2.** Instagram card shows correctly with stats, Follow CTA links to Instagram (opens new tab).
- [ ] **H3.** Newsletter card "Subscribe" button expands inline `NewsletterForm` (does NOT navigate).
- [ ] **H4.** Submit newsletter form within community page → success state.
- [ ] **H5.** Coming soon cards (Discord, YouTube, Twitter, Telegram) render with lower visual weight (no shadow, muted bg).
- [ ] **H6.** Click "Vote to prioritize →" on a coming-soon card → vote logged → link text changes to "✓ Voted" → vote count appears below description.
- [ ] **H7.** Refresh page → voted state persists.
- [ ] **H8.** Try to vote again on same card → button disabled, no second vote.
- [ ] **H9.** Sign in as second test user → vote on same card → count increments to 2.

### Section I — Error Pages
- [ ] **I1.** Visit nonexistent route → branded 404 with massive "404" + headline + script subtext + 3 CTAs + search suggestions.
- [ ] **I2.** Click "Take Me Home" → navigates to `/`.
- [ ] **I3.** Click "Browse Blog" → goes to `/blog`.
- [ ] **I4.** Click search suggestion chip → search modal opens with query pre-filled.
- [ ] **I5.** Force a runtime error in a protected route component → `/app/error.tsx` triggers → 500 page with "SOMETHING BROKE" + retry + email CTAs + error digest visible.
- [ ] **I6.** Click "Try Again" → reset() called, page re-renders.
- [ ] **I7.** Force error in `/app/(protected)/error.tsx` scope → scoped error UI renders INSIDE the layout (navbar still visible) → smaller card with retry + back to dashboard.
- [ ] **I8.** Verify `global-error.tsx` by breaking root layout — confirms minimal layout (no navbar) error page renders.
- [ ] **I9.** Visit `/unauthorized` directly → branded 401 page.
- [ ] **I10.** Visit `/offline` directly → branded offline page.
- [ ] **I11.** All error pages: verify noindex meta tag in page source.

### Section J — Loading States
- [ ] **J1.** Throttle network to "Slow 3G" in DevTools → navigate `/blog` → blog skeleton renders matching real layout.
- [ ] **J2.** Same throttle, navigate `/account` → dashboard skeleton renders with hero + sub-nav + 2-col grid skeletons.
- [ ] **J3.** Same throttle, navigate `/account/saved` → saved items skeleton with hero, filter pills, search, sort, grid.
- [ ] **J4.** Same throttle, navigate `/free` → catalogue skeleton with hero + 3-col grid.
- [ ] **J5.** Same throttle, navigate `/free/[slug]` → 2-col landing skeleton with cover preview skeleton.
- [ ] **J6.** Same throttle, navigate `/about` → about skeleton with photo + paragraphs + stats.
- [ ] **J7.** Submit newsletter form → button shows "Sending" + spinner during request.
- [ ] **J8.** Submit lead magnet claim → button shows "Sending" + spinner.
- [ ] **J9.** Click bookmark with API artificially delayed → after 200ms, spinner overlay appears on bookmark icon.
- [ ] **J10.** Navigate between routes → top-of-page `RouteProgressBar` appears in orange briefly.
- [ ] **J11.** Test prefers-reduced-motion: enable in DevTools Rendering tab → reload → verify shimmer animations replaced with static states.
- [ ] **J12.** Mobile (375px viewport) → all loading skeletons render without horizontal scroll.
- [ ] **J13.** Run Lighthouse → verify CLS (Cumulative Layout Shift) score is < 0.1.

### Section K — SEO Infrastructure
- [ ] **K1.** Visit `/opengraph-image` directly in browser → 1200x630 PNG renders with cream bg + "AI BUILDS. RESEARCH. TOOLS." headline + orange "AI" block.
- [ ] **K2.** Visit `/blog/[seeded-slug]/opengraph-image` → post-specific OG with post title rendered.
- [ ] **K3.** Visit `/free/[seeded-slug]/opengraph-image` → lead magnet OG with cover thumbnail visible on right side.
- [ ] **K4.** Visit `/sitemap.xml` → valid XML with all expected URLs (/, /about, /blog, /free, /newsletter, and seeded blog posts + lead magnets).
- [ ] **K5.** Verify `/sitemap.xml` does NOT include: `/account`, `/sign-in`, `/sign-up`, `/api/*`, `/newsletter/confirmed`, `/unauthorized`, `/offline`.
- [ ] **K6.** Visit `/robots.txt` → proper disallow rules visible, sitemap reference present, robot rules present.
- [ ] **K7.** Visit `/rss.xml` → valid RSS XML with blog posts, channel metadata, item dates in RFC 822 format.
- [ ] **K8.** Visit `/manifest.webmanifest` → valid JSON manifest.
- [ ] **K9.** View source on `/blog/[seeded-slug]` → confirm JSON-LD `<script type="application/ld+json">` present with `BlogPosting` schema.
- [ ] **K10.** View source on `/` → `WebSite` schema with `SearchAction`.
- [ ] **K11.** View source on `/about` → `Person` schema for founder.

### Section L — Analytics
- [ ] **L1.** Open browser in incognito, visit `/` → cookie banner appears after ~800ms at bottom.
- [ ] **L2.** Click "Reject" → banner dismisses → check Network tab: NO requests to posthog.com.
- [ ] **L3.** Trigger any event → confirm `track()` no-ops silently.
- [ ] **L4.** Visit `/privacy` → consent state shown as "Rejected" → click "Change my preference" → banner reappears.
- [ ] **L5.** Click "Accept" → banner dismisses → confirm PostHog initialization in Network tab.
- [ ] **L6.** Trigger `newsletter_form_viewed` → event fires.
- [ ] **L7.** Submit newsletter → `newsletter_subscribe_attempted` + `newsletter_subscribe_succeeded` events fire.
- [ ] **L8.** Confirm newsletter from email → `newsletter_confirmed` fires server-side.
- [ ] **L9.** Sign up new account → `auth_signup_completed` fires.
- [ ] **L10.** Sign in → `identify(userId)` fires with hashed email property.
- [ ] **L11.** Bookmark an item → `bookmark_added` fires with properties.
- [ ] **L12.** Run search → `search_modal_opened` fires with trigger source → `search_query_submitted` fires.
- [ ] **L13.** Click search result → `search_result_clicked` fires with properties.
- [ ] **L14.** Sign out → `posthog.reset()` called → subsequent events show as anonymous.
- [ ] **L15.** Set DNT header in browser → reload → PostHog does NOT init.

### Section M — Email Transactional System
- [ ] **M1.** Visit `/email-preview` in dev mode → see all email templates listed.
- [ ] **M2.** Click each template preview → renders correctly in iframe.
- [ ] **M3.** Click "send test to my email" for each template → verify each arrives in inbox.
- [ ] **M4.** Visual verification: open each email in Gmail web, Gmail mobile, Apple Mail, Outlook web → verify cream background, black text, and orange CTA button formatting.
- [ ] **M5.** Test plain-text fallback by viewing email source → readable plain version exists.
- [ ] **M6.** Verify subject lines under 50 chars.
- [ ] **M7.** Verify preheader text appears in inbox preview.

### Section N — Cross-Feature Integration Tests
- [ ] **N1.** Full Instagram → email funnel simulation.
- [ ] **N2.** Full signup → bookmark → search → save flow.
- [ ] **N3.** Auth flow + protected route + callbackUrl.
- [ ] **N4.** Account lifecycle complete (Signup -> edit -> delete -> cascade deletion).

### Section O — Performance & Accessibility
- [ ] **O1.** Run Lighthouse on `/` → Performance > 90, Accessibility > 95, Best Practices > 95, SEO 100.
- [ ] **O2.** Run Lighthouse on `/blog` (authenticated) → similar scores.
- [ ] **O3.** Run Lighthouse on `/free/[slug]` → similar scores.
- [ ] **O4.** Tab through homepage with keyboard only → focus rings visible, all interactive elements reachable, logical tab order.
- [ ] **O5.** Use VoiceOver (Mac) or NVDA (Windows) to navigate homepage → headings announced.
- [ ] **O6.** Verify color contrast meets WCAG AA.
- [ ] **O7.** Open search modal → tab navigation works inside modal, focus trapped.
- [ ] **O8.** Mobile responsive test (375px, 414px, 768px viewports) → all pages render correctly.

### Section P — Security Checks
- [ ] **P1.** Try to access any protected API route without auth (e.g. POST `/api/bookmarks`) → 401 response.
- [ ] **P2.** Try to update another user's bookmark by guessing IDs → 403.
- [ ] **P3.** Try to delete another user's bookmark → 403.
- [ ] **P4.** Submit form with SQL injection attempt in email field → input sanitized, no DB error.
- [ ] **P5.** Submit form with XSS attempt in user note field → script tag escaped on render.
- [ ] **P6.** Verify environment variables not exposed to client.
