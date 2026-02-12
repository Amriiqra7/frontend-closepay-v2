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
      { id: 'data-perusahaan', label: 'Data Perusahaan', href: '/admin/utama/data-perusahaan', icon: Buildings2 },
      { id: 'data-user', label: 'Data User', href: '/admin/utama/data-user', icon: User },
      { id: 'personalisasi-perusahaan', label: 'Personalisasi Perusahaan', href: '/admin/utama/personalisasi-perusahaan', icon: Setting2 },
      { id: 'data-menu', label: 'Data Menu', href: '/admin/utama/data-menu', icon: MenuBoard },
    ],
  },
  advance: {
    id: 'advance',
    label: 'Advance',
    icon: Setting2,
    description: 'Semua Fitur ditampilkan',
    subMenus: [
      // Menu dari Utama
      { id: 'data-perusahaan', label: 'Data Perusahaan', href: '/admin/utama/data-perusahaan', icon: Buildings2 },
      { id: 'data-user', label: 'Data User', href: '/admin/utama/data-user', icon: User },
      { id: 'personalisasi-perusahaan', label: 'Personalisasi Perusahaan', href: '/admin/utama/personalisasi-perusahaan', icon: Setting2 },
      { id: 'data-menu', label: 'Data Menu', href: '/admin/utama/data-menu', icon: MenuBoard },
      // Menu dari Balance
      { id: 'data-saldo', label: 'Data Saldo', href: '/admin/balance/data-saldo', icon: Wallet3 },
      { id: 'data-mutasi', label: 'Data Mutasi', href: '/admin/balance/data-mutasi', icon: MoneyRecive },
      { id: 'rekening-perusahaan', label: 'Rekening Perusahaan', href: '/admin/balance/rekening-perusahaan', icon: Bank },
      { id: 'konfigurasi-saldo', label: 'Konfigurasi Saldo', href: '/admin/balance/konfigurasi-saldo', icon: WalletAdd },
      { id: 'data-log-va', label: 'Data Log VA', href: '/admin/balance/data-log-va', icon: Document },
      // Menu dari Invoice
      { id: 'tagihan-master', label: 'Tagihan Master', href: '/admin/invoice/tagihan-master', icon: DocumentText },
      { id: 'tagihan-tunggal', label: 'Tagihan Tunggal', href: '/admin/invoice/tagihan-tunggal', icon: Document },
      { id: 'data-tagihan', label: 'Data Tagihan', href: '/admin/invoice/data-tagihan', icon: DocumentCopy },
      // Menu dari Retribusi
      { id: 'atur-petugas-retribusi', label: 'Atur Petugas Retribusi', href: '/admin/retribusi/atur-petugas-retribusi', icon: User },
      { id: 'kode-qr-merchant', label: 'Kode QR Merchant', href: '/admin/retribusi/kode-qr-merchant', icon: Eye },
      { id: 'konfigurasi-template-retribusi', label: 'Konfigurasi Template Retribusi', href: '/admin/retribusi/konfigurasi-template-retribusi', icon: ReceiptEdit },
      { id: 'data-tagihan-retribusi', label: 'Data Tagihan Retribusi', href: '/admin/retribusi/data-tagihan-retribusi', icon: ReceiptSearch },
      // Menu dari Merchant KSO
      { id: 'merchant-bagi-hasil', label: 'Merchant Bagi Hasil', href: '/admin/merchant-kso/merchant-bagi-hasil', icon: ShopAdd },
      // Menu dari Virtual Card
      { id: 'ketentuan-kartu', label: 'Ketentuan Kartu', href: '/admin/virtual-card/ketentuan-kartu', icon: DocumentText },
      { id: 'kustom-template-kartu-virtual', label: 'Kustom Template Kartu Virtual', href: '/admin/virtual-card/kustom-template-kartu-virtual', icon: Card },
      { id: 'biaya-admin-kartu', label: 'Biaya Admin Kartu', href: '/admin/virtual-card/biaya-admin-kartu', icon: Money4 },
      { id: 'data-kartu-virtual', label: 'Data Kartu Virtual', href: '/admin/virtual-card/data-kartu-virtual', icon: Card },
      { id: 'data-transaksi-kartu', label: 'Data Transaksi Kartu', href: '/admin/virtual-card/data-transaksi-kartu', icon: CardSend },
      // Menu dari Payment Gateway
      { id: 'konfigurasi-checkoutlink', label: 'Konfigurasi Checkoutlink', href: '/admin/payment-gateway/konfigurasi-checkoutlink', icon: Setting2 },
      { id: 'konfigurasi-saldo-payment', label: 'Konfigurasi Saldo', href: '/admin/payment-gateway/konfigurasi-saldo', icon: WalletCheck },
      // Menu dari Marketplace
      { id: 'data-marketplace', label: 'Data Marketplace', href: '/admin/marketplace/data-marketplace', icon: Shop },
      { id: 'data-kasir', label: 'Data Kasir', href: '/admin/marketplace/data-kasir', icon: ShopAdd },
      { id: 'data-produk', label: 'Data Produk', href: '/admin/marketplace/data-produk', icon: Box },
      // Menu dari Donasi Zakat
      { id: 'data-donasi', label: 'Data Donasi', href: '/admin/donasi-zakat/data-donasi', icon: Gift },
      { id: 'data-zakat', label: 'Data Zakat', href: '/admin/donasi-zakat/data-zakat', icon: Money4 },
      // Menu dari Info Berita
      { id: 'data-info', label: 'Data Info', href: '/admin/info-berita/data-info', icon: InfoCircle },
      { id: 'data-berita', label: 'Data Berita', href: '/admin/info-berita/data-berita', icon: DocumentText },
      { id: 'data-push-notification', label: 'Data Push Notification', href: '/admin/info-berita/data-push-notification', icon: NotificationBing },
      { id: 'data-riwayat-notifikasi', label: 'Data Riwayat Notifikasi', href: '/admin/info-berita/data-riwayat-notifikasi', icon: Notification },
      // Menu dari Sport Center
      { id: 'data-penyewaan', label: 'Data Penyewaan', href: '/admin/sport-center/data-penyewaan', icon: Calendar },
      // Menu dari FnB
      { id: 'data-fnb', label: 'Data FnB', href: '/admin/fnb/data-fnb', icon: Shop },
      // Menu dari Aksesibilitas
      { id: 'data-perangkat', label: 'Data Perangkat', href: '/admin/aksesibilitas/data-perangkat', icon: Monitor },
      { id: 'data-presensi-akses', label: 'Data Presensi', href: '/admin/aksesibilitas/data-presensi', icon: Calendar },
      { id: 'data-akses', label: 'Data Akses', href: '/admin/aksesibilitas/data-akses', icon: FingerScan },
      // Menu dari Bank Sampah
      { id: 'data-bank-sampah', label: 'Data Bank Sampah', href: '/admin/bank-sampah/data-bank-sampah', icon: Trash },
      // Menu dari Payroll
      { id: 'data-presensi-payroll', label: 'Data Presensi', href: '/admin/payroll/data-presensi', icon: Calendar },
      { id: 'data-pembayaran-karyawan', label: 'Data Pembayaran Karyawan', href: '/admin/payroll/data-pembayaran-karyawan', icon: MoneyTick },
      { id: 'buat-payroll', label: 'Buat Payroll', href: '/admin/payroll/buat-payroll', icon: DocumentDownload },
      // Menu dari LMS
      { id: 'data-lms', label: 'Data LMS', href: '/admin/lms/data-lms', icon: Book },
      // Menu dari Integrasi
      { id: 'pengaturan-credentials', label: 'Pengaturan Credentials', href: '/admin/integrasi/pengaturan-credentials', icon: Lock },
      { id: 'riwayat-callback', label: 'Riwayat Callback', href: '/admin/integrasi/riwayat-callback', icon: Code1 },
      // Menu dari Sub-Company
      { id: 'manajemen-sub-company', label: 'Manajemen Sub-Company', href: '/admin/sub-company/manajemen-sub-company', icon: Hierarchy },
      // Menu dari Transaksi
      { id: 'transaksi-qriss', label: 'Transaksi Qriss', href: '/admin/transaksi/transaksi-qriss', icon: Eye },
      { id: 'transaksi-barcode', label: 'Transaksi Barcode', href: '/admin/transaksi/transaksi-barcode', icon: Eye },
      { id: 'top-up-member-via-merchant', label: 'Top Up Member Via Merchant', href: '/admin/transaksi/top-up-member-via-merchant', icon: MoneyAdd },
      { id: 'top-up-user-manual', label: 'Top Up User Manual', href: '/admin/transaksi/top-up-user-manual', icon: MoneyRecive },
      { id: 'pencairan-user-manual', label: 'Pencairan User Manual', href: '/admin/transaksi/pencairan-user-manual', icon: MoneySend },
      { id: 'va-debit', label: 'VA Debit', href: '/admin/transaksi/va-debit', icon: Bank },
      // Menu dari PPOB
      { id: 'manajemen-ppob', label: 'Manajemen PPOB', href: '/admin/ppob/manajemen-ppob', icon: Flash },
    ],
  },
  balance: {
    id: 'balance',
    label: 'Manajemen Saldo',
    icon: Wallet3,
    description: 'Data Saldo, Data Mutasi, Rekening Perusahaan, Konfigurasi Saldo, Data Log VA',
    subMenus: [
      { id: 'data-saldo', label: 'Data Saldo', href: '/admin/balance/data-saldo', icon: Wallet3 },
      { id: 'data-mutasi', label: 'Data Mutasi', href: '/admin/balance/data-mutasi', icon: MoneyRecive },
      { id: 'rekening-perusahaan', label: 'Rekening Perusahaan', href: '/admin/balance/rekening-perusahaan', icon: Bank },
      { id: 'konfigurasi-saldo', label: 'Konfigurasi Saldo', href: '/admin/balance/konfigurasi-saldo', icon: WalletAdd },
      { id: 'data-log-va', label: 'Data Log VA', href: '/admin/balance/data-log-va', icon: Document },
    ],
  },
  invoice: {
    id: 'invoice',
    label: 'Manajemen Tagihan',
    icon: DocumentText,
    description: 'Tagihan Master, Tagihan Tunggal, Data Tagihan',
    subMenus: [
      { id: 'tagihan-master', label: 'Tagihan Master', href: '/admin/invoice/tagihan-master', icon: DocumentText },
      { id: 'tagihan-tunggal', label: 'Tagihan Tunggal', href: '/admin/invoice/tagihan-tunggal', icon: Document },
      { id: 'data-tagihan', label: 'Data Tagihan', href: '/admin/invoice/data-tagihan', icon: DocumentCopy },
    ],
  },
  retribusi: {
    id: 'retribusi',
    label: 'Retribusi',
    icon: Receipt21,
    description: 'Atur Petugas Retribusi, Kode QR Merchant, Konfigurasi Template Retribusi, Data Tagihan Retribusi',
    subMenus: [
      { id: 'atur-petugas-retribusi', label: 'Atur Petugas Retribusi', href: '/admin/retribusi/atur-petugas-retribusi', icon: User },
      { id: 'kode-qr-merchant', label: 'Kode QR Merchant', href: '/admin/retribusi/kode-qr-merchant', icon: Eye },
      { id: 'konfigurasi-template-retribusi', label: 'Konfigurasi Template Retribusi', href: '/admin/retribusi/konfigurasi-template-retribusi', icon: ReceiptEdit },
      { id: 'data-tagihan-retribusi', label: 'Data Tagihan Retribusi', href: '/admin/retribusi/data-tagihan-retribusi', icon: ReceiptSearch },
    ],
  },
  'merchant-kso': {
    id: 'merchant-kso',
    label: 'Merchant KSO',
    icon: Shop,
    description: 'Merchant bagi hasil',
    subMenus: [
      { id: 'merchant-bagi-hasil', label: 'Merchant Bagi Hasil', href: '/admin/merchant-kso/merchant-bagi-hasil', icon: ShopAdd },
    ],
  },
  'virtual-card': {
    id: 'virtual-card',
    label: 'Manajemen Kartu',
    icon: CardSend,
    description: 'Ketentuan Kartu, Kustom Template Kartu Virtual, Biaya Admin Kartu, Data Kartu Virtual, Data Transaksi Kartu',
    subMenus: [
      { id: 'ketentuan-kartu', label: 'Ketentuan Kartu', href: '/admin/virtual-card/ketentuan-kartu', icon: DocumentText },
      { id: 'kustom-template-kartu-virtual', label: 'Kustom Template Kartu Virtual', href: '/admin/virtual-card/kustom-template-kartu-virtual', icon: Card },
      { id: 'biaya-admin-kartu', label: 'Biaya Admin Kartu', href: '/admin/virtual-card/biaya-admin-kartu', icon: Money4 },
      { id: 'data-kartu-virtual', label: 'Data Kartu Virtual', href: '/admin/virtual-card/data-kartu-virtual', icon: Card },
      { id: 'data-transaksi-kartu', label: 'Data Transaksi Kartu', href: '/admin/virtual-card/data-transaksi-kartu', icon: CardSend },
    ],
  },
  'payment-gateway': {
    id: 'payment-gateway',
    label: 'Manajemen Payment Gateway',
    icon: MoneyRecive,
    description: 'Konfigurasi Checkoutlink, Konfigurasi Saldo',
    subMenus: [
      { id: 'konfigurasi-checkoutlink', label: 'Konfigurasi Checkoutlink', href: '/admin/payment-gateway/konfigurasi-checkoutlink', icon: Setting2 },
      { id: 'konfigurasi-saldo-payment', label: 'Konfigurasi Saldo', href: '/admin/payment-gateway/konfigurasi-saldo', icon: WalletCheck },
    ],
  },
  marketplace: {
    id: 'marketplace',
    label: 'Manajemen Marketplace dan Sistem Kasir',
    icon: Buildings2,
    description: 'Data Marketplace, Data Kasir, Data Produk',
    subMenus: [
      { id: 'data-marketplace', label: 'Data Marketplace', href: '/admin/marketplace/data-marketplace', icon: Shop },
      { id: 'data-kasir', label: 'Data Kasir', href: '/admin/marketplace/data-kasir', icon: ShopAdd },
      { id: 'data-produk', label: 'Data Produk', href: '/admin/marketplace/data-produk', icon: Box },
    ],
  },
  'donasi-zakat': {
    id: 'donasi-zakat',
    label: 'Manajemen Donasi dan Zakat',
    icon: Money4,
    description: 'Data Donasi, Data Zakat',
    subMenus: [
      { id: 'data-donasi', label: 'Data Donasi', href: '/admin/donasi-zakat/data-donasi', icon: Gift },
      { id: 'data-zakat', label: 'Data Zakat', href: '/admin/donasi-zakat/data-zakat', icon: Money4 },
    ],
  },
  'info-berita': {
    id: 'info-berita',
    label: 'Manajemen Info dan Berita',
    icon: InfoCircle,
    description: 'Data Info, Data Berita, Data Push Notification, Data Riwayat Notifikasi',
    subMenus: [
      { id: 'data-info', label: 'Data Info', href: '/admin/info-berita/data-info', icon: InfoCircle },
      { id: 'data-berita', label: 'Data Berita', href: '/admin/info-berita/data-berita', icon: DocumentText },
      { id: 'data-push-notification', label: 'Data Push Notification', href: '/admin/info-berita/data-push-notification', icon: NotificationBing },
      { id: 'data-riwayat-notifikasi', label: 'Data Riwayat Notifikasi', href: '/admin/info-berita/data-riwayat-notifikasi', icon: Notification },
    ],
  },
  'sport-center': {
    id: 'sport-center',
    label: 'Manajemen Sport Center',
    icon: Game,
    description: 'Data Penyewaan',
    subMenus: [
      { id: 'data-penyewaan', label: 'Data Penyewaan', href: '/admin/sport-center/data-penyewaan', icon: Calendar },
    ],
  },
  fnb: {
    id: 'fnb',
    label: 'Manajemen FnB',
    icon: Shop,
    description: 'Data FnB',
    subMenus: [
      { id: 'data-fnb', label: 'Data FnB', href: '/admin/fnb/data-fnb', icon: Shop },
    ],
  },
  aksesibilitas: {
    id: 'aksesibilitas',
    label: 'Manajemen Aksesibilitas',
    icon: Eye,
    description: 'Data Perangkat, Data Presensi, Data Akses',
    subMenus: [
      { id: 'data-perangkat', label: 'Data Perangkat', href: '/admin/aksesibilitas/data-perangkat', icon: Monitor },
      { id: 'data-presensi-akses', label: 'Data Presensi', href: '/admin/aksesibilitas/data-presensi', icon: Calendar },
      { id: 'data-akses', label: 'Data Akses', href: '/admin/aksesibilitas/data-akses', icon: FingerScan },
    ],
  },
  'bank-sampah': {
    id: 'bank-sampah',
    label: 'Manajemen Bank Sampah',
    icon: Trash,
    description: 'Data Bank Sampah',
    subMenus: [
      { id: 'data-bank-sampah', label: 'Data Bank Sampah', href: '/admin/bank-sampah/data-bank-sampah', icon: Trash },
    ],
  },
  payroll: {
    id: 'payroll',
    label: 'Manajemen Payroll',
    icon: DocumentText,
    description: 'Data Presensi, Data Pembayaran karyawan, Buat Payroll',
    subMenus: [
      { id: 'data-presensi-payroll', label: 'Data Presensi', href: '/admin/payroll/data-presensi', icon: Calendar },
      { id: 'data-pembayaran-karyawan', label: 'Data Pembayaran Karyawan', href: '/admin/payroll/data-pembayaran-karyawan', icon: MoneyTick },
      { id: 'buat-payroll', label: 'Buat Payroll', href: '/admin/payroll/buat-payroll', icon: DocumentDownload },
    ],
  },
  lms: {
    id: 'lms',
    label: 'Manajemen Pembelajaran / LMS',
    icon: Book,
    description: 'Data LMS',
    subMenus: [
      { id: 'data-lms', label: 'Data LMS', href: '/admin/lms/data-lms', icon: Book },
    ],
  },
  integrasi: {
    id: 'integrasi',
    label: 'Manajemen Integrasi',
    icon: Code1,
    description: 'Pengaturan Credentials, Riwayat Callback',
    subMenus: [
      { id: 'pengaturan-credentials', label: 'Pengaturan Credentials', href: '/admin/integrasi/pengaturan-credentials', icon: Lock },
      { id: 'riwayat-callback', label: 'Riwayat Callback', href: '/admin/integrasi/riwayat-callback', icon: Code1 },
    ],
  },
  'sub-company': {
    id: 'sub-company',
    label: 'Manajemen Sub-Company',
    icon: Hierarchy,
    description: 'Manajemen Sub-Company',
    subMenus: [
      { id: 'manajemen-sub-company', label: 'Manajemen Sub-Company', href: '/admin/sub-company/manajemen-sub-company', icon: Hierarchy },
    ],
  },
  transaksi: {
    id: 'transaksi',
    label: 'Manajemen Transaksi',
    icon: TransactionMinus,
    description: 'Transaksi Qriss, Transaksi Barcode, Top Up Member Via Merchant, Top Up User Manual, Pencairan User Manual, VA Debit',
    subMenus: [
      { id: 'transaksi-qriss', label: 'Transaksi Qriss', href: '/admin/transaksi/transaksi-qriss', icon: Eye },
      { id: 'transaksi-barcode', label: 'Transaksi Barcode', href: '/admin/transaksi/transaksi-barcode', icon: Eye },
      { id: 'top-up-member-via-merchant', label: 'Top Up Member Via Merchant', href: '/admin/transaksi/top-up-member-via-merchant', icon: MoneyAdd },
      { id: 'top-up-user-manual', label: 'Top Up User Manual', href: '/admin/transaksi/top-up-user-manual', icon: MoneyRecive },
      { id: 'pencairan-user-manual', label: 'Pencairan User Manual', href: '/admin/transaksi/pencairan-user-manual', icon: MoneySend },
      { id: 'va-debit', label: 'VA Debit', href: '/admin/transaksi/va-debit', icon: Bank },
    ],
  },
  ppob: {
    id: 'ppob',
    label: 'Manajemen PPOB',
    icon: Flash,
    description: 'Manajemen PPOB',
    subMenus: [
      { id: 'manajemen-ppob', label: 'Manajemen PPOB', href: '/admin/ppob/manajemen-ppob', icon: Flash },
    ],
  },
};
