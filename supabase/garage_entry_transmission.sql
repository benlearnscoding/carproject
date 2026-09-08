alter table public.garage_entries
  add column if not exists transmission text check (transmission in ('Automatic', 'Manual'));
