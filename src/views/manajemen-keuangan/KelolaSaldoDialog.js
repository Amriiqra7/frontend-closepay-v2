'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  Box,
} from '@mui/material';
import { CloseSquare } from 'iconsax-react';

export default function KelolaSaldoDialog({
  open,
  onClose,
  onConfirm,
  type, // 'member' or 'merchant'
  companyName,
}) {
  const getMessage = () => {
    const typeLabel = type === 'member' ? 'Saldo Member' : 'Saldo Merchant';
    if (companyName) {
      return `Apakah Anda yakin ingin melanjutkan untuk kelola ${typeLabel} dari ${companyName}?`;
    }
    return `Apakah Anda yakin ingin melanjutkan untuk kelola ${typeLabel}?`;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
          fontWeight: 600,
        }}
      >
        Konfirmasi
        <IconButton
          size="small"
          onClick={onClose}
          sx={{
            color: 'text.secondary',
          }}
        >
          <CloseSquare size={20} />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Typography variant="body1" sx={{ fontSize: '0.875rem' }}>
          {getMessage()}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          variant="outlined"
          onClick={onClose}
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
          onClick={onConfirm}
          sx={{
            textTransform: 'none',
            bgcolor: '#155DFC',
            px: 3,
            '&:hover': {
              bgcolor: '#0f4fc7',
            },
          }}
        >
          Ya
        </Button>
      </DialogActions>
    </Dialog>
  );
}
