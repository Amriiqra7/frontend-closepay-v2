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

export default function TambahDataTagihanDialog({ open, onClose }) {
  const [fileTagihan, setFileTagihan] = useState(null);
  const [namaTagihan, setNamaTagihan] = useState('');
  const [nominalTagihan, setNominalTagihan] = useState('0');
  const [error, setError] = useState({ fileTagihan: '', namaTagihan: '', nominalTagihan: '' });

  const handleClose = () => {
    setFileTagihan(null);
    setNamaTagihan('');
    setNominalTagihan('0');
    setError({ fileTagihan: '', namaTagihan: '', nominalTagihan: '' });
    onClose();
  };

  const handleTambah = async () => {
    let hasError = false;
    const newError = { fileTagihan: '', namaTagihan: '', nominalTagihan: '' };

    if (!fileTagihan) {
      newError.fileTagihan = 'File Tagihan wajib diisi';
      hasError = true;
    }

    if (!namaTagihan.trim()) {
      newError.namaTagihan = 'Nama Tagihan wajib diisi';
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

    // Create promise for adding invoice
    const addPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        // TODO: Replace with actual API call
        console.log('Tambah data tagihan:', { fileTagihan, namaTagihan, nominalTagihan });
        
        // Simulate API call
        if (Math.random() > 0.1) {
          resolve({ success: true });
        } else {
          reject(new Error('Gagal menambahkan data tagihan'));
        }
      }, 1500);
    });

    try {
      await toastPromise(
        addPromise,
        {
          loading: 'Menambahkan data tagihan...',
          success: 'Data tagihan berhasil ditambahkan',
          error: (err) => `Gagal menambahkan data tagihan: ${err.message || 'Terjadi kesalahan'}`,
        }
      );
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
        Tambah Data Tagihan
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
          {/* File Tagihan */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              File Tagihan
            </Typography>
            <UploadFile
              label=""
              value={fileTagihan}
              onChange={setFileTagihan}
              accept=".pdf,.xlsx,.xls"
              maxSize={10 * 1024 * 1024}
              error={!!error.fileTagihan}
              helperText={error.fileTagihan}
            />
          </Box>

          {/* Nama Tagihan */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Nama Tagihan{' '}
              <Typography component="span" variant="body2" sx={{ color: '#d32f2f', fontWeight: 500 }}>
                *
              </Typography>
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={namaTagihan}
              onChange={(e) => {
                setNamaTagihan(e.target.value);
                if (error.namaTagihan) {
                  setError((prev) => ({ ...prev, namaTagihan: '' }));
                }
              }}
              error={!!error.namaTagihan}
              helperText={error.namaTagihan}
              placeholder="Nama Tagihan"
            />
          </Box>

          {/* Nominal Tagihan */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Nominal Tagihan{' '}
              <Typography component="span" variant="body2" sx={{ color: '#d32f2f', fontWeight: 500 }}>
                *
              </Typography>
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
              Pastikan data telah benar dan sesuai, data tagihan yang telah dibuat tidak bisa diubah dan dihapus!
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
          onClick={handleTambah}
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
          Tambah
        </Button>
      </DialogActions>
    </Dialog>
  );
}
