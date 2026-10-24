-- ============================================================================
-- Eight'In Flour & Coffee — base du menu (Supabase)
--
-- À exécuter une seule fois dans Supabase : SQL Editor → New query → coller → Run.
-- Puis exécuter seed.sql (le menu actuel) et déclarer les admins (voir README).
--
-- Règles d'accès (Row Level Security) :
--   • tout le monde peut LIRE le menu (le site vitrine en a besoin) ;
--   • seuls les comptes listés dans admin_users peuvent modifier les articles ;
--   • les catégories ne sont modifiables qu'ici, en SQL.
-- Le script peut être relancé sans risque.
-- ============================================================================

-- ---------------------------------------------------------------- catégories
create table if not exists public.categories (
  id          text primary key,
  section     text not null check (section in ('drinks', 'sweet', 'savory')),
  sort        integer not null default 0,
  name_fr     text not null,
  name_en     text,
  subtitle_fr text,
  subtitle_en text,
  label_fr    text,
  label_en    text,
  unit_fr     text,
  unit_en     text,
  note_fr     text,
  note_en     text,
  info_fr     text,
  info_en     text,
  theme       text not null default 'navy' check (theme in ('navy', 'sky', 'mint')),
  icon        text not null
);

-- ------------------------------------------------------------------ articles
create table if not exists public.items (
  id          uuid primary key default gen_random_uuid(),
  category_id text not null references public.categories (id) on delete cascade,
  group_title text,
  sort        integer not null default 0,
  name_fr     text not null check (char_length(btrim(name_fr)) between 1 and 80),
  name_en     text check (name_en is null or char_length(name_en) <= 80),
  desc_fr     text check (desc_fr is null or char_length(desc_fr) <= 120),
  desc_en     text check (desc_en is null or char_length(desc_en) <= 120),
  tag         text check (tag is null or char_length(tag) <= 24),
  price       numeric(7, 3) not null check (price >= 0 and price < 1000),
  visible     boolean not null default true,
  featured    boolean not null default false,
  updated_at  timestamptz not null default now()
);

create index if not exists items_category_sort_idx on public.items (category_id, sort);

create or replace function public.items_touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists items_touch_updated_at on public.items;
create trigger items_touch_updated_at
  before update on public.items
  for each row execute function public.items_touch_updated_at();

-- ------------------------------------------------------------ comptes admin
-- Un compte Supabase Auth n'a le droit d'écrire que s'il figure ici.
create table if not exists public.admin_users (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------------- droits
alter table public.categories  enable row level security;
alter table public.items       enable row level security;
alter table public.admin_users enable row level security;

-- Supabase donne par défaut tous les droits aux rôles anon / authenticated :
-- on ne garde que le strict nécessaire, la RLS faisant le reste.
revoke all on public.categories, public.items, public.admin_users from anon, authenticated;
grant select on public.categories, public.items to anon, authenticated;
grant insert, update, delete on public.items to authenticated;
grant select on public.admin_users to authenticated;

drop policy if exists "Menu lisible par tous" on public.categories;
create policy "Menu lisible par tous"
  on public.categories for select
  to anon, authenticated
  using (true);

drop policy if exists "Articles lisibles par tous" on public.items;
create policy "Articles lisibles par tous"
  on public.items for select
  to anon, authenticated
  using (true);

drop policy if exists "Un admin voit son propre compte" on public.admin_users;
create policy "Un admin voit son propre compte"
  on public.admin_users for select
  to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "Les admins ajoutent des articles" on public.items;
create policy "Les admins ajoutent des articles"
  on public.items for insert
  to authenticated
  with check (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())));

drop policy if exists "Les admins modifient les articles" on public.items;
create policy "Les admins modifient les articles"
  on public.items for update
  to authenticated
  using (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())))
  with check (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())));

drop policy if exists "Les admins suppriment des articles" on public.items;
create policy "Les admins suppriment des articles"
  on public.items for delete
  to authenticated
  using (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())));
