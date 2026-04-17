'use client';

import React from 'react';
import {
  Box,
  Button,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import { Add, Edit2, Trash } from 'iconsax-react';
import FnbDataTable from '../common/FnbDataTable';
import { ingredients } from './data';
import SurfaceCard from '../common/SurfaceCard';
import { fnbTypography } from '../common/styles';

export default function IngredientsTableCard() {
  const columns = [
    {
      accessorKey: 'id',
      header: 'ID',
      Cell: ({ row }) => (
        <Typography sx={{ color: '#111827', fontWeight: 700, fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
          {row.original.id}
        </Typography>
      ),
    },
    {
      accessorKey: 'name',
      header: 'Name',
      Cell: ({ row }) => (
        <Typography sx={{ color: '#111827', fontWeight: 600, fontSize: '0.94rem' }}>
          {row.original.name}
        </Typography>
      ),
    },
    {
      accessorKey: 'quantity',
      header: 'Quantity',
      Cell: ({ row }) => (
        <Typography sx={{ color: '#111827', fontWeight: 700, fontSize: '0.92rem' }}>
          {row.original.quantity}
        </Typography>
      ),
    },
    {
      accessorKey: 'unit',
      header: 'Unit',
      Cell: ({ row }) => (
        <Typography sx={{ color: '#4b5563', fontWeight: 600, fontSize: '0.92rem' }}>
          {row.original.unit}
        </Typography>
      ),
    },
  ];

  return (
    <SurfaceCard sx={{ p: 3, minWidth: 0 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'center', mb: 2.5, flexWrap: 'wrap' }}>
        <Typography sx={fnbTypography.sectionTitle}>
          Daftar Bahan Baku
        </Typography>
        <Button
          variant="text"
          startIcon={<Add size={18} color="#155DFC" variant="Bold" />}
          sx={{ color: '#155DFC', fontWeight: 700 }}
        >
          Add Ingredient
        </Button>
      </Box>

      <FnbDataTable
        columns={columns}
        data={ingredients}
        getRowId={(row) => row.id}
        initialPageSize={5}
        pageSizeOptions={[5, 10, 25]}
        containerSx={{
          borderRadius: 2.5,
          overflowX: 'auto',
          overflowY: 'hidden',
          border: '1px solid #edf1f5',
          bgcolor: '#fff',
          maxWidth: '100%',
        }}
        renderRowActions={() => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Tooltip title="Edit" arrow>
              <IconButton size="small" sx={{ color: '#ed6c02', '&:hover': { bgcolor: 'rgba(237, 108, 2, 0.08)' } }}>
                <Edit2 size={18} color="#ed6c02" variant="Linear" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Hapus" arrow>
              <IconButton size="small" sx={{ color: '#d32f2f', '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.08)' } }}>
                <Trash size={18} color="#d32f2f" variant="Linear" />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      />

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
