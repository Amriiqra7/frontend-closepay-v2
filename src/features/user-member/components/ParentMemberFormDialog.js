'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  TextField,
} from '@mui/material';
import { CloseCircle } from 'iconsax-react';
import { motion } from 'framer-motion';
import { showErrorToast } from '@/shared/utils/toast';

export default function ParentMemberFormDialog({ open, onClose, mode = 'add', member, onSuccess }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    nama: '',
    email: '',
    noTelepon: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && member) {
        setFormData({
          username: member.username || '',
          password: '',
          nama: member.nama || '',
          email: member.email || '',
          noTelepon: member.noTelp || '',
        });
      } else {
        setFormData({
          username: '',
          password: '',
          nama: '',
          email: '',
          noTelepon: '',
        });
      }
      setErrors({});
    }
  }, [open, mode, member]);

  const validate = () => {
    const newErrors = {};

    if (!formData.nama.trim()) {
      newErrors.nama = 'Nama wajib diisi';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!formData.noTelepon.trim()) {
      newErrors.noTelepon = 'No Telepon wajib diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      showErrorToast('Pastikan semua data wajib telah diisi dengan lengkap dan benar!');
      return;
    }

    // TODO: Implement API call
    onSuccess();
  };

  const handleClose = () => {
    setFormData({
      username: '',
      password: '',
      nama: '',
      email: '',
      noTelepon: '',
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperComponent={motion(Box)}
      PaperProps={{
        initial: false,
        sx: (theme) => ({
          borderRadius: 2,
          boxShadow: theme.shadows[24],
          bgcolor: 'background.paper',
        }),
      }}
      TransitionProps={{
        timeout: 200,
      }}
    >
          <DialogTitle
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              pb: 1,
              fontWeight: 600,
            }}
          >
            {mode === 'add' ? 'Tambah Akun Induk' : 'Edit Akun Induk'}
            <IconButton
              onClick={handleClose}
              size="small"
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <CloseCircle size={20} />
            </IconButton>
          </DialogTitle>

          <DialogContent>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                gap: 3,
                pt: 2,
              }}
            >
              {/* Left Column */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box>
                  <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem' }}>
                    Username
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="Username (Opsional)"
                    InputProps={{
                      sx: { fontSize: '0.875rem' }
                    }}
                    inputProps={{
                      style: { fontSize: '0.875rem' }
                    }}
                  />
                </Box>

                <Box>
                  <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem' }}>
                    Password
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Jika tidak memasukkan password, password akan tergenerate otomatis"
                    InputProps={{
                      sx: { fontSize: '0.875rem' }
                    }}
                    inputProps={{
                      style: { fontSize: '0.875rem' }
                    }}
                  />
                </Box>

                <Box>
                  <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem' }}>
                    Nama<span style={{ color: 'red' }}> *</span>
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    value={formData.nama}
                    onChange={(e) => {
                      setFormData({ ...formData, nama: e.target.value });
                      setErrors({ ...errors, nama: '' });
                    }}
                    placeholder="Nama"
                    error={Boolean(errors.nama)}
                    helperText={errors.nama}
                    required
                    InputProps={{
                      sx: { fontSize: '0.875rem' }
                    }}
                    inputProps={{
                      style: { fontSize: '0.875rem' }
                    }}
                    FormHelperTextProps={{
                      sx: { fontSize: '0.75rem' }
                    }}
                  />
                </Box>
              </Box>

              {/* Right Column */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box>
                  <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem' }}>
                    Email<span style={{ color: 'red' }}> *</span>
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      setErrors({ ...errors, email: '' });
                    }}
                    placeholder="Email"
                    error={Boolean(errors.email)}
                    helperText={errors.email}
                    required
                    InputProps={{
                      sx: { fontSize: '0.875rem' }
                    }}
                    inputProps={{
                      style: { fontSize: '0.875rem' }
                    }}
                    FormHelperTextProps={{
                      sx: { fontSize: '0.75rem' }
                    }}
                  />
                </Box>

                <Box>
                  <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem' }}>
                    No Telepon<span style={{ color: 'red' }}> *</span>
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    value={formData.noTelepon}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setFormData({ ...formData, noTelepon: value });
                      setErrors({ ...errors, noTelepon: '' });
                    }}
                    placeholder="No Telepon"
                    error={Boolean(errors.noTelepon)}
                    helperText={errors.noTelepon}
                    required
                    InputProps={{
                      sx: { fontSize: '0.875rem' }
                    }}
                    inputProps={{
                      style: { fontSize: '0.875rem' }
                    }}
                    FormHelperTextProps={{
                      sx: { fontSize: '0.75rem' }
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 3, pt: 2 }}>
            <Button
              variant="outlined"
              onClick={handleClose}
              sx={{
                textTransform: 'none',
                borderColor: 'error.main',
                color: 'error.main',
                '&:hover': {
                  borderColor: 'error.dark',
                  bgcolor: 'error.light',
                },
              }}
            >
              Batal
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{
                textTransform: 'none',
                bgcolor: '#9c27b0',
                color: 'white',
                '&:hover': {
                  bgcolor: '#7b1fa2',
                },
              }}
            >
              {mode === 'add' ? 'Tambah' : 'Simpan'}
            </Button>
          </DialogActions>
        </Dialog>
  );
}
