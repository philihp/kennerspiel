create type color as enum (
  'red',
  'green',
  'blue',
  'white'
);

alter table public.entrant
add column color color not null;
