/** Product-funnel event names — no customer identifiers, no search text.
 * Used by optional Microsoft Clarity; harmless without a configured project. */
export type CustomerInsightEvent =
  | 'menu_category_select'
  | 'menu_search_results'
  | 'menu_product_open'
  | 'menu_add_to_cart';

export function trackCustomerInsight(event: CustomerInsightEvent) {
  if (typeof window === 'undefined') return;
  const clarity = (window as typeof window & {
    clarity?: (method: 'event', name: CustomerInsightEvent) => void;
  }).clarity;
  if (typeof clarity === 'function') clarity('event', event);
}
