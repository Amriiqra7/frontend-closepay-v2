import { Box1, Gallery, SunFog } from 'iconsax-react';

export const ingredients = [
  { id: 'BAH-001', name: 'Wagyu Ribeye MB9+', quantity: '250', unit: 'grams' },
  { id: 'BAH-082', name: 'Maldon Sea Salt', quantity: '5', unit: 'grams' },
  { id: 'BAH-115', name: 'Fresh Rosemary', quantity: '2', unit: 'sprigs' },
  { id: 'BAH-204', name: 'Unsalted French Butter', quantity: '30', unit: 'grams' },
];

export const recipeSteps = [
  {
    number: 1,
    title: 'Preparation & Seasoning',
    duration: '5 mins',
    description:
      'Pat the wagyu ribeye completely dry with paper towels. Generously season all sides with Maldon sea salt and fresh cracked black pepper before resting at room temperature.',
    media: [
      { type: 'image', icon: Gallery, theme: 'salt' },
      { type: 'placeholder', label: 'Add reference photo' },
    ],
  },
  {
    number: 2,
    title: 'The Hard Sear',
    duration: '4 mins',
    description:
      'Heat a heavy cast-iron skillet over high heat until smoking. Place the steak on its side fat-cap first to render the fat, then sear each side for 2 minutes until a deep mahogany crust forms.',
    media: [
      { type: 'image', icon: SunFog, theme: 'smoke' },
      { type: 'image', icon: Box1, theme: 'pan' },
    ],
  },
  {
    number: 3,
    title: 'Butter Basting & Resting',
    duration: '10 mins',
    description:
      'Reduce heat to medium-low. Add butter, smashed garlic, and rosemary. Tilt the pan and continuously spoon the foaming butter over the steak for 2 more minutes. Remove and rest for 8 minutes before slicing.',
    media: [],
  },
];

export const menuMeta = {
  title: 'Pan-Seared Wagyu Ribeye',
  sku: 'PRD-WGY-001',
  category: 'Main Course / Premium Steak',
  updatedAt: 'Oct 24, 2023',
};

export const documentationCard = {
  title: 'Final Result Documentation',
  caption: 'Last Updated',
};
