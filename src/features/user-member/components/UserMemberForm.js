'use client';

import React from 'react';
import {
  TextField,
  Typography,
  Box,
  FormHelperText,
  Select,
  MenuItem,
} from '@mui/material';
import { useFormikContext } from 'formik';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

// Mock data untuk dropdown options
const tagsOptions = [
  { value: 'tag1', label: 'Tag 1' },
  { value: 'tag2', label: 'Tag 2' },
  { value: 'tag3', label: 'Tag 3' },
];

export default function UserMemberForm() {
  const { values, errors, touched, setFieldValue } = useFormikContext();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
          gap: 3,
          border: 'none',
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
              value={values.username}
              onChange={(e) => setFieldValue('username', e.target.value)}
              placeholder="Username"
              error={Boolean(touched.username && errors.username)}
              helperText={touched.username && errors.username}
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

          {/* Nama */}
          <Box>
            <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem' }}>
              Nama<span style={{ color: 'red' }}> *</span>
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={values.nama}
              onChange={(e) => setFieldValue('nama', e.target.value)}
              placeholder="Nama"
              error={Boolean(touched.nama && errors.nama)}
              helperText={touched.nama && errors.nama}
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

          {/* No Identitas */}
          <Box>
            <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem' }}>
              No Identitas
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={values.noIdentitas}
              onChange={(e) => setFieldValue('noIdentitas', e.target.value)}
              placeholder="No Identitas"
              error={Boolean(touched.noIdentitas && errors.noIdentitas)}
              helperText={touched.noIdentitas && errors.noIdentitas}
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

          {/* No ID */}
          <Box>
            <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem' }}>
              No ID<span style={{ color: 'red' }}> *</span>
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={values.noId}
              onChange={(e) => setFieldValue('noId', e.target.value)}
              placeholder="No ID jika tidak diisi akan tergenerate otomatis"
              error={Boolean(touched.noId && errors.noId)}
              helperText={touched.noId && errors.noId}
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

          {/* NIS */}
          <Box>
            <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem' }}>
              NIS
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={values.nis}
              onChange={(e) => setFieldValue('nis', e.target.value)}
              placeholder="NIS"
              error={Boolean(touched.nis && errors.nis)}
              helperText={touched.nis && errors.nis}
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
        </Box>

        {/* Right Column */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Email */}
          <Box>
            <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem' }}>
              Email<span style={{ color: 'red' }}> *</span>
            </Typography>
            <TextField
              fullWidth
              size="small"
              type="email"
              value={values.email}
              onChange={(e) => setFieldValue('email', e.target.value)}
              placeholder="Email"
              error={Boolean(touched.email && errors.email)}
              helperText={touched.email && errors.email}
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

          {/* No Telepon */}
          <Box>
            <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem' }}>
              No Telepon<span style={{ color: 'red' }}> *</span>
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={values.noTelepon}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                setFieldValue('noTelepon', value);
              }}
              placeholder="No Telepon"
              error={Boolean(touched.noTelepon && errors.noTelepon)}
              helperText={touched.noTelepon && errors.noTelepon}
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

          {/* Tanggal Lahir */}
          <Box>
            <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem' }}>
              Tanggal Lahir<span style={{ color: 'red' }}> *</span>
            </Typography>
            <DatePicker
              value={values.tanggalLahir ? dayjs(values.tanggalLahir) : null}
              onChange={(newValue) => {
                setFieldValue('tanggalLahir', newValue ? newValue.toDate() : null);
              }}
              slotProps={{
                textField: {
                  size: 'small',
                  fullWidth: true,
                  placeholder: 'Pilih Tanggal',
                  error: Boolean(touched.tanggalLahir && errors.tanggalLahir),
                  helperText: touched.tanggalLahir && errors.tanggalLahir,
                  required: true,
                  InputProps: {
                    sx: { fontSize: '0.875rem' }
                  },
                  inputProps: {
                    style: { fontSize: '0.875rem' }
                  },
                  FormHelperTextProps: {
                    sx: { fontSize: '0.75rem' }
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
              value={values.tempatLahir}
              onChange={(e) => setFieldValue('tempatLahir', e.target.value)}
              placeholder="Tempat Lahir"
              error={Boolean(touched.tempatLahir && errors.tempatLahir)}
              helperText={touched.tempatLahir && errors.tempatLahir}
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

          {/* Alamat */}
          <Box>
            <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem' }}>
              Alamat<span style={{ color: 'red' }}> *</span>
            </Typography>
            <TextField
              fullWidth
              size="small"
              multiline
              rows={4}
              value={values.alamat}
              onChange={(e) => setFieldValue('alamat', e.target.value)}
              placeholder="Alamat"
              error={Boolean(touched.alamat && errors.alamat)}
              helperText={touched.alamat && errors.alamat}
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

          {/* Tags */}
          <Box>
            <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem' }}>
              Tags
            </Typography>
            <Select
              fullWidth
              size="small"
              value={values.tags}
              onChange={(e) => setFieldValue('tags', e.target.value)}
              displayEmpty
              renderValue={(selected) => {
                if (!selected) {
                  return <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>Silahkan Pilih</Typography>;
                }
                return tagsOptions.find((opt) => opt.value === selected)?.label || selected;
              }}
              error={Boolean(touched.tags && errors.tags)}
              sx={{
                fontSize: '0.875rem',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: touched.tags && errors.tags ? 'error.main' : 'rgba(0, 0, 0, 0.23)',
                },
              }}
            >
              {tagsOptions.map((option) => (
                <MenuItem key={option.value} value={option.value} sx={{ fontSize: '0.875rem' }}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {touched.tags && errors.tags && (
              <FormHelperText error sx={{ mt: 0.5, fontSize: '0.75rem' }}>
                {errors.tags}
              </FormHelperText>
            )}
          </Box>
        </Box>
      </Box>
    </LocalizationProvider>
  );
}
