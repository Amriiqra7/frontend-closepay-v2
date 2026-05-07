'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import SurfaceCard from '../../common/SurfaceCard';
import { expiredTrackingItems } from './data';

export default function ExpiredTrackingPanel() {
  return (
    <SurfaceCard sx={{ p: 2.5 }}>
      <Typography sx={{ color: '#111827', fontSize: '1rem', fontWeight: 800, mb: 2 }}>
        Expired Tracking
      </Typography>

      <Box sx={{ display: 'grid', gap: 1.25 }}>
        {expiredTrackingItems.map((item) => (
          <Box
            key={item.title}
            sx={{
              p: 1.5,
              borderRadius: 2,
              border: item.highlight ? '1px solid #fecaca' : '1px solid #eef2f6',
              bgcolor: item.highlight ? '#fff6f5' : '#f8fafc',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1.5, alignItems: 'center' }}>
              <Typography sx={{ color: item.highlight ? '#d92d20' : '#111827', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {item.title}
              </Typography>
              <Typography sx={{ color: item.highlight ? '#d92d20' : '#374151', fontSize: '0.88rem', fontWeight: 800 }}>
                {item.value}
              </Typography>
            </Box>
            {item.description ? (
              <Typography sx={{ mt: 0.9, color: '#6b7280', fontSize: '0.76rem', lineHeight: 1.5 }}>
                {item.description}
              </Typography>
            ) : null}
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          mt: 2,
          height: 118,
          borderRadius: 2,
          bgcolor: '#f3f6f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography sx={{ color: '#9aa5b1', fontSize: '0.74rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Expiration Trend Analysis
        </Typography>
      </Box>
    </SurfaceCard>
  );
}
