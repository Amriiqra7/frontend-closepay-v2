'use client';

import React from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Grid,
  Divider,
} from '@mui/material';
import { formatRupiah } from '@/shared/utils/format';
import PaymentFeesSection from './PaymentFeesSection';
import AdminFeesSection from './AdminFeesSection';

export default function ConfigurationForm({
  selectedBank,
  paymentMethodEnabled,
  credentials,
  limits,
  activeTab,
  accountType,
  onPaymentMethodChange,
  onCredentialChange,
  onLimitChange,
  onSave,
  // Payment Fees Props
  paymentFees,
  paymentFeesExpanded,
  onPaymentFeesToggle,
  onAddPaymentFee,
  onDeletePaymentFee,
  // Admin Fees Props
  adminFeesExpanded,
  inhouseFees,
  interbankFees,
  onAdminFeesToggle,
  onAddAdminFee,
  onDeleteAdminFee,
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
        Konfigurasi {selectedBank.name}
      </Typography>
      
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Aktifkan Metode Pembayaran */}
        <Box sx={{ mb: 3 }}>
          <FormControlLabel
            control={
              <Switch
                checked={paymentMethodEnabled}
                onChange={(e) => onPaymentMethodChange(e.target.checked)}
                color="primary"
              />
            }
            label={
              <Typography sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                Aktifkan Metode Pembayaran
              </Typography>
            }
          />
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 1, ml: 5, fontSize: '0.75rem', lineHeight: 1.5 }}
          >
            Mulai aktifkan untuk dapat melanjutkan proses pengaturan metode pembayaran transaksi yang akan diterapkan ke perusahaan agar dapat menerima pembayaran.
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Credential Fields */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2, fontSize: '0.875rem' }}>
            {selectedBank.name} Credential
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              size="small"
              label="Prefix"
              value={credentials.prefix}
              onChange={(e) => onCredentialChange('prefix', e.target.value)}
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
            <TextField
              fullWidth
              size="small"
              label="Client ID"
              value={credentials.clientId}
              onChange={(e) => onCredentialChange('clientId', e.target.value)}
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
            <TextField
              fullWidth
              size="small"
              label="Client Secret"
              type="password"
              value={credentials.clientSecret}
              onChange={(e) => onCredentialChange('clientSecret', e.target.value)}
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
            <TextField
              fullWidth
              size="small"
              label="Host"
              value={credentials.host}
              onChange={(e) => onCredentialChange('host', e.target.value)}
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
          </Box>
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

        <Divider sx={{ my: 3 }} />

        {/* Biaya Pembayaran - Hanya untuk VA, E-wallet, dan QRIS */}
        {(activeTab === 'va' || activeTab === 'e-wallet' || activeTab === 'qris') && (
          <PaymentFeesSection
            activeTab={activeTab}
            paymentFees={paymentFees}
            paymentFeesExpanded={paymentFeesExpanded}
            onToggle={onPaymentFeesToggle}
            onAdd={onAddPaymentFee}
            onDelete={onDeletePaymentFee}
          />
        )}

        {/* Biaya Admin dan Lainnya - Hanya untuk Disbursement Direct Bank */}
        {activeTab === 'disbursement' && accountType === 'direct-bank' && (
          <AdminFeesSection
            adminFeesExpanded={adminFeesExpanded}
            inhouseFees={inhouseFees}
            interbankFees={interbankFees}
            onToggle={onAdminFeesToggle}
            onAdd={onAddAdminFee}
            onDelete={onDeleteAdminFee}
          />
        )}
      </Box>
    </Paper>
  );
}
