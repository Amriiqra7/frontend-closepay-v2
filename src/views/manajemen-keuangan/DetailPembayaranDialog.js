'use client';

import React from 'react';
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
import { formatRupiah } from '@/shared/utils/format';

export default function DetailPembayaranDialog({ open, onClose, pembayaran }) {
  const formatCurrency = (value) => {
    const formatted = formatRupiah(value);
    return formatted ? `Rp ${formatted},00` : 'Rp 0,00';
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
          fontSize: '1.125rem',
        }}
      >
        Detail Data
        <IconButton
          size="small"
          onClick={onClose}
          sx={{
            color: '#666',
          }}
        >
          <CloseCircle size={24} />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
          {/* Logo Placeholder */}
          <Box
            sx={{
              width: '100%',
              height: 200,
              bgcolor: '#f5f5f5',
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #e0e0e0',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  bgcolor: '#1976d2',
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                  X
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 600, fontSize: '1.5rem' }}>
                xendit
              </Typography>
            </Box>
          </Box>

          {/* Tanggal */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Tanggal
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={pembayaran?.tanggalVerifikasi || ''}
              InputProps={{
                readOnly: true,
              }}
              sx={{
                '& .MuiInputBase-input': {
                  bgcolor: '#f5f5f5',
                },
              }}
            />
          </Box>

          {/* Nominal */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Nominal
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={pembayaran ? formatCurrency(pembayaran.nominalTerverifikasi) : ''}
              InputProps={{
                readOnly: true,
              }}
              sx={{
                '& .MuiInputBase-input': {
                  bgcolor: '#f5f5f5',
                },
              }}
            />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 1 }}>
        <Button
          variant="contained"
          onClick={onClose}
          sx={{
            textTransform: 'none',
            bgcolor: '#d32f2f',
            color: 'white',
            px: 3,
            '&:hover': {
              bgcolor: '#c62828',
            },
          }}
        >
          Kembali
        </Button>
      </DialogActions>
    </Dialog>
  );
}
