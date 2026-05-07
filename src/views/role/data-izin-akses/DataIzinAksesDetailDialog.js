"use client";

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Divider,
} from '@mui/material';
import { CloseCircle } from 'iconsax-react';

export default function DataIzinAksesDetailDialog({ open, onClose, dataIzinAkses }) {
  if (!dataIzinAkses) return null;

  const getStatusColor = (status) => {
    return status === 'aktif' ? '#4caf50' : '#f44336';
  };

  const getStatusBgColor = (status) => {
    return status === 'aktif' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)';
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle>
        <Typography component="span" variant="h6" fontWeight="bold">
          Detail Data Izin Akses
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            pt: 2,
          }}
        >
          {/* Informasi Umum */}
          <Box>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Informasi Umum
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
                gap: 2,
              }}
            >
              <Box>
                <Typography variant="body2" color="text.secondary" mb={0.5}>
                  Service
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {dataIzinAkses.service || '-'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary" mb={0.5}>
                  Tipe
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {dataIzinAkses.tipe || '-'}
                </Typography>
              </Box>
              <Box sx={{ gridColumn: { xs: "1 / -1", md: "1 / -1" } }}>
                <Typography variant="body2" color="text.secondary" mb={0.5}>
                  Nama
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {dataIzinAkses.nama || '-'}
                </Typography>
              </Box>
              <Box sx={{ gridColumn: { xs: "1 / -1", md: "1 / -1" } }}>
                <Typography variant="body2" color="text.secondary" mb={0.5}>
                  Kode
                </Typography>
                <Typography variant="body1" fontWeight={500} sx={{ fontFamily: 'monospace' }}>
                  {dataIzinAkses.kode || '-'}
                </Typography>
              </Box>
              <Box sx={{ gridColumn: { xs: "1 / -1", md: "1 / -1" } }}>
                <Typography variant="body2" color="text.secondary" mb={0.5}>
                  Deskripsi
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {dataIzinAkses.deskripsi || '-'}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Divider />

          {/* Status */}
          <Box>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Status
            </Typography>
            <Box>
              <Chip
                label={dataIzinAkses.status === 'aktif' ? 'Aktif' : 'Nonaktif'}
                size="medium"
                sx={{
                  bgcolor: getStatusBgColor(dataIzinAkses.status),
                  color: getStatusColor(dataIzinAkses.status),
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  height: 32,
                  '& .MuiChip-label': {
                    px: 2,
                  },
                }}
              />
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
        >
          Tutup
        </Button>
      </DialogActions>
    </Dialog>
  );
}
