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
