'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Paper,
  Box,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

const MotionPaper = motion(Paper);

export default function KategoriTemplateForm({
  open,
  mode,
  nama,
  onClose,
  onSubmit,
  onNamaChange,
}) {
  return (
    <AnimatePresence>
      {open && (
        <Dialog
          open={open}
          onClose={onClose}
          maxWidth="sm"
          fullWidth
          PaperComponent={MotionPaper}
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
            }),
          }}
          TransitionProps={{
            timeout: 200,
          }}
        >
          <DialogTitle
            sx={(theme) => ({
              fontWeight: 600,
              padding: theme.spacing(2.5, 3, 1.25, 3),
            })}
          >
            {mode === 'add' ? 'Tambah Kategori Template' : 'Edit Kategori Template'}
          </DialogTitle>
          <DialogContent
            sx={(theme) => ({
              padding: theme.spacing(1.25, 3),
            })}
          >
            <Box>
              <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem' }}>
                Nama
                <Typography component="span" sx={{ color: 'red', ml: 0.5 }}>
                  *
                </Typography>
              </Typography>
              <TextField
                fullWidth
                value={nama}
                onChange={(e) => onNamaChange(e.target.value)}
                placeholder="Nama"
                required
                InputProps={{
                  sx: { fontSize: '0.875rem' }
                }}
                inputProps={{
                  style: { fontSize: '0.875rem' }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions
            sx={(theme) => ({
              padding: theme.spacing(1.25, 3, 2.5, 3),
              gap: theme.spacing(1),
            })}
          >
            <Button variant="outlined" onClick={onClose}>
              Batal
            </Button>
            <Button
              variant="contained"
              onClick={onSubmit}
              disabled={!nama.trim()}
            >
              Simpan
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
