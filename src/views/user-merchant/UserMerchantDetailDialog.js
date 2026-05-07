'use client';

import React, { useMemo, useState, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  Select,
  MenuItem,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Divider,
} from '@mui/material';
import { CloseCircle } from 'iconsax-react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

// Mock data untuk dropdown options
const jenisIdentitasOptions = [
  { value: 'ktp', label: 'KTP' },
  { value: 'sim', label: 'SIM' },
  { value: 'passport', label: 'Passport' },
];

const jenisKelaminOptions = [
  { value: 'laki-laki', label: 'Laki-laki' },
  { value: 'perempuan', label: 'Perempuan' },
];

export default function UserMerchantDetailDialog({ open, onClose, merchant }) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Filter role accesses berdasarkan merchant yang dipilih
  const merchantRoleAccesses = useMemo(() => {
    if (!merchant || !merchant.roleAccesses) return [];
    return merchant.roleAccesses;
  }, [merchant]);

  // Pagination untuk role accesses
  const paginatedRoleAccesses = useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return merchantRoleAccesses.slice(start, end).map((role, index) => ({
      ...role,
      index: start + index + 1,
    }));
  }, [merchantRoleAccesses, pagination]);

  const handlePageChange = useCallback((newPageIndex) => {
    setPagination((prev) => ({ ...prev, pageIndex: newPageIndex }));
  }, []);

  const handlePageSizeChange = useCallback((newPageSize) => {
    setPagination((prev) => ({ ...prev, pageSize: newPageSize, pageIndex: 0 }));
  }, []);

  if (!merchant) return null;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
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
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pb: 2,
            borderBottom: '1px solid #e5e7eb',
            fontWeight: 600,
            fontSize: '1.25rem',
            color: '#111827',
          }}
        >
          Detail Merchant
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
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
              gap: 3,
            }}
          >
            {/* Left Column */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Username */}
              <Box>
                <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem' }}>
                  Username
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={merchant.username || '-'}
                  InputProps={{
                    readOnly: true,
                    sx: { fontSize: '0.875rem' },
                  }}
                  sx={{
                    '& .MuiInputBase-input': {
                      bgcolor: '#f9fafb',
                    },
                  }}
                />
              </Box>

              {/* Nama */}
              <Box>
                <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem' }}>
                  Nama
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={merchant.nama || '-'}
                  InputProps={{
                    readOnly: true,
                    sx: { fontSize: '0.875rem' },
                  }}
                  sx={{
                    '& .MuiInputBase-input': {
                      bgcolor: '#f9fafb',
                    },
                  }}
                />
              </Box>

              {/* Jenis Identitas */}
              <Box>
                <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem' }}>
                  Jenis Identitas
                </Typography>
                <Select
                  fullWidth
                  size="small"
                  value={merchant.jenisIdentitas || ''}
                  disabled
                  renderValue={(selected) => {
                    if (!selected) return '-';
                    return jenisIdentitasOptions.find((opt) => opt.value === selected)?.label || selected;
                  }}
                  sx={{
                    fontSize: '0.875rem',
                    bgcolor: '#f9fafb',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(0, 0, 0, 0.23)',
                    },
                  }}
                >
                  {jenisIdentitasOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value} sx={{ fontSize: '0.875rem' }}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </Box>

              {/* No Identitas */}
              <Box>
                <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem' }}>
                  No Identitas
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={merchant.noIdentitas || '-'}
                  InputProps={{
                    readOnly: true,
                    sx: { fontSize: '0.875rem' },
                  }}
                  sx={{
                    '& .MuiInputBase-input': {
                      bgcolor: '#f9fafb',
                    },
                  }}
                />
              </Box>

              {/* No ID */}
              <Box>
                <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem' }}>
                  No ID
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={merchant.noId || '-'}
                  InputProps={{
                    readOnly: true,
                    sx: { fontSize: '0.875rem' },
                  }}
                  sx={{
                    '& .MuiInputBase-input': {
                      bgcolor: '#f9fafb',
                    },
                  }}
                />
              </Box>
            </Box>

            {/* Right Column */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Jenis Kelamin */}
              <Box>
                <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem' }}>
                  Jenis Kelamin
                </Typography>
                <Select
                  fullWidth
                  size="small"
                  value={merchant.jenisKelamin || ''}
                  disabled
                  renderValue={(selected) => {
                    if (!selected) return '-';
                    return jenisKelaminOptions.find((opt) => opt.value === selected)?.label || selected;
                  }}
                  sx={{
                    fontSize: '0.875rem',
                    bgcolor: '#f9fafb',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(0, 0, 0, 0.23)',
                    },
                  }}
                >
                  {jenisKelaminOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value} sx={{ fontSize: '0.875rem' }}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </Box>

              {/* Email */}
              <Box>
                <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem' }}>
                  Email
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={merchant.email || '-'}
                  InputProps={{
                    readOnly: true,
                    sx: { fontSize: '0.875rem' },
                  }}
                  sx={{
                    '& .MuiInputBase-input': {
                      bgcolor: '#f9fafb',
                    },
                  }}
                />
              </Box>

              {/* No Telepon */}
              <Box>
                <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem' }}>
                  No Telepon
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={merchant.noTelp || merchant.noTelepon || '-'}
                  InputProps={{
                    readOnly: true,
                    sx: { fontSize: '0.875rem' },
                  }}
                  sx={{
                    '& .MuiInputBase-input': {
                      bgcolor: '#f9fafb',
                    },
                  }}
                />
              </Box>

              {/* Tanggal Lahir */}
              <Box>
                <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem' }}>
                  Tanggal Lahir
                </Typography>
                <DatePicker
                  value={merchant.tanggalLahir ? dayjs(merchant.tanggalLahir) : null}
                  disabled
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                      InputProps: {
                        readOnly: true,
                        sx: { fontSize: '0.875rem' },
                      },
                      sx: {
                        '& .MuiInputBase-input': {
                          bgcolor: '#f9fafb',
                        },
                      },
                    },
                  }}
                />
              </Box>

              {/* Tempat Lahir */}
              <Box>
                <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem' }}>
                  Tempat Lahir
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={merchant.tempatLahir || '-'}
                  InputProps={{
                    readOnly: true,
                    sx: { fontSize: '0.875rem' },
                  }}
                  sx={{
                    '& .MuiInputBase-input': {
                      bgcolor: '#f9fafb',
                    },
                  }}
                />
              </Box>

              {/* Alamat */}
              <Box>
                <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem' }}>
                  Alamat
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  multiline
                  rows={4}
                  value={merchant.alamat || '-'}
                  InputProps={{
                    readOnly: true,
                    sx: { fontSize: '0.875rem' },
                  }}
                  sx={{
                    '& .MuiInputBase-input': {
                      bgcolor: '#f9fafb',
                    },
                  }}
                />
              </Box>
            </Box>
          </Box>

          {/* Peran Hak Akses Table */}
          <Divider sx={{ my: 3 }} />
          <Box>
            <Typography variant="h6" fontWeight="bold" mb={2} sx={{ fontSize: '1rem' }}>
              Peran Hak Akses
            </Typography>
            {merchantRoleAccesses.length > 0 ? (
              <>
                <TableContainer
                  component={Paper}
                  elevation={0}
                  sx={{
                    maxHeight: '400px',
                    borderRadius: 0,
                    border: 'none',
                  }}
                >
                  <Table stickyHeader sx={{ minWidth: 650 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          align="center"
                          sx={{
                            fontWeight: 600,
                            fontSize: '0.875rem',
                            color: '#374151',
                            backgroundColor: '#f9fafb',
                            position: 'sticky',
                            top: 0,
                            zIndex: 1,
                            width: 60,
                          }}
                        >
                          NO
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: 600,
                            fontSize: '0.875rem',
                            color: '#374151',
                            backgroundColor: '#f9fafb',
                            position: 'sticky',
                            top: 0,
                            zIndex: 1,
                            width: 120,
                          }}
                        >
                          TIPE
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: 600,
                            fontSize: '0.875rem',
                            color: '#374151',
                            backgroundColor: '#f9fafb',
                            position: 'sticky',
                            top: 0,
                            zIndex: 1,
                            width: 250,
                          }}
                        >
                          NAMA
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: 600,
                            fontSize: '0.875rem',
                            color: '#374151',
                            backgroundColor: '#f9fafb',
                            position: 'sticky',
                            top: 0,
                            zIndex: 1,
                            width: 300,
                          }}
                        >
                          DESKRIPSI
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            fontWeight: 600,
                            fontSize: '0.875rem',
                            color: '#374151',
                            backgroundColor: '#f9fafb',
                            position: 'sticky',
                            top: 0,
                            zIndex: 1,
                            width: 100,
                          }}
                        >
                          STATUS
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            fontWeight: 600,
                            fontSize: '0.875rem',
                            color: '#374151',
                            backgroundColor: '#f9fafb',
                            position: 'sticky',
                            top: 0,
                            zIndex: 1,
                            width: 100,
                          }}
                        >
                          DIIZINKAN
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedRoleAccesses.map((row) => (
                        <TableRow
                          key={row.id}
                          sx={{
                            '&:nth-of-type(even)': {
                              backgroundColor: '#f9fafb',
                            },
                          }}
                        >
                          <TableCell align="center" sx={{ fontSize: '0.875rem' }}>
                            <Typography variant="body2">{row.index}</Typography>
                          </TableCell>
                          <TableCell sx={{ fontSize: '0.875rem' }}>
                            <Typography variant="body2">{row.tipe}</Typography>
                          </TableCell>
                          <TableCell sx={{ fontSize: '0.875rem' }}>
                            <Typography variant="body2">{row.nama}</Typography>
                          </TableCell>
                          <TableCell sx={{ fontSize: '0.875rem' }}>
                            <Typography variant="body2" sx={{ color: '#6b7280' }}>
                              {row.deskripsi}
                            </Typography>
                          </TableCell>
                          <TableCell align="center" sx={{ fontSize: '0.875rem' }}>
                            <Chip
                              label={row.status}
                              size="small"
                              sx={{
                                bgcolor: row.status === 'Aktif' ? '#ecfdf5' : '#fef2f2',
                                color: row.status === 'Aktif' ? '#059669' : '#dc2626',
                                fontWeight: 500,
                                fontSize: '0.75rem',
                              }}
                            />
                          </TableCell>
                          <TableCell align="center" sx={{ fontSize: '0.875rem' }}>
                            <Chip
                              label={row.diizinkan ? 'Ya' : 'Tidak'}
                              size="small"
                              sx={{
                                bgcolor: row.diizinkan ? '#ecfdf5' : '#fef2f2',
                                color: row.diizinkan ? '#059669' : '#dc2626',
                                fontWeight: 500,
                                fontSize: '0.75rem',
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                {merchantRoleAccesses.length > pagination.pageSize && (
                  <Box sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                        Menampilkan {pagination.pageIndex * pagination.pageSize + 1} -{' '}
                        {Math.min((pagination.pageIndex + 1) * pagination.pageSize, merchantRoleAccesses.length)} dari{' '}
                        {merchantRoleAccesses.length}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          size="small"
                          variant="outlined"
                          disabled={pagination.pageIndex === 0}
                          onClick={() => handlePageChange(pagination.pageIndex - 1)}
                          sx={{ textTransform: 'none' }}
                        >
                          Sebelumnya
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          disabled={
                            (pagination.pageIndex + 1) * pagination.pageSize >= merchantRoleAccesses.length
                          }
                          onClick={() => handlePageChange(pagination.pageIndex + 1)}
                          sx={{ textTransform: 'none' }}
                        >
                          Selanjutnya
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                )}
              </>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                Belum ada peran hak akses yang dipilih
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 2, borderTop: '1px solid #e5e7eb' }}>
          <Button
            variant="contained"
            onClick={onClose}
            sx={{
              textTransform: 'none',
            }}
          >
            Tutup
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}
