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

const formatDescriptions = [
  {
    number: 1,
    name: 'Text',
    description: 'Kolom akan menerima inputan sebagai text saja',
  },
  {
    number: 2,
    name: 'Datetime',
    description: 'Kolom akan menerima inputan berupa tanggal dan waktu (format: yyyy-mm-dd hh:mm:ss)',
  },
  {
    number: 3,
    name: 'Date',
    description: 'Kolom akan menerima inputan berupa tanggal (format: yyyy-mm-dd)',
  },
  {
    number: 4,
    name: 'Time',
    description: 'Kolom akan menerima inputan berupa waktu (format : hh:mm:ss)',
  },
  {
    number: 5,
    name: 'Email',
    description: 'Kolom akan memvalidasi inputan agar sesuai dengan format email (misal xxxxxx@gmail.com)',
  },
  {
    number: 6,
    name: 'Phone',
    description: 'Kolom akan memvalidasi inputan agar sesuai dengan format nomor telepon',
  },
  {
    number: 7,
    name: 'Integer',
    description: 'Kolom akan menerima inputan berupa angka (contoh: 12)',
  },
  {
    number: 8,
    name: 'Numeric',
    description: 'Kolom akan menerima inpuran berupa text panjang yang hanya berisi angka. (contoh: untuk NIK, nomor ID yang panjang)',
  },
  {
    number: 9,
    name: 'Enum',
    description: 'Kolom akan menerima inputan pilihan berdasarkan apa yang telah diatur (user hanya bisa memilih satu dari pilihan yang tersedia)',
  },
  {
    number: 10,
    name: 'Flags',
    description: 'Kolom akan menerima inputan pilihan berdasarkan apa yang telah diatur (user bisa memilih lebih dari satu pilihan yang tersedia)',
  },
];

export default function FormatKolomDialog({ open, onClose, onUnderstand }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
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
            bgcolor: '#f0f9ff',
          }}
        >
          Format Kolom
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
        <List sx={{ p: 0 }}>
          {formatDescriptions.map((format, index) => (
            <ListItem
              key={format.number}
              sx={{
                px: 0,
                py: 2,
                borderBottom: index < formatDescriptions.length - 1 ? '1px solid #e5e7eb' : 'none',
              }}
            >
              <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 600,
                    color: '#111827',
                    minWidth: '40px',
                    fontSize: '0.875rem',
                  }}
                >
                  {format.number}.
                </Typography>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 600,
                      color: '#059669',
                      mb: 0.5,
                      fontSize: '0.875rem',
                    }}
                  >
                    {format.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#6b7280',
                      fontSize: '0.875rem',
                      lineHeight: 1.6,
                    }}
                  >
                    {format.description}
                  </Typography>
                </Box>
              </Box>
            </ListItem>
          ))}
        </List>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 2, borderTop: '1px solid #e5e7eb' }}>
        <Button
          onClick={onUnderstand}
          variant="contained"
          sx={{
            textTransform: 'none',
            bgcolor: '#1976d2',
            '&:hover': {
              bgcolor: '#1565c0',
            },
          }}
        >
          Saya Mengerti
        </Button>
      </DialogActions>
    </Dialog>
  );
}
