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

export default function DownloadDataDialog({ open, onClose, onDownload }) {
  const handleDownload = (format) => {
    if (onDownload) {
      onDownload(format);
    }
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
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
        Pilih Format File
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
        <Typography
          variant="body1"
          sx={{
            mb: 3,
            textAlign: 'center',
            color: '#6b7280',
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
  );
}
