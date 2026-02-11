'use client';

import React, { useState } from 'react';
import { Box, Toolbar } from '@mui/material';
import Sidebar from '../dashboard/Sidebar';
import AdminSidebar from '../dashboard/sidebar/AdminSidebar';
import Header from './Header';
import PageHeader from '@/components/PageHeader';
import { useAdminMenu } from '@/contexts/AdminMenuContext';

const drawerWidth = 280;
const collapsedDrawerWidth = 80;

export default function DashboardLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopExpanded, setDesktopExpanded] = useState(true);
  const { selectedMenu } = useAdminMenu();

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

  // Use AdminSidebar if admin menu is selected, otherwise use regular Sidebar
  const SidebarComponent = selectedMenu ? AdminSidebar : Sidebar;

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#f5f5f5', overflow: 'hidden' }}>
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
        <Toolbar />

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
          }}
        >
          {/* Global Page Header (Breadcrumb & Title) */}
          <PageHeader />
          
          {/* Page Content - No overflow here, let parent handle scrolling */}
          <Box sx={{ mt: 2, flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
