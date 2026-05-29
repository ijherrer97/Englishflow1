create table if not exists public.englishflow_data (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  payload jsonb not null,
  updated_at timestamptz not null default now(),
  unique (user_id)
);

alter table public.englishflow_data enable row level security;

drop policy if exists "Users can read their EnglishFlow data" on public.englishflow_data;
drop policy if exists "Users can insert their EnglishFlow data" on public.englishflow_data;
drop policy if exists "Users can update their EnglishFlow data" on public.englishflow_data;
drop policy if exists "Users can delete their EnglishFlow data" on public.englishflow_data;

create policy "Users can read their EnglishFlow data"
on public.englishflow_data
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert their EnglishFlow data"
on public.englishflow_data
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update their EnglishFlow data"
on public.englishflow_data
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their EnglishFlow data"
on public.englishflow_data
for delete
to authenticated
using (auth.uid() = user_id);
