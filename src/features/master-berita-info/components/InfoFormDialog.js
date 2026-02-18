'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Autocomplete,
  Chip,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { CloseSquare } from 'iconsax-react';
import UploadFile from '@/shared/ui/UploadFile';

export default function InfoFormDialog({
  open,
  onClose,
  onSave,
  data,
  perusahaanOptions = [],
}) {
  const [formData, setFormData] = useState({
    judul: '',
    jenisUserPenerima: 'ADMIN',
    perusahaanTujuan: [],
    linkTujuan: '',
    gambar: null,
    tanggalMulai: '',
    tanggalSelesai: '',
    waktuMulai: '',
    waktuSelesai: '',
    opsiLewati: false,
    rekomendasikanTiapHari: false,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (data) {
      setFormData({
        judul: data.judul || '',
        jenisUserPenerima: 'ADMIN',
        perusahaanTujuan: Array.isArray(data.perusahaanTujuan) ? data.perusahaanTujuan : (data.perusahaanTujuan ? [data.perusahaanTujuan] : []),
        linkTujuan: data.linkTujuan || '',
        gambar: data.gambar || null,
        tanggalMulai: data.tanggalMulai || '',
        tanggalSelesai: data.tanggalSelesai || '',
        waktuMulai: data.waktuMulai || '',
        waktuSelesai: data.waktuSelesai || '',
        opsiLewati: data.opsiLewati || false,
        rekomendasikanTiapHari: data.rekomendasikanTiapHari || false,
      });
    } else {
      setFormData({
        judul: '',
        jenisUserPenerima: 'ADMIN',
        perusahaanTujuan: [],
        linkTujuan: '',
        gambar: null,
        tanggalMulai: '',
        tanggalSelesai: '',
        waktuMulai: '',
        waktuSelesai: '',
        opsiLewati: false,
        rekomendasikanTiapHari: false,
      });
    }
    setErrors({});
  }, [data, open]);

  const handleClose = () => {
    setFormData({
      judul: '',
      jenisUserPenerima: 'ADMIN',
      perusahaanTujuan: [],
      linkTujuan: '',
      gambar: null,
      tanggalMulai: '',
      tanggalSelesai: '',
      waktuMulai: '',
      waktuSelesai: '',
      opsiLewati: false,
      rekomendasikanTiapHari: false,
    });
    setErrors({});
    onClose();
  };

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

  const validate = () => {
    const newErrors = {};
    if (!formData.judul.trim()) {
      newErrors.judul = 'Judul wajib diisi';
    }
    if (formData.judul.length > 100) {
      newErrors.judul = 'Judul maksimal 100 karakter';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      return;
    }

    if (onSave) {
      try {
        await onSave(formData);
        handleClose();
      } catch (err) {
        // Error already handled by toast
      }
    }
  };

  return (
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
          fontWeight: 500,
        }}
      >
        {data ? 'Edit Data' : 'Tambah Data'}
        <IconButton
          size="small"
          onClick={handleClose}
          sx={{
            color: 'text.secondary',
          }}
        >
          <CloseSquare size={20} />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ overflowY: 'auto' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
          {/* Judul */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                Judul<span style={{ color: 'red' }}>*</span>
              </Typography>
              <Typography variant="caption" sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                {formData.judul.length}/100
              </Typography>
            </Box>
            <TextField
              fullWidth
              size="small"
              value={formData.judul}
              onChange={(e) => handleChange('judul', e.target.value)}
              placeholder="Judul"
              error={!!errors.judul}
              helperText={errors.judul}
              inputProps={{ maxLength: 100 }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: '0.875rem',
                },
              }}
            />
          </Box>

          {/* Jenis User Penerima */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
              Jenis User Penerima
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={formData.jenisUserPenerima}
              disabled
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: '0.875rem',
                  backgroundColor: 'rgba(0, 0, 0, 0.06)',
                },
              }}
            />
          </Box>

          {/* Perusahaan Tujuan */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
              Perusahaan Tujuan
            </Typography>
            <Autocomplete
              multiple
              options={perusahaanOptions}
              value={formData.perusahaanTujuan}
              onChange={(event, newValue) => {
                handleChange('perusahaanTujuan', newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  placeholder="Pilih Perusahaan"
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
          </Box>

          {/* Link Tujuan */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
              Link Tujuan
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={formData.linkTujuan}
              onChange={(e) => handleChange('linkTujuan', e.target.value)}
              placeholder="Link Tujuan"
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: '0.875rem',
                },
              }}
            />
          </Box>

          {/* Gambar */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
              Gambar
            </Typography>
            <UploadFile
              label=""
              value={formData.gambar}
              onChange={(file) => handleChange('gambar', file)}
              onDelete={() => handleChange('gambar', null)}
              accept="image/*"
              maxSize={5 * 1024 * 1024}
            />
          </Box>

          {/* Tanggal Mulai */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
              Tanggal Mulai
            </Typography>
            <TextField
              fullWidth
              size="small"
              type="date"
              value={formData.tanggalMulai}
              onChange={(e) => handleChange('tanggalMulai', e.target.value)}
              placeholder="Pilih Tanggal"
              InputLabelProps={{
                shrink: true,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: '0.875rem',
                },
              }}
            />
          </Box>

          {/* Tanggal Selesai */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
              Tanggal Selesai
            </Typography>
            <TextField
              fullWidth
              size="small"
              type="date"
              value={formData.tanggalSelesai}
              onChange={(e) => handleChange('tanggalSelesai', e.target.value)}
              placeholder="Pilih Tanggal"
              InputLabelProps={{
                shrink: true,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: '0.875rem',
                },
              }}
            />
          </Box>

          {/* Waktu Mulai */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
              Waktu Mulai
            </Typography>
            <TextField
              fullWidth
              size="small"
              type="time"
              value={formData.waktuMulai}
              onChange={(e) => handleChange('waktuMulai', e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 300, // 5 min
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: '0.875rem',
                },
              }}
            />
          </Box>

          {/* Waktu Selesai */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
              Waktu Selesai
            </Typography>
            <TextField
              fullWidth
              size="small"
              type="time"
              value={formData.waktuSelesai}
              onChange={(e) => handleChange('waktuSelesai', e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 300, // 5 min
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: '0.875rem',
                },
              }}
            />
          </Box>

          {/* Opsi Lewati */}
          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.opsiLewati}
                  onChange={(e) => handleChange('opsiLewati', e.target.checked)}
                  sx={{
                    color: '#155DFC',
                    '&.Mui-checked': {
                      color: '#155DFC',
                    },
                  }}
                />
              }
              label={
                <Box>
                  <Typography variant="body2" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                    Opsi Lewati
                  </Typography>
                  <Typography variant="caption" sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                    (Penerima bisa melewati info ini dengan tombol tutup untuk menutup jendela info)
                  </Typography>
                </Box>
              }
            />
          </Box>

          {/* Rekomendasikan Tiap Hari */}
          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.rekomendasikanTiapHari}
                  onChange={(e) => handleChange('rekomendasikanTiapHari', e.target.checked)}
                  sx={{
                    color: '#155DFC',
                    '&.Mui-checked': {
                      color: '#155DFC',
                    },
                  }}
                />
              }
              label={
                <Box>
                  <Typography variant="body2" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                    Rekomendasikan Tiap Hari
                  </Typography>
                  <Typography variant="caption" sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                    (Penerima akan dikirimkan pop up info ini setiap hari selama info ini aktif)
                  </Typography>
                </Box>
              }
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          variant="outlined"
          onClick={handleClose}
          sx={{
            textTransform: 'none',
            color: 'error.main',
            borderColor: 'error.main',
            px: 3,
            '&:hover': {
              borderColor: 'error.main',
              bgcolor: 'error.lighter',
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
          {data ? 'Simpan' : 'Tambah'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
