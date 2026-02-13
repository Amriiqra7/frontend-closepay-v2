'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  FormHelperText,
} from '@mui/material';
import { CloseCircle, DocumentDownload } from 'iconsax-react';
import { motion } from 'framer-motion';
import UploadFile from '@/shared/ui/UploadFile';
import { showSuccessToast, showErrorToast } from '@/shared/utils/toast';

export default function UpdateTagsDialog({ open, onClose }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (selectedFile) => {
    setError('');
    if (selectedFile) {
      // Validasi format .xlsx
      const fileExtension = selectedFile.name
        .substring(selectedFile.name.lastIndexOf('.'))
        .toLowerCase();
      
      if (fileExtension !== '.xlsx') {
        setError('Format file harus .xlsx');
        setFile(null);
        return;
      }

      // Validasi size (2MB)
      if (selectedFile.size > 2 * 1024 * 1024) {
        setError('Ukuran file maksimal 2.0 MB');
        setFile(null);
        return;
      }

      setFile(selectedFile);
    } else {
      // Handle when file is cleared (null)
      setFile(null);
    }
  };

  const handleDownloadTemplate = () => {
    showSuccessToast('Template berhasil diunduh');
    // TODO: Implement actual download
  };

  const handleUpload = () => {
    if (!file) {
      setError('File wajib diisi');
      return;
    }

    // TODO: Implement actual upload
    showSuccessToast('Tags berhasil diupdate');
    handleClose();
  };

  const handleClose = () => {
    setFile(null);
    setError('');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperComponent={motion(Box)}
      PaperProps={{
        initial: false,
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
            Update Tags Member
            <IconButton
              onClick={handleClose}
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
            <Box sx={{ mb: 3 }}>
              <UploadFile
                value={file}
                onChange={handleFileChange}
                error={Boolean(error)}
                helperText={error}
                accept=".xlsx"
                maxSize={2 * 1024 * 1024}
                label="File"
                required
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Button
                variant="contained"
                onClick={handleDownloadTemplate}
                startIcon={<DocumentDownload size={18} color="white" />}
                sx={{
                  textTransform: 'none',
                  bgcolor: '#10b981',
                  color: 'white',
                  '&:hover': {
                    bgcolor: '#059669',
                  },
                }}
              >
                Unduh Template
              </Button>
            </Box>

            <Box sx={{ mt: 2 }}>
              <FormHelperText sx={{ fontSize: '0.75rem', color: 'error.main', mb: 0.5 }}>
                *Format file harus .xlsx
              </FormHelperText>
              <FormHelperText sx={{ fontSize: '0.75rem', color: 'error.main', mb: 0.5 }}>
                *File yang diunggah harus sesuai dengan template yang disediakan
              </FormHelperText>
              <FormHelperText sx={{ fontSize: '0.75rem', color: 'error.main', mb: 0.5 }}>
                *max Size: 2.0 MB
              </FormHelperText>
              <FormHelperText sx={{ fontSize: '0.75rem', color: 'error.main', mb: 0.5 }}>
                *max User: 10000 users
              </FormHelperText>
            </Box>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 3, pt: 2 }}>
            <Button
              variant="outlined"
              onClick={handleClose}
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
              Batal
            </Button>
            <Button
              variant="contained"
              onClick={handleUpload}
              sx={{
                textTransform: 'none',
                bgcolor: '#f59e0b',
                color: 'white',
                '&:hover': {
                  bgcolor: '#d97706',
                },
              }}
            >
              Upload
            </Button>
          </DialogActions>
        </Dialog>
  );
}
