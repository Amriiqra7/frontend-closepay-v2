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
import { motion, AnimatePresence } from 'framer-motion';

export default function UploadDataTermsDialog({ open, onClose, onStartUpload }) {
  return (
    <AnimatePresence>
      {open && (
        <Dialog
          open={open}
          onClose={onClose}
          maxWidth="md"
          fullWidth
          PaperComponent={motion(Box)}
          PaperProps={{
            initial: { opacity: 0, scale: 0.9, y: 20 },
            animate: { opacity: 1, scale: 1, y: 0 },
            exit: { opacity: 0, scale: 0.9, y: 20 },
            transition: {
              duration: 0.2,
              ease: [0.4, 0, 0.2, 1],
            },
            sx: (theme) => ({
              borderRadius: 2,
              boxShadow: theme.shadows[24],
              bgcolor: 'background.paper',
            }),
          }}
          TransitionProps={{
            timeout: 200,
          }}
        >
          <DialogTitle
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              pb: 1,
              fontWeight: 700,
              fontSize: '1.5rem',
            }}
          >
            KETENTUAN
            <IconButton
              onClick={onClose}
              size="small"
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <CloseCircle size={20} />
            </IconButton>
          </DialogTitle>

          <DialogContent>
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

          <DialogActions sx={{ px: 3, pb: 3, pt: 2 }}>
            <Button
              variant="outlined"
              onClick={onClose}
              sx={{
                textTransform: 'none',
                borderColor: 'error.main',
                color: 'error.main',
                '&:hover': {
                  borderColor: 'error.dark',
                  bgcolor: 'error.light',
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
      )}
    </AnimatePresence>
  );
}
