'use client';

import React from 'react';
import { Box, Chip, Typography } from '@mui/material';
import SurfaceCard from '../common/SurfaceCard';
import { stockStats } from './data';

function StatCard({ stat }) {
  return (
    <SurfaceCard sx={{ p: 2.25 }}>
      <Typography sx={{ color: '#6b7280', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        {stat.label}
      </Typography>
      <Box sx={{ mt: 1.1, display: 'flex', justifyContent: 'space-between', gap: 1.5, alignItems: 'center' }}>
        <Typography sx={{ color: stat.tone, fontSize: '2rem', fontWeight: 800, lineHeight: 1 }}>
          {stat.value}
        </Typography>
        <Chip
          label={stat.hint}
          size="small"
          sx={{
            bgcolor: stat.accent,
            color: stat.tone,
            fontWeight: 800,
            fontSize: '0.68rem',
          }}
        />
      </Box>
    </SurfaceCard>
  );
}

export default function StatsRow() {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', xl: 'repeat(4, minmax(0, 1fr))' },
        gap: 2,
      }}
    >
      {stockStats.map((stat) => (
        <StatCard key={stat.label} stat={stat} />
      ))}
    </Box>
  );
}
