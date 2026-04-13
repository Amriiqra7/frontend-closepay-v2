'use client';

import React from 'react';
import { Box, Chip, IconButton, Tooltip, Typography } from '@mui/material';
import { DocumentText1, Edit, More, Trash } from 'iconsax-react';
import FnbDataTable from '../common/FnbDataTable';
import SurfaceCard from '../common/SurfaceCard';
import { stockRows } from './data';

function StatusPill({ label, tone }) {
  const palette =
    tone === 'danger'
      ? { bg: '#ffe0dc', color: '#d92d20' }
      : tone === 'warning'
        ? { bg: '#ffe7c2', color: '#8a4b08' }
        : { bg: '#b9e5fb', color: '#0d4f63' };

  return (
    <Chip
      label={label.toUpperCase()}
      size="small"
      sx={{
        height: 24,
        bgcolor: palette.bg,
        color: palette.color,
        fontWeight: 800,
        fontSize: '0.64rem',
        borderRadius: 999,
      }}
    />
  );
}

export default function InventoryTable() {
  const columns = [
    {
      accessorKey: 'warehouse',
      header: 'Warehouse',
      Cell: ({ row }) => (
        <Typography sx={{ color: '#111827', fontSize: '0.92rem', fontWeight: 700 }}>
          {row.original.warehouse}
        </Typography>
      ),
    },
    {
      accessorKey: 'itemId',
      header: 'Item ID',
      Cell: ({ row }) => (
        <Typography sx={{ color: '#6b7280', fontSize: '0.8rem', fontWeight: 700 }}>
          {row.original.itemId}
        </Typography>
      ),
    },
    {
      accessorKey: 'itemName',
      header: 'Item Name',
      Cell: ({ row }) => (
        <Box>
          <Typography sx={{ color: '#111827', fontSize: '0.92rem', fontWeight: 700 }}>
            {row.original.itemName}
          </Typography>
          <Typography sx={{ mt: 0.35, color: '#9ca3af', fontSize: '0.72rem' }}>
            {row.original.meta}
          </Typography>
        </Box>
      ),
    },
    {
      accessorKey: 'qty',
      header: 'Qty / Unit',
      enableSorting: false,
      Cell: ({ row }) => (
        <Box>
          <Typography sx={{ color: '#111827', fontSize: '0.92rem', fontWeight: 700 }}>
            {row.original.qty}
          </Typography>
          <Typography sx={{ mt: 0.25, color: '#9ca3af', fontSize: '0.72rem' }}>
            {row.original.unit}
          </Typography>
        </Box>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      Cell: ({ row }) => <StatusPill label={row.original.status} tone={row.original.statusTone} />,
    },
    {
      accessorKey: 'price',
      header: 'Latest Price',
      Cell: ({ row }) => (
        <Typography sx={{ color: '#374151', fontSize: '0.88rem', fontWeight: 700 }}>
          {row.original.price}
        </Typography>
      ),
    },
    {
      accessorKey: 'expiry',
      header: 'Expiry',
      Cell: ({ row }) => (
        <Typography
          sx={{
            color: row.original.statusTone === 'danger' ? '#d92d20' : '#6b7280',
            fontSize: '0.82rem',
            fontWeight: row.original.statusTone === 'danger' ? 800 : 600,
          }}
        >
          {row.original.expiry}
        </Typography>
      ),
    },
  ];

  return (
    <SurfaceCard sx={{ p: 0, overflow: 'hidden', mb: 2 }}>
      <FnbDataTable
        columns={columns}
        data={stockRows}
        getRowId={(row) => row.itemId}
        initialPageSize={10}
        pageSizeOptions={[10, 25, 50, 100]}
        renderRowActions={({ row }) => (
          <Box display="flex" gap={0.5} sx={{ justifyContent: 'flex-start', alignItems: 'center' }}>
            <Tooltip title="Dokumen" arrow>
              <IconButton size="small" sx={{ color: '#0d4f63', '&:hover': { bgcolor: 'rgba(13, 79, 99, 0.08)' } }}>
                <DocumentText1 size={18} variant="Linear" color="#0d4f63" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit" arrow>
              <IconButton size="small" sx={{ color: '#ed6c02', '&:hover': { bgcolor: 'rgba(237, 108, 2, 0.08)' } }}>
                <Edit size={18} variant="Linear" color="#ed6c02" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Lainnya" arrow>
              <IconButton size="small" sx={{ color: '#6b7280', '&:hover': { bgcolor: 'rgba(107, 114, 128, 0.08)' } }}>
                <More size={18} variant="Bold" color="#6b7280" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Hapus" arrow>
              <IconButton size="small" sx={{ color: '#d32f2f', '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.08)' } }}>
                <Trash size={18} variant="Linear" color="#d32f2f" />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      />
    </SurfaceCard>
  );
}
