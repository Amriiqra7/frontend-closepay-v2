'use client';

import React, { useEffect, useState } from 'react';
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
  Chip,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { CloseSquare } from 'iconsax-react';

export default function InfoDetailDialog({
  open,
  onClose,
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
    }
  }, [data, open]);

  return (
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
          fontWeight: 500,
        }}
      >
        Detail Info
        <IconButton
          size="small"
          onClick={onClose}
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
                Judul
              </Typography>
              <Typography variant="caption" sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                {formData.judul.length}/100
              </Typography>
            </Box>
            <TextField
              fullWidth
              size="small"
              value={formData.judul}
              disabled
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: '0.875rem',
                  backgroundColor: 'rgba(0, 0, 0, 0.06)',
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
            {formData.perusahaanTujuan.length > 0 ? (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formData.perusahaanTujuan.map((perusahaan) => (
                  <Chip
                    key={perusahaan}
                    label={perusahaan}
                    size="small"
                    sx={{
                      fontSize: '0.75rem',
                    }}
                  />
                ))}
              </Box>
            ) : (
              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                Tidak ada perusahaan yang dipilih
              </Typography>
            )}
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
              disabled
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: '0.875rem',
                  backgroundColor: 'rgba(0, 0, 0, 0.06)',
                },
              }}
            />
          </Box>

          {/* Gambar */}
          {formData.gambar && (
            <Box>
              <Typography variant="body2" sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
                Gambar
              </Typography>
              <Box
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  p: 2,
                  backgroundColor: 'rgba(0, 0, 0, 0.06)',
                }}
              >
                <Typography variant="body2" sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                  {formData.gambar instanceof File ? formData.gambar.name : 'Gambar tersedia'}
                </Typography>
              </Box>
            </Box>
          )}

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
              disabled
              InputLabelProps={{
                shrink: true,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: '0.875rem',
                  backgroundColor: 'rgba(0, 0, 0, 0.06)',
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
              disabled
              InputLabelProps={{
                shrink: true,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: '0.875rem',
                  backgroundColor: 'rgba(0, 0, 0, 0.06)',
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
              disabled
              InputLabelProps={{
                shrink: true,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: '0.875rem',
                  backgroundColor: 'rgba(0, 0, 0, 0.06)',
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
              disabled
              InputLabelProps={{
                shrink: true,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: '0.875rem',
                  backgroundColor: 'rgba(0, 0, 0, 0.06)',
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
                  disabled
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
                  disabled
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
          onClick={onClose}
          sx={{
            textTransform: 'none',
            px: 3,
          }}
        >
          Tutup
        </Button>
      </DialogActions>
    </Dialog>
  );
}
