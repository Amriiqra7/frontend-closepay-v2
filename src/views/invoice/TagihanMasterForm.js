'use client';

import React, { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Autocomplete,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { Edit, Trash, Add, ArrowLeft } from 'iconsax-react';
import { useRouter } from 'next/navigation';
import MainCard from '@/shared/ui/MainCard';
import TagihanDetailDialog from './TagihanDetailDialog';
import { formatRupiah } from '@/shared/utils/format';
import { handleCreateWithToast } from '@/shared/utils/toast';

const jenisUserInvoiceOptions = ['MEMBER', 'MERCHANT'];
const tipeInvoiceOptions = ['Umum', 'Khusus', 'Bulanan'];

export default function TagihanMasterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    namaMasterInvoice: '',
    jenisUserInvoice: '',
    tipeInvoice: '',
    tanggalInvoice: null,
    tanggalJatuhTempo: null,
    tags: [],
    detailInvoice: [],
  });

  const [errors, setErrors] = useState({});
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [editingDetail, setEditingDetail] = useState(null);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };


  const handleOpenDetailDialog = (detail = null) => {
    setEditingDetail(detail);
    setDetailDialogOpen(true);
  };

  const handleCloseDetailDialog = () => {
    setDetailDialogOpen(false);
    setEditingDetail(null);
  };

  const handleSaveDetail = (detailData) => {
    if (editingDetail) {
      // Edit existing detail
      const updatedDetails = formData.detailInvoice.map((detail) =>
        detail.id === editingDetail.id ? { ...detailData, id: editingDetail.id } : detail
      );
      handleChange('detailInvoice', updatedDetails);
    } else {
      // Add new detail
      const newDetail = {
        ...detailData,
        id: Date.now(), // Temporary ID
      };
      handleChange('detailInvoice', [...formData.detailInvoice, newDetail]);
    }
    handleCloseDetailDialog();
  };

  const handleDeleteDetail = (detailId) => {
    handleChange(
      'detailInvoice',
      formData.detailInvoice.filter((detail) => detail.id !== detailId)
    );
  };

  const totalInvoice = useMemo(() => {
    return formData.detailInvoice.reduce((sum, detail) => sum + (detail.totalItem || 0), 0);
  }, [formData.detailInvoice]);

  const validate = () => {
    const newErrors = {};
    if (!formData.namaMasterInvoice.trim()) {
      newErrors.namaMasterInvoice = 'Nama Master Invoice wajib diisi';
    }
    if (!formData.jenisUserInvoice) {
      newErrors.jenisUserInvoice = 'Jenis User Invoice wajib diisi';
    }
    if (!formData.tipeInvoice) {
      newErrors.tipeInvoice = 'Tipe Invoice wajib diisi';
    }
    if (formData.detailInvoice.length === 0) {
      newErrors.detailInvoice = 'Detail Invoice wajib diisi minimal 1 item';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      return;
    }

    try {
      const savePromise = new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('Saving master invoice:', formData);
          if (Math.random() > 0.1) {
            resolve({ success: true, data: formData });
          } else {
            reject(new Error('Gagal menyimpan data'));
          }
        }, 1000);
      });

      await handleCreateWithToast(savePromise, 'master invoice');
      router.push('/admin/invoice/tagihan-master');
    } catch (err) {
      // Error already handled by toast
    }
  };

  const handleCancel = () => {
    router.push('/admin/invoice/tagihan-master');
  };

  return (
    <>
      <MainCard content={false} sx={{ display: 'flex', flexDirection: 'column', height: '100%', maxHeight: '100%' }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
          {/* Form Content */}
          <Box sx={{ p: 3, flex: 1, overflowY: 'auto', minHeight: 0 }}>
            {/* General Invoice Details */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2.5, mb: 3 }}>
              {/* Left Column */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {/* Nama Master Invoice */}
                <Box>
                  <Typography variant="body2" sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
                    Nama Master Invoice<span style={{ color: 'red' }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    value={formData.namaMasterInvoice}
                    onChange={(e) => handleChange('namaMasterInvoice', e.target.value)}
                    placeholder="Nama Master Invoice"
                    error={!!errors.namaMasterInvoice}
                    helperText={errors.namaMasterInvoice}
                    inputProps={{
                      style: { fontSize: '0.875rem' },
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        fontSize: '0.875rem',
                      },
                    }}
                  />
                </Box>

                {/* Jenis User Invoice */}
                <Box>
                  <Typography variant="body2" sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
                    Jenis User Invoice<span style={{ color: 'red' }}>*</span>
                  </Typography>
                  <FormControl fullWidth size="small" error={!!errors.jenisUserInvoice}>
                    <Select
                      value={formData.jenisUserInvoice}
                      onChange={(e) => handleChange('jenisUserInvoice', e.target.value)}
                      displayEmpty
                      sx={{
                        fontSize: '0.875rem',
                      }}
                    >
                      <MenuItem value="" disabled sx={{ fontSize: '0.875rem' }}>
                        Silahkan Pilih
                      </MenuItem>
                      {jenisUserInvoiceOptions.map((option) => (
                        <MenuItem key={option} value={option} sx={{ fontSize: '0.875rem' }}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.jenisUserInvoice && (
                      <Typography variant="caption" sx={{ color: 'error.main', mt: 0.5, display: 'block' }}>
                        {errors.jenisUserInvoice}
                      </Typography>
                    )}
                  </FormControl>
                </Box>

                {/* Tipe Invoice */}
                <Box>
                  <Typography variant="body2" sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
                    Tipe Invoice<span style={{ color: 'red' }}>*</span>
                  </Typography>
                  <FormControl fullWidth size="small" error={!!errors.tipeInvoice}>
                    <Select
                      value={formData.tipeInvoice}
                      onChange={(e) => handleChange('tipeInvoice', e.target.value)}
                      displayEmpty
                      sx={{
                        fontSize: '0.875rem',
                      }}
                    >
                      <MenuItem value="" disabled sx={{ fontSize: '0.875rem' }}>
                        Silahkan Pilih
                      </MenuItem>
                      {tipeInvoiceOptions.map((option) => (
                        <MenuItem key={option} value={option} sx={{ fontSize: '0.875rem' }}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.tipeInvoice && (
                      <Typography variant="caption" sx={{ color: 'error.main', mt: 0.5, display: 'block' }}>
                        {errors.tipeInvoice}
                      </Typography>
                    )}
                  </FormControl>
                </Box>
              </Box>

              {/* Right Column */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {/* Tanggal Invoice */}
                <Box>
                  <Typography variant="body2" sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
                    Tanggal Invoice
                  </Typography>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      value={formData.tanggalInvoice ? dayjs(formData.tanggalInvoice) : null}
                      onChange={(newValue) => {
                        handleChange('tanggalInvoice', newValue ? newValue.toDate() : null);
                      }}
                      slotProps={{
                        textField: {
                          size: 'small',
                          fullWidth: true,
                          placeholder: 'Pilih Tanggal',
                          sx: {
                            '& .MuiOutlinedInput-root': {
                              fontSize: '0.875rem',
                            },
                          },
                        },
                      }}
                    />
                  </LocalizationProvider>
                </Box>

                {/* Tanggal Jatuh Tempo */}
                <Box>
                  <Typography variant="body2" sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
                    Tanggal Jatuh Tempo
                  </Typography>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      value={formData.tanggalJatuhTempo ? dayjs(formData.tanggalJatuhTempo) : null}
                      onChange={(newValue) => {
                        handleChange('tanggalJatuhTempo', newValue ? newValue.toDate() : null);
                      }}
                      slotProps={{
                        textField: {
                          size: 'small',
                          fullWidth: true,
                          placeholder: 'Pilih Tanggal',
                          sx: {
                            '& .MuiOutlinedInput-root': {
                              fontSize: '0.875rem',
                            },
                          },
                        },
                      }}
                    />
                  </LocalizationProvider>
                </Box>

                {/* Tags */}
                <Box>
                  <Typography variant="body2" sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
                    Tags
                  </Typography>
                  <Autocomplete
                    multiple
                    freeSolo
                    options={[]}
                    value={formData.tags}
                    onChange={(event, newValue) => {
                      handleChange('tags', newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        placeholder="Add a tag"
                        inputProps={{
                          ...params.inputProps,
                          style: { fontSize: '0.875rem' },
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            fontSize: '0.875rem',
                          },
                        }}
                      />
                    )}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          {...getTagProps({ index })}
                          key={option}
                          label={option}
                          size="small"
                          sx={{
                            fontSize: '0.75rem',
                          }}
                        />
                      ))
                    }
                  />
                  <Typography variant="caption" sx={{ fontSize: '0.75rem', color: 'text.secondary', mt: 0.5, display: 'block' }}>
                    Tekan enter untuk menambah tags
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Detail Invoice Section */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                  Detail Invoice
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add size={20} color="white" />}
                  onClick={() => handleOpenDetailDialog()}
                  sx={{
                    textTransform: 'none',
                    bgcolor: '#155DFC',
                    '&:hover': {
                      bgcolor: '#0f4fc7',
                    },
                  }}
                >
                  Tambah Data
                </Button>
              </Box>
              {errors.detailInvoice && (
                <Typography variant="caption" sx={{ color: 'error.main', mb: 1, display: 'block' }}>
                  {errors.detailInvoice}
                </Typography>
              )}
              <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid rgba(232, 235, 238, 1)' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontSize: '0.875rem', fontWeight: 500, backgroundColor: 'rgba(248, 249, 250, 1)' }}>
                        Nama Detail
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.875rem', fontWeight: 500, backgroundColor: 'rgba(248, 249, 250, 1)' }}>
                        Nominal
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.875rem', fontWeight: 500, backgroundColor: 'rgba(248, 249, 250, 1)' }}>
                        Diskon
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.875rem', fontWeight: 500, backgroundColor: 'rgba(248, 249, 250, 1)' }}>
                        Total
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.875rem', fontWeight: 500, backgroundColor: 'rgba(248, 249, 250, 1)' }}>
                        Aksi
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formData.detailInvoice.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                          Belum ada data detail invoice
                        </TableCell>
                      </TableRow>
                    ) : (
                      formData.detailInvoice.map((detail) => (
                        <TableRow key={detail.id}>
                          <TableCell sx={{ fontSize: '0.875rem' }}>{detail.namaDetail}</TableCell>
                          <TableCell sx={{ fontSize: '0.875rem' }}>
                            Rp {formatRupiah(detail.nominal)}
                          </TableCell>
                          <TableCell sx={{ fontSize: '0.875rem' }}>
                            Rp {formatRupiah(detail.diskon || 0)}
                          </TableCell>
                          <TableCell sx={{ fontSize: '0.875rem' }}>
                            Rp {formatRupiah(detail.totalItem)}
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                              <Tooltip title="Edit" arrow>
                                <IconButton
                                  size="small"
                                  onClick={() => handleOpenDetailDialog(detail)}
                                  sx={{
                                    color: '#ed6c02',
                                    '&:hover': {
                                      bgcolor: 'rgba(237, 108, 2, 0.08)',
                                    },
                                  }}
                                >
                                  <Edit size={20} variant="Linear" color="#ed6c02" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Hapus" arrow>
                                <IconButton
                                  size="small"
                                  onClick={() => handleDeleteDetail(detail.id)}
                                  sx={{
                                    color: '#d32f2f',
                                    '&:hover': {
                                      bgcolor: 'rgba(211, 47, 47, 0.08)',
                                    },
                                  }}
                                >
                                  <Trash size={20} variant="Linear" color="#d32f2f" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 2, alignItems: 'center' }}>
                <Typography variant="body2" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                  Total Invoice
                </Typography>
                <TextField
                  value={`Rp ${formatRupiah(totalInvoice)}`}
                  disabled
                  size="small"
                  inputProps={{
                    style: { fontSize: '0.875rem' },
                  }}
                  sx={{
                    width: 200,
                    '& .MuiOutlinedInput-root': {
                      fontSize: '0.875rem',
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                />
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', pt: 2, borderTop: '1px solid rgba(232, 235, 238, 1)' }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  sx={{
                    textTransform: 'none',
                    color: 'error.main',
                    borderColor: 'error.main',
                    px: 3,
                    '&:hover': {
                      borderColor: 'error.main',
                      bgcolor: 'rgba(211, 47, 47, 0.04)',
                    },
                  }}
                >
                  Batal
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSave}
                  sx={{
                    textTransform: 'none',
                    bgcolor: '#155DFC',
                    px: 3,
                    '&:hover': {
                      bgcolor: '#0f4fc7',
                    },
                  }}
                >
                  Tambah
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </MainCard>

      {/* Detail Dialog */}
      <TagihanDetailDialog
        open={detailDialogOpen}
        onClose={handleCloseDetailDialog}
        onSave={handleSaveDetail}
        data={editingDetail}
      />
    </>
  );
}
