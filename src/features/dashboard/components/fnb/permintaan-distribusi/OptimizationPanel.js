'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import SurfaceCard from '../common/SurfaceCard';
import { optimizationStats } from './data';

export default function OptimizationPanel() {
  return (
    <SurfaceCard sx={{ p: 3.25, bgcolor: '#155DFC', color: '#fff' }}>
      <Typography sx={{ color: '#ffffff', fontSize: '1.15rem', fontWeight: 800 }}>
        Warehouse Optimization
      </Typography>
      <Typography sx={{ mt: 1.2, color: 'rgba(255,255,255,0.8)', fontSize: '0.96rem', lineHeight: 1.6, maxWidth: 560 }}>
        Currently monitoring WH-North Jakarta. Logistics throughput is at 94% efficiency with zero reported delays in the last 24 hours.
      </Typography>

      <Box
        sx={{
          mt: 3,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, minmax(0, 1fr))' },
          gap: 2,
        }}
      >
        {optimizationStats.map((stat) => (
          <Box
            key={stat.label}
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
            }}
          >
            <Typography sx={{ color: 'rgba(255,255,255,0.72)', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {stat.label}
            </Typography>
            <Typography sx={{ mt: 0.8, color: '#ffffff', fontSize: '1.9rem', fontWeight: 800, lineHeight: 1 }}>
              {stat.value}
            </Typography>
            <Typography sx={{ mt: 0.5, color: '#7dd3fc', fontSize: '0.82rem', fontWeight: 700 }}>
              {stat.hint}
            </Typography>
          </Box>
        ))}
      </Box>
    </SurfaceCard>
  );
}
