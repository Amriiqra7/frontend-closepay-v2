'use client';

import React from 'react';
import { Box, Chip, Typography } from '@mui/material';
import SurfaceCard from '../../common/SurfaceCard';
import { proximityAlerts } from './data';

function ProximityCard({ item }) {
  const expired = item.badge.toLowerCase() === 'expired';

  return (
    <SurfaceCard sx={{ p: 1.25 }}>
      <Box
        sx={{
          height: 96,
          borderRadius: 1.5,
          bgcolor: '#eef2f6',
          position: 'relative',
          overflow: 'hidden',
          mb: 1.25,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              'repeating-linear-gradient(45deg, rgba(15,23,42,0.16) 0 6px, rgba(15,23,42,0.03) 6px 12px)',
          }}
        />
        <Chip
          label={item.badge}
          size="small"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            height: 22,
            bgcolor: expired ? '#ffd8d8' : '#eef2f6',
            color: expired ? '#b42318' : '#6b7280',
            fontWeight: 800,
            fontSize: '0.6rem',
            textTransform: 'uppercase',
          }}
        />
      </Box>
      <Typography sx={{ color: '#111827', fontSize: '0.84rem', fontWeight: 700 }}>
        {item.name}
      </Typography>
      <Typography sx={{ mt: 0.35, color: '#9ca3af', fontSize: '0.7rem' }}>
        {item.meta}
      </Typography>
      <Typography sx={{ mt: 0.2, color: '#6b7280', fontSize: '0.72rem' }}>
        {item.date}
      </Typography>
    </SurfaceCard>
  );
}

export default function ProximityAlerts() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
        <Typography sx={{ color: '#111827', fontSize: '1rem', fontWeight: 800 }}>
          Warehouse Proximity Alerts
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', xl: 'repeat(4, minmax(0, 1fr))' },
          gap: 1.5,
          mb: 2
        }}
      >
        {proximityAlerts.map((item) => (
          <ProximityCard key={item.name} item={item} />
        ))}
      </Box>
    </Box>
  );
}
