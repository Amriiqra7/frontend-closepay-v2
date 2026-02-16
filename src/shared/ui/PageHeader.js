'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Breadcrumbs, Link } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowRight2 } from 'iconsax-react';
import { ADMIN_MENU_CONFIG } from '@/shared/config/adminMenuConfig';

// Placeholder API - replace with actual API service
const CompanyAPI = {
  getById: async (id) => {
    // Simulate API call - replace with actual API
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock data - replace with actual API call
        resolve({
          id: parseInt(id),
          nama: 'Bougenvile Blok',
        });
      }, 100);
    });
  },
};

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
  'credential-rekening': 'Credential Rekening Perusahaan',
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
  
  // Route khusus yang valid (untuk superadmin routes yang tidak ada di ADMIN_MENU_CONFIG)
  const validSuperadminRoutes = [
    '/company',
    '/role',
    '/notifikasi',
  ];
  if (validSuperadminRoutes.includes(path)) {
    return true;
  }
  
  // Route pattern untuk /company/[id] dan /company/[id]/...
  if (path.startsWith('/company/')) {
    return true;
  }
  
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
  // Route khusus yang punya halaman sendiri (bukan parent menu only)
  const routesWithOwnPage = [
    '/company',
  ];
  if (routesWithOwnPage.includes(path)) {
    return false;
  }
  
  // Route pattern untuk /company/[id] dan /company/[id]/... punya halaman sendiri
  if (path.startsWith('/company/')) {
    return false;
  }
  
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

// Fungsi untuk mengecek apakah pathname adalah route superadmin
const isSuperadminRoute = (pathname) => {
  const superadminRoutes = [
    '/company',
    '/role',
    '/notifikasi',
    '/monitor-admin-dashboard',
  ];
  
  // Cek apakah pathname adalah superadmin route atau dimulai dengan superadmin route
  return superadminRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );
};

// Fungsi untuk generate breadcrumb dari pathname
const generateBreadcrumbs = (pathname, companyNameMap = {}) => {
  const segments = pathname.split('/').filter(Boolean);
  
  // Cek apakah ini route superadmin
  const isSuperadmin = isSuperadminRoute(pathname);
  
  // Beranda disabled jika route superadmin (karena /dashboard tidak valid untuk superadmin)
  const breadcrumbs = [
    { label: 'Beranda', href: '/dashboard', disabled: isSuperadmin },
  ];

  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // Cek apakah segment ini adalah ID perusahaan (setelah /company)
    let label = formatSegmentLabel(segment);
    const isCompanyId = index > 0 && segments[index - 1] === 'company';
    if (isCompanyId) {
      // Gunakan nama perusahaan jika ada, fallback ke ID
      label = companyNameMap[segment] || segment;
    }
    
    const isLast = index === segments.length - 1;
    
    // Cek apakah route valid
    const isValid = isValidRoute(currentPath);
    // Cek apakah route adalah parent menu only (punya children tapi tidak punya halaman sendiri)
    const isParentOnly = isParentMenuOnly(currentPath);
    
    // Cek apakah ini route detail perusahaan (/company/[id])
    const isCompanyDetailRoute = isCompanyId && currentPath.match(/^\/company\/\d+$/);
    // Cek apakah pathname saat ini sama dengan currentPath (halaman aktif)
    const isCurrentPathActive = pathname === currentPath;
    
    // Nama perusahaan disabled jika:
    // 1. Merupakan breadcrumb terakhir (isLast)
    // 2. Atau route /company/[id] tidak valid (tidak ada halaman untuk route tersebut)
    // Route /company/[id] dianggap tidak valid jika tidak ada halaman sendiri (hanya parent untuk child routes)
    const isCompanyDetailRouteInvalid = isCompanyDetailRoute && !isCurrentPathActive;
    
    breadcrumbs.push({
      label,
      href: isLast ? null : currentPath,
      disabled: isLast || (isCompanyId && isCompanyDetailRouteInvalid) || (!isCompanyDetailRoute && !isLast && (!isValid || isParentOnly)), // Disabled jika last, atau nama perusahaan dengan route invalid, atau (bukan company detail route, bukan last, dan route tidak valid/parent only)
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
  const [companyNameMap, setCompanyNameMap] = useState({});
  
  // Extract company ID from pathname jika ada
  useEffect(() => {
    const segments = pathname.split('/').filter(Boolean);
    const companyIndex = segments.indexOf('company');
    
    if (companyIndex !== -1 && segments[companyIndex + 1]) {
      const companyId = segments[companyIndex + 1];
      
      // Skip jika segment adalah 'new', 'edit', atau route khusus lainnya
      if (companyId === 'new' || companyId === 'edit' || companyId === 'credential-rekening') {
        return;
      }
      
      // Cek apakah ID sudah di-fetch
      if (!companyNameMap[companyId]) {
        // Fetch nama perusahaan
        CompanyAPI.getById(companyId)
          .then((data) => {
            setCompanyNameMap((prev) => ({
              ...prev,
              [companyId]: data.nama || companyId,
            }));
          })
          .catch((err) => {
            // Jika error, gunakan ID
            setCompanyNameMap((prev) => ({
              ...prev,
              [companyId]: companyId,
            }));
          });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
  
  // Generate breadcrumb secara otomatis
  const breadcrumbs = generateBreadcrumbs(pathname, companyNameMap);
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
