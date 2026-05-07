'use client';

import React, { useState } from 'react';
import {
  TextField,
  Typography,
  Box,
  Button,
  FormHelperText,
  Select,
  MenuItem,
} from '@mui/material';
import { useFormikContext } from 'formik';
import { Add } from 'iconsax-react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import RoleAccessTable from './RoleAccessTable';

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

export default function UserAdminForm() {
  const { values, errors, touched, setFieldValue } = useFormikContext();
  const [showRoleAccessTable, setShowRoleAccessTable] = useState(false);

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
              placeholder="Username (Opsional)"
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

          {/* Password */}
          <Box>
            <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem' }}>
              Password
            </Typography>
            <TextField
              fullWidth
              size="small"
              type="password"
              value={values.password}
              onChange={(e) => setFieldValue('password', e.target.value)}
              placeholder="Jika tidak memasukkan password, password akan tergenerate otomatis"
              error={Boolean(touched.password && errors.password)}
              helperText={touched.password && errors.password}
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

          {/* Jenis Identitas */}
          <Box>
            <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem' }}>
              Jenis Identitas<span style={{ color: 'red' }}> *</span>
            </Typography>
            <Select
              fullWidth
              size="small"
              value={values.jenisIdentitas}
              onChange={(e) => setFieldValue('jenisIdentitas', e.target.value)}
              displayEmpty
              renderValue={(selected) => {
                if (!selected) {
                  return <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>Silahkan Pilih</Typography>;
                }
                return jenisIdentitasOptions.find((opt) => opt.value === selected)?.label || selected;
              }}
              error={Boolean(touched.jenisIdentitas && errors.jenisIdentitas)}
              sx={{
                fontSize: '0.875rem',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: touched.jenisIdentitas && errors.jenisIdentitas ? 'error.main' : 'rgba(0, 0, 0, 0.23)',
                },
              }}
            >
              {jenisIdentitasOptions.map((option) => (
                <MenuItem key={option.value} value={option.value} sx={{ fontSize: '0.875rem' }}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {touched.jenisIdentitas && errors.jenisIdentitas && (
              <FormHelperText error sx={{ mt: 0.5, fontSize: '0.75rem' }}>
                {errors.jenisIdentitas}
              </FormHelperText>
            )}
          </Box>

          {/* No Identitas */}
          <Box>
            <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem' }}>
              No Identitas<span style={{ color: 'red' }}> *</span>
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={values.noIdentitas}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                setFieldValue('noIdentitas', value);
              }}
              placeholder="No Identitas"
              error={Boolean(touched.noIdentitas && errors.noIdentitas)}
              helperText={touched.noIdentitas && errors.noIdentitas}
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

          {/* No ID */}
          <Box>
            <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem' }}>
              No ID<span style={{ color: 'red' }}> *</span>
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={values.noId}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                setFieldValue('noId', value);
              }}
              placeholder="No ID"
              error={Boolean(touched.noId && errors.noId)}
              helperText={touched.noId && errors.noId}
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

          {/* Tambah Peran Hak Akses Button */}
          <Box>
            <Button
              variant="contained"
              startIcon={<Add size={20} color="white" />}
              onClick={() => setShowRoleAccessTable(!showRoleAccessTable)}
              sx={{
                textTransform: 'none',
                width: '100%',
                justifyContent: 'flex-start',
              }}
            >
              {showRoleAccessTable ? 'Batal' : 'Tambah Peran Hak Akses'}
            </Button>
            {touched.roleAccesses && errors.roleAccesses && (
              <FormHelperText error sx={{ mt: 0.5, fontSize: '0.75rem' }}>
                {errors.roleAccesses}
              </FormHelperText>
            )}
          </Box>
        </Box>

        {/* Right Column */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Jenis Kelamin */}
          <Box>
            <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem' }}>
              Jenis Kelamin<span style={{ color: 'red' }}> *</span>
            </Typography>
            <Select
              fullWidth
              size="small"
              value={values.jenisKelamin}
              onChange={(e) => setFieldValue('jenisKelamin', e.target.value)}
              displayEmpty
              renderValue={(selected) => {
                if (!selected) {
                  return <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>Silahkan Pilih</Typography>;
                }
                return jenisKelaminOptions.find((opt) => opt.value === selected)?.label || selected;
              }}
              error={Boolean(touched.jenisKelamin && errors.jenisKelamin)}
              sx={{
                fontSize: '0.875rem',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: touched.jenisKelamin && errors.jenisKelamin ? 'error.main' : 'rgba(0, 0, 0, 0.23)',
                },
              }}
            >
              {jenisKelaminOptions.map((option) => (
                <MenuItem key={option.value} value={option.value} sx={{ fontSize: '0.875rem' }}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {touched.jenisKelamin && errors.jenisKelamin && (
              <FormHelperText error sx={{ mt: 0.5, fontSize: '0.75rem' }}>
                {errors.jenisKelamin}
              </FormHelperText>
            )}
          </Box>

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
              Tanggal Lahir
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
              Alamat
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

        {/* Role Access Table - appears below form when button is clicked */}
        {showRoleAccessTable && (
          <Box sx={{ gridColumn: '1 / -1'}}>
            <RoleAccessTable />
          </Box>
        )}
      </Box>
    </LocalizationProvider>
  );
}
