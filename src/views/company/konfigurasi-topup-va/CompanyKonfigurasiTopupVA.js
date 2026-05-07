'use client';

import React, { useState } from 'react';
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
import { formatRupiah } from '@/shared/utils/format';

export default function CompanyKonfigurasiTopupVA() {
  const params = useParams();
  const router = useRouter();
  const companyId = params?.id;

  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    jenisVA: 'OPEN PAYMENT',
    metodePemotongan: 'POTONGAN DIAKHIR',
    expiredHari: '0',
    expiredJam: '1',
    expiredMenit: '0',
    minimalTopUp: '',
    maksimalTopUp: '',
  });

  const handleChange = (field, value) => {
    if (field === 'minimalTopUp' || field === 'maksimalTopUp') {
      // Hanya terima angka dan format rupiah
      const numericValue = value.replace(/[^\d]/g, '');
      setFormData((prev) => ({
        ...prev,
        [field]: numericValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleUbah = () => {
    setIsEditMode(true);
  };

  const handleBatal = () => {
    setIsEditMode(false);
    // TODO: Reset form data jika perlu
  };

  const handleSimpan = () => {
    // TODO: Implement save functionality
    console.log('Saving konfigurasi topup VA:', {
      companyId,
      formData,
    });
    setIsEditMode(false);
  };

  const handleKembali = () => {
    router.back();
  };

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
              {/* Jenis VA dan Metode Pemotongan Charge - dalam satu row */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                  gap: 2,
                }}
              >
                <Box>
                  <Typography variant="body2" sx={{ mb: 1.5, fontSize: '0.875rem', fontWeight: 500 }}>
                    Jenis VA
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      value={formData.jenisVA}
                      onChange={(e) => handleChange('jenisVA', e.target.value)}
                      disabled={!isEditMode}
                      displayEmpty
                      sx={{
                        fontSize: '0.875rem',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(0, 0, 0, 0.23)',
                        },
                      }}
                    >
                      <MenuItem value="OPEN PAYMENT" sx={{ fontSize: '0.875rem' }}>
                        OPEN PAYMENT
                      </MenuItem>
                      <MenuItem value="CLOSE PAYMENT" sx={{ fontSize: '0.875rem' }}>
                        CLOSE PAYMENT
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Box>
                  <Typography variant="body2" sx={{ mb: 1.5, fontSize: '0.875rem', fontWeight: 500 }}>
                    Metode Pemotongan Charge
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      value={formData.metodePemotongan}
                      onChange={(e) => handleChange('metodePemotongan', e.target.value)}
                      disabled={!isEditMode || formData.jenisVA === 'OPEN PAYMENT'}
                      displayEmpty
                      sx={{
                        fontSize: '0.875rem',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(0, 0, 0, 0.23)',
                        },
                      }}
                    >
                      <MenuItem value="POTONGAN DIAKHIR" sx={{ fontSize: '0.875rem' }}>
                        POTONGAN DIAKHIR
                      </MenuItem>
                      <MenuItem value="POTONGAN DIAWAL" sx={{ fontSize: '0.875rem' }}>
                        POTONGAN DIAWAL
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>

              {/* Expired VA */}
              <Box>
                <Typography variant="body2" sx={{ mb: 1.5, fontSize: '0.875rem', fontWeight: 500 }}>
                  Expired VA
                </Typography>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
                    gap: 2,
                  }}
                >
                  <Box>
                    <Typography variant="body2" sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
                      Hari
                    </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        value={formData.expiredHari}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^\d]/g, '');
                          handleChange('expiredHari', value);
                        }}
                        disabled={!isEditMode || formData.jenisVA === 'OPEN PAYMENT'}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            fontSize: '0.875rem',
                          },
                        }}
                      />
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
                        Jam
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        value={formData.expiredJam}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^\d]/g, '');
                          handleChange('expiredJam', value);
                        }}
                        disabled={!isEditMode || formData.jenisVA === 'OPEN PAYMENT'}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            fontSize: '0.875rem',
                          },
                        }}
                      />
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
                        Menit
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        value={formData.expiredMenit}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^\d]/g, '');
                          handleChange('expiredMenit', value);
                        }}
                        disabled={!isEditMode || formData.jenisVA === 'OPEN PAYMENT'}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            fontSize: '0.875rem',
                          },
                        }}
                      />
                  </Box>
                </Box>
              </Box>

              {/* Minimal dan Maksimal Top Up - hanya muncul jika CLOSE PAYMENT */}
              {formData.jenisVA === 'CLOSE PAYMENT' && (
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                    gap: 2,
                  }}
                >
                  <Box>
                    <Typography variant="body2" sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
                      Minimal Top Up
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={formData.minimalTopUp ? formatRupiah(formData.minimalTopUp) : ''}
                      onChange={(e) => handleChange('minimalTopUp', e.target.value)}
                      placeholder="0"
                      disabled={!isEditMode}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>Rp</Typography>
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
                  <Box>
                    <Typography variant="body2" sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
                      Maksimal Top Up
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={formData.maksimalTopUp ? formatRupiah(formData.maksimalTopUp) : ''}
                      onChange={(e) => handleChange('maksimalTopUp', e.target.value)}
                      placeholder="0"
                      disabled={!isEditMode}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>Rp</Typography>
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
                </Box>
              )}

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

          {/* Catatan Section */}
          <Box
            sx={{
              mt: 3,
              p: 2.5,
              border: '1px solid',
              borderColor: 'error.main',
              borderRadius: 1,
              bgcolor: 'rgba(211, 47, 47, 0.05)',
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontSize: '0.875rem',
                color: 'error.main',
                '& strong': {
                  fontWeight: 600,
                },
              }}
            >
              <strong>Catatan:</strong>
              <br />
              1. <strong>Potong Awal</strong>, total top up user adalah nominal top up yang ditambahkan dengan biaya admin, sehingga dana yang masuk ke akun user adalah nominal top up user.
              <br />
              2. <strong>Potong Akhir</strong>, total top up user adalah nominal top up, dana yang masuk ke akun user adalah nominal top up user yang dikurangi dengan biaya admin.
            </Typography>
          </Box>
        </Box>
      </MainCard>
    </Box>
  );
}
