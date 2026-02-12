'use client';

import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Avatar, IconButton, Menu, MenuItem, Box, Divider, useTheme, Button, TextField, InputAdornment, Paper } from '@mui/material';
import { ArrowDown2, HambergerMenu, Profile, Setting2, LogoutCurve, ArrowLeft2, SearchNormal1, Menu as MenuIcon } from 'iconsax-react';
import { useAdminMenu } from '@/core/contexts/AdminMenuContext';
import { useRouter } from 'next/navigation';
import SearchDialog from '@/shared/ui/SearchDialog';
import AdminMenuDialog from '@/features/admin-monitor/components/AdminMenuDialog';

export default function Header({ 
  drawerWidth, 
  collapsedDrawerWidth, 
  desktopExpanded, 
  onDrawerToggle 
}) {
  const theme = useTheme();
  const router = useRouter();
  const { selectedMenu, selectedCompany, clearAdminMenu, setAdminMenu } = useAdminMenu();
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [menuDialogOpen, setMenuDialogOpen] = useState(false);

  // Handle Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchDialogOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleBackToSuperadmin = () => {
    clearAdminMenu();
    router.push('/monitor-admin-dashboard');
  };

  const handleOpenMenuDialog = () => {
    setMenuDialogOpen(true);
  };

  const handleAdminMenuClick = (menuId) => {
    setMenuDialogOpen(false);
    // Set admin menu dengan company yang sudah dipilih
    if (selectedCompany) {
      setAdminMenu(menuId, selectedCompany);
      // Redirect ke dashboard jika belum di dashboard
      router.push('/dashboard');
    }
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          left: {
            sm: desktopExpanded ? drawerWidth : collapsedDrawerWidth,
          },
          width: {
            sm: desktopExpanded
              ? `calc(100% - ${drawerWidth}px)`
              : `calc(100% - ${collapsedDrawerWidth}px)`,
          },
          bgcolor: 'white',
          boxShadow: 'none',
          borderBottom: '1px dashed #b0b0b0',
          transition: 'left 120ms ease, width 120ms ease',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: '80px !important', py: 2.1, px: { xs: 2, sm: 2 } }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={onDrawerToggle}
            sx={{ 
              color: 'text.primary',
              bgcolor: 'grey.100',
              ml: { xs: 0, sm: 0 },
              mr: { xs: 1, sm: 2 },
              '&:hover': {
                bgcolor: 'grey.200',
              },
            }}
          >
            <HambergerMenu size={26} color={theme.palette.text.secondary} variant="Linear" />
          </IconButton>
          
          {/* Search Bar */}
          <Box
            sx={{
              flex: 1,
              maxWidth: 400,
              display: { xs: 'none', md: 'block' },
            }}
          >
            <TextField
              fullWidth
              placeholder="Search menu..."
              size="medium"
              value=""
              readOnly
              onClick={() => setSearchDialogOpen(true)}
              onFocus={(e) => e.target.blur()}
              InputProps={{
                readOnly: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchNormal1 size={20} color="#999" variant="Linear" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                      <Paper
                        component="span"
                        sx={{
                          px: 0.75,
                          py: 0.25,
                          bgcolor: 'action.hover',
                          boxShadow: 'none',
                          borderRadius: 0.75,
                          display: 'inline-flex',
                          alignItems: 'center',
                        }}
                      >
                        <Typography variant="caption" sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>
                          Ctrl
                        </Typography>
                      </Paper>
                      <Paper
                        component="span"
                        sx={{
                          px: 0.75,
                          py: 0.25,
                          bgcolor: 'action.hover',
                          boxShadow: 'none',
                          borderRadius: 0.75,
                          display: 'inline-flex',
                          alignItems: 'center',
                        }}
                      >
                        <Typography variant="caption" sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>
                          K
                        </Typography>
                      </Paper>
                    </Box>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  border: "1px solid #d9d9d9",
                  cursor: 'pointer',
                  height: '48px', // Increased height
                  '& fieldset': {
                    borderColor: 'transparent',
                  },
                  '&:hover fieldset': {
                    borderColor: '#d9d9d9',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#d9d9d9',
                  },
                },
                '& .MuiInputBase-input': {
                  cursor: 'pointer',
                  py: 1.5, // Increased vertical padding
                },
              }}
            />
          </Box>

          <Box sx={{ flexGrow: 1 }} />
          
          {/* Button Menu dan Kembali ke Superadmin - hanya muncul jika ada selectedMenu */}
          {selectedMenu && (
            <>
              <Button
                variant="contained"
                startIcon={<MenuIcon size={18} variant="Linear" color="#155DFC" />}
                onClick={handleOpenMenuDialog}
                sx={{
                  textTransform: 'none',
                  fontWeight: 400,
                  fontSize: { xs: '0.8rem', sm: '0.9rem' },
                  px: { xs: 1.5, sm: 2.5 },
                  py: 1.25,
                  mr: { xs: 0.5, sm: 1 },
                  display: { xs: 'none', md: 'flex' },
                  bgcolor: 'rgba(21, 93, 252, 0.1)',
                  color: '#155DFC',
                  boxShadow: 'none',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    bgcolor: 'rgba(21, 93, 252, 0.15)',
                    boxShadow: 'none',
                  },
                }}
              >
                Menu
              </Button>
              <Button
                variant="contained"
                startIcon={<ArrowLeft2 size={18} variant="Linear" color="#155DFC" />}
                onClick={handleBackToSuperadmin}
                sx={{
                  textTransform: 'none',
                  fontWeight: 400,
                  fontSize: { xs: '0.8rem', sm: '0.9rem' },
                  px: { xs: 1.5, sm: 2.5 },
                  py: 1.25,
                  mr: { xs: 0.5, sm: 1 },
                  display: { xs: 'none', md: 'flex' },
                  bgcolor: 'rgba(21, 93, 252, 0.1)',
                  color: '#155DFC',
                  boxShadow: 'none',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    bgcolor: 'rgba(21, 93, 252, 0.15)',
                    boxShadow: 'none',
                  },
                }}
              >
                Kembali ke Superadmin
              </Button>
            </>
          )}
          
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1.5, 
              cursor: 'pointer',
              px: 1.5,
              py: 0.75,
              borderRadius: 2,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                bgcolor: 'action.hover',
              }
            }} 
            onClick={handleMenuClick}
          >
            <Avatar 
              sx={{ 
                width: 42, 
                height: 42, 
                bgcolor: '#155DFC',
                fontWeight: 400,
                fontSize: '0.95rem',
                boxShadow: 'none',
              }}
            >
              PC
            </Avatar>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: 400, 
                  color: 'text.primary',
                  lineHeight: 1.2,
                  mb: 0.25
                }}
              >
                Petr Cech UPN
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'text.secondary', 
                  fontSize: '0.75rem',
                  display: 'block',
                  lineHeight: 1.2
                }}
              >
                Admin
              </Typography>
            </Box>
            <ArrowDown2 
              size="18" 
              color={theme.palette.text.secondary}
              style={{
                transition: 'transform 0.2s ease-in-out',
                transform: anchorEl ? 'rotate(180deg)' : 'rotate(0deg)'
              }}
            />
          </Box>
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          elevation: 0,
          sx: {
            mt: 1.5,
            minWidth: 200,
            borderRadius: 2,
            boxShadow: 'none',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5, bgcolor: 'action.hover' }}>
          <Typography variant="body2" sx={{ fontWeight: 400, color: 'text.primary', mb: 0.25 }}>
            Petr Cech UPN
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
            Admin
          </Typography>
        </Box>
        <Divider />
        <MenuItem 
          onClick={handleMenuClose}
          sx={{
            py: 1.25,
            px: 2,
            gap: 1.5,
            '&:hover': {
              bgcolor: 'action.hover',
            }
          }}
        >
          <Profile size={20} color={theme.palette.text.secondary} variant="Linear" />
          <Typography variant="body2" sx={{ color: 'text.primary' }}>
            Profile
          </Typography>
        </MenuItem>
        <MenuItem 
          onClick={handleMenuClose}
          sx={{
            py: 1.25,
            px: 2,
            gap: 1.5,
            '&:hover': {
              bgcolor: 'action.hover',
            }
          }}
        >
          <Setting2 size={20} color={theme.palette.text.secondary} variant="Linear" />
          <Typography variant="body2" sx={{ color: 'text.primary' }}>
            Settings
          </Typography>
        </MenuItem>
        
        {/* Kembali ke Superadmin - hanya muncul di mobile jika ada selectedMenu */}
        {selectedMenu && (
          <Divider sx={{ display: { xs: 'block', md: 'none' } }} />
        )}
        {selectedMenu && (
          <MenuItem 
            onClick={() => {
              handleBackToSuperadmin();
              handleMenuClose();
            }}
            sx={{
              py: 1.25,
              px: 2,
              gap: 1.5,
              display: { xs: 'flex', md: 'none' },
              bgcolor: 'rgba(21, 93, 252, 0.05)',
              '&:hover': {
                bgcolor: 'rgba(21, 93, 252, 0.1)',
              }
            }}
          >
            <ArrowLeft2 size={20} color="#155DFC" variant="Linear" />
            <Typography variant="body2" sx={{ color: '#155DFC', fontWeight: 400 }}>
              Kembali ke Superadmin
            </Typography>
          </MenuItem>
        )}
        
        <Divider />
        <MenuItem 
          onClick={handleMenuClose}
          sx={{
            py: 1.25,
            px: 2,
            gap: 1.5,
            color: '#d32f2f',
            '&:hover': {
              bgcolor: 'rgba(211, 47, 47, 0.08)',
            }
          }}
        >
          <LogoutCurve size={20} color="#d32f2f" variant="Linear" />
          <Typography variant="body2" sx={{ color: '#d32f2f', fontWeight: 400 }}>
            Logout
          </Typography>
        </MenuItem>
      </Menu>

      {/* Search Dialog */}
      <SearchDialog
        open={searchDialogOpen}
        onClose={() => setSearchDialogOpen(false)}
      />

      {/* Admin Menu Dialog */}
      {selectedMenu && selectedCompany && (
        <AdminMenuDialog
          open={menuDialogOpen}
          onClose={() => setMenuDialogOpen(false)}
          onMenuClick={handleAdminMenuClick}
        />
      )}
    </>
  );
}
