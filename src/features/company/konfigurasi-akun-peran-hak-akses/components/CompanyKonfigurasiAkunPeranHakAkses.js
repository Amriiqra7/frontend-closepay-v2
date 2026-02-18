'use client';

import React, { useState } from 'react';
import { Box, Typography, Button, FormControlLabel, Switch } from '@mui/material';
import { useRouter } from 'next/navigation';
import MainCard from '@/shared/ui/MainCard';

export default function CompanyKonfigurasiAkunPeranHakAkses() {
  const router = useRouter();
  const [isEditMode, setIsEditMode] = useState(false);
  const [berikanAdminSemuaIzin, setBerikanAdminSemuaIzin] = useState(false);
  const [berikanAdminSubCompanySemuaIzin, setBerikanAdminSubCompanySemuaIzin] = useState(false);
  const [berikanMerchantSemuaIzin, setBerikanMerchantSemuaIzin] = useState(false);
  const [berikanMemberSemuaIzin, setBerikanMemberSemuaIzin] = useState(false);

  const handleUbah = () => setIsEditMode(true);
  const handleBatal = () => setIsEditMode(false);
  const handleSimpan = () => {
    console.log('Saving konfigurasi akun peran hak akses:', {
      berikanAdminSemuaIzin,
      berikanAdminSubCompanySemuaIzin,
      berikanMerchantSemuaIzin,
      berikanMemberSemuaIzin,
    });
    setIsEditMode(false);
  };
  const handleKembali = () => router.back();

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <MainCard content={false} sx={{ p: 0, boxShadow: 0 }}>
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={berikanAdminSemuaIzin}
                  onChange={(e) => setBerikanAdminSemuaIzin(e.target.checked)}
                  disabled={!isEditMode}
                  color="primary"
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': { color: '#155DFC' },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#155DFC' },
                  }}
                />
              }
              label={<Typography sx={{ fontSize: '0.875rem', fontWeight: 500 }}>Berikan Admin Semua Izin</Typography>}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={berikanAdminSubCompanySemuaIzin}
                  onChange={(e) => setBerikanAdminSubCompanySemuaIzin(e.target.checked)}
                  disabled={!isEditMode}
                  color="primary"
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': { color: '#155DFC' },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#155DFC' },
                  }}
                />
              }
              label={<Typography sx={{ fontSize: '0.875rem', fontWeight: 500 }}>Berikan Admin Sub Company Semua Izin</Typography>}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={berikanMerchantSemuaIzin}
                  onChange={(e) => setBerikanMerchantSemuaIzin(e.target.checked)}
                  disabled={!isEditMode}
                  color="primary"
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': { color: '#155DFC' },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#155DFC' },
                  }}
                />
              }
              label={<Typography sx={{ fontSize: '0.875rem', fontWeight: 500 }}>Berikan Merchant Semua Izin</Typography>}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={berikanMemberSemuaIzin}
                  onChange={(e) => setBerikanMemberSemuaIzin(e.target.checked)}
                  disabled={!isEditMode}
                  color="primary"
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': { color: '#155DFC' },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#155DFC' },
                  }}
                />
              }
              label={<Typography sx={{ fontSize: '0.875rem', fontWeight: 500 }}>Berikan Member Semua Izin</Typography>}
            />
            {!isEditMode ? (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, pt: 1 }}>
                <Button variant="outlined" onClick={handleKembali} sx={{ textTransform: 'none', color: 'error.main', borderColor: 'error.main', px: 3, '&:hover': { borderColor: 'error.main', bgcolor: 'error.lighter' } }}>
                  Kembali
                </Button>
                <Button variant="contained" onClick={handleUbah} sx={{ textTransform: 'none', bgcolor: '#155DFC', px: 3, '&:hover': { bgcolor: '#0f4fc7' } }}>
                  Ubah
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, pt: 1 }}>
                <Button variant="outlined" onClick={handleBatal} sx={{ textTransform: 'none', color: 'error.main', borderColor: 'error.main', px: 3, '&:hover': { borderColor: 'error.main', bgcolor: 'error.lighter' } }}>
                  Batal
                </Button>
                <Button variant="contained" onClick={handleSimpan} sx={{ textTransform: 'none', bgcolor: '#155DFC', px: 3, '&:hover': { bgcolor: '#0f4fc7' } }}>
                  Simpan
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </MainCard>
    </Box>
  );
}
