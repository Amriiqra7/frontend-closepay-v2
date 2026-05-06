'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Box,
  Divider,
  Drawer,
  List,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import {
  Box1,
  ClipboardText,
  Home2,
  MessageQuestion,
  ReceiptSearch,
  User,
  Shop,
  TruckFast,
} from 'iconsax-react';
import { useAdminMenu } from '@/core/contexts/AdminMenuContext';
import SidebarNavItem from './SidebarNavItem';

const brandColor = '#155DFC';

const mainItems = [
  {
    id: 'fnb-dashboard',
    label: 'Dashboard',
    href: '/fnb',
    icon: Home2,
    matchMode: 'exact',
  },
  {
    id: 'fnb-master-product',
    label: 'Master Product',
    href: '/fnb/master-product',
    icon: Box1,
    children: [
      {
        id: 'fnb-menu-variations',
        label: 'Menu & Variations',
        href: '/fnb/master-product/menu-variations',
        icon: Box1,
      },
      {
        id: 'fnb-add-ons-toppings',
        label: 'Add-Ons & Toppings',
        href: '/fnb/master-product/add-ons-toppings',
        icon: Box1,
      },
      {
        id: 'fnb-bahan-baku-resep',
        label: 'Bahan Baku & Resep',
        href: '/fnb/master-product/bahan-baku-resep',
        icon: Box1,
      },
    ],
  },
  {
    id: 'fnb-inventory',
    label: 'Inventory',
    href: '/fnb/inventory',
    icon: Shop,
    children: [
      {
        id: 'fnb-stock-barang',
        label: 'Stock Barang',
        href: '/fnb/inventory/stock-barang',
        icon: Box1,
      },
      {
        id: 'fnb-log-aktivitas',
        label: 'Log Aktivitas',
        href: '/fnb/inventory/log-aktivitas',
        icon: ReceiptSearch,
      },
    ],
  },
  {
    id: 'fnb-distribution',
    label: 'Distribution',
    href: '/fnb/distribution',
    icon: TruckFast,
  },
  {
    id: 'fnb-stock-opname',
    label: 'Stock Opname',
    href: '/fnb/stock-opname',
    icon: ClipboardText,
  },
  {
    id: 'fnb-internal-user',
    label: 'Internal User',
    href: '/fnb/internal-user',
    icon: User,
  },
];

const utilityItems = [
  {
    id: 'fnb-support',
    label: 'Support',
    href: '/fnb/support',
    icon: MessageQuestion,
  },
];

export default function FnbSidebar({
  mobileOpen,
  handleDrawerToggle,
  desktopExpanded,
  drawerWidth,
  collapsedDrawerWidth,
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { selectedCompany } = useAdminMenu();
  const desktopWidth = desktopExpanded ? drawerWidth : collapsedDrawerWidth;

  const handleNavigate = (href) => {
    if (!href) return;
    router.push(href);
    if (mobileOpen) {
      handleDrawerToggle();
    }
  };

  const drawer = (
    <Box
      sx={{
        width: desktopWidth,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          p: desktopExpanded ? 3 : 2.1,
          minHeight: desktopExpanded ? 'auto' : '89px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: desktopExpanded ? 'flex-start' : 'center',
        }}
      >
        <Box
          sx={{
            width: desktopExpanded ? 178 : 40,
            height: desktopExpanded ? 62 : 40,
            borderRadius: 2,
            flexShrink: 0,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <Image
            src="/assets/images/logo2.png"
            alt="Logo"
            fill
            sizes={desktopExpanded ? '178px' : '40px'}
            style={{
              objectFit: desktopExpanded ? 'contain' : 'cover',
              objectPosition: 'left center',
            }}
            priority
            draggable={false}
          />
        </Box>
      </Box>

      {selectedCompany && desktopExpanded && (
        <Box sx={{ px: 2.5, py: 1.25, bgcolor: 'rgba(8, 8, 8, 0.03)' }}>
          <Typography sx={{ color: 'rgba(8,8,8,0.7)', fontWeight: 600, fontSize: '0.8rem' }}>
            {selectedCompany.nama}
          </Typography>
        </Box>
      )}

      <Box sx={{ flex: 1, overflowY: 'auto', px: desktopExpanded ? 2 : 1, py: 2 }}>
        <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {mainItems.map((item) => (
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

      <Divider />

      <Box sx={{ px: desktopExpanded ? 2 : 1, py: 1.5 }}>
        <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {utilityItems.map((item) => (
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
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
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
