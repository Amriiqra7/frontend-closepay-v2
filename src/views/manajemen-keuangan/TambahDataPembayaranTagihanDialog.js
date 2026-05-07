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
  InputAdornment,
} from '@mui/material';
import { CloseCircle } from 'iconsax-react';
import UploadFile from '@/shared/ui/UploadFile';
import { formatRupiah, parseRupiah } from '@/shared/utils/format';
import { toastPromise } from '@/shared/utils/toast';

export default function TambahDataPembayaranTagihanDialog({ open, onClose, tagihan, onSuccess }) {
  const [buktiTransfer, setBuktiTransfer] = useState(null);
  const [nominalTagihan, setNominalTagihan] = useState('0');
  const [error, setError] = useState({ buktiTransfer: '', nominalTagihan: '' });

  const formatCurrency = (value) => {
    const formatted = formatRupiah(value);
    return formatted ? `Rp ${formatted},00` : 'Rp 0,00';
  };

  const sisaTagihan = tagihan?.sisaTagihan || 0;

  const handleClose = () => {
    setBuktiTransfer(null);
    setNominalTagihan('0');
    setError({ buktiTransfer: '', nominalTagihan: '' });
    onClose();
  };

  const handleVerifikasi = async () => {
    let hasError = false;
    const newError = { buktiTransfer: '', nominalTagihan: '' };

    if (!buktiTransfer) {
      newError.buktiTransfer = 'Bukti Transfer wajib diisi';
      hasError = true;
    }

    if (!nominalTagihan || nominalTagihan === '0' || parseFloat(nominalTagihan) <= 0) {
      newError.nominalTagihan = 'Nominal Tagihan wajib diisi';
      hasError = true;
    }

    if (hasError) {
      setError(newError);
      return;
    }

    // Create promise for verification
    const verificationPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        // TODO: Replace with actual API call
        // const verificationPromise = TagihanAPI.verifikasiPembayaran({ buktiTransfer, nominalTagihan, tagihanId: tagihan?.id });
        
        console.log('Verifikasi pembayaran:', { buktiTransfer, nominalTagihan, tagihan });
        
        // Simulate API call
        if (Math.random() > 0.1) {
          resolve({ success: true });
        } else {
          reject(new Error('Gagal memverifikasi pembayaran tagihan'));
        }
      }, 1500);
    });

    try {
      await toastPromise(
        verificationPromise,
        {
          loading: 'Memverifikasi pembayaran tagihan...',
          success: 'Data pembayaran tagihan berhasil ditambahkan',
          error: (err) => `Gagal menambahkan data pembayaran: ${err.message || 'Terjadi kesalahan'}`,
        }
      );
      if (onSuccess) {
        onSuccess();
      }
      handleClose();
    } catch (err) {
      // Error already handled by toast
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
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
        Tambah Data Pembayaran Tagihan
        <IconButton
          size="small"
          onClick={handleClose}
          sx={{
            color: '#666',
          }}
        >
          <CloseCircle size={24} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ overflowY: 'auto' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Sisa Tagihan */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Sisa Tagihan
            </Typography>
            <Box
              sx={{
                p: 1.5,
                bgcolor: '#fce4ec',
                borderRadius: 1,
                border: '1px solid #f8bbd0',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#000' }}>
                {formatCurrency(sisaTagihan)}
              </Typography>
            </Box>
          </Box>

          {/* Bukti Transfer */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Bukti Transfer{' '}
              <Typography component="span" variant="body2" sx={{ color: '#d32f2f', fontWeight: 500 }}>
                *
              </Typography>
            </Typography>
            <UploadFile
              label=""
              value={buktiTransfer}
              onChange={setBuktiTransfer}
              accept="image/*,.pdf"
              maxSize={5 * 1024 * 1024}
              error={!!error.buktiTransfer}
              helperText={error.buktiTransfer}
            />
          </Box>

          {/* Nominal Tagihan */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Nominal Tagihan <span style={{ color: '#d32f2f' }}>*</span>
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={formatRupiah(nominalTagihan)}
              onChange={(e) => {
                const numericValue = parseRupiah(e.target.value);
                setNominalTagihan(numericValue);
                if (error.nominalTagihan) {
                  setError((prev) => ({ ...prev, nominalTagihan: '' }));
                }
              }}
              error={!!error.nominalTagihan}
              helperText={error.nominalTagihan}
              placeholder="0"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>Rp</Typography>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Peringatan */}
          <Box
            sx={{
              p: 2,
              bgcolor: '#fce4ec',
              borderRadius: 1,
              border: '1px solid #f8bbd0',
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: '#000' }}>
              PERINGATAN !
            </Typography>
            <Typography variant="body2" sx={{ color: '#000', fontSize: '0.875rem' }}>
              Nominal yang Anda masukkan akan <strong>mengurangi total tagihan</strong> pada perusahaan partner. Pastikan data pembayaran telah benar dan sesuai, aktivitas ini{' '}
              <strong>tidak bisa diubah, dibatalkan, ataupun dihapus!</strong>
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 1 }}>
        <Button
          variant="outlined"
          onClick={handleClose}
          sx={{
            textTransform: 'none',
            borderColor: '#d32f2f',
            color: '#d32f2f',
            px: 3,
            '&:hover': {
              borderColor: '#c62828',
              bgcolor: 'rgba(211, 47, 47, 0.04)',
            },
          }}
        >
          Kembali
        </Button>
        <Button
          variant="contained"
          onClick={handleVerifikasi}
          sx={{
            textTransform: 'none',
            bgcolor: '#1976d2',
            color: 'white',
            px: 3,
            '&:hover': {
              bgcolor: '#1565c0',
            },
          }}
        >
          Verifikasi
        </Button>
      </DialogActions>
    </Dialog>
  );
}
