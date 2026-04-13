import { Box1, ClipboardText, Shop } from 'iconsax-react';

export const integrityStats = [
  {
    label: 'Accuracy Rate',
    value: '98.4%',
    icon: ClipboardText,
  },
  {
    label: 'Last Check',
    value: '24h ago',
    icon: Shop,
  },
];

export const stockOpnameHistory = [
  {
    id: 'opname-1',
    date: 'Oct 24, 2023',
    time: '09:45 AM',
    itemName: 'Wagyu Ribeye A5',
    itemCode: 'PROD-992-K',
    qty: '12.5',
    unit: 'kg',
    unitPrice: '$145.00',
    expiry: 'Nov 12, 2023',
    description: 'Regular monthly audit for chilled premium meat stock.',
    status: 'Verified',
    tone: 'info',
    icon: Box1,
  },
  {
    id: 'opname-2',
    date: 'Oct 23, 2023',
    time: '14:20 PM',
    itemName: 'Truffle Oil Gold',
    itemCode: 'OIL-042-S',
    qty: '4',
    unit: 'ltr',
    unitPrice: '$82.50',
    expiry: 'Expired',
    description: 'Found damaged seal on premium bottle during inspection.',
    status: 'Flagged',
    tone: 'warning',
    icon: Shop,
  },
  {
    id: 'opname-3',
    date: 'Oct 22, 2023',
    time: '08:15 AM',
    itemName: 'Saffron Stigma',
    itemCode: 'SPICE-881',
    qty: '500',
    unit: 'gr',
    unitPrice: '$2,400.00',
    expiry: 'Dec 2024',
    description: 'High value item verified and returned to secure vault rack.',
    status: 'Verified',
    tone: 'info',
    icon: ClipboardText,
  },
];
