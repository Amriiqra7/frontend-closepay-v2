'use client';

import React, { useState, Suspense, useEffect } from 'react';
import { Box, Toolbar } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from '@/features/dashboard/components/Sidebar';
import AdminSidebar from '@/features/dashboard/components/sidebar/AdminSidebar';
import Header from './Header';
import PageHeader from '@/shared/ui/PageHeader';
import PageLoading from '@/shared/ui/PageLoading';
import GlobalLoading from '@/shared/ui/GlobalLoading';
import PageNavigationProgress from '@/shared/ui/PageNavigationProgress';
import { useAdminMenu } from '@/core/contexts/AdminMenuContext';
import { ADMIN_MENU_CONFIG } from '@/shared/config/adminMenuConfig';

const drawerWidth = 280;
const collapsedDrawerWidth = 80;

// Helper function to get all valid routes for a menu
const getValidRoutesForMenu = (menuId) => {
  if (!menuId) return [];
  const menuConfig = ADMIN_MENU_CONFIG[menuId];
  if (!menuConfig) return [];
  return menuConfig.subMenus.map(subMenu => subMenu.href);
};

// Superadmin routes that should not be accessible when admin menu is selected
const SUPERADMIN_ROUTES = [
  '/company',
  '/role',
  '/notifikasi',
  '/monitor-admin-dashboard',
];

// Helper function to check if route is valid for selected menu
const isRouteValidForMenu = (pathname, selectedMenu, selectedCompany) => {
  // If no selectedMenu or selectedCompany, allow all routes (superadmin)
  if (!selectedMenu || !selectedCompany) return true;
  
  // Block superadmin routes if admin menu is selected
  const isSuperadminRoute = SUPERADMIN_ROUTES.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );
  if (isSuperadminRoute) return false;
  
  // Allow dashboard route
  if (pathname === '/dashboard') return true;
  
  // Get valid routes for the selected menu
  const validRoutes = getValidRoutesForMenu(selectedMenu);
  
  // Check if current pathname matches any valid route
  return validRoutes.some(route => pathname === route || pathname.startsWith(route + '/'));
};

export default function DashboardLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopExpanded, setDesktopExpanded] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const { selectedMenu, selectedCompany, isHydrated } = useAdminMenu();

  const handleDrawerToggle = () => {
    if (typeof window !== 'undefined') {
      const isDesktopNow = window.matchMedia('(min-width:600px)').matches;
      if (isDesktopNow) {
        setDesktopExpanded((v) => !v);
        return;
      }
    }
    setMobileOpen((v) => !v);
  };

  // State to track if route validation is in progress
  const [isValidatingRoute, setIsValidatingRoute] = useState(false);

  // Protect routes: if admin has selectedMenu and selectedCompany, only allow valid routes
  useEffect(() => {
    if (!isHydrated) return;
    
    // Check if route is valid for selected menu
    if (!isRouteValidForMenu(pathname, selectedMenu, selectedCompany)) {
      // Set validating state and redirect to dashboard if trying to access invalid route
      setIsValidatingRoute(true);
      router.replace('/dashboard');
      // Reset validating state after a short delay
      setTimeout(() => setIsValidatingRoute(false), 100);
    } else {
      setIsValidatingRoute(false);
    }
  }, [pathname, selectedMenu, selectedCompany, isHydrated, router]);

  // Show full screen loading while validating (before hydration completes or during route validation)
  // This prevents showing wrong sidebar (superadmin vs admin) during refresh
  if (!isHydrated || isValidatingRoute) {
    return <GlobalLoading message={!isHydrated ? "Memvalidasi akses..." : "Mengarahkan..."} />;
  }

  // Use AdminSidebar if admin menu is selected, otherwise use regular Sidebar
  const SidebarComponent = selectedMenu ? AdminSidebar : Sidebar;

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#f8f9fa', overflow: 'hidden' }}>
      {/* Page Navigation Progress Bar - Fixed at top */}
      <PageNavigationProgress />
      
      <SidebarComponent
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
        desktopExpanded={desktopExpanded}
        drawerWidth={drawerWidth}
        collapsedDrawerWidth={collapsedDrawerWidth}
      />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Global Header */}
        <Header
          drawerWidth={drawerWidth}
          collapsedDrawerWidth={collapsedDrawerWidth}
          desktopExpanded={desktopExpanded}
          onDrawerToggle={handleDrawerToggle}
        />

        {/* Spacer for fixed AppBar */}
        <Toolbar sx={{ minHeight: '80px !important' }} />

        {/* Main Content - Scroll happens here */}
        <Box 
          sx={{ 
            p: { xs: 2, sm: 3 }, 
            width: '100%',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflowX: 'hidden',
            overflowY: 'auto',
            minHeight: 0,
            maxHeight: 'calc(100vh - 80px)',
          }}
        >
          {/* Global Page Header (Breadcrumb & Title) */}
          <PageHeader />
          
          {/* Page Content - No overflow here, let parent handle scrolling */}
          <Box sx={{ mt: 2, flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <Suspense fallback={<PageLoading />}>
              {children}
            </Suspense>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
