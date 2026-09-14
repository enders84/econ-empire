create extension if not exists pgcrypto;

create table if not exists public.micro_empire_scores (
  id uuid primary key default gen_random_uuid(),
  player_name text not null check (char_length(trim(player_name)) between 2 and 60),
  score integer not null check (score >= 0),
  cumulative_profit numeric not null,
  cash numeric not null,
  market_share numeric not null check (market_share >= 0 and market_share <= 100),
  challenges_completed integer not null check (challenges_completed >= 0),
  created_at timestamptz not null default now()
);

alter table public.micro_empire_scores enable row level security;

drop policy if exists "Public can read Micro Empire leaderboard" on public.micro_empire_scores;
create policy "Public can read Micro Empire leaderboard"
on public.micro_empire_scores
for select
to anon
using (true);

drop policy if exists "Public can submit Micro Empire scores" on public.micro_empire_scores;
create policy "Public can submit Micro Empire scores"
on public.micro_empire_scores
for insert
to anon
with check (
  char_length(trim(player_name)) between 2 and 60
  and score >= 0
  and market_share between 0 and 100
  and challenges_completed >= 0
);

create index if not exists micro_empire_scores_score_idx
  on public.micro_empire_scores (score desc, created_at asc);
