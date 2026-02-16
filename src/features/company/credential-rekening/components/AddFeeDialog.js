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
  FormControl,
  Select,
  MenuItem,
} from '@mui/material';
import { formatRupiah } from '@/shared/utils/format';

export default function AddFeeDialog({
  open,
  onClose,
  title = 'Tambah Data Biaya Pembayaran',
  fee,
  onFeeChange,
  onSubmit,
}) {
  const handleClose = () => {
    onClose();
  };

  const handleSubmit = () => {
    if (fee.tipe && fee.nilai) {
      onSubmit();
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
        {title}
        <IconButton
          size="small"
          onClick={handleClose}
          sx={{
            color: 'text.secondary',
          }}
        >
          ×
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <Box>
            <Typography variant="body2" sx={{ fontSize: '0.875rem', mb: 1 }}>
              Deskripsi
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Deskripsi"
              value={fee.deskripsi}
              onChange={(e) => onFeeChange({ ...fee, deskripsi: e.target.value })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: '0.875rem',
                },
              }}
            />
          </Box>
          <Box>
            <Typography variant="body2" sx={{ fontSize: '0.875rem', mb: 1 }}>
              Tipe <span style={{ color: 'red' }}>*</span>
            </Typography>
            <FormControl fullWidth size="small" sx={{ minWidth: 200 }}>
              <Select
                value={fee.tipe}
                onChange={(e) => onFeeChange({ ...fee, tipe: e.target.value })}
                displayEmpty
                sx={{
                  fontSize: '0.875rem',
                }}
              >
                <MenuItem value="" disabled sx={{ fontSize: '0.875rem' }}>
                  Pilih Tipe
                </MenuItem>
                <MenuItem value="NOMINAL" sx={{ fontSize: '0.875rem' }}>NOMINAL</MenuItem>
                <MenuItem value="PERCENTAGE" sx={{ fontSize: '0.875rem' }}>PERCENTAGE</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ fontSize: '0.875rem', mb: 1 }}>
              Nominal <span style={{ color: 'red' }}>*</span>
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder={fee.tipe === 'NOMINAL' ? '1.000' : '10'}
              value={
                fee.tipe === 'NOMINAL' || !fee.tipe
                  ? formatRupiah(fee.nilai)
                  : (fee.nilai || '')
              }
              onChange={(e) => {
                const value = e.target.value.replace(/[^\d]/g, '');
                onFeeChange({ ...fee, nilai: value });
              }}
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
          onClick={handleSubmit}
          variant="contained"
          disabled={!fee.tipe || !fee.nilai}
          sx={{
            textTransform: 'none',
            bgcolor: '#155DFC',
            '&:hover': {
              bgcolor: '#0f4fc7',
            },
            '&:disabled': {
              bgcolor: 'rgba(0, 0, 0, 0.12)',
              color: 'rgba(0, 0, 0, 0.26)',
            },
          }}
        >
          Tambah
        </Button>
      </DialogActions>
    </Dialog>
  );
}
