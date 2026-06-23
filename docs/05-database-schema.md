# 05 — Database Schema (Part 5)

> ERD-level data model across all domains: Users, Products, Orders, Payments, Inventory, Reviews, Loyalty, Memberships, Content, Marketplace, Auctions, Investment, Community, AI, and Analytics.

**Conventions**
- Primary store: **PostgreSQL** (+ `pgvector`). Analytics/event data: **ClickHouse** (§14).
- All tables have `id` (UUID v7, PK), `created_at`, `updated_at` (timestamptz). Soft-deletes via `deleted_at` where relevant.
- `→` = foreign key. `[idx]` = indexed. `JSONB` for flexible/sparse attributes. Money stored as integer minor units + currency code.
- Multi-tenancy/region: where relevant, rows carry `region`/`market` for data residency + jurisdiction.

```
                         ┌──────────┐
              ┌──────────▶│  users   │◀───────────┐
              │           └────┬─────┘            │
       ┌──────┴─────┐    ┌─────┴──────┐    ┌──────┴───────┐
       │  addresses │    │  accounts  │    │ user_roles   │
       └────────────┘    │(auth/oauth)│    └──────────────┘
                          └────────────┘
   ┌─────────────┐  ┌──────────────┐  ┌─────────────┐  ┌──────────────┐
   │  products   │──│product_variant│──│ inventory   │  │  brands      │
   │             │  └──────────────┘  └─────────────┘  │ distilleries │
   │             │──product_attribute (region, etc.)   │ regions      │
   └─────┬───────┘                                      └──────────────┘
         │                ┌──────────┐   ┌───────────┐
         ├───────────────▶│  reviews │   │ wishlists │
         │                └──────────┘   └───────────┘
   ┌─────▼──────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
   │  carts     │─▶│   orders     │─▶│ order_items  │─▶│  shipments   │
   └────────────┘  └──────┬───────┘  └──────────────┘  └──────────────┘
                          │
                   ┌──────▼───────┐   ┌──────────────┐
                   │  payments    │   │ loyalty_*    │  memberships
                   └──────────────┘   └──────────────┘
   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
   │ marketplace_ │  │   auctions   │  │ investments/ │  │ vault_items  │
   │   sellers    │  │  + bids      │  │   casks      │  │ (collection) │
   └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
```

---

## 1. Users & Identity

### `users`
| column | type | notes |
|--------|------|-------|
| id | uuid | PK |
| email | citext | unique [idx] |
| phone | text | nullable, E.164 |
| display_name | text | |
| first_name / last_name | text | |
| dob | date | for age verification |
| age_verified | bool | default false |
| age_verified_at | timestamptz | |
| age_verification_id | uuid | → `age_verifications` |
| locale | text | e.g. en-GB |
| preferred_currency | text | ISO 4217 |
| country / region | text | residency, jurisdiction [idx] |
| marketing_consent | bool | |
| status | enum | active/suspended/closed |
| palate_profile_id | uuid | → `palate_profiles` |
| referred_by | uuid | → users (nullable) |

### `accounts` (auth providers)
`id, user_id→users, provider (password|google|apple|passkey), provider_account_id, password_hash (nullable), mfa_enabled, last_login_at`. Managed by Clerk/Auth0 if external (mirror minimal data).

### `user_roles`
`id, user_id→users, role (shopper|member|seller|collector|investor|creator|staff|admin), scope JSONB`. RBAC; a user can hold several.

### `addresses`
`id, user_id→users, type (shipping|billing), name, line1, line2, city, region/state, postcode, country [idx], is_default, phone, delivery_notes`.

### `age_verifications` (compliance)
`id, user_id→users, provider (persona|veriff|yoti), status (pending|verified|failed), method (doc|db|estimation), result_ref, verified_at, expires_at, audit JSONB`. See [Doc 09](09-compliance-and-regulatory.md).

### `palate_profiles` (AI)
`id, user_id→users, flavour_vector vector(64), preferences JSONB (regions, styles, price band, dislikes), confidence float, source (quiz|behaviour|reviews|vault), updated_at`. Powers personalisation (§13).

### `consents` / `data_requests` (GDPR/CCPA)
`consents(id, user_id, purpose, granted, ts)`; `data_requests(id, user_id, type export|delete, status, requested_at, completed_at)`.

---

## 2. Catalog — Products & Taxonomy

### `products`
| column | type | notes |
|--------|------|-------|
| id | uuid | PK |
| type | enum | bottle/sample/gift_pack/bundle/accessory/cask/experience/digital |
| title | text | [idx] |
| slug | text | unique [idx] |
| brand_id | uuid | → brands |
| distillery_id | uuid | → distilleries (nullable) |
| bottler_type | enum | OB / IB / NA |
| description | text | rich |
| editorial JSONB | | story, "why we love it" |
| status | enum | draft/active/archived/out_of_stock |
| is_marketplace | bool | 1P vs 3P |
| seller_id | uuid | → marketplace_sellers (nullable; null = 1P) |
| flavour_vector | vector(64) | embedding for similarity/semantic |
| search_keywords | text[] | |
| seo JSONB | | meta, og, structured-data overrides |
| rating_avg / rating_count | numeric/int | denormalised from reviews |

### `product_variants`
`id, product_id→products, sku unique [idx], size_ml, packaging (standard|gift_box), engraving_allowed, barcode, weight_g, price_amount, price_currency, compare_at_amount, member_price_amount, status`. Prices may also live in a `prices` table for multi-currency/market (below).

### `prices` (multi-currency / market)
`id, variant_id→product_variants, currency, market/region [idx], amount, member_amount, valid_from, valid_to, price_list (retail|member|trade)`. Enables per-market pricing and member pricing.

### `product_attributes` (whisky-specific, flexible)
Either typed columns on a `whisky_details` table or EAV/JSONB. Recommended **`whisky_details`** (1:1 with product where type=bottle/sample/cask):
`product_id→products, abv numeric, age_years int (nullable=NAS), region_id→regions, cask_type text[], cask_number text, vintage_year int, bottling_year int, peat_ppm int, chill_filtered bool, natural_colour bool, outturn int, bottle_number int, limited_edition bool, awards JSONB, allergens text[]`.

### `brands`, `distilleries`, `regions`
- `brands`: `id, name, slug [idx], logo_url, story, country, website`.
- `distilleries`: `id, name, slug [idx], region_id→regions, founded_year, status (active|closed|mothballed), story, lat, lng, image_url`.
- `regions`: `id, name, slug [idx], country, parent_region_id (self), description, flavour_signature JSONB, map_geojson`.

### `categories` & `collections` (faceted + curated)
- `categories`: `id, name, slug, parent_id (self), type (whisky_type|occasion|flavour|price_band|age_band), seo JSONB`.
- `product_categories`: M:N `product_id, category_id`.
- `collections`: curated/merchandised sets `id, title, slug, type (manual|smart), rules JSONB (for smart), seo JSONB`.
- `collection_products`: M:N + `position`.

### `media`
`id, owner_type (product|brand|distillery|content|review), owner_id, kind (image|video|360|doc), url, alt_text, position, meta JSONB`.

---

## 3. Inventory & Fulfilment

### `inventory_items`
`id, variant_id→product_variants, location_id→inventory_locations, quantity_on_hand, quantity_reserved, quantity_available (generated), reorder_point, bin`. Atomic decrement guarded by row locks / Redis reservation for drops.

### `inventory_locations`
`id, name, type (warehouse|bonded|3pl|store), region [idx], address, is_bonded, capabilities JSONB`.

### `stock_reservations`
`id, variant_id, cart_id/order_id, quantity, expires_at, status` — short-lived holds during checkout/drops.

### `fulfilment_providers` / `shipments`
- `shipments`: `id, order_id→orders, provider, tracking_number, status, age_check_required bool, shipped_at, delivered_at, signed_by, label_url, region`.
- carrier rules and jurisdiction handled by the **jurisdiction engine** (§ Orders + [Doc 09]).

---

## 4. Cart, Orders & Items

### `carts`
`id, user_id→users (nullable=guest), currency, market/region, status (active|merged|converted|abandoned), items_subtotal, discount_total, gift_options JSONB, ai_session_id (nullable), expires_at`.

### `cart_items`
`id, cart_id→carts, variant_id→product_variants, seller_id (nullable), quantity, unit_price_snapshot, member_price_applied bool, gift_message text, engraving text`.

### `orders`
| column | type | notes |
|--------|------|-------|
| id | uuid | PK |
| order_number | text | human, unique [idx] |
| user_id | uuid | → users (nullable=guest) |
| status | enum | pending/paid/processing/shipped/delivered/cancelled/refunded/on_hold |
| currency | text | |
| market / ship_to_country | text | [idx] jurisdiction |
| subtotal / discount_total / tax_total / duty_total / shipping_total / grand_total | int | minor units |
| billing_address_id / shipping_address_id | uuid | → addresses (snapshotted) |
| age_check_status | enum | required/passed/at_delivery |
| jurisdiction_decision | JSONB | which rules allowed this sale |
| placed_at | timestamptz | |
| channel | enum | web/app/marketplace/auction |

### `order_items`
`id, order_id→orders, variant_id, product_title_snapshot, seller_id (nullable), is_marketplace bool, quantity, unit_price, tax_amount, duty_amount, fulfilment_status, commission_amount (3P), gift_message`.

### `order_events` (audit/state machine)
`id, order_id, type, payload JSONB, actor (system|user|staff), ts` — full lifecycle audit.

### `returns` / `rma`
`id, order_item_id→order_items, reason, status, refund_amount, restock bool, created_at` — within alcohol-return regulations.

---

## 5. Payments

### `payments`
`id, order_id→orders, provider (stripe|adyen|paypal), provider_payment_intent_id [idx], method (card|wallet|bnpl|bank), amount, currency, status (requires_action|authorized|captured|failed|refunded), captured_at, idempotency_key unique, risk_score, raw JSONB`.

### `refunds`
`id, payment_id→payments, amount, reason, status, provider_refund_id, created_at`.

### `payment_methods` (vaulted tokens)
`id, user_id→users, provider, provider_pm_id (token), brand, last4, exp, is_default`. No PAN stored (PCI SAQ-A; tokenised via Stripe).

### `payouts` (marketplace, P4)
`id, seller_id→marketplace_sellers, period, gross, commission, fees, net, provider_transfer_id, status, paid_at` — Stripe Connect.

### `ledger_entries` (double-entry, marketplace/investment)
`id, account (platform|seller|escrow|tax|duty), order_id (nullable), type (sale|commission|refund|payout|fee|escrow_hold|escrow_release), amount, currency, balance_after, ref JSONB, ts`. Source of truth for money movement + reconciliation.

---

## 6. Reviews & Ratings

### `reviews`
`id, product_id→products, user_id→users, order_item_id (verified-purchase link, nullable), rating int(1-5), title, body, verified_purchase bool, status (pending|published|rejected), helpful_count, ai_summary text, created_at`.

### `tasting_notes` (structured, 1:1 or 1:M with review)
`id, review_id→reviews (or standalone user note), nose JSONB, palate JSONB, finish JSONB, flavour_tags text[], score numeric, would_buy_again bool`.

### `review_votes`
`id, review_id, user_id, vote (helpful|not), ts` (unique per user/review).

### `qa_questions` / `qa_answers`
`questions(id, product_id, user_id, body, status)`; `answers(id, question_id, author_type user|staff|ai, user_id?, body, ai_generated bool, verified_by_staff bool, helpful_count)`.

---

## 7. Loyalty & Rewards

### `loyalty_accounts`
`id, user_id→users (unique), points_balance, lifetime_points, tier (bronze|silver|gold|platinum), tier_progress, joined_at`.

### `loyalty_transactions`
`id, loyalty_account_id→loyalty_accounts, type (earn|redeem|expire|adjust), points, reason (purchase|review|referral|profile|tasting|manual), ref_type, ref_id, created_at, expires_at`.

### `rewards` / `reward_redemptions`
`rewards(id, name, cost_points, type discount|product|experience, value JSONB, eligibility JSONB, active)`; `reward_redemptions(id, user_id, reward_id, status, code, redeemed_at)`.

### `referrals`
`id, referrer_user_id→users, referee_user_id→users (nullable until signup), code [idx], status (sent|signed_up|qualified|rewarded), reward_referrer, reward_referee, created_at`.

---

## 8. Memberships & Subscriptions

### `membership_plans`
`id, name (Free|Plus|Reserve), price_amount, currency, interval (month|year), benefits JSONB (free_delivery, member_pricing, ballot_access, sample_credit, concierge, magazine…), active`.

### `memberships`
`id, user_id→users, plan_id→membership_plans, status (active|past_due|cancelled|paused), provider_subscription_id (Stripe), current_period_end, started_at, cancel_at`.

### `subscriptions` (sample boxes / replenishment)
`id, user_id→users, type (sample_box|advent|replenish), variant_id?/box_id?, interval, status, provider_subscription_id, next_renewal_at, skip_next bool`.

### `subscription_shipments`
`id, subscription_id→subscriptions, period, order_id→orders, status`.

---

## 9. Content & CMS

> Long-form content typically lives in **Sanity** (headless CMS) and is mirrored/cached; relational links to products are stored here for cross-linking & SEO.

### `content_items`
`id, cms_id (Sanity ref), type (article|guide|review|education|video|podcast|page), title, slug [idx], status, author_id→users (or external), published_at, seo JSONB, body_ref, primary_region_id?, reading_time`.

### `content_product_links`
M:N `content_id→content_items, product_id→products, relation (mentions|featured|buy)` — powers shoppable content + internal linking.

### `content_taxonomy`
M:N to `categories`, `regions`, `brands`, `distilleries`, tags.

### `media_assets` (video/podcast)
`id, content_id, kind (video|audio), provider (mux|cloudflare|rss), external_id, duration, transcript_ref, thumbnail_url`.

### `newsletters` / `campaigns`
`campaigns(id, type, segment_query JSONB, subject, status, scheduled_at, sent_at, metrics JSONB)`.

---

## 10. Marketplace (Phase 4)

### `marketplace_sellers`
`id, user_id→users, business_name, type (independent_bottler|retailer|collector|distillery), kyc_status, tier (standard|verified|premium), commission_rate, payout_account (Stripe Connect id), rating_avg, rating_count, status (pending|active|suspended), region`.

### `seller_listings`
(uses `products` with `is_marketplace=true, seller_id`) plus `listing_meta`: `id, product_id, seller_id, condition (sealed|opened|damaged), authenticity_status, fulfilment (seller|whiskymart_fulfilled), location, lead_time`.

### `seller_orders` / settlement
`id, order_item_id→order_items, seller_id, status, commission_amount, payout_id→payouts, dispute_id?`.

### `disputes`
`id, order_item_id, opened_by (buyer|seller), reason, status, resolution, evidence JSONB, created_at`.

### `authenticity_records` (provenance/trust)
`id, product_id/variant_id or vault_item_id, method (nfc|qr|expert|coa), code [idx], issued_by, verified bool, chain JSONB (ownership/provenance), created_at`. The trust moat.

---

## 11. Auctions (Phase 4)

### `auctions`
`id, lot_product_id→products, seller_id→marketplace_sellers, type (timed|no_reserve), start_price, reserve_price, current_bid, current_bidder_id, bid_count, starts_at, ends_at [idx], anti_snipe_seconds, status (scheduled|live|ended|settled|cancelled), buyer_premium_pct, seller_commission_pct`.

### `bids`
`id, auction_id→auctions, user_id→users, amount, is_proxy bool, max_proxy_amount, placed_at [idx], status (active|outbid|winning|won|invalid)`. High-write; consider partitioning + Redis for live state.

### `auction_watchers`
`id, auction_id, user_id, notify bool`.

### `auction_settlements`
`id, auction_id, winning_bid_id→bids, hammer_price, buyer_premium, seller_commission, order_id→orders, status`.

---

## 12. Investment & Casks (Phase 4)

### `casks`
`id, distillery_id→distilleries, cask_type, fill_date, cask_number, original_litres, current_litres (estimated), abv_estimate, warehouse_location_id, bonded bool, status (available|owned|maturing|bottled|sold)`.

### `cask_ownerships`
`id, cask_id→casks, owner_user_id→users, share_pct (for fractional), purchase_price, purchase_date, status, custody_fee_plan_id`.

### `investment_listings`
`id, asset_type (cask|bottle), asset_id, seller_id, ask_price, valuation_amount, valuation_source, status`.

### `valuations` (data product)
`id, asset_ref (product/cask/distillery), value, currency, as_of_date, source (auction_index|model|expert), confidence`. Powers the **pricing/valuation API** + WhiskyVault values.

### `custody_records`
`id, cask_id, location_id, insured bool, insurance_ref, annual_fee_amount, next_fee_due, documents JSONB`.

### `portfolio_positions` (investor dashboard)
view/materialised: per user, holdings (casks + investment bottles), cost basis, current valuation, unrealised gain.

---

## 13. WhiskyVault & Community

### `vault_items` (digital collection)
`id, user_id→users, product_id→products (nullable if custom), custom_name, condition (sealed|opened|empty), fill_level, purchase_price, acquired_date, acquired_from, authenticity_record_id?, estimated_value (from valuations), for_sale bool, is_public bool, notes`.

### `user_follows`
`id, follower_id→users, following_id→users` (community graph).

### `clubs` / `club_members`
`clubs(id, name, slug, type interest|local, region?, description, visibility)`; `club_members(id, club_id, user_id, role member|moderator|owner, joined_at)`.

### `forum_threads` / `forum_posts`
`threads(id, club_id?, category, title, slug, author_id, status, last_activity_at [idx])`; `posts(id, thread_id, author_id, body, ai_drafted bool, parent_post_id?, helpful_count, status)`.

### `events` / `event_bookings`
`events(id, type tasting|festival|masterclass, title, starts_at, location|virtual_url, capacity, price_amount, host_id, club_id?, status)`; `event_bookings(id, event_id, user_id, status, order_id?, ticket_code)`.

### `creators`
`id, user_id→users, handle, bio, affiliate_code, revenue_share_pct, storefront_collection_id?, status`.

---

## 14. AI & Analytics

### AI (Postgres + vector)
- `embeddings`: `id, owner_type (product|content|review|note), owner_id, model, vector vector(1536), created_at` — for RAG/semantic search (or store on entity tables via pgvector).
- `ai_conversations`: `id, user_id?, session_id, surface (advisor|gift_finder|support|pairing), context JSONB, created_at`.
- `ai_messages`: `id, conversation_id→ai_conversations, role (user|assistant|tool|system), content, tool_calls JSONB, tokens, model, latency_ms, grounded_sources JSONB, created_at`.
- `ai_feedback`: `id, message_id, user_id?, rating, reason` — eval signal.
- `recommendation_cache`: `id, user_id, surface, items JSONB, model_version, generated_at, expires_at`.

### Analytics (ClickHouse — event/columnar store)
Not relational FKs; high-volume append-only events:
- `events`: `event_id, ts, user_id?, anon_id, session_id, type (page_view|search|view_item|add_to_cart|begin_checkout|purchase|ai_query|review|bid…), properties JSON, device, geo, referrer, market`.
- `search_queries`: `ts, user_id?, query, results_count, clicked_position?, semantic bool`.
- `experiment_exposures`: `ts, user_id/anon, experiment, variant`.
- Derived/`dbt` models: funnels, cohort retention, LTV, recommendation training features, attribution.

---

## 15. Cross-cutting tables
- `audit_logs`: `id, actor_id, actor_type, action, entity_type, entity_id, before JSONB, after JSONB, ip, ts` (security/compliance).
- `feature_flags`: managed in PostHog/LaunchDarkly (mirrored if needed).
- `notifications`: `id, user_id, channel (email|push|sms|inapp), template, payload, status, sent_at`.
- `jurisdiction_rules`: `id, ship_to_country/region [idx], product_type, allowed bool, requires_license bool, carrier_constraints JSONB, tax_rule_ref, age_min, notes` — drives the compliance engine ([Doc 09]).

---

## 16. Indexing & integrity highlights
- Heavy read paths (catalogue, PLP) served from **search index + cache**, not raw SQL.
- `unique` on: `users.email`, `product_variants.sku`, `orders.order_number`, `payments.idempotency_key`, `referrals.code`.
- Composite indexes for hot queries: `(ship_to_country, product_type)` on jurisdiction; `(auction_id, placed_at)` on bids; `(user_id, surface)` on recommendation_cache.
- `pgvector` HNSW indexes on `flavour_vector` / `embeddings.vector`.
- Money via integer minor units + currency; **double-entry ledger** for marketplace/investment correctness.
- Snapshot prices/addresses/titles onto orders (don't rely on live joins for historical orders).

---

*Continue to → [06 Development Roadmap](06-development-roadmap.md)*
