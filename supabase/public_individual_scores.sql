begin;

drop function if exists public.get_recent_community_ratings(integer);
drop function if exists public.get_public_profile_cars(text);

create function public.get_recent_community_ratings(result_limit integer default 24)
returns table (
  id uuid,
  car_id text,
  overall numeric,
  scores jsonb,
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
    ratings.scores,
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

create function public.get_public_profile_cars(profile_username text)
returns table (
  car_id text,
  relationship text,
  overall numeric,
  scores jsonb,
  review text,
  rated_at timestamptz
)
language sql
stable
security definer
set search_path = ''
as $$
  with selected_profile as (
    select profiles.id
    from public.profiles as profiles
    where lower(profiles.username) = lower(profile_username)
    limit 1
  )
  select
    garage.car_id,
    garage.relationship,
    ratings.overall,
    ratings.scores,
    ratings.review,
    ratings.updated_at as rated_at
  from selected_profile
  join public.garage_entries as garage on garage.user_id = selected_profile.id
  left join public.car_ratings as ratings
    on ratings.user_id = selected_profile.id and ratings.car_id = garage.car_id
  union all
  select
    ratings.car_id,
    null::text as relationship,
    ratings.overall,
    ratings.scores,
    ratings.review,
    ratings.updated_at as rated_at
  from selected_profile
  join public.car_ratings as ratings on ratings.user_id = selected_profile.id
  where not exists (
    select 1 from public.garage_entries as garage
    where garage.user_id = selected_profile.id and garage.car_id = ratings.car_id
  );
$$;

revoke all on function public.get_public_profile_cars(text) from public;
grant execute on function public.get_public_profile_cars(text) to anon, authenticated;

commit;
