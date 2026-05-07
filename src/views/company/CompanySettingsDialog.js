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
  Key,
  Wallet3,
  MoneyRecive,
  Profile2User,
  Copyright,
  Hierarchy,
  Lock1,
  Google,
  Buildings2,
  Clock,
  DocumentText,
  Timer,
  SecuritySafe,
  Eye,
  Sms,
  User,
} from 'iconsax-react';

// Menu items untuk pengaturan lainnya
const settingsMenuItems = [
  { 
    id: 'credential-rekening', 
    label: 'Credential Rekening Perusahaan', 
    icon: Key,
  },
  { 
    id: 'kustom-nama-saldo', 
    label: 'Kustom Nama Saldo Internal Perusahaan', 
    icon: Wallet3,
  },
  { 
    id: 'limit-topup', 
    label: 'Atur Limit Top Up', 
    icon: MoneyRecive,
  },
  { 
    id: 'perizinan-login', 
    label: 'Perizinan Login User', 
    icon: Profile2User,
  },
  { 
    id: 'icon-powered-by', 
    label: 'Konfigurasi Icon Powered By', 
    icon: Copyright,
  },
  { 
    id: 'akun-induk', 
    label: 'Konfigurasi Akun Induk', 
    icon: Hierarchy,
  },
  { 
    id: 'otp-login', 
    label: 'Konfigurasi Perizinan OTP Login', 
    icon: Lock1,
  },
  { 
    id: 'google-login', 
    label: 'Konfigurasi Login Member dengan Google', 
    icon: Google,
  },
  { 
    id: 'topup-va', 
    label: 'Konfigurasi Metode Top Up VA', 
    icon: Buildings2,
  },
  { 
    id: 'waktu-withdrawal', 
    label: 'Konfigurasi Waktu Withdrawal', 
    icon: Clock,
  },
  { 
    id: 'auto-payment', 
    label: 'Konfigurasi Auto-Payment Invoice', 
    icon: DocumentText,
  },
  { 
    id: 'settlement-qris', 
    label: 'Konfigurasi Waktu Settlement QRIS', 
    icon: Timer,
  },
  { 
    id: 'kekuatan-password', 
    label: 'Konfigurasi Kekuatan Kata Sandi', 
    icon: SecuritySafe,
  },
  { 
    id: 'penawaran-email-telepon', 
    label: 'Konfigurasi Penawaran Email & Telepon', 
    icon: Eye,
  },
  { 
    id: 'kustom-nama-pengirim', 
    label: 'Konfigurasi Kustom Nama Pengirim Email', 
    icon: Sms,
  },
  { 
    id: 'akun-peran-hak-akses', 
    label: 'Konfigurasi Akun Peran Hak Akses', 
    icon: User,
  },
];

export default function CompanySettingsDialog({
  open,
  onClose,
  companyName,
  companyId,
  onMenuClick,
}) {
  const handleMenuClick = (menuId) => {
    if (onMenuClick) {
      onMenuClick(menuId, companyId);
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
        Pengaturan Lainnya
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        {companyName && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Pengaturan lainnya untuk perusahaan {companyName}.
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
          {settingsMenuItems.map((menu) => {
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
