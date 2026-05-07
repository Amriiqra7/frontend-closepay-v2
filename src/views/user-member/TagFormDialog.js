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
  Switch,
  FormControlLabel,
  Alert,
} from '@mui/material';
import { CloseCircle } from 'iconsax-react';
import { motion } from 'framer-motion';
import { showErrorToast } from '@/shared/utils/toast';

export default function TagFormDialog({ open, onClose, mode = 'add', tag, onSuccess }) {
  const [nama, setNama] = useState(tag?.nama || '');
  const [sinkronkan, setSinkronkan] = useState(tag?.sinkronkan || false);
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (open) {
      if (mode === 'edit' && tag) {
        setNama(tag.nama || '');
        setSinkronkan(tag.sinkronkan || false);
      } else {
        setNama('');
        setSinkronkan(false);
      }
      setError('');
    }
  }, [open, mode, tag]);

  const handleSubmit = () => {
    if (!nama.trim()) {
      setError('Nama tags wajib diisi');
      return;
    }

    // TODO: Implement API call
    onSuccess();
  };

  const handleClose = () => {
    setNama('');
    setSinkronkan(false);
    setError('');
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
            {mode === 'add' ? 'Tambah Data Tags' : 'Edit Data Tags'}
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
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box>
                <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem', fontWeight: 500 }}>
                  Nama Tags
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={nama}
                  onChange={(e) => {
                    setNama(e.target.value);
                    setError('');
                  }}
                  placeholder="Nama Tags"
                  error={Boolean(error)}
                  InputProps={{
                    sx: { fontSize: '0.875rem' }
                  }}
                />
                {error && (
                  <Typography variant="caption" sx={{ color: 'error.main', mt: 0.5, fontSize: '0.75rem' }}>
                    {error}
                  </Typography>
                )}
              </Box>

              <Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={sinkronkan}
                      onChange={(e) => setSinkronkan(e.target.checked)}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: 'success.main',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: 'success.main',
                        },
                      }}
                    />
                  }
                  label={
                    <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '0.9375rem' }}>
                      SINKRONKAN TAGS KE SELF REGISTER
                    </Typography>
                  }
                />
                <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary', fontSize: '0.875rem' }}>
                  Sinkronkan tags agar muncul saat calon anggota melakukan self register (pendaftaran mandiri).
                </Typography>
              </Box>

              {mode === 'add' && (
                <Alert severity="error" sx={{ fontSize: '0.875rem' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                    PERINGATAN
                  </Typography>
                  <Typography variant="body2">
                    Pastikan data yang Anda masukkan sudah benar, data yang sudah ditambahkan tidak bisa diubah atau dihapus.
                  </Typography>
                </Alert>
              )}
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
              {mode === 'add' ? 'Tambah' : 'Simpan'}
            </Button>
          </DialogActions>
        </Dialog>
  );
}
