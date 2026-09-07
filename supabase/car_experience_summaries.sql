create or replace function public.get_car_experience_summaries()
returns table (
  car_id text,
  driven_count bigint,
  owner_count bigint
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    garage.car_id,
    count(*) filter (where garage.relationship in ('owned', 'driven')) as driven_count,
    count(*) filter (where garage.relationship = 'owned') as owner_count
  from public.garage_entries as garage
  where garage.relationship in ('owned', 'driven')
  group by garage.car_id;
$$;

revoke all on function public.get_car_experience_summaries() from public;
grant execute on function public.get_car_experience_summaries() to anon, authenticated;
