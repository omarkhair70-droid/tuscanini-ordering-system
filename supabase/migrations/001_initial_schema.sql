-- Phase 7.1: Supabase foundational schema only.
-- Scope intentionally excludes app runtime integration, auth wiring, env wiring, and RLS policies.

create extension if not exists pgcrypto;

-- =====================================================
-- ENUMS
-- =====================================================

create type role_type as enum ('owner', 'staff', 'kitchen', 'delivery');

create type order_status as enum (
  'جديد',
  'جاري التحضير',
  'جاهز للاستلام',
  'خرج للدليفري',
  'تم التسليم',
  'ملغي'
);

create type order_type as enum ('delivery', 'pickup');

create type review_status as enum ('pending', 'approved', 'rejected');

create type complaint_status as enum ('new', 'in_progress', 'resolved', 'closed');

create type confirmation_status as enum ('pending', 'confirmed', 'unreachable', 'rejected');

-- =====================================================
-- HELPERS
-- =====================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =====================================================
-- IDENTITY / ADMIN
-- =====================================================

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'App profile metadata linked to auth.users. RLS policies will be added in a later phase.';

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  role role_type not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

comment on table public.user_roles is 'Role assignments for admin operations. RLS policies will be added in a later phase.';

create index idx_user_roles_user_id on public.user_roles(user_id);
create index idx_user_roles_role on public.user_roles(role);

-- =====================================================
-- CATALOG
-- =====================================================

create table public.menu_categories (
  id uuid primary key default gen_random_uuid(),
  legacy_id text,
  name_ar text not null,
  slug text not null unique,
  description_ar text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.menu_categories is 'Menu sections imported from current static data. RLS policies will be added in a later phase.';

create index idx_menu_categories_sort_order on public.menu_categories(sort_order);
create index idx_menu_categories_is_active on public.menu_categories(is_active);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  legacy_id text,
  category_id uuid not null references public.menu_categories(id) on delete restrict,
  name_ar text not null,
  description_ar text,
  price_from numeric(10,2) not null check (price_from >= 0),
  base_price numeric(10,2) check (base_price is null or base_price >= 0),
  availability text not null default 'available' check (availability in ('available', 'limited', 'unavailable')),
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.products is 'Menu products with availability and display ordering. RLS policies will be added in a later phase.';

create index idx_products_category_id on public.products(category_id);
create index idx_products_sort_order on public.products(sort_order);
create index idx_products_is_active on public.products(is_active);
create index idx_products_availability on public.products(availability);

create table public.product_sizes (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  legacy_id text,
  label_ar text not null,
  price numeric(10,2) not null check (price >= 0),
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, legacy_id)
);

comment on table public.product_sizes is 'Per-product size options and prices. RLS policies will be added in a later phase.';

create index idx_product_sizes_product_id on public.product_sizes(product_id);
create index idx_product_sizes_sort_order on public.product_sizes(sort_order);
create index idx_product_sizes_is_active on public.product_sizes(is_active);

create table public.product_addons (
  id uuid primary key default gen_random_uuid(),
  legacy_id text,
  label_ar text not null,
  price numeric(10,2) not null check (price >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.product_addons is 'Reusable add-ons used by products. RLS policies will be added in a later phase.';

create index idx_product_addons_is_active on public.product_addons(is_active);

create table public.product_addon_links (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  addon_id uuid not null references public.product_addons(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (product_id, addon_id)
);

comment on table public.product_addon_links is 'Many-to-many mapping of products to allowed add-ons. RLS policies will be added in a later phase.';

create index idx_product_addon_links_product_id on public.product_addon_links(product_id);
create index idx_product_addon_links_addon_id on public.product_addon_links(addon_id);

-- =====================================================
-- ORDERS / OPERATIONS
-- =====================================================

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number bigint generated always as identity unique,
  customer_name text,
  customer_phone text not null,
  customer_address text,
  order_type order_type not null,
  general_notes text,
  status order_status not null default 'جديد',
  confirmation_status confirmation_status not null default 'pending',
  subtotal numeric(10,2) not null check (subtotal >= 0),
  delivery_fee numeric(10,2) not null default 0 check (delivery_fee >= 0),
  discount_amount numeric(10,2) not null default 0 check (discount_amount >= 0),
  total_estimate numeric(10,2) not null check (total_estimate >= 0),
  source text not null default 'web_whatsapp',
  placed_at timestamptz not null default now(),
  confirmed_at timestamptz,
  cancel_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.orders is 'Order header and lifecycle state. RLS policies and workflow rules will be added in later phases.';

create index idx_orders_order_number on public.orders(order_number);
create index idx_orders_customer_phone on public.orders(customer_phone);
create index idx_orders_status on public.orders(status);
create index idx_orders_confirmation_status on public.orders(confirmation_status);
create index idx_orders_order_type on public.orders(order_type);
create index idx_orders_placed_at on public.orders(placed_at desc);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name_snapshot text not null,
  selected_size_label text,
  unit_price numeric(10,2) not null check (unit_price >= 0),
  quantity integer not null check (quantity > 0),
  item_notes text,
  line_total numeric(10,2) not null check (line_total >= 0),
  created_at timestamptz not null default now()
);

comment on table public.order_items is 'Order line items with snapshot fields for historical consistency. RLS policies will be added later.';

create index idx_order_items_order_id on public.order_items(order_id);
create index idx_order_items_product_id on public.order_items(product_id);

create table public.order_item_addons (
  id uuid primary key default gen_random_uuid(),
  order_item_id uuid not null references public.order_items(id) on delete cascade,
  addon_id uuid references public.product_addons(id) on delete set null,
  addon_label_snapshot text not null,
  addon_price numeric(10,2) not null check (addon_price >= 0),
  created_at timestamptz not null default now()
);

comment on table public.order_item_addons is 'Order item addon snapshots. RLS policies will be added later.';

create index idx_order_item_addons_order_item_id on public.order_item_addons(order_item_id);
create index idx_order_item_addons_addon_id on public.order_item_addons(addon_id);

create table public.order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  from_status order_status,
  to_status order_status not null,
  changed_by uuid references public.profiles(id) on delete set null,
  change_note text,
  changed_at timestamptz not null default now()
);

comment on table public.order_status_history is 'Auditable order status timeline. RLS policies will be added later.';

create index idx_order_status_history_order_id on public.order_status_history(order_id);
create index idx_order_status_history_changed_at on public.order_status_history(changed_at desc);

create table public.kitchen_tickets (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references public.orders(id) on delete cascade,
  queue_number integer,
  prep_started_at timestamptz,
  ready_at timestamptz,
  kitchen_notes text,
  assigned_to uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.kitchen_tickets is 'Kitchen workflow tracking per order. RLS policies will be added later.';

create index idx_kitchen_tickets_queue_number on public.kitchen_tickets(queue_number);
create index idx_kitchen_tickets_assigned_to on public.kitchen_tickets(assigned_to);

create table public.delivery_handoffs (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references public.orders(id) on delete cascade,
  handoff_status text not null default 'waiting_handoff' check (handoff_status in ('waiting_handoff', 'handed_off', 'delivered')),
  assigned_delivery_user_id uuid references public.profiles(id) on delete set null,
  out_for_delivery_at timestamptz,
  delivered_at timestamptz,
  delivery_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.delivery_handoffs is 'Delivery handoff and final delivery tracking. RLS policies will be added later.';

create index idx_delivery_handoffs_status on public.delivery_handoffs(handoff_status);
create index idx_delivery_handoffs_assigned_delivery_user_id on public.delivery_handoffs(assigned_delivery_user_id);

create table public.customer_flags (
  id uuid primary key default gen_random_uuid(),
  customer_phone text not null unique,
  is_blocked boolean not null default false,
  block_reason text,
  confirmation_required boolean not null default true,
  suspicious_notes text,
  risk_level integer not null default 0,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.customer_flags is 'Controls for suspected fake orders and customer handling notes. RLS policies will be added later.';

create index idx_customer_flags_is_blocked on public.customer_flags(is_blocked);
create index idx_customer_flags_risk_level on public.customer_flags(risk_level);

-- =====================================================
-- OFFERS / FEEDBACK / SETTINGS / REPORTING
-- =====================================================

create table public.offers (
  id uuid primary key default gen_random_uuid(),
  title_ar text not null,
  description_ar text,
  offer_price numeric(10,2) check (offer_price is null or offer_price >= 0),
  starts_at timestamptz,
  ends_at timestamptz,
  is_active boolean not null default true,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.offers is 'Offer definitions for marketing and promotions. RLS policies will be added later.';

create index idx_offers_is_active on public.offers(is_active);
create index idx_offers_starts_at on public.offers(starts_at);
create index idx_offers_ends_at on public.offers(ends_at);

create table public.offer_products (
  id uuid primary key default gen_random_uuid(),
  offer_id uuid not null references public.offers(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (offer_id, product_id)
);

comment on table public.offer_products is 'Many-to-many linking of offers to products. RLS policies will be added later.';

create index idx_offer_products_offer_id on public.offer_products(offer_id);
create index idx_offer_products_product_id on public.offer_products(product_id);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  customer_name text,
  customer_phone text,
  rating integer check (rating is null or (rating between 1 and 5)),
  review_text text not null,
  source text not null default 'whatsapp',
  status review_status not null default 'pending',
  moderation_note text,
  created_at timestamptz not null default now(),
  approved_by uuid references public.profiles(id) on delete set null,
  approved_at timestamptz
);

comment on table public.reviews is 'Customer feedback requiring moderation approval before publish. RLS policies will be added later.';

create index idx_reviews_status on public.reviews(status);
create index idx_reviews_created_at on public.reviews(created_at desc);
create index idx_reviews_customer_phone on public.reviews(customer_phone);

create table public.complaints (
  id uuid primary key default gen_random_uuid(),
  customer_name text,
  customer_phone text,
  complaint_type text not null,
  message text not null,
  status complaint_status not null default 'new',
  priority text not null default 'normal' check (priority in ('low', 'normal', 'high', 'urgent')),
  assigned_to uuid references public.profiles(id) on delete set null,
  resolution_note text,
  created_at timestamptz not null default now(),
  resolved_at timestamptz,
  updated_at timestamptz not null default now()
);

comment on table public.complaints is 'Customer complaints triage and resolution tracking. RLS policies will be added later.';

create index idx_complaints_status on public.complaints(status);
create index idx_complaints_priority on public.complaints(priority);
create index idx_complaints_created_at on public.complaints(created_at desc);

create table public.site_settings (
  id integer primary key default 1,
  is_ordering_open boolean not null default true,
  whatsapp_order_number text,
  delivery_notes text,
  working_hours_json jsonb,
  announcement_banner_text text,
  announcement_banner_enabled boolean not null default false,
  phone_primary text,
  phone_secondary text,
  address_ar text,
  facebook_url text,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint site_settings_singleton check (id = 1)
);

comment on table public.site_settings is 'Singleton settings row used by admin dashboard later. RLS policies will be added later.';

create table public.daily_metrics (
  metric_date date primary key,
  total_orders integer not null default 0,
  total_sales_estimate numeric(12,2) not null default 0,
  cancelled_orders integer not null default 0,
  top_products_json jsonb,
  generated_at timestamptz not null default now()
);

comment on table public.daily_metrics is 'Optional reporting aggregate table. RLS policies will be added later.';

-- =====================================================
-- updated_at TRIGGERS
-- =====================================================

create trigger trg_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

create trigger trg_menu_categories_updated_at
before update on public.menu_categories
for each row
execute function public.set_updated_at();

create trigger trg_products_updated_at
before update on public.products
for each row
execute function public.set_updated_at();

create trigger trg_product_sizes_updated_at
before update on public.product_sizes
for each row
execute function public.set_updated_at();

create trigger trg_product_addons_updated_at
before update on public.product_addons
for each row
execute function public.set_updated_at();

create trigger trg_orders_updated_at
before update on public.orders
for each row
execute function public.set_updated_at();

create trigger trg_kitchen_tickets_updated_at
before update on public.kitchen_tickets
for each row
execute function public.set_updated_at();

create trigger trg_delivery_handoffs_updated_at
before update on public.delivery_handoffs
for each row
execute function public.set_updated_at();

create trigger trg_customer_flags_updated_at
before update on public.customer_flags
for each row
execute function public.set_updated_at();

create trigger trg_offers_updated_at
before update on public.offers
for each row
execute function public.set_updated_at();

create trigger trg_complaints_updated_at
before update on public.complaints
for each row
execute function public.set_updated_at();

create trigger trg_site_settings_updated_at
before update on public.site_settings
for each row
execute function public.set_updated_at();

-- =====================================================
-- SEED PLACEHOLDER (singleton settings)
-- =====================================================

insert into public.site_settings (id)
values (1)
on conflict (id) do nothing;

-- End of Phase 7.1 foundational migration.
