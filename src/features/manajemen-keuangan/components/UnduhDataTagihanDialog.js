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
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { CloseCircle } from 'iconsax-react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { toastPromise } from '@/shared/utils/toast';

// Mock data untuk kolom
const kolomOptions = [
  'Bulan Tagihan',
  'Nama Tagihan',
  'Total Tagihan',
  'Sisa Tagihan',
];

export default function UnduhDataTagihanDialog({ open, onClose }) {
  const [tanggal, setTanggal] = useState(null);
  const [kolomData, setKolomData] = useState('');
  const [unduhSeluruhKolom, setUnduhSeluruhKolom] = useState(false);

  const handleClose = () => {
    setTanggal(null);
    setKolomData('');
    setUnduhSeluruhKolom(false);
    onClose();
  };

  const handleUnduh = async () => {
    // Validation
    if (!tanggal) {
      // You can add error handling here if needed
      return;
    }

    if (!unduhSeluruhKolom && !kolomData) {
      // You can add error handling here if needed
      return;
    }

    // Create promise for download
    const downloadPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        // TODO: Replace with actual API call
        // const downloadPromise = TagihanAPI.downloadData({ tanggal, kolomData, unduhSeluruhKolom });
        
        console.log('Download data:', { tanggal, kolomData, unduhSeluruhKolom });
        
        // Simulate API call
        if (Math.random() > 0.1) {
          // Simulate file download
          const link = document.createElement('a');
          link.href = '#';
          link.download = 'data-tagihan.xlsx';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          resolve({ success: true });
        } else {
          reject(new Error('Gagal mengunduh data tagihan'));
        }
      }, 1500);
    });

    try {
      await toastPromise(
        downloadPromise,
        {
          loading: 'Mengunduh data tagihan...',
          success: 'Data tagihan berhasil diunduh',
          error: (err) => `Gagal mengunduh data: ${err.message || 'Terjadi kesalahan'}`,
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
        Pengaturan Unduh Data
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

      <DialogContent>
        <Typography variant="body2" sx={{ mb: 3, color: '#666', fontSize: '0.875rem' }}>
          Anda dapat memilih rentang tanggal maksimal 31 hari. Data yang nantinya terunduh adalah data dalam rentang tanggal yang dipilih. Anda juga dapat mengatur kolom data apa saja yang ingin Anda unduh.
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Tanggal <span style={{ color: '#d32f2f' }}>*</span>
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                views={['year', 'month']}
                openTo="month"
                value={tanggal}
                onChange={(newValue) => setTanggal(newValue)}
                slotProps={{
                  textField: {
                    size: 'small',
                    fullWidth: true,
                    placeholder: 'Pilih Bulan',
                  },
                }}
                format="MMMM YYYY"
              />
            </LocalizationProvider>
          </Box>

          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Kolom Data <span style={{ color: '#d32f2f' }}>*</span>
            </Typography>
            <FormControl fullWidth size="small" disabled={unduhSeluruhKolom}>
              <Select
                value={kolomData}
                onChange={(e) => setKolomData(e.target.value)}
                displayEmpty
                sx={{
                  '& .MuiSelect-select': {
                    color: kolomData ? 'inherit' : '#999',
                  },
                }}
              >
                <MenuItem value="" disabled>
                  <em>Pilih Kolom</em>
                </MenuItem>
                {kolomOptions.map((kolom) => (
                  <MenuItem key={kolom} value={kolom}>
                    {kolom}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <FormControlLabel
            control={
              <Checkbox
                checked={unduhSeluruhKolom}
                onChange={(e) => {
                  setUnduhSeluruhKolom(e.target.checked);
                  if (e.target.checked) {
                    setKolomData('');
                  }
                }}
                size="small"
              />
            }
            label={
              <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                Unduh seluruh kolom data yang ada
              </Typography>
            }
          />
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
          Batal
        </Button>
        <Button
          variant="contained"
          onClick={handleUnduh}
          sx={{
            textTransform: 'none',
            bgcolor: '#155DFC',
            color: 'white',
            px: 3,
            '&:hover': {
              bgcolor: '#0d4fc7',
            },
          }}
        >
          Unduh Data
        </Button>
      </DialogActions>
    </Dialog>
  );
}
