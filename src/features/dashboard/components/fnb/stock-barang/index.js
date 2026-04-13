'use client';

import React from 'react';
import { Box, Stack } from '@mui/material';
import { Add, Shop } from 'iconsax-react';
import PageIntro from '../common/PageIntro';
import ActionButton from '../add-ons-toppings/ActionButton';
import FilterBar from './FilterBar';
import InventoryTable from './InventoryTable';
import StatsRow from './StatsRow';

export default function FnbStockBarangPage() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <PageIntro
          title="Central Inventory"
          description="Live status of stock distribution and procurement at Central Warehouse."
          maxWidth={680}
        />

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          <ActionButton icon={<Shop size={18} color="#111827" variant="Linear" />}>
            New Warehouse
          </ActionButton>
          <ActionButton icon={<Add size={18} color="#fff" variant="Bold" />} dark>
            New Item
          </ActionButton>
        </Stack>
      </Box>

      <FilterBar />
      <StatsRow />
      <InventoryTable />
    </Box>
  );
}
