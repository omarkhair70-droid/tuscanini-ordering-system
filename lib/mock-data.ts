import type { MenuCategory, MenuItem } from '@/types/menu';
import type { Offer } from '@/types/offers';

export const menuCategories: MenuCategory[] = [
  { id: 'c1', name: 'كريب', slug: 'crepe', description: 'كريب فراخ ولحوم وحشوات متنوعة.' },
  { id: 'c2', name: 'بيتزا', slug: 'pizza', description: 'بيتزا بصوص غني وإضافات شهية.' },
  { id: 'c3', name: 'باستا', slug: 'pasta', description: 'باستا بصوصات كريمي وأحمر.' },
  { id: 'c4', name: 'ساندوتشات', slug: 'sandwiches', description: 'ساندوتشات سريعة ومشبعة.' },
  { id: 'c5', name: 'مقبلات', slug: 'appetizers', description: 'بطاطس، أصابع، إضافات جانبية.' },
  { id: 'c6', name: 'مشروبات', slug: 'drinks', description: 'مشروبات غازية وعصائر باردة.' },
  { id: 'c7', name: 'عروض', slug: 'offers', description: 'تجميعات موفرة للأفراد والمجموعات.' },
];

export const featuredItems: MenuItem[] = [
  {
    id: 'm1',
    name: 'كريب تشيكن رانش',
    categorySlug: 'crepe',
    description: 'فراخ مشوية، رانش، جبنة موزاريلا.',
    priceFrom: 95,
    tag: 'الأكثر طلبًا',
  },
  {
    id: 'm2',
    name: 'بيتزا ميكس توسكانيني',
    categorySlug: 'pizza',
    description: 'تشكيلة فراخ ولحوم مع جبنة إضافية.',
    priceFrom: 165,
    tag: 'جديد',
  },
  {
    id: 'm3',
    name: 'باستا ألفريدو دجاج',
    categorySlug: 'pasta',
    description: 'صوص كريمي غني مع قطع دجاج.',
    priceFrom: 120,
  },
];

export const mockOffers: Offer[] = [
  {
    id: 'o1',
    title: 'عرض الثنائي',
    description: '2 كريب + 2 مشروب بسعر مميز.',
    price: 210,
  },
  {
    id: 'o2',
    title: 'عرض العيلة',
    description: 'بيتزا عائلية + مقبلات + 4 مشروبات.',
    price: 399,
  },
];
