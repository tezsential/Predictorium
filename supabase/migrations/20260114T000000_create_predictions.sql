-- Predictorium core schema, lock function, and RLS

-- Ensure crypto for UUID generation
create extension if not exists "pgcrypto";

-- Lock cutoff timestamp: March 1st 00:00 Europe/Prague of given season_year
create or replace function public.lock_timestamp_for(season_year int)
returns timestamptz
language sql
stable
as $$
  select make_timestamptz(season_year, 3, 1, 0, 0, 0, 'Europe/Prague');
$$;

-- Predictions table
create table if not exists public.predictions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  season_year int not null,
  type text not null check (type in ('PRIMARY','WILD')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, season_year, type)
);

create index if not exists idx_predictions_user_season on public.predictions (user_id, season_year);

-- Prediction items table
create table if not exists public.prediction_items (
  id uuid primary key default gen_random_uuid(),
  prediction_id uuid not null references public.predictions(id) on delete cascade,
  category text not null check (category in ('DRIVER','CONSTRUCTOR')),
  name text not null,
  rank int not null,
  unique (prediction_id, category, rank),
  unique (prediction_id, category, name)
);

create index if not exists idx_prediction_items_prediction_category on public.prediction_items (prediction_id, category);

-- updated_at trigger
create or replace function public.handle_predictions_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_predictions_updated_at on public.predictions;
create trigger trg_predictions_updated_at
before update on public.predictions
for each row
execute function public.handle_predictions_updated_at();

-- Enable RLS
alter table public.predictions enable row level security;
alter table public.prediction_items enable row level security;

-- Predictions policies (drop then create to avoid IF NOT EXISTS)
drop policy if exists "Predictions select own" on public.predictions;
create policy "Predictions select own" on public.predictions
  for select using (auth.uid() = user_id);

drop policy if exists "Predictions insert own" on public.predictions;
create policy "Predictions insert own" on public.predictions
  for insert with check (auth.uid() = user_id);

drop policy if exists "Predictions update own unlocked" on public.predictions;
create policy "Predictions update own unlocked" on public.predictions
  for update using (
    auth.uid() = user_id
    and now() < lock_timestamp_for(season_year)
  ) with check (
    auth.uid() = user_id
    and now() < lock_timestamp_for(season_year)
  );

drop policy if exists "Predictions delete own unlocked" on public.predictions;
create policy "Predictions delete own unlocked" on public.predictions
  for delete using (
    auth.uid() = user_id
    and now() < lock_timestamp_for(season_year)
  );

-- Prediction items policies
drop policy if exists "Items select via owner" on public.prediction_items;
create policy "Items select via owner" on public.prediction_items
  for select using (
    exists (
      select 1 from public.predictions p
      where p.id = prediction_id
        and p.user_id = auth.uid()
    )
  );

drop policy if exists "Items insert via owner unlocked" on public.prediction_items;
create policy "Items insert via owner unlocked" on public.prediction_items
  for insert with check (
    exists (
      select 1 from public.predictions p
      where p.id = prediction_id
        and p.user_id = auth.uid()
        and now() < lock_timestamp_for(p.season_year)
    )
  );

drop policy if exists "Items update via owner unlocked" on public.prediction_items;
create policy "Items update via owner unlocked" on public.prediction_items
  for update using (
    exists (
      select 1 from public.predictions p
      where p.id = prediction_id
        and p.user_id = auth.uid()
        and now() < lock_timestamp_for(p.season_year)
    )
  ) with check (
    exists (
      select 1 from public.predictions p
      where p.id = prediction_id
        and p.user_id = auth.uid()
        and now() < lock_timestamp_for(p.season_year)
    )
  );

drop policy if exists "Items delete via owner unlocked" on public.prediction_items;
create policy "Items delete via owner unlocked" on public.prediction_items
  for delete using (
    exists (
      select 1 from public.predictions p
      where p.id = prediction_id
        and p.user_id = auth.uid()
        and now() < lock_timestamp_for(p.season_year)
    )
  );
