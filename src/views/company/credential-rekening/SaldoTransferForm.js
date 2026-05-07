'use client';

import React from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Divider,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from '@mui/material';
import { formatRupiah } from '@/shared/utils/format';

export default function SaldoTransferForm({
  saldoTransfer,
  limits,
  onSaldoTransferChange,
  onLimitChange,
  onSave,
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        border: '1px solid',
        borderColor: 'rgba(0, 0, 0, 0.08)',
        borderRadius: 2,
        bgcolor: 'background.paper',
        height: '100%',
        minHeight: '100%',
        width: '100%',
        maxWidth: '100%',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography variant="h6" fontWeight={600} sx={{ mb: 3, fontSize: '1rem' }}>
        Saldo Transfer Perusahaan
      </Typography>
      
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Biaya Pemakaian */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2, fontSize: '0.875rem' }}>
            Biaya Pemakaian
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel sx={{ fontSize: '0.875rem' }}>Tipe</InputLabel>
                <Select
                  value={saldoTransfer.tipe}
                  onChange={(e) => onSaldoTransferChange('tipe', e.target.value)}
                  label="Tipe"
                  sx={{
                    fontSize: '0.875rem',
                    minWidth: 200,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(0, 0, 0, 0.23)',
                    },
                  }}
                >
                  <MenuItem value="NOMINAL" sx={{ fontSize: '0.875rem' }}>NOMINAL</MenuItem>
                  <MenuItem value="PERCENTAGE" sx={{ fontSize: '0.875rem' }}>PERCENTAGE</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                size="small"
                label="Nominal"
                value={saldoTransfer.nominal}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^\d]/g, '');
                  onSaldoTransferChange('nominal', value);
                }}
                placeholder="1.000"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    fontSize: '0.875rem',
                    bgcolor: 'background.paper',
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '0.875rem',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label="Keterangan"
                value={saldoTransfer.keterangan}
                onChange={(e) => onSaldoTransferChange('keterangan', e.target.value)}
                placeholder="Biaya Admin"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    fontSize: '0.875rem',
                    bgcolor: 'background.paper',
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '0.875rem',
                  },
                }}
              />
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Limit Pemakaian */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2, fontSize: '0.875rem' }}>
            Limit Pemakaian
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Minimal Transaksi"
                value={limits.minimal}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^\d]/g, '');
                  onLimitChange('minimal', value);
                }}
                placeholder="10.000"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    fontSize: '0.875rem',
                    bgcolor: 'background.paper',
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '0.875rem',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Maksimal Transaksi"
                value={limits.maksimal}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^\d]/g, '');
                  onLimitChange('maksimal', value);
                }}
                placeholder="5.000.000"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    fontSize: '0.875rem',
                    bgcolor: 'background.paper',
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '0.875rem',
                  },
                }}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Save Button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 'auto', pt: 4 }}>
          <Button
            variant="contained"
            onClick={onSave}
            sx={{
              textTransform: 'none',
              bgcolor: '#155DFC',
              px: 3,
              '&:hover': {
                bgcolor: '#0f4fc7',
              },
            }}
          >
            Simpan
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
