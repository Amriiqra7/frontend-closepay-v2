'use client';

import React from 'react';
import {
  Box,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { Box1, Edit2, Trash } from 'iconsax-react';
import { riceOptions } from './data';
import SurfaceCard from '../common/SurfaceCard';
import { fnbTypography } from '../common/styles';
import StatusChip from './StatusChip';

export default function RiceOptionsCard() {
  return (
    <SurfaceCard
      sx={{
        p: 3,
        height: '100%',
        borderRadius: 4,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'flex-start', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 58,
              height: 58,
              borderRadius: 3,
              bgcolor: '#d8e9fb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box1 size={28} color="#1d4f68" variant="Bold" />
          </Box>
          <Box>
            <Typography sx={{ color: '#111827', fontSize: { xs: '1.5rem', md: '1.7rem' }, fontWeight: 800 }}>
              Nasi (Rice Options)
            </Typography>
            <Typography sx={{ ...fnbTypography.sectionLabel, mt: 0.4, fontWeight: 700, letterSpacing: '0.08em' }}>
              Mandatory Selection - 1 Max
            </Typography>
          </Box>
        </Box>

        <Stack direction="row" spacing={0.5}>
          <Button variant="text" sx={{ minWidth: 34, width: 34, p: 0, color: '#6b7280' }}>
            <Box1 size={18} color="#6b7280" variant="Linear" />
          </Button>
          <Button variant="text" sx={{ minWidth: 34, width: 34, p: 0, color: '#6b7280' }}>
            <Edit2 size={18} color="#6b7280" variant="Linear" />
          </Button>
          <Button variant="text" sx={{ minWidth: 34, width: 34, p: 0, color: '#6b7280' }}>
            <Trash size={18} color="#6b7280" variant="Linear" />
          </Button>
        </Stack>
      </Box>

      <TableContainer sx={{ borderRadius: 2.5, overflow: 'hidden', bgcolor: '#f2f4f7', p: 1.25 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ borderBottom: 'none', color: '#6b7280', fontWeight: 800, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                Isi (Options)
              </TableCell>
              <TableCell sx={{ borderBottom: 'none', color: '#6b7280', fontWeight: 800, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                SKU Code
              </TableCell>
              <TableCell sx={{ borderBottom: 'none', color: '#6b7280', fontWeight: 800, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                Price Offset
              </TableCell>
              <TableCell sx={{ borderBottom: 'none', color: '#6b7280', fontWeight: 800, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                Availability
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {riceOptions.map((option) => (
              <TableRow key={option.sku}>
                <TableCell sx={{ borderBottom: '8px solid #f2f4f7', bgcolor: '#fff', fontSize: '0.98rem', fontWeight: 500 }}>
                  {option.name}
                </TableCell>
                <TableCell sx={{ borderBottom: '8px solid #f2f4f7', bgcolor: '#fff', color: '#6b7280', fontSize: '0.95rem' }}>
                  {option.sku}
                </TableCell>
                <TableCell sx={{ borderBottom: '8px solid #f2f4f7', bgcolor: '#fff', color: '#111827', fontSize: '0.98rem', fontWeight: 700 }}>
                  {option.price}
                </TableCell>
                <TableCell sx={{ borderBottom: '8px solid #f2f4f7', bgcolor: '#fff' }}>
                  <StatusChip label={option.status} tone={option.tone} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </SurfaceCard>
  );
}
