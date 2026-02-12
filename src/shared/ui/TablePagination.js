'use client';

import React from 'react';
import { Box, Typography, Pagination, Select, MenuItem, FormControl } from '@mui/material';

export default function TablePagination({
  pageIndex,
  pageSize,
  rowCount,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
}) {
  const totalPages = Math.ceil(rowCount / pageSize) || 1;
  const start = pageIndex * pageSize + 1;
  const end = Math.min((pageIndex + 1) * pageSize, rowCount);

  const handlePageChange = (event, value) => {
    onPageChange(value - 1); // Material UI Pagination is 1-based, but we use 0-based
  };

  return (
    <Box
      sx={{
        p: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2,
      }}
    >
      <Typography variant="body2" sx={{ color: '#666' }}>
        Menampilkan {start}-{end} dari {rowCount}
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            displayEmpty
          >
            {pageSizeOptions.map((size) => (
              <MenuItem key={size} value={size}>
                {size}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Pagination
          count={totalPages}
          page={pageIndex + 1} // Material UI Pagination is 1-based
          onChange={handlePageChange}
          color="primary"
          showFirstButton
          showLastButton
          shape="rounded"
        />
      </Box>
    </Box>
  );
}
