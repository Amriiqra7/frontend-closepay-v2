'use client';

import React from 'react';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { Add, Trash } from 'iconsax-react';
import { ingredients } from './data';
import SurfaceCard from '../common/SurfaceCard';
import { fnbTypography } from '../common/styles';

export default function IngredientsTableCard() {
  return (
    <SurfaceCard sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'center', mb: 2.5, flexWrap: 'wrap' }}>
        <Typography sx={fnbTypography.sectionTitle}>
          Daftar Bahan Baku
        </Typography>
        <Button
          variant="text"
          startIcon={<Add size={18} color="#0d4f63" variant="Bold" />}
          sx={{ color: '#0d4f63', fontWeight: 700 }}
        >
          Add Ingredient
        </Button>
      </Box>

      <TableContainer sx={{ borderRadius: 2.5, overflow: 'hidden', bgcolor: '#f5f7fa', p: 1 }}>
        <Table>
          <TableHead>
            <TableRow>
              {['ID', 'Name', 'Quantity', 'Unit', 'Action'].map((head) => (
                <TableCell
                  key={head}
                  sx={{
                    borderBottom: 'none',
                    color: '#6b7280',
                    fontWeight: 800,
                    fontSize: '0.72rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                  }}
                >
                  {head}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {ingredients.map((item) => (
              <TableRow key={item.id}>
                <TableCell sx={{ borderBottom: '6px solid #f5f7fa', bgcolor: '#fff', fontWeight: 700, fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                  {item.id}
                </TableCell>
                <TableCell sx={{ borderBottom: '6px solid #f5f7fa', bgcolor: '#fff', fontWeight: 600, minWidth: 150 }}>
                  {item.name}
                </TableCell>
                <TableCell sx={{ borderBottom: '6px solid #f5f7fa', bgcolor: '#fff', fontWeight: 700 }}>
                  {item.quantity}
                </TableCell>
                <TableCell sx={{ borderBottom: '6px solid #f5f7fa', bgcolor: '#fff', fontWeight: 600 }}>
                  {item.unit}
                </TableCell>
                <TableCell sx={{ borderBottom: '6px solid #f5f7fa', bgcolor: '#fff', width: 64 }}>
                  <Trash size={16} color="#6b7280" variant="Linear" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 2.5, p: 2, borderRadius: 1.5, bgcolor: '#ffd9bf', color: '#6f3512' }}>
        <Typography sx={{ fontSize: '0.94rem', fontStyle: 'italic', lineHeight: 1.5 }}>
          <Box component="span" sx={{ fontWeight: 800 }}>
            Note:
          </Box>{' '}
          Wagyu must be brought to room temperature 30 minutes prior to searing.
        </Typography>
      </Box>
    </SurfaceCard>
  );
}
