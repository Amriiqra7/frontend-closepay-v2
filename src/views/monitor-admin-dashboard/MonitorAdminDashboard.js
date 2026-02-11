'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Autocomplete,
  TextField,
  Button,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import MainCard from '@/components/MainCard';
import { useAdminMenu } from '@/contexts/AdminMenuContext';
import AdminMenuDialog from './AdminMenuDialog';

// Mock data untuk dropdown companies
// TODO: Replace dengan API call
const mockCompanies = [
  { id: 1, nama: 'PT Bougenvile Blok' },
  { id: 2, nama: 'PT Kantin FKi 12' },
  { id: 3, nama: 'PT Perusahaan ABC' },
  { id: 4, nama: 'CV XYZ Indonesia' },
  { id: 5, nama: 'PT Global Tech Solutions' },
];

export default function MonitorAdminDashboard() {
  const router = useRouter();
  const { setAdminMenu } = useAdminMenu();
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleCompanyChange = (_, newValue) => {
    setSelectedCompany(newValue);
  };

  const handlePindah = () => {
    if (selectedCompany) {
      setOpenDialog(true);
    }
  };

  const handleMenuClick = (menuId) => {
    setOpenDialog(false);
    // Set admin menu context and redirect to dashboard
    // Sidebar will automatically change based on the selected menu
    setAdminMenu(menuId, selectedCompany);
    router.push('/dashboard');
  };

  return (
    <>
      <MainCard content={false}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={400} mb={2}>
            Monitor Admin Dashboard
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
            Pilih perusahaan untuk mengakses dashboard admin
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
            <Button
              variant="contained"
              size="large"
              onClick={handlePindah}
              disabled={!selectedCompany}
              fullWidth
              sx={{
                height: '48px',
              }}
            >
              Pindah
            </Button>
          </Box>
        </Box>
      </MainCard>

      {/* Dialog Menu Cards */}
      <AdminMenuDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onMenuClick={handleMenuClick}
      />
    </>
  );
}
