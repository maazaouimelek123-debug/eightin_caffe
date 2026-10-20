/*
 * Eight'In Flour & Coffee — contenu du menu.
 * C'est le seul fichier à modifier pour changer un prix ou ajouter un article.
 * Textes bilingues : un texte peut être une simple chaîne (identique en FR et EN)
 * ou un objet { fr: '…', en: '…' }.
 *
 * Source : panneaux et carte photographiés en boutique + page Instagram @eightincoffee.
 */
window.EIGHTIN = {
  SITE: {
    instagram: 'eightincoffee',
    // Lien de la fiche Google Maps (lien en bio Instagram, sans paramètres de suivi).
    mapsUrl: 'https://maps.app.goo.gl/udovAyAhgXNVn44n8',
  },

  // Onglets du menu, dans l'ordre de la carte imprimée.
  SECTIONS: [
    { id: 'drinks', label: { fr: 'Boissons', en: 'Drinks' } },
    { id: 'sweet', label: 'Sweet & Brunch' },
    { id: 'savory', label: 'Savory' },
  ],

  // Thèmes de carte : 'navy' | 'sky' | 'mint' (couleurs Instagram).
  // Icônes : iced, frappe, shake, smoothie, mojito, cocktail, classic,
  //          croissant, crepe, waffle, egg, burger, cookie.
  // Champs optionnels : subtitle, label (nom affiché dans la commande), note (sous la liste), info (carte sans prix),
  // et par article : tag (pastille), desc (précision sous le nom).
  MENU: [
    /* ---------------- Boissons ---------------- */
    {
      id: 'iced-coffee',
      section: 'drinks',
      name: 'Iced Coffee',
      theme: 'navy',
      icon: 'iced',
      unit: { fr: 'boissons', en: 'drinks' },
      groups: [
        {
          title: 'Black',
          items: [
            { id: 'americano', name: 'Americano', price: 8 },
            { id: 'caramel-americano', name: 'Caramel Americano', price: 9 },
            { id: 'spanish-americano', name: 'Spanish Americano', price: 10 },
          ],
        },
        {
          title: 'White',
          items: [
            { id: 'latte', name: 'Latte', price: 9 },
            { id: 'vanilla-latte', name: 'Vanilla Latte', price: 10 },
            { id: 'caramel-latte', name: 'Caramel Latte', price: 10 },
            { id: 'matcha-latte', name: 'Matcha Latte', price: 13 },
          ],
        },
      ],
    },
    {
      id: 'frappuccino',
      section: 'drinks',
      name: 'Frappuccino',
      theme: 'sky',
      icon: 'frappe',
      unit: { fr: 'saveurs', en: 'flavours' },
      groups: [
        {
          items: [
            { id: 'original', name: 'Original Recipe', price: 10 },
            { id: 'caramel', name: 'Caramel', price: 12 },
            { id: 'vanilla', name: 'Vanilla', price: 12 },
            { id: 'hazelnut', name: 'Hazelnut', price: 12 },
            { id: 'salted-caramel', name: 'Salted Caramel', price: 12 },
            { id: 'nutella', name: 'Nutella', price: 14 },
          ],
        },
      ],
    },
    {
      id: 'milkshake',
      section: 'drinks',
      name: 'Milkshake',
      theme: 'mint',
      icon: 'shake',
      unit: { fr: 'saveurs', en: 'flavours' },
      groups: [
        {
          items: [
            { id: 'strawberry', name: 'Strawberry', price: 12 },
            { id: 'raspberry', name: 'Raspberry', price: 12 },
            { id: 'wild-berry', name: 'Wild Berry', price: 12 },
            { id: 'passion-fruit', name: 'Passion Fruit', price: 12 },
            { id: 'salted-caramel', name: 'Salted Caramel', price: 12 },
            { id: 'nutella', name: 'Nutella', price: 14 },
          ],
        },
      ],
    },
    {
      id: 'smoothie',
      section: 'drinks',
      name: 'Smoothie',
      theme: 'navy',
      icon: 'smoothie',
      unit: { fr: 'recettes', en: 'recipes' },
      groups: [
        {
          items: [
            { id: 'strawberry', name: 'Strawberry', price: 12 },
            { id: 'raspberry', name: 'Raspberry', price: 12 },
            { id: 'wild-berry', name: 'Wild Berry', price: 12 },
            { id: 'passion-fruit', name: 'Passion Fruit', price: 12 },
          ],
        },
      ],
    },
    {
      id: 'mojito',
      section: 'drinks',
      name: 'Mojito',
      theme: 'sky',
      icon: 'mojito',
      unit: { fr: 'saveurs', en: 'flavours' },
      note: { fr: 'Sans alcool', en: 'Alcohol-free' },
      groups: [
        {
          items: [
            { id: 'virgin', name: 'Virgin', price: 12 },
            { id: 'blue-curacao', name: 'Blue Curaçao', price: 12 },
            { id: 'strawberry', name: 'Strawberry', price: 12 },
            { id: 'raspberry', name: 'Raspberry', price: 12 },
            { id: 'passion-fruit', name: 'Passion Fruit', price: 12 },
          ],
        },
      ],
    },
    {
      id: 'freshly',
      section: 'drinks',
      name: 'Freshly',
      subtitle: 'Blended or shaken',
      theme: 'mint',
      icon: 'cocktail',
      unit: { fr: 'créations', en: 'creations' },
      groups: [
        {
          items: [
            { id: 'pina-colada', name: 'Piña Colada', price: 12 },
            { id: 'basil-smash', name: 'Basil Smash', price: 12, tag: 'Healthy' },
            { id: 'blue-hawaiian', name: 'Blue Hawaiian', price: 12 },
            { id: 'strawberry-twist', name: 'Strawberry Twist', price: 13 },
          ],
        },
      ],
    },
    {
      id: 'classics',
      section: 'drinks',
      name: 'Classics',
      theme: 'navy',
      icon: 'classic',
      unit: { fr: 'boissons', en: 'drinks' },
      groups: [
        {
          items: [
            { id: 'strawberry', name: 'Strawberry', price: 8 },
            { id: 'orange', name: 'Orange', price: 7 },
            { id: 'lemonade', name: 'Lemonade', price: 7 },
            { id: 'soda', name: 'Soda', price: 5 },
            { id: 'water-05', name: 'Water 0.5 L', price: 3 },
            { id: 'water-1', name: 'Water 1 L', price: 4 },
            { id: 'tea', name: 'Tea', price: 4 },
            { id: 'infusion', name: 'Infusion Tea', price: 5 },
            { id: 'energy', name: 'Energy Drink', price: 9 },
          ],
        },
      ],
    },

    /* ---------------- Sweet & Brunch ---------------- */
    {
      id: 'crepes-sucrees',
      section: 'sweet',
      name: 'Crêpes',
      subtitle: { fr: 'Sucrées', en: 'Sweet' },
      label: { fr: 'Crêpes sucrées', en: 'Sweet crêpes' },
      theme: 'navy',
      icon: 'crepe',
      unit: { fr: 'recettes', en: 'recipes' },
      groups: [
        {
          items: [
            { id: 'nutella', name: 'Nutella', price: 15 },
            { id: 'nutella-caramel', name: { fr: 'Nutella caramel beurre salé', en: 'Nutella & salted butter caramel' }, price: 16 },
            { id: 'nutella-pistache', name: { fr: 'Nutella pistache', en: 'Nutella & pistachio' }, price: 19 },
            { id: 'ferrero', name: 'Ferrero Rocher', price: 14 },
          ],
        },
      ],
    },
    {
      id: 'gaufres-sucrees',
      section: 'sweet',
      name: { fr: 'Gaufres', en: 'Waffles' },
      subtitle: { fr: 'Sucrées', en: 'Sweet' },
      label: { fr: 'Gaufres sucrées', en: 'Sweet waffles' },
      theme: 'sky',
      icon: 'waffle',
      unit: { fr: 'recettes', en: 'recipes' },
      groups: [
        {
          items: [
            { id: 'nutella', name: 'Nutella', price: 15 },
            { id: 'nutella-caramel', name: { fr: 'Nutella caramel beurre salé', en: 'Nutella & salted butter caramel' }, price: 16 },
            { id: 'nutella-pistache', name: { fr: 'Nutella pistache', en: 'Nutella & pistachio' }, price: 19 },
            { id: 'ferrero', name: 'Ferrero Rocher', price: 14 },
          ],
        },
      ],
    },
    {
      id: 'brunch',
      section: 'sweet',
      name: 'Brunch',
      subtitle: { fr: 'De 8h à 14h', en: '8am – 2pm' },
      theme: 'mint',
      icon: 'croissant',
      unit: { fr: 'formules', en: 'dishes' },
      note: {
        fr: 'Tous les brunchs sont servis avec un jus et un café.',
        en: 'All brunch items are served with a juice and a coffee.',
      },
      groups: [
        {
          items: [
            { id: 'eggs-bresaola', name: 'Scrambled Eggs with Bresaola', price: 24 },
            { id: 'stuffed-croissant', name: 'Stuffed Croissant', price: 22 },
            { id: 'salted-caramel-brioche', name: 'Salted Caramel Brioche', price: 23 },
            { id: 'pistachio-nutella-brioche', name: 'Pistachio & Nutella Brioche', price: 28 },
            { id: 'salmon-eggs-toast', name: 'Smoked Salmon & Scrambled Eggs Toast', price: 29 },
            { id: 'pesto-chicken-toast', name: 'Pesto Chicken Toast', price: 25 },
          ],
        },
      ],
    },
    {
      id: 'gourmet-corner',
      section: 'sweet',
      name: 'Gourmet Corner',
      subtitle: { fr: 'Chaque jour en vitrine', en: 'Daily at the counter' },
      theme: 'navy',
      icon: 'cookie',
      info: {
        fr: 'Une sélection de douceurs fraîchement préparées, livrées chaque jour au comptoir : brownies, brookies, cookies, tarte au lemon curd, cakes… Venez voir la vitrine !',
        en: 'A selection of freshly baked sweet treats, delivered daily to our display counter: brownies, brookies, cookies, lemon curd tart, cakes… Come and check it out!',
      },
      groups: [],
    },

    /* ---------------- Savory ---------------- */
    {
      id: 'omelettes',
      section: 'savory',
      name: 'Omelettes',
      theme: 'navy',
      icon: 'egg',
      unit: { fr: 'recettes', en: 'recipes' },
      groups: [
        {
          items: [
            { id: 'mozzarella', name: 'Mozzarella', price: 12 },
            { id: 'thon-mozzarella', name: { fr: 'Thon mozzarella', en: 'Tuna mozzarella' }, price: 15 },
            { id: 'jambon-mozzarella', name: { fr: 'Jambon mozzarella', en: 'Turkey ham mozzarella' }, price: 15 },
          ],
        },
      ],
    },
    {
      id: 'crepes-salees',
      section: 'savory',
      name: 'Crêpes',
      subtitle: { fr: 'Salées', en: 'Savory' },
      label: { fr: 'Crêpes salées', en: 'Savory crêpes' },
      theme: 'sky',
      icon: 'crepe',
      unit: { fr: 'recettes', en: 'recipes' },
      groups: [
        {
          items: [
            { id: 'thon-mozzarella', name: { fr: 'Thon mozzarella', en: 'Tuna mozzarella' }, price: 14 },
            { id: 'thon-mozzarella-oeuf', name: { fr: 'Thon mozzarella œuf', en: 'Tuna mozzarella & egg' }, price: 15 },
            { id: 'jambon-mozzarella', name: { fr: 'Jambon mozzarella', en: 'Turkey ham mozzarella' }, price: 14 },
            { id: 'poulet-pesto', name: { fr: 'Poulet pesto mozzarella', en: 'Chicken pesto mozzarella' }, price: 18 },
            { id: 'saumon-mozzarella', name: { fr: 'Saumon mozzarella', en: 'Salmon mozzarella' }, price: 24 },
          ],
        },
      ],
    },
    {
      id: 'burgers',
      section: 'savory',
      name: 'Burgers',
      theme: 'mint',
      icon: 'burger',
      unit: { fr: 'burgers', en: 'burgers' },
      groups: [
        {
          items: [
            { id: 'classic', name: 'Classic Burger', price: 20 },
            { id: 'grilled-chicken', name: 'Grilled Chicken Burger', price: 17 },
            { id: 'fried-chicken', name: 'Fried Chicken Burger', price: 19 },
            { id: 'eightin', name: 'Eight’In Burger', desc: { fr: 'Bresaola & œuf', en: 'Bresaola & egg' }, price: 25 },
          ],
        },
      ],
    },
    {
      id: 'gaufres-salees',
      section: 'savory',
      name: { fr: 'Gaufres', en: 'Waffles' },
      subtitle: { fr: 'Salées', en: 'Savory' },
      label: { fr: 'Gaufres salées', en: 'Savory waffles' },
      theme: 'navy',
      icon: 'waffle',
      unit: { fr: 'recettes', en: 'recipes' },
      groups: [
        {
          items: [
            { id: 'thon-mozzarella', name: { fr: 'Thon mozzarella', en: 'Tuna mozzarella' }, price: 19 },
            { id: 'jambon-mozzarella', name: { fr: 'Jambon mozzarella', en: 'Turkey ham mozzarella' }, price: 17 },
            { id: 'poulet-pesto', name: { fr: 'Poulet pesto mozzarella', en: 'Chicken pesto mozzarella' }, price: 19 },
            { id: 'saumon-mozzarella', name: { fr: 'Saumon mozzarella', en: 'Salmon mozzarella' }, price: 25 },
          ],
        },
      ],
    },
  ],

  // Section « À découvrir » : références "categorie/article".
  FEATURED: [
    'iced-coffee/spanish-americano',
    'burgers/eightin',
    'frappuccino/nutella',
    'brunch/pistachio-nutella-brioche',
    'freshly/strawberry-twist',
    'mojito/blue-curacao',
  ],
};
