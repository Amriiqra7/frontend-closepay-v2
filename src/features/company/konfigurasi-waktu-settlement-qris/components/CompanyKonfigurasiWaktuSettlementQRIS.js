'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  FormControl,
  Select,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import MainCard from '@/shared/ui/MainCard';

// Helper function to generate mock company data (same as CompanyList.js and PageHeader.js)
const generateMockCompany = (id) => {
  const sampleData = [
    {
      nama: 'Bougenvile Blok',
      inisialPerusahaan: 'BB',
    },
    {
      nama: 'Kantin FKi 12',
      inisialPerusahaan: 'KF12',
    },
  ];
  
  const companyId = parseInt(id);
  const baseData = sampleData[(companyId - 1) % sampleData.length];
  
  const nama = companyId <= sampleData.length 
    ? baseData.nama 
    : `${baseData.nama} ${Math.floor(companyId / sampleData.length)}`;
  
  return {
    id: companyId,
    nama: nama,
  };
};

// Placeholder API - replace with actual API service
const CompanyAPI = {
  getById: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const company = generateMockCompany(id);
          resolve(company);
        } catch (err) {
          reject(err);
        }
      }, 100);
    });
  },
};

// Mock provider options - replace with actual API call
const providerOptions = [
  { value: 'xendit', label: 'XENDIT' },
  { value: 'durianpay', label: 'DurianPay' },
  { value: 'fazz', label: 'FAZZ' },
  // Add more providers as needed
];

export default function CompanyKonfigurasiWaktuSettlementQRIS() {
  const params = useParams();
  const router = useRouter();
  const companyId = params?.id;
  const [companyName, setCompanyName] = useState(companyId || 'Perusahaan');

  const [selectedProvider, setSelectedProvider] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  // Store waktu for each provider separately
  const [waktuByProvider, setWaktuByProvider] = useState({
    // Example: 'xendit': '0', 'durianpay': '0', 'fazz': '0'
  });

  // Fetch company name based on ID
  useEffect(() => {
    if (companyId && !isNaN(companyId)) {
      CompanyAPI.getById(companyId)
        .then((data) => {
          setCompanyName(data.nama || companyId);
        })
        .catch((err) => {
          // If error, use ID as fallback
          setCompanyName(companyId);
        });
    }
  }, [companyId]);

  // Initialize waktu for selected provider if not exists
  useEffect(() => {
    if (selectedProvider && waktuByProvider[selectedProvider] === undefined) {
      setWaktuByProvider((prev) => ({
        ...prev,
        [selectedProvider]: '',
      }));
    }
  }, [selectedProvider, waktuByProvider]);

  const handleProviderChange = (value) => {
    setSelectedProvider(value);
    setIsEditMode(false); // Reset edit mode when provider changes
  };

  const handleWaktuChange = (value) => {
    // Only allow numbers, but allow empty string
    const numericValue = value.replace(/[^\d]/g, '');
    setWaktuByProvider((prev) => ({
      ...prev,
      [selectedProvider]: numericValue,
    }));
  };

  const handleUbah = () => {
    setIsEditMode(true);
  };

  const handleBatal = () => {
    setIsEditMode(false);
    // TODO: Reset form data jika perlu
  };

  const handleSimpan = () => {
    console.log('Saving konfigurasi waktu settlement QRIS:', {
      companyId,
      provider: selectedProvider,
      waktu: waktuByProvider[selectedProvider],
    });
    setIsEditMode(false);
  };

  const handleKembali = () => {
    router.back();
  };

  const currentWaktu = selectedProvider ? (waktuByProvider[selectedProvider] || '') : '';

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <MainCard content={false} sx={{ p: 0, boxShadow: 0 }}>
        <Box sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: 2.5,
              }}
            >
              {/* Provider Select */}
              <Box>
                <Typography variant="body2" sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
                  Provider
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    value={selectedProvider}
                    onChange={(e) => handleProviderChange(e.target.value)}
                    displayEmpty
                    disabled={isEditMode} // Disabled saat edit mode
                    sx={{
                      fontSize: '0.875rem',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(0, 0, 0, 0.23)',
                      },
                    }}
                  >
                    <MenuItem value="" disabled sx={{ fontSize: '0.875rem' }}>
                      Pilih
                    </MenuItem>
                    {providerOptions.map((provider) => (
                      <MenuItem key={provider.value} value={provider.value} sx={{ fontSize: '0.875rem' }}>
                        {provider.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Waktu Input - hanya muncul jika provider sudah dipilih */}
              {selectedProvider && (
                <Box>
                  <Typography variant="body2" sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
                    Waktu
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    value={currentWaktu}
                    onChange={(e) => handleWaktuChange(e.target.value)}
                    disabled={!isEditMode}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>Jam</Typography>
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
              )}

              {/* Action Buttons - hanya muncul jika provider sudah dipilih */}
              {selectedProvider && (
                <>
                  {!isEditMode ? (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, pt: 1 }}>
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
                          minWidth: 100,
                          '&:hover': {
                            bgcolor: '#0f4fc7',
                          },
                        }}
                      >
                        Ubah
                      </Button>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, pt: 1 }}>
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
                    </Box>
                  )}
                </>
              )}
            </Box>
        </Box>
      </MainCard>
    </Box>
  );
}
