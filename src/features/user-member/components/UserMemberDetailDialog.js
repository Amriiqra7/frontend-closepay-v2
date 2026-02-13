'use client';

import React from 'react';
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
  Card,
  CardContent,
  Divider,
  IconButton,
} from '@mui/material';
import { CloseCircle } from 'iconsax-react';
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

// Mock data untuk akun induk (parent account)
const getMockParentAccount = (memberId) => {
  // TODO: Replace with actual API call
  return {
    nama: 'Akun Induk 1',
    email: 'parent1@example.com',
    username: 'parent1',
    noTelp: '081234567890',
  };
};

export default function UserMemberDetailDialog({ open, onClose, member }) {
  if (!member) return null;

  // Mock data untuk akun induk - TODO: Replace with actual API call
  const parentAccount = getMockParentAccount(member.id);

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
            pb: 1,
          }}
        >
          <Typography component="span" variant="h6" fontWeight="bold">
            Detail Member
          </Typography>
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
            <CloseCircle size={20} color="#6b7280" />
          </IconButton>
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
                <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem' }}>
                  Username
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={member.username || '-'}
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
                  value={member.nama || '-'}
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

              {/* No Identitas */}
              <Box>
                <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem' }}>
                  No Identitas
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={member.noIdentitas || '-'}
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
                  value={member.noId || '-'}
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

              {/* NIS */}
              <Box>
                <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem' }}>
                  NIS
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={member.nis || '-'}
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
              {/* Email */}
              <Box>
                <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem' }}>
                  Email
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  type="email"
                  value={member.email || '-'}
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
                  value={member.noTelp || '-'}
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
                  value={member.tanggalLahir ? dayjs(member.tanggalLahir) : null}
                  readOnly
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
                  value={member.tempatLahir || '-'}
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
                  value={member.alamat || '-'}
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

              {/* Tags */}
              <Box>
                <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem' }}>
                  Tags
                </Typography>
                <Select
                  fullWidth
                  size="small"
                  value={member.tags || ''}
                  displayEmpty
                  disabled
                  renderValue={(selected) => {
                    if (!selected) {
                      return <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>-</Typography>;
                    }
                    return (
                      <Typography sx={{ fontSize: '0.875rem' }}>
                        {tagsOptions.find((opt) => opt.value === selected)?.label || selected}
                      </Typography>
                    );
                  }}
                  sx={{
                    fontSize: '0.875rem',
                    bgcolor: '#f9fafb',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(0, 0, 0, 0.23)',
                    },
                  }}
                >
                  {tagsOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value} sx={{ fontSize: '0.875rem' }}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </Box>
          </Box>

          {/* Card Akun Induk */}
          <Box sx={{ mt: 4 }}>
            <Card
              sx={{
                bgcolor: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: 2,
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, fontSize: '1rem' }}>
                  Akun Induk
                </Typography>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                    gap: 3,
                  }}
                >
                  {/* Nama */}
                  <Box>
                    <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem', color: '#6b7280' }}>
                      Nama
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                      {parentAccount?.nama || '-'}
                    </Typography>
                  </Box>

                  {/* Email */}
                  <Box>
                    <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem', color: '#6b7280' }}>
                      Email
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                      {parentAccount?.email || '-'}
                    </Typography>
                  </Box>

                  {/* Username */}
                  <Box>
                    <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem', color: '#6b7280' }}>
                      Username
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                      {parentAccount?.username || '-'}
                    </Typography>
                  </Box>

                  {/* No Telp */}
                  <Box>
                    <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem', color: '#6b7280' }}>
                      No Telp
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                      {parentAccount?.noTelp || '-'}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{
              textTransform: 'none',
              borderColor: '#d32f2f',
              color: '#d32f2f',
              '&:hover': {
                borderColor: '#b71c1c',
                bgcolor: '#fee2e2',
              },
            }}
          >
            Tutup
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}
