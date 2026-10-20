/*
 * Eight'In Flour & Coffee — contenu du menu.
 * C'est le seul fichier à modifier pour changer un prix ou ajouter un article.
 *
 * Source : panneaux et carte photographiés en boutique + page Instagram @eightincoffee.
 */
window.EIGHTIN = {
  SITE: {
    instagram: 'eightincoffee',
    // Lien de la fiche Google Maps (lien en bio Instagram, sans paramètres de suivi).
    mapsUrl: 'https://maps.app.goo.gl/udovAyAhgXNVn44n8',
  },

  // Onglets du menu, dans l'ordre de la carte imprimée. kind : 'drink' | 'food' (compteurs "À propos").
  SECTIONS: [
    { id: 'drinks', label: 'Boissons', kind: 'drink' },
    { id: 'sweet', label: 'Sweet & Brunch', kind: 'food' },
    { id: 'savory', label: 'Savory', kind: 'food' },
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
      unit: 'boissons',
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
      unit: 'saveurs',
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
      unit: 'saveurs',
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
      unit: 'recettes',
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
      unit: 'saveurs',
      note: 'Sans alcool',
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
      unit: 'créations',
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
      unit: 'boissons',
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
      subtitle: 'Sucrées',
      label: 'Crêpes sucrées',
      theme: 'navy',
      icon: 'crepe',
      unit: 'recettes',
      groups: [
        {
          items: [
            { id: 'nutella', name: 'Nutella', price: 15 },
            { id: 'nutella-caramel', name: 'Nutella caramel beurre salé', price: 16 },
            { id: 'nutella-pistache', name: 'Nutella pistache', price: 19 },
            { id: 'ferrero', name: 'Ferrero Rocher', price: 14 },
          ],
        },
      ],
    },
    {
      id: 'gaufres-sucrees',
      section: 'sweet',
      name: 'Gaufres',
      subtitle: 'Sucrées',
      label: 'Gaufres sucrées',
      theme: 'sky',
      icon: 'waffle',
      unit: 'recettes',
      groups: [
        {
          items: [
            { id: 'nutella', name: 'Nutella', price: 15 },
            { id: 'nutella-caramel', name: 'Nutella caramel beurre salé', price: 16 },
            { id: 'nutella-pistache', name: 'Nutella pistache', price: 19 },
            { id: 'ferrero', name: 'Ferrero Rocher', price: 14 },
          ],
        },
      ],
    },
    {
      id: 'brunch',
      section: 'sweet',
      name: 'Brunch',
      subtitle: 'De 8h à 14h',
      theme: 'mint',
      icon: 'croissant',
      unit: 'formules',
      note: 'Tous les brunchs sont servis avec un jus et un café.',
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
      subtitle: 'Chaque jour en vitrine',
      theme: 'navy',
      icon: 'cookie',
      info: 'Une sélection de douceurs fraîchement préparées, livrées chaque jour au comptoir : brownies, brookies, cookies, tarte au lemon curd, cakes… Venez voir la vitrine !',
      groups: [],
    },

    /* ---------------- Savory ---------------- */
    {
      id: 'omelettes',
      section: 'savory',
      name: 'Omelettes',
      theme: 'navy',
      icon: 'egg',
      unit: 'recettes',
      groups: [
        {
          items: [
            { id: 'mozzarella', name: 'Mozzarella', price: 12 },
            { id: 'thon-mozzarella', name: 'Thon mozzarella', price: 15 },
            { id: 'jambon-mozzarella', name: 'Jambon mozzarella', price: 15 },
          ],
        },
      ],
    },
    {
      id: 'crepes-salees',
      section: 'savory',
      name: 'Crêpes',
      subtitle: 'Salées',
      label: 'Crêpes salées',
      theme: 'sky',
      icon: 'crepe',
      unit: 'recettes',
      groups: [
        {
          items: [
            { id: 'thon-mozzarella', name: 'Thon mozzarella', price: 14 },
            { id: 'thon-mozzarella-oeuf', name: 'Thon mozzarella œuf', price: 15 },
            { id: 'jambon-mozzarella', name: 'Jambon mozzarella', price: 14 },
            { id: 'poulet-pesto', name: 'Poulet pesto mozzarella', price: 18 },
            { id: 'saumon-mozzarella', name: 'Saumon mozzarella', price: 24 },
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
      unit: 'burgers',
      groups: [
        {
          items: [
            { id: 'classic', name: 'Classic Burger', price: 20 },
            { id: 'grilled-chicken', name: 'Grilled Chicken Burger', price: 17 },
            { id: 'fried-chicken', name: 'Fried Chicken Burger', price: 19 },
            { id: 'eightin', name: 'Eight’In Burger', desc: 'Bresaola & œuf', price: 25 },
          ],
        },
      ],
    },
    {
      id: 'gaufres-salees',
      section: 'savory',
      name: 'Gaufres',
      subtitle: 'Salées',
      label: 'Gaufres salées',
      theme: 'navy',
      icon: 'waffle',
      unit: 'recettes',
      groups: [
        {
          items: [
            { id: 'thon-mozzarella', name: 'Thon mozzarella', price: 19 },
            { id: 'jambon-mozzarella', name: 'Jambon mozzarella', price: 17 },
            { id: 'poulet-pesto', name: 'Poulet pesto mozzarella', price: 19 },
            { id: 'saumon-mozzarella', name: 'Saumon mozzarella', price: 25 },
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
