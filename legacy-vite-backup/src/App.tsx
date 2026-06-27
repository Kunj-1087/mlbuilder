import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { SearchProvider } from '@/lib/search/SearchContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ErrorBoundary from '@/components/errors/ErrorBoundary';
import SearchModal from '@/components/search/SearchModal';
import SearchShortcutHandler from '@/components/search/SearchShortcutHandler';
import Toaster from '@/components/ui/Toaster';
import RouteProgressBar from '@/components/ui/loading/RouteProgressBar';
import { OrganizationSchema } from '@/components/seo/JsonLd';
import PostHogProvider from '@/components/analytics/PostHogProvider';
import CookieConsentBanner from '@/components/analytics/CookieConsentBanner';

// ── Route-specific skeleton fallbacks ──
import BlogSkeleton from '@/components/ui/skeletons/BlogSkeleton';
import PillarPageSkeleton from '@/components/ui/skeletons/PillarPageSkeleton';
import AccountSkeleton from '@/components/ui/skeletons/AccountSkeleton';
import SavedSkeleton from '@/components/ui/skeletons/SavedSkeleton';
import CommunitySkeleton from '@/components/ui/skeletons/CommunitySkeleton';
import AboutSkeleton from '@/components/ui/skeletons/AboutSkeleton';
import FreeCatalogueSkeleton from '@/components/ui/skeletons/FreeCatalogueSkeleton';
import LeadMagnetDetailSkeleton from '@/components/ui/skeletons/LeadMagnetDetailSkeleton';
import NewsletterSkeleton from '@/components/ui/skeletons/NewsletterSkeleton';

// ── Lazy-loaded pages ──
const Home = lazy(() => import('@/pages/Home'));
const SignIn = lazy(() => import('@/pages/SignIn'));
const SignUp = lazy(() => import('@/pages/SignUp'));
const About = lazy(() => import('@/pages/About'));
const Account = lazy(() => import('@/pages/Account'));
const SavedPage = lazy(() => import('@/pages/account/Saved'));
const NotFoundPage = lazy(() => import('@/pages/NotFound'));
const UnauthorizedPage = lazy(() => import('@/pages/Unauthorized'));
const OfflinePage = lazy(() => import('@/pages/Offline'));

const Automation = lazy(() => import('@/pages/automation/Automation'));
const Workflows = lazy(() => import('@/pages/automation/Workflows'));
const Scripts = lazy(() => import('@/pages/automation/Scripts'));
const CaseStudies = lazy(() => import('@/pages/automation/CaseStudies'));

const Research = lazy(() => import('@/pages/research/Research'));
const Papers = lazy(() => import('@/pages/research/Papers'));
const Library = lazy(() => import('@/pages/research/Library'));
const Insights = lazy(() => import('@/pages/research/Insights'));

const Tools = lazy(() => import('@/pages/tools/Tools'));
const Free = lazy(() => import('@/pages/tools/Free'));

const Blog = lazy(() => import('@/pages/blog/Blog'));
const Community = lazy(() => import('@/pages/blog/Community'));

const FreeCatalogue = lazy(() => import('@/pages/free/FreeCatalogue'));
const LeadMagnetDetail = lazy(() => import('@/pages/free/LeadMagnetDetail'));
const LeadMagnetError = lazy(() => import('@/pages/free/LeadMagnetError'));

const NewsletterPage = lazy(() => import('@/pages/newsletter/Newsletter'));
const NewsletterConfirmed = lazy(() => import('@/pages/newsletter/Confirmed'));
const NewsletterError = lazy(() => import('@/pages/newsletter/Error'));
const PrivacyPage = lazy(() => import('@/pages/Privacy'));
const ForgotPasswordPage = lazy(() => import('@/pages/ForgotPassword'));
const ResetPasswordPage = lazy(() => import('@/pages/ResetPassword'));
const EmailPreviewPage = lazy(() => import('@/pages/dev/EmailPreview'));
const BrandAssetsPage = lazy(() => import('@/pages/dev/BrandAssets'));

/** Wraps a lazy component with its route-specific skeleton fallback */
function LazyRoute({
  component: Component,
  fallback,
}: {
  component: React.ComponentType;
  fallback: React.ReactNode;
}) {
  return (
    <Suspense fallback={fallback}>
      <Component />
    </Suspense>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PostHogProvider>
        <SearchProvider>
          <div className="min-h-screen flex flex-col bg-cream">
            <OrganizationSchema />
            <RouteProgressBar />
            <Navbar />
            <main className="flex-1">
              <ErrorBoundary>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<LazyRoute component={Home} fallback={<div className="bg-cream min-h-[60vh]" />} />} />
                  <Route path="/sign-in" element={<LazyRoute component={SignIn} fallback={<div className="bg-cream min-h-[60vh]" />} />} />
                  <Route path="/sign-up" element={<LazyRoute component={SignUp} fallback={<div className="bg-cream min-h-[60vh]" />} />} />
                  <Route path="/about" element={<LazyRoute component={About} fallback={<AboutSkeleton />} />} />
                  <Route path="/privacy" element={<LazyRoute component={PrivacyPage} fallback={<div className="bg-cream min-h-[60vh]" />} />} />
                  <Route path="/forgot-password" element={<LazyRoute component={ForgotPasswordPage} fallback={<div className="bg-cream min-h-[60vh]" />} />} />
                  <Route path="/reset-password" element={<LazyRoute component={ResetPasswordPage} fallback={<div className="bg-cream min-h-[60vh]" />} />} />

                  {/* Dev-only routes */}
                  <Route path="/email-preview" element={<LazyRoute component={EmailPreviewPage} fallback={<div className="bg-cream min-h-[60vh]" />} />} />
                  <Route path="/brand-assets" element={<LazyRoute component={BrandAssetsPage} fallback={<div className="bg-cream min-h-[60vh]" />} />} />

                  {/* Error / auxiliary pages */}
                  <Route path="/unauthorized" element={<LazyRoute component={UnauthorizedPage} fallback={<div className="bg-cream min-h-[60vh]" />} />} />
                  <Route path="/offline" element={<LazyRoute component={OfflinePage} fallback={<div className="bg-cream min-h-[60vh]" />} />} />

                  {/* Newsletter */}
                  <Route path="/newsletter" element={<LazyRoute component={NewsletterPage} fallback={<NewsletterSkeleton />} />} />
                  <Route path="/newsletter/confirmed" element={<LazyRoute component={NewsletterConfirmed} fallback={<div className="bg-cream min-h-[60vh]" />} />} />
                  <Route path="/newsletter/error" element={<LazyRoute component={NewsletterError} fallback={<div className="bg-cream min-h-[60vh]" />} />} />

                  {/* Protected routes */}
                  <Route path="/account" element={<LazyRoute component={Account} fallback={<AccountSkeleton />} />} />
                  <Route path="/account/saved" element={<LazyRoute component={SavedPage} fallback={<SavedSkeleton />} />} />

                  <Route path="/automation" element={<LazyRoute component={Automation} fallback={<PillarPageSkeleton />} />}>
                    <Route path="workflows" element={<LazyRoute component={Workflows} fallback={<PillarPageSkeleton />} />} />
                    <Route path="scripts" element={<LazyRoute component={Scripts} fallback={<PillarPageSkeleton />} />} />
                    <Route path="case-studies" element={<LazyRoute component={CaseStudies} fallback={<PillarPageSkeleton />} />} />
                  </Route>

                  <Route path="/research" element={<LazyRoute component={Research} fallback={<PillarPageSkeleton />} />}>
                    <Route path="papers" element={<LazyRoute component={Papers} fallback={<PillarPageSkeleton />} />} />
                    <Route path="library" element={<LazyRoute component={Library} fallback={<PillarPageSkeleton />} />} />
                    <Route path="insights" element={<LazyRoute component={Insights} fallback={<PillarPageSkeleton />} />} />
                  </Route>

                  <Route path="/tools" element={<LazyRoute component={Tools} fallback={<PillarPageSkeleton />} />}>
                    <Route path="free" element={<LazyRoute component={Free} fallback={<PillarPageSkeleton />} />} />
                  </Route>

                  <Route path="/blog" element={<LazyRoute component={Blog} fallback={<BlogSkeleton />} />} />
                  <Route path="/blog/community" element={<LazyRoute component={Community} fallback={<CommunitySkeleton />} />} />

                  {/* Free resources */}
                  <Route path="/free" element={<LazyRoute component={FreeCatalogue} fallback={<FreeCatalogueSkeleton />} />} />
                  <Route path="/free/:slug" element={<LazyRoute component={LeadMagnetDetail} fallback={<LeadMagnetDetailSkeleton />} />} />
                  <Route path="/free/error" element={<LazyRoute component={LeadMagnetError} fallback={<div className="bg-cream min-h-[60vh]" />} />} />

                  {/* 404 catch-all */}
                  <Route path="*" element={<LazyRoute component={NotFoundPage} fallback={<div className="bg-cream min-h-[60vh]" />} />} />
                </Routes>
              </ErrorBoundary>
            </main>
            <Footer />
          </div>
          <SearchModal />
          <SearchShortcutHandler />
          <Toaster />
          <CookieConsentBanner />
        </SearchProvider>
        </PostHogProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
