'use client';

import React from 'react';
import { Box, Typography, Breadcrumbs, Link } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';

// Mapping segment ke label yang lebih user-friendly
// Hanya untuk segment yang perlu custom label
const segmentLabelMap = {
  'dashboard': 'Dashboard',
  'company': 'Perusahaan',
  'role': 'Role',
  'data-role': 'Data Role',
  'list': 'Data Role',
  'data-izin-akses': 'Data Izin Akses',
  'new': 'Tambah',
  'edit': 'Edit',
  'detail': 'Detail',
  'settings': 'Pengaturan',
  'profile': 'Profil',
  'users': 'Pengguna',
  'roles': 'Role',
  'permissions': 'Izin',
  'monitor-admin-dashboard': 'Monitor Admin Dashboard',
  'admin': 'Admin',
  'utama': 'Utama',
  'advance': 'Advance',
  'balance': 'Balance / Saldo',
  'invoice': 'Invoice / Tagihan',
  'retribusi': 'Retribusi',
  'merchant-kso': 'Merchant KSO',
  'virtual-card': 'Virtual Card / Card',
  'payment-gateway': 'Payment Gateway',
  'marketplace': 'Marketplace',
  'donasi-zakat': 'Donasi dan Zakat',
  'info-berita': 'Info dan Berita',
  'sport-center': 'Sport Center',
  'aksesibilitas': 'Aksesibilitas',
  'bank-sampah': 'Bank Sampah',
  'payroll': 'Payroll',
  'fnb': 'Manajemen FnB',
  'lms': 'Manajemen Pembelajaran / LMS',
  'integrasi': 'Manajemen Integrasi',
  'sub-company': 'Manajemen Sub-Company',
  'transaksi': 'Manajemen Transaksi',
  'ppob': 'Manajemen PPOB',
  // Tambahkan mapping lainnya sesuai kebutuhan
};

// Mapping untuk title khusus (override auto-generated title)
// Hanya untuk route yang perlu title custom
const customTitleMap = {
  '/dashboard': 'Dashboard',
  '/company': 'Perusahaan',
  '/company/new': 'Tambah Perusahaan',
  '/company/edit': 'Edit Perusahaan',
  '/role/data-role': 'Pilih Perusahaan',
  '/role/data-role/list': 'Data Role',
  '/role/data-role/new': 'Tambah Data Role',
  '/role/data-role/edit': 'Edit Data Role',
  '/role/data-izin-akses': 'Data Izin Akses',
  '/monitor-admin-dashboard': 'Monitor Admin Dashboard',
  '/admin/utama': 'Utama',
  '/admin/advance': 'Advance',
  '/admin/balance': 'Balance / Saldo',
  '/admin/invoice': 'Invoice / Tagihan',
  '/admin/retribusi': 'Retribusi',
  '/admin/merchant-kso': 'Merchant KSO',
  '/admin/virtual-card': 'Virtual Card / Card',
  '/admin/payment-gateway': 'Payment Gateway',
  '/admin/marketplace': 'Marketplace',
  '/admin/donasi-zakat': 'Donasi dan Zakat',
  '/admin/info-berita': 'Info dan Berita',
  '/admin/sport-center': 'Sport Center',
  '/admin/aksesibilitas': 'Aksesibilitas',
  '/admin/bank-sampah': 'Manajemen Bank Sampah',
  '/admin/payroll': 'Manajemen Payroll',
  '/admin/fnb': 'Manajemen FnB',
  '/admin/lms': 'Manajemen Pembelajaran / LMS',
  '/admin/integrasi': 'Manajemen Integrasi',
  '/admin/sub-company': 'Manajemen Sub-Company',
  '/admin/transaksi': 'Manajemen Transaksi',
  '/admin/ppob': 'Manajemen PPOB',
  '/admin/balance': 'Manajemen Saldo',
  '/admin/invoice': 'Manajemen Tagihan',
  '/admin/virtual-card': 'Manajemen Kartu',
  '/admin/payment-gateway': 'Manajemen Payment Gateway',
  '/admin/marketplace': 'Manajemen Marketplace dan Sistem Kasir',
  '/admin/donasi-zakat': 'Manajemen Donasi dan Zakat',
  '/admin/info-berita': 'Manajemen Info dan Berita',
  '/admin/sport-center': 'Manajemen Sport Center',
  '/admin/aksesibilitas': 'Manajemen Aksesibilitas',
  // Tambahkan title custom lainnya di sini jika diperlukan
};

// Fungsi untuk format segment menjadi label yang readable
const formatSegmentLabel = (segment) => {
  // Cek apakah ada custom label
  if (segmentLabelMap[segment]) {
    return segmentLabelMap[segment];
  }

  // Format dari kebab-case atau camelCase ke Title Case
  return segment
    .split('-')
    .map((word) => {
      // Handle camelCase
      const words = word.replace(/([A-Z])/g, ' $1').trim().split(' ');
      return words
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
    })
    .join(' ');
};

// Fungsi untuk generate breadcrumb dari pathname
const generateBreadcrumbs = (pathname) => {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs = [
    { label: 'Beranda', href: '/dashboard' },
  ];

  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const label = formatSegmentLabel(segment);
    
    breadcrumbs.push({
      label,
      href: index === segments.length - 1 ? null : currentPath,
    });
  });

  return breadcrumbs;
};

// Fungsi untuk mendapatkan title
const getTitle = (pathname, breadcrumbs) => {
  // Cek apakah ada custom title
  if (customTitleMap[pathname]) {
    return customTitleMap[pathname];
  }

  // Gunakan label dari breadcrumb terakhir
  const lastBreadcrumb = breadcrumbs[breadcrumbs.length - 1];
  return lastBreadcrumb?.label || 'Halaman';
};

export default function PageHeader() {
  const pathname = usePathname();
  const router = useRouter();
  
  // Generate breadcrumb secara otomatis
  const breadcrumbs = generateBreadcrumbs(pathname);
  const title = getTitle(pathname, breadcrumbs);

  const handleBreadcrumbClick = (href) => {
    if (href) {
      router.push(href);
    }
  };

  // Jangan tampilkan breadcrumb dan title jika di /dashboard
  const showBreadcrumb = pathname !== '/dashboard';
  const showTitle = pathname !== '/dashboard';

  return (
    <Box>
      {/* Breadcrumb */}
      {showBreadcrumb && (
        <Box sx={{ pb: 1 }}>
          <Breadcrumbs
            aria-label="breadcrumb"
            sx={{
              '& .MuiBreadcrumbs-separator': {
                mx: 1,
              },
            }}
          >
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;
              
              if (isLast || !crumb.href) {
                return (
                  <Typography
                    key={index}
                    sx={{
                      fontSize: '0.875rem',
                      fontWeight: 500,
                    }}
                  >
                    {crumb.label}
                  </Typography>
                );
              }

              return (
                <Link
                  key={index}
                  underline="hover"
                  component="button"
                  onClick={() => handleBreadcrumbClick(crumb.href)}
                  sx={{
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    border: 'none',
                    background: 'none',
                    padding: 0,
                  }}
                >
                  {crumb.label}
                </Link>
              );
            })}
          </Breadcrumbs>
        </Box>
      )}

      {/* Title */}
      {showTitle && (
        <Box sx={{ pb: 1 }}>
          <Typography variant="h5" fontWeight="bold">
            {title}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
