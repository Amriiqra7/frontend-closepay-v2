'use client';

import React from 'react';
import {
  Box,
  Button,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { Box1, Edit2, Trash } from 'iconsax-react';
import { riceOptions } from './data';
import FnbDataTable from '../common/FnbDataTable';
import SurfaceCard from '../common/SurfaceCard';
import { fnbTypography } from '../common/styles';
import StatusChip from './StatusChip';

export default function RiceOptionsCard() {
  const columns = [
    {
      accessorKey: 'name',
      header: 'Isi (Options)',
      Cell: ({ row }) => (
        <Typography sx={{ color: '#111827', fontSize: '0.96rem', fontWeight: 600 }}>
          {row.original.name}
        </Typography>
      ),
    },
    {
      accessorKey: 'sku',
      header: 'SKU Code',
      Cell: ({ row }) => (
        <Typography sx={{ color: '#6b7280', fontSize: '0.92rem' }}>
          {row.original.sku}
        </Typography>
      ),
    },
    {
      accessorKey: 'price',
      header: 'Price Offset',
      Cell: ({ row }) => (
        <Typography sx={{ color: '#111827', fontSize: '0.96rem', fontWeight: 700 }}>
          {row.original.price}
        </Typography>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Availability',
      Cell: ({ row }) => <StatusChip label={row.original.status} tone={row.original.tone} />,
    },
  ];

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

      <FnbDataTable
        columns={columns}
        data={riceOptions}
        getRowId={(row) => row.sku}
        initialPageSize={5}
        pageSizeOptions={[5, 10, 25]}
        containerSx={{
          borderRadius: 2.5,
          overflow: 'hidden',
          border: '1px solid #edf1f5',
          bgcolor: '#fff',
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
    </SurfaceCard>
  );
}
