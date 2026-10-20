/*
 * Eight'In Flour & Coffee — contenu du menu.
 * C'est le seul fichier à modifier pour changer un prix ou ajouter une boisson.
 * Prix en dinars tunisiens (DT).
 *
 * Source : panneaux menu photographiés en boutique + page Instagram @eightincoffee.
 */
window.EIGHTIN = {
  SITE: {
    instagram: 'eightincoffee',
    // Recherche Google Maps : à remplacer par le lien « Partager » de la fiche Google Maps officielle.
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Eight%27In+Flour+and+Coffee+Boumhal',
  },

  // Thèmes de carte : 'navy' | 'sky' | 'mint' (couleurs Instagram).
  // Icônes disponibles : iced, frappe, shake, smoothie, mojito, cocktail, classic, croissant.
  MENU: [
    {
      id: 'iced-coffee',
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
    {
      id: 'flour',
      name: 'Flour',
      subtitle: 'Sweets & Savory',
      theme: 'sky',
      icon: 'croissant',
      soon: 'Croissants, sweets & savory : la carte arrive bientôt sur le site. En attendant, découvrez-les en boutique et sur notre Instagram.',
      groups: [],
    },
  ],

  // Section « À découvrir » : références "catégorie/boisson".
  FEATURED: [
    'iced-coffee/spanish-americano',
    'smoothie/passion-fruit',
    'frappuccino/nutella',
    'freshly/strawberry-twist',
    'mojito/blue-curacao',
    'milkshake/salted-caramel',
  ],
};
