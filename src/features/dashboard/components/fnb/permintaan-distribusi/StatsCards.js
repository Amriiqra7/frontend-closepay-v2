'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import SurfaceCard from '../common/SurfaceCard';
import { distributionStats } from './data';

function StatCard({ stat }) {
  return (
    <SurfaceCard sx={{ p: 2.25, borderLeft: `4px solid ${stat.tone}` }}>
      <Typography sx={{ color: '#6b7280', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        {stat.label}
      </Typography>
      <Box sx={{ mt: 1.2, display: 'flex', justifyContent: 'space-between', gap: 1.5, alignItems: 'center' }}>
        <Typography sx={{ color: '#111827', fontSize: '2rem', fontWeight: 800, lineHeight: 1 }}>
          {stat.value}
        </Typography>
        <Box sx={{ width: 18, height: 18, borderRadius: '50%', bgcolor: stat.accent }} />
      </Box>
    </SurfaceCard>
  );
}

export default function StatsCards() {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', xl: 'repeat(4, minmax(0, 1fr))' },
        gap: 2,
      }}
    >
      {distributionStats.map((stat) => (
        <StatCard key={stat.label} stat={stat} />
      ))}
    </Box>
  );
}
