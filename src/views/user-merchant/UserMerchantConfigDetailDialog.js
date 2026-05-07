'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  Switch,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import { CloseCircle } from 'iconsax-react';

const formatOptions = [
  { value: 'Text', label: 'Text' },
  { value: 'Datetime', label: 'Datetime' },
  { value: 'Date', label: 'Date' },
  { value: 'Time', label: 'Time' },
  { value: 'Email', label: 'Email' },
  { value: 'Phone', label: 'Phone' },
  { value: 'Integer', label: 'Integer' },
  { value: 'Numeric', label: 'Numeric' },
  { value: 'Enum', label: 'Enum' },
  { value: 'Flags', label: 'Flags' },
];

export default function UserMerchantConfigDetailDialog({
  open,
  onClose,
  data,
  isDataTambahan = false,
}) {
  if (!data) return null;

  // Convert status string to boolean for display
  const statusKolom = data.statusKolom === 'Ditampilkan' || data.statusKolom === true;
  const wajibDiisi = data.wajibDiisi === 'Ya' || data.wajibDiisi === true;
  const dapatDiedit = data.dapatDiedit === 'Ya' || data.dapatDiedit === true;

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
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 2,
          borderBottom: '1px solid #e5e7eb',
          fontWeight: 600,
          fontSize: '1.25rem',
          color: '#111827',
        }}
      >
        Detail Data {isDataTambahan ? 'Tambahan' : 'Basic'}
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: '#6b7280',
            '&:hover': {
              bgcolor: '#f3f4f6',
            },
          }}
        >
          <CloseCircle size={24} variant="Linear" color="#6b7280" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Nama Kolom */}
          <Box>
            <InputLabel sx={{ mt: 1, mb: 0.5, fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
              Nama Kolom
            </InputLabel>
            <TextField
              fullWidth
              value={data.namaKolom || ''}
              disabled
              size="small"
              sx={{
                '& .MuiInputBase-input': {
                  bgcolor: '#f9fafb',
                },
                '& .MuiOutlinedInput-root': {
                  fontSize: '0.875rem',
                },
              }}
            />
          </Box>

          {/* Format Kolom - hanya untuk Data Tambahan */}
          {isDataTambahan && (
            <FormControl fullWidth size="small" disabled>
              <InputLabel sx={{ fontSize: '0.875rem' }}>Format Kolom</InputLabel>
              <Select
                value={data.formatKolom || ''}
                label="Format Kolom"
                sx={{
                  fontSize: '0.875rem',
                  bgcolor: '#f9fafb',
                }}
              >
                {formatOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {/* TAMPILKAN KOLOM */}
          <Box>
            <FormControlLabel
              control={
                <Switch
                  checked={statusKolom}
                  disabled
                  color="primary"
                />
              }
              label={
                <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827' }}>
                  TAMPILKAN KOLOM
                </Typography>
              }
            />
            <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.75rem', mt: 0.5, ml: 5 }}>
              Kolom akan ditampilkan pada formulir saat akan melakukan penambahan user merchant.
              Anda juga dapat menonaktifkan tampilan kolom ini pada lain waktu.
            </Typography>
          </Box>

          {/* WAJIBKAN PENGISIAN KOLOM */}
          <Box>
            <FormControlLabel
              control={
                <Switch
                  checked={wajibDiisi}
                  disabled
                  color="primary"
                />
              }
              label={
                <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827' }}>
                  WAJIBKAN PENGISIAN KOLOM
                </Typography>
              }
            />
            <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.75rem', mt: 0.5, ml: 5 }}>
              Kolom akan diatur sebagai salah satu kolom yang wajib diisi ketika akan melakukan
              penambahan user merchant. Anda juga dapat mengatur kolom ini sebagai salah satu kolom
              optional yang tidak wajib diisi.
            </Typography>
          </Box>

          {/* EDITABLE KOLOM */}
          <Box>
            <FormControlLabel
              control={
                <Switch
                  checked={dapatDiedit}
                  disabled
                  color="primary"
                />
              }
              label={
                <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827' }}>
                  EDITABLE KOLOM
                </Typography>
              }
            />
            <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.75rem', mt: 0.5, ml: 5 }}>
              Kolom akan di atur sebagai kolom yang dapat diedit oleh user merchant. Anda juga dapat
              mengatur kolom ini sebagai kolom yang tidak dapat diedit oleh user merchant pada lain
              waktu.
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 2, borderTop: '1px solid #e5e7eb' }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            textTransform: 'none',
          }}
        >
          Tutup
        </Button>
      </DialogActions>
    </Dialog>
  );
}
