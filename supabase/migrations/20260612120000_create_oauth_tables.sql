-- OAuth 2.1 authorization server tables. Used to authorize external MCP
-- clients (e.g. Claude.ai connectors) to act on behalf of a Supabase user.
-- We never store the raw code or token, only the sha-256 hash, hex-encoded.

create table public.oauth_authorization_code (
  code_hash text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  client_id text not null,
  redirect_uri text not null,
  scope text not null default 'play',
  code_challenge text not null,
  code_challenge_method text not null default 'S256',
  resource text,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);
create index oauth_authorization_code_expires_at_idx
  on public.oauth_authorization_code (expires_at);

create table public.oauth_access_token (
  token_hash text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  client_id text not null,
  scope text not null default 'play',
  resource text,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  last_used_at timestamptz
);
create index oauth_access_token_user_id_idx
  on public.oauth_access_token (user_id);
create index oauth_access_token_expires_at_idx
  on public.oauth_access_token (expires_at);

-- RLS denies all by default; only the service-role client (used by the OAuth
-- routes and the MCP handler) is allowed to read or write these tables.
alter table public.oauth_authorization_code enable row level security;
alter table public.oauth_access_token enable row level security;
