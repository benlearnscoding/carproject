create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  if nullif(trim(coalesce(new.raw_user_meta_data ->> 'username', '')), '') is null then
    raise exception 'Username is required to create a Driven account.';
  end if;

  insert into public.profiles (id, first_name, last_name, username, bio)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'first_name', ''),
    coalesce(new.raw_user_meta_data ->> 'last_name', ''),
    trim(new.raw_user_meta_data ->> 'username'),
    coalesce(new.raw_user_meta_data ->> 'bio', '')
  )
  on conflict (id) do update set
    first_name = excluded.first_name,
    last_name = excluded.last_name,
    username = excluded.username,
    bio = excluded.bio,
    updated_at = now();
  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;
