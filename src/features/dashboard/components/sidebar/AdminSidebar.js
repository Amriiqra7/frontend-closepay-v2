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
import { useAdminMenu } from '@/core/contexts/AdminMenuContext';
import { ADMIN_MENU_CONFIG } from '@/shared/config/adminMenuConfig';
import { 
  Home2,
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
  Setting2,
} from 'iconsax-react';

const brandColor = '#155DFC';

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
    // Close mobile drawer after navigation
    if (mobileOpen) {
      handleDrawerToggle();
    }
  };

  // Get menu config based on selected menu
  const menuConfig = selectedMenu ? ADMIN_MENU_CONFIG[selectedMenu] : null;

  if (!menuConfig) {
    return null;
  }

  // Map menu path to group info (for advance menu grouping)
  const getGroupInfoFromPath = (href) => {
    if (href.startsWith('/admin/utama/')) {
      return { label: 'Utama', icon: Home2 };
    } else if (href.startsWith('/admin/balance/')) {
      return { label: 'Manajemen Saldo', icon: Wallet3 };
    } else if (href.startsWith('/admin/invoice/')) {
      return { label: 'Manajemen Tagihan', icon: DocumentText };
    } else if (href.startsWith('/admin/retribusi/')) {
      return { label: 'Retribusi', icon: Receipt21 };
    } else if (href.startsWith('/admin/merchant-kso/')) {
      return { label: 'Merchant KSO', icon: Shop };
    } else if (href.startsWith('/admin/virtual-card/')) {
      return { label: 'Manajemen Kartu', icon: CardSend };
    } else if (href.startsWith('/admin/payment-gateway/')) {
      return { label: 'Manajemen Payment Gateway', icon: MoneyRecive };
    } else if (href.startsWith('/admin/marketplace/')) {
      return { label: 'Manajemen Marketplace dan Sistem Kasir', icon: Buildings2 };
    } else if (href.startsWith('/admin/donasi-zakat/')) {
      return { label: 'Manajemen Donasi dan Zakat', icon: Money4 };
    } else if (href.startsWith('/admin/info-berita/')) {
      return { label: 'Manajemen Info dan Berita', icon: InfoCircle };
    } else if (href.startsWith('/admin/sport-center/')) {
      return { label: 'Manajemen Sport Center', icon: Game };
    } else if (href.startsWith('/admin/fnb/')) {
      return { label: 'Manajemen FnB', icon: Shop };
    } else if (href.startsWith('/admin/aksesibilitas/')) {
      return { label: 'Manajemen Aksesibilitas', icon: Eye };
    } else if (href.startsWith('/admin/bank-sampah/')) {
      return { label: 'Manajemen Bank Sampah', icon: Trash };
    } else if (href.startsWith('/admin/payroll/')) {
      return { label: 'Manajemen Payroll', icon: DocumentText };
    } else if (href.startsWith('/admin/lms/')) {
      return { label: 'Manajemen Pembelajaran / LMS', icon: Book };
    } else if (href.startsWith('/admin/integrasi/')) {
      return { label: 'Manajemen Integrasi', icon: Code1 };
    } else if (href.startsWith('/admin/sub-company/')) {
      return { label: 'Manajemen Sub-Company', icon: Hierarchy };
    } else if (href.startsWith('/admin/transaksi/')) {
      return { label: 'Manajemen Transaksi', icon: TransactionMinus };
    } else if (href.startsWith('/admin/ppob/')) {
      return { label: 'Manajemen PPOB', icon: Flash };
    }
    return { label: 'Lainnya', icon: Setting2 };
  };

  // Build sidebar sections for admin menu
  let sidebarSections = [
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
  ];

  // If advance menu, group sub-menus by their parent menu
  if (selectedMenu === 'advance') {
    const groupedMenus = {};
    
    menuConfig.subMenus.forEach((subMenu) => {
      const groupInfo = getGroupInfoFromPath(subMenu.href);
      const groupKey = groupInfo.label;
      
      if (!groupedMenus[groupKey]) {
        groupedMenus[groupKey] = {
          label: groupInfo.label,
          icon: groupInfo.icon,
          items: [],
        };
      }
      
      groupedMenus[groupKey].items.push({
        id: subMenu.id,
        label: subMenu.label,
        href: subMenu.href,
        icon: subMenu.icon || groupInfo.icon, // Use icon from sub-menu, fallback to parent menu icon
      });
    });

    // Convert grouped menus to sections
    Object.values(groupedMenus).forEach((group) => {
      sidebarSections.push({
        id: `group-${group.label.toLowerCase().replace(/\s+/g, '-')}`,
        label: group.label.toUpperCase(),
        items: group.items,
      });
    });
  } else {
    // For non-advance menus, display normally
    sidebarSections.push({
      id: 'admin-menu',
      label: menuConfig.label.toUpperCase(),
      items: menuConfig.subMenus.map((subMenu) => ({
        id: subMenu.id,
        label: subMenu.label,
        href: subMenu.href,
        icon: subMenu.icon || menuConfig.icon, // Use icon from sub-menu, fallback to parent menu icon
        children: subMenu.children ? subMenu.children.map((child) => ({
          id: child.id,
          label: child.label,
          href: child.href,
          icon: child.icon || subMenu.icon,
          children: child.children ? child.children.map((grandChild) => ({
            id: grandChild.id,
            label: grandChild.label,
            href: grandChild.href,
            icon: grandChild.icon || child.icon,
          })) : undefined,
        })) : undefined,
      })),
    });
  }

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

      {/* Company Info */}
      {selectedCompany && desktopExpanded && (
        <Box sx={{ px: 2, py: 1.5, bgcolor: 'rgba(8, 8, 8, 0.05)' }}>
          <Typography
            variant="caption"
            sx={{
              color: 'rgba(8,8,8,0.6)',
              fontWeight: 400,
              fontSize: '0.85rem',
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
          keepMounted: true,
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
