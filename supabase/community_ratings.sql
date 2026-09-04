create or replace function public.get_recent_community_ratings(result_limit integer default 24)
returns table (
  id uuid,
  car_id text,
  overall numeric,
  review_preview text,
  username text,
  rated_at timestamptz
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    ratings.id,
    ratings.car_id,
    ratings.overall,
    ratings.review as review_preview,
    profiles.username,
    ratings.updated_at as rated_at
  from public.car_ratings as ratings
  join public.profiles as profiles on profiles.id = ratings.user_id
  order by ratings.updated_at desc
  limit least(greatest(result_limit, 1), 500);
$$;

revoke all on function public.get_recent_community_ratings(integer) from public;
grant execute on function public.get_recent_community_ratings(integer) to anon, authenticated;
