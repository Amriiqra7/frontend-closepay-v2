import { AddCircle, Edit2, Eye } from 'iconsax-react';

export const statCards = [
  { title: 'Total Items', value: '128', hint: '+4', tone: '#155DFC', soft: '#f0f4ff', icon: Edit2 },
  { title: 'Avg. Margin', value: '64.2%', hint: 'On Track', tone: '#155DFC', soft: '#f0f4ff', icon: Eye },
  { title: 'Critical Stock', value: '12', hint: '12 items', tone: '#d92d20', soft: '#fdecec', icon: AddCircle },
  { title: 'Public View', value: '114', hint: 'Public View', tone: '#155DFC', soft: '#155DFC', icon: Eye, dark: true },
];

export const products = [
  { id: 1, name: 'Artisan Green Salad', category: 'Starters', price: '$12.50', status: 'Active', tone: '#74c0e3' },
  { id: 2, name: 'Blueberry Peak Pancakes', category: 'Breakfast', price: '$14.00', status: 'Active', tone: '#74c0e3' },
  { id: 3, name: 'Atlantic Grilled Salmon', category: 'Main Course', price: '$28.50', status: 'Drafting', tone: '#f2b07d' },
  { id: 4, name: 'Lava Fudge Cake', category: 'Dessert', price: '$9.00', status: 'Inactive', tone: '#f39a96' },
];

export const ingredients = [
  { name: 'Organic Baby Kale', id: 'ING-0042', qty: '50.00', unit: 'gr', price: '$1.20' },
  { name: 'Heritage Tomato', id: 'ING-0109', qty: '100.00', unit: 'gr', price: '$0.85' },
  { name: 'Balsamic Truffle', id: 'ING-0821', qty: '15.00', unit: 'ml', price: '$1.10' },
];

export const addOnGroups = [
  {
    title: 'Extra Protein',
    badge: 'Optional',
    items: [
      { name: 'Grilled Chicken Breast', price: '+$4.00' },
      { name: 'Smoked Tofu Slices', price: '+$3.50' },
    ],
  },
  {
    title: 'Dressings',
    badge: 'Required (1)',
    items: [
      { name: 'Truffle Balsamic', price: '+$0.00' },
      { name: 'Lemon Tahini', price: '+$0.00' },
    ],
  },
];
