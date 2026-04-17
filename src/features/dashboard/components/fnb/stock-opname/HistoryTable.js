'use client';

import React from 'react';
import { Box, Chip, IconButton, Tooltip, Typography } from '@mui/material';
import { DocumentDownload, Edit2, Eye } from 'iconsax-react';
import FnbDataTable from '../common/FnbDataTable';
import SurfaceCard from '../common/SurfaceCard';
import ActionButton from '../add-ons-toppings/ActionButton';
import FnbFilterCollapse from '../common/FnbFilterCollapse';
import { stockOpnameHistory } from './data';

function StatusChip({ label, tone }) {
  const palette =
    tone === 'warning'
      ? { bg: '#fde4d7', color: '#b54708' }
      : { bg: '#d7eefb', color: '#155DFC' };

  return (
    <Chip
      label={label.toUpperCase()}
      size="small"
      sx={{
        height: 28,
        bgcolor: palette.bg,
        color: palette.color,
        borderRadius: 999,
        fontSize: '0.68rem',
        fontWeight: 800,
      }}
    />
  );
}

export default function HistoryTable() {
  const columns = [
    {
      accessorKey: 'date',
      header: 'Date',
      Cell: ({ row }) => (
        <Box>
          <Typography sx={{ color: '#111827', fontSize: '0.98rem', fontWeight: 800 }}>
            {row.original.date}
          </Typography>
          <Typography sx={{ mt: 0.35, color: '#6b7280', fontSize: '0.84rem' }}>
            {row.original.time}
          </Typography>
        </Box>
      ),
    },
    {
      accessorKey: 'itemName',
      header: 'Item Details',
      enableSorting: false,
      Cell: ({ row }) => {
        const Icon = row.original.icon;

        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: 1.75,
                bgcolor: '#eef2f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Icon size={18} color="#155DFC" variant="Bold" />
            </Box>
            <Box>
              <Typography sx={{ color: '#111827', fontSize: '0.98rem', fontWeight: 700 }}>
                {row.original.itemName}
              </Typography>
              <Typography sx={{ mt: 0.3, color: '#6b7280', fontSize: '0.83rem' }}>
                {row.original.itemCode}
              </Typography>
            </Box>
          </Box>
        );
      },
    },
    {
      accessorKey: 'qty',
      header: 'Qty',
      Cell: ({ row }) => (
        <Box>
          <Typography sx={{ color: '#0d3d5d', fontSize: '1rem', fontWeight: 800 }}>
            {row.original.qty}
          </Typography>
          <Typography sx={{ color: '#6b7280', fontSize: '0.84rem' }}>
            {row.original.unit}
          </Typography>
        </Box>
      ),
    },
    {
      accessorKey: 'unitPrice',
      header: 'Unit Price',
      Cell: ({ row }) => (
        <Typography sx={{ color: '#111827', fontSize: '0.98rem', fontWeight: 700 }}>
          {row.original.unitPrice}
        </Typography>
      ),
    },
    {
      accessorKey: 'expiry',
      header: 'Expiry',
      Cell: ({ row }) => (
        <Typography
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            px: 1.2,
            py: 0.6,
            borderRadius: 1,
            bgcolor: row.original.expiry === 'Expired' ? '#fde2e0' : '#eef2f6',
            color: row.original.expiry === 'Expired' ? '#d92d20' : '#374151',
            fontSize: '0.88rem',
          }}
        >
          {row.original.expiry}
        </Typography>
      ),
    },
    {
      accessorKey: 'description',
      header: 'Description',
      Cell: ({ row }) => (
        <Typography sx={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: 1.5 }}>
          {row.original.description}
        </Typography>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      Cell: ({ row }) => <StatusChip label={row.original.status} tone={row.original.tone} />,
    },
  ];

  return (
    <SurfaceCard sx={{ p: 0, overflow: 'hidden', mb: 2 }}>
      <Box
        sx={{
          px: { xs: 2.25, md: 3.25 },
          py: 2.75,
          display: 'flex',
          justifyContent: 'space-between',
          gap: 2,
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          borderBottom: '1px solid #edf1f5',
        }}
      >
        <Box>
          <Typography sx={{ color: '#111827', fontSize: { xs: '1.45rem', md: '1.75rem' }, fontWeight: 800 }}>
            History of Stock Opname
          </Typography>
          <Typography sx={{ mt: 0.75, color: '#6b7280', fontSize: '0.98rem' }}>
            Detailed log of previous physical counts and adjustments.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.25, flexWrap: 'wrap' }}>
          <FnbFilterCollapse buttonText="Filter" searchPlaceholder="Item or SKU..." />
          <ActionButton icon={<DocumentDownload size={18} color="#111827" variant="Linear" />}>
            Export
          </ActionButton>
        </Box>
      </Box>

      <FnbDataTable
        columns={columns}
        data={stockOpnameHistory}
        getRowId={(row) => row.id}
        initialPageSize={5}
        pageSizeOptions={[5, 10, 25]}
        containerSx={{ bgcolor: '#fff' }}
        renderRowActions={() => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Tooltip title="Detail" arrow>
              <IconButton size="small" sx={{ color: '#155DFC', '&:hover': { bgcolor: 'rgba(13,79,99,0.08)' } }}>
                <Eye size={18} color="#155DFC" variant="Linear" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit" arrow>
              <IconButton size="small" sx={{ color: '#ed6c02', '&:hover': { bgcolor: 'rgba(237,108,2,0.08)' } }}>
                <Edit2 size={18} color="#ed6c02" variant="Linear" />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      />
    </SurfaceCard>
  );
}
