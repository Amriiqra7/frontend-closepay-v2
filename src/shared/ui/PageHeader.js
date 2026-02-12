'use client';

import React from 'react';
import { Box, Typography, Breadcrumbs, Link } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowRight2 } from 'iconsax-react';
import { ADMIN_MENU_CONFIG } from '@/shared/config/adminMenuConfig';

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

// Fungsi untuk mengecek apakah route valid (ada di menu config sebagai href)
const isValidRoute = (path) => {
  // Beranda selalu valid
  if (path === '/dashboard') return true;
  
  // Fungsi rekursif untuk mencari route di menu config
  const findRouteInMenu = (menuObj, targetPath) => {
    // Cek subMenus
    if (menuObj.subMenus) {
      for (const subMenu of menuObj.subMenus) {
        // Cek apakah href sama dengan targetPath
        if (subMenu.href === targetPath) {
          return true;
        }
        // Cek children jika ada (untuk nested menu level 3)
        if (subMenu.children) {
          for (const child of subMenu.children) {
            if (child.href === targetPath) {
              return true;
            }
            // Cek children level 4 jika ada
            if (child.children) {
              for (const grandChild of child.children) {
                if (grandChild.href === targetPath) {
                  return true;
                }
              }
            }
          }
        }
      }
    }
    return false;
  };

  // Cek di semua menu utama
  for (const menuKey in ADMIN_MENU_CONFIG) {
    const menu = ADMIN_MENU_CONFIG[menuKey];
    if (findRouteInMenu(menu, path)) {
      return true;
    }
  }

  return false;
};

// Fungsi untuk mengecek apakah route adalah parent menu (hanya punya children, tidak punya halaman sendiri)
const isParentMenuOnly = (path) => {
  // Fungsi rekursif untuk mencari route di menu config
  const findRouteInMenu = (menuObj, targetPath) => {
    if (menuObj.subMenus) {
      for (const subMenu of menuObj.subMenus) {
        if (subMenu.href === targetPath) {
          // Jika route ini punya children, berarti ini parent menu only
          return subMenu.children && subMenu.children.length > 0;
        }
        if (subMenu.children) {
          for (const child of subMenu.children) {
            if (child.href === targetPath) {
              // Jika route ini punya children, berarti ini parent menu only
              return child.children && child.children.length > 0;
            }
          }
        }
      }
    }
    return false;
  };

  // Cek di semua menu utama
  for (const menuKey in ADMIN_MENU_CONFIG) {
    const menu = ADMIN_MENU_CONFIG[menuKey];
    if (findRouteInMenu(menu, path)) {
      return true;
    }
  }

  return false;
};

// Fungsi untuk generate breadcrumb dari pathname
const generateBreadcrumbs = (pathname) => {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs = [
    { label: 'Beranda', href: '/dashboard', disabled: false },
  ];

  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const label = formatSegmentLabel(segment);
    const isLast = index === segments.length - 1;
    
    // Cek apakah route valid
    const isValid = isValidRoute(currentPath);
    // Cek apakah route adalah parent menu only (punya children tapi tidak punya halaman sendiri)
    const isParentOnly = isParentMenuOnly(currentPath);
    
    breadcrumbs.push({
      label,
      href: isLast ? null : currentPath,
      disabled: !isLast && (!isValid || isParentOnly), // Disabled jika bukan last dan (route tidak valid atau parent menu only)
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
            separator={
              <ArrowRight2 size={16} color="#9ca3af" />
            }
            sx={{
              '& .MuiBreadcrumbs-separator': {
                mx: 1,
                display: 'flex',
                alignItems: 'center',
                color: '#9ca3af',
              },
            }}
          >
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;
              
              if (isLast || !crumb.href || crumb.disabled) {
                return (
                  <Typography
                    key={index}
                    sx={{
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: crumb.disabled ? 'text.disabled' : 'text.primary',
                      cursor: crumb.disabled ? 'default' : 'text',
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
                    color: 'text.primary',
                    '&:hover': {
                      color: 'text.primary',
                    },
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
