create table if not exists public.car_ratings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  car_id text not null,
  experience text not null check (experience in ('owned', 'driven', 'passenger')),
  scores jsonb not null default '{}'::jsonb,
  overall numeric(3,1) not null check (overall >= 1 and overall <= 10),
  review text not null default '' check (char_length(review) <= 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, car_id)
);

alter table public.car_ratings enable row level security;
revoke all on table public.car_ratings from anon;
grant select, insert, update, delete on table public.car_ratings to authenticated;

create policy "Users can read their ratings"
on public.car_ratings for select to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can add their ratings"
on public.car_ratings for insert to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can update their ratings"
on public.car_ratings for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can remove their ratings"
on public.car_ratings for delete to authenticated
using ((select auth.uid()) = user_id);
