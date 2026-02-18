'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Autocomplete,
  Chip,
} from '@mui/material';
import { CloseSquare } from 'iconsax-react';
import { formatRupiah } from '@/shared/utils/format';

export default function MasterSaldoDialog({
  open,
  onClose,
  onSave,
  data,
  jenisTransaksiOptions = [],
}) {
  const [formData, setFormData] = useState({
    namaMasterSaldo: '',
    saldoMaksimal: '',
    limitSekaliTransaksi: '',
    limitTransaksiHarian: '',
    limitTransaksiBulanan: '',
    jenisTransaksi: [],
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (data) {
      setFormData({
        namaMasterSaldo: data.namaMasterSaldo || '',
        saldoMaksimal: data.saldoMaksimal || '',
        limitSekaliTransaksi: data.limitSekaliTransaksi || '',
        limitTransaksiHarian: data.limitTransaksiHarian || '',
        limitTransaksiBulanan: data.limitTransaksiBulanan || '',
        jenisTransaksi: data.jenisTransaksi || [],
      });
    } else {
      setFormData({
        namaMasterSaldo: '',
        saldoMaksimal: '0',
        limitSekaliTransaksi: '0',
        limitTransaksiHarian: '0',
        limitTransaksiBulanan: '0',
        jenisTransaksi: [],
      });
    }
    setErrors({});
  }, [data, open]);

  const handleClose = () => {
    setFormData({
      namaMasterSaldo: '',
      saldoMaksimal: '0',
      limitSekaliTransaksi: '0',
      limitTransaksiHarian: '0',
      limitTransaksiBulanan: '0',
      jenisTransaksi: [],
    });
    setErrors({});
    onClose();
  };

  const handleChange = (field, value) => {
    if (field === 'saldoMaksimal' || field === 'limitSekaliTransaksi' || 
        field === 'limitTransaksiHarian' || field === 'limitTransaksiBulanan') {
      // Hanya terima angka
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
    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.namaMasterSaldo.trim()) {
      newErrors.namaMasterSaldo = 'Nama Master Saldo wajib diisi';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      return;
    }

    if (onSave) {
      try {
        await onSave(formData);
        // Only close dialog after successful save (toast will show success)
        handleClose();
      } catch (err) {
        // Error already handled by toast, don't close dialog
      }
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 1,
          fontWeight: 500,
        }}
      >
        {data ? 'Edit Data' : 'Tambah Data'}
        <IconButton
          size="small"
          onClick={handleClose}
          sx={{
            color: 'text.secondary',
          }}
        >
          <CloseSquare size={20} />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
          {/* Nama Master Saldo */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
              Nama Master Saldo<span style={{ color: 'red' }}>*</span>
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={formData.namaMasterSaldo}
              onChange={(e) => handleChange('namaMasterSaldo', e.target.value)}
              placeholder="Nama Master Saldo"
              error={!!errors.namaMasterSaldo}
              helperText={errors.namaMasterSaldo}
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: '0.875rem',
                },
              }}
            />
          </Box>

          {/* Saldo Maksimal */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
              Saldo Maksimal
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={formData.saldoMaksimal}
              onChange={(e) => handleChange('saldoMaksimal', e.target.value)}
              placeholder="0"
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: '0.875rem',
                },
              }}
            />
          </Box>

          {/* Limit Sekali Transaksi */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
              Limit Sekali Transaksi
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={formData.limitSekaliTransaksi}
              onChange={(e) => handleChange('limitSekaliTransaksi', e.target.value)}
              placeholder="0"
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: '0.875rem',
                },
              }}
            />
          </Box>

          {/* Limit Transaksi Harian */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
              Limit Transaksi Harian
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={formData.limitTransaksiHarian}
              onChange={(e) => handleChange('limitTransaksiHarian', e.target.value)}
              placeholder="0"
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: '0.875rem',
                },
              }}
            />
          </Box>

          {/* Limit Transaksi Bulanan */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
              Limit Transaksi Bulanan
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={formData.limitTransaksiBulanan}
              onChange={(e) => handleChange('limitTransaksiBulanan', e.target.value)}
              placeholder="0"
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: '0.875rem',
                },
              }}
            />
          </Box>

          {/* Jenis Transaksi yang Diizinkan */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
              Jenis Transaksi yang Diizinkan
            </Typography>
            <Autocomplete
              multiple
              options={jenisTransaksiOptions}
              value={formData.jenisTransaksi}
              onChange={(event, newValue) => {
                handleChange('jenisTransaksi', newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  placeholder="Pilih Kolom"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontSize: '0.875rem',
                    },
                  }}
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option}
                    label={option}
                    size="small"
                    sx={{
                      fontSize: '0.75rem',
                    }}
                  />
                ))
              }
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          variant="outlined"
          onClick={handleClose}
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
          onClick={handleSave}
          sx={{
            textTransform: 'none',
            bgcolor: '#155DFC',
            px: 3,
            '&:hover': {
              bgcolor: '#0f4fc7',
            },
          }}
        >
          {data ? 'Simpan' : 'Tambah'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
