-- Dynamic Client Registration (RFC 7591). Each row is one OAuth client that
-- has registered itself against this authorization server. The MCP connector
-- in Claude.ai will hit /register on first connect and never prompt the user
-- for a client_id / client_secret again.

create table public.oauth_client (
  client_id text primary key,
  client_secret_hash text,
  client_name text,
  redirect_uris text[] not null,
  token_endpoint_auth_method text not null default 'client_secret_post',
  scope text not null default 'play',
  created_at timestamptz not null default now()
);
create index oauth_client_created_at_idx on public.oauth_client (created_at);

-- RLS denies all by default; only the service-role client (used by the OAuth
-- routes) is allowed to read or write these rows.
alter table public.oauth_client enable row level security;
