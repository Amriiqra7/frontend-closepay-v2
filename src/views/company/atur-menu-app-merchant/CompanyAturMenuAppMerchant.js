'use client';

import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Switch,
  InputAdornment,
} from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { SearchNormal1 } from 'iconsax-react';
import MainCard from '@/shared/ui/MainCard';

// Mock data - replace with actual API call
const mockMenuData = [
  { id: 1, nama: 'Pindai Barcode', enabled: true },
  { id: 2, nama: 'Buat Barcode', enabled: true },
  { id: 3, nama: 'Toko Online', enabled: true },
  { id: 4, nama: 'Penyewaan', enabled: true },
  { id: 5, nama: 'Sistem Kasir', enabled: true },
  { id: 6, nama: 'FNB', enabled: true },
  { id: 7, nama: 'Topup Member', enabled: true },
  { id: 8, nama: 'Mutasi', enabled: true },
  { id: 9, nama: 'Tagihan', enabled: true },
  { id: 10, nama: 'Pencairan Saldo', enabled: true },
  { id: 11, nama: 'Manajemen Keuangan', enabled: true },
  { id: 12, nama: 'Cek Saldo', enabled: true },
  { id: 13, nama: 'Transaksi Kartu', enabled: true },
  { id: 14, nama: 'Transaksi Cepat', enabled: true },
  { id: 15, nama: 'TOP UP VA', enabled: true },
  { id: 16, nama: 'Distribusi Bantuan', enabled: true },
  { id: 17, nama: 'Trip & Tour', enabled: true },
  { id: 18, nama: 'Data Transaksi', enabled: true },
  { id: 19, nama: 'QRIS', enabled: true },
  { id: 20, nama: 'Transaksi Luring', enabled: true },
  { id: 21, nama: 'Transfer ke Merchant', enabled: true },
  { id: 22, nama: 'Bank Sampah', enabled: true },
];

export default function CompanyAturMenuAppMerchant() {
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
    return menuList.filter((menu) =>
      menu.nama.toLowerCase().includes(searchLower)
    );
  }, [menuList, searchValue]);

  const handleToggle = (id) => {
    setMenuList((prev) =>
      prev.map((menu) =>
        menu.id === id ? { ...menu, enabled: !menu.enabled } : menu
      )
    );
  };

  const handleUbah = () => {
    setIsEditMode(true);
  };

  const handleBatal = () => {
    setIsEditMode(false);
    // Reset to original data
    setMenuList(mockMenuData);
  };

  const handleSimpan = () => {
    console.log('Saving menu settings:', menuList);
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
          <Box sx={{ mb: 3 }}>
            {filteredMenuList.map((menu) => (
              <Box
                key={menu.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  py: 1.5,
                  borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
                  '&:last-child': {
                    borderBottom: 'none',
                  },
                }}
              >
                <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                  {menu.nama}
                </Typography>
                <Switch
                  checked={menu.enabled}
                  onChange={() => handleToggle(menu.id)}
                  disabled={!isEditMode}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#155DFC',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#155DFC',
                    },
                  }}
                />
              </Box>
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
                  onClick={handleUbah}
                  sx={{
                    textTransform: 'none',
                    bgcolor: '#155DFC',
                    px: 3,
                    '&:hover': {
                      bgcolor: '#0f4fc7',
                    },
                  }}
                >
                  Ubah
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
