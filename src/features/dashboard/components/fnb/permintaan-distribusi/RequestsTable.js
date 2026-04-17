'use client';

import React from 'react';
import { Box, Button, Chip, IconButton, Tooltip, Typography } from '@mui/material';
import { DocumentText1, Edit, InfoCircle, TickCircle, Trash } from 'iconsax-react';
import FnbDataTable from '../common/FnbDataTable';
import SurfaceCard from '../common/SurfaceCard';
import { requests } from './data';

function StatusChip({ label, tone }) {
  const palette =
    tone === 'danger'
      ? { bg: '#ffe0dc', color: '#d92d20' }
      : tone === 'warning'
        ? { bg: '#ffe7c2', color: '#8a4b08' }
        : tone === 'muted'
          ? { bg: '#dbeafe', color: '#64748b' }
          : tone === 'neutral'
            ? { bg: '#eef2f6', color: '#6b7280' }
            : { bg: '#b9e5fb', color: '#155DFC' };

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

function ActionCell({ type }) {
  if (type === 'track') {
    return (
      <Button variant="contained" sx={{ height: 34, borderRadius: 1.5, bgcolor: '#f3f4f6', color: '#111827', boxShadow: 'none', '&:hover': { bgcolor: '#eceff3', boxShadow: 'none' } }}>
        Track Order
      </Button>
    );
  }

  if (type === 'reorder') {
    return (
      <Button variant="outlined" sx={{ height: 34, borderRadius: 1.5, borderColor: '#d1d5db', color: '#6b7280' }}>
        Re-order
      </Button>
    );
  }

  if (type === 'done') {
    return <Typography sx={{ color: '#6b7280', fontSize: '0.8rem' }}>Completed Oct 12</Typography>;
  }

  return (
    <Box display="flex" gap={0.5} sx={{ justifyContent: 'flex-start', alignItems: 'center' }}>
      <Tooltip title="Terima" arrow>
        <IconButton size="small" sx={{ color: '#2e7d32', '&:hover': { bgcolor: 'rgba(46, 125, 50, 0.08)' } }}>
          <TickCircle size={18} variant="Linear" color="#2e7d32" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Edit" arrow>
        <IconButton size="small" sx={{ color: '#ed6c02', '&:hover': { bgcolor: 'rgba(237, 108, 2, 0.08)' } }}>
          <Edit size={18} variant="Linear" color="#ed6c02" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Hapus" arrow>
        <IconButton size="small" sx={{ color: '#d32f2f', '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.08)' } }}>
          <Trash size={18} variant="Linear" color="#d32f2f" />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

export default function RequestsTable() {
  const columns = [
    {
      accessorKey: 'outlet',
      header: 'Outlet Details',
      Cell: ({ row }) => (
        <Box>
          <Typography sx={{ color: '#0d3d5d', fontSize: '1rem', fontWeight: 800 }}>
            {row.original.outlet}
          </Typography>
          <Typography sx={{ mt: 0.35, color: '#6b7280', fontSize: '0.85rem' }}>
            {row.original.city}
          </Typography>
        </Box>
      ),
    },
    {
      accessorKey: 'fulfillmentPoint',
      header: 'Fulfillment Point',
      Cell: ({ row }) => (
        <Typography sx={{ color: '#111827', fontSize: '0.98rem', fontWeight: 700 }}>
          {row.original.fulfillmentPoint}
        </Typography>
      ),
    },
    {
      accessorKey: 'requestList',
      header: 'Request List',
      enableSorting: false,
      Cell: ({ row }) => (
        <Box>
          {row.original.requestList.map((item) => (
            <Typography key={item} sx={{ color: item.startsWith('+') ? '#155DFC' : '#111827', fontSize: '0.9rem', fontWeight: item.startsWith('+') ? 700 : 500, lineHeight: 1.6 }}>
              {item}
            </Typography>
          ))}
        </Box>
      ),
    },
    {
      accessorKey: 'invoice',
      header: 'Invoice',
      Cell: ({ row }) =>
        row.original.invoice === 'doc' ? (
          <Box sx={{ width: 38, height: 38, borderRadius: 1.5, bgcolor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DocumentText1 size={18} color="#111827" variant="Bold" />
          </Box>
        ) : (
          <Typography sx={{ color: '#9ca3af', fontSize: '0.88rem', fontStyle: 'italic' }}>N/A</Typography>
        ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      Cell: ({ row }) => <StatusChip label={row.original.status} tone={row.original.statusTone} />,
    },
  ];

  return (
    <SurfaceCard sx={{ p: 0, overflow: 'hidden' }}>
      <Box sx={{ px: 2.5, py: 2.25, display: 'flex', justifyContent: 'space-between', gap: 1.5, alignItems: 'center', borderBottom: '1px solid #edf1f5', flexWrap: 'wrap' }}>
        <Typography sx={{ color: '#111827', fontSize: '1.1rem', fontWeight: 800 }}>
          Manajemen Permintaan
        </Typography>
      </Box>

      <FnbDataTable
        columns={columns}
        data={requests}
        getRowId={(row) => row.outlet}
        initialPageSize={5}
        renderRowActions={({ row }) =>
          row.original.actions === 'info' ? (
            <Tooltip title="Info" arrow>
              <IconButton size="small" sx={{ color: '#6b7280', '&:hover': { bgcolor: 'rgba(107,114,128,0.08)' } }}>
                <InfoCircle size={18} variant="Linear" color="#6b7280" />
              </IconButton>
            </Tooltip>
          ) : (
            <ActionCell type={row.original.actions} />
          )
        }
      />
    </SurfaceCard>
  );
}
