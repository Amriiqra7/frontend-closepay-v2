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
  Divider,
} from '@mui/material';
import { CloseCircle, Add } from 'iconsax-react';
import { formatRupiah } from '@/shared/utils/format';
import TambahDataPembayaranTagihanDialog from './TambahDataPembayaranTagihanDialog';

// Mock data riwayat pembayaran
const mockRiwayatPembayaran = [
  {
    id: 1,
    tanggal: '2026-02-20 12:23:53',
    nominal: 100000,
    status: 'Terkonfirmasi',
    sisaTagihan: 4890000,
    logo: 'xendit',
  },
];

export default function RiwayatPembayaranTagihanDialog({ open, onClose, tagihan }) {
  const [tambahDialogOpen, setTambahDialogOpen] = useState(false);
  const [riwayatPembayaran, setRiwayatPembayaran] = useState(mockRiwayatPembayaran);

  const formatCurrency = (value) => {
    const formatted = formatRupiah(value);
    return formatted ? `Rp ${formatted},00` : 'Rp 0,00';
  };

  const handleClose = () => {
    onClose();
  };

  const handleTambahPembayaranSuccess = () => {
    // Refresh riwayat pembayaran after successful addition
    // TODO: Replace with actual API call to fetch updated data
    // For now, we'll add a mock entry
    const newPembayaran = {
      id: riwayatPembayaran.length + 1,
      tanggal: new Date().toISOString().slice(0, 19).replace('T', ' '),
      nominal: 100000,
      status: 'Terkonfirmasi',
      sisaTagihan: (tagihan?.sisaTagihan || 0) - 100000,
      logo: 'xendit',
    };
    setRiwayatPembayaran((prev) => [...prev, newPembayaran]);
  };

  return (
    <>
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
          Riwayat Pembayaran
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

        <DialogContent sx={{ p: 0 }}>
          {/* Button Tambah Data Pembayaran */}
          <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Button
              variant="contained"
              startIcon={<Add size={20} color="#ffffff" />}
              onClick={() => setTambahDialogOpen(true)}
              sx={{
                textTransform: 'none',
                bgcolor: '#1976d2',
                color: 'white',
                '&:hover': {
                  bgcolor: '#1565c0',
                },
              }}
            >
              Tambah Data Pembayaran
            </Button>
          </Box>

          {/* Content - Scrollable */}
          <Box sx={{ maxHeight: '60vh', overflowY: 'auto', p: 2 }}>
            {riwayatPembayaran.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Belum ada data pembayaran
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {riwayatPembayaran.map((pembayaran, index) => (
                  <Box key={pembayaran.id}>
                    {/* Logo Area */}
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
                        mb: 2,
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

                    {/* Payment Details */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box>
                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                          Tanggal
                        </Typography>
                        <TextField
                          fullWidth
                          size="small"
                          value={pembayaran.tanggal}
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

                      <Box>
                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                          Nominal
                        </Typography>
                        <TextField
                          fullWidth
                          size="small"
                          value={formatCurrency(pembayaran.nominal)}
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

                      <Box>
                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                          Status
                        </Typography>
                        <TextField
                          fullWidth
                          size="small"
                          value={pembayaran.status}
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

                      <Box>
                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                          Sisa Tagihan
                        </Typography>
                        <TextField
                          fullWidth
                          size="small"
                          value={formatCurrency(pembayaran.sisaTagihan)}
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

                    {/* Divider - except for last item */}
                    {index < riwayatPembayaran.length - 1 && (
                      <Divider sx={{ mt: 3, mb: 2 }} />
                    )}
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button
            variant="contained"
            onClick={handleClose}
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

      {/* Dialog Tambah Data Pembayaran */}
      <TambahDataPembayaranTagihanDialog
        open={tambahDialogOpen}
        onClose={() => setTambahDialogOpen(false)}
        tagihan={tagihan}
        onSuccess={handleTambahPembayaranSuccess}
      />
    </>
  );
}
