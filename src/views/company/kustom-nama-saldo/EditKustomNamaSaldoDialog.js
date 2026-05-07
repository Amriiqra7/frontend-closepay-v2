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

export default function EditKustomNamaSaldoDialog({
  open,
  onClose,
  saldo,
  onSave,
}) {
  const [formData, setFormData] = useState({
    namaSaldoKustom: '',
  });

  useEffect(() => {
    if (saldo) {
      setFormData({
        namaSaldoKustom: saldo.namaSaldoKustom || '',
      });
    }
  }, [saldo]);

  const handleClose = () => {
    setFormData({ namaSaldoKustom: '' });
    onClose();
  };

  const handleSave = async () => {
    if (saldo && onSave) {
      try {
        await onSave({
          ...saldo,
          namaSaldoKustom: formData.namaSaldoKustom,
        });
        // Only close dialog after successful save
        handleClose();
      } catch (err) {
        // Error already handled by toast in parent
        // Dialog remains open on error so user can retry
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
          fontSize: '1.125rem',
          fontWeight: 600,
          pb: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        Kustom Nama Saldo
        <IconButton
          size="small"
          onClick={handleClose}
          sx={{
            color: 'text.secondary',
            '&:hover': {
              bgcolor: 'rgba(0, 0, 0, 0.04)',
            },
          }}
        >
          <CloseSquare size={20} color="currentColor" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
          {/* Kode Saldo */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
              Kode Saldo
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={saldo?.kodeSaldo || ''}
              disabled
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: '0.875rem',
                  bgcolor: 'rgba(0, 0, 0, 0.06)',
                },
              }}
            />
          </Box>

          {/* Nama Saldo Default */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
              Nama Saldo Default
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={saldo?.namaSaldoDefault || ''}
              disabled
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: '0.875rem',
                  bgcolor: 'rgba(0, 0, 0, 0.06)',
                },
              }}
            />
          </Box>

          {/* Instruction Text */}
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
            Masukkan nama kustom dari saldo ini yang akan diterapkan ke member dan admin dari perusahaan ini.
          </Typography>

          {/* Nama Saldo Kustom */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
              Nama Saldo Kustom
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={formData.namaSaldoKustom}
              onChange={(e) => setFormData({ namaSaldoKustom: e.target.value })}
              placeholder="Nama Saldo Kustom"
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: '0.875rem',
                },
              }}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 1 }}>
        <Button
          onClick={handleClose}
          sx={{
            textTransform: 'none',
            color: 'error.main',
            borderColor: 'error.main',
            '&:hover': {
              borderColor: 'error.main',
              bgcolor: 'error.lighter',
            },
          }}
          variant="outlined"
        >
          Batal
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          sx={{
            textTransform: 'none',
            bgcolor: '#155DFC',
            '&:hover': {
              bgcolor: '#0f4fc7',
            },
          }}
        >
          Simpan
        </Button>
      </DialogActions>
    </Dialog>
  );
}
