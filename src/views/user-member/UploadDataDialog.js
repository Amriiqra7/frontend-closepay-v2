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

export default function UploadDataDialog({ open, onClose, onShowTerms }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (selectedFile) => {
    setError('');
    if (selectedFile) {
      // Validasi format
      const validExtensions = ['.xlsx', '.xls', '.csv'];
      const fileExtension = selectedFile.name
        .substring(selectedFile.name.lastIndexOf('.'))
        .toLowerCase();
      
      if (!validExtensions.includes(fileExtension)) {
        setError('Format file harus .xlsx, .xls, atau .csv');
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
    showSuccessToast('Data berhasil diupload');
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
            Upload Data
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
                accept=".xlsx,.xls,.csv"
                maxSize={2 * 1024 * 1024}
                label="File"
                required
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
              <Button
                variant="contained"
                onClick={onShowTerms}
                startIcon={<DocumentDownload size={18} color="white" />}
                sx={{
                  textTransform: 'none',
                  bgcolor: '#3b82f6',
                  color: 'white',
                  '&:hover': {
                    bgcolor: '#2563eb',
                  },
                }}
              >
                Ketentuan
              </Button>
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
                *Format file harus .xlsx, .xls, atau .csv
              </FormHelperText>
              <FormHelperText sx={{ fontSize: '0.75rem', color: 'error.main', mb: 0.5 }}>
                *File yang diunggah harus sesuai dengan template yang disediakan
              </FormHelperText>
              <FormHelperText sx={{ fontSize: '0.75rem', color: 'error.main', mb: 0.5 }}>
                *max Size: 2.0 MB
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
