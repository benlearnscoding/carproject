create table if not exists public.garage_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  car_id text not null,
  relationship text not null check (relationship in ('owned', 'driven', 'want')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, car_id)
);

alter table public.garage_entries enable row level security;
revoke all on table public.garage_entries from anon;
grant select, insert, update, delete on table public.garage_entries to authenticated;

drop policy if exists "Users can read their garage" on public.garage_entries;
create policy "Users can read their garage"
on public.garage_entries for select to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can add to their garage" on public.garage_entries;
create policy "Users can add to their garage"
on public.garage_entries for insert to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their garage" on public.garage_entries;
create policy "Users can update their garage"
on public.garage_entries for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can remove from their garage" on public.garage_entries;
create policy "Users can remove from their garage"
on public.garage_entries for delete to authenticated
using ((select auth.uid()) = user_id);
