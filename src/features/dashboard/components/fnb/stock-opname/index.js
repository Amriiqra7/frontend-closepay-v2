'use client';

import React from 'react';
import { Box } from '@mui/material';
import HistoryTable from './HistoryTable';
import IntegrityPanel from './IntegrityPanel';
import StockOpnameForm from './StockOpnameForm';

export default function FnbStockOpnamePage() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', xl: 'minmax(0, 2.2fr) 340px' },
          gap: 3,
          alignItems: 'stretch',
        }}
      >
        <StockOpnameForm />
        <IntegrityPanel />
      </Box>

      <HistoryTable />
    </Box>
  );
}
