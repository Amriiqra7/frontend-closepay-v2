'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import { integrityStats } from './data';

function StatMiniCard({ item }) {
  const Icon = item.icon;

  return (
    <Box
      sx={{
        borderRadius: 2.5,
        bgcolor: 'rgba(255,255,255,0.12)',
        border: '1px solid rgba(255,255,255,0.06)',
        px: 2.25,
        py: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
      }}
    >
      <Box
        sx={{
          width: 42,
          height: 42,
          borderRadius: 1.8,
          bgcolor: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon size={20} color="#155DFC" variant="Bold" />
      </Box>
      <Box>
        <Typography sx={{ color: 'rgba(230, 241, 246, 0.82)', fontSize: '0.84rem' }}>
          {item.label}
        </Typography>
        <Typography sx={{ color: '#ffffff', fontSize: '1.05rem', fontWeight: 800 }}>
          {item.value}
        </Typography>
      </Box>
    </Box>
  );
}

export default function IntegrityPanel() {
  return (
    <Box
      sx={{
        p: 3.5,
        borderRadius: 3,
        minHeight: '100%',
        border: '1px solid rgba(8, 47, 73, 0.28)',
        background:
          'radial-gradient(circle at 50% 40%, rgba(24, 114, 138, 0.26), transparent 45%), linear-gradient(180deg, #063949 0%, #0a4a5d 100%)',
        boxShadow: '0 22px 48px rgba(2, 24, 34, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 3,
      }}
    >
      <Box>
        <Typography sx={{ color: '#ffffff', fontSize: '1.75rem', fontWeight: 800, lineHeight: 1.12 }}>
          Inventory Integrity
        </Typography>
        <Typography sx={{ mt: 1.5, color: 'rgba(230, 241, 246, 0.82)', fontSize: '1rem', lineHeight: 1.55 }}>
          Regular stock opname ensures financial accuracy and minimizes waste in the culinary supply chain.
        </Typography>
      </Box>

      <Box sx={{ display: 'grid', gap: 1.75 }}>
        {integrityStats.map((item) => (
          <StatMiniCard key={item.label} item={item} />
        ))}
      </Box>
    </Box>
  );
}
