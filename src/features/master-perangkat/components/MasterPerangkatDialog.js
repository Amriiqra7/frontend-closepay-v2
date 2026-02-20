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

export default function MasterPerangkatDialog({
  open,
  onClose,
  onSave,
  data,
  mode = 'add', // 'add', 'edit', 'detail'
}) {
  const [formData, setFormData] = useState({
    kodePerangkat: '',
    namaPerangkat: '',
    deskripsi: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (data) {
      setFormData({
        kodePerangkat: data.kodePerangkat || '',
        namaPerangkat: data.namaPerangkat || '',
        deskripsi: data.deskripsi || '',
      });
    } else {
      setFormData({
        kodePerangkat: '',
        namaPerangkat: '',
        deskripsi: '',
      });
    }
    setErrors({});
  }, [data, open]);

  const handleClose = () => {
    setFormData({
      kodePerangkat: '',
      namaPerangkat: '',
      deskripsi: '',
    });
    setErrors({});
    onClose();
  };

  const handleChange = (field, value) => {
    if (field === 'kodePerangkat') {
      // Limit to 12 characters
      const limitedValue = value.slice(0, 12);
      setFormData((prev) => ({
        ...prev,
        [field]: limitedValue,
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
    if (!formData.kodePerangkat.trim()) {
      newErrors.kodePerangkat = 'Kode Perangkat wajib diisi';
    }
    if (!formData.namaPerangkat.trim()) {
      newErrors.namaPerangkat = 'Nama Perangkat wajib diisi';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (mode === 'detail') {
      handleClose();
      return;
    }

    if (!validate()) {
      return;
    }

    if (onSave) {
      try {
        await onSave(formData);
        handleClose();
      } catch (err) {
        // Error already handled by toast, don't close dialog
      }
    }
  };

  const isReadOnly = mode === 'detail';

  const getTitle = () => {
    if (mode === 'detail') return 'Detail Perangkat';
    if (mode === 'edit') return 'Edit Perangkat';
    return 'Tambah Perangkat';
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
        {getTitle()}
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
      <DialogContent sx={{ overflowY: 'auto' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
          {/* Kode Perangkat */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
              Kode Perangkat<span style={{ color: 'red' }}> *</span>
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={formData.kodePerangkat}
              onChange={(e) => handleChange('kodePerangkat', e.target.value)}
              placeholder="Kode Perangkat"
              error={!!errors.kodePerangkat}
              helperText={errors.kodePerangkat}
              disabled={isReadOnly}
              inputProps={{
                maxLength: 12,
              }}
              InputProps={{
                endAdornment: !isReadOnly && (
                  <Typography variant="caption" sx={{ color: 'text.secondary', mr: 1 }}>
                    {formData.kodePerangkat.length}/12
                  </Typography>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: '0.875rem',
                },
              }}
            />
          </Box>

          {/* Nama Perangkat */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
              Nama Perangkat<span style={{ color: 'red' }}> *</span>
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={formData.namaPerangkat}
              onChange={(e) => handleChange('namaPerangkat', e.target.value)}
              placeholder="Nama Perangkat"
              error={!!errors.namaPerangkat}
              helperText={errors.namaPerangkat}
              disabled={isReadOnly}
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: '0.875rem',
                },
              }}
            />
          </Box>

          {/* Deskripsi Perangkat */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
              Deskripsi Perangkat
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              size="small"
              value={formData.deskripsi}
              onChange={(e) => handleChange('deskripsi', e.target.value)}
              placeholder="Deskripsi Perangkat"
              disabled={isReadOnly}
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
          {mode === 'detail' ? 'Tutup' : 'Batal'}
        </Button>
        {mode !== 'detail' && (
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
            {mode === 'edit' ? 'Simpan' : 'Tambah'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
