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
} from '@mui/material';
import { CloseSquare } from 'iconsax-react';

export default function MasterBankDialog({
  open,
  onClose,
  onSave,
  data,
}) {
  const [formData, setFormData] = useState({
    namaBank: '',
    kodeBank: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (data) {
      setFormData({
        namaBank: data.namaBank || '',
        kodeBank: data.kodeBank || '',
      });
    } else {
      setFormData({
        namaBank: '',
        kodeBank: '',
      });
    }
    setErrors({});
  }, [data, open]);

  const handleClose = () => {
    setFormData({
      namaBank: '',
      kodeBank: '',
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

  const validate = () => {
    const newErrors = {};
    if (!formData.namaBank.trim()) {
      newErrors.namaBank = 'Nama Bank wajib diisi';
    }
    if (!formData.kodeBank.trim()) {
      newErrors.kodeBank = 'Kode Bank wajib diisi';
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
          {/* Nama Bank */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
              Nama Bank<span style={{ color: 'red' }}>*</span>
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={formData.namaBank}
              onChange={(e) => handleChange('namaBank', e.target.value)}
              placeholder="Nama Bank"
              error={!!errors.namaBank}
              helperText={errors.namaBank}
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: '0.875rem',
                },
              }}
            />
          </Box>

          {/* Kode Bank */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
              Kode Bank<span style={{ color: 'red' }}>*</span>
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={formData.kodeBank}
              onChange={(e) => handleChange('kodeBank', e.target.value)}
              placeholder="Kode Bank"
              error={!!errors.kodeBank}
              helperText={errors.kodeBank}
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: '0.875rem',
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
