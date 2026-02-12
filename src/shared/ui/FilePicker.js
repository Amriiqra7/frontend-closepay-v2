'use client';

import React, { useId, useState, useRef } from 'react';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Paper,
} from '@mui/material';
import { Document, Image as ImageIcon, CloseCircle, ArrowUp2, DocumentUpload } from 'iconsax-react';

/**
 * FilePicker - Komponen global untuk memilih file dengan preview
 * 
 * @param {Object} props
 * @param {File|null} props.value - File yang dipilih
 * @param {Function} props.onChange - Callback ketika file berubah (file) => void
 * @param {string} props.accept - Accept attribute untuk input file (default: "*")
 * @param {string} props.label - Label untuk file picker
 * @param {boolean} props.required - Apakah field ini required
 * @param {boolean} props.error - Apakah ada error
 * @param {string} props.helperText - Text helper/error
 * @param {string} props.placeholder - Placeholder text untuk button
 * @param {Object} props.sx - Custom sx styles
 */
export default function FilePicker({
  value,
  onChange,
  accept = '*',
  label,
  required = false,
  error = false,
  helperText,
  placeholder = 'Klik untuk pilih file',
  sx = {},
}) {
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);
  const reactId = useId();
  const inputId = `file-picker-${reactId}`;
  const [hovered, setHovered] = useState(false);

  // Generate preview untuk gambar
  React.useEffect(() => {
    if (value && value instanceof File) {
      if (value.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(value);
      } else {
        setPreview(null);
      }
    } else {
      setPreview(null);
    }
  }, [value]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onChange(file);
    }
  };

  const openPicker = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileIcon = (file) => {
    if (!file) return null;

    const fileType = file.type;

    // Icon berdasarkan tipe file
    if (fileType.startsWith('image/')) {
      return <ImageIcon size={24} variant="Bold" color="currentColor" />;
    }

    // Default icon untuk file non-gambar
    return <Document size={24} variant="Bold" color="currentColor" />;
  };

  const getFileTypeColor = (file) => {
    if (!file) return 'primary.main';

    const fileType = file.type;
    if (fileType.startsWith('image/')) {
      return '#4caf50';
    }
    if (fileType.includes('pdf')) {
      return '#f44336';
    }
    if (fileType.includes('word') || fileType.includes('document')) {
      return '#2196f3';
    }
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) {
      return '#4caf50';
    }
    return 'primary.main';
  };

  const formatFileSize = (bytes) => {
    if (typeof bytes !== 'number') return '';
    if (bytes < 1024) return `${bytes} B`;
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(1)} MB`;
  };

  return (
    <Box sx={sx}>
      {label && (
        <Typography variant="body2" sx={{ mb: 0.5 }}>
          {label}
          {required && <span style={{ color: 'red' }}> *</span>}
        </Typography>
      )}

      <input
        ref={fileInputRef}
        accept={accept}
        style={{ display: 'none' }}
        id={inputId}
        type="file"
        onChange={handleFileChange}
      />

      {value ? (
        <Paper
          elevation={0}
          onClick={openPicker}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              openPicker();
            }
          }}
          sx={{
            cursor: 'pointer',
            overflow: 'hidden',
            border: '1px solid',
            borderColor: error ? 'error.main' : hovered ? 'primary.main' : 'divider',
            boxShadow: hovered ? '0 10px 30px rgba(0,0,0,0.06)' : 'none',
            bgcolor: 'background.paper',
          }}
        >
          <Box
            sx={{
              p: 2,
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: preview ? '160px 1fr' : '88px 1fr' },
              gap: 2,
              alignItems: 'center',
            }}
          >
            {/* Preview / Icon area */}
            {preview ? (
              <Box
                sx={{
                  width: '100%',
                  height: 120,
                  borderRadius: 2,
                  overflow: 'hidden',
                  border: '1px solid',
                  borderColor: 'divider',
                  position: 'relative',
                  bgcolor: 'action.hover',
                }}
              >
                <img
                  src={preview}
                  alt="Preview"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </Box>
            ) : (
              <Box
                sx={{
                  width: 72,
                  height: 72,
                  borderRadius: 2,
                  display: 'grid',
                  placeItems: 'center',
                  background: 'linear-gradient(135deg, rgba(38,38,38,0.06) 0%, rgba(38,38,38,0.02) 100%)',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Avatar
                  sx={{
                    width: 46,
                    height: 46,
                    bgcolor: getFileTypeColor(value),
                    color: 'white',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.10)',
                  }}
                >
                  {getFileIcon(value)}
                </Avatar>
              </Box>
            )}

            {/* Content */}
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 700,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  mb: 0.25,
                }}
              >
                {value.name}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                {formatFileSize(value.size)} • Klik untuk ganti file
              </Typography>

              <Box
                sx={{
                  mt: 1.25,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  flexWrap: 'wrap',
                }}
              >
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.75,
                    px: 1.25,
                    py: 0.6,
                    borderRadius: 999,
                    border: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'rgba(38,38,38,0.02)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: 'text.primary',
                  }}
                >
                  <DocumentUpload size={14} variant="Bold" color="currentColor" />
                  Ganti file
                </Box>
                <Box sx={{ flex: 1 }} />
                <IconButton
                  size="small"
                  onClick={handleRemove}
                  sx={{
                    color: 'error.main',
                    '&:hover': { bgcolor: 'error.light' },
                  }}
                  aria-label="Hapus file"
                >
                  <CloseCircle size={20} variant="Bold" color="currentColor" />
                </IconButton>
              </Box>
            </Box>
          </Box>
        </Paper>
      ) : (
        <Paper
          elevation={0}
          onClick={openPicker}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              openPicker();
            }
          }}
          sx={{
            cursor: 'pointer',
            borderRadius: 3,
            p: 2,
            border: '1px dashed',
            borderColor: error ? 'error.main' : hovered ? 'primary.main' : 'divider',
            bgcolor: hovered ? 'rgba(38,38,38,0.02)' : 'transparent',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                display: 'grid',
                placeItems: 'center',
                color: 'text.primary',
                background: 'linear-gradient(135deg, rgba(38,38,38,0.10) 0%, rgba(38,38,38,0.03) 100%)',
                border: '1px solid',
                borderColor: 'divider',
                flexShrink: 0,
              }}
            >
              <DocumentUpload size={22} variant="Bold" color="currentColor" />
            </Box>

            <Box sx={{ minWidth: 0 }}>
              <Typography variant="body2" sx={{ fontWeight: 800, mb: 0.25 }}>
                {placeholder}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                {accept && accept !== '*'
                  ? `Format: ${accept}`
                  : 'Pilih file dari perangkat kamu'}
              </Typography>
            </Box>
          </Box>
        </Paper>
      )}

      {helperText && (
        <Typography
          variant="caption"
          sx={{
            mt: 0.5,
            display: 'block',
            color: error ? 'error.main' : 'text.secondary',
          }}
        >
          {helperText}
        </Typography>
      )}
    </Box>
  );
}
