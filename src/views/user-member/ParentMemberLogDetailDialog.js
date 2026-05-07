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
  Chip,
} from '@mui/material';
import { CloseCircle } from 'iconsax-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ParentMemberLogDetailDialog({ open, onClose, log }) {
  if (!log) return null;

  return (
    <AnimatePresence>
      {open && (
        <Dialog
          open={open}
          onClose={onClose}
          maxWidth="sm"
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
              fontWeight: 600,
            }}
          >
            Data Log Akun Induk
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
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
              <Box>
                <Typography variant="body2" sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500, color: 'text.secondary' }}>
                  Tanggal
                </Typography>
                <Typography variant="body1" sx={{ fontSize: '0.9375rem' }}>
                  {log.tanggal.toLocaleString('id-ID', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500, color: 'text.secondary' }}>
                  Mode
                </Typography>
                <Chip
                  label={log.mode}
                  color="warning"
                  size="small"
                  sx={{ fontWeight: 500 }}
                />
              </Box>

              <Box>
                <Typography variant="body2" sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500, color: 'text.secondary' }}>
                  Nama Akun Induk
                </Typography>
                <Typography variant="body1" sx={{ fontSize: '0.9375rem' }}>
                  {log.namaAkunInduk}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500, color: 'text.secondary' }}>
                  Diperbarui Oleh
                </Typography>
                <Typography variant="body1" sx={{ fontSize: '0.9375rem' }}>
                  {log.diperbaruiOleh}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500, color: 'text.secondary' }}>
                  Kirim Email
                </Typography>
                <Typography variant="body1" sx={{ fontSize: '0.9375rem' }}>
                  {log.kirimEmail}
                </Typography>
              </Box>
            </Box>
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
              Kembali
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
