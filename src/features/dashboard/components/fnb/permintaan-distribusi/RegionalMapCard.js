'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import SurfaceCard from '../common/SurfaceCard';

export default function RegionalMapCard() {
  return (
    <SurfaceCard sx={{ p: 2.5, bgcolor: '#f3f4f6' }}>
      <Typography sx={{ color: '#111827', fontSize: '1.05rem', fontWeight: 800 }}>
        Regional Map
      </Typography>

      <Box
        sx={{
          mt: 2,
          height: 278,
          borderRadius: 2,
          bgcolor: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            width: 210,
            height: 230,
            bgcolor: '#3f3f46',
            clipPath: 'polygon(30% 0%, 62% 8%, 88% 28%, 100% 58%, 86% 100%, 40% 94%, 12% 72%, 0% 38%)',
            opacity: 0.9,
          }}
        />
      </Box>

      <Box sx={{ mt: 1.6, display: 'flex', justifyContent: 'space-between', gap: 1.5, alignItems: 'center' }}>
        <Typography sx={{ color: '#111827', fontSize: '0.84rem', fontWeight: 700 }}>
          6 Active Hubs
        </Typography>
        <Typography sx={{ color: '#0d4f63', fontSize: '0.84rem', fontWeight: 700 }}>
          Expand View
        </Typography>
      </Box>
    </SurfaceCard>
  );
}
