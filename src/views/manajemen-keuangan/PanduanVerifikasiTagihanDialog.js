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
} from '@mui/material';
import { CloseCircle, TickCircle } from 'iconsax-react';

const steps = [
  'Klik tombol aksi Riwayat Tagihan',
  'Lakukan verifikasi pembayaran dengan menyertakan bukti transfer yang dikirimkan oleh partner',
  'Pastikan nominal yang Anda masukkan dengan nominal pada bukti transfer sesuai',
  'Pastikan sisa tagihan sudah berkurang',
  'Pastikan muncul data baru (konfirmasi pembayaran) pada aksi detail riwayat pembayaran, dan pastikan total tagihan perusahaan partner telah berkurang.',
];

export default function PanduanVerifikasiTagihanDialog({ open, onClose }) {
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
        Panduan Verifikasi Tagihan
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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          {steps.map((step, index) => (
            <Box key={index} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <Box
                sx={{
                  minWidth: 32,
                  height: 32,
                  borderRadius: '50%',
                  bgcolor: '#2e7d32',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                  {index + 1}
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ flex: 1, pt: 0.5 }}>
                {step}
              </Typography>
            </Box>
          ))}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 1 }}>
        <Button
          variant="contained"
          onClick={onClose}
          sx={{
            textTransform: 'none',
            bgcolor: '#2e7d32',
            color: 'white',
            px: 3,
            '&:hover': {
              bgcolor: '#1b5e20',
            },
          }}
        >
          Saya Mengerti
        </Button>
      </DialogActions>
    </Dialog>
  );
}
