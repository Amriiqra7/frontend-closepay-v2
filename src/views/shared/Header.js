'use client';

import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Avatar, IconButton, Menu, MenuItem, Box, Divider, useTheme } from '@mui/material';
import { ArrowDown2, HambergerMenu, Profile, Setting2, LogoutCurve, ArrowLeft2 } from 'iconsax-react';
import { useAdminMenu } from '@/contexts/AdminMenuContext';
import { useRouter } from 'next/navigation';

export default function Header({ 
  drawerWidth, 
  collapsedDrawerWidth, 
  desktopExpanded, 
  onDrawerToggle 
}) {
  const theme = useTheme();
  const router = useRouter();
  const { selectedMenu, clearAdminMenu } = useAdminMenu();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleBackToSuperadmin = () => {
    clearAdminMenu();
    handleMenuClose();
    router.push('/dashboard');
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
          borderBottom: `1px solid ${theme.palette.divider}`,
          transition: 'left 120ms ease, width 120ms ease',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={onDrawerToggle}
            sx={{ mr: 2, color: 'text.primary' }}
          >
            <HambergerMenu size={24} color={theme.palette.text.primary} variant="Linear" />
          </IconButton>
          
          <Box sx={{ flexGrow: 1 }} />
          
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
                bgcolor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                fontWeight: 600,
                fontSize: '0.95rem',
                boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
              }}
            >
              PC
            </Avatar>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: 600, 
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
          elevation: 8,
          sx: {
            mt: 1.5,
            minWidth: 200,
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(0, 0, 0, 0.05)',
            overflow: 'hidden',
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5, bgcolor: 'action.hover' }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.25 }}>
            Petr Cech UPN
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
            Admin
          </Typography>
        </Box>
        <Divider />
        {selectedMenu && (
          <MenuItem 
            onClick={handleBackToSuperadmin}
            sx={{
              py: 1.25,
              px: 2,
              gap: 1.5,
              '&:hover': {
                bgcolor: 'action.hover',
              }
            }}
          >
            <ArrowLeft2 size={20} color={theme.palette.primary.main} variant="Linear" />
            <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 500 }}>
              Kembali ke Superadmin
            </Typography>
          </MenuItem>
        )}
        {selectedMenu && <Divider />}
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
          <Typography variant="body2" sx={{ color: '#d32f2f', fontWeight: 500 }}>
            Logout
          </Typography>
        </MenuItem>
      </Menu>
    </>
  );
}
