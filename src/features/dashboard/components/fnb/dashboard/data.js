import { Box1, Danger, Flash, TruckFast } from 'iconsax-react';

export const overviewCards = [
  {
    title: 'Total Products',
    value: '1,284',
    note: '+12 this week',
    icon: Box1,
    accent: '#2b6c88',
    iconBg: '#e8f1fb',
    iconColor: '#56728b',
    badge: 'Live',
    badgeColor: '#0f766e',
    borderLeft: 'transparent',
  },
  {
    title: 'Low Stock Alerts',
    value: '18',
    note: 'Needs immediate restock',
    icon: Danger,
    accent: '#cf2e2e',
    iconBg: '#fdeaea',
    iconColor: '#b42318',
    borderLeft: '#cf2e2e',
  },
  {
    title: 'Pending Distribution',
    value: '42',
    note: '8 priority requests',
    icon: TruckFast,
    accent: '#b36a16',
    iconBg: '#fff1df',
    iconColor: '#a16207',
    borderLeft: 'transparent',
  },
  {
    title: "Today's Stock Activity",
    value: '582',
    note: 'Units processed today',
    icon: Flash,
    accent: '#0d7ea1',
    iconBg: '#dff5fb',
    iconColor: '#0e7490',
    borderLeft: 'transparent',
  },
];

export const expiredItems = [
  { name: 'Wagyu Beef Ribeye', meta: 'Batch WBP-204', age: '2 days ago' },
  { name: 'Organic Heavy Cream', meta: 'Batch OHC-1102', age: 'Today' },
  { name: 'Truffle Infused Butter', meta: 'Batch TIF-9921', age: 'Yesterday' },
];

export const stockChartOptions = {
  chart: { type: 'bar', stacked: true, toolbar: { show: false }, fontFamily: 'inherit' },
  states: {
    hover: { filter: { type: 'none' } },
    active: { filter: { type: 'none' } },
  },
  plotOptions: {
    bar: { horizontal: false, columnWidth: '58%', borderRadius: 4, borderRadiusApplication: 'end' },
  },
  legend: {
    position: 'top',
    horizontalAlign: 'right',
    markers: { size: 7, offsetX: -3 },
    labels: { colors: '#5f6b7a' },
  },
  dataLabels: { enabled: false },
  stroke: { width: 0 },
  grid: { borderColor: '#edf1f5', strokeDashArray: 4 },
  xaxis: {
    categories: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: { style: { colors: '#8491a3', fontSize: '11px', fontWeight: 600 } },
  },
  yaxis: { show: false },
  fill: { opacity: 1 },
  colors: ['#c4d0da', '#0d4f63'],
  tooltip: { theme: 'light' },
};

export const stockChartSeries = [
  { name: 'Inbound', data: [38, 54, 49, 46, 63, 21, 16] },
  { name: 'Outbound', data: [19, 25, 14, 27, 22, 12, 9] },
];
