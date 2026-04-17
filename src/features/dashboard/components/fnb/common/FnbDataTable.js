'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import TablePagination from '@/shared/ui/TablePagination';

export default function FnbDataTable({
  columns,
  data,
  getRowId,
  renderRowActions,
  pageSizeOptions = [5, 10, 25, 50],
  initialPageSize = 5,
  emptyText = 'No data available',
  containerSx,
}) {
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: initialPageSize,
  });
  const [sorting, setSorting] = React.useState([]);

  const numberedColumns = React.useMemo(
    () => [
      {
        id: 'rowNumber',
        header: 'No',
        enableSorting: false,
        size: 72,
        Cell: ({ row }) => (
          <Typography sx={{ color: '#111827', fontSize: '0.88rem', fontWeight: 700 }}>
            {pagination.pageIndex * pagination.pageSize + row.index + 1}
          </Typography>
        ),
      },
      ...columns,
    ],
    [columns, pagination.pageIndex, pagination.pageSize]
  );

  const sortedData =
    sorting.length === 0
      ? data
      : [...data].sort((a, b) => {
          const sort = sorting[0];
          const aVal = a[sort.id] ?? '';
          const bVal = b[sort.id] ?? '';
          if (sort.desc) return aVal < bVal ? 1 : -1;
          return aVal > bVal ? 1 : -1;
        });

  const paginatedData = sortedData.slice(
    pagination.pageIndex * pagination.pageSize,
    pagination.pageIndex * pagination.pageSize + pagination.pageSize
  );

  const table = useMaterialReactTable({
    columns: numberedColumns,
    data: paginatedData,
    getRowId,
    rowCount: sortedData.length,
    state: {
      pagination,
      sorting,
    },
    initialState: {
      density: 'compact',
    },
    enableRowNumbers: false,
    enableRowActions: Boolean(renderRowActions),
    enableSorting: true,
    enableEditing: false,
    enablePagination: false,
    enableColumnFilters: false,
    enableColumnActions: false,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableHiding: false,
    enableTopToolbar: false,
    manualPagination: true,
    manualSorting: true,
    autoResetPageIndex: false,
    positionActionsColumn: 'last',
    onSortingChange: setSorting,
    muiTableHeadCellProps: {
      sx: {
        fontSize: '12px !important',
        px: 2.5,
        backgroundColor: 'rgba(248, 249, 250, 1)',
        borderTop: '1px solid rgba(232, 235, 238, 1) !important',
        borderBottom: '2px solid rgba(232, 235, 238, 1) !important',
        color: '#6b7280',
        textTransform: 'uppercase',
        '& .MuiTableSortLabel-icon, & .MuiIconButton-root, & .MuiBadge-root': {
          opacity: 0,
          transition: 'opacity 0.2s ease-in-out',
        },
        '&:hover .MuiTableSortLabel-icon, &:hover .MuiIconButton-root, &:hover .MuiBadge-root': {
          opacity: 1,
        },
        '& .MuiTableSortLabel-active .MuiTableSortLabel-icon': {
          opacity: 1,
        },
      },
    },
    muiTableBodyCellProps: {
      sx: {
        fontSize: '12px !important',
        px: 2.5,
        py: 1.6,
      },
    },
    muiTableBodyProps: {
      sx: {
        '& tr:nth-of-type(even)': {
          backgroundColor: 'rgba(248, 249, 250, 1) !important',
        },
      },
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        boxShadow: 'none',
      },
    },
    mrtTheme: () => ({
      baseBackgroundColor: 'rgba(255, 255, 255, 1)',
    }),
    displayColumnDefOptions: {
      rowNumber: {
        header: 'No',
        muiTableHeadCellProps: { align: 'left' },
        muiTableBodyCellProps: { align: 'left' },
      },
      ...(renderRowActions
        ? {
            'mrt-row-actions': {
              header: 'Aksi',
              muiTableHeadCellProps: { align: 'left' },
            },
          }
        : {}),
    },
    renderRowActions,
    renderEmptyRowsFallback: () => (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography sx={{ color: '#6b7280', fontSize: '0.9rem' }}>{emptyText}</Typography>
      </Box>
    ),
    renderBottomToolbar: () => (
      <TablePagination
        pageIndex={pagination.pageIndex}
        pageSize={pagination.pageSize}
        rowCount={sortedData.length}
        onPageChange={(pageIndex) => setPagination((prev) => ({ ...prev, pageIndex }))}
        onPageSizeChange={(pageSize) => setPagination({ pageIndex: 0, pageSize })}
        pageSizeOptions={pageSizeOptions}
      />
    ),
  });

  return (
    <Box sx={{ minWidth: 0, width: '100%', ...containerSx }}>
      <MaterialReactTable table={table} />
    </Box>
  );
}
