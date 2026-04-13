export const distributionStats = [
  { label: 'Pending Requests', value: '12', tone: '#0d4f63', accent: '#b9e5fb' },
  { label: 'In Transit', value: '08', tone: '#8a4b08', accent: '#ffe7c2' },
  { label: 'Total Fulfilled', value: '1,429', tone: '#64748b', accent: '#e2e8f0' },
  { label: 'Canceled Items', value: '03', tone: '#d92d20', accent: '#ffe0dc' },
];

export const requests = [
  {
    outlet: 'Grand Metropolitan Bistro',
    city: 'Bekasi City, West Java',
    fulfillmentPoint: 'WH-North Jakarta',
    requestList: [
      'Premium Wagyu A5 - 12 kg',
      'Truffle Oil 250ml - 5 units',
      '+3 more items',
    ],
    invoice: 'doc',
    status: 'Accepted',
    statusTone: 'info',
    actions: 'approve',
  },
  {
    outlet: 'Senayan Urban Grill',
    city: 'Central Jakarta',
    fulfillmentPoint: 'WH-South Tangerang',
    requestList: [
      'Brioche Buns XL - 200 units',
      'Cheddar Blocks - 10 kg',
    ],
    invoice: 'doc',
    status: 'Shipped',
    statusTone: 'warning',
    actions: 'track',
  },
  {
    outlet: 'Bali Cliff Resort F&B',
    city: 'Uluwatu, Bali',
    fulfillmentPoint: 'WH-East Java Central',
    requestList: ['Champagne Vintage - 24 btls'],
    invoice: 'N/A',
    status: 'Declined',
    statusTone: 'danger',
    actions: 'info',
  },
  {
    outlet: 'Pacific Place Deli',
    city: 'Sudirman, Jakarta',
    fulfillmentPoint: 'WH-North Jakarta',
    requestList: [
      'Whole Salmon - 45 kg',
      'Sea Salt Grinder - 12 units',
    ],
    invoice: 'doc',
    status: 'Received',
    statusTone: 'muted',
    actions: 'done',
  },
  {
    outlet: 'Surabaya Heritage Hotel',
    city: 'Surabaya, East Java',
    fulfillmentPoint: 'WH-East Java Central',
    requestList: ['Arabica Beans - 50 kg'],
    invoice: 'N/A',
    status: 'Canceled',
    statusTone: 'neutral',
    actions: 'reorder',
  },
];

export const optimizationStats = [
  { label: 'Cold Chain', value: '-18.4C', hint: 'Stable' },
  { label: 'Stock Turn', value: '4.2x', hint: 'Optimal' },
  { label: 'Drivers', value: '12/15', hint: 'On Route' },
];
