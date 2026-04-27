import { CategoriesPreview } from '@/components/home/categories-preview';
import { ContactCta } from '@/components/home/contact-cta';
import { FoodFinderCta } from '@/components/home/food-finder-cta';
import { HeroSection } from '@/components/home/hero-section';
import { OffersPreview } from '@/components/home/offers-preview';
import { StoryPreview } from '@/components/home/story-preview';

export default function HomePage() {
  return (
    <div className="space-y-8">
      <HeroSection />
      <CategoriesPreview />
      <FoodFinderCta />
      <OffersPreview />
      <StoryPreview />
      <ContactCta />
    </div>
  );
}
