'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  InputLabel,
  Paper,
  Stack,
  Typography,
  Tooltip,
} from '@mui/material';
import {
  Document,
  DocumentDownload,
  DocumentUpload,
  Eye,
  Trash,
} from 'iconsax-react';
import { useDropzone } from 'react-dropzone';
import { showErrorToast } from '@/shared/utils/toast';
import AlertDialog from '@/shared/ui/AlertDialog';

const VIEWABLE_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'text/plain',
  'text/html',
  '.pdf',
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.webp',
  '.txt',
  '.html',
];

const isFileViewable = (file) => {
  if (!file) return false;

  if (file instanceof File) {
    return VIEWABLE_FILE_TYPES.some(
      (type) =>
        file.type.includes(type) || file.name.toLowerCase().endsWith(type)
    );
  }

  if (typeof file === 'string') {
    const fileName = file.split('/').pop().toLowerCase();
    return VIEWABLE_FILE_TYPES.some((type) =>
      fileName.endsWith(type.replace('.', ''))
    );
  }

  if (file.name || file.path) {
    const fileName = (file.name || file.path).toLowerCase();
    return VIEWABLE_FILE_TYPES.some((type) =>
      fileName.endsWith(type.replace('.', ''))
    );
  }

  return false;
};

const getReadableFileTypes = (accept) => {
  if (!accept) return 'All files';

  if (accept.includes('/*')) {
    const type = accept.split('/')[0];
    return `${type.charAt(0).toUpperCase() + type.slice(1)} files`;
  }

  const extensions = accept
    .split(',')
    .map((ext) => (ext.trim().startsWith('.') ? ext.trim() : `.${ext.trim()}`));

  return extensions.join(', ');
};

const getDropzoneAccept = (acceptString) => {
  if (!acceptString) return undefined;

  const result = {};
  const types = acceptString.split(',').map((type) => type.trim());

  for (const type of types) {
    if (type.startsWith('.')) {
      const extensionMap = {
        '.pdf': 'application/pdf',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
        '.txt': 'text/plain',
        '.html': 'text/html',
        '.doc': 'application/msword',
        '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        '.xls': 'application/vnd.ms-excel',
        '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      };

      if (extensionMap[type]) {
        result[extensionMap[type]] = [type];
      }
    } else if (type.includes('/*')) {
      result[type] = [];
    } else {
      result[type] = [];
    }
  }

  return Object.keys(result).length > 0 ? result : undefined;
};

export default function UploadFile({
  label = 'Upload File',
  name,
  value,
  onChange,
  onDelete,
  accept = '.xlsx,.xls,.csv',
  maxSize = 2 * 1024 * 1024,
  disabled = false,
  required = false,
  showDeleteButton = true,
  showReuploadButton = true,
  showDownloadButton = true,
  showViewButton = true,
  error = false,
  helperText,
  uploading = false,
}) {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const readableFileTypes = getReadableFileTypes(accept);
  const [invalidFileError, setInvalidFileError] = useState(false);

  useEffect(() => {
    if (invalidFileError) {
      const timer = setTimeout(() => {
        setInvalidFileError(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [invalidFileError]);

  const processFile = useCallback(
    (file) => {
      if (!file) return;

      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      const maxSizeMB = maxSize ? (maxSize / (1024 * 1024)).toFixed(2) : null;

      if (maxSize && file.size > maxSize) {
        showErrorToast(
          `File size (${fileSizeMB}MB) exceeds maximum allowed size of ${maxSizeMB}MB`
        );
        return;
      }

      if (accept) {
        let isValidFile = false;
        const acceptTypes = accept.split(',').map((type) => type.trim());

        for (const acceptType of acceptTypes) {
          if (acceptType.includes('/*')) {
            const mainType = acceptType.split('/')[0];
            if (file.type.startsWith(`${mainType}/`)) {
              isValidFile = true;
              break;
            }
          } else if (acceptType.startsWith('.')) {
            if (file.name.toLowerCase().endsWith(acceptType.toLowerCase())) {
              isValidFile = true;
              break;
            }
          } else if (file.type === acceptType) {
            isValidFile = true;
            break;
          }
        }

        if (!isValidFile) {
          setInvalidFileError(true);
          showErrorToast(`Invalid file type. Allowed: ${readableFileTypes}`);
          return;
        }
      }

      onChange?.(file);
    },
    [maxSize, onChange, accept, readableFileTypes]
  );

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    processFile(file);
  };

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles && rejectedFiles.length > 0) {
        setInvalidFileError(true);
        showErrorToast(`Invalid file type. Allowed: ${readableFileTypes}`);
        return;
      }

      if (acceptedFiles.length > 0) {
        processFile(acceptedFiles[0]);
      }
    },
    [processFile, readableFileTypes]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: getDropzoneAccept(accept),
    disabled: disabled || loading || !!value,
    maxFiles: 1,
    multiple: false,
  });

  const handleClearFile = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    // Call onDelete first if provided
    if (onDelete) {
      onDelete();
    }
    // Always call onChange to clear the value
    onChange(null);
    setDeleteDialogOpen(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
  };

  const handleDownload = async () => {
    if (!value) return;

    setLoading(true);
    try {
      if (value instanceof File || value.file instanceof File) {
        const fileToUse = value instanceof File ? value : value.file;
        const fileName = value instanceof File ? value.name : value.name;

        const url = URL.createObjectURL(fileToUse);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Download failed:', error);
      showErrorToast('Failed to download file. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleView = async () => {
    if (!value) return;

    setLoading(true);
    try {
      if (value instanceof File || value.file instanceof File) {
        const fileToUse = value instanceof File ? value : value.file;
        const url = URL.createObjectURL(fileToUse);
        window.open(url, '_blank');
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('View failed:', error);
      showErrorToast('Failed to view file. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const getDisplayFileName = () => {
    if (!value) return '';

    if (value instanceof File) return value.name;
    if (typeof value === 'string') {
      return value.split('/').pop();
    }
    return value.name || 'Unknown file';
  };

  const getFileSize = () => {
    if (!value) return '';

    if (value instanceof File || (value.size && value.size > 0)) {
      const size = value instanceof File ? value.size : value.size;
      if (size < 1024) return `${size} B`;
      if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
      return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    }

    return '';
  };

  const getFileExtension = () => {
    if (!value) return '';

    if (value instanceof File) {
      return value.name.split('.').pop().toLowerCase();
    }

    if (typeof value === 'string') {
      return value.split('.').pop().toLowerCase();
    }

    const fileName = value.name || '';
    return fileName.split('.').pop().toLowerCase();
  };

  const getFileColor = () => {
    const ext = getFileExtension();

    switch (ext) {
      case 'pdf':
        return '#f44336';
      case 'doc':
      case 'docx':
        return '#2196f3';
      case 'xls':
      case 'xlsx':
        return '#4caf50';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
        return '#ff9800';
      default:
        return '#9e9e9e';
    }
  };

  const getFileIcon = () => {
    return <Document size={24} color={getFileColor()} variant="Bold" />;
  };

  return (
    <Stack direction="column" spacing={1}>
      <Stack>
        <InputLabel
          shrink
          required={required}
          sx={{
            fontSize: '0.875rem',
            fontWeight: 500,
            mb: 0.5,
            '& .MuiInputLabel-asterisk': { color: 'error.main' },
          }}
        >
          {label}
        </InputLabel>

        {!value ? (
          <Box
            {...getRootProps()}
            sx={{
              border: '1px dashed',
              borderColor:
                invalidFileError || error
                  ? 'error.main'
                  : isDragActive
                    ? 'primary.main'
                    : 'grey.300',
              borderRadius: 1,
              p: 2,
              bgcolor:
                invalidFileError || error
                  ? 'rgba(211, 47, 47, 0.08)'
                  : isDragActive
                    ? 'rgba(25, 118, 210, 0.08)'
                    : 'background.paper',
              cursor: disabled || loading ? 'not-allowed' : 'pointer',
              opacity: disabled || loading ? 0.6 : 1,
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                borderColor:
                  !disabled && !loading && !invalidFileError && !error
                    ? 'primary.main'
                    : undefined,
                bgcolor:
                  !disabled && !loading && !invalidFileError && !error
                    ? 'rgba(25, 118, 210, 0.08)'
                    : undefined,
              },
              textAlign: 'center',
              height: '240px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <input {...getInputProps()} />
            <Stack
              direction="column"
              spacing={1}
              alignItems="center"
              justifyContent="center"
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <DocumentUpload
                  size={20}
                  color={
                    invalidFileError
                      ? '#d32f2f'
                      : isDragActive
                        ? '#1976d2'
                        : '#697586'
                  }
                />
                <Typography
                  variant="body2"
                  color={
                    invalidFileError
                      ? 'error.main'
                      : isDragActive
                        ? 'primary.main'
                        : 'text.secondary'
                  }
                >
                  {invalidFileError
                    ? 'Invalid file type'
                    : isDragActive
                      ? 'Drop the file here'
                      : 'Drag & drop a file here, or click to select'}
                </Typography>
              </Stack>

              {(accept || maxSize) && (
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  justifyContent="center"
                >
                  {accept && (
                    <Typography variant="caption" color="text.secondary">
                      Allowed formats: {readableFileTypes}
                    </Typography>
                  )}

                  {accept && maxSize && (
                    <Typography variant="caption" color="text.secondary">
                      •
                    </Typography>
                  )}

                  {maxSize && (
                    <Typography variant="caption" color="text.secondary">
                      Max size: {(maxSize / (1024 * 1024)).toFixed(2)} MB
                    </Typography>
                  )}
                </Stack>
              )}
            </Stack>
          </Box>
        ) : (
          <Paper
            elevation={0}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              overflow: 'hidden',
              transition: 'all 0.2s ease-in-out',
              opacity: disabled || loading ? 0.7 : 1,
              height: '72px',
              '&:hover': {
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              },
            }}
          >
            <Box
              sx={{
                p: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 1,
                    bgcolor: `${getFileColor()}15`,
                    color: getFileColor(),
                  }}
                >
                  {getFileIcon()}
                </Box>

                <Stack direction="column" spacing={0.5}>
                  <Typography
                    variant="body2"
                    fontWeight="medium"
                    noWrap
                    sx={{ maxWidth: '200px' }}
                  >
                    {getDisplayFileName()}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {getFileSize() && (
                      <>
                        {getFileSize()}
                        <Box component="span" sx={{ mx: 0.5 }} />
                      </>
                    )}
                    <Chip
                      label={getFileExtension().toUpperCase()}
                      size="small"
                      variant="outlined"
                      sx={{
                        height: 18,
                        fontSize: '0.6rem',
                        borderColor: `${getFileColor()}40`,
                        color: getFileColor(),
                        fontWeight: 500,
                        '& .MuiChip-label': { px: 0.8 },
                      }}
                    />
                  </Typography>
                </Stack>
              </Stack>

              <Stack direction="row" spacing={0.5} alignItems="center">
                {loading && (
                  <CircularProgress size={16} thickness={4} sx={{ mr: 1 }} />
                )}

                {showDeleteButton && (
                  <Tooltip title="Hapus File" arrow>
                    <IconButton
                      color="error"
                      onClick={handleClearFile}
                      size="small"
                      disabled={disabled || loading}
                      sx={{
                        bgcolor: 'rgba(211, 47, 47, 0.08)',
                        '&:hover': {
                          bgcolor: '#d32f2f',
                          color: 'white',
                        },
                      }}
                    >
                      <Trash size={18} color="#f44336" />
                    </IconButton>
                  </Tooltip>
                )}

                {showReuploadButton && (
                  <>
                    <Tooltip title="Unggah Ulang" arrow>
                      <IconButton
                        onClick={handleButtonClick}
                        size="small"
                        disabled={disabled || loading}
                        sx={{
                          bgcolor: 'rgba(25, 118, 210, 0.08)',
                          '&:hover': {
                            bgcolor: '#1976d2',
                            color: 'white',
                          },
                        }}
                      >
                        <DocumentUpload size={18} color="#1976d2" />
                      </IconButton>
                    </Tooltip>
                    <input
                      type="file"
                      hidden
                      accept={accept}
                      ref={fileInputRef}
                      onChange={handleFileChange}
                    />
                  </>
                )}

                {showDownloadButton && (
                  <Tooltip title="Unduh File" arrow>
                    <IconButton
                      onClick={handleDownload}
                      size="small"
                      disabled={disabled || loading}
                      sx={{
                        bgcolor: 'rgba(76, 175, 80, 0.08)',
                        '&:hover': {
                          bgcolor: '#4caf50',
                          color: 'white',
                        },
                      }}
                    >
                      <DocumentDownload size={18} color="#4caf50" />
                    </IconButton>
                  </Tooltip>
                )}

                {showViewButton && isFileViewable(value) && (
                  <Tooltip title="Lihat File" arrow>
                    <IconButton
                      onClick={handleView}
                      size="small"
                      disabled={disabled || loading}
                      sx={{
                        bgcolor: 'rgba(255, 152, 0, 0.08)',
                        '&:hover': {
                          bgcolor: '#ff9800',
                          color: 'white',
                        },
                      }}
                    >
                      <Eye size={18} color="#ff9800" />
                    </IconButton>
                  </Tooltip>
                )}
              </Stack>
            </Box>
          </Paper>
        )}

        {error && helperText && (
          <Typography variant="caption" color="error" sx={{ mt: 0.5, fontSize: '0.75rem' }}>
            {helperText}
          </Typography>
        )}
      </Stack>

      <AlertDialog
        open={deleteDialogOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Hapus File"
        content={
          <>
            Apakah Anda yakin ingin menghapus &quot;
            <strong>{getDisplayFileName()}</strong>&quot;?
          </>
        }
        confirmText="Hapus"
        cancelText="Batal"
        confirmColor="error"
      />
    </Stack>
  );
}
