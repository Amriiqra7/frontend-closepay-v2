'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  TextField,
  InputAdornment,
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Chip,
  Paper,
  CircularProgress,
} from '@mui/material';
import {
  SearchNormal1,
  Clock,
  ArrowRight2,
  CloseCircle,
  ArrowUp2,
  ArrowDown2,
} from 'iconsax-react';
import { useRouter, usePathname } from 'next/navigation';
import { useAdminMenu } from '@/core/contexts/AdminMenuContext';
import { SIDEBAR_SECTIONS } from '@/features/dashboard/components/sidebar/menuConfig';
import { ADMIN_MENU_CONFIG } from '@/shared/config/adminMenuConfig';

const RECENT_PAGES_KEY = 'search_recent_pages';
const MAX_RECENT_PAGES = 5;

// Flatten menu items from sidebar sections
const flattenMenuItems = (sections, parentLabel = 'Super Admin') => {
  const items = [];
  
  sections.forEach((section) => {
    section.items?.forEach((item) => {
      // If item has children, only add children (not the parent)
      if (item.children && item.children.length > 0) {
        item.children.forEach((child) => {
          items.push({
            id: child.id,
            label: child.label,
            href: child.href,
            icon: child.icon,
            breadcrumb: `${parentLabel} > ${item.label} > ${child.label}`,
            type: 'page',
          });
        });
      } else {
        // If no children, add the main menu item
        items.push({
          id: item.id,
          label: item.label,
          href: item.href,
          icon: item.icon,
          breadcrumb: `${parentLabel} > ${item.label}`,
          type: 'page',
        });
      }
    });
  });
  
  return items;
};

// Flatten admin menu items
const flattenAdminMenuItems = (config, parentLabel = 'Admin') => {
  const items = [];
  
  Object.values(config).forEach((menu) => {
    menu.subMenus?.forEach((subMenu) => {
      items.push({
        id: subMenu.id,
        label: subMenu.label,
        href: subMenu.href,
        icon: menu.icon,
        breadcrumb: `${parentLabel} > ${menu.label} > ${subMenu.label}`,
        type: 'page',
      });
    });
  });
  
  return items;
};

export default function SearchDialog({ open, onClose }) {
  const router = useRouter();
  const pathname = usePathname();
  const { selectedMenu } = useAdminMenu();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentPages, setRecentPages] = useState([]);
  const [availableMenus, setAvailableMenus] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef(null);

  // Load recent pages from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(RECENT_PAGES_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          // Don't store icon in localStorage, we'll restore it from available menus
          setRecentPages(parsed);
        }
      } catch (e) {
        console.error('Error loading recent pages:', e);
      }
    }
  }, []);

  // Get available menus based on user type (superadmin or admin)
  useEffect(() => {
    if (selectedMenu) {
      // Admin: get only sub-menus from the currently active menu
      const menuConfig = ADMIN_MENU_CONFIG[selectedMenu];
      if (menuConfig) {
        const menus = menuConfig.subMenus.map((subMenu) => ({
          id: subMenu.id,
          label: subMenu.label,
          href: subMenu.href,
          breadcrumb: `${menuConfig.label} > ${subMenu.label}`,
          type: 'page',
        }));
        setAvailableMenus(menus);
      } else {
        setAvailableMenus([]);
      }
    } else {
      // Superadmin: get menus from SIDEBAR_SECTIONS
      const menus = flattenMenuItems(SIDEBAR_SECTIONS);
      setAvailableMenus(menus);
    }
  }, [selectedMenu]);

  // Filter menus based on search query with loading state
  // Also filter out parent menus that have children (they should not appear in search)
  const filteredMenus = useMemo(() => {
    if (!searchQuery.trim()) {
      return [];
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = availableMenus.filter((menu) =>
      menu.label.toLowerCase().includes(query) ||
      (menu.breadcrumb && menu.breadcrumb.toLowerCase().includes(query))
    );
    
    // Additional filter: remove parent menus that have children
    // Check if this menu is a parent menu by looking at SIDEBAR_SECTIONS
    return filtered.filter((menu) => {
      // Check if this menu is a parent menu with children
      for (const section of SIDEBAR_SECTIONS) {
        for (const item of section.items || []) {
          // If this menu matches a parent item that has children, exclude it
          if ((item.id === menu.id || item.href === menu.href) && item.children && item.children.length > 0) {
            return false; // Exclude parent menu
          }
        }
      }
      return true; // Include this menu
    });
  }, [searchQuery, availableMenus]);

  // Simulate search loading
  useEffect(() => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        setIsSearching(false);
      }, 300); // 300ms delay for search
      return () => clearTimeout(timer);
    } else {
      setIsSearching(false);
    }
  }, [searchQuery]);

  // Combine recent pages and filtered menus
  const displayItems = useMemo(() => {
    if (searchQuery.trim()) {
      return filteredMenus;
    }
    return [];
  }, [searchQuery, filteredMenus]);

  // Handle menu item click
  const handleMenuItemClick = useCallback((menu) => {
    // Create menu data without icon (can't serialize functions)
    const menuData = {
      id: menu.id,
      label: menu.label,
      href: menu.href,
      breadcrumb: menu.breadcrumb,
      type: menu.type,
      timestamp: Date.now(),
    };
    
    // Add to recent pages
    const updatedRecent = [
      menuData,
      ...recentPages.filter((p) => p.href !== menu.href),
    ].slice(0, MAX_RECENT_PAGES);
    
    setRecentPages(updatedRecent);
    
    // Save to localStorage (without icon)
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(RECENT_PAGES_KEY, JSON.stringify(updatedRecent));
      } catch (e) {
        console.error('Error saving recent pages:', e);
      }
    }
    
    // Navigate
    router.push(menu.href);
    onClose();
    setSearchQuery('');
    setSelectedIndex(0);
  }, [recentPages, router, onClose]);

  // Handle remove from recent
  const handleRemoveRecent = useCallback((e, menu) => {
    e.stopPropagation();
    const updated = recentPages.filter((p) => p.href !== menu.href);
    setRecentPages(updated);
    
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(RECENT_PAGES_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Error saving recent pages:', e);
      }
    }
  }, [recentPages]);

  // Get items for keyboard navigation (map recent pages to full menu items)
  const navigationItems = useMemo(() => {
    if (searchQuery.trim()) {
      return displayItems;
    }
    // Map recent pages to full menu items with icons
    const recentWithIcons = recentPages.map(page => {
      const menuItem = availableMenus.find(m => m.id === page.id || m.href === page.href);
      return menuItem || page;
    });
    return recentWithIcons;
  }, [searchQuery, displayItems, recentPages, availableMenus]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
        setSearchQuery('');
        setSelectedIndex(0);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => {
          const maxIndex = navigationItems.length - 1;
          return prev < maxIndex ? prev + 1 : prev;
        });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === 'Enter' && navigationItems[selectedIndex]) {
        e.preventDefault();
        handleMenuItemClick(navigationItems[selectedIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, navigationItems, selectedIndex, handleMenuItemClick, onClose]);

  // Reset selected index when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  // Auto focus input when dialog opens
  useEffect(() => {
    if (open) {
      // Use requestAnimationFrame to ensure dialog is fully rendered
      requestAnimationFrame(() => {
        setTimeout(() => {
          if (searchInputRef.current) {
            searchInputRef.current.focus();
            // Select all text if there's any
            if (searchInputRef.current.select) {
              searchInputRef.current.select();
            }
          }
        }, 150);
      });
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      TransitionProps={{
        onEntered: () => {
          // Focus input after dialog animation completes
          setTimeout(() => {
            if (searchInputRef.current) {
              searchInputRef.current.focus();
            }
          }, 100);
        },
      }}
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '80vh',
          overflow: 'hidden',
        },
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        {/* Search Input */}
        <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
          <TextField
            fullWidth
            autoFocus
            placeholder="Cari menu..."
            inputRef={searchInputRef}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchNormal1 size={20} color="#666" variant="Linear" />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '& fieldset': {
                  borderColor: 'divider',
                },
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main',
                },
              },
            }}
          />
        </Box>

        {/* Content */}
        <Box sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {!searchQuery.trim() ? (
            // No search query - show recent pages or empty state
            <>
              {recentPages.length > 0 ? (
                <Box sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Clock size={16} color="#666" variant="Linear" />
                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase' }}>
                      Recent Pages
                    </Typography>
                  </Box>
                  <List disablePadding>
                    {recentPages.map((page, index) => {
                      const isSelected = index === selectedIndex;
                      return (
                        <ListItem
                          key={page.id}
                          disablePadding
                          sx={{
                            mb: 0.5,
                            borderRadius: 1,
                            bgcolor: isSelected ? 'action.selected' : 'transparent',
                            '&:hover': {
                              bgcolor: 'action.hover',
                            },
                          }}
                        >
                          <ListItemButton
                            onClick={() => handleMenuItemClick(page)}
                            sx={{ borderRadius: 1 }}
                          >
                            <ListItemIcon sx={{ minWidth: 40 }}>
                              <ArrowRight2 size={16} color="#666" variant="Linear" />
                            </ListItemIcon>
                            <ListItemText
                              primary={page.label}
                              primaryTypographyProps={{
                                variant: 'body2',
                                fontWeight: 500,
                              }}
                            />
                            <IconButton
                              size="small"
                              onClick={(e) => handleRemoveRecent(e, page)}
                              sx={{ ml: 1 }}
                            >
                              <CloseCircle size={16} color="#999" variant="Linear" />
                            </IconButton>
                          </ListItemButton>
                        </ListItem>
                      );
                    })}
                  </List>
                </Box>
              ) : (
                // Empty state when no recent pages
                <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
                  <SearchNormal1 size={64} color="#ccc" variant="Linear" />
                  <Typography variant="body1" sx={{ mt: 2, fontWeight: 500, color: 'text.secondary' }}>
                    Belum ada halaman terakhir
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary', textAlign: 'center' }}>
                    Mulai ketik untuk mencari menu atau navigasi ke halaman untuk melihat recent pages
                  </Typography>
                </Box>
              )}
            </>
          ) : isSearching ? (
            // Loading state
            <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <CircularProgress size={24} />
              <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                Mencari menu...
              </Typography>
            </Box>
          ) : displayItems.length > 0 ? (
            // Search results
            <Box sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase' }}>
                  Available Menu
                </Typography>
              </Box>
              <List disablePadding>
                {displayItems.map((menu, index) => {
                  const isSelected = index === selectedIndex;
                  return (
                    <ListItem
                      key={menu.id}
                      disablePadding
                      sx={{
                        mb: 0.5,
                        borderRadius: 1,
                        bgcolor: isSelected ? 'action.selected' : 'transparent',
                        '&:hover': {
                          bgcolor: 'action.hover',
                        },
                      }}
                    >
                      <ListItemButton
                        onClick={() => handleMenuItemClick(menu)}
                        sx={{ borderRadius: 1 }}
                      >
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          <ArrowRight2 size={16} color="#666" variant="Linear" />
                        </ListItemIcon>
                        <ListItemText
                          primary={menu.label}
                          secondary={menu.breadcrumb}
                          primaryTypographyProps={{
                            variant: 'body2',
                            fontWeight: 500,
                          }}
                          secondaryTypographyProps={{
                            variant: 'caption',
                            color: 'text.secondary',
                          }}
                        />
                        <Chip
                          label="Page"
                          size="small"
                          sx={{
                            bgcolor: '#2e7d32',
                            color: 'white',
                            fontSize: '0.65rem',
                            height: 20,
                            '& .MuiChip-label': {
                              px: 1,
                            },
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
            </Box>
          ) : (
            // No results
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 8,
                px: 3,
              }}
            >
              <SearchNormal1 size={64} color="#ccc" variant="Linear" />
              <Typography variant="body1" sx={{ mt: 2, fontWeight: 500, color: 'text.secondary' }}>
                Tidak ada hasil yang ditemukan
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                Coba cari dengan kata kunci yang berbeda
              </Typography>
            </Box>
          )}
        </Box>

        {/* Footer */}
        <Box
          sx={{
            p: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            gap: 2,
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Paper
              sx={{
                px: 1,
                py: 0.5,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                bgcolor: 'action.hover',
                borderRadius: 1,
                boxShadow: "none",
              }}
            >
              <ArrowUp2 size={14} color="#666" variant="Linear" />
              <ArrowDown2 size={14} color="#666" variant="Linear" />
              <Typography variant="caption" sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>
                Navigate
              </Typography>
            </Paper>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Paper
              sx={{
                px: 1,
                py: 0.5,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                bgcolor: 'action.hover',
                borderRadius: 1,
                boxShadow: "none",
              }}
            >
              <Typography variant="caption" sx={{ fontSize: '0.75rem', color: 'text.secondary', fontWeight: 600 }}>
                ENTER
              </Typography>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>
                Select
              </Typography>
            </Paper>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Paper
              sx={{
                px: 1,
                py: 0.5,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                bgcolor: 'action.hover',
                borderRadius: 1,
                boxShadow: "none",
              }}
            >
              <Typography variant="caption" sx={{ fontSize: '0.7rem', color: 'text.secondary', fontWeight: 600 }}>
                ESC
              </Typography>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>
                Close
              </Typography>
            </Paper>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
