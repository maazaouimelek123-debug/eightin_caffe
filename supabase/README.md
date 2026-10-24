# Base du menu — notice de mise en place (Supabase)

Le site vitrine et la page admin sont prêts : ils n’attendent que l’**URL du projet Supabase** et sa **clé publique**.
Ce dossier contient tout ce qu’il faut pour créer la base dont ils ont besoin.

| Fichier | Rôle |
|---|---|
| `schema.sql` | Tables, contraintes et règles d’accès (Row Level Security). Peut être relancé sans risque. |
| `seed.sql` | La carte actuelle : 15 catégories, 71 articles, 6 mises en avant. Sans effet si des articles existent déjà. |
| `generate-seed.js` | Régénère `seed.sql` à partir de `assets/js/menu-data.js` : `node supabase/generate-seed.js > supabase/seed.sql` |

## Mise en place (environ 10 minutes)

1. Créer un projet Supabase (région conseillée : **Central EU – Frankfurt**, la plus proche de la Tunisie).
2. **SQL Editor** → New query → coller `schema.sql` → Run. Puis la même chose avec `seed.sql`.
3. **Authentication** → réglages des inscriptions : désactiver « **Allow new users to sign up** » (seuls les comptes créés à la main pourront se connecter).
4. **Authentication → Users → Add user → Create new user** : e-mail + mot de passe solide, cocher « Auto Confirm User ». Un compte par personne qui doit modifier le menu.
5. Déclarer chaque compte comme admin (SQL Editor) :
   ```sql
   insert into public.admin_users (user_id)
   select id from auth.users where email = 'gerant@exemple.com';
   ```
   Retirer un admin : `delete from public.admin_users where user_id = (select id from auth.users where email = '…');`
6. **Project Settings → API / API Keys** : copier l’**URL du projet** et la **clé publique** (`sb_publishable_…` ou `anon`).
   ⚠️ Ne jamais transmettre ni mettre dans le site la clé **`service_role` / `secret`**.
7. Envoyer l’URL et la clé publique à l’équipe site (elles vont dans `assets/js/config.js`).

## Contrat avec le site

Le site n’utilise que l’API REST et Supabase Auth, uniquement depuis `assets/js/api.js`.
**Si une table ou une colonne change de nom, c’est le seul fichier à adapter.**

| Appel | Utilisé par | Accès attendu |
|---|---|---|
| `GET /rest/v1/categories?select=*&order=sort.asc` | site, admin | lecture publique |
| `GET /rest/v1/items?select=*&visible=eq.true&order=sort.asc` | site | lecture publique |
| `GET /rest/v1/items?select=*&order=sort.asc` | admin | lecture publique |
| `GET /rest/v1/admin_users?select=user_id&user_id=eq.<id>` | admin (contrôle des droits à la connexion) | un utilisateur connecté voit sa propre ligne |
| `PATCH`, `POST`, `DELETE /rest/v1/items` | admin | comptes de `admin_users` uniquement |
| `POST /auth/v1/token` (password, refresh_token), `GET /auth/v1/user`, `POST /auth/v1/logout` | admin | Supabase Auth |

**Colonnes lues** — `categories` : `id`, `section` (`drinks` / `sweet` / `savory`), `sort`, `name_fr/en`, `subtitle_fr/en`, `label_fr/en`, `unit_fr/en`, `note_fr/en`, `info_fr/en`, `theme` (`navy` / `sky` / `mint`), `icon` (`iced`, `frappe`, `shake`, `smoothie`, `mojito`, `cocktail`, `classic`, `croissant`, `crepe`, `waffle`, `egg`, `burger`, `cookie`).
`items` : `id` (uuid), `category_id`, `group_title`, `sort`, `name_fr/en`, `desc_fr/en`, `tag`, `price`, `visible`, `featured`.

**Colonnes écrites par l’admin** : `name_fr`, `name_en`, `price`, `visible`, `featured` (et `category_id`, `group_title`, `sort` à la création d’un article).

## Sécurité

- Row Level Security activée sur les 3 tables.
- Tout le monde peut **lire** le menu ; seuls les comptes listés dans `admin_users` peuvent **ajouter, modifier ou supprimer** des articles.
- `categories` et `admin_users` ne sont **pas modifiables** via l’API (uniquement en SQL).
- Les droits accordés par défaut aux rôles `anon` / `authenticated` sont retirés puis réaccordés au strict nécessaire.
- La base refuse les prix hors de [0 ; 1000[ et les noms vides ou de plus de 80 caractères.
- Testé sur PostgreSQL 16 avec une simulation de l’authentification Supabase : un visiteur lit sans pouvoir écrire, un compte connecté non admin ne peut rien modifier (l’ajout est rejeté par la RLS), un admin peut tout faire sur les articles, et le script se relance sans doublon.

## Vérification après installation (5 minutes)

1. SQL Editor : `select tablename, rowsecurity from pg_tables where schemaname = 'public';` → `rowsecurity = true` pour `categories`, `items` et `admin_users`.
2. Une fois `config.js` rempli et le site redéployé : ouvrir le site, le menu s’affiche ; dans la console du navigateur, aucun message « carte de secours ».
3. Ouvrir `/admin.html`, se connecter avec le compte créé à l’étape 4.
4. Changer un prix → Enregistrer → recharger le site : le nouveau prix s’affiche. Remettre l’ancien.
5. Masquer un article → il disparaît du site ; le réafficher.
6. (Optionnel) Se connecter avec un compte absent de `admin_users` → message « Ce compte n’a pas les droits d’administration ».

## Bon à savoir

- **Offre gratuite** : Supabase peut mettre en pause un projet inactif. Le site affiche alors automatiquement la carte de secours (`assets/js/menu-data.js`), qui ne contient pas les modifications faites dans l’admin.
- **Nouvelle catégorie** (nouvelle carte du menu) : l’ajouter en SQL dans `categories` avec une des icônes listées ci-dessus ; ses articles se gèrent ensuite depuis l’admin.
