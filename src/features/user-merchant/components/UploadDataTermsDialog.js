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
  IconButton,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { CloseCircle } from 'iconsax-react';

export default function UploadDataTermsDialog({ open, onClose, onStartUpload }) {
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
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 2,
          borderBottom: '1px solid #e5e7eb',
          fontWeight: 600,
          fontSize: '1.25rem',
          color: '#111827',
        }}
      >
        KETENTUAN
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
          <CloseCircle size={24} variant="Linear" color="#6b7280" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <List sx={{ pl: 0 }}>
          <ListItem sx={{ px: 0, py: 1.5, alignItems: 'flex-start' }}>
            <ListItemText
              primary={
                <Typography variant="body1" sx={{ fontSize: '0.9375rem' }}>
                  <strong>1.</strong> Hanya gunakan template yang didapat dari unduh template pada web admin
                </Typography>
              }
            />
          </ListItem>
          <ListItem sx={{ px: 0, py: 1.5, alignItems: 'flex-start' }}>
            <ListItemText
              primary={
                <Typography variant="body1" sx={{ fontSize: '0.9375rem' }}>
                  <strong>2.</strong> <strong>Jangan mengubah wording atau urutan dari data header</strong> pada file template
                </Typography>
              }
            />
          </ListItem>
          <ListItem sx={{ px: 0, py: 1.5, alignItems: 'flex-start' }}>
            <ListItemText
              primary={
                <Typography variant="body1" sx={{ fontSize: '0.9375rem' }}>
                  <strong>3.</strong> Isi data sesuai dengan format yang sudah ditetapkan. Perhatikan format pada kolom email, nomor telepon, tanggal lahir, dan lainnya
                </Typography>
              }
            />
          </ListItem>
          <ListItem sx={{ px: 0, py: 1.5, alignItems: 'flex-start' }}>
            <ListItemText
              primary={
                <Typography variant="body1" sx={{ fontSize: '0.9375rem' }}>
                  <strong>4.</strong> Silahkan pilih data sesuai dengan dropdown pilihan yang tersedia pada beberapa kolom yang menerapkan pemilihan data dalam pengisian kolomnya. Contohnya kolom Jenis Identitas dan Jenis Kelamin
                </Typography>
              }
            />
          </ListItem>
          <ListItem sx={{ px: 0, py: 1.5, alignItems: 'flex-start' }}>
            <ListItemText
              primary={
                <Typography variant="body1" sx={{ fontSize: '0.9375rem' }}>
                  <strong>5.</strong> Beberapa kolom mengharuskan pengisian data yang unik (tidak boleh ada data yang sama)
                </Typography>
              }
            />
          </ListItem>
          <ListItem sx={{ px: 0, py: 1.5, alignItems: 'flex-start' }}>
            <ListItemText
              primary={
                <Typography variant="body1" sx={{ fontSize: '0.9375rem' }}>
                  <strong>6.</strong> Hasil dari proses unggah data user ini akan dikirimkan ke email admin Anda, pastikan Anda dapat mengakses email Anda untuk mendapatkan pemberitahuannya.
                </Typography>
              }
            />
          </ListItem>
        </List>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 2, borderTop: '1px solid #e5e7eb' }}>
        <Button
          variant="outlined"
          onClick={onClose}
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
          Tutup
        </Button>
        <Button
          variant="contained"
          onClick={onStartUpload}
          sx={{
            textTransform: 'none',
            bgcolor: '#f59e0b',
            color: 'white',
            '&:hover': {
              bgcolor: '#d97706',
            },
          }}
        >
          Mulai Upload Data
        </Button>
      </DialogActions>
    </Dialog>
  );
}
