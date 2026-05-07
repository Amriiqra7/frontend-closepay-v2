'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  InputAdornment,
} from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import MainCard from '@/shared/ui/MainCard';
import { formatRupiah } from '@/shared/utils/format';

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

export default function CompanyAturLimitTopup() {
  const params = useParams();
  const router = useRouter();
  const companyId = params?.id;
  const [companyName, setCompanyName] = useState(companyId || 'Perusahaan');

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

  const [isEditMode, setIsEditMode] = useState(false);
  const [limitTopUp, setLimitTopUp] = useState('');

  const handleChange = (value) => {
    // Only allow numbers
    const numericValue = value.replace(/[^\d]/g, '');
    setLimitTopUp(numericValue);
  };

  const handleAtur = () => {
    setIsEditMode(true);
  };

  const handleBatal = () => {
    setIsEditMode(false);
    // TODO: Reset form data jika perlu
  };

  const handleSimpan = () => {
    console.log('Saving limit top up:', {
      companyId,
      limitTopUp: limitTopUp || 'unlimited',
    });
    setIsEditMode(false);
  };

  // Display value: if empty, show "unlimited", otherwise show formatted rupiah
  const displayValue = limitTopUp ? formatRupiah(limitTopUp) : 'unlimited';

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <MainCard content={false} sx={{ p: 0, boxShadow: 0 }}>
        <Box sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2.5,
              }}
            >
              {/* Label */}
              <Box>
                <Typography variant="body2" sx={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
                  Atur limit Top Up pada perusahaan <strong>{companyName}</strong>
                </Typography>
              </Box>

              {/* Input Field */}
              <Box>
                <TextField
                  fullWidth
                  size="small"
                  value={isEditMode ? (limitTopUp ? formatRupiah(limitTopUp) : '') : displayValue}
                  onChange={(e) => handleChange(e.target.value)}
                  placeholder="unlimited"
                  disabled={!isEditMode}
                  InputProps={{
                    startAdornment: limitTopUp ? (
                      <InputAdornment position="start">
                        <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>Rp</Typography>
                      </InputAdornment>
                    ) : null,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontSize: '0.875rem',
                      bgcolor: !isEditMode && !limitTopUp ? 'rgba(0, 0, 0, 0.06)' : 'background.paper',
                    },
                    '& .MuiInputBase-input:disabled': {
                      WebkitTextFillColor: !limitTopUp ? 'rgba(0, 0, 0, 0.38)' : 'rgba(0, 0, 0, 0.87)',
                    },
                  }}
                />
              </Box>

              {/* Action Buttons */}
              {!isEditMode ? (
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 2, pt: 1 }}>
                  <Button
                    variant="outlined"
                    onClick={() => router.back()}
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
                      minWidth: 100,
                      '&:hover': {
                        bgcolor: '#0f4fc7',
                      },
                    }}
                  >
                    Atur
                  </Button>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 2, pt: 1 }}>
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
            </Box>
        </Box>
      </MainCard>
    </Box>
  );
}
