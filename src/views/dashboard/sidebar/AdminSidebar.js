'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Drawer,
  Box,
  List,
  Typography,
  Divider,
} from '@mui/material';
import Image from 'next/image';
import SidebarNavItem from './SidebarNavItem';
import { useAdminMenu } from '@/contexts/AdminMenuContext';
import { ADMIN_MENU_CONFIG } from '@/configs/adminMenuConfig';
import { Home2 } from 'iconsax-react';

const brandColor = '#080808';

export default function AdminSidebar({
  mobileOpen,
  handleDrawerToggle,
  desktopExpanded,
  drawerWidth,
  collapsedDrawerWidth,
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { selectedMenu, selectedCompany, clearAdminMenu } = useAdminMenu();
  const desktopWidth = desktopExpanded ? drawerWidth : collapsedDrawerWidth;

  const handleNavigate = (href) => {
    if (!href) return;
    router.push(href);
  };

  // Get menu config based on selected menu
  const menuConfig = selectedMenu ? ADMIN_MENU_CONFIG[selectedMenu] : null;

  if (!menuConfig) {
    return null;
  }

  // Build sidebar sections for admin menu - sub-menus displayed directly, not in dropdown
  const sidebarSections = [
    {
      id: 'main',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          href: '/dashboard',
          icon: Home2,
        },
      ],
    },
    {
      id: 'admin-menu',
      label: menuConfig.label.toUpperCase(),
      items: menuConfig.subMenus.map((subMenu) => ({
        id: subMenu.id,
        label: subMenu.label,
        href: subMenu.href,
        icon: menuConfig.icon,
      })),
    },
  ];

  const drawer = (
    <Box sx={{ width: desktopWidth }}>
      {/* Logo Section */}
      <Box
        sx={{
          p: desktopExpanded ? 3 : 2,
          display: 'flex',
          alignItems: 'center',
          gap: desktopExpanded ? 2 : 0,
          justifyContent: desktopExpanded ? 'flex-start' : 'center',
        }}
      >
        <Box
          sx={{
            width: desktopExpanded ? 150 : 40,
            height: 40,
            borderRadius: 2,
            flexShrink: 0,
            bgcolor: 'transparent',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <Image
            src="/assets/images/logo2.png"
            alt="Logo"
            fill
            sizes={desktopExpanded ? '150px' : '40px'}
            style={{
              objectFit: desktopExpanded ? 'contain' : 'cover',
              objectPosition: desktopExpanded ? 'left center' : 'left center',
            }}
            priority
            draggable={false}
          />
        </Box>
      </Box>

      <Divider />

      {/* Company Info */}
      {selectedCompany && desktopExpanded && (
        <Box sx={{ px: 2, py: 1.5, bgcolor: 'rgba(8, 8, 8, 0.05)' }}>
          <Typography
            variant="caption"
            sx={{
              color: 'rgba(8,8,8,0.6)',
              fontWeight: 500,
              fontSize: '0.7rem',
            }}
          >
            {selectedCompany.nama}
          </Typography>
        </Box>
      )}

      {/* Menu Items */}
      <Box sx={{ px: desktopExpanded ? 2 : 1, py: 2 }}>
        {sidebarSections.map((section) => (
          <Box key={section.id} sx={{ mb: 1.5 }}>
            {desktopExpanded && section.label && (
              <Typography
                variant="caption"
                sx={{
                  color: 'rgba(8,8,8,0.45)',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  fontSize: '0.7rem',
                  px: 1,
                  mb: 1,
                  display: 'block',
                }}
              >
                {section.label}
              </Typography>
            )}

            <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              {section.items.map((item) => (
                <SidebarNavItem
                  key={item.id}
                  item={item}
                  pathname={pathname}
                  onNavigate={handleNavigate}
                  brandColor={brandColor}
                  desktopExpanded={desktopExpanded}
                />
              ))}
            </List>
          </Box>
        ))}
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{
        width: { sm: desktopWidth },
        flexShrink: { sm: 0 },
        transition: (theme) =>
          theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.shortest,
          }),
      }}
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            borderRight: '1px solid #e0e0e0',
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: desktopWidth,
            borderRight: '1px solid #e0e0e0',
            bgcolor: 'white',
            overflowX: 'hidden',
            transition: (theme) =>
              theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.shortest,
              }),
          },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
}
