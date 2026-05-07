'use client';

import React, { useState } from 'react';
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

export default function ChangePasswordDialog({ open, onClose, member, onSuccess }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

  React.useEffect(() => {
    if (open) {
      setPassword('');
      setConfirmPassword('');
      setErrors({});
    }
  }, [open]);

  const validate = () => {
    const newErrors = {};

    if (!password.trim()) {
      newErrors.password = 'Password baru wajib diisi';
    } else if (password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Konfirmasi password wajib diisi';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi password tidak sesuai';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      showErrorToast('Pastikan semua data telah diisi dengan lengkap dan benar!');
      return;
    }

    // TODO: Implement API call
    onSuccess();
  };

  const handleClose = () => {
    setPassword('');
    setConfirmPassword('');
    setErrors({});
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
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
            Ganti Password
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
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
              <Box>
                <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem' }}>
                  Password Baru<span style={{ color: 'red' }}> *</span>
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors({ ...errors, password: '' });
                  }}
                  placeholder="Password Baru"
                  error={Boolean(errors.password)}
                  helperText={errors.password}
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
                  Konfirmasi Password Baru<span style={{ color: 'red' }}> *</span>
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setErrors({ ...errors, confirmPassword: '' });
                  }}
                  placeholder="Konfirmasi Password Baru"
                  error={Boolean(errors.confirmPassword)}
                  helperText={errors.confirmPassword}
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
                bgcolor: '#3b82f6',
                color: 'white',
                '&:hover': {
                  bgcolor: '#2563eb',
                },
              }}
            >
              Simpan
            </Button>
          </DialogActions>
        </Dialog>
  );
}
