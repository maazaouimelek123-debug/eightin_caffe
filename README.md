# Eight’In Flour & Coffee — site web

Site vitrine du café **Eight’In Flour & Coffee** (Boumhal, banlieue sud de Tunis).
Site statique en HTML/CSS/JS, sans framework, sans build et sans backend.

Une seule page : nav fixe (recherche dans le menu + bouton FR/EN), hero plein écran, sélection, menu par onglets (Boissons, Sweet & Brunch, Savory) en cartes accordéon, panier, footer avec les infos pratiques (adresse, horaires, cafés partenaires, Instagram).
L'identité visuelle (couleurs, typographies, motif « coups de pinceau ») est celle de l'Instagram [@eightincoffee](https://www.instagram.com/eightincoffee/) et de l'enseigne en boutique.

## Aperçu local

```bash
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

## Structure

```
index.html              Page unique (sections : hero, sélection, menu, footer/contact)
assets/css/style.css    Styles + palette (variables CSS dans :root)
assets/js/menu-data.js  ← LE fichier à modifier pour les prix et les articles
assets/js/main.js       Rendu du menu, recherche, langue FR/EN, panier, ticket « commande à la caisse »
assets/js/icons.js      Icônes des catégories (SVG)
assets/fonts/           Polices auto-hébergées (woff2)
assets/img/             Logo SVG, motifs SVG, favicons, image de partage
vercel.json             En-têtes de sécurité (CSP stricte) pour un déploiement Vercel
```

## Modifier le menu

Tout se fait dans `assets/js/menu-data.js` :

- **Changer un prix** : modifier `price`.
- **Ajouter un article** : ajouter `{ id: 'mon-id', name: 'Nom', price: 12 }` dans la bonne catégorie (l'`id` doit être unique dans la catégorie). Option : `desc` pour une précision sous le nom, `tag` pour une pastille.
- **Ajouter une catégorie** : copier un bloc existant, choisir son onglet (`section` : `drinks`, `sweet`, `savory`), un `theme` (`navy`, `sky`, `mint`) et une `icon` (`iced`, `frappe`, `shake`, `smoothie`, `mojito`, `cocktail`, `classic`, `croissant`, `crepe`, `waffle`, `egg`, `burger`, `cookie`).
- **Carte sans prix** (ex. Gourmet Corner) : remplacer les articles par un texte `info`.
- **Section « À découvrir »** : liste `FEATURED`, au format `'categorie/article'`.
- **Traduction** : un texte peut être une chaîne simple (identique en FR et EN) ou `{ fr: '…', en: '…' }`.

Les compteurs des onglets et les « dès X DT » sont calculés automatiquement.

## Langues (FR / EN)

- Le site est en français par défaut ; le bouton FR/EN de la nav bascule toute la page, le choix est mémorisé dans le navigateur.
- **Textes du menu** : dans `menu-data.js`, au format `{ fr, en }`.
- **Textes fixes de la page** : en français dans `index.html` (attributs `data-i18n`, `data-i18n-aria`, `data-i18n-placeholder`), traduction anglaise dans l'objet `STATIC_EN` de `main.js`.

## Recherche

La barre de recherche (en haut à gauche, icône loupe sur mobile) cherche dans tout le menu, en français et en anglais, sans tenir compte des accents ni des majuscules. Toucher un résultat l'ajoute à la commande.

## Identité visuelle

| Rôle | Valeur | Source |
|---|---|---|
| Navy | `#1B3A57` | Fonds des posts Instagram, logo |
| Bleu ciel | `#C9E9F5` | Posts « Find us here », coups de pinceau |
| Menthe | `#EAFBF4` | Fond de l'avatar et des stories à la une |

**Logo** : `assets/img/logo-eightin.svg`, vectorisé depuis le post Instagram « Find us here ». Il est intégré en SVG dans `index.html` (symbole `#eightin-logo`, classe `.logo-mark`) pour rester net à toutes les tailles ; sa couleur suit `color`. Après une modification du fichier, recopier son tracé dans ce symbole, avec la même mention « FLOUR & COFFEE » empilée que sur l'avatar Instagram.

| Typo | Usage | Pourquoi |
|---|---|---|
| Yellowtail | Titres de sections et de catégories | Script la plus proche du logo (comparée à 12 autres) |
| Bebas Neue | Slogans (« BUT FIRST, COFFEE. ») | Même condensé gras que les posts |
| Patrick Hand | Noms des articles, accents manuscrits | Proche de l'écriture des posts et des panneaux menu ; gère les accents français |
| Josefin Sans | Texte courant, libellés | Capitales espacées type « FLOUR AND COFFEE » |

Licences : Yellowtail (Apache 2.0), Bebas Neue, Patrick Hand et Josefin Sans (SIL OFL 1.1), via Fontsource.

## Commande

Comme indiqué sur l'enseigne (« Commande à la caisse »), le panier ne passe **aucune commande en ligne** : le client compose sa commande et affiche un ticket à présenter au comptoir.
Le panier est gardé dans le navigateur (`localStorage`), sans aucune donnée envoyée.

## Déploiement

- **Vercel** : importer le dépôt, sans configuration supplémentaire. `vercel.json` applique les en-têtes de sécurité.
- **GitHub Pages** : fonctionne aussi, mais sans les en-têtes de `vercel.json`.

Après le déploiement, remplacer `og:image` dans `index.html` par l'URL absolue (`https://…/assets/img/og-image.jpg`) pour que l'aperçu WhatsApp / Facebook s'affiche.
