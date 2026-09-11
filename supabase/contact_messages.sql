-- Run this once in the Supabase SQL Editor to enable the Driven contact form.

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid references auth.users(id) on delete set null,
  name text not null check (char_length(name) between 1 and 100),
  email text not null check (char_length(email) between 3 and 255),
  message text not null check (char_length(message) between 1 and 2000)
);

alter table public.contact_messages enable row level security;

drop policy if exists "Anyone can submit contact messages" on public.contact_messages;
create policy "Anyone can submit contact messages"
  on public.contact_messages
  for insert
  to anon, authenticated
  with check (user_id is null or user_id = auth.uid());

-- Messages are intentionally not readable from the public website.
-- View them securely from the Supabase Dashboard as the project owner.
