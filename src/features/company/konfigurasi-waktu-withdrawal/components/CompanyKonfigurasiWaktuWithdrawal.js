'use client';

import React, { useState } from 'react';
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

export default function CompanyKonfigurasiWaktuWithdrawal() {
  const params = useParams();
  const router = useRouter();
  const companyId = params?.id;

  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    transferMember: '0',
    transferBankMember: '0',
    withdrawMerchant: '0',
  });

  const handleChange = (field, value) => {
    // Only allow numbers
    const numericValue = value.replace(/[^\d]/g, '');
    setFormData((prev) => ({
      ...prev,
      [field]: numericValue,
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
    console.log('Saving konfigurasi waktu withdrawal:', {
      companyId,
      formData,
    });
    setIsEditMode(false);
  };
  const handleKembali = () => router.back();

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <MainCard content={false} sx={{ p: 0, boxShadow: 0 }}>
        <Box sx={{ p: 3 }}>
          {/* Description */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
              Konfigurasi ini akan berlaku untuk mengatur waktu perizinan aktivitas transfer yang dilakukan!
            </Typography>
          </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: 2.5,
              }}
            >
              {/* Transfer Member */}
              <Box>
                <Typography variant="body2" sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
                  Transfer Member
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={formData.transferMember}
                  onChange={(e) => handleChange('transferMember', e.target.value)}
                  disabled={!isEditMode}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>Menit</Typography>
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

              {/* Transfer Bank Member */}
              <Box>
                <Typography variant="body2" sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
                  Transfer Bank Member
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={formData.transferBankMember}
                  onChange={(e) => handleChange('transferBankMember', e.target.value)}
                  disabled={!isEditMode}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>Menit</Typography>
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

              {/* Withdraw Merchant */}
              <Box>
                <Typography variant="body2" sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
                  Withdraw Merchant
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={formData.withdrawMerchant}
                  onChange={(e) => handleChange('withdrawMerchant', e.target.value)}
                  disabled={!isEditMode}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>Menit</Typography>
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

              {/* Action Buttons */}
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
            </Box>
        </Box>
      </MainCard>
    </Box>
  );
}
