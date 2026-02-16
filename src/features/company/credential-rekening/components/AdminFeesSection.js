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
  Divider,
} from '@mui/material';
import { Add, Trash, ArrowUp2 } from 'iconsax-react';
import { formatRupiah } from '@/shared/utils/format';

const formatNilai = (tipe, nilai) => {
  if (tipe === 'NOMINAL') {
    return `Rp ${formatRupiah(nilai)}`;
  }
  return nilai;
};

export default function AdminFeesSection({
  adminFeesExpanded,
  inhouseFees,
  interbankFees,
  onToggle,
  onAdd,
  onDelete,
}) {
  return (
    <Box>
      <Divider sx={{ my: 3 }} />
      
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
            Biaya Admin dan Lainnya
          </Typography>
          <ArrowUp2
            size={16}
            color="currentColor"
            style={{
              transform: adminFeesExpanded ? 'rotate(0deg)' : 'rotate(180deg)',
              transition: 'transform 0.2s',
            }}
          />
        </Box>
      </Box>

      <Collapse in={adminFeesExpanded}>
        {/* Biaya Admin Transfer Sesama (Inhouse) */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, fontSize: '0.875rem' }}>
            Biaya Admin Transfer Sesama (Inhouse)
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '0.875rem' }}>
            Biaya admin akan dibebankan kepada user yang melakukan transaksi transfer ke rekening dalam bank yang sama (sesama bank).
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button
              variant="contained"
              startIcon={<Add size={18} color="currentColor" />}
              onClick={() => onAdd('inhouse')}
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
          </Box>
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
              {inhouseFees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3, color: 'text.secondary', fontSize: '0.875rem' }}>
                    No records to display
                  </TableCell>
                </TableRow>
              ) : (
                inhouseFees.map((fee, index) => (
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
                        onClick={() => onDelete(fee.id, 'inhouse')}
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

        {/* Biaya Admin Transfer Antar Bank (Interbank) */}
        <Box>
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, fontSize: '0.875rem' }}>
            Biaya Admin Transfer Antar Bank (Interbank)
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '0.875rem' }}>
            Biaya admin akan dibebankan kepada user yang melakukan transaksi transfer ke bank yang berbeda (antar bank).
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button
              variant="contained"
              startIcon={<Add size={18} color="currentColor" />}
              onClick={() => onAdd('interbank')}
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
          </Box>
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
              {interbankFees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3, color: 'text.secondary', fontSize: '0.875rem' }}>
                    No records to display
                  </TableCell>
                </TableRow>
              ) : (
                interbankFees.map((fee, index) => (
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
                        onClick={() => onDelete(fee.id, 'interbank')}
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
    </Box>
  );
}
