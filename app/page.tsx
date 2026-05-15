import { CategoriesPreview } from '@/components/home/categories-preview';
import { ContactCta } from '@/components/home/contact-cta';
import { FoodFinderCta } from '@/components/home/food-finder-cta';
import { HeroSection } from '@/components/home/hero-section';
import { OffersPreview } from '@/components/home/offers-preview';
import { StoryPreview } from '@/components/home/story-preview';
import { TrustFeedbackLinks } from '@/components/home/trust-feedback-links';
import { ActiveOrderBanner } from '@/components/shared/active-order-banner';
import { PwaInstallCta } from '@/components/shared/pwa-install-cta';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function HomePage() {
  return (
    <div className="safe-bottom-mobile space-y-10">
      <HeroSection />
      <ActiveOrderBanner />
      <PwaInstallCta />
      <CategoriesPreview />
      <ContactCta />
      <FoodFinderCta />
      <OffersPreview />
      <StoryPreview />
      <TrustFeedbackLinks />
    </div>
  );
}
