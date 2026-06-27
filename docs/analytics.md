# MLBuilder Analytics Guide

## Setup

### Environment Variables

Add to `.env.local`:

```
VITE_POSTHOG_KEY=phc_xxxxxxxxxxxxx
VITE_POSTHOG_HOST=https://us.i.posthog.com
```

Get from https://posthog.com/ → create project → Settings → API Keys.

### Cookie Consent Flow

- Banner appears 800ms after first page load (stored in `localStorage` key `mlbuilder_consent`)
- Accept → PostHog initializes, events start flowing
- Reject → PostHog stays opted-out, all `track()` calls silently no-op
- Users can change preference at `/privacy`

---

## Event Reference

### Authentication Events

| Event Name | When | Properties |
|---|---|---|
| `auth_signup_started` | User clicks sign-up CTA | — |
| `auth_signup_completed` | Account created successfully | `source` |
| `auth_signin_started` | User lands on /sign-in | — |
| `auth_signin_completed` | User signs in | `source` |
| `auth_signout` | User signs out | — |
| `auth_account_deleted` | User deletes account | `days_active` |

### Newsletter Events

| Event Name | When | Properties |
|---|---|---|
| `newsletter_form_viewed` | Form visible on screen (IntersectionObserver) | `variant`, `source` |
| `newsletter_subscribe_attempted` | Form submitted | `source`, `variant` |
| `newsletter_subscribe_succeeded` | API returned success | `source`, `already_subscribed` |
| `newsletter_subscribe_failed` | API returned error | `source`, `error_type` |

### Lead Magnet Events

| Event Name | When | Properties |
|---|---|---|
| `lead_magnet_viewed` | Landing page loaded | `slug`, `source` |
| `lead_magnet_form_viewed` | Claim form visible on screen | `slug` |
| `lead_magnet_claim_attempted` | Form submitted | `slug`, `source` |
| `lead_magnet_claim_succeeded` | API returned success | `slug`, `source`, `already_subscribed` |

### Bookmark Events

| Event Name | When | Properties |
|---|---|---|
| `bookmark_added` | Item saved | `item_type`, `item_id`, `source_page` |
| `bookmark_removed` | Item unsaved | `item_type`, `item_id` |
| `bookmark_note_added` | User saves a note | `item_type`, `item_id` |
| `saved_items_viewed` | /account/saved page loaded | `total_bookmarks` |

### Search Events

| Event Name | When | Properties |
|---|---|---|
| `search_modal_opened` | Modal opens | `trigger` (shortcut/navbar) |
| `search_query_submitted` | Debounced query fires | `query`, `results_count` |
| `search_result_clicked` | User clicks a result | `query`, `result_type`, `result_position` |
| `search_no_results` | Query returns zero matches | `query` |

### Content Interaction Events

| Event Name | When | Properties |
|---|---|---|
| `blog_filter_changed` | Filter pill clicked | `from_filter`, `to_filter` |
| `pillar_page_viewed` | /automation, /research, /tools loaded | `pillar` |
| `free_resources_viewed` | /free page loaded | — |

### Navigation / CTA Events

| Event Name | When | Properties |
|---|---|---|
| `cta_clicked` | Any CTA with `data-cta-label` clicked | `cta_label`, `cta_location`, `destination_url` |
| `external_link_clicked` | External link with `data-external-link` clicked | `url`, `source_page`, `link_type` |
| `navbar_link_clicked` | Nav link with `data-nav-context="navbar"` clicked | `link_label`, `link_destination` |
| `footer_link_clicked` | Footer link with `data-nav-context="footer"` clicked | `link_label`, `link_destination` |

### Error Events

| Event Name | When | Properties |
|---|---|---|
| `error_page_viewed` | Error page mounted | `error_code`, `path` |
| `api_error_caught` | logError() called | `error_message`, `error_digest` |

### Consent Events

| Event Name | When | Properties |
|---|---|---|
| `consent_accepted` | User clicks Accept | `timestamp` |
| `consent_rejected` | User clicks Reject | `timestamp` |

### Auto-attached Properties

Every event automatically includes:
- `device_type` — "mobile" | "tablet" | "desktop"
- `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term` — if present in URL (persisted in sessionStorage)

---

## Recommended PostHog Funnels

### Funnel 1 — Newsletter Signup
1. `newsletter_form_viewed`
2. `newsletter_subscribe_attempted`
3. `newsletter_subscribe_succeeded`

Break down by `source` to see which placements convert best.

### Funnel 2 — Lead Magnet Conversion
1. `lead_magnet_viewed`
2. `lead_magnet_form_viewed`
3. `lead_magnet_claim_attempted`
4. `lead_magnet_claim_succeeded`

Break down by `slug` to compare magnets.

### Funnel 3 — Account Activation
1. `auth_signup_completed`
2. First content view (`blog_post_viewed`, `pillar_page_viewed`, etc.)
3. First `bookmark_added` or `newsletter_subscribe_succeeded`

### Funnel 4 — Instagram → Email Conversion
Filter all events by `utm_source = "instagram"`, then:
1. `pageview`
2. `newsletter_form_viewed`
3. `newsletter_subscribe_attempted`
4. `newsletter_subscribe_succeeded`

---

## Recommended Dashboard Panels

- **Weekly**: signups, newsletter subscribes, lead magnet downloads, bookmarks
- **Top 10 search queries** (last 30 days)
- **Top 10 zero-result queries** (content gap signal)
- **Most-bookmarked content** (across types)
- **Top traffic sources** (utm_source breakdown)
- **Most-clicked CTAs** (cta_label breakdown)
- **Error rate trend** (error_page_viewed + api_error_caught over time)
- **Mobile vs desktop** split for key conversion events

---

## TODO Items

- [ ] Set up separate PostHog projects for dev/staging/prod
- [ ] Build PostHog dashboards in the PostHog UI (event foundation is in place; UI config is manual)
- [ ] Enable session replay selectively (currently disabled — turn on only after defining clear use cases and opt-in mechanism)
- [ ] Implement A/B testing on key CTAs using PostHog feature flags (once event volume justifies it)
- [ ] Build internal /admin/insights dashboard pulling from PostHog API
- [ ] Add `data-cta-label` and `data-external-link` attributes to prominent CTA buttons for auto-tracking
