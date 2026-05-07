'use client';

import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  InputAdornment,
} from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { SearchNormal1, ArrowDown2 } from 'iconsax-react';
import MainCard from '@/shared/ui/MainCard';

// Mock data - replace with actual API call
const mockMenuData = {
  profil: [
    { id: 1, namaDefault: 'Update Profile', namaKustomID: 'Ubah Profil', namaKustomEN: 'Change Profile' },
    { id: 2, namaDefault: 'Change Password', namaKustomID: 'Ubah Kata Sandi', namaKustomEN: 'Change Password' },
    { id: 3, namaDefault: 'Change Security Code', namaKustomID: 'Ubah PIN', namaKustomEN: 'Change PIN' },
    { id: 4, namaDefault: 'Forgot Security Code', namaKustomID: 'Lupa PIN', namaKustomEN: 'Forgot PIN' },
    { id: 5, namaDefault: 'Support', namaKustomID: 'Pusat Bantuan', namaKustomEN: 'Help Center' },
    { id: 6, namaDefault: 'Logout', namaKustomID: 'Keluar', namaKustomEN: 'Logout' },
  ],
  homepage: [
    { id: 1, namaDefault: 'Saldo', namaKustomID: 'Saldo', namaKustomEN: 'Balance' },
    { id: 2, namaDefault: 'Info Dan Berita', namaKustomID: 'Info dan Berita', namaKustomEN: 'News' },
    { id: 3, namaDefault: 'Donasi', namaKustomID: 'Donasi', namaKustomEN: 'Donation' },
    { id: 4, namaDefault: 'Invoice', namaKustomID: 'Tagihan', namaKustomEN: 'Invoice' },
    { id: 5, namaDefault: 'Marketplace', namaKustomID: 'Toko Online', namaKustomEN: 'Online Shop' },
    { id: 6, namaDefault: 'Ppob', namaKustomID: 'PPOB', namaKustomEN: 'PPOB' },
    { id: 7, namaDefault: 'Virtual Card', namaKustomID: 'Kartu Virtual', namaKustomEN: 'Virtual Card' },
    { id: 8, namaDefault: 'Trip Tour', namaKustomID: 'Trip & Tour', namaKustomEN: 'Trip & Tour' },
    { id: 9, namaDefault: 'Bank Sampah', namaKustomID: 'Bank Sampah', namaKustomEN: 'Waste Bank' },
  ],
  saldo: [
    { id: 1, namaDefault: 'Topup', namaKustomID: 'Topup', namaKustomEN: 'Topup' },
    { id: 2, namaDefault: 'Transfer Member', namaKustomID: 'Transfer Member', namaKustomEN: 'Transfer Member' },
    { id: 3, namaDefault: 'Transfer Bank', namaKustomID: 'Transfer Bank', namaKustomEN: 'Transfer Bank' },
  ],
};

export default function CompanyAturNamaMenuAppMember() {
  const params = useParams();
  const router = useRouter();
  const companyId = params?.id;

  const [menuList, setMenuList] = useState(mockMenuData);
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchValues, setSearchValues] = useState({
    profil: '',
    homepage: '',
    saldo: '',
  });
  const [expandedAccordion, setExpandedAccordion] = useState(null);

  // Filter menu berdasarkan search per section
  const filteredMenuData = useMemo(() => {
    const filterSection = (section, searchValue) => {
      if (!searchValue) return section;
      const searchLower = searchValue.toLowerCase();
      return section.filter(
        (menu) =>
          menu.namaDefault.toLowerCase().includes(searchLower) ||
          menu.namaKustomID.toLowerCase().includes(searchLower) ||
          menu.namaKustomEN.toLowerCase().includes(searchLower)
      );
    };
    return {
      profil: filterSection(menuList.profil, searchValues.profil),
      homepage: filterSection(menuList.homepage, searchValues.homepage),
      saldo: filterSection(menuList.saldo, searchValues.saldo),
    };
  }, [menuList, searchValues]);

  const handleChange = (section, id, field, value) => {
    setMenuList((prev) => ({
      ...prev,
      [section]: prev[section].map((menu) =>
        menu.id === id ? { ...menu, [field]: value } : menu
      ),
    }));
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

  const handleAccordionChange = (sectionKey) => (event, isExpanded) => {
    setExpandedAccordion(isExpanded ? sectionKey : null);
  };

  const handleSearchChange = (sectionKey, value) => {
    setSearchValues((prev) => ({
      ...prev,
      [sectionKey]: value,
    }));
  };

  const renderMenuSection = (sectionKey, sectionName, menus) => {
    const hasSearchValue = searchValues[sectionKey] && searchValues[sectionKey].trim() !== '';
    const hasNoResults = hasSearchValue && menus.length === 0;

    return (
      <Accordion
        key={sectionKey}
        expanded={expandedAccordion === sectionKey}
        onChange={handleAccordionChange(sectionKey)}
        sx={{
          boxShadow: 'none',
          border: '1px solid rgba(0, 0, 0, 0.12)',
          borderRadius: 1,
          mb: 2,
          '&:before': { display: 'none' },
        }}
      >
        <AccordionSummary
          expandIcon={<ArrowDown2 size={20} color="#155DFC" />}
          sx={{
            px: 2,
            '& .MuiAccordionSummary-content': {
              my: 0,
            },
          }}
        >
          <Typography variant="subtitle2" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
            {sectionName}
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 2, pb: 2 }}>
          {/* Search per accordion */}
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Cari nama menu..."
              value={searchValues[sectionKey]}
              onChange={(e) => handleSearchChange(sectionKey, e.target.value)}
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

          {/* Message jika tidak ada hasil */}
          {hasNoResults ? (
            <Box
              sx={{
                py: 3,
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
          ) : (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: 2.5,
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
              {menus.map((menu) => (
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
                    onChange={(e) =>
                      handleChange(sectionKey, menu.id, 'namaKustomID', e.target.value)
                    }
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
                    onChange={(e) =>
                      handleChange(sectionKey, menu.id, 'namaKustomEN', e.target.value)
                    }
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
          )}
        </AccordionDetails>
      </Accordion>
    );
  };

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <MainCard content={false} sx={{ p: 0, boxShadow: 0 }}>
        <Box sx={{ p: 3 }}>
          {/* Accordion Sections */}
          {renderMenuSection('profil', 'Menu Profil', filteredMenuData.profil)}
          {renderMenuSection('homepage', 'Menu Homepage', filteredMenuData.homepage)}
          {renderMenuSection('saldo', 'Menu Saldo', filteredMenuData.saldo)}

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
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
