import { featuredItems, menuCategories } from '@/lib/mock-data';
import type { MenuCategorySlug, MenuItem } from '@/types/menu';

export type FinderIntentId = 'crepe' | 'pizza' | 'pasta' | 'sandwich' | 'sweet' | 'drinks-addons';
export type FinderPreferenceId = 'chicken' | 'meat' | 'cheese-mix' | 'spicy' | 'light' | 'any';
export type FinderBudgetId = 'economic' | 'medium' | 'open';

export const finderIntentOptions: Array<{ id: FinderIntentId; label: string }> = [
  { id: 'crepe', label: 'كريب' },
  { id: 'pizza', label: 'بيتزا' },
  { id: 'pasta', label: 'باستا' },
  { id: 'sandwich', label: 'ساندوتش' },
  { id: 'sweet', label: 'حاجة حلوة' },
  { id: 'drinks-addons', label: 'مشروبات / إضافات' },
];

export const finderPreferenceOptions: Array<{ id: FinderPreferenceId; label: string }> = [
  { id: 'chicken', label: 'فراخ' },
  { id: 'meat', label: 'لحوم' },
  { id: 'cheese-mix', label: 'جبن / ميكس' },
  { id: 'spicy', label: 'حار' },
  { id: 'light', label: 'خفيف' },
  { id: 'any', label: 'مش فارقة' },
];

export const finderBudgetOptions: Array<{ id: FinderBudgetId; label: string }> = [
  { id: 'economic', label: 'اقتصادي' },
  { id: 'medium', label: 'متوسط' },
  { id: 'open', label: 'مفتوح' },
];

export type FoodFinderSelections = {
  intent: FinderIntentId;
  preference: FinderPreferenceId;
  budget: FinderBudgetId;
};

export type FoodFinderRecommendation = {
  item: MenuItem;
  categoryName: string;
  reason: string;
};

export type FoodFinderResult = {
  mode: 'exact' | 'closest';
  recommendations: FoodFinderRecommendation[];
};

const INTENT_CATEGORY_MAP: Record<FinderIntentId, MenuCategorySlug[]> = {
  crepe: ['crepe-meat', 'crepe-chicken', 'crepe-mixed', 'crepe-tuscanini'],
  pizza: ['pizza-meat', 'pizza-chicken', 'pizza-mixed', 'pizza-tuscanini'],
  pasta: ['pasta'],
  sandwich: ['sandwiches-french', 'sandwiches-kaiser'],
  sweet: ['crepe-sweet', 'waffle'],
  'drinks-addons': ['drinks', 'crepe-addons', 'appetizers'],
};

const categoryNameBySlug = new Map(menuCategories.map((category) => [category.slug, category.name]));

function itemText(item: MenuItem) {
  return `${item.name} ${item.description}`;
}

function matchesIntent(item: MenuItem, intent: FinderIntentId) {
  return INTENT_CATEGORY_MAP[intent].includes(item.categorySlug);
}

function matchesPreference(item: MenuItem, preference: FinderPreferenceId) {
  if (preference === 'any') {
    return true;
  }

  const text = itemText(item);

  if (preference === 'chicken') {
    return item.categorySlug.includes('chicken') || /فراخ|شيش|استربس|بانيه|زينجر/.test(text);
  }

  if (preference === 'meat') {
    return item.categorySlug.includes('meat') || /لحوم|لحم|برجر|سوسيس|سجق|كفتة|مفروم/.test(text);
  }

  if (preference === 'cheese-mix') {
    return (
      item.categorySlug.includes('mixed') ||
      item.categorySlug.includes('tuscanini') ||
      /جبن|ميكس|مشروم/.test(text)
    );
  }

  if (preference === 'spicy') {
    return /حار|شاورما|فاهيتا|زينجر/.test(text);
  }

  return item.priceFrom <= 70;
}

function matchesBudget(item: MenuItem, budget: FinderBudgetId) {
  if (budget === 'open') {
    return true;
  }

  if (budget === 'economic') {
    return item.priceFrom <= 60;
  }

  return item.priceFrom > 60 && item.priceFrom <= 90;
}

function buildReason(selections: FoodFinderSelections) {
  const reasons: string[] = [];

  if (selections.preference === 'any') {
    reasons.push('مناسب لأي مزاج');
  } else {
    const preferenceOption = finderPreferenceOptions.find((option) => option.id === selections.preference);
    if (preferenceOption) {
      reasons.push(`اختيار مناسب لو نفسك في ${preferenceOption.label}`);
    }
  }

  const budgetOption = finderBudgetOptions.find((option) => option.id === selections.budget);
  if (budgetOption) {
    reasons.push(`ويناسب ميزانية ${budgetOption.label}`);
  }

  return reasons.join(' • ');
}

function scoreItem(item: MenuItem, selections: FoodFinderSelections) {
  let score = 0;

  if (matchesIntent(item, selections.intent)) {
    score += 6;
  }

  if (matchesPreference(item, selections.preference)) {
    score += selections.preference === 'any' ? 1 : 3;
  }

  if (matchesBudget(item, selections.budget)) {
    score += 3;
  } else if (selections.budget === 'economic' && item.priceFrom <= 75) {
    score += 1;
  } else if (selections.budget === 'medium' && item.priceFrom <= 105) {
    score += 1;
  }

  return score;
}

export function getFoodFinderRecommendations(selections: FoodFinderSelections): FoodFinderResult {
  const exact = featuredItems.filter(
    (item) =>
      matchesIntent(item, selections.intent) &&
      matchesPreference(item, selections.preference) &&
      matchesBudget(item, selections.budget),
  );

  const sourceItems = exact.length > 0 ? exact : featuredItems;

  const ranked = sourceItems
    .map((item) => ({ item, score: scoreItem(item, selections) }))
    .sort((a, b) => b.score - a.score || a.item.priceFrom - b.item.priceFrom)
    .slice(0, 8)
    .map(({ item }) => ({
      item,
      categoryName: categoryNameBySlug.get(item.categorySlug) ?? 'قسم غير محدد',
      reason: buildReason(selections),
    }));

  return {
    mode: exact.length > 0 ? 'exact' : 'closest',
    recommendations: ranked,
  };
}
