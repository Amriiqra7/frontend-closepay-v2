'use client';

import React from 'react';
import { Box, Button, IconButton, Tooltip } from '@mui/material';
import { Add, Edit2, Trash } from 'iconsax-react';
import FnbDataTable from '../../common/FnbDataTable';
import { SectionTitle, SummaryMetric } from './parts';

const defaultColumns = [
  {
    accessorKey: 'name',
    header: 'Ingredient',
  },
  {
    accessorKey: 'id',
    header: 'Ingredient ID',
  },
  {
    accessorKey: 'qty',
    header: 'Quantity',
  },
  {
    accessorKey: 'unit',
    header: 'Unit',
  },
  {
    accessorKey: 'price',
    header: 'Line Item',
  },
];

function buildColumns(columns) {
  return columns.map((column) => ({
    ...column,
    Cell:
      column.Cell ??
      (({ row }) => (
        <Box
          component="span"
          sx={{
            color: '#111827',
            fontWeight: column.accessorKey === 'price' || column.accessorKey === 'qty' ? 700 : 600,
            fontSize: '0.92rem',
          }}
        >
          {row.original[column.accessorKey]}
        </Box>
      )),
  }));
}

function DefaultRowActions() {
  return (
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
  );
}

export default function RecipeIngredientsTable({
  title = 'Recipe & Bill Of Materials (BOM)',
  actionLabel = 'Add Ingredient',
  columns = defaultColumns,
  data = [],
  pageSizeOptions = [5, 10, 25],
  initialPageSize = 5,
  getRowId,
  renderRowActions,
  summaryMetrics = [
    { label: 'Total Recipe HPP', value: '$ 3.15' },
    { label: 'Markup (%)', value: '300' },
    { label: 'Base Sale Price', value: '$ 12.50', accent: true },
    { label: 'Profit per Unit', value: '$9.35', subtle: 'Strong positive margin' },
    { label: 'Gross Margin', value: '74.8%', subtle: 'Healthy menu profitability', dark: true },
  ],
}) {
  const tableColumns = React.useMemo(() => buildColumns(columns), [columns]);
  const firstRow = summaryMetrics.slice(0, 3);
  const secondRow = summaryMetrics.slice(3, 5);

  return (
    <Box>
      <SectionTitle
        title={title}
        action={
          <Button
            variant="outlined"
            startIcon={<Add size={16} color="#155DFC" variant="Linear" />}
            sx={{ borderColor: '#dbe3ec', color: '#155DFC', borderRadius: 2 }}
          >
            {actionLabel}
          </Button>
        }
      />

      <FnbDataTable
        columns={tableColumns}
        data={data}
        getRowId={getRowId}
        initialPageSize={initialPageSize}
        pageSizeOptions={pageSizeOptions}
        containerSx={{
          borderRadius: 2.5,
          overflow: 'hidden',
          border: '1px solid #edf1f5',
          bgcolor: '#fff',
        }}
        renderRowActions={renderRowActions ?? (() => <DefaultRowActions />)}
      />

      {firstRow.length > 0 ? (
        <Box sx={{ mt: 2.5, display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' }, gap: 2 }}>
          {firstRow.map((metric) => (
            <SummaryMetric
              key={metric.label}
              label={metric.label}
              value={metric.value}
              subtle={metric.subtle}
              dark={metric.dark}
              accent={metric.accent}
            />
          ))}
        </Box>
      ) : null}

      {secondRow.length > 0 ? (
        <Box sx={{ mt: 2, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
          {secondRow.map((metric) => (
            <SummaryMetric
              key={metric.label}
              label={metric.label}
              value={metric.value}
              subtle={metric.subtle}
              dark={metric.dark}
              accent={metric.accent}
            />
          ))}
        </Box>
      ) : null}
    </Box>
  );
}
