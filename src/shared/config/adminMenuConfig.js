import {
  Home2,
  Setting2,
  Wallet3,
  DocumentText,
  Receipt21,
  Shop,
  CardSend,
  MoneyRecive,
  Buildings2,
  Money4,
  InfoCircle,
  Game,
  Eye,
  Trash,
  Book,
  Code1,
  Hierarchy,
  TransactionMinus,
  Flash,
  Profile2User,
  Profile,
  Bank,
  Document,
  ShopAdd,
  Card,
  MoneySend,
  Box,
  Gift,
  Notification,
  NotificationBing,
  Calendar,
  Monitor,
  FingerScan,
  Lock,
  Lock1,
  MoneyAdd,
  MoneyTick,
  User,
  MenuBoard,
  WalletAdd,
  WalletCheck,
  DocumentCopy,
  DocumentDownload,
  ReceiptSearch,
  ReceiptEdit,
} from 'iconsax-react';

/**
 * Global Menu Definitions
 * Define each menu item once, then reference it everywhere
 * This ensures consistency across all menu locations
 */
const GLOBAL_MENU_ITEMS = {
  // Data User related menus
  'data-user': {
    id: 'data-user',
    label: 'Data User',
    href: '/admin/utama/data-user',
    icon: User,
  },
  'user-admin': {
    id: 'user-admin',
    label: 'User Admin',
    href: '/admin/utama/data-user/user-admin',
    icon: Profile2User,
  },
  'user-member': {
    id: 'user-member',
    label: 'User Member',
    href: '/admin/utama/data-user/user-member',
    icon: Profile,
    children: [
      {
        id: 'data-user-member',
        label: 'Data user',
        href: '/admin/utama/data-user/user-member/data-user',
        icon: Profile, // Use same icon as parent
      },
      {
        id: 'konfig-user-member',
        label: 'Konfig User',
        href: '/admin/utama/data-user/user-member/konfig-user-member',
        icon: Profile, // Use same icon as parent
      },
      {
        id: 'log-aktivitas-login',
        label: 'Log Aktivitas login',
        href: '/admin/utama/data-user/user-member/log-aktivitas-login',
        icon: Profile, // Use same icon as parent
      },
    ],
  },
  'data-user-member': {
    id: 'data-user-member',
    label: 'Data user',
    href: '/admin/utama/data-user/user-member/data-user',
    icon: Profile,
  },
  'konfig-user-member': {
    id: 'konfig-user-member',
    label: 'Konfig User',
    href: '/admin/utama/data-user/user-member/konfig-user-member',
    icon: Profile,
  },
  'log-aktivitas-login': {
    id: 'log-aktivitas-login',
    label: 'Log Aktivitas login',
    href: '/admin/utama/data-user/user-member/log-aktivitas-login',
    icon: Profile,
  },
  'user-merchant': {
    id: 'user-merchant',
    label: 'User Merchant',
    href: '/admin/utama/data-user/user-merchant',
    icon: Shop,
    children: [
      {
        id: 'data-user-merchant',
        label: 'Data User',
        href: '/admin/utama/data-user/user-merchant/data-user',
        icon: Shop, // Use same icon as parent
      },
      {
        id: 'konfig-user-merchant',
        label: 'Konfig user',
        href: '/admin/utama/data-user/user-merchant/konfig-user',
        icon: Shop, // Use same icon as parent
      },
    ],
  },
  'data-user-merchant': {
    id: 'data-user-merchant',
    label: 'Data User',
    href: '/admin/utama/data-user/user-merchant/data-user',
    icon: Shop,
  },
  'konfig-user-merchant': {
    id: 'konfig-user-merchant',
    label: 'Konfig user',
    href: '/admin/utama/data-user/user-merchant/konfig-user',
    icon: Shop,
  },
  // Other menus
  'data-perusahaan': {
    id: 'data-perusahaan',
    label: 'Data Perusahaan',
    href: '/admin/utama/data-perusahaan',
    icon: Buildings2,
  },
  'personalisasi-perusahaan': {
    id: 'personalisasi-perusahaan',
    label: 'Personalisasi Perusahaan',
    href: '/admin/utama/personalisasi-perusahaan',
    icon: Setting2,
  },
  'data-menu': {
    id: 'data-menu',
    label: 'Data Menu',
    href: '/admin/utama/data-menu',
    icon: MenuBoard,
  },
  'data-saldo': {
    id: 'data-saldo',
    label: 'Data Saldo',
    href: '/admin/balance/data-saldo',
    icon: Wallet3,
  },
  'data-mutasi': {
    id: 'data-mutasi',
    label: 'Data Mutasi',
    href: '/admin/balance/data-mutasi',
    icon: MoneyRecive,
  },
  'rekening-perusahaan': {
    id: 'rekening-perusahaan',
    label: 'Rekening Perusahaan',
    href: '/admin/balance/rekening-perusahaan',
    icon: Bank,
  },
  'konfigurasi-saldo': {
    id: 'konfigurasi-saldo',
    label: 'Konfigurasi Saldo',
    href: '/admin/balance/konfigurasi-saldo',
    icon: WalletAdd,
  },
  'data-log-va': {
    id: 'data-log-va',
    label: 'Data Log VA',
    href: '/admin/balance/data-log-va',
    icon: Document,
  },
  'tagihan-master': {
    id: 'tagihan-master',
    label: 'Tagihan Master',
    href: '/admin/invoice/tagihan-master',
    icon: DocumentText,
  },
  'tagihan-tunggal': {
    id: 'tagihan-tunggal',
    label: 'Tagihan Tunggal',
    href: '/admin/invoice/tagihan-tunggal',
    icon: Document,
  },
  'data-tagihan': {
    id: 'data-tagihan',
    label: 'Data Tagihan',
    href: '/admin/invoice/data-tagihan',
    icon: DocumentCopy,
  },
  'atur-petugas-retribusi': {
    id: 'atur-petugas-retribusi',
    label: 'Atur Petugas Retribusi',
    href: '/admin/retribusi/atur-petugas-retribusi',
    icon: User,
  },
  'kode-qr-merchant': {
    id: 'kode-qr-merchant',
    label: 'Kode QR Merchant',
    href: '/admin/retribusi/kode-qr-merchant',
    icon: Eye,
  },
  'konfigurasi-template-retribusi': {
    id: 'konfigurasi-template-retribusi',
    label: 'Konfigurasi Template Retribusi',
    href: '/admin/retribusi/konfigurasi-template-retribusi',
    icon: ReceiptEdit,
  },
  'data-tagihan-retribusi': {
    id: 'data-tagihan-retribusi',
    label: 'Data Tagihan Retribusi',
    href: '/admin/retribusi/data-tagihan-retribusi',
    icon: ReceiptSearch,
  },
  'merchant-bagi-hasil': {
    id: 'merchant-bagi-hasil',
    label: 'Merchant Bagi Hasil',
    href: '/admin/merchant-kso/merchant-bagi-hasil',
    icon: ShopAdd,
  },
  'ketentuan-kartu': {
    id: 'ketentuan-kartu',
    label: 'Ketentuan Kartu',
    href: '/admin/virtual-card/ketentuan-kartu',
    icon: DocumentText,
  },
  'kustom-template-kartu-virtual': {
    id: 'kustom-template-kartu-virtual',
    label: 'Kustom Template Kartu Virtual',
    href: '/admin/virtual-card/kustom-template-kartu-virtual',
    icon: Card,
  },
  'biaya-admin-kartu': {
    id: 'biaya-admin-kartu',
    label: 'Biaya Admin Kartu',
    href: '/admin/virtual-card/biaya-admin-kartu',
    icon: Money4,
  },
  'data-kartu-virtual': {
    id: 'data-kartu-virtual',
    label: 'Data Kartu Virtual',
    href: '/admin/virtual-card/data-kartu-virtual',
    icon: Card,
  },
  'data-transaksi-kartu': {
    id: 'data-transaksi-kartu',
    label: 'Data Transaksi Kartu',
    href: '/admin/virtual-card/data-transaksi-kartu',
    icon: CardSend,
  },
  'konfigurasi-checkoutlink': {
    id: 'konfigurasi-checkoutlink',
    label: 'Konfigurasi Checkoutlink',
    href: '/admin/payment-gateway/konfigurasi-checkoutlink',
    icon: Setting2,
  },
  'konfigurasi-saldo-payment': {
    id: 'konfigurasi-saldo-payment',
    label: 'Konfigurasi Saldo',
    href: '/admin/payment-gateway/konfigurasi-saldo',
    icon: WalletCheck,
  },
  'data-marketplace': {
    id: 'data-marketplace',
    label: 'Data Marketplace',
    href: '/admin/marketplace/data-marketplace',
    icon: Shop,
  },
  'data-kasir': {
    id: 'data-kasir',
    label: 'Data Kasir',
    href: '/admin/marketplace/data-kasir',
    icon: ShopAdd,
  },
  'data-produk': {
    id: 'data-produk',
    label: 'Data Produk',
    href: '/admin/marketplace/data-produk',
    icon: Box,
  },
  'data-donasi': {
    id: 'data-donasi',
    label: 'Data Donasi',
    href: '/admin/donasi-zakat/data-donasi',
    icon: Gift,
  },
  'data-zakat': {
    id: 'data-zakat',
    label: 'Data Zakat',
    href: '/admin/donasi-zakat/data-zakat',
    icon: Money4,
  },
  'data-info': {
    id: 'data-info',
    label: 'Data Info',
    href: '/admin/info-berita/data-info',
    icon: InfoCircle,
  },
  'data-berita': {
    id: 'data-berita',
    label: 'Data Berita',
    href: '/admin/info-berita/data-berita',
    icon: DocumentText,
  },
  'data-push-notification': {
    id: 'data-push-notification',
    label: 'Data Push Notification',
    href: '/admin/info-berita/data-push-notification',
    icon: NotificationBing,
  },
  'data-riwayat-notifikasi': {
    id: 'data-riwayat-notifikasi',
    label: 'Data Riwayat Notifikasi',
    href: '/admin/info-berita/data-riwayat-notifikasi',
    icon: Notification,
  },
  'data-penyewaan': {
    id: 'data-penyewaan',
    label: 'Data Penyewaan',
    href: '/admin/sport-center/data-penyewaan',
    icon: Calendar,
  },
  'data-fnb': {
    id: 'data-fnb',
    label: 'Data FnB',
    href: '/admin/fnb/data-fnb',
    icon: Shop,
  },
  'data-perangkat': {
    id: 'data-perangkat',
    label: 'Data Perangkat',
    href: '/admin/aksesibilitas/data-perangkat',
    icon: Monitor,
  },
  'data-presensi-akses': {
    id: 'data-presensi-akses',
    label: 'Data Presensi',
    href: '/admin/aksesibilitas/data-presensi',
    icon: Calendar,
  },
  'data-akses': {
    id: 'data-akses',
    label: 'Data Akses',
    href: '/admin/aksesibilitas/data-akses',
    icon: FingerScan,
  },
  'data-bank-sampah': {
    id: 'data-bank-sampah',
    label: 'Data Bank Sampah',
    href: '/admin/bank-sampah/data-bank-sampah',
    icon: Trash,
  },
  'data-presensi-payroll': {
    id: 'data-presensi-payroll',
    label: 'Data Presensi',
    href: '/admin/payroll/data-presensi',
    icon: Calendar,
  },
  'data-pembayaran-karyawan': {
    id: 'data-pembayaran-karyawan',
    label: 'Data Pembayaran Karyawan',
    href: '/admin/payroll/data-pembayaran-karyawan',
    icon: MoneyTick,
  },
  'buat-payroll': {
    id: 'buat-payroll',
    label: 'Buat Payroll',
    href: '/admin/payroll/buat-payroll',
    icon: DocumentDownload,
  },
  'data-lms': {
    id: 'data-lms',
    label: 'Data LMS',
    href: '/admin/lms/data-lms',
    icon: Book,
  },
  'pengaturan-credentials': {
    id: 'pengaturan-credentials',
    label: 'Pengaturan Credentials',
    href: '/admin/integrasi/pengaturan-credentials',
    icon: Lock,
  },
  'riwayat-callback': {
    id: 'riwayat-callback',
    label: 'Riwayat Callback',
    href: '/admin/integrasi/riwayat-callback',
    icon: Code1,
  },
  'manajemen-sub-company': {
    id: 'manajemen-sub-company',
    label: 'Manajemen Sub-Company',
    href: '/admin/sub-company/manajemen-sub-company',
    icon: Hierarchy,
  },
  'transaksi-qriss': {
    id: 'transaksi-qriss',
    label: 'Transaksi Qriss',
    href: '/admin/transaksi/transaksi-qriss',
    icon: Eye,
  },
  'transaksi-barcode': {
    id: 'transaksi-barcode',
    label: 'Transaksi Barcode',
    href: '/admin/transaksi/transaksi-barcode',
    icon: Eye,
  },
  'top-up-member-via-merchant': {
    id: 'top-up-member-via-merchant',
    label: 'Top Up Member Via Merchant',
    href: '/admin/transaksi/top-up-member-via-merchant',
    icon: MoneyAdd,
  },
  'top-up-user-manual': {
    id: 'top-up-user-manual',
    label: 'Top Up User Manual',
    href: '/admin/transaksi/top-up-user-manual',
    icon: MoneyRecive,
  },
  'pencairan-user-manual': {
    id: 'pencairan-user-manual',
    label: 'Pencairan User Manual',
    href: '/admin/transaksi/pencairan-user-manual',
    icon: MoneySend,
  },
  'va-debit': {
    id: 'va-debit',
    label: 'VA Debit',
    href: '/admin/transaksi/va-debit',
    icon: Bank,
  },
  'manajemen-ppob': {
    id: 'manajemen-ppob',
    label: 'Manajemen PPOB',
    href: '/admin/ppob/manajemen-ppob',
    icon: Flash,
  },
};

/**
 * Helper function to get menu item by ID
 * Returns a deep copy to prevent mutations
 */
const getMenuItem = (menuId) => {
  const menu = GLOBAL_MENU_ITEMS[menuId];
  if (!menu) return null;
  
  // Deep clone to prevent mutations (preserving React components)
  const clone = {
    ...menu,
    icon: menu.icon, // Preserve React component reference
  };
  
  if (menu.children) {
    clone.children = menu.children.map(child => {
      const childClone = {
        ...child,
        icon: child.icon, // Preserve React component reference
      };
      // Recursively clone children if they exist
      if (child.children) {
        childClone.children = child.children.map(grandChild => ({
          ...grandChild,
          icon: grandChild.icon,
        }));
      }
      return childClone;
    });
  }
  
  return clone;
};

/**
 * Helper function to get menu items by IDs
 */
const getMenuItems = (menuIds) => {
  return menuIds.map(id => getMenuItem(id)).filter(Boolean);
};

/**
 * Konfigurasi menu admin berdasarkan deskripsi
 * Setiap menu memiliki sub-menu yang akan ditampilkan di sidebar
 */
export const ADMIN_MENU_CONFIG = {
  utama: {
    id: 'utama',
    label: 'Utama',
    icon: Home2,
    description: 'Data Perusahaan, Data User, Personalisasi Perusahaan, Data Menu',
    subMenus: [
      getMenuItem('data-perusahaan'),
      {
        ...getMenuItem('data-user'),
        children: [
          getMenuItem('user-admin'),
          {
            ...getMenuItem('user-member'),
            children: getMenuItem('user-member').children, // Use children from global definition
          },
          {
            ...getMenuItem('user-merchant'),
            children: getMenuItem('user-merchant').children, // Use children from global definition
          },
        ],
      },
      getMenuItem('personalisasi-perusahaan'),
      getMenuItem('data-menu'),
    ],
  },
  advance: {
    id: 'advance',
    label: 'Advance',
    icon: Setting2,
    description: 'Semua Fitur ditampilkan',
    subMenus: [
      // Menu dari Utama
      getMenuItem('data-perusahaan'),
      {
        ...getMenuItem('data-user'),
        children: [
          getMenuItem('user-admin'),
          {
            ...getMenuItem('user-member'),
            children: getMenuItem('user-member').children, // Use children from global definition
          },
          {
            ...getMenuItem('user-merchant'),
            children: getMenuItem('user-merchant').children, // Use children from global definition
          },
        ],
      },
      // Note: user-admin, user-member, data-user-member, etc. are already included as children of data-user above
      // so they don't need to be listed separately here
      getMenuItem('personalisasi-perusahaan'),
      getMenuItem('data-menu'),
      // Menu dari Balance
      getMenuItem('data-saldo'),
      getMenuItem('data-mutasi'),
      getMenuItem('rekening-perusahaan'),
      getMenuItem('konfigurasi-saldo'),
      getMenuItem('data-log-va'),
      // Menu dari Invoice
      getMenuItem('tagihan-master'),
      getMenuItem('tagihan-tunggal'),
      getMenuItem('data-tagihan'),
      // Menu dari Retribusi
      getMenuItem('atur-petugas-retribusi'),
      getMenuItem('kode-qr-merchant'),
      getMenuItem('konfigurasi-template-retribusi'),
      getMenuItem('data-tagihan-retribusi'),
      // Menu dari Merchant KSO
      getMenuItem('merchant-bagi-hasil'),
      // Menu dari Virtual Card
      getMenuItem('ketentuan-kartu'),
      getMenuItem('kustom-template-kartu-virtual'),
      getMenuItem('biaya-admin-kartu'),
      getMenuItem('data-kartu-virtual'),
      getMenuItem('data-transaksi-kartu'),
      // Menu dari Payment Gateway
      getMenuItem('konfigurasi-checkoutlink'),
      getMenuItem('konfigurasi-saldo-payment'),
      // Menu dari Marketplace
      getMenuItem('data-marketplace'),
      getMenuItem('data-kasir'),
      getMenuItem('data-produk'),
      // Menu dari Donasi Zakat
      getMenuItem('data-donasi'),
      getMenuItem('data-zakat'),
      // Menu dari Info Berita
      getMenuItem('data-info'),
      getMenuItem('data-berita'),
      getMenuItem('data-push-notification'),
      getMenuItem('data-riwayat-notifikasi'),
      // Menu dari Sport Center
      getMenuItem('data-penyewaan'),
      // Menu dari FnB
      getMenuItem('data-fnb'),
      // Menu dari Aksesibilitas
      getMenuItem('data-perangkat'),
      getMenuItem('data-presensi-akses'),
      getMenuItem('data-akses'),
      // Menu dari Bank Sampah
      getMenuItem('data-bank-sampah'),
      // Menu dari Payroll
      getMenuItem('data-presensi-payroll'),
      getMenuItem('data-pembayaran-karyawan'),
      getMenuItem('buat-payroll'),
      // Menu dari LMS
      getMenuItem('data-lms'),
      // Menu dari Integrasi
      getMenuItem('pengaturan-credentials'),
      getMenuItem('riwayat-callback'),
      // Menu dari Sub-Company
      getMenuItem('manajemen-sub-company'),
      // Menu dari Transaksi
      getMenuItem('transaksi-qriss'),
      getMenuItem('transaksi-barcode'),
      getMenuItem('top-up-member-via-merchant'),
      getMenuItem('top-up-user-manual'),
      getMenuItem('pencairan-user-manual'),
      getMenuItem('va-debit'),
      // Menu dari PPOB
      getMenuItem('manajemen-ppob'),
    ],
  },
  balance: {
    id: 'balance',
    label: 'Manajemen Saldo',
    icon: Wallet3,
    description: 'Data Saldo, Data Mutasi, Rekening Perusahaan, Konfigurasi Saldo, Data Log VA',
    subMenus: [
      getMenuItem('data-saldo'),
      getMenuItem('data-mutasi'),
      getMenuItem('rekening-perusahaan'),
      getMenuItem('konfigurasi-saldo'),
      getMenuItem('data-log-va'),
    ],
  },
  invoice: {
    id: 'invoice',
    label: 'Manajemen Tagihan',
    icon: DocumentText,
    description: 'Tagihan Master, Tagihan Tunggal, Data Tagihan',
    subMenus: [
      getMenuItem('tagihan-master'),
      getMenuItem('tagihan-tunggal'),
      getMenuItem('data-tagihan'),
    ],
  },
  retribusi: {
    id: 'retribusi',
    label: 'Retribusi',
    icon: Receipt21,
    description: 'Atur Petugas Retribusi, Kode QR Merchant, Konfigurasi Template Retribusi, Data Tagihan Retribusi',
    subMenus: [
      getMenuItem('atur-petugas-retribusi'),
      getMenuItem('kode-qr-merchant'),
      getMenuItem('konfigurasi-template-retribusi'),
      getMenuItem('data-tagihan-retribusi'),
    ],
  },
  'merchant-kso': {
    id: 'merchant-kso',
    label: 'Merchant KSO',
    icon: Shop,
    description: 'Merchant bagi hasil',
    subMenus: [
      getMenuItem('merchant-bagi-hasil'),
    ],
  },
  'virtual-card': {
    id: 'virtual-card',
    label: 'Manajemen Kartu',
    icon: CardSend,
    description: 'Ketentuan Kartu, Kustom Template Kartu Virtual, Biaya Admin Kartu, Data Kartu Virtual, Data Transaksi Kartu',
    subMenus: [
      getMenuItem('ketentuan-kartu'),
      getMenuItem('kustom-template-kartu-virtual'),
      getMenuItem('biaya-admin-kartu'),
      getMenuItem('data-kartu-virtual'),
      getMenuItem('data-transaksi-kartu'),
    ],
  },
  'payment-gateway': {
    id: 'payment-gateway',
    label: 'Manajemen Payment Gateway',
    icon: MoneyRecive,
    description: 'Konfigurasi Checkoutlink, Konfigurasi Saldo',
    subMenus: [
      getMenuItem('konfigurasi-checkoutlink'),
      getMenuItem('konfigurasi-saldo-payment'),
    ],
  },
  marketplace: {
    id: 'marketplace',
    label: 'Manajemen Marketplace dan Sistem Kasir',
    icon: Buildings2,
    description: 'Data Marketplace, Data Kasir, Data Produk',
    subMenus: [
      getMenuItem('data-marketplace'),
      getMenuItem('data-kasir'),
      getMenuItem('data-produk'),
    ],
  },
  'donasi-zakat': {
    id: 'donasi-zakat',
    label: 'Manajemen Donasi dan Zakat',
    icon: Money4,
    description: 'Data Donasi, Data Zakat',
    subMenus: [
      getMenuItem('data-donasi'),
      getMenuItem('data-zakat'),
    ],
  },
  'info-berita': {
    id: 'info-berita',
    label: 'Manajemen Info dan Berita',
    icon: InfoCircle,
    description: 'Data Info, Data Berita, Data Push Notification, Data Riwayat Notifikasi',
    subMenus: [
      getMenuItem('data-info'),
      getMenuItem('data-berita'),
      getMenuItem('data-push-notification'),
      getMenuItem('data-riwayat-notifikasi'),
    ],
  },
  'sport-center': {
    id: 'sport-center',
    label: 'Manajemen Sport Center',
    icon: Game,
    description: 'Data Penyewaan',
    subMenus: [
      getMenuItem('data-penyewaan'),
    ],
  },
  fnb: {
    id: 'fnb',
    label: 'Manajemen FnB',
    icon: Shop,
    description: 'Data FnB',
    subMenus: [
      getMenuItem('data-fnb'),
    ],
  },
  aksesibilitas: {
    id: 'aksesibilitas',
    label: 'Manajemen Aksesibilitas',
    icon: Eye,
    description: 'Data Perangkat, Data Presensi, Data Akses',
    subMenus: [
      getMenuItem('data-perangkat'),
      getMenuItem('data-presensi-akses'),
      getMenuItem('data-akses'),
    ],
  },
  'bank-sampah': {
    id: 'bank-sampah',
    label: 'Manajemen Bank Sampah',
    icon: Trash,
    description: 'Data Bank Sampah',
    subMenus: [
      getMenuItem('data-bank-sampah'),
    ],
  },
  payroll: {
    id: 'payroll',
    label: 'Manajemen Payroll',
    icon: DocumentText,
    description: 'Data Presensi, Data Pembayaran karyawan, Buat Payroll',
    subMenus: [
      getMenuItem('data-presensi-payroll'),
      getMenuItem('data-pembayaran-karyawan'),
      getMenuItem('buat-payroll'),
    ],
  },
  lms: {
    id: 'lms',
    label: 'Manajemen Pembelajaran / LMS',
    icon: Book,
    description: 'Data LMS',
    subMenus: [
      getMenuItem('data-lms'),
    ],
  },
  integrasi: {
    id: 'integrasi',
    label: 'Manajemen Integrasi',
    icon: Code1,
    description: 'Pengaturan Credentials, Riwayat Callback',
    subMenus: [
      getMenuItem('pengaturan-credentials'),
      getMenuItem('riwayat-callback'),
    ],
  },
  'sub-company': {
    id: 'sub-company',
    label: 'Manajemen Sub-Company',
    icon: Hierarchy,
    description: 'Manajemen Sub-Company',
    subMenus: [
      getMenuItem('manajemen-sub-company'),
    ],
  },
  transaksi: {
    id: 'transaksi',
    label: 'Manajemen Transaksi',
    icon: TransactionMinus,
    description: 'Transaksi Qriss, Transaksi Barcode, Top Up Member Via Merchant, Top Up User Manual, Pencairan User Manual, VA Debit',
    subMenus: [
      getMenuItem('transaksi-qriss'),
      getMenuItem('transaksi-barcode'),
      getMenuItem('top-up-member-via-merchant'),
      getMenuItem('top-up-user-manual'),
      getMenuItem('pencairan-user-manual'),
      getMenuItem('va-debit'),
    ],
  },
  ppob: {
    id: 'ppob',
    label: 'Manajemen PPOB',
    icon: Flash,
    description: 'Manajemen PPOB',
    subMenus: [
      getMenuItem('manajemen-ppob'),
    ],
  },
};

// Export global menu items for direct access if needed
export { GLOBAL_MENU_ITEMS, getMenuItem, getMenuItems };
