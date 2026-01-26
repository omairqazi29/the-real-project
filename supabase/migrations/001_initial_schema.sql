-- ============================================================================
-- THE REAL PROJECT - Database Schema
-- ============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================================
-- PROFILES (extends Supabase auth.users)
-- ============================================================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,

  -- User's default assumptions (override app defaults)
  default_assumptions jsonb default '{}',

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- ============================================================================
-- PROPERTIES
-- ============================================================================
create table public.properties (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,

  -- Basic Info
  name text not null,
  address text,
  city text,
  state text,
  zip text,
  county text,
  property_type text default 'SFH', -- SFH, duplex, triplex, quad, multi
  beds integer,
  baths numeric,
  sqft integer,
  lot_sqft integer,
  year_built integer,
  photo_urls text[] default '{}',
  notes text,

  -- Pipeline Status
  status text default 'analyzing',
  -- analyzing, researching, offer_made, under_contract, due_diligence,
  -- rehabbing, listed_for_rent, rented, stabilized, refinanced, sold

  -- ========== BUY PHASE ==========
  purchase_price numeric not null,
  closing_cost_percent numeric default 3,
  closing_cost_fixed numeric default 0,
  earnest_money numeric default 0,

  -- Financing
  financing_type text default 'conventional',
  -- conventional, fha, va, hard_money, dscr, private, seller_finance, cash
  down_payment_percent numeric default 25,
  down_payment_amount numeric, -- if fixed amount instead of percent
  interest_rate numeric default 7,
  loan_term_years integer default 30,
  points numeric default 0,
  pmi_monthly numeric default 0,

  -- ========== REHAB PHASE ==========
  rehab_budget_total numeric default 0,
  rehab_budget_itemized jsonb default '{
    "kitchen": 0,
    "bathrooms": 0,
    "flooring": 0,
    "paint_interior": 0,
    "paint_exterior": 0,
    "roof": 0,
    "hvac": 0,
    "electrical": 0,
    "plumbing": 0,
    "windows": 0,
    "doors": 0,
    "landscaping": 0,
    "foundation": 0,
    "permits": 0,
    "contingency": 0,
    "other": 0
  }',
  rehab_timeline_months integer default 3,
  holding_costs_monthly numeric default 0, -- during rehab

  -- ========== RENT PHASE ==========
  monthly_rent numeric,
  rent_comps jsonb default '[]',
  /* rent_comps format:
  [
    {
      "address": "123 Main St",
      "rent": 1800,
      "beds": 3,
      "baths": 2,
      "sqft": 1500,
      "distance_miles": 0.5,
      "source": "Zillow",
      "date": "2024-01-15"
    }
  ]
  */

  -- Operating Expenses
  vacancy_percent numeric default 5,
  maintenance_percent numeric default 5,
  capex_percent numeric default 8,
  management_percent numeric default 0,
  insurance_monthly numeric default 100,
  property_tax_annual numeric,
  property_tax_rate numeric, -- if calculating from value
  hoa_monthly numeric default 0,
  utilities_monthly numeric default 0,
  other_expenses_monthly numeric default 0,

  -- ========== REFINANCE PHASE ==========
  arv numeric, -- After Repair Value
  arv_comps jsonb default '[]',
  /* arv_comps format:
  [
    {
      "address": "456 Oak Ave",
      "sold_price": 280000,
      "beds": 3,
      "baths": 2,
      "sqft": 1600,
      "price_per_sqft": 175,
      "sold_date": "2024-01-10",
      "distance_miles": 0.3,
      "source": "MLS",
      "adjustments": {
        "sqft": -5000,
        "condition": 10000,
        "garage": 0
      },
      "adjusted_price": 285000
    }
  ]
  */

  refi_ltv_percent numeric default 75,
  refi_interest_rate numeric default 7,
  refi_loan_term_years integer default 30,
  refi_closing_cost_percent numeric default 2,
  refi_closing_cost_fixed numeric default 0,

  -- ========== APPRECIATION & GROWTH ==========
  appreciation_rate numeric default 3,
  appreciation_low numeric default 1,
  appreciation_high numeric default 5,
  rent_growth_rate numeric default 2,
  expense_growth_rate numeric default 2,

  -- ========== DATA SOURCES (for transparency) ==========
  data_sources jsonb default '{}',
  /* data_sources format:
  {
    "purchase_price": {"source": "user", "confidence": "high", "note": "Asking price"},
    "monthly_rent": {"source": "estimated", "confidence": "medium", "note": "Zillow Rent Zestimate", "url": "..."},
    "arv": {"source": "calculated", "confidence": "medium", "note": "Average of 3 comps"},
    "property_tax_annual": {"source": "user", "confidence": "high", "note": "County assessor website"}
  }
  */

  -- ========== CALCULATED FIELDS (cached) ==========
  -- These are recalculated on save but stored for quick queries
  calculated_monthly_cashflow numeric,
  calculated_cap_rate numeric,
  calculated_coc_return numeric,
  calculated_total_investment numeric,
  calculated_cash_left_in_deal numeric,

  -- Timestamps
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  analyzed_at timestamptz,

  -- Constraints
  constraint valid_status check (status in (
    'analyzing', 'researching', 'offer_made', 'under_contract', 'due_diligence',
    'rehabbing', 'listed_for_rent', 'rented', 'stabilized', 'refinanced', 'sold'
  )),
  constraint valid_property_type check (property_type in (
    'SFH', 'duplex', 'triplex', 'quad', 'multi', 'condo', 'townhouse'
  )),
  constraint valid_financing_type check (financing_type in (
    'conventional', 'fha', 'va', 'hard_money', 'dscr', 'private', 'seller_finance', 'cash'
  ))
);

alter table public.properties enable row level security;

create policy "Users can CRUD own properties" on public.properties
  for all using (auth.uid() = user_id);

-- Index for common queries
create index idx_properties_user_id on public.properties(user_id);
create index idx_properties_status on public.properties(status);
create index idx_properties_created_at on public.properties(created_at desc);

-- ============================================================================
-- SCENARIOS (snapshots of different assumptions)
-- ============================================================================
create table public.scenarios (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  property_id uuid references public.properties(id) on delete cascade not null,

  name text not null,
  description text,

  -- Override assumptions for this scenario
  assumptions_override jsonb default '{}',

  -- Cached projections
  projections_10yr jsonb default '[]',
  /* projections format:
  [
    {
      "year": 1,
      "equity_forced": 30000,
      "equity_appreciation": 9000,
      "equity_principal": 3200,
      "equity_total": 42200,
      "cashflow_annual": 3744,
      "cashflow_cumulative": 3744,
      "coc_return": 15.2,
      "total_roi": 28.5,
      "property_value": 309000,
      "loan_balance": 218500
    },
    ...
  ]
  */

  -- Summary metrics
  summary_metrics jsonb default '{}',

  is_default boolean default false,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.scenarios enable row level security;

create policy "Users can CRUD own scenarios" on public.scenarios
  for all using (auth.uid() = user_id);

-- ============================================================================
-- MARKETS (market-level data for scorecard)
-- ============================================================================
create table public.markets (
  id uuid default uuid_generate_v4() primary key,

  -- Location
  zip text,
  city text,
  county text,
  state text,
  metro_area text,

  -- Unique constraint on location
  unique(zip),

  -- Market Metrics
  median_home_price numeric,
  median_rent numeric,
  rent_price_ratio numeric, -- (annual rent / price) * 100
  price_per_sqft numeric,
  rent_per_sqft numeric,

  -- Historical Performance
  appreciation_1yr numeric,
  appreciation_3yr_cagr numeric,
  appreciation_5yr_cagr numeric,
  appreciation_10yr_cagr numeric,

  -- Economic Indicators
  population numeric,
  population_growth_1yr numeric,
  population_growth_5yr numeric,
  median_household_income numeric,
  income_growth_1yr numeric,
  unemployment_rate numeric,
  job_growth_1yr numeric,

  -- Supply Metrics
  months_of_inventory numeric,
  days_on_market_avg integer,
  new_listings_yoy_change numeric,
  building_permits_yoy_change numeric,

  -- Scores (calculated)
  overall_grade text, -- A, B, C, D, F
  cashflow_score integer, -- 1-100
  appreciation_score integer, -- 1-100
  stability_score integer, -- 1-100

  -- Data freshness
  data_date date,
  sources jsonb default '{}',

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.markets enable row level security;

-- Markets are public read
create policy "Anyone can read markets" on public.markets
  for select using (true);

-- Index for lookups
create index idx_markets_zip on public.markets(zip);
create index idx_markets_state on public.markets(state);
create index idx_markets_grade on public.markets(overall_grade);

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Auto-update updated_at timestamp
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function update_updated_at();

create trigger properties_updated_at
  before update on public.properties
  for each row execute function update_updated_at();

create trigger scenarios_updated_at
  before update on public.scenarios
  for each row execute function update_updated_at();

create trigger markets_updated_at
  before update on public.markets
  for each row execute function update_updated_at();

-- Create profile on user signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
