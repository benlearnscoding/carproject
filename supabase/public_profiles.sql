create or replace function public.get_public_profile(profile_username text)
returns table (
  first_name text,
  last_name text,
  username text,
  bio text,
  joined_at timestamptz
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    profiles.first_name,
    profiles.last_name,
    profiles.username,
    profiles.bio,
    profiles.created_at as joined_at
  from public.profiles as profiles
  where lower(profiles.username) = lower(profile_username)
  limit 1;
$$;

revoke all on function public.get_public_profile(text) from public;
grant execute on function public.get_public_profile(text) to anon, authenticated;

create or replace function public.get_public_profile_cars(profile_username text)
returns table (
  car_id text,
  relationship text,
  overall numeric,
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
