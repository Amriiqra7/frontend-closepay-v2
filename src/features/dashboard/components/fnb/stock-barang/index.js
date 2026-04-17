'use client';

import React from 'react';
import { Box, Stack } from '@mui/material';
import { Add, Shop } from 'iconsax-react';
import ActionButton from '../add-ons-toppings/ActionButton';
import FilterBar from './FilterBar';
import InventoryTable from './InventoryTable';
import StatsRow from './StatsRow';

export default function FnbStockBarangPage() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 480px' }, minWidth: 0 }}>
          <FilterBar />
        </Box>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ ml: { md: 'auto' } }}>
          <ActionButton icon={<Shop size={18} color="#111827" variant="Linear" />}>
            New Warehouse
          </ActionButton>
          <ActionButton icon={<Add size={18} color="#fff" variant="Bold" />} dark>
            New Item
          </ActionButton>
        </Stack>
      </Box>

      <StatsRow />
      <InventoryTable />
    </Box>
  );
}
