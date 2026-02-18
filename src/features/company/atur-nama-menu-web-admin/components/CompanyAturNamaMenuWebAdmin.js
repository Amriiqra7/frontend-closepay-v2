'use client';

import React, { useState, useMemo, useCallback } from 'react';
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
  { id: 1, namaDefault: 'Data Utama', namaKustom: 'Data Utama' },
  { id: 2, namaDefault: 'Data User', namaKustom: 'Data User' },
  { id: 3, namaDefault: 'Data Notifikasi', namaKustom: 'Data Notifikasi' },
  { id: 4, namaDefault: 'Saldo Dan Pembayaran', namaKustom: 'Saldo dan Pembayaran' },
  { id: 5, namaDefault: 'Digital Produk Ppob', namaKustom: 'Digital Produk (PPOB)' },
  { id: 6, namaDefault: 'Marketplace Dan Sistem Kasir', namaKustom: 'Toko Online dan Sistem Kasir' },
  { id: 7, namaDefault: 'Invoice', namaKustom: 'Tagihan' },
  { id: 8, namaDefault: 'Info Dan Berita', namaKustom: 'Info dan Berita' },
  { id: 9, namaDefault: 'Donasi Dan Zakat', namaKustom: 'Donasi dan Zakat' },
  { id: 10, namaDefault: 'Manajemen Kartu', namaKustom: 'Manajemen Kartu' },
];

export default function CompanyAturNamaMenuWebAdmin() {
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
        menu.namaKustom.toLowerCase().includes(searchLower)
    );
  }, [menuList, searchValue]);

  const handleChange = (id, value) => {
    setMenuList((prev) =>
      prev.map((menu) =>
        menu.id === id ? { ...menu, namaKustom: value } : menu
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
              gridTemplateColumns: '1fr 1fr',
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
                Kustom Nama Menu
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
                    value={menu.namaKustom}
                    onChange={(e) => handleChange(menu.id, e.target.value)}
                    disabled={!isEditMode}
                    inputProps={{ maxLength: 50 }}
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
                    {menu.namaKustom.length}/50
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
