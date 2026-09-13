-- Public leaderboard data. Apply this in the Supabase SQL editor.
create or replace function public.get_leaderboards()
returns table (
  category text,
  rank integer,
  username text,
  car_id text,
  review_count bigint,
  owned_count bigint,
  driven_count bigint,
  owner_count bigint
)
language sql
stable
security definer
set search_path = ''
as $$
  with reviewer_counts as (
    select
      profile.username,
      count(*)::bigint as review_count
    from public.car_ratings as rating
    join public.profiles as profile on profile.id = rating.user_id
    group by profile.id, profile.username
  ),
  ranked_reviewers as (
    select
      username,
      review_count,
      row_number() over (order by review_count desc, username asc)::integer as rank
    from reviewer_counts
  ),
  garage_counts as (
    select
      profile.username,
      count(*)::bigint as owned_count
    from public.garage_entries as garage
    join public.profiles as profile on profile.id = garage.user_id
    where garage.relationship = 'owned'
    group by profile.id, profile.username
  ),
  ranked_garages as (
    select
      username,
      owned_count,
      row_number() over (order by owned_count desc, username asc)::integer as rank
    from garage_counts
  ),
  drive_counts as (
    select
      garage.car_id,
      count(*) filter (where garage.relationship = 'driven')::bigint as driven_count,
      count(*) filter (where garage.relationship = 'owned')::bigint as owner_count
    from public.garage_entries as garage
    where garage.relationship in ('owned', 'driven')
    group by garage.car_id
  ),
  ranked_drives as (
    select
      car_id,
      driven_count,
      owner_count,
      row_number() over (order by driven_count + owner_count desc, car_id asc)::integer as rank
    from drive_counts
  )
  select 'reviewers'::text, rank, username, null::text, review_count, null::bigint, null::bigint, null::bigint
  from ranked_reviewers
  where rank <= 3

  union all

  select 'garage'::text, rank, username, null::text, null::bigint, owned_count, null::bigint, null::bigint
  from ranked_garages
  where rank <= 3

  union all

  select 'driven'::text, rank, null::text, car_id, null::bigint, null::bigint, driven_count, owner_count
  from ranked_drives
  where rank <= 50

  order by 1, 2;
$$;

revoke all on function public.get_leaderboards() from public;
grant execute on function public.get_leaderboards() to anon, authenticated;
