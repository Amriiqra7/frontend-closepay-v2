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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import { CloseSquare } from 'iconsax-react';
import { formatRupiah, parseRupiah } from '@/shared/utils/format';

export default function TagihanDetailDialog({
  open,
  onClose,
  onSave,
  data,
}) {
  const [formData, setFormData] = useState({
    namaDetail: '',
    nominal: '',
    diskon: '',
    totalItem: 0,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (data) {
      const nominal = data.nominal || 0;
      const diskon = data.diskon || 0;
      const totalItem = nominal - diskon;
      setFormData({
        namaDetail: data.namaDetail || '',
        nominal: nominal.toString(),
        diskon: diskon.toString(),
        totalItem: totalItem,
      });
    } else {
      setFormData({
        namaDetail: '',
        nominal: '0',
        diskon: '0',
        totalItem: 0,
      });
    }
    setErrors({});
  }, [data, open]);

  useEffect(() => {
    // Calculate total item when nominal or diskon changes
    const nominal = parseFloat(formData.nominal) || 0;
    const diskon = parseFloat(formData.diskon) || 0;
    const totalItem = nominal - diskon;
    setFormData((prev) => ({
      ...prev,
      totalItem: totalItem < 0 ? 0 : totalItem,
    }));
  }, [formData.nominal, formData.diskon]);

  const handleClose = () => {
    setFormData({
      namaDetail: '',
      nominal: '0',
      diskon: '0',
      totalItem: 0,
    });
    setErrors({});
    onClose();
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleNominalChange = (e) => {
    const numericValue = parseRupiah(e.target.value);
    handleChange('nominal', numericValue);
  };

  const handleDiskonChange = (e) => {
    const numericValue = parseRupiah(e.target.value);
    handleChange('diskon', numericValue);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.namaDetail.trim()) {
      newErrors.namaDetail = 'Nama Detail wajib diisi';
    }
    if (!formData.nominal || parseFloat(formData.nominal) <= 0) {
      newErrors.nominal = 'Nominal wajib diisi dan harus lebih dari 0';
    }
    if (formData.totalItem <= 0) {
      newErrors.totalItem = 'Total Item harus lebih dari 0';
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
        const saveData = {
          namaDetail: formData.namaDetail,
          nominal: parseFloat(formData.nominal),
          diskon: parseFloat(formData.diskon) || 0,
          totalItem: formData.totalItem,
        };
        await onSave(saveData);
        handleClose();
      } catch (err) {
        // Error already handled by toast
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
        Tambah Detail Item Invoice
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
          {/* Nama Detail */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
              Nama Detail<span style={{ color: 'red' }}>*</span>
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={formData.namaDetail}
              onChange={(e) => handleChange('namaDetail', e.target.value)}
              placeholder="Nama Detail"
              error={!!errors.namaDetail}
              helperText={errors.namaDetail}
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: '0.875rem',
                },
              }}
            />
          </Box>

          {/* Nominal */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
              Nominal<span style={{ color: 'red' }}>*</span>
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={formatRupiah(formData.nominal || '0')}
              onChange={handleNominalChange}
              placeholder="0"
              error={!!errors.nominal}
              helperText={errors.nominal}
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

          {/* Diskon */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
              Diskon
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={formatRupiah(formData.diskon || '0')}
              onChange={handleDiskonChange}
              placeholder="0"
              error={!!errors.diskon}
              helperText={errors.diskon}
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

          {/* Total Item */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
              Total Item<span style={{ color: 'red' }}>*</span>
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={formatRupiah(formData.totalItem || '0')}
              disabled
              error={!!errors.totalItem}
              helperText={errors.totalItem}
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
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
              }}
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
              bgcolor: 'rgba(211, 47, 47, 0.04)',
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
          Tambah
        </Button>
      </DialogActions>
    </Dialog>
  );
}
