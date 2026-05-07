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

export default function BeritaDetailDialog({
  open,
  onClose,
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

  useEffect(() => {
    if (data) {
      setFormData({
        judul: data.judul || '',
        subJudul: data.subJudul || '',
        isiBerita: data.isiBerita || '',
        jenisUserPenerima: 'ADMIN',
        perusahaanTujuan: data.perusahaanTujuan || [],
        gambar: data.gambar || null,
        publikasikan: data.publikasikan || false,
        jadikanBeritaUtama: data.jadikanBeritaUtama || false,
        tags: data.tags || [],
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
        Detail Berita
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
              disabled
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: '0.875rem',
                  backgroundColor: 'rgba(0, 0, 0, 0.06)',
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

          {/* Publikasikan */}
          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.publikasikan}
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
          {formData.tags.length > 0 && (
            <Box>
              <Typography variant="body2" sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
                Tags
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formData.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    sx={{
                      fontSize: '0.75rem',
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}
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
