import React from 'react';
import { Typography } from '@mui/material';

const baseCellSx = {
  color: '#111827',
  fontSize: '0.92rem',
};

export function createIngredientColumns(overrides = {}) {
  const defaultColumns = [
    {
      accessorKey: 'name',
      header: 'Ingredient',
      Cell: ({ row }) => (
        <Typography sx={{ ...baseCellSx, fontWeight: 600 }}>
          {row.original.name}
        </Typography>
      ),
    },
    {
      accessorKey: 'id',
      header: 'Ingredient ID',
      Cell: ({ row }) => (
        <Typography sx={{ color: '#6b7280', fontSize: '0.9rem' }}>
          {row.original.id}
        </Typography>
      ),
    },
    {
      accessorKey: 'qty',
      header: 'Quantity',
      Cell: ({ row }) => (
        <Typography sx={{ ...baseCellSx, fontWeight: 600 }}>
          {row.original.qty}
        </Typography>
      ),
    },
    {
      accessorKey: 'unit',
      header: 'Unit',
      Cell: ({ row }) => (
        <Typography sx={{ color: '#4b5563', fontSize: '0.9rem' }}>
          {row.original.unit}
        </Typography>
      ),
    },
    {
      accessorKey: 'price',
      header: 'Line Item',
      Cell: ({ row }) => (
        <Typography sx={{ ...baseCellSx, fontWeight: 700 }}>
          {row.original.price}
        </Typography>
      ),
    },
  ];

  const mergedColumns = defaultColumns.map((column) => {
    const override = overrides[column.accessorKey] || {};
    return {
      ...column,
      ...override,
      Cell: override.Cell ?? column.Cell,
    };
  });

  return mergedColumns;
}

export default createIngredientColumns;
