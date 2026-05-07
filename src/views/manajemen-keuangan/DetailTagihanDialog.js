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
import { CloseCircle, DocumentDownload } from 'iconsax-react';
import { formatRupiah } from '@/shared/utils/format';

export default function DetailTagihanDialog({ open, onClose, tagihan }) {
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
        Detail Tagihan
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
          {/* File Tagihan */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              File Tagihan
            </Typography>
            <Button
              variant="contained"
              startIcon={<DocumentDownload size={20} color="#ffffff" />}
              sx={{
                textTransform: 'none',
                bgcolor: '#9c27b0',
                color: 'white',
                '&:hover': {
                  bgcolor: '#7b1fa2',
                },
              }}
            >
              Unduh File Tagihan
            </Button>
          </Box>

          {/* Tanggal */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Tanggal
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={tagihan?.tanggal || ''}
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
              value={tagihan ? formatCurrency(tagihan.totalTagihan) : ''}
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

          {/* Status */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Status
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={tagihan?.status || ''}
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

          {/* Info */}
          <Typography variant="body2" sx={{ color: '#d32f2f', fontSize: '0.875rem' }}>
            Lihat riwayat pembayaran Anda pada aksi Detail Riwayat Pembayaran.
          </Typography>
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
