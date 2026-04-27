import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

type MenuCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
};

type ProductSize = { id: string; label: string; price: number };
type ProductAddon = { id: string; label: string; price: number };

type MenuItem = {
  id: string;
  name: string;
  categorySlug: string;
  description: string;
  priceFrom: number;
  basePrice?: number;
  availability: 'available' | 'limited' | 'unavailable';
  sizes?: ProductSize[];
  addons?: ProductAddon[];
};

function loadMockData(): { menuCategories: MenuCategory[]; featuredItems: MenuItem[] } {
  let source = readFileSync('lib/mock-data.ts', 'utf8');
  source = source.replace(/^import[^\n]*\n/gm, '');
  source = source.replace(/export const /g, 'const ');
  source = source.replace(/: MenuCategory\[\]/g, '');
  source = source.replace(/: MenuItem\[\]/g, '');
  source = source.replace(/: Offer\[\]/g, '');

  const context = {} as {
    menuCategories: MenuCategory[];
    featuredItems: MenuItem[];
  };

  vm.createContext(context);
  vm.runInContext(
    `${source}\nthis.menuCategories = menuCategories; this.featuredItems = featuredItems;`,
    context,
  );

  return { menuCategories: context.menuCategories, featuredItems: context.featuredItems };
}

function runPsql(dbUrl: string, query: string): string {
  return execFileSync('psql', [dbUrl, '-v', 'ON_ERROR_STOP=1', '-At', '-F', '\t', '-c', query], {
    encoding: 'utf8',
  }).trim();
}

function toNum(value: string): number {
  return Number.parseFloat(value);
}

function setDiff(expected: Set<string>, actual: Set<string>): { missing: string[]; extra: string[] } {
  const missing = [...expected].filter((id) => !actual.has(id)).sort();
  const extra = [...actual].filter((id) => !expected.has(id)).sort();
  return { missing, extra };
}

const dbUrl = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;
if (!dbUrl) {
  console.error('Missing SUPABASE_DB_URL (or DATABASE_URL).');
  process.exit(1);
}

const { menuCategories, featuredItems } = loadMockData();

const expectedCategoryIds = new Set(menuCategories.map((c) => c.id));
const expectedProductIds = new Set(featuredItems.map((p) => p.id));
const expectedSizeIds = new Set(featuredItems.flatMap((p) => (p.sizes ?? []).map((s) => `${p.id}:${s.id}`)));
const expectedAddonIds = new Set(featuredItems.flatMap((p) => (p.addons ?? []).map((a) => a.id)));

const expectedProductPrices = new Map(
  featuredItems.map((p) => [p.id, { priceFrom: Number(p.priceFrom), basePrice: p.basePrice == null ? null : Number(p.basePrice) }]),
);
const expectedSizePrices = new Map<string, number>(
  featuredItems.flatMap((p) => (p.sizes ?? []).map((s) => [`${p.id}:${s.id}`, Number(s.price)] as const)),
);
const expectedAddonPrices = featuredItems
  .flatMap((p) => p.addons ?? [])
  .reduce<Map<string, number>>((acc, addon) => acc.set(addon.id, Number(addon.price)), new Map());

const actualCategoryLines = runPsql(
  dbUrl,
  "select legacy_id from public.menu_categories where legacy_id is not null order by legacy_id;",
)
  .split('\n')
  .filter(Boolean);
const actualProductLines = runPsql(
  dbUrl,
  "select legacy_id from public.products where legacy_id is not null order by legacy_id;",
)
  .split('\n')
  .filter(Boolean);
const actualSizeLines = runPsql(
  dbUrl,
  "select legacy_id from public.product_sizes where legacy_id is not null order by legacy_id;",
)
  .split('\n')
  .filter(Boolean);
const actualAddonLines = runPsql(
  dbUrl,
  "select legacy_id from public.product_addons where legacy_id is not null order by legacy_id;",
)
  .split('\n')
  .filter(Boolean);

const categoryDiff = setDiff(expectedCategoryIds, new Set(actualCategoryLines));
const productDiff = setDiff(expectedProductIds, new Set(actualProductLines));
const sizeDiff = setDiff(expectedSizeIds, new Set(actualSizeLines));
const addonDiff = setDiff(expectedAddonIds, new Set(actualAddonLines));

const errors: string[] = [];

if (actualCategoryLines.length !== expectedCategoryIds.size) {
  errors.push(`Category count mismatch: expected ${expectedCategoryIds.size}, got ${actualCategoryLines.length}`);
}
if (actualProductLines.length !== expectedProductIds.size) {
  errors.push(`Product count mismatch: expected ${expectedProductIds.size}, got ${actualProductLines.length}`);
}
if (actualSizeLines.length !== expectedSizeIds.size) {
  errors.push(`Size count mismatch: expected ${expectedSizeIds.size}, got ${actualSizeLines.length}`);
}
if (actualAddonLines.length !== expectedAddonIds.size) {
  errors.push(`Addon count mismatch: expected ${expectedAddonIds.size}, got ${actualAddonLines.length}`);
}

const diffChecks: Array<[string, { missing: string[]; extra: string[] }]> = [
  ['categories', categoryDiff],
  ['products', productDiff],
  ['sizes', sizeDiff],
  ['addons', addonDiff],
];
for (const [label, diff] of diffChecks) {
  if (diff.missing.length > 0) {
    errors.push(`${label} missing legacy IDs: ${diff.missing.join(', ')}`);
  }
  if (diff.extra.length > 0) {
    errors.push(`${label} extra legacy IDs: ${diff.extra.join(', ')}`);
  }
}

const productPriceRows = runPsql(
  dbUrl,
  `select legacy_id, price_from::text, coalesce(base_price::text, '')
   from public.products
   where legacy_id is not null
   order by legacy_id;`,
)
  .split('\n')
  .filter(Boolean);
for (const row of productPriceRows) {
  const [legacyId, priceFromText, basePriceText] = row.split('\t');
  const expected = expectedProductPrices.get(legacyId);
  if (!expected) {
    continue;
  }

  const actualPriceFrom = toNum(priceFromText);
  if (actualPriceFrom !== expected.priceFrom) {
    errors.push(`Product price_from mismatch for ${legacyId}: expected ${expected.priceFrom}, got ${actualPriceFrom}`);
  }

  const actualBasePrice = basePriceText === '' ? null : toNum(basePriceText);
  if (actualBasePrice !== expected.basePrice) {
    errors.push(`Product base_price mismatch for ${legacyId}: expected ${expected.basePrice}, got ${actualBasePrice}`);
  }
}

const sizePriceRows = runPsql(
  dbUrl,
  `select legacy_id, price::text
   from public.product_sizes
   where legacy_id is not null
   order by legacy_id;`,
)
  .split('\n')
  .filter(Boolean);
for (const row of sizePriceRows) {
  const [legacyId, priceText] = row.split('\t');
  const expected = expectedSizePrices.get(legacyId);
  if (expected == null) {
    continue;
  }
  const actual = toNum(priceText);
  if (actual !== expected) {
    errors.push(`Size price mismatch for ${legacyId}: expected ${expected}, got ${actual}`);
  }
}

const addonPriceRows = runPsql(
  dbUrl,
  `select legacy_id, price::text
   from public.product_addons
   where legacy_id is not null
   order by legacy_id;`,
)
  .split('\n')
  .filter(Boolean);
for (const row of addonPriceRows) {
  const [legacyId, priceText] = row.split('\t');
  const expected = expectedAddonPrices.get(legacyId);
  if (expected == null) {
    continue;
  }
  const actual = toNum(priceText);
  if (actual !== expected) {
    errors.push(`Addon price mismatch for ${legacyId}: expected ${expected}, got ${actual}`);
  }
}

if (errors.length > 0) {
  console.error('Menu seed parity verification failed:');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log('Menu seed parity verification passed.');
console.log(`Categories: ${actualCategoryLines.length}/${expectedCategoryIds.size}`);
console.log(`Products: ${actualProductLines.length}/${expectedProductIds.size}`);
console.log(`Sizes: ${actualSizeLines.length}/${expectedSizeIds.size}`);
console.log(`Addons: ${actualAddonLines.length}/${expectedAddonIds.size}`);
