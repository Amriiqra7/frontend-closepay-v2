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
  Stack,
} from '@mui/material';
import { CloseCircle, DocumentDownload } from 'iconsax-react';
import { motion, AnimatePresence } from 'framer-motion';

const MotionPaper = motion(Box);

export default function DownloadDataDialog({ open, onClose, onDownload }) {
  const handleDownload = (format) => {
    if (onDownload) {
      onDownload(format);
    }
    onClose();
  };

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
            Pilih Format File
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
            <Typography
              variant="body1"
              sx={{
                mb: 3,
                textAlign: 'center',
                color: 'text.secondary',
                fontSize: '0.9375rem',
              }}
            >
              Pilih format file yang akan didownload
            </Typography>

            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                onClick={() => handleDownload('CSV')}
                startIcon={<DocumentDownload size={20} color="white" />}
                sx={{
                  textTransform: 'none',
                  py: 1.5,
                  flex: 1,
                  bgcolor: '#6366f1',
                  '&:hover': {
                    bgcolor: '#4f46e5',
                  },
                }}
              >
                CSV
              </Button>
              <Button
                variant="contained"
                onClick={() => handleDownload('Excel')}
                startIcon={<DocumentDownload size={20} color="white" />}
                sx={{
                  textTransform: 'none',
                  py: 1.5,
                  flex: 1,
                  bgcolor: '#6366f1',
                  '&:hover': {
                    bgcolor: '#4f46e5',
                  },
                }}
              >
                Excel
              </Button>
              <Button
                variant="contained"
                onClick={() => handleDownload('JSON')}
                startIcon={<DocumentDownload size={20} color="white" />}
                sx={{
                  textTransform: 'none',
                  py: 1.5,
                  flex: 1,
                  bgcolor: '#6366f1',
                  '&:hover': {
                    bgcolor: '#4f46e5',
                  },
                }}
              >
                JSON
              </Button>
            </Stack>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
