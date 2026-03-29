create extension if not exists pgcrypto;

create table if not exists public.leaderboard_scores (
  player_id uuid primary key,
  player_name text not null check (char_length(player_name) between 3 and 24),
  score integer not null check (score >= 0),
  score_version integer not null default 1,
  stage text not null default 'Cold Hands',
  stats jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists leaderboard_scores_rank_idx
  on public.leaderboard_scores (score desc, updated_at asc);

create or replace function public.set_leaderboard_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists leaderboard_scores_set_updated_at on public.leaderboard_scores;
create trigger leaderboard_scores_set_updated_at
before update on public.leaderboard_scores
for each row
execute function public.set_leaderboard_updated_at();

alter table public.leaderboard_scores enable row level security;

revoke all on public.leaderboard_scores from anon;
revoke all on public.leaderboard_scores from authenticated;
