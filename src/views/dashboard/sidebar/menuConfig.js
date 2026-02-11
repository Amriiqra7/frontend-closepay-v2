import {
  Home2,
  Buildings2,
  ShieldSecurity,
  Notification,
  KeySquare,
  Setting2,
  DocumentText,
  Sms,
  Monitor,
} from 'iconsax-react';

/**
 * Sidebar menu config (single source of truth).
 * Keep this file UI-agnostic: only data + icon references.
 */
export const SIDEBAR_SECTIONS = [
  {
    id: 'manajemen',
    label: 'MANAJEMEN',
    items: [
      {
        id: 'monitor-admin-dashboard',
        label: 'Monitor Admin Dashboard',
        href: '/monitor-admin-dashboard',
        icon: Monitor,
      },
      {
        id: 'perusahaan',
        label: 'Perusahaan',
        href: '/company',
        icon: Buildings2,
      },
      {
        id: 'role',
        label: 'Role',
        href: '/role',
        icon: ShieldSecurity,
        children: [
          {
            id: 'role-data-izin',
            label: 'Data Izin Akses',
            href: '/role/data-izin-akses',
            icon: KeySquare,
          },
          {
            id: 'role-data-role',
            label: 'Data Role',
            href: '/role/data-role',
            icon: DocumentText,
          },
        ],
      },
      {
        id: 'notifikasi',
        label: 'Notifikasi',
        href: '/notifikasi',
        icon: Notification,
        children: [
          {
            id: 'notif-kategori-template',
            label: 'Kategori Template',
            href: '/notifikasi/kategori-template',
            icon: Setting2,
          },
          {
            id: 'notif-template',
            label: 'Template',
            href: '/notifikasi/template',
            icon: DocumentText,
          },
          {
            id: 'notif-zepto',
            label: 'Jumlah Email Zepto',
            href: '/notifikasi/jumlah-email-zepto',
            icon: Sms,
          },
        ],
      },
    ],
  },
];

