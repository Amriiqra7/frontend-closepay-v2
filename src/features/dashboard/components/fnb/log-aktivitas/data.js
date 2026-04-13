export const expiredTrackingItems = [
  {
    title: 'Expired Today',
    value: '12',
    description: 'Immediate disposal or write-off required for batch #BAH-029.',
    highlight: true,
  },
  { title: 'Expiring in 7 Days', value: '45 items' },
  { title: 'Expiring in 14 Days', value: '128 items' },
  { title: 'Expiring in 30 Days', value: '210 items' },
];

export const activityLogs = [
  {
    type: 'Inbound',
    tone: 'info',
    item: 'WGY-RIB-09 Wagyu Ribeye MB9+',
    location: 'Cold Storage A',
    locationMeta: 'Zone 4 - Rack 1',
    description: 'Received from Australian Prime Meats. Batch verified.',
  },
  {
    type: 'Outbound',
    tone: 'neutral',
    item: 'TRF-OIL-02 Olive Pomace 500ml',
    location: 'Dry Pantry',
    locationMeta: 'Shelf D - 12',
    description: 'Distribution to SCBD branch. DO #SCBD-89.',
  },
  {
    type: 'Expired',
    tone: 'danger',
    item: 'ORG-MLK-01 Organic Whole Milk',
    location: 'Cold Storage C',
    locationMeta: 'Fridge 2 - Shelf',
    description: 'Auto-flagged. Expiration reached on 2026-04-12.',
  },
  {
    type: 'Inbound',
    tone: 'info',
    item: 'SHA-SRF-22 Sea Salt Flakes',
    location: 'Secure Store',
    locationMeta: 'Safe - Lot 08',
    description: 'Import restock. Custom ref #IMP-SAFF-88.',
  },
  {
    type: 'Outbound',
    tone: 'neutral',
    item: 'CHE-PAR-10 Parmigiano Reggiano',
    location: 'Cheese Cellar',
    locationMeta: 'Rack A - 14',
    description: 'Kitchen pull for Banquet #9821.',
  },
];

export const proximityAlerts = [
  { name: 'Microgreen Assortment', meta: 'Batch MH-982', date: 'Nov 15, 2026', badge: 'Expired' },
  { name: 'Heavy Cream 35% (Bulk)', meta: 'Batch HC-210', date: 'Nov 25, 2026', badge: '3 days left' },
  { name: 'Atlantic Salmon Fillet', meta: 'Batch ASL-400', date: 'Dec 4, 2026', badge: '12 days left' },
  { name: 'Extra Virgin Olive Oil', meta: 'Batch EVO-15', date: 'Dec 21, 2026', badge: '19 days left' },
];

export const liveUpdates = [
  'New: Outbound transfer of 40kg Wagyu beef completed at Pusat Warehouse',
  'Critical: Batch #BAH-029 microgreens moved to quarantine zone due to expiration',
  'System: Inventory sync completed across central warehouse nodes',
];
