import { Gallery, Shop } from 'iconsax-react';

export const riceOptions = [
  { name: 'Nasi Putih Biasa', sku: 'NS-001', price: 'Rp 0', status: 'Active', tone: 'info' },
  { name: 'Nasi Daun Jeruk', sku: 'NS-002', price: '+ Rp 3,000', status: 'Active', tone: 'info' },
  { name: 'Nasi Merah Organik', sku: 'NS-003', price: '+ Rp 5,000', status: 'Low Stock', tone: 'warning' },
];

export const addOnGroups = [
  {
    title: 'Dressing',
    subtitle: 'Choice of 2 max',
    icon: Gallery,
    iconBg: '#ffe5d1',
    iconColor: '#99501f',
    addLabel: '+ Add Dressing Option',
    options: [
      { name: 'Roasted Sesame', price: '+ Rp 0' },
      { name: 'Honey Mustard', price: '+ Rp 2,000' },
      { name: 'Spicy Mayo', price: '+ Rp 0' },
    ],
  },
  {
    title: 'Extra Protein',
    subtitle: 'Multiple selection - Unlimited',
    icon: Shop,
    iconBg: '#d8e9fb',
    iconColor: '#244b71',
    addLabel: '+ Add Protein Option',
    options: [
      { name: 'Grilled Chicken 100g', price: '+ Rp 18,000', badge: 'Premium' },
      { name: 'Soft Boiled Egg', price: '+ Rp 8,000' },
      { name: 'Smoked Beef Strips', price: '+ Rp 12,000' },
    ],
  },
];
