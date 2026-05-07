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
const mockMenuData = {
  profile: {
    title: 'Konfigurasi Master Menu Profile',
    menus: [
      { id: 1, nama: 'Ubah Profil', enabled: true },
      { id: 2, nama: 'Ubah Kata Sandi', enabled: true },
      { id: 3, nama: 'Ubah PIN', enabled: true },
      { id: 4, nama: 'Lupa PIN', enabled: true },
      { id: 5, nama: 'Pusat Bantuan', enabled: true },
      { id: 6, nama: 'Keluar', enabled: true },
    ],
  },
  home: {
    title: 'Konfigurasi Master Menu Home',
    menus: [
      { id: 7, nama: 'Saldo', enabled: true },
      { id: 8, nama: 'Info dan Berita', enabled: true },
      { id: 9, nama: 'Donasi', enabled: true },
      { id: 10, nama: 'Tagihan', enabled: true },
      { id: 11, nama: 'Toko Online', enabled: true },
      { id: 12, nama: 'PPOB', enabled: true },
      { id: 13, nama: 'Kartu Virtual', enabled: true },
      { id: 14, nama: 'Trip & Tour', enabled: true },
      { id: 15, nama: 'Bank Sampah', enabled: true },
    ],
  },
  saldo: {
    title: 'Konfigurasi Master Menu Saldo',
    menus: [
      { id: 16, nama: 'Topup', enabled: true },
      { id: 17, nama: 'Transfer Member', enabled: true },
      { id: 18, nama: 'Transfer Bank', enabled: true },
    ],
  },
};

export default function CompanyAturMenuAppMember() {
  const params = useParams();
  const router = useRouter();
  const companyId = params?.id;

  const [menuList, setMenuList] = useState(mockMenuData);
  const [isEditMode, setIsEditMode] = useState({
    profile: false,
    home: false,
    saldo: false,
  });
  const [searchValue, setSearchValue] = useState('');

  // Filter menu berdasarkan search
  const filteredMenuData = useMemo(() => {
    if (!searchValue) return menuList;
    const searchLower = searchValue.toLowerCase();
    const filterMenus = (menus) =>
      menus.filter((menu) => menu.nama.toLowerCase().includes(searchLower));
    return {
      profile: {
        ...menuList.profile,
        menus: filterMenus(menuList.profile.menus),
      },
      home: {
        ...menuList.home,
        menus: filterMenus(menuList.home.menus),
      },
      saldo: {
        ...menuList.saldo,
        menus: filterMenus(menuList.saldo.menus),
      },
    };
  }, [menuList, searchValue]);

  const handleToggle = (sectionKey, id) => {
    setMenuList((prev) => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        menus: prev[sectionKey].menus.map((menu) =>
          menu.id === id ? { ...menu, enabled: !menu.enabled } : menu
        ),
      },
    }));
  };

  const handleUbah = (sectionKey) => {
    setIsEditMode((prev) => ({
      ...prev,
      [sectionKey]: true,
    }));
  };

  const handleBatal = (sectionKey) => {
    setIsEditMode((prev) => ({
      ...prev,
      [sectionKey]: false,
    }));
    // Reset to original data for this section
    setMenuList((prev) => {
      const originalSection = mockMenuData[sectionKey];
      if (!originalSection) return prev;
      return {
        ...prev,
        [sectionKey]: {
          ...originalSection,
          menus: [...originalSection.menus], // Create new array to avoid reference issues
        },
      };
    });
  };

  const handleSimpan = (sectionKey) => {
    console.log('Saving menu settings for', sectionKey, ':', menuList[sectionKey]);
    setIsEditMode((prev) => ({
      ...prev,
      [sectionKey]: false,
    }));
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

          {/* Menu Groups */}
          <Box sx={{ mb: 3 }}>
            {(() => {
              const hasSearchValue = searchValue && searchValue.trim() !== '';
              const allSectionsEmpty = Object.values(filteredMenuData).every(
                (section) => section.menus.length === 0
              );
              
              // Show message if search active but no results
              if (hasSearchValue && allSectionsEmpty) {
                return (
                  <Box
                    sx={{
                      py: 4,
                      textAlign: 'center',
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: '0.875rem',
                        color: 'text.secondary',
                      }}
                    >
                      Tidak ada menu yang dicari
                    </Typography>
                  </Box>
                );
              }

              return Object.entries(filteredMenuData).map(([sectionKey, section]) => {
                const hasNoResults = hasSearchValue && section.menus.length === 0;
                
                if (hasNoResults) return null;

                return (
                <Box
                  key={sectionKey}
                  sx={{
                    mb: 3,
                    pb: 3,
                    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                    '&:last-child': {
                      borderBottom: 'none',
                      mb: 0,
                      pb: 0,
                    },
                  }}
                >
                  {/* Title */}
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      mb: 2,
                      color: 'text.primary',
                    }}
                  >
                    {section.title}
                  </Typography>

                  {/* Menu List */}
                  <Box sx={{ mb: 2 }}>
                    {section.menus.map((menu) => (
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
                          onChange={() => handleToggle(sectionKey, menu.id)}
                          disabled={!isEditMode[sectionKey]}
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

                  {/* Ubah Button per section */}
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {!isEditMode[sectionKey] ? (
                      <Button
                        variant="contained"
                        onClick={() => handleUbah(sectionKey)}
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
                    ) : (
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                          variant="outlined"
                          onClick={() => handleBatal(sectionKey)}
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
                          onClick={() => handleSimpan(sectionKey)}
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
                      </Box>
                    )}
                  </Box>
                </Box>
                );
              });
            })()}
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
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
          </Box>
        </Box>
      </MainCard>
    </Box>
  );
}
