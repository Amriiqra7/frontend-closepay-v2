'use client';

import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
} from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { SearchNormal1 } from 'iconsax-react';
import MainCard from '@/shared/ui/MainCard';

// Mock data - replace with actual API call
const mockMenuData = [
  { id: 1, namaDefault: 'Scan Barcode', namaKustomID: 'Pindai Barcode', namaKustomEN: 'Scan Barcode' },
  { id: 2, namaDefault: 'Generate Barcode', namaKustomID: 'Buat Barcode', namaKustomEN: 'Generate Barcode' },
  { id: 3, namaDefault: 'Marketplace', namaKustomID: 'Toko Online', namaKustomEN: 'Online Shop' },
  { id: 4, namaDefault: 'Rent', namaKustomID: 'Penyewaan', namaKustomEN: 'Rent' },
  { id: 5, namaDefault: 'Pos', namaKustomID: 'Sistem Kasir', namaKustomEN: 'Poin of Sales' },
  { id: 6, namaDefault: 'Fnb', namaKustomID: 'FNB', namaKustomEN: 'FNB' },
  { id: 7, namaDefault: 'Topup Member', namaKustomID: 'Topup Member', namaKustomEN: 'Top-Up Member' },
  { id: 8, namaDefault: 'Mutation', namaKustomID: 'Mutasi', namaKustomEN: 'Mutation' },
  { id: 9, namaDefault: 'Invoice', namaKustomID: 'Tagihan', namaKustomEN: 'Invoice' },
  { id: 10, namaDefault: 'Withdraw Balance', namaKustomID: 'Pencairan Saldo', namaKustomEN: 'Withdraw Balance' },
  { id: 11, namaDefault: 'Finance Management', namaKustomID: 'Manajemen Keuangan', namaKustomEN: 'Finance Management' },
  { id: 12, namaDefault: 'Check Balance', namaKustomID: 'Cek Saldo', namaKustomEN: 'Check Balance' },
  { id: 13, namaDefault: 'Card Transaction', namaKustomID: 'Transaksi Kartu', namaKustomEN: 'Card Transaction' },
  { id: 14, namaDefault: 'Fast Trx', namaKustomID: 'Tansaksi Cepat', namaKustomEN: 'Fast Transaction' },
  { id: 15, namaDefault: 'Top Up Va', namaKustomID: 'TOP UP VA', namaKustomEN: 'Top-Up VA' },
  { id: 16, namaDefault: 'Distribusi Bantuan', namaKustomID: 'Distribusi Bantuan', namaKustomEN: 'Distribution Care' },
  { id: 17, namaDefault: 'Trip Tour', namaKustomID: 'Trip & Tour', namaKustomEN: 'Trip & Tour' },
  { id: 18, namaDefault: 'Data Transaksi', namaKustomID: 'Data Transaksi', namaKustomEN: 'Transaction' },
  { id: 19, namaDefault: 'Qris', namaKustomID: 'QRIS', namaKustomEN: 'QRIS' },
  { id: 20, namaDefault: 'Offline Transaction', namaKustomID: 'Transaksi Luring', namaKustomEN: 'Offline Transaction' },
  { id: 21, namaDefault: 'Transfer Antar Merchant', namaKustomID: 'Transfer ke Merchant', namaKustomEN: 'Transfer to Merchant' },
  { id: 22, namaDefault: 'Bank Sampah', namaKustomID: 'Bank Sampah', namaKustomEN: 'Waste Bank' },
];

export default function CompanyAturNamaMenuAppMerchant() {
  const params = useParams();
  const router = useRouter();
  const companyId = params?.id;

  const [menuList, setMenuList] = useState(mockMenuData);
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  // Filter menu berdasarkan search
  const filteredMenuList = useMemo(() => {
    if (!searchValue) return menuList;
    const searchLower = searchValue.toLowerCase();
    return menuList.filter(
      (menu) =>
        menu.namaDefault.toLowerCase().includes(searchLower) ||
        menu.namaKustomID.toLowerCase().includes(searchLower) ||
        menu.namaKustomEN.toLowerCase().includes(searchLower)
    );
  }, [menuList, searchValue]);

  const handleChange = (id, field, value) => {
    setMenuList((prev) =>
      prev.map((menu) =>
        menu.id === id ? { ...menu, [field]: value } : menu
      )
    );
  };

  const handleAtur = () => {
    setIsEditMode(true);
  };

  const handleBatal = () => {
    setIsEditMode(false);
    // Reset to original data
    setMenuList(mockMenuData);
  };

  const handleSimpan = () => {
    console.log('Saving menu names:', menuList);
    setIsEditMode(false);
    // TODO: Replace with actual API call
  };

  const handleKembali = () => {
    router.back();
  };

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <MainCard content={false} sx={{ p: 0, boxShadow: 0 }}>
        <Box sx={{ p: 3 }}>
          {/* Search */}
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Cari nama menu..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchNormal1 size={20} color="currentColor" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: '0.875rem',
                },
              }}
            />
          </Box>

          {/* Menu List */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: 2.5,
              mb: 3,
            }}
          >
            {/* Header */}
            <Box>
              <Typography
                variant="body2"
                sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}
              >
                Nama Menu Default
              </Typography>
            </Box>
            <Box>
              <Typography
                variant="body2"
                sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}
              >
                Kustom Nama Menu ID
              </Typography>
            </Box>
            <Box>
              <Typography
                variant="body2"
                sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}
              >
                Kustom Nama Menu En
              </Typography>
            </Box>

            {/* Menu Items */}
            {filteredMenuList.map((menu) => (
              <React.Fragment key={menu.id}>
                <TextField
                  fullWidth
                  size="small"
                  value={menu.namaDefault}
                  disabled
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontSize: '0.875rem',
                      bgcolor: 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                />
                <Box sx={{ position: 'relative' }}>
                  <TextField
                    fullWidth
                    size="small"
                    value={menu.namaKustomID}
                    onChange={(e) => handleChange(menu.id, 'namaKustomID', e.target.value)}
                    disabled={!isEditMode}
                    inputProps={{ maxLength: 20 }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        fontSize: '0.875rem',
                      },
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      position: 'absolute',
                      right: 8,
                      bottom: 8,
                      fontSize: '0.75rem',
                      color: 'text.secondary',
                    }}
                  >
                    {menu.namaKustomID.length}/20
                  </Typography>
                </Box>
                <Box sx={{ position: 'relative' }}>
                  <TextField
                    fullWidth
                    size="small"
                    value={menu.namaKustomEN}
                    onChange={(e) => handleChange(menu.id, 'namaKustomEN', e.target.value)}
                    disabled={!isEditMode}
                    inputProps={{ maxLength: 20 }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        fontSize: '0.875rem',
                      },
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      position: 'absolute',
                      right: 8,
                      bottom: 8,
                      fontSize: '0.75rem',
                      color: 'text.secondary',
                    }}
                  >
                    {menu.namaKustomEN.length}/20
                  </Typography>
                </Box>
              </React.Fragment>
            ))}
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            {!isEditMode ? (
              <>
                <Button
                  variant="outlined"
                  onClick={handleKembali}
                  sx={{
                    textTransform: 'none',
                    color: 'error.main',
                    borderColor: 'error.main',
                    px: 3,
                    '&:hover': {
                      borderColor: 'error.main',
                      bgcolor: 'error.lighter',
                    },
                  }}
                >
                  Kembali
                </Button>
                <Button
                  variant="contained"
                  onClick={handleAtur}
                  sx={{
                    textTransform: 'none',
                    bgcolor: '#155DFC',
                    px: 3,
                    '&:hover': {
                      bgcolor: '#0f4fc7',
                    },
                  }}
                >
                  Atur
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outlined"
                  onClick={handleBatal}
                  sx={{
                    textTransform: 'none',
                    color: 'error.main',
                    borderColor: 'error.main',
                    px: 3,
                    '&:hover': {
                      borderColor: 'error.main',
                      bgcolor: 'error.lighter',
                    },
                  }}
                >
                  Batal
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSimpan}
                  sx={{
                    textTransform: 'none',
                    bgcolor: '#155DFC',
                    px: 3,
                    '&:hover': {
                      bgcolor: '#0f4fc7',
                    },
                  }}
                >
                  Simpan
                </Button>
              </>
            )}
          </Box>
        </Box>
      </MainCard>
    </Box>
  );
}
