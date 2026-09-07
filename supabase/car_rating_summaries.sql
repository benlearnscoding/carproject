create or replace function public.get_car_rating_summaries()
returns table (
  car_id text,
  average_rating numeric,
  rating_count bigint
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    ratings.car_id,
    round(avg(ratings.overall), 1) as average_rating,
    count(*) as rating_count
  from public.car_ratings as ratings
  group by ratings.car_id;
$$;

revoke all on function public.get_car_rating_summaries() from public;
grant execute on function public.get_car_rating_summaries() to anon, authenticated;
