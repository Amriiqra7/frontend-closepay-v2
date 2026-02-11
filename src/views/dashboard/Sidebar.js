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
import SidebarNavItem from './sidebar/SidebarNavItem';
import { SIDEBAR_SECTIONS } from './sidebar/menuConfig';

const brandColor = '#155DFC';

export default function Sidebar({
  mobileOpen,
  handleDrawerToggle,
  desktopExpanded,
  drawerWidth,
  collapsedDrawerWidth,
}) {
  const pathname = usePathname();
  const router = useRouter();
  const desktopWidth = desktopExpanded ? drawerWidth : collapsedDrawerWidth;

  const handleNavigate = (href) => {
    if (!href) return;
    router.push(href);
  };

  const drawer = (
    <Box sx={{ width: desktopWidth }}>
      {/* Logo Section */}
      <Box
        sx={{
          p: desktopExpanded ? 3 : 2.1,
          minHeight: desktopExpanded ? 'auto' : '89px',
          display: 'flex',
          alignItems: 'center',
          gap: desktopExpanded ? 2 : 0,
          justifyContent: desktopExpanded ? 'flex-start' : 'center',
          borderBottom: "none",
          borderColor: desktopExpanded ? 'transparent' : 'divider',
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

      {/* Menu Items */}
      <Box sx={{ px: desktopExpanded ? 2 : 1, py: 2 }}>
        {SIDEBAR_SECTIONS.map((section) => (
          <Box key={section.id} sx={{ mb: 1.5 }}>
            {desktopExpanded && section.label && (
              <Typography
                variant="caption"
                sx={{
                  color: 'rgba(8,8,8,0.45)',
                  fontWeight: 400,
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
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            borderRight: '1px dashed #b0b0b0',
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
            borderRight: '1px dashed #b0b0b0',
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
