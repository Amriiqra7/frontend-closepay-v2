'use client';

import React from 'react';
import {
  Box,
  Typography,
  Button,
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
} from '@mui/material';
import { Add, Trash, ArrowUp2 } from 'iconsax-react';
import { formatRupiah } from '@/shared/utils/format';

const formatNilai = (tipe, nilai) => {
  if (tipe === 'NOMINAL') {
    return `Rp ${formatRupiah(nilai)}`;
  }
  return nilai;
};

export default function PaymentFeesSection({
  activeTab,
  paymentFees,
  paymentFeesExpanded,
  onToggle,
  onAdd,
  onDelete,
}) {
  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
          cursor: 'pointer',
        }}
        onClick={onToggle}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="subtitle2" fontWeight={600} sx={{ fontSize: '0.875rem' }}>
            Biaya Pembayaran
          </Typography>
          <ArrowUp2
            size={16}
            color="currentColor"
            style={{
              transform: paymentFeesExpanded ? 'rotate(0deg)' : 'rotate(180deg)',
              transition: 'transform 0.2s',
            }}
          />
        </Box>
        {paymentFeesExpanded && (
          <Button
            variant="contained"
            startIcon={<Add size={18} color="currentColor" />}
            onClick={(e) => {
              e.stopPropagation();
              onAdd();
            }}
            sx={{
              textTransform: 'none',
              bgcolor: '#155DFC',
              px: 2,
              py: 0.75,
              fontSize: '0.875rem',
              '&:hover': {
                bgcolor: '#0f4fc7',
              },
            }}
          >
            Tambah Data
          </Button>
        )}
      </Box>

      <Collapse in={paymentFeesExpanded}>
        <Box sx={{ mb: 3 }}>
          <Table sx={{ border: '1px solid', borderColor: 'rgba(0, 0, 0, 0.08)', borderRadius: 1 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontSize: '0.875rem', fontWeight: 600, py: 1.5 }}>No</TableCell>
                <TableCell sx={{ fontSize: '0.875rem', fontWeight: 600, py: 1.5 }}>Deskripsi</TableCell>
                <TableCell sx={{ fontSize: '0.875rem', fontWeight: 600, py: 1.5 }}>Tipe</TableCell>
                <TableCell sx={{ fontSize: '0.875rem', fontWeight: 600, py: 1.5 }}>Nilai</TableCell>
                <TableCell sx={{ fontSize: '0.875rem', fontWeight: 600, py: 1.5 }}>Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paymentFees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3, color: 'text.secondary', fontSize: '0.875rem' }}>
                    Belum ada data
                  </TableCell>
                </TableRow>
              ) : (
                paymentFees.map((fee, index) => (
                  <TableRow key={fee.id}>
                    <TableCell sx={{ fontSize: '0.875rem', py: 1.5 }}>{index + 1}</TableCell>
                    <TableCell sx={{ fontSize: '0.875rem', py: 1.5 }}>{fee.deskripsi || '-'}</TableCell>
                    <TableCell sx={{ fontSize: '0.875rem', py: 1.5 }}>{fee.tipe}</TableCell>
                    <TableCell sx={{ fontSize: '0.875rem', py: 1.5 }}>
                      {formatNilai(fee.tipe, fee.nilai)}
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.875rem', py: 1.5 }}>
                      <IconButton
                        size="small"
                        onClick={() => onDelete(fee.id)}
                        sx={{
                          color: 'error.main',
                          '&:hover': {
                            bgcolor: 'error.lighter',
                          },
                        }}
                      >
                        <Trash size={18} color="currentColor" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Box>
      </Collapse>

      {/* Catatan - hanya untuk VA */}
      {activeTab === 'va' && (
        <Box
          sx={{
            p: 2,
            border: '1px solid',
            borderColor: 'error.main',
            borderRadius: 1,
            bgcolor: 'rgba(211, 47, 47, 0.05)',
            mt: paymentFeesExpanded ? 0 : 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontSize: '0.875rem',
              color: 'error.main',
              '& strong': {
                fontWeight: 600,
              },
            }}
          >
            <strong>Catatan:</strong> Untuk VA bertipe open virtual account, total nominal transaksi akan mengikuti total yang diterima dari <strong>callback</strong> yang diterima. Selain itu, total nominal transaksi akan <strong>ditambahkan dengan charge</strong> yang telah di atur.
          </Typography>
        </Box>
      )}
    </Box>
  );
}
