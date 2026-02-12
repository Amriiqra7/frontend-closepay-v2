'use client';

import React from 'react';
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import {
  Monitor,
  Mobile,
  Shop,
} from 'iconsax-react';

// Menu items untuk pengaturan kustom nama menu
const menuSettingsItems = [
  { 
    id: 'nama-menu-web-admin', 
    label: 'Atur Nama Menu Web Admin', 
    icon: Monitor,
  },
  { 
    id: 'nama-menu-app-member', 
    label: 'Atur Nama Menu Aplikasi Member', 
    icon: Mobile,
  },
  { 
    id: 'nama-menu-app-merchant', 
    label: 'Atur Nama Menu Aplikasi Merchant', 
    icon: Shop,
  },
  { 
    id: 'menu-app-member', 
    label: 'Atur Menu Aplikasi Member', 
    icon: Mobile,
  },
  { 
    id: 'menu-app-merchant', 
    label: 'Atur Menu Aplikasi Merchant', 
    icon: Shop,
  },
];

export default function CompanyMenuSettingsDialog({
  open,
  onClose,
  companyName,
  onMenuClick,
}) {
  const handleMenuClick = (menuId) => {
    if (onMenuClick) {
      onMenuClick(menuId);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 400,
          pb: 1,
        }}
      >
        Pengaturan Kustom Nama Menu
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        {companyName && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Terapkan kustom nama menu untuk perusahaan {companyName}.
          </Typography>
        )}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(2, 1fr)',
            },
            gap: 2,
          }}
        >
          {menuSettingsItems.map((menu) => {
            const IconComponent = menu.icon;
            return (
              <Card
                key={menu.id}
                sx={{
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  border: '1px solid',
                  borderColor: 'rgba(0, 0, 0, 0.12)',
                  borderRadius: 2,
                  boxShadow: 'none',
                  bgcolor: 'rgba(0, 0, 0, 0.02)',
                  '&:hover': {
                    bgcolor: 'rgba(21, 93, 252, 0.08)',
                    borderColor: 'rgba(21, 93, 252, 0.4)',
                    '& .menu-icon': {
                      color: '#155DFC !important',
                    },
                    '& .menu-label': {
                      color: '#155DFC !important',
                    },
                  },
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                onClick={() => handleMenuClick(menu.id)}
              >
                <CardContent
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    p: 2.5,
                  }}
                >
                  <Box
                    className="menu-icon"
                    sx={{
                      color: '#4a4a4a',
                      transition: 'color 0.2s ease-in-out',
                      '& svg': {
                        color: 'inherit',
                      },
                    }}
                  >
                    <IconComponent
                      size={24}
                      variant="Bulk"
                      color="currentColor"
                    />
                  </Box>
                  <Typography
                    variant="subtitle2"
                    fontWeight={400}
                    className="menu-label"
                    sx={{
                      fontSize: '0.875rem',
                      color: '#4a4a4a',
                      transition: 'color 0.2s ease-in-out',
                      flex: 1,
                    }}
                  >
                    {menu.label}
                  </Typography>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      </DialogContent>
      <Box sx={{ p: 3, pt: 0, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          color="error"
          onClick={onClose}
          sx={{
            textTransform: 'none',
          }}
        >
          Kembali
        </Button>
      </Box>
    </Dialog>
  );
}
