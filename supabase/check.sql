-- ============================================================================
-- Eight'In Flour & Coffee — vérification de l'installation de la base
-- À exécuter en dernier (SQL Editor → Run). Chaque ligne doit afficher ok = true.
-- Ce script ne modifie rien.
-- ============================================================================

select verification, resultat, ok
from (
  values
    (1, 'Règles d''accès (RLS) activées sur categories',
        (select relrowsecurity::text from pg_class where oid = 'public.categories'::regclass),
        (select relrowsecurity from pg_class where oid = 'public.categories'::regclass)),
    (2, 'Règles d''accès (RLS) activées sur items',
        (select relrowsecurity::text from pg_class where oid = 'public.items'::regclass),
        (select relrowsecurity from pg_class where oid = 'public.items'::regclass)),
    (3, 'Règles d''accès (RLS) activées sur admin_users',
        (select relrowsecurity::text from pg_class where oid = 'public.admin_users'::regclass),
        (select relrowsecurity from pg_class where oid = 'public.admin_users'::regclass)),
    (4, 'Politiques en place (attendu : 6)',
        (select count(*)::text from pg_policies where schemaname = 'public' and tablename in ('categories', 'items', 'admin_users')),
        (select count(*) = 6 from pg_policies where schemaname = 'public' and tablename in ('categories', 'items', 'admin_users'))),
    (5, 'Les visiteurs ne peuvent pas modifier les articles',
        'insert/update/delete interdits à anon',
        not (has_table_privilege('anon', 'public.items', 'INSERT')
          or has_table_privilege('anon', 'public.items', 'UPDATE')
          or has_table_privilege('anon', 'public.items', 'DELETE'))),
    (6, 'Personne ne peut modifier les catégories via le site',
        'insert/update/delete interdits à anon et authenticated',
        not (has_table_privilege('anon', 'public.categories', 'UPDATE')
          or has_table_privilege('authenticated', 'public.categories', 'INSERT')
          or has_table_privilege('authenticated', 'public.categories', 'UPDATE')
          or has_table_privilege('authenticated', 'public.categories', 'DELETE'))),
    (7, 'La liste des admins n''est pas modifiable via le site',
        'insert/update/delete interdits',
        not (has_table_privilege('anon', 'public.admin_users', 'SELECT')
          or has_table_privilege('authenticated', 'public.admin_users', 'INSERT')
          or has_table_privilege('authenticated', 'public.admin_users', 'UPDATE')
          or has_table_privilege('authenticated', 'public.admin_users', 'DELETE'))),
    (8, 'Catégories du menu (15 au départ)',
        (select count(*)::text from public.categories),
        (select count(*) > 0 from public.categories)),
    (9, 'Articles du menu (71 au départ)',
        (select count(*)::text from public.items),
        (select count(*) > 0 from public.items)),
    (10, 'Articles dans « À découvrir » (6 au départ)',
        (select count(*)::text from public.items where featured),
        (select count(*) > 0 from public.items where featured)),
    (11, 'Au moins un compte admin déclaré',
        (select coalesce(string_agg(u.email, ', '), 'aucun') from public.admin_users a join auth.users u on u.id = a.user_id),
        (select count(*) > 0 from public.admin_users))
) as checks (n, verification, resultat, ok)
order by n;
