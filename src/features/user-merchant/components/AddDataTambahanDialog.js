'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  Switch,
  Typography,
  Box,
  Link,
  IconButton,
} from '@mui/material';
import { CloseCircle } from 'iconsax-react';
import FormatKolomDialog from './FormatKolomDialog';

const formatOptions = [
  { value: 'Text', label: 'Text' },
  { value: 'Datetime', label: 'Datetime' },
  { value: 'Date', label: 'Date' },
  { value: 'Time', label: 'Time' },
  { value: 'Email', label: 'Email' },
  { value: 'Phone', label: 'Phone' },
  { value: 'Integer', label: 'Integer' },
  { value: 'Numeric', label: 'Numeric' },
  { value: 'Enum', label: 'Enum' },
  { value: 'Flags', label: 'Flags' },
];

export default function AddDataTambahanDialog({
  open,
  onClose,
  onSave,
  initialData = null,
  isEdit = false,
}) {
  const [namaKolom, setNamaKolom] = useState('');
  const [formatKolom, setFormatKolom] = useState('');
  const [tampilkanKolom, setTampilkanKolom] = useState(true);
  const [wajibkanPengisian, setWajibkanPengisian] = useState(true);
  const [editableKolom, setEditableKolom] = useState(true);
  const [formatDialogOpen, setFormatDialogOpen] = useState(false);

  useEffect(() => {
    if (initialData) {
      setNamaKolom(initialData.namaKolom || '');
      setFormatKolom(initialData.formatKolom || '');
      setTampilkanKolom(initialData.statusKolom !== undefined ? initialData.statusKolom : true);
      setWajibkanPengisian(initialData.wajibDiisi !== undefined ? initialData.wajibDiisi : true);
      setEditableKolom(initialData.dapatDiedit !== undefined ? initialData.dapatDiedit : true);
    } else {
      setNamaKolom('');
      setFormatKolom('');
      setTampilkanKolom(true);
      setWajibkanPengisian(true);
      setEditableKolom(true);
    }
  }, [initialData, open]);

  const handleSave = () => {
    if (!namaKolom.trim() || !formatKolom) {
      return;
    }
    onSave({
      namaKolom: namaKolom.trim(),
      formatKolom,
      statusKolom: tampilkanKolom,
      wajibDiisi: wajibkanPengisian,
      dapatDiedit: editableKolom,
    });
  };

  const handleClose = () => {
    setNamaKolom('');
    setFormatKolom('');
    setTampilkanKolom(true);
    setWajibkanPengisian(true);
    setEditableKolom(true);
    onClose();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
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
            alignItems: 'center',
            justifyContent: 'space-between',
            pb: 2,
            borderBottom: '1px solid #e5e7eb',
            fontWeight: 600,
            fontSize: '1.25rem',
            color: '#111827',
          }}
        >
          {isEdit ? 'Edit Data Tambahan' : 'Tambah Data Tambahan'}
          <IconButton
            onClick={handleClose}
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
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Nama Kolom */}
            <Box>
              <InputLabel sx={{ mt: 1, mb: 0.5, fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
                Nama Kolom
              </InputLabel>
              <TextField
                fullWidth
                value={namaKolom}
                onChange={(e) => setNamaKolom(e.target.value)}
                placeholder="Masukkan nama kolom"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    fontSize: '0.875rem',
                  },
                }}
              />
            </Box>

            {/* Description */}
            <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.875rem' }}>
              Format kolom akan menentukan jenis masukan yang bisa diterima oleh kolom. Terdapat 10
              pilihan format yang bisa Anda gunakan sesuai kebutuhan Anda.{' '}
              <Link
                component="button"
                type="button"
                onClick={() => setFormatDialogOpen(true)}
                sx={{
                  textDecoration: 'none',
                  color: '#1976d2',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Pelajari Lebih Lanjut?
              </Link>
            </Typography>

            {/* Format Kolom */}
            <FormControl fullWidth size="small">
              <InputLabel sx={{ fontSize: '0.875rem' }}>Format Kolom</InputLabel>
              <Select
                value={formatKolom}
                onChange={(e) => setFormatKolom(e.target.value)}
                label="Format Kolom"
                sx={{
                  fontSize: '0.875rem',
                }}
              >
                <MenuItem value="" disabled>
                  Pilih
                </MenuItem>
                {formatOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* TAMPILKAN KOLOM */}
            <Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={tampilkanKolom}
                    onChange={(e) => setTampilkanKolom(e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827' }}>
                    TAMPILKAN KOLOM
                  </Typography>
                }
              />
              <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.75rem', mt: 0.5, ml: 5 }}>
                Kolom akan ditampilkan pada formulir saat akan melakukan penambahan user merchant.
                Anda juga dapat menonaktifkan tampilan kolom ini pada lain waktu.
              </Typography>
            </Box>

            {/* WAJIBKAN PENGISIAN KOLOM */}
            <Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={wajibkanPengisian}
                    onChange={(e) => setWajibkanPengisian(e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827' }}>
                    WAJIBKAN PENGISIAN KOLOM
                  </Typography>
                }
              />
              <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.75rem', mt: 0.5, ml: 5 }}>
                Kolom akan diatur sebagai salah satu kolom yang wajib diisi ketika akan melakukan
                penambahan user merchant. Anda juga dapat mengatur kolom ini sebagai salah satu kolom
                optional yang tidak wajib diisi.
              </Typography>
            </Box>

            {/* EDITABLE KOLOM */}
            <Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={editableKolom}
                    onChange={(e) => setEditableKolom(e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827' }}>
                    EDITABLE KOLOM
                  </Typography>
                }
              />
              <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.75rem', mt: 0.5, ml: 5 }}>
                Kolom akan di atur sebagai kolom yang dapat diedit oleh user merchant. Anda juga dapat
                mengatur kolom ini sebagai kolom yang tidak dapat diedit oleh user merchant pada lain
                waktu.
              </Typography>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2, pt: 2, borderTop: '1px solid #e5e7eb' }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={{
              textTransform: 'none',
              borderColor: '#dc2626',
              color: '#dc2626',
              '&:hover': {
                borderColor: '#b91c1c',
                bgcolor: '#fef2f2',
              },
            }}
          >
            Batal
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={!namaKolom.trim() || !formatKolom}
            sx={{
              textTransform: 'none',
              bgcolor: '#1976d2',
              '&:hover': {
                bgcolor: '#1565c0',
              },
            }}
          >
            {isEdit ? 'Simpan' : 'Tambah Kolom'}
          </Button>
        </DialogActions>
      </Dialog>

      <FormatKolomDialog
        open={formatDialogOpen}
        onClose={() => setFormatDialogOpen(false)}
        onUnderstand={() => setFormatDialogOpen(false)}
      />
    </>
  );
}
