'use client';

import React from 'react';
import { Box, Chip, Typography } from '@mui/material';
import FnbDataTable from '../common/FnbDataTable';
import SurfaceCard from '../common/SurfaceCard';
import { activityLogs } from './data';

function TypeChip({ label, tone }) {
  const palette =
    tone === 'danger'
      ? { bg: '#ffe0dc', color: '#d92d20' }
      : tone === 'neutral'
        ? { bg: '#eef2f6', color: '#6b7280' }
        : { bg: '#b9e5fb', color: '#0d4f63' };

  return (
    <Chip
      label={label.toUpperCase()}
      size="small"
      sx={{
        height: 22,
        bgcolor: palette.bg,
        color: palette.color,
        fontWeight: 800,
        fontSize: '0.62rem',
        borderRadius: 999,
      }}
    />
  );
}

export default function ActivityLogTable() {
  const columns = [
    {
      accessorKey: 'type',
      header: 'Jenis Aktivitas',
      Cell: ({ row }) => <TypeChip label={row.original.type} tone={row.original.tone} />,
    },
    {
      accessorKey: 'item',
      header: 'Item ID / Name',
      Cell: ({ row }) => (
        <Typography sx={{ color: '#111827', fontSize: '0.86rem', fontWeight: 700 }}>
          {row.original.item}
        </Typography>
      ),
    },
    {
      accessorKey: 'location',
      header: 'Warehouse & Loc',
      Cell: ({ row }) => (
        <Box>
          <Typography sx={{ color: '#111827', fontSize: '0.85rem', fontWeight: 700 }}>
            {row.original.location}
          </Typography>
          <Typography sx={{ mt: 0.3, color: '#9aa5b1', fontSize: '0.72rem' }}>
            {row.original.locationMeta}
          </Typography>
        </Box>
      ),
    },
    {
      accessorKey: 'description',
      header: 'Description',
      enableSorting: false,
      Cell: ({ row }) => (
        <Typography sx={{ color: '#4b5563', fontSize: '0.82rem', lineHeight: 1.55 }}>
          {row.original.description}
        </Typography>
      ),
    },
  ];

  return (
    <SurfaceCard sx={{ p: 0, overflow: 'hidden' }}>
      <Box sx={{ px: 2.5, py: 2, display: 'flex', justifyContent: 'space-between', gap: 1.5, alignItems: 'center', borderBottom: '1px solid #edf1f5', flexWrap: 'wrap' }}>
        <Typography sx={{ color: '#111827', fontSize: '1rem', fontWeight: 800 }}>
          Activity Logs
        </Typography>
        <Typography sx={{ color: '#6b7280', fontSize: '0.8rem', fontWeight: 700 }}>
          All Types
        </Typography>
      </Box>

      <FnbDataTable
        columns={columns}
        data={activityLogs}
        getRowId={(row) => `${row.type}-${row.item}`}
        initialPageSize={5}
      />
    </SurfaceCard>
  );
}
