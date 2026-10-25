export type PublicExperienceRoute = {
  href: string;
  label: string;
  role: 'primary' | 'utility' | 'transaction' | 'support';
};

/**
 * The authored rebuild has its OWN information architecture.
 * These routes are real App Router routes in this repository, not links to prototypes.
 * Operator/admin routes are intentionally separate from the customer-facing shell.
 */
export const primaryExperienceNavigation = [
  { href: '/', label: 'الرئيسية', role: 'primary' },
  { href: '/menu', label: 'المنيو', role: 'primary' },
  { href: '/offers', label: 'العروض', role: 'primary' },
  { href: '/food-finder', label: 'اختار أكلك', role: 'primary' },
  { href: '/about', label: 'الحكاية', role: 'primary' },
] as const satisfies readonly PublicExperienceRoute[];

export const customerUtilityNavigation = [
  { href: '/account', label: 'حسابي وطلباتي', role: 'utility' },
  { href: '/contact', label: 'المكان والتواصل', role: 'utility' },
  { href: '/reviews', label: 'آراء الناس', role: 'support' },
  { href: '/complaints', label: 'مساعدة وشكاوى', role: 'support' },
] as const satisfies readonly PublicExperienceRoute[];

export const customerTransactionNavigation = [
  { href: '/cart', label: 'السلة', role: 'transaction' },
  { href: '/order-success', label: 'متابعة الطلب', role: 'transaction' },
] as const satisfies readonly PublicExperienceRoute[];

export const restaurantOperationsRoutes = [
  '/admin/login', '/admin', '/admin/products', '/admin/orders',
  '/admin/kitchen', '/admin/offers', '/admin/settings',
] as const;

/**
 * The entire experience must preserve the backend's truth:
 * order saved != restaurant confirmed != preparing != ready.
 */
export const experiencePrinciples = {
  fastOrderIsNeverGatedByEditorial: true,
  useOnlyRealFoodPhotography: true,
  presentOwnerDirectedPreviousMenuWithProvenance: true,
  realOrderPricesMustBeCheckedAgainstLiveDatabase: true,
  preserveAccessibleReducedMotion: true,
  brandVisualsDoNotLeakIntoAdminDataLogic: true,
} as const;
