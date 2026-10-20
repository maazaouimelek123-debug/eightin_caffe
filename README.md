# Eight’In Flour & Coffee — site web

Site vitrine du café **Eight’In Flour & Coffee** (Boumhal, banlieue sud de Tunis).
Site statique en HTML/CSS/JS, sans framework, sans build et sans backend.

La structure reprend celle du site Bisou : nav fixe, hero plein écran, sélection, menu en cartes accordéon, panier, contact, footer.
L'identité visuelle (couleurs, typographies, motif « coups de pinceau ») est celle de l'Instagram [@eightincoffee](https://www.instagram.com/eightincoffee/) et de l'enseigne en boutique.

## Aperçu local

```bash
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

## Structure

```
index.html              Page unique (sections : hero, sélection, à propos, menu, contact)
assets/css/style.css    Styles + palette (variables CSS dans :root)
assets/js/menu-data.js  ← LE fichier à modifier pour les prix et les boissons
assets/js/main.js       Rendu du menu, panier, ticket « commande à la caisse »
assets/fonts/           Polices auto-hébergées (woff2)
assets/img/             Motifs SVG, photo de l'enseigne, favicons, image de partage
vercel.json             En-têtes de sécurité (CSP stricte) pour un déploiement Vercel
```

## Modifier le menu

Tout se fait dans `assets/js/menu-data.js` :

- **Changer un prix** : modifier `price` (en DT).
- **Ajouter une boisson** : ajouter `{ id: 'mon-id', name: 'Nom', price: 12 }` dans la bonne catégorie (l'`id` doit être unique dans la catégorie).
- **Ajouter une catégorie** : copier un bloc existant et choisir un `theme` (`navy`, `sky`, `mint`) et une `icon` (`iced`, `frappe`, `shake`, `smoothie`, `mojito`, `cocktail`, `classic`, `croissant`).
- **Section « À découvrir »** : liste `FEATURED`, au format `'categorie/boisson'`.

Le nombre de boissons affiché dans « À propos » et les « dès X DT » sont calculés automatiquement.

## Identité visuelle

| Rôle | Valeur | Source |
|---|---|---|
| Navy | `#1B3A57` | Fonds des posts Instagram, logo |
| Bleu ciel | `#C9E9F5` | Posts « Find us here », coups de pinceau |
| Menthe | `#EAFBF4` | Fond de l'avatar et des stories à la une |

| Typo | Usage | Pourquoi |
|---|---|---|
| Yellowtail | Logo, titres | Script la plus proche du logo (comparée à 12 autres) |
| Bebas Neue | Slogans (« BUT FIRST, COFFEE. ») | Même condensé gras que les posts |
| Patrick Hand | Noms des boissons, accents manuscrits | Proche de l'écriture des posts et des panneaux menu ; gère les accents français |
| Josefin Sans | Texte courant, libellés | Capitales espacées type « FLOUR AND COFFEE » |

Licences : Yellowtail (Apache 2.0), Bebas Neue, Patrick Hand et Josefin Sans (SIL OFL 1.1), via Fontsource.

## Commande

Comme indiqué sur l'enseigne (« Commande à la caisse »), le panier ne passe **aucune commande en ligne** : le client compose sa commande et affiche un ticket à présenter au comptoir.
Le panier est gardé dans le navigateur (`localStorage`), sans aucune donnée envoyée.

## Déploiement

- **Vercel** (comme Bisou) : importer le dépôt, sans configuration supplémentaire. `vercel.json` applique les en-têtes de sécurité.
- **GitHub Pages** : fonctionne aussi, mais sans les en-têtes de `vercel.json`.

Après le déploiement, remplacer `og:image` dans `index.html` par l'URL absolue (`https://…/assets/img/og-image.jpg`) pour que l'aperçu WhatsApp / Facebook s'affiche.

## À compléter

- [ ] Vraies photos des boissons et des viennoiseries (actuellement, illustrations aux couleurs de la marque).
- [ ] Carte « Flour » (croissants, sweets & savory) : prix inconnus, la catégorie affiche « bientôt ».
- [ ] Lien Google Maps exact de la fiche (`mapsUrl` dans `menu-data.js`). Actuellement, c'est une recherche.
- [ ] Logo vectoriel officiel (SVG/PDF) si disponible. Le logo est actuellement recomposé avec la police Yellowtail.
- [ ] Vérifier les prix de la catégorie *Classics* sur le panneau (voir ci-dessous).

## Points vérifiés / à valider

- **Prix Classics** : sur la photo, les prix sont décalés d'une ligne par la perspective. Correspondance retenue : Strawberry 8, Orange 7, Lemonade 7, Soda 5, Water 0.5 L 3, Water 1 L 4, Tea 4, Infusion 5, Energy Drink 9.
- **Orthographe corrigée** par rapport aux panneaux : *Basil Smash* (SMACH), *Blue Hawaiian* (HAWAIAN), *Spanish Americano* (SPANICH), *Frappuccino* (FRAPUCCINO).
