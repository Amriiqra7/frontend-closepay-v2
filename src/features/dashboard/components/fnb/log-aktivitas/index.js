'use client';

import React from 'react';
import { Box, Stack } from '@mui/material';
import { Add, DocumentUpload } from 'iconsax-react';
import PageIntro from '../common/PageIntro';
import ActionButton from '../add-ons-toppings/ActionButton';
import ActivityLogTable from './ActivityLogTable';
import ExpiredTrackingPanel from './ExpiredTrackingPanel';
import ProximityAlerts from './ProximityAlerts';

export default function FnbLogAktivitasPage() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <PageIntro
          title="Inventory Activity & Tracking"
          description="Monitoring stock movement and shelf-life compliance across central warehouses."
          maxWidth={720}
        />

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          <ActionButton icon={<DocumentUpload size={18} color="#111827" variant="Linear" />}>
            Export Report
          </ActionButton>
          <ActionButton icon={<Add size={18} color="#fff" variant="Bold" />} dark>
            New Entry
          </ActionButton>
        </Stack>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', xl: '280px minmax(0, 1fr)' },
          gap: 3,
          alignItems: 'start',
        }}
      >
        <ExpiredTrackingPanel />
        <ActivityLogTable />
      </Box>

      <ProximityAlerts />
    </Box>
  );
}
