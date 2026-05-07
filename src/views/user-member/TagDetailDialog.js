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
  TextField,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { CloseCircle } from 'iconsax-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TagDetailDialog({ open, onClose, tag }) {
  if (!tag) return null;

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
            Detail Data Tags
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
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box>
                <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem', fontWeight: 500 }}>
                  Nama Tags
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={tag.nama}
                  disabled
                  InputProps={{
                    sx: { fontSize: '0.875rem' }
                  }}
                />
              </Box>

              <Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={tag.sinkronkan}
                      disabled
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-disabled': {
                          color: tag.sinkronkan ? 'success.main' : '#9ca3af',
                        },
                        '& .MuiSwitch-switchBase.Mui-disabled + .MuiSwitch-track': {
                          backgroundColor: tag.sinkronkan ? 'success.main' : '#d1d5db',
                          opacity: 1,
                        },
                        '& .MuiSwitch-thumb': {
                          backgroundColor: tag.sinkronkan ? '#ffffff' : '#6b7280',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        },
                      }}
                    />
                  }
                  label={
                    <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '0.9375rem' }}>
                      SINKRONKAN TAGS KE SELF REGISTER
                    </Typography>
                  }
                />
                <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary', fontSize: '0.875rem' }}>
                  Sinkronkan tags agar muncul saat calon anggota melakukan self register (pendaftaran mandiri).
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
