'use client';

import React from 'react';
import {
  Box,
  Typography,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
} from '@mui/material';
import { CloseCircle } from 'iconsax-react';
import JsonView from '@uiw/react-json-view';
import dayjs from 'dayjs';

export default function DataLogPPOBDetailDialog({ open, onClose, log }) {
  if (!log) return null;

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
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 1,
          borderBottom: '1px solid #e5e7eb',
          fontWeight: 600,
        }}
      >
        Detail Data Log
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ color: 'text.secondary' }}
        >
          <CloseCircle size={20} color="currentColor" />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <Box>
          {/* Detail Data Log Section */}
          <Box sx={{ my: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                  Tanggal
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {dayjs(log.tanggal).format('YYYY-MM-DD HH:mm:ss')}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                  ID
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {log.id}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                  Event
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {log.event}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                  Tipe Transaksi
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {log.tipeTransaksi}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                  Status
                </Typography>
                <Chip
                  label={log.status}
                  size="small"
                  sx={{
                    bgcolor: log.status === 'Gagal' ? '#fee2e2' : '#d1fae5',
                    color: log.status === 'Gagal' ? '#991b1b' : '#065f46',
                    fontWeight: 500,
                    fontSize: '0.75rem',
                    height: 24,
                    border: 'none',
                  }}
                />
              </Box>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Response Detail Section */}
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
              RESPONSE DETAIL
            </Typography>
            <Box
              sx={{
                border: '1px solid #e5e7eb',
                borderRadius: 1,
                p: 2,
                maxHeight: 400,
                overflow: 'auto',
                backgroundColor: '#f9fafb',
              }}
            >
              <JsonView
                value={log.responseDetail}
                style={{
                  backgroundColor: 'transparent',
                  fontSize: '12px',
                }}
                collapsed={2}
              />
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, borderTop: '1px solid #e5e7eb' }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            backgroundColor: '#dc2626',
            '&:hover': {
              backgroundColor: '#b91c1c',
            },
          }}
        >
          Kembali
        </Button>
      </DialogActions>
    </Dialog>
  );
}
