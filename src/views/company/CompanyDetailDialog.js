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
} from '@mui/material';
import { TickCircle, CloseCircle } from 'iconsax-react';

export default function CompanyDetailDialog({ open, onClose, company }) {
  if (!company) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle>
        <Typography component="span" variant="h6" fontWeight="bold">
          Detail Perusahaan
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" },
            gap: 3,
            pt: 2,
          }}
        >
          {/* Left Column: Informasi Umum + PIC */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Informasi Umum Section */}
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
                {/* Logo Perusahaan */}
                <Box sx={{ gridColumn: "1 / -1" }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Logo Perusahaan
                  </Typography>
                  {company.logo ? (
                    <Box
                      component="img"
                      src={typeof company.logo === 'string' ? company.logo : URL.createObjectURL(company.logo)}
                      alt="Logo"
                      sx={{ 
                        maxWidth: 150, 
                        maxHeight: 150, 
                        objectFit: 'contain',
                        mt: 1,
                      }}
                    />
                  ) : (
                    <Typography variant="body2" color="text.secondary" fontStyle="italic" sx={{ mt: 1 }}>
                      Tidak ada logo
                    </Typography>
                  )}
                </Box>

                {/* Nama */}
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Nama
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {company.nama || '-'}
                  </Typography>
                </Box>

                {/* Inisial Perusahaan */}
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Inisial Perusahaan
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {company.inisialPerusahaan || '-'}
                  </Typography>
                </Box>

                {/* Alamat Perusahaan */}
                <Box sx={{ gridColumn: "1 / -1" }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Alamat Perusahaan
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {company.address || '-'}
                  </Typography>
                </Box>

                {/* Jenis Keuangan Perusahaan */}
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Jenis Keuangan Perusahaan
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {company.financialType || '-'}
                  </Typography>
                </Box>

                {/* Rekening Penagihan */}
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Rekening Penagihan
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {company.billingAccount || '-'}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* PIC Section */}
            <Box>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                PIC
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
                  gap: 2,
                }}
              >
                {/* Nama PIC */}
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Nama PIC
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {company.namaPIC || '-'}
                  </Typography>
                </Box>

                {/* Email */}
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Email
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {company.emailPIC || '-'}
                  </Typography>
                </Box>

                {/* No Telepon */}
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    No Telepon
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {company.picPhone || '-'}
                  </Typography>
                </Box>

                {/* Username */}
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Username
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {company.picUsername || '-'}
                  </Typography>
                </Box>

                {/* Password */}
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Password
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {company.picPassword ? '••••••••' : '-'}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Right Column: Aplikasi */}
          <Box>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Aplikasi
            </Typography>
            
            {/* Homepage */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Homepage
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {company.homepage || '-'}
              </Typography>
            </Box>

            {/* Menu Perusahaan */}
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom mb={1}>
                Menu Perusahaan
              </Typography>
              <Box
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                  p: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                  }}
                >
                  {['Dashboard', 'Transaksi', 'Laporan', 'Pengaturan', 'Manajemen', 'Keuangan', 'Pengguna'].map((menuName) => (
                    <Box
                      key={menuName}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Typography variant="body2">
                        {menuName}
                      </Typography>
                      {company.companyMenus?.[menuName] ? (
                        <TickCircle size={20} color="currentColor" style={{ color: '#2e7d32' }} />
                      ) : (
                        <CloseCircle size={20} color="currentColor" style={{ color: '#d32f2f' }} />
                      )}
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          Tutup
        </Button>
      </DialogActions>
    </Dialog>
  );
}
