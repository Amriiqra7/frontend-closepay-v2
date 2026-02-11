'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Autocomplete,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import { keyframes } from '@mui/system';
import { useRouter } from 'next/navigation';
import MainCard from '@/components/MainCard';
import { useAdminMenu } from '@/contexts/AdminMenuContext';
import {
  Monitor,
  Home2,
  Setting2,
  Wallet3,
  DocumentText,
  Receipt21,
  Shop,
  CardSend,
  MoneyRecive,
  Buildings2,
  InfoCircle,
  Game,
  Eye,
  Trash,
  Money4,
  Book,
  Code1,
  Hierarchy,
  TransactionMinus,
  Flash,
} from 'iconsax-react';

// Mock data untuk dropdown companies
// TODO: Replace dengan API call
const mockCompanies = [
  { id: 1, nama: 'PT Bougenvile Blok' },
  { id: 2, nama: 'PT Kantin FKi 12' },
  { id: 3, nama: 'PT Perusahaan ABC' },
  { id: 4, nama: 'CV XYZ Indonesia' },
  { id: 5, nama: 'PT Global Tech Solutions' },
];

// Menu items untuk admin dashboard
const adminMenuItems = [
  { 
    id: 'utama', 
    label: 'Utama', 
    description: 'Data Perusahaan, Data User, Personalisasi Perusahaan, Data Menu',
    icon: Home2, 
    route: '/admin/utama' 
  },
  { 
    id: 'advance', 
    label: 'Advance', 
    description: 'Semua Fitur ditampilkan',
    icon: Setting2, 
    route: '/admin/advance' 
  },
  { 
    id: 'balance', 
    label: 'Manajemen Saldo', 
    description: 'Data Saldo, Data Mutasi, Rekening Perusahaan, Konfigurasi Saldo, Data Log VA',
    icon: Wallet3, 
    route: '/admin/balance' 
  },
  { 
    id: 'invoice', 
    label: 'Manajemen Tagihan', 
    description: 'Tagihan Master, Tagihan Tunggal, Data Tagihan',
    icon: DocumentText, 
    route: '/admin/invoice' 
  },
  { 
    id: 'retribusi', 
    label: 'Retribusi', 
    description: 'Atur Petugas Retribusi, Kode QR Merchant, Konfigurasi Template Retribusi, Data Tagihan Retribusi',
    icon: Receipt21, 
    route: '/admin/retribusi' 
  },
  { 
    id: 'merchant-kso', 
    label: 'Merchant KSO', 
    description: 'Merchant bagi hasil',
    icon: Shop, 
    route: '/admin/merchant-kso' 
  },
  { 
    id: 'virtual-card', 
    label: 'Manajemen Kartu', 
    description: 'Ketentuan Kartu, Kustom Template Kartu Virtual, Biaya Admin Kartu, Data Kartu Virtual, Data Transaksi Kartu',
    icon: CardSend, 
    route: '/admin/virtual-card' 
  },
  { 
    id: 'payment-gateway', 
    label: 'Manajemen Payment Gateway', 
    description: 'Konfigurasi Checkoutlink, Konfigurasi Saldo',
    icon: MoneyRecive, 
    route: '/admin/payment-gateway' 
  },
  { 
    id: 'marketplace', 
    label: 'Manajemen Marketplace dan Sistem Kasir', 
    description: 'Data Marketplace, Data Kasir, Data Produk',
    icon: Buildings2, 
    route: '/admin/marketplace' 
  },
  { 
    id: 'donasi-zakat', 
    label: 'Manajemen Donasi dan Zakat', 
    description: 'Data Donasi, Data Zakat',
    icon: Money4, 
    route: '/admin/donasi-zakat' 
  },
  { 
    id: 'info-berita', 
    label: 'Manajemen Info dan Berita', 
    description: 'Data Info, Data Berita, Data Push Notification, Data Riwayat Notifikasi',
    icon: InfoCircle, 
    route: '/admin/info-berita' 
  },
  { 
    id: 'sport-center', 
    label: 'Manajemen Sport Center', 
    description: 'Data Penyewaan',
    icon: Game, 
    route: '/admin/sport-center' 
  },
  { 
    id: 'fnb', 
    label: 'Manajemen FnB', 
    description: 'Data FnB',
    icon: Shop, 
    route: '/admin/fnb' 
  },
  { 
    id: 'aksesibilitas', 
    label: 'Manajemen Aksesibilitas', 
    description: 'Data Perangkat, Data Presensi, Data Akses',
    icon: Eye, 
    route: '/admin/aksesibilitas' 
  },
  { 
    id: 'bank-sampah', 
    label: 'Manajemen Bank Sampah', 
    description: 'Data Bank Sampah',
    icon: Trash, 
    route: '/admin/bank-sampah' 
  },
  { 
    id: 'payroll', 
    label: 'Manajemen Payroll', 
    description: 'Data Presensi, Data Pembayaran karyawan, Buat Payroll',
    icon: DocumentText, 
    route: '/admin/payroll' 
  },
  { 
    id: 'lms', 
    label: 'Manajemen Pembelajaran / LMS', 
    description: 'Data LMS',
    icon: Book, 
    route: '/admin/lms' 
  },
  { 
    id: 'integrasi', 
    label: 'Manajemen Integrasi', 
    description: 'Pengaturan Credentials, Riwayat Callback',
    icon: Code1, 
    route: '/admin/integrasi' 
  },
  { 
    id: 'sub-company', 
    label: 'Manajemen Sub-Company', 
    description: 'Manajemen Sub-Company',
    icon: Hierarchy, 
    route: '/admin/sub-company' 
  },
  { 
    id: 'transaksi', 
    label: 'Manajemen Transaksi', 
    description: 'Transaksi Qriss, Transaksi Barcode, Top Up Member Via Merchant, Top Up User Manual, Pencairan User Manual, VA Debit',
    icon: TransactionMinus, 
    route: '/admin/transaksi' 
  },
  { 
    id: 'ppob', 
    label: 'Manajemen PPOB', 
    description: 'Manajemen PPOB',
    icon: Flash, 
    route: '/admin/ppob' 
  },
];

const popInAnimation = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.95);
  }
  75% {
    transform: scale(1.02);
  }
  100% {
    transform: scale(1);
  }
`;

export default function MonitorAdminDashboard() {
  const router = useRouter();
  const { setAdminMenu } = useAdminMenu();
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [animatePop, setAnimatePop] = useState(false);

  const handleCompanyChange = (_, newValue) => {
    setSelectedCompany(newValue);
  };

  const handlePindah = () => {
    if (selectedCompany) {
      setOpenDialog(true);
      setAnimatePop(false);
    }
  };

  const handleMenuClick = (menuId) => {
    setOpenDialog(false);
    // Set admin menu context and redirect to dashboard
    // Sidebar will automatically change based on the selected menu
    setAdminMenu(menuId, selectedCompany);
    router.push('/dashboard');
  };

  const handleBackdropClick = (event, reason) => {
    // Prevent closing dialog
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
      event.preventDefault();
      // Trigger pop-in animation
      setAnimatePop(true);
      setTimeout(() => {
        setAnimatePop(false);
      }, 300);
    }
  };

  return (
    <>
      <MainCard content={false}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight="bold" mb={3}>
            Monitor Admin Dashboard
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
            Pilih perusahaan untuk mengakses dashboard admin
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <Box sx={{ flex: 1 }}>
              <Autocomplete
                fullWidth
                size="large"
                options={mockCompanies}
                getOptionLabel={(option) => option?.nama || ''}
                isOptionEqualToValue={(option, value) => option?.id === value?.id}
                value={selectedCompany}
                onChange={handleCompanyChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Pilih perusahaan"
                    size="large"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: '56px',
                        '&:hover fieldset': {
                          borderColor: 'primary.main',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'primary.main',
                        },
                      },
                    }}
                  />
                )}
              />
            </Box>
            <Button
              variant="contained"
              size="large"
              onClick={handlePindah}
              disabled={!selectedCompany}
              sx={{
                height: '56px',
                minWidth: 120,
              }}
            >
              Pindah
            </Button>
          </Box>
        </Box>
      </MainCard>

      {/* Dialog Menu Cards */}
      <Dialog
        open={openDialog}
        onClose={handleBackdropClick}
        maxWidth="md"
        fullWidth
        disableEscapeKeyDown
        PaperProps={{
          sx: {
            borderRadius: 2,
            ...(animatePop && {
              animation: `${popInAnimation} 0.3s ease-in-out`,
            }),
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 600,
            pb: 1,
          }}
        >
          Pilih Menu Admin Dashboard
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              },
              gap: 2,
            }}
          >
            {adminMenuItems.map((menu) => {
              const IconComponent = menu.icon;
              return (
                <Card
                  key={menu.id}
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    '&:hover': {
                      boxShadow: 4,
                      borderColor: 'primary.main',
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
                      flexDirection: 'column',
                      gap: 1.5,
                      p: 2.5,
                      flex: 1,
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        mb: 0.5,
                      }}
                    >
                      <IconComponent
                        size={24}
                        variant="Bulk"
                        color="#080808"
                      />
                      <Typography
                        variant="subtitle2"
                        fontWeight={600}
                        sx={{
                          fontSize: '0.875rem',
                          color: '#080808',
                        }}
                      >
                        {menu.label}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: '0.75rem',
                        lineHeight: 1.5,
                        color: 'text.secondary',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {menu.description}
                    </Typography>
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
