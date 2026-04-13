'use client';

import React from 'react';
import { Box, Stack } from '@mui/material';
import { Add, Filter } from 'iconsax-react';
import PageIntro from '../common/PageIntro';
import ActionButton from '../add-ons-toppings/ActionButton';
import OptimizationPanel from './OptimizationPanel';
import RegionalMapCard from './RegionalMapCard';
import RequestsTable from './RequestsTable';
import StatsCards from './StatsCards';

export default function FnbPermintaanDistribusiPage() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <PageIntro
          title="Distribution Requests"
          description="Manage and process logistics requests from active outlets."
          maxWidth={680}
        />

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          <ActionButton icon={<Filter size={18} color="#111827" variant="Linear" />}>
            Filter
          </ActionButton>
          <ActionButton icon={<Add size={18} color="#fff" variant="Bold" />} dark>
            New Distribution
          </ActionButton>
        </Stack>
      </Box>

      <StatsCards />
      <RequestsTable />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', xl: 'minmax(0, 2fr) 320px' },
          gap: 3,
          alignItems: 'start',
          mb: 2,
        }}
      >
        <OptimizationPanel />
        <RegionalMapCard />
      </Box>
    </Box>
  );
}
