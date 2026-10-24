# Squelette du site — {{NOM_DU_CAFE}}

Ce document décrit **toute la structure du site** (page menu, page admin, données, base, styles) avec des
**placeholders `{{…}}`** à la place des contenus propres au café.
Il sert de plan pour comprendre le site, le faire évoluer, ou en créer un nouveau pour un autre établissement
à partir de ce dépôt (voir la [checklist](#11-checklist--créer-un-nouveau-site-à-partir-du-squelette)).

Les fichiers réels du dépôt contiennent les valeurs d'Eight'In : le tableau ci-dessous indique, pour chaque
placeholder, la valeur actuelle à rechercher et remplacer.

---

## 1. Placeholders

| Placeholder | Rôle | Valeur actuelle (Eight'In) | Où |
|---|---|---|---|
| `{{NOM_DU_CAFE}}` | Nom complet | `Eight’In Flour & Coffee` | `index.html` (`<title>`, `og:*`, footer ©), `admin.html` (`<title>`) |
| `{{NOM_COURT}}` | Nom court (titre accessible du logo) | `Eight’In` | `index.html` (`<h1>` caché, liens « accueil ») |
| `{{BASELINE_LOGO}}` | Mention à côté du logo | `Flour` / `& Coffee` | `index.html` (`.nav-logo-tag`, `.lockup-tag`, `.footer-logo-tag`) |
| `{{SLOGAN}}` | Phrase sous le logo | `But first… coffee. Then croissants.` | `index.html` (`.hero-tagline`) |
| `{{DESCRIPTION_SEO}}` | Description Google / partage | `Eight’In Flour & Coffee à Boumhal…` | `index.html` (`meta description`, `og:description`) |
| `{{SLOGAN_1}}` … `{{SLOGAN_3}}` | Phrases du bandeau défilant | `But first, coffee`, `Then croissants`, `Meet. Eat. Repeat.`… | `index.html` (`.marquee-track`, écrites 2 fois) |
| `{{PHRASE_BANDEAU}}` | Grand titre du bandeau | `But first, coffee.` | `index.html` (`.statement-big`) |
| `{{PARTENAIRES}}` | Marques partenaires | `illy & Alta Caffè` | `index.html` (`.statement-hand`, footer) |
| `{{QUARTIER}}` · `{{PAYS}}` | Adresse | `Boumhal — Banlieue Sud` · `Tunisie` | `index.html` (footer) |
| `{{JOURS}}` · `{{HEURES}}` | Horaires | `Tous les jours` · `7h00 – 00h00` | `index.html` (footer) + traduction dans `STATIC_EN` |
| `{{INSTAGRAM}}` | Compte Instagram (sans @) | `eightincoffee` | `index.html` (footer), `menu-data.js` (`SITE.instagram`) |
| `{{MAPS_URL}}` | Lien Google Maps | `https://maps.app.goo.gl/udovAyAhgXNVn44n8` | `menu-data.js` (`SITE.mapsUrl`), `index.html` (footer) |
| `{{SITE_URL}}` | Adresse du site en ligne | `https://eightincaffe.vercel.app/` | `index.html` (`canonical`, `og:url`, `og:image`) |
| `{{DEVISE}}` | Devise affichée après les prix | `DT` | `assets/js/main.js` (`fmt`), `admin.js` (libellés « Prix (DT) ») |
| `{{LOGO_VIEWBOX}}` · `{{LOGO_SVG_PATH}}` | Logo vectoriel | `71 132 2311.3 1047.3` · tracé de `assets/img/logo-eightin.svg` | `index.html` (symbole `#eightin-logo`) |
| `{{COULEUR_FONCEE}}` · `{{COULEUR_FONCEE_PLUS}}` · `{{COULEUR_CLAIRE}}` · `{{COULEUR_FOND}}` | Palette | `#1B3A57` · `#12293F` · `#C9E9F5` · `#EAFBF4` | `assets/css/style.css` (`:root`) |
| `{{POLICE_SCRIPT}}` · `{{POLICE_SLOGAN}}` · `{{POLICE_MAIN}}` · `{{POLICE_TEXTE}}` | Typographies | Yellowtail · Bebas Neue · Patrick Hand · Josefin Sans | `assets/css/style.css`, `assets/fonts/` |
| `{{SUPABASE_URL}}` | URL du projet Supabase | `https://jxkqyypwfzgjdoopwyew.supabase.co` | `assets/js/config.js` |
| `{{SUPABASE_PUBLISHABLE_KEY}}` | Clé **publique** Supabase | `sb_publishable_…` | `assets/js/config.js` |
| `{{EMAIL_ADMIN}}` | Compte autorisé dans l'admin | — (jamais dans le code) | Supabase (`admin_users`) |
| `{{TEXTE_AIDE}}` | Aide affichée en haut de l'admin | « Modifiez un nom ou un prix… » | `admin.html` (`.adm-help`) |

Les autres placeholders des blocs « généré par » (`{{ID_CATEGORIE}}`, `{{NOM_ARTICLE}}`, `{{PRIX}}`, `{{THEME}}`…)
désignent des **champs des données** (base ou `menu-data.js`) : ils ne se remplacent pas à la main.
`{{ANNEE}}` est rempli automatiquement par `main.js`.

---

## 2. Arborescence

```
.
├── index.html                 Page menu (site vitrine, une seule page)
├── admin.html                 Page admin (articles et prix) — non liée depuis le site, non indexée
├── vercel.json                En-têtes de sécurité (CSP) et cache
├── README.md                  Documentation du projet
├── squelette/README.md        Ce document
├── assets/
│   ├── css/
│   │   ├── style.css          Styles du site + variables de couleurs/polices (:root)
│   │   └── admin.css          Styles de la page admin (s'appuie sur style.css)
│   ├── js/
│   │   ├── config.js          {{SUPABASE_URL}} + {{SUPABASE_PUBLISHABLE_KEY}}
│   │   ├── api.js             Seul fichier qui parle à la base (lecture, connexion, écritures)
│   │   ├── menu-data.js       Carte de secours + onglets + infos (SITE) + source du menu de départ
│   │   ├── icons.js           Icônes SVG des catégories
│   │   ├── main.js            Page menu : rendu, tri par prix, recherche, FR/EN, panier, ticket
│   │   └── admin.js           Page admin : connexion, modification des articles
│   ├── fonts/                 Polices auto-hébergées (woff2)
│   └── img/                   Logo SVG, motifs, favicons, image de partage (og-image.jpg)
└── supabase/
    ├── README.md              Notice d'installation de la base
    ├── schema.sql             Tables + règles d'accès (RLS)
    ├── seed.sql               Menu de départ (généré)
    ├── generate-seed.js       Génère seed.sql depuis menu-data.js
    └── check.sql              Vérification de l'installation
```

Ordre de chargement des scripts (identique sur les deux pages, `defer`) :
`config.js` → `api.js` → `menu-data.js` → (`icons.js` → `main.js`) ou (`admin.js`).

---

## 3. Page menu — `index.html`

### 3.1 Plan de la page

```
┌─ NAV (fixe) ─────────────────────────────────────────────────────────────┐
│ [🔍 recherche]            [LOGO + {{BASELINE_LOGO}}]   Menu · Contact · FR⇄EN │
└──────────────────────────────────────────────────────────────────────────┘
  RÉSULTATS DE RECHERCHE (panneau sous la nav, caché par défaut)
┌─ HERO (#top) ── logo + {{BASELINE_LOGO}} · {{SLOGAN}} · [Voir le menu] [Nous trouver]
├─ BANDEAU DÉFILANT ── {{SLOGANS_DEFILANTS}}
├─ SÉLECTION (#selection) ── « À découvrir » : cartes générées depuis les articles mis en avant
├─ BANDEAU ── {{PHRASE_BANDEAU}} · {{PARTENAIRES}}
├─ MENU (#menu) ── onglets (SECTIONS) + cartes accordéon par catégorie, articles triés par prix
└─ FOOTER (#contact) ── logo · adresse + Maps · horaires · partenaires · Instagram · ©
   + PANIER (bulle + panneau) + TICKET « Commande à la caisse » (dialog)
```

### 3.2 Squelette HTML

Les blocs `<!-- généré par main.js -->` sont remplis à partir des données (base ou carte de secours) :
ne rien écrire dedans à la main. Les attributs `data-i18n*` portent les textes traduits (voir § 9).

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
  <title>{{NOM_COURT}} — {{BASELINE_LOGO}} · {{QUARTIER}}</title>
  <meta name="description" content="{{DESCRIPTION_SEO}}" />
  <meta name="theme-color" content="{{COULEUR_FONCEE}}" />
  <link rel="canonical" href="{{SITE_URL}}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="{{SITE_URL}}" />
  <meta property="og:title" content="{{NOM_DU_CAFE}}" />
  <meta property="og:description" content="{{DESCRIPTION_SEO}}" />
  <meta property="og:image" content="{{SITE_URL}}assets/img/og-image.jpg" />
  <link rel="icon" type="image/png" href="assets/img/favicon.png" />
  <link rel="stylesheet" href="assets/css/style.css" />
</head>
<body>

  <!-- Logo vectoriel, réutilisé partout via <use href="#eightin-logo"> -->
  <svg class="sprite" aria-hidden="true" focusable="false">
    <symbol id="eightin-logo" viewBox="{{LOGO_VIEWBOX}}"><path fill-rule="evenodd" d="{{LOGO_SVG_PATH}}"/></symbol>
  </svg>

  <!-- NAV -->
  <nav class="nav" id="nav">
    <form class="nav-search" id="nav-search" role="search" autocomplete="off">
      <label class="sr-only" for="search-input" data-i18n="searchLabel">Rechercher sur la carte</label>
      <!-- icône loupe -->
      <input type="search" id="search-input" placeholder="Rechercher sur la carte…"
             data-i18n-placeholder="searchPlaceholder" aria-controls="search-results" aria-expanded="false" />
    </form>
    <a href="#top" class="nav-logo" aria-label="{{NOM_DU_CAFE}} — accueil" data-i18n-aria="navHome">
      <svg class="logo-mark nav-logo-mark" viewBox="{{LOGO_VIEWBOX}}" aria-hidden="true"><use href="#eightin-logo"/></svg>
      <span class="nav-logo-tag" aria-hidden="true">{{BASELINE_LOGO}}</span>
    </a>
    <div class="nav-right">
      <ul class="nav-links" id="navLinks">
        <li><a href="#menu">Menu</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
      <button class="search-toggle" id="search-toggle" type="button" aria-label="Rechercher"
              data-i18n-aria="searchToggle" aria-expanded="false" aria-controls="nav-search"><!-- icône loupe --></button>
      <button class="lang-switch" id="lang-switch" type="button" data-current="fr" aria-label="Passer en anglais (English)">
        <span class="lang-thumb" aria-hidden="true"></span>
        <span class="lang-opt" data-opt="fr" aria-hidden="true">FR</span>
        <span class="lang-opt" data-opt="en" aria-hidden="true">EN</span>
      </button>
      <button class="hamburger" id="hamburger" type="button" aria-label="Ouvrir le menu"
              aria-expanded="false" aria-controls="navLinks"><span></span><span></span><span></span></button>
    </div>
  </nav>

  <!-- RÉSULTATS DE RECHERCHE -->
  <div class="search-results" id="search-results" hidden>
    <p class="search-status" id="search-status" aria-live="polite"></p>
    <ul class="search-list" id="search-list"><!-- généré par main.js --></ul>
  </div>

  <main>
    <!-- HERO -->
    <section class="hero" id="top">
      <div class="hero-strokes" aria-hidden="true"></div>
      <h1 class="lockup">
        <svg class="logo-mark lockup-mark" viewBox="{{LOGO_VIEWBOX}}" aria-hidden="true"><use href="#eightin-logo"/></svg>
        <span class="sr-only">{{NOM_COURT}}</span>
        <span class="lockup-tag">{{BASELINE_LOGO}}</span>
      </h1>
      <p class="hero-tagline">{{SLOGAN}}</p>
      <div class="hero-btns">
        <a href="#menu" class="btn btn-primary" data-i18n="heroMenu">Voir le menu</a>
        <a href="#contact" class="btn btn-outline" data-i18n="heroFind">Nous trouver</a>
      </div>
    </section>

    <!-- BANDEAU DÉFILANT (contenu écrit 2 fois pour une boucle continue) -->
    <div class="marquee" aria-hidden="true">
      <div class="marquee-track">
        <span>{{SLOGAN_1}}</span><i></i><span>{{SLOGAN_2}}</span><i></i><span>{{SLOGAN_3}}</span><i></i>
        <span>{{SLOGAN_1}}</span><i></i><span>{{SLOGAN_2}}</span><i></i><span>{{SLOGAN_3}}</span><i></i>
      </div>
    </div>

    <!-- SÉLECTION « À découvrir » -->
    <section class="section section-mint" id="selection">
      <header class="section-header reveal">
        <div class="label" data-i18n="selLabel">Sélection</div>
        <h2 data-i18n="selTitle">À découvrir</h2>
        <p data-i18n="selText">Quelques créations de la carte — touchez pour les ajouter à votre commande.</p>
      </header>
      <div class="featured-grid" id="featured-grid"><!-- généré par main.js (articles « featured ») --></div>
    </section>

    <!-- BANDEAU -->
    <section class="statement" aria-label="{{PHRASE_BANDEAU}}">
      <div class="statement-strokes" aria-hidden="true"></div>
      <p class="statement-big reveal">{{PHRASE_BANDEAU}}</p>
      <p class="statement-hand reveal" data-i18n="partners">Nos partenaires café : {{PARTENAIRES}}</p>
    </section>

    <!-- MENU -->
    <section class="section" id="menu">
      <header class="section-header reveal">
        <div class="label" data-i18n="menuLabel">Notre carte</div>
        <h2 data-i18n="menuTitle">Le Menu</h2>
        <p data-i18n="menuText">Ouvrez une catégorie et touchez un article pour l’ajouter à votre commande.</p>
      </header>
      <div class="menu-tabs" id="menu-tabs" role="tablist" aria-label="Rubriques du menu" data-i18n-aria="menuTabs">
        <!-- généré par main.js : un onglet par SECTION -->
      </div>
      <div class="menu-grid" id="menu-grid" role="tabpanel">
        <!-- généré par main.js : une carte accordéon par CATÉGORIE (voir 3.3) -->
      </div>
    </section>
  </main>

  <!-- FOOTER : infos pratiques -->
  <footer class="footer" id="contact">
    <div class="footer-strokes" aria-hidden="true"></div>
    <div class="footer-head">
      <a href="#top" class="footer-logo" aria-label="Retour en haut" data-i18n-aria="footTop">
        <svg class="logo-mark footer-logo-mark" viewBox="{{LOGO_VIEWBOX}}" aria-hidden="true"><use href="#eightin-logo"/></svg>
        <span class="footer-logo-tag" aria-hidden="true">{{BASELINE_LOGO}}</span>
      </a>
      <div class="footer-title">
        <div class="label" data-i18n="footVisit">Venez nous voir</div>
        <h2>Find us here</h2>
      </div>
    </div>
    <div class="footer-cols">
      <div class="footer-col"><!-- icône repère -->
        <h3 data-i18n="footAddr">Adresse</h3>
        <p><span data-i18n="footAddr1">{{QUARTIER}}</span><br /><span data-i18n="footAddr2">{{PAYS}}</span></p>
        <a class="footer-link" id="maps-link" href="{{MAPS_URL}}" target="_blank" rel="noopener" data-i18n="footMaps">Ouvrir dans Google Maps</a>
      </div>
      <div class="footer-col"><!-- icône horloge -->
        <h3 data-i18n="footHours">Horaires</h3>
        <p><span data-i18n="footHours1">{{JOURS}}</span><br /><span data-i18n="footHours2">{{HEURES}}</span></p>
      </div>
      <div class="footer-col"><!-- icône tasse -->
        <h3 data-i18n="footCoffee">Nos cafés</h3>
        <p><span data-i18n="footCoffee1">Partenaires</span><br />{{PARTENAIRES}}</p>
      </div>
      <div class="footer-col"><!-- icône Instagram -->
        <h3>Instagram</h3>
        <a class="footer-link" href="https://www.instagram.com/{{INSTAGRAM}}/" target="_blank" rel="noopener">@{{INSTAGRAM}}</a>
      </div>
    </div>
    <p class="footer-copy">© <span id="year">{{ANNEE}}</span> {{NOM_DU_CAFE}}. <span data-i18n="footRights">Tous droits réservés.</span></p>
  </footer>

  <!-- PANIER : bulle + panneau -->
  <button class="cart-bubble" id="cart-bubble" type="button" aria-controls="cart-panel" aria-expanded="false" hidden>
    <!-- icône sac -->
    <span class="sr-only" data-i18n="cartBubble">Ma commande :</span>
    <span class="cart-count" id="cart-count" aria-live="polite">0</span>
  </button>
  <aside class="cart-panel" id="cart-panel" aria-label="Ma commande" data-i18n-aria="cartTitle" hidden>
    <div class="cart-header">
      <h3 data-i18n="cartTitle">Ma commande</h3>
      <button class="icon-btn" id="cart-close" type="button" aria-label="Fermer" data-i18n-aria="close">✕</button>
    </div>
    <div class="cart-list" id="cart-list"><!-- généré par main.js --></div>
    <div class="cart-footer"><span class="cart-footer-label">Total</span><span class="cart-total" id="cart-total">0 {{DEVISE}}</span></div>
    <div class="cart-actions">
      <button class="btn btn-navy" id="cart-checkout" type="button" data-i18n="cartCheckout">Commander à la caisse</button>
      <button class="link-btn" id="cart-clear" type="button" data-i18n="cartClear">Vider la commande</button>
    </div>
  </aside>

  <!-- TICKET À MONTRER À LA CAISSE -->
  <dialog class="ticket" id="ticket" aria-labelledby="ticket-title">
    <div class="ticket-paper">
      <div class="ticket-head">
        <svg class="logo-mark ticket-logo" viewBox="{{LOGO_VIEWBOX}}" aria-hidden="true"><use href="#eightin-logo"/></svg>
        <p class="ticket-sign" id="ticket-title">↓ <span data-i18n="ticketSign">Commande à la caisse</span> ↓</p>
        <p class="ticket-time" id="ticket-time"></p>
      </div>
      <ul class="ticket-list" id="ticket-list"><!-- généré par main.js --></ul>
      <div class="ticket-total"><span>Total</span><span id="ticket-total"></span></div>
      <p class="ticket-note" data-i18n="ticketNote">Présentez cet écran à la caisse — le paiement se fait au comptoir.</p>
      <div class="ticket-actions">
        <button class="btn btn-navy" id="ticket-close" type="button" data-i18n="ticketClose">Fermer</button>
        <button class="link-btn" id="ticket-new" type="button" data-i18n="ticketNew">Nouvelle commande</button>
      </div>
    </div>
  </dialog>

  <script src="assets/js/config.js" defer></script>
  <script src="assets/js/api.js" defer></script>
  <script src="assets/js/menu-data.js" defer></script>
  <script src="assets/js/icons.js" defer></script>
  <script src="assets/js/main.js" defer></script>
</body>
</html>
```

### 3.3 Ce que `main.js` génère dans le menu

Pour chaque catégorie de l'onglet actif :

```html
<article class="menu-card theme-{{THEME}}" data-section="{{SECTION}}">
  <h3 class="card-heading">
    <button class="card-head tile" aria-expanded="false" aria-controls="menu-{{ID_CATEGORIE}}">
      <svg class="icon"><!-- icône {{ICONE}} --></svg>
      <span class="card-label">
        <span>
          <span class="card-title">{{NOM_CATEGORIE}}</span>
          <span class="card-sub">{{SOUS_TITRE}}</span>
          <span class="card-count">{{NB}} {{UNITE}} · dès {{PRIX_MIN}} {{DEVISE}}</span>
        </span>
        <span class="card-arrow"><!-- chevron --></span>
      </span>
    </button>
  </h3>
  <div class="card-dropdown" id="menu-{{ID_CATEGORIE}}">
    <div class="dropdown-clip"><div class="dropdown-inner">
      <div class="dropdown-sub">{{SOUS_GROUPE}}</div>             <!-- seulement si la catégorie a des sous-groupes -->
      <button class="item" data-add="{{ID_CATEGORIE}}/{{ID_ARTICLE}}">  <!-- un par article, du moins cher au plus cher -->
        <span class="item-name">{{NOM_ARTICLE}} <span class="item-tag">{{PASTILLE}}</span><small class="item-desc">{{PRECISION}}</small></span>
        <span class="item-price">{{PRIX}} {{DEVISE}}</span>
        <span class="item-plus">+</span>
      </button>
      <p class="dropdown-note">{{NOTE_CATEGORIE}}</p>               <!-- optionnel -->
    </div></div>
  </div>
</article>
```

Une catégorie « carte sans prix » (champ `info`) affiche à la place un texte `{{INFO}}` et un lien Instagram.

---

## 4. Données du menu — `assets/js/menu-data.js`

Sert de **carte de secours** (si la base ne répond pas), définit les **onglets** et les **liens**, et sert de
source au menu de départ de la base (`node supabase/generate-seed.js > supabase/seed.sql`).
Un texte peut être une chaîne simple (identique en FR et EN) ou `{ fr: '…', en: '…' }`.

```js
window.EIGHTIN = {
  SITE: {
    instagram: '{{INSTAGRAM}}',
    mapsUrl: '{{MAPS_URL}}',
  },

  // Onglets du menu (section = id d'onglet)
  SECTIONS: [
    { id: 'drinks', label: { fr: '{{ONGLET_1_FR}}', en: '{{ONGLET_1_EN}}' } },
    { id: 'sweet',  label: '{{ONGLET_2}}' },
    { id: 'savory', label: '{{ONGLET_3}}' },
  ],

  MENU: [
    // Catégorie avec prix
    {
      id: '{{ID_CATEGORIE}}',                 // ex. 'iced-coffee' (unique, sans espace)
      section: 'drinks',                       // onglet : drinks | sweet | savory
      name: '{{NOM_CATEGORIE}}',
      subtitle: { fr: '{{SOUS_TITRE_FR}}', en: '{{SOUS_TITRE_EN}}' },   // optionnel
      label: { fr: '{{NOM_DANS_LA_COMMANDE_FR}}', en: '{{…_EN}}' },     // optionnel
      theme: 'navy',                           // navy | sky | mint
      icon: 'iced',                            // iced, frappe, shake, smoothie, mojito, cocktail, classic,
                                               // croissant, crepe, waffle, egg, burger, cookie
      unit: { fr: 'boissons', en: 'drinks' },  // « 7 boissons · dès 8 DT »
      note: { fr: '{{NOTE_FR}}', en: '{{NOTE_EN}}' },                    // optionnel, sous la liste
      groups: [
        {
          title: '{{SOUS_GROUPE}}',            // optionnel (ex. Black / White)
          items: [
            { id: '{{ID_ARTICLE}}', name: { fr: '{{NOM_FR}}', en: '{{NOM_EN}}' }, price: {{PRIX}} },
            { id: '{{ID_ARTICLE_2}}', name: '{{NOM}}', price: {{PRIX}}, desc: '{{PRECISION}}', tag: '{{PASTILLE}}' },
          ],
        },
      ],
    },

    // Catégorie « carte sans prix » (texte seulement)
    {
      id: '{{ID_CATEGORIE_INFO}}', section: 'sweet', name: '{{NOM}}', theme: 'navy', icon: 'cookie',
      info: { fr: '{{TEXTE_FR}}', en: '{{TEXTE_EN}}' },
      groups: [],
    },
  ],

  // Section « À découvrir » : 'categorie/article'
  FEATURED: ['{{ID_CATEGORIE}}/{{ID_ARTICLE}}'],
};
```

Sur le site, les articles de chaque catégorie (et de chaque sous-groupe) sont affichés **par prix croissant**,
quelle que soit leur position dans ce fichier ou dans la base.

---

## 5. Page admin — `admin.html`

### 5.1 Plan de la page

```
Vue « Base non configurée » (#view-config)  ← si config.js est vide
Vue « Connexion » (#view-login)             ← e-mail + mot de passe (Supabase Auth)
Vue « Gestion » (#view-admin)
┌─ EN-TÊTE ── logo · ADMIN · {{EMAIL_ADMIN}} · Voir le site ↗ · [Déconnexion]
├─ BARRE ── onglets (Boissons · Sweet & Brunch · Savory) · [Filtrer les articles…]
├─ AIDE
└─ CATÉGORIES (générées) ── pour chaque article :
     Nom (FR) · Nom (EN) · Prix ({{DEVISE}}) · [Affiché/Masqué] · [★ À découvrir] · [Enregistrer] [Annuler] [Supprimer]
     + formulaire « Nouvel article » en bas de chaque catégorie
Message de confirmation (#adm-toast)
```

### 5.2 Squelette HTML

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
  <meta name="robots" content="noindex, nofollow" />
  <title>Admin — {{NOM_DU_CAFE}}</title>
  <link rel="stylesheet" href="assets/css/style.css" />
  <link rel="stylesheet" href="assets/css/admin.css" />
</head>
<body class="admin">

  <!-- CONNEXION -->
  <main class="adm-center" id="view-login" hidden>
    <form class="adm-card adm-login-card" id="login-form" novalidate>
      <img class="adm-logo" src="assets/img/logo-eightin.svg" alt="{{NOM_COURT}}" />
      <h1>Espace admin</h1>
      <p class="adm-muted">Gestion des articles et des prix affichés sur le site.</p>
      <label class="adm-field">E-mail <input class="adm-input" type="email" id="login-email" autocomplete="username" /></label>
      <label class="adm-field">Mot de passe <input class="adm-input" type="password" id="login-password" autocomplete="current-password" /></label>
      <button class="btn btn-navy" type="submit" id="login-submit">Se connecter</button>
      <p class="adm-error" id="login-error" role="alert"></p>
    </form>
  </main>

  <!-- BASE NON CONFIGURÉE -->
  <main class="adm-center" id="view-config" hidden>
    <div class="adm-card adm-login-card">
      <h1>Base non configurée</h1>
      <p class="adm-muted">Renseigner {{SUPABASE_URL}} et {{SUPABASE_PUBLISHABLE_KEY}} dans assets/js/config.js.</p>
      <a class="btn btn-navy" href="./">Retour au site</a>
    </div>
  </main>

  <!-- GESTION DU MENU -->
  <div id="view-admin" hidden>
    <header class="adm-header">
      <div class="adm-brand"><img src="assets/img/logo-eightin.svg" alt="{{NOM_COURT}}" /><span class="adm-pill">Admin</span></div>
      <div class="adm-user">
        <span class="adm-email" id="adm-email"><!-- {{EMAIL_ADMIN}} --></span>
        <a class="adm-link" href="./" target="_blank" rel="noopener">Voir le site ↗</a>
        <button class="adm-btn-ghost" type="button" id="logout">Déconnexion</button>
      </div>
    </header>
    <main class="adm-main">
      <div class="adm-toolbar">
        <div class="menu-tabs adm-tabs" id="adm-tabs" role="tablist"><!-- généré par admin.js --></div>
        <input class="adm-input adm-filter" type="search" id="adm-filter" placeholder="Filtrer les articles…" />
      </div>
      <p class="adm-help">{{TEXTE_AIDE}}</p>
      <div id="adm-categories"><!-- généré par admin.js (voir 5.3) --></div>
    </main>
  </div>

  <div class="adm-toast" id="adm-toast" role="status" aria-live="polite" hidden></div>

  <script src="assets/js/config.js" defer></script>
  <script src="assets/js/api.js" defer></script>
  <script src="assets/js/menu-data.js" defer></script>
  <script src="assets/js/admin.js" defer></script>
</body>
</html>
```

### 5.3 Ce que `admin.js` génère pour chaque catégorie

```html
<section class="adm-cat" data-cat="{{ID_CATEGORIE}}">
  <header class="adm-cat-head"><h2>{{NOM_CATEGORIE}} <small>{{SOUS_TITRE}}</small></h2><span class="adm-count">{{NB}} articles · {{NB_MASQUES}} masqués</span></header>

  <div class="adm-row" data-id="{{UUID_ARTICLE}}">               <!-- une ligne par article -->
    <label class="adm-field f-name_fr">Nom (FR) · {{SOUS_GROUPE}} <input class="adm-input" data-f="name_fr" value="{{NOM_FR}}" /></label>
    <label class="adm-field f-name_en">Nom (EN) <input class="adm-input" data-f="name_en" value="{{NOM_EN}}" placeholder="Identique au FR" /></label>
    <label class="adm-field f-price">Prix ({{DEVISE}}) <input class="adm-input" data-f="price" value="{{PRIX}}" inputmode="decimal" /></label>
    <button class="adm-toggle f-visible" aria-pressed="true">Affiché</button>
    <button class="adm-star f-featured" aria-pressed="false">☆</button>
    <div class="adm-actions f-actions">
      <button class="btn btn-navy adm-save" hidden>Enregistrer</button>   <!-- visible seulement si modifié -->
      <button class="adm-text-btn" hidden>Annuler</button>
      <button class="adm-delete">Supprimer</button>
    </div>
  </div>

  <form class="adm-add">                                           <!-- ajout d'un article -->
    <label class="adm-field f-name_fr">Nouvel article (FR) <input data-f="name_fr" /></label>
    <label class="adm-field f-name_en">Nom (EN) <input data-f="name_en" /></label>
    <label class="adm-field f-price">Prix ({{DEVISE}}) <input data-f="price" /></label>
    <label class="adm-field f-group">Sous-groupe <select data-f="group">…</select></label>  <!-- si sous-groupes -->
    <button class="btn btn-navy adm-add-btn" type="submit">+ Ajouter</button>
  </form>
</section>
```

---

## 6. Configuration — `assets/js/config.js`

```js
window.EIGHTIN_CONFIG = {
  supabaseUrl: '{{SUPABASE_URL}}',              // ex. https://xxxxxxxxxxxxxxxxxxxx.supabase.co
  supabaseKey: '{{SUPABASE_PUBLISHABLE_KEY}}',  // sb_publishable_… ou anon — JAMAIS service_role / sb_secret_
};
```

Vide → le site affiche la carte de secours et l'admin affiche « Base non configurée ».

---

## 7. Base de données (Supabase)

Détail complet : [`supabase/README.md`](../supabase/README.md).

| Table | Colonnes principales | Accès |
|---|---|---|
| `categories` | `id`, `section`, `sort`, `name_fr/en`, `subtitle_fr/en`, `label_fr/en`, `unit_fr/en`, `note_fr/en`, `info_fr/en`, `theme`, `icon` | lecture publique, modification en SQL uniquement |
| `items` | `id` (uuid), `category_id`, `group_title`, `sort`, `name_fr/en`, `desc_fr/en`, `tag`, `price`, `visible`, `featured` | lecture publique, écriture réservée aux admins |
| `admin_users` | `user_id` → `auth.users` | chaque admin voit sa ligne ; modification en SQL uniquement |

Mise en place : `schema.sql` → `seed.sql` → compte dans Authentication → déclaration admin → `check.sql`.

```sql
-- Déclarer un admin
insert into public.admin_users (user_id)
select id from auth.users where email = '{{EMAIL_ADMIN}}';
```

---

## 8. Styles — variables de `assets/css/style.css`

```css
:root {
  --navy: {{COULEUR_FONCEE}};        /* fonds sombres, textes, boutons */
  --navy-deep: {{COULEUR_FONCEE_PLUS}};
  --sky: {{COULEUR_CLAIRE}};         /* accents, bandeau défilant */
  --mint: {{COULEUR_FOND}};          /* fonds clairs, texte sur fond sombre */
  --font-script: '{{POLICE_SCRIPT}}', cursive;      /* titres */
  --font-display: '{{POLICE_SLOGAN}}', sans-serif;  /* slogans */
  --font-hand: '{{POLICE_MAIN}}', cursive;          /* noms d'articles */
  --font-body: '{{POLICE_TEXTE}}', sans-serif;      /* texte courant */
}
```

Les polices sont auto-hébergées dans `assets/fonts/` (déclarées par `@font-face` en haut de `style.css`).
Si une police change de domaine d'hébergement, mettre à jour la CSP dans `vercel.json`.

---

## 9. Textes FR / EN

- **Textes de la page** : en français dans le HTML, marqués `data-i18n="clé"` (texte), `data-i18n-aria="clé"`
  (libellé accessible) ou `data-i18n-placeholder="clé"`. La traduction anglaise de chaque clé est dans l'objet
  `STATIC_EN` de `main.js`.
- **Textes générés** (boutons « + Ajouter », messages de recherche, panier, ticket) : objet `T` de `main.js`.
- **Textes du menu** : `{ fr, en }` dans `menu-data.js` ou colonnes `_fr` / `_en` de la base.

Clés utilisées : `navHome`, `searchLabel`, `searchPlaceholder`, `searchToggle`, `heroMenu`, `heroFind`,
`selLabel`, `selTitle`, `selText`, `partners`, `menuLabel`, `menuTitle`, `menuText`, `menuTabs`, `footVisit`,
`footTop`, `footAddr`, `footAddr1`, `footAddr2`, `footMaps`, `footHours`, `footHours1`, `footHours2`,
`footCoffee`, `footCoffee1`, `footRights`, `cartTitle`, `cartBubble`, `close`, `cartCheckout`, `cartClear`,
`ticketSign`, `ticketNote`, `ticketClose`, `ticketNew`.

---

## 10. Identifiants obligatoires (contrat HTML ↔ JavaScript)

Supprimer ou renommer l'un de ces éléments casse le script correspondant.

**`index.html` (utilisés par `main.js`)**
`nav`, `nav-search`, `search-input`, `search-toggle`, `search-results`, `search-status`, `search-list`,
`navLinks`, `hamburger`, `lang-switch`, `featured-grid`, `menu-tabs`, `menu-grid`, `maps-link`, `year`,
`cart-bubble`, `cart-count`, `cart-panel`, `cart-list`, `cart-total`, `cart-close`, `cart-checkout`,
`cart-clear`, la classe `.cart-actions`, `ticket`, `ticket-list`, `ticket-total`, `ticket-time`,
`ticket-close`, `ticket-new` — et le symbole SVG `#eightin-logo`.

**`admin.html` (utilisés par `admin.js`)**
`view-login`, `view-config`, `view-admin`, `login-form`, `login-email`, `login-password`, `login-submit`,
`login-error`, `logout`, `adm-email`, `adm-tabs`, `adm-filter`, `adm-categories`, `adm-toast`.

---

## 11. Checklist — créer un nouveau site à partir du squelette

1. Copier le dépôt (nouveau dépôt GitHub).
2. Remplacer les valeurs du [tableau des placeholders](#1-placeholders) dans `index.html`, `admin.html`,
   `menu-data.js` et `main.js` (`STATIC_EN` pour l'anglais).
3. Logo : vectoriser le logo en SVG, remplacer `assets/img/logo-eightin.svg` et le `<symbol>` de `index.html`
   (`{{LOGO_VIEWBOX}}`, `{{LOGO_SVG_PATH}}`) ; régénérer `favicon.png`, `apple-touch-icon.png`, `og-image.jpg`.
4. Couleurs et polices : variables `:root` de `style.css` + fichiers de `assets/fonts/`.
5. Menu : remplir `menu-data.js` (catégories, articles, prix, mises en avant).
6. Base : `node supabase/generate-seed.js > supabase/seed.sql`, puis suivre `supabase/README.md`
   (schema → seed → compte admin → déclaration → `check.sql`).
7. `config.js` : `{{SUPABASE_URL}}` et `{{SUPABASE_PUBLISHABLE_KEY}}`.
8. Déployer (Vercel), puis mettre `{{SITE_URL}}` dans `canonical`, `og:url` et `og:image`.
9. Tester : menu (tri par prix, recherche, FR/EN), commande et ticket, admin (prix, masquer, ajouter,
   supprimer), et repli sur la carte de secours si la base ne répond pas.
