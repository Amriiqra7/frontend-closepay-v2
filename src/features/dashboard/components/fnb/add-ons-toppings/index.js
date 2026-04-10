'use client';

import React from 'react';
import { Box, Stack } from '@mui/material';
import { AddCircle, Filter } from 'iconsax-react';
import ActionButton from './ActionButton';
import PageIntro from '../common/PageIntro';
import GroupOptionCard from './GroupOptionCard';
import RiceOptionsCard from './RiceOptionsCard';
import StatsSidebar from './StatsSidebar';
import { addOnGroups } from './data';

export default function FnbAddOnsToppingsPage() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <PageIntro
          title="Add-Ons & Toppings"
          description="Manage secondary ingredients, customizable toppings, and optional add-ons. Changes here sync globally across all menus."
        />

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <ActionButton icon={<Filter size={18} color="#111827" variant="Linear" />}>
            Filter
          </ActionButton>
          <ActionButton icon={<AddCircle size={18} color="#fff" variant="Bold" />} dark>
            Create New Group
          </ActionButton>
        </Stack>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', xl: 'minmax(0, 2fr) 360px' },
          gap: 3,
          alignItems: 'stretch',
        }}
      >
        <RiceOptionsCard />
        <StatsSidebar />
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', xl: 'repeat(2, minmax(0, 1fr))' },
          gap: 3,
          alignItems: 'start',
          mb: 2,
        }}
      >
        {addOnGroups.map((group) => (
          <GroupOptionCard key={group.title} group={group} />
        ))}
      </Box>
    </Box>
  );
}
