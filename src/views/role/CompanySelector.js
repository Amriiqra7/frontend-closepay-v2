'use client';

import React, { useState } from 'react';
import { Box, Typography, Autocomplete, TextField } from '@mui/material';
import { useRouter } from 'next/navigation';
import MainCard from '@/components/MainCard';

// Mock data untuk dropdown companies
// TODO: Replace dengan API call
const mockCompanies = [
  { id: 1, nama: 'PT Bougenvile Blok' },
  { id: 2, nama: 'PT Kantin FKi 12' },
  { id: 3, nama: 'PT Perusahaan ABC' },
  { id: 4, nama: 'CV XYZ Indonesia' },
  { id: 5, nama: 'PT Global Tech Solutions' },
];

export default function CompanySelector() {
  const router = useRouter();
  const [selectedCompany, setSelectedCompany] = useState(null);

  const handleCompanyChange = (_, newValue) => {
    if (newValue) {
      setSelectedCompany(newValue);
      // Redirect ke list role dengan companyId
      router.push(`/role/data-role/list?companyId=${newValue.id}`);
    }
  };

  return (
    <MainCard content={false}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="bold" mb={3}>
          Pilih Perusahaan
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
          Silakan pilih perusahaan untuk melihat data role
        </Typography>
        <Autocomplete
          fullWidth
          size="medium"
          options={mockCompanies}
          getOptionLabel={(option) => option?.nama || ''}
          isOptionEqualToValue={(option, value) => option?.id === value?.id}
          value={selectedCompany}
          onChange={handleCompanyChange}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Pilih perusahaan"
              sx={{
                '& .MuiOutlinedInput-root': {
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
    </MainCard>
  );
}
