'use client';

import React from 'react';
import { Box, Stack } from '@mui/material';
import { Add } from 'iconsax-react';
import ActionButton from '../add-ons-toppings/ActionButton';
import FnbFilterCollapse from '../common/FnbFilterCollapse';
import OptimizationPanel from './OptimizationPanel';
import RequestsTable from './RequestsTable';
import StatsCards from './StatsCards';

export default function FnbPermintaanDistribusiPage() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          <FnbFilterCollapse buttonText="Filter" searchPlaceholder="Request ID or outlet..." />
          <ActionButton icon={<Add size={18} color="#fff" variant="Bold" />} dark>
            New Distribution
          </ActionButton>
        </Stack>
      </Box>

      <StatsCards />
      <RequestsTable />

      <Box
        sx={{
          mb: 2,
        }}
      >
        <OptimizationPanel />
      </Box>
    </Box>
  );
}
