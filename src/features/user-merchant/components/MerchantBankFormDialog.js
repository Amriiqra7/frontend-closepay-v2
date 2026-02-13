'use client';

import React, { useState, useEffect } from 'react';
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
  FormHelperText,
} from '@mui/material';
import { CloseCircle } from 'iconsax-react';
import { FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import { handleCreateWithToast, handleUpdateWithToast, showErrorToast } from '@/shared/utils/toast';

const validationSchema = Yup.object().shape({
  noRekening: Yup.string()
    .required('Nomor Rekening wajib diisi')
    .matches(/^\d+$/, 'Nomor Rekening hanya boleh berisi angka')
    .max(50, 'Nomor Rekening maksimal 50 karakter'),
  namaRekening: Yup.string()
    .required('Nama Rekening wajib diisi')
    .max(100, 'Nama Rekening maksimal 100 karakter'),
  namaBank: Yup.string()
    .required('Nama Bank wajib diisi'),
});

// Placeholder API - replace with actual API service
const MerchantBankAPI = {
  create: async (merchantId, values) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Creating bank for merchant:', merchantId, values);
        resolve({ success: true });
      }, 1000);
    });
  },
  update: async (bankId, values) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Updating bank:', bankId, values);
        resolve({ success: true });
      }, 1000);
    });
  },
};

export default function MerchantBankFormDialog({ open, onClose, mode, bank, bankOptions, merchantId }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      noRekening: '',
      namaRekening: '',
      namaBank: '',
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      setIsSubmitting(true);
      try {
        if (mode === 'add') {
          await handleCreateWithToast(
            MerchantBankAPI.create(merchantId, values),
            'bank merchant'
          );
        } else {
          await handleUpdateWithToast(
            MerchantBankAPI.update(bank?.id, values),
            'bank merchant'
          );
        }
        onClose();
        // TODO: Refresh data in parent
      } catch (error) {
        // Error already handled by toast
      } finally {
        setSubmitting(false);
        setIsSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && bank) {
        formik.setValues({
          noRekening: bank.noRekening || '',
          namaRekening: bank.namaRekening || '',
          namaBank: bank.namaBank || '',
        });
      } else {
        formik.resetForm();
      }
    }
  }, [open, mode, bank]);

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    formik.handleSubmit();

    if (!formik.isValid) {
      showErrorToast('Pastikan semua data wajib telah diisi dengan lengkap dan benar!');
    }
  };

  return (
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
        {mode === 'add' ? 'Tambah Data Bank Merchant' : 'Edit Data Bank Merchant'}
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

      <FormikProvider value={formik}>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ pt: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Nomor Rekening */}
              <Box>
                <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem' }}>
                  Nomor Rekening<span style={{ color: 'red' }}> *</span>
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  name="noRekening"
                  value={formik.values.noRekening}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    formik.setFieldValue('noRekening', value);
                  }}
                  onBlur={formik.handleBlur}
                  placeholder="Nomor Rekening"
                  error={Boolean(formik.touched.noRekening && formik.errors.noRekening)}
                  helperText={formik.touched.noRekening && formik.errors.noRekening}
                  required
                  InputProps={{
                    sx: { fontSize: '0.875rem' }
                  }}
                  inputProps={{
                    style: { fontSize: '0.875rem' }
                  }}
                  FormHelperTextProps={{
                    sx: { fontSize: '0.75rem' }
                  }}
                />
              </Box>

              {/* Nama Rekening */}
              <Box>
                <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem' }}>
                  Nama Rekening<span style={{ color: 'red' }}> *</span>
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  name="namaRekening"
                  value={formik.values.namaRekening}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Nama Rekening"
                  error={Boolean(formik.touched.namaRekening && formik.errors.namaRekening)}
                  helperText={formik.touched.namaRekening && formik.errors.namaRekening}
                  required
                  InputProps={{
                    sx: { fontSize: '0.875rem' }
                  }}
                  inputProps={{
                    style: { fontSize: '0.875rem' }
                  }}
                  FormHelperTextProps={{
                    sx: { fontSize: '0.75rem' }
                  }}
                />
              </Box>

              {/* Nama Bank */}
              <Box>
                <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem' }}>
                  Nama Bank<span style={{ color: 'red' }}> *</span>
                </Typography>
                <Select
                  fullWidth
                  size="small"
                  name="namaBank"
                  value={formik.values.namaBank}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  displayEmpty
                  error={Boolean(formik.touched.namaBank && formik.errors.namaBank)}
                  renderValue={(selected) => {
                    if (!selected) {
                      return <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>Pilih Bank</Typography>;
                    }
                    return bankOptions.find((opt) => opt.value === selected)?.label || selected;
                  }}
                  sx={{
                    fontSize: '0.875rem',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: formik.touched.namaBank && formik.errors.namaBank ? 'error.main' : 'rgba(0, 0, 0, 0.23)',
                    },
                  }}
                >
                  {bankOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value} sx={{ fontSize: '0.875rem' }}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.namaBank && formik.errors.namaBank && (
                  <FormHelperText error sx={{ mt: 0.5, fontSize: '0.75rem' }}>
                    {formik.errors.namaBank}
                  </FormHelperText>
                )}
              </Box>
            </Box>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 3, pt: 2, borderTop: '1px solid #e5e7eb' }}>
            <Button
              variant="outlined"
              onClick={handleClose}
              disabled={isSubmitting}
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
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              sx={{
                textTransform: 'none',
              }}
            >
              {isSubmitting ? 'Menyimpan...' : mode === 'add' ? 'Tambah' : 'Simpan'}
            </Button>
          </DialogActions>
        </form>
      </FormikProvider>
    </Dialog>
  );
}
