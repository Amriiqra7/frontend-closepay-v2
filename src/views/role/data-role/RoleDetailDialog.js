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
import { TickCircle, CloseCircle } from 'iconsax-react';

export default function RoleDetailDialog({ open, onClose, role }) {
  if (!role) return null;

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
          Detail Peran Hak Akses
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
                  Nama Peran
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {role.nama || '-'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary" mb={0.5}>
                  Jenis User
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {role.jenisUser || '-'}
                </Typography>
              </Box>
              <Box sx={{ gridColumn: { xs: "1 / -1", md: "1 / -1" } }}>
                <Typography variant="body2" color="text.secondary" mb={0.5}>
                  Deskripsi
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {role.deskripsi || '-'}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Divider />

          {/* Informasi Pengguna */}
          <Box>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Informasi Pengguna
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
                  Jumlah Pengguna
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {role.jumlahPengguna || 0} pengguna
                </Typography>
              </Box>
            </Box>
          </Box>

          <Divider />

          {/* Izin Keamanan */}
          <Box>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Izin Keamanan
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {role.izinKeamanan && role.izinKeamanan.length > 0 ? (
                role.izinKeamanan.map((izin, index) => (
                  <Chip
                    key={index}
                    label={izin.nama || izin}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Belum ada izin keamanan yang dipilih
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          startIcon={<CloseCircle size={20} />}
        >
          Tutup
        </Button>
      </DialogActions>
    </Dialog>
  );
}
