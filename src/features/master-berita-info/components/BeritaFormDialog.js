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

export default function BeritaFormDialog({
  open,
  onClose,
  onSave,
  data,
  perusahaanOptions = [],
}) {
  const [formData, setFormData] = useState({
    judul: '',
    subJudul: '',
    isiBerita: '',
    jenisUserPenerima: 'ADMIN',
    perusahaanTujuan: [],
    gambar: null,
    publikasikan: false,
    jadikanBeritaUtama: false,
    tags: [],
  });

  const [errors, setErrors] = useState({});
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (data) {
      setFormData({
        judul: data.judul || '',
        subJudul: data.subJudul || '',
        isiBerita: data.isiBerita || '',
        jenisUserPenerima: 'ADMIN',
        perusahaanTujuan: data.perusahaanTujuan || [],
        gambar: data.gambar || null,
        publikasikan: data.publikasikan !== undefined ? data.publikasikan : (data.statusPublikasi === 'Dipublikasikan'),
        jadikanBeritaUtama: data.jadikanBeritaUtama !== undefined ? data.jadikanBeritaUtama : (data.statusBeritaUtama === 'Ya'),
        tags: data.tags || [],
      });
    } else {
      setFormData({
        judul: '',
        subJudul: '',
        isiBerita: '',
        jenisUserPenerima: 'ADMIN',
        perusahaanTujuan: [],
        gambar: null,
        publikasikan: false,
        jadikanBeritaUtama: false,
        tags: [],
      });
    }
    setErrors({});
    setTagInput('');
  }, [data, open]);

  const handleClose = () => {
    setFormData({
      judul: '',
      subJudul: '',
      isiBerita: '',
      jenisUserPenerima: 'ADMIN',
      perusahaanTujuan: [],
      gambar: null,
      publikasikan: false,
      jadikanBeritaUtama: false,
      tags: [],
    });
    setErrors({});
    setTagInput('');
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

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (!formData.tags.includes(newTag)) {
        handleChange('tags', [...formData.tags, newTag]);
      }
      setTagInput('');
    }
  };

  const handleDeleteTag = (tagToDelete) => {
    handleChange('tags', formData.tags.filter((tag) => tag !== tagToDelete));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.judul.trim()) {
      newErrors.judul = 'Judul wajib diisi';
    }
    if (formData.judul.length > 100) {
      newErrors.judul = 'Judul maksimal 100 karakter';
    }
    if (formData.subJudul.length > 100) {
      newErrors.subJudul = 'Sub Judul maksimal 100 karakter';
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

          {/* Sub Judul */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                Sub Judul
              </Typography>
              <Typography variant="caption" sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                {formData.subJudul.length}/100
              </Typography>
            </Box>
            <TextField
              fullWidth
              size="small"
              value={formData.subJudul}
              onChange={(e) => handleChange('subJudul', e.target.value)}
              placeholder="Sub Judul"
              error={!!errors.subJudul}
              helperText={errors.subJudul}
              inputProps={{ maxLength: 100 }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: '0.875rem',
                },
              }}
            />
          </Box>

          {/* Isi Berita */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
              Isi Berita
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={formData.isiBerita}
              onChange={(e) => handleChange('isiBerita', e.target.value)}
              placeholder="Isi Berita"
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

          {/* Publikasikan */}
          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.publikasikan}
                  onChange={(e) => handleChange('publikasikan', e.target.checked)}
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
                    Publikasikan
                  </Typography>
                  <Typography variant="caption" sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                    (Berita akan dipublikasikan ke admin company yang dituju)
                  </Typography>
                </Box>
              }
            />
          </Box>

          {/* Jadikan Berita Utama */}
          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.jadikanBeritaUtama}
                  onChange={(e) => handleChange('jadikanBeritaUtama', e.target.checked)}
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
                    Jadikan Berita Utama
                  </Typography>
                  <Typography variant="caption" sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                    (Berita akan dijadikan berita utama /headline pada menu info admin company yang dituju)
                  </Typography>
                </Box>
              }
            />
          </Box>

          {/* Tags */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
              Tags
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="Add a tag"
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: '0.875rem',
                },
              }}
            />
            <Typography variant="caption" sx={{ fontSize: '0.75rem', color: 'text.secondary', mt: 0.5, display: 'block' }}>
              Tekan enter untuk menambah tags
            </Typography>
            {formData.tags.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {formData.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => handleDeleteTag(tag)}
                    size="small"
                    sx={{
                      fontSize: '0.75rem',
                    }}
                  />
                ))}
              </Box>
            )}
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
