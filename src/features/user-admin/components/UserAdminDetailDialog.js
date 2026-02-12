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

// Mock data untuk role accesses (sama seperti di RoleAccessTable)
const mockRoleAccesses = [
  {
    id: 1,
    tipe: 'Admin',
    nama: 'Admin Utama',
    deskripsi: 'Admin dengan akses penuh',
    status: 'Aktif',
    diizinkan: true,
    adminId: 1,
    adminSubCompanyId: null,
  },
  {
    id: 2,
    tipe: 'Admin Sub Company',
    nama: 'Admin Sub Company A',
    deskripsi: 'Admin untuk sub company A',
    status: 'Aktif',
    diizinkan: true,
    adminId: null,
    adminSubCompanyId: 1,
  },
  // Tambahkan lebih banyak mock data sesuai kebutuhan
];

export default function UserAdminDetailDialog({ open, onClose, user }) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Filter role accesses berdasarkan user yang dipilih
  const userRoleAccesses = useMemo(() => {
    if (!user || !user.roleAccesses) return [];
    return user.roleAccesses;
  }, [user]);

  // Pagination untuk role accesses
  const paginatedRoleAccesses = useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return userRoleAccesses.slice(start, end).map((role, index) => ({
      ...role,
      index: start + index + 1,
    }));
  }, [userRoleAccesses, pagination]);

  const handlePageChange = useCallback((newPageIndex) => {
    setPagination((prev) => ({ ...prev, pageIndex: newPageIndex }));
  }, []);

  const handlePageSizeChange = useCallback((newPageSize) => {
    setPagination((prev) => ({ ...prev, pageSize: newPageSize, pageIndex: 0 }));
  }, []);

  if (!user) return null;

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
        <DialogTitle>
          <Typography component="span" variant="h6" fontWeight="bold">
            Detail User Admin
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
              gap: 3,
              pt: 2,
            }}
          >
            {/* Left Column */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Username */}
              <Box>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  Username
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={user.username || '-'}
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{
                    '& .MuiInputBase-input': {
                      bgcolor: '#f9fafb',
                    },
                  }}
                />
              </Box>

              {/* Password - tidak ditampilkan */}
              <Box>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  Password
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value="••••••••"
                  InputProps={{
                    readOnly: true,
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
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  Nama
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={user.nama || '-'}
                  InputProps={{
                    readOnly: true,
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
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  Jenis Identitas
                </Typography>
                <Select
                  fullWidth
                  size="small"
                  value={user.jenisIdentitas || ''}
                  displayEmpty
                  disabled
                  sx={{
                    bgcolor: '#f9fafb',
                  }}
                >
                  {jenisIdentitasOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </Box>

              {/* No Identitas */}
              <Box>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  No Identitas
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={user.noIdentitas || '-'}
                  InputProps={{
                    readOnly: true,
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
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  No ID
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={user.noId || '-'}
                  InputProps={{
                    readOnly: true,
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
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  Jenis Kelamin
                </Typography>
                <Select
                  fullWidth
                  size="small"
                  value={user.jenisKelamin || ''}
                  displayEmpty
                  disabled
                  sx={{
                    bgcolor: '#f9fafb',
                  }}
                >
                  {jenisKelaminOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </Box>

              {/* Email */}
              <Box>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  Email
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={user.email || '-'}
                  InputProps={{
                    readOnly: true,
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
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  No Telepon
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={user.noTelepon || '-'}
                  InputProps={{
                    readOnly: true,
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
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  Tanggal Lahir
                </Typography>
                <DatePicker
                  format="DD/MM/YYYY"
                  value={user.tanggalLahir ? dayjs(user.tanggalLahir) : null}
                  disabled
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: 'small',
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
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  Tempat Lahir
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={user.tempatLahir || '-'}
                  InputProps={{
                    readOnly: true,
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
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  Alamat
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  multiline
                  rows={4}
                  value={user.alamat || '-'}
                  InputProps={{
                    readOnly: true,
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
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Peran Hak Akses
            </Typography>
            {userRoleAccesses.length > 0 ? (
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
                {userRoleAccesses.length > pagination.pageSize && (
                  <Box sx={{ mt: 2 }}>
                    {/* Simple pagination - bisa ditambahkan TablePagination jika diperlukan */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        Menampilkan {pagination.pageIndex * pagination.pageSize + 1} -{' '}
                        {Math.min((pagination.pageIndex + 1) * pagination.pageSize, userRoleAccesses.length)} dari{' '}
                        {userRoleAccesses.length}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          size="small"
                          variant="outlined"
                          disabled={pagination.pageIndex === 0}
                          onClick={() => handlePageChange(pagination.pageIndex - 1)}
                        >
                          Sebelumnya
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          disabled={
                            (pagination.pageIndex + 1) * pagination.pageSize >= userRoleAccesses.length
                          }
                          onClick={() => handlePageChange(pagination.pageIndex + 1)}
                        >
                          Selanjutnya
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                )}
              </>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Belum ada peran hak akses yang dipilih
              </Typography>
            )}
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
    </LocalizationProvider>
  );
}
